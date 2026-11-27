# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: DNS, record.

## dns-record-type

68 candidates; 22 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| A | 613 | 6666 | 27489 | 1.00 | off-by-one | counts | off-by-one | — |
| HTTPS ⚠ counts said off-by-one | 25 | 89 | 2469 | 1.00 | leak | judge (override) | leak | — |
| KEY ⚠ counts said off-by-one | 58 | 105 | 2532 | 1.00 | heisenbug | judge (override) | heisenbug | — |
| CDS | 3 | 20 | 37 | 0.54 | leak | counts | race | — |
| NS ⚠ counts said leak | 5 | 7 | 30 | 0.47 | off-by-one | judge (override) | off-by-one | — |
| RT ⚠ counts said leak | 6 | 3 | 37 | 0.43 | heisenbug | judge (override) | heisenbug | — |
| OPT | 2 | 4 | 48 | 0.41 | leak | counts | race | — |
| SIG | 11 | 5 | 5 | 0.40 | leak | counts | race | — |
| DS | 0 | 8 | 37 | 0.38 | leak | counts | leak | — |
| HIP | 0 | 8 | 33 | 0.38 | leak | counts | race | — |
| TXT | 2 | 4 | 6 | 0.31 | off-by-one | judge | off-by-one | — |
| SOA | 0 | 6 | 9 | 0.29 | npe | judge | npe | — |
| PTR | 1 | 3 | 5 | 0.26 | off-by-one | judge | off-by-one | — |
| CAA | 0 | 4 | 7 | 0.25 | npe | judge | npe | — |
| RP | 4 | 0 | 11 | 0.23 | race | counts | heisenbug | — |
| MX | 0 | 4 | 4 | 0.23 | off-by-one | judge | off-by-one | — |
| LP | 0 | 1 | 21 | 0.22 | heisenbug | counts | heisenbug | — |
| SPF | 0 | 5 | 2 | 0.22 | leak | judge | leak | — |
| SRV | 0 | 9 | 0 | 0.20 | npe | judge | npe | — |
| TLSA | 0 | 4 | 2 | 0.20 | race | judge | race | — |
| CNAME | 0 | 2 | 6 | 0.20 | off-by-one | judge | off-by-one | — |
| DNSKEY | 0 | 7 | 0 | 0.18 | leak | judge | leak | — |
| URI | 0 | 2 | 4 | 0.18 | race | judge | race | — |
| WALLET | 0 | 0 | 29 | 0.17 | heisenbug | counts | heisenbug | — |
| RRSIG | 0 | 3 | 1 | 0.16 | leak | judge | leak | — |
| SVCB | 0 | 3 | 1 | 0.16 | leak | judge | leak | — |
| AVC | 0 | 3 | 1 | 0.16 | heisenbug | judge | heisenbug | — |
| LOC | 1 | 0 | 8 | 0.16 | womm | pin | race | — |
| SSHFP | 0 | 2 | 1 | 0.13 | race | judge | race | — |
| NID | 0 | 0 | 12 | 0.13 | heisenbug | counts | heisenbug | — |
| TSIG | 0 | 3 | 0 | 0.12 | race | judge | race | — |
| NSAP | 0 | 3 | 0 | 0.12 | heisenbug | judge | heisenbug | — |
| CERT | 0 | 1 | 2 | 0.12 | race | judge | race | — |
| PX | 0 | 0 | 7 | 0.11 | heisenbug | judge | heisenbug | — |
| NSEC | 0 | 2 | 0 | 0.10 | leak | judge | leak | — |
| AAAA | 0 | 0 | 4 | 0.08 | off-by-one | judge | off-by-one | — |
| X25 | 2 | 0 | 0 | 0.07 | bitflip | pin | heisenbug | — |
| DNAME | 0 | 1 | 0 | 0.06 | leak | judge | leak | — |
| TKEY | 0 | 1 | 0 | 0.06 | race | judge | race | — |
| CDNSKEY | 0 | 1 | 0 | 0.06 | race | judge | race | — |
| DLV | 0 | 1 | 0 | 0.06 | race | judge | race | — |
| DHCID | 0 | 1 | 0 | 0.06 | race | judge | race | — |
| APL | 0 | 1 | 0 | 0.06 | race | judge | race | — |
| NAPTR | 0 | 1 | 0 | 0.06 | womm | pin | race | — |
| NSEC3 | 0 | 0 | 2 | 0.06 | leak | judge | leak | — |
| GPOS | 1 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| KX | 1 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| AFSDB | 1 | 0 | 0 | 0.04 | heisenbug | judge | heisenbug | — |
| WKS | 0 | 0 | 1 | 0.04 | heisenbug | judge | heisenbug | — |
| HINFO | 0 | 0 | 0 | 0.00 | womm | pin | race | — |
| NSEC3PARAM ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| OPENPGPKEY ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| SMIMEA ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| IPSECKEY ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| ZONEMD ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| CSYNC ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| AMTRELAY ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| BRID ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| DSYNC ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| EUI48 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| EUI64 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| HHIT ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ISDN ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| L32 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| L64 ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NINFO ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| RESINFO ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| NSAP-PTR ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): NS (counts said leak, now off-by-one), RT (counts said leak, now heisenbug), HTTPS (counts said off-by-one, now leak), KEY (counts said off-by-one, now heisenbug)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

