#!/usr/bin/env python3
"""One resumable command per bank category: plan -> harvest -> filter -> compare -> escalate -> merge -> obvious ->
recall -> dupes -> links -> precision -> report. Stdlib only.

  python3 -I scripts/bank/pipeline.py <id> [--from <stage>] [--dry-run] [--force]
  python3 -I scripts/bank/pipeline.py --batch N [--from-rank K] [--jobs J] [--dry-run]

Progress lives in scripts/bank/runs/<id>/state.json (per-stage status, timings, gates, warnings) and
scripts/bank/runs/<id>/logs/<stage>.log. A stage that is done is skipped on rerun; a stage that was interrupted or
failed runs again, and inside a stage finished sub-steps (a filter pass whose output validates) are reused.
`--from <stage>` forgets that stage and every later one. The first failing stage or gate stops the run with a
non-zero exit and a message; nothing is ever swallowed. The category stays `status: draft`: approval is a person's
(or the bank desk's) decision, and the Bit Flip / Works on my machine picks are listed in the report, not made.

A category's scope spec, scripts/bank/scopes/<id>.md (sub-kinds, In/Out rulings, examples per tier), is binding: every
LLM stage reads it, a new plan must say which source covers each sub-kind, and the recall gate needs it.

Stages (see STAGES below for the code):
  plan       draft scripts/bank/plans/<id>.json with Gemini when missing (an LLM-drafted plan is flagged for review);
             needs the scope spec, and every sub-kind must be covered by a source
  harvest    scripts/harvest.py
  filter     two independent passes per batch with scripts/bank/prompts/filter.md: A = Gemini, B = Claude Haiku
  compare    scripts/compare-passes.py
  escalate   disputes via escalate.md (Gemini); "confidence": "low" goes to the Inbox
  merge      merge-mined.py, score-candidates.py, npm run bank:index
  obvious    scripts/bank/obvious-draft/<id>.json (Haiku drafts it when missing; approval moves it to obvious/), apply-obvious.py; gate: all covered
  recall     head-recall probe: Haiku lists answers players would type across the scope's sub-kinds (runs/<id>/probe.json);
             the ones no tier accepts are judged (misses.triage, scope-aware), real ones go to the Inbox;
             gate: >= MIN_HEAD_RECALL of the real ones are playable (an Inbox-only answer is a miss)
  dupes      bank-dupes.py --include-draft (advisory)
  links      design/links batch file, design/links/run.sh, scripts/verify-links.py (coverage is advisory)
  precision  sample-precision.py, a Haiku reviewer's verdicts, score; gate: >= 90% members
  report     bank/reports/<id>.md gets a "Pipeline report" section: gates, tier counts, pick shortlists
"""
import argparse
import concurrent.futures
import contextlib
import fcntl
import importlib.util
import json
import os
import pathlib
import re
import shutil
import signal
import subprocess
import sys
import time
from datetime import datetime, timezone

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parent.parent
sys.path.insert(0, str(HERE))  # python -I drops the script dir from sys.path
import llm  # noqa: E402

CORPORA = pathlib.Path("~/nullion-corpora").expanduser()
RUNS = HERE / "runs"
MINED = HERE / "mined"
PLANS = HERE / "plans"
OBVIOUS = HERE / "obvious"
OBVIOUS_DRAFT = HERE / "obvious-draft"  # drafts' lists: src/data/obvious.test.ts rejects lists in obvious/ for non-approved ones
PROMPTS = HERE / "prompts"
SCOPES = HERE / "scopes"
LADDER = ["off-by-one", "npe", "leak", "race", "heisenbug"]
STAGES = ["plan", "harvest", "filter", "compare", "escalate", "merge", "obvious", "recall", "dupes", "links", "precision", "report"]
TIER_HEADINGS = ["Off-by-one", "Works on my machine", "Null pointer exception", "Memory leak", "Race condition",
                 "Heisenbug", "Bit Flip"]
MIN_PRECISION = 0.9
MIN_ANSWERS = 40  # the roadmap's admission test: at least 40 answers
MIN_LINK_SHARE = 0.5
MIN_FRESH_CANDIDATES = 10  # a fresh draft needs at least this many accepted candidates before pins are chosen
FILTER_WORKERS = 4
MIN_HEAD_RECALL = 0.85  # placeholder until calibrated on approved categories (like recall.py's MIN_RECALL)
PROBE_SIZE = 60


def scope_text(cid: str) -> str | None:
    """The category's scope spec, or None for a category written before scope specs (an expected, legacy case)."""
    f = SCOPES / f"{cid}.md"
    return f.read_text().strip() if f.exists() else None


def scope_subkinds(text: str) -> list[str]:
    m = re.search(r"^## Sub-kinds\n(.*?)(?=^## |\Z)", text, re.M | re.S)
    if not m:
        raise PipelineError("scope spec has no '## Sub-kinds' section")
    kinds = [l[2:].split(":", 1)[0].strip() for l in m.group(1).splitlines() if l.startswith("- ")]
    if len(kinds) < 2 or len(set(kinds)) != len(kinds):
        raise PipelineError(f"scope spec needs at least 2 distinct sub-kinds ('- name: description'), got {kinds}")
    return kinds


def scope_block(cid: str) -> str:
    """Appended to every LLM prompt about the category: the spec overrides the model's own reading of the prompt."""
    t = scope_text(cid)
    return ("" if t is None else
            f"\n\nSCOPE SPEC for this category (binding: it overrides your own reading of the prompt; its In and Out "
            f"rulings decide membership, its sub-kinds say how wide the category is):\n{t}\n")


class PipelineError(RuntimeError):
    """A stage or gate failed. Message is what the person needs to see."""


def load_module(name: str, path: pathlib.Path):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec is not None and spec.loader is not None
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


# ---------------------------------------------------------------- bank file helpers

def bank_path(cid: str) -> pathlib.Path:
    hits = [h for h in (REPO / "bank").glob(f"*/{cid}.md") if h.parent.name not in ("reports", "links")]
    if len(hits) != 1:
        raise PipelineError(f"{cid}: expected exactly one bank file bank/<domain>/{cid}.md, found {len(hits)}")
    return hits[0]


def parse_bank(path: pathlib.Path) -> dict:
    lines = path.read_text().split("\n")
    prompt = lines[0].removeprefix("# ").strip()
    status = re.search(r"status:\s*(\w+)", "\n".join(lines[:4]))
    accepts = next((l[1:].strip().removeprefix("Accepts:").strip() for l in lines if l.startswith(">")), "")
    tiers: dict[str, list[dict]] = {}
    inbox: list[str] = []
    sec = None
    for l in lines:
        if l.startswith("## "):
            sec = l[3:].strip()
        elif l.startswith("- ") and sec == "Inbox":
            inbox.append(l[2:])
        elif l.startswith("- ") and sec in TIER_HEADINGS:
            auto = l.endswith(" (auto)")
            names = [n.strip() for n in re.sub(r"\s+\(auto\)$", "", l[2:].strip()).split(" | ")]
            tiers.setdefault(sec, []).append({"name": names[0], "aliases": names[1:], "auto": auto})
    return {"prompt": prompt, "status": status.group(1) if status else "?", "accepts": accepts, "tiers": tiers, "inbox": inbox}


def answers_total(b: dict) -> int:
    return sum(len(v) for v in b["tiers"].values())


# ---------------------------------------------------------------- state

