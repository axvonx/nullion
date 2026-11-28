# Scoring: cpu-side-channel-attack (Name a CPU side-channel attack)

57 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 3 (5%) | 3 | 0 |
| npe | 7 (12%) | 7 | 0 |
| leak | 2 (4%) | 2 | 0 |
| race | 1 (2%) | 1 | 0 |
| heisenbug | 44 (77%) | 44 | 0 |

Same tier as today: 57/57 (100%).

## Off-by-one (3)

Spectre 5.0 [0c 79q 1f 0s], Spectre-PHT 5.0* [0c 0q 0f 0s], Meltdown 4.8 [4326c 19q 0f 0s]

## Null pointer exception (7)

Spectre v1 4.3 [0c 0q 0f 0s], Spectre v2 3.9 [0c 0q 0f 0s], Timing attack 3.8 [2144c 34q 0f 0s], Rowhammer 2.4 [2848c 0q 0f 0s], Flush+Reload 2.3 [0c 0q 0f 0s], ZombieLoad 2.1 [0c 0q 0f 0s], Power analysis 2.0 [632c 31q 0f 0s]

## Memory leak (2)

PACMAN 1.2 [0c 736q 0f 0s], Special Register Buffer Data Sampling 0.7 [0c 97q 0f 0s]

## Race condition (1)

Speculative Return Stack Overflow 0.6 [0c 0q 4f 1605s]

## Heisenbug (44)

Retbleed 1.9 [327c 0q 0f 0s], Evict+Reload 1.8 [0c 0q 0f 0s], Evict+Time 1.7 [0c 0q 0f 0s], Prime+Probe 1.6 [0c 0q 0f 0s], Branch target injection 1.6 [0c 0q 0f 0s], Bounds check bypass 1.6 [0c 0q 0f 0s], Microarchitectural Data Sampling 1.5 [0c 0q 0f 0s], Electromagnetic attack 1.4 [184c 0q 4f 0s], NetSpectre 1.4 [0c 0q 0f 0s], ret2spec 1.4 [0c 0q 0f 0s], Spectre v4 1.3 [0c 0q 0f 0s], Acoustic cryptanalysis 1.3 [325c 0q 0f 0s], SGAxe 1.2 [0c 0q 0f 0s], RIDL 1.2 [0c 0q 2f 0s], Zenbleed 1.2 [0c 0q 0f 0s], TSX Async Abort 1.2 [0c 0q 0f 0s], TLBleed 1.2 [0c 0q 0f 0s], GhostRace 1.1 [0c 0q 0f 0s], MeltdownPrime 1.1 [0c 0q 0f 0s], SpectreRSB 1.0 [0c 0q 0f 0s], SMoTherSpectre 1.0 [0c 0q 0f 0s], Flush+Flush 1.0 [0c 0q 0f 0s], Hertzbleed 1.0 [115c 0q 0f 0s], CacheOut 0.9 [0c 0q 0f 0s], Branch History Injection 0.9 [0c 0q 0f 0s], Load Value Injection 0.9 [0c 0q 0f 0s], SpectrePrime 0.9 [0c 0q 0f 0s], Plundervolt 0.9 [0c 0q 0f 0s], GoFetch 0.9 [0c 0q 1f 0s], Indirect Target Selection 0.8 [0c 0q 0f 0s], BranchScope 0.8 [0c 0q 0f 0s], Gather Data Sampling 0.8 [301c 0q 0f 0s], PortSmash 0.8 [0c 0q 0f 0s], Fallout 0.7 [0c 0q 1f 0s], Processor MMIO Stale Data 0.7 [0c 0q 0f 0s], Phantom 0.6 [0c 0q 2f 0s], SWAPGS attack 0.6 [0c 0q 0f 0s], Prime+Abort 0.6 [0c 0q 0f 0s], VMSCAPE 0.5 [0c 0q 0f 0s], Branch Privilege Injection 0.5 [0c 0q 0f 0s], Register File Data Sampling 0.5 [0c 0q 6f 0s], PLATYPUS 0.5 [0c 0q 4f 0s], Training Solo 0.3 [0c 0q 0f 0s], Augury 0.3 [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
