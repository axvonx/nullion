# Changelog

The version lives in `package.json` (read by `src/version.ts`; shown on the title screen, in Settings, at the foot
of the end card, and as `nullion.version` in the browser console). Semver: `0.x` until a stable 1.0; the
pre-release tag is the stage (`alpha`, then `beta`). Bump the minor version for a release-worthy batch, the patch
for fixes, and add an entry here. Stage bars (ROADMAP.md): beta at ~100 approved categories with no known matching
or data bugs and phones verified; 1.0 at ~150 categories, a schedule kept 30+ days ahead, and the small backend for
"% of players".

## 0.2.0-alpha — 2026-11-27

- 45 approved answer categories (11 new: serialization formats, historical ciphers, compilers, complexity classes,
  network protocols, databases, DNS record types, game engines, Linux device nodes, text editors, Unix daemons).
- Matching: `*` is part of a name (A\*, MIP\*, Pro\*C), like `+` and `#`.
- Phones: the console, rail and Field Manual stay above the on-screen keyboard; the Field Manual shows a whole entry
  as one scrolling page and turns by swipe; the reveal's reached layers are icons, matching the right-hand spine;
  the end card's stack is tighter, with pointers on both sides of the layer reached, and larger tap targets.
- Fixes: Field Manual in landscape, Win95 form contrast, Enter on the reveal, notices kept on screen, sound waits
  for the first tap.

## 0.1.0-alpha — 2026-11-27

The first numbered build: the whole daily loop works, content is thin.

- Daily game: 7 prompts, tiers, reveal and reactions, end-of-day backtrace with an answer sheet whose answers link to
  checked reference pages (4,168 links).
- 34 approved answer categories (repeat about every 5 days).
- Answer matching: articles, plurals and the prompt's own noun are the same answer; four-letter swaps; confident
  one-typo corrections no longer ask.
- The world: 31 layers (29 Daily + Endless, 2 True Endless, debug only), 588 prop types under ART-STYLE.md, critters.
- Field Manual: the archive binder, 38 approved pages (347 drafts in debug builds).
- Watchdog submits what's typed when time runs out; the reveal can be hidden to collect props; the cursor leans
  toward the mouse.
