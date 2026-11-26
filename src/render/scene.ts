import { LAYERS, MAX_DEPTH, layerIndexAt, type Layer, type LayerId } from '../core/layers';
import type { TierId } from '../core/tiers';
import { look, reducedMotion } from '../looks';
import { enforce } from '../core/enforce';
import { FONT, LAYER_ART, hash, type Art, type Band } from './art';
import { LAYER_ART_DETAILED, SEAM_ART, SEAM_H } from './art-detailed';
import { LAYER_PALETTE, quantizeRow } from './palettes';
import { SPRITES, drawSprite, type Sprite } from './sprites';

/** World pixels per stack frame of depth. */
const PX = 24;
const TOP_PAD = 40;
/** The cursor sits in clear air this far down the screen, above the floating console. */
const CURSOR_FRAC = 0.37;

/** Integer screen pixels per scene pixel: small, so the full-bleed scene can carry fine detail. */
export function pixelScale(viewportW: number): number {
  return viewportW < 700 ? 2 : viewportW > 1900 ? 4 : 3;
}
const KERNEL_INDEX = LAYERS.findIndex((l) => l.id === 'kernel');

function bandTop(i: number): number {
  return i === 0 ? -1000 : TOP_PAD + LAYERS[i]!.from * PX - 12;
}
function bandBottom(i: number): number {
  return i === LAYERS.length - 1 ? TOP_PAD + MAX_DEPTH * PX + 2000 : bandTop(i + 1);
}
function layerIndexAtWorldY(y: number): number {
  let idx = 0;
  for (let i = 0; i < LAYERS.length; i++) if (y >= bandTop(i)) idx = i;
  return idx;
}

type CursorForm = 'arrow' | 'ibeam' | 'block' | 'underscore' | 'biosbar' | 'bit';

const FORM_BY_LAYER: Record<LayerId, CursorForm> = {
  application: 'arrow',
  runtime: 'ibeam',
  libraries: 'ibeam',
  userspace: 'block',
  kernel: 'underscore',
  drivers: 'underscore',
  firmware: 'biosbar',
  'ring-1': 'bit',
  'ring-2': 'bit',
  'ring-3': 'bit',
};

const FORM_STYLE: Record<CursorForm, { fill: string; outline: string; alpha: number; blink: boolean }> = {
  arrow: { fill: '#ffffff', outline: '#000000', alpha: 1, blink: false },
  ibeam: { fill: '#ffffff', outline: '#ffffff', alpha: 1, blink: false },
  block: { fill: '#e8e4d8', outline: '#000000', alpha: 1, blink: true },
  underscore: { fill: '#ffffff', outline: '#000000', alpha: 1, blink: true },
  biosbar: { fill: '#aaaaaa', outline: '#aaaaaa', alpha: 0.55, blink: false },
  bit: { fill: '#ffffff', outline: '#000000', alpha: 1, blink: false },
};

interface Reaction {
  tier: TierId;
  start: number;
}

const REACTION_MS: Record<TierId, number> = {
  'off-by-one': 600,
  womm: 1400,
  npe: 500,
  leak: 1600,
  race: 1000,
  heisenbug: 1400,
  bitflip: 1200,
};

export class Scene {
  private ctx: CanvasRenderingContext2D;
  private prev: HTMLCanvasElement;
  private prevCtx: CanvasRenderingContext2D;
  private scratch: HTMLCanvasElement;
  private scratchCtx: CanvasRenderingContext2D;
  /** Upper layer redrawn here, then dither-masked, so layers bleed into each other instead of meeting at a ruler line. */
  private seam: HTMLCanvasElement;
  private seamCtx: CanvasRenderingContext2D;
  private seamMask: HTMLCanvasElement;

  /** Scene size in scene pixels; follows the viewport. */
  private W = 0;
  private H = 0;
  private cursorY = 0;

  private target = 0;
  private depth = 0;
  private lastLayer = 0;
  private reaction: Reaction | undefined;
  private tearUntil = 0;
  private tearStrength = 0;
  private artTime = 0;
  private lastNow = 0;
  private trail: { x: number; y: number }[] = [];
  private rain: { y: number; speed: number }[] = [];

