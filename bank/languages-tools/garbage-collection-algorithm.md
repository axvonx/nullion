# Name a garbage collection algorithm
id: garbage-collection-algorithm · domain: languages-tools · status: approved
> Any named garbage collection algorithm or collector scheme described in the GC literature or a runtime's documentation, such as mark-sweep, copying, or incremental collection.

## Off-by-one

## Works on my machine
- ZGC | Z Garbage Collector

## Null pointer exception
- G1 | G1GC | Garbage-First | Garbage-First GC (auto)
- conservative garbage collection | conservative GC | conservative collector (auto)
- mark-sweep (auto)
- mark-compact (auto)
- reference counting (auto)
- generational garbage collection (auto)
- copying collector | copying collection | copying GC (auto)

## Memory leak
- accurate garbage collection | precise garbage collection | exact garbage collection (auto)
- Parallel GC | Parallel Scavenge | Parallel Old | Parallel Collector (auto)
- Serial GC | Serial Collector (auto)
- Shenandoah | Shenandoah GC (auto)
- incremental garbage collection (auto)
- tri-color marking (auto)
- Cheney's algorithm (auto)
- semispace collector (auto)
- Concurrent Mark Sweep (auto)
- Boehm GC (auto)

## Race condition
- Epsilon GC | Epsilon | Epsilon Garbage Collector (auto)
- C4 | Pauseless GC (auto)
- Orinoco (auto)
- Generational ZGC (auto)

## Heisenbug
- Immix | mark-region (auto)
- Baker's algorithm (auto)
- Lisp2 algorithm (auto)
- Compressor (auto)
- Morris algorithm (auto)
- Metronome (auto)
- Sapphire (auto)
- Deutsch-Schorr-Waite algorithm (auto)
- weighted reference counting (auto)
- deferred reference counting (auto)
- Bacon-Rajan cycle collection (auto)
- Appel collector (auto)
- Beltway (auto)
- snapshot-at-the-beginning (auto)
- Brooks forwarding pointer (auto)
- Mostly Parallel GC (auto)
- LXR (auto)
- RC Immix (auto)
- Ulterior reference counting (auto)

## Bit Flip
- Train algorithm

## Inbox
- generational (suggested: off-by-one)
- Baker's treadmill (suggested: heisenbug)
- Bacon-Rajan cycle collector (suggested: heisenbug)
