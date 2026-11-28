# Scoring: data-structure (Name a data structure)

179 answers (Bit Flip and Works on my machine left out); 6 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 10 (6%) | 9 | 3 |
| npe | 25 (14%) | 19 | 13 |
| leak | 19 (11%) | 38 | 9 |
| race | 12 (7%) | 49 | 9 |
| heisenbug | 113 (63%) | 64 | 54 |

Same tier as today: 91/179 (51%).

## Off-by-one (10)

array 6.3 [5487c 416718q 7f], list 5.6 [945c 141576q 0f], stack 5.5 [5121c 1145q 0f], tree 5.4 [4609c 16775q 0f], hash table 5.3 [10652c 86118q 0f], linked list 5.0 [4243c 19887q 0f], queue 5.0 [2371c 1407q 1f], priority queue 5.0* [3256c 2628q 1f], binary tree 4.8 [5623c 6805q 0f], set 4.7 [946c 0q 4f]

## Null pointer exception (25)

graph 4.2 [2157c 2304q 1f], binary search tree 4.2 [5394c 6378q 1f], tuple 4.0* [6536c 12048q 2f], Matrix 4.0* [5487c 41203q 0f], doubly linked list 4.0* [1351c 26510q 0f], heap 4.0 [8626c 226q 0f], B-tree 3.1 [10100c 769q 0f], min-heap 3.0 [8626c 184q 0f], adjacency list 3.0 [1415c 660q 0f], bit array 2.9 [1485c 15719q 26f], max-heap 2.8 [8626c 148q 0f], assoc_array 2.8 [0c 0q 0f], red-black tree 2.8 [8235c 1580q 2f], AVL tree 2.8 [5311c 933q 4f], ring buffer 2.6 [5202c 419q 1f], trie 2.5 [8826c 1112q 1f], deque 2.5 [1622c 1009q 0f], adjacency matrix 2.5 [4131c 915q 0f], B+ tree 2.5 [2957c 769q 0f], symbol table 2.4 [704c 225q 0f], directed acyclic graph 2.3 [11727c 1477q 0f], kvstore 2.3 [0c 0q 0f], page table 2.1 [4190c 0q 0f], abstract syntax tree 2.1 [9258c 2985q 0f], virtual table 2.0 [1700c 626q 0f]

## Memory leak (19)

segment tree 2.0 [2016c 271q 0f], inverted index 1.9 [1577c 223q 0f], LinkedHashMap 1.8 [0c 705q 0f], disjoint-set 1.7 [5295c 187q 0f], k-d tree 1.7 [4989c 461q 0f], partition table 1.6 [0c 247q 0f], quadtree 1.5 [3881c 383q 1f], control flow graph 1.5 [1843c 141q 0f], Fenwick tree 1.4 [3104c 3606q 0f], octree 1.3 [2230c 152q 1f], call graph 1.3 [603c 219q 0f], R-tree 1.2 [2944c 269q 6f], hlist 1.2 [0c 149q 0f], plist 1.2 [0c 3523q 1f], suffix array 1.1 [709c 155q 0f], suffix tree 1.1 [1162c 230q 0f], XArray 0.8 [0c 2402q 0f], generalized search tree 0.7 [0c 370q 8f], GIN 0.4 [0c 886q 0f]

## Race condition (12)

LSM tree 1.9 [3293c 19q 0f], Merkle tree 1.9 [8506c 72q 1f], skip list 1.7 [3131c 0q 0f], jump table 1.6 [694c 64q 0f], splay tree 1.4 [1518c 70q 0f], file descriptor table 1.3 [3513c 0q 0f], radix tree 1.3 [3823c 46q 0f], CopyOnWriteArrayList 1.2 [0c 67q 0f], interval tree 1.1 [1110c 79q 2f], HyperLogLog 1.1 [4369c 95q 0f], Fibonacci heap 1.0 [2277c 77q 0f], ACPI table 0.3 [3527c 0q 0f]

## Heisenbug (113)

