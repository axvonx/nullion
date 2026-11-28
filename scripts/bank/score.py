#!/usr/bin/env python3
"""Score every tiered bank category: a decision model ranks the head, evidence splits the tail. Stdlib only.

Usage: python3 -I scripts/bank/score.py [<id>... | --all] [--apply] [--calibrate]

For each category (every bank file with tiered answers, retired ones skipped), for each tiered answer except
Bit Flip and Works on my machine (the owner hand-picks those):
  1. familiarity: TypeSafe Jev scores it on one 8-level rubric (scripts/sources/familiarity.py; TYPESAFE_API_KEY);
     when Jev's confidence is below ROUTE_BELOW, Claude Haiku's level is used instead. Both cached per category in
     scripts/bank/runs/<id>/familiarity-{jev,haiku}.json, so a rerun only pays for new answers.
  2. evidence (local, no LLM): readers reaching its Wikipedia article in a month (clickstream, through the bank's
     answer -> Wikipedia links in bank/links/<id>.json, else an article found in the clickstream itself; a list or
     section shared by several answers counts for none), Stack Exchange question counts on its tag (four sites,
     synonyms followed; one-word dictionary words skipped, any case: their tags mean something else), how many distro
     families package it (Repology), and GitHub stars of its upstream repo (Repology's links; only a repo whose
     description or topics name the prompt's subject; scripts/sources/github_stars.py, cached).
  3. tier (a category where nothing clears the Off-by-one bar gets its top MIN_HEAD there):
     familiarity >= HEAD["off-by-one"] -> Off-by-one; >= HEAD["npe"] -> Null pointer exception; below the
     head, Jev cannot tell answers apart (its scores flatten into near-ties), so evidence decides: LIFT-level ->
     Null pointer exception (Jev underrates what is new or outside its training: Ghostty, Zig, Objective-C), strong
     -> Memory leak, some -> Race condition ("deep, but documented"), none -> Heisenbug ("deep and barely documented").
Writes design/scoring/<id>.md per category and design/scoring/summary.md. `--apply` moves `(auto)` lines to their
new tier (a confirmed line, one without `(auto)`, is never moved: it is listed when the scores disagree with it),
then regenerates bank/index.md. `--calibrate` prints how the head thresholds would cut every category, and stops.
"""
import argparse
import gzip
import json
import pathlib
import re
import subprocess
import sys
import urllib.parse

HERE = pathlib.Path(__file__).resolve().parent
REPO = HERE.parent.parent
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(REPO / "scripts" / "sources"))
import familiarity as F  # noqa: E402  # pyright: ignore[reportMissingImports]
import github_stars  # noqa: E402  # pyright: ignore[reportMissingImports]
import misses  # noqa: E402  # pyright: ignore[reportMissingImports]
import pipeline  # noqa: E402  # pyright: ignore[reportMissingImports]

CORPORA = pathlib.Path("~/nullion-corpora").expanduser()
ROUTE_BELOW = 0.40
MIN_HEAD = 2
HEAD = {"off-by-one": 4.4, "npe": 2.0}  # familiarity (0-7) lower bounds; see --calibrate
# Evidence: (clicks per month, Stack Exchange questions, distro families). Any one at or above the level counts.
# Fitted 2026-11-28 to the owner's target shares, averaged per category (a player sees one category at a time):
# Off-by-one 4%, Null pointer exception 17%, Memory leak 13%, Race condition 6%, Heisenbug 60% -> got 5/18/12/5/60.
# Distro families never make evidence strong: packaging shows a thing exists, not that people know it (Debian
# packages feedbackd and mbpfan everywhere). Refit 2026-11-28 with that: got 5/18/12/5/59. Refit again the same day
# once namesake evidence was gone (capitalised dictionary words' tags, list articles shared by many answers, section
# links) and GitHub stars and the head lift were in: got 5/19/10/6/60 (Memory leak can't reach 13% without
# loosening Race condition; the lift adds a point to Null pointer exception).
STRONG = (5000, 30, None)
SOME = (1500, 10, 20)
# GitHub stars (2026-11-28): the one current signal. Wikipedia and Stack Exchange lag a new tool by years (Ghostty:
# no article, 1 question, 64k stars), and Jev underrates them too. Stars count only for a repo whose description or
# topics name the prompt's subject (a word of it), so a same-named project elsewhere never lends its stars.
STARS = {"strong": 5000, "some": 1000}
# Evidence this strong lifts an answer Jev puts below the head into Null pointer exception (clicks or stars alone;
# Stack Exchange only with some clicks or stars too): what a typical Null pointer exception answer has. Never into
# Off-by-one, which stays Jev's call.
LIFT = {"clicks": 30000, "se": 1000, "stars": 20000}
TIERS = ["off-by-one", "npe", "leak", "race", "heisenbug"]
HEADINGS = {"off-by-one": "Off-by-one", "npe": "Null pointer exception", "leak": "Memory leak",
            "race": "Race condition", "heisenbug": "Heisenbug"}
