import { enforce } from '../core/enforce';
import type { Collectibles } from './collectibles';

/** Deterministic hash → [0,1). Layer art is seeded by world row so it never shimmers between frames. */
export function hash(n: number): number {
  let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

export const FONT = '8px Silkscreen';

export interface Band {
  /** Screen-space top and bottom of this layer's band (may extend off screen). */
  top: number;
  bottom: number;
  /** World-space top, for seeding. */
  worldTop: number;
  /** Camera world y, for parallax. */
  camY: number;
  w: number;
  h: number;
  /** Seconds; frozen in Ring −2 when that look is on. */
  t: number;
  /** Reduced motion: no flicker, flashes or fast movement. */
  reduced: boolean;
  /** Rows above this screen y will not be shown (a seam redraw), so art may skip them. */
  from?: number;
  /** Optional far-plane vertical offset (used during WOMM's rigid forced scroll to bind z-layers together). */
  farShift?: number;
  /** Where props and critters report what they drew (the live scene only; portraits and seam redraws omit it). */
  collectibles?: Collectibles;
}

export type Art = (ctx: CanvasRenderingContext2D, b: Band) => void;

/** Rows the upper layer frays down into the lower one. */
export const SEAM_H = 14;

const R = Math.round;

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
/** Fill a rect with a cached tile, scrolled by (ox, oy) so it moves with its parallax plane. */
export function tiled(ctx: CanvasRenderingContext2D, img: HTMLCanvasElement, x: number, y: number, w: number, h: number, ox: number, oy: number) {
  const p = ctx.createPattern(img, 'repeat');
  enforce(p, 'createPattern failed');
  p.setTransform(new DOMMatrix([1, 0, 0, 1, R(ox), R(oy)]));
  ctx.fillStyle = p;
  ctx.fillRect(R(x), R(y), R(w), R(h));
}

// Structures at the hard boundaries: each layer draws its own (`LAYER_ART[id].seam`) over the frayed seam above it.

export type Seam = (ctx: CanvasRenderingContext2D, y: number, below: Band) => void;
