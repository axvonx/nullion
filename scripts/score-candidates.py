#!/usr/bin/env python3
"""Score candidate answers against the local corpora and assign tiers (pilot of option 3: counts + hand pins).

Usage: python3 -I scripts/score-candidates.py scripts/pilot/candidates.json ~/nullion-corpora
Writes one file per category to src/data/generated/categories/<tag>.json, and scripts/pilot/report.md.

Evidence for an entry = rows matching ANY of its phrases (name, `search` phrases, and multi-word or long aliases),
counted per corpus table. An entry whose words mean something else elsewhere ("rope" in robotics, "IDR" as an
unrelated acronym) sets `evidence: {table: [phrases]}`, which REPLACES the default phrases: tables it doesn't list
count as 0 for that entry.

Corpora count on different scales (kernel paragraphs vs paper titles), and categories differ in how often they
appear in titles at all, so each count is normalised within its category and table against a reference count: the
(NORM_RANK+1)-th largest count, not the largest, so one generic word ("graph": 200k titles) can't squash the rest.
n = min(1, log1p(count) / log1p(reference)); score = Σ weight[t] × n / Σ weight, in [0, 1].
Kernel docs get a lower weight: they measure what kernel hackers know, not what most players know.

Counts only decide where the evidence is STRONG: some table has at least STRONG_MIN hits. Strong, unpinned entries
get the first tier whose CUTOFF their score reaches. The cut-offs are absolute, not shares of the list, so adding
obscure candidates never pushes common answers deeper. They were fitted (scratch fit, 2026-11-26) to the 78 strong
pilot entries' judge tiers: 2 of 78 land more than one tier from their judge, and those are flagged below. Below that, counts are noise (2 vs 3
titles), so the entry's `judge` tier (a familiarity call written in-session) decides. Weak entries without a judge
are an error: every weak entry needs a human/LLM call, and zero evidence never means "reject".
"""
import json
import math
import pathlib
import re
import sqlite3
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent
TABLES = ["kernel", "dblp", "arxiv"]
WEIGHTS = {"kernel": 0.5, "dblp": 1.0, "arxiv": 1.0}
# Minimum score per tier, most common first; anything below the last is heisenbug. Fitted to pilot judgements.
CUTOFFS = [("off-by-one", 0.88), ("npe", 0.56), ("leak", 0.32), ("race", 0.22)]
NORM_RANK = 2
PINNABLE = {"womm", "bitflip"}
TIERS = {"off-by-one", "womm", "npe", "leak", "race", "heisenbug", "bitflip"}
STRONG_MIN = 10
# Order of the count-assignable tiers, shallow → deep, for measuring how far counts and judgement disagree.
LADDER = ["off-by-one", "npe", "leak", "race", "heisenbug"]
MAX_DISAGREE = 1


def phrases(entry: dict) -> list[str]:
    out = [entry["name"], *entry.get("search", [])]
    for a in entry.get("aliases", []):
        if " " in a.strip() or len(a) >= 6:
            out.append(a)
    return list(dict.fromkeys(out))


def fts_query(ps: list[str]) -> str:
    # FTS5 phrase syntax: double quotes, doubled to escape. Punctuation inside a phrase acts as a token separator.
    return " OR ".join('"' + p.replace('"', '""') + '"' for p in ps)


