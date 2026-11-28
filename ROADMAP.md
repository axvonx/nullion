# nullion roadmap

Last updated 2026-11-27. This file is the single place for what's next. Locked decisions live in `CLAUDE.md`. The Endless stack design lives in `docs/archive/endless-plan.md`.

## Where things stand

Updated 2026-11-27.

- **GUI, world and code: far ahead of content.** Title, reveal, tier reactions, console forms, sound, favicon done. 29 + 2 layers (one module each in `src/layers/`), 588 prop types at 20+ per layer, all following `docs/art-style.md`. Endless is released (offered on the end card after the daily; hearts, saved runs, a personal best); True Endless is debug-only. The refactor of 2026-11-27 left one module per layer, per mode, per entity.
- **Answer bank: thin.** 45 approved categories (2026-11-27) and 148 drafts, 7 of them pipeline-complete and waiting for review (REVIEW.md). With 7 prompts a day, the 45 repeat about every 6 days.
- **Answer matching: fixed 2026-11-27** (phrasings, four-letter swaps, sure corrections; `CLAUDE.md`). Guesses outside the bank: a debug-only Wikipedia check is being evaluated (`src/game/outside-check.ts`).
- **Field Manual: built, mostly unwritten.** The binder ships; 38 approved pages, 347 LLM-drafted pages (debug only) from the naming desk, about 220 new entities still unnamed there.
- **Recall is measurable now:** `scripts/bank/recall.py` (Wikipedia categories as references, members judged) and the missed-guesses log (`scripts/bank/misses.py`) feed the Inbox. The database showed the gap: 13+ well-known systems missing from a two-listing plan.
- **Content is the bottleneck**, then matching. Further art passes have little value until there are enough questions to play the world through.

## Milestone 1: question and answer generation (next)

The goal is a bank of about 150 launch-quality categories. Each needs:
- a deep accepted-answer list with aliases;
- tiers that feel right at the top (obvious answers shallow) and at the bottom (deep cuts deep);
- one Bit Flip and one Works-on-my-machine pick.

**Pipeline built (2026-11-27):** `python3 -I scripts/bank/pipeline.py <id>` runs a category end to end (plan, harvest, two-model filter, compare, escalate, merge and score, obvious, dupes, links, precision, report), resumable per stage, and `--batch N` walks `design/triage/ranked.md`. Proven on the top two ranked categories (`compiler`, `complexity-class`); both stay drafts. Per category the owner now only vets what the report flags: the LLM-drafted plan, the LLM-chosen Bit Flip and Works on my machine pins, the drafted obvious list, and the link and precision results. Next: run `--batch` down the ranking, then approve.

The user's time is the scarce resource, so per category the only manual work should be two picks and a glance at the flagged list.

### What matters most

1. **Recall of the deep tail.** This is the whole premise: xarray, maple tree, fissile lock and CNA lock must be accepted. A missing deep answer is worse than a slightly mis-tiered one.
2. **The top tier must not be stingy.** If "spinlock" scores deeper than Off-by-one, the game feels broken on the very first answer most players give.
3. **Low curation per category.** Everything automatic gets flagged, never silently decided.
4. **Bundle size and loading.** A secondary concern, but it forces a format change before the bank grows.

### Stages

0. **Scorer fixes. Done 2026-11-26:** absolute cut-offs, robust per-category normalisation, per-category lazy files. Spinlock is now Off-by-one, and flags dropped from 7 to 3. Still to do: re-check the cut-offs on the first new category before freezing them.
   - Tier by absolute cut-offs on the normalized score instead of fixed shares of the list. Shares depend on what's in the list: mining hundreds of obscure candidates would push spinlock deeper still.
   - Calibrate the cut-offs on the two pilot categories plus one new category, then freeze them.
   - Split the generated data per category (`src/data/generated/<id>.json`) and fetch only the day's 7 files. A static import of every category won't scale past a few dozen.
