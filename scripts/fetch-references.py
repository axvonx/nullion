#!/usr/bin/env python3
"""Fetch reference lists and registries for source-first categories into ~/nullion-corpora/refs. Stdlib + git.

Usage: python3 -I scripts/fetch-references.py [source ...]      (no arguments: every source)

Sibling of scripts/fetch-corpora.py (bulk package datasets, Stack Exchange) and uses its download()/stamp(): each file
lands atomically next to a <name>.source.json; a file already there is kept (delete it to refetch); failures raise.
Git sources are shallow clones (depth 1), kept up to date by `git pull` only when --update is given.

  clickstream   Wikipedia clickstream, latest month (CC0): clicks from each article (List of / Comparison of pages)
                to each linked one: weighted membership.                                       ~460 MB
  uops          uops.info instructions.xml: every x86 instruction form, with extensions.       ~143 MB
  attack        MITRE ATT&CK enterprise STIX bundle (techniques, groups, software, aliases).   ~55 MB
  capec         MITRE CAPEC attack patterns (XML).                                              ~4 MB
  jargon        The Jargon File 4.4.7 (headwords: aliases; members for `bug`).                  ~9 MB
  foldoc        FOLDOC dictionary text (aliases, abbreviations).                                ~5 MB
  pronom        The National Archives' PRONOM DROID signature file, latest version (file formats). ~4 MB
  sosurvey      Stack Overflow Developer Survey 2023 results (ODbL): "% who use it" per language,
                database, platform, tool. NOT the latest year: 2024/2025 links are behind the site's
                JavaScript; add them here by hand.                                             ~20 MB zip
  riscv-opcodes, tldr, libmagic (file/file), bluetooth (Bluetooth SIG assigned numbers), tpm2-tss (TCG TPM2
                command names): shallow git clones under refs/git/<name>.
  iana          IANA registries (CSV): HTTP status codes, DNS parameters (RR types), protocol numbers,
                service names and port numbers.                                                 ~2 MB
  spdx          SPDX license-list-data licenses.json + exceptions.json.                         ~1 MB
  rfc-index     RFC Editor rfc-index.xml (every RFC: number, title, status).                    ~10 MB
  posix         Open Group POSIX.1-2024 XCU utilities index (HTML) + posix-utilities.txt, one name per line.
  man-pages     Linux man-pages project, shallow clone (git.kernel.org) + man-pages-names.txt
                ("man1/ls" per line for sections 1, 2, 7, 8).                                   ~60 MB
  kubernetes    kubernetes/kubernetes api/openapi-spec/swagger.json (the API server's own definitions) +
                kubernetes-kinds.json (group, version, kind from x-kubernetes-group-version-kind: the
                cleanest list of resource kinds, since every served kind carries one).         ~4 MB
  pldb          PLDB pldb.json (every language: appeared, rank, aliases, links; CC0).          ~11 MB
  linguist      GitHub Linguist languages.yml (names, aliases, types, extensions).              ~0.1 MB
  dads          NIST DADS term index (terms.html, termsType.html: two throttled requests) + dads-terms.tsv
                (term, entry URL, type).                                                         ~0.3 MB
  wikipedia-lists  MediaWiki action=parse (links + wikitext) for the List of / Comparison of pages in WP_LISTS,
                saved as wikipedia-lists/<title>.json. Sequential, 1 req/s, maxlag=5.            ~15 MB
Wikidata classes live in fetch-corpora.py's `wikidata` source, not here.
Not here: Linux kernel registries (syscalls, errno, capabilities, cpufeatures, Kconfig, nvme.h, ACPI tables) come
from the kernel sparse clone in fetch-corpora.py. IEEE 802 and UEFI have no clean downloadable list.
"""
import html
import importlib.util
import json
import pathlib
import re
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

REPO = pathlib.Path(__file__).resolve().parent.parent
_spec = importlib.util.spec_from_file_location("fetch_corpora", REPO / "scripts" / "fetch-corpora.py")
if _spec is None or _spec.loader is None:
    raise SystemExit("scripts/fetch-corpora.py not found next to this script")
fc = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(fc)

REFS = fc.CORPORA / "refs"
UPDATE = "--update" in sys.argv


