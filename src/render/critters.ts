import { enforce } from '../core/enforce';
import { ALL_LAYER_IDS, type LayerId } from '../core/layers';
import { LAYER_ART } from '../layers';
import type { HopTuning, SpriteEnv } from '../layers/types';
import { look } from '../looks';
import { FONT, SEAM_H, hash, type Band } from './art-common';
import { MotionType } from './motion';
import { darkestInk, snapColor } from './palettes';

/**
 * The System Biosphere: living pixel-art critters unique to each of the 10 layers of the software stack.
 *
 * Rather than binding each species to a single hard-coded motion, every species (and each critter instance)
 * has a composable set of allowed `MotionType`s and transitions smoothly between them in world-Y space:
 *   - Application:  Songbirds       — { Fly, Perch } (glide across sky, occasionally land on prop tops, then take off)
 *   - Runtime:      Helper blobs    — { Hop, Perch } (only land on prop tops & hop between them — never free-fly)
 *   - Libraries:    Bookworm blobs  — { Hop, Perch } (softer, slower prop-to-prop hops & reading perches)
 *   - OS userspace: Horned daemons  — { Patrol, Hop, Perch } (brisk horizontal patrol with occasional prop hops/pauses)
 *   - Kernel:       Thread-bots     — { Zip, Perch } (burst-and-pause scheduling quanta, occasionally yielding on a prop)
 *   - Drivers:      Bus-beetles     — { Scuttle } (rapid horizontal trace scuttling)
 *   - Firmware:     Sentinel drones — { Float } (slow, rigid metronomic floating patrols — never jumping or landing)
 *   - Ring −1:      Mirror-wisps    — { Mirror } (smooth gliding in exact horizontal symmetry across center)
 *   - Ring −2:      Frozen ghosts   — { Frozen } (motionless grayscale silhouettes, never despawn)
 *   - Ring −3:      Bit-motes       — { Grid } (discrete orthogonal 4px silicon-grid steps)
 *
 * All coordinates are stored in world-Y (converted to screen-Y via `y - b.camY`), so scrolling never causes
 * critters to jump, teleport, or vanish. Natural lifespans fade critters in/out smoothly with tiny in-world
 * exit tags ("paged out!", "GC'd!", "SIGTERM", etc.).
 */

/** Visible critter hitboxes collected each frame in scene pixels (cleared each frame by Scene). */
export const CRITTER_SPOTS: { x: number; y: number; w: number; h: number; layer: LayerId }[] = [];

/** Alternate-species critters are the odd variants on a layer that has an alternate species (`critters.alt`). */
export function isAltSpecies(layerId: LayerId, variant: number): boolean {
  return variant % 2 === 1 && LAYER_ART[layerId].critters.alt !== undefined;
}

export interface CritterCall {
  layer: LayerId;
  /** Stereo pan -0.85..+0.85 matching the critter's horizontal screen position. */
  pan: number;
  /** 'call' = normal vocalization on a physical beat; 'exit' = lifespan despawn ("paged out!", "GC'd!", etc.). */
  kind: 'call' | 'exit';
}

interface PropTop {
  cx: number;
  /** World-space Y of the prop's top edge (screenY + camY). */
  worldY: number;
}

export interface CritterState {
  /** World-space current position */
  x: number;
  worldY: number;
  /** Allowed motion types for this critter instance */
  motions: ReadonlySet<MotionType>;
  /** Currently active motion */
  motion: MotionType;
  /** When the current timed motion (Fly, Patrol, Zip, Perch) naturally finishes and picks a next motion */
  motionUntilT: number;
  /** Stateful transition endpoints (used for Hop arcs and Fly→Perch smooth landing glides) */
  fromX: number;
  fromWorldY: number;
  toX: number;
  toWorldY: number;
  moveStartT: number;
  moveDur: number;
  /** True while smoothly gliding down from Fly onto a prop top to Perch */
  landing: boolean;
  /** Monotonic counter for deterministic hop/transition choices */
  stepCount: number;
  /** Direction (+1 or -1) */
  dir: 1 | -1;
  speed: number;
  phase: number;
  variant: number;
  /** Lifespan timing on artTime */
  bornT: number;
  lifeDur: number;
  respawnAtT: number;
  alive: boolean;
  exitedGen: number;
  gen: number;
  /** Audio & landing FX sync */
  nextBeatT: number;
  calledAtT: number;
  landedAtT: number;
  /** Initialized flag */
  init: boolean;
}

