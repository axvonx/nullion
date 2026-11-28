# nullion: answer sources, rarity signals, hosting

Researched 2026-11-26. I ran every count below myself (curl/SPARQL) on that date unless a row is marked INFERRED. Raw responses are in the session scratchpad and are not durable.

Labels:
- **VERIFIED**: I observed it directly in an API response or an official doc page, and the source is cited.
- **INFERRED**: my reasoning from verified facts, or general knowledge I did not check today.
- **UNKNOWN**: I could not determine it.

---

## TL;DR

1. **No single knowledge base covers the deep tier.**
   - Wikidata/Wikipedia cover the "common → fairly rare" band (mutex, spinlock, ticket lock, seqlock, RCU, red-black tree, skip list).
   - They **miss** maple tree, XArray, MCS lock, qspinlock, CNA lock and fissile lock as CS concepts.
   - Those deep terms do exist in **docs.kernel.org** (maple tree, XArray, MCS lock, qspinlock) and in **paper corpora** (OpenAlex, arXiv) for CNA lock and fissile locks.
   - A "no manual curation, accept deep answers" design therefore needs either an LLM judge or an offline LLM-built answer list grounded in several corpora. Knowledge-base lookup alone will reject the answers the creator cares most about.
2. **Rarity signals discriminate, but each one is noisy.**
   - Polysemy breaks raw counts: "maple tree" is mostly botany and "xarray" is mostly the Python library.
   - The most usable mix is OpenAlex full-text phrase counts filtered to the Computer Science field, combined with Wikipedia pageviews where an article exists.
3. **Hosting: GitHub Pages plus a nightly GitHub Action that precomputes answers is viable and needs no secrets in the browser.**
   - Live LLM validation needs a small proxy. A Cloudflare Worker (free: 100k requests/day, 10 ms CPU) works.
   - "% of players" counts need server state. Cloudflare D1 or a Durable Object is the cheapest fit. KV is a poor fit for counters (1 write/sec per key).

---

## 1. Answer-knowledge sources: coverage of deep systems terms

### Coverage table

Key: ✅ = present as the CS concept · ⚠️ = present only incidentally (a mention, a patent, or a homonym) · ❌ = absent

| Term | Wikidata item | Wikipedia (en) article | DBpedia | docs.kernel.org | NIST DADS | OpenAlex (CS field, phrase) | arXiv (phrase) |
|---|---|---|---|---|---|---|---|
| mutex | ✅ Q11342745 | ✅ (redirect → Lock (computer science)) | ✅ | ✅ (mutex-design page) | ❌ | ✅ 8,024 | n/a |
| spinlock | ✅ Q570276 | ✅ | ✅ | ✅ | ❌ | ✅ 1,685 | n/a |
| ticket lock | ✅ Q7800657 | ✅ | ⚠️ (resource returns empty body) | ⚠️ ("ticket" only in unrelated docs) | ❌ | ✅ 193 | ✅ 4 |
| seqlock | ✅ Q7452423 | ✅ | ✅ | ✅ (locking/seqlock.html) | ❌ | ✅ 95 | ⚠️ 1 |
| RCU | ✅ Q7300340 | ✅ | ✅ | ✅ (RCU/ section) | ❌ | ✅ 583 (all fields) | n/a |
| MCS lock | ❌ (no item) | ❌ (phrase "MCS lock": 0 hits) | ❌ (empty resource) | ✅ (mutex-design: "MCS lock (proposed by Mellor-Crummey and Scott)") | ❌ | ✅ 216 | ✅ 9 |
| qspinlock | ❌ | ❌ (0 hits; "queued spinlock": 0) | n/a | ⚠️ (only in kernel-parameters) | ❌ | ✅ 43 | ✅ 2 |
| CNA lock | ⚠️ (only patent Q120964837 "Compact NUMA-aware locks") | ❌ | n/a | ❌ ("CNA" hits are about CVE Numbering Authority) | ❌ | ⚠️ 7 ("CNA lock") | ✅ 3 ("compact NUMA-aware") |
| fissile lock | ❌ | ❌ (0 hits) | n/a | ❌ | ❌ | ✅ 13 ("fissile locks"); title match "Fissile Locks" | ✅ 1 ("Fissile Locks") |
| maple tree (kernel) | ❌ (only botany items) | ⚠️ (mentioned in the B-tree article; no article of its own) | ⚠️ (Maple_tree = botany) | ✅ core-api/maple_tree.html | ❌ | ⚠️ 955 (polluted by botany) | ⚠️ (top hits are botany) |
| XArray (kernel) | ❌ (only Python lib Q107381003) | ❌ (hits are Dask/NetCDF) | ❌ | ✅ core-api/xarray.html | ❌ | ⚠️ 643 (mostly Python xarray) | ⚠️ (Python) |
| red-black tree | ✅ Q506496 | ✅ | ✅ | n/a | ✅ | ✅ 2,279 | n/a |
| skip list | ✅ Q2005893 | ✅ | n/a | n/a | ✅ | ✅ 1,424 | n/a |

