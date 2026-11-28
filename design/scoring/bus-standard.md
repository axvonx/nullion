# Scoring: bus-standard (Name a computer bus or peripheral interface standard)

79 answers (Bit Flip and Works on my machine left out); 4 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 4 (5%) | 4 | 0 |
| npe | 21 (27%) | 21 | 0 |
| leak | 12 (15%) | 6 | 0 |
| race | 10 (13%) | 11 | 0 |
| heisenbug | 32 (41%) | 37 | 0 |

Same tier as today: 72/79 (91%).

## Off-by-one (4)

USB 6.5 [33118c 19419q 0f 0s], HDMI 5.0 [27686c 2757q 0f 0s], Lightning 5.0* [11386c 0q 0f 0s], VGA 4.4 [6895c 1135q 0f 0s]

## Null pointer exception (21)

PCIe 4.3 [25520c 1441q 0f 0s], SATA 4.2 [13945c 2311q 0f 0s], PCI 4.1 [0c 1073q 0f 0s], PS/2 4.0* [5060c 116q 0f 0s], Thunderbolt 3.7 [16100c 0q 2f 0s], ATA 3.6 [4673c 100q 0f 0s], DisplayPort 3.5 [22502c 645q 0f 0s], FireWire 3.4 [0c 184q 0f 0s], NVMe 3.2 [9290c 778q 1f 1901s], RS-232 3.1 [10829c 12005q 0f 0s], SCSI 3.0 [4418c 625q 0f 0s], HD Audio 3.0* [747c 0q 0f 0s], I2C 2.9 [0c 1806q 0f 0s], SPI 2.7 [12407c 1427q 0f 0s], UART 2.6 [8203c 1949q 0f 0s], AGP 2.4 [3050c 14q 0f 0s], CAN bus 2.2 [18838c 1235q 0f 0s], SAS 2.2 [4231c 16595q 0f 0s], ISA 2.1 [2478c 764q 0f 0s], PCMCIA 2.1 [0c 28q 0f 0s], InfiniBand 2.0 [5313c 319q 0f 0s]

## Memory leak (12)

AHCI 1.8 [944c 178q 0f 0s], RS-485 1.6 [11990c 338q 0f 0s], MMC 1.6 [3618c 310q 0f 0s], Virtio 1.5 [0c 131q 0f 0s], LPC 1.4 [677c 191q 0f 0s], SMBus 1.4 [1287c 87q 0f 0s], 1-Wire 1.2 [2540c 32q 0f 0s], UFS 1.2 [4569c 63q 0f 0s], I2S 1.2 [0c 53q 0f 0s], ADB 1.1 [1089c 7868q 0f 0s], DIO 1.1 [0c 707q 0f 0s], GPIB 0.8 [0c 122q 0f 0s]

## Race condition (10)

Centronics 2.0 [2646c 0q 0f 0s], Memory Stick 1.7 [3127c 28q 0f 0s], CXL 1.4 [2634c 0q 0f 0s], AXI 1.3 [2118c 1q 0f 0s], Micro Channel 1.2 [736c 15q 0f 0s], CEC 1.2 [2837c 0q 0f 0s], MIPI CSI-2 1.1 [1569c 0q 0f 0s], MII 0.9 [2914c 0q 0f 0s], I3C 0.8 [2706c 0q 0f 0s], MOST 0.8 [628c 0q 32f 0s]

## Heisenbug (32)

HyperTransport 1.7 [1118c 0q 0f 0s], CardBus 1.5 [0c 0q 0f 0s], SDIO 1.5 [0c 7q 1f 0s], MIPI 1.5 [688c 0q 0f 0s], VESA Local Bus 1.4 [1006c 0q 0f 0s], QuickPath Interconnect 1.2 [514c 0q 0f 0s], CompactPCI 1.1 [274c 0q 0f 0s], EISA 1.1 [806c 0q 0f 0s], APB 1.0 [0c 0q 0f 0s], AMBA 1.0 [0c 0q 0f 0s], AHB 0.9 [0c 0q 0f 0s], RapidIO 0.9 [200c 1q 0f 0s], PMBus 0.8 [460c 0q 0f 0s], MCB 0.8 [0c 0q 0f 0s], Multibus 0.8 [208c 0q 0f 0s], VMBus 0.7 [0c 0q 0f 0s], SSB 0.7 [0c 0q 0f 0s], MDIO 0.6 [1117c 0q 0f 0s], Unibus 0.6 [190c 0q 0f 0s], HSI 0.6 [0c 0q 0f 0s], SBus 0.6 [273c 0q 0f 0s], SoundWire 0.6 [0c 0q 2f 0s], Zorro 0.5 [0c 0q 2f 0s], CDX 0.5 [0c 0q 0f 0s], SLIMbus 0.5 [43c 0q 0f 0s], SPMI 0.4 [136c 0q 0f 0s], STBus 0.4 [0c 0q 0f 0s], AVSBus 0.3 [0c 0q 0f 0s], PECI 0.3 [141c 0q 1f 0s], BCMA 0.3 [0c 0q 0f 0s], IndustryPack 0.3 [0c 0q 0f 0s], SIOX 0.0* [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
