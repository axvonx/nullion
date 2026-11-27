# Draft category triage (2026-11-27)

Gemini hydrogen-low over the 159 draft categories (`design/triage/run.sh`). Its verdicts are lenient (it kept some it should have cut), so use the **rank** (obvious ×2 + depth + fun) as the harvesting order and a person's eye on the bottom of the keep list. Obvious is weighted double: a prompt nobody can open is no fun however deep its tail.

| # | category | verdict | obvious | depth | fun | ~answers | wildcard | note |
|---|---|---|---|---|---|---|---|---|
| 1 | compiler (languages) | keep | 5 | 5 | 5 | 150 |  | Essential computing category with huge breadth across modern, historical, and minimal compilers. |
| 2 | complexity-class (data) | keep | 5 | 5 | 5 | 200 |  | Instant obvious answers like P, NP, and PSPACE paired with hundreds of real named classes in the Complexity Zoo. |
| 3 | database (data) | keep | 5 | 5 | 5 | 250 |  | Universally accessible first answers and a massive tail of historical, academic, and specialized DBMSs. |
| 4 | dns-record-type (os) | keep | 5 | 5 | 5 | 90 |  | Ideal trivia category with universal obvious records, a clean IANA registry, and fun obscure types. |
| 5 | game-engine (data) | keep | 5 | 5 | 5 | 120 | yes | High-fun wildcard category with obvious public engines and a great deep tail of proprietary studio engines. |
| 6 | historical-cipher (hardware) | keep | 5 | 5 | 5 | 80 | yes | Fun, accessible category with instant classics (Caesar, Enigma) and a rich tail of classical and mechanical ciphers. |
| 7 | linux-device-node (os) | keep | 5 | 5 | 5 | 150 |  | Instantly accessible (/dev/null, /dev/zero) with a deep, memorable kernel driver tail. |
| 8 | network-protocol (os) | keep | 5 | 5 | 5 | 400 |  | Classic high-fun category with instant obvious answers and a massive tail of RFC and historic protocols. |
| 9 | serialization-format (data) | keep | 5 | 5 | 5 | 60 |  | Top-tier prompt with instant obvious answers for every developer and a massive tail of binary and historical formats. |
| 10 | text-editor (languages) | keep | 5 | 5 | 5 | 100 |  | Every programmer knows several editors immediately and the historical and niche tail is huge. |
| 11 | turing-award-winner (hardware) | keep | 5 | 5 | 5 | 78 | yes | Exact official list of laureates with famous CS pioneers up front and a rewarding deep tail. |
| 12 | unix-daemon (os) | keep | 5 | 5 | 5 | 200 |  | Very accessible and fun category with iconic daemons like sshd and crond and a rich tail of system services. |
| 13 | video-codec (data) | keep | 5 | 5 | 5 | 70 |  | Classic high-engagement prompt with instant obvious answers (H.264, AV1, HEVC) and a huge tail of historical and proprietary codecs. |
| 14 | web-framework (languages) | keep | 5 | 5 | 5 | 150 |  | Broadly accessible with instant obvious answers and a massive multi-language deep tail. |
| 15 | x86-instruction (hardware) | keep | 5 | 5 | 5 | 1000 |  | Iconic category with immediate obvious mnemonics and hundreds of obscure SIMD and system instructions. |
| 16 | bus-standard (hardware) | keep | 5 | 5 | 4 | 65 |  | Broad, fun hardware prompt with instant answers like USB and PCIe and a deep tail of retro and industrial buses. |
| 17 | color-space (data) | keep | 5 | 5 | 4 | 60 |  | Every developer knows sRGB, HSV, and CMYK, and the perceptual/HDR tail like Oklab and ICtCp is rich. |
| 18 | design-pattern (languages) | keep | 5 | 4 | 5 | 60 |  | Staple software engineering taxonomy with instant GoF answers and a great tail of lesser-known patterns. |
| 19 | design-principle (languages) | keep | 5 | 4 | 5 | 50 |  | Punchy, memorable acronyms and named laws that make for very engaging trivia. |
| 20 | graphics-api (data) | keep | 5 | 4 | 5 | 40 |  | Immediate hits like OpenGL, Vulkan, and DirectX paired with historical and console-specific APIs like Glide and NVN. |
| 21 | language-feature (languages) | keep | 5 | 5 | 4 | 120 |  | Broad but fun category with instant obvious answers and a massive academic/PL-theory deep tail. |
| 22 | memory-technology (hardware) | keep | 5 | 5 | 4 | 60 |  | Strong mix of everyday acronyms (DRAM, SRAM, flash) and fascinating historical/emerging memory technologies. |
| 23 | microprocessor (hardware) | keep | 5 | 5 | 4 | 150 |  | Classic 8086/6502/Z80 answers come to mind immediately, with a huge historical and modern catalog of commercial CPUs. |
| 24 | package-manager (languages) | keep | 5 | 5 | 4 | 75 |  | High-accessibility prompt with immediate obvious answers and a huge tail of OS and language-specific package managers. |
| 25 | test-framework (languages) | keep | 5 | 5 | 4 | 85 |  | Every developer knows several test frameworks, and the cross-language long tail is huge. |
| 26 | unix-shell (os) | keep | 5 | 4 | 5 | 45 |  | Strong obviousness from bash and zsh to fish, paired with a great tail of Plan 9 and modern alternative shells. |
| 27 | unix-signal (os) | keep | 5 | 4 | 5 | 40 |  | Classic systems category with instant SIGKILL/SIGINT answers and a clean, finite tail of platform-specific signals. |
| 28 | video-game-console-1990s (hardware) | keep | 5 | 4 | 5 | 55 | yes | Instant nostalgic hits (PlayStation, N64, Saturn) paired with a fun tail of obscure 90s consoles and handhelds. |
| 29 | web-attack (hardware) | keep | 5 | 4 | 5 | 60 |  | Clear membership with instant obvious answers like SQL injection and XSS plus a deep tail of named web vulnerabilities. |
| 30 | apple-macintosh-model (hardware) | keep | 5 | 4 | 4 | 90 | yes | Fun computing-history prompt with universal obvious answers and a large catalog of specific Macintosh models. |
| 31 | build-tool (languages) | keep | 5 | 4 | 4 | 60 |  | Every developer knows several immediately, and the niche/academic build system tail is rich. |
| 32 | consensus-protocol (data) | keep | 4 | 5 | 5 | 75 |  | Iconic distributed systems prompt with Paxos and Raft at the top and a deep tail of BFT and Paxos variants. |
| 33 | cryptographic-attack (hardware) | keep | 4 | 5 | 5 | 70 |  | Excellent security prompt with obvious classics and a deep, memorable tail of named protocol and implementation attacks. |
| 34 | defunct-computer-company (hardware) | keep | 4 | 5 | 5 | 90 | yes | Engaging computing-history category with many famous defunct makers (Commodore, Sun, SGI, DEC) and deep-cut hardware startups. |
| 35 | dynamic-programming-problem (data) | keep | 5 | 4 | 4 | 65 |  | Every programmer knows knapsack, edit distance, and LCS, with plenty of classic named DP problems in the tail. |
| 36 | frontend-ui-library (languages) | keep | 5 | 4 | 4 | 80 |  | High immediate recall for major frameworks plus a famously deep tail of lightweight and historical JS libraries. |
| 37 | home-computer-1980s (hardware) | keep | 4 | 5 | 5 | 120 | yes | Crisp decade boundary with iconic 80s micros up front and a huge international tail of obscure home computers. |
| 38 | hypervisor (hardware) | keep | 5 | 4 | 4 | 45 |  | Every developer knows KVM, VirtualBox, and ESXi, and there is a real tail of research, embedded, and cloud hypervisors. |
| 39 | ide (languages) | keep | 5 | 4 | 4 | 65 |  | Every developer can name several IDEs immediately, and the historical and language-specific long tail is rich. |
| 40 | linux-errno (os) | keep | 4 | 5 | 5 | 130 |  | Exact header-defined set with iconic everyday errors and hilarious/obscure deep-cut constants. |
| 41 | malware-family (hardware) | keep | 4 | 5 | 5 | 200 |  | Famous worms and ransomware give strong obvious answers, backed by a massive, well-documented tail of APTs and malware families. |
| 42 | monitoring-system (os) | keep | 5 | 4 | 4 | 80 |  | High obviousness with Prometheus, Nagios, and Zabbix, plus a solid tail of classic and niche monitoring tools. |
| 43 | penetration-testing-tool (hardware) | keep | 4 | 5 | 5 | 120 |  | Clear security-domain category with well-known tools like Nmap and Metasploit plus a deep red-team and Kali ecosystem. |
| 44 | programming-paradigm (languages) | keep | 5 | 4 | 4 | 35 |  | Great mix of textbook obvious answers and esoteric computational paradigms from PL literature. |
| 45 | pseudorandom-number-generator (data) | keep | 4 | 5 | 5 | 50 |  | Excellent category with universal obvious picks (Mersenne Twister, LCG, xorshift) and a huge, real deep tail. |
| 46 | version-control-system (languages) | keep | 5 | 4 | 4 | 40 |  | Well-bounded category with universal obvious answers and a rich history of centralized and distributed systems. |
| 47 | web-server (languages) | keep | 5 | 4 | 4 | 50 |  | Clear membership rule, strong obvious picks, and plenty of historical and embedded servers. |
| 48 | window-manager (os) | keep | 4 | 5 | 5 | 100 |  | Beloved Linux/Unix desktop topic with strong obvious tiling/floating WMs and a huge tail of niche and historic ones. |
| 49 | cache-replacement-policy (os) | keep | 4 | 4 | 5 | 45 |  | Classic systems topic with obvious textbook answers and a great research-paper deep tail. |
| 50 | code-smell (languages) | keep | 4 | 4 | 5 | 55 |  | Memorable, fun names from Fowler/Beck and anti-pattern catalogues that reward both intuition and deep reading. |
| 51 | computational-model (data) | keep | 4 | 5 | 4 | 60 |  | Clear theoretical category with immediate hits like Turing machine and lambda calculus plus deep cuts like Post tag systems. |
| 52 | domain-specific-language (languages) | keep | 4 | 5 | 4 | 150 |  | Broad, fun category spanning everyday tools like SQL and regex to specialized languages like Stan and Halide. |
| 53 | elf-section (os) | keep | 4 | 5 | 4 | 60 |  | Cleanly defined by the ELF spec and toolchains, with obvious sections and deep linker/ABI cuts. |
| 54 | game-ai-technique (data) | keep | 4 | 4 | 5 | 45 | yes | Fun, accessible prompt with FSMs and behavior trees up front and GOAP/HTN in the tail; fits a wildcard slot. |
| 55 | gpu-microarchitecture (hardware) | keep | 4 | 5 | 4 | 70 |  | Clear membership rule with obvious NVIDIA/AMD/Intel codenames and a deep tail of mobile, workstation, and historical GPU architectures. |
| 56 | image-filter (data) | keep | 4 | 5 | 4 | 60 |  | Strong graphics/vision category with Gaussian blur and Sobel at the top and rich edge-preserving filters in the tail. |
| 57 | intel-microarchitecture (hardware) | keep | 4 | 5 | 4 | 60 |  | Clear vendor-scoped CPU codename list with familiar modern cores and a deep tail of older, Atom, and server microarchitectures. |
| 58 | linux-sysctl-key (os) | keep | 4 | 5 | 4 | 800 |  | Well-defined /proc/sys tunable names with iconic obvious answers like vm.swappiness and a deep tail of kernel parameters. |
| 59 | parsing-algorithm (data) | keep | 4 | 4 | 5 | 35 |  | Classic CS topic with high developer recognition and a great tail of specialized grammar-parsing algorithms. |
| 60 | rust-crate (languages) | keep | 4 | 5 | 4 | 500 |  | Huge, easily verifiable answer space on crates.io with strong obvious hits (serde, tokio) and endless deep cuts. |
| 61 | static-analysis-tool (languages) | keep | 4 | 5 | 4 | 75 |  | Strong category spanning everyday linters to formal verification and industrial static analyzers. |
| 62 | string-matching-algorithm (data) | keep | 4 | 4 | 5 | 40 |  | Classic algorithms prompt with high-recall staples (KMP, Boyer-Moore, Rabin-Karp) and a deep academic tail. |
| 63 | systemd-directive (os) | keep | 4 | 5 | 4 | 300 |  | Clear man-page membership rule with everyday unit settings like ExecStart and a deep tail of sandboxing directives. |
| 64 | x86-cpu-feature-flag (hardware) | keep | 4 | 5 | 4 | 150 |  | Crisp membership rule via CPUID and /proc/cpuinfo with obvious SIMD flags and an extensive hardware deep tail. |
| 65 | architectural-pattern (languages) | keep | 4 | 4 | 4 | 45 |  | Distinct from class-level design patterns with strong obvious answers and a solid literature-backed tail. |
| 66 | bootloader (hardware) | keep | 4 | 4 | 4 | 45 |  | Strong systems prompt with obvious Linux/PC bootloaders and a rich tail of embedded, BSD, and legacy bootloaders. |
| 67 | ci-service (languages) | keep | 5 | 3 | 3 | 40 |  | High immediate recall for modern CI platforms with a decent tail of self-hosted and legacy runners. |
| 68 | code-formatter (languages) | keep | 4 | 4 | 4 | 50 |  | Clear membership rule with strong cross-language obvious answers and plenty of language-specific deep cuts. |
| 69 | cpu-scheduling-algorithm (os) | keep | 4 | 4 | 4 | 40 |  | Strong OS fundamentals category with clear obvious answers and real kernel and academic deep cuts. |
| 70 | debugger (languages) | keep | 4 | 4 | 4 | 50 |  | Strong core developer category with classic CLI, IDE, and reverse-engineering debuggers in the tail. |
| 71 | error-code (hardware) | keep | 4 | 4 | 4 | 45 |  | Strong foundational CS/hardware category covering parity, CRC, Hamming, Reed-Solomon, and specialized check codes. |
| 72 | exploit-mitigation (hardware) | keep | 4 | 4 | 4 | 40 |  | Clear security-engineering category with obvious OS/compiler mitigations (ASLR, DEP, stack canary) and hardware features. |
| 73 | hardware-description-language (hardware) | keep | 4 | 4 | 4 | 45 |  | Well-bounded category with immediate answers like Verilog and VHDL plus a solid tail of modern embedded and academic HDLs. |
| 74 | linux-network-interface-type (os) | keep | 4 | 4 | 4 | 45 |  | Clean iproute2 link-type membership rule with strong everyday answers like bridge and veth plus deep cuts like nlmon and vcan. |
| 75 | markup-language (languages) | keep | 4 | 4 | 4 | 45 |  | Strong category with universal obvious answers (HTML, Markdown, XML) and a great historical/documentation tail. |
| 76 | matrix-factorization (data) | keep | 4 | 4 | 4 | 35 |  | Well-bounded numerical linear algebra category with obvious staples like LU/QR/SVD and a deep tail of specialized decompositions. |
| 77 | numerical-root-finding-method (data) | keep | 4 | 4 | 4 | 35 |  | Strong obvious answers like Newton and bisection paired with a deep tail of named polynomial and scalar root-finders. |
| 78 | physics-engine (data) | keep | 4 | 4 | 4 | 45 | yes | Fun, concrete named engines with strong obvious recall from games and robotics plus a long tail of libraries. |
| 79 | routing-protocol (os) | keep | 4 | 4 | 4 | 45 |  | Clear membership rule with well-known core protocols like BGP and OSPF and a fun tail of mesh and historic protocols. |
| 80 | simd-extension (hardware) | keep | 4 | 4 | 4 | 40 |  | Crisp hardware category with obvious x86/ARM answers (SSE, AVX, NEON) and a solid tail across Power, MIPS, SPARC, and RISC-V. |
| 81 | socket-address-family (os) | keep | 4 | 4 | 4 | 48 |  | Crisp AF_ constant membership rule with obvious socket families and neat deep cuts like AF_ALG and AF_TIPC. |
| 82 | storage-engine (data) | keep | 4 | 4 | 4 | 45 |  | Distinct from general databases with strong obvious answers (InnoDB, RocksDB, LevelDB) and many real embedded engines. |
| 83 | string-similarity-measure (data) | keep | 4 | 4 | 4 | 30 |  | Clear, bounded category combining everyday edit distances with bioinformatics alignment scores. |
| 84 | terminal-emulator (languages) | keep | 4 | 4 | 4 | 55 |  | Fun, relatable category for developers with immediate obvious answers and a deep tail of Unix/GPU-accelerated terminals. |
| 85 | testing-technique (languages) | keep | 4 | 4 | 4 | 45 |  | Clear membership rule with obvious everyday answers and a strong academic and tooling deep tail. |
| 86 | combinatorial-optimization-heuristic (data) | keep | 4 | 4 | 3 | 50 |  | Strong mix of textbook metaheuristics like simulated annealing and genetic algorithms alongside classic domain heuristics like Kernighan-Lin. |
| 87 | computational-geometry-algorithm (data) | keep | 3 | 5 | 4 | 70 |  | Classic named algorithms from Graham scan and QuickHull to Bentley-Ottmann and Chazelle's triangulation. |
| 88 | css-framework (languages) | keep | 4 | 4 | 3 | 50 |  | Well-bounded set of named stylesheet libraries with strong front-end recognition and a long tail of micro-frameworks. |
| 89 | git-hosting-service (languages) | keep | 4 | 3 | 4 | 35 |  | Clear membership rule with immediate obvious answers (GitHub, GitLab, Bitbucket) and a solid tail of self-hosted and historical forges. |
| 90 | join-algorithm (data) | keep | 4 | 3 | 4 | 30 |  | Clear membership rule with immediate database-basics answers and a solid tail of worst-case-optimal and streaming join variants. |
| 91 | linux-boot-parameter (os) | keep | 3 | 5 | 4 | 500 |  | Clear kernel documentation membership with accessible basics and a huge sysadmin/kernel-hacker tail. |
| 92 | logging-library (languages) | keep | 4 | 4 | 3 | 65 |  | Clear membership rule across all language ecosystems with plenty of well-known and niche logging libraries. |
| 93 | orm (languages) | keep | 4 | 4 | 3 | 50 |  | Well-defined category with clear obvious answers across major web frameworks and a healthy cross-language tail. |
| 94 | static-site-generator (languages) | keep | 4 | 4 | 3 | 55 |  | Clear membership rule with plenty of well-known tools and a long tail of language-specific generators. |
| 95 | supercomputer-pre-2000 (hardware) | keep | 3 | 5 | 4 | 90 | yes | Well-bounded historical category with iconic Cray and Connection Machine entries and a rich supercomputing tail. |
| 96 | template-engine (languages) | keep | 4 | 4 | 3 | 50 |  | Good cross-language category with obvious web templating hits and a solid historical tail. |
| 97 | bug-tracker (languages) | keep | 4 | 3 | 3 | 45 | yes | Good obvious picks and historical self-hosted deep cuts, well-suited to an occasional wildcard slot. |
| 98 | collision-detection-algorithm (data) | keep | 3 | 4 | 4 | 35 |  | Well-bounded set of named geometric intersection algorithms from SAT and GJK to Lin-Canny and V-Clip. |
| 99 | concurrency-control-protocol (data) | keep | 3 | 4 | 4 | 40 |  | Solid database systems category bridging 2PL and MVCC with modern research protocols like Silo and Calvin. |
| 100 | conflict-free-replicated-data-type (data) | keep | 3 | 4 | 4 | 40 |  | Well-defined distributed systems niche with obvious counters/sets and named sequence CRDTs like Logoot and YATA. |
| 101 | documentation-generator (languages) | keep | 4 | 3 | 3 | 40 |  | Clear membership rule with solid ecosystem coverage across Java, Python, C++, Rust, and Haskell. |
| 102 | fuzzer (hardware) | keep | 3 | 4 | 4 | 40 |  | Well-scoped security/testing tool category with obvious fuzzers (AFL, libFuzzer) and a rich tail of kernel, grammar, and property fuzzers. |
| 103 | javascript-engine (languages) | keep | 3 | 4 | 4 | 32 |  | Well-bounded category with 3-4 obvious browser engines and a surprisingly deep tail of embedded and historical JS runtimes. |
| 104 | linux-kernel-config-option (os) | keep | 3 | 5 | 3 | 15000 |  | Clear Kconfig membership rule with recognizable core options and an enormous deep tail of subsystem flags. |
| 105 | linux-kernel-thread (os) | keep | 3 | 4 | 4 | 100 |  | Well-bounded set of named kernel threads visible in ps output with good depth from kswapd to oom_reaper. |
| 106 | linux-perf-event (os) | keep | 3 | 5 | 3 | 500 |  | Clear perf list membership rule with obvious hardware/software events and a huge tail of PMU and tracepoint events. |
| 107 | memory-consistency-model (os) | keep | 3 | 4 | 4 | 35 |  | Strong systems/distributed-systems category with clear named models from sequential consistency to RCpc and PRAM. |
| 108 | multiplication-algorithm (data) | keep | 3 | 4 | 4 | 30 |  | Great mix of classic algorithms (Karatsuba, Strassen) and deep-cut asymptotic and hardware multiplication methods. |
| 109 | parser-generator (languages) | keep | 3 | 4 | 4 | 45 |  | Classic CS/tools category with yacc/bison/ANTLR up front and a deep tail of modern and academic parser generators. |
| 110 | quantum-algorithm (data) | keep | 3 | 4 | 4 | 35 | yes | Clear membership with famous headline algorithms (Shor, Grover) and a solid literature tail, fitting a wildcard slot. |
| 111 | state-management-library (languages) | keep | 4 | 3 | 3 | 35 |  | Good front-end focused category with obvious hits (Redux, MobX, Zustand) and a decent tail of newer/niche libraries. |
| 112 | win32-api-function (hardware) | keep | 3 | 5 | 3 | 2000 |  | Massive well-defined namespace of named system functions, though slightly dry and skewed toward Windows developers. |
| 113 | arm-core (hardware) | keep | 3 | 4 | 3 | 65 |  | Well-defined set of named ARM core designs spanning Cortex, classic ARM, StrongARM, and Neoverse. |
| 114 | benchmarking-tool (languages) | keep | 3 | 4 | 3 | 50 |  | Cleanly distinct from computing benchmarks with a healthy set of CLI, load-testing, and microbenchmarking tools. |
| 115 | column-encoding-scheme (data) | keep | 3 | 4 | 3 | 35 |  | Cleanly scoped to column-store encodings with obvious hits like RLE and dictionary encoding plus modern papers like FSST and ALP. |
| 116 | computing-benchmark (hardware) | keep | 3 | 4 | 3 | 50 |  | Clear category of named benchmark suites spanning classic synthetic tests, HPC, and modern consumer/ML benchmarks. |
| 117 | cpu-socket (hardware) | keep | 3 | 4 | 3 | 65 |  | Well-defined hardware standard list with familiar modern sockets (AM4, LGA 1700) and decades of legacy sockets and slots. |
| 118 | cryptographic-hardness-assumption (data) | keep | 3 | 4 | 3 | 45 |  | Clear formal category with familiar roots like discrete log and LWE and a rigorous literature tail. |
| 119 | disassembler (hardware) | keep | 3 | 3 | 4 | 40 |  | Focused reverse-engineering toolset with obvious picks (IDA, Ghidra, objdump) and bytecode/academic decompilers. |
| 120 | elliptic-curve (hardware) | keep | 3 | 4 | 3 | 45 |  | Exact, unambiguous mathematical/cryptographic names (secp256k1, Curve25519, P-256) with a strong standardized and pairing-friendly tail. |
| 121 | ieee-802-standard (os) | keep | 3 | 4 | 3 | 80 |  | Well-bounded standard series with recognizable networking numbers and a deep amendment tail. |
| 122 | interconnect-topology (hardware) | keep | 3 | 4 | 3 | 35 |  | Cleanly defined set of named network/NoC topologies with decent depth from mesh and torus to fat-tree, Clos, and Kautz. |
| 123 | linux-capability (os) | keep | 3 | 3 | 4 | 41 |  | Exact finite set from capabilities(7) with recognizable container/admin flags and a neat deep tail. |
| 124 | numerical-quadrature-rule (data) | keep | 3 | 4 | 3 | 40 | yes | Clear mathematical membership with familiar calculus rules upfront and a rich tail of named quadrature methods. |
| 125 | ode-solver (data) | keep | 3 | 4 | 3 | 40 | yes | Well-defined numerical methods category with classic Euler/Runge-Kutta entries and many named adaptive and stiff solvers. |
| 126 | procedural-noise-function (data) | keep | 3 | 3 | 4 | 25 | yes | Compact but distinct graphics category with iconic obvious answers like Perlin and Worley noise. |
| 127 | profiler (languages) | keep | 3 | 4 | 3 | 45 |  | Distinct from linux-tracing-tool by covering cross-platform and language-level CPU/memory profilers. |
| 128 | refactoring (languages) | keep | 3 | 4 | 3 | 70 |  | Well-bounded by Fowler's catalogue and IDE refactoring menus, offering a large set of named transformations. |
| 129 | software-metric (languages) | keep | 3 | 4 | 3 | 40 |  | Clear membership rule with a few universal metrics and a solid tail from software engineering literature. |
| 130 | stream-processing-system (data) | keep | 3 | 4 | 3 | 35 |  | Clear systems category with well-known Apache frameworks and a strong research/industry tail. |
| 131 | floating-point-format (hardware) | keep | 3 | 3 | 3 | 30 |  | Compact but crisp set of named IEEE, ML (bfloat16, TF32), alternative (posit), and legacy vendor floating-point formats. |
| 132 | time-series-database (data) | keep | 3 | 3 | 3 | 35 |  | Well-bounded niche of databases with obvious modern picks like InfluxDB and Prometheus plus historical/internal systems. |
| 133 | approximate-nearest-neighbor-index (data) | keep | 2 | 4 | 3 | 45 |  | Clear membership rule with recognizable vector-search staples like HNSW and IVF plus a solid research tail. |
| 134 | distributed-hash-table (data) | keep | 2 | 4 | 3 | 35 |  | Narrower than consensus, but Chord and Kademlia are well-known and the P2P literature provides enough named overlays. |
| 135 | fft-algorithm (data) | keep | 2 | 4 | 3 | 30 |  | Cooley-Tukey is the obvious anchor and the DSP literature supplies a clean set of named variants like Bluestein's and Rader's. |
| 136 | mcmc-sampling-algorithm (data) | keep | 2 | 4 | 3 | 35 | yes | Strong domain-specific category with real named algorithms, though narrower obvious recall makes it better suited for a wildcard slot. |
| 137 | proof-system (data) | keep | 2 | 4 | 3 | 40 | yes | Rich modern cryptography literature with many named systems, best as a wildcard due to specialized obvious tier. |
| 138 | bluetooth-profile (hardware) | keep | 2 | 3 | 3 | 40 |  | Crisp specification-backed list of named profiles (A2DP, HID, HFP) with a decent tail of obscure SIG profiles. |
| 139 | dec-computer (hardware) | keep | 2 | 3 | 3 | 40 | yes | Clean historical hardware set with iconic PDP/VAX models and obscure workstations, suited for a wildcard slot. |
| 140 | texture-compression-format (data) | keep | 2 | 3 | 3 | 35 |  | Clear membership rule with recognizable GPU formats like DXT1/ASTC/ETC2 and a solid tail of vendor and transcodable formats. |
| 141 | dependency-injection-framework (languages) | keep | 2 | 3 | 2 | 35 | yes | Valid and bounded, though narrow enough that many developers only know one or two outside Java/C#. |
| 142 | acpi-table (hardware) | keep | 1 | 4 | 2 | 50 | yes | Exact four-character spec signatures give a crisp rule and deep tail, though low everyday familiarity makes it best as a wildcard. |
| 143 | erasure-code (os) | merge | 2 | 4 | 3 | 35 |  | → error-code. Substantially overlaps with the broader error-code draft, which already covers Reed-Solomon, LDPC, and parity schemes. |
| 144 | logic-gate (hardware) | cut | 5 | 2 | 3 | 20 |  | Most programmers only know the 7-8 basic Boolean gates, and the tail of reversible/quantum/async gates is too small. |
| 145 | key-derivation-function (hardware) | cut | 3 | 2 | 3 | 20 |  | Too few distinct named KDFs beyond PBKDF2, scrypt, Argon2, bcrypt, and HKDF to sustain a deep tail. |
| 146 | vim-plugin (languages) | cut | 2 | 5 | 2 | 2000 | yes | Unbounded open-ended GitHub ecosystem with no clear boundary and low accessibility for non-Vim users. |
| 147 | public-key-encryption-scheme (hardware) | cut | 3 | 2 | 2 | 20 |  | Narrower than expected once signatures and key exchange are excluded, leaving too few well-known named schemes. |
| 148 | linux-ioctl-request (os) | cut | 1 | 5 | 2 | 500 | yes | Too obscure for most developers, who rarely know exact ioctl macro names offhand. |
| 149 | nvme-command (os) | cut | 2 | 3 | 2 | 45 |  | Too niche and generic-sounding (Read, Write, Copy) outside storage-driver engineering. |
| 150 | query-optimization-technique (data) | cut | 2 | 3 | 2 | 25 |  | Answers are mostly descriptive phrases rather than crisp named entities and the membership boundary is blurry. |
| 151 | windows-kernel-object-type (os) | cut | 2 | 3 | 2 | 45 |  | Too niche for general programmers, as NT Object Manager type names are mostly known only to Windows internals specialists. |
| 152 | bgp-path-attribute (os) | cut | 1 | 3 | 2 | 40 | yes | Too niche for general developers, who will struggle to name even one or two BGP path attributes. |
| 153 | dhcp-option (os) | cut | 1 | 3 | 2 | 100 | yes | Too obscure by exact IANA option names, with very few obvious answers for typical developers. |
| 154 | eap-method (os) | cut | 1 | 3 | 2 | 60 | yes | Too specialized in network authentication protocols for general programmers to have obvious answers. |
| 155 | macho-load-command (os) | cut | 1 | 3 | 2 | 55 |  | Too niche for general developers, as few programmers outside Apple binary tooling can name LC_ constants. |
| 156 | tls-extension (os) | cut | 1 | 3 | 2 | 60 |  | Too niche when restricted to exact IANA snake_case ExtensionType names that few developers recall verbatim. |
| 157 | mesh-simplification-algorithm (data) | cut | 1 | 2 | 2 | 20 | yes | Too niche for general developers and has fewer than ~25 distinct named algorithms. |
| 158 | tpm2-command (hardware) | cut | 1 | 3 | 1 | 90 |  | Hyper-niche specification API names that almost no general developer can recall offhand. |
| 159 | uefi-protocol (hardware) | cut | 1 | 3 | 1 | 70 |  | Obscure firmware specification interface names with virtually zero obvious answers for ordinary programmers. |
