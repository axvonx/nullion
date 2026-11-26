import { enforce } from '../core/enforce';
import { expandLayerMap, type LayerId } from '../core/layers';
import { BYTECODE, DMESG, FONT, LIBS, PROCS, hash, type Art, type Band } from './art';

/**
 * Detailed layer art (look `artStyle: v2`): each layer is a place you descend through, not a screenshot of a UI.
 *
 * Rules every layer follows:
 * - Everything is seeded by a world row index via hash(), so nothing shimmers. Animation runs on b.t only,
 *   so Ring −2's freeze (which stops b.t) stops everything.
 * - Depth comes from parallax planes: a plane with factor f scrolls at f × camera speed (see prows).
 * - Only fillRect, small cached sprites and a few gradients: no per-pixel JS here; quantize does the dithering.
 * - Solid areas use colours that sit exactly on the layer's palette levels (see palettes.ts), so they stay clean;
 *   off-level colours (glows, gradients, translucent fills) are where the ordered dither is meant to show.
 * - Art may draw past b.bottom: the scene clips each band, and reuses that overdraw for the frayed seam.
 */

/** Rows the upper layer frays down into the lower one. */
export const SEAM_H = 14;

const R = Math.round;
const TAU = Math.PI * 2;

export function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string) {
  ctx.fillStyle = c;
  ctx.fillRect(R(x), R(y), R(w), R(h));
}

/** Visible screen rows this band may paint, including the seam overdraw below it. */
export function vis(b: Band): [number, number] {
  return [Math.max(b.top, b.from ?? 0), Math.min(b.bottom + SEAM_H, b.h)];
}

/**
 * Parallax rows: plane f scrolls at f × the camera, so f < 1 is behind and f > 1 is in front.
 * Calls fn(screenY, rowIndex) for every row of `step` world pixels that can touch the screen.
 */
export function prows(b: Band, f: number, step: number, fn: (y: number, i: number) => void, margin = step) {
  const [y0, y1] = vis(b);
  const top = R(b.top * f);
  const first = Math.floor((y0 - margin - top) / step);
  for (let i = first; top + i * step < y1 + margin; i++) fn(top + i * step, i);
}

/** Vertical gradient over the visible band. */
export function vgrad(ctx: CanvasRenderingContext2D, b: Band, y0: number, y1: number, stops: [number, string][]) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  for (const [o, c] of stops) g.addColorStop(o, c);
  const [a, z] = vis(b);
  ctx.fillStyle = g;
  ctx.fillRect(0, a, b.w, z - a);
}

export function glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(R(x - r), R(y - r), R(r * 2), R(r * 2));
}

/** Pixel-exact line (Bresenham), so thin wires stay crisp after quantization. */
export function line(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, c: string) {
  ctx.fillStyle = c;
  x0 = R(x0);
  y0 = R(y0);
  x1 = R(x1);
  y1 = R(y1);
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (let n = 0; n < 2000; n++) {
    ctx.fillRect(x0, y0, 1, 1);
    if (x0 === x1 && y0 === y1) return;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x0 += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y0 += sy;
    }
  }
}

/** A sagging thread between two points, sampled per pixel column. */
export function thread(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, sag: number, c: string) {
  const n = Math.max(2, Math.ceil(Math.abs(x1 - x0) / 2));
  let px0 = x0;
  let py0 = y0;
  for (let k = 1; k <= n; k++) {
    const t = k / n;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t + sag * 4 * t * (1 - t);
    line(ctx, px0, py0, x, y, c);
    px0 = x;
    py0 = y;
  }
}

export function threadPoint(x0: number, y0: number, x1: number, y1: number, sag: number, t: number): [number, number] {
  return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + sag * 4 * t * (1 - t)];
}

// ---------------------------------------------------------------------------------------------
// Cached pixel sprites and tiles. Built once on first use; drawImage afterwards.

const cache = new Map<string, HTMLCanvasElement>();

export function offscreen(key: string, w: number, h: number, draw: (c: CanvasRenderingContext2D) => void): HTMLCanvasElement {
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const cx = c.getContext('2d');
  enforce(cx, `offscreen 2D context unavailable for ${key}`);
  draw(cx);
  cache.set(key, c);
  return c;
}

/** Sprite from char rows; each char maps through `pal`, space is transparent. */
export function pix(key: string, rows: string[], pal: Record<string, string>): HTMLCanvasElement {
  const w = rows[0]!.length;
  enforce(rows.every((r) => r.length === w), `sprite ${key}: rows must be equal width`);
  return offscreen(key, w, rows.length, (c) => {
    rows.forEach((row, y) => {
      for (let x = 0; x < w; x++) {
        const ch = row[x]!;
        if (ch === ' ') continue;
        const col = pal[ch];
        enforce(col, `sprite ${key}: no colour for '${ch}'`);
        c.fillStyle = col;
        c.fillRect(x, y, 1, 1);
      }
    });
  });
}

export function blit(ctx: CanvasRenderingContext2D, img: HTMLCanvasElement, x: number, y: number, flip = false) {
  if (!flip) {
    ctx.drawImage(img, R(x), R(y));
    return;
  }
  ctx.save();
  ctx.translate(R(x) + img.width, R(y));
  ctx.scale(-1, 1);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

/** Fill a rect with a cached tile, scrolled by (ox, oy) so it moves with its parallax plane. */
export function tiled(ctx: CanvasRenderingContext2D, img: HTMLCanvasElement, x: number, y: number, w: number, h: number, ox: number, oy: number) {
  const p = ctx.createPattern(img, 'repeat');
  enforce(p, 'createPattern failed');
  p.setTransform(new DOMMatrix([1, 0, 0, 1, R(ox), R(oy)]));
  ctx.fillStyle = p;
  ctx.fillRect(R(x), R(y), R(w), R(h));
}

export function text(ctx: CanvasRenderingContext2D, s: string, x: number, y: number, c: string) {
  ctx.font = FONT;
  ctx.fillStyle = c;
  ctx.fillText(s, R(x), R(y));
}

// ---------------------------------------------------------------------------------------------
// Application (full colour): a bright sky full of floating windows at three depths, settling onto a dock.

export const ACCENTS: [string, string][] = [
  ['#5b8ee6', '#3d6cc4'],
  ['#9a6ae0', '#7446c0'],
  ['#3fb89a', '#278a73'],
  ['#e0785a', '#c0563c'],
  ['#e0b040', '#c08e22'],
];

export function appWindow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number) {
  x = R(x);
  y = R(y);
  w = R(w);
  h = R(h);
  const [a, a2] = ACCENTS[Math.floor(hash(seed) * ACCENTS.length)]!;
  px(ctx, x + 2, y + 3, w, h, 'rgba(18,30,80,0.18)');
  px(ctx, x + 1, y + 1, w, h, 'rgba(18,30,80,0.28)');
  px(ctx, x - 1, y - 1, w + 2, h + 2, '#2a3358');
  px(ctx, x, y, w, 5, a2);
  px(ctx, x, y, w, 2, a);
  px(ctx, x, y, w, 1, 'rgba(255,255,255,0.5)');
  px(ctx, x + 1, y + 2, 1, 1, '#ff6159');
  px(ctx, x + 3, y + 2, 1, 1, '#ffbd2e');
  px(ctx, x + 5, y + 2, 1, 1, '#28c941');
  px(ctx, x, y + 5, w, h - 5, '#f3efe6');
  px(ctx, x, y + 5, w, 1, '#ffffff');
  px(ctx, x + w - 1, y + 5, 1, h - 5, '#d6d0c2');
  px(ctx, x, y + h - 1, w, 1, '#cfc8b8');
  const cx = x + 2;
  const cy = y + 7;
  const cw = w - 4;
  const ch = h - 9;
  switch (Math.floor(hash(seed + 1) * 5)) {
    case 0: // document
      px(ctx, cx, cy, 4, 4, a);
      for (let l = 0; l * 3 < ch - 1; l++) px(ctx, cx + (l === 0 ? 6 : 0), cy + l * 3, (cw - (l === 0 ? 6 : 0)) * (0.5 + hash(seed + 9 + l) * 0.5), 1, '#a8acb8');
      break;
    case 1: {
      // photo: sky, sun, hills
      px(ctx, cx, cy, cw, ch, '#ffd29a');
      px(ctx, cx, cy, cw, R(ch / 2), '#ffb889');
      px(ctx, cx + cw - 6, cy + 2, 3, 3, '#fff3c8');
      for (let k = 0; k < cw; k++) {
        const hh = R(ch * (0.35 + 0.25 * Math.sin(k * 0.35 + seed) + 0.1 * Math.sin(k * 1.3)));
        px(ctx, cx + k, cy + ch - hh, 1, hh, k % 7 < 4 ? '#5a8a6a' : '#4d7a5c');
      }
      break;
    }
    case 2: // form
      px(ctx, cx, cy, cw * 0.4, 1, '#a8acb8');
      px(ctx, cx, cy + 3, cw, 5, '#ffffff');
      px(ctx, cx, cy + 3, cw, 1, '#b8b2a4');
      px(ctx, cx + cw - 12, cy + ch - 5, 12, 5, a);
      px(ctx, cx + cw - 12, cy + ch - 5, 12, 1, 'rgba(255,255,255,0.5)');
      break;
    case 3: // chart
      for (let k = 0; k * 4 < cw - 2; k++) {
        const hh = R((ch - 1) * (0.25 + hash(seed + 20 + k) * 0.75));
        px(ctx, cx + 1 + k * 4, cy + ch - hh, 3, hh, k % 3 ? a : a2);
      }
      px(ctx, cx, cy + ch, cw, 1, '#a8acb8');
      break;
    default: // progress dialog
      px(ctx, cx, cy, cw * 0.7, 1, '#a8acb8');
      px(ctx, cx, cy + 4, cw, 4, '#d8d2c4');
      px(ctx, cx, cy + 4, cw * (0.2 + hash(seed + 4) * 0.7), 4, a);
      px(ctx, cx, cy + 4, cw * (0.2 + hash(seed + 4) * 0.7), 1, 'rgba(255,255,255,0.45)');
  }
}

