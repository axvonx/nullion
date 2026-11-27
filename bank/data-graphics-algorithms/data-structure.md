# Name a data structure
id: data-structure · domain: data-graphics-algorithms · status: approved
> Any data structure for storing or organizing data.

## Off-by-one
- array | dynamic array | FBVector | ArrayList | std::vector | Vec | growable array | resizable array
- hash table | hash map | hashmap | dictionary | associative array | StringMap | unordered_map | concurrent_hash_map | HashSet
- stack | call stack | LifoQueue
- queue | fifo queue | ConcurrentLinkedQueue | LinkedBlockingQueue | ArrayBlockingQueue | SimpleQueue
- graph | DirectedGraph

## Works on my machine
- bloom filter

## Null pointer exception
- linked list | singly linked list | single-linked list
- binary tree
- heap | binary heap | heap queue
- priority queue | PriorityBlockingQueue
- trie | prefix tree
- B-tree | btree | b-tree index | btree_map | btree_set
- B+ tree | b+tree | bplus tree
- bit array | bitmap | bitset | bit vector
- Merkle tree | hash tree

## Memory leak
- doubly linked list | double linked list | list_head | IntrusiveList
- deque | double-ended queue | ArrayDeque | VecDeque | LinkedBlockingDeque | ConcurrentLinkedDeque
- binary search tree | bst
- adjacency list
- adjacency matrix
- red-black tree | rb tree | rbtree | TreeMap | TreeSet
- AVL tree | ImutAVLTree
- skip list | skiplist | ConcurrentSkipListMap | ConcurrentSkipListSet
- segment tree
- radix tree | patricia tree | patricia trie | compact prefix tree
- suffix tree
- suffix array
- splay tree
- k-d tree | kd tree | kd-tree
- quadtree
- octree
- R-tree | rtree | r-tree index
- interval tree
- disjoint-set | union-find | union find | disjoint set union | dsu
- ring buffer | circular buffer | circular queue | descriptor ring | FixedCapacityRingQueue | DynamicRingQueue
- LSM tree | log-structured merge-tree | log structured merge tree
- cuckoo hash table | cuckoo hashing | cuckoo table
- cuckoo filter
- count-min sketch
- HyperLogLog
- DAWG | directed acyclic word graph

## Race condition
- Fenwick tree | binary indexed tree
- rope
- treap
- Fibonacci heap
- binomial heap
- pairing heap
- leftist heap
- d-ary heap
- hash array mapped trie | hamt
- XArray
  note: The Linux kernel's resizable-array replacement for the radix tree.
- quotient filter
- zipper
- finger tree
- gap buffer
- piece table
- 2-3 tree
- 2-3-4 tree
- B-epsilon tree | bε-tree | fractal tree
- Cartesian tree
- XOR linked list
- unrolled linked list
- top tree
- order-statistic tree

## Heisenbug
- skew heap
- soft heap
- min-max heap
- Brodal queue
- CHAMP | compressed hash-array mapped prefix-tree
- RRB vector | relaxed radix balanced tree | rrb tree
- van Emde Boas tree | veb tree
- maple tree
  note: Linux 6.1's RCU-safe B-tree for VMAs.
- IDR
- kfifo
- hlist | hash list
- plist | priority sorted list
- xor filter
- scapegoat tree
- Judy array
- adaptive radix tree | art
- Bw-tree
- wavelet tree
- BK-tree
- link-cut tree
- Euler tour tree
- sparse table
- radix heap

## Bit Flip
- fusion tree
  note: Fredman & Willard, 1990: beats comparison-sort bounds with word-level parallelism.

