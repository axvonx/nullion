# Scoring: complexity-class (Name a complexity class)

98 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (2%) | 2 | 0 |
| npe | 2 (2%) | 2 | 0 |
| leak | 9 (9%) | 1 | 0 |
| race | 5 (5%) | 3 | 0 |
| heisenbug | 80 (82%) | 90 | 0 |

Same tier as today: 87/98 (89%).

## Off-by-one (2)

P 4.6 [1818c 0q 1f 0s], NP 4.6 [8031c 497q 0f 0s]

## Null pointer exception (2)

PSPACE 2.9 [1896c 0q 0f 0s], coNP 2.0 [1230c 0q 0f 0s]

## Memory leak (9)

IP 1.4 [379c 16242q 0f 0s], PP 1.1 [1334c 31q 0f 0s], NC 1.1 [1060c 1009q 0f 0s], EXP 1.0* [1651c 237q 0f 0s], AP 0.8 [0c 187q 0f 0s], SZK 0.6 [9100c 0q 0f 0s], IPP 0.5 [0c 184q 0f 0s], P^PP 0.3 [0c 431q 0f 0s], SPP 0.2 [0c 135q 0f 0s]

## Race condition (5)

BPP 2.0 [1499c 23q 0f 0s], NL 1.4 [836c 17q 0f 0s], AH 0.9 [1661c 0q 0f 0s], RL 0.7 [3166c 0q 0f 0s], CH 0.4 [119c 11q 0f 0s]

## Heisenbug (80)

RE 1.8 [457c 0q 0f 0s], L 1.7 [1479c 0q 0f 0s], PH 1.7 [992c 0q 0f 0s], RP 1.5 [605c 0q 0f 0s], EXPSPACE 1.5 [436c 0q 0f 0s], NEXP 1.4 [434c 0q 2f 0s], NEXP_plo 1.3 [0c 0q 0f 0s], R 1.3 [164c 0q 0f 0s], #P 1.3 [0c 0q 0f 0s], SUBEXP 1.2 [0c 0q 0f 0s], ZPP 1.2 [362c 0q 0f 0s], NPSPACE 1.1 [0c 0q 0f 0s], PR 1.1 [92c 7q 0f 0s], ALL 1.1 [53c 0q 0f 0s], AM 1.0 [0c 0q 0f 0s], coRE 0.9 [0c 0q 0f 0s], Sigma_2P 0.9 [0c 0q 0f 0s], MA 0.9 [0c 0q 0f 0s], QP 0.9 [0c 0q 0f 0s], PPSPACE 0.9 [0c 0q 0f 0s], MIP 0.9 [0c 0q 0f 0s], PPAD 0.8 [426c 0q 0f 0s], AC0 0.8 [406c 0q 0f 0s], QMA 0.8 [691c 0q 0f 0s], UP 0.8 [105c 0q 0f 0s], AH_plo 0.8 [0c 0q 0f 0s], NP/poly 0.7 [0c 0q 0f 0s], Delta_2P 0.7 [0c 0q 0f 0s], P^Sharp-P 0.6 [0c 0q 0f 0s], RG 0.6 [0c 2q 0f 0s], PEXP 0.6 [0c 0q 0f 0s], BQPSPACE 0.5 [0c 0q 0f 0s], +P 0.5 [0c 0q 0f 0s], ER 0.5 [0c 0q 0f 0s], QIP 0.5 [73c 0q 0f 0s], PSPACE/poly 0.5 [0c 0q 0f 0s], S_2P 0.5 [104c 0q 0f 0s], NBPP 0.5 [0c 0q 0f 0s], NEXP/poly 0.4 [0c 0q 0f 0s], EXP_plo 0.4 [0c 0q 0f 0s], BQP/poly 0.4 [0c 0q 0f 0s], SBP 0.4 [0c 0q 0f 0s], PostBQP 0.4 [142c 0q 0f 0s], QCMA 0.4 [0c 0q 2f 0s], TC0 0.4 [424c 0q 0f 0s], QAM 0.4 [0c 0q 0f 0s], NISZK 0.3 [0c 0q 0f 0s], (NP-cap-coNP)/poly 0.3 [0c 0q 0f 0s], QSZK 0.3 [0c 0q 0f 0s], Delta_3P 0.3 [0c 0q 0f 0s], PP/poly 0.3 [0c 0q 0f 0s], SBQP 0.3 [0c 0q 0f 0s], +EXP 0.3 [0c 0q 0f 0s], QMIP 0.3 [0c 0q 0f 0s], EXP^NP 0.2 [0c 0q 0f 0s], QMA(2) 0.2 [0c 0q 0f 0s], NIQSZK 0.2 [0c 0q 0f 0s], PostBPP 0.2 [0c 0q 0f 0s], QRG 0.2 [0c 0q 0f 0s], MAEXP 0.2 [0c 0q 0f 0s] ...

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
