# Answer games: scope, aliases, rarity, and missed answers

Researched 2026-11-27 for the playtest misses in `design/misses/2026-11-27-seed.md`. This builds on
`docs/research/krillion-internals.md` and does not repeat it: krillion's fixed per-day sheet, its mined-typo aliases, the
fact that player share never sets a tier, Algillion's Wikidata `w<QID>` keys with sitelink tiers, and the cached LLM
judge are all covered there.

Labels, as in that file:
- **VERIFIED** means I saw it myself: in this repo, in a live query I ran, or on a cited page.
- **INFERRED** means I reasoned it from evidence, and the reasoning is given.
- **UNVERIFIED** means it comes from memory or a secondary source I could not open.

Raw query outputs are in the session scratchpad, which may get cleared:
`/private/tmp/claude-501/-Users-axvon-nullion/7ba8a6bd-03a6-42e7-81f7-d1be06ea0979/scratchpad/wd/`.

---

## TL;DR

1. **Most of the misses are scope problems, and the scope comes from the harvest plan rather than from the prompt.**
   VERIFIED in the repo:
   - `historical-cipher` is harvested from one Python library (`jameslyons/pycipher`).
   - `unix-daemon` is harvested only from FreeBSD's `usr.sbin` and `libexec`, so Linux kernel threads such as kswapd
     can't appear.
   - `text-editor` is harvested from package listings (nixpkgs, FreeBSD ports `editors`). `ex` ships inside the vi
     and nvi packages, so it is missing while `ed` is present.

   The one-line `> Accepts:` is the only written scope, and it doesn't settle the boundary cases the owner hit.
2. **Three of the owner's database misses (ScyllaDB, LMDB, etcd) are already in the Inbox, along with about a dozen
   more.** The misses triage did its job, but the Inbox is never played. There are 56 Inbox lines across approved
   categories, 17 of them in `database`.
3. **Wikidata is a good free recall and alias source for software categories and a poor one for concept categories.**
   - Text editors: the subtree of Q131212 has 668 items. It contains `ex` (17 sitelinks), `acme`, `UltraEdit`, `XEdit`,
     `Edlin` and others the bank lacks, and gives aliases such as `JOE`, `vscode` and `TIP Isn't Pico`.
   - DBMSs: it has ScyllaDB, LMDB (with alias `LMDB`), etcd, Riak, IMS (alias `IMS`) and Ingres.
   - It misses SQLite, Memcached and DTrace because of how they are typed, and it has nothing at all for kswapd, talloc
     or patristocrat.
   - "classical cipher" (Q10855346) has a single member.
4. **Sitelink count follows the bank's text-editor tiers in order.** Median sitelinks are 47 for Off-by-one, 14.5 for
   Null pointer exception, 10 for Memory leak, 3.5 for Race condition and 1 for Heisenbug. That makes it a usable
   rarity sanity check, not a tier setter.
5. **Jump Point Search has the alias `JPS` in Wikidata** (Q17037441), but English Wikipedia has no `JPS` redirect to
   it. The two alias sources complement each other.
6. **Quizbowl's answer-line grammar is the best model for a scope spec.** Each answer line says `accept` / `prompt on` /
   `do not accept`, and moderators "should not prompt in the absence of a specific directive". Its "prompt" is exactly
   the "Azimuthal" and "Mica" case.
7. Clones confirm what everyone does for aliases: an LLM writes "other names, common abbreviations, alternate
   spellings … Do not include misspellings" at build time (hanzpo). One clone adds a play-time "is this another name
   for a listed entry?" resolver, which is worth copying offline.

---

## 1. The owner's misses against the bank (VERIFIED in this repo)

