# Scoring: linux-system-call (Name a Linux system call)

438 answers (Bit Flip and Works on my machine left out); 7 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 4 (1%) | 4 | 0 |
| npe | 90 (21%) | 90 | 0 |
| leak | 12 (3%) | 12 | 0 |
| race | 7 (2%) | 7 | 0 |
| heisenbug | 325 (74%) | 325 | 0 |

Same tier as today: 438/438 (100%).

## Off-by-one (4)

read 4.8 [239c 0q 0f 0s], write 4.7 [349c 0q 2f 0s], open 4.7 [290c 0q 6f 0s], fork 4.5 [0c 0q 1f 0s]

## Null pointer exception (90)

close 4.3 [65c 0q 0f 0s], socket 4.0 [0c 0q 7f 0s], chmod 4.0* [5380c 2519q 0f 0s], mkdir 4.0* [628c 1430q 0f 0s], kill 4.0 [733c 0q 0f 0s], pipe 4.0 [1860c 0q 1f 0s], connect 4.0 [0c 0q 0f 0s], getpid 3.8 [0c 0q 0f 0s], execve 3.7 [642c 6370q 0f 0s], stat 3.6 [382c 1071q 1f 0s], chdir 3.6 [0c 203q 0f 0s], mmap 3.4 [1402c 2061q 0f 0s], time 3.4 [203c 0q 41f 0s], gettimeofday 3.4 [0c 100q 1f 0s], signal 3.3 [0c 0q 0f 0s], select 3.3 [205c 0q 0f 0s], chown 3.2 [443c 942q 0f 0s], getuid 3.2 [0c 0q 0f 0s], unlink 3.1 [54c 0q 0f 0s], rename 3.1 [0c 0q 11f 0s], poll 3.1 [60c 0q 0f 0s], access 3.1 [0c 0q 0f 0s], sync 3.0 [185c 0q 0f 0s], chroot 3.0 [2442c 1589q 1f 0s], uname 3.0* [703c 54q 0f 0s], clone 3.0 [0c 0q 2f 0s], symlink 3.0 [0c 4897q 0f 0s], recv 3.0* [0c 670q 2f 0s], send 3.0* [0c 0q 1f 0s], ioctl 3.0 [950c 760q 0f 0s], lseek 3.0 [0c 84q 0f 0s], getcwd 3.0 [0c 107q 0f 0s], mount 2.9 [0c 0q 0f 0s], alarm 2.9 [0c 0q 0f 0s], bind 2.9 [0c 0q 53f 0s], listen 2.9 [0c 0q 3f 0s], waitpid 2.9 [0c 303q 0f 0s], wait4 2.9 [104c 0q 0f 0s], recvfrom 2.9 [0c 128q 0f 0s], umount 2.8 [0c 90q 0f 0s], accept 2.8 [0c 0q 0f 0s], fsync 2.8 [0c 104q 0f 0s], nice 2.8 [1191c 0q 0f 0s], sendto 2.8 [0c 264q 0f 0s], fstat 2.7 [0c 37q 0f 0s], rmdir 2.7 [164c 154q 1f 0s], setuid 2.7 [0c 539q 0f 0s], dup 2.7 [0c 0q 0f 0s], reboot 2.7 [0c 2229q 0f 0s], setsockopt 2.7 [0c 143q 0f 0s], clock_gettime 2.6 [0c 0q 0f 0s], epoll_wait 2.6 [0c 803q 0f 0s], nanosleep 2.6 [0c 0q 0f 0s], _exit 2.6 [0c 2850q 0f 0s], seteuid 2.6 [0c 0q 0f 0s], readdir 2.6 [0c 304q 0f 0s], dup2 2.5 [0c 316q 0f 0s], getsockopt 2.5 [0c 30q 0f 0s], link 2.5 [25c 0q 0f 0s], fcntl 2.5 [0c 236q 0f 0s] ...

## Memory leak (12)

