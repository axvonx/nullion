# Scoring: instruction-set-architecture (Name an instruction set architecture)

59 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (3%) | 2 | 0 |
| npe | 11 (19%) | 11 | 0 |
| leak | 9 (15%) | 9 | 0 |
| race | 11 (19%) | 11 | 0 |
| heisenbug | 26 (44%) | 26 | 0 |

Same tier as today: 59/59 (100%).

## Off-by-one (2)

x86 5.3 [17851c 20198q 1f 0s], ARM 5.0 [32752c 604q 0f 0s]

## Null pointer exception (11)

JVM bytecode 4.0* [0c 191q 0f 0s], 8086 3.6 [8091c 2988q 0f 0s], MIPS 3.4 [8758c 5965q 0f 0s], AArch64 3.3 [10091c 2079q 0f 0s], RISC-V 3.1 [16803c 1345q 0f 0s], Motorola 68000 3.0 [2462c 240q 0f 0s], PowerPC 3.0 [9793c 829q 1f 0s], WebAssembly 2.8 [13597c 2947q 1f 0s], 6502 2.6 [10335c 240q 0f 0s], Z80 2.5 [11426c 0q 0f 0s], System/360 2.0 [476c 0q 0f 0s]

## Memory leak (9)

AVR 1.9 [3364c 844q 0f 0s], SPARC 1.9 [4148c 368q 0f 0s], PDP-11 1.8 [1065c 35q 0f 0s], 8051 1.7 [0c 486q 0f 0s], eBPF 1.6 [5296c 761q 0f 0s], AMD GCN 1.3 [4345c 284q 0f 0s], MSP430 1.1 [1043c 646q 1f 0s], Xtensa 1.0 [1698c 35q 0f 0s], MicroBlaze 0.9 [533c 103q 0f 0s]

## Race condition (11)

VAX 1.9 [4168c 0q 0f 0s], PIC 1.8 [2558c 0q 0f 0s], DEC Alpha 1.8 [3015c 0q 1f 0s], z/Architecture 1.2 [1696c 24q 0f 0s], Qualcomm Hexagon 1.0 [1713c 0q 0f 0s], Renesas RX 0.8 [0c 19q 0f 0s], SuperH 0.8 [3062c 3q 0f 0s], Renesas RL78 0.6 [135c 11q 0f 0s], Lanai 0.6 [2837c 0q 0f 0s], XMOS XCore 0.4 [468c 16q 0f 0s], Adapteva Epiphany 0.3 [0c 29q 0f 0s]

## Heisenbug (26)

ARC 1.4 [785c 0q 0f 0s], CRIS 1.1 [64c 0q 0f 0s], PTX 0.9 [382c 0q 0f 0s], PA-RISC 0.9 [1053c 5q 0f 0s], TI C6000 0.8 [0c 0q 0f 0s], LoongArch 0.7 [0c 0q 0f 0s], Infineon TriCore 0.7 [351c 9q 0f 0s], OpenRISC 0.7 [511c 0q 0f 0s], FT32 0.6 [0c 0q 0f 0s], Andes NDS32 0.6 [0c 0q 0f 0s], Motorola M·CORE 0.6 [0c 0q 0f 0s], C-SKY 0.6 [64c 0q 0f 0s], TI PRU 0.6 [0c 0q 0f 0s], NEC V850 0.6 [571c 0q 0f 0s], Blackfin 0.6 [536c 0q 0f 0s], Moxie 0.5 [0c 0q 0f 0s], LatticeMico32 0.4 [132c 0q 0f 0s], Hitachi H8 0.4 [0c 0q 0f 0s], Mitsubishi M32R 0.4 [26c 0q 0f 0s], Visium 0.3 [0c 0q 0f 0s], NEC Vector Engine 0.3 [481c 0q 0f 0s], Vitesse IQ2000 0.2 [0c 0q 0f 0s], Fujitsu FR-V 0.2 [131c 0q 0f 0s], Fujitsu FR30 0.2 [0c 0q 0f 0s], Matsushita MN10300 0.1 [138c 0q 0f 0s], Sanyo Xstormy16 0.1 [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
