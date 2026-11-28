# Owner review queue

Written 2026-11-27, updated at version 0.3.0-alpha. Things only the owner can decide, most important first. Tick or delete
items as they're done; tell Claude which ones passed and it does the mechanical part (approving, moving files,
re-running the pipeline).

## 0. Content decisions to confirm (the 11 categories approved 2026-11-27)

Left from the approvals:

- **Notes (drafted by Claude 2026-11-27, vet them):** every Bit Flip and Works on my machine pick in the 11 has a
  `note:` whisper now (42; facts written from memory, so a skim for anything wrong is worth it). serialization-format
  is settled: JSON is Off-by-one, Protocol Buffers is Works on my machine, Ion is the Bit Flip.
- Settled 2026-11-27: M-209 dropped from historical-cipher's obvious list; the compiler edits kept; HTTPS is an alias
  of HTTP.

**Missed guesses and recall:**
- `design/misses/2026-11-27-seed.triage.md` put 13 missing databases (ScyllaDB, Riak, RethinkDB, …) into `database`'s
  Inbox with suggested tiers. Promote them into tiers (or tell Claude to). Inbox lines never play.
- Keep copying Settings → Missed guesses into `design/misses/<date>.md` as you play; `scripts/bank/misses.py` triages it.
- Recall (`scripts/bank/recall.py`) is built but has no judged result yet: the `database` run was stopped at wrap-up
  (its Wikipedia reference categories are saved in `scripts/bank/plans/database.json`, LLM-proposed: veto or keep).
  One category takes ~25 Haiku calls (about 15–25 minutes); all 45 approved, far more. Run `database` first to
  calibrate `MIN_RECALL`, then decide on the rest; its results set the pipeline's recall gate.

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
- **Outside answers (debug, Wikipedia check):** ship it or not, and at what tier (4 of 18 wrong guesses got through in
  the probe; it sends guesses to Wikipedia).
- **Bank size before beta** (~100 categories is the stated bar; 45 now) and **domain weighting** (which are
  first-class).

## 4. Writing (whenever you want to start)

- `writing/VOICE.md`: yours to write: what the game sounds like.
- `writing/*.md`: 106 strings extracted verbatim, all `status: draft`. Rewrite any and mark it `status: owner`;
  agents never overwrite those. `npm run writing:report` shows draft vs owner counts.
- `writing/manual/`: 38 approved Field Manual pages (with recorded style debt) and 347 LLM drafts (debug builds
  only). Promote a draft by editing it and setting `status: approved`.

## 5. Feel checks in the browser (can't be judged from screenshots)

- The reveal's background flicker (black region still, world refreshed at most every 250 ms). Enough, or calmer?
- The end card on a phone: long prompts, the stack flying in, hide/show, tap targets.
- The cursor's lean toward the mouse (up to 3 px), and the reached layer's glow and pointers.
- Endless: pacing (`ENDLESS_FRAME_CURVE`, two numbers), the teleport card (the empty console shows under it), the
  button's glow and pixel pops, the history bar past 14 rounds, hearts, badges flying into the stack.
- Big screens (1440p, 4K): the UI zoom (`src/ui/ui-scale.ts`), and the badge flights and reveal under zoom (only the
  end card was checked).
- Prop pills: flashing "???", the snapshot, gray seen names, "Already seen".
- UI-STYLE pass (`UI-STYLE.md` §12 lists the checks): the header book and its snapshot catch, Settings switches and volume bars,
  How to play modal, key clicks and the rare glitch, the Endless pager and pixel hearts; at 1280×800, 2560×1440 and phones.

## Reference: what links out on hover (end card and title)

| Where | Links to |
|---|---|
| "stack frames" in the end card's summary line | Call stack (Wikipedia) |
| Each layer badge in the end card's stack (bitmaps, so the link carries the name for hover and screen readers) | that layer's article (`wiki` in `src/layers/<id>.ts`, all checked to exist) |
| Tier names: backtrace hover line, answer-sheet group heads, all-time stats rows, title "How to play" tier guide | Off-by-one error, Null pointer, Memory leak, Race condition, Heisenbug, Soft error (Bit Flip) |
| Answers in the answer sheet, and the row's ↗ | checked reference links (`bank/links/`), else a Wikipedia search |

Left unlinked on purpose (accepted by the owner 2026-11-27):

- **"Works on my machine"**: no article exists.
- **The reveal** (tier name, answer, "+N stack frames"): it sits over play and takes no pointer input, so a link
  there would invite accidental clicks mid-round.
- **The right-hand stack during play**: it already has plain-English tooltips, and it's part of the playfield.
- **The header's "N stack frames" chip and the round slots**: live play UI; the slots already expand on hover.
- **The share text**: plain text by design.
