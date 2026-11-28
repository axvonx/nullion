# Scoring: stream-cipher (Name a stream cipher)

54 answers (Bit Flip and Works on my machine left out); 3 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (2%) | 1 | 0 |
| npe | 2 (4%) | 2 | 0 |
| leak | 1 (2%) | 1 | 0 |
| race | 0 (0%) | 0 | 0 |
| heisenbug | 50 (93%) | 50 | 0 |

Same tier as today: 54/54 (100%).

## Off-by-one (1)

RC4 4.7 [0c 0q 1f 32s]

## Null pointer exception (2)

One-time pad 4.0* [14207c 13q 0f 0s], ChaCha20 3.3 [0c 0q 0f 0s]

## Memory leak (1)

Turing 0.8 [18c 481q 1f 0s]

## Race condition (0)



## Heisenbug (50)

XChaCha20 2.0 [0c 0q 0f 0s], XSalsa20 1.6 [0c 0q 0f 0s], SEAL 1.4 [59c 0q 0f 0s], ChaCha8 1.4 [0c 0q 0f 0s], Trivium 1.3 [271c 0q 0f 0s], A5/1 1.2 [750c 0q 0f 0s], Dragon 1.2 [16c 0q 0f 0s], ChaCha12 1.2 [0c 0q 0f 0s], Fruit 1.1 [0c 0q 11f 0s], Rabbit 1.1 [105c 0q 3f 0s], Crypto1 1.1 [271c 0q 0f 0s], ISAAC 1.1 [136c 0q 2f 0s], Phelix 1.0 [53c 0q 0f 0s], Scream 1.0* [19c 0q 0f 0s], SNOW 3G 1.0 [0c 0q 9f 0s], Grain 1.0 [0c 0q 2f 0s], A5/2 1.0 [132c 0q 0f 0s], LEX 0.9 [0c 0q 0f 0s], E0 0.9 [147c 0q 0f 0s], WG 0.8 [0c 0q 0f 0s], Grain-128 0.8 [0c 0q 0f 0s], Content Scramble System 0.8 [1115c 0q 0f 0s], RC4A 0.7 [0c 0q 0f 0s], Shrinking generator 0.7 [63c 0q 0f 0s], HC-128 0.7 [0c 0q 0f 0s], SNOW 2.0 0.7 [0c 0q 0f 0s], HC-256 0.7 [0c 0q 0f 0s], Spritz 0.7 [0c 0q 1f 0s], Panama 0.7 [66c 0q 0f 0s], Alternating step generator 0.6 [29c 0q 0f 0s], Helix 0.6 [0c 0q 1f 0s], SOBER-128 0.6 [13c 0q 1f 0s], DECIM 0.6 [12c 0q 0f 0s], CryptMT 0.6 [72c 0q 0f 0s], ZUC 0.6 [111c 0q 0f 0s], WAKE 0.6 [0c 0q 1f 0s], Sprout 0.5 [0c 0q 0f 0s], Lizard 0.5 [0c 0q 0f 0s], Achterbahn 0.5 [48c 0q 0f 0s], SNOW-V 0.5 [0c 0q 0f 0s], VMPC 0.5 [0c 0q 0f 0s], SOSEMANUK 0.4 [74c 0q 0f 0s], Hitag2 0.4 [0c 0q 0f 0s], Plantlet 0.4 [0c 0q 0f 0s], MICKEY 0.3 [21c 0q 2f 0s], MUGI 0.3 [51c 0q 0f 0s], LEVIATHAN 0.3 [24c 0q 1f 0s], KCipher-2 0.3 [0c 0q 0f 0s], F-FCSR 0.1 [43c 0q 0f 0s], Py 0.0* [37c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
