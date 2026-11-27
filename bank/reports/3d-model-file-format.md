# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: file format, 3D.

## 3d-model-file-format

54 candidates; 21 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| 3DS | 61 | 109144 | 48656 | 1.00 | off-by-one | counts | npe | — |
| ASE ⚠ counts said off-by-one | 11 | 775 | 28393 | 1.00 | race | judge (override) | race | — |
| OFF ⚠ counts said off-by-one | 7 | 130 | 1847 | 0.93 | race | judge (override) | race | — |
| RAW ⚠ counts said npe | 5 | 72 | 1133 | 0.84 | heisenbug | judge (override) | heisenbug | — |
| STEP | 0 | 181 | 3818 | 0.79 | npe | counts | npe | — |
| BLEND | 1 | 96 | 614 | 0.72 | npe | counts | npe | — |
| M3D ⚠ counts said npe | 0 | 196 | 304 | 0.68 | heisenbug | judge (override) | heisenbug | — |
| X3D | 1 | 26 | 20 | 0.46 | leak | counts | leak | — |
| VRML | 0 | 37 | 7 | 0.38 | womm | pin | — | — |
| STL ⚠ counts said leak | 0 | 6 | 40 | 0.33 | off-by-one | judge (override) | off-by-one | — |
| USD ⚠ counts said race | 0 | 5 | 33 | 0.31 | npe | judge (override) | npe | — |
| IFC | 0 | 14 | 6 | 0.30 | race | counts | leak | — |
| OBJ ⚠ counts said race | 0 | 3 | 19 | 0.25 | off-by-one | judge (override) | off-by-one | — |
| MDC | 0 | 6 | 2 | 0.20 | heisenbug | judge | heisenbug | — |
| C4D | 0 | 5 | 2 | 0.19 | leak | judge | leak | — |
| MS3D | 0 | 5 | 2 | 0.19 | race | judge | race | — |
| CSM | 0 | 1 | 9 | 0.16 | heisenbug | judge | heisenbug | — |
| MDL | 0 | 2 | 4 | 0.16 | leak | judge | leak | — |
| glTF | 0 | 3 | 1 | 0.14 | off-by-one | judge | off-by-one | — |
| DXF | 0 | 2 | 2 | 0.14 | npe | judge | npe | — |
| BVH ⚠ counts said heisenbug | 0 | 0 | 14 | 0.13 | leak | judge (override) | leak | — |
| COLLADA | 0 | 4 | 0 | 0.12 | npe | judge | npe | — |
| AC3D | 0 | 2 | 1 | 0.12 | race | judge | race | — |
| HMP | 0 | 0 | 9 | 0.11 | heisenbug | judge | heisenbug | — |
| PLY | 0 | 0 | 9 | 0.11 | npe | judge | npe | — |
| SMD | 0 | 0 | 6 | 0.09 | race | judge | race | — |
| NFF | 0 | 1 | 1 | 0.09 | heisenbug | judge | heisenbug | — |
| Q3D | 0 | 1 | 1 | 0.09 | heisenbug | judge | heisenbug | — |
| SIB | 0 | 1 | 1 | 0.09 | heisenbug | judge | heisenbug | — |
| TER | 0 | 0 | 4 | 0.08 | race | judge | race | — |
| COB | 0 | 0 | 3 | 0.07 | heisenbug | judge | heisenbug | — |
| IQM | 0 | 0 | 3 | 0.07 | heisenbug | judge | heisenbug | — |
| LWS | 0 | 0 | 2 | 0.05 | race | judge | race | — |
| AMF | 0 | 1 | 0 | 0.05 | race | judge | race | — |
| B3D | 0 | 1 | 0 | 0.05 | race | judge | race | — |
| IrrMesh | 0 | 1 | 0 | 0.05 | race | judge | race | — |
| MD5 | 0 | 1 | 0 | 0.05 | race | judge | race | — |
| 3MF | 0 | 0 | 1 | 0.03 | leak | judge | leak | — |
| MD2 | 0 | 0 | 1 | 0.03 | leak | judge | leak | — |
| PMX | 0 | 0 | 1 | 0.03 | race | judge | race | — |
| Assbin ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Assjson ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Assxml ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FBX ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| LWO ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MD3 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| MD4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NDO | 0 | 0 | 0 | 0.00 | bitflip | pin | — | — |
| OpenGEX ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Q3BSP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| DirectX X ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| XGL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Ogre XML ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Unreal 3D ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): ASE (counts said off-by-one, now race), BVH (counts said heisenbug, now leak), M3D (counts said npe, now heisenbug), OFF (counts said off-by-one, now race), OBJ (counts said race, now off-by-one), STL (counts said leak, now off-by-one), USD (counts said race, now npe), RAW (counts said npe, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

19/20 sampled answers are members (95%); 19/20 also have an acceptable tier. Not members: MD4 (could not verify a 3D format named MD4).