## Inbox
- page table | translation table (suggested: npe)
- translation lookaside buffer (suggested: leak)
- scatter-gather list | scatter list | scatter-gather table | sg list | gather list (suggested: race)
- partition table (suggested: leak)
- free list (suggested: leak)
- process table (suggested: leak)
- symbol table (suggested: npe)
- file descriptor table (suggested: race)
- socket buffer (suggested: leak)
- ACPI table | system description table (suggested: heisenbug)
- auxiliary vector | aux vector (suggested: heisenbug)
- combining tree (suggested: heisenbug)
- sbitmap | scalability bitmap (suggested: heisenbug)
- assoc_array (suggested: heisenbug)
- shadow page table (suggested: race)
- extended page table (suggested: race)
- min_heap (suggested: leak)
- folio_queue (suggested: heisenbug)
- generic radix tree (suggested: heisenbug)
- fib_trie (suggested: heisenbug)
- LPM trie (suggested: heisenbug)
- e820 table | e820 map | e820 memory map (suggested: heisenbug)
- interrupt descriptor table (suggested: leak)
- PRD table (suggested: heisenbug)
- write-intent bitmap (suggested: heisenbug)
- block translation table (suggested: heisenbug)
- access control list (suggested: npe)
- inverted index (suggested: npe)
- posting list (suggested: heisenbug)
- visibility map (suggested: leak)
- free space map (suggested: race)
- generalized search tree | GiST (suggested: race)
- GIN | generalized inverted index (suggested: heisenbug)
- BRIN (suggested: heisenbug)
- SLRU (suggested: heisenbug)
- buf_ring (suggested: heisenbug)
- lookaside list (suggested: race)
- memory descriptor list (suggested: race)
- SLIST (suggested: heisenbug)
- device queue (suggested: race)
- cancel-safe IRP queue | cancel-safe queue (suggested: heisenbug)
- SmallVector | InlinedVector (suggested: race)
- DenseMap | SmallDenseMap (suggested: race)
- DenseSet (suggested: race)
- SmallPtrSet (suggested: race)
- SetVector (suggested: race)
- MapVector (suggested: race)
- SparseSet (suggested: race)
- SparseMultiSet (suggested: heisenbug)
- SparseBitVector (suggested: heisenbug)
- CoalescingBitVector (suggested: heisenbug)
- SmallBitVector (suggested: heisenbug)
- FoldingSet (suggested: heisenbug)
- ImmutableMap (suggested: heisenbug)
- ImmutableSet (suggested: heisenbug)
- IntervalMap (suggested: heisenbug)
- dominator tree | post-dominator tree (suggested: leak)
- call graph (suggested: leak)
- control flow graph | flow graph (suggested: npe)
- abstract syntax tree | syntax tree (suggested: npe)
- virtual table | VTable | virtual function table (suggested: leak)
- jump table (suggested: leak)
- string table (suggested: leak)
- global offset table (suggested: leak)
- directed acyclic graph | DAG (suggested: npe)
- Swiss table | raw_hash_set | flat_hash_map | flat_hash_set (suggested: leak)
- F14 hash table | F14 | F14Table | F14Map | F14Set | F14FastMap | F14FastSet | F14VectorMap | F14VectorSet | F14NodeMap | F14NodeSet | F14ValueMap | F14ValueSet | F14BasicMap | F14BasicSet (suggested: race)
- AtomicHashMap (suggested: heisenbug)
- concurrent skip list (suggested: race)
- concurrent B-skip list (suggested: heisenbug)
- bounded MPMC queue | MPMCQueue (suggested: heisenbug)
- ProducerConsumerQueue (suggested: heisenbug)
- EvictingCacheMap (suggested: heisenbug)
- intrusive heap (suggested: heisenbug)
- rax | rax tree (suggested: leak)
- listpack (suggested: race)
- quicklist (suggested: race)
- kvstore (suggested: heisenbug)
- ebuckets (suggested: heisenbug)
- roaring bitmap (suggested: leak)
- Treiber stack (suggested: race)
- CLH queue (suggested: heisenbug)
- SpinedBuffer (suggested: heisenbug)
- ChainMap (suggested: race)
- LinkedHashMap (suggested: leak)
- IdentityHashMap (suggested: race)
- CopyOnWriteArrayList | copy-on-write array (suggested: race)
- ziplist (suggested: race)
- intset (suggested: race)
