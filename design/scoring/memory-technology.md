# Scoring: memory-technology (Name a computer memory technology)

39 answers (Bit Flip and Works on my machine left out); 10 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 8 (21%) | 8 | 0 |
| npe | 21 (54%) | 21 | 0 |
| leak | 2 (5%) | 2 | 0 |
| race | 4 (10%) | 4 | 0 |
| heisenbug | 4 (10%) | 4 | 0 |

Same tier as today: 39/39 (100%).

## Off-by-one (8)

RAM 6.7 [21291c 0q 0f 0s], read-only memory 5.3 [8343c 0q 0f 0s], flash memory 5.3 [0c 517q 1f 0s], DRAM 5.2 [13588c 0q 0f 0s], hard disk drive 5.0* [17116c 20433q 0f 0s], DDR5 5.0* [15395c 0q 0f 0s], DDR 4.9 [8992c 0q 0f 0s], cache memory 4.8 [6784c 1110q 0f 0s]

## Null pointer exception (21)

DDR4 4.3 [11384c 0q 0f 0s], SDRAM 4.2 [4465c 29q 0f 0s], VRAM 4.1 [0c 87q 0f 0s], solid-state drive 4.0* [16599c 6753q 0f 0s], SRAM 3.4 [6127c 0q 0f 0s], floppy disk 3.0* [27043c 140q 3f 0s], ECC memory 2.8 [3812c 0q 0f 0s], EEPROM 2.7 [4539c 354q 0f 0s], EPROM 2.6 [2768c 0q 0f 0s], magnetic tape 2.5 [4200c 90q 1f 0s], PROM 2.5 [0c 0q 0f 0s], NVRAM 2.5 [1446c 5q 0f 0s], GDDR 2.4 [1510c 0q 0f 0s], LPDDR 2.3 [7277c 0q 0f 0s], serial flash 2.0 [0c 0q 0f 0s], NOR flash 2.0 [0c 0q 0f 0s], DVD 2.0* [25768c 0q 0f 0s], SD card 2.0* [21625c 2715q 0f 0s], USB flash drive 2.0* [11495c 3759q 0f 0s], CD-ROM 2.0* [7696c 730q 0f 0s], NAND flash 2.0* [0c 0q 0f 0s]

## Memory leak (2)

High Bandwidth Memory 1.8 [13416c 0q 0f 0s], CompactFlash 1.0* [3555c 53q 0f 0s]

## Race condition (4)

3D XPoint 1.4 [1963c 26q 0f 0s], MRAM 1.3 [1843c 0q 0f 0s], FRAM 1.0 [1850c 0q 1f 0s], ReRAM 0.9 [1577c 0q 1f 0s]

## Heisenbug (4)

OTP memory 1.8 [0c 0q 0f 0s], phase-change memory 1.2 [680c 0q 1f 0s], bubble memory 1.0 [1425c 0q 0f 0s], drum memory 0.9 [1289c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
