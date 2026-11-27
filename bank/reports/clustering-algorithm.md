# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: clustering.

## clustering-algorithm

52 candidates; 9 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| k-means | 0 | 3134 | 2532 | 0.80 | npe | counts | off-by-one | — |
| hierarchical clustering | 0 | 2217 | 979 | 0.80 | npe | counts | npe | — |
| k-means++ | 0 | 3131 | 2520 | 0.80 | npe | counts | leak | — |
| spectral clustering | 0 | 1894 | 946 | 0.79 | npe | counts | npe | — |
| fuzzy c-means | 0 | 1162 | 164 | 0.66 | npe | counts | leak | — |
| biclustering ⚠ counts said npe | 0 | 685 | 174 | 0.64 | race | judge (override) | race | — |
| agglomerative clustering | 0 | 377 | 284 | 0.64 | npe | counts | off-by-one | — |
| Gaussian mixture model | 0 | 192 | 415 | 0.62 | npe | counts | npe | — |
| DBSCAN | 0 | 234 | 288 | 0.61 | npe | counts | off-by-one | — |
| OPTICS ⚠ counts said npe | 1 | 212 | 258 | 0.60 | race | judge (override) | race | — |
| self-organizing map | 0 | 369 | 120 | 0.59 | npe | counts | leak | — |
| CLIQUE ⚠ counts said leak | 0 | 80 | 244 | 0.55 | heisenbug | judge (override) | heisenbug | — |
| k-medoids | 0 | 163 | 127 | 0.55 | leak | counts | leak | — |
| Mean Shift | 0 | 160 | 98 | 0.53 | womm | pin | — | — |
| Affinity Propagation | 0 | 223 | 55 | 0.51 | leak | counts | leak | — |
| density peaks clustering ⚠ counts said leak | 0 | 400 | 29 | 0.51 | heisenbug | judge (override) | heisenbug | — |
| kernel k-means | 0 | 69 | 51 | 0.45 | leak | counts | race | — |
| single-linkage clustering | 0 | 38 | 71 | 0.44 | leak | counts | leak | — |
| k-modes | 0 | 80 | 26 | 0.42 | leak | counts | race | — |
| HDBSCAN | 0 | 13 | 109 | 0.41 | leak | counts | leak | — |
| ROCK ⚠ counts said leak | 0 | 43 | 27 | 0.39 | heisenbug | judge (override) | heisenbug | — |
| Markov clustering | 0 | 65 | 15 | 0.38 | leak | counts | race | — |
| BIRCH | 0 | 28 | 24 | 0.36 | bitflip | pin | — | — |
| UPGMA | 0 | 12 | 37 | 0.34 | leak | counts | race | — |
| complete-linkage clustering | 0 | 16 | 23 | 0.33 | leak | counts | leak | — |
| spherical k-means | 0 | 18 | 20 | 0.33 | leak | counts | race | — |
| neural gas ⚠ counts said leak | 0 | 47 | 8 | 0.33 | heisenbug | judge (override) | heisenbug | — |
| CHAMELEON ⚠ counts said leak | 0 | 19 | 18 | 0.33 | heisenbug | judge (override) | heisenbug | — |
| k-prototypes ⚠ counts said leak | 0 | 30 | 11 | 0.32 | heisenbug | judge (override) | heisenbug | — |
| CURE | 0 | 12 | 21 | 0.31 | race | counts | heisenbug | — |
| growing neural gas | 0 | 31 | 5 | 0.28 | race | counts | heisenbug | — |
| X-means | 0 | 11 | 10 | 0.27 | race | counts | race | — |
| bisecting k-means | 0 | 21 | 5 | 0.26 | race | counts | race | — |
| mini-batch k-means | 0 | 3 | 21 | 0.25 | race | counts | leak | — |
| G-means | 0 | 3 | 17 | 0.24 | race | counts | heisenbug | — |
| Ward's method | 0 | 4 | 12 | 0.23 | race | counts | leak | — |
| CLARA | 0 | 13 | 4 | 0.23 | race | counts | race | — |
| CLARANS | 0 | 8 | 3 | 0.19 | heisenbug | judge | heisenbug | — |
| COBWEB | 0 | 6 | 3 | 0.18 | heisenbug | judge | heisenbug | — |
| DENCLUE | 0 | 8 | 2 | 0.18 | heisenbug | judge | heisenbug | — |
| SLINK | 0 | 3 | 4 | 0.17 | heisenbug | judge | heisenbug | — |
| PROCLUS | 0 | 1 | 3 | 0.12 | heisenbug | judge | heisenbug | — |
| feature agglomeration | 0 | 0 | 3 | 0.08 | heisenbug | judge | heisenbug | — |
| CLINK | 0 | 1 | 1 | 0.08 | heisenbug | judge | heisenbug | — |
| DIANA | 0 | 0 | 2 | 0.06 | heisenbug | judge | heisenbug | — |
| canopy clustering | 0 | 2 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| Leader algorithm | 0 | 2 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| Elkan's k-means | 0 | 0 | 1 | 0.04 | heisenbug | judge | heisenbug | — |
| SUBCLU | 0 | 0 | 1 | 0.04 | heisenbug | judge | heisenbug | — |
| STING | 0 | 1 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| Jarvis-Patrick clustering | 0 | 1 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| Chinese whispering ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): OPTICS (counts said npe, now race), biclustering (counts said npe, now race), ROCK (counts said leak, now heisenbug), CHAMELEON (counts said leak, now heisenbug), CLIQUE (counts said leak, now heisenbug), k-prototypes (counts said leak, now heisenbug), neural gas (counts said leak, now heisenbug), density peaks clustering (counts said leak, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

