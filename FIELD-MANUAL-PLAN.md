# Field Manual plan

Decisions from the design session on 2026-11-26 (the working page was `.lavish/field-manual.html`). The current
`src/game/manual.ts` entries (names, blurbs, notes) are scaffolding. Every word of them gets rewritten.

## Rarity is real

- **Gates.** Each `(entry, layer)` appearance spawns on a share of days picked by hashing `(puzzle, entry id, layer)`:
  - common: every day;
  - uncommon: 1 in 2;
  - rare: 1 in 5;
  - mythic: 1 in 14.
  
  It's the same for every player, like the world. On an off day the prop is **absent from the world**, not just
  unclickable.
- **The shown % is measured, never typed.** A test places 365 seeded days, measures each appearance's share of
  days, and fails when that share leaves its tier's band. The manual shows that measured number. Today's hand-typed
  `rarityPct` goes away. Measured on 2026-11-26, "mythic 4%" props appeared on 98–100% of days.
- **Gated props are non-anchors**, or the placement rules get an explicit "may be absent" case.
- **Critters.** A layer's core species is always present (common). The alternate species
  (`ALT_SPECIES_MOTIONS`) become the uncommon and rare critters, gated the same way, each with its own entry.
- **Reach is separate from rarity.** The page shows the habitat; it doesn't fold the odds of reaching a layer into
  the %.

## The book: an archive binder of manual pages

- **The object.** A slate vinyl ring binder of punched bond pages, with index-tab dividers per chapter.
- **The palette.** Bond (`#f1f0ec`), toner ink, slate. Stamp red and blue pencil mark only what the player adds. No
  yellows or ambers outside the plates.
- **Type.**
  - Body: TeX Gyre Termes, regular, bold and italic, self-hosted. It's a free Times Roman revival (GUST Font License;
    check the current wording before shipping), and Times was troff's default face.
  - Stamps: Courier Prime.
  - Pencil: a hand font.
  - Text renders smooth; the plates are pixel art at integer scale. The binder is a real object laid over the pixel
    world.
- **On screen.** The binder opens over the dimmed game: a two-page spread on wide screens, one leaf on phones,
  Escape closes. It opens on the page you last read.
- **Motion.** The cover swings open in 3–4 stepped frames. Page turns are a 4-frame stepped leaf flip. A chapter jump
  riffles the pages. All of it is instant under reduced motion.

## Structure

- **Front matter.** A title page, then `intro(7)` ("how to read this manual", which explains rarity, habitats and
  sealed chapters), then the contents.
- **Chapters are layers**, in descent order: Application 1 … Ring −3 10.
  - A man tag's number is its chapter: `LOCK-NESS(4)`.
  - Page numbers are section-style: `4-6`.
  - A chapter you haven't reached is **sealed**: the divider carries a blue SEALED stamp and the depth needed, and
    its pages are blank.
- **Families** (entries that appear in several layers) live in the chapter of their shallowest sighting. Each deeper
  chapter gets a cross-listed stub. An entry's kind stays its current name, shown as a small glyph.
- **Permuted index (KWIC)** is the search page:
  - every word of every logged entry's NAME line, rotated and alphabetised;
  - typing filters the rows;
  - locked entries index only their rumour.

## An entry page

- **Left leaf.**
  - The plate: the real sprite at integer scale with its animation overlay. Critters are drawn by the critter
    renderer, not separate doodles.
  - The appearance strip: one figure per layer, with silhouettes for appearances not yet seen.
- **Rarity, under the left leaf's figures.** A hand-pencilled note, e.g. "rare · 20%", with the tier word
  scrawled over by a highlighter mark. There is no SYNOPSIS section.
- **Right leaf**, as a man page:
  - **NAME:** one line.
  - **HABITAT:** a 10-cell stack strip.
  - **BEHAVIOR:** critters only, from `SPECIES_MOTIONS`.
  - **DESCRIPTION.**
  - **BUGS:** one dry line.
  - **SEE ALSO.**
- **The first-sighting stamp is a date only** (e.g. `26 NOV 2026`).
  - A fresh stamp is **wet**: bright and glossy until you view the page, then it dries.
  - A chapter tab with wet stamps carries a small red dot.
  - The stamp thunks down, with a shake and a sound, the first time you open that page.
- **A locked entry** reads "This page intentionally left blank.", with a faint silhouette and a one-line pencilled
  rumour giving the habitat hint.
