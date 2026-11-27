# Field Manual style guide

The Field Manual is an archive binder of Unix-style manual pages (FIELD-MANUAL-PLAN.md). Each entry is one page:
NAME, HABITAT, BEHAVIOR (critters only), DESCRIPTION, BUGS, SEE ALSO. This guide says how to write those pages.
Every number below is a constant in `src/game/manual-style.ts`, and `styleProblems()` enforces the mechanical rules.
Change a limit in the code and here together.

Status: Daily entries (about 40) are being hand-written. The current `MANUAL_ENTRIES` are placeholders. They are
useful only as examples of what to avoid, and they all fail the checker today.

## 1. Voice

- **Dry, precise, man-page register.** Short declarative sentences. The subject is the thing, not the reader.
- **Computing-literate, readable by a casual player.** Name the real concept once, plainly. Do not assume the
  reader knows what SMM or a VMCS is; the sentence should make it clear anyway.
- **Humour lives in BUGS. Facts live in DESCRIPTION.** BUGS is where the joke goes; DESCRIPTION stays straight, even
  when the thing is a cartoon.
- **Third person, present tense.** "Glides", "holds", "counts". Never "you".
- **Understatement over exclamation.** The page never shouts. No exclamation marks, no emoji, no hype words.

## 2. Anatomy and limits

| Section | Field | Job | Limit (constant) |
|---|---|---|---|
| NAME | `name` | The display name, the thing's proper handle | ≤ 40 characters (`NAME_MAX`), ≤ 4 words (`NAME_MAX_WORDS`) |
| NAME line | `tag — Name` as printed, e.g. `lock-ness — Lock Ness` | What the binder shows | within the tag and name limits (no separate limit) |
| (man tag) | `manTag` | The tag in the page header | base ≤ 14 characters (`TAG_BASE_MAX`) |
| HABITAT | from `sightings` | Drawn by the binder, not written | none |
| BEHAVIOR | from `SPECIES_MOTIONS` | Drawn by the binder, critters only | none |
| DESCRIPTION, part 1 | `blurb` | What the thing is and does, in the world | exactly 1 sentence, ≤ 140 characters (`BLURB_MAX`) |
| DESCRIPTION, part 2 | `note` | The real computing fact | exactly 1 sentence, ≤ 160 characters (`NOTE_MAX`) |
| BUGS | `bugs` | One dry line | exactly 1 sentence, ≤ 110 characters (`BUGS_MAX`); required (`BUGS_REQUIRED`) |
| SEE ALSO | `seeAlso` | Other entries to read next | 0–3 existing ids (`SEE_ALSO_MAX`), never itself, no repeats |
| Plate detail | `sightings[].detailNote` | One line per appearance (hover) | ≤ 90 characters (`DETAIL_NOTE_MAX`), one line |

- **Every sentence ends with a full stop.** Do not use abbreviations with stops ("e.g.", "i.e.", "etc."). They break
  the sentence count. Write "for example" and "and so on".
- **DESCRIPTION is `blurb` then `note`**, so it is at most two sentences.
- **BUGS is one sentence on one line.** No line breaks anywhere in any field.
- **Rarity never appears in prose.** No percentages and no tier words (common, uncommon, rare, mythic). The binder
  shows the measured share itself. Do not write "rare" to hint at it.
- **Reach is not rarity.** Do not write about how deep a thing is found as a chance. Say where it lives.

## 3. Names and tags

- **`id`** is a lowercase hyphenated slug, ≤ 40 characters, unique across the registry: `crit-songbird`.
- **`name`** is the display name, ≤ 4 words, and it must read well as the first line of the page.
  - Use a leading article ("The Hourglass") only; articles after the first word are refused.
  - No filler words: thing, things, stuff, some, very, really, just, always, never, kind, sort, ones, one.
    Every word of the NAME becomes a row in the permuted index, so a filler word is a useless row.
  - No dash clause. The NAME line is `tag — Name`; do not put a description after the name.
  - Names are unique, ignoring case.
  - Puns are a judgement call (see open questions). A pun must still satisfy the rules above.
- **`manTag`** is the man-page tag, `BASE`, where BASE is UPPERCASE words joined by hyphens, ≤ 14 characters, unique
  across the registry: `LOCK-NESS`, `GC-BLOB`.
  - Write the base only. The binder adds the chapter number from the entry's home layer (its shallowest Daily
    sighting). A suffix is accepted only when it equals that chapter number, for example `SONGBIRD(1)`.
  - Never a ring number. `(−2)` is refused: the chapter is 1–10, and rings are not chapters.
  - Endless-only entries carry no suffix at all.
- **The permuted index reads the name.** Pick names where the important word is also the most useful key
  ("Lock Ness", "Heap Hopper"). Each word of the name is a row; a row must be worth finding.

## 4. The real-computing ground

