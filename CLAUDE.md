# nullion

A daily computing trivia game in the style of krillion.io. There are 7 prompts a day ("Name a type of lock"). Each accepted answer pushes stack frames, and the player's cursor descends the software stack, from Application down to Ring −3. Pixel art. The site is static, with GitHub Pages as the target.

Current stage: **offline playtest prototype.** The open question is which answer dataset and rarity strategy to use, and playtesting decides it. Don't build backend infrastructure before playtests justify it.

## Commands

- `npm run dev`: dev server with the 🐞 debug menu.
- `npm test`: vitest. Covers core rules, matching, data integrity and the game loop.
- `npm run typecheck`
- `npm run build`: production build into `dist/`. The debug menu is stripped out.
- `npm run build:debug`: same, with the debug menu, into `dist-debug/`.
- Debug deep links: `?depth=N` opens scroll-only mode parked at depth N. `?look.<slot>=<value>` sets a look (saved like the menu does), e.g. `?look.artStyle=v1`.

## Locked design decisions

- **Tiers.** Rarer means harder to reproduce. Frames per answer:

  | Tier | Frames |
  |---|---|
  | Off-by-one | 1 |
  | Works on my machine | 1 |
  | Null pointer exception | 2 |
  | Memory leak | 3 |
  | Race condition | 5 |
  | Heisenbug | 8 |
  | Bit Flip | 13 |

  - Works on my machine mirrors krillion's "Too Clever": the "obscure" pick everyone reaches for.
  - Bit Flip is exactly one hand-picked answer per question. Data loading enforces this.
- **Layers** (in `src/core/layers.ts`):
  - Thresholds: Application 0, Runtime 5, Libraries 10, OS userspace 16, Kernel 22 (syscall boundary), Drivers 32, Firmware 44, Ring −1 56, Ring −2 70, Ring −3 91.
  - Only a perfect day (7 × 13 frames) reaches Ring −3. Tests pin these properties; change a test only on purpose.
- **Data model.** A term is stored once, with tags. Each tag carries that term's tier for that category, so "heisenbug" is Works-on-my-machine for "Name a type of bug". Each question queries one tag.
  - Duplicate keys within a category are a data bug and throw at load time.
- **Answer sets are swappable** (`AnswerSet` in `src/core/answers.ts`). Register new ones in `SETS` in `src/main.ts` to compare them in the debug menu.
- **Missed-answer reports and question submissions** go through prefilled GitHub Issue links. A GitHub account is required, and that's acceptable. Reports are never auto-accepted.
- **Day rollover:** local midnight, Wordle-style. `src/core/day.ts` has the epoch.

## Visual alternatives

Looks are drafted live:
1. Add an option to `LOOK_SLOTS` in `src/looks.ts`.
2. Branch on `look('slot')` where it's drawn, usually `src/render/scene.ts`.

The debug menu builds its controls from that table. Keep alternatives switchable rather than replacing the current look, so the user can compare them in the site.

Reduced motion must keep working: flashes, tearing, rain and flicker all check `reducedMotion()`.

## Conventions

- Invariants use `enforce()` from `src/core/enforce.ts` and throw loudly. Expected conditions are handled explicitly, never with silent defaults. Missing localStorage is an expected condition.
- Keep game rules in `src/core` and `src/game`, free of DOM code, and test them.
- `src/data/sample.ts` holds hand-written placeholder tiers, not the output of a rarity signal.

## Research

- `research/krillion-internals.md`: how krillion and algillion validate and score answers, plus a survey of clones.
- `research/data-sources-and-hosting.md`: knowledge-base coverage of deep terms, rarity signals, GitHub Pages and Actions constraints.
