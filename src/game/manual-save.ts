import { storageKey } from '../keys';

/**
 * Field Manual save, version 2 (docs/field-manual.md): per (entry, layer) appearance, when it was first seen; plus
 * the "wet" stamps, appearances logged but not yet viewed in the binder. Parsing is strict: a save that is present
 * but unreadable is an InvalidManualSave, which the store reports to the player and removes (never a silent reset).
 */

/** v1 wrote this exact key from both production and debug builds (it predates storageKey). */
export const MANUAL_V1_KEY = 'nullion.manual.v1';
export const MANUAL_V2_KEY = storageKey('manual.v2');

/** A first sighting. `at` (ms since epoch) and `puzzle` are null for sightings migrated from v1, which kept neither. */
export interface Stamp {
  at: number | null;
  puzzle: number | null;
  /** The prompt being answered when it was first seen, if a round was running. */
  prompt?: string;
}

export interface ManualSaveV2 {
  v: 2;
  /** entry id → layer id → first sighting. */
  seen: Record<string, Record<string, Stamp>>;
  /** `${entryId}|${layer}` of each stamp not yet viewed. */
  wet: string[];
  /** Layers the player's cursor has reached, ever: their chapters are unsealed. Absent in saves before 2026-11-27. */
  reached?: string[];
}

export class InvalidManualSave extends Error {}

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
const numOrNull = (x: unknown) => x === null || (typeof x === 'number' && Number.isFinite(x));

function json(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new InvalidManualSave(`not valid JSON (${(e as Error).message})`);
  }
}

export function parseV2(raw: string): ManualSaveV2 {
  const o = json(raw);
  if (!isObj(o) || o.v !== 2) throw new InvalidManualSave(`not a version 2 save`);
  if (!isObj(o.seen)) throw new InvalidManualSave(`"seen" is not an object`);
  if (!Array.isArray(o.wet) || !o.wet.every((w) => typeof w === 'string')) throw new InvalidManualSave(`"wet" is not a list of strings`);
  const seen: ManualSaveV2['seen'] = {};
  for (const [id, layers] of Object.entries(o.seen)) {
    if (!isObj(layers)) throw new InvalidManualSave(`sightings of ${id} are not an object`);
    seen[id] = {};
    for (const [layer, st] of Object.entries(layers)) {
      if (!isObj(st) || !numOrNull(st.at) || !numOrNull(st.puzzle) || (st.prompt !== undefined && typeof st.prompt !== 'string'))
        throw new InvalidManualSave(`the stamp for ${id} in ${layer} is malformed`);
      seen[id]![layer] = { at: st.at as number | null, puzzle: st.puzzle as number | null, ...(st.prompt !== undefined ? { prompt: st.prompt as string } : {}) };
    }
  }
  if (o.reached !== undefined && (!Array.isArray(o.reached) || !o.reached.every((w) => typeof w === 'string')))
    throw new InvalidManualSave(`"reached" is not a list of strings`);
  return { v: 2, seen, wet: o.wet as string[], ...(o.reached ? { reached: o.reached as string[] } : {}) };
}

/** v1 kept only which layers were found and which entries were unread. Unread entries' stamps all start wet. */
export function fromV1(raw: string): ManualSaveV2 {
  const o = json(raw);
  if (!isObj(o) || !isObj(o.found)) throw new InvalidManualSave(`not a version 1 save`);
  const unread = Array.isArray(o.unread) ? new Set(o.unread.filter((x): x is string => typeof x === 'string')) : new Set<string>();
  const seen: ManualSaveV2['seen'] = {};
  const wet: string[] = [];
  for (const [id, layers] of Object.entries(o.found)) {
    if (!Array.isArray(layers)) throw new InvalidManualSave(`v1 layers of ${id} are not a list`);
    seen[id] = {};
    for (const l of layers) {
      if (typeof l !== 'string') throw new InvalidManualSave(`v1 layer of ${id} is not a string`);
      seen[id]![l] = { at: null, puzzle: null };
      if (unread.has(id)) wet.push(`${id}|${l}`);
    }
  }
  return { v: 2, seen, wet };
}

/**
 * Drop sightings whose entry or layer no longer exists (an entry was renamed or lost an appearance). Returns the
 * cleaned save and a description of what was dropped, for the player notice.
 */
export function prune(save: ManualSaveV2, valid: (entryId: string, layer: string) => boolean): { save: ManualSaveV2; dropped: string[] } {
  const dropped: string[] = [];
  const seen: ManualSaveV2['seen'] = {};
  for (const [id, layers] of Object.entries(save.seen)) {
    for (const [layer, st] of Object.entries(layers)) {
      if (valid(id, layer)) (seen[id] ??= {})[layer] = st;
      else dropped.push(`${id} (${layer})`);
    }
  }
  const wet = save.wet.filter((w) => {
    const [id, layer] = w.split('|') as [string, string | undefined];
    return layer !== undefined && seen[id]?.[layer] !== undefined;
  });
  return { save: { v: 2, seen, wet, ...(save.reached ? { reached: save.reached } : {}) }, dropped };
}
