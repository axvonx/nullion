# Scope: Name a terminal emulator
id: terminal-emulator · by: claude (draft: the owner may veto any line)

A program that draws a text terminal in a window (or a full-screen display) and connects it to a pseudo-terminal: it shows the output of a shell or program, interprets its escape sequences (VT100, xterm and the like), and sends keystrokes back. Counts on any platform, current or historical, and whatever the front end (native, GPU-accelerated, drop-down, web-embedded, retro). The emulation engine counts when experts name it as a terminal emulator in its own right (libvterm, VTE). Not the shell or multiplexer that runs inside it, nor the escape codes, terminfo entries or per-window settings.

## Sub-kinds
- X11 classics: xterm, rxvt, rxvt-unicode (urxvt), Eterm, aterm, st (suckless simple terminal), xvt, mlterm (CJK)
- GTK and desktop terminals: GNOME Terminal (VTE-based), Terminator, Tilix, xfce4-terminal, MATE Terminal, Konsole (KDE)
- Drop-down terminals: Guake, Yakuake, Tilda
- macOS: Terminal.app, iTerm2
- Windows: Windows Terminal, ConEmu, mintty (Cygwin and MSYS), PuTTY, Hyper (Electron)
- GPU-accelerated: Alacritty, kitty, WezTerm, foot, Ghostty, Rio, Contour
- Embedded and web: xterm.js (VS Code's terminal), hterm (Chrome OS), pyte as a Python emulator library
- Emulation libraries: libvterm (Neovim's engine), VTE (GNOME's widget)
- Retro and novelty: cool-retro-term, Wterm, Hterm

## In
- Terminal emulators on any OS, Unix-like, Windows or macOS, current or historical.
- Emulation engines and widgets that experts call a terminal emulator (libvterm, VTE, xterm.js).
- A program by its project name when that is how people say it (kitty, mintty, Alacritty).
- Drop-down and tabbed front ends that host an emulator.

## Out
- Shells that run inside a terminal (bash, zsh, fish, tcsh) and multiplexers (tmux, GNU screen, Zellij).
- Hardware terminals and their models (VT100 the device, DEC VT220), since the prompt asks for emulators; a named emulation mode ("VT100 mode") is not a program.
- Escape-code sets and protocols (ANSI, xterm control sequences, kitty graphics protocol), terminfo and termcap entries (xterm-256color, screen).
- Editor-embedded terminals (Emacs ansi-term, vim :terminal) and Emacs eshell: features of the editor, not emulators named as such.
- The pseudo-terminal itself (pty, /dev/pts), the Linux virtual console and tty layer, and Windows conhost: kernel and console subsystems, not emulators.
- Remote clients that only open a session (ssh, telnet, rlogin): PuTTY is In because it is named as an emulator, the ssh command is Out.
- Per-window or per-tab names, profile names and config files (~/.config/alacritty/alacritty.toml).

## Examples
- off-by-one: Terminal.app, iTerm2, xterm, GNOME Terminal, Konsole, Alacritty, kitty
- npe: Terminator, Tilix, st, mintty, Guake, Windows Terminal
- leak: rxvt-unicode, Eterm, aterm, Hyper, ConEmu, PuTTY
- race: Yakuake, foot, Contour, Rio, WezTerm, xterm.js
- heisenbug: xvt, mlterm, Wterm, hterm, libvterm
