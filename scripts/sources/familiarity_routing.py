#!/usr/bin/env python3
"""Two-dimensional familiarity: Jev's score plus a confidence; low-confidence answers go to Haiku.

Usage: python3 -I scripts/sources/familiarity_routing.py <category id>...

Builds on scripts/sources/familiarity.py's cached Jev scores and Haiku levels (run that first). Adds, per answer, a
Jev Choice question "how well do you recognise this exact name?" with options high / medium / low (asked in the same
request shape, 25 answers per request; cached in scripts/bank/runs/<id>/familiarity-jev-recognition.json).
Compares two confidence signals: (a) Jev's built-in Score confidence (how concentrated its distribution is), split
into thirds by a fixed threshold, and (b) the explicit recognition choice. For each, reports how rare "low" is, how
often low lands on answers where Jev and the source score disagree, and the rank correlation with the source score
of: Jev alone, Haiku alone, and Jev routed (low-confidence answers take Haiku's level).
Writes design/scoring/<id>-routing.md. Nothing is written to bank/.
"""
import json
import os
import pathlib
import sys
import time
import urllib.error
import urllib.request

REPO = pathlib.Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO / "scripts" / "sources"))
sys.path.insert(0, str(REPO / "scripts" / "bank"))
import familiarity as F  # noqa: E402  # pyright: ignore[reportMissingImports]
import misses  # noqa: E402  # pyright: ignore[reportMissingImports]
import pipeline  # noqa: E402  # pyright: ignore[reportMissingImports]

RECOGNITION = {
    "high": "You know exactly what this is: you could describe it and where it is used",
    "medium": "You have seen the name and roughly know what it is",
    "low": "You do not recognise this exact name, or you would be guessing",
}
BUILTIN_LOW = 0.45  # Jev Score confidence below this counts as low (fixed, not fitted)


def recognition(prompt: str, answers: list[dict], cache: dict) -> dict:
    key = os.environ.get("TYPESAFE_API_KEY")
    if not key:
        raise SystemExit("TYPESAFE_API_KEY is not set")
    todo = [a for a in answers if a["name"] not in cache]
    for i in range(0, len(todo), F.JEV_BATCH):
        chunk = todo[i:i + F.JEV_BATCH]
        body = {"model": "jev-latest", "state": {"prompt": prompt, "context": "A computing-trivia game asks programmers this prompt."},
                "questions": {str(j): {"type": "choice", "criteria": RECOGNITION,
                                       "instructions": f"How well do you recognise {F.label(a)} as an answer to this prompt?"}
                              for j, a in enumerate(chunk)}}
        req = urllib.request.Request(F.JEV_URL, data=json.dumps(body).encode(), method="POST",
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
            cache[a["name"]] = {"choice": ans[str(j)]["choice"], "probabilities": ans[str(j)]["probabilities"],
                                "confidence": ans[str(j)]["confidence"]}
    return cache


def run(cid: str) -> None:
    b = pipeline.parse_bank(pipeline.bank_path(cid))
    answers = [a for h, lst in b["tiers"].items() if h in F.HEADING_TIER for a in lst]
    rdir = REPO / "scripts" / "bank" / "runs" / cid
    J = json.loads((rdir / "familiarity-jev.json").read_text())
    H = json.loads((rdir / "familiarity-haiku.json").read_text())
    rp = rdir / "familiarity-jev-recognition.json"
    R = recognition(b["prompt"], answers, json.loads(rp.read_text()) if rp.exists() else {})
    rp.write_text(json.dumps(R, indent=1, ensure_ascii=False) + "\n")
    der = {}
    for e in json.loads((F.DERIVED / f"{cid}.json").read_text()):
        for n in [e["name"], *e["aliases"]]:
            der.setdefault(misses.norm(n), e["score"])
    names = [a["name"] for a in answers if a["name"] in J and a["name"] in H and misses.norm(a["name"]) in der]
    src = {n: der[misses.norm(n)] for n in names}
    # "Jev is wrong" proxy: its rank and the source score's rank differ by more than a third of the list.
    rj = dict(zip(names, F.ranks([J[n]["score"] for n in names])))
    rs = dict(zip(names, F.ranks([src[n] for n in names])))
    wrong = {n for n in names if abs(rj[n] - rs[n]) > len(names) / 3}
    signals = {
        "built-in confidence": {n: ("low" if J[n]["confidence"] < BUILTIN_LOW else "ok") for n in names},
        "recognition: low": {n: ("low" if R[n]["choice"] == "low" else "ok") for n in names},
        "recognition: low or medium": {n: ("low" if R[n]["choice"] in ("low", "medium") else "ok") for n in names},
    }
    corr = lambda xs: F.spearman([xs[n] for n in names], [src[n] for n in names])  # noqa: E731
    lines = [f"# Confidence routing: {cid} ({b['prompt']})", "", f"{len(names)} answers with a source score. "
             f"'Jev wrong' = its rank and the source score's differ by more than a third of the list: {len(wrong)} answers.",
             "", f"Recognition choices: high {sum(R[n]['choice'] == 'high' for n in names)}, medium "
             f"{sum(R[n]['choice'] == 'medium' for n in names)}, low {sum(R[n]['choice'] == 'low' for n in names)}.", "",
             "| routing signal | low share | of the low ones, Jev wrong | of Jev wrong, caught | Spearman vs source: routed |",
             "|---|---|---|---|---|"]
    for label, sig in signals.items():
        low = [n for n in names if sig[n] == "low"]
        routed = {n: (H[n]["score"] if sig[n] == "low" else J[n]["score"]) for n in names}
        lines.append(f"| {label} | {len(low) / len(names):.0%} ({len(low)}) | "
                     f"{(len(set(low) & wrong) / len(low)) if low else 0:.0%} | {(len(set(low) & wrong) / len(wrong)) if wrong else 0:.0%} | "
                     f"{corr(routed):.2f} |")
    lines += ["", f"Baselines, Spearman vs source: Jev alone {corr({n: J[n]['score'] for n in names}):.2f}, "
              f"Haiku alone {corr({n: H[n]['score'] for n in names}):.2f}, "
              f"mean of both {corr({n: (J[n]['score'] + H[n]['score']) / 2 for n in names}):.2f}.", "",
              "## Recognition 'low', by Jev score (highest first)", "",
              ", ".join(f"{n} {J[n]['score']:.1f}" for n in sorted((n for n in names if R[n]['choice'] == 'low'), key=lambda n: -J[n]['score'])[:40]),
              "", "## Recognition 'high'", "",
              ", ".join(n for n in sorted((n for n in names if R[n]['choice'] == 'high'), key=lambda n: -J[n]['score'])[:60])]
    out = REPO / "design" / "scoring" / f"{cid}-routing.md"
    out.write_text("\n".join(lines) + "\n")
    print("\n".join(lines[:14]))


if __name__ == "__main__":
    ids = sys.argv[1:]
    if not ids:
        raise SystemExit(__doc__)
    for cid in ids:
        run(cid)
