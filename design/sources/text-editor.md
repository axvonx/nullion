# Source-first derivation: text-editor (Name a text editor)

Generated 2026-11-27 by `python3 -I scripts/sources/text_editor.py`. No LLM in the path; rerunning on the same corpora gives the same output. The bank was not changed: merging is the owner's call.

## Summary

- **329 derived answers** (`~/nullion-corpora/derived/text-editor.json`).
- **Bank coverage:** 71/78 of the bank's playable answers are in the derived set.
- **Tier agreement** on the 69 bank ladder answers found (Works on my machine and Bit Flip are hand picks, left out): exact 42/69 (61%), within one tier 65/69 (94%), Spearman 0.849.
- **Cut-offs** (score >= c): off-by-one 0.8564, npe 0.3594, leak 0.2542, race 0.2298, else heisenbug.
- **Derived tier counts:** off-by-one 5, npe 60, leak 31, race 23, heisenbug 210.
- **Probe:** derived 55/60, current bank 50/60. Each source alone: wikidata 47, repology 26, debian 18, homebrew 16.

Caveat: the cut-offs are fitted on the same bank answers the agreement is measured on (in-sample), and the bank's tiers were themselves judged by an LLM; the agreement is an upper bound on how well the formula reproduces the bank, not a measure of truth.
Probe caveat: Haiku wrote the probe with the scope spec in its prompt, and the scope's examples were taken from the bank, so the probe leans toward names the bank already has.

## Sources and rules

```
Source-first derivation of "Name a text editor". Stdlib only, no LLM, deterministic.

Usage: python3 -I scripts/sources/text_editor.py
Needs: python3 -I scripts/fetch-corpora.py debian homebrew stackexchange repology wikidata

Membership (a union; each rule is mechanical):
  wikidata        items of the classes text editor (Q131212), source code editor (Q522972) and line editor
                  (Q184900), P31/P279*, with at least one sitelink, minus items also typed as an IDE, word
                  processor, note-taking app, hex editor, HTML editor, library or online service (scope Out)
  repology        projects filed under an editor category in at least two repository families (Gentoo
                  app-editors, FreeBSD/OpenBSD/pkgsrc/MacPorts editors, Debian section editors, ...), minus
                  plugin/addon packages (elpa-*, vim-*, emacs-*, *-mode, ...)
  homebrew        formulae and casks whose description says "text editor", "code editor" or "programmer's editor"
  debian          section-editors packages that ship a /usr/bin program named after the package
Names: a package or cask name that is the label or alias of exactly one Wikidata member is renamed to that label
(emacs -> GNU Emacs, sublime-text -> Sublime Text) and keeps its own name as an alias; then candidates merge by
normalized name (scripts/sources/common.py `merge`).
Aliases: Wikidata aliases (at most 3 words), package and cask tokens, Stack Exchange tag synonyms.
Familiarity: scripts/sources/common.py (se primary; popcon, Homebrew, sitelinks, Repology families secondary).
For a dictionary-word name (atom, sam, acme, joe) the bare tag only counts on Super User and Unix & Linux; the
"<name>-editor" tag counts everywhere.
Writes ~/nullion-corpora/derived/text-editor.json and design/sources/text-editor.md.
```

Distinct names per source (before merging): wikidata 241, repology 141, homebrew 62, debian 78.

Inputs:
- `wikidata/class-text-editor-Q131212.json`: 2026-11-28, 704 items
- `repology/packages.tsv.gz`: 2026-11-28, 5061926 rows
- `homebrew/cask.json`: 2026-11-28
- `debian/Packages.xz`: 2026-11-28
- `stackexchange/unix-tags.json`: 2026-11-28, 2827 items, 29 pages

## Familiarity

