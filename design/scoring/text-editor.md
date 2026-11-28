# Scoring: text-editor (Name a text editor)

147 answers (Bit Flip and Works on my machine left out); 27 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 7 (5%) | 7 | 0 |
| npe | 15 (10%) | 15 | 0 |
| leak | 18 (12%) | 36 | 0 |
| race | 22 (15%) | 23 | 0 |
| heisenbug | 85 (58%) | 66 | 0 |

Same tier as today: 97/147 (66%).

## Off-by-one (7)

VS Code 5.6 [26511c 975q 22f], vim 5.1 [9289c 0q 62f], vi 4.8 [0c 2798q 2f], Notepad 4.8 [7041c 1137q 2f], emacs 4.7 [9564c 20041q 56f], Sublime Text 4.6 [3346c 3685q 17f], Notepad++ 4.4 [12980c 10155q 8f]

## Null pointer exception (15)

Atom 3.9 [2721c 3774q 7f], nano 3.9 [1984c 587q 59f], gedit 3.5 [677c 625q 39f], neovim 3.4 [3544c 2226q 48f], ne 2.4 [0c 0q 0f], TextMate 2.4 [557c 1329q 1f], Kate 2.2 [1206c 227q 43f], Textpad 2.2 [263c 174q 1f], vis 2.2 [0c 0q 0f], micro 2.2 [0c 4q 35f], TextEdit 2.2 [1931c 264q 1f], Brackets 2.1 [560c 1078q 7f], UltraEdit 2.1 [0c 126q 2f], MacVim 2.0 [0c 1146q 3f], ee 2.0 [0c 0q 9f]

## Memory leak (18)

ed 1.9 [3167c 159q 45f], Geany 1.8 [826c 514q 45f], BBEdit 1.7 [672c 180q 2f], jEdit 1.7 [184c 143q 17f], EmEditor 1.6 [0c 175q 2f], Pulsar 1.6 [0c 68q 0f], SciTE 1.5 [398c 136q 29f], TextWrangler 1.4 [0c 214q 0f], Komodo Edit 1.4 [362c 145q 5f], XEmacs 1.2 [0c 68q 12f], EDT 1.2 [0c 57q 1f], Aquamacs 1.0 [0c 201q 1f], Alpha 1.0* [0c 1803q 1f], Acme 0.9 [0c 80q 0f], deepin-editor 0.7 [0c 98q 7f], dte 0.0* [0c 570q 14f], mle 0.0* [0c 376q 15f], EVE 0.0* [0c 481q 5f]

## Race condition (22)

EditPlus 1.7 [0c 32q 0f], Mousepad 1.7 [0c 0q 35f], MS-DOS Editor 1.5 [1426c 0q 26f], NEdit 1.5 [337c 5q 25f], GNOME Text Editor 1.4 [657c 0q 30f], jed 1.4 [226c 0q 25f], EditPad 1.4 [0c 32q 0f], Zed 1.4 [0c 0q 23f], Programmer's Notepad 1.4 [0c 49q 2f], SlickEdit 1.4 [0c 34q 0f], Pluma 1.4 [0c 0q 28f], Zile 1.3 [0c 0q 28f], JOE 1.3 [433c 13q 41f], mg 1.3 [0c 0q 27f], Bluefish 1.2 [442c 18q 34f], XEDIT 1.2 [0c 0q 20f], Leafpad 1.2 [399c 0q 29f], Lite XL 1.1 [0c 0q 20f], SAKURA Editor 1.1 [0c 6q 28f], ghostwriter 1.0* [0c 0q 33f], FeatherPad 0.9 [0c 0q 27f], GNU moe 0.6 [0c 0q 20f]

## Heisenbug (85)

pico 1.9 [972c 0q 0f], le 1.9 [0c 0q 13f], KWrite 1.7 [0c 7q 4f], SimpleText 1.6 [0c 0q 1f], NoteTab 1.6 [0c 0q 0f], VZ Editor 1.6 [0c 0q 0f], Edlin 1.5 [691c 0q 5f], VEDIT 1.5 [0c 0q 0f], retext 1.5 [0c 0q 19f], sam 1.5 [932c 0q 0f], QED 1.5 [0c 0q 2f], se 1.4 [0c 0q 8f], MicroEMACS 1.4 [927c 0q 7f], l3afpad 1.4 [0c 0q 15f], Yi 1.4 [0c 0q 2f], Panic Nova 1.4 [0c 0q 0f], PSPad 1.3 [0c 19q 5f], Elvis 1.3 [0c 3q 0f], vile 1.3 [256c 0q 16f], NotepadNext 1.3 [0c 0q 6f], ConTEXT 1.3 [0c 16q 3f], Multi-Edit 1.2 [0c 0q 0f], VimR 1.2 [0c 10q 1f], CotEditor 1.2 [0c 0q 1f], Metapad 1.2 [0c 0q 1f], Crimson Editor 1.1 [0c 0q 0f], levee 1.1 [0c 0q 3f], Programmer's File Editor 1.1 [0c 0q 0f], nvi 1.1 [590c 4q 15f], xnedit 1.1 [0c 0q 7f], Notepadqq 1.1 [0c 0q 13f], Editra 1.1 [0c 0q 4f], RJ TextEd 1.0 [0c 0q 0f], TECO 1.0 [969c 1q 7f], Meadow 1.0 [0c 0q 0f], Stevie 1.0 [0c 0q 0f], Yudit 1.0 [27c 0q 14f], Vigor 1.0 [0c 13q 5f], qemacs 1.0 [0c 0q 13f], Scribes 1.0 [0c 0q 2f], tilde 1.0* [0c 0q 8f], Lapce 1.0* [0c 0q 14f], Smultron 1.0 [0c 0q 3f], TEA 1.0* [0c 0q 0f], kilo 1.0* [0c 0q 0f], ex 1.0* [0c 0q 1f], Textadept 1.0 [0c 1q 9f], JOVE 1.0 [176c 0q 14f], xcoral 0.9 [0c 0q 6f], CudaText 0.9 [0c 0q 6f], Cooledit 0.9 [0c 0q 9f], THE 0.9 [0c 0q 6f], Jedit Ω 0.9 [0c 0q 1f], Gobby 0.9 [61c 0q 16f], JuffEd 0.9 [0c 0q 9f], gPHPedit 0.8 [0c 0q 4f], Hemlock 0.8 [0c 0q 0f], Language-Sensitive Editor 0.8 [0c 0q 0f], jupp 0.8 [0c 0q 14f], SubEthaEdit 0.8 [0c 0q 1f] ...

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
