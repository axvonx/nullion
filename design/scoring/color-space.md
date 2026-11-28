# Scoring: color-space (Name a color space)

70 answers (Bit Flip and Works on my machine left out); 6 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 4 (6%) | 4 | 0 |
| npe | 7 (10%) | 7 | 0 |
| leak | 2 (3%) | 2 | 0 |
| race | 3 (4%) | 3 | 0 |
| heisenbug | 54 (77%) | 54 | 0 |

Same tier as today: 70/70 (100%).

## Off-by-one (4)

RGB 6.2 [15433c 13q 0f 0s], Grayscale 6.0* [4351c 1005q 2f 0s], sRGB 4.7 [6739c 111q 0f 0s], HSL 4.6 [0c 0q 0f 0s]

## Null pointer exception (7)

HSV 4.3 [0c 0q 0f 0s], CMYK 4.1 [15072c 322q 0f 0s], YCbCr 2.6 [4450c 21q 0f 0s], YUV 2.6 [0c 0q 0f 0s], CIELAB 2.2 [0c 63q 0f 0s], DCI-P3 2.1 [0c 0q 0f 0s], CIE XYZ 2.1 [0c 0q 0f 0s]

## Memory leak (2)

PAL/SECAM 1.5 [18917c 0q 0f 0s], NTSC 1.5 [9875c 4q 0f 0s]

## Race condition (3)

Rec. 709 2.0 [3632c 0q 0f 0s], YPbPr 1.7 [2637c 0q 0f 0s], Rec. 2020 1.4 [3143c 0q 0f 0s]

## Heisenbug (54)

Linear RGB 2.0 [0c 0q 0f 0s], Adobe RGB (1998) 1.9 [1008c 0q 0f 0s], HSI 1.9 [0c 0q 0f 0s], Display P3 1.9 [0c 0q 0f 0s], ProLab 1.5 [0c 0q 0f 0s], Rec. 601 1.4 [1171c 0q 0f 0s], P3-D65 1.4 [0c 0q 0f 0s], YIQ 1.3 [782c 0q 0f 0s], CIE RGB 1.2 [0c 0q 0f 0s], Apple RGB 1.2 [0c 0q 0f 0s], Max RGB 1.1 [0c 0q 0f 0s], Xtreme RGB 1.1 [0c 0q 0f 0s], ColorMatch RGB 1.0* [0c 0q 0f 0s], CIE xyY 1.0 [0c 0q 0f 0s], ProPhoto RGB 1.0 [806c 0q 1f 0s], Adobe Wide Gamut RGB 1.0 [434c 0q 0f 0s], HWB 1.0 [180c 0q 0f 0s], sUCS 0.9 [0c 0q 0f 0s], Apple Wide Gamut RGB 0.9 [0c 0q 0f 0s], Yrg 0.9 [0c 0q 0f 0s], Beta RGB 0.9 [0c 0q 0f 0s], scRGB 0.8 [401c 0q 0f 0s], Rec. 2100 0.8 [945c 0q 0f 0s], ACES 0.8 [762c 0q 1f 0s], CIE UCS 0.7 [163c 0q 0f 0s], ITU-R BT.470 0.7 [0c 0q 0f 0s], SMPTE-C 0.7 [0c 0q 0f 0s], DaVinci Wide Gamut 0.7 [0c 0q 0f 0s], Hunter Lab 0.7 [0c 0q 0f 0s], CIE UVW 0.6 [108c 0q 0f 0s], hdr-CIELAB 0.6 [0c 0q 0f 0s], Hunter Rdab 0.5 [0c 0q 0f 0s], ICaCb 0.5 [0c 0q 0f 0s], SMPTE 240M 0.5 [0c 0q 0f 0s], Canon Cinema Gamut 0.5 [0c 0q 0f 0s], IPT 0.5 [0c 0q 0f 0s], Nikon N-Gamut 0.4 [0c 0q 0f 0s], Ekta Space PS 5 0.4 [0c 0q 0f 0s], DIN99 0.4 [0c 0q 0f 0s], DJI D-Gamut 0.4 [0c 0q 0f 0s], ECI RGB v2 0.3 [0c 0q 0f 0s], CAM02-UCS 0.3 [652c 0q 0f 0s], OSA-UCS 0.3 [82c 0q 0f 0s], EBU 3213-E 0.3 [0c 0q 0f 0s], CAM16-UCS 0.3 [0c 0q 0f 0s], hdr-IPT 0.3 [0c 0q 0f 0s], PLASA ANSI E1.54 0.3 [0c 0q 0f 0s], Jzazbz 0.3 [0c 0q 0f 0s], Panasonic V-Gamut 0.3 [0c 0q 0f 0s], Ragoo 2021 0.2 [0c 0q 0f 0s], Best RGB 0.0* [0c 0q 0f 0s], Don RGB 4 0.0* [0c 0q 0f 0s], Russell RGB 0.0* [0c 0q 0f 0s], DCDM XYZ 0.0* [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
