# Scoring: x86-instruction (Name an x86 instruction)

1492 answers (Bit Flip and Works on my machine left out); 4 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 6 (0%) | 6 | 0 |
| npe | 33 (2%) | 33 | 0 |
| leak | 5 (0%) | 6 | 0 |
| race | 2 (0%) | 2 | 0 |
| heisenbug | 1446 (97%) | 1445 | 0 |

Same tier as today: 1487/1492 (100%).

## Off-by-one (6)

sub 6.0* [0c 0q 1f], not 5.0* [13739c 25q 0f], mov 5.0 [0c 485q 0f], add 5.0 [0c 0q 6f], xor 4.5 [13739c 1636q 1f], PUSH 4.4 [0c 5511q 1f]

## Null pointer exception (33)

jmp 4.2 [806c 0q 8f], and 4.1 [13739c 320q 4f], NOP 4.0 [3255c 120q 1f], inc 3.9 [0c 0q 0f], call 3.8 [0c 0q 0f], cmp 3.8 [0c 156q 4f], or 3.8 [13739c 152q 0f], ret 3.8 [0c 0q 0f], POP 3.4 [0c 0q 0f], test 3.4 [0c 0q 1f], dec 3.3 [0c 0q 1f], shl 3.1 [13739c 0q 0f], SYSCALL 3.1 [3250c 3764q 1f], mul 3.1 [0c 0q 0f], je 3.0 [0c 0q 3f], jne 3.0 [0c 0q 0f], INT 3.0 [2679c 13595q 0f], shr 2.8 [13739c 2q 1f], lea 2.6 [0c 0q 0f], MOVQ 2.6 [0c 0q 0f], div 2.6 [0c 0q 0f], xchg 2.6 [0c 0q 3f], neg 2.6 [0c 0q 0f], cpuid 2.4 [2655c 165q 0f], imul 2.4 [0c 0q 0f], INT03 2.4 [0c 0q 0f], leave 2.3 [0c 0q 3f], CLI 2.3 [0c 30776q 0f], INT3 2.2 [2679c 0q 0f], POPP 2.1 [0c 0q 0f], cmpxchg 2.1 [2612c 0q 0f], MOVD 2.1 [0c 0q 0f], hlt 2.0 [426c 0q 0f]

## Memory leak (5)

STI 2.0 [0c 384q 0f], rdtsc 1.9 [914c 143q 0f], STD 1.9 [0c 6049q 0f], PREFETCH 1.4 [0c 550q 0f], SERIALIZE 0.6 [0c 33408q 2f]

## Race condition (2)

FST 1.0 [0c 38q 0f], DAS 0.8 [0c 47q 1f]

## Heisenbug (1446)

idiv 2.0 [0c 0q 0f], POPCNT 1.9 [996c 0q 0f], MOVSD 1.8 [0c 0q 0f], CLD 1.8 [0c 1q 0f], PAND 1.7 [0c 0q 0f], SYSENTER 1.7 [0c 10q 0f], MOVSS 1.7 [0c 0q 0f], CLC 1.6 [0c 0q 2f], STC 1.6 [0c 0q 10f], TESTUI 1.5 [0c 0q 0f], ADDSD 1.4 [0c 0q 0f], PXOR 1.4 [0c 0q 0f], FADD 1.4 [0c 0q 0f], VMOVQ 1.4 [0c 0q 0f], MOVAPS 1.3 [0c 0q 0f], MOVDQA 1.3 [0c 0q 0f], MOVDQU 1.3 [0c 0q 0f], SYSRET 1.3 [0c 0q 0f], SYSEXIT 1.3 [0c 0q 0f], VPXOR 1.3 [0c 0q 0f], ADDPS 1.3 [0c 0q 0f], MOVUPS 1.2 [0c 0q 0f], MULSS 1.2 [0c 0q 0f], FLD 1.2 [0c 0q 0f], MULSD 1.2 [0c 0q 0f], POR 1.2 [0c 0q 0f], RDMSR 1.2 [0c 0q 0f], SQRTPS 1.2 [0c 0q 0f], INTO 1.2 [0c 0q 0f], XORPD 1.2 [0c 0q 0f], XORPS 1.2 [0c 0q 0f], LFENCE 1.2 [0c 0q 0f], UIRET 1.1 [0c 0q 0f], ADDPD 1.1 [0c 0q 0f], MAXSD 1.1 [0c 0q 0f], VMULSS 1.1 [0c 0q 0f], CMPSD 1.1 [0c 0q 0f], FSUB 1.1 [0c 0q 0f], MOVAPD 1.1 [0c 0q 0f], FMUL 1.1 [0c 0q 0f], VMOVSD 1.1 [0c 0q 0f], STUI 1.1 [0c 0q 17f], VMOVAPS 1.1 [0c 0q 0f], VMOVDQA 1.1 [0c 0q 0f], MOVUPD 1.1 [0c 0q 0f], LAHF 1.1 [0c 0q 0f], PCONFIG 1.0 [0c 0q 0f], VADDSD 1.0 [0c 0q 0f], VMOVSS 1.0 [0c 0q 0f], WRMSR 1.0 [0c 0q 0f], VADDPS 1.0 [0c 0q 0f], DIVSD 1.0 [0c 0q 0f], DIVSS 1.0 [0c 0q 0f], MFENCE 1.0 [0c 0q 0f], VMULPS 1.0 [0c 0q 0f], VMULSD 1.0 [0c 0q 0f], SQRTPD 1.0 [0c 0q 0f], FIST 1.0 [0c 0q 2f], MINSD 1.0 [0c 0q 0f], FABS 1.0 [0c 0q 1f] ...

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
