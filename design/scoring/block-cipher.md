# Scoring: block-cipher (Name a block cipher)

54 answers (Bit Flip and Works on my machine left out); 2 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (4%) | 2 | 0 |
| npe | 2 (4%) | 5 | 0 |
| leak | 5 (9%) | 9 | 0 |
| race | 4 (7%) | 21 | 0 |
| heisenbug | 41 (76%) | 17 | 0 |

Same tier as today: 19/54 (35%).

## Off-by-one (2)

AES 5.3 [23310c 7359q 2f], DES 4.5 [4939c 653q 0f]

## Null pointer exception (2)

Triple DES 3.7 [2374c 359q 0f], Blowfish 2.9 [1855c 463q 0f]

## Memory leak (5)

IDEA 1.5 [341c 240q 0f], SEED 1.4 [123c 631q 5f], Square 1.0 [149c 659q 0f], ARIA 0.8 [115c 1448q 1f], KASUMI 0.6 [226c 0q 16f]

## Race condition (4)

GOST 28147-89 1.0 [617c 41q 10f], MARS 0.8 [0c 46q 12f], Magenta 0.6 [89c 64q 0f], REDOC 0.0* [10c 93q 2f]

## Heisenbug (41)

RC5 1.9 [402c 0q 0f], TEA 1.6 [601c 0q 0f], RC6 1.5 [400c 0q 0f], RC2 1.5 [182c 17q 0f], Camellia 1.5 [535c 5q 2f], Serpent 1.4 [532c 2q 3f], XTEA 1.4 [619c 14q 0f], CAST-128 1.3 [129c 0q 0f], E2 1.2 [47c 0q 0f], PRESENT 1.1 [257c 0q 2f], Speck 1.1 [506c 0q 0f], DEAL 1.1 [34c 0q 4f], XXTEA 1.0 [474c 13q 0f], LEA 1.0* [148c 0q 0f], CAST-256 1.0 [70c 0q 0f], SAFER 1.0 [0c 0q 0f], SM4 0.9 [515c 0q 0f], Skipjack 0.8 [428c 0q 0f], Threefish 0.7 [412c 0q 0f], PRINCE 0.7 [0c 0q 5f], FEAL 0.7 [109c 0q 0f], MISTY1 0.7 [75c 0q 0f], Kuznyechik 0.7 [547c 0q 0f], CLEFIA 0.7 [39c 0q 0f], Simon 0.7 [306c 0q 2f], DES-X 0.7 [197c 0q 0f], Lucifer 0.7 [391c 0q 0f], Khafre 0.7 [85c 0q 0f], SKINNY 0.6 [0c 0q 1f], HIGHT 0.6 [0c 0q 0f], NOEKEON 0.6 [22c 0q 0f], Crypton 0.5 [0c 0q 0f], KHAZAD 0.5 [41c 0q 0f], Anubis 0.5 [182c 0q 0f], GIFT 0.4 [0c 6q 6f], 3-Way 0.4 [73c 0q 0f], Adiantum 0.4 [204c 0q 0f], Kalyna 0.4 [132c 0q 0f], LOKI97 0.4 [69c 0q 0f], Hierocrypt 0.4 [0c 0q 0f], Deoxys 0.4 [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
