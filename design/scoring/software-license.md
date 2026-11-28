# Scoring: software-license (Name a software license)

430 answers (Bit Flip and Works on my machine left out); 28 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 3 (1%) | 3 | 0 |
| npe | 20 (5%) | 20 | 0 |
| leak | 37 (9%) | 37 | 0 |
| race | 20 (5%) | 20 | 0 |
| heisenbug | 350 (81%) | 350 | 0 |

Same tier as today: 430/430 (100%).

## Off-by-one (3)

GPL 5.6 [16392c 0q 0f 0s], MIT 5.5 [0c 0q 0f 0s], Apache License 4.6 [6515c 0q 49f 0s]

## Null pointer exception (20)

LGPL 4.0* [3975c 62q 0f 0s], BSD 3-Clause 3.0 [0c 0q 0f 0s], CC BY 3.0* [0c 0q 0f 0s], CC BY-SA 3.0* [0c 0q 0f 0s], AGPL 2.9 [4808c 0q 0f 0s], CC0 2.7 [0c 0q 0f 0s], CC BY-NC 2.6 [0c 0q 0f 0s], GFDL 2.5 [4001c 0q 0f 0s], BSD 2-Clause 2.5 [0c 0q 0f 0s], CC BY-NC-ND 2.5 [0c 0q 0f 0s], Beerware 2.5 [0c 0q 0f 0s], CC BY-NC-SA 2.4 [0c 0q 0f 0s], OpenSSL License 2.2 [0c 19787q 63f 0s], Vim License 2.2 [0c 0q 0f 0s], PostgreSQL License 2.2 [0c 178880q 54f 0s], MPL 2.1 [2038c 0q 0f 0s], Zlib 2.1 [959c 2394q 56f 0s], Eclipse Public License 2.1 [562c 0q 0f 0s], ImageMagick 1.2 [0c 10227q 58f 17961s]^, InnoSetup 1.1 [0c 4859q 5f 5788s]^

## Memory leak (37)

UnRAR 1.5 [0c 118q 45f 0s], JSON 1.2 [0c 361184q 5f 0s], gnuplot 1.2 [0c 6991q 51f 0s], Intel 1.1 [0c 4385q 0f 0s], Nunit 1.1 [0c 7488q 9f 0s], WordNet 1.1 [0c 935q 27f 0s], Libpng 1.0 [0c 617q 63f 0s], BitTorrent Open Source License 0.9 [20c 1719q 4f 0s], Net-SNMP 0.8 [0c 753q 41f 0s], MIPS 0.8 [0c 5965q 0f 0s], libtiff 0.7 [0c 318q 0f 0s], Sendmail 0.7 [0c 4826q 32f 0s], NetCDF 0.7 [0c 2339q 42f 0s], checkmk 0.7 [0c 145q 4f 0s], FreeImage 0.7 [0c 174q 38f 0s], HTMLTIDY 0.7 [0c 167q 0f 0s], PDDL-1.0 0.6 [0c 118q 0f 0s], lsof 0.6 [0c 624q 44f 0s], Zimbra 0.6 [0c 209q 0f 0s], Noweb 0.6 [0c 35q 11f 0s], Amazon Digital Services License 0.5 [0c 402q 0f 0s], HDF5 0.5 [0c 2620q 47f 0s], Informatica 0.5 [0c 1818q 0f 0s], Boehm-Demers-Weiser GC License 0.5 [0c 50q 55f 0s], HIDAPI 0.5 [0c 98q 42f 0s], Nokia 0.4 [45290c 726q 0f 0s], Leptonica 0.4 [0c 153q 48f 2109s], snprintf 0.4 [0c 9538q 1f 0s], SML/NJ License 0.4 [0c 872q 13f 0s], mpich2 0.4 [0c 406q 0f 0s], Qhull 0.4 [0c 77q 44f 0s], hdparm 0.3 [0c 214q 36f 0s], python-ldap 0.3 [0c 241q 0f 0s], xinetd 0.3 [0c 130q 27f 0s], CryptoSwift 0.2 [0c 81q 0f 0s], Soundex 0.2 [0c 159q 0f 0s], radvd 0.2 [0c 57q 25f 0s]

## Race condition (20)

