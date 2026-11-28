"""Shared pieces of the source-first combiners (scripts/sources/<id>.py). Stdlib only, no LLM, deterministic.

A combiner builds Candidates from structured sources, merges them by name (`merge`), attaches familiarity signals,
scores them (`familiarity`), tiers them with cut-offs fitted to the bank's tiered answers (`fit_cutoffs`) and writes
~/nullion-corpora/derived/<id>.json plus design/sources/<id>.md (`report`).

Familiarity (documented in each report):
  se   = Stack Exchange question count of the entry's tag, summed over Stack Overflow, Unix & Linux, Server Fault and
         Super User (per site: the largest count among the entry's names, through that site's tag synonyms). A name
         that is an English dictionary word (/usr/share/dict/words: "master", "update", "atom") only counts on the
         category's `se_word_sites`, because the bare tag usually means something else on Stack Overflow.
  each secondary signal x (popcon installs, Homebrew 365-day installs, Wikidata sitelinks, Repology families,
  kernel-Documentation mentions) is normalised as min(1, log1p(x) / log1p(ref)), ref = the category's 3rd-largest
  value of that signal (the bank scorer's convention), and so is se.
  Package-level signals (popcon, Homebrew, Repology) count half for a name that is not its package's own name
  (systemd-journald does not inherit all of systemd's installs).
  score = W_SE * se_n + (1 - W_SE) * mean(secondary signals the entry HAS a source for). An entry with no secondary
  source (a kernel thread, a macOS daemon) is scored on se alone, so a zero Stack Exchange count means "deepest".
Tiers: Off-by-one / NPE / Leak / Race / Heisenbug by four score cut-offs, fitted to the bank's tiered answers that
the derived set contains (an optimal monotone split, `fit_cutoffs`). Works on my machine and Bit Flip are hand
picks and never derived.
"""
import gzip
import importlib.util
import json
import math
import pathlib
import re
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field

REPO = pathlib.Path(__file__).resolve().parent.parent.parent
CORPORA = pathlib.Path("~/nullion-corpora").expanduser()
LADDER = ["off-by-one", "npe", "leak", "race", "heisenbug"]  # most to least familiar
HEADINGS = {"Off-by-one": "off-by-one", "Works on my machine": "womm", "Null pointer exception": "npe",
            "Memory leak": "leak", "Race condition": "race", "Heisenbug": "heisenbug", "Bit Flip": "bitflip"}
SE_SITES = ["stackoverflow", "unix", "serverfault", "superuser"]
W_SE = 0.6


def _load(name: str, path: pathlib.Path):
    spec = importlib.util.spec_from_file_location(name, path)
    assert spec and spec.loader, path
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


norm = _load("bank_dupes", REPO / "scripts" / "bank-dupes.py").norm  # the game's normalization


def enforce(cond: bool, msg: str) -> None:
    if not cond:
        raise AssertionError(msg)


# ---------------------------------------------------------------- candidates and merging

@dataclass
class Candidate:
    name: str
    source: str                      # e.g. "debian:service-unit", "macos:LaunchDaemons", "kernel:kthread"
    aliases: set[str] = field(default_factory=set)
    package: str | None = None       # Debian binary package, when it came from Debian
    evidence: dict = field(default_factory=dict)


@dataclass
class Entry:
    name: str
    aliases: set[str]
    sources: set[str]
    packages: set[str]
    evidence: dict
    signals: dict = field(default_factory=dict)
    score: float = 0.0
    tier: str = ""

    def keys(self) -> set[str]:
        return {norm(n) for n in [self.name, *self.aliases]} - {""}


def merge(cands: list[Candidate], prefer: list[str]) -> list[Entry]:
    """Candidates with the same normalized NAME become one entry (aliases never merge two entries: a generic
    alias such as "apache" would chain unrelated things). The display name is the first candidate's in `prefer`
    source order (then alphabetical). Aliases that are another entry's name are dropped from this one."""
    groups: dict[str, list[Candidate]] = {}
    for c in cands:
        k = norm(c.name)
        enforce(bool(k), f"empty name from {c.source}: {c.name!r}")
        groups.setdefault(k, []).append(c)
    rank = {s: i for i, s in enumerate(prefer)}
    out = []
    for k, cs in sorted(groups.items()):
        cs.sort(key=lambda c: (rank.get(c.source.split(":")[0], len(rank)), c.name))
        ev: dict = {}
        for c in cs:
            ev.setdefault(c.source, c.evidence or True)
        out.append(Entry(name=cs[0].name, aliases={a for c in cs for a in c.aliases} | {c.name for c in cs},
                         sources={c.source for c in cs}, packages={c.package for c in cs if c.package}, evidence=ev))
    names = {norm(e.name) for e in out}
    for e in out:
        own = norm(e.name)
        e.aliases = {a for a in e.aliases if norm(a) and norm(a) != own and norm(a) not in names}
        # one spelling per normalized key, the shortest-then-alphabetical one
        best: dict[str, str] = {}
        for a in sorted(e.aliases, key=lambda a: (len(a), a)):
            best.setdefault(norm(a), a)
        e.aliases = set(best.values())
    return out


