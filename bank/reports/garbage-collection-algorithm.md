# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: garbage collection, garbage collector.

## garbage-collection-algorithm

42 candidates; 17 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| reference counting | 4 | 26 | 5 | 0.80 | npe | counts | off-by-one | — |
| mark-sweep | 0 | 13 | 5 | 0.78 | npe | counts | off-by-one | — |
| generational garbage collection | 0 | 21 | 3 | 0.71 | npe | counts | npe | — |
| ZGC | 0 | 3 | 5 | 0.60 | womm | pin | — | — |
| accurate garbage collection | 0 | 9 | 1 | 0.49 | leak | judge | leak | — |
| conservative garbage collection | 0 | 8 | 1 | 0.47 | npe | judge | npe | — |
| G1 | 0 | 2 | 2 | 0.40 | npe | judge | npe | — |
| incremental garbage collection | 0 | 15 | 0 | 0.40 | leak | counts | npe | — |
| Immix | 0 | 1 | 2 | 0.35 | heisenbug | judge | heisenbug | — |
| Shenandoah | 0 | 2 | 1 | 0.31 | leak | judge | leak | — |
| mark-compact | 0 | 2 | 1 | 0.31 | npe | judge | npe | — |
| copying collector | 0 | 0 | 3 | 0.31 | off-by-one | judge | off-by-one | — |
| Concurrent Mark Sweep | 0 | 1 | 1 | 0.25 | leak | judge | leak | — |
| Metronome | 0 | 4 | 0 | 0.23 | heisenbug | judge | heisenbug | — |
| Train algorithm | 0 | 2 | 0 | 0.16 | bitflip | pin | — | — |
| Sapphire | 0 | 2 | 0 | 0.16 | heisenbug | judge | heisenbug | — |
| Parallel GC | 0 | 0 | 1 | 0.15 | leak | judge | leak | — |
| Epsilon GC | 0 | 0 | 1 | 0.15 | race | judge | race | — |
| Cheney's algorithm | 0 | 0 | 1 | 0.15 | leak | judge | leak | — |
| Compressor | 0 | 0 | 1 | 0.15 | heisenbug | judge | heisenbug | — |
| C4 | 0 | 0 | 1 | 0.15 | race | judge | race | — |
| deferred reference counting | 0 | 0 | 1 | 0.15 | heisenbug | judge | heisenbug | — |
| LXR | 0 | 0 | 1 | 0.15 | heisenbug | judge | heisenbug | — |
| Beltway | 0 | 1 | 0 | 0.10 | heisenbug | judge | heisenbug | — |
| Ulterior reference counting | 0 | 1 | 0 | 0.10 | heisenbug | judge | heisenbug | — |
| Serial GC ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tri-color marking ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| semispace collector ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Baker's algorithm ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Lisp2 algorithm ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Morris algorithm ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Boehm GC ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Deutsch-Schorr-Waite algorithm ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| weighted reference counting ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Bacon-Rajan cycle collection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Appel collector ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Orinoco ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Generational ZGC ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| snapshot-at-the-beginning ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Brooks forwarding pointer ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Mostly Parallel GC ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| RC Immix ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): none

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

