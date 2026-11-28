# Scoring: tcp-congestion-control-algorithm (Name a TCP congestion control algorithm)

29 answers (Bit Flip and Works on my machine left out); 0 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (7%) | 2 | 0 |
| npe | 3 (10%) | 3 | 0 |
| leak | 0 (0%) | 0 | 0 |
| race | 0 (0%) | 0 | 0 |
| heisenbug | 24 (83%) | 24 | 0 |

Same tier as today: 29/29 (100%).

## Off-by-one (2)

Reno 3.6 [0c 0q 1f 0s], CUBIC 3.2 [512c 0q 1f 0s]

## Null pointer exception (3)

TCP Tahoe 2.9 [0c 0q 0f 0s], BBR 2.9 [0c 0q 0f 0s], NewReno 2.6 [0c 2q 0f 0s]

## Memory leak (0)



## Race condition (0)



## Heisenbug (24)

BBRv3 2.0 [0c 0q 0f 0s], BBRv2 1.9 [0c 0q 0f 0s], TCP Westwood 1.6 [47c 0q 1f 0s], TCP BIC 1.4 [60c 0q 0f 0s], Compound TCP 1.4 [57c 0q 0f 0s], TCP Westwood+ 1.4 [0c 0q 0f 0s], HighSpeed TCP 1.3 [11c 0q 0f 0s], DCTCP 1.3 [0c 0q 0f 0s], H-TCP 1.1 [12c 0q 0f 0s], Veno 1.0 [0c 0q 0f 0s], Swift 1.0 [0c 0q 0f 0s], Scalable TCP 1.0 [22c 0q 0f 0s], LEDBAT 0.9 [95c 1q 0f 0s], Copa 0.9 [0c 0q 1f 0s], TIMELY 0.8 [0c 0q 0f 0s], PCC 0.8 [0c 0q 0f 0s], Hybla 0.8 [0c 0q 0f 0s], Illinois 0.8 [0c 0q 0f 0s], Sprout 0.7 [0c 0q 0f 0s], CHD 0.7 [0c 0q 0f 0s], TCP-NV 0.5 [0c 0q 0f 0s], TCP Nice 0.5 [0c 0q 0f 0s], TCP-LP 0.5 [0c 0q 0f 0s], YeAH 0.5 [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
