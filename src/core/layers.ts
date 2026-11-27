import { enforce } from './enforce';
import { MAX_TIER_FRAMES } from './tiers';

export const PROMPTS_PER_DAY = 7;
/** A perfect day (every answer a Bit Flip) reaches exactly the bottom layer. */
export const MAX_DEPTH = PROMPTS_PER_DAY * MAX_TIER_FRAMES; // 91
/** The true physical bottom of Endless Mode (Landauer Limit: kT ln 2). */
export const ENDLESS_MAX_DEPTH = 2500;
/** Debug preview depth for the True Endless realms beyond the Landauer Limit. */
export const TRUE_ENDLESS_MAX_DEPTH = 120;

export type StackMode = 'daily' | 'endless' | 'true-endless';

export type DailyLayerId =
  | 'application'
  | 'runtime'
  | 'libraries'
  | 'userspace'
  | 'kernel'
  | 'drivers'
  | 'firmware'
  | 'ring-1'
  | 'ring-2'
  | 'ring-3';

export type EndlessOnlyLayerId =
  | 'internet'
  | 'browser'
  | 'bytecode'
  | 'jit'
  | 'linker'
  | 'kernel-entry'
  | 'kernel-arch'
  | 'bus-fabric'
  | 'vmm'
  | 'ept'
  | 'smram'
  | 'me-minix-user'
  | 'me-minix-kern'
  | 'uarch'
  | 'rtl'
  | 'cmos'
  | 'litho'
  | 'bandgap'
  | 'landauer';

export type TrueEndlessLayerId = 'slab-spa' | 'kthread-kabin';

export type LayerId = DailyLayerId | EndlessOnlyLayerId | TrueEndlessLayerId;

export interface Layer {
  id: LayerId;
  name: string;
  /** Depth in frames at which this layer begins. */
  from: number;
  /** Label drawn on the boundary line above this layer, if it's a notable crossing. */
  boundary?: string;
}

/** The classic 10-layer Daily stack (0 → 91 frames). */
export const DAILY_LAYERS: readonly Layer[] = [
  { id: 'application', name: 'Application', from: 0 },
  { id: 'runtime', name: 'Runtime', from: 3 },
  { id: 'libraries', name: 'Libraries', from: 6 },
  { id: 'userspace', name: 'OS userspace', from: 10 },
  // A typical day (median ~15 frames in a 2026-11-26 player-profile simulation) just crosses the syscall boundary.
  { id: 'kernel', name: 'Kernel', from: 15, boundary: 'syscall' },
  { id: 'drivers', name: 'Drivers', from: 22 },
  { id: 'firmware', name: 'Firmware', from: 31 },
  // A day of mostly deep cuts reaches the hypervisor.
  { id: 'ring-1', name: 'Ring −1', from: 42, boundary: 'VM exit' },
  // 58 > 7 × Heisenbug (56): Ring −2 needs at least one Bit Flip.
  { id: 'ring-2', name: 'Ring −2', from: 58, boundary: 'SMI' },
  { id: 'ring-3', name: 'Ring −3', from: MAX_DEPTH, boundary: 'ME' },
];

/** Backwards-compatible alias for the classic 10-layer Daily stack. */
export const LAYERS: readonly Layer[] = DAILY_LAYERS;

/**
 * The expanded 29-layer Endless stack (0 → 2,500 frames):
 * Above Application → Expanded Runtime & Libraries → Vertical OS Kernel (Entry / Peer-Wing Core / Arch)
 * → Drivers & Bus → Firmware → Expanded Rings −1/−2/−3 (including ME MINIX 3!) → Silicon & Physics Abyss.
 */
