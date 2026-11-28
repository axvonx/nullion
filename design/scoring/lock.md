# Scoring: lock (Name a type of lock)

106 answers (Bit Flip and Works on my machine left out); 10 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (2%) | 3 | 1 |
| npe | 27 (25%) | 14 | 15 |
| leak | 0 (0%) | 19 | 0 |
| race | 0 (0%) | 20 | 0 |
| heisenbug | 77 (73%) | 50 | 31 |

Same tier as today: 58/106 (55%).

## Off-by-one (2)

read-write lock 5.0* [810c 96q 0f], mutex 4.8 [1271c 4734q 0f]

## Null pointer exception (27)

exclusive lock 3.9 [810c 12q 1f], file lock 3.9 [602c 376q 1f], spinlock 3.7 [1293c 337q 0f], distributed lock 3.6 [188c 53q 0f], pessimistic lock 3.5 [2646c 182q 0f], optimistic lock 3.4 [2406c 431q 0f], semaphore 3.4 [5413c 0q 0f], row-level lock 3.4 [195c 0q 0f], global interpreter lock 3.4 [1804c 392q 0f], critical section 3.3 [659c 535q 0f], futex 3.0* [1127c 109q 0f], named mutex 3.0* [0c 0q 0f], shared lock 3.0 [810c 4q 19f], two-phase locking 2.9 [520c 0q 0f], test-and-set lock 2.8 [747c 0q 0f], binary semaphore 2.8 [5413c 45q 0f], intrinsic lock 2.7 [1120c 9308q 2f], heavyweight lock 2.7 [0c 0q 0f], table lock 2.7 [0c 42q 0f], counting semaphore 2.6 [5413c 4q 0f], rw semaphore 2.6 [0c 0q 0f], recursive mutex 2.5 [193c 233q 0f], spin mutex 2.3 [0c 0q 0f], page lock 2.3 [0c 0q 0f], thin lock 2.2 [0c 0q 0f], key-range lock 2.1 [0c 0q 0f], latch 2.0* [0c 0q 1f]

## Memory leak (0)



## Race condition (0)



## Heisenbug (77)

interrupt spin lock 2.0 [0c 0q 0f], record lock 1.9 [195c 0q 0f], bakery lock 1.9 [770c 0q 0f], update lock 1.9 [0c 0q 0f], big kernel lock 1.8 [158c 0q 0f], queue lock 1.8 [0c 0q 0f], ROW EXCLUSIVE lock 1.8 [0c 0q 0f], Dekker's algorithm 1.8 [872c 0q 0f], sleep mutex 1.8 [0c 0q 0f], ticket lock 1.7 [159c 0q 0f], biased lock 1.7 [0c 8q 0f], Peterson lock 1.7 [1497c 0q 0f], mandatory lock 1.7 [602c 0q 0f], ERESOURCE 1.7 [0c 0q 0f], Fair lock 1.6 [0c 0q 0f], intention lock 1.6 [68c 0q 0f], Redlock 1.6 [0c 9q 0f], LWLock 1.6 [0c 0q 0f], rt mutex 1.6 [0c 0q 0f], next-key lock 1.6 [0c 0q 0f], ACCESS EXCLUSIVE lock 1.6 [0c 0q 0f], advisory lock 1.5 [0c 0q 0f], SRW lock 1.5 [0c 0q 0f], IX lock 1.5 [68c 0q 0f], brlock 1.4 [0c 0q 0f], ROW SHARE lock 1.4 [0c 0q 0f], raw spinlock 1.4 [0c 0q 0f], test-and-test-and-set lock 1.4 [162c 0q 0f], seqlock 1.4 [577c 10q 0f], backoff lock 1.3 [0c 0q 0f], MCS lock 1.3 [0c 0q 0f], executive spin lock 1.2 [0c 0q 0f], adaptive mutex 1.2 [0c 0q 0f], qspinlock 1.2 [0c 0q 0f], insert intention lock 1.2 [0c 0q 0f], schema lock 1.2 [0c 0q 0f], gap lock 1.1 [0c 0q 0f], ACCESS SHARE lock 1.1 [0c 0q 0f], AUTO-INC lock 1.1 [0c 0q 0f], Giant 1.1 [0c 0q 0f], StampedLock 1.1 [0c 8q 0f], parking lot lock 1.0 [0c 0q 0f], bit spinlock 1.0 [0c 0q 0f], IS lock 1.0 [68c 0q 0f], lockmgr lock 1.0 [0c 0q 0f], TWA lock 1.0 [0c 0q 0f], local lock 1.0* [0c 0q 0f], SHARE ROW EXCLUSIVE lock 1.0 [0c 0q 0f], lock cohorting 0.9 [0c 0q 0f], Anderson lock 0.9 [0c 0q 0f], push lock 0.9 [0c 0q 0f], sx lock 0.9 [0c 0q 0f], shuffle lock 0.8 [0c 0q 0f], fast mutex 0.8 [0c 0q 0f], reciprocating lock 0.8 [0c 0q 0f], partitioned ticket lock 0.8 [0c 0q 0f], relation extension lock 0.8 [0c 0q 0f], rmlock 0.7 [0c 0q 0f], HMCS lock 0.7 [0c 0q 0f], CLH lock 0.7 [0c 0q 0f] ...

