# nullion roadmap

Last updated 2026-11-26. This file is the single place for what's next. Locked decisions live in `CLAUDE.md`. The Endless stack design lives in `ENDLESS-PLAN.md`.

## Where things stand

- **GUI and world: far ahead of content.**
  - The title screen, the reveal flow, tier reactions, the console forms, sound and the favicon are all done.
  - The v4 world has 29 layers, each with setpieces, 25+ props and critters.
  - Endless mode is implemented, but only behind the debug toggle (`?endless=1`).
- **Content: almost nothing.**
  - There are 7 questions. Five use hand-written placeholder tiers (`src/data/sample.ts`). Two (lock, data structure) use the corpus-scored pilot (`scripts/score-candidates.py` → `src/data/generated/pilot.json`).
  - A daily game needs about 7 new prompts a day. Endless draws from the same bank, so with 7 questions it repeats almost immediately.
- **Content is now the bottleneck.** Further art passes have little value until there are enough questions to play the world through.

## Milestone 1: question and answer generation (next)

The goal is a bank of about 150 launch-quality categories. Each needs:
- a deep accepted-answer list with aliases;
- tiers that feel right at the top (obvious answers shallow) and at the bottom (deep cuts deep);
- one Bit Flip and one Works-on-my-machine pick.

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
1. **Category bank.**
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

- **Fallback judge:**
  - A Cloudflare Worker running Haiku 5.5 on API credits, at about $0.00025 per verdict.
  - It caches only "yes" verdicts; Claude web search is a last resort.
  - Rate limiting is per IP and per day.
  - Accepted misses flow back into the bank through stage 6.
- **Production Endless entry:**
  - A Daily/Endless switch on the title screen, replacing the debug chip.
  - A personal best stored in localStorage.
  - An Endless share card.
- **Build hygiene:**
  - The Pages workflow currently deploys the debug build. Switch it to `npm run build` for launch, and keep the debug build at a separate path if it's still wanted.
  - Keep the dist grep for debug strings as a CI check.

## Milestone 3: after launch

- **Other players' answers:** a dropdown per backtrace row, which needs a backend for answer counts. Pinned in `CLAUDE.md`.
- **Custom recorded sound:** un-ignore `sounds/` when real assets arrive.

## GUI loose ends (small, carried over from the Antigravity session)

- **Done:** alternate critters now have their own motion sets (`ALT_SPECIES_MOTIONS` in `src/render/critters.ts`). For example, butterflies only fly, padlocks hop between props and rest, and drones hover.
- **Decide:** should the world stay the same for everyone on a given day?
  - Antigravity made minor props and critters re-randomize on every visit (`fbe3382`). Only the anchors stay shared.
  - `CLAUDE.md` now describes this current behavior. Reverting it is a one-line change.
- **Decide:** keep the frame scores (`4·13·1…`) that now end the daily share text? Antigravity added them unasked.
- **The art from the last Antigravity passes was never checked on screen.** That covers the 29 setpieces and their detail pass, the Endless-only props and the alternate critters. A screenshot sweep of all 29 layers is due before more art is added.
- **Still open from earlier:**
  - Heisenbug: keep the held tint, or hold a one-way inversion like Bit Flip?
  - The settings popover overlaps the layer-entrance card.