def page(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": fc.UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode(errors="replace")


def latest(pattern: str, text: str, what: str) -> str:
    found = re.findall(pattern, text)
    if not found:
        raise RuntimeError(f"{what}: no match for {pattern!r} on its index page (layout changed?)")
    return sorted(set(found), key=lambda s: [int(x) if x.isdigit() else x for x in re.split(r"(\d+)", s)])[-1]


def clickstream() -> None:
    base = "https://dumps.wikimedia.org/other/clickstream/"
    month = latest(r'href="(\d{4}-\d{2})/"', page(base), "clickstream")
    fc.download(f"{base}{month}/clickstream-enwiki-{month}.tsv.gz", REFS / f"clickstream-enwiki-{month}.tsv.gz")


def pronom() -> None:
    name = latest(r"(DROID_SignatureFile_V\d+\.xml)",
                  page("https://www.nationalarchives.gov.uk/aboutapps/pronom/droid-signature-files.htm"), "pronom")
    fc.download(f"https://www.nationalarchives.gov.uk/documents/{name}", REFS / name)


def jargon() -> None:
    tgz = REFS / "jargon-4.4.7.tar.gz"
    fc.download("http://www.catb.org/jargon/jargon-4.4.7.tar.gz", tgz)
    out = REFS / "jargon"
    if not out.exists():
        out.mkdir()
        subprocess.run(["tar", "-xzf", str(tgz), "-C", str(out)], check=True)


def git(name: str, url: str) -> None:
    dest = REFS / "git" / name
    if dest.exists():
        if UPDATE:
            subprocess.run(["git", "-C", str(dest), "pull", "--ff-only", "-q"], check=True)
            print(f"  pulled git/{name}")
        else:
            print(f"  have git/{name}")
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["git", "clone", "-q", "--depth", "1", url, str(dest)], check=True)
    rev = subprocess.run(["git", "-C", str(dest), "rev-parse", "HEAD"], check=True, capture_output=True, text=True).stdout.strip()
    (dest.parent / f"{name}.source.json").write_text(f'{{"url": "{url}", "rev": "{rev}"}}\n')
    print(f"  got  git/{name} ({rev[:10]})")


def write_derived(dest: pathlib.Path, text: str, url: str, note: str) -> None:
    """A file derived from a downloaded one: atomic, stamped, always rewritten."""
    tmp = dest.with_name(dest.name + ".part")
    try:
        tmp.write_text(text)
        tmp.replace(dest)
    except BaseException:
        tmp.unlink(missing_ok=True)
        raise
    fc.stamp(dest, url, note)
    print(f"  got  {dest.relative_to(fc.CORPORA)} ({note})")


def iana() -> None:
    base = "https://www.iana.org/assignments/"
    for reg, f in [("http-status-codes", "http-status-codes-1.csv"), ("dns-parameters", "dns-parameters-4.csv"),
                   ("protocol-numbers", "protocol-numbers-1.csv"),
                   ("service-names-port-numbers", "service-names-port-numbers.csv")]:
        fc.download(f"{base}{reg}/{f}", REFS / f"iana-{reg}.csv")
        time.sleep(1)


def spdx() -> None:
    for f in ("licenses", "exceptions"):
        fc.download(f"https://raw.githubusercontent.com/spdx/license-list-data/main/json/{f}.json", REFS / f"spdx-{f}.json")


def posix() -> None:
    url = "https://pubs.opengroup.org/onlinepubs/9799919799/idx/utilities.html"
    src = REFS / "posix-utilities.html"
    fc.download(url, src)
    names = re.findall(r'<a href="\.\./utilities/[^"]+\.html"[^>]*>([^<]+)</a>', src.read_text(errors="replace"))
    if len(names) < 100:
        raise RuntimeError(f"posix: only {len(names)} utilities parsed from {url} (layout changed?)")
    write_derived(REFS / "posix-utilities.txt", "\n".join(html.unescape(n).strip() for n in names) + "\n", url, f"{len(names)} utilities")


