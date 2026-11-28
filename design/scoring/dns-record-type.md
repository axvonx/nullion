# Scoring: dns-record-type (Name a DNS record type)

64 answers (Bit Flip and Works on my machine left out); 3 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (3%) | 2 | 0 |
| npe | 8 (12%) | 8 | 0 |
| leak | 9 (14%) | 3 | 0 |
| race | 2 (3%) | 1 | 0 |
| heisenbug | 43 (67%) | 50 | 0 |

Same tier as today: 57/64 (89%).

## Off-by-one (2)

A 5.4 [0c 0q 0f 0s], CNAME 4.5 [3802c 1740q 0f 0s]

## Null pointer exception (8)

MX 4.3 [1166c 775q 0f 0s], TXT 3.8 [1270c 1589q 0f 0s], NS 3.3 [0c 1027q 0f 0s], PTR 3.1 [0c 56873q 0f 0s], AAAA 3.1 [0c 0q 1f 0s], SPF 2.7 [16543c 1515q 0f 0s], SOA 2.7 [1531c 1955q 0f 0s], SRV 2.6 [1628c 424q 1f 0s]

## Memory leak (9)

HTTPS 1.6 [36764c 28890q 0f 0s], CAA 1.4 [1481c 39q 0f 0s], TLSA 0.9 [6729c 13q 0f 0s], LP 0.8 [0c 52q 0f 0s], URI 0.7 [0c 6238q 0f 0s], RT 0.6 [0c 136q 0f 0s], CDS 0.3 [0c 190q 0f 0s], EUI48 0.2 [0c 2001q 0f 0s], APL 0.0* [0c 364q 0f 0s]

## Race condition (2)

CERT 0.5 [0c 22q 1f 0s], DLV 0.4 [0c 22q 0f 0s]

## Heisenbug (43)

DNSKEY 1.6 [0c 0q 0f 0s], RESINFO 1.1 [0c 0q 0f 0s], HHIT 1.0 [0c 0q 0f 0s], DSYNC 0.9 [0c 0q 0f 0s], SSHFP 0.9 [531c 0q 4f 0s], RRSIG 0.9 [0c 0q 0f 0s], HIP 0.9 [0c 0q 0f 0s], SVCB 0.9 [0c 0q 0f 0s], KEY 0.9 [0c 0q 0f 0s], DNAME 0.9 [0c 0q 0f 0s], TSIG 0.8 [329c 0q 0f 0s], RP 0.8 [0c 0q 0f 0s], NSEC 0.8 [0c 0q 0f 0s], OPT 0.8 [0c 0q 0f 0s], DS 0.7 [0c 0q 0f 0s], L32 0.7 [0c 0q 0f 0s], ISDN 0.7 [0c 6q 0f 0s], KX 0.7 [0c 0q 0f 0s], CSYNC 0.7 [0c 0q 0f 0s], OPENPGPKEY 0.6 [0c 0q 0f 0s], L64 0.6 [0c 0q 0f 0s], CDNSKEY 0.6 [0c 0q 0f 0s], SIG 0.5 [0c 0q 0f 0s], SMIMEA 0.5 [0c 0q 0f 0s], IPSECKEY 0.5 [0c 0q 0f 0s], TKEY 0.5 [0c 0q 0f 0s], NSEC3 0.5 [0c 0q 0f 0s], BRID 0.5 [0c 0q 0f 0s], DHCID 0.5 [0c 0q 0f 0s], WKS 0.4 [0c 0q 0f 0s], NSAP 0.4 [0c 0q 0f 0s], AFSDB 0.4 [0c 0q 0f 0s], EUI64 0.3 [0c 0q 0f 0s], ZONEMD 0.3 [0c 0q 0f 0s], AMTRELAY 0.3 [0c 0q 0f 0s], WALLET 0.3 [0c 0q 1f 0s], NSEC3PARAM 0.3 [0c 0q 0f 0s], PX 0.3 [0c 0q 0f 0s], GPOS 0.3 [0c 0q 0f 0s], NSAP-PTR 0.3 [0c 0q 0f 0s], NID 0.3 [0c 0q 0f 0s], AVC 0.0* [0c 0q 0f 0s], NINFO 0.0* [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
