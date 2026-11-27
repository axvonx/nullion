# Name a compiler optimization
id: compiler-optimization · domain: languages-tools · status: approved
> Any named code transformation a compiler applies to improve generated code, as described in a compiler textbook, paper, or compiler's documentation.

## Off-by-one
- common subexpression elimination | CSE | EarlyCSE (auto)
- constant propagation (auto)
- dead code elimination | DCE (auto)
- inlining | function inlining | AlwaysInliner | inline expansion (auto)
- speculative execution (auto)
- tail call optimization | tail call elimination | tail recursion elimination | TCO (auto)
- Constant folding (auto)
- Register allocation (auto)

## Works on my machine
- peephole optimization
  note: The classic sliding-window instruction tweak everyone recalls from compilers class.

## Null pointer exception
- copy propagation (auto)
- dead store elimination | DSE (auto)
- interprocedural optimization | IPO (auto)
- loop unrolling | LoopUnroll | LoopUnrollPass | loop unwinding (auto)
- loop-invariant code motion | LICM | code hoisting (auto)
- profile-guided optimization | PGO (auto)
- strength reduction | loop strength reduction | LoopStrengthReduce (auto)
- Escape analysis (auto)
- Loop tiling | loop blocking (auto)
- Bounds check elimination | BCE (auto)
- Instruction scheduling (auto)
- Tree shaking (auto)
- If-conversion | predication (auto)
- Tail duplication (auto)

## Memory leak
- CFG simplification | SimplifyCFG | control-flow graph simplification (auto)
- function specialization (auto)
- global value numbering | GVN | NewGVN (auto)
- instruction combining | InstCombine (auto)
- jump threading (auto)
- link-time optimization | LTO | whole-program optimization (auto)
- loop distribution | loop fission | LoopDistribute | loop splitting (auto)
- loop fusion | loop jamming | LoopFuse (auto)
- loop interchange | loop permutation (auto)
- loop unswitching | SimpleLoopUnswitch (auto)
- loop vectorization | auto-vectorization | LoopVectorize | vectorization | SIMD vectorization (auto)
- mem2reg | memory-to-register promotion | PromoteMemoryToRegister (auto)
- scalar replacement of aggregates | SROA (auto)
- sparse conditional constant propagation | SCCP | conditional constant propagation (auto)
- whole-program devirtualization | devirtualization | WholeProgramDevirt (auto)

## Race condition
- aggressive dead code elimination | ADCE (auto)
- constant hoisting (auto)
- constant merging | ConstantMerge (auto)
- constraint elimination (auto)
- correlated value propagation | CVP (auto)
- dead argument elimination (auto)
- expression reassociation | reassociation (auto)
- full unrolling | full loop unrolling (auto)
- function merging | MergeFunctions (auto)
- global dead code elimination | GlobalDCE (auto)
- induction variable simplification | IndVarSimplify (auto)
- loop data prefetching | LoopDataPrefetch (auto)
- loop deletion (auto)
- loop flattening | LoopFlatten (auto)
- loop idiom recognition | LoopIdiomRecognize (auto)
- loop peeling | LoopPeel (auto)
- loop rotation (auto)
- memcpy optimization | MemCpyOptimizer (auto)
- partial inlining (auto)
- partial unrolling | partial loop unrolling (auto)
- superword-level parallelism | SLP vectorization | SLP | SLPVectorizer (auto)
- unroll-and-jam | loop unroll and jam | LoopUnrollAndJamPass (auto)
- CFG flattening (auto)
- code sinking (auto)
- hot/cold splitting | hot-cold splitting (auto)
- instruction simplification (auto)
- library call simplification (auto)
- loop versioning (auto)
- scalarization (auto)
- critical edge splitting | BreakCriticalEdges (auto)

## Heisenbug
- argument promotion (auto)
- bit-tracking dead code elimination | BDCE (auto)
- call-site splitting (auto)
- epilogue vectorization (auto)
- global variable optimization | GlobalOpt (auto)
- GVN hoisting | GVNHoist (auto)
- GVN sinking | GVNSink (auto)
- load-store vectorization | LoadStoreVectorizer (auto)
- loop load elimination (auto)
- loop predication (auto)
- loop sinking | LoopSink (auto)
- merged load-store motion (auto)
- straight-line strength reduction | StraightLineStrengthReduce (auto)
- guard widening (auto)
- inductive range check elimination | IRCE (auto)
- loop bound splitting (auto)
- n-ary reassociation (auto)
- vector combining | VectorCombine (auto)
- loop-closed SSA | LCSSA (auto)

## Bit Flip
- DFA jump threading
  note: Uses a finite automaton over control-flow paths to thread redundant conditional branches.

## Inbox
- lazy code motion (suggested: heisenbug)
- shrink wrapping (suggested: heisenbug)
