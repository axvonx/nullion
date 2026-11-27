# Name a Linux sysctl key
id: linux-sysctl-key · domain: os-systems · status: draft
> Any dotted tunable name that appears under /proc/sys and is documented in the kernel Documentation/admin-guide or sysctl.conf references.

## Inbox
- vm.swappiness (suggested: off-by-one)
- net.ipv4.ip_forward (suggested: off-by-one)
- kernel.panic (suggested: off-by-one)
- kernel.yama.ptrace_scope (suggested: heisenbug)
- fs.inotify.max_user_watches (suggested: heisenbug)
- net.ipv4.tcp_syncookies (suggested: heisenbug)
- kernel.perf_event_paranoid (suggested: heisenbug)
