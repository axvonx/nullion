# Scoring: memory-allocator (Name a memory allocator)

52 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (2%) | 1 | 0 |
| npe | 18 (35%) | 18 | 0 |
| leak | 0 (0%) | 0 | 0 |
| race | 7 (13%) | 7 | 0 |
| heisenbug | 26 (50%) | 26 | 0 |

Same tier as today: 52/52 (100%).

## Off-by-one (1)

malloc 5.7 [0c 9269q 0f 0s]

## Null pointer exception (18)

Pool allocator 3.4 [605c 94q 0f 0s], best-fit allocator 3.1 [0c 75q 1f 0s], first-fit allocator 3.0 [0c 0q 0f 0s], buddy allocator 3.0 [1297c 0q 0f 0s], Free list allocator 2.9 [629c 0q 0f 0s], Arena allocator 2.8 [2212c 0q 0f 0s], stack allocator 2.8 [1147c 0q 0f 0s], dlmalloc 2.6 [0c 0q 1f 0s], slab allocator 2.6 [1206c 0q 1f 0s], tcmalloc 2.6 [0c 100q 1f 0s], ptmalloc 2.5 [0c 0q 0f 0s], kmalloc 2.5 [0c 54q 0f 0s], SLUB allocator 2.4 [213c 0q 0f 0s], BumpPtrAllocator 2.4 [0c 0q 0f 0s], bitmap allocator 2.3 [0c 0q 0f 0s], next-fit allocator 2.2 [0c 0q 0f 0s], mimalloc 2.1 [826c 5q 35f 13586s], vmalloc 2.0 [0c 35q 0f 0s]

## Memory leak (0)



## Race condition (7)

Electric Fence 1.6 [41c 14q 13f 0s], rpmalloc 1.5 [0c 0q 1f 2542s], snmalloc 1.2 [0c 0q 4f 1983s], TLSF 1.1 [0c 0q 3f 1648s], hardened_malloc 1.1 [0c 0q 5f 2083s], talloc 1.1 [0c 2q 43f 0s], Mesh 1.0 [0c 0q 2f 1899s]

## Heisenbug (26)

PartitionAlloc 1.9 [0c 0q 0f 0s], Low Fragmentation Heap 1.8 [0c 0q 0f 0s], half-fit 1.7 [0c 0q 0f 0s], omalloc 1.5 [0c 0q 0f 0s], segregated free list allocator 1.5 [0c 0q 0f 0s], memblock 1.5 [0c 0q 0f 0s], Hoard 1.4 [68c 0q 0f 0s], libumem 1.4 [27c 9q 1f 36s], LFMalloc 1.4 [0c 0q 0f 0s], pymalloc 1.4 [0c 0q 0f 0s], nedmalloc 1.4 [0c 4q 0f 0s], SLOB allocator 1.4 [80c 0q 1f 0s], Scalloc 1.3 [0c 0q 0f 0s], vmem 1.3 [0c 0q 2f 0s], phkmalloc 1.3 [0c 0q 0f 0s], DieHarder 1.2 [0c 0q 13f 0s], Contiguous Memory Allocator 1.1 [0c 0q 0f 0s], Segment Heap 1.1 [0c 0q 0f 0s], zsmalloc 1.1 [0c 0q 0f 0s], mallocng 0.9 [0c 0q 0f 0s], Zend MM 0.9 [0c 0q 0f 0s], genalloc 0.9 [0c 0q 0f 0s], SuperMalloc 0.8 [0c 0q 0f 0s], bootmem 0.7 [0c 0q 0f 0s], Streamflow 0.5 [0c 0q 0f 0s], DieHard 0.0* [0c 0q 2f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
