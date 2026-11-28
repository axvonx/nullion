# Source-first derivation: unix-daemon (Name a Unix daemon)

Generated 2026-11-27 by `python3 -I scripts/sources/unix_daemon.py`. No LLM in the path; rerunning on the same corpora gives the same output. The bank was not changed: merging is the owner's call.

## Summary

- **1875 derived answers** (`~/nullion-corpora/derived/unix-daemon.json`).
- **Bank coverage:** 108/112 of the bank's playable answers are in the derived set.
- **Tier agreement** on the 104 bank ladder answers found (Works on my machine and Bit Flip are hand picks, left out): exact 59/104 (57%), within one tier 83/104 (80%), Spearman 0.705.
- **Cut-offs** (score >= c): off-by-one 0.6586, npe 0.2372, leak 0.2062, race 0.1101, else heisenbug.
- **Derived tier counts:** off-by-one 25, npe 228, leak 55, race 532, heisenbug 1035.
- **Probe:** derived 59/60, current bank 60/60. Each source alone: debian 36, freebsd 13, curated 11, macos 9, kernel 5.

Caveat: the cut-offs are fitted on the same bank answers the agreement is measured on (in-sample), and the bank's tiers were themselves judged by an LLM; the agreement is an upper bound on how well the formula reproduces the bank, not a measure of truth.
The probe was written by Haiku on 2026-11-27 with the scope spec in its prompt; its misses were since promoted into the bank, which is why the bank now covers all 60. Without an LLM, the derived set covers the probe as listed below.

## Sources and rules

```
Source-first derivation of "Name a Unix daemon". Stdlib only, no LLM, deterministic.

Usage: python3 -I scripts/sources/unix_daemon.py
Needs: python3 -I scripts/fetch-corpora.py debian homebrew stackexchange repology wikidata kernel-src freebsd-daemons macos

Membership (a union; each rule is mechanical, see the report for counts):
  debian:debtags      packages tagged interface::daemon: their daemon-like programs (below)
  debian:service-unit packages shipping a systemd .service unit: their daemon-like programs, and a unit named
                      after the package or one of its programs
  macos:launchd       /System/Library/LaunchDaemons programs; LaunchAgents programs only when daemon-like
  kernel:kthread      names given to kernel threads in the Linux source (kthread_run/kthread_create*'s format
                      string, smpboot's .thread_comm, a fixed comm[] string), cut at the first % or /, kept when
                      they start with "k" or end in "d" (kswapd, ksoftirqd, kthreadd, kauditd) and are not tests
  freebsd:rc.d        the program an rc.d script runs (command=, ${name} resolved), when it is daemon-like or the
                      script has a pidfile
  freebsd:man8        usr.sbin/libexec section-8 pages whose .Nd line says "daemon" or "server"
  curated             scripts/sources/curated/unix-daemon.json: 14 init systems, historical daemons and postgres no dataset
                      holds (each with a reason)
Daemon-like program: its name ends in "d", contains "daemon", or equals its package's name; never a *ctl client,
a unit/socket/config name, or a per-instance name (scope Out rules).
Aliases: the package (and its Repology project) when the package has exactly one daemon, Stack Exchange tag
synonyms, Wikidata aliases (classes daemon, init, web server, message transfer agent, name server) of a name match.
Familiarity: scripts/sources/common.py (se primary; popcon, Homebrew, sitelinks, Repology families, kernel-docs
mentions secondary).
Writes ~/nullion-corpora/derived/unix-daemon.json and design/sources/unix-daemon.md.
```

Distinct names per source (before merging): debian 1213, macos 598, kernel 35, freebsd 68, curated 14.

Inputs:
- `debian/Packages.xz`: 2026-11-28
- `debian/Contents-amd64.gz`: 2026-11-28
- `macos/launchd-jobs.json`: 2026-11-28, 887 plists; macOS 26.5.2 25F84
- `kernel/linux-src/DONE`: 2026-11-28, commit 7cd8495c0f16275c4f9abe1cef09a7b5fcd6d046 2026-11-27T18:56:58-08:00; sparse ['/mm/**/*.c', '/kernel/**/*.c', '/fs/**/*.c', '/block/**/*.c', '/init/*.c', '/lib/*.c', '/net/**/*.c', '/include/linux/kthread.h', '/arch/x86/entry/syscalls/', '/include/uapi/asm-generic/', '/include/uapi/linux/', '/arch/x86/include/asm/cpufeatures.h', '/arch/x86/include/uapi/asm/', '/include/linux/nvme.h', '/include/acpi/actbl*.h', 'Kconfig*']; 6934 files, 161 MB with .git
- `src/freebsd-daemons/DONE`: 2026-11-28, commit 056925e30639c8b62841fcca8efcc02bd90e04dd 2026-11-27T17:32:04-08:00; sparse ['/libexec/rc/rc.d/', '/usr.sbin/**/*.8', '/libexec/**/*.8']; 434 files, 20 MB with .git
- `repology/packages.tsv.gz`: 2026-11-28, 5061926 rows
- `wikidata/class-daemon-Q308980.json`: 2026-11-28, 82 items
- `stackexchange/unix-tags.json`: 2026-11-28, 2500 items, 25 pages; TRUNCATED: the first 2500 in popular order (an app key lifts the cap)

