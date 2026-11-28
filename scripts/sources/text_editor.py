#!/usr/bin/env python3
"""Source-first derivation of "Name a text editor". Stdlib only, no LLM, deterministic.

Usage: python3 -I scripts/sources/text_editor.py
Needs: python3 -I scripts/fetch-corpora.py debian homebrew stackexchange repology wikidata

Membership (a union; each rule is mechanical):
  wikidata        items of the classes text editor (Q131212), source code editor (Q522972) and line editor
                  (Q184900), P31/P279*, with at least one sitelink, minus items also typed as an IDE, word
                  processor, note-taking app, hex editor, HTML editor, library or online service (scope Out)
  repology        projects filed under an editor category in at least two repository families (Gentoo
                  app-editors, FreeBSD/OpenBSD/pkgsrc/MacPorts editors, Debian section editors, ...), minus
                  plugin/addon packages (elpa-*, vim-*, emacs-*, *-mode, ...)
  homebrew        formulae and casks whose description says "text editor", "code editor" or "programmer's editor"
  debian          section-editors packages that ship a /usr/bin program named after the package
Names: a package or cask name that is the label or alias of exactly one Wikidata member is renamed to that label
(emacs -> GNU Emacs, sublime-text -> Sublime Text) and keeps its own name as an alias; then candidates merge by
normalized name (scripts/sources/common.py `merge`).
Aliases: Wikidata aliases (at most 3 words), package and cask tokens, Stack Exchange tag synonyms.
Familiarity: scripts/sources/common.py (se primary; popcon, Homebrew, sitelinks, Repology families secondary).
For a dictionary-word name (atom, sam, acme, joe) the bare tag only counts on Super User and Unix & Linux; the
"<name>-editor" tag counts everywhere.
Writes ~/nullion-corpora/derived/text-editor.json and design/sources/text-editor.md.
"""
import json
import lzma
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import common as C  # noqa: E402

CID = "text-editor"
TAILS = ["text editor", "editor", "code editor", "source code editor"]
WD_SLUGS = ["text-editor", "source-code-editor", "line-editor"]
# Scope Out, by the item's P31 types. STRONG always excludes (SWI-Prolog is also typed "text editor"); WEAK
# excludes only an item not typed as a plain editor too (Geany is an IDE and a source code editor: kept).
STRONG_OUT = re.compile(r"compiler|interpreter|ELPA package|Emacs (extension|mode|theme)|major mode|minor mode|"
                        r"plug-in|fantasy console|software library|JavaScript library|software framework|debugger|"
                        r"web application|online|wiki software", re.I)
WEAK_OUT = re.compile(r"integrated development environment|word processor|note-taking|hex editor|HTML editor|"
                      r"desktop publishing|WYSIWYG|outliner|e-book|graphics|spreadsheet|personal information|"
                      r"programming language", re.I)
PLAIN_EDITOR = {"text editor", "source code editor", "line editor", "modal text editor"}
EDITOR_TYPE = re.compile(r"editor", re.I)  # a member must be typed (P31) as some kind of editor itself
EDITOR_CATS = {"app-editors", "editors", "Editors", "editor", "Applications/Editors", "Development/Editors"}
ADDON = re.compile(r"^(elpa-|emacs-|vim-|neovim-|nvim-|xemacs|python-|perl-|ruby-|r-|node-|lua-|texlive|lib)|"
                   r"(-mode|-el|-plugin|-addon|-addons|-syntax|-common|-data|-doc|-dev|-runtime)$", re.I)
