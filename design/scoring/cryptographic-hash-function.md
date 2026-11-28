# Scoring: cryptographic-hash-function (Name a cryptographic hash function)

51 answers (Bit Flip and Works on my machine left out); 3 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 4 (8%) | 4 | 0 |
| npe | 5 (10%) | 5 | 0 |
| leak | 3 (6%) | 4 | 0 |
| race | 10 (20%) | 6 | 0 |
| heisenbug | 29 (57%) | 32 | 0 |

Same tier as today: 47/51 (92%).

## Off-by-one (4)

MD5 5.5 [10690c 4219q 3f], SHA-256 5.4 [16405c 1984q 0f], SHA-1 5.2 [7738c 2167q 0f], SHA-2 4.5 [16405c 151q 5f]

## Null pointer exception (5)

SHA-512 4.2 [16405c 465q 0f], SHA3-256 2.6 [5747c 0q 0f], SHA-3 2.4 [5747c 81q 0f], SHA-224 2.1 [16405c 0q 0f], SHA3-512 2.1 [5747c 0q 0f]

## Memory leak (3)

SHA-384 2.0 [16405c 0q 0f], SHA-512/256 1.2 [16405c 0q 0f], ECHO 0.0* [0c 6437q 3f]

## Race condition (10)

BLAKE2b 2.0 [3020c 0q 5f], BLAKE 1.6 [3020c 0q 0f], BLAKE3 1.6 [3020c 0q 39f], RIPEMD-160 1.5 [501c 24q 0f], BLAKE2s 1.4 [3020c 0q 0f], SHAKE256 1.1 [5747c 0q 0f], SHAKE128 1.0 [5747c 0q 0f], Tiger 1.0 [287c 23q 3f], LSH 1.0* [43c 47q 4f], SHA-0 0.5 [7738c 0q 0f]

## Heisenbug (29)

MD4 1.5 [677c 0q 0f], MD2 1.3 [405c 5q 0f], SM3 1.1 [234c 0q 0f], HAVAL 1.0 [108c 0q 0f], Skein 1.0 [196c 10q 0f], RIPEMD-128 0.9 [501c 0q 0f], Groestl 0.8 [70c 0q 0f], RIPEMD-320 0.7 [501c 0q 0f], Snefru 0.7 [73c 0q 0f], FORK-256 0.7 [0c 0q 0f], MD6 0.7 [570c 0q 0f], N-Hash 0.6 [0c 0q 0f], Panama 0.6 [66c 0q 0f], Fugue 0.6 [12c 3q 0f], JH 0.6 [305c 0q 1f], GOST R 34.11-94 0.6 [156c 0q 0f], Streebog 0.6 [290c 0q 1f], CubeHash 0.5 [63c 0q 0f], Gimli 0.5 [0c 1q 0f], Ascon-Hash 0.5 [0c 0q 0f], KangarooTwelve 0.4 [0c 0q 0f], SWIFFT 0.4 [110c 0q 0f], Blue Midnight Wish 0.3 [0c 0q 0f], SHAvite-3 0.3 [0c 0q 0f], Hamsi 0.3 [0c 0q 0f], Xoodyak 0.3 [0c 0q 0f], MDC-2 0.3 [66c 0q 0f], Shabal 0.2 [0c 0q 0f], Luffa 0.0* [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
