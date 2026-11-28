# Familiarity scoring: text-editor (Name a text editor)

147 tiered answers (Bit Flip and Works on my machine left out). Jev: 1s. Haiku: 21s.
Level bands -> tier: [(5.5, 'off-by-one'), (4.0, 'npe'), (2.6, 'leak'), (1.3, 'race'), (0.0, 'heisenbug')]

## Rank correlation (Spearman)

| | Jev | Haiku | source score | bank tier |
|---|---|---|---|---|
| Jev | 1.00 | 0.40 | 0.39 (n=141) | 0.48 |
| Haiku | 0.40 | 1.00 | 0.51 (n=141) | 0.59 |

## Tier agreement (exact / within one tier)

- Jev vs bank: 34% / 76%
- Haiku vs bank: 47% / 71%
- Jev vs Haiku: 56% / 99%

## Answers per tier

| tier | bank | Jev | Haiku |
|---|---|---|---|
| off-by-one | 8 | 1 | 4 |
| npe | 32 | 6 | 6 |
| leak | 19 | 5 | 4 |
| race | 22 | 72 | 15 |
| heisenbug | 66 | 63 | 118 |

## Jev's top 25

VS Code 5.6, vim 5.1, vi 4.8, Notepad 4.8, emacs 4.7, Sublime Text 4.6, Notepad++ 4.4, Atom 3.9, nano 3.9, gedit 3.5, neovim 3.4, Lapce 2.8, fte 2.5, ne 2.4, mined 2.4, TextMate 2.4, efte 2.3, Xed 2.3, Kate 2.2, Textpad 2.2, tilde 2.2, vis 2.2, micro 2.2, ved 2.2, TextEdit 2.2

## Biggest Jev / Haiku disagreements

| answer | bank | Jev | Haiku |
|---|---|---|---|
| fte | heisenbug | 2.5 | 0 |
| ne | race | 2.4 | 0 |
| mined | heisenbug | 2.4 | 0 |
| efte | heisenbug | 2.3 | 0 |
| Xed | leak | 2.3 | 0 |
| vis | race | 2.2 | 0 |
| ved | heisenbug | 2.2 | 0 |
| amp | race | 2.0 | 0 |
| neatvi | heisenbug | 2.0 | 0 |
| Zmacs | heisenbug | 2.0 | 0 |
| EVE | heisenbug | 1.9 | 0 |
| EINE | heisenbug | 1.9 | 0 |
| le | heisenbug | 1.9 | 0 |
| mle | heisenbug | 1.9 | 0 |
| Lapce | leak | 2.8 | 1 |
| TextEdit | off-by-one | 2.2 | 4 |
| e3 | heisenbug | 1.6 | 0 |
| ZWEI | heisenbug | 1.6 | 0 |
| VZ Editor | heisenbug | 1.6 | 0 |
| ox | heisenbug | 1.5 | 0 |
| Pragtical | heisenbug | 1.5 | 0 |
| enki | heisenbug | 1.5 | 0 |
| se | heisenbug | 1.4 | 0 |
| EditPad | npe | 1.4 | 0 |
| VS Code | off-by-one | 5.6 | 7 |