HEADING_TIER = {v: k for k, v in HEADINGS.items()}


# ---------------------------------------------------------------- evidence sources

def clickstream_totals(titles: set[str]) -> dict[str, int]:
    """Monthly inbound clicks per article title (all referrers summed), for the titles asked; cached per month."""
    files = sorted((CORPORA / "refs").glob("clickstream-enwiki-*.tsv.gz"))
    if not files:
        raise SystemExit("no clickstream: python3 -I scripts/fetch-references.py clickstream")
    src = files[-1]
    cache = CORPORA / "derived" / (src.name.replace(".tsv.gz", "-totals.tsv.gz"))
    if not cache.exists():
        print(f"  summing {src.name} once (about a minute)...", flush=True)
        tot: dict[str, int] = {}
        with gzip.open(src, "rt", errors="replace") as f:
            for line in f:
                p = line.rstrip("\n").split("\t")
                if len(p) == 4:
                    tot[p[1]] = tot.get(p[1], 0) + int(p[3])
        cache.parent.mkdir(parents=True, exist_ok=True)
        tmp = cache.with_name(cache.name + ".part")
        with gzip.open(tmp, "wt") as g:
            for t, n in tot.items():
                g.write(f"{t}\t{n}\n")
        tmp.replace(cache)
    out = {}
    with gzip.open(cache, "rt") as f:
        for line in f:
            t, _, n = line.rstrip("\n").partition("\t")
            if t in titles:
                out[t] = int(n)
    return out


def repology_families() -> dict[str, int]:
    out = {}
    with gzip.open(CORPORA / "repology" / "metapackages.tsv.gz", "rt", errors="replace") as f:
        head = f.readline().rstrip("\n").split("\t")
        i, j = head.index("effname"), head.index("num_families")
        for line in f:
            p = line.rstrip("\n").split("\t")
            out[misses.norm(p[i])] = max(out.get(misses.norm(p[i]), 0), int(p[j]))
    return out


def subject(prompt: str) -> str:
    m = re.match(r"^name (?:an?|the)\s+(?:(?:type|kind|sort|form) of\s+)?(.+?)[.?!]?$", prompt.strip(), re.I)
    return (m.group(1) if m else prompt).lower()


def wiki_title(name: str) -> str:
    t = name.strip().replace(" ", "_")
    return t[:1].upper() + t[1:]


def clickstream_referrers(titles: set[str]) -> dict[str, set[str]]:
    """title -> the articles readers came from (real articles only), for the titles asked: one pass over the raw dump."""
    src = sorted((CORPORA / "refs").glob("clickstream-enwiki-*.tsv.gz"))[-1]
    out: dict[str, set[str]] = {}
    with gzip.open(src, "rt", errors="replace") as f:
        for line in f:
            p = line.rstrip("\n").split("\t")
            if len(p) == 4 and p[1] in titles and p[2] == "link" and p[0] != "Main_Page":
                out.setdefault(p[1], set()).add(p[0])
    return out


