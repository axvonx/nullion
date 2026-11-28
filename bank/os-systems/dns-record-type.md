# Name a DNS record type
id: dns-record-type · domain: os-systems · status: approved
> Any resource record type with a registered TYPE number in the IANA DNS parameters registry.

## Off-by-one
- A | address | IPv4 address | IPv4 address record | address record (auto)
- CNAME | canonical name | alias | alias record (auto)

## Works on my machine
- LOC | location | geo location
  note: RFC 1876's record for a host's latitude, longitude and altitude.
- HINFO | host info | host information
  note: Names a host's CPU and OS; nearly unused until RFC 8482 recycled it for minimal ANY answers.
- NAPTR | naming authority pointer | NAPTR record
  note: Rewrites names with regular expressions; ENUM uses it to turn phone numbers into SIP addresses.

## Null pointer exception
- SOA | start of authority | start of authority record (auto)
- SRV | service | service locator | service record (auto)
- AAAA | IPv6 address | quad A | IPv6 address record (auto)
- MX | mail exchange | mail exchanger | mail exchange record (auto)
- NS | name server | name server record (auto)
- PTR | pointer | reverse | reverse pointer (auto)
- TXT | text | text record (auto)
- SPF | sender policy framework | SPF record (auto)

## Memory leak
- CDS | child DS | child delegation signer (auto)
- HTTPS | HTTPS binding | HTTPS RR | HTTPS record (auto)
- URI | uniform resource identifier | URI record (auto)
- APL (auto)
- EUI48 | MAC address (auto)
- RT (auto)
- WALLET (auto)
- KEY (auto)
- LP (auto)

## Race condition
- TLSA | TLS association | DANE (auto)
- DNSKEY | DNS public key (auto)
- DS | delegation signer | delegation signer record (auto)
- RRSIG | resource record signature | RR signature (auto)
- NSEC | next secure (auto)
- NSEC3 | NSEC version 3 | hashed NSEC (auto)
- DNAME | delegation name | DNAME record (auto)
- CAA | certification authority authorization | CA authorization (auto)
- HIP (auto)
- CERT | certificate | CERT record (auto)
- DLV (auto)

## Heisenbug
- AMTRELAY (auto)
- AVC (auto)
- BRID (auto)
- DSYNC (auto)
- EUI64 (auto)
- GPOS (auto)
- HHIT (auto)
- ISDN (auto)
- L32 (auto)
- L64 (auto)
- NID (auto)
- NINFO (auto)
- RESINFO (auto)
- KX (auto)
- NSAP (auto)
- NSAP-PTR (auto)
- PX (auto)
- WKS (auto)
- AFSDB (auto)
- SVCB | service binding | generic service binding (auto)
- SIG (auto)
- OPT (auto)
- TSIG (auto)
- TKEY (auto)
- CDNSKEY (auto)
- NSEC3PARAM | NSEC3 parameters | NSEC3 params (auto)
- OPENPGPKEY | OpenPGP public key (auto)
- SMIMEA (auto)
- IPSECKEY (auto)
- DHCID (auto)
- ZONEMD (auto)
- CSYNC (auto)
- RP (auto)
- SSHFP | SSH fingerprint | SSH host key fingerprint (auto)

## Bit Flip
- X25
  note: RFC 1183's record mapping a name to an X.25 packet-switched network address.