class Run:
    def __init__(self, cid: str):
        self.cid = cid
        self.dir = RUNS / cid
        self.logs = self.dir / "logs"
        self.mined = MINED / cid
        self.bank = bank_path(cid)
        self.state_path = self.dir / "state.json"
        self.state = json.loads(self.state_path.read_text()) if self.state_path.exists() else {
            "id": cid, "stages": {}, "gates": {}, "warnings": []}

    def save(self) -> None:
        self.dir.mkdir(parents=True, exist_ok=True)
        tmp = self.state_path.with_suffix(".tmp")
        tmp.write_text(json.dumps(self.state, indent=1, ensure_ascii=False) + "\n")
        tmp.replace(self.state_path)

    def log(self, stage: str) -> pathlib.Path:
        self.logs.mkdir(parents=True, exist_ok=True)
        return self.logs / f"{stage}.log"

    def status(self, stage: str) -> str:
        return self.state["stages"].get(stage, {}).get("status", "pending")

    def reset_from(self, stage: str) -> None:
        for s in STAGES[STAGES.index(stage):]:
            self.state["stages"].pop(s, None)
            self.state["gates"] = {k: v for k, v in self.state["gates"].items() if v.get("stage") != s}
            self.state["warnings"] = [w for w in self.state["warnings"] if w.get("stage") != s]

    def gate(self, stage: str, name: str, level: str, detail: str) -> None:
        """level: pass | warn | fail. A fail raises, after being recorded."""
        self.state["gates"][name] = {"stage": stage, "level": level, "detail": detail}
        self.save()
        if level == "fail":
            raise PipelineError(f"GATE FAILED: {name}: {detail}")

    def warn(self, stage: str, text: str) -> None:
        self.state["warnings"].append({"stage": stage, "text": text})
        self.save()

    def done(self) -> bool:
        return all(self.status(s) == "done" for s in STAGES)


@contextlib.contextmanager
def global_lock(name: str):
    """Serialises the steps that write shared files (bank files + index, the link cache) across parallel runs."""
    RUNS.mkdir(parents=True, exist_ok=True)
    with open(RUNS / f".{name}.lock", "w") as f:
        fcntl.flock(f, fcntl.LOCK_EX)
        try:
            yield
        finally:
            fcntl.flock(f, fcntl.LOCK_UN)


def sh(run: Run, stage: str, cmd: list[str], *, timeout: int = 3600) -> str:
    """Run a command, append its output to the stage log, raise PipelineError (with the tail) on a non-zero exit."""
    t0 = time.time()
    r = llm.run_group(cmd, timeout=timeout)
    with run.log(stage).open("a") as f:
        f.write(f"$ {' '.join(cmd)}  [{time.time() - t0:.0f}s, exit {r.returncode}]\n{r.stdout}{r.stderr}\n")
    if r.returncode != 0:
        tail = (r.stderr.strip() or r.stdout.strip())[-600:]
        raise PipelineError(f"`{' '.join(cmd[:4])}` exited {r.returncode}: {tail}")
    return r.stdout


def py(run: Run, stage: str, script: str, *args: str) -> str:
    return sh(run, stage, [sys.executable, "-I", str(REPO / "scripts" / script), *args])


# ---------------------------------------------------------------- validators

def check_candidates(d, tag: str) -> list[dict]:
    if not isinstance(d, dict) or not isinstance(d.get(tag), list):
        raise ValueError(f"expected an object with a {tag!r} list")
    for c in d[tag]:
        if not isinstance(c, dict) or not isinstance(c.get("name"), str) or not c["name"].strip():
            raise ValueError(f"every candidate needs a name string, got {c!r}")
        if c.get("judge") not in LADDER:
            raise ValueError(f"{c['name']!r}: judge must be one of {LADDER}, got {c.get('judge')!r}")
        al = c.setdefault("aliases", [])
        if not isinstance(al, list) or not all(isinstance(a, str) for a in al):
            raise ValueError(f"{c['name']!r}: aliases must be a list of strings")
        if c.get("confidence") not in (None, "low", "high", "medium"):
            raise ValueError(f"{c['name']!r}: confidence must be 'low' or absent")
    for k in ("womm_candidates", "bitflip_candidates"):
        if k in d and not (isinstance(d[k], list) and all(isinstance(x, (str, dict)) for x in d[k])):
            raise ValueError(f"{k} must be a list of names")
    return d[tag]


def check_aliases(d) -> dict:
    if not isinstance(d, dict) or not all(isinstance(k, str) and isinstance(v, list) and all(isinstance(a, str) for a in v)
                                          for k, v in d.items()):
        raise ValueError("aliases must be an object {existing answer: [new aliases]}")
    return d


def write_json(path: pathlib.Path, obj) -> None:
    path.write_text(json.dumps(obj, indent=1, ensure_ascii=False) + "\n")


def valid_file(path: pathlib.Path, check) -> bool:
    try:
        check(json.loads(path.read_text()))
        return True
    except (OSError, ValueError, KeyError, TypeError):
        return False


# ---------------------------------------------------------------- stage: plan

PLAN_SCHEMA = """A plan is JSON: {
  "sparse":   [{"repo": "freebsd/freebsd-src", "dir": "freebsd", "paths": ["share/man/man9"]}],   optional: sparse clones into ~/nullion-corpora/src/<dir>
  "heads":    ["lock", "mutex"],          head-noun mining over "trees": phrases/identifiers that END in one of these
  "trees":    ["kernel", "src/freebsd"],  directories relative to ~/nullion-corpora (see the list below)
  "listings": [{"repo": "torvalds/linux", "path": "fs", "type": "dir"}],   GitHub API directory listings: the NAMES of the entries are the candidates
                                          (type "dir" lists subdirectories; type "file" lists files, extension dropped)
  "extract":  [{"tree": "src/complexity-zoology", "file": "data/classes.txt", "regex": "^(\\\\S+) : (.+?) :"}],
                                          a registry FILE in a local tree: one candidate per line matching the regex (groups joined with " - ")
  "wiki":     ["Category:Disk scheduling algorithms"],   Wikipedia categories: their article titles are candidates
                                          (articles in the category and its direct subcategories; each must hold at least 8)
  "covers":   {"<sub-kind>": ["<source>", ...]}   required when the category has a scope spec: for EVERY sub-kind, the
                                          sources above (repo/path, tree, or category title) that name its members
  "context":  ["file system"]             optional: scorer counts must co-occur with one of these phrases (for short proper nouns)
}
At least one of heads (with trees), listings, extract or wiki. Source choice is the biggest lever on recall: prefer a listing whose
entry NAMES are the kinds themselves (one directory or file per compiler, per DNS record type, per codec...), in the
canonical project or registry repo. Several listings are fine. Mixed plans (listings + head-noun mining) are fine."""


