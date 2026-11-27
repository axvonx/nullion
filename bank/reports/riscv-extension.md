# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: RISC-V.

## riscv-extension

73 candidates; 39 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| V extension | 2 | 21 | 16 | 1.00 | womm | pin | — | — |
| Zicfiss | 2 | 1 | 1 | 1.00 | heisenbug | judge | heisenbug | — |
| Svnapot | 0 | 1 | 1 | 0.80 | heisenbug | judge | heisenbug | — |
| F extension | 2 | 0 | 1 | 0.60 | leak | judge | leak | — |
| D extension | 3 | 0 | 1 | 0.60 | leak | judge | leak | — |
| Zvfh | 2 | 0 | 1 | 0.60 | heisenbug | judge | heisenbug | — |
| Zicfilp | 2 | 0 | 1 | 0.60 | heisenbug | judge | heisenbug | — |
| Zfh | 1 | 0 | 1 | 0.53 | race | judge | race | — |
| Zve32x | 1 | 1 | 0 | 0.53 | heisenbug | judge | heisenbug | — |
| M extension | 0 | 0 | 1 | 0.40 | leak | judge | leak | — |
| B extension | 0 | 1 | 0 | 0.40 | leak | judge | leak | — |
| H extension | 0 | 0 | 2 | 0.40 | leak | judge | leak | — |
| P extension | 0 | 1 | 0 | 0.40 | race | judge | race | — |
| Zicsr | 0 | 0 | 1 | 0.40 | race | judge | race | — |
| Zifencei | 0 | 0 | 1 | 0.40 | race | judge | race | — |
| Zkt | 0 | 0 | 1 | 0.40 | heisenbug | judge | heisenbug | — |
| Zmmul | 0 | 0 | 1 | 0.40 | race | judge | race | — |
| Zfhmin | 2 | 0 | 0 | 0.20 | heisenbug | judge | heisenbug | — |
| C extension | 1 | 0 | 0 | 0.13 | leak | judge | leak | — |
| Zicntr | 1 | 0 | 0 | 0.13 | race | judge | race | — |
| Zihpm | 1 | 0 | 0 | 0.13 | race | judge | race | — |
| Zihintpause | 1 | 0 | 0 | 0.13 | race | judge | race | — |
| Zihintntl | 1 | 0 | 0 | 0.13 | heisenbug | judge | heisenbug | — |
| Zicond | 1 | 0 | 0 | 0.13 | race | judge | race | — |
| Ztso | 1 | 0 | 0 | 0.13 | race | judge | race | — |
| Zvbb | 1 | 0 | 0 | 0.13 | heisenbug | judge | heisenbug | — |
| Zvbc | 1 | 0 | 0 | 0.13 | heisenbug | judge | heisenbug | — |
| Zvkg | 1 | 0 | 0 | 0.13 | heisenbug | judge | heisenbug | — |
| Zvkned | 1 | 0 | 0 | 0.13 | heisenbug | judge | heisenbug | — |
| Zvknha | 1 | 0 | 0 | 0.13 | heisenbug | judge | heisenbug | — |
| Zvksed | 1 | 0 | 0 | 0.13 | heisenbug | judge | heisenbug | — |
| Zvksh | 1 | 0 | 0 | 0.13 | heisenbug | judge | heisenbug | — |
| Zimop | 1 | 0 | 0 | 0.13 | bitflip | pin | — | — |
| Zfa | 1 | 0 | 0 | 0.13 | heisenbug | judge | heisenbug | — |
| A extension ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Q extension ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Zba ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Zbb ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Zbc ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Zbs ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Zbkb ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zbkc ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zbkx ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zknd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zkne ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zknh ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zksed ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zksh ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zkr ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zfinx ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zdinx ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zhinx ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zicbom ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Zicboz ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Zicbop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Zawrs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zacas ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zabha ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zca ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zcb ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zcd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zcf ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zcmp ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zcmt ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zvl128b ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Svpbmt ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Svinval ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Sstc ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Sscofpmf ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Smepmp ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Smstateen ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Ssaia ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Sdtrig ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): none

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

