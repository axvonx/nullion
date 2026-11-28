# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: scheduling, scheduler, queue.

## scheduling-algorithm

93 candidates; 35 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| Round robin | 10 | 295 | 226 | 0.96 | off-by-one | counts | off-by-one | — |
| Priority queueing ⚠ counts said off-by-one | 8 | 743 | 234 | 0.94 | race | judge (override) | race | — |
| LOOK ⚠ counts said off-by-one | 23 | 78 | 252 | 0.91 | race | judge (override) | race | — |
| Energy aware scheduling ⚠ counts said npe | 11 | 265 | 46 | 0.84 | heisenbug | judge (override) | heisenbug | — |
| Priority scheduling | 2 | 519 | 96 | 0.81 | npe | counts | off-by-one | — |
| Deadline scheduler ⚠ counts said npe | 15 | 93 | 11 | 0.68 | race | judge (override) | race | — |
| Earliest deadline first | 2 | 64 | 44 | 0.65 | npe | counts | npe | — |
| Core scheduling ⚠ counts said npe | 21 | 37 | 9 | 0.63 | heisenbug | judge (override) | heisenbug | — |
| Proportional-fair scheduling ⚠ counts said npe | 0 | 185 | 32 | 0.63 | heisenbug | judge (override) | heisenbug | — |
| First come first served | 1 | 18 | 137 | 0.62 | npe | counts | off-by-one | — |
| Gang scheduling | 1 | 82 | 20 | 0.58 | npe | counts | leak | — |
| Fair queuing | 2 | 36 | 23 | 0.56 | leak | counts | race | — |
| Work stealing | 0 | 35 | 48 | 0.54 | womm | pin | leak | — |
| Completely Fair Scheduler | 14 | 6 | 9 | 0.48 | leak | counts | npe | — |
| Deficit round robin | 1 | 34 | 10 | 0.47 | leak | counts | race | — |
| Random early detection | 1 | 16 | 19 | 0.46 | leak | counts | leak | — |
| Token bucket | 2 | 12 | 15 | 0.46 | leak | counts | leak | — |
| Pinwheel scheduling ⚠ counts said leak | 0 | 27 | 17 | 0.45 | heisenbug | judge (override) | heisenbug | — |
| ULE | 0 | 10 | 38 | 0.44 | leak | counts | race | — |
| Weighted round robin | 0 | 25 | 14 | 0.43 | leak | counts | leak | — |
| Proportional share scheduling | 1 | 34 | 4 | 0.41 | leak | counts | leak | — |
| CoDel | 1 | 8 | 16 | 0.41 | leak | counts | race | — |
| Shortest job first ⚠ counts said leak | 0 | 8 | 29 | 0.41 | off-by-one | judge (override) | off-by-one | — |
| Rate-monotonic scheduling | 0 | 66 | 3 | 0.40 | leak | counts | leak | — |
| Generalized processor sharing ⚠ counts said leak | 0 | 34 | 5 | 0.38 | heisenbug | judge (override) | heisenbug | — |
| Weighted fair queueing | 0 | 28 | 6 | 0.38 | leak | counts | race | — |
| PIE ⚠ counts said leak | 0 | 10 | 14 | 0.37 | heisenbug | judge (override) | heisenbug | — |
| Least slack time scheduling ⚠ counts said leak | 0 | 13 | 8 | 0.35 | heisenbug | judge (override) | heisenbug | — |
| CHOKe ⚠ counts said leak | 0 | 10 | 8 | 0.33 | heisenbug | judge (override) | heisenbug | — |
| Heterogeneous earliest finish time ⚠ counts said leak | 0 | 7 | 10 | 0.32 | heisenbug | judge (override) | heisenbug | — |
| BFQ | 39 | 3 | 0 | 0.30 | race | counts | race | — |
| FQ-CoDel | 1 | 3 | 5 | 0.27 | race | judge | race | — |
| Multifit algorithm | 0 | 10 | 3 | 0.27 | race | counts | heisenbug | — |
| CAKE | 0 | 3 | 8 | 0.26 | race | judge | race | — |
| Dominant resource fairness | 0 | 2 | 10 | 0.25 | race | counts | heisenbug | — |
| Deadline-monotonic scheduling | 1 | 5 | 2 | 0.25 | race | judge | race | — |
| Foreground-background | 0 | 4 | 5 | 0.25 | race | judge | race | — |
| TAPRIO | 5 | 2 | 1 | 0.24 | heisenbug | judge | heisenbug | — |
| EEVDF | 7 | 0 | 3 | 0.24 | race | judge | race | — |
| Kyber | 4 | 2 | 1 | 0.23 | heisenbug | judge | heisenbug | — |
| Credit-based shaper | 0 | 1 | 10 | 0.23 | race | counts | heisenbug | — |
| Stride scheduling | 0 | 4 | 3 | 0.22 | race | judge | race | — |
| Highest response ratio next | 0 | 3 | 3 | 0.20 | race | judge | race | — |
| DualPI2 | 0 | 1 | 5 | 0.18 | heisenbug | judge | heisenbug | — |
| Class-based queueing | 0 | 11 | 0 | 0.17 | heisenbug | counts | heisenbug | — |
| Shortest remaining time first | 0 | 1 | 4 | 0.17 | npe | judge | npe | — |
| Anticipatory scheduling | 0 | 2 | 2 | 0.16 | race | judge | race | — |
| FQ-PIE | 0 | 3 | 1 | 0.15 | heisenbug | judge | heisenbug | — |
| Multilevel feedback queue | 0 | 7 | 0 | 0.15 | npe | judge | npe | — |
| Lottery scheduling | 0 | 7 | 0 | 0.15 | womm | pin | leak | — |
| Stochastic Fair Queueing | 1 | 1 | 1 | 0.14 | race | judge | race | — |
| SCHED_FIFO | 8 | 0 | 0 | 0.14 | leak | judge | leak | — |
| Multilevel queue | 0 | 6 | 0 | 0.14 | leak | judge | leak | — |
| Hierarchical token bucket | 2 | 1 | 0 | 0.12 | race | judge | race | — |
| scx_simple | 4 | 0 | 0 | 0.10 | heisenbug | judge | heisenbug | — |
| Stack resource policy | 0 | 3 | 0 | 0.10 | heisenbug | judge | heisenbug | — |
| Adaptive partition scheduler | 0 | 3 | 0 | 0.10 | heisenbug | judge | heisenbug | — |
| Noop scheduler | 2 | 0 | 0 | 0.07 | race | judge | race | — |
| Earliest TxTime First | 0 | 0 | 1 | 0.05 | heisenbug | judge | heisenbug | — |
| Enhanced Transmission Selection | 0 | 0 | 1 | 0.05 | heisenbug | judge | heisenbug | — |
| N-Step-SCAN | 0 | 1 | 0 | 0.05 | heisenbug | judge | heisenbug | — |
| YDS algorithm | 0 | 1 | 0 | 0.05 | heisenbug | judge | heisenbug | — |
| Stochastic Fair Blue | 0 | 1 | 0 | 0.05 | heisenbug | judge | heisenbug | — |
| scx_central | 1 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| scx_flatcg | 1 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| scx_pair | 1 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| scx_qmap | 1 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| scx_userland | 1 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| scx_cpu0 | 1 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| Elevator algorithm | 0 | 0 | 0 | 0.00 | womm | pin | leak | — |
| FSCAN ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Shortest seek first ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Completely fair queueing ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Windows NT processor scheduling ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Credit-based fair queuing ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Hierarchical fair-service curve ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Quick Fair Queueing ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Interleaved polling with adaptive cycle time | 0 | 0 | 0 | 0.00 | bitflip | pin | heisenbug | — |
| scx_rusty ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| scx_bpfland ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| scx_cake ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| scx_chaos ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| scx_cosmos ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| scx_lavd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| scx_layered ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| scx_mitosis ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| scx_p2dq ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| scx_pandemonium ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Generalized foreground-background ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Heavy-Hitter Filter ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Generalized RED ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ALTQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| scx_sdt ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): Shortest job first (counts said leak, now off-by-one), Proportional-fair scheduling (counts said npe, now heisenbug), Generalized processor sharing (counts said leak, now heisenbug), Pinwheel scheduling (counts said leak, now heisenbug), LOOK (counts said off-by-one, now race), Deadline scheduler (counts said npe, now race), Energy aware scheduling (counts said npe, now heisenbug), PIE (counts said leak, now heisenbug), Heterogeneous earliest finish time (counts said leak, now heisenbug), Least slack time scheduling (counts said leak, now heisenbug), CHOKe (counts said leak, now heisenbug), Priority queueing (counts said off-by-one, now race), Core scheduling (counts said npe, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

## Pipeline report

Generated 2026-11-28 03:59 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

**INCOMPLETE RUN: stage recall failed: GATE FAILED: head recall: 45/60 real probe answers playable (75%); 1 Inbox-only, 14 added to the Inbox; misses: Borrowed Virtual Time, C-LOOK, Backfilling, GMP scheduler, MuQSS, Anticipatory scheduler, Pfair scheduling, Tetris, Cilk, Virtual Clock, Least Attained Service, Global EDF ... (design/reca**

Needs a human look:
- scripts/bank/plans/scheduling-algorithm.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (Interleaved polling with adaptive cycle time; Lottery scheduling, Elevator algorithm, Work stealing): the owner vets them
- scripts/bank/obvious-draft/scheduling-algorithm.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| filter kept | PASS | pass A kept 92, pass B kept 82 of 544 harvested lines |
| obvious coverage | PASS | 30/30 obvious answers accepted |
| head recall | FAIL | 45/60 real probe answers playable (75%); 1 Inbox-only, 14 added to the Inbox; misses: Borrowed Virtual Time, C-LOOK, Backfilling, GMP scheduler, MuQSS, Anticipatory scheduler, Pfair scheduling, Tetris, Cilk, Virtual Clock, Least Attained Service, Global EDF ... (design/recall/scheduling-algorithm-probe.md): below 85%; promote the Inbox lines into tiers (or fix the plan's sources), then rerun with --from recall |
| answer count | PASS | 96 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 3 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 2 | 2 |
| Works on my machine | 3 | 0 |
| Null pointer exception | 11 | 11 |
| Memory leak | 15 | 15 |
| Race condition | 19 | 19 |
| Heisenbug | 45 | 45 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 17.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## scheduling-algorithm
_Name a scheduling algorithm_

Works on my machine:
- [ ] Lottery scheduling
- [ ] Elevator algorithm
- [ ] Stride scheduling
- [ ] SCAN
- [ ] Work stealing
- [ ] other: 

Bit Flip:
- [ ] Pinwheel scheduling
- [ ] Interleaved polling with adaptive cycle time
- [ ] Stack resource policy
- [ ] scx_pandemonium
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 51 |
| harvest | done | 61 |
| filter | done | 165 |
| compare | done | 0 |
| escalate | done | 61 |
| merge | done | 16 |
| obvious | done | 36 |
| recall | failed | 77 |
| dupes | pending |  |
| links | pending |  |
| precision | pending |  |
| report | pending |  |
