# Name a CPU side-channel attack
id: cpu-side-channel-attack · domain: hardware-security-history · status: approved
> a named attack that infers secret data from CPU microarchitectural behaviour such as timing, caches or power, as described in papers or disclosures.

## Off-by-one
- Spectre (auto)
- Meltdown | Rogue Data Cache Load (auto)
- Rowhammer (auto)
- Timing attack | cache timing attack (auto)
- Power analysis | DPA | differential power analysis | SPA (auto)

## Works on my machine
- L1 Terminal Fault | L1TF | Foreshadow
  note: Foreshadow — the first speculative-execution leak people name after Spectre and Meltdown.

## Null pointer exception
- Prime+Probe | Prime and Probe (auto)
- Flush+Reload | Flush and Reload (auto)
- Plundervolt (auto)
- Branch target injection | BTI (auto)
- Bounds check bypass | BCB (auto)
- Acoustic cryptanalysis | acoustic side-channel (auto)
- Electromagnetic attack | EM side-channel | TEMPEST (auto)
- GhostRace (auto)

## Memory leak
- Microarchitectural Data Sampling | MDS (auto)
- Gather Data Sampling | Downfall | GDS (auto)
- ZombieLoad (auto)
- Spectre v1 (auto)
- Spectre v2 (auto)

## Race condition
- TSX Async Abort | TAA | TSX Asynchronous Abort (auto)
- Special Register Buffer Data Sampling | SRBDS | CrossTalk (auto)
- Speculative Return Stack Overflow | SRSO | Inception (auto)
- Processor MMIO Stale Data | MMIO Stale Data (auto)
- Register File Data Sampling | RFDS | reg-file-data-sampling (auto)
- Indirect Target Selection | ITS (auto)
- RIDL | Rogue In-Flight Data Load (auto)
- Fallout | Microarchitectural Store Buffer Data Sampling | MSBDS (auto)
- CacheOut (auto)
- SGAxe (auto)
- Load Value Injection | LVI (auto)
- Spectre v4 | Speculative store bypass | SSB (auto)
- Branch History Injection (auto)
- Retbleed (auto)
- SpectreRSB (auto)
- BranchScope (auto)
- Flush+Flush | Flush and Flush (auto)
- Evict+Reload (auto)
- Evict+Time | Evict and Time (auto)
- Hertzbleed (auto)
- PLATYPUS (auto)
- Zenbleed (auto)
- GoFetch (auto)
- NetSpectre (auto)
- TLBleed (auto)
- PortSmash (auto)
- PACMAN (auto)

## Heisenbug
- VMSCAPE (auto)
- Augury (auto)
- SWAPGS attack (auto)
- SMoTherSpectre (auto)
- Spectre-PHT (auto)
- Branch Privilege Injection (auto)
- Training Solo (auto)
- Phantom (auto)
- Prime+Abort (auto)
- ret2spec (auto)
- MeltdownPrime (auto)
- SpectrePrime (auto)

## Bit Flip
- Collide+Power
  note: Leaks secrets across cores by measuring power-draw differences when cache lines collide.
