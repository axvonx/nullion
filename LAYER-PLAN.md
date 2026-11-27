# Nullion Layer & Setpiece Plan

> **Status (2026-11-26): Implemented.** All 29 layer setpiece revisions, deep-layer prop silhouette upgrades, Ring −3 scanline softening, and the vertical **"Reached" → Fly-to-Stack on Unwind further** choreography are live on `master`.

A focused visual-readability and landmark pass across all **29 layers** (10 Daily ★ + 19 Endless), plus the **"Reached" → Fly-to-Stack** layer-entry choreography.

---

## Core Design Principles

1. **Monumental, unmistakable setpieces**: Every layer should have at least one large architectural landmark you can identify in < 0.5 seconds from silhouette alone (like Application's mountains, Libraries' rose window, Kernel's 3 giant cogs, Firmware's blast door, or Ring −2's shattered clock).
2. **Break the rectangle in low-color layers**: Up in Application and Runtime, full color lets a `14×10` box read as a calendar or chart. By Firmware (4-color green), Ring −2 (grayscale), and **Ring −3 (1-bit)**, color is gone — hollow rectangles with 3 dots/lines inside collapse into generic, duplicated geometric noise. Deep-layer props must be recognizable from their **outer silhouette alone** (padlock, key, logic gate, transistor, capacitor, oscilloscope, IC chip with protruding pins, cracked watch, mirror shard, fuse, antenna).
3. **Quality over forced count**: Relax `checkLibrary(..., 20)` for deep/abyssal layers (Ring −1, Ring −2, Ring −3, Zone F) to **10–14 curated, larger silhouettes** (`18×14` to `34×24`, solid fills + bold 2px cutouts) instead of padding to 20 with indistinct micro-boxes.
4. **Crisp 1-bit rendering in Ring −3**: The global odd-row scanlines (`rgba(0,0,0,0.3)`) zebra-stripe crisp 1-bit white verticals into gray/white ladders. Soften or disable scanlines in `ring-3` so 1-bit silhouettes read razor-sharp.
5. **Fixed top ledges for critters & zero intrusion**: Any prop or topic-flipped display keeps a flat top edge at `y` inside its exact `(x, y, w, h)` placement box so System Biosphere critters always have clean landing ledges and never collide with neighbors.

---

## Layer-Entry Choreography ("Reached" → Fly to RHS Stack)

Instead of new layers silently appearing on the RHS stack mid-dive:
1. During a dive, the RHS stack holds at the pre-dive layer so nothing spoils or piles on silently.
2. When the dive lands and the reveal opens (tier name + 7-pip ladder + answer + note), if the dive crossed into one or more new layers, a **`REACHED`** section appears cleanly below the reveal note.
3. The newly reached layer badge(s) — rendered with the exact same `9×9` pixel icon + crude `5×7` bitmap label + palette border as the RHS stack — stack **vertically** in descent order (e.g. `Runtime` above `Libraries` on a 2-layer jump) and stay parked in the reveal so the player can read them at their own pace.
4. When the player presses **"Unwind further"**, each badge **flies smoothly (`760 ms`, `260 ms` stagger) from its exact reveal position over to its exact target slot at the bottom of the RHS stack**, landing with the crunch squash, seam sparks, stack recoil, `sound.stackCrunch`, and delayed plain-English `LAYER_BLURBS` tooltip.
5. On the final round (entering the end-of-day card) or under `reducedMotion()`, flight is skipped and the RHS stack snaps cleanly.

---

## Complete 29-Layer Setpiece & Readability Audit

★ = Core 10 Daily layers (highest priority).

### Zone A — Above Application & Desktop
1. **`internet` (Internet / BGP)** — *Good*
   - **Current:** Curved Earth horizon, 4 fiber towers with 5 animated packet arcs, twin flanking satellite dishes, 5 drifting satellites.
   - **Revision:** Add a thick undersea fiber-optic trunk plunging from the curved horizon down into the Browser seam.
2. **`browser` (Browser / Compositor)** — *Needs polish*
   - **Current:** Full-bleed browser frame + 3 wireframe cards + DOM tree highlight + green scan bar.
   - **Revision:** Add a giant pixel **magnifying glass / DevTools element-inspector overlay** highlighting a card, plus a chunky pixel scrollbar along the right margin.
3. ★ **`application` (Application)** — *Strong (Keep)*
   - **Current:** Sunlit sky, cumulus clouds, 3-tier snow-capped mountains, alpine lake shimmer, hot-air balloon, dock floor.
   - **Revision:** Keep as-is; already iconic and immediately readable.

### Zone B — Runtime & Libraries
4. **`bytecode` (AST & Bytecode)** — *Good — tweak*
   - **Current:** Central 4-tier binary AST tree with amber token pulses + left/right tape columns.
   - **Revision:** Differentiate branch vs leaf node shapes (diamonds vs rounded pills) and punch film-style sprocket holes into the flanking bytecode tape strips.
5. **`jit` (JIT & Inline Caches)** — *Good — tweak*
   - **Current:** Central 116px molten crucible ring with 6 orbiting sparks + side induction coils + molten pour.
   - **Revision:** Add a **giant anvil / forge-hammer silhouette** or glowing ingot molds beside the crucible so it unmistakably reads as *"forging hot loops into native machine code"*.
6. ★ **`runtime` (Runtime / Heap & GC)** — *Good — tweak*
   - **Current:** Steel support towers, upper truss bridge, sweeping GC electromagnet crane, lower heap catwalk with moving blocks.
   - **Revision:** Have the sweeping electromagnet crane **visibly carry a glowing memory block** and add a recognizable **compactor / incinerator bin** on the lower catwalk.
7. ★ **`libraries` (Libraries)** — *Strong (Keep)*
   - **Current:** Timber cathedral bookshelf arches, central brass rose window with drifting dust motes, rolling library ladder.
   - **Revision:** Keep as-is; one of the strongest setpieces in the game.
8. **`linker` (Dynamic Linker / ABI)** — *Good — tweak*
   - **Current:** Left/right jack racks, central GOT/PLT pillar, 6 catenary patch cables with traveling yellow pulse.
   - **Revision:** Add chunky plug barrels sticking out of the jack bays and 1–2 dangling unplugged patch cords for an unmistakable vintage switchboard silhouette.

### Zone C — Userspace & Kernel
9. ★ **`userspace` (OS userspace)** — *Strong (Keep)*
   - **Current:** 2-tier midnight blue metropolis skyline, central PID 1 spire with searchlight, elevated lit monorail train, crossing blimp.
   - **Revision:** Keep as-is; iconic and super readable.
10. **`kernel-entry` (Kernel Entry & VFS Gate)** — *Good — tweak*
    - **Current:** Full-width riveted dam bulkhead, central cyan syscall sluice gate with scanning bar, flanking pressure gauges, searchlights.
    - **Revision:** Add **chunky striped blast-gate teeth / portcullis bars** partially raised inside the sluice opening so it immediately reads as a privilege boundary gate.
11. ★ **`kernel` (Kernel)** — *Strong (Keep)*
    - **Current:** Red flanged steam pipes, 3 massive interlocking rotating cogwheels (steel + brass), rising embers.
    - **Revision:** Keep as-is; iconic silhouette.
12. **`kernel-arch` (Arch & Interrupt Core)** — *Needs polish*
    - **Current:** Central vertical slab + 10 thin horizontal IRQ lines + side racks.
    - **Revision:** Reshape the central monolith into a **colossal interrupt / Tesla relay spire** with thick stepped copper busbars and bold IRQ pin collars.

### Zone D — Drivers, Bus & Firmware
13. ★ **`drivers` (Drivers)** — *Needs polish*
    - **Current:** Top/bottom cyan-magenta bus rails, 45° trace highways, central 74×74 hollow Northbridge BGA square, 4 spinning corner fans.
    - **Revision:** Replace the hollow central square with a **bold extruded heatsink fin array + diagonal copper heatpipes**, and add chunky flanking **PCIe & DIMM connector slots** on the left/right wings.
14. **`bus-fabric` (PCIe / DMA Fabric)** — *Needs polish*
    - **Current:** 10 diagonal cyan/magenta lines + small 48px hollow diamond + edge pins.
    - **Revision:** Scale the central **PCIe arbiter crossbar** up 2× with visible internal switch matrices, and bundle the diagonals into chunky 4-lane ribbon highways with directional arrows.
15. ★ **`firmware` (Firmware)** — *Strong — minor polish*
    - **Current:** Riveted vault bulkhead, colossal 132px circular bank-vault blast door with rotating 4-spoke combination wheel, hydraulic locking bars, scrolling hex columns.
    - **Revision:** Add a chunky **heavy hinge block & keyway** on the vault door rim, and prune generic small rectangles in `lib-lower.ts` in favor of recognizable hardware silhouettes (BIOS chip, CMOS coin battery, DIP switch, floppy disk, padlock key).

### Zone E — Hidden Rings & ME MINIX
16. **`vmm` (VMM & Virtual Devices)** — *Weak — needs overhaul*
    - **Current:** Top beam + 3 thin hollow wireframe boxes hanging on 2 lines each.
    - **Revision:** Build a **giant marionette crossbar** with angled control strings suspending **recognizable miniature computer silhouettes** (CRT monitor + tower + floppy slot), with one visibly flickering as a live clone.
17. ★ **`ring-1` (Ring −1)** — *Weak — needs overhaul*
    - **Current:** 7 nested 1-point perspective wireframe rectangles + corner lines + dashed center seam.
    - **Revision:** Suspend **two large mirrored guest-OS silhouettes** facing each other across the vertical mirror axis (reflecting each other's details) plus a bold **hypervisor visor/lens** at the vanishing point. Replace generic green scatter boxes with distinct silhouettes (mirror shards, twin masks, split frames, VM eyes).
18. **`ept` (EPT & IOMMU)** — *Weak — needs overhaul*
    - **Current:** Two thin flat 5-line horizontal grids + 3 vertical moving lines.
    - **Revision:** Draw two **angled isometric checkerboard page-table slabs** (Guest Physical above, Host Physical below) linked by bold address-translation beams passing through **padlocked IOMMU quarantine rings**.
19. ★ **`ring-2` (Ring −2)** — *Strong — minor polish*
    - **Current:** Colossal 136px frozen shattered clockface, frozen hands & angled pendulum, radiating fracture webs, monochrome shards.
    - **Revision:** Thicken the clock hands & pendulum rod to 2px so the frozen clock reads immediately; replace generic gray scatter rectangles with unmistakably frozen silhouettes (frozen hourglass, cracked pocket watch, suspended droplet, stopped metronome).
20. **`smram` (SMRAM Vault / TSEG)** — *Weak — needs overhaul*
    - **Current:** Vertical gray pillars + plain 64×104 rectangle with a 3px white slit.
    - **Revision:** Replace the plain slab with a **colossal armored padlock** — huge thick U-shaped shackle arching across the upper band, riveted armored lock body with an oversized **keyhole** and horizontal deadbolt bars, and **heavy pixel chains** bolting it to the flanking pillars.
21. ★ **`ring-3` (Ring −3)** — *Weak (empty in `setpieces.ts`) — needs overhaul*
    - **Current:** Empty `case 'ring-3': break;` in `setpieces.ts`; relies only on the 41×41 central core + power rails in `art-v4.ts`.
    - **Revision:** Add a real **1-bit microscope silicon-die floorplan** behind the always-on core: angled **bond-wire fanouts** to giant perimeter leadframes, massive **macro SRAM/ROM array blocks** flanking left & right, bold 1-bit bus trunks, **disable/soften scanlines in Ring −3** to stop zebra-striping, and replace generic hollow boxes in `lib-lower.ts` with unmistakable 1-bit schematic silhouettes (logic gates, transistor, diode, capacitor, padlock, antenna, die core).
22. **`me-minix-user` (ME MINIX 3 Userspace)** — *Strong — minor polish*
    - **Current:** Giant amber QFP chip package with PCB leads enclosing a glowing miniature city skyline + blinking beacon + dot-matrix ticker.
    - **Revision:** Add a tiny **amber antenna spire & miniature monorail** inside the chip cavity to echo Userspace in miniature.
23. **`me-minix-kern` (MINIX 3 Microkernel)** — *Good — tweak*
    - **Current:** Central 56px ring + 12 radial spokes to small 10×10 boxes with traveling dots.
    - **Revision:** Give the satellite nodes distinct tiny server icons (disk, clock, net, tty) and thicken the central hub into a chunky **pneumatic ring-switch**.

### Zone F — Deep Silicon, Lithography & Physics
24. **`uarch` (Microarchitecture)** — *Needs polish*
    - **Current:** 3 small left boxes + 2 diagonal lines (taken vs ghost branch) + small right boxes.
    - **Revision:** Make a **giant iconic ALU chevron** (`V`-notched trapezoid) the centerpiece, with bold parallel pipeline lanes feeding into it and a larger, clearer flickering mispredict branch.
25. **`rtl` (RTL & Logic Gates)** — *Needs polish*
    - **Current:** Thin 1–2px fractal H-tree + top/bottom timing waveforms.
    - **Revision:** Thicken the H-tree trunks and anchor **large, unmistakable logic gate silhouettes** (`AND`, `OR`, `XOR`, `NOT` bubble) at the 4 major branch junctions.
26. **`cmos` (CMOS & Metal Layers)** — *Strong (Keep)*
    - **Current:** 4-color wafer mask cross-section (teal diffusion wells, violet poly gates, white contact vias, copper metal buses with charge pulses).
    - **Revision:** Keep as-is; super authentic and visually distinct.
27. **`litho` (Photolithography & Lattice)** — *Good — tweak*
    - **Current:** Crystal lattice dots + concentric Fresnel rings + expanding EUV wavefront + crosshairs.
    - **Revision:** Add **giant curved EUV condenser mirror arcs** framing the left and right edges, focusing beams onto the central reticle.
28. **`bandgap` (Bandgap & Tunneling)** — *Good — tweak*
    - **Current:** Top Conduction band, bottom Valence band, sine wave, thin central barrier wall, 2 tunneling dashes.
    - **Revision:** Make the central **quantum potential barrier** taller and bolder with a visible **evanescent exponential decay wave** tunneling through it into bright electron orbs on the far side.
29. **`landauer` (Landauer Limit)** — *Good — tweak*
    - **Current:** Enormous bottom entropy horizon arcs + breathing pulse ring + rare diagonal cosmic-ray strike.
    - **Revision:** Add a **lone glowing bit (`0`/`1`) hovering above the event horizon**, periodically dissolving into expanding heat-dissipation ripples (`kT ln 2`) as it erases.

---

## Execution Order
1. **Pass 1 (Daily Deep Layers + SMRAM)**: Overhaul ★ `ring-3` (die floorplan + 1-bit scanline fix), ★ `ring-1` (mirrored guest silhouettes), ★ `drivers` (heatsink-finned Northbridge + PCIe slots), thicken ★ `ring-2` clock hands, build **`smram`'s colossal armored padlock + chains**, and replace generic filler boxes in `Firmware` / `Ring −1` / `Ring −2` / `Ring −3` with bold silhouettes.
2. **Pass 2 (Endless Setpieces)**: Overhaul `vmm`, `ept`, `uarch`, `rtl`, and polish `browser`, `bytecode`, `jit`, `linker`, `kernel-entry`, `kernel-arch`, `bus-fabric`, `litho`, `bandgap`, `landauer`.