def check_plan(plan, run: Run) -> None:
    keys = {"sparse", "heads", "trees", "listings", "extract", "wiki", "covers", "context", "reference"}
    if not isinstance(plan, dict) or not set(plan) <= keys:
        raise ValueError(f"plan must be an object with only the keys {sorted(keys)}")
    if not plan.get("listings") and not plan.get("extract") and not plan.get("wiki") and not (plan.get("heads") and plan.get("trees")):
        raise ValueError("plan needs listings, extract, wiki, or heads together with trees")
    scope = scope_text(run.cid)
    if scope is not None:
        cov = plan.get("covers")
        if not isinstance(cov, dict):
            raise ValueError("this category has a scope spec: the plan needs a covers object, one key per sub-kind")
        missing = [k for k in scope_subkinds(scope) if not (isinstance(cov.get(k), list) and cov[k] and all(isinstance(x, str) for x in cov[k]))]
        if missing:
            raise ValueError(f"covers names no source for these scope sub-kinds: {missing}. Add a source that lists them "
                             f"(a listing, a Wikipedia category, head nouns over a tree) and map it in covers")
    for cat in plan.get("wiki", []):
        if not (isinstance(cat, str) and cat.startswith("Category:")):
            raise ValueError(f"wiki entries are Wikipedia category titles starting with 'Category:', got {cat!r}")
        recall_mod = load_module("recall", HERE / "recall.py")
        n = len(recall_mod.members(cat)[0])
        if n < 8:
            raise ValueError(f"wiki category {cat!r} has {n} articles (needs 8; check the exact title on Wikipedia)")
    for l in plan.get("listings", []):
        if not (isinstance(l, dict) and {"repo", "path"} <= set(l) and l.get("type", "dir") in ("dir", "file")):
            raise ValueError(f"bad listing {l!r}: need repo, path, type dir|file")
    sparse_dirs = {f"src/{s['dir']}" for s in plan.get("sparse", [])}
    for t in plan.get("trees", []):
        if not (CORPORA / t).exists() and t not in sparse_dirs:
            raise ValueError(f"tree {t!r} is neither in ~/nullion-corpora nor created by a sparse entry")
    if plan.get("heads") and not all(isinstance(h, str) for h in plan["heads"]):
        raise ValueError("heads must be strings")
    harvest = load_module("harvest", REPO / "scripts" / "harvest.py")
    for l in plan.get("listings", []):
        try:
            names = harvest.listing(l)
        except RuntimeError as e:
            raise ValueError(f"listing {l} does not resolve on GitHub: {e}") from e
        if len(names) < 8:
            raise ValueError(f"listing {l} has only {len(names)} entries: not a useful source")


def wiki_suggestions(cid: str, prompt: str) -> str:
    """Real Wikipedia categories per scope sub-kind (a category-namespace search, each checked for >= 8 articles), for
    the plan prompt: models guess category titles that do not exist ("Category:Init systems"), so we give them real ones."""
    recall_mod = load_module("recall", HERE / "recall.py")
    subject = re.sub(r"^name (?:an?|the)\s+(?:(?:type|kind|sort|form) of\s+)?", "", prompt, flags=re.I).rstrip(".?!")
    lines, seen = [], set()
    for kind in scope_subkinds(scope_text(cid) or ""):
        found = []
        for q in (f"{kind} {subject}", kind):
            r = recall_mod.api({"action": "query", "list": "search", "srsearch": q, "srnamespace": "14", "srlimit": "6"})
            for hit in r.get("query", {}).get("search", []):
                t = hit["title"]
                if t in seen:
                    continue
                seen.add(t)
                n = len(recall_mod.members(t)[0])
                if n >= 8:
                    found.append(f"{t} ({n} articles)")
        lines.append(f"- {kind}: {'; '.join(found[:5]) or 'none found: use a listing or head nouns'}")
    return "\n".join(lines)


def stage_plan(run: Run) -> None:
    path = PLANS / f"{run.cid}.json"
    if path.exists():
        check_plan(json.loads(path.read_text()), run)
        run.state["plan_origin"] = "existing"
        return
    examples = []
    with_heads = [p for p in sorted(PLANS.glob("*.json")) if "heads" in json.loads(p.read_text())]
    with_list = [p for p in sorted(PLANS.glob("*.json")) if "heads" not in json.loads(p.read_text())]
    for p in with_heads[:2] + with_list[:3]:
        b = parse_bank(bank_path(p.stem))
        examples.append(f"Example, category {p.stem!r} ({b['prompt']}; accepts: {b['accepts']}):\n{p.read_text().strip()}")
    trees = sorted(x.name for x in (CORPORA / "src").iterdir()) if (CORPORA / "src").exists() else []
    b = parse_bank(run.bank)
    if scope_text(run.cid) is None:
        raise PipelineError(f"{run.cid}: no scope spec. Write scripts/bank/scopes/{run.cid}.md (sub-kinds, In/Out rulings, "
                            f"examples per tier; see scheduling-algorithm.md) before drafting a plan: the plan is chosen to cover it")
    run.dir.mkdir(parents=True, exist_ok=True)
    out = run.dir / "plan.draft.json"
    prompt = f"""You are drafting a harvesting source plan for nullion, a computing-trivia game. Each category is a prompt that
accepts every NAMED KIND of something ("Name a type of lock"); we harvest a long deep tail of real names from public
source trees and registries, then filter with LLMs.

CATEGORY {run.cid!r}: prompt "{b['prompt']}"; accepts: {b['accepts'] or '(unstated)'}
Example answers already in its Inbox: {', '.join(i.split(' (suggested')[0] for i in b['inbox'][:12]) or 'none'}

{PLAN_SCHEMA}

Local trees available under ~/nullion-corpora: kernel (Linux Documentation), dblp, arxiv (titles/abstracts; not minable as trees),
and src/: {', '.join(trees)}. A sparse entry can clone other GitHub repos (small paths only: docs, man pages, registries).

{chr(10).join(examples)}

Rules: use real, public GitHub repositories and paths that you are confident exist. Every listing is verified with the
GitHub API right after you answer, and must return at least 8 entries. Don't invent paths. The sources together must
cover the WHOLE scope: a category's recall is capped by its sources (one ecosystem's tree, one library, one vendor's
list leaves the rest of the category out), so use as many sources as the scope's sub-kinds need, and fill "covers" with
every sub-kind of the scope spec mapped to the sources that name its members. Wikipedia categories ("wiki") are good for
kinds no single repo lists, but use ONLY titles from this verified list (searched just now; any other title fails):
{wiki_suggestions(run.cid, b['prompt'])}
Category membership is noisy (people, companies, concepts): the filter passes remove those, so a broad category is fine.{scope_block(run.cid)}
Write ONLY the plan JSON to the file {out.relative_to(REPO)}. Reply with only "done"."""

    def validate(obj):
        check_plan(obj, run)
        return obj

    # Three retries, not one: a plan that must cover every sub-kind fails the check (or names a path that 404s) more
    # often than a one-source plan did, and each retry is told exactly what was wrong.
    plan = llm.call("gemini", prompt, validate, out_path=out, log=run.log("plan"), retries=3)
    PLANS.mkdir(parents=True, exist_ok=True)
    write_json(path, plan)
    out.unlink(missing_ok=True)
    run.state["plan_origin"] = "llm-drafted"
    run.warn("plan", f"scripts/bank/plans/{run.cid}.json was DRAFTED BY AN LLM: the owner may veto or edit it "
                     f"(rerun with --from harvest after editing)")


# ---------------------------------------------------------------- stage: harvest

DERIVED = ("*.a-*.json", "*.b-*.json", "agreed-*.json", "disputed.json", "resolved-*.json", "picks.json", "final.json",
           "sample*.json")


def clear_derived(run: Run) -> None:
    for pat in DERIVED:
        for f in run.mined.glob(pat):
            f.unlink()


