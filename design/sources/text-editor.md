# Source-first derivation: text-editor (Name a text editor)

Generated 2026-11-27 by `python3 -I scripts/sources/text_editor.py`. No LLM in the path; rerunning on the same corpora gives the same output. The bank was not changed: merging is the owner's call.

## Summary

- **329 derived answers** (`~/nullion-corpora/derived/text-editor.json`).
- **Bank coverage:** 71/78 of the bank's playable answers are in the derived set.
- **Tier agreement** on the 69 bank ladder answers found (Works on my machine and Bit Flip are hand picks, left out): exact 42/69 (61%), within one tier 63/69 (91%), Spearman 0.815.
- **Cut-offs** (score >= c): off-by-one 0.819, npe 0.3249, leak 0.25, race 0.2298, else heisenbug.
- **Derived tier counts:** off-by-one 6, npe 60, leak 28, race 20, heisenbug 215.
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
- `stackexchange/unix-tags.json`: 2026-11-28, 2500 items, 25 pages; TRUNCATED: the first 2500 in popular order (an app key lifts the cap)

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
| off-by-one | 5 | 2 | 0 | 0 | 0 |
| npe | 1 | 13 | 1 | 1 | 2 |
| leak | 0 | 4 | 6 | 1 | 1 |
| race | 0 | 1 | 1 | 3 | 11 |
| heisenbug | 0 | 0 | 1 | 0 | 15 |

Biggest disagreements (two or more tiers apart):

- pico: bank npe, derived heisenbug (score 0.1403, se 0)
- Edlin: bank npe, derived heisenbug (score 0.1818, se 0)
- MS-DOS Editor: bank npe, derived race (score 0.2331, se 0)
- Xed: bank leak, derived heisenbug (score 0.1752, se 0)
- FeatherPad: bank race, derived npe (score 0.3252, se 0)
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

- MacVim (npe, 0.6956; homebrew:cask)
- pretty-printing (npe, 0.65; wikidata)
- scratch-text-editor (npe, 0.6349; repology)
- Freemacs (npe, 0.5904; wikidata)
- Texmaker (npe, 0.5894; wikidata)
- TeXstudio (npe, 0.5534; debian, wikidata)
- ACE (npe, 0.5431; wikidata)
- flow-control (npe, 0.5428; homebrew:formula)
- XEmacs (npe, 0.5393; wikidata)
- janus (npe, 0.5255; repology)
- TextWrangler (npe, 0.5184; wikidata)
- Adobe FrameMaker (npe, 0.5069; wikidata)
- ISPF (npe, 0.4983; wikidata)
- EmEditor (npe, 0.4948; wikidata)
- UltraEdit (npe, 0.484; wikidata)
- Spacemacs (npe, 0.4839; wikidata)
- Kile (npe, 0.468; wikidata)
- abiword (npe, 0.4586; debian)
- LEd (npe, 0.4574; wikidata)
- Aquamacs (npe, 0.4567; homebrew:cask, wikidata)
- GNU TeXmacs (npe, 0.4362; repology, wikidata)
- deepin-editor (npe, 0.4346; repology)
- em (npe, 0.4275; repology)
- xxd (npe, 0.4274; debian)
- tilde (npe, 0.4247; repology)
- KWrite (npe, 0.4229; debian, wikidata)
- Programmer's Notepad (npe, 0.3994; wikidata)
- PSPad (npe, 0.3962; wikidata)
- EditPad (npe, 0.3903; wikidata)
- ledit (npe, 0.379; debian, repology)
- TeXworks (npe, 0.375; debian, wikidata)
- Keynote (npe, 0.3657; wikidata)
- SAKURA Editor (npe, 0.3487; wikidata)
- SlickEdit (npe, 0.3424; wikidata)
- EditPlus (npe, 0.3386; wikidata)
- RText (leak, 0.3119; wikidata)
- vis-editor (leak, 0.3058; repology)
- kimagemapeditor (leak, 0.299; debian)
- lyx (leak, 0.2966; debian)
- ne-nice-editor (leak, 0.2964; repology)
- Zim Desktop Wiki (leak, 0.294; wikidata)
- fresh-editor (leak, 0.2886; homebrew:formula)
- feathernotes (leak, 0.2857; debian)
- cherrytree (leak, 0.283; debian)
- Mozilla Skywriter (leak, 0.2806; wikidata)
- sigil (leak, 0.2755; debian)
- Pulsar (leak, 0.2753; homebrew:cask)
- Frescobaldi (leak, 0.2627; debian, wikidata)
- qemacs (leak, 0.2611; repology)
- focuswriter (leak, 0.2588; debian)
- kiro-editor (leak, 0.2545; repology)
- ConTEXT (leak, 0.2513; wikidata)
- arduino-ctags (leak, 0.2506; debian)
- yed (leak, 0.2504; repology)
- Enter TeX (race, 0.2467; wikidata)
- ecrire (race, 0.2458; repology)
- bvi (race, 0.2451; debian, repology)
- Crimson Editor (race, 0.2428; wikidata)
- Gosling Emacs (race, 0.2428; wikidata)
- XEDIT (race, 0.2413; wikidata)

