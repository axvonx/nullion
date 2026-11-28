# Scoring: bug (Name a type of bug)

105 answers (Bit Flip and Works on my machine left out); 40 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 11 (10%) | 8 | 4 |
| npe | 33 (31%) | 30 | 7 |
| leak | 7 (7%) | 8 | 1 |
| race | 9 (9%) | 11 | 2 |
| heisenbug | 45 (43%) | 48 | 2 |

Same tier as today: 87/105 (83%).

## Off-by-one (11)

race condition 6.0* [7298c 2407q 0f], buffer overflow 6.0* [3682c 1516q 0f], off-by-one 6.0* [3561c 83q 3f], memory leak 6.0* [2954c 20548q 0f], SQL injection 5.0* [11817c 3814q 0f], segfault 5.0* [4817c 13872q 0f], infinite loop 5.0* [1945c 3650q 0f], stack overflow 5.0* [1540c 4220q 0f], Syntax error 5.0* [1402c 9573q 0f], Logic error 5.0* [415c 44q 0f], deadlock 5.0* [0c 0q 2f]

## Null pointer exception (33)

null pointer dereference 4.3 [2337c 15994q 0f], Cross-site scripting 4.0* [16646c 4506q 1f], Divide by zero 4.0* [9378c 542q 0f], Type error 4.0* [8222c 7782q 0f], integer overflow 4.0* [6357c 1087q 0f], Timezone bug 4.0* [0c 0q 0f], Buffer underwrite 3.1 [3682c 0q 0f], Code injection 3.0* [11926c 2451q 0f], Dangling pointer 3.0* [1801c 169q 0f], Floating-point precision error 3.0* [1289c 368q 0f], Uncaught exception 3.0* [1172c 343q 0f], Out-of-bounds array index 3.0* [446c 0q 0f], Out-of-bounds access 3.0* [446c 0q 0f], Use of uninitialized variable 3.0* [264c 0q 0f], Resource leak 3.0* [166c 211q 0f], use-after-free 2.9 [1801c 7q 0f], Y2038 2.9 [30928c 66q 0f], Character encoding bug 2.7 [9336c 165q 0f], Integer underflow 2.6 [809c 0q 0f], File descriptor leak 2.6 [166c 0q 0f], double free 2.5 [0c 99q 0f], Buffer over-read 2.5 [0c 0q 0f], Format string bug 2.5 [333c 0q 0f], Bit rot 2.4 [8970c 0q 0f], Schrödinbug 2.3 [3990c 0q 0f], Livelock 2.2 [0c 29q 0f], Bohrbug 2.1 [3990c 0q 0f], Prompt injection 2.0* [6716c 0q 0f], Uncontrolled recursion 2.0* [4463c 0q 0f], Stack-based buffer overflow 2.0* [1534c 0q 0f], Assertion failure 2.0* [887c 0q 0f], Heap-based buffer overflow 2.0* [490c 0q 0f], Path traversal 2.0* [0c 85q 0f]

## Memory leak (7)

Command injection 1.8 [11926c 16q 0f], false sharing 1.4 [1086c 94q 0f], Clickjacking 1.4 [2254c 137q 0f], XXE 1.2 [1003c 87q 0f], Double-checked locking 1.1 [897c 144q 0f], Out-of-bounds write 1.0* [345c 223q 0f], Mass assignment 0.7 [113c 323q 0f]

## Race condition (9)

TOCTOU 1.7 [4040c 0q 0f], Remote file inclusion 1.5 [1788c 27q 2f], Server-side request forgery 1.1 [4735c 26q 0f], Open redirect 1.0* [3315c 0q 0f], Deserialization of untrusted data 1.0 [3014c 0q 0f], Billion laughs attack 0.8 [3272c 0q 0f], Mandelbug 0.7 [3990c 3q 0f], Higgs-bugson 0.4 [3990c 0q 0f], Hindenbug 0.0* [3990c 0q 0f]

## Heisenbug (45)

