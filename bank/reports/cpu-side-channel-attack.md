# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: side-channel, side channel, speculative.

## cpu-side-channel-attack

50 candidates; 16 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| Spectre | 32 | 38 | 107 | 1.00 | off-by-one | counts | off-by-one | — |
| Meltdown | 2 | 6 | 32 | 0.94 | off-by-one | counts | npe | — |
| Flush+Reload | 0 | 6 | 17 | 0.80 | npe | counts | leak | — |
| Prime+Probe | 0 | 5 | 16 | 0.76 | npe | counts | leak | — |
| Special Register Buffer Data Sampling | 0 | 5 | 5 | 0.62 | race | judge | race | — |
| L1 Terminal Fault | 1 | 4 | 3 | 0.61 | womm | pin | — | — |
| Gather Data Sampling | 2 | 1 | 5 | 0.53 | leak | judge | leak | — |
| Spectre v1 | 1 | 0 | 11 | 0.43 | leak | counts | leak | — |
| Speculative Return Stack Overflow | 4 | 0 | 4 | 0.42 | race | judge | race | — |
| Spectre-PHT | 0 | 1 | 5 | 0.39 | heisenbug | judge | heisenbug | — |
| Hertzbleed | 0 | 2 | 2 | 0.38 | race | judge | race | — |
| Retbleed | 4 | 1 | 0 | 0.34 | race | judge | race | — |
| SMoTherSpectre | 0 | 2 | 1 | 0.32 | heisenbug | judge | heisenbug | — |
| ret2spec | 0 | 2 | 1 | 0.32 | heisenbug | judge | heisenbug | — |
| Flush+Flush | 0 | 1 | 2 | 0.29 | race | judge | race | — |
| PLATYPUS | 0 | 1 | 1 | 0.24 | race | judge | race | — |
| Microarchitectural Data Sampling | 2 | 0 | 1 | 0.23 | leak | judge | leak | — |
| PACMAN | 0 | 2 | 0 | 0.23 | race | judge | race | — |
| Evict+Reload | 0 | 0 | 3 | 0.19 | race | judge | race | — |
| SpectreRSB | 1 | 0 | 1 | 0.18 | race | judge | race | — |
| Spectre v2 | 3 | 0 | 0 | 0.17 | leak | judge | leak | — |
| Spectre v4 | 0 | 0 | 2 | 0.15 | race | judge | race | — |
| BranchScope | 0 | 1 | 0 | 0.14 | race | judge | race | — |
| Collide+Power | 0 | 1 | 0 | 0.14 | bitflip | pin | — | — |
| TSX Async Abort | 2 | 0 | 0 | 0.14 | race | judge | race | — |
| ZombieLoad | 0 | 0 | 1 | 0.10 | leak | judge | leak | — |
| Fallout | 0 | 0 | 1 | 0.10 | race | judge | race | — |
| Load Value Injection | 0 | 0 | 1 | 0.10 | race | judge | race | — |
| Branch History Injection | 0 | 0 | 1 | 0.10 | race | judge | race | — |
| PortSmash | 0 | 0 | 1 | 0.10 | race | judge | race | — |
| MeltdownPrime | 0 | 0 | 1 | 0.10 | heisenbug | judge | heisenbug | — |
| SpectrePrime | 0 | 0 | 1 | 0.10 | heisenbug | judge | heisenbug | — |
| VMSCAPE | 1 | 0 | 0 | 0.09 | heisenbug | judge | heisenbug | — |
| TLBleed | 1 | 0 | 0 | 0.09 | race | judge | race | — |
| Processor MMIO Stale Data ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Register File Data Sampling ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Indirect Target Selection ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| RIDL ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CacheOut ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| SGAxe ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Evict+Time ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Zenbleed ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Augury ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| GoFetch ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| NetSpectre ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| SWAPGS attack ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Branch Privilege Injection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Training Solo ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Phantom ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Prime+Abort ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): none

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

