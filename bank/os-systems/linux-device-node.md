# Name a Linux device node
id: linux-device-node · domain: os-systems · status: approved
> Any path under /dev that the Linux kernel or a driver creates as a character or block device node, such as the names documented in the kernel or devices.txt.

## Off-by-one
- /dev/null | null (auto)

## Works on my machine
- /dev/ptmx | ptmx
  note: The pseudo-terminal multiplexer: each open hands out a fresh pty pair.
- /dev/kmem
  note: Kernel virtual memory as a file, finally removed from Linux in 5.13.
- /dev/full
  note: Every write fails with ENOSPC, for testing how programs handle a full disk.
- /dev/kmsg
  note: The kernel log buffer: reads follow printk records, writes inject new ones.

## Null pointer exception
- /dev/sda | /dev/sdb | /dev/sdc | sda | sdb (auto)
- /dev/console | console (auto)
- /dev/ttyS0 | ttyS0 (auto)
- /dev/ttyUSB0 | /dev/ttyUSB1 | ttyUSB0 (auto)
- /dev/hda | /dev/hdb | /dev/hdc | hda (auto)
- /dev/loop0 | /dev/loop1 | loop0 (auto)
- /dev/mem (auto)
- /dev/pts/0 | /dev/pts/1 | pts/0 (auto)
- /dev/sr0 | /dev/sr1 | sr0 (auto)
- /dev/input/mice | input/mice (auto)
- /dev/tty0 | /dev/tty1 | tty1 (auto)
- /dev/nvme0n1 | nvme0n1 (auto)
- /dev/vda | vda (auto)
- /dev/zero | zero (auto)
- /dev/random | random (auto)
- /dev/urandom | urandom (auto)
- /dev/tty (auto)
- /dev/kvm (auto)
- /dev/fuse (auto)
- /dev/mmcblk0 | /dev/mmcblk0p1 | /dev/mmcblk1 | mmcblk0 (auto)
- /dev/video0 | /dev/video63 | video0 (auto)
- /dev/input/event0 | /dev/input/event1 (auto)
- /dev/dsp | /dev/dsp1 (auto)
- /dev/md0 | /dev/md1 (auto)
- /dev/ram0 | /dev/ram1 (auto)
- /dev/xvda | /dev/xvdb | /dev/xvdc (auto)
- /dev/input/mouse0 | /dev/input/mouse1 (auto)

## Memory leak
- /dev/ppp (auto)
- /dev/rfcomm0 | /dev/rfcomm1 (auto)

## Race condition
- /dev/btrfs-control (auto)
- /dev/infiniband/uverbs0 | /dev/infiniband/uverbs1 (auto)
- /dev/agpgart (auto)
- /dev/uinput | uinput (auto)
- /dev/tpm (auto)
- /dev/psaux (auto)
- /dev/3dfx (auto)

## Heisenbug
- /dev/crash (auto)
- /dev/oldmem (auto)
- /dev/userio (auto)
- /dev/userdma (auto)
- /dev/usb/legousbtower0 | /dev/usb/legousbtower15 (auto)
- /dev/dasda | /dev/dasdb (auto)
- /dev/cciss/c0d0 | /dev/cciss/c0d1 (auto)
- /dev/dvb/adapter0/frontend0 (auto)
- /dev/apm_bios (auto)
- /dev/vmmon (auto)
- /dev/systrace (auto)
- /dev/sexec (auto)
- /dev/zkshim (auto)
- /dev/kchuid (auto)
- /dev/kmview (auto)
- /dev/shmiq (auto)
- /dev/mergemem (auto)
- /dev/nnpfs0 (auto)
- /dev/intermezzo0 (auto)
- /dev/ipath_diag (auto)
- /dev/bus/vme/ctl (auto)
- /dev/ussp_ctl (auto)
- /dev/userfaultfd (auto)
- /dev/fb0 | /dev/fb1 | fb0 (auto)
- /dev/fd0 | /dev/fd1 | fd0 (auto)
- /dev/ttyACM0 | /dev/ttyACM1 | ttyACM0 (auto)
- /dev/rtc0 | rtc0 (auto)
- /dev/lp0 | /dev/lp1 (auto)
- /dev/net/tun | net/tun (auto)
- /dev/mapper/control (auto)
- /dev/dri/card0 | /dev/dri/card1 | card0 (auto)
- /dev/i2c-0 | /dev/i2c-1 (auto)
- /dev/watchdog (auto)
- /dev/rtc (auto)
- /dev/nvidiactl (auto)
- /dev/hwrng (auto)
- /dev/input/uinput (auto)
- /dev/rfkill (auto)
- /dev/parport0 | /dev/parport1 (auto)
- /dev/input/js0 | /dev/input/js1 (auto)
- /dev/mixer | /dev/mixer1 (auto)
- /dev/audio | /dev/audio1 (auto)
- /dev/nvidia0 | /dev/nvidia1 (auto)
- /dev/vhost-net (auto)
- /dev/vhost-vsock (auto)
- /dev/vfio/vfio (auto)
- /dev/loop-control (auto)
- /dev/cuse (auto)
- /dev/hpet (auto)
- /dev/mcelog (auto)
- /dev/snapshot (auto)
- /dev/drbd0 | /dev/drbd1 (auto)
- /dev/cpu/0/msr | /dev/cpu/1/msr (auto)
- /dev/cpu/microcode (auto)
- /dev/hvc0 | /dev/hvc1 (auto)
- /dev/ttyprintk (auto)
- /dev/autofs (auto)
- /dev/uhid (auto)
- /dev/port (auto)
- /dev/nvram (auto)
- /dev/sg0 | /dev/sg1 (auto)
- /dev/st0 | /dev/st1 (auto)
- /dev/nst0 | /dev/nst1 (auto)
- /dev/nb0 | /dev/nb1 (auto)
- /dev/mtd0 | /dev/mtd15 (auto)
- /dev/cpu/0/cpuid | /dev/cpu/1/cpuid (auto)
- /dev/vcs | /dev/vcs1 (auto)
- /dev/vcsa | /dev/vcsa1 (auto)
- /dev/tap0 | /dev/tap15 (auto)
- /dev/can0 | /dev/can1 (auto)
- /dev/spi0 | /dev/spi1 (auto)
- /dev/perfctr (auto)

## Bit Flip
- /dev/scanners/cuecat
  note: devices.txt's misc minor 206, reserved for the CueCat, a free barcode wand from 2000.
