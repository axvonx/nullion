# Scoring: filesystem (Name a filesystem)

99 answers (Bit Flip and Works on my machine left out); 2 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 1 (1%) | 1 | 0 |
| npe | 23 (23%) | 23 | 0 |
| leak | 14 (14%) | 14 | 0 |
| race | 7 (7%) | 7 | 0 |
| heisenbug | 54 (55%) | 54 | 0 |

Same tier as today: 99/99 (100%).

## Off-by-one (1)

NTFS 4.7 [6748c 4188q 0f 0s]

## Null pointer exception (23)

FAT32 4.4 [0c 661q 0f 0s], ext4 4.0 [5414c 2290q 0f 0s], NFS 3.5 [4757c 290q 0f 0s], FAT16 3.3 [0c 62q 0f 0s], ext3 3.3 [909c 691q 0f 0s], ext2 3.0 [1090c 241q 0f 0s], exFAT 3.0 [6042c 252q 0f 0s], XFS 3.0 [3007c 0q 0f 0s], ZFS 2.8 [7082c 27q 0f 0s], procfs 2.8 [662c 1688q 0f 0s], APFS 2.7 [3430c 112q 0f 0s], CIFS 2.5 [7453c 1615q 1f 0s], tmpfs 2.5 [846c 421q 0f 0s], ISO 9660 2.5 [3270c 36q 0f 0s], Btrfs 2.4 [7973c 1540q 0f 0s], Ceph 2.3 [2890c 826q 17f 0s], HFS 2.2 [527c 0q 0f 0s], UFS 2.1 [1199c 9q 0f 0s], sysfs 2.1 [438c 409q 0f 0s], EFS 2.1 [0c 0q 0f 0s], OverlayFS 2.0 [1403c 177q 0f 0s], HFS+ 2.0 [1586c 252q 2f 0s], devfs 2.0 [0c 0q 0f 0s]

## Memory leak (14)

GlusterFS 1.9 [483c 631q 17f 5273s], ReFS 1.9 [5203c 231q 1f 0s], Minix FS 1.8 [308c 269q 0f 0s], SquashFS 1.8 [1665c 155q 0f 0s], unionfs 1.6 [470c 53q 21f 380s], Lustre 1.6 [1390c 80q 4f 0s], autofs 1.5 [0c 303q 24f 0s], eCryptfs 1.4 [251c 241q 0f 0s], CephFS 1.4 [0c 49q 0f 0s], UBIFS 1.0 [487c 83q 0f 0s], JFFS2 1.0 [413c 34q 0f 0s], debugfs 0.9 [146c 37q 1f 0s], ADFS 0.8 [107c 2454q 0f 0s], OCFS2 0.6 [197c 65q 0f 0s]

## Race condition (7)

UDF 1.7 [1558c 0q 0f 0s], F2FS 1.4 [1322c 28q 0f 0s], bcachefs 1.3 [1732c 5q 1f 0s], GFS2 1.2 [626c 26q 0f 0s], 9P 1.1 [2171c 0q 0f 0s], Fossil 0.8 [198c 0q 37f 0s], BeFS 0.7 [338c 0q 0f 1286s]

## Heisenbug (54)

JFS 1.9 [594c 0q 0f 0s], ramfs 1.8 [0c 0q 1f 15s], HAMMER 1.7 [676c 0q 2f 0s], MFS 1.6 [0c 0q 0f 0s], ROMFS 1.6 [153c 0q 0f 0s], devpts 1.5 [0c 0q 0f 0s], AFS 1.5 [797c 0q 0f 0s], WAFL 1.5 [230c 0q 0f 0s], ptyfs 1.4 [0c 0q 0f 0s], HPFS 1.4 [695c 0q 0f 0s], ntfs3 1.3 [0c 0q 0f 0s], HAMMER2 1.3 [0c 0q 2f 0s], virtiofs 1.2 [0c 1q 0f 0s], cramfs 1.1 [318c 0q 10f 47s], CDDA 1.1 [0c 5q 0f 0s], Coda 1.0 [118c 0q 0f 0s], GPFS 1.0 [700c 0q 0f 0s], mntfs 1.0* [0c 0q 0f 0s], lofs 1.0 [0c 0q 0f 0s], QNX4 0.9 [0c 0q 0f 0s], vboxsf 0.9 [0c 0q 0f 0s], QNX6 0.9 [0c 0q 0f 0s], EROFS 0.9 [864c 0q 0f 0s], sharefs 0.9 [0c 0q 0f 0s], bindfs 0.9 [0c 0q 19f 0s], tarfs 0.9 [0c 0q 0f 0s], nullfs 0.9 [0c 0q 1f 322s], hugetlbfs 0.8 [0c 0q 0f 0s], namefs 0.8 [0c 0q 0f 0s], tracefs 0.7 [0c 0q 0f 0s], configfs 0.7 [0c 0q 0f 0s], efivarfs 0.7 [0c 2q 0f 0s], resctrl 0.7 [0c 0q 0f 0s], NILFS2 0.7 [331c 0q 0f 0s], sockfs 0.6 [0c 0q 0f 0s], dcfs 0.6 [0c 0q 0f 0s], pstore 0.6 [0c 0q 0f 0s], fdescfs 0.6 [0c 0q 0f 0s], tapefs 0.6 [0c 0q 0f 0s], portfs 0.6 [0c 0q 0f 0s], hostfs 0.5 [0c 0q 0f 0s], objfs 0.5 [0c 0q 0f 0s], packagefs 0.5 [0c 0q 0f 0s], AFFS 0.5 [109c 0q 0f 0s], V7FS 0.5 [0c 0q 0f 0s], zonefs 0.5 [0c 0q 0f 0s], OrangeFS 0.4 [103c 0q 2f 0s], dlmfs 0.4 [0c 0q 0f 0s], doorfs 0.4 [0c 0q 0f 0s], SysV BFS 0.3 [85c 0q 0f 0s], OMFS 0.2 [0c 0q 0f 0s], websearchfs 0.2 [0c 0q 0f 0s], OpenPROM FS 0.2 [0c 0q 0f 0s], ctfs 0.0* [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
