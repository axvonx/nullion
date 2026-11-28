#!/usr/bin/env python3
"""Fetch the structured datasets for source-first categories into ~/nullion-corpora. Stdlib only.

Usage: python3 -I scripts/fetch-corpora.py [source ...]      (no arguments: every source)
Sources:
  debian         Packages (debtags `Tag:` field, descriptions), Contents (package -> files: binary names), popcon
                 install counts. debian/
  homebrew       formula and cask lists, 365-day install analytics. homebrew/
  stackexchange  tags with question counts and tag synonyms (aliases) for Stack Overflow, Unix & Linux, Server
                 Fault and Super User. Stack Overflow's tags come from the archive.org dump (one small file); the
                 others' tags and every site's synonyms from the API, which allows ~300 requests a day without a
                 key: a run that would exceed the quota stops loudly and the next run continues. stackexchange/

Each file lands next to a <name>.source.json saying where and when it came from. A file that is already there is
kept (delete it to refetch). Every failure raises: a partial download is removed, never left looking complete.
Requests carry a generic client name and nothing about the user.
"""
import gzip
import json
import pathlib
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone

CORPORA = pathlib.Path("~/nullion-corpora").expanduser()
UA = "nullion-corpora/0.1 (static computing-trivia game; structured answer sources)"
SE_SITES = ["stackoverflow", "unix", "serverfault", "superuser"]
SE_API = "https://api.stackexchange.com/2.3"
SE_MAX_PAGES = 25  # without an app key the API refuses page 26+ ("page above 25 requires access token or app key")


def stamp(path: pathlib.Path, url: str, note: str = "") -> None:
    meta = {"url": url, "fetched": datetime.now(timezone.utc).isoformat(timespec="seconds"), "bytes": path.stat().st_size}
    if note:
        meta["note"] = note
    path.with_name(path.name + ".source.json").write_text(json.dumps(meta, indent=1) + "\n")


def download(url: str, dest: pathlib.Path) -> bool:
    """Fetch url to dest (atomically). False if dest already exists."""
    if dest.exists():
        print(f"  have {dest.relative_to(CORPORA)}")
        return False
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_name(dest.name + ".part")
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=600) as r, tmp.open("wb") as f:
            shutil.copyfileobj(r, f, 1 << 20)
    except BaseException:
        tmp.unlink(missing_ok=True)
        raise
    tmp.replace(dest)
    stamp(dest, url)
    print(f"  got  {dest.relative_to(CORPORA)} ({dest.stat().st_size / 1e6:.1f} MB, {time.time() - t0:.0f}s)")
    return True


def fetch_debian() -> None:
    base = "https://deb.debian.org/debian/dists/stable/main"
    d = CORPORA / "debian"
    download(f"{base}/binary-amd64/Packages.xz", d / "Packages.xz")
    download(f"{base}/Contents-amd64.gz", d / "Contents-amd64.gz")
    download("https://popcon.debian.org/by_inst.gz", d / "popcon-by_inst.gz")


def fetch_homebrew() -> None:
    d = CORPORA / "homebrew"
    api = "https://formulae.brew.sh/api"
    download(f"{api}/formula.json", d / "formula.json")
    download(f"{api}/cask.json", d / "cask.json")
    download(f"{api}/analytics/install/365d.json", d / "analytics-formula-install-365d.json")
    download(f"{api}/analytics/cask-install/365d.json", d / "analytics-cask-install-365d.json")


class QuotaExhausted(RuntimeError):
    pass


def se_pages(path: str, site: str, out: pathlib.Path, params: dict) -> None:
    """Every page of a Stack Exchange API listing into out (JSON list of items). Resumable per file only."""
    if out.exists():
        print(f"  have {out.relative_to(CORPORA)}")
        return
    items, page, truncated = [], 1, False
    while True:
        q = urllib.parse.urlencode({**params, "site": site, "pagesize": 100, "page": page})
        req = urllib.request.Request(f"{SE_API}{path}?{q}", headers={"User-Agent": UA, "Accept-Encoding": "gzip"})
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                raw = r.read()
        except urllib.error.HTTPError as e:  # the API explains itself in the body
            raw = e.read()
            raise RuntimeError(f"Stack Exchange API {path} {site} page {page}: HTTP {e.code}: "
                               f"{(gzip.decompress(raw) if raw[:2] == b'\x1f\x8b' else raw).decode(errors='replace')[:300]}") from e
        body = json.loads(gzip.decompress(raw) if raw[:2] == b"\x1f\x8b" else raw)
        if "error_id" in body:
            raise RuntimeError(f"Stack Exchange API {path} {site}: {body.get('error_name')}: {body.get('error_message')}")
        items += body["items"]
        if body.get("quota_remaining", 1) < 5:
            raise QuotaExhausted(f"Stack Exchange API quota nearly spent ({body.get('quota_remaining')} left) while "
                                 f"fetching {out.name}: rerun tomorrow; finished files are kept")
        if body.get("backoff"):
            time.sleep(int(body["backoff"]) + 1)
        if not body.get("has_more"):
            break
        if page == SE_MAX_PAGES:
            truncated = True
            break
        page += 1
        time.sleep(0.4)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(items, ensure_ascii=False) + "\n")
    note = f"{len(items)} items, {page} pages" + (
        f"; TRUNCATED: the first {SE_MAX_PAGES * 100} in {params.get('sort')} order (an app key lifts the cap)" if truncated else "")
    stamp(out, f"{SE_API}{path}?site={site}&sort={params.get('sort')}", note)
    print(f"  got  {out.relative_to(CORPORA)} ({note})")


def fetch_stackexchange() -> None:
    d = CORPORA / "stackexchange"
    # Stack Overflow has ~65k tags (650 API pages, over the daily quota): its dump's Tags file is small.
    sz = d / "stackoverflow-Tags.7z"
    download("https://archive.org/download/stackexchange/stackoverflow.com-Tags.7z", sz)
    xml = d / "stackoverflow-Tags.xml"
    if not xml.exists():
        subprocess.run(["7zz", "e", "-y", f"-o{d}", str(sz), "Tags.xml"], check=True, capture_output=True)
        (d / "Tags.xml").replace(xml)
        stamp(xml, "extracted from stackoverflow-Tags.7z (archive.org stackexchange dump)")
        print(f"  got  {xml.relative_to(CORPORA)}")
    for site in SE_SITES:
        se_pages("/tags/synonyms", site, d / f"{site}-tag-synonyms.json", {"order": "desc", "sort": "applied"})
    for site in SE_SITES[1:]:
        se_pages("/tags", site, d / f"{site}-tags.json", {"order": "desc", "sort": "popular"})


SOURCES = {"debian": fetch_debian, "homebrew": fetch_homebrew, "stackexchange": fetch_stackexchange}


def main() -> int:
    want = sys.argv[1:] or list(SOURCES)
    bad = [w for w in want if w not in SOURCES]
    if bad:
        raise SystemExit(f"unknown source(s) {bad}; known: {list(SOURCES)}")
    failed = []
    for name in want:
        print(f"[{name}]", flush=True)
        try:
            SOURCES[name]()
        except (urllib.error.URLError, RuntimeError, subprocess.CalledProcessError, OSError) as e:
            print(f"  FAILED: {e}", file=sys.stderr)
            failed.append(name)
    if failed:
        print(f"FAILED sources: {failed}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
