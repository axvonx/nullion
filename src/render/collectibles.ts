import type { LayerId } from '../core/layers';
import { entryForCritter } from '../game/manual';
import { hash } from './art-common';

/** A screen-space box in scene pixels. */
export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** A clickable Field Manual specimen: where it is on screen, which entry and which layer it logs. */
export interface ManualTarget extends Box {
  entryId: string;
  layer: LayerId;
}

/** Click and hover slack around a specimen, in scene pixels. */
const HIT_PAD = 2;

const inside = (b: Box, sx: number, sy: number) =>
  sx >= b.x - HIT_PAD && sx <= b.x + b.w + HIT_PAD && sy >= b.y - HIT_PAD && sy <= b.y + b.h + HIT_PAD;

/**
 * What one scene frame drew that the player can act on or that reactions act on. The Scene owns one; the world's
 * drawers (props in art-v4, critters in critters.ts) report into it while drawing, and the Scene reads it back for
 * hit-testing, the hover overlay and the tier reactions. Nothing here is module-level: no instance, no state.
 *
 * - props: near-plane entities. Each may carry a reaction box (tier reactions copy and jiggle these) and a Field
 *   Manual target (clickable).
 * - critters: living critters, drawn over the props, so they win a click where the two overlap.
 */
export class Collectibles {
  private readonly reaction: Box[] = [];
  private readonly manual: ManualTarget[] = [];
  private readonly critters: { box: Box; layer: LayerId }[] = [];

  /** Forget the last frame's boxes. Call before drawing. */
  beginFrame() {
    this.reaction.length = 0;
    this.manual.length = 0;
    this.critters.length = 0;
  }

  addProp(p: { reaction?: Box; manual?: ManualTarget }) {
    if (p.reaction) this.reaction.push(p.reaction);
    if (p.manual) this.manual.push(p.manual);
  }

  addCritter(box: Box, layer: LayerId) {
    this.critters.push({ box, layer });
  }

  /** A position in the reaction boxes: pass it later as `reactionBoxes(since)` to see only what was added after. */
  mark(): number {
    return this.reaction.length;
  }

  /** The props' reaction boxes (from `since`, a `mark()`), in the order they were drawn. */
  reactionBoxes(since = 0): readonly Box[] {
    return since === 0 ? this.reaction : this.reaction.slice(since);
  }

  /**
   * Up to `n` on-screen boxes for a reaction to copy or jiggle: distinct props in a seeded order (each once), or, with
   * none on screen, a seeded scatter of 24 × 20 cells standing in.
   */
  reactionTargets(seed: number, n: number, W: number, H: number): [number, number, number, number][] {
    const out: [number, number, number, number][] = [];
    const spots = this.reaction;
    if (spots.length > 0) {
      const order = Array.from({ length: spots.length }, (_, j) => j).sort((a, b) => hash(seed + a * 7) - hash(seed + b * 7));
      for (const j of order.slice(0, n)) {
        const { x, y, w, h } = spots[j]!;
        if (x + w <= 0 || y + h <= 0 || x >= W || y >= H) continue;
        out.push([x, y, w, h]);
      }
      return out;
    }
    for (let k = 0; out.length < n && k < n * 4; k++) {
      const x = Math.floor(hash(seed + k * 7) * (W - 24));
      const y = Math.floor(hash(seed + k * 7 + 1) * (H - 20));
      if (x < 0 || y < 0 || x + 24 > W || y + 20 > H) continue;
      out.push([x, y, 24, 20]);
    }
    return out;
  }

  /** This frame's clickable props (critters are not listed: they are only found by `hit`). */
  targets(): readonly ManualTarget[] {
    return this.manual;
  }

  /**
   * The specimen under a scene point, critters before props, the last drawn first. `blocked` (the reveal's vignette
   * covers the world) hits nothing: a covered world can be neither hovered nor collected.
   */
  hit(sx: number, sy: number, blocked = false): ManualTarget | undefined {
    if (blocked) return undefined;
    for (let i = this.critters.length - 1; i >= 0; i--) {
      const c = this.critters[i]!;
      if (!inside(c.box, sx, sy)) continue;
      const found = entryForCritter(c.layer);
      if (found) return { ...c.box, entryId: found.entry.id, layer: found.layer };
    }
    for (let i = this.manual.length - 1; i >= 0; i--) {
      const t = this.manual[i]!;
      if (inside(t, sx, sy)) return t;
    }
    return undefined;
  }
}
