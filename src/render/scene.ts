import { ENDLESS_LAYERS, type Layer, type LayerId, type StackMode } from '../core/layers';
import { MODE_RULES, layersFor, layerIndexAt, maxDepthFor, rulesFor } from '../core/modes';
import type { TierId } from '../core/tiers';
import { look, reducedMotion } from '../looks';
import { enforce } from '../core/enforce';
import { FONT, SEAM_ART, SEAM_H, hash, type Art, type Band } from './art-common';
import { ENTITY_SPOTS, LAYER_ART_V4, MANUAL_TARGETS, ensureWorldV4, setActiveTopicV4, type ManualTarget } from './art-v4';
import { CRITTER_SPOTS, CritterSystem } from './critters';
import { MANUAL_RARITIES, entryForCritter, manualEntryById, manualStore } from '../game/manual';
import { tagsForQuestion } from './v4/topics';
import { FAR_F } from './v4/place';
import type { WorldSpecV4 } from './v4/world';
import { LAYER_PALETTE, quantizeRow, snapColor, type PaletteMode } from './palettes';
import { SPRITES, drawSprite, type Sprite } from './sprites';
import { CASCADE, LEAD_MS, bufferBlock, NO_REACTION, PAGE_FAULT, REACTION_MS, WOMM, reactionFrame, type NullionBannerState, type ReactionFrame } from './reaction-fx';
import { GLYPH_H, GLYPH_W, SPACE_W, WATERMARK_GLYPHS, lineWidth } from './v4/watermark';
import { CURSOR_FRAC, FORM_BY_LAYER, MARK_RX, MARK_RY, markCenter, markExtentY, pixelScale, type CursorForm } from './cursor-geom';
import { drawMiniNullion, type TitleGlitchEvent } from '../ui/title-logo';
import { sound } from '../audio/sound';

export { pixelScale } from './cursor-geom';

const TOP_PAD = 40;
/** The cursor sits in clear air this far down the screen, above the floating console. */


/**
 * Visual height decoupled from frame span: each layer gets a base height plus a little per frame, so a 3-frame
 * layer still reads as a place and a 105-frame Endless layer doesn't drag on.
 */
const LAYER_BASE_H = 160;

function buildLayerY(mode: StackMode): number[] {
  const stack = layersFor(mode);
  const perFrame = rulesFor(mode).layerPerFrameH;
  const ys = [TOP_PAD];
  for (let i = 1; i < stack.length; i++) {
    const span = stack[i]!.from - stack[i - 1]!.from;
    enforce(span > 0, 'layer thresholds must strictly increase');
    ys.push(Math.round(ys[i - 1]! + LAYER_BASE_H + span * perFrame));
  }
  return ys;
}

const LAYER_Y_BY_MODE = Object.fromEntries(
  (Object.keys(MODE_RULES) as StackMode[]).map((m) => [m, buildLayerY(m)]),
) as Record<StackMode, number[]>;
/** Index of the layer where kernel rain and auto scanlines start; Infinity for a mode without them. */
const KERNEL_INDEX_BY_MODE = Object.fromEntries(
  (Object.keys(MODE_RULES) as StackMode[]).map((m) => {
    const id = MODE_RULES[m].kernelLayerId;
    return [m, id === null ? Infinity : layersFor(m).findIndex((l) => l.id === id)];
  }),
) as Record<StackMode, number>;

/** World y of a depth in frames: piecewise linear through the layer thresholds. Dives, camera and deep links all use it. */
export function worldY(depth: number, mode: StackMode = 'daily'): number {
  const stack = layersFor(mode);
  const ys = LAYER_Y_BY_MODE[mode];
  const i = layerIndexAt(Math.max(0, depth), mode);
  const l = stack[i]!;
  if (i === stack.length - 1) return ys[i]! + (depth - l.from) * rulesFor(mode).lastLayerPxPerFrame;
  const span = stack[i + 1]!.from - l.from;
  return ys[i]! + ((depth - l.from) / span) * (ys[i + 1]! - ys[i]!);
}

function bandTop(i: number, mode: StackMode = 'daily'): number {
  return i === 0 ? -1000 : LAYER_Y_BY_MODE[mode][i]! - 12;
}
function bandBottom(i: number, mode: StackMode = 'daily'): number {
  const stack = layersFor(mode);
  return i === stack.length - 1 ? worldY(maxDepthFor(mode), mode) + 2000 : bandTop(i + 1, mode);
}
function layerIndexAtWorldY(y: number, mode: StackMode = 'daily'): number {
  const stack = layersFor(mode);
  let idx = 0;
  for (let i = 0; i < stack.length; i++) if (y >= bandTop(i, mode)) idx = i;
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
const CROSS_FX: Record<string, CrossFx> = {
  syscall: 'tear',
  'VM exit': 'mirror',
  SMI: 'freeze',
  ME: 'onebit',
  // Endless-only boundaries.
  render: 'tear',
  parse: 'tear',
  compile: 'tear',
  dlopen: 'tear',
  IRQ: 'tear',
  DMA: 'tear',
  ACPI: 'tear',
  IPC: 'tear',
  M1: 'tear',
  '13.5nm': 'tear',
  '1.1eV': 'tear',
  virtio: 'mirror',
  EPT: 'mirror',
  TSEG: 'freeze',
  AMT: 'onebit',
  'μop': 'onebit',
  posedge: 'onebit',
  'kT ln 2': 'onebit',
  '1994': 'tear',
  '1978': 'tear',
};
for (const l of ENDLESS_LAYERS) if (l.boundary) enforce(CROSS_FX[l.boundary], `no crossing effect for boundary '${l.boundary}'`);
const CROSS_MS: Record<CrossFx, number> = { tear: 380, mirror: 650, freeze: 420, onebit: 520 };

function easeOutBack(p: number): number {
  const c1 = 1.25;
  const c3 = c1 + 1;
  return 1 + c3 * (p - 1) ** 3 + c1 * (p - 1) ** 2;
}
const easeOutCubic = (p: number) => 1 - (1 - p) ** 3;

const VIGNETTE_MS = 260;
/** The page-fault reaction's page size in scene pixels (a fixed grid). */
const PAGE_W = 64;
const PAGE_H = 36;
const BAYER16 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];



/**
 * The screen mirrors the cursor's tier reaction. The scene does the canvas side (black-out, leaked copies,
 * racing props, the frozen clock); the HUD reads this each frame and does the rest (grey, invert, racing panels).
 */