## Familiarity

```
se   = Stack Exchange question count of the entry's tag, summed over Stack Overflow, Unix & Linux, Server Fault and
         Super User (per site: the largest count among the entry's names, through that site's tag synonyms). A name
         that is an English dictionary word (/usr/share/dict/words: "master", "update", "atom") only counts on the
         category's `se_word_sites`, because the bare tag usually means something else on Stack Overflow.
  each secondary signal x (popcon installs, Homebrew 365-day installs, Wikidata sitelinks, Repology families,
  kernel-Documentation mentions) is normalised as min(1, log1p(x) / log1p(ref)), ref = the category's 3rd-largest
  value of that signal (the bank scorer's convention), and so is se.
  Package-level signals (popcon, Homebrew, Repology) count half for a name that is not its package's own name
  (systemd-journald does not inherit all of systemd's installs).
  score = W_SE * se_n + (1 - W_SE) * mean(secondary signals the entry HAS a source for). An entry with no secondary
  source (a kernel thread, a macOS daemon) is scored on se alone, so a zero Stack Exchange count means "deepest".
Tiers: Off-by-one / NPE / Leak / Race / Heisenbug by four score cut-offs, fitted to the bank's tiered answers that
the derived set contains (an optimal monotone split, `fit_cutoffs`). Works on my machine and Bit Flip are hand
picks and never derived.
```

Confusion (rows: bank tier, columns: derived tier):

| bank \ derived | off-by-one | npe | leak | race | heisenbug |
|---|---|---|---|---|---|
| off-by-one | 7 | 1 | 0 | 0 | 0 |
| npe | 3 | 18 | 0 | 5 | 1 |
| leak | 0 | 5 | 3 | 1 | 2 |
| race | 0 | 9 | 0 | 7 | 13 |
| heisenbug | 0 | 4 | 0 | 1 | 24 |

Biggest disagreements (two or more tiers apart):

- nfsd: bank npe, derived heisenbug (score 0.0, se 0)
- dma: bank heisenbug, derived npe (score 0.5753, se 869, {'stackoverflow': 869})
- s6-svscan: bank heisenbug, derived npe (score 0.2959, se 12, {'stackoverflow': 12})
- cups-browsed: bank heisenbug, derived npe (score 0.2777, se 0)
- kcompactd: bank heisenbug, derived npe (score 0.2392, se 0)
- atd: bank npe, derived race (score 0.16, se 0)
- cupsd: bank npe, derived race (score 0.1889, se 0)
- smbd: bank npe, derived race (score 0.167, se 0)
- dockerd: bank npe, derived race (score 0.1452, se 0)
- telnetd: bank npe, derived race (score 0.1415, se 0)
- mountd: bank leak, derived heisenbug (score 0.0, se 0)
- ypbind: bank leak, derived heisenbug (score 0.0965, se 0)
- auditd: bank race, derived npe (score 0.5158, se 284, {'unix': 118, 'serverfault': 166})
- iscsid: bank race, derived npe (score 0.353, se 41, {'serverfault': 41})
- runit: bank race, derived npe (score 0.4927, se 103, {'stackoverflow': 47, 'unix': 32, 'serverfault': 24})
- Upstart: bank race, derived npe (score 0.3367, se 0)
- smartd: bank race, derived npe (score 0.4073, se 28, {'unix': 28})
- khugepaged: bank race, derived npe (score 0.3858, se 0)
- anacron: bank race, derived npe (score 0.4813, se 37, {'unix': 37})
- systemd-journald: bank race, derived npe (score 0.4892, se 533, {'stackoverflow': 95, 'unix': 317, 'serverfault': 121})
- polkitd: bank race, derived npe (score 0.2836, se 0)

## Bank coverage by tier

- off-by-one: 8/8
- womm: 3/3
- npe: 27/27
- leak: 11/12
- race: 29/30
- heisenbug: 29/31
- bitflip: 1/1

## In the bank, not derived (4)

- klogd (leak): in no source
- pppoed (heisenbug): in no source
- qmail (race): in no source
- ypldap (heisenbug): rejected: FreeBSD rc.d ypldap runs a non-daemon program

## Derived, not in the bank (1763)

By source: curated 3, debian:debtags 435, debian:service-unit 714, freebsd:man8 8, freebsd:rc.d 14, kernel:kthread 30, macos:LaunchAgents 215, macos:LaunchDaemons 379.

