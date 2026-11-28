# Scoring: map-projection (Name a map projection)

124 answers (Bit Flip and Works on my machine left out); 2 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (1%) | 6 | 0 |
| npe | 7 (6%) | 27 | 0 |
| leak | 7 (6%) | 9 | 0 |
| race | 6 (5%) | 16 | 0 |
| heisenbug | 103 (83%) | 66 | 0 |

Same tier as today: 72/124 (58%).

## Off-by-one (1)

Mercator projection 7.0* [30188c 121q 0f]

## Null pointer exception (7)

Web Mercator 4.1 [3162c 0q 0f], Equirectangular projection 2.9 [5393c 0q 1f], Transverse Mercator projection 2.4 [2642c 0q 0f], Transverse Mercator 2.4 [2642c 0q 0f], Universal Transverse Mercator 2.4 [6525c 328q 3f], Orthographic projection 2.3 [937c 320q 0f], Stereographic projection 2.1 [4708c 0q 0f]

## Memory leak (7)

Gall-Peters 1.8 [10034c 0q 0f], Miller cylindrical 1.2 [1021c 34q 21f], Transverse Central Cylindrical projection 1.1 [0c 123q 29f], Cassini 1.0 [583c 227q 0f], Equal Earth projection 1.0 [30205c 0q 0f], Space Oblique Mercator projection 0.4 [119c 187q 0f], Geostationary satellite view projection 0.0* [0c 239q 42f]

## Race condition (6)

Robinson projection 1.6 [6455c 0q 0f], Azimuthal equidistant projection 1.4 [5481c 0q 0f], Winkel tripel 1.3 [3482c 0q 0f], Dymaxion 1.3 [7406c 0q 0f], Azimuthal equidistant 1.2 [5481c 0q 0f], HEALPix projection 0.6 [852c 0q 10f]

## Heisenbug (103)

Lambert conformal conic projection 1.8 [2436c 6q 4f], Simple conic projection 1.6 [0c 0q 0f], Albers equal-area conic 1.6 [1448c 0q 0f], Natural Earth projection 1.6 [1113c 0q 0f], Sinusoidal projection 1.6 [1160c 0q 0f], S2 projection 1.4 [0c 0q 0f], Gauss-Schreiber transverse Mercator projection 1.4 [0c 0q 0f], Cylindrical equal-area projection 1.3 [612c 0q 0f], Mollweide projection 1.3 [2440c 0q 0f], Gnomonic projection 1.3 [1807c 0q 0f], Equidistant conic projection 1.2 [523c 0q 0f], Winkel II projection 1.2 [0c 0q 0f], Lambert conformal conic alternative projection 1.1 [0c 0q 0f], Miller cylindrical projection 1.1 [1021c 0q 6f], Van der Grinten projection 1.1 [847c 0q 0f], Goode homolosine projection 1.1 [2169c 0q 0f], Lambert azimuthal equal-area projection 1.1 [1162c 0q 0f], Aitoff projection 1.0 [365c 0q 0f], Central conic projection 1.0 [0c 0q 0f], Oblique Stereographic Alternative projection 1.0 [0c 0q 0f], Urmaev Flat-Polar Sinusoidal projection 1.0 [0c 0q 0f], Cassini projection 1.0 [583c 0q 1f], Eckert IV projection 0.9 [1883c 0q 0f], Modified-Stereographic conformal projection 0.9 [0c 0q 0f], Eckert II projection 0.9 [289c 0q 0f], Eckert III projection 0.9 [0c 0q 0f], Transverse Cylindrical Equal Area projection 0.9 [0c 0q 0f], Sinusoidal 0.9 [1160c 0q 0f], Central cylindrical projection 0.9 [594c 0q 0f], Hammer projection 0.9 [406c 0q 2f], Tobler-Mercator projection 0.9 [0c 0q 0f], Two-Point Equidistant projection 0.8 [222c 0q 0f], Nell-Hammer projection 0.8 [0c 0q 0f], Oblique Mercator projection 0.8 [119c 0q 0f], McBryde-Thomas flat-polar parabolic projection 0.8 [0c 0q 0f], Compact Miller projection 0.8 [0c 0q 0f], Polyconic projection 0.8 [167c 0q 2f], Laborde projection 0.8 [0c 0q 0f], Goode homolosine 0.8 [2169c 0q 0f], Eckert I projection 0.7 [0c 0q 0f], Eckert IV 0.7 [1883c 0q 0f], Waterman butterfly 0.7 [1331c 0q 0f], Collignon projection 0.7 [423c 0q 0f], Gall stereographic projection 0.7 [532c 0q 1f], Natural Earth II projection 0.7 [0c 0q 0f], Behrmann 0.7 [496c 0q 0f], Polyconic 0.7 [167c 0q 0f], Roussilhe stereographic projection 0.7 [0c 0q 0f], Laskowski tri-optimal projection 0.7 [0c 0q 0f], Quadrilateralized Spherical Cube projection 0.7 [535c 0q 0f], Times projection 0.7 [0c 0q 0f], International Map of the World polyconic projection 0.7 [0c 0q 0f], Near-sided perspective projection 0.6 [0c 0q 0f], Patterson cylindrical projection 0.6 [0c 0q 0f], Interrupted Mollweide projection 0.6 [0c 0q 0f], Bacon globular projection 0.6 [0c 0q 0f], Van der Grinten 0.6 [847c 0q 0f], Wagner II projection 0.6 [0c 0q 0f], Larrivée projection 0.6 [0c 0q 0f], Chamberlin trimetric projection 0.6 [112c 0q 0f] ...

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
