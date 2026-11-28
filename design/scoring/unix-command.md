# Scoring: unix-command (Name a Unix command)

417 answers (Bit Flip and Works on my machine left out); 29 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 23 (6%) | 63 | 0 |
| npe | 122 (29%) | 121 | 0 |
| leak | 46 (11%) | 127 | 0 |
| race | 9 (2%) | 63 | 0 |
| heisenbug | 217 (52%) | 43 | 0 |

Same tier as today: 146/417 (35%).

## Off-by-one (23)

ls 6.0 [3149c 3117q 0f], man 6.0* [6233c 0q 5f], head 6.0* [2144c 0q 0f], cd 5.4 [2021c 883q 3f], echo 5.4 [1074c 0q 3f], cat 5.2 [2493c 0q 1f], rm 5.0 [791c 1732q 0f], sh 5.0* [3671c 0q 2f], printf 5.0* [2898c 9833q 1f], sleep 5.0* [203c 0q 0f], rmdir 5.0* [164c 154q 1f], grep 5.0 [7397c 23132q 58f], sort 4.8 [341c 0q 0f], curl 4.8 [6136c 0q 68f], kill 4.8 [733c 0q 0f], date 4.7 [0c 0q 0f], cp 4.7 [576c 1924q 0f], ssh 4.6 [37262c 58370q 0f], mkdir 4.6 [628c 1430q 0f], pwd 4.5 [1955c 257q 0f], gzip 4.5 [6229c 7075q 53f], tail 4.4 [217c 0q 0f], chmod 4.4 [5380c 2519q 0f]

## Null pointer exception (122)

mv 4.3 [0c 1506q 0f], find 4.3 [512c 0q 0f], vi 4.3 [6342c 2798q 2f], touch 4.3 [848c 0q 2f], less 4.3 [734c 0q 58f], top 4.2 [547c 0q 4f], unzip 4.2 [16626c 2106q 57f], whoami 4.1 [700c 16q 1f], ps 4.1 [263c 2018q 0f], tar 4.0 [7405c 0q 55f], clang 4.0* [7423c 0q 0f], false 4.0* [93c 0q 0f], true 4.0* [93c 0q 0f], diff 4.0 [3667c 5605q 0f], uptime 3.8 [1156c 413q 1f], wc 3.7 [694c 552q 0f], df 3.7 [4341c 147265q 0f], su 3.7 [414c 1330q 0f], passwd 3.6 [948c 541q 0f], du 3.6 [506c 1518q 1f], ftp 3.6 [10360c 19552q 0f], netstat 3.6 [1622c 1353q 1f], awk 3.5 [5870c 42007q 0f], sed 3.5 [3746c 37532q 60f], hostname 3.5 [3179c 2522q 0f], chown 3.5 [443c 942q 0f], telnet 3.5 [6386c 3502q 0f], cut 3.4 [306c 0q 3f], which 3.4 [246c 0q 48f], md5sum 3.4 [1898c 659q 0f], locate 3.4 [0c 0q 0f], more 3.3 [320c 0q 0f], base64 3.3 [0c 11368q 14f], uname 3.3 [703c 54q 0f], who 3.2 [0c 0q 0f], uniq 3.2 [173c 660q 0f], id 3.2 [0c 0q 0f], file 3.2 [760c 0q 61f], env 3.2 [701c 15636q 0f], mount 3.2 [357c 0q 0f], tee 3.2 [1880c 0q 0f], bzip2 3.1 [1657c 411q 62f], host 3.1 [0c 0q 1f], stat 3.1 [0c 1071q 1f], time 3.1 [203c 0q 41f], whois 3.0 [6487c 626q 37f], xargs 3.0 [991c 1545q 0f], sha1sum 3.0 [401c 18q 0f], killall 3.0 [251c 0q 0f], rename 3.0* [0c 0q 11f], sha256sum 3.0 [0c 0q 0f], dmesg 2.9 [562c 424q 0f], w 2.9 [0c 0q 0f], pkill 2.9 [257c 66q 0f], timeout 2.9 [0c 10834q 2f], umount 2.8 [0c 90q 0f], login 2.8 [0c 0q 1f], basename 2.8 [0c 95q 0f], printenv 2.8 [0c 0q 0f], mail 2.8 [165c 0q 1f] ...

## Memory leak (46)

