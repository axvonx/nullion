# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: design pattern.

## design-pattern

146 candidates; 99 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| Specification ⚠ counts said off-by-one | 1 | 53 | 159 | 1.00 | leak | judge (override) | leak | — |
| State | 2 | 14 | 98 | 0.89 | off-by-one | counts | off-by-one | — |
| Adapter | 0 | 54 | 83 | 0.80 | npe | counts | off-by-one | — |
| Monitor | 1 | 18 | 19 | 0.78 | npe | counts | leak | — |
| Composite | 0 | 43 | 45 | 0.75 | npe | counts | npe | — |
| Strategy | 0 | 22 | 80 | 0.73 | npe | counts | off-by-one | — |
| Proxy | 1 | 4 | 13 | 0.61 | npe | counts | off-by-one | — |
| Observer | 0 | 7 | 57 | 0.59 | npe | counts | off-by-one | — |
| Prototype | 0 | 12 | 22 | 0.55 | leak | counts | npe | — |
| Pipeline | 0 | 4 | 60 | 0.54 | leak | counts | npe | — |
| Repository ⚠ counts said leak | 0 | 10 | 22 | 0.54 | off-by-one | judge (override) | off-by-one | — |
| Bridge | 0 | 5 | 34 | 0.51 | leak | counts | npe | — |
| Iterator ⚠ counts said leak | 0 | 4 | 32 | 0.49 | off-by-one | judge (override) | off-by-one | — |
| Interpreter | 0 | 4 | 30 | 0.48 | leak | counts | npe | — |
| Factory ⚠ counts said leak | 0 | 13 | 4 | 0.42 | off-by-one | judge (override) | off-by-one | — |
| Singleton ⚠ counts said leak | 0 | 10 | 5 | 0.42 | off-by-one | judge (override) | off-by-one | — |
| Visitor | 0 | 6 | 4 | 0.35 | npe | judge | npe | — |
| Command | 0 | 3 | 8 | 0.34 | off-by-one | judge | off-by-one | — |
| Decorator | 0 | 5 | 4 | 0.33 | off-by-one | judge | off-by-one | — |
| Twin | 0 | 5 | 4 | 0.33 | bitflip | pin | heisenbug | — |
| Model-View-Controller | 0 | 6 | 3 | 0.33 | off-by-one | judge | off-by-one | — |
| Mediator | 0 | 1 | 8 | 0.27 | npe | judge | npe | — |
| Gateway | 0 | 2 | 3 | 0.24 | leak | judge | leak | — |
| Publish-Subscribe | 0 | 1 | 4 | 0.22 | off-by-one | judge | off-by-one | — |
| Factory Method | 0 | 2 | 2 | 0.22 | off-by-one | judge | off-by-one | — |
| Builder | 0 | 3 | 1 | 0.21 | off-by-one | judge | off-by-one | — |
| Saga | 0 | 1 | 3 | 0.20 | leak | judge | leak | — |
| Dependency Injection | 0 | 1 | 2 | 0.17 | off-by-one | judge | off-by-one | — |
| Registry | 0 | 1 | 2 | 0.17 | npe | judge | npe | — |
| Abstract Factory | 0 | 3 | 0 | 0.15 | off-by-one | judge | off-by-one | — |
| Template Method | 0 | 3 | 0 | 0.15 | npe | judge | npe | — |
| Money | 0 | 0 | 4 | 0.15 | heisenbug | judge | heisenbug | — |
| Facade | 0 | 1 | 1 | 0.14 | off-by-one | judge | off-by-one | — |
| Memento | 0 | 1 | 1 | 0.14 | npe | judge | npe | — |
| Domain Model | 0 | 0 | 3 | 0.13 | leak | judge | leak | — |
| Flyweight | 0 | 2 | 0 | 0.12 | npe | judge | npe | — |
| Null Object | 0 | 2 | 0 | 0.12 | npe | judge | npe | — |
| Map-Reduce | 0 | 0 | 2 | 0.10 | leak | judge | leak | — |
| Data Access Object | 0 | 1 | 0 | 0.07 | npe | judge | npe | — |
| Naked Objects | 0 | 1 | 0 | 0.07 | heisenbug | judge | heisenbug | — |
| API Gateway | 0 | 1 | 0 | 0.07 | leak | judge | leak | — |
| Circuit Breaker | 0 | 0 | 1 | 0.06 | npe | judge | npe | — |
| Event Sourcing | 0 | 0 | 1 | 0.06 | leak | judge | leak | — |
| Model-View-ViewModel | 0 | 0 | 1 | 0.06 | npe | judge | npe | — |
| Object Pool | 0 | 0 | 1 | 0.06 | npe | judge | npe | — |
| Type Object | 0 | 0 | 1 | 0.06 | race | judge | race | — |
| Double Dispatch | 0 | 0 | 1 | 0.06 | leak | judge | leak | — |
| Page Object | 0 | 0 | 1 | 0.06 | npe | judge | npe | — |
| Special Case | 0 | 0 | 1 | 0.06 | race | judge | race | — |
| Active Object ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Acyclic Visitor ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Balking ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Business Delegate ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Chain of Responsibility ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Collecting Parameter ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Command Query Responsibility Segregation ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Composite Entity ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Composite View ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Data Transfer Object ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Dirty Flag ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Double-Checked Locking ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Event Aggregator ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Execute Around ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Extension Object ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Factory Kit ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Fluent Interface ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Game Loop ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Guarded Suspension ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Half-Sync/Half-Async ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Identity Map ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Intercepting Filter ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Lazy Loading ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Leader Election ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Leader/Followers ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Marker Interface ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Master-Worker ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Metadata Mapping ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Model-View-Intent ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Model-View-Presenter ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Monostate | 0 | 0 | 0 | 0.00 | womm | pin | race | — |
| Multiton | 0 | 0 | 0 | 0.00 | womm | pin | race | — |
| Object Mother ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Optimistic Offline Lock ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Presentation Model ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Private Class Data ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Reactor ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Resource Acquisition Is Initialization ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Role Object ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Separated Interface ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Serialized LOB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Service Layer ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Service Locator ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Service to Worker ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Session Facade ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Step Builder ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Subclass Sandbox ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Table Module ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Template View ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Thread-Specific Storage ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Tolerant Reader ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Transaction Script ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Unit of Work ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Value Object ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| View Helper ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Abstract Document ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Ambassador ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Anti-Corruption Layer ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Client Session ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Collection Pipeline ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Context Object ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Curiously Recurring Template Pattern | 0 | 0 | 0 | 0.00 | womm | pin | leak | — |
| Data Locality ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Data Mapper ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Double Buffer ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Event Queue ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Front Controller ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Page Controller ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Parameter Object ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Poison Pill ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Producer-Consumer ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| Servant ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Server Session ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Service Stub ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Single Table Inheritance ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Spatial Partition ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Strangler Fig ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Table Inheritance ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Trampoline ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Transactional Outbox ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Update Method ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Virtual Proxy ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Write-Ahead Log ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Bulkhead ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Fork-Join ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Flux ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Thread Pool ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Async Method Invocation ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Backends for Frontends ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Idempotent Consumer ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Load Shedding ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Self Registration ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Queue-Based Load Leveling ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Hexagonal Architecture ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Version Number ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Event-Based Asynchronous Pattern ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| BLoC ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): Iterator (counts said leak, now off-by-one), Singleton (counts said leak, now off-by-one), Factory (counts said leak, now off-by-one), Repository (counts said leak, now off-by-one), Specification (counts said off-by-one, now leak)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

