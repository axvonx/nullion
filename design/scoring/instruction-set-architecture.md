# Scoring: instruction-set-architecture (Name an instruction set architecture)

59 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (3%) | 2 | 0 |
| npe | 11 (19%) | 11 | 0 |
| leak | 12 (20%) | 12 | 0 |
| race | 7 (12%) | 2 | 0 |
| heisenbug | 27 (46%) | 32 | 0 |

Same tier as today: 54/59 (92%).

## Off-by-one (2)

x86 5.3 [17851c 20198q 1f], ARM 5.0 [32752c 13313q 0f]

## Null pointer exception (11)

JVM bytecode 4.0* [0c 12417q 0f], 8086 3.6 [8091c 2988q 0f], MIPS 3.4 [8758c 5965q 0f], AArch64 3.3 [10091c 2079q 0f], RISC-V 3.1 [16803c 1345q 0f], Motorola 68000 3.0 [2462c 240q 0f], PowerPC 3.0 [9793c 2881q 1f], WebAssembly 2.8 [13597c 2947q 1f], 6502 2.6 [10335c 240q 0f], Z80 2.5 [11426c 190q 0f], System/360 2.0 [476c 0q 0f]

## Memory leak (12)

AVR 1.9 [3364c 2351q 1f], SPARC 1.9 [4148c 368q 0f], PIC 1.8 [2558c 1647q 0f], DEC Alpha 1.8 [3015c 1803q 1f], 8051 1.7 [0c 486q 0f], eBPF 1.6 [5296c 761q 0f], ARC 1.4 [785c 3824q 0f], AMD GCN 1.3 [4345c 284q 0f], MSP430 1.1 [1043c 646q 1f], PTX 0.9 [382c 169q 1f], MicroBlaze 0.9 [533c 103q 0f], SuperH 0.8 [3062c 21092q 2f]

## Race condition (7)

VAX 1.9 [4168c 30q 0f], PDP-11 1.8 [1065c 35q 0f], z/Architecture 1.2 [1696c 24q 0f], Xtensa 1.0 [1698c 35q 0f], LoongArch 0.7 [3182c 0q 0f], Blackfin 0.6 [536c 21q 0f], Adapteva Epiphany 0.3 [0c 29q 0f]

## Heisenbug (27)

CRIS 1.1 [64c 0q 0f], Qualcomm Hexagon 1.0 [1713c 0q 0f], PA-RISC 0.9 [1053c 5q 0f], Renesas RX 0.8 [0c 19q 0f], TI C6000 0.8 [1265c 0q 0f], Infineon TriCore 0.7 [351c 9q 0f], OpenRISC 0.7 [511c 0q 0f], Renesas RL78 0.6 [135c 11q 0f], FT32 0.6 [0c 0q 0f], Andes NDS32 0.6 [0c 0q 0f], Motorola M·CORE 0.6 [0c 0q 0f], C-SKY 0.6 [0c 0q 0f], TI PRU 0.6 [0c 0q 1f], NEC V850 0.6 [571c 0q 0f], Lanai 0.6 [0c 0q 0f], Moxie 0.5 [0c 0q 0f], LatticeMico32 0.4 [132c 0q 0f], Hitachi H8 0.4 [0c 0q 0f], XMOS XCore 0.4 [468c 16q 0f], Mitsubishi M32R 0.4 [26c 0q 0f], Visium 0.3 [0c 0q 0f], NEC Vector Engine 0.3 [481c 0q 0f], Vitesse IQ2000 0.2 [0c 0q 0f], Fujitsu FR-V 0.2 [131c 0q 1f], Fujitsu FR30 0.2 [0c 0q 0f], Matsushita MN10300 0.1 [138c 0q 0f], Sanyo Xstormy16 0.1 [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
