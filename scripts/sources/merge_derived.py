#!/usr/bin/env python3
"""Merge a source-first derived list (~/nullion-corpora/derived/<id>.json) into its bank category.

Usage: python3 -I scripts/sources/merge_derived.py <id> [--dry-run] [--jobs N]

1. Names the bank already plays (any name or alias) are skipped.
2. The rest are judged for MEMBERSHIP only (misses.judge, scope-aware, 25 per call, Haiku): the sources decide what
   exists and how familiar it is; the model only throws out noise (Debian jobs and clients, IDEs, a macOS helper
   that is not a daemon). Its tier opinion is ignored: the derived tier (familiarity score) is kept.
3. Members are appended as (auto) through scripts/wikidata-merge.py's plain-list mode (never moves or edits a line;
   skips anything whose name or alias exists; drops aliases two new entries claim).
Writes design/sources/<id>-merge.md (every judged name, kept or dropped, with the reason). Verdicts are cached in
scripts/bank/runs/<id>/derived-verdicts.json, so a rerun only judges new names.
"""
import argparse
import concurrent.futures
import json
import pathlib
import subprocess
import sys

REPO = pathlib.Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(REPO / "scripts" / "bank"))
import misses  # noqa: E402  # pyright: ignore[reportMissingImports]

DERIVED = pathlib.Path("~/nullion-corpora/derived").expanduser()
CHUNK = 25


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("id")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--jobs", type=int, default=6)
    a = ap.parse_args()
    cid = a.id
    derived = json.loads((DERIVED / f"{cid}.json").read_text())
    bank = misses.bank_file(cid)
    text = bank.read_text()
    prompt = text.splitlines()[0].lstrip("# ").strip()
    scope_file = REPO / "scripts" / "bank" / "scopes" / f"{cid}.md"
    if not scope_file.exists():
        raise SystemExit(f"{cid}: no scope spec at {scope_file.relative_to(REPO)}: membership is judged against it")
    scope = scope_file.read_text().strip()
    playable = misses.playable_keys(text)
    fresh = [e for e in derived if not any(misses.norm(n) in playable for n in [e["name"], *e["aliases"]])]
    cache_path = REPO / "scripts" / "bank" / "runs" / cid / "derived-verdicts.json"
    cache = json.loads(cache_path.read_text()) if cache_path.exists() else {}
    todo = [e["name"] for e in fresh if e["name"] not in cache]
    print(f"{cid}: {len(derived)} derived, {len(derived) - len(fresh)} already playable, {len(fresh)} new, {len(todo)} to judge")
    if todo and not a.dry_run:
        log = REPO / "scripts" / "bank" / "runs" / cid / "logs" / "derived-judge.log"
        chunks = [todo[i:i + CHUNK] for i in range(0, len(todo), CHUNK)]
        accepts = misses.accepts_line(text)
        with concurrent.futures.ThreadPoolExecutor(a.jobs) as ex:
            for names, verdicts in zip(chunks, ex.map(lambda c: misses.judge(prompt, accepts, c, log, scope), chunks)):
                for n, v in zip(names, verdicts):
                    cache[n] = {"member": v["member"], "why": v["why"]}
                cache_path.parent.mkdir(parents=True, exist_ok=True)
                cache_path.write_text(json.dumps(cache, indent=1, ensure_ascii=False) + "\n")
    if a.dry_run:
        return 0
    missing = [e["name"] for e in fresh if e["name"] not in cache]
    if missing:
        raise SystemExit(f"{cid}: {len(missing)} names have no verdict: {missing[:5]}")
    keep = [e for e in fresh if cache[e["name"]]["member"]]
    drop = [e for e in fresh if not cache[e["name"]]["member"]]
    plain = [{"name": e["name"], "aliases": e["aliases"], "tier": e["tier"]} for e in keep]
    tmp = REPO / "scripts" / "bank" / "runs" / cid / "derived-keep.json"
    tmp.write_text(json.dumps(plain, indent=1, ensure_ascii=False) + "\n")
    out = subprocess.run([sys.executable, "-I", str(REPO / "scripts" / "wikidata-merge.py"), cid, str(tmp)],
                         cwd=REPO, check=True, capture_output=True, text=True).stdout
    subprocess.run(["npm", "run", "-s", "bank:index"], cwd=REPO, check=True, capture_output=True)
    report = REPO / "design" / "sources" / f"{cid}-merge.md"
    line = lambda e: f"- {e['name']} ({e['tier']}; {', '.join(sorted(set(e['sources'])))}): {cache[e['name']]['why']}"  # noqa: E731
    report.write_text("\n".join([
        f"# Merge of the derived {cid} list into the bank", "",
        f"{len(derived)} derived; {len(derived) - len(fresh)} already playable; {len(keep)} judged members and merged as "
        f"(auto); {len(drop)} judged not members and left out (membership by Haiku against the scope spec; tiers from "
        f"the familiarity score).", "", "```", out.strip(), "```", "",
        "## Merged", *map(line, keep), "", "## Left out", *map(line, drop), ""]))
    print(f"{cid}: merged {len(keep)}, left out {len(drop)} -> {report.relative_to(REPO)}")
    print(out.strip().splitlines()[-1] if out.strip() else "")
    return 0


if __name__ == "__main__":
    sys.exit(main())