Sources:
- Wikidata `wbsearchentities` (VERIFIED).
- Wikipedia: `list=search` with phrase queries, plus `prop=pageprops` (VERIFIED).
- DBpedia: `https://dbpedia.org/data/<Name>.json`. MCS_lock and Ticket_lock returned an empty or 4-byte body; Seqlock, RCU and Spinlock returned 4–17 KB (VERIFIED).
- docs.kernel.org:
  - `core-api/maple_tree.html`, `core-api/xarray.html`, `locking/seqlock.html`, `locking/mutex-design.html` and `RCU/index.html` all returned HTTP 200.
  - I also checked the Sphinx `searchindex.js` (20 MB) for stemmed terms. `qspinlock` → only `admin-guide/kernel-parameters`. `mcs` → no index term, but the mutex-design page text contains "MCS lock". `fissil` → miss (VERIFIED).
- NIST DADS index (`https://xlinux.nist.gov/dads/`): 1,123 distinct entry links, page "Updated Mon Aug 19 2024". It has red-black tree and skip list, and no lock entries or kernel structures (VERIFIED).
- OpenAlex: `/works?search="<phrase>"&filter=primary_topic.field.id:17` (VERIFIED). arXiv: `export.arxiv.org/api/query?search_query=all:"<phrase>"` (VERIFIED).

### Wikidata class sizes (systems)

All VERIFIED via query.wikidata.org.

- **data structure (Q175263)**:
  - `P31/P279*` instances: 1,336
  - `P279+` subclasses: 732
  - union: 2,031
  - members with an en.wikipedia article: 775
- **lock (Q1427251)**: union of instances and subclasses = **20**. Several of those are unlabeled items (Q140270559–66).
  - The 20 include spinlock, seqlock, readers–writer lock, giant lock, GIL, file locking, two-phase locking and record locking.
  - **ticket lock is not in the lock class.** It is typed `instance of: concurrency control algorithm`.
  - **mutex is not in the lock class.** It is `instance of: data type` and `subclass of: synchronization primitive`.
- **Taxonomy holes**: *trie* is not reachable from "data structure" (trie → search tree, which is not linked up). RCU is typed `algorithm`.
- **algorithm (Q8366)** `P31/P279*`: 2,683.

INFERRED: Wikidata's class graph is too inconsistent to give the answer set for a question like "Name a type of lock". You would get 20 items, would miss ticket lock and mutex, and would gain junk like "two-phase locking" and "file locking".

### Wikipedia categories

VERIFIED via `list=categorymembers`, recursing through subcategories.

| Root | depth 0 pages | depth 2 pages (subcats walked) |
|---|---|---|
| Category:Data structures | 22 | 483 (31) |
| Category:Concurrency control | 74 | 185 (4) |
| Category:Linux kernel | 47 | 625 (22) |

None of these walks contains maple tree, XArray, MCS lock or qspinlock. Ticket lock, Seqlock, Spinlock, RCU, red–black tree and skip list are present.

### Semantic Scholar

