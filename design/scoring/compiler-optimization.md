# Scoring: compiler-optimization (Name a compiler optimization)

88 answers (Bit Flip and Works on my machine left out); 0 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (1%) | 1 | 0 |
| npe | 23 (26%) | 23 | 0 |
| leak | 0 (0%) | 0 | 0 |
| race | 1 (1%) | 0 | 0 |
| heisenbug | 63 (72%) | 64 | 0 |

Same tier as today: 87/88 (99%).

## Off-by-one (1)

inlining 4.6 [554c 152q 0f]

## Null pointer exception (23)

loop unrolling 3.8 [1163c 171q 0f], tail call optimization 3.7 [3417c 176q 0f], dead code elimination 3.7 [452c 19q 0f], Constant folding 3.4 [632c 45q 0f], loop vectorization 3.1 [534c 6716q 0f], Register allocation 3.1 [1071c 73q 0f], constant propagation 3.1 [632c 0q 0f], Tree shaking 3.0 [387c 250q 0f], loop-invariant code motion 2.9 [276c 0q 0f], link-time optimization 2.9 [803c 239q 0f], full unrolling 2.8 [1163c 0q 0f], common subexpression elimination 2.8 [333c 0q 0f], profile-guided optimization 2.6 [937c 48q 0f], dead store elimination 2.4 [75c 26q 1f], aggressive dead code elimination 2.3 [0c 0q 0f], strength reduction 2.2 [346c 7q 0f], Bounds check elimination 2.2 [60c 15q 0f], partial unrolling 2.1 [1163c 0q 0f], speculative execution 2.1 [1278c 46q 0f], Instruction scheduling 2.1 [253c 0q 0f], constant hoisting 2.1 [0c 0q 0f], interprocedural optimization 2.1 [803c 0q 0f], Loop tiling 2.0 [342c 0q 0f]

## Memory leak (0)



## Race condition (1)

Escape analysis 1.8 [249c 37q 0f]

## Heisenbug (63)

library call simplification 1.9 [0c 0q 0f], loop fusion 1.9 [187c 0q 0f], copy propagation 1.9 [57c 0q 0f], loop interchange 1.8 [73c 0q 0f], instruction simplification 1.8 [0c 0q 0f], global dead code elimination 1.8 [0c 0q 0f], whole-program devirtualization 1.8 [0c 13q 0f], loop distribution 1.7 [187c 0q 0f], function specialization 1.7 [0c 0q 0f], loop deletion 1.7 [0c 0q 0f], global value numbering 1.6 [0c 0q 0f], loop peeling 1.5 [178c 0q 0f], loop flattening 1.5 [0c 0q 0f], memcpy optimization 1.5 [0c 0q 0f], partial inlining 1.5 [0c 0q 0f], instruction combining 1.4 [0c 0q 0f], induction variable simplification 1.4 [0c 0q 0f], dead argument elimination 1.4 [0c 0q 0f], loop data prefetching 1.4 [0c 0q 0f], loop predication 1.4 [0c 0q 0f], expression reassociation 1.4 [0c 0q 0f], scalarization 1.4 [0c 0q 0f], loop unswitching 1.4 [847c 0q 0f], lazy code motion 1.4 [0c 0q 0f], CFG simplification 1.4 [0c 0q 0f], loop load elimination 1.3 [0c 0q 0f], loop rotation 1.3 [89c 0q 0f], hot/cold splitting 1.3 [0c 0q 0f], sparse conditional constant propagation 1.2 [115c 0q 0f], constant merging 1.2 [0c 0q 0f], If-conversion 1.2 [0c 0q 0f], loop versioning 1.2 [0c 0q 0f], unroll-and-jam 1.2 [0c 0q 0f], argument promotion 1.2 [0c 0q 0f], CFG flattening 1.2 [0c 0q 0f], jump threading 1.1 [207c 0q 0f], function merging 1.1 [0c 0q 0f], loop sinking 1.1 [0c 0q 0f], loop idiom recognition 1.1 [0c 0q 0f], mem2reg 1.1 [0c 0q 0f], code sinking 1.1 [0c 0q 0f], scalar replacement of aggregates 1.0 [0c 0q 0f], constraint elimination 1.0 [0c 0q 0f], global variable optimization 0.9 [0c 0q 0f], shrink wrapping 0.9 [0c 0q 0f], loop bound splitting 0.8 [0c 0q 0f], inductive range check elimination 0.8 [0c 0q 0f], call-site splitting 0.8 [0c 0q 0f], load-store vectorization 0.8 [0c 0q 0f], straight-line strength reduction 0.8 [0c 0q 0f], correlated value propagation 0.8 [0c 0q 0f], critical edge splitting 0.7 [0c 0q 0f], loop-closed SSA 0.7 [0c 0q 0f], merged load-store motion 0.7 [0c 0q 0f], superword-level parallelism 0.7 [534c 12q 0f], Tail duplication 0.7 [0c 0q 0f], vector combining 0.6 [0c 0q 0f], GVN hoisting 0.6 [0c 0q 0f], n-ary reassociation 0.6 [0c 0q 0f], bit-tracking dead code elimination 0.5 [0c 0q 0f] ...

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
