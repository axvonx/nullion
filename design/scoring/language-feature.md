# Scoring: language-feature (Name a programming language feature)

51 answers (Bit Flip and Works on my machine left out); 11 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 24 (47%) | 24 | 0 |
| npe | 24 (47%) | 24 | 0 |
| leak | 0 (0%) | 0 | 0 |
| race | 0 (0%) | 0 | 0 |
| heisenbug | 3 (6%) | 3 | 0 |

Same tier as today: 51/51 (100%).

## Off-by-one (24)

exception handling 5.5 [1172c 53722q 0f 0s], switch statement 5.3 [1286c 11784q 3f 0s], const 5.3 [0c 10343q 0f 0s], inheritance 5.2 [2041c 836q 0f 0s], modules 5.0 [1748c 22727q 0f 0s], garbage collection 5.0 [6452c 12167q 0f 0s], static typing 4.9 [0c 914q 0f 0s], generics 4.9 [1750c 49718q 0f 0s], interface 4.8 [884c 20067q 1f 0s], lambda 4.8 [2064c 30037q 2f 0s], ternary operator 4.8 [3262c 1982q 0f 0s], enum 4.7 [1803c 22549q 5f 0s], pointers 4.7 [3575c 56664q 0f 0s], iterator 4.7 [668c 14604q 0f 0s], polymorphism 4.7 [0c 0q 0f 0s], default arguments 4.6 [84c 372q 0f 0s], multithreading 4.6 [4893c 140654q 0f 0s], function overloading 4.6 [709c 6925q 0f 0s], dynamic typing 4.6 [0c 251q 0f 0s], string interpolation 4.5 [1451c 1111q 0f 0s], closure 4.5 [3957c 8977q 0f 0s], namespace 4.5 [2856c 12824q 0f 0s], struct 4.5 [1912c 30555q 2f 0s], abstract class 4.4 [529c 5321q 0f 0s]

## Null pointer exception (24)

async await 4.3 [1314c 51715q 3f 0s], type inference 4.3 [1551c 2701q 0f 0s], destructor 4.2 [240c 3198q 0f 0s], tuple 4.1 [6536c 12048q 2f 0s], list comprehension 4.1 [0c 7117q 0f 0s], operator overloading 4.0 [1206c 8524q 0f 0s], goto 4.0* [2010c 1068q 6f 0s], multiple inheritance 4.0* [1804c 2733q 0f 0s], first-class functions 4.0* [1502c 1606q 0f 0s], generator 4.0* [376c 6462q 2f 0s], decorators 4.0* [0c 4986q 0f 0s], preprocessor macro 3.3 [3106c 15516q 1f 0s], reflection 3.3 [2814c 0q 4f 0s], pattern matching 3.0* [1367c 9152q 0f 0s], assertion 3.0* [887c 1475q 0f 0s], implicit coercion 3.0* [780c 2447q 0f 0s], destructuring 3.0* [0c 1361q 0f 0s], set comprehension 2.8 [0c 60q 0f 0s], coroutine 2.7 [0c 2340q 1f 0s], dictionary comprehension 2.7 [0c 871q 0f 0s], tail call optimization 2.5 [3417c 1360q 0f 0s], function-like macro 2.1 [0c 0q 0f 0s], lazy evaluation 2.0* [1697c 2590q 0f 0s], variadic functions 2.0* [1465c 2686q 0f 0s]

## Memory leak (0)



## Race condition (0)



## Heisenbug (3)

derive macro 1.6 [0c 0q 0f 0s], attribute macro 1.6 [0c 0q 0f 0s], concept-based polymorphism 0.8 [1145c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
