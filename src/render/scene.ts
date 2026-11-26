import { LAYERS, MAX_DEPTH, layerIndexAt, type Layer, type LayerId } from '../core/layers';
import type { TierId } from '../core/tiers';
import { look, reducedMotion } from '../looks';
import { enforce } from '../core/enforce';
import { FONT, LAYER_ART, hash, type Art, type Band } from './art';
import { LAYER_ART_DETAILED, SEAM_ART, SEAM_H } from './art-detailed';
import { LAYER_ART_V3, PROP_SPOTS } from './art-v3';
import { LAYER_PALETTE, quantizeRow, snapColor } from './palettes';
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

/**
 * Visual height decoupled from frame span: each layer gets a base height plus a little per frame, so a 3-frame
 * layer still reads as a place and a 33-frame one doesn't drag on. Shallow layers move more pixels per frame,
 * which suits early answers. Below the last threshold, depth maps at PX per frame.
 */
const LAYER_BASE_H = 160;
const LAYER_PER_FRAME_H = 8;

/** World y of each layer's threshold, in order. */
const LAYER_Y: number[] = (() => {
  const ys = [TOP_PAD];
  for (let i = 1; i < LAYERS.length; i++) {
    const span = LAYERS[i]!.from - LAYERS[i - 1]!.from;
    enforce(span > 0, 'layer thresholds must strictly increase');
    ys.push(ys[i - 1]! + LAYER_BASE_H + span * LAYER_PER_FRAME_H);
  }
  return ys;
})();

/** World y of a depth in frames: piecewise linear through the layer thresholds. Dives, camera and deep links all use it. */
export function worldY(depth: number): number {
  const i = layerIndexAt(Math.max(0, depth));
  const l = LAYERS[i]!;
  if (i === LAYERS.length - 1) return LAYER_Y[i]! + (depth - l.from) * PX;
  const span = LAYERS[i + 1]!.from - l.from;
  return LAYER_Y[i]! + ((depth - l.from) / span) * (LAYER_Y[i + 1]! - LAYER_Y[i]!);
}

function bandTop(i: number): number {
  return i === 0 ? -1000 : LAYER_Y[i]! - 12;
}
function bandBottom(i: number): number {
  return i === LAYERS.length - 1 ? worldY(MAX_DEPTH) + 2000 : bandTop(i + 1);
}
function layerIndexAtWorldY(y: number): number {
  let idx = 0;
  for (let i = 0; i < LAYERS.length; i++) if (y >= bandTop(i)) idx = i;
  return idx;
}

type CursorForm = 'arrow' | 'ibeam' | 'block' | 'underscore' | 'bioscell' | 'bit';

const FORM_BY_LAYER: Record<LayerId, CursorForm> = {
  application: 'arrow',
  runtime: 'ibeam',
  libraries: 'ibeam',
  userspace: 'block',
  kernel: 'underscore',
  drivers: 'underscore',
  firmware: 'bioscell',
  'ring-1': 'bit',
  'ring-2': 'bit',
  'ring-3': 'bit',
};

const FORM_STYLE: Record<CursorForm, { fill: string; outline: string; alpha: number; blink: boolean }> = {
  arrow: { fill: '#ffffff', outline: '#000000', alpha: 1, blink: false },
  ibeam: { fill: '#ffffff', outline: '#ffffff', alpha: 1, blink: false },
  block: { fill: '#e8e4d8', outline: '#000000', alpha: 1, blink: true },
  underscore: { fill: '#ffffff', outline: '#000000', alpha: 1, blink: true },
  bioscell: { fill: '#ffffff', outline: '#0000aa', alpha: 1, blink: true },
  bit: { fill: '#ffffff', outline: '#000000', alpha: 1, blink: false },
};

interface Reaction {
  tier: TierId;
  start: number;
}

