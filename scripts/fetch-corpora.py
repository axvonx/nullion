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
  repology       the daily PostgreSQL dump (~2.6 GB .sql.zst, kept) and gzipped TSV extracts of its packages
                 (repo, names, category, summary) and metapackages (repo and family counts) tables. repology/
  wikidata       per-class SPARQL extracts (label, English aliases, sitelinks, enwiki title, P31 type labels) for
                 WD_CLASSES; each QID's label is checked first. Sequential, paced, Retry-After honoured. wikidata/
  kernel-src     shallow blob-less sparse clone of torvalds/linux: mm/kernel/fs/block/init/lib/net *.c (kernel
                 threads) plus registry headers and every Kconfig* (KERNEL_SRC_PATTERNS). kernel/linux-src/
  freebsd-daemons sparse clone of freebsd-src: libexec/rc/rc.d and the usr.sbin/libexec section-8 pages.
                 src/freebsd-daemons/
  macos          this Mac's /System/Library/LaunchDaemons and LaunchAgents: label and program per plist.
                 macos/

Each file lands next to a <name>.source.json (a clone: its DONE file) saying where and when it came from. A file that is already there is
kept (delete it to refetch). Every failure raises: a partial download is removed, never left looking complete.
Requests carry a generic client name and nothing about the user.
"""
import gzip
import os
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
# An app key (not a secret, per Stack Exchange; kept out of the repo anyway) lifts the 25-page cap and raises the
# daily quota from 300 to 10,000 requests: NULLION_SE_KEY, or the file ~/.config/nullion/stackexchange-key.
_KEY_FILE = pathlib.Path("~/.config/nullion/stackexchange-key").expanduser()
SE_KEY = os.environ.get("NULLION_SE_KEY") or (_KEY_FILE.read_text().strip() if _KEY_FILE.exists() else "")
SE_MAX_PAGES = 10_000 if SE_KEY else 25  # without a key the API refuses page 26+


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
        q = urllib.parse.urlencode({**params, "site": site, "pagesize": 100, "page": page, **({"key": SE_KEY} if SE_KEY else {})})
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


WDQS = "https://query.wikidata.org/sparql"
# (file slug, QID, its English label). The label is checked against Wikidata before the class is queried: a wrong
# QID (docs/research/answer-games-and-aliases.md §3.1 found two) fails loudly instead of fetching the wrong class.
WD_CLASSES = [
    ("text-editor", "Q131212", "text editor"),
    ("source-code-editor", "Q522972", "source code editor"),
    ("line-editor", "Q184900", "line editor"),
    ("daemon", "Q308980", "daemon"),
    ("init", "Q261918", "init"),
    ("web-server", "Q11288", "web server"),
    ("message-transfer-agent", "Q859477", "message transfer agent"),
    ("name-server", "Q41494", "name server"),
    ("dbms", "Q176165", "database management system"),
    ("compiler", "Q47506", "compiler"),
    ("game-engine", "Q193564", "game engine"),
    ("operating-system", "Q9135", "operating system"),
    ("file-system", "Q174989", "file system"),
    ("programming-language", "Q9143", "programming language"),
    ("instruction-set-architecture", "Q272683", "instruction set architecture"),
    ("map-projection", "Q186386", "map projection"),
    ("block-cipher", "Q543151", "block cipher"),
    ("cryptographic-hash-function", "Q477202", "cryptographic hash function"),
    ("sorting-algorithm", "Q181593", "sorting algorithm"),
    ("data-structure", "Q175263", "data structure"),
]
# One query for every missing class (WDQS answered this machine's second query in a run with a 1,000 s
# Retry-After, so the fetch asks once): the class's own English label comes back with its items and is checked.
WD_QUERY = """SELECT ?cls ?cl ?i ?label ?sl ?enwiki (GROUP_CONCAT(DISTINCT ?alias; separator="\\t") AS ?aliases)
       (GROUP_CONCAT(DISTINCT ?tl; separator="\\t") AS ?types) WHERE {
  VALUES ?cls { %s }
  ?cls rdfs:label ?cl FILTER(LANG(?cl) = "en")
  ?i wdt:P31/wdt:P279* ?cls .
  ?i wikibase:sitelinks ?sl .
  OPTIONAL { ?i rdfs:label ?label FILTER(LANG(?label) = "en") }
  OPTIONAL { ?i skos:altLabel ?alias FILTER(LANG(?alias) = "en") }
  OPTIONAL { ?i wdt:P31 ?t . ?t rdfs:label ?tl FILTER(LANG(?tl) = "en") }
  OPTIONAL { ?enwiki schema:about ?i ; schema:isPartOf <https://en.wikipedia.org/> }
} GROUP BY ?cls ?cl ?i ?label ?sl ?enwiki"""


def sparql(query: str) -> list[dict]:
    """One WDQS query, gently: sequential callers, a pause after every call, Retry-After honoured on 429/503."""
    data = urllib.parse.urlencode({"query": query}).encode()
    for attempt in range(6):
        req = urllib.request.Request(WDQS, data=data, headers={
            "User-Agent": UA, "Accept": "application/sparql-results+json",
            "Content-Type": "application/x-www-form-urlencoded"})
        try:
            with urllib.request.urlopen(req, timeout=300) as r:
                body = json.loads(r.read())
            time.sleep(3)
            return body["results"]["bindings"]
        except urllib.error.HTTPError as e:
            if e.code not in (429, 503) or attempt == 5:
                raise RuntimeError(f"Wikidata SPARQL: HTTP {e.code}: {e.read()[:300]!r}") from e
            wait = int(e.headers.get("Retry-After") or 30 * 2 ** attempt)
            print(f"  WDQS HTTP {e.code}: waiting {wait}s", flush=True)
            time.sleep(wait)
    raise AssertionError("unreachable")


def fetch_wikidata() -> None:
    d = CORPORA / "wikidata"
    out = {qid: d / f"class-{slug}-{qid}.json" for slug, qid, _ in WD_CLASSES}
    todo = [(slug, qid, label) for slug, qid, label in WD_CLASSES if not out[qid].exists()]
    for slug, qid, _ in WD_CLASSES:
        if out[qid].exists():
            print(f"  have {out[qid].relative_to(CORPORA)}")
    if not todo:
        return
    rows: dict[str, list[dict]] = {qid: [] for _, qid, _ in todo}
    labels: dict[str, str] = {}
    for b in sparql(WD_QUERY % " ".join(f"wd:{qid}" for _, qid, _ in todo)):
        v = lambda k: b[k]["value"] if k in b else None  # noqa: E731
        cls = v("cls").rsplit("/", 1)[1]
        labels[cls] = v("cl")
        rows[cls].append({"qid": v("i").rsplit("/", 1)[1], "label": v("label"), "sitelinks": int(v("sl")),
                          "enwiki": urllib.parse.unquote(v("enwiki").rsplit("/", 1)[1]).replace("_", " ") if v("enwiki") else None,
                          "aliases": sorted(filter(None, (v("aliases") or "").split("\t"))),
                          "types": sorted(filter(None, (v("types") or "").split("\t")))})
    for slug, qid, label in todo:
        if labels.get(qid) != label:
            raise RuntimeError(f"Wikidata {qid}: expected the label {label!r}, got {labels.get(qid)!r} "
                               "(no items, or the wrong class): fix WD_CLASSES")
    for slug, qid, label in todo:
        rs = sorted(rows[qid], key=lambda r: (-r["sitelinks"], r["qid"]))
        tmp = out[qid].with_name(out[qid].name + ".part")
        tmp.parent.mkdir(parents=True, exist_ok=True)
        tmp.write_text(json.dumps(rs, ensure_ascii=False, indent=0) + "\n")
        tmp.replace(out[qid])
        stamp(out[qid], f"{WDQS} (P31/P279* {qid} '{label}': label, en aliases, sitelinks, enwiki title, P31 type labels)",
              f"{len(rs)} items")
        print(f"  got  {out[qid].relative_to(CORPORA)} ({len(rs)} items)")


KERNEL_SRC_PATTERNS = [
    # kernel threads: the names passed to kthread_run/kthread_create (drivers/ and arch/ left out: thousands of
    # files whose threads are per-device helpers, not daemons anyone names)
    "/mm/**/*.c", "/kernel/**/*.c", "/fs/**/*.c", "/block/**/*.c", "/init/*.c", "/lib/*.c", "/net/**/*.c",
    "/include/linux/kthread.h",
    # registries for os-systems categories (syscalls, errnos, capabilities, CPU flags, ioctls/sockets/signals,
    # NVMe commands, ACPI tables, config options)
    "/arch/x86/entry/syscalls/", "/include/uapi/asm-generic/", "/include/uapi/linux/",
    "/arch/x86/include/asm/cpufeatures.h", "/arch/x86/include/uapi/asm/", "/include/linux/nvme.h",
    "/include/acpi/actbl*.h", "Kconfig*",
]


def sparse_clone(dest: pathlib.Path, url: str, patterns: list[str]) -> None:
    """A shallow, blob-less, sparse (non-cone) clone holding only `patterns`, built in <dest>.part and moved into
    place with a DONE stamp, so an interrupted clone never looks complete."""
    if (dest / "DONE").exists():
        print(f"  have {dest.relative_to(CORPORA)}")
        return
    tmp = dest.with_name(dest.name + ".part")
    shutil.rmtree(tmp, ignore_errors=True)
    git = lambda *a: subprocess.run(["git", *a], check=True, capture_output=True, text=True)  # noqa: E731
    try:
        git("clone", "--depth", "1", "--filter=blob:none", "--no-checkout", url, str(tmp))
        git("-C", str(tmp), "sparse-checkout", "set", "--no-cone", *patterns)
        git("-C", str(tmp), "checkout")
        head = git("-C", str(tmp), "log", "-1", "--format=%H %cI").stdout.strip()
    except BaseException:
        shutil.rmtree(tmp, ignore_errors=True)
        raise
    shutil.rmtree(dest, ignore_errors=True)
    tmp.replace(dest)
    files = sum(1 for p in dest.rglob("*") if p.is_file() and ".git" not in p.parts)
    size = sum(p.stat().st_size for p in dest.rglob("*") if p.is_file())
    (dest / "DONE").write_text(head + "\n")
    stamp(dest / "DONE", url, f"commit {head}; sparse {patterns}; {files} files, {size / 1e6:.0f} MB with .git")
    print(f"  got  {dest.relative_to(CORPORA)} ({files} files, {size / 1e6:.0f} MB, {head})")


def fetch_kernel_src() -> None:
    """Linux source for kernel threads and os-systems registries. The Documentation clone in kernel/linux
    (indexed by index-corpora.py) is a separate clone and left alone."""
    sparse_clone(CORPORA / "kernel" / "linux-src", "https://github.com/torvalds/linux.git", KERNEL_SRC_PATTERNS)


def fetch_freebsd_daemons() -> None:
    """FreeBSD base: rc.d scripts (each names its daemon's `command=`) and the usr.sbin / libexec man pages (whose
    `.Nd` line says "daemon" or "server")."""
    sparse_clone(CORPORA / "src" / "freebsd-daemons", "https://github.com/freebsd/freebsd-src.git",
                 ["/libexec/rc/rc.d/", "/usr.sbin/**/*.8", "/libexec/**/*.8"])


# What we keep of the Repology dump's tables (pg_dump COPY blocks), as gzipped TSV with a header row.
REPOLOGY_KEEP = {
    "repology.packages": ["repo", "family", "srcname", "binname", "binnames", "visiblename", "projectname_seed",
                          "effname", "category", "comment", "shadow"],
    "repology.metapackages": ["effname", "num_repos", "num_repos_nonshadow", "num_families"],
}


def repology_extract(dump: pathlib.Path, d: pathlib.Path) -> None:
    """Stream the dump once (zstd -dc) and write <table>.tsv.gz for REPOLOGY_KEEP. COPY rows are tab-separated with
    \\N for NULL and backslash escapes; values are kept as COPY wrote them (arrays as {a,b}). Every wanted table
    must be found and end with its `\\.` terminator, or nothing is written."""
    outs = {t: d / f"{t.split('.')[1]}.tsv.gz" for t in REPOLOGY_KEEP}
    if all(o.exists() for o in outs.values()):
        for o in outs.values():
            print(f"  have {o.relative_to(CORPORA)}")
        return
    tmps = {t: o.with_name(o.name + ".part") for t, o in outs.items()}
    counts, done = {t: 0 for t in outs}, set()
    proc = subprocess.Popen(["zstd", "-dc", str(dump)], stdout=subprocess.PIPE)
    files = {t: gzip.open(tmps[t], "wt", compresslevel=6) for t in outs}
    try:
        cur, idx = None, None
        for raw in proc.stdout:
            if cur is None:
                if raw.startswith(b"COPY "):
                    head = raw.decode()
                    table = head.split()[1]
                    if table in REPOLOGY_KEEP:
                        cols = [c.strip().strip('"') for c in head[head.index("(") + 1:head.index(")")].split(",")]
                        missing = [c for c in REPOLOGY_KEEP[table] if c not in cols]
                        if missing:
                            raise RuntimeError(f"Repology dump: {table} has no columns {missing} (schema changed)")
                        cur, idx = table, [cols.index(c) for c in REPOLOGY_KEEP[table]]
                        files[cur].write("\t".join(REPOLOGY_KEEP[table]) + "\n")
                continue
            if raw == b"\\.\n":
                done.add(cur)
                cur = None
                continue
            f = raw.rstrip(b"\n").decode(errors="replace").split("\t")
            files[cur].write("\t".join(f[i] for i in idx) + "\n")
            counts[cur] += 1
        if proc.wait() != 0:
            raise RuntimeError(f"zstd -dc {dump.name} exited {proc.returncode}: truncated or corrupt dump")
        if done != set(outs):
            raise RuntimeError(f"Repology dump: tables {sorted(set(outs) - done)} missing or unterminated")
    except BaseException:
        proc.kill()
        for t, fh in files.items():
            fh.close()
            tmps[t].unlink(missing_ok=True)
        raise
    for t, fh in files.items():
        fh.close()
        tmps[t].replace(outs[t])
        stamp(outs[t], f"extracted from {dump.name}: COPY {t} columns {REPOLOGY_KEEP[t]}", f"{counts[t]} rows")
        print(f"  got  {outs[t].relative_to(CORPORA)} ({counts[t]:,} rows)")


def fetch_macos() -> None:
    """This Mac's launchd jobs: for every plist in /System/Library/LaunchDaemons and LaunchAgents, its Label and the
    program it runs (Program, else ProgramArguments[0]). Only on macOS; the snapshot records the OS build."""
    out = CORPORA / "macos" / "launchd-jobs.json"
    if out.exists():
        print(f"  have {out.relative_to(CORPORA)}")
        return
    import platform
    import plistlib
    if platform.system() != "Darwin":
        raise RuntimeError("the macos source reads /System/Library on a Mac; run it there")
    build = subprocess.run(["sw_vers"], check=True, capture_output=True, text=True).stdout
    rows = []
    for kind in ("LaunchDaemons", "LaunchAgents"):
        for f in sorted(pathlib.Path(f"/System/Library/{kind}").glob("*.plist")):
            try:
                pl = plistlib.loads(f.read_bytes())
            except Exception:  # a few system plists trip Python's parser; Apple's own converter is the arbiter
                xml = subprocess.run(["plutil", "-convert", "xml1", "-o", "-", str(f)], capture_output=True)
                if xml.returncode != 0:
                    raise RuntimeError(f"{f}: unreadable plist: {xml.stderr.decode(errors='replace')[:200]}")
                pl = plistlib.loads(xml.stdout)
            prog = pl.get("Program") or (pl.get("ProgramArguments") or [None])[0]
            rows.append({"kind": kind, "file": f.name, "label": pl.get("Label"), "program": prog})
    if len(rows) < 100:
        raise RuntimeError(f"only {len(rows)} launchd plists found: not a normal macOS install")
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp = out.with_name(out.name + ".part")
    tmp.write_text(json.dumps(rows, indent=0) + "\n")
    tmp.replace(out)
    stamp(out, "/System/Library/LaunchDaemons + LaunchAgents (local)",
          f"{len(rows)} plists; " + " ".join(l.split(":", 1)[1].strip() for l in build.splitlines()))
    print(f"  got  {out.relative_to(CORPORA)} ({len(rows)} plists)")


def fetch_repology() -> None:
    """The daily Repology PostgreSQL dump (~2.6 GB zstd), kept as downloaded, plus compact TSV extracts of the
    package and project tables. Repology's code is GPLv3; the dump's data licence is not stated in its README."""
    d = CORPORA / "repology"
    download("https://dumps.repology.org/README.txt", d / "README.txt")
    dump = d / "repology-dump.sql.zst"
    download("https://dumps.repology.org/repology-database-dump-latest.sql.zst", dump)
    repology_extract(dump, d)


SOURCES = {"debian": fetch_debian, "homebrew": fetch_homebrew, "stackexchange": fetch_stackexchange,
           "repology": fetch_repology, "wikidata": fetch_wikidata, "kernel-src": fetch_kernel_src,
           "freebsd-daemons": fetch_freebsd_daemons, "macos": fetch_macos}


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
