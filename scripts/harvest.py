#!/usr/bin/env python3
"""Mechanical half of harvesting a category: source plan → mined batch files ready for the filter passes.

Usage: python3 -I scripts/harvest.py <category id>

Reads scripts/bank/plans/<id>.json:
  {
    "sparse":   [{"repo": "freebsd/freebsd-src", "dir": "freebsd", "paths": ["share/man/man9"]}],  optional
    "heads":    ["lock", "mutex"],            head-noun mining over "trees" (see scripts/mine-heads.py)
    "trees":    ["kernel", "src/freebsd"],    relative to ~/nullion-corpora
    "listings": [{"repo": "torvalds/linux", "path": "fs", "type": "dir"}],  GitHub API directory listings
                                              (type "dir" or "file"; file names lose their extension)
    "wiki":     ["Category:Scheduling algorithms"],  Wikipedia category members (articles in it and its direct
                                              subcategories, via scripts/bank/recall.py's members())
    "repology": [{"repo": "gentoo", "category": "x11-terms"}],  a distro's package category in the local Repology
                                              extract: its package names are candidates
    "covers":   {"<scope sub-kind>": ["<source>"]}   which source covers each sub-kind of the scope (pipeline check)
    "context":  ["file system"]               optional: counts must co-occur with one of these (scorer)
  }
At least one of heads, listings, extract or wiki. Writes scripts/bank/mined/<id>/batch-NN.txt, at most BATCH lines each
(one `## source:` header per source), and prints the next steps. Clones and listings that fail raise.
"""
import json
import re
import pathlib
import subprocess
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent
CORPORA = pathlib.Path("~/nullion-corpora").expanduser()
BATCH = 1400


def repology_index() -> dict[str, list[str]]:
    """"<repo>\t<category>" -> the project names packaged there (visible names), from the local Repology extract
    (~/nullion-corpora/repology/packages.tsv.gz, scripts/fetch-corpora.py repology). Built once (about half a
    minute), cached in ~/nullion-corpora/derived/repology-categories.json.gz next to the extract it came from."""
    import gzip
    src = CORPORA / "repology" / "packages.tsv.gz"
    if not src.exists():
        raise RuntimeError("no Repology extract: python3 -I scripts/fetch-corpora.py repology")
    cache = CORPORA / "derived" / "repology-categories.json.gz"
    if cache.exists() and cache.stat().st_mtime >= src.stat().st_mtime:
        return json.loads(gzip.decompress(cache.read_bytes()))
    idx: dict[str, set[str]] = {}
    with gzip.open(src, "rt", errors="replace") as f:
        head = f.readline().rstrip("\n").split("\t")
        ri, ci, vi = head.index("repo"), head.index("category"), head.index("visiblename")
        for line in f:
            p = line.rstrip("\n").split("\t")
            if len(p) > max(ri, ci, vi) and p[ci] not in ("", "\\N") and p[vi] not in ("", "\\N"):
                idx.setdefault(f"{p[ri]}\t{p[ci]}", set()).add(p[vi])
    out = {k: sorted(v) for k, v in idx.items()}
    cache.parent.mkdir(parents=True, exist_ok=True)
    tmp = cache.with_name(cache.name + ".part")
    tmp.write_bytes(gzip.compress(json.dumps(out).encode()))
    tmp.replace(cache)
    return out


def repology_members(spec: dict) -> list[str]:
    key = f"{spec['repo']}\t{spec['category']}"
    idx = repology_index()
    if key not in idx:
        raise RuntimeError(f"Repology has no category {spec['category']!r} in repo {spec['repo']!r}")
    return idx[key]


def wiki_members(category: str) -> list[str]:
    """Article titles in a Wikipedia category and its direct subcategories (recall.py's members(), one API client)."""
    sys.path.insert(0, str(REPO / "scripts" / "bank"))
    import recall  # noqa: E402  # pyright: ignore[reportMissingImports]
    return recall.members(category)[0]


def run(*cmd: str, cwd: pathlib.Path | None = None) -> str:
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"{' '.join(cmd)} failed ({r.returncode}): {r.stderr.strip()[:400]}")
    return r.stdout


def ensure_sparse(spec: dict) -> None:
    """Sparse clones use non-cone patterns, so a path may be a single file (nasm's x86/insns.dat) as well as a
    directory; cone mode, git's default, takes directories only. A clone made in cone mode is switched over, keeping
    the directories it already had."""
    dest = CORPORA / "src" / spec["dir"]
    if not dest.exists():
        run("git", "clone", "-q", "--depth", "1", "--filter=blob:none", "--sparse",
            f"https://github.com/{spec['repo']}.git", str(dest))
        run("git", "-C", str(dest), "sparse-checkout", "set", "--no-cone", *spec["paths"])
        return
    have = [p for p in run("git", "-C", str(dest), "sparse-checkout", "list").split() if p]
    missing = [p for p in spec["paths"] if p not in have]
    if missing:
        run("git", "-C", str(dest), "sparse-checkout", "set", "--no-cone", *have, *missing)
    for p in spec["paths"]:
        if not (dest / p).exists():
            raise RuntimeError(f"{spec['repo']}: {p} is not in the checkout (wrong path in the plan?)")


