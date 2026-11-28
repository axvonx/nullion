# Scoring: lock (Name a type of lock)

106 answers (Bit Flip and Works on my machine left out); 10 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (2%) | 3 | 1 |
| npe | 27 (25%) | 13 | 15 |
| leak | 0 (0%) | 19 | 0 |
| race | 1 (1%) | 20 | 1 |
| heisenbug | 76 (72%) | 51 | 30 |

Same tier as today: 59/106 (56%).

## Off-by-one (2)

read-write lock 5.0* [0c 96q 0f 0s], mutex 4.8 [1271c 4734q 0f 0s]

## Null pointer exception (27)

file lock 3.9 [0c 376q 1f 991s], exclusive lock 3.9 [0c 12q 1f 0s], spinlock 3.7 [1293c 337q 0f 0s], distributed lock 3.6 [188c 53q 0f 0s], pessimistic lock 3.5 [2646c 182q 0f 0s], optimistic lock 3.4 [2406c 431q 0f 0s], semaphore 3.4 [0c 0q 0f 0s], row-level lock 3.4 [0c 0q 0f 0s], global interpreter lock 3.4 [1804c 392q 0f 0s], critical section 3.3 [659c 535q 0f 0s], futex 3.0* [1127c 109q 0f 0s], named mutex 3.0* [0c 0q 0f 0s], shared lock 3.0 [0c 4q 19f 0s], two-phase locking 2.9 [520c 0q 0f 0s], test-and-set lock 2.8 [747c 0q 0f 0s], binary semaphore 2.8 [0c 45q 0f 0s], intrinsic lock 2.7 [1120c 0q 2f 0s], heavyweight lock 2.7 [0c 0q 0f 0s], table lock 2.7 [0c 42q 0f 0s], counting semaphore 2.6 [0c 4q 0f 0s], rw semaphore 2.6 [0c 0q 0f 0s], recursive mutex 2.5 [193c 233q 0f 0s], spin mutex 2.3 [0c 0q 0f 0s], page lock 2.3 [0c 0q 0f 0s], thin lock 2.2 [0c 0q 0f 0s], key-range lock 2.1 [0c 0q 0f 0s], latch 2.0* [0c 0q 1f 0s]

## Memory leak (0)



## Race condition (1)

seqlock 1.4 [577c 10q 0f 0s]

## Heisenbug (76)

interrupt spin lock 2.0 [0c 0q 0f 0s], record lock 1.9 [0c 0q 0f 0s], bakery lock 1.9 [770c 0q 0f 0s], update lock 1.9 [0c 0q 0f 0s], big kernel lock 1.8 [158c 0q 0f 0s], queue lock 1.8 [0c 0q 0f 0s], ROW EXCLUSIVE lock 1.8 [0c 0q 0f 0s], Dekker's algorithm 1.8 [872c 0q 0f 0s], sleep mutex 1.8 [0c 0q 0f 0s], ticket lock 1.7 [159c 0q 0f 0s], biased lock 1.7 [0c 8q 0f 0s], Peterson lock 1.7 [1497c 0q 0f 0s], mandatory lock 1.7 [0c 0q 0f 0s], ERESOURCE 1.7 [0c 0q 0f 0s], Fair lock 1.6 [0c 0q 0f 0s], intention lock 1.6 [0c 0q 0f 0s], Redlock 1.6 [0c 9q 0f 0s], LWLock 1.6 [0c 0q 0f 0s], rt mutex 1.6 [0c 0q 0f 0s], next-key lock 1.6 [0c 0q 0f 0s], ACCESS EXCLUSIVE lock 1.6 [0c 0q 0f 0s], advisory lock 1.5 [0c 0q 0f 0s], SRW lock 1.5 [0c 0q 0f 0s], IX lock 1.5 [0c 0q 0f 0s], brlock 1.4 [0c 0q 0f 0s], ROW SHARE lock 1.4 [0c 0q 0f 0s], raw spinlock 1.4 [0c 0q 0f 0s], test-and-test-and-set lock 1.4 [162c 0q 0f 0s], backoff lock 1.3 [0c 0q 0f 0s], MCS lock 1.3 [0c 0q 0f 0s], executive spin lock 1.2 [0c 0q 0f 0s], adaptive mutex 1.2 [0c 0q 0f 0s], qspinlock 1.2 [0c 0q 0f 0s], insert intention lock 1.2 [0c 0q 0f 0s], schema lock 1.2 [0c 0q 0f 0s], gap lock 1.1 [0c 0q 0f 0s], ACCESS SHARE lock 1.1 [0c 0q 0f 0s], AUTO-INC lock 1.1 [0c 0q 0f 0s], Giant 1.1 [0c 0q 0f 0s], StampedLock 1.1 [0c 8q 0f 0s], parking lot lock 1.0 [0c 0q 0f 0s], bit spinlock 1.0 [0c 0q 0f 0s], IS lock 1.0 [0c 0q 0f 0s], lockmgr lock 1.0 [0c 0q 0f 0s], TWA lock 1.0 [0c 0q 0f 0s], local lock 1.0* [0c 0q 0f 0s], SHARE ROW EXCLUSIVE lock 1.0 [0c 0q 0f 0s], lock cohorting 0.9 [0c 0q 0f 0s], Anderson lock 0.9 [0c 0q 0f 0s], push lock 0.9 [0c 0q 0f 0s], sx lock 0.9 [0c 0q 0f 0s], shuffle lock 0.8 [0c 0q 0f 0s], fast mutex 0.8 [0c 0q 0f 0s], reciprocating lock 0.8 [0c 0q 0f 0s], partitioned ticket lock 0.8 [0c 0q 0f 0s], relation extension lock 0.8 [0c 0q 0f 0s], rmlock 0.7 [0c 0q 0f 0s], HMCS lock 0.7 [0c 0q 0f 0s], CLH lock 0.7 [0c 0q 0f 0s], ww mutex 0.7 [0c 0q 0f 0s] ...

