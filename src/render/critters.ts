import { ALL_LAYER_IDS, DAILY_FALLBACK, type LayerId } from '../core/layers';
import { look } from '../looks';
import { FONT, hash, type Band } from './art';
import { SEAM_H } from './art-detailed';
import { LAYER_PALETTE, snapColor } from './palettes';

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

export const MotionType = {
  /** Free continuous flight through open space (gliding curves, flapping wings). */
  Fly: 'fly',
  /** Rest on a prop top or ledge (wings folded / squished gently) before the next action. */
  Perch: 'perch',
  /** Arced jump from one prop top to a nearby prop top — always starts where it landed. */
  Hop: 'hop',
  /** Brisk horizontal walking/patrolling along a lane. */
  Patrol: 'patrol',
  /** Burst-and-pause horizontal dashing (scheduling quanta). */
  Zip: 'zip',
  /** Rapid continuous horizontal scuttling along PCB traces. */
  Scuttle: 'scuttle',
  /** Slow, rigid metronomic floating/sweeping (no jumping or landing). */
  Float: 'float',
  /** Horizontally mirrored smooth gliding across the viewport centerline. */
  Mirror: 'mirror',
  /** Discrete orthogonal steps snapped to a 4px silicon grid. */
  Grid: 'grid',
  /** Motionless frozen silhouette. */
  Frozen: 'frozen',
} as const;

export type MotionType = (typeof MotionType)[keyof typeof MotionType];

/** Allowed motion set for each layer's species across all 29 Daily & Endless layers. */
export const SPECIES_MOTIONS: Record<LayerId, readonly MotionType[]> = {
  // Zone A — Above Application
  internet: [MotionType.Fly, MotionType.Perch],
  browser: [MotionType.Fly, MotionType.Perch],
  application: [MotionType.Fly, MotionType.Perch],
  // Zone B — Expanded Runtime & Libraries
  bytecode: [MotionType.Hop, MotionType.Perch],
  jit: [MotionType.Zip, MotionType.Perch],
  runtime: [MotionType.Hop, MotionType.Perch],
  libraries: [MotionType.Hop, MotionType.Perch],
  linker: [MotionType.Patrol, MotionType.Hop],
  // Zone C — Userspace & Expanded OS Kernel
  userspace: [MotionType.Patrol, MotionType.Hop, MotionType.Perch],
  'kernel-entry': [MotionType.Patrol, MotionType.Perch],
  kernel: [MotionType.Zip, MotionType.Perch],
  'kernel-arch': [MotionType.Zip, MotionType.Scuttle],
  // Zone D — Drivers, Bus & Firmware
  drivers: [MotionType.Scuttle],
  'bus-fabric': [MotionType.Scuttle, MotionType.Zip],
  firmware: [MotionType.Float],
  // Zone E — Expanded Hidden Rings & MINIX-Inside-ME
  vmm: [MotionType.Mirror, MotionType.Perch],
  'ring-1': [MotionType.Mirror],
  ept: [MotionType.Grid, MotionType.Mirror],
  'ring-2': [MotionType.Frozen],
  smram: [MotionType.Float],
  'ring-3': [MotionType.Grid],
  'me-minix-user': [MotionType.Patrol, MotionType.Perch],
  'me-minix-kern': [MotionType.Zip],
  // Zone F — Deep Silicon, Lithography & Physics
  uarch: [MotionType.Zip, MotionType.Mirror],
  rtl: [MotionType.Scuttle, MotionType.Grid],
  cmos: [MotionType.Scuttle, MotionType.Float],
  litho: [MotionType.Fly, MotionType.Float],
  bandgap: [MotionType.Float, MotionType.Grid],
  landauer: [MotionType.Float],
};

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

