# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: Linux, device.

## linux-device-node

109 candidates; 12 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| /dev/sda | 10 | 0 | 1 | 0.60 | npe | counts | off-by-one | — |
| /dev/urandom | 3 | 0 | 1 | 0.52 | off-by-one | judge | off-by-one | — |
| /dev/random | 1 | 0 | 1 | 0.46 | off-by-one | judge | off-by-one | — |
| /dev/console ⚠ counts said heisenbug | 13 | 0 | 0 | 0.20 | npe | judge (override) | npe | — |
| /dev/video0 ⚠ counts said heisenbug | 12 | 0 | 0 | 0.20 | leak | judge (override) | leak | — |
| /dev/null | 9 | 0 | 0 | 0.19 | off-by-one | judge | off-by-one | — |
| /dev/watchdog | 7 | 0 | 0 | 0.17 | leak | judge | leak | — |
| /dev/ptmx | 6 | 0 | 0 | 0.16 | womm | pin | npe | — |
| /dev/ppp | 6 | 0 | 0 | 0.16 | leak | judge | leak | — |
| /dev/ttyUSB0 | 5 | 0 | 0 | 0.15 | npe | judge | npe | — |
| /dev/kvm | 5 | 0 | 0 | 0.15 | leak | judge | leak | — |
| /dev/ram0 | 5 | 0 | 0 | 0.15 | leak | judge | leak | — |
| /dev/tty0 | 5 | 0 | 0 | 0.15 | npe | judge | npe | — |
| /dev/zero | 4 | 0 | 0 | 0.13 | off-by-one | judge | off-by-one | — |
| /dev/tty | 4 | 0 | 0 | 0.13 | off-by-one | judge | off-by-one | — |
| /dev/fb0 | 4 | 0 | 0 | 0.13 | npe | judge | npe | — |
| /dev/fuse | 4 | 0 | 0 | 0.13 | leak | judge | leak | — |
| /dev/input/mice | 4 | 0 | 0 | 0.13 | npe | judge | npe | — |
| /dev/dsp | 4 | 0 | 0 | 0.13 | leak | judge | leak | — |
| /dev/hwrng | 4 | 0 | 0 | 0.13 | leak | judge | leak | — |
| /dev/port | 4 | 0 | 0 | 0.13 | race | judge | race | — |
| /dev/loop0 | 3 | 0 | 0 | 0.12 | npe | judge | npe | — |
| /dev/mem | 3 | 0 | 0 | 0.12 | npe | judge | npe | — |
| /dev/net/tun | 3 | 0 | 0 | 0.12 | leak | judge | leak | — |
| /dev/rtc | 3 | 0 | 0 | 0.12 | leak | judge | leak | — |
| /dev/rfkill | 3 | 0 | 0 | 0.12 | leak | judge | leak | — |
| /dev/userio | 3 | 0 | 0 | 0.12 | heisenbug | judge | heisenbug | — |
| /dev/uhid | 3 | 0 | 0 | 0.12 | race | judge | race | — |
| /dev/mtd0 | 3 | 0 | 0 | 0.12 | race | judge | race | — |
| /dev/dvb/adapter0/frontend0 | 3 | 0 | 0 | 0.12 | heisenbug | judge | heisenbug | — |
| /dev/ttyS0 | 2 | 0 | 0 | 0.09 | npe | judge | npe | — |
| /dev/hda | 2 | 0 | 0 | 0.09 | npe | judge | npe | — |
| /dev/kmsg | 2 | 0 | 0 | 0.09 | leak | judge | leak | — |
| /dev/fd0 | 2 | 0 | 0 | 0.09 | npe | judge | npe | — |
| /dev/lp0 | 2 | 0 | 0 | 0.09 | leak | judge | leak | — |
| /dev/vfio/vfio | 2 | 0 | 0 | 0.09 | race | judge | race | — |
| /dev/loop-control | 2 | 0 | 0 | 0.09 | race | judge | race | — |
| /dev/input/uinput | 2 | 0 | 0 | 0.09 | leak | judge | leak | — |
| /dev/psaux | 2 | 0 | 0 | 0.09 | leak | judge | leak | — |
| /dev/crash | 2 | 0 | 0 | 0.09 | heisenbug | judge | heisenbug | — |
| /dev/autofs | 2 | 0 | 0 | 0.09 | race | judge | race | — |
| /dev/nb0 | 2 | 0 | 0 | 0.09 | race | judge | race | — |
| /dev/kmem | 1 | 0 | 0 | 0.06 | womm | pin | leak | — |
| /dev/sr0 | 1 | 0 | 0 | 0.06 | npe | judge | npe | — |
| /dev/mmcblk0 | 1 | 0 | 0 | 0.06 | leak | judge | leak | — |
| /dev/mapper/control | 1 | 0 | 0 | 0.06 | leak | judge | leak | — |
| /dev/input/event0 | 1 | 0 | 0 | 0.06 | leak | judge | leak | — |
| /dev/md0 | 1 | 0 | 0 | 0.06 | leak | judge | leak | — |
| /dev/nvidiactl | 1 | 0 | 0 | 0.06 | leak | judge | leak | — |
| /dev/xvda | 1 | 0 | 0 | 0.06 | leak | judge | leak | — |
| /dev/vhost-net | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/vhost-vsock | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/btrfs-control | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/cuse | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/tpm | 1 | 0 | 0 | 0.06 | leak | judge | leak | — |
| /dev/hpet | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/mcelog | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/snapshot | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/drbd0 | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/cpu/microcode | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/hvc0 | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/oldmem | 1 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| /dev/ttyprintk | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/userdma | 1 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| /dev/infiniband/uverbs0 | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/agpgart | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/ttyACM0 | 1 | 0 | 0 | 0.06 | npe | judge | npe | — |
| /dev/full | 1 | 0 | 0 | 0.06 | womm | pin | npe | — |
| /dev/input/js0 | 1 | 0 | 0 | 0.06 | leak | judge | leak | — |
| /dev/mixer | 1 | 0 | 0 | 0.06 | leak | judge | leak | — |
| /dev/audio | 1 | 0 | 0 | 0.06 | leak | judge | leak | — |
| /dev/nvidia0 | 1 | 0 | 0 | 0.06 | leak | judge | leak | — |
| /dev/nvram | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/sg0 | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/st0 | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/nst0 | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/vcs | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/vcsa | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/tap0 | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/rfcomm0 | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/can0 | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/spi0 | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/scanners/cuecat | 1 | 0 | 0 | 0.06 | bitflip | pin | heisenbug | — |
| /dev/usb/legousbtower0 | 1 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| /dev/dasda | 1 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| /dev/apm_bios | 1 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| /dev/3dfx | 1 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| /dev/vmmon | 1 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| /dev/perfctr | 1 | 0 | 0 | 0.06 | race | judge | race | — |
| /dev/systrace | 1 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| /dev/sexec | 1 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| /dev/zkshim | 1 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| /dev/kchuid | 1 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| /dev/kmview | 1 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| /dev/shmiq | 1 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| /dev/mergemem | 1 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| /dev/nnpfs0 | 1 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| /dev/ipath_diag | 1 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| /dev/ussp_ctl | 1 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| /dev/pts/0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| /dev/dri/card0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| /dev/i2c-0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| /dev/cpu/0/msr ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| /dev/parport0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| /dev/input/mouse0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| /dev/cpu/0/cpuid ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| /dev/cciss/c0d0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| /dev/intermezzo0 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| /dev/bus/vme/ctl ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): /dev/console (counts said heisenbug, now npe), /dev/video0 (counts said heisenbug, now leak)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

