import { enforce } from '../core/enforce';
import { DAILY_FALLBACK, ENDLESS_LAYERS, type LayerId } from '../core/layers';
import { DEBUG } from '../keys';
import type { ManualEntry, ManualRarity, ManualSighting } from '../data/manual-format';
import { MANUAL_ENTRIES } from './manual-registry';
import { browserStorage, type SaveStorage } from './daily-save';
import { fromV1, InvalidManualSave, MANUAL_V1_KEY, MANUAL_V2_KEY, parseV2, prune, type ManualSaveV2, type Stamp } from './manual-save';

/**
 * Field Manual ("MAN(7) · Field Manual") — Volume I character & specimen registry + persistent discovery store.
 *
 * Each entry represents a named character, critter, prop family, or question-reactive anomaly in Nullion's world.
 * An entry has ONE rarity tier across all layers (each appearance is gated separately and its shown % is measured: src/game/rarity.ts), and one or more `sightings` ordered
 * from highest (shallowest) to lowest (deepest) layer. Discovering an entry in any layer unlocks it; spotting it
 * again in a different layer logs a new sighting and unlocks that layer's appearance in the profile dropdown.
 *
 * The entries are Markdown files, manual/<layer of first sighting>/<id>.md (grammar: src/data/manual-format.ts, loading
 * and world checks: manual-registry.ts). This file holds the lookups and the persistent discovery store.
 */

export type { ManualEntry, ManualKind, ManualRarity, ManualSighting, ManualStatus } from '../data/manual-format';

export interface RarityMeta {
  id: ManualRarity;
  label: string;
  color: string;
}

export const MANUAL_RARITIES: Record<ManualRarity, RarityMeta> = {
  common: { id: 'common', label: 'Common', color: '#8ea8c3' },
  uncommon: { id: 'uncommon', label: 'Uncommon', color: '#59c08a' },
  rare: { id: 'rare', label: 'Rare', color: '#b478f0' },
  mythic: { id: 'mythic', label: 'Mythic', color: '#ffe25a' },
};

export { MANUAL_ENTRIES };

const LAYER_ORDER = new Map<LayerId, number>(ENDLESS_LAYERS.map((l, i) => [l.id, i]));
export function layerRank(id: LayerId): number {
  return LAYER_ORDER.get(id) ?? 999;
}

const BY_ID = new Map<string, ManualEntry>(MANUAL_ENTRIES.map((e) => [e.id, e]));

interface Hit {
  entry: ManualEntry;
  sighting: ManualSighting;
}
export interface ManualLookups {
  byEntity: ReadonlyMap<string, Hit>;
  byCritter: ReadonlyMap<LayerId, Hit>;
  byTopic: ReadonlyMap<string, Hit>;
}

/** Index `entries` by what their sightings point at (placed entity, critter species layer, topic prop). */
export function buildLookups(entries: readonly ManualEntry[]): ManualLookups {
  const byEntity = new Map<string, Hit>();
  const byCritter = new Map<LayerId, Hit>();
  const byTopic = new Map<string, Hit>();
  for (const entry of entries) {
    for (const sighting of entry.sightings) {
      if (sighting.entityId) byEntity.set(sighting.entityId, { entry, sighting });
      if (sighting.critterLayer) byCritter.set(sighting.critterLayer, { entry, sighting });
      if (sighting.topicId) byTopic.set(sighting.topicId, { entry, sighting });
    }
  }
  return { byEntity, byCritter, byTopic };
}

const LOOKUPS = buildLookups(MANUAL_ENTRIES);

export function manualEntryById(id: string): ManualEntry | undefined {
  return BY_ID.get(id);
}

/** Find the manual entry for a placed v4 entity ID (returns the entry and the sighting layer to record). */
export function entryForEntity(entityId: string, layer: LayerId): { entry: ManualEntry; layer: LayerId } | undefined {
  const hit = LOOKUPS.byEntity.get(entityId);
  if (!hit) return undefined;
  return { entry: hit.entry, layer: hit.sighting.layer ?? layer };
}

/** Find the manual entry for a biosphere critter on `layer` (maps Endless layers to their core species). */
export function entryForCritter(layer: LayerId, lookups: ManualLookups = LOOKUPS): { entry: ManualEntry; layer: LayerId } | undefined {
  const direct = lookups.byCritter.get(layer);
  if (direct) return { entry: direct.entry, layer: direct.sighting.layer };
  const fb = DAILY_FALLBACK[layer];
  const fallbackHit = lookups.byCritter.get(fb);
  return fallbackHit ? { entry: fallbackHit.entry, layer: fallbackHit.sighting.layer } : undefined;
}

