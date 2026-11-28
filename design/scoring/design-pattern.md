# Scoring: design-pattern (Name a design pattern)

140 answers (Bit Flip and Works on my machine left out); 13 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 10 (7%) | 10 | 0 |
| npe | 62 (44%) | 62 | 0 |
| leak | 11 (8%) | 9 | 0 |
| race | 2 (1%) | 2 | 0 |
| heisenbug | 55 (39%) | 57 | 0 |

Same tier as today: 136/140 (97%).

## Off-by-one (10)

Singleton 5.7 [4392c 8604q 0f], Factory 5.4 [685c 3184q 2f], Model-View-Controller 5.4 [9703c 33664q 1f], Command 5.0* [2037c 12019q 0f], State 5.0* [1300c 9218q 0f], Observer 4.9 [3164c 1831q 1f], Iterator 4.8 [392c 14604q 0f], Adapter 4.6 [1637c 5539q 2f], Dependency Injection 4.5 [5765c 26726q 0f], Factory Method 4.4 [2724c 254q 0f]

## Null pointer exception (62)

Publish-Subscribe 4.3 [4411c 2985q 0f], Decorator 4.2 [2003c 4986q 0f], Strategy 4.2 [3399c 725q 0f], Builder 4.1 [1505c 1899q 0f], Model-View-ViewModel 4.0* [4221c 30192q 0f], Composite 4.0* [1046c 992q 1f], Abstract Factory 4.0* [956c 254q 0f], Facade 4.0 [2208c 390q 0f], Repository 3.9 [0c 10530q 0f], Data Transfer Object 3.6 [2113c 2131q 0f], Proxy 3.6 [830c 26404q 3f], Data Access Object 3.5 [937c 2624q 2f], Mediator 3.5 [837c 451q 1f], Active Record 3.5 [858c 28660q 0f], Producer-Consumer 3.4 [1443c 1583q 0f], Service Layer 3.2 [0c 395q 0f], Circuit Breaker 3.2 [2088c 392q 0f], Bridge 3.1 [662c 2584q 4f], Visitor 3.0* [3107c 785q 0f], Model-View-Presenter 3.0* [1266c 1963q 0f], Template Method 3.0* [894c 119q 0f], Lazy Loading 3.0* [694c 5977q 0f], Prototype 3.0* [349c 5440q 0f], Memento 3.0 [694c 77q 4f], API Gateway 2.9 [0c 1319q 0f], Thread Pool 2.9 [937c 4709q 2f], Pipeline 2.8 [692c 5599q 4f], Interpreter 2.8 [491c 2301q 0f], Chain of Responsibility 2.8 [877c 158q 0f], Domain Model 2.8 [1898c 358q 0f], Pipes and Filters 2.7 [692c 0q 0f], Master-Worker 2.7 [0c 0q 0f], Object Pool 2.6 [678c 31q 0f], Unit of Work 2.6 [0c 1061q 0f], Event Queue 2.6 [0c 77q 0f], Value Object 2.6 [361c 0q 0f], Fork-Join 2.5 [443c 470q 0f], Double Buffer 2.5 [0c 0q 0f], Data Mapper 2.5 [232c 1136q 0f], Reactor 2.5 [743c 3300q 0f], Service Locator 2.5 [740c 424q 0f], Registry 2.4 [0c 10607q 0f], Monitor 2.4 [1120c 9308q 2f], Game Loop 2.4 [0c 483q 0f], Event Sourcing 2.4 [0c 1242q 0f], Fluent Interface 2.2 [1437c 440q 0f], Single Table Inheritance 2.2 [0c 618q 0f], Command Query Responsibility Segregation 2.2 [0c 1972q 0f], Event Aggregator 2.1 [0c 238q 0f], Flyweight 2.1 [934c 90q 0f], Null Object 2.1 [791c 87q 0f], Bulkhead 2.1 [0c 13q 0f], Saga 2.1 [0c 502q 0f], Poison Pill 2.1 [0c 0q 0f], Marker Interface 2.0 [170c 0q 0f], Session Facade 2.0 [0c 0q 0f], Resource Acquisition Is Initialization 2.0 [2713c 602q 0f], Leader Election 2.0 [443c 59q 0f], Backends for Frontends 2.0 [0c 0q 0f], Specification 2.0 [616c 1749q 0f] ...

