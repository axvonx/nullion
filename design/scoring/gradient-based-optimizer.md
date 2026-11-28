# Scoring: gradient-based-optimizer (Name a gradient-based optimizer)

56 answers (Bit Flip and Works on my machine left out); 0 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (4%) | 2 | 0 |
| npe | 8 (14%) | 8 | 0 |
| leak | 3 (5%) | 3 | 0 |
| race | 5 (9%) | 5 | 0 |
| heisenbug | 38 (68%) | 38 | 0 |

Same tier as today: 56/56 (100%).

## Off-by-one (2)

SGD 4.9 [0c 1456q 0f 0s], Adam 4.5 [0c 182q 2f 0s]

## Null pointer exception (8)

Momentum 3.7 [0c 0q 1f 0s], AdamW 3.4 [0c 0q 0f 0s], momentum SGD 3.3 [0c 0q 0f 0s], RMSProp 3.2 [0c 0q 0f 0s], Adagrad 3.0 [0c 0q 0f 0s], Newton's method 2.4 [2978c 425q 0f 0s], L-BFGS 2.0 [3458c 0q 0f 0s], Nesterov accelerated gradient 2.0 [0c 0q 0f 0s]

## Memory leak (3)

Levenberg-Marquardt 1.6 [5866c 90q 0f 0s], Lookahead 1.2 [0c 3313q 0f 0s], Apollo 0.9 [0c 4574q 4f 0s]

## Race condition (5)

Conjugate gradient 2.0 [4216c 0q 0f 0s], BFGS 2.0 [3369c 0q 0f 0s], Gauss-Newton 1.2 [3412c 0q 0f 0s], LARS 0.6 [0c 21q 0f 0s], Ranger 0.6 [0c 0q 32f 0s]

## Heisenbug (38)

Yogi 1.8 [0c 0q 0f 0s], AMSGrad 1.8 [0c 0q 0f 0s], NAdam 1.7 [0c 0q 0f 0s], Coordinate descent 1.5 [660c 0q 0f 0s], Rprop 1.4 [98c 0q 0f 0s], AdaGrad-Norm 1.4 [0c 0q 0f 0s], Adadelta 1.4 [0c 0q 0f 0s], Proximal gradient descent 1.2 [486c 0q 0f 0s], nonlinear conjugate gradient 1.2 [362c 0q 0f 0s], Adamax 1.2 [0c 0q 0f 0s], AdaBelief 1.2 [0c 0q 0f 0s], FTRL 1.1 [0c 0q 0f 0s], Adafactor 1.1 [0c 0q 0f 0s], RAdam 1.1 [0c 0q 3f 0s], natural gradient 1.1 [0c 0q 0f 0s], ASGD 1.0 [0c 0q 0f 0s], AdaBound 1.0 [0c 0q 0f 0s], SparseAdam 1.0 [0c 0q 0f 0s], signSGD 0.9 [0c 0q 0f 0s], Adam-mini 0.9 [0c 0q 0f 0s], Adan 0.8 [0c 0q 0f 0s], D-Adaptation 0.7 [0c 0q 0f 0s], K-FAC 0.7 [0c 0q 0f 0s], Mirror descent 0.7 [515c 0q 0f 0s], diffGrad 0.7 [0c 0q 0f 0s], Frank-Wolfe 0.7 [983c 0q 0f 0s], Muon 0.7 [0c 3q 0f 0s], Schedule-Free AdamW 0.6 [0c 0q 0f 0s], Prodigy 0.6 [0c 0q 0f 0s], SOAP 0.6 [0c 0q 1f 0s], AdaHessian 0.6 [0c 0q 0f 0s], QHAdam 0.6 [0c 0q 0f 0s], LAMB 0.6 [0c 0q 2f 0s], Novograd 0.6 [0c 0q 0f 0s], Madgrad 0.5 [0c 0q 0f 0s], Hessian-free optimization 0.5 [0c 0q 0f 0s], Fromage 0.4 [0c 0q 0f 0s], Sophia 0.3 [0c 0q 3f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
