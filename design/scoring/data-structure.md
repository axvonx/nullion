# Scoring: data-structure (Name a data structure)

179 answers (Bit Flip and Works on my machine left out); 6 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 10 (6%) | 9 | 3 |
| npe | 25 (14%) | 19 | 13 |
| leak | 30 (17%) | 38 | 15 |
| race | 14 (8%) | 49 | 7 |
| heisenbug | 100 (56%) | 64 | 43 |

Same tier as today: 98/179 (55%).

## Off-by-one (10)

array 6.3 [0c 416718q 7f 22997s], list 5.6 [945c 141576q 0f 0s], stack 5.5 [5121c 1145q 0f 0s], tree 5.4 [4609c 16775q 0f 0s], hash table 5.3 [10652c 86118q 0f 0s], linked list 5.0 [4243c 19887q 0f 0s], queue 5.0 [2371c 15q 1f 0s], priority queue 5.0* [3256c 2628q 0f 0s], binary tree 4.8 [5623c 6805q 0f 0s], set 4.7 [946c 0q 0f 0s]

## Null pointer exception (25)

graph 4.2 [2157c 2304q 1f 0s], binary search tree 4.2 [5394c 6378q 0f 0s], tuple 4.0* [6536c 12048q 2f 0s], doubly linked list 4.0* [1351c 1832q 0f 0s], Matrix 4.0* [0c 35528q 0f 0s], heap 4.0 [0c 226q 0f 0s], B-tree 3.1 [10100c 769q 0f 0s], min-heap 3.0 [0c 184q 0f 0s], adjacency list 3.0 [1415c 660q 0f 0s], bit array 2.9 [1485c 15719q 26f 19s], max-heap 2.8 [0c 148q 0f 0s], assoc_array 2.8 [0c 0q 0f 0s], red-black tree 2.8 [8235c 1580q 1f 0s], AVL tree 2.8 [5311c 933q 1f 0s], ring buffer 2.6 [5202c 419q 1f 0s], trie 2.5 [8826c 1112q 1f 0s], deque 2.5 [1622c 1009q 0f 0s], adjacency matrix 2.5 [4131c 915q 0f 0s], B+ tree 2.5 [2957c 769q 0f 0s], symbol table 2.4 [704c 225q 0f 0s], directed acyclic graph 2.3 [11727c 0q 0f 0s], kvstore 2.3 [0c 0q 0f 0s], page table 2.1 [4190c 0q 0f 0s], abstract syntax tree 2.1 [9258c 2985q 0f 0s], virtual table 2.0 [1700c 626q 0f 0s]

## Memory leak (30)

segment tree 2.0 [2016c 271q 0f 0s], inverted index 1.9 [0c 223q 0f 0s], Merkle tree 1.9 [8506c 72q 1f 0s], LinkedHashMap 1.8 [0c 705q 0f 0s], disjoint-set 1.7 [5295c 187q 0f 0s], k-d tree 1.7 [4989c 461q 0f 0s], string table 1.7 [0c 33q 0f 0s], jump table 1.6 [694c 64q 0f 0s], partition table 1.6 [0c 247q 0f 0s], quadtree 1.5 [3881c 383q 1f 255s], control flow graph 1.5 [1843c 141q 0f 0s], splay tree 1.4 [1518c 70q 0f 0s], Fenwick tree 1.4 [3104c 76q 0f 0s], concurrent skip list 1.4 [0c 40q 0f 0s], octree 1.3 [2230c 152q 1f 0s], call graph 1.3 [603c 219q 0f 0s], radix tree 1.3 [3823c 46q 0f 0s], R-tree 1.2 [2944c 269q 6f 0s], 2-3-4 tree 1.2 [703c 34q 0f 0s], hlist 1.2 [0c 149q 0f 0s], plist 1.2 [0c 3523q 1f 0s], CopyOnWriteArrayList 1.2 [0c 67q 0f 0s], interval tree 1.1 [1110c 79q 2f 0s], suffix array 1.1 [709c 155q 0f 0s], HyperLogLog 1.1 [4369c 95q 0f 0s], suffix tree 1.1 [1162c 230q 0f 0s], treap 1.0 [1158c 31q 0f 0s], Fibonacci heap 1.0 [2277c 77q 0f 0s], XArray 0.8 [0c 2402q 0f 0s], binomial heap 0.6 [640c 37q 0f 0s]

## Race condition (14)

