# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: daemon, service.

## unix-daemon

55 candidates; 42 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| moused | 3 | 1 | 8 | 0.95 | race | judge | race | — |
| unbound | 0 | 7 | 66 | 0.80 | npe | counts | npe | — |
| cron | 2 | 1 | 1 | 0.65 | off-by-one | judge | off-by-one | — |
| dma ⚠ counts said npe | 17 | 0 | 12 | 0.60 | heisenbug | judge (override) | heisenbug | — |
| syslogd | 1 | 0 | 1 | 0.20 | off-by-one | judge | off-by-one | — |
| klogd | 6 | 0 | 0 | 0.20 | leak | judge | leak | — |
| mountd | 5 | 0 | 0 | 0.20 | leak | judge | leak | — |
| nfsd | 4 | 0 | 0 | 0.18 | npe | judge | npe | — |
| sendmail | 0 | 0 | 1 | 0.13 | off-by-one | judge | off-by-one | — |
| comsat | 0 | 0 | 1 | 0.13 | heisenbug | judge | heisenbug | — |
| inetd | 0 | 0 | 0 | 0.00 | womm | pin | npe | — |
| tftpd ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| fingerd | 0 | 0 | 0 | 0.00 | womm | pin | leak | — |
| nscd ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| rpcbind ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| auditd ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| blacklistd ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| bootpd ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ftp-proxy ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| gssd ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| powerd ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| rarpd ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| rpc.lockd ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| rpc.statd ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| rtadvd ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| rtsold ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| rwhod ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ypbind ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ypserv ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| auditdistd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| bootparamd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| bsnmpd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ctld ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| nfscbd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| nfsuserd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| pppoed ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rbootd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| route6d ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rpc.rquotad ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rpc.rstatd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rpc.rusersd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rpc.rwalld ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rpc.sprayd | 0 | 0 | 0 | 0.00 | bitflip | pin | heisenbug | — |
| rpc.tlsclntd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rpc.tlsservd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rpc.yppasswdd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rpc.ypupdated ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rpc.ypxfrd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rrenumd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| tftp-proxy ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ypldap ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| iscsid ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| talkd | 0 | 0 | 0 | 0.00 | womm | pin | race | — |
| watchdogd ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| tcpd ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): dma (counts said npe, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

19/20 sampled answers are members (95%); 18/20 also have an acceptable tier. Not members: tcpd (TCP wrapper: inetd runs it per connection as an access-control shim that then execs the service. It is not a background service in its own right.).

## Pipeline report

Generated 2026-11-27 19:07 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/unix-daemon.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (rpc.sprayd; inetd, fingerd, talkd): the owner vets them
- scripts/bank/obvious-draft/unix-daemon.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 33/33 obvious answers accepted |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | PASS | 77/79 answers have a verified link (97%); prompt link yes |
| precision | PASS | 19/20 sampled answers are members (95%), 18/20 with acceptable tier |
| answer count | PASS | 79 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 3 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 6 | 6 |
| Works on my machine | 3 | 0 |
| Null pointer exception | 25 | 25 |
| Memory leak | 7 | 7 |
| Race condition | 15 | 15 |
| Heisenbug | 22 | 22 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 1.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## unix-daemon
_Name a Unix daemon_

Works on my machine:
- [ ] inetd
- [ ] fingerd
- [ ] talkd
- [ ] comsat
- [ ] rwhod
- [ ] other: 

Bit Flip:
- [ ] comsat
- [ ] rbootd
- [ ] rpc.sprayd
- [ ] rrenumd
- [ ] bootparamd
- [ ] pppoed
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 10 |
| harvest | done | 3 |
| filter | done | 53 |
| compare | done | 0 |
| escalate | done | 23 |
| merge | done | 7 |
| obvious | done | 25 |
| dupes | done | 0 |
| links | done | 31 |
| precision | done | 23 |
| report | running |  |
