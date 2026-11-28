# Scoring: graphics-api (Name a graphics API)

28 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 3 (11%) | 3 | 0 |
| npe | 4 (14%) | 4 | 0 |
| leak | 8 (29%) | 6 | 0 |
| race | 2 (7%) | 3 | 0 |
| heisenbug | 11 (39%) | 12 | 0 |

Same tier as today: 25/28 (89%).

## Off-by-one (3)

OpenGL 5.0 [10675c 38497q 3f], OpenGL ES 5.0* [1920c 14050q 0f], Direct3D 4.5 [4349c 6088q 3f]

## Null pointer exception (4)

Vulkan 3.6 [15260c 2412q 13f], WebGL 3.5 [5337c 6789q 0f], Metal 3.0 [3899c 2215q 2f], CUDA 2.7 [18947c 14772q 16f]

## Memory leak (8)

Direct2D 1.9 [509c 752q 0f], OpenCL 1.7 [3503c 5788q 0f], WebGPU 1.7 [4726c 112q 0f], DirectDraw 1.5 [503c 89q 0f], DirectCompute 1.5 [133c 80q 0f], SYCL 1.1 [1068c 171q 0f], RenderScript 0.7 [67c 730q 0f], Stage3D 0.7 [106c 195q 0f]

## Race condition (2)

OptiX 1.1 [397c 44q 3f], HIP 1.0 [3147c 25q 2f]

## Heisenbug (11)

DirectX Raytracing 1.6 [725c 0q 0f], Mantle 1.1 [1149c 9q 1f], SDL_Renderer 1.1 [0c 0q 0f], DispmanX 0.6 [0c 0q 0f], SDL_gpu 0.5 [0c 0q 2f], GX 0.5 [0c 0q 4f], GX2 0.4 [0c 0q 0f], LibGCM 0.4 [0c 0q 0f], NVN 0.4 [0c 0q 0f], GXM 0.3 [0c 0q 0f], GNM 0.2 [0c 7q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