syslog 1.9 [0c 2433q 0f 0s], seccomp 1.9 [1778c 113q 0f 0s], bpf 1.9 [5296c 0q 0f 0s], unshare 1.8 [0c 51q 0f 0s], getrusage 1.7 [0c 48q 0f 0s], _sysctl 1.6 [0c 477q 0f 0s], setgid 1.6 [0c 60q 0f 0s], vfork 1.6 [0c 45q 0f 0s], umask 1.5 [1463c 465q 0f 0s], msgrcv 1.1 [0c 35q 0f 0s], sysfs 0.9 [0c 409q 0f 0s], stty 0.9 [0c 248q 0f 0s]

## Race condition (7)

sigprocmask 1.9 [0c 22q 0f 0s], socketpair 1.9 [0c 22q 0f 0s], setsid 1.9 [0c 21q 1f 0s], fallocate 1.8 [0c 18q 0f 0s], setitimer 1.7 [0c 29q 0f 0s], sysinfo 1.6 [0c 26q 0f 0s], tee 1.2 [1880c 0q 0f 0s]

## Heisenbug (325)

ftruncate 2.0 [0c 0q 0f 0s], madvise 1.9 [0c 0q 0f 0s], getsockname 1.9 [0c 0q 0f 0s], pause 1.9 [0c 0q 2f 0s], getrlimit 1.9 [0c 0q 0f 0s], getpeername 1.8 [0c 0q 0f 0s], readv 1.8 [0c 0q 0f 0s], clock_settime 1.8 [0c 0q 0f 0s], fdatasync 1.8 [0c 0q 0f 0s], inotify_init 1.8 [0c 0q 0f 0s], writev 1.8 [0c 0q 0f 0s], epoll_create1 1.8 [0c 0q 0f 0s], times 1.8 [0c 0q 1f 0s], fchown 1.8 [0c 0q 0f 0s], tkill 1.8 [0c 0q 0f 0s], setns 1.8 [0c 0q 0f 0s], mlock 1.7 [0c 4q 0f 0s], sched_setaffinity 1.7 [0c 0q 0f 0s], setpgrp 1.7 [0c 0q 1f 0s], pipe2 1.7 [0c 0q 0f 0s], utimes 1.7 [0c 0q 0f 0s], splice 1.7 [126c 0q 0f 0s], exit_group 1.7 [0c 0q 0f 0s], msync 1.7 [0c 0q 1f 0s], getpagesize 1.7 [0c 0q 0f 0s], epoll_pwait 1.7 [0c 0q 0f 0s], shutdown 1.7 [0c 0q 2f 0s], getpgrp 1.7 [0c 0q 0f 0s], stat64 1.7 [0c 0q 0f 0s], getdents 1.7 [0c 0q 0f 0s], setpgid 1.7 [0c 0q 0f 0s], getpriority 1.6 [0c 0q 0f 0s], mmap2 1.6 [0c 0q 0f 0s], brk 1.6 [578c 0q 0f 0s], utime 1.6 [0c 0q 0f 0s], clock_getres 1.6 [0c 0q 0f 0s], inotify_add_watch 1.6 [0c 0q 0f 0s], signalfd 1.6 [0c 0q 0f 0s], swapon 1.6 [0c 0q 0f 0s], gettid 1.6 [0c 0q 0f 0s], statx 1.6 [0c 0q 0f 0s], fstat64 1.6 [0c 0q 0f 0s], lchown 1.6 [0c 2q 0f 0s], sigsuspend 1.6 [0c 0q 0f 0s], prctl 1.5 [0c 0q 5f 0s], sendmmsg 1.5 [0c 0q 0f 0s], statfs 1.5 [0c 0q 0f 0s], perf_event_open 1.5 [0c 0q 0f 0s], fchdir 1.5 [0c 0q 0f 0s], prlimit64 1.5 [0c 0q 0f 0s], unlinkat 1.5 [0c 0q 0f 0s], dup3 1.5 [0c 0q 0f 0s], getdomainname 1.5 [0c 0q 0f 0s], shmget 1.5 [0c 0q 0f 0s], getdents64 1.5 [0c 0q 0f 0s], setreuid 1.5 [0c 0q 0f 0s], accept4 1.5 [0c 0q 0f 0s], socketcall 1.4 [0c 0q 0f 0s], shmdt 1.4 [0c 0q 0f 0s], getpgid 1.4 [0c 0q 1f 1s] ...

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