/** Tier colours, for the "+N frames" pops (snapped to the layer palette like everything drawn in the scene). */
const TIER_HEX: Record<TierId, string> = {
  'off-by-one': '#c9c4b4',
  womm: '#ff9f43',
  npe: '#8fb7ff',
  leak: '#5fd3e0',
  race: '#c58bff',
  heisenbug: '#ff6ad5',
  bitflip: '#ffe25a',
};

/** How long a dive of `frames` takes: bigger tiers dive farther, faster and for longer. */
export function diveMs(frames: number, fast = false): number {
  return fast ? 260 + 120 * Math.sqrt(frames) : 650 + 330 * Math.sqrt(frames);
}

/** A stop on a dive sequence (the end-of-day replay). */
export interface DiveStop {
  depth: number;
  tier: TierId;
  label: string;
}

interface Dive {
  from: number;
  to: number;
  start: number;
  dur: number;
  /** Tier reaction to fire on landing. */
  react?: TierId;
  pop?: { text: string; tier: TierId };
}

type CrossFx = 'tear' | 'mirror' | 'freeze' | 'onebit';
const CROSS_FX: Record<string, CrossFx> = { syscall: 'tear', 'VM exit': 'mirror', SMI: 'freeze', ME: 'onebit' };
const CROSS_MS: Record<CrossFx, number> = { tear: 380, mirror: 650, freeze: 420, onebit: 520 };

function easeOutBack(p: number): number {
  const c1 = 1.25;
  const c3 = c1 + 1;
  return 1 + c3 * (p - 1) ** 3 + c1 * (p - 1) ** 2;
}
const easeOutCubic = (p: number) => 1 - (1 - p) ** 3;

const TITLE_MS = 2400;
/** Each layer's name as that place would print it. */
const LAYER_TITLES: Record<LayerId, string> = {
  application: 'Application',
  runtime: '>>> import runtime',
  libraries: 'ld.so: loading libraries',
  userspace: '$ cd /usr  # OS userspace',
  kernel: '[ 0.000000] syscall: entering kernel',
  drivers: '[ 0.420000] drivers: probing devices',
  firmware: '== BIOS SETUP: Firmware ==',
  'ring-1': 'VMEXIT: Ring -1 (hypervisor)',
  'ring-2': 'SMI#: Ring -2 (SMM)',
  'ring-3': 'ME: Ring -3',
};

/** Half-size of the cursor's bracket box, the same for every cursor form. */
const MARK_RX = 9;
const MARK_RY = 11;

/**
 * The screen mirrors the cursor's tier reaction. The scene does the canvas side (black-out, leaked copies,
 * racing props, the frozen clock); the HUD reads this each frame and does the rest (grey, invert, racing panels).
 */
export interface ScreenFx {
  /** 0..1: entities jiggle out of sync (Race condition, Heisenbug). Always 0 under reduced motion. */
  jiggle: number;
  /** Works on my machine: the world hangs, grey and still. */
  hang: boolean;
  /** Bit Flip (and Heisenbug's tease): inverted colours; under reduced motion a slow, non-flashing tint instead. */
  flip: 'none' | 'invert' | 'tint';
}

/**
 * Bit Flip is the finale: it compounds every other tier's screen effect as an escalating cascade, in ms after
 * landing: hang (grey, frozen), then a black-out, leaked copies, racing jiggle, and last a held inversion
 * (one transition in, one out). It ends clean at 2200 ms.
 */
const CASCADE = { hang: [0, 450], blackout: [300, 700], leakAt: 550, jiggle: [700, 1300], invert: [1300, 2000] } as const;
const within = (t: number, [a, b]: readonly [number, number]) => t >= a && t < b;
const TEASE = [480, 600] as const;
const LEAK_MS = 2600;
const NPE_MS = 460;

