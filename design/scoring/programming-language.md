# Scoring: programming-language (Name a programming language)

1873 answers (Bit Flip and Works on my machine left out); 67 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 10 (1%) | 11 | 0 |
| npe | 35 (2%) | 34 | 1 |
| leak | 424 (23%) | 387 | 2 |
| race | 95 (5%) | 108 | 0 |
| heisenbug | 1309 (70%) | 1333 | 1 |

Same tier as today: 1686/1873 (90%).

## Off-by-one (10)

Py 6.0* [0c 2192438q 1f], Python 5.7 [119901c 2199764q 66f], JavaScript 5.4 [42112c 2530062q 1f], Java 5.1 [33757c 1922483q 1f], PHP 5.0* [290540c 1475484q 52f], C# 5.0* [19121c 1615563q 0f], TypeScript 5.0* [17052c 229874q 31f], Ruby 5.0* [12973c 230126q 54f], C++ 4.6 [50570c 807468q 1f], C 4.6 [117694c 405216q 6f]

## Null pointer exception (35)

SQL 4.2 [25213c 672885q 0f], Swift 4.0* [13916c 333455q 11f], BASIC 4.0* [12414c 880q 0f], BASIC Programming 4.0* [0c 0q 0f], Go 3.8 [35566c 72951q 54f], Rust 3.7 [91223c 41106q 52f], assembly language 3.6 [32599c 44245q 0f], assembler 3.4 [32599c 0q 0f], R 3.1 [59264c 506158q 47f], Kotlin 2.9 [0c 95207q 20f], PowerShell 2.9 [11877c 127535q 16f], MATLAB 2.8 [10705c 95222q 2f], Perl 2.8 [10351c 70605q 56f], Pascal 2.5 [11638c 2620q 0f], Lua 2.4 [0c 22800q 61f], Sed 2.4 [3746c 37532q 60f], COBOL 2.4 [21658c 1744q 0f], Lisp 2.4 [18461c 7015q 1f], Scala 2.4 [8831c 112406q 27f], Shell Programming/Introduction 2.4 [0c 110423q 0f], Bourne shell 2.3 [3671c 8601q 0f], Pauscal 2.3 [0c 0q 0f], Scratch 2.3 [38309c 307q 20f], WebAssembly 2.3 [13597c 2947q 0f], AWK 2.2 [5870c 42007q 0f], Embedded C 2.2 [0c 0q 0f], Visual Basic .NET 2.1 [5738c 140350q 0f], Haskell 2.1 [10460c 51334q 0f], Transact-SQL 2.1 [0c 73221q 1f], Fortran 2.0 [22679c 13087q 0f], Microsoft BASIC 2.0 [0c 0q 0f], x86 assembly language 2.0 [5169c 135q 0f], Cascading Style Sheets 2.0* [24905c 0q 0f], Visual Basic for Applications 2.0 [3102c 217882q 2f], Python 3 2.0* [0c 344360q 0f]

## Memory leak (424)