const R = Math.round;

/** Hop timing unless a layer's `critters.hop` overrides parts of it. */
const DEFAULT_HOP: HopTuning = { dur: 0.65, jitter: 0.25, arc: 12, pause: 0.6 };

const hopOf = (layerId: LayerId): HopTuning => ({ ...DEFAULT_HOP, ...LAYER_ART[layerId].critters.hop });

/**
 * Compute the safe world-Y span for a layer band, avoiding top seam overlap (`SEAM_H`)
 * and clamping open-ended first/last bands so critters never spawn miles off-screen.
 */
function bandWorldRange(layerId: LayerId, b: Band): { minY: number; maxY: number } {
  const rawBottom = b.worldTop + (b.bottom - b.top);
  const open = LAYER_ART[layerId].open;
  const isTopOpen = open === 'top';
  const isBotOpen = open === 'bottom';
  const minY = isTopOpen ? Math.max(b.worldTop + 26, -60) : b.worldTop + SEAM_H + 16;
  const maxY = isBotOpen ? Math.min(rawBottom - 16, b.worldTop + 340) : rawBottom - 16;
  return { minY, maxY: Math.max(minY + 40, maxY) };
}

/** Extract usable prop tops inside this band's world range (starting from `spotStart` so earlier bands never leak in). */
function bandProps(spots: readonly number[], spotStart: number, b: Band, worldMinY: number, worldMaxY: number): PropTop[] {
  const out: PropTop[] = [];
  for (let i = spotStart; i + 3 < spots.length; i += 4) {
    const x = spots[i]!;
    const sy = spots[i + 1]!;
    const w = spots[i + 2]!;
    const cx = x + w / 2;
    const wy = sy + b.camY;
    if (w < 8 || cx < 12 || cx > b.w - 12 || wy < worldMinY || wy > worldMaxY) continue;
    out.push({ cx, worldY: wy });
  }
  return out;
}

export class CritterSystem {
  private seed = -1;
  private byLayer = new Map<LayerId, CritterState[]>();
  private lastTByLayer = new Map<LayerId, number>();
  private lastGlobalCall = -Infinity;
  private nextCallGap = 1.4;

  /**
   * Draw one critter, standing still, with its feet near (x, y): the Field Manual's plates. `alt` picks the layer's
   * alternate species (a layer without one throws); `variant` (0–4) picks a colour variant. Leaves CRITTER_SPOTS (the scene's click targets) untouched.
   */
  portrait(ctx: CanvasRenderingContext2D, layerId: LayerId, alt: boolean, x: number, y: number, t = 0, variant?: number) {
    enforce(!alt || LAYER_ART[layerId].critters.alt, `critter portrait: ${layerId} has no alternate species`);
    this.ensureSeed(this.seed < 0 ? 1 : this.seed);
    const c = this.byLayer.get(layerId)?.find((s) => isAltSpecies(layerId, s.variant) === alt && (variant === undefined || s.variant === variant));
    enforce(c, `critter portrait: no ${alt ? 'alternate' : 'core'} critter state for ${layerId}`);
    const spots = CRITTER_SPOTS.length;
    this.drawCritter(ctx, layerId, c, x, y, 1, t, (h) => h, false, ctx.canvas.width, 0, false);
    CRITTER_SPOTS.length = spots;
  }

