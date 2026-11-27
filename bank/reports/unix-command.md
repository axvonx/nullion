# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: command, unix, shell.

## unix-command

415 candidates; 261 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| command ⚠ counts said off-by-one | 3960 | 4342 | 6218 | 1.00 | leak | judge (override) | leak | — |
| from ⚠ counts said off-by-one | 528 | 231 | 4072 | 0.99 | race | judge (override) | race | — |
| time | 306 | 410 | 2206 | 0.95 | off-by-one | counts | off-by-one | — |
| line ⚠ counts said off-by-one | 695 | 240 | 678 | 0.91 | leak | judge (override) | leak | — |
| users | 322 | 186 | 1522 | 0.91 | off-by-one | counts | npe | — |
| at | 360 | 58 | 2370 | 0.85 | npe | counts | npe | — |
| ar | 823 | 15 | 4072 | 0.80 | npe | counts | npe | — |
| file | 389 | 80 | 378 | 0.79 | npe | counts | off-by-one | — |
| test | 133 | 43 | 1105 | 0.76 | npe | counts | off-by-one | — |
| locale | 50 | 66 | 838 | 0.75 | npe | counts | npe | — |
| limits | 87 | 33 | 1462 | 0.74 | npe | counts | leak | — |
| apply ⚠ counts said npe | 46 | 51 | 756 | 0.72 | race | judge (override) | race | — |
| number ⚠ counts said npe | 262 | 21 | 619 | 0.71 | race | judge (override) | race | — |
| more | 204 | 9 | 1467 | 0.68 | npe | counts | off-by-one | — |
| size | 173 | 25 | 375 | 0.68 | npe | counts | npe | — |
| what | 194 | 22 | 364 | 0.67 | npe | counts | leak | — |
| which | 425 | 2 | 2946 | 0.65 | npe | counts | off-by-one | — |
| script | 78 | 30 | 223 | 0.64 | npe | counts | npe | — |
| groups | 51 | 31 | 214 | 0.63 | npe | counts | npe | — |
| host | 169 | 19 | 181 | 0.63 | npe | counts | npe | — |
| find | 64 | 10 | 826 | 0.63 | npe | counts | off-by-one | — |
| link | 73 | 22 | 245 | 0.63 | npe | counts | leak | — |
| units | 43 | 26 | 240 | 0.62 | npe | counts | leak | — |
| write | 300 | 8 | 209 | 0.59 | npe | counts | leak | — |
| protect ⚠ counts said npe | 38 | 22 | 163 | 0.59 | heisenbug | judge (override) | heisenbug | — |
| random | 14 | 21 | 290 | 0.58 | npe | counts | leak | — |
| compress | 16 | 28 | 147 | 0.57 | npe | counts | npe | — |
| locate | 43 | 7 | 273 | 0.54 | leak | counts | npe | — |
| id | 192 | 10 | 62 | 0.54 | leak | counts | npe | — |
| factor | 4 | 20 | 222 | 0.53 | leak | counts | npe | — |
| patch | 23 | 16 | 103 | 0.53 | leak | counts | npe | — |
| head ⚠ counts said leak | 14 | 13 | 182 | 0.53 | off-by-one | judge (override) | off-by-one | — |
| install | 93 | 7 | 130 | 0.53 | leak | counts | npe | — |
| bits ⚠ counts said leak | 187 | 6 | 97 | 0.52 | heisenbug | judge (override) | heisenbug | — |
| less ⚠ counts said leak | 35 | 5 | 308 | 0.52 | off-by-one | judge (override) | off-by-one | — |
| lock | 58 | 12 | 67 | 0.51 | leak | counts | leak | — |
| top ⚠ counts said leak | 28 | 6 | 187 | 0.50 | off-by-one | judge (override) | off-by-one | — |
| ident | 23 | 6 | 186 | 0.49 | leak | counts | leak | — |
| touch ⚠ counts said leak | 8 | 19 | 65 | 0.49 | off-by-one | judge (override) | off-by-one | — |
| false ⚠ counts said leak | 8 | 10 | 157 | 0.49 | off-by-one | judge (override) | off-by-one | — |
| split | 10 | 11 | 119 | 0.48 | leak | counts | npe | — |
| look | 46 | 5 | 117 | 0.48 | leak | counts | leak | — |
| finger | 5 | 11 | 65 | 0.44 | leak | counts | npe | — |
| truncate | 13 | 12 | 31 | 0.43 | leak | counts | npe | — |
| mount ⚠ counts said leak | 70 | 3 | 64 | 0.43 | off-by-one | judge (override) | off-by-one | — |
| date ⚠ counts said leak | 117 | 2 | 55 | 0.42 | off-by-one | judge (override) | off-by-one | — |
| man ⚠ counts said leak | 9 | 12 | 28 | 0.42 | off-by-one | judge (override) | off-by-one | — |
| sort ⚠ counts said leak | 19 | 11 | 19 | 0.42 | off-by-one | judge (override) | off-by-one | — |
| wall | 2 | 10 | 72 | 0.41 | leak | counts | npe | — |
| leave | 21 | 1 | 235 | 0.41 | leak | counts | race | — |
| paste | 3 | 5 | 124 | 0.41 | leak | counts | npe | — |
| expand | 8 | 3 | 134 | 0.40 | leak | counts | npe | — |
| last | 61 | 1 | 106 | 0.40 | leak | counts | npe | — |
| who | 13 | 2 | 138 | 0.40 | leak | counts | npe | — |
| strings | 61 | 2 | 47 | 0.39 | leak | counts | npe | — |
| talk | 10 | 6 | 35 | 0.39 | leak | counts | leak | — |
| ed | 7 | 30 | 3 | 0.38 | leak | counts | npe | — |
| cut ⚠ counts said leak | 1 | 5 | 95 | 0.37 | off-by-one | judge (override) | off-by-one | — |
| echo ⚠ counts said leak | 44 | 2 | 30 | 0.36 | off-by-one | judge (override) | off-by-one | — |
| du ⚠ counts said leak | 2 | 31 | 3 | 0.35 | off-by-one | judge (override) | off-by-one | — |
| cp ⚠ counts said leak | 25 | 2 | 30 | 0.34 | off-by-one | judge (override) | off-by-one | — |
| true ⚠ counts said leak | 14 | 1 | 77 | 0.34 | off-by-one | judge (override) | off-by-one | — |
| fold | 1 | 4 | 67 | 0.34 | leak | counts | npe | — |
| w | 23 | 2 | 29 | 0.34 | leak | counts | npe | — |
| sum ⚠ counts said race | 3 | 2 | 46 | 0.31 | npe | judge (override) | npe | — |
| login ⚠ counts said race | 9 | 4 | 11 | 0.31 | npe | judge (override) | npe | — |
| logins | 9 | 4 | 11 | 0.31 | race | counts | race | — |
| cat ⚠ counts said race | 21 | 3 | 9 | 0.31 | off-by-one | judge (override) | off-by-one | — |
| tip | 1 | 4 | 30 | 0.30 | race | counts | leak | — |
| dc ⚠ counts said race | 2 | 4 | 21 | 0.30 | npe | judge (override) | npe | — |
| tail ⚠ counts said race | 9 | 1 | 38 | 0.30 | off-by-one | judge (override) | off-by-one | — |
| join ⚠ counts said race | 2 | 3 | 25 | 0.29 | npe | judge (override) | npe | — |
| ipcs | 8 | 4 | 8 | 0.29 | npe | judge | npe | — |
| timeout ⚠ counts said race | 67 | 1 | 7 | 0.28 | npe | judge (override) | npe | — |
| mail ⚠ counts said race | 10 | 4 | 5 | 0.28 | npe | judge (override) | npe | — |
| column ⚠ counts said race | 8 | 1 | 24 | 0.27 | npe | judge (override) | npe | — |
| ts | 5 | 2 | 12 | 0.26 | race | counts | leak | — |
| ftp | 4 | 6 | 3 | 0.26 | off-by-one | judge | off-by-one | — |
| chat | 1 | 1 | 44 | 0.25 | race | counts | leak | — |
| tee ⚠ counts said race | 12 | 2 | 6 | 0.25 | off-by-one | judge (override) | off-by-one | — |
| fetch | 18 | 0 | 24 | 0.24 | race | counts | leak | — |
| nc | 7 | 2 | 7 | 0.24 | npe | judge | npe | — |
| nl ⚠ counts said race | 3 | 1 | 20 | 0.24 | npe | judge (override) | npe | — |
| mv | 0 | 9 | 3 | 0.23 | off-by-one | judge | off-by-one | — |
| vi | 1 | 3 | 9 | 0.23 | off-by-one | judge | off-by-one | — |
| vis | 1 | 3 | 9 | 0.23 | race | judge | race | — |
| sleep ⚠ counts said race | 20 | 1 | 5 | 0.23 | off-by-one | judge (override) | off-by-one | — |
| diff ⚠ counts said race | 1 | 2 | 13 | 0.23 | off-by-one | judge (override) | off-by-one | — |
| kill ⚠ counts said race | 17 | 0 | 17 | 0.23 | off-by-one | judge (override) | off-by-one | — |
| sync ⚠ counts said race | 36 | 0 | 10 | 0.23 | npe | judge (override) | npe | — |
| grep ⚠ counts said race | 13 | 1 | 6 | 0.22 | off-by-one | judge (override) | off-by-one | — |
| rm ⚠ counts said heisenbug | 1 | 1 | 19 | 0.22 | off-by-one | judge (override) | off-by-one | — |
| su | 1 | 2 | 8 | 0.21 | off-by-one | judge | off-by-one | — |
| comm ⚠ counts said heisenbug | 17 | 1 | 3 | 0.21 | npe | judge (override) | npe | — |
| nice | 5 | 1 | 6 | 0.20 | npe | judge | npe | — |
| yes | 13 | 1 | 3 | 0.20 | womm | pin | — | — |
| drill | 0 | 2 | 9 | 0.19 | leak | judge | leak | — |
| ps ⚠ counts said heisenbug | 49 | 0 | 3 | 0.19 | off-by-one | judge (override) | off-by-one | — |
| pr ⚠ counts said heisenbug | 8 | 0 | 10 | 0.18 | leak | judge (override) | leak | — |
| arch ⚠ counts said heisenbug | 16 | 0 | 6 | 0.18 | leak | judge (override) | leak | — |
| dd | 3 | 1 | 5 | 0.18 | npe | judge | npe | — |
| od ⚠ counts said heisenbug | 0 | 1 | 13 | 0.18 | npe | judge (override) | npe | — |
| mt ⚠ counts said heisenbug | 3 | 0 | 15 | 0.18 | leak | judge (override) | leak | — |
| sh ⚠ counts said heisenbug | 17 | 0 | 5 | 0.17 | off-by-one | judge (override) | off-by-one | — |
| bc ⚠ counts said heisenbug | 3 | 0 | 14 | 0.17 | off-by-one | judge (override) | off-by-one | — |
| flock | 1 | 1 | 6 | 0.17 | npe | judge | npe | — |
| primes | 0 | 1 | 9 | 0.16 | race | judge | race | — |
| rs | 0 | 1 | 8 | 0.16 | race | judge | race | — |
| seq | 4 | 0 | 7 | 0.15 | npe | judge | npe | — |
| indent | 1 | 1 | 4 | 0.15 | npe | judge | npe | — |
| ul | 0 | 2 | 3 | 0.15 | leak | judge | leak | — |
| awk | 3 | 3 | 0 | 0.14 | off-by-one | judge | off-by-one | — |
| stat ⚠ counts said heisenbug | 17 | 0 | 2 | 0.14 | off-by-one | judge (override) | off-by-one | — |
| ls | 7 | 0 | 4 | 0.14 | off-by-one | judge | off-by-one | — |
| m4 | 0 | 1 | 5 | 0.14 | npe | judge | npe | — |
| cal | 1 | 2 | 1 | 0.13 | npe | judge | npe | — |
| tabs | 7 | 0 | 3 | 0.13 | leak | judge | leak | — |
| fortune | 0 | 1 | 4 | 0.13 | npe | judge | npe | — |
| coreutils | 0 | 1 | 4 | 0.13 | leak | judge | leak | — |
| truss ⚠ counts said heisenbug | 0 | 0 | 13 | 0.13 | leak | judge (override) | leak | — |
| df | 9 | 0 | 2 | 0.12 | off-by-one | judge | off-by-one | — |
| quota | 5 | 0 | 3 | 0.12 | npe | judge | npe | — |
| rename | 4 | 0 | 3 | 0.12 | npe | judge | npe | — |
| ee ⚠ counts said heisenbug | 0 | 0 | 10 | 0.12 | leak | judge (override) | leak | — |
| lex | 0 | 2 | 1 | 0.11 | npe | judge | npe | — |
| calendar | 0 | 0 | 8 | 0.11 | leak | judge | leak | — |
| unlink | 5 | 1 | 0 | 0.11 | leak | judge | leak | — |
| dmesg ⚠ counts said heisenbug | 29 | 0 | 0 | 0.10 | off-by-one | judge (override) | off-by-one | — |
| morse | 0 | 1 | 2 | 0.10 | race | judge | race | — |
| msgs | 27 | 0 | 0 | 0.10 | heisenbug | counts | race | — |
| yacc | 0 | 3 | 0 | 0.10 | npe | judge | npe | — |
| nm | 0 | 0 | 7 | 0.10 | npe | judge | npe | — |
| mkdir | 7 | 0 | 1 | 0.10 | off-by-one | judge | off-by-one | — |
| chmod | 6 | 0 | 1 | 0.09 | off-by-one | judge | off-by-one | — |
| clang | 6 | 0 | 1 | 0.09 | off-by-one | judge | off-by-one | — |
| dir ⚠ counts said heisenbug | 19 | 0 | 0 | 0.09 | leak | judge (override) | leak | — |
| fmt | 5 | 0 | 1 | 0.09 | npe | judge | npe | — |
| tar | 5 | 0 | 1 | 0.09 | off-by-one | judge | off-by-one | — |
| env | 1 | 0 | 3 | 0.09 | off-by-one | judge | off-by-one | — |
| tac | 1 | 0 | 3 | 0.09 | npe | judge | npe | — |
| chroot | 2 | 0 | 2 | 0.09 | npe | judge | npe | — |
| uptime | 2 | 0 | 2 | 0.09 | off-by-one | judge | off-by-one | — |
| enigma | 0 | 1 | 1 | 0.08 | race | judge | race | — |
| telnet | 0 | 1 | 1 | 0.08 | npe | judge | npe | — |
| wg | 0 | 1 | 1 | 0.08 | npe | judge | npe | — |
| eject | 4 | 0 | 1 | 0.08 | npe | judge | npe | — |
| rev | 4 | 0 | 1 | 0.08 | npe | judge | npe | — |
| cpuset ⚠ counts said heisenbug | 13 | 0 | 0 | 0.08 | leak | judge (override) | leak | — |
| xz | 3 | 0 | 1 | 0.08 | off-by-one | judge | off-by-one | — |
| beep | 3 | 0 | 1 | 0.08 | leak | judge | leak | — |
| tr | 1 | 0 | 2 | 0.07 | off-by-one | judge | off-by-one | — |
| sed | 1 | 0 | 2 | 0.07 | off-by-one | judge | off-by-one | — |
| nproc ⚠ counts said heisenbug | 10 | 0 | 0 | 0.07 | npe | judge (override) | npe | — |
| tty | 9 | 0 | 0 | 0.07 | npe | judge | npe | — |
| chown | 2 | 0 | 1 | 0.07 | off-by-one | judge | off-by-one | — |
| hostname | 2 | 0 | 1 | 0.07 | off-by-one | judge | off-by-one | — |
| fsync | 2 | 0 | 1 | 0.07 | leak | judge | leak | — |
| gzip | 2 | 0 | 1 | 0.07 | off-by-one | judge | off-by-one | — |
| ln | 0 | 0 | 3 | 0.07 | off-by-one | judge | off-by-one | — |
| asa | 0 | 0 | 3 | 0.07 | heisenbug | judge | heisenbug | — |
| cmp | 0 | 0 | 3 | 0.07 | npe | judge | npe | — |
| printf | 5 | 0 | 0 | 0.05 | off-by-one | judge | off-by-one | — |
| cpio | 5 | 0 | 0 | 0.05 | npe | judge | npe | — |
| setfacl | 1 | 0 | 1 | 0.05 | leak | judge | leak | — |
| readelf | 1 | 0 | 1 | 0.05 | npe | judge | npe | — |
| zstd | 1 | 0 | 1 | 0.05 | off-by-one | judge | off-by-one | — |
| base64 | 0 | 0 | 2 | 0.05 | npe | judge | npe | — |
| lam | 0 | 0 | 2 | 0.05 | race | judge | race | — |
| mdo | 0 | 0 | 2 | 0.05 | heisenbug | judge | heisenbug | — |
| revoke | 0 | 0 | 2 | 0.05 | heisenbug | judge | heisenbug | — |
| whois | 0 | 0 | 2 | 0.05 | npe | judge | npe | — |
| logger | 0 | 1 | 0 | 0.05 | npe | judge | npe | — |
| mknod | 4 | 0 | 0 | 0.05 | npe | judge | npe | — |
| passwd | 4 | 0 | 0 | 0.05 | off-by-one | judge | off-by-one | — |
| readlink | 3 | 0 | 0 | 0.04 | npe | judge | npe | — |
| uname | 3 | 0 | 0 | 0.04 | off-by-one | judge | off-by-one | — |
| mountpoint | 3 | 0 | 0 | 0.04 | leak | judge | leak | — |
| backlight | 3 | 0 | 0 | 0.04 | race | judge | race | — |
| genl | 3 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| kdump | 3 | 0 | 0 | 0.04 | leak | judge | leak | — |
| perror | 3 | 0 | 0 | 0.04 | leak | judge | leak | — |
| chgrp | 2 | 0 | 0 | 0.03 | npe | judge | npe | — |
| rmdir | 2 | 0 | 0 | 0.03 | off-by-one | judge | off-by-one | — |
| pivot_root | 2 | 0 | 0 | 0.03 | leak | judge | leak | — |
| umount | 2 | 0 | 0 | 0.03 | off-by-one | judge | off-by-one | — |
| netstat | 2 | 0 | 0 | 0.03 | npe | judge | npe | — |
| showmount | 2 | 0 | 0 | 0.03 | npe | judge | npe | — |
| base32 | 0 | 0 | 1 | 0.03 | npe | judge | npe | — |
| pwd | 0 | 0 | 1 | 0.03 | off-by-one | judge | off-by-one | — |
| caesar | 0 | 0 | 1 | 0.03 | race | judge | race | — |
| lsns | 0 | 0 | 1 | 0.03 | npe | judge | npe | — |
| realpath | 1 | 0 | 0 | 0.02 | npe | judge | npe | — |
| stty | 1 | 0 | 0 | 0.02 | npe | judge | npe | — |
| uniq | 1 | 0 | 0 | 0.02 | off-by-one | judge | off-by-one | — |
| whoami | 1 | 0 | 0 | 0.02 | off-by-one | judge | off-by-one | — |
| blkzone | 1 | 0 | 0 | 0.02 | heisenbug | judge | heisenbug | — |
| enosys | 1 | 0 | 0 | 0.02 | heisenbug | judge | heisenbug | — |
| hardlink | 1 | 0 | 0 | 0.02 | leak | judge | leak | — |
| namei | 1 | 0 | 0 | 0.02 | leak | judge | leak | — |
| waitpid | 1 | 0 | 0 | 0.02 | race | judge | race | — |
| domainname | 1 | 0 | 0 | 0.02 | leak | judge | leak | — |
| getfacl | 1 | 0 | 0 | 0.02 | leak | judge | leak | — |
| nfsstat | 1 | 0 | 0 | 0.02 | leak | judge | leak | — |
| sockstat | 1 | 0 | 0 | 0.02 | leak | judge | leak | — |
| tftp | 1 | 0 | 0 | 0.02 | npe | judge | npe | — |
| xargs | 1 | 0 | 0 | 0.02 | off-by-one | judge | off-by-one | — |
| b2sum ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| basename ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| basenc ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| chcon ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| cksum ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| dircolors ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| dirname ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| expr ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| hostid ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| md5sum ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| mkfifo ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| mktemp ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| nohup ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| numfmt ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| pathchk ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| printenv ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| sha1sum ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| sha224sum ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| sha256sum ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| sha384sum ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| sha512sum ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| shred ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| shuf ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| stdbuf ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| unexpand ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| vdir ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| wc ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| blkdiscard ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| blkpr ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| chcpu ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| chmem ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| choom ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| fallocate ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| fsfreeze ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| fstrim ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| hwclock ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| ipcmk ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ipcrm ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| irqtop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| losetup ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| lscpu ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| lsipc ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| lsirq ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| lsmem ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| nsenter ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| prlimit ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| readprofile ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| renice ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| rfkill ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| rtcwake ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| setarch ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| setpgid ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| setpriv ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| setsid ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| swapoff ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| swapon ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| switch_root ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tunelp ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| unshare ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| wdctl ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| zramctl ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| blkid ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| copyfilerange ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| exch ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| fadvise ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| fincore ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| findfs ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| findmnt ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| getino ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| getopt ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| lastlog2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| lsclocks ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| lslocks ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| pipesz ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| uuidgen ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| whereis ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| col ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| colcrt ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| colrm ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| hexdump ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| chflags ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| chio ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| csh ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| freebsd-version ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| kenv ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| pax ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| pkill ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| pwait ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| rmail ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| addr2line ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| banner ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| biff ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| bintrans ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| bmake ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| bomtool ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| brandelf ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| bsdcat ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| bsddialog ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| bsdiff ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| bzip2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| c++filt ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| c89 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| c99 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| cap_mkdb ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| chpass ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| compile_et ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ctags ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| ctlstat ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| diff3 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| dtc ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| elfcopy ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| elfctl ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| elfdump ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| etdump ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| file2c ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| fstat ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| gcore ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| gencat ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| getconf ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| getent ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| gprof ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| grdc ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| hesinfo ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| iconv ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| iscsictl ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| jot ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| killall ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| ktrace ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ktrdump ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| kyua ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| lastcomm ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ldd ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| ldd32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| lessecho ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| localedef ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| lockf ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| lorder ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| lsvfs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mandoc ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| mesg ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| mididump ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ministat ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| mkcsmapper ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mkdep ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| mkesdb ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mkimg ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| mkstr ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mkuzip ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ncal ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| newgrp ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| pagesize ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| pamtest ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| pkgconf ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| pom | 0 | 0 | 0 | 0.00 | bitflip | pin | — | — |
| posixmqcontrol ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| posixshmcontrol ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| proccontrol ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| procstat ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| rctl ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| resizewin ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| rpcgen ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| runat ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rup ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ruptime ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| rusers ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| rwall ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| rwho ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| sdiff ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| sdiotool ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| smbutil ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| soelim ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| spdxtool ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ssh-copy-id ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| systat ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tcopy ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| unifdef ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| unvis ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| unzip ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| usbhidaction ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| usbhidctl ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| vacation ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| vmstat ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| vtfontcvt ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| xo ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| xohtml ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| xolint ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| xopo ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| xstr ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| xzdec ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ypcat ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ypmatch ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ypwhich ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| csplit ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| logname ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| pinky ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ptx ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| runcon ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tsort ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ctrlaltdel ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ldattach ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| mcookie ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| uuidd ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| uuidparse ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| wipefs ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| pg ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| bzip2recover ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| getaddrinfo ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| lzmainfo ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| rpcinfo ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): arch (counts said heisenbug, now leak), cat (counts said race, now off-by-one), comm (counts said heisenbug, now npe), cp (counts said leak, now off-by-one), cut (counts said leak, now off-by-one), date (counts said leak, now off-by-one), dir (counts said heisenbug, now leak), du (counts said leak, now off-by-one), echo (counts said leak, now off-by-one), false (counts said leak, now off-by-one), head (counts said leak, now off-by-one), join (counts said race, now npe), kill (counts said race, now off-by-one), nl (counts said race, now npe), nproc (counts said heisenbug, now npe), od (counts said heisenbug, now npe), pr (counts said heisenbug, now leak), rm (counts said heisenbug, now off-by-one), sleep (counts said race, now off-by-one), sort (counts said leak, now off-by-one), stat (counts said heisenbug, now off-by-one), sync (counts said race, now npe), tail (counts said race, now off-by-one), tee (counts said race, now off-by-one), timeout (counts said race, now npe), touch (counts said leak, now off-by-one), true (counts said leak, now off-by-one), dmesg (counts said heisenbug, now off-by-one), mount (counts said leak, now off-by-one), bits (counts said leak, now heisenbug), column (counts said race, now npe), cpuset (counts said heisenbug, now leak), ps (counts said heisenbug, now off-by-one), sh (counts said heisenbug, now off-by-one), apply (counts said npe, now race), bc (counts said heisenbug, now off-by-one), command (counts said off-by-one, now leak), dc (counts said race, now npe), diff (counts said race, now off-by-one), ee (counts said heisenbug, now leak), from (counts said off-by-one, now race), grep (counts said race, now off-by-one), less (counts said leak, now off-by-one), login (counts said race, now npe), mail (counts said race, now npe), man (counts said leak, now off-by-one), mt (counts said heisenbug, now leak), number (counts said npe, now race), protect (counts said npe, now heisenbug), top (counts said leak, now off-by-one), truss (counts said heisenbug, now leak), sum (counts said race, now npe), line (counts said off-by-one, now leak)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

