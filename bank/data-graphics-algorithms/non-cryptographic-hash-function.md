# Name a non-cryptographic hash function
id: non-cryptographic-hash-function · domain: data-graphics-algorithms · status: approved
> Any named function mapping arbitrary byte input to a fixed-size digest, cryptographic or non-cryptographic.

## Off-by-one
- xxHash | xxh3 | XXH64 | XXH32 (auto)
- MD5 (auto)
- SHA-1 (auto)
- CRC32 | crc32c | crc | crc32_hw (auto)
- FNV-1a | FNV | Fowler-Noll-Vo (auto)
- djb2 | Bernstein hash (auto)
- Adler-32 (auto)

## Works on my machine
- MurmurHash | MurmurHash1 | MurmurHash2 | MurmurHash3 | PMurHash | Murmur | Murmur3 | Murmur2
  note: Austin Appleby's fast hash — the first non-crypto name almost every engineer thinks of.

## Null pointer exception
- SHA-3 (auto)
- CRC64 (auto)
- SipHash | halfsiphash (auto)
- CityHash | City | CityCrc (auto)
- FarmHash | farmhash-c (auto)
- BLAKE2 | blake2b | blake2s (auto)
- tabulation hashing | tabulation (auto)
- FNV-1 (auto)
- sdbm (auto)
- Pearson hashing | Pearson hash (auto)
- Rabin-Karp rolling hash | rolling hash | polynomial rolling hash (auto)
- Buzhash (auto)
- Zobrist hashing | Zobrist hash (auto)
- Fletcher's checksum | Fletcher-16 | Fletcher-32 (auto)
- PJW hash | ELF hash (auto)
- FxHash (auto)

## Memory leak
- RIPEMD | rmd128 | rmd160 | rmd256 | RIPEMD-128 | RIPEMD-160 | RIPEMD-256 (auto)
- HighwayHash (auto)
- SpookyHash | Spooky | SpookyV2 (auto)
- lookup3 | Jenkins hash | one-at-a-time (auto)
- wyhash | wyhash32 | wyhash_condom (auto)
- aHash (auto)
- SeaHash (auto)
- SuperFastHash (auto)

## Race condition
- MetroHash | cmetrohash | cmetrohash64 (auto)
- CLHash (auto)
- GxHash (auto)
- rapidhash (auto)
- t1ha | Fast Positive Hash (auto)
- komihash (auto)
- UMASH | umash_long (auto)
- VMAC (auto)
- fasthash (auto)
- MUM | mum_v3 | MUM-hash (auto)

## Heisenbug
- Chaskey (auto)
- Edon-R (auto)
- a5hash (auto)
- Discohash | discohash1 | discohash2 | discohash_512 (auto)
- falkhash (auto)
- FARSH (auto)
- fhtw (auto)
- floppsyhash (auto)
- HalftimeHash (auto)
- hasshe2 | hassh64 (auto)
- jodyhash | jody_hash32 | jody_hash64 (auto)
- k-hashv (auto)
- khash (auto)
- LaneHash | lanehash_aes (auto)
- mir-hash (auto)
- mx3 (auto)
- o1hash (auto)
- pengyhash (auto)
- Pippip (auto)
- PMP_Multilinear (auto)
- polymur-hash (auto)
- prvhash (auto)
- Rainbow (auto)
- Rainstorm (auto)
- silicium_hash (auto)
- tifuhash (auto)
- tsip (auto)
- w1hash (auto)
- xmsx (auto)
- aesni-hash | aesnihash-peterrk (auto)
- beamsplitter (auto)

## Bit Flip
- MeowHash | meow_hash_x64_aesni
  note: Casey Muratori's AES-NI throughput monster designed to saturate memory bandwidth.

## Inbox
- SHA-256 (suggested: off-by-one)
