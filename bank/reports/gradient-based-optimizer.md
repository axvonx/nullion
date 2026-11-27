# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: optimizer, gradient.

## gradient-based-optimizer

49 candidates; 7 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| SGD | 0 | 1515 | 4903 | 0.80 | npe | counts | off-by-one | — |
| natural gradient ⚠ counts said npe | 0 | 404 | 444 | 0.80 | race | judge (override) | race | — |
| Adam | 0 | 242 | 1467 | 0.79 | npe | counts | off-by-one | — |
| Lion | 0 | 273 | 124 | 0.72 | womm | pin | — | — |
| BFGS | 0 | 112 | 269 | 0.70 | npe | counts | leak | — |
| Muon ⚠ counts said npe | 0 | 57 | 440 | 0.69 | race | judge (override) | race | — |
| Lookahead ⚠ counts said npe | 0 | 59 | 271 | 0.66 | race | judge (override) | race | — |
| AdamW | 0 | 18 | 426 | 0.61 | npe | counts | off-by-one | — |
| L-BFGS | 0 | 39 | 167 | 0.60 | npe | counts | npe | — |
| nonlinear conjugate gradient | 0 | 90 | 50 | 0.58 | npe | counts | leak | — |
| Adagrad | 0 | 19 | 220 | 0.57 | npe | counts | npe | — |
| ASGD | 0 | 26 | 87 | 0.53 | leak | counts | race | — |
| RMSProp ⚠ counts said leak | 0 | 12 | 155 | 0.51 | off-by-one | judge (override) | off-by-one | — |
| FTRL | 0 | 8 | 157 | 0.49 | leak | counts | race | — |
| SOAP ⚠ counts said leak | 0 | 17 | 63 | 0.48 | heisenbug | judge (override) | heisenbug | — |
| Nesterov accelerated gradient | 0 | 17 | 45 | 0.46 | leak | counts | leak | — |
| momentum SGD | 0 | 12 | 61 | 0.45 | leak | counts | npe | — |
| signSGD | 0 | 8 | 64 | 0.43 | leak | counts | race | — |
| Apollo ⚠ counts said leak | 0 | 11 | 42 | 0.42 | heisenbug | judge (override) | heisenbug | — |
| Hessian-free optimization | 0 | 22 | 13 | 0.40 | leak | counts | race | — |
| LAMB | 0 | 10 | 29 | 0.39 | leak | counts | leak | — |
| Shampoo | 0 | 4 | 69 | 0.39 | bitflip | pin | — | — |
| AdaBelief | 0 | 10 | 24 | 0.38 | leak | counts | race | — |
| AMSGrad | 0 | 2 | 71 | 0.36 | leak | counts | leak | — |
| LARS | 0 | 4 | 35 | 0.35 | leak | counts | race | — |
| K-FAC | 0 | 2 | 51 | 0.34 | leak | counts | race | — |
| Sophia | 0 | 7 | 16 | 0.33 | leak | counts | race | — |
| Adadelta | 0 | 3 | 35 | 0.33 | leak | counts | npe | — |
| AdaBound | 0 | 6 | 14 | 0.32 | race | counts | race | — |
| NAdam | 0 | 4 | 18 | 0.31 | race | counts | leak | — |
| Ranger | 0 | 2 | 14 | 0.26 | race | counts | race | — |
| diffGrad | 0 | 5 | 5 | 0.25 | heisenbug | judge | heisenbug | — |
| Adamax | 0 | 1 | 17 | 0.24 | race | counts | leak | — |
| Adafactor | 0 | 1 | 17 | 0.24 | race | counts | leak | — |
| RAdam | 0 | 1 | 16 | 0.24 | race | counts | leak | — |
| Rprop | 0 | 3 | 7 | 0.24 | race | judge | race | — |
| Adan | 0 | 2 | 9 | 0.23 | heisenbug | judge | heisenbug | — |
| AdaHessian | 0 | 3 | 6 | 0.23 | heisenbug | judge | heisenbug | — |
| D-Adaptation | 0 | 2 | 8 | 0.22 | heisenbug | judge | heisenbug | — |
| AdaGrad-Norm | 0 | 0 | 15 | 0.18 | heisenbug | counts | heisenbug | — |
| Prodigy | 0 | 0 | 10 | 0.16 | heisenbug | counts | heisenbug | — |
| Yogi | 0 | 1 | 2 | 0.12 | race | judge | race | — |
| Adam-mini | 0 | 0 | 5 | 0.12 | heisenbug | judge | heisenbug | — |
| Schedule-Free AdamW | 0 | 0 | 4 | 0.11 | heisenbug | judge | heisenbug | — |
| QHAdam | 0 | 0 | 2 | 0.07 | heisenbug | judge | heisenbug | — |
| Novograd | 0 | 0 | 2 | 0.07 | heisenbug | judge | heisenbug | — |
| Madgrad | 0 | 0 | 1 | 0.05 | heisenbug | judge | heisenbug | — |
| Fromage | 0 | 0 | 1 | 0.05 | heisenbug | judge | heisenbug | — |
| SparseAdam ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): RMSProp (counts said leak, now off-by-one), Muon (counts said npe, now race), Lookahead (counts said npe, now race), SOAP (counts said leak, now heisenbug), natural gradient (counts said npe, now race), Apollo (counts said leak, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

20/20 sampled answers are members (100%); 20/20 also have an acceptable tier. Not members: none.
