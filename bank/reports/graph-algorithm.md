# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: graph.

## graph-algorithm

50 candidates; 8 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| A* search | 0 | 59 | 428 | 0.80 | npe | counts | off-by-one | — |
| PageRank | 0 | 183 | 521 | 0.80 | npe | counts | npe | — |
| Johnson's algorithm ⚠ counts said npe | 0 | 101 | 142 | 0.77 | race | judge (override) | race | — |
| breadth-first search | 0 | 35 | 224 | 0.75 | npe | counts | off-by-one | — |
| depth-first search | 0 | 42 | 143 | 0.73 | npe | counts | off-by-one | — |
| Dijkstra's algorithm | 0 | 21 | 208 | 0.70 | npe | counts | off-by-one | — |
| Bellman-Ford algorithm | 0 | 8 | 58 | 0.52 | leak | counts | npe | — |
| Gomory-Hu tree | 0 | 7 | 31 | 0.46 | bitflip | pin | — | — |
| Kruskal's algorithm | 1 | 5 | 36 | 0.44 | leak | counts | npe | — |
| d-separation | 0 | 3 | 49 | 0.42 | leak | counts | race | — |
| Floyd-Warshall algorithm | 0 | 4 | 22 | 0.39 | leak | counts | npe | — |
| Hungarian algorithm | 0 | 2 | 29 | 0.36 | leak | counts | leak | — |
| contraction hierarchies ⚠ counts said leak | 0 | 4 | 14 | 0.36 | heisenbug | judge (override) | heisenbug | — |
| push-relabel algorithm | 0 | 4 | 12 | 0.35 | leak | counts | race | — |
| IDA* | 0 | 3 | 15 | 0.34 | leak | counts | race | — |
| Louvain method | 0 | 2 | 22 | 0.34 | leak | counts | race | — |
| Bron-Kerbosch algorithm | 0 | 2 | 11 | 0.29 | race | counts | race | — |
| Ford-Fulkerson algorithm ⚠ counts said race | 0 | 2 | 10 | 0.28 | npe | judge (override) | npe | — |
| Hopcroft-Karp algorithm | 0 | 2 | 9 | 0.28 | leak | judge | leak | — |
| DSatur | 0 | 2 | 9 | 0.28 | heisenbug | judge | heisenbug | — |
| Lexicographic breadth-first search | 0 | 1 | 12 | 0.26 | race | counts | heisenbug | — |
| HITS algorithm | 0 | 1 | 11 | 0.25 | race | counts | race | — |
| D* Lite | 0 | 2 | 5 | 0.24 | heisenbug | judge | heisenbug | — |
| Borůvka's algorithm | 0 | 1 | 7 | 0.22 | leak | judge | leak | — |
| Edmonds' blossom algorithm | 0 | 1 | 7 | 0.22 | race | judge | race | — |
| bidirectional search ⚠ counts said heisenbug | 0 | 0 | 17 | 0.21 | leak | judge (override) | leak | — |
| Yen's algorithm | 0 | 1 | 5 | 0.20 | heisenbug | judge | heisenbug | — |
| Weisfeiler-Lehman algorithm | 0 | 0 | 14 | 0.20 | heisenbug | counts | heisenbug | — |
| Prim's algorithm ⚠ counts said heisenbug | 0 | 0 | 10 | 0.18 | npe | judge (override) | npe | — |
| Christofides algorithm | 0 | 0 | 10 | 0.18 | heisenbug | counts | race | — |
| Boykov-Kolmogorov algorithm | 0 | 1 | 3 | 0.17 | heisenbug | judge | heisenbug | — |
| Jump Point Search | 0 | 1 | 2 | 0.15 | heisenbug | judge | heisenbug | — |
| Karger's algorithm | 0 | 0 | 5 | 0.13 | race | judge | race | — |
| VF2 algorithm | 0 | 1 | 1 | 0.12 | heisenbug | judge | heisenbug | — |
| Tarjan's strongly connected components algorithm | 0 | 0 | 4 | 0.12 | womm | pin | — | — |
| Edmonds-Karp algorithm | 0 | 0 | 4 | 0.12 | leak | judge | leak | — |
| Girvan-Newman algorithm | 0 | 0 | 3 | 0.10 | race | judge | race | — |
| Brandes' algorithm | 0 | 0 | 3 | 0.10 | heisenbug | judge | heisenbug | — |
| Eppstein's algorithm | 0 | 0 | 3 | 0.10 | heisenbug | judge | heisenbug | — |
| Gabow's algorithm | 0 | 0 | 3 | 0.10 | heisenbug | judge | heisenbug | — |
| Dinic's algorithm | 0 | 0 | 2 | 0.08 | leak | judge | leak | — |
| Held-Karp algorithm | 0 | 0 | 2 | 0.08 | race | judge | race | — |
| Hierholzer's algorithm | 0 | 0 | 2 | 0.08 | race | judge | race | — |
| Chu-Liu/Edmonds algorithm | 0 | 0 | 2 | 0.08 | race | judge | race | — |
| Cuthill-McKee algorithm | 0 | 0 | 2 | 0.08 | heisenbug | judge | heisenbug | — |
| Kosaraju's algorithm | 0 | 0 | 1 | 0.05 | leak | judge | leak | — |
| Dial's algorithm | 0 | 0 | 1 | 0.05 | heisenbug | judge | heisenbug | — |
| Kahn's algorithm ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| Stoer-Wagner algorithm ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Welsh-Powell algorithm ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): Prim's algorithm (counts said heisenbug, now npe), Ford-Fulkerson algorithm (counts said race, now npe), Johnson's algorithm (counts said npe, now race), bidirectional search (counts said heisenbug, now leak), contraction hierarchies (counts said leak, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

20/20 sampled answers are members (100%); 20/20 also have an acceptable tier. Not members: none.
