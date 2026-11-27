# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: file system, filesystem, file systems, filesystems.

## filesystem

99 candidates; 35 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| NFS | 85 | 25 | 15 | 1.00 | off-by-one | counts | off-by-one | — |
| ext4 | 107 | 13 | 21 | 0.97 | off-by-one | counts | off-by-one | — |
| Ceph | 9 | 16 | 13 | 0.88 | off-by-one | counts | npe | — |
| Lustre ⚠ counts said npe | 3 | 33 | 33 | 0.86 | race | judge (override) | race | — |
| XFS | 109 | 7 | 8 | 0.81 | npe | counts | leak | — |
| ext2 | 39 | 5 | 4 | 0.65 | npe | counts | npe | — |
| NTFS | 10 | 8 | 4 | 0.65 | npe | counts | off-by-one | — |
| F2FS ⚠ counts said npe | 37 | 3 | 6 | 0.64 | race | judge (override) | race | — |
| AFS | 10 | 4 | 6 | 0.62 | npe | counts | leak | — |
| Btrfs | 17 | 5 | 4 | 0.61 | npe | counts | npe | — |
| ext3 | 30 | 5 | 2 | 0.57 | npe | counts | npe | — |
| Coda | 19 | 9 | 1 | 0.56 | leak | counts | race | — |
| ZFS | 0 | 5 | 6 | 0.53 | npe | judge | npe | — |
| exFAT | 5 | 4 | 2 | 0.47 | npe | judge | npe | — |
| UBIFS ⚠ counts said leak | 25 | 1 | 3 | 0.44 | heisenbug | judge (override) | heisenbug | — |
| ReFS | 32 | 6 | 0 | 0.43 | leak | counts | leak | — |
| JFS ⚠ counts said leak | 12 | 3 | 1 | 0.41 | heisenbug | judge (override) | heisenbug | — |
| WAFL | 0 | 8 | 1 | 0.41 | heisenbug | judge | heisenbug | — |
| FAT32 | 0 | 3 | 3 | 0.40 | off-by-one | judge | off-by-one | — |
| SquashFS | 9 | 0 | 5 | 0.36 | leak | judge | leak | — |
| HFS+ | 14 | 4 | 0 | 0.35 | leak | counts | leak | — |
| tmpfs | 21 | 0 | 3 | 0.34 | leak | counts | npe | — |
| HFS | 10 | 4 | 0 | 0.33 | leak | counts | npe | — |
| GlusterFS | 0 | 2 | 2 | 0.31 | race | judge | race | — |
| tracefs | 10 | 1 | 1 | 0.31 | race | counts | leak | — |
| JFFS2 | 8 | 0 | 3 | 0.30 | race | judge | race | — |
| GPFS | 1 | 2 | 1 | 0.29 | race | judge | race | — |
| CIFS ⚠ counts said race | 27 | 0 | 1 | 0.25 | npe | judge (override) | npe | — |
| OCFS2 | 17 | 0 | 1 | 0.23 | race | counts | heisenbug | — |
| ISO 9660 | 4 | 2 | 0 | 0.23 | npe | judge | npe | — |
| OverlayFS ⚠ counts said race | 14 | 0 | 1 | 0.22 | npe | judge (override) | npe | — |
| ramfs ⚠ counts said heisenbug | 13 | 0 | 1 | 0.22 | leak | judge (override) | leak | — |
| eCryptfs | 10 | 1 | 0 | 0.21 | heisenbug | counts | race | — |
| OrangeFS | 8 | 0 | 1 | 0.20 | heisenbug | judge | heisenbug | — |
| EROFS | 8 | 1 | 0 | 0.20 | race | judge | race | — |
| EFS | 1 | 0 | 2 | 0.19 | heisenbug | judge | heisenbug | — |
| MFS | 1 | 2 | 0 | 0.19 | heisenbug | judge | heisenbug | — |
| sysfs ⚠ counts said heisenbug | 47 | 0 | 0 | 0.17 | npe | judge (override) | npe | — |
| UFS | 4 | 1 | 0 | 0.17 | leak | judge | leak | — |
| debugfs ⚠ counts said heisenbug | 36 | 0 | 0 | 0.16 | leak | judge (override) | leak | — |
| autofs ⚠ counts said heisenbug | 36 | 0 | 0 | 0.16 | leak | judge (override) | leak | — |
| HPFS | 2 | 0 | 1 | 0.15 | heisenbug | judge | heisenbug | — |
| ADFS | 2 | 0 | 1 | 0.15 | heisenbug | judge | heisenbug | — |
| devfs | 2 | 1 | 0 | 0.15 | leak | judge | leak | — |
| configfs | 21 | 0 | 0 | 0.14 | heisenbug | counts | heisenbug | — |
| ReiserFS | 1 | 0 | 1 | 0.13 | womm | pin | — | — |
| ntfs3 | 1 | 1 | 0 | 0.13 | heisenbug | judge | heisenbug | — |
| GFS2 | 12 | 0 | 0 | 0.12 | heisenbug | counts | race | — |
| resctrl | 11 | 0 | 0 | 0.11 | heisenbug | counts | heisenbug | — |
| hugetlbfs ⚠ counts said heisenbug | 11 | 0 | 0 | 0.11 | leak | judge (override) | leak | — |
| devpts | 9 | 0 | 0 | 0.10 | leak | judge | leak | — |
| virtiofs | 9 | 0 | 0 | 0.10 | race | judge | race | — |
| dcfs | 0 | 0 | 1 | 0.10 | heisenbug | judge | heisenbug | — |
| 9P | 8 | 0 | 0 | 0.10 | heisenbug | judge | heisenbug | — |
| ctfs | 0 | 1 | 0 | 0.10 | heisenbug | judge | heisenbug | — |
| APFS | 0 | 1 | 0 | 0.10 | npe | judge | npe | — |
| procfs | 7 | 0 | 0 | 0.09 | npe | judge | npe | — |
| NILFS2 | 7 | 0 | 0 | 0.09 | heisenbug | judge | heisenbug | — |
| cramfs | 6 | 0 | 0 | 0.09 | race | judge | race | — |
| ROMFS | 6 | 0 | 0 | 0.09 | heisenbug | judge | heisenbug | — |
| hostfs | 6 | 0 | 0 | 0.09 | heisenbug | judge | heisenbug | — |
| efivarfs | 5 | 0 | 0 | 0.08 | heisenbug | judge | heisenbug | — |
| pstore | 5 | 0 | 0 | 0.08 | heisenbug | judge | heisenbug | — |
| AFFS | 4 | 0 | 0 | 0.07 | heisenbug | judge | heisenbug | — |
| spufs | 4 | 0 | 0 | 0.07 | bitflip | pin | — | — |
| zonefs | 4 | 0 | 0 | 0.07 | heisenbug | judge | heisenbug | — |
| UDF | 3 | 0 | 0 | 0.06 | leak | judge | leak | — |
| BeFS | 3 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| OMFS | 2 | 0 | 0 | 0.05 | heisenbug | judge | heisenbug | — |
| QNX6 | 2 | 0 | 0 | 0.05 | heisenbug | judge | heisenbug | — |
| nullfs | 2 | 0 | 0 | 0.05 | heisenbug | judge | heisenbug | — |
| dlmfs | 1 | 0 | 0 | 0.03 | heisenbug | judge | heisenbug | — |
| Minix FS | 1 | 0 | 0 | 0.03 | race | judge | race | — |
| QNX4 | 1 | 0 | 0 | 0.03 | heisenbug | judge | heisenbug | — |
| sockfs | 1 | 0 | 0 | 0.03 | heisenbug | judge | heisenbug | — |
| OpenPROM FS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| vboxsf ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| fdescfs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| tarfs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| unionfs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mntfs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ptyfs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| SysV BFS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| V7FS ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| HAMMER ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| HAMMER2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| doorfs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| lofs ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| namefs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| objfs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| portfs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| sharefs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| bindfs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| CDDA ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| packagefs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| websearchfs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Fossil ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| tapefs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| bcachefs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): CIFS (counts said race, now npe), debugfs (counts said heisenbug, now leak), F2FS (counts said npe, now race), OverlayFS (counts said race, now npe), ramfs (counts said heisenbug, now leak), sysfs (counts said heisenbug, now npe), UBIFS (counts said leak, now heisenbug), autofs (counts said heisenbug, now leak), hugetlbfs (counts said heisenbug, now leak), JFS (counts said leak, now heisenbug), Lustre (counts said npe, now race)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none