/** A pixel cumulus: stacked rounded slabs, lit from above, shaded underneath. */
export function cloud(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, seed: number, a: number) {
  const lumps = 2 + Math.floor(hash(seed) * 3);
  for (let k = 0; k < lumps; k++) {
    const lw = R(w * (0.3 + hash(seed + k + 1) * 0.3));
    const lx = R(x + (w - lw) * hash(seed + k + 7));
    const lh = R(lw * 0.35);
    px(ctx, lx + 1, y - lh, lw - 2, 1, `rgba(255,255,255,${a})`);
    px(ctx, lx, y - lh + 1, lw, lh, `rgba(255,255,255,${a})`);
  }
  px(ctx, x - 2, y, w + 4, 3, `rgba(255,255,255,${a})`);
  px(ctx, x, y + 3, w, 1, `rgba(150,170,225,${a})`);
}

function application(ctx: CanvasRenderingContext2D, b: Band) {
  vgrad(ctx, b, b.bottom - 230, b.bottom + SEAM_H, [
    [0, '#b4e2f7'],
    [0.35, '#7ab0e4'],
    [0.7, '#5868b8'],
    [0.9, '#3a3474'],
    [1, '#2a2350'],
  ]);
  // Sun haze, far off and barely moving.
  const sy = R(b.bottom * 0.35) - 70;
  glow(ctx, b.w * 0.8, sy, 110, 'rgba(255,248,215,0.7)');
  px(ctx, b.w * 0.8 - 5, sy - 5, 10, 10, '#fffbe8');
  px(ctx, b.w * 0.8 - 6, sy - 3, 12, 6, '#fffbe8');

  // Far clouds.
  prows(b, 0.25, 30, (y, i) => {
    if (hash(i * 5 + 1) < 0.35) return;
    cloud(ctx, hash(i * 5 + 2) * (b.w + 60) - 40, y, 18 + hash(i * 5 + 3) * 34, i * 5, 0.5);
  });

  // A far flock of tiny windows, washed out by the air between.
  prows(b, 0.45, 9, (y, i) => {
    for (let k = 0; k < 4; k++) {
      if (hash(i * 31 + k) < 0.55) continue;
      const x = hash(i * 31 + k + 7) * b.w - 4;
      const w = 7 + R(hash(i * 31 + k + 13) * 7);
      const [a] = ACCENTS[Math.floor(hash(i * 31 + k + 3) * ACCENTS.length)]!;
      px(ctx, x + 1, y + 1, w, 5, 'rgba(40,60,130,0.15)');
      px(ctx, x, y, w, 5, '#dfe6f6');
      px(ctx, x, y, w, 1, a);
      px(ctx, x + 1, y + 2, R(w * 0.6), 1, '#b4bfd8');
      px(ctx, x, y, w, 6, 'rgba(140,175,230,0.35)');
    }
  });

  // Mid windows.
  prows(b, 0.7, 16, (y, i) => {
    for (let k = 0; k < 3; k++) {
      if (hash(i * 17 + k) < 0.55) continue;
      const x = hash(i * 17 + k + 5) * (b.w - 14) - 4;
      appWindow(ctx, x, y + k * 5, 16 + hash(i * 17 + k + 3) * 10, 11 + hash(i * 17 + k + 9) * 4, i * 17 + k + 300);
      px(ctx, x - 1, y + k * 5 - 1, 28, 18, 'rgba(120,150,215,0.18)');
    }
  });

  // Near windows.
  prows(b, 1, 24, (y, i) => {
    for (let k = 0; k < 3; k++) {
      if (hash(i * 9 + k + 40) < 0.5) continue;
      const x = (k / 3) * b.w + hash(i * 9 + k) * (b.w / 3 - 30);
      appWindow(ctx, x, y + hash(i * 9 + k + 2) * 10, 26 + hash(i * 9 + k + 4) * 14, 17 + hash(i * 9 + k + 6) * 6, i * 9 + k + 900);
    }
  });

  // Close clouds drifting past in front.
  prows(b, 1.4, 70, (y, i) => {
    if (hash(i * 3 + 77) < 0.5) return;
    const x = ((hash(i * 3 + 78) * (b.w + 120) + b.t * 2) % (b.w + 120)) - 60;
    cloud(ctx, x, y, 40 + hash(i * 3 + 79) * 30, i * 3 + 77, 0.7);
  });

  // The dock: the floor of the application layer; below it is the underside of everything.
  const dy = R(b.bottom - 18);
  const dw = Math.min(b.w - 24, 150);
  const dx = R((b.w - dw) / 2);
  px(ctx, dx, dy, dw, 11, 'rgba(255,255,255,0.28)');
  px(ctx, dx, dy, dw, 1, 'rgba(255,255,255,0.7)');
  px(ctx, dx, dy + 11, dw, 1, 'rgba(10,10,40,0.4)');
  const icons = Math.floor((dw - 4) / 11);
  for (let k = 0; k < icons; k++) {
    const [a, a2] = ACCENTS[k % ACCENTS.length]!;
    const ix = dx + 4 + k * 11;
    px(ctx, ix, dy + 2, 8, 8, a2);
    px(ctx, ix, dy + 2, 8, 4, a);
    px(ctx, ix + 1, dy + 3, 2, 1, 'rgba(255,255,255,0.7)');
    if (k % 3 === 0) px(ctx, ix + 3, dy + 11, 2, 1, 'rgba(255,255,255,0.8)');
    px(ctx, ix, dy + 13, 8, 3, 'rgba(255,255,255,0.08)');
  }
}

// ---------------------------------------------------------------------------------------------
// Runtime (rgb6: channels in steps of 0x33): a cavernous managed heap. Girders hold objects linked by
// references; GC sweepers roll along clearing the unreachable ones; the far wall carries faded bytecode.

export const SWEEPER = () =>
  pix(
    'sweeper',
    [
      '   kkkkk      ',
      '  kmmmmmk  yy ',
      '  kmccmmk yyy ',
      ' kkkkkkkkkkk  ',
      'kmhhhhhhhhhmk ',
      'kmmmmmmmmmmmbb',
      'kddddddddddkbb',
      ' kwk   kwk  bb',
      '  k     k     ',
    ],
    { k: '#000033', m: '#9999ff', h: '#ccccff', d: '#6666cc', c: '#66ffff', y: '#ffff99', w: '#9999cc', b: '#ffcc33' },
  );
/** [body, light, shadow] per live object type. */
export const OBJ: [string, string, string][] = [
  ['#ffcc33', '#ffff99', '#cc9900'],
  ['#66ccff', '#ccffff', '#3399cc'],
  ['#ff6699', '#ffcccc', '#cc3366'],
  ['#99ff66', '#ccffcc', '#66cc33'],
];

