# Scoring: tcp-congestion-control-algorithm (Name a TCP congestion control algorithm)

29 answers (Bit Flip and Works on my machine left out); 0 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (7%) | 4 | 0 |
| npe | 3 (10%) | 11 | 0 |
| leak | 2 (7%) | 2 | 0 |
| race | 0 (0%) | 6 | 0 |
| heisenbug | 22 (76%) | 6 | 0 |

Same tier as today: 9/29 (31%).

## Off-by-one (2)

Reno 3.6 [3410c 0q 1f], CUBIC 3.2 [512c 102q 1f]

## Null pointer exception (3)

TCP Tahoe 2.9 [3410c 0q 0f], BBR 2.9 [3410c 3q 0f], NewReno 2.6 [0c 2q 0f]

## Memory leak (2)

Swift 1.0 [0c 333455q 0f], PCC 0.8 [0c 0q 16f]

## Race condition (0)



## Heisenbug (22)

BBRv3 2.0 [0c 0q 0f], BBRv2 1.9 [0c 0q 0f], TCP Westwood 1.6 [47c 0q 1f], TCP BIC 1.4 [60c 0q 4f], Compound TCP 1.4 [57c 0q 0f], TCP Westwood+ 1.4 [0c 0q 0f], HighSpeed TCP 1.3 [11c 0q 0f], DCTCP 1.3 [0c 0q 0f], H-TCP 1.1 [12c 0q 0f], Veno 1.0 [0c 0q 0f], Scalable TCP 1.0 [22c 0q 0f], LEDBAT 0.9 [95c 1q 0f], Copa 0.9 [0c 0q 1f], TIMELY 0.8 [0c 0q 0f], Hybla 0.8 [0c 0q 0f], Illinois 0.8 [0c 0q 0f], Sprout 0.7 [0c 0q 0f], CHD 0.7 [0c 0q 1f], TCP-NV 0.5 [0c 0q 0f], TCP Nice 0.5 [0c 0q 0f], TCP-LP 0.5 [0c 0q 0f], YeAH 0.5 [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
