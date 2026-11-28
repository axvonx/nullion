# Scoring: video-codec (Name a video codec)

106 answers (Bit Flip and Works on my machine left out); 3 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (1%) | 1 | 0 |
| npe | 11 (10%) | 11 | 0 |
| leak | 3 (3%) | 1 | 0 |
| race | 6 (6%) | 4 | 0 |
| heisenbug | 85 (80%) | 89 | 0 |

Same tier as today: 102/106 (96%).

## Off-by-one (1)

H.264 5.2 [10866c 3089q 55f 0s]

## Null pointer exception (11)

WMV 4.0* [801c 236q 0f 0s], HEVC 3.7 [10558c 477q 51f 72s], AV1 3.1 [13812c 3q 49f 832s], MPEG-2 3.1 [906c 102q 1f 0s], VP9 3.0 [3653c 100q 0f 0s], DivX 3.0 [1958c 38q 1f 0s], Xvid 3.0 [4249c 29q 0f 0s], MPEG-1 3.0 [1843c 0q 0f 0s], VP8 2.8 [1461c 134q 0f 0s], MPEG-4 Part 2 2.2 [928c 0q 0f 0s], Motion JPEG 2.0 [1289c 524q 0f 0s]

## Memory leak (3)

VVC 1.4 [6205c 0q 1f 1229s], AGM 0.3 [0c 65q 0f 0s], DFA 0.2 [0c 581q 0f 0s]

## Race condition (6)

ProRes 2.0 [2215c 0q 0f 0s], DV 1.5 [4877c 9q 0f 0s], Fraps 1.4 [873c 12q 2f 0s], Bink Video 1.0 [4053c 0q 0f 0s], AVS 0.7 [0c 22q 0f 0s], EVC 0.4 [618c 10q 0f 0s]

## Heisenbug (85)

AVUI 1.6 [0c 0q 0f 0s], VC-1 1.6 [986c 2q 0f 0s], H.263 1.6 [823c 6q 0f 0s], LCL 1.6 [0c 0q 0f 0s], Indeo 1.3 [0c 0q 0f 0s], Dxtory 1.3 [0c 0q 0f 0s], Indeo 5 1.2 [0c 0q 0f 0s], Huffyuv 1.2 [151c 0q 0f 0s], M101 1.2 [0c 0q 0f 0s], DNxHD 1.2 [371c 0q 0f 0s], Sorenson Spark 1.2 [0c 0q 0f 0s], ASV 1.2 [0c 0q 0f 0s], HQA 1.1 [0c 0q 0f 0s], Indeo 3 1.1 [0c 0q 0f 0s], FFV1 1.1 [1055c 0q 0f 0s], IVI 1.0 [0c 0q 0f 0s], Lagarith 1.0 [93c 0q 0f 0s], H.261 0.9 [505c 0q 0f 0s], Indeo 4 0.9 [0c 0q 0f 0s], Indeo 2 0.9 [0c 0q 0f 0s], RealVideo 0.9 [519c 0q 0f 0s], Sorenson Video 0.8 [0c 0q 0f 0s], DNxUC 0.8 [0c 0q 0f 0s], ARBC 0.8 [0c 0q 0f 0s], IDCIN 0.7 [0c 0q 0f 0s], CineForm 0.7 [289c 0q 0f 0s], Ut Video 0.7 [115c 0q 3f 0s], AVS2 0.7 [0c 0q 9f 152s], FLIC 0.7 [134c 0q 1f 0s], Mimic 0.7 [0c 0q 12f 0s], Canopus HQ 0.7 [0c 0q 0f 0s], MagicYUV 0.7 [0c 0q 0f 0s], Daala 0.7 [339c 0q 6f 0s], LEAD Video 0.7 [0c 0q 0f 0s], MidiVid 0.6 [0c 0q 0f 0s], Argo 0.6 [0c 0q 5f 0s], IMM6 0.6 [0c 0q 0f 0s], MDEC 0.6 [0c 0q 0f 0s], EA TGQ 0.6 [0c 0q 0f 0s], Apple Intermediate Codec 0.6 [0c 0q 0f 0s], EA MAD 0.6 [0c 0q 0f 0s], IntraX8 0.6 [0c 0q 0f 0s], Flash Screen Video 0.6 [0c 0q 0f 0s], Aura 0.6 [0c 0q 1f 0s], Escape 124 0.5 [0c 0q 0f 0s], 8BPS 0.5 [0c 0q 0f 0s], CYUV 0.5 [0c 0q 0f 0s], LOCO 0.5 [0c 0q 2f 0s], KMVC 0.5 [0c 0q 0f 0s], 012v 0.5 [0c 0q 0f 0s], EA TGV 0.5 [0c 0q 0f 0s], DXV 0.5 [0c 0q 0f 0s], GoToMeeting Codec 0.5 [0c 0q 1f 0s], CRI Video 0.5 [0c 0q 0f 0s], CPiA 0.5 [0c 0q 0f 0s], ClearVideo 0.4 [0c 0q 0f 0s], AVS3 0.4 [0c 0q 0f 0s], Gremlin Digital Video 0.4 [0c 0q 0f 0s], APV 0.4 [0c 0q 0f 0s], DXA 0.4 [0c 0q 0f 0s] ...

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
