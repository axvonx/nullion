# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: serialization, data format.

## serialization-format

2 candidates; 0 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| JSON | 2 | 11 | 84 | 0.40 | womm | pin | off-by-one | — |
| CSV | 0 | 0 | 20 | 0.40 | bitflip | pin | off-by-one | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): none

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

20/20 sampled answers are members (100%); 15/20 also have an acceptable tier. Not members: none.

## Pipeline report

Generated 2026-11-27 19:04 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/serialization-format.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (CSV; JSON): the owner vets them
- scripts/bank/obvious-draft/serialization-format.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 30/30 obvious answers accepted |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | PASS | 29/30 answers have a verified link (97%); prompt link yes |
| precision | PASS | 20/20 sampled answers are members (100%), 15/20 with acceptable tier |
| answer count | WARN | 30 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 1 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 2 | 2 |
| Works on my machine | 1 | 0 |
| Null pointer exception | 26 | 26 |
| Memory leak | 0 | 0 |
| Race condition | 0 | 0 |
| Heisenbug | 0 | 0 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 1.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## serialization-format
_Name a data serialization format_

Works on my machine:
- [ ] Quoted-Printable
- [ ] Ascii85
- [ ] mbox
- [ ] other: 

Bit Flip:
- [ ] PAX
- [ ] Ascii85
- [ ] Quoted-Printable
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 11 |
| harvest | done | 2 |
| filter | done | 34 |
| compare | done | 0 |
| escalate | done | 14 |
| merge | done | 7 |
| obvious | done | 20 |
| dupes | done | 0 |
| links | done | 22 |
| precision | done | 28 |
| report | running |  |
