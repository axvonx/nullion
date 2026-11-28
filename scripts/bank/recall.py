#!/usr/bin/env python3
"""Recall check: how much of a reference list does a category's answer list cover?

Usage: python3 -I scripts/bank/recall.py <category id>... | --approved [--no-llm]

The reference is a few Wikipedia categories per bank category (members of each, plus of its direct subcategories,
articles only), kept in the category's plan as `"reference": {"categories": [...], "by": "llm" | "owner"}`. With no
reference yet, Claude Haiku proposes up to four category titles for the prompt; each must exist on Wikipedia with at
least 5 articles, and the kept ones are saved to the plan (`"by": "llm"`: the owner may edit or veto them).
`--no-llm` never proposes: a category without a reference is reported as such.

A member counts as covered when its title, without a "(qualifier)" and with the prompt's noun or a generic one
dropped off the end ("Oracle Database", "Opus (audio format)"), normalizes (the game's normalize) to an answer,
alias or Inbox line of the category. Writes:
  design/recall/<id>.md          recall %, and the covered and missing members;
  design/misses/recall-<id>.md   the missing members in the missed-guesses format, so
                                 `python3 -I scripts/bank/misses.py design/misses/recall-<id>.md` judges them and puts
                                 the real ones in the Inbox (references are noisy: people, companies, lists);
  design/recall/summary.md       one row per category checked in this run.
Exits non-zero if any category is below MIN_RECALL (the pipeline's recall gate uses the same number).
Network: the Wikipedia API, with a generic client name, nothing about the user.
"""
import json
import pathlib
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parent.parent
sys.path.insert(0, str(HERE))
import llm  # noqa: E402  # pyright: ignore[reportMissingImports]
import misses  # noqa: E402  # pyright: ignore[reportMissingImports]  (its norm is the game's normalize)

norm = misses.norm
PLANS = HERE / "plans"
OUT = REPO / "design" / "recall"
MISSES = REPO / "design" / "misses"
API = "https://en.wikipedia.org/w/api.php"
UA = "nullion-recall-check/0.1 (static trivia game; reference list coverage)"
MIN_RECALL = 0.40
MIN_MEMBERS = 5
GENERIC = ["database", "database management system", "dbms", "software", "protocol", "programming language",
           "language", "file system", "filesystem", "format", "file format", "algorithm", "library", "framework",
           "engine", "game engine", "editor", "text editor", "compiler", "cipher", "codec", "operating system", "os",
           "standard", "bus", "api", "instruction", "license", "licence", "attack", "allocator", "scheduler",
           "data structure", "pattern", "design pattern", "daemon", "command", "utility", "tool", "system"]


class Throttled(Exception):
    pass


def api(params: dict) -> dict:
    url = f"{API}?{urllib.parse.urlencode({**params, 'format': 'json', 'formatversion': '2'})}"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    for attempt in range(7):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            if e.code != 429 and e.code < 500:
                raise
            time.sleep(2 ** attempt + float(e.headers.get("Retry-After") or 0))
    raise Throttled(url)


def members(category: str) -> tuple[list[str], list[str]]:
    """Articles in a category and in its direct subcategories; and the subcategory titles."""
    def one(cat: str, kinds: str) -> list[dict]:
        out, cont = [], {}
        while True:
            r = api({"action": "query", "list": "categorymembers", "cmtitle": cat, "cmtype": kinds, "cmlimit": "500", **cont})
            out += r.get("query", {}).get("categorymembers", [])
            if "continue" not in r:
                return out
            cont = {"cmcontinue": r["continue"]["cmcontinue"]}
    top = one(category, "page|subcat")
    subs = [m["title"] for m in top if m.get("ns") == 14]
    pages = [m["title"] for m in top if m.get("ns") == 0]
    for s in subs:
        pages += [m["title"] for m in one(s, "page") if m.get("ns") == 0]
    return sorted(set(p for p in pages if not re.match(r"^(List|Lists|Comparison|Timeline|History|Outline) of\b", p))), subs


def bank_file(cid: str) -> pathlib.Path:
    hits = [p for p in (REPO / "bank").glob(f"*/{cid}.md") if p.parent.name != "reports"]
    if len(hits) != 1:
        raise SystemExit(f"{cid}: expected one bank file, found {len(hits)}")
    return hits[0]


def prompt_of(text: str) -> str:
    return text.splitlines()[0][2:].strip()


def subject(prompt: str) -> str:
    m = re.match(r"^name (?:an?|the)\s+(?:(?:type|kind|sort|form) of\s+)?(.+?)[.?!]?$", prompt, re.I)
    return (m.group(1) if m else prompt).lower()


def candidates(title: str, subj: str) -> set[str]:
    bare = re.sub(r"\s*\([^)]*\)\s*$", "", title)
    out = {norm(title), norm(bare)}
    words = bare.split()
    for tail in sorted({subj, subj.split()[-1], *GENERIC}, key=len, reverse=True):
        tw = tail.split()
        if len(words) > len(tw) and [w.lower().rstrip("s") for w in words[-len(tw):]] == [w.rstrip("s") for w in tw]:
            out.add(norm(" ".join(words[: -len(tw)])))
    for lead in ("Apache ", "GNU ", "Microsoft ", "IBM ", "Oracle ", "Google ", "Amazon "):
        if bare.startswith(lead) and len(bare) > len(lead) + 1:
            out.add(norm(bare[len(lead):]))
    return out - {""}