export const ENDLESS_LAYERS: readonly Layer[] = [
  // Zone A — Above Application
  { id: 'internet', name: 'Internet / BGP', from: 0 },
  { id: 'browser', name: 'Browser / Compositor', from: 55, boundary: 'render' },
  { id: 'application', name: 'Application', from: 120 },
  // Zone B — Expanded Runtime & Libraries
  { id: 'bytecode', name: 'AST & Bytecode', from: 190, boundary: 'parse' },
  { id: 'jit', name: 'JIT & Inline Caches', from: 265, boundary: 'compile' },
  { id: 'runtime', name: 'Heap & GC', from: 345 },
  { id: 'libraries', name: 'Libraries', from: 430 },
  { id: 'linker', name: 'Dynamic Linker / ABI', from: 515, boundary: 'dlopen' },
  // Zone C — Expanded Userspace & OS Kernel
  { id: 'userspace', name: 'OS userspace', from: 605 },
  { id: 'kernel-entry', name: 'Kernel Entry & VFS Gate', from: 705, boundary: 'syscall' },
  { id: 'kernel', name: 'Kernel Core', from: 810 },
  { id: 'kernel-arch', name: 'Arch & Interrupt Core', from: 920, boundary: 'IRQ' },
  // Zone D — Drivers, Bus & Firmware
  { id: 'drivers', name: 'Device Drivers', from: 1035 },
  { id: 'bus-fabric', name: 'PCIe / DMA Fabric', from: 1130, boundary: 'DMA' },
  { id: 'firmware', name: 'Firmware / UEFI', from: 1225, boundary: 'ACPI' },
  // Zone E — Expanded Hidden Rings & MINIX-Inside-ME
  { id: 'vmm', name: 'VMM & Virtual Devices', from: 1325, boundary: 'virtio' },
  { id: 'ring-1', name: 'VMX Root Core', from: 1425, boundary: 'VM exit' },
  { id: 'ept', name: 'EPT & IOMMU', from: 1525, boundary: 'EPT' },
  { id: 'ring-2', name: 'SMI Trap & Freeze', from: 1625, boundary: 'SMI' },
  { id: 'smram', name: 'SMRAM Vault (TSEG)', from: 1710, boundary: 'TSEG' },
  { id: 'ring-3', name: 'MEI / HECI Mailbox', from: 1790, boundary: 'ME' },
  { id: 'me-minix-user', name: 'ME MINIX 3 Userspace', from: 1865, boundary: 'AMT' },
  { id: 'me-minix-kern', name: 'MINIX 3 Microkernel', from: 1945, boundary: 'IPC' },
  // Zone F — Deep Silicon, Lithography & Fundamental Physics
  { id: 'uarch', name: 'Microarchitecture', from: 2030, boundary: 'μop' },
  { id: 'rtl', name: 'RTL & Logic Gates', from: 2130, boundary: 'posedge' },
  { id: 'cmos', name: 'CMOS & Metal Layers', from: 2235, boundary: 'M1' },
  { id: 'litho', name: 'Photolithography & Lattice', from: 2340, boundary: '13.5nm' },
  { id: 'bandgap', name: 'Bandgap & Tunneling', from: 2425, boundary: '1.1eV' },
  { id: 'landauer', name: 'Landauer Limit', from: ENDLESS_MAX_DEPTH, boundary: 'kT ln 2' },
];

/** True Endless realms (worldbuilt pocket-universes beyond the Landauer Limit). */
export const TRUE_ENDLESS_LAYERS: readonly Layer[] = [
  { id: 'slab-spa', name: '1994 · The Slab Spa', from: 0, boundary: '1994' },
  { id: 'kthread-kabin', name: '1978 · The Kthread Kabin', from: 60, boundary: '1978' },
];

/** All unique layer IDs across Daily, Endless, and True Endless modes. */
export const ALL_LAYER_IDS: readonly LayerId[] = [
  ...ENDLESS_LAYERS.map((l) => l.id),
  ...TRUE_ENDLESS_LAYERS.map((l) => l.id),
];

/** Canonical daily layer fallback for default audio/art inheritance. */
export const DAILY_FALLBACK: Record<LayerId, DailyLayerId> = {
  internet: 'application',
  browser: 'application',
  application: 'application',
  bytecode: 'runtime',
  jit: 'runtime',
  runtime: 'runtime',
  libraries: 'libraries',
  linker: 'libraries',
  userspace: 'userspace',
  'kernel-entry': 'kernel',
  kernel: 'kernel',
  'kernel-arch': 'kernel',
  drivers: 'drivers',
  'bus-fabric': 'drivers',
  firmware: 'firmware',
  vmm: 'ring-1',
  'ring-1': 'ring-1',
  ept: 'ring-1',
  'ring-2': 'ring-2',
  smram: 'ring-2',
  'ring-3': 'ring-3',
  'me-minix-user': 'userspace',
  'me-minix-kern': 'kernel',
  uarch: 'ring-3',
  rtl: 'ring-3',
  cmos: 'drivers',
  litho: 'ring-3',
  bandgap: 'ring-3',
  landauer: 'ring-3',
  'slab-spa': 'libraries',
  'kthread-kabin': 'kernel',
};

/** Expand a 10-entry Daily map into a complete LayerId map using `DAILY_FALLBACK` + optional overrides. */
export function expandLayerMap<T>(
  base: Record<DailyLayerId, T>,
  overrides: Partial<Record<EndlessOnlyLayerId | TrueEndlessLayerId, T>> = {},
): Record<LayerId, T> {
  const out = {} as Record<LayerId, T>;
  for (const id of ALL_LAYER_IDS) {
    out[id] = (overrides as Partial<Record<LayerId, T>>)[id] ?? base[DAILY_FALLBACK[id]];
  }
  return out;
}

for (const stack of [DAILY_LAYERS, ENDLESS_LAYERS, TRUE_ENDLESS_LAYERS]) {
  for (let i = 1; i < stack.length; i++) {
    enforce(stack[i]!.from > stack[i - 1]!.from, 'layer thresholds must strictly increase');
  }
}