function runtime(ctx: CanvasRenderingContext2D, b: Band) {
  const [y0, y1] = vis(b);
  px(ctx, 0, y0, b.w, y1 - y0, '#000033');
  // Light spilling down from the application layer, dithered.
  vgrad(ctx, b, b.top, b.top + 60, [
    [0, 'rgba(102,102,204,0.6)'],
    [1, 'rgba(102,102,204,0)'],
  ]);

  // Far wall: faint inscriptions and a dim object graph.
  prows(b, 0.4, 14, (y, i) => {
    if (hash(i * 3) > 0.6) text(ctx, BYTECODE[Math.floor(hash(i * 3 + 1) * BYTECODE.length)]!.toLowerCase(), hash(i * 3 + 2) * (b.w - 60), y + 8, '#330066');
    for (let k = 0; k < 5; k++) {
      const x = hash(i * 7 + k) * b.w;
      px(ctx, x, y + 3, 2, 2, '#333366');
      if (hash(i * 7 + k + 50) > 0.6) {
        const tx = hash((i + 1) * 7 + ((k + 1) % 5)) * b.w;
        px(ctx, Math.min(x, tx), y + 4, Math.abs(tx - x) + 1, 1, '#330066');
        px(ctx, tx, y + 4, 1, 14, '#330066');
      }
    }
  });

  // Girders with objects and references; generations stencilled on the steel.
  const GEN = ['eden', 'survivor', 'tenured'];
  const step = 22;
  prows(b, 1, step, (y, i) => {
    const gx0 = R(hash(i * 13) * b.w * 0.2) - 10;
    const gx1 = R(b.w - hash(i * 13 + 1) * b.w * 0.2) + 10;
    const gy = y + 16;
    for (let sx = gx0 + 12; sx < gx1; sx += 40 + R(hash(i * 13 + sx) * 20)) {
      px(ctx, sx, gy + 3, 2, step - 3, '#333366');
      px(ctx, sx, gy + 3, 1, step - 3, '#666699');
    }
    px(ctx, gx0, gy, gx1 - gx0, 3, '#666699');
    px(ctx, gx0, gy, gx1 - gx0, 1, '#9999cc');
    px(ctx, gx0, gy + 3, gx1 - gx0, 1, '#333366');
    for (let rx = gx0 + 3; rx < gx1; rx += 8) px(ctx, rx, gy + 2, 1, 1, '#333366');
    if (hash(i * 13 + 2) > 0.6) text(ctx, GEN[((i % 3) + 3) % 3]!, gx0 + 14 + hash(i * 13 + 3) * 60, gy + 10, '#333399');

    const hasSweeper = hash(i * 13 + 4) > 0.45;
    const span = gx1 - gx0 + 40;
    const sx = hasSweeper ? gx0 - 20 + ((b.t * (10 + hash(i * 13 + 5) * 8) + hash(i * 13 + 6) * span) % span) : -999;

    const objs: { x: number; w: number; h: number; live: boolean }[] = [];
    for (let x = gx0 + 3; x < gx1 - 6; ) {
      const s = i * 101 + x;
      const w = 2 + R(hash(s) * 5);
      const h = 2 + R(hash(s + 1) * 5);
      const live = hash(s + 2) > 0.35;
      if (hash(s + 3) > 0.2) objs.push({ x, w, h, live });
      x += w + 1 + R(hash(s + 4) * 4);
    }
    for (const o of objs) {
      const oy = gy - o.h;
      if (!o.live) {
        const behind = sx - o.x;
        if (behind > 0 && behind < 70) {
          if (behind < 16) {
            px(ctx, o.x + 1, gy - 2 - behind * 0.5, 1, 1, '#9999cc');
            px(ctx, o.x + o.w - 1, gy - 3 - behind * 0.3, 1, 1, '#666699');
          }
          continue;
        }
        px(ctx, o.x, oy, o.w, o.h, '#333333');
        px(ctx, o.x, oy, o.w, 1, '#666666');
        continue;
      }
      const [c, l, d] = OBJ[Math.floor(hash(o.x * 3 + i) * OBJ.length)]!;
      px(ctx, o.x, oy, o.w, o.h, c);
      px(ctx, o.x, oy, o.w, 1, l);
      if (o.w > 2) px(ctx, o.x + o.w - 1, oy + 1, 1, o.h - 1, d);
    }
    let n = 0;
    for (const o of objs) {
      if (!o.live || hash(o.x + i * 7) < 0.6 || n++ > 5) continue;
      const ox = o.x + Math.floor(o.w / 2);
      const tx = ox + R((hash(o.x + i * 9) - 0.5) * 50);
      const top = gy - step + 1;
      px(ctx, ox, top, 1, gy - o.h - top, '#6666cc');
      px(ctx, Math.min(tx, ox), top, Math.abs(tx - ox) + 1, 1, '#6666cc');
    }
    if (hasSweeper) {
      ctx.fillStyle = 'rgba(255,255,153,0.22)';
      ctx.beginPath();
      ctx.moveTo(R(sx) + 13, gy - 8);
      ctx.lineTo(R(sx) + 46, gy - 15);
      ctx.lineTo(R(sx) + 46, gy);
      ctx.lineTo(R(sx) + 13, gy);
      ctx.fill();
      blit(ctx, SWEEPER(), sx, gy - 9);
    }
  });

  // Freed bytes drifting in the foreground.
  prows(b, 1.3, 10, (y, i) => {
    if (hash(i * 5) < 0.55) return;
    px(ctx, hash(i * 5 + 1) * b.w, y + R(Math.sin(b.t * 0.7 + i) * 2), 1, 1, '#9999cc');
  });
}

// ---------------------------------------------------------------------------------------------
// Libraries (rgb4: channels in steps of 0x55): an archive. Bookcases line the walls, an aisle recedes
// in the middle, and linked symbols run as gold threads between books, with resolutions travelling along.

export const SPINES = ['#aa0000', '#0055aa', '#005500', '#aa5500', '#550055', '#005555', '#aaaa55', '#555555', '#550000', '#5555aa'];
export const SPINES_FAR = ['#550000', '#000055', '#005500', '#555500', '#550055'];

export function shelfRow(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, seed: number, far: boolean) {
  const sh = far ? 9 : 14;
  for (let x = x0 + 1; x < x1 - 1; ) {
    const s = seed * 131 + x;
    const w = far ? 1 + R(hash(s)) : 2 + R(hash(s) * 2);
    const h = far ? 5 + R(hash(s + 1) * 3) : 8 + R(hash(s + 1) * 5);
    if (hash(s + 2) < 0.07) {
      x += w + 2;
      continue;
    }
    const pal = far ? SPINES_FAR : SPINES;
    const c = pal[Math.floor(hash(s + 3) * pal.length)]!;
    px(ctx, x, y + sh - h - 1, w, h, c);
    if (!far && h > 9) {
      px(ctx, x, y + sh - h + 1, w, 1, '#ffaa00');
      if (hash(s + 5) > 0.5) px(ctx, x, y + sh - 4, w, 1, '#ffaa00');
    }
    x += w + (hash(s + 4) < 0.2 ? 1 : 0);
  }
  px(ctx, x0, y + sh - 1, x1 - x0, 2, far ? '#550000' : '#aa5500');
  if (!far) {
    px(ctx, x0, y + sh - 1, x1 - x0, 1, '#ffaa55');
    px(ctx, x0, y + sh + 1, x1 - x0, 1, '#550000');
  }
}

function libraries(ctx: CanvasRenderingContext2D, b: Band) {
  const [y0, y1] = vis(b);
  px(ctx, 0, y0, b.w, y1 - y0, '#000000');
  const aisleL = R(b.w * 0.34);
  const aisleR = R(b.w * 0.66);
  const mid = R(b.w / 2);

  // Far stacks down the aisle, then nearer side stacks: three planes receding.
  prows(b, 0.4, 10, (y, i) => shelfRow(ctx, aisleL + 18, aisleR - 18, y, i + 7000, true));
  px(ctx, mid - 2, y0, 4, y1 - y0, '#000000');
  prows(b, 0.7, 12, (y, i) => {
    shelfRow(ctx, aisleL + 2, aisleL + 16, y, i + 5000, true);
    shelfRow(ctx, aisleR - 16, aisleR - 2, y, i + 6000, true);
  });
  for (const x of [aisleL + 16, aisleR - 18]) px(ctx, x, y0, 2, y1 - y0, '#550000');

  // Near bookcases on both walls.
  prows(b, 1, 16, (y, i) => {
    shelfRow(ctx, 0, aisleL, y, i, false);
    shelfRow(ctx, aisleR, b.w, y, i + 3000, false);
    if (hash(i * 7) > 0.75) {
      const name = LIBS[Math.floor(hash(i * 7 + 1) * LIBS.length)]!.split('.')[0]!;
      ctx.font = FONT;
      const tw = Math.ceil(ctx.measureText(name).width);
      const right = hash(i * 7 + 2) > 0.5;
      const x = R(right ? aisleR + 6 + hash(i * 7 + 3) * (b.w - aisleR - tw - 12) : 6 + hash(i * 7 + 3) * (aisleL - tw - 12));
      px(ctx, x - 2, y + 14, tw + 4, 7, '#aa5500');
      px(ctx, x - 2, y + 14, tw + 4, 1, '#ffaa55');
      text(ctx, name, x, y + 20, '#ffff55');
    }
  });
  for (const x of [aisleL - 3, aisleR]) {
    px(ctx, x, y0, 3, y1 - y0, '#aa5500');
    px(ctx, x + (x < mid ? 2 : 0), y0, 1, y1 - y0, '#ffaa55');
  }

  // Linked symbols: gold threads from book to book, each with a resolution bead travelling along it.
  prows(b, 1, 16, (y, i) => {
    if (hash(i * 11) < 0.45) return;
    const x0 = 8 + hash(i * 11 + 1) * (aisleL - 16);
    const x1 = aisleR + 8 + hash(i * 11 + 2) * (b.w - aisleR - 16);
    const ya = y + 5;
    const yb = y + 5 + R((hash(i * 11 + 3) - 0.3) * 40);
    const sag = 8 + hash(i * 11 + 4) * 14;
    thread(ctx, x0, ya, x1, yb, sag, '#aa5500');
    const t = (b.t * 0.25 + hash(i * 11 + 5)) % 1;
    const [bx, by] = threadPoint(x0, ya, x1, yb, sag, t);
    px(ctx, bx - 1, by - 1, 3, 3, '#ffaa00');
    px(ctx, bx, by, 1, 1, '#ffffaa');
    px(ctx, x0 - 1, ya - 1, 3, 3, '#ffaa55');
    px(ctx, x1 - 1, yb - 1, 3, 3, '#ffaa55');
  });

  // Hanging lamps down the aisle, with warm dithered pools of light.
  prows(b, 1, 56, (y, i) => {
    const ly = y + 10 + R(hash(i) * 20);
    px(ctx, mid, ly - 30, 1, 30, '#555500');
    px(ctx, mid - 3, ly, 7, 2, '#aa5500');
    px(ctx, mid - 2, ly + 2, 5, 1, '#ffffaa');
    glow(ctx, mid, ly + 10, 44, 'rgba(255,190,90,0.3)');
    for (let k = 0; k < 6; k++) {
      const dx = (hash(i * 9 + k) - 0.5) * 40;
      const dy = 6 + hash(i * 9 + k + 3) * 30 + Math.sin(b.t * 0.6 + k + i) * 2;
      px(ctx, mid + dx, ly + dy, 1, 1, '#ffffaa');
    }
  });
}

