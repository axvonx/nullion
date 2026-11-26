# nullion

A daily computing trivia game in the style of krillion.io. There are 7 prompts a day ("Name a type of lock"). Each accepted answer pushes stack frames, and the player's cursor descends the software stack, from Application down to Ring −3. Pixel art. The site is static, with GitHub Pages as the target.

Current stage: **offline playtest prototype.** The open question is which answer dataset and rarity strategy to use, and playtesting decides it. Don't build backend infrastructure before playtests justify it.

## Commands

- `npm run dev`: dev server with the 🐞 debug menu and the demo rail above it (`src/debug/rail.ts`): timer, sink, play a sample day, console-form preview, and one button per tier (dive plus reaction).
- `npm test`: vitest. Covers core rules, matching, data integrity, the game loop, v4 placement (`V4_SWEEP=1` for a 200-seed sweep), reaction timelines (`src/render/reaction-fx.test.ts`), reveal layout overlaps (`src/ui/reveal-layout.test.ts`) and the HUD flow in happy-dom (`src/ui/hud.test.ts`).
- `npm run typecheck`
- `npm run build`: production build into `dist/`. The debug menu is stripped out.
- `npm run build:debug`: same, with the debug menu, into `dist-debug/`.
- Debug deep links: `?depth=N` opens scroll-only mode parked at depth N. `?look.<slot>=<value>` sets a look (saved like the menu does), e.g. `?look.artStyle=v1`. Art styles: `v4` (default: a seeded world of hand-drawn entities, `src/render/art-v4.ts` + `src/render/v4/`), `v3` (small mixed props, `art-v3.ts`), `v2` (big detailed places, `art-detailed.ts`), `v1` (flat, `art.ts`).
- More debug links: `?seed=N` pins v4's world seed; `?perf=1` times 120 scene frames and writes `PERF avg/p95/max` into the title and a box on the page (headless only schedules frames for screenshots, and virtual time freezes `performance.now()`, so measure over the DevTools protocol in real time).

## v4 world (entities and placement)

- Each layer has a library of 20+ entity types plus 1–2 anchor structures (`src/render/v4/lib-upper.ts`, `lib-mid.ts`, `lib-lower.ts`, registered in `libraries.ts`). An entity is `ent(id, sizes, draw, { anim, text, noFlip, cap, weight })`: `draw` is the static body, baked once per palette into a cached sprite; `anim` is a small live overlay on art time. Draw only through the `Pen` (`v4/kit.ts`), which snaps every solid colour to the band's palette; only `p.glow` (light) dithers.
- Placement (`v4/place.ts`, pure and unit-tested in `place.test.ts`) runs once per (seed, viewport width), never per frame: anchors first, beside the centre; then a rejection-sampled scatter with bounded attempts that never overlaps, stays out of the cursor lane and keep-outs (arrival-title band, Ring −3 core and rails, floors), allows only small text-free props in the lanes under the console card and header chips, caps each type per screen height, picks least-used types first, and borrows neighbour types near band edges (bleed). A sparse fogged far plane sits behind. It `enforce()`s that libraries are complete, anchors fit and enough of the scatter lands.
- Seeding: `main.ts` seeds the world with the puzzle number, so everyone sees the same world on a given day and it changes at rollover. The debug rail's dice button rerolls it (its tooltip shows the seed for `?seed=N`). The rail's lane is kept clear in debug builds by dropping entities under it after placement, so the rest of the layout is identical to production.
- Known limit: panels are fixed to the screen and the world scrolls under them, so "keep-out under panels" is per x-lane, not absolute; the arrival title is kept clear for landings in a layer's first frame.
- System Biosphere (`src/render/critters.ts`): every layer has its own living critters animated on `artTime` (songbirds in Application, bouncy helper blobs in Runtime, bookworm blobs in Libraries, horned daemons in Userspace, brisk thread-bots in Kernel, fast bus-beetles in Drivers, sentinel drones in Firmware, twin mirror-wisps in Ring −1, frozen mid-leap silhouettes in Ring −2, 1-bit bit-motes in Ring −3) with stereo-panned critter SFX (`sound.playCritter`) and visual chirp pips. Static scatter density in `libraries.ts` is tuned for breathing room, and literal static puns (`kr-watchdog` dog, `kr-oom` skull, static `us-daemon` / `kr-kthread`) were replaced with clean hardware props.

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
  - Thresholds: Application 0, Runtime 3, Libraries 6, OS userspace 10, Kernel 15 (syscall boundary), Drivers 22, Firmware 31, Ring −1 42, Ring −2 58, Ring −3 91. Rebalanced 2026-11-26 after a player-profile simulation showed the old ones kept typical players above the syscall and made the rings near-unreachable.
  - Intended feel: a typical day crosses into the kernel; a day of mostly deep cuts reaches Ring −1; Ring −2 needs at least one Bit Flip; Ring −3 needs a perfect day.
  - Only a perfect day (7 × 13 frames) reaches Ring −3. Tests pin these properties; change a test only on purpose.
