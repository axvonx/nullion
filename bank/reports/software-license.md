# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: license.

## software-license

432 candidates; 390 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| GPL | 2380 | 9 | 81 | 0.94 | off-by-one | counts | off-by-one | — |
| Unlicense | 2 | 120 | 171 | 0.84 | npe | counts | npe | — |
| MIT | 83 | 3 | 348 | 0.84 | npe | counts | off-by-one | — |
| CC BY | 22 | 3 | 186 | 0.78 | npe | counts | npe | — |
| Fair ⚠ counts said npe | 0 | 16 | 100 | 0.75 | heisenbug | judge (override) | heisenbug | — |
| Apache License | 10 | 2 | 238 | 0.70 | npe | counts | off-by-one | — |
| LOOP ⚠ counts said npe | 0 | 6 | 63 | 0.66 | heisenbug | judge (override) | heisenbug | — |
| Jam | 0 | 5 | 7 | 0.47 | heisenbug | judge | heisenbug | — |
| CC BY-SA | 0 | 1 | 33 | 0.39 | leak | counts | npe | — |
| Intel ⚠ counts said leak | 30 | 0 | 18 | 0.38 | heisenbug | judge (override) | heisenbug | — |
| BSD 3-Clause ⚠ counts said leak | 28 | 0 | 14 | 0.36 | off-by-one | judge (override) | off-by-one | — |
| LGPL ⚠ counts said leak | 30 | 0 | 9 | 0.33 | off-by-one | judge (override) | off-by-one | — |
| AGPL | 0 | 1 | 14 | 0.33 | leak | counts | npe | — |
| CC BY-NC | 0 | 0 | 69 | 0.32 | leak | counts | npe | — |
| JSON | 2 | 0 | 33 | 0.32 | race | counts | leak | — |
| BSD 2-Clause ⚠ counts said race | 33 | 0 | 6 | 0.31 | off-by-one | judge (override) | off-by-one | — |
| Clips | 0 | 0 | 45 | 0.29 | race | counts | heisenbug | — |
| DOC | 11 | 0 | 8 | 0.28 | race | counts | heisenbug | — |
| CC BY-NC-SA ⚠ counts said race | 0 | 0 | 34 | 0.27 | npe | judge (override) | npe | — |
| MPL ⚠ counts said race | 18 | 0 | 5 | 0.27 | npe | judge (override) | npe | — |
| DRL | 0 | 1 | 6 | 0.27 | heisenbug | judge | heisenbug | — |
| GFDL ⚠ counts said race | 384 | 0 | 1 | 0.25 | npe | judge (override) | npe | — |
| Artistic License | 0 | 0 | 17 | 0.22 | race | counts | leak | — |
| CC0 ⚠ counts said heisenbug | 0 | 0 | 16 | 0.22 | npe | judge (override) | npe | — |
| CC BY-NC-ND | 0 | 0 | 9 | 0.18 | npe | judge | npe | — |
| Parity Public License | 0 | 0 | 8 | 0.17 | race | judge | race | — |
| ISC ⚠ counts said heisenbug | 10 | 0 | 1 | 0.16 | npe | judge (override) | npe | — |
| PostgreSQL License | 0 | 0 | 5 | 0.14 | leak | judge | leak | — |
| SL | 0 | 0 | 5 | 0.14 | heisenbug | judge | heisenbug | — |
| OpenSSL License | 5 | 0 | 1 | 0.13 | leak | judge | leak | — |
| CERN Open Hardware Licence | 0 | 0 | 3 | 0.11 | race | judge | race | — |
| Cube | 0 | 0 | 3 | 0.11 | heisenbug | judge | heisenbug | — |
| Zlib | 2 | 0 | 1 | 0.10 | npe | judge | npe | — |
| CeCILL | 0 | 0 | 2 | 0.08 | race | judge | race | — |
| Elastic License | 0 | 0 | 2 | 0.08 | leak | judge | leak | — |
| Crossword | 0 | 0 | 2 | 0.08 | heisenbug | judge | heisenbug | — |
| HDF5 | 0 | 0 | 2 | 0.08 | heisenbug | judge | heisenbug | — |
| MIPS | 0 | 0 | 2 | 0.08 | heisenbug | judge | heisenbug | — |
| Linux-OpenIB | 5 | 0 | 0 | 0.08 | heisenbug | judge | heisenbug | — |
| Boost Software License | 0 | 0 | 1 | 0.05 | leak | judge | leak | — |
| BitTorrent Open Source License | 0 | 0 | 1 | 0.05 | race | judge | race | — |
| CC BY-ND | 0 | 0 | 1 | 0.05 | npe | judge | npe | — |
| Eclipse Public License | 0 | 0 | 1 | 0.05 | npe | judge | npe | — |
| ODC-By-1.0 | 0 | 0 | 1 | 0.05 | race | judge | race | — |
| BOLA | 0 | 0 | 1 | 0.05 | heisenbug | judge | heisenbug | — |
| DSDP | 0 | 0 | 1 | 0.05 | heisenbug | judge | heisenbug | — |
| EPICS | 0 | 0 | 1 | 0.05 | heisenbug | judge | heisenbug | — |
| LGPLLR | 0 | 0 | 1 | 0.05 | heisenbug | judge | heisenbug | — |
| NPOSL-3.0 | 0 | 0 | 1 | 0.05 | heisenbug | judge | heisenbug | — |
| blessing | 0 | 0 | 1 | 0.05 | race | judge | race | — |
| 0BSD | 1 | 0 | 0 | 0.03 | leak | judge | leak | — |
| Academic Free License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Apple Public Source License ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Aladdin Free Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| BSD 4-Clause ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Business Source License ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Beerware ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Blue Oak Model License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Cryptographic Autonomy License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CATOSL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CDDL ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| CPAL-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CPL-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Caldera ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Condor-1.1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Educational Community License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Eiffel Forum License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| EUDatagrid ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| EUPL ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Entessa ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Erlang Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Functional Source License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FreeType License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Frameworx-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FreeImage ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| GLWTPL | 0 | 0 | 0 | 0.00 | bitflip | pin | — | — |
| HPND ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Hippocratic License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| IPA ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| IBM Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Info-ZIP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Interbase-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| JasPer-2.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Licence Art Libre ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Lucent Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| LaTeX Project Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| LiLiQ-P ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Libpng ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MIT-0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Microsoft Limited Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Microsoft Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Microsoft Reciprocal License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| MirOS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Motosoto ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MulanPSL ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Multics ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NASA-1.3 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| NCSA ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| NOSL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Netscape Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| NTP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Naumen ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Nokia ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| OCLC-2.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ODbL-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| SIL Open Font License ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| OGTSL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Open LDAP Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| OPL-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| OSET-PL-2.1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Open Software License ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| OpenPBS-2.3 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PDDL-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PHP License ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Python Software Foundation License ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| PolyForm-Noncommercial-1.0.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| PolyForm-Small-Business-1.0.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Q Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Reciprocal Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| RealNetworks Public Source License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Ruby License ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| SGI Free Software License B ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Sun Industry Standards Source License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| SML/NJ License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| SNIA ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Sun Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Server Side Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| Sendmail ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Simple Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Sleepycat ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| SugarCRM-1.1.3 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TAPR Open Hardware License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Tcl/Tk License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| TMate ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TORQUE-1.1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| UCL-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Universal Permissive License ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| UnRAR ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Vovida Software License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Vim License ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| W3C Software Notice and License ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| WTFNMFPL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| WTFPL | 0 | 0 | 0 | 0.00 | womm | pin | — | — |
| Sybase Open Watcom Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| X11 License ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| XFree86-1.1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Yahoo! Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zope Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Zend-2.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zimbra ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| bzip2 License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| copyleft-next ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| curl License ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| eCos-2.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| 3D Slicer License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Attribution Assurance License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Amazon Digital Services License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ALGLIB Documentation License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| AMD newlib License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| AMDPLPA ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Apple MIT License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| AML glslang License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| AMPAS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ANTLR Software Rights Notice ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Adobe PostScript AFM License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Adaptive Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ASWF Digital Assets License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Abstyles ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| AdaCore Doc License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Adobe-2006 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Adobe-Display-PostScript ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Adobe-Glyph ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Adobe-Utopia ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Advanced Cryptics Dictionary License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Afmparse ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| App-s2p ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Arphic Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Aspell-RU ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| BSD 1-Clause ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| BSD Protection License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| BSD Source Code Attribution ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| BaKoMa ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Baekmuk ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Bahyph ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Barr ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Bitstream-Charter ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Bitstream-Vera ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Boehm-Demers-Weiser GC License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Borceux ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Brian Gladman License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Buddy ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Bugroff ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Computational Use of Data Agreement ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CAPEC-tou ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CC-PDDC ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CC-PDM-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CC-SA-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Common Documentation License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CDLA-Permissive ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CDLA-Sharing ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CFITSIO ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CMU-Mach ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CNRI-Jython ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CNRI-Python ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| COIL-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CPOL-1.02 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CUA-OPL-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Catharon ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Clarified Artistic License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Community-Spec-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Cornell-Lossless-JPEG ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Cronyx ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CryptoSwift ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CrystalStacker ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| D-FSL-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| DEC-3-Clause ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| DL-DE-BY-2.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| DL-DE-ZERO-2.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| DocBook-DTD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| DocBook-Schema ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| DocBook-Stylesheet ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| DocBook-XML ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Dotseqn ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ESA-PL-permissive-2.4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ESA-PL-strong-copyleft-2.4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ESA-PL-weak-copyleft-2.4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Eurosym ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FBM ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FDK-AAC ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FDK-MPEG-H ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FSFAP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| FSFUL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Ferguson-Twofish ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FreeBSD-DOC ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Furuseth ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| GCR-docs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| GD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| GL2PS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Game-Programming-Gems ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Giftware ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Glide ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Glulxe ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Graphics-Gems ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Gutmann ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| HIDAPI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| HP-1986 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| HP-1989 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| HTMLTIDY ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| HaskellReport ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| IBM-pibs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ICU ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| IEC-Code-Components-EULA ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| IJG ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ISO-permission ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ImageMagick ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Imlib2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Informatica ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Inner-Net-2.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| InnoSetup ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Intel-ACPI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| JPL-image ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| JPNIC ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Kastrup ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Kazlib ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Knuth-CTAN ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| LPD-document ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| LZMA-SDK ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Latex2e ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Leptonica ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Linux-man-pages-copyleft ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Lucida-Bitmap-Fonts ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MIT-CMU ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MIT-Modern-Variant ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MIT-open-group ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MITNFA ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MMIXware ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MMPL-1.0.1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MPEG-SSG ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MTLL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MVT-1.1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Mackerras-3-Clause ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| MakeIndex ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Martin-Birgmeier ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| McPhee-slideshow ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Minpack ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Mup ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NAIST-2003 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NBPL-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NCBI-PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NCGL-UK-2.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NCL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NGPL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NICTA-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NIST-PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NLOD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NLPL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NRL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NTIA-PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Net-SNMP ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NetCDF ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Newsletr ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Noweb ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Nunit ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| O-UDA-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| OAR ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| OCCT-PL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| OFFIS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| OGC-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| OGDL-Taiwan-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| OGL-Canada-2.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| OGL-UK ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| OLFL-1.3 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| OML ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| OPL-UK-3.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| OPUBL-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| OSC-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| OSSP ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| OpenMDW-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| OpenVision ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PADL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PDL-Japan-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| PPL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ParaType-Free-Font-1.3 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Pixar ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Plexus ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Qhull ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| RHeCos-1.1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| RSA-MD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Ricoh Source Code Public License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Rdisc ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SAX-PD ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SCEA ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SGI-OpenGL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SGMLUG-PM ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SGP4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Solderpad Hardware License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| SMAIL-GPL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SMPPL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SOFA ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SSH-OpenSSH ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SSLeay-standalone ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SUL-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SWL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Saxpath ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SchemeReport ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Soundex ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Spencer ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Sun-PPP ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SunPro ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Symlinks ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TCP-wrappers ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Transitive Grace Period Public Licence ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TOSL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TPDL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TPL-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TTWL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TTYP0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TU-Berlin ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TekHVC ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TermReadKey ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ThirdEye ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| TrustedQSL ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| UCAR ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| UMich-Merit ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| URT-RLE ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Ubuntu Font Licence ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Unicode License ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| UnixCrypt ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| VOSTROM ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Vixie-Cron ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Widget-Workshop ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| WordNet ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Wsuipa ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| XSkat ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Xdebug-1.03 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Xerox ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Xfig ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Xnet ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zed ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Zeeff ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| any-OSI ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| atc-game ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| bcrypt-Solar-Designer ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| check-cvs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| checkmk ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| cve-tou ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| diffmark ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| dtoa ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| dvipdfm ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| eGenix ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Etalab Open License ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| fwlw ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| gSOAP-1.3b ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| generic-xts ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| gnuplot ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| gtkbook ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| hdparm ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| hyphen-bulgarian ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| iMatix ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| jove ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| libselinux-1.0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| libtiff ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| libutil-David-Nugent ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| lsof ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| magaz ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mailprio ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| man2html ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| metamail ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mpi-permissive ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mpich2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mplus ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ngrep ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| pkgconf ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| pnmstitch ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| psfrag ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| psutils ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| python-ldap ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| radvd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| snprintf ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| softSurfer ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ssh-keyscan ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| swrule ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| threeparttable ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ulem ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| w3m ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| wwl ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| wxWindows ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| xinetd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| xkeyboard-config-Zinoviev ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| xlock ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| xpp ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| xzoom ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): BSD 2-Clause (counts said race, now off-by-one), BSD 3-Clause (counts said leak, now off-by-one), CC BY-NC-SA (counts said race, now npe), CC0 (counts said heisenbug, now npe), Fair (counts said npe, now heisenbug), GFDL (counts said race, now npe), ISC (counts said heisenbug, now npe), LGPL (counts said leak, now off-by-one), MPL (counts said race, now npe), Intel (counts said leak, now heisenbug), LOOP (counts said npe, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

