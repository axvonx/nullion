import { offscreen } from '../../render/art-common';
import { c } from '../../render/v4/kit';

/**
 * Pixel primitives shared by the layers' setpieces and backgrounds. Every colour goes through `c()`, which snaps it
 * onto the band's palette.
 */

type Ctx = CanvasRenderingContext2D;
export const R = Math.round;
export const TAU = Math.PI * 2;
export const mod = (n: number, m: number) => ((n % m) + m) % m;

export function rect(ctx: Ctx, x: number, y: number, w: number, h: number, col: string) {
  w = R(w);
  h = R(h);
  if (w <= 0 || h <= 0) return;
  ctx.fillStyle = c(col);
  ctx.fillRect(R(x), R(y), w, h);
}

export function px(ctx: Ctx, x: number, y: number, col: string) {
  ctx.fillStyle = c(col);
  ctx.fillRect(R(x), R(y), 1, 1);
}

export function line(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, col: string) {
  x0 = R(x0);
  y0 = R(y0);
  x1 = R(x1);
  y1 = R(y1);
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  ctx.fillStyle = c(col);
  for (let n = 0; n < 720; n++) {
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

export function disc(ctx: Ctx, cx: number, cy: number, rad: number, col: string) {
  ctx.fillStyle = c(col);
  for (let dy = -rad; dy <= rad; dy++) {
    const half = Math.floor(Math.sqrt(rad * rad - dy * dy) + 0.35);
    ctx.fillRect(R(cx - half), R(cy + dy), half * 2 + 1, 1);
  }
}

export function ring(ctx: Ctx, cx: number, cy: number, rad: number, col: string) {
  ctx.fillStyle = c(col);
  const n = Math.max(16, Math.ceil(rad * 6.5));
  for (let k = 0; k < n; k++) {
    const a = (k * TAU) / n;
    ctx.fillRect(R(cx + Math.cos(a) * rad), R(cy + Math.sin(a) * rad), 1, 1);
  }
}

export function frame(ctx: Ctx, x: number, y: number, w: number, h: number, col: string) {
  rect(ctx, x, y, w, 1, col);
  rect(ctx, x, y + h - 1, w, 1, col);
  rect(ctx, x, y, 1, h, col);
  rect(ctx, x + w - 1, y, 1, h, col);
}

/** Monumental rotating pixel cogwheel with radially-aligned tapered teeth, hub, spokes, rivets, and rim highlight. */
export function giantCog(
  ctx: Ctx,
  cx: number,
  cy: number,
  rad: number,
  ang: number,
  body: string,
  hole: string,
  rim: string,
  teeth = Math.max(12, R(rad * 0.42)),
) {
  const toothH = 6;
  const outerR = rad + toothH;
  const innerR = rad - 1;
  const outerR2 = outerR * outerR;
  const innerR2 = innerR * innerR;
  const pitch = TAU / teeth;
  const bodyCol = c(body);
  const rimCol = c(rim);
  const cxR = R(cx);
  const cyR = R(cy);

  // Rasterize radially-aligned, tapered gear teeth seamlessly fused to the rim
  for (let dy = -outerR; dy <= outerR; dy++) {
    const dy2 = dy * dy;
    const maxDx = Math.floor(Math.sqrt(outerR2 - dy2));
    for (let dx = -maxDx; dx <= maxDx; dx++) {
      const r2 = dx * dx + dy2;
      if (r2 < innerR2 || r2 > outerR2) continue;
      const r = Math.sqrt(r2);
      const frac = Math.max(0, (r - rad) / toothH);
      const halfW = 0.27 - frac * 0.09; // trapezoidal taper: wider at root, narrower at tip
      const u = mod((Math.atan2(dy, dx) - ang) / pitch, 1);
      const dist = Math.abs(u - 0.5);
      if (dist <= halfW) {
        const isEdge = r >= outerR - 1.1 || dist >= halfW - 0.045;
        ctx.fillStyle = isEdge ? rimCol : bodyCol;
        ctx.fillRect(cxR + dx, cyR + dy, 1, 1);
      }
    }
  }

  disc(ctx, cx, cy, rad, body);
  ring(ctx, cx, cy, rad - 2, rim);
  ring(ctx, cx, cy, Math.max(8, R(rad * 0.66)), hole);
  disc(ctx, cx, cy, Math.max(6, R(rad * 0.54)), hole);
  for (let k = 0; k < 6; k++) {
    const a = ang + (k * TAU) / 6;
    line(ctx, cx, cy, cx + Math.cos(a) * rad * 0.72, cy + Math.sin(a) * rad * 0.72, body);
    rect(ctx, cx + Math.cos(a) * rad * 0.76 - 1, cy + Math.sin(a) * rad * 0.76 - 1, 2, 2, rim);
  }
  disc(ctx, cx, cy, 9, rim);
  disc(ctx, cx, cy, 4, hole);
}

/** A background fill (`rect` above skips empty sizes; this one forwards them as drawn). */
export function fill(ctx: Ctx, x: number, y: number, w: number, h: number, col: string) {
  ctx.fillStyle = c(col);
  ctx.fillRect(R(x), R(y), R(w), R(h));
}

/** The kernel's brick wall, tiled (Kernel, Kernel Entry, Arch). */
export const KWALL = () =>
  offscreen('v4-kernel-wall', 30, 20, (cx) => {
    cx.fillStyle = '#000000';
    cx.fillRect(0, 0, 30, 20);
    cx.fillStyle = '#555555';
    cx.fillRect(0, 19, 30, 1);
    cx.fillRect(29, 0, 1, 20);
  });

/** The vault plate, tiled (Firmware, SMRAM). */
export const PLATE = () =>
  offscreen('v4-vault-plate', 40, 26, (cx) => {
    cx.fillStyle = '#000000';
    cx.fillRect(0, 0, 40, 26);
    cx.fillStyle = '#555555';
    cx.fillRect(0, 0, 40, 1);
    cx.fillRect(0, 0, 1, 26);
  });
