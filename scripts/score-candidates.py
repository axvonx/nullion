#!/usr/bin/env python3
"""Score candidate answers against the local corpora and assign tiers (pilot of option 3: counts + hand pins).

Usage: python3 -I scripts/score-candidates.py scripts/pilot/candidates.json ~/nullion-corpora
Merges into the human-edited bank (bank/<domain>/<tag>.md; grammar in src/data/bank-format.ts) and writes a
report per category to bank/reports/<tag>.md. The human file always wins:
- a category file with no tiered answers yet (a fresh draft) gets its tiers filled in;
- once it has tiered answers, nothing in it is moved or deleted. New candidates are appended to its Inbox with a
  suggested tier, and the report lists answers whose file tier and scored tier differ by more than one.
Every tag in the candidates file must already have a bank file.

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


TIER_HEADINGS = {"Off-by-one": "off-by-one", "Works on my machine": "womm", "Null pointer exception": "npe",
                 "Memory leak": "leak", "Race condition": "race", "Heisenbug": "heisenbug", "Bit Flip": "bitflip"}
HEADING_OF = {v: k for k, v in TIER_HEADINGS.items()}
ORDER = list(HEADING_OF)
SUGGESTED = re.compile(r"^(.*?)\s+\(suggested: ([a-z-]+)\)$")


def bank_file(tag: str) -> pathlib.Path:
    hits = [h for h in (REPO / "bank").glob(f"*/{tag}.md") if h.parent.name != "reports"]
    if len(hits) != 1:
        raise RuntimeError(f"{tag}: expected exactly one bank/<domain>/{tag}.md, found {len(hits)}")
    return hits[0]


def read_bank(path: pathlib.Path) -> dict:
    """Lenient reader for merging (the strict grammar lives in bank-format.ts and runs in npm test)."""
    head, tiers, inbox, section = [], {}, [], None
    for line in path.read_text().split("\n"):
        if line.startswith("## "):
            section = TIER_HEADINGS.get(line[3:].strip(), "inbox" if line[3:].strip() == "Inbox" else None)
            if section is None:
                raise RuntimeError(f"{path}: unknown section {line!r}")
        elif section is None:
            if line.strip():
                head.append(line)
        elif line.startswith("- "):
            body = line[2:].strip()
            if section == "inbox":
                m = SUGGESTED.match(body)
                names = (m.group(1) if m else body).split(" | ")
                inbox.append({"names": names, "suggested": m.group(2) if m else None, "line": line})
            else:
                tiers[body.split(" | ")[0].lower()] = section
                tiers.setdefault("_lines", []).append((section, line))
        elif line.strip() and section != "inbox" and tiers.get("_lines"):
            tiers["_lines"].append((section, line))  # an indented note follows its answer
    lines = tiers.pop("_lines", [])
    keys = set(tiers)
    for e in inbox:
        keys |= {n.lower() for n in e["names"]}
    for _, l in lines:
        if l.startswith("- "):
            keys |= {n.lower() for n in l[2:].strip().split(" | ")}
    return {"head": head, "tiers": tiers, "lines": lines, "inbox": inbox, "keys": keys}


def entry_line(e: dict) -> str:
    return "- " + " | ".join([e["name"], *[a for a in e.get("aliases", []) if a.lower() != e["name"].lower()]])


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    cands = json.loads(pathlib.Path(sys.argv[1]).read_text())
    con = sqlite3.connect(pathlib.Path(sys.argv[2]).expanduser() / "index" / "corpora.sqlite")
    present = {r[0] for r in con.execute("SELECT name FROM sqlite_master")}
    tables = [t for t in TABLES if t in present]
    if not tables:
        raise RuntimeError("no corpus tables indexed")

    merged, reports = {}, {}
    HEADER = ["# Scoring report", "", f"Corpora: {', '.join(tables)}. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked {NORM_RANK + 1} in the category; weights {WEIGHTS}; cut-offs {CUTOFFS}.", ""]
    for tag, entries in cands.items():
        if tag.startswith("_"):
            continue
        report = [*HEADER]
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

        # Pins matter only when filling a fresh draft; merging into a tiered file never touches its picks.
        pins = [r for r in rows if r["e"].get("pin") == "bitflip"]
        fresh = not read_bank(bank_file(tag))["lines"]
        if fresh and len(pins) != 1:
            raise RuntimeError(f"{tag}: filling a fresh draft needs exactly one bitflip pin, have {len(pins)}")
        if not fresh and pins:
            raise RuntimeError(f"{tag}: has tiers already; pick its Bit Flip in the bank file, not with a pin")

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

        path = bank_file(tag)
        bank = read_bank(path)
        theirs = bank["tiers"]
        ours = {r["e"]["name"].lower() for r in rows}
        report += [f"## {tag}", "", f"{len(rows)} candidates; {sum(1 for r in rows if r.get('flag'))} with no evidence.", ""]
        report += ["| answer | " + " | ".join(tables) + " | score | tier | source | judge | bank file |", "|---" * (len(tables) + 6) + "|"]
        for r in sorted(rows, key=lambda r: -r["score"]):
            name = r["e"]["name"]
            st = theirs.get(name.lower(), "—")
            mark = "" if st in ("—", r["tier"]) else " ≠"
            flag = f" ⚠ {r['flag']}" if r.get("flag") else ""
            report.append(
                f"| {name}{flag} | " + " | ".join(str(r["counts"][t]) for t in tables) + f" | {r['score']:.2f} | {r['tier']} | {r['source']} | {r['e'].get('judge', '—')} | {st}{mark} |"
            )
        only_bank = sorted(set(theirs) - ours)
        far = [r for r in rows if r["e"]["name"].lower() in theirs and theirs[r["e"]["name"].lower()] in LADDER
               and r["tier"] in LADDER and abs(LADDER.index(theirs[r["e"]["name"].lower()]) - LADDER.index(r["tier"])) > MAX_DISAGREE]
        flagged = [r for r in rows if r.get("flag", "").startswith("counts said")]
        report += ["", f"Counts vs judgement disagreed by more than {MAX_DISAGREE} tier (judgement used, please review): "
                   + (", ".join(f"{r['e']['name']} ({r['flag']}, now {r['tier']})" for r in flagged) or "none")]
        report += ["", "Your file tier and the scored tier differ by more than one (your file wins; worth a look): "
                   + (", ".join(f"{r['e']['name']} (file {theirs[r['e']['name'].lower()]}, scored {r['tier']})" for r in far) or "none")]
        report += ["", f"In the bank file but not scored: {', '.join(only_bank) if only_bank else 'none'}", ""]

        if not bank["lines"]:
            # Fresh draft: fill the tiers. Keep inbox items the candidates don't cover.
            scored = {n.lower() for r in rows for n in [r["e"]["name"], *r["e"].get("aliases", [])]}
            out = list(bank["head"])
            for t in ORDER:
                es = [r["e"] for r in rows if r["tier"] == t]
                if es:
                    out += ["", f"## {HEADING_OF[t]}", *[entry_line(e) for e in es]]
            keep = [e["line"] for e in bank["inbox"] if not any(n.lower() in scored for n in e["names"])]
            if keep:
                out += ["", "## Inbox", *keep]
            path.write_text("\n".join(out) + "\n")
            merged[tag] = f"filled {len(rows)} answers"
        else:
            new = [r for r in rows if not ({n.lower() for n in [r["e"]["name"], *r["e"].get("aliases", [])]} & bank["keys"])]
            if new:
                text = path.read_text().rstrip("\n")
                if not bank["inbox"] and "\n## Inbox" not in text:
                    text += "\n\n## Inbox"
                text += "\n" + "\n".join(f"{entry_line(r['e'])} (suggested: {r['tier']})" for r in new)
                path.write_text(text + "\n")
            merged[tag] = f"{len(new)} new candidates to the Inbox"
        reports[tag] = report

    out_dir = REPO / "bank" / "reports"
    out_dir.mkdir(parents=True, exist_ok=True)
    for tag, rep_lines in reports.items():
        (out_dir / f"{tag}.md").write_text("\n".join(rep_lines) + "\n")
    for tag, what in merged.items():
        print(f"{tag}: {what}")
    print("then: npm run bank:index && npm test")


if __name__ == "__main__":
    main()
