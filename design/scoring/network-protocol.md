# Scoring: network-protocol (Name a network protocol)

152 answers (Bit Flip and Works on my machine left out); 6 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 9 (6%) | 9 | 0 |
| npe | 30 (20%) | 30 | 0 |
| leak | 25 (16%) | 15 | 0 |
| race | 13 (9%) | 14 | 0 |
| heisenbug | 75 (49%) | 84 | 0 |

Same tier as today: 142/152 (93%).

## Off-by-one (9)

HTTP 6.4 [49530c 72276q 0f 0s], Ethernet 6.0* [16152c 5731q 0f 0s], TCP 5.7 [24419c 26997q 0f 0s], DNS 5.5 [34857c 37034q 0f 0s], IP 5.4 [11444c 16242q 0f 0s], IEEE 802.11 5.0* [16586c 25151q 1f 0s], UDP 4.9 [13197c 11849q 0f 0s], SSH 4.8 [37262c 58370q 0f 0s], FTP 4.7 [10360c 19552q 0f 0s]

## Null pointer exception (30)

TLS 4.3 [44661c 59549q 0f 0s], IPv6 4.2 [17513c 6334q 0f 0s], SMTP 4.2 [9392c 16177q 0f 0s], DHCP 4.1 [13331c 5380q 32f 0s], BitTorrent 4.0* [17828c 1719q 4f 0s], HTTP/3 4.0* [7211c 121q 0f 0s], HTTP/2 4.0* [4720c 2022q 0f 0s], RDP 3.6 [4755c 6844q 0f 0s], IMAP 3.6 [4131c 6203q 8f 0s], POP3 3.6 [2848c 1439q 1f 0s], ICMP 3.5 [11106c 1041q 0f 0s], Telnet 3.5 [6386c 3502q 0f 0s], ARP 3.1 [11133c 1443q 0f 0s], NTP 3.1 [56356c 2035q 0f 0s], NFS 3.0 [4757c 5098q 0f 0s], SMB 2.9 [7453c 2550q 0f 0s], IRC 2.8 [15905c 1442q 0f 0s], IPsec 2.8 [5558c 1689q 0f 0s], LDAP 2.7 [7537c 15206q 0f 0s], gRPC 2.7 [5027c 6639q 36f 0s], SNMP 2.6 [7238c 3370q 0f 0s], QUIC 2.4 [0c 161q 0f 0s], BGP 2.3 [11812c 332q 0f 0s], SIP 2.3 [5302c 0q 0f 0s], MQTT 2.2 [8652c 6454q 0f 0s], OSPF 2.2 [4268c 138q 0f 0s], Bitcoin protocol 2.1 [91739c 0q 0f 0s], I2C 2.0 [10751c 1806q 0f 0s], AMQP 1.7 [2195c 2540q 2f 0s]^, XMPP 1.6 [5055c 6026q 3f 0s]^

## Memory leak (25)

GRE 1.7 [0c 145q 0f 0s], SPI 1.7 [0c 1427q 0f 0s], DTLS 1.6 [3071c 175q 0f 0s], EAP 1.5 [1985c 53q 0f 0s], GELF 1.5 [0c 90q 0f 0s], CDP 1.4 [345c 52q 0f 0s], CoAP 1.3 [1607c 232q 0f 0s], AFP 1.3 [897c 197q 0f 0s], IGMP 1.2 [2080c 106q 0f 0s], Netlink 1.1 [564c 356q 1f 0s], Babel 1.1 [405c 9754q 0f 0s], BFD 1.1 [951c 31q 0f 0s], SMBus 1.1 [0c 87q 0f 0s], H.323 1.1 [590c 42q 0f 0s], HL7 1.0 [0c 514q 0f 0s], PTP 0.9 [5855c 40q 0f 0s], FIX 0.9 [1593c 621q 0f 0s], BEEP 0.9 [101c 250q 17f 0s], AJP 0.8 [337c 329q 0f 0s], CANopen 0.7 [2521c 145q 0f 0s], L2CAP 0.7 [0c 90q 0f 0s], EAPOL 0.7 [5033c 0q 0f 0s], BMP 0.6 [0c 1142q 0f 0s], BACnet 0.6 [2161c 108q 0f 0s], Ethernet POWERLINK 0.5 [216c 125q 0f 0s]

## Race condition (13)

