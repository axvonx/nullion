#!/usr/bin/env python3
"""Source-first prototype: Unix daemons from Debian, with no LLM in the path.

Usage: python3 -I scripts/sources/debian_daemons.py [--out <json>]

Membership: packages tagged `interface::daemon` in Debian stable's Packages index.
Names: each package's daemon programs from Contents-amd64 (files under usr/sbin or usr/bin, plus systemd's
       lib/systemd/systemd-*d helpers) whose name ends in "d", contains "daemon", or is the package's own name;
       the package name is kept as an alias (postfix, nginx). A daemon package with no such binary keeps its
       package name and is marked `name_from: package`.
Familiarity: popcon installs of the package (the most-installed package wins a name two packages share).

Writes a JSON list [{"name", "aliases", "package", "installs", "name_from"}] sorted by installs, and prints a
summary. Deterministic: same inputs, same output.
"""
import argparse
import gzip
import json
import lzma
import pathlib
import re
from collections import defaultdict

DEB = pathlib.Path("~/nullion-corpora/debian").expanduser()
BIN_DIRS = ("usr/sbin/", "usr/bin/", "sbin/", "bin/")


def packages() -> dict[str, set[str]]:
    """package -> its tags."""
    text = lzma.open(DEB / "Packages.xz", "rt", errors="replace").read()
    out = {}
    for block in text.split("\n\n"):
        m = re.search(r"^Package: (\S+)", block, re.M)
        t = re.search(r"^Tag: (.*(?:\n .*)*)", block, re.M)
        if m and t:
            out[m.group(1)] = {x.strip() for x in t.group(1).replace("\n", " ").split(",") if x.strip()}
    return out


def popcon() -> dict[str, int]:
    out = {}
    for line in gzip.open(DEB / "popcon-by_inst.gz", "rt", errors="replace"):
        if line[:1].isdigit():
            f = line.split()
            out[f[1]] = int(f[2])
    return out


def programs(wanted: set[str]) -> dict[str, set[str]]:
    """package -> program names it installs (Contents lines are `path  section/pkg[,section/pkg...]`)."""
    out: dict[str, set[str]] = defaultdict(set)
    for line in gzip.open(DEB / "Contents-amd64.gz", "rt", errors="replace"):
        path, _, owners = line.rstrip("\n").rpartition(" ")
        path = path.strip()
        systemd_helper = re.match(r"(?:usr/)?lib/systemd/(systemd(?:-[\w-]+d)?)$", path)
        if not (path.startswith(BIN_DIRS) or systemd_helper):
            continue
        name = systemd_helper.group(1) if systemd_helper else path.rsplit("/", 1)[1]
        for o in owners.split(","):
            pkg = o.rsplit("/", 1)[-1]
            if pkg in wanted:
                out[pkg].add(name)
    return out


def looks_like_daemon(name: str, pkg: str) -> bool:
    return name == pkg or bool(re.search(r"d$|daemon", name)) and len(name) >= 3


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", type=pathlib.Path, default=DEB.parent / "derived" / "unix-daemon.debian.json")
    a = ap.parse_args()
    tags, inst = packages(), popcon()
    daemons = {p for p, t in tags.items() if "interface::daemon" in t}
    progs = programs(daemons)
    best: dict[str, dict] = {}
    for pkg in daemons:
        names = sorted(n for n in progs.get(pkg, ()) if looks_like_daemon(n, pkg))
        entries = [(n, "binary") for n in names] or [(pkg, "package")]
        for n, origin in entries:
            e = {"name": n, "aliases": [pkg] if pkg != n else [], "package": pkg, "installs": inst.get(pkg, 0), "name_from": origin}
            if n not in best or e["installs"] > best[n]["installs"]:
                best[n] = e
    rows = sorted(best.values(), key=lambda e: (-e["installs"], e["name"]))
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps(rows, indent=1) + "\n")
    print(f"{len(daemons)} daemon packages -> {len(rows)} names ({sum(r['name_from'] == 'binary' for r in rows)} from binaries) -> {a.out}")
    print("top 30:", ", ".join(r["name"] for r in rows[:30]))
    print("tail 15:", ", ".join(r["name"] for r in rows[-15:]))


if __name__ == "__main__":
    main()
