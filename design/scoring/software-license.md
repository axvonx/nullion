# Scoring: software-license (Name a software license)

430 answers (Bit Flip and Works on my machine left out); 28 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 3 (1%) | 4 | 0 |
| npe | 18 (4%) | 15 | 0 |
| leak | 78 (18%) | 30 | 0 |
| race | 15 (3%) | 62 | 0 |
| heisenbug | 316 (73%) | 319 | 0 |

Same tier as today: 276/430 (64%).

## Off-by-one (3)

GPL 5.6 [16392c 23q 0f], MIT 5.5 [25288c 0q 0f], Apache License 4.6 [6515c 95788q 49f]

## Null pointer exception (18)

LGPL 4.0* [3975c 62q 0f], BSD 3-Clause 3.0 [6890c 0q 0f], CC BY 3.0* [13202c 0q 0f], CC BY-SA 3.0* [13202c 0q 0f], AGPL 2.9 [4808c 0q 0f], CC0 2.7 [13202c 0q 0f], CC BY-NC 2.6 [13202c 0q 0f], GFDL 2.5 [4001c 0q 0f], BSD 2-Clause 2.5 [6890c 0q 0f], CC BY-NC-ND 2.5 [13202c 0q 0f], Beerware 2.5 [0c 0q 0f], CC BY-NC-SA 2.4 [13202c 0q 0f], Vim License 2.2 [9289c 33852q 62f], OpenSSL License 2.2 [5961c 19787q 63f], PostgreSQL License 2.2 [0c 178880q 54f], MPL 2.1 [2038c 0q 1f], Zlib 2.1 [959c 2394q 56f], Eclipse Public License 2.1 [562c 125q 2f]

## Memory leak (78)

X11 License 1.9 [25288c 7981q 0f], CC BY-ND 1.8 [13202c 0q 0f], curl License 1.6 [0c 0q 68f], Boost Software License 1.6 [0c 27850q 58f], UnRAR 1.5 [0c 118q 45f], NTP 1.4 [0c 2035q 34f], Tcl/Tk License 1.3 [0c 8097q 0f], ImageMagick 1.2 [0c 10227q 58f], W3C Software Notice and License 1.2 [0c 1244q 0f], JSON 1.2 [37716c 361184q 5f], gnuplot 1.2 [0c 6991q 51f], ICU 1.1 [0c 781q 59f], InnoSetup 1.1 [0c 4859q 5f], Ruby License 1.1 [81c 230126q 54f], Intel 1.1 [0c 4385q 0f], Nunit 1.1 [0c 7488q 9f], WordNet 1.1 [0c 935q 27f], Libpng 1.0 [0c 617q 63f], MIT-0 1.0 [25288c 0q 0f], Jam 1.0 [0c 46q 20f], FreeType License 1.0 [627c 3089q 0f], BitTorrent Open Source License 0.9 [20c 1719q 4f], FDK-AAC 0.9 [0c 0q 43f], Xfig 0.9 [0c 5q 26f], Net-SNMP 0.8 [0c 753q 41f], Sun Public License 0.8 [0c 369q 0f], MIPS 0.8 [0c 5965q 0f], Zope Public License 0.7 [32c 649q 1f], libtiff 0.7 [0c 318q 0f], Cube 0.7 [0c 1333q 4f], Sendmail 0.7 [0c 4826q 32f], NetCDF 0.7 [0c 2339q 42f], checkmk 0.7 [0c 145q 4f], FreeImage 0.7 [0c 174q 38f], HTMLTIDY 0.7 [0c 167q 0f], Educational Community License 0.7 [17c 55q 31f], IPA 0.7 [0c 1368q 0f], PDDL-1.0 0.6 [0c 118q 0f], TMate 0.6 [0c 1q 20f], lsof 0.6 [0c 624q 44f], DocBook-XML 0.6 [0c 0q 26f], Zimbra 0.6 [0c 209q 0f], ngrep 0.6 [0c 22q 26f], Parity Public License 0.6 [0c 235q 1f], Amazon Digital Services License 0.5 [0c 402q 0f], HDF5 0.5 [0c 2620q 47f], LOOP 0.5 [0c 96584q 0f], Glide 0.5 [0c 2332q 0f], Informatica 0.5 [0c 1818q 0f], Symlinks 0.5 [0c 0q 20f], Eiffel Forum License 0.5 [0c 30q 27f], Boehm-Demers-Weiser GC License 0.5 [0c 50q 55f], HIDAPI 0.5 [0c 98q 42f], Imlib2 0.5 [0c 8q 47f], Nokia 0.4 [0c 726q 0f], Leptonica 0.4 [0c 153q 48f], snprintf 0.4 [0c 9538q 1f], SML/NJ License 0.4 [0c 872q 13f], TCP-wrappers 0.4 [0c 16q 23f], mpich2 0.4 [0c 406q 0f] ...