EIGRP 1.6 [1047c 19q 0f 0s], Gnutella 1.6 [2198c 0q 0f 0s], ATM 1.4 [1936c 4q 0f 0s], Finger 1.4 [2079c 0q 9f 0s], ZMODEM 1.3 [638c 24q 0f 0s], HSRP 1.2 [511c 18q 0f 0s], DOCSIS 1.2 [3825c 3q 6f 0s], IEEE 802.15.4 1.0 [4035c 0q 0f 0s], Fibre Channel Protocol 0.9 [2116c 0q 0f 0s], 9P 0.8 [2171c 14q 0f 0s], 6LoWPAN 0.7 [1018c 10q 0f 0s], ICAP 0.5 [439c 20q 0f 0s], DNP3 0.4 [1297c 14q 0f 0s]

## Heisenbug (75)

gQUIC 1.3 [0c 0q 0f 0s], Daytime 1.2 [317c 0q 0f 0s], ASTERIX 1.2 [0c 0q 0f 0s], EtherNet/IP 1.2 [1256c 0q 0f 0s], CHARGEN 1.1 [296c 0q 0f 0s], FUSE protocol 1.1 [0c 0q 0f 0s], eDonkey 1.1 [1218c 0q 0f 0s], AppleTalk 1.1 [1173c 0q 0f 0s], RFB 1.1 [0c 0q 0f 0s], Dynamic Trunking Protocol 1.0 [257c 3q 0f 0s], Geneve 1.0 [0c 0q 0f 0s], FDDI 0.9 [682c 0q 0f 0s], GTP 0.9 [0c 0q 0f 0s], Diameter 0.9 [759c 0q 0f 0s], FLIP 0.9 [50c 0q 6f 0s], AODV 0.8 [222c 0q 1f 4s], Common Industrial Protocol 0.8 [413c 0q 0f 0s], FCoE 0.8 [347c 5q 0f 0s], ARCNET 0.8 [810c 0q 0f 0s], CARP 0.8 [444c 0q 0f 0s], DCCP 0.8 [469c 8q 0f 0s], Internet Cache Protocol 0.7 [73c 0q 0f 0s], COPS 0.7 [24c 0q 0f 0s], USB/IP 0.7 [0c 0q 0f 0s], CMIP 0.7 [66c 0q 0f 0s], Banana 0.7 [0c 0q 0f 0s], FlexRay 0.6 [0c 0q 0f 0s], IAX2 0.6 [151c 0q 0f 0s], B.A.T.M.A.N. 0.6 [867c 0q 2f 0s], CAPWAP 0.6 [0c 0q 0f 0s], GLBP 0.6 [115c 0q 0f 0s], MRP 0.6 [386c 0q 0f 0s], AYIYA 0.6 [0c 0q 0f 0s], RxRPC 0.5 [0c 0q 0f 0s], AgentX 0.5 [0c 0q 0f 0s], HART-IP 0.5 [0c 0q 0f 0s], hpfeeds 0.5 [0c 0q 1f 218s], AX.25 0.5 [870c 0q 0f 0s], ATA over Ethernet 0.5 [247c 0q 0f 0s], XTP 0.5 [37c 0q 0f 0s], PRP 0.5 [603c 0q 0f 0s], Art-Net 0.5 [971c 2q 0f 0s], GARP VLAN Registration Protocol 0.5 [0c 0q 0f 0s], HyperSCSI 0.4 [10c 0q 0f 0s], BPSec 0.4 [0c 0q 0f 0s], DoIP 0.4 [0c 0q 0f 0s], Witness protocol 0.4 [0c 0q 0f 0s], ISOBUS 0.4 [0c 0q 0f 0s], NC-SI 0.4 [217c 0q 0f 0s], GIOP 0.4 [179c 0q 0f 0s], CLNP 0.4 [0c 0q 0f 0s], Inter-Domain Routing Protocol 0.4 [0c 0q 0f 0s], DVMRP 0.4 [79c 0q 0f 0s], GOOSE 0.4 [0c 0q 0f 0s], Totem Single Ring Protocol 0.3 [0c 0q 0f 0s], IEC 60870-5-104 0.3 [1076c 0q 0f 0s], FMTP 0.3 [0c 0q 0f 0s], Inter-Access Point Protocol 0.3 [0c 0q 0f 0s], ES-IS 0.3 [0c 0q 0f 0s], HIP 0.3 [216c 0q 0f 0s] ...

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