  ensureSeed(seed: number) {
    if (seed === this.seed && this.byLayer.size > 0) return;
    this.seed = seed;
    this.lastGlobalCall = -Infinity;
    this.lastTByLayer.clear();
    this.byLayer.clear();
    ALL_LAYER_IDS.forEach((id, li) => {
      const spec = LAYER_ART[id].critters;
      const n = spec.count;
      const allowed = spec.motions;
      const list: CritterState[] = [];
      for (let i = 0; i < n; i++) {
        const s = seed * 131 + li * 37 + i * 17;
        const lifeDur = 14 + hash(s + 6) * 10;
        const variant = i % 5;
        const set = isAltSpecies(id, variant) ? spec.alt!.motions : allowed;
        const motions = new Set<MotionType>(set);
        list.push({
          x: 0,
          worldY: 0,
          motions,
          motion: set[0]!,
          motionUntilT: 0,
          fromX: 0,
          fromWorldY: 0,
          toX: 0,
          toWorldY: 0,
          moveStartT: 0,
          moveDur: 0.9,
          landing: false,
          stepCount: 0,
          dir: hash(s + 3) > 0.5 ? 1 : -1,
          speed: 0.78 + hash(s + 4) * 0.45,
          phase: hash(s + 5) * 20,
          variant,
          bornT: 0,
          lifeDur,
          respawnAtT: 0,
          alive: true,
          exitedGen: -1,
          gen: 0,
          nextBeatT: 0.8 + hash(s + 8) * 2.2 + i * 0.9,
          calledAtT: -10,
          landedAtT: -10,
          init: false,
        });
      }
      this.byLayer.set(id, list);
    });
  }

  /** Read-only snapshot of critters in a layer (used by tests to inspect motion sets and state). */
  getLayerCritters(layerId: LayerId): readonly CritterState[] {
    const list = this.byLayer.get(layerId);
    enforce(list, `critters: layer ${layerId} not seeded (call ensureSeed first)`);
    return list;
  }

