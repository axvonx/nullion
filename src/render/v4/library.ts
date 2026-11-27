import { enforce } from '../../core/enforce';
import type { LayerId } from '../../core/layers';
import { checkLibrary, type EntityDef } from './kit';
import type { Library } from './place';
import type { TopicTag } from './topics';

/**
 * The one way a layer's Library is built. A layer lists its own entities (and anchors) and may borrow props from
 * another layer to reach the 20-type minimum placement needs; everything else a layer needs to know about an entity
 * (floor membership, topic tags) lives on the entity definition itself.
 */

/** The fewest scatter-prop types a layer may have (placement relies on it; `checkLibrary`). */
export const MIN_NEAR_TYPES = 20;

/** Props borrowed from a Daily layer's own entities until the layer has `upTo` types. */
export interface Borrow {
  from: LayerId;
  /** The borrowed copies are renamed `${prefix}-${donor.id}`: the naming desk's records are keyed by these ids. */
  prefix: string;
  /** Total near types to reach, own plus borrowed. At least MIN_NEAR_TYPES. */
  upTo: number;
}

export interface LayerSpec {
  /** This layer's own scatter props. */
  own: readonly EntityDef[];
  anchors: readonly EntityDef[];
  /** Scatter entities per 10 000 square scene pixels. */
  density: number;
  anchorCount: number;
  /** Far-plane entities as a share of the near scatter (0 for none). */
  far: number;
  borrow?: Borrow;
  /** How far above the band bottom the floor line is. Required exactly when an own entity has `floor: true`. */
  floorOffset?: number;
}

/**
 * Build every layer's Library from its spec. Throws (enforce) on a malformed layer: too few types, a duplicate id,
 * a borrow that cannot fill, a floor prop without a floor line (or the reverse), or a layer with no default tags.
 * Borrowed copies never keep `floor` (the donor's floor line is its own) and take the donor's tags only if it set them.
 */
export function buildLibraries(specs: Record<LayerId, LayerSpec>, layerTags: Record<LayerId, readonly TopicTag[]>): Record<LayerId, Library> {
  const out = {} as Record<LayerId, Library>;
  for (const id of Object.keys(specs) as LayerId[]) {
    const spec = specs[id];
    const defaults = layerTags[id];
    enforce(defaults.length > 0, `v4: layer ${id} has no default topic tags`);
    const tagged = (d: EntityDef): EntityDef => (d.tags ? d : { ...d, tags: defaults });

    const near: EntityDef[] = spec.own.map(tagged);
    if (spec.borrow) {
      const { from, prefix, upTo } = spec.borrow;
      enforce(from !== id, `v4: layer ${id} borrows from itself`);
      enforce(upTo >= MIN_NEAR_TYPES, `v4: layer ${id} borrows up to ${upTo} types, below the ${MIN_NEAR_TYPES} minimum`);
      const donor = specs[from].own;
      const need = Math.max(0, upTo - near.length);
      enforce(donor.length >= need, `v4: layer ${id} needs ${need} props from ${from}, which has ${donor.length}`);
      for (const d of donor.slice(0, need)) {
        const { floor: _floor, ...rest } = d;
        near.push(tagged({ ...rest, id: `${prefix}-${d.id}` }));
      }
    }
    checkLibrary(`v4 ${id}`, near, MIN_NEAR_TYPES);
    const anchors = spec.anchors.map(tagged);
    checkLibrary(`v4 ${id} anchors`, anchors, 1);
    const ids = [...near, ...anchors].map((d) => d.id);
    enforce(new Set(ids).size === ids.length, `v4: layer ${id} has an id shared by a prop and an anchor`);

    const floorIds = near.filter((d) => d.floor).map((d) => d.id);
    enforce(
      (floorIds.length > 0) === (spec.floorOffset !== undefined),
      `v4: layer ${id} ${floorIds.length ? 'has floor props but no floorOffset' : 'sets floorOffset but has no floor props'}`,
    );
    out[id] = {
      near,
      anchors,
      density: spec.density,
      anchorCount: spec.anchorCount,
      far: spec.far,
      ...(spec.floorOffset !== undefined ? { floor: { offset: spec.floorOffset, ids: new Set(floorIds) } } : {}),
    };
  }
  return out;
}
