# Scoring: compiler (Name a compiler)

65 answers (Bit Flip and Works on my machine left out); 5 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (3%) | 2 | 0 |
| npe | 19 (29%) | 19 | 0 |
| leak | 14 (22%) | 14 | 0 |
| race | 10 (15%) | 10 | 0 |
| heisenbug | 20 (31%) | 20 | 0 |

Same tier as today: 65/65 (100%).

## Off-by-one (2)

GCC 4.9 [10579c 0q 0f 0s], javac 4.5 [208c 1917441q 45f 0s]

## Null pointer exception (19)

Rust 4.0* [91223c 0q 52f 122448s], MSVC 4.0* [4884c 31768q 1f 0s], Clang 3.9 [7423c 10398q 0f 0s], LLVM 3.5 [13503c 6549q 56f 41636s], Go 3.0* [35566c 72925q 0f 0s], tsc 3.0* [17052c 0q 31f 111933s], Swift 2.8 [13916c 21q 0f 0s], Babel 2.8 [366c 9754q 3f 44071s], Scala 2.3 [8831c 175q 27f 6340s], Turbo Pascal 2.2 [3026c 119q 0f 0s], Julia 2.0 [8673c 12636q 22f 0s], Zig 2.0 [11816c 0q 0f 43395s]^, kotlinc 1.9 [0c 61q 1f 53665s]^, GraalVM 1.9 [1621c 850q 6f 21765s]^, OCaml 1.6 [0c 7606q 40f 6653s]^, FPC 1.5 [1662c 1356q 0f 0s]^, Cython 1.4 [2696c 5309q 0f 0s]^, Haxe 1.1 [1795c 1632q 18f 6966s]^, Vala 0.8 [1710c 1005q 49f 0s]^

## Memory leak (14)

gfortran 1.9 [299c 2743q 0f 0s], CoffeeScript 1.6 [1462c 9755q 11f 0s], Emscripten 1.5 [1209c 1269q 14f 0s], ICC 1.5 [831c 751q 0f 0s], Nim 1.4 [3158c 0q 0f 18359s], Dart 1.2 [5835c 199q 0f 0s], Open Watcom 1.1 [1221c 67q 1f 0s], Binaryen 1.1 [0c 0q 24f 8692s], DJGPP 0.9 [465c 33q 1f 0s], chibicc 0.8 [0c 0q 3f 12015s], Yosys 0.8 [0c 189q 23f 0s], PureScript 0.7 [775c 596q 7f 8933s], Idris 2 0.5 [1569c 35q 9f 3123s], Codon 0.5 [0c 0q 4f 16866s]

## Race condition (10)

TCC 1.5 [2732c 0q 0f 3113s], mcs 1.3 [2452c 0q 36f 0s], Elm 1.3 [2068c 0q 0f 0s], GCL 0.8 [132c 25q 0f 0s], DirectXShaderCompiler 0.7 [0c 0q 15f 3707s], Vyper 0.7 [0c 20q 4f 0s], MLton 0.7 [94c 22q 11f 1106s], CCL 0.6 [110c 19q 0f 0s], ABCL 0.3 [0c 16q 13f 0s], arocc 0.0* [0c 0q 1f 1869s]

## Heisenbug (20)

Crystal 1.6 [1390c 0q 0f 0s], XL C 1.3 [0c 0q 0f 0s], ocamlc 1.3 [0c 0q 0f 0s], lcc 1.2 [0c 0q 0f 0s], GNAT 1.0 [618c 0q 0f 0s], Clasp 0.9 [0c 0q 7f 0s], cproc 0.8 [0c 0q 8f 858s], MicroHs 0.8 [0c 0q 2f 0s], mypyc 0.8 [0c 9q 0f 0s], Factor 0.8 [603c 0q 8f 0s], ECL 0.7 [185c 0q 0f 0s], CMUCL 0.7 [161c 0q 6f 0s], Gambit 0.7 [168c 0q 0f 0s], Open64 0.6 [189c 0q 0f 0s], p4c 0.6 [0c 0q 0f 852s], RML 0.4 [0c 0q 0f 0s], Mezzo 0.4 [0c 0q 0f 0s], Gerbil 0.3 [0c 0q 7f 0s], PAKCS 0.3 [0c 0q 2f 0s], MKCL 0.3 [0c 0q 2f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