Top 60 by score (name, derived tier, score, sources):

- sudo (off-by-one, 0.8514; debian:service-unit)
- rsync (off-by-one, 0.8482; debian:debtags)
- openvpn (off-by-one, 0.8072; debian:debtags)
- pulseaudio (off-by-one, 0.7489; debian:debtags)
- prometheus (off-by-one, 0.7403; debian:service-unit)
- haproxy (off-by-one, 0.7342; debian:debtags)
- mdadm (off-by-one, 0.7313; debian:debtags)
- podman (off-by-one, 0.707; debian:service-unit)
- logrotate (off-by-one, 0.6984; debian:service-unit)
- lighttpd (off-by-one, 0.6946; debian:debtags)
- keyboxd (off-by-one, 0.694; debian:service-unit)
- onedrive (off-by-one, 0.693; debian:service-unit)
- mosquitto (off-by-one, 0.6907; debian:service-unit)
- apache2 (off-by-one, 0.686; debian:debtags)
- dnsmasq (off-by-one, 0.6677; debian:debtags)
- quota (npe, 0.6359; debian:service-unit)
- freeradius (npe, 0.6358; debian:debtags)
- ejabberd (npe, 0.6344; debian:service-unit)
- lightdm (npe, 0.6191; debian:service-unit)
- preload (npe, 0.6191; debian:debtags)
- monit (npe, 0.6166; debian:debtags)
- lvm (npe, 0.6159; debian:service-unit)
- start-stop-daemon (npe, 0.6062; debian:service-unit)
- prometheus-node-exporter (npe, 0.6014; debian:service-unit)
- xen (npe, 0.5965; debian:service-unit)
- docker-registry (npe, 0.5914; debian:service-unit)
- systemd-bsod (npe, 0.5889; debian:debtags)
- gpg-agent (npe, 0.5882; debian:service-unit)
- xrdp (npe, 0.5822; debian:debtags)
- sddm (npe, 0.5669; debian:service-unit)
- corosync (npe, 0.5659; debian:service-unit)
- keepalived (npe, 0.5656; debian:debtags)
- opendkim (npe, 0.5645; debian:service-unit)
- plymouth (npe, 0.563; debian:service-unit)
- lxc-monitord (npe, 0.5597; debian:service-unit)
- ssh-agent (npe, 0.5596; debian:service-unit)
- iperf3 (npe, 0.5584; debian:service-unit)
- etcd (npe, 0.5561; debian:service-unit)
- mpd (npe, 0.5483; debian:debtags)
- systemd-random-seed (npe, 0.5463; debian:debtags)
- ssmtp (npe, 0.5449; debian:debtags)
- sssd (npe, 0.5423; debian:service-unit)
- gpsd (npe, 0.541; debian:debtags)
- nasd (npe, 0.5386; debian:debtags)
- wpa_supplicant (npe, 0.5363; debian:debtags)
- containerd (npe, 0.5311; debian:service-unit)
- pgbouncer (npe, 0.5305; debian:service-unit)
- fluidsynth (npe, 0.5302; debian:service-unit)
- coturn (npe, 0.5301; debian:service-unit)
- snmpd (npe, 0.5255; debian:debtags, macos:LaunchDaemons)
- winbind (npe, 0.5227; debian:debtags)
- powertop (npe, 0.5138; debian:service-unit)
- privoxy (npe, 0.5112; debian:debtags)
- nvme (npe, 0.5106; debian:service-unit)
- beanstalkd (npe, 0.5095; debian:debtags)
- prometheus-alertmanager (npe, 0.5042; debian:service-unit)
- gdm3 (npe, 0.5019; debian:service-unit)
- pure-ftpd (npe, 0.4996; debian:debtags)
- fetchmail (npe, 0.4994; debian:debtags)
- pppd (npe, 0.4983; debian:debtags)

## Sample per derived tier (top 15 by score)

- **off-by-one** (25): postgres, nginx, systemd, sudo, cron, rsync, openvpn, sendmail, mysqld, memcached, httpd, pulseaudio, prometheus, haproxy, mdadm
- **npe** (228): quota, freeradius, ejabberd, vsftpd, exim, lightdm, preload, monit, lvm, start-stop-daemon, prometheus-node-exporter, xen, launchd, named, docker-registry
- **leak** (55): notification-daemon, feedbackd, tcpd, ptpd, clamav-daemon, nats-server, system-tools-backends, gerbera, ircd, sshguard, motion, i2pd, fastnetmon, mbpfan, rrdcached
- **race** (532): miredo, nslcd, bird, cyrus-imapd, milter-greylist, darkstat, miniflux, blkdiscard, cryptmount, c-icap, pound, bamfdaemon, webhook, soundmodem, ksmbd
- **heisenbug** (1035): calls-daemon, pure-ftpd-postgresql, direvent, gnupg-pkcs11-scd-proxy, systemd-netlogd, afpd, cnid_dbd, cnid_metad, mako, mknetid, rpc.yppasswdd, rpc.ypxfrd, yppasswdd, ypxfrd, parsec

