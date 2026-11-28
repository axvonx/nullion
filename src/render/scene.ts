import { ENDLESS_LAYERS, type Layer, type LayerId, type StackMode } from '../core/layers';
import { MODE_RULES, layersFor, layerIndexAt, maxDepthFor, rulesFor } from '../core/modes';
import type { TierId } from '../core/tiers';
import { look, reducedMotion } from '../looks';
import { enforce } from '../core/enforce';
import { FONT, SEAM_H, hash, type Art, type Band } from './art-common';
import { LAYER_ART_V4, ensureWorldV4, setActiveTopicV4 } from './art-v4';
import { Collectibles } from './collectibles';
import { CritterSystem } from './critters';
import { MANUAL_RARITIES, manualEntryById, manualStore } from '../game/manual';
import { tagsForQuestion } from './v4/topics';
import { FAR_F } from './v4/place';
import type { WorldSpecV4 } from './v4/world';
import { quantizeRow, snapColor } from './palettes';
import { LAYER_ART } from '../layers';
import { SPRITES, drawSprite, type Sprite } from './sprites';
import { LEAD_MS, bufferBlock, NO_REACTION, REACTION_MS, WOMM, FLICKER_FLOOR_MS, LANDING_GRACE_MS, reactionAlive, reactionFrame, type ReactionFrame } from './reaction-fx';
import { drawNullionBanner } from './nullion-banner';
import { ReactionPaint } from './reaction-paint';
import { BAYER16, get2d, type Surface } from './surface';
import { TitleGlitches } from './title-glitches';
import { CURSOR_FRAC, MARK_RX, MARK_RY, cursorNudge, markCenter, markExtentY, pixelScale, type CursorForm } from './cursor-geom';
import type { TitleGlitchEvent } from '../ui/title-logo';
import { sound } from '../audio/sound';
import { toCss, uiZoom } from '../ui/ui-scale';
import { text } from '../text';

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

/** How long a tier's notable part plays before its dive starts. */
export function diveLeadMs(tier: TierId): number {
  return LEAD_MS[tier];
}

/** One frame's shared facts, handed to the draw phases. */
interface Frame {
  now: number;
  dt: number;
  reduced: boolean;
  W: number;
  H: number;
  ctx: CanvasRenderingContext2D;
  surf: Surface;
  stack: readonly Layer[];
  /** Index of the layer where kernel rain and auto scanlines start (Infinity: none). */
  kernelIdx: number;
  layerIdx: number;
  layer: Layer;
  /** The dive in progress, if any. */
  dv: Dive | undefined;
  /** The world clock is stopped (Ring -2, Works on my machine). */
  worldFrozen: boolean;
  /** The tier whose reaction is acting. */
  act: TierId | undefined;
  /** World y at the screen top. */
  camY: number;
  band: (i: number) => Band;
  art: typeof LAYER_ART_V4;
}

/** Seen props: their hover pill's quiet gray. */
const SEEN_GRAY_TEXT = '#8b8799';
const SEEN_GRAY_EDGE = '#4a4656';
/** How long a first sighting's snapshot plays (flash, then the photo flying off). */
const SNAP_MS = 1100;

/**
 * Colours for an unseen prop's pill: its layer's own stack colours (accent, highlight, border) plus white, each letter
 * (and the outline, i = 99) changing colour every 140 ms on its own, deterministically from the clock.
 */
function unseenColors(layer: LayerId, now: number): (i: number) => string {
  const t = LAYER_ART[layer].stackTheme;
  const set = [t.accent, t.hi, t.border, '#ffffff'];
  const step = Math.floor(now / 140);
  return (i) => set[Math.floor(hash(step * 31 + i * 7 + 5) * set.length)]!;
}