16/20 sampled answers are members (80%); 14/20 also have an acceptable tier. Not members: Self Registration (I cannot place this as a named pattern in the GoF catalogue or a published pattern language. It reads as a descriptive phrase, so when unsure it is out.), Subclass Sandbox (I cannot confirm this as a named pattern in a published source. It is unsure, so it is out under the strict rule.), Table Inheritance (Not a named pattern. Fowler's catalogue has Single Table, Class Table and Concrete Table Inheritance; the bare phrase is a fragment of those.), Map-Reduce (A distributed programming model from Google's paper, not an object-oriented design solution or a GoF or pattern-language entry. Outside the accepts line.).

## Pipeline report

Generated 2026-11-27 23:01 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

**INCOMPLETE RUN: stage precision failed: GATE FAILED: precision: precision 80% < 90%: `/opt/homebrew/opt/python@3.15/bin/python3.15 -I /Users/axvon/nullion/scripts/sample-precision.py design-pattern` exited 1: design-pattern: below 90%; fix the source plan or the filter before approving**

Needs a human look:
- scripts/bank/plans/design-pattern.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (Twin; Curiously Recurring Template Pattern, Monostate, Multiton): the owner vets them
- scripts/bank/obvious-draft/design-pattern.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 34/34 obvious answers accepted |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | PASS | 76/146 answers have a verified link (52%); prompt link yes |
| precision | FAIL | precision 80% < 90%: `/opt/homebrew/opt/python@3.15/bin/python3.15 -I /Users/axvon/nullion/scripts/sample-precision.py design-pattern` exited 1: design-pattern: below 90%; fix the source plan or the filter before approving |
| answer count | PASS | 146 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 3 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 15 | 15 |
| Works on my machine | 3 | 0 |
| Null pointer exception | 33 | 33 |
| Memory leak | 41 | 41 |
| Race condition | 44 | 44 |
| Heisenbug | 9 | 9 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 2.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## design-pattern
_Name a design pattern_

Works on my machine:
- [ ] Curiously Recurring Template Pattern
- [ ] Double-Checked Locking
- [ ] Flyweight
- [ ] Monostate
- [ ] Multiton
- [ ] Acyclic Visitor
- [ ] other: 

Bit Flip:
- [ ] Twin
- [ ] Naked Objects
- [ ] Extension Object
- [ ] Curiously Recurring Template Pattern
- [ ] Subclass Sandbox
- [ ] Tolerant Reader
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 12 |
| harvest | done | 2 |
| filter | done | 83 |
| compare | done | 0 |
| escalate | done | 29 |
| merge | done | 11 |
| obvious | done | 26 |
| dupes | done | 0 |
| links | done | 22 |
| precision | failed | 28 |
| report | pending |  |
