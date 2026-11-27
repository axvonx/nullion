#!/usr/bin/env python3
"""Combine two independent filter passes over the same batches into agreed and disputed candidates.

Usage: python3 -I scripts/compare-passes.py <category id>
Reads scripts/bank/mined/<id>/batch-NN.a-candidates.json and batch-NN.b-candidates.json (plus their
-aliases.json files) for every batch, and writes in the same folder:
  agreed-candidates.json / agreed-aliases.json   both passes kept it, with tiers at most one step apart;
                                                  the shallower tier wins (the safe side for a wrong accept)
  disputed.json                                   kept by one pass only, or tiers further apart;
                                                  for escalation to a stronger model
After escalation, resolved-candidates.json (same shape as agreed-candidates.json) holds the disputes the
escalation kept; anything it marks "confidence": "low" goes to the Inbox instead of the tiers.

Alias suggestions are unioned across passes. Aliases shorter than 3 characters are dropped as too generic for
a game (the review found `dev` and `fd`).
"""
import json
import pathlib
import re
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent
LADDER = ["off-by-one", "npe", "leak", "race", "heisenbug"]


def key(s: str) -> str:
    return re.sub(r"[\s_\-]+", "", s.lower())


def load(path: pathlib.Path, tag: str) -> list[dict]:
    if not path.exists():
        raise RuntimeError(f"missing {path}: run both filter passes on every batch first")
    data = json.loads(path.read_text())
    if tag not in data:
        raise RuntimeError(f"{path}: no {tag!r} key")
    for c in data[tag]:
        if c.get("judge") not in LADDER:
            raise RuntimeError(f"{path}: {c.get('name')!r} has judge {c.get('judge')!r}")
    return data[tag]


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    tag = sys.argv[1]
    d = REPO / "scripts" / "bank" / "mined" / tag
    batches = sorted(p for p in d.glob("batch-*.txt"))
    if not batches:
        raise RuntimeError(f"{d}: no batches; run scripts/harvest.py {tag}")
    agreed, disputed, aliases, picks = [], [], {}, {}
    for b in batches:
        stem = b.with_suffix("")
        pa = load(pathlib.Path(f"{stem}.a-candidates.json"), tag)
        pb = load(pathlib.Path(f"{stem}.b-candidates.json"), tag)
        # Pair the passes on any shared name or alias ("BBR" in one, "TCP BBR | BBR" in the other).
        keys_b = {}
        for c in pb:
            for n in [c["name"], *c.get("aliases", [])]:
                keys_b.setdefault(key(n), c)
        used_b: set[int] = set()
        for ca in pa:
            cb = next((keys_b[key(n)] for n in [ca["name"], *ca.get("aliases", [])] if key(n) in keys_b and id(keys_b[key(n)]) not in used_b), None)
            if cb is not None:
                used_b.add(id(cb))
            if cb and abs(LADDER.index(ca["judge"]) - LADDER.index(cb["judge"])) <= 1:
                tier = min(ca["judge"], cb["judge"], key=LADDER.index)
                names = [*ca.get("aliases", []), cb["name"], *cb.get("aliases", [])]
                al = list(dict.fromkeys(x for x in names if len(x) >= 3 and key(x) != key(ca["name"])))
                agreed.append({"name": ca["name"], "aliases": al, "judge": tier})
            else:
                disputed.append({"name": ca["name"], "a": ca, "b": cb, "batch": b.name})
        for cb in pb:
            if id(cb) not in used_b:
                disputed.append({"name": cb["name"], "a": None, "b": cb, "batch": b.name})
        for side in ("a", "b"):
            raw = json.loads(pathlib.Path(f"{stem}.{side}-candidates.json").read_text())
            for kind in ("womm_candidates", "bitflip_candidates"):
                picks.setdefault(kind, [])
                picks[kind] += [x for x in raw.get(kind, []) if x not in picks[kind]]
        for p in ("a", "b"):
            ap = pathlib.Path(f"{stem}.{p}-aliases.json")
            if ap.exists():
                for target, als in json.loads(ap.read_text()).items():
                    aliases.setdefault(target, [])
                    aliases[target] += [x for x in als if len(x) >= 3 and x not in aliases[target]]
    (d / "agreed-candidates.json").write_text(json.dumps({tag: agreed}, indent=1, ensure_ascii=False) + "\n")
    # Proposals from both passes, for the person who pins the Bit Flip and Works on my machine picks.
    (d / "picks.json").write_text(json.dumps(picks, indent=1, ensure_ascii=False) + "\n")
    (d / "agreed-aliases.json").write_text(json.dumps(aliases, indent=1, ensure_ascii=False) + "\n")
    (d / "disputed.json").write_text(json.dumps(disputed, indent=1, ensure_ascii=False) + "\n")
    n = len(agreed) + len(disputed)
    print(f"{tag}: {len(agreed)} agreed, {len(disputed)} disputed ({len(disputed) / max(1, n):.0%}) across {len(batches)} batches")


if __name__ == "__main__":
    main()
