# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

## data-structure

89 candidates; 44 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| call graph ⚠ counts said off-by-one | 9 | 376 | 437 | 0.91 | leak | judge (override) | leak | — |
| directed acyclic graph | 1 | 686 | 1816 | 0.84 | npe | counts | npe | — |
| page table | 469 | 112 | 104 | 0.82 | npe | counts | npe | — |
| control flow graph | 0 | 845 | 533 | 0.80 | npe | counts | leak | — |
| GIN ⚠ counts said npe | 17 | 110 | 134 | 0.78 | heisenbug | judge (override) | heisenbug | — |
| abstract syntax tree | 0 | 233 | 604 | 0.77 | npe | counts | npe | — |
| inverted index | 0 | 220 | 196 | 0.70 | npe | counts | leak | — |
| access control list | 16 | 48 | 31 | 0.63 | npe | counts | npe | — |
| combining tree ⚠ counts said npe | 21 | 33 | 32 | 0.62 | heisenbug | judge (override) | heisenbug | — |
| symbol table | 24 | 24 | 18 | 0.57 | npe | counts | npe | — |
| auxiliary vector ⚠ counts said leak | 25 | 19 | 18 | 0.56 | heisenbug | judge (override) | heisenbug | — |
| virtual table | 10 | 27 | 10 | 0.50 | leak | counts | leak | — |
| dominator tree | 0 | 66 | 23 | 0.49 | leak | counts | race | — |
| free list | 18 | 18 | 7 | 0.48 | leak | counts | leak | — |
| visibility map | 0 | 47 | 28 | 0.48 | leak | counts | race | — |
| translation lookaside buffer | 3 | 24 | 15 | 0.47 | leak | counts | leak | — |
| rax | 22 | 10 | 6 | 0.45 | leak | counts | race | — |
| partition table | 26 | 13 | 3 | 0.44 | leak | counts | npe | — |
| min_heap | 47 | 3 | 5 | 0.41 | leak | counts | race | — |
| socket buffer | 26 | 7 | 3 | 0.40 | leak | counts | race | — |
| BRIN ⚠ counts said leak | 0 | 15 | 14 | 0.36 | heisenbug | judge (override) | heisenbug | — |
| posting list ⚠ counts said leak | 0 | 11 | 18 | 0.36 | heisenbug | judge (override) | heisenbug | — |
| jump table | 4 | 6 | 6 | 0.34 | leak | judge | leak | — |
| process table | 5 | 2 | 9 | 0.31 | leak | judge | leak | — |
| device queue | 25 | 1 | 3 | 0.30 | race | counts | heisenbug | — |
| shadow page table | 8 | 4 | 2 | 0.29 | race | judge | race | — |
| extended page table | 4 | 3 | 5 | 0.29 | race | judge | race | — |
| generalized search tree | 0 | 13 | 4 | 0.28 | race | counts | race | — |
| roaring bitmap | 0 | 9 | 4 | 0.26 | leak | judge | leak | — |
| scatter-gather list | 38 | 0 | 1 | 0.23 | race | counts | leak | — |
| free space map | 0 | 4 | 4 | 0.21 | race | judge | race | — |
| string table | 4 | 2 | 1 | 0.20 | leak | judge | leak | — |
| ACPI table | 118 | 0 | 0 | 0.20 | heisenbug | counts | heisenbug | — |
| concurrent skip list | 0 | 4 | 3 | 0.20 | race | judge | race | — |
| assoc_array | 36 | 0 | 0 | 0.19 | heisenbug | counts | heisenbug | — |
| PRD table | 25 | 0 | 0 | 0.17 | heisenbug | counts | heisenbug | — |
| folio_queue | 23 | 0 | 0 | 0.16 | heisenbug | counts | race | — |
| file descriptor table | 9 | 0 | 1 | 0.16 | race | judge | race | — |
| interrupt descriptor table | 2 | 1 | 1 | 0.15 | leak | judge | leak | — |
| block translation table | 6 | 0 | 1 | 0.14 | heisenbug | judge | heisenbug | — |
| LPM trie | 15 | 0 | 0 | 0.14 | heisenbug | counts | race | — |
| generic radix tree | 9 | 0 | 0 | 0.12 | heisenbug | judge | heisenbug | — |
| e820 table | 8 | 0 | 0 | 0.11 | heisenbug | judge | heisenbug | — |
| fib_trie | 2 | 0 | 1 | 0.10 | heisenbug | judge | heisenbug | — |
| write-intent bitmap | 6 | 0 | 0 | 0.10 | heisenbug | judge | heisenbug | — |
| kvstore | 0 | 1 | 1 | 0.09 | heisenbug | judge | heisenbug | — |
| Treiber stack | 0 | 0 | 2 | 0.07 | race | judge | race | — |
| memory descriptor list | 2 | 0 | 0 | 0.06 | race | judge | race | — |
| IntervalMap | 0 | 1 | 0 | 0.05 | heisenbug | judge | heisenbug | — |
| CLH queue | 0 | 1 | 0 | 0.05 | heisenbug | judge | heisenbug | — |
| Swiss table | 0 | 0 | 1 | 0.04 | leak | judge | leak | — |
| sbitmap ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SLRU ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| buf_ring ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| lookaside list ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| SLIST ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| cancel-safe IRP queue ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SmallVector ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| DenseMap ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| DenseSet ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| SmallPtrSet ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| SetVector ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MapVector ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| SparseSet ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| SparseMultiSet ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SparseBitVector ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CoalescingBitVector ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SmallBitVector ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FoldingSet ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ImmutableMap ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ImmutableSet ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| global offset table ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| F14 hash table ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| AtomicHashMap ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| concurrent B-skip list ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| bounded MPMC queue ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ProducerConsumerQueue ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| EvictingCacheMap ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| intrusive heap ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| listpack ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| quicklist ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ebuckets ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SpinedBuffer ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ChainMap ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| LinkedHashMap ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| IdentityHashMap ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CopyOnWriteArrayList ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ziplist ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| intset ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): auxiliary vector (counts said leak, now heisenbug), combining tree (counts said npe, now heisenbug), posting list (counts said leak, now heisenbug), GIN (counts said npe, now heisenbug), BRIN (counts said leak, now heisenbug), call graph (counts said off-by-one, now leak)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: 2-3 tree, 2-3-4 tree, adaptive radix tree, adjacency list, adjacency matrix, array, avl tree, b+ tree, b-epsilon tree, b-tree, binary search tree, binary tree, binomial heap, bit array, bk-tree, bloom filter, brodal queue, bw-tree, cartesian tree, champ, count-min sketch, cuckoo filter, cuckoo hash table, d-ary heap, dawg, deque, disjoint-set, doubly linked list, euler tour tree, fenwick tree, fibonacci heap, finger tree, fusion tree, gap buffer, graph, hash array mapped trie, hash table, heap, hlist, hyperloglog, idr, interval tree, judy array, k-d tree, kfifo, leftist heap, link-cut tree, linked list, lsm tree, maple tree, merkle tree, min-max heap, octree, order-statistic tree, pairing heap, piece table, plist, priority queue, quadtree, queue, quotient filter, r-tree, radix heap, radix tree, red-black tree, ring buffer, rope, rrb vector, scapegoat tree, segment tree, skew heap, skip list, soft heap, sparse table, splay tree, stack, suffix array, suffix tree, top tree, treap, trie, unrolled linked list, van emde boas tree, wavelet tree, xarray, xor filter, xor linked list, zipper

