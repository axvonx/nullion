# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: hash.

## non-cryptographic-hash-function

62 candidates; 41 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| MD5 | 5 | 35 | 28 | 1.00 | off-by-one | counts | off-by-one | — |
| SHA-1 | 4 | 33 | 19 | 0.98 | off-by-one | counts | off-by-one | — |
| SHA-3 | 1 | 33 | 20 | 0.88 | npe | counts | off-by-one | — |
| tabulation hashing | 0 | 19 | 19 | 0.74 | npe | counts | leak | — |
| BLAKE2 | 2 | 4 | 5 | 0.54 | npe | judge | npe | — |
| RIPEMD | 1 | 11 | 2 | 0.51 | leak | counts | leak | — |
| Rainbow | 0 | 6 | 4 | 0.44 | heisenbug | judge | heisenbug | — |
| SipHash | 8 | 0 | 1 | 0.29 | npe | judge | npe | — |
| fasthash | 0 | 1 | 2 | 0.23 | race | judge | race | — |
| MUM | 0 | 1 | 2 | 0.23 | race | judge | race | — |
| HalftimeHash | 0 | 2 | 1 | 0.22 | heisenbug | judge | heisenbug | — |
| CRC32 | 6 | 0 | 0 | 0.20 | off-by-one | judge | off-by-one | — |
| aHash | 5 | 0 | 0 | 0.20 | leak | judge | leak | — |
| Edon-R | 0 | 3 | 0 | 0.16 | heisenbug | judge | heisenbug | — |
| MurmurHash | 0 | 0 | 2 | 0.15 | womm | pin | — | — |
| CLHash | 0 | 0 | 2 | 0.15 | race | judge | race | — |
| CityHash | 0 | 0 | 1 | 0.09 | npe | judge | npe | — |
| HighwayHash | 0 | 0 | 1 | 0.09 | leak | judge | leak | — |
| UMASH | 0 | 0 | 1 | 0.09 | race | judge | race | — |
| lookup3 | 0 | 1 | 0 | 0.08 | leak | judge | leak | — |
| xxHash ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| CRC64 ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| FarmHash ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| SpookyHash ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| wyhash ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| SeaHash ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| SuperFastHash ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| MetroHash ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MeowHash | 0 | 0 | 0 | 0.00 | bitflip | pin | — | — |
| GxHash ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| rapidhash ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| t1ha ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| komihash ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| VMAC ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Chaskey ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| a5hash ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Discohash ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| falkhash ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FARSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| fhtw ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| floppsyhash ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| hasshe2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| jodyhash ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| k-hashv ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| khash ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| LaneHash ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mir-hash ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mx3 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| o1hash ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| pengyhash ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Pippip ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PMP_Multilinear ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| polymur-hash ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| prvhash ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Rainstorm ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| silicium_hash ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| tifuhash ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| tsip ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| w1hash ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| xmsx ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| aesni-hash ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| beamsplitter ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): none

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