export interface ScreenFx {
  /** 0..~2.6: entities jiggle out of sync (Race condition, Heisenbug, WOMM buildup). Always 0 under reduced motion. */
  jiggle: number;
  /** World clock & floating panels lock dead still in place. */
  freeze: boolean;
  /** Works on my machine: the world washes into grayscale. */
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
  readonly fx: ScreenFx = { jiggle: 0, freeze: false, hang: false, flip: 'none' };
  /** Page-aligned cells (grid col, row) the page-fault reaction opens near the cursor, in order. */
  private faultPages: [number, number][] = [];
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
  private bufCopy = new Uint8ClampedArray(0);
  private rain: { y: number; speed: number }[] = [];
  /** Living System Biosphere critters (unique per layer, animated on artTime, spatial SFX). */
  private critters = new CritterSystem();
  /** Cursor morph flash when crossing into a layer with a different cursor form. */
  private lastForm: CursorForm | undefined;
  private morphStart = -Infinity;
  /** Brief vertical landing thud after a big dive (>= 5 frames). */
  private landThudStart = -Infinity;
  private landThudMag = 0;
  /** Rejected-guess fault flash + nudge on the cursor. */
  private rejectStart = -Infinity;
  /** Watchdog low-time state: tightens the cursor brackets and shifts them to fault-red. */
  private lowTime = false;
  /**
   * Works-on-my-machine rigid scroll: binds far and near z-layers together while the hung screen is forced
   * downward, then eases the far plane back to its natural parallax position when released (unless end-of-day).
   */
  private wommBound = false;
  private wommAnchorCamY = 0;
  private farShift = 0;
  private farReleasing = false;
  /** Active title-screen glitch echoes reflected in the live world behind the wordmark. */
  private titleBurst: (TitleGlitchEvent & { start: number }) | undefined;
  private titleGhosts: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    fill: string;
    outline: string;
    pxSize: 1 | 2;
    flipped: boolean;
    start: number;
    dur: number;
  }[] = [];
  private titleDrips: { x: number; y: number; vy: number; color: string; start: number; dur: number }[] = [];
  private titleHex: { x: number; y: number; text: string; start: number; dur: number }[] = [];

  /**
   * v4's world seed: the puzzle number by default (main.ts), so everyone sees the same world on a given day.
   * Placement runs once per seed and viewport width, never per frame.
   */
  private stackMode: StackMode = 'daily';
  private worldSeed = 1;
  private scatterSeed = 1;
  /** CSS pixels at the right edge covered by debug UI (the demo rail); v4 drops entities under it. 0 in production. */
  uiReserveRightCss = 0;
  /** Pointer position in scene pixels for Field Manual hover & click discovery. */
  private hoverScene: { x: number; y: number } | undefined;
  /** Floating in-world toasts when a player clicks & logs a Field Manual character. */
  private manualToasts: { x: number; y: number; text: string; color: string; at: number }[] = [];

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
    this.bindManualPointer();
  }

  private bindManualPointer() {
    const toScene = (ev: PointerEvent): { x: number; y: number } | undefined => {
      if (this.W <= 0 || this.H <= 0) return undefined;
      const rect = this.canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return undefined;
      return {
        x: ((ev.clientX - rect.left) / rect.width) * this.W,
        y: ((ev.clientY - rect.top) / rect.height) * this.H,
      };
    };
    this.canvas.addEventListener('pointermove', (ev) => {
      const pt = toScene(ev);
      this.hoverScene = pt;
      const hit = pt ? this.hitManualTarget(pt.x, pt.y) : undefined;
      this.canvas.style.cursor = hit ? 'pointer' : '';
    });
    this.canvas.addEventListener('pointerleave', () => {
      this.hoverScene = undefined;
      this.canvas.style.cursor = '';
    });
    this.canvas.addEventListener('pointerdown', (ev) => {
      if (ev.button !== 0) return;
      const pt = toScene(ev);
      if (!pt) return;
      const hit = this.hitManualTarget(pt.x, pt.y);
      if (!hit) return;
      // Don't steal focus from the answer input while logging a background specimen!
      ev.preventDefault();
      const entry = manualEntryById(hit.entryId);
      if (!entry) return;
      const res = manualStore.log(hit.entryId, hit.layer);
      const meta = MANUAL_RARITIES[entry.rarity];
      const msg = res.isNewEntry
        ? `Logged: ${entry.name}!`
        : res.isNewLayer
          ? `${entry.name} · new layer!`
          : `${entry.name} · logged`;
      this.manualToasts.push({
        x: hit.x + hit.w / 2,
        y: Math.max(18, hit.y - 4),
        text: msg,
        color: res.isNewEntry || res.isNewLayer ? meta.color : '#cfcbd8',
        at: performance.now(),
      });
      if (res.isNewEntry || res.isNewLayer) sound.suggest(hit.layer);
    });
  }

  private hitManualTarget(sx: number, sy: number): ManualTarget | undefined {
    // Under the reveal's vignette the world is covered: nothing in it can be hovered or collected. The reveal's
    // "hide" button lifts the vignette to collect props there.
    if (this.vignette.on) return undefined;
    const pad = 2;
    // Critters take priority since they move over props.
    for (let i = CRITTER_SPOTS.length - 1; i >= 0; i--) {
      const c = CRITTER_SPOTS[i]!;
      if (sx >= c.x - pad && sx <= c.x + c.w + pad && sy >= c.y - pad && sy <= c.y + c.h + pad) {
        const hit = entryForCritter(c.layer);
        if (hit) return { x: c.x, y: c.y, w: c.w, h: c.h, entryId: hit.entry.id, layer: hit.layer };
      }
    }
    for (let i = MANUAL_TARGETS.length - 1; i >= 0; i--) {
      const t = MANUAL_TARGETS[i]!;
      if (sx >= t.x - pad && sx <= t.x + t.w + pad && sy >= t.y - pad && sy <= t.y + t.h + pad) {
        return t;
      }
    }
    return undefined;
  }

  private started = false;
  /** Full-bleed: internal resolution is the viewport at an integer pixel scale, so pixels stay square and crisp. */
  private resize() {
    const vw = window.innerWidth;
    // Use the full layout viewport height so opening/animating a mobile virtual keyboard doesn't shrink the canvas
    // and expose black background underneath when the keyboard dismisses.
    const vh = Math.max(window.innerHeight, document.documentElement.clientHeight || 0);
    // A hidden or not-yet-laid-out frame has no area: an expected state. Draw nothing until a resize gives it some.
    if (vw <= 0 || vh <= 0) {
      this.W = 0;
      this.H = 0;
      return;
    }
    const scale = pixelScale(vw);
    const nextW = Math.ceil(vw / scale);
    const nextH = Math.ceil(vh / scale);
    // Never wipe the canvas buffers when the integer scene dimensions didn't actually change (common on mobile
    // keyboard/URL-bar resize events, which otherwise flash the canvas solid black until the next rAF).
    if (nextW === this.W && nextH === this.H) return;
    this.W = nextW;
    this.H = nextH;
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
    // Repaint synchronously right after buffer reallocation so mobile browsers never composite a cleared black canvas.
    if (this.started) this.frame(performance.now());
  }

  /** Switch between the 10-layer Daily stack and the 29-layer Endless stack. */
  setStackMode(mode: StackMode) {
    if (this.stackMode === mode) return;
    this.stackMode = mode;
    this.lastLayer = 0;
    this.lastForm = undefined;
  }

  get mode(): StackMode {
    return this.stackMode;
  }

  /**
   * Reseed v4's world. `seed` anchors the major set pieces (iconic landmarks for the day);
   * optional `scatterSeed` varies minor props & far-plane scatter freshly per run.
   */
  setWorldSeed(seed: number, scatterSeed: number = seed) {
    enforce(Number.isInteger(seed), `world seed must be an integer, got ${seed}`);
    enforce(Number.isInteger(scatterSeed), `scatter seed must be an integer, got ${scatterSeed}`);
    this.worldSeed = seed;
    this.scatterSeed = scatterSeed;
  }

  get seed() {
    return this.worldSeed;
  }

  /** Notify v4 of the active question so a subset of near-plane props flip in place to match its topic tags. */
  setQuestionTopic(questionId: string | undefined, roundSeed: number) {
    setActiveTopicV4(questionId ? tagsForQuestion(questionId) : undefined, roundSeed);
  }

  /**
   * Everything v4 placement depends on, in scene pixels. It depends on the width only (never the height), so a
   * mobile URL bar showing or hiding doesn't reshuffle the world.
   * - The cursor lane is the column the cursor descends through.
   * - Panel lanes are the x-spans of the console card and the two header chips (see style.css): the world scrolls
   *   under them, so only small props may sit there and anchors stay out.
   * - The tier reveal is DOM text over the middle of the screen; rather than carve a hole
   *   for them, v4 lowers its density uniformly on narrow screens, where that text spans most of the width.
   */
  private worldSpec(): WorldSpecV4 {
    const W = this.W;
    const vw = window.innerWidth;
    const scale = pixelScale(vw);
    const cx = Math.round(W / 2);
    const consoleHalf = Math.ceil(Math.min(520, vw - 32) / 2 / scale) + 3;
    const stack = layersFor(this.stackMode);
    const last = stack.length - 1;
    return {
      mode: this.stackMode,
      seed: this.worldSeed,
      scatterSeed: this.scatterSeed,
      W,
      bands: stack.map((_, i) => ({
        // The first band reaches far above anything the camera shows, and the last far below: clamp both to view.
        top: i === 0 ? TOP_PAD - 180 : bandTop(i, this.stackMode),
        bottom: i === last ? worldY(maxDepthFor(this.stackMode), this.stackMode) + 320 : bandBottom(i, this.stackMode),
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
    const k = Math.max(0, Math.min(1, (now - this.vignette.at) / VIGNETTE_MS));
    this.vignette = { on, at: now - (1 - k) * VIGNETTE_MS };
  }

  /**
   * Hold the current tier reaction while the reveal is open: after its first play-through each reaction loops or
   * holds calmly (off-by-one toggles a cell, the hang and black-out hold, leaks keep accumulating up to a cap,
   * jiggle continues gently, Bit Flip holds its inversion). Releasing lets it end: leaked copies fade out.
   * Nothing strobes: inversions are entered once and held.
   */
  setHold(on: boolean, unstickZLayers = true) {
    if (on === this.held) return;
    this.held = on;
    if (on) return;
    const now = performance.now();
    for (const b of this.leaks) b.start = Math.min(b.start, now - 0.6 * LEAK_MS);
    if (this.wommBound) {
      this.wommBound = false;
      // On "Unwind further" (when not the last round), ease the bound z-layers to where they should have scrolled.
      this.farReleasing = unstickZLayers;
    }
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
    const m = markExtentY(this.formFor(layersFor(this.stackMode)[layerIndexAt(this.depth, this.stackMode)]!.id), this.cursorY);
    return { top: m.top * scale, bottom: m.bottom * scale };
  }

  /**
   * The reveal's backdrop as the frame buffer degrading on purpose: the picture behind the cursor drops to coarser
   * and coarser blocks (1 → 2 → 4 → 8 over VIGNETTE_MS, and back on release), is quantised to the layer's own palette
   * (the final colour-depth pass does this for the layers that have one; full-colour rows get a coarse 3-level
   * palette), and is dimmed by ordered dither (black pixels at a density that deepens toward the middle) instead of
   * flat bands. The cursor, tier name and answer are drawn after and stay crisp. Reduced motion jumps to the end state.
   */
  private drawRevealBuffer(now: number, reduced: boolean, camY: number, stack: readonly Layer[]) {
    const v = this.vignette;
    const k = reduced ? 1 : Math.max(0, Math.min(1, (now - v.at) / VIGNETTE_MS));
    const a = v.on ? k : 1 - k;
    if (a <= 0) return;
    const { W, H } = this;
    const ctx = this.ctx;
    const bs = bufferBlock(a);
    const img = ctx.getImageData(0, 0, W, H);
    const d = img.data;
    // Blocks sample the untouched frame, so read from a copy while the buffer is rewritten in place.
    if (this.bufCopy.length !== d.length) this.bufCopy = new Uint8ClampedArray(d.length);
    this.bufCopy.set(d);
    const src = this.bufCopy;
    const cx = Math.round(W / 2);
    const cy = Math.round(this.cursorY);
    // Compact solid-black core hugs the tier name & answer text; outside it, darkness feathers quickly across
    // all 16 Bayer levels to a light outer stipple so the pixel-art world remains clearly visible around the edges.
    const innerW = Math.min(Math.round(W * 0.28), 118);
    const innerH = Math.round(H * 0.19);
    const featherX = Math.max(32, Math.round(W * 0.16));
    const featherY = Math.max(26, Math.round(H * 0.15));
    const outerDim = 0.12;
    const quantised = look('palette') === 'per-layer';
    for (let y = 0; y < H; y++) {
      const sy = Math.min(H - 1, y - (y % bs) + (bs >> 1));
      const dy = Math.max(0, (Math.abs(y - cy) - innerH) / featherY);
      const bRow = (y & 3) * 4;
      for (let x = 0; x < W; x++) {
        const sx = Math.min(W - 1, x - (x % bs) + (bs >> 1));
        const si = (sy * W + sx) * 4;
        const i = (y * W + x) * 4;
        const dx = Math.max(0, (Math.abs(x - cx) - innerW) / featherX);
        const t = Math.min(1, Math.hypot(dx, dy));
        const smooth = t * t * (3 - 2 * t);
        const dark = (1 - smooth * (1 - outerDim)) * a;
        if (BAYER16[bRow + (x & 3)]! < dark * 16) {
          d[i] = 0;
          d[i + 1] = 0;
          d[i + 2] = 0;
        } else {
          d[i] = src[si]!;
          d[i + 1] = src[si + 1]!;
          d[i + 2] = src[si + 2]!;
        }
      }
      // Full-colour rows have no palette to fall to: give them a coarse one so the degrade still reads.
      const li = layerIndexAtWorldY(camY + y, this.stackMode);
      if (!quantised || LAYER_PALETTE[stack[li]!.id] === 'full') quantizeRow(d, y * W * 4, W, y, 'rgb4', true);
    }
    ctx.putImageData(img, 0, 0);
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
    sound.playTier(tier, layersFor(this.stackMode)[layerIndexAt(this.depth, this.stackMode)]!.id);
    const seed = Math.floor(now);
    if (tier === 'leak' && leakNow) this.leakPending = true;
    this.cascadeLeaked = false;
    if (tier === 'npe' || tier === 'bitflip' || tier === 'womm') this.faultPages = this.pickFaultPages(seed);
  }

  /**
   * Reflect a title-screen wordmark glitch into the live background sky: mini "nullion" ghosts,
   * drifting pixels, hex tags, localized palette drops, tears, voids, and prop shudders.
   */
  triggerTitleGlitch(ev: TitleGlitchEvent) {
    if (reducedMotion() || this.W === 0) return;
    const now = performance.now();
    this.titleBurst = { ...ev, start: now };
    const { W, H } = this;
    const cx = Math.round(W / 2);

    // Spawn small drifting "nullion" ghost clones in the sky for mini-ghosts, stack-echo, and occasionally bitflip.
    if (ev.kind === 'mini-ghosts' || ev.kind === 'stack-echo' || (ev.kind === 'bitflip' && hash(ev.seed) > 0.45)) {
      const count = ev.kind === 'mini-ghosts' ? 4 : 1;
      const fills = ['#ebe6d6', '#5fd3e0', '#ffb000', '#c58bff', '#8cff9c', '#ff6ad5'];
      for (let k = 0; k < count; k++) {
        const s = ev.seed + k * 29;
        const pxSize: 1 | 2 = hash(s + 1) > 0.72 ? 2 : 1;
        const w = 28 * pxSize;
        // Scatter around the sky, favouring the left/right flanks and upper-mid sky around the title.
        let gx = Math.round(8 + hash(s + 2) * Math.max(8, W - w - 16));
        let gy = Math.round(14 + hash(s + 3) * Math.max(12, H * 0.72));
        if (ev.kind === 'stack-echo') {
          gx = Math.max(6, Math.min(W - w - 6, cx - Math.round(w / 2) + Math.round((hash(s + 4) - 0.5) * 30)));
          gy = Math.max(12, this.cursorY - 26 + k * 14);
        }
        this.titleGhosts.push({
          x: gx,
          y: gy,
          vx: (hash(s + 5) - 0.5) * 14,
          vy: 5 + hash(s + 6) * 12,
          fill: fills[Math.floor(hash(s + 7) * fills.length)]!,
          outline: '#0d0b12',
          pxSize,
          flipped: ev.kind === 'bitflip' || hash(s + 8) > 0.55,
          start: now,
          dur: 1100 + hash(s + 9) * 900,
        });
      }
      if (this.titleGhosts.length > 12) this.titleGhosts.splice(0, this.titleGhosts.length - 12);
    }

    if (ev.kind === 'pixel-rain') {
      const colors = ['#ebe6d6', '#5fd3e0', '#ffb000', '#ffffff'];
      for (let k = 0; k < 14; k++) {
        const s = ev.seed + k * 13;
        this.titleDrips.push({
          x: Math.round(cx + (hash(s + 1) - 0.5) * Math.min(W * 0.7, 160)),
          y: Math.max(6, this.cursorY - 45 + Math.round(hash(s + 2) * 28)),
          vy: 28 + hash(s + 3) * 36,
          color: colors[k % colors.length]!,
          start: now,
          dur: 700 + hash(s + 4) * 500,
        });
      }
      if (this.titleDrips.length > 28) this.titleDrips.splice(0, this.titleDrips.length - 28);
    }

    if (ev.kind === 'hex-corrupt') {
      const addrs = ['0x0000', '0x7F00', '0xDEAD', '0xNULL', '0xFF01', '0x0007', '0xCAFE'];
      for (let k = 0; k < 2; k++) {
        const s = ev.seed + k * 31;
        this.titleHex.push({
          x: Math.round(12 + hash(s + 1) * Math.max(10, W - 56)),
          y: Math.round(18 + hash(s + 2) * Math.max(12, H * 0.7)),
          text: addrs[Math.floor(hash(s + 3) * addrs.length)]!,
          start: now,
          dur: 720,
        });
      }
      if (this.titleHex.length > 6) this.titleHex.splice(0, this.titleHex.length - 6);
    }

    if (ev.kind === 'stack-echo') {
      this.swayAmp = Math.max(this.swayAmp, 0.35);
    }
  }

  /** Clear any active title-screen background artifacts (called when diving into round 1 or entering scroll mode). */
  clearTitleGlitches() {
    this.titleBurst = undefined;
    this.titleGhosts.length = 0;
    this.titleDrips.length = 0;
    this.titleHex.length = 0;
  }

  /** Tactile cursor feedback on a rejected guess: fault-red flash and quick horizontal nudge. */
  rejectNudge() {
    this.rejectStart = performance.now();
  }

  /** Watchdog low-time cue on the cursor's corner brackets (tighten + shift to fault-red). */
  setLowTime(on: boolean) {
    this.lowTime = on;
  }

  /**
   * Title-screen plunge: when the player presses "Unwind the stack", the cursor dips into Application with a
   * brief sway and a few rising bubbles, then settles back to depth 0. No-op under reduced motion.
   */
  introDive() {
    this.clearTitleGlitches();
    if (reducedMotion()) return;
    this.depth = 0.7;
    this.cam = 0;
    this.target = 0;
    this.swayAmp = 0.9;
    const cx = Math.round(this.W / 2);
    for (let i = 0; i < 5; i++) {
      this.bubbles.push({
        x: cx + Math.round((hash(i * 17 + 3) - 0.5) * 14),
        y: this.cursorY + Math.round(hash(i * 23 + 7) * 10),
        age: i * 0.08,
      });
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
    if (d.react === 'womm') {
      // Lock all z-layers together at the moment WOMM's forced scroll starts.
      this.wommBound = true;
      this.farReleasing = false;
      this.wommAnchorCamY = Math.round(worldY(this.cam, this.stackMode) - this.cursorY);
      this.farShift = 0;
    } else if (this.wommBound) {
      this.wommBound = false;
      this.farReleasing = true;
    }
    if (d.react) {
      sound.playDive(Math.round(d.to - d.from), d.react, layersFor(this.stackMode)[layerIndexAt(this.depth, this.stackMode)]!.id, d.dur);
    }
  }

  private land(d: Dive, now: number) {
    this.dive = undefined;
    this.depth = d.to;
    if (d.to - d.from >= 5 && !reducedMotion()) {
      this.landThudStart = now;
      this.landThudMag = d.to - d.from >= 10 ? 3 : 2;
    }
    if (d.react) sound.playLand(Math.round(d.to - d.from), d.react, layersFor(this.stackMode)[layerIndexAt(this.depth, this.stackMode)]!.id);
    if (d.react === 'leak') this.leakPending = true;
    d.onLand?.();
    if (d.pop) this.pops.push({ ...d.pop, start: now });
    if (this.queue.length) this.queueAt = now + 140;
    else if (this.onQueueDone) this.finishQueue();
  }

  start() {
    this.started = true;
    const loop = (now: number) => {
      requestAnimationFrame(loop);
      this.frame(now);
    };
    requestAnimationFrame(loop);
  }

  private frame(now: number) {
    const { W, H } = this;
    if (W === 0) return;
    const dt = Math.min(0.1, this.lastNow ? (now - this.lastNow) / 1000 : 0);
    this.lastNow = now;
    const reduced = reducedMotion();
    const art = LAYER_ART_V4;
    ensureWorldV4(this.worldSpec());
    this.critters.ensureSeed(this.scatterSeed);

    // Move the cursor: a dive (eased, with a small overshoot), or a glide toward the target.
    if (!this.dive && this.queue.length && now >= this.queueAt) this.startDive({ ...this.queue.shift()!, start: now });
    const dv = this.dive;
    if (dv && now < dv.start) {
      // The lead: the tier's notable part plays where the cursor is, before it sinks.
    } else if (dv) {
      if (!dv.moving) this.beginMoving(dv);
      const p = Math.min(1, (now - dv.start) / dv.dur);
      // WOMM forces a rigid linear-ish scroll with no playful overshoot.
      const ease = dv.react === 'womm' || reduced ? easeOutCubic(p) : easeOutBack(p);
      this.depth = Math.max(0, dv.from + (dv.to - dv.from) * ease);
      if (p >= 1) this.land(dv, now);
    } else {
      this.depth += (this.target - this.depth) * (1 - Math.exp(-dt * 2.5));
      if (Math.abs(this.target - this.depth) < 0.002) this.depth = this.target;
    }
    // The camera follows with a slight lag (none under reduced motion or during WOMM's rigid forced scroll).
    if (reduced || this.wommBound) this.cam = this.depth;
    else {
      this.cam += (this.depth - this.cam) * (1 - Math.exp(-dt * 5));
      if (Math.abs(this.depth - this.cam) < 0.002) this.cam = this.depth;
    }

    const stack = layersFor(this.stackMode);
    const kernelIdx = KERNEL_INDEX_BY_MODE[this.stackMode];
    const layerIdx = layerIndexAt(this.depth, this.stackMode);
    const layer = stack[layerIdx]!;
    if (layerIdx !== this.lastLayer) {
      // Crossing a boundary plays its effect: tearing at syscall, a mirror shimmer at VM exit, a freeze-frame at
      // SMI, the drop into 1-bit at ME. Every boundary label must have an entry in CROSS_FX.
      const crossed = stack[Math.max(layerIdx, this.lastLayer)]!;
      const fx: CrossFx | undefined = crossed.boundary
        ? (CROSS_FX[crossed.boundary] ?? rulesFor(this.stackMode).unlistedCrossFx)
        : undefined;
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
      sound.playLayerCross(layer.id);
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
    this.fx.freeze = rf.freeze;
    this.fx.hang = rf.hang;
    this.fx.jiggle = rf.jiggle;
    this.fx.flip = rf.flip;
    if ((act === 'bitflip' || act === 'womm') && rel >= CASCADE.leakAt && !this.cascadeLeaked) {
      this.cascadeLeaked = true;
      this.leakPending = true;
    }
    if (act === 'womm' && rel >= WOMM.freeze && this.leaks.length) {
      this.leaks.length = 0;
    }
    // Works on my machine and Ring −2 freeze the entire world clock (props, rain, cursor blink/brackets/sway, bubbles, ambience).
    const worldFrozen = frozen || this.fx.freeze || this.fx.hang;
    sound.setAmbienceFrozen(worldFrozen);
    if (!worldFrozen) this.artTime += dt;
    ENTITY_SPOTS.length = 0;
    MANUAL_TARGETS.length = 0;
    CRITTER_SPOTS.length = 0;

    const camWorldY = worldY(this.cam, this.stackMode);
    const camY = Math.round(camWorldY - this.cursorY);
    // Rigid z-layer binding during WOMM's forced scroll; eases smoothly back to natural parallax once released.
    if (this.wommBound) {
      this.farShift = -(camY - this.wommAnchorCamY) * (1 - FAR_F);
    } else if (this.farReleasing) {
      if (reduced) {
        this.farShift = 0;
        this.farReleasing = false;
      } else {
        this.farShift *= Math.exp(-dt * 6.5);
        if (Math.abs(this.farShift) < 0.2) {
          this.farShift = 0;
          this.farReleasing = false;
        }
      }
    }
    // Where the cursor sits relative to its resting row: below it while the camera catches up.
    this.cursorLead = Math.max(-50, Math.min(70, Math.round(worldY(this.depth, this.stackMode) - camWorldY)));
    const ctx = this.ctx;
    resetCtx(ctx);
    const band = (i: number): Band => ({
      top: bandTop(i, this.stackMode) - camY,
      bottom: bandBottom(i, this.stackMode) - camY,
      worldTop: bandTop(i, this.stackMode),
      camY,
      w: W,
      h: H,
      t: this.artTime,
      reduced,
      farShift: this.farShift,
    });

    // 1. Layer bands (+ living biosphere critters).
    for (let i = 0; i < stack.length; i++) {
      const b = band(i);
      if (b.bottom < 0 || b.top > H) continue;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, Math.max(0, b.top), W, Math.min(H, b.bottom) - Math.max(0, b.top));
      ctx.clip();
      const spotStart = ENTITY_SPOTS.length;
      art[stack[i]!.id](ctx, b);
      this.critters.drawBand(
        ctx,
        stack[i]!.id,
        b,
        i === layerIdx && !worldFrozen,
        (ev) => (ev.kind === 'exit' ? sound.playCritterExit(ev.layer, ev.pan) : sound.playCritter(ev.layer, ev.pan)),
        ENTITY_SPOTS,
        spotStart,
      );
      ctx.restore();
    }

    // 2. Boundaries: the upper layer frays down into the lower one, and hard boundaries get a structure.
    for (let i = 1; i < stack.length; i++) {
      const y = Math.round(bandTop(i, this.stackMode) - camY);
      if (y < -SEAM_H || y > H + 10) continue;
      const l = stack[i]!;
      this.drawSeam(art[stack[i - 1]!.id], band(i - 1), y);
      SEAM_ART[l.id]?.(ctx, y, band(i));
    }

    // 3. Rain (kernel and below).
    const rainMode = look('rain');
    if (rainMode !== 'off' && !reduced && layerIdx >= kernelIdx) {
      ctx.font = FONT;
      ctx.fillStyle = 'rgba(85,255,85,0.4)';
      this.rain.forEach((r, i) => {
        if (!worldFrozen) r.y = (r.y + r.speed * dt) % (H + 40);
        for (let k = 0; k < 4; k++) {
          const v = Math.floor(hash(i * 97 + k + Math.floor(r.y / 9)) * 256);
          const s = rainMode === 'hex' ? v.toString(16).padStart(2, '0') : '01<>/\\|=+*#%&'[v % 13]!;
          ctx.fillText(s, 4 + i * 14.5, r.y - k * 9 - 20);
        }
      });
    }

    // 3a. Subtle per-layer ambient particles (on artTime, so frozen states hold them still; off under reduced motion).
    this.drawAmbience(layer.id, reduced);

    // 3b. Speedlines on big dives (>= 5 frames: Race, Heisenbug, Bit Flip).
    if (dv && dv.moving && dv.to - dv.from >= 5 && !reduced && !worldFrozen) {
      this.drawSpeedlines(now, dv, layer.id);
    }

    // 3c. The screen mirrors the tier reaction in the world (the HUD adds grey, invert and racing panels from this.fx).
    // It sits under the vignette and the cursor: the mascot's own reaction always plays in front.
    this.drawReactionFx(now, act, reduced);

    // 3c. Title-screen background reflections: mini "nullion" ghosts, localized palette drops, tears, voids, drips.
    this.drawTitleGlitches(now, dt, reduced);

    // 4. Cursor: it sways only once a dive is actually moving (never during the lead or while frozen).
    const leading = dv !== undefined && now < dv.start;
    const speed = leading ? 0 : Math.abs(this.target - this.depth);
    const want = reduced || worldFrozen ? 0 : Math.min(1, speed / 2);
    // Rises quickly, decays slowly, so arriving leaves a couple of fading swings; locks dead still while frozen.
    if (!worldFrozen) {
      this.swayAmp += (want - this.swayAmp) * (1 - Math.exp(-dt * (want > this.swayAmp ? 5 : 1.1)));
    }
    if (reduced) this.swayAmp = 0;
    const swayDt = worldFrozen ? 0 : dt;
    this.swayPhase += swayDt * 3.1;
    // The reveal's vignette dims the middle beneath the cursor pass, so the cursor and its reaction play in front of it.
    this.drawRevealBuffer(now, reduced, camY, stack);
    this.drawBubbles(swayDt, speed, reduced, layer.id);
    this.drawCursor(now, layer.id, reduced);
    this.drawPops(now, layer.id, reduced);

    // 5. Color depth: quantize each row by the layer it shows, so the next layer's palette visibly approaches.
    if (look('palette') === 'per-layer') {
      const img = ctx.getImageData(0, 0, W, H);
      const dither = look('dither') === 'bayer';
      for (let y = 0; y < H; y++) {
        const li = layerIndexAtWorldY(camY + y, this.stackMode);
        quantizeRow(img.data, y * W * 4, W, y, LAYER_PALETTE[stack[li]!.id], dither);
      }
      ctx.putImageData(img, 0, 0);
    }

    // 5b. "ONE IN A / NULLION" dramatic buildup (Bit Flip climax & Works on my machine fake-out).
    if (this.rf.banner) this.drawNullionBanner(now, this.rf.banner, reduced);

    // 5c. Field Manual hover reticle, rarity pill, subtle "click me!" breadcrumb, and catch toasts.
    this.drawManualOverlay(now, reduced);

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

    // 7. Scanlines (softened/skipped in 1-bit Ring −3 so crisp white verticals don't zebra-stripe).
    const sl = look('scanlines');
    const isOneBit = layer.id === 'ring-3';
    if (sl === 'always' || (sl === 'auto' && layerIdx >= kernelIdx && !isOneBit)) {
      ctx.fillStyle = isOneBit ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.3)';
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
   * On-screen "entities" for reactions: v4 reports the exact boxes of the props it drew; with none on screen, a
   * seeded scatter of cells stands in.
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
    for (let k = 0; out.length < n && k < n * 4; k++) {
      const x = Math.floor(hash(seed + k * 7) * (this.W - 24));
      const y = Math.floor(hash(seed + k * 7 + 1) * (this.H - 20));
      if (x < 0 || y < 0 || x + 24 > this.W || y + 20 > this.H) continue;
      out.push([x, y, 24, 20]);
    }
    return out;
  }

  /**
   * The page grid: cells of PAGE_W × PAGE_H scene pixels anchored at the screen's corner (a fixed grid, like 4 KiB
   * pages). The run's pages are the cursor's neighbours, in a seeded order; the cursor itself is drawn over them.
   */
  private pickFaultPages(seed: number): [number, number][] {
    const col = Math.floor(this.W / 2 / PAGE_W);
    const row = Math.floor(this.cursorY / PAGE_H);
    const ring: [number, number][] = [];
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) ring.push([col + dx, row + dy]);
    ring.sort((a, b) => hash(seed + a[0] * 31 + a[1] * 17) - hash(seed + b[0] * 31 + b[1] * 17));
    return ring.slice(0, PAGE_FAULT.pages);
  }

  /**
   * Each page is a void with a crisp 1px outline of what was there (the pixels under the border are left alone),
   * a faint hex dump inside, and, on the first page, a SIGSEGV tag. Partial cover is an ordered-dither dissolve.
   */
  private drawPageFaults(covers: number[]) {
    const ctx = this.ctx;
    ctx.font = FONT;
    this.faultPages.forEach(([col, row], i) => {
      const c = covers[i] ?? 0;
      if (c <= 0) return;
      const x0 = col * PAGE_W;
      const y0 = row * PAGE_H;
      if (x0 + PAGE_W <= 0 || y0 + PAGE_H <= 0 || x0 >= this.W || y0 >= this.H) return;
      ctx.fillStyle = '#000';
      if (c >= 1) ctx.fillRect(x0 + 1, y0 + 1, PAGE_W - 2, PAGE_H - 2);
      else
        for (let y = y0 + 1; y < y0 + PAGE_H - 1; y++)
          for (let x = x0 + 1; x < x0 + PAGE_W - 1; x++) if (BAYER16[(y & 3) * 4 + (x & 3)]! < c * 16) ctx.fillRect(x, y, 1, 1);
      if (c < 1) return;
      ctx.fillStyle = '#3c3c3c';
      for (let r = 0; r < 3; r++) ctx.fillText('00 00 00 00', x0 + 4, y0 + 17 + r * 9, PAGE_W - 8);
      if (i === 0) {
        ctx.fillStyle = '#b01818';
        ctx.fillRect(x0 + 1, y0 + 1, 46, 9);
        ctx.fillStyle = '#ffd0d0';
        ctx.fillText('SIGSEGV', x0 + 3, y0 + 8);
      }
    });
  }

  private drawReactionFx(now: number, act: TierId | undefined, reduced: boolean) {
    const ctx = this.ctx;
    // Null pointer: dereferencing an unmapped page. Page-aligned voids open near the cursor, then fault back in.
    if (this.rf.pages.length) this.drawPageFaults(this.rf.pages);
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

  /**
   * "ONE IN A / NULLION" dramatic pixel sequence shared by Bit Flip and Works on my machine:
   * dims the background so only the centered words command the stage, sparkles each row into existence
   * with rapid TitleLogo-style slice/chroma glitches, then either snaps crisp & inverted into Bit Flip's
   * +13 dive or freezes dead still for Works on my machine's fake-out.
   */
  private drawNullionBanner(now: number, b: NullionBannerState, reduced: boolean) {
    const ctx = this.ctx;
    const { W, H } = this;
    if (b.dim > 0) {
      ctx.fillStyle = `rgba(6, 5, 10, ${b.dim.toFixed(3)})`;
      ctx.fillRect(0, 0, W, H);
    }

    const row1 = 'ONE IN A';
    const row2 = 'NULLION';
    const s1 = Math.max(1, Math.min(4, Math.floor((W * 0.76) / lineWidth(row1))));
    const s2 = Math.max(2, Math.min(6, Math.floor((W * 0.84) / lineWidth(row2))));
    const h1 = GLYPH_H * s1;
    const h2 = GLYPH_H * s2;
    const gap = Math.max(6, Math.round(s2 * 2.2));
    const totalH = h1 + gap + h2;
    const y1 = Math.round(H * 0.44 - totalH / 2);
    const y2 = y1 + h1 + gap;

    // Crisp ~12Hz stepped glitch clock during buildup (restrained enough to stay immediately readable); locked still on WOMM freeze or Bit Flip climax.
    const glitching = !reduced && !b.locked;
    const tick = b.frozen ? 13 : Math.floor(now / 85);

    const drawRow = (text: string, scale: number, y0: number, progress: number, seedBase: number, mainCol: string) => {
      if (progress <= 0) return;
      const wPx = lineWidth(text) * scale;
      const x0 = Math.round((W - wPx) / 2);

      // Compute gentle per-row horizontal slice tear offsets so the words stay legible on first-time fake-outs.
      const rowShift: number[] = [];
      for (let r = 0; r < GLYPH_H; r++) {
        if (!glitching) {
          rowShift.push(0);
        } else {
          const h = hash(tick * 31 + seedBase + r * 17);
          rowShift.push(h > 0.87 ? (hash(tick * 19 + r * 23) > 0.5 ? 1 : -1) * scale : 0);
        }
      }

      const chromaOff = glitching && hash(tick * 13 + seedBase) > 0.58 ? 1 : 0;

      let cx = x0;
      for (let ci = 0; ci < text.length; ci++) {
        const ch = text[ci]!;
        if (ch === ' ') {
          cx += SPACE_W * scale;
          continue;
        }
        const rows = WATERMARK_GLYPHS[ch];
        if (rows) {
          for (let r = 0; r < GLYPH_H; r++) {
            const row = rows[r]!;
            const sx = rowShift[r]!;
            for (let k = 0; k < GLYPH_W; k++) {
              if (row[k] !== '1') continue;
              const pixH = hash(seedBase + ci * 41 + r * 11 + k * 7);
              if (pixH > progress) continue;
              if (b.dissolve > 0 && pixH < b.dissolve) continue;

              let px = cx + k * scale + sx;
              let py = y0 + r * scale;
              if (b.dissolve > 0 && !reduced) {
                const drift = b.dissolve * 14;
                px += Math.round((hash(seedBase + ci * 13 + k) - 0.5) * drift);
                py -= Math.round(hash(seedBase + r * 19 + k) * drift);
              }

              const fresh = progress < 1 && progress - pixH < 0.16;
              // Crisp dark drop shadow
              ctx.fillStyle = '#000';
              ctx.fillRect(px + 1, py + 1, scale, scale);
              // Chromatic aberration ghosts during rapid glitch
              if (chromaOff > 0) {
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = '#5fd3e0';
                ctx.fillRect(px - chromaOff, py, scale, scale);
                ctx.fillStyle = '#ff6ad5';
                ctx.fillRect(px + chromaOff, py, scale, scale);
                ctx.globalAlpha = 1;
              }
              // Main pixel (flashes bright white/cyan at birth sparkle)
              ctx.fillStyle = fresh ? (pixH > 0.5 ? '#ffffff' : '#5fd3e0') : mainCol;
              ctx.fillRect(px, py, scale, scale);
              if (fresh && !reduced) {
                // Tiny + sparkle glint on newly materialized pixels
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(px - 1, py + Math.floor(scale / 2), 1, 1);
                ctx.fillRect(px + scale, py + Math.floor(scale / 2), 1, 1);
                ctx.fillRect(px + Math.floor(scale / 2), py - 1, 1, 1);
                ctx.fillRect(px + Math.floor(scale / 2), py + scale, 1, 1);
              }
            }
          }
        }
        cx += (GLYPH_W + 1) * scale;
      }
    };

    drawRow(row1, s1, y1, b.top, 101, b.locked ? '#ffffff' : '#ebe6d6');
    drawRow(row2, s2, y2, b.bottom, 307, b.locked ? '#ffe25a' : '#ffe25a');

    // Ambient sparkle pips around the words during buildup & climax.
    if (!reduced && (b.top > 0 || b.bottom > 0)) {
      const sparkCount = b.locked ? 18 : 12;
      for (let i = 0; i < sparkCount; i++) {
        const h1s = hash(tick * 29 + i * 53 + 7);
        const h2s = hash(tick * 43 + i * 71 + 11);
        const sx = Math.round(W * 0.1 + h1s * W * 0.8);
        const sy = Math.round(y1 - 14 + h2s * (totalH + 28));
        ctx.fillStyle = i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#ffe25a' : '#5fd3e0';
        ctx.fillRect(sx, sy, 1, 1);
        if (i % 4 === 0) {
          ctx.fillRect(sx - 1, sy, 3, 1);
          ctx.fillRect(sx, sy - 1, 1, 3);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  /**
   * Title-screen background reflections: draws mini "nullion" ghost clones, pixel drips, hex tags,
   * localized palette drops, horizontal tears, NPE voids, localized bit-flip patches, and prop shudders.
   */
  private drawTitleGlitches(now: number, dt: number, reduced: boolean) {
    if (reduced) {
      this.clearTitleGlitches();
      return;
    }
    const ctx = this.ctx;
    const { W, H } = this;

    // 1. Active burst effects on the live sky canvas
    const b = this.titleBurst;
    if (b && now - b.start >= b.dur) this.titleBurst = undefined;
    if (this.titleBurst) {
      const tb = this.titleBurst;
      const p = (now - tb.start) / tb.dur;
      switch (tb.kind) {
        case 'mirror-flip': {
          // Half-mirror shimmer across the vertical centerline of the live sky (left→right, then right→left).
          this.scratchCtx.drawImage(this.canvas, 0, 0);
          const mid = Math.floor(W / 2);
          const firstLeft = hash(tb.seed + 4) > 0.5;
          const mirrorLeftToRight = p < 0.5 ? firstLeft : !firstLeft;
          ctx.save();
          ctx.globalAlpha = 0.34 * Math.sin(p * Math.PI);
          ctx.translate(W, 0);
          ctx.scale(-1, 1);
          if (mirrorLeftToRight) {
            ctx.drawImage(this.scratch, 0, 0, mid, H, 0, 0, mid, H);
          } else {
            ctx.drawImage(this.scratch, mid, 0, W - mid, H, mid, 0, W - mid, H);
          }
          ctx.restore();
          break;
        }
        case 'race': {
          // Jiggle a handful of background props in sympathy with the title.
          this.scratchCtx.drawImage(this.canvas, 0, 0);
          const rects = this.entities(tb.seed, 14);
          rects.forEach(([x, y, w, h], i) => {
            const dx = Math.round(Math.sin(now / 38 + i * 1.9) * 2.2);
            const dy = Math.round(Math.cos(now / 44 + i * 2.3) * 1.4);
            if (dx || dy) ctx.drawImage(this.scratch, x, y, w, h, x + dx, y + dy, w, h);
          });
          break;
        }
        case 'heisenbug': {
          // Horizontal scanline tear slices across the sky.
          this.scratchCtx.drawImage(this.canvas, 0, 0);
          for (let k = 0; k < 3; k++) {
            const sy = Math.floor(hash(tb.seed + k * 7) * (H - 12));
            const sh = 2 + Math.floor(hash(tb.seed + k * 7 + 1) * 7);
            const dx = Math.round(Math.sin(p * Math.PI * 2 + k) * 9);
            ctx.drawImage(this.scratch, 0, sy, W, sh, dx, sy, W, sh);
          }
          break;
        }
        case 'npe': {
          // A small pixel-aligned void rectangle opens in the sky.
          const rw = Math.round(W * (0.12 + hash(tb.seed + 1) * 0.14));
          const rh = Math.round(H * (0.08 + hash(tb.seed + 2) * 0.1));
          const rx = Math.round(hash(tb.seed + 3) * Math.max(1, W - rw));
          const ry = Math.round(hash(tb.seed + 4) * Math.max(1, H - rh));
          ctx.fillStyle = '#000000';
          ctx.fillRect(rx, ry, rw, rh);
          ctx.fillStyle = '#8fb7ff';
          ctx.fillRect(rx, ry, Math.min(10, rw), 1);
          break;
        }
        case 'bitflip': {
          // Localized pixel-aligned inverted patch (clean single hold, never full-screen strobing).
          const rw = Math.round(W * (0.14 + hash(tb.seed + 1) * 0.16));
          const rh = Math.round(H * (0.08 + hash(tb.seed + 2) * 0.1));
          const rx = Math.round(hash(tb.seed + 3) * Math.max(1, W - rw));
          const ry = Math.round(hash(tb.seed + 4) * Math.max(1, H - rh));
          if (rw > 0 && rh > 0) {
            const img = ctx.getImageData(rx, ry, rw, rh);
            const d = img.data;
            for (let i = 0; i < d.length; i += 4) {
              d[i] = 255 - d[i]!;
              d[i + 1] = 255 - d[i + 1]!;
              d[i + 2] = 255 - d[i + 2]!;
            }
            ctx.putImageData(img, rx, ry);
            ctx.strokeStyle = '#ffe25a';
            ctx.strokeRect(rx + 0.5, ry + 0.5, rw - 1, rh - 1);
          }
          break;
        }
        case 'palette-drop': {
          // Foreshadow deeper layers: a horizontal band of the sky drops color depth cleanly.
          const mode: PaletteMode = tb.palette ?? 'cga4';
          const bh = Math.round(H * 0.24);
          const y0 = Math.max(0, Math.min(H - bh, Math.round(hash(tb.seed + 1) * (H - bh))));
          if (bh > 0) {
            const img = ctx.getImageData(0, y0, W, bh);
            for (let y = 0; y < bh; y++) quantizeRow(img.data, y * W * 4, W, y0 + y, mode, true);
            ctx.putImageData(img, 0, y0);
          }
          break;
        }
        default:
          break;
      }
    }

    // 2. Drifting mini "nullion" ghost variants in the sky
    this.titleGhosts = this.titleGhosts.filter((g) => now - g.start < g.dur);
    for (const g of this.titleGhosts) {
      g.x += g.vx * dt;
      g.y += g.vy * dt;
      const p = (now - g.start) / g.dur;
      const a = p < 0.15 ? (p / 0.15) * 0.72 : 0.72 * (1 - (p - 0.15) / 0.85);
      drawMiniNullion(ctx, g.x, g.y, g.fill, g.outline, Math.max(0, a), g.pxSize, g.flipped);
    }

    // 3. Detached falling pixels (pixel-rain)
    this.titleDrips = this.titleDrips.filter((d) => now - d.start < d.dur);
    for (const d of this.titleDrips) {
      d.y += d.vy * dt;
      const a = 1 - (now - d.start) / d.dur;
      ctx.globalAlpha = Math.max(0, a);
      ctx.fillStyle = '#000';
      ctx.fillRect(Math.round(d.x) + 1, Math.round(d.y) + 1, 2, 2);
      ctx.fillStyle = d.color;
      ctx.fillRect(Math.round(d.x), Math.round(d.y), 2, 2);
    }
    ctx.globalAlpha = 1;

    // 4. Floating hex addresses (hex-corrupt)
    this.titleHex = this.titleHex.filter((h) => now - h.start < h.dur);
    if (this.titleHex.length) {
      ctx.font = FONT;
      for (const h of this.titleHex) {
        const a = Math.sin(((now - h.start) / h.dur) * Math.PI) * 0.85;
        ctx.globalAlpha = Math.max(0, a);
        ctx.fillStyle = '#000';
        ctx.fillText(h.text, h.x + 1, h.y + 1);
        ctx.fillStyle = '#7ee0a1';
        ctx.fillText(h.text, h.x, h.y);
      }
      ctx.globalAlpha = 1;
    }
  }

  /**
   * Subtle layer-specific ambient particles on `artTime`: sky motes in Application, rising GC sparks in
   * Runtime/Libraries, horizontal IRQ pulses in Userspace/Kernel/Drivers, phosphor dust in Firmware/Ring −1,
   * frozen dust in Ring −2, stark 1-bit flecks in Ring −3. Off under reduced motion.
   */
  private drawAmbience(layerId: LayerId, reduced: boolean) {
    if (reduced) return;
    const ctx = this.ctx;
    const { W, H } = this;
    const t = this.artTime;
    const perLayer = look('palette') === 'per-layer';
    const pal = LAYER_PALETTE[layerId];
    const col = (hex: string) => (perLayer ? snapColor(hex, pal) : hex);
    const count = 12;

    ctx.save();
    for (let i = 0; i < count; i++) {
      const s1 = hash(i * 43 + 11);
      const s2 = hash(i * 67 + 23);
      const s3 = hash(i * 97 + 37);
      switch (layerId) {
        case 'application': {
          const x = Math.round(((s1 * W + t * (4 + s3 * 6)) % (W + 8)) - 4);
          const y = Math.round(s2 * H);
          ctx.globalAlpha = 0.45;
          ctx.fillStyle = col('#ffffff');
          ctx.fillRect(x, y, s3 > 0.65 ? 2 : 1, 1);
          break;
        }
        case 'runtime':
        case 'libraries': {
          const x = Math.round(s1 * W);
          const y = Math.round((((s2 * H - t * (10 + s3 * 14)) % H) + H) % H);
          ctx.globalAlpha = 0.55;
          ctx.fillStyle = col(i % 2 === 0 ? '#7ec8e3' : '#f5d76e');
          ctx.fillRect(x, y, 1, 1);
          break;
        }
        case 'userspace':
        case 'kernel':
        case 'drivers': {
          const dir = i % 2 === 0 ? 1 : -1;
          const speed = 28 + s3 * 42;
          const x = Math.round((((s1 * W + dir * t * speed) % (W + 12)) + (W + 12)) % (W + 12) - 6);
          const y = Math.round(s2 * H);
          if (i === 0 && Math.abs(x - W / 2) < 2) sound.playAmbientEvent(layerId);
          ctx.globalAlpha = 0.5;
          ctx.fillStyle = col(layerId === 'drivers' ? '#55ffff' : layerId === 'kernel' ? '#ffb000' : '#7ee0a1');
          ctx.fillRect(x, y, 3, 1);
          break;
        }
        case 'firmware':
        case 'ring-1': {
          const x = Math.round(s1 * W + Math.sin(t * 0.8 + i) * 3);
          const y = Math.round(((s2 * H + t * (5 + s3 * 6)) % H));
          ctx.globalAlpha = 0.45;
          ctx.fillStyle = col('#8cff9c');
          ctx.fillRect(x, y, 1, 1);
          break;
        }
        case 'ring-2': {
          const x = Math.round(s1 * W);
          const y = Math.round(s2 * H);
          ctx.globalAlpha = 0.4;
          ctx.fillStyle = col('#bebebe');
          ctx.fillRect(x, y, 1, 1);
          break;
        }
        case 'ring-3': {
          if (Math.floor(t * 3 + i * 1.7) % 3 !== 0) break;
          const x = Math.round(s1 * W);
          const y = Math.round(s2 * H);
          ctx.globalAlpha = 0.6;
          ctx.fillStyle = col('#e8eeff');
          ctx.fillRect(x, y, 1, 1);
          break;
        }
      }
    }
    ctx.restore();
  }

  /** Vertical 1px pixel speed-streaks rushing upward along the outer margins during big dives (>= 5 frames). */
  private drawSpeedlines(now: number, dv: Dive, layerId: LayerId) {
    const p = Math.min(1, (now - dv.start) / dv.dur);
    const env = Math.sin(p * Math.PI);
    if (env <= 0.05) return;
    const ctx = this.ctx;
    const { W, H } = this;
    const perLayer = look('palette') === 'per-layer';
    const pal = LAYER_PALETTE[layerId];
    const ink = perLayer ? snapColor('#ffffff', pal) : '#ffffff';
    const count = dv.to - dv.from >= 10 ? 14 : 10;
    const margin = Math.max(12, Math.round(W * 0.22));
    ctx.save();
    ctx.fillStyle = ink;
    for (let i = 0; i < count; i++) {
      const left = i % 2 === 0;
      const sx = left
        ? Math.round(4 + hash(i * 31 + 3) * (margin - 8))
        : Math.round(W - margin + 4 + hash(i * 31 + 3) * (margin - 8));
      const len = Math.round((8 + hash(i * 17 + 7) * 18) * env);
      const speed = 160 + hash(i * 23 + 11) * 180;
      const sy = Math.round((((hash(i * 41) * H - (now / 1000) * speed) % (H + len)) + (H + len)) % (H + len) - len);
      ctx.globalAlpha = (0.28 + hash(i * 13) * 0.35) * env;
      ctx.fillRect(sx, sy, 1, len);
    }
    ctx.restore();
  }

  /** "+N frames" and replay labels: pop off the cursor, float up and fade (only fade under reduced motion). */
  private drawPops(now: number, layerId: LayerId, reduced: boolean) {
    // Suppress the floating +N FRAME pop while the reveal overlay is open (avoids colliding with .rv-name).
    if (!this.pops.length || this.vignette.on) return;
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

  private drawCursor(now: number, layerId: LayerId, reduced: boolean) {
    const form = this.formFor(layerId);
    if (form !== this.lastForm) {
      if (this.lastForm !== undefined) {
        if (!reduced) this.morphStart = now;
        sound.playMorph(layerId);
      }
      this.lastForm = form;
    }
    const style = FORM_STYLE[form];
    // The bit is a 0/1 glyph that can't hold its value. It flickers on art time, so Ring −2's frozen time holds it too.
    let bit = reduced ? 1 : bitAt(this.artTime);
    const bitGlyph = form === 'bit';
    let spr: Sprite = bitGlyph ? (bit ? SPRITES.bit1 : SPRITES.bit0) : SPRITES[form];
    let fill = style.fill;
    let outline = style.outline;
    let alpha = style.alpha;
    let x = Math.round(this.W / 2 + this.swayAmp * 6 * Math.sin(this.swayPhase));
    let y = Math.round(this.cursorY + this.cursorLead + this.swayAmp * 2 * Math.sin(this.swayPhase * 2));
    // Landing impact thud after a big dive (>= 5 frames).
    if (!reduced && now - this.landThudStart < 180) {
      const tp = (now - this.landThudStart) / 180;
      y += Math.round(Math.sin(tp * Math.PI) * this.landThudMag * (1 - tp * 0.4));
    }
    // Rejected-guess feedback: brief fault-red flash + quick horizontal nudge in sync with the console shake.
    if (now - this.rejectStart < 220) {
      const rp = (now - this.rejectStart) / 220;
      if (!reduced) x += Math.round(Math.sin(rp * Math.PI * 5) * 3 * (1 - rp));
      fill = '#ff5f7a';
    }
    let visible = !(style.blink && !reduced && Math.floor((this.artTime * 1000) / 530) % 2 === 1);
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
   * The player's mark: a dark backing and four amber corner brackets with a black edge, snapped to the layer's
   * palette so they read on every layer, including 1-bit Ring −3. Tightens & turns fault-red on low time, and
   * flashes outward with pixel sparkles when the cursor morphs at a layer boundary.
   */
  private drawMark(now: number, spr: Sprite, x: number, y: number, layerId: LayerId, reduced: boolean) {
    const ctx = this.ctx;
    // Every cursor form shares one box: centred on the glyph, except a short glyph (the underscore) sits at the
    // bottom of the box, the way it sits at the bottom of a text cell.
    const { cx, cy } = markCenter(spr, x, y);
    const breathe = reduced ? 0 : Math.round((Math.sin((this.artTime * 1000) / 420) + 1) / 2);
    const morphRel = now - this.morphStart;
    const morphing = !reduced && morphRel >= 0 && morphRel < 240;
    const morphBump = morphing ? Math.round(Math.sin((morphRel / 240) * Math.PI) * 2) : 0;
    const tighten = this.lowTime ? -1 : 0;
    const rx = MARK_RX + breathe + morphBump + tighten;
    const ry = MARK_RY + breathe + morphBump + tighten;
    // Crisp blocked-out dark backing matching the square corner brackets (no round radial halo).
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(cx - rx - 2, cy - ry - 2, (rx + 2) * 2, (ry + 2) * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.72)';
    ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
    // Amber normally, fault-red on low time, bright white flash during cursor morph.
    const pal = LAYER_PALETTE[layerId];
    const perLayer = look('palette') === 'per-layer';
    const baseHex = morphing ? '#ffffff' : this.lowTime ? '#ff5f7a' : '#ffb000';
    const accent = !perLayer
      ? baseHex
      : pal === 'green' || pal === 'gray' || pal === 'onebit'
        ? snapColor('#ffffff', pal)
        : snapColor(baseHex, pal);
    for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as const) {
      const bx = cx + sx * rx;
      const by = cy + sy * ry;
      // Black edge first, then a 2px bracket on top: arms run inward from the corner.
      const ax = sx > 0 ? bx - 4 : bx;
      const ay = sy > 0 ? by - 4 : by;
      const hx = sx > 0 ? bx - 1 : bx;
      const hy = sy > 0 ? by - 1 : by;
      ctx.fillStyle = '#000';
      ctx.fillRect(ax - 1, hy - 1, 7, 4);
      ctx.fillRect(hx - 1, ay - 1, 4, 7);
      ctx.fillStyle = accent;
      ctx.fillRect(ax, hy, 5, 2);
      ctx.fillRect(hx, ay, 2, 5);
    }
    // Cursor morph pixel sparkles radiating from the bracket box.
    if (morphing) {
      const mp = morphRel / 240;
      const reach = Math.round(4 + mp * 8);
      ctx.fillStyle = accent;
      for (let k = 0; k < 6; k++) {
        const ang = (k / 6) * Math.PI * 2 + 0.35;
        const px = Math.round(cx + Math.cos(ang) * (rx + reach * 0.6));
        const py = Math.round(cy + Math.sin(ang) * (ry + reach * 0.6));
        ctx.fillRect(px, py, 1, 1);
      }
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

  /**
   * Field Manual in-world overlay (drawn post-quantization so rarity pills and hints stay crisp even in 1-bit Ring −3):
   * - Hover reticle + rarity/percentage/logged status pill.
   * - Occasional gentle "click me!" (or "?") tag above one visible uncollected prop so players discover the manual.
   * - Short floating catch toasts after clicking a character.
   */
  private drawManualOverlay(now: number, reduced: boolean) {
    const ctx = this.ctx;
    const W = this.W;
    const H = this.H;

    const drawPill = (cx: number, y: number, text: string, borderCol: string, textCol: string) => {
      ctx.font = FONT;
      const tw = Math.ceil(ctx.measureText(text).width);
      const pw = tw + 8;
      const ph = 11;
      const px = Math.max(4, Math.min(W - pw - 4, Math.round(cx - pw / 2)));
      const py = Math.max(4, Math.min(H - ph - 4, Math.round(y)));
      ctx.fillStyle = 'rgba(12, 10, 18, 0.94)';
      ctx.fillRect(px, py, pw, ph);
      ctx.fillStyle = borderCol;
      ctx.fillRect(px, py, pw, 1);
      ctx.fillRect(px, py + ph - 1, pw, 1);
      ctx.fillRect(px, py, 1, ph);
      ctx.fillRect(px + pw - 1, py, 1, ph);
      ctx.fillStyle = textCol;
      ctx.fillText(text, px + 4, py + 8);
    };

    const hit = this.hoverScene ? this.hitManualTarget(this.hoverScene.x, this.hoverScene.y) : undefined;
    if (hit) {
      const entry = manualEntryById(hit.entryId);
      if (entry) {
        const meta = MANUAL_RARITIES[entry.rarity];
        const found = manualStore.isFound(entry.id);
        const hasLayer = manualStore.hasLayer(entry.id, hit.layer);
        // Crisp 3px pixel corner brackets around the hovered specimen
        const bx = Math.round(hit.x) - 2;
        const by = Math.round(hit.y) - 2;
        const bw = Math.round(hit.w) + 4;
        const bh = Math.round(hit.h) + 4;
        ctx.fillStyle = hasLayer ? '#8ea8c3' : meta.color;
        ctx.fillRect(bx, by, 4, 1);
        ctx.fillRect(bx, by, 1, 4);
        ctx.fillRect(bx + bw - 4, by, 4, 1);
        ctx.fillRect(bx + bw - 1, by, 1, 4);
        ctx.fillRect(bx, by + bh - 1, 4, 1);
        ctx.fillRect(bx, by + bh - 4, 1, 4);
        ctx.fillRect(bx + bw - 4, by + bh - 1, 4, 1);
        ctx.fillRect(bx + bw - 1, by + bh - 4, 1, 4);

        // No % on the hover pill: the measured rate lives in the Field Manual (FIELD-MANUAL-PLAN.md).
        const label = hasLayer ? `${entry.name} · logged` : found ? `${entry.name} · new layer!` : `??? · ${meta.label} · click`;
        const pillY = by > 18 ? by - 13 : by + bh + 3;
        drawPill(bx + bw / 2, pillY, label, hasLayer ? '#68768a' : meta.color, hasLayer ? '#cfcbd8' : '#ffffff');
      }
    } else if (MANUAL_TARGETS.length > 0 && !this.rf.banner) {
      // Gentle occasional "click me!" breadcrumb above one visible uncollected prop (less frequent once player knows).
      const slot = Math.floor(now / 7000);
      const frac = (now % 7000) / 7000;
      const foundTotal = manualStore.foundCount();
      const showChance = foundTotal < 3 ? 0.55 : 0.22;
      if (frac > 0.15 && frac < 0.72 && hash(slot * 53 + 11) < showChance) {
        const uncollected = MANUAL_TARGETS.filter(
          (t) =>
            !manualStore.hasLayer(t.entryId, t.layer) &&
            t.y > 28 &&
            t.y + t.h < H - 46 &&
            t.x > 16 &&
            t.x + t.w < W - 16,
        );
        if (uncollected.length > 0) {
          const pick = uncollected[Math.floor(hash(slot * 97 + 7) * uncollected.length)]!;
          const entry = manualEntryById(pick.entryId);
          if (entry) {
            const bob = reduced ? 0 : Math.round(Math.sin(now / 260) * 1.5);
            const tag = foundTotal < 3 ? 'click me!' : '?';
            drawPill(pick.x + pick.w / 2, pick.y - 14 + bob, tag, MANUAL_RARITIES[entry.rarity].color, '#ffe25a');
          }
        }
      }
    }

    // Floating catch toasts
    for (let i = this.manualToasts.length - 1; i >= 0; i--) {
      const toast = this.manualToasts[i]!;
      const age = now - toast.at;
      if (age > 1600) {
        this.manualToasts.splice(i, 1);
        continue;
      }
      const lift = reduced ? 0 : Math.round((age / 1600) * 14);
      ctx.save();
      ctx.globalAlpha = age > 1100 ? Math.max(0, 1 - (age - 1100) / 500) : 1;
      drawPill(toast.x, toast.y - lift, toast.text, toast.color, '#ffffff');
      ctx.restore();
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
