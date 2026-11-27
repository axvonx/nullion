# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: network, protocol.

## network-protocol

140 candidates; 32 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| IP | 191 | 4536 | 1691 | 1.00 | off-by-one | counts | off-by-one | — |
| TCP | 117 | 2529 | 910 | 0.97 | off-by-one | counts | off-by-one | — |
| FIX ⚠ counts said off-by-one | 27 | 2097 | 13985 | 0.93 | leak | judge (override) | leak | — |
| HTTP | 113 | 357 | 22258 | 0.90 | off-by-one | counts | off-by-one | — |
| Ethernet | 141 | 955 | 366 | 0.87 | npe | counts | off-by-one | — |
| IPv6 | 47 | 1236 | 252 | 0.82 | npe | counts | npe | — |
| IEEE 802.11 | 5 | 2117 | 436 | 0.79 | npe | counts | npe | — |
| ATM | 6 | 2515 | 108 | 0.73 | npe | counts | leak | — |
| UDP | 55 | 172 | 252 | 0.73 | npe | counts | off-by-one | — |
| Discard ⚠ counts said npe | 8 | 132 | 1300 | 0.73 | race | judge (override) | race | — |
| Finger | 7 | 264 | 351 | 0.69 | npe | counts | leak | — |
| IEEE 802.15.4 ⚠ counts said npe | 5 | 787 | 153 | 0.69 | race | judge (override) | race | — |
| DNS | 4 | 211 | 522 | 0.68 | npe | counts | off-by-one | — |
| NFS | 58 | 67 | 188 | 0.67 | npe | counts | npe | — |
| FLIP ⚠ counts said npe | 0 | 267 | 851 | 0.65 | heisenbug | judge (override) | heisenbug | — |
| Diameter ⚠ counts said npe | 0 | 285 | 776 | 0.65 | race | judge (override) | race | — |
| BGP | 3 | 168 | 166 | 0.60 | npe | counts | npe | — |
| AODV ⚠ counts said npe | 0 | 474 | 146 | 0.58 | race | judge (override) | race | — |
| PTP | 20 | 105 | 46 | 0.57 | npe | counts | leak | — |
| ARP | 26 | 71 | 42 | 0.56 | leak | counts | npe | — |
| 6LoWPAN | 5 | 240 | 34 | 0.55 | leak | counts | race | — |
| SPI | 41 | 23 | 64 | 0.54 | leak | counts | npe | — |
| SSH ⚠ counts said leak | 9 | 51 | 80 | 0.53 | off-by-one | judge (override) | off-by-one | — |
| HIP | 0 | 147 | 111 | 0.51 | leak | counts | race | — |
| DHCP ⚠ counts said leak | 13 | 57 | 31 | 0.50 | off-by-one | judge (override) | off-by-one | — |
| SCTP | 11 | 118 | 17 | 0.50 | womm | pin | leak | — |
| BitTorrent | 0 | 158 | 73 | 0.49 | leak | counts | npe | — |
| CoAP | 0 | 142 | 54 | 0.47 | leak | counts | leak | — |
| ICMP | 15 | 22 | 30 | 0.46 | leak | counts | npe | — |
| I2C | 53 | 14 | 14 | 0.45 | leak | counts | npe | — |
| EAP | 0 | 126 | 25 | 0.42 | leak | counts | leak | — |
| GTP | 14 | 17 | 18 | 0.42 | leak | counts | race | — |
| COPS | 0 | 37 | 70 | 0.42 | leak | counts | race | — |
| FTP ⚠ counts said leak | 1 | 25 | 45 | 0.40 | off-by-one | judge (override) | off-by-one | — |
| BEEP ⚠ counts said leak | 1 | 28 | 36 | 0.40 | heisenbug | judge (override) | heisenbug | — |
| SMB | 13 | 7 | 26 | 0.39 | leak | counts | npe | — |
| FDDI | 6 | 102 | 3 | 0.39 | leak | counts | race | — |
| B.A.T.M.A.N. ⚠ counts said leak | 6 | 38 | 8 | 0.39 | heisenbug | judge (override) | heisenbug | — |
| DTLS | 0 | 37 | 40 | 0.39 | leak | counts | leak | — |
| MRP | 3 | 16 | 28 | 0.38 | leak | counts | race | — |
| Daytime | 0 | 11 | 103 | 0.38 | leak | counts | race | — |
| FlexRay | 0 | 107 | 10 | 0.37 | leak | counts | race | — |
| PRP | 5 | 15 | 15 | 0.37 | leak | counts | race | — |
| DCCP | 2 | 38 | 9 | 0.36 | leak | counts | race | — |
| Bitcoin protocol | 0 | 15 | 50 | 0.35 | leak | counts | leak | — |
| Gnutella | 0 | 53 | 12 | 0.34 | leak | counts | leak | — |
| GRE | 5 | 10 | 13 | 0.34 | leak | counts | leak | — |
| GOOSE | 0 | 28 | 20 | 0.34 | leak | counts | race | — |
| IGMP | 11 | 13 | 5 | 0.34 | leak | counts | leak | — |
| Babel | 0 | 18 | 30 | 0.34 | leak | counts | race | — |
| HTTP/2 | 0 | 17 | 30 | 0.33 | leak | counts | npe | — |
| Banana | 0 | 17 | 26 | 0.32 | leak | counts | race | — |
| HTTP/3 ⚠ counts said race | 0 | 10 | 33 | 0.31 | npe | judge (override) | npe | — |
| ARCNET | 22 | 9 | 2 | 0.31 | race | counts | race | — |
| DNP3 | 0 | 24 | 12 | 0.30 | race | counts | race | — |
| BFD | 2 | 17 | 6 | 0.30 | race | counts | race | — |
| DOCSIS | 0 | 48 | 5 | 0.30 | race | counts | race | — |
| CDP | 0 | 7 | 28 | 0.29 | race | counts | leak | — |
| Geneve | 1 | 3 | 29 | 0.28 | race | counts | race | — |
| Inter-Domain Routing Protocol | 0 | 17 | 11 | 0.28 | race | counts | heisenbug | — |
| Netlink | 56 | 1 | 3 | 0.28 | race | counts | leak | — |
| gRPC ⚠ counts said race | 0 | 5 | 23 | 0.26 | npe | judge (override) | npe | — |
| BACnet | 0 | 17 | 6 | 0.25 | race | counts | race | — |
| RFB | 2 | 3 | 10 | 0.25 | race | counts | leak | — |
| CARP | 0 | 9 | 9 | 0.24 | race | judge | race | — |
| H.323 | 0 | 25 | 3 | 0.24 | race | counts | leak | — |
| AFP | 0 | 4 | 18 | 0.24 | race | counts | race | — |
| AMQP | 0 | 7 | 10 | 0.24 | race | counts | leak | — |
| CMIP | 0 | 11 | 6 | 0.23 | race | counts | race | — |
| EIGRP | 0 | 12 | 5 | 0.23 | race | counts | leak | — |
| IEC 60870-5-104 | 0 | 13 | 4 | 0.22 | race | counts | race | — |
| BIER | 0 | 8 | 6 | 0.22 | race | judge | race | — |
| EtherNet/IP | 1 | 3 | 7 | 0.21 | race | judge | race | — |
| BMP | 0 | 6 | 7 | 0.21 | race | judge | race | — |
| ES-IS | 0 | 2 | 15 | 0.21 | heisenbug | counts | race | — |
| eDonkey | 0 | 9 | 3 | 0.19 | leak | judge | leak | — |
| eCPRI | 0 | 6 | 4 | 0.19 | race | judge | race | — |
| ICAP | 0 | 6 | 3 | 0.17 | race | judge | race | — |
| DoIP | 0 | 5 | 3 | 0.17 | race | judge | race | — |
| XTP | 0 | 8 | 1 | 0.15 | race | judge | race | — |
| HL7 | 0 | 1 | 7 | 0.15 | race | judge | race | — |
| ISOBUS | 1 | 2 | 2 | 0.14 | race | judge | race | — |
| CANopen | 0 | 7 | 1 | 0.14 | race | judge | race | — |
| Bundle Protocol version 7 | 0 | 4 | 2 | 0.14 | race | judge | race | — |
| High-availability Seamless Redundancy | 4 | 3 | 0 | 0.14 | race | judge | race | — |
| SMBus ⚠ counts said heisenbug | 24 | 0 | 0 | 0.13 | leak | judge (override) | leak | — |
| CCSDS File Delivery Protocol | 0 | 12 | 0 | 0.13 | heisenbug | counts | race | — |
| CLNP | 0 | 2 | 3 | 0.13 | heisenbug | judge | heisenbug | — |
| RxRPC | 18 | 0 | 0 | 0.12 | heisenbug | counts | race | — |
| AX.25 | 0 | 4 | 1 | 0.12 | race | judge | race | — |
| Witness protocol | 2 | 1 | 1 | 0.12 | race | judge | race | — |
| FUSE protocol | 2 | 1 | 1 | 0.12 | race | judge | race | — |
| CAPWAP | 0 | 9 | 0 | 0.12 | race | judge | race | — |
| USB/IP | 2 | 3 | 0 | 0.12 | race | judge | race | — |
| Art-Net | 0 | 2 | 2 | 0.12 | race | judge | race | — |
| FCIP | 0 | 2 | 2 | 0.12 | race | judge | race | — |
| 9P | 5 | 1 | 0 | 0.11 | race | judge | race | — |
| Gopher | 0 | 1 | 3 | 0.11 | womm | pin | leak | — |
| FTAM | 0 | 7 | 0 | 0.11 | race | judge | race | — |
| EAPOL | 2 | 0 | 2 | 0.11 | race | judge | race | — |
| FCoE | 2 | 2 | 0 | 0.10 | race | judge | race | — |
| AppleTalk | 1 | 3 | 0 | 0.10 | leak | judge | leak | — |
| Chaosnet | 0 | 1 | 2 | 0.09 | womm | pin | heisenbug | — |
| ATA over Ethernet | 3 | 1 | 0 | 0.09 | race | judge | race | — |
| AgentX | 0 | 2 | 1 | 0.09 | race | judge | race | — |
| iFCP | 0 | 5 | 0 | 0.09 | race | judge | race | — |
| gQUIC | 0 | 0 | 4 | 0.09 | heisenbug | judge | heisenbug | — |
| Ethernet POWERLINK | 0 | 4 | 0 | 0.08 | race | judge | race | — |
| HSRP | 0 | 1 | 1 | 0.07 | leak | judge | leak | — |
| HyperSCSI | 0 | 1 | 1 | 0.07 | heisenbug | judge | heisenbug | — |
| Fibre Channel Protocol | 0 | 3 | 0 | 0.07 | race | judge | race | — |
| Internet Cache Protocol | 0 | 3 | 0 | 0.07 | race | judge | race | — |
| L2CAP | 0 | 0 | 2 | 0.06 | race | judge | race | — |
| DVMRP | 0 | 2 | 0 | 0.06 | race | judge | race | — |
| GIOP | 0 | 2 | 0 | 0.06 | race | judge | race | — |
| BPSec | 0 | 2 | 0 | 0.06 | race | judge | race | — |
| Common Industrial Protocol | 0 | 2 | 0 | 0.06 | race | judge | race | — |
| Totem Single Ring Protocol | 0 | 2 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| Inter-Access Point Protocol | 0 | 2 | 0 | 0.06 | heisenbug | judge | heisenbug | — |
| FMTP | 0 | 1 | 0 | 0.04 | race | judge | race | — |
| Generic Framing Procedure | 0 | 1 | 0 | 0.04 | race | judge | race | — |
| GLBP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| IAX2 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CHARGEN ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| EtherIP | 0 | 0 | 0 | 0.00 | bitflip | pin | heisenbug | — |
| ZMODEM ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| NC-SI ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| AJP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ASTERIX ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| BJNP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Dynamic Trunking Protocol ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| GELF ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| GARP Multicast Registration Protocol ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| GARP VLAN Registration Protocol ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| HART-IP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| HiSLIP ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| High-Speed SECS Message Service ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| hpfeeds ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| Data Center Bridging Exchange ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| AYIYA ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): DHCP (counts said leak, now off-by-one), FTP (counts said leak, now off-by-one), SSH (counts said leak, now off-by-one), gRPC (counts said race, now npe), FIX (counts said off-by-one, now leak), HTTP/3 (counts said race, now npe), SMBus (counts said heisenbug, now leak), AODV (counts said npe, now race), Diameter (counts said npe, now race), Discard (counts said npe, now race), BEEP (counts said leak, now heisenbug), B.A.T.M.A.N. (counts said leak, now heisenbug), FLIP (counts said npe, now heisenbug), IEEE 802.15.4 (counts said npe, now race)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