// ---------------------------------------------------------------------------------------------
// OS userspace (CGA 16): a night city of process towers. Daemons patrol the IPC bridges.

export const DAEMON = () =>
  pix('daemon', ['h   h', 'hk kh', ' kkk ', ' yky ', ' kkk ', 'k k k'], { k: '#aa0000', h: '#ff5555', y: '#ffff55' });

/** Period of a tower's cached window grid; taller than any screen, so the repeat never shows at once. */
const TOWER_H = 720;

function tower(ctx: CanvasRenderingContext2D, b: Band, x: number, top: number, w: number, seed: number, tier: 0 | 1 | 2) {
  const [, y1] = vis(b);
  top = R(top);
  px(ctx, x, top, w, y1 - top, '#000000');
  if (tier > 0) px(ctx, x, top, 1, y1 - top, tier === 2 ? '#5555ff' : '#0000aa');
  px(ctx, x - 1, top, w + 2, 1, tier === 2 ? '#5555ff' : '#0000aa');
  if (tier > 0 && hash(seed + 1) > 0.5) {
    px(ctx, x + R(w / 2), top - 7, 1, 7, '#555555');
    const on = b.reduced || Math.floor(b.t * 0.8 + hash(seed) * 4) % 2 === 0;
    px(ctx, x + R(w / 2), top - 8, 1, 1, on ? '#ff5555' : '#aa0000');
  }
  // Windows are pre-rendered per tower (they're seeded, so the cache is exact); a few switch on and off live.
  const cell = tier === 2 ? 4 : 3;
  const sz = tier === 2 ? 2 : 1;
  const cols = Math.floor((w - 2) / cell);
  const grid = offscreen(`tower-${seed}-${w}-${tier}`, w, TOWER_H, (c) => {
    const dens = tier === 0 ? 0.88 : tier === 1 ? 0.75 : 0.62;
    for (let row = 0; row * cell + 3 < TOWER_H; row++)
      for (let col = 0; col < cols; col++) {
        const s = seed * 977 + row * 31 + col;
        if (hash(s) <= dens) continue;
        c.fillStyle = tier === 0 ? '#aa5500' : hash(s + 7) > 0.8 ? '#55ffff' : tier === 1 ? '#aa5500' : '#ffff55';
        c.fillRect(2 + col * cell, 3 + row * cell, sz, sz);
      }
  });
  // Tile the grid down the tower (period TOWER_H, taller than a screen), starting at the first visible row.
  for (let y = Math.max(top, 0); y < y1; ) {
    const sy = (((y - top) % TOWER_H) + TOWER_H) % TOWER_H;
    const h = Math.min(TOWER_H - sy, y1 - y);
    ctx.drawImage(grid, 0, sy, w, h, x, y, w, h);
    y += h;
  }
  if (tier === 0 || b.reduced) return;
  const hgt = Math.min(TOWER_H, y1 - top);
  const slot = Math.floor(b.t / 3);
  const rows = Math.floor(hgt / cell);
  for (let j = 0; j < 3 && rows > 0; j++) {
    const r = Math.floor(hash(seed * 13 + slot * 7 + j) * rows);
    const c = Math.floor(hash(seed * 17 + slot * 5 + j) * cols);
    px(ctx, x + 2 + c * cell, top + 3 + r * cell, sz, sz, hash(seed + slot + j) > 0.5 ? '#ffff55' : '#000000');
  }
}

function userspace(ctx: CanvasRenderingContext2D, b: Band) {
  const [y0, y1] = vis(b);
  px(ctx, 0, y0, b.w, y1 - y0, '#000000');
  // City glow on the low cloud: dithered blue, brightest near the street.
  vgrad(ctx, b, b.top, b.bottom, [
    [0, 'rgba(0,0,170,0.15)'],
    [1, 'rgba(0,0,170,0.85)'],
  ]);
  prows(b, 0.1, 6, (y, i) => {
    if (hash(i * 3) > 0.25) return;
    px(ctx, hash(i * 3 + 1) * b.w, y, 1, 1, hash(i * 3 + 2) > 0.8 ? '#ffffff' : '#555555');
  });
  for (let k = 0, x = -4; x < b.w; k++) {
    const w = 6 + R(hash(k + 400) * 10);
    tower(ctx, b, x, b.top * 0.3 + 14 + hash(k + 401) * 40, w, k + 400, 0);
    x += w + 1 + R(hash(k + 402) * 2);
  }
  for (let k = 0, x = -2; x < b.w; k++) {
    const w = 9 + R(hash(k + 600) * 12);
    if (hash(k + 603) > 0.3) tower(ctx, b, x, b.top * 0.65 + 26 + hash(k + 601) * 60, w, k + 600, 1);
    x += w + 3 + R(hash(k + 602) * 8);
  }
  const nearL = R(b.w * 0.18);
  const nearR = R(b.w * 0.82);
  // IPC bridges between the near towers, packets riding them, daemons on patrol.
  prows(b, 1, 20, (y, i) => {
    if (hash(i * 3) < 0.45) return;
    const py = y + 10;
    px(ctx, nearL, py, nearR - nearL, 2, '#555555');
    px(ctx, nearL, py, nearR - nearL, 1, '#aaaaaa');
    for (let x = nearL + 4; x < nearR; x += 9) px(ctx, x, py + 2, 1, 2, '#555555');
    for (let k = 0; k < 3; k++) {
      const t = (b.t * (0.15 + hash(i * 3 + k) * 0.1) + hash(i * 3 + k + 5)) % 1;
      px(ctx, nearL + t * (nearR - nearL), py, 2, 1, '#55ffff');
    }
    if (hash(i * 3 + 1) > 0.35) {
      const span = nearR - nearL - 6;
      const ph = (b.t * 0.08 + hash(i * 3 + 2)) % 2;
      const fwd = ph < 1;
      blit(ctx, DAEMON(), nearL + (fwd ? ph : 2 - ph) * span, py - 6, !fwd);
    }
  });
  tower(ctx, b, -1, b.top + 4, nearL + 1, 11, 2);
  tower(ctx, b, nearR, b.top + 14, b.w - nearR + 1, 12, 2);
  // Neon process signs hung on the near towers.
  prows(b, 1, 26, (y, i) => {
    if (hash(i * 5) < 0.45) return;
    const right = i % 2 === 0;
    const name = PROCS[((i % PROCS.length) + PROCS.length) % PROCS.length]!;
    ctx.font = FONT;
    const tw = Math.ceil(ctx.measureText(name).width);
    const x = right ? nearR + 3 : Math.max(2, nearL - tw - 5);
    glow(ctx, x + tw / 2, y + 7, 20, 'rgba(255,85,255,0.3)');
    px(ctx, x - 2, y + 2, tw + 4, 9, '#000000');
    px(ctx, x - 2, y + 2, tw + 4, 1, '#ff55ff');
    px(ctx, x - 2, y + 10, tw + 4, 1, '#ff55ff');
    text(ctx, name, x, y + 9, '#ff55ff');
  });
  // Street lamps at the foot of the city, just above the syscall bulkhead.
  for (let x = 10; x < b.w; x += 34) {
    px(ctx, x, b.bottom - 16, 1, 16, '#555555');
    px(ctx, x - 1, b.bottom - 17, 3, 1, '#ffff55');
    glow(ctx, x, b.bottom - 12, 16, 'rgba(255,255,85,0.3)');
  }
}

