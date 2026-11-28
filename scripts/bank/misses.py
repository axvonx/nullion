#!/usr/bin/env python3
"""Triage missed guesses: Settings → Missed guesses → Copy, pasted into a file, becomes Inbox candidates.

Usage: python3 -I scripts/bank/misses.py <pasted file> [--no-llm]

Reads the Markdown the game copies (`## <question id> · <prompt>` sections of `- <guess> · ×<n>` lines; see
src/game/misses.ts). For each category:
  1. guesses the bank (answers, aliases, Inbox) already knows, by the game's own normalization, are skipped: the
     bank changed since, or the miss was a typo the matcher still rejects (listed, so it can be looked at);
  2. the rest go to Claude Haiku in one call per category: is each a real named kind of the prompt's thing, under
     the category's `> Accepts:` line, what is its usual spelling, and roughly how many players would think of it;
  3. the real ones are appended to the category's `## Inbox` as `- <name> | <guess> (suggested: <tier>)`. The Inbox
     is never played; a person (or the pipeline's merge) moves them into tiers.
A report goes next to the input (`<input>.triage.md`): every guess and what happened to it, with the model's reason.
`--no-llm` stops after step 1 and only reports. Stdlib only; uses the owner's Claude allowance for step 2.
"""
import datetime
import importlib.util
import pathlib
import re
import subprocess
import sys

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parent.parent
sys.path.insert(0, str(HERE))
import llm  # noqa: E402

# The game's normalization, as the content scripts share it (src/core/normalize-scripts.test.ts keeps it in step).
_spec = importlib.util.spec_from_file_location("bank_dupes", REPO / "scripts" / "bank-dupes.py")
assert _spec and _spec.loader
_dupes = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_dupes)
norm = _dupes.norm

TIERS = ["off-by-one", "womm", "npe", "leak", "race", "heisenbug"]
SECTION_RE = re.compile(r"^## (\S+) · (.+)$")
GUESS_RE = re.compile(r"^- (.+?) · ×(\d+)$")


def parse_paste(text: str) -> dict[str, dict]:
    cats: dict[str, dict] = {}
    cur = None
    for n, line in enumerate(text.splitlines(), 1):
        if not line.strip() or line.startswith("# "):
            continue
        m = SECTION_RE.match(line)
        if m:
            cur = cats.setdefault(m.group(1), {"prompt": m.group(2), "guesses": []})
            continue
        g = GUESS_RE.match(line)
        if not g or cur is None:
            raise SystemExit(f"line {n}: not a missed-guesses line (copy from Settings → Missed guesses): {line!r}")
        cur["guesses"].append((g.group(1).strip(), int(g.group(2))))
    if not cats:
        raise SystemExit("no categories in the file")
    return cats


def bank_file(cid: str) -> pathlib.Path:
    hits = [p for p in (REPO / "bank").glob(f"*/{cid}.md") if p.parent.name != "reports"]
    if len(hits) != 1:
        raise SystemExit(f"{cid}: expected one bank file, found {len(hits)}")
    return hits[0]


def known_keys(text: str) -> set[str]:
    """Every name and alias in the file, the Inbox included (so a guess is never appended to the Inbox twice)."""
    keys: set[str] = set()
    for line in text.splitlines():
        if line.startswith("- "):
            body = re.sub(r"\s*\((?:auto|suggested: [a-z-]+)\)\s*$", "", line[2:])
            keys |= {norm(p.strip()) for p in body.split("|") if p.strip()}
    return keys


def playable_keys(text: str) -> set[str]:
    """Names and aliases in the tier sections only: what the game accepts. The Inbox is never played, so an answer
    that is only in the Inbox is still a miss (the 2026-11-27 database misses sat there, reported as known)."""
    head = text.split("\n## Inbox", 1)[0]
    return known_keys(head)


def accepts_line(text: str) -> str:
    m = re.search(r"^> (.+)$", text, re.M)
    return m.group(1) if m else "every named kind"