  onLayerChange: ((layer: Layer) => void) | undefined;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = get2d(canvas);
    this.prev = document.createElement('canvas');
    this.prevCtx = get2d(this.prev);
    this.scratch = document.createElement('canvas');
    this.scratchCtx = get2d(this.scratch);
    this.seam = document.createElement('canvas');
    this.seamCtx = get2d(this.seam);
    this.seamMask = document.createElement('canvas');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  /** Full-bleed: internal resolution is the viewport at an integer pixel scale, so pixels stay square and crisp. */
  private resize() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    // A hidden or not-yet-laid-out frame has no area: an expected state. Draw nothing until a resize gives it some.
    if (vw <= 0 || vh <= 0) {
      this.W = 0;
      this.H = 0;
      return;
    }
    const scale = pixelScale(vw);
    this.W = Math.ceil(vw / scale);
    this.H = Math.ceil(vh / scale);
    this.cursorY = Math.round(this.H * CURSOR_FRAC);
    for (const c of [this.canvas, this.prev, this.scratch, this.seam]) {
      c.width = this.W;
      c.height = this.H;
    }
    // Exact integer scale; the overshoot (under one scene pixel) hangs off the right and bottom edges.
    this.canvas.style.width = `${this.W * scale}px`;
    this.canvas.style.height = `${this.H * scale}px`;
    this.seamMask = ditherFadeMask(this.W);
    const cols = Math.ceil(this.W / 14.5);
    this.rain = Array.from({ length: cols }, (_, i) => ({ y: hash(i) * this.H, speed: 20 + hash(i + 40) * 40 }));
  }

  get displayDepth() {
    return this.depth;
  }

  setTarget(depth: number, immediate = false) {
    this.target = Math.max(0, depth);
    if (immediate) this.depth = this.target;
  }

  react(tier: TierId) {
    this.reaction = { tier, start: performance.now() };
  }

  start() {
    const loop = (now: number) => {
      this.frame(now);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  private frame(now: number) {
    const { W, H } = this;
    if (W === 0) return;
    const dt = Math.min(0.1, this.lastNow ? (now - this.lastNow) / 1000 : 0);
    this.lastNow = now;
    const reduced = reducedMotion();
    const detailed = look('artStyle') !== 'v1';
    const art = detailed ? LAYER_ART_DETAILED : LAYER_ART;

    // Ease toward the target depth: the descent is the payoff, so it should read as travel.
    this.depth += (this.target - this.depth) * (1 - Math.exp(-dt * 2.5));
    if (Math.abs(this.target - this.depth) < 0.002) this.depth = this.target;

    const layerIdx = layerIndexAt(this.depth);
    const layer = LAYERS[layerIdx]!;
    if (layerIdx !== this.lastLayer) {
      if (!reduced && look('tearing') === 'on') {
        this.tearStrength = LAYERS[Math.max(layerIdx, this.lastLayer)]!.boundary ? 1 : 0.5;
        this.tearUntil = now + 380;
      }
      this.lastLayer = layerIdx;
      this.onLayerChange?.(layer);
    }

    const frozen = layer.id === 'ring-2' && look('freeze') === 'on';
    if (!frozen) this.artTime += dt;

    const cursorWorldY = TOP_PAD + this.depth * PX;
    const camY = Math.round(cursorWorldY - this.cursorY);
    const ctx = this.ctx;
    resetCtx(ctx);
    const band = (i: number): Band => ({
      top: bandTop(i) - camY,
      bottom: bandBottom(i) - camY,
      worldTop: bandTop(i),
      camY,
      w: W,
      h: H,
      t: this.artTime,
      reduced,
    });

    // 1. Layer bands.
    for (let i = 0; i < LAYERS.length; i++) {
      const b = band(i);
      if (b.bottom < 0 || b.top > H) continue;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, Math.max(0, b.top), W, Math.min(H, b.bottom) - Math.max(0, b.top));
      ctx.clip();
      art[LAYERS[i]!.id](ctx, b);
      ctx.restore();
    }

    // 2. Boundaries. Detailed: the upper layer frays down into the lower one, and hard boundaries get a structure.
    for (let i = 1; i < LAYERS.length; i++) {
      const y = Math.round(bandTop(i) - camY);
      if (y < -SEAM_H || y > H + 10) continue;
      const l = LAYERS[i]!;
      if (detailed) {
        this.drawSeam(art[LAYERS[i - 1]!.id], band(i - 1), y);
        SEAM_ART[l.id]?.(ctx, y, band(i));
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(W, y + 0.5);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      const label = l.boundary ? `${l.boundary} → ${l.name}` : l.name;
      ctx.font = FONT;
      const tw = Math.ceil(ctx.measureText(label).width);
      // Left edge: the right side carries the backtrace panel and the depth readout.
      const lx = 8;
      if (detailed) {
        // A small plaque bolted to the seam.
        ctx.fillStyle = '#000';
        ctx.fillRect(lx - 2, y - 7, tw + 10, 13);
        ctx.fillStyle = '#9a9a9a';
        ctx.fillRect(lx - 1, y - 6, tw + 8, 11);
        ctx.fillStyle = '#111';
        ctx.fillRect(lx, y - 5, tw + 6, 9);
      } else {
        ctx.fillStyle = '#000';
        ctx.fillRect(lx, y - 5, tw + 6, 10);
      }
      ctx.fillStyle = '#fff';
      ctx.fillText(label, lx + 3, y + 3);
    }

    // 3. Rain (kernel and below).
    const rainMode = look('rain');
    if (rainMode !== 'off' && !reduced && layerIdx >= KERNEL_INDEX) {
      ctx.font = FONT;
      ctx.fillStyle = 'rgba(85,255,85,0.4)';
      this.rain.forEach((r, i) => {
        if (!frozen) r.y = (r.y + r.speed * dt) % (H + 40);
        for (let k = 0; k < 4; k++) {
          const v = Math.floor(hash(i * 97 + k + Math.floor(r.y / 9)) * 256);
          const s = rainMode === 'hex' ? v.toString(16).padStart(2, '0') : '01<>/\\|=+*#%&'[v % 13]!;
          ctx.fillText(s, 4 + i * 14.5, r.y - k * 9 - 20);
        }
      });
    }

    // 4. Cursor.
    this.drawCursor(now, layer.id, reduced, detailed);

    // 5. Color depth: quantize each row by the layer it shows, so the next layer's palette visibly approaches.
    if (look('palette') === 'per-layer') {
      const img = ctx.getImageData(0, 0, W, H);
      const dither = look('dither') === 'bayer';
      for (let y = 0; y < H; y++) {
        const li = layerIndexAtWorldY(camY + y);
        quantizeRow(img.data, y * W * 4, W, y, LAYER_PALETTE[LAYERS[li]!.id], dither);
      }
      ctx.putImageData(img, 0, 0);
    }

    // 6. Ghosting: two VMs sharing one screen.
    if (layer.id === 'ring-1' && look('ghosting') === 'on' && !reduced) {
      ctx.globalAlpha = 0.28;
      ctx.drawImage(this.prev, 3, 1);
      ctx.globalAlpha = 1;
    }
    this.prevCtx.drawImage(this.canvas, 0, 0);

    // 7. Scanlines.
    const sl = look('scanlines');
    if (sl === 'always' || (sl === 'auto' && layerIdx >= KERNEL_INDEX)) {
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      for (let y = 1; y < H; y += 2) ctx.fillRect(0, y, W, 1);
    }

    // 8. Tearing on layer crossings.
    if (now < this.tearUntil) {
      this.scratchCtx.drawImage(this.canvas, 0, 0);
      const slices = 3 + Math.floor(this.tearStrength * 4);
      for (let k = 0; k < slices; k++) {
        const sy = Math.floor(Math.random() * H);
        const sh = 3 + Math.floor(Math.random() * 14);
        const dx = Math.round((Math.random() - 0.5) * 30 * this.tearStrength);
        ctx.drawImage(this.scratch, 0, sy, W, sh, dx, sy, W, sh);
      }
    }

    // 9. Bit Flip: the whole screen inverts for a moment.
    const r = this.reaction;
    if (r?.tier === 'bitflip' && !reduced && now - r.start < 140) {
      ctx.globalCompositeOperation = 'difference';
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  /** Redraw the upper band's art over the first SEAM_H rows of the lower band, through a ragged dither fade. */
  private drawSeam(art: Art, upper: Band, y: number) {
    const sc = this.seamCtx;
    const top = Math.max(0, y);
    const h = Math.min(this.H, y + SEAM_H) - top;
    if (h <= 0) return;
    sc.clearRect(0, top, this.W, h);
    sc.save();
    resetCtx(sc);
    sc.beginPath();
    sc.rect(0, top, this.W, h);
    sc.clip();
    art(sc, { ...upper, from: top });
    sc.globalCompositeOperation = 'destination-in';
    sc.drawImage(this.seamMask, 0, y);
    sc.restore();
    this.ctx.drawImage(this.seam, 0, top, this.W, h, 0, top, this.W, h);
  }

  private drawCursor(now: number, layerId: LayerId, reduced: boolean, detailed: boolean) {
    const override = look('cursor');
    const form: CursorForm = override === 'evolving' ? FORM_BY_LAYER[layerId] : override;
    const style = FORM_STYLE[form];
    // The bit is a 0/1 glyph that can't hold its value. It flickers on art time, so Ring −2's frozen time holds it too.
    let bit = reduced ? 1 : bitAt(this.artTime);
    const bitGlyph = form === 'bit' && detailed;
    let spr: Sprite = bitGlyph ? (bit ? SPRITES.bit1 : SPRITES.bit0) : SPRITES[form];
    let fill = style.fill;
    let outline = style.outline;
    let alpha = style.alpha;
    let x = Math.round(this.W / 2);
    let y = this.cursorY;
    let visible = !(style.blink && !reduced && Math.floor(now / 530) % 2 === 1);

    this.trail.push({ x, y });
    if (this.trail.length > 40) this.trail.shift();

    const r = this.reaction;
    const el = r ? now - r.start : Infinity;
    if (r && el > REACTION_MS[r.tier]) this.reaction = undefined;
    const active = r && el <= REACTION_MS[r.tier] ? r.tier : undefined;
    const ctx = this.ctx;

    switch (active) {
      case 'off-by-one':
        // Lands one cell off, then snaps back.
        x += el < 350 ? -8 : el < 420 ? 1 : 0;
        visible = true;
        break;
      case 'npe':
        // Dereferenced null: jumps to (0,0) for a moment.
        if (el < 260) {
          x = 4;
          y = 4;
          ctx.fillStyle = '#ff5f7a';
          ctx.fillText('0x0', 12, 12);
        }
        visible = true;
        break;
      case 'leak':
        // Leaves copies of itself behind, the frozen-app cursor smear.
        for (let k = 0; k < 8; k++) {
          const p = this.trail[Math.max(0, this.trail.length - 1 - k * 4)]!;
          drawSprite(ctx, spr, p.x - k * 7, p.y - k * 5, fill, outline, alpha * (0.6 - k * 0.07));
        }
        visible = true;
        break;
      case 'race': {
        // Two cursors fight over the same spot.
        const spread = (1 - el / REACTION_MS.race) * 14 * (reduced ? 0.5 : Math.abs(Math.sin(el / 40)));
        drawSprite(ctx, spr, x - spread, y, fill, outline, alpha);
        x += spread;
        visible = true;
        break;
      }
      case 'heisenbug':
        // Only there when you're not looking straight at it.
        if (reduced) alpha *= 0.45;
        else visible = Math.random() > 0.55;
        break;
      case 'womm':
        spr = SPRITES.hourglass;
        fill = '#ffcf5a';
        outline = '#1b1b1b';
        alpha = 1;
        visible = true;
        if (!reduced && Math.floor(el / 220) % 2 === 1) {
          // Spin by flipping vertically.
          ctx.save();
          ctx.translate(0, 2 * y);
          ctx.scale(1, -1);
          drawSprite(ctx, spr, x, y, fill, outline, alpha);
          ctx.restore();
          return;
        }
        break;
      case 'bitflip':
        // A hard flip: the glyph shows the other value, inverted, for the whole reaction.
        [fill, outline] = [invert(fill), invert(outline)];
        if (bitGlyph) {
          bit = bit ? 0 : 1;
          spr = bit ? SPRITES.bit1 : SPRITES.bit0;
        }
        visible = true;
        break;
      case undefined:
        break;
    }

    if (visible) drawSprite(ctx, spr, x, y, fill, outline, alpha);
  }
}

/** Bit value at art time t: re-rolled every 150 ms, so it holds for a varying 150–600 ms between flips. */
function bitAt(t: number): 0 | 1 {
  return hash(Math.floor(t / 0.15) * 7 + 3) > 0.5 ? 1 : 0;
}

/** Fade mask for seams: opaque at the top, ragged and ordered-dithered to nothing by SEAM_H. */
function ditherFadeMask(w: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = SEAM_H;
  const m = get2d(c);
  m.fillStyle = '#fff';
  const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  for (let x = 0; x < w; x++) {
    // Ragged edge: columns in 3px groups reach different depths, like a torn or eroded seam.
    const reach = SEAM_H * (0.45 + 0.55 * hash(Math.floor(x / 3) * 13 + 5));
    for (let y = 0; y < SEAM_H; y++) {
      const v = 1 - y / reach;
      if (v * 16 > bayer[(y & 3) * 4 + (x & 3)]!) m.fillRect(x, y, 1, 1);
    }
  }
  return c;
}

function resetCtx(ctx: CanvasRenderingContext2D) {
  ctx.imageSmoothingEnabled = false;
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.font = FONT;
  ctx.textBaseline = 'alphabetic';
}

function invert(hex: string): string {
  const n = parseInt(hex.slice(1), 16) ^ 0xffffff;
  return `#${n.toString(16).padStart(6, '0')}`;
}

function get2d(c: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = c.getContext('2d', { willReadFrequently: true });
  enforce(ctx, '2D canvas unavailable');
  return ctx;
}
