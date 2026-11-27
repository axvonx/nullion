# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: cipher.

## block-cipher

56 candidates; 14 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| AES | 28 | 156 | 116 | 1.00 | off-by-one | counts | off-by-one | — |
| DES | 1 | 46 | 30 | 0.88 | npe | counts | off-by-one | — |
| PRESENT ⚠ counts said npe | 0 | 78 | 282 | 0.80 | race | judge (override) | race | — |
| SEED ⚠ counts said npe | 2 | 15 | 11 | 0.74 | race | judge (override) | race | — |
| Simon ⚠ counts said npe | 0 | 80 | 12 | 0.70 | race | judge (override) | race | — |
| IDEA | 0 | 18 | 28 | 0.66 | npe | counts | npe | — |
| Square ⚠ counts said npe | 0 | 18 | 17 | 0.61 | heisenbug | judge (override) | heisenbug | — |
| Speck | 0 | 36 | 5 | 0.54 | leak | counts | race | — |
| Camellia | 0 | 35 | 5 | 0.54 | leak | counts | leak | — |
| DEAL ⚠ counts said leak | 1 | 1 | 12 | 0.49 | heisenbug | judge (override) | heisenbug | — |
| PRINCE ⚠ counts said leak | 0 | 24 | 4 | 0.48 | heisenbug | judge (override) | heisenbug | — |
| GIFT ⚠ counts said leak | 0 | 25 | 2 | 0.43 | heisenbug | judge (override) | heisenbug | — |
| KASUMI | 0 | 12 | 4 | 0.42 | leak | counts | race | — |
| SM4 | 0 | 20 | 2 | 0.41 | leak | counts | leak | — |
| RC6 | 0 | 13 | 3 | 0.40 | leak | counts | race | — |
| ARIA | 0 | 12 | 2 | 0.36 | leak | counts | race | — |
| Blowfish | 0 | 4 | 5 | 0.36 | off-by-one | judge | off-by-one | — |
| Serpent | 0 | 6 | 3 | 0.34 | leak | judge | leak | — |
| XTEA | 0 | 5 | 3 | 0.33 | race | judge | race | — |
| E2 | 0 | 4 | 3 | 0.31 | heisenbug | judge | heisenbug | — |
| TEA ⚠ counts said race | 0 | 11 | 1 | 0.31 | npe | judge (override) | npe | — |
| Kuznyechik | 0 | 6 | 2 | 0.31 | race | judge | race | — |
| MISTY1 | 0 | 10 | 1 | 0.30 | race | counts | race | — |
| Triple DES | 0 | 5 | 2 | 0.29 | leak | judge | leak | — |
| SAFER | 0 | 5 | 2 | 0.29 | race | judge | race | — |
| SKINNY | 0 | 21 | 0 | 0.28 | race | counts | heisenbug | — |
| HIGHT | 0 | 18 | 0 | 0.27 | race | counts | heisenbug | — |
| CLEFIA | 0 | 17 | 0 | 0.26 | race | counts | heisenbug | — |
| LEA | 0 | 13 | 0 | 0.24 | race | counts | heisenbug | — |
| Skipjack | 0 | 4 | 1 | 0.23 | race | judge | race | — |
| NOEKEON | 0 | 4 | 1 | 0.23 | heisenbug | judge | heisenbug | — |
| RC5 | 0 | 1 | 3 | 0.22 | npe | judge | npe | — |
| CAST-128 | 0 | 3 | 1 | 0.21 | leak | judge | leak | — |
| Kalyna | 0 | 3 | 1 | 0.21 | heisenbug | judge | heisenbug | — |
| Adiantum | 2 | 0 | 0 | 0.20 | heisenbug | judge | heisenbug | — |
| Deoxys | 0 | 5 | 0 | 0.16 | heisenbug | judge | heisenbug | — |
| Twofish | 0 | 0 | 3 | 0.16 | womm | pin | — | — |
| Anubis | 0 | 1 | 1 | 0.14 | heisenbug | judge | heisenbug | — |
| Hierocrypt | 0 | 1 | 1 | 0.14 | heisenbug | judge | heisenbug | — |
| KHAZAD | 0 | 3 | 0 | 0.13 | heisenbug | judge | heisenbug | — |
| Crypton | 0 | 3 | 0 | 0.13 | heisenbug | judge | heisenbug | — |
| XXTEA | 0 | 3 | 0 | 0.13 | race | judge | race | — |
| FEAL | 0 | 2 | 0 | 0.10 | race | judge | race | — |
| RC2 | 0 | 0 | 1 | 0.08 | npe | judge | npe | — |
| Lucifer | 0 | 0 | 1 | 0.08 | race | judge | race | — |
| CAST-256 | 0 | 1 | 0 | 0.06 | race | judge | race | — |
| Threefish | 0 | 1 | 0 | 0.06 | race | judge | race | — |
| MARS | 0 | 1 | 0 | 0.06 | race | judge | race | — |
| REDOC | 0 | 1 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| GOST 28147-89 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| LOKI97 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| DES-X ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Magenta ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| 3-Way ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Khufu | 0 | 0 | 0 | 0.00 | bitflip | pin | — | — |
| Khafre ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): SEED (counts said npe, now race), TEA (counts said race, now npe), Square (counts said npe, now heisenbug), DEAL (counts said leak, now heisenbug), PRESENT (counts said npe, now race), Simon (counts said npe, now race), PRINCE (counts said leak, now heisenbug), GIFT (counts said leak, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

