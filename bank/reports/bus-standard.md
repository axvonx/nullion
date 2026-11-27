# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: bus, interface.

## bus-standard

65 candidates; 15 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| USB | 673 | 39 | 45 | 0.98 | off-by-one | counts | off-by-one | — |
| AXI ⚠ counts said off-by-one | 32 | 41 | 164 | 0.91 | leak | judge (override) | leak | — |
| MOST ⚠ counts said off-by-one | 234 | 15 | 3101 | 0.88 | heisenbug | judge (override) | heisenbug | — |
| PCI | 701 | 37 | 15 | 0.88 | npe | counts | off-by-one | — |
| SPI | 162 | 25 | 31 | 0.87 | npe | counts | npe | — |
| PCIe | 131 | 15 | 53 | 0.86 | npe | counts | off-by-one | — |
| I2C | 450 | 24 | 18 | 0.85 | npe | counts | npe | — |
| ISA | 44 | 8 | 34 | 0.72 | npe | counts | npe | — |
| AMBA | 14 | 22 | 7 | 0.64 | npe | counts | leak | — |
| AHB ⚠ counts said npe | 8 | 17 | 6 | 0.58 | race | judge (override) | race | — |
| NVMe | 8 | 5 | 17 | 0.56 | leak | counts | npe | — |
| SCSI ⚠ counts said leak | 143 | 9 | 3 | 0.55 | off-by-one | judge (override) | off-by-one | — |
| CXL | 128 | 0 | 35 | 0.52 | leak | counts | leak | — |
| InfiniBand | 10 | 2 | 17 | 0.49 | leak | counts | leak | — |
| HSI ⚠ counts said leak | 10 | 2 | 16 | 0.48 | heisenbug | judge (override) | heisenbug | — |
| 1-Wire | 14 | 5 | 5 | 0.47 | leak | counts | leak | — |
| HDMI ⚠ counts said leak | 25 | 2 | 5 | 0.41 | off-by-one | judge (override) | off-by-one | — |
| ATA | 22 | 3 | 3 | 0.39 | leak | counts | npe | — |
| UART | 23 | 0 | 17 | 0.39 | leak | counts | npe | — |
| UFS | 151 | 1 | 3 | 0.38 | leak | counts | leak | — |
| FireWire | 25 | 3 | 1 | 0.33 | leak | counts | npe | — |
| Virtio | 28 | 1 | 2 | 0.30 | race | counts | race | — |
| RS-232 | 1 | 1 | 6 | 0.29 | off-by-one | judge | off-by-one | — |
| MMC ⚠ counts said race | 33 | 4 | 0 | 0.29 | npe | judge (override) | npe | — |
| MII | 39 | 0 | 4 | 0.28 | race | counts | race | — |
| PMBus | 57 | 1 | 1 | 0.28 | race | counts | race | — |
| SBus | 0 | 2 | 3 | 0.26 | race | judge | race | — |
| MCB | 12 | 0 | 4 | 0.25 | race | counts | heisenbug | — |
| GPIB | 1 | 3 | 1 | 0.24 | leak | judge | leak | — |
| RapidIO | 36 | 2 | 0 | 0.24 | race | counts | race | — |
| CEC | 25 | 0 | 2 | 0.22 | heisenbug | counts | race | — |
| LPC | 6 | 3 | 0 | 0.22 | race | judge | race | — |
| SMBus ⚠ counts said heisenbug | 56 | 0 | 1 | 0.20 | leak | judge (override) | leak | — |
| I3C | 41 | 1 | 0 | 0.20 | heisenbug | counts | race | — |
| SSB | 0 | 0 | 6 | 0.20 | heisenbug | judge | heisenbug | — |
| AGP | 7 | 0 | 2 | 0.18 | npe | judge | npe | — |
| SDIO ⚠ counts said heisenbug | 13 | 1 | 0 | 0.16 | leak | judge (override) | leak | — |
| SIOX | 11 | 1 | 0 | 0.16 | heisenbug | counts | heisenbug | — |
| ADB | 3 | 0 | 2 | 0.16 | race | judge | race | — |
| PCMCIA ⚠ counts said heisenbug | 10 | 1 | 0 | 0.15 | leak | judge (override) | leak | — |
| Multibus | 0 | 3 | 0 | 0.15 | heisenbug | judge | heisenbug | — |
| MDIO | 74 | 0 | 0 | 0.14 | heisenbug | counts | race | — |
| Thunderbolt ⚠ counts said heisenbug | 57 | 0 | 0 | 0.13 | off-by-one | judge (override) | off-by-one | — |
| VMBus | 43 | 0 | 0 | 0.12 | heisenbug | counts | race | — |
| VMEbus | 0 | 2 | 0 | 0.12 | womm | pin | race | — |
| SoundWire | 37 | 0 | 0 | 0.12 | heisenbug | counts | heisenbug | — |
| STBus | 2 | 0 | 1 | 0.11 | heisenbug | judge | heisenbug | — |
| MIPI CSI-2 | 23 | 0 | 0 | 0.10 | heisenbug | counts | race | — |
| EISA ⚠ counts said heisenbug | 21 | 0 | 0 | 0.10 | leak | judge (override) | leak | — |
| IPMB | 17 | 0 | 0 | 0.09 | bitflip | pin | heisenbug | — |
| CDX | 16 | 0 | 0 | 0.09 | heisenbug | counts | heisenbug | — |
| PECI | 13 | 0 | 0 | 0.09 | heisenbug | counts | heisenbug | — |
| SLIMbus | 10 | 0 | 0 | 0.08 | heisenbug | counts | heisenbug | — |
| Zorro | 9 | 0 | 0 | 0.08 | heisenbug | judge | heisenbug | — |
| BCMA | 6 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| AVSBus | 5 | 0 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| HD Audio | 5 | 0 | 0 | 0.06 | leak | judge | leak | — |
| CardBus | 3 | 0 | 0 | 0.05 | leak | judge | leak | — |
| AHCI | 2 | 0 | 0 | 0.04 | leak | judge | leak | — |
| SPMI | 1 | 0 | 0 | 0.02 | heisenbug | judge | heisenbug | — |
| Greybus | 0 | 0 | 0 | 0.00 | womm | pin | heisenbug | — |
| IndustryPack ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NuBus | 0 | 0 | 0 | 0.00 | womm | pin | race | — |
| DIO ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| Memory Stick ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): EISA (counts said heisenbug, now leak), PCMCIA (counts said heisenbug, now leak), SCSI (counts said leak, now off-by-one), SDIO (counts said heisenbug, now leak), SMBus (counts said heisenbug, now leak), MMC (counts said race, now npe), MOST (counts said off-by-one, now heisenbug), Thunderbolt (counts said heisenbug, now off-by-one), HDMI (counts said leak, now off-by-one), AXI (counts said off-by-one, now leak), AHB (counts said npe, now race), HSI (counts said leak, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

18/20 sampled answers are members (90%); 17/20 also have an acceptable tier. Not members: InfiniBand (InfiniBand is a real standard but a switched network fabric for servers and HPC, not a system, expansion or peripheral bus. It is neighbouring-domain networking, so it does not meet the category.), AVSBus (I cannot confirm this is a real, named bus standard. It may be a voltage-scaling control interface, but the strict rule says to reject when unsure it exists.).

## Pipeline report

Generated 2026-11-27 22:55 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/bus-standard.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (IPMB; VMEbus, NuBus, Greybus): the owner vets them
- scripts/bank/obvious-draft/bus-standard.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 42/42 obvious answers accepted |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | PASS | 67/83 answers have a verified link (81%); prompt link yes |
| precision | PASS | 18/20 sampled answers are members (90%), 17/20 with acceptable tier |
| answer count | PASS | 83 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 3 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 6 | 6 |
| Works on my machine | 3 | 0 |
| Null pointer exception | 25 | 25 |
| Memory leak | 17 | 17 |
| Race condition | 10 | 10 |
| Heisenbug | 21 | 21 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 0.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## bus-standard
_Name a computer bus or peripheral interface standard_

Works on my machine:
- [ ] VMEbus
- [ ] NuBus
- [ ] AGP
- [ ] Zorro
- [ ] GPIB
- [ ] Greybus
- [ ] other: 

Bit Flip:
- [ ] Greybus
- [ ] IPMB
- [ ] DIO
- [ ] SIOX
- [ ] SLIMbus
- [ ] STBus
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 10 |
| harvest | done | 4 |
| filter | done | 64 |
| compare | done | 0 |
| escalate | done | 28 |
| merge | done | 8 |
| obvious | done | 24 |
| dupes | done | 0 |
| links | done | 26 |
| precision | done | 29 |
| report | running |  |