Numeric truncation error 1.9 [1161c 0q 0f], Type confusion 1.9 [0c 0q 0f], Mismatched memory management routines 1.9 [0c 0q 0f], Dependency confusion 1.8 [0c 0q 0f], Improper null termination 1.8 [1203c 0q 0f], ReDoS 1.7 [1323c 0q 0f], Eval injection 1.6 [452c 0q 0f], XML injection 1.6 [0c 0q 0f], Prototype pollution 1.5 [0c 0q 0f], ABA problem 1.5 [1431c 0q 2f], priority inversion 1.4 [947c 17q 0f], Unexpected sign extension 1.4 [565c 0q 0f], NoSQL injection 1.3 [0c 19q 2f], Signal handler race condition 1.3 [0c 0q 0f], torn write 1.3 [0c 0q 0f], LDAP injection 1.2 [80c 0q 0f], Insecure direct object reference 1.1 [604c 0q 0f], CRLF injection 1.1 [0c 0q 0f], CSV injection 1.1 [0c 4q 0f], Write-what-where condition 1.0 [0c 0q 0f], Information disclosure 1.0* [201c 0q 0f], Resource exhaustion 1.0* [94c 0q 0f], Out-of-bounds read 1.0* [0c 0q 0f], Unchecked return value 1.0* [0c 0q 0f], Buffer under-read 1.0* [0c 0q 0f], Zip Slip 1.0 [0c 0q 0f], Confused deputy 1.0 [2470c 0q 0f], Tabnabbing 1.0 [199c 0q 0f], Log forging 0.9 [0c 14q 0f], HTTP request smuggling 0.9 [780c 0q 0f], XPath injection 0.9 [0c 0q 0f], Intent spoofing 0.8 [0c 0q 0f], EL injection 0.7 [0c 0q 0f], DLL preloading 0.7 [0c 0q 0f], HTTP request splitting 0.7 [111c 0q 0f], Loch Ness monster bug 0.6 [0c 0q 0f], HQL injection 0.6 [0c 0q 0f], XQuery injection 0.5 [0c 0q 0f], ANSI injection 0.4 [0c 0q 0f], Algorithm downgrade 0.4 [624c 0q 0f], Cross-site WebSocket hijacking 0.4 [0c 0q 0f], Reflection injection 0.4 [0c 0q 0f], Parser differential 0.4 [0c 0q 0f], Argument injection 0.0* [0c 0q 0f], Stale file descriptor 0.0* [0c 0q 0f]

## Confirmed lines the scores disagree with (never moved)

- null pointer dereference: off-by-one in the bank, scores say npe (null pointer dereference 4.3 [2337c 15994q 0f])
- race condition: npe in the bank, scores say off-by-one (race condition 6.0* [7298c 2407q 0f])
- buffer overflow: npe in the bank, scores say off-by-one (buffer overflow 6.0* [3682c 1516q 0f])
- deadlock: npe in the bank, scores say off-by-one (deadlock 5.0* [0c 0q 2f])
- stack overflow: npe in the bank, scores say off-by-one (stack overflow 5.0* [1540c 4220q 0f])
- use-after-free: leak in the bank, scores say npe (use-after-free 2.9 [1801c 7q 0f])
- double free: leak in the bank, scores say npe (double free 2.5 [0c 99q 0f])
- integer overflow: leak in the bank, scores say npe (integer overflow 4.0* [6357c 1087q 0f])
- priority inversion: race in the bank, scores say heisenbug (priority inversion 1.4 [947c 17q 0f])
- ABA problem: race in the bank, scores say heisenbug (ABA problem 1.5 [1431c 0q 2f])
- Y2038: race in the bank, scores say npe (Y2038 2.9 [30928c 66q 0f])
- Bohrbug: race in the bank, scores say npe (Bohrbug 2.1 [3990c 0q 0f])
- Mandelbug: heisenbug in the bank, scores say race (Mandelbug 0.7 [3990c 3q 0f])
- Schrödinbug: heisenbug in the bank, scores say npe (Schrödinbug 2.3 [3990c 0q 0f])
- Hindenbug: heisenbug in the bank, scores say race (Hindenbug 0.0* [3990c 0q 0f])
- false sharing: heisenbug in the bank, scores say leak (false sharing 1.4 [1086c 94q 0f])

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
