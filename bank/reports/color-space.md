# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: color space.

## color-space

57 candidates; 43 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| sRGB | 1 | 1 | 27 | 0.80 | npe | counts | off-by-one | — |
| CIELAB | 0 | 26 | 18 | 0.80 | npe | counts | off-by-one | — |
| IPT | 0 | 1 | 1 | 0.55 | race | judge | race | — |
| CIELUV | 0 | 3 | 0 | 0.40 | womm | pin | npe | — |
| Oklab | 0 | 0 | 5 | 0.40 | womm | pin | leak | — |
| ACES | 0 | 0 | 1 | 0.15 | leak | judge | leak | — |
| Adobe RGB (1998) | 0 | 0 | 1 | 0.15 | npe | judge | npe | — |
| Apple RGB | 0 | 0 | 1 | 0.15 | leak | judge | leak | — |
| ColorMatch RGB | 0 | 0 | 1 | 0.15 | race | judge | race | — |
| DCI-P3 | 0 | 0 | 1 | 0.15 | npe | judge | npe | — |
| Rec. 2020 | 0 | 0 | 1 | 0.15 | npe | judge | npe | — |
| CAM16-UCS | 0 | 0 | 1 | 0.15 | race | judge | race | — |
| ProPhoto RGB | 0 | 0 | 1 | 0.15 | npe | judge | npe | — |
| Adobe Wide Gamut RGB ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Best RGB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Beta RGB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Canon Cinema Gamut ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| DCDM XYZ ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Display P3 ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Don RGB 4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ECI RGB v2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Ekta Space PS 5 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Rec. 709 ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Nikon N-Gamut ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| NTSC ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| PAL/SECAM ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Panasonic V-Gamut ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PLASA ANSI E1.54 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Russell RGB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SMPTE 240M ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| SMPTE-C ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| CAM02-UCS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CIE UCS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CIE UVW ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| DIN99 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| hdr-CIELAB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| hdr-IPT ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Hunter Lab ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ICaCb ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| IgPgTg | 0 | 0 | 0 | 0.00 | bitflip | pin | heisenbug | — |
| Jzazbz ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| OSA-UCS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| sUCS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Apple Wide Gamut RGB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CIE RGB ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| DaVinci Wide Gamut ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| DJI D-Gamut ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| EBU 3213-E ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ITU-R BT.470 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Max RGB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| P3-D65 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Xtreme RGB ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CIE xyY ⚠ no evidence | 1 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Hunter Rdab ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ProLab ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Ragoo 2021 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Yrg ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): none

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

18/20 sampled answers are members (90%); 17/20 also have an acceptable tier. Not members: PAL/SECAM (Two distinct TV colour encodings joined by a slash, not one named kind. The alias pal_secam is an identifier, not a name. Keep PAL and SECAM as separate entries if they are wanted.), ICaCb (I cannot confirm this as an established colour space name, and the rule says to reject when unsure it exists.).

## Pipeline report

Generated 2026-11-27 22:58 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/color-space.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (IgPgTg; Oklab, CIELUV): the owner vets them
- scripts/bank/obvious-draft/color-space.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 30/30 obvious answers accepted |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | PASS | 37/73 answers have a verified link (51%); prompt link yes |
| precision | PASS | 18/20 sampled answers are members (90%), 17/20 with acceptable tier |
| answer count | PASS | 73 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 2 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 5 | 5 |
| Works on my machine | 2 | 0 |
| Null pointer exception | 22 | 22 |
| Memory leak | 8 | 8 |
| Race condition | 17 | 17 |
| Heisenbug | 18 | 18 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 1.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## color-space
_Name a color space_

Works on my machine:
- [ ] Oklab
- [ ] CIELUV
- [ ] Display P3
- [ ] CAM16-UCS
- [ ] ICaCb
- [ ] Ekta Space PS5
- [ ] other: 

Bit Flip:
- [ ] Jzazbz
- [ ] IgPgTg
- [ ] DIN99
- [ ] Russell RGB
- [ ] Don RGB 4
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 13 |
| harvest | done | 3 |
| filter | done | 44 |
| compare | done | 0 |
| escalate | done | 27 |
| merge | done | 7 |
| obvious | done | 33 |
| dupes | done | 0 |
| links | done | 19 |
| precision | done | 22 |
| report | running |  |
