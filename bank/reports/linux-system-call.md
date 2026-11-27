# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: system call, syscall.

## linux-system-call

440 candidates; 262 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| time | 69 | 13 | 434 | 1.00 | off-by-one | counts | npe | — |
| times | 69 | 13 | 434 | 1.00 | off-by-one | counts | npe | — |
| security ⚠ counts said off-by-one | 24 | 22 | 188 | 0.95 | heisenbug | judge (override) | heisenbug | — |
| select | 28 | 4 | 98 | 0.75 | npe | counts | off-by-one | — |
| access | 50 | 2 | 147 | 0.73 | npe | counts | npe | — |
| open | 60 | 1 | 143 | 0.68 | npe | counts | off-by-one | — |
| creat | 69 | 1 | 118 | 0.67 | npe | counts | npe | — |
| read | 99 | 1 | 50 | 0.61 | npe | counts | off-by-one | — |
| write | 97 | 1 | 46 | 0.60 | npe | counts | off-by-one | — |
| socket ⚠ counts said leak | 38 | 3 | 7 | 0.54 | off-by-one | judge (override) | off-by-one | — |
| close ⚠ counts said leak | 24 | 1 | 39 | 0.54 | off-by-one | judge (override) | off-by-one | — |
| signal | 31 | 0 | 73 | 0.49 | leak | counts | npe | — |
| personality | 3 | 1 | 57 | 0.48 | leak | counts | race | — |
| seccomp | 26 | 1 | 16 | 0.48 | leak | counts | leak | — |
| send ⚠ counts said leak | 47 | 1 | 10 | 0.47 | off-by-one | judge (override) | off-by-one | — |
| break ⚠ counts said leak | 10 | 1 | 19 | 0.45 | heisenbug | judge (override) | heisenbug | — |
| connect ⚠ counts said leak | 8 | 0 | 69 | 0.43 | off-by-one | judge (override) | off-by-one | — |
| _exit ⚠ counts said leak | 54 | 1 | 4 | 0.42 | off-by-one | judge (override) | off-by-one | — |
| link | 11 | 0 | 40 | 0.40 | leak | counts | npe | — |
| tee | 0 | 3 | 9 | 0.39 | race | judge | race | — |
| accept ⚠ counts said leak | 12 | 0 | 22 | 0.36 | off-by-one | judge (override) | off-by-one | — |
| bpf | 47 | 0 | 8 | 0.35 | leak | counts | leak | — |
| mmap ⚠ counts said leak | 46 | 1 | 1 | 0.34 | off-by-one | judge (override) | off-by-one | — |
| mount | 25 | 0 | 9 | 0.33 | leak | counts | npe | — |
| setup ⚠ counts said leak | 6 | 0 | 19 | 0.32 | heisenbug | judge (override) | heisenbug | — |
| futex | 24 | 1 | 1 | 0.31 | womm | pin | — | — |
| fsync | 5 | 1 | 3 | 0.30 | npe | judge | npe | — |
| idle | 21 | 0 | 5 | 0.28 | race | counts | heisenbug | — |
| bind ⚠ counts said race | 14 | 0 | 6 | 0.28 | off-by-one | judge (override) | off-by-one | — |
| fork ⚠ counts said race | 10 | 0 | 7 | 0.27 | off-by-one | judge (override) | off-by-one | — |
| clone ⚠ counts said race | 16 | 0 | 5 | 0.27 | npe | judge (override) | npe | — |
| poll ⚠ counts said race | 19 | 0 | 3 | 0.25 | npe | judge (override) | npe | — |
| ioctl ⚠ counts said race | 54 | 0 | 1 | 0.24 | off-by-one | judge (override) | off-by-one | — |
| alarm ⚠ counts said race | 1 | 0 | 12 | 0.23 | npe | judge (override) | npe | — |
| pipe ⚠ counts said heisenbug | 15 | 0 | 2 | 0.21 | off-by-one | judge (override) | off-by-one | — |
| ptrace ⚠ counts said heisenbug | 15 | 0 | 2 | 0.21 | npe | judge (override) | npe | — |
| sync | 4 | 0 | 4 | 0.20 | npe | judge | npe | — |
| nice ⚠ counts said heisenbug | 10 | 0 | 2 | 0.20 | npe | judge (override) | npe | — |
| msync | 1 | 1 | 1 | 0.19 | leak | judge | leak | — |
| listen | 3 | 0 | 4 | 0.19 | off-by-one | judge | off-by-one | — |
| execve ⚠ counts said heisenbug | 16 | 0 | 1 | 0.19 | off-by-one | judge (override) | off-by-one | — |
| splice | 6 | 0 | 2 | 0.18 | leak | judge | leak | — |
| ipc | 2 | 0 | 4 | 0.17 | heisenbug | judge | heisenbug | — |
| munmap ⚠ counts said heisenbug | 10 | 0 | 1 | 0.17 | npe | judge (override) | npe | — |
| reboot | 4 | 0 | 2 | 0.16 | npe | judge | npe | — |
| truncate | 4 | 0 | 2 | 0.16 | npe | judge | npe | — |
| prof | 0 | 1 | 1 | 0.16 | heisenbug | judge | heisenbug | — |
| prctl ⚠ counts said heisenbug | 25 | 0 | 0 | 0.15 | leak | judge (override) | leak | — |
| shutdown | 3 | 0 | 2 | 0.15 | npe | judge | npe | — |
| mprotect | 6 | 0 | 1 | 0.14 | npe | judge | npe | — |
| recv ⚠ counts said heisenbug | 18 | 0 | 0 | 0.14 | off-by-one | judge (override) | off-by-one | — |
| migrate_pages | 1 | 0 | 3 | 0.14 | race | judge | race | — |
| sendmmsg | 1 | 1 | 0 | 0.14 | race | judge | race | — |
| kill | 5 | 0 | 1 | 0.14 | off-by-one | judge | off-by-one | — |
| pause | 2 | 0 | 2 | 0.14 | npe | judge | npe | — |
| rename | 2 | 0 | 2 | 0.14 | npe | judge | npe | — |
| openat ⚠ counts said heisenbug | 16 | 0 | 0 | 0.13 | npe | judge (override) | npe | — |
| sendmsg ⚠ counts said heisenbug | 16 | 0 | 0 | 0.13 | leak | judge (override) | leak | — |
| stat ⚠ counts said heisenbug | 16 | 0 | 0 | 0.13 | off-by-one | judge (override) | off-by-one | — |
| unshare ⚠ counts said heisenbug | 15 | 0 | 0 | 0.13 | leak | judge (override) | leak | — |
| madvise | 4 | 0 | 1 | 0.13 | leak | judge | leak | — |
| wait4 | 4 | 0 | 1 | 0.13 | leak | judge | leak | — |
| fcntl ⚠ counts said heisenbug | 13 | 0 | 0 | 0.12 | npe | judge (override) | npe | — |
| setsockopt ⚠ counts said heisenbug | 13 | 0 | 0 | 0.12 | npe | judge (override) | npe | — |
| mlock ⚠ counts said heisenbug | 12 | 0 | 0 | 0.12 | leak | judge (override) | leak | — |
| move_pages | 1 | 0 | 2 | 0.12 | race | judge | race | — |
| recvmsg ⚠ counts said heisenbug | 10 | 0 | 0 | 0.11 | leak | judge (override) | leak | — |
| init_module | 9 | 0 | 0 | 0.11 | race | judge | race | — |
| mkdir | 9 | 0 | 0 | 0.11 | off-by-one | judge | off-by-one | — |
| chroot | 2 | 0 | 1 | 0.10 | npe | judge | npe | — |
| unlink | 2 | 0 | 1 | 0.10 | npe | judge | npe | — |
| userfaultfd | 8 | 0 | 0 | 0.10 | heisenbug | judge | heisenbug | — |
| finit_module | 7 | 0 | 0 | 0.10 | race | judge | race | — |
| getpid | 7 | 0 | 0 | 0.10 | off-by-one | judge | off-by-one | — |
| getsockopt | 7 | 0 | 0 | 0.10 | npe | judge | npe | — |
| mbind | 7 | 0 | 0 | 0.10 | race | judge | race | — |
| mlockall | 7 | 0 | 0 | 0.10 | leak | judge | leak | — |
| rt_sigreturn | 7 | 0 | 0 | 0.10 | race | judge | race | — |
| sendto | 7 | 0 | 0 | 0.10 | npe | judge | npe | — |
| sigreturn | 7 | 0 | 0 | 0.10 | race | judge | race | — |
| arch_prctl | 6 | 0 | 0 | 0.09 | race | judge | race | — |
| brk | 6 | 0 | 0 | 0.09 | npe | judge | npe | — |
| pread | 6 | 0 | 0 | 0.09 | npe | judge | npe | — |
| sched_setattr | 6 | 0 | 0 | 0.09 | race | judge | race | — |
| _sysctl | 5 | 0 | 0 | 0.08 | race | judge | race | — |
| dup2 | 5 | 0 | 0 | 0.08 | npe | judge | npe | — |
| getppid | 5 | 0 | 0 | 0.08 | npe | judge | npe | — |
| mlock2 | 5 | 0 | 0 | 0.08 | heisenbug | judge | heisenbug | — |
| recvfrom | 5 | 0 | 0 | 0.08 | npe | judge | npe | — |
| sched_setaffinity | 5 | 0 | 0 | 0.08 | leak | judge | leak | — |
| set_mempolicy | 5 | 0 | 0 | 0.08 | race | judge | race | — |
| symlink | 5 | 0 | 0 | 0.08 | npe | judge | npe | — |
| add_key | 4 | 0 | 0 | 0.08 | race | judge | race | — |
| chmod | 4 | 0 | 0 | 0.08 | npe | judge | npe | — |
| execveat | 4 | 0 | 0 | 0.08 | race | judge | race | — |
| fstat | 4 | 0 | 0 | 0.08 | npe | judge | npe | — |
| kexec_load | 4 | 0 | 0 | 0.08 | race | judge | race | — |
| lseek | 4 | 0 | 0 | 0.08 | off-by-one | judge | off-by-one | — |
| mremap | 4 | 0 | 0 | 0.08 | leak | judge | leak | — |
| munlock | 4 | 0 | 0 | 0.08 | leak | judge | leak | — |
| nanosleep | 4 | 0 | 0 | 0.08 | npe | judge | npe | — |
| pwrite | 4 | 0 | 0 | 0.08 | npe | judge | npe | — |
| remap_file_pages | 4 | 0 | 0 | 0.08 | heisenbug | judge | heisenbug | — |
| request_key | 4 | 0 | 0 | 0.08 | race | judge | race | — |
| sched_getattr | 4 | 0 | 0 | 0.08 | race | judge | race | — |
| sendfile | 4 | 0 | 0 | 0.08 | leak | judge | leak | — |
| sysfs | 4 | 0 | 0 | 0.08 | heisenbug | judge | heisenbug | — |
| umount | 4 | 0 | 0 | 0.08 | npe | judge | npe | — |
| capset | 3 | 0 | 0 | 0.07 | race | judge | race | — |
| clock_nanosleep | 3 | 0 | 0 | 0.07 | leak | judge | leak | — |
| clone3 | 3 | 0 | 0 | 0.07 | race | judge | race | — |
| delete_module | 3 | 0 | 0 | 0.07 | race | judge | race | — |
| eventfd2 | 3 | 0 | 0 | 0.07 | race | judge | race | — |
| geteuid | 3 | 0 | 0 | 0.07 | npe | judge | npe | — |
| getuid | 3 | 0 | 0 | 0.07 | npe | judge | npe | — |
| getxattr | 3 | 0 | 0 | 0.07 | race | judge | race | — |
| keyctl | 3 | 0 | 0 | 0.07 | race | judge | race | — |
| membarrier | 3 | 0 | 0 | 0.07 | heisenbug | judge | heisenbug | — |
| munlockall | 3 | 0 | 0 | 0.07 | leak | judge | leak | — |
| pivot_root | 3 | 0 | 0 | 0.07 | race | judge | race | — |
| rt_sigaction | 3 | 0 | 0 | 0.07 | race | judge | race | — |
| rt_sigprocmask | 3 | 0 | 0 | 0.07 | race | judge | race | — |
| setxattr | 3 | 0 | 0 | 0.07 | race | judge | race | — |
| shmat | 3 | 0 | 0 | 0.07 | leak | judge | leak | — |
| sigaction | 3 | 0 | 0 | 0.07 | npe | judge | npe | — |
| sigprocmask | 3 | 0 | 0 | 0.07 | leak | judge | leak | — |
| socketpair | 3 | 0 | 0 | 0.07 | npe | judge | npe | — |
| statfs | 3 | 0 | 0 | 0.07 | leak | judge | leak | — |
| statx | 3 | 0 | 0 | 0.07 | race | judge | race | — |
| uname | 3 | 0 | 0 | 0.07 | npe | judge | npe | — |
| create_module | 0 | 0 | 1 | 0.05 | heisenbug | judge | heisenbug | — |
| syncfs | 0 | 0 | 1 | 0.05 | race | judge | race | — |
| phys | 0 | 0 | 1 | 0.05 | heisenbug | judge | heisenbug | — |
| _llseek | 2 | 0 | 0 | 0.05 | race | judge | race | — |
| dup | 2 | 0 | 0 | 0.05 | npe | judge | npe | — |
| dup3 | 2 | 0 | 0 | 0.05 | leak | judge | leak | — |
| epoll_wait | 2 | 0 | 0 | 0.05 | leak | judge | leak | — |
| eventfd | 2 | 0 | 0 | 0.05 | leak | judge | leak | — |
| flock | 2 | 0 | 0 | 0.05 | npe | judge | npe | — |
| fstatat | 2 | 0 | 0 | 0.05 | leak | judge | leak | — |
| getcwd | 2 | 0 | 0 | 0.05 | npe | judge | npe | — |
| getdents64 | 2 | 0 | 0 | 0.05 | race | judge | race | — |
| getegid | 2 | 0 | 0 | 0.05 | npe | judge | npe | — |
| getgid | 2 | 0 | 0 | 0.05 | npe | judge | npe | — |
| getsockname | 2 | 0 | 0 | 0.05 | npe | judge | npe | — |
| gettid | 2 | 0 | 0 | 0.05 | npe | judge | npe | — |
| gettimeofday | 2 | 0 | 0 | 0.05 | npe | judge | npe | — |
| inotify_init | 2 | 0 | 0 | 0.05 | leak | judge | leak | — |
| inotify_init1 | 2 | 0 | 0 | 0.05 | race | judge | race | — |
| kexec_file_load | 2 | 0 | 0 | 0.05 | race | judge | race | — |
| mknod | 2 | 0 | 0 | 0.05 | leak | judge | leak | — |
| perf_event_open | 2 | 0 | 0 | 0.05 | race | judge | race | — |
| pipe2 | 2 | 0 | 0 | 0.05 | leak | judge | leak | — |
| prlimit64 | 2 | 0 | 0 | 0.05 | race | judge | race | — |
| renameat | 2 | 0 | 0 | 0.05 | leak | judge | leak | — |
| renameat2 | 2 | 0 | 0 | 0.05 | race | judge | race | — |
| rmdir | 2 | 0 | 0 | 0.05 | off-by-one | judge | off-by-one | — |
| set_robust_list | 2 | 0 | 0 | 0.05 | heisenbug | judge | heisenbug | — |
| set_tid_address | 2 | 0 | 0 | 0.05 | race | judge | race | — |
| setns | 2 | 0 | 0 | 0.05 | leak | judge | leak | — |
| setuid | 2 | 0 | 0 | 0.05 | npe | judge | npe | — |
| shmget | 2 | 0 | 0 | 0.05 | leak | judge | leak | — |
| socketcall | 2 | 0 | 0 | 0.05 | heisenbug | judge | heisenbug | — |
| stime | 2 | 0 | 0 | 0.05 | race | judge | race | — |
| sysinfo | 2 | 0 | 0 | 0.05 | leak | judge | leak | — |
| syslog | 2 | 0 | 0 | 0.05 | leak | judge | leak | — |
| utime | 2 | 0 | 0 | 0.05 | npe | judge | npe | — |
| utimes | 2 | 0 | 0 | 0.05 | leak | judge | leak | — |
| writev | 2 | 0 | 0 | 0.05 | leak | judge | leak | — |
| capget | 1 | 0 | 0 | 0.03 | race | judge | race | — |
| copy_file_range | 1 | 0 | 0 | 0.03 | race | judge | race | — |
| epoll_create | 1 | 0 | 0 | 0.03 | leak | judge | leak | — |
| epoll_ctl | 1 | 0 | 0 | 0.03 | leak | judge | leak | — |
| fadvise64 | 1 | 0 | 0 | 0.03 | race | judge | race | — |
| fdatasync | 1 | 0 | 0 | 0.03 | leak | judge | leak | — |
| fstatfs | 1 | 0 | 0 | 0.03 | leak | judge | leak | — |
| getdents | 1 | 0 | 0 | 0.03 | leak | judge | leak | — |
| getpeername | 1 | 0 | 0 | 0.03 | npe | judge | npe | — |
| getrusage | 1 | 0 | 0 | 0.03 | leak | judge | leak | — |
| ioprio_get | 1 | 0 | 0 | 0.03 | race | judge | race | — |
| ioprio_set | 1 | 0 | 0 | 0.03 | race | judge | race | — |
| listxattr | 1 | 0 | 0 | 0.03 | race | judge | race | — |
| lstat | 1 | 0 | 0 | 0.03 | npe | judge | npe | — |
| memfd_create | 1 | 0 | 0 | 0.03 | race | judge | race | — |
| mincore | 1 | 0 | 0 | 0.03 | race | judge | race | — |
| mount_setattr | 1 | 0 | 0 | 0.03 | heisenbug | judge | heisenbug | — |
| pkey_mprotect | 1 | 0 | 0 | 0.03 | heisenbug | judge | heisenbug | — |
| pwritev2 | 1 | 0 | 0 | 0.03 | race | judge | race | — |
| readlink | 1 | 0 | 0 | 0.03 | npe | judge | npe | — |
| readv | 1 | 0 | 0 | 0.03 | leak | judge | leak | — |
| removexattr | 1 | 0 | 0 | 0.03 | race | judge | race | — |
| sched_getaffinity | 1 | 0 | 0 | 0.03 | leak | judge | leak | — |
| sched_setscheduler | 1 | 0 | 0 | 0.03 | leak | judge | leak | — |
| semctl | 1 | 0 | 0 | 0.03 | leak | judge | leak | — |
| setgid | 1 | 0 | 0 | 0.03 | npe | judge | npe | — |
| setitimer | 1 | 0 | 0 | 0.03 | leak | judge | leak | — |
| setpgid | 1 | 0 | 0 | 0.03 | leak | judge | leak | — |
| sigaltstack | 1 | 0 | 0 | 0.03 | race | judge | race | — |
| spu_create | 1 | 0 | 0 | 0.03 | heisenbug | judge | heisenbug | — |
| spu_run | 1 | 0 | 0 | 0.03 | heisenbug | judge | heisenbug | — |
| sync_file_range | 1 | 0 | 0 | 0.03 | race | judge | race | — |
| timer_settime | 1 | 0 | 0 | 0.03 | leak | judge | leak | — |
| uselib | 1 | 0 | 0 | 0.03 | heisenbug | judge | heisenbug | — |
| ustat | 1 | 0 | 0 | 0.03 | heisenbug | judge | heisenbug | — |
| vfork | 1 | 0 | 0 | 0.03 | npe | judge | npe | — |
| readdir | 1 | 0 | 0 | 0.03 | heisenbug | judge | heisenbug | — |
| getpagesize | 1 | 0 | 0 | 0.03 | leak | judge | leak | — |
| waitpid | 1 | 0 | 0 | 0.03 | npe | judge | npe | — |
| _newselect ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| accept4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| acct ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| adjtimex ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| afs_syscall ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| alloc_hugepages ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| arm_fadvise64_64 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| arm_sync_file_range ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| bdflush ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| cacheflush ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| chdir ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| chown ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| chown32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| clock_adjtime ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| clock_getres ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| clock_gettime ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| clock_settime ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| clone2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| close_range ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| epoll_create1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| epoll_pwait ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| epoll_pwait2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| exit_group ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| faccessat ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| faccessat2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| fadvise64_64 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| fallocate ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| fanotify_init ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| fanotify_mark ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| fchdir ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| fchmod ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| fchmodat ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| fchown ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| fchown32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| fchownat ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| fcntl64 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| fgetxattr ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| flistxattr ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| free_hugepages ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| fremovexattr ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| fsetxattr ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| fstat64 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| fstatat64 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| fstatfs64 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ftruncate ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| ftruncate64 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| futimesat ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| get_kernel_syms ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| get_mempolicy ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| get_robust_list ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| get_thread_area ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| getcpu ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| getdomainname ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| getegid32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| geteuid32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| getgid32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| getgroups ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| getgroups32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| gethostname ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| getitimer ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| getpgid ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| getpgrp ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| getpriority ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| getrandom ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| getresgid ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| getresgid32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| getresuid ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| getresuid32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| getrlimit ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| getsid ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| getuid32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| getunwind ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| inotify_add_watch ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| inotify_rm_watch ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| io_cancel ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| io_destroy ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| io_getevents ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| io_setup ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| io_submit ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ioperm ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| iopl ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| kcmp ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| lchown ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| lchown32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| lgetxattr ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| linkat ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| llistxattr ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| lookup_dcookie ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| lremovexattr ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| lsetxattr ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| lstat64 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| memfd_secret ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mkdirat ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| mknodat ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| mmap2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| modify_ldt ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mq_getsetattr ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| mq_notify ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| mq_open ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| mq_timedreceive ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| mq_timedsend ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| mq_unlink ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| msgctl ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| msgget ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| msgrcv ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| msgsnd ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| name_to_handle_at ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| nfsservctl ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| oldfstat ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| oldlstat ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| oldolduname ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| oldstat ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| olduname ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| open_by_handle_at ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| openat2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| pciconfig_iobase ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| pciconfig_read ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| pciconfig_write ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| perfmonctl ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| pidfd_getfd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| pidfd_open ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| pidfd_send_signal ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| pkey_alloc ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| pkey_free ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ppoll ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| preadv ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| preadv2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| process_madvise ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| process_vm_readv ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| process_vm_writev ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| pwritev ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| query_module ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| quotactl ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| readahead ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| readlinkat ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| recvmmsg ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| restart_syscall ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rt_sigpending ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rt_sigqueueinfo ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rt_sigsuspend ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rt_sigtimedwait ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| rt_tgsigqueueinfo ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| s390_guarded_storage ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| s390_pci_mmio_read ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| s390_pci_mmio_write ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| s390_runtime_instr ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| s390_sthyi ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| sched_get_priority_max ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| sched_get_priority_min ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| sched_getparam ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| sched_getscheduler ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| sched_rr_get_interval ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| sched_setparam ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| sched_yield ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| semget ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| semop ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| semtimedop ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| sendfile64 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| set_thread_area ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| setdomainname ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| setegid ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| seteuid ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| setfsgid ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| setfsgid32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| setfsuid ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| setfsuid32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| setgid32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| setgroups ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| setgroups32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| sethostname ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| setpgrp ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| setpriority ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| setregid ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| setregid32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| setresgid ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| setresgid32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| setresuid ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| setresuid32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| setreuid ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| setreuid32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| setrlimit ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| setsid ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| settimeofday ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| setuid32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| sgetmask ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| shmctl ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| shmdt ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| signalfd ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| signalfd4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| sigpending ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| sigsuspend ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| sigtimedwait ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| sigwaitinfo ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ssetmask ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| stat64 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| statfs64 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| subpage_prot | 0 | 0 | 0 | 0.00 | bitflip | pin | — | — |
| swapoff ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| swapon ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| symlinkat ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tgkill ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| timer_create ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| timer_delete ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| timer_getoverrun ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| timer_gettime ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| timerfd_create ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| timerfd_gettime ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| timerfd_settime ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| tkill ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| truncate64 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| tuxcall ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| umask ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| umount2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| unlinkat ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| utimensat ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| vhangup ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| vm86 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| vm86old ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| vmsplice ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| vserver ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| waitid ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| fattach ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| fdetach ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| getmsg ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| getpmsg ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| gtty ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mpx ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| pselect6 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| putmsg ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| putpmsg ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| stty ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| madvise1 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): _exit (counts said leak, now off-by-one), accept (counts said leak, now off-by-one), alarm (counts said race, now npe), bind (counts said race, now off-by-one), clone (counts said race, now npe), close (counts said leak, now off-by-one), connect (counts said leak, now off-by-one), execve (counts said heisenbug, now off-by-one), fcntl (counts said heisenbug, now npe), fork (counts said race, now off-by-one), ioctl (counts said race, now off-by-one), mlock (counts said heisenbug, now leak), mmap (counts said leak, now off-by-one), munmap (counts said heisenbug, now npe), nice (counts said heisenbug, now npe), openat (counts said heisenbug, now npe), pipe (counts said heisenbug, now off-by-one), poll (counts said race, now npe), prctl (counts said heisenbug, now leak), ptrace (counts said heisenbug, now npe), recv (counts said heisenbug, now off-by-one), recvmsg (counts said heisenbug, now leak), security (counts said off-by-one, now heisenbug), send (counts said leak, now off-by-one), sendmsg (counts said heisenbug, now leak), setsockopt (counts said heisenbug, now npe), setup (counts said leak, now heisenbug), socket (counts said leak, now off-by-one), stat (counts said heisenbug, now off-by-one), unshare (counts said heisenbug, now leak), break (counts said leak, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

19/20 sampled answers are members (95%); 18/20 also have an acceptable tier. Not members: getmsg (unimplemented STREAMS stub, returns ENOSYS).