def propose(cid: str, prompt: str, accepts: str) -> list[str]:
    ask = f"""A computing-trivia category asks: "{prompt}". Accepted: {accepts}
Name up to 4 existing English Wikipedia CATEGORY titles whose member articles are mostly instances of this thing
(for "Name a database": "Category:Relational database management systems", "Category:NoSQL"). Prefer specific,
well-populated categories; never a list article, never a category of people or companies.
Reply with ONLY a JSON list of strings, each starting with "Category:"."""

    def validate(o):
        if not isinstance(o, list) or not 1 <= len(o) <= 4 or not all(isinstance(x, str) and x.startswith("Category:") for x in o):
            raise ValueError('need a JSON list of 1-4 strings starting with "Category:"')
        return o

    return llm.call("haiku", ask, validate, log=OUT / f"{cid}.llm.log")


def reference(cid: str, prompt: str, accepts: str, no_llm: bool) -> list[str] | None:
    plan_path = PLANS / f"{cid}.json"
    plan = json.loads(plan_path.read_text()) if plan_path.exists() else {}
    ref = plan.get("reference", {}).get("categories")
    if ref:
        return ref
    if no_llm:
        return None
    kept = []
    for cat in propose(cid, prompt, accepts):
        try:
            pages, _ = members(cat)
        except urllib.error.HTTPError:
            continue
        if len(pages) >= MIN_MEMBERS:
            kept.append(cat)
    if not kept:
        raise SystemExit(f"{cid}: none of the proposed Wikipedia categories exist with {MIN_MEMBERS}+ articles: write "
                         f'"reference": {{"categories": [...], "by": "owner"}} into {plan_path.relative_to(REPO)}')
    plan["reference"] = {"categories": kept, "by": "llm"}
    plan_path.write_text(json.dumps(plan, indent=1, ensure_ascii=False) + "\n")
    return kept


def check(cid: str, no_llm: bool) -> tuple[str, float | None, int, int]:
    """(id, recall or None without a reference, covered, real). Without the LLM, recall is the raw share of the
    reference (noisy: references hold concepts, tools and companies too); with it, the missing members are judged
    (misses.triage: the real ones go to the Inbox) and recall is covered / (covered + real missing)."""
    text = bank_file(cid).read_text()
    prompt = prompt_of(text)
    m = re.search(r"^> (.+)$", text, re.M)
    accepts = m.group(1) if m else "every named kind"
    ref = reference(cid, prompt, accepts, no_llm)
    if ref is None:
        return cid, None, 0, 0
    known = misses.known_keys(text)
    subj = subject(prompt)
    pages: list[str] = []
    for cat in ref:
        pages += members(cat)[0]
    pages = sorted(set(pages))
    covered = [p for p in pages if candidates(p, subj) & known]
    missing = [p for p in pages if p not in covered]
    OUT.mkdir(parents=True, exist_ok=True)
    bare = lambda p: re.sub(r" *[(][^)]*[)]$", "", p)  # noqa: E731
    if no_llm:
        share = len(covered) / len(pages) if pages else 0.0
        judged: list[str] = [f"- {p}" for p in missing]
        real = len(pages)
        line = f"{len(covered)} of {len(pages)} reference articles covered (raw, unjudged: {share:.0%})"
    else:
        judged, added, aliased = misses.triage(cid, prompt, [(bare(p), 0) for p in missing], False, OUT / f"{cid}.llm.log")
        real = len(covered) + aliased + added
        share = (len(covered) + aliased) / real if real else 0.0
        line = (f"{len(covered) + aliased} of {real} real reference members covered ({share:.0%}); "
                f"{added} new ones added to the Inbox; {len(pages)} reference articles in all")
    (OUT / f"{cid}.md").write_text("\n".join([
        f"# Recall: {cid} ({prompt})", "", line, "", f"Reference: {', '.join(ref)}", "",
        "## Missing (judged)", *judged, "", "## Covered", *[f"- {p}" for p in covered], ""]))
    MISSES.mkdir(parents=True, exist_ok=True)
    (MISSES / f"recall-{cid}.md").write_text("\n".join(
        [f"# nullion missed guesses (recall reference for {cid})", "", f"## {cid} · {prompt}",
         *[f"- {re.sub(r' *[(][^)]*[)]$', '', p)} · ×0" for p in missing], ""]))
    return cid, share, len(covered), real


def main() -> None:
    no_llm = "--no-llm" in sys.argv
    if "--approved" in sys.argv:
        ids = [l.split("|")[1].strip() for l in (REPO / "bank" / "index.md").read_text().splitlines() if "| approved |" in l]
    else:
        ids = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not ids:
        raise SystemExit(__doc__)
    rows, low = [], []
    for cid in ids:
        cid, share, c, n = check(cid, no_llm)
        if share is None:
            rows.append(f"| {cid} | no reference | | |")
            print(f"{cid}: no reference (run without --no-llm to propose one)")
            continue
        rows.append(f"| {cid} | {share:.0%} | {c} | {n} |")
        print(f"{cid}: {share:.0%} ({c}/{n})")
        if share < MIN_RECALL:
            low.append(f"{cid} {share:.0%}")
    if not no_llm:
        misses.bank_index()
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "summary.md").write_text("\n".join(["# Recall summary (this run)", "", "| category | recall | covered | reference |",
                                               "|---|---|---|---|", *rows, ""]))
    if low:
        raise SystemExit(f"below {MIN_RECALL:.0%} recall: {', '.join(low)} (see design/recall/<id>.md)")


if __name__ == "__main__":
    main()
