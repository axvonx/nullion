# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: hash.

## cryptographic-hash-function

49 candidates; 5 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| MD5 | 5 | 35 | 28 | 1.00 | off-by-one | counts | off-by-one | — |
| SHA-256 | 11 | 27 | 68 | 0.98 | off-by-one | counts | off-by-one | — |
| SHA-1 | 4 | 33 | 19 | 0.93 | off-by-one | counts | off-by-one | — |
| SHA-3 | 1 | 53 | 29 | 0.88 | npe | counts | npe | — |
| LSH ⚠ counts said npe | 0 | 30 | 269 | 0.79 | heisenbug | judge (override) | heisenbug | — |
| SHA-2 | 2 | 19 | 8 | 0.72 | npe | counts | npe | — |
| SHA-512 | 3 | 10 | 6 | 0.66 | npe | counts | npe | — |
| SM3 ⚠ counts said npe | 2 | 18 | 3 | 0.62 | race | judge (override) | race | — |
| ECHO | 2 | 7 | 6 | 0.59 | heisenbug | judge | heisenbug | — |
| BLAKE2b | 2 | 4 | 5 | 0.52 | leak | judge | leak | — |
| N-Hash | 7 | 1 | 6 | 0.51 | heisenbug | judge | heisenbug | — |
| RIPEMD-160 | 1 | 11 | 2 | 0.49 | leak | counts | leak | — |
| BLAKE | 0 | 14 | 3 | 0.47 | leak | counts | leak | — |
| MD4 | 0 | 11 | 3 | 0.44 | leak | counts | leak | — |
| BLAKE2s | 1 | 4 | 2 | 0.39 | leak | judge | leak | — |
| Whirlpool | 0 | 20 | 0 | 0.35 | womm | pin | — | — |
| HAVAL | 0 | 4 | 2 | 0.31 | race | judge | race | — |
| BLAKE3 | 0 | 1 | 5 | 0.29 | npe | judge | npe | — |
| Skein | 0 | 5 | 1 | 0.28 | race | judge | race | — |
| Fugue | 0 | 5 | 1 | 0.28 | heisenbug | judge | heisenbug | — |
| Groestl | 0 | 11 | 0 | 0.28 | race | counts | race | — |
| Streebog | 0 | 4 | 1 | 0.26 | heisenbug | judge | heisenbug | — |
| Ascon-Hash | 0 | 8 | 0 | 0.25 | heisenbug | judge | heisenbug | — |
| JH | 0 | 7 | 0 | 0.24 | race | judge | race | — |
| Blue Midnight Wish | 0 | 7 | 0 | 0.24 | heisenbug | judge | heisenbug | — |
| MD2 | 0 | 2 | 1 | 0.21 | race | judge | race | — |
| SHA-0 | 0 | 2 | 1 | 0.21 | race | judge | race | — |
| CubeHash | 0 | 2 | 1 | 0.21 | heisenbug | judge | heisenbug | — |
| Xoodyak | 0 | 2 | 1 | 0.21 | heisenbug | judge | heisenbug | — |
| Luffa | 0 | 5 | 0 | 0.20 | heisenbug | judge | heisenbug | — |
| Gimli | 0 | 5 | 0 | 0.20 | heisenbug | judge | heisenbug | — |
| SHA-224 | 1 | 2 | 0 | 0.20 | leak | judge | leak | — |
| Tiger | 0 | 4 | 0 | 0.18 | race | judge | race | — |
| FORK-256 | 0 | 3 | 0 | 0.16 | heisenbug | judge | heisenbug | — |
| RadioGatun | 0 | 3 | 0 | 0.16 | bitflip | pin | — | — |
| SWIFFT | 0 | 3 | 0 | 0.16 | heisenbug | judge | heisenbug | — |
| SHA-384 | 3 | 0 | 0 | 0.15 | leak | judge | leak | — |
| MD6 | 0 | 2 | 0 | 0.12 | race | judge | race | — |
| Shabal | 0 | 2 | 0 | 0.12 | heisenbug | judge | heisenbug | — |
| SHAvite-3 | 0 | 2 | 0 | 0.12 | heisenbug | judge | heisenbug | — |
| KangarooTwelve | 0 | 2 | 0 | 0.12 | heisenbug | judge | heisenbug | — |
| RIPEMD-128 | 0 | 2 | 0 | 0.12 | race | judge | race | — |
| GOST R 34.11-94 | 0 | 1 | 0 | 0.08 | race | judge | race | — |
| Snefru | 0 | 1 | 0 | 0.08 | heisenbug | judge | heisenbug | — |
| Hamsi | 0 | 1 | 0 | 0.08 | heisenbug | judge | heisenbug | — |
| Panama | 0 | 1 | 0 | 0.08 | heisenbug | judge | heisenbug | — |
| MDC-2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| RIPEMD-320 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SHA-512/256 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): SM3 (counts said npe, now race), LSH (counts said npe, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

