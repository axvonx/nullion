# Scoring: linux-system-call (Name a Linux system call)

438 answers (Bit Flip and Works on my machine left out); 7 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 4 (1%) | 4 | 0 |
| npe | 90 (21%) | 90 | 0 |
| leak | 10 (2%) | 9 | 0 |
| race | 9 (2%) | 4 | 0 |
| heisenbug | 325 (74%) | 331 | 0 |

Same tier as today: 424/438 (97%).

## Off-by-one (4)

read 4.8 [239c 0q 0f], write 4.7 [349c 0q 2f], open 4.7 [290c 0q 6f], fork 4.5 [1093c 0q 1f]

## Null pointer exception (90)

close 4.3 [0c 0q 0f], socket 4.0 [0c 0q 7f], chmod 4.0* [5380c 2519q 0f], mkdir 4.0* [628c 1430q 0f], kill 4.0 [733c 0q 0f], pipe 4.0 [1860c 0q 1f], connect 4.0 [0c 0q 0f], getpid 3.8 [0c 0q 0f], execve 3.7 [642c 6370q 0f], stat 3.6 [382c 1071q 1f], chdir 3.6 [0c 203q 0f], mmap 3.4 [1402c 2061q 0f], time 3.4 [0c 0q 41f], gettimeofday 3.4 [0c 100q 1f], signal 3.3 [0c 0q 0f], select 3.3 [205c 0q 0f], chown 3.2 [443c 942q 0f], getuid 3.2 [0c 0q 0f], unlink 3.1 [54c 0q 0f], rename 3.1 [0c 0q 11f], poll 3.1 [60c 0q 0f], access 3.1 [0c 0q 0f], sync 3.0 [185c 0q 0f], chroot 3.0 [2442c 1589q 1f], uname 3.0* [703c 54q 0f], clone 3.0 [0c 0q 2f], symlink 3.0 [0c 4897q 0f], recv 3.0* [0c 670q 2f], send 3.0* [0c 0q 1f], ioctl 3.0 [950c 760q 0f], lseek 3.0 [0c 84q 0f], getcwd 3.0 [0c 107q 0f], mount 2.9 [357c 0q 0f], alarm 2.9 [0c 0q 0f], bind 2.9 [0c 0q 53f], listen 2.9 [0c 0q 3f], waitpid 2.9 [0c 303q 0f], recvfrom 2.9 [0c 128q 0f], wait4 2.9 [0c 0q 0f], umount 2.8 [357c 90q 0f], accept 2.8 [0c 0q 0f], fsync 2.8 [0c 104q 0f], nice 2.8 [1191c 0q 0f], sendto 2.8 [0c 264q 0f], fstat 2.7 [0c 37q 0f], rmdir 2.7 [164c 154q 1f], setuid 2.7 [0c 539q 0f], dup 2.7 [130c 0q 1f], reboot 2.7 [0c 2229q 0f], setsockopt 2.7 [0c 143q 0f], clock_gettime 2.6 [0c 0q 0f], epoll_wait 2.6 [824c 803q 0f], nanosleep 2.6 [0c 0q 0f], _exit 2.6 [0c 2850q 0f], seteuid 2.6 [0c 0q 0f], readdir 2.6 [0c 304q 0f], dup2 2.5 [130c 316q 0f], getsockopt 2.5 [0c 30q 0f], link 2.5 [0c 0q 0f], fcntl 2.5 [0c 236q 0f] ...

## Memory leak (10)

syslog 1.9 [0c 2433q 0f], seccomp 1.9 [1778c 113q 0f], bpf 1.9 [5296c 496q 0f], unshare 1.8 [0c 51q 0f], _sysctl 1.6 [0c 477q 0f], setgid 1.6 [0c 60q 0f], umask 1.5 [1463c 465q 0f], ipc 1.4 [0c 4735q 0f], sysfs 0.9 [0c 409q 0f], stty 0.9 [0c 248q 0f]

## Race condition (9)

sigprocmask 1.9 [0c 22q 0f], socketpair 1.9 [0c 22q 0f], setsid 1.9 [0c 21q 1f], getrusage 1.7 [0c 48q 0f], setitimer 1.7 [0c 29q 0f], sysinfo 1.6 [0c 26q 0f], brk 1.6 [578c 46q 0f], vfork 1.6 [1093c 45q 0f], msgrcv 1.1 [0c 35q 0f]

## Heisenbug (325)

ftruncate 2.0 [0c 0q 0f], madvise 1.9 [0c 0q 0f], getsockname 1.9 [0c 0q 0f], pause 1.9 [0c 0q 2f], getrlimit 1.9 [0c 0q 0f], getpeername 1.8 [0c 0q 0f], readv 1.8 [0c 0q 0f], inotify_init 1.8 [758c 0q 0f], clock_settime 1.8 [0c 0q 0f], fdatasync 1.8 [0c 0q 0f], writev 1.8 [0c 0q 0f], epoll_create1 1.8 [824c 0q 0f], fallocate 1.8 [0c 18q 0f], times 1.8 [0c 0q 1f], fchown 1.8 [0c 0q 0f], tkill 1.8 [0c 0q 0f], setns 1.8 [0c 0q 0f], mlock 1.7 [0c 4q 0f], sched_setaffinity 1.7 [0c 0q 0f], setpgrp 1.7 [0c 0q 1f], pipe2 1.7 [0c 0q 0f], utimes 1.7 [0c 0q 0f], exit_group 1.7 [0c 0q 0f], msync 1.7 [0c 0q 1f], splice 1.7 [0c 0q 0f], getpagesize 1.7 [0c 0q 0f], epoll_pwait 1.7 [0c 0q 0f], shutdown 1.7 [0c 0q 2f], getpgrp 1.7 [0c 0q 0f], stat64 1.7 [0c 0q 0f], getdents 1.7 [0c 0q 0f], setpgid 1.7 [0c 0q 0f], getpriority 1.6 [0c 0q 0f], mmap2 1.6 [0c 0q 0f], inotify_add_watch 1.6 [758c 0q 0f], utime 1.6 [0c 0q 0f], clock_getres 1.6 [0c 0q 0f], signalfd 1.6 [0c 0q 0f], swapon 1.6 [0c 0q 0f], gettid 1.6 [0c 0q 0f], statx 1.6 [0c 0q 0f], fstat64 1.6 [0c 0q 0f], lchown 1.6 [0c 2q 0f], sigsuspend 1.6 [0c 0q 0f], prctl 1.5 [0c 0q 5f], sendmmsg 1.5 [0c 0q 0f], statfs 1.5 [0c 0q 0f], perf_event_open 1.5 [0c 0q 0f], fchdir 1.5 [0c 0q 0f], prlimit64 1.5 [0c 0q 0f], unlinkat 1.5 [0c 0q 0f], dup3 1.5 [130c 0q 0f], getdomainname 1.5 [0c 0q 0f], shmget 1.5 [0c 0q 0f], getdents64 1.5 [0c 0q 0f], setreuid 1.5 [0c 0q 0f], accept4 1.5 [0c 0q 0f], socketcall 1.4 [0c 0q 0f], shmdt 1.4 [0c 0q 0f], getpgid 1.4 [0c 0q 1f] ...

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
