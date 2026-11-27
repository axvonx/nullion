# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: compiler.

## compiler

55 candidates; 17 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| LLVM | 31 | 67 | 352 | 1.00 | off-by-one | counts | off-by-one | — |
| Reason ⚠ counts said off-by-one | 17 | 58 | 1003 | 0.98 | leak | judge (override) | leak | — |
| Rust | 18 | 32 | 214 | 0.95 | off-by-one | counts | off-by-one | — |
| GCC | 63 | 27 | 113 | 0.90 | off-by-one | counts | off-by-one | — |
| Go | 16 | 11 | 150 | 0.80 | npe | counts | off-by-one | — |
| Factor ⚠ counts said npe | 1 | 15 | 372 | 0.76 | race | judge (override) | race | — |
| Clang | 25 | 2 | 98 | 0.64 | npe | counts | off-by-one | — |
| Julia | 0 | 8 | 79 | 0.55 | leak | counts | npe | — |
| Scala | 0 | 8 | 39 | 0.50 | leak | counts | npe | — |
| GHC | 0 | 10 | 23 | 0.49 | womm | pin | npe | — |
| OCaml | 0 | 4 | 49 | 0.45 | leak | counts | npe | — |
| Swift ⚠ counts said leak | 0 | 6 | 20 | 0.43 | off-by-one | judge (override) | off-by-one | — |
| GNAT | 0 | 6 | 2 | 0.30 | race | judge | race | — |
| GraalVM ⚠ counts said race | 0 | 1 | 14 | 0.26 | npe | judge (override) | npe | — |
| MLton | 0 | 2 | 4 | 0.24 | race | judge | race | — |
| Codon | 0 | 2 | 2 | 0.20 | race | judge | race | — |
| Mono | 3 | 0 | 4 | 0.19 | npe | judge | npe | — |
| Emscripten | 0 | 1 | 4 | 0.19 | npe | judge | npe | — |
| Yosys | 0 | 0 | 8 | 0.15 | race | judge | race | — |
| CCL | 0 | 1 | 1 | 0.13 | race | judge | race | — |
| MicroHs | 0 | 1 | 1 | 0.13 | heisenbug | judge | heisenbug | — |
| Zig | 0 | 0 | 5 | 0.12 | npe | judge | npe | — |
| Dart | 0 | 0 | 4 | 0.11 | npe | judge | npe | — |
| Crystal | 0 | 0 | 4 | 0.11 | leak | judge | leak | — |
| OpenJDK | 0 | 0 | 3 | 0.09 | off-by-one | judge | off-by-one | — |
| MSVC | 0 | 0 | 3 | 0.09 | npe | judge | npe | — |
| CMUCL | 0 | 1 | 0 | 0.08 | race | judge | race | — |
| ECL | 0 | 1 | 0 | 0.08 | race | judge | race | — |
| Clasp | 0 | 1 | 0 | 0.08 | heisenbug | judge | heisenbug | — |
| p4c | 0 | 0 | 2 | 0.07 | heisenbug | judge | heisenbug | — |
| Elm | 0 | 0 | 2 | 0.07 | leak | judge | leak | — |
| RML | 0 | 0 | 2 | 0.07 | heisenbug | judge | heisenbug | — |
| FPC | 0 | 0 | 1 | 0.05 | leak | judge | leak | — |
| GCL | 0 | 0 | 1 | 0.05 | race | judge | race | — |
| Gambit | 0 | 0 | 1 | 0.05 | race | judge | race | — |
| mrustc | 0 | 0 | 1 | 0.05 | bitflip | pin | race | — |
| PureScript | 0 | 0 | 1 | 0.05 | leak | judge | leak | — |
| Binaryen | 0 | 0 | 1 | 0.05 | race | judge | race | — |
| Idris 2 | 0 | 0 | 1 | 0.05 | race | judge | race | — |
| Vyper | 0 | 0 | 1 | 0.05 | race | judge | race | — |
| SBCL | 0 | 0 | 0 | 0.00 | womm | pin | leak | — |
| ABCL ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Open Watcom ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| DirectXShaderCompiler ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| XL C ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| arocc ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Gerbil ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MKCL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PAKCS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FASM ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Haxe ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Vala ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| CHICKEN | 0 | 0 | 0 | 0.00 | womm | pin | race | — |
| DJGPP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Mezzo ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): Swift (counts said leak, now off-by-one), GraalVM (counts said race, now npe), Reason (counts said off-by-one, now leak), Factor (counts said npe, now race)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## compiler
_Name a compiler_

Works on my machine:
- [ ] SBCL
- [ ] FASM
- [ ] GHC
- [ ] CHICKEN
- [ ] MicroHs
- [ ] mrustc
- [ ] other: 

Bit Flip:
- [ ] arocc
- [ ] mrustc
- [ ] MicroHs
- [ ] Open Watcom
- [ ] PAKCS
- [ ] Gerbil
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 9 |
| harvest | done | 4 |
| filter | done | 45 |
| compare | done | 0 |
| escalate | done | 28 |
| merge | done | 7 |
| obvious | done | 30 |
| dupes | done | 0 |
| links | done | 30 |
| precision | failed | 35 |
| report | pending |  |

## compiler
_Name a compiler_

Works on my machine:
- [ ] SBCL
- [ ] FASM
- [ ] GHC
- [ ] CHICKEN
- [ ] MicroHs
- [ ] mrustc
- [ ] other: 

Bit Flip:
- [ ] arocc
- [ ] mrustc
- [ ] MicroHs
- [ ] Open Watcom
- [ ] PAKCS
- [ ] Gerbil
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 9 |
| harvest | done | 4 |
| filter | done | 45 |
| compare | done | 0 |
| escalate | done | 28 |
| merge | done | 7 |
| obvious | done | 30 |
| dupes | done | 0 |
| links | done | 30 |
| precision | done | 20 |
| report | running |  |

## Precision sample

20/20 sampled answers are members (100%); 19/20 also have an acceptable tier. Not members: none.

## Pipeline report

Generated 2026-11-27 18:52 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/compiler.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (mrustc; SBCL, GHC, CHICKEN): the owner vets them

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 32/32 obvious answers accepted |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | PASS | 59/66 answers have a verified link (89%); prompt link yes |
| precision | PASS | 20/20 sampled answers are members (100%), 19/20 with acceptable tier |
| answer count | PASS | 66 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 3 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 6 | 6 |
| Works on my machine | 3 | 0 |
| Null pointer exception | 19 | 19 |
| Memory leak | 10 | 10 |
| Race condition | 18 | 18 |
| Heisenbug | 9 | 9 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 4.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## compiler
_Name a compiler_

Works on my machine:
- [ ] SBCL
- [ ] FASM
- [ ] GHC
- [ ] CHICKEN
- [ ] MicroHs
- [ ] mrustc
- [ ] other: 

Bit Flip:
- [ ] arocc
- [ ] mrustc
- [ ] MicroHs
- [ ] Open Watcom
- [ ] PAKCS
- [ ] Gerbil
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 9 |
| harvest | done | 4 |
| filter | done | 45 |
| compare | done | 0 |
| escalate | done | 28 |
| merge | done | 7 |
| obvious | done | 0 |
| dupes | done | 0 |
| links | done | 28 |
| precision | done | 0 |
| report | running |  |
