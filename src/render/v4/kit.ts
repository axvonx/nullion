import { enforce } from '../../core/enforce';
import { FONT, hash } from '../art';
import { snapColor, type PaletteMode } from '../palettes';

/**
 * The v4 entity kit: a palette-snapped pen, the entity definition type, and the sprite bake cache.
 *
 * - Every solid colour goes through c(), which snaps it onto the band's palette levels (and, on the far plane,
 *   pushes it into the band's fog first). Solid fills therefore never dither; only light (glows) does.
 * - An entity's static body is baked once per (type, variant, look, palette, fog) into a small canvas and blitted.
 *   Only its `anim` overlay is drawn live each frame, on art time, so Ring −2's freeze and reduced motion hold it.
 * - Nothing here touches the DOM at import time, so placement can be unit-tested in node.
 */

export type Ctx = CanvasRenderingContext2D;
export type RGB = readonly [number, number, number];
export type Size = readonly [number, number];

const R = Math.round;
export const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------------------------
// Palette state for the band being drawn.

let mode: PaletteMode = 'full';
let fog: RGB | undefined;
const colourCache = new Map<string, string>();

/** Start painting a band (or its far plane): palette levels to snap to, and fog to blend toward (far plane only). */
export function setPaint(m: PaletteMode, fogTo: RGB | undefined) {
  mode = m;
  fog = fogTo;
}

export function paintKey(): string {
  return `${mode}${fog ? `~${fog.join('.')}` : ''}`;
}

function blend(hex: string, to: RGB, k: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number, i: number) => R(v + (to[i]! - v) * k);
  return `#${((ch(n >> 16, 0) << 16) | (ch((n >> 8) & 255, 1) << 8) | ch(n & 255, 2)).toString(16).padStart(6, '0')}`;
}

