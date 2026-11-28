# Scoring: linux-tracing-tool (Name a Linux tracing tool)

179 answers (Bit Flip and Works on my machine left out); 9 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (1%) | 2 | 0 |
| npe | 19 (11%) | 15 | 0 |
| leak | 4 (2%) | 40 | 0 |
| race | 3 (2%) | 61 | 0 |
| heisenbug | 151 (84%) | 61 | 0 |

Same tier as today: 69/179 (39%).

## Off-by-one (2)

strace 4.3 [509c 836q 43f], tcpdump 3.6 [994c 2014q 47f]

## Null pointer exception (19)

perf 3.5 [707c 1202q 0f], Valgrind 3.4 [1648c 4188q 45f], eBPF 2.9 [0c 761q 0f], ftrace 2.7 [184c 148q 0f], sysdig 2.7 [0c 26q 14f], ltrace 2.6 [115c 67q 30f], bpftrace 2.6 [0c 18q 15f], BCC 2.5 [0c 215q 0f], auditd 2.4 [0c 313q 0f], kprobes 2.4 [0c 0q 0f], kprobe 2.4 [0c 89q 0f], iolatency 2.3 [0c 0q 0f], LTTng 2.2 [99c 93q 0f], gprof 2.1 [283c 324q 0f], Perfetto 2.1 [0c 20q 9f], trace-cmd 2.1 [0c 0q 17f], DTrace 2.0 [0c 307q 3f], execsnoop 2.0 [0c 0q 0f], trace 2.0* [0c 0q 1f]

## Memory leak (4)

OProfile 1.7 [59c 78q 18f], blktrace 1.5 [0c 17q 17f], apitrace 1.4 [0c 0q 19f], javathreads 0.3 [0c 1065q 0f]

## Race condition (3)

KernelShark 1.6 [0c 0q 10f], uftrace 1.3 [0c 0q 12f], fatrace 1.0 [0c 0q 13f]

## Heisenbug (151)

uprobes 2.0 [0c 0q 0f], ply 2.0 [0c 0q 7f], funccount 2.0 [0c 0q 0f], tcptop 2.0 [0c 0q 0f], profile 1.9 [0c 0q 0f], rr 1.9 [0c 33q 0f], opensnoop 1.9 [0c 0q 0f], uprobe 1.9 [0c 10q 0f], llcstat 1.7 [0c 0q 0f], runqlat 1.7 [0c 0q 0f], runqslower 1.6 [0c 0q 0f], statsnoop 1.6 [0c 0q 0f], cachestat 1.5 [0c 0q 0f], funcgraph 1.5 [0c 0q 0f], dcsnoop 1.5 [0c 0q 0f], tracepoints 1.5 [0c 0q 0f], tcptracer 1.5 [0c 0q 0f], biotop 1.4 [0c 0q 0f], nodestat 1.4 [0c 0q 0f], tcpconnect 1.4 [0c 0q 0f], functrace 1.4 [0c 0q 0f], cpudist 1.4 [0c 0q 0f], exitsnoop 1.4 [0c 0q 0f], stackcount 1.3 [0c 0q 0f], tcplife 1.3 [0c 0q 0f], ttysnoop 1.3 [0c 0q 4f], capable 1.3 [0c 0q 0f], bindsnoop 1.2 [0c 0q 0f], tcpconnlat 1.2 [0c 0q 0f], cachetop 1.2 [0c 0q 0f], perf-stat-hist 1.2 [0c 0q 0f], biosnoop 1.2 [0c 0q 0f], drsnoop 1.2 [0c 0q 0f], offcputime 1.2 [0c 0q 0f], slabratetop 1.2 [0c 0q 0f], sofdsnoop 1.2 [0c 0q 0f], dbslower 1.2 [0c 0q 0f], iosnoop 1.2 [0c 0q 0f], stacksnoop 1.1 [0c 0q 0f], tcpsynbl 1.1 [0c 0q 0f], swapin 1.1 [0c 0q 0f], funcslower 1.1 [0c 0q 0f], solisten 1.1 [0c 0q 0f], runqlen 1.1 [0c 0q 0f], threadsnoop 1.1 [0c 0q 0f], mysqld_qslower 1.1 [0c 0q 0f], memleak 1.1 [0c 0q 0f], tcpretrans 1.1 [0c 0q 0f], wakeuptime 1.1 [0c 0q 0f], Tracee 1.1 [0c 0q 2f], tclstat 1.1 [0c 0q 0f], filetop 1.0 [0c 0q 0f], biolatpcts 1.0 [0c 0q 0f], argdist 1.0 [0c 0q 0f], dcstat 1.0 [0c 0q 0f], klockstat 1.0 [0c 0q 0f], pythongc 1.0 [0c 0q 0f], xfsslower 1.0 [0c 0q 0f], funclatency 1.0 [0c 0q 0f], perlstat 1.0 [0c 0q 0f] ...

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
