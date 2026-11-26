import { enforce } from '../core/enforce';
import { ALL_LAYER_IDS, layersFor, type LayerId } from '../core/layers';
import { look } from '../looks';
import { hash, type Art, type Band } from './art';
import { SEAM_H, glow, offscreen, prows, tiled, vgrad, vis } from './art-detailed';
import { LAYER_PALETTE, type PaletteMode } from './palettes';
import { c, checkLibrary, drawEntity, setPaint, type RGB } from './v4/kit';
import { V4_LIBRARIES } from './v4/libraries';
import { FAR_F, type LayerPlacement, type Placed } from './v4/place';
import { CORE_DY, RAIL_START, RAIL_STEP, placeBandForSpec, specKey, type WorldSpecV4 } from './v4/world';

/**
 * Layer art v4 (look `artStyle: v4`): a seeded world of hand-drawn entities, placed once.
 *
 * - Each layer has its own library of ~20 entity types plus one or two anchor structures (src/render/v4/lib-*.ts).
 * - The scene calls ensureWorldV4() with the world seed (the puzzle number by default) and the viewport geometry;
 *   placement (src/render/v4/place.ts) runs only when that changes, so nothing reshuffles while you play.
 * - Entity bodies are baked into cached sprites per palette; only their small animation overlays draw per frame,
 *   on art time (b.t, frozen in Ring −2; 0 under reduced motion).
 * - Backgrounds follow v3: calm fills, a little texture, light as dithered gradients.
 */

type Ctx = CanvasRenderingContext2D;
const R = Math.round;
const TAU = Math.PI * 2;
const mod = (n: number, m: number) => ((n % m) + m) % m;

for (const id of ALL_LAYER_IDS) {
  const lib = V4_LIBRARIES[id];
  checkLibrary(`v4 ${id}`, lib.near, 20);
  checkLibrary(`v4 ${id} anchors`, lib.anchors, 1);
}

const FOG: Record<LayerId, RGB> = {
  internet: [165, 208, 245],
  browser: [155, 195, 238],
  application: [150, 190, 235],
  bytecode: [24, 16, 48],
  jit: [34, 12, 34],
  runtime: [0, 0, 51],
  libraries: [0, 0, 0],
  linker: [8, 12, 22],
  userspace: [0, 0, 0],
  'kernel-entry': [0, 16, 28],
  kernel: [0, 0, 0],
  'kernel-arch': [26, 0, 0],
  drivers: [0, 0, 0],
  'bus-fabric': [16, 0, 24],
  firmware: [0, 0, 0],
  vmm: [0, 0, 0],
  'ring-1': [0, 0, 0],
  ept: [0, 0, 0],
  'ring-2': [0, 0, 0],
  smram: [0, 0, 0],
  'ring-3': [0, 0, 0],
  'me-minix-user': [10, 5, 0],
  'me-minix-kern': [10, 5, 0],
  uarch: [4, 12, 24],
  rtl: [4, 12, 24],
  cmos: [8, 6, 14],
  litho: [8, 4, 18],
  bandgap: [3, 4, 10],
  landauer: [3, 4, 10],
};

let mode: PaletteMode = 'full';
let T = 0;

function use(id: LayerId, b: Band) {
  mode = look('palette') === 'per-layer' ? LAYER_PALETTE[id] : 'full';
  setPaint(mode, undefined);
  T = b.reduced ? 0 : b.t;
}

function rect(ctx: Ctx, x: number, y: number, w: number, h: number, col: string) {
  ctx.fillStyle = c(col);
  ctx.fillRect(R(x), R(y), R(w), R(h));
}

// ---------------------------------------------------------------------------------------------
// The world: lazily placed per visible band on demand (O(1) startup & resize, scales to Endless).

let worldSpec: WorldSpecV4 | undefined;
let bandCache: (LayerPlacement | undefined)[] = [];
let bandIndexById = new Map<LayerId, number>();
let worldKey = '';

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

