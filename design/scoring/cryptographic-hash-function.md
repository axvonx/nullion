# Scoring: cryptographic-hash-function (Name a cryptographic hash function)

51 answers (Bit Flip and Works on my machine left out); 3 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 4 (8%) | 4 | 0 |
| npe | 5 (10%) | 5 | 0 |
| leak | 1 (2%) | 1 | 0 |
| race | 1 (2%) | 1 | 0 |
| heisenbug | 40 (78%) | 40 | 0 |

Same tier as today: 51/51 (100%).

## Off-by-one (4)

MD5 5.5 [10690c 0q 0f 0s], SHA-256 5.4 [0c 1984q 0f 0s], SHA-1 5.2 [0c 2167q 0f 0s], SHA-2 4.5 [0c 151q 5f 62s]

## Null pointer exception (5)

SHA-512 4.2 [0c 465q 0f 0s], SHA3-256 2.6 [0c 0q 0f 0s], SHA-3 2.4 [0c 81q 0f 0s], SHA-224 2.1 [0c 0q 0f 0s], SHA3-512 2.1 [0c 0q 0f 0s]

## Memory leak (1)

BLAKE3 1.6 [0c 0q 39f 6540s]

## Race condition (1)

RIPEMD-160 1.5 [0c 24q 0f 0s]

## Heisenbug (40)

BLAKE2b 2.0 [0c 0q 5f 0s], SHA-384 2.0 [0c 0q 0f 0s], BLAKE 1.6 [0c 0q 0f 0s], MD4 1.5 [677c 0q 0f 0s], BLAKE2s 1.4 [0c 0q 0f 0s], MD2 1.3 [405c 0q 0f 0s], SHA-512/256 1.2 [0c 0q 0f 0s], SHAKE256 1.1 [0c 0q 0f 0s], SM3 1.1 [234c 0q 0f 0s], Tiger 1.0 [287c 0q 3f 0s], SHAKE128 1.0 [0c 0q 0f 0s], LSH 1.0* [43c 0q 0f 0s], HAVAL 1.0 [108c 0q 0f 0s], Skein 1.0 [196c 0q 0f 0s], RIPEMD-128 0.9 [0c 0q 0f 0s], Groestl 0.8 [70c 0q 0f 0s], RIPEMD-320 0.7 [0c 0q 0f 0s], Snefru 0.7 [73c 0q 0f 0s], FORK-256 0.7 [0c 0q 0f 0s], MD6 0.7 [570c 0q 0f 0s], N-Hash 0.6 [0c 0q 0f 0s], Panama 0.6 [66c 0q 0f 0s], Fugue 0.6 [12c 0q 0f 0s], JH 0.6 [305c 0q 0f 0s], GOST R 34.11-94 0.6 [156c 0q 0f 0s], Streebog 0.6 [290c 0q 1f 0s], CubeHash 0.5 [63c 0q 0f 0s], Gimli 0.5 [0c 1q 0f 0s], Ascon-Hash 0.5 [0c 0q 0f 0s], SHA-0 0.5 [0c 0q 0f 0s], KangarooTwelve 0.4 [0c 0q 0f 0s], SWIFFT 0.4 [110c 0q 0f 0s], Blue Midnight Wish 0.3 [0c 0q 0f 0s], SHAvite-3 0.3 [0c 0q 0f 0s], Hamsi 0.3 [0c 0q 0f 0s], Xoodyak 0.3 [0c 0q 0f 0s], MDC-2 0.3 [66c 0q 0f 0s], Shabal 0.2 [0c 0q 0f 0s], Luffa 0.0* [0c 0q 0f 0s], ECHO 0.0* [0c 0q 3f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
