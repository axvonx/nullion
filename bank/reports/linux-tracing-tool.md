# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: trace, tracing.

## linux-tracing-tool

166 candidates; 147 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| trace ⚠ counts said off-by-one | 2171 | 18610 | 19721 | 1.00 | leak | judge (override) | leak | — |
| Tracee ⚠ counts said off-by-one | 2171 | 18610 | 19721 | 1.00 | heisenbug | judge (override) | heisenbug | — |
| profile | 16 | 119 | 649 | 0.85 | npe | counts | leak | — |
| loads ⚠ counts said npe | 34 | 48 | 500 | 0.79 | heisenbug | judge (override) | heisenbug | — |
| capable ⚠ counts said npe | 16 | 23 | 2267 | 0.78 | race | judge (override) | race | — |
| deadlock | 3 | 9 | 21 | 0.41 | leak | counts | race | — |
| perf | 65 | 3 | 3 | 0.35 | leak | counts | npe | — |
| ftrace | 154 | 1 | 5 | 0.35 | leak | counts | leak | — |
| LTTng | 2 | 3 | 4 | 0.24 | leak | judge | leak | — |
| kprobe ⚠ counts said heisenbug | 35 | 0 | 3 | 0.21 | leak | judge (override) | leak | — |
| kprobes ⚠ counts said heisenbug | 35 | 0 | 3 | 0.21 | leak | judge (override) | leak | — |
| strace | 7 | 0 | 3 | 0.15 | off-by-one | judge | off-by-one | — |
| BCC | 0 | 1 | 5 | 0.15 | leak | judge | leak | — |
| uprobe ⚠ counts said heisenbug | 13 | 0 | 1 | 0.14 | leak | judge (override) | leak | — |
| uprobes | 13 | 0 | 1 | 0.14 | heisenbug | counts | race | — |
| softirqs | 31 | 0 | 0 | 0.14 | heisenbug | counts | race | — |
| hardirqs | 30 | 0 | 0 | 0.14 | heisenbug | counts | race | — |
| funcgraph ⚠ counts said heisenbug | 13 | 0 | 0 | 0.10 | leak | judge (override) | leak | — |
| writeback | 0 | 0 | 5 | 0.09 | heisenbug | judge | heisenbug | — |
| bpftrace | 1 | 0 | 1 | 0.06 | leak | judge | leak | — |
| readahead | 0 | 0 | 2 | 0.06 | heisenbug | judge | heisenbug | — |
| trace-cmd | 3 | 0 | 0 | 0.05 | leak | judge | leak | — |
| blktrace | 2 | 0 | 0 | 0.04 | race | judge | race | — |
| sysdig | 0 | 0 | 1 | 0.04 | leak | judge | leak | — |
| Perfetto | 0 | 0 | 1 | 0.04 | race | judge | race | — |
| SystemTap | 1 | 0 | 0 | 0.03 | womm | pin | — | — |
| argdist ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| bashreadline ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| bindsnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| biolatency ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| biolatpcts ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| biopattern ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| biosnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| biostacks ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| biotop ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| bitesize ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| bpflist ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| btrfsdist ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| btrfsslower ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| cachestat ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| cachetop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| cobjnew ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| compactsnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| cpudist ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| cpuunclaimed ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| cpuwalk ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| criticalstat | 0 | 0 | 0 | 0.00 | bitflip | pin | — | — |
| dbslower ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| dbstat ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| dcsnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| dcstat ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| dirtop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| drsnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| execsnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| exitsnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ext4dist ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ext4slower ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| f2fsslower ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| filegone ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| filelife ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| fileslower ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| filetop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| funccount ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| funcinterval ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| funclatency ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| funcslower ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| functrace ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| gethostlatency ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| iolatency ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| iosnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| javacalls ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| javaflow ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| javagc ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| javaobjnew ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| javastat ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| javathreads ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| killsnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| klockstat ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| kvmexit ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| llcstat ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| mdflush ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| memleak ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| mountsnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| mysqld_qslower ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| naptime ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| netqtop ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| nfsdist ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| nfsslower ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| nodegc ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| nodestat ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| numasched ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| offcputime ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| offwaketime ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| oomkill ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| opensnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| perf-stat-hist ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| perlcalls ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| perlflow ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| perlstat ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| phpcalls ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| phpflow ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| phpstat ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| pidpersec ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ppchcalls ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| pythoncalls ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| pythonflow ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| pythongc ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| pythonstat ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| rdmaucma ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rubycalls ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rubyflow ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rubygc ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rubyobjnew ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rubystat ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| runqlat ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| runqlen ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| runqslower ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| setuids ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| shmsnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| slabratetop ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| sofdsnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| softirqslower ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| solisten ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ssllatency ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| sslsniff ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| sslsnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| stackcount ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| stacksnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| statsnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| swapin ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| syncsnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| syscount ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tclcalls ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| tclflow ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| tclobjnew ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| tclstat ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| tcpaccept ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tcpcong ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| tcpconnect ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tcpconnlat ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| tcpdrop ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tcplife ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tcpretrans ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tcprtt ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| tcpstates ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| tcpsubnet ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| tcpsynbl ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| tcptop ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tcptracer ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| threadsnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| tplist ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| tpoint ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ttysnoop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| undump ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| vfscount ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| vfsstat ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| virtiostat ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| wakeuptime ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| wqlat ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| xfsdist ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| xfsslower ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| zfsdist ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| zfsslower ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ltrace ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| KernelShark ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| uftrace ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): capable (counts said npe, now race), funcgraph (counts said heisenbug, now leak), kprobe (counts said heisenbug, now leak), loads (counts said npe, now heisenbug), trace (counts said off-by-one, now leak), uprobe (counts said heisenbug, now leak), kprobes (counts said heisenbug, now leak), Tracee (counts said off-by-one, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

20/20 sampled answers are members (100%); 20/20 also have an acceptable tier. Not members: none.