Dart 2.0 [5835c 93772q 0f], PL/SQL 2.0 [1402c 28945q 0f], XML 2.0 [13851c 215657q 0f], Objective-C 1.9 [6956c 292332q 3f], Visual Basic Script 1.9 [2683c 19410q 1f], Erlang 1.9 [7401c 9699q 42f], Java 21 1.8 [0c 136q 0f], Elixir 1.8 [5224c 9561q 34f], Active Server Pages 1.8 [1467c 376026q 2f], Julia 1.8 [8673c 12636q 22f], C shell 1.8 [1917c 1138q 43f], Ada 1.8 [12084c 2400q 29f], Svelte 1.8 [0c 5858q 0f], ML 1.8 [4098c 673q 1f], SAS Language 1.8 [0c 16595q 0f], TeX 1.7 [10085c 904q 0f], jq 1.7 [0c 7112q 57f], Hack 1.7 [5376c 481q 0f], bc 1.7 [902c 424q 0f], Arduino 1.7 [0c 19581q 25f], Sass 1.7 [1272c 27568q 0f], Blockly 1.7 [0c 198q 0f], Mathematica 1.6 [4934c 4573q 10f], Zig 1.6 [11816c 323q 40f], XPath 1.6 [1777c 39421q 0f], Delphi 1.6 [0c 51905q 0f], Solidity 1.6 [0c 6662q 12f], Prolog 1.6 [7570c 13437q 0f], Extensible Application Markup Language 1.6 [840c 62511q 0f], QBasic 1.6 [2678c 180q 0f], JScript 1.6 [912c 1191q 0f], CoffeeScript 1.6 [1462c 9755q 11f], JSX 1.5 [0c 9249q 0f], Clojure 1.5 [4677c 17680q 21f], Turbo C++ 1.5 [0c 421q 29f], Simulink 1.5 [1592c 2898q 0f], OCaml 1.5 [11634c 7606q 40f], Object Pascal 1.5 [1702c 51860q 0f], FoxPro 1.5 [0c 850q 0f], UNITY 1.5 [0c 76679q 0f], Processing 1.5 [7416c 6965q 13f], Common Lisp 1.5 [3991c 6299q 0f], Turbo Pascal 1.5 [3026c 119q 0f], Netwide Assembler 1.5 [1142c 5200q 58f], KornShell 1.5 [0c 3738q 25f], AutoHotkey 1.4 [5019c 6069q 5f], RPG 1.4 [1609c 289q 3f], Apache Ant 1.4 [529c 15456q 43f], Tcl 1.4 [0c 8097q 0f], PRINT 1.4 [0c 25622q 0f], F# 1.3 [4659c 16979q 7f], ABAP 1.3 [2241c 3373q 0f], Smalltalk 1.3 [7734c 1702q 16f], Stata 1.3 [0c 4684q 2f], Luau 1.3 [0c 144q 12f], XSLT 1.3 [3090c 38543q 0f], Expect 1.3 [0c 3220q 46f], Crystal 1.3 [0c 12557q 17f], Cython 1.3 [0c 5309q 0f], GDScript 1.3 [0c 1036q 1f] ...

## Race condition (95)

make 2.0 [5672c 0q 61f], Classic Visual Basic 1.8 [5871c 0q 0f], ladder logic 1.6 [3850c 34q 0f], Apache Groovy 1.4 [3010c 0q 1f], PL/I 1.2 [3295c 30q 2f], QuickBASIC 1.2 [0c 40q 0f], Atom 1.1 [0c 40q 7f], Logo 1.1 [5460c 0q 0f], GAUSS 1.1 [0c 43q 0f], Karel 1.1 [0c 47q 0f], S2 1.1 [0c 26q 2f], GNU Common Lisp 1.1 [0c 25q 0f], ALGOL 1.0 [3555c 22q 0f], Rex 1.0 [0c 44q 0f], Motoko 1.0 [0c 34q 2f], Squirrel 1.0 [0c 39q 22f], JaM 0.9 [0c 46q 20f], Gleam 0.9 [0c 10q 21f], S-PLUS 0.9 [0c 26q 0f], Robotc 0.9 [0c 29q 0f], Elvish 0.8 [0c 4q 22f], Triton 0.8 [0c 35q 9f], Starlark 0.8 [0c 44q 2f], Curry 0.8 [0c 23q 0f], Grace 0.8 [0c 0q 20f], Cub 0.8 [0c 49q 3f], KTurtle 0.8 [0c 0q 30f], Malbolge 0.8 [6326c 7q 3f], njs 0.7 [0c 24q 6f], Asymptote 0.7 [0c 26q 26f], Alpaca 0.7 [0c 49q 0f], DIGITAL Command Language 0.7 [0c 40q 2f], ChucK 0.7 [0c 22q 14f], STELLA 0.7 [0c 0q 26f], CHIP-8 0.7 [0c 31q 0f], DataFlex 0.7 [0c 20q 0f], PL/Java 0.7 [0c 37q 0f], AngelScript 0.7 [0c 27q 20f], Janet 0.7 [0c 3q 23f], Allegro Common Lisp 0.7 [0c 36q 0f], Ada 2012 0.6 [0c 41q 0f], NCL 0.6 [0c 33q 6f], Cyclone 0.6 [0c 28q 0f], Guppy 0.6 [0c 24q 0f], Hyperscript 0.6 [0c 37q 0f], Uniface 0.6 [0c 24q 0f], F* 0.6 [0c 31q 5f], PL/Perl 0.6 [0c 39q 0f], SQLPL 0.6 [0c 40q 0f], CLIST 0.6 [0c 27q 5f], Opal 0.6 [0c 41q 0f], Qi 0.6 [0c 33q 2f], Miranda 0.6 [0c 21q 0f], Boomerang 0.6 [0c 24q 0f], FreeBASIC 0.6 [828c 44q 14f], Spectator 0.6 [0c 20q 4f], Alice 0.6 [0c 26q 0f], Csound 0.5 [0c 43q 22f], MoonScript 0.5 [0c 21q 3f], IronScheme 0.5 [0c 21q 0f] ...

