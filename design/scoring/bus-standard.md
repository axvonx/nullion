# Scoring: bus-standard (Name a computer bus or peripheral interface standard)

79 answers (Bit Flip and Works on my machine left out); 4 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 4 (5%) | 4 | 0 |
| npe | 21 (27%) | 21 | 0 |
| leak | 12 (15%) | 10 | 0 |
| race | 4 (5%) | 4 | 0 |
| heisenbug | 38 (48%) | 40 | 0 |

Same tier as today: 73/79 (92%).

## Off-by-one (4)

USB 6.5 [33118c 19419q 1f], HDMI 5.0 [27686c 2757q 0f], Lightning 5.0* [11386c 222q 0f], VGA 4.4 [6895c 1135q 0f]

## Null pointer exception (21)

PCIe 4.3 [25520c 1441q 0f], SATA 4.2 [13945c 2311q 0f], PCI 4.1 [0c 1073q 0f], PS/2 4.0* [5060c 116q 0f], Thunderbolt 3.7 [16100c 272q 2f], ATA 3.6 [4673c 11296q 3f], DisplayPort 3.5 [22502c 645q 0f], FireWire 3.4 [0c 184q 0f], NVMe 3.2 [9290c 778q 1f], RS-232 3.1 [10829c 12005q 0f], SCSI 3.0 [4418c 625q 0f], HD Audio 3.0* [747c 0q 0f], I2C 2.9 [0c 1806q 1f], SPI 2.7 [12407c 1427q 1f], UART 2.6 [8203c 1949q 0f], AGP 2.4 [3050c 14q 0f], CAN bus 2.2 [18838c 1235q 1f], SAS 2.2 [4231c 16595q 0f], ISA 2.1 [2478c 764q 0f], PCMCIA 2.1 [2043c 28q 0f], InfiniBand 2.0 [5313c 319q 0f]

## Memory leak (12)

AHCI 1.8 [944c 178q 0f], RS-485 1.6 [11990c 338q 0f], MMC 1.6 [3618c 310q 2f], SDIO 1.5 [21625c 7q 1f], Virtio 1.5 [0c 131q 0f], LPC 1.4 [677c 191q 0f], SMBus 1.4 [1287c 87q 0f], UFS 1.2 [4569c 63q 0f], I2S 1.2 [0c 53q 0f], ADB 1.1 [1089c 7868q 0f], DIO 1.1 [0c 707q 2f], GPIB 0.8 [0c 122q 0f]

## Race condition (4)

Memory Stick 1.7 [3127c 28q 0f], 1-Wire 1.2 [2540c 32q 0f], AMBA 1.0 [1023c 35q 0f], MOST 0.8 [628c 7q 32f]

## Heisenbug (38)

Centronics 2.0 [2646c 0q 0f], HyperTransport 1.7 [1118c 0q 0f], CardBus 1.5 [2043c 0q 0f], MIPI 1.5 [688c 0q 0f], CXL 1.4 [2634c 0q 0f], VESA Local Bus 1.4 [1006c 0q 0f], AXI 1.3 [2118c 1q 0f], Micro Channel 1.2 [736c 15q 0f], QuickPath Interconnect 1.2 [514c 0q 0f], CEC 1.2 [2837c 0q 3f], CompactPCI 1.1 [274c 0q 0f], MIPI CSI-2 1.1 [1569c 0q 0f], EISA 1.1 [806c 0q 0f], APB 1.0 [1023c 0q 0f], AHB 0.9 [1023c 0q 0f], MII 0.9 [2914c 0q 1f], RapidIO 0.9 [200c 1q 0f], I3C 0.8 [2706c 0q 0f], PMBus 0.8 [460c 0q 0f], MCB 0.8 [0c 0q 0f], Multibus 0.8 [208c 0q 0f], VMBus 0.7 [0c 0q 0f], SSB 0.7 [0c 0q 2f], MDIO 0.6 [1117c 0q 0f], Unibus 0.6 [190c 0q 0f], HSI 0.6 [0c 0q 0f], SBus 0.6 [273c 0q 0f], SoundWire 0.6 [0c 0q 2f], Zorro 0.5 [0c 0q 2f], CDX 0.5 [0c 0q 0f], SLIMbus 0.5 [43c 0q 0f], SPMI 0.4 [136c 0q 0f], STBus 0.4 [0c 0q 0f], AVSBus 0.3 [0c 0q 0f], PECI 0.3 [141c 0q 1f], BCMA 0.3 [0c 0q 0f], IndustryPack 0.3 [0c 0q 0f], SIOX 0.0* [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