def listing(spec: dict) -> list[str]:
    kind = spec.get("type", "dir")
    if kind not in ("dir", "file"):
        raise RuntimeError(f"listing type must be dir or file, got {kind!r}")
    out = run("gh", "api", f"repos/{spec['repo']}/contents/{spec['path']}", "--jq",
              f'.[] | select(.type=="{kind}") | .name')
    names = [n for n in out.split("\n") if n]
    if kind == "file":
        names = [n.rsplit(".", 1)[0] for n in names]
    return sorted(set(names))


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    cid = sys.argv[1]
    plan_path = REPO / "scripts" / "bank" / "plans" / f"{cid}.json"
    plan = json.loads(plan_path.read_text())
    if not any(plan.get(k) for k in ("heads", "listings", "extract", "wiki", "repology")):
        raise RuntimeError(f"{plan_path}: needs heads (with trees), listings, extract, wiki or repology")
    bank = [h for h in (REPO / "bank").glob(f"*/{cid}.md") if h.parent.name != "reports"]
    if len(bank) != 1:
        raise RuntimeError(f"{cid}: expected one bank file, found {len(bank)}")

    for spec in plan.get("sparse", []):
        ensure_sparse(spec)

    sections: list[tuple[str, list[str]]] = []
    for spec in plan.get("listings", []):
        sections.append((f"{spec['repo']}/{spec['path']} ({spec.get('type', 'dir')} names)", listing(spec)))
    for spec in plan.get("repology", []):
        names = repology_members(spec)
        if len(names) < 8:
            raise RuntimeError(f"Repology {spec} has only {len(names)} projects: not a useful source")
        sections.append((f"Repology {spec['repo']} category {spec['category']} (package names)", names))
    for cat in plan.get("wiki", []):
        names = wiki_members(cat)
        if len(names) < 8:
            raise RuntimeError(f"wiki source {cat!r} has only {len(names)} articles: not a useful source")
        sections.append((f"Wikipedia {cat} (article titles)", names))
    for spec in plan.get("extract", []):  # a registry file in a local tree: one candidate per regex match
        f = CORPORA / spec["tree"] / spec["file"]
        if not f.is_file():
            raise RuntimeError(f"extract file {f} does not exist (add the repo to sparse, or fix the path)")
        rx = re.compile(spec["regex"])
        found = []
        for line in f.read_text(errors="replace").split("\n"):
            m = rx.match(line)
            if m:
                found.append(" - ".join(g.strip() for g in m.groups() if g and g.strip()))
        sections.append((f"{spec['tree']}/{spec['file']} (registry lines)", sorted(set(found))))
    if plan.get("heads"):
        for tree in plan.get("trees", []):
            path = CORPORA / tree
            if not path.exists():
                raise RuntimeError(f"tree {path} does not exist (add it to sparse, or fix the path)")
            out = run(sys.executable, "-I", str(REPO / "scripts" / "mine-heads.py"), str(bank[0]),
                      ",".join(plan["heads"]), str(path))
            sections.append((f"{tree} (head nouns: {', '.join(plan['heads'])})", out.rstrip("\n").split("\n")))

    out_dir = REPO / "scripts" / "bank" / "mined" / cid
    out_dir.mkdir(parents=True, exist_ok=True)
    for old in out_dir.glob("batch-*.txt"):
        old.unlink()
    batches: list[list[str]] = [[]]
    for title, lines in sections:
        lines = [l for l in lines if l.strip()]
        for i in range(0, max(1, len(lines)), BATCH):
            chunk = lines[i : i + BATCH]
            if len(batches[-1]) + len(chunk) + 1 > BATCH and batches[-1]:
                batches.append([])
            batches[-1] += [f"## source: {title}", *chunk]
    for n, b in enumerate(batches):
        (out_dir / f"batch-{n:02d}.txt").write_text("\n".join(b) + "\n")
    total = sum(len(l) for _, l in sections)
    print(f"{cid}: {total} mined lines from {len(sections)} sources -> {len(batches)} batches in {out_dir.relative_to(REPO)}")
    print("next: two filter passes per batch (scripts/bank/prompts/filter.md), then scripts/compare-passes.py")


if __name__ == "__main__":
    main()
