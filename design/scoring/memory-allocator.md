# Scoring: memory-allocator (Name a memory allocator)

52 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (2%) | 1 | 0 |
| npe | 18 (35%) | 18 | 0 |
| leak | 1 (2%) | 2 | 0 |
| race | 1 (2%) | 2 | 0 |
| heisenbug | 31 (60%) | 29 | 0 |

Same tier as today: 49/52 (94%).

## Off-by-one (1)

malloc 5.7 [0c 9269q 0f]

## Null pointer exception (18)

Pool allocator 3.4 [605c 94q 0f], best-fit allocator 3.1 [0c 75q 1f], first-fit allocator 3.0 [0c 0q 0f], buddy allocator 3.0 [1297c 0q 0f], Free list allocator 2.9 [629c 0q 0f], Arena allocator 2.8 [2212c 0q 0f], stack allocator 2.8 [1147c 0q 0f], dlmalloc 2.6 [0c 0q 1f], slab allocator 2.6 [1206c 28q 1f], tcmalloc 2.6 [0c 100q 1f], ptmalloc 2.5 [0c 0q 0f], kmalloc 2.5 [0c 54q 0f], SLUB allocator 2.4 [213c 0q 0f], BumpPtrAllocator 2.4 [0c 0q 0f], bitmap allocator 2.3 [0c 0q 0f], next-fit allocator 2.2 [0c 0q 0f], mimalloc 2.1 [0c 5q 35f], vmalloc 2.0 [0c 35q 0f]

## Memory leak (1)

Mesh 1.0 [0c 2670q 2f]

## Race condition (1)

talloc 1.1 [0c 2q 43f]

## Heisenbug (31)

PartitionAlloc 1.9 [0c 0q 0f], Low Fragmentation Heap 1.8 [0c 0q 0f], half-fit 1.7 [0c 0q 0f], Electric Fence 1.6 [41c 14q 13f], omalloc 1.5 [0c 0q 0f], segregated free list allocator 1.5 [0c 0q 0f], rpmalloc 1.5 [0c 0q 1f], memblock 1.5 [0c 0q 0f], Hoard 1.4 [68c 9q 0f], libumem 1.4 [27c 9q 1f], LFMalloc 1.4 [0c 0q 0f], pymalloc 1.4 [0c 0q 0f], nedmalloc 1.4 [0c 4q 0f], SLOB allocator 1.4 [80c 0q 1f], Scalloc 1.3 [0c 0q 0f], vmem 1.3 [0c 0q 2f], phkmalloc 1.3 [0c 0q 0f], DieHarder 1.2 [0c 0q 13f], snmalloc 1.2 [0c 0q 4f], Contiguous Memory Allocator 1.1 [0c 0q 0f], TLSF 1.1 [0c 0q 3f], Segment Heap 1.1 [0c 0q 0f], zsmalloc 1.1 [0c 0q 0f], hardened_malloc 1.1 [0c 0q 5f], mallocng 0.9 [0c 0q 0f], Zend MM 0.9 [0c 0q 0f], genalloc 0.9 [0c 0q 0f], SuperMalloc 0.8 [0c 0q 0f], bootmem 0.7 [0c 0q 0f], Streamflow 0.5 [0c 0q 0f], DieHard 0.0* [0c 0q 2f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
