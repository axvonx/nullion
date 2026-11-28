# Scoring: historical-cipher (Name a historical cipher)

33 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (6%) | 1 | 0 |
| npe | 7 (21%) | 20 | 0 |
| leak | 1 (3%) | 3 | 0 |
| race | 4 (12%) | 5 | 0 |
| heisenbug | 19 (58%) | 4 | 0 |

Same tier as today: 7/33 (21%).

## Off-by-one (2)

Caesar cipher 5.8 [17380c 794q 1f], Enigma 4.8 [46104c 0q 0f]

## Null pointer exception (7)

Vigenère cipher 4.0 [15995c 350q 1f], Simple substitution 4.0* [5678c 0q 0f], One-time pad 3.4 [14207c 797q 1f], Playfair cipher 2.8 [3880c 0q 0f], Columnar transposition 2.5 [2507c 0q 0f], Affine cipher 2.2 [899c 0q 0f], Polybius square 2.1 [2851c 0q 0f]

## Memory leak (1)

Gronsfeld cipher 0.8 [15995c 0q 0f]

## Race condition (4)

Pigpen cipher 1.9 [9833c 0q 0f], Baconian cipher 1.9 [3044c 0q 0f], Autokey cipher 1.7 [1012c 96q 11f], Lorenz cipher 1.3 [7605c 0q 0f]

## Heisenbug (19)

Hill cipher 1.7 [1711c 0q 0f], Book cipher 1.7 [2106c 0q 0f], Scytale 1.6 [2614c 0q 0f], Beaufort cipher 1.3 [460c 0q 0f], Running key cipher 1.3 [511c 0q 0f], ADFGX 1.3 [1267c 0q 0f], Jefferson wheel cipher 1.3 [660c 0q 0f], Four-square cipher 1.2 [467c 0q 0f], Alberti cipher 1.2 [718c 0q 0f], Cardan grille 1.1 [708c 0q 0f], Purple cipher 1.1 [2378c 0q 0f], Bifid cipher 1.1 [661c 0q 0f], VIC cipher 0.9 [739c 0q 2f], Nihilist cipher 0.9 [812c 0q 0f], Bazeries cylinder 0.8 [0c 0q 0f], Porta cipher 0.8 [0c 0q 3f], Fractionated Morse 0.7 [0c 0q 0f], Hebern machine 0.6 [135c 0q 0f], patristocrat 0.6 [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
