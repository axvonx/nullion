import { LAYERS, MAX_DEPTH, layerIndexAt, type Layer, type LayerId } from '../core/layers';
import type { TierId } from '../core/tiers';
import { look, reducedMotion } from '../looks';
import { enforce } from '../core/enforce';
import { FONT, LAYER_ART, hash, type Art, type Band } from './art';
import { LAYER_ART_DETAILED, SEAM_ART, SEAM_H } from './art-detailed';
import { LAYER_ART_V3, PROP_SPOTS } from './art-v3';
import { ENTITY_SPOTS, LAYER_ART_V4, ensureWorldV4 } from './art-v4';
import type { WorldSpecV4 } from './v4/world';
import { LAYER_PALETTE, quantizeRow, snapColor } from './palettes';
import { SPRITES, drawSprite, type Sprite } from './sprites';
import { CASCADE, LEAD_MS, NO_REACTION, NPE_MS, REACTION_MS, WOMM, reactionFrame, type ReactionFrame } from './reaction-fx';
import { CURSOR_FRAC, FORM_BY_LAYER, MARK_RX, MARK_RY, markCenter, markExtentY, pixelScale, type CursorForm } from './cursor-geom';

export { pixelScale } from './cursor-geom';

/** World pixels per stack frame of depth. */
const PX = 24;
const TOP_PAD = 40;
/** The cursor sits in clear air this far down the screen, above the floating console. */


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
  /** Runs once when the dive lands: the demos' tier reveal. */
  onLand?: () => void;
  /** Set on the first frame the cursor moves (a Works-on-my-machine dive waits out its hang first). */
  moving?: boolean;
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

const VIGNETTE_MS = 220;
/** The reveal's dim, outermost band to innermost: cumulative darkness. */
const VIGNETTE_STEPS = [0.3, 0.5, 0.68, 0.8, 0.88, 0.93];



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

const LEAK_MS = 2600;
const LEAK_BATCHES = 5;
const LEAK_EVERY_MS = 1200;

