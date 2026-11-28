# Scoring: non-cryptographic-hash-function (Name a non-cryptographic hash function)

73 answers (Bit Flip and Works on my machine left out); 5 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (3%) | 8 | 0 |
| npe | 8 (11%) | 16 | 0 |
| leak | 1 (1%) | 8 | 0 |
| race | 4 (5%) | 10 | 0 |
| heisenbug | 58 (79%) | 31 | 0 |

Same tier as today: 35/73 (48%).

## Off-by-one (2)

CRC32 4.0 [13755c 1183q 17f], MD5 3.0* [10690c 4219q 3f]

## Null pointer exception (8)

SHA-256 3.0* [0c 1984q 0f], CRC64 2.9 [13755c 21q 0f], xxHash 2.5 [0c 0q 55f], djb2 2.4 [0c 0q 0f], Adler-32 2.2 [672c 39q 0f], FNV-1a 2.2 [4354c 22q 1f], SHA-1 2.0* [7738c 2167q 0f], Rabin-Karp rolling hash 2.0 [1325c 0q 0f]

## Memory leak (1)

CityHash 1.8 [0c 169q 11f]

## Race condition (4)

FNV-1 1.8 [4354c 0q 0f], FarmHash 1.7 [0c 0q 10f], SHA-3 1.1 [5747c 81q 0f], BLAKE2 1.0 [3020c 0q 5f]

## Heisenbug (58)

sdbm 1.7 [0c 0q 1f], lookup3 1.6 [634c 0q 0f], Fletcher's checksum 1.4 [690c 0q 0f], fasthash 1.3 [0c 0q 0f], HighwayHash 1.2 [0c 0q 5f], Pearson hashing 1.2 [220c 0q 0f], PJW hash 1.1 [111c 0q 0f], Buzhash 1.1 [1325c 0q 0f], SpookyHash 1.1 [0c 0q 1f], wyhash 1.1 [0c 0q 6f], SuperFastHash 1.1 [0c 0q 0f], MetroHash 1.0 [0c 0q 4f], aHash 1.0 [0c 0q 0f], Zobrist hashing 1.0 [887c 0q 0f], fhtw 0.9 [0c 0q 0f], komihash 0.9 [0c 0q 1f], SeaHash 0.9 [0c 0q 0f], UMASH 0.8 [0c 0q 0f], SipHash 0.8 [1663c 0q 0f], o1hash 0.8 [0c 0q 0f], FxHash 0.8 [0c 0q 0f], w1hash 0.8 [0c 0q 0f], khash 0.7 [0c 0q 0f], tabulation hashing 0.7 [164c 0q 0f], rapidhash 0.7 [0c 0q 4f], t1ha 0.7 [0c 0q 0f], RIPEMD 0.7 [501c 24q 0f], tifuhash 0.7 [0c 0q 0f], Pippip 0.7 [0c 0q 0f], Rainstorm 0.6 [0c 0q 0f], mir-hash 0.6 [0c 0q 0f], polymur-hash 0.6 [0c 0q 0f], mx3 0.6 [0c 0q 1f], a5hash 0.6 [0c 0q 0f], xmsx 0.6 [0c 0q 0f], Rainbow 0.6 [0c 0q 0f], CLHash 0.6 [0c 0q 0f], k-hashv 0.6 [0c 0q 0f], falkhash 0.6 [0c 0q 0f], tsip 0.6 [0c 0q 1f], HalftimeHash 0.5 [0c 0q 0f], GxHash 0.5 [0c 0q 0f], MUM 0.5 [0c 0q 2f], Chaskey 0.4 [0c 0q 0f], pengyhash 0.4 [0c 0q 0f], floppsyhash 0.3 [0c 0q 0f], prvhash 0.3 [0c 0q 1f], jodyhash 0.3 [0c 0q 0f], Discohash 0.3 [0c 0q 0f], LaneHash 0.3 [0c 0q 0f], silicium_hash 0.3 [0c 0q 0f], PMP_Multilinear 0.3 [0c 0q 0f], Edon-R 0.2 [0c 0q 0f], aesni-hash 0.2 [0c 0q 0f], VMAC 0.2 [117c 0q 0f], beamsplitter 0.2 [0c 0q 0f], FARSH 0.0* [0c 0q 0f], hasshe2 0.0* [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