def stage_harvest(run: Run, force: bool) -> None:
    derived = [f.name for pat in DERIVED for f in run.mined.glob(pat)] if run.mined.exists() else []
    if derived and not force:
        raise PipelineError(f"{run.mined.relative_to(REPO)} already holds hand-run outputs ({derived[:3]}...): "
                            f"rerun with --force to discard them and start this category over")
    clear_derived(run)
    out = py(run, "harvest", "harvest.py", run.cid)
    batches = sorted(run.mined.glob("batch-*.txt"))
    lines = sum(len(b.read_text().splitlines()) for b in batches)
    if not batches or lines < 20:
        raise PipelineError(f"harvest produced {lines} lines in {len(batches)} batches: the plan's sources are too thin")
    run.state["harvest"] = {"batches": len(batches), "lines": lines, "summary": out.strip().splitlines()[0]}


# ---------------------------------------------------------------- stage: filter

def filter_prompt(run: Run, batch: pathlib.Path, side: str, mode: str) -> str:
    template = (PROMPTS / "filter.md").read_text().split("\n---\n", 1)[1]
    b = parse_bank(run.bank)
    prefix = (run.mined / f"{batch.stem}.{side}").relative_to(REPO)
    text = (template.replace("{PROMPT}", b["prompt"]).replace("{ID}", run.cid)
            .replace("{BATCH_FILE}", str(batch.relative_to(REPO))).replace("{BANK_FILE}", str(run.bank.relative_to(REPO)))
            .replace("OUT_PREFIX", str(prefix)))
    text += scope_block(run.cid)
    if mode == "gemini":
        return text
    return f"""{text}

OUTPUT OVERRIDE (supersedes the last paragraph above): you have no file tools. The contents of both input files follow.
Do not write files. Reply with ONLY one JSON object, no prose, no code fence:
{{"candidates": <exactly what {prefix}-candidates.json would contain>, "aliases": <exactly what {prefix}-aliases.json would contain>}}
Keep it compact: "evidence" at most 12 words, "why" at most 6 words.

===== BATCH_FILE {batch.relative_to(REPO)} =====
{batch.read_text()}
===== BANK_FILE {run.bank.relative_to(REPO)} =====
{run.bank.read_text()}
"""


def filter_task(run: Run, batch: pathlib.Path, side: str) -> str:
    cand = run.mined / f"{batch.stem}.{side}-candidates.json"
    ali = run.mined / f"{batch.stem}.{side}-aliases.json"
    both_ok = lambda: valid_file(cand, lambda d: check_candidates(d, run.cid)) and valid_file(ali, check_aliases)  # noqa: E731
    if both_ok():
        return f"{batch.stem}.{side}: reused"
    log = run.log("filter")
    if side == "a":  # Gemini writes both files itself
        ali.unlink(missing_ok=True)

        def validate(obj):
            check_candidates(obj, run.cid)
            if not ali.exists():
                raise ValueError(f"{ali.relative_to(REPO)} was not written")
            check_aliases(json.loads(ali.read_text()))

        llm.call("gemini", filter_prompt(run, batch, "a", "gemini"), validate, out_path=cand, log=log)
    else:  # Haiku prints one object; we write both files
        def validate(obj):
            if not isinstance(obj, dict) or "candidates" not in obj or "aliases" not in obj:
                raise ValueError('reply must be {"candidates": ..., "aliases": ...}')
            check_candidates(obj["candidates"], run.cid)
            check_aliases(obj["aliases"])

        obj = llm.call("haiku", filter_prompt(run, batch, "b", "haiku"), validate, log=log)
        write_json(cand, obj["candidates"])
        write_json(ali, obj["aliases"])
    n = len(json.loads(cand.read_text())[run.cid])
    return f"{batch.stem}.{side}: {n} kept"


def stage_filter(run: Run) -> None:
    batches = sorted(run.mined.glob("batch-*.txt"))
    if not batches:
        raise PipelineError(f"no batches in {run.mined.relative_to(REPO)}: harvest first")
    tasks = [(b, s) for b in batches for s in ("a", "b")]
    results = []
    with concurrent.futures.ThreadPoolExecutor(FILTER_WORKERS) as ex:
        futs = {ex.submit(filter_task, run, b, s): (b, s) for b, s in tasks}
        errors = []
        for f in concurrent.futures.as_completed(futs):
            try:
                r = f.result()
                results.append(r)
                print(f"  {run.cid}: {r}", flush=True)
            except Exception as e:  # collected so the other passes finish, then raised below
                errors.append(f"{futs[f][0].stem}.{futs[f][1]}: {e}")
    if errors:
        raise PipelineError("filter pass failed: " + "; ".join(errors))
    run.state["filter"] = sorted(results)
    kept = {s: sum(len(json.loads(f.read_text()).get(run.cid, [])) for f in run.mined.glob(f"batch-*.{s}-candidates.json"))
            for s in ("a", "b")}
    # Both passes keeping nothing means the sources never name this kind of thing (design-principle, 2026-11-27,
    # mined 161 "...rule" phrases from code trees): stop here, not three stages later at an empty pin choice.
    run.gate("filter", "filter kept", "fail" if not any(kept.values()) else "pass",
             f"pass A kept {kept['a']}, pass B kept {kept['b']} of {run.state['harvest']['lines']} harvested lines"
             + ("" if any(kept.values()) else ": the plan's sources don't name this kind of thing; write a plan"
                " that points at a list of them (listings or extract), then rerun with --from harvest"))


# ---------------------------------------------------------------- stage: compare / escalate

def stage_compare(run: Run) -> None:
    (run.mined / "final.json").unlink(missing_ok=True)
    out = py(run, "compare", "compare-passes.py", run.cid)
    run.state["compare"] = out.strip().splitlines()[-1]


def stage_escalate(run: Run) -> None:
    disputed = json.loads((run.mined / "disputed.json").read_text())
    rc, ra = run.mined / "resolved-candidates.json", run.mined / "resolved-aliases.json"
    if not disputed:
        write_json(rc, {run.cid: []})
        write_json(ra, {})
        run.state["escalate"] = "no disputes"
        return
    b = parse_bank(run.bank)
    rc.unlink(missing_ok=True)
    ra.unlink(missing_ok=True)
    prompt = (PROMPTS / "escalate.md").read_text().split("\n---\n")[-1] if "\n---\n" in (PROMPTS / "escalate.md").read_text() else (PROMPTS / "escalate.md").read_text()
    prompt = prompt.replace("{PROMPT}", b["prompt"]).replace("{ID}", run.cid) + scope_block(run.cid)
    prompt += (f"\n\nWrite the two files to exactly these paths: {rc.relative_to(REPO)} and {ra.relative_to(REPO)}. "
               f"There are {len(disputed)} disputes: decide every one (keep, keep with confidence low, or drop).")

    def validate(obj):
        check_candidates(obj, run.cid)
        if not ra.exists():
            raise ValueError(f"{ra.relative_to(REPO)} was not written (write {{}} if there are no aliases)")
        check_aliases(json.loads(ra.read_text()))

    obj = llm.call("gemini", prompt, validate, out_path=rc, log=run.log("escalate"))
    kept = obj[run.cid]
    low = sum(1 for c in kept if c.get("confidence") == "low")
    run.state["escalate"] = f"{len(disputed)} disputes -> {len(kept)} kept ({low} low-confidence -> Inbox), {len(disputed) - len(kept)} dropped"


# ---------------------------------------------------------------- stage: merge (+ score + index)