## Heisenbug (1309)

Visual T# 1.9 [0c 0q 0f], Visual Basic 6 1.9 [0c 0q 0f], Vintage BASIC 1.8 [0c 0q 1f], A# 1.8 [0c 0q 0f], ABasiC 1.7 [0c 0q 0f], GNU Awk 1.5 [0c 0q 0f], CSS preprocessor 1.5 [0c 0q 0f], ARM Assembly 1.5 [0c 0q 0f], rank 1.4 [0c 0q 1f], Web Language 1.4 [0c 0q 0f], Arduino programming language 1.4 [0c 0q 0f], Snek 1.4 [0c 0q 1f], Commodore BASIC 1.4 [0c 0q 8f], Pizza 1.4 [0c 0q 0f], Access BASIC 1.3 [0c 0q 0f], Dartmouth BASIC 1.3 [0c 0q 0f], AutoHotkey language 1.3 [0c 0q 0f], HQ9++ 1.3 [0c 0q 0f], Turbo Basic 1.3 [0c 5q 0f], Microsoft C 1.3 [0c 0q 0f], GEORGE 1.2 [0c 0q 0f], Haggis 1.2 [0c 0q 0f], IPTSCRAE 1.2 [0c 0q 0f], FLOW 1.2 [0c 0q 0f], Portable Standard Lisp 1.2 [0c 0q 0f], CGOL 1.2 [0c 0q 0f], Newspeak 1.2 [0c 6q 0f], ABLE 1.2 [0c 0q 0f], RPG IV 1.2 [0c 0q 0f], Ada 83 1.1 [0c 0q 0f], Virgil 1.1 [0c 0q 0f], RISC-V assembly language 1.1 [0c 0q 0f], SQL*Plus 1.1 [0c 0q 0f], INTERCAL 1.1 [2105c 3q 7f], JSFuck 1.1 [0c 12q 1f], Sing# 1.1 [0c 0q 0f], P# 1.1 [0c 0q 0f], Sinclair BASIC 1.1 [0c 0q 0f], ACUCOBOL 1.1 [0c 0q 0f], READ/PRINT 1.1 [0c 0q 0f], CurlyWas 1.1 [0c 0q 0f], FP 1.1 [0c 0q 1f], Pyrex 1.1 [0c 10q 0f], Sue 1.1 [0c 0q 1f], Famous Writer 1.1 [0c 0q 0f], Modula 1.1 [0c 0q 0f], Yorick 1.1 [0c 1q 7f], Microsoft Pascal 1.1 [0c 0q 0f], Ciao 1.1 [0c 0q 2f], Argh! 1.1 [0c 5q 0f], PS 440 1.1 [0c 0q 0f], Atari Microsoft BASIC 1.1 [0c 0q 0f], M language 1.1 [0c 0q 0f], SKILL 1.1 [0c 0q 2f], LOLCODE 1.1 [2051c 16q 0f], o:XML 1.1 [0c 0q 0f], Hermes 1.1 [0c 0q 0f], Neo Sign 0f Misery 1.1 [0c 0q 0f], GNU Octave 1.1 [2560c 0q 0f], Alef 1.1 [0c 0q 0f] ...

## Confirmed lines the scores disagree with (never moved)

- Rust: off-by-one in the bank, scores say npe (Rust 3.7 [91223c 41106q 52f])
- APL: race in the bank, scores say leak (APL 0.9 [5617c 364q 17f])
- Forth: race in the bank, scores say leak (Forth 1.0 [6439c 292q 0f])
- Simula: race in the bank, scores say heisenbug (Simula 0.6 [2015c 0q 0f])

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