## Confirmed lines the scores disagree with (never moved)

- spinlock: off-by-one in the bank, scores say npe (spinlock 3.7 [1293c 337q 0f 0s])
- semaphore: off-by-one in the bank, scores say npe (semaphore 3.4 [0c 0q 0f 0s])
- read-write lock: npe in the bank, scores say off-by-one (read-write lock 5.0* [0c 96q 0f 0s])
- recursive mutex: leak in the bank, scores say npe (recursive mutex 2.5 [193c 233q 0f 0s])
- adaptive mutex: leak in the bank, scores say heisenbug (adaptive mutex 1.2 [0c 0q 0f 0s])
- ticket lock: leak in the bank, scores say heisenbug (ticket lock 1.7 [159c 0q 0f 0s])
- seqlock: leak in the bank, scores say race (seqlock 1.4 [577c 10q 0f 0s])
- futex: leak in the bank, scores say npe (futex 3.0* [1127c 109q 0f 0s])
- test-and-test-and-set lock: leak in the bank, scores say heisenbug (test-and-test-and-set lock 1.4 [162c 0q 0f 0s])
- backoff lock: leak in the bank, scores say heisenbug (backoff lock 1.3 [0c 0q 0f 0s])
- Peterson lock: leak in the bank, scores say heisenbug (Peterson lock 1.7 [1497c 0q 0f 0s])
- bakery lock: leak in the bank, scores say heisenbug (bakery lock 1.9 [770c 0q 0f 0s])
- Dekker's algorithm: leak in the bank, scores say heisenbug (Dekker's algorithm 1.8 [872c 0q 0f 0s])
- exclusive lock: leak in the bank, scores say npe (exclusive lock 3.9 [0c 12q 1f 0s])
- advisory lock: leak in the bank, scores say heisenbug (advisory lock 1.5 [0c 0q 0f 0s])
- queue lock: leak in the bank, scores say heisenbug (queue lock 1.8 [0c 0q 0f 0s])
- critical section: leak in the bank, scores say npe (critical section 3.3 [659c 535q 0f 0s])
- record lock: leak in the bank, scores say heisenbug (record lock 1.9 [0c 0q 0f 0s])
- page lock: leak in the bank, scores say npe (page lock 2.3 [0c 0q 0f 0s])
- latch: leak in the bank, scores say npe (latch 2.0* [0c 0q 1f 0s])
- intrinsic lock: leak in the bank, scores say npe (intrinsic lock 2.7 [1120c 0q 2f 0s])
- named mutex: leak in the bank, scores say npe (named mutex 3.0* [0c 0q 0f 0s])
- MCS lock: race in the bank, scores say heisenbug (MCS lock 1.3 [0c 0q 0f 0s])
- CLH lock: race in the bank, scores say heisenbug (CLH lock 0.7 [0c 0q 0f 0s])
- qspinlock: race in the bank, scores say heisenbug (qspinlock 1.2 [0c 0q 0f 0s])
- big kernel lock: race in the bank, scores say heisenbug (big kernel lock 1.8 [158c 0q 0f 0s])
- Anderson lock: race in the bank, scores say heisenbug (Anderson lock 0.9 [0c 0q 0f 0s])
- filter lock: race in the bank, scores say heisenbug (filter lock 0.0* [0c 0q 0f 0s])
- intention lock: race in the bank, scores say heisenbug (intention lock 1.6 [0c 0q 0f 0s])
- Redlock: race in the bank, scores say heisenbug (Redlock 1.6 [0c 9q 0f 0s])
- biased lock: race in the bank, scores say heisenbug (biased lock 1.7 [0c 8q 0f 0s])
- SRW lock: race in the bank, scores say heisenbug (SRW lock 1.5 [0c 0q 0f 0s])
- IX lock: race in the bank, scores say heisenbug (IX lock 1.5 [0c 0q 0f 0s])
- IS lock: race in the bank, scores say heisenbug (IS lock 1.0 [0c 0q 0f 0s])
- update lock: race in the bank, scores say heisenbug (update lock 1.9 [0c 0q 0f 0s])
- gap lock: race in the bank, scores say heisenbug (gap lock 1.1 [0c 0q 0f 0s])
- next-key lock: race in the bank, scores say heisenbug (next-key lock 1.6 [0c 0q 0f 0s])
- predicate lock: race in the bank, scores say heisenbug (predicate lock 0.7 [0c 0q 0f 0s])
- executive spin lock: race in the bank, scores say heisenbug (executive spin lock 1.2 [0c 0q 0f 0s])
- Giant: race in the bank, scores say heisenbug (Giant 1.1 [0c 0q 0f 0s])
- mandatory lock: race in the bank, scores say heisenbug (mandatory lock 1.7 [0c 0q 0f 0s])
- ACCESS EXCLUSIVE lock: race in the bank, scores say heisenbug (ACCESS EXCLUSIVE lock 1.6 [0c 0q 0f 0s])
- thin lock: heisenbug in the bank, scores say npe (thin lock 2.2 [0c 0q 0f 0s])
- rw semaphore: heisenbug in the bank, scores say npe (rw semaphore 2.6 [0c 0q 0f 0s])
- key-range lock: heisenbug in the bank, scores say npe (key-range lock 2.1 [0c 0q 0f 0s])
- spin mutex: heisenbug in the bank, scores say npe (spin mutex 2.3 [0c 0q 0f 0s])
- heavyweight lock: heisenbug in the bank, scores say npe (heavyweight lock 2.7 [0c 0q 0f 0s])

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
