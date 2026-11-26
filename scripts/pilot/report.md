# Pilot scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

## lock

57 candidates; 9 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | sample tier |
|---|---|---|---|---|---|---|---|---|
| mutex | 525 | 88 | 68 | 1.00 | off-by-one | counts | off-by-one | off-by-one |
| semaphore | 132 | 126 | 31 | 0.96 | off-by-one | counts | off-by-one | off-by-one |
| RCU | 1756 | 41 | 33 | 0.95 | womm | pin | — | womm |
| spinlock | 617 | 65 | 20 | 0.94 | off-by-one | counts | off-by-one | off-by-one |
| read-write lock | 83 | 33 | 13 | 0.77 | npe | counts | npe | npe |
| two-phase locking | 0 | 74 | 15 | 0.72 | npe | counts | leak | leak ≠ |
| distributed lock | 5 | 28 | 13 | 0.67 | npe | counts | npe | — |
| shared lock | 35 | 22 | 5 | 0.61 | npe | counts | npe | — |
| exclusive lock | 11 | 7 | 11 | 0.56 | leak | counts | npe | — |
| bakery lock | 2 | 20 | 6 | 0.54 | leak | counts | leak | race ≠ |
| recursive mutex | 10 | 7 | 8 | 0.52 | leak | counts | npe | npe ≠ |
| futex | 131 | 8 | 3 | 0.52 | leak | counts | leak | leak |
| MCS lock | 3 | 4 | 9 | 0.46 | race | judge | race | race |
| queue lock | 13 | 6 | 4 | 0.45 | leak | counts | leak | — |
| adaptive mutex | 0 | 13 | 3 | 0.40 | leak | counts | leak | — |
| seqlock | 86 | 2 | 3 | 0.40 | leak | counts | race | leak |
| Peterson lock | 0 | 4 | 6 | 0.37 | leak | judge | leak | race ≠ |
| optimistic lock | 0 | 6 | 3 | 0.34 | npe | judge | npe | leak ≠ |
| ticket lock | 0 | 4 | 4 | 0.33 | leak | judge | leak | leak |
| CNA lock | 0 | 5 | 3 | 0.33 | heisenbug | judge | heisenbug | heisenbug |
| local lock ⚠ counts said leak | 75 | 2 | 1 | 0.32 | heisenbug | judge (override) | heisenbug | — |
| file lock ⚠ counts said race | 29 | 3 | 1 | 0.32 | npe | judge (override) | npe | — |
| biased lock | 0 | 8 | 1 | 0.28 | race | judge | race | — |
| Hemlock | 0 | 4 | 2 | 0.28 | heisenbug | judge | heisenbug | — |
| Dekker's algorithm | 0 | 3 | 1 | 0.21 | leak | judge | leak | — |
| CLH lock | 0 | 1 | 2 | 0.19 | race | judge | race | race |
| pessimistic lock | 0 | 1 | 2 | 0.19 | npe | judge | npe | — |
| lock cohorting | 0 | 2 | 1 | 0.18 | heisenbug | judge | heisenbug | — |
| HMCS lock | 0 | 2 | 1 | 0.18 | heisenbug | judge | heisenbug | heisenbug |
| Malthusian lock | 0 | 2 | 1 | 0.18 | heisenbug | judge | heisenbug | — |
| reciprocating lock | 0 | 2 | 1 | 0.18 | heisenbug | judge | heisenbug | — |
| fissile lock | 0 | 2 | 1 | 0.18 | bitflip | pin | — | bitflip |
| qspinlock | 2 | 0 | 2 | 0.16 | race | judge | race | race |
| rt mutex | 70 | 0 | 0 | 0.14 | heisenbug | counts | race | — |
| rw semaphore | 41 | 0 | 0 | 0.12 | heisenbug | counts | race | — |
| ww mutex | 31 | 0 | 0 | 0.11 | heisenbug | counts | heisenbug | — |
| filter lock | 1 | 0 | 1 | 0.10 | race | judge | race | — |
| thin lock | 0 | 2 | 0 | 0.10 | heisenbug | judge | heisenbug | — |
| advisory lock | 2 | 1 | 0 | 0.10 | leak | judge | leak | — |
| test-and-set lock | 0 | 0 | 1 | 0.08 | npe | judge | npe | — |
| test-and-test-and-set lock | 0 | 0 | 1 | 0.08 | leak | judge | leak | — |
| Redlock | 0 | 0 | 1 | 0.08 | race | judge | race | — |
| percpu rwsem | 8 | 0 | 0 | 0.07 | heisenbug | judge | heisenbug | — |
| backoff lock | 0 | 1 | 0 | 0.06 | leak | judge | leak | — |
| hierarchical backoff lock | 0 | 1 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| partitioned ticket lock | 0 | 1 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| row-level lock | 0 | 1 | 0 | 0.06 | npe | judge | npe | — |
| big kernel lock | 2 | 0 | 0 | 0.04 | race | judge | race | race |
| brlock | 2 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| qrwlock | 1 | 0 | 0 | 0.02 | heisenbug | judge | heisenbug | — |
| Anderson lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| shuffle lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | heisenbug |
| TWA lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| intention lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| table lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| lglock ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| osq lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): file lock (counts said race, now npe), local lock (counts said leak, now heisenbug)

