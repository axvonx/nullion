#!/usr/bin/env python3
"""Cut the routed familiarity ranking (Jev score; Jev confidence < ROUTE_BELOW takes Haiku's cached level) into
tiers by fixed shares, and report what lands where. Uses only cached scores (scripts/sources/familiarity.py first).

Usage: python3 -I scripts/sources/tier_quotas.py <category id>...
Writes design/scoring/<id>-quotas.md. Nothing is written to bank/.
"""
import json
import pathlib
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO / "scripts" / "sources"))
sys.path.insert(0, str(REPO / "scripts" / "bank"))
import familiarity as F  # noqa: E402  # pyright: ignore[reportMissingImports]
import pipeline  # noqa: E402  # pyright: ignore[reportMissingImports]

ROUTE_BELOW = 0.40
SHARES = [("off-by-one", 0.04), ("npe", 0.17), ("leak", 0.13), ("race", 0.06), ("heisenbug", 0.60)]
assert abs(sum(s for _, s in SHARES) - 1) < 1e-9


def run(cid: str) -> None:
    b = pipeline.parse_bank(pipeline.bank_path(cid))
    answers = [{**a, "bank": F.HEADING_TIER[h]} for h, lst in b["tiers"].items() if h in F.HEADING_TIER for a in lst]
    rdir = REPO / "scripts" / "bank" / "runs" / cid
    J = json.loads((rdir / "familiarity-jev.json").read_text())
    H = json.loads((rdir / "familiarity-haiku.json").read_text())
    for a in answers:
        j = J[a["name"]]
        a["routed"] = j["confidence"] < ROUTE_BELOW
        a["score"] = H[a["name"]]["score"] if a["routed"] else j["score"]
        a["jev"], a["conf"] = j["score"], j["confidence"]
    ranked = sorted(answers, key=lambda a: (-a["score"], a["name"].lower()))
    n, i = len(ranked), 0
    for k, (tier, share) in enumerate(SHARES):
        take = n - i if k == len(SHARES) - 1 else round(share * n)
        for a in ranked[i:i + take]:
            a["tier"] = tier
        i += take
    lines = [f"# Tier shares: {cid} ({b['prompt']})", "",
             f"{n} tiered answers (Bit Flip and Works on my machine left out); shares {SHARES}; Jev, with confidence "
             f"< {ROUTE_BELOW} routed to Haiku ({sum(a['routed'] for a in answers)} routed).", "",
             "| tier | count | score range | moved from the bank's tier |", "|---|---|---|---|"]
    for tier, _ in SHARES:
        g = [a for a in ranked if a["tier"] == tier]
        moved = sum(a["bank"] != tier for a in g)
        lines.append(f"| {tier} | {len(g)} | {min(a['score'] for a in g):.2f} to {max(a['score'] for a in g):.2f} | {moved} |")
    same = sum(a["bank"] == a["tier"] for a in answers)
    lines += ["", f"Same tier as the bank: {same}/{n} ({same / n:.0%}).", ""]
    for tier, _ in SHARES:
        g = [a for a in ranked if a["tier"] == tier]
        show = g if tier != "heisenbug" else g[:30]
        lines += [f"## {tier}" + ("" if tier != "heisenbug" else f" (top 30 of {len(g)})"), "",
                  ", ".join(f"{a['name']} {a['score']:.1f}{'*' if a['routed'] else ''} [{a['bank']}]" for a in show), ""]
    lines.append("`*` = Jev's confidence was low, Haiku's level used. [bracket] = tier in the bank today.")
    out = REPO / "design" / "scoring" / f"{cid}-quotas.md"
    out.write_text("\n".join(lines) + "\n")
    print("\n".join(lines))


if __name__ == "__main__":
    for cid in sys.argv[1:] or sys.exit(__doc__):
        run(cid)
