# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: memory, RAM, ROM.

## memory-technology

19 candidates; 2 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| RAM | 530 | 1845 | 1380 | 1.00 | off-by-one | counts | off-by-one | — |
| persistent memory | 39 | 617 | 593 | 0.98 | womm | pin | leak | — |
| DRAM | 33 | 539 | 851 | 0.97 | off-by-one | counts | off-by-one | — |
| flash memory | 14 | 1838 | 227 | 0.89 | off-by-one | counts | off-by-one | — |
| NAND flash | 7 | 794 | 84 | 0.79 | npe | counts | npe | — |
| CXL memory ⚠ counts said npe | 70 | 93 | 65 | 0.73 | heisenbug | judge (override) | heisenbug | — |
| High Bandwidth Memory | 2 | 103 | 178 | 0.66 | npe | counts | leak | — |
| DDR | 29 | 31 | 53 | 0.64 | npe | counts | off-by-one | — |
| VRAM | 37 | 6 | 142 | 0.62 | npe | counts | npe | — |
| read-only memory | 6 | 61 | 39 | 0.58 | npe | counts | off-by-one | — |
| core memory | 3 | 55 | 47 | 0.56 | womm | pin | race | — |
| DDR4 ⚠ counts said leak | 4 | 11 | 51 | 0.48 | off-by-one | judge (override) | off-by-one | — |
| NOR flash | 5 | 46 | 9 | 0.47 | leak | counts | npe | — |
| ECC memory | 5 | 10 | 4 | 0.34 | leak | counts | npe | — |
| OTP memory | 4 | 22 | 1 | 0.32 | race | counts | leak | — |
| LPDDR | 0 | 4 | 16 | 0.27 | race | counts | leak | — |
| DataFlash | 2 | 1 | 0 | 0.10 | bitflip | pin | race | — |
| serial flash | 0 | 0 | 2 | 0.07 | leak | judge | leak | — |
| CompactFlash | 0 | 1 | 0 | 0.04 | npe | judge | npe | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): DDR4 (counts said leak, now off-by-one), CXL memory (counts said npe, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

20/20 sampled answers are members (100%); 20/20 also have an acceptable tier. Not members: none.

## Pipeline report

Generated 2026-11-27 23:09 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/memory-technology.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (DataFlash; core memory, persistent memory): the owner vets them
- scripts/bank/obvious-draft/memory-technology.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 37/37 obvious answers accepted |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | PASS | 42/42 answers have a verified link (100%); prompt link yes |
| precision | PASS | 20/20 sampled answers are members (100%), 20/20 with acceptable tier |
| answer count | PASS | 42 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 2 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 5 | 5 |
| Works on my machine | 2 | 0 |
| Null pointer exception | 29 | 29 |
| Memory leak | 3 | 3 |
| Race condition | 2 | 2 |
| Heisenbug | 0 | 0 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 5.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## memory-technology
_Name a computer memory technology_

Works on my machine:
- [ ] ECC memory
- [ ] NOR flash
- [ ] High Bandwidth Memory
- [ ] core memory
- [ ] persistent memory
- [ ] CXL memory
- [ ] other: 

Bit Flip:
- [ ] DataFlash
- [ ] OTP memory
- [ ] serial flash
- [ ] LPDDR
- [ ] CompactFlash
- [ ] NOR flash
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 11 |
| harvest | done | 4 |
| filter | done | 43 |
| compare | done | 0 |
| escalate | done | 21 |
| merge | done | 7 |
| obvious | done | 20 |
| dupes | done | 0 |
| links | done | 17 |
| precision | done | 17 |
| report | running |  |
