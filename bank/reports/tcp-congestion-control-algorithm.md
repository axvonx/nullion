# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: congestion.

## tcp-congestion-control-algorithm

19 candidates; 2 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| CUBIC | 1 | 20 | 53 | 1.00 | off-by-one | counts | off-by-one | — |
| Reno | 3 | 9 | 19 | 0.93 | off-by-one | counts | off-by-one | — |
| DCTCP | 3 | 7 | 17 | 0.88 | npe | counts | leak | — |
| BBR | 0 | 45 | 49 | 0.80 | npe | counts | npe | — |
| TCP Vegas | 0 | 16 | 2 | 0.55 | womm | pin | — | — |
| NewReno | 0 | 2 | 7 | 0.43 | leak | judge | leak | — |
| TCP Westwood | 0 | 4 | 3 | 0.41 | race | judge | race | — |
| Scalable TCP | 0 | 7 | 1 | 0.39 | race | judge | race | — |
| Illinois | 0 | 2 | 3 | 0.34 | heisenbug | judge | heisenbug | — |
| Veno | 0 | 6 | 0 | 0.27 | heisenbug | judge | heisenbug | — |
| CDG | 1 | 0 | 0 | 0.20 | bitflip | pin | — | — |
| TCP-LP | 0 | 1 | 1 | 0.19 | heisenbug | judge | heisenbug | — |
| Hybla | 0 | 0 | 3 | 0.19 | race | judge | race | — |
| YeAH | 0 | 2 | 0 | 0.16 | heisenbug | judge | heisenbug | — |
| H-TCP | 0 | 0 | 2 | 0.15 | race | judge | race | — |
| HighSpeed TCP | 0 | 1 | 0 | 0.10 | race | judge | race | — |
| TCP BIC | 0 | 0 | 1 | 0.09 | race | judge | race | — |
| TCP-NV ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CHD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): none

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

17/17 sampled answers are members (100%); 15/17 also have an acceptable tier. Not members: none.
