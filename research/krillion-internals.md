# Krillion and spin-offs: how they work internally

Researched 2026-11-26 from primary sources: live sites, their JS bundles, live API requests and responses, and public GitHub repos. Raw downloads are in `/private/tmp/claude-501/-Users-axvon-nullion/e72ad254-9e91-44c8-abed-a35b3312e4d8/scratchpad/dl-*/`. That is the session scratchpad, so it may get cleared.

Labels used below:
- **VERIFIED** means I saw it in a primary source, and the source is cited.
- **INFERRED** means I reasoned it from evidence. The reasoning is given.
- **UNKNOWN** means I could not determine it.

---

## TL;DR

| | krillion.io | Algillion (electicode.tj) |
|---|---|---|
| Loop | 7 prompts/day, 3 s preview + 25 s answer, unlimited retries inside the timer, first accepted answer locks the round | 7 prompts/day, 30 s each, unlimited retries, Pass button, first accepted answer locks |
| Validation | **Server-side** (`POST /api/submit`) against a **fixed per-day answer set** (canonical + aliases + mined typos) plus server fuzzy match. No LLM at guess time (no latency evidence of one). | **Server-side** (`POST /api/algillion`) against three key spaces: hand-curated list (`a<N>`), **Wikidata items** (`w<QID>`), and **LLM-judged at guess time** (`ai:<slug>`, cached) |
| Rarity | **Precomputed tier per answer**, fixed for the day. It does not track player %: "Chad" gets 117k picks and is still `rare`. Bundle names **Linguabase familiarity**, IMDb votes and Goodreads ratings as rarity metrics. | **Precomputed tier per answer.** Wikidata items' tiers match **sitelink count** monotonically (INFERRED). Player % (`same`) is reported but does not set the tier. |
| Tiers | plankton 10, tooclever 15, schooler 30, rare 60, deepcut 85, krillion 100 (1 per prompt) | trivial 1, sneaky 2, neat 4, elegant 8, brilliant 12, algillion 15 zeros |
| Day rollover | Midnight **America/New_York** | Midnight **Asia/Dushanbe (UTC+5)** (computed from `msToNext`) |
| List size seen | 51 to 118,164 canonical answers per prompt (today) | "Name a data structure": `total: 266` |

---

## 1. krillion.io