```
se   = Stack Exchange question count of the entry's tag, summed over Stack Overflow, Unix & Linux, Server Fault and
         Super User (per site: the largest count among the entry's names, through that site's tag synonyms). A name
         that is an English dictionary word (/usr/share/dict/words: "master", "update", "atom") only counts on the
         category's `se_word_sites`, because the bare tag usually means something else on Stack Overflow.
  each secondary signal x (popcon installs, Homebrew 365-day installs, Wikidata sitelinks, Repology families,
  kernel-Documentation mentions) is normalised as min(1, log1p(x) / log1p(ref)), ref = the category's 3rd-largest
  value of that signal (the bank scorer's convention), and so is se.
  Package-level signals (popcon, Homebrew, Repology) count half for a name that is not its package's own name
  (systemd-journald does not inherit all of systemd's installs).
  score = W_SE * se_n + (1 - W_SE) * mean(secondary signals the entry HAS a source for). An entry with no secondary
  source (a kernel thread, a macOS daemon) is scored on se alone, so a zero Stack Exchange count means "deepest".
Tiers: Off-by-one / NPE / Leak / Race / Heisenbug by four score cut-offs, fitted to the bank's tiered answers that
the derived set contains (an optimal monotone split, `fit_cutoffs`). Works on my machine and Bit Flip are hand
picks and never derived.
```

Confusion (rows: bank tier, columns: derived tier):

| bank \ derived | off-by-one | npe | leak | race | heisenbug |
|---|---|---|---|---|---|
| off-by-one | 4 | 3 | 0 | 0 | 0 |
| npe | 1 | 13 | 2 | 1 | 1 |
| leak | 0 | 4 | 6 | 1 | 1 |
| race | 0 | 0 | 1 | 4 | 11 |
| heisenbug | 0 | 0 | 1 | 0 | 15 |

Biggest disagreements (two or more tiers apart):

- Edlin: bank npe, derived heisenbug (score 0.1818, se 0)
- MS-DOS Editor: bank npe, derived race (score 0.2331, se 0)
- Xed: bank leak, derived heisenbug (score 0.1752, se 0)
- retext: bank heisenbug, derived leak (score 0.2723, se 0)

## Bank coverage by tier

- off-by-one: 7/8
- womm: 2/2
- npe: 18/19
- leak: 12/13
- race: 16/16
- heisenbug: 16/19
- bitflip: 0/1

## In the bank, not derived (7)

- Geany (npe): rejected: Wikidata Q1122464 is also typed 'integrated development environment' (scope Out)
- Komodo Edit (leak): rejected: filed as an editor in only one repository family (freebsd)
- orbiton (heisenbug): rejected: Repology summaries do not call it an editor, or call it an IDE, office suite, hex editor or similar
- Pragtical (heisenbug): rejected: filed as an editor in only one repository family (freebsd)
- SciTECO (bitflip): rejected: filed as an editor in only one repository family (haikuports_master)
- TextEdit (off-by-one): in no source
- ved (heisenbug): in no source

## Derived, not in the bank (251)

By source: debian 51, homebrew:cask 26, homebrew:formula 9, repology 95, wikidata 107.

Top 60 by score (name, derived tier, score, sources):

