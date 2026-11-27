import { enforce } from '../core/enforce';
import type { LayerId } from '../core/layers';
import { MANUAL_ENTRIES, type ManualEntry, type ManualRarity, type ManualSighting } from './manual';

/**
 * Field Manual rarity, wired into the world (FIELD-MANUAL-PLAN.md).
 *
 * Each (entry, layer) appearance spawns on a share of days picked by hashing (seed, entry id, layer): every day
 * for common, 1 in 2 for uncommon, 1 in 5 for rare, 1 in 14 for mythic. The seed is the world seed (the puzzle
 * number in Daily, the run seed in Endless), so a day's world holds the same rarities for every player. On an off
 * day the prop is absent from the world; on an on day placement must fit it (`required`). Only scatter props are
 * gated: anchors are landmarks and always present (rarity.test.ts enforces this on the data).
 */

export const RARITY_PERIOD: Record<ManualRarity, number> = { common: 1, uncommon: 2, rare: 5, mythic: 14 };

/** FNV-1a, for hashing ids into the gate. */
function fnv(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** murmur3's finaliser: spreads (seed, id) into a uniform 32-bit value. */
function mix(seed: number, h: number): number {
  let x = (Math.imul(seed | 0, 0x9e3779b1) ^ h) >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return x >>> 0;
}

/** Whether this appearance is in the world for `seed`. */
export function spawnsOn(seed: number, entryId: string, layer: LayerId, rarity: ManualRarity): boolean {
  const period = RARITY_PERIOD[rarity];
  if (period === 1) return true;
  return mix(seed, fnv(`${entryId}|${layer}`)) / 0x1_0000_0000 < 1 / period;
}

/** The days presenceRate measures over: four years of puzzles, fixed so the shown number never drifts. */
export const RATE_WINDOW = 1461;

/** The share of days (seeds 1..RATE_WINDOW) on which this appearance is in the world: the % the manual shows. */
export function presenceRate(entryId: string, layer: LayerId, rarity: ManualRarity): number {
  if (RARITY_PERIOD[rarity] === 1) return 1;
  let on = 0;
  for (let d = 1; d <= RATE_WINDOW; d++) if (spawnsOn(d, entryId, layer, rarity)) on++;
  return on / RATE_WINDOW;
}

export interface GatedAppearance {
  entryId: string;
  rarity: ManualRarity;
  layer: LayerId;
  entityId: string;
}

/** Every placed-prop appearance that is not common: the ones placement gates. */
export const GATED_APPEARANCES: readonly GatedAppearance[] = MANUAL_ENTRIES.flatMap((e) =>
  e.rarity === 'common'
    ? []
    : e.sightings.flatMap((s) => (s.entityId ? [{ entryId: e.id, rarity: e.rarity, layer: s.layer, entityId: s.entityId }] : [])),
);

const BY_LAYER = new Map<LayerId, GatedAppearance[]>();
for (const g of GATED_APPEARANCES) {
  const list = BY_LAYER.get(g.layer) ?? [];
  enforce(!list.some((o) => o.entityId === g.entityId), `rarity: ${g.layer}:${g.entityId} is gated by two entries`);
  list.push(g);
  BY_LAYER.set(g.layer, list);
}

/** What placement needs from the gate for one world seed. */
export interface PlacementGate {
  /** True when this layer's prop is gated off today: it must not appear (near, far, or bled into a neighbour). */
  absent(layer: LayerId, entityId: string): boolean;
  /** This layer's gated props that are on today: placement tries hard to fit each at least once. */
  required(layer: LayerId): readonly string[];
}

export function gateFor(seed: number): PlacementGate {
  const off = new Set<string>();
  const on = new Map<LayerId, string[]>();
  for (const g of GATED_APPEARANCES) {
    if (spawnsOn(seed, g.entryId, g.layer, g.rarity)) on.set(g.layer, [...(on.get(g.layer) ?? []), g.entityId]);
    else off.add(`${g.layer}:${g.entityId}`);
  }
  return {
    absent: (layer, entityId) => off.has(`${layer}:${entityId}`),
    required: (layer) => on.get(layer) ?? [],
  };
}

/**
 * The % the manual shows for one appearance, as a share of days (0..1), or undefined when none is honest yet.
 * - A placed prop: its measured presence (common props and anchors: every day).
 * - A critter: core species are always present, so their entries must be common (alternate species get gated
 *   when they get entries; until then a critter entry that isn't common is a data bug).
 * - A question-reactive anomaly: it appears when the day's questions match, which no day-share describes.
 */
export function shownRate(entry: ManualEntry, s: ManualSighting): number | undefined {
  if (s.entityId) return presenceRate(entry.id, s.layer, entry.rarity);
  if (s.critterLayer) {
    enforce(entry.rarity === 'common', `rarity: critter entry ${entry.id} is ${entry.rarity}, but core species are in the world every day`);
    return 1;
  }
  return undefined;
}

/** "54%" for a shown rate, or undefined. */
export function formatRate(rate: number | undefined): string | undefined {
  return rate === undefined ? undefined : `${Math.round(rate * 100)}%`;
}
