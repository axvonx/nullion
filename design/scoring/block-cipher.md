# Scoring: block-cipher (Name a block cipher)

54 answers (Bit Flip and Works on my machine left out); 2 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (4%) | 2 | 0 |
| npe | 2 (4%) | 2 | 0 |
| leak | 2 (4%) | 2 | 0 |
| race | 3 (6%) | 3 | 0 |
| heisenbug | 45 (83%) | 45 | 0 |

Same tier as today: 54/54 (100%).

## Off-by-one (2)

AES 5.3 [23310c 433q 0f 0s], DES 4.5 [4939c 0q 0f 0s]

## Null pointer exception (2)

Triple DES 3.7 [2374c 359q 0f 0s], Blowfish 2.9 [1855c 0q 0f 0s]

## Memory leak (2)

MARS 0.8 [0c 46q 12f 0s], REDOC 0.0* [10c 93q 2f 0s]

## Race condition (3)

RC2 1.5 [182c 17q 0f 0s], XTEA 1.4 [619c 14q 0f 0s], XXTEA 1.0 [474c 13q 0f 0s]

## Heisenbug (45)

RC5 1.9 [402c 0q 0f 0s], TEA 1.6 [601c 0q 0f 0s], RC6 1.5 [400c 0q 0f 0s], IDEA 1.5 [341c 0q 0f 0s], Camellia 1.5 [535c 5q 2f 0s], SEED 1.4 [123c 0q 5f 0s], Serpent 1.4 [532c 0q 3f 0s], CAST-128 1.3 [129c 0q 0f 0s], E2 1.2 [47c 0q 0f 0s], PRESENT 1.1 [257c 0q 2f 0s], Speck 1.1 [506c 0q 0f 0s], DEAL 1.1 [34c 0q 4f 0s], GOST 28147-89 1.0 [617c 0q 10f 0s], LEA 1.0* [148c 0q 0f 0s], Square 1.0 [149c 0q 0f 0s], CAST-256 1.0 [70c 0q 0f 0s], SAFER 1.0 [0c 0q 0f 0s], SM4 0.9 [515c 0q 0f 0s], ARIA 0.8 [115c 0q 1f 0s], Skipjack 0.8 [428c 0q 0f 0s], Threefish 0.7 [412c 0q 0f 0s], PRINCE 0.7 [0c 0q 5f 0s], FEAL 0.7 [109c 0q 0f 0s], MISTY1 0.7 [75c 0q 0f 0s], Kuznyechik 0.7 [547c 0q 0f 0s], CLEFIA 0.7 [39c 0q 0f 0s], Simon 0.7 [306c 0q 2f 0s], DES-X 0.7 [197c 0q 0f 0s], Lucifer 0.7 [391c 0q 0f 0s], Khafre 0.7 [0c 0q 0f 0s], KASUMI 0.6 [226c 0q 16f 0s], SKINNY 0.6 [0c 0q 1f 0s], Magenta 0.6 [89c 0q 0f 0s], HIGHT 0.6 [0c 0q 0f 0s], NOEKEON 0.6 [22c 0q 0f 0s], Crypton 0.5 [0c 0q 0f 0s], KHAZAD 0.5 [41c 0q 0f 0s], Anubis 0.5 [182c 0q 0f 0s], GIFT 0.4 [0c 0q 6f 0s], 3-Way 0.4 [73c 0q 0f 0s], Adiantum 0.4 [204c 0q 0f 0s], Kalyna 0.4 [132c 0q 0f 0s], LOKI97 0.4 [69c 0q 0f 0s], Hierocrypt 0.4 [0c 0q 0f 0s], Deoxys 0.4 [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