const COUNT_BY_LAYER: Record<LayerId, number> = {
  internet: 3,
  browser: 3,
  application: 3,
  bytecode: 3,
  jit: 3,
  runtime: 3,
  libraries: 3,
  linker: 3,
  userspace: 3,
  'kernel-entry': 3,
  kernel: 3,
  'kernel-arch': 3,
  drivers: 4,
  'bus-fabric': 4,
  firmware: 3,
  vmm: 2,
  'ring-1': 2,
  ept: 2,
  'ring-2': 3,
  smram: 2,
  'ring-3': 4,
  'me-minix-user': 4,
  'me-minix-kern': 3,
  uarch: 3,
  rtl: 4,
  cmos: 4,
  litho: 3,
  bandgap: 3,
  landauer: 2,
};

const EXIT_LABELS: Record<LayerId, readonly string[]> = {
  internet: ['TTL=0', 'dropped'],
  browser: ['unmounted', 'reflow'],
  application: ['closed', 'minimized'],
  bytecode: ['parsed', 'folded'],
  jit: ['deopt!', 'inlined'],
  runtime: ["GC'd!", 'swept!'],
  libraries: ['unloaded', 'dlclose'],
  linker: ['resolved', 'bound'],
  userspace: ['SIGTERM', 'reaped'],
  'kernel-entry': ['EACCES', 'trapped'],
  kernel: ['paged out!', 'preempted'],
  'kernel-arch': ['EOI', 'TLB flush'],
  drivers: ['unplugged', 'DMA done'],
  'bus-fabric': ['ARB lost', 'posted'],
  firmware: ['halt', 'POST ok'],
  vmm: ['virtio!', 'emulated'],
  'ring-1': ['vmexit', 'trapped'],
  ept: ['EPT viol!', 'remapped'],
  'ring-2': [''],
  smram: ['RSM', 'locked'],
  'ring-3': ['0x00', 'bit-rot'],
  'me-minix-user': ['AMT idle', 'IPC wait'],
  'me-minix-kern': ['SENDREC', 'blocked'],
  uarch: ['mispredict!', 'flushed'],
  rtl: ['metastable', 'latched'],
  cmos: ['leaked', 'drifted'],
  litho: ['diffracted', 'etched'],
  bandgap: ['tunneled!', 'recombined'],
  landauer: ['kT ln 2', 'erased'],
};

const R = Math.round;

/**
 * Compute the safe world-Y span for a layer band, avoiding top seam overlap (`SEAM_H`)
 * and clamping open-ended first/last bands so critters never spawn miles off-screen.
 */
