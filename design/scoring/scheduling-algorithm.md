# Scoring: scheduling-algorithm (Name a scheduling algorithm)

109 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 3 (3%) | 3 | 0 |
| npe | 20 (18%) | 20 | 0 |
| leak | 2 (2%) | 2 | 0 |
| race | 5 (5%) | 5 | 0 |
| heisenbug | 79 (72%) | 79 | 0 |

Same tier as today: 109/109 (100%).

## Off-by-one (3)

First come first served 5.2 [0c 0q 1f 0s], Round robin 4.9 [0c 390q 1f 0s], Priority scheduling 4.6 [0c 0q 0f 0s]

## Null pointer exception (20)

Shortest job first 4.4 [0c 0q 0f 0s], Shortest remaining time first 3.6 [0c 0q 0f 0s], Priority queueing 3.5 [0c 0q 0f 0s], Longest job first 3.4 [0c 0q 0f 0s], Shortest seek first 3.3 [0c 0q 0f 0s], Multilevel feedback queue 3.2 [0c 0q 0f 0s], Earliest deadline first 3.2 [0c 0q 0f 0s], Completely Fair Scheduler 3.0 [0c 0q 0f 0s], Multilevel queue 3.0 [0c 0q 0f 0s], Weighted round robin 2.9 [0c 0q 0f 0s], O(1) scheduler 2.8 [0c 0q 0f 0s], SCHED_FIFO 2.7 [0c 0q 0f 0s], C-SCAN 2.6 [0c 0q 0f 0s], Deadline scheduler 2.4 [0c 0q 0f 0s], BFS 2.3 [0c 0q 0f 0s], Highest response ratio next 2.3 [0c 0q 0f 0s], LOOK 2.3 [0c 0q 3f 0s], C-LOOK 2.2 [0c 0q 0f 0s], Backfilling 2.1 [0c 0q 0f 0s], Rate-monotonic scheduling 2.1 [0c 0q 0f 0s]

## Memory leak (2)

Tetris 0.9 [0c 287q 0f 0s], Cilk 0.4 [0c 72q 2f 0s]

## Race condition (5)

SCHED_DEADLINE 0.8 [0c 16q 0f 0s], scx_rusty 0.8 [0c 0q 1f 2267s], scx_lavd 0.6 [0c 0q 1f 2267s], scx_bpfland 0.5 [0c 0q 1f 2267s], scx_layered 0.5 [0c 0q 1f 2267s]

## Heisenbug (79)

Proportional share scheduling 2.0 [0c 0q 1f 0s], Foreground-background 2.0 [0c 0q 0f 0s], Least Attained Service 2.0 [0c 0q 0f 0s], Least slack time scheduling 1.9 [0c 0q 0f 0s], Proportional-fair scheduling 1.9 [0c 0q 0f 0s], Weighted fair queueing 1.9 [0c 0q 0f 0s], Completely fair queueing 1.9 [0c 0q 0f 0s], PIE 1.8 [0c 0q 0f 0s], Fair queuing 1.7 [0c 0q 0f 0s], Deadline-monotonic scheduling 1.7 [0c 0q 0f 0s], Virtual Clock 1.7 [0c 0q 0f 0s], Energy aware scheduling 1.7 [0c 0q 0f 0s], Deficit round robin 1.6 [0c 0q 0f 0s], Credit Scheduler 1.6 [0c 0q 0f 0s], CAKE 1.6 [0c 0q 0f 0s], Core scheduling 1.6 [0c 0q 0f 0s], N-Step-SCAN 1.5 [0c 0q 0f 0s], Token bucket 1.5 [0c 0q 1f 85s], Global EDF 1.5 [0c 0q 0f 0s], FSCAN 1.4 [0c 0q 4f 0s], Credit-based fair queuing 1.3 [0c 0q 0f 0s], Generalized processor sharing 1.3 [0c 0q 0f 0s], Windows NT processor scheduling 1.2 [0c 0q 0f 0s], Deficit Weighted Round Robin 1.2 [0c 0q 0f 0s], Gang scheduling 1.2 [0c 0q 0f 0s], Hierarchical token bucket 1.2 [0c 0q 0f 0s], Dominant resource fairness 1.2 [0c 0q 0f 0s], YDS algorithm 1.1 [0c 0q 0f 0s], Borrowed virtual time 1.1 [0c 0q 0f 0s], Stride scheduling 1.1 [0c 0q 3f 0s], Stochastic Fair Queueing 1.1 [0c 0q 0f 0s], GMP scheduler 1.1 [0c 0q 0f 0s], BFQ 1.1 [0c 0q 0f 0s], Class-based queueing 1.1 [0c 0q 0f 0s], Anticipatory scheduling 1.0 [0c 0q 0f 0s], scx_cpu0 1.0 [0c 0q 0f 0s], CoDel 1.0 [0c 0q 0f 0s], FQ-PIE 1.0 [0c 0q 0f 0s], Noop scheduler 1.0 [0c 0q 0f 0s], Anticipatory scheduler 1.0 [0c 0q 0f 0s], Random early detection 0.9 [0c 0q 0f 0s], ULE 0.9 [0c 0q 0f 0s], Earliest TxTime First 0.8 [0c 0q 0f 0s], ALTQ 0.8 [0c 0q 0f 0s], Generalized foreground-background 0.8 [0c 0q 0f 0s], FQ-CoDel 0.8 [0c 0q 0f 0s], TAPRIO 0.8 [0c 0q 0f 0s], Pinwheel scheduling 0.7 [0c 0q 0f 0s], Adaptive partition scheduler 0.7 [0c 0q 0f 0s], Kyber 0.7 [0c 0q 0f 0s], Quick Fair Queueing 0.7 [0c 0q 0f 0s], Self-Clocked Fair Queueing 0.7 [0c 0q 0f 0s], Multifit algorithm 0.7 [0c 0q 0f 0s], Stochastic Fair Blue 0.7 [0c 0q 0f 0s], Stack resource policy 0.7 [0c 0q 0f 0s], scx_sdt 0.6 [0c 0q 0f 0s], Hierarchical fair-service curve 0.6 [0c 0q 0f 0s], Pfair scheduling 0.6 [0c 0q 0f 0s], EEVDF 0.6 [0c 0q 0f 0s], scx_cake 0.6 [0c 0q 0f 0s] ...

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
