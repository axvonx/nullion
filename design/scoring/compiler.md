# Scoring: compiler (Name a compiler)

65 answers (Bit Flip and Works on my machine left out); 5 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (3%) | 6 | 0 |
| npe | 11 (17%) | 19 | 0 |
| leak | 29 (45%) | 9 | 0 |
| race | 7 (11%) | 18 | 0 |
| heisenbug | 16 (25%) | 13 | 0 |

Same tier as today: 29/65 (45%).

## Off-by-one (2)

GCC 4.9 [10579c 42672q 60f], javac 4.5 [208c 1917441q 45f]

## Null pointer exception (11)

Rust 4.0* [91223c 41106q 52f], MSVC 4.0* [4884c 31768q 1f], Clang 3.9 [7423c 10493q 0f], LLVM 3.5 [13503c 6549q 56f], Go 3.0* [35566c 72951q 54f], tsc 3.0* [17052c 229874q 31f], Swift 2.8 [13916c 333455q 0f], Babel 2.8 [366c 9754q 3f], Scala 2.3 [8831c 112406q 27f], Turbo Pascal 2.2 [3026c 119q 0f], Julia 2.0 [8673c 12636q 22f]

## Memory leak (29)

Zig 2.0 [11816c 323q 40f], gfortran 1.9 [299c 2743q 0f], GraalVM 1.9 [1621c 850q 6f], CoffeeScript 1.6 [1462c 9755q 11f], OCaml 1.6 [11634c 7606q 40f], Crystal 1.6 [1390c 12557q 0f], Emscripten 1.5 [1209c 1269q 14f], TCC 1.5 [2732c 123q 29f], FPC 1.5 [1662c 1356q 36f], ICC 1.5 [831c 764q 0f], Cython 1.4 [2696c 5309q 0f], Nim 1.4 [3158c 684q 34f], XL C 1.3 [0c 120q 0f], ocamlc 1.3 [11634c 0q 0f], mcs 1.3 [2452c 10263q 36f], Elm 1.3 [2068c 1891q 0f], Dart 1.2 [5835c 93772q 0f], Haxe 1.1 [1795c 1632q 18f], Binaryen 1.1 [0c 0q 24f], GNAT 1.0 [618c 428q 0f], Clasp 0.9 [0c 112q 7f], GCL 0.8 [132c 25q 15f], Vala 0.8 [1710c 1005q 49f], Yosys 0.8 [0c 189q 23f], PureScript 0.7 [775c 596q 7f], DirectXShaderCompiler 0.7 [0c 0q 15f], ECL 0.7 [185c 55q 31f], CCL 0.6 [110c 117q 0f], RML 0.4 [0c 118q 2f]

## Race condition (7)

kotlinc 1.9 [0c 61q 1f], Open Watcom 1.1 [1221c 67q 1f], cproc 0.8 [0c 0q 8f], Factor 0.8 [603c 0q 8f], MLton 0.7 [94c 22q 11f], Idris 2 0.5 [1569c 35q 9f], ABCL 0.3 [0c 16q 13f]

## Heisenbug (16)

lcc 1.2 [0c 6q 4f], DJGPP 0.9 [465c 33q 1f], chibicc 0.8 [0c 0q 3f], mypyc 0.8 [0c 9q 0f], MicroHs 0.8 [0c 0q 2f], CMUCL 0.7 [161c 0q 6f], Vyper 0.7 [0c 20q 4f], Gambit 0.7 [168c 39q 0f], Open64 0.6 [0c 0q 0f], p4c 0.6 [0c 0q 1f], Codon 0.5 [0c 0q 4f], Mezzo 0.4 [0c 0q 0f], Gerbil 0.3 [0c 0q 7f], PAKCS 0.3 [0c 0q 2f], MKCL 0.3 [0c 0q 2f], arocc 0.0* [0c 0q 1f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
