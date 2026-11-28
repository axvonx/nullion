# Scoring: bug (Name a type of bug)

105 answers (Bit Flip and Works on my machine left out); 40 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 11 (10%) | 8 | 4 |
| npe | 33 (31%) | 30 | 7 |
| leak | 5 (5%) | 7 | 1 |
| race | 9 (9%) | 12 | 0 |
| heisenbug | 47 (45%) | 48 | 1 |

Same tier as today: 92/105 (88%).

## Off-by-one (11)

race condition 6.0* [7298c 2407q 0f 0s], off-by-one 6.0* [3561c 53q 3f 0s], memory leak 6.0* [2954c 20548q 0f 0s], buffer overflow 6.0* [0c 1516q 0f 0s], SQL injection 5.0* [11817c 3814q 0f 0s], segfault 5.0* [4817c 13872q 0f 0s], deadlock 5.0* [3277c 0q 2f 0s], infinite loop 5.0* [1945c 3650q 0f 0s], stack overflow 5.0* [1540c 4220q 0f 0s], Syntax error 5.0* [1402c 9573q 0f 0s], Logic error 5.0* [415c 44q 0f 0s]

## Null pointer exception (33)

null pointer dereference 4.3 [2337c 15994q 0f 0s], Cross-site scripting 4.0* [16646c 4495q 0f 0s], Divide by zero 4.0* [9378c 542q 0f 0s], integer overflow 4.0* [6357c 1087q 0f 0s], Type error 4.0* [0c 7782q 0f 0s], Timezone bug 4.0* [0c 0q 0f 0s], Buffer underwrite 3.1 [0c 0q 0f 0s], Floating-point precision error 3.0* [1289c 368q 0f 0s], Uncaught exception 3.0* [1172c 343q 0f 0s], Use of uninitialized variable 3.0* [264c 0q 0f 0s], Out-of-bounds array index 3.0* [0c 0q 0f 0s], Code injection 3.0* [0c 2451q 0f 0s], Out-of-bounds access 3.0* [0c 0q 0f 0s], Resource leak 3.0* [0c 211q 0f 0s], Dangling pointer 3.0* [0c 169q 0f 0s], use-after-free 2.9 [0c 0q 0f 0s], Y2038 2.9 [30928c 66q 0f 0s], Character encoding bug 2.7 [9336c 165q 0f 0s], Integer underflow 2.6 [809c 0q 0f 0s], File descriptor leak 2.6 [0c 0q 0f 0s], double free 2.5 [0c 99q 0f 0s], Buffer over-read 2.5 [0c 0q 0f 0s], Format string bug 2.5 [333c 0q 0f 0s], Bit rot 2.4 [8970c 0q 0f 0s], Schrödinbug 2.3 [0c 0q 0f 0s], Livelock 2.2 [0c 29q 0f 0s], Bohrbug 2.1 [0c 0q 0f 0s], Prompt injection 2.0* [6716c 0q 0f 0s], Uncontrolled recursion 2.0* [4463c 0q 0f 0s], Stack-based buffer overflow 2.0* [1534c 0q 0f 0s], Assertion failure 2.0* [887c 0q 0f 0s], Heap-based buffer overflow 2.0* [490c 0q 0f 0s], Path traversal 2.0* [0c 85q 0f 0s]

## Memory leak (5)

false sharing 1.4 [1086c 94q 0f 0s], Clickjacking 1.4 [2254c 137q 0f 0s], Double-checked locking 1.1 [897c 144q 0f 0s], Out-of-bounds write 1.0* [345c 223q 0f 0s], Mass assignment 0.7 [113c 323q 0f 0s]

## Race condition (9)

Command injection 1.8 [0c 16q 0f 0s], TOCTOU 1.7 [4040c 0q 0f 0s], Remote file inclusion 1.5 [1788c 27q 0f 0s], priority inversion 1.4 [947c 17q 0f 0s], NoSQL injection 1.3 [0c 19q 2f 0s], Server-side request forgery 1.1 [4735c 26q 0f 0s], Confused deputy 1.0 [2470c 0q 0f 0s], Log forging 0.9 [0c 14q 0f 0s], Billion laughs attack 0.8 [3272c 0q 0f 0s]

## Heisenbug (47)

