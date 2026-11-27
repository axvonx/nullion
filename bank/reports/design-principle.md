# Scoring report

No scoring report was written for design-principle.

## Pipeline report

Generated 2026-11-27 23:02 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

**INCOMPLETE RUN: stage merge failed: haiku failed after 2 attempts: ValueError: need {bitflip: <candidate name>, womm: [1-3 other candidate names]}**

Needs a human look:
- scripts/bank/plans/design-principle.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)

### Gates

| gate | result | detail |
|---|---|---|
| answer count | WARN | 0 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | WARN | 0 Bit Flip, 0 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 0 | 0 |
| Works on my machine | 0 | 0 |
| Null pointer exception | 0 | 0 |
| Memory leak | 0 | 0 |
| Race condition | 0 | 0 |
| Heisenbug | 0 | 0 |
| Bit Flip | 0 | 0 |

Inbox (never accepted in play): 7.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## design-principle
_Name a software design principle_

Works on my machine:
- [ ] other: 

Bit Flip:
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 9 |
| harvest | done | 4 |
| filter | done | 13 |
| compare | done | 0 |
| escalate | done | 0 |
| merge | failed | 14 |
| obvious | pending |  |
| dupes | pending |  |
| links | pending |  |
| precision | pending |  |
| report | pending |  |