def judge(prompt: str, accepts: str, guesses: list[str], log: pathlib.Path, scope: str = "") -> list[dict]:
    listing = "\n".join(f"- {g}" for g in guesses)
    scope_note = f"\nSCOPE SPEC (binding: its In and Out rulings decide membership):\n{scope}\n" if scope else ""
    ask = f"""A computing-trivia game asks players: "{prompt}". Accepted: {accepts}{scope_note}
Players typed these answers, which the game's answer list does not have yet:
{listing}

For EACH guess decide:
  member: true only if it is a real, named instance of what the prompt asks for (you could cite a codebase, its docs,
          a paper or a reference work); false for misspellings of nothing, jokes, other kinds of thing, or when unsure.
  name:   its usual spelling (e.g. "ScyllaDB" for "scylla db"); for a non-member, the guess as typed.
  tier:   for a member, how many players would think of it: "off-by-one" (most would), "npe" (common),
          "leak" (fairly rare), "race" (rare), "heisenbug" (very rare). Use "womm" never.
  why:    one short sentence.
Reply with ONLY a JSON list, one object per guess, in the same order:
[{{"guess": "<as given>", "member": true, "name": "<name>", "tier": "<tier>", "why": "<reason>"}}, ...]"""

    def validate(o):
        if not isinstance(o, list) or len(o) != len(guesses):
            raise ValueError(f"need a JSON list of exactly {len(guesses)} objects, one per guess, in order")
        for want, v in zip(guesses, o):
            if not isinstance(v, dict) or v.get("guess") != want:
                raise ValueError(f"object for {want!r} missing or out of order")
            if not isinstance(v.get("member"), bool) or not isinstance(v.get("name"), str) or not v["name"].strip():
                raise ValueError(f"{want!r}: member must be a boolean and name a non-empty string")
            if "|" in v["name"]:
                raise ValueError(f"{want!r}: name must not contain '|'")
            if v["member"] and v.get("tier") not in TIERS:
                raise ValueError(f"{want!r}: tier must be one of {TIERS}")
        return o

    return llm.call("haiku", ask, validate, log=log)


JUDGE_CHUNK = 25


def triage(cid: str, prompt: str, guesses: list[tuple[str, int]], no_llm: bool, log: pathlib.Path,
           scope: str = "") -> tuple[list[str], int, int]:
    """Judge a category's guesses and append the real, unknown ones to its Inbox.
    Returns (report lines, added to the Inbox, real and already PLAYABLE under another name). A guess or name found
    only in the Inbox is reported as such, loudly: it is still rejected in play until someone promotes it."""
    path = bank_file(cid)
    text = path.read_text()
    known = known_keys(text)
    playable = playable_keys(text)
    fresh = [(g, n) for g, n in guesses if norm(g) not in known]
    report = [f"- {g} (×{n}): already in the bank" if norm(g) in playable else
              f"- {g} (×{n}): **in the Inbox only: still rejected in play until promoted**"
              for g, n in guesses if norm(g) in known]
    if not fresh:
        return report, 0, 0
    if no_llm:
        return report + [f"- {g} (×{n}): not in the bank (not judged: --no-llm)" for g, n in fresh], 0, 0
    verdicts = []
    for i in range(0, len(fresh), JUDGE_CHUNK):
        verdicts += judge(prompt, accepts_line(text), [g for g, _ in fresh[i:i + JUDGE_CHUNK]], log, scope)
    lines, aliased = [], 0
    for (g, n), v in zip(fresh, verdicts):
        if not v["member"]:
            report.append(f"- {g} (×{n}): not an answer: {v['why']}")
            continue
        if norm(v["name"]) in playable:
            aliased += 1
            report.append(f"- {g} (×{n}): the model's name {v['name']!r} is already in the bank: {v['why']}")
            continue
        if norm(v["name"]) in known:
            report.append(f"- {g} (×{n}): the model's name {v['name']!r} is **in the Inbox only: still rejected in play**: {v['why']}")
            continue
        names = [v["name"]] + ([g] if norm(g) != norm(v["name"]) else [])
        lines.append(f"- {' | '.join(names)} (suggested: {v['tier']})")
        known |= {norm(x) for x in names}
        report.append(f"- {g} (×{n}): **to the Inbox** as {v['name']} ({v['tier']}): {v['why']}")
    if lines:
        if "\n## Inbox" not in text:
            text = text.rstrip("\n") + "\n\n## Inbox\n"
        path.write_text(text.rstrip("\n") + "\n" + "\n".join(lines) + "\n")
    return report, len(lines), aliased


def bank_index() -> None:
    r = subprocess.run(["npm", "run", "bank:index"], cwd=REPO, capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit(f"npm run bank:index failed:\n{r.stdout[-2000:]}\n{r.stderr[-2000:]}")


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 1:
        raise SystemExit(__doc__)
    src = pathlib.Path(args[0])
    no_llm = "--no-llm" in sys.argv
    cats = parse_paste(src.read_text())
    log = src.with_suffix(".llm.log")
    report = [f"# Missed-guess triage: {src.name} ({datetime.date.today().isoformat()})", ""]
    added = 0
    for cid, c in cats.items():
        lines, n, _ = triage(cid, c["prompt"], c["guesses"], no_llm, log)
        report += [f"## {cid} · {c['prompt']}", "", *lines, ""]
        added += n
    out = src.with_suffix(".triage.md")
    out.write_text("\n".join(report))
    if added:
        bank_index()
    print(f"{added} candidates added to Inboxes; report: {out.relative_to(REPO) if out.is_relative_to(REPO) else out}")


if __name__ == "__main__":
    main()
