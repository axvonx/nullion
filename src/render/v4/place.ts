import { rng } from '../../core/day';
import { enforce } from '../../core/enforce';
import type { LayerId } from '../../core/layers';
import { LOOKS, type EntityDef } from './kit';

/**
 * v4 world placement: which entities appear where, decided once per (seed, viewport width) and never per frame.
 *
 * Per layer band (world coordinates; x is screen x, since the world never scrolls sideways):
 * 1. Anchors first: one or two big structures per layer give it a sense of place. They sit beside the centre
 *    lane (out from under the console card and the header chips where the width allows).
 * 2. Then a scatter of small entities, rejection-sampled with bounded attempts (so it always terminates):
 *    - never overlapping each other (with a little padding) or any keep-out rect;
 *    - never in the cursor's descent lane;
 *    - only small, text-free entities in the panel lanes (under the console card and header chips), so nothing
 *      that matters gets hidden as the world scrolls under them;
 *    - each type capped within one screen's height (default 2) and kept apart from its own copies;
 *    - types are drawn least-used-first, so a layer shows most of its library before anything repeats;
 *    - near a band edge, some picks come from the neighbouring layer's library: the layers bleed.
 * 3. A sparse, fogged far plane in parallax space, from the same library (no text, small only).
 */

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Placed {
  def: EntityDef;
  v: number;
  look: number;
  /** Near plane: world x, y. Far plane: x and y relative to the band's parallax top. */
  x: number;
  y: number;
  w: number;
  h: number;
  flip: boolean;
  /** Animation phase offset in seconds, so copies of a type don't move in lockstep. */
  ph: number;
  anchor: boolean;
}

export interface Library {
  near: readonly EntityDef[];
  anchors: readonly EntityDef[];
  /** Scatter entities per 10 000 square scene pixels. */
  density: number;
  /** How many anchors to place, at most. */
  anchorCount: number;
  /** Far-plane entities as a share of the near scatter (0 for none). */
  far: number;
  /** Entities whose ids are listed stand on a floor this far above the band bottom. */
  floor?: { offset: number; ids: ReadonlySet<string> };
}

export interface BandGeom {
  id: LayerId;
  /** World y range the camera can actually show of this band. */
  top: number;
  bottom: number;
  /** Hard keep-outs for this band (world rects): focal structures, the arrival title, floors. */
  keepOut: Rect[];
}

export interface PlaceGeom {
  W: number;
  bands: BandGeom[];
  /** The cursor's descent lane: nothing at all. */
  cursorLane: readonly [number, number];
  /** x-lanes under the floating panels: only small, text-free entities. */
  panelLanes: readonly (readonly [number, number])[];
}

export interface LayerPlacement {
  near: Placed[];
  far: Placed[];
}

/** A tall screen's height in world pixels (1080p is 360 scene px), for the per-type cap. */
export const VIEW_WINDOW = 360;
/** Same-type copies keep at least this far apart (centre to centre). */
const SAME_TYPE_GAP = 70;
const PAD = 3;
/** Spatial-grid cell size for overlap tests, world px. */
const CELL = 32;
const BLEED = 64;
/** Far plane parallax factor (screen y = band top × FAR_F + local y). */
export const FAR_F = 0.55;
/** Tallest screen the far plane is filled for, in scene pixels. */
const FAR_SCREEN_H = 440;
/** "Small" for the panel lanes: area in scene px². */
const SMALL_AREA = 260;

const overlaps = (a: Rect, b: Rect, pad = 0) => a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad && b.y < a.y + a.h + pad;
const inLane = (x: number, w: number, lane: readonly [number, number]) => x < lane[1] && x + w > lane[0];

/** Weighted pick that favours types used least so far (variety first, repeats last). */
function pickType(rand: () => number, defs: readonly EntityDef[], used: Map<string, number>, blocked: Set<string>): EntityDef | undefined {
  let total = 0;
  const ws = defs.map((d) => {
    if (blocked.has(d.id)) return 0;
    const n = used.get(d.id) ?? 0;
    const w = (d.weight ?? 1) / (1 + n * n * 4);
    total += w;
    return w;
  });
  if (total <= 0) return undefined;
  let r = rand() * total;
  for (let i = 0; i < defs.length; i++) {
    r -= ws[i]!;
    if (r < 0) return defs[i];
  }
  return defs[defs.length - 1];
}

function sameTypeOk(def: EntityDef, cx: number, cy: number, sameType: readonly Placed[] | undefined): boolean {
  if (!sameType) return true;
  const cap = def.cap ?? 2;
  let inWindow = 0;
  for (const p of sameType) {
    const px = p.x + p.w / 2;
    const py = p.y + p.h / 2;
    if (Math.hypot(px - cx, py - cy) < SAME_TYPE_GAP) return false;
    // Fewer than `cap` others within a full window of the new one means no window of that height holds more than cap.
    if (Math.abs(py - cy) < VIEW_WINDOW) inWindow++;
  }
  return inWindow < cap;
}