# ---------------------------------------------------------------- signals

def dictionary_words() -> set[str]:
    p = pathlib.Path("/usr/share/dict/words")
    enforce(p.exists(), "/usr/share/dict/words is missing (macOS ships it): the dictionary-word rule needs it")
    return {w.strip().lower() for w in p.read_text().splitlines() if w.strip() and w[0].islower()}


class StackExchange:
    """Tag counts and synonyms per site. Unix & Linux, Server Fault and Super User tags are the API's top 2,500 by
    count (TRUNCATED: a tag missing there has fewer than that site's floor, which `floors` records)."""

    def __init__(self) -> None:
        d = CORPORA / "stackexchange"
        self.counts: dict[str, dict[str, int]] = {}
        self.floors: dict[str, int] = {}
        so: dict[str, int] = {}
        for row in ET.parse(d / "stackoverflow-Tags.xml").getroot():
            k = norm(row.get("TagName", ""))
            so[k] = max(so.get(k, 0), int(row.get("Count", "0")))
        self.counts["stackoverflow"] = so
        self.floors["stackoverflow"] = 0
        for site in SE_SITES[1:]:
            rows = json.loads((d / f"{site}-tags.json").read_text())
            c: dict[str, int] = {}
            for r in rows:
                k = norm(r["name"])
                c[k] = max(c.get(k, 0), r["count"])
            self.counts[site] = c
            self.floors[site] = min(r["count"] for r in rows) if len(rows) >= 2500 else 0
        self.syn: dict[str, dict[str, str]] = {}
        self.syn_from: dict[str, dict[str, set[str]]] = {}
        for site in SE_SITES:
            m, back = {}, {}
            for r in json.loads((d / f"{site}-tag-synonyms.json").read_text()):
                m[norm(r["from_tag"])] = norm(r["to_tag"])
                back.setdefault(norm(r["to_tag"]), set()).add(r["from_tag"])
            self.syn[site], self.syn_from[site] = m, back

    def count(self, keys: set[str], sites: list[str]) -> tuple[int, dict]:
        per = {}
        for site in sites:
            best = 0
            for k in keys:
                best = max(best, self.counts[site].get(self.syn[site].get(k, k), 0))
            if best:
                per[site] = best
        return sum(per.values()), per

    def synonym_aliases(self, keys: set[str]) -> set[str]:
        """One-word from_tags whose to_tag is one of the keys (postgres -> postgresql). Multi-word synonyms are
        mostly phrasings or neighbours ("mysql-query", "mysql-server") and are left out."""
        return {t for site in SE_SITES for k in keys for t in self.syn_from[site].get(k, ()) if "-" not in t}


def popcon() -> dict[str, int]:
    out = {}
    for line in gzip.open(CORPORA / "debian" / "popcon-by_inst.gz", "rt", errors="replace"):
        if line[:1].isdigit():
            f = line.split()
            out[f[1]] = int(f[2])
    enforce(len(out) > 10000, "popcon looks truncated")
    return out


def homebrew_installs() -> dict[str, int]:
    """formula or cask token -> 365-day installs (formula and cask counts added when a token is both)."""
    out: dict[str, int] = {}
    for f, key in (("analytics-formula-install-365d.json", "formula"), ("analytics-cask-install-365d.json", "cask")):
        for it in json.loads((CORPORA / "homebrew" / f).read_text())["items"]:
            out[it[key]] = out.get(it[key], 0) + int(it["count"].replace(",", ""))
    return out


def tsv_rows(path: pathlib.Path):
    with gzip.open(path, "rt", errors="replace") as f:
        head = f.readline().rstrip("\n").split("\t")
        for line in f:
            yield dict(zip(head, line.rstrip("\n").split("\t")))