DESC = re.compile(r"\b(text|code|source[- ]code|programmer'?s|plain[- ]text)\s+editor\b", re.I)
SE_WORD_SITES = ["superuser", "unix"]
SUMMARY_OUT = re.compile(r"\b(IDE|integrated development|office suite|word processor|hex editor|binary editor|"
                         r"stream|subtitle|tag editor|map editor|font editor|sound|audio|video|image|photo|"
                         r"diagram|spreadsheet|librar(y|ies)|bindings|plugins?|extensions?|mode for|translation|"
                         r"gettext|PO files?|bibtex|LDAP|e-?books?|EPUB|toolkit|widget|component|distribution|"
                         r"configuration|readline|wrapper|notes?|note-taking|wiki|outliner|LaTeX|TeX|XML|HTML|"
                         r"music|score|database|SQL|JSON|YAML|CSV|registry|partition|disk)\b", re.I)


def wikidata(rejected: dict) -> tuple[list[C.Candidate], dict[str, list[dict]]]:
    items: dict[str, dict] = {}
    for r in C.wikidata(WD_SLUGS):
        items.setdefault(r["qid"], r)
    out, keys = [], {}
    for r in sorted(items.values(), key=lambda r: r["qid"]):
        name = r["label"] or r["enwiki"]
        if not name:
            continue
        bad = [t for t in r["types"] if STRONG_OUT.search(t)] or (
            [] if PLAIN_EDITOR & set(r["types"]) else [t for t in r["types"] if WEAK_OUT.search(t)])
        weak = [t for t in r["types"] if WEAK_OUT.search(t)] if not bad else []
        if bad:
            rejected.setdefault(C.norm(name), f"Wikidata {r['qid']} is also typed {bad[0]!r} (scope Out)")
            continue
        if not any(EDITOR_TYPE.search(t) for t in r["types"]):
            rejected.setdefault(C.norm(name), f"Wikidata {r['qid']} is only an indirect member (types {r['types'][:3]})")
            continue
        if r["sitelinks"] < 1:
            rejected.setdefault(C.norm(name), f"Wikidata {r['qid']} has no sitelinks")
            continue
        bare = re.sub(r"\s*\([^)]*\)$", "", name)  # "Vi (text editor)" -> "Vi"
        if bare != name:
            name = bare
        als = {a for a in r["aliases"] if len(a) <= 30 and len(a.split()) <= 3}
        if r["enwiki"]:
            als.add(re.sub(r"\s*\([^)]*\)$", "", r["enwiki"]))
        out.append(C.Candidate(name, "wikidata", aliases=als, evidence={"qid": r["qid"], "sitelinks": r["sitelinks"],
                                                                        "types": r["types"][:4], "weak_out": weak}))
        for k in {C.norm(n) for n in [name, *als]}:
            keys.setdefault(k, []).append(r)
    return out, keys


def repology(rep: C.Repology, rejected: dict) -> list[C.Candidate]:
    fams: dict[str, set[str]] = {}
    for eff, cats in rep.cats.items():
        for repo, cat in cats:
            if cat in EDITOR_CATS or cat.rsplit("/", 1)[-1] in ("editors", "app-editors"):
                fams.setdefault(eff, set()).add(re.sub(r"[_-]?\d.*$", "", repo))
    out = []
    for eff, fs in sorted(fams.items()):
        summ = " ".join(sorted(rep.summaries.get(eff, ())))
        if ADDON.search(eff) or ":" in eff:
            rejected.setdefault(C.norm(eff), "Repology project looks like an addon or plugin package")
        elif len(fs) < 2:
            rejected.setdefault(C.norm(eff), f"filed as an editor in only one repository family ({sorted(fs)[0]})")
        elif not re.search(r"\beditor\b", summ, re.I) or SUMMARY_OUT.search(summ):
            rejected.setdefault(C.norm(eff), "Repology summaries do not call it an editor, or call it an IDE, "
                                             "office suite, hex editor or similar")
        else:
            out.append(C.Candidate(eff, "repology", evidence={"editor_families": sorted(fs)[:8]}))
    return out