  /**
   * Update & draw all critters in band `b` for `layerId`.
   * Stateful world-space motion guarantees critters never teleport or vanish mid-hop when scrolling.
   */
  drawBand(
    ctx: CanvasRenderingContext2D,
    layerId: LayerId,
    b: Band,
    emitCalls: boolean,
    onCall?: (ev: CritterCall) => void,
    spots: readonly number[] = [],
    spotStart = 0,
  ) {
    const list = this.byLayer.get(layerId);
    enforce(list, `critters: drawBand on unseeded layer ${layerId} (call ensureSeed first)`);
    const W = b.w;
    const H = b.h;
    if (W < 24 || H < 24) return;

    const perLayer = look('palette') === 'per-layer';
    const art = LAYER_ART[layerId];
    const pal = art.palette;
    const col = (hex: string) => (perLayer ? snapColor(hex, pal) : hex);
    const t = b.reduced || art.frozenTime ? 0 : b.t;
    const prevT = this.lastTByLayer.get(layerId);
    const rawGap = prevT !== undefined && t >= prevT ? t - prevT : 0;
    const dt = Math.min(0.1, rawGap);
    this.lastTByLayer.set(layerId, t);

    // If this band was off-screen (or reduced motion just toggled off), shift all timers forward by the unsimulated gap
    // so critters don't mass-despawn or fire simultaneous audio bursts on the first frame back in view.
    if (rawGap > 0.5 && !b.reduced && !art.frozenTime) {
      const shift = rawGap - dt;
      for (const c of list) {
        if (!c.init) continue;
        c.bornT += shift;
        c.respawnAtT += shift;
        c.motionUntilT += shift;
        c.moveStartT += shift;
        c.nextBeatT += shift;
        c.landedAtT += shift;
      }
    }

    const { minY: worldMinY, maxY: worldMaxY } = bandWorldRange(layerId, b);
    const props = bandProps(spots, spotStart, b, worldMinY, worldMaxY);

    for (let i = 0; i < list.length; i++) {
      const c = list[i]!;

      // First-time placement inside the band's world-Y span (never crammed into a viewport sliver)
      if (!c.init) {
        c.init = true;
        // Stagger initial birth relative to current `t` so diving into a deeper layer after >24s never mass-despawns!
        c.bornT = t - hash(this.seed * 13 + i * 29 + c.phase) * (c.lifeDur * 0.65);
        this.spawnAt(c, layerId, i, W, worldMinY, worldMaxY, props, t);
      }

      // Clamp horizontally if viewport resized narrower
      if (c.motions.has(MotionType.Mirror)) {
        const maxX = Math.max(24, W / 2 - 18);
        if (c.x > maxX) c.x = maxX;
        if (c.x < 10) c.x = 10;
      } else {
        const maxX = Math.max(16, W - 18);
        if (c.x > maxX) c.x = maxX;
        if (c.x < 10) c.x = 10;
      }

      // Lifespan state machine (Ring −2 and reduced motion stay calmly visible)
      let alpha = 1;
      let exiting = false;
      let exitP = 0;
      if (b.reduced) {
        // Under reduced motion, keep previously dead critters hidden rather than resurrecting them mid-hop
        if (!c.alive) continue;
      } else if (!c.motions.has(MotionType.Frozen) && t > 0) {
        if (!c.alive) {
          if (t >= c.respawnAtT) {
            c.alive = true;
            c.gen++;
            c.variant = (c.variant + 1 + (c.gen % 2)) % 5;
            c.bornT = t;
            c.lifeDur = 13 + hash(this.seed * 7 + i * 29 + c.gen * 53) * 10;
            this.spawnAt(c, layerId, i + c.gen * 11, W, worldMinY, worldMaxY, props, t);
          } else {
            continue;
          }
        }
        const age = t - c.bornT;
        const fadeIn = 0.55;
        const fadeOut = 0.9;
        if (age >= c.lifeDur) {
          c.alive = false;
          c.respawnAtT = t + 1.6 + hash(this.seed + i * 19 + c.gen * 37) * 1.8;
          continue;
        }
        if (age < fadeIn) {
          alpha = Math.max(0.05, age / fadeIn);
        } else if (age > c.lifeDur - fadeOut) {
          exiting = true;
          exitP = (age - (c.lifeDur - fadeOut)) / fadeOut;
          alpha = Math.max(0, 1 - exitP);
        }
      }

      // Advance composable stateful motion
      let hopFrac = 0.5;
      let beatFired = false;

      if (!b.reduced && !c.motions.has(MotionType.Frozen) && dt > 0) {
        const res = this.stepMotion(c, layerId, i, dt, t, W, worldMinY, worldMaxY, props, exiting);
        hopFrac = res.hopFrac;
        beatFired = res.beat;
      }

      const sy = c.worldY - b.camY;
      // Cull off-screen critters cleanly without ever teleporting them
      if (sy < -28 || sy > H + 28) continue;

      const pan = c.motions.has(MotionType.Mirror)
        ? 0
        : Math.max(-0.85, Math.min(0.85, (c.x / Math.max(1, W)) * 2 - 1));

      // Play exit micro-sound once when entering dissolve/despawn
      if (exiting && emitCalls && !b.reduced && c.exitedGen !== c.gen) {
        c.exitedGen = c.gen;
        if (c.x > 8 && c.x < W - 8 && sy > 12 && sy < H - 12) {
          onCall?.({ layer: layerId, pan, kind: 'exit' });
        }
      }

      // Play synchronized vocalization on physical beat (randomized gap so it never locks into a mechanical tick)
      if (
        beatFired &&
        !exiting &&
        emitCalls &&
        !b.reduced &&
        !c.motions.has(MotionType.Frozen) &&
        c.x > 8 &&
        c.x < W - 8 &&
        sy > 12 &&
        sy < H - 12
      ) {
        if (t < this.lastGlobalCall) this.lastGlobalCall = -Infinity;
        if (t - this.lastGlobalCall >= this.nextCallGap) {
          c.calledAtT = t;
          this.lastGlobalCall = t;
          this.nextCallGap = 1.35 + hash(Math.floor(t * 13) + i * 31 + this.seed) * 1.6;
          onCall?.({ layer: layerId, pan, kind: 'call' });
        }
      }

      const perched = c.motion === MotionType.Perch;
      const chirping = !exiting && !b.reduced && t - c.calledAtT >= 0 && t - c.calledAtT < 0.28;
      ctx.save();
      ctx.globalAlpha = alpha;
      const drawY = exiting ? sy - Math.round(exitP * 4) : sy;
      this.drawCritter(ctx, layerId, c, c.x, drawY, c.dir, t, col, chirping, W, hopFrac, perched);
      ctx.restore();

      // Tiny in-world lifespan status tag ("paged out!", "GC'd!", "SIGTERM", etc.) rising as the critter dissolves
      if (exiting) {
        const labels = art.critters.exitLabels;
        const text = labels[(i + c.gen) % labels.length]!;
        if (text) {
          ctx.save();
          ctx.globalAlpha = Math.sin(exitP * Math.PI) * 0.92;
          ctx.font = FONT;
          const tw = Math.ceil(ctx.measureText(text).width);
          const lx = Math.max(4, Math.min(W - tw - 4, R(c.x - tw / 2 + 3)));
          const ly = Math.max(10, R(sy - 6 - exitP * 8));
          ctx.fillStyle = '#000000';
          ctx.fillText(text, lx + 1, ly + 1);
          ctx.fillStyle = col('#ffe25a');
          ctx.fillText(text, lx, ly);
          ctx.restore();
        }
      }
    }
  }

