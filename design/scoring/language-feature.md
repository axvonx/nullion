# Scoring: language-feature (Name a programming language feature)

51 answers (Bit Flip and Works on my machine left out); 11 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 24 (47%) | 17 | 0 |
| npe | 24 (47%) | 30 | 0 |
| leak | 0 (0%) | 3 | 0 |
| race | 0 (0%) | 1 | 0 |
| heisenbug | 3 (6%) | 0 | 0 |

Same tier as today: 34/51 (67%).

## Off-by-one (24)

exception handling 5.5 [1172c 53722q 0f], switch statement 5.3 [1286c 11784q 3f], const 5.3 [0c 10343q 0f], inheritance 5.2 [2041c 836q 0f], modules 5.0 [1748c 22727q 0f], garbage collection 5.0 [6452c 12167q 0f], static typing 4.9 [8222c 914q 0f], generics 4.9 [1750c 49718q 0f], interface 4.8 [884c 20067q 1f], lambda 4.8 [2064c 30037q 2f], ternary operator 4.8 [3262c 1982q 0f], enum 4.7 [1803c 22549q 5f], pointers 4.7 [3575c 56664q 0f], polymorphism 4.7 [4193c 0q 0f], iterator 4.7 [668c 14604q 0f], default arguments 4.6 [84c 372q 0f], multithreading 4.6 [4893c 140654q 0f], function overloading 4.6 [709c 6925q 0f], dynamic typing 4.6 [8222c 251q 0f], string interpolation 4.5 [1451c 1111q 0f], closure 4.5 [3957c 8977q 0f], namespace 4.5 [2856c 12824q 0f], struct 4.5 [1912c 30555q 2f], abstract class 4.4 [529c 5321q 0f]

## Null pointer exception (24)

async await 4.3 [1314c 51715q 3f], type inference 4.3 [1551c 2701q 0f], destructor 4.2 [240c 3198q 0f], tuple 4.1 [6536c 12048q 2f], list comprehension 4.1 [600c 7117q 0f], operator overloading 4.0 [1206c 8524q 0f], goto 4.0* [2010c 1068q 6f], multiple inheritance 4.0* [1804c 2733q 0f], first-class functions 4.0* [1502c 1606q 0f], generator 4.0* [376c 6462q 2f], decorators 4.0* [0c 4986q 0f], preprocessor macro 3.3 [3106c 15516q 1f], reflection 3.3 [2814c 0q 4f], pattern matching 3.0* [1367c 9152q 0f], assertion 3.0* [887c 1475q 0f], implicit coercion 3.0* [780c 2447q 0f], destructuring 3.0* [0c 1361q 0f], set comprehension 2.8 [600c 60q 0f], coroutine 2.7 [2653c 2340q 1f], dictionary comprehension 2.7 [600c 871q 0f], tail call optimization 2.5 [3417c 1360q 0f], function-like macro 2.1 [0c 0q 0f], lazy evaluation 2.0* [1697c 2590q 0f], variadic functions 2.0* [1465c 2686q 0f]

## Memory leak (0)



## Race condition (0)



## Heisenbug (3)

derive macro 1.6 [0c 0q 0f], attribute macro 1.6 [0c 0q 0f], concept-based polymorphism 0.8 [1145c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