19/20 sampled answers are members (95%); 18/20 also have an acceptable tier. Not members: WALLET (I cannot confirm from the sample that WALLET is a registered TYPE number in the IANA registry. Under the strict rule, unsure means false.).

## Pipeline report

Generated 2026-11-27 18:55 UTC by scripts/bank/pipeline.py. Status stays `draft`: approval is the owner's call.

Needs a human look:
- scripts/bank/plans/dns-record-type.json was DRAFTED BY AN LLM: the owner may veto or edit it (rerun with --from harvest after editing)
- Bit Flip / Works on my machine PINNED BY AN LLM (X25; HINFO, NAPTR, LOC): the owner vets them
- scripts/bank/obvious-draft/dns-record-type.json was drafted by an LLM: glance at it (approval moves it to scripts/bank/obvious/)

### Gates

| gate | result | detail |
|---|---|---|
| obvious coverage | PASS | 31/31 obvious answers accepted |
| duplicates | PASS | 0 likely duplicate pairs |
| link coverage | PASS | 62/68 answers have a verified link (91%); prompt link yes |
| precision | PASS | 19/20 sampled answers are members (95%), 18/20 with acceptable tier |
| answer count | PASS | 68 tiered answers (roadmap admission test: at least 40) |
| picks (owner) | PASS | 1 Bit Flip, 3 Works on my machine in the file; approval needs exactly 1 and at least 1: choose from the shortlists below |

### Tiers

| tier | answers | unconfirmed (auto) |
|---|---|---|
| Off-by-one | 7 | 7 |
| Works on my machine | 3 | 0 |
| Null pointer exception | 3 | 3 |
| Memory leak | 13 | 13 |
| Race condition | 17 | 17 |
| Heisenbug | 24 | 24 |
| Bit Flip | 1 | 0 |

Inbox (never accepted in play): 0.

### Bit Flip / Works on my machine shortlists

Proposed by the filter passes (picks-sheet.py format). Nothing is pinned: choose one of each, pin it in the bank file, then approve.

```
## dns-record-type
_Name a DNS record type_

Works on my machine:
- [ ] LOC
- [ ] CAA
- [ ] SRV
- [ ] NAPTR
- [ ] HINFO
- [ ] other: 

Bit Flip:
- [ ] RP
- [ ] WALLET
- [ ] X25
- [ ] L32
- [ ] other: 

```

### Stage timings

| stage | status | seconds |
|---|---|---|
| plan | done | 14 |
| harvest | done | 1 |
| filter | done | 41 |
| compare | done | 0 |
| escalate | done | 13 |
| merge | done | 7 |
| obvious | done | 22 |
| dupes | done | 0 |
| links | done | 24 |
| precision | done | 25 |
| report | running |  |
