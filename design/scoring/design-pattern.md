# Scoring: design-pattern (Name a design pattern)

140 answers (Bit Flip and Works on my machine left out); 13 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 10 (7%) | 10 | 0 |
| npe | 62 (44%) | 62 | 0 |
| leak | 6 (4%) | 6 | 0 |
| race | 6 (4%) | 6 | 0 |
| heisenbug | 56 (40%) | 56 | 0 |

Same tier as today: 140/140 (100%).

## Off-by-one (10)

Singleton 5.7 [4392c 0q 0f 0s], Factory 5.4 [685c 1476q 2f 0s], Model-View-Controller 5.4 [9703c 33623q 0f 0s], Command 5.0* [2037c 322q 0f 0s], State 5.0* [1300c 216q 0f 0s], Observer 4.9 [3164c 1831q 1f 0s], Iterator 4.8 [392c 14604q 0f 0s], Adapter 4.6 [1637c 0q 2f 0s], Dependency Injection 4.5 [5765c 26726q 0f 0s], Factory Method 4.4 [2724c 254q 0f 0s]

## Null pointer exception (62)

Publish-Subscribe 4.3 [4411c 2985q 0f 0s], Decorator 4.2 [2003c 4986q 0f 0s], Strategy 4.2 [3399c 725q 0f 0s], Builder 4.1 [1505c 241q 0f 0s], Model-View-ViewModel 4.0* [4221c 30192q 0f 0s], Composite 4.0* [1046c 0q 1f 0s], Abstract Factory 4.0* [956c 254q 0f 0s], Facade 4.0 [2208c 390q 0f 0s], Repository 3.9 [0c 3193q 0f 0s], Data Transfer Object 3.6 [2113c 0q 0f 0s], Proxy 3.6 [0c 229q 3f 0s], Data Access Object 3.5 [937c 32q 0f 0s], Mediator 3.5 [837c 0q 1f 0s], Active Record 3.5 [858c 28660q 0f 0s], Producer-Consumer 3.4 [1443c 1583q 0f 0s], Service Layer 3.2 [0c 395q 0f 0s], Circuit Breaker 3.2 [2088c 392q 0f 0s], Bridge 3.1 [662c 0q 4f 0s], Visitor 3.0* [3107c 785q 0f 0s], Model-View-Presenter 3.0* [1266c 1963q 0f 0s], Template Method 3.0* [894c 119q 0f 0s], Lazy Loading 3.0* [694c 5977q 0f 0s], Prototype 3.0* [349c 58q 0f 0s], Memento 3.0 [694c 0q 4f 0s], API Gateway 2.9 [0c 1319q 0f 0s], Thread Pool 2.9 [937c 4709q 2f 0s], Interpreter 2.8 [491c 10q 0f 0s], Pipeline 2.8 [0c 0q 4f 5s], Chain of Responsibility 2.8 [877c 158q 0f 0s], Domain Model 2.8 [1898c 358q 0f 0s], Pipes and Filters 2.7 [0c 0q 0f 0s], Master-Worker 2.7 [0c 0q 0f 0s], Object Pool 2.6 [678c 31q 0f 0s], Unit of Work 2.6 [0c 1061q 0f 0s], Event Queue 2.6 [0c 77q 0f 0s], Value Object 2.6 [361c 0q 0f 0s], Fork-Join 2.5 [443c 470q 0f 0s], Double Buffer 2.5 [0c 0q 0f 0s], Data Mapper 2.5 [232c 1136q 0f 0s], Reactor 2.5 [743c 0q 0f 0s], Service Locator 2.5 [740c 424q 0f 0s], Registry 2.4 [0c 0q 0f 0s], Monitor 2.4 [1120c 0q 2f 0s], Game Loop 2.4 [0c 483q 0f 0s], Event Sourcing 2.4 [0c 1242q 0f 0s], Fluent Interface 2.2 [1437c 440q 0f 0s], Single Table Inheritance 2.2 [0c 618q 0f 0s], Command Query Responsibility Segregation 2.2 [0c 1972q 0f 0s], Event Aggregator 2.1 [0c 238q 0f 0s], Flyweight 2.1 [934c 90q 0f 0s], Null Object 2.1 [791c 87q 0f 0s], Bulkhead 2.1 [0c 0q 0f 0s], Saga 2.1 [0c 0q 0f 0s], Poison Pill 2.1 [0c 0q 0f 0s], Marker Interface 2.0 [170c 0q 0f 0s], Session Facade 2.0 [0c 0q 0f 0s], Resource Acquisition Is Initialization 2.0 [2713c 602q 0f 0s], Leader Election 2.0 [443c 59q 0f 0s], Backends for Frontends 2.0 [0c 0q 0f 0s], Specification 2.0 [616c 0q 0f 0s] ...

