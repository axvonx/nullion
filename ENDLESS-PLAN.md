# nullion — Endless Mode Plan (`ENDLESS-PLAN.md`)

> **Status:** Planning blueprint (post-v4 scalability & 2-stream semi-randomization refactor `203905f`).  
> **Goal:** A finite-but-deep (~2,500-frame) Endless descent inspired by *krillion.io*—expanding the computing stack **upwards**, **through the middle** (de-opaquing Runtime, Kernel, Ring −1, Ring −2, and Ring −3 without faking peer hierarchies), and **downwards** through the Intel ME's hidden MINIX 3 OS into microarchitecture, silicon, and fundamental physics.

---

## 1. Core Gameplay Loop (Endless Mode)

- **Watchdog per prompt:** Every question has a live watchdog timer (starts at `30s`, gradually tightening as you cross deeper strata: e.g., `30s` upper stack → `25s` kernel/hardware → `20s` hidden rings/MINIX → `16s` silicon/physics).
- **3 Strikes and You're Out:** Missing a prompt (watchdog timeout) burns **1 of 3 Watchdog Strikes** (shown as 3 pixel fuses/shields in the top bar). On the 3rd strike, the run terminates in a `KERNEL PANIC` / `STACK OVERFLOW` end-of-run card showing:
  - Total frames unwound & deepest layer reached
  - Best single-question tier & streak
  - Personal-best depth (`localStorage`) & shareable Endless result string
- **Finite True Bottom (`2,500` frames):** Reaching the **Landauer Limit (`kT ln 2`)** at `2,500` frames is a legendary "true ending" milestone (players can still keep going past `2,500` in the abyss for high-score bragging rights).
- **Question Pool & Anti-Repeat:** Draws from the full question bank with a rolling anti-repeat window; as depth increases, optionally weights toward deeper/harder prompts.
- **Debug-Build Entry Point (Phase 1):** Add a simple **"Endless"** toggle chip at the top-right of the header in debug builds first, sharing the same `Scene`, `Hud`, `CritterSystem`, and `SoundEngine` via a stack profile (`DAILY_STACK` vs `ENDLESS_STACK`). Production mode-switcher UI comes later.

---

## 2. Architecture & Reuse Strategy

### Already Completed (`203905f`)
- **2-stream semi-randomization** (`anchorRand` vs `scatterRand`): major set pieces stay recognizable while minor props rearrange every run.
- **Lazy per-band placement** (`placeBandForSpec` in `art-v4.ts`): O(1) startup & resize even with 28+ layers.
- **O(N) far-plane spatial grid** (`place.ts`) + **O(log N + visible) binary-search draw** (`art-v4.ts`).
- **Bounded LRU sprite bake cache** (`MAX_BAKE_CACHE = 600` in `kit.ts`).

### Fast Art Scaling: Reuse + Palette Tinting + Signature Props
Rather than drawing 20+ brand-new props from scratch for every expanded sub-layer, intermediate layers can **remix existing libraries with a distinct palette/tint + 4–6 bespoke signature props + 1 new anchor**:
- **AST & Bytecode** / **JIT & Inline Caches** reuse Runtime girders/blocks tinted **amber-indigo** and **molten orange-indigo**, spotlighting `rt-tape`, `rt-interp`, and `rt-jit` alongside new signature props.
- **Dynamic Linker & ABI** remixes Libraries' wood/brass aesthetic into **cool slate + brass** with ELF/PLT/GOT switchboards.
- **Kernel Entry / Core / Arch** remix Kernel's CGA 16 machine room across **cool steel-cyan → warm furnace → high-contrast red/amber** while keeping peer subsystems (*Scheduler / MM / VFS / Netstack*) as **semi-random per-run wings** inside Kernel Core—never faking a vertical order among peers.
- **PCIe / DMA / Bus Fabric** extends Drivers' CGA 4 palette into wide magenta/white interconnect highways.
- **ME MINIX 3 Userspace** is a **miniature amber-on-black remix** of OS Userspace (4×4 micro-daemons & tiny towers)—immediately legible as "a tiny secret OS living inside the chip!"

---

## 3. Full Endless Stack Top-to-Bottom (28 Layers, `0 → 2,500` Frames)

