# Name a type of lock
id: lock · domain: os-systems · status: approved
> Any locking or mutual-exclusion primitive, protocol or scheme.

## Off-by-one
- mutex | mutual exclusion lock | std::mutex | pthread mutex | pthread_mutex
- spinlock | spin lock
- semaphore

## Works on my machine
- RCU | read-copy-update
  note: Not technically a lock, which is why everyone says it.

## Null pointer exception
- read-write lock | rwlock | readers-writer lock | reader-writer lock | shared-exclusive lock | std::shared_mutex
- test-and-set lock | tas lock | test and set lock
- optimistic lock | optimistic locking
- pessimistic lock | pessimistic locking
- two-phase locking | 2pl
- shared lock | s lock
- row-level lock | row lock
- table lock | table-level lock
- file lock | flock | file locking
- distributed lock
- global interpreter lock | GIL
- counting semaphore
- binary semaphore

## Memory leak
- recursive mutex | reentrant lock | reentrant mutex | recursive lock | ReentrantLock | std::recursive_mutex
- adaptive mutex | adaptive lock
- ticket lock | ticket spinlock
- seqlock | sequence lock | seqcount
- futex | fast userspace mutex
- test-and-test-and-set lock | ttas lock | test and test and set lock
- backoff lock | exponential backoff lock
- Peterson lock | peterson's algorithm | petersons lock
- bakery lock | lamport's bakery algorithm | bakery algorithm
- Dekker's algorithm | dekker lock | dekkers algorithm
- exclusive lock | x lock
- advisory lock
- queue lock | queuing lock | queue-based lock
- critical section | CRITICAL_SECTION
- record lock
- page lock
- latch
- intrinsic lock | monitor lock

## Race condition
- MCS lock | mellor-crummey scott lock
- CLH lock | craig landin hagersten lock
- qspinlock | queued spinlock
- big kernel lock | bkl
- Anderson lock | array-based queue lock | array lock
- filter lock
- intention lock | intent lock
- Redlock
- biased lock | biased locking
- SRW lock | slim reader/writer lock | slim reader-writer lock | SRWLOCK
- IX lock | intention exclusive lock
- IS lock | intention shared lock
- update lock | U lock
- gap lock
- next-key lock
- predicate lock

## Heisenbug
- qrwlock | queued rwlock | queued read-write lock
- hierarchical backoff lock | hbo lock
- lock cohorting | cohort lock | cohort locks
- CNA lock | compact numa-aware lock
- HMCS lock | hierarchical mcs lock
- shuffle lock | shfllock
- Malthusian lock
- Hemlock
- reciprocating lock
- TWA lock | ticket lock with waiting array
- partitioned ticket lock
- thin lock
- rw semaphore | rwsem | read-write semaphore
- percpu rwsem | per-cpu rwsem | percpu rw semaphore
- local lock | local_lock
- rt mutex | rtmutex | rt_mutex
- ww mutex | wound/wait mutex | wound-wait mutex | ww_mutex
- lglock | local/global lock
- brlock | big reader lock
- osq lock | optimistic spin queue | osq
- SIX lock | shared intention exclusive lock
- ERESOURCE | executive resource
- push lock | pushlock | EX_PUSH_LOCK
- fast mutex | FAST_MUTEX
- guarded mutex | KGUARDED_MUTEX
- in-stack queued spin lock | in-stack queued spinlock
- rmlock | read-mostly lock
- sx lock | sx(9)
- lockmgr lock | lockmgr
- sleep mutex
- insert intention lock
- AUTO-INC lock | auto-increment lock
- key-range lock
- schema lock | Sch-M lock
- LWLock | lightweight lock
- StampedLock | stamped lock
- parking lot lock | WTF::Lock
- raw spinlock | raw_spinlock
- bit spinlock | bit_spin_lock

## Bit Flip
- fissile lock
  note: Dice & Kogan, 2020: a TAS fast path that fissions into an MCS-like slow path.
