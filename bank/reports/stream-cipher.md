# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: stream cipher, cipher.

## stream-cipher

51 candidates; 9 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| Grain ⚠ counts said npe | 0 | 58 | 11 | 0.80 | race | judge (override) | race | — |
| Trivium ⚠ counts said npe | 0 | 38 | 9 | 0.80 | race | judge (override) | race | — |
| ChaCha20 | 2 | 25 | 14 | 0.76 | npe | counts | off-by-one | — |
| RC4 | 0 | 57 | 6 | 0.74 | npe | counts | off-by-one | — |
| A5/1 | 0 | 10 | 5 | 0.57 | npe | counts | leak | — |
| ZUC | 0 | 17 | 3 | 0.56 | leak | counts | race | — |
| WG ⚠ counts said leak | 0 | 27 | 2 | 0.55 | heisenbug | judge (override) | heisenbug | — |
| Rabbit | 0 | 12 | 2 | 0.47 | leak | counts | race | — |
| E0 | 0 | 12 | 2 | 0.47 | leak | counts | race | — |
| DECIM | 0 | 4 | 4 | 0.46 | heisenbug | judge | heisenbug | — |
| Salsa20 | 0 | 10 | 2 | 0.45 | womm | pin | — | — |
| SNOW 3G | 0 | 5 | 3 | 0.44 | race | judge | race | — |
| SNOW 2.0 | 0 | 3 | 4 | 0.43 | heisenbug | judge | heisenbug | — |
| MICKEY | 0 | 13 | 1 | 0.41 | leak | counts | race | — |
| SNOW-V | 0 | 9 | 1 | 0.37 | heisenbug | judge | heisenbug | — |
| SOSEMANUK | 0 | 4 | 2 | 0.37 | race | judge | race | — |
| Grain-128 | 0 | 7 | 1 | 0.35 | race | judge | race | — |
| Py | 0 | 7 | 1 | 0.35 | heisenbug | judge | heisenbug | — |
| Spritz | 0 | 6 | 1 | 0.33 | race | judge | race | — |
| Dragon | 0 | 5 | 1 | 0.32 | heisenbug | judge | heisenbug | — |
| HC-128 | 0 | 4 | 1 | 0.30 | race | judge | race | — |
| Turing | 0 | 3 | 1 | 0.27 | heisenbug | judge | heisenbug | — |
| Hitag2 | 0 | 3 | 1 | 0.27 | heisenbug | judge | heisenbug | — |
| Fruit | 0 | 11 | 0 | 0.27 | race | counts | heisenbug | — |
| Achterbahn | 0 | 1 | 2 | 0.27 | heisenbug | judge | heisenbug | — |
| SEAL | 0 | 0 | 3 | 0.24 | heisenbug | judge | heisenbug | — |
| F-FCSR | 0 | 7 | 0 | 0.23 | heisenbug | judge | heisenbug | — |
| VMPC | 0 | 6 | 0 | 0.21 | heisenbug | judge | heisenbug | — |
| LEX | 0 | 6 | 0 | 0.21 | heisenbug | judge | heisenbug | — |
| ChaCha8 | 0 | 1 | 1 | 0.20 | race | judge | race | — |
| WAKE | 0 | 1 | 1 | 0.20 | heisenbug | judge | heisenbug | — |
| Scream | 0 | 5 | 0 | 0.20 | heisenbug | judge | heisenbug | — |
| MUGI | 0 | 5 | 0 | 0.20 | heisenbug | judge | heisenbug | — |
| Plantlet | 0 | 5 | 0 | 0.20 | heisenbug | judge | heisenbug | — |
| Lizard | 0 | 4 | 0 | 0.18 | heisenbug | judge | heisenbug | — |
| HC-256 | 0 | 3 | 0 | 0.15 | race | judge | race | — |
| Sprout | 0 | 3 | 0 | 0.15 | heisenbug | judge | heisenbug | — |
| Lorenz cipher | 0 | 3 | 0 | 0.15 | bitflip | pin | — | — |
| ISAAC | 0 | 0 | 1 | 0.12 | race | judge | race | — |
| Crypto1 | 0 | 0 | 1 | 0.12 | race | judge | race | — |
| LEVIATHAN | 0 | 2 | 0 | 0.12 | heisenbug | judge | heisenbug | — |
| CryptMT | 0 | 2 | 0 | 0.12 | heisenbug | judge | heisenbug | — |
| Phelix | 0 | 1 | 0 | 0.08 | heisenbug | judge | heisenbug | — |
| Helix | 0 | 1 | 0 | 0.08 | heisenbug | judge | heisenbug | — |
| Panama | 0 | 1 | 0 | 0.08 | heisenbug | judge | heisenbug | — |
| XSalsa20 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| XChaCha20 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ChaCha12 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| A5/2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| KCipher-2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Content Scramble System ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): Grain (counts said npe, now race), Trivium (counts said npe, now race), WG (counts said leak, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

