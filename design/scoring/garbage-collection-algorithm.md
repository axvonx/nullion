# Scoring: garbage-collection-algorithm (Name a garbage collection algorithm)

46 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (2%) | 3 | 0 |
| npe | 14 (30%) | 9 | 0 |
| leak | 2 (4%) | 10 | 0 |
| race | 2 (4%) | 4 | 0 |
| heisenbug | 27 (59%) | 20 | 0 |

Same tier as today: 26/46 (57%).

## Off-by-one (1)

reference counting 4.4 [791c 589q 0f]

## Null pointer exception (14)

mark-sweep 4.3 [1098c 25q 0f], generational 4.0 [0c 0q 0f], generational garbage collection 3.8 [1098c 0q 0f], G1 3.3 [170c 319q 0f], Copying garbage collection 3.3 [0c 0q 0f], Concurrent garbage collection 3.2 [1098c 0q 0f], copying collector 3.1 [0c 0q 0f], mark-compact 3.0 [117c 0q 0f], Concurrent Mark Sweep 2.9 [56c 7252q 0f], Parallel GC 2.9 [0c 0q 0f], Serial GC 2.7 [0c 0q 0f], incremental garbage collection 2.6 [1098c 0q 0f], semispace collector 2.2 [277c 0q 0f], Cheney's algorithm 2.0 [277c 0q 0f]

## Memory leak (2)

Boehm GC 1.9 [829c 50q 55f], Epsilon GC 1.4 [0c 158q 0f]

## Race condition (2)

deferred reference counting 1.0 [0c 86q 6f], C4 0.8 [0c 99q 0f]

## Heisenbug (27)

Shenandoah 1.9 [0c 11q 0f], tri-color marking 1.9 [1098c 0q 0f], conservative garbage collection 1.8 [1098c 0q 0f], Oilpan 1.5 [0c 0q 0f], snapshot-at-the-beginning 1.5 [0c 0q 0f], accurate garbage collection 1.4 [1098c 0q 0f], Mostly Parallel GC 1.4 [0c 0q 0f], Baker's algorithm 1.3 [0c 0q 0f], Brooks forwarding pointer 1.2 [0c 0q 0f], Generational ZGC 1.1 [0c 0q 0f], Trial deletion 1.1 [791c 0q 0f], weighted reference counting 1.0 [0c 0q 0f], Appel collector 1.0* [0c 0q 0f], Compressor 1.0 [0c 0q 0f], Immix 0.9 [0c 0q 3f], Morris algorithm 0.9 [0c 0q 0f], LXR 0.8 [0c 12q 3f], Beltway 0.8 [0c 0q 0f], Orinoco 0.8 [0c 0q 0f], Metronome 0.8 [0c 39q 0f], Bacon-Rajan cycle collector 0.6 [0c 0q 0f], Sapphire 0.6 [0c 0q 1f], Deutsch-Schorr-Waite algorithm 0.5 [0c 0q 0f], RC Immix 0.5 [0c 0q 0f], Lisp2 algorithm 0.4 [0c 0q 0f], Bacon-Rajan cycle collection 0.4 [0c 0q 0f], Ulterior reference counting 0.4 [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