## Probe (scripts/bank/runs/unix-daemon/probe.json)

Derived covers **59/60** probe answers; the current bank's playable tiers cover **60/60**.

| probe answer | depth | sub-kind | derived | in bank tiers |
|---|---|---|---|---|
| cron | common | scheduling | cron (off-by-one) | yes |
| sshd | common | network services | sshd (off-by-one) | yes |
| systemd | common | init and service managers | systemd (off-by-one) | yes |
| init | common | init and service managers | init (off-by-one) | yes |
| httpd | common | network services | httpd (off-by-one) | yes |
| nginx | common | network services | nginx (off-by-one) | yes |
| syslogd | common | logging and auditing | syslogd (npe) | yes |
| launchd | common | macOS | launchd (npe) | yes |
| cupsd | common | printing | cupsd (race) | yes |
| mysqld | common | servers run as daemons | mysqld (off-by-one) | yes |
| dockerd | common | servers run as daemons | dockerd (race) | yes |
| kswapd | common | kernel daemons | kswapd (npe) | yes |
| postfix | common | mail | postfix (npe) | yes |
| redis-server | common | servers run as daemons | redis-server (npe) | yes |
| crond | common | scheduling | crond (race) | yes |
| runit | mid | init and service managers | runit (npe) | yes |
| upstart | mid | init and service managers | upstart (npe) | yes |
| inetd | mid | network services | inetd (npe) | yes |
| named | mid | network services | named (npe) | yes |
| ntpd | mid | network services | ntpd (npe) | yes |
| dhcpd | mid | network services | dhcpd (npe) | yes |
| sendmail | mid | mail | sendmail (off-by-one) | yes |
| exim | mid | mail | exim (npe) | yes |
| atd | mid | scheduling | atd (race) | yes |
| rsyslogd | mid | logging and auditing | rsyslogd (npe) | yes |
| auditd | mid | logging and auditing | auditd (npe) | yes |
| udevd | mid | hardware and devices | systemd-udevd (race) | yes |
| acpid | mid | hardware and devices | acpid (npe) | yes |
| smartd | mid | hardware and devices | smartd (npe) | yes |
| lpd | mid | printing | lpd (npe) | yes |
| dbus-daemon | mid | desktop and IPC | dbus-daemon (npe) | yes |
| mDNSResponder | mid | macOS | mDNSResponder (heisenbug) | yes |
| kthreadd | mid | kernel daemons | kthreadd (race) | yes |
| khugepaged | mid | kernel daemons | khugepaged (npe) | yes |
| postgres | mid | servers run as daemons | postgres (off-by-one) | yes |
| s6-svscan | deep | init and service managers | s6-svscan (npe) | yes |
| supervise-daemon | deep | init and service managers | supervise-daemon (heisenbug) | yes |
| svc.startd | deep | init and service managers | svc.startd (heisenbug) | yes |
| xinetd | deep | network services | xinetd (npe) | yes |
| rpcbind | deep | network services | rpcbind (npe) | yes |
| bootparamd | deep | network services | bootparamd (heisenbug) | yes |
| qmail | deep | mail | **missing** | yes |
| comsat | deep | mail | comsat (heisenbug) | yes |
| anacron | deep | scheduling | anacron (npe) | yes |
| syslog-ng | deep | logging and auditing | syslog-ng (npe) | yes |
| systemd-journald | deep | logging and auditing | systemd-journald (npe) | yes |
| devd | deep | hardware and devices | devd (heisenbug) | yes |
| moused | deep | hardware and devices | moused (race) | yes |
| cups-browsed | deep | printing | cups-browsed (npe) | yes |
| lpsched | deep | printing | lpsched (heisenbug) | yes |
| polkitd | deep | desktop and IPC | polkitd (npe) | yes |
| NetworkManager | deep | desktop and IPC | NetworkManager (npe) | yes |
| pipewire | deep | desktop and IPC | pipewire (npe) | yes |
| configd | deep | macOS | configd (heisenbug) | yes |
| coreaudiod | deep | macOS | coreaudiod (heisenbug) | yes |
| cfprefsd | deep | macOS | cfprefsd (heisenbug) | yes |
| ksoftirqd | deep | kernel daemons | ksoftirqd (race) | yes |
| kcompactd | deep | kernel daemons | kcompactd (npe) | yes |
| pdflush | deep | kernel daemons | pdflush (heisenbug) | yes |
| bdflush | deep | kernel daemons | bdflush (heisenbug) | yes |
