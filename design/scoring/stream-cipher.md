# Scoring: stream-cipher (Name a stream cipher)

54 answers (Bit Flip and Works on my machine left out); 3 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (2%) | 1 | 0 |
| npe | 2 (4%) | 2 | 0 |
| leak | 6 (11%) | 4 | 0 |
| race | 4 (7%) | 7 | 0 |
| heisenbug | 41 (76%) | 40 | 0 |

Same tier as today: 51/54 (94%).

## Off-by-one (1)

RC4 4.7 [2628c 1q 1f]

## Null pointer exception (2)

One-time pad 4.0* [14207c 797q 1f], ChaCha20 3.3 [3454c 0q 0f]

## Memory leak (6)

SEAL 1.4 [59c 80q 0f], SNOW 3G 1.0 [170c 126q 9f], LEX 0.9 [0c 1828q 0f], Turing 0.8 [18c 481q 1f], Helix 0.6 [0c 91q 1f], Py 0.0* [37c 2192438q 1f]

## Race condition (4)

XChaCha20 2.0 [3454c 0q 0f], XSalsa20 1.6 [3454c 0q 0f], ChaCha8 1.4 [3454c 0q 0f], ChaCha12 1.2 [3454c 0q 0f]

## Heisenbug (41)

Trivium 1.3 [271c 0q 0f], A5/1 1.2 [750c 0q 0f], Dragon 1.2 [16c 0q 0f], Fruit 1.1 [0c 0q 11f], Rabbit 1.1 [105c 0q 3f], Crypto1 1.1 [271c 0q 0f], ISAAC 1.1 [136c 0q 2f], Phelix 1.0 [53c 0q 0f], Scream 1.0* [19c 0q 0f], Grain 1.0 [74c 0q 2f], A5/2 1.0 [132c 0q 0f], E0 0.9 [147c 0q 0f], WG 0.8 [0c 0q 0f], Grain-128 0.8 [74c 0q 0f], Content Scramble System 0.8 [1115c 0q 0f], RC4A 0.7 [2628c 0q 0f], Shrinking generator 0.7 [63c 0q 0f], HC-128 0.7 [64c 0q 0f], SNOW 2.0 0.7 [170c 0q 0f], Spritz 0.7 [2628c 0q 1f], HC-256 0.7 [64c 0q 0f], Panama 0.7 [66c 0q 0f], Alternating step generator 0.6 [29c 0q 0f], SOBER-128 0.6 [13c 0q 1f], DECIM 0.6 [12c 0q 0f], CryptMT 0.6 [72c 0q 0f], ZUC 0.6 [111c 0q 0f], WAKE 0.6 [0c 5q 1f], Sprout 0.5 [0c 0q 0f], Lizard 0.5 [0c 0q 0f], Achterbahn 0.5 [48c 0q 0f], SNOW-V 0.5 [170c 0q 0f], VMPC 0.5 [2628c 0q 0f], SOSEMANUK 0.4 [74c 0q 0f], Hitag2 0.4 [0c 0q 0f], Plantlet 0.4 [0c 0q 0f], MICKEY 0.3 [21c 0q 2f], MUGI 0.3 [51c 0q 0f], LEVIATHAN 0.3 [24c 0q 1f], KCipher-2 0.3 [0c 0q 0f], F-FCSR 0.1 [43c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
