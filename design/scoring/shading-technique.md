# Scoring: shading-technique (Name a shading technique)

79 answers (Bit Flip and Works on my machine left out); 0 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (3%) | 4 | 0 |
| npe | 11 (14%) | 12 | 4 |
| leak | 2 (3%) | 19 | 0 |
| race | 4 (5%) | 23 | 0 |
| heisenbug | 60 (76%) | 21 | 6 |

Same tier as today: 32/79 (41%).

## Off-by-one (2)

flat shading 3.1 [1221c 0q 2f], cel shading 3.0 [7513c 0q 3f]

## Null pointer exception (11)

shadow mapping 2.7 [1243c 201q 0f], deferred shading 2.6 [1686c 144q 0f], Phong shading 2.5 [2503c 102q 0f], ambient occlusion 2.3 [2986c 63q 0f], Forward shading 2.3 [0c 0q 0f], physically based rendering 2.3 [2952c 68q 0f], Blinn-Phong 2.2 [2373c 0q 0f], Gouraud shading 2.2 [2080c 14q 0f], Bump mapping 2.1 [1216c 62q 0f], Lightmapping 2.1 [430c 0q 0f], Lambertian shading 2.0 [2982c 0q 0f]

## Memory leak (2)

Screen-space reflections 1.1 [0c 4815q 0f], Parallax occlusion mapping 0.8 [512c 5281q 2f]

## Race condition (4)

Halftone shading 1.9 [4452c 0q 0f], Hatching 1.8 [3535c 0q 0f], Thin-film interference 0.7 [3421c 0q 0f], Reflective shadow maps 0.6 [0c 14q 8f]

## Heisenbug (60)

Path tracing 2.0 [2797c 0q 0f], Procedural shading 2.0 [0c 0q 0f], Rim lighting 1.9 [0c 0q 0f], Hemisphere lighting 1.9 [0c 0q 0f], Deferred lighting 1.8 [1686c 0q 0f], normal mapping 1.8 [2747c 0q 0f], Environment mapping 1.6 [356c 0q 0f], Half-Lambert 1.6 [0c 0q 0f], Displacement mapping 1.5 [660c 0q 0f], Tiled deferred shading 1.4 [0c 0q 0f], Radiosity 1.4 [1017c 0q 0f], Image-based lighting 1.4 [314c 0q 0f], Stipple shading 1.4 [2579c 0q 0f], Relief mapping 1.3 [151c 0q 0f], Relief shading 1.3 [780c 0q 0f], parallax mapping 1.3 [797c 0q 0f], Disney BRDF 1.3 [0c 0q 0f], Forward+ 1.3 [0c 0q 0f], Wrap lighting 1.2 [0c 0q 0f], spherical harmonic lighting 1.1 [178c 0q 0f], MatCap 1.1 [0c 0q 0f], visibility buffer 1.1 [0c 0q 0f], Photon mapping 1.0 [593c 0q 0f], subsurface scattering 1.0 [1588c 0q 1f], Object-space shading 1.0 [0c 0q 0f], Burley diffuse 0.9 [0c 0q 0f], Cook-Torrance 0.9 [1267c 0q 0f], Variable rate shading 0.9 [0c 0q 0f], Screen-space global illumination 0.9 [0c 0q 0f], GGX 0.9 [1267c 0q 0f], Schlick BRDF 0.9 [687c 0q 0f], Ambient cube 0.9 [0c 0q 0f], Reyes shading 0.8 [215c 0q 0f], Gooch shading 0.8 [450c 0q 0f], clustered shading 0.8 [0c 0q 0f], Virtual point lights 0.7 [0c 0q 0f], Voxel cone tracing 0.7 [0c 0q 0f], Decoupled deferred shading 0.7 [0c 0q 0f], Ward BRDF 0.7 [0c 0q 0f], Texture-space shading 0.7 [0c 0q 0f], Beckmann 0.6 [1267c 0q 0f], Minnaert shading 0.6 [0c 0q 0f], Banks shading 0.6 [0c 0q 0f], Lafortune 0.6 [0c 0q 0f], Kulla-Conty 0.6 [0c 0q 0f], Charlie sheen 0.5 [0c 0q 0f], Oren-Nayar 0.5 [574c 0q 0f], ReSTIR 0.5 [0c 0q 0f], Ashikhmin-Shirley 0.5 [0c 0q 0f], Light propagation volumes 0.4 [0c 0q 0f], Linearly transformed cosines 0.4 [0c 0q 4f], He-Torrance-Sillion-Greenberg 0.4 [0c 0q 0f], Spherical Gaussian lighting 0.4 [0c 0q 0f], Torrance-Sparrow 0.4 [0c 0q 0f], Marschner 0.4 [0c 0q 0f], Kajiya-Kay 0.3 [0c 0q 0f], Precomputed radiance transfer 0.3 [0c 0q 2f], Neural shading 0.3 [0c 0q 0f], Strauss shading 0.3 [0c 0q 0f], Hapke 0.1 [173c 0q 0f]

## Confirmed lines the scores disagree with (never moved)

- Phong shading: off-by-one in the bank, scores say npe (Phong shading 2.5 [2503c 102q 0f])
- Gouraud shading: off-by-one in the bank, scores say npe (Gouraud shading 2.2 [2080c 14q 0f])
- normal mapping: npe in the bank, scores say heisenbug (normal mapping 1.8 [2747c 0q 0f])
- deferred shading: leak in the bank, scores say npe (deferred shading 2.6 [1686c 144q 0f])
- shadow mapping: leak in the bank, scores say npe (shadow mapping 2.7 [1243c 201q 0f])
- parallax mapping: leak in the bank, scores say heisenbug (parallax mapping 1.3 [797c 0q 0f])
- subsurface scattering: race in the bank, scores say heisenbug (subsurface scattering 1.0 [1588c 0q 1f])
- Cook-Torrance: race in the bank, scores say heisenbug (Cook-Torrance 0.9 [1267c 0q 0f])
- Oren-Nayar: race in the bank, scores say heisenbug (Oren-Nayar 0.5 [574c 0q 0f])
- clustered shading: race in the bank, scores say heisenbug (clustered shading 0.8 [0c 0q 0f])

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
