# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: projection.

## map-projection

107 candidates; 82 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| Stereographic projection | 0 | 30 | 33 | 0.80 | npe | counts | off-by-one | — |
| Times projection ⚠ counts said npe | 0 | 103 | 108 | 0.80 | heisenbug | judge (override) | heisenbug | — |
| Orthographic projection | 0 | 52 | 32 | 0.80 | npe | counts | off-by-one | — |
| Equirectangular projection | 0 | 15 | 113 | 0.72 | npe | counts | off-by-one | — |
| Lagrange projection | 0 | 6 | 7 | 0.46 | heisenbug | judge | heisenbug | — |
| Gnomonic projection | 0 | 3 | 6 | 0.38 | npe | judge | npe | — |
| Mercator projection ⚠ counts said leak | 0 | 10 | 1 | 0.36 | off-by-one | judge (override) | off-by-one | — |
| Hammer projection | 0 | 0 | 10 | 0.27 | race | counts | leak | — |
| HEALPix projection | 0 | 0 | 7 | 0.24 | race | judge | race | — |
| Two-Point Equidistant projection | 0 | 2 | 1 | 0.21 | race | judge | race | — |
| Lambert azimuthal equal-area projection | 0 | 1 | 2 | 0.21 | npe | judge | npe | — |
| Adams projection | 0 | 4 | 0 | 0.19 | heisenbug | judge | heisenbug | — |
| Azimuthal equidistant projection | 0 | 1 | 1 | 0.16 | npe | judge | npe | — |
| Hatano asymmetrical equal-area projection | 0 | 0 | 3 | 0.16 | heisenbug | judge | heisenbug | — |
| Cassini projection | 0 | 1 | 0 | 0.08 | race | judge | race | — |
| Craster parabolic projection | 0 | 1 | 0 | 0.08 | heisenbug | judge | heisenbug | — |
| Sinusoidal projection | 0 | 1 | 0 | 0.08 | npe | judge | npe | — |
| Lambert conformal conic projection | 0 | 1 | 0 | 0.08 | npe | judge | npe | — |
| Oblique Mercator projection | 0 | 1 | 0 | 0.08 | leak | judge | leak | — |
| Patterson cylindrical projection | 0 | 1 | 0 | 0.08 | race | judge | race | — |
| Polyconic projection | 0 | 1 | 0 | 0.08 | leak | judge | leak | — |
| Transverse Mercator projection | 0 | 1 | 0 | 0.08 | npe | judge | npe | — |
| Central cylindrical projection | 0 | 0 | 1 | 0.08 | race | judge | race | — |
| Equal Earth projection | 0 | 0 | 1 | 0.08 | leak | judge | leak | — |
| Mollweide projection | 0 | 0 | 1 | 0.08 | leak | judge | leak | — |
| Albers equal-area conic ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Dymaxion map | 0 | 0 | 0 | 0.00 | womm | pin | — | — |
| Airy projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Aitoff projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Bacon globular projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Bertin 1953 projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Bipolar oblique conic conformal projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Boggs eumorphic projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Bonne projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Central conic projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Cylindrical equal-area projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Chamberlin trimetric projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Colombia Urban projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Collignon projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Compact Miller projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Denoyer semi-elliptical projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Eckert I projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Eckert II projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Eckert III projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Eckert IV projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Eckert V projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Equidistant conic projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Fahey projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Foucaut sinusoidal projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Gall stereographic projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Geostationary satellite view projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Ginsburg VIII projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Goode homolosine projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Gauss-Schreiber transverse Mercator projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| International Map of the World polyconic projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Krovak projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Laborde projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Larrivée projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Laskowski tri-optimal projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Lambert conformal conic alternative projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Loximuthal projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| McBryde-Thomas flat-polar sinusoidal projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| McBryde-Thomas flat-polar parabolic projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| McBryde-Thomas flat-polar quartic projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Miller cylindrical projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Modified-Stereographic conformal projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Natural Earth projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Natural Earth II projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Nell projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Nell-Hammer projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Nicolosi globular projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Near-sided perspective projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| New Zealand Map Grid projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Oblique cylindrical equal-area projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Oblated equal-area projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Putnins P2 projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Putnins P3 projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Putnins P4' projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Putnins P5 projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Putnins P6 projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Quadrilateralized Spherical Cube projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Robinson projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| Roussilhe stereographic projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Rectangular polyconic projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Space Oblique Mercator projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Swiss Oblique Mercator projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Spilhaus world ocean projection | 0 | 0 | 0 | 0.00 | bitflip | pin | — | — |
| Oblique Stereographic Alternative projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Transverse Central Cylindrical projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Transverse Cylindrical Equal Area projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Tobler-Mercator projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Urmaev V projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Urmaev Flat-Polar Sinusoidal projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Van der Grinten projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Van der Grinten II projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Van der Grinten IV projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Wagner II projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Wagner III projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Wagner VII projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Winkel I projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Winkel II projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| August projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Interrupted Mollweide projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Simple conic projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Spherical Cross-track Height projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CalCOFI grid ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| S2 projection ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): Mercator projection (counts said leak, now off-by-one), Times projection (counts said npe, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

20/20 sampled answers are members (100%); 20/20 also have an acceptable tier. Not members: none.