### 1.1 Who and when
- VERIFIED: the maker is a solo developer who goes by the pseudonym "kp", "a 23-year-old American CS grad". The FAQ says "is krillion developed by a team? No, just me." ([krillion.io/faq](https://krillion.io/faq))
- VERIFIED: the first daily was **2026-07-16**. The bundle has `let n="America/New_York",o="2026-07-16"` (chunk `37812`, in the `_next/static/chunks/*.js` set). Today's `/api/today` returns `"date":"2026-11-26","dayNumber":134`, which matches that epoch.
- Stack, VERIFIED: Next.js (Turbopack chunks) on Vercel (`server: Vercel`, `x-nextjs-prerender`). It is closed source, and I found no official repo.
- Secondary write-ups attribute it to other people. The FAQ says explicitly that copycats are "claiming to be me", so ignore those attributions.

### 1.2 Game loop (VERIFIED, bundle constants)
- `ROUNDS_PER_DAY = 7`, `MAX_DAY_SCORE = 700` (chunk `14_ryj267zgto.js`, module 86062).
- `PREVIEW_MS = 3e3`, `ANSWER_MS = 25e3` (chunk `21ngqjsil_ru7.js`). The prompt is shown for 3 s, then you get 25 s to answer.
- `MAX_ANSWER_LENGTH = 256`.
- There are no lives in the daily mode. A wrong answer only shows ``"${t}": no echo. try again`` (or the server's `rejectionReason`) and you retry until the timer runs out. When time runs out the round scores 0. Source: submit handler in `422javqi48y07.js`.
- Puffer Party, the multiplayer mode, does have lives: `DEFAULT_SETTINGS {lives:2,maxLives:5,..., fuseMinMs:1e4 ...}`. The FAQ describes a random fuse of 10 to 30 s.

### 1.3 Tiers and score (VERIFIED, `14_ryj267zgto.js`)
```js
plankton  {name:"Plankton",          score:10,  blurb:"The answer everyone blurts out."}
tooclever {name:"Too Clever",        score:15,  blurb:"A famously “obscure” pick. Everyone reaches for it."}
schooler  {name:"Schooler",          score:30,  blurb:"Solid — swims with the school."}
rare      {name:"Rare",              score:60,  blurb:"Genuinely uncommon. Nice pull."}
deepcut   {name:"Deep Cut",          score:85,  blurb:"True obscurity. Few go this deep."}
krillion  {name:"One in a Krillion", score:100, blurb:"The designated gem. Trench floor."}
```
- The day score is the sum of the 7 tier scores. The score bands are `0–150 Plankton`, `151–250 Schooler`, `251–350 Rare`, `351–449 Deep cut`, `450+ One in a krillion`.
- Order by depth: plankton < tooclever < schooler < rare < deepcut < krillion.

### 1.4 How answers are validated (VERIFIED)
- The client never holds the answer list during play. The JS bundles and HTML contain no answers: I grepped for "Eritrea" and "Hassayampa" with 0 hits. Each guess is `POST /api/submit {date, promptId, answer, previewCorrection, playerId, runId}`.
- `GET /api/today` returns **prompts only**, as `{date, dayNumber, resetsAt:"2026-11-27T05:00:00.000Z", prompts:[{id:"p1",text:"Name a magazine"}, ...]}`.
- Response shapes I observed live (prompt p4, "Name a country where elephants live in the wild"):
  ```
  "eritrea"              -> {"accepted":true,"answer":"Eritrea","tier":"krillion","score":100,"quip":"...","receipt":"eyJ2IjoyLCJzY29wZSI6ImRhaWx5Ii..."}
  "Eritria"  (preview on) -> {"accepted":false,"correction":"Eritrea"}
  "the state of eritrea" -> {"accepted":false,"correction":"Eritrea"}
  "Eritria"  (preview off)-> {"accepted":true,"answer":"Eritrea",...}
  "Erittreaa"(preview off)-> {"accepted":true,"answer":"Eritrea",...}   (not in alias list, so server-side fuzzy match)
  "France" / "Atlantis"  -> {"accepted":false,"receipt":"..."}
  ```
  The `receipt` is an HMAC-signed token whose payload is `{"v":2,"scope":"daily","game":134,"version":"2026-11-26","round":"r4","playerId":...,"runId":...,"score":100,"issuedAt":...}`. `/api/today/complete` collects the 7 receipts and returns `betterThan` and `dist`, so the score is server-authoritative.
- **The answer set is a fixed curated list per prompt, and today's list is publicly readable.** `GET /api/reveal?date=2026-11-26` returned HTTP 200 and **16.3 MB** of JSON: `{prompts:[{id,text,answers:[{answer, aliases[], tier, score, quip?}]}]}`. Past dates return 403 ("That answer sheet is not publicly available."). The client fetches this only on the results screen, but the server does not check whether you have played. Sizes for today:

  | prompt | canonical answers | aliases | plankton | schooler | rare | deepcut | krillion |
  |---|---|---|---|---|---|---|---|
  | Name a magazine | **118,164** | 162,399 | 8 | 53 | 1,573 | 116,529 | 1 |
  | One-word food/drink with a double letter | 6,485 | 2,658 | 13 | 75 | 1,063 | 5,333 | 1 |
  | Info on a sports scoreboard | 1,588 | 11,183 | 5 | 49 | 631 | 902 | 1 |
  | Country with wild elephants | 51 | 2,262 | 3 | 9 | 31 | 7 | 1 |
  | TV show with a spin-off | 3,883 | 19,897 | 3 | 69 | 1,483 | 2,327 | 1 |
  | River over 50 mi | 16,742 | 58,623 | 3 | 27 | 264 | 16,447 | 1 |
  | Device with a built-in mic | 427 | 15,031 | 6 | 18 | 124 | 278 | 1 |

  `tooclever` had 0 answers today. Only the krillion-tier answer carries a `quip`.
- Aliases include **mined player misspellings**. Eritrea's aliases include `'eratrai3'`, `'eritrea sharp'`, `'erytrwa b'` and about 150 more. These look like logged player inputs, not typos a curator would write by hand (INFERRED). The FAQ confirms that autocorrect also checks aliases, which is why "sea monkey" can land on "Threebanded Sheephead" via its alias "sea donkey".
- **Unknown answers are rejected outright.** I found no evidence of a live lookup. Submit latency was flat at about 0.19 to 0.32 s for valid, unknown, and nonsense guesses ("Kenya" 0.29 s, "Atlantis" 0.31 s, "qzxv blorf" 0.32 s, "Narnia" 0.19 s). INFERRED: no LLM or web call at guess time.

### 1.5 How rarity is computed
This checks the user's hypothesis.

**(a) "Rarity is NOT % of players": VERIFIED as true for the tier.**
- Tiers are fixed fields in the reveal JSON, and they disagree with live player counts from `GET /api/answer-popularity?date=2026-11-26`. That endpoint returns `{asOf, prompts:{p1:{"<answer>":count,...}}}`, which is server-side counting of what players chose.
  - Elephants: `Chad` has 117,814 picks but stays `rare`. `China` has 101,871 picks and is `rare`.
  - Devices: `Game controller` has 173,571 picks and is `rare`, while `Phone` has 172,282 and is `plankton`.
  - Magazines: `The Sun` has 35,863 and is `rare`. `Lego Magazine` has 25,170 and is `rare`.
- So player frequency does not set tiers, at least within a day. The counts feed a "Most chosen / Least chosen" sort on the reveal screen. That popularity UI is gated to dates ≥ `C="2026-10-01"` in the bundle.

**(a) continued, "word frequency + web-search hit counts": half verified.**
- VERIFIED: the reveal UI in `2aysgah32oe75.js` has sort options keyed on per-answer metadata fields: `"Linguabase familiarity · high to low"` (field `familiarity`, with `rank` and `status`), `"IMDb votes · high to low"` (field `imdb` with `votes`, `rank`, `status: matched|reviewed|ambiguous|format review|no rating data`, `asOf`), `"Goodreads ratings · high to low"` (field `goodreads.count`), and `octoberPlayers.count` ("N players · <book>", labelled "verified October count").
- This matches the FAQ: "Some prompts can be scored entirely mechanically against a familiarity database of how often a word or name actually turns up in what people read and write. Others … get a combination of LLM assistance and a manual pass." **Linguabase** is that familiarity database.
- None of these metadata fields appeared in today's reveal. The only fields present were `answer, aliases, tier, score, quip`. So I could not see raw numbers for today's prompts.
- **I found no evidence of web-search hit counts** anywhere in the bundle, API, or FAQ. UNKNOWN, so treat that part of the hypothesis as unsupported.

**(b) "Upper tiers hand-curated; deep cut is a huge bulk catch-all": consistent with the data, mechanism partly INFERRED.**
- VERIFIED: deep cut dominates the big prompts (116,529 of 118,164 magazines and 16,447 of 16,742 rivers), while plankton and schooler are tiny (3 to 13 and 9 to 75 answers).
- VERIFIED from the FAQ: answer sets come from "aggregating datasets (dictionaries, wiki pages, encyclopedias…), then merging and cleaning". The krillion gem "isn't chosen on rarity alone … also picked for fun factor". In other words, it is hand-picked, and there is exactly one per prompt.
- INFERRED: the bulk magazine and river sets look like they come from Wikidata or Wikipedia. The entries are multilingual (`Pajęczyna`, `KirchenZeitung Diözese Linz`, `Chōjin Locke Special Zōkan`). Romanised Japanese appears as an alias (`Popyuraerekutoronikusu`). About 5% of entries carry Wikipedia-style disambiguators (`Surgeon (Japan)`, `Tosho (Iwanami)`). Rivers are cut at 80 km, which looks like a length-property filter. I could not confirm the source list. Whether `rare` (1,573 magazines) is hand-curated or a metric threshold is UNKNOWN. At that size a metric cutoff with a manual pass, per the FAQ, is more plausible than hand curation.

### 1.6 Daily rollover (VERIFIED)
- The day is midnight US Eastern: `America/New_York` in the bundle, and `resetsAt: "2026-11-27T05:00:00.000Z"` (EST).

### 1.7 Endpoints seen in the bundle (VERIFIED, grep)
`/api/today`, `/api/submit`, `/api/today/complete`, `/api/reveal?date=`, `/api/answer-popularity?date=`, `/api/unlimited`, `/api/packs/{geography,lexicon,movies,sports}`, `/api/packs/:id/unlock`, `/api/suggest` (players suggest questions), `/api/feedback`, `/api/party/*` (SSE stream), `/api/account/*`, `/api/restore`, `/api/announcements/*`, `/api/calibration`.

---

## 2. Algillion (https://electicode.tj/en/algillion)

### 2.1 What it is (VERIFIED, page HTML)
- It runs on electicode.tj, an education site with tg/ru/uz/en locales (hreflang links), and is built on Next.js behind Cloudflare and AWS ALB. Who built it beyond "Electicode" is UNKNOWN; I found no creator post.
- Rules string: `"7 prompts · 30 seconds each · rarer answers add more zeros"`. How-to text: "Wrong guesses cost nothing but time", "Numbers can be typed as 1729, 3.5, 7/2, 2^10, 5!, √2 or π", "A near-perfect flight passes a googol."
- The SSR props say `"today":10`. Today is daily #10, so day 1 was 2026-11-17 (INFERRED).
- Themes are `all`, `numbers`, `algo`, `shapes`, `people`, and `world` appears on prompts. There are modes `daily` and `free` (unlimited), with an optional "No clock".

### 2.2 Tiers and score (VERIFIED)
- `tierNames`: `trivial` "everyone thinks of this", `sneaky` "technically correct", `neat` "not the first thought", `elegant` "a mathematician's answer", `brilliant` "rare air down here", `algillion` "almost nobody says this".
- Zeros per tier, observed in API responses: trivial 1, sneaky 2, neat 4, elegant 8, brilliant 12, algillion 15.
- Your number is 10^(sum of zeros). The maximum is 7×15 = 105 zeros, so a near-perfect run passes a googol.

### 2.3 API (VERIFIED, `app/[locale]/algillion/page-f9880970c265fbaa.js`)
Everything goes through a single `POST /api/algillion` endpoint, which takes an `action` parameter:
```
{action:"start", mode:"daily"|"free", day, theme, relaxed}  -> {"token":"<uuid>","day":10,"count":7}
{action:"prompt", token, i, lang}  -> {"i":1,"text":"Name a data structure","hint":"A way to organise data in a program.","numeric":false,"theme":"algo","seconds":30}
{action:"guess",  token, i, text, lang} -> see below
{action:"pass",   token, i, lang}
{action:"finish", token, lang}     -> {zeros, tiers, ...}
```
No answer list ships to the client.

Today's daily (#10) prompts: geometry term, **data structure**, famous equation, probability distribution, famous puzzle, unit of measurement, famous computer.

### 2.4 Validation: three key namespaces (VERIFIED)
I ran 97 guesses against "Name a data structure" in `free` mode games. Raw results are in `dl-algillion/ds_probe.jsonl`. Accepted responses look like:
```json
{"ok":true,"label":"Bloom filter","tier":"brilliant","zeros":12,"note":"Says 'definitely not' or 'probably yes' using a few bits.","same":0.0088,"pid":"b:data-structure","key":"a39","total":266}
```
The `key` prefix says where the answer came from:

1. **`a<N>`: a hand-curated list, ordered by tier.** These entries carry a hand-written `note`. Examples:
   - a0 Array … a7 Hash table (trivial)
   - a9 BST … a21 Struct (neat)
   - a22 Trie … a33 Multiset (elegant)
   - a34 Skip list … a46 Persistent segment tree (brilliant)
   - a48 Van Emde Boas … a58 R-tree (algillion)
   - a60 String (sneaky)

   So roughly 60+ curated entries. Aliases fold into them: "radix tree" and "patricia trie" map to Trie, "rbtree" to Red–black tree, "dictionary" and "hash map" to Hash table, "ring buffer" to Circular buffer, "b+ tree" to B-tree, "octree" to Quadtree, "cartesian tree" to Treap. Fuzzy matching works: "linked lsit" → Linked list, "bloom filtre" → Bloom filter.

2. **`w<N>`: Wikidata items, where N is the QID number.** VERIFIED by fetching the entities:
   - `w169233` = Q169233 "2–3–4 tree" (P31 Q175263 *data structure*)
   - `w6666764` = Q6666764 "log-structured merge-tree"
   - `w1195972` = Q1195972 "page table" (P279 Q175263)

   Labels come back in Wikidata's lowercase style ("sparse matrix", "free list", "gap buffer").

   **The tier tracks Wikidata sitelink count** (INFERRED, but it holds without exception across all 18 samples):

   | tier | sitelinks |
   |---|---|
   | neat | 15–30 (sparse matrix 30, 2–3 tree 18, page table 18, inverted index 17, 2–3–4 tree 15) |
   | elegant | 5–12 (XOR linked list 12, AA 11, scapegoat 11, cons 9, Judy 7, LSM 6, zipper 6, unrolled LL 6, gap buffer 5, free list 5) |
   | brilliant | 2–3 (piece table 3, Count-Min sketch 2, HAMT 2) |

   Sitelink counts are from my own SPARQL query on query.wikidata.org.

3. **`ai:<slug>`: judged by an LLM at guess time, then cached.**
   - First-time guesses that went to the LLM came back slowly with `same:0`: hlist 1.13 s, intrusive list 1.05 s, linked hash map 1.34 s, "slab" → "Slab allocator" 1.23 s.
   - Guesses someone had already made came back fast with `same>0`: HyperLogLog 0.29 s, Dancing Links 0.29 s. That points to a shared server-side cache.
   - Normal list hits take about 0.2 to 0.3 s.
   - The bundle shows `"Not on our list yet — checking it…"` whenever a guess takes more than 700 ms (`setTimeout(()=>X(!0),700)`). That is the UI for this slow path.
   - LLM-accepted entries get a generated `note` ("A probabilistic data structure for estimating the number of distinct items.") and seem to default to `brilliant`.
   - The judge is lenient and inconsistent. It accepted "slab" (an allocator, not a data structure) and rejected CRDT.

**`total: 266`** appears in every response for this prompt, and the UI shows it as "`{n} of {t} found`" in the logbook. So the known set for "Name a data structure" has 266 entries. That is curated plus Wikidata entries, possibly plus accumulated `ai:` entries; the split is UNKNOWN. The Wikidata subset is filtered: the full transitive `P31/P279* Q175263` set has 1,926 labelled items (912 with ≥1 sitelink), far more than 266.

### 2.5 The user's report: "xarray" and "maple tree" are rejected (VERIFIED)
```
xarray     => {"ok":false,"why":"Not on our list — try another."}
maple tree => {"ok":false,"why":"Not on our list — try another."}
XArray     => same; idr => same (1.86 s on first try, so the LLM path ran and said no)
crdt       => rejected, although Wikidata Q20031945 (data structure subclass) has the alias "CRDT"
```
- Why: neither XArray nor maple tree is in Wikidata's data-structure subtree. My SPARQL dump of 1,926 items has no label or alias matching "xarray" or "maple tree", and the curated list doesn't include them. The LLM judge then rejected them; later repeats came back fast, at 0.21 to 0.31 s, which suggests a cached "no".
- The LLM accepting "hlist" but rejecting "xarray" shows the guess-time judge isn't a reliable backstop for Linux-kernel-level answers. This is the gap nullion would fill.
- I can't capture the full 266-entry list because it never reaches the client. I could only probe it entry by entry.

### 2.6 Rarity vs player frequency (VERIFIED)
- `same` is the fraction of players who gave that answer, counted on the server ("{p} of players said this too", "Fewer than 1% of players said this", "Nobody else has said this yet").
- It does not set the tier. Fenwick tree is at 3.09% and `elegant`, Stack at 2.23% and `trivial`, Treap at 2.51% and `brilliant`, Wavelet tree at 2.63% and `algillion`.

### 2.7 Rollover (VERIFIED arithmetic)
- The SSR prop was `msToNext: 7255639` in a response dated 16:59:04 UTC. That puts the next day at 19:00 UTC, which is **midnight Asia/Dushanbe (UTC+5)**.

---

## 3. Clones and spin-offs (GitHub, via `gh search repos krillion`)

There are dozens of repos, nearly all created between Sep and Nov 2026. The notable ones:

| Repo | Open source? | Stack | Validation | Rarity | Rollover |
|---|---|---|---|---|---|
| [VulcanEon/openkrillion.com-service](https://github.com/VulcanEon/openkrillion.com-service) (openkrillion.com, 23★) | MIT | Cloudflare Worker + D1 + R2, vanilla JS | Server-side matching with "typo correction with confirmation". README says production "can synchronize the current reference day's publicly exposed prompts and prepared answer tiers", so it **mirrors krillion's public reveal**. A small sample bank ships for local runs. | Copied from krillion | Crons `5 4 * * *` and `5 5 * * *` to cover New York midnight in both DST seasons |
| [hanzpo/krillion-clone](https://github.com/hanzpo/krillion-clone) (krillion.hanzpo.com) | No license | React + Vite, Cloudflare Worker (Hono), D1 | Fixed list built by Claude (`listAnswers`, "aiming for 300 to 600"), with aliases, plus `match.ts`: Damerau edit distance with a budget of 1 for length ≥4 and 2 for ≥9, plural variants, whole-word containment, space-insensitive compare. **Unlisted answers are judged by an LLM (Jev via typesafe.ai) at play time; accepted ones join the set as Deep Cuts.** | LLM classifies each answer into a tier with the whole set as context | `America/New_York` (`time.ts`), cron at 03:15 UTC builds today and tomorrow |
| [dylanydai/krillion-clone](https://github.com/dylanydai/krillion-clone) | No license | Next.js on Vercel, Upstash Redis | **No fixed list.** Every answer goes through `checkRelevance` (LLM), then `scoreJury` (LLM "niche" score, distribution-checked, variance > 2.25 counts as uncertain). Scores are cached per normalized answer. | LLM familiarity score for an audience of "English-speaking friends interested in programming and quantitative finance" | Multiplayer rooms, no daily |
| [LuizFelipeBarbosa/krillion-clone](https://github.com/LuizFelipeBarbosa/krillion-clone) | No license | Next.js | Static `questions.json`; `answer.ts` does NFKD normalize, `&`→and, Levenshtein typo budget | Hand-assigned tier lists | `America/New_York`, `nextResetISO` probes 04:00 and 05:00 UTC |
| [kyrg4z/krillion-clone](https://github.com/kyrg4z/krillion-clone) | No license | React + Vite, client-only | Tier lists ship in the client bundle (`src/data/*.ts`, `"name\|alias"` strings) | Hand-assigned | **Local midnight** (`localDayKey` uses `getFullYear/getDate`), mulberry32 seeded prompt shuffle |
| [quxlzx/krillion-llm](https://github.com/quxlzx/krillion-llm) | MIT | (not inspected) | "Blind Krillion daily-dive engine for LLM agents — server-signed scores, answer-key locks" | — | — |

Others are mostly solvers, bots, or themed reskins: owenHochwald/krillion-solver, DannyYPan/KrillionSolver, p0rt1k/krillion-answer-helper, saiharshilk/deep-ball (tennis), julianlaxamana/bruillion (UCLA), rahildshah1/APUSHKrillion. I did not inspect them.

dylanydai's repo also has `cs-categories-draft.txt`, a list of CS prompt ideas such as "Compiler optimizations", "Git commands" and "Command-line shells". It may be useful as nullion prompt inspiration.

---

## 4. Validation against Wikidata/Wikipedia or an LLM at answer time

- **Algillion does both** (VERIFIED, section 2.4). It answers from Wikidata QIDs (`w<QID>`) with the tier apparently derived from sitelinks, and it runs a cached LLM judge (`ai:` keys) for unknown guesses.
- **An LLM at answer time:** hanzpo/krillion-clone (unlisted answers only) and dylanydai/krillion-clone (every answer), both VERIFIED from source.
- **Live Wikidata lookup at answer time:** I found none. Algillion's Wikidata entries look pre-ingested rather than fetched live, because `w` hits respond in about 0.2 s (INFERRED). GitHub code search for krillion plus wikidata or sparql returned nothing.
- **krillion.io:** no LLM at answer time (INFERRED from flat latency). The FAQ says LLMs help offline with tiering only.

---

## 5. Implications for nullion

These are my opinions, not findings.
- The krillion model has a fixed list per prompt with a precomputed tier per answer, so the rarity metric is decoupled from players. It is cheap, deterministic, and fast. Its weakness is coverage ("why was my answer not listed? Because I didn't find it").
- Algillion's hybrid of curated core, Wikidata bulk, and a cached LLM fallback gets coverage but inherits Wikidata's gaps (XArray and maple tree are missing) and the LLM's inconsistency (slab accepted, CRDT rejected). Its sitelink-based tiering is crude for niche systems topics, where sitelinks are low for everything.
- For CS and systems trivia, a curated list will need sources beyond Wikidata (kernel docs, man pages, language standards) to beat Algillion on exactly the answers this audience likes to give.
- Mining rejected guesses into aliases or a review queue, as krillion's typo-laden aliases suggest it does, is a cheap way to close gaps.

## 6. Open items (UNKNOWN)
- krillion's exact deep-cut source datasets, and whether `rare` is metric-cut or hand-picked.
- Algillion's tier rule for `ai:` entries, which LLM it uses, and the exact Wikidata query and filter behind its 266-entry set. "directed acyclic graph" was a `w` hit but is not in the data-structure subtree, so the selection reaches outside Q175263.
- Who built Algillion.

---

## 7. The "Too Clever" tier

I added this section after a follow-up question. It uses the same labels (VERIFIED, INFERRED, UNKNOWN). I sent no further guesses or submissions to either site.

### 7.1 What krillion itself says (VERIFIED)
- **The FAQ** ([krillion.io/faq](https://krillion.io/faq)) says: *"what is “too clever”? The go-to “obscure” pick that isn't actually that obscure."*
- **The tier definition** is in bundle `14_ryj267zgto.js`, module 86062:
  `tooclever:{id:"tooclever",name:"Too Clever",score:15,emoji:"🤡",blurb:"A famously “obscure” pick. Everyone reaches for it.",depth:.18,color:"var(--tier-tooclever)"}`
- Taken together, it is **the answer people give when they are trying to be obscure, which so many people give that it no longer is.** It is a "trying-to-be-clever cliché", and it is penalised for that.
  - It is not a pedantic answer.
  - It is not a technically-correct joke answer. The "sneaky / technically correct" idea is Algillion's tier, not krillion's.
  - It is not the plain obvious answer. That is Plankton: "The answer everyone blurts out."

### 7.2 How the UI presents it (VERIFIED)
- **Label and blurb:** "Too Clever" and "A famously “obscure” pick. Everyone reaches for it." The result card shows the blurb unless the answer has its own `quip`: `function M(e,t){return e.quip??(…t?.blurbs?.[e.tier]??a.TIERS[e.tier].blurb…)}`. Themed packs override the blurbs only for `schooler` and `krillion`, never for `tooclever`.
- **Emoji:** 🤡 in the share grid (`buildShareText` maps each tier to `TIERS[e].emoji`).
- **Colour:** orange. CSS `--tier-tooclever:#ff9f43`, with `#ffb35c` as the second (light/dark) variant. The canvas palette is `k={plankton:"#8fa3c4",tooclever:"#ff9f43",…}`.
- **Animation and sound:** on landing the mascot plays `"faint"`, where Plankton plays `"sad"`.
  - There is an orange flash `rgba(255,159,67,.7)` and a jittery wobble: `eC=7*Math.sin(42*t)+q(-2,2)`.
  - The landing sound is `"land_small"`, the same one Plankton uses: `"plankton"===l||"tooclever"===l?"land_small":"land_big"`.
  - So the UI groups it with Plankton as a "shallow" result and gives it a comic, clown-themed flourish.

### 7.3 Is it in the rarity order or a side category? (VERIFIED, with one nuance)
- **It is in the order.** `depth:.18` puts it between Plankton (.08) and Schooler (.36). `TIERS_BY_DEPTH` sorts all six tiers by score: plankton 10 < tooclever 15 < schooler 30 < rare 60 < deepcut 85 < krillion 100. The descent animation sinks it only slightly deeper than Plankton.
- **Nuance:** it has no day-score band. `SCORE_BANDS` are plankton, schooler, rare, deepcut and krillion only. It is a per-answer verdict, not a level for the whole day.
- **INFERRED:** in meaning it is a side category ("you tried to be obscure and failed"), placed in the order with a score just above Plankton. The 5-point gap above Plankton reads as a consolation, not a rarity measurement.

### 7.4 Which answers get it, and how many per prompt
- **VERIFIED:** today's sheet (`/api/reveal?date=2026-11-26`, 7 prompts) has **0 Too Clever answers on all 7 prompts**. Tier counts are in §1.4.
- **I have no real examples.** krillion serves only the current day's sheet; past dates return 403.
  - I tried to read past sheets from krillion's archive and unlimited reveal endpoints (`/api/archive/<n>/reveal`, `/api/unlimited/<n>/reveal`). Those modes are paid. Both requests were blocked by the session's permission classifier as unauthorized access.
  - I also tried the fan mirror krillionanswerkey.com, whose MIT-licensed fetch script ([fancydirty/krillion-answer-key `fetch.mjs`](https://github.com/fancydirty/krillion-answer-key)) saves the full `tooclever` list for every day. That fetch was blocked too.
  - I did not try to work around either block. If the user wants examples, they need to approve one of those sources, most simply the fan site's archive pages.
- **INFERRED from that third-party script:** the script stores Too Clever answers as `{answer, quip}`. That suggests Too Clever answers sometimes carry their own quip, as the Krillion gem does. This is weak evidence: it may just be defensive coding.

### 7.5 Hand-picked or rule-based?
- **No rule appears anywhere client-side** (VERIFIED): no threshold or formula for `tooclever` exists in the bundles. The tier arrives precomputed in `/api/reveal` and `/api/submit` responses.
- **INFERRED: hand-picked, or LLM-assisted with a manual pass**, not a metric threshold. Three reasons:
  1. A familiarity or frequency metric would rate a "go-to obscure pick" as fairly rare, because the word itself is uncommon. Spotting that it is a cliché needs judgement about what players reach for. The FAQ says prompts that "can't be reduced to a number" get "a combination of LLM assistance and a manual pass".
  2. A mechanical cutoff would normally put something in the tier on most prompts. Today it is empty on all seven.
  3. Tiers do not track live player counts (§1.5), so it is not "assigned after players over-picked it" either.
- **Whether player data from earlier days informs these picks is UNKNOWN.**

### 7.6 How a clone interprets it (not krillion; for contrast only)
- hanzpo/krillion-clone's LLM tier prompt (`src/worker/ai.ts`, `TIER_CRITERIA.tooclever`) says: *"The cliché 'obscure' pick: what people reach for when they try to be clever, so many players still type it."* This matches krillion's FAQ wording.

### 7.7 What this suggests for nullion (opinion)
- The CS version of the tier writes itself. Examples are Brainfuck for "name a programming language", the Y combinator for "name a lambda-calculus term", and Plan 9 for "name an operating system": answers people give to sound obscure that everyone gives.
- The tier must be hand-curated per prompt, and it is cheap to do so: one to five entries per prompt.
