# Scoring: map-projection (Name a map projection)

124 answers (Bit Flip and Works on my machine left out); 2 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (1%) | 1 | 0 |
| npe | 8 (6%) | 8 | 0 |
| leak | 4 (3%) | 4 | 0 |
| race | 5 (4%) | 5 | 0 |
| heisenbug | 106 (85%) | 106 | 0 |

Same tier as today: 124/124 (100%).

## Off-by-one (1)

Mercator projection 7.0* [30188c 121q 0f 0s]

## Null pointer exception (8)

Web Mercator 4.1 [3162c 0q 0f 0s], Equirectangular projection 2.9 [5393c 0q 0f 0s], Transverse Mercator projection 2.4 [0c 0q 0f 0s], Transverse Mercator 2.4 [0c 0q 0f 0s], Universal Transverse Mercator 2.4 [6525c 0q 0f 0s], Orthographic projection 2.3 [937c 0q 0f 0s], Stereographic projection 2.1 [4708c 0q 0f 0s], Equal Earth projection 1.0 [30205c 0q 0f 0s]^

## Memory leak (4)

Gall-Peters 1.8 [10034c 0q 0f 0s], Robinson projection 1.6 [6455c 0q 0f 0s], Cassini 1.0 [0c 227q 0f 0s], Geostationary satellite view projection 0.0* [0c 239q 42f 0s]

## Race condition (5)

Lambert conformal conic projection 1.8 [2436c 0q 0f 0s], Mollweide projection 1.3 [2440c 0q 0f 0s], Winkel tripel 1.3 [3482c 0q 0f 0s], Gnomonic projection 1.3 [1807c 0q 0f 0s], Miller cylindrical 1.2 [0c 0q 21f 0s]

## Heisenbug (106)

Simple conic projection 1.6 [0c 0q 0f 0s], Albers equal-area conic 1.6 [1448c 0q 0f 0s], Natural Earth projection 1.6 [1113c 0q 0f 0s], Sinusoidal projection 1.6 [0c 0q 0f 0s], S2 projection 1.4 [0c 0q 0f 0s], Azimuthal equidistant projection 1.4 [0c 0q 0f 0s], Gauss-Schreiber transverse Mercator projection 1.4 [0c 0q 0f 0s], Cylindrical equal-area projection 1.3 [612c 0q 0f 0s], Dymaxion 1.3 [0c 0q 0f 0s], Azimuthal equidistant 1.2 [0c 0q 0f 0s], Equidistant conic projection 1.2 [523c 0q 0f 0s], Winkel II projection 1.2 [0c 0q 0f 0s], Lambert conformal conic alternative projection 1.1 [0c 0q 0f 0s], Transverse Central Cylindrical projection 1.1 [0c 0q 0f 0s], Miller cylindrical projection 1.1 [0c 0q 6f 0s], Van der Grinten projection 1.1 [0c 0q 0f 0s], Goode homolosine projection 1.1 [0c 0q 0f 0s], Lambert azimuthal equal-area projection 1.1 [1162c 0q 0f 0s], Aitoff projection 1.0 [365c 0q 0f 0s], Central conic projection 1.0 [0c 0q 0f 0s], Oblique Stereographic Alternative projection 1.0 [0c 0q 0f 0s], Urmaev Flat-Polar Sinusoidal projection 1.0 [0c 0q 0f 0s], Cassini projection 1.0 [0c 0q 1f 0s], Modified-Stereographic conformal projection 0.9 [0c 0q 0f 0s], Eckert IV projection 0.9 [0c 0q 0f 0s], Eckert II projection 0.9 [289c 0q 0f 0s], Eckert III projection 0.9 [0c 0q 0f 0s], Transverse Cylindrical Equal Area projection 0.9 [0c 0q 0f 0s], Central cylindrical projection 0.9 [594c 0q 0f 0s], Hammer projection 0.9 [406c 0q 2f 0s], Tobler-Mercator projection 0.9 [0c 0q 0f 0s], Sinusoidal 0.9 [0c 0q 0f 0s], Two-Point Equidistant projection 0.8 [222c 0q 0f 0s], Nell-Hammer projection 0.8 [0c 0q 0f 0s], Oblique Mercator projection 0.8 [0c 0q 0f 0s], McBryde-Thomas flat-polar parabolic projection 0.8 [0c 0q 0f 0s], Compact Miller projection 0.8 [0c 0q 0f 0s], Polyconic projection 0.8 [0c 0q 2f 0s], Laborde projection 0.8 [0c 0q 0f 0s], Goode homolosine 0.8 [0c 0q 0f 0s], Eckert I projection 0.7 [0c 0q 0f 0s], Waterman butterfly 0.7 [1331c 0q 0f 0s], Eckert IV 0.7 [0c 0q 0f 0s], Collignon projection 0.7 [423c 0q 0f 0s], Gall stereographic projection 0.7 [532c 0q 1f 0s], Natural Earth II projection 0.7 [0c 0q 0f 0s], Behrmann 0.7 [496c 0q 0f 0s], Roussilhe stereographic projection 0.7 [0c 0q 0f 0s], Polyconic 0.7 [0c 0q 0f 0s], Laskowski tri-optimal projection 0.7 [0c 0q 0f 0s], Quadrilateralized Spherical Cube projection 0.7 [535c 0q 0f 0s], Times projection 0.7 [0c 0q 0f 0s], International Map of the World polyconic projection 0.7 [0c 0q 0f 0s], Near-sided perspective projection 0.6 [0c 0q 0f 0s], Patterson cylindrical projection 0.6 [0c 0q 0f 0s], Interrupted Mollweide projection 0.6 [0c 0q 0f 0s], Bacon globular projection 0.6 [0c 0q 0f 0s], HEALPix projection 0.6 [852c 0q 10f 0s], Van der Grinten 0.6 [0c 0q 0f 0s], Wagner II projection 0.6 [0c 0q 0f 0s] ...

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