// ---------------------------------------------------------------------------------------------
// Kernel (CGA 16): an engine room. Pipes, gears and pistons; dmesg scrolls on a wall-mounted CRT.

const WALL = () =>
  offscreen('kernel-wall', 36, 22, (c) => {
    c.fillStyle = '#000000';
    c.fillRect(0, 0, 36, 22);
    c.fillStyle = '#555555';
    c.fillRect(0, 21, 36, 1);
    c.fillRect(35, 0, 1, 22);
    c.fillStyle = '#aa5500';
    for (const [x, y] of [[2, 2], [32, 2], [2, 18], [32, 18]] as const) c.fillRect(x, y, 1, 1);
  });

export function gear(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, teeth: number, a: number, body: string, hi: string, dark: string) {
  cx = R(cx);
  cy = R(cy);
  for (let k = 0; k < teeth; k++) {
    const t = a + (k * TAU) / teeth;
    px(ctx, cx + Math.cos(t) * r - 1, cy + Math.sin(t) * r - 1, 3, 3, body);
  }
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.arc(cx + 1, cy + 1, r - 1, 0, TAU);
  ctx.fill();
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 1, 0, TAU);
  ctx.fill();
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.arc(cx, cy, r - 4, 0, TAU);
  ctx.fill();
  for (let k = 0; k < 4; k++) {
    const t = a + (k * TAU) / 4;
    line(ctx, cx, cy, cx + Math.cos(t) * (r - 3), cy + Math.sin(t) * (r - 3), body);
  }
  px(ctx, cx - 1, cy - 1, 3, 3, hi);
  px(ctx, cx - R(r * 0.5), cy - R(r * 0.75), 2, 1, hi);
}

function kernel(ctx: CanvasRenderingContext2D, b: Band) {
  const [y0, y1] = vis(b);
  tiled(ctx, WALL(), 0, y0, b.w, y1 - y0, 0, R(b.top * 0.6));

  // Back pipes and small gears (slower plane).
  prows(b, 0.7, 30, (y, i) => {
    if (hash(i * 3 + 9) > 0.5) {
      px(ctx, 0, y + 6, b.w, 3, '#555555');
      px(ctx, 0, y + 6, b.w, 1, '#aaaaaa');
      for (let x = R(hash(i) * 30); x < b.w; x += 36) px(ctx, x, y + 5, 2, 5, '#555555');
    }
    if (hash(i * 3) > 0.35) gear(ctx, hash(i * 3 + 1) * b.w, y + 20, 7, 9, b.t * 0.6 * (i % 2 ? 1 : -1), '#555555', '#aaaaaa', '#000000');
  });

  // dmesg on a wall-mounted CRT: the only text in the room.
  prows(b, 1, 110, (y, i) => {
    const sw = Math.min(140, R(b.w * 0.4));
    const sx = i % 2 ? b.w - sw - 16 : 16;
    const sy = y + 20;
    const sh = 44;
    px(ctx, sx - 4, sy - 4, sw + 8, sh + 8, '#555555');
    px(ctx, sx - 4, sy - 4, sw + 8, 1, '#aaaaaa');
    px(ctx, sx - 4, sy + sh + 3, sw + 8, 1, '#000000');
    px(ctx, sx, sy, sw, sh, '#000000');
    for (let k = 0; k < 3; k++) px(ctx, sx + sw - 4 - k * 4, sy + sh + 1, 2, 1, k === 0 ? '#55ff55' : '#aa5500');
    ctx.save();
    ctx.beginPath();
    ctx.rect(sx + 1, sy + 1, sw - 2, sh - 2);
    ctx.clip();
    const lh = 7;
    const scroll = b.t * 4;
    const first = Math.floor(scroll / lh);
    for (let k = 0; k < sh / lh + 2; k++) {
      const n = first + k + i * 5;
      const ly = sy + 6 + k * lh - (scroll % lh);
      const ts = (n * 0.0137 + hash(n) * 0.01).toFixed(4);
      text(ctx, `[${ts}] ${DMESG[((n % DMESG.length) + DMESG.length) % DMESG.length]!}`, sx + 3, ly, k === Math.floor(sh / lh) - 1 ? '#55ff55' : '#00aa00');
    }
    ctx.restore();
    px(ctx, sx + sw - 10, sy + sh + 4, 2, 60, '#555555');
    px(ctx, sx + 10, sy + sh + 4, 1, 60, '#555555');
  });

  // Front machinery: big steel gears meshing with brass ones, and pistons.
  prows(b, 1, 42, (y, i) => {
    const left = i % 2 === 0;
    const r = 10 + R(hash(i * 7) * 5);
    const gx = left ? 14 + r + hash(i) * 16 : b.w - 14 - r - hash(i) * 16;
    const a = b.t * 0.9 * (left ? 1 : -1);
    gear(ctx, gx, y + 20, r, 10 + (r > 12 ? 4 : 0), a, '#aaaaaa', '#ffffff', '#555555');
    const sr = 6;
    gear(ctx, gx + (left ? r + sr + 2 : -r - sr - 2), y + 20 + 6, sr, 7, -a * (r / sr) + 0.2, '#aa5500', '#ffff55', '#000000');
    const pxp = left ? gx + r + 22 : gx - r - 28;
    const stroke = R(Math.sin(b.t * 2.2 + i) * 4);
    px(ctx, pxp, y + 4, 6, 12, '#555555');
    px(ctx, pxp, y + 4, 1, 12, '#aaaaaa');
    px(ctx, pxp + 2, y + 16, 2, 7 + stroke, '#ffffff');
    px(ctx, pxp - 1, y + 23 + stroke, 8, 3, '#aaaaaa');
    px(ctx, pxp - 1, y + 25 + stroke, 8, 1, '#555555');
  });

  // Red steam pipes down both walls, flanged, with pressure gauges.
  for (const x of [3, b.w - 8]) {
    px(ctx, x, y0, 5, y1 - y0, '#aa0000');
    px(ctx, x + 1, y0, 1, y1 - y0, '#ff5555');
    px(ctx, x + 4, y0, 1, y1 - y0, '#000000');
    prows(b, 1, 26, (y, i) => {
      px(ctx, x - 1, y + 4, 7, 2, '#555555');
      if (hash(i * 3 + x) > 0.65) {
        const gy = y + 14;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x + 2.5, gy, 4, 0, TAU);
        ctx.fill();
        const na = -2.2 + Math.sin(b.t + i) * 0.3;
        line(ctx, x + 2, gy, x + 2 + R(Math.cos(na) * 3), gy + R(Math.sin(na) * 3), '#aa0000');
      }
    });
  }

  // The scheduler's furnace glow at the bottom of the room.
  vgrad(ctx, b, b.bottom - 60, b.bottom + SEAM_H, [
    [0, 'rgba(255,85,0,0)'],
    [1, 'rgba(255,85,0,0.55)'],
  ]);
}

// ---------------------------------------------------------------------------------------------
// Drivers (CGA 4: black, cyan, magenta, white): wiring and buses. Ribbon cables, chips, packets,
// and IRQ lightning arcing up into the bus.

export function ribbon(ctx: CanvasRenderingContext2D, b: Band, y: number, seed: number, n: number, color: string) {
  let x = -4;
  let yy = y;
  while (x < b.w + 4) {
    const run = 20 + R(hash(seed + x) * 60);
    for (let k = 0; k < n; k++) px(ctx, x, yy + k * 2, run, 1, color);
    x += run;
    const jog = R((hash(seed + x + 1) - 0.5) * 10);
    for (let s = 0; s < Math.abs(jog); s++) for (let k = 0; k < n; k++) px(ctx, x + s, yy + k * 2 + Math.sign(jog) * s, 1, 1, color);
    x += Math.abs(jog);
    yy += jog;
  }
}

export function chip(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  x = R(x);
  y = R(y);
  for (let k = 2; k < w - 2; k += 3) px(ctx, x + k, y + h, 1, 2, '#55ffff');
  px(ctx, x, y, w, h, '#000000');
  px(ctx, x, y, w, 1, '#ff55ff');
  px(ctx, x, y, 1, h, '#ff55ff');
  px(ctx, x + w - 1, y, 1, h, '#ff55ff');
  px(ctx, x, y + h - 1, w, 1, '#ff55ff');
  px(ctx, x + 2, y + 2, 1, 1, '#ffffff');
}

