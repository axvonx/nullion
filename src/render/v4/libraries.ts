import type { LayerId } from '../../core/layers';
import {
  BANDGAP_ANCHORS,
  BANDGAP_BESPOKE,
  BROWSER_ANCHORS,
  BROWSER_BESPOKE,
  BUS_FABRIC_ANCHORS,
  BUS_FABRIC_BESPOKE,
  BYTECODE_ANCHORS,
  BYTECODE_BESPOKE,
  CMOS_ANCHORS,
  CMOS_BESPOKE,
  EPT_ANCHORS,
  EPT_BESPOKE,
  INTERNET_ANCHORS,
  INTERNET_BESPOKE,
  JIT_ANCHORS,
  JIT_BESPOKE,
  KERNEL_ARCH_ANCHORS,
  KERNEL_ARCH_BESPOKE,
  KERNEL_ENTRY_ANCHORS,
  KERNEL_ENTRY_BESPOKE,
  LANDAUER_ANCHORS,
  LANDAUER_BESPOKE,
  LINKER_ANCHORS,
  LINKER_BESPOKE,
  LITHO_ANCHORS,
  LITHO_BESPOKE,
  ME_MINIX_KERN_ANCHORS,
  ME_MINIX_KERN_BESPOKE,
  ME_MINIX_USER_ANCHORS,
  ME_MINIX_USER_BESPOKE,
  RTL_ANCHORS,
  RTL_BESPOKE,
  SMRAM_ANCHORS,
  SMRAM_BESPOKE,
  UARCH_ANCHORS,
  UARCH_BESPOKE,
  VMM_ANCHORS,
  VMM_BESPOKE,
} from './lib-endless';
import { KTHREAD_KABIN_ANCHORS, KTHREAD_KABIN_BESPOKE, SLAB_SPA_ANCHORS, SLAB_SPA_BESPOKE } from './lib-true-endless';
import { DRIVERS, DRIVERS_ANCHORS, FIRMWARE, FIRMWARE_ANCHORS, RING1, RING1_ANCHORS, RING2, RING2_ANCHORS, RING3, RING3_ANCHORS } from './lib-lower';
import { KERNEL, KERNEL_ANCHORS, LIBRARIES, LIBRARIES_ANCHORS, USERSPACE, USERSPACE_ANCHORS } from './lib-mid';
import { APPLICATION, APPLICATION_ANCHORS, RUNTIME, RUNTIME_ANCHORS } from './lib-upper';
import { LAYER_TOPIC_TAGS } from './layer-topics';
import { buildLibraries, type LayerSpec } from './library';
import type { Library } from './place';

/**
 * Every layer's v4 library across all 29 Daily + Endless layers, built by one function (`buildLibraries`, library.ts)
 * from each layer's own entities and an optional borrow from a Daily layer. The 10 core Daily layers carry 25+ own
 * props; the Endless layers pair bespoke props with borrowed copies (`${prefix}-${donor id}`) up to 20 types, and
 * the deep abyssal layers stay sparser for contrast.
 *
 * kernel-arch, litho, bandgap and landauer borrow up to 20 plus their own late additions (two, two, one, one), so they
 * keep exactly the donor copies the naming desk already has records for.
 */
