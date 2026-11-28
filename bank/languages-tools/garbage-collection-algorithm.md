# Name a garbage collection algorithm
id: garbage-collection-algorithm · domain: languages-tools · status: approved
> Any named garbage collection algorithm or collector scheme described in the GC literature or a runtime's documentation, such as mark-sweep, copying, or incremental collection.

## Off-by-one
- reference counting | refcounting | RC (auto)

## Works on my machine
- ZGC | Z Garbage Collector
  note: Java's sub-millisecond colored-pointer collector — everyone's modern GC flex.

## Null pointer exception
- G1 | G1GC | Garbage-First | Garbage-First GC (auto)
- mark-sweep | Mark-and-sweep (auto)
- mark-compact | mark and compact | mark-sweep-compact (auto)
- generational garbage collection | generational GC (auto)
- copying collector | copying collection | copying GC (auto)
- Copying garbage collection | stop-and-copy | semispace GC | semi-space (auto)
- Concurrent garbage collection | concurrent GC (auto)
- generational (auto)
- Parallel GC | Parallel Scavenge | Parallel Old | Parallel Collector (auto)
- Serial GC | Serial Collector (auto)
- incremental garbage collection | incremental GC (auto)
- Cheney's algorithm | Cheney copying (auto)
- semispace collector (auto)
- Concurrent Mark Sweep | CMS (auto)

## Memory leak
- Boehm GC | Boehm-Demers-Weiser (auto)
- Epsilon GC | Epsilon | Epsilon Garbage Collector | no-op GC (auto)
- C4 | Pauseless GC | Continuously Concurrent Compacting Collector (auto)
- deferred reference counting | DRC (auto)

## Race condition
- Metronome (auto)

## Heisenbug
- Immix | mark-region | Immix GC | mark-region GC (auto)
- Baker's algorithm | Baker's treadmill | incremental copying (auto)
- Lisp2 algorithm (auto)
- Compressor (auto)
- Morris algorithm (auto)
- Sapphire (auto)
- Deutsch-Schorr-Waite algorithm (auto)
- weighted reference counting (auto)
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
- conservative garbage collection | conservative GC | conservative collector (auto)
- Trial deletion | cycle collection (auto)
- Oilpan | Blink Oilpan (auto)
- accurate garbage collection | precise garbage collection | exact garbage collection (auto)
- Shenandoah | Shenandoah GC (auto)
- tri-color marking | tri-color abstraction (auto)
- Orinoco | V8 Orinoco (auto)
- Generational ZGC (auto)

## Bit Flip
- Train algorithm | Mature Object Space
  note: Hudson and Moss's mature-object-space collector that evacuates cyclic garbage car by car.