function drivers(ctx: CanvasRenderingContext2D, b: Band) {
  const [y0, y1] = vis(b);
  px(ctx, 0, y0, b.w, y1 - y0, '#000000');
  // Board grid and far traces: dim, so dithered sparse.
  const grid = offscreen('pcb-grid', 6, 6, (c) => {
    c.fillStyle = 'rgba(85,255,255,0.5)';
    c.fillRect(0, 0, 1, 1);
  });
  tiled(ctx, grid, 0, y0, b.w, y1 - y0, 0, R(b.top * 0.4));
  prows(b, 0.6, 16, (y, i) => ribbon(ctx, b, y + 6, i * 77, 2, 'rgba(85,255,255,0.4)'));

  prows(b, 1, 26, (y, i) => {
    const n = 3 + R(hash(i) * 4);
    ribbon(ctx, b, y + 4, i * 131, n, i % 3 === 0 ? '#ff55ff' : '#55ffff');
    for (let k = 0; k < 5; k++) {
      const t = (b.t * (0.2 + hash(i * 4 + k) * 0.3) + hash(i * 4 + k + 9)) % 1;
      px(ctx, t * b.w, y + 4 + 2 * Math.floor(hash(i * 4 + k + 2) * n), 3, 1, '#ffffff');
    }
    for (let k = 0; k < 4; k++) {
      if (hash(i * 9 + k) < 0.5) continue;
      const cx = hash(i * 9 + k + 3) * (b.w - 20);
      const cw = 8 + R(hash(i * 9 + k + 5) * 10);
      const cy = y + 4 + n * 2 + 5;
      for (let p = 2; p < cw - 2; p += 3) px(ctx, cx + p, y + 4 + n * 2, 1, 5, '#55ffff');
      chip(ctx, cx, cy, cw, 6);
      // IRQ: a bolt from the chip up into the bus. Brief, and never under reduced motion.
      const slot = Math.floor(b.t * 3 + hash(i * 9 + k) * 5);
      if (!b.reduced && hash(slot * 31 + i * 7 + k) > 0.9) {
        let lx = cx + cw / 2;
        let ly = cy;
        const top = y - 8 - hash(slot + k) * 16;
        glow(ctx, lx, ly, 10, 'rgba(255,255,255,0.5)');
        while (ly > top) {
          const nx = lx + (hash(slot * 7 + ly) - 0.5) * 8;
          const ny = ly - 3 - hash(slot * 5 + ly) * 3;
          line(ctx, lx, ly, nx, ny, '#ffffff');
          lx = nx;
          ly = ny;
        }
      }
    }
  });

  // Cable looms sweeping across the foreground.
  prows(b, 1.3, 60, (y, i) => {
    const left = i % 2 === 0;
    const x0 = left ? -2 : b.w + 2;
    const x1 = left ? 50 + hash(i) * 40 : b.w - 50 - hash(i) * 40;
    for (let k = 0; k < 4; k++) thread(ctx, x0, y + k * 2, x1, y + 50 + k * 2, 8, k === 1 ? '#ff55ff' : k === 2 ? '#ffffff' : '#55ffff');
  });
}

// ---------------------------------------------------------------------------------------------
// Firmware (green phosphor, 4 levels: use greys 00/55/AA/FF): a cold boot vault. Riveted plates,
// deposit drawers of flash, the round ROM doors, and POST beeps pulsing out as rings of light.

const PLATES = () =>
  offscreen('vault-plates', 48, 30, (c) => {
    c.fillStyle = '#000000';
    c.fillRect(0, 0, 48, 30);
    c.fillStyle = '#555555';
    c.fillRect(0, 0, 48, 1);
    c.fillRect(0, 0, 1, 30);
    c.fillStyle = '#aaaaaa';
    for (const [x, y] of [[3, 3], [44, 3], [3, 26], [44, 26], [24, 3], [24, 26]] as const) c.fillRect(x, y, 1, 1);
    c.fillStyle = '#555555';
    for (let k = 0; k < 6; k++) c.fillRect(Math.floor(hash(k + 70) * 46) + 1, Math.floor(hash(k + 90) * 28) + 1, 1, 1);
  });

export const DRAWERS = ['SPI', 'UEFI', 'ucode', 'ACPI', 'NVRAM', 'PEI', 'DXE', 'SEC'];

function firmware(ctx: CanvasRenderingContext2D, b: Band) {
  const [y0, y1] = vis(b);
  tiled(ctx, PLATES(), 0, y0, b.w, y1 - y0, 0, R(b.top * 0.6));

  // Deposit drawers in the walls on both sides.
  const cols = Math.max(2, Math.floor((b.w * 0.24) / 13));
  prows(b, 1, 9, (y, i) => {
    for (let side = 0; side < 2; side++) {
      const wx = side ? b.w - 4 - cols * 13 : 4;
      px(ctx, wx - 2, y, cols * 13 + 3, 9, '#000000');
      for (let c = 0; c < cols; c++) {
        const x = wx + c * 13;
        px(ctx, x, y, 12, 8, '#555555');
        px(ctx, x + 1, y + 1, 10, 6, '#000000');
        px(ctx, x + 5, y + 4, 2, 1, '#aaaaaa');
        if (hash(i * 37 + c * 5 + side) > 0.95) px(ctx, x + 2, y + 2, 1, 1, '#ffffff');
      }
      if (hash(i * 13 + side) > 0.85) {
        const c = Math.floor(hash(i * 13 + side + 1) * cols);
        const x = wx + c * 13;
        px(ctx, x + 1, y + 1, 10, 6, '#aaaaaa');
        ctx.save();
        ctx.beginPath();
        ctx.rect(x + 1, y + 1, 10, 6);
        ctx.clip();
        text(ctx, DRAWERS[Math.floor(hash(i * 13 + 4) * DRAWERS.length)]!, x + 1, y + 7, '#000000');
        ctx.restore();
      }
    }
  });

  // Vault doors down the centre; each one's speaker sends POST beeps out as rings of light.
  prows(b, 1, 90, (y, i) => {
    const cx = R(b.w / 2 + (i % 2 ? 1 : -1) * Math.min(50, b.w * 0.14));
    const cy = y + 45;
    const r = Math.min(24, R(b.w * 0.06) + 8);
    const period = 2.6;
    const phase = (b.t + hash(i) * period) % period;
    const rings = b.reduced ? [0.45] : [phase / period, ((phase + 0.4) % period) / period];
    for (const p of rings) {
      ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - p)})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 5 + p * 70, 0, TAU);
      ctx.stroke();
    }
    ctx.lineWidth = 1;
    const disc = (rr: number, c: string, dx = 0) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(cx + dx, cy + dx, rr, 0, TAU);
      ctx.fill();
    };
    disc(r + 4, '#000000', 2);
    disc(r + 4, '#aaaaaa');
    disc(r + 2, '#555555');
    disc(r - 3, '#000000');
    disc(r - 4, '#555555');
    for (let k = 0; k < 16; k++) {
      const a = (k * TAU) / 16;
      px(ctx, cx + Math.cos(a) * (r) - 1, cy + Math.sin(a) * (r) - 1, 2, 2, '#ffffff');
    }
    for (let k = 0; k < 3; k++) {
      const a = (k * TAU) / 6 + 0.3;
      line(ctx, cx - Math.cos(a) * (r - 6), cy - Math.sin(a) * (r - 6), cx + Math.cos(a) * (r - 6), cy + Math.sin(a) * (r - 6), '#aaaaaa');
    }
    px(ctx, cx - 2, cy - 2, 5, 5, '#ffffff');
    px(ctx, cx - 1, cy - 1, 3, 3, '#555555');
    // POST code readout beside the door.
    const dx = cx + (i % 2 ? -r - 30 : r + 8);
    px(ctx, dx, cy - 5, 22, 9, '#555555');
    px(ctx, dx + 1, cy - 4, 20, 7, '#000000');
    text(ctx, (0x10 + Math.floor(hash(i + Math.floor((b.t + hash(i) * period) / period)) * 0xe0)).toString(16).toUpperCase(), dx + 5, cy + 2, '#ffffff');
  });

  // Cold mist pooling at the bottom.
  vgrad(ctx, b, b.bottom - 50, b.bottom + SEAM_H, [
    [0, 'rgba(255,255,255,0)'],
    [1, 'rgba(255,255,255,0.22)'],
  ]);
}

// ---------------------------------------------------------------------------------------------
// Ring −1 (green phosphor): a hall of mirrors. A tunnel of nested frames recedes toward the centre, and the
// side mirrors show the same small world twice: two guests on one machine.

export function miniWorld(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number, flip: boolean) {
  px(ctx, x, y, w, h, '#000000');
  for (let k = 0; k < w; k += 3) {
    const kk = flip ? w - 3 - k : k;
    const th = R(h * (0.2 + hash(seed + Math.floor(kk / 3)) * 0.5));
    px(ctx, x + k, y + h - th, 2, th, '#555555');
    if (th > 5 && hash(seed + kk + 1) > 0.4) px(ctx, x + k, y + h - th + 2, 1, 1, '#ffffff');
  }
  const ww = R(w * 0.4);
  const wx = flip ? x + w - 3 - ww : x + 3;
  px(ctx, wx, y + 3, ww, 6, '#aaaaaa');
  px(ctx, wx, y + 3, ww, 1, '#ffffff');
  px(ctx, wx + 1, y + 5, R(ww * 0.6), 1, '#555555');
}