### Zone A — Above Application (`0 → 120` frames)
| # | ID | Layer Name | Frames | Boundary | Palette / Tint | Signature Set Pieces & Props | Critters (`MotionType` Set) | Sound Timbre |
|---|---|---|---|---|---|---|---|---|
| 1 | `internet` | **Internet / BGP** | `0` | — | Daylight warm sky + pastel fiber arcs | Submarine cable landing, BGP route boards, DNS root towers, ASN clouds | **Packet swallows** `{ Fly, Perch }` | Airy plucked harp / chime |
| 2 | `browser` | **Browser / Compositor** | `55` | `render` | Crisp UI full color + subtle grid | DOM tree trellis, CSS paint tiles, compositor layers, tab strip | **DOM fireflies** `{ Fly, Perch }` | Crisp glass marimba |
| 3 | `application` | **Application** | `120` | — | Full color sky *(current)* | Cascading windows, app launcher, dock | **Songbirds** `{ Fly, Perch }` | Warm harmonic triangle |

*(Note: We can easily make starting at `internet` vs `application` a config flag on `ENDLESS_STACK`.)*

---

### Zone B — Expanded Runtime & Libraries (`190 → 550` frames)
| # | ID | Layer Name | Frames | Boundary | Palette / Tint | Signature Set Pieces & Props | Critters (`MotionType` Set) | Sound Timbre |
|---|---|---|---|---|---|---|---|---|
| 4 | `bytecode` | **AST & Bytecode** | `190` | `parse` | **Amber-Indigo `rgb6`** *(Runtime tint)* | Parse-tree scaffolding, bytecode reels, opcode strips, token streams | **Syntax sprites** `{ Hop, Perch }` | Bright wooden marimba/pluck |
| 5 | `jit` | **JIT & Inline Caches** | `265` | `compile` | **Molten Orange-Indigo `rgb6`** *(Runtime tint)* | Hot-loop anvil forge, inline-cache gates, deopt trapdoors, profiling counters | **Spark mites** `{ Zip, Perch }` | Crisp metallic FM ping |
| 6 | `runtime` | **Heap & GC** | `345` | — | Deep navy `rgb6` *(current)* | 3-deck heap scaffold, GC incinerator, tri-color sweeper | **Helper blobs** `{ Hop, Perch }` | Warm bouncy sine |
| 7 | `libraries` | **Libraries** | `430` | — | Wood / paper / brass `rgb4` *(current)* | Tall bookcases, printing press, brass globe, dependency pinboard | **Bookworm blobs** `{ Hop, Perch }` | Mellow low triangle |
| 8 | `linker` | **Dynamic Linker / ABI** | `515` | `dlopen` | **Cool Slate & Brass `rgb4`** *(Libraries tint)* | ELF symbol tables, PLT/GOT switchboards, relocation bridges, `ld.so` plaques | **Relay beetles** `{ Patrol, Hop }` | Dry woodblock click |

---

### Zone C — Expanded Userspace & OS Kernel (`605 → 1,035` frames)
| # | ID | Layer Name | Frames | Boundary | Palette / Tint | Signature Set Pieces & Props | Critters (`MotionType` Set) | Sound Timbre |
|---|---|---|---|---|---|---|---|---|
| 9 | `userspace` | **OS Userspace** | `605` | — | CGA 16 night city *(current)* | PID 1 spire, city skyline, IPC busbars, callboxes | **Horned daemons** `{ Patrol, Hop, Perch }` | Gritty pulse25 |
| 10 | `kernel-entry` | **Kernel Entry & VFS Gate** | `705` | `syscall` | **CGA 16 Cool Steel & Cyan** *(Kernel tint)* | Syscall dispatch table, `seccomp`/LSM checkpoints, `copy_from_user` turnstiles, VFS facade | **Gate-bots** `{ Patrol, Perch }` | Crisp relay click + saw |
| 11 | `kernel-core` | **Kernel Core (Peer Wings)** | `810` | — | **CGA 16 Warm Machine Room** *(current + per-run wing accent)* | Scheduler furnace + **semi-random peer wing** per run: *Scheduler* (runqueues, gears), *MM* (slabs, page tables), *VFS/Storage* (inodes, journals), or *Netstack* (ring buffers, sockets) | **Thread-bots** `{ Zip, Perch }` *(wing-colored visors)* | Industrial sawtooth |
| 12 | `kernel-arch` | **Arch & Interrupt Core** | `920` | `IRQ` | **CGA 16 High-Contrast Red/Amber** *(Kernel tint)* | IDT/APIC routing matrix, brass IRQ bells, `softirq`/RCU grace-period wheel, spinlocks, `CR3` TLB shootdowns | **IRQ-sparks** `{ Zip, Scuttle }` | Sharp brass bell + industrial pulse |

