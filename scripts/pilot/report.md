# Pilot scoring report

Corpora: kernel, dblp. score = Σ weight × log1p(count)/log1p(category max); weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}.

## lock

57 candidates; 10 with no evidence.

| answer | kernel | dblp | score | tier | sample tier |
|---|---|---|---|---|---|
| mutex | 525 | 88 | 1.35 | off-by-one | off-by-one |
| semaphore | 132 | 126 | 1.33 | off-by-one | off-by-one |
| spinlock | 617 | 65 | 1.29 | off-by-one | off-by-one |
| RCU | 1756 | 41 | 1.27 | womm | womm |
| read-write lock | 83 | 33 | 1.02 | off-by-one | npe ≠ |
| two-phase locking | 0 | 74 | 0.89 | off-by-one | leak ≠ |
| shared lock | 35 | 22 | 0.89 | npe | — |
| distributed lock | 5 | 28 | 0.82 | npe | — |
| futex | 131 | 8 | 0.78 | npe | leak ≠ |
| bakery lock | 2 | 20 | 0.70 | npe | race ≠ |
| exclusive lock | 11 | 7 | 0.60 | npe | — |
| recursive mutex | 10 | 7 | 0.59 | npe | npe |
| queue lock | 13 | 6 | 0.58 | npe | — |
| adaptive mutex | 0 | 13 | 0.54 | leak | — |
| seqlock | 86 | 2 | 0.53 | leak | leak |
| local lock | 75 | 2 | 0.52 | leak | — |
| file lock | 29 | 3 | 0.51 | leak | — |
| biased lock | 0 | 8 | 0.45 | leak | — |
| MCS lock | 3 | 4 | 0.43 | leak | race ≠ |
| optimistic lock | 0 | 6 | 0.40 | leak | leak |
| CNA lock | 0 | 5 | 0.37 | leak | heisenbug ≠ |
| ticket lock | 0 | 4 | 0.33 | leak | leak |
| Peterson lock | 0 | 4 | 0.33 | race | race |
| Hemlock | 0 | 4 | 0.33 | race | — |
| Dekker's algorithm | 0 | 3 | 0.29 | race | — |
| rt mutex | 70 | 0 | 0.29 | race | — |
| rw semaphore | 41 | 0 | 0.25 | race | — |
| ww mutex | 31 | 0 | 0.23 | race | — |
| lock cohorting | 0 | 2 | 0.23 | race | — |
| HMCS lock | 0 | 2 | 0.23 | race | heisenbug ≠ |
| Malthusian lock | 0 | 2 | 0.23 | race | — |
| reciprocating lock | 0 | 2 | 0.23 | race | — |
| fissile lock | 0 | 2 | 0.23 | bitflip | bitflip |
| thin lock | 0 | 2 | 0.23 | heisenbug | — |
| advisory lock | 2 | 1 | 0.22 | heisenbug | — |
| percpu rwsem | 8 | 0 | 0.15 | heisenbug | — |
| CLH lock | 0 | 1 | 0.14 | heisenbug | race ≠ |
| backoff lock | 0 | 1 | 0.14 | heisenbug | — |
| hierarchical backoff lock | 0 | 1 | 0.14 | heisenbug | — |
| partitioned ticket lock | 0 | 1 | 0.14 | heisenbug | — |
| pessimistic lock | 0 | 1 | 0.14 | heisenbug | — |
| row-level lock | 0 | 1 | 0.14 | heisenbug | — |
| qspinlock | 2 | 0 | 0.07 | heisenbug | race ≠ |
| big kernel lock | 2 | 0 | 0.07 | heisenbug | race ≠ |
| brlock | 2 | 0 | 0.07 | heisenbug | — |
| qrwlock | 1 | 0 | 0.05 | heisenbug | — |
| filter lock | 1 | 0 | 0.05 | heisenbug | — |
| test-and-set lock ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | — |
| test-and-test-and-set lock ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | — |
| Anderson lock ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | — |
| shuffle lock ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | heisenbug |
| TWA lock ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | — |
| intention lock ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | — |
| table lock ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | — |
| Redlock ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | — |
| lglock ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | — |
| osq lock ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | — |

In the sample but not the pilot: lock cohort

## data-structure

88 candidates; 9 with no evidence.

