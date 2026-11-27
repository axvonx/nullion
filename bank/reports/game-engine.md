# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: game engine, engine.

## game-engine

30 candidates; 17 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| AGI | 0 | 8 | 77 | 0.80 | npe | counts | leak | — |
| MADE ⚠ counts said npe | 3 | 32 | 1548 | 0.80 | heisenbug | judge (override) | heisenbug | — |
| SCI ⚠ counts said npe | 0 | 2 | 23 | 0.69 | race | judge (override) | race | — |
| Macromedia Director | 0 | 1 | 33 | 0.58 | npe | counts | leak | — |
| WAGE | 0 | 2 | 4 | 0.55 | heisenbug | judge | heisenbug | — |
| MADS ⚠ counts said leak | 0 | 1 | 23 | 0.54 | heisenbug | judge (override) | heisenbug | — |
| Twine | 0 | 2 | 0 | 0.40 | womm | pin | leak | — |
| AGOS ⚠ counts said leak | 0 | 0 | 82 | 0.40 | heisenbug | judge (override) | heisenbug | — |
| Groovie | 0 | 1 | 3 | 0.38 | heisenbug | judge | heisenbug | — |
| SCUMM | 0 | 1 | 0 | 0.25 | womm | pin | leak | — |
| SAGA | 0 | 0 | 5 | 0.16 | heisenbug | judge | heisenbug | — |
| SLUDGE | 0 | 0 | 2 | 0.10 | race | judge | race | — |
| HUGO | 0 | 0 | 2 | 0.10 | heisenbug | judge | heisenbug | — |
| NGI | 0 | 0 | 2 | 0.10 | heisenbug | judge | heisenbug | — |
| DGDS | 0 | 0 | 1 | 0.06 | heisenbug | judge | heisenbug | — |
| Adventure Game Studio | 0 | 0 | 0 | 0.00 | womm | pin | leak | — |
| Wintermute Engine ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Freescape ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Z-Vision ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| qdEngine ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| HPL1 Engine ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| GrimE ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Mohawk ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mTropolis ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Cryo Omni3D ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Kyra ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| GOB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Parallaction ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Tinsel | 0 | 0 | 0 | 0.00 | bitflip | pin | heisenbug | — |
| Tetraedge ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): SCI (counts said npe, now race), MADE (counts said npe, now heisenbug), MADS (counts said leak, now heisenbug), AGOS (counts said leak, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

19/20 sampled answers are members (95%); 18/20 also have an acceptable tier. Not members: HUGO (Hugo is a turn-based text-adventure authoring system, not a real-time engine or a proprietary studio engine, so it falls outside the Accepts line.).

## Pipeline report

Generated 2026-11-27 18:59 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/game-engine.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (Tinsel; SCUMM, Adventure Game Studio, Twine): the owner vets them
- scripts/bank/obvious-draft/game-engine.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 35/35 obvious answers accepted |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | PASS | 43/62 answers have a verified link (69%); prompt link yes |
| precision | PASS | 19/20 sampled answers are members (95%), 18/20 with acceptable tier |
| answer count | PASS | 62 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 3 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 10 | 10 |
| Works on my machine | 3 | 0 |
| Null pointer exception | 26 | 26 |
| Memory leak | 0 | 0 |
| Race condition | 6 | 6 |
| Heisenbug | 16 | 16 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 2.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## game-engine
_Name a game engine_

Works on my machine:
- [ ] SCUMM
- [ ] Adventure Game Studio
- [ ] Twine
- [ ] Freescape
- [ ] Wintermute
- [ ] ZVision
- [ ] other: 

Bit Flip:
- [ ] Freescape
- [ ] Groovie
- [ ] mTropolis
- [ ] Tinsel
- [ ] DGDS
- [ ] Sword25
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 12 |
| harvest | done | 1 |
| filter | done | 46 |
| compare | done | 0 |
| escalate | done | 26 |
| merge | done | 9 |
| obvious | done | 23 |
| dupes | done | 0 |
| links | done | 19 |
| precision | done | 53 |
| report | running |  |
