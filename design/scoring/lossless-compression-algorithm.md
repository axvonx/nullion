# Scoring: lossless-compression-algorithm (Name a lossless compression algorithm)

47 answers (Bit Flip and Works on my machine left out); 0 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (2%) | 1 | 0 |
| npe | 13 (28%) | 13 | 0 |
| leak | 0 (0%) | 0 | 0 |
| race | 4 (9%) | 4 | 0 |
| heisenbug | 29 (62%) | 29 | 0 |

Same tier as today: 47/47 (100%).

## Off-by-one (1)

Huffman coding 4.6 [10299c 1063q 1f 0s]

## Null pointer exception (13)

DEFLATE 4.2 [5391c 0q 0f 0s], run-length encoding 4.2 [3941c 256q 0f 0s], Lempel-Ziv 3.5 [0c 0q 0f 0s], bzip2 3.2 [1657c 411q 62f 0s], Brotli 2.9 [19879c 162q 55f 15186s], Zstandard 2.8 [5429c 100q 60f 28371s], LZ77 2.7 [0c 43q 0f 0s], LZMA 2.6 [0c 257q 19f 0s], LZ4 2.4 [1989c 0q 0f 12890s], arithmetic coding 2.4 [2562c 0q 0f 0s], Snappy 2.2 [510c 0q 0f 0s], LZ78 2.1 [0c 0q 0f 0s], Burrows-Wheeler transform 2.0 [1856c 30q 0f 0s]

## Memory leak (0)



## Race condition (4)

Zopfli 1.1 [809c 9q 37f 3616s], asymmetric numeral systems 1.1 [1619c 0q 0f 0s], ZPAQ 1.0 [702c 2q 22f 0s], LZFSE 1.0 [284c 0q 22f 1825s]

## Heisenbug (29)

Delta encoding 1.9 [1203c 0q 0f 0s], LZMA2 1.9 [0c 0q 0f 0s], Canonical Huffman coding 1.9 [382c 0q 0f 0s], adaptive Huffman coding 1.8 [252c 0q 0f 0s], range coding 1.7 [321c 2q 0f 0s], LZO 1.7 [415c 0q 0f 0s], LZSS 1.5 [664c 0q 0f 0s], LZX 1.4 [0c 0q 0f 0s], LZF 1.4 [0c 0q 0f 0s], Golomb coding 1.3 [0c 0q 0f 0s], Shannon-Fano coding 1.3 [732c 0q 0f 0s], PAQ 1.2 [759c 0q 1f 0s], FastLZ 1.2 [0c 0q 6f 550s], PPM 1.2 [0c 0q 0f 0s], CABAC 1.2 [356c 0q 0f 0s], LZ4HC 1.2 [0c 0q 0f 0s], PPMd 1.1 [0c 0q 4f 0s], LZHAM 1.1 [0c 0q 6f 728s], LZRW 1.1 [90c 0q 0f 0s], Rice coding 1.0 [0c 0q 0f 0s], Elias gamma coding 1.0 [481c 0q 0f 0s], move-to-front transform 1.0 [277c 0q 0f 0s], LZJB 0.9 [0c 0q 0f 0s], QuickLZ 0.9 [0c 0q 1f 0s], LZP 0.8 [0c 0q 0f 0s], Lizard 0.7 [0c 0q 0f 0s], dynamic Markov compression 0.6 [60c 0q 0f 0s], Finite State Entropy 0.5 [0c 0q 0f 0s], cmix 0.5 [0c 0q 4f 735s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