/** Find the manual entry for a question-reactive topic display. */
export function entryForTopic(topicId: string): { entry: ManualEntry; layer: LayerId } | undefined {
  const hit = LOOKUPS.byTopic.get(topicId);
  return hit ? { entry: hit.entry, layer: hit.sighting.layer } : undefined;
}

// -----------------------------------------------------------------------------
// Persistent discovery store (save v2, src/game/manual-save.ts) + debug "Unlock all" overlay.

export interface LogResult {
  isNewEntry: boolean;
  isNewLayer: boolean;
}

/** Where a sighting happens, supplied by the app (main.ts): today's puzzle and the prompt being answered, if any. */
export interface SightingContext {
  puzzle: number | null;
  prompt?: string;
}

export interface ManualStoreOptions {
  now: () => number;
  /** Production migrates the shared v1 key once; debug builds leave it alone (they never own a real player's save). */
  migrateV1: boolean;
}

const wetKey = (entryId: string, layer: LayerId) => `${entryId}|${layer}`;

export class ManualStore {
  private found = new Map<string, Map<LayerId, Stamp>>();
  private wet = new Set<string>();
  private reached = new Set<LayerId>();
  private debugUnlockAll = false;
  private listeners = new Set<() => void>();
  private context: () => SightingContext = () => ({ puzzle: null });
  private loadNotice: string | undefined;

  constructor(
    private storage: SaveStorage | null,
    private opts: ManualStoreOptions = { now: Date.now, migrateV1: false },
  ) {
    this.load();
  }

  /** Read v2 (or migrate v1). A corrupt save is removed and reported once via takeLoadNotice(); storage trouble is "no save". */
  private load() {
    const s = this.storage;
    if (!s) return;
    let raw: string | null;
    let v1: string | null = null;
    try {
      raw = s.getItem(MANUAL_V2_KEY);
      if (raw === null && this.opts.migrateV1) v1 = s.getItem(MANUAL_V1_KEY);
    } catch {
      return;
    }
    if (raw === null && v1 === null) return;
    let save: ManualSaveV2;
    try {
      save = raw !== null ? parseV2(raw) : fromV1(v1!);
    } catch (e) {
      if (!(e instanceof InvalidManualSave)) throw e; // a bug in the parser, not a bad save
      this.loadNotice = `Your Field Manual could not be read (${e.message}), so it starts empty.`;
      this.remove(raw !== null ? MANUAL_V2_KEY : MANUAL_V1_KEY);
      return;
    }
    const { save: clean, dropped } = prune(save, (id, layer) => BY_ID.get(id)?.sightings.some((x) => x.layer === layer) ?? false);
    if (dropped.length) this.loadNotice = `Some Field Manual pages no longer exist and were removed: ${dropped.join(', ')}.`;
    for (const [id, layers] of Object.entries(clean.seen)) this.found.set(id, new Map(Object.entries(layers) as [LayerId, Stamp][]));
    for (const w of clean.wet) this.wet.add(w);
    for (const l of clean.reached ?? []) if (LAYER_ORDER.has(l as LayerId)) this.reached.add(l as LayerId);
    if (v1 !== null || dropped.length) {
      this.save();
      if (v1 !== null) this.remove(MANUAL_V1_KEY);
    }
  }

  private remove(key: string) {
    try {
      this.storage?.removeItem(key);
    } catch {
      /* unavailable storage */
    }
  }

  private save() {
    if (!this.storage) return;
    const obj: ManualSaveV2 = {
      v: 2,
      seen: Object.fromEntries([...this.found].map(([id, layers]) => [id, Object.fromEntries(layers)])),
      wet: [...this.wet],
      reached: [...this.reached],
    };
    try {
      this.storage.setItem(MANUAL_V2_KEY, JSON.stringify(obj));
    } catch {
      /* quota or blocked storage is an expected condition */
    }
  }

  /** The load problem to show the player, once. */
  takeLoadNotice(): string | undefined {
    const n = this.loadNotice;
    this.loadNotice = undefined;
    return n;
  }

  setContext(fn: () => SightingContext) {
    this.context = fn;
  }

