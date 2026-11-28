# Scoring: compiler-optimization (Name a compiler optimization)

88 answers (Bit Flip and Works on my machine left out); 0 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (1%) | 1 | 0 |
| npe | 23 (26%) | 23 | 0 |
| leak | 1 (1%) | 1 | 0 |
| race | 1 (1%) | 1 | 0 |
| heisenbug | 62 (70%) | 62 | 0 |

Same tier as today: 88/88 (100%).

## Off-by-one (1)

inlining 4.6 [554c 152q 0f 0s]

## Null pointer exception (23)

loop unrolling 3.8 [0c 171q 0f 0s], tail call optimization 3.7 [3417c 176q 0f 0s], dead code elimination 3.7 [452c 0q 0f 0s], Constant folding 3.4 [0c 45q 0f 0s], loop vectorization 3.1 [0c 6716q 0f 0s], Register allocation 3.1 [1071c 73q 0f 0s], constant propagation 3.1 [0c 0q 0f 0s], Tree shaking 3.0 [387c 250q 0f 0s], loop-invariant code motion 2.9 [276c 0q 0f 0s], link-time optimization 2.9 [0c 25q 0f 0s], full unrolling 2.8 [0c 0q 0f 0s], common subexpression elimination 2.8 [333c 0q 0f 0s], profile-guided optimization 2.6 [937c 0q 0f 0s], dead store elimination 2.4 [75c 0q 0f 0s], aggressive dead code elimination 2.3 [0c 0q 0f 0s], strength reduction 2.2 [346c 7q 0f 0s], Bounds check elimination 2.2 [60c 15q 0f 0s], partial unrolling 2.1 [0c 0q 0f 0s], speculative execution 2.1 [1278c 46q 0f 0s], Instruction scheduling 2.1 [253c 0q 0f 0s], constant hoisting 2.1 [0c 0q 0f 0s], interprocedural optimization 2.1 [0c 0q 0f 0s], Loop tiling 2.0 [342c 0q 0f 0s]

## Memory leak (1)

Escape analysis 1.8 [249c 37q 0f 0s]

## Race condition (1)

whole-program devirtualization 1.8 [0c 13q 0f 0s]

## Heisenbug (62)

library call simplification 1.9 [0c 0q 0f 0s], copy propagation 1.9 [57c 0q 0f 0s], loop fusion 1.9 [0c 0q 0f 0s], loop interchange 1.8 [73c 0q 0f 0s], instruction simplification 1.8 [0c 0q 0f 0s], global dead code elimination 1.8 [0c 0q 0f 0s], function specialization 1.7 [0c 0q 0f 0s], loop distribution 1.7 [0c 0q 0f 0s], loop deletion 1.7 [0c 0q 0f 0s], global value numbering 1.6 [0c 0q 0f 0s], loop flattening 1.5 [0c 0q 0f 0s], loop peeling 1.5 [0c 0q 0f 0s], memcpy optimization 1.5 [0c 0q 0f 0s], partial inlining 1.5 [0c 0q 0f 0s], instruction combining 1.4 [0c 0q 0f 0s], induction variable simplification 1.4 [0c 0q 0f 0s], dead argument elimination 1.4 [0c 0q 0f 0s], loop data prefetching 1.4 [0c 0q 0f 0s], loop predication 1.4 [0c 0q 0f 0s], expression reassociation 1.4 [0c 0q 0f 0s], scalarization 1.4 [0c 0q 0f 0s], loop unswitching 1.4 [847c 0q 0f 0s], lazy code motion 1.4 [0c 0q 0f 0s], CFG simplification 1.4 [0c 0q 0f 0s], loop load elimination 1.3 [0c 0q 0f 0s], loop rotation 1.3 [89c 0q 0f 0s], hot/cold splitting 1.3 [0c 0q 0f 0s], sparse conditional constant propagation 1.2 [115c 0q 0f 0s], constant merging 1.2 [0c 0q 0f 0s], If-conversion 1.2 [0c 0q 0f 0s], loop versioning 1.2 [0c 0q 0f 0s], unroll-and-jam 1.2 [0c 0q 0f 0s], argument promotion 1.2 [0c 0q 0f 0s], CFG flattening 1.2 [0c 0q 0f 0s], jump threading 1.1 [207c 0q 0f 0s], function merging 1.1 [0c 0q 0f 0s], loop sinking 1.1 [0c 0q 0f 0s], loop idiom recognition 1.1 [0c 0q 0f 0s], mem2reg 1.1 [0c 0q 0f 0s], code sinking 1.1 [0c 0q 0f 0s], scalar replacement of aggregates 1.0 [0c 0q 0f 0s], constraint elimination 1.0 [0c 0q 0f 0s], global variable optimization 0.9 [0c 0q 0f 0s], shrink wrapping 0.9 [0c 0q 0f 0s], loop bound splitting 0.8 [0c 0q 0f 0s], inductive range check elimination 0.8 [0c 0q 0f 0s], call-site splitting 0.8 [0c 0q 0f 0s], load-store vectorization 0.8 [0c 0q 0f 0s], straight-line strength reduction 0.8 [0c 0q 0f 0s], correlated value propagation 0.8 [0c 0q 0f 0s], critical edge splitting 0.7 [0c 0q 0f 0s], loop-closed SSA 0.7 [0c 0q 0f 0s], merged load-store motion 0.7 [0c 0q 0f 0s], Tail duplication 0.7 [0c 0q 0f 0s], superword-level parallelism 0.7 [0c 0q 0f 0s], vector combining 0.6 [0c 0q 0f 0s], GVN hoisting 0.6 [0c 0q 0f 0s], n-ary reassociation 0.6 [0c 0q 0f 0s], bit-tracking dead code elimination 0.5 [0c 0q 0f 0s], GVN sinking 0.5 [0c 0q 0f 0s] ...

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
