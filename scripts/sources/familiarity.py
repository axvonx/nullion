#!/usr/bin/env python3
"""Familiarity scoring experiment: a decision model (TypeSafe Jev) vs Claude Haiku vs the source-derived score.

Usage: python3 -I scripts/sources/familiarity.py <category id>... [--no-haiku]

Every tiered answer of the category except Bit Flip and Works on my machine (the owner hand-picks those) is scored on
one 8-level rubric: "how many programmers would think of this as their answer to the prompt?" (0 = only deep
specialists ... 7 = nearly everyone).
  - Jev: a Score question per answer, 25 per request (POST https://api.typesafe.ai/v1/systemone, model jev-latest,
    key in TYPESAFE_API_KEY); the probability-weighted mean is the score.
  - Haiku: the same rubric, 50 answers per call, an integer level each (llm.call, validated, retried once).
Scores map to tiers by fixed level bands (LEVEL_TIERS), the same for every category, so "most programmers" means
Off-by-one everywhere. Results are cached in scripts/bank/runs/<id>/familiarity-{jev,haiku}.json; the report is
design/scoring/<id>.md: rank correlations, tier agreement, the distribution per tier, and the biggest disagreements.
Nothing is written to bank/.
"""
import json
import os
import pathlib
import sys
import time
import urllib.error
import urllib.request

REPO = pathlib.Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO / "scripts" / "bank"))
import llm  # noqa: E402  # pyright: ignore[reportMissingImports]
import misses  # noqa: E402  # pyright: ignore[reportMissingImports]
import pipeline  # noqa: E402  # pyright: ignore[reportMissingImports]

LEVELS = ["Almost nobody: only deep specialists know it", "Very few", "Few", "Some systems people",
          "Many systems people", "Many programmers", "Most programmers", "Nearly everyone"]
# Score (0-7) -> tier. Lower bound inclusive.
LEVEL_TIERS = [(5.5, "off-by-one"), (4.0, "npe"), (2.6, "leak"), (1.3, "race"), (0.0, "heisenbug")]
LADDER = ["off-by-one", "npe", "leak", "race", "heisenbug"]
HEADING_TIER = {"Off-by-one": "off-by-one", "Null pointer exception": "npe", "Memory leak": "leak",
                "Race condition": "race", "Heisenbug": "heisenbug"}
JEV_URL = "https://api.typesafe.ai/v1/systemone"
JEV_BATCH = 25
HAIKU_BATCH = 50
DERIVED = pathlib.Path("~/nullion-corpora/derived").expanduser()


def tier_of(score: float) -> str:
    return next(t for lo, t in LEVEL_TIERS if score >= lo)


def label(a: dict) -> str:
    al = [x for x in a["aliases"] if x.lower() != a["name"].lower()][:3]
    return f"'{a['name']}'" + (f" (also called {', '.join(al)})" if al else "")