- MacVim (npe, 0.7269; homebrew:cask)
- pretty-printing (npe, 0.681; wikidata)
- scratch-text-editor (npe, 0.6634; repology)
- Freemacs (npe, 0.627; wikidata)
- Texmaker (npe, 0.6113; wikidata)
- ACE (npe, 0.5747; wikidata)
- TeXstudio (npe, 0.5705; debian, wikidata)
- flow-control (npe, 0.5658; homebrew:formula)
- XEmacs (npe, 0.5581; wikidata)
- TextWrangler (npe, 0.5545; wikidata)
- janus (npe, 0.5494; repology)
- Adobe FrameMaker (npe, 0.5241; wikidata)
- EmEditor (npe, 0.5189; wikidata)
- lyx (npe, 0.5174; debian)
- UltraEdit (npe, 0.5167; wikidata)
- ISPF (npe, 0.5164; wikidata)
- Spacemacs (npe, 0.5099; wikidata)
- abiword (npe, 0.4991; debian)
- Aquamacs (npe, 0.4938; homebrew:cask, wikidata)
- LEd (npe, 0.4802; wikidata)
- Kile (npe, 0.4787; wikidata)
- deepin-editor (npe, 0.455; repology)
- em (npe, 0.4516; repology)
- PSPad (npe, 0.4484; wikidata)
- GNU TeXmacs (npe, 0.4459; repology, wikidata)
- xxd (npe, 0.4429; debian)
- tilde (npe, 0.4401; repology)
- KWrite (npe, 0.4322; debian, wikidata)
- Programmer's Notepad (npe, 0.4168; wikidata)
- sigil (npe, 0.4107; debian)
- EditPad (npe, 0.4059; wikidata)
- ledit (npe, 0.3887; debian, repology)
- ConTEXT (npe, 0.3844; wikidata)
- Keynote (npe, 0.3831; wikidata)
- TeXworks (npe, 0.3822; debian, wikidata)
- yed (npe, 0.3623; repology)
- SlickEdit (leak, 0.3582; wikidata)
- SAKURA Editor (leak, 0.3574; wikidata)
- EditPlus (leak, 0.3542; wikidata)
- Panic Nova (leak, 0.3264; homebrew:cask)
- RText (leak, 0.324; wikidata)
- vis-editor (leak, 0.3058; repology)
- kimagemapeditor (leak, 0.299; debian)
- ne-nice-editor (leak, 0.2964; repology)
- Pulsar (leak, 0.2942; homebrew:cask)
- Zim Desktop Wiki (leak, 0.294; wikidata)
- Mozilla Skywriter (leak, 0.2926; wikidata)
- fresh-editor (leak, 0.2886; homebrew:formula)
- TeXShop (leak, 0.2863; wikidata)
- feathernotes (leak, 0.2857; debian)
- cherrytree (leak, 0.283; debian)
- E (leak, 0.2644; wikidata)
- Frescobaldi (leak, 0.2627; debian, wikidata)
- qemacs (leak, 0.2611; repology)
- focuswriter (leak, 0.2588; debian)
- kiro-editor (leak, 0.2545; repology)
- arduino-ctags (race, 0.2506; debian)
- Enter TeX (race, 0.2467; wikidata)
- ecrire (race, 0.2458; repology)
- bvi (race, 0.2451; debian, repology)

## Sample per derived tier (top 15 by score)

- **off-by-one** (5): Emacs, Vim, Notepad++, Atom, Sublime Text
- **npe** (60): GNOME Text Editor, GNU nano, gedit, Notepad, Brackets, Kate, Neovim, MacVim, Microsoft Visual Studio Code, Vi, pretty-printing, TextMate, scratch-text-editor, ed, jEdit
- **leak** (31): SlickEdit, SAKURA Editor, EditPlus, nvi, GNU Emacs, Panic Nova, featherpad, Leafpad, RText, Mousepad, vis-editor, kimagemapeditor, TECO, ne-nice-editor, Pulsar
- **race** (23): Textadept, Gobby, arduino-ctags, JED, Enter TeX, ecrire, bvi, mg, Crimson Editor, Gosling Emacs, XEDIT, Gummi, l3afpad, amp-editor, Gram
- **heisenbug** (210): cooledit, ghostwriter, kibi, Elvis, beaver, poke, ht, Medit, bbe, e3, uemacs, JOVE, pageedit, fte, xwpe

## Probe (scripts/bank/runs/text-editor/probe.json)

Derived covers **55/60** probe answers; the current bank's playable tiers cover **50/60**.

