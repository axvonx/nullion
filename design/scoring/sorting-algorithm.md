# Scoring: sorting-algorithm (Name a sorting algorithm)

48 answers (Bit Flip and Works on my machine left out); 3 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 5 (10%) | 5 | 0 |
| npe | 6 (12%) | 3 | 3 |
| leak | 0 (0%) | 3 | 0 |
| race | 4 (8%) | 6 | 0 |
| heisenbug | 33 (69%) | 31 | 2 |

Same tier as today: 43/48 (90%).

## Off-by-one (5)

insertion sort 6.0* [7408c 1071q 0f 0s], quicksort 5.4 [12173c 3236q 0f 0s], bubble sort 5.2 [8963c 1844q 0f 0s], selection sort 5.0* [0c 621q 0f 0s], merge sort 4.7 [9502c 2777q 0f 0s]

## Null pointer exception (6)

heapsort 4.0* [4290c 549q 1f 0s], timsort 2.7 [4093c 85q 1f 0s], radix sort 2.7 [4655c 343q 0f 0s], counting sort 2.6 [2371c 135q 0f 0s], bucket sort 2.4 [2251c 107q 1f 0s], shell sort 2.1 [2238c 114q 0f 0s]

## Memory leak (0)



## Race condition (4)

introsort 1.6 [1475c 13q 0f 0s], pancake sorting 1.1 [2409c 0q 0f 0s], cycle sort 0.8 [600c 11q 0f 0s], Powersort 0.2 [2057c 0q 0f 0s]

## Heisenbug (33)

straight selection sort 1.9 [0c 0q 0f 0s], Stalin sort 1.8 [0c 0q 0f 0s], tree sort 1.3 [475c 4q 0f 0s], exchange sort 1.2 [0c 0q 0f 0s], comb sort 1.1 [593c 0q 0f 0s], cocktail shaker sort 1.0 [849c 0q 0f 0s], pigeonhole sort 1.0 [390c 0q 0f 0s], patience sorting 1.0 [612c 0q 0f 0s], stooge sort 1.0 [956c 0q 0f 0s], bitonic sorter 0.9 [0c 0q 0f 0s], tournament sort 0.9 [252c 0q 0f 0s], gnome sort 0.9 [1084c 0q 0f 0s], odd–even sort 0.8 [483c 0q 0f 0s], samplesort 0.8 [225c 0q 0f 0s], swapsort 0.8 [0c 0q 0f 0s], multi-key quicksort 0.8 [84c 0q 0f 0s], bitonic sort 0.7 [0c 0q 0f 0s], hybridsort 0.7 [0c 0q 0f 0s], bead sort 0.7 [440c 0q 0f 0s], pdqsort 0.7 [0c 0q 5f 0s], smoothsort 0.6 [394c 3q 0f 0s], strand sort 0.6 [133c 0q 0f 0s], slowsort 0.6 [882c 0q 0f 0s], Block sort 0.5 [947c 0q 0f 0s], Burstsort 0.4 [121c 0q 0f 0s], library sort 0.4 [210c 0q 0f 0s], oscillating merge sort 0.4 [0c 0q 0f 0s], pairwise sorting network 0.3 [129c 0q 0f 0s], Proxmap sort 0.3 [27c 0q 0f 0s], merge-insertion sort 0.3 [565c 0q 0f 0s], Batcher odd–even mergesort 0.2 [483c 0q 0f 0s], cubesort 0.2 [158c 0q 0f 0s], Kirkpatrick–Reisch sort 0.1 [85c 0q 0f 0s]

## Confirmed lines the scores disagree with (never moved)

- bucket sort: leak in the bank, scores say npe (bucket sort 2.4 [2251c 107q 1f 0s])
- shell sort: leak in the bank, scores say npe (shell sort 2.1 [2238c 114q 0f 0s])
- timsort: leak in the bank, scores say npe (timsort 2.7 [4093c 85q 1f 0s])
- cocktail shaker sort: race in the bank, scores say heisenbug (cocktail shaker sort 1.0 [849c 0q 0f 0s])
- comb sort: race in the bank, scores say heisenbug (comb sort 1.1 [593c 0q 0f 0s])

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
