# Name a Unix daemon
id: unix-daemon · domain: os-systems · status: draft
> Any named background service program on a Unix-like system, as named in its man page or the system's standard service list.

## Off-by-one
- cron | crond | vixie cron (auto)
- sendmail | sendmail daemon (auto)
- syslogd | syslog daemon (auto)
- sshd | openssh | ssh daemon (auto)
- httpd | apache | apache httpd (auto)
- nginx | nginx server (auto)

## Works on my machine
- inetd | internet daemon
- fingerd
- talkd

## Null pointer exception
- nfsd | nfs daemon | nfs server (auto)
- tftpd | tftp daemon (auto)
- unbound | unbound daemon (auto)
- named | bind | bind9 (auto)
- xinetd | extended inetd (auto)
- atd | at daemon (auto)
- lpd | line printer daemon (auto)
- cupsd | cups | cups daemon (auto)
- ntpd | ntp | ntp daemon (auto)
- chronyd | chrony (auto)
- dhcpd | dhcp daemon | isc dhcp (auto)
- smbd | samba (auto)
- mysqld | mysql | mysql daemon (auto)
- postgres | postgresql | postgres daemon (auto)
- redis-server | redis (auto)
- memcached | memcache (auto)
- dockerd | docker daemon | docker (auto)
- rsyslogd | rsyslog (auto)
- dovecot | dovecot daemon (auto)
- exim | exim4 (auto)
- vsftpd | very secure ftpd (auto)
- telnetd | telnet daemon (auto)
- avahi-daemon | avahi (auto)
- dbus-daemon | dbus (auto)
- acpid | acpi daemon (auto)

## Memory leak
- klogd (auto)
- mountd (auto)
- nscd (auto)
- rpcbind | portmap | portmapper (auto)
- ypbind (auto)
- ypserv (auto)
- tcpd (auto)

## Race condition
- auditd (auto)
- blacklistd | blocklistd (auto)
- bootpd (auto)
- ftp-proxy (auto)
- gssd (auto)
- powerd (auto)
- rarpd (auto)
- rpc.lockd (auto)
- rpc.statd (auto)
- rtadvd (auto)
- rtsold (auto)
- rwhod (auto)
- iscsid (auto)
- watchdogd (auto)
- moused (auto)

## Heisenbug
- auditdistd (auto)
- bootparamd (auto)
- bsnmpd (auto)
- comsat (auto)
- ctld (auto)
- nfscbd (auto)
- nfsuserd (auto)
- pppoed (auto)
- rbootd (auto)
- route6d (auto)
- rpc.rquotad (auto)
- rpc.rstatd (auto)
- rpc.rusersd (auto)
- rpc.rwalld (auto)
- rpc.tlsclntd (auto)
- rpc.tlsservd (auto)
- rpc.yppasswdd (auto)
- rpc.ypupdated (auto)
- rpc.ypxfrd (auto)
- rrenumd (auto)
- tftp-proxy (auto)
- ypldap (auto)

## Bit Flip
- rpc.sprayd

## Inbox
- dma (suggested: heisenbug)