| probe answer | depth | sub-kind | derived | in bank tiers |
|---|---|---|---|---|
| Vim | common | vi family and modal editors | Vim (off-by-one) | yes |
| vi | common | vi family and modal editors | Vi (npe) | yes |
| Neovim | common | vi family and modal editors | Neovim (npe) | yes |
| GNU Emacs | common | Emacs family | GNU Emacs (leak) | yes |
| nano | common | modeless terminal editors | GNU nano (npe) | yes |
| MS-DOS Editor | common | modeless terminal editors | MS-DOS Editor (race) | yes |
| ed | common | line and historical editors | ed (npe) | yes |
| Notepad | common | desktop GUI editors | Notepad (npe) | yes |
| TextEdit | common | desktop GUI editors | **missing** | yes |
| gedit | common | desktop GUI editors | gedit (npe) | yes |
| Kate | common | desktop GUI editors | Kate (npe) | yes |
| VS Code | common | programmer's and code editors | Microsoft Visual Studio Code (npe) | yes |
| Sublime Text | common | programmer's and code editors | Sublime Text (off-by-one) | yes |
| Notepad++ | common | programmer's and code editors | Notepad++ (off-by-one) | yes |
| Atom | common | programmer's and code editors | Atom (off-by-one) | yes |
| Helix | mid | vi family and modal editors | helix (npe) | yes |
| Kakoune | mid | vi family and modal editors | Kakoune (npe) | yes |
| nvi | mid | vi family and modal editors | nvi (leak) | yes |
| XEmacs | mid | Emacs family | XEmacs (npe) | no |
| micro | mid | modeless terminal editors | micro (npe) | yes |
| JOE | mid | modeless terminal editors | Joe's Own Editor (npe) | yes |
| pico | mid | modeless terminal editors | Pico (leak) | yes |
| ex | mid | line and historical editors | ex (npe) | yes |
| Edlin | mid | line and historical editors | Edlin (heisenbug) | yes |
| Mousepad | mid | desktop GUI editors | Mousepad (leak) | yes |
| Leafpad | mid | desktop GUI editors | Leafpad (leak) | yes |
| Pluma | mid | desktop GUI editors | pluma (leak) | yes |
| Xed | mid | desktop GUI editors | Xed (heisenbug) | yes |
| GNOME Text Editor | mid | desktop GUI editors | GNOME Text Editor (npe) | yes |
| Geany | mid | programmer's and code editors | **missing** | yes |
| Zed | mid | programmer's and code editors | Zed (leak) | yes |
| BBEdit | mid | programmer's and code editors | BBEdit (npe) | yes |
| TextMate | mid | programmer's and code editors | TextMate (npe) | yes |
| jEdit | mid | programmer's and code editors | jEdit (npe) | yes |
| UltraEdit | mid | programmer's and code editors | UltraEdit (npe) | no |
| vile | deep | vi family and modal editors | vile (heisenbug) | yes |
| elvis | deep | vi family and modal editors | Elvis (heisenbug) | no |
| vis | deep | vi family and modal editors | vis (heisenbug) | yes |
| Stevie | deep | vi family and modal editors | Stevie (heisenbug) | no |
| MicroEMACS | deep | Emacs family | MicroEMACS (heisenbug) | yes |
| Epsilon | deep | Emacs family | **missing** | no |
| mg | deep | Emacs family | mg (race) | yes |
| Zile | deep | Emacs family | GNU Zile (race) | yes |
| JOVE | deep | Emacs family | JOVE (heisenbug) | yes |
| dte | deep | modeless terminal editors | dte (heisenbug) | yes |
| mle | deep | modeless terminal editors | mle (heisenbug) | yes |
| ne | deep | modeless terminal editors | ne (heisenbug) | yes |
| TSE | deep | modeless terminal editors | **missing** | no |
| jed | deep | modeless terminal editors | JED (race) | yes |
| QED | deep | line and historical editors | QED (heisenbug) | no |
| TECO | deep | line and historical editors | TECO (leak) | yes |
| SOS | deep | line and historical editors | **missing** | no |
| XEDIT | deep | line and historical editors | XEDIT (race) | no |
| THE | deep | line and historical editors | the (heisenbug) | yes |
| xcoral | deep | desktop GUI editors | xcoral (heisenbug) | yes |
| Textadept | deep | programmer's and code editors | Textadept (race) | yes |
| Lite XL | deep | programmer's and code editors | lite-xl (heisenbug) | yes |
| sam | deep | Plan 9 and research editors | sam (heisenbug) | yes |
| acme | deep | Plan 9 and research editors | acme (heisenbug) | yes |
| Wily | deep | Plan 9 and research editors | Wily (heisenbug) | no |
