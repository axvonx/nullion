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
Not here: Linux kernel registries (syscalls, errno, capabilities, cpufeatures, Kconfig, nvme.h, ACPI tables) come
from the kernel sparse clone in fetch-corpora.py. IEEE 802 and UEFI have no clean downloadable list.
"""
import importlib.util
import pathlib
import re
import subprocess
import sys
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