## Sample per derived tier (top 15 by score)

- **off-by-one** (6): Emacs, Vim, Notepad++, Microsoft Visual Studio Code, Atom, Sublime Text
- **npe** (60): GNOME Text Editor, GNU nano, gedit, Notepad, Kate, Brackets, Neovim, MacVim, Vi, pretty-printing, ed, TextMate, scratch-text-editor, jEdit, SciTE
- **leak** (28): Leafpad, Mousepad, RText, vis-editor, kimagemapeditor, lyx, ne-nice-editor, TECO, Zim Desktop Wiki, pluma, fresh-editor, feathernotes, cherrytree, Mozilla Skywriter, sigil
- **race** (20): Textadept, Enter TeX, ecrire, bvi, mg, Crimson Editor, Gosling Emacs, XEDIT, Gummi, l3afpad, amp-editor, Gram, pulsar-edit, nvi, CodeMirror 5
- **heisenbug** (215): cooledit, Yi, ghostwriter, VimR, kibi, beaver, poke, ht, bbe, e3, uemacs, JOVE, pageedit, fte, xwpe

## Probe (scripts/bank/runs/text-editor/probe.json)

Derived covers **55/60** probe answers; the current bank's playable tiers cover **50/60**.

| probe answer | depth | sub-kind | derived | in bank tiers |
|---|---|---|---|---|
| Vim | common | vi family and modal editors | Vim (off-by-one) | yes |
| vi | common | vi family and modal editors | Vi (npe) | yes |
| Neovim | common | vi family and modal editors | Neovim (npe) | yes |
| GNU Emacs | common | Emacs family | GNU Emacs (npe) | yes |
| nano | common | modeless terminal editors | GNU nano (npe) | yes |
| MS-DOS Editor | common | modeless terminal editors | MS-DOS Editor (race) | yes |
| ed | common | line and historical editors | ed (npe) | yes |
| Notepad | common | desktop GUI editors | Notepad (npe) | yes |
| TextEdit | common | desktop GUI editors | **missing** | yes |
| gedit | common | desktop GUI editors | gedit (npe) | yes |
| Kate | common | desktop GUI editors | Kate (npe) | yes |
| VS Code | common | programmer's and code editors | Microsoft Visual Studio Code (off-by-one) | yes |
| Sublime Text | common | programmer's and code editors | Sublime Text (off-by-one) | yes |
| Notepad++ | common | programmer's and code editors | Notepad++ (off-by-one) | yes |
| Atom | common | programmer's and code editors | Atom (off-by-one) | yes |
| Helix | mid | vi family and modal editors | helix (npe) | yes |
| Kakoune | mid | vi family and modal editors | Kakoune (npe) | yes |
| nvi | mid | vi family and modal editors | nvi (race) | yes |
| XEmacs | mid | Emacs family | XEmacs (npe) | no |
| micro | mid | modeless terminal editors | micro (npe) | yes |
| JOE | mid | modeless terminal editors | Joe's Own Editor (npe) | yes |
| pico | mid | modeless terminal editors | Pico (heisenbug) | yes |
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
| jed | deep | modeless terminal editors | JED (leak) | yes |
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
