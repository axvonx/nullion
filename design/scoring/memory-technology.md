# Scoring: memory-technology (Name a computer memory technology)

39 answers (Bit Flip and Works on my machine left out); 10 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 8 (21%) | 8 | 0 |
| npe | 21 (54%) | 21 | 0 |
| leak | 3 (8%) | 2 | 0 |
| race | 1 (3%) | 1 | 0 |
| heisenbug | 6 (15%) | 7 | 0 |

Same tier as today: 37/39 (95%).

## Off-by-one (8)

RAM 6.7 [21291c 11695q 1f], read-only memory 5.3 [8343c 323q 1f], flash memory 5.3 [14268c 517q 1f], DRAM 5.2 [13588c 44q 0f], hard disk drive 5.0* [17116c 20433q 0f], DDR5 5.0* [15395c 0q 0f], DDR 4.9 [8992c 105q 0f], cache memory 4.8 [6784c 1110q 0f]

## Null pointer exception (21)

DDR4 4.3 [11384c 0q 0f], SDRAM 4.2 [4465c 29q 0f], VRAM 4.1 [0c 87q 0f], solid-state drive 4.0* [16599c 8245q 0f], SRAM 3.4 [6127c 0q 0f], floppy disk 3.0* [27043c 140q 3f], ECC memory 2.8 [3812c 0q 0f], EEPROM 2.7 [4539c 354q 0f], EPROM 2.6 [2768c 0q 0f], magnetic tape 2.5 [4200c 90q 1f], PROM 2.5 [1092c 0q 0f], NVRAM 2.5 [1446c 5q 0f], GDDR 2.4 [1510c 0q 0f], LPDDR 2.3 [7277c 0q 0f], serial flash 2.0 [14268c 0q 0f], NOR flash 2.0 [14268c 29q 0f], DVD 2.0* [25768c 1485q 0f], SD card 2.0* [21625c 2715q 0f], NAND flash 2.0* [14268c 0q 0f], USB flash drive 2.0* [11495c 3759q 0f], CD-ROM 2.0* [7696c 730q 0f]

## Memory leak (3)

High Bandwidth Memory 1.8 [13416c 167q 0f], phase-change memory 1.2 [680c 812q 7f], CompactFlash 1.0* [3555c 53q 0f]

## Race condition (1)

3D XPoint 1.4 [1963c 26q 0f]

## Heisenbug (6)

OTP memory 1.8 [1092c 0q 0f], MRAM 1.3 [1843c 0q 0f], bubble memory 1.0 [1425c 0q 0f], FRAM 1.0 [1850c 0q 1f], ReRAM 0.9 [1577c 0q 1f], drum memory 0.9 [1289c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