/** Draw a band's far plane (fogged) and near plane in O(log N + visible). Reports near entities unless this is a seam redraw. */
function entities(ctx: Ctx, b: Band, id: LayerId) {
  const idx = bandIndexById.get(id);
  enforce(idx !== undefined, `v4: layer ${id} not in active stack`);
  const pl = bandPlacement(idx);
  const [y0, y1] = vis(b);
  setPaint(mode, FOG[id]);
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
    drawEntity(ctx, e.def, e.v, e.look, e.x, sy, e.flip, T + e.ph);
    // Reactions copy and jiggle props, not whole buildings.
    if (report && !e.anchor && e.w <= 40 && e.h <= 32) ENTITY_SPOTS.push(e.x - 1, R(sy) - 1, e.w + 2, e.h + 2);
  }
}

// ---------------------------------------------------------------------------------------------
// Layers: background, entities, and the layer's floor or focal structure.

function application(ctx: Ctx, b: Band) {
  use('application', b);
  vgrad(ctx, b, b.bottom - 230, b.bottom + SEAM_H, [
    [0, '#b4e2f7'],
    [0.35, '#7ab0e4'],
    [0.7, '#5868b8'],
    [0.9, '#3a3474'],
    [1, '#2a2350'],
  ]);
  const sy = R(b.bottom * 0.35) - 70;
  glow(ctx, b.w * 0.8, sy, 80, 'rgba(255,248,215,0.6)');
  rect(ctx, b.w * 0.8 - 4, sy - 4, 8, 8, '#fffbe8');
  // Slow clouds on a far plane: sky, not props.
  prows(b, 0.25, 30, (y, i) => {
    if (hash(i * 5 + 1) < 0.55) return;
    const w = 10 + R(hash(i * 5 + 3) * 12);
    const x = mod(hash(i * 5 + 2) * (b.w + 40) + T * 1.5, b.w + 40) - 20;
    rect(ctx, x + 2, y - 2, w - 5, 2, '#ffffff');
    rect(ctx, x, y, w, 3, '#ffffff');
    rect(ctx, x + 1, y + 3, w - 2, 1, '#c8d6f0');
  });
  entities(ctx, b, 'application');
  // The dock: the floor of the layer.
  const dy = R(b.bottom - 14);
  const dw = Math.min(b.w - 24, 110);
  const dx = R((b.w - dw) / 2);
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.fillRect(dx, dy, dw, 9);
  rect(ctx, dx, dy, dw, 1, '#dfe6f6');
  const dockCols: [string, string][] = [
    ['#5b8ee6', '#3d6cc4'],
    ['#e6a23c', '#c27c1c'],
    ['#59c08a', '#2f9963'],
    ['#d0605e', '#a83f3d'],
    ['#a070e0', '#7a4cc0'],
  ];
  for (let k = 0; k * 9 + 8 < dw; k++) {
    const [a, a2] = dockCols[k % dockCols.length]!;
    rect(ctx, dx + 3 + k * 9, dy + 2, 6, 6, a2);
    rect(ctx, dx + 3 + k * 9, dy + 2, 6, 3, a);
  }
}