1. **Category bank. Format and drafts done 2026-11-26:** Markdown bank (`bank/`, format in `CLAUDE.md`), with 186 draft prompts from 4 Haiku agents after removing 22 cross-domain duplicates. Their example answers are unverified. Next: harvest candidates per draft and run the admission test below.
   - Original plan:
   - Draft about 250 candidate prompts across systems, languages, architecture, networking, databases, graphics and game engines, security and computing history. Theoretical CS gets a lighter weight.
   - Admit a category automatically only when its harvest (stage 2) yields:
     - at least 40 candidate answers;
     - at least 5 answers with strong evidence;
     - a real deep tail;
     - clear membership (no "Name a thing" prompts).
   - The user greenlights the admitted list in a single review sheet.
   - The bank then grows through a backlog plus GitHub Issue question submissions (links already wired in `src/ui/issues.ts`).
2. **Harvest candidates from three recall sources, merged.**
   - **LLM enumeration:** several passes per category ("common", "textbook", "papers and kernel internals", "industry and history").
   - **Head-noun mining from the local corpora:** dblp and arXiv titles matching `<modifier> <head noun>` ("… lock", "… tree", "… heap"), plus kernel docs for Linux-specific names. This is where fissile lock and maple tree come from. It's noisy, so an LLM filter judges membership. It's a recall source, not an authority.
   - **Structured lists where a class is well defined:** Wikidata, which is CC0 (programming languages, operating systems, CPUs).
   - Then generate aliases and run the existing collision checks (`CategoryIndex` rejects ambiguous ties).
3. **Tiering:** the existing counts-plus-judgement pipeline, generalized to every category.
   - Counts decide only where evidence is strong; judgement decides the tail; disagreements of more than one tier are flagged.
   - The LLM proposes 3 Bit Flip and 3 Works-on-my-machine candidates per category, and the user picks one of each. This is the only required manual step.
4. **Checks in CI, failing the build rather than warning:**
   - every category loads, with exactly one Bit Flip and one Works on my machine;
   - minimum answer count per category;
   - no alias collisions;
   - tier distribution within bounds;
   - the player-profile depth simulation still meets the layer intents in `CLAUDE.md`.
5. **Schedule.**
   - A build-time deterministic schedule maps day number to 7 categories, with a cooldown (no repeat within about 3 weeks) and a domain mix.
   - Endless draws the whole bank, weighted deeper as the player descends. Each category's difficulty is derived from its tier distribution.
6. **Playtest loop.**
   - Export the debug build's rejected-guess log, triage it into additions, and re-run. That's the same path GitHub "I should've got this" reports will feed later.

### Open questions for the user

- **Who generates the candidate lists?**
  - Option (a): Claude Code subagents on the Pro subscription. It costs nothing extra, but it's slow and hits usage limits (we already hit one).
  - Option (b): an Anthropic API key with about $10 of credits for a Batch job. That covers roughly 250 categories, with headroom for re-runs at Haiku or Sonnet prices.
  - (b) is the same key the launch judge needs anyway, and it matches "money goes to API credits". Recommendation: (b), once the stage-0 fixes and three hand-verified categories prove the prompts.
- **Bank size at launch.** About 150 categories means each one recurs roughly every 3 weeks. Is that acceptable, or should launch wait for about 300?
- **Spoilers.** The repo is public, so the answer lists are public too. That's normal for this genre, and I'd accept it. Obfuscating the lists is cheap and could be added later.
- **Domain weighting.** Which domains are first-class and which are occasional?

## Milestone 2: launch