function bandWorldRange(layerId: LayerId, b: Band): { minY: number; maxY: number } {
  const rawBottom = b.worldTop + (b.bottom - b.top);
  const isTopOpen = layerId === 'application' || layerId === 'internet';
  const isBotOpen = layerId === 'ring-3' || layerId === 'landauer';
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

  ensureSeed(seed: number) {
    if (seed === this.seed && this.byLayer.size > 0) return;
    this.seed = seed;
    this.lastGlobalCall = -Infinity;
    this.lastTByLayer.clear();
    this.byLayer.clear();
    ALL_LAYER_IDS.forEach((id, li) => {
      const n = COUNT_BY_LAYER[id];
      const allowed = SPECIES_MOTIONS[id];
      const list: CritterState[] = [];
      for (let i = 0; i < n; i++) {
        const s = seed * 131 + li * 37 + i * 17;
        const lifeDur = 14 + hash(s + 6) * 10;
        const motions = new Set<MotionType>(allowed);
        list.push({
          x: 0,
          worldY: 0,
          motions,
          motion: allowed[0]!,
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
          variant: i % 5,
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
    return this.byLayer.get(layerId) ?? [];
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
    if (!list) return;
    const W = b.w;
    const H = b.h;
    if (W < 24 || H < 24) return;

    const perLayer = look('palette') === 'per-layer';
    const pal = LAYER_PALETTE[layerId];
    const col = (hex: string) => (perLayer ? snapColor(hex, pal) : hex);
    const t = b.reduced || layerId === 'ring-2' ? 0 : b.t;
    const prevT = this.lastTByLayer.get(layerId);
    const rawGap = prevT !== undefined && t >= prevT ? t - prevT : 0;
    const dt = Math.min(0.1, rawGap);
    this.lastTByLayer.set(layerId, t);

    // If this band was off-screen (or reduced motion just toggled off), shift all timers forward by the unsimulated gap
    // so critters don't mass-despawn or fire simultaneous audio bursts on the first frame back in view.
    if (rawGap > 0.5 && !b.reduced && layerId !== 'ring-2') {
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
        const labels = EXIT_LABELS[layerId];
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
      c.motion = SPECIES_MOTIONS[layerId][0]!;
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

  /** Fallback local hop destination when no props are available (e.g. v2/v3 styles). */
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
    c.moveDur =
      layerId === 'libraries'
        ? 0.85 + hash(c.stepCount * 13 + i) * 0.3
        : 0.65 + hash(c.stepCount * 13 + i) * 0.25;
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
        const arcH = layerId === 'runtime' ? 16 : layerId === 'libraries' ? 10 : 12;
        c.x = c.fromX + (c.toX - c.fromX) * p;
        c.worldY = c.fromWorldY + (c.toWorldY - c.fromWorldY) * p - Math.sin(p * Math.PI) * arcH;
        if (p >= 1) {
          c.x = c.toX;
          c.worldY = c.toWorldY;
          c.landedAtT = t;
          if (c.motions.has(MotionType.Perch)) {
            c.motion = MotionType.Perch;
            const pauseBase = layerId === 'libraries' ? 0.85 : layerId === 'runtime' ? 0.45 : 0.6;
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
    const variant = c.variant;
    const px = (dx: number, dy: number, w: number, h: number, hex: string) => {
      ctx.fillStyle = col(hex);
      ctx.fillRect(x + dx, y + dy, w, h);
    };

    // Second species per layer: odd variants draw an alternate creature so each layer's fauna isn't uniform.
    const altDone = ((): boolean => {
      if (variant % 2 !== 1) return false;
      const tick = Math.floor(t * 8 + c.phase) % 2;
      switch (layerId) {
        case 'application': // butterfly
          px(0, tick ? 0 : 1, 3, 3, '#ff9fd0');
          px(4, tick ? 0 : 1, 3, 3, '#ffd166');
          px(3, 1, 1, 4, '#131118');
          return true;
        case 'internet': // tiny drone with blinking light
          px(1, 1, 5, 2, '#ffffff');
          px(0, 0, 2, 1, '#5b8ee6');
          px(5, 0, 2, 1, '#5b8ee6');
          px(3, 3, 1, 1, tick ? '#e6a23c' : '#59c08a');
          return true;
        case 'browser': // arrow cursor
          px(0, 0, 1, 6, '#ffffff');
          px(1, 1, 1, 4, '#ffffff');
          px(2, 2, 1, 2, '#ffffff');
          px(3, 3, 1, 1, '#ffffff');
          px(-1, -1, 1, 8, '#2a3358');
          return true;
        case 'bytecode': // opcode byte
          px(0, 0, 6, 4, '#333366');
          px(1, 1, 1, 2, '#ffcc33');
          px(3, 1, 2, 2, '#66cc99');
          return true;
        case 'jit': // flame wisp
          px(2, 3, 3, 3, '#ff6633');
          px(3, 1, 1, 3, '#ffff66');
          px(tick ? 2 : 4, 0, 1, 2, '#ffcc33');
          return true;
        case 'linker': // brass plug
          px(0, 1, 4, 3, '#aa5500');
          px(4, 2, 3, 1, '#ffff55');
          px(0, 0, 2, 1, '#ffffaa');
          return true;
        case 'kernel-entry': // padlock
          px(1, 0, 4, 2, '#aaaaaa');
          px(0, 2, 6, 4, '#55ffff');
          px(2, 3, 2, 2, '#000000');
          return true;
        case 'kernel-arch': // lightning bolt
          px(3, 0, 2, 2, '#ffff55');
          px(2, 2, 2, 2, '#ffff55');
          px(3, 4, 2, 2, '#ff5555');
          return true;
        case 'bus-fabric': // data packet
          px(0, 1, 6, 3, '#ffffff');
          px(1, 2, 4, 1, '#ff55ff');
          return true;
        case 'uarch': // speculative dot pair
          px(0, 1, 3, 3, '#aaaaaa');
          px(4, tick ? 0 : 2, 3, 3, '#555555');
          return true;
        case 'cmos': // electron-hole pair
          px(0, 1, 3, 3, '#ffffff');
          px(4, 1, 3, 3, '#24989c');
          px(1, 2, 1, 1, '#000000');
          return true;
        default:
          return false;
      }
    })();

    if (!altDone) switch (layerId) {
      // Bespoke Endless sprites for Zones A–F (distinct silhouettes instead of reusing Daily sprites!)
      case 'internet': {
        // Crisp white paper-plane packet swallow with trailing cyan packet dot
        px(dir > 0 ? 0 : 2, 2, 6, 2, '#ffffff');
        px(dir > 0 ? 2 : 1, 1, 4, 1, '#dfe6f6');
        px(dir > 0 ? 5 : 0, 2, 2, 1, '#5b8ee6');
        if (!perched) px(dir > 0 ? -3 : 9, 3, 2, 1, '#5fd3e0');
        break;
      }
      case 'browser': {
        // Glowing DOM firefly / mini pointer sprite
        const glow = Math.floor(t * 6 + c.phase) % 2 === 0;
        px(1, 1, 4, 4, glow ? '#59c08a' : '#5b8ee6');
        px(2, 2, 2, 2, '#ffffff');
        px(dir > 0 ? 5 : 0, 0, 1, 2, '#e6a23c');
        break;
      }
      case 'bytecode': {
        // Floating curly-brace / syntax token sprite
        px(1, 0, 4, 5, '#333366');
        px(2, 1, 2, 3, '#ffcc33');
        px(0, 2, 1, 1, '#ffff99');
        px(5, 2, 1, 1, '#ffff99');
        break;
      }
      case 'jit': {
        // Fiery orange-gold spark mite with trailing ember pixel
        px(1, 1, 4, 4, '#ff6633');
        px(2, 1, 2, 2, '#ffff66');
        px(dir > 0 ? -2 : 6, 2, 1, 1, '#ffcc33');
        break;
      }
      case 'linker': {
        // Brass plug-beetle carrying a gold symbol pin
        const leg = Math.floor(t * 10 + c.phase) % 2;
        px(0, 1, 6, 3, '#aa5500');
        px(1, 0, 4, 1, '#ffff55');
        px(dir > 0 ? 6 : -2, 2, 2, 1, '#ffffaa');
        px(1 + leg, 4, 1, 1, '#aaaaaa');
        px(4 - leg, 4, 1, 1, '#aaaaaa');
        break;
      }
      case 'kernel-entry': {
        // Shielded cyan gate-bot
        px(0, 0, 7, 5, '#000000');
        px(1, 1, 5, 3, '#55ffff');
        px(dir > 0 ? 4 : 1, 2, 2, 1, '#000000');
        px(2, 5, 3, 1, '#aaaaaa');
        break;
      }
      case 'kernel-arch': {
        // Winged red/yellow IRQ-spark
        const wing = Math.floor(t * 14 + c.phase) % 2 === 0;
        px(2, 1, 3, 3, '#ff5555');
        px(3, 2, 1, 1, '#ffff55');
        px(0, wing ? 0 : 2, 2, 1, '#ffff55');
        px(5, wing ? 0 : 2, 2, 1, '#ffff55');
        break;
      }
      case 'bus-fabric': {
        // High-speed magenta/white PCIe lane-runner
        px(0, 1, 7, 2, '#ff55ff');
        px(dir > 0 ? 5 : 0, 1, 2, 2, '#ffffff');
        break;
      }
      case 'vmm':
      case 'ept': {
        // Hollow wireframe ghost-wisp (mirrored pair)
        const drawGhost = (wx: number) => {
          ctx.fillStyle = col('#aaaaaa');
          ctx.fillRect(wx, y, 6, 1);
          ctx.fillRect(wx, y + 4, 6, 1);
          ctx.fillRect(wx, y, 1, 5);
          ctx.fillRect(wx + 5, y, 1, 5);
          ctx.fillStyle = col('#ffffff');
          ctx.fillRect(wx + 2, y + 2, 2, 1);
        };
        drawGhost(x);
        drawGhost(W - x - 6);
        break;
      }
      case 'smram': {
        // Silent silver vault sentinel
        px(1, 0, 4, 5, '#808080');
        px(2, 1, 2, 3, '#c0c0c0');
        px(2, 2, 2, 1, '#ffffff');
        break;
      }
      case 'me-minix-user': {
        // Miniature 4×4 uncanny amber micro-daemon
        const step = perched ? 0 : Math.floor(t * 8 + c.phase) % 2;
        px(0, 0, 1, 1, '#ffffff');
        px(3, 0, 1, 1, '#ffffff');
        px(0, 1, 4, 3, '#aaaaaa');
        px(1, 2, 1, 1, '#000000');
        px(2, 2, 1, 1, '#000000');
        px(0 + step, 4, 1, 1, '#555555');
        px(3 - step, 4, 1, 1, '#555555');
        break;
      }
      case 'me-minix-kern': {
        // Crisp tiny IPC courier packet
        px(0, 1, 6, 3, '#aaaaaa');
        px(1, 0, 4, 1, '#ffffff');
        px(dir > 0 ? 5 : 0, 2, 1, 1, '#ffffff');
        break;
      }
      case 'uarch': {
        // Speculative phantom: hollow flickering μop glider
        const ghost = Math.floor(t * 6 + c.phase) % 2 === 0;
        px(0, 1, 6, 4, ghost ? '#ffffff' : '#aaaaaa');
        px(1, 2, 4, 2, '#000000');
        px(dir > 0 ? 6 : -1, 2, 1, 2, '#ffffff');
        break;
      }
      case 'rtl': {
        // Logic pulse glider
        px(0, 2, 7, 1, '#aaaaaa');
        px(dir > 0 ? 3 : 1, 0, 3, 3, '#ffffff');
        px(dir > 0 ? 4 : 2, 1, 1, 1, '#000000');
        break;
      }
      case 'cmos': {
        // Charge carrier orb moving across wafer masks
        const body = variant % 2 === 0 ? '#e88438' : '#24989c';
        px(1, 0, 4, 4, body);
        px(0, 1, 6, 2, body);
        px(2, 1, 2, 2, '#ffffff');
        break;
      }
      case 'litho': {
        // Shimmering EUV photon
        const pulse = Math.floor(t * 7 + c.phase) % 2 === 0;
        px(2, 0, 1, 5, pulse ? '#ffffff' : '#aaaaaa');
        px(0, 2, 5, 1, pulse ? '#ffffff' : '#aaaaaa');
        px(2, 2, 1, 1, '#ffffff');
        break;
      }
      case 'bandgap': {
        // Tunneling electron cloud
        px(1, 1, 4, 4, '#555555');
        px(2, 2, 2, 2, '#ffffff');
        px(0, 2, 1, 1, '#aaaaaa');
        px(5, 3, 1, 1, '#aaaaaa');
        break;
      }
      case 'landauer': {
        // Lone stray bit in the void
        const bit = Math.floor(t * 2 + c.phase) % 2 === 0;
        px(1, 1, bit ? 2 : 3, 3, '#ffffff');
        if (!bit) px(2, 2, 1, 1, '#000000');
        break;
      }
      default:
        // All 10 Daily layers + tinted intermediate Endless layers share their family sprite (palette-snapped!)
        switch (DAILY_FALLBACK[layerId]) {
      case 'application': {
        const bodies = ['#ff5f7a', '#ffd166', '#4cc9f0', '#7ee0a1', '#c58bff'];
        const bellies = ['#ffe5ec', '#fff6d6', '#e0f7ff', '#e8fff0', '#f3e8ff'];
        const body = bodies[variant % bodies.length]!;
        const belly = bellies[variant % bellies.length]!;
        const flap = !perched && Math.floor(t * 9 + c.phase) % 2 === 0;
        px(0, 1, 7, 5, '#131118');
        px(1, 1, 5, 4, body);
        px(2, 3, 3, 2, belly);
        if (variant === 0 || variant === 2) px(dir > 0 ? 4 : 1, -1, 2, 1, body);
        // Wings fold neatly against the body when perched, flap smoothly when flying
        px(2, perched ? 2 : flap ? -1 : 2, 3, perched ? 1 : 2, '#ffffff');
        const hx = dir > 0 ? 5 : -1;
        px(hx, 0, 3, 3, body);
        px(dir > 0 ? 6 : 0, 0, 1, 1, '#131118');
        px(dir > 0 ? 8 : -2, 1, 2, 1, '#ffb000');
        px(dir > 0 ? -2 : 7, 2, 2, 1, body);
        if (perched) {
          // Tiny feet gripping the prop top
          px(2, 6, 1, 1, '#ffb000');
          px(4, 6, 1, 1, '#ffb000');
        }
        break;
      }
      case 'runtime': {
        const bodies = ['#5fd3e0', '#7ee0a1', '#f5d76e', '#ff9f43', '#c58bff'];
        const body = bodies[variant % bodies.length]!;
        const squish = perched || hopFrac < 0.1 || hopFrac > 0.9;
        const tall = !squish && variant === 1 ? 1 : 0;
        const topY = squish ? 1 : -tall;
        if (squish) {
          // Rounded squished dome (never a flat box)
          px(0, 1, 7, 5, '#0b0b14');
          px(-1, 2, 9, 4, '#0b0b14');
          px(1, 1, 5, 1, body);
          px(0, 2, 7, 3, body);
          px(2, 1, 2, 1, '#ffffff');
        } else {
          // Rounded hopping dome
          px(1, topY, 5, 6 + tall, '#0b0b14');
          px(0, 1, 7, 5, '#0b0b14');
          px(1, topY, 5, 5 + tall, body);
          px(0, 1, 7, 4, body);
          px(2, topY, 2, 1, '#ffffff');
        }
        // Attach ears / antenna directly to the dome crown (`topY`) so they never float detached
        if (variant === 3) {
          px(1, topY - 2, 1, 2, body);
          px(5, topY - 2, 1, 2, body);
        } else if (variant === 4) {
          px(3, topY - 2, 1, 2, '#ffe25a');
        }
        const ex = dir > 0 ? 2 : 1;
        const ey = squish ? 3 : 2;
        px(ex, ey, 1, 1, '#131118');
        px(ex + 3, ey, 1, 1, '#131118');
        break;
      }
      case 'libraries': {
        const bodies = ['#e6c785', '#7ec8e3', '#d990a8', '#8fd694', '#c5a3ff'];
        const body = bodies[variant % bodies.length]!;
        const squish = perched;
        px(0, squish ? 2 : 1, 6, squish ? 4 : 5, '#0b0b14');
        px(1, squish ? 2 : 1, 4, squish ? 3 : 4, body);
        px(0, squish ? 3 : 2, 6, 3, body);
        px(1, squish ? 0 : -1, 4, 2, variant % 2 === 0 ? '#fff5d6' : '#ff6f7d');
        px(2, squish ? 0 : -1, 2, 2, '#ffb000');
        px(dir > 0 ? 2 : 1, 3, 1, 1, '#131118');
        px(dir > 0 ? 4 : 3, 3, 1, 1, '#131118');
        break;
      }
      case 'userspace': {
        const bodies = ['#ff5555', '#ff9f43', '#ff55ff', '#55ffff', '#ffff55'];
        const darks = ['#aa0000', '#aa5500', '#aa00aa', '#00aaaa', '#aa5500'];
        const body = bodies[variant % bodies.length]!;
        const dark = darks[variant % darks.length]!;
        const step = perched ? 0 : Math.floor(t * 7 + c.phase) % 2;
        px(0, -1, 1, 2, body);
        px(5, -1, 1, 2, body);
        px(0, 1, 6, 5, '#000000');
        px(1, 1, 4, 4, dark);
        px(0, 2, 6, 2, body);
        px(1, 2, 1, 1, '#ffff55');
        px(4, 2, 1, 1, '#ffff55');
        px(1, 5, 1, 1 + step, dark);
        px(4, 5, 1, 2 - step, dark);
        px(dir > 0 ? 7 : -2, 2 + step, 2, 2, '#ffff55');
        break;
      }
      case 'kernel': {
        const visors = ['#55ffff', '#55ff55', '#ffff55', '#ff55ff'];
        const visor = visors[variant % visors.length]!;
        const blink = Math.floor(t * 5 + c.phase) % 2 === 0;
        px(3, -2, 1, 2, '#aaaaaa');
        px(3, -3, 1, 1, blink ? '#ff5555' : '#ffff55');
        px(0, 0, 8, 6, '#000000');
        px(1, 0, 6, 5, '#aaaaaa');
        px(dir > 0 ? 3 : 1, 1, 4, 2, visor);
        px(1, 6, 2, 1, '#555555');
        px(5, 6, 2, 1, '#555555');
        break;
      }
      case 'drivers': {
        const leg = Math.floor(t * 14 + c.phase) % 2;
        const body = variant % 2 === 0 ? '#55ffff' : '#ff55ff';
        px(0, 1, 6, 3, body);
        px(1, 0, 4, 1, '#ffffff');
        px(0 + leg, 4, 1, 1, '#ffffff');
        px(4 - leg, 4, 1, 1, '#ffffff');
        break;
      }
      case 'firmware': {
        const pulse = Math.floor(t * 2 + c.phase) % 2 === 0;
        px(1, 0, 6, 1, '#8cff9c');
        px(0, 1, 8, 4, '#1ea046');
        px(2, 2, 4, 2, pulse ? '#ffffff' : '#0a461e');
        px(1, 5, 6, 1, '#8cff9c');
        break;
      }
      case 'ring-1': {
        const drawWisp = (wx: number) => {
          ctx.fillStyle = col('#1ea046');
          ctx.fillRect(wx, y + 1, 6, 3);
          ctx.fillStyle = col('#8cff9c');
          ctx.fillRect(wx + 1, y, 4, 5);
          ctx.fillStyle = col('#ffffff');
          ctx.fillRect(wx + 2, y + 2, 2, 1);
        };
        drawWisp(x);
        drawWisp(W - x - 6);
        break;
      }
      case 'ring-2': {
        if (variant % 3 === 0) {
          px(1, 1, 5, 3, '#bebebe');
          px(2, -1, 3, 2, '#f0f0f0');
          px(6, 0, 2, 2, '#bebebe');
        } else if (variant % 3 === 1) {
          px(0, 0, 7, 5, '#bebebe');
          px(2, 2, 1, 1, '#0c0c0c');
          px(5, 2, 1, 1, '#0c0c0c');
        } else {
          px(1, 0, 6, 5, '#bebebe');
          px(3, -2, 1, 2, '#f0f0f0');
          px(2, 1, 4, 2, '#0c0c0c');
        }
        break;
      }
      case 'ring-3': {
        const bit = Math.floor(t * 3 + c.phase) % 2 === 0;
        if (bit) {
          px(1, 0, 2, 5, '#e8eeff');
        } else {
          px(0, 0, 4, 5, '#e8eeff');
          px(1, 1, 2, 3, '#040406');
        }
        break;
      }
        }
        break;
    }

    if (chirping) {
      px(2, -5, 2, 1, '#ffe25a');
      px(3, -6, 1, 1, '#ffffff');
    }

    // Subtle 2-pixel landing dust puff right at the feet when a critter touches down on a prop top
    const landAge = t - c.landedAtT;
    if (landAge >= 0 && landAge < 0.22) {
      const spread = Math.round((landAge / 0.22) * 3);
      px(-2 - spread, 5, 1, 1, '#ebe6d6');
      px(8 + spread, 5, 1, 1, '#ebe6d6');
    }
  }
}
