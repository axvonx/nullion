# Familiarity scoring: unix-daemon (Name a Unix daemon)

1204 tiered answers (Bit Flip and Works on my machine left out). Jev: 7s. Haiku: 186s.
Level bands -> tier: [(5.5, 'off-by-one'), (4.0, 'npe'), (2.6, 'leak'), (1.3, 'race'), (0.0, 'heisenbug')]

## Rank correlation (Spearman)

| | Jev | Haiku | source score | bank tier |
|---|---|---|---|---|
| Jev | 1.00 | 0.53 | 0.42 (n=1200) | 0.44 |
| Haiku | 0.53 | 1.00 | 0.28 (n=1200) | 0.27 |

## Tier agreement (exact / within one tier)

- Jev vs bank: 45% / 78%
- Haiku vs bank: 45% / 76%
- Jev vs Haiku: 81% / 99%

## Answers per tier

| tier | bank | Jev | Haiku |
|---|---|---|---|
| off-by-one | 17 | 0 | 3 |
| npe | 182 | 6 | 11 |
| leak | 119 | 29 | 32 |
| race | 332 | 207 | 103 |
| heisenbug | 554 | 962 | 1055 |

## Jev's top 25

httpd 4.8, cron 4.7, sshd 4.6, nginx 4.5, mysqld 4.3, init 4.3, apache2 3.9, postgres 3.8, dockerd 3.6, sendmail 3.6, syslogd 3.5, ftpd 3.4, redis-server 3.4, prometheus 3.3, systemd 3.2, named 3.2, telnetd 3.1, ntpd 3.1, memcached 3.1, rsyslogd 3.0, pound 3.0, haproxy 2.9, smtpd 2.9, squid 2.8, cupsd 2.8

## Biggest Jev / Haiku disagreements

| answer | bank | Jev | Haiku |
|---|---|---|---|
| WindowServer | heisenbug | 1.2 | 4 |
| merecat | race | 2.6 | 0 |
| dnscache | leak | 2.4 | 0 |
| update | heisenbug | 2.3 | 0 |
| ngetty | race | 2.3 | 0 |
| tccd | heisenbug | 0.7 | 3 |
| fskitd | heisenbug | 2.2 | 0 |
| owftpd | race | 2.1 | 0 |
| bluetoothd | race | 1.9 | 4 |
| curvedns | heisenbug | 2.0 | 0 |
| prometheus-node-exporter | npe | 2.0 | 0 |
| rsyslogd | npe | 3.0 | 1 |
| pound | leak | 3.0 | 1 |
| courieresmtpd | heisenbug | 1.9 | 0 |
| haproxy | off-by-one | 2.9 | 1 |
| kswapd | leak | 1.2 | 3 |
| fnott | leak | 1.8 | 0 |
| nfsuserd | heisenbug | 1.8 | 0 |
| pmbgpd | heisenbug | 1.8 | 0 |
| lxdm | npe | 1.8 | 0 |
| systemd | off-by-one | 3.2 | 5 |
| vsftpd | npe | 2.8 | 1 |
| rpc.mountd | race | 1.2 | 3 |
| mpris-proxy | race | 0.2 | 2 |
| init | off-by-one | 4.3 | 6 |