In the sample but not the pilot: lock cohort

## data-structure

88 candidates; 6 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | sample tier |
|---|---|---|---|---|---|---|---|---|
| array | 1656 | 34589 | 11019 | 1.00 | off-by-one | counts | off-by-one | off-by-one |
| stack | 1112 | 12660 | 10257 | 1.00 | off-by-one | counts | off-by-one | off-by-one |
| queue | 1842 | 13105 | 3806 | 0.96 | off-by-one | counts | off-by-one | off-by-one |
| graph | 214 | 206666 | 90723 | 0.95 | off-by-one | counts | off-by-one | — |
| hash table | 139 | 9920 | 4982 | 0.90 | off-by-one | counts | off-by-one | off-by-one |
| heap | 159 | 1228 | 663 | 0.73 | npe | counts | npe | npe |
| bit array | 455 | 839 | 413 | 0.72 | npe | counts | npe | — |
| bloom filter | 26 | 1149 | 321 | 0.64 | womm | pin | — | womm |
| trie | 36 | 499 | 339 | 0.62 | npe | counts | npe | npe |
| binary tree | 2 | 1116 | 596 | 0.60 | npe | counts | off-by-one | off-by-one ≠ |
| priority queue | 8 | 743 | 234 | 0.58 | npe | counts | npe | — |
| B-tree | 14 | 639 | 188 | 0.58 | npe | counts | npe | npe |
| B+ tree | 14 | 639 | 188 | 0.58 | npe | counts | leak | — |
| linked list | 112 | 186 | 143 | 0.57 | npe | counts | off-by-one | off-by-one ≠ |
| Merkle tree | 53 | 268 | 157 | 0.57 | npe | counts | leak | — |
| disjoint-set | 20 | 183 | 341 | 0.56 | leak | counts | leak | — |
| octree | 0 | 717 | 387 | 0.54 | leak | counts | race | — |
| binary search tree | 5 | 393 | 202 | 0.53 | leak | counts | npe | — |
| adjacency matrix | 0 | 201 | 1179 | 0.53 | leak | counts | npe | — |
| quadtree | 0 | 910 | 205 | 0.52 | leak | counts | leak | — |
| ring buffer | 331 | 46 | 40 | 0.49 | leak | counts | npe | — |
| suffix tree | 0 | 461 | 185 | 0.49 | leak | counts | leak | — |
| k-d tree | 0 | 333 | 212 | 0.48 | leak | counts | leak | — |
| red-black tree | 83 | 67 | 41 | 0.47 | leak | counts | npe | npe ≠ |
| suffix array | 0 | 339 | 144 | 0.46 | leak | counts | race | — |
| LSM tree | 1 | 292 | 83 | 0.45 | leak | counts | race | — |
| R-tree | 0 | 367 | 89 | 0.44 | leak | counts | race | — |
| skip list | 4 | 129 | 71 | 0.44 | leak | counts | leak | leak |
| radix tree | 28 | 63 | 34 | 0.43 | leak | counts | leak | race ≠ |
| cuckoo hash table | 0 | 113 | 70 | 0.38 | leak | counts | race | — |
| interval tree | 27 | 30 | 20 | 0.37 | leak | counts | race | — |
| wavelet tree ⚠ counts said leak | 0 | 135 | 43 | 0.37 | heisenbug | judge (override) | heisenbug | — |
| AVL tree | 3 | 67 | 28 | 0.36 | leak | counts | leak | leak |
| cuckoo filter | 0 | 139 | 34 | 0.36 | leak | counts | race | — |
| segment tree | 0 | 72 | 57 | 0.36 | leak | counts | leak | leak |
| adjacency list | 0 | 32 | 115 | 0.35 | leak | counts | npe | — |
| deque | 0 | 85 | 32 | 0.34 | leak | counts | npe | — |
| count-min sketch | 0 | 49 | 53 | 0.34 | leak | counts | race | — |
| splay tree | 0 | 44 | 49 | 0.33 | leak | counts | leak | — |
| doubly linked list | 8 | 18 | 26 | 0.33 | leak | counts | npe | — |
| DAWG | 0 | 63 | 34 | 0.33 | leak | counts | race | — |
| HyperLogLog | 0 | 40 | 47 | 0.32 | leak | counts | race | — |
| Cartesian tree | 0 | 43 | 25 | 0.30 | race | counts | race | — |
| XArray | 62 | 7 | 6 | 0.29 | race | counts | heisenbug | heisenbug ≠ |
| Fibonacci heap | 0 | 21 | 27 | 0.27 | race | counts | leak | — |
| treap | 0 | 20 | 21 | 0.26 | race | counts | race | — |
| pairing heap | 0 | 29 | 14 | 0.26 | race | counts | race | — |
| top tree | 0 | 19 | 17 | 0.25 | race | counts | heisenbug | — |
| B-epsilon tree | 0 | 25 | 10 | 0.24 | race | counts | heisenbug | — |
| quotient filter | 0 | 18 | 13 | 0.24 | race | counts | heisenbug | — |
| zipper | 0 | 127 | 1 | 0.23 | race | counts | race | — |
| Fenwick tree | 0 | 9 | 17 | 0.22 | race | counts | race | race |
| fusion tree | 0 | 21 | 7 | 0.22 | bitflip | pin | — | bitflip |
| 2-3 tree | 0 | 24 | 6 | 0.22 | race | counts | leak | — |
| link-cut tree | 0 | 7 | 13 | 0.20 | heisenbug | counts | heisenbug | — |
| sparse table | 0 | 13 | 6 | 0.20 | heisenbug | counts | race | — |
| van Emde Boas tree | 0 | 12 | 6 | 0.19 | heisenbug | counts | heisenbug | heisenbug |
| soft heap | 0 | 8 | 8 | 0.19 | heisenbug | judge | heisenbug | — |
| binomial heap | 0 | 9 | 6 | 0.18 | race | judge | race | — |
| xor filter | 0 | 9 | 6 | 0.18 | heisenbug | judge | heisenbug | — |
| Euler tour tree | 0 | 5 | 9 | 0.18 | heisenbug | judge | heisenbug | — |
| hlist | 53 | 0 | 3 | 0.17 | heisenbug | counts | heisenbug | — |
| min-max heap | 0 | 11 | 3 | 0.16 | heisenbug | counts | race | — |
| finger tree | 0 | 7 | 4 | 0.16 | race | judge | race | — |
| maple tree | 29 | 1 | 1 | 0.16 | heisenbug | counts | heisenbug | heisenbug |
| adaptive radix tree | 0 | 18 | 1 | 0.15 | heisenbug | counts | race | — |
| skew heap | 0 | 8 | 2 | 0.14 | heisenbug | judge | heisenbug | — |
| leftist heap | 0 | 4 | 3 | 0.13 | race | judge | race | — |
| plist | 0 | 3 | 2 | 0.11 | heisenbug | judge | heisenbug | — |
| Bw-tree | 0 | 4 | 1 | 0.10 | heisenbug | judge | heisenbug | — |
| d-ary heap | 0 | 1 | 2 | 0.08 | race | judge | race | — |
| BK-tree | 0 | 1 | 2 | 0.08 | heisenbug | judge | heisenbug | — |
| order-statistic tree | 0 | 0 | 3 | 0.06 | race | judge | race | — |
| RRB vector | 0 | 3 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| kfifo | 5 | 0 | 0 | 0.05 | heisenbug | judge | heisenbug | — |
| Brodal queue | 0 | 0 | 2 | 0.05 | heisenbug | judge | heisenbug | — |
| radix heap | 0 | 0 | 2 | 0.05 | heisenbug | judge | heisenbug | — |
| scapegoat tree | 0 | 2 | 0 | 0.05 | heisenbug | judge | heisenbug | — |
| unrolled linked list | 0 | 2 | 0 | 0.05 | race | judge | race | — |
| IDR | 3 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| hash array mapped trie | 0 | 0 | 1 | 0.03 | race | judge | race | heisenbug ≠ |
| rope | 0 | 1 | 0 | 0.03 | race | judge | race | race |
| 2-3-4 tree | 0 | 1 | 0 | 0.03 | race | judge | race | — |
| CHAMP ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| gap buffer ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| piece table ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Judy array ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| XOR linked list ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): wavelet tree (counts said leak, now heisenbug)

In the sample but not the pilot: none

