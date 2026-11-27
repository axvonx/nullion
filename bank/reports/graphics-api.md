# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: graphics, GPU, rendering.

## graphics-api

20 candidates; 7 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| OpenGL | 6 | 68 | 45 | 1.00 | off-by-one | counts | off-by-one | — |
| Vulkan | 6 | 29 | 30 | 0.99 | off-by-one | counts | off-by-one | — |
| Metal | 0 | 27 | 174 | 0.80 | npe | counts | npe | — |
| WebGPU | 0 | 12 | 33 | 0.71 | npe | counts | npe | — |
| Direct3D ⚠ counts said leak | 0 | 5 | 14 | 0.52 | off-by-one | judge (override) | off-by-one | — |
| OpenGL ES | 0 | 8 | 3 | 0.42 | npe | judge | npe | — |
| Glide | 0 | 2 | 10 | 0.40 | womm | pin | race | — |
| GX | 0 | 3 | 6 | 0.39 | race | judge | race | — |
| Mantle | 0 | 3 | 3 | 0.32 | race | judge | race | — |
| OpenVG | 0 | 8 | 0 | 0.26 | womm | pin | leak | — |
| GX2 | 1 | 0 | 0 | 0.20 | bitflip | pin | race | — |
| GNM | 0 | 0 | 3 | 0.16 | heisenbug | judge | heisenbug | — |
| GDI | 0 | 0 | 1 | 0.08 | womm | pin | npe | — |
| NVN | 0 | 0 | 1 | 0.08 | heisenbug | judge | heisenbug | — |
| GXM ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| deko3d ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SDL_gpu ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| DispmanX ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| XVideo ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| SDL_Renderer ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): Direct3D (counts said leak, now off-by-one)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

## Pipeline report

Generated 2026-11-27 23:04 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

**INCOMPLETE RUN: stage obvious failed: GATE FAILED: Bit Flip pin: the Bit Flip 'GX2' is an obvious answer: pick a deep cut (edit the bank file's ## Bit Flip, then rerun with --from merge)**

Needs a human look:
- scripts/bank/plans/graphics-api.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (GX2; OpenVG, Glide, GDI): the owner vets them
- scripts/bank/obvious-draft/graphics-api.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| Bit Flip pin | FAIL | the Bit Flip 'GX2' is an obvious answer: pick a deep cut (edit the bank file's ## Bit Flip, then rerun with --from merge) |
| answer count | WARN | 32 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 3 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 4 | 4 |
| Works on my machine | 3 | 0 |
| Null pointer exception | 15 | 15 |
| Memory leak | 0 | 0 |
| Race condition | 6 | 6 |
| Heisenbug | 3 | 3 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 1.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## graphics-api
_Name a graphics API_

Works on my machine:
- [ ] OpenVG
- [ ] WebGPU
- [ ] GDI
- [ ] Glide
- [ ] deko3d
- [ ] GX
- [ ] other: 

Bit Flip:
- [ ] deko3d
- [ ] GXM
- [ ] GX2
- [ ] OpenVG
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 10 |
| harvest | done | 4 |
| filter | done | 54 |
| compare | done | 0 |
| escalate | done | 17 |
| merge | done | 7 |
| obvious | failed | 32 |
| dupes | pending |  |
| links | pending |  |
| precision | pending |  |
| report | pending |  |