## Memory leak (11)

Hexagonal Architecture 1.9 [7046c 183q 0f], Front Controller 1.9 [194c 146q 0f], Flux 1.9 [0c 1657q 3f], Write-Ahead Log 1.9 [2644c 246q 0f], Double-Checked Locking 1.8 [897c 144q 0f], BLoC 1.8 [0c 2141q 0f], View Helper 1.6 [0c 422q 0f], Double Dispatch 1.6 [511c 98q 0f], Anti-Corruption Layer 1.6 [0c 4292q 43f], Servant 1.0 [27c 210q 0f], Ambassador 1.0 [0c 95q 0f]

## Race condition (2)

Presentation Model 1.9 [0c 40q 0f], Identity Map 1.7 [63c 27q 0f]

## Heisenbug (55)

Intercepting Filter 2.0 [11c 0q 0f], Event-Based Asynchronous Pattern 1.9 [0c 0q 0f], Strangler Fig 1.9 [0c 0q 0f], Idempotent Consumer 1.9 [0c 0q 0f], Service to Worker 1.8 [0c 0q 0f], Transactional Outbox 1.8 [0c 6q 0f], Virtual Proxy 1.8 [830c 0q 0f], Transaction Script 1.8 [0c 0q 0f], Spatial Partition 1.7 [0c 0q 0f], Server Session 1.7 [0c 0q 0f], Template View 1.7 [0c 0q 0f], Async Method Invocation 1.7 [0c 0q 0f], Business Delegate 1.7 [40c 0q 0f], Leader/Followers 1.6 [0c 0q 0f], Queue-Based Load Leveling 1.6 [0c 0q 0f], Data Locality 1.6 [0c 0q 0f], Dirty Flag 1.6 [0c 0q 0f], Page Controller 1.6 [0c 0q 0f], Load Shedding 1.6 [0c 0q 0f], Special Case 1.6 [0c 0q 0f], Parameter Object 1.5 [0c 14q 0f], Service Stub 1.5 [0c 0q 0f], Context Object 1.5 [0c 0q 0f], Active Object 1.5 [270c 0q 0f], Self Registration 1.5 [0c 0q 0f], Model-View-Intent 1.4 [0c 11q 0f], Table Module 1.4 [0c 0q 0f], Trampoline 1.4 [722c 0q 0f], Composite View 1.4 [0c 6q 0f], Execute Around 1.4 [0c 0q 0f], Composite Entity 1.2 [0c 0q 0f], Separated Interface 1.2 [0c 0q 0f], Thread-Specific Storage 1.2 [0c 9q 0f], Private Class Data 1.2 [0c 0q 0f], Optimistic Offline Lock 1.2 [0c 0q 0f], Client Session 1.2 [0c 0q 0f], Guarded Suspension 1.2 [18c 0q 0f], Factory Kit 1.1 [0c 0q 0f], Half-Sync/Half-Async 1.1 [0c 0q 0f], Type Object 1.1 [0c 0q 0f], Role Object 1.0 [0c 0q 0f], Collection Pipeline 1.0 [0c 0q 0f], Step Builder 1.0* [0c 0q 0f], Update Method 1.0* [0c 0q 0f], Abstract Document 1.0 [0c 0q 0f], Balking 1.0 [42c 0q 0f], Object Mother 1.0 [0c 0q 0f], Extension Object 0.9 [0c 11q 0f], Collecting Parameter 0.9 [0c 0q 0f], Tolerant Reader 0.9 [0c 0q 0f], Acyclic Visitor 0.8 [0c 0q 0f], Metadata Mapping 0.8 [0c 0q 0f], Subclass Sandbox 0.8 [0c 0q 0f], Naked Objects 0.7 [211c 12q 0f], Serialized LOB 0.3 [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
