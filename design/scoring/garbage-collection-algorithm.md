# Scoring: garbage-collection-algorithm (Name a garbage collection algorithm)

46 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (2%) | 1 | 0 |
| npe | 14 (30%) | 14 | 0 |
| leak | 1 (2%) | 1 | 0 |
| race | 1 (2%) | 1 | 0 |
| heisenbug | 29 (63%) | 29 | 0 |

Same tier as today: 46/46 (100%).

## Off-by-one (1)

reference counting 4.4 [0c 469q 0f 0s]

## Null pointer exception (14)

mark-sweep 4.3 [0c 25q 0f 0s], generational 4.0 [0c 0q 0f 0s], generational garbage collection 3.8 [0c 0q 0f 0s], G1 3.3 [170c 319q 0f 0s], Copying garbage collection 3.3 [0c 0q 0f 0s], Concurrent garbage collection 3.2 [0c 0q 0f 0s], copying collector 3.1 [0c 0q 0f 0s], mark-compact 3.0 [117c 0q 0f 0s], Concurrent Mark Sweep 2.9 [56c 58q 0f 0s], Parallel GC 2.9 [0c 0q 0f 0s], Serial GC 2.7 [0c 0q 0f 0s], incremental garbage collection 2.6 [0c 0q 0f 0s], semispace collector 2.2 [0c 0q 0f 0s], Cheney's algorithm 2.0 [0c 0q 0f 0s]

## Memory leak (1)

Boehm GC 1.9 [829c 50q 55f 3568s]

## Race condition (1)

Shenandoah 1.9 [0c 11q 0f 0s]

## Heisenbug (29)

tri-color marking 1.9 [0c 0q 0f 0s], conservative garbage collection 1.8 [0c 0q 0f 0s], snapshot-at-the-beginning 1.5 [0c 0q 0f 0s], Oilpan 1.5 [0c 0q 0f 0s], Epsilon GC 1.4 [0c 0q 0f 0s], accurate garbage collection 1.4 [0c 0q 0f 0s], Mostly Parallel GC 1.4 [0c 0q 0f 0s], Baker's algorithm 1.3 [0c 0q 0f 0s], Brooks forwarding pointer 1.2 [0c 0q 0f 0s], Generational ZGC 1.1 [0c 0q 0f 0s], Trial deletion 1.1 [0c 0q 0f 0s], deferred reference counting 1.0 [0c 0q 0f 0s], weighted reference counting 1.0 [0c 0q 0f 0s], Appel collector 1.0* [0c 0q 0f 0s], Compressor 1.0 [0c 0q 0f 0s], Immix 0.9 [0c 0q 3f 0s], Morris algorithm 0.9 [0c 0q 0f 0s], LXR 0.8 [0c 0q 0f 0s], C4 0.8 [0c 0q 0f 0s], Beltway 0.8 [0c 0q 0f 0s], Orinoco 0.8 [0c 0q 0f 0s], Metronome 0.8 [0c 0q 0f 0s], Bacon-Rajan cycle collector 0.6 [0c 0q 0f 0s], Sapphire 0.6 [0c 0q 1f 0s], Deutsch-Schorr-Waite algorithm 0.5 [0c 0q 0f 0s], RC Immix 0.5 [0c 0q 0f 0s], Lisp2 algorithm 0.4 [0c 0q 0f 0s], Bacon-Rajan cycle collection 0.4 [0c 0q 0f 0s], Ulterior reference counting 0.4 [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