def man_pages() -> None:
    git("man-pages", "https://git.kernel.org/pub/scm/docs/man-pages/man-pages.git")
    root = REFS / "git" / "man-pages"
    names = []
    for sec in ("man1", "man2", "man7", "man8"):
        d = root / sec
        if not d.is_dir():
            raise RuntimeError(f"man-pages: {d} missing (repo layout changed?)")
        names += [f"{sec}/{f.name.rsplit('.', 1)[0]}" for f in sorted(d.iterdir()) if f.is_file()]
    if len(names) < 500:
        raise RuntimeError(f"man-pages: only {len(names)} pages found")
    write_derived(REFS / "man-pages-names.txt", "\n".join(names) + "\n", "https://git.kernel.org/pub/scm/docs/man-pages/man-pages.git",
                  f"{len(names)} pages in man1, man2, man7, man8")


def kubernetes() -> None:
    url = "https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json"
    src = REFS / "kubernetes-swagger.json"
    fc.download(url, src)
    kinds = set()
    for name, d in json.loads(src.read_text())["definitions"].items():
        for g in d.get("x-kubernetes-group-version-kind", []):
            kinds.add((g["group"], g["version"], g["kind"]))
    if len(kinds) < 100:
        raise RuntimeError(f"kubernetes: only {len(kinds)} kinds in {url}")
    write_derived(REFS / "kubernetes-kinds.json", json.dumps([dict(group=g, version=v, kind=k) for g, v, k in sorted(kinds)], indent=0) + "\n",
                  url, f"{len(kinds)} group/version/kinds, {len({k for _, _, k in kinds})} distinct kinds")


def dads() -> None:
    base = "https://xlinux.nist.gov/dads/"
    link = re.compile(r'<a href="(HTML/[^"]+\.html)">(.*?)</a>', re.S)
    tidy = lambda t: re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", t))).strip()  # noqa: E731
    pages = {}
    for f in ("terms.html", "termsType.html"):
        dest = REFS / f"dads-{f}"
        if not dest.exists():
            time.sleep(1)  # polite: index pages only
        fc.download(base + f, dest)
        pages[f] = dest.read_text(errors="replace")
    types: dict[str, str] = {}
    for sec in re.split(r'<h2><a name="', pages["termsType.html"])[1:]:
        heading = tidy(sec.split("</a>", 1)[0].split('">', 1)[1])
        for u, t in link.findall(sec):
            types.setdefault(u, heading)
    body = pages["terms.html"].split("<hr>", 1)[1]
    rows = {(tidy(t), u) for u, t in link.findall(body)}
    if len(rows) < 1000 or len(types) < 1000:
        raise RuntimeError(f"dads: {len(rows)} terms, {len(types)} typed (layout changed?)")
    write_derived(REFS / "dads-terms.tsv", "".join(f"{t}\t{base}{u}\t{types.get(u, '')}\n" for t, u in sorted(rows, key=lambda r: (r[0].lower(), r[1]))),
                  base + "terms.html", f"{len(rows)} term links, {len(types)} entries with a type")


WP_LISTS = [
    "List of algorithms", "List of data structures", "List of file systems", "Comparison of file systems",
    "List of programming languages", "Comparison of programming languages", "List of operating systems",
    "List of text editors", "Comparison of text editors", "List of relational database management systems",
    "Comparison of relational database management systems", "List of game engines", "List of compilers",
    "Comparison of cryptographic hash functions", "List of hash functions", "List of map projections",
    "List of complexity classes", "List of file formats", "List of POSIX commands", "List of Unix daemons",
    "List of DNS record types", "List of HTTP status codes", "List of TCP and UDP port numbers",
    "Lists of network protocols", "Comparison of free and open-source software licenses",
    "Comparison of instruction set architectures", "Comparison of data-serialization formats",
    "Transient execution CPU vulnerability", "TCP congestion control", "Timeline of cryptography", "Block cipher",
    "Stream cipher", "Sorting algorithm", "Post-quantum cryptography", "RISC-V", "Lock (computer science)",
]