const SPECS: Record<LayerId, LayerSpec> = {
  // Zone A: above Application
  internet: { own: INTERNET_BESPOKE, anchors: INTERNET_ANCHORS, borrow: { from: 'application', prefix: 'net', upTo: 20 }, density: 4.0, anchorCount: 2, far: 0.45 },
  browser: { own: BROWSER_BESPOKE, anchors: BROWSER_ANCHORS, borrow: { from: 'application', prefix: 'br', upTo: 20 }, density: 4.4, anchorCount: 2, far: 0.45 },
  application: { own: APPLICATION, anchors: APPLICATION_ANCHORS, density: 4.6, anchorCount: 2, far: 0.45 },
  // Zone B: expanded Runtime and Libraries
  bytecode: { own: BYTECODE_BESPOKE, anchors: BYTECODE_ANCHORS, borrow: { from: 'runtime', prefix: 'bc', upTo: 20 }, density: 4.2, anchorCount: 2, far: 0.4 },
  jit: { own: JIT_BESPOKE, anchors: JIT_ANCHORS, borrow: { from: 'runtime', prefix: 'jit', upTo: 20 }, density: 4.3, anchorCount: 2, far: 0.4 },
  runtime: { own: RUNTIME, anchors: RUNTIME_ANCHORS, density: 4.6, anchorCount: 2, far: 0.45 },
  libraries: { own: LIBRARIES, anchors: LIBRARIES_ANCHORS, density: 4.4, anchorCount: 2, far: 0.4, floorOffset: 4 },
  linker: { own: LINKER_BESPOKE, anchors: LINKER_ANCHORS, borrow: { from: 'libraries', prefix: 'ld', upTo: 20 }, density: 4.2, anchorCount: 2, far: 0.35 },
  // Zone C: Userspace and the expanded OS kernel
  userspace: { own: USERSPACE, anchors: USERSPACE_ANCHORS, density: 4.4, anchorCount: 2, far: 0.45, floorOffset: 6 },
  'kernel-entry': { own: KERNEL_ENTRY_BESPOKE, anchors: KERNEL_ENTRY_ANCHORS, borrow: { from: 'kernel', prefix: 'ke', upTo: 20 }, density: 4.2, anchorCount: 2, far: 0.4 },
  kernel: { own: KERNEL, anchors: KERNEL_ANCHORS, density: 4.4, anchorCount: 2, far: 0.4 },
  'kernel-arch': { own: KERNEL_ARCH_BESPOKE, anchors: KERNEL_ARCH_ANCHORS, borrow: { from: 'kernel', prefix: 'ka', upTo: 22 }, density: 4.2, anchorCount: 2, far: 0.35 },
  // Zone D: Drivers, bus and Firmware
  drivers: { own: DRIVERS, anchors: DRIVERS_ANCHORS, density: 4.6, anchorCount: 2, far: 0.4 },
  'bus-fabric': { own: BUS_FABRIC_BESPOKE, anchors: BUS_FABRIC_ANCHORS, borrow: { from: 'drivers', prefix: 'bf', upTo: 20 }, density: 4.2, anchorCount: 2, far: 0.35 },
  firmware: { own: FIRMWARE, anchors: FIRMWARE_ANCHORS, density: 4.4, anchorCount: 2, far: 0.4 },
  // Zone E: expanded hidden rings and MINIX-inside-ME
  vmm: { own: VMM_BESPOKE, anchors: VMM_ANCHORS, borrow: { from: 'ring-1', prefix: 'vmm', upTo: 20 }, density: 4.0, anchorCount: 2, far: 0.35 },
  'ring-1': { own: RING1, anchors: RING1_ANCHORS, density: 4.2, anchorCount: 2, far: 0.4 },
  ept: { own: EPT_BESPOKE, anchors: EPT_ANCHORS, borrow: { from: 'ring-1', prefix: 'ept', upTo: 20 }, density: 4.0, anchorCount: 2, far: 0.35 },
  'ring-2': { own: RING2, anchors: RING2_ANCHORS, density: 4.4, anchorCount: 2, far: 0.4 },
  smram: { own: SMRAM_BESPOKE, anchors: SMRAM_ANCHORS, borrow: { from: 'ring-2', prefix: 'sm', upTo: 20 }, density: 3.8, anchorCount: 2, far: 0.3 },
  'ring-3': { own: RING3, anchors: RING3_ANCHORS, density: 2.2, anchorCount: 1, far: 0 },
  'me-minix-user': { own: ME_MINIX_USER_BESPOKE, anchors: ME_MINIX_USER_ANCHORS, borrow: { from: 'userspace', prefix: 'mx', upTo: 20 }, density: 3.8, anchorCount: 2, far: 0.3 },
  'me-minix-kern': { own: ME_MINIX_KERN_BESPOKE, anchors: ME_MINIX_KERN_ANCHORS, borrow: { from: 'firmware', prefix: 'mk', upTo: 20 }, density: 3.6, anchorCount: 2, far: 0.25 },
  // Zone F: deep silicon, lithography and the physics abyss
  uarch: { own: UARCH_BESPOKE, anchors: UARCH_ANCHORS, borrow: { from: 'ring-3', prefix: 'ua', upTo: 20 }, density: 3.4, anchorCount: 2, far: 0.25 },
  rtl: { own: RTL_BESPOKE, anchors: RTL_ANCHORS, borrow: { from: 'ring-3', prefix: 'rtl', upTo: 20 }, density: 3.2, anchorCount: 2, far: 0.2 },
  cmos: { own: CMOS_BESPOKE, anchors: CMOS_ANCHORS, borrow: { from: 'ring-3', prefix: 'cm', upTo: 20 }, density: 3.4, anchorCount: 2, far: 0.25 },
  litho: { own: LITHO_BESPOKE, anchors: LITHO_ANCHORS, borrow: { from: 'ring-3', prefix: 'li', upTo: 22 }, density: 2.8, anchorCount: 1, far: 0.2 },
  bandgap: { own: BANDGAP_BESPOKE, anchors: BANDGAP_ANCHORS, borrow: { from: 'ring-3', prefix: 'bg', upTo: 21 }, density: 2.4, anchorCount: 1, far: 0.15 },
  landauer: { own: LANDAUER_BESPOKE, anchors: LANDAUER_ANCHORS, borrow: { from: 'ring-3', prefix: 'la', upTo: 21 }, density: 1.8, anchorCount: 1, far: 0 },
  // True Endless: worldbuilt pocket-universes
  'slab-spa': { own: SLAB_SPA_BESPOKE, anchors: SLAB_SPA_ANCHORS, density: 2.8, anchorCount: 1, far: 0 },
  'kthread-kabin': { own: KTHREAD_KABIN_BESPOKE, anchors: KTHREAD_KABIN_ANCHORS, borrow: { from: 'userspace', prefix: 'kabin', upTo: 20 }, density: 2.8, anchorCount: 1, far: 0 },
};

export const V4_LIBRARIES: Record<LayerId, Library> = buildLibraries(SPECS, LAYER_TOPIC_TAGS);
