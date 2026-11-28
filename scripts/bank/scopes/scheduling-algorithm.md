# Scope: Name a scheduling algorithm
id: scheduling-algorithm · by: claude (draft: the owner may veto any line)

Computing schedulers: whatever decides which task, request, packet or job runs or is served next, in an OS kernel, a
runtime, a cluster or a network stack, plus the named textbook and research algorithms for doing so.

## Sub-kinds
- textbook CPU: the policies an OS course teaches (FCFS, SJF, SRTF, round robin, priority, multilevel feedback queue)
- kernel CPU: named schedulers in real kernels (CFS, EEVDF, O(1), BFS, MuQSS, ULE, 4BSD, Windows' scheduler, sched_ext schedulers such as scx_rusty)
- real-time: real-time and deadline scheduling (EDF, rate-monotonic, deadline-monotonic, least laxity, SCHED_DEADLINE)
- proportional share: fair-share and research algorithms (lottery, stride, BVT, WFQ for CPUs, fair-share scheduling)
- multiprocessor and runtime: gang scheduling, work stealing, the schedulers in language runtimes (Go's GMP, Tokio, Cilk)
- disk and I/O: disk-arm and block I/O schedulers (SCAN/elevator, C-SCAN, LOOK, SSTF, CFQ, deadline, BFQ, Kyber, mq-deadline, noop)
- packet: network packet schedulers and queueing disciplines (WFQ, DRR, HTB, FQ-CoDel, CAKE, PIE, priority queueing)
- cluster and batch: job schedulers' algorithms (backfilling, dominant resource fairness, gang/coscheduling, bin-packing as in Borg)

## In
- A named policy or algorithm, or a named scheduler implementation in a real kernel, runtime or system (CFS, ULE, BFQ).
- Linux scheduling classes and policies by their documented names (SCHED_FIFO, SCHED_RR, SCHED_DEADLINE, SCHED_IDLE): they are policies.
- Common spellings and abbreviations are aliases, not new answers (RR = round robin; CFS = Completely Fair Scheduler).

## Out
- Load-tracking and frequency signals that feed a scheduler but do not schedule: PELT, WALT, schedutil (a cpufreq governor). OWNER RULING PENDING: the owner said "maybe" to WALT and PELT.
- Schedulers that are products, not algorithms: Slurm, Kubernetes' kube-scheduler, cron, Windows Task Scheduler, Airflow (they are job runners; their algorithms count, their names do not).
- Operations-research scheduling with no computing use (job-shop heuristics such as Johnson's rule). OWNER RULING PENDING.
- Generic words with no named policy ("preemptive", "cooperative", "time slicing").
- Instruction scheduling in compilers (list scheduling, modulo scheduling): a different meaning of the word. OWNER RULING PENDING.

## Examples
- off-by-one: round robin, first come first served, shortest job first, priority scheduling
- npe: multilevel feedback queue, Completely Fair Scheduler, earliest deadline first, shortest remaining time first
- leak: rate-monotonic scheduling, lottery scheduling, O(1) scheduler, SCAN, CFQ, work stealing
- race: EEVDF, stride scheduling, BFQ, deficit round robin, ULE, backfilling
- heisenbug: borrowed virtual time, MuQSS, Kyber, dominant resource fairness, least laxity first
