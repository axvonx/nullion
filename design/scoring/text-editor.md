# Scoring: text-editor (Name a text editor)

147 answers (Bit Flip and Works on my machine left out); 27 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 7 (5%) | 7 | 0 |
| npe | 17 (12%) | 17 | 0 |
| leak | 19 (13%) | 19 | 0 |
| race | 19 (13%) | 19 | 0 |
| heisenbug | 85 (58%) | 85 | 0 |

Same tier as today: 147/147 (100%).

## Off-by-one (7)

VS Code 5.6 [26511c 975q 22f 195708s], vim 5.1 [9289c 0q 0f 41301s], vi 4.8 [6342c 97q 0f 0s], Notepad 4.8 [7041c 1137q 2f 0s], emacs 4.7 [9564c 20041q 56f 0s], Sublime Text 4.6 [3346c 3685q 17f 3025s], Notepad++ 4.4 [12980c 10155q 8f 30006s]

## Null pointer exception (17)

Atom 3.9 [2721c 3774q 7f 60673s], nano 3.9 [1984c 587q 59f 336s], gedit 3.5 [677c 625q 39f 0s], neovim 3.4 [3544c 2226q 48f 103887s], ne 2.4 [545c 0q 0f 0s], TextMate 2.4 [557c 1329q 1f 0s], Kate 2.2 [1206c 227q 43f 0s], Textpad 2.2 [263c 174q 1f 0s], vis 2.2 [0c 0q 0f 0s], micro 2.2 [0c 4q 35f 29997s], TextEdit 2.2 [1931c 264q 1f 0s], Brackets 2.1 [560c 1078q 7f 1519s], UltraEdit 2.1 [415c 126q 2f 0s], MacVim 2.0 [0c 1146q 3f 7899s], ee 2.0 [0c 0q 0f 0s], Zed 1.4 [4112c 0q 23f 95899s]^, Lapce 1.0* [0c 0q 14f 39136s]^

## Memory leak (19)

Geany 1.8 [826c 514q 45f 3766s], BBEdit 1.7 [672c 180q 2f 0s], jEdit 1.7 [184c 143q 17f 0s], EditPlus 1.7 [0c 32q 0f 0s], EmEditor 1.6 [198c 175q 2f 0s], Pulsar 1.6 [0c 68q 0f 0s], SciTE 1.5 [398c 136q 29f 0s], MS-DOS Editor 1.5 [1426c 0q 26f 14826s], TextWrangler 1.4 [0c 214q 0f 0s], EditPad 1.4 [0c 32q 0f 0s], Programmer's Notepad 1.4 [0c 49q 2f 0s], Komodo Edit 1.4 [362c 145q 5f 2202s], SlickEdit 1.4 [251c 34q 0f 0s], NotepadNext 1.3 [0c 0q 6f 14831s], XEmacs 1.2 [470c 68q 12f 0s], Lite XL 1.1 [0c 0q 20f 6572s], Aquamacs 1.0 [0c 201q 1f 0s], ghostwriter 1.0* [0c 0q 33f 5060s], deepin-editor 0.7 [0c 98q 7f 111s]

## Race condition (19)

ed 1.9 [3167c 0q 0f 0s], Mousepad 1.7 [438c 0q 35f 0s], retext 1.5 [0c 0q 19f 2067s], NEdit 1.5 [337c 5q 25f 0s], GNOME Text Editor 1.4 [657c 0q 30f 0s], Yi 1.4 [0c 0q 0f 1553s], Pluma 1.4 [292c 0q 28f 191s], PSPad 1.3 [125c 19q 5f 0s], Zile 1.3 [0c 0q 28f 0s], Bluefish 1.2 [442c 0q 34f 0s], VimR 1.2 [0c 10q 1f 0s], XEDIT 1.2 [361c 0q 20f 0s], Leafpad 1.2 [399c 0q 29f 76s], SAKURA Editor 1.1 [37c 6q 28f 0s], Notepadqq 1.1 [0c 0q 13f 2338s], CudaText 0.9 [0c 0q 6f 3256s], FeatherPad 0.9 [316c 0q 27f 525s], kibi 0.4 [0c 0q 12f 1965s], ox 0.0* [0c 0q 0f 3755s]

## Heisenbug (85)

pico 1.9 [972c 0q 0f 0s], le 1.9 [0c 0q 0f 58s], KWrite 1.7 [281c 7q 4f 0s], SimpleText 1.6 [0c 0q 1f 6s], NoteTab 1.6 [0c 0q 0f 0s], VZ Editor 1.6 [0c 0q 0f 0s], Edlin 1.5 [691c 0q 5f 23s], VEDIT 1.5 [61c 0q 0f 0s], sam 1.5 [932c 0q 0f 0s], QED 1.5 [578c 0q 0f 13s], jed 1.4 [226c 0q 0f 65s], se 1.4 [10c 0q 0f 40s], MicroEMACS 1.4 [927c 0q 7f 0s], l3afpad 1.4 [0c 0q 15f 80s], Panic Nova 1.4 [0c 0q 0f 0s], JOE 1.3 [433c 0q 0f 70s], Elvis 1.3 [293c 3q 0f 0s], mg 1.3 [0c 0q 0f 0s], vile 1.3 [256c 0q 16f 0s], ConTEXT 1.3 [0c 0q 3f 1s], Multi-Edit 1.2 [0c 0q 0f 0s], CotEditor 1.2 [0c 0q 1f 0s], Metapad 1.2 [141c 0q 1f 0s], EDT 1.2 [0c 0q 0f 0s], Crimson Editor 1.1 [67c 0q 0f 0s], levee 1.1 [0c 0q 3f 0s], Programmer's File Editor 1.1 [71c 0q 0f 0s], nvi 1.1 [590c 0q 5f 201s], xnedit 1.1 [0c 0q 7f 131s], Editra 1.1 [46c 0q 4f 0s], RJ TextEd 1.0 [48c 0q 0f 0s], TECO 1.0 [969c 1q 7f 203s], Stevie 1.0 [330c 0q 0f 0s], Meadow 1.0 [0c 0q 0f 0s], Yudit 1.0 [27c 0q 14f 0s], Vigor 1.0 [0c 0q 5f 0s], Scribes 1.0 [18c 0q 2f 0s], qemacs 1.0 [0c 0q 13f 246s], ex 1.0* [1458c 0q 0f 0s], TEA 1.0* [103c 0q 0f 0s], Smultron 1.0 [0c 0q 3f 0s], kilo 1.0* [0c 0q 0f 0s], tilde 1.0* [0c 0q 8f 0s], Alpha 1.0* [0c 0q 1f 0s], Textadept 1.0 [146c 1q 9f 928s], JOVE 1.0 [176c 0q 14f 0s], xcoral 0.9 [0c 0q 6f 0s], Cooledit 0.9 [0c 0q 9f 15s], THE 0.9 [0c 0q 0f 0s], Jedit Ω 0.9 [0c 0q 1f 0s], Gobby 0.9 [61c 0q 16f 583s], JuffEd 0.9 [0c 0q 9f 54s], Acme 0.9 [1473c 0q 0f 0s], Hemlock 0.8 [75c 0q 0f 0s], gPHPedit 0.8 [0c 0q 4f 0s], Language-Sensitive Editor 0.8 [67c 0q 0f 0s], jupp 0.8 [0c 0q 14f 0s], SubEthaEdit 0.8 [0c 0q 1f 0s], TeachText 0.8 [0c 0q 0f 0s], Phoenix Code 0.7 [0c 0q 2f 107s] ...

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
