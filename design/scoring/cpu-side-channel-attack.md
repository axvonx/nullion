# Scoring: cpu-side-channel-attack (Name a CPU side-channel attack)

57 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 3 (5%) | 3 | 0 |
| npe | 7 (12%) | 7 | 0 |
| leak | 4 (7%) | 2 | 0 |
| race | 3 (5%) | 5 | 0 |
| heisenbug | 40 (70%) | 40 | 0 |

Same tier as today: 55/57 (96%).

## Off-by-one (3)

Spectre 5.0 [6079c 79q 1f], Spectre-PHT 5.0* [6079c 0q 0f], Meltdown 4.8 [4326c 19q 0f]

## Null pointer exception (7)

Spectre v1 4.3 [6079c 0q 0f], Spectre v2 3.9 [6079c 0q 0f], Timing attack 3.8 [2144c 34q 0f], Rowhammer 2.4 [2848c 0q 0f], Flush+Reload 2.3 [0c 0q 0f], ZombieLoad 2.1 [150c 0q 0f], Power analysis 2.0 [632c 5376q 0f]

## Memory leak (4)

Microarchitectural Data Sampling 1.5 [150c 114q 0f], PACMAN 1.2 [0c 736q 0f], Special Register Buffer Data Sampling 0.7 [0c 97q 0f], PLATYPUS 0.5 [0c 84q 4f]

## Race condition (3)

Branch target injection 1.6 [6079c 0q 6f], Bounds check bypass 1.6 [6079c 0q 0f], Spectre v4 1.3 [6079c 0q 2f]

## Heisenbug (40)

Retbleed 1.9 [327c 0q 0f], Evict+Reload 1.8 [0c 0q 0f], Evict+Time 1.7 [0c 0q 0f], Prime+Probe 1.6 [0c 0q 0f], Electromagnetic attack 1.4 [184c 0q 4f], NetSpectre 1.4 [0c 0q 0f], ret2spec 1.4 [0c 0q 0f], Acoustic cryptanalysis 1.3 [325c 0q 0f], SGAxe 1.2 [0c 0q 0f], RIDL 1.2 [150c 0q 2f], Zenbleed 1.2 [0c 0q 0f], TSX Async Abort 1.2 [0c 0q 0f], TLBleed 1.2 [0c 0q 0f], GhostRace 1.1 [0c 0q 0f], MeltdownPrime 1.1 [0c 0q 0f], SpectreRSB 1.0 [0c 0q 0f], SMoTherSpectre 1.0 [0c 0q 0f], Flush+Flush 1.0 [0c 0q 0f], Hertzbleed 1.0 [115c 0q 0f], CacheOut 0.9 [0c 0q 0f], Branch History Injection 0.9 [0c 0q 0f], Load Value Injection 0.9 [0c 0q 0f], SpectrePrime 0.9 [0c 0q 0f], Plundervolt 0.9 [0c 0q 0f], GoFetch 0.9 [0c 0q 1f], Indirect Target Selection 0.8 [0c 1q 1f], BranchScope 0.8 [0c 0q 0f], Gather Data Sampling 0.8 [0c 0q 1f], PortSmash 0.8 [0c 0q 0f], Fallout 0.7 [150c 0q 1f], Processor MMIO Stale Data 0.7 [0c 0q 0f], Phantom 0.6 [0c 0q 2f], Speculative Return Stack Overflow 0.6 [0c 0q 4f], SWAPGS attack 0.6 [0c 0q 0f], Prime+Abort 0.6 [0c 0q 0f], VMSCAPE 0.5 [0c 0q 0f], Branch Privilege Injection 0.5 [0c 0q 0f], Register File Data Sampling 0.5 [0c 0q 6f], Training Solo 0.3 [0c 0q 0f], Augury 0.3 [0c 6q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
