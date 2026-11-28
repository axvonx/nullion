#!/usr/bin/env python3
"""One entry point for the answer bank: fetch sources, derive answers, score tiers, check. Stdlib only.

  npm run bank:build -- all [--no-backup]     fetch -> derive -> score -> check
  npm run bank:build -- fetch [--no-backup]   corpora + references into ~/nullion-corpora, then a restic backup
  npm run bank:build -- derive [<id>...]      source-first builders (scripts/sources/<id>.py) + membership merge
  npm run bank:build -- score [<id>...]       Jev familiarity + evidence tiers, applied to (auto) lines (all if none)
  npm run bank:build -- check                 bank index + the full test suite
  npm run bank:build -- new "<prompt>" --domain <domain> [--id <id>]
                                              a new category from a proposed prompt: draft bank file and scope spec,
                                              harvest pipeline (coverage-checked plan, recall gate), then score
  npm run bank:build -- status                one row per category: scope, builder, scored, (auto) share, gates

Every step runs the existing script for it and stops at the first failure, loudly (non-zero exit, the step named).
LLM defaults when unset: the pass-A role on Claude Haiku 5.5 (NULLION_A_BACKEND=claude), Haiku 5.5 for the rest.
The scope spec and the plan a `new` category gets are LLM-drafted and say so; Bit Flip and Works on my machine stay
the owner's to pick, and the category stays `status: draft` until the owner approves it.
"""
import argparse
import json
import os
import pathlib
import re
import subprocess
import sys

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parent.parent
sys.path.insert(0, str(HERE))
import pipeline  # noqa: E402

PY = [sys.executable, "-I"]
DOMAINS = ["os-systems", "languages-tools", "hardware-security-history", "data-graphics-algorithms"]
ENV = {"NULLION_A_BACKEND": "claude", "NULLION_A_MODEL": "claude-haiku-5-5", "NULLION_HAIKU_MODEL": "claude-haiku-5-5"}


class StepFailed(RuntimeError):
    pass


def step(name: str, cmd: list[str]) -> None:
    print(f"\n== {name}: {' '.join(c if ' ' not in c else repr(c) for c in cmd[1:] if not c.startswith('-I'))}", flush=True)
    env = {**ENV, **os.environ}
    r = subprocess.run(cmd, cwd=REPO, env=env)
    if r.returncode != 0:
        raise StepFailed(f"step '{name}' failed (exit {r.returncode})")


def builders() -> dict[str, pathlib.Path]:
    """Category id -> its source-first builder, scripts/sources/<id with _>.py (one with a main that writes
    ~/nullion-corpora/derived/<id>.json)."""
    out = {}
    for p in (REPO / "scripts" / "sources").glob("*.py"):
        cid = p.stem.replace("_", "-")
        if (REPO / "scripts" / "bank" / "scopes" / f"{cid}.md").exists() and "write_derived" in p.read_text():
            out[cid] = p
    return out


def do_fetch(no_backup: bool) -> None:
    step("fetch corpora", [*PY, "scripts/fetch-corpora.py"])
    step("fetch references", [*PY, "scripts/fetch-references.py"])
    if no_backup:
        print("\n!! backup SKIPPED (--no-backup): the corpora on this machine are the only copy of today's fetch")
    else:
        step("backup", ["sh", "scripts/backup-corpora.sh"])


def do_derive(ids: list[str]) -> None:
    b = builders()
    for cid in ids or sorted(b):
        if cid not in b:
            raise StepFailed(f"{cid} has no source-first builder (scripts/sources/{cid.replace('-', '_')}.py with a scope spec)")
        step(f"derive {cid}", [*PY, str(b[cid].relative_to(REPO))])
        step(f"merge {cid}", [*PY, "scripts/sources/merge_derived.py", cid])


def do_score(ids: list[str]) -> None:
    step("score", [*PY, "scripts/bank/score.py", *(ids or ["--all"]), "--apply"])


def do_check() -> None:
    step("bank index", ["npm", "run", "-s", "bank:index"])
    step("tests", ["npm", "test", "--silent"])


def slug(prompt: str) -> str:
    m = re.match(r"^name (?:an?|the)\s+(?:(?:type|kind|sort|form) of\s+)?(.+?)[.?!]?$", prompt.strip(), re.I)
    if not m:
        raise SystemExit(f'a prompt reads "Name a ...", got {prompt!r}')
    return re.sub(r"[^a-z0-9]+", "-", m.group(1).lower()).strip("-")