def sample_tiers() -> dict[str, dict[str, str]]:
    """Parse the hand-written sample's category blocks: {tag: {lowercased name: tier}}."""
    src = (REPO / "src" / "data" / "sample.ts").read_text()
    out: dict[str, dict[str, str]] = {}
    for m in re.finditer(r"category\('([^']+)', \[(.*?)\n\], terms\);", src, re.S):
        tiers = {"off-by-one", "womm", "npe", "leak", "race", "heisenbug", "bitflip"}
        # Rows look like ['name', 'tier', [aliases]]; alias arrays also match the pattern, so keep only real tiers.
        out[m.group(1)] = {n.lower(): t for n, t in re.findall(r"\[\s*'([^']+)',\s*'([^']+)'", m.group(2)) if t in tiers}
    if not out:
        raise RuntimeError("could not parse any categories from sample.ts")
    return out


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    cands = json.loads(pathlib.Path(sys.argv[1]).read_text())
    con = sqlite3.connect(pathlib.Path(sys.argv[2]).expanduser() / "index" / "corpora.sqlite")
    present = {r[0] for r in con.execute("SELECT name FROM sqlite_master")}
    tables = [t for t in TABLES if t in present]
    if not tables:
        raise RuntimeError("no corpus tables indexed")
    sample = sample_tiers()

    outputs, report = {}, ["# Pilot scoring report", "", f"Corpora: {', '.join(tables)}. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked {NORM_RANK + 1} in the category; weights {WEIGHTS}; cut-offs {CUTOFFS}.", ""]
    for tag, entries in cands.items():
        if tag.startswith("_"):
            continue
        names = [e["name"].lower() for e in entries]
        dupes = {n for n in names if names.count(n) > 1}
        if dupes:
            raise RuntimeError(f"{tag}: duplicate candidates {sorted(dupes)}")
        rows = []
        for e in entries:
            pin = e.get("pin")
            if pin is not None and pin not in PINNABLE:
                raise RuntimeError(f"{tag}/{e['name']}: pin must be one of {PINNABLE}, got {pin}")
            ev = e.get("evidence")
            if ev is not None:
                unknown = set(ev) - set(TABLES)
                if unknown:
                    raise RuntimeError(f"{tag}/{e['name']}: evidence names unknown tables {sorted(unknown)}")
            counts = {}
            for t in tables:
                ps = phrases(e) if ev is None else ev.get(t, [])
                counts[t] = con.execute(f"SELECT count(*) FROM {t} WHERE {t} MATCH ?", (fts_query(ps),)).fetchone()[0] if ps else 0
            rows.append({"e": e, "counts": counts})

        ref = {}
        for t in tables:
            vs = sorted((r["counts"][t] for r in rows), reverse=True)
            ref[t] = vs[min(NORM_RANK, len(vs) - 1)]
        wsum = sum(WEIGHTS[t] for t in tables)
        for r in rows:
            r["score"] = sum(
                WEIGHTS[t] * min(1.0, math.log1p(r["counts"][t]) / math.log1p(ref[t])) for t in tables if ref[t] > 0
            ) / wsum

        pins = [r for r in rows if r["e"].get("pin") == "bitflip"]
        if len(pins) != 1:
            raise RuntimeError(f"{tag}: need exactly one bitflip pin, have {len(pins)}")

        for r in rows:
            r["strong"] = max(r["counts"].values()) >= STRONG_MIN
            j = r["e"].get("judge")
            if j is not None and j not in TIERS - PINNABLE:
                raise RuntimeError(f"{tag}/{r['e']['name']}: judge must be a non-pinned tier, got {j}")
        for r in rows:
            if not r["e"].get("pin") and r["strong"]:
                r["tier"] = next((tier for tier, cut in CUTOFFS if r["score"] >= cut), "heisenbug")
        for r in rows:
            if r["e"].get("pin"):
                r["tier"], r["source"] = r["e"]["pin"], "pin"
            elif r["strong"]:
                r["source"] = "counts"
                j = r["e"].get("judge")
                if j is not None and abs(LADDER.index(j) - LADDER.index(r["tier"])) > MAX_DISAGREE:
                    # Counts and familiarity judgement are far apart: trust the judgement, surface it for review.
                    r["flag"] = f"counts said {r['tier']}"
                    r["tier"], r["source"] = j, "judge (override)"
            else:
                if r["e"].get("judge") is None:
                    raise RuntimeError(f"{tag}/{r['e']['name']}: weak evidence {r['counts']} and no judge tier")
                r["tier"], r["source"] = r["e"]["judge"], "judge"
                if r["score"] == 0:
                    r["flag"] = "no evidence"

        ours = {r["e"]["name"].lower() for r in rows}
        theirs = sample.get(tag, {})
        report += [f"## {tag}", "", f"{len(rows)} candidates; {sum(1 for r in rows if r.get('flag'))} with no evidence.", ""]
        report += ["| answer | " + " | ".join(tables) + " | score | tier | source | judge | sample tier |", "|---" * (len(tables) + 6) + "|"]
        for r in sorted(rows, key=lambda r: -r["score"]):
            name = r["e"]["name"]
            st = theirs.get(name.lower(), "—")
            mark = "" if st in ("—", r["tier"]) else " ≠"
            flag = f" ⚠ {r['flag']}" if r.get("flag") else ""
            report.append(
                f"| {name}{flag} | " + " | ".join(str(r["counts"][t]) for t in tables) + f" | {r['score']:.2f} | {r['tier']} | {r['source']} | {r['e'].get('judge', '—')} | {st}{mark} |"
            )
        only_sample = sorted(set(theirs) - ours)
        flagged = [r for r in rows if r.get("flag", "").startswith("counts said")]
        report += ["", f"Counts vs judgement disagreed by more than {MAX_DISAGREE} tier (judgement used, please review): "
                   + (", ".join(f"{r['e']['name']} ({r['flag']}, now {r['tier']})" for r in flagged) or "none")]
        report += ["", f"In the sample but not the pilot: {', '.join(only_sample) if only_sample else 'none'}", ""]

        terms = []
        for r in rows:
            e = r["e"]
            t = {"name": e["name"], "tier": r["tier"]}
            if e.get("aliases"):
                t["aliases"] = e["aliases"]
            terms.append(t)
        outputs[tag] = {"tag": tag, "terms": terms}

    out_dir = REPO / "src" / "data" / "generated" / "categories"
    out_dir.mkdir(parents=True, exist_ok=True)
    for tag, body in outputs.items():
        (out_dir / f"{tag}.json").write_text(json.dumps(body, indent=1, ensure_ascii=False) + "\n")
    (REPO / "scripts" / "pilot" / "report.md").write_text("\n".join(report) + "\n")
    print(f"wrote {len(outputs)} category files to {out_dir.relative_to(REPO)} and scripts/pilot/report.md")


if __name__ == "__main__":
    main()
