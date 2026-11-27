# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: x86, instruction.

## x86-instruction

1618 candidates; 1540 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| INTO ⚠ counts said off-by-one | 123 | 162 | 7156 | 1.00 | race | judge (override) | race | — |
| PUSH | 7 | 12 | 192 | 0.89 | off-by-one | counts | off-by-one | — |
| FINIT ⚠ counts said npe | 1 | 14 | 264 | 0.84 | race | judge (override) | race | — |
| SERIALIZE ⚠ counts said npe | 18 | 6 | 108 | 0.80 | race | judge (override) | race | — |
| PREFETCH | 1 | 90 | 62 | 0.75 | npe | counts | leak | — |
| DAS ⚠ counts said npe | 23 | 2 | 22 | 0.57 | race | judge (override) | race | — |
| NOP ⚠ counts said leak | 12 | 4 | 5 | 0.51 | off-by-one | judge (override) | off-by-one | — |
| INT ⚠ counts said leak | 10 | 1 | 18 | 0.46 | off-by-one | judge (override) | off-by-one | — |
| SYSCALL | 73 | 0 | 9 | 0.38 | leak | counts | npe | — |
| CLI | 1 | 0 | 44 | 0.33 | leak | counts | npe | — |
| POP ⚠ counts said race | 3 | 0 | 17 | 0.29 | off-by-one | judge (override) | off-by-one | — |
| STD ⚠ counts said race | 3 | 0 | 16 | 0.29 | npe | judge (override) | npe | — |
| CMC | 1 | 1 | 5 | 0.28 | leak | judge | leak | — |
| VPCLMULQDQ | 0 | 3 | 1 | 0.26 | heisenbug | judge | heisenbug | — |
| POR ⚠ counts said heisenbug | 40 | 0 | 0 | 0.20 | npe | judge (override) | npe | — |
| RDMSR ⚠ counts said heisenbug | 12 | 0 | 1 | 0.19 | leak | judge (override) | leak | — |
| DPPS | 0 | 0 | 6 | 0.15 | heisenbug | judge | heisenbug | — |
| AAS | 1 | 0 | 3 | 0.14 | race | judge | race | — |
| WRMSR ⚠ counts said heisenbug | 12 | 0 | 0 | 0.14 | leak | judge (override) | leak | — |
| DAA | 0 | 0 | 5 | 0.14 | race | judge | race | — |
| AAD | 0 | 0 | 4 | 0.12 | race | judge | race | — |
| CLFLUSH | 1 | 0 | 2 | 0.12 | leak | judge | leak | — |
| STC | 1 | 0 | 2 | 0.12 | npe | judge | npe | — |
| STI | 2 | 0 | 1 | 0.11 | npe | judge | npe | — |
| AAA | 0 | 0 | 3 | 0.11 | race | judge | race | — |
| ENQCMD | 6 | 0 | 0 | 0.10 | race | judge | race | — |
| ENQCMDS | 6 | 0 | 0 | 0.10 | race | judge | race | — |
| XSAVE | 6 | 0 | 0 | 0.10 | leak | judge | leak | — |
| XSAVES | 6 | 0 | 0 | 0.10 | race | judge | race | — |
| FILD | 0 | 1 | 0 | 0.10 | race | judge | race | — |
| FIST | 0 | 1 | 0 | 0.10 | race | judge | race | — |
| PCLMULQDQ | 0 | 1 | 0 | 0.10 | race | judge | race | — |
| SFENCE | 0 | 1 | 0 | 0.10 | leak | judge | leak | — |
| CLD | 1 | 0 | 1 | 0.09 | npe | judge | npe | — |
| SYSRET | 1 | 0 | 1 | 0.09 | leak | judge | leak | — |
| WBINVD | 1 | 0 | 1 | 0.09 | womm | pin | leak | — |
| INT3 | 1 | 0 | 1 | 0.09 | npe | judge | npe | — |
| LFENCE | 1 | 0 | 1 | 0.09 | leak | judge | leak | — |
| INVLPG | 4 | 0 | 0 | 0.09 | leak | judge | leak | — |
| EMMS | 0 | 0 | 2 | 0.08 | leak | judge | leak | — |
| FLD | 0 | 0 | 2 | 0.08 | npe | judge | npe | — |
| FABS | 0 | 0 | 2 | 0.08 | race | judge | race | — |
| ERETS | 3 | 0 | 0 | 0.07 | heisenbug | judge | heisenbug | — |
| ERETU | 3 | 0 | 0 | 0.07 | heisenbug | judge | heisenbug | — |
| SYSENTER | 3 | 0 | 0 | 0.07 | npe | judge | npe | — |
| VMCALL | 3 | 0 | 0 | 0.07 | leak | judge | leak | — |
| GETSEC | 3 | 0 | 0 | 0.07 | race | judge | race | — |
| FXSAVE | 2 | 0 | 0 | 0.06 | leak | judge | leak | — |
| INVPCID | 2 | 0 | 0 | 0.06 | leak | judge | leak | — |
| VMREAD | 2 | 0 | 0 | 0.06 | leak | judge | leak | — |
| VMWRITE | 2 | 0 | 0 | 0.06 | leak | judge | leak | — |
| XSAVEOPT | 2 | 0 | 0 | 0.06 | race | judge | race | — |
| ENCLS | 2 | 0 | 0 | 0.06 | race | judge | race | — |
| CLAC | 0 | 0 | 1 | 0.05 | leak | judge | leak | — |
| CLC | 0 | 0 | 1 | 0.05 | npe | judge | npe | — |
| ENDBR64 | 0 | 0 | 1 | 0.05 | leak | judge | leak | — |
| MAXPS | 0 | 0 | 1 | 0.05 | race | judge | race | — |
| PMADDUBSW | 0 | 0 | 1 | 0.05 | heisenbug | judge | heisenbug | — |
| POPCNT | 0 | 0 | 1 | 0.05 | npe | judge | npe | — |
| PREFETCHW | 0 | 0 | 1 | 0.05 | leak | judge | leak | — |
| STAC | 0 | 0 | 1 | 0.05 | leak | judge | leak | — |
| AAM | 0 | 0 | 1 | 0.05 | race | judge | race | — |
| FCOS | 0 | 0 | 1 | 0.05 | leak | judge | leak | — |
| MFENCE | 0 | 0 | 1 | 0.05 | leak | judge | leak | — |
| INVD | 1 | 0 | 0 | 0.04 | leak | judge | leak | — |
| INVEPT | 1 | 0 | 0 | 0.04 | leak | judge | leak | — |
| INVVPID | 1 | 0 | 0 | 0.04 | leak | judge | leak | — |
| MOVNTI | 1 | 0 | 0 | 0.04 | leak | judge | leak | — |
| MOVQ | 1 | 0 | 0 | 0.04 | npe | judge | npe | — |
| RSM | 1 | 0 | 0 | 0.04 | leak | judge | leak | — |
| SYSEXIT | 1 | 0 | 0 | 0.04 | leak | judge | leak | — |
| VMCLEAR | 1 | 0 | 0 | 0.04 | leak | judge | leak | — |
| VMFUNC | 1 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| VMLAUNCH | 1 | 0 | 0 | 0.04 | leak | judge | leak | — |
| VMPTRLD | 1 | 0 | 0 | 0.04 | leak | judge | leak | — |
| VMPTRST | 1 | 0 | 0 | 0.04 | leak | judge | leak | — |
| VMRESUME | 1 | 0 | 0 | 0.04 | leak | judge | leak | — |
| VMXOFF | 1 | 0 | 0 | 0.04 | leak | judge | leak | — |
| VMXON | 1 | 0 | 0 | 0.04 | leak | judge | leak | — |
| WRMSRNS | 1 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| WRPKRU | 1 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| XGETBV | 1 | 0 | 0 | 0.04 | leak | judge | leak | — |
| XRSTOR | 1 | 0 | 0 | 0.04 | leak | judge | leak | — |
| XRSTORS | 1 | 0 | 0 | 0.04 | race | judge | race | — |
| ENCLU | 1 | 0 | 0 | 0.04 | race | judge | race | — |
| RDPKRU | 1 | 0 | 0 | 0.04 | race | judge | race | — |
| ADDSUBPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ADDSUBPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| AESDEC128KL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| AESDEC256KL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| AESDECWIDE128KL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| AESDECWIDE256KL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| AESENC128KL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| AESENC256KL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| AESENCWIDE128KL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| AESENCWIDE256KL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ANDNPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ANDNPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ANDPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ANDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| BLENDPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| BLENDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| BLENDVPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| BLENDVPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| BNDCL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| BNDCN ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| BNDCU ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| BNDLDX ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| BNDMK ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| BNDMOV ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| BNDSTX ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CLDEMOTE ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CLRSSBSY ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CLUI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CLWB ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| CMPPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CMPPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CMPSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CMPSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| COMISD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| COMISS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CVTDQ2PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CVTDQ2PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CVTPD2DQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CVTPD2PI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CVTPD2PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CVTPI2PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CVTPI2PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CVTPS2DQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CVTPS2PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CVTPS2PI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CVTSD2SI ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CVTSD2SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CVTSI2SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CVTSI2SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CVTSS2SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CVTSS2SI ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CVTTPD2DQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CVTTPD2PI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CVTTPS2DQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CVTTPS2PI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CVTTSD2SI ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CVTTSS2SI ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| DPPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ENCODEKEY128 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ENCODEKEY256 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ENDBR32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| EXTRACTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| F2XM1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FADD ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| FBLD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FBSTP ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FCLEX ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FCMOVB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FCMOVBE ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FCMOVE ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FCMOVNB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FCMOVNBE ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FCMOVNE ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FCMOVNU ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FCMOVU ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FCOM ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FCOMI ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FCOMIP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FCOMP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FCOMPP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FDECSTP ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FDISI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FDIV ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| FDIVR ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FDIVRP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FENI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FFREE ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FFREEP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FIADD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FICOM ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FICOMP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FIDIV ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FIDIVR ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FIMUL ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FINCSTP ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FISTP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FISTTP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FISUB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FISUBR ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FLD1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FLDCW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FLDENV ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FLDL2E ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FLDL2T ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FLDLG2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FLDLN2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FLDPI ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FLDZ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FMUL ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| FNCLEX ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FNDISI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FNENI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FNINIT ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FNSAVE ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FNSTCW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FNSTENV ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FNSTSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FPATAN ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FPREM ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FPREM1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FPTAN ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FRNDINT ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FRSTOR ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FSAVE ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FSCALE ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FSETPM ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FSIN ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| FSINCOS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FSQRT ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| FST ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| FSTCW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FSTENV ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FSTP ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| FSTSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FSUB ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| FSUBR ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FSUBRP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FTST ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FUCOM ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FUCOMI ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FUCOMIP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FUCOMP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FUCOMPP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FXAM ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FXRSTOR ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| FXTRACT ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FYL2X ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FYL2XP1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| GF2P8AFFINEINVQB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| GF2P8AFFINEQB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| GF2P8MULB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| HADDPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| HADDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| HRESET ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| HSUBPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| HSUBPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ICEBP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| INCSSPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| INCSSPQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| INSERTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| LDDQU ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| LDMXCSR ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| LDTILECFG ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| LOADALL ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| LOADALL286 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| LOADIWKEY ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MASKMOVDQU ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MASKMOVQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MAXPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MAXSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MAXSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MINPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MINPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MINSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MINSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVAPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVAPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| MOVD ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| MOVDDUP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVDQ2Q ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVDQA ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| MOVDQU ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| MOVHLPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVHPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVHPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVLHPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVLPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVLPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVMSKPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVMSKPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVNTDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| MOVNTDQA ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| MOVNTPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| MOVNTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| MOVNTQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVQ2DQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVSHDUP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVSLDUP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVUPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVUPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| MPSADBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ORPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ORPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PABSB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PABSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PABSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PACKSSDW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PACKSSWB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PACKUSDW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PACKUSWB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PADDSB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PADDSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PADDUSB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PADDUSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PALIGNR ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PAND ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| PANDN ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| PAVGB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PAVGW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PBLENDVB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PBLENDW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PCLMULHQHQDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PCLMULHQLQDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PCLMULLQHQDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PCLMULLQLQDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PCMPEQD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PCMPEQQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PCMPEQW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PCMPGTD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PCMPGTQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PCMPGTW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PCOMMIT ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PCONFIG ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PEXTRW ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PHADDD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PHADDSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PHADDW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PHMINPOSUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PHSUBD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PHSUBSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PHSUBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PINSRB ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PINSRD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PINSRW ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PMADDWD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PMAXSB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMAXSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMAXSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PMAXUB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PMAXUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMAXUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMINSB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMINSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMINSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PMINUB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PMINUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMINUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMOVMSKB ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PMOVSXBD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMOVSXBQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMOVSXBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMOVSXDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMOVSXWD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMOVSXWQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMOVZXBD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMOVZXBQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMOVZXBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMOVZXDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMOVZXWD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMOVZXWQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMULDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMULHRSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMULHUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PMULHW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PMULLD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMULLW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PMULUDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| POP2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PREFETCHIT0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PREFETCHIT1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PREFETCHNTA ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PREFETCHRST2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PREFETCHT1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PREFETCHT2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PREFETCHWT1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PSADBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PSHUFHW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PSHUFLW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PSHUFW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PSIGNB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PSIGND ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PSIGNW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PSLLD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PSLLDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PSLLQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PSLLW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PSRAD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PSRAW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PSRLD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PSRLDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PSRLQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PSRLW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PSUBSB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PSUBSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PSUBUSB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PSUBUSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PTEST ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PUNPCKHBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PUNPCKHDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PUNPCKHQDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PUNPCKHWD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PUNPCKLBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PUNPCKLDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PUNPCKLQDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PUNPCKLWD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PUSH2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PXOR ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| RCPPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| RCPSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| RDMSRLIST ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| RDSSPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| RDSSPQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ROUNDPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ROUNDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ROUNDSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ROUNDSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| RSQRTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| RSQRTSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| RSTORSSP ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SALC ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| SAVEPREVSSP ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SENDUIPI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SETSSBSY ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SHA1MSG1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SHA1MSG2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SHA1NEXTE ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SHA256MSG1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SHA256MSG2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SHUFPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| SHUFPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| STMXCSR ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| STTILECFG ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| STUI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| T2RPNTLVWZ0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| T2RPNTLVWZ0RS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| T2RPNTLVWZ0RST1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| T2RPNTLVWZ0T1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| T2RPNTLVWZ1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| T2RPNTLVWZ1RS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| T2RPNTLVWZ1RST1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| T2RPNTLVWZ1T1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TCMMIMFP16PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TCMMRLFP16PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TCONJTCMMIMFP16PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TCONJTFP16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TCVTROWD2PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TCVTROWPS2BF16H ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TCVTROWPS2BF16L ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TCVTROWPS2PHH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TCVTROWPS2PHL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TDPBF16PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| TDPBF8PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TDPBHF8PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TDPBSSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TDPBSUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TDPBUSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TDPBUUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TDPFP16PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TDPHBF8PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TDPHF8PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TESTUI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TILELOADD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| TILELOADDRS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TILELOADDRST1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TILELOADDT1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TILEMOVROW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TILERELEASE ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| TILESTORED ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| TILEZERO ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| TMMULTF32PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TTCMMIMFP16PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TTCMMRLFP16PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TTDPBF16PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TTDPFP16PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TTMMULTF32PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TTRANSPOSED ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| UCOMISD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| UCOMISS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| UIRET ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| UNPCKHPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| UNPCKHPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| UNPCKLPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| UNPCKLPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| URDMSR ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| UWRMSR ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| V4FMADDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| V4FMADDSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| V4FNMADDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| V4FNMADDSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VADDBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VADDPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VADDSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VADDSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VADDSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VADDSUBPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VADDSUBPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VAESDEC ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VAESDECLAST ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VAESENC ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VAESENCLAST ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VAESIMC ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VAESKEYGENASSIST ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VALIGND ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VALIGNQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VANDNPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VANDNPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VANDPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VANDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VBCSTNEBF162PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBCSTNEBF16PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBCSTNESH2PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBITREV ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBLENDMPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBLENDMPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBLENDPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VBLENDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VBLENDVPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VBLENDVPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VBMACOR16X16X16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBMACXOR16X16X16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBROADCASTF128 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VBROADCASTF32X2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBROADCASTF32X4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBROADCASTF32X8 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBROADCASTF64X2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBROADCASTF64X4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBROADCASTI128 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VBROADCASTI32X2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBROADCASTI32X4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBROADCASTI32X8 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBROADCASTI64X2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBROADCASTI64X4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VBROADCASTSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VBROADCASTSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VCMPBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCMPPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCMPSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCMPSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCOMISBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCOMISD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCOMISH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCOMISS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCOMPRESSPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCOMPRESSPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCOMXSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCOMXSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCOMXSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVT2PH2BF8 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVT2PH2BF8S ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVT2PH2HF8 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVT2PH2HF8S ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVT2PS2PHX ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTBF162IBS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTBF162IUBS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTBIASPH2BF8 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTBIASPH2BF8S ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTBIASPH2HF8 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTBIASPH2HF8S ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTDQ2PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTDQ2PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTDQ2PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTHF82PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTNE2PS2BF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTNEEBF162PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTNEEPH2PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTNEOBF162PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTNEOPH2PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTNEPS2BF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPD2DQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTPD2PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPD2PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTPD2QQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPD2UDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPD2UQQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPH2BF8 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPH2BF8S ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPH2DQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPH2HF8 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPH2HF8S ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPH2IBS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPH2IUBS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPH2PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPH2PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTPH2PSX ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPH2QQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPH2UDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPH2UQQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPH2UW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPH2W ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPS2DQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTPS2IBS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPS2IUBS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPS2PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTPS2PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTPS2PHX ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPS2QQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPS2UDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTPS2UQQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTQQ2PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTQQ2PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTQQ2PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTSD2SH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTSD2SI ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTSD2SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTSD2USI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTSH2SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTSH2SI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTSH2SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTSH2USI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTSI2SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTSI2SH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTSI2SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTSS2SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTSS2SH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTSS2SI ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTSS2USI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTBF162IBS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTBF162IUBS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPD2DQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTTPD2DQS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPD2QQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPD2QQS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPD2UDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPD2UDQS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPD2UQQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPD2UQQS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPH2DQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPH2IBS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPH2IUBS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPH2QQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPH2UDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPH2UQQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPH2UW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPH2W ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPS2DQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTTPS2DQS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPS2IBS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPS2IUBS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPS2QQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPS2QQS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPS2UDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPS2UDQS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPS2UQQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTPS2UQQS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTSD2SI ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTTSD2USI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTSH2SI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTSH2USI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTTSS2SI ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VCVTTSS2USI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTUDQ2PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTUDQ2PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTUDQ2PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTUQQ2PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTUQQ2PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTUQQ2PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTUSI2SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTUSI2SH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTUSI2SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTUW2PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCVTW2PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VDBPSADBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VDIVBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VDIVPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VDIVPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VDIVPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VDIVSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VDIVSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VDIVSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VDPBF16PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VDPPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VDPPHPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VDPPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VENDSCALEPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VENDSCALESH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VEXP2PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VEXP2PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VEXPANDPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VEXPANDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VEXTRACTF128 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VEXTRACTF32X4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VEXTRACTF32X8 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VEXTRACTF64X2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VEXTRACTF64X4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VEXTRACTI128 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VEXTRACTI32X4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VEXTRACTI32X8 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VEXTRACTI64X2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VEXTRACTI64X4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VEXTRACTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFCMADDCPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFCMADDCSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFCMULCPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFCMULCSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFIXUPIMMPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFIXUPIMMPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFIXUPIMMSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFIXUPIMMSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADD132BF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADD132PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VFMADD132PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADD132PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VFMADD132SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMADD132SH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADD132SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMADD213BF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADD213PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VFMADD213PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADD213PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VFMADD213SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMADD213SH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADD213SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMADD231BF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADD231PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VFMADD231PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADD231PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VFMADD231SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMADD231SH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADD231SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMADDCPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADDCSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADDSUB132PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADDSUB132PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADDSUB132PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADDSUB213PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADDSUB213PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADDSUB213PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADDSUB231PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADDSUB231PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMADDSUB231PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUB132BF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUB132PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMSUB132PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUB132PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMSUB132SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMSUB132SH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUB132SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMSUB213BF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUB213PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMSUB213PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUB213PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMSUB213SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMSUB213SH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUB213SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMSUB231BF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUB231PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMSUB231PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUB231PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMSUB231SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMSUB231SH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUB231SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFMSUBADD132PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUBADD132PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUBADD132PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUBADD213PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUBADD213PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUBADD213PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUBADD231PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUBADD231PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMSUBADD231PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMULCPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFMULCSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMADD132BF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMADD132PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMADD132PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMADD132PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMADD132SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMADD132SH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMADD132SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMADD213BF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMADD213PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMADD213PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMADD213PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMADD213SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMADD213SH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMADD213SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMADD231BF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMADD231PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMADD231PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMADD231PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMADD231SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMADD231SH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMADD231SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMSUB132BF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMSUB132PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMSUB132PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMSUB132PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMSUB132SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMSUB132SH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMSUB132SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMSUB213BF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMSUB213PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMSUB213PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMSUB213PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMSUB213SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMSUB213SH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMSUB213SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMSUB231BF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMSUB231PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMSUB231PH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMSUB231PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMSUB231SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFNMSUB231SH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFNMSUB231SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VFPCLASSBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFPCLASSPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFPCLASSPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFPCLASSPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFPCLASSSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFPCLASSSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VFPCLASSSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGATHERDPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VGATHERDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VGATHERPF0DPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGATHERPF0DPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGATHERPF0QPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGATHERPF0QPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGATHERPF1DPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGATHERPF1DPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGATHERPF1QPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGATHERPF1QPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGATHERQPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VGATHERQPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VGETEXPBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGETEXPPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGETEXPPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGETEXPPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGETEXPSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGETEXPSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGETEXPSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGETMANTBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGETMANTPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGETMANTPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGETMANTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGETMANTSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGETMANTSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGETMANTSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGF2P8AFFINEINVQB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VGF2P8AFFINEQB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VGF2P8MULB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VHADDPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VHADDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VHSUBPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VHSUBPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VINSERTF128 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VINSERTF32X4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VINSERTF32X8 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VINSERTF64X2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VINSERTF64X4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VINSERTI128 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VINSERTI32X4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VINSERTI32X8 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VINSERTI64X2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VINSERTI64X4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VINSERTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VLDDQU ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VLDMXCSR ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMASKMOVDQU ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMASKMOVPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMASKMOVPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMAXBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMAXPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMAXPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMAXPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMAXSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMAXSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMAXSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMINBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMINMAXBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMINMAXPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMINMAXPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMINMAXPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMINMAXSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMINMAXSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMINMAXSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMINPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMINPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMINPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMINSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMINSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMINSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVAPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVDDUP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVDQA32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMOVDQA64 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMOVDQU16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMOVDQU32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMOVDQU64 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMOVDQU8 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMOVHLPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVHPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVHPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVLHPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVLPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVLPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVMSKPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVMSKPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVNTDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVNTDQA ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVNTPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVNTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMOVSHDUP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVSLDUP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVUPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVUPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMOVW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMPSADBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMULBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMULPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMULPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMULPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMULSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMULSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMULSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VORPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VORPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VP2INTERSECTD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VP2INTERSECTQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VP4DPWSSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VP4DPWSSDS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPABSB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPABSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPABSQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPABSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPACKSSDW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPACKSSWB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPACKUSDW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPACKUSWB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPADDB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPADDD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPADDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPADDSB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPADDSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPADDUSB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPADDUSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPADDW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPALIGNR ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPAND ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPANDD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPANDN ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPANDND ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPANDNQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPANDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPAVGB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPAVGW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPBLENDD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPBLENDMB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPBLENDMD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPBLENDMQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPBLENDMW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPBLENDVB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPBLENDW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPBROADCASTB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPBROADCASTD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPBROADCASTMB2Q ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPBROADCASTMW2D ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPBROADCASTQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPBROADCASTW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPCLMULHQHQDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCLMULHQLQDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCLMULLQHQDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCLMULLQLQDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPEQB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPCMPEQD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPCMPEQQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPCMPEQW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPCMPESTRI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPESTRM ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPGTB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPCMPGTD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPCMPGTQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPCMPGTW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPCMPISTRI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPISTRM ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPUB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPUQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCOMPRESSB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCOMPRESSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCOMPRESSQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCOMPRESSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCONFLICTD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPCONFLICTQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPDPBSSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPDPBSSDS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPDPBSUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPDPBSUDS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPDPBUSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPDPBUSDS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPDPBUUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPDPBUUDS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPDPWSSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPDPWSSDS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPDPWSUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPDPWSUDS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPDPWUSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPDPWUSDS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPDPWUUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPDPWUUDS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPERM2F128 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPERM2I128 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPERMB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPERMD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPERMI2B ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPERMI2D ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPERMI2PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPERMI2PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPERMI2Q ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPERMI2W ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPERMILPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPERMILPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPERMPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPERMPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPERMQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPERMT2B ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPERMT2D ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPERMT2PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPERMT2PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPERMT2Q ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPERMT2W ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPERMW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPEXPANDB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPEXPANDD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPEXPANDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPEXPANDW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPEXTRB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPEXTRD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPEXTRQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPEXTRW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPGATHERDD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPGATHERDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPGATHERQD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPGATHERQQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPHADDBD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPHADDBQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPHADDBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPHADDD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPHADDDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPHADDSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPHADDUBD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPHADDUBQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPHADDUBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPHADDUDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPHADDUWD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPHADDUWQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPHADDW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPHADDWD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPHADDWQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPHSUBBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPHSUBD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPHSUBDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPHSUBSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPHSUBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPHSUBWD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPINSRB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPINSRD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPINSRQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPINSRW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPLZCNTD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPLZCNTQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMACSDD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMACSDQH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMACSDQL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMACSSDD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMACSSDQH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMACSSDQL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMACSSWD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMACSSWW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMACSWD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMACSWW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMADCSSWD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMADCSWD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMADD52HUQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMADD52LUQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMADDUBSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMADDWD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMASKMOVD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMASKMOVQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMAXSB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMAXSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMAXSQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMAXSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMAXUB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMAXUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMAXUQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMAXUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMINSB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMINSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMINSQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMINSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMINUB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMINUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMINUQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMINUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMOVB2M ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVD2M ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVDB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVDW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVM2B ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVM2D ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVM2Q ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVM2W ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVQ2M ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVQB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVQD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVQW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVSDB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVSDW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVSQB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVSQD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVSQW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVSWB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVSXBD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMOVSXBQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMOVSXBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMOVSXDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMOVSXWD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMOVSXWQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMOVUSDB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVUSDW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVUSQB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVUSQD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVUSQW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVUSWB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVW2M ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVWB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMOVZXBD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMOVZXBQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMOVZXBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMOVZXDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMOVZXWD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMOVZXWQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMULDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMULHRSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMULHUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMULHW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMULLD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMULLQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMULLW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMULTISHIFTQB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPMULUDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPOPCNTB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPOPCNTD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPOPCNTQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPOPCNTW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPOR ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPORD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPORQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPPERM ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPROLD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPROLQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPROLVD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPROLVQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPRORD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPRORQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPRORVD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPRORVQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPROTB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPROTD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPROTQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPROTW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSADBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSCATTERDD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSCATTERDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSCATTERQD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSCATTERQQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHAB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHAD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHAQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHAW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHLB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHLD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHLDD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHLDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHLDVD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHLDVQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHLDVW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHLDW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHLQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHLW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHRDD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHRDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHRDVD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHRDVQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHRDVW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHRDW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHUFB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSHUFBITQMB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSHUFD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSHUFHW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSHUFLW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSIGNB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSIGND ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSIGNW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSLLD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSLLDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSLLQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSLLVD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSLLVQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSLLVW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSLLW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSRAD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSRAQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSRAVD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSRAVQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSRAVW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSRAW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSRLD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSRLDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSRLQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSRLVD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSRLVQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSRLVW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPSRLW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSUBB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSUBD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSUBQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSUBSB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSUBSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSUBUSB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSUBUSW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPSUBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPTERNLOGD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPTERNLOGQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPTEST ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPTESTMB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPTESTMD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPTESTMQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPTESTMW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPTESTNMB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPTESTNMD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPTESTNMQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPTESTNMW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPUNPCKHBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPUNPCKHDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPUNPCKHQDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPUNPCKHWD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPUNPCKLBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPUNPCKLDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPUNPCKLQDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPUNPCKLWD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPXORD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPXORQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRANGEPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRANGEPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRANGESD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRANGESS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRCP14PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRCP14PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRCP14SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRCP14SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRCP28PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRCP28PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRCP28SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRCP28SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRCPBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRCPPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRCPPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VRCPSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRCPSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VREDUCEBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VREDUCEPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VREDUCEPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VREDUCEPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VREDUCESD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VREDUCESH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VREDUCESS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRNDSCALEBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRNDSCALEPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRNDSCALEPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRNDSCALEPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRNDSCALESD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRNDSCALESH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRNDSCALESS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VROUNDPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VROUNDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VROUNDSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VROUNDSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VRSQRT14PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRSQRT14PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRSQRT14SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRSQRT14SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRSQRT28PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRSQRT28PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRSQRT28SD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRSQRT28SS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRSQRTBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRSQRTPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRSQRTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VRSQRTSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VRSQRTSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VSCALEFBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCALEFPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCALEFPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCALEFPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCALEFSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCALEFSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCALEFSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCATTERDPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCATTERDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCATTERPF0DPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCATTERPF0DPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCATTERPF0QPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCATTERPF0QPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCATTERPF1DPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCATTERPF1DPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCATTERPF1QPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCATTERPF1QPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCATTERQPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSCATTERQPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSHA512MSG1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSHA512MSG2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSHA512RNDS2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSHUFF32X4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSHUFF64X2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSHUFI32X4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSHUFI64X2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSM3MSG1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSM3MSG2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSM3RNDS2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSM4KEY4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSM4RNDS4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSQRTBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSQRTPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VSQRTPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSQRTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VSQRTSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VSQRTSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSQRTSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VSUBBF16 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSUBPH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VSUBSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VTESTPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VTESTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VUCOMISH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VUCOMXSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VUCOMXSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VUCOMXSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VUNPCKHPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VUNPCKHPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VUNPCKLPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VUNPCKLPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VZEROUPPER | 0 | 0 | 0 | 0.00 | womm | pin | npe | — |
| WBNOINVD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| WRMSRLIST ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| WRSHR ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| WRSSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| WRSSQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| WRUSSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| WRUSSQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| XABORT ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| XCRYPTCBC ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| XCRYPTCFB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| XCRYPTCTR ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| XCRYPTECB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| XCRYPTOFB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| XEND ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| XORPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| XORPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| XRESLDTRK ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| XSAVEC ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| XSETBV ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| XSHA1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| XSHA256 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| XSTORE ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| XSUSLDTRK | 0 | 0 | 0 | 0.00 | bitflip | pin | heisenbug | — |
| XTEST ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ADDPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ADDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ADDSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ADDSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| AESDEC ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| AESDECLAST ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| AESENC ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| AESENCLAST ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| AESIMC ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| AESKEYGENASSIST ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CLFLUSHOPT ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CMPEQPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPEQPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPEQSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPEQSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPLEPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPLEPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPLESD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPLESS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPLTPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPLTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPLTSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPLTSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPNEQPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPNEQPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPNEQSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPNEQSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPNLEPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPNLEPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPNLESD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPNLESS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPNLTPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPNLTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPNLTSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPNLTSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPORDPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPORDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPORDSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPORDSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPUNORDPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPUNORDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPUNORDSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMPUNORDSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| DIVPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| DIVPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| DIVSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| DIVSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ENCLV ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FADDP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FCHS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FDIVP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FMULP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FNOP ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| FSUBP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FWAIT ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| FXCH ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| INT03 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| LAHF ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| MOVSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MOVSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MULPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| MULPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| MULSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| MULSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PADDB ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PADDD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PADDQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PADDW ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PBNDKB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PCMPEQB ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PCMPESTRI ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PCMPESTRM ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PCMPGTB ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PCMPISTRI ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PCMPISTRM ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PEXTRB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PEXTRD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PEXTRQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PINSRQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| POP2P ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| POPP ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PREFETCHT0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PSHUFB ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PSHUFD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PSUBB ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PSUBD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PSUBQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PSUBW ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| PUSH2P ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PUSHP ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SAHF ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| SHA1RNDS4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| SHA256RNDS2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| SQRTPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| SQRTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| SQRTSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| SQRTSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| SUBPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| SUBPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| SUBSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| SUBSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VADDPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VADDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VCMPEQPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPEQPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPEQSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPEQSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPFALSEPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPFALSEPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPFALSESD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPFALSESS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPGEPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPGEPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPGESD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPGESS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPGTPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPGTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPGTSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPGTSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPLEPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPLEPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPLESD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPLESS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPLTPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPLTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPLTSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPLTSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNEQPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNEQPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNEQSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNEQSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNGEPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNGEPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNGESD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNGESS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNGTPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNGTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNGTSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNGTSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNLEPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNLEPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNLESD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNLESS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNLTPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNLTPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNLTSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPNLTSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPORDPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPORDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPORDSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPORDSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPTRUEPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPTRUEPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPTRUESD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPTRUESS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPUNORDPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPUNORDPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPUNORDSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VCMPUNORDSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VMOVAPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VMOVDQA ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VMOVDQU ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VPCMPEQUB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPEQUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPEQUQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPEQUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPGEB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPGED ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPGEQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPGEUB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPGEUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPGEUQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPGEUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPGEW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPGTUB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPGTUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPGTUQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPGTUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPLEB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPLED ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPLEQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPLEUB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPLEUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPLEUQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPLEUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPLEW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPLTB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPLTD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPLTQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPLTUB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPLTUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPLTUQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPLTUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPLTW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNEQB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNEQD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNEQQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNEQUB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNEQUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNEQUQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNEQUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNEQW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNGTB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNGTD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNGTQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNGTUB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNGTUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNGTUQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNGTUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNGTW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNLEB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNLED ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNLEQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNLEUB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNLEUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNLEUQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNLEUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNLEW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNLTB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNLTD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNLTQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNLTUB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNLTUD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNLTUQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNLTUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPCMPNLTW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VPHMINPOSUW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPMOVMSKB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VPXOR ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VSHUFPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VSHUFPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VSTMXCSR ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VSUBPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VSUBPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VSUBSD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VSUBSS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VUCOMISD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VUCOMISS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VXORPD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VXORPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| VZEROALL ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| XLAT | 0 | 0 | 0 | 0.00 | womm | pin | leak | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): FINIT (counts said npe, now race), INT (counts said leak, now off-by-one), INTO (counts said off-by-one, now race), NOP (counts said leak, now off-by-one), POP (counts said race, now off-by-one), POR (counts said heisenbug, now npe), RDMSR (counts said heisenbug, now leak), SERIALIZE (counts said npe, now race), STD (counts said race, now npe), WRMSR (counts said heisenbug, now leak), DAS (counts said npe, now race)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

