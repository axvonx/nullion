# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

## lock

57 candidates; 9 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| mutex | 525 | 88 | 68 | 1.00 | off-by-one | counts | off-by-one | off-by-one |
| semaphore | 132 | 126 | 31 | 0.96 | off-by-one | counts | off-by-one | off-by-one |
| RCU | 1756 | 41 | 33 | 0.95 | womm | pin | — | womm |
| spinlock | 617 | 65 | 20 | 0.94 | off-by-one | counts | off-by-one | off-by-one |
| read-write lock | 83 | 33 | 13 | 0.77 | npe | counts | npe | npe |
| two-phase locking | 0 | 74 | 15 | 0.72 | npe | counts | leak | npe |
| distributed lock | 5 | 28 | 13 | 0.67 | npe | counts | npe | npe |
| shared lock | 35 | 22 | 5 | 0.61 | npe | counts | npe | npe |
| exclusive lock | 11 | 7 | 11 | 0.56 | leak | counts | npe | leak |
| bakery lock | 2 | 20 | 6 | 0.54 | leak | counts | leak | leak |
| recursive mutex | 10 | 7 | 8 | 0.52 | leak | counts | npe | leak |
| futex | 131 | 8 | 3 | 0.52 | leak | counts | leak | leak |
| MCS lock | 3 | 4 | 9 | 0.46 | race | judge | race | race |
| queue lock | 13 | 6 | 4 | 0.45 | leak | counts | leak | leak |
| adaptive mutex | 0 | 13 | 3 | 0.40 | leak | counts | leak | leak |
| seqlock | 86 | 2 | 3 | 0.40 | leak | counts | race | leak |
| Peterson lock | 0 | 4 | 6 | 0.37 | leak | judge | leak | leak |
| optimistic lock | 0 | 6 | 3 | 0.34 | npe | judge | npe | npe |
| ticket lock | 0 | 4 | 4 | 0.33 | leak | judge | leak | leak |
| CNA lock | 0 | 5 | 3 | 0.33 | heisenbug | judge | heisenbug | heisenbug |
| local lock ⚠ counts said leak | 75 | 2 | 1 | 0.32 | heisenbug | judge (override) | heisenbug | heisenbug |
| file lock ⚠ counts said race | 29 | 3 | 1 | 0.32 | npe | judge (override) | npe | npe |
| biased lock | 0 | 8 | 1 | 0.28 | race | judge | race | race |
| Hemlock | 0 | 4 | 2 | 0.28 | heisenbug | judge | heisenbug | heisenbug |
| Dekker's algorithm | 0 | 3 | 1 | 0.21 | leak | judge | leak | leak |
| CLH lock | 0 | 1 | 2 | 0.19 | race | judge | race | race |
| pessimistic lock | 0 | 1 | 2 | 0.19 | npe | judge | npe | npe |
| lock cohorting | 0 | 2 | 1 | 0.18 | heisenbug | judge | heisenbug | heisenbug |
| HMCS lock | 0 | 2 | 1 | 0.18 | heisenbug | judge | heisenbug | heisenbug |
| Malthusian lock | 0 | 2 | 1 | 0.18 | heisenbug | judge | heisenbug | heisenbug |
| reciprocating lock | 0 | 2 | 1 | 0.18 | heisenbug | judge | heisenbug | heisenbug |
| fissile lock | 0 | 2 | 1 | 0.18 | bitflip | pin | — | bitflip |
| qspinlock | 2 | 0 | 2 | 0.16 | race | judge | race | race |
| rt mutex | 70 | 0 | 0 | 0.14 | heisenbug | counts | race | heisenbug |
| rw semaphore | 41 | 0 | 0 | 0.12 | heisenbug | counts | race | heisenbug |
| ww mutex | 31 | 0 | 0 | 0.11 | heisenbug | counts | heisenbug | heisenbug |
| filter lock | 1 | 0 | 1 | 0.10 | race | judge | race | race |
| thin lock | 0 | 2 | 0 | 0.10 | heisenbug | judge | heisenbug | heisenbug |
| advisory lock | 2 | 1 | 0 | 0.10 | leak | judge | leak | leak |
| test-and-set lock | 0 | 0 | 1 | 0.08 | npe | judge | npe | npe |
| test-and-test-and-set lock | 0 | 0 | 1 | 0.08 | leak | judge | leak | leak |
| Redlock | 0 | 0 | 1 | 0.08 | race | judge | race | race |
| percpu rwsem | 8 | 0 | 0 | 0.07 | heisenbug | judge | heisenbug | heisenbug |
| backoff lock | 0 | 1 | 0 | 0.06 | leak | judge | leak | leak |
| hierarchical backoff lock | 0 | 1 | 0 | 0.06 | heisenbug | judge | heisenbug | heisenbug |
| partitioned ticket lock | 0 | 1 | 0 | 0.06 | heisenbug | judge | heisenbug | heisenbug |
| row-level lock | 0 | 1 | 0 | 0.06 | npe | judge | npe | npe |
| big kernel lock | 2 | 0 | 0 | 0.04 | race | judge | race | race |
| brlock | 2 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | heisenbug |
| qrwlock | 1 | 0 | 0 | 0.02 | heisenbug | judge | heisenbug | heisenbug |
| Anderson lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | race |
| shuffle lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | heisenbug |
| TWA lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | heisenbug |
| intention lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | race |
| table lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | npe |
| lglock ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | heisenbug |
| osq lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | heisenbug |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): file lock (counts said race, now npe), local lock (counts said leak, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