function ringMinus1(ctx: CanvasRenderingContext2D, b: Band) {
  const [y0, y1] = vis(b);
  px(ctx, 0, y0, b.w, y1 - y0, '#000000');
  const cxs = b.w / 2;
  const anchor = b.h * 0.37;
  // The tunnel: frames nested toward a vanishing point; each deeper frame scrolls slower.
  prows(b, 1, 84, (y, i) => {
    const cy = y + 42;
    const fw = Math.min(b.w * 0.44, 150);
    const shades = ['#ffffff', '#aaaaaa', '#aaaaaa', '#555555', '#555555', '#555555', '#555555'];
    for (let k = 6; k >= 0; k--) {
      const s = Math.pow(0.76, k);
      const w = R(fw * s);
      const h = R(62 * s);
      const fy = R(anchor + (cy - anchor) * s);
      const x = R(cxs - w / 2);
      px(ctx, x - 1, fy - R(h / 2) - 1, w + 2, h + 2, shades[k]!);
      px(ctx, x, fy - R(h / 2), w, h, '#000000');
      if (k === 6) miniWorld(ctx, x + 1, fy - R(h / 2) + 1, w - 2, h - 2, i * 7, false);
    }
    // A glint sweeping across the glass.
    const g = ((b.t * 0.3 + hash(i)) % 1.6) - 0.3;
    const gx = R(cxs - fw / 2 + g * fw);
    for (let k = 0; k < 9; k++) px(ctx, gx + k, cy - 31 + k * 7, 1, 7, 'rgba(255,255,255,0.35)');
  });

  // Side mirrors: the same world twice, the right one reflected.
  const mw = Math.max(24, R(b.w * 0.15));
  prows(b, 0.85, 36, (y, i) => {
    for (let side = 0; side < 2; side++) {
      const x = side ? b.w - mw - 10 : 10;
      px(ctx, x - 2, y - 2, mw + 4, 29, '#555555');
      px(ctx, x - 2, y - 2, mw + 4, 1, '#ffffff');
      px(ctx, x - 2, y - 2, 1, 29, '#aaaaaa');
      miniWorld(ctx, x, y, mw, 25, i * 13, side === 1);
      if (hash(i * 3 + side) > 0.55) text(ctx, `vm${side}`, x, y + 33, '#555555');
    }
  });

  // Pillars at the edges, scrolling fastest.
  prows(b, 1.3, 64, (y, i) => {
    for (const x of [0, b.w - 5]) {
      px(ctx, x, y, 5, 64, '#000000');
      px(ctx, x + (x ? 0 : 4), y, 1, 64, '#aaaaaa');
      px(ctx, x, y + 2 + R(hash(i) * 50), 5, 2, '#555555');
    }
  });
}

// ---------------------------------------------------------------------------------------------
// Ring −2 (5 greys: 00/40/80/C0/FF): System Management Mode. Time has stopped. Debris from every layer
// above hangs mid-fall, trailing the streaks of a motion it no longer has. Everything runs on b.t,
// so with the freeze look on, it holds perfectly still.

export const DEBRIS_PAL = { k: '#000000', w: '#ffffff', g: '#c0c0c0', d: '#808080', s: '#404040' };
export const DEBRIS = () => [
  pix('d-window', ['kkkkkkkkk', 'kdddddddk', 'kwwwwwwwk', 'kwssswwwk', 'kwwwwwwwk', 'kwssswwwk', 'kkkkkkkkk'], DEBRIS_PAL),
  pix('d-book', ['kkkkk', 'kdgwk', 'kdgwk', 'kdwwk', 'kdgwk', 'kdgwk', 'kkkkk'], DEBRIS_PAL),
  pix('d-gear', [' k k k ', 'kgggggk', ' gdddg ', 'kgdkdgk', ' gdddg ', 'kgggggk', ' k k k '], DEBRIS_PAL),
  pix('d-zero', [' kkk ', 'kwwwk', 'kwkwk', 'kwkwk', 'kwkwk', 'kwwwk', ' kkk '], DEBRIS_PAL),
  pix('d-one', [' kk  ', 'kwwk ', ' kwk ', ' kwk ', ' kwk ', 'kwwwk', 'kkkkk'], DEBRIS_PAL),
  pix('d-shard', ['k     ', 'wk    ', 'wgk   ', 'wggk  ', 'wgggk ', 'kkkkkk'], DEBRIS_PAL),
  pix('d-chip', ['k k k', 'kkkkk', 'kdddk', 'kdwdk', 'kkkkk', 'k k k'], DEBRIS_PAL),
  pix('d-drop', ['w', 'g'], DEBRIS_PAL),
];

function ringMinus2(ctx: CanvasRenderingContext2D, b: Band) {
  const [y0, y1] = vis(b);
  px(ctx, 0, y0, b.w, y1 - y0, '#000000');
  // Shafts of light from the world above, held still.
  prows(b, 0.35, 110, (y, i) => {
    const x = hash(i) * b.w;
    const w = 14 + hash(i + 1) * 30;
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.beginPath();
    ctx.moveTo(R(x), y);
    ctx.lineTo(R(x + w), y);
    ctx.lineTo(R(x + w * 1.6), y + 160);
    ctx.lineTo(R(x + w * 0.6), y + 160);
    ctx.fill();
  });
  // Stopped clocks on the far wall; the second hand only ticks if time runs.
  prows(b, 0.5, 140, (y, i) => {
    const cx = R(i % 2 ? b.w * 0.27 : b.w * 0.73);
    const cy = y + 70;
    const r = 15;
    const disc = (rr: number, c: string) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, TAU);
      ctx.fill();
    };
    disc(r + 2, '#808080');
    disc(r, '#404040');
    for (let k = 0; k < 12; k++) px(ctx, cx + Math.cos((k * TAU) / 12) * (r - 3), cy + Math.sin((k * TAU) / 12) * (r - 3), 1, 1, k % 3 ? '#808080' : '#ffffff');
    line(ctx, cx, cy, cx + Math.cos(-1.2 + i) * 7, cy + Math.sin(-1.2 + i) * 7, '#c0c0c0');
    line(ctx, cx, cy, cx + Math.cos(0.8 + i * 2) * 11, cy + Math.sin(0.8 + i * 2) * 11, '#c0c0c0');
    const sa = ((Math.floor(b.t) + i * 17) * TAU) / 60 - Math.PI / 2;
    line(ctx, cx, cy, cx + Math.cos(sa) * 13, cy + Math.sin(sa) * 13, '#ffffff');
    if (hash(i * 3) > 0.4) text(ctx, `SMI#${i}`, cx - 10, cy + r + 10, '#404040');
  });
  const kinds = DEBRIS();
  // Big wreckage far back: whole pieces of the layers above, caught mid-fall, greyed by distance.
  prows(b, 0.6, 46, (y, i) => {
    if (hash(i * 71) < 0.3) return;
    const img = kinds[Math.floor(hash(i * 71 + 1) * (kinds.length - 1))]!;
    const sc = 3 + Math.floor(hash(i * 71 + 2) * 2);
    const x = R(hash(i * 71 + 3) * (b.w - img.width * sc));
    const yy = R(y + hash(i * 71 + 4) * 20 + ((b.t * 3) % 46));
    for (let k = 0; k < 30; k += 2) px(ctx, x + R((img.width * sc) / 2), yy - 30 + k, 1, 1, '#404040');
    ctx.globalAlpha = 0.45;
    ctx.drawImage(img, x, yy, img.width * sc, img.height * sc);
    ctx.globalAlpha = 1;
  });
  // Debris in three planes, each piece under the frozen streak of its fall.
  for (const [f, step, near] of [
    [0.45, 8, 0],
    [0.75, 11, 1],
    [1, 15, 2],
  ] as const) {
    prows(b, f, step, (y, i) => {
      const s = i * 53 + near * 1000;
      if (hash(s) < (near === 2 ? 0.25 : 0.15)) return;
      const img = kinds[Math.floor(hash(s + 1) * kinds.length)]!;
      // If time runs (freeze off), debris keeps falling slowly; frozen, it hangs.
      const drop = (b.t * 6 * f) % step;
      const x = R(hash(s + 2) * (b.w - 8));
      const yy = R(y + hash(s + 3) * step + drop);
      const trail = R(5 + hash(s + 4) * 14 * f);
      const tc = near === 2 ? '#808080' : '#404040';
      for (let k = 0; k < trail; k += near === 2 ? 1 : 2) px(ctx, x + Math.floor(img.width / 2), yy - trail + k, 1, 1, k > trail * 0.5 ? tc : '#404040');
      if (near === 0) {
        px(ctx, x, yy, 2, 2, '#404040');
        return;
      }
      if (near === 1) {
        px(ctx, x, yy, 3, 3, '#808080');
        px(ctx, x, yy, 3, 1, '#c0c0c0');
        return;
      }
      blit(ctx, img, x, yy);
    });
  }
  // One slab inscription, sparse.
  prows(b, 1, 200, (y) => text(ctx, 'all interrupts masked', R(b.w / 2 - 50), y + 140, '#404040'));
}

