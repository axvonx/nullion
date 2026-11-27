# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: cipher.

## historical-cipher

20 candidates; 5 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| Caesar cipher | 0 | 24 | 7 | 0.80 | npe | counts | off-by-one | — |
| Vigenère cipher | 0 | 32 | 13 | 0.80 | npe | counts | off-by-one | — |
| Simple substitution | 0 | 19 | 6 | 0.77 | npe | counts | npe | — |
| Enigma | 0 | 15 | 6 | 0.74 | npe | counts | off-by-one | — |
| Affine cipher | 0 | 11 | 27 | 0.73 | npe | counts | leak | — |
| Playfair cipher | 0 | 14 | 1 | 0.49 | leak | counts | npe | — |
| Columnar transposition | 0 | 5 | 2 | 0.45 | leak | judge | leak | — |
| Autokey cipher | 0 | 4 | 1 | 0.35 | race | judge | race | — |
| M-209 | 0 | 1 | 1 | 0.23 | bitflip | pin | race | — |
| Bifid cipher | 0 | 3 | 0 | 0.19 | race | judge | race | — |
| Beaufort cipher | 0 | 2 | 0 | 0.15 | race | judge | race | — |
| ADFGVX | 0 | 1 | 0 | 0.09 | womm | pin | race | — |
| Porta cipher | 0 | 1 | 0 | 0.09 | heisenbug | judge | heisenbug | — |
| Rail fence cipher | 0 | 1 | 0 | 0.09 | womm | pin | npe | — |
| ADFGX ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Atbash | 0 | 0 | 0 | 0.00 | womm | pin | leak | — |
| Four-square cipher ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Fractionated Morse ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Gronsfeld cipher ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Polybius square ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): none

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

20/20 sampled answers are members (100%); 12/20 also have an acceptable tier. Not members: none.

## Pipeline report

Generated 2026-11-27 18:59 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/historical-cipher.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (M-209; Atbash, Rail fence cipher, ADFGVX): the owner vets them
- scripts/bank/obvious-draft/historical-cipher.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 31/31 obvious answers accepted |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | PASS | 34/36 answers have a verified link (94%); prompt link yes |
| precision | PASS | 20/20 sampled answers are members (100%), 12/20 with acceptable tier |
| answer count | WARN | 36 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 3 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 1 | 1 |
| Works on my machine | 3 | 0 |
| Null pointer exception | 20 | 20 |
| Memory leak | 3 | 3 |
| Race condition | 5 | 5 |
| Heisenbug | 3 | 3 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 0.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## historical-cipher
_Name a historical cipher_

Works on my machine:
- [ ] Playfair cipher
- [ ] Atbash
- [ ] ADFGVX
- [ ] Rail fence cipher
- [ ] Polybius square
- [ ] other: 

Bit Flip:
- [ ] M-209
- [ ] Gronsfeld cipher
- [ ] Porta cipher
- [ ] Fractionated Morse
- [ ] Porta
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 20 |
| harvest | done | 0 |
| filter | done | 35 |
| compare | done | 0 |
| escalate | done | 11 |
| merge | done | 8 |
| obvious | done | 23 |
| dupes | done | 0 |
| links | done | 15 |
| precision | done | 40 |
| report | running |  |