def pg_array(v: str) -> list[str]:
    if v in ("\\N", "", "{}"):
        return []
    enforce(v.startswith("{") and v.endswith("}"), f"not a COPY array: {v[:60]!r}")
    return [x.strip('"') for x in v[1:-1].split(",") if x]


class Repology:
    """The dump's extracts: per project (effname) its repo count and families; per (repo, name) its project."""

    def __init__(self) -> None:
        d = CORPORA / "repology"
        enforce((d / "packages.tsv.gz").exists(), "run: python3 -I scripts/fetch-corpora.py repology")
        self.families: dict[str, int] = {}
        for r in tsv_rows(d / "metapackages.tsv.gz"):
            self.families[r["effname"]] = int(r["num_families"])
        self.by_repo: dict[str, dict[str, str]] = {}   # repo -> package name (src/bin/visible) -> effname
        self.cats: dict[str, set[tuple[str, str]]] = {}  # effname -> {(repo, category)}
        self.names: dict[str, set[str]] = {}            # effname -> binary/visible names seen anywhere
        self.summaries: dict[str, set[str]] = {}        # effname -> summaries of its rows in an *edit* category
        for r in tsv_rows(d / "packages.tsv.gz"):
            eff = r["effname"]
            m = self.by_repo.setdefault(r["repo"], {})
            for n in [r["srcname"], r["binname"], r["visiblename"], *pg_array(r["binnames"])]:
                if n and n != "\\N":
                    m.setdefault(n, eff)
            if r["category"] not in ("\\N", ""):
                self.cats.setdefault(eff, set()).add((r["repo"], r["category"]))
                if "edit" in r["category"].lower() and r["comment"] != "\\N":
                    self.summaries.setdefault(eff, set()).add(r["comment"])
            names = self.names.setdefault(eff, set())
            for n in [r["visiblename"], r["binname"]]:
                if n and n != "\\N":
                    names.add(n)


def wikidata(slugs: list[str]) -> list[dict]:
    rows = []
    for slug in slugs:
        hits = sorted((CORPORA / "wikidata").glob(f"class-{slug}-Q*[0-9].json"))
        enforce(len(hits) == 1, f"wikidata class {slug}: run python3 -I scripts/fetch-corpora.py wikidata ({hits})")
        for r in json.loads(hits[0].read_text()):
            rows.append({**r, "class": slug})
    return rows


def norm_signal(values: dict[str, float]) -> dict[str, float]:
    """min(1, log1p(x)/log1p(ref)), ref = the 3rd-largest value (or the largest when there are fewer)."""
    xs = sorted((v for v in values.values() if v > 0), reverse=True)
    if not xs:
        return {k: 0.0 for k in values}
    ref = xs[min(2, len(xs) - 1)]
    return {k: min(1.0, math.log1p(v) / math.log1p(ref)) if v > 0 else 0.0 for k, v in values.items()}


def familiarity(entries: list[Entry], secondary: list[str]) -> None:
    """Fill entry.score from entry.signals: `se` (required) and the `secondary` signals that are present. A
    secondary signal missing from entry.signals means the entry has no source for it (not counted); present with
    0 means the source has it with no installs / links (counted as 0)."""
    for name in ["se", *secondary]:
        vals = {id(e): float(e.signals[name]) for e in entries if name in e.signals}
        if name == "se":
            enforce(len(vals) == len(entries), "every entry needs an se signal (0 when no tag matches)")
        n = norm_signal(vals)
        for e in entries:
            if id(e) in n:
                e.signals[name + "_n"] = round(n[id(e)] * e.signals.get(name + "_weight", 1.0), 4)
    for e in entries:
        sec = [e.signals[s + "_n"] for s in secondary if s + "_n" in e.signals]
        e.score = round(W_SE * e.signals["se_n"] + (1 - W_SE) * (sum(sec) / len(sec)) if sec else e.signals["se_n"], 4)