/** A solid colour snapped onto the current palette (after fog, on the far plane). */
export function c(hex: string): string {
  const key = `${paintKey()}|${hex}`;
  let v = colourCache.get(key);
  if (v === undefined) {
    enforce(/^#[0-9a-f]{6}$/i.test(hex), `v4 colour must be #rrggbb, got ${hex}`);
    v = snapColor(fog ? blend(hex, fog, 0.55) : hex, mode);
    colourCache.set(key, v);
  }
  return v;
}

// ---------------------------------------------------------------------------------------------
// The pen: local coordinates inside an entity's box, optionally mirrored, every colour snapped.

export class Pen {
  ctx!: Ctx;
  private ox = 0;
  private oy = 0;
  private bw = 0;
  private flip = false;
  private seed = 0;

  at(ctx: Ctx, ox: number, oy: number, bw: number, flip: boolean, seed: number): this {
    this.ctx = ctx;
    this.ox = R(ox);
    this.oy = R(oy);
    this.bw = bw;
    this.flip = flip;
    this.seed = seed;
    return this;
  }

  /** Seeded [0,1) for this entity's look: stable across frames. */
  h(k: number): number {
    return hash(this.seed * 7919 + k * 131 + 17);
  }

  /** Pick from a list by h(k). */
  pick<T>(arr: readonly T[], k: number): T {
    return arr[Math.floor(this.h(k) * arr.length)]!;
  }

  r(x: number, y: number, w: number, h: number, col: string) {
    x = R(x);
    y = R(y);
    w = R(w);
    h = R(h);
    if (w <= 0 || h <= 0) return;
    this.ctx.fillStyle = c(col);
    this.ctx.fillRect(this.flip ? this.ox + this.bw - x - w : this.ox + x, this.oy + y, w, h);
  }

  p(x: number, y: number, col: string) {
    this.r(x, y, 1, 1, col);
  }

  /** Filled box with a 1px edge. */
  box(x: number, y: number, w: number, h: number, fill: string, edge: string) {
    this.r(x, y, w, h, edge);
    this.r(x + 1, y + 1, w - 2, h - 2, fill);
  }

  /** 1px outline only. */
  frame(x: number, y: number, w: number, h: number, col: string) {
    this.r(x, y, w, 1, col);
    this.r(x, y + h - 1, w, 1, col);
    this.r(x, y, 1, h, col);
    this.r(x + w - 1, y, 1, h, col);
  }

  /** Pixel disc. */
  disc(cx: number, cy: number, rad: number, col: string) {
    for (let dy = -rad; dy <= rad; dy++) {
      const half = Math.floor(Math.sqrt(rad * rad - dy * dy) + 0.35);
      this.r(cx - half, cy + dy, half * 2 + 1, 1, col);
    }
  }

  /** Pixel circle outline. */
  ring(cx: number, cy: number, rad: number, col: string) {
    const n = Math.max(8, Math.ceil(rad * 7));
    for (let k = 0; k < n; k++) {
      const a = (k * TAU) / n;
      this.p(cx + R(Math.cos(a) * rad), cy + R(Math.sin(a) * rad), col);
    }
  }

  /** Pixel-exact line (Bresenham), so thin wires stay crisp after quantization. */
  l(x0: number, y0: number, x1: number, y1: number, col: string) {
    x0 = R(x0);
    y0 = R(y0);
    x1 = R(x1);
    y1 = R(y1);
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (let n = 0; n < 512; n++) {
      this.p(x0, y0, col);
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

  /** Text at baseline y. Text entities are never mirrored. */
  t(s: string, x: number, y: number, col: string) {
    enforce(!this.flip, 'v4: text in a mirrored entity');
    this.ctx.font = FONT;
    this.ctx.fillStyle = c(col);
    this.ctx.fillText(s, this.ox + R(x), this.oy + R(y));
  }

  /** Light: a radial glow. Not snapped (it is a gradient, so it dithers, which is the point). */
  glow(x: number, y: number, rad: number, rgba: string) {
    const gx = this.flip ? this.ox + this.bw - x : this.ox + x;
    const gy = this.oy + y;
    const g = this.ctx.createRadialGradient(gx, gy, 0, gx, gy, rad);
    g.addColorStop(0, rgba);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    this.ctx.fillStyle = g;
    this.ctx.fillRect(R(gx - rad), R(gy - rad), R(rad * 2), R(rad * 2));
  }
}

// ---------------------------------------------------------------------------------------------
// Entity definitions.

export interface EntityDef {
  id: string;
  /** One size per variant; the variant index is passed to draw and anim. */
  sizes: readonly Size[];
  /** The static body, drawn in local coordinates inside w × h, baked once. p.h(k) varies by look. */
  draw(p: Pen, w: number, h: number, v: number): void;
  /** Live overlay drawn every frame on art time t (0 under reduced motion; frozen in Ring −2). */
  anim?(p: Pen, w: number, h: number, v: number, t: number): void;
  /** Carries text: never mirrored, never on the far plane, and placed sparingly. */
  text?: boolean;
  /** Never mirrored (directional or symmetric-by-design). */
  noFlip?: boolean;
  /** Most copies allowed within one screen's height of each other (default 2). */
  cap?: number;
  /** Relative pick weight (default 1). */
  weight?: number;
}

export const LOOKS = 3;

export function ent(id: string, sizes: readonly Size[], draw: EntityDef['draw'], opts: Omit<EntityDef, 'id' | 'sizes' | 'draw'> = {}): EntityDef {
  return { id, sizes, draw, ...opts };
}

// ---------------------------------------------------------------------------------------------
// Bake cache.

const bakeCache = new Map<string, HTMLCanvasElement>();
const pen = new Pen();

/** The entity's static body for the current paint, baked on first use. */
export function baked(def: EntityDef, v: number, look: number): HTMLCanvasElement {
  const key = `${def.id}|${v}|${look}|${paintKey()}`;
  const hit = bakeCache.get(key);
  if (hit) return hit;
  const [w, h] = def.sizes[v]!;
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const cx = cv.getContext('2d');
  enforce(cx, `v4 bake: no 2D context for ${def.id}`);
  cx.imageSmoothingEnabled = false;
  def.draw(pen.at(cx, 0, 0, w, false, look), w, h, v);
  bakeCache.set(key, cv);
  return cv;
}

export function bakeCount(): number {
  return bakeCache.size;
}

/** Draw a placed entity's body and overlay at screen (x, y). */
export function drawEntity(ctx: Ctx, def: EntityDef, v: number, look: number, x: number, y: number, flip: boolean, t: number) {
  const img = baked(def, v, look);
  x = R(x);
  y = R(y);
  if (flip) {
    ctx.save();
    ctx.translate(x + img.width, y);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
  } else ctx.drawImage(img, x, y);
  if (def.anim) {
    const [w, h] = def.sizes[v]!;
    def.anim(pen.at(ctx, x, y, w, flip, look), w, h, v, t);
  }
}

/** Fail loudly on a malformed library: every layer must actually have its entities. */
export function checkLibrary(name: string, defs: readonly EntityDef[], minTypes: number) {
  enforce(defs.length >= minTypes, `v4: ${name} has ${defs.length} entity types, needs at least ${minTypes}`);
  const ids = new Set<string>();
  for (const d of defs) {
    enforce(!ids.has(d.id), `v4: duplicate entity id ${d.id} in ${name}`);
    ids.add(d.id);
    enforce(d.sizes.length > 0, `v4: ${d.id} has no sizes`);
    for (const [w, h] of d.sizes) enforce(Number.isInteger(w) && Number.isInteger(h) && w > 0 && h > 0 && w <= 96 && h <= 96, `v4: ${d.id} has a bad size ${w}×${h}`);
  }
}
