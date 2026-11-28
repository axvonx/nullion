# Name a garbage collection algorithm
id: garbage-collection-algorithm · domain: languages-tools · status: approved
> Any named garbage collection algorithm or collector scheme described in the GC literature or a runtime's documentation, such as mark-sweep, copying, or incremental collection.

## Off-by-one
- Copying garbage collection | stop-and-copy | semispace GC | semi-space (auto)
- Concurrent garbage collection | concurrent GC (auto)
- generational (auto)

## Works on my machine
- ZGC | Z Garbage Collector
  note: Java's sub-millisecond colored-pointer collector — everyone's modern GC flex.

## Null pointer exception
- G1 | G1GC | Garbage-First | Garbage-First GC (auto)
- conservative garbage collection | conservative GC | conservative collector (auto)
- mark-sweep | Mark-and-sweep (auto)
- mark-compact | mark and compact | mark-sweep-compact (auto)
- reference counting | refcounting | RC (auto)
- generational garbage collection | generational GC (auto)
- copying collector | copying collection | copying GC (auto)
- Trial deletion | cycle collection (auto)
- Oilpan | Blink Oilpan (auto)

## Memory leak
- accurate garbage collection | precise garbage collection | exact garbage collection (auto)
- Parallel GC | Parallel Scavenge | Parallel Old | Parallel Collector (auto)
- Serial GC | Serial Collector (auto)
- Shenandoah | Shenandoah GC (auto)
- incremental garbage collection | incremental GC (auto)
- tri-color marking | tri-color abstraction (auto)
- Cheney's algorithm | Cheney copying (auto)
- semispace collector (auto)
- Concurrent Mark Sweep | CMS (auto)
- Boehm GC | Boehm-Demers-Weiser (auto)

## Race condition
- Epsilon GC | Epsilon | Epsilon Garbage Collector | no-op GC (auto)
- C4 | Pauseless GC | Continuously Concurrent Compacting Collector (auto)
- Orinoco | V8 Orinoco (auto)
- Generational ZGC (auto)

## Heisenbug
- Immix | mark-region | Immix GC | mark-region GC (auto)
- Baker's algorithm | Baker's treadmill | incremental copying (auto)
- Lisp2 algorithm (auto)
- Compressor (auto)
- Morris algorithm (auto)
- Metronome (auto)
- Sapphire (auto)
- Deutsch-Schorr-Waite algorithm (auto)
- weighted reference counting (auto)
- deferred reference counting | DRC (auto)
- Bacon-Rajan cycle collection (auto)
- Appel collector (auto)
- Beltway (auto)
- snapshot-at-the-beginning (auto)
- Brooks forwarding pointer (auto)
- Mostly Parallel GC (auto)
- LXR | Low-Latency, High-Throughput Garbage Collector (auto)
- RC Immix (auto)
- Ulterior reference counting | URC (auto)
- Bacon-Rajan cycle collector (auto)

## Bit Flip
- Train algorithm | Mature Object Space
  note: Hudson and Moss's mature-object-space collector that evacuates cyclic garbage car by car.
