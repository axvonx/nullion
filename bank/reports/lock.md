# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

## lock

17 candidates; 11 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| SHARE lock ⚠ counts said off-by-one | 14 | 19 | 3 | 1.00 | race | judge (override) | race | — |
| Giant ⚠ counts said off-by-one | 3 | 923 | 655 | 0.93 | race | judge (override) | race | — |
| remove lock | 7 | 1 | 0 | 0.60 | heisenbug | judge | heisenbug | — |
| named mutex | 4 | 0 | 1 | 0.55 | leak | judge | leak | — |
| mandatory lock | 3 | 0 | 1 | 0.53 | heisenbug | judge | heisenbug | — |
| heavyweight lock | 1 | 0 | 1 | 0.47 | race | judge | race | — |
| BPF spin lock | 13 | 0 | 0 | 0.20 | heisenbug | counts | race | — |
| interrupt spin lock | 2 | 0 | 0 | 0.11 | heisenbug | judge | heisenbug | — |
| executive spin lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| spin mutex ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| relation extension lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ACCESS SHARE lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ROW EXCLUSIVE lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ROW SHARE lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SHARE ROW EXCLUSIVE lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SHARE UPDATE EXCLUSIVE lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ACCESS EXCLUSIVE lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): Giant (counts said off-by-one, now race), SHARE lock (counts said off-by-one, now race)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: adaptive mutex, advisory lock, anderson lock, auto-inc lock, backoff lock, bakery lock, biased lock, big kernel lock, binary semaphore, bit spinlock, brlock, clh lock, cna lock, counting semaphore, critical section, dekker's algorithm, distributed lock, eresource, exclusive lock, fast mutex, file lock, filter lock, fissile lock, futex, gap lock, global interpreter lock, guarded mutex, hemlock, hierarchical backoff lock, hmcs lock, in-stack queued spin lock, insert intention lock, intention lock, intrinsic lock, is lock, ix lock, key-range lock, latch, lglock, local lock, lock cohorting, lockmgr lock, lwlock, malthusian lock, mcs lock, mutex, next-key lock, optimistic lock, osq lock, page lock, parking lot lock, partitioned ticket lock, percpu rwsem, pessimistic lock, peterson lock, predicate lock, push lock, qrwlock, qspinlock, queue lock, raw spinlock, rcu, read-write lock, reciprocating lock, record lock, recursive mutex, redlock, rmlock, row-level lock, rt mutex, rw semaphore, schema lock, semaphore, seqlock, shared lock, shuffle lock, six lock, sleep mutex, spinlock, srw lock, stampedlock, sx lock, table lock, test-and-set lock, test-and-test-and-set lock, thin lock, ticket lock, twa lock, two-phase locking, update lock, ww mutex

