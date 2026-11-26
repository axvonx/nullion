# Pilot scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × log1p(count)/log1p(category max); weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}.

## lock

57 candidates; 9 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | sample tier |
|---|---|---|---|---|---|---|---|---|
| mutex | 525 | 88 | 68 | 2.35 | off-by-one | counts | off-by-one | off-by-one |
| semaphore | 132 | 126 | 31 | 2.15 | off-by-one | counts | off-by-one | off-by-one |
| RCU | 1756 | 41 | 33 | 2.10 | womm | pin | — | womm |
| spinlock | 617 | 65 | 20 | 2.01 | npe | counts | off-by-one | off-by-one ≠ |
| read-write lock | 83 | 33 | 13 | 1.65 | npe | counts | npe | npe |
| two-phase locking | 0 | 74 | 15 | 1.55 | npe | counts | leak | leak ≠ |
| distributed lock | 5 | 28 | 13 | 1.44 | leak | counts | npe | — |
| shared lock | 35 | 22 | 5 | 1.31 | leak | counts | npe | — |
| exclusive lock | 11 | 7 | 11 | 1.18 | leak | counts | npe | — |
| bakery lock | 2 | 20 | 6 | 1.16 | leak | counts | leak | race ≠ |
| recursive mutex ⚠ counts said race | 10 | 7 | 8 | 1.11 | npe | judge (override) | npe | npe |
| futex | 131 | 8 | 3 | 1.11 | race | counts | leak | leak ≠ |
| MCS lock | 3 | 4 | 9 | 0.97 | race | judge | race | race |
| queue lock | 13 | 6 | 4 | 0.96 | race | counts | leak | — |
| adaptive mutex | 0 | 13 | 3 | 0.87 | race | counts | leak | — |
| seqlock | 86 | 2 | 3 | 0.85 | heisenbug | counts | race | leak ≠ |
| Peterson lock | 0 | 4 | 6 | 0.79 | leak | judge | leak | race ≠ |
| optimistic lock | 0 | 6 | 3 | 0.73 | npe | judge | npe | leak ≠ |
| ticket lock | 0 | 4 | 4 | 0.71 | leak | judge | leak | leak |
| CNA lock | 0 | 5 | 3 | 0.70 | heisenbug | judge | heisenbug | heisenbug |
| local lock | 75 | 2 | 1 | 0.68 | heisenbug | counts | heisenbug | — |
| file lock ⚠ counts said heisenbug | 29 | 3 | 1 | 0.68 | npe | judge (override) | npe | — |
| biased lock | 0 | 8 | 1 | 0.62 | race | judge | race | — |
| Hemlock | 0 | 4 | 2 | 0.59 | heisenbug | judge | heisenbug | — |
| Dekker's algorithm | 0 | 3 | 1 | 0.45 | leak | judge | leak | — |
| CLH lock | 0 | 1 | 2 | 0.40 | race | judge | race | race |
| pessimistic lock | 0 | 1 | 2 | 0.40 | npe | judge | npe | — |
| lock cohorting | 0 | 2 | 1 | 0.39 | heisenbug | judge | heisenbug | — |
| HMCS lock | 0 | 2 | 1 | 0.39 | heisenbug | judge | heisenbug | heisenbug |
| Malthusian lock | 0 | 2 | 1 | 0.39 | heisenbug | judge | heisenbug | — |
| reciprocating lock | 0 | 2 | 1 | 0.39 | heisenbug | judge | heisenbug | — |
| fissile lock | 0 | 2 | 1 | 0.39 | bitflip | pin | — | bitflip |
| qspinlock | 2 | 0 | 2 | 0.33 | race | judge | race | race |
| rt mutex | 70 | 0 | 0 | 0.29 | heisenbug | counts | race | — |
| rw semaphore | 41 | 0 | 0 | 0.25 | heisenbug | counts | race | — |
| ww mutex | 31 | 0 | 0 | 0.23 | heisenbug | counts | heisenbug | — |
| thin lock | 0 | 2 | 0 | 0.23 | heisenbug | judge | heisenbug | — |
| advisory lock | 2 | 1 | 0 | 0.22 | leak | judge | leak | — |
| filter lock | 1 | 0 | 1 | 0.21 | race | judge | race | — |
| test-and-set lock | 0 | 0 | 1 | 0.16 | npe | judge | npe | — |
| test-and-test-and-set lock | 0 | 0 | 1 | 0.16 | leak | judge | leak | — |
| Redlock | 0 | 0 | 1 | 0.16 | race | judge | race | — |
| percpu rwsem | 8 | 0 | 0 | 0.15 | heisenbug | judge | heisenbug | — |
| backoff lock | 0 | 1 | 0 | 0.14 | leak | judge | leak | — |
| hierarchical backoff lock | 0 | 1 | 0 | 0.14 | heisenbug | judge | heisenbug | — |
| partitioned ticket lock | 0 | 1 | 0 | 0.14 | heisenbug | judge | heisenbug | — |
| row-level lock | 0 | 1 | 0 | 0.14 | npe | judge | npe | — |
| big kernel lock | 2 | 0 | 0 | 0.07 | race | judge | race | race |
| brlock | 2 | 0 | 0 | 0.07 | heisenbug | judge | heisenbug | — |
| qrwlock | 1 | 0 | 0 | 0.05 | heisenbug | judge | heisenbug | — |
| Anderson lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| shuffle lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | heisenbug |
| TWA lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| intention lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| table lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| lglock ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| osq lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): recursive mutex (counts said race, now npe), file lock (counts said heisenbug, now npe)

