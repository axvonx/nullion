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
    "context":  ["file system"]               optional: counts must co-occur with one of these (scorer)
  }
At least one of heads or listings. Writes scripts/bank/mined/<id>/batch-NN.txt, at most BATCH lines each
(one `## source:` header per source), and prints the next steps. Clones and listings that fail raise.
"""
import json
import pathlib
import subprocess
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent
CORPORA = pathlib.Path("~/nullion-corpora").expanduser()
BATCH = 1400


def run(*cmd: str, cwd: pathlib.Path | None = None) -> str:
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"{' '.join(cmd)} failed ({r.returncode}): {r.stderr.strip()[:400]}")
    return r.stdout


def ensure_sparse(spec: dict) -> None:
    dest = CORPORA / "src" / spec["dir"]
    if not dest.exists():
        run("git", "clone", "-q", "--depth", "1", "--filter=blob:none", "--sparse",
            f"https://github.com/{spec['repo']}.git", str(dest))
        run("git", "-C", str(dest), "sparse-checkout", "set", *spec["paths"])
    else:
        have = set(run("git", "-C", str(dest), "sparse-checkout", "list").split())
        missing = [p for p in spec["paths"] if p not in have]
        if missing:
            run("git", "-C", str(dest), "sparse-checkout", "add", *missing)


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
    if not plan.get("heads") and not plan.get("listings"):
        raise RuntimeError(f"{plan_path}: needs heads (with trees) or listings")
    bank = [h for h in (REPO / "bank").glob(f"*/{cid}.md") if h.parent.name != "reports"]
    if len(bank) != 1:
        raise RuntimeError(f"{cid}: expected one bank file, found {len(bank)}")

    for spec in plan.get("sparse", []):
        ensure_sparse(spec)

    sections: list[tuple[str, list[str]]] = []
    for spec in plan.get("listings", []):
        sections.append((f"{spec['repo']}/{spec['path']} ({spec.get('type', 'dir')} names)", listing(spec)))
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
