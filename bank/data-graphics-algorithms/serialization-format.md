# Name a data serialization format
id: serialization-format · domain: data-graphics-algorithms · status: approved
> Any named format for encoding structured data as bytes or text for storage or transport.

## Off-by-one
- CSV | Comma-Separated Values
- JSON | JavaScript Object Notation | json file
- XML | eXtensible Markup Language | xml file (auto)

## Works on my machine
- Protocol Buffers | protobuf | protocol buffer | Google Protocol Buffers
  note: Google's schema-compiled binary format, the pick that says you've shipped gRPC.

## Null pointer exception
- TSV | tab-separated values (auto)
- JSON Lines | JSONL | NDJSON | newline-delimited JSON (auto)
- Avro | Apache Avro (auto)
- MessagePack | msgpack (auto)
- Parquet | Apache Parquet (auto)
- TOML | Tom's Obvious Minimal Language (auto)
- BSON | Binary JSON (auto)
- Thrift | Apache Thrift (auto)
- Pickle | Python pickle | pickle format (auto)
- Java serialization | Java object serialization | Java serialisation (auto)
- INI | INI file (auto)
- Java properties | properties file | .properties (auto)
- Plist | property list | Apple property list (auto)
- YAML | YAML Ain't Markup Language | yml (auto)

## Memory leak
- Cap'n Proto | Capnp (auto)
- FlatBuffers | flatbuffer (auto)
- CBOR | Concise Binary Object Representation (auto)
- S-expressions | S-expression | sexp | Lisp s-expression (auto)
- ASN.1 | Abstract Syntax Notation One (auto)
- Gob | Go gob | encoding/gob (auto)
- Hessian | Hessian binary protocol (auto)
- EDN | Extensible Data Notation (auto)
- XDR | External Data Representation (auto)

## Race condition
- Smile | Smile binary JSON (auto)

## Heisenbug
- Bencode | BitTorrent bencode (auto)
- UBJSON | Universal Binary JSON (auto)

## Bit Flip
- Ion | Amazon Ion
  note: Amazon's typed superset of JSON, with interchangeable text and binary forms.

## Inbox