In the sample but not the pilot: lock cohort

## data-structure

88 candidates; 10 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | sample tier |
|---|---|---|---|---|---|---|---|---|
| graph | 214 | 206666 | 90723 | 2.36 | off-by-one | counts | off-by-one | — |
| array | 1656 | 34589 | 11019 | 2.16 | off-by-one | counts | off-by-one | off-by-one |
| stack | 1112 | 12660 | 10257 | 2.05 | off-by-one | counts | off-by-one | off-by-one |
| queue | 1842 | 13105 | 3806 | 2.00 | off-by-one | counts | off-by-one | off-by-one |
| hash table | 139 | 9920 | 4982 | 1.83 | off-by-one | counts | off-by-one | off-by-one |
| heap | 159 | 1228 | 663 | 1.49 | off-by-one | counts | npe | npe ≠ |
| bit array | 455 | 839 | 413 | 1.49 | off-by-one | counts | npe | — |
| bloom filter | 26 | 1149 | 321 | 1.30 | womm | pin | — | womm |
| trie | 36 | 499 | 339 | 1.26 | npe | counts | npe | npe |
| binary tree | 2 | 1116 | 596 | 1.21 | npe | counts | off-by-one | off-by-one ≠ |
| linked list | 112 | 186 | 143 | 1.18 | npe | counts | off-by-one | off-by-one ≠ |
| B-tree | 14 | 639 | 188 | 1.17 | npe | counts | npe | npe |
| B+ tree | 14 | 639 | 188 | 1.17 | npe | counts | leak | — |
| Merkle tree | 53 | 268 | 157 | 1.17 | npe | counts | leak | — |
| priority queue | 8 | 743 | 234 | 1.16 | npe | counts | npe | — |
| disjoint-set | 20 | 183 | 341 | 1.14 | npe | counts | leak | — |
| binary search tree | 5 | 393 | 202 | 1.07 | npe | counts | npe | — |
| octree | 0 | 717 | 387 | 1.06 | leak | counts | race | — |
| adjacency matrix | 0 | 201 | 1179 | 1.05 | leak | counts | npe | — |
| ring buffer | 331 | 46 | 40 | 1.03 | leak | counts | npe | — |
| quadtree | 0 | 910 | 205 | 1.02 | leak | counts | leak | — |
| red-black tree | 83 | 67 | 41 | 0.97 | leak | counts | npe | npe ≠ |
| suffix tree | 0 | 461 | 185 | 0.96 | leak | counts | leak | — |
| k-d tree | 0 | 333 | 212 | 0.94 | leak | counts | leak | — |
| suffix array | 0 | 339 | 144 | 0.91 | leak | counts | race | — |
| LSM tree | 1 | 292 | 83 | 0.90 | leak | counts | race | — |
| skip list | 4 | 129 | 71 | 0.88 | leak | counts | leak | leak |
| R-tree | 0 | 367 | 89 | 0.88 | leak | counts | race | — |
| radix tree | 28 | 63 | 34 | 0.88 | leak | counts | leak | race ≠ |
| interval tree | 27 | 30 | 20 | 0.77 | race | counts | race | — |
| cuckoo hash table | 0 | 113 | 70 | 0.76 | race | counts | race | — |
| wavelet tree | 0 | 135 | 43 | 0.73 | race | counts | heisenbug | — |
| AVL tree | 3 | 67 | 28 | 0.73 | race | counts | leak | leak ≠ |
| cuckoo filter | 0 | 139 | 34 | 0.72 | race | counts | race | — |
| segment tree | 0 | 72 | 57 | 0.71 | race | counts | leak | leak ≠ |
| adjacency list ⚠ counts said race | 0 | 32 | 115 | 0.70 | npe | judge (override) | npe | — |
| doubly linked list ⚠ counts said race | 8 | 18 | 26 | 0.68 | npe | judge (override) | npe | — |
| deque ⚠ counts said race | 0 | 85 | 32 | 0.67 | npe | judge (override) | npe | — |
| count-min sketch | 0 | 49 | 53 | 0.67 | race | counts | race | — |
| splay tree | 0 | 44 | 49 | 0.65 | race | counts | leak | — |
| DAWG | 0 | 63 | 34 | 0.65 | race | counts | race | — |
| HyperLogLog | 0 | 40 | 47 | 0.64 | race | counts | race | — |
| XArray | 62 | 7 | 6 | 0.62 | race | counts | heisenbug | heisenbug ≠ |
| Cartesian tree | 0 | 43 | 25 | 0.59 | heisenbug | counts | race | — |
| Fibonacci heap ⚠ counts said heisenbug | 0 | 21 | 27 | 0.54 | leak | judge (override) | leak | — |
| treap | 0 | 20 | 21 | 0.52 | heisenbug | counts | race | — |
| pairing heap | 0 | 29 | 14 | 0.52 | heisenbug | counts | race | — |
| top tree | 0 | 19 | 17 | 0.50 | heisenbug | counts | heisenbug | — |
| B-epsilon tree | 0 | 25 | 10 | 0.48 | heisenbug | counts | heisenbug | — |
| quotient filter | 0 | 18 | 13 | 0.47 | heisenbug | counts | heisenbug | — |
| zipper | 0 | 127 | 1 | 0.46 | heisenbug | counts | race | — |
| Fenwick tree | 0 | 9 | 17 | 0.44 | heisenbug | counts | race | race ≠ |
| fusion tree | 0 | 21 | 7 | 0.43 | bitflip | pin | — | bitflip |
| 2-3 tree ⚠ counts said heisenbug | 0 | 24 | 6 | 0.43 | leak | judge (override) | leak | — |
| link-cut tree | 0 | 7 | 13 | 0.40 | heisenbug | counts | heisenbug | — |
| hlist | 53 | 0 | 3 | 0.39 | heisenbug | counts | heisenbug | — |
| sparse table | 0 | 13 | 6 | 0.39 | heisenbug | counts | race | — |
| van Emde Boas tree | 0 | 12 | 6 | 0.38 | heisenbug | counts | heisenbug | heisenbug |
| soft heap | 0 | 8 | 8 | 0.37 | heisenbug | judge | heisenbug | — |
| binomial heap | 0 | 9 | 6 | 0.36 | race | judge | race | — |
| xor filter | 0 | 9 | 6 | 0.36 | heisenbug | judge | heisenbug | — |
| Euler tour tree | 0 | 5 | 9 | 0.35 | heisenbug | judge | heisenbug | — |
| maple tree | 29 | 1 | 1 | 0.34 | heisenbug | counts | heisenbug | heisenbug |
| min-max heap | 0 | 11 | 3 | 0.32 | heisenbug | counts | race | — |
| finger tree | 0 | 7 | 4 | 0.31 | race | judge | race | — |
| adaptive radix tree | 0 | 18 | 1 | 0.30 | heisenbug | counts | race | — |
| skew heap | 0 | 8 | 2 | 0.28 | heisenbug | judge | heisenbug | — |
| leftist heap | 0 | 4 | 3 | 0.25 | race | judge | race | — |
| plist | 0 | 3 | 2 | 0.21 | heisenbug | judge | heisenbug | — |
| Bw-tree | 0 | 4 | 1 | 0.19 | heisenbug | judge | heisenbug | — |
| d-ary heap | 0 | 1 | 2 | 0.15 | race | judge | race | — |
| BK-tree | 0 | 1 | 2 | 0.15 | heisenbug | judge | heisenbug | — |
| order-statistic tree | 0 | 0 | 3 | 0.12 | race | judge | race | — |
| kfifo | 5 | 0 | 0 | 0.12 | heisenbug | judge | heisenbug | — |
| RRB vector | 0 | 3 | 0 | 0.11 | heisenbug | judge | heisenbug | — |
| Brodal queue | 0 | 0 | 2 | 0.10 | heisenbug | judge | heisenbug | — |
| radix heap | 0 | 0 | 2 | 0.10 | heisenbug | judge | heisenbug | — |
| IDR | 3 | 0 | 0 | 0.09 | heisenbug | judge | heisenbug | — |
| scapegoat tree | 0 | 2 | 0 | 0.09 | heisenbug | judge | heisenbug | — |
| unrolled linked list | 0 | 2 | 0 | 0.09 | race | judge | race | — |
| hash array mapped trie | 0 | 0 | 1 | 0.06 | race | judge | race | heisenbug ≠ |
| rope | 0 | 1 | 0 | 0.06 | race | judge | race | race |
| 2-3-4 tree | 0 | 1 | 0 | 0.06 | race | judge | race | — |
| CHAMP ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| gap buffer ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| piece table ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Judy array ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| XOR linked list ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): doubly linked list (counts said race, now npe), deque (counts said race, now npe), adjacency list (counts said race, now npe), Fibonacci heap (counts said heisenbug, now leak), 2-3 tree (counts said heisenbug, now leak)

In the sample but not the pilot: none

