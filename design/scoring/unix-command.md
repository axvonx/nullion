# Scoring: unix-command (Name a Unix command)

417 answers (Bit Flip and Works on my machine left out); 29 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 23 (6%) | 23 | 0 |
| npe | 123 (29%) | 123 | 0 |
| leak | 34 (8%) | 34 | 0 |
| race | 20 (5%) | 20 | 0 |
| heisenbug | 217 (52%) | 217 | 0 |

Same tier as today: 417/417 (100%).

## Off-by-one (23)

ls 6.0 [3149c 0q 0f 0s], man 6.0* [6233c 0q 0f 0s], head 6.0* [2144c 0q 0f 0s], cd 5.4 [2021c 0q 0f 0s], echo 5.4 [1074c 0q 3f 0s], cat 5.2 [2493c 0q 0f 0s], rm 5.0 [791c 0q 0f 0s], sh 5.0* [3671c 0q 0f 0s], printf 5.0* [2898c 9833q 1f 0s], sleep 5.0* [203c 0q 0f 0s], rmdir 5.0* [164c 154q 1f 0s], grep 5.0 [7397c 23132q 58f 0s], sort 4.8 [341c 0q 0f 0s], curl 4.8 [6136c 0q 68f 43724s], kill 4.8 [733c 0q 0f 0s], date 4.7 [0c 0q 0f 0s], cp 4.7 [576c 0q 0f 0s], ssh 4.6 [37262c 0q 0f 0s], mkdir 4.6 [628c 1430q 0f 0s], pwd 4.5 [1955c 0q 0f 0s], gzip 4.5 [6229c 7075q 53f 0s], tail 4.4 [217c 0q 0f 0s], chmod 4.4 [5380c 2519q 0f 0s]

## Null pointer exception (123)

mv 4.3 [416c 0q 0f 0s], find 4.3 [512c 0q 0f 0s], vi 4.3 [6342c 0q 0f 0s], touch 4.3 [848c 0q 2f 614s], less 4.3 [734c 0q 58f 0s], top 4.2 [547c 0q 0f 0s], unzip 4.2 [16626c 2106q 57f 0s], whoami 4.1 [700c 16q 1f 0s], ps 4.1 [263c 0q 0f 0s], tar 4.0 [7405c 0q 0f 0s], clang 4.0* [7423c 0q 0f 0s], false 4.0* [0c 0q 0f 0s], true 4.0* [0c 0q 0f 0s], diff 4.0 [3667c 5605q 0f 0s], uptime 3.8 [1156c 413q 1f 0s], wc 3.7 [694c 0q 0f 0s], df 3.7 [4341c 0q 0f 0s], su 3.7 [414c 0q 0f 0s], passwd 3.6 [948c 541q 0f 0s], du 3.6 [506c 0q 0f 0s], ftp 3.6 [10360c 0q 0f 0s], netstat 3.6 [1622c 1353q 1f 0s], awk 3.5 [5870c 0q 0f 0s], sed 3.5 [3746c 0q 0f 0s], hostname 3.5 [3179c 2522q 0f 0s], chown 3.5 [443c 942q 0f 0s], telnet 3.5 [6386c 3502q 0f 0s], cut 3.4 [306c 0q 0f 0s], which 3.4 [246c 0q 48f 0s], md5sum 3.4 [1898c 659q 0f 0s], locate 3.4 [240c 0q 0f 0s], more 3.3 [320c 0q 0f 0s], base64 3.3 [0c 11368q 14f 0s], uname 3.3 [703c 54q 0f 0s], who 3.2 [92c 0q 0f 0s], uniq 3.2 [173c 660q 0f 0s], id 3.2 [22c 0q 0f 0s], file 3.2 [760c 0q 61f 0s], env 3.2 [701c 0q 0f 0s], mount 3.2 [357c 0q 0f 0s], tee 3.2 [1880c 0q 0f 0s], bzip2 3.1 [1657c 411q 62f 0s], host 3.1 [39c 0q 1f 0s], stat 3.1 [0c 1071q 1f 0s], time 3.1 [203c 0q 41f 0s], whois 3.0 [6487c 626q 37f 0s], xargs 3.0 [991c 1545q 0f 0s], sha1sum 3.0 [401c 18q 0f 0s], killall 3.0 [251c 0q 0f 0s], rename 3.0* [59c 0q 11f 0s], sha256sum 3.0 [0c 0q 0f 0s], dmesg 2.9 [562c 424q 0f 0s], w 2.9 [85c 0q 0f 0s], timeout 2.9 [480c 10834q 2f 0s], pkill 2.9 [257c 66q 0f 0s], login 2.8 [49554c 0q 1f 0s], umount 2.8 [0c 90q 0f 0s], basename 2.8 [0c 95q 0f 0s], printenv 2.8 [0c 0q 0f 0s], mail 2.8 [165c 0q 1f 0s] ...

## Memory leak (34)

