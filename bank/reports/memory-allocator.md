# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

## memory-allocator

47 candidates; 20 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| Mesh ⚠ counts said off-by-one | 14 | 24305 | 13732 | 0.96 | heisenbug | judge (override) | heisenbug | — |
| best-fit allocator ⚠ counts said off-by-one | 3 | 196 | 587 | 0.88 | leak | judge (override) | leak | — |
| first-fit allocator | 5 | 96 | 155 | 0.85 | npe | counts | leak | — |
| Streamflow ⚠ counts said npe | 0 | 337 | 90 | 0.76 | heisenbug | judge (override) | heisenbug | — |
| Hoard ⚠ counts said npe | 0 | 96 | 30 | 0.62 | race | judge (override) | race | — |
| stack allocator | 15 | 18 | 6 | 0.54 | leak | counts | npe | — |
| Pool allocator | 17 | 11 | 7 | 0.52 | leak | counts | npe | — |
| Arena allocator | 3 | 9 | 12 | 0.46 | leak | counts | npe | — |
| DieHard ⚠ counts said leak | 0 | 11 | 23 | 0.44 | heisenbug | judge (override) | heisenbug | — |
| DieHarder ⚠ counts said leak | 0 | 11 | 23 | 0.44 | heisenbug | judge (override) | heisenbug | — |
| slab allocator | 23 | 5 | 3 | 0.43 | leak | counts | npe | — |
| next-fit allocator | 0 | 12 | 14 | 0.41 | leak | counts | race | — |
| Contiguous Memory Allocator | 19 | 8 | 1 | 0.40 | leak | counts | race | — |
| buddy allocator | 17 | 3 | 3 | 0.38 | leak | counts | npe | — |
| Electric Fence | 3 | 14 | 2 | 0.37 | leak | counts | race | — |
| vmalloc | 140 | 1 | 1 | 0.31 | race | counts | leak | — |
| TLSF | 0 | 6 | 4 | 0.27 | race | judge | race | — |
| zsmalloc | 30 | 0 | 0 | 0.20 | heisenbug | counts | heisenbug | — |
| genalloc | 52 | 0 | 0 | 0.20 | heisenbug | counts | heisenbug | — |
| tcmalloc | 0 | 1 | 5 | 0.19 | leak | judge | leak | — |
| mimalloc | 0 | 2 | 3 | 0.19 | leak | judge | leak | — |
| memblock | 19 | 0 | 0 | 0.17 | heisenbug | counts | heisenbug | — |
| bootmem | 16 | 0 | 0 | 0.17 | heisenbug | counts | heisenbug | — |
| ptmalloc | 0 | 1 | 3 | 0.16 | leak | judge | leak | — |
| jemalloc | 0 | 0 | 5 | 0.14 | womm | pin | — | — |
| Scalloc | 0 | 1 | 2 | 0.14 | heisenbug | judge | heisenbug | — |
| Scudo | 0 | 2 | 1 | 0.14 | bitflip | pin | — | — |
| SLUB allocator | 3 | 0 | 1 | 0.14 | race | judge | race | — |
| SuperMalloc | 0 | 1 | 1 | 0.11 | heisenbug | judge | heisenbug | — |
| segregated free list allocator | 0 | 1 | 1 | 0.11 | race | judge | race | — |
| BumpPtrAllocator | 0 | 0 | 2 | 0.09 | race | judge | race | — |
| dlmalloc | 0 | 0 | 2 | 0.09 | leak | judge | leak | — |
| snmalloc | 0 | 1 | 0 | 0.05 | race | judge | race | — |
| rpmalloc ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| nedmalloc ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| omalloc ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| phkmalloc ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mallocng ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Low Fragmentation Heap ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Segment Heap ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| hardened_malloc ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| LFMalloc ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SLOB allocator ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| bitmap allocator ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Zend MM ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| pymalloc ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| half-fit ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): Hoard (counts said npe, now race), Streamflow (counts said npe, now heisenbug), Mesh (counts said off-by-one, now heisenbug), best-fit allocator (counts said off-by-one, now leak), DieHard (counts said leak, now heisenbug), DieHarder (counts said leak, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

