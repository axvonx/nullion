# Name a gradient-based optimizer
id: gradient-based-optimizer · domain: data-graphics-algorithms · status: approved
> Any named first-order or preconditioned optimizer that updates parameters from gradients, from papers or library implementations.

## Off-by-one
- RMSProp | Root Mean Square Propagation (auto)
- Momentum | SGD with momentum | heavy ball (auto)

## Works on my machine
- Lion | Evolved Sign Momentum
  note: Google's EvoLved Sign Momentum optimizer — everyone's favorite recent drop-in after AdamW.

## Null pointer exception
- SGD | Stochastic Gradient Descent | gradient descent (auto)
- Adam | Adaptive Moment Estimation (auto)
- AdamW | Adam with decoupled weight decay (auto)
- Adagrad | Adaptive Gradient (auto)
- L-BFGS | Limited-memory BFGS (auto)
- BFGS | Broyden-Fletcher-Goldfarb-Shanno (auto)
- nonlinear conjugate gradient (auto)
- Conjugate gradient | CG (auto)
- Newton's method | Newton-Raphson (auto)
- Gauss-Newton | Gauss-Newton algorithm (auto)
- Levenberg-Marquardt | LM | damped least-squares (auto)
- Proximal gradient descent | proximal gradient | ISTA (auto)
- Coordinate descent | stochastic coordinate descent (auto)
- Mirror descent (auto)
- Frank-Wolfe | conditional gradient (auto)

## Memory leak
- Adadelta (auto)
- LAMB | Layer-wise Adaptive Moments | Layer-wise Adaptive Moments optimizer for Batch training (auto)
- FTRL | Follow-The-Regularized-Leader | FTRL-Proximal (auto)
- ASGD | Averaged SGD | Averaged Stochastic Gradient Descent (auto)
- momentum SGD (auto)
- Nesterov accelerated gradient | NAG | Nesterov momentum (auto)
- AMSGrad (auto)
- AdaBelief (auto)
- Sophia | Second-order Clipped Stochastic Optimization (auto)
- LARS | Layer-wise Adaptive Rate Scaling (auto)
- K-FAC (auto)
- Hessian-free optimization (auto)
- signSGD (auto)

## Race condition
- NAdam | Nesterov-accelerated Adam (auto)
- Adamax (auto)
- RAdam | Rectified Adam (auto)
- Adafactor (auto)
- Rprop | Resilient Backpropagation (auto)
- Muon (auto)
- SparseAdam (auto)
- AdaBound (auto)
- Yogi (auto)
- Lookahead (auto)
- Ranger (auto)
- natural gradient | Natural gradient descent | NGD (auto)

## Heisenbug
- Schedule-Free AdamW (auto)
- SOAP (auto)
- AdaHessian (auto)
- Adan (auto)
- Prodigy (auto)
- D-Adaptation (auto)
- QHAdam (auto)
- Madgrad (auto)
- Novograd (auto)
- Adam-mini (auto)
- Fromage (auto)
- AdaGrad-Norm (auto)
- diffGrad (auto)
- Apollo (auto)

## Bit Flip
- Shampoo
  note: Second-order preconditioned optimizer using Kronecker-factored matrix roots of gradient statistics.