def fit_cutoffs(pairs: list[tuple[float, str]]) -> list[float]:
    """Four descending score cut-offs that split the (score, bank tier) pairs, sorted by score, into LADDER's five
    tiers with the most exact agreements (dynamic programming over contiguous groups). Equal scores always share a
    tier, so the bank's labels never split a tie (all zero-signal answers land together). A cut-off sits midway
    between the neighbouring scores."""
    enforce(all(t in LADDER for _, t in pairs), "pairs must use LADDER tiers")
    enforce(len(pairs) >= len(LADDER), f"need at least {len(LADDER)} calibration pairs, got {len(pairs)}")
    ps = sorted(pairs, key=lambda p: (-p[0], LADDER.index(p[1])))  # tie order is irrelevant: ties never split
    n, k = len(ps), len(LADDER)
    NEG = -1
    # best[j][i]: most agreements putting the first i pairs into tiers 0..j; cut[j][i]: where tier j starts
    # a boundary may not split equal scores: tiers come from the score alone, never from the bank label
    ok = [i == 0 or i == n or ps[i - 1][0] != ps[i][0] for i in range(n + 1)]
    best = [[NEG] * (n + 1) for _ in range(k)]
    cut = [[0] * (n + 1) for _ in range(k)]
    for i in range(n + 1):
        if ok[i]:
            best[0][i] = sum(1 for s, t in ps[:i] if t == LADDER[0])
    for j in range(1, k):
        for i in range(n + 1):
            run = 0  # agreements of ps[s:i] with tier j, grown as s moves left
            for s in range(i, -1, -1):
                if s < i and ps[s][1] == LADDER[j]:
                    run += 1
                if not ok[s] or best[j - 1][s] == NEG:
                    continue
                v = best[j - 1][s] + run
                if v > best[j][i]:
                    best[j][i], cut[j][i] = v, s
    bounds, i = [], n
    for j in range(k - 1, 0, -1):
        s = cut[j][i]
        bounds.append(s)
        i = s
    bounds.reverse()  # index where tiers 1..4 start
    out = []
    for b in bounds:
        hi = ps[b - 1][0] if b > 0 else ps[0][0] + 1.0
        lo = ps[b][0] if b < n else ps[-1][0] - 1.0
        out.append(round((hi + lo) / 2, 4))
    for a, b in zip(out, out[1:]):
        enforce(a >= b, f"cut-offs not descending: {out}")
    return out


def tier_of(score: float, cutoffs: list[float]) -> str:
    for t, c in zip(LADDER, cutoffs):
        if score >= c:
            return t
    return LADDER[-1]


# ---------------------------------------------------------------- the bank, the probe, the report

def bank_file(cid: str) -> pathlib.Path:
    hits = [p for p in (REPO / "bank").glob(f"*/{cid}.md") if p.parent.name != "reports"]
    enforce(len(hits) == 1, f"{cid}: expected one bank file, found {hits}")
    return hits[0]


def bank_answers(cid: str) -> list[dict]:
    """The tier lines (the playable answers; the Inbox is never played): [{name, aliases, tier}]."""
    out, tier = [], None
    for line in bank_file(cid).read_text().splitlines():
        if line.startswith("## "):
            h = line[3:].strip()
            if h == "Inbox":
                break
            enforce(h in HEADINGS, f"{cid}: unknown heading {h!r}")
            tier = HEADINGS[h]
        elif line.startswith("- ") and tier:
            body = re.sub(r"\s*\((?:auto|suggested: [a-z-]+)\)\s*$", "", line[2:])
            parts = [p.strip() for p in body.split("|") if p.strip()]
            out.append({"name": parts[0], "aliases": parts[1:], "tier": tier})
    enforce(bool(out), f"{cid}: no tiered answers")
    return out


def key_index(entries: list[Entry]) -> dict[str, Entry]:
    idx: dict[str, Entry] = {}
    for e in sorted(entries, key=lambda e: -e.score):
        for k in e.keys():
            idx.setdefault(k, e)
    return idx


def lookup(idx: dict[str, Entry], name: str, aliases: list[str], tails: list[str]) -> Entry | None:
    """The derived entry a bank or probe answer lands on: its name or an alias, also with a generic tail noun
    dropped ("unbound daemon" -> unbound), as the game's phrasings() and the pipeline's probe_keys() do."""
    keys = []
    for n in [name, *aliases]:
        k = norm(n)
        keys.append(k)
        for t in tails:
            tk = norm(t)
            if k.endswith(tk) and len(k) > len(tk) + 1:
                keys.append(k[: -len(tk)])
    for k in keys:
        if k in idx:
            return idx[k]
    return None


