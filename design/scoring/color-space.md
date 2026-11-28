# Scoring: color-space (Name a color space)

70 answers (Bit Flip and Works on my machine left out); 6 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 4 (6%) | 4 | 0 |
| npe | 7 (10%) | 7 | 0 |
| leak | 2 (3%) | 2 | 0 |
| race | 8 (11%) | 8 | 0 |
| heisenbug | 49 (70%) | 49 | 0 |

Same tier as today: 70/70 (100%).

## Off-by-one (4)

RGB 6.2 [15433c 3618q 30f], Grayscale 6.0* [4351c 1005q 2f], sRGB 4.7 [6739c 111q 0f], HSL 4.6 [11630c 268q 0f]

## Null pointer exception (7)

HSV 4.3 [11630c 471q 0f], CMYK 4.1 [15072c 322q 0f], YCbCr 2.6 [4450c 21q 0f], YUV 2.6 [0c 790q 0f], CIELAB 2.2 [8842c 63q 9f], DCI-P3 2.1 [5318c 0q 0f], CIE XYZ 2.1 [9566c 49q 0f]

## Memory leak (2)

HSI 1.9 [11630c 0q 0f], PAL/SECAM 1.5 [18917c 0q 0f]

## Race condition (8)

Rec. 709 2.0 [3632c 0q 0f], Display P3 1.9 [5318c 0q 0f], NTSC 1.5 [9875c 4q 0f], Rec. 2020 1.4 [3143c 0q 0f], P3-D65 1.4 [5318c 0q 0f], CIE RGB 1.2 [9566c 0q 0f], CIE xyY 1.0 [9566c 0q 0f], Hunter Lab 0.7 [8842c 0q 0f]

## Heisenbug (49)

Linear RGB 2.0 [0c 0q 0f], Adobe RGB (1998) 1.9 [1008c 0q 0f], YPbPr 1.7 [2637c 0q 0f], ProLab 1.5 [0c 0q 0f], Rec. 601 1.4 [1171c 0q 0f], YIQ 1.3 [782c 0q 0f], Apple RGB 1.2 [0c 0q 0f], Max RGB 1.1 [0c 0q 0f], Xtreme RGB 1.1 [0c 0q 0f], ColorMatch RGB 1.0* [0c 0q 0f], ProPhoto RGB 1.0 [806c 0q 1f], Adobe Wide Gamut RGB 1.0 [434c 0q 0f], HWB 1.0 [180c 1q 1f], sUCS 0.9 [0c 0q 0f], Apple Wide Gamut RGB 0.9 [0c 0q 0f], Yrg 0.9 [0c 0q 0f], Beta RGB 0.9 [0c 0q 0f], scRGB 0.8 [401c 0q 0f], Rec. 2100 0.8 [945c 0q 0f], ACES 0.8 [762c 0q 1f], CIE UCS 0.7 [163c 0q 0f], ITU-R BT.470 0.7 [0c 0q 0f], SMPTE-C 0.7 [0c 0q 0f], DaVinci Wide Gamut 0.7 [0c 0q 0f], CIE UVW 0.6 [108c 0q 0f], hdr-CIELAB 0.6 [0c 0q 0f], Hunter Rdab 0.5 [0c 0q 0f], ICaCb 0.5 [0c 0q 0f], SMPTE 240M 0.5 [0c 0q 0f], Canon Cinema Gamut 0.5 [0c 0q 0f], IPT 0.5 [0c 0q 0f], Nikon N-Gamut 0.4 [0c 0q 0f], Ekta Space PS 5 0.4 [0c 0q 0f], DIN99 0.4 [0c 0q 0f], DJI D-Gamut 0.4 [0c 0q 0f], ECI RGB v2 0.3 [0c 0q 0f], CAM02-UCS 0.3 [652c 0q 0f], OSA-UCS 0.3 [82c 0q 0f], EBU 3213-E 0.3 [0c 0q 0f], CAM16-UCS 0.3 [0c 0q 0f], hdr-IPT 0.3 [0c 0q 0f], PLASA ANSI E1.54 0.3 [0c 0q 0f], Jzazbz 0.3 [0c 0q 0f], Panasonic V-Gamut 0.3 [0c 0q 0f], Ragoo 2021 0.2 [0c 0q 0f], Best RGB 0.0* [0c 0q 0f], Don RGB 4 0.0* [0c 0q 0f], Russell RGB 0.0* [0c 0q 0f], DCDM XYZ 0.0* [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