/** How long a tier's notable part plays before its dive starts. */
export function diveLeadMs(tier: TierId): number {
  return LEAD_MS[tier];
}

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
  /** Leaked prop copies, in batches: one per leak, and more, slowly, while a Memory leak is held by the reveal. */
  private leaks: { start: number; rects: [number, number, number, number][] }[] = [];
  /** While the tier reveal is open the reaction holds or loops instead of ending (see setHold). */
  private held = false;
  /** This frame's reaction timeline (see reaction-fx.ts). */
  private rf: ReactionFrame = NO_REACTION;
  private leakShot: HTMLCanvasElement;
  private lastLayer = 0;
  private reaction: Reaction | undefined;
  private tearUntil = 0;
  private tearStrength = 0;
  private artTime = 0;
  private lastNow = 0;
  private trail: { x: number; y: number }[] = [];
  private cursorLead = 0;
  private swayAmp = 0;
  private swayPhase = 0;
  private bubbles: { x: number; y: number; age: number }[] = [];
  private vignette = { on: false, at: -Infinity };
  private rain: { y: number; speed: number }[] = [];

  onLayerChange: ((layer: Layer) => void) | undefined;

  /**
   * v4's world seed: the puzzle number by default (main.ts), so everyone sees the same world on a given day.
   * Placement runs once per seed and viewport width, never per frame.
   */
  private worldSeed = 1;
  /** CSS pixels at the right edge covered by debug UI (the demo rail); v4 drops entities under it. 0 in production. */
  uiReserveRightCss = 0;

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

  /** Reseed v4's world (a new day, ?seed=N, or the debug rail's reroll). It is rebuilt on the next frame. */
  setWorldSeed(seed: number) {
    enforce(Number.isInteger(seed), `world seed must be an integer, got ${seed}`);
    this.worldSeed = seed;
  }

  get seed() {
    return this.worldSeed;
  }

  /**
   * Everything v4 placement depends on, in scene pixels. It depends on the width only (never the height), so a
   * mobile URL bar showing or hiding doesn't reshuffle the world.
   * - The cursor lane is the column the cursor descends through.
   * - Panel lanes are the x-spans of the console card and the two header chips (see style.css): the world scrolls
   *   under them, so only small props may sit there and anchors stay out.
   * - The layer entrance and the tier reveal are DOM text over the middle of the screen; rather than carve a hole
   *   for them, v4 lowers its density uniformly on narrow screens, where that text spans most of the width.
   */
  private worldSpec(): WorldSpecV4 {
    const W = this.W;
    const vw = window.innerWidth;
    const scale = pixelScale(vw);
    const cx = Math.round(W / 2);
    const consoleHalf = Math.ceil(Math.min(520, vw - 32) / 2 / scale) + 3;
    const last = LAYERS.length - 1;
    return {
      seed: this.worldSeed,
      W,
      bands: LAYERS.map((_, i) => ({
        // The first band reaches far above anything the camera shows, and the last far below: clamp both to view.
        top: i === 0 ? TOP_PAD - 180 : bandTop(i),
        bottom: i === last ? worldY(MAX_DEPTH) + 320 : bandBottom(i),
        keepOut: [],
      })),
      cursorLane: [cx - 16, cx + 16],
      panelLanes: [
        [cx - consoleHalf, cx + consoleHalf],
        [0, Math.ceil(80 / scale)],
        [W - Math.ceil(150 / scale), W],
      ],
      hideLane: this.uiReserveRightCss > 0 ? [W - Math.ceil(this.uiReserveRightCss / scale), W] : undefined,
    };
  }

  /**
   * The tier reveal's dim: a soft radial vignette over the middle of the screen, under the cursor. It eases in and
   * out over VIGNETTE_MS; under reduced motion it is a static dim that simply appears and goes.
   */
  setVignette(on: boolean) {
    if (on === this.vignette.on) return;
    const now = performance.now();
    // Reversing mid-fade starts from where the fade got to.
    const k = Math.min(1, (now - this.vignette.at) / VIGNETTE_MS);
    this.vignette = { on, at: now - (1 - k) * VIGNETTE_MS };
  }

  /**
   * Hold the current tier reaction while the reveal is open: after its first play-through each reaction loops or
   * holds calmly (off-by-one toggles a cell, the hang and black-out hold, leaks keep accumulating up to a cap,
   * jiggle continues gently, Bit Flip holds its inversion). Releasing lets it end: leaked copies fade out.
   * Nothing strobes: inversions are entered once and held.
   */
  setHold(on: boolean) {
    if (on === this.held) return;
    this.held = on;
    if (on) return;
    const now = performance.now();
    for (const b of this.leaks) b.start = Math.min(b.start, now - 0.6 * LEAK_MS);
    const r = this.reaction;
    if (r && now - r.start > REACTION_MS[r.tier]) this.reaction = undefined;
  }

  /** A dive carrying a reaction keeps it going through its lead and descent (the reveal's hold takes over on landing). */
  private sustainedByDive(): boolean {
    const d = this.dive;
    return !!d && d.react !== undefined;
  }

  /** The cursor form shown in a layer (the look can pin one form everywhere). */
  formFor(layerId: LayerId): CursorForm {
    const override = look('cursor');
    return override === 'evolving' ? FORM_BY_LAYER[layerId] : override;
  }

  /** The cursor's bracket mark at rest, in CSS pixels: the HUD frames it with the reveal's text. */
  markCss(): { top: number; bottom: number } {
    const scale = pixelScale(window.innerWidth);
    const m = markExtentY(this.formFor(LAYERS[layerIndexAt(this.depth)]!.id), this.cursorY);
    return { top: m.top * scale, bottom: m.bottom * scale };
  }

  private drawVignette(now: number, reduced: boolean) {
    const v = this.vignette;
    const k = reduced ? 1 : Math.min(1, (now - v.at) / VIGNETTE_MS);
    const a = v.on ? k : 1 - k;
    if (a <= 0) return;
    // Pixel-art dim: concentric hard-edged bands with stepped corners, on the scene's pixel grid, darkest in the
    // middle (the palette pass dithers each band). Centred on the cursor: the name sits above it, details below.
    const ctx = this.ctx;
    const cx = Math.round(this.W / 2);
    const cy = this.cursorY;
    const rx = Math.min(Math.round(this.W * 0.62), 210);
    const ry = Math.round(this.H * 0.3);
    const steps = VIGNETTE_STEPS.length;
    let below = 0;
    VIGNETTE_STEPS.forEach((target, k) => {
      const want = target * a;
      // Each band adds just enough to reach its target darkness over the bands outside it.
      const add = below >= 1 ? 0 : 1 - (1 - want) / (1 - below);
      below = want;
      const hw = Math.round(rx * (1 - k / steps));
      const hh = Math.round(ry * (1 - k / steps));
      const c = Math.max(2, Math.round(Math.min(hw, hh) * 0.35));
      ctx.fillStyle = `rgba(0,0,0,${Math.max(0, add).toFixed(3)})`;
      steppedRect(ctx, cx - hw, cy - hh, hw * 2, hh * 2, c);
    });
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

  /** Start a tier reaction now. `leakNow: false` defers the leak's screen copies to the landing (mid-dive they'd smear). */
  react(tier: TierId, leakNow = true) {
    const now = performance.now();
    this.reaction = { tier, start: now };
    const seed = Math.floor(now);
    if (tier === 'leak' && leakNow) this.leakPending = true;
    this.cascadeLeaked = false;
    if (tier === 'npe' || tier === 'bitflip' || tier === 'womm') {
      // A pixel-aligned chunk of the screen that "isn't there".
      const w = Math.round(this.W * (0.28 + hash(seed) * 0.2));
      const h = Math.round(this.H * (0.18 + hash(seed + 1) * 0.15));
      this.npeRect = [Math.round(hash(seed + 2) * (this.W - w)), Math.round(hash(seed + 3) * (this.H - h)), w, h];
    }
  }

  /**
   * An accepted answer. Each tier plays its most notable part first, where the cursor is (diveLeadMs), then the
   * cursor sinks to `to` (eased, small overshoot) with the reaction still going, and on landing it holds while
   * the reveal is up (see setHold). Works on my machine hangs first, sinks un-hung, then hangs again on landing.
   * A "+N frames" pops off the cursor as it lands.
   */
  diveTo(to: number, tier: TierId, frames: number, react = true, onLand?: () => void) {
    this.queue = [];
    this.onQueueDone = undefined;
    const pop = { text: `+${frames} frame${frames === 1 ? '' : 's'}`, tier };
    const now = performance.now();
    if (react) this.react(tier);
    this.startDive({ from: this.depth, to, start: now + (react ? diveLeadMs(tier) : 0), dur: diveMs(frames), react: react ? tier : undefined, pop, onLand });
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

  /** True while a dive (or a replay sequence) is still moving the cursor. */
  get diving() {
    return this.dive !== undefined || this.queue.length > 0;
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

  private beginMoving(d: Dive) {
    d.moving = true;
  }

  private land(d: Dive, now: number) {
    this.dive = undefined;
    this.depth = d.to;
    if (d.react === 'leak') this.leakPending = true;
    d.onLand?.();
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
    const art = style === 'v4' ? LAYER_ART_V4 : style === 'v3' ? LAYER_ART_V3 : style === 'v2' ? LAYER_ART_DETAILED : LAYER_ART;
    if (style === 'v4') ensureWorldV4(this.worldSpec());

    // Move the cursor: a dive (eased, with a small overshoot), or a glide toward the target.
    if (!this.dive && this.queue.length && now >= this.queueAt) this.startDive({ ...this.queue.shift()!, start: now });
    const dv = this.dive;
    if (dv && now < dv.start) {
      // The lead: the tier's notable part plays where the cursor is, before it sinks.
    } else if (dv) {
      if (!dv.moving) this.beginMoving(dv);
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
      this.onLayerChange?.(layer);
    }

    const frozen = layer.id === 'ring-2' && look('freeze') === 'on';
    // The screen's half of the tier reaction.
    const rx = this.reaction;
    const rel = rx ? now - rx.start : Infinity;
    const sustained = this.held || this.sustainedByDive();
    const act = rx && (sustained || rel <= REACTION_MS[rx.tier]) ? rx.tier : undefined;
    // The reaction's timeline (pure, tested in reaction-fx.test.ts): hang, jiggle, inversion or tint, black-out.
    const rf = act ? reactionFrame(act, rel, sustained, reduced) : NO_REACTION;
    this.rf = rf;
    this.fx.hang = rf.hang;
    this.fx.jiggle = rf.jiggle;
    this.fx.flip = rf.flip;
    if (act === 'bitflip' && rel >= CASCADE.leakAt && !this.cascadeLeaked) {
      this.cascadeLeaked = true;
      this.leakPending = true;
    }
    // Works on my machine hangs the world's clock, like Ring −2 does.
    if (!frozen && !this.fx.hang) this.artTime += dt;
    PROP_SPOTS.length = 0;
    ENTITY_SPOTS.length = 0;

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

    // 3b. The screen mirrors the tier reaction in the world (the HUD adds grey, invert and racing panels from this.fx).
    // It sits under the vignette and the cursor: the mascot's own reaction always plays in front.
    this.drawReactionFx(now, act, rel, reduced);

    // 4. Cursor: it sways as it sinks and settles when it arrives; static under reduced motion.
    const speed = Math.abs(this.target - this.depth);
    const want = reduced ? 0 : Math.min(1, speed / 2);
    // Rises quickly, decays slowly, so arriving leaves a couple of fading swings.
    this.swayAmp += (want - this.swayAmp) * (1 - Math.exp(-dt * (want > this.swayAmp ? 5 : 1.1)));
    if (reduced) this.swayAmp = 0;
    // Ring −2's frozen time holds the sway and the bubbles too.
    const swayDt = frozen ? 0 : dt;
    this.swayPhase += swayDt * 3.1;
    // The reveal's vignette dims the middle beneath the cursor pass, so the cursor and its reaction play in front of it.
    this.drawVignette(now, reduced);
    this.drawBubbles(swayDt, speed, reduced, layer.id);
    this.drawCursor(now, layer.id, reduced, detailed);
    this.drawPops(now, layer.id, reduced);

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

  }

  /**
   * On-screen "entities" for reactions: v4 reports the exact boxes of the props it drew, v3 where it drew its near
   * props; other art styles fall back to a seeded scatter of cells.
   */
  private entities(seed: number, n: number): [number, number, number, number][] {
    const out: [number, number, number, number][] = [];
    const boxes = ENTITY_SPOTS.length / 4;
    if (boxes > 0) {
      // Distinct props, in a seeded order: each copied or jiggled once.
      const order = Array.from({ length: boxes }, (_, j) => j).sort((a, b) => hash(seed + a * 7) - hash(seed + b * 7));
      for (const j of order.slice(0, n)) {
        const [x, y, w, h] = [ENTITY_SPOTS[j * 4]!, ENTITY_SPOTS[j * 4 + 1]!, ENTITY_SPOTS[j * 4 + 2]!, ENTITY_SPOTS[j * 4 + 3]!];
        if (x + w <= 0 || y + h <= 0 || x >= this.W || y >= this.H) continue;
        out.push([x, y, w, h]);
      }
      return out;
    }
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
    // Held by the reveal, it stays, breathing slowly between deep and full black (no blinking).
    if (this.npeRect && this.rf.blackout) {
      const [x, y, w, h] = this.npeRect;
      const breathing = act === 'npe' && rel >= NPE_MS && !reduced;
      ctx.fillStyle = reduced ? 'rgba(0,0,0,0.6)' : breathing ? `rgba(0,0,0,${(0.86 + 0.14 * Math.sin((rel - NPE_MS) / 700)).toFixed(3)})` : '#000';
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
      this.leaks = [{ start: now, rects: this.entities(Math.floor(now), 10) }];
    }
    // Held, the leak keeps leaking: a few more copies every so often, up to a cap (none added under reduced motion).
    const holdLeak = this.held && (act === 'leak' || act === 'bitflip');
    const last = this.leaks[this.leaks.length - 1];
    if (holdLeak && act === 'leak' && !reduced && last && this.leaks.length < LEAK_BATCHES && now - last.start > LEAK_EVERY_MS) {
      this.leaks.push({ start: now, rects: this.entities(Math.floor(now), 5) });
    }
    this.leaks = this.leaks.filter((b) => holdLeak || now - b.start < LEAK_MS);
    for (const b of this.leaks) {
      // Held copies stop drifting and stay; released ones drift on and fade.
      const age = holdLeak ? Math.min(0.6, (now - b.start) / LEAK_MS) : (now - b.start) / LEAK_MS;
      ctx.globalAlpha = age < 0.6 ? 0.9 : 0.9 * (1 - (age - 0.6) / 0.4);
      b.rects.forEach(([x, y, w, h], k) => {
        const drift = (k % 3) * 2 + 5 + (reduced ? 0 : age * 18);
        ctx.drawImage(this.leakShot, x, y, w, h, Math.round(x - drift), Math.round(y + drift * 0.6), w, h);
      });
    }
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
    const form = this.formFor(layerId);
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
    const sustained = this.held || this.sustainedByDive();
    if (r && el > REACTION_MS[r.tier] && !sustained) this.reaction = undefined;
    const active = r && (el <= REACTION_MS[r.tier] || sustained) ? r.tier : undefined;
    // Past its first play-through and held by the reveal: loop calmly.
    const looping = active !== undefined && el > REACTION_MS[active];
    const ctx = this.ctx;

    switch (active) {
      case 'off-by-one':
        // Lands one cell off, then snaps back. Held, it keeps stepping between its true spot and one cell off.
        // A steady two-step: one cell off, back to its true spot, one cell off… (one cell off and still, when reduced).
        x += reduced || Math.floor(el / 300) % 2 === 0 ? -8 : 0;
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
          // The smear trails off to the side (not upward, where the reveal puts the tier's name).
          drawSprite(ctx, spr, p.x - (k + 1) * 6, p.y + (k % 2), fill, outline, alpha * (0.6 - k * 0.07));
        }
        visible = true;
        break;
      case 'race': {
        // Two cursors fight over the same spot.
        const spread = looping
          ? reduced
            ? 4
            : 6 * Math.abs(Math.sin(el / 140))
          : (1 - el / REACTION_MS.race) * 14 * (reduced ? 0.5 : Math.abs(Math.sin(el / 40)));
        drawSprite(ctx, spr, x - spread, y, fill, outline, alpha);
        x += spread;
        visible = true;
        break;
      }
      case 'heisenbug':
        // Only half there: it fades slowly in and out (never a blink, for flash safety).
        alpha *= reduced ? 0.45 : 0.3 + 0.4 * (Math.sin(el / 380) * 0.5 + 0.5);
        visible = true;
        break;
      case 'womm':
        // The fake-out: for a moment it flips like a Bit Flip…
        if (this.rf.cursor === 'flipped') {
          [fill, outline] = [invert(fill), invert(outline)];
          if (bitGlyph) {
            bit = bit ? 0 : 1;
            spr = bit ? SPRITES.bit1 : SPRITES.bit0;
          }
          visible = true;
          break;
        }
        // …then the comic letdown: it turns into the hourglass, thinks about it ("..."), and droops.
        const hel = el - WOMM.hourglass;
        spr = SPRITES.hourglass;
        fill = '#ffcf5a';
        outline = '#1b1b1b';
        alpha = 1;
        visible = true;
        if (hel > 500) {
          ctx.fillStyle = '#ffffff';
          ctx.font = FONT;
          ctx.fillText('.'.repeat(Math.min(3, 1 + Math.floor((hel - 500) / 250))), x + 9, y + 4);
        }
        if (hel > 600) y += 2;
        if (!reduced && Math.floor(hel / (hel > 1000 ? 600 : 220)) % 2 === 1) {
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
    const { cx, cy } = markCenter(spr, x, y);
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

/** A filled rectangle whose corners are cut in two pixel steps (a chunky rounded rectangle, no antialiasing). */
function steppedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: number) {
  const h2 = Math.round(c / 2);
  ctx.beginPath();
  ctx.moveTo(x + c, y);
  ctx.lineTo(x + w - c, y);
  ctx.lineTo(x + w - c, y + h2);
  ctx.lineTo(x + w - h2, y + h2);
  ctx.lineTo(x + w - h2, y + c);
  ctx.lineTo(x + w, y + c);
  ctx.lineTo(x + w, y + h - c);
  ctx.lineTo(x + w - h2, y + h - c);
  ctx.lineTo(x + w - h2, y + h - h2);
  ctx.lineTo(x + w - c, y + h - h2);
  ctx.lineTo(x + w - c, y + h);
  ctx.lineTo(x + c, y + h);
  ctx.lineTo(x + c, y + h - h2);
  ctx.lineTo(x + h2, y + h - h2);
  ctx.lineTo(x + h2, y + h - c);
  ctx.lineTo(x, y + h - c);
  ctx.lineTo(x, y + c);
  ctx.lineTo(x + h2, y + c);
  ctx.lineTo(x + h2, y + h2);
  ctx.lineTo(x + c, y + h2);
  ctx.closePath();
  ctx.fill();
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