---

### Zone D — Drivers, Bus & Firmware (`1,035 → 1,300` frames)
| # | ID | Layer Name | Frames | Boundary | Palette / Tint | Signature Set Pieces & Props | Critters (`MotionType` Set) | Sound Timbre |
|---|---|---|---|---|---|---|---|---|
| 13 | `drivers` | **Device Drivers** | `1,035` | — | CGA 4 cyan/magenta PCB *(current)* | Backplane, HDD platter, oscilloscope, pin-header jumpers | **Bus-beetles** `{ Scuttle }` | Sharp square blip |
| 14 | `bus-fabric` | **PCIe / DMA Fabric** | `1,130` | `DMA` | **CGA 4 Magenta & White** *(Drivers tint)* | Multi-lane PCIe crossbar, DMA descriptor rings, MMIO address bars, bus arbiters | **Lane-runners** `{ Scuttle, Zip }` | Rapid digital sweep |
| 15 | `firmware` | **Firmware / UEFI** | `1,225` | `ACPI` | 4-level green phosphor *(current)* | Vault doors, ROM cabinets, POST displays, sealed ROM cartridges | **Sentinel drones** `{ Float }` | Hollow phosphor square |

---

### Zone E — Expanded Hidden Rings: Hypervisor, SMM & ME/MINIX (`1,325 → 1,860` frames)
| # | ID | Layer Name | Frames | Boundary | Palette / Tint | Signature Set Pieces & Props | Critters (`MotionType` Set) | Sound Timbre |
|---|---|---|---|---|---|---|---|---|
| 16 | `vmm` | **VMM & Virtual Devices** | `1,325` | `virtio` | **Green Phosphor + Ghost Wireframes** | Hollow emulated PCIe cards, `virtio` ring bridges, synthetic BIOS consoles | **Mimic-wisps** `{ Mirror, Perch }` | Hollow echoed square |
| 17 | `ring-1` | **VMX Root Core** | `1,425` | `VM exit` | 4-level green phosphor *(current)* | Twin facing mirror gates, nested VM bezels, swinging trapdoors, hypercall gates | **Mirror-wisps** `{ Mirror }` | Twin detuned FM |
| 18 | `ept` | **EPT & IOMMU** | `1,525` | `EPT` | **Dark Green Phosphor + Crisp Grid** | 2D guest→host page-walk lattices, barred VT-d quarantine cages, posted-IRQ matrices | **Shadow-walkers** `{ Grid, Mirror }` | Low resonant phase-shifted FM |
| 19 | `ring-2` | **SMI Trap & Freeze** | `1,625` | `SMI` | 5-level frozen grayscale *(current)* | Stopped clocktower, mid-air cascade, frozen metronome, frozen ripples | **Frozen silhouettes** `{ Frozen }` | Silent / frozen sub-hum |
| 20 | `smram` | **SMRAM Vault (`TSEG`)** | `1,710` | `TSEG` | **Deep Charcoal & Stark Silver** | Locked `D_LCK` blast doors, silent save-state ledgers (`0xFE00`), dim `RSM` exit beacon | **Silent sentinels** `{ Float }` *(ultra-slow, mute)* | Barely audible sub-drone |
| 21 | `ring-3` | **MEI / HECI Mailbox** | `1,790` | `ME` | 1-bit white-on-black *(current)* | Die seal ring, always-on core heartbeat, HECI doorbell chutes, power rails | **Bit-motes** `{ Grid }` | Crisp 1-bit click |
| 22 | `me-minix-user` | **ME MINIX 3 Userspace** | `1,865` | `AMT` | **Uncanny Miniature Amber-on-Black** *(Userspace remix)* | Tiny hidden POSIX city-in-a-bottle (`rs`, `pm`, `vfs`, AMT port `16992`) running while host is off | **Micro-daemons** `{ Patrol, Perch }` *(4×4 mini sprites)* | Tiny high-pitched bitcrushed chirp |
| 23 | `me-minix-kern` | **MINIX 3 Microkernel** | `1,945` | `IPC` | **Sparse Amber + 1-Bit** | Message-passing IPC tubes, tiny microkernel switchboard, ARC core register bank, fused keys | **IPC couriers** `{ Zip }` | Crisp teleprinter ticks |