- **Data model.** A term is stored once, with tags. Each tag carries that term's tier for that category, so "heisenbug" is Works-on-my-machine for "Name a type of bug". Each question queries one tag.
  - Duplicate keys within a category are a data bug and throw at load time.
- **Answer sets are swappable** (`AnswerSet` in `src/core/answers.ts`). Register new ones in `SETS` in `src/main.ts` to compare them in the debug menu.
- **Missed-answer reports and question submissions** go through prefilled GitHub Issue links. A GitHub account is required, and that's acceptable. Reports are never auto-accepted.
- **Day rollover:** local midnight, Wordle-style. `src/core/day.ts` has the epoch.

## Deferred decisions (don't lose these)

- **Other players' answers:** each row of the end-of-day backtrace will get a dropdown arrow that reveals what other players answered for that question (requested 2026-11-26). It needs server-side answer counts, so it waits for a backend. The row layout already leaves room for it.

## Sound & favicon

- **Procedural Web Audio (`src/audio/sound.ts`):** on by default (`prefs.sound = 'full'`, `prefs.volume = 'medium'`), with a one-click pixel speaker mute button beside the gear chip in the header and Sound (`Full / SFX only / Muted`), Volume (`Low / Medium / High`), Typo correction, and Motion (`System / Full / Reduced`) in Settings (`src/ui/prefs-menu.ts`). Uses custom 25%/12.5% pulse waves, 2-op FM synthesis, `WaveShaperNode` bitcrushing, procedural stereo `ConvolverNode` reverb (wet mix adapts per layer, bone-dry in Ring −2/−3), `StereoPannerNode` + synchronized volume swells (Race condition, Memory leak, Heisenbug), a subtle crossfading hardware ambience bed that ducks under active SFX and layers periodic chiptune artifacts, event-driven micro-foley, and a puzzle-seeded generative daily pentatonic pulse (silent in Ring −2, WOMM freeze, and `SFX only` mode), quiet title-screen glitch micro-foley, synced dive/morph/tier/boundary SFX, plus optional `/sounds/<id>.wav` overrides and an `exportWav()` helper.
- **`sounds/` directory:** kept locally and gitignored (`/sounds/` in `.gitignore`) for now while SFX are generated procedurally in JS; if custom recorded audio assets are added later, remove `/sounds/` from `.gitignore` to track them.
- **Animated favicon (`src/ui/favicon.ts`, `index.html`):** transparent hollow pixel-art `0` with 1px dark outline and periodic non-strobing glitch frames (static under reduced motion).

## Visual alternatives

Looks are drafted live:
1. Add an option to `LOOK_SLOTS` in `src/looks.ts`.
2. Branch on `look('slot')` where it's drawn, usually `src/render/scene.ts`.

The debug menu builds its controls from that table. Keep alternatives switchable rather than replacing the current look, so the user can compare them in the site.

Reduced motion must keep working: flashes, tearing, rain, flicker, cursor sway and bubbles all check `reducedMotion()`; the HUD adds `.still` so floating panels stop, and v3/v4 art animates on a clock that is 0 under reduced motion.

Looks are saved under `nullion.looks.3`; bump the key when a default changes and old saved choices should not mask it.

