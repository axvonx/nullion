import { text } from '../text';
import { enforce } from './enforce';
import {
  DAILY_LAYERS,
  ENDLESS_LAYERS,
  ENDLESS_MAX_DEPTH,
  MAX_DEPTH,
  TRUE_ENDLESS_LAYERS,
  TRUE_ENDLESS_MAX_DEPTH,
  type Layer,
  type LayerId,
  type StackMode,
} from './layers';

/** Daily per-prompt watchdog. */
export const ANSWER_MS = 25000;
/** Endless strike budget: 3 watchdog fails (or skips) end the run in a Kernel Panic. */
export const ENDLESS_MAX_STRIKES = 3;

/** Endless per-prompt watchdog tightens as you descend deeper into the stack. */
export function endlessAnswerMs(depth: number): number {
  if (depth < 605) return 30000;
  if (depth < 1325) return 25000;
  if (depth < 2030) return 20000;
  return 16000;
}

/** How free-scroll (debug scroll mode) moves through a stack. */
export interface ScrollRules {
  /** Frames past the last layer the target may drift. */
  readonly capExtra: number;
  /** If the target has run further than this from the shown depth, re-anchor on the shown depth. */
  readonly snapGap: number;
  /** Wheel pixels per frame. */
  readonly wheelDivisor: number;
  readonly arrowStep: number;
  readonly pageStep: number;
}

/**
 * Everything a stack mode decides. Callers ask `MODE_RULES[mode]` / `rulesFor(mode)` and never compare mode
 * strings; `MODE_RULES` is a `Record<StackMode, ModeRules>`, so a new mode must fill every field.
 */
export interface ModeRules {
  readonly id: StackMode;
  /** The layer stack and its last depth. */
  readonly layers: readonly Layer[];
  readonly maxDepth: number;
  /** 'day': the day's 7 fixed prompts. 'pool': an anti-repeat bag over the whole bank, round after round. */
  readonly promptSource: 'day' | 'pool';
  /** Watchdog strikes that end the run (0: no strikes, the game ends after its last prompt). */
  readonly maxStrikes: number;
  /** Per-prompt watchdog in ms at this depth. */
  answerMs(depth: number): number;
  /** Only this mode reads and writes the daily save, counts toward stats and shows the next-puzzle countdown. */
  readonly persistsDaily: boolean;
  /** 'slots': one score slot per round. 'fuses': the strike fuses plus a round counter. */
  readonly roundCounter: 'slots' | 'fuses';
  /** The end card (and its share text) is a plain backtrace for 'daily', a KERNEL PANIC for the strike modes: the chip text. */
  puzzleChip(puzzle: number): string;
  /** The share text's headline for a final depth label and layer name (the share has no stack picture, so it names the layer). */
  headline(framesLabel: string, layerName: string): string;
  /** The end card's summary line under "nullion #n": no layer name, since the card draws the stack right under it. */
  cardLine(framesLabel: string): string;
  /** First line of the share text. */
  shareTitle(puzzle: number): string;
  /** Most glyphs the share text carries. */
  readonly shareGlyphLimit: number;
  /** World height per frame in each layer: base 160 px plus `layerPerFrameH` per frame of its span. */
  readonly layerPerFrameH: number;
  /** World px per frame inside the last (open-ended) layer. */
  readonly lastLayerPxPerFrame: number;
  /** The layer where kernel rain and auto scanlines start; null: this mode has neither. */
  readonly kernelLayerId: LayerId | null;
  /** Boundary crossing effect for a boundary label with no entry in the scene's table. */
  readonly unlistedCrossFx: 'tear' | undefined;
  /** Layer whose ambience/sound bed plays instead of the current layer's; null: follow the current layer. */
  readonly soundLayerId: LayerId | null;
  /** The realm navigator (small icons, click to scroll) is shown. */
  readonly realmNav: boolean;
  /** Free-scroll movement is on even outside scroll mode (the stack is a place to roam, not a descent). */
  readonly forcesScrollMode: boolean;
  readonly scroll: ScrollRules;
}

const ENDLESS_SCROLL: ScrollRules = { capExtra: 60, snapGap: 220, wheelDivisor: 10, arrowStep: 12, pageStep: 80 };

const endlessHeadline = (framesLabel: string, layerName: string) => text('end-card.headline.endless', { frames: framesLabel, layer: layerName });
const endlessCardLine = (framesLabel: string) => text('end-card.summary.endless', { frames: framesLabel });