def homebrew(rejected: dict) -> list[C.Candidate]:
    d = C.CORPORA / "homebrew"
    out = []
    for f in json.loads((d / "formula.json").read_text()):
        if f.get("desc") and DESC.search(f["desc"]) and not SUMMARY_OUT.search(f["desc"]) and not ADDON.search(f["name"]):
            out.append(C.Candidate(f["name"], "homebrew:formula", aliases=set(f.get("aliases") or []),
                                   evidence={"desc": f["desc"][:80]}))
    for c in json.loads((d / "cask.json").read_text()):
        if c.get("desc") and DESC.search(c["desc"]) and not SUMMARY_OUT.search(c["desc"]):
            disp = (c.get("name") or [c["token"]])[0]
            out.append(C.Candidate(disp, "homebrew:cask", aliases={c["token"]}, evidence={"desc": c["desc"][:80]}))
    return out


def debian(rejected: dict) -> list[C.Candidate]:
    text = lzma.open(C.CORPORA / "debian" / "Packages.xz", "rt", errors="replace").read()
    pk = []
    for block in text.split("\n\n"):
        m = re.search(r"^Package: (\S+)", block, re.M)
        s = re.search(r"^Section: (\S+)", block, re.M)
        if m and s and s.group(1) == "editors":
            pk.append(m.group(1))
    C.enforce(len(pk) > 100, f"only {len(pk)} Debian editors packages: Packages truncated?")
    import gzip
    want, ships = set(pk), set()
    for line in gzip.open(C.CORPORA / "debian" / "Contents-amd64.gz", "rt", errors="replace"):
        path, _, owners = line.rstrip("\n").rpartition(" ")
        path = path.strip()
        if path.startswith("usr/bin/") and path.count("/") == 2:
            b = path[8:]
            for o in owners.split(","):
                p = o.rsplit("/", 1)[-1]
                if p == b and p in want:
                    ships.add(p)
    out = []
    for p in sorted(pk):
        if p in ships and not ADDON.search(p):
            out.append(C.Candidate(p, "debian", package=p))
        else:
            rejected.setdefault(C.norm(p), "Debian editors package without a program of its own name (addon/data)")
    return out


def norm_keys(e: C.Entry) -> set[str]:
    return {C.norm(e.name)}


