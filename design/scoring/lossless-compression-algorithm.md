# Scoring: lossless-compression-algorithm (Name a lossless compression algorithm)

47 answers (Bit Flip and Works on my machine left out); 0 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (2%) | 1 | 0 |
| npe | 13 (28%) | 13 | 0 |
| leak | 3 (6%) | 5 | 0 |
| race | 3 (6%) | 1 | 0 |
| heisenbug | 27 (57%) | 27 | 0 |

Same tier as today: 43/47 (91%).

## Off-by-one (1)

Huffman coding 4.6 [10299c 1063q 1f]

## Null pointer exception (13)

DEFLATE 4.2 [5391c 630q 0f], run-length encoding 4.2 [3941c 256q 0f], Lempel-Ziv 3.5 [4482c 0q 0f], bzip2 3.2 [1657c 411q 62f], Brotli 2.9 [19879c 162q 55f], Zstandard 2.8 [5429c 100q 60f], LZ77 2.7 [4482c 43q 0f], LZMA 2.6 [0c 257q 19f], LZ4 2.4 [1989c 186q 59f], arithmetic coding 2.4 [2562c 0q 0f], Snappy 2.2 [510c 370q 0f], LZ78 2.1 [4482c 0q 0f], Burrows-Wheeler transform 2.0 [1856c 30q 0f]

## Memory leak (3)

LZO 1.7 [415c 121q 58f], LZX 1.4 [0c 67q 0f], PPM 1.2 [505c 288q 1f]

## Race condition (3)

Zopfli 1.1 [809c 9q 37f], ZPAQ 1.0 [702c 2q 22f], LZFSE 1.0 [0c 0q 22f]

## Heisenbug (27)

Delta encoding 1.9 [1203c 0q 0f], LZMA2 1.9 [0c 0q 0f], Canonical Huffman coding 1.9 [382c 0q 0f], adaptive Huffman coding 1.8 [252c 0q 0f], range coding 1.7 [321c 2q 0f], LZSS 1.5 [664c 0q 0f], LZF 1.4 [0c 12q 0f], Golomb coding 1.3 [1383c 0q 0f], Shannon-Fano coding 1.3 [732c 0q 0f], PAQ 1.2 [759c 0q 2f], FastLZ 1.2 [0c 0q 6f], CABAC 1.2 [356c 0q 0f], LZ4HC 1.2 [0c 0q 0f], PPMd 1.1 [505c 0q 4f], LZHAM 1.1 [0c 0q 6f], asymmetric numeral systems 1.1 [1619c 0q 0f], LZRW 1.1 [90c 0q 0f], Rice coding 1.0 [1383c 0q 0f], Elias gamma coding 1.0 [481c 0q 0f], move-to-front transform 1.0 [277c 0q 3f], LZJB 0.9 [0c 0q 0f], QuickLZ 0.9 [0c 0q 1f], LZP 0.8 [0c 0q 0f], Lizard 0.7 [0c 0q 0f], dynamic Markov compression 0.6 [60c 0q 2f], Finite State Entropy 0.5 [0c 0q 0f], cmix 0.5 [0c 0q 4f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