class Evidence:
    def __init__(self, ids: list[str]) -> None:
        import common  # noqa: E402  # pyright: ignore[reportMissingImports]  (scripts/sources/common.py)
        self.se = common.StackExchange()
        self.dict_words = common.dictionary_words()
        self.families = repology_families()
        self.links: dict[str, dict[str, str]] = {}
        self.prompt_link: dict[str, str] = {}
        for p in (REPO / "bank" / "links").glob("*.json"):
            d = json.loads(p.read_text())
            self.links[p.stem] = d.get("answers", {})
            self.prompt_link[p.stem] = d.get("prompt") or ""
        banks = {cid: pipeline.parse_bank(pipeline.bank_path(cid)) for cid in ids}
        self.short_names = {}
        for cid, b in banks.items():
            lens = sorted(len(misses.norm(a["name"])) for lst in b["tiers"].values() for a in lst)
            self.short_names[cid] = bool(lens) and lens[len(lens) // 2] <= 4
        self.found = self.resolve_titles(banks)
        titles = {t for a in self.links.values() for u in a.values() if (t := self.title(u))}
        titles |= {t for m in self.found.values() for t, _ in m.values()}
        self.clicks = clickstream_totals(titles)
        self.repo_of: dict[str, str] = {}
        for eff, r in github_stars.repos_by_effname().items():
            self.repo_of.setdefault(misses.norm(eff), r)
        want = {self.repo_of[k] for b in banks.values() for lst in b["tiers"].values() for a in lst
                for k in (misses.norm(n) for n in [a["name"], *a["aliases"]]) if k in self.repo_of}
        self.repos = github_stars.stars(want)

    def resolve_titles(self, banks: dict[str, dict]) -> dict[str, dict[str, tuple[str, bool]]]:
        """Wikipedia articles for answers bank/links has none for (it links one page per answer for players, and
        sometimes picks the project's site over an article that exists: Warp). Offline, from the clickstream:
        "<name> (<the prompt's subject, or a qualifier this category's linked articles use>)" counts when the article
        exists; a bare "<name>" or "<name> (software)" only when readers reach it from a hub of this category (the
        prompt's article, or one that sends readers to 3+ of its linked answers), so "Hyper" never means the word. A bare
        match is still sometimes a namesake (dns-record-type "HTTPS" -> the protocol, unix-command "c99" -> the C
        standard), so it is returned flagged and its clicks never lift an answer into the head."""
        have = clickstream_totals(set())  # ensures the totals cache exists
        del have
        strong: dict[str, dict[str, list[str]]] = {}
        weak: dict[str, dict[str, list[str]]] = {}
        allc: set[str] = set()
        for cid, b in banks.items():
            subj = subject(b["prompt"])
            linked = {t for u in self.links.get(cid, {}).values() if (t := self.title(u))}
            quals = {subj, subj.split()[-1], subj.split()[0]} | {m.group(1).replace("_", " ") for t in linked
                                                                  if (m := re.search(r"_\(([^)]+)\)$", t))}
            for lst in b["tiers"].values():
                for a in lst:
                    url = self.links.get(cid, {}).get(a["name"])
                    if url and self.title(url):
                        continue
                    names = [a["name"], *a["aliases"]]
                    strong.setdefault(cid, {})[a["name"]] = [wiki_title(f"{n} ({q})") for n in names for q in sorted(quals)]
                    # Bare titles from the answer's own name only: an alias is often its maker ("Nokia").
                    weak.setdefault(cid, {})[a["name"]] = [wiki_title(a["name"]), wiki_title(f"{a['name']} (software)")]
            allc |= linked | {t for v in strong.get(cid, {}).values() for t in v} | {t for v in weak.get(cid, {}).values() for t in v}
        exists = clickstream_totals(allc)
        refs = clickstream_referrers({t for t in allc if t in exists})
        out: dict[str, dict[str, str]] = {}
        for cid, b in banks.items():
            linked = {t for u in self.links.get(cid, {}).values() if (t := self.title(u))}
            sent: dict[str, int] = {}
            for t in linked:
                for r in refs.get(t, ()):
                    sent[r] = sent.get(r, 0) + 1
            hubs = {r for r, n in sent.items() if n >= 3}
            if (pt := self.title(self.prompt_link.get(cid, ""))):
                hubs.add(pt)
            taken = set(linked)
            m: dict[str, tuple[str, bool]] = {}
            for name, cands in strong.get(cid, {}).items():
                hit, bare = [t for t in cands if t in exists and t not in taken], False
                if not hit:
                    hit = [t for t in weak[cid][name] if t in exists and t not in taken and refs.get(t, set()) & hubs]
                    bare = True
                if hit:
                    m[name] = (max(hit, key=lambda t: exists[t]), bare)
                    taken.add(m[name][0])
            out[cid] = m
        return out

    @staticmethod
    def title(url: str) -> str | None:
        m = re.match(r"https?://en\.wikipedia\.org/wiki/(.+)$", url)
        return urllib.parse.unquote(m.group(1)).split("#")[0] if m else None

    def of(self, cid: str, prompt: str, a: dict) -> dict:
        url = self.links.get(cid, {}).get(a["name"])
        found = self.found.get(cid, {}).get(a["name"])
        t = (self.title(url) if url else None) or (found[0] if found else None)
        bare = not (url and self.title(url)) and bool(found and found[1])
        names = [a["name"], *a["aliases"]]
        keys = {misses.norm(n) for n in names}
        # A one-word dictionary word's tag is about the word, not this answer ("master", "watchdog", "Terminology",
        # "Contour"), whatever its case. Evidence only decides below the head, where a Python never is.
        # Three letters or fewer name too many things ("R" the complexity class is not R the language's 47 distro
        # families; "CH", "SMD"): their packages are someone else's, and so are their tags, except in a category
        # whose names are mostly that short (x86 instructions, Unix commands, DNS record types: "mov", "ls", "MX").
        short = lambda n: len(misses.norm(n)) <= 3  # noqa: E731
        se_short = self.short_names.get(cid, False)
        se_keys = {misses.norm(n) for n in names if not (" " not in n and n.lower() in self.dict_words)
                   and (se_short or not short(n))}
        se, _ = self.se.count(se_keys, ["stackoverflow", "unix", "serverfault", "superuser"]) if se_keys else (0, {})
        fam = max((self.families.get(misses.norm(n), 0) for n in names if not short(n)), default=0)
        stars, repo = 0, None
        words = [w[:5] for w in re.findall(r"[a-z]{4,}", subject(prompt))]
        for k in keys:
            r = self.repo_of.get(k)
            v = self.repos.get(r) if r else None
            if v is None:
                continue
            text = (v["description"] + " " + " ".join(v["topics"])).lower().replace("-", " ")
            if any(w in text for w in words) and v["stars"] > stars:
                stars, repo = v["stars"], v["name"]
        # An article several answers link to (a list: "List of HTTP status codes#404") is about none of them.
        # So is a section link ("Bluetooth#L2CAP": the readers came for Bluetooth).
        shared = t is not None and (bool(url and "#" in url) or
                                    sum(1 for u in self.links.get(cid, {}).values() if self.title(u) == t) > 1)
        return {"clicks": self.clicks.get(t, 0) if t and not shared else 0, "wiki": t, "bare": bare, "se": se, "families": fam,
                "stars": stars, "repo": repo}


def evidence_level(e: dict) -> str:
    # A tag can be a namesake ("gui", "svn", "Apollo"), so Stack Exchange lifts only with clicks or stars behind it.
    clicks = 0 if e["bare"] else e["clicks"]
    if clicks >= LIFT["clicks"] or e["stars"] >= LIFT["stars"] or (
            e["se"] >= LIFT["se"] and (clicks >= SOME[0] or e["stars"] >= STARS["strong"])):
        return "lift"
    if e["stars"] >= STARS["strong"]:
        return "strong"
    if e["stars"] >= STARS["some"]:
        v = (e["clicks"], e["se"], e["families"])
        return "strong" if any(s is not None and x >= s for x, s in zip(v, STRONG)) else "some"
    v = (e["clicks"], e["se"], e["families"])
    if any(s is not None and x >= s for x, s in zip(v, STRONG)):
        return "strong"
    if any(s is not None and x >= s for x, s in zip(v, SOME)):
        return "some"
    return "none"


def tier_for(fam: float, ev: str) -> str:
    if fam >= HEAD["off-by-one"]:
        return "off-by-one"
    if fam >= HEAD["npe"]:
        return "npe"
    return {"lift": "npe", "strong": "leak", "some": "race", "none": "heisenbug"}[ev]


# ---------------------------------------------------------------- per category

def categories() -> list[str]:
    out = []
    for p in sorted((REPO / "bank").glob("*/*.md")):
        if p.parent.name in ("reports", "links") or p.name == "index.md":
            continue
        b = pipeline.parse_bank(p)
        if b["status"] != "retired" and any(h in HEADING_TIER for h in b["tiers"]):
            out.append(p.stem)
    return out


def score(cid: str, ev: Evidence | None) -> list[dict]:
    b = pipeline.parse_bank(pipeline.bank_path(cid))
    answers = [{**a, "bank": HEADING_TIER[h]} for h, lst in b["tiers"].items() if h in HEADING_TIER for a in lst]
    if not answers:
        return []
    rdir = REPO / "scripts" / "bank" / "runs" / cid
    rdir.mkdir(parents=True, exist_ok=True)
    jp, hp = rdir / "familiarity-jev.json", rdir / "familiarity-haiku.json"
    J = F.jev(b["prompt"], answers, json.loads(jp.read_text()) if jp.exists() else {})
    jp.write_text(json.dumps(J, indent=1, ensure_ascii=False) + "\n")
    low = [a for a in answers if J[a["name"]]["confidence"] < ROUTE_BELOW]
    H = json.loads(hp.read_text()) if hp.exists() else {}
    if low:
        H = F.haiku(b["prompt"], low, H)
        hp.write_text(json.dumps(H, indent=1, ensure_ascii=False) + "\n")
    for a in answers:
        j = J[a["name"]]
        a["routed"] = j["confidence"] < ROUTE_BELOW
        a["fam"] = H[a["name"]]["score"] if a["routed"] else j["score"]
        a["jev"], a["conf"] = j["score"], j["confidence"]
        if ev is not None:
            a["ev"] = ev.of(cid, b["prompt"], a)
            a["level"] = evidence_level(a["ev"])
            a["tier"] = tier_for(a["fam"], a["level"])
    # Every category's most obvious answers are worth 1 frame, even where nothing clears the absolute bar
    # (specialist prompts: shading techniques, RISC-V extensions): its top MIN_HEAD by familiarity become Off-by-one.
    if ev is not None and not any(a["tier"] == "off-by-one" for a in answers):
        for a in sorted(answers, key=lambda a: -a["fam"])[:MIN_HEAD]:
            a["tier"] = "off-by-one"
    return answers


def report(cid: str, prompt: str, rows: list[dict]) -> str:
    n = len(rows)
    lines = [f"# Scoring: {cid} ({prompt})", "",
             f"{n} answers (Bit Flip and Works on my machine left out); {sum(r['routed'] for r in rows)} routed to Haiku "
             f"(Jev confidence < {ROUTE_BELOW}). Head: familiarity >= {HEAD}. Tail by evidence: strong {STRONG}, some "
             f"{SOME} (clicks/month, Stack Exchange questions, distro families).", "",
             "| tier | new | bank today | of the new, confirmed lines that disagree |", "|---|---|---|---|"]
    for t in TIERS:
        g = [r for r in rows if r["tier"] == t]
        dis = sum(1 for r in g if not r["auto"] and r["bank"] != t)
        lines.append(f"| {t} | {len(g)} ({len(g) / n:.0%}) | {sum(r['bank'] == t for r in rows)} | {dis} |")
    same = sum(r["tier"] == r["bank"] for r in rows)
    lines += ["", f"Same tier as today: {same}/{n} ({same / n:.0%}).", ""]
    fmt = lambda r: (f"{r['name']} {r['fam']:.1f}{'*' if r['routed'] else ''}"  # noqa: E731
                     f" [{r['ev']['clicks']}c {r['ev']['se']}q {r['ev']['families']}f {r['ev']['stars']}s]"
                     f"{'^' if r['level'] == 'lift' and r['fam'] < HEAD['npe'] else ''}")
    for t in TIERS:
        g = sorted((r for r in rows if r["tier"] == t), key=lambda r: (-r["fam"], -r["ev"]["clicks"]))
        lines += [f"## {HEADINGS[t]} ({len(g)})", "", ", ".join(fmt(r) for r in g[:60]) + (" ..." if len(g) > 60 else ""), ""]
    dis = [r for r in rows if not r["auto"] and r["bank"] != r["tier"]]
    if dis:
        lines += ["## Confirmed lines the scores disagree with (never moved)", "",
                  *[f"- {r['name']}: {r['bank']} in the bank, scores say {r['tier']} ({fmt(r)})" for r in dis], ""]
    lines.append("`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence "
                 f"{LIFT}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]")
    return "\n".join(lines) + "\n"


def apply(cid: str, rows: list[dict]) -> int:
    """Move (auto) lines (with any indented note lines under them) to their new tier's section."""
    path = pipeline.bank_path(cid)
    lines = path.read_text().split("\n")
    target = {r["name"]: r["tier"] for r in rows if r["auto"] and r["tier"] != r["bank"]}
    if not target:
        return 0
    moving: dict[str, list[str]] = {t: [] for t in TIERS}
    keep: list[str] = []
    i = 0
    while i < len(lines):
        line = lines[i]
        m = re.match(r"^- (.+?)(?: \|.*)? \(auto\)$", line)
        block = [line]
        while i + 1 < len(lines) and lines[i + 1].startswith("  "):
            i += 1
            block.append(lines[i])
        if m and m.group(1) in target:
            moving[target[m.group(1)]] += block
        else:
            keep += block
        i += 1
    for t in TIERS:
        if not moving[t]:
            continue
        h = f"## {HEADINGS[t]}"
        if h not in keep:
            order = ["Off-by-one", "Works on my machine", "Null pointer exception", "Memory leak", "Race condition", "Heisenbug", "Bit Flip"]
            later = [x for x in order[order.index(HEADINGS[t]) + 1:] if f"## {x}" in keep]
            at = keep.index(f"## {later[0]}") if later else len(keep)
            while at > 0 and keep[at - 1] == "":
                at -= 1
            keep[at:at] = ["", h]
        j = keep.index(h) + 1
        while j < len(keep) and not keep[j].startswith("## "):
            j += 1
        while keep[j - 1] == "":
            j -= 1
        keep[j:j] = moving[t]
    # A tier section left empty by the moves is removed (the grammar allows absent tiers, not empty ones).
    out, k = [], 0
    while k < len(keep):
        if keep[k].startswith("## ") and keep[k][3:] in HEADING_TIER:
            nxt = k + 1
            while nxt < len(keep) and keep[nxt] == "":
                nxt += 1
            if nxt >= len(keep) or keep[nxt].startswith("## "):
                while out and out[-1] == "":
                    out.pop()
                k = nxt
                if out and k < len(keep):
                    out.append("")
                continue
        out.append(keep[k])
        k += 1
    path.write_text("\n".join(out))
    return len(target)


def main() -> int:
    ap = argparse.ArgumentParser(description=(__doc__ or "").split("\n")[0])
    ap.add_argument("ids", nargs="*")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--apply", action="store_true")
    ap.add_argument("--calibrate", action="store_true")
    a = ap.parse_args()
    ids = categories() if a.all else a.ids
    if not ids:
        ap.error("give category ids or --all")
    ev = None if a.calibrate else Evidence(ids)
    summary = ["# Scoring summary", "", f"Head: familiarity >= {HEAD}; tail by evidence: strong {STRONG}, some {SOME}.", "",
               "| category | answers | routed | off-by-one | npe | leak | race | heisenbug | same as today | moved (auto) | confirmed disagree |",
               "|---|---|---|---|---|---|---|---|---|---|---|"]
    totals = {t: 0 for t in TIERS}
    for cid in ids:
        rows = score(cid, ev)
        if not rows:
            continue
        if a.calibrate:
            fams = sorted((r["fam"] for r in rows), reverse=True)
            print(f"{cid:34} n={len(rows):4}  top {fams[0]:.1f}  #>=OBO {sum(f >= HEAD['off-by-one'] for f in fams):3}  "
                  f"#>=NPE {sum(f >= HEAD['npe'] for f in fams):3}  top5 {[round(f, 1) for f in fams[:5]]}")
            continue
        prompt = pipeline.parse_bank(pipeline.bank_path(cid))["prompt"]
        out = REPO / "design" / "scoring" / f"{cid}.md"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(report(cid, prompt, rows))
        moved = apply(cid, rows) if a.apply else 0
        n = len(rows)
        c = {t: sum(r["tier"] == t for r in rows) for t in TIERS}
        for t in TIERS:
            totals[t] += c[t]
        summary.append(f"| {cid} | {n} | {sum(r['routed'] for r in rows)} | " + " | ".join(f"{c[t]}" for t in TIERS) +
                       f" | {sum(r['tier'] == r['bank'] for r in rows) / n:.0%} | {moved} | "
                       f"{sum(1 for r in rows if not r['auto'] and r['bank'] != r['tier'])} |")
        print(f"{cid}: {n} scored, {moved} moved", flush=True)
    if a.calibrate:
        return 0
    tot = sum(totals.values())
    summary += ["", "All: " + ", ".join(f"{t} {totals[t]} ({totals[t] / tot:.0%})" for t in TIERS), ""]
    (REPO / "design" / "scoring" / "summary.md").write_text("\n".join(summary) + "\n")
    if a.apply:
        subprocess.run(["npm", "run", "-s", "bank:index"], cwd=REPO, check=True, capture_output=True)
    print("All: " + ", ".join(f"{t} {totals[t]} ({totals[t] / tot:.0%})" for t in TIERS))
    return 0


if __name__ == "__main__":
    sys.exit(main())
