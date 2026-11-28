# Scoring: x86-instruction (Name an x86 instruction)

1492 answers (Bit Flip and Works on my machine left out); 4 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 6 (0%) | 6 | 0 |
| npe | 33 (2%) | 33 | 0 |
| leak | 2 (0%) | 2 | 0 |
| race | 2 (0%) | 2 | 0 |
| heisenbug | 1449 (97%) | 1449 | 0 |

Same tier as today: 1492/1492 (100%).

## Off-by-one (6)

sub 6.0* [0c 0q 0f 0s], not 5.0* [0c 25q 0f 0s], mov 5.0 [0c 0q 0f 0s], add 5.0 [0c 0q 0f 0s], xor 4.5 [0c 172q 0f 0s], PUSH 4.4 [0c 0q 1f 0s]

## Null pointer exception (33)

jmp 4.2 [806c 0q 8f 0s], and 4.1 [0c 320q 0f 0s], NOP 4.0 [3255c 120q 1f 0s], inc 3.9 [0c 0q 0f 0s], call 3.8 [0c 0q 0f 0s], cmp 3.8 [0c 0q 0f 0s], ret 3.8 [0c 0q 0f 0s], or 3.8 [0c 152q 0f 0s], POP 3.4 [0c 0q 0f 0s], test 3.4 [0c 0q 1f 0s], dec 3.3 [0c 0q 0f 0s], shl 3.1 [0c 0q 0f 0s], SYSCALL 3.1 [3250c 3764q 1f 0s], mul 3.1 [0c 0q 0f 0s], je 3.0 [0c 0q 0f 0s], jne 3.0 [0c 0q 0f 0s], INT 3.0 [0c 0q 0f 0s], shr 2.8 [0c 0q 0f 0s], lea 2.6 [0c 0q 0f 0s], MOVQ 2.6 [0c 0q 0f 0s], div 2.6 [0c 0q 0f 0s], xchg 2.6 [0c 0q 3f 0s], neg 2.6 [0c 0q 0f 0s], cpuid 2.4 [2655c 165q 0f 0s], imul 2.4 [0c 0q 0f 0s], INT03 2.4 [0c 0q 0f 0s], leave 2.3 [0c 0q 3f 0s], CLI 2.3 [0c 0q 0f 0s], INT3 2.2 [0c 0q 0f 0s], POPP 2.1 [0c 0q 0f 0s], cmpxchg 2.1 [2612c 0q 0f 0s], MOVD 2.1 [0c 0q 0f 0s], hlt 2.0 [426c 0q 0f 0s]

## Memory leak (2)

rdtsc 1.9 [914c 143q 0f 0s], PREFETCH 1.4 [0c 550q 0f 0s]

## Race condition (2)

SYSENTER 1.7 [0c 10q 0f 0s], CLFLUSH 0.8 [0c 11q 0f 0s]

## Heisenbug (1449)

STI 2.0 [0c 0q 0f 0s], idiv 2.0 [0c 0q 0f 0s], STD 1.9 [0c 0q 0f 0s], POPCNT 1.9 [996c 0q 0f 0s], MOVSD 1.8 [0c 0q 0f 0s], CLD 1.8 [0c 0q 0f 0s], PAND 1.7 [0c 0q 0f 0s], MOVSS 1.7 [0c 0q 0f 0s], CLC 1.6 [0c 0q 0f 0s], STC 1.6 [0c 0q 0f 0s], TESTUI 1.5 [0c 0q 0f 0s], ADDSD 1.4 [0c 0q 0f 0s], PXOR 1.4 [0c 0q 0f 0s], FADD 1.4 [0c 0q 0f 0s], VMOVQ 1.4 [0c 0q 0f 0s], MOVAPS 1.3 [0c 0q 0f 0s], MOVDQA 1.3 [0c 0q 0f 0s], MOVDQU 1.3 [0c 0q 0f 0s], SYSRET 1.3 [0c 0q 0f 0s], SYSEXIT 1.3 [0c 0q 0f 0s], VPXOR 1.3 [0c 0q 0f 0s], ADDPS 1.3 [0c 0q 0f 0s], MOVUPS 1.2 [0c 0q 0f 0s], MULSS 1.2 [0c 0q 0f 0s], FLD 1.2 [0c 0q 0f 0s], MULSD 1.2 [0c 0q 0f 0s], POR 1.2 [0c 0q 0f 0s], RDMSR 1.2 [0c 0q 0f 0s], SQRTPS 1.2 [0c 0q 0f 0s], INTO 1.2 [0c 0q 0f 0s], XORPD 1.2 [0c 0q 0f 0s], XORPS 1.2 [0c 0q 0f 0s], LFENCE 1.2 [0c 0q 0f 0s], UIRET 1.1 [0c 0q 0f 0s], ADDPD 1.1 [0c 0q 0f 0s], MAXSD 1.1 [0c 0q 0f 0s], VMULSS 1.1 [0c 0q 0f 0s], CMPSD 1.1 [0c 0q 0f 0s], FSUB 1.1 [0c 0q 0f 0s], MOVAPD 1.1 [0c 0q 0f 0s], FMUL 1.1 [0c 0q 0f 0s], VMOVSD 1.1 [0c 0q 0f 0s], VMOVAPS 1.1 [0c 0q 0f 0s], VMOVDQA 1.1 [0c 0q 0f 0s], MOVUPD 1.1 [0c 0q 0f 0s], STUI 1.1 [0c 0q 17f 0s], LAHF 1.1 [0c 0q 0f 0s], PCONFIG 1.0 [0c 0q 0f 0s], VADDSD 1.0 [0c 0q 0f 0s], VMOVSS 1.0 [0c 0q 0f 0s], WRMSR 1.0 [0c 0q 0f 0s], VADDPS 1.0 [0c 0q 0f 0s], DIVSD 1.0 [0c 0q 0f 0s], DIVSS 1.0 [0c 0q 0f 0s], MFENCE 1.0 [0c 0q 0f 0s], VMULPS 1.0 [0c 0q 0f 0s], VMULSD 1.0 [0c 0q 0f 0s], SQRTPD 1.0 [0c 0q 0f 0s], FIST 1.0 [0c 0q 2f 0s], MINSD 1.0 [0c 0q 0f 0s] ...

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
