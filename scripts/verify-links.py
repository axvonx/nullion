#!/usr/bin/env python3
"""Check the proposed reference links (design/links/proposed/<id>.json, design/links/run.sh) and write the ones that
work to bank/links/<id>.json, which the end card's answer sheet uses.

Usage: python3 -I scripts/verify-links.py [<category id> ...]

A link ships only if:
  - it is on en.wikipedia.org and the REST API says the article exists and is not a disambiguation page, or
  - its host is on the reputable-docs allowlist (HOSTS) and it answers HTTP 200 (FreeBSD man.cgi answers 200 even for
    a missing page, so its body is checked too).
Links on other hosts are not fetched: they are listed for review and left out. Every answer name must exist in the
category's batch (design/links/batches/<id>.json); anything else is an error. Results are cached in
design/links/check-cache.json so re-runs only fetch new URLs.
"""
import concurrent.futures
import glob
import json
import pathlib
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
LINKS = ROOT / "design" / "links"
OUT = ROOT / "bank" / "links"
CACHE = LINKS / "check-cache.json"
UA = "nullion-link-check/0.1 (static trivia game; reference link verification)"
HOSTS = {
    "man.freebsd.org", "man.openbsd.org", "man.netbsd.org", "man7.org", "docs.kernel.org", "www.kernel.org",
    "kernel.org", "learn.microsoft.com", "www.rfc-editor.org", "datatracker.ietf.org", "developer.mozilla.org",
    "docs.python.org", "en.cppreference.com", "www.postgresql.org", "git-scm.com", "kubernetes.io", "docs.oracle.com",
    "github.com", "www.gnu.org", "docs.rs", "doc.rust-lang.org", "go.dev", "pkg.go.dev", "www.sqlite.org",
    "spdx.org", "opensource.org", "csrc.nist.gov", "www.iana.org", "riscv.org", "www.khronos.org",
}


class Throttled(Exception):
    """The host kept answering 429/5xx: the link is unchecked, not broken."""


def fetch(url: str) -> tuple[int, bytes]:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(6):
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                return r.status, r.read(200_000)
        except urllib.error.HTTPError as e:
            if e.code != 429 and e.code < 500:
                return e.code, b""
            time.sleep(2 ** attempt + (float(e.headers.get("Retry-After") or 0)))
    raise Throttled(url)


def check(url: str) -> str:
    """'ok', or why the link is dropped ('review: …' when it was not fetched)."""
    u = urllib.parse.urlsplit(url)
    if u.scheme != "https":
        return "not https"
    if u.netloc == "en.wikipedia.org":
        if not u.path.startswith("/wiki/") or "Special:" in u.path:
            return "not an article URL"
        title = u.path[len("/wiki/"):]
        code, body = fetch(f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}?redirect=true")
        if code != 200:
            return f"wikipedia {code}"
        kind = json.loads(body).get("type")
        return "ok" if kind == "standard" else f"wikipedia {kind}"
    if u.netloc not in HOSTS:
        return f"review: host {u.netloc} not on the allowlist"
    code, body = fetch(url)
    if code != 200:
        return f"http {code}"
    if u.netloc == "man.freebsd.org" and (b"Sorry, no data found" in body or b"No manual entry" in body):
        return "freebsd: no such man page"
    return "ok"


def main() -> None:
    ids = sys.argv[1:] or sorted(pathlib.Path(f).stem for f in glob.glob(str(LINKS / "proposed" / "*.json")))
    cache: dict[str, str] = json.loads(CACHE.read_text()) if CACHE.exists() else {}
    props = {}
    for cid in ids:
        batch = json.loads((LINKS / "batches" / f"{cid}.json").read_text())
        names = {a["name"] for a in batch["answers"]}
        p = json.loads((LINKS / "proposed" / f"{cid}.json").read_text())
        unknown = set(p["answers"]) - names
        if unknown:
            raise SystemExit(f"{cid}: proposed links for answers not in the bank: {sorted(unknown)[:5]}")
        props[cid] = p
    urls = {u for p in props.values() for u in [p.get("prompt"), *p["answers"].values()] if u} - set(cache)
    unchecked = []

    def safe(url: str) -> str | None:
        try:
            return check(url)
        except Throttled:
            return None

    with concurrent.futures.ThreadPoolExecutor(3) as ex:
        for url, verdict in zip(urls, ex.map(safe, urls)):
            if verdict is None:
                unchecked.append(url)
            else:
                cache[url] = verdict
    CACHE.write_text(json.dumps(cache, indent=1, sort_keys=True) + "\n")
    if unchecked:
        raise SystemExit(f"{len(unchecked)} links could not be checked (throttled); the cache kept the rest, re-run later")

    OUT.mkdir(parents=True, exist_ok=True)
    review, dropped, total_ok, total = [], {}, 0, 0
    for cid, p in props.items():
        good = {}
        for name, url in p["answers"].items():
            total += 1
            if not url:
                continue
            v = cache[url]
            if v == "ok":
                good[name] = url
            elif v.startswith("review"):
                review.append(f"{cid} · {name} · {url}")
            else:
                dropped[v] = dropped.get(v, 0) + 1
        prompt = p.get("prompt") if p.get("prompt") and cache[p["prompt"]] == "ok" else None
        total_ok += len(good)
        (OUT / f"{cid}.json").write_text(json.dumps({"prompt": prompt, "answers": dict(sorted(good.items()))}, indent=1) + "\n")
    (LINKS / "review.txt").write_text("\n".join(sorted(review)) + "\n")
    print(f"{total_ok}/{total} answers linked across {len(props)} categories")
    print(f"dropped as broken: {dropped}")
    print(f"{len(review)} links on other hosts left out → design/links/review.txt")


if __name__ == "__main__":
    main()