20/20 sampled answers are members (100%); 20/20 also have an acceptable tier. Not members: none.

## Pipeline report

Generated 2026-11-27 19:03 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/network-protocol.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (EtherIP; Gopher, Chaosnet, SCTP): the owner vets them
- scripts/bank/obvious-draft/network-protocol.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 36/36 obvious answers accepted |
| duplicates | WARN | 1 likely duplicate pairs: 'HTTPS' duplicates 'HTTP' |
| link coverage | PASS | 135/150 answers have a verified link (90%); prompt link yes |
| precision | PASS | 20/20 sampled answers are members (100%), 20/20 with acceptable tier |
| answer count | PASS | 150 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 3 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 12 | 12 |
| Works on my machine | 3 | 0 |
| Null pointer exception | 23 | 23 |
| Memory leak | 29 | 29 |
| Race condition | 70 | 70 |
| Heisenbug | 12 | 12 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 7.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## network-protocol
_Name a network protocol_

Works on my machine:
- [ ] Gopher
- [ ] SCTP
- [ ] BGP
- [ ] Chaosnet
- [ ] Banana
- [ ] other: 

Bit Flip:
- [ ] BEEP
- [ ] CLNP
- [ ] EtherIP
- [ ] FLIP
- [ ] AYIYA
- [ ] HyperSCSI
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 17 |
| harvest | done | 3 |
| filter | done | 123 |
| compare | done | 0 |
| escalate | done | 30 |
| merge | done | 11 |
| obvious | done | 21 |
| dupes | done | 0 |
| links | done | 37 |
| precision | done | 26 |
| report | running |  |
