# Scoring: linux-tracing-tool (Name a Linux tracing tool)

179 answers (Bit Flip and Works on my machine left out); 9 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (1%) | 2 | 0 |
| npe | 19 (11%) | 19 | 0 |
| leak | 2 (1%) | 2 | 0 |
| race | 8 (4%) | 8 | 0 |
| heisenbug | 148 (83%) | 148 | 0 |

Same tier as today: 179/179 (100%).

## Off-by-one (2)

strace 4.3 [509c 836q 43f 2729s], tcpdump 3.6 [994c 2014q 47f 0s]

## Null pointer exception (19)

perf 3.5 [707c 1202q 0f 0s], Valgrind 3.4 [1648c 4188q 45f 0s], eBPF 2.9 [0c 761q 0f 0s], ftrace 2.7 [184c 148q 0f 0s], sysdig 2.7 [0c 26q 14f 8325s], ltrace 2.6 [115c 67q 30f 0s], bpftrace 2.6 [0c 18q 15f 10445s], BCC 2.5 [0c 0q 0f 0s], auditd 2.4 [0c 313q 0f 0s], kprobes 2.4 [0c 0q 0f 0s], kprobe 2.4 [0c 89q 0f 0s], iolatency 2.3 [0c 0q 0f 0s], LTTng 2.2 [99c 93q 0f 0s], gprof 2.1 [283c 324q 0f 0s], Perfetto 2.1 [0c 20q 9f 6857s], trace-cmd 2.1 [0c 0q 17f 0s], DTrace 2.0 [0c 307q 3f 196s], execsnoop 2.0 [0c 0q 0f 0s], trace 2.0* [0c 0q 1f 0s]

## Memory leak (2)

OProfile 1.7 [59c 78q 18f 0s], javathreads 0.3 [0c 1065q 0f 0s]

## Race condition (8)

ply 2.0 [0c 0q 0f 1033s], uprobe 1.9 [0c 10q 0f 0s], blktrace 1.5 [0c 17q 17f 0s], apitrace 1.4 [0c 0q 19f 2887s], uftrace 1.3 [0c 0q 12f 3499s], Tracee 1.1 [0c 0q 2f 4690s], pwru 0.9 [0c 0q 5f 3857s], javaflow 0.5 [0c 12q 0f 0s]

## Heisenbug (148)

uprobes 2.0 [0c 0q 0f 0s], funccount 2.0 [0c 0q 0f 0s], tcptop 2.0 [0c 0q 0f 0s], profile 1.9 [0c 0q 0f 0s], rr 1.9 [0c 0q 0f 0s], opensnoop 1.9 [0c 0q 0f 0s], llcstat 1.7 [0c 0q 0f 0s], runqlat 1.7 [0c 0q 0f 0s], runqslower 1.6 [0c 0q 0f 0s], KernelShark 1.6 [0c 0q 10f 0s], statsnoop 1.6 [0c 0q 0f 0s], cachestat 1.5 [0c 0q 0f 0s], funcgraph 1.5 [0c 0q 0f 0s], dcsnoop 1.5 [0c 0q 0f 0s], tracepoints 1.5 [0c 0q 0f 0s], tcptracer 1.5 [0c 0q 0f 0s], biotop 1.4 [0c 0q 0f 0s], nodestat 1.4 [0c 0q 0f 0s], tcpconnect 1.4 [0c 0q 0f 0s], functrace 1.4 [0c 0q 0f 0s], cpudist 1.4 [0c 0q 0f 0s], exitsnoop 1.4 [0c 0q 0f 0s], stackcount 1.3 [0c 0q 0f 0s], tcplife 1.3 [0c 0q 0f 0s], ttysnoop 1.3 [0c 0q 4f 0s], capable 1.3 [0c 0q 0f 0s], bindsnoop 1.2 [0c 0q 0f 0s], tcpconnlat 1.2 [0c 0q 0f 0s], perf-stat-hist 1.2 [0c 0q 0f 0s], cachetop 1.2 [0c 0q 0f 0s], drsnoop 1.2 [0c 0q 0f 0s], biosnoop 1.2 [0c 0q 0f 0s], slabratetop 1.2 [0c 0q 0f 0s], sofdsnoop 1.2 [0c 0q 0f 0s], offcputime 1.2 [0c 0q 0f 0s], dbslower 1.2 [0c 0q 0f 0s], iosnoop 1.2 [0c 0q 0f 0s], tcpsynbl 1.1 [0c 0q 0f 0s], stacksnoop 1.1 [0c 0q 0f 0s], swapin 1.1 [0c 0q 0f 0s], solisten 1.1 [0c 0q 0f 0s], funcslower 1.1 [0c 0q 0f 0s], runqlen 1.1 [0c 0q 0f 0s], mysqld_qslower 1.1 [0c 0q 0f 0s], threadsnoop 1.1 [0c 0q 0f 0s], memleak 1.1 [0c 0q 0f 0s], tcpretrans 1.1 [0c 0q 0f 0s], wakeuptime 1.1 [0c 0q 0f 0s], tclstat 1.1 [0c 0q 0f 0s], biolatpcts 1.0 [0c 0q 0f 0s], filetop 1.0 [0c 0q 0f 0s], argdist 1.0 [0c 0q 0f 0s], dcstat 1.0 [0c 0q 0f 0s], klockstat 1.0 [0c 0q 0f 0s], pythongc 1.0 [0c 0q 0f 0s], fatrace 1.0 [0c 0q 13f 0s], xfsslower 1.0 [0c 0q 0f 0s], perlstat 1.0 [0c 0q 0f 0s], funclatency 1.0 [0c 0q 0f 0s], tcpaccept 0.9 [0c 0q 0f 0s] ...

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
