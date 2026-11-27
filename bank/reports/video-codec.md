# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: video, codec.

## video-codec

101 candidates; 61 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| HEVC | 85 | 796 | 295 | 1.00 | off-by-one | counts | off-by-one | — |
| H.264 | 21 | 1665 | 165 | 0.97 | off-by-one | counts | off-by-one | — |
| DV | 65 | 852 | 121 | 0.95 | off-by-one | counts | npe | — |
| AVS ⚠ counts said npe | 2 | 107 | 318 | 0.75 | race | judge (override) | race | — |
| VVC | 0 | 399 | 211 | 0.75 | npe | counts | leak | — |
| AV1 | 7 | 67 | 69 | 0.70 | npe | counts | off-by-one | — |
| MPEG-2 | 11 | 315 | 10 | 0.68 | npe | counts | off-by-one | — |
| VP9 | 15 | 27 | 18 | 0.59 | npe | counts | off-by-one | — |
| Mimic ⚠ counts said leak | 0 | 11 | 248 | 0.55 | heisenbug | judge (override) | heisenbug | — |
| H.263 | 1 | 163 | 2 | 0.43 | leak | counts | npe | — |
| LOCO ⚠ counts said leak | 0 | 4 | 61 | 0.40 | heisenbug | judge (override) | heisenbug | — |
| VP8 | 17 | 4 | 2 | 0.36 | leak | counts | npe | — |
| Aura | 0 | 6 | 13 | 0.31 | race | counts | heisenbug | — |
| AVS3 | 0 | 15 | 6 | 0.31 | race | counts | race | — |
| VC-1 | 0 | 17 | 3 | 0.27 | race | counts | leak | — |
| DFA | 0 | 3 | 11 | 0.26 | race | counts | heisenbug | — |
| LCEVC | 0 | 14 | 3 | 0.26 | race | counts | race | — |
| Daala | 0 | 6 | 6 | 0.26 | leak | judge | leak | — |
| LEAD Video | 0 | 1 | 18 | 0.25 | race | counts | heisenbug | — |
| AVS2 | 0 | 12 | 3 | 0.25 | race | counts | race | — |
| EVC | 0 | 3 | 8 | 0.24 | race | judge | race | — |
| H.261 | 0 | 23 | 1 | 0.24 | race | counts | leak | — |
| ASV | 0 | 2 | 10 | 0.24 | race | counts | heisenbug | — |
| Motion JPEG ⚠ counts said race | 0 | 13 | 2 | 0.24 | npe | judge (override) | npe | — |
| Hap | 1 | 1 | 6 | 0.23 | race | judge | race | — |
| Dirac | 0 | 9 | 2 | 0.22 | womm | pin | leak | — |
| IVI | 0 | 3 | 5 | 0.21 | heisenbug | judge | heisenbug | — |
| BMV | 0 | 1 | 2 | 0.12 | heisenbug | judge | heisenbug | — |
| FFV1 | 0 | 1 | 2 | 0.12 | leak | judge | leak | — |
| FLIC | 0 | 0 | 4 | 0.12 | race | judge | race | — |
| Cinepak | 0 | 1 | 1 | 0.09 | womm | pin | leak | — |
| APV | 0 | 1 | 1 | 0.09 | race | judge | race | — |
| Argo | 0 | 3 | 0 | 0.08 | heisenbug | judge | heisenbug | — |
| AGM | 0 | 0 | 2 | 0.08 | heisenbug | judge | heisenbug | — |
| LCL | 0 | 0 | 2 | 0.08 | heisenbug | judge | heisenbug | — |
| Xvid | 2 | 0 | 0 | 0.07 | npe | judge | npe | — |
| AASC | 0 | 0 | 1 | 0.05 | heisenbug | judge | heisenbug | — |
| ANM | 0 | 0 | 1 | 0.05 | heisenbug | judge | heisenbug | — |
| BFI | 0 | 0 | 1 | 0.05 | heisenbug | judge | heisenbug | — |
| Sorenson Spark | 1 | 0 | 0 | 0.04 | race | judge | race | — |
| CPiA | 1 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| Huffyuv | 0 | 1 | 0 | 0.04 | leak | judge | leak | — |
| 4X Movie ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| 8BPS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Apple Intermediate Codec ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Bink Video ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| C93 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CDXL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ClearVideo ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CLJR ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Canopus Lossless ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CSCD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CYUV ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| DNxHD ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| DXA ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Dxtory ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| DXV ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Mirillis FIC ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Flash Screen Video ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Fraps ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| GoToMeeting Codec ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Canopus HQX ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| IMM4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| IMM5 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Indeo 2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Indeo 3 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Indeo 4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Indeo 5 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Lagarith ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| MagicYUV ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Theora | 0 | 0 | 0 | 0.00 | womm | pin | leak | — |
| CineForm ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| DNxUC ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FMVC ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| HQA ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Canopus HQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ARBC ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| AVUI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| BRender Pixel ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| 012v ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Alias PIX ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Bethsoft Video ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CRI Video ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Gremlin Digital Video ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| HNM4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| IMM6 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Interplay Video ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| IDCIN ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| IntraX8 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| KMVC ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| KGV1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| LSCR ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| M101 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MDEC ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MidiVid ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| EA MAD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| EA TGV ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| EA TGQ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| EA TQI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Escape 124 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Escape 130 | 0 | 0 | 0 | 0.00 | bitflip | pin | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): AVS (counts said npe, now race), Mimic (counts said leak, now heisenbug), Motion JPEG (counts said race, now npe), LOCO (counts said leak, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

19/20 sampled answers are members (95%); 18/20 also have an acceptable tier. Not members: LEAD Video (LEAD Technologies made video codecs, but I can't confirm the exact name 'LEAD Video' as a codec kind from a source, so under the strict rule it's out.).

## Pipeline report

Generated 2026-11-27 22:49 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/video-codec.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (Escape 130; Theora, Cinepak, Dirac): the owner vets them
- scripts/bank/obvious-draft/video-codec.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 31/31 obvious answers accepted |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | WARN | 42/110 answers have a verified link (38%); prompt link yes |
| precision | PASS | 19/20 sampled answers are members (95%), 18/20 with acceptable tier |
| answer count | PASS | 110 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 3 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 3 | 3 |
| Works on my machine | 3 | 0 |
| Null pointer exception | 15 | 15 |
| Memory leak | 10 | 10 |
| Race condition | 25 | 25 |
| Heisenbug | 53 | 53 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 0.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## video-codec
_Name a video codec_

Works on my machine:
- [ ] Theora
- [ ] FFV1
- [ ] Cinepak
- [ ] Dirac
- [ ] Daala
- [ ] other: 

Bit Flip:
- [ ] Bink Video
- [ ] Lagarith
- [ ] Indeo 5
- [ ] Escape 130
- [ ] Argo
- [ ] M101
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 9 |
| harvest | done | 2 |
| filter | done | 118 |
| compare | done | 0 |
| escalate | done | 29 |
| merge | done | 8 |
| obvious | done | 21 |
| dupes | done | 0 |
| links | done | 17 |
| precision | done | 22 |
| report | running |  |