- **Not included:** field marks, sighting counters, errata slips, dog-ears.

## Writing entries

- Entries stay TypeScript in `src/game/manual.ts`.
- A short style guide goes in its header: voice, and a length limit per section (NAME ≤ 60 chars, DESCRIPTION ≤ 2
  sentences, BUGS one line).
- A test enforces those limits and the required sections.
- The owner may hand-write the entries.

## Save v2

- `nullion.manual.v2`: per `(entry, layer)` appearance, the first-seen `{ puzzle, at }`, plus the wet-stamp set.
- Migrate v1 once: its sightings get `puzzle: null`, shown undated.
- Unknown ids or a corrupt save are removed with a visible notice, like the daily save. Never silently dropped.
- Included in the planned JSON export.

## Around the manual

- **Explore after the run.** Once the day ends, the end card offers scroll-only exploration down to the deepest
  layer you reached + 1.
- **"Today in the stack"** on the end card counts today's gated rarities by tier and layer, without naming them.
- **The hover pill** loses its %. A logged sprite flies into the book icon (like the REACHED badges).
- **Volume scope.** Volume I is the Daily stack. Endless is a toggle in the same binder (next section).

## The Endless edition

- **Toggle.** "Show Endless creatures" expands the binder to all 29 layers. The toggle stays hidden until Endless
  ships, or until the player's first Endless run.
- **Chapters.**
  - Endless-only chapters are lettered supplements filed beside their Daily neighbour: `0a`, `0b` above
    Application; `2a`, `2b`, `3a`, `5a`, `5b`, `6a`, `8a`, `8b`, `9a`, `10a`, `10b`.
  - The silicon and physics layers below Ring −3 are `11`–`16`.
  - Daily numbers and man tags never change between views.
- **Written pages:**
  - all 40 species (a core species on each of the 29 layers, plus 11 alternates);
  - the 38 anchors;
  - about 2 signature props per layer;
  
  That's roughly 135 pages. Every other scatter prop goes into **Appendix A · Specimen Catalogue**: plates only,
  auto-named, collectible, no prose.
- **Daily-only rares.** Draw an alternate species for each of the 9 Daily layers that lack one (today only
  Application has one, the butterfly). Those 10 are the Daily-only rare critters, and they never spawn in Endless.
  With the toggle on, a Daily-only page carries a margin change bar and a `DAILY` mark.
- **Rarity in Endless.** Gates roll on the run seed. Endless chapters show "% of runs", Daily chapters "% of days".
  Endless chapters unseal at the player's best-ever Endless depth, which needs a saved high-water mark.
- **Sprite pass first.** Before any Endless page is written, every species gets a distinct silhouette with at least
  a 6×6 px body. Today VMM and EPT draw the identical sprite; SMRAM, Landauer and Bandgap are specks; and the two
  MINIX species are recolours of each other.

## Build order

1. **Rarity gates in placement, plus the measuring test. Done 2026-11-26.**
   - `src/game/rarity.ts`: `spawnsOn`, `gateFor`, `presenceRate`, `shownRate`.
   - `PlaceGeom.gate` in `v4/place.ts`, wired up in `v4/world.ts`.
   - Tests: `src/game/rarity.test.ts` and `src/render/v4/rarity-world.test.ts`. The second checks phone, laptop and
     desktop viewports: an off-day prop is never placed, bleed included, and an on-day prop is placed on at least
     95% of its days.
   - Hand-typed `rarityPct` is removed.
   - Scaffolding changes:
     - critter entries are common (core species);
     - the four entries with an anchor appearance (small-ben, silicon-heart, kernel-furnace, vault-keeper) are
       common, because anchors are landmarks and never gated;
     - question-reactive anomalies show no %, since no honest day-share describes them.
2. **Save v2. Done 2026-11-26.**
   - `src/game/manual-save.ts`: strict parse, the v1 migration, and pruning of entries or layers that no longer
     exist.
   - `ManualStore` stamps `{ at, puzzle, prompt? }` and tracks wet stamps.
   - `main.ts` supplies the context and shows load notices.
   - Tests: `src/game/manual-save.test.ts`.
3. The binder UI, replacing `manual-modal.ts`, behind a `LOOK_SLOTS` switch until it's ready.
4. Entry content: hand-written against the style guide.
