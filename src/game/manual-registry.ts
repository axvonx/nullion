import manualFiles from 'virtual:manual-files';
import { enforce } from '../core/enforce';
import { ALL_LAYER_IDS, type LayerId } from '../core/layers';
import { manualPathParts, parseManualFile, type ManualEntry } from '../data/manual-format';
import { V4_LIBRARIES } from '../render/v4/libraries';
import { TOPIC_PROPS } from '../render/v4/topics';
import { DEBUG } from '../keys';

/**
 * Loads the Field Manual from writing/manual/<layer>/<id>.md (grammar: src/data/manual-format.ts) and checks it against the
 * world. `virtual:manual-files` (vite.config.ts) hands over the files' text; a production build leaves the `draft`
 * files out of the bundle entirely, and debug builds and tests get them all.
 */

/** What an entry's sightings must resolve against. */
export interface ManualWorld {
  /** Entity ids (props and anchors) in each layer's library. */
  entities: ReadonlyMap<LayerId, ReadonlySet<string>>;
  /** Layers that have a core critter species. */
  critterLayers: ReadonlySet<LayerId>;
  topicIds: ReadonlySet<string>;
}

/** The real world's contents, for the registry below. */
export function currentWorld(): ManualWorld {
  return {
    entities: new Map(
      (Object.entries(V4_LIBRARIES) as [LayerId, (typeof V4_LIBRARIES)[LayerId]][]).map(([layer, lib]) => [layer, new Set([...lib.near, ...lib.anchors].map((d) => d.id))]),
    ),
    critterLayers: new Set(ALL_LAYER_IDS),
    topicIds: new Set(TOPIC_PROPS.map((p) => p.id)),
  };
}

/**
 * Throws (enforce) unless every entry is consistent with the others and with `world`: unique ids, every sighting
 * resolves to an entity in that layer's library, a critter species or a topic prop, no entity, critter species or
 * topic claimed by two entries, and every SEE ALSO names an entry.
 */
export function validateManualEntries(entries: readonly ManualEntry[], world: ManualWorld): void {
  const ids = new Set<string>();
  for (const e of entries) {
    enforce(!ids.has(e.id), `manual: two entries have id ${e.id}`);
    ids.add(e.id);
  }
  const claimed = new Map<string, string>();
  const claim = (key: string, e: ManualEntry) => {
    const other = claimed.get(key);
    enforce(other === undefined, `manual: ${key} is claimed by both ${other} and ${e.id}`);
    claimed.set(key, e.id);
  };
  for (const e of entries) {
    enforce(e.sightings.length > 0, `manual: ${e.id} has no sightings`);
    for (const s of e.sightings) {
      if (s.entityId !== undefined) {
        enforce(world.entities.get(s.layer)?.has(s.entityId), `manual: ${e.id} sights entity ${s.entityId}, which is not in the ${s.layer} library`);
        claim(`entity ${s.entityId}`, e);
      }
      if (s.critterLayer !== undefined) {
        enforce(world.critterLayers.has(s.critterLayer), `manual: ${e.id} sights a critter on ${s.critterLayer}, which has no species`);
        claim(`critter ${s.critterLayer}`, e);
      }
      if (s.topicId !== undefined) {
        enforce(world.topicIds.has(s.topicId), `manual: ${e.id} sights topic ${s.topicId}, which is not a topic prop`);
        claim(`topic ${s.topicId}`, e);
      }
    }
    for (const ref of e.seeAlso ?? []) enforce(ids.has(ref), `manual: ${e.id} lists SEE ALSO ${ref}, which is not an entry`);
  }
}

/**
 * The page order inside a chapter: entries with a `page` first (lowest first), then the rest by id with approved
 * before draft. Files have no order of their own, so this keeps the book's pages stable.
 */
export function compareEntries(a: ManualEntry, b: ManualEntry): number {
  if (a.page !== undefined || b.page !== undefined) {
    if (a.page === undefined) return 1;
    if (b.page === undefined) return -1;
    return a.page - b.page;
  }
  const draft = (e: ManualEntry) => (e.status === 'draft' ? 1 : 0);
  return draft(a) - draft(b) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

/** Parse every file in `files` (path to text) and keep the entries `showDrafts` allows, in `compareEntries` order. */
export function loadManualEntries(files: Readonly<Record<string, string>>, showDrafts: boolean): ManualEntry[] {
  const paths = Object.keys(files).sort();
  enforce(paths.length > 0, 'manual: no manual files (writing/manual/<layer>/<id>.md) found');
  const entries: ManualEntry[] = [];
  for (const path of paths) {
    enforce(manualPathParts(path), `manual: ${path} is not writing/manual/<layer>/<id>.md`);
    const e = parseManualFile(path, files[path]!);
    if (e.status === 'draft' && !showDrafts) continue;
    entries.push(e);
  }
  return entries.sort(compareEntries);
}

/** The entries this build shows: `approved` ones in production, every one in debug. */
export const MANUAL_ENTRIES: readonly ManualEntry[] = loadManualEntries(manualFiles, DEBUG);
validateManualEntries(MANUAL_ENTRIES, currentWorld());
