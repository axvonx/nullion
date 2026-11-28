# Scoring: serialization-format (Name a data serialization format)

29 answers (Bit Flip and Works on my machine left out); 2 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 3 (10%) | 3 | 0 |
| npe | 15 (52%) | 15 | 0 |
| leak | 5 (17%) | 5 | 0 |
| race | 0 (0%) | 0 | 0 |
| heisenbug | 6 (21%) | 6 | 0 |

Same tier as today: 29/29 (100%).

## Off-by-one (3)

JSON 6.4 [37716c 361184q 5f 0s], XML 5.8 [13851c 214682q 0f 0s], CSV 5.3 [24981c 0q 0f 0s]

## Null pointer exception (15)

YAML 4.2 [16545c 15569q 0f 0s], Pickle 3.0* [0c 0q 0f 0s], INI 2.8 [5458c 0q 1f 0s], Parquet 2.6 [6727c 0q 0f 0s], BSON 2.5 [1293c 1410q 0f 0s], JSON Lines 2.4 [0c 153q 0f 0s], Avro 2.4 [1534c 3734q 22f 3317s], TOML 2.4 [5453c 260q 0f 0s], Java serialization 2.3 [0c 0q 0f 0s], MessagePack 2.3 [756c 418q 23f 0s], Java properties 2.2 [941c 18283q 1f 0s], Plist 2.1 [872c 3523q 1f 0s], Thrift 2.0 [967c 0q 35f 0s], TSV 2.0* [2020c 0q 0f 0s], FlatBuffers 1.9 [759c 389q 45f 26668s]^

## Memory leak (5)

S-expressions 2.0 [3254c 138q 1f 0s], CBOR 1.8 [2516c 101q 0f 0s], ASN.1 1.5 [3228c 775q 0f 0s], Cap'n Proto 1.1 [569c 100q 38f 13262s], Hessian 0.9 [0c 159q 3f 0s]

## Race condition (0)



## Heisenbug (6)

XDR 1.6 [422c 0q 0f 0s], Gob 1.6 [0c 0q 0f 0s], Bencode 1.2 [757c 0q 2f 51s], EDN 1.2 [0c 0q 0f 0s], UBJSON 0.9 [155c 0q 0f 0s], Smile 0.4 [340c 0q 7f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