export const MODE_RULES: Record<StackMode, ModeRules> = {
  daily: {
    id: 'daily',
    layers: DAILY_LAYERS,
    maxDepth: MAX_DEPTH,
    promptSource: 'day',
    maxStrikes: 0,
    answerMs: () => ANSWER_MS,
    persistsDaily: true,
    roundCounter: 'slots',
    puzzleChip: (puzzle) => `#${puzzle}`,
    headline: (framesLabel, layerName) => text('end-card.headline.daily', { frames: framesLabel, layer: layerName }),
    cardLine: (framesLabel) => text('end-card.summary.daily', { frames: framesLabel }),
    shareTitle: (puzzle) => `nullion #${puzzle}`,
    shareGlyphLimit: Infinity,
    layerPerFrameH: 8,
    lastLayerPxPerFrame: 24, // = world px per stack frame of depth
    kernelLayerId: 'kernel',
    unlistedCrossFx: undefined,
    soundLayerId: null,
    realmNav: false,
    forcesScrollMode: false,
    scroll: { capExtra: 4, snapGap: 24, wheelDivisor: 26, arrowStep: 2, pageStep: 12 },
  },
  endless: {
    id: 'endless',
    layers: ENDLESS_LAYERS,
    maxDepth: ENDLESS_MAX_DEPTH,
    promptSource: 'pool',
    maxStrikes: ENDLESS_MAX_STRIKES,
    answerMs: endlessAnswerMs,
    persistsDaily: false,
    roundCounter: 'fuses',
    puzzleChip: () => 'ENDLESS',
    headline: endlessHeadline,
    cardLine: endlessCardLine,
    shareTitle: () => 'nullion endless',
    shareGlyphLimit: 42,
    layerPerFrameH: 2.2,
    lastLayerPxPerFrame: 6,
    kernelLayerId: 'kernel-entry',
    unlistedCrossFx: undefined,
    soundLayerId: 'internet',
    realmNav: false,
    forcesScrollMode: false,
    scroll: ENDLESS_SCROLL,
  },
  'true-endless': {
    id: 'true-endless',
    layers: TRUE_ENDLESS_LAYERS,
    maxDepth: TRUE_ENDLESS_MAX_DEPTH,
    promptSource: 'pool',
    maxStrikes: ENDLESS_MAX_STRIKES,
    answerMs: endlessAnswerMs,
    persistsDaily: false,
    roundCounter: 'fuses',
    puzzleChip: () => 'ENDLESS',
    headline: endlessHeadline,
    cardLine: endlessCardLine,
    shareTitle: () => 'nullion endless',
    shareGlyphLimit: 42,
    layerPerFrameH: 3.5,
    lastLayerPxPerFrame: 6,
    // Cozy pocket universes: no kernel rain or auto scanlines.
    kernelLayerId: null,
    unlistedCrossFx: 'tear',
    soundLayerId: 'slab-spa',
    realmNav: true,
    forcesScrollMode: true,
    scroll: { ...ENDLESS_SCROLL, capExtra: 30, snapGap: 24, wheelDivisor: 18 },
  },
};

/** The rules of a stack mode. */
export function rulesFor(mode: StackMode): ModeRules {
  return MODE_RULES[mode];
}

export function layersFor(mode: StackMode): readonly Layer[] {
  return MODE_RULES[mode].layers;
}

export function maxDepthFor(mode: StackMode): number {
  return MODE_RULES[mode].maxDepth;
}

for (const rules of Object.values(MODE_RULES)) {
  if (rules.kernelLayerId !== null) {
    enforce(rules.layers.some((l) => l.id === rules.kernelLayerId), `mode ${rules.id}: no layer '${rules.kernelLayerId}'`);
  }
  if (rules.soundLayerId !== null) {
    enforce(rules.layers.some((l) => l.id === rules.soundLayerId), `mode ${rules.id}: no layer '${rules.soundLayerId}'`);
  }
}

export function layerIndexAt(depth: number, mode: StackMode = 'daily'): number {
  enforce(Number.isFinite(depth) && depth >= 0, `bad depth ${depth}`);
  const stack = layersFor(mode);
  let idx = 0;
  for (let i = 0; i < stack.length; i++) if (depth >= stack[i]!.from) idx = i;
  return idx;
}

export function layerAt(depth: number, mode: StackMode = 'daily'): Layer {
  const stack = layersFor(mode);
  return stack[layerIndexAt(depth, mode)]!;
}

export function layerById(id: LayerId, mode: StackMode = 'daily'): Layer {
  const l = layersFor(mode).find((x) => x.id === id);
  enforce(l, `unknown layer ${id}`);
  return l;
}
