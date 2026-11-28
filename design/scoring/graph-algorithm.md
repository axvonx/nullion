# Scoring: graph-algorithm (Name a graph algorithm)

54 answers (Bit Flip and Works on my machine left out); 3 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 5 (9%) | 5 | 0 |
| npe | 8 (15%) | 8 | 0 |
| leak | 2 (4%) | 2 | 0 |
| race | 4 (7%) | 4 | 0 |
| heisenbug | 35 (65%) | 35 | 0 |

Same tier as today: 54/54 (100%).

## Off-by-one (5)

breadth-first search 5.5 [8662c 2237q 0f 0s], depth-first search 5.3 [6840c 2597q 0f 0s], Dijkstra's algorithm 5.2 [27292c 1921q 0f 0s], PageRank 5.0* [12651c 350q 0f 0s], A* search 4.6 [16997c 1194q 0f 0s]

## Null pointer exception (8)

Kruskal's algorithm 4.0* [4631c 218q 0f 0s], Prim's algorithm 4.0* [3867c 209q 0f 0s], Topological sort 3.9 [0c 322q 1f 0s], Floyd-Warshall algorithm 3.1 [3806c 206q 0f 0s], Bellman-Ford algorithm 3.0 [4689c 218q 0f 0s], bidirectional search 2.8 [318c 9q 0f 0s], Ford-Fulkerson algorithm 2.6 [2408c 107q 0f 0s], Iterative deepening DFS 2.2 [976c 0q 0f 0s]

## Memory leak (2)

Edmonds-Karp algorithm 1.6 [1385c 38q 0f 0s], Hungarian algorithm 1.6 [6854c 107q 0f 0s]

## Race condition (4)

Louvain method 1.6 [2318c 0q 0f 0s], Kosaraju's algorithm 1.4 [2330c 0q 0f 0s], Karger's algorithm 1.1 [686c 12q 0f 0s], push-relabel algorithm 1.0 [457c 11q 0f 0s]

## Heisenbug (35)

IDA* 1.9 [717c 0q 0f 0s], Kahn's algorithm 1.7 [0c 0q 0f 0s], SPFA 1.4 [0c 0q 0f 0s], Johnson's algorithm 1.3 [681c 0q 0f 0s], HITS algorithm 1.2 [392c 0q 0f 0s], Hopcroft-Karp algorithm 1.2 [840c 0q 0f 0s], Dinic's algorithm 1.2 [703c 0q 0f 0s], Held-Karp algorithm 1.1 [1241c 0q 0f 0s], Borůvka's algorithm 1.1 [1070c 0q 0f 0s], Christofides algorithm 1.0 [1269c 0q 0f 0s], contraction hierarchies 1.0 [691c 0q 0f 0s], Edmonds' blossom algorithm 1.0 [1107c 0q 0f 0s], D* Lite 1.0 [682c 0q 0f 0s], Jump Point Search 0.9 [581c 0q 0f 0s], Brandes' algorithm 0.9 [0c 0q 0f 0s], Hierholzer's algorithm 0.9 [0c 0q 0f 0s], Bron-Kerbosch algorithm 0.9 [480c 0q 0f 0s], Fleury's algorithm 0.9 [0c 0q 0f 0s], Girvan-Newman algorithm 0.9 [312c 0q 0f 0s], Dial's algorithm 0.8 [0c 0q 0f 0s], DSatur 0.7 [262c 0q 0f 0s], Yen's algorithm 0.7 [346c 0q 0f 0s], Stoer-Wagner algorithm 0.7 [170c 0q 0f 0s], Welsh-Powell algorithm 0.7 [0c 0q 0f 0s], Lexicographic breadth-first search 0.6 [130c 0q 0f 0s], d-separation 0.6 [0c 0q 0f 0s], Weisfeiler-Lehman algorithm 0.5 [904c 0q 0f 0s], Cuthill-McKee algorithm 0.5 [369c 0q 0f 0s], Hopcroft-Tarjan planarity testing 0.5 [0c 0q 0f 0s], Boykov-Kolmogorov algorithm 0.5 [0c 0q 0f 0s], Gabow's algorithm 0.4 [125c 0q 0f 0s], Chu-Liu/Edmonds algorithm 0.4 [555c 0q 0f 0s], VF2 algorithm 0.4 [0c 0q 0f 0s], Gabow's path-based SCC algorithm 0.4 [0c 0q 0f 0s], Eppstein's algorithm 0.2 [307c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
