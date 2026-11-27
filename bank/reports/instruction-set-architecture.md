# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: instruction set, ISA, architecture.

## instruction-set-architecture

53 candidates; 23 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| ARM | 90 | 240 | 1062 | 1.00 | off-by-one | counts | off-by-one | — |
| x86 | 259 | 74 | 297 | 1.00 | off-by-one | counts | off-by-one | — |
| RISC-V | 33 | 373 | 515 | 0.99 | off-by-one | counts | off-by-one | — |
| ARC ⚠ counts said off-by-one | 9 | 69 | 195 | 0.89 | race | judge (override) | race | — |
| MIPS | 24 | 39 | 90 | 0.83 | npe | counts | off-by-one | — |
| SPARC | 16 | 37 | 29 | 0.73 | npe | counts | npe | — |
| eBPF | 20 | 12 | 48 | 0.68 | npe | counts | leak | — |
| PowerPC | 38 | 20 | 8 | 0.64 | npe | counts | off-by-one | — |
| Qualcomm Hexagon ⚠ counts said npe | 2 | 23 | 34 | 0.60 | race | judge (override) | race | — |
| AArch64 ⚠ counts said leak | 12 | 2 | 30 | 0.48 | off-by-one | judge (override) | off-by-one | — |
| IA-64 | 6 | 28 | 1 | 0.47 | womm | pin | — | — |
| Xtensa | 5 | 7 | 8 | 0.44 | leak | judge | leak | — |
| Adapteva Epiphany ⚠ counts said leak | 0 | 11 | 13 | 0.42 | heisenbug | judge (override) | heisenbug | — |
| MicroBlaze | 2 | 5 | 5 | 0.35 | leak | judge | leak | — |
| PTX | 1 | 2 | 19 | 0.35 | leak | counts | leak | — |
| OpenRISC | 8 | 2 | 5 | 0.35 | race | judge | race | — |
| VAX ⚠ counts said race | 1 | 11 | 1 | 0.32 | npe | judge (override) | npe | — |
| AVR ⚠ counts said race | 0 | 2 | 13 | 0.29 | npe | judge (override) | npe | — |
| MSP430 | 0 | 2 | 10 | 0.27 | race | counts | leak | — |
| CRIS | 0 | 2 | 10 | 0.27 | race | counts | heisenbug | — |
| LoongArch | 20 | 2 | 0 | 0.27 | race | counts | race | — |
| NEC Vector Engine | 0 | 3 | 6 | 0.27 | heisenbug | judge | heisenbug | — |
| PA-RISC | 4 | 3 | 0 | 0.22 | leak | judge | leak | — |
| Infineon TriCore | 0 | 4 | 1 | 0.20 | race | judge | race | — |
| PDP-11 | 0 | 4 | 0 | 0.15 | npe | judge | npe | — |
| Blackfin | 1 | 2 | 0 | 0.14 | race | judge | race | — |
| Visium | 0 | 0 | 6 | 0.14 | heisenbug | judge | heisenbug | — |
| AMD GCN | 4 | 0 | 1 | 0.14 | leak | judge | leak | — |
| z/Architecture | 2 | 1 | 0 | 0.12 | leak | judge | leak | — |
| SuperH | 2 | 1 | 0 | 0.12 | leak | judge | leak | — |
| Motorola 68000 | 1 | 1 | 0 | 0.10 | npe | judge | npe | — |
| TI C6000 | 0 | 2 | 0 | 0.10 | heisenbug | judge | heisenbug | — |
| Motorola M·CORE | 0 | 0 | 2 | 0.08 | heisenbug | judge | heisenbug | — |
| XMOS XCore | 0 | 0 | 1 | 0.05 | heisenbug | judge | heisenbug | — |
| DEC Alpha | 1 | 0 | 0 | 0.04 | npe | judge | npe | — |
| C-SKY ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Lanai ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Fujitsu FR30 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Fujitsu FR-V ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FT32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Hitachi H8 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Vitesse IQ2000 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| LatticeMico32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Mitsubishi M32R ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MMIX | 0 | 0 | 0 | 0.00 | bitflip | pin | — | — |
| Matsushita MN10300 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Moxie ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Andes NDS32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TI PRU ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Renesas RL78 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Renesas RX ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Sanyo Xstormy16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NEC V850 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): AArch64 (counts said leak, now off-by-one), ARC (counts said off-by-one, now race), AVR (counts said race, now npe), Qualcomm Hexagon (counts said npe, now race), Adapteva Epiphany (counts said leak, now heisenbug), VAX (counts said race, now npe)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

20/20 sampled answers are members (100%); 20/20 also have an acceptable tier. Not members: none.
