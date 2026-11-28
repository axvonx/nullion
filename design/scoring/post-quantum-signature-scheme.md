# Scoring: post-quantum-signature-scheme (Name a post-quantum signature scheme)

44 answers (Bit Flip and Works on my machine left out); 0 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (5%) | 2 | 0 |
| npe | 1 (2%) | 1 | 0 |
| leak | 0 (0%) | 0 | 0 |
| race | 1 (2%) | 1 | 0 |
| heisenbug | 40 (91%) | 40 | 0 |

Same tier as today: 44/44 (100%).

## Off-by-one (2)

ML-DSA 2.5 [0c 0q 1f 0s], SPHINCS 2.2 [0c 0q 0f 0s]

## Null pointer exception (1)

Lamport signature 2.0 [0c 0q 0f 0s]

## Memory leak (0)



## Race condition (1)

LESS 0.9 [0c 0q 58f 0s]

## Heisenbug (40)

SLH-DSA 2.0 [0c 0q 0f 0s], Merkle signature scheme 1.9 [569c 0q 0f 0s], HuFu 1.9 [0c 0q 0f 0s], LMS 1.7 [0c 0q 0f 0s], Winternitz one-time signature 1.5 [0c 0q 0f 0s], Rainbow 1.5 [0c 0q 0f 0s], XMSS 1.4 [0c 0q 1f 63s], Wave 1.3 [0c 0q 3f 0s], Picnic 1.2 [0c 0q 0f 0s], Mirath 1.1 [0c 0q 0f 0s], Gravity-SPHINCS 1.1 [0c 0q 0f 0s], qTESLA 1.0 [0c 0q 0f 0s], CROSS 0.9 [0c 0q 2f 0s], BLISS 0.9 [0c 0q 0f 0s], FuLeeca 0.9 [0c 0q 0f 0s], MEDS 0.9 [0c 0q 0f 0s], UOV 0.8 [436c 0q 0f 0s], SDitH 0.8 [0c 0q 0f 0s], XMSS-MT 0.8 [0c 0q 0f 0s], HSS 0.8 [0c 0q 0f 0s], Biscuit 0.8 [0c 0q 3f 0s], RYDE 0.8 [0c 0q 0f 0s], HAWK 0.7 [0c 0q 3f 0s], GLP 0.7 [0c 0q 0f 0s], MAYO 0.7 [0c 0q 5f 0s], SQUIRRELS 0.7 [0c 0q 0f 0s], ALTEQ 0.7 [0c 0q 0f 0s], QR-UOV 0.6 [0c 0q 0f 0s], SOFIA 0.5 [0c 0q 0f 0s], LUOV 0.5 [0c 0q 0f 0s], SNOVA 0.5 [0c 0q 0f 0s], MQOM 0.5 [0c 0q 0f 0s], DME-Sign 0.5 [0c 0q 0f 0s], GeMSS 0.5 [0c 0q 0f 0s], PERK 0.5 [0c 0q 0f 0s], Raccoon 0.4 [0c 0q 3f 0s], FAEST 0.4 [0c 0q 0f 0s], pqsigRM 0.4 [0c 0q 0f 0s], MQDSS 0.4 [0c 0q 0f 0s], EagleSign 0.3 [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