/** Clicks on the same prop closer together than this are ignored (no toast pile-up). */
const TOAST_COOLDOWN_MS = 700;
/** "Already seen": the fault red the console uses for a rejected guess. */
const ALREADY_SEEN_RED = '#ff5d73';

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
  /** The reactions that act on props and the screen: page faults, jiggle, leaked copies. */
  private readonly paint = new ReactionPaint();
  /** The title wordmark's glitches reflected into the live sky. */
  private readonly titleGlitches = new TitleGlitches();
  /** While the tier reveal is open the reaction holds or loops instead of ending (see setHold). */
  private held = false;
  /** This frame's reaction timeline (see reaction-fx.ts). */
  private rf: ReactionFrame = NO_REACTION;
  private lastLayer = 0;
  private reaction: Reaction | undefined;
  /** When the last dive carrying a reaction landed (reactionAlive's grace for the reveal to hold it). */
  private reactionLandedAt = -Infinity;
  private tearUntil = 0;
  private tearStrength = 0;
  private artTime = 0;
  private timeScale = 1;
  private lastNow = 0;
  private trail: { x: number; y: number }[] = [];
  private cursorLead = 0;
  private swayAmp = 0;
  private swayPhase = 0;
  private bubbles: { x: number; y: number; age: number }[] = [];
  private vignette = { on: false, at: -Infinity };
  private vignetteCfg = {
    maxBlock: 8,
    cxFrac: 0.5,
    cyFrac: null as number | null,
    blob: false,
    blobAlpha: 0,
    blobCx: 0.5,
    blobHalfW: 0.1,
    blobHalfH: 0.13,
  };
  private cursorHidden = false;
  /**
   * The frame as the reveal opened. The black region (the core and the darker half of its feather) samples this,
   * not the live frame, so nothing moving behind the reveal (a held jiggle, critters, ambience) flickers through it.
   * Cleared when the reveal closes, retaken on the next one.
   */
  private revealStill: Uint8ClampedArray | undefined;
  /** Outside the black region the reveal shows the world refreshed at most every FLICKER_FLOOR_MS, never per frame. */
  private revealLive: Uint8ClampedArray | undefined;
  private revealLiveAt = -Infinity;
  private rain: { y: number; speed: number }[] = [];
  /** Living System Biosphere critters (unique per layer, animated on artTime, spatial SFX). */
  private critters = new CritterSystem();
  /** What the last frame drew that can be clicked or reacted to; props and critters report into it. */
  private readonly collectibles = new Collectibles();
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
  /** The player's real mouse, in scene px (mouse pointers only; touch never nudges), for the cursor's lean. */
  private realPointer: { x: number; y: number } | undefined;
  /** The cursor's current lean toward the real mouse (scene px, eased; see cursorNudge). */
  private nudge = { x: 0, y: 0 };
  /** Floating in-world toasts when a player clicks & logs a Field Manual character. */
  private manualToasts: { key: string; x: number; y: number; text: string; color: string; at: number; repeat?: boolean }[] = [];
  /** Snapshots: the photo of a prop taken when it is first logged (a frozen copy of its pixels), and when. */
  private snaps: { entryId: string; x: number; y: number; w: number; h: number; img: HTMLCanvasElement; at: number }[] = [];
  /** Live screen-to-scene target for flying prop snapshots (wired by Hud to the top-left Book icon). */
  snapTarget: (() => { x: number; y: number } | null) | undefined;
  /** Fired once when a first-sighting prop snapshot finishes flying into the Field Manual book. */
  onSnapLanded: ((entryId: string) => void) | undefined;
  /** When each (entry, layer) was last acknowledged this visit: repeats say "Already seen", spam is ignored. */
  private toastAckAt = new Map<string, number>();

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
    // The cursor leans slightly toward the real mouse wherever it is on the page (panels over the canvas included).
    window.addEventListener('pointermove', (ev) => {
      this.realPointer = ev.pointerType === 'mouse' ? toScene(ev) : undefined;
    });
    document.documentElement.addEventListener('pointerleave', () => {
      this.realPointer = undefined;
    });
    this.canvas.addEventListener('pointermove', (ev) => {
      const pt = toScene(ev);
      this.hoverScene = pt;
      const hit = pt ? this.collectibles.hit(pt.x, pt.y, this.vignette.on) : undefined;
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
      const hit = this.collectibles.hit(pt.x, pt.y, this.vignette.on);
      if (!hit) return;
      // Don't steal focus from the answer input while logging a background specimen!
      ev.preventDefault();
      const entry = manualEntryById(hit.entryId);
      if (!entry) return;
      const key = `${hit.entryId}|${hit.layer}`;
      const now = performance.now();
      const last = this.toastAckAt.get(key);
      // Spam guard: a click on the same prop within the cooldown does nothing at all.
      if (last !== undefined && now - last < TOAST_COOLDOWN_MS) return;
      this.toastAckAt.set(key, now);
      const res = manualStore.log(hit.entryId, hit.layer);
      const meta = MANUAL_RARITIES[entry.rarity];
      const fresh = res.isNewEntry || res.isNewLayer;
      // Already logged here: a red, wobbling "Already seen" (no name: the hover pill names it), in place of any toast of
      // this prop still on screen rather than one more on top.
      const repeat = !fresh;
      const msg = res.isNewEntry
        ? text('world.toast.new-entry', { name: entry.name })
        : res.isNewLayer
          ? text('world.toast.new-layer', { name: entry.name })
          : text('world.toast.already-seen');
      // A first sighting takes a snapshot: the prop's pixels as they are now, framed like a photo.
      if (fresh) this.snapProp(hit, now);
      this.manualToasts = this.manualToasts.filter((t) => t.key !== key);
      this.manualToasts.push({
        key,
        x: hit.x + hit.w / 2,
        // Keep clear of the top HUD bar even at peak float lift (14 scene px).
        y: Math.max(36, hit.y - 4),
        text: msg,
        color: fresh ? meta.color : repeat ? ALREADY_SEEN_RED : '#cfcbd8',
        at: now,
        repeat,
      });
      if (res.isNewEntry || res.isNewLayer) sound.suggest(hit.layer);
    });
  }

  /** Copy a prop's pixels off the frame for its snapshot (see the catch-toast pass in drawOverlays). */
  private snapProp(hit: { entryId: string; x: number; y: number; w: number; h: number }, now: number) {
    const x = Math.max(0, Math.round(hit.x));
    const y = Math.max(0, Math.round(hit.y));
    const w = Math.max(1, Math.min(this.W - x, Math.round(hit.w)));
    const h = Math.max(1, Math.min(this.H - y, Math.round(hit.h)));
    const img = document.createElement('canvas');
    img.width = w;
    img.height = h;
    get2d(img).drawImage(this.canvas, x, y, w, h, 0, 0, w, h);
    this.snaps = [...this.snaps.slice(-3), { entryId: hit.entryId, x, y, w, h, img, at: now }];
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
    const scale = pixelScale(vw, vh);
    const nextW = Math.ceil(vw / scale);
    const nextH = Math.ceil(vh / scale);
    // Never wipe the canvas buffers when the integer scene dimensions didn't actually change (common on mobile
    // keyboard/URL-bar resize events, which otherwise flash the canvas solid black until the next rAF).
    if (nextW === this.W && nextH === this.H) return;
    this.W = nextW;
    this.H = nextH;
    this.cursorY = Math.round(this.H * CURSOR_FRAC);
    for (const c of [this.canvas, this.prev, this.scratch, this.seam, this.freezeShot]) {
      c.width = this.W;
      c.height = this.H;
    }
    // Exact integer scale; the overshoot (under one scene pixel) hangs off the right and bottom edges.
    // The page is zoomed on big screens (ui-scale.ts): the canvas's CSS size is its screen size over that zoom.
    this.canvas.style.width = `${toCss(this.W * scale)}px`;
    this.canvas.style.height = `${toCss(this.H * scale)}px`;
    this.paint.resize(this.W, this.H);
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
    const scale = pixelScale(vw, window.innerHeight);
    const cx = Math.round(W / 2);
    // The console card is 520 CSS px wide at most, zoomed with the page on big screens.
    const consoleHalf = Math.ceil(Math.min(520 * uiZoom(), vw - 32) / 2 / scale) + 3;
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
  setVignette(
    on: boolean,
    opts?: {
      maxBlock?: number;
      cyFrac?: number;
      blob?: boolean;
      blobAlpha?: number;
      blobCx?: number;
      blobHalfW?: number;
      blobHalfH?: number;
    },
  ) {
    if (on) {
      const next = {
        maxBlock: opts?.maxBlock ?? 8,
        cxFrac: 0.5,
        cyFrac: opts?.cyFrac ?? null,
        blob: opts?.blob ?? false,
        blobAlpha: opts?.blobAlpha ?? 1,
        blobCx: opts?.blobCx ?? 0.5,
        blobHalfW: opts?.blobHalfW ?? 0.1,
        blobHalfH: opts?.blobHalfH ?? 0.13,
      };
      if (this.vignette.on) {
        this.vignetteCfg = next;
        return;
      }
      this.vignetteCfg = next;
      this.revealStill = undefined; // retaken on the reveal's first frame
      this.revealLive = undefined;
    } else if (!this.vignette.on) {
      return;
    }
    const now = performance.now();
    // Reversing mid-fade starts from where the fade got to.
    const k = Math.max(0, Math.min(1, (now - this.vignette.at) / VIGNETTE_MS));
    this.vignette = { on, at: now - (1 - k) * VIGNETTE_MS };
  }

  /** Update Dottybase's single moving & morphing shadow blob (center X, half-extents, and overall alpha). */
  setVignetteBlob(blobAlpha: number, blobCx: number, blobHalfW: number, blobHalfH: number) {
    this.vignetteCfg.blobAlpha = blobAlpha;
    this.vignetteCfg.blobCx = blobCx;
    this.vignetteCfg.blobHalfW = blobHalfW;
    this.vignetteCfg.blobHalfH = blobHalfH;
  }

  /** Temporarily hide the scrolling virtual cursor (e.g. while Dottybase takes center stage). */
  setCursorHidden(hidden: boolean) {
    this.cursorHidden = hidden;
  }

  /** Scale background simulation delta-time (e.g. 0.12 for bullet-time during table-check). */
  setTimeScale(scale: number) {
    this.timeScale = Math.max(0, scale);
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
    this.paint.release(now);
    if (this.wommBound) {
      this.wommBound = false;
      // On "Unwind further" (when not the last round), ease the bound z-layers to where they should have scrolled.
      this.farReleasing = unstickZLayers;
    }
    const r = this.reaction;
    if (r && now - r.start > REACTION_MS[r.tier]) this.reaction = undefined;
    this.reactionLandedAt = -Infinity;
  }

  /** A dive carrying a reaction keeps it going through its lead and descent (the reveal's hold takes over on landing). */
  private sustainedByDive(): boolean {
    const d = this.dive;
    return !!d && d.react !== undefined;
  }

  /** The cursor form shown in a layer (the look can pin one form everywhere). */
  formFor(layerId: LayerId): CursorForm {
    const override = look('cursor');
    return override === 'evolving' ? LAYER_ART[layerId].cursor : override;
  }

  /** The cursor's bracket mark at rest, in CSS pixels of the (zoomed) page: the HUD frames it with the reveal's text. */
  markCss(): { top: number; bottom: number } {
    const scale = pixelScale(window.innerWidth, window.innerHeight);
    const m = markExtentY(this.formFor(layersFor(this.stackMode)[layerIndexAt(this.depth, this.stackMode)]!.id), this.cursorY);
    return { top: toCss(m.top * scale), bottom: toCss(m.bottom * scale) };
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
    const cfg = this.vignetteCfg;
    const bs = Math.min(cfg.maxBlock, bufferBlock(a));
    const img = ctx.getImageData(0, 0, W, H);
    const d = img.data;
    // Blocks sample copies (the still and the floored live frame) while the buffer is rewritten in place.
    if (!this.revealStill || this.revealStill.length !== d.length) this.revealStill = new Uint8ClampedArray(d);
    const still = this.revealStill;
    // The world behind the reveal updates at most 4 times a second (none under reduced motion: it stays still).
    if (!this.revealLive || this.revealLive.length !== d.length || (!reduced && now - this.revealLiveAt >= FLICKER_FLOOR_MS)) {
      this.revealLive = new Uint8ClampedArray(d);
      this.revealLiveAt = now;
    }
    const live = this.revealLive;
    const cx = Math.round(W * cfg.cxFrac);
    const cy = cfg.cyFrac !== null ? Math.round(H * cfg.cyFrac) : Math.round(this.cursorY);
    // Single moving & morphing SDF shadow blob (Dottybase): travels with her from right -> center -> left,
    // expanding dynamically to fit the message width in the middle and contracting back as she walks off.
    const innerW = Math.min(Math.round(W * 0.28), 118);
    const innerH = Math.round(H * 0.19);
    const featherX = Math.max(32, Math.round(W * 0.16));
    const featherY = Math.max(26, Math.round(H * 0.15));
    const blobX = cfg.blobCx * W;
    const bodyRx = Math.max(22, Math.round(W * cfg.blobHalfW));
    const bodyRy = Math.max(20, Math.round(H * cfg.blobHalfH));
    const cornerR = Math.min(bodyRx, bodyRy) * 0.55;
    const boxX = Math.max(0, bodyRx - cornerR);
    const boxY = Math.max(0, bodyRy - cornerR);
    const blobFeather = Math.max(18, Math.round(Math.min(W, H) * 0.11));
    const outerDim = cfg.blob ? 0.05 : 0.12;
    const quantised = look('palette') === 'per-layer';
    for (let y = 0; y < H; y++) {
      const sy = Math.min(H - 1, y - (y % bs) + (bs >> 1));
      const dy = Math.max(0, (Math.abs(y - cy) - innerH) / featherY);
      const qy = Math.abs(y - cy) - boxY;
      const qyPos = Math.max(qy, 0);
      const bRow = (y & 3) * 4;
      for (let x = 0; x < W; x++) {
        const sx = Math.min(W - 1, x - (x % bs) + (bs >> 1));
        const si = (sy * W + sx) * 4;
        const i = (y * W + x) * 4;
        let smooth: number;
        let dark: number;
        if (cfg.blob) {
          const qx = Math.abs(x - blobX) - boxX;
          const dist = Math.hypot(Math.max(qx, 0), qyPos) + Math.min(Math.max(qx, qy), 0) - cornerR;
          const bt = Math.max(0, Math.min(1, dist / blobFeather));
          smooth = bt * bt * (3 - 2 * bt);
          dark = (1 - smooth * (1 - outerDim)) * cfg.blobAlpha * a;
        } else {
          const dx = Math.max(0, (Math.abs(x - cx) - innerW) / featherX);
          const t = Math.min(1, Math.hypot(dx, dy));
          smooth = t * t * (3 - 2 * t);
          dark = (1 - smooth * (1 - outerDim)) * a;
        }
        // The black region (core and the darker half of the feather) shows the still frame; the world flickers on
        // only outside it.
        const from = smooth < 0.5 ? still : live;
        if (BAYER16[bRow + (x & 3)]! < dark * 16) {
          d[i] = 0;
          d[i + 1] = 0;
          d[i + 2] = 0;
        } else {
          d[i] = from[si]!;
          d[i + 1] = from[si + 1]!;
          d[i + 2] = from[si + 2]!;
        }
      }
      // Full-colour rows have no palette to fall to: give them a coarse one so the degrade still reads.
      const li = layerIndexAtWorldY(camY + y, this.stackMode);
      if (!quantised || LAYER_ART[stack[li]!.id].palette === 'full') quantizeRow(d, y * W * 4, W, y, 'rgb4', true);
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
    this.paint.start(tier, leakNow, seed, this.W, this.cursorY);
  }

  /**
   * Reflect a title-screen wordmark glitch into the live background sky: mini "nullion" ghosts,
   * drifting pixels, hex tags, localized palette drops, tears, voids, and prop shudders.
   */
  triggerTitleGlitch(ev: TitleGlitchEvent) {
    if (this.titleGlitches.trigger(ev, this.W, this.H, this.cursorY)) this.swayAmp = Math.max(this.swayAmp, 0.35);
  }

  /** Clear any active title-screen background artifacts (called when diving into round 1 or entering scroll mode). */
  clearTitleGlitches() {
    this.titleGlitches.clear();
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
    if (d.react === 'leak') this.paint.leakAtLanding();
    if (d.react) this.reactionLandedAt = now;
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
    const dt = Math.min(0.1, this.lastNow ? (now - this.lastNow) / 1000 : 0) * this.timeScale;
    this.lastNow = now;
    const reduced = reducedMotion();
    ensureWorldV4(this.worldSpec());
    this.critters.ensureSeed(this.scatterSeed);

    const dv = this.moveCursor(now, dt, reduced);
    const stack = layersFor(this.stackMode);
    const kernelIdx = KERNEL_INDEX_BY_MODE[this.stackMode];
    const layerIdx = layerIndexAt(this.depth, this.stackMode);
    const layer = stack[layerIdx]!;
    const art = LAYER_ART_V4;
    const f0 = { now, dt, reduced, W, H, stack, kernelIdx, layerIdx, layer, dv, art };
    this.enterLayer(f0);
    const { act, worldFrozen } = this.stepReaction(now, dt, reduced, layer);
    const camY = this.placeCamera(dt, reduced);
    const ctx = this.ctx;
    resetCtx(ctx);
    const surf: Surface = { canvas: this.canvas, ctx, scratch: this.scratch, scratchCtx: this.scratchCtx, W, H };
    const band = (i: number): Band => ({
      collectibles: this.collectibles,
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
    const f: Frame = { ...f0, ctx, surf, worldFrozen, act, camY, band };
    this.drawWorld(f);
    this.drawEffects(f);
    this.drawCursorPass(f);
    this.postProcess(f);
  }

  /** Move the cursor: a dive (eased, with a small overshoot), or a glide toward the target; the camera follows. */
  private moveCursor(now: number, dt: number, reduced: boolean): Dive | undefined {
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
    return dv;
  }

  /** Crossing a boundary plays its effect and its sound. */
  private enterLayer(f: Pick<Frame, 'now' | 'reduced' | 'stack' | 'layerIdx' | 'layer'>) {
    const { now, reduced, stack, layerIdx, layer } = f;
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
  }

  /** The screen's half of the tier reaction: its timeline, the world clock's freeze and the collectibles reset. */
  private stepReaction(now: number, dt: number, reduced: boolean, layer: Layer): { act: TierId | undefined; worldFrozen: boolean } {
    const frozen = LAYER_ART[layer.id].frozenTime === true && look('freeze') === 'on';
    // The screen's half of the tier reaction.
    const rx = this.reaction;
    const rel = rx ? now - rx.start : Infinity;
    // Just landed and waiting for the reveal counts as held, so the screen doesn't drop its loop for a frame.
    const sustained = this.held || this.sustainedByDive() || now - this.reactionLandedAt <= LANDING_GRACE_MS;
    const act = rx && reactionAlive(rel, rx.tier, sustained, Infinity) ? rx.tier : undefined;
    // The reaction's timeline (pure, tested in reaction-fx.test.ts): hang, jiggle, inversion or tint, black-out.
    const rf = act ? reactionFrame(act, rel, sustained, reduced) : NO_REACTION;
    this.rf = rf;
    this.fx.freeze = rf.freeze;
    this.fx.hang = rf.hang;
    this.fx.jiggle = rf.jiggle;
    this.fx.flip = rf.flip;
    this.paint.advance(act, rel);
    // Works on my machine and Ring −2 freeze the entire world clock (props, rain, cursor blink/brackets/sway, bubbles, ambience).
    const worldFrozen = frozen || this.fx.freeze || this.fx.hang;
    sound.setAmbienceFrozen(worldFrozen);
    if (!worldFrozen) this.artTime += dt;
    this.collectibles.beginFrame();
    return { act, worldFrozen };
  }

  /** Place the camera: the world y at the screen top, with WOMM's rigid z-layer binding and its release. */
  private placeCamera(dt: number, reduced: boolean): number {
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
    return camY;
  }

  /** Layer bands with their critters, the boundaries between them, and the rain. */
  private drawWorld(f: Frame) {
    const { dt, reduced, W, H, ctx, stack, kernelIdx, layerIdx, worldFrozen, camY, band, art } = f;
    // 1. Layer bands (+ living biosphere critters).
    for (let i = 0; i < stack.length; i++) {
      const b = band(i);
      if (b.bottom < 0 || b.top > H) continue;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, Math.max(0, b.top), W, Math.min(H, b.bottom) - Math.max(0, b.top));
      ctx.clip();
      const propsSince = this.collectibles.mark();
      art[stack[i]!.id](ctx, b);
      this.critters.drawBand(
        ctx,
        stack[i]!.id,
        b,
        i === layerIdx && !worldFrozen,
        (ev) => (ev.kind === 'exit' ? sound.playCritterExit(ev.layer, ev.pan) : sound.playCritter(ev.layer, ev.pan)),
        propsSince,
      );
      ctx.restore();
    }

    // 2. Boundaries: the upper layer frays down into the lower one, and hard boundaries get a structure.
    for (let i = 1; i < stack.length; i++) {
      const y = Math.round(bandTop(i, this.stackMode) - camY);
      if (y < -SEAM_H || y > H + 10) continue;
      const l = stack[i]!;
      this.drawSeam(art[stack[i - 1]!.id], band(i - 1), y);
      LAYER_ART[l.id].seam?.(ctx, y, band(i));
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
  }

  /** Ambient particles, speedlines, the tier reaction in the world, and the title glitches. */
  private drawEffects(f: Frame) {
    const { now, dt, reduced, surf, layer, dv, worldFrozen, act } = f;
    // 3a. Subtle per-layer ambient particles (on artTime, so frozen states hold them still; off under reduced motion).
    this.drawAmbience(layer.id, reduced);

    // 3b. Speedlines on big dives (>= 5 frames: Race, Heisenbug, Bit Flip).
    if (dv && dv.moving && dv.to - dv.from >= 5 && !reduced && !worldFrozen) {
      this.drawSpeedlines(now, dv, layer.id);
    }

    // 3c. The screen mirrors the tier reaction in the world (the HUD adds grey, invert and racing panels from this.fx).
    // It sits under the vignette and the cursor: the mascot's own reaction always plays in front.
    this.paint.draw(surf, this.collectibles, {
      now,
      act,
      reduced,
      held: this.held,
      jiggle: this.fx.jiggle,
      reactionStart: this.reaction?.start,
      pages: this.rf.pages,
    });

    // 3c. Title-screen background reflections: mini "nullion" ghosts, localized palette drops, tears, voids, drips.
    this.titleGlitches.draw(surf, this.collectibles, now, dt, reduced);
  }

  /** The cursor: sway, the reveal buffer, bubbles, the cursor itself and its frame pops. */
  private drawCursorPass(f: Frame) {
    const { now, dt, reduced, stack, layer, dv, worldFrozen, camY } = f;
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
    // Lean toward the real mouse: none under reduced motion, held still while time is frozen, eased so it drifts.
    const p = this.realPointer;
    const lean = reduced || !p ? { x: 0, y: 0 } : cursorNudge(p.x - this.W / 2, p.y - this.cursorY, this.W / 2);
    if (reduced) this.nudge = { x: 0, y: 0 };
    else if (!worldFrozen) {
      const e = 1 - Math.exp(-dt * 4);
      this.nudge = { x: this.nudge.x + (lean.x - this.nudge.x) * e, y: this.nudge.y + (lean.y - this.nudge.y) * e };
    }
    // The reveal's vignette dims the middle beneath the cursor pass, so the cursor and its reaction play in front of it.
    this.drawRevealBuffer(now, reduced, camY, stack);
    if (!this.cursorHidden) {
      this.drawBubbles(swayDt, speed, reduced, layer.id);
      this.drawCursor(now, layer.id, reduced);
      this.drawPops(now, layer.id, reduced);
    }
  }

  /** Everything over the finished picture: colour depth, banner, manual overlay, ghosting, scanlines, tearing, crossing effects. */
  private postProcess(f: Frame) {
    const { now, reduced, W, H, ctx, surf, stack, kernelIdx, layerIdx, layer, camY } = f;
    // 5. Color depth: quantize each row by the layer it shows, so the next layer's palette visibly approaches.
    if (look('palette') === 'per-layer') {
      const img = ctx.getImageData(0, 0, W, H);
      const dither = look('dither') === 'bayer';
      for (let y = 0; y < H; y++) {
        const li = layerIndexAtWorldY(camY + y, this.stackMode);
        quantizeRow(img.data, y * W * 4, W, y, LAYER_ART[stack[li]!.id].palette, dither);
      }
      ctx.putImageData(img, 0, 0);
    }

    // 5b. "ONE IN A / NULLION" dramatic buildup (Bit Flip climax & Works on my machine fake-out).
    if (this.rf.banner) drawNullionBanner(surf, now, this.rf.banner, reduced);

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
    const isOneBit = LAYER_ART[layer.id].palette === 'onebit';
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
   * Subtle layer-specific ambient particles on `artTime` (each layer's own `LAYER_ART[id].ambient`: sky motes, rising
   * GC sparks, IRQ pulses, phosphor dust, frozen dust, 1-bit flecks). Off under reduced motion.
   */
  private drawAmbience(layerId: LayerId, reduced: boolean) {
    if (reduced) return;
    const ctx = this.ctx;
    const { W, H } = this;
    const t = this.artTime;
    const perLayer = look('palette') === 'per-layer';
    const pal = LAYER_ART[layerId].palette;
    const col = (hex: string) => (perLayer ? snapColor(hex, pal) : hex);
    const count = 12;
    const ambient = LAYER_ART[layerId].ambient;
    const pulse = () => sound.playAmbientEvent(layerId);

    ctx.save();
    for (let i = 0; i < count; i++) {
      const s1 = hash(i * 43 + 11);
      const s2 = hash(i * 67 + 23);
      const s3 = hash(i * 97 + 37);
      ambient?.({ ctx, W, H, t, col, i, s1, s2, s3, pulse });
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
    const pal = LAYER_ART[layerId].palette;
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
      ctx.fillStyle = perLayer ? snapColor(TIER_HEX[p.tier], LAYER_ART[layerId].palette) : TIER_HEX[p.tier];
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
    let x = Math.round(this.W / 2 + this.swayAmp * 6 * Math.sin(this.swayPhase) + this.nudge.x);
    let y = Math.round(this.cursorY + this.cursorLead + this.swayAmp * 2 * Math.sin(this.swayPhase * 2) + this.nudge.y);
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
    const alive = r !== undefined && reactionAlive(el, r.tier, sustained, now - this.reactionLandedAt);
    if (r && !alive) this.reaction = undefined;
    const active = alive ? r.tier : undefined;
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
          drawSprite(ctx, spr, p.x - (k + 1) * 6, p.y + (k % 2), fill, outline, alpha * (0.8 - k * 0.08));
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
    const pal = LAYER_ART[layerId].palette;
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
    const cx = this.W / 2 + this.swayAmp * 6 * Math.sin(this.swayPhase) + this.nudge.x;
    if (speed > 0.25 && this.bubbles.length < 24 && Math.random() < dt * (4 + speed * 2)) {
      this.bubbles.push({ x: cx + (Math.random() - 0.5) * 10, y: this.cursorY + this.cursorLead + 4, age: 0 });
    }
    const ctx = this.ctx;
    const ink = look('palette') === 'per-layer' ? snapColor('#ffffff', LAYER_ART[layerId].palette) : '#ffffff';
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
    /** A pill whose outline and every letter take their own colour from `color(i)` (the outline is i = 99). */
    const drawFlashPill = (cx: number, y: number, label: string, color: (i: number) => string) => {
      drawPill(cx, y, label, color(99), 'rgba(0,0,0,0)');
      ctx.font = FONT;
      const pw = Math.ceil(ctx.measureText(label).width) + 8;
      const px = Math.max(4, Math.min(W - pw - 4, Math.round(cx - pw / 2)));
      const py = Math.max(4, Math.min(H - 11 - 4, Math.round(y)));
      let x = px + 4;
      [...label].forEach((ch, i) => {
        ctx.fillStyle = color(i);
        ctx.fillText(ch, x, py + 8);
        x += ctx.measureText(ch).width;
      });
    };

    const hit = this.hoverScene ? this.collectibles.hit(this.hoverScene.x, this.hoverScene.y, this.vignette.on) : undefined;
    if (hit) {
      const entry = manualEntryById(hit.entryId);
      if (entry) {
        const found = manualStore.isFound(entry.id);
        const hasLayer = manualStore.hasLayer(entry.id, hit.layer);
        // Crisp 3px pixel corner brackets around the hovered specimen
        const bx = Math.round(hit.x) - 2;
        const by = Math.round(hit.y) - 2;
        const bw = Math.round(hit.w) + 4;
        const bh = Math.round(hit.h) + 4;
        const flash = unseenColors(hit.layer, now);
        ctx.fillStyle = hasLayer ? SEEN_GRAY_EDGE : flash(99);
        ctx.fillRect(bx, by, 4, 1);
        ctx.fillRect(bx, by, 1, 4);
        ctx.fillRect(bx + bw - 4, by, 4, 1);
        ctx.fillRect(bx + bw - 1, by, 1, 4);
        ctx.fillRect(bx, by + bh - 1, 4, 1);
        ctx.fillRect(bx, by + bh - 4, 1, 4);
        ctx.fillRect(bx + bw - 4, by + bh - 1, 4, 1);
        ctx.fillRect(bx + bw - 1, by + bh - 4, 1, 4);

        // Seen here: its name in a quiet gray (hidden while its "Already seen" is up, so they never stack). Not seen
        // here: "???" (or, for an entry found in another layer, its name) flashing in the layer's own colours, letter by
        // letter; no rarity, no "click". The measured rate lives in the Field Manual (FIELD-MANUAL-PLAN.md).
        const pillY = by > 18 ? by - 13 : by + bh + 3;
        const key = `${entry.id}|${hit.layer}`;
        if (hasLayer) {
          if (!this.manualToasts.some((t) => t.key === key)) drawPill(bx + bw / 2, pillY, entry.name, SEEN_GRAY_EDGE, SEEN_GRAY_TEXT);
        } else drawFlashPill(bx + bw / 2, pillY, found ? entry.name : '???', flash);
      }
    } else if (this.collectibles.targets().length > 0 && !this.rf.banner) {
      // Gentle occasional "click me!" breadcrumb above one visible uncollected prop (less frequent once player knows).
      const slot = Math.floor(now / 7000);
      const frac = (now % 7000) / 7000;
      const foundTotal = manualStore.foundCount();
      const showChance = foundTotal < 3 ? 0.55 : 0.22;
      if (frac > 0.15 && frac < 0.72 && hash(slot * 53 + 11) < showChance) {
        const uncollected = this.collectibles.targets().filter(
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
            drawFlashPill(pick.x + pick.w / 2, pick.y - 14 + bob, '???', unseenColors(pick.layer, now));
          }
        }
      }
    }

    // Snapshots of first sightings: a white flash inside closing shutter brackets, then the photo (white frame, dark
    // edge) lifts off toward the top-left Field Manual book, shrinking as it lands. Reduced motion: brief photo fade.
    const snapDur = reduced ? 480 : SNAP_MS;
    const target = this.snapTarget?.() ?? { x: 10, y: 10 };
    for (let i = this.snaps.length - 1; i >= 0; i--) {
      const s = this.snaps[i]!;
      const age = now - s.at;
      if (age > snapDur) {
        this.snaps.splice(i, 1);
        this.onSnapLanded?.(s.entryId);
        continue;
      }
      ctx.save();
      if (!reduced && age < 160) {
        const k = age / 160;
        ctx.globalAlpha = 1 - k;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(s.x, s.y, s.w, s.h);
        ctx.globalAlpha = 1;
        const inset = Math.round(k * Math.min(s.w, s.h) * 0.3);
        ctx.fillStyle = '#ffffff';
        for (const [cx, cy, dx, dy] of [[s.x + inset, s.y + inset, 1, 1], [s.x + s.w - inset, s.y + inset, -1, 1], [s.x + inset, s.y + s.h - inset, 1, -1], [s.x + s.w - inset, s.y + s.h - inset, -1, -1]] as const) {
          ctx.fillRect(dx > 0 ? cx : cx - 5, dy > 0 ? cy : cy - 1, 5, 1);
          ctx.fillRect(dx > 0 ? cx : cx - 1, dy > 0 ? cy : cy - 5, 1, 5);
        }
      } else {
        const t = reduced ? 0 : Math.min(1, (age - 160) / (SNAP_MS - 160));
        const e = t * t;
        const scale = 1 - 0.7 * e;
        const w = Math.max(2, Math.round(s.w * scale));
        const h = Math.max(2, Math.round(s.h * scale));
        const destX = target.x - w / 2;
        const destY = target.y - h / 2;
        const x = Math.round(s.x + (destX - s.x) * e);
        const y = Math.round(s.y - 6 + (destY - (s.y - 6)) * e);
        ctx.globalAlpha = reduced ? Math.max(0, 1 - age / snapDur) : t > 0.8 ? (1 - t) / 0.2 : 1;
        ctx.fillStyle = '#0c0a12';
        ctx.fillRect(x - 3, y - 3, w + 6, h + 8);
        ctx.fillStyle = '#f4f1e8';
        ctx.fillRect(x - 2, y - 2, w + 4, h + 6);
        ctx.drawImage(s.img, 0, 0, s.img.width, s.img.height, x, y, w, h);
      }
      ctx.restore();
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
      // "Already seen" shakes side to side for its first 360 ms, in whole scene pixels, settling.
      const wobble = toast.repeat && !reduced && age < 360 ? Math.round(Math.sin(age / 28) * 3 * (1 - age / 360)) : 0;
      ctx.save();
      ctx.globalAlpha = age > 1100 ? Math.max(0, 1 - (age - 1100) / 500) : 1;
      drawPill(toast.x + wobble, toast.y - lift, toast.text, toast.color, toast.repeat ? ALREADY_SEEN_RED : '#ffffff');
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