## Confirmed lines the scores disagree with (never moved)

- spinlock: off-by-one in the bank, scores say npe (spinlock 3.7 [1293c 337q 0f])
- semaphore: off-by-one in the bank, scores say npe (semaphore 3.4 [5413c 0q 0f])
- read-write lock: npe in the bank, scores say off-by-one (read-write lock 5.0* [810c 96q 0f])
- recursive mutex: leak in the bank, scores say npe (recursive mutex 2.5 [193c 233q 0f])
- adaptive mutex: leak in the bank, scores say heisenbug (adaptive mutex 1.2 [0c 0q 0f])
- ticket lock: leak in the bank, scores say heisenbug (ticket lock 1.7 [159c 0q 0f])
- seqlock: leak in the bank, scores say heisenbug (seqlock 1.4 [577c 10q 0f])
- futex: leak in the bank, scores say npe (futex 3.0* [1127c 109q 0f])
- test-and-test-and-set lock: leak in the bank, scores say heisenbug (test-and-test-and-set lock 1.4 [162c 0q 0f])
- backoff lock: leak in the bank, scores say heisenbug (backoff lock 1.3 [0c 0q 0f])
- Peterson lock: leak in the bank, scores say heisenbug (Peterson lock 1.7 [1497c 0q 0f])
- bakery lock: leak in the bank, scores say heisenbug (bakery lock 1.9 [770c 0q 0f])
- Dekker's algorithm: leak in the bank, scores say heisenbug (Dekker's algorithm 1.8 [872c 0q 0f])
- exclusive lock: leak in the bank, scores say npe (exclusive lock 3.9 [810c 12q 1f])
- advisory lock: leak in the bank, scores say heisenbug (advisory lock 1.5 [0c 0q 0f])
- queue lock: leak in the bank, scores say heisenbug (queue lock 1.8 [0c 0q 0f])
- critical section: leak in the bank, scores say npe (critical section 3.3 [659c 535q 0f])
- record lock: leak in the bank, scores say heisenbug (record lock 1.9 [195c 0q 0f])
- page lock: leak in the bank, scores say npe (page lock 2.3 [0c 0q 0f])
- latch: leak in the bank, scores say npe (latch 2.0* [0c 0q 1f])
- intrinsic lock: leak in the bank, scores say npe (intrinsic lock 2.7 [1120c 9308q 2f])
- named mutex: leak in the bank, scores say npe (named mutex 3.0* [0c 0q 0f])
- MCS lock: race in the bank, scores say heisenbug (MCS lock 1.3 [0c 0q 0f])
- CLH lock: race in the bank, scores say heisenbug (CLH lock 0.7 [0c 0q 0f])
- qspinlock: race in the bank, scores say heisenbug (qspinlock 1.2 [0c 0q 0f])
- big kernel lock: race in the bank, scores say heisenbug (big kernel lock 1.8 [158c 0q 0f])
- Anderson lock: race in the bank, scores say heisenbug (Anderson lock 0.9 [0c 0q 0f])
- filter lock: race in the bank, scores say heisenbug (filter lock 0.0* [0c 0q 0f])
- intention lock: race in the bank, scores say heisenbug (intention lock 1.6 [68c 0q 0f])
- Redlock: race in the bank, scores say heisenbug (Redlock 1.6 [0c 9q 0f])
- biased lock: race in the bank, scores say heisenbug (biased lock 1.7 [0c 8q 0f])
- SRW lock: race in the bank, scores say heisenbug (SRW lock 1.5 [0c 0q 0f])
- IX lock: race in the bank, scores say heisenbug (IX lock 1.5 [68c 0q 0f])
- IS lock: race in the bank, scores say heisenbug (IS lock 1.0 [68c 0q 0f])
- update lock: race in the bank, scores say heisenbug (update lock 1.9 [0c 0q 0f])
- gap lock: race in the bank, scores say heisenbug (gap lock 1.1 [0c 0q 0f])
- next-key lock: race in the bank, scores say heisenbug (next-key lock 1.6 [0c 0q 0f])
- predicate lock: race in the bank, scores say heisenbug (predicate lock 0.7 [0c 0q 0f])
- executive spin lock: race in the bank, scores say heisenbug (executive spin lock 1.2 [0c 0q 0f])
- Giant: race in the bank, scores say heisenbug (Giant 1.1 [0c 0q 0f])
- mandatory lock: race in the bank, scores say heisenbug (mandatory lock 1.7 [602c 0q 0f])
- ACCESS EXCLUSIVE lock: race in the bank, scores say heisenbug (ACCESS EXCLUSIVE lock 1.6 [0c 0q 0f])
- thin lock: heisenbug in the bank, scores say npe (thin lock 2.2 [0c 0q 0f])
- rw semaphore: heisenbug in the bank, scores say npe (rw semaphore 2.6 [0c 0q 0f])
- key-range lock: heisenbug in the bank, scores say npe (key-range lock 2.1 [0c 0q 0f])
- spin mutex: heisenbug in the bank, scores say npe (spin mutex 2.3 [0c 0q 0f])
- heavyweight lock: heisenbug in the bank, scores say npe (heavyweight lock 2.7 [0c 0q 0f])

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
