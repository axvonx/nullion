# Scoring: terminal-emulator (Name a terminal emulator)

73 answers (Bit Flip and Works on my machine left out); 1 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (3%) | 2 | 0 |
| npe | 25 (34%) | 25 | 0 |
| leak | 1 (1%) | 1 | 0 |
| race | 14 (19%) | 14 | 0 |
| heisenbug | 31 (42%) | 31 | 0 |

Same tier as today: 73/73 (100%).

## Off-by-one (2)

PuTTY 4.7 [12216c 0q 42f 0s], xterm 4.5 [1391c 1022q 41f 0s]

## Null pointer exception (25)

Windows Terminal 4.3 [1992c 622q 1f 105548s], GNOME Terminal 4.1 [1101c 1375q 34f 0s], iTerm2 3.8 [1803c 1272q 3f 0s], Terminal.app 3.7 [1985c 444q 0f 0s], kitty 3.3 [1608c 0q 31f 35900s], Alacritty 3.0 [1003c 76q 40f 66348s], xterm.js 2.9 [0c 140q 0f 0s], Warp 2.8 [1549c 4q 9f 66161s], Konsole 2.8 [519c 363q 40f 0s], Hyper 2.8 [0c 145q 7f 44739s], WezTerm 2.8 [0c 4q 21f 29723s], MobaXterm 2.6 [0c 404q 4f 0s], ConEmu 2.4 [114c 652q 4f 9297s], SecureCRT 2.3 [424c 73q 0f 0s], Xshell 2.2 [0c 16q 0f 0s], Cmder 2.2 [0c 353q 3f 27014s], Guake 2.1 [0c 27q 19f 4665s], LXTerminal 2.1 [0c 25q 26f 195s], Xfce Terminal 2.1 [0c 121q 36f 0s], mintty 2.1 [227c 232q 3f 1803s], Tera Term 2.1 [1314c 88q 2f 0s], rxvt 2.1 [419c 258q 15f 0s], Tilix 2.0 [0c 9q 14f 5744s], Tabby 1.8 [0c 0q 8f 75623s]^, Ghostty 1.7 [0c 1q 20f 64563s]^

## Memory leak (1)

Console2 1.7 [0c 117q 0f 0s]

## Race condition (14)

Terminator 2.0 [157c 0q 27f 2703s], GNOME Console 2.0 [0c 0q 24f 0s], MATE Terminal 1.9 [0c 13q 30f 147s], Yakuake 1.9 [0c 7q 32f 0s], foot 1.8 [0c 0q 34f 0s], Tilda 1.7 [0c 9q 24f 1338s], Terminology 1.7 [0c 0q 25f 0s], QTerminal 1.5 [0c 0q 30f 728s], Sakura 1.4 [0c 6q 28f 235s], Contour 1.2 [0c 0q 13f 3100s], kmscon 1.2 [0c 0q 23f 1001s], Ptyxis 0.9 [0c 0q 23f 0s], libvterm 0.6 [0c 0q 3f 2005s], QTermWidget 0.4 [0c 0q 30f 609s]

## Heisenbug (31)

Fluent Terminal 1.9 [0c 0q 1f 0s], aterm 1.9 [0c 0q 0f 0s], hterm 1.8 [0c 0q 3f 0s], kterm 1.7 [0c 0q 6f 0s], Wterm 1.6 [0c 0q 6f 169s], mrxvt 1.6 [0c 0q 17f 0s], Termit 1.5 [0c 0q 11f 144s], ZOC 1.5 [166c 0q 0f 0s], Pantheon Terminal 1.4 [0c 0q 0f 0s], Rio 1.4 [0c 0q 0f 0s], ROXTerm 1.4 [0c 0q 18f 117s], xvt 1.4 [0c 0q 0f 0s], Eterm 1.4 [0c 0q 14f 0s], mlterm 1.3 [0c 0q 17f 0s], GTKTerm 1.3 [0c 0q 11f 141s], xst 1.3 [0c 0q 0f 0s], yaft 1.2 [0c 0q 3f 690s], HyperACCESS 1.2 [265c 0q 0f 0s], pw3270 1.2 [0c 0q 3f 87s], suite3270 1.2 [0c 0q 5f 0s], Deepin Terminal 1.1 [0c 0q 7f 179s], VTE 1.0 [0c 0q 0f 0s], Zutty 1.0 [0c 0q 13f 0s], yeahconsole 0.9 [0c 0q 13f 0s], fbterm 0.9 [0c 5q 14f 91s], ZTerm 0.8 [75c 0q 0f 0s], Blackbox Terminal 0.8 [0c 0q 8f 0s], COSMIC Terminal 0.8 [0c 0q 13f 604s], pyte 0.8 [0c 0q 2f 758s], RUMBA 0.6 [121c 0q 0f 0s], Tym 0.0* [0c 0q 0f 198s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
