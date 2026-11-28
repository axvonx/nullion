# Scoring: filesystem (Name a filesystem)

99 answers (Bit Flip and Works on my machine left out); 2 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (1%) | 3 | 0 |
| npe | 23 (23%) | 17 | 0 |
| leak | 13 (13%) | 15 | 0 |
| race | 4 (4%) | 12 | 0 |
| heisenbug | 58 (59%) | 52 | 0 |

Same tier as today: 66/99 (67%).

## Off-by-one (1)

NTFS 4.7 [6748c 4188q 0f]

## Null pointer exception (23)

FAT32 4.4 [8907c 676q 0f], ext4 4.0 [5414c 2290q 0f], NFS 3.5 [4757c 5098q 1f], FAT16 3.3 [8907c 62q 0f], ext3 3.3 [909c 691q 0f], ext2 3.0 [1090c 241q 0f], exFAT 3.0 [6042c 252q 0f], XFS 3.0 [3007c 330q 16f], ZFS 2.8 [7082c 911q 24f], procfs 2.8 [662c 1688q 0f], APFS 2.7 [3430c 112q 0f], CIFS 2.5 [7453c 2550q 1f], tmpfs 2.5 [846c 421q 0f], ISO 9660 2.5 [3270c 36q 0f], Btrfs 2.4 [7973c 1540q 0f], Ceph 2.3 [2890c 826q 17f], HFS 2.2 [527c 103q 2f], UFS 2.1 [1199c 72q 2f], sysfs 2.1 [438c 409q 0f], EFS 2.1 [0c 211q 0f], OverlayFS 2.0 [1403c 177q 0f], HFS+ 2.0 [1586c 252q 2f], devfs 2.0 [0c 0q 0f]

## Memory leak (13)

GlusterFS 1.9 [483c 631q 17f], ReFS 1.9 [5203c 231q 1f], Minix FS 1.8 [308c 269q 0f], SquashFS 1.8 [1665c 155q 0f], UDF 1.7 [1558c 5026q 0f], unionfs 1.6 [470c 53q 21f], autofs 1.5 [0c 303q 24f], eCryptfs 1.4 [251c 241q 0f], Coda 1.0 [118c 237q 0f], bindfs 0.9 [0c 0q 19f], ADFS 0.8 [107c 2454q 0f], Fossil 0.8 [198c 140q 37f], BeFS 0.7 [338c 2237q 22f]

## Race condition (4)

Lustre 1.6 [1390c 80q 4f], cramfs 1.1 [318c 0q 10f], UBIFS 1.0 [487c 83q 0f], OCFS2 0.6 [197c 65q 0f]

## Heisenbug (58)

JFS 1.9 [594c 30q 0f], ramfs 1.8 [0c 0q 1f], HAMMER 1.7 [0c 27q 2f], MFS 1.6 [0c 0q 2f], ROMFS 1.6 [153c 0q 0f], devpts 1.5 [0c 0q 0f], AFS 1.5 [797c 33q 0f], WAFL 1.5 [230c 0q 0f], CephFS 1.4 [0c 49q 0f], ptyfs 1.4 [0c 0q 0f], F2FS 1.4 [1322c 28q 0f], HPFS 1.4 [695c 0q 0f], ntfs3 1.3 [0c 0q 0f], bcachefs 1.3 [1732c 5q 1f], HAMMER2 1.3 [0c 0q 2f], GFS2 1.2 [626c 26q 0f], virtiofs 1.2 [0c 1q 0f], 9P 1.1 [2171c 14q 0f], CDDA 1.1 [0c 5q 0f], GPFS 1.0 [700c 0q 0f], mntfs 1.0* [0c 0q 0f], JFFS2 1.0 [413c 34q 0f], lofs 1.0 [0c 0q 0f], QNX4 0.9 [0c 0q 0f], vboxsf 0.9 [0c 0q 0f], debugfs 0.9 [146c 37q 1f], QNX6 0.9 [0c 0q 0f], EROFS 0.9 [864c 0q 0f], sharefs 0.9 [0c 0q 0f], tarfs 0.9 [0c 0q 0f], nullfs 0.9 [0c 0q 1f], hugetlbfs 0.8 [0c 0q 0f], namefs 0.8 [0c 0q 0f], tracefs 0.7 [0c 0q 0f], configfs 0.7 [0c 0q 0f], efivarfs 0.7 [0c 2q 0f], resctrl 0.7 [0c 0q 0f], NILFS2 0.7 [331c 0q 0f], sockfs 0.6 [0c 0q 0f], dcfs 0.6 [0c 0q 0f], pstore 0.6 [0c 0q 0f], fdescfs 0.6 [0c 0q 0f], tapefs 0.6 [0c 0q 0f], portfs 0.6 [0c 0q 0f], hostfs 0.5 [0c 0q 0f], objfs 0.5 [0c 0q 0f], packagefs 0.5 [0c 0q 0f], AFFS 0.5 [109c 0q 0f], V7FS 0.5 [0c 0q 0f], zonefs 0.5 [0c 0q 0f], OrangeFS 0.4 [103c 0q 2f], dlmfs 0.4 [0c 0q 0f], doorfs 0.4 [0c 0q 0f], SysV BFS 0.3 [85c 0q 0f], OMFS 0.2 [0c 0q 0f], websearchfs 0.2 [0c 0q 0f], OpenPROM FS 0.2 [0c 0q 0f], ctfs 0.0* [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