const REACTION_MS: Record<TierId, number> = {
  'off-by-one': 600,
  womm: 1400,
  npe: 500,
  leak: 1600,
  race: 1000,
  heisenbug: 1400,
  bitflip: 2200,
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
  /** The cursor's depth. */
  private depth = 0;
  /** The camera's depth: follows the cursor with a slight lag, so a dive visibly leads. */
  private cam = 0;
  private dive: Dive | undefined;
  private queue: Dive[] = [];
  private queueAt = 0;
  private onQueueDone: (() => void) | undefined;
  private pops: { text: string; tier: TierId; start: number }[] = [];
  private cross: { fx: CrossFx; start: number } | undefined;
  private freezeShot: HTMLCanvasElement;
  readonly fx: ScreenFx = { jiggle: 0, hang: false, flip: 'none' };
  private npeRect: [number, number, number, number] | undefined;
  private leakPending = false;
  private cascadeLeaked = false;
  private leak: { start: number; seed: number; rects: [number, number, number, number][] } | undefined;
  private leakShot: HTMLCanvasElement;
  private lastLayer = 0;
  private reaction: Reaction | undefined;
  private tearUntil = 0;
  private tearStrength = 0;
  private artTime = 0;
  private lastNow = 0;
  private trail: { x: number; y: number }[] = [];
  private cursorLead = 0;
  /** The layer's name, shown briefly in its own idiom when you arrive (and once at boot). */
  private title: { layer: LayerId; start: number } | undefined = { layer: 'application', start: 0 };
  private swayAmp = 0;
  private swayPhase = 0;
  private bubbles: { x: number; y: number; age: number }[] = [];
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
    this.freezeShot = document.createElement('canvas');
    this.leakShot = document.createElement('canvas');
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
    for (const c of [this.canvas, this.prev, this.scratch, this.seam, this.freezeShot, this.leakShot]) {
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

  /** Glide to a depth (scroll mode, debug). Cancels any dive or sequence in progress. */
  setTarget(depth: number, immediate = false) {
    this.dive = undefined;
    this.queue = [];
    this.onQueueDone = undefined;
    this.target = Math.max(0, depth);
    if (immediate) {
      this.depth = this.target;
      this.cam = this.target;
    }
  }

  react(tier: TierId) {
    const now = performance.now();
    this.reaction = { tier, start: now };
    const seed = Math.floor(now);
    if (tier === 'leak') this.leakPending = true;
    this.cascadeLeaked = false;
    if (tier === 'npe' || tier === 'bitflip') {
      // A pixel-aligned chunk of the screen that "isn't there".
      const w = Math.round(this.W * (0.28 + hash(seed) * 0.2));
      const h = Math.round(this.H * (0.18 + hash(seed + 1) * 0.15));
      this.npeRect = [Math.round(hash(seed + 2) * (this.W - w)), Math.round(hash(seed + 3) * (this.H - h)), w, h];
    }
  }

  /**
   * An accepted answer: the cursor dives to `to`, eased with a small overshoot, and the tier's reaction
   * fires on landing. A "+N frames" pops off the cursor as it lands.
   */
  diveTo(to: number, tier: TierId, frames: number, react = true) {
    this.queue = [];
    this.onQueueDone = undefined;
    const pop = { text: `+${frames} frame${frames === 1 ? '' : 's'}`, tier };
    this.startDive({ from: this.depth, to, start: performance.now(), dur: diveMs(frames), react: react ? tier : undefined, pop });
  }

  /**
   * The end-of-day replay: from the top, a fast dive through each stop, each popping its label as the cursor
   * passes. `done` runs after the last stop lands (or at once on skip).
   */
  playSequence(stops: DiveStop[], done: () => void) {
    this.setTarget(0, true);
    let from = 0;
    this.queue = stops.map((s) => {
      const d: Dive = { from, to: s.depth, start: 0, dur: diveMs(Math.max(1, s.depth - from), true), pop: { text: s.label, tier: s.tier } };
      from = s.depth;
      return d;
    });
    this.queueAt = performance.now() + 350;
    this.onQueueDone = done;
    if (!this.queue.length) this.finishQueue();
  }

  get sequencePlaying() {
    return this.onQueueDone !== undefined;
  }

  /** Jump to the end of a running sequence. */
  skipSequence() {
    const last = this.queue[this.queue.length - 1] ?? this.dive;
    if (!last) return;
    this.dive = undefined;
    this.queue = [];
    this.depth = this.cam = this.target = last.to;
    this.finishQueue();
  }

  private finishQueue() {
    const done = this.onQueueDone;
    this.onQueueDone = undefined;
    done?.();
  }

  private startDive(d: Dive) {
    this.dive = d;
    this.target = d.to;
  }

  private land(d: Dive, now: number) {
    this.dive = undefined;
    this.depth = d.to;
    if (d.react) this.react(d.react);
    if (d.pop) this.pops.push({ ...d.pop, start: now });
    if (this.queue.length) this.queueAt = now + 140;
    else if (this.onQueueDone) this.finishQueue();
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
    const style = look('artStyle');
    const detailed = style !== 'v1';
    const art = style === 'v3' ? LAYER_ART_V3 : style === 'v2' ? LAYER_ART_DETAILED : LAYER_ART;

    // Move the cursor: a dive (eased, with a small overshoot), or a glide toward the target.
    if (!this.dive && this.queue.length && now >= this.queueAt) this.startDive({ ...this.queue.shift()!, start: now });
    const dv = this.dive;
    if (dv) {
      const p = Math.min(1, (now - dv.start) / dv.dur);
      this.depth = Math.max(0, dv.from + (dv.to - dv.from) * (reduced ? easeOutCubic(p) : easeOutBack(p)));
      if (p >= 1) this.land(dv, now);
    } else {
      this.depth += (this.target - this.depth) * (1 - Math.exp(-dt * 2.5));
      if (Math.abs(this.target - this.depth) < 0.002) this.depth = this.target;
    }
    // The camera follows with a slight lag (none under reduced motion).
    if (reduced) this.cam = this.depth;
    else {
      this.cam += (this.depth - this.cam) * (1 - Math.exp(-dt * 5));
      if (Math.abs(this.depth - this.cam) < 0.002) this.cam = this.depth;
    }

    const layerIdx = layerIndexAt(this.depth);
    const layer = LAYERS[layerIdx]!;
    if (layerIdx !== this.lastLayer) {
      // Crossing a boundary plays its effect: tearing at syscall, a mirror shimmer at VM exit, a freeze-frame at
      // SMI, the drop into 1-bit at ME. Unlabelled crossings get a light tear.
      const crossed = LAYERS[Math.max(layerIdx, this.lastLayer)]!;
      const fx = crossed.boundary ? CROSS_FX[crossed.boundary] : undefined;
      if (crossed.boundary) enforce(fx, `no crossing effect for boundary '${crossed.boundary}'`);
      if (!reduced && look('tearing') === 'on') {
        if (fx === 'tear' || fx === undefined) {
          this.tearStrength = fx ? 1 : 0.5;
          this.tearUntil = now + CROSS_MS.tear;
        } else {
          this.cross = { fx, start: now };
          if (fx === 'freeze') get2d(this.freezeShot).drawImage(this.canvas, 0, 0);
        }
      }
      this.lastLayer = layerIdx;
      this.title = { layer: layer.id, start: now };
      this.onLayerChange?.(layer);
    }

    const frozen = layer.id === 'ring-2' && look('freeze') === 'on';
    // The screen's half of the tier reaction.
    const rx = this.reaction;
    const rel = rx ? now - rx.start : Infinity;
    const act = rx && rel <= REACTION_MS[rx.tier] ? rx.tier : undefined;
    const flip = act === 'bitflip';
    this.fx.hang = act === 'womm' || (flip && within(rel, CASCADE.hang));
    this.fx.jiggle = reduced
      ? 0
      : act === 'race' || act === 'heisenbug'
        ? Math.max(0, 1 - rel / REACTION_MS[act])
        : flip && within(rel, CASCADE.jiggle)
          ? 1 - (rel - CASCADE.jiggle[0]) / (CASCADE.jiggle[1] - CASCADE.jiggle[0])
          : 0;
    if (flip && rel >= CASCADE.leakAt && !this.cascadeLeaked) {
      this.cascadeLeaked = true;
      this.leakPending = true;
    }
    this.fx.flip = flip
      ? within(rel, CASCADE.invert)
        ? reduced
          ? 'tint'
          : 'invert'
        : 'none'
      : act === 'heisenbug'
          ? reduced
            ? 'tint'
            : rel >= TEASE[0] && rel < TEASE[1]
              ? 'invert'
              : 'none'
          : 'none';
    // Works on my machine hangs the world's clock, like Ring −2 does.
    if (!frozen && !this.fx.hang) this.artTime += dt;
    PROP_SPOTS.length = 0;

    const camWorldY = worldY(this.cam);
    const camY = Math.round(camWorldY - this.cursorY);
    // Where the cursor sits relative to its resting row: below it while the camera catches up.
    this.cursorLead = Math.max(-50, Math.min(70, Math.round(worldY(this.depth) - camWorldY)));
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
      // v1 keeps its plain seam labels for comparison; detailed styles name a layer only as you arrive in it.
      if (detailed) continue;
      const label = l.boundary ? `${l.boundary} → ${l.name}` : l.name;
      ctx.font = FONT;
      const tw = Math.ceil(ctx.measureText(label).width);
      ctx.fillStyle = '#000';
      ctx.fillRect(8, y - 5, tw + 6, 10);
      ctx.fillStyle = '#fff';
      ctx.fillText(label, 11, y + 3);
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

    // 4. Cursor: it sways as it sinks and settles when it arrives; static under reduced motion.
    const speed = Math.abs(this.target - this.depth);
    const want = reduced ? 0 : Math.min(1, speed / 2);
    // Rises quickly, decays slowly, so arriving leaves a couple of fading swings.
    this.swayAmp += (want - this.swayAmp) * (1 - Math.exp(-dt * (want > this.swayAmp ? 5 : 1.1)));
    if (reduced) this.swayAmp = 0;
    // Ring −2's frozen time holds the sway and the bubbles too.
    const swayDt = frozen ? 0 : dt;
    this.swayPhase += swayDt * 3.1;
    this.drawBubbles(swayDt, speed, reduced, layer.id);
    this.drawCursor(now, layer.id, reduced, detailed);
    this.drawPops(now, layer.id, reduced);
    if (detailed) this.drawTitle(now, layer.id, reduced);

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

    // 6. Ghosting: two VMs sharing one screen. The echo is of the clean previous frame, so it doesn't feed back
    // into itself and smear into noise.
    const ghost = layer.id === 'ring-1' && look('ghosting') === 'on' && !reduced;
    if (ghost) {
      this.scratchCtx.drawImage(this.prev, 0, 0);
      this.prevCtx.drawImage(this.canvas, 0, 0);
      ctx.globalAlpha = 0.28;
      ctx.drawImage(this.scratch, 3, 1);
      ctx.globalAlpha = 1;
    } else this.prevCtx.drawImage(this.canvas, 0, 0);

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

    // 9. Boundary crossing effects (never under reduced motion; set only when motion is full).
    const cr = this.cross;
    if (cr) {
      const p = (now - cr.start) / CROSS_MS[cr.fx];
      if (p >= 1 || reduced) this.cross = undefined;
      else if (cr.fx === 'mirror') {
        // VM exit: a mirrored guest shimmers over the host and fades.
        this.scratchCtx.drawImage(this.canvas, 0, 0);
        ctx.save();
        ctx.globalAlpha = 0.4 * (1 - p);
        ctx.translate(W + Math.round(Math.sin(p * 18) * 3), 0);
        ctx.scale(-1, 1);
        ctx.drawImage(this.scratch, 0, 0);
        ctx.restore();
      } else if (cr.fx === 'freeze') {
        // SMI: the frame before the crossing holds, a scan line runs down it, then time resumes.
        ctx.drawImage(this.freezeShot, 0, 0);
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, Math.floor(p * H), W, 1);
      } else if (cr.fx === 'onebit') {
        // ME: 1-bit spreads out from the cursor's row and then recedes to the die below.
        const reach = Math.round(H * Math.sin(p * Math.PI));
        const y0 = Math.max(0, this.cursorY - reach);
        const y1 = Math.min(H, this.cursorY + reach);
        if (y1 > y0) {
          const img = ctx.getImageData(0, y0, W, y1 - y0);
          for (let y = 0; y < y1 - y0; y++) quantizeRow(img.data, y * W * 4, W, y0 + y, 'onebit', true);
          ctx.putImageData(img, 0, y0);
        }
      }
    }

    // 10. The screen mirrors the tier reaction (the HUD adds grey, invert and racing panels from this.fx).
    this.drawReactionFx(now, act, rel, reduced);
  }

  /**
   * On-screen "entities" for reactions: v3 reports where it drew its near props; other art styles fall back
   * to a seeded scatter of cells.
   */
  private entities(seed: number, n: number): [number, number, number, number][] {
    const out: [number, number, number, number][] = [];
    const spots = PROP_SPOTS.length / 2;
    for (let k = 0; out.length < n && k < n * 4; k++) {
      let x: number;
      let y: number;
      if (spots > 0) {
        const j = Math.floor(hash(seed + k * 7) * spots);
        x = PROP_SPOTS[j * 2]! - 2;
        y = PROP_SPOTS[j * 2 + 1]! - 3;
      } else {
        x = Math.floor(hash(seed + k * 7) * (this.W - 24));
        y = Math.floor(hash(seed + k * 7 + 1) * (this.H - 20));
      }
      if (x < 0 || y < 0 || x + 24 > this.W || y + 20 > this.H) continue;
      out.push([x, y, 24, 20]);
    }
    return out;
  }

  private drawReactionFx(now: number, act: TierId | undefined, rel: number, reduced: boolean) {
    const ctx = this.ctx;
    // Null pointer: a chunk of the screen blacks out, as if that memory isn't there (a static dim when reduced).
    if (this.npeRect && ((act === 'npe' && rel < NPE_MS) || (act === 'bitflip' && within(rel, CASCADE.blackout)))) {
      const [x, y, w, h] = this.npeRect;
      ctx.fillStyle = reduced ? 'rgba(0,0,0,0.6)' : '#000';
      ctx.fillRect(x, y, w, h);
    }
    // Race condition, Heisenbug: props jiggle out of sync, each on its own phase.
    if (this.fx.jiggle > 0) {
      this.scratchCtx.drawImage(this.canvas, 0, 0);
      const rects = this.entities(Math.floor(this.reaction!.start), 26);
      rects.forEach(([x, y, w, h], i) => {
        const dx = Math.round(Math.sin(now / 45 + i * 1.7) * 2.4 * this.fx.jiggle);
        const dy = Math.round(Math.cos(now / 53 + i * 2.3) * 1.6 * this.fx.jiggle);
        if (dx || dy) ctx.drawImage(this.scratch, x, y, w, h, x + dx, y + dy, w, h);
      });
    }
    // Memory leak: a few props are copied and the copies linger, drifting off like the cursor's smear, then fade.
    if (this.leakPending) {
      this.leakPending = false;
      get2d(this.leakShot).drawImage(this.canvas, 0, 0);
      const seed = Math.floor(now);
      this.leak = { start: now, seed, rects: this.entities(seed, 10) };
    }
    const lk = this.leak;
    if (lk) {
      const age = (now - lk.start) / LEAK_MS;
      if (age >= 1) this.leak = undefined;
      else {
        ctx.globalAlpha = age < 0.6 ? 0.9 : 0.9 * (1 - (age - 0.6) / 0.4);
        lk.rects.forEach(([x, y, w, h], k) => {
          const drift = (k % 3) * 2 + 5 + (reduced ? 0 : age * 18);
          ctx.drawImage(this.leakShot, x, y, w, h, Math.round(x - drift), Math.round(y + drift * 0.6), w, h);
        });
        ctx.globalAlpha = 1;
      }
    }
  }

  /**
   * Arriving in a layer: its name appears in that place's own idiom (a dmesg line, a BIOS header, a shell
   * prompt), types in, holds, and fades. No permanent signage.
   */
  private drawTitle(now: number, layerId: LayerId, reduced: boolean) {
    const t = this.title;
    if (!t) return;
    if (t.start === 0) t.start = now;
    if (t.layer !== layerId) return;
    const age = now - t.start;
    if (age > TITLE_MS) {
      this.title = undefined;
      return;
    }
    const text = LAYER_TITLES[layerId];
    const shown = reduced ? text : text.slice(0, Math.ceil(age / 30));
    const ctx = this.ctx;
    ctx.font = FONT;
    const tw = Math.ceil(ctx.measureText(text).width);
    const x = Math.round(this.W / 2 - tw / 2);
    const y = Math.round(Math.max(14, this.cursorY - 58));
    ctx.globalAlpha = age < TITLE_MS - 500 ? 1 : (TITLE_MS - age) / 500;
    ctx.fillStyle = '#000';
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [1, 1]] as const) ctx.fillText(shown, x + dx, y + dy);
    const perLayer = look('palette') === 'per-layer';
    ctx.fillStyle = perLayer ? snapColor('#ffffff', LAYER_PALETTE[layerId]) : '#ffffff';
    ctx.fillText(shown, x, y);
    ctx.globalAlpha = 1;
  }

  /** "+N frames" and replay labels: pop off the cursor, float up and fade (only fade under reduced motion). */
  private drawPops(now: number, layerId: LayerId, reduced: boolean) {
    if (!this.pops.length) return;
    const ctx = this.ctx;
    const perLayer = look('palette') === 'per-layer';
    ctx.font = FONT;
    this.pops = this.pops.filter((p) => now - p.start < 1300);
    this.pops.forEach((p, i) => {
      const a = (now - p.start) / 1300;
      const tw = Math.ceil(ctx.measureText(p.text).width);
      const x = Math.round(this.W / 2 - tw / 2);
      const y = Math.round(this.cursorY + this.cursorLead - 14 - i * 9 - (reduced ? 0 : a * 26));
      ctx.globalAlpha = a < 0.7 ? 1 : 1 - (a - 0.7) / 0.3;
      ctx.fillStyle = '#000';
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [1, 1]] as const) ctx.fillText(p.text, x + dx, y + dy);
      ctx.fillStyle = perLayer ? snapColor(TIER_HEX[p.tier], LAYER_PALETTE[layerId]) : TIER_HEX[p.tier];
      ctx.fillText(p.text, x, y);
    });
    ctx.globalAlpha = 1;
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
    let x = Math.round(this.W / 2 + this.swayAmp * 6 * Math.sin(this.swayPhase));
    let y = Math.round(this.cursorY + this.cursorLead + this.swayAmp * 2 * Math.sin(this.swayPhase * 2));
    let visible = !(style.blink && !reduced && Math.floor(now / 530) % 2 === 1);
    // A blinking cursor's mark stays put while the glyph blinks, so it never vanishes into the art.
    let marked = true;

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
        marked = visible;
        break;
      case 'womm':
        // The comic letdown: it spins, thinks about it ("..."), and droops.
        spr = SPRITES.hourglass;
        fill = '#ffcf5a';
        outline = '#1b1b1b';
        alpha = 1;
        visible = true;
        if (el > 500) {
          ctx.fillStyle = '#ffffff';
          ctx.font = FONT;
          ctx.fillText('.'.repeat(Math.min(3, 1 + Math.floor((el - 500) / 250))), x + 9, y + 4);
        }
        if (el > REACTION_MS.womm - 400) y += 2;
        if (!reduced && Math.floor(el / 220) % 2 === 1) {
          // Spin by flipping vertically.
          this.drawMark(now, spr, x, y, layerId, reduced);
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

    if (marked) this.drawMark(now, spr, x, y, layerId, reduced);
    if (visible) drawSprite(ctx, spr, x, y, fill, outline, alpha);
  }

  /**
   * The player's mark: a dark backing (dithered light, so the art behind dims) and four amber corner brackets
   * with a black edge, snapped to the layer's palette so they read on every layer, including 1-bit Ring −3.
   */
  private drawMark(now: number, spr: Sprite, x: number, y: number, layerId: LayerId, reduced: boolean) {
    const ctx = this.ctx;
    // Every cursor form shares one box: centred on the glyph, except a short glyph (the underscore) sits at the
    // bottom of the box, the way it sits at the bottom of a text cell.
    const ox = x - spr.hx;
    const oy = y - spr.hy;
    const cx = Math.round(ox + spr.w / 2);
    const cy = Math.round(spr.h < 8 ? oy + spr.h - 7 : oy + spr.h / 2);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16);
    g.addColorStop(0, 'rgba(0,0,0,0.85)');
    g.addColorStop(0.55, 'rgba(0,0,0,0.55)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(cx - 16, cy - 16, 32, 32);
    // Amber where the palette has colour; the brightest level where it's a single-hue ramp.
    const pal = LAYER_PALETTE[layerId];
    const perLayer = look('palette') === 'per-layer';
    const amber = !perLayer ? '#ffb000' : pal === 'green' || pal === 'gray' || pal === 'onebit' ? snapColor('#ffffff', pal) : snapColor('#ffb000', pal);
    const breathe = reduced ? 0 : Math.round((Math.sin(now / 420) + 1) / 2);
    const rx = MARK_RX + breathe;
    const ry = MARK_RY + breathe;
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
      const bx = cx + sx * rx;
      const by = cy + sy * ry;
      // Black edge first, then a 2px amber bracket on top: arms run inward from the corner.
      const ax = sx > 0 ? bx - 4 : bx;
      const ay = sy > 0 ? by - 4 : by;
      const hx = sx > 0 ? bx - 1 : bx;
      const hy = sy > 0 ? by - 1 : by;
      ctx.fillStyle = '#000';
      ctx.fillRect(ax - 1, hy - 1, 7, 4);
      ctx.fillRect(hx - 1, ay - 1, 4, 7);
      ctx.fillStyle = amber;
      ctx.fillRect(ax, hy, 5, 2);
      ctx.fillRect(hx, ay, 2, 5);
    }
  }

  /** Bubbles shed while sinking: they rise past the cursor and fade. None under reduced motion. */
  private drawBubbles(dt: number, speed: number, reduced: boolean, layerId: LayerId) {
    if (reduced) {
      this.bubbles.length = 0;
      return;
    }
    const cx = this.W / 2 + this.swayAmp * 6 * Math.sin(this.swayPhase);
    if (speed > 0.25 && this.bubbles.length < 24 && Math.random() < dt * (4 + speed * 2)) {
      this.bubbles.push({ x: cx + (Math.random() - 0.5) * 10, y: this.cursorY + this.cursorLead + 4, age: 0 });
    }
    const ctx = this.ctx;
    const ink = look('palette') === 'per-layer' ? snapColor('#ffffff', LAYER_PALETTE[layerId]) : '#ffffff';
    ctx.fillStyle = ink;
    // Bubbles rise relative to the world, and the world is scrolling up past the cursor: they stream upward.
    const rise = 14 + speed * 10;
    this.bubbles = this.bubbles.filter((b) => (b.age += dt) < 1.6);
    for (const b of this.bubbles) {
      b.y -= rise * dt;
      b.x += Math.sin(b.age * 6 + b.y) * dt * 6;
      const bx = Math.round(b.x);
      const by = Math.round(b.y);
      if (b.age < 0.8) {
        ctx.fillRect(bx - 1, by, 1, 1);
        ctx.fillRect(bx + 1, by, 1, 1);
        ctx.fillRect(bx, by - 1, 1, 1);
        ctx.fillRect(bx, by + 1, 1, 1);
      } else ctx.fillRect(bx, by, 1, 1);
    }
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
