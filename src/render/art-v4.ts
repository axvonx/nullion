import { enforce } from '../core/enforce';
import { ALL_LAYER_IDS, layersFor, type LayerId } from '../core/layers';
import { look } from '../looks';
import { offscreen, vis, type Art, type Band } from './art-common';
import { LAYER_ART } from '../layers';
import type { PaletteMode } from './palettes';
import { c, checkLibrary, drawEntity, setPaint } from './v4/kit';
import { V4_LIBRARIES } from './v4/libraries';
import { FAR_F, type LayerPlacement, type Placed } from './v4/place';
import { drawSetpiece } from './v4/setpieces';
import { WATERMARK_ALPHA, drawName, layoutName, nameHeight, type NamePattern } from './v4/watermark';
import { drawTopicProp, pickTopicFlip, type TopicTag } from './v4/topics';
import { placeBandForSpec, specKey, type WorldSpecV4 } from './v4/world';
import { entryForEntity, entryForTopic } from '../game/manual';

/**
 * Layer art (v4): a seeded world of hand-drawn entities, placed once.
 *
 * - Each layer has its own library of ~20 entity types plus one or two anchor structures (src/layers/<layer-id>.ts).
 * - The scene calls ensureWorldV4() with the world seed (the puzzle number by default) and the viewport geometry;
 *   placement (src/render/v4/place.ts) runs only when that changes, so nothing reshuffles while you play.
 * - Entity bodies are baked into cached sprites per palette; only their small animation overlays draw per frame,
 *   on art time (b.t, frozen in Ring −2; 0 under reduced motion).
 * - Backgrounds: calm fills, a little texture, light as dithered gradients.
 */

type Ctx = CanvasRenderingContext2D;
const R = Math.round;

for (const id of ALL_LAYER_IDS) {
  const lib = V4_LIBRARIES[id];
  checkLibrary(`v4 ${id}`, lib.near, 20);
  checkLibrary(`v4 ${id} anchors`, lib.anchors, 1);
}

let mode: PaletteMode = 'full';
let T = 0;

function use(id: LayerId, b: Band) {
  mode = look('palette') === 'per-layer' ? LAYER_ART[id].palette : 'full';
  setPaint(mode, undefined);
  T = b.reduced ? 0 : b.t;
}

// ---------------------------------------------------------------------------------------------
// The world: lazily placed per visible band on demand (O(1) startup & resize, scales to Endless).

let worldSpec: WorldSpecV4 | undefined;
let bandCache: (LayerPlacement | undefined)[] = [];
let bandIndexById = new Map<LayerId, number>();
let worldKey = '';
let activeTopic: { tags: readonly TopicTag[]; seed: number } | undefined;

/** Set (or clear) the active question's topic tags so eligible near-plane props flip their contents in place. */
export function setActiveTopicV4(tags: readonly TopicTag[] | undefined, seed: number) {
  activeTopic = tags && tags.length ? { tags, seed } : undefined;
}

/** Register (or keep) the current world spec. Cheap to call every frame: only clears the band cache when spec changes. */
export function ensureWorldV4(spec: WorldSpecV4) {
  const key = specKey(spec);
  if (key === worldKey && worldSpec) return;
  worldSpec = spec;
  bandCache = new Array(spec.bands.length);
  bandIndexById = new Map(layersFor(spec.mode ?? 'daily').map((l, i) => [l.id, i]));
  worldKey = key;
}

/** Lazily fetch or build placement for band index `idx`. */
function bandPlacement(idx: number): LayerPlacement {
  enforce(worldSpec, 'v4: drawing before ensureWorldV4()');
  let pl = bandCache[idx];
  if (!pl) {
    pl = placeBandForSpec(worldSpec, idx);
    bandCache[idx] = pl;
  }
  return pl;
}

/** Entities drawn this frame, near plane, as flat [x, y, w, h, ...] in scene pixels: what tier reactions act on. */
export const ENTITY_SPOTS: number[] = [];

/** Clickable Field Manual targets drawn this frame in scene pixels (cleared each frame by Scene). */
export interface ManualTarget {
  x: number;
  y: number;
  w: number;
  h: number;
  entryId: string;
  layer: LayerId;
}
export const MANUAL_TARGETS: ManualTarget[] = [];

/** How many entities of each layer are placed (for the debug read-out and tests of the wiring). */
export function worldStats(): { layer: LayerId; near: number; far: number; types: number }[] {
  enforce(worldSpec, 'v4: world not built');
  const stack = layersFor(worldSpec.mode ?? 'daily');
  return stack.map((l, i) => {
    const pl = bandPlacement(i);
    return { layer: l.id, near: pl.near.length, far: pl.far.length, types: new Set(pl.near.map((e) => e.def.id)).size };
  });
}

