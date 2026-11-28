# Head-recall probe: scheduling-algorithm (Name a scheduling algorithm)

45 of 60 real probe answers are playable (75%); 1 only in the Inbox; 14 new ones added to the Inbox; 0 probe answers judged not members (out of scope or not real).

## Misses by sub-kind
- cluster and batch: Backfilling, Tetris
- disk and I/O: C-LOOK, Anticipatory scheduler
- kernel CPU: MuQSS, Credit Scheduler
- multiprocessor and runtime: GMP scheduler, Cilk
- packet: Virtual Clock, Self-Clocked Fair Queueing, Deficit Weighted Round Robin
- proportional share: Borrowed Virtual Time
- real-time: Pfair scheduling, Global EDF
- textbook CPU: Least Attained Service

## Inbox only (rejected in play until promoted)
- Borrowed Virtual Time

## Judged
- C-LOOK (×1): **to the Inbox** as C-LOOK (leak): Circular LOOK, a disk-arm scheduling variant taught in OS courses alongside SCAN and LOOK.
- Backfilling (×1): **to the Inbox** as Backfilling (race): Backfilling (EASY and conservative variants) is a named batch-job scheduling algorithm from HPC and cluster research.
- GMP scheduler (×1): **to the Inbox** as GMP scheduler (race): The goroutine scheduler in the Go runtime, built on the Goroutine, Machine and Processor (G, M, P) model.
- MuQSS (×1): **to the Inbox** as MuQSS (heisenbug): Multiple Queue Skiplist Scheduler, Con Kolivas's named CPU scheduler for Linux (BFS's successor).
- Anticipatory scheduler (×1): **to the Inbox** as Anticipatory scheduler (heisenbug): Linux block I/O scheduler from Iyer and Druschel's 2001 anticipatory scheduling paper, removed from the kernel in 2.6.33.
- Pfair scheduling (×1): **to the Inbox** as Pfair scheduling (heisenbug): Proportionate fair scheduling for real-time multiprocessors, from Baruah et al. (1996).
- Tetris (×1): **to the Inbox** as Tetris (heisenbug): Multi-resource cluster job-packing scheduler from Grandl et al. (SIGCOMM 2014).
- Cilk (×1): **to the Inbox** as Cilk (race): The Cilk runtime's work-stealing scheduler, a named multithreaded runtime from MIT.
- Virtual Clock (×1): **to the Inbox** as Virtual Clock (heisenbug): Zhang's 1991 Virtual Clock packet scheduling discipline.
- Least Attained Service (×1): **to the Inbox** as Least Attained Service (heisenbug): LAS, a named size-based policy from queueing-theory and scheduling research that serves the job with the least service so far.
- Global EDF (×1): **to the Inbox** as Global EDF (race): Global earliest deadline first, a named multiprocessor real-time variant of EDF in the literature and in Linux SCHED_DEADLINE discussions.
- Self-Clocked Fair Queueing (×1): **to the Inbox** as Self-Clocked Fair Queueing (heisenbug): SCFQ, Golestani's 1994 packet fair-queueing algorithm.
- Deficit Weighted Round Robin (×1): **to the Inbox** as Deficit Weighted Round Robin (heisenbug): DWRR, a weighted form of deficit round robin used in packet-scheduling research and router implementations.
- Credit Scheduler (×1): **to the Inbox** as Credit Scheduler (heisenbug): Xen's named hypervisor CPU scheduler (credit and credit2).

## Covered
- First Come First Served
- Round Robin
- Shortest Job First
- Shortest Remaining Time First
- Priority Scheduling
- Multilevel Feedback Queue
- Multilevel Queue Scheduling
- Completely Fair Scheduler
- Earliest Deadline First
- Rate-Monotonic Scheduling
- SCAN
- Lottery Scheduling
- Work Stealing
- Weighted Fair Queueing
- Gang Scheduling
- Shortest Seek Time First
- LOOK
- mq-deadline
- CFQ
- BFQ
- noop I/O scheduler
- Stride Scheduling
- Deficit Round Robin
- Hierarchical Token Bucket
- FQ-CoDel
- CAKE
- Fair-Share Scheduling
- O(1) scheduler
- ULE
- BFS
- SCHED_FIFO
- SCHED_DEADLINE
- Earliest Eligible Virtual Deadline First
- Kyber
- Least Laxity First
- Constant Bandwidth Server
- Dominant Resource Fairness
- scx_rusty
- scx_lavd
- Proportional Fair Scheduling
- Hierarchical Fair Service Curve
- PIE
- Start-time Fair Queueing
- FSCAN
- N-step SCAN
