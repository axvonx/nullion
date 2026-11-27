#!/usr/bin/env python3
"""Measure a category's precision on a random sample of its unconfirmed (auto) answers.

Usage:
  python3 -I scripts/sample-precision.py <id> sample [n=20]   writes scripts/bank/mined/<id>/sample.json
  python3 -I scripts/sample-precision.py <id> score             reads sample-verdicts.json, records precision

sample.json lists the sampled answers with their tier. A reviewer (a stronger model or a person) writes
sample-verdicts.json: {"<answer>": {"member": true|false, "tier_ok": true|false, "why": "..."}} for every
sampled answer. `score` appends the result to bank/reports/<id>.md and exits 1 when membership precision is
below MIN_PRECISION, so a bad category can't quietly be approved.
"""
import json
import pathlib
import random
import re
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent
MIN_PRECISION = 0.9
HEADINGS = {"Off-by-one", "Null pointer exception", "Memory leak", "Race condition", "Heisenbug"}


def auto_entries(path: pathlib.Path) -> list[dict]:
    out, sec = [], None
    for line in path.read_text().split("\n"):
        if line.startswith("## "):
            sec = line[3:].strip()
        elif line.startswith("- ") and sec in HEADINGS and line.endswith(" (auto)"):
            names = re.sub(r"\s+\(auto\)$", "", line[2:].strip()).split(" | ")
            out.append({"name": names[0], "aliases": names[1:], "tier": sec})
    return out


def main() -> None:
    if len(sys.argv) < 3 or sys.argv[2] not in ("sample", "score"):
        raise SystemExit(__doc__)
    cid, mode = sys.argv[1], sys.argv[2]
    hits = [h for h in (REPO / "bank").glob(f"*/{cid}.md") if h.parent.name != "reports"]
    if len(hits) != 1:
        raise RuntimeError(f"{cid}: expected one bank file, found {len(hits)}")
    d = REPO / "scripts" / "bank" / "mined" / cid
    d.mkdir(parents=True, exist_ok=True)
    if mode == "sample":
        n = int(sys.argv[3]) if len(sys.argv) > 3 else 20
        pool = auto_entries(hits[0])
        if not pool:
            raise RuntimeError(f"{cid}: no (auto) answers to sample")
        pick = random.Random(cid).sample(pool, min(n, len(pool)))  # seeded by id: re-runs sample the same
        (d / "sample.json").write_text(json.dumps(pick, indent=1, ensure_ascii=False) + "\n")
        print(f"{cid}: sampled {len(pick)} of {len(pool)} unconfirmed answers -> {(d / 'sample.json').relative_to(REPO)}")
        return
    pick = json.loads((d / "sample.json").read_text())
    verdicts = json.loads((d / "sample-verdicts.json").read_text())
    missing = [p["name"] for p in pick if p["name"] not in verdicts]
    if missing:
        raise RuntimeError(f"sample-verdicts.json lacks verdicts for {missing}")
    members = sum(bool(verdicts[p["name"]]["member"]) for p in pick)
    tiers = sum(bool(verdicts[p["name"]]["member"] and verdicts[p["name"]]["tier_ok"]) for p in pick)
    precision = members / len(pick)
    wrong = [f"{p['name']} ({verdicts[p['name']]['why']})" for p in pick if not verdicts[p["name"]]["member"]]
    report = REPO / "bank" / "reports" / f"{cid}.md"
    with report.open("a") as f:
        f.write(f"\n## Precision sample\n\n{members}/{len(pick)} sampled answers are members ({precision:.0%}); "
                f"{tiers}/{len(pick)} also have an acceptable tier. Not members: {', '.join(wrong) or 'none'}.\n")
    print(f"{cid}: precision {precision:.0%} ({members}/{len(pick)}), tier ok {tiers}/{len(pick)}")
    if precision < MIN_PRECISION:
        print(f"{cid}: below {MIN_PRECISION:.0%}; fix the source plan or the filter before approving", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