ProducerConsumerQueue 1.8 [0c 0q 0f], process table 1.7 [0c 0q 0f], ImmutableMap 1.7 [0c 0q 0f], string table 1.7 [0c 33q 0f], socket buffer 1.6 [0c 0q 0f], free space map 1.6 [0c 0q 0f], ImmutableSet 1.6 [0c 0q 0f], BRIN 1.5 [0c 0q 0f], device queue 1.4 [0c 0q 0f], concurrent skip list 1.4 [0c 40q 0f], free list 1.3 [629c 0q 0f], cuckoo hash table 1.3 [1245c 0q 0f], 2-3 tree 1.3 [572c 21q 0f], MapVector 1.2 [0c 0q 0f], 2-3-4 tree 1.2 [703c 34q 0f], scatter-gather list 1.2 [333c 0q 0f], bounded MPMC queue 1.2 [0c 0q 3f], SmallVector 1.1 [0c 0q 0f], buf_ring 1.1 [0c 0q 0f], zipper 1.1 [593c 0q 0f], SLIST 1.1 [0c 0q 0f], posting list 1.1 [1577c 0q 0f], DenseMap 1.1 [0c 0q 0f], lookaside list 1.1 [0c 0q 0f], combining tree 1.1 [0c 0q 0f], XOR linked list 1.0 [490c 23q 0f], Treiber stack 1.0 [341c 0q 0f], SetVector 1.0 [0c 0q 0f], IntervalMap 1.0 [0c 0q 0f], ebuckets 1.0 [0c 0q 0f], SLRU 1.0 [0c 0q 0f], d-ary heap 1.0 [255c 0q 0f], rope 1.0 [2088c 0q 2f], EvictingCacheMap 1.0 [0c 0q 0f], treap 1.0 [1158c 31q 0f], extended page table 1.0 [1686c 0q 0f], sparse table 1.0 [0c 0q 0f], gap buffer 0.9 [724c 0q 0f], count-min sketch 0.9 [1057c 14q 0f], SparseBitVector 0.9 [0c 0q 0f], generic radix tree 0.9 [0c 0q 0f], ziplist 0.9 [0c 0q 0f], AtomicHashMap 0.9 [0c 0q 0f], piece table 0.9 [1099c 0q 0f], ChainMap 0.9 [0c 0q 0f], SparseSet 0.8 [0c 0q 0f], quicklist 0.8 [0c 0q 1f], kfifo 0.8 [0c 0q 0f], IdentityHashMap 0.8 [0c 0q 0f], rax 0.8 [0c 0q 0f], cuckoo filter 0.8 [679c 0q 0f], order-statistic tree 0.8 [290c 0q 0f], unrolled linked list 0.8 [322c 0q 0f], hash array mapped trie 0.7 [709c 0q 0f], LPM trie 0.7 [0c 0q 0f], Swiss table 0.7 [0c 0q 0f], IDR 0.7 [0c 0q 1f], xor filter 0.7 [0c 0q 0f], roaring bitmap 0.7 [0c 0q 1f], memory descriptor list 0.7 [0c 0q 0f] ...

## Confirmed lines the scores disagree with (never moved)

