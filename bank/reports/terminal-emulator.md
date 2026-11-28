# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: terminal.

## terminal-emulator

58 candidates; 43 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| Terminator | 506 | 11363 | 9171 | 1.00 | off-by-one | counts | npe | — |
| Hyper ⚠ counts said off-by-one | 1 | 4 | 22 | 0.93 | leak | judge (override) | leak | — |
| Contour ⚠ counts said npe | 0 | 8 | 10 | 0.71 | race | judge (override) | race | — |
| st | 1 | 1 | 28 | 0.70 | womm | pin | npe | — |
| Windows Terminal | 0 | 4 | 2 | 0.54 | npe | judge | npe | — |
| foot | 0 | 1 | 7 | 0.44 | race | judge | race | — |
| Tabby | 0 | 1 | 7 | 0.44 | leak | judge | leak | — |
| Terminal.app | 0 | 1 | 1 | 0.26 | off-by-one | judge | off-by-one | — |
| Terminology | 0 | 0 | 5 | 0.23 | race | judge | race | — |
| kitty | 0 | 0 | 4 | 0.21 | off-by-one | judge | off-by-one | — |
| xterm | 2 | 0 | 0 | 0.20 | off-by-one | judge | off-by-one | — |
| GNOME Terminal | 6 | 0 | 0 | 0.20 | off-by-one | judge | off-by-one | — |
| PuTTY | 0 | 1 | 0 | 0.17 | leak | judge | leak | — |
| Rio | 1 | 0 | 0 | 0.13 | race | judge | race | — |
| x3270 | 1 | 0 | 0 | 0.13 | bitflip | pin | heisenbug | — |
| Konsole ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| Alacritty ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| Guake ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Xfce Terminal ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Tilda ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Yakuake ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| WezTerm ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Ghostty ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| cool-retro-term | 0 | 0 | 0 | 0.00 | womm | pin | leak | — |
| VTE ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| libvterm ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mlterm ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| xst ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zutty ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Termit ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Sakura ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| QTerminal ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| MATE Terminal ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| GNOME Console ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Ptyxis ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Deepin Terminal ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| COSMIC Terminal ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Pantheon Terminal ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| kterm ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| QTermWidget ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| iTerm2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| Tilix ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| mintty ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| ConEmu ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| rxvt-unicode | 0 | 0 | 0 | 0.00 | womm | pin | leak | — |
| Eterm ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| xterm.js ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| pyte ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Tym ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| pw3270 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| suite3270 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| RUMBA ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Blackbox Terminal ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| kmscon ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| yeahconsole ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| GTKTerm ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| HyperACCESS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ZTerm ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): Contour (counts said npe, now race), Hyper (counts said off-by-one, now leak)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

## terminal-emulator
_Name a terminal emulator_

Works on my machine:
- [ ] st
- [ ] Zutty
- [ ] Terminology
- [ ] rxvt-unicode
- [ ] Eterm
- [ ] cool-retro-term
- [ ] xterm.js
- [ ] kitty
- [ ] iTerm2
- [ ] VTE
- [ ] other: 

Bit Flip:
- [ ] x3270
- [ ] ZTerm
- [ ] kterm
- [ ] zutty
- [ ] HyperACCESS
- [ ] pyte
- [ ] VTE
- [ ] ConEmu
- [ ] Windows Terminal
- [ ] kitty
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 159 |
| harvest | done | 401 |
| filter | done | 159 |
| compare | done | 0 |
| escalate | done | 60 |
| merge | done | 9 |
| obvious | done | 26 |
| recall | failed | 74 |
| dupes | pending |  |
| links | pending |  |
| precision | pending |  |
| report | pending |  |

## Precision sample

20/20 sampled answers are members (100%); 20/20 also have an acceptable tier. Not members: none.

## Pipeline report

Generated 2026-11-28 09:29 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/terminal-emulator.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (x3270; st, rxvt-unicode, cool-retro-term): the owner vets them
- scripts/bank/obvious-draft/terminal-emulator.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| filter kept | PASS | pass A kept 57, pass B kept 53 of 15625 harvested lines |
| obvious coverage | PASS | 31/31 obvious answers accepted |
| head recall | PASS | 60/60 real probe answers playable (100%); 0 Inbox-only, 0 added to the Inbox; misses:  (design/recall/terminal-emulator-probe.md) |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | PASS | 40/77 answers have a verified link (52%); prompt link yes |
| precision | PASS | 20/20 sampled answers are members (100%), 20/20 with acceptable tier |
| answer count | PASS | 77 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 3 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 8 | 8 |
| Works on my machine | 3 | 0 |
| Null pointer exception | 8 | 8 |
| Memory leak | 13 | 13 |
| Race condition | 17 | 17 |
| Heisenbug | 27 | 27 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 0.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## terminal-emulator
_Name a terminal emulator_

Works on my machine:
- [ ] st
- [ ] Zutty
- [ ] Terminology
- [ ] rxvt-unicode
- [ ] Eterm
- [ ] cool-retro-term
- [ ] xterm.js
- [ ] kitty
- [ ] iTerm2
- [ ] VTE
- [ ] other: 

Bit Flip:
- [ ] x3270
- [ ] ZTerm
- [ ] kterm
- [ ] zutty
- [ ] HyperACCESS
- [ ] pyte
- [ ] VTE
- [ ] ConEmu
- [ ] Windows Terminal
- [ ] kitty
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 159 |
| harvest | done | 401 |
| filter | done | 159 |
| compare | done | 0 |
| escalate | done | 60 |
| merge | done | 9 |
| obvious | done | 26 |
| recall | done | 0 |
| dupes | done | 0 |
| links | done | 31 |
| precision | done | 41 |
| report | running |  |
