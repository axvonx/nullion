# Scoring: serialization-format (Name a data serialization format)

29 answers (Bit Flip and Works on my machine left out); 2 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 100, 15), some (3000, 50, 8) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 3 (10%) | 4 | 0 |
| npe | 14 (48%) | 25 | 0 |
| leak | 7 (24%) | 0 | 0 |
| race | 2 (7%) | 0 | 0 |
| heisenbug | 3 (10%) | 0 | 0 |

Same tier as today: 16/29 (55%).

## Off-by-one (3)

JSON 6.4 [37716c 361184q 5f], XML 5.8 [13851c 215657q 0f], CSV 5.3 [24981c 92306q 0f]

## Null pointer exception (14)

YAML 4.2 [16545c 15569q 0f], Pickle 3.0* [0c 4973q 0f], INI 2.8 [5458c 1662q 1f], Parquet 2.6 [6727c 4010q 0f], BSON 2.5 [1293c 1410q 0f], JSON Lines 2.4 [0c 153q 0f], Avro 2.4 [1534c 3734q 22f], TOML 2.4 [5453c 260q 0f], Java serialization 2.3 [3014c 0q 0f], MessagePack 2.3 [756c 418q 23f], Java properties 2.2 [941c 18283q 1f], Plist 2.1 [872c 3523q 1f], Thrift 2.0 [967c 1894q 35f], TSV 2.0* [2020c 91267q 0f]

## Memory leak (7)

S-expressions 2.0 [3254c 138q 1f], FlatBuffers 1.9 [759c 389q 45f], CBOR 1.8 [2516c 101q 0f], Gob 1.6 [0c 113q 3f], ASN.1 1.5 [3228c 775q 0f], Cap'n Proto 1.1 [569c 100q 38f], Hessian 0.9 [0c 159q 3f]

## Race condition (2)

XDR 1.6 [422c 65q 0f], EDN 1.2 [0c 59q 0f]

## Heisenbug (3)

Bencode 1.2 [757c 0q 2f], UBJSON 0.9 [155c 0q 0f], Smile 0.4 [340c 24q 7f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