ISC 1.8 [1982c 0q 0f 0s], curl License 1.6 [0c 0q 68f 0s], Boost Software License 1.6 [0c 0q 58f 0s], Ruby License 1.1 [81c 0q 54f 0s], Xnet 0.9 [0c 17q 0f 0s], FDK-AAC 0.9 [0c 0q 43f 0s], Xfig 0.9 [0c 5q 26f 0s], TMate 0.6 [0c 1q 20f 0s], DocBook-XML 0.6 [0c 0q 26f 0s], ngrep 0.6 [0c 22q 26f 0s], Symlinks 0.5 [0c 0q 20f 0s], Imlib2 0.5 [0c 8q 47f 0s], TCP-wrappers 0.4 [0c 16q 23f 0s], CFITSIO 0.4 [0c 0q 41f 0s], XSkat 0.3 [0c 0q 20f 0s], pkgconf 0.3 [0c 0q 52f 0s], Aspell-RU 0.2 [0c 0q 28f 0s], GL2PS 0.2 [0c 0q 36f 0s], SGP4 0.2 [0c 14q 8f 0s], Zed 0.0* [4112c 0q 0f 0s]

## Heisenbug (350)

Python Software Foundation License 2.0 [425c 0q 0f 0s], X11 License 1.9 [0c 0q 0f 0s], CC BY-ND 1.8 [0c 0q 0f 0s], NPOSL-3.0 1.8 [0c 0q 0f 0s], BSD Source Code Attribution 1.8 [0c 0q 0f 0s], Artistic License 1.7 [393c 0q 0f 0s], Microsoft Public License 1.6 [0c 0q 0f 0s], SIL Open Font License 1.6 [1293c 0q 0f 0s], Business Source License 1.6 [1243c 0q 0f 0s], Elastic License 1.6 [0c 0q 0f 0s], Server Side Public License 1.6 [1057c 0q 0f 0s], Unlicense 1.5 [1125c 0q 0f 0s], Info-ZIP 1.5 [0c 0q 1f 0s], NGPL 1.5 [0c 0q 0f 0s], BSD 4-Clause 1.5 [0c 0q 0f 0s], NTP 1.4 [0c 0q 0f 0s], CC-SA-1.0 1.4 [0c 0q 0f 0s], TPL-1.0 1.3 [0c 0q 0f 0s], Tcl/Tk License 1.3 [0c 0q 0f 0s], EUPL 1.3 [711c 0q 0f 0s], ODbL-1.0 1.3 [518c 0q 0f 0s], Apple Public Source License 1.2 [510c 0q 0f 0s], BSD Protection License 1.2 [0c 0q 0f 0s], CPOL-1.02 1.2 [0c 0q 0f 0s], Barr 1.2 [0c 0q 0f 0s], bzip2 License 1.2 [0c 0q 0f 0s], OAR 1.2 [0c 0q 0f 0s], CDDL 1.2 [642c 0q 1f 0s], W3C Software Notice and License 1.2 [0c 0q 0f 0s], Fair 1.2 [0c 0q 1f 0s], Microsoft Reciprocal License 1.1 [0c 0q 0f 0s], ICU 1.1 [0c 0q 0f 0s], 0BSD 1.1 [0c 0q 0f 0s], Rdisc 1.1 [0c 0q 0f 0s], magaz 1.1 [0c 0q 0f 0s], LaTeX Project Public License 1.1 [485c 0q 0f 0s], NRL 1.1 [0c 0q 0f 0s], OSC-1.0 1.1 [0c 0q 0f 0s], Ubuntu Font Licence 1.1 [0c 0q 0f 0s], DEC-3-Clause 1.1 [0c 0q 0f 0s], Unicode License 1.1 [0c 0q 0f 0s], Netscape Public License 1.1 [43c 0q 0f 0s], BSD 1-Clause 1.1 [0c 0q 0f 0s], Sleepycat 1.0 [0c 0q 0f 0s], Pixar 1.0 [0c 0q 0f 0s], MIT-0 1.0 [0c 0q 0f 0s], CPL-1.0 1.0 [58c 0q 0f 0s], UCL-1.0 1.0* [0c 0q 0f 0s], MIT-CMU 1.0* [0c 0q 0f 0s], MIT-open-group 1.0* [0c 0q 0f 0s], SOFA 1.0 [0c 0q 0f 0s], SSH-OpenSSH 1.0* [0c 0q 0f 0s], jove 1.0 [0c 0q 14f 0s], Jam 1.0 [0c 0q 0f 0s], PHP License 1.0 [515c 0q 0f 0s], FreeType License 1.0 [0c 0q 0f 0s], Zend-2.0 0.9 [0c 0q 0f 0s], Giftware 0.9 [0c 0q 0f 0s], HPND 0.9 [0c 0q 0f 0s], Community-Spec-1.0 0.9 [0c 0q 0f 0s] ...

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