/** x-intervals of [0, W) left after removing lanes, widest first. */
function freeIntervals(W: number, lanes: readonly (readonly [number, number])[]): [number, number][] {
  let out: [number, number][] = [[0, W]];
  for (const [a, b] of lanes) {
    const next: [number, number][] = [];
    for (const [x0, x1] of out) {
      if (b <= x0 || a >= x1) next.push([x0, x1]);
      else {
        if (a > x0) next.push([x0, a]);
        if (b < x1) next.push([b, x1]);
      }
    }
    out = next;
  }
  return out.sort((p, q) => q[1] - q[0] - (p[1] - p[0]));
}

function placeBand(seed: number, bi: number, geom: PlaceGeom, libs: Record<LayerId, Library>): LayerPlacement {
  const band = geom.bands[bi]!;
  const lib = libs[band.id];
  enforce(lib, `v4 placement: no library for ${band.id}`);
  const { W } = geom;
  const rand = rng((Math.imul(seed | 0, 2654435761) ^ Math.imul(bi + 1, 0x9e3779b9)) >>> 0);
  const top = band.top;
  const bottom = band.bottom;
  const bandH = bottom - top;
  enforce(bandH > 40 && W > 60, `v4 placement: band ${band.id} too small (${W}×${bandH})`);
  const near: Placed[] = [];
  const keep = band.keepOut;
  // A coarse spatial grid and per-type lists keep each rejection test to a handful of neighbours.
  const grid = new Map<number, Placed[]>();
  const byType = new Map<string, Placed[]>();
  const cellsOf = (r: Rect, pad: number, fn: (key: number) => boolean | void) => {
    for (let gy = Math.floor((r.y - top - pad) / CELL); gy <= Math.floor((r.y + r.h - top + pad) / CELL); gy++)
      for (let gx = Math.floor((r.x - pad) / CELL); gx <= Math.floor((r.x + r.w + pad) / CELL); gx++) if (fn(gy * 4096 + gx) === false) return false;
    return true;
  };
  const add = (e: Placed) => {
    near.push(e);
    cellsOf(e, 0, (k) => {
      const list = grid.get(k);
      if (list) list.push(e);
      else grid.set(k, [e]);
    });
    const t = byType.get(e.def.id);
    if (t) t.push(e);
    else byType.set(e.def.id, [e]);
  };

  const clear = (r: Rect) => {
    if (r.y < top + 2 || r.y + r.h > bottom - 2 || r.x < 1 || r.x + r.w > W - 1) return false;
    if (inLane(r.x, r.w, geom.cursorLane)) return false;
    // Keep-out rects carry their own margins, so floors can be stood on exactly.
    for (const k of keep) if (overlaps(r, k)) return false;
    return cellsOf(r, PAD, (k) => !grid.get(k)?.some((p) => overlaps(r, p, PAD)));
  };

  // 1. Anchors, beside the centre: out from under the panels where the width allows, else anywhere off the lane.
  const anchorDefs = [...lib.anchors];
  for (let i = anchorDefs.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [anchorDefs[i], anchorDefs[j]] = [anchorDefs[j]!, anchorDefs[i]!];
  }
  const roomy = freeIntervals(W, [geom.cursorLane, ...geom.panelLanes]);
  const loose = freeIntervals(W, [geom.cursorLane]);
  let lastSide = rand() < 0.5 ? -1 : 1;
  for (const def of anchorDefs.slice(0, lib.anchorCount)) {
    const v = Math.floor(rand() * def.sizes.length);
    const [w, h] = def.sizes[v]!;
    if (h + 8 > bandH) continue;
    const fits = (iv: [number, number]) => iv[1] - iv[0] >= w + 2;
    const pool = roomy.filter(fits).length ? roomy.filter(fits) : loose.filter(fits);
    if (!pool.length) continue;
    // Alternate sides of the lane so two anchors flank the descent.
    const centre = W / 2;
    const side = pool.filter((iv) => (lastSide < 0 ? iv[0] >= centre - 1 : iv[1] <= centre + 1));
    const ivs = side.length ? side : pool;
    for (let a = 0; a < 80; a++) {
      const iv = ivs[Math.floor(rand() * ivs.length)]!;
      const x = Math.round(iv[0] + 1 + rand() * (iv[1] - iv[0] - w - 2));
      const y = Math.round(top + 6 + rand() * (bandH - h - 12));
      const r = { x, y, w, h };
      if (!clear(r)) continue;
      add({ def, v, look: Math.floor(rand() * LOOKS), x, y, w, h, flip: !def.noFlip && !def.text && rand() < 0.5, ph: rand() * 20, anchor: true });
      lastSide = x + w / 2 < centre ? -1 : 1;
      break;
    }
  }
  if (lib.anchorCount > 0) enforce(near.length > 0, `v4 placement: no anchor fits in ${band.id} at width ${W}`);

  // 2. Scatter.
  const up = bi > 0 ? libs[geom.bands[bi - 1]!.id] : undefined;
  const down = bi < geom.bands.length - 1 ? libs[geom.bands[bi + 1]!.id] : undefined;
  const target = Math.max(4, Math.round((W * bandH * lib.density) / 10000));
  const used = new Map<string, number>();
  const blocked = new Set<string>();
  let scattered = 0;
  const maxAttempts = target * 60;
  for (let attempt = 0; attempt < maxAttempts && scattered < target; attempt++) {
    const yc = top + rand() * bandH;
    const dTop = yc - top;
    const dBot = bottom - yc;
    let src = lib;
    if (up && rand() < 0.5 * Math.max(0, 1 - dTop / BLEED)) src = up;
    else if (down && rand() < 0.5 * Math.max(0, 1 - dBot / BLEED)) src = down;
    // A type that failed to fit repeatedly sits out for a while; the block clears every few hundred attempts.
    if (attempt % 300 === 299) blocked.clear();
    const def = pickType(rand, src.near, used, blocked);
    if (!def) continue;
    const v = Math.floor(rand() * def.sizes.length);
    const [w, h] = def.sizes[v]!;
    const x = Math.round(rand() * (W - w));
    let y = Math.round(yc - h / 2);
    if (src === lib && lib.floor?.ids.has(def.id)) y = bottom - lib.floor.offset - h;
    const r = { x, y, w, h };
    let ok = clear(r);
    if (ok && geom.panelLanes.some((l) => inLane(x, w, l))) ok = !def.text && w * h <= SMALL_AREA;
    if (ok) ok = sameTypeOk(def, x + w / 2, y + h / 2, byType.get(def.id));
    if (!ok) {
      if (rand() < 0.04) blocked.add(def.id);
      continue;
    }
    add({ def, v, look: Math.floor(rand() * LOOKS), x, y, w, h, flip: !def.noFlip && !def.text && rand() < 0.5, ph: rand() * 20, anchor: false });
    used.set(def.id, (used.get(def.id) ?? 0) + 1);
    scattered++;
  }
  enforce(
    scattered >= Math.floor(target * 0.5),
    `v4 placement: ${band.id} placed ${scattered} of ${target} entities at width ${W}; keep-outs or caps leave too little room`,
  );

  // 3. Far plane, in the band's parallax space: local y covers every camera position that shows the band.
  const far: Placed[] = [];
  const farDefs = lib.near.filter((d) => !d.text && d.sizes.every(([w, h]) => w <= 24 && h <= 20));
  const farTarget = Math.round(target * lib.far);
  const y0 = -bandH * (1 - FAR_F);
  const y1 = bandH + FAR_SCREEN_H * (1 - FAR_F);
  const farUsed = new Map<string, number>();
  for (const [id, n] of used) farUsed.set(id, n);
  for (let attempt = 0; attempt < farTarget * 40 && far.length < farTarget && farDefs.length; attempt++) {
    const def = pickType(rand, farDefs, farUsed, blocked);
    if (!def) {
      blocked.clear();
      continue;
    }
    const v = Math.floor(rand() * def.sizes.length);
    const [w, h] = def.sizes[v]!;
    const x = Math.round(rand() * (W - w));
    const y = Math.round(y0 + rand() * (y1 - y0 - h));
    const r = { x, y, w, h };
    if (inLane(x, w, geom.cursorLane)) continue;
    if (far.some((p) => overlaps(r, p, 6))) continue;
    if (!sameTypeOk(def, x + w / 2, y + h / 2, far.filter((p) => p.def === def))) continue;
    far.push({ def, v, look: Math.floor(rand() * LOOKS), x, y, w, h, flip: !def.noFlip && rand() < 0.5, ph: rand() * 20, anchor: false });
    farUsed.set(def.id, (farUsed.get(def.id) ?? 0) + 1);
  }

  near.sort((a, b) => a.y - b.y);
  far.sort((a, b) => a.y - b.y);
  return { near, far };
}

/** Place every layer's entities. Deterministic in (seed, geometry); call once, not per frame. */
export function placeWorld(seed: number, geom: PlaceGeom, libs: Record<LayerId, Library>): LayerPlacement[] {
  enforce(Number.isInteger(seed), `v4 placement: seed must be an integer, got ${seed}`);
  return geom.bands.map((_, i) => placeBand(seed, i, geom, libs));
}
