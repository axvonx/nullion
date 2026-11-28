# Scoring: post-quantum-signature-scheme (Name a post-quantum signature scheme)

44 answers (Bit Flip and Works on my machine left out); 0 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (5%) | 1 | 0 |
| npe | 1 (2%) | 1 | 0 |
| leak | 2 (5%) | 8 | 0 |
| race | 1 (2%) | 13 | 0 |
| heisenbug | 38 (86%) | 21 | 0 |

Same tier as today: 22/44 (50%).

## Off-by-one (2)

ML-DSA 2.5 [0c 0q 1f], SPHINCS 2.2 [0c 0q 0f]

## Null pointer exception (1)

Lamport signature 2.0 [612c 0q 0f]

## Memory leak (2)

Wave 1.3 [0c 505q 3f], LESS 0.9 [0c 7957q 58f]

## Race condition (1)

LMS 1.7 [0c 96q 6f]

## Heisenbug (38)

SLH-DSA 2.0 [0c 0q 0f], Merkle signature scheme 1.9 [569c 36q 0f], HuFu 1.9 [0c 0q 0f], Winternitz one-time signature 1.5 [612c 0q 0f], Rainbow 1.5 [0c 0q 0f], XMSS 1.4 [0c 0q 1f], Picnic 1.2 [0c 0q 0f], Mirath 1.1 [0c 0q 0f], Gravity-SPHINCS 1.1 [0c 0q 0f], qTESLA 1.0 [0c 0q 0f], CROSS 0.9 [0c 0q 2f], BLISS 0.9 [0c 0q 0f], MEDS 0.9 [0c 0q 0f], FuLeeca 0.9 [0c 0q 0f], UOV 0.8 [436c 0q 0f], SDitH 0.8 [0c 0q 0f], XMSS-MT 0.8 [0c 0q 0f], HSS 0.8 [0c 0q 0f], Biscuit 0.8 [0c 0q 3f], RYDE 0.8 [0c 0q 0f], HAWK 0.7 [0c 0q 3f], MAYO 0.7 [0c 0q 5f], GLP 0.7 [0c 0q 0f], SQUIRRELS 0.7 [0c 0q 0f], ALTEQ 0.7 [0c 0q 0f], QR-UOV 0.6 [0c 0q 0f], SOFIA 0.5 [0c 0q 0f], LUOV 0.5 [0c 0q 0f], SNOVA 0.5 [0c 0q 0f], MQOM 0.5 [0c 0q 0f], GeMSS 0.5 [0c 0q 0f], DME-Sign 0.5 [0c 0q 0f], PERK 0.5 [0c 0q 0f], Raccoon 0.4 [0c 0q 3f], FAEST 0.4 [0c 0q 0f], pqsigRM 0.4 [0c 0q 0f], MQDSS 0.4 [0c 0q 0f], EagleSign 0.3 [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
