#!/usr/bin/env python3
"""Score candidate answers against the local corpora and assign tiers (pilot of option 3: counts + hand pins).

Usage: python3 -I scripts/score-candidates.py scripts/pilot/candidates.json ~/nullion-corpora
Writes src/data/generated/pilot.json and scripts/pilot/report.md.

Evidence for an entry = rows matching ANY of its phrases (name, `search` phrases, and multi-word or long aliases),
counted per corpus table. An entry whose words mean something else elsewhere ("rope" in robotics, "IDR" as an
unrelated acronym) sets `evidence: {table: [phrases]}`, which REPLACES the default phrases: tables it doesn't list
count as 0 for that entry.

Corpora count on different scales (kernel paragraphs vs paper titles), so each count is normalised within its
category and table: log1p(count) / log1p(max count in that category and table). score = Σ weight[t] × that.
Kernel docs get a lower weight: they measure what kernel hackers know, not what most players know.

Unpinned entries are ranked by score within their category and cut into tiers by fixed shares; entries with zero
evidence are kept but flagged for review.
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
# Shares of unpinned, evidenced entries per tier, most common first. The remainder is heisenbug.
SHARES = [("off-by-one", 0.12), ("npe", 0.15), ("leak", 0.20), ("race", 0.23)]
PINNABLE = {"womm", "bitflip"}


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

    terms, report = [], ["# Pilot scoring report", "", f"Corpora: {', '.join(tables)}. score = Σ weight × log1p(count)/log1p(category max); weights {WEIGHTS}.", ""]
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

        top = {t: max(r["counts"][t] for r in rows) for t in tables}
        for r in rows:
            r["score"] = sum(WEIGHTS[t] * math.log1p(r["counts"][t]) / math.log1p(top[t]) for t in tables if top[t] > 0)

        pins = [r for r in rows if r["e"].get("pin") == "bitflip"]
        if len(pins) != 1:
            raise RuntimeError(f"{tag}: need exactly one bitflip pin, have {len(pins)}")

        ranked = sorted((r for r in rows if not r["e"].get("pin") and r["score"] > 0), key=lambda r: -r["score"])
        i = 0
        for tier, share in SHARES:
            k = max(1, round(share * len(ranked)))
            for r in ranked[i : i + k]:
                r["tier"] = tier
            i += k
        for r in ranked[i:]:
            r["tier"] = "heisenbug"
        for r in rows:
            if r["e"].get("pin"):
                r["tier"] = r["e"]["pin"]
            elif r["score"] == 0:
                r["tier"] = "heisenbug"
                r["flag"] = "no evidence"

        ours = {r["e"]["name"].lower() for r in rows}
        theirs = sample.get(tag, {})
        report += [f"## {tag}", "", f"{len(rows)} candidates; {sum(1 for r in rows if r.get('flag'))} with no evidence.", ""]
        report += ["| answer | " + " | ".join(tables) + " | score | tier | sample tier |", "|---" * (len(tables) + 4) + "|"]
        for r in sorted(rows, key=lambda r: -r["score"]):
            name = r["e"]["name"]
            st = theirs.get(name.lower(), "—")
            mark = "" if st in ("—", r["tier"]) else " ≠"
            flag = f" ⚠ {r['flag']}" if r.get("flag") else ""
            report.append(
                f"| {name}{flag} | " + " | ".join(str(r["counts"][t]) for t in tables) + f" | {r['score']:.2f} | {r['tier']} | {st}{mark} |"
            )
        only_sample = sorted(set(theirs) - ours)
        report += ["", f"In the sample but not the pilot: {', '.join(only_sample) if only_sample else 'none'}", ""]

        for r in rows:
            e = r["e"]
            t = {"name": e["name"], "tags": {tag: r["tier"]}}
            if e.get("aliases"):
                t["aliases"] = e["aliases"]
            terms.append(t)

    out = REPO / "src" / "data" / "generated" / "pilot.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({"tags": [t for t in cands if not t.startswith("_")], "terms": terms}, indent=1, ensure_ascii=False) + "\n")
    (REPO / "scripts" / "pilot" / "report.md").write_text("\n".join(report) + "\n")
    print(f"wrote {out.relative_to(REPO)} ({len(terms)} terms) and scripts/pilot/report.md")


if __name__ == "__main__":
    main()
