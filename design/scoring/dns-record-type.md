# Scoring: dns-record-type (Name a DNS record type)

64 answers (Bit Flip and Works on my machine left out); 3 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (3%) | 7 | 0 |
| npe | 8 (12%) | 3 | 0 |
| leak | 8 (12%) | 13 | 0 |
| race | 8 (12%) | 17 | 0 |
| heisenbug | 38 (59%) | 24 | 0 |

Same tier as today: 26/64 (41%).

## Off-by-one (2)

A 5.4 [7848c 147q 1f], CNAME 4.5 [3802c 1740q 0f]

## Null pointer exception (8)

MX 4.3 [1166c 775q 0f], TXT 3.8 [1270c 1589q 2f], NS 3.3 [7848c 1027q 1f], PTR 3.1 [7848c 56873q 0f], AAAA 3.1 [7848c 0q 1f], SPF 2.7 [16543c 1515q 1f], SOA 2.7 [1531c 1955q 0f], SRV 2.6 [1628c 424q 1f]

## Memory leak (8)

HTTPS 1.6 [0c 28890q 0f], KEY 0.9 [0c 9497q 2f], URI 0.7 [0c 6238q 1f], RT 0.6 [0c 136q 0f], WALLET 0.3 [0c 465q 1f], CDS 0.3 [0c 190q 1f], EUI48 0.2 [0c 2001q 0f], APL 0.0* [0c 364q 17f]

## Race condition (8)

DNSKEY 1.6 [7848c 0q 0f], TLSA 0.9 [6729c 13q 0f], RRSIG 0.9 [7848c 0q 0f], DNAME 0.9 [7848c 0q 0f], NSEC 0.8 [7848c 0q 0f], LP 0.8 [0c 52q 0f], DS 0.7 [7848c 0q 2f], NSEC3 0.5 [7848c 0q 0f]

## Heisenbug (38)

CAA 1.4 [1481c 39q 0f], RESINFO 1.1 [0c 0q 0f], HHIT 1.0 [0c 0q 0f], DSYNC 0.9 [0c 0q 0f], SSHFP 0.9 [531c 0q 4f], HIP 0.9 [0c 25q 2f], SVCB 0.9 [0c 0q 0f], TSIG 0.8 [329c 0q 0f], RP 0.8 [0c 0q 3f], OPT 0.8 [0c 3q 1f], L32 0.7 [0c 0q 0f], ISDN 0.7 [0c 6q 0f], KX 0.7 [0c 0q 0f], CSYNC 0.7 [0c 0q 0f], OPENPGPKEY 0.6 [0c 0q 0f], L64 0.6 [0c 0q 0f], CDNSKEY 0.6 [0c 0q 0f], CERT 0.5 [0c 22q 1f], SIG 0.5 [0c 0q 4f], SMIMEA 0.5 [0c 0q 0f], IPSECKEY 0.5 [0c 0q 0f], TKEY 0.5 [0c 0q 0f], DHCID 0.5 [0c 0q 0f], BRID 0.5 [0c 0q 0f], WKS 0.4 [0c 0q 0f], DLV 0.4 [0c 22q 1f], NSAP 0.4 [0c 0q 0f], AFSDB 0.4 [0c 0q 0f], ZONEMD 0.3 [0c 0q 0f], EUI64 0.3 [0c 0q 0f], AMTRELAY 0.3 [0c 0q 0f], NSEC3PARAM 0.3 [0c 0q 0f], PX 0.3 [0c 0q 4f], GPOS 0.3 [0c 0q 0f], NSAP-PTR 0.3 [0c 0q 0f], NID 0.3 [0c 0q 0f], AVC 0.0* [0c 0q 1f], NINFO 0.0* [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
