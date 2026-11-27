# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: text editor, editor.

## text-editor

64 candidates; 44 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| THE ⚠ counts said off-by-one | 41 | 4768 | 1528 | 1.00 | heisenbug | judge (override) | heisenbug | — |
| se ⚠ counts said npe | 12 | 6 | 6 | 0.83 | heisenbug | judge (override) | heisenbug | — |
| mined ⚠ counts said npe | 0 | 31 | 24 | 0.80 | heisenbug | judge (override) | heisenbug | — |
| vis ⚠ counts said npe | 6 | 10 | 2 | 0.75 | race | judge (override) | race | — |
| vi | 6 | 10 | 2 | 0.75 | npe | counts | off-by-one | — |
| emacs | 8 | 4 | 5 | 0.75 | off-by-one | judge | off-by-one | — |
| micro | 0 | 7 | 8 | 0.69 | npe | judge | npe | — |
| vim | 3 | 4 | 4 | 0.65 | off-by-one | judge | off-by-one | — |
| le | 8 | 4 | 2 | 0.64 | heisenbug | judge | heisenbug | — |
| nano | 0 | 2 | 12 | 0.58 | npe | counts | off-by-one | — |
| VS Code ⚠ counts said leak | 2 | 0 | 12 | 0.50 | off-by-one | judge (override) | off-by-one | — |
| sam | 0 | 3 | 4 | 0.48 | race | judge | race | — |
| amp | 0 | 4 | 2 | 0.44 | race | judge | race | — |
| gedit | 0 | 0 | 7 | 0.32 | npe | judge | npe | — |
| jEdit | 0 | 0 | 6 | 0.30 | leak | judge | leak | — |
| Sublime Text | 2 | 0 | 1 | 0.21 | off-by-one | judge | off-by-one | — |
| Helix | 2 | 0 | 1 | 0.21 | womm | pin | npe | — |
| Kate | 0 | 2 | 0 | 0.18 | npe | judge | npe | — |
| JOE | 6 | 0 | 0 | 0.18 | leak | judge | leak | — |
| NEdit | 0 | 1 | 0 | 0.12 | leak | judge | leak | — |
| Zed | 0 | 1 | 0 | 0.12 | npe | judge | npe | — |
| ne | 0 | 0 | 1 | 0.11 | race | judge | race | — |
| Vigor | 0 | 0 | 1 | 0.11 | race | judge | race | — |
| neovim ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| pico ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| GNOME Text Editor ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| MS-DOS Editor ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| JOVE ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FeatherPad ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Textadept ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Lite XL ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CudaText ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| NotepadNext ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| vile ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| mg ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MicroEMACS ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Zile ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Gobby ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Pragtical ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| dte ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| kibi ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Yudit ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Diakonos ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SciTECO | 0 | 0 | 0 | 0.00 | bitflip | pin | heisenbug | — |
| Kakoune | 0 | 0 | 0 | 0.00 | womm | pin | leak | — |
| jed ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| TECO ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Mousepad ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Leafpad ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Pluma ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Xed ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| SciTE ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Lapce ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Komodo Edit ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| nvi ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| mle ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ox ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| e3 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Cooledit ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| xcoral ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ved ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| retext ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ghostwriter ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| orbiton ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): VS Code (counts said leak, now off-by-one), vis (counts said npe, now race), mined (counts said npe, now heisenbug), THE (counts said off-by-one, now heisenbug), se (counts said npe, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

18/20 sampled answers are members (90%); 14/20 also have an acceptable tier. Not members: ox (Unsure a Unix editor named 'ox' exists in any source; too uncertain to keep. Tier would fit an obscure entry if it were real.), ved (Unsure a text editor named 'ved' exists in any source; too uncertain to keep.).

## Pipeline report

Generated 2026-11-27 19:06 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/text-editor.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (SciTECO; Kakoune, Helix): the owner vets them
- scripts/bank/obvious-draft/text-editor.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 32/32 obvious answers accepted |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | PASS | 54/76 answers have a verified link (71%); prompt link yes |
| precision | PASS | 18/20 sampled answers are members (90%), 14/20 with acceptable tier |
| answer count | PASS | 76 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 2 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 8 | 8 |
| Works on my machine | 2 | 0 |
| Null pointer exception | 18 | 18 |
| Memory leak | 13 | 13 |
| Race condition | 16 | 16 |
| Heisenbug | 18 | 18 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 1.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## text-editor
_Name a text editor_

Works on my machine:
- [ ] Kakoune
- [ ] TECO
- [ ] sam
- [ ] kakoune
- [ ] helix
- [ ] other: 

Bit Flip:
- [ ] Vigor
- [ ] SciTECO
- [ ] e3
- [ ] teco
- [ ] jove
- [ ] yudit
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 9 |
| harvest | done | 4 |
| filter | done | 63 |
| compare | done | 0 |
| escalate | done | 34 |
| merge | done | 8 |
| obvious | done | 19 |
| dupes | done | 0 |
| links | done | 35 |
| precision | done | 21 |
| report | running |  |