def wikipedia_lists() -> None:
    api = "https://en.wikipedia.org/w/api.php"
    for title in WP_LISTS:
        dest = REFS / "wikipedia-lists" / (title.replace(" ", "_").replace("/", "_") + ".json")
        if dest.exists():
            print(f"  have {dest.relative_to(fc.CORPORA)}")
            continue
        url = api + "?" + urllib.parse.urlencode({"action": "parse", "page": title, "prop": "links|wikitext", "redirects": 1,
                                                 "format": "json", "formatversion": 2, "maxlag": 5})
        for attempt in range(6):
            time.sleep(1)
            req = urllib.request.Request(url, headers={"User-Agent": fc.UA})
            try:
                with urllib.request.urlopen(req, timeout=120) as r:
                    body = json.loads(r.read())
            except urllib.error.HTTPError as e:
                if e.code in (429, 503) and attempt < 5:
                    time.sleep(int(e.headers.get("Retry-After") or 10 * 2 ** attempt))
                    continue
                raise RuntimeError(f"wikipedia {title!r}: HTTP {e.code}") from e
            if body.get("error", {}).get("code") == "maxlag" and attempt < 5:
                time.sleep(5 * 2 ** attempt)
                continue
            if "error" in body or "parse" not in body:
                raise RuntimeError(f"wikipedia {title!r}: {body.get('error', body)!r}")
            break
        p = body["parse"]
        out = {"title": p["title"], "requested": title, "pageid": p["pageid"], "wikitext": p["wikitext"],
               "links": [l["title"] for l in p["links"] if l.get("exists", True) and l["ns"] == 0]}
        tmp = dest.with_name(dest.name + ".part")
        dest.parent.mkdir(parents=True, exist_ok=True)
        try:
            tmp.write_text(json.dumps(out, ensure_ascii=False) + "\n")
            tmp.replace(dest)
        except BaseException:
            tmp.unlink(missing_ok=True)
            raise
        fc.stamp(dest, url, f"{len(out['links'])} article links")
        print(f"  got  {dest.relative_to(fc.CORPORA)} ({len(out['links'])} links)")


SOURCES = {
    "clickstream": clickstream,
    "uops": lambda: fc.download("https://uops.info/instructions.xml", REFS / "uops-instructions.xml"),
    "attack": lambda: fc.download("https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/enterprise-attack/enterprise-attack.json",
                                  REFS / "attack-enterprise.json"),
    "capec": lambda: fc.download("https://capec.mitre.org/data/xml/capec_latest.xml", REFS / "capec.xml"),
    "jargon": jargon,
    "foldoc": lambda: fc.download("https://foldoc.org/Dictionary.txt", REFS / "foldoc-Dictionary.txt"),
    "pronom": pronom,
    "sosurvey": lambda: fc.download("https://cdn.stackoverflow.co/files/jo7n4k8s/production/49915bfd46d0902c3564fd9a06b509d08a20488c.zip",
                                    REFS / "so-survey-2023.zip"),
    "iana": iana,
    "spdx": spdx,
    "rfc-index": lambda: fc.download("https://www.rfc-editor.org/rfc-index.xml", REFS / "rfc-index.xml"),
    "posix": posix,
    "man-pages": man_pages,
    "kubernetes": kubernetes,
    "pldb": lambda: fc.download("https://pldb.io/pldb.json", REFS / "pldb.json"),
    "linguist": lambda: fc.download("https://raw.githubusercontent.com/github-linguist/linguist/main/lib/linguist/languages.yml",
                                    REFS / "linguist-languages.yml"),
    "dads": dads,
    "wikipedia-lists": wikipedia_lists,
    "riscv-opcodes": lambda: git("riscv-opcodes", "https://github.com/riscv/riscv-opcodes"),
    "tldr": lambda: git("tldr", "https://github.com/tldr-pages/tldr"),
    "libmagic": lambda: git("libmagic", "https://github.com/file/file"),
    "bluetooth": lambda: git("bluetooth", "https://bitbucket.org/bluetooth-SIG/public.git"),
    "tpm2-tss": lambda: git("tpm2-tss", "https://github.com/tpm2-software/tpm2-tss"),
}


def main() -> int:
    want = [a for a in sys.argv[1:] if a != "--update"] or list(SOURCES)
    bad = [w for w in want if w not in SOURCES]
    if bad:
        raise SystemExit(f"unknown source(s) {bad}; known: {list(SOURCES)}")
    failed = []
    for name in want:
        print(f"[{name}]", flush=True)
        try:
            SOURCES[name]()
        except (OSError, RuntimeError, subprocess.CalledProcessError) as e:  # URLError is an OSError
            print(f"  FAILED: {e}", file=sys.stderr)
            failed.append(name)
    if failed:
        print(f"FAILED sources: {failed}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