- graph: off-by-one in the bank, scores say npe (graph 4.2 [2157c 2304q 1f])
- tuple: off-by-one in the bank, scores say npe (tuple 4.0* [6536c 12048q 2f])
- linked list: npe in the bank, scores say off-by-one (linked list 5.0 [4243c 19887q 0f])
- binary tree: npe in the bank, scores say off-by-one (binary tree 4.8 [5623c 6805q 0f])
- priority queue: npe in the bank, scores say off-by-one (priority queue 5.0* [3256c 2628q 1f])
- Merkle tree: npe in the bank, scores say race (Merkle tree 1.9 [8506c 72q 1f])
- inverted index: npe in the bank, scores say leak (inverted index 1.9 [1577c 223q 0f])
- call graph: npe in the bank, scores say leak (call graph 1.3 [603c 219q 0f])
- control flow graph: npe in the bank, scores say leak (control flow graph 1.5 [1843c 141q 0f])
- doubly linked list: leak in the bank, scores say npe (doubly linked list 4.0* [1351c 26510q 0f])
- deque: leak in the bank, scores say npe (deque 2.5 [1622c 1009q 0f])
- binary search tree: leak in the bank, scores say npe (binary search tree 4.2 [5394c 6378q 1f])
- adjacency list: leak in the bank, scores say npe (adjacency list 3.0 [1415c 660q 0f])
- adjacency matrix: leak in the bank, scores say npe (adjacency matrix 2.5 [4131c 915q 0f])
- red-black tree: leak in the bank, scores say npe (red-black tree 2.8 [8235c 1580q 2f])
- AVL tree: leak in the bank, scores say npe (AVL tree 2.8 [5311c 933q 4f])
- skip list: leak in the bank, scores say race (skip list 1.7 [3131c 0q 0f])
- radix tree: leak in the bank, scores say race (radix tree 1.3 [3823c 46q 0f])
- splay tree: leak in the bank, scores say race (splay tree 1.4 [1518c 70q 0f])
- interval tree: leak in the bank, scores say race (interval tree 1.1 [1110c 79q 2f])
- ring buffer: leak in the bank, scores say npe (ring buffer 2.6 [5202c 419q 1f])
- LSM tree: leak in the bank, scores say race (LSM tree 1.9 [3293c 19q 0f])
- cuckoo hash table: leak in the bank, scores say heisenbug (cuckoo hash table 1.3 [1245c 0q 0f])
- cuckoo filter: leak in the bank, scores say heisenbug (cuckoo filter 0.8 [679c 0q 0f])
- count-min sketch: leak in the bank, scores say heisenbug (count-min sketch 0.9 [1057c 14q 0f])
- HyperLogLog: leak in the bank, scores say race (HyperLogLog 1.1 [4369c 95q 0f])
- DAWG: leak in the bank, scores say heisenbug (DAWG 0.6 [340c 18q 0f])
- scatter-gather list: leak in the bank, scores say heisenbug (scatter-gather list 1.2 [333c 0q 0f])
- free list: leak in the bank, scores say heisenbug (free list 1.3 [629c 0q 0f])
- process table: leak in the bank, scores say heisenbug (process table 1.7 [0c 0q 0f])
- socket buffer: leak in the bank, scores say heisenbug (socket buffer 1.6 [0c 0q 0f])
- interrupt descriptor table: leak in the bank, scores say heisenbug (interrupt descriptor table 0.7 [636c 0q 0f])
- dominator tree: leak in the bank, scores say heisenbug (dominator tree 0.7 [874c 0q 0f])
- virtual table: leak in the bank, scores say npe (virtual table 2.0 [1700c 626q 0f])
- jump table: leak in the bank, scores say race (jump table 1.6 [694c 64q 0f])
- global offset table: leak in the bank, scores say heisenbug (global offset table 0.5 [477c 0q 0f])
- roaring bitmap: leak in the bank, scores say heisenbug (roaring bitmap 0.7 [0c 0q 1f])
- Fenwick tree: race in the bank, scores say leak (Fenwick tree 1.4 [3104c 3606q 0f])
- rope: race in the bank, scores say heisenbug (rope 1.0 [2088c 0q 2f])
- treap: race in the bank, scores say heisenbug (treap 1.0 [1158c 31q 0f])
- binomial heap: race in the bank, scores say heisenbug (binomial heap 0.6 [640c 37q 0f])
- pairing heap: race in the bank, scores say heisenbug (pairing heap 0.5 [380c 11q 0f])
- leftist heap: race in the bank, scores say heisenbug (leftist heap 0.5 [322c 0q 0f])
- d-ary heap: race in the bank, scores say heisenbug (d-ary heap 1.0 [255c 0q 0f])
- hash array mapped trie: race in the bank, scores say heisenbug (hash array mapped trie 0.7 [709c 0q 0f])
- XArray: race in the bank, scores say leak (XArray 0.8 [0c 2402q 0f])
- quotient filter: race in the bank, scores say heisenbug (quotient filter 0.4 [194c 0q 0f])
- zipper: race in the bank, scores say heisenbug (zipper 1.1 [593c 0q 0f])
- finger tree: race in the bank, scores say heisenbug (finger tree 0.6 [421c 16q 0f])
- gap buffer: race in the bank, scores say heisenbug (gap buffer 0.9 [724c 0q 0f])
- piece table: race in the bank, scores say heisenbug (piece table 0.9 [1099c 0q 0f])
- 2-3 tree: race in the bank, scores say heisenbug (2-3 tree 1.3 [572c 21q 0f])
- 2-3-4 tree: race in the bank, scores say heisenbug (2-3-4 tree 1.2 [703c 34q 0f])
- B-epsilon tree: race in the bank, scores say heisenbug (B-epsilon tree 0.4 [0c 0q 0f])
- Cartesian tree: race in the bank, scores say heisenbug (Cartesian tree 0.5 [761c 7q 0f])
- XOR linked list: race in the bank, scores say heisenbug (XOR linked list 1.0 [490c 23q 0f])
- unrolled linked list: race in the bank, scores say heisenbug (unrolled linked list 0.8 [322c 0q 0f])
- top tree: race in the bank, scores say heisenbug (top tree 0.3 [132c 0q 0f])
- order-statistic tree: race in the bank, scores say heisenbug (order-statistic tree 0.8 [290c 0q 0f])
- shadow page table: race in the bank, scores say heisenbug (shadow page table 0.5 [0c 0q 0f])
- extended page table: race in the bank, scores say heisenbug (extended page table 1.0 [1686c 0q 0f])
- LPM trie: race in the bank, scores say heisenbug (LPM trie 0.7 [0c 0q 0f])
- posting list: race in the bank, scores say heisenbug (posting list 1.1 [1577c 0q 0f])
- generalized search tree: race in the bank, scores say leak (generalized search tree 0.7 [0c 370q 8f])
- GIN: race in the bank, scores say leak (GIN 0.4 [0c 886q 0f])
- lookaside list: race in the bank, scores say heisenbug (lookaside list 1.1 [0c 0q 0f])
- memory descriptor list: race in the bank, scores say heisenbug (memory descriptor list 0.7 [0c 0q 0f])
- SmallVector: race in the bank, scores say heisenbug (SmallVector 1.1 [0c 0q 0f])
- DenseMap: race in the bank, scores say heisenbug (DenseMap 1.1 [0c 0q 0f])
- SparseSet: race in the bank, scores say heisenbug (SparseSet 0.8 [0c 0q 0f])
- string table: race in the bank, scores say heisenbug (string table 1.7 [0c 33q 0f])
- Swiss table: race in the bank, scores say heisenbug (Swiss table 0.7 [0c 0q 0f])
- concurrent skip list: race in the bank, scores say heisenbug (concurrent skip list 1.4 [0c 40q 0f])
- bounded MPMC queue: race in the bank, scores say heisenbug (bounded MPMC queue 1.2 [0c 0q 3f])
- intrusive heap: race in the bank, scores say heisenbug (intrusive heap 0.7 [0c 0q 0f])
- rax: race in the bank, scores say heisenbug (rax 0.8 [0c 0q 0f])
- listpack: race in the bank, scores say heisenbug (listpack 0.7 [0c 0q 0f])
- quicklist: race in the bank, scores say heisenbug (quicklist 0.8 [0c 0q 1f])
- Treiber stack: race in the bank, scores say heisenbug (Treiber stack 1.0 [341c 0q 0f])
- ChainMap: race in the bank, scores say heisenbug (ChainMap 0.9 [0c 0q 0f])
- IdentityHashMap: race in the bank, scores say heisenbug (IdentityHashMap 0.8 [0c 0q 0f])
- ziplist: race in the bank, scores say heisenbug (ziplist 0.9 [0c 0q 0f])
- intset: race in the bank, scores say heisenbug (intset 0.0* [0c 0q 0f])
- hlist: heisenbug in the bank, scores say leak (hlist 1.2 [0c 149q 0f])
- plist: heisenbug in the bank, scores say leak (plist 1.2 [0c 3523q 1f])
- ACPI table: heisenbug in the bank, scores say race (ACPI table 0.3 [3527c 0q 0f])
- assoc_array: heisenbug in the bank, scores say npe (assoc_array 2.8 [0c 0q 0f])
- kvstore: heisenbug in the bank, scores say npe (kvstore 2.3 [0c 0q 0f])

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