def choose_pins(run: Run, data: dict) -> None:
    """Fresh draft: pick exactly one Bit Flip and 1-3 Works on my machine from the two passes' proposals (a Haiku
    judgement, flagged for the owner). The shortlists stay in the report either way."""
    picks = json.loads((run.mined / "picks.json").read_text()) if (run.mined / "picks.json").exists() else {}
    names = {e["name"] for e in data[run.cid]}
    b = parse_bank(run.bank)
    prompt = f"""Prompt of a computing-trivia category: "{b['prompt']}". Accepted: {b['accepts'] or 'every named kind'}.
Two reviewers proposed rarity picks among these accepted answers.
  Bit Flip = the one answer that is truly exotic yet real and verifiable: nearly nobody would type it, one per question.
  Works on my machine = the obscure-looking pick that everyone reaches for as a clever answer (a known second-tier name).
Proposed Bit Flip: {picks.get('bitflip_candidates', [])}
Proposed Works on my machine: {picks.get('womm_candidates', [])}
All candidate names: {sorted(names)}
Choose exactly ONE bitflip and 1 to 3 womm, all spelled exactly as in the candidate names, no overlap.{scope_block(run.cid)}
Reply with ONLY JSON: {{"bitflip": "<name>", "womm": ["<name>", ...]}}"""

    def validate(o):
        if not (isinstance(o, dict) and o.get("bitflip") in names and isinstance(o.get("womm"), list)
                and 1 <= len(o["womm"]) <= 3 and all(w in names and w != o["bitflip"] for w in o["womm"])):
            raise ValueError("need {bitflip: <candidate name>, womm: [1-3 other candidate names]}")

    o = llm.call("haiku", prompt, validate, log=run.log("merge"))
    for e in data[run.cid]:
        if e["name"] == o["bitflip"]:
            e["pin"] = "bitflip"
        elif e["name"] in o["womm"]:
            e["pin"] = "womm"
    run.state["pins"] = o
    run.warn("merge", f"Bit Flip / Works on my machine PINNED BY AN LLM ({o['bitflip']}; {', '.join(o['womm'])}): the owner vets them")


def stage_merge(run: Run) -> None:
    final = run.mined / "final.json"
    with global_lock("bank"):
        if not final.exists():  # merge-mined edits the bank file's aliases once; a finished merge is not repeated
            py(run, "merge", "merge-mined.py", run.cid, str(final), str(run.mined / "agreed"), str(run.mined / "resolved"))
        plan = json.loads((PLANS / f"{run.cid}.json").read_text())
        data = json.loads(final.read_text())
        if plan.get("context"):
            data["_context"] = {run.cid: plan["context"]}
            write_json(final, data)
        if not data.get(run.cid) or not any(e.get("pin") for e in data[run.cid]):
            if not parse_bank(run.bank)["tiers"]:  # a fresh draft needs its Bit Flip and Works on my machine pinned
                n = len(data.get(run.cid, []))
                if n < MIN_FRESH_CANDIDATES:
                    raise PipelineError(f"{run.cid}: only {n} candidates survived the filter and escalation (a fresh "
                                        f"draft needs {MIN_FRESH_CANDIDATES}): the plan's sources are too thin; "
                                        f"fix the plan, then rerun with --from harvest")
                choose_pins(run, data)
                write_json(final, data)
        py(run, "merge", "score-candidates.py", str(final), str(CORPORA))
        sh(run, "merge", ["npm", "run", "bank:index"], timeout=600)
    b = parse_bank(run.bank)
    n = answers_total(b)
    if n == 0:
        raise PipelineError(f"{run.cid}: scoring left no tiered answers ({len(b['inbox'])} in the Inbox)")
    run.state["merge"] = f"{n} tiered answers, {len(b['inbox'])} in the Inbox"


# ---------------------------------------------------------------- stage: obvious

def check_obvious(d) -> list[dict]:
    if not isinstance(d, list) or not 15 <= len(d) <= 60:
        raise ValueError("expected a JSON list of 15 to 60 answer groups")
    for g in d:
        if not (isinstance(g, dict) and isinstance(g.get("name"), str) and g["name"].strip()):
            raise ValueError(f"every group needs a name, got {g!r}")
        if not isinstance(g.get("aliases", []), list) or not all(isinstance(a, str) for a in g.get("aliases", [])):
            raise ValueError(f"{g['name']!r}: aliases must be a list of strings")
        if g.get("tier") not in ("off-by-one", "npe"):
            raise ValueError(f"{g['name']!r}: tier must be 'off-by-one' or 'npe'")
        if "|" in g["name"] or any("|" in a for a in g.get("aliases", [])):
            raise ValueError(f"{g['name']!r}: names must not contain '|'")
    return d


def stage_obvious(run: Run) -> None:
    path = next((d / f"{run.cid}.json" for d in (OBVIOUS, OBVIOUS_DRAFT) if (d / f"{run.cid}.json").exists()),
                OBVIOUS_DRAFT / f"{run.cid}.json")
    if path.exists():
        check_obvious(json.loads(path.read_text()))
        run.state["obvious_origin"] = "existing"
    else:
        b = parse_bank(run.bank)
        example = (OBVIOUS / "git-subcommand.json").read_text()[:900]
        have = ", ".join(a["name"] for t in ("Off-by-one", "Null pointer exception") for a in b["tiers"].get(t, [])[:25])
        prompt = f"""For nullion, a computing-trivia game, list the OBVIOUS answers for the prompt "{b['prompt']}" (accepts: {b['accepts'] or 'any named kind of it'}).
These are the answers ordinary programmers type FIRST, within ten seconds, including bare generic names ("list", "tree")
where the prompt takes them. Give about 30 groups, each {{"name": ..., "aliases": [common spellings, abbreviations, full names;
each at least 3 characters], "tier": "off-by-one" (nearly everyone names it first) or "npe" (many know it)}}. Only real members under the
accepts rule; no functions or API calls; no duplicates; never use "|" in a name. Today's bank already tiers these as obvious: {have or '(none yet)'}.
Cover what is missing from that list, but include the true top answers even if listed.
Format example (another category):
{example}{scope_block(run.cid)}
Reply with ONLY the JSON list."""
        groups = llm.call("haiku", prompt, check_obvious, log=run.log("obvious"))
        OBVIOUS_DRAFT.mkdir(parents=True, exist_ok=True)
        write_json(path, groups)
        run.state["obvious_origin"] = "llm-drafted"
        run.warn("obvious", f"{path.relative_to(REPO)} was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)")
    with global_lock("bank"):
        out = py(run, "obvious", "apply-obvious.py", run.cid)
    run.state["obvious"] = out.strip().splitlines()[-1]
    wm = load_module("wm", REPO / "scripts" / "wikidata-merge.py")
    b = parse_bank(run.bank)
    owned = {wm.key(n) for t in b["tiers"].values() for a in t for n in [a["name"], *a["aliases"]]}
    groups = json.loads(path.read_text())
    missing = [g["name"] for g in groups if not any(wm.key(n) in owned for n in [g["name"], *g.get("aliases", [])])]
    if missing:
        run.gate("obvious", "obvious coverage", "fail", f"{len(missing)}/{len(groups)} obvious answers still rejected: {missing[:8]}")
    # The Bit Flip is the one deep cut nobody reaches for; an obvious answer there (CSV for serialization formats) is
    # a bad pin, whoever chose it.
    obvious_keys = {wm.key(n) for g in groups for n in [g["name"], *g.get("aliases", [])]}
    flips = [a for a in b["tiers"].get("Bit Flip", []) if any(wm.key(n) in obvious_keys for n in [a["name"], *a["aliases"]])]
    if flips:
        run.gate("obvious", "Bit Flip pin", "fail", f"the Bit Flip '{flips[0]['name']}' is an obvious answer: pick a deep cut "
                 f"(edit the bank file's ## Bit Flip, then rerun with --from merge)")
    run.gate("obvious", "obvious coverage", "pass", f"{len(groups) - len(missing)}/{len(groups)} obvious answers accepted"
             + (f"; {run.state['obvious'].split('; ', 1)[1]}" if "; skipped" in run.state["obvious"] else ""))