Numeric truncation error 1.9 [1161c 0q 0f 0s], Type confusion 1.9 [0c 0q 0f 0s], Mismatched memory management routines 1.9 [0c 0q 0f 0s], Dependency confusion 1.8 [0c 0q 0f 0s], Improper null termination 1.8 [1203c 0q 0f 0s], ReDoS 1.7 [1323c 0q 0f 0s], Eval injection 1.6 [452c 0q 0f 0s], XML injection 1.6 [0c 0q 0f 0s], Prototype pollution 1.5 [0c 0q 0f 0s], ABA problem 1.5 [1431c 0q 0f 0s], Unexpected sign extension 1.4 [565c 0q 0f 0s], Signal handler race condition 1.3 [0c 0q 0f 0s], torn write 1.3 [0c 0q 0f 0s], XXE 1.2 [1003c 0q 0f 0s], LDAP injection 1.2 [80c 0q 0f 0s], Insecure direct object reference 1.1 [604c 0q 0f 0s], CRLF injection 1.1 [0c 0q 0f 0s], CSV injection 1.1 [0c 4q 0f 0s], Write-what-where condition 1.0 [0c 0q 0f 0s], Information disclosure 1.0* [201c 0q 0f 0s], Resource exhaustion 1.0* [94c 0q 0f 0s], Out-of-bounds read 1.0* [0c 0q 0f 0s], Unchecked return value 1.0* [0c 0q 0f 0s], Buffer under-read 1.0* [0c 0q 0f 0s], Zip Slip 1.0 [0c 0q 0f 0s], Open redirect 1.0* [0c 0q 0f 0s], Tabnabbing 1.0 [199c 0q 0f 0s], Deserialization of untrusted data 1.0 [0c 0q 0f 0s], HTTP request smuggling 0.9 [780c 0q 0f 0s], XPath injection 0.9 [0c 0q 0f 0s], Intent spoofing 0.8 [0c 0q 0f 0s], Mandelbug 0.7 [0c 3q 0f 0s], EL injection 0.7 [0c 0q 0f 0s], DLL preloading 0.7 [0c 0q 0f 0s], HTTP request splitting 0.7 [111c 0q 0f 0s], Loch Ness monster bug 0.6 [0c 0q 0f 0s], HQL injection 0.6 [0c 0q 0f 0s], XQuery injection 0.5 [0c 0q 0f 0s], ANSI injection 0.4 [0c 0q 0f 0s], Algorithm downgrade 0.4 [624c 0q 0f 0s], Cross-site WebSocket hijacking 0.4 [0c 0q 0f 0s], Reflection injection 0.4 [0c 0q 0f 0s], Higgs-bugson 0.4 [0c 0q 0f 0s], Parser differential 0.4 [0c 0q 0f 0s], Hindenbug 0.0* [0c 0q 0f 0s], Argument injection 0.0* [0c 0q 0f 0s], Stale file descriptor 0.0* [0c 0q 0f 0s]

## Confirmed lines the scores disagree with (never moved)

- null pointer dereference: off-by-one in the bank, scores say npe (null pointer dereference 4.3 [2337c 15994q 0f 0s])
- race condition: npe in the bank, scores say off-by-one (race condition 6.0* [7298c 2407q 0f 0s])
- buffer overflow: npe in the bank, scores say off-by-one (buffer overflow 6.0* [0c 1516q 0f 0s])
- deadlock: npe in the bank, scores say off-by-one (deadlock 5.0* [3277c 0q 2f 0s])
- stack overflow: npe in the bank, scores say off-by-one (stack overflow 5.0* [1540c 4220q 0f 0s])
- use-after-free: leak in the bank, scores say npe (use-after-free 2.9 [0c 0q 0f 0s])
- double free: leak in the bank, scores say npe (double free 2.5 [0c 99q 0f 0s])
- integer overflow: leak in the bank, scores say npe (integer overflow 4.0* [6357c 1087q 0f 0s])
- ABA problem: race in the bank, scores say heisenbug (ABA problem 1.5 [1431c 0q 0f 0s])
- Y2038: race in the bank, scores say npe (Y2038 2.9 [30928c 66q 0f 0s])
- Bohrbug: race in the bank, scores say npe (Bohrbug 2.1 [0c 0q 0f 0s])
- Schrödinbug: heisenbug in the bank, scores say npe (Schrödinbug 2.3 [0c 0q 0f 0s])
- false sharing: heisenbug in the bank, scores say leak (false sharing 1.4 [1086c 94q 0f 0s])

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