  private emit() {
    for (const fn of this.listeners) fn();
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /** Record a sighting of `entryId` at `layer`. The first sighting of each appearance is stamped and starts wet. */
  log(entryId: string, layer: LayerId): LogResult {
    const entry = BY_ID.get(entryId);
    enforce(entry, `manual: log() of unknown entry ${entryId}`);
    enforce(entry.sightings.some((s) => s.layer === layer), `manual: ${entryId} has no appearance in ${layer}`);
    let layers = this.found.get(entryId);
    const isNewEntry = !layers || layers.size === 0;
    if (!layers) {
      layers = new Map();
      this.found.set(entryId, layers);
    }
    const isNewLayer = !layers.has(layer);
    this.noteReached(layer);
    if (isNewLayer) {
      const c = this.context();
      layers.set(layer, { at: this.opts.now(), puzzle: c.puzzle, ...(c.prompt ? { prompt: c.prompt } : {}) });
      this.wet.add(wetKey(entryId, layer));
      this.save();
      this.emit();
    }
    return { isNewEntry, isNewLayer };
  }

  /** The cursor reached `layer` (or something there was logged): its chapter unseals for good. */
  noteReached(layer: LayerId) {
    if (this.reached.has(layer)) return;
    this.reached.add(layer);
    this.save();
    this.emit();
  }

  /** Whether `layer`'s chapter is unsealed. The first layer of every stack is where play starts. */
  hasReached(layer: LayerId): boolean {
    return this.debugUnlockAll || layer === 'application' || layer === 'internet' || this.reached.has(layer);
  }

  /** The stamp for an appearance's first sighting, if it has been seen. */
  firstSeen(entryId: string, layer: LayerId): Stamp | undefined {
    return this.found.get(entryId)?.get(layer);
  }

  /** A stamp logged but not yet viewed in the binder. */
  isWet(entryId: string, layer: LayerId): boolean {
    return this.wet.has(wetKey(entryId, layer));
  }

  isFound(entryId: string): boolean {
    if (this.debugUnlockAll) return BY_ID.has(entryId);
    return (this.found.get(entryId)?.size ?? 0) > 0;
  }

  hasLayer(entryId: string, layer: LayerId): boolean {
    if (this.debugUnlockAll) return BY_ID.get(entryId)?.sightings.some((s) => s.layer === layer) ?? false;
    return this.found.get(entryId)?.has(layer) ?? false;
  }

  /** Discovered layers for `entryId`, ordered highest (shallowest) first. */
  foundLayers(entryId: string): LayerId[] {
    const entry = BY_ID.get(entryId);
    if (!entry) return [];
    if (this.debugUnlockAll) return entry.sightings.map((s) => s.layer);
    const layers = this.found.get(entryId);
    if (!layers) return [];
    return entry.sightings.map((s) => s.layer).filter((l) => layers.has(l));
  }

  highestFoundLayer(entryId: string): LayerId | undefined {
    const layers = this.foundLayers(entryId);
    if (!layers.length) return undefined;
    return layers.slice().sort((a, b) => layerRank(a) - layerRank(b))[0];
  }

  /** An entry with any wet stamp. */
  isUnread(entryId: string): boolean {
    for (const w of this.wet) if (w.startsWith(`${entryId}|`)) return true;
    return false;
  }

  /** Viewing an entry's page dries all of its stamps. */
  markRead(entryId: string) {
    let changed = false;
    for (const w of [...this.wet])
      if (w.startsWith(`${entryId}|`)) {
        this.wet.delete(w);
        changed = true;
      }
    if (!changed) return;
    this.save();
    this.emit();
  }

  /** Entries with any wet stamp. */
  unreadCount(): number {
    return new Set([...this.wet].map((w) => w.slice(0, w.indexOf('|')))).size;
  }

  foundCount(): number {
    if (this.debugUnlockAll) return MANUAL_ENTRIES.length;
    let n = 0;
    for (const layers of this.found.values()) if (layers.size > 0) n++;
    return n;
  }

  get isDebugUnlocked(): boolean {
    return this.debugUnlockAll;
  }

  /** Debug-only: reveal all entries & layers without mutating the player's saved discoveries. */
  setDebugUnlockAll(on: boolean) {
    if (this.debugUnlockAll === on) return;
    this.debugUnlockAll = on;
    this.emit();
  }

  /** Clear all saved discoveries and stamps. */
  reset() {
    this.found.clear();
    this.wet.clear();
    this.reached.clear();
    this.debugUnlockAll = false;
    this.save();
    this.emit();
  }
}

export const manualStore = new ManualStore(browserStorage(), { now: () => Date.now(), migrateV1: !DEBUG });
