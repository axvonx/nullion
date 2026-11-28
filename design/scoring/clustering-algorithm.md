# Scoring: clustering-algorithm (Name a clustering algorithm)

50 answers (Bit Flip and Works on my machine left out); 0 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (2%) | 1 | 0 |
| npe | 7 (14%) | 7 | 0 |
| leak | 1 (2%) | 1 | 0 |
| race | 1 (2%) | 1 | 0 |
| heisenbug | 40 (80%) | 40 | 0 |

Same tier as today: 50/50 (100%).

## Off-by-one (1)

k-means 5.2 [12048c 3492q 0f 0s]

## Null pointer exception (7)

DBSCAN 3.4 [3396c 550q 0f 0s], k-means++ 3.3 [1054c 0q 0f 0s], hierarchical clustering 3.1 [0c 1199q 0f 0s], Gaussian mixture model 2.8 [0c 125q 0f 0s], spectral clustering 2.2 [1222c 15q 0f 0s], agglomerative clustering 2.2 [0c 0q 0f 0s], HDBSCAN 2.2 [0c 82q 0f 0s]

## Memory leak (1)

fuzzy c-means 1.9 [584c 41q 0f 0s]

## Race condition (1)

self-organizing map 1.8 [2224c 0q 0f 0s]

## Heisenbug (40)

mini-batch k-means 2.0 [0c 0q 0f 0s], single-linkage clustering 1.8 [451c 0q 0f 0s], k-medoids 1.8 [970c 0q 0f 0s], complete-linkage clustering 1.8 [431c 0q 0f 0s], kernel k-means 1.7 [0c 0q 0f 0s], Ward's method 1.6 [1188c 0q 0f 0s], X-means 1.6 [0c 7q 0f 0s], Affinity Propagation 1.5 [184c 0q 0f 0s], OPTICS 1.4 [270c 0q 0f 0s], spherical k-means 1.4 [0c 9q 0f 0s], G-means 1.4 [0c 0q 0f 0s], bisecting k-means 1.2 [0c 0q 0f 0s], density peaks clustering 1.2 [0c 0q 0f 0s], ROCK 1.2 [0c 0q 1f 0s], k-modes 1.2 [0c 5q 0f 0s], UPGMA 1.1 [842c 0q 0f 0s], Markov clustering 1.1 [0c 0q 0f 0s], canopy clustering 1.1 [34c 0q 2f 0s], DIANA 1.1 [0c 0q 1f 0s], CLARA 1.1 [0c 0q 6f 0s], biclustering 1.1 [112c 0q 0f 0s], CLIQUE 1.0 [0c 0q 0f 0s], COBWEB 0.9 [85c 0q 0f 0s], DENCLUE 0.9 [0c 0q 0f 0s], CURE 0.9 [61c 0q 1f 0s], k-prototypes 0.9 [0c 0q 0f 0s], feature agglomeration 0.8 [0c 0q 0f 0s], Elkan's k-means 0.8 [0c 0q 0f 0s], SLINK 0.8 [0c 0q 0f 0s], Leader algorithm 0.7 [0c 0q 0f 0s], CLINK 0.7 [0c 0q 0f 0s], CHAMELEON 0.7 [0c 0q 4f 0s], STING 0.6 [0c 0q 0f 0s], neural gas 0.6 [0c 0q 0f 0s], CLARANS 0.6 [0c 0q 0f 0s], SUBCLU 0.5 [13c 0q 0f 0s], PROCLUS 0.5 [0c 0q 0f 0s], Jarvis-Patrick clustering 0.5 [0c 0q 0f 0s], growing neural gas 0.5 [0c 0q 0f 0s], Chinese whispering 0.4 [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