# ---------------------------------------------------------------- stage: recall (head-recall probe)

def check_probe(d) -> list[dict]:
    if not isinstance(d, list) or len(d) < PROBE_SIZE // 2:
        raise ValueError(f"need a JSON list of about {PROBE_SIZE} objects")
    seen = set()
    for x in d:
        if not (isinstance(x, dict) and isinstance(x.get("name"), str) and x["name"].strip() and "|" not in x["name"]):
            raise ValueError(f"every item needs a name string without '|', got {x!r}")
        if not (isinstance(x.get("aliases", []), list) and all(isinstance(a, str) for a in x.get("aliases", []))):
            raise ValueError(f"{x['name']!r}: aliases must be a list of strings")
        if x.get("depth") not in ("common", "mid", "deep"):
            raise ValueError(f"{x['name']!r}: depth must be common, mid or deep")
        if x["name"].lower() in seen:
            raise ValueError(f"duplicate {x['name']!r}")
        seen.add(x["name"].lower())
    return d


def probe_keys(name: str, aliases: list[str], subject: str, norm) -> set[str]:
    """What a player typing this name (or an alias) would be matched on: the name itself, and the name with the
    prompt's noun or a generic noun dropped off the end, as the game's phrasings() does."""
    tails = sorted({subject, subject.split()[-1], "algorithm", "scheduling", "scheduler", "policy", "daemon", "service",
                    "system", "protocol", "format", "cipher", "editor", "tool"}, key=len, reverse=True)
    out = set()
    for n in [name, *aliases]:
        k = norm(n)
        out.add(k)
        for t in tails:
            tk = norm(t)
            if k.endswith(tk) and len(k) > len(tk) + 1:
                out.add(k[: -len(tk)])
    return {k for k in out if k}


def stage_recall(run: Run) -> None:
    scope = scope_text(run.cid)
    if scope is None:
        raise PipelineError(f"{run.cid}: the recall gate needs a scope spec (scripts/bank/scopes/{run.cid}.md)")
    misses = load_module("misses", HERE / "misses.py")
    b = parse_bank(run.bank)
    probe_path = run.dir / "probe.json"
    if not valid_file(probe_path, check_probe):
        prompt = f"""For nullion, a computing-trivia game, list {PROBE_SIZE} answers that real players would type for the prompt
"{b['prompt']}" (accepts: {b['accepts'] or 'any named kind of it'}).{scope_block(run.cid)}
Spread them: about 15 "common" (nearly everyone types these first), 20 "mid" (people with some systems background),
25 "deep" (specialists, papers, kernel internals). Cover EVERY sub-kind in the scope spec, several answers each. Only
real, named things you are confident exist and that the scope's In rules accept; none of its Out cases. Each item:
{{"name": "<usual spelling>", "aliases": [abbreviations and other spellings people type], "sub_kind": "<one of the sub-kinds>", "depth": "common" | "mid" | "deep"}}
Never use "|" in a name. Reply with ONLY the JSON list."""
        write_json(probe_path, llm.call("haiku", prompt, check_probe, log=run.log("recall")))
    probe = json.loads(probe_path.read_text())
    text = run.bank.read_text()
    playable, known = misses.playable_keys(text), misses.known_keys(text)
    subj = re.sub(r"^name (?:an?|the)\s+(?:(?:type|kind|sort|form) of\s+)?", "", b["prompt"], flags=re.I).rstrip(".?!").lower()
    covered, inbox_only, unknown = [], [], []
    for x in probe:
        ks = probe_keys(x["name"], x.get("aliases", []), subj, misses.norm)
        (covered if ks & playable else inbox_only if ks & known else unknown).append(x)
    report, added, aliased = misses.triage(run.cid, b["prompt"], [(x["name"], 1) for x in unknown], False,
                                           run.log("recall"), scope)
    if added:
        with global_lock("bank"):
            misses.bank_index()
    not_members = sum(1 for l in report if ": not an answer:" in l)
    real = len(covered) + aliased + len(inbox_only) + added
    share = (len(covered) + aliased) / real if real else 0.0
    out = REPO / "design" / "recall" / f"{run.cid}-probe.md"
    out.parent.mkdir(parents=True, exist_ok=True)
    by_kind: dict[str, list[str]] = {}
    for x in inbox_only + unknown:
        by_kind.setdefault(x.get("sub_kind", "?"), []).append(x["name"])
    out.write_text("\n".join([
        f"# Head-recall probe: {run.cid} ({b['prompt']})", "",
        f"{len(covered) + aliased} of {real} real probe answers are playable ({share:.0%}); {len(inbox_only)} only in the "
        f"Inbox; {added} new ones added to the Inbox; {not_members} probe answers judged not members (out of scope or not real).",
        "", "## Misses by sub-kind", *[f"- {k}: {', '.join(v)}" for k, v in sorted(by_kind.items())],
        "", "## Inbox only (rejected in play until promoted)", *[f"- {x['name']}" for x in inbox_only],
        "", "## Judged", *report, "", "## Covered", *[f"- {x['name']}" for x in covered], ""]))
    run.state["recall"] = {"playable": len(covered) + aliased, "real": real, "inbox_only": len(inbox_only),
                           "added": added, "not_members": not_members, "report": str(out.relative_to(REPO))}
    missed = [x["name"] for x in inbox_only + unknown if not any(x["name"] in l and ": not an answer:" in l for l in report)]
    detail = (f"{len(covered) + aliased}/{real} real probe answers playable ({share:.0%}); "
              f"{len(inbox_only)} Inbox-only, {added} added to the Inbox; misses: {', '.join(missed[:12])}"
              f"{' ...' if len(missed) > 12 else ''} ({out.relative_to(REPO)})")
    run.gate("recall", "head recall", "pass" if share >= MIN_HEAD_RECALL else "fail",
             detail + ("" if share >= MIN_HEAD_RECALL else f": below {MIN_HEAD_RECALL:.0%}; promote the Inbox lines into tiers "
                       f"(or fix the plan's sources), then rerun with --from recall"))


# ---------------------------------------------------------------- stage: dupes

def stage_dupes(run: Run) -> None:
    out = py(run, "dupes", "bank-dupes.py", "--include-draft", run.cid)
    lines = [l for l in out.strip().splitlines() if "duplicates" in l and not l.endswith("likely duplicates")]
    run.state["dupes"] = lines
    run.gate("dupes", "duplicates", "warn" if lines else "pass",
             f"{len(lines)} likely duplicate pairs" + (f": {'; '.join(l.split(': ', 1)[1] for l in lines[:5])}" if lines else ""))


# ---------------------------------------------------------------- stage: links

