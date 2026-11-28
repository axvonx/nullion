# Scoring: scheduling-algorithm (Name a scheduling algorithm)

109 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 3 (3%) | 3 | 0 |
| npe | 20 (18%) | 20 | 0 |
| leak | 8 (7%) | 7 | 0 |
| race | 1 (1%) | 1 | 0 |
| heisenbug | 77 (71%) | 78 | 0 |

Same tier as today: 107/109 (98%).

## Off-by-one (3)

First come first served 5.2 [0c 1407q 1f], Round robin 4.9 [0c 390q 1f], Priority scheduling 4.6 [0c 0q 0f]

## Null pointer exception (20)

Shortest job first 4.4 [0c 0q 0f], Shortest remaining time first 3.6 [0c 0q 0f], Priority queueing 3.5 [0c 0q 0f], Longest job first 3.4 [0c 0q 0f], Shortest seek first 3.3 [0c 0q 0f], Multilevel feedback queue 3.2 [0c 0q 0f], Earliest deadline first 3.2 [0c 42q 0f], Completely Fair Scheduler 3.0 [0c 50q 2f], Multilevel queue 3.0 [0c 0q 0f], Weighted round robin 2.9 [0c 0q 0f], O(1) scheduler 2.8 [0c 0q 0f], SCHED_FIFO 2.7 [0c 0q 0f], C-SCAN 2.6 [0c 0q 0f], Deadline scheduler 2.4 [0c 0q 0f], BFS 2.3 [0c 2237q 22f], Highest response ratio next 2.3 [0c 0q 0f], LOOK 2.3 [0c 0q 3f], C-LOOK 2.2 [0c 0q 0f], Backfilling 2.1 [0c 0q 0f], Rate-monotonic scheduling 2.1 [0c 223q 0f]

## Memory leak (8)

Deadline-monotonic scheduling 1.7 [0c 228q 4f], Energy aware scheduling 1.7 [0c 481q 0f], CAKE 1.6 [0c 31683q 0f], Dominant resource fairness 1.2 [0c 31775q 0f], Tetris 0.9 [0c 287q 0f], Stack resource policy 0.7 [0c 448q 2f], Enhanced Transmission Selection 0.4 [0c 162q 3f], Cilk 0.4 [0c 72q 2f]

## Race condition (1)

Hierarchical token bucket 1.2 [0c 41q 0f]

## Heisenbug (77)

Proportional share scheduling 2.0 [0c 0q 1f], Foreground-background 2.0 [0c 0q 0f], Least Attained Service 2.0 [0c 0q 0f], Least slack time scheduling 1.9 [0c 0q 1f], Proportional-fair scheduling 1.9 [0c 0q 0f], Weighted fair queueing 1.9 [0c 0q 0f], Completely fair queueing 1.9 [0c 0q 0f], PIE 1.8 [0c 0q 3f], Fair queuing 1.7 [0c 0q 0f], Virtual Clock 1.7 [0c 0q 0f], Deficit round robin 1.6 [0c 0q 0f], Credit Scheduler 1.6 [0c 0q 0f], Core scheduling 1.6 [0c 0q 0f], N-Step-SCAN 1.5 [0c 0q 0f], Token bucket 1.5 [0c 0q 1f], Global EDF 1.5 [0c 0q 0f], FSCAN 1.4 [0c 0q 4f], Credit-based fair queuing 1.3 [0c 0q 0f], Generalized processor sharing 1.3 [0c 0q 0f], Windows NT processor scheduling 1.2 [0c 0q 0f], Deficit Weighted Round Robin 1.2 [0c 0q 0f], Gang scheduling 1.2 [0c 0q 0f], YDS algorithm 1.1 [0c 0q 0f], Borrowed virtual time 1.1 [0c 0q 0f], Stride scheduling 1.1 [0c 0q 3f], Stochastic Fair Queueing 1.1 [0c 0q 0f], GMP scheduler 1.1 [0c 0q 0f], BFQ 1.1 [0c 0q 0f], Class-based queueing 1.1 [0c 0q 0f], Anticipatory scheduling 1.0 [0c 0q 0f], scx_cpu0 1.0 [0c 0q 0f], CoDel 1.0 [0c 0q 0f], FQ-PIE 1.0 [0c 0q 0f], Noop scheduler 1.0 [0c 0q 0f], Anticipatory scheduler 1.0 [0c 0q 0f], Random early detection 0.9 [0c 0q 4f], ULE 0.9 [0c 0q 0f], SCHED_DEADLINE 0.8 [0c 16q 0f], Earliest TxTime First 0.8 [0c 0q 0f], ALTQ 0.8 [0c 0q 0f], Generalized foreground-background 0.8 [0c 0q 0f], FQ-CoDel 0.8 [0c 0q 0f], scx_rusty 0.8 [0c 0q 1f], TAPRIO 0.8 [0c 0q 0f], Pinwheel scheduling 0.7 [0c 0q 0f], Adaptive partition scheduler 0.7 [0c 0q 0f], Kyber 0.7 [0c 0q 0f], Quick Fair Queueing 0.7 [0c 0q 0f], Self-Clocked Fair Queueing 0.7 [0c 0q 0f], Multifit algorithm 0.7 [0c 0q 0f], Stochastic Fair Blue 0.7 [0c 0q 0f], scx_sdt 0.6 [0c 0q 0f], Hierarchical fair-service curve 0.6 [0c 0q 0f], scx_lavd 0.6 [0c 0q 1f], Pfair scheduling 0.6 [0c 0q 0f], EEVDF 0.6 [0c 0q 0f], scx_cake 0.6 [0c 0q 0f], Heterogeneous earliest finish time 0.6 [0c 0q 1f], Credit-based shaper 0.6 [0c 0q 1f], scx_simple 0.6 [0c 0q 0f] ...

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
