# Name a memory allocator
id: memory-allocator · domain: os-systems · status: approved
> Any named general-purpose or specialised dynamic memory allocator implementation or allocation algorithm for C-style heaps.

## Works on my machine
- jemalloc

## Null pointer exception
- first-fit allocator | first fit (auto)

## Memory leak
- buddy allocator (auto)
- slab allocator (auto)
- Contiguous Memory Allocator | CMA | cma allocator (auto)
- Arena allocator | region allocator (auto)
- Pool allocator (auto)
- ptmalloc | ptmalloc2 | glibc malloc (auto)
- dlmalloc | Doug Lea's malloc (auto)
- tcmalloc (auto)
- mimalloc (auto)
- best-fit allocator | best fit (auto)
- next-fit allocator | next fit (auto)
- stack allocator (auto)
- Electric Fence (auto)

## Race condition
- BumpPtrAllocator | bump allocator | bump pointer allocator (auto)
- Hoard (auto)
- snmalloc (auto)
- rpmalloc (auto)
- TLSF | two-level segregated fit (auto)
- omalloc | OpenBSD malloc (auto)
- Low Fragmentation Heap (auto)
- Segment Heap (auto)
- SLUB allocator | SLUB (auto)
- SLOB allocator | SLOB (auto)
- segregated free list allocator | segregated fit (auto)
- bitmap allocator (auto)
- pymalloc (auto)

## Heisenbug
- zsmalloc (auto)
- SuperMalloc (auto)
- nedmalloc (auto)
- phkmalloc (auto)
- mallocng (auto)
- hardened_malloc (auto)
- Scalloc (auto)
- Streamflow (auto)
- LFMalloc (auto)
- Mesh (auto)
- memblock (auto)
- genalloc | gen_pool (auto)
- bootmem (auto)
- DieHard (auto)
- DieHarder (auto)
- Zend MM (auto)
- half-fit (auto)

## Bit Flip
- Scudo | Scudo Hardened Allocator
