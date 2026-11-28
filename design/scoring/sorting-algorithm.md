# Scoring: sorting-algorithm (Name a sorting algorithm)

48 answers (Bit Flip and Works on my machine left out); 3 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 5 (10%) | 5 | 0 |
| npe | 6 (12%) | 3 | 3 |
| leak | 0 (0%) | 3 | 0 |
| race | 0 (0%) | 3 | 0 |
| heisenbug | 37 (77%) | 34 | 3 |

Same tier as today: 42/48 (88%).

## Off-by-one (5)

insertion sort 6.0* [7408c 1071q 0f], quicksort 5.4 [12173c 3236q 0f], bubble sort 5.2 [8963c 1844q 0f], selection sort 5.0* [2728c 621q 0f], merge sort 4.7 [9502c 2777q 0f]

## Null pointer exception (6)

heapsort 4.0* [4290c 549q 1f], timsort 2.7 [4093c 85q 1f], radix sort 2.7 [4655c 343q 0f], counting sort 2.6 [2371c 135q 0f], bucket sort 2.4 [2251c 107q 1f], shell sort 2.1 [2238c 114q 0f]

## Memory leak (0)



## Race condition (0)



## Heisenbug (37)

straight selection sort 1.9 [2728c 0q 0f], Stalin sort 1.8 [0c 0q 0f], introsort 1.6 [1475c 13q 0f], tree sort 1.3 [475c 4q 0f], exchange sort 1.2 [0c 0q 0f], pancake sorting 1.1 [2409c 0q 0f], comb sort 1.1 [593c 0q 0f], cocktail shaker sort 1.0 [849c 0q 0f], pigeonhole sort 1.0 [390c 0q 0f], patience sorting 1.0 [612c 0q 0f], stooge sort 1.0 [956c 0q 0f], bitonic sorter 0.9 [1200c 0q 0f], tournament sort 0.9 [252c 0q 0f], gnome sort 0.9 [1084c 0q 0f], odd–even sort 0.8 [483c 0q 0f], samplesort 0.8 [225c 0q 0f], swapsort 0.8 [0c 0q 0f], multi-key quicksort 0.8 [84c 0q 0f], cycle sort 0.8 [600c 11q 0f], bitonic sort 0.7 [1200c 0q 0f], hybridsort 0.7 [0c 0q 0f], bead sort 0.7 [440c 0q 0f], pdqsort 0.7 [0c 0q 5f], smoothsort 0.6 [394c 3q 0f], strand sort 0.6 [133c 0q 0f], slowsort 0.6 [882c 0q 0f], Block sort 0.5 [947c 0q 0f], Burstsort 0.4 [121c 0q 0f], library sort 0.4 [210c 0q 0f], oscillating merge sort 0.4 [0c 0q 0f], pairwise sorting network 0.3 [129c 0q 0f], Proxmap sort 0.3 [27c 0q 0f], merge-insertion sort 0.3 [565c 0q 0f], Powersort 0.2 [0c 0q 0f], Batcher odd–even mergesort 0.2 [483c 0q 0f], cubesort 0.2 [158c 0q 0f], Kirkpatrick–Reisch sort 0.1 [85c 0q 0f]

## Confirmed lines the scores disagree with (never moved)

- bucket sort: leak in the bank, scores say npe (bucket sort 2.4 [2251c 107q 1f])
- shell sort: leak in the bank, scores say npe (shell sort 2.1 [2238c 114q 0f])
- timsort: leak in the bank, scores say npe (timsort 2.7 [4093c 85q 1f])
- introsort: race in the bank, scores say heisenbug (introsort 1.6 [1475c 13q 0f])
- cocktail shaker sort: race in the bank, scores say heisenbug (cocktail shaker sort 1.0 [849c 0q 0f])
- comb sort: race in the bank, scores say heisenbug (comb sort 1.1 [593c 0q 0f])

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