/** Binary search for the first entity in a y-sorted list whose `y >= minY`. */
function firstAtOrAfter(list: readonly Placed[], minY: number): number {
  let lo = 0;
  let hi = list.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (list[mid]!.y < minY) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

/** Layer-name lettering per palette family: one of the palette's own levels (snapped), and how sparsely it is stippled. */
const NAME_INK: Record<PaletteMode, [string, NamePattern]> = {
  full: ['#141e5a', 'solid'],
  rgb6: ['#333399', 'checker'],
  rgb4: ['#552200', 'checker'],
  cga16: ['#555555', 'checker'],
  cga4: ['#55ffff', 'dots'],
  green: ['#1ea046', 'dots'],
  gray: ['#464646', 'checker'],
  onebit: ['#e8eeff', 'dots'],
  amber: ['#582c04', 'checker'],
  blueprint: ['#123866', 'checker'],
  wafer: ['#24989c', 'dots'],
  euv: ['#3a1876', 'checker'],
  abyss: ['#101c40', 'checker'],
};
/** World y of the Application lettering (that band is open-ended upward; the cursor starts at world y 40). */
const FIRST_NAME_Y = 100;
/**
 * The layer's name, painted into the band behind everything: big, faint pixel lettering near the top of the band,
 * so a landing in the layer's first frame shows it. Baked once per (name, width, palette) and blitted at a world
 * position, so it scrolls with the world; the final palette dither leaves it alone and props may cover it.
 * It sits `LAYER_ART[id].nameTopOffset` below `b.top` (default 24): layers whose setpiece runs a full-width horizontal
 * structure (truss bridge, steam pipe, parallel bus rails) right across `b.top + 24` drop it just below so the
 * lettering reads through the open upper wall instead of being sliced in half.
 */
function layerName(ctx: Ctx, b: Band, idx: number, id: LayerId) {
  enforce(worldSpec, 'v4: drawing before ensureWorldV4()');
  const name = layersFor(worldSpec.mode ?? 'daily')[idx]!.name;
  const blockW = Math.round(b.w * 0.9);
  const lay = layoutName(name, blockW);
  const [ink, pattern] = NAME_INK[mode];
  const color = pattern === 'solid' ? `rgba(${parseInt(ink.slice(1, 3), 16)},${parseInt(ink.slice(3, 5), 16)},${parseInt(ink.slice(5, 7), 16)},${WATERMARK_ALPHA})` : c(ink);
  const sprite = offscreen(`v4-name|${name}|${blockW}|${mode}`, blockW, nameHeight(lay), (cx) => drawName(cx, lay, 0, 0, blockW, color, pattern));
  const y = idx === 0 ? FIRST_NAME_Y - b.camY : b.top + (LAYER_ART[id].nameTopOffset ?? 24);
  ctx.drawImage(sprite, Math.round(b.w * 0.05), R(y));
}

/** Draw a band's monumental setpiece, far plane (fogged), and near plane in O(log N + visible). */
function entities(ctx: Ctx, b: Band, id: LayerId) {
  const idx = bandIndexById.get(id);
  enforce(idx !== undefined, `v4: layer ${id} not in active stack`);
  layerName(ctx, b, idx, id);
  // Monumental deep-background architectural landmark sits behind all far & near trinkets
  setPaint(mode, undefined);
  drawSetpiece(ctx, b, id, T);
  const pl = bandPlacement(idx);
  const [y0, y1] = vis(b);
  setPaint(mode, LAYER_ART[id].fog);
  const ft = R(b.top * FAR_F + (b.farShift ?? 0));
  for (let i = firstAtOrAfter(pl.far, y0 - ft - pl.maxFarH); i < pl.far.length; i++) {
    const e = pl.far[i]!;
    const sy = ft + e.y;
    if (sy > y1) break;
    if (sy + e.h < y0) continue;
    drawEntity(ctx, e.def, e.v, e.look, e.x, sy, e.flip, T + e.ph);
  }
  setPaint(mode, undefined);
  const report = b.from === undefined;
  for (let i = firstAtOrAfter(pl.near, y0 + b.camY - pl.maxNearH); i < pl.near.length; i++) {
    const e = pl.near[i]!;
    const sy = e.y - b.camY;
    if (sy > y1) break;
    if (sy + e.h < y0) continue;
    const flipped = activeTopic ? pickTopicFlip(e, activeTopic.tags, activeTopic.seed) : undefined;
    if (flipped) drawTopicProp(ctx, flipped, e.w, e.h, e.x, sy, T + e.ph, e.v);
    else drawEntity(ctx, e.def, e.v, e.look, e.x, sy, e.flip, T + e.ph);
    // Reactions copy and jiggle props, not whole buildings.
    if (report && !e.anchor && e.w <= 40 && e.h <= 32) ENTITY_SPOTS.push(e.x - 1, R(sy) - 1, e.w + 2, e.h + 2);
    if (report) {
      const hit = flipped ? entryForTopic(flipped.id) : entryForEntity(e.def.id, id);
      if (hit) MANUAL_TARGETS.push({ x: e.x, y: R(sy), w: e.w, h: e.h, entryId: hit.entry.id, layer: hit.layer });
    }
  }
}

// ---------------------------------------------------------------------------------------------
// Layers: each paints its own background in its module (src/layers/<layer-id>.ts), calling back to place its props.

export const LAYER_ART_V4: Record<LayerId, Art> = {} as Record<LayerId, Art>;
for (const id of ALL_LAYER_IDS) {
  LAYER_ART_V4[id] = (ctx, b) => {
    use(id, b);
    LAYER_ART[id].background(ctx, b, { T, entities: () => entities(ctx, b, id) });
  };
}