  private spawnAt(
    c: CritterState,
    layerId: LayerId,
    idx: number,
    W: number,
    worldMinY: number,
    worldMaxY: number,
    props: readonly PropTop[],
    t: number,
  ) {
    const hopOnly = c.motions.has(MotionType.Hop) && !c.motions.has(MotionType.Patrol) && !c.motions.has(MotionType.Fly);
    if (hopOnly && props.length > 0) {
      const p = props[Math.floor(hash(this.seed + idx * 41) * props.length) % props.length]!;
      c.x = p.cx;
      c.worldY = p.worldY - 6;
      c.motion = MotionType.Perch;
    } else if (c.motions.has(MotionType.Mirror)) {
      const half = Math.max(24, W / 2 - 22);
      c.x = 14 + hash(this.seed + idx * 17) * half;
      c.worldY = worldMinY + (worldMaxY - worldMinY) * (0.15 + hash(this.seed + idx * 23) * 0.7);
      c.motion = MotionType.Mirror;
    } else {
      c.x = 16 + hash(this.seed + idx * 17) * Math.max(20, W - 32);
      c.worldY = worldMinY + (worldMaxY - worldMinY) * (0.12 + hash(this.seed + idx * 23) * 0.76);
      const first = c.motions.values().next();
      enforce(!first.done, `critters: ${layerId} critter has an empty motion set`);
      c.motion = first.value;
      if (hopOnly) c.motion = MotionType.Perch;
    }
    c.fromX = c.x;
    c.fromWorldY = c.worldY;
    c.toX = c.x;
    c.toWorldY = c.worldY;
    c.landing = false;
    c.motionUntilT =
      c.motion === MotionType.Perch
        ? t + 0.35 + hash(this.seed + idx * 29) * 0.85
        : t + 2.4 + hash(this.seed + idx * 37) * 3.2;
    c.nextBeatT = t + 1.1 + hash(this.seed + idx * 31) * 2.2;
  }

  /** Pick a nearby prop top (within ~125px) for hopping or landing. */
  private pickNearbyProp(
    c: CritterState,
    props: readonly PropTop[],
    i: number,
    maxDist = 125,
  ): { x: number; worldY: number } | undefined {
    const nearby = props.filter((p) => {
      const d = Math.hypot(p.cx - c.x, p.worldY - 6 - c.worldY);
      return d >= 16 && d <= maxDist;
    });
    const pool =
      nearby.length > 0 ? nearby : props.filter((p) => Math.hypot(p.cx - c.x, p.worldY - 6 - c.worldY) >= 14);
    if (pool.length === 0) return undefined;
    c.stepCount++;
    const pick = pool[Math.floor(hash(c.stepCount * 53 + i * 37 + c.gen * 19 + this.seed) * pool.length) % pool.length]!;
    return { x: pick.cx, worldY: pick.worldY - 6 };
  }

  /** Fallback local hop destination when no props are available (e.g. every prop is off screen). */
  private pickFallbackHop(
    c: CritterState,
    W: number,
    worldMinY: number,
    worldMaxY: number,
    i: number,
  ): { x: number; worldY: number } {
    c.stepCount++;
    const h1 = hash(c.stepCount * 29 + i * 17 + c.gen * 13 + this.seed);
    const h2 = hash(c.stepCount * 47 + i * 31 + c.gen * 23 + this.seed);
    const dx = c.dir * (24 + h1 * 30);
    let nx = c.x + dx;
    if (nx < 14 || nx > W - 14) nx = c.x - dx;
    nx = Math.max(14, Math.min(W - 14, nx));
    const ny = Math.max(worldMinY + 8, Math.min(worldMaxY - 8, c.worldY + (h2 - 0.5) * 32));
    return { x: nx, worldY: ny };
  }

