# Scoring: linux-device-node (Name a Linux device node)

109 answers (Bit Flip and Works on my machine left out); 0 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (1%) | 1 | 0 |
| npe | 27 (25%) | 27 | 0 |
| leak | 3 (3%) | 2 | 0 |
| race | 6 (6%) | 7 | 0 |
| heisenbug | 72 (66%) | 72 | 0 |

Same tier as today: 108/109 (99%).

## Off-by-one (1)

/dev/null 5.3 [1037c 69q 2f]

## Null pointer exception (27)

/dev/sda 4.1 [0c 10q 0f], /dev/zero 4.1 [66c 0q 3f], /dev/random 3.9 [439c 0q 1f], /dev/urandom 3.9 [439c 0q 0f], /dev/console 3.5 [0c 0q 0f], /dev/hda 3.4 [0c 0q 0f], /dev/tty 3.3 [0c 0q 0f], /dev/vda 3.0 [0c 0q 0f], /dev/video0 3.0 [962c 0q 0f], /dev/pts/0 2.8 [0c 0q 0f], /dev/ttyS0 2.8 [0c 0q 0f], /dev/tty0 2.8 [902c 0q 0f], /dev/input/event0 2.8 [0c 0q 0f], /dev/mem 2.6 [0c 0q 1f], /dev/sr0 2.6 [0c 0q 0f], /dev/nvme0n1 2.6 [9290c 0q 0f], /dev/input/mice 2.5 [0c 0q 0f], /dev/loop0 2.4 [839c 0q 0f], /dev/xvda 2.4 [3110c 0q 0f], /dev/input/mouse0 2.4 [0c 0q 0f], /dev/ram0 2.3 [0c 0q 0f], /dev/ttyUSB0 2.3 [0c 0q 0f], /dev/mmcblk0 2.3 [0c 0q 0f], /dev/kvm 2.2 [4789c 0q 0f], /dev/fuse 2.1 [2927c 0q 0f], /dev/dsp 2.1 [416c 0q 0f], /dev/md0 2.0 [0c 0q 0f]

## Memory leak (3)

/dev/ppp 1.6 [19151c 0q 0f], /dev/uinput 1.4 [0c 54q 0f], /dev/rfcomm0 1.0 [47980c 0q 0f]

## Race condition (6)

/dev/tpm 1.4 [9377c 0q 0f], /dev/psaux 1.3 [5060c 0q 0f], /dev/agpgart 1.0 [3050c 0q 0f], /dev/btrfs-control 0.6 [7973c 0q 0f], /dev/3dfx 0.4 [7571c 0q 0f], /dev/infiniband/uverbs0 0.4 [5313c 0q 0f]

## Heisenbug (72)

/dev/fb0 2.0 [612c 0q 0f], /dev/fd0 2.0 [0c 0q 0f], /dev/net/tun 1.9 [1958c 0q 0f], /dev/nvidia0 1.8 [0c 0q 0f], /dev/dri/card0 1.8 [2172c 0q 0f], /dev/rtc 1.8 [0c 0q 0f], /dev/ttyACM0 1.8 [0c 0q 0f], /dev/lp0 1.8 [0c 0q 0f], /dev/audio 1.6 [416c 0q 0f], /dev/nvidiactl 1.6 [0c 0q 0f], /dev/rfkill 1.5 [0c 0q 0f], /dev/rtc0 1.4 [0c 0q 0f], /dev/tap0 1.4 [1958c 0q 0f], /dev/watchdog 1.4 [0c 0q 0f], /dev/mixer 1.4 [416c 0q 0f], /dev/port 1.4 [0c 0q 0f], /dev/vcs 1.3 [0c 0q 0f], /dev/input/uinput 1.3 [0c 0q 0f], /dev/dasda 1.3 [869c 0q 0f], /dev/parport0 1.3 [0c 0q 0f], /dev/nvram 1.3 [1446c 0q 0f], /dev/i2c-0 1.2 [0c 0q 0f], /dev/hwrng 1.2 [0c 0q 0f], /dev/input/js0 1.2 [0c 0q 0f], /dev/spi0 1.2 [0c 0q 0f], /dev/can0 1.1 [540c 0q 0f], /dev/hvc0 1.1 [0c 0q 0f], /dev/mergemem 1.0 [0c 0q 0f], /dev/sg0 1.0 [0c 0q 0f], /dev/mapper/control 1.0 [679c 0q 0f], /dev/nb0 1.0 [581c 0q 0f], /dev/cuse 1.0 [0c 0q 0f], /dev/autofs 1.0 [0c 0q 0f], /dev/vcsa 1.0 [0c 0q 0f], /dev/vhost-net 0.9 [0c 0q 0f], /dev/mtd0 0.9 [210c 0q 0f], /dev/hpet 0.9 [685c 0q 0f], /dev/apm_bios 0.9 [314c 0q 0f], /dev/loop-control 0.9 [0c 0q 0f], /dev/crash 0.9 [0c 0q 0f], /dev/vmmon 0.9 [0c 0q 0f], /dev/nnpfs0 0.8 [0c 0q 0f], /dev/st0 0.8 [0c 0q 0f], /dev/cpu/microcode 0.8 [0c 0q 0f], /dev/uhid 0.8 [0c 0q 0f], /dev/nst0 0.8 [0c 0q 0f], /dev/mcelog 0.8 [616c 0q 0f], /dev/sexec 0.7 [0c 0q 0f], /dev/vfio/vfio 0.7 [0c 0q 0f], /dev/cpu/0/cpuid 0.7 [0c 0q 0f], /dev/systrace 0.7 [75c 0q 0f], /dev/ttyprintk 0.6 [0c 0q 0f], /dev/snapshot 0.6 [0c 0q 0f], /dev/ussp_ctl 0.6 [0c 0q 0f], /dev/drbd0 0.6 [0c 0q 0f], /dev/cciss/c0d0 0.6 [0c 0q 0f], /dev/vhost-vsock 0.6 [0c 0q 0f], /dev/userfaultfd 0.6 [0c 0q 0f], /dev/shmiq 0.5 [0c 0q 0f], /dev/cpu/0/msr 0.5 [0c 0q 0f] ...

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