| answer | kernel | dblp | score | tier | sample tier |
|---|---|---|---|---|---|
| graph | 214 | 206666 | 1.36 | off-by-one | — |
| array | 1656 | 34589 | 1.35 | off-by-one | off-by-one |
| queue | 1842 | 13105 | 1.27 | off-by-one | off-by-one |
| stack | 1112 | 12660 | 1.24 | off-by-one | off-by-one |
| hash table | 139 | 9920 | 1.08 | off-by-one | off-by-one |
| bit array | 455 | 839 | 0.96 | off-by-one | — |
| heap | 159 | 1228 | 0.92 | off-by-one | npe ≠ |
| bloom filter | 26 | 1149 | 0.79 | womm | womm |
| trie | 36 | 499 | 0.75 | off-by-one | npe ≠ |
| linked list | 112 | 186 | 0.74 | off-by-one | off-by-one |
| Merkle tree | 53 | 268 | 0.72 | npe | — |
| B-tree | 14 | 639 | 0.71 | npe | npe |
| B+ tree | 14 | 639 | 0.71 | npe | — |
| ring buffer | 331 | 46 | 0.70 | npe | — |
| priority queue | 8 | 743 | 0.69 | npe | — |
| binary tree | 2 | 1116 | 0.65 | npe | off-by-one ≠ |
| red-black tree | 83 | 67 | 0.64 | npe | npe |
| disjoint-set | 20 | 183 | 0.63 | npe | — |
| binary search tree | 5 | 393 | 0.61 | npe | — |
| radix tree | 28 | 63 | 0.56 | npe | race ≠ |
| quadtree | 0 | 910 | 0.56 | npe | — |
| octree | 0 | 717 | 0.54 | npe | — |
| LSM tree | 1 | 292 | 0.51 | leak | — |
| skip list | 4 | 129 | 0.50 | leak | leak |
| interval tree | 27 | 30 | 0.50 | leak | — |
| suffix tree | 0 | 461 | 0.50 | leak | — |
| R-tree | 0 | 367 | 0.48 | leak | — |
| suffix array | 0 | 339 | 0.48 | leak | — |
| k-d tree | 0 | 333 | 0.47 | leak | — |
| XArray | 62 | 7 | 0.45 | leak | heisenbug ≠ |
| AVL tree | 3 | 67 | 0.44 | leak | leak |
| adjacency matrix | 0 | 201 | 0.43 | leak | — |
| cuckoo filter | 0 | 139 | 0.40 | leak | — |
| wavelet tree | 0 | 135 | 0.40 | leak | — |
| zipper | 0 | 127 | 0.40 | leak | — |
| cuckoo hash table | 0 | 113 | 0.39 | leak | — |
| doubly linked list | 8 | 18 | 0.39 | leak | — |
| deque | 0 | 85 | 0.36 | race | — |
| segment tree | 0 | 72 | 0.35 | race | leak ≠ |
| DAWG | 0 | 63 | 0.34 | race | — |
| count-min sketch | 0 | 49 | 0.32 | race | — |
| splay tree | 0 | 44 | 0.31 | race | — |
| Cartesian tree | 0 | 43 | 0.31 | race | — |
| HyperLogLog | 0 | 40 | 0.30 | race | — |
| adjacency list | 0 | 32 | 0.29 | race | — |
| maple tree | 29 | 1 | 0.28 | race | heisenbug ≠ |
| pairing heap | 0 | 29 | 0.28 | race | — |
| B-epsilon tree | 0 | 25 | 0.27 | race | — |
| hlist | 53 | 0 | 0.27 | race | — |
| 2-3 tree | 0 | 24 | 0.26 | race | — |
| Fibonacci heap | 0 | 21 | 0.25 | race | — |
| fusion tree | 0 | 21 | 0.25 | bitflip | bitflip |
| treap | 0 | 20 | 0.25 | race | — |
| top tree | 0 | 19 | 0.24 | race | — |
| quotient filter | 0 | 18 | 0.24 | race | — |
| adaptive radix tree | 0 | 18 | 0.24 | race | — |
| sparse table | 0 | 13 | 0.22 | heisenbug | — |
| van Emde Boas tree | 0 | 12 | 0.21 | heisenbug | heisenbug |
| min-max heap | 0 | 11 | 0.20 | heisenbug | — |
| Fenwick tree | 0 | 9 | 0.19 | heisenbug | race ≠ |
| binomial heap | 0 | 9 | 0.19 | heisenbug | — |
| xor filter | 0 | 9 | 0.19 | heisenbug | — |
| skew heap | 0 | 8 | 0.18 | heisenbug | — |
| soft heap | 0 | 8 | 0.18 | heisenbug | — |
| finger tree | 0 | 7 | 0.17 | heisenbug | — |
| link-cut tree | 0 | 7 | 0.17 | heisenbug | — |
| Euler tour tree | 0 | 5 | 0.15 | heisenbug | — |
| leftist heap | 0 | 4 | 0.13 | heisenbug | — |
| Bw-tree | 0 | 4 | 0.13 | heisenbug | — |
| kfifo | 5 | 0 | 0.12 | heisenbug | — |
| RRB vector | 0 | 3 | 0.11 | heisenbug | — |
| plist | 0 | 3 | 0.11 | heisenbug | — |
| IDR | 3 | 0 | 0.09 | heisenbug | — |
| scapegoat tree | 0 | 2 | 0.09 | heisenbug | — |
| unrolled linked list | 0 | 2 | 0.09 | heisenbug | — |
| rope | 0 | 1 | 0.06 | heisenbug | race ≠ |
| d-ary heap | 0 | 1 | 0.06 | heisenbug | — |
| 2-3-4 tree | 0 | 1 | 0.06 | heisenbug | — |
| BK-tree | 0 | 1 | 0.06 | heisenbug | — |
| Brodal queue ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | — |
| hash array mapped trie ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | heisenbug |
| CHAMP ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | — |
| gap buffer ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | — |
| piece table ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | — |
| Judy array ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | — |
| XOR linked list ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | — |
| order-statistic tree ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | — |
| radix heap ⚠ no evidence | 0 | 0 | 0.00 | heisenbug | — |

In the sample but not the pilot: none

