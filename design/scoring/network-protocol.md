# Scoring: network-protocol (Name a network protocol)

152 answers (Bit Flip and Works on my machine left out); 6 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 9 (6%) | 9 | 0 |
| npe | 28 (18%) | 28 | 0 |
| leak | 27 (18%) | 21 | 0 |
| race | 11 (7%) | 11 | 0 |
| heisenbug | 77 (51%) | 83 | 0 |

Same tier as today: 140/152 (92%).

## Off-by-one (9)

HTTP 6.4 [49530c 72276q 0f], Ethernet 6.0* [16152c 5731q 0f], TCP 5.7 [24419c 26997q 1f], DNS 5.5 [34857c 37034q 0f], IP 5.4 [11444c 16242q 1f], IEEE 802.11 5.0* [16586c 25151q 1f], UDP 4.9 [13197c 11849q 0f], SSH 4.8 [37262c 58370q 0f], FTP 4.7 [10360c 19552q 0f]

## Null pointer exception (28)

TLS 4.3 [44661c 59549q 0f], IPv6 4.2 [17513c 6334q 0f], SMTP 4.2 [9392c 16177q 0f], DHCP 4.1 [13331c 5380q 32f], BitTorrent 4.0* [17828c 1719q 4f], HTTP/3 4.0* [7211c 121q 0f], HTTP/2 4.0* [4720c 2022q 0f], RDP 3.6 [4755c 6844q 1f], IMAP 3.6 [4131c 6203q 8f], POP3 3.6 [2848c 1439q 1f], ICMP 3.5 [11106c 1041q 0f], Telnet 3.5 [6386c 3502q 0f], ARP 3.1 [11133c 1443q 0f], NTP 3.1 [56356c 2035q 34f], NFS 3.0 [4757c 5098q 1f], SMB 2.9 [7453c 2550q 0f], IRC 2.8 [15905c 1442q 1f], IPsec 2.8 [5558c 1689q 0f], LDAP 2.7 [7537c 15206q 0f], gRPC 2.7 [5027c 6639q 36f], SNMP 2.6 [7238c 3370q 0f], QUIC 2.4 [15292c 161q 0f], BGP 2.3 [11812c 332q 0f], SIP 2.3 [5302c 3368q 0f], MQTT 2.2 [8652c 6454q 0f], OSPF 2.2 [4268c 138q 0f], Bitcoin protocol 2.1 [91739c 0q 0f], I2C 2.0 [0c 1806q 1f]

## Memory leak (27)

GRE 1.7 [0c 145q 1f], AMQP 1.7 [2195c 2540q 2f], SPI 1.7 [0c 1427q 1f], XMPP 1.6 [5055c 6026q 3f], DTLS 1.6 [3071c 175q 0f], EAP 1.5 [1985c 53q 0f], GELF 1.5 [0c 90q 0f], CDP 1.4 [345c 52q 3f], CoAP 1.3 [1607c 232q 0f], AFP 1.3 [897c 197q 0f], gQUIC 1.3 [15292c 0q 0f], IGMP 1.2 [2080c 106q 0f], Netlink 1.1 [564c 356q 1f], Babel 1.1 [405c 9754q 0f], SMBus 1.1 [0c 87q 0f], HL7 1.0 [0c 514q 0f], FIX 0.9 [1593c 621q 0f], BEEP 0.9 [101c 250q 17f], FLIP 0.9 [50c 751q 6f], CARP 0.8 [444c 55q 0f], AJP 0.8 [337c 329q 0f], CANopen 0.7 [0c 145q 0f], L2CAP 0.7 [47980c 90q 0f], BMP 0.6 [0c 1142q 4f], BACnet 0.6 [2161c 108q 0f], Ethernet POWERLINK 0.5 [216c 125q 2f], GOOSE 0.4 [2202c 51q 0f]

## Race condition (11)

Finger 1.4 [2079c 20q 9f], ZMODEM 1.3 [638c 24q 0f], DOCSIS 1.2 [3825c 3q 6f], BFD 1.1 [951c 31q 0f], H.323 1.1 [590c 42q 0f], IEEE 802.15.4 1.0 [4035c 0q 0f], PTP 0.9 [5855c 40q 0f], Banana 0.7 [0c 33q 0f], EAPOL 0.7 [5033c 0q 0f], ICAP 0.5 [439c 20q 0f], HIP 0.3 [216c 25q 2f]

## Heisenbug (77)

EIGRP 1.6 [1047c 19q 0f], Gnutella 1.6 [2198c 0q 0f], ATM 1.4 [1936c 4q 0f], Daytime 1.2 [317c 0q 0f], HSRP 1.2 [511c 18q 0f], ASTERIX 1.2 [0c 0q 0f], EtherNet/IP 1.2 [1256c 0q 0f], CHARGEN 1.1 [296c 0q 0f], FUSE protocol 1.1 [0c 0q 0f], eDonkey 1.1 [1218c 0q 0f], AppleTalk 1.1 [1173c 0q 0f], RFB 1.1 [0c 0q 3f], Dynamic Trunking Protocol 1.0 [257c 3q 0f], Geneve 1.0 [0c 0q 0f], FDDI 0.9 [682c 0q 0f], GTP 0.9 [0c 0q 0f], Fibre Channel Protocol 0.9 [2116c 0q 0f], Diameter 0.9 [759c 0q 0f], AODV 0.8 [222c 0q 1f], Common Industrial Protocol 0.8 [413c 0q 0f], FCoE 0.8 [347c 5q 0f], ARCNET 0.8 [810c 0q 0f], 9P 0.8 [2171c 14q 0f], DCCP 0.8 [469c 8q 0f], Internet Cache Protocol 0.7 [73c 0q 0f], 6LoWPAN 0.7 [1018c 10q 0f], COPS 0.7 [24c 0q 0f], USB/IP 0.7 [0c 0q 0f], CMIP 0.7 [66c 0q 0f], FlexRay 0.6 [0c 0q 0f], IAX2 0.6 [151c 0q 0f], B.A.T.M.A.N. 0.6 [867c 0q 2f], CAPWAP 0.6 [0c 0q 0f], GLBP 0.6 [115c 0q 0f], MRP 0.6 [386c 0q 0f], AYIYA 0.6 [0c 0q 0f], RxRPC 0.5 [0c 0q 0f], AgentX 0.5 [0c 0q 0f], HART-IP 0.5 [0c 0q 0f], hpfeeds 0.5 [0c 0q 1f], AX.25 0.5 [870c 0q 0f], ATA over Ethernet 0.5 [247c 0q 1f], XTP 0.5 [37c 0q 0f], PRP 0.5 [603c 0q 0f], Art-Net 0.5 [971c 2q 0f], GARP VLAN Registration Protocol 0.5 [0c 0q 0f], HyperSCSI 0.4 [10c 0q 0f], BPSec 0.4 [0c 0q 0f], DoIP 0.4 [0c 0q 0f], Witness protocol 0.4 [0c 0q 0f], ISOBUS 0.4 [0c 0q 0f], NC-SI 0.4 [217c 0q 0f], GIOP 0.4 [179c 0q 0f], CLNP 0.4 [0c 0q 0f], Inter-Domain Routing Protocol 0.4 [0c 0q 0f], DNP3 0.4 [1297c 14q 0f], DVMRP 0.4 [79c 0q 0f], Totem Single Ring Protocol 0.3 [0c 0q 0f], IEC 60870-5-104 0.3 [1076c 0q 0f], FMTP 0.3 [0c 0q 0f] ...

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