def build() -> tuple[list[C.Entry], dict, dict]:
    rejected: dict[str, str] = {}
    rep = C.Repology()
    wd, wd_keys = wikidata(rejected)
    sources = {"wikidata": wd, "repology": repology(rep, rejected), "homebrew": homebrew(rejected),
               "debian": debian(rejected)}
    counts = {k: len({C.norm(c.name) for c in v}) for k, v in sources.items()}
    for src in ("repology", "homebrew", "debian"):
        for c in sources[src]:
            for n in [c.name, *c.aliases]:
                bare = re.sub(r"[-_ ](text[-_ ])?editor$", "", n, flags=re.I)
                if bare != n and len(bare) >= 2:
                    c.aliases.add(bare)
            hits = {r["qid"]: r for k in {C.norm(n) for n in [c.name, *c.aliases]} for r in wd_keys.get(k, [])}
            if len(hits) == 1:
                r = next(iter(hits.values()))
                label = r["label"] or r["enwiki"]
                if C.norm(label) != C.norm(c.name):
                    c.aliases.add(c.name)
                    c.name = label
    entries = C.merge([c for v in sources.values() for c in v], prefer=["wikidata", "homebrew", "repology", "debian"])
    # a name the Wikidata Out rule rejected stays out even when a package source has it (LibreOffice, Qt Creator)
    vetoed = {k for k, why in rejected.items() if "(scope Out)" in why}
    for e in entries:
        if norm_keys(e) & vetoed and "wikidata" not in e.sources:
            rejected.setdefault(C.norm(e.name), "vetoed: Wikidata types it as scope Out")
    entries = [e for e in entries if not (norm_keys(e) & vetoed and "wikidata" not in e.sources)]
    # an item typed both as a plain editor and as a weak Out kind (Evernote: note-taking and text editor;
    # AppCode: IDE and text editor) needs a second membership source
    mixed = [e for e in entries if e.sources == {"wikidata"} and e.evidence["wikidata"]["weak_out"]]
    for e in mixed:
        rejected.setdefault(C.norm(e.name), f"Wikidata also types it {e.evidence['wikidata']['weak_out'][0]!r} "
                                            "and no other source lists it as an editor")
    entries = [e for e in entries if e not in mixed]
    # a Wikidata-only member needs two sitelinks (one-sitelink items include CodeMirror and iText)
    thin = [e for e in entries if e.sources == {"wikidata"} and e.evidence["wikidata"]["sitelinks"] < 2]
    for e in thin:
        rejected.setdefault(C.norm(e.name), "Wikidata-only with a single sitelink")
    entries = [e for e in entries if e not in thin]
    se, pop, brew = C.StackExchange(), C.popcon(), C.homebrew_installs()
    words = C.dictionary_words()
    wd_by_name = {C.norm(c.name): c.evidence for c in wd}
    rep_keys = {C.norm(k): k for k in rep.families}
    for e in entries:
        e.aliases |= se.synonym_aliases(e.keys())
        keys = e.keys()
        word = e.name.lower() in words or len(C.norm(e.name)) <= 3
        ed_keys = {k + "editor" for k in keys} | {k + "texteditor" for k in keys}
        if word:
            t1, p1 = se.count(keys, SE_WORD_SITES)
            t2, p2 = se.count(ed_keys, C.SE_SITES)
            per = {s: max(p1.get(s, 0), p2.get(s, 0)) for s in C.SE_SITES if p1.get(s) or p2.get(s)}
            e.evidence["se_word_rule"] = f"dictionary word or <= 3 characters: bare tag counted on {SE_WORD_SITES} only"
        else:
            _, per = se.count(keys | ed_keys, C.SE_SITES)
        e.signals["se"] = sum(per.values())
        if per:
            e.evidence["se"] = per
        w = wd_by_name.get(C.norm(e.name))
        if w:
            e.signals["sitelinks"] = w["sitelinks"]
        effs = sorted({rep_keys[k] for k in keys if k in rep_keys}, key=lambda x: (-rep.families[x], x))
        if effs:
            e.signals["repology"] = rep.families[effs[0]]
            e.evidence["repology"] = effs[0]
        pops = [(pop[n], n) for n in sorted({e.name, *e.aliases, *e.packages}) if n in pop]
        if pops:
            e.signals["popcon"], e.evidence["popcon"] = max(pops)
        bs = [(brew[n], n) for n in sorted({e.name, *e.aliases}) if n in brew]
        if bs:
            e.signals["brew"], e.evidence["brew"] = max(bs)
    C.familiarity(entries, ["popcon", "brew", "sitelinks", "repology"])
    return entries, rejected, {"counts": counts}


def main() -> None:
    entries, rejected, info = build()
    bank = C.bank_answers(CID)
    cutoffs, matched = C.calibrate(entries, bank, TAILS)
    out = C.write_derived(CID, entries)
    probe = json.loads((C.REPO / "scripts/bank/runs" / CID / "probe.json").read_text())
    import report  # noqa: E402
    report.write(CID, "Name a text editor", entries, cutoffs, matched, rejected, probe, TAILS, info,
                 sources_doc=__doc__,
                 inputs=["wikidata/class-text-editor-Q131212.json", "repology/packages.tsv.gz", "homebrew/cask.json",
                         "debian/Packages.xz", "stackexchange/unix-tags.json"],
                 notes=["Probe caveat: Haiku wrote the probe with the scope spec in its prompt, and the scope's "
                        "examples were taken from the bank, so the probe leans toward names the bank already has."])
    print(f"{len(entries)} entries -> {out}; cut-offs {cutoffs}; {C.agreement(matched)}")


if __name__ == "__main__":
    main()
