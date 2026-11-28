# Scoring: graphics-api (Name a graphics API)

28 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 3 (11%) | 3 | 0 |
| npe | 5 (18%) | 5 | 0 |
| leak | 8 (29%) | 8 | 0 |
| race | 1 (4%) | 1 | 0 |
| heisenbug | 11 (39%) | 11 | 0 |

Same tier as today: 28/28 (100%).

## Off-by-one (3)

OpenGL 5.0 [10675c 38497q 3f 0s], OpenGL ES 5.0* [1920c 14050q 0f 0s], Direct3D 4.5 [4349c 6088q 3f 0s]

## Null pointer exception (5)

Vulkan 3.6 [15260c 2412q 13f 0s], WebGL 3.5 [5337c 6789q 0f 0s], Metal 3.0 [3899c 2215q 2f 0s], CUDA 2.7 [18947c 14772q 16f 0s], OpenCL 1.7 [3503c 5788q 0f 0s]^

## Memory leak (8)

Direct2D 1.9 [509c 752q 0f 0s], WebGPU 1.7 [4726c 112q 0f 0s], DirectDraw 1.5 [503c 89q 0f 0s], DirectCompute 1.5 [133c 80q 0f 0s], OptiX 1.1 [397c 44q 3f 0s], SYCL 1.1 [1068c 171q 0f 0s], RenderScript 0.7 [67c 730q 0f 0s], Stage3D 0.7 [106c 195q 0f 0s]

## Race condition (1)

SDL_gpu 0.5 [0c 0q 2f 1238s]

## Heisenbug (11)

DirectX Raytracing 1.6 [725c 0q 0f 0s], Mantle 1.1 [1149c 0q 1f 0s], SDL_Renderer 1.1 [0c 0q 0f 0s], HIP 1.0 [0c 0q 1f 0s], DispmanX 0.6 [0c 0q 0f 0s], GX 0.5 [0c 0q 0f 0s], GX2 0.4 [0c 0q 0f 0s], LibGCM 0.4 [0c 0q 0f 0s], NVN 0.4 [0c 0q 0f 0s], GXM 0.3 [0c 0q 0f 0s], GNM 0.2 [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
