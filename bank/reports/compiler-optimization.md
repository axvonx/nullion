# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: compiler, optimization.

## compiler-optimization

79 candidates; 45 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| inlining | 30 | 50 | 123 | 1.00 | off-by-one | counts | off-by-one | — |
| scalarization ⚠ counts said off-by-one | 3 | 396 | 2430 | 1.00 | race | judge (override) | race | — |
| speculative execution | 2 | 24 | 68 | 0.89 | off-by-one | counts | npe | — |
| profile-guided optimization | 3 | 24 | 21 | 0.83 | npe | counts | npe | — |
| loop unrolling | 0 | 15 | 47 | 0.65 | npe | counts | off-by-one | — |
| peephole optimization | 0 | 46 | 13 | 0.65 | womm | pin | — | — |
| loop fusion | 0 | 13 | 18 | 0.55 | leak | counts | leak | — |
| loop vectorization | 0 | 7 | 31 | 0.54 | leak | counts | npe | — |
| common subexpression elimination ⚠ counts said leak | 0 | 8 | 18 | 0.51 | off-by-one | judge (override) | off-by-one | — |
| function specialization | 0 | 2 | 28 | 0.43 | leak | counts | race | — |
| loop distribution | 0 | 5 | 10 | 0.41 | leak | counts | leak | — |
| link-time optimization | 0 | 13 | 3 | 0.41 | leak | counts | npe | — |
| strength reduction | 0 | 4 | 8 | 0.37 | npe | judge | npe | — |
| interprocedural optimization | 0 | 9 | 2 | 0.34 | npe | judge | npe | — |
| dead code elimination ⚠ counts said leak | 0 | 1 | 13 | 0.32 | off-by-one | judge (override) | off-by-one | — |
| tail call optimization | 0 | 4 | 3 | 0.30 | off-by-one | judge | off-by-one | — |
| superword-level parallelism | 0 | 5 | 2 | 0.29 | race | judge | race | — |
| loop-invariant code motion | 0 | 1 | 6 | 0.26 | npe | judge | npe | — |
| constraint elimination | 0 | 0 | 11 | 0.23 | race | counts | heisenbug | — |
| constant propagation ⚠ counts said race | 0 | 0 | 10 | 0.23 | off-by-one | judge (override) | off-by-one | — |
| loop interchange | 0 | 1 | 4 | 0.22 | leak | judge | leak | — |
| instruction combining | 0 | 0 | 8 | 0.21 | leak | judge | leak | — |
| full unrolling | 0 | 1 | 3 | 0.20 | race | judge | race | — |
| function merging | 0 | 0 | 7 | 0.20 | race | judge | race | — |
| copy propagation | 0 | 1 | 2 | 0.18 | npe | judge | npe | — |
| partial unrolling | 0 | 1 | 2 | 0.18 | race | judge | race | — |
| vector combining | 0 | 0 | 5 | 0.17 | heisenbug | judge | heisenbug | — |
| expression reassociation | 0 | 0 | 4 | 0.15 | race | judge | race | — |
| unroll-and-jam | 0 | 3 | 0 | 0.14 | race | judge | race | — |
| loop unswitching | 0 | 1 | 1 | 0.14 | leak | judge | leak | — |
| whole-program devirtualization | 0 | 1 | 1 | 0.14 | leak | judge | leak | — |
| loop versioning | 0 | 0 | 3 | 0.13 | race | judge | race | — |
| partial inlining | 0 | 2 | 0 | 0.11 | race | judge | race | — |
| CFG simplification | 0 | 0 | 1 | 0.07 | leak | judge | leak | — |
| global value numbering | 0 | 0 | 1 | 0.07 | leak | judge | leak | — |
| loop flattening | 0 | 0 | 1 | 0.07 | race | judge | race | — |
| sparse conditional constant propagation | 0 | 0 | 1 | 0.07 | leak | judge | leak | — |
| aggressive dead code elimination ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| argument promotion ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| bit-tracking dead code elimination ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| call-site splitting ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| constant hoisting ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| constant merging ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| correlated value propagation ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| dead argument elimination ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| dead store elimination ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| epilogue vectorization ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| global dead code elimination ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| global variable optimization ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| GVN hoisting ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| GVN sinking ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| induction variable simplification ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| jump threading ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| load-store vectorization ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| loop data prefetching ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| loop deletion ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| loop idiom recognition ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| loop load elimination ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| loop peeling ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| loop predication ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| loop rotation ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| loop sinking ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mem2reg ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| memcpy optimization ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| merged load-store motion ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| scalar replacement of aggregates ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| straight-line strength reduction ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CFG flattening ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| code sinking ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| DFA jump threading | 0 | 0 | 0 | 0.00 | bitflip | pin | — | — |
| guard widening ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| hot/cold splitting ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| inductive range check elimination ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| instruction simplification ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| library call simplification ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| loop bound splitting ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| n-ary reassociation ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| critical edge splitting ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| loop-closed SSA ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): common subexpression elimination (counts said leak, now off-by-one), constant propagation (counts said race, now off-by-one), dead code elimination (counts said leak, now off-by-one), scalarization (counts said off-by-one, now race)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

