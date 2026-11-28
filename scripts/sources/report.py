"""The comparison report a combiner writes to design/sources/<id>.md. Stdlib only."""
import datetime
import json

import common as C


def stamps(paths: list[str]) -> list[str]:
    out = []
    for rel in paths:
        f = C.CORPORA / (rel + ".source.json")
        if f.exists():
            m = json.loads(f.read_text())
            out.append(f"- `{rel}`: {m.get('fetched', '?')[:10]}, {m.get('note', '')}".rstrip(", "))
    return out


def write(cid: str, prompt: str, entries: list, cutoffs: list[float], matched: list[dict], rejected: dict,
          probe: list[dict] | None, tails: list[str], info: dict, sources_doc: str, progs: dict | None = None,
          inputs: list[str] = (), notes: list[str] = ()) -> None:
    ag = C.agreement(matched)
    bank = [m for m in matched]
    hit = [m for m in bank if m["entry"]]
    miss = [m for m in bank if not m["entry"]]
    bank_keys = {C.norm(n) for m in bank for n in [m["bank"]["name"], *m["bank"]["aliases"]]}
    extra = sorted((e for e in entries if not (e.keys() & bank_keys)), key=lambda e: -e.score)
    prog_owner: dict[str, str] = {}
    for pkg, ns in (progs or {}).items():
        for n in ns:
            prog_owner.setdefault(C.norm(n), pkg)

    def why(m):
        ks = [C.norm(n) for n in [m["bank"]["name"], *m["bank"]["aliases"]]]
        for k in ks:
            if k in rejected:
                return "rejected: " + rejected[k]
        for k in ks:
            if k in prog_owner:
                return f"a Debian program (of {prog_owner[k]}), but not from a daemon-tagged or service-unit package"
        return "in no source"

    by_tier = {t: [m for m in bank if m["bank"]["tier"] == t] for t in ["off-by-one", "womm", "npe", "leak", "race", "heisenbug", "bitflip"]}
    lines = [
        f"# Source-first derivation: {cid} ({prompt})", "",
        f"Generated {datetime.date.today().isoformat()} by `python3 -I scripts/sources/{cid.replace('-', '_')}.py`. "
        "No LLM in the path; rerunning on the same corpora gives the same output. The bank was not changed: merging "
        "is the owner's call.", "",
        "## Summary", "",
        f"- **{len(entries)} derived answers** (`~/nullion-corpora/derived/{cid}.json`).",
        f"- **Bank coverage:** {len(hit)}/{len(bank)} of the bank's playable answers are in the derived set.",
        f"- **Tier agreement** on the {ag['n']} bank ladder answers found (Works on my machine and Bit Flip are hand "
        f"picks, left out): exact {ag['exact']}/{ag['n']} ({ag['exact'] / max(ag['n'], 1):.0%}), within one tier "
        f"{ag['within_one']}/{ag['n']} ({ag['within_one'] / max(ag['n'], 1):.0%}), Spearman {ag['spearman']}.",
        f"- **Cut-offs** (score >= c): " + ", ".join(f"{t} {c}" for t, c in zip(C.LADDER, cutoffs)) + ", else heisenbug.",
        f"- **Derived tier counts:** " + ", ".join(f"{t} {sum(e.tier == t for e in entries)}" for t in C.LADDER) + ".",
    ]
    pr = None
    if probe is not None:
        sec, pr = C.probe_section(entries, cid, probe, tails)
        idx = C.key_index(entries)
        fam: dict[str, int] = {}
        for x in probe:
            e = C.lookup(idx, x["name"], x.get("aliases", []), tails)
            for f in sorted({s.split(":")[0] for s in e.sources} if e else ()):
                fam[f] = fam.get(f, 0) + 1
        lines.append(f"- **Probe:** derived {pr['derived']}/{pr['n']}, current bank {pr['bank']}/{pr['n']}. Each source "
                     "alone: " + ", ".join(f"{k} {v}" for k, v in sorted(fam.items(), key=lambda kv: -kv[1])) + ".")
    lines += ["", "Caveat: the cut-offs are fitted on the same bank answers the agreement is measured on (in-sample), "
              "and the bank's tiers were themselves judged by an LLM; the agreement is an upper bound on how well "
              "the formula reproduces the bank, not a measure of truth.", *notes, "", "## Sources and rules", "", "```", sources_doc.strip(), "```", "",
              "Distinct names per source (before merging): " + ", ".join(f"{k} {v}" for k, v in info["counts"].items()) + ".",
              "", *(["Inputs:", *stamps(list(inputs)), ""] if inputs else []),
              "## Familiarity", "", "```", (C.__doc__ or "").split("Familiarity (documented in each report):", 1)[1].strip(), "```", "",
              "Confusion (rows: bank tier, columns: derived tier):", "", *C.confusion(matched), "",
              "Biggest disagreements (two or more tiers apart):", ""]
    far = sorted((m for m in hit if m["bank"]["tier"] in C.LADDER and
                  abs(C.LADDER.index(m["bank"]["tier"]) - C.LADDER.index(m["entry"].tier)) >= 2),
                 key=lambda m: -abs(C.LADDER.index(m["bank"]["tier"]) - C.LADDER.index(m["entry"].tier)))
    lines += [f"- {m['bank']['name']}: bank {m['bank']['tier']}, derived {m['entry'].tier} (score {m['entry'].score}, "
              f"se {m['entry'].signals.get('se')}{', ' + str(m['entry'].evidence.get('se')) if m['entry'].evidence.get('se') else ''})"
              for m in far] or ["- none"]
    lines += ["", "## Bank coverage by tier", ""]
    for t, ms in by_tier.items():
        if ms:
            lines.append(f"- {t}: {sum(1 for m in ms if m['entry'])}/{len(ms)}")
    lines += ["", f"## In the bank, not derived ({len(miss)})", ""]
    lines += [f"- {m['bank']['name']} ({m['bank']['tier']}): {why(m)}" for m in sorted(miss, key=lambda m: m['bank']['name'].lower())]
    lines += ["", f"## Derived, not in the bank ({len(extra)})", "",
              "By source: " + ", ".join(f"{s} {sum(1 for e in extra if s in e.sources)}" for s in sorted({s for e in extra for s in e.sources})) + ".",
              "", "Top 60 by score (name, derived tier, score, sources):", ""]
    lines += [f"- {e.name} ({e.tier}, {e.score}; {', '.join(sorted(e.sources))})" for e in extra[:60]]
    lines += ["", "## Sample per derived tier (top 15 by score)", ""]
    for t in C.LADDER:
        es = sorted((e for e in entries if e.tier == t), key=lambda e: -e.score)
        lines.append(f"- **{t}** ({len(es)}): " + ", ".join(e.name for e in es[:15]))
    if pr is not None:
        lines += ["", "## Probe (scripts/bank/runs/%s/probe.json)" % cid, "", *sec]
    out = C.REPO / "design" / "sources" / f"{cid}.md"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(lines) + "\n")
    print(f"report -> {out.relative_to(C.REPO)}")