| Miss | What the bank has | Root cause |
|---|---|---|
| ScyllaDB, LMDB, etcd, Riak, RethinkDB, ArangoDB, LevelDB, Informix, Ingres, dBase, FoxPro, IMS, VoltDB (database) | All in `## Inbox` of `bank/data-graphics-algorithms/database.md`, lines 89–106, with suggested tiers. Cassandra is tiered (`Apache Cassandra \| Cassandra`). | The misses triage put them there. The Inbox has no promotion step. Cassandra was probably logged before the alias existed (INFERRED). |
| Excel should be Works on my machine (database) | Absent. | The tier is hand-curated by design (krillion does the same, see krillion-internals §7.5). It is a judgement call, not a data gap. |
| `ex` (text editor) | `ed \| GNU ed` is tiered; `ex` is not. Plan: nixpkgs `pkgs/applications/editors` + FreeBSD ports `editors`. | Harvest by package listing. `ex` is a mode or link of vi, nvi or vim, not its own package (INFERRED). Wikidata lists it as Q284328, "line editor for Unix systems", 17 sitelinks. |
| kswapd (Unix daemon) | Not present. `> Accepts: Any named background service program on a Unix-like system, as named in its man page…`. Plan: FreeBSD `usr.sbin`, `libexec`. | The source is FreeBSD-only, and the Accepts line ("program", "man page") arguably excludes kernel threads. That is an unwritten scope ruling. |
| DTrace (Linux tracing tool) | Mentioned only inside a SystemTap `note:` ("…the DTrace vs. Linux era"). | "Linux tracing tool" can mean either "native to Linux" or "runs on Linux". UNVERIFIED from memory: DTrace has Linux ports (Oracle's `dtrace-utils`, and the older `dtrace4linux`). |
| talloc (memory allocator) | Not present. Plan heads: `allocator`, `malloc` over kernel, llvm, folly, redis and freebsd. | Samba's talloc (hierarchical pool allocator) isn't in those trees. Wikidata has no item for it. |
| Patristocrat vs Caesar (historical cipher) | 36 tiered entries. Caesar is tiered `Null pointer exception` (with `ROT13` as its alias); One-time pad is `Off-by-one`. Plan source: `pycipher` only. | "Historical" draws no boundary. The single source decides membership, and rarity follows from that source. |
| JPS (graph algorithm) | `Jump Point Search (auto)`, no alias. | The alias list came from an LLM without acronym prompting. |
| Azimuthal (map projection) | `Azimuthal equidistant projection \| aeqd`, `Lambert azimuthal equal-area …`, and a duplicate `Azimuthal equidistant (auto)`. | "Azimuthal" names a family (class) of projections. It is a "prompt on" case, not an alias, and there is no rule for those. |
| Mica (operating system) | `DEC MICA \| MICA (auto)` (operating-system.md:2191). | A one-sense alias for a name with several senses. Wikidata has no Mica Linux distro either, so this collision is invisible to both sources. |
| "Autocorrect in ask mode doesn't seem to work" | Out of scope for research. Possibly the CLAUDE.md rule that a 7+ letter one-typo correction "never asks". | Needs a repro. Flagged here so it isn't lost. |

---

## 2. How other games handle it

### 2a. What counts as a valid answer (scope)

- **krillion** (VERIFIED, [FAQ](https://krillion.io/faq)): sets are built "by aggregating datasets (dictionaries, wiki
  pages, encyclopedias, whatever sources the question calls for)". Missing answers happen because "sometimes I miss a
  source". Scope therefore comes from the source, as in nullion.
  - INFERRED from the sheet in krillion-internals §1.5: when a prompt's scope is a property (rivers "over 50 miles"),
    krillion writes that property into the prompt itself.
- **Algillion** (VERIFIED, krillion-internals §2.3): every prompt carries a one-line `hint` shown to the player, e.g.
  "Name a data structure" → "A way to organise data in a program." The player sees the scope up front. nullion shows
  its `> Accepts:` text only after two rejections.
- **Quizbowl (NAQT)** has the most worked-out convention for writing down scope, in the answer line itself:
  - each answer line lists what to accept, what to prompt on, and what not to accept;
  - "prompt on partial answer" covers a subset of the underlined words, and "accept word forms" covers inflections;
  - moderators "should not prompt in the absence of a specific directive to do so", per NAQT's
    [Correctness Guidelines](https://naqt.com/rules/correctness-guidelines.html) as quoted in search results. The
    page itself returned 403 to me, so this is UNVERIFIED in full.
  - A primer ([UW quizbowl](https://students.washington.edu/quizbowl/what-is-quizbowl/part4A.html), VERIFIED) defines
    a **prompt** as the reply to an answer that is "technically correct but too broad" ("encourage the player to be
    more specific"), and an **anti-prompt** as the reply to one that is too specific.
  - qbwiki says prompts are for answers "correct but … ambiguous" ([Talk:Prompts](https://qbwiki.com/wiki/Talk:Prompts),
    via search; the page returned 403 to me).
- **Tenable (ITV)**: list questions "start with some guidance on what they are looking for specifically and what they
  cannot accept" (TV listing quoted in search; [Wikipedia](https://en.wikipedia.org/wiki/Tenable)). This is
  UNVERIFIED beyond that snippet. The scope is stated before the player answers.
- **Pointless (BBC)**: a 100-person online survey (Redshift Research) sets the scores; a correct answer nobody gave is
  "pointless" and scores 0 ([Den of Geek](https://www.denofgeek.com/uk/tv/pointless/42886/pointless-how-are-the-100-people-polled-other-questions),
  VERIFIED). I found nothing public on how its writers define category boundaries.
  - The same article quotes Mastermind on subject scope: it must be "Goldilocks", neither too broad nor too narrow
    (VERIFIED).
- **FunTrivia** [quiz creation guidelines](https://www.funtrivia.com/quizzes/general/quiz_creation_guidelines.html)
  (via search): fill-in-the-blank questions "may have ONLY ONE correct answer"; British and American spelling are both
  fine "please just be consistent". This was UNVERIFIED beyond the search snippet.
- **Wordle** keeps two lists. There is a hand-picked answer list of 2,315 words, which Wardle chose to be well-known,
  and a much larger list of accepted guesses (12,972 in total in the Feb-2022 version)
  ([Rusin, UT Austin](https://web.ma.utexas.edu/users/rusin/wordle/wordlist.html), via search).
  - This is the same split nullion already has between the scored answer and the accepted answer. The lesson is that
    "accepted" can be much wider than "curated".
- **Semantle**: secret words come from a sample of the "most popular" 5,000 English words, with capitalised,
  hyphenated and stop words removed ([legacy.semantle.com](https://legacy.semantle.com), via search). Its scope is
  again set by a source list plus filters.

### 2b. Aliases, acronyms, ambiguity, fuzzy matching

- **krillion**: aliases include mined player misspellings, and autocorrect checks aliases too, so a near-miss can land
  on something unexpected ("sea monkey" → "sea donkey" → Threebanded Sheephead). The FAQ says they "try to catch and
  prevent these weird matches" (VERIFIED, [FAQ](https://krillion.io/faq)). The Mica problem is the same failure.
- **hanzpo/krillion-clone** (VERIFIED, `src/worker/ai.ts` via `gh api`):
  - **Build-time alias prompt:** "For each answer give aliases: other names, common abbreviations, alternate
    spellings, and the short form people would actually type (for "Procter & Gamble" include "P&G"). Do not include
    misspellings; fuzzy matching handles those."
  - **Play-time alias resolver `sameAsListed`** (Claude Haiku): "return the list entry the player's answer refers to:
    the same thing under another name, nickname, abbreviation, translation … A broader or narrower thing is not a
    match (e.g. 'eagle' is not 'Bald Eagle')."
  - That second rule is the "Azimuthal" rule: a family name is not an alias of one member.
  - **Validity judge `judgeAnswer`:** gets `exampleValidAnswers` as context and rejects "too vague".
- **Typo thresholds** (from krillion-internals §3, not re-checked): hanzpo uses Damerau distance with a budget of 1
  at ≥4 letters and 2 at ≥9; LuizFelipe uses Levenshtein. nullion's budget is the same shape.
  - **openkrillion** does "typo correction with confirmation", and krillion itself has a preview toggle that returns
    `correction` instead of accepting (VERIFIED, krillion-internals §1.4). Ask mode is industry standard, not an
    oddity.
- **Sporcle**: alternates are typed into the answer field as `answer/alt/alt`, and the quiz shows the first one
  ([Sporcle University group](https://groups.google.com/g/sporcle-university/c/KoFXGlWLM0I), via search). I found no
  official statement on typo tolerance (UNVERIFIED).
- **Family Feud**: a staff member merges survey answers "expressing similar ideas" before counting, so alias grouping
  sets the score directly ([Museum of Play](https://www.museumofplay.org/blog/family-feud/), via search). On air, an
  answer counts if it is "judged to be equivalent" ([Wikipedia, 1978 AU](https://en.wikipedia.org/wiki/Family_Feud_(1978_Australian_game_show))).
  - The research dataset [ProtoQA](https://huggingface.co/datasets/proto_qa) keeps these answer clusters with counts,
    a format for "one canonical answer, many phrasings, one count".

### 2c. Rarity sources

| Game | Source | Status |
|---|---|---|
| krillion | Linguabase familiarity, IMDb votes, Goodreads counts; "LLM assistance and a manual pass" for the rest; Krillion gem hand-picked "for fun factor" | VERIFIED (FAQ + bundle, krillion-internals §1.5) |
| Algillion | Wikidata sitelink count for `w` items | INFERRED, 18/18 samples (krillion-internals §2.4) |
| hanzpo clone | LLM rates each answer into a tier with the whole set as context, plus criteria text per tier | VERIFIED (`TIER_CRITERIA`) |
| dylanydai clone | LLM "niche" jury score with variance check | VERIFIED (krillion-internals §3) |
| Pointless, Family Feud | Share of a 100-person survey | VERIFIED |
| nullion | Corpus hit counts (dblp, arXiv, kernel docs), `judge` tier below 10 hits, pins hand-picked | repo (CLAUDE.md) |

No game I found uses Wikipedia pageviews. My own measurements are in §3.4.

### 2d. Missed-but-valid answers

- **krillion:** a `/api/suggest` endpoint and `/api/feedback` (krillion-internals §1.7). The FAQ says nothing about a
  review flow. The mined-typo aliases strongly suggest rejected guesses are logged and mined (INFERRED there).
- **Algillion:** an LLM judges unknown guesses at play time and caches its verdict. Accepted ones join the set, and
  the judge is inconsistent (it accepted slab and rejected CRDT).
- **hanzpo:** an LLM judges unlisted answers at play time, and accepted ones join the set as Deep Cuts.
- **nullion today:** misses are kept on the device, copied out, triaged by Haiku into the Inbox, and the Inbox waits
  for a person. The one gap §1 shows is the last step.

---

## 3. Free data sources, tested on nullion's categories

All queries used a generic User-Agent and no personal data. QIDs were found with `wbsearchentities`.

### 3.1 Wikidata class queries (VERIFIED, run 2026-11-27)

The query shape:

```sparql
SELECT ?i ?l (GROUP_CONCAT(DISTINCT ?a;separator="|") AS ?al) ?sl WHERE {
  ?i wdt:P31/wdt:P279* wd:Q131212 .                      # text editor
  ?i rdfs:label ?l FILTER(lang(?l)="en")
  OPTIONAL { ?i skos:altLabel ?a FILTER(lang(?a)="en") }
  ?i wikibase:sitelinks ?sl } GROUP BY ?i ?l ?sl
```

**Pick the class by its label, not from memory.** I first used Q522972, which turned out to be "source code editor"
(285 items), and Q131149, which is Henry David Thoreau. A plan's class QIDs need the same check as its Wikipedia
categories.

| Class | Items | ≥1 sitelink | Spot checks |
|---|---|---|---|
| text editor Q131212 | 668 | 447 | **ex ✓** (17), ed ✓ (24, alias `UNIX ed`), Vim ✓ (aliases `Vi IMproved`, `GVim`), nano ✓ (`TIP Isn't Pico`), acme ✓ (13), sam ✓, TECO ✓, JOE ✓, Helix ✓ (`hx`), Kakoune ✓ (`kak`), Edlin ✓, QED ✓, XEDIT ✓, Neovim ✓ (`nvim`); **vi ✗, Notepad++ ✗, TextEdit ✗** (typed as word processor), WordStar ✗ (word processor) |
| database management system Q176165 | 267 (253 labelled) | 199 | ScyllaDB ✓ (label "Scylla", alias `ScyllaDB`), LMDB ✓ (alias `LMDB`), etcd ✓, Riak ✓ (`Basho Riak`), RethinkDB ✓, ArangoDB ✓, LevelDB ✓, VoltDB ✓, IBM Informix ✓, Ingres ✓ (`INGRES`), IMS ✓ (`IMS`), dBase ✓, FoxPro ✓, Cassandra ✓, DuckDB ✓, RocksDB ✓; **SQLite ✗** (typed as "serverless RDBMS", Q35687379, which isn't linked into the tree), **Memcached ✗** (typed only as "free software") |
| cipher Q4681865 | 196 | n/a | n/a |
| classical cipher Q10855346 | **1** (Columnar Transposition) | n/a | Useless for `historical-cipher`. |
| operating system Q9135 | 2,249 | n/a | No Linux distro named "Mica" found (searched labels and aliases "Mica" / "MICA"). |
| not in Wikidata at all | | | kswapd, talloc, patristocrat (`wbsearchentities` returned nothing relevant) |

Text editors compared with the bank (VERIFIED, normalised names):
- 59 of the bank's 76 tiered entries are in the Wikidata subtree.
- Bank-only entries include vi, Notepad++, TextEdit, Geany, Lapce, CudaText and SciTECO. Wikidata does not replace
  the mined sources.
- 145 Wikidata items with ≥5 sitelinks are not in the bank's tiers:
  - real misses: ex (17), acme (13), UltraEdit (11), KWrite (23), PSPad (19), XEmacs (14);
  - plenty of noise: IDEs (Visual Studio, NetBeans, Xcode), word processors (WordPerfect), Evernote, phpMyAdmin.
- So a class query is a **candidate source that must go through the existing filter**. It is not an answer list.

Why the class misses happen:
- Wikidata's typing is uneven. SQLite, Memcached (`P31 free software`), DTrace (`P31 free and open-source software`)
  and Excel (`P31 spreadsheet`) all fall outside the class you'd expect.
- The fix is a union of a few classes plus the existing Wikipedia-category reference, not a single P279* walk.
  Algillion's 266-entry set also reaches outside its class (krillion-internals §2.4, the DAG note).

### 3.2 Aliases: Wikidata `skos:altLabel` vs Wikipedia redirects (VERIFIED)

| Entry | Wikidata aliases | enwiki redirects (namespace unfiltered) |
|---|---|---|
| Jump point search | `JPS` | none |
| ex | none | `Ex (Unix)`, `Ex (editor)`, `Ex text editor`, `Ex mode` |
| LMDB | `LMDB` | `LMDB`, plus junk: `User:…/Lightning Memory-Mapped Database`, `Wikipedia talk:Articles for creation/…` |
| Ingres | `INGRES`, `Interactive graphics and retrieval system` | (not queried) |
| VS Code | `VSC`, `VS Code`, `vscode`, `VSCode` | (not queried) |

Takeaways:
- **The two sources give different aliases.** Wikidata has curated acronyms; redirects have phrasing variants.
- Redirect queries need `rdnamespace=0`, or user and draft pages leak in.
- Redirect titles carry Wikipedia's disambiguators ("(editor)"). Strip them the way `recall.py` already strips
  "(qualifier)".
- DBpedia's `dbo:wikiPageRedirects` gives the same list (VERIFIED for LMDB), but it is a stale copy of Wikipedia, so
  query Wikipedia directly.
- The Wikipedia Action API rate-limited me (HTTP 429) after a handful of unauthenticated calls. A batch job should use
  `titles=` with up to 50 titles per request and back off.
- **Alias quality risk:** Wikidata aliases include things that are not alternate names of the item: `etcd` has
  aliases `etcdctl` and `etcdutl` (its CLI tools), and `ed` has `GNU ed` on a separate item. Treat them as candidates
  for the Haiku alias check, not as direct imports.

### 3.3 Sitelinks as a rarity prior (VERIFIED for one category)

Median Wikidata sitelinks per tier in `bank/languages-tools/text-editor.md`, for entries found in Wikidata:

| Tier | n (in Wikidata / total) | median sitelinks | top examples |
|---|---|---|---|
| Off-by-one | 6/8 | 47 | Vim 69, Emacs 53, Notepad 48, VS Code 46 |
| Works on my machine | 2/2 | 0.5 | Kakoune 1, Helix 0 (pinned, a cliché pick, so low by design) |
| Null pointer exception | 16/18 | 14.5 | gedit 42, Atom 33, Kate 31, nano 30, ed 24 |
| Memory leak | 12/13 | 10 | SciTE 23, jEdit 21, TECO 17, JOE 13 |
| Race condition | 12/16 | 3.5 | Gobby 8, vile 6, sam 4 |
| Heisenbug | 11/18 | 1 | Yudit 3, THE 3 |

- The medians fall in tier order, and the overlap between neighbouring tiers is wide: gedit at 42 is a Null pointer
  exception, while ex at 17 would be a Memory leak.
- Coverage also drops with depth (11/18 at Heisenbug), so a missing item is itself a weak "deep" signal.
- The right use is an **outlier flag** in `bank/reports/<id>.md` (tier differs from the sitelink band by more than
  one), like the existing corpus-score flag. It shouldn't decide tiers: Algillion does that and inherits Wikidata's
  biases (krillion-internals §5).

### 3.4 Pageviews (VERIFIED numbers, 2025-11 to 2026-10, enwiki, user agents)

| Title | Views |
|---|---|
| Enigma machine | 485,479 |
| Caesar cipher | 304,127 |
| Vigenère cipher | 225,964 |
| Vim (text editor) | 214,715 |
| Playfair cipher | 65,137 |
| LMDB | 37,190 |
| Ex (text editor) | 25,345 |
| GNU nano | 24,408 |
| Acme (text editor) | 22,428 |
| ScyllaDB | 19,748 |
| DTrace | 16,805 |
| Jump point search | 6,930 |
| Kakoune | 6,100 |
| Ed (software) | 3,751 |
| Talloc | 0 |
| Kswapd | no page |

Pitfalls:
- **Pageviews are counted per title, including redirect titles.** "Ed (software)" at 3,751 and "Talloc" at 0 are
  probably redirect pages (INFERRED, because the API was rate-limiting me when I tried to resolve them). Always resolve
  the canonical title first.
- **Pageviews measure what students look up, not what programmers can name.** The cipher numbers are inflated by
  school crypto units: Caesar is 300k, but every programmer knows it.
- LMDB (37k) beats nano (24k), which matches no intuition about familiarity. Sitelinks look more stable for nullion's
  "how many working programmers know this name" question than pageviews do (INFERRED from these 16 points).

---

## 4. Writing unambiguous prompts and scope specs

What the sources agree on:
- **State the boundary before the player answers** (Tenable's preamble, Algillion's `hint`).
- **Write down, per answer, what is accepted, what is "too broad, be more specific", and what is rejected**
  (quizbowl's `accept` / `prompt on` / `do not accept`).
- **Pick a Goldilocks scope** (Mastermind).
- **Have a single source of membership for property prompts** (krillion's "river over 50 miles" matches a length
  filter).

Applied to nullion, a prompt is ambiguous when any of these words is undefined:

| Vague word in prompt | Example | Decide explicitly |
|---|---|---|
| Era or fame qualifier ("historical", "famous", "classic") | historical cipher | Name the class experts use: Wikipedia's **"Category:Classical ciphers"** exists, while "historical" has no such category (INFERRED; verify). Or drop the qualifier. Fame belongs to tiers, never to the prompt. |
| Platform ("Linux", "Unix") | Linux tracing tool, Unix daemon | "Native to", "ships with", or "runs on"? Do Linux kernel threads count as daemons? Do BSD or macOS daemons count for "Unix"? |
| Kind vs implementation | memory allocator | Algorithms (buddy, slab), libraries (jemalloc, talloc), or both? "General-purpose" only? |
| Family vs member | map projection ("Azimuthal") | Is a family name an answer, a prompt-on, or rejected? |
| Shared name across senses | operating system ("Mica") | Which senses are in scope, and which entry does a bare name land on? |

A **per-category scope spec** for the LLM generator, filter, escalate and triage stages. This is an inference from
the above, not a standard:

```md
> Accepts: <one plain-English sentence, shown to players as the hint>
## Scope
- class: classical (pre-1950, hand or mechanical) ciphers and cipher machines
- includes: substitution, transposition, polyalphabetic, rotor machines, codes used as ciphers (Great Cipher)
- excludes: modern block/stream ciphers (→ block-cipher), codes that are not ciphers (Navajo code talkers?), hashes
- boundary rulings: ROT13 = alias of Caesar · Patristocrat = own entry (ACA puzzle type) · One-time pad = in
- prompt-on (too broad): "substitution", "transposition", "polyalphabetic"
- sources: Wikipedia Category:Classical ciphers; ACA cipher types list; pycipher
- anchors: off-by-one: Caesar, Enigma · race: Bifid · heisenbug: Nihilist
```

- `boundary rulings` is the key field. Every edge case the owner rules on becomes a line there, so the next harvest
  and every LLM pass see the same decision.
- Anchors per tier calibrate the LLM's rarity the way hanzpo's `TIER_CRITERIA` plus "the whole set as context" does.
- The block is a few lines per category, and the owner already writes Accepts lines. It replaces ad-hoc decisions
  rather than adding a new process.

---

## 5. Recommendations for nullion, ranked by impact over effort

Each recommendation names the owner's problems it addresses (P1 scope steers the generator, P2 aliases, P3 rarity)
and the misses from §1.

1. **Promote the Inbox for approved categories.** Impact high, effort minutes to an hour.
   - Problem: P1 (database).
   - There are 56 lines waiting; database alone has 17, including ScyllaDB, LMDB, etcd and IMS, all with suggested
     tiers.
   - Every one of the owner's database misses except Excel is fixed by this.
   - Then consider making a non-empty Inbox in an approved category a reported count in `bank:index`, so it isn't
     silent ("findings must reach me").
2. **Add a `## Scope` block with boundary rulings, and feed it to every LLM stage.** Impact high, effort low.
   - Problem: P1 (cipher, daemon, tracing, allocator).
   - Format as in §4; this extends the `> Accepts:` line rather than adding a new file.
   - The owner rules once on each open boundary: kernel threads in Unix daemon? DTrace on Linux (runs-on)? Talloc and
     library allocators? Family names?
   - The plan's sources then follow the scope, instead of the scope following the sources.
3. **Reword or split the vague prompts.** Impact high, effort low.
   - Problem: P1 and P3 (cipher balance).
   - "Name a historical cipher" → "Name a classical cipher". "Name a Linux tracing tool" → keep it and rule that
     "works on Linux" counts.
   - "Name a Unix daemon" stays, with kernel threads either ruled in or given their own category ("Name a Linux kernel
     thread": kswapd, kcompactd, ksoftirqd, khugepaged, kworker, all in kernel Documentation, which is already in the
     corpora).
   - A rule worth adopting: **a prompt names a class experts have a category for**, a Wikipedia category or a
     Wikidata class with members. That is also what `recall.py` needs as a reference.
   - Fame words belong to tiers. Also move Caesar's rarity into the discussion: it is Null pointer exception today,
     below the Off-by-one One-time pad, which reads backwards (INFERRED).
4. **Use Wikidata as a second harvest source and as an alias source.** Impact high, effort medium: one SPARQL per plan
   with the class QIDs verified by label, then the existing filter.
   - Problems: P1 (`ex`, acme, UltraEdit, and for databases the whole Inbox list) and P2 (JPS, LMDB, `kak`, `hx`,
     `nvim`, `INGRES`, `IMS`).
   - Union two or three classes per category (the typing gaps: SQLite, Memcached, DTrace). Store the QID on the entry
     so later alias refreshes are mechanical.
   - Wikidata is no help for concept-heavy categories (classical cipher has one item) or Linux internals (kswapd,
     talloc). Those stay on mined trees.
5. **Run an acronym and alias pass for every tiered entry.** Impact medium-high, effort low.
   - Problem: P2.
   - Haiku gets the entry, its Wikidata aliases and its enwiki redirects (`rdnamespace=0`, qualifiers stripped) and
     returns the names players would type, using hanzpo's wording ("other names, common abbreviations, alternate
     spellings, the short form people would actually type; no misspellings") plus its "broader or narrower is not a
     match" rule.
   - Keep the existing rule that aliases under 3 characters or common English words are left out. JPS is 3, so it
     passes.
   - `bank.test.ts`'s cross-answer collision check is the safety net.
6. **Make "prompt on" a first-class result.** Impact medium, effort medium. It needs an owner decision, since it
   changes play.
   - Problem: P2 (Azimuthal, Mica).
   - A bank line can list `prompt-on` names: family names and shared names. Typing one returns "Which one? Be more
     specific", costs nothing, and never auto-corrects to a single member.
   - That is quizbowl's convention and the opposite of krillion's "sea donkey" failure.
   - Today, ambiguity between two entries is rejected, but ambiguity with an out-of-bank sense (Mica the distro) is
     silently corrected. A short `prompt-on` list per category catches the second case. One option is to fill it
     from Wikidata items with the same label in the same class.
7. **Add sitelinks as a third tier-sanity signal in `bank/reports/<id>.md`.** Impact medium, effort low once item 4
   exists.
   - Problem: P3.
   - Flag entries whose tier disagrees with the sitelink band by more than one tier (bands from §3.3: roughly ≥40,
     15–40, 8–15, 3–8, ≤2). This is report only. The owner keeps the call, and Works on my machine and Bit Flip are
     exempt by design.
   - Skip pageviews: they need redirect resolution and they are skewed by education topics (Caesar 304k).
8. **Mine aliases from misses before membership.** Impact medium, effort low.
   - Problem: P2.
   - In `scripts/bank/misses.py`, ask "is this another name for a listed entry?" (hanzpo's `sameAsListed`) before
     "is this a new valid answer?". A yes appends an alias instead of an Inbox line.
   - krillion's mined-typo aliases show the payoff (krillion-internals §1.4). nullion has fuzzy matching, so only
     true alternate names go in.
9. **Later, with a backend:** player answer counts are a reporting signal, not a tier setter. Both krillion and
   Algillion keep tiers fixed against player share (krillion-internals §1.5, §2.6). Use the counts to find Works on
   my machine candidates (an "obscure" pick that many people give) and to rank which Inbox items to review first.

### Not recommended
- **A play-time LLM judge.** Algillion's judge accepted slab and rejected CRDT (krillion-internals §2.5). It also
  needs a backend, which CLAUDE.md defers, and the "outside answers" Wikipedia probe already covers this offline.
- **Tiers from sitelinks or pageviews alone.** The text-editor table shows wide overlap between neighbouring tiers.

---

## Open items
- Whether Wikipedia's "Category:Classical ciphers" contains patristocrat (not checked; the API was rate-limiting me).
- Sitelink and tier agreement for categories other than text editors (one sample only).
- The ask-mode autocorrect report needs a repro (§1, last row).
- NAQT's Correctness Guidelines quotes come from search snippets; the page returned 403.
