# Scoring: historical-cipher (Name a historical cipher)

33 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (6%) | 2 | 0 |
| npe | 7 (21%) | 7 | 0 |
| leak | 3 (9%) | 3 | 0 |
| race | 5 (15%) | 5 | 0 |
| heisenbug | 16 (48%) | 16 | 0 |

Same tier as today: 33/33 (100%).

## Off-by-one (2)

Caesar cipher 5.8 [17380c 794q 1f 0s], Enigma 4.8 [46104c 0q 0f 0s]

## Null pointer exception (7)

Vigenère cipher 4.0 [0c 350q 1f 0s], Simple substitution 4.0* [5678c 0q 0f 0s], One-time pad 3.4 [14207c 13q 0f 0s], Playfair cipher 2.8 [3880c 0q 0f 0s], Columnar transposition 2.5 [0c 0q 0f 0s], Affine cipher 2.2 [899c 0q 0f 0s], Polybius square 2.1 [2851c 0q 0f 0s]

## Memory leak (3)

Pigpen cipher 1.9 [9833c 0q 0f 0s], Autokey cipher 1.7 [1012c 96q 11f 0s], Lorenz cipher 1.3 [7605c 0q 0f 0s]

## Race condition (5)

Baconian cipher 1.9 [3044c 0q 0f 0s], Hill cipher 1.7 [1711c 0q 0f 0s], Book cipher 1.7 [2106c 0q 0f 0s], Scytale 1.6 [2614c 0q 0f 0s], Purple cipher 1.1 [2378c 0q 0f 0s]

## Heisenbug (16)

Beaufort cipher 1.3 [460c 0q 0f 0s], Running key cipher 1.3 [511c 0q 0f 0s], ADFGX 1.3 [0c 0q 0f 0s], Jefferson wheel cipher 1.3 [660c 0q 0f 0s], Four-square cipher 1.2 [467c 0q 0f 0s], Alberti cipher 1.2 [718c 0q 0f 0s], Cardan grille 1.1 [708c 0q 0f 0s], Bifid cipher 1.1 [661c 0q 0f 0s], VIC cipher 0.9 [739c 0q 0f 0s], Nihilist cipher 0.9 [812c 0q 0f 0s], Gronsfeld cipher 0.8 [0c 0q 0f 0s], Bazeries cylinder 0.8 [0c 0q 0f 0s], Porta cipher 0.8 [0c 0q 3f 0s], Fractionated Morse 0.7 [0c 0q 0f 0s], Hebern machine 0.6 [135c 0q 0f 0s], patristocrat 0.6 [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
