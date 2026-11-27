# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: complexity, complexity class.

## complexity-class

89 candidates; 29 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| ALL ⚠ counts said off-by-one | 77 | 227 | 25771 | 1.00 | heisenbug | judge (override) | heisenbug | — |
| UP ⚠ counts said off-by-one | 33 | 193 | 15701 | 0.99 | race | judge (override) | race | — |
| P | 3 | 350 | 8405 | 0.91 | off-by-one | counts | off-by-one | — |
| RE | 12 | 97 | 3031 | 0.89 | off-by-one | counts | npe | — |
| +P ⚠ counts said off-by-one | 3 | 265 | 5260 | 0.89 | race | judge (override) | race | — |
| R | 1 | 193 | 5056 | 0.82 | npe | counts | npe | — |
| IP | 7 | 66 | 486 | 0.75 | npe | counts | npe | — |
| NP | 0 | 122 | 4981 | 0.73 | npe | counts | off-by-one | — |
| EXP | 0 | 42 | 1235 | 0.59 | npe | counts | off-by-one | — |
| PP | 1 | 33 | 314 | 0.57 | npe | counts | npe | — |
| QAM | 0 | 87 | 158 | 0.55 | leak | counts | race | — |
| MA | 0 | 33 | 673 | 0.55 | leak | counts | leak | — |
| PH | 0 | 26 | 357 | 0.50 | leak | counts | npe | — |
| PSPACE ⚠ counts said leak | 0 | 15 | 853 | 0.50 | off-by-one | judge (override) | off-by-one | — |
| AM | 0 | 27 | 256 | 0.49 | leak | counts | leak | — |
| MP | 1 | 13 | 238 | 0.49 | leak | counts | race | — |
| AP | 0 | 10 | 601 | 0.46 | leak | counts | leak | — |
| PR | 0 | 16 | 269 | 0.46 | leak | counts | leak | — |
| RP | 3 | 4 | 178 | 0.46 | leak | counts | npe | — |
| ER | 0 | 9 | 188 | 0.40 | leak | counts | race | — |
| BPP | 0 | 10 | 97 | 0.38 | leak | counts | npe | — |
| MIP | 0 | 6 | 184 | 0.37 | leak | counts | leak | — |
| MIP* | 0 | 6 | 179 | 0.37 | womm | pin | race | — |
| +EXP | 0 | 2 | 348 | 0.34 | leak | counts | race | — |
| CH ⚠ counts said leak | 0 | 4 | 98 | 0.32 | heisenbug | judge (override) | heisenbug | — |
| BQP | 0 | 3 | 139 | 0.32 | womm | pin | npe | — |
| QMA | 0 | 3 | 124 | 0.32 | race | counts | leak | — |
| SZK | 0 | 10 | 19 | 0.31 | race | counts | race | — |
| RG | 0 | 4 | 41 | 0.28 | race | counts | race | — |
| P/poly | 0 | 2 | 31 | 0.23 | womm | pin | npe | — |
| SPP | 0 | 1 | 54 | 0.23 | race | counts | race | — |
| NEXP ⚠ counts said heisenbug | 0 | 0 | 137 | 0.22 | leak | judge (override) | leak | — |
| IPP | 0 | 2 | 19 | 0.21 | heisenbug | counts | race | — |
| QCMA | 0 | 1 | 32 | 0.21 | heisenbug | counts | race | — |
| AH | 0 | 1 | 31 | 0.20 | heisenbug | counts | race | — |
| SBP | 0 | 0 | 44 | 0.17 | heisenbug | counts | race | — |
| PostBQP | 0 | 1 | 10 | 0.16 | heisenbug | counts | race | — |
| QRG | 0 | 2 | 4 | 0.15 | race | judge | race | — |
| QMA(2) | 0 | 0 | 19 | 0.13 | heisenbug | counts | race | — |
| QIP | 0 | 0 | 19 | 0.13 | heisenbug | counts | race | — |
| NP/poly | 0 | 0 | 18 | 0.13 | heisenbug | counts | race | — |
| ZPP ⚠ counts said heisenbug | 0 | 0 | 16 | 0.13 | npe | judge (override) | npe | — |
| QRG(1) | 0 | 2 | 1 | 0.11 | heisenbug | judge | heisenbug | — |
| QSZK | 0 | 0 | 10 | 0.11 | heisenbug | counts | heisenbug | — |
| AWPP | 0 | 0 | 5 | 0.08 | race | judge | race | — |
| BQP/qpoly | 0 | 0 | 4 | 0.07 | race | judge | race | — |
| SBQP | 0 | 0 | 4 | 0.07 | race | judge | race | — |
| BQP/poly | 0 | 0 | 3 | 0.06 | race | judge | race | — |
| QMIP | 0 | 0 | 3 | 0.06 | race | judge | race | — |
| QIP(2) | 0 | 0 | 3 | 0.06 | race | judge | race | — |
| PostBPP | 0 | 0 | 3 | 0.06 | heisenbug | judge | heisenbug | — |
| PP/poly | 0 | 0 | 2 | 0.05 | race | judge | race | — |
| PSPACE/poly | 0 | 0 | 2 | 0.05 | race | judge | race | — |
| QIP(3) | 0 | 0 | 2 | 0.05 | race | judge | race | — |
| NIQSZK | 0 | 0 | 2 | 0.05 | race | judge | race | — |
| S_2P | 0 | 0 | 2 | 0.05 | race | judge | race | — |
| P^PP | 0 | 0 | 2 | 0.05 | heisenbug | judge | heisenbug | — |
| MAEXP | 0 | 0 | 1 | 0.03 | race | judge | race | — |
| PEXP | 0 | 0 | 1 | 0.03 | race | judge | race | — |
| BQPSPACE | 0 | 0 | 1 | 0.03 | race | judge | race | — |
| NISZK | 0 | 0 | 1 | 0.03 | race | judge | race | — |
| QCMA/qpoly | 0 | 0 | 1 | 0.03 | heisenbug | judge | heisenbug | — |
| QRG(2) | 0 | 0 | 1 | 0.03 | heisenbug | judge | heisenbug | — |
| RG(1) | 0 | 0 | 1 | 0.03 | heisenbug | judge | heisenbug | — |
| Sigma_2P | 0 | 0 | 1 | 0.03 | race | judge | race | — |
| Delta_2P | 0 | 0 | 1 | 0.03 | heisenbug | judge | heisenbug | — |
| NPSPACE ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| NBPP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| NEXP/poly ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PPSPACE ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| (NP-cap-coNP)/poly ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| AH_plo ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| A_0PP | 0 | 0 | 0 | 0.00 | bitflip | pin | heisenbug | — |
| BQP/mpoly ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| EXP_plo ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MIP*_cme ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MIP*_fe ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NEXP_plo ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| QMA/mpoly ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| QMA/qpoly ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| QMIP_cme ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| QMIP_fe ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| QMIP_le ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| QMIP_ne ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| RG(2) ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| RG(3) ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| P^Sharp-P ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Delta_3P ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| EXP^NP ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): PSPACE (counts said leak, now off-by-one), ZPP (counts said heisenbug, now npe), +P (counts said off-by-one, now race), NEXP (counts said heisenbug, now leak), ALL (counts said off-by-one, now heisenbug), UP (counts said off-by-one, now race), CH (counts said leak, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## complexity-class
_Name a complexity class_

Works on my machine:
- [ ] BQP
- [ ] MIP*
- [ ] P/poly
- [ ] ZPP
- [ ] other: 

Bit Flip:
- [ ] A_0PP
- [ ] QMIP_cme
- [ ] BQP/mpoly
- [ ] MP
- [ ] ER
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 26 |
| harvest | done | 0 |
| filter | done | 78 |
| compare | done | 0 |
| escalate | done | 28 |
| merge | done | 9 |
| obvious | done | 22 |
| dupes | done | 0 |
| links | done | 21 |
| precision | done | 28 |
| report | running |  |

## Precision sample

18/20 sampled answers are members (90%); 16/20 also have an acceptable tier. Not members: QMIP_le (Not certain this Zoo-style name exists, and the rule says to reject when unsure. Batch line not checked.), ALL (The class of all languages is not defined by a resource bound or model, so the Accepts line excludes it. Tier is moot. Batch line not checked.).

## Pipeline report

Generated 2026-11-27 18:52 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/complexity-class.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (A_0PP; BQP, MIP*, P/poly): the owner vets them

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 30/30 obvious answers accepted |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | WARN | 42/101 answers have a verified link (42%); prompt link yes |
| precision | PASS | 18/20 sampled answers are members (90%), 16/20 with acceptable tier |
| answer count | PASS | 101 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 3 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 3 | 3 |
| Works on my machine | 3 | 0 |
| Null pointer exception | 18 | 18 |
| Memory leak | 14 | 14 |
| Race condition | 27 | 27 |
| Heisenbug | 35 | 35 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 1.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## complexity-class
_Name a complexity class_

Works on my machine:
- [ ] BQP
- [ ] MIP*
- [ ] P/poly
- [ ] ZPP
- [ ] other: 

Bit Flip:
- [ ] A_0PP
- [ ] QMIP_cme
- [ ] BQP/mpoly
- [ ] MP
- [ ] ER
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 26 |
| harvest | done | 0 |
| filter | done | 78 |
| compare | done | 0 |
| escalate | done | 28 |
| merge | done | 9 |
| obvious | done | 0 |
| dupes | done | 0 |
| links | done | 0 |
| precision | done | 0 |
| report | running |  |
