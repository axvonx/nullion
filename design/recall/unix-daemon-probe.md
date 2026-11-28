# Head-recall probe: unix-daemon (Name a Unix daemon)

28 of 60 real probe answers are playable (47%); 0 only in the Inbox; 32 new ones added to the Inbox; 0 probe answers judged not members (out of scope or not real).

## Misses by sub-kind
- desktop and IPC: polkitd, NetworkManager, pipewire
- hardware and devices: udevd, smartd, devd
- init and service managers: systemd, init, runit, upstart, s6-svscan, supervise-daemon, svc.startd
- kernel daemons: kswapd, kthreadd, khugepaged, ksoftirqd, kcompactd, pdflush, bdflush
- logging and auditing: syslog-ng, systemd-journald
- macOS: launchd, mDNSResponder, configd, coreaudiod, cfprefsd
- mail: postfix, qmail
- printing: cups-browsed, lpsched
- scheduling: anacron

## Inbox only (rejected in play until promoted)

## Judged
- systemd (×1): **to the Inbox** as systemd (off-by-one): The init system and service manager, listed in the scope spec's init section as a daemon-style PID 1 process.
- init (×1): **to the Inbox** as init (off-by-one): The first process on Unix-like systems, which supervises the rest of the system and is named in the scope spec.
- launchd (×1): **to the Inbox** as launchd (npe): The macOS init and service manager, documented in Apple's launchd man page and listed in the spec's macOS section.
- kswapd (×1): **to the Inbox** as kswapd (leak): The Linux kernel swap daemon, which the kernel's own documentation calls a daemon.
- postfix (×1): **to the Inbox** as Postfix (npe): A mail transfer agent whose master process is a daemon, and whose project name is how people refer to it.
- runit (×1): **to the Inbox** as runit (race): A process supervision and init suite whose runsvdir and runit init run as daemons, listed in the spec's init section.
- upstart (×1): **to the Inbox** as Upstart (race): A historical Ubuntu init and event-driven service manager, listed in the spec's init section.
- udevd (×1): **to the Inbox** as udevd (leak): The device manager daemon for Linux, listed in the spec's hardware section.
- smartd (×1): **to the Inbox** as smartd (race): The smartmontools disk-monitoring daemon, listed in the spec's hardware section.
- mDNSResponder (×1): **to the Inbox** as mDNSResponder (race): The macOS mDNS and DNS-SD service daemon, listed in the spec's macOS section.
- kthreadd (×1): **to the Inbox** as kthreadd (race): The Linux kernel thread daemon that spawns other kernel threads, named in the spec's kernel daemon examples.
- khugepaged (×1): **to the Inbox** as khugepaged (race): The Linux kernel daemon that collapses memory pages into huge pages, named in the spec's kernel daemon list.
- s6-svscan (×1): **to the Inbox** as s6-svscan (heisenbug): The process scanner of the s6 supervision suite, a real daemon documented in the s6 project's manual.
- supervise-daemon (×1): **to the Inbox** as supervise-daemon (heisenbug): The OpenRC supervisor program that keeps services running, named in the spec's init section as OpenRC's supervisor.
- svc.startd (×1): **to the Inbox** as svc.startd (race): The Solaris and illumos SMF service daemon, named in the spec's init and service manager list.
- qmail (×1): **to the Inbox** as qmail (race): The qmail mail system, whose qmail-send and related daemons are named by the project in the spec's mail section.
- anacron (×1): **to the Inbox** as anacron (race): The periodic job scheduler daemon for systems that are not always running, listed in the spec's scheduling section.
- syslog-ng (×1): **to the Inbox** as syslog-ng (leak): A logging daemon listed in the spec's logging section.
- systemd-journald (×1): **to the Inbox** as systemd-journald (race): The systemd journal logging daemon, listed in the spec's logging section.
- devd (×1): **to the Inbox** as devd (race): The FreeBSD device state change daemon, named in the spec's race examples.
- cups-browsed (×1): **to the Inbox** as cups-browsed (heisenbug): The CUPS printer browsing daemon from OpenPrinting, a real daemon that the spec's printing section covers through CUPS.
- lpsched (×1): **to the Inbox** as lpsched (heisenbug): The historical System V line printer scheduler daemon, documented in Solaris and SysV printing manuals.
- polkitd (×1): **to the Inbox** as polkitd (race): The PolicyKit authorization daemon, listed in the spec's desktop and IPC section.
- NetworkManager (×1): **to the Inbox** as NetworkManager (leak): The network connection manager daemon, listed in the spec's desktop and IPC section.
- pipewire (×1): **to the Inbox** as PipeWire (leak): The media server daemon for Linux audio and video, listed in the spec's desktop and IPC section.
- configd (×1): **to the Inbox** as configd (race): macOS's SystemConfiguration daemon, which manages network and system configuration state.
- coreaudiod (×1): **to the Inbox** as coreaudiod (heisenbug): macOS's CoreAudio daemon that mediates audio hardware access for apps.
- cfprefsd (×1): **to the Inbox** as cfprefsd (heisenbug): macOS's preferences daemon that caches and serves user and system defaults.
- ksoftirqd (×1): **to the Inbox** as ksoftirqd (race): Linux's per-CPU kernel thread that runs deferred softirq work, documented in the kernel docs.
- kcompactd (×1): **to the Inbox** as kcompactd (heisenbug): Linux's per-node kernel thread that compacts memory to produce contiguous pages.
- pdflush (×1): **to the Inbox** as pdflush (race): Historical Linux kernel thread pool that wrote dirty pages back to disk, replaced by per-device flusher threads.
- bdflush (×1): **to the Inbox** as bdflush (heisenbug): Historical Linux kernel daemon that flushed dirty buffers to disk, documented in the kernel and man pages.

## Covered
- cron
- sshd
- httpd
- nginx
- syslogd
- cupsd
- mysqld
- dockerd
- redis-server
- crond
- inetd
- named
- ntpd
- dhcpd
- sendmail
- exim
- atd
- rsyslogd
- auditd
- acpid
- lpd
- dbus-daemon
- postgres
- xinetd
- rpcbind
- bootparamd
- comsat
- moused