20/20 sampled answers are members (100%); 20/20 also have an acceptable tier. Not members: none.

## Pipeline report

Generated 2026-11-27 23:42 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/x86-instruction.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (XSUSLDTRK; XLAT, WBINVD, VZEROUPPER): the owner vets them
- scripts/bank/obvious-draft/x86-instruction.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| filter kept | PASS | pass A kept 1797, pass B kept 1460 of 1817 harvested lines |
| obvious coverage | PASS | 36/36 obvious answers accepted |
| duplicates | WARN | 26 likely duplicate pairs: 'ENQCMDS' duplicates 'ENQCMD'; 'XRSTORS' duplicates 'XRSTOR'; 'XSAVES' duplicates 'XSAVE'; 'VCVT2PH2BF8S' duplicates 'VCVT2PH2BF8'; 'VCVT2PH2HF8S' duplicates 'VCVT2PH2HF8' |
| link coverage | WARN | 20/1496 answers have a verified link (1%); prompt link yes |
| precision | PASS | 20/20 sampled answers are members (100%), 20/20 with acceptable tier |
| answer count | PASS | 1496 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 3 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 16 | 16 |
| Works on my machine | 3 | 0 |
| Null pointer exception | 48 | 48 |
| Memory leak | 118 | 118 |
| Race condition | 557 | 557 |
| Heisenbug | 753 | 753 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 153.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## x86-instruction
_Name an x86 instruction_

Works on my machine:
- [ ] SYSCALL
- [ ] AESENC
- [ ] LOADALL
- [ ] SALC
- [ ] RDMSRLIST
- [ ] TILERELEASE
- [ ] WRMSR
- [ ] VZEROUPPER
- [ ] XLAT
- [ ] WBINVD
- [ ] XSTORE
- [ ] other: 

Bit Flip:
- [ ] SALC
- [ ] ICEBP
- [ ] PCOMMIT
- [ ] LOADALL286
- [ ] FSETPM
- [ ] VPTERNLOGD
- [ ] XCRYPTCBC
- [ ] VPMULTISHIFTQB
- [ ] VPSHUFBITQMB
- [ ] XSUSLDTRK
- [ ] XSHA1
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 14 |
| harvest | done | 0 |
| filter | done | 286 |
| compare | done | 0 |
| escalate | done | 44 |
| merge | done | 10 |
| obvious | done | 22 |
| dupes | done | 0 |
| links | done | 18 |
| precision | done | 19 |
| report | running |  |