def stage_links(run: Run) -> None:
    b = parse_bank(run.bank)
    links = REPO / "design" / "links"
    batch = {"id": run.cid, "prompt": b["prompt"], "accepts": b["accepts"],
             "answers": [{"name": a["name"], "aliases": a["aliases"], "tier": t}
                         for t in TIER_HEADINGS for a in b["tiers"].get(t, [])]}
    (links / "batches").mkdir(exist_ok=True)
    write_json(links / "batches" / f"{run.cid}.json", batch)
    proposed = links / "proposed" / f"{run.cid}.json"
    names = {a["name"] for a in batch["answers"]}

    def ok() -> bool:
        def check(d):
            if not (isinstance(d, dict) and isinstance(d.get("answers"), dict)):
                raise ValueError("no answers object")
            if set(d["answers"]) - names:
                raise ValueError(f"unknown answers {sorted(set(d['answers']) - names)[:3]}")
            if names - set(d["answers"]):
                raise ValueError(f"missing answers {sorted(names - set(d['answers']))[:3]}")
        return valid_file(proposed, check)

    for attempt in range(2):
        if ok():
            break
        proposed.unlink(missing_ok=True)
        sh(run, "links", ["bash", str(links / "run.sh"), run.cid], timeout=3600)
    else:
        if not ok():
            raise PipelineError(f"{proposed.relative_to(REPO)} is missing or invalid after two tries (see logs/links.log)")
    with global_lock("links"):
        out = py(run, "links", "verify-links.py", run.cid)
    got = json.loads((REPO / "bank" / "links" / f"{run.cid}.json").read_text())
    share = len(got["answers"]) / max(1, len(names))
    run.state["links"] = out.strip().splitlines()[-3:]
    run.gate("links", "link coverage", "pass" if share >= MIN_LINK_SHARE else "warn",
             f"{len(got['answers'])}/{len(names)} answers have a verified link ({share:.0%}); prompt link {'yes' if got.get('prompt') else 'no'}")


# ---------------------------------------------------------------- stage: precision

def stage_precision(run: Run) -> None:
    report = REPO / "bank" / "reports" / f"{run.cid}.md"
    if report.exists():  # `score` appends a section on every run: drop a previous one first
        txt = re.sub(r"\n## Precision sample\n.*?(?=\n## |\Z)", "", report.read_text(), flags=re.S)
        report.write_text(txt)
    py(run, "precision", "sample-precision.py", run.cid, "sample")
    sample_path, verdict_path = run.mined / "sample.json", run.mined / "sample-verdicts.json"
    sample = json.loads(sample_path.read_text())
    names = [s["name"] for s in sample]

    def check(d):
        if not isinstance(d, dict):
            raise ValueError("expected an object {answer: {member, tier_ok, why}}")
        for n in names:
            v = d.get(n)
            if not (isinstance(v, dict) and isinstance(v.get("member"), bool) and isinstance(v.get("tier_ok"), bool)
                    and isinstance(v.get("why"), str)):
                raise ValueError(f"{n!r}: needs {{member: bool, tier_ok: bool, why: str}}")
        return {n: d[n] for n in names}

    if not valid_file(verdict_path, check):
        b = parse_bank(run.bank)
        rule = (PROMPTS / "filter.md").read_text()
        rule = rule[rule.index("MEMBERSHIP RULE"):rule.index("Familiarity tier")]
        listing = "\n".join(f"- {s['name']} (aliases: {', '.join(s['aliases']) or 'none'}) tier: {s['tier']}" for s in sample)
        prompt = f"""You are the precision reviewer for nullion, a computing-trivia game. Category prompt: "{b['prompt']}"; accepts: {b['accepts'] or 'any named kind of it'}.
Judge each sampled answer. "member": is it a real, correct answer to the prompt under the rule below (true/false)? "tier_ok": is
its tier plausible (off-by-one = nearly everyone names it first; npe = many know it; leak = systems/domain people;
race = specialists; heisenbug = deep internals only)? Be strict about membership: say false when unsure it exists.

{rule}{scope_block(run.cid)}
SAMPLE:
{listing}

Reply with ONLY a JSON object {{"<answer name exactly as listed>": {{"member": true|false, "tier_ok": true|false, "why": "short reason"}}, ...}} with one key per sampled answer."""
        write_json(verdict_path, llm.call("haiku", prompt, check, log=run.log("precision")))
    try:
        out = py(run, "precision", "sample-precision.py", run.cid, "score")
    except PipelineError as e:
        m = re.search(r"precision (\d+)%", run.log("precision").read_text())
        run.gate("precision", "precision", "fail", f"{m.group(0) if m else 'below'} < {MIN_PRECISION:.0%}: {e}")
    m = re.search(r"precision (\d+)% \((\d+)/(\d+)\), tier ok (\d+)/(\d+)", out)
    run.gate("precision", "precision", "pass", f"{m.group(2)}/{m.group(3)} sampled answers are members ({m.group(1)}%), "
             f"{m.group(4)}/{m.group(5)} with acceptable tier" if m else out.strip())


# ---------------------------------------------------------------- stage: report

def stage_report(run: Run, partial: str | None = None) -> None:
    b = parse_bank(run.bank)
    st = run.state
    total = answers_total(b)
    gates = dict(st["gates"])
    n_level = "pass" if total >= MIN_ANSWERS else "warn"
    gates["answer count"] = {"level": n_level, "detail": f"{total} tiered answers (roadmap admission test: at least {MIN_ANSWERS})"}
    bit, womm = len(b["tiers"].get("Bit Flip", [])), len(b["tiers"].get("Works on my machine", []))
    gates["picks (owner)"] = {"level": "pass" if bit == 1 and womm >= 1 else "warn",
                              "detail": f"{bit} Bit Flip, {womm} Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below"}
    mark = {"pass": "PASS", "warn": "WARN", "fail": "FAIL"}
    lines = ["## Pipeline report", "",
             f"Generated {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')} by scripts/bank/pipeline.py. Status stays `{b['status']}`: "
             f"approval is the owner's call.", ""]
    if partial:
        lines += [f"**INCOMPLETE RUN: {partial}**", ""]
    notes = [w["text"] for w in st["warnings"]]
    if notes:
        lines += ["Needs a human look:", *[f"- {n}" for n in notes], ""]
    lines += ["### Gates", "", "| gate | result | detail |", "|---|---|---|"]
    lines += [f"| {k} | {mark[v['level']]} | {v['detail']} |" for k, v in gates.items()]
    lines += ["", "### Tiers", "", "| tier | answers | unconfirmed (auto) |", "|---|---|---|"]
    lines += [f"| {t} | {len(b['tiers'].get(t, []))} | {sum(a['auto'] for a in b['tiers'].get(t, []))} |" for t in TIER_HEADINGS]
    lines += ["", f"Inbox (never accepted in play): {len(b['inbox'])}.", ""]
    picks_file = run.mined / "picks.json"
    if picks_file.exists():
        ps = load_module("picks_sheet", REPO / "scripts" / "picks-sheet.py")
        lines += ["### Bit Flip / Works on my machine shortlists", "",
                  "Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.", "",
                  "```", *ps.block(run.cid), "```", ""]
    lines += ["### Stage timings", "", "| stage | status | seconds |", "|---|---|---|"]
    for s in STAGES:
        e = st["stages"].get(s, {})
        lines.append(f"| {s} | {e.get('status', 'pending')} | {e.get('seconds', '')} |")
    lines.append("")
    rp = REPO / "bank" / "reports" / f"{run.cid}.md"
    text = rp.read_text() if rp.exists() else f"# Scoring report\n\nNo scoring report was written for {run.cid}.\n"
    text = re.sub(r"\n## Pipeline report\n.*?(?=\n## |\Z)", "", text, flags=re.S).rstrip("\n")
    rp.write_text(text + "\n\n" + "\n".join(lines))
    run.state["report"] = str(rp.relative_to(REPO))


# ---------------------------------------------------------------- driver

