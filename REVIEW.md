# Owner review queue

Written 2026-11-27, updated at version 0.2.0-alpha. Things only the owner can decide, most important first. Tick or delete
items as they're done; tell Claude which ones passed and it does the mechanical part (approving, moving files,
re-running the pipeline).

## 0. Content decisions to confirm (the 11 categories approved 2026-11-27)

Left from the approvals:

- **Notes (drafted by Claude 2026-11-27, vet them):** every Bit Flip and Works on my machine pick in the 11 has a
  `note:` whisper now (42; facts written from memory, so a skim for anything wrong is worth it). serialization-format
  is settled: JSON is Off-by-one, Protocol Buffers is Works on my machine, Ion is the Bit Flip.
- Settled 2026-11-27: M-209 dropped from historical-cipher's obvious list; the compiler edits kept; HTTPS is an alias
  of HTTP.

## 1. Triage: the bottom of the keep list

`design/triage/ranked.md` is the harvesting order for the remaining drafts (Gemini hydrogen-low; lenient). Skim the
lowest-ranked "keep" rows and cut what you wouldn't play, e.g. `acpi-table` (obvious score 1),
`dependency-injection-framework`.

**Next pipeline batch:** `python3 -I scripts/bank/pipeline.py --batch 10` runs the next ten (uses Gemini and the
owner's Claude allowance for the Haiku passes). Batch 2 (2026-11-27): **9 drafts to review** (video-codec, web-framework, bus-standard, color-space,
language-feature, memory-technology, x86-instruction: 1,496 answers, 1% linked, and its "duplicates" are mostly
real S-suffixed instructions; graphics-api: Bit Flip now deko3d, GX2 moved to Heisenbug; design-pattern: Table
Inheritance and Map-Reduce removed, Bridge and Naked Objects re-tiered, precision passes on a fresh sample).
**design-principle** needs a hand-written plan (code trees never name design principles). Note: **turing-award-winner** failed at harvest (a list of people;
the code/paper corpora can't supply it) and needs a hand-written source plan pointing at a list of winners.

## 2. Naming desk: 221 new entities

`npm run naming` → http://127.0.0.1:4870, status filter **"new in the art pass"**. Each has Gemini's
proposed name as a write-in. Named entities get draft Field Manual pages from `python3 -I scripts/manual-from-desk.py`.

## 3. Smaller decisions

- **Duplicate answers in approved categories:** `python3 -I scripts/bank-dupes.py` lists 41 (e.g. "Sinusoidal" vs
  "Sinusoidal projection"; RISC-V "M" vs "M extension"). Each should become one entry with the other as an alias.
  A few are false alarms (`logins` and `login` are different commands).
- **Reference links left out:** `design/links/review.txt` lists 116 links on hosts outside the allowlist
  (mysql.com, redis.io, …). Say which hosts to trust and they get added.
- **Unlinked on purpose:** "Works on my machine" has no Wikipedia article, so the tier name is plain text wherever
  it appears. Give it a page (e.g. a well-known article or essay) if you want one.
- **Plain-text "nullion":** the title screen's and Settings' version lines are still plain text, not the title font.

## 4. Writing (whenever you want to start)

- `writing/VOICE.md`: yours to write: what the game sounds like.
- `writing/*.md`: 106 strings extracted verbatim, all `status: draft`. Rewrite any and mark it `status: owner`;
  agents never overwrite those. `npm run writing:report` shows draft vs owner counts.
- `writing/manual/`: 38 approved Field Manual pages (with recorded style debt) and 347 LLM drafts (debug builds
  only). Promote a draft by editing it and setting `status: approved`.

## 5. Feel checks in the browser (can't be judged from screenshots)

- The reveal's background flicker: the black region is now still, the world outside it refreshes at most every
  250 ms, and the held jiggle steps no faster than that. Enough, or calmer still?
- The end card on a phone: long prompts in the backtrace; the stack flying into the summary card; hide/show.
- The cursor's lean toward the mouse (up to 3 px): subtle enough?
- The reached layer's glow on the end card.
- Endless (released): the pacing (the curve's two numbers live in `ENDLESS_FRAME_CURVE`, `src/core/modes.ts`), the teleport card (the empty console shows under it), the button's glow and pixel pops, the history bar past 14 rounds, hearts under it.

## Reference: what links out on hover (end card and title)

| Where | Links to |
|---|---|
| "stack frames" in the end card's summary line | Call stack (Wikipedia) |
| Each layer badge in the end card's stack (bitmaps, so the link carries the name for hover and screen readers) | that layer's article (`wiki` in `src/layers/<id>.ts`, all checked to exist) |
| Tier names: backtrace hover line, answer-sheet group heads, all-time stats rows, title "How to play" tier guide | Off-by-one error, Null pointer, Memory leak, Race condition, Heisenbug, Soft error (Bit Flip) |
| Answers in the answer sheet, and the row's ↗ | checked reference links (`bank/links/`), else a Wikipedia search |

Left unlinked on purpose:

- **"Works on my machine"**: no article exists.
- **The reveal** (tier name, answer, "+N stack frames"): it sits over play and takes no pointer input, so a link
  there would invite accidental clicks mid-round.
- **The right-hand stack during play**: it already has plain-English tooltips, and it's part of the playfield.
- **The header's "N stack frames" chip and the round slots**: live play UI; the slots already expand on hover.
- **The share text**: plain text by design.