  /** Start a smooth hop arc from the critter's exact current world position. */
  private beginHop(c: CritterState, layerId: LayerId, dest: { x: number; worldY: number }, i: number, t: number) {
    c.motion = MotionType.Hop;
    c.landing = false;
    c.fromX = c.x;
    c.fromWorldY = c.worldY;
    c.toX = dest.x;
    c.toWorldY = dest.worldY;
    c.dir = c.toX >= c.fromX ? 1 : -1;
    c.moveStartT = t;
    const hop = hopOf(layerId);
    c.moveDur = hop.dur + hash(c.stepCount * 13 + i) * hop.jitter;
  }

  /** Execute the critter's current motion and transition cleanly among its allowed `c.motions` set. */
  private stepMotion(
    c: CritterState,
    layerId: LayerId,
    i: number,
    dt: number,
    t: number,
    W: number,
    worldMinY: number,
    worldMaxY: number,
    props: readonly PropTop[],
    exiting: boolean,
  ): { hopFrac: number; beat: boolean } {
    let hopFrac = 0.5;
    let beat = false;

    switch (c.motion) {
      case MotionType.Perch: {
        hopFrac = 0;
        if (t >= c.motionUntilT && !exiting) {
          c.stepCount++;
          const r = hash(c.stepCount * 41 + i * 19 + this.seed);
          // Pick next motion from this critter's allowed set
          if (c.motions.has(MotionType.Fly)) {
            c.motion = MotionType.Fly;
            c.landing = false;
            c.dir = r > 0.5 ? 1 : -1;
            c.motionUntilT = t + 3.0 + r * 3.5;
            beat = true; // Chirp on takeoff!
          } else if (c.motions.has(MotionType.Patrol) && r < 0.62) {
            c.motion = MotionType.Patrol;
            c.motionUntilT = t + 2.5 + r * 2.5;
          } else if (c.motions.has(MotionType.Zip)) {
            c.motion = MotionType.Zip;
            c.motionUntilT = t + 3.0 + r * 3.0;
            beat = true;
          } else if (c.motions.has(MotionType.Hop)) {
            const dest = this.pickNearbyProp(c, props, i) ?? this.pickFallbackHop(c, W, worldMinY, worldMaxY, i);
            this.beginHop(c, layerId, dest, i, t);
            beat = true; // Synchronized bloop right on takeoff!
          }
        }
        break;
      }

      case MotionType.Hop: {
        const p = Math.min(1, (t - c.moveStartT) / Math.max(0.05, c.moveDur));
        hopFrac = p;
        const arcH = hopOf(layerId).arc;
        c.x = c.fromX + (c.toX - c.fromX) * p;
        c.worldY = c.fromWorldY + (c.toWorldY - c.fromWorldY) * p - Math.sin(p * Math.PI) * arcH;
        if (p >= 1) {
          c.x = c.toX;
          c.worldY = c.toWorldY;
          c.landedAtT = t;
          if (c.motions.has(MotionType.Perch)) {
            c.motion = MotionType.Perch;
            const pauseBase = hopOf(layerId).pause;
            c.motionUntilT = t + pauseBase + hash(c.stepCount * 19 + i * 23 + this.seed) * 0.75;
          } else {
            const dest = this.pickNearbyProp(c, props, i) ?? this.pickFallbackHop(c, W, worldMinY, worldMaxY, i);
            this.beginHop(c, layerId, dest, i, t);
          }
        }
        break;
      }

      case MotionType.Fly: {
        if (c.landing) {
          // Smooth glide down onto a prop top to perch (never teleports!)
          const p = Math.min(1, (t - c.moveStartT) / Math.max(0.1, c.moveDur));
          const ease = 1 - (1 - p) * (1 - p);
          c.x = c.fromX + (c.toX - c.fromX) * ease;
          c.worldY = c.fromWorldY + (c.toWorldY - c.fromWorldY) * ease - Math.sin(p * Math.PI) * 6;
          if (p >= 1) {
            c.x = c.toX;
            c.worldY = c.toWorldY;
            c.landing = false;
            c.landedAtT = t;
            c.motion = MotionType.Perch;
            c.motionUntilT = t + 1.4 + hash(c.stepCount * 17 + i * 29 + this.seed) * 1.8;
            beat = true; // Happy chirp on landing!
          }
        } else {
          c.x += c.dir * dt * 22 * c.speed;
          c.worldY += Math.sin(t * 1.9 + c.phase) * dt * 10;
          if (c.x < 10) {
            c.x = 10;
            c.dir = 1;
          } else if (c.x > W - 18) {
            c.x = W - 18;
            c.dir = -1;
          }
          c.worldY = Math.max(worldMinY, Math.min(worldMaxY, c.worldY));
          // Periodically spot a nearby prop top and glide in to perch on it
          if (c.motions.has(MotionType.Perch) && t >= c.motionUntilT && !exiting) {
            const perch = this.pickNearbyProp(c, props, i, 140);
            if (perch) {
              c.landing = true;
              c.fromX = c.x;
              c.fromWorldY = c.worldY;
              c.toX = perch.x;
              c.toWorldY = perch.worldY;
              c.dir = c.toX >= c.fromX ? 1 : -1;
              c.moveStartT = t;
              c.moveDur = Math.max(0.55, Math.min(1.2, Math.hypot(c.toX - c.fromX, c.toWorldY - c.fromWorldY) / 70));
            } else {
              c.motionUntilT = t + 2.2 + hash(c.stepCount * 31 + i + this.seed) * 2.0;
            }
          }
        }
        break;
      }

      case MotionType.Patrol: {
        c.x += c.dir * dt * 16 * c.speed;
        if (c.x < 12) {
          c.x = 12;
          c.dir = 1;
          beat = true;
        } else if (c.x > W - 18) {
          c.x = W - 18;
          c.dir = -1;
          beat = true;
        }
        if (t >= c.motionUntilT && !exiting) {
          c.stepCount++;
          const r = hash(c.stepCount * 37 + i * 29 + this.seed);
          if (c.motions.has(MotionType.Hop) && r < 0.55) {
            const dest = this.pickNearbyProp(c, props, i, 110);
            if (dest) {
              this.beginHop(c, layerId, dest, i, t);
              beat = true;
            } else {
              c.motionUntilT = t + 2.0 + r * 2.0;
            }
          } else if (c.motions.has(MotionType.Perch)) {
            c.motion = MotionType.Perch;
            c.motionUntilT = t + 0.8 + r * 0.9;
          }
        }
        break;
      }

      case MotionType.Zip: {
        const cyc = (t * 0.55 * c.speed + c.phase) % 1.5;
        if (cyc < 1.0) {
          c.x += c.dir * dt * 32 * c.speed;
          if (c.x < 10) {
            c.x = 10;
            c.dir = 1;
            beat = true;
          } else if (c.x > W - 18) {
            c.x = W - 18;
            c.dir = -1;
            beat = true;
          }
        }
        if (c.motions.has(MotionType.Perch) && t >= c.motionUntilT && !exiting) {
          c.motion = MotionType.Perch;
          c.motionUntilT = t + 0.9 + hash(c.stepCount * 23 + i + this.seed) * 1.1;
        }
        break;
      }

      case MotionType.Scuttle: {
        c.x += c.dir * dt * 38 * c.speed;
        if (c.x < 10) {
          c.x = 10;
          c.dir = 1;
          beat = true;
        } else if (c.x > W - 16) {
          c.x = W - 16;
          c.dir = -1;
          beat = true;
        }
        break;
      }

      case MotionType.Float: {
        c.x += c.dir * dt * 12 * c.speed;
        if (c.x < 14) {
          c.x = 14;
          c.dir = 1;
          beat = true;
        } else if (c.x > W - 22) {
          c.x = W - 22;
          c.dir = -1;
          beat = true;
        }
        break;
      }

      case MotionType.Mirror: {
        const maxX = Math.max(24, W / 2 - 18);
        c.x += c.dir * dt * 15 * c.speed;
        c.worldY += Math.sin(t * 1.6 + c.phase) * dt * 7;
        if (c.x < 10) {
          c.x = 10;
          c.dir = 1;
          beat = true;
        } else if (c.x > maxX) {
          c.x = maxX;
          c.dir = -1;
          beat = true;
        }
        c.worldY = Math.max(worldMinY, Math.min(worldMaxY, c.worldY));
        break;
      }

      case MotionType.Grid: {
        if (t >= c.nextBeatT) {
          c.stepCount++;
          const stepX = (hash(c.stepCount * 17 + c.phase) > 0.35 ? c.dir : -c.dir) * 8;
          // Use multiples of 4px so Math.round(/4)*4 has zero downward bias
          const stepY = (Math.floor(hash(c.stepCount * 23 + c.phase) * 3) - 1) * 4;
          c.x = Math.max(10, Math.min(W - 14, R((c.x + stepX) / 4) * 4));
          c.worldY = Math.max(worldMinY, Math.min(worldMaxY, R((c.worldY + stepY) / 4) * 4));
          beat = true;
        }
        break;
      }

      case MotionType.Frozen:
        break;
    }

    // Periodic randomized vocalization beat for non-hopping motions
    if (c.motion !== MotionType.Hop && t >= c.nextBeatT) {
      c.nextBeatT = t + 1.8 + hash(Math.floor(t * 11) + c.phase + this.seed) * 2.6;
      beat = true;
    }

    return { hopFrac, beat };
  }

