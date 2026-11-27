import type { LayerId } from '../../core/layers';
import { ENDLESS_EXTRA } from './lib-endless-extra';
import {
  BANDGAP,
  BANDGAP_ANCHORS,
  BROWSER,
  BROWSER_ANCHORS,
  BUS_FABRIC,
  BUS_FABRIC_ANCHORS,
  BYTECODE,
  BYTECODE_ANCHORS,
  CMOS,
  CMOS_ANCHORS,
  EPT,
  EPT_ANCHORS,
  INTERNET,
  INTERNET_ANCHORS,
  JIT,
  JIT_ANCHORS,
  KERNEL_ARCH,
  KERNEL_ARCH_ANCHORS,
  KERNEL_ENTRY,
  KERNEL_ENTRY_ANCHORS,
  LANDAUER,
  LANDAUER_ANCHORS,
  LINKER,
  LINKER_ANCHORS,
  LITHO,
  LITHO_ANCHORS,
  ME_MINIX_KERN,
  ME_MINIX_KERN_ANCHORS,
  ME_MINIX_USER,
  ME_MINIX_USER_ANCHORS,
  RTL,
  RTL_ANCHORS,
  SMRAM,
  SMRAM_ANCHORS,
  UARCH,
  UARCH_ANCHORS,
  VMM,
  VMM_ANCHORS,
} from './lib-endless';
import { KTHREAD_KABIN, KTHREAD_KABIN_ANCHORS, SLAB_SPA, SLAB_SPA_ANCHORS } from './lib-true-endless';
import { DRIVERS, DRIVERS_ANCHORS, FIRMWARE, FIRMWARE_ANCHORS, RING1, RING1_ANCHORS, RING2, RING2_ANCHORS, RING3, RING3_ANCHORS } from './lib-lower';
import { KERNEL, KERNEL_ANCHORS, LIBRARIES, LIBRARIES_ANCHORS, USERSPACE, USERSPACE_ANCHORS } from './lib-mid';
import { EXTRA_DAILY_TRINKETS } from './lib-trinkets';
import { APPLICATION, APPLICATION_ANCHORS, RUNTIME, RUNTIME_ANCHORS } from './lib-upper';
import type { Library } from './place';

/**
 * Every layer's v4 library across all 29 Daily + Endless layers: entity types, anchors, and density.
 * Each of the 10 core Daily layers now carries 25+ unique props; deep abyssal layers stay sparser for contrast.
 */
