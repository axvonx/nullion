# Scoring: clustering-algorithm (Name a clustering algorithm)

50 answers (Bit Flip and Works on my machine left out); 0 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (2%) | 1 | 0 |
| npe | 7 (14%) | 7 | 0 |
| leak | 7 (14%) | 6 | 0 |
| race | 0 (0%) | 1 | 0 |
| heisenbug | 35 (70%) | 35 | 0 |

Same tier as today: 49/50 (98%).

## Off-by-one (1)

k-means 5.2 [12048c 3492q 0f]

## Null pointer exception (7)

DBSCAN 3.4 [3396c 550q 0f], k-means++ 3.3 [1054c 0q 0f], hierarchical clustering 3.1 [3077c 1199q 0f], Gaussian mixture model 2.8 [2700c 199q 4f], spectral clustering 2.2 [1222c 15q 0f], agglomerative clustering 2.2 [3077c 0q 0f], HDBSCAN 2.2 [0c 82q 0f]

## Memory leak (7)

fuzzy c-means 1.9 [584c 12939q 1f], self-organizing map 1.8 [2224c 187q 0f], k-medoids 1.8 [970c 2094q 40f], Affinity Propagation 1.5 [184c 187q 2f], canopy clustering 1.1 [34c 529q 2f], CLIQUE 1.0 [0c 95q 0f], CHAMELEON 0.7 [0c 120q 4f]

## Race condition (0)



## Heisenbug (35)

mini-batch k-means 2.0 [0c 0q 0f], single-linkage clustering 1.8 [451c 0q 0f], complete-linkage clustering 1.8 [431c 0q 0f], kernel k-means 1.7 [0c 0q 0f], Ward's method 1.6 [1188c 0q 0f], X-means 1.6 [0c 7q 0f], OPTICS 1.4 [270c 0q 0f], spherical k-means 1.4 [0c 9q 0f], G-means 1.4 [0c 0q 0f], bisecting k-means 1.2 [0c 0q 0f], density peaks clustering 1.2 [0c 0q 0f], ROCK 1.2 [0c 0q 1f], k-modes 1.2 [0c 5q 0f], UPGMA 1.1 [842c 0q 0f], Markov clustering 1.1 [0c 14q 0f], DIANA 1.1 [0c 0q 1f], CLARA 1.1 [0c 0q 6f], biclustering 1.1 [112c 0q 0f], COBWEB 0.9 [85c 0q 0f], DENCLUE 0.9 [0c 0q 0f], CURE 0.9 [61c 0q 1f], k-prototypes 0.9 [0c 0q 0f], feature agglomeration 0.8 [0c 0q 0f], Elkan's k-means 0.8 [0c 0q 0f], SLINK 0.8 [0c 0q 0f], Leader algorithm 0.7 [0c 0q 0f], CLINK 0.7 [0c 17q 0f], STING 0.6 [0c 0q 0f], neural gas 0.6 [262c 0q 0f], CLARANS 0.6 [0c 0q 0f], SUBCLU 0.5 [13c 0q 0f], PROCLUS 0.5 [0c 0q 0f], Jarvis-Patrick clustering 0.5 [0c 0q 0f], growing neural gas 0.5 [262c 0q 0f], Chinese whispering 0.4 [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
