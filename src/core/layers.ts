import { enforce } from './enforce';
import { MAX_TIER_FRAMES } from './tiers';

export const PROMPTS_PER_DAY = 7;
/** A perfect day (every answer a Bit Flip) reaches exactly the bottom layer. */
export const MAX_DEPTH = PROMPTS_PER_DAY * MAX_TIER_FRAMES; // 91

export type LayerId =
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

export interface Layer {
  id: LayerId;
  name: string;
  /** Depth in frames at which this layer begins. */
  from: number;
  /** Label drawn on the boundary line above this layer, if it's a notable crossing. */
  boundary?: string;
}

export const LAYERS: readonly Layer[] = [
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

for (let i = 1; i < LAYERS.length; i++) {
  enforce(LAYERS[i]!.from > LAYERS[i - 1]!.from, 'layer thresholds must strictly increase');
}

export function layerIndexAt(depth: number): number {
  enforce(Number.isFinite(depth) && depth >= 0, `bad depth ${depth}`);
  let idx = 0;
  for (let i = 0; i < LAYERS.length; i++) if (depth >= LAYERS[i]!.from) idx = i;
  return idx;
}

export function layerAt(depth: number): Layer {
  return LAYERS[layerIndexAt(depth)]!;
}

export function layerById(id: LayerId): Layer {
  const l = LAYERS.find((x) => x.id === id);
  enforce(l, `unknown layer ${id}`);
  return l;
}