def execute(run: Run, stage: str, force: bool) -> None:
    fn = {"plan": lambda: stage_plan(run), "harvest": lambda: stage_harvest(run, force), "filter": lambda: stage_filter(run),
          "compare": lambda: stage_compare(run), "escalate": lambda: stage_escalate(run), "merge": lambda: stage_merge(run),
          "obvious": lambda: stage_obvious(run), "recall": lambda: stage_recall(run), "dupes": lambda: stage_dupes(run), "links": lambda: stage_links(run),
          "precision": lambda: stage_precision(run), "report": lambda: stage_report(run)}[stage]
    fn()


def run_category(cid: str, start: str | None, dry: bool, force: bool) -> int:
    run = Run(cid)
    b = parse_bank(run.bank)
    if b["status"] != "draft" and not force:
        raise PipelineError(f"{cid}: status is {b['status']!r}; the pipeline only works on drafts (--force to override)")
    if start:
        run.reset_from(start)
        if not dry:
            run.save()
    for stage in STAGES:
        status = run.status(stage)
        if status == "done":
            print(f"[{cid}] {stage}: done (skipped)")
            continue
        if dry:
            print(f"[{cid}] {stage}: WOULD RUN ({status})")
            continue
        print(f"[{cid}] {stage}: running...", flush=True)
        entry = run.state["stages"][stage] = {"status": "running", "started": datetime.now(timezone.utc).isoformat(timespec="seconds")}
        run.save()
        t0 = time.time()
        try:
            execute(run, stage, force)
        except BaseException as e:
            entry["seconds"] = round(time.time() - t0)
            entry["status"] = "interrupted" if isinstance(e, (KeyboardInterrupt, SystemExit)) else "failed"
            entry["error"] = str(e)[:800]
            run.save()
            if entry["status"] == "failed" and STAGES.index(stage) >= STAGES.index("merge"):
                with contextlib.suppress(Exception):  # the report is how a failed gate gets read
                    stage_report(run, partial=f"stage {stage} failed: {str(e)[:300]}")
            raise
        entry["seconds"] = round(time.time() - t0)
        entry["status"] = "done"
        entry["finished"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
        run.save()
        print(f"[{cid}] {stage}: done in {entry['seconds']}s", flush=True)
    if not dry:
        gates = run.state["gates"]
        warns = [f"{k}: {v['detail']}" for k, v in gates.items() if v["level"] == "warn"]
        warns += [w["text"] for w in run.state["warnings"]]
        print(f"[{cid}] COMPLETE (still status: draft). Report: bank/reports/{cid}.md")
        for w in warns:
            print(f"[{cid}] NEEDS A LOOK: {w}")
    return 0


RANK_ROW = re.compile(r"^\|\s*(\d+)\s*\|\s*([a-z0-9-]+)\s*\(([^)]*)\)\s*\|\s*(\w+)\s*\|")


def ranked() -> list[tuple[int, str, str]]:
    rows = []
    for line in (REPO / "design" / "triage" / "ranked.md").read_text().splitlines():
        m = RANK_ROW.match(line)
        if m:
            rows.append((int(m.group(1)), m.group(2), m.group(4)))
    if not rows:
        raise PipelineError("design/triage/ranked.md: no ranked rows found")
    return rows


def run_batch(n: int, from_rank: int, jobs: int, dry: bool) -> int:
    picked: list[str] = []
    failed_before: list[str] = []
    for rank, cid, verdict in ranked():
        if rank < from_rank or len(picked) >= n:
            continue
        if verdict == "cut":
            continue
        if verdict == "merge":
            print(f"note: rank {rank} {cid} is a MERGE verdict (see design/triage/out): skipped, the owner decides where it merges")
            continue
        try:
            r = Run(cid)
        except PipelineError as e:
            print(f"note: rank {rank} {cid}: {e}")
            continue
        if r.done():
            continue
        if any(v.get("status") == "failed" for v in r.state["stages"].values()):
            failed_before.append(cid)
            continue
        if verdict == "fix":
            print(f"note: rank {rank} {cid} has verdict FIX: its prompt may need the change listed in design/triage/out")
        picked.append(cid)
    if failed_before:
        print(f"note: skipped earlier failures (rerun each by id): {', '.join(failed_before)}")
    print(f"batch: {len(picked)} categories: {', '.join(picked) or 'none'}")
    if dry or not picked:
        for cid in picked:
            run_category(cid, None, True, False)
        return 0
    results: dict[str, int] = {}

    def one(cid: str) -> tuple[str, int]:
        log = RUNS / cid / "pipeline.log"
        log.parent.mkdir(parents=True, exist_ok=True)
        with log.open("a") as f:
            f.write(f"\n===== {datetime.now(timezone.utc).isoformat(timespec='seconds')} =====\n")
            f.flush()
            p = subprocess.run([sys.executable, "-I", str(HERE / "pipeline.py"), cid], stdout=f, stderr=subprocess.STDOUT)
        return cid, p.returncode

    with concurrent.futures.ThreadPoolExecutor(jobs) as ex:
        for cid, rc in ex.map(one, picked):
            results[cid] = rc
            print(f"batch: {cid}: {'ok' if rc == 0 else 'FAILED (see scripts/bank/runs/' + cid + '/pipeline.log)'}", flush=True)
    print("\nbatch summary:")
    bad = 0
    for cid in picked:
        r = Run(cid)
        if results[cid] == 0:
            print(f"  {cid}: complete")
            for k, v in r.state["gates"].items():
                if v["level"] == "warn":
                    print(f"    NEEDS A LOOK  {k}: {v['detail']}")
            for w in r.state["warnings"]:
                print(f"    NEEDS A LOOK  {w['text']}")
        else:
            bad += 1
            failed = next(((s, e) for s, e in r.state["stages"].items() if e.get("status") in ("failed", "interrupted")), None)
            print(f"  {cid}: FAILED at {failed[0] if failed else '?'}: {failed[1].get('error', '') if failed else ''}")
    print(f"{len(picked) - bad}/{len(picked)} complete, {bad} failed")
    return 1 if bad else 0


def main() -> int:
    ap = argparse.ArgumentParser(description="Resumable content pipeline for one bank category (see the module docstring).")
    ap.add_argument("id", nargs="?", help="category id (bank/<domain>/<id>.md)")
    ap.add_argument("--from", dest="start", choices=STAGES, help="forget this stage and every later one, then run from it")
    ap.add_argument("--dry-run", action="store_true", help="print what would run; change nothing")
    ap.add_argument("--force", action="store_true", help="discard hand-run mined outputs / allow non-draft status")
    ap.add_argument("--batch", type=int, metavar="N", help="run the next N not-yet-done categories in design/triage/ranked.md order")
    ap.add_argument("--from-rank", type=int, default=1, metavar="K", help="with --batch: start at rank K")
    ap.add_argument("--jobs", type=int, default=1, help="with --batch: categories in parallel (default 1)")
    a = ap.parse_args()
    signal.signal(signal.SIGTERM, lambda *_: sys.exit(143))  # lets `finally` blocks kill the LLM child processes
    os.chdir(REPO)
    try:
        if a.batch:
            if a.id or a.start:
                ap.error("--batch takes no id and no --from")
            return run_batch(a.batch, a.from_rank, a.jobs, a.dry_run)
        if not a.id:
            ap.error("give a category id or --batch N")
        return run_category(a.id, a.start, a.dry_run, a.force)
    except (PipelineError, llm.LLMError) as e:
        print(f"\nPIPELINE FAILED: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
