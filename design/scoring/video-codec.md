# Scoring: video-codec (Name a video codec)

106 answers (Bit Flip and Works on my machine left out); 3 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (1%) | 1 | 0 |
| npe | 11 (10%) | 11 | 0 |
| leak | 3 (3%) | 2 | 0 |
| race | 4 (4%) | 6 | 0 |
| heisenbug | 87 (82%) | 86 | 0 |

Same tier as today: 102/106 (96%).

## Off-by-one (1)

H.264 5.2 [10866c 3089q 55f]

## Null pointer exception (11)

WMV 4.0* [801c 236q 0f], HEVC 3.7 [10558c 477q 51f], AV1 3.1 [13812c 3q 49f], MPEG-2 3.1 [906c 102q 1f], VP9 3.0 [3653c 100q 0f], DivX 3.0 [1958c 38q 1f], Xvid 3.0 [4249c 29q 0f], MPEG-1 3.0 [1843c 0q 0f], VP8 2.8 [1461c 134q 0f], MPEG-4 Part 2 2.2 [928c 0q 0f], Motion JPEG 2.0 [1289c 524q 0f]

## Memory leak (3)

Argo 0.6 [0c 145q 5f], AGM 0.3 [0c 65q 1f], DFA 0.2 [0c 581q 0f]

## Race condition (4)

DV 1.5 [4877c 9q 0f], VVC 1.4 [6205c 0q 1f], Bink Video 1.0 [4053c 0q 0f], AVS 0.7 [0c 22q 0f]

## Heisenbug (87)

ProRes 2.0 [2215c 0q 0f], AVUI 1.6 [0c 0q 0f], VC-1 1.6 [986c 2q 0f], H.263 1.6 [823c 6q 0f], LCL 1.6 [0c 0q 1f], Fraps 1.4 [873c 12q 2f], Indeo 1.3 [282c 0q 0f], Dxtory 1.3 [0c 0q 0f], Indeo 5 1.2 [282c 0q 0f], Huffyuv 1.2 [151c 0q 0f], M101 1.2 [0c 0q 0f], DNxHD 1.2 [371c 0q 0f], Sorenson Spark 1.2 [284c 0q 0f], ASV 1.2 [0c 0q 1f], Indeo 3 1.1 [282c 0q 0f], HQA 1.1 [0c 0q 0f], FFV1 1.1 [1055c 0q 0f], IVI 1.0 [0c 0q 0f], Lagarith 1.0 [93c 0q 0f], H.261 0.9 [505c 0q 0f], Indeo 4 0.9 [282c 0q 0f], Indeo 2 0.9 [282c 0q 0f], RealVideo 0.9 [519c 0q 0f], Sorenson Video 0.8 [284c 0q 0f], DNxUC 0.8 [0c 0q 0f], ARBC 0.8 [0c 0q 0f], IDCIN 0.7 [0c 0q 0f], CineForm 0.7 [289c 0q 0f], Ut Video 0.7 [115c 0q 3f], AVS2 0.7 [0c 0q 9f], FLIC 0.7 [134c 0q 2f], Mimic 0.7 [0c 0q 12f], Canopus HQ 0.7 [0c 0q 0f], MagicYUV 0.7 [0c 0q 0f], Daala 0.7 [339c 0q 6f], LEAD Video 0.7 [0c 0q 0f], MidiVid 0.6 [0c 0q 0f], IMM6 0.6 [0c 0q 0f], MDEC 0.6 [0c 0q 0f], EA TGQ 0.6 [0c 0q 0f], Apple Intermediate Codec 0.6 [0c 0q 1f], EA MAD 0.6 [0c 0q 0f], IntraX8 0.6 [0c 0q 0f], Flash Screen Video 0.6 [0c 0q 0f], Aura 0.6 [0c 0q 1f], Escape 124 0.5 [0c 0q 0f], 8BPS 0.5 [0c 0q 0f], CYUV 0.5 [0c 0q 0f], LOCO 0.5 [0c 2q 2f], KMVC 0.5 [0c 0q 0f], 012v 0.5 [0c 0q 0f], EA TGV 0.5 [0c 0q 0f], DXV 0.5 [0c 0q 0f], GoToMeeting Codec 0.5 [0c 0q 1f], CRI Video 0.5 [0c 0q 0f], CPiA 0.5 [0c 0q 0f], ClearVideo 0.4 [0c 0q 0f], AVS3 0.4 [0c 0q 0f], Gremlin Digital Video 0.4 [0c 0q 0f], APV 0.4 [0c 0q 0f] ...

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
