# Name a TCP congestion control algorithm
id: tcp-congestion-control-algorithm · domain: os-systems · status: approved
> Any named algorithm that adjusts TCP's congestion window, from RFCs, Linux tcp_* modules or research papers.

## Off-by-one
- Reno | TCP Reno (auto)
- CUBIC | TCP CUBIC | cc_cubic (auto)
- TCP Tahoe | Tahoe (auto)
- Compound TCP | CTCP (auto)

## Works on my machine
- TCP Vegas | cc_vegas | Vegas
  note: The delay-based classic everyone names right after Reno, CUBIC, and BBR.

## Null pointer exception
- BBR | TCP BBR | Bottleneck Bandwidth and Round-trip propagation time (auto)
- TCP Westwood+ | Westwood+ (auto)
- LEDBAT | Low Extra Delay Background Transport (auto)
- BBRv2 | BBR2 (auto)
- BBRv3 | BBR3 (auto)
- PCC | Performance-oriented Congestion Control | PCC Vivace (auto)
- Copa (auto)
- Sprout (auto)
- TIMELY (auto)
- Swift | Swift congestion control (auto)
- TCP Nice (auto)

## Memory leak
- NewReno | cc_newreno | TCP NewReno (auto)
- DCTCP | tcp_dctcp | cc_dctcp | Data Center TCP (auto)

## Race condition
- TCP BIC | BIC | BIC-TCP | Binary Increase Congestion control (auto)
- HighSpeed TCP | tcp_highspeed | HSTCP (auto)
- H-TCP | tcp_htcp | cc_htcp | Hamilton TCP (auto)
- Scalable TCP | tcp_scalable | STCP (auto)
- TCP Westwood | Westwood (auto)
- Hybla | TCP Hybla (auto)

## Heisenbug
- TCP-NV | New Vegas (auto)
- TCP-LP | Low Priority TCP (auto)
- Veno | TCP Veno (auto)
- YeAH | YeAH-TCP | tcp_yeah (auto)
- Illinois | TCP-Illinois (auto)
- CHD | cc_chd (auto)

## Bit Flip
- CDG | tcp_cdg | cc_cdg | CAIA Delay-Gradient
  note: CAIA Delay-Gradient — infers queue buildup from RTT gradients while coexisting with loss-based flows.
