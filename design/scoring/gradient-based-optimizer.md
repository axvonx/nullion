# Scoring: gradient-based-optimizer (Name a gradient-based optimizer)

56 answers (Bit Flip and Works on my machine left out); 0 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (4%) | 2 | 0 |
| npe | 8 (14%) | 8 | 0 |
| leak | 6 (11%) | 6 | 0 |
| race | 3 (5%) | 2 | 0 |
| heisenbug | 37 (66%) | 38 | 0 |

Same tier as today: 55/56 (98%).

## Off-by-one (2)

SGD 4.9 [7671c 1456q 1f], Adam 4.5 [7671c 182q 2f]

## Null pointer exception (8)

Momentum 3.7 [7671c 78q 1f], AdamW 3.4 [0c 0q 0f], momentum SGD 3.3 [7671c 0q 0f], RMSProp 3.2 [7671c 0q 0f], Adagrad 3.0 [7671c 0q 0f], Newton's method 2.4 [2978c 425q 0f], L-BFGS 2.0 [3458c 0q 0f], Nesterov accelerated gradient 2.0 [0c 0q 2f]

## Memory leak (6)

Conjugate gradient 2.0 [4216c 303q 0f], Levenberg-Marquardt 1.6 [5866c 1928q 0f], Lookahead 1.2 [0c 3313q 0f], Apollo 0.9 [0c 4574q 4f], SOAP 0.6 [0c 27759q 1f], Ranger 0.6 [0c 121q 32f]

## Race condition (3)

BFGS 2.0 [3369c 0q 0f], Gauss-Newton 1.2 [3412c 0q 0f], LARS 0.6 [0c 21q 0f]

## Heisenbug (37)

Yogi 1.8 [0c 0q 0f], AMSGrad 1.8 [0c 0q 0f], NAdam 1.7 [0c 0q 0f], Coordinate descent 1.5 [660c 0q 0f], Rprop 1.4 [98c 0q 0f], AdaGrad-Norm 1.4 [0c 0q 0f], Adadelta 1.4 [0c 0q 0f], Proximal gradient descent 1.2 [486c 0q 0f], nonlinear conjugate gradient 1.2 [362c 0q 0f], Adamax 1.2 [0c 0q 0f], AdaBelief 1.2 [0c 0q 0f], FTRL 1.1 [0c 0q 0f], Adafactor 1.1 [0c 0q 0f], RAdam 1.1 [0c 0q 3f], natural gradient 1.1 [0c 0q 0f], ASGD 1.0 [0c 0q 0f], AdaBound 1.0 [0c 0q 0f], SparseAdam 1.0 [0c 0q 0f], signSGD 0.9 [0c 0q 0f], Adam-mini 0.9 [0c 0q 0f], Adan 0.8 [0c 0q 0f], D-Adaptation 0.7 [0c 0q 0f], K-FAC 0.7 [0c 0q 0f], Mirror descent 0.7 [515c 0q 0f], diffGrad 0.7 [0c 0q 0f], Frank-Wolfe 0.7 [983c 0q 0f], Muon 0.7 [0c 3q 0f], Schedule-Free AdamW 0.6 [0c 0q 0f], Prodigy 0.6 [0c 11q 0f], AdaHessian 0.6 [0c 0q 0f], QHAdam 0.6 [0c 0q 0f], LAMB 0.6 [0c 0q 2f], Novograd 0.6 [0c 0q 0f], Madgrad 0.5 [0c 0q 0f], Hessian-free optimization 0.5 [0c 0q 0f], Fromage 0.4 [0c 0q 0f], Sophia 0.3 [0c 0q 3f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