LSM tree 1.9 [3293c 19q 0f 0s], skip list 1.7 [3131c 0q 0f 0s], 2-3 tree 1.3 [572c 21q 0f 0s], file descriptor table 1.3 [3513c 0q 0f 0s], XOR linked list 1.0 [490c 23q 0f 0s], rope 1.0 [2088c 0q 2f 0s], extended page table 1.0 [1686c 0q 0f 0s], count-min sketch 0.9 [1057c 14q 0f 0s], finger tree 0.6 [421c 16q 0f 0s], min-max heap 0.6 [1024c 23q 0f 0s], DAWG 0.6 [340c 18q 0f 0s], pairing heap 0.5 [380c 11q 0f 0s], Judy array 0.4 [253c 10q 0f 0s], ACPI table 0.3 [3527c 0q 0f 0s]

## Heisenbug (100)

ProducerConsumerQueue 1.8 [0c 0q 0f 0s], process table 1.7 [0c 0q 0f 0s], ImmutableMap 1.7 [0c 0q 0f 0s], socket buffer 1.6 [0c 0q 0f 0s], free space map 1.6 [0c 0q 0f 0s], ImmutableSet 1.6 [0c 0q 0f 0s], BRIN 1.5 [0c 0q 0f 0s], device queue 1.4 [0c 0q 0f 0s], free list 1.3 [629c 0q 0f 0s], cuckoo hash table 1.3 [1245c 0q 0f 0s], MapVector 1.2 [0c 0q 0f 0s], scatter-gather list 1.2 [333c 0q 0f 0s], bounded MPMC queue 1.2 [0c 0q 3f 0s], SmallVector 1.1 [0c 0q 0f 0s], buf_ring 1.1 [0c 0q 0f 0s], zipper 1.1 [593c 0q 0f 0s], SLIST 1.1 [0c 0q 0f 0s], posting list 1.1 [0c 0q 0f 0s], DenseMap 1.1 [0c 0q 0f 0s], lookaside list 1.1 [0c 0q 0f 0s], combining tree 1.1 [0c 0q 0f 0s], Treiber stack 1.0 [341c 0q 0f 0s], SetVector 1.0 [0c 0q 0f 0s], IntervalMap 1.0 [0c 0q 0f 0s], ebuckets 1.0 [0c 0q 0f 0s], SLRU 1.0 [0c 0q 0f 0s], d-ary heap 1.0 [255c 0q 0f 0s], EvictingCacheMap 1.0 [0c 0q 0f 0s], sparse table 1.0 [0c 0q 0f 0s], gap buffer 0.9 [724c 0q 0f 0s], SparseBitVector 0.9 [0c 0q 0f 0s], generic radix tree 0.9 [0c 0q 0f 0s], ziplist 0.9 [0c 0q 0f 0s], AtomicHashMap 0.9 [0c 0q 0f 0s], piece table 0.9 [1099c 0q 0f 0s], ChainMap 0.9 [0c 0q 0f 0s], SparseSet 0.8 [0c 0q 0f 0s], quicklist 0.8 [0c 0q 1f 0s], kfifo 0.8 [0c 0q 0f 0s], IdentityHashMap 0.8 [0c 0q 0f 0s], rax 0.8 [0c 0q 0f 0s], cuckoo filter 0.8 [679c 0q 0f 0s], order-statistic tree 0.8 [290c 0q 0f 0s], unrolled linked list 0.8 [322c 0q 0f 0s], hash array mapped trie 0.7 [709c 0q 0f 0s], LPM trie 0.7 [0c 0q 0f 0s], Swiss table 0.7 [0c 0q 0f 0s], IDR 0.7 [0c 0q 0f 0s], xor filter 0.7 [0c 0q 0f 0s], roaring bitmap 0.7 [0c 0q 1f 0s], memory descriptor list 0.7 [0c 0q 0f 0s], listpack 0.7 [0c 0q 0f 0s], visibility map 0.7 [0c 0q 0f 0s], interrupt descriptor table 0.7 [636c 0q 0f 0s], dominator tree 0.7 [874c 0q 0f 0s], intrusive heap 0.7 [0c 0q 0f 0s], generalized search tree 0.7 [0c 0q 8f 0s], folio_queue 0.7 [0c 0q 0f 0s], sbitmap 0.7 [0c 0q 0f 0s], SpinedBuffer 0.6 [0c 0q 0f 0s] ...

## Confirmed lines the scores disagree with (never moved)