const BASE_LIBRARIES: Record<LayerId, Library> = {
  // Zone A — Above Application
  internet: { near: INTERNET, anchors: INTERNET_ANCHORS, density: 4.0, anchorCount: 2, far: 0.45 },
  browser: { near: BROWSER, anchors: BROWSER_ANCHORS, density: 4.4, anchorCount: 2, far: 0.45 },
  application: { near: [...APPLICATION, ...EXTRA_DAILY_TRINKETS.application], anchors: APPLICATION_ANCHORS, density: 4.6, anchorCount: 2, far: 0.45 },
  // Zone B — Expanded Runtime & Libraries
  bytecode: { near: BYTECODE, anchors: BYTECODE_ANCHORS, density: 4.2, anchorCount: 2, far: 0.4 },
  jit: { near: JIT, anchors: JIT_ANCHORS, density: 4.3, anchorCount: 2, far: 0.4 },
  runtime: { near: [...RUNTIME, ...EXTRA_DAILY_TRINKETS.runtime], anchors: RUNTIME_ANCHORS, density: 4.6, anchorCount: 2, far: 0.45 },
  libraries: {
    near: [...LIBRARIES, ...EXTRA_DAILY_TRINKETS.libraries],
    anchors: LIBRARIES_ANCHORS,
    density: 4.4,
    anchorCount: 2,
    far: 0.4,
    floor: { offset: 4, ids: new Set(['lib-shelf', 'lib-cart', 'lib-ladder', 'lib-desk', 'lib-catalogue', 'lib-lectern', 'lib-globe', 'lib-crates', 'lib-lamp']) },
  },
  linker: { near: LINKER, anchors: LINKER_ANCHORS, density: 4.2, anchorCount: 2, far: 0.35 },
  // Zone C — Userspace & Expanded OS Kernel
  userspace: {
    near: [...USERSPACE, ...EXTRA_DAILY_TRINKETS.userspace],
    anchors: USERSPACE_ANCHORS,
    density: 4.4,
    anchorCount: 2,
    far: 0.45,
    floor: { offset: 6, ids: new Set(['us-tower', 'us-mailbox', 'us-crontower', 'us-shm', 'us-signal', 'us-fork', 'us-callbox', 'us-container', 'us-hydrant', 'us-meter']) },
  },
  'kernel-entry': { near: KERNEL_ENTRY, anchors: KERNEL_ENTRY_ANCHORS, density: 4.2, anchorCount: 2, far: 0.4 },
  kernel: { near: [...KERNEL, ...EXTRA_DAILY_TRINKETS.kernel], anchors: KERNEL_ANCHORS, density: 4.4, anchorCount: 2, far: 0.4 },
  'kernel-arch': { near: KERNEL_ARCH, anchors: KERNEL_ARCH_ANCHORS, density: 4.2, anchorCount: 2, far: 0.35 },
  // Zone D — Drivers, Bus & Firmware
  drivers: { near: [...DRIVERS, ...EXTRA_DAILY_TRINKETS.drivers], anchors: DRIVERS_ANCHORS, density: 4.6, anchorCount: 2, far: 0.4 },
  'bus-fabric': { near: BUS_FABRIC, anchors: BUS_FABRIC_ANCHORS, density: 4.2, anchorCount: 2, far: 0.35 },
  firmware: { near: [...FIRMWARE, ...EXTRA_DAILY_TRINKETS.firmware], anchors: FIRMWARE_ANCHORS, density: 4.4, anchorCount: 2, far: 0.4 },
  // Zone E — Expanded Hidden Rings & MINIX-Inside-ME
  vmm: { near: VMM, anchors: VMM_ANCHORS, density: 4.0, anchorCount: 2, far: 0.35 },
  'ring-1': { near: [...RING1, ...EXTRA_DAILY_TRINKETS['ring-1']], anchors: RING1_ANCHORS, density: 4.2, anchorCount: 2, far: 0.4 },
  ept: { near: EPT, anchors: EPT_ANCHORS, density: 4.0, anchorCount: 2, far: 0.35 },
  'ring-2': { near: [...RING2, ...EXTRA_DAILY_TRINKETS['ring-2']], anchors: RING2_ANCHORS, density: 4.4, anchorCount: 2, far: 0.4 },
  smram: { near: SMRAM, anchors: SMRAM_ANCHORS, density: 3.8, anchorCount: 2, far: 0.3 },
  'ring-3': { near: [...RING3, ...EXTRA_DAILY_TRINKETS['ring-3']], anchors: RING3_ANCHORS, density: 2.2, anchorCount: 1, far: 0 },
  'me-minix-user': { near: ME_MINIX_USER, anchors: ME_MINIX_USER_ANCHORS, density: 3.8, anchorCount: 2, far: 0.3 },
  'me-minix-kern': { near: ME_MINIX_KERN, anchors: ME_MINIX_KERN_ANCHORS, density: 3.6, anchorCount: 2, far: 0.25 },
  // Zone F — Deep Silicon, Lithography & Physics Abyss
  uarch: { near: UARCH, anchors: UARCH_ANCHORS, density: 3.4, anchorCount: 2, far: 0.25 },
  rtl: { near: RTL, anchors: RTL_ANCHORS, density: 3.2, anchorCount: 2, far: 0.2 },
  cmos: { near: CMOS, anchors: CMOS_ANCHORS, density: 3.4, anchorCount: 2, far: 0.25 },
  litho: { near: LITHO, anchors: LITHO_ANCHORS, density: 2.8, anchorCount: 1, far: 0.2 },
  bandgap: { near: BANDGAP, anchors: BANDGAP_ANCHORS, density: 2.4, anchorCount: 1, far: 0.15 },
  landauer: { near: LANDAUER, anchors: LANDAUER_ANCHORS, density: 1.8, anchorCount: 1, far: 0 },
  // True Endless — Worldbuilt Pocket-Universes
  'slab-spa': { near: SLAB_SPA, anchors: SLAB_SPA_ANCHORS, density: 2.8, anchorCount: 1, far: 0 },
  'kthread-kabin': { near: KTHREAD_KABIN, anchors: KTHREAD_KABIN_ANCHORS, density: 2.8, anchorCount: 1, far: 0 },
};

/** The final libraries: base props plus the Endless-only extras, so adjacent bands stop repeating donor props. */
export const V4_LIBRARIES: Record<LayerId, Library> = Object.fromEntries(
  (Object.keys(BASE_LIBRARIES) as LayerId[]).map((id) => {
    const lib = BASE_LIBRARIES[id];
    const extra = ENDLESS_EXTRA[id];
    return [id, extra ? { ...lib, near: [...lib.near, ...extra] } : lib];
  }),
) as Record<LayerId, Library>;
