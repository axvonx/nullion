# Name a TCP congestion control algorithm
id: tcp-congestion-control-algorithm · domain: os-systems · status: draft
> Any named algorithm that adjusts TCP's congestion window, from RFCs, Linux tcp_* modules or research papers.

## Off-by-one
- Reno | TCP Reno (auto)
- CUBIC | TCP CUBIC | cc_cubic (auto)

## Works on my machine
- TCP Vegas | cc_vegas | Vegas

## Null pointer exception
- BBR | TCP BBR (auto)

## Memory leak
- NewReno | cc_newreno (auto)
- DCTCP | tcp_dctcp | cc_dctcp (auto)

## Race condition
- TCP BIC | BIC (auto)
- HighSpeed TCP | tcp_highspeed (auto)
- H-TCP | tcp_htcp | cc_htcp | Hamilton TCP (auto)
- Scalable TCP | tcp_scalable (auto)
- TCP Westwood (auto)
- Hybla | TCP Hybla (auto)

## Heisenbug
- TCP-NV (auto)
- TCP-LP (auto)
- Veno | TCP Veno (auto)
- YeAH | YeAH-TCP | tcp_yeah (auto)
- Illinois | TCP-Illinois (auto)
- CHD | cc_chd (auto)

## Bit Flip
- CDG | tcp_cdg | cc_cdg
