# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: signature, post-quantum.

## post-quantum-signature-scheme

46 candidates; 7 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| ML-DSA | 2 | 77 | 136 | 1.00 | off-by-one | counts | off-by-one | — |
| LESS ⚠ counts said off-by-one | 2 | 38 | 313 | 0.95 | race | judge (override) | race | — |
| CROSS ⚠ counts said off-by-one | 1 | 120 | 548 | 0.93 | heisenbug | judge (override) | heisenbug | — |
| Falcon | 4 | 63 | 49 | 0.92 | womm | pin | — | — |
| Wave ⚠ counts said npe | 0 | 52 | 87 | 0.75 | race | judge (override) | race | — |
| SLH-DSA | 0 | 39 | 46 | 0.67 | npe | counts | off-by-one | — |
| SPHINCS ⚠ counts said npe | 0 | 32 | 28 | 0.61 | race | judge (override) | race | — |
| LMS | 0 | 12 | 26 | 0.51 | leak | counts | leak | — |
| XMSS | 0 | 24 | 8 | 0.49 | leak | counts | leak | — |
| UOV | 0 | 39 | 4 | 0.49 | leak | counts | leak | — |
| Rainbow | 0 | 28 | 3 | 0.44 | leak | counts | leak | — |
| Picnic | 0 | 12 | 7 | 0.42 | leak | counts | race | — |
| MAYO | 0 | 13 | 6 | 0.41 | leak | counts | race | — |
| Winternitz one-time signature | 0 | 16 | 4 | 0.40 | leak | counts | race | — |
| SQIsign | 0 | 11 | 5 | 0.38 | bitflip | pin | — | — |
| MEDS | 0 | 4 | 8 | 0.33 | race | judge | race | — |
| BLISS | 0 | 8 | 3 | 0.32 | race | judge | race | — |
| Merkle signature scheme | 0 | 14 | 1 | 0.32 | race | counts | leak | — |
| HAWK | 0 | 9 | 2 | 0.31 | race | judge | race | — |
| SNOVA | 0 | 5 | 4 | 0.30 | heisenbug | judge | heisenbug | — |
| Raccoon | 0 | 8 | 1 | 0.27 | heisenbug | judge | heisenbug | — |
| SQUIRRELS | 0 | 4 | 2 | 0.24 | heisenbug | judge | heisenbug | — |
| HSS | 0 | 6 | 1 | 0.24 | race | judge | race | — |
| QR-UOV | 0 | 2 | 4 | 0.24 | heisenbug | judge | heisenbug | — |
| PERK | 0 | 4 | 1 | 0.21 | heisenbug | judge | heisenbug | — |
| ALTEQ | 0 | 4 | 1 | 0.21 | heisenbug | judge | heisenbug | — |
| FAEST | 0 | 3 | 1 | 0.19 | heisenbug | judge | heisenbug | — |
| MQOM | 0 | 3 | 1 | 0.19 | heisenbug | judge | heisenbug | — |
| qTESLA | 0 | 3 | 1 | 0.19 | race | judge | race | — |
| LUOV | 0 | 6 | 0 | 0.19 | race | judge | race | — |
| GLP | 0 | 5 | 0 | 0.17 | heisenbug | judge | heisenbug | — |
| pqsigRM | 0 | 5 | 0 | 0.17 | heisenbug | judge | heisenbug | — |
| RYDE | 0 | 2 | 1 | 0.16 | heisenbug | judge | heisenbug | — |
| Biscuit | 0 | 4 | 0 | 0.15 | heisenbug | judge | heisenbug | — |
| Mirath | 0 | 1 | 1 | 0.12 | heisenbug | judge | heisenbug | — |
| Lamport signature | 0 | 1 | 1 | 0.12 | leak | judge | leak | — |
| SDitH | 0 | 2 | 0 | 0.11 | heisenbug | judge | heisenbug | — |
| FuLeeca | 0 | 2 | 0 | 0.11 | heisenbug | judge | heisenbug | — |
| SOFIA | 0 | 2 | 0 | 0.11 | heisenbug | judge | heisenbug | — |
| XMSS-MT | 0 | 1 | 0 | 0.07 | race | judge | race | — |
| EagleSign | 0 | 1 | 0 | 0.07 | heisenbug | judge | heisenbug | — |
| GeMSS | 0 | 0 | 1 | 0.06 | race | judge | race | — |
| MQDSS | 0 | 0 | 1 | 0.06 | race | judge | race | — |
| HuFu ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| DME-Sign ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Gravity-SPHINCS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): CROSS (counts said off-by-one, now heisenbug), SPHINCS (counts said npe, now race), LESS (counts said off-by-one, now race), Wave (counts said npe, now race)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

