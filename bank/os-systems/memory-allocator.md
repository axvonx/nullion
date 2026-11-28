# Name a memory allocator
id: memory-allocator · domain: os-systems · status: approved
> Any named general-purpose or specialised dynamic memory allocator implementation or allocation algorithm for C-style heaps.

## Off-by-one
- malloc | C malloc (auto)

## Works on my machine
- jemalloc
  note: Jason Evans's arena allocator (Firefox, FreeBSD, Redis) — everyone's go-to beyond malloc.

## Null pointer exception
- first-fit allocator | first fit (auto)
- Free list allocator | freelist (auto)
- kmalloc (auto)
- vmalloc (auto)
- buddy allocator | buddy memory allocation (auto)
- slab allocator | SLAB (auto)
- Arena allocator | region allocator | zone allocator (auto)
- Pool allocator | memory pool | fixed-size block allocator (auto)
- ptmalloc | ptmalloc2 | glibc malloc (auto)
- dlmalloc | Doug Lea's malloc | Doug Lea malloc (auto)
- tcmalloc | Thread-Caching Malloc (auto)
- mimalloc (auto)
- best-fit allocator | best fit (auto)
- next-fit allocator | next fit (auto)
- stack allocator (auto)
- BumpPtrAllocator | bump allocator | bump pointer allocator | linear allocator | monotonic allocator (auto)
- SLUB allocator | SLUB (auto)
- bitmap allocator (auto)

## Race condition
- talloc | Samba talloc (auto)
- Mesh | Mesh allocator (auto)
- hardened_malloc (auto)
- snmalloc (auto)
- rpmalloc (auto)
- TLSF | two-level segregated fit (auto)
- Electric Fence (auto)

## Heisenbug
- zsmalloc (auto)
- SuperMalloc (auto)
- nedmalloc (auto)
- phkmalloc (auto)
- mallocng | musl mallocng (auto)
- Scalloc (auto)
- Streamflow (auto)
- LFMalloc (auto)
- memblock (auto)
- genalloc | gen_pool (auto)
- bootmem (auto)
- DieHard (auto)
- Zend MM (auto)
- half-fit (auto)
- PartitionAlloc (auto)
- libumem | umem (auto)
- vmem | vmem allocator (auto)
- Contiguous Memory Allocator | CMA | cma allocator (auto)
- Hoard | Hoard memory allocator (auto)
- omalloc | OpenBSD malloc (auto)
- Low Fragmentation Heap (auto)
- Segment Heap (auto)
- SLOB allocator | SLOB (auto)
- segregated free list allocator | segregated fit (auto)
- pymalloc (auto)
- DieHarder (auto)

## Bit Flip
- Scudo | Scudo Hardened Allocator
  note: Google's hardened user-mode allocator built to mitigate heap exploitation in Android and Fuchsia.
