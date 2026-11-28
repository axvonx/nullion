#!/usr/bin/env python3
"""Does the Repology dump contain Debian stable main and Homebrew? Measures name coverage and lists the fields we
would lose by dropping the direct Debian and Homebrew fetches. Stdlib only, deterministic.

Usage: python3 -I scripts/sources/repology_coverage.py      -> design/sources/repology-vs-debian-homebrew.md
"""
import collections
import datetime
import json
import lzma
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import common as C  # noqa: E402


def main() -> None:
    rows_by_repo: dict[str, list[dict]] = collections.defaultdict(list)
    keep = re.compile(r"^(debian_\d+|homebrew|homebrew_casks)$")
    repos = collections.Counter()
    for r in C.tsv_rows(C.CORPORA / "repology" / "packages.tsv.gz"):
        repos[r["repo"]] += 1
        if keep.match(r["repo"]):
            rows_by_repo[r["repo"]].append(r)
    debs = sorted((r for r in rows_by_repo if r.startswith("debian_")), key=lambda r: -repos[r])
    C.enforce(bool(debs) and "homebrew" in rows_by_repo and "homebrew_casks" in rows_by_repo,
              f"expected debian_<N>, homebrew and homebrew_casks repos; have {sorted(rows_by_repo)}")
    # Debian stable is the debian_<N> repo whose binary names best match our Packages (stable moves: 12 -> 13 -> 14)
    text = lzma.open(C.CORPORA / "debian" / "Packages.xz", "rt", errors="replace").read()
    binpkgs, srcs = set(), set()
    for block in text.split("\n\n"):
        m = re.search(r"^Package: (\S+)", block, re.M)
        if not m:
            continue
        binpkgs.add(m.group(1))
        s = re.search(r"^Source: (\S+)", block, re.M)
        srcs.add(s.group(1) if s else m.group(1))

    def names(rows, fields):
        out = set()
        for r in rows:
            for f in fields:
                v = r[f]
                if f == "binnames":
                    out |= set(C.pg_array(v))
                elif v not in ("\\N", ""):
                    out.add(v)
        return out

    best = max(debs, key=lambda d: len(binpkgs & names(rows_by_repo[d], ["binname", "binnames"])))
    drows = rows_by_repo[best]
    dbin, dsrc = names(drows, ["binname", "binnames"]), names(drows, ["srcname"])
    formula = [f["name"] for f in json.loads((C.CORPORA / "homebrew" / "formula.json").read_text())]
    casks = [c["token"] for c in json.loads((C.CORPORA / "homebrew" / "cask.json").read_text())]
    hb = names(rows_by_repo["homebrew"], ["srcname", "binname", "visiblename"])
    hbc = names(rows_by_repo["homebrew_casks"], ["srcname", "binname", "visiblename"])
    fields = {repo: {f: sum(1 for r in rows if r[f] not in ("\\N", "", "{}")) / len(rows)
                     for f in ["srcname", "binname", "binnames", "category", "comment"]}
              for repo, rows in [(best, drows), ("homebrew", rows_by_repo["homebrew"]),
                                 ("homebrew_casks", rows_by_repo["homebrew_casks"])]}
    sample_db = sorted(binpkgs - dbin)[:15]
    sample_hb = sorted(set(formula) - hb)[:15]
    sample_hbc = sorted(set(casks) - hbc)[:15]
    pct = lambda a, b: f"{a}/{b} ({a / b:.1%})"  # noqa: E731
    db_cov, src_cov = len(binpkgs & dbin), len(srcs & dsrc)
    f_cov, c_cov = len(set(formula) & hb), len(set(casks) & hbc)
    cats = collections.Counter(r["category"] for r in drows if r["category"] != "\\N")
    lines = [
        "# Repology vs the direct Debian and Homebrew fetches", "",
        f"Generated {datetime.date.today().isoformat()} by `python3 -I scripts/sources/repology_coverage.py` from "
        "`~/nullion-corpora/repology` (dump of " + json.loads((C.CORPORA / 'repology/repology-dump.sql.zst.source.json').read_text())['fetched'][:10] +
        "), `debian/Packages.xz` (stable main, amd64) and `homebrew/{formula,cask}.json`.", "",
        "## Coverage", "",
        f"Repology has {len(repos)} repositories; Debian stable is `{best}` ({repos[best]:,} rows).", "",
        "| what | covered by Repology |", "|---|---|",
        f"| Debian stable main binary packages (amd64 Packages), by binary name | {pct(db_cov, len(binpkgs))} |",
        f"| Debian stable main source packages, by source name | {pct(src_cov, len(srcs))} |",
        f"| Homebrew formulae (`homebrew` repo) | {pct(f_cov, len(formula))} |",
        f"| Homebrew casks (`homebrew_casks` repo) | {pct(c_cov, len(casks))} |", "",
        f"Missing samples. Debian: {', '.join(sample_db)}. Formulae: {', '.join(sample_hb)}. Casks: {', '.join(sample_hbc)}.", "",
        "## Fields per repository in the dump (share of rows with a value)", "",
        "| repo | srcname | binname | binnames | category | comment (summary) |", "|---|---|---|---|---|---|",
        *[f"| {repo} | " + " | ".join(f"{v:.0%}" for v in fs.values()) + " |" for repo, fs in fields.items()], "",
        f"Debian's Repology `category` is the archive section (top: {', '.join(f'{k} {v}' for k, v in cats.most_common(6))}), "
        "not debtags.", "",
        "## What dropping each direct fetch would lose", "",
        "| field | in Repology? | used by |", "|---|---|---|",
        "| popcon install counts (Debian) | **no**: Repology has no usage numbers, only how many repositories package a project | familiarity (secondary) |",
        "| Homebrew 365-day install analytics | **no**, same reason | familiarity (secondary) |",
        "| debtags (`interface::daemon`, `role::program`, ...) | **no**: the dump keeps the archive section only | unix-daemon membership |",
        "| Contents (package -> files: programs, systemd units) | **no**: `binnames` are binary *package* names, not files | unix-daemon names and the service-unit rule |",
        "| Homebrew `desc` and cask display `name` | yes: `comment` holds the desc, a cask's `visiblename` its display name (Sublime Text) | text-editor membership and names |",
        "| Homebrew formula `aliases` / `oldnames` | **no** | aliases |",
        "| Debian package descriptions | **no**: `comment` is empty for every debian_13 row | (not used yet) |",
        "| Debian per-binary-package data (section, popcon, tags) | **no**: Repology's Debian rows are per *source* package, binary packages only as the `binnames` list | unix-daemon (package -> daemon program) |",
        "| package names, versions, summaries, cross-distro project grouping | yes (that is what Repology is) | |", "",
        "## Recommendation", "",
        f"**Keep both direct fetches.** By name Repology contains Debian stable main ({db_cov / len(binpkgs):.1%} of "
        f"binary packages, {src_cov / len(srcs):.1%} of source packages) and Homebrew ({f_cov / len(formula):.1%} of "
        f"formulae, {c_cov / len(casks):.1%} of casks), so membership by package name and repo-count familiarity "
        "could come from Repology alone. But every field the combiners actually read from the direct fetches is "
        "absent from the dump: popcon and Homebrew install counts (the secondary familiarity signals), debtags and "
        "Contents (the unix-daemon membership rules). The direct fetches are also small (Debian 25 MB, Homebrew "
        "57 MB) against Repology's 2.6 GB. What Repology adds that neither has: projects grouped across "
        f"{len(repos)} repositories (cross-distro aliases, family counts) and the Gentoo/FreeBSD category taxonomy.", "",
    ]
    out = C.REPO / "design" / "sources" / "repology-vs-debian-homebrew.md"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(lines))
    print(f"debian bin {db_cov}/{len(binpkgs)} src {src_cov}/{len(srcs)}; formulae {f_cov}/{len(formula)}; "
          f"casks {c_cov}/{len(casks)} -> {out.relative_to(C.REPO)}")


if __name__ == "__main__":
    main()