---

### Zone F — Deep Silicon, Lithography & Fundamental Physics (`2,030 → 2,500` frames)
| # | ID | Layer Name | Frames | Boundary | Palette / Tint | Signature Set Pieces & Props | Critters (`MotionType` Set) | Sound Timbre |
|---|---|---|---|---|---|---|---|---|
| 24 | `uarch` | **Microarchitecture** | `2,030` | `μop` | **Blueprint Cyan & White on Black** | Branch-predictor forks, reorder buffer carousel, L1/L2/L3 cache banks, speculative ghost paths | **Speculative phantoms** `{ Zip, Mirror }` *(dissolve with `"mispredict!"`)* | Crisp clock-edge ticks |
| 25 | `rtl` | **RTL & Logic Gates** | `2,130` | `posedge` | **Oscilloscope 2-Bit Cyan/White** | Giant NAND/XOR gate arrays, D-flip-flop latches, H-tree clock spine, live timing waveforms | **Pulse gliders** `{ Scuttle, Grid }` | Pure square-wave logic pulses |
| 26 | `cmos` | **CMOS & Metal Layers** | `2,235` | `M1` | **Wafer-Mask 4-Color** (copper, violet poly, teal diffusion, white vias) | FinFET gate fingers, stacked M1–M8 via towers, doped well islands, standard-cell rails | **Charge carriers** `{ Scuttle, Float }` | Metallic resonant FM pings |
| 27 | `litho` | **Photolithography & Lattice** | `2,340` | `13.5nm` | **EUV Deep Violet & Stark White** | Interference fringe rings, diamond-cubic silicon lattice, lone glowing dopant atoms | **EUV photons** `{ Fly, Float }` | Shimmering high-harmonic sine |
| 28 | `bandgap` | **Bandgap & Tunneling** | `2,425` | `1.1eV` | **Abyssal Indigo & Pale Cyan** | Valence/conduction band strata, thin potential barriers, probability wave clouds | **Tunneling electrons** `{ Float, Grid }` *(occasionally phase through barriers)* | Ethereal sub-bass + glass shimmer |
| 29 | `landauer` | **Landauer Limit (`kT ln 2`)** | `2,500` | `kT ln 2` | **Pure Void + Rare Single-Pixel Sparks** | Near-empty abyss, faint entropy heat-dissipation rings, rare diagonal cosmic-ray bit-flip streaks | **Stray bits** `{ Float }` | Ultra-quiet deep drone + rare single bit-flip pop |

---

## 4. Phased Implementation Order

1. **Phase 1 — Mode Infrastructure & Debug Toggle**
   - Generalize `core/layers.ts` to support stack profiles (`DAILY_LAYERS` vs `ENDLESS_LAYERS`).
   - Add Endless game mode in `core/game.ts` (3-strike watchdog budget, tightening timer curve, anti-repeat prompt queue, `KERNEL PANIC` end state).
   - Wire the top-right **"Endless"** debug toggle chip + 3-strike fuse indicator in `hud.ts`.
2. **Phase 2 — Tinted Intermediate Layers (Zones A–E)**
   - Add palette-tinted remix layers (`bytecode`, `jit`, `linker`, `kernel-entry`, `kernel-arch`, `bus-fabric`, `vmm`, `ept`, `smram`, `me-minix-user`, `me-minix-kern`) with 4–6 bespoke props + 1 anchor each.
   - Add Kernel Core's semi-random per-run peer wing accent (*Scheduler / MM / VFS / Netstack*).
3. **Phase 3 — Bespoke Deep Hardware & Physics Layers (Zone F)**
   - Author `lib-deep.ts` (`uarch`, `rtl`, `cmos`, `litho`, `bandgap`, `landauer`) + their new `PaletteMode`s, critters, and `SoundEngine` timbres.
4. **Phase 4 — Production Polish**
   - Replace debug toggle with production Daily / Endless mode switcher on the title screen, `localStorage` personal-best depth tracking, and Endless share card.