## Memory leak (6)

Hexagonal Architecture 1.9 [7046c 183q 0f 0s], Front Controller 1.9 [194c 146q 0f 0s], Presentation Model 1.9 [0c 40q 0f 0s], Double-Checked Locking 1.8 [897c 144q 0f 0s], View Helper 1.6 [0c 422q 0f 0s], Double Dispatch 1.6 [511c 98q 0f 0s]

## Race condition (6)

Write-Ahead Log 1.9 [2644c 0q 0f 0s], Identity Map 1.7 [63c 27q 0f 0s], Parameter Object 1.5 [0c 14q 0f 0s], Model-View-Intent 1.4 [0c 11q 0f 0s], Extension Object 0.9 [0c 11q 0f 0s], Naked Objects 0.7 [211c 12q 0f 0s]

## Heisenbug (56)

Intercepting Filter 2.0 [11c 0q 0f 0s], Flux 1.9 [0c 0q 3f 0s], Event-Based Asynchronous Pattern 1.9 [0c 0q 0f 0s], Strangler Fig 1.9 [0c 0q 0f 0s], Idempotent Consumer 1.9 [0c 0q 0f 0s], BLoC 1.8 [0c 0q 0f 0s], Service to Worker 1.8 [0c 0q 0f 0s], Transactional Outbox 1.8 [0c 6q 0f 0s], Transaction Script 1.8 [0c 0q 0f 0s], Virtual Proxy 1.8 [0c 0q 0f 0s], Spatial Partition 1.7 [0c 0q 0f 0s], Server Session 1.7 [0c 0q 0f 0s], Template View 1.7 [0c 0q 0f 0s], Async Method Invocation 1.7 [0c 0q 0f 0s], Business Delegate 1.7 [40c 0q 0f 0s], Leader/Followers 1.6 [0c 0q 0f 0s], Queue-Based Load Leveling 1.6 [0c 0q 0f 0s], Data Locality 1.6 [0c 0q 0f 0s], Dirty Flag 1.6 [0c 0q 0f 0s], Page Controller 1.6 [0c 0q 0f 0s], Anti-Corruption Layer 1.6 [0c 0q 0f 0s], Load Shedding 1.6 [0c 0q 0f 0s], Special Case 1.6 [0c 0q 0f 0s], Service Stub 1.5 [0c 0q 0f 0s], Context Object 1.5 [0c 0q 0f 0s], Active Object 1.5 [270c 0q 0f 0s], Self Registration 1.5 [0c 0q 0f 0s], Table Module 1.4 [0c 0q 0f 0s], Trampoline 1.4 [722c 0q 0f 0s], Composite View 1.4 [0c 6q 0f 0s], Execute Around 1.4 [0c 0q 0f 0s], Composite Entity 1.2 [0c 0q 0f 0s], Separated Interface 1.2 [0c 0q 0f 0s], Thread-Specific Storage 1.2 [0c 9q 0f 0s], Private Class Data 1.2 [0c 0q 0f 0s], Optimistic Offline Lock 1.2 [0c 0q 0f 0s], Client Session 1.2 [0c 0q 0f 0s], Guarded Suspension 1.2 [18c 0q 0f 0s], Factory Kit 1.1 [0c 0q 0f 0s], Half-Sync/Half-Async 1.1 [0c 0q 0f 0s], Type Object 1.1 [0c 0q 0f 0s], Role Object 1.0 [0c 0q 0f 0s], Collection Pipeline 1.0 [0c 0q 0f 0s], Step Builder 1.0* [0c 0q 0f 0s], Update Method 1.0* [0c 0q 0f 0s], Abstract Document 1.0 [0c 0q 0f 0s], Balking 1.0 [42c 0q 0f 0s], Servant 1.0 [27c 0q 0f 0s], Object Mother 1.0 [0c 0q 0f 0s], Ambassador 1.0 [0c 0q 0f 0s], Collecting Parameter 0.9 [0c 0q 0f 0s], Tolerant Reader 0.9 [0c 0q 0f 0s], Acyclic Visitor 0.8 [0c 0q 0f 0s], Metadata Mapping 0.8 [0c 0q 0f 0s], Subclass Sandbox 0.8 [0c 0q 0f 0s], Serialized LOB 0.3 [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