def jev(prompt: str, answers: list[dict], cache: dict) -> dict:
    key = os.environ.get("TYPESAFE_API_KEY")
    if not key:
        raise SystemExit("TYPESAFE_API_KEY is not set")
    todo = [a for a in answers if a["name"] not in cache]
    for i in range(0, len(todo), JEV_BATCH):
        chunk = todo[i:i + JEV_BATCH]
        body = {"model": "jev-latest",
                "state": {"prompt": prompt, "context": "A computing-trivia game asks programmers this prompt; each player types one answer."},
                "questions": {str(j): {"type": "score", "criteria": LEVELS,
                                       "instructions": f"How many programmers would think of {label(a)} as their answer to this prompt?"}
                              for j, a in enumerate(chunk)}}
        req = urllib.request.Request(JEV_URL, data=json.dumps(body).encode(), method="POST",
                                     headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"})
        out: dict = {}
        for attempt in range(4):
            try:
                with urllib.request.urlopen(req, timeout=120) as r:
                    out = json.loads(r.read())
                break
            except urllib.error.HTTPError as e:
                if e.code in (429, 500, 502, 503) and attempt < 3:
                    time.sleep(2 ** attempt * 3)
                    continue
                raise RuntimeError(f"Jev HTTP {e.code}: {e.read()[:300]!r}") from e
        ans = out["answers"]
        if set(ans) != {str(j) for j in range(len(chunk))}:
            raise RuntimeError(f"Jev returned answers for {sorted(ans)} instead of 0..{len(chunk) - 1}")
        for j, a in enumerate(chunk):
            cache[a["name"]] = {"score": ans[str(j)]["score"], "confidence": ans[str(j)]["confidence"]}
    return cache


def haiku(prompt: str, answers: list[dict], cache: dict) -> dict:
    todo = [a for a in answers if a["name"] not in cache]
    rubric = "\n".join(f"  {i} = {t}" for i, t in enumerate(LEVELS))
    for i in range(0, len(todo), HAIKU_BATCH):
        chunk = todo[i:i + HAIKU_BATCH]
        ask = f"""A computing-trivia game asks programmers: "{prompt}". Each player types one answer.
For each answer below, how many programmers would think of it as their answer? Use this scale:
{rubric}
{chr(10).join(f'- {label(a)}' for a in chunk)}
Reply with ONLY a JSON object mapping each answer name exactly as quoted (without the quotes) to an integer 0-7."""
        names = [a["name"] for a in chunk]

        def check(d, names=names):
            if not isinstance(d, dict) or set(d) != set(names) or not all(isinstance(v, int) and 0 <= v <= 7 for v in d.values()):
                raise ValueError(f"need exactly these keys {names[:3]}... with integers 0-7")
            return d
        for n, v in llm.call("haiku", ask, check).items():
            cache[n] = {"score": float(v)}
    return cache


def ranks(xs: list[float]) -> list[float]:
    order = sorted(range(len(xs)), key=lambda i: xs[i])
    r = [0.0] * len(xs)
    i = 0
    while i < len(order):
        j = i
        while j + 1 < len(order) and xs[order[j + 1]] == xs[order[i]]:
            j += 1
        for k in range(i, j + 1):
            r[order[k]] = (i + j) / 2
        i = j + 1
    return r


def spearman(a: list[float], b: list[float]) -> float:
    ra, rb = ranks(a), ranks(b)
    n = len(a)
    ma, mb = sum(ra) / n, sum(rb) / n
    cov = sum((x - ma) * (y - mb) for x, y in zip(ra, rb))
    va = sum((x - ma) ** 2 for x in ra) ** 0.5
    vb = sum((y - mb) ** 2 for y in rb) ** 0.5
    return cov / (va * vb) if va and vb else float("nan")


def agree(t1: list[str], t2: list[str]) -> tuple[float, float]:
    d = [abs(LADDER.index(x) - LADDER.index(y)) for x, y in zip(t1, t2)]
    return sum(x == 0 for x in d) / len(d), sum(x <= 1 for x in d) / len(d)


def run(cid: str, use_haiku: bool) -> None:
    b = pipeline.parse_bank(pipeline.bank_path(cid))
    answers = [{**a, "bank": HEADING_TIER[h]} for h, lst in b["tiers"].items() if h in HEADING_TIER for a in lst]
    rdir = REPO / "scripts" / "bank" / "runs" / cid
    rdir.mkdir(parents=True, exist_ok=True)
    jp, hp = rdir / "familiarity-jev.json", rdir / "familiarity-haiku.json"
    t0 = time.time()
    J = jev(b["prompt"], answers, json.loads(jp.read_text()) if jp.exists() else {})
    jp.write_text(json.dumps(J, indent=1, ensure_ascii=False) + "\n")
    tj = time.time() - t0
    H = {}
    if use_haiku:
        t0 = time.time()
        H = haiku(b["prompt"], answers, json.loads(hp.read_text()) if hp.exists() else {})
        hp.write_text(json.dumps(H, indent=1, ensure_ascii=False) + "\n")
    th = time.time() - t0 if use_haiku else 0
    derived = {}
    dfile = DERIVED / f"{cid}.json"
    if dfile.exists():
        for e in json.loads(dfile.read_text()):
            for n in [e["name"], *e["aliases"]]:
                derived.setdefault(misses.norm(n), e["score"])
    rows = []
    for a in answers:
        src = next((derived[misses.norm(n)] for n in [a["name"], *a["aliases"]] if misses.norm(n) in derived), None)
        rows.append({"name": a["name"], "bank": a["bank"], "jev": J[a["name"]]["score"],
                     "haiku": H[a["name"]]["score"] if H else None, "source": src})
    bank_rank = [-LADDER.index(r["bank"]) for r in rows]
    jt = [tier_of(r["jev"]) for r in rows]
    lines = [f"# Familiarity scoring: {cid} ({b['prompt']})", "",
             f"{len(rows)} tiered answers (Bit Flip and Works on my machine left out). Jev: {tj:.0f}s. Haiku: {th:.0f}s.",
             f"Level bands -> tier: {LEVEL_TIERS}", "", "## Rank correlation (Spearman)", "",
             "| | Jev | Haiku | source score | bank tier |", "|---|---|---|---|---|"]
    cols = {"Jev": [r["jev"] for r in rows], "bank tier": bank_rank}
    if H:
        cols["Haiku"] = [r["haiku"] for r in rows]
    have_src = [i for i, r in enumerate(rows) if r["source"] is not None]
    for a_name in ("Jev", "Haiku"):
        if a_name not in cols:
            continue
        cells = []
        for b_name in ("Jev", "Haiku", "source score", "bank tier"):
            if b_name == "source score":
                v = spearman([cols[a_name][i] for i in have_src], [rows[i]["source"] for i in have_src]) if len(have_src) > 5 else float("nan")
                cells.append(f"{v:.2f} (n={len(have_src)})")
            elif b_name in cols:
                cells.append(f"{spearman(cols[a_name], cols[b_name]):.2f}")
            else:
                cells.append("")
        lines.append(f"| {a_name} | " + " | ".join(cells) + " |")
    lines += ["", "## Tier agreement (exact / within one tier)", ""]
    lines.append(f"- Jev vs bank: {agree(jt, [r['bank'] for r in rows])[0]:.0%} / {agree(jt, [r['bank'] for r in rows])[1]:.0%}")
    if H:
        ht = [tier_of(r["haiku"]) for r in rows]
        lines.append(f"- Haiku vs bank: {agree(ht, [r['bank'] for r in rows])[0]:.0%} / {agree(ht, [r['bank'] for r in rows])[1]:.0%}")
        lines.append(f"- Jev vs Haiku: {agree(jt, ht)[0]:.0%} / {agree(jt, ht)[1]:.0%}")
    lines += ["", "## Answers per tier", "", "| tier | bank | Jev | Haiku |", "|---|---|---|---|"]
    for t in LADDER:
        lines.append(f"| {t} | {sum(r['bank'] == t for r in rows)} | {jt.count(t)} | {sum(tier_of(r['haiku']) == t for r in rows) if H else ''} |")
    lines += ["", "## Jev's top 25", "", ", ".join(f"{r['name']} {r['jev']:.1f}" for r in sorted(rows, key=lambda r: -r["jev"])[:25])]
    if H:
        gap = sorted(rows, key=lambda r: -abs(r["jev"] - r["haiku"]))[:25]
        lines += ["", "## Biggest Jev / Haiku disagreements", "", "| answer | bank | Jev | Haiku |", "|---|---|---|---|",
                  *[f"| {r['name']} | {r['bank']} | {r['jev']:.1f} | {r['haiku']:.0f} |" for r in gap]]
    out = REPO / "design" / "scoring" / f"{cid}.md"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(lines) + "\n")
    print("\n".join(lines[:22]))
    print(f"-> {out.relative_to(REPO)}")


if __name__ == "__main__":
    ids = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not ids:
        raise SystemExit(__doc__)
    for cid in ids:
        run(cid, "--no-haiku" not in sys.argv)
