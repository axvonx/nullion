# Name a non-cryptographic hash function
id: non-cryptographic-hash-function · domain: data-graphics-algorithms · status: approved
> Any named function mapping arbitrary byte input to a fixed-size digest, cryptographic or non-cryptographic.

## Off-by-one
- MD5 (auto)
- CRC32 | crc32c | crc | crc32_hw (auto)

## Works on my machine
- MurmurHash | MurmurHash1 | MurmurHash2 | MurmurHash3 | PMurHash | Murmur | Murmur3 | Murmur2
  note: Austin Appleby's fast hash — the first non-crypto name almost every engineer thinks of.

## Null pointer exception
- CRC64 (auto)
- Rabin-Karp rolling hash | rolling hash | polynomial rolling hash (auto)
- xxHash | xxh3 | XXH64 | XXH32 (auto)
- SHA-1 (auto)
- FNV-1a | FNV | Fowler-Noll-Vo (auto)
- djb2 | Bernstein hash (auto)
- Adler-32 (auto)
- SHA-256 (auto)

## Memory leak
- CityHash | City | CityCrc (auto)
- SHA-3 (auto)

## Race condition
- BLAKE2 | blake2b | blake2s (auto)
- FNV-1 (auto)
- RIPEMD | rmd128 | rmd160 | rmd256 | RIPEMD-128 | RIPEMD-160 | RIPEMD-256 (auto)

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
- SipHash | halfsiphash (auto)
- tabulation hashing | tabulation (auto)
- sdbm (auto)
- Pearson hashing | Pearson hash (auto)
- Buzhash (auto)
- Zobrist hashing | Zobrist hash (auto)
- Fletcher's checksum | Fletcher-16 | Fletcher-32 (auto)
- PJW hash | ELF hash (auto)
- FxHash (auto)
- HighwayHash (auto)
- SpookyHash | Spooky | SpookyV2 (auto)
- lookup3 | Jenkins hash | one-at-a-time (auto)
- wyhash | wyhash32 | wyhash_condom (auto)
- aHash (auto)
- SeaHash (auto)
- SuperFastHash (auto)
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
- FarmHash | farmhash-c (auto)

## Bit Flip
- MeowHash | meow_hash_x64_aesni
  note: Casey Muratori's AES-NI throughput monster designed to saturate memory bandwidth.