The day's record of answers lives in the end-of-day card and the share text; there is no running panel. The card is a backtrace, most recent round first (#0 = the last answer): each row shows its frame numbers and the tier's cursor icon, and opens in place on hover, focus or tap to the tier and the answer. Each row keeps an empty last slot for a future dropdown of other players' answers. There is no replay.

In-play animation, for orientation:
- **Title screen (`src/ui/title-logo.ts`, `Hud`):** `Game` starts in `phase: { kind: 'ready' }` over the live Application sky, framing the idling cursor between a chunky `7×9` monospace pixel-art `nullion` wordmark above (13 varied non-strobing digital artifacts mirrored into the live sky canvas as mini `nullion` ghosts, localized palette drops, tears, voids, drips, and hex tags) and the premise + **`Unwind the stack ▾`** CTA + floating **`How tiers work`** dialog below. Pressing Start plays `Scene.introDive()` and launches round 1.
- **Accepted answer:** `Scene.diveTo` plays the tier's most notable part first, where the cursor is (`LEAD_MS` in `src/render/reaction-fx.ts`, with cursor sway/bubbles held still during the lead), then dives (eased, small overshoot, camera lagging, vertical speedlines + landing thud on dives ≥ 5 frames) with the reaction still going, and on landing the reaction holds until the player presses "Unwind further". Boundary crossings play their effect (tear at syscall, mirror at VM exit, freeze-frame at SMI, 1-bit at ME) and trigger a cursor morph flash + pixel sparkles when the cursor form changes. Subtle layer-specific ambient particles run on `artTime` (off under reduced motion).
- **Tier reactions (`Scene.fx`, mirrored onto panels by HUD):** Works on my machine is a full-length Bit Flip fake-out: from `0 → 2200 ms` it mirrors Bit Flip's cascade with super-intense escalating shake of props, panels, and viewport, then snaps dead still (`freeze: true`, halting all visuals everywhere — clock, cursor blink/brackets/sway, rain, LED, caret) in color for 400 ms before washing into grayscale (`hang: true`), revealing the hourglass, and sinking `+1`. Null pointer blacks out a chunk, Memory leak leaves copies of props, Race condition and Heisenbug jiggle props and panels out of sync, Bit Flip cascades through hang, black-out, leaked copies, racing jiggle, and holds an inversion. Timelines are pure (`reactionFrame`) and tested for flash safety.
- **Tier reveal (`Hud.reveal`) & vignette (`Scene.drawVignette`):** once the dive lands, the background behind the cursor turns into a `4×4` blocky mosaic grayscale with sharp 90°-cornered rectangular dim bands (no round ovals anywhere). The reveal shows the tier name above the cursor (with drifting ghost duplicates on `Heisenbug` and a pixel-stepped shimmer on `Bit Flip`) and answer/+frames/note below, while the entire bottom console collapses into just the **`UNWIND FURTHER ▾`** button.
- **Question prompt & countdown:** console cards show only the plain question text (no code-style `name_a(...)` call line or serial timestamps), with a grayed-out `Starting in 3s → 2s → 1s` input countdown during the reading phase. Rejected guesses flash/nudge the cursor fault-red; low watchdog time tightens and reddens the cursor brackets.
- **Typo correction & settings:** player settings live behind the gear chip (beside the quick mute chip) in the header (`src/ui/prefs-menu.ts`).
- **Tier icons (`src/ui/tier-icons.ts`):** the cursor in each tier's reaction pose, used in the title tier guide, the result backtrace card, and the debug rail. Share text keeps emoji.
- **Console forms (`src/ui/forms.ts`):** the card takes the layer's idiom (GUI dialog, REPL, shell, serial console, BIOS setup, hypervisor log, SMM dump, raw entry).

## Conventions

- Invariants use `enforce()` from `src/core/enforce.ts` and throw loudly. Expected conditions are handled explicitly, never with silent defaults. Missing localStorage is an expected condition.
- Keep game rules in `src/core` and `src/game`, free of DOM code, and test them.
- `src/data/sample.ts` holds hand-written placeholder tiers, not the output of a rarity signal.

## Research

- `research/krillion-internals.md`: how krillion and algillion validate and score answers, plus a survey of clones.
- `research/data-sources-and-hosting.md`: knowledge-base coverage of deep terms, rarity signals, GitHub Pages and Actions constraints.