19/20 sampled answers are members (95%); 17/20 also have an acceptable tier. Not members: /dev/input/uinput (The kernel's uinput misc node is /dev/uinput. /dev/input/uinput is at most a udev-made path or alias of it, and I cannot confirm a kernel or driver creates it, so I am not sure it exists as a separate node. Tier would be plausible if it counted.).

## Pipeline report

Generated 2026-11-27 19:02 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/linux-device-node.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (/dev/scanners/cuecat; /dev/kmem, /dev/ptmx, /dev/full): the owner vets them
- scripts/bank/obvious-draft/linux-device-node.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 35/35 obvious answers accepted |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | PASS | 85/113 answers have a verified link (75%); prompt link yes |
| precision | PASS | 19/20 sampled answers are members (95%), 17/20 with acceptable tier |
| answer count | PASS | 113 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 3 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 5 | 5 |
| Works on my machine | 3 | 0 |
| Null pointer exception | 18 | 18 |
| Memory leak | 30 | 30 |
| Race condition | 33 | 33 |
| Heisenbug | 23 | 23 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 1.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## linux-device-node
_Name a Linux device node_

Works on my machine:
- [ ] /dev/full
- [ ] /dev/ptmx
- [ ] /dev/kmsg
- [ ] /dev/kmem
- [ ] /dev/vhost-net
- [ ] other: 

Bit Flip:
- [ ] /dev/scanners/cuecat
- [ ] /dev/usb/legousbtower0
- [ ] /dev/ttyprintk
- [ ] /dev/mergemem
- [ ] /dev/userio
- [ ] /dev/cuse
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 13 |
| harvest | done | 0 |
| filter | done | 63 |
| compare | done | 0 |
| escalate | done | 18 |
| merge | done | 8 |
| obvious | done | 22 |
| dupes | done | 0 |
| links | done | 34 |
| precision | done | 31 |
| report | running |  |
