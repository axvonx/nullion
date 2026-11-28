# Scoring: 3d-model-file-format (Name a 3D model file format)

58 answers (Bit Flip and Works on my machine left out); 3 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (3%) | 2 | 0 |
| npe | 7 (12%) | 7 | 0 |
| leak | 15 (26%) | 6 | 0 |
| race | 2 (3%) | 5 | 0 |
| heisenbug | 32 (55%) | 38 | 0 |

Same tier as today: 48/58 (83%).

## Off-by-one (2)

STL 5.0* [8220c 15461q 0f 0s], OBJ 5.0* [5643c 340q 0f 0s]

## Null pointer exception (7)

3DS 2.9 [328c 141q 0f 0s], FBX 2.8 [1381c 512q 0f 0s], glTF 2.7 [3222c 908q 0f 0s], BLEND 2.5 [21955c 0q 41f 0s], DXF 2.3 [2166c 338q 0f 0s], MDL 2.2 [0c 0q 0f 0s], MAX 2.1 [3233c 9077q 1f 0s]

## Memory leak (15)

COLLADA 1.9 [715c 524q 0f 0s], STEP 1.9 [942c 83q 0f 0s], DWG 1.8 [2070c 171q 0f 0s], USD 1.7 [1093c 160q 0f 0s], C4D 1.5 [1785c 112q 0f 0s], Q3BSP 1.1 [5209c 103q 0f 0s], Alembic 1.1 [268c 267q 25f 1177s], IFC 1.1 [1518c 224q 0f 0s], 3DM 1.1 [2550c 88q 3f 90s], X3D 1.0 [801c 181q 0f 0s], MD5 0.9 [0c 4219q 0f 0s], MDC 0.9 [0c 299q 0f 0s], PMX 0.8 [3980c 866q 0f 0s], AMF 0.7 [262c 298q 0f 0s], IrrMesh 0.5 [0c 164q 31f 0s]

## Race condition (2)

SMD 1.1 [0c 18q 0f 0s], Ogre XML 0.6 [1721c 0q 0f 0s]

## Heisenbug (32)

IGES 1.6 [589c 3q 0f 0s], MA 1.5 [0c 0q 0f 0s], MB 1.4 [0c 0q 0f 0s], DirectX X 1.4 [0c 0q 0f 0s], PLY 1.3 [1354c 0q 0f 0s], 3MF 1.3 [823c 0q 0f 0s], MD2 1.2 [0c 5q 0f 0s], MD3 1.2 [0c 0q 0f 0s], Unreal 3D 1.2 [0c 0q 0f 0s], Assjson 1.1 [0c 0q 0f 0s], RAW 1.1 [0c 0q 0f 0s], BVH 1.1 [163c 0q 0f 0s], M3D 1.1 [0c 0q 0f 0s], MS3D 1.0 [0c 0q 0f 0s], ASE 1.0 [0c 0q 0f 0s], LWO 0.9 [0c 0q 0f 0s], OFF 0.9 [219c 0q 0f 0s], LWS 0.8 [0c 0q 0f 0s], NFF 0.7 [0c 0q 0f 0s], AC3D 0.7 [70c 0q 0f 0s], HMP 0.7 [0c 3q 0f 0s], IQM 0.6 [0c 0q 0f 0s], SIB 0.6 [63c 0q 0f 0s], Q3D 0.6 [0c 0q 0f 0s], OpenGEX 0.6 [0c 0q 0f 0s], Assxml 0.5 [0c 0q 0f 0s], XGL 0.5 [0c 0q 0f 0s], TER 0.5 [939c 0q 1f 0s], CSM 0.5 [0c 0q 0f 0s], B3D 0.5 [0c 6q 0f 0s], COB 0.3 [311c 0q 0f 0s], Assbin 0.0* [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