- Every entry's `note` states **one true, checkable fact about the computing concept the thing stands for.** It is
  the only place the page teaches. A reader who looks the fact up should find it.
- A fact is checkable when a manual, a spec, a textbook or the kernel source says it. Prefer the general mechanism
  ("a tracing collector marks everything reachable from the roots") over a number, a version or a product name.
- **Do not invent technical claims.** No made-up registers, instructions, timings, sizes or CVE-style details. If
  you cannot state the fact without guessing, pick a different fact or a different thing.
- Metaphors go in `blurb`, where they belong. A metaphor in `note` ("a friendly picture of...") is not a fact.
- Keep the fact true at the level the page states it. "Ring −2 freezes the OS while SMM runs" is fine. A precise
  claim about one vendor's firmware is not.

## 5. Things to avoid

- **Marketing tone:** amazing, awesome, epic, ultimate, legendary, incredible, insane, crazy, super, mega, cool,
  fun, wow, magical. Also "unlock", "discover", "collect", "don't miss".
- **Exclamation marks and emoji.** Neither, anywhere.
- **Second person.** No "you", "your", "yours", "yourself". The reader is not in the page.
- **Restating the name.** The blurb must not open by re-saying the name ("A sky sprite glides..."). The note may
  name the concept it stands for ("a watchdog timer"), because that is the fact.
- **Puns in NAME.** Not mechanically checkable. The reviewer should check each name against the page's voice.
- **Filler and articles** in NAME (see section 3).
- **Rarity words or percentages** in any prose field.
- **Stacked clauses.** One sentence, one idea. If a blurb needs a semicolon and a dash, cut one.
- **A joke in DESCRIPTION.** Move it to BUGS.
- **Gossip about other entries.** SEE ALSO does that job.

## 6. Worked examples

These rewrite current placeholder entries. Each "before" fails the checker for the reason shown.

**Heap Hopper** (`crit-helper`), a critter.

- Before: note `"A friendly metaphor for tracing garbage-collector workers hopping across live heap references."`
  This is a metaphor, not a fact, and it does not say what a collector does.
- After:
  - blurb: `"Never flies; it hops from one live allocation to the next."`
  - note: `"A tracing garbage collector marks every object reachable from the roots, then frees the rest."`
  - bugs: `"Hops over the one object it was meant to keep, and calls that a feature."`

**Small Ben** (`small-ben`), a multi-layer prop.

- Before: `manTag: "SMALL-BEN(2)"` on an Application entry. The checker refuses the suffix because the home chapter
  is 1, and the binder would ignore it anyway. The blurb says "follows you", which is second person.
- After:
  - manTag: `"SMALL-BEN"`
  - blurb: `"A stubborn wall clock that keeps time on every layer and stops only in System Management Mode."`
  - note: `"Computers keep wall-clock time in a real-time clock chip, so the time survives a power cut."`
  - bugs: `"Runs four minutes fast and has never once admitted it."`

**Recycle Goblin** (`trash-bin`), a prop.

- Before: blurb `"Politely holds onto deleted files until you finally click Empty — and immediately regret it."`
  It addresses the reader and joins two clauses with a dash.
- After:
  - blurb: `"Holds onto deleted files until someone empties it, then regrets it at once."`
  - note: `"Deleting a file usually only unlinks its directory entry until the space is overwritten."` (the
    placeholder's note was already a fact; keep it)
  - bugs: `"Has no memory of why anyone wanted the files back in the first place."`

## 7. What the checker covers and what a reviewer covers

The checker (`styleProblems`) catches: id, name and tag shape, uniqueness and lengths; filler
and articles in NAME; one-sentence fields and their full stops; abbreviations with stops; emoji, exclamation marks,
second person, marketing words, rarity words and percentages; a blurb that restates the name; required BUGS;
SEE ALSO references; sighting order, layer names and the critter, anomaly and prop field rules.

The checker cannot catch: whether a note's fact is true; whether a blurb is dry enough; whether a BUGS line is
funny; whether a name is a pun; whether a critter's behaviour matches its species. A reviewer does those, and the
entry is not done until one has read the fact against a source.

## 8. Decisions (owner, 2026-11-27)

1. **BUGS is optional.** Write one when there's a good line; never pad (`BUGS_REQUIRED = false`).
2. **The NAME line prints `tag — Name`**, no internal id, and the permuted index rotates the display name only.
3. **Rumours are hand-written**, one per entry: the `rumour` field, one line of at most `RUMOUR_MAX` characters,
   pencil register (lowercase is fine), no "!". Nothing is generated; an entry without one shows a bare blank page.
4. **No source field.** A checkable fact needs no citation unless it's very specific: "the first computer bug was a
   moth" is fine unsourced; an exact cycle count or a CVE number should name where it comes from in the note itself.
5. **DESCRIPTION stays two fields**: `blurb` (in-world) and `note` (the fact).
6. Still open: whether to ban a leading "The" in names, and whether pun names need a second reviewer.
