import type { DailyLayerId } from '../core/layers';
import type { SoundProfile } from '../audio/sound';
import type { Band, Seam } from '../render/art-common';
import type { CursorForm } from '../render/cursor-geom';
import type { MotionType } from '../render/motion';
import type { PaletteMode } from '../render/palettes';
import type { RGB } from '../render/v4/kit';
import type { LayerSpec } from '../render/v4/library';
import type { FloorShape, Rect } from '../render/v4/place';
import type { TopicTag } from '../render/v4/topics';
import type { FormId } from '../ui/forms';
import type { LayerTheme } from '../ui/layer-stack';

/**
 * Everything the presentation side knows about one layer, in one object per layer (src/layers/<layer-id>.ts).
 * Game rules (order, names, thresholds, modes) stay in src/core/layers.ts; this is how a layer looks, sounds and
 * behaves on screen. The registry (src/layers/index.ts) is typed over every LayerId, so a layer without a module
 * is a compile error. Callers read `LAYER_ART[id].<field>` and never switch on a layer id.
 */

type Ctx = CanvasRenderingContext2D;

/** What a setpiece draws into: the band, its art time and its safe vertical span (see `bandSpan`). */
export interface SetpieceEnv {
  ctx: Ctx;
  b: Band;
  t: number;
  /** Band width, its centre column, and the span's top, bottom, middle and height. */
  W: number;
  cx: number;
  top: number;
  bot: number;
  cy: number;
  H: number;
}

/** The ambient-detail pass adds three small recipes shared by many layers. */
export interface DetailEnv extends SetpieceEnv {
  /** Evenly spaced blinking lamps along a horizontal line. */
  lamps(y: number, n: number, on: string, off: string, speed?: number): void;
  /** Particles drifting up through the band, wrapped. */
  rise(n: number, speed: number, seed: number, col: string, drift?: number): void;
  /** Particles falling through the band, wrapped. */
  fall(n: number, speed: number, seed: number, col: string): void;
}

/** What a layer's background function gets besides the context and band. */
export interface BackgroundEnv {
  /** Art time (0 under reduced motion). */
  T: number;
  /** Draw the layer's setpiece, far plane and near-plane entities: the layer decides where in its own paint order. */
  entities(): void;
}

/** One ambient particle of the scene's layer-specific dust, already positioned by its index. */
export interface AmbientEnv {
  ctx: Ctx;
  W: number;
  H: number;
  /** Art time. */
  t: number;
  /** Snap a colour to the layer's palette (when the colour-depth look is on). */
  col(hex: string): string;
  /** Particle index and three stable pseudo-random numbers for it. */
  i: number;
  s1: number;
  s2: number;
  s3: number;
  /** Ask the sound engine for a micro-foley event (rate-limited there). */
  pulse(): void;
}

/** What a critter sprite is drawn with: `px` writes into the critter's 1 px grid, which is outlined afterwards. */
export interface SpriteEnv {
  px(dx: number, dy: number, w: number, h: number, hex: string): void;
  /** The layer palette's darkest ink, for eyes and edges. */
  ink: string;
  /** Art time and the critter's own phase offset. */
  t: number;
  phase: number;
  variant: number;
  dir: 1 | -1;
  perched: boolean;
  /** 0..1 along a hop arc (0.5 when not hopping). */
  hopFrac: number;
  /** Also draw the sprite mirrored across the screen's centre (twin wisps and bugs). */
  mirror(): void;
}

/** An alternate species is drawn with a wing-flap tick on top. */
export interface AltSpriteEnv extends SpriteEnv {
  /** 0 or 1, flipping 8 times a second. */
  tick: number;
}

export interface HopTuning {
  /** Hop duration in seconds is `dur + hash * jitter`. */
  dur: number;
  jitter: number;
  /** Arc height in px. */
  arc: number;
  /** Rest after a hop is `pause + hash * 0.75` seconds. */
  pause: number;
}

export interface CritterSpec {
  /** The main species' allowed motions. */
  motions: readonly MotionType[];
  /** Critters on this layer. */
  count: number;
  /** Tiny despawn tags ("GC'd!"); a single empty string for none. */
  exitLabels: readonly string[];
  /** Draw the main species. */
  draw(s: SpriteEnv): void;
  /** A second species on the odd variants, with its own motions. */
  alt?: { motions: readonly MotionType[]; draw(s: AltSpriteEnv): void };
  /** Hop timing, where it differs from the default (`DEFAULT_HOP` in critters.ts). */
  hop?: Partial<HopTuning>;
}

export interface LayerArt {
  /** The Daily layer this one belongs to: the Field Manual files its critters and unlock state under it. */
  family: DailyLayerId;
  /** One line a non-systems player can read, shown as you enter the layer. */
  blurb: string;
  /** The Wikipedia article that explains this layer (checked to exist, never a disambiguation page): the end card's stack links to it. */
  wiki: string;
  palette: PaletteMode;
  /** The console card's idiom. */
  form: FormId;
  /** The cursor's shape. */
  cursor: CursorForm;
  /** The RHS stack's colours and 9×9 icon. */
  stackTheme: LayerTheme;
  /** Default topic tags of the layer's entities. */
  topicTags: readonly TopicTag[];
  /** Its v4 props and anchors, and how densely they are placed. */
  library: LayerSpec;
  /** Open-ended band: the first layer is open upward, the last downward (setpieces and critters clamp their span). */
  open?: 'top' | 'bottom';
  /** Time stops here (SMM): no critter motion, no sound. */
  frozenTime?: true;
  /** Keep-outs the layer's own background needs, in world coordinates. */
  keepOut?(top: number, bottom: number, W: number): Rect[];
  /** Bounded floor shapes props sit on, for interior layers. */
  floors?(top: number, bottom: number, W: number): FloorShape[];
  /** Colour the far plane fades into. */
  fog: RGB;
  /** Offset of the layer-name lettering below the band top (default 24). */
  nameTopOffset?: number;
  /** Paint the band's background; calls `env.entities()` at the point its props belong. */
  background(ctx: Ctx, b: Band, env: BackgroundEnv): void;
  /** The full-bleed landmark behind everything: a base pass, then ambient animated detail. */
  setpiece: { base(e: SetpieceEnv): void; detail?(e: DetailEnv): void };
  /** The structure drawn over the seam at the boundary into this layer. */
  seam?: Seam;
  /** Layer-specific ambient dust (see AmbientEnv); none: no dust. */
  ambient?(e: AmbientEnv): void;
  critters: CritterSpec;
  sound: SoundProfile;
}
