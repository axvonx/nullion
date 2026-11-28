# Scoring: complexity-class (Name a complexity class)

98 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (2%) | 3 | 0 |
| npe | 2 (2%) | 18 | 0 |
| leak | 10 (10%) | 14 | 0 |
| race | 4 (4%) | 27 | 0 |
| heisenbug | 80 (82%) | 36 | 0 |

Same tier as today: 39/98 (40%).

## Off-by-one (2)

P 4.6 [1818c 31q 1f], NP 4.6 [8031c 497q 1f]

## Null pointer exception (2)

PSPACE 2.9 [1896c 0q 0f], coNP 2.0 [1230c 0q 0f]

## Memory leak (10)

RE 1.8 [457c 2048q 0f], IP 1.4 [379c 16242q 1f], R 1.3 [164c 506158q 47f], NC 1.1 [1060c 1009q 0f], EXP 1.0* [1651c 237q 0f], AP 0.8 [0c 187q 2f], ER 0.5 [0c 2975q 1f], IPP 0.5 [0c 184q 0f], P^PP 0.3 [0c 431q 32f], SPP 0.2 [0c 135q 1f]

## Race condition (4)

coRE 0.9 [0c 90q 0f], RL 0.7 [3166c 0q 5f], SZK 0.6 [9100c 0q 0f], MP 0.2 [0c 0q 11f]

## Heisenbug (80)

BPP 2.0 [1499c 23q 1f], L 1.7 [1479c 0q 1f], PH 1.7 [992c 0q 1f], RP 1.5 [605c 0q 3f], EXPSPACE 1.5 [436c 0q 0f], NL 1.4 [836c 17q 0f], NEXP 1.4 [434c 0q 2f], NEXP_plo 1.3 [0c 0q 0f], #P 1.3 [0c 0q 0f], SUBEXP 1.2 [0c 0q 0f], ZPP 1.2 [362c 0q 2f], PP 1.1 [1334c 31q 0f], NPSPACE 1.1 [0c 0q 0f], PR 1.1 [92c 7q 1f], ALL 1.1 [53c 0q 2f], AM 1.0 [585c 0q 1f], Sigma_2P 0.9 [0c 0q 0f], MA 0.9 [585c 0q 1f], AH 0.9 [1661c 0q 0f], QP 0.9 [0c 0q 0f], PPSPACE 0.9 [0c 0q 0f], MIP 0.9 [711c 0q 0f], PPAD 0.8 [0c 0q 0f], AC0 0.8 [406c 0q 0f], QMA 0.8 [691c 0q 0f], UP 0.8 [105c 0q 0f], AH_plo 0.8 [0c 0q 0f], NP/poly 0.7 [0c 0q 0f], Delta_2P 0.7 [0c 0q 0f], P^Sharp-P 0.6 [0c 0q 0f], RG 0.6 [0c 2q 0f], PEXP 0.6 [0c 0q 0f], BQPSPACE 0.5 [0c 0q 0f], +P 0.5 [0c 0q 0f], QIP 0.5 [73c 0q 0f], PSPACE/poly 0.5 [0c 0q 0f], S_2P 0.5 [104c 0q 0f], NBPP 0.5 [0c 0q 0f], NEXP/poly 0.4 [0c 0q 0f], EXP_plo 0.4 [0c 0q 0f], BQP/poly 0.4 [0c 0q 0f], CH 0.4 [119c 11q 1f], SBP 0.4 [0c 0q 3f], PostBQP 0.4 [142c 0q 0f], QCMA 0.4 [0c 0q 2f], TC0 0.4 [424c 0q 0f], QAM 0.4 [0c 0q 0f], NISZK 0.3 [0c 0q 0f], (NP-cap-coNP)/poly 0.3 [0c 0q 0f], QSZK 0.3 [0c 0q 0f], PP/poly 0.3 [0c 0q 0f], SBQP 0.3 [0c 0q 0f], Delta_3P 0.3 [0c 0q 0f], +EXP 0.3 [0c 0q 0f], QMIP 0.3 [0c 0q 0f], EXP^NP 0.2 [0c 0q 0f], NIQSZK 0.2 [0c 0q 0f], QMA(2) 0.2 [0c 0q 0f], QRG 0.2 [0c 0q 0f], PostBPP 0.2 [0c 0q 0f] ...

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
