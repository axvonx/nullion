# Owner review queue

Written 2026-11-27 at version 0.1.0-alpha. Things only the owner can decide, most important first. Tick or delete
items as they're done; tell Claude which ones passed and it does the mechanical part (approving, moving files,
re-running the pipeline).

## 1. Content: 11 drafted categories (blocks the next pipeline batch)

Read each bank file next to its report (`bank/reports/<id>.md`: gates, precision sample, Bit Flip / Works on my
machine shortlists, link coverage, and every "NEEDS A LOOK" item).

| Category | Bank file | Answers | Look at |
|---|---|---|---|
| serialization-format | `bank/data-graphics-algorithms/serialization-format.md` | 31 | **Bit Flip is CSV: wrong.** Thin: cut or widen. |
| historical-cipher | `bank/hardware-security-history/historical-cipher.md` | 36 | Bit Flip M-209 is on the obvious list: is it obvious, or is the list wrong? Thin. |
| compiler | `bank/languages-tools/compiler.md` | 70 | The pipeline agent removed OpenJDK and Reason and changed Mono to `mcs`: confirm. Bit Flip mrustc. |
| complexity-class | `bank/data-graphics-algorithms/complexity-class.md` | 102 | Bit Flip A_0PP; only 42% of answers have a reference link. Plan was hand-written (Complexity Zoo). |
| network-protocol | `bank/os-systems/network-protocol.md` | 157 | HTTPS and HTTP are separate answers: fine? Bit Flip EtherIP. |
| database | `bank/data-graphics-algorithms/database.md` | 70 | Bit Flip Ocient. |
| dns-record-type | `bank/os-systems/dns-record-type.md` | 68 | Bit Flip X25. |
| game-engine | `bank/data-graphics-algorithms/game-engine.md` | 64 | Bit Flip Tinsel. |
| linux-device-node | `bank/os-systems/linux-device-node.md` | 114 | Bit Flip `/dev/scanners/cuecat`. |
| text-editor | `bank/languages-tools/text-editor.md` | 77 | Bit Flip SciTECO. |
| unix-daemon | `bank/os-systems/unix-daemon.md` | 80 | Bit Flip rpc.sprayd. |

For each: the Bit Flip and Works-on-my-machine picks (chosen by Haiku), the LLM-drafted obvious list
(`scripts/bank/obvious-draft/<id>.json`), and, only if the answers look thin, the LLM-drafted source plan
(`scripts/bank/plans/<id>.json`).

**To approve:** `status: draft` → `status: approved` in the bank file, move `scripts/bank/obvious-draft/<id>.json` to
`scripts/bank/obvious/`, run `npm run bank:index`. Or tell Claude which pass.

**turing-award-winner** failed at harvest (a list of people; the code/paper corpora can't supply it): needs a
hand-written source plan pointing at a list of winners.

**Then:** `python3 -I scripts/bank/pipeline.py --batch 10` runs the next ten (uses Gemini and the owner's Claude
allowance for the Haiku passes).

## 2. Triage: the bottom of the keep list

`design/triage/ranked.md` is the harvesting order for the 159 drafts (Gemini hydrogen-low; lenient). Skim the
lowest-ranked "keep" rows and cut what you wouldn't play, e.g. `acpi-table` (obvious score 1),
`dependency-injection-framework`.

## 3. Naming desk: 221 new entities

`node scripts/naming-desk.mjs` → http://127.0.0.1:4870, status filter **"new in the art pass"**. Each has Gemini's
proposed name as a write-in. Named entities get draft Field Manual pages from `python3 -I scripts/manual-from-desk.py`.

## 4. Smaller decisions

- **Duplicate answers in approved categories:** `python3 -I scripts/bank-dupes.py` lists 40 (e.g. "Sinusoidal" vs
  "Sinusoidal projection"; RISC-V "M" vs "M extension"). Each should become one entry with the other as an alias.
  A few are false alarms (`logins` and `login` are different commands).
- **Reference links left out:** `design/links/review.txt` lists 116 links on hosts outside the allowlist
  (mysql.com, redis.io, …). Say which hosts to trust and they get added.
- **Unlinked on purpose:** "Works on my machine" has no Wikipedia article, so the tier name is plain text wherever
  it appears. Give it a page (e.g. a well-known article or essay) if you want one.
- **Plain-text "nullion":** the title screen's and Settings' version lines are still plain text, not the title font.

## 5. Writing (whenever you want to start)

- `writing/VOICE.md`: yours to write: what the game sounds like.
- `writing/*.md`: 106 strings extracted verbatim, all `status: draft`. Rewrite any and mark it `status: owner`;
  agents never overwrite those. `npm run writing:report` shows draft vs owner counts.
- `writing/manual/`: 38 approved Field Manual pages (with recorded style debt) and 347 LLM drafts (debug builds
  only). Promote a draft by editing it and setting `status: approved`.

## 6. Feel checks in the browser (can't be judged from screenshots)

- The reveal's background flicker: the black region is now still, the world outside it refreshes at most every
  250 ms, and the held jiggle steps no faster than that. Enough, or calmer still?
- The end card on a phone: long prompts in the backtrace; the stack flying into the summary card; hide/show.
- The cursor's lean toward the mouse (up to 3 px): subtle enough?
- The reached layer's glow on the end card.

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