def do_new(prompt: str, domain: str, cid: str | None) -> None:
    import llm  # noqa: E402
    os.environ.update({k: v for k, v in ENV.items() if k not in os.environ})
    cid = cid or slug(prompt)
    path = REPO / "bank" / domain / f"{cid}.md"
    scope = REPO / "scripts" / "bank" / "scopes" / f"{cid}.md"
    if any((REPO / "bank").glob(f"*/{cid}.md")) and not path.exists():
        raise SystemExit(f"{cid} already exists in another domain")
    example = (REPO / "scripts" / "bank" / "scopes" / "unix-daemon.md").read_text()
    if not scope.exists():
        ask = f"""You write scope specs for nullion, a computing-trivia game: a prompt like "{prompt}" accepts every named
instance or kind that experts name in a real codebase, its docs or a paper (designs, systems, named primitives;
never API calls, config symbols or one-off instances). A scope spec fixes what the prompt means BEFORE answers are
harvested, so sources are chosen to cover all of it and every judge rules the same way. Here is one (another prompt):

{example}

Write the scope spec for "{prompt}" in exactly that format: the `# Scope:` line; `id: {cid} · by: claude (draft: the
owner may veto any line)`; one paragraph; `## Sub-kinds` (5-10 lines `- <name>: <what, with real examples>`); `## In`;
`## Out` (the near misses a judge would otherwise argue about); `## Examples` with lines for off-by-one, npe, leak,
race, heisenbug (real names, shallowest first). Then, on a last line starting `ACCEPTS: `, one plain sentence for
players saying what counts. Reply with only the spec and that line."""

        def check(text):
            t = text.strip() if isinstance(text, str) else ""
            for need in ("# Scope:", "## Sub-kinds", "## In", "## Out", "## Examples", "ACCEPTS: "):
                if need not in t:
                    raise ValueError(f"missing {need!r}")
            pipeline.scope_subkinds(t.split("ACCEPTS: ")[0])
            return t
        text = llm.call_text("haiku", ask, check)
        spec, accepts = text.rsplit("ACCEPTS: ", 1)
        scope.write_text(spec.strip() + "\n")
        print(f"drafted {scope.relative_to(REPO)} (LLM draft: the owner vetoes)")
    else:
        accepts = None
    if not path.exists():
        if accepts is None:
            raise SystemExit(f"{scope.relative_to(REPO)} exists but {path.relative_to(REPO)} does not: write its Accepts line by hand")
        path.write_text(f"# {prompt.strip()}\nid: {cid} · domain: {domain} · status: draft\n> {accepts.strip()}\n\n## Inbox\n")
        print(f"created {path.relative_to(REPO)} (status: draft)")
        step("bank index", ["npm", "run", "-s", "bank:index"])
    try:
        step(f"pipeline {cid}", [*PY, "scripts/bank/pipeline.py", cid])
    except StepFailed:
        # The recall gate puts the real misses in the Inbox and fails; the owner approved promoting Inbox lines
        # (2026-11-28), so promote them and recheck recall once. Any other failure, or a second recall failure, stops.
        st = json.loads((REPO / "scripts" / "bank" / "runs" / cid / "state.json").read_text())
        if st.get("gates", {}).get("head recall", {}).get("level") != "fail":
            raise
        print(f"\n!! {cid}: head recall below the gate; promoting its Inbox and rechecking once")
        step(f"promote inbox {cid}", [*PY, "scripts/bank/promote-inbox.py", cid])
        step(f"pipeline {cid} (from recall)", [*PY, "scripts/bank/pipeline.py", cid, "--from", "recall"])
    do_score([cid])
    do_check()
    print(f"\n{cid}: done. Still the owner's: veto the scope spec and plan, pick Bit Flip and Works on my machine, approve.")


def do_status() -> None:
    b = builders()
    print(f"{'category':34} {'status':9} {'scope':5} {'builder':7} {'scored':6} {'auto':>5}  gates")
    for p in sorted((REPO / "bank").glob("*/*.md")):
        if p.parent.name in ("reports", "links"):
            continue
        c = pipeline.parse_bank(p)
        n = sum(len(v) for v in c["tiers"].values())
        if not n and c["status"] == "retired":
            continue
        auto = sum(a["auto"] for v in c["tiers"].values() for a in v)
        st = REPO / "scripts" / "bank" / "runs" / p.stem / "state.json"
        gates = json.loads(st.read_text()).get("gates", {}) if st.exists() else {}
        fails = [k for k, v in gates.items() if v["level"] == "fail"]
        scored = (REPO / "scripts" / "bank" / "runs" / p.stem / "familiarity-jev.json").exists()
        print(f"{p.stem:34} {c['status']:9} {'yes' if (REPO / 'scripts/bank/scopes' / f'{p.stem}.md').exists() else '-':5} "
              f"{'yes' if p.stem in b else '-':7} {'yes' if scored else '-':6} {(auto / n if n else 0):5.0%}  "
              f"{'FAIL: ' + ', '.join(fails) if fails else ''}")


def main() -> int:
    ap = argparse.ArgumentParser(description=(__doc__ or "").split("\n")[0])
    ap.add_argument("cmd", choices=["all", "fetch", "derive", "score", "check", "new", "status"])
    ap.add_argument("args", nargs="*")
    ap.add_argument("--no-backup", action="store_true")
    ap.add_argument("--domain", choices=DOMAINS)
    ap.add_argument("--id")
    a = ap.parse_args()
    try:
        if a.cmd == "all":
            do_fetch(a.no_backup)
            do_derive([])
            do_score([])
            do_check()
        elif a.cmd == "fetch":
            do_fetch(a.no_backup)
        elif a.cmd == "derive":
            do_derive(a.args)
        elif a.cmd == "score":
            do_score(a.args)
        elif a.cmd == "check":
            do_check()
        elif a.cmd == "new":
            if len(a.args) != 1 or not a.domain:
                ap.error('new takes one quoted prompt and --domain')
            do_new(a.args[0], a.domain, a.id)
        elif a.cmd == "status":
            do_status()
    except StepFailed as e:
        print(f"\nBUILD FAILED: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