- **Long-tail answers, judged offline rather than live (proposed 2026-11-26, replaces the live-judge plan):**
  - **The evidence dictionary.** Mining already produces every phrase and identifier in the source trees that ends in a category's head noun. That's thousands of noisy strings per category. We keep all of them, not just the survivors.
  - **Judge the dictionary offline.**
    - Batch Haiku judges each mined string against the membership rule, with its source snippet as evidence. Strings go about 50 to a request, so the whole bank costs a few dollars, once.
    - Accepted strings go into the bank. Low-confidence ones go to the Inbox.
    - This makes the precomputed bank as large as the evidence allows.
  - **Live play uses no paid API.** A guess is checked in this order:
    1. against the bank (free);
    2. otherwise against the evidence dictionary (free). A hit means it was already judged offline.
    3. Anything else has no public evidence anywhere we looked. That covers both bogus guesses and true dark matter, like an RE-only name. It's rejected with "Not accepted", and the report link is offered.

    So bogus volume costs nothing, and there's no worst case to rate-limit.
  - **Learning loop without an LLM:**
    - A tiny Worker plus KV counts normalised rejected guesses per prompt. That's a counter, not a judge.
    - Strings that many players type rise to the top of a review queue, alongside GitHub reports.
    - A human accepts them, with a citation, into the bank.
  - **Live LLM judging stays optional.** It's only for guesses that are frequent *and* unresolved, and it never fires per keystroke or per player.
  - **Measuring recall.**
    - Hold out reference lists (Wikipedia lists, textbook indexes) and check what share the pipeline found without them.
    - Playtest misses are the other measure, as the lock gaps showed.
- **Production Endless entry: done 2026-11-27** (Enter endless on the end card after the daily, not a title-screen switch; a personal best in localStorage; a tally share).
- **Build hygiene:**
  - Done: Pages deploys `npm run build`, with the debug build under `/debug/`; the dist grep for debug strings is a CI check, mirrored on the sources by `src/debug-leak.test.ts`.

## Player data (planned 2026-11-26)

- **Today:**
  - The day in progress (`nullion.daily.<puzzle>`), one compact record per finished day for stats, and prefs, all in localStorage.
  - Debug builds use a `nullion.debug.` prefix.
  - Krillion stores the same things locally, plus a server-side player ID and a Google-linked account for sync. It has no file export.
- **JSON export and import, next:**
  - A versioned file holding finished day records, stats and prefs. The in-progress day is left out.
  - Day records are immutable and keyed by puzzle, so importing is a union merge: no conflicts, and nothing like version control is needed. Streaks and averages are recomputed. If the same day was played on two devices, keep the earliest completion.
  - Old versions upgrade forward. A file from a newer version is refused loudly.
  - Transport: download or upload a file, copy and paste text, and later a QR code.
- **Safari storage eviction:** iOS Safari deletes script-written storage after 7 days without a visit. Call `navigator.storage.persist()`, and prompt an export after long streaks.
- **History is stored as played** (tier and frames per answer), so re-tiering or retiring a category never rewrites past days.
- **Stats are self-reported.** That's fine until leaderboards exist; those need server-issued signed receipts per answer, as krillion does.
- **Shared state needs a small API next to the static site,** not a hosting move:
  - cross-player averages and percentiles;
  - the counter of rejected guesses;
  - leaderboards;
  - sync.

  A Cloudflare Worker with KV or D1 fits.
- **GitHub login** needs that Worker, because the login code must be exchanged for a token server-side, with a client secret. Options:
  - opt-in sync to the player's own private Gist (it needs the `gist` scope);
  - our own accounts, with GitHub as the login.

  Export comes first, then Gist sync, then accounts once leaderboards exist.

## Milestone 3: after launch

- **Other players' answers:** a dropdown per backtrace row, which needs a backend for answer counts. Pinned in `CLAUDE.md`.
- **Custom recorded sound:** un-ignore `sounds/` when real assets arrive.

## GUI loose ends (small, carried over from the Antigravity session)

- **Done:** alternate critters now have their own motion sets (`critters.alt` in each layer's module, `src/layers/`). For example, butterflies only fly, padlocks hop between props and rest, and drones hover.
- **Decided:** the world is the same for everyone on a given day, so the per-visit scatter is reverted. The share text shows tier glyphs only, with no frame scores.
- **Decided 2026-11-27:** Heisenbug keeps its held tint (no one-way inversion; that stays Bit Flip's). The settings-popover overlap is moot: the entrance card was retired.
