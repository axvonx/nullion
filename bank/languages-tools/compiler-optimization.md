# Name a compiler optimization
id: compiler-optimization · domain: languages-tools · status: approved
> Any named code transformation a compiler applies to improve generated code, as described in a compiler textbook, paper, or compiler's documentation.

## Off-by-one
- common subexpression elimination | CSE | EarlyCSE (auto)
- constant propagation (auto)
- dead code elimination | DCE (auto)
- inlining | function inlining | AlwaysInliner (auto)
- speculative execution (auto)
- tail call optimization | tail call elimination | tail recursion elimination | TCO (auto)

## Works on my machine
- peephole optimization

## Null pointer exception
- copy propagation (auto)
- dead store elimination | DSE (auto)
- interprocedural optimization | IPO (auto)
- loop unrolling | LoopUnroll | LoopUnrollPass (auto)
- loop-invariant code motion | LICM (auto)
- profile-guided optimization | PGO (auto)
- strength reduction | loop strength reduction | LoopStrengthReduce (auto)

## Memory leak
- CFG simplification | SimplifyCFG | control-flow graph simplification (auto)
- function specialization (auto)
- global value numbering | GVN | NewGVN (auto)
- instruction combining | InstCombine (auto)
- jump threading (auto)
- link-time optimization | LTO (auto)
- loop distribution | loop fission | LoopDistribute (auto)
- loop fusion | loop jamming | LoopFuse (auto)
- loop interchange (auto)
- loop unswitching | SimpleLoopUnswitch (auto)
- loop vectorization | auto-vectorization | LoopVectorize (auto)
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

## Inbox
- constant folding (suggested: off-by-one)
- lazy code motion (suggested: heisenbug)
- shrink wrapping (suggested: heisenbug)
