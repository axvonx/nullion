# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: programming language, language feature, compiler, semantics.

## language-feature

15 candidates; 4 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| type inference | 0 | 29 | 141 | 0.80 | npe | counts | npe | — |
| static typing | 0 | 22 | 167 | 0.80 | npe | counts | off-by-one | — |
| coroutine | 0 | 5 | 24 | 0.80 | npe | counts | leak | — |
| dynamic dispatch | 0 | 1 | 13 | 0.48 | womm | pin | npe | — |
| list comprehension | 0 | 1 | 4 | 0.35 | npe | judge | npe | — |
| set comprehension | 0 | 0 | 7 | 0.26 | npe | judge | npe | — |
| implicit coercion | 0 | 0 | 3 | 0.17 | npe | judge | npe | — |
| static polymorphism | 0 | 0 | 2 | 0.14 | womm | pin | leak | — |
| dictionary comprehension | 0 | 0 | 1 | 0.09 | npe | judge | npe | — |
| derive macro | 0 | 0 | 1 | 0.09 | leak | judge | leak | — |
| generator-based coroutine | 0 | 0 | 1 | 0.09 | bitflip | pin | race | — |
| preprocessor macro ⚠ no evidence | 2 | 0 | 0 | 0.00 | npe | judge | npe | — |
| function-like macro ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| attribute macro ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| concept-based polymorphism ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): none

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

20/20 sampled answers are members (100%); 20/20 also have an acceptable tier. Not members: none.

## Pipeline report

Generated 2026-11-27 23:06 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/language-feature.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (generator-based coroutine; static polymorphism, dynamic dispatch): the owner vets them
- scripts/bank/obvious-draft/language-feature.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 47/47 obvious answers accepted |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | PASS | 53/54 answers have a verified link (98%); prompt link yes |
| precision | PASS | 20/20 sampled answers are members (100%), 20/20 with acceptable tier |
| answer count | PASS | 54 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 2 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 17 | 17 |
| Works on my machine | 2 | 0 |
| Null pointer exception | 30 | 30 |
| Memory leak | 3 | 3 |
| Race condition | 1 | 1 |
| Heisenbug | 0 | 0 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 4.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## language-feature
_Name a programming language feature_

Works on my machine:
- [ ] type inference
- [ ] dynamic dispatch
- [ ] static polymorphism
- [ ] concept-based polymorphism
- [ ] generator-based coroutine
- [ ] coroutine
- [ ] other: 

Bit Flip:
- [ ] concept-based polymorphism
- [ ] generator-based coroutine
- [ ] attribute macro
- [ ] static polymorphism
- [ ] implicit coercion
- [ ] function-like macro
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 11 |
| harvest | done | 3 |
| filter | done | 23 |
| compare | done | 0 |
| escalate | done | 15 |
| merge | done | 7 |
| obvious | done | 31 |
| dupes | done | 0 |
| links | done | 21 |
| precision | done | 23 |
| report | running |  |