// ---------------------------------------------------------------------------------------------
// Ring −3 (1-bit): the silicon die up close. Standard-cell rows, routed metal on two planes, via arrays,
// and the tiny always-on core with its heartbeat.

const CELLS = () =>
  offscreen('die-cells', 24, 12, (c) => {
    c.fillStyle = '#000000';
    c.fillRect(0, 0, 24, 12);
    c.fillStyle = '#ffffff';
    for (let x = 0; x < 24; x += 2) c.fillRect(x, 0, 1, 1);
    for (let x = 0; x < 24; x++) if (hash(x + 1000) > 0.7) c.fillRect(x, 3 + (x % 2) * 2, 1, 1);
    for (let x = 1; x < 24; x += 2) c.fillRect(x, 6, 1, 1);
    for (let x = 0; x < 24; x++) if (hash(x + 2000) > 0.75) c.fillRect(x, 9, 1, 1);
  });

function ringMinus3(ctx: CanvasRenderingContext2D, b: Band) {
  const [y0, y1] = vis(b);
  tiled(ctx, CELLS(), 0, y0, b.w, y1 - y0, 0, R(b.top * 0.5));
  // Lower metal: dotted Manhattan traces with vias.
  prows(b, 0.75, 12, (y, i) => {
    let x = R(hash(i) * 20) - 10;
    let yy = y + 4;
    while (x < b.w) {
      const run = 6 + R(hash(i * 97 + x) * 30);
      px(ctx, x - 1, yy - 1, run + 2, 3, '#000000');
      for (let k = 0; k < run; k++) if ((x + k) % 2 === 0) px(ctx, x + k, yy, 1, 1, '#ffffff');
      x += run;
      if (hash(i * 97 + x + 1) > 0.5) {
        const d = hash(i * 97 + x + 2) > 0.5 ? 6 : -6;
        px(ctx, x - 1, Math.min(yy, yy + d) - 1, 3, 8, '#000000');
        for (let k = 0; k <= 6; k += 2) px(ctx, x, Math.min(yy, yy + d) + k, 1, 1, '#ffffff');
        yy += d;
        px(ctx, x - 1, yy - 1, 3, 3, '#ffffff');
        px(ctx, x, yy, 1, 1, '#000000');
      }
      x += 3 + R(hash(i * 97 + x + 3) * 8);
    }
  });
  // Upper metal: wide power rails with via arrays, scrolling fastest.
  prows(b, 1.2, 46, (y, i) => {
    px(ctx, 0, y - 1, b.w, 7, '#000000');
    px(ctx, 0, y, b.w, 1, '#ffffff');
    px(ctx, 0, y + 4, b.w, 1, '#ffffff');
    for (let x = R(hash(i) * 6); x < b.w; x += 6) px(ctx, x, y + 2, 1, 1, '#ffffff');
    if (hash(i * 5) > 0.4) {
      const sx = R(hash(i * 5 + 1) * b.w);
      px(ctx, sx - 1, y + 5, 5, 41, '#000000');
      px(ctx, sx, y + 5, 1, 41, '#ffffff');
      px(ctx, sx + 2, y + 5, 1, 41, '#ffffff');
    }
  });

  // The seal ring and bond pads at the die edge, just under the ME boundary.
  const ey = R(b.top + 4);
  px(ctx, 0, ey, b.w, 26, '#000000');
  px(ctx, 0, ey, b.w, 1, '#ffffff');
  px(ctx, 0, ey + 2, b.w, 1, '#ffffff');
  for (let x = 6; x < b.w; x += 14) {
    px(ctx, x, ey + 6, 8, 8, '#ffffff');
    px(ctx, x + 2, ey + 8, 4, 4, '#000000');
    px(ctx, x + 3, ey + 14, 2, 10, '#ffffff');
  }

  // The always-on core: small, bright, alive while everything else is still.
  const cx = R(b.w / 2);
  const cy = R(b.top + 64);
  const beat = b.reduced ? 0.4 : Math.max(0, Math.sin(b.t * 3.2)) ** 6;
  // Traces leaving the core to the rest of the die.
  for (const off of [-4, 0, 4]) {
    px(ctx, cx + 20, cy + off - 1, b.w, 3, '#000000');
    px(ctx, 0, cy + off - 1, cx - 20, 3, '#000000');
    px(ctx, cx + off - 1, cy + 20, 3, b.h, '#000000');
    px(ctx, cx + 20, cy + off, b.w, 1, '#ffffff');
    px(ctx, 0, cy + off, cx - 20, 1, '#ffffff');
    px(ctx, cx + off, cy + 20, 1, b.h, '#ffffff');
  }
  px(ctx, cx - 20, cy - 20, 41, 41, '#000000');
  glow(ctx, cx, cy, 22 + beat * 10, `rgba(255,255,255,${0.35 + beat * 0.4})`);
  for (let k = -15; k <= 15; k += 3) {
    px(ctx, cx + k, cy - 16, 2, 2, '#ffffff');
    px(ctx, cx + k, cy + 15, 2, 2, '#ffffff');
    px(ctx, cx - 16, cy + k, 2, 2, '#ffffff');
    px(ctx, cx + 15, cy + k, 2, 2, '#ffffff');
  }
  px(ctx, cx - 11, cy - 11, 23, 23, '#000000');
  px(ctx, cx - 10, cy - 10, 21, 21, '#ffffff');
  px(ctx, cx - 9, cy - 9, 19, 19, '#000000');
  for (let k = 0; k < 4; k++) for (let j = 0; j < 4; j++) if (hash(k * 4 + j + 77) > 0.35) px(ctx, cx - 7 + k * 4, cy - 7 + j * 4, 3, 3, '#ffffff');
  px(ctx, cx - 2, cy - 2, 5, 5, beat > 0.3 ? '#ffffff' : '#000000');
  px(ctx, cx - 1, cy - 1, 3, 3, '#ffffff');
}

export const LAYER_ART_DETAILED: Record<LayerId, Art> = expandLayerMap({
  application,
  runtime,
  libraries,
  userspace,
  kernel,
  drivers,
  firmware,
  'ring-1': ringMinus1,
  'ring-2': ringMinus2,
  'ring-3': ringMinus3,
});

// ---------------------------------------------------------------------------------------------
// Structures at the hard boundaries, keyed by the layer below. Drawn over the frayed seam.

type Seam = (ctx: CanvasRenderingContext2D, y: number, below: Band) => void;

export const HAZARD = () =>
  offscreen('hazard', 8, 4, (c) => {
    for (let y = 0; y < 4; y++)
      for (let x = 0; x < 8; x++) {
        c.fillStyle = ((x + y) >> 2) % 2 ? '#000000' : '#ffff55';
        c.fillRect(x, y, 1, 1);
      }
  });

export const SEAM_ART: Partial<Record<LayerId, Seam>> = {
  // syscall: a bulkhead with a single gate in the middle, the only way down.
  kernel(ctx, y, b) {
    px(ctx, 0, y - 3, b.w, 9, '#555555');
    px(ctx, 0, y - 3, b.w, 1, '#aaaaaa');
    px(ctx, 0, y + 5, b.w, 1, '#000000');
    tiled(ctx, HAZARD(), 0, y - 1, b.w, 4, 0, y - 1);
    for (let x = 4; x < b.w; x += 12) px(ctx, x, y + 3, 1, 1, '#aaaaaa');
    const gx = R(b.w / 2) - 9;
    px(ctx, gx, y - 4, 18, 11, '#000000');
    px(ctx, gx + 1, y - 3, 16, 1, '#aaaaaa');
    px(ctx, gx + 2, y + 4, 14, 1, '#ffff55');
  },
  // VM exit: a silvered plane.
  'ring-1'(ctx, y, b) {
    px(ctx, 0, y - 1, b.w, 1, '#aaaaaa');
    px(ctx, 0, y, b.w, 1, '#ffffff');
    px(ctx, 0, y + 1, b.w, 1, '#555555');
    for (let x = 0; x < b.w; x += 23) px(ctx, x, y + 3, 6, 1, '#555555');
  },
  // SMI: a crack of lightning, frozen as it struck.
  'ring-2'(ctx, y, b) {
    let x = 0;
    let yy = y;
    while (x < b.w) {
      const nx = x + 4 + R(hash(x + 31) * 6);
      const ny = y + R((hash(x + 77) - 0.5) * 6);
      line(ctx, x, yy, nx, ny, '#ffffff');
      if (hash(x + 99) > 0.8) line(ctx, nx, ny, nx + 3, ny + 5 + R(hash(x) * 5), '#c0c0c0');
      x = nx;
      yy = ny;
    }
  },
  // ME: the die's edge, crossing into silicon.
  'ring-3'(ctx, y, b) {
    px(ctx, 0, y - 2, b.w, 1, '#ffffff');
    px(ctx, 0, y, b.w, 2, '#ffffff');
  },
};
