# Scoring: linux-device-node (Name a Linux device node)

109 answers (Bit Flip and Works on my machine left out); 0 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (1%) | 1 | 0 |
| npe | 27 (25%) | 27 | 0 |
| leak | 7 (6%) | 7 | 0 |
| race | 2 (2%) | 2 | 0 |
| heisenbug | 72 (66%) | 72 | 0 |

Same tier as today: 109/109 (100%).

## Off-by-one (1)

/dev/null 5.3 [1037c 69q 2f 0s]

## Null pointer exception (27)

/dev/sda 4.1 [0c 0q 0f 0s], /dev/zero 4.1 [66c 0q 3f 0s], /dev/random 3.9 [0c 0q 1f 0s], /dev/urandom 3.9 [0c 0q 0f 0s], /dev/console 3.5 [0c 0q 0f 0s], /dev/hda 3.4 [0c 0q 0f 0s], /dev/tty 3.3 [0c 0q 0f 0s], /dev/vda 3.0 [0c 0q 0f 0s], /dev/video0 3.0 [962c 0q 0f 0s], /dev/pts/0 2.8 [0c 0q 0f 0s], /dev/ttyS0 2.8 [0c 0q 0f 0s], /dev/tty0 2.8 [902c 0q 0f 0s], /dev/input/event0 2.8 [0c 0q 0f 0s], /dev/mem 2.6 [0c 0q 1f 0s], /dev/sr0 2.6 [0c 0q 0f 0s], /dev/nvme0n1 2.6 [9290c 0q 0f 0s], /dev/input/mice 2.5 [0c 0q 0f 0s], /dev/loop0 2.4 [839c 0q 0f 0s], /dev/xvda 2.4 [3110c 0q 0f 0s], /dev/input/mouse0 2.4 [0c 0q 0f 0s], /dev/ram0 2.3 [0c 0q 0f 0s], /dev/ttyUSB0 2.3 [0c 0q 0f 0s], /dev/mmcblk0 2.3 [0c 0q 0f 0s], /dev/kvm 2.2 [4789c 0q 0f 0s], /dev/fuse 2.1 [2927c 0q 0f 0s], /dev/dsp 2.1 [0c 0q 0f 0s], /dev/md0 2.0 [0c 0q 0f 0s]

## Memory leak (7)

/dev/ppp 1.6 [19151c 0q 0f 0s], /dev/uinput 1.4 [0c 54q 0f 0s], /dev/tpm 1.4 [9377c 0q 0f 0s], /dev/psaux 1.3 [5060c 0q 0f 0s], /dev/btrfs-control 0.6 [7973c 0q 0f 0s], /dev/3dfx 0.4 [7571c 0q 0f 0s], /dev/infiniband/uverbs0 0.4 [5313c 0q 0f 0s]

## Race condition (2)

/dev/dri/card0 1.8 [2172c 0q 0f 0s], /dev/agpgart 1.0 [3050c 0q 0f 0s]

## Heisenbug (72)

/dev/fb0 2.0 [612c 0q 0f 0s], /dev/fd0 2.0 [0c 0q 0f 0s], /dev/net/tun 1.9 [0c 0q 0f 0s], /dev/nvidia0 1.8 [0c 0q 0f 0s], /dev/rtc 1.8 [0c 0q 0f 0s], /dev/ttyACM0 1.8 [0c 0q 0f 0s], /dev/lp0 1.8 [0c 0q 0f 0s], /dev/audio 1.6 [0c 0q 0f 0s], /dev/nvidiactl 1.6 [0c 0q 0f 0s], /dev/rfkill 1.5 [0c 0q 0f 0s], /dev/rtc0 1.4 [0c 0q 0f 0s], /dev/tap0 1.4 [0c 0q 0f 0s], /dev/watchdog 1.4 [0c 0q 0f 0s], /dev/mixer 1.4 [0c 0q 0f 0s], /dev/port 1.4 [0c 0q 0f 0s], /dev/vcs 1.3 [0c 0q 0f 0s], /dev/input/uinput 1.3 [0c 0q 0f 0s], /dev/dasda 1.3 [869c 0q 0f 0s], /dev/parport0 1.3 [0c 0q 0f 0s], /dev/nvram 1.3 [1446c 0q 0f 0s], /dev/i2c-0 1.2 [0c 0q 0f 0s], /dev/hwrng 1.2 [0c 0q 0f 0s], /dev/input/js0 1.2 [0c 0q 0f 0s], /dev/spi0 1.2 [0c 0q 0f 0s], /dev/can0 1.1 [540c 0q 0f 0s], /dev/hvc0 1.1 [0c 0q 0f 0s], /dev/mergemem 1.0 [0c 0q 0f 0s], /dev/sg0 1.0 [0c 0q 0f 0s], /dev/mapper/control 1.0 [679c 0q 0f 0s], /dev/nb0 1.0 [581c 0q 0f 0s], /dev/rfcomm0 1.0 [0c 0q 0f 0s], /dev/cuse 1.0 [0c 0q 0f 0s], /dev/autofs 1.0 [0c 0q 0f 0s], /dev/vcsa 1.0 [0c 0q 0f 0s], /dev/vhost-net 0.9 [0c 0q 0f 0s], /dev/mtd0 0.9 [210c 0q 0f 0s], /dev/hpet 0.9 [685c 0q 0f 0s], /dev/apm_bios 0.9 [314c 0q 0f 0s], /dev/loop-control 0.9 [0c 0q 0f 0s], /dev/crash 0.9 [0c 0q 0f 0s], /dev/vmmon 0.9 [0c 0q 0f 0s], /dev/nnpfs0 0.8 [0c 0q 0f 0s], /dev/st0 0.8 [0c 0q 0f 0s], /dev/cpu/microcode 0.8 [0c 0q 0f 0s], /dev/uhid 0.8 [0c 0q 0f 0s], /dev/nst0 0.8 [0c 0q 0f 0s], /dev/mcelog 0.8 [616c 0q 0f 0s], /dev/sexec 0.7 [0c 0q 0f 0s], /dev/vfio/vfio 0.7 [0c 0q 0f 0s], /dev/cpu/0/cpuid 0.7 [0c 0q 0f 0s], /dev/systrace 0.7 [75c 0q 0f 0s], /dev/ttyprintk 0.6 [0c 0q 0f 0s], /dev/snapshot 0.6 [0c 0q 0f 0s], /dev/ussp_ctl 0.6 [0c 0q 0f 0s], /dev/drbd0 0.6 [0c 0q 0f 0s], /dev/cciss/c0d0 0.6 [0c 0q 0f 0s], /dev/vhost-vsock 0.6 [0c 0q 0f 0s], /dev/userfaultfd 0.6 [0c 0q 0f 0s], /dev/shmiq 0.5 [0c 0q 0f 0s], /dev/cpu/0/msr 0.5 [0c 0q 0f 0s] ...

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