- graph: off-by-one in the bank, scores say npe (graph 4.2 [2157c 2304q 1f 0s])
- tuple: off-by-one in the bank, scores say npe (tuple 4.0* [6536c 12048q 2f 0s])
- linked list: npe in the bank, scores say off-by-one (linked list 5.0 [4243c 19887q 0f 0s])
- binary tree: npe in the bank, scores say off-by-one (binary tree 4.8 [5623c 6805q 0f 0s])
- priority queue: npe in the bank, scores say off-by-one (priority queue 5.0* [3256c 2628q 0f 0s])
- Merkle tree: npe in the bank, scores say leak (Merkle tree 1.9 [8506c 72q 1f 0s])
- inverted index: npe in the bank, scores say leak (inverted index 1.9 [0c 223q 0f 0s])
- call graph: npe in the bank, scores say leak (call graph 1.3 [603c 219q 0f 0s])
- control flow graph: npe in the bank, scores say leak (control flow graph 1.5 [1843c 141q 0f 0s])
- doubly linked list: leak in the bank, scores say npe (doubly linked list 4.0* [1351c 1832q 0f 0s])
- deque: leak in the bank, scores say npe (deque 2.5 [1622c 1009q 0f 0s])
- binary search tree: leak in the bank, scores say npe (binary search tree 4.2 [5394c 6378q 0f 0s])
- adjacency list: leak in the bank, scores say npe (adjacency list 3.0 [1415c 660q 0f 0s])
- adjacency matrix: leak in the bank, scores say npe (adjacency matrix 2.5 [4131c 915q 0f 0s])
- red-black tree: leak in the bank, scores say npe (red-black tree 2.8 [8235c 1580q 1f 0s])
- AVL tree: leak in the bank, scores say npe (AVL tree 2.8 [5311c 933q 1f 0s])
- skip list: leak in the bank, scores say race (skip list 1.7 [3131c 0q 0f 0s])
- ring buffer: leak in the bank, scores say npe (ring buffer 2.6 [5202c 419q 1f 0s])
- LSM tree: leak in the bank, scores say race (LSM tree 1.9 [3293c 19q 0f 0s])
- cuckoo hash table: leak in the bank, scores say heisenbug (cuckoo hash table 1.3 [1245c 0q 0f 0s])
- cuckoo filter: leak in the bank, scores say heisenbug (cuckoo filter 0.8 [679c 0q 0f 0s])
- count-min sketch: leak in the bank, scores say race (count-min sketch 0.9 [1057c 14q 0f 0s])
- DAWG: leak in the bank, scores say race (DAWG 0.6 [340c 18q 0f 0s])
- scatter-gather list: leak in the bank, scores say heisenbug (scatter-gather list 1.2 [333c 0q 0f 0s])
- free list: leak in the bank, scores say heisenbug (free list 1.3 [629c 0q 0f 0s])
- process table: leak in the bank, scores say heisenbug (process table 1.7 [0c 0q 0f 0s])
- socket buffer: leak in the bank, scores say heisenbug (socket buffer 1.6 [0c 0q 0f 0s])
- interrupt descriptor table: leak in the bank, scores say heisenbug (interrupt descriptor table 0.7 [636c 0q 0f 0s])
- dominator tree: leak in the bank, scores say heisenbug (dominator tree 0.7 [874c 0q 0f 0s])
- virtual table: leak in the bank, scores say npe (virtual table 2.0 [1700c 626q 0f 0s])
- global offset table: leak in the bank, scores say heisenbug (global offset table 0.5 [477c 0q 0f 0s])
- roaring bitmap: leak in the bank, scores say heisenbug (roaring bitmap 0.7 [0c 0q 1f 0s])
- Fenwick tree: race in the bank, scores say leak (Fenwick tree 1.4 [3104c 76q 0f 0s])
- treap: race in the bank, scores say leak (treap 1.0 [1158c 31q 0f 0s])
- Fibonacci heap: race in the bank, scores say leak (Fibonacci heap 1.0 [2277c 77q 0f 0s])
- binomial heap: race in the bank, scores say leak (binomial heap 0.6 [640c 37q 0f 0s])
- leftist heap: race in the bank, scores say heisenbug (leftist heap 0.5 [322c 0q 0f 0s])
- d-ary heap: race in the bank, scores say heisenbug (d-ary heap 1.0 [255c 0q 0f 0s])
- hash array mapped trie: race in the bank, scores say heisenbug (hash array mapped trie 0.7 [709c 0q 0f 0s])
- XArray: race in the bank, scores say leak (XArray 0.8 [0c 2402q 0f 0s])
- quotient filter: race in the bank, scores say heisenbug (quotient filter 0.4 [194c 0q 0f 0s])
- zipper: race in the bank, scores say heisenbug (zipper 1.1 [593c 0q 0f 0s])
- gap buffer: race in the bank, scores say heisenbug (gap buffer 0.9 [724c 0q 0f 0s])
- piece table: race in the bank, scores say heisenbug (piece table 0.9 [1099c 0q 0f 0s])
- 2-3-4 tree: race in the bank, scores say leak (2-3-4 tree 1.2 [703c 34q 0f 0s])
- B-epsilon tree: race in the bank, scores say heisenbug (B-epsilon tree 0.4 [0c 0q 0f 0s])
- Cartesian tree: race in the bank, scores say heisenbug (Cartesian tree 0.5 [761c 7q 0f 0s])
- unrolled linked list: race in the bank, scores say heisenbug (unrolled linked list 0.8 [322c 0q 0f 0s])
- top tree: race in the bank, scores say heisenbug (top tree 0.3 [132c 0q 0f 0s])
- order-statistic tree: race in the bank, scores say heisenbug (order-statistic tree 0.8 [290c 0q 0f 0s])
- shadow page table: race in the bank, scores say heisenbug (shadow page table 0.5 [0c 0q 0f 0s])
- LPM trie: race in the bank, scores say heisenbug (LPM trie 0.7 [0c 0q 0f 0s])
- posting list: race in the bank, scores say heisenbug (posting list 1.1 [0c 0q 0f 0s])
- generalized search tree: race in the bank, scores say heisenbug (generalized search tree 0.7 [0c 0q 8f 0s])
- GIN: race in the bank, scores say heisenbug (GIN 0.4 [0c 0q 0f 0s])
- lookaside list: race in the bank, scores say heisenbug (lookaside list 1.1 [0c 0q 0f 0s])
- memory descriptor list: race in the bank, scores say heisenbug (memory descriptor list 0.7 [0c 0q 0f 0s])
- SmallVector: race in the bank, scores say heisenbug (SmallVector 1.1 [0c 0q 0f 0s])
- DenseMap: race in the bank, scores say heisenbug (DenseMap 1.1 [0c 0q 0f 0s])
- SparseSet: race in the bank, scores say heisenbug (SparseSet 0.8 [0c 0q 0f 0s])
- string table: race in the bank, scores say leak (string table 1.7 [0c 33q 0f 0s])
- Swiss table: race in the bank, scores say heisenbug (Swiss table 0.7 [0c 0q 0f 0s])
- concurrent skip list: race in the bank, scores say leak (concurrent skip list 1.4 [0c 40q 0f 0s])
- bounded MPMC queue: race in the bank, scores say heisenbug (bounded MPMC queue 1.2 [0c 0q 3f 0s])
- intrusive heap: race in the bank, scores say heisenbug (intrusive heap 0.7 [0c 0q 0f 0s])
- rax: race in the bank, scores say heisenbug (rax 0.8 [0c 0q 0f 0s])
- listpack: race in the bank, scores say heisenbug (listpack 0.7 [0c 0q 0f 0s])
- quicklist: race in the bank, scores say heisenbug (quicklist 0.8 [0c 0q 1f 0s])
- Treiber stack: race in the bank, scores say heisenbug (Treiber stack 1.0 [341c 0q 0f 0s])
- ChainMap: race in the bank, scores say heisenbug (ChainMap 0.9 [0c 0q 0f 0s])
- IdentityHashMap: race in the bank, scores say heisenbug (IdentityHashMap 0.8 [0c 0q 0f 0s])
- CopyOnWriteArrayList: race in the bank, scores say leak (CopyOnWriteArrayList 1.2 [0c 67q 0f 0s])
- ziplist: race in the bank, scores say heisenbug (ziplist 0.9 [0c 0q 0f 0s])
- intset: race in the bank, scores say heisenbug (intset 0.0* [0c 0q 0f 0s])
- min-max heap: heisenbug in the bank, scores say race (min-max heap 0.6 [1024c 23q 0f 0s])
- hlist: heisenbug in the bank, scores say leak (hlist 1.2 [0c 149q 0f 0s])
- plist: heisenbug in the bank, scores say leak (plist 1.2 [0c 3523q 1f 0s])
- Judy array: heisenbug in the bank, scores say race (Judy array 0.4 [253c 10q 0f 0s])
- ACPI table: heisenbug in the bank, scores say race (ACPI table 0.3 [3527c 0q 0f 0s])
- assoc_array: heisenbug in the bank, scores say npe (assoc_array 2.8 [0c 0q 0f 0s])
- kvstore: heisenbug in the bank, scores say npe (kvstore 2.3 [0c 0q 0f 0s])

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
