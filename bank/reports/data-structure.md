# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

## data-structure

88 candidates; 6 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| array | 1656 | 34589 | 11019 | 1.00 | off-by-one | counts | off-by-one | off-by-one |
| stack | 1112 | 12660 | 10257 | 1.00 | off-by-one | counts | off-by-one | off-by-one |
| queue | 1842 | 13105 | 3806 | 0.96 | off-by-one | counts | off-by-one | off-by-one |
| graph | 214 | 206666 | 90723 | 0.95 | off-by-one | counts | off-by-one | off-by-one |
| hash table | 139 | 9920 | 4982 | 0.90 | off-by-one | counts | off-by-one | off-by-one |
| heap | 159 | 1228 | 663 | 0.73 | npe | counts | npe | npe |
| bit array | 455 | 839 | 413 | 0.72 | npe | counts | npe | npe |
| bloom filter | 26 | 1149 | 321 | 0.64 | womm | pin | — | womm |
| trie | 36 | 499 | 339 | 0.62 | npe | counts | npe | npe |
| binary tree | 2 | 1116 | 596 | 0.60 | npe | counts | off-by-one | npe |
| priority queue | 8 | 743 | 234 | 0.58 | npe | counts | npe | npe |
| B-tree | 14 | 639 | 188 | 0.58 | npe | counts | npe | npe |
| B+ tree | 14 | 639 | 188 | 0.58 | npe | counts | leak | npe |
| linked list | 112 | 186 | 143 | 0.57 | npe | counts | off-by-one | npe |
| Merkle tree | 53 | 268 | 157 | 0.57 | npe | counts | leak | npe |
| disjoint-set | 20 | 183 | 341 | 0.56 | leak | counts | leak | leak |
| octree | 0 | 717 | 387 | 0.54 | leak | counts | race | leak |
| binary search tree | 5 | 393 | 202 | 0.53 | leak | counts | npe | leak |
| adjacency matrix | 0 | 201 | 1179 | 0.53 | leak | counts | npe | leak |
| quadtree | 0 | 910 | 205 | 0.52 | leak | counts | leak | leak |
| ring buffer | 331 | 46 | 40 | 0.49 | leak | counts | npe | leak |
| suffix tree | 0 | 461 | 185 | 0.49 | leak | counts | leak | leak |
| k-d tree | 0 | 333 | 212 | 0.48 | leak | counts | leak | leak |
| red-black tree | 83 | 67 | 41 | 0.47 | leak | counts | npe | leak |
| suffix array | 0 | 339 | 144 | 0.46 | leak | counts | race | leak |
| LSM tree | 1 | 292 | 83 | 0.45 | leak | counts | race | leak |
| R-tree | 0 | 367 | 89 | 0.44 | leak | counts | race | leak |
| skip list | 4 | 129 | 71 | 0.44 | leak | counts | leak | leak |
| radix tree | 28 | 63 | 34 | 0.43 | leak | counts | leak | leak |
| cuckoo hash table | 0 | 113 | 70 | 0.38 | leak | counts | race | leak |
| interval tree | 27 | 30 | 20 | 0.37 | leak | counts | race | leak |
| wavelet tree ⚠ counts said leak | 0 | 135 | 43 | 0.37 | heisenbug | judge (override) | heisenbug | heisenbug |
| AVL tree | 3 | 67 | 28 | 0.36 | leak | counts | leak | leak |
| cuckoo filter | 0 | 139 | 34 | 0.36 | leak | counts | race | leak |
| segment tree | 0 | 72 | 57 | 0.36 | leak | counts | leak | leak |
| adjacency list | 0 | 32 | 115 | 0.35 | leak | counts | npe | leak |
| deque | 0 | 85 | 32 | 0.34 | leak | counts | npe | leak |
| count-min sketch | 0 | 49 | 53 | 0.34 | leak | counts | race | leak |
| splay tree | 0 | 44 | 49 | 0.33 | leak | counts | leak | leak |
| doubly linked list | 8 | 18 | 26 | 0.33 | leak | counts | npe | leak |
| DAWG | 0 | 63 | 34 | 0.33 | leak | counts | race | leak |
| HyperLogLog | 0 | 40 | 47 | 0.32 | leak | counts | race | leak |
| Cartesian tree | 0 | 43 | 25 | 0.30 | race | counts | race | race |
| XArray | 62 | 7 | 6 | 0.29 | race | counts | heisenbug | race |
| Fibonacci heap | 0 | 21 | 27 | 0.27 | race | counts | leak | race |
| treap | 0 | 20 | 21 | 0.26 | race | counts | race | race |
| pairing heap | 0 | 29 | 14 | 0.26 | race | counts | race | race |
| top tree | 0 | 19 | 17 | 0.25 | race | counts | heisenbug | race |
| B-epsilon tree | 0 | 25 | 10 | 0.24 | race | counts | heisenbug | race |
| quotient filter | 0 | 18 | 13 | 0.24 | race | counts | heisenbug | race |
| zipper | 0 | 127 | 1 | 0.23 | race | counts | race | race |
| Fenwick tree | 0 | 9 | 17 | 0.22 | race | counts | race | race |
| fusion tree | 0 | 21 | 7 | 0.22 | bitflip | pin | — | bitflip |
| 2-3 tree | 0 | 24 | 6 | 0.22 | race | counts | leak | race |
| link-cut tree | 0 | 7 | 13 | 0.20 | heisenbug | counts | heisenbug | heisenbug |
| sparse table | 0 | 13 | 6 | 0.20 | heisenbug | counts | race | heisenbug |
| van Emde Boas tree | 0 | 12 | 6 | 0.19 | heisenbug | counts | heisenbug | heisenbug |
| soft heap | 0 | 8 | 8 | 0.19 | heisenbug | judge | heisenbug | heisenbug |
| binomial heap | 0 | 9 | 6 | 0.18 | race | judge | race | race |
| xor filter | 0 | 9 | 6 | 0.18 | heisenbug | judge | heisenbug | heisenbug |
| Euler tour tree | 0 | 5 | 9 | 0.18 | heisenbug | judge | heisenbug | heisenbug |
| hlist | 53 | 0 | 3 | 0.17 | heisenbug | counts | heisenbug | heisenbug |
| min-max heap | 0 | 11 | 3 | 0.16 | heisenbug | counts | race | heisenbug |
| finger tree | 0 | 7 | 4 | 0.16 | race | judge | race | race |
| maple tree | 29 | 1 | 1 | 0.16 | heisenbug | counts | heisenbug | heisenbug |
| adaptive radix tree | 0 | 18 | 1 | 0.15 | heisenbug | counts | race | heisenbug |
| skew heap | 0 | 8 | 2 | 0.14 | heisenbug | judge | heisenbug | heisenbug |
| leftist heap | 0 | 4 | 3 | 0.13 | race | judge | race | race |
| plist | 0 | 3 | 2 | 0.11 | heisenbug | judge | heisenbug | heisenbug |
| Bw-tree | 0 | 4 | 1 | 0.10 | heisenbug | judge | heisenbug | heisenbug |
| d-ary heap | 0 | 1 | 2 | 0.08 | race | judge | race | race |
| BK-tree | 0 | 1 | 2 | 0.08 | heisenbug | judge | heisenbug | heisenbug |
| order-statistic tree | 0 | 0 | 3 | 0.06 | race | judge | race | race |
| RRB vector | 0 | 3 | 0 | 0.06 | heisenbug | judge | heisenbug | heisenbug |
| kfifo | 5 | 0 | 0 | 0.05 | heisenbug | judge | heisenbug | heisenbug |
| Brodal queue | 0 | 0 | 2 | 0.05 | heisenbug | judge | heisenbug | heisenbug |
| radix heap | 0 | 0 | 2 | 0.05 | heisenbug | judge | heisenbug | heisenbug |
| scapegoat tree | 0 | 2 | 0 | 0.05 | heisenbug | judge | heisenbug | heisenbug |
| unrolled linked list | 0 | 2 | 0 | 0.05 | race | judge | race | race |
| IDR | 3 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | heisenbug |
| hash array mapped trie | 0 | 0 | 1 | 0.03 | race | judge | race | race |
| rope | 0 | 1 | 0 | 0.03 | race | judge | race | race |
| 2-3-4 tree | 0 | 1 | 0 | 0.03 | race | judge | race | race |
| CHAMP ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | heisenbug |
| gap buffer ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | race |
| piece table ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | race |
| Judy array ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | heisenbug |
| XOR linked list ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | race |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): wavelet tree (counts said leak, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

