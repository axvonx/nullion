# Scoring: graph-algorithm (Name a graph algorithm)

54 answers (Bit Flip and Works on my machine left out); 3 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 5 (9%) | 1 | 0 |
| npe | 8 (15%) | 10 | 0 |
| leak | 1 (2%) | 15 | 0 |
| race | 5 (9%) | 11 | 0 |
| heisenbug | 35 (65%) | 17 | 0 |

Same tier as today: 21/54 (39%).

## Off-by-one (5)

breadth-first search 5.5 [8662c 2237q 22f], depth-first search 5.3 [6840c 2986q 1f], Dijkstra's algorithm 5.2 [27292c 1921q 0f], PageRank 5.0* [12651c 350q 0f], A* search 4.6 [16997c 1194q 0f]

## Null pointer exception (8)

Kruskal's algorithm 4.0* [4631c 218q 0f], Prim's algorithm 4.0* [3867c 209q 0f], Topological sort 3.9 [7590c 322q 1f], Floyd-Warshall algorithm 3.1 [3806c 206q 0f], Bellman-Ford algorithm 3.0 [4689c 218q 0f], bidirectional search 2.8 [318c 9q 0f], Ford-Fulkerson algorithm 2.6 [2408c 107q 0f], Iterative deepening DFS 2.2 [976c 0q 0f]

## Memory leak (1)

Hungarian algorithm 1.6 [6854c 107q 0f]

## Race condition (5)

Kahn's algorithm 1.7 [7590c 0q 0f], Hierholzer's algorithm 0.9 [4583c 0q 0f], Fleury's algorithm 0.9 [4583c 0q 0f], Welsh-Powell algorithm 0.7 [5665c 0q 0f], d-separation 0.6 [5513c 0q 0f]

## Heisenbug (35)

IDA* 1.9 [717c 0q 0f], Edmonds-Karp algorithm 1.6 [1385c 38q 0f], Louvain method 1.6 [2318c 0q 0f], SPFA 1.4 [0c 0q 0f], Kosaraju's algorithm 1.4 [2330c 0q 0f], Johnson's algorithm 1.3 [681c 0q 0f], HITS algorithm 1.2 [392c 0q 0f], Hopcroft-Karp algorithm 1.2 [840c 0q 0f], Dinic's algorithm 1.2 [703c 0q 0f], Held-Karp algorithm 1.1 [1241c 0q 0f], Borůvka's algorithm 1.1 [1070c 0q 0f], Karger's algorithm 1.1 [686c 12q 0f], Christofides algorithm 1.0 [1269c 0q 0f], contraction hierarchies 1.0 [691c 0q 0f], Edmonds' blossom algorithm 1.0 [1107c 0q 0f], D* Lite 1.0 [682c 0q 0f], push-relabel algorithm 1.0 [457c 11q 0f], Jump Point Search 0.9 [581c 0q 1f], Brandes' algorithm 0.9 [0c 0q 0f], Bron-Kerbosch algorithm 0.9 [480c 0q 0f], Girvan-Newman algorithm 0.9 [312c 0q 0f], Dial's algorithm 0.8 [0c 0q 0f], DSatur 0.7 [262c 0q 0f], Yen's algorithm 0.7 [346c 0q 0f], Stoer-Wagner algorithm 0.7 [170c 0q 0f], Lexicographic breadth-first search 0.6 [130c 0q 0f], Weisfeiler-Lehman algorithm 0.5 [904c 0q 0f], Cuthill-McKee algorithm 0.5 [369c 0q 0f], Hopcroft-Tarjan planarity testing 0.5 [0c 0q 0f], Boykov-Kolmogorov algorithm 0.5 [0c 0q 0f], Gabow's algorithm 0.4 [125c 0q 0f], Chu-Liu/Edmonds algorithm 0.4 [555c 0q 0f], VF2 algorithm 0.4 [0c 0q 0f], Gabow's path-based SCC algorithm 0.4 [0c 0q 0f], Eppstein's algorithm 0.2 [307c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
