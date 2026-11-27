# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: compression.

## lossless-compression-algorithm

44 candidates; 8 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| Huffman coding | 4 | 142 | 127 | 0.93 | off-by-one | counts | off-by-one | — |
| Lempel-Ziv | 0 | 99 | 158 | 0.80 | npe | counts | off-by-one | — |
| arithmetic coding | 0 | 103 | 101 | 0.79 | npe | counts | npe | — |
| run-length encoding | 2 | 26 | 78 | 0.74 | npe | counts | off-by-one | — |
| LZ77 | 1 | 32 | 75 | 0.72 | npe | counts | npe | — |
| Burrows-Wheeler transform | 0 | 39 | 117 | 0.72 | npe | counts | npe | — |
| DEFLATE | 10 | 10 | 31 | 0.70 | npe | counts | off-by-one | — |
| LZ4 | 10 | 9 | 9 | 0.59 | npe | counts | npe | — |
| LZW | 0 | 58 | 15 | 0.59 | womm | pin | — | — |
| LZ78 | 0 | 17 | 26 | 0.53 | leak | counts | leak | — |
| PPM | 0 | 28 | 15 | 0.52 | leak | counts | leak | — |
| LZMA | 4 | 4 | 10 | 0.48 | leak | counts | npe | — |
| asymmetric numeral systems | 0 | 9 | 25 | 0.47 | leak | counts | race | — |
| bzip2 | 5 | 2 | 14 | 0.47 | leak | counts | npe | — |
| LZO | 13 | 3 | 1 | 0.38 | leak | counts | leak | — |
| Golomb coding | 0 | 10 | 6 | 0.37 | leak | counts | leak | — |
| LZSS | 0 | 16 | 3 | 0.36 | leak | counts | leak | — |
| Zstandard | 1 | 2 | 9 | 0.35 | npe | judge | npe | — |
| Brotli | 0 | 3 | 5 | 0.27 | npe | judge | npe | — |
| LZMA2 | 3 | 0 | 4 | 0.25 | race | judge | race | — |
| adaptive Huffman coding | 0 | 2 | 4 | 0.23 | heisenbug | judge | heisenbug | — |
| Tunstall coding | 0 | 2 | 3 | 0.21 | bitflip | pin | — | — |
| range coding | 0 | 0 | 8 | 0.18 | leak | judge | leak | — |
| dynamic Markov compression | 0 | 2 | 1 | 0.15 | heisenbug | judge | heisenbug | — |
| PAQ | 0 | 0 | 5 | 0.15 | race | judge | race | — |
| ZPAQ | 0 | 0 | 3 | 0.12 | heisenbug | judge | heisenbug | — |
| cmix | 0 | 0 | 2 | 0.09 | heisenbug | judge | heisenbug | — |
| LZP | 0 | 1 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| move-to-front transform | 0 | 1 | 0 | 0.06 | leak | judge | leak | — |
| Snappy | 0 | 0 | 1 | 0.06 | leak | judge | leak | — |
| Shannon-Fano coding | 0 | 0 | 1 | 0.06 | leak | judge | leak | — |
| LZFSE | 0 | 0 | 1 | 0.06 | race | judge | race | — |
| PPMd | 0 | 0 | 1 | 0.06 | race | judge | race | — |
| Zopfli | 0 | 0 | 1 | 0.06 | race | judge | race | — |
| LZF | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| LZ4HC | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| Elias gamma coding ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| LZX ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| LZJB ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| LZRW ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| QuickLZ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| FastLZ ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| LZHAM ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Lizard ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): none

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