zstd 2.0 [5429c 100q 60f 0s], tftp 1.9 [2487c 509q 0f 0s], setfacl 1.9 [0c 83q 0f 0s], fsync 1.8 [0c 104q 0f 0s], expr 1.8 [67c 136q 1f 0s], mkfifo 1.8 [0c 260q 0f 0s], hardlink 1.8 [0c 722q 0f 0s], unshare 1.7 [0c 51q 0f 0s], readelf 1.7 [167c 140q 0f 0s], fstat 1.6 [0c 37q 0f 0s], cpio 1.6 [1146c 133q 47f 0s], mknod 1.6 [0c 41q 0f 0s], coreutils 1.6 [0c 309q 57f 0s], comm 1.6 [301c 190q 0f 0s], fstrim 1.5 [0c 34q 0f 0s], limits 1.5 [0c 4732q 0f 0s], base32 1.5 [0c 89q 0f 0s], units 1.5 [0c 632q 0f 0s], csplit 1.4 [76c 78q 0f 0s], beep 1.4 [0c 250q 17f 81s], ident 1.4 [0c 30q 0f 0s], addr2line 1.4 [0c 44q 0f 0s], gprof 1.3 [283c 324q 0f 0s], pagesize 1.1 [0c 105q 0f 0s], waitpid 1.1 [0c 303q 0f 0s], diff3 1.1 [0c 32q 0f 0s], primes 1.0 [0c 3366q 0f 0s], wg 1.0* [10568c 0q 0f 0s], line 1.0* [8010c 0q 1f 0s], tabs 1.0* [0c 14881q 1f 0s], bits 1.0 [0c 3640q 1f 0s], kdump 1.0 [0c 31q 2f 0s], getaddrinfo 0.9 [0c 262q 0f 0s], backlight 0.4 [0c 274q 1f 0s]

## Race condition (20)

shuf 2.0 [114c 15q 1f 17s], blkid 1.9 [0c 17q 0f 0s], indent 1.8 [67c 0q 37f 0s], hwclock 1.6 [0c 22q 0f 0s], fallocate 1.5 [0c 18q 0f 0s], setsid 1.5 [0c 21q 1f 0s], ipcs 1.4 [0c 28q 0f 0s], sdiff 1.4 [0c 29q 0f 0s], mandoc 1.2 [0c 0q 41f 0s], procstat 1.2 [0c 11q 0f 0s], bmake 1.2 [0c 12q 26f 0s], pkgconf 1.1 [0c 0q 52f 0s], gcore 1.0 [0c 21q 0f 0s], c++filt 0.9 [0c 20q 0f 0s], nsenter 0.8 [0c 20q 0f 0s], unifdef 0.8 [0c 0q 41f 0s], runat 0.6 [0c 26q 1f 614s], cpuset 0.5 [0c 25q 8f 0s], bsdiff 0.5 [0c 3q 26f 0s], kyua 0.3 [0c 0q 22f 0s]

## Heisenbug (217)

truncate 2.0 [0c 0q 2f 0s], paste 2.0 [162c 0q 2f 0s], perror 1.9 [0c 0q 0f 0s], fetch 1.9 [0c 0q 0f 0s], join 1.8 [155c 0q 0f 0s], getfacl 1.8 [0c 0q 0f 0s], nm 1.8 [369c 0q 0f 0s], ncal 1.8 [0c 0q 1f 0s], cksum 1.8 [0c 0q 0f 0s], logname 1.8 [0c 0q 0f 0s], cmp 1.8 [122c 0q 0f 0s], flock 1.8 [0c 0q 0f 0s], pg 1.7 [71c 0q 0f 0s], fold 1.7 [41c 0q 0f 0s], arch 1.7 [0c 0q 1f 0s], vdir 1.7 [0c 0q 0f 0s], hesinfo 1.7 [0c 0q 1f 0s], talk 1.7 [252c 0q 6f 0s], ed 1.7 [0c 0q 0f 0s], m4 1.7 [1285c 0q 0f 0s], install 1.7 [127c 0q 0f 0s], rs 1.7 [0c 0q 0f 0s], size 1.6 [0c 0q 0f 0s], chat 1.6 [0c 0q 0f 0s], prlimit 1.6 [0c 0q 0f 0s], pax 1.6 [951c 0q 0f 0s], expand 1.6 [0c 0q 0f 0s], vis 1.6 [0c 0q 0f 0s], swapon 1.6 [0c 0q 0f 0s], ruptime 1.6 [0c 0q 1f 0s], sha224sum 1.6 [0c 0q 0f 0s], look 1.6 [0c 0q 3f 0s], systat 1.6 [46c 0q 0f 0s], biff 1.6 [46c 0q 2f 768s], newgrp 1.6 [0c 0q 0f 0s], banner 1.5 [69c 0q 0f 0s], dir 1.5 [757c 0q 0f 0s], factor 1.5 [603c 0q 8f 0s], sha384sum 1.5 [0c 0q 0f 0s], write 1.5 [42c 0q 2f 0s], numfmt 1.5 [0c 0q 0f 0s], leave 1.5 [0c 0q 3f 0s], uuidgen 1.5 [0c 0q 0f 0s], uuidd 1.5 [0c 0q 0f 0s], ts 1.5 [0c 0q 0f 0s], swapoff 1.5 [0c 0q 0f 0s], nl 1.5 [132c 0q 0f 0s], truss 1.5 [0c 0q 1f 0s], rwall 1.4 [0c 0q 5f 0s], ar 1.4 [687c 0q 0f 0s], losetup 1.4 [0c 0q 0f 0s], rev 1.4 [0c 0q 0f 0s], irqtop 1.4 [0c 0q 0f 0s], showmount 1.4 [0c 0q 0f 0s], rpcinfo 1.4 [0c 0q 0f 0s], dircolors 1.4 [0c 0q 0f 0s], fmt 1.4 [56c 0q 0f 0s], findmnt 1.4 [0c 0q 0f 0s], rwho 1.4 [0c 0q 9f 0s], rup 1.4 [0c 0q 0f 0s] ...

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
