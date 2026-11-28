# Scoring: non-cryptographic-hash-function (Name a non-cryptographic hash function)

73 answers (Bit Flip and Works on my machine left out); 5 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (3%) | 2 | 0 |
| npe | 8 (11%) | 8 | 0 |
| leak | 1 (1%) | 1 | 0 |
| race | 5 (7%) | 5 | 0 |
| heisenbug | 57 (78%) | 57 | 0 |

Same tier as today: 73/73 (100%).

## Off-by-one (2)

CRC32 4.0 [0c 589q 17f 0s], MD5 3.0* [10690c 0q 0f 0s]

## Null pointer exception (8)

SHA-256 3.0* [0c 1984q 0f 0s], CRC64 2.9 [0c 21q 0f 0s], xxHash 2.5 [0c 0q 55f 11461s], djb2 2.4 [0c 0q 0f 0s], Adler-32 2.2 [672c 39q 0f 0s], FNV-1a 2.2 [0c 0q 0f 0s], SHA-1 2.0* [7738c 2167q 0f 0s], Rabin-Karp rolling hash 2.0 [0c 0q 0f 0s]

## Memory leak (1)

SHA-3 1.1 [5747c 81q 0f 0s]

## Race condition (5)

CityHash 1.8 [0c 0q 11f 1229s], HighwayHash 1.2 [0c 0q 5f 1603s], wyhash 1.1 [0c 0q 6f 1161s], SipHash 0.8 [1663c 0q 0f 0s], RIPEMD 0.7 [501c 24q 0f 0s]

## Heisenbug (57)

FNV-1 1.8 [0c 0q 0f 0s], sdbm 1.7 [0c 0q 1f 0s], FarmHash 1.7 [0c 0q 10f 663s], lookup3 1.6 [634c 0q 0f 0s], Fletcher's checksum 1.4 [690c 0q 0f 0s], fasthash 1.3 [0c 0q 0f 0s], Pearson hashing 1.2 [220c 0q 0f 0s], PJW hash 1.1 [111c 0q 0f 0s], Buzhash 1.1 [0c 0q 0f 0s], SpookyHash 1.1 [0c 0q 1f 0s], SuperFastHash 1.1 [0c 0q 0f 0s], BLAKE2 1.0 [0c 0q 5f 0s], MetroHash 1.0 [0c 0q 4f 376s], aHash 1.0 [0c 0q 0f 0s], Zobrist hashing 1.0 [887c 0q 0f 0s], fhtw 0.9 [0c 0q 0f 0s], komihash 0.9 [0c 0q 1f 289s], SeaHash 0.9 [0c 0q 0f 0s], UMASH 0.8 [0c 0q 0f 0s], o1hash 0.8 [0c 0q 0f 0s], FxHash 0.8 [0c 0q 0f 0s], w1hash 0.8 [0c 0q 0f 0s], khash 0.7 [0c 0q 0f 0s], tabulation hashing 0.7 [164c 0q 0f 0s], rapidhash 0.7 [0c 0q 4f 936s], t1ha 0.7 [0c 0q 0f 0s], tifuhash 0.7 [0c 0q 0f 0s], Pippip 0.7 [0c 0q 0f 0s], Rainstorm 0.6 [0c 0q 0f 0s], mir-hash 0.6 [0c 0q 0f 0s], polymur-hash 0.6 [0c 0q 0f 0s], mx3 0.6 [0c 0q 0f 0s], a5hash 0.6 [0c 0q 0f 0s], xmsx 0.6 [0c 0q 0f 0s], Rainbow 0.6 [0c 0q 0f 0s], CLHash 0.6 [0c 0q 0f 0s], k-hashv 0.6 [0c 0q 0f 0s], falkhash 0.6 [0c 0q 0f 0s], tsip 0.6 [0c 0q 1f 0s], HalftimeHash 0.5 [0c 0q 0f 0s], GxHash 0.5 [0c 0q 0f 0s], MUM 0.5 [0c 0q 1f 165s], Chaskey 0.4 [0c 0q 0f 0s], pengyhash 0.4 [0c 0q 0f 0s], floppsyhash 0.3 [0c 0q 0f 0s], prvhash 0.3 [0c 0q 1f 330s], jodyhash 0.3 [0c 0q 0f 0s], Discohash 0.3 [0c 0q 0f 0s], LaneHash 0.3 [0c 0q 0f 0s], silicium_hash 0.3 [0c 0q 0f 0s], PMP_Multilinear 0.3 [0c 0q 0f 0s], Edon-R 0.2 [0c 0q 0f 0s], aesni-hash 0.2 [0c 0q 0f 0s], VMAC 0.2 [117c 0q 0f 0s], beamsplitter 0.2 [0c 0q 0f 0s], FARSH 0.0* [0c 0q 0f 0s], hasshe2 0.0* [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