UNKNOWN. Every unauthenticated request returned HTTP 429. The product page says the unauthenticated pool is "1000 requests per second shared among all unauthenticated users… may also be further throttled", and that "the introductory rate limit for an API key is 1 RPS" (https://www.semanticscholar.org/product/api). A key is needed in practice.

### Can paper corpora supply research-only terms?

- **Partly. VERIFIED:**
  - "Fissile Locks" exists as an OpenAlex title (2 title matches) and in arXiv (1).
  - "Compact NUMA-aware Locks" is in arXiv (3) and OpenAlex (2 title matches; "Scalable Compact NUMA-aware Lock").
- **INFERRED limits:**
  - Paper corpora give you *titles*, not *term lists*. Turning "Fissile Locks" into an accepted answer "fissile lock" needs term extraction. An LLM is the practical tool for that.
  - The nicknames players actually type ("CNA lock", 7 OpenAlex hits) are much rarer than the formal names.

---

## 2. Rarity / obscurity signals (no player data)

All numbers VERIFIED on 2026-11-26.

| Term | enwiki pageviews, 12 mo (user agent, Nov 2025–Oct 2026) | enwiki langlinks (≈ sitelinks−1) | OpenAlex CS-field phrase count | Stack Overflow tag count | GitHub repo search `"term"` | Google Books Ngram (mean freq 2018–22) |
|---|---|---|---|---|---|---|
| mutex | 34,685 (Lock (CS)) | 18 | 8,024 | 4,818 (`mutex`) | 7,891 | 1.33e-7 |
| spinlock | 25,769 | 14 | 1,685 | 335 | 489 | 1.23e-8 |
| red-black tree | 252,427 | 35 | 2,279 | 595 | 5,887 | 1.05e-8 |
| skip list | 54,052 | 19 | 1,424 | 163 (`skip-lists`) | 1,950 | 6.38e-9 |
| RCU | 19,211 | 6 | 583 (all fields) | 56 (`rcu`) | — | — |
| seqlock | 8,608 | 0 | 95 | 13 | 76 | absent from response |
| ticket lock | 3,149 | 2 | 193 | none | — | 4.41e-10 |
| MCS lock | no article | — | 216 | none (`mcs-lock`) | 26 | 7.28e-10 |
| maple tree | no article | — | 955 (botany-polluted) | none (`maple-tree`) | 78 | 1.42e-7 (botany) |
| xarray | no article | — | 643 (Python-polluted) | `python-xarray` 2,447 (wrong sense) | 1,884 (Python) | 3.2e-9 (Python) |
| CNA lock | no article | — | 7 | none | 0 | — |
| fissile lock(s) | no article | — | 13 | none | 1 | — |
| qspinlock | no article | — | 43 | none | 5 | — |

Reference pageviews: hash table 153,876 · B-tree 148,285 · trie 138,035 · Fenwick tree 37,530 · rope 33,563 · treap 17,845 · van Emde Boas tree 15,232.

**Assessment (INFERRED from the table):**
- OpenAlex CS-field phrase counts give a monotone, sensible ordering: mutex ≫ red-black tree > spinlock > skip list > MCS ≈ ticket > seqlock > qspinlock > fissile > CNA. They also cover terms that have no Wikipedia article.
- Pageviews are fine for common terms, but "no article" is itself the strongest obscurity signal for the deep tier.
- Polysemy (maple tree, xarray) breaks every raw count. Counts must be computed for a disambiguated query, e.g. `"maple tree" AND (kernel OR "Linux")`, or come from an LLM-chosen canonical phrase. This needs care. I did not test disambiguated queries.
- SO tags, Ngram and GitHub only work for mainstream terms (most deep terms have no tag or are 0).

### API rate limits and CORS (browser-callable?)

| API | CORS (`Access-Control-Allow-Origin` on a request with `Origin:`) | Limits |
|---|---|---|
| Wikimedia pageviews (`wikimedia.org/api/rest_v1`) | `*` (VERIFIED) | No numeric limit on the AQS access-policy page. It defers to "Wikimedia APIs/Rate limits" and requires a User-Agent (https://doc.wikimedia.org/generated-data-platform/aqs/analytics-api/documentation/access-policy.html). In browsers, use the `Api-User-Agent` header (https://www.mediawiki.org/wiki/API:Etiquette). |
| MediaWiki action API | echoes origin with `origin=*` (VERIFIED) | I hit 429 repeatedly at ~1 req/s with a UA that had no contact info (VERIFIED). The UA policy requires contact info: "or you may be IP-blocked without notice" (https://foundation.wikimedia.org/wiki/Policy:Wikimedia_Foundation_User-Agent_Policy). |
| Wikidata Query Service | `*` (VERIFIED) | 60 s query timeout and 60 s of processing per 60 s per client, 429 + Retry-After (per the WDQS User Manual; from a summarised fetch, not re-verified line by line). The manual says v1 is available through June 2027, with degradation possible from February 2027. |
| OpenAlex | `*` (VERIFIED) | Response headers showed `x-ratelimit-limit-usd: 0.1`, `x-ratelimit-cost-usd: 0.001` per search (VERIFIED). The pricing page says "every account gets $1 a day free". No key is needed for basic queries; a free key gives 10× the budget; 10 req/s keyless (https://help.openalex.org/how-to-use-the-api/rate-limits-and-authentication, https://openalex.org/pricing). INFERRED: about 100 keyless searches/day/IP, so not usable per-player from a browser. |
| Semantic Scholar | `*` (VERIFIED) | Keyless shared pool returned 429 every time (VERIFIED); key = 1 RPS (product page). |
| Stack Exchange | `*` (VERIFIED) | The keyless response reported `quota_max: 300` per day (VERIFIED). |
| GitHub search | `*` (VERIFIED) | 10 req/min unauthenticated, 30/min authenticated. Code search requires auth (https://docs.github.com/en/rest/search/search#rate-limit). |
| Google Books Ngram JSON | **no ACAO header** (VERIFIED) | Undocumented endpoint. Not browser-callable. |
| arXiv API | **no ACAO header** (VERIFIED) | Not browser-callable. |

**INFERRED conclusion:** compute rarity **offline** (in a nightly Action) and ship it as JSON. Calling these from players' browsers would exhaust keyless quotas (OpenAlex ≈100 searches/day, SE 300/day, GitHub 10/min) and break Wikimedia UA etiquette.

---

## 3. Answer-time LLM validation vs offline precompute

**Facts (VERIFIED):**
- **Cloudflare Workers Free**:
  - 100,000 requests/day, resetting at 00:00 UTC; Error 1027 when exceeded.
  - 10 ms CPU per request. Waiting on `fetch()` does **not** count toward CPU time.
  - 50 subrequests per request; 5 cron triggers per account.
  - Workers Paid is $5/month minimum.
  - Sources: https://developers.cloudflare.com/workers/platform/limits/, https://developers.cloudflare.com/workers/platform/pricing/
- **Vercel Hobby (free)**:
  - 1,000,000 function invocations/month, 4 active-CPU-hours, 360 GB-hrs of provisioned memory.
  - 300 s maximum duration.
  - 100 GB Fast Data Transfer.
  - Source: https://vercel.com/docs/plans/hobby
  - Hobby's non-commercial-use restriction: INFERRED / not verified. I did not find it in the pages I fetched.

**Comparison (INFERRED):**

| | A. Live LLM judge via Worker proxy | B. Nightly precompute → static JSON |
|---|---|---|
| Accepts never-seen deep answers | Yes (the LLM judges any string) | Only what the generation step enumerated. Misses stay misses. |
| Cost / abuse | Per-guess LLM cost. The key lives in the Worker, but anyone can spam the endpoint. Needs per-IP rate limiting and caching of normalized answer → verdict. | One batch per day, fixed cost. |
| Consistency / fairness | Verdicts can vary across players unless cached. Cache the first verdict per normalized string. | Deterministic for everyone. |
| Rarity score | Must be computed live, or approximated by the LLM. | Precomputed from OpenAlex/pageviews offline. |
| Anti-cheat | Answers never shipped. | Answers shipped (hash them, see §4). |
| Failure mode | LLM or Worker outage = game broken. | Action failure = no new puzzle. Detect and fail loudly. |
| Fits free tier | Yes at hobby scale (100k req/day). The LLM API itself is not free. | Yes (Actions minutes are free for public repos; INFERRED, not checked today). |

**Recommended hybrid (INFERRED):**
1. Use B as the base: nightly, an LLM enumerates candidate answers grounded in docs.kernel.org, Wikidata and OpenAlex.
2. Score each candidate offline and ship hashed answers.
3. Add an optional A-path for misses only: send an unknown guess to a Worker, which asks the LLM, caches the verdict in D1, and feeds it into the next day's list.

The A-path is the only way to honour "accept answers we didn't think of" without manual curation.

---

## 4. GitHub Pages + scheduled publishing + daily rollover

**GitHub Pages limits (VERIFIED, https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits):**
- Published site ≤ 1 GB; source repo recommended ≤ 1 GB.
- **Soft** bandwidth limit of 100 GB/month.
- **Soft** limit of 10 builds/hour. "This limit does not apply if you build and publish your site with a custom GitHub Actions workflow."
- Deploys time out after 10 minutes; 429 rate limiting may apply.
- Not for commercial/SaaS use.

**Custom domains (VERIFIED):** apex, `www` and custom subdomains are supported (https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages).

**Scheduled Actions (VERIFIED, https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule):**
- "can be delayed during periods of high loads… High load times include the start of every hour. If the load is sufficiently high enough, some queued jobs may be dropped." Schedule off the hour.
- Runs only on the default branch. Minimum interval is 5 minutes.
- Runs in UTC by default; an IANA `timezone:` key is supported.
- "In a public repository, scheduled workflows are automatically disabled when no repository activity has occurred in 60 days." UNKNOWN: whether the bot's own daily commits count as "activity". Do not rely on it. Alert if the workflow is disabled.
- **Gotcha (VERIFIED):** "Commits pushed by a GitHub Actions workflow that uses the GITHUB_TOKEN do not trigger a GitHub Pages build", and GITHUB_TOKEN pushes trigger no new workflow runs (https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow). The nightly job must therefore deploy Pages itself (`actions/deploy-pages` in the same workflow), not rely on a push trigger.

**Rollover strategy (INFERRED):**
- **Pre-ship a buffer of N days and pick the puzzle from the client's local date** (Wordle-style).
  - Pros: no midnight cliff, and it is robust to a dropped or delayed cron (if the buffer ≥ 2 days, a missed run costs nothing).
  - Cons: everyone can read future puzzles.
- **UTC rollover**: one global puzzle ("today's %" stats are comparable). It needs the file for day D to be live before 00:00 UTC, so the cron has to run hours early because of the delay/drop note.
- Recommendation: generate D+2 or D+3 ahead in any case, so a dropped cron never causes an outage. Choose local-date vs UTC by whether global "% of players" stats matter. Global stats push toward UTC, or toward keying stats by puzzle id, not date.

**Anti-spoiler with static JSON (INFERRED):**
- Hashing answers (e.g. `SHA-256(salt_dayN ‖ normalize(answer))`) stops casual viewing of the answer list, but is **not** cheat-proof. The answer space for "name a lock" is small and guessable, so brute-forcing hashes is trivial for a motivated player.
- The rarity score per hash still has to ship, and that leaks "how many answers exist".
- Real secrecy needs a server check (the Worker). For a casual daily game, hashing plus not shipping future days' salts is a reasonable bar.

---

## 5. Percent-of-players rarity: cheapest server-side counting

VERIFIED from official pricing and limits pages, fetched 2026-11-26.

| Option | Free tier | Fit for "count guess X for puzzle D" |
|---|---|---|
| **Cloudflare Workers KV** | 100k reads/day, **1,000 writes/day**, 1 GB; "Writes to same key: 1 per second" (https://developers.cloudflare.com/kv/platform/pricing/, …/kv/platform/limits/) | Poor. 1k writes/day caps you at ~1k guesses/day. Eventually consistent, no atomic increment (INFERRED). |
| **Cloudflare D1** | 5M rows read/day, 100k rows written/day, 5 GB total, 500 MB per DB, 10 DBs (https://developers.cloudflare.com/d1/platform/pricing/, …/d1/platform/limits/) | Good. `INSERT … ON CONFLICT DO UPDATE SET n=n+1` (SQLite upsert; INFERRED). ~100k guesses/day free. |
| **Cloudflare Durable Objects (SQLite-backed)** | 100k requests/day, 13,000 GB-s/day, 5M rows read/day, 100k rows written/day, 5 GB; Free plan supports only SQLite-backed DOs (https://developers.cloudflare.com/durable-objects/platform/pricing/) | Good. One DO per puzzle gives strongly consistent counters (INFERRED). More code than D1. |
| **Supabase Free** | "Unlimited API requests", 500 MB DB, 5 GB egress, 2 active projects, "**paused after 1 week of inactivity**" (https://supabase.com/pricing) | OK, but the inactivity pause is a risk for a low-traffic hobby game. Callable straight from the browser with anon key + RLS (INFERRED). |

**Recommendation (INFERRED):** use one Cloudflare Worker that does both jobs: (a) the LLM fallback judge and (b) guess counting in D1. The Worker's 100k/day request cap, D1's 100k writes/day, and 1 write per guess all fit a hobby launch at $0. The site itself stays on GitHub Pages. Workers Paid ($5/month) removes the daily caps if the game grows.

---

## 6. Category-size check outside systems programming

This tests a rule of the form "a question is viable only if the term database has ≥ N entries for its category".

Method (VERIFIED, query.wikidata.org, 2026-11-26): count `{?x wdt:P31/wdt:P279* wd:Q} UNION {?x wdt:P279+ wd:Q}`, and the subset that has an en.wikipedia article. The "obscure hits" are the members with an enwiki article and the lowest sitelink counts.

| Category (class QID) | Total | With enwiki | Obscure hits | Notable misses / junk |
|---|---|---|---|---|
| rendering technique (Q119498937) | 20 | 19 | Gooch shading, screen-door transparency, Alpha to coverage, Clipmap, checkerboard rendering | Ray tracing is typed "global illumination"; Phong/Gouraud sit under "shading", not here. Junk: "3D ultrasound". |
| shading (Q1191981, the art concept) | 4 | 2 | Gouraud, Phong, flat shading | No CG-specific shading class. Q1191981 is "depicting depth through varying levels of darkness". |
| anti-aliasing (Q858325) / spatial AA (Q127386817) | 2 / 1 | 2 / 1 | MSAA (only member of spatial AA) | FXAA is typed "technology"; TAA is typed "article covering multiple topics". |
| database index (Q580427) | 27 | 13 | BANG file, Grid file, IVFFlat, DiskANN, HNSW, partial index | B-tree and B+ tree are not linked. Junk: "WMU Digital Collections", "Ryerson Index", "Index Translationum" (library indexes). |
| transaction isolation level | — | — | — | **No class exists.** Snapshot isolation (Q7547371) has no P31/P279. Serializability (Q137712) has 0 members. |
| join algorithm (Q1702519) | 0 | 0 | — | Hash join (Q4060691) has no P31/P279. Nested loop join is typed "naive algorithm". |
| complexity class (Q908207) | 116 | 93 | NP/poly, GapP, FIXP, HO, XP, DP, QP | Healthy. BQP and PPAD are present. |
| NP-complete (Q215206) | 4 | 1 | 3-SAT | **Problems aren't typed NP-complete.** Subset sum is typed "computational problem". Unusable. |
| sorting algorithm (Q181593) | 70 | 57 | Powersort, Kirkpatrick–Reisch sort, cubesort, Splaysort, Stupid sort | Junk: medical "triage" items (ecological triage, JumpSTART triage) sit under sorting algorithm. Timsort and bead sort are present. |
| cryptographic hash function (Q477202) | 82 | 58 | Spectral Hash, SANDstorm, Shabal, HAS-V, KangarooTwelve, Ascon | Healthy. BLAKE3 and Streebog are present. |
| programming language (Q9143) | 2,130 | 1,352 | IITRAN, HyperFun, hoc, Frink, Ateji PX | Big long tail (baseline). |
| *(systems, from §1)* data structure (Q175263) | 2,031 | 775 | — | Trie is missing; maple tree and XArray are missing. |
| *(systems)* lock (Q1427251) | 20 | — | — | Mutex, ticket lock, MCS, qspinlock, CNA and fissile are all missing. |

**Assessment (INFERRED):**
- A count threshold N **does not measure viability**.
- The count measures how well Wikidata editors typed the class, not how many answers exist. Isolation levels, join algorithms and NP-complete problems have 0–4 members, but players could name dozens.
- Counts also include junk: triage under sorting, library indexes under database index, ultrasound under rendering.
- Only complexity class, sorting algorithm, cryptographic hash function, programming language and data structure clear a plausible N (≈50), and even those need junk filtering.
- If a threshold is used, run it over the **LLM-generated, corpus-verified candidate list**, not over raw Wikidata class membership.

---

## What I couldn't determine

- Semantic Scholar coverage and citation counts: every keyless call returned 429.
- The pageviews API's numeric rate limit (it is documented on a separate Wikimedia "Rate limits" page I did not read).
- OpenAlex's full per-endpoint price list (I only saw the example cost for search, $0.001).
- Whether bot commits reset GitHub's 60-day scheduled-workflow inactivity timer.
- Vercel Hobby's commercial-use terms.
- Whether krillion actually uses percent-of-players scoring (I did not research krillion).
- How well an LLM alone recognises the deep terms. I made no LLM calls. The approach above assumes it does well on kernel and paper terms; test that with a small eval before committing.
- Disambiguated rarity counts for polysemous terms (maple tree, xarray). I did not test them.