## Race condition (15)

BSD 4-Clause 1.5 [6890c 0q 0f], 0BSD 1.1 [6890c 0q 0f], CPL-1.0 1.0 [58c 0q 8f], jove 1.0 [0c 0q 14f], Academic Free License 0.8 [173c 0q 10f], Buddy 0.7 [0c 0q 12f], Crossword 0.7 [0c 92q 1f], Reciprocal Public License 0.6 [61c 18q 11f], Noweb 0.6 [0c 35q 11f], Mup 0.5 [0c 81q 6f], DSDP 0.4 [0c 0q 9f], xzoom 0.3 [0c 0q 10f], metamail 0.3 [0c 0q 10f], CryptoSwift 0.2 [0c 81q 0f], SGP4 0.2 [0c 14q 8f]

## Heisenbug (316)

Python Software Foundation License 2.0 [425c 0q 0f], ISC 1.8 [1982c 0q 0f], NPOSL-3.0 1.8 [0c 0q 0f], BSD Source Code Attribution 1.8 [0c 0q 0f], Artistic License 1.7 [393c 0q 0f], Microsoft Public License 1.6 [0c 0q 0f], SIL Open Font License 1.6 [1293c 0q 0f], Business Source License 1.6 [1243c 0q 0f], Elastic License 1.6 [0c 0q 0f], Server Side Public License 1.6 [1057c 0q 0f], Unlicense 1.5 [1125c 0q 0f], Info-ZIP 1.5 [0c 0q 1f], NGPL 1.5 [0c 0q 0f], CC-SA-1.0 1.4 [0c 0q 0f], TPL-1.0 1.3 [0c 0q 0f], EUPL 1.3 [711c 0q 0f], ODbL-1.0 1.3 [518c 0q 0f], Apple Public Source License 1.2 [510c 0q 0f], BSD Protection License 1.2 [0c 0q 0f], CPOL-1.02 1.2 [0c 0q 0f], bzip2 License 1.2 [0c 0q 0f], Barr 1.2 [0c 0q 0f], OAR 1.2 [0c 0q 1f], CDDL 1.2 [642c 0q 1f], Fair 1.2 [0c 0q 1f], Microsoft Reciprocal License 1.1 [0c 0q 0f], Rdisc 1.1 [0c 0q 0f], magaz 1.1 [0c 0q 0f], LaTeX Project Public License 1.1 [485c 0q 0f], NRL 1.1 [0c 0q 0f], Ubuntu Font Licence 1.1 [0c 0q 0f], OSC-1.0 1.1 [0c 0q 0f], Unicode License 1.1 [0c 0q 0f], DEC-3-Clause 1.1 [0c 0q 0f], Netscape Public License 1.1 [43c 0q 0f], BSD 1-Clause 1.1 [0c 0q 0f], Sleepycat 1.0 [0c 0q 0f], Pixar 1.0 [0c 0q 0f], UCL-1.0 1.0* [0c 0q 0f], MIT-CMU 1.0* [0c 0q 0f], MIT-open-group 1.0* [0c 0q 0f], SOFA 1.0 [0c 0q 0f], SSH-OpenSSH 1.0* [0c 0q 0f], PHP License 1.0 [515c 0q 0f], Zend-2.0 0.9 [0c 0q 0f], Xnet 0.9 [0c 17q 0f], HPND 0.9 [0c 0q 0f], Giftware 0.9 [0c 0q 0f], Community-Spec-1.0 0.9 [0c 0q 0f], SUL-1.0 0.9 [0c 0q 0f], Bitstream-Vera 0.9 [0c 0q 0f], Vixie-Cron 0.9 [0c 0q 3f], CeCILL 0.9 [172c 0q 0f], NCL 0.9 [0c 33q 6f], URT-RLE 0.9 [0c 0q 0f], SunPro 0.9 [0c 1q 1f], swrule 0.9 [0c 0q 0f], XFree86-1.1 0.8 [0c 0q 0f], FSFAP 0.8 [0c 0q 0f], EPICS 0.8 [0c 0q 1f] ...

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
