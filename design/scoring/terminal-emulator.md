# Scoring: terminal-emulator (Name a terminal emulator)

73 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (3%) | 8 | 0 |
| npe | 23 (32%) | 8 | 0 |
| leak | 4 (5%) | 13 | 0 |
| race | 12 (16%) | 17 | 0 |
| heisenbug | 32 (44%) | 27 | 0 |

Same tier as today: 37/73 (51%).

## Off-by-one (2)

PuTTY 4.7 [12216c 4967q 42f], xterm 4.5 [1391c 1022q 41f]

## Null pointer exception (23)

Windows Terminal 4.3 [1992c 622q 1f], GNOME Terminal 4.1 [1101c 1375q 34f], iTerm2 3.8 [1803c 1272q 3f], Terminal.app 3.7 [1985c 444q 0f], kitty 3.3 [1608c 0q 31f], Alacritty 3.0 [1003c 76q 40f], xterm.js 2.9 [0c 140q 0f], Warp 2.8 [0c 93q 9f], Konsole 2.8 [519c 363q 40f], Hyper 2.8 [0c 299q 7f], WezTerm 2.8 [0c 4q 21f], MobaXterm 2.6 [0c 404q 4f], ConEmu 2.4 [114c 652q 4f], SecureCRT 2.3 [424c 73q 0f], Xshell 2.2 [0c 16q 0f], Cmder 2.2 [0c 353q 3f], Guake 2.1 [0c 27q 19f], LXTerminal 2.1 [0c 25q 26f], Xfce Terminal 2.1 [0c 121q 36f], mintty 2.1 [227c 232q 3f], Tera Term 2.1 [1314c 88q 2f], rxvt 2.1 [419c 258q 15f], Tilix 2.0 [0c 9q 14f]

## Memory leak (4)

Terminator 2.0 [157c 263q 27f], Terminology 1.7 [0c 2692q 25f], Console2 1.7 [0c 117q 0f], Contour 1.2 [0c 2777q 13f]

## Race condition (12)

GNOME Console 2.0 [0c 0q 24f], MATE Terminal 1.9 [0c 13q 30f], Yakuake 1.9 [0c 7q 32f], foot 1.8 [0c 0q 34f], Tilda 1.7 [0c 9q 24f], Ghostty 1.7 [0c 1q 20f], QTerminal 1.5 [0c 0q 30f], Sakura 1.4 [0c 6q 28f], kmscon 1.2 [0c 0q 23f], VTE 1.0 [0c 45q 42f], Ptyxis 0.9 [0c 0q 23f], QTermWidget 0.4 [0c 0q 30f]

## Heisenbug (32)

Fluent Terminal 1.9 [0c 0q 1f], aterm 1.9 [0c 0q 0f], Tabby 1.8 [0c 3q 8f], hterm 1.8 [0c 0q 3f], kterm 1.7 [0c 0q 6f], Wterm 1.6 [0c 0q 6f], mrxvt 1.6 [0c 0q 17f], Termit 1.5 [0c 0q 11f], ZOC 1.5 [166c 0q 1f], Pantheon Terminal 1.4 [0c 0q 0f], Rio 1.4 [0c 17q 3f], ROXTerm 1.4 [0c 0q 18f], xvt 1.4 [0c 0q 2f], Eterm 1.4 [0c 0q 14f], mlterm 1.3 [0c 0q 17f], GTKTerm 1.3 [0c 0q 11f], xst 1.3 [0c 7q 0f], yaft 1.2 [0c 0q 3f], HyperACCESS 1.2 [265c 0q 0f], pw3270 1.2 [0c 0q 3f], suite3270 1.2 [0c 0q 5f], Deepin Terminal 1.1 [0c 0q 7f], Zutty 1.0 [0c 0q 13f], yeahconsole 0.9 [0c 0q 13f], fbterm 0.9 [0c 5q 14f], ZTerm 0.8 [75c 0q 0f], COSMIC Terminal 0.8 [0c 0q 13f], Blackbox Terminal 0.8 [0c 0q 8f], pyte 0.8 [0c 0q 2f], libvterm 0.6 [0c 0q 3f], RUMBA 0.6 [0c 0q 0f], Tym 0.0* [0c 0q 4f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
