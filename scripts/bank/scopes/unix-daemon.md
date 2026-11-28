# Scope: Name a Unix daemon
id: unix-daemon · by: claude (draft: the owner may veto any line)

A long-running background program (or kernel thread called a daemon) on any Unix-like system: Linux, macOS, the BSDs,
Solaris/illumos, AIX, historical Unix. Not only FreeBSD's base system.

## Sub-kinds
- init and service managers: init, systemd, launchd, runit, s6, upstart, OpenRC's supervisor, SMF's svc.startd
- network services: sshd, httpd, nginx, named, ntpd, chronyd, dhcpd, inetd, xinetd, smbd, nfsd, rpcbind
- mail: sendmail, postfix's master, exim, dovecot, qmail, comsat
- scheduling: cron, atd, anacron
- logging and auditing: syslogd, rsyslogd, syslog-ng, systemd-journald, auditd
- hardware and devices: udevd, devd, acpid, moused, gpm, bluetoothd, upowerd, smartd
- printing: cupsd, lpd
- desktop and IPC: dbus-daemon, avahi-daemon, polkitd, NetworkManager, pulseaudio, pipewire
- macOS: launchd, mDNSResponder, configd, coreaudiod, WindowServer, cfprefsd, mds
- kernel daemons: kernel threads documented as daemons (kswapd, kthreadd, khugepaged, kcompactd, ksoftirqd, pdflush, bdflush, update)
- servers run as daemons: mysqld, postgres, redis-server, memcached, dockerd, containerd

## In
- Any Unix-like system, current or historical: Linux and macOS daemons count as much as BSD ones.
- Kernel threads the kernel's own docs or man pages call a daemon or name like one (kswapd, the "kernel swap daemon").
- A daemon by its program name or its project name when that is how people say it (Postfix, nginx).

## Out
- Client programs and one-shot commands (ssh, ls, crontab): the daemon is sshd, crond.
- Per-instance names (kworker/0:1, getty@tty1): name the daemon, not an instance.
- Unit files, sockets and config names (sshd.service, sshd_config).
- Windows services. OWNER RULING PENDING: none expected.

## Examples
- off-by-one: cron, sshd, systemd, init, httpd
- npe: syslogd, launchd, ntpd, named, cupsd, nginx
- leak: udevd, dbus-daemon, kswapd, inetd, rsyslogd, avahi-daemon
- race: kthreadd, khugepaged, mDNSResponder, devd, comsat, rpcbind
- heisenbug: kcompactd, bdflush, rrenumd, bootparamd, cfprefsd