zstd 2.0 [5429c 100q 60f], tftp 1.9 [2487c 509q 0f], indent 1.8 [67c 0q 37f], nm 1.8 [369c 238q 0f], fsync 1.8 [0c 104q 0f], expr 1.8 [67c 136q 1f], mkfifo 1.8 [0c 260q 0f], cmp 1.8 [122c 156q 4f], hardlink 1.8 [0c 722q 0f], pg 1.7 [0c 871q 0f], ed 1.7 [0c 159q 45f], yacc 1.7 [1899c 1929q 0f], m4 1.7 [1285c 233q 60f], readelf 1.7 [167c 140q 0f], cpio 1.6 [1146c 133q 47f], pax 1.6 [951c 0q 21f], coreutils 1.6 [0c 309q 57f], comm 1.6 [0c 190q 0f], limits 1.5 [0c 4732q 0f], dir 1.5 [0c 19710q 0f], units 1.5 [0c 632q 0f], ts 1.5 [0c 0q 15f], beep 1.4 [0c 250q 17f], fmt 1.4 [0c 311q 50f], gprof 1.3 [283c 324q 0f], lex 1.2 [1339c 1828q 0f], mandoc 1.2 [0c 0q 41f], bmake 1.2 [0c 12q 26f], pkgconf 1.1 [0c 0q 52f], dc 1.1 [645c 1703q 0f], pagesize 1.1 [0c 105q 0f], waitpid 1.1 [0c 303q 0f], ptx 1.0 [0c 169q 1f], primes 1.0 [0c 3366q 0f], wg 1.0* [10568c 0q 0f], tabs 1.0* [0c 14881q 1f], ul 1.0* [0c 5986q 0f], bits 1.0 [0c 3640q 1f], getaddrinfo 0.9 [0c 262q 0f], c89 0.8 [0c 643q 0f], unifdef 0.8 [0c 0q 41f], dtc 0.8 [0c 0q 43f], bsdiff 0.5 [0c 3q 26f], asa 0.5 [0c 818q 3f], backlight 0.4 [0c 274q 1f], kyua 0.3 [0c 0q 22f]

## Race condition (9)

setfacl 1.9 [0c 83q 0f], unshare 1.7 [0c 51q 0f], base32 1.5 [0c 89q 0f], factor 1.5 [0c 0q 8f], csplit 1.4 [0c 78q 0f], rwho 1.4 [0c 0q 9f], ee 1.0* [0c 0q 9f], morse 1.0 [0c 0q 8f], cpuset 0.5 [0c 25q 8f]

## Heisenbug (217)

truncate 2.0 [0c 0q 2f], paste 2.0 [0c 0q 2f], shuf 2.0 [0c 15q 1f], perror 1.9 [0c 0q 0f], fetch 1.9 [0c 0q 0f], blkid 1.9 [0c 17q 0f], join 1.8 [0c 0q 0f], getfacl 1.8 [0c 0q 0f], ncal 1.8 [0c 0q 1f], cksum 1.8 [0c 0q 0f], logname 1.8 [0c 0q 0f], flock 1.8 [0c 0q 0f], arch 1.7 [0c 0q 1f], fold 1.7 [0c 0q 0f], vdir 1.7 [0c 0q 0f], hesinfo 1.7 [0c 0q 1f], talk 1.7 [252c 0q 6f], install 1.7 [0c 0q 0f], rs 1.7 [0c 25q 0f], size 1.6 [0c 0q 0f], fstat 1.6 [0c 37q 0f], chat 1.6 [0c 0q 0f], mknod 1.6 [0c 41q 0f], prlimit 1.6 [0c 0q 0f], expand 1.6 [0c 0q 0f], vis 1.6 [0c 0q 0f], hwclock 1.6 [0c 22q 0f], swapon 1.6 [0c 0q 0f], ruptime 1.6 [0c 0q 1f], sha224sum 1.6 [0c 0q 0f], look 1.6 [0c 0q 3f], systat 1.6 [0c 0q 0f], newgrp 1.6 [0c 0q 0f], biff 1.6 [0c 0q 2f], fstrim 1.5 [0c 34q 0f], fallocate 1.5 [0c 18q 0f], banner 1.5 [0c 0q 0f], sha384sum 1.5 [0c 0q 0f], write 1.5 [42c 0q 2f], numfmt 1.5 [0c 0q 0f], leave 1.5 [0c 0q 3f], setsid 1.5 [0c 21q 1f], uuidgen 1.5 [0c 0q 0f], uuidd 1.5 [0c 0q 0f], swapoff 1.5 [0c 0q 0f], nl 1.5 [0c 17q 0f], truss 1.5 [0c 0q 1f], rwall 1.4 [0c 0q 5f], ar 1.4 [687c 0q 0f], losetup 1.4 [0c 0q 0f], rev 1.4 [0c 0q 0f], irqtop 1.4 [0c 0q 0f], ident 1.4 [0c 30q 0f], ipcs 1.4 [0c 28q 0f], addr2line 1.4 [0c 44q 0f], showmount 1.4 [0c 0q 0f], rpcinfo 1.4 [0c 0q 0f], sdiff 1.4 [0c 29q 0f], dircolors 1.4 [0c 0q 0f], findmnt 1.4 [0c 0q 0f] ...

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