def write_derived(cid: str, entries: list[Entry]) -> pathlib.Path:
    out = CORPORA / "derived" / f"{cid}.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    rows = [{"name": e.name, "aliases": sorted(e.aliases, key=lambda a: (a.lower(), a)), "tier": e.tier, "score": e.score,
             "sources": sorted(e.sources), "evidence": {**e.evidence, "packages": sorted(e.packages),
                                                        "signals": e.signals}}
            for e in sorted(entries, key=lambda e: (-e.score, e.name.lower()))]
    tmp = out.with_name(out.name + ".part")
    tmp.write_text(json.dumps(rows, indent=1, ensure_ascii=False) + "\n")
    tmp.replace(out)
    return out


def calibrate(entries: list[Entry], bank: list[dict], tails: list[str]) -> tuple[list[float], list[dict]]:
    """Fit the cut-offs on the bank's ladder-tier answers found in `entries`, then tier every entry. Returns the
    cut-offs and the matched bank rows [{bank, tier, entry}]."""
    idx = key_index(entries)
    matched = []
    for b in bank:
        e = lookup(idx, b["name"], b["aliases"], tails)
        matched.append({"bank": b, "entry": e})
    pairs = [(m["entry"].score, m["bank"]["tier"]) for m in matched if m["entry"] and m["bank"]["tier"] in LADDER]
    cutoffs = fit_cutoffs(pairs)
    for e in entries:
        e.tier = tier_of(e.score, cutoffs)
    return cutoffs, matched


def agreement(matched: list[dict]) -> dict:
    ps = [(LADDER.index(m["bank"]["tier"]), LADDER.index(m["entry"].tier)) for m in matched
          if m["entry"] and m["bank"]["tier"] in LADDER]
    n = len(ps)
    exact = sum(a == b for a, b in ps)
    near = sum(abs(a - b) <= 1 for a, b in ps)
    # Spearman's rho on the tier ranks (ties averaged)
    def ranks(xs):
        order = sorted(range(len(xs)), key=lambda i: xs[i])
        r = [0.0] * len(xs)
        i = 0
        while i < len(xs):
            j = i
            while j + 1 < len(xs) and xs[order[j + 1]] == xs[order[i]]:
                j += 1
            for t in range(i, j + 1):
                r[order[t]] = (i + j) / 2
            i = j + 1
        return r
    rho = None
    if n > 2:
        ra, rb = ranks([a for a, _ in ps]), ranks([b for _, b in ps])
        ma, mb = sum(ra) / n, sum(rb) / n
        cov = sum((x - ma) * (y - mb) for x, y in zip(ra, rb))
        va, vb = sum((x - ma) ** 2 for x in ra), sum((y - mb) ** 2 for y in rb)
        rho = round(cov / math.sqrt(va * vb), 3) if va and vb else None
    return {"n": n, "exact": exact, "within_one": near, "spearman": rho}


def confusion(matched: list[dict]) -> list[str]:
    rows = ["| bank \\ derived | " + " | ".join(LADDER) + " |", "|---|" + "---|" * len(LADDER)]
    for bt in LADDER:
        cells = [sum(1 for m in matched if m["entry"] and m["bank"]["tier"] == bt and m["entry"].tier == dt) for dt in LADDER]
        rows.append(f"| {bt} | " + " | ".join(str(c) for c in cells) + " |")
    return rows


def probe_section(entries: list[Entry], cid: str, probe: list[dict], tails: list[str]) -> tuple[list[str], dict]:
    idx = key_index(entries)
    bank_idx = {}
    for b in bank_answers(cid):
        for n in [b["name"], *b["aliases"]]:
            bank_idx.setdefault(norm(n), b)
    got, bank_got, rows = 0, 0, []
    for x in probe:
        e = lookup(idx, x["name"], x.get("aliases", []), tails)
        in_bank = lookup(bank_idx, x["name"], x.get("aliases", []), tails) is not None  # type: ignore[arg-type]
        got += e is not None
        bank_got += in_bank
        rows.append(f"| {x['name']} | {x.get('depth', '')} | {x.get('sub_kind', '')} | "
                    f"{(e.name + ' (' + e.tier + ')') if e else '**missing**'} | {'yes' if in_bank else 'no'} |")
    n = len(probe)
    head = [f"Derived covers **{got}/{n}** probe answers; the current bank's playable tiers cover **{bank_got}/{n}**.", "",
            "| probe answer | depth | sub-kind | derived | in bank tiers |", "|---|---|---|---|---|", *rows]
    return head, {"derived": got, "bank": bank_got, "n": n}