  private drawCritter(
    ctx: CanvasRenderingContext2D,
    layerId: LayerId,
    c: CritterState,
    rawX: number,
    rawY: number,
    dir: 1 | -1,
    t: number,
    col: (hex: string) => string,
    chirping: boolean,
    W: number,
    hopFrac: number,
    perched: boolean,
  ) {
    const x = R(rawX);
    const y = R(rawY);
    CRITTER_SPOTS.push({ x: x - 2, y: y - 3, w: 12, h: 11, layer: layerId });
    const variant = c.variant;
    const ink = col(darkestInk(LAYER_ART[layerId].palette));
    const grid = new Map<number, string>();
    const gkey = (dx: number, dy: number) => ((dy + 32) << 8) | (dx + 32);
    const px = (dx: number, dy: number, w: number, h: number, hex: string) => {
      const cHex = col(hex);
      const x0 = R(dx);
      const y0 = R(dy);
      const ww = R(w);
      const hh = R(h);
      for (let yy = 0; yy < hh; yy++) {
        for (let xx = 0; xx < ww; xx++) {
          grid.set(gkey(x0 + xx, y0 + yy), cHex);
        }
      }
    };
    const flushGrid = (ox: number, oy: number) => {
      ctx.fillStyle = ink;
      for (const k of grid.keys()) {
        const gx = (k & 0xff) - 32;
        const gy = (k >> 8) - 32;
        for (const [nx, ny] of [
          [gx - 1, gy],
          [gx + 1, gy],
          [gx, gy - 1],
          [gx, gy + 1],
        ] as const) {
          if (!grid.has(gkey(nx, ny))) ctx.fillRect(ox + nx, oy + ny, 1, 1);
        }
      }
      for (const [k, cHex] of grid) {
        const gx = (k & 0xff) - 32;
        const gy = (k >> 8) - 32;
        ctx.fillStyle = cHex;
        ctx.fillRect(ox + gx, oy + gy, 1, 1);
      }
    };

    // The layer draws its own critter (and, on odd variants where it has one, an alternate species).
    let mirrorPair = false;
    const env: SpriteEnv = {
      px,
      ink,
      t,
      phase: c.phase,
      variant,
      dir,
      perched,
      hopFrac,
      mirror() {
        mirrorPair = true;
      },
    };
    const spec = LAYER_ART[layerId].critters;
    if (isAltSpecies(layerId, variant)) spec.alt!.draw({ ...env, tick: Math.floor(t * 8 + c.phase) % 2 });
    else spec.draw(env);

    flushGrid(x, y);
    if (mirrorPair) flushGrid(W - x - 6, y);

    if (chirping) {
      ctx.fillStyle = col('#ffe25a');
      ctx.fillRect(x + 2, y - 5, 2, 1);
      ctx.fillStyle = col('#ffffff');
      ctx.fillRect(x + 3, y - 6, 1, 1);
    }

    // Subtle 2-pixel landing dust puff right at the feet when a critter touches down on a prop top
    const landAge = t - c.landedAtT;
    if (landAge >= 0 && landAge < 0.22) {
      const spread = Math.round((landAge / 0.22) * 3);
      ctx.fillStyle = col('#ebe6d6');
      ctx.fillRect(x - 2 - spread, y + 5, 1, 1);
      ctx.fillRect(x + 8 + spread, y + 5, 1, 1);
    }
  }
}