function runtime(ctx: Ctx, b: Band) {
  use('runtime', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000033');
  vgrad(ctx, b, b.top, b.top + 50, [
    [0, 'rgba(102,102,204,0.55)'],
    [1, 'rgba(102,102,204,0)'],
  ]);
  entities(ctx, b, 'runtime');
  // Freed bytes drifting up.
  prows(b, 1.25, 12, (y, i) => {
    if (hash(i * 5) < 0.6) return;
    rect(ctx, hash(i * 5 + 1) * b.w, y - mod(T * 4, 12), 1, 1, '#9999cc');
  });
}

function libraries(ctx: Ctx, b: Band) {
  use('libraries', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  entities(ctx, b, 'libraries');
  // The reading-room floor.
  rect(ctx, 0, b.bottom - 4, b.w, 4, '#550000');
  rect(ctx, 0, b.bottom - 4, b.w, 1, '#aa5500');
  for (let x = mod(-7, 23); x < b.w; x += 23) rect(ctx, x, b.bottom - 3, 1, 3, '#000000');
}

function userspace(ctx: Ctx, b: Band) {
  use('userspace', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  prows(b, 0.1, 14, (y, i) => {
    if (hash(i * 3) > 0.12) return;
    rect(ctx, hash(i * 3 + 1) * b.w, y, 1, 1, hash(i * 3 + 2) > 0.7 ? '#ffffff' : '#555555');
  });
  entities(ctx, b, 'userspace');
  rect(ctx, 0, b.bottom - 6, b.w, 6, '#0000aa');
  vgrad(ctx, b, b.bottom - 22, b.bottom - 6, [
    [0, 'rgba(0,0,170,0)'],
    [1, 'rgba(0,0,170,0.8)'],
  ]);
  for (let x = 12; x < b.w; x += 40) {
    rect(ctx, x, b.bottom - 16, 1, 10, '#555555');
    rect(ctx, x - 1, b.bottom - 17, 3, 1, '#ffff55');
  }
}

const KWALL = () =>
  offscreen('v4-kernel-wall', 30, 20, (cx) => {
    cx.fillStyle = '#000000';
    cx.fillRect(0, 0, 30, 20);
    cx.fillStyle = '#555555';
    cx.fillRect(0, 19, 30, 1);
    cx.fillRect(29, 0, 1, 20);
  });

function kernel(ctx: Ctx, b: Band) {
  use('kernel', b);
  const [y0, y1] = vis(b);
  tiled(ctx, KWALL(), 0, y0, b.w, y1 - y0, 0, R(b.top * 0.5));
  entities(ctx, b, 'kernel');
  prows(b, 1, 16, (y, i) => {
    if (hash(i * 7) < 0.7) return;
    const k = mod(T * 10 + hash(i * 7 + 1) * 16, 16);
    rect(ctx, hash(i * 7 + 2) * b.w + Math.sin(T + i) * 2, y + 16 - k, 1, 1, k < 8 ? '#ffff55' : '#ff5555');
  });
  vgrad(ctx, b, b.bottom - 40, b.bottom + SEAM_H, [
    [0, 'rgba(255,85,0,0)'],
    [1, 'rgba(255,85,0,0.45)'],
  ]);
}

function drivers(ctx: Ctx, b: Band) {
  use('drivers', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  prows(b, 0.5, 12, (y, i) => {
    for (let x = mod(i * 5, 12); x < b.w; x += 24) if (hash(i * 61 + x) > 0.6) rect(ctx, x, y, 1, 1, '#55ffff');
  });
  entities(ctx, b, 'drivers');
}

const PLATE = () =>
  offscreen('v4-vault-plate', 40, 26, (cx) => {
    cx.fillStyle = '#000000';
    cx.fillRect(0, 0, 40, 26);
    cx.fillStyle = '#555555';
    cx.fillRect(0, 0, 40, 1);
    cx.fillRect(0, 0, 1, 26);
  });

function firmware(ctx: Ctx, b: Band) {
  use('firmware', b);
  const [y0, y1] = vis(b);
  tiled(ctx, PLATE(), 0, y0, b.w, y1 - y0, 0, R(b.top * 0.5));
  entities(ctx, b, 'firmware');
  vgrad(ctx, b, b.bottom - 40, b.bottom + SEAM_H, [
    [0, 'rgba(255,255,255,0)'],
    [1, 'rgba(255,255,255,0.2)'],
  ]);
}

function ringMinus1(ctx: Ctx, b: Band) {
  use('ring-1', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  entities(ctx, b, 'ring-1');
}

function ringMinus2(ctx: Ctx, b: Band) {
  use('ring-2', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  entities(ctx, b, 'ring-2');
}

const CELLS = () =>
  offscreen('v4-die-cells', 24, 6, (cx) => {
    cx.fillStyle = '#000000';
    cx.fillRect(0, 0, 24, 6);
    cx.fillStyle = '#ffffff';
    for (let x = 0; x < 24; x += 6) cx.fillRect(x, 0, 1, 6);
    for (let x = 0; x < 24; x++) if (hash(x + 1000) > 0.6) cx.fillRect(x, 2 + (x % 2) * 2, 1, 1);
  });

/**
 * Ring −3: the calm at the bottom. The seal ring at the die edge, the always-on core as the focal point with its
 * heartbeat running out along its traces, sparse power rails, and the die's small parts between them.
 */
function ringMinus3(ctx: Ctx, b: Band) {
  use('ring-3', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');

  // Power rails with standard cells only in the strip below each.
  for (let k = 0; ; k++) {
    const y = R(b.top + RAIL_START + k * RAIL_STEP);
    if (y > y1) break;
    if (y + 14 < y0) continue;
    rect(ctx, 0, y, b.w, 1, '#ffffff');
    rect(ctx, 0, y + 3, b.w, 1, '#ffffff');
    for (let x = mod(k * 7, 10); x < b.w; x += 10) rect(ctx, x, y + 1, 2, 2, '#ffffff');
    tiled(ctx, CELLS(), 0, y + 6, b.w, 6, R(k * 9), y + 6);
  }

  entities(ctx, b, 'ring-3');

  // Seal ring and bond pads at the die edge.
  const ey = R(b.top + 4);
  rect(ctx, 0, ey, b.w, 1, '#ffffff');
  rect(ctx, 0, ey + 2, b.w, 1, '#ffffff');
  for (let x = 6; x < b.w; x += 18) {
    rect(ctx, x, ey + 6, 8, 8, '#ffffff');
    rect(ctx, x + 2, ey + 8, 4, 4, '#000000');
    rect(ctx, x + 3, ey + 14, 2, 8, '#ffffff');
  }

  // The always-on core.
  const cx = R(b.w / 2);
  const cy = R(b.top + CORE_DY);
  const beat = b.reduced ? 0.4 : Math.max(0, Math.sin(b.t * 3.2)) ** 6;
  for (const off of [-5, 0, 5]) {
    rect(ctx, cx + 20, cy + off, b.w, 1, '#ffffff');
    rect(ctx, 0, cy + off, cx - 20, 1, '#ffffff');
    rect(ctx, cx + off - 1, cy + 20, 3, b.h, '#000000');
    rect(ctx, cx + off, cy + 20, 1, b.h, '#ffffff');
  }
  if (!b.reduced) {
    const d = R((((b.t * 3.2) / TAU) % 1) * 160);
    for (const off of [-5, 0, 5]) {
      rect(ctx, cx + 20 + d, cy + off - 1, 4, 3, '#ffffff');
      rect(ctx, cx - 24 - d, cy + off - 1, 4, 3, '#ffffff');
      rect(ctx, cx + off - 1, cy + 20 + d, 3, 4, '#ffffff');
    }
  }
  rect(ctx, cx - 20, cy - 20, 41, 41, '#000000');
  glow(ctx, cx, cy, 22 + beat * 10, `rgba(255,255,255,${0.3 + beat * 0.4})`);
  for (let k = -15; k <= 15; k += 5) {
    rect(ctx, cx + k, cy - 16, 2, 2, '#ffffff');
    rect(ctx, cx + k, cy + 15, 2, 2, '#ffffff');
    rect(ctx, cx - 16, cy + k, 2, 2, '#ffffff');
    rect(ctx, cx + 15, cy + k, 2, 2, '#ffffff');
  }
  rect(ctx, cx - 11, cy - 11, 23, 23, '#000000');
  rect(ctx, cx - 10, cy - 10, 21, 21, '#ffffff');
  rect(ctx, cx - 9, cy - 9, 19, 19, '#000000');
  for (let k = 0; k < 3; k++) for (let j = 0; j < 3; j++) if (hash(k * 3 + j + 77) > 0.3) rect(ctx, cx - 6 + k * 5, cy - 6 + j * 5, 3, 3, '#ffffff');
  rect(ctx, cx - 2, cy - 2, 5, 5, beat > 0.3 ? '#ffffff' : '#000000');
}

// ---------------------------------------------------------------------------------------------
// Endless Mode layer art (Zones A–F): distinct backgrounds, grids, tints, and atmospheres.

function internet(ctx: Ctx, b: Band) {
  use('internet', b);
  vgrad(ctx, b, b.top, b.bottom + SEAM_H, [
    [0, '#cfefff'],
    [0.5, '#9ed4f5'],
    [1, '#b4e2f7'],
  ]);
  // Pastel fiber routing arcs across the sky
  prows(b, 0.3, 36, (y, i) => {
    if (hash(i * 7 + 2) < 0.45) return;
    const x = mod(hash(i * 7 + 3) * (b.w + 30) + T * 4, b.w + 30) - 15;
    rect(ctx, 0, y, b.w, 1, '#dfe6f6');
    rect(ctx, x, y, 6, 1, '#5b8ee6');
  });
  entities(ctx, b, 'internet');
}

function browser(ctx: Ctx, b: Band) {
  use('browser', b);
  vgrad(ctx, b, b.top, b.bottom + SEAM_H, [
    [0, '#c2e4f8'],
    [0.6, '#8cbbe8'],
    [1, '#b4e2f7'],
  ]);
  // Subtle compositor tile grid
  prows(b, 0.4, 24, (y) => rect(ctx, 0, y, b.w, 1, '#a9c4f4'));
  entities(ctx, b, 'browser');
}

function bytecode(ctx: Ctx, b: Band) {
  use('bytecode', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000033');
  vgrad(ctx, b, b.top, b.bottom + SEAM_H, [
    [0, 'rgba(255,153,51,0.22)'],
    [0.5, 'rgba(51,51,102,0.18)'],
    [1, 'rgba(0,0,51,0)'],
  ]);
  entities(ctx, b, 'bytecode');
}

function jit(ctx: Ctx, b: Band) {
  use('jit', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#330033');
  vgrad(ctx, b, b.bottom - 60, b.bottom + SEAM_H, [
    [0, 'rgba(255,102,51,0)'],
    [1, 'rgba(255,102,51,0.38)'],
  ]);
  entities(ctx, b, 'jit');
  prows(b, 1.1, 14, (y, i) => {
    if (hash(i * 11) < 0.72) return;
    const k = mod(T * 12 + hash(i * 11 + 1) * 14, 14);
    rect(ctx, hash(i * 11 + 2) * b.w, y + 14 - k, 1, 1, k < 6 ? '#ffff66' : '#ff6633');
  });
}

function linker(ctx: Ctx, b: Band) {
  use('linker', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  prows(b, 0.35, 22, (y) => rect(ctx, 0, y, b.w, 1, '#555555'));
  entities(ctx, b, 'linker');
}

function kernelEntry(ctx: Ctx, b: Band) {
  use('kernel-entry', b);
  const [y0, y1] = vis(b);
  tiled(ctx, KWALL(), 0, y0, b.w, y1 - y0, 0, R(b.top * 0.5));
  vgrad(ctx, b, b.top, b.top + 60, [
    [0, 'rgba(85,255,255,0.28)'],
    [1, 'rgba(85,255,255,0)'],
  ]);
  entities(ctx, b, 'kernel-entry');
}

function kernelArch(ctx: Ctx, b: Band) {
  use('kernel-arch', b);
  const [y0, y1] = vis(b);
  tiled(ctx, KWALL(), 0, y0, b.w, y1 - y0, 0, R(b.top * 0.5));
  vgrad(ctx, b, b.bottom - 50, b.bottom + SEAM_H, [
    [0, 'rgba(255,85,85,0)'],
    [1, 'rgba(255,85,85,0.4)'],
  ]);
  entities(ctx, b, 'kernel-arch');
}

function busFabric(ctx: Ctx, b: Band) {
  use('bus-fabric', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  prows(b, 0.5, 16, (y, i) => {
    rect(ctx, 0, y, b.w, 1, i % 2 ? '#ff55ff' : '#55ffff');
  });
  entities(ctx, b, 'bus-fabric');
}

function vmm(ctx: Ctx, b: Band) {
  use('vmm', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  prows(b, 0.4, 20, (y) => rect(ctx, 0, y, b.w, 1, '#555555'));
  entities(ctx, b, 'vmm');
}

function ept(ctx: Ctx, b: Band) {
  use('ept', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  for (let x = 16; x < b.w; x += 32) rect(ctx, x, y0, 1, y1 - y0, '#555555');
  prows(b, 0.5, 24, (y) => rect(ctx, 0, y, b.w, 1, '#555555'));
  entities(ctx, b, 'ept');
}

function smram(ctx: Ctx, b: Band) {
  use('smram', b);
  const [y0, y1] = vis(b);
  tiled(ctx, PLATE(), 0, y0, b.w, y1 - y0, 0, R(b.top * 0.5));
  entities(ctx, b, 'smram');
}

function meMinixUser(ctx: Ctx, b: Band) {
  use('me-minix-user', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  prows(b, 0.2, 16, (y, i) => {
    if (hash(i * 5) > 0.22) return;
    rect(ctx, hash(i * 5 + 1) * b.w, y, 1, 1, '#aaaaaa');
  });
  entities(ctx, b, 'me-minix-user');
}

function meMinixKern(ctx: Ctx, b: Band) {
  use('me-minix-kern', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  prows(b, 0.5, 20, (y) => rect(ctx, 0, y, b.w, 1, '#555555'));
  entities(ctx, b, 'me-minix-kern');
}

function uarch(ctx: Ctx, b: Band) {
  use('uarch', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  // Blueprint schematic grid
  for (let x = 20; x < b.w; x += 20) rect(ctx, x, y0, 1, y1 - y0, '#555555');
  prows(b, 0.5, 20, (y) => rect(ctx, 0, y, b.w, 1, '#555555'));
  entities(ctx, b, 'uarch');
}

function rtl(ctx: Ctx, b: Band) {
  use('rtl', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  prows(b, 0.6, 26, (y, i) => {
    const x = mod(T * 18 + i * 23, b.w);
    rect(ctx, 0, y, b.w, 1, '#555555');
    rect(ctx, x, y, 5, 1, '#ffffff');
  });
  entities(ctx, b, 'rtl');
}

function cmos(ctx: Ctx, b: Band) {
  use('cmos', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#08060e');
  prows(b, 0.45, 28, (y, i) => rect(ctx, 0, y, b.w, 1, i % 2 ? '#24989c' : '#9448d4'));
  entities(ctx, b, 'cmos');
}

function litho(ctx: Ctx, b: Band) {
  use('litho', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  prows(b, 0.35, 18, (y, i) => {
    for (let x = (i % 2) * 8; x < b.w; x += 16) rect(ctx, x, y, 1, 1, '#555555');
  });
  entities(ctx, b, 'litho');
}

function bandgap(ctx: Ctx, b: Band) {
  use('bandgap', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  vgrad(ctx, b, b.top, b.bottom + SEAM_H, [
    [0, 'rgba(76,168,214,0.18)'],
    [0.5, 'rgba(3,4,10,0)'],
    [1, 'rgba(76,168,214,0.22)'],
  ]);
  entities(ctx, b, 'bandgap');
}

function landauer(ctx: Ctx, b: Band) {
  use('landauer', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  // Rare cosmic-ray bit-flip streaks across the pure abyss
  if (!b.reduced) {
    const slot = Math.floor(T * 0.6);
    if (hash(slot * 31) > 0.55) {
      const rx = hash(slot * 17) * b.w;
      const ry = y0 + hash(slot * 23) * Math.max(20, y1 - y0);
      for (let k = 0; k < 12; k++) rect(ctx, rx + k, ry + k, 1, 1, k > 8 ? '#ffffff' : '#555555');
    }
  }
  entities(ctx, b, 'landauer');
}

export const LAYER_ART_V4: Record<LayerId, Art> = {
  internet,
  browser,
  application,
  bytecode,
  jit,
  runtime,
  libraries,
  linker,
  userspace,
  'kernel-entry': kernelEntry,
  kernel,
  'kernel-arch': kernelArch,
  drivers,
  'bus-fabric': busFabric,
  firmware,
  vmm,
  'ring-1': ringMinus1,
  ept,
  'ring-2': ringMinus2,
  smram,
  'ring-3': ringMinus3,
  'me-minix-user': meMinixUser,
  'me-minix-kern': meMinixKern,
  uarch,
  rtl,
  cmos,
  litho,
  bandgap,
  landauer,
};
