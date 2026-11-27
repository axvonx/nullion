#!/usr/bin/env python3
"""Merge filtered mining batches for one category, ready for score-candidates.py.

Usage: python3 -I scripts/merge-mined.py <tag> <out-candidates.json> <batch-prefix> [<batch-prefix> ...]
Each batch prefix P has P-candidates.json ({tag: [{name, aliases, judge, ...}]}) and P-aliases.json
({existing answer: [aliases]}) written by a filter agent.

- Candidates are deduplicated across batches by a loose key (case, spaces, hyphens, underscores ignored).
  Aliases are unioned, and the judge tier is the shallowest one any batch gave (a disagreement is printed).
- Candidates whose name or alias is already in the bank file are dropped. Their new spellings become alias
  additions instead.
- Alias additions are applied to the bank file's existing lines. This is a curated edit: it only appends
  aliases to an answer's own line and never moves or deletes anything.
"""
import json
import pathlib
import re
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent
LADDER = ["off-by-one", "npe", "leak", "race", "heisenbug"]
SUGGESTED = re.compile(r"\s+\(suggested: [a-z-]+\)$")


def key(s: str) -> str:
    return re.sub(r"[\s_\-]+", "", s.lower())


def main() -> None:
    if len(sys.argv) < 4:
        raise SystemExit(__doc__)
    tag, out, prefixes = sys.argv[1], pathlib.Path(sys.argv[2]), sys.argv[3:]
    hits = [h for h in (REPO / "bank").glob(f"*/{tag}.md") if h.parent.name != "reports"]
    if len(hits) != 1:
        raise RuntimeError(f"{tag}: expected one bank file, found {len(hits)}")
    path = hits[0]
    lines = path.read_text().split("\n")

    line_of: dict[str, int] = {}  # loose key of every existing name/alias -> line index
    for i, l in enumerate(lines):
        if l.startswith("- "):
            for n in SUGGESTED.sub("", l[2:].strip()).split(" | "):
                line_of[key(n)] = i

    merged: dict[str, dict] = {}
    alias_adds: dict[int, list[str]] = {}

    def add_alias(i: int, a: str) -> None:
        if key(a) in line_of:
            return
        alias_adds.setdefault(i, []).append(a)
        line_of[key(a)] = i

    for p in prefixes:
        cands = json.loads(pathlib.Path(f"{p}-candidates.json").read_text()).get(tag)
        if cands is None:
            raise RuntimeError(f"{p}-candidates.json has no {tag!r} key")
        for c in cands:
            if c.get("judge") not in LADDER[1:]:
                raise RuntimeError(f"{p}: {c.get('name')!r} has judge {c.get('judge')!r}")
            names = [c["name"], *c.get("aliases", [])]
            existing = next((line_of[key(n)] for n in names if key(n) in line_of), None)
            if existing is not None:
                for n in names:
                    add_alias(existing, n)
                continue
            m = next((merged[key(n)] for n in names if key(n) in merged), None)
            if m is None:
                m = {"name": c["name"], "aliases": [], "judge": c["judge"]}
                if c.get("confidence") == "low":
                    m["confidence"] = "low"
                merged[key(c["name"])] = m
            elif c.get("confidence") != "low" and m.get("confidence") == "low":
                m.pop("confidence")  # another batch was sure about it
            if m["judge"] != c["judge"]:
                print(f"note: {m['name']}: batches disagree ({m['judge']} vs {c['judge']}); keeping the shallower")
                m["judge"] = min(m["judge"], c["judge"], key=LADDER.index)
            for n in names:
                if key(n) != key(m["name"]) and key(n) not in {key(a) for a in m["aliases"]}:
                    m["aliases"].append(n)
                merged[key(n)] = m
        aliases = json.loads(pathlib.Path(f"{p}-aliases.json").read_text())
        for name, als in aliases.items():
            i = line_of.get(key(name))
            if i is None:
                print(f"note: {p}: alias target {name!r} is not in the bank file; skipped")
                continue
            for a in als:
                add_alias(i, a)

    for i, als in alias_adds.items():
        # Inbox lines end in "(suggested: tier)"; aliases go before that suffix.
        m = SUGGESTED.search(lines[i])
        head, tail = (lines[i][: m.start()], lines[i][m.start():]) if m else (lines[i], "")
        lines[i] = head + " | " + " | ".join(als) + tail
    path.write_text("\n".join(lines))
    unique = list({id(m): m for m in merged.values()}.values())
    out.write_text(json.dumps({tag: unique}, indent=1, ensure_ascii=False) + "\n")
    print(f"{tag}: {len(unique)} new candidates -> {out}; {sum(map(len, alias_adds.values()))} aliases added to {path.relative_to(REPO)}")


if __name__ == "__main__":
    main()
