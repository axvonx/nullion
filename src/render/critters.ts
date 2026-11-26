import { LAYERS, type LayerId } from '../core/layers';
import { look } from '../looks';
import { hash, type Band } from './art';
import { LAYER_PALETTE, snapColor } from './palettes';

/**
 * The System Biosphere: living pixel-art critters unique to each of the 10 layers of the software stack.
 *
 * Life simplifies and becomes more mechanical/alien as you descend:
 *   Application  → pixel songbirds flapping in gentle arcs
 *   Runtime      → bouncy helper blobs hopping with squash-and-stretch
 *   Libraries    → calmer bookworm blobs carrying tiny scrolls
 *   OS userspace → little horned daemons patrolling with flickering lanterns
 *   Kernel       → brisk thread-bots zipping along horizontal lanes with antenna pips
 *   Drivers      → fast glowing bus-beetles scuttling along PCB traces
 *   Firmware     → rigid green-phosphor sentinel drones on metronomic sweeps
 *   Ring −1      → twin synchronized mirror-wisps gliding symmetrically across center
 *   Ring −2      → frozen mid-leap grayscale silhouettes (zero motion, dead silence)
 *   Ring −3      → stark 1-bit bit-motes hopping on a 90° silicon grid
 *
 * All motion runs on `artTime` (so WOMM's freeze and Ring −2 hold them mid-flap/mid-hop, and reducedMotion
 * keeps them calmly perched). When a visible critter vocalizes, it emits `{ layer, pan }` straight to the
 * sound engine and pops a tiny 2px visual chirp pip above its head!
 */

export interface CritterCall {
  layer: LayerId;
  /** Stereo pan -0.85..+0.85 matching the critter's horizontal screen position. */
  pan: number;
}

interface CritterSlot {
  /** Base horizontal phase 0..1 */
  xSeed: number;
  /** Relative vertical position 0.14..0.86 inside the band */
  yFrac: number;
  /** Direction (+1 or -1) */
  dir: 1 | -1;
  /** Speed multiplier */
  speed: number;
  /** Animation phase offset */
  phase: number;
  /** Color variant index */
  variant: number;
  /** Next artTime (seconds) this critter will vocalize */
  nextCall: number;
  /** Last artTime this critter vocalized (for tiny visual chirp pip) */
  calledAt: number;
}

const COUNT_BY_LAYER: Record<LayerId, number> = {
  application: 3,
  runtime: 3,
  libraries: 3,
  userspace: 3,
  kernel: 4,
  drivers: 4,
  firmware: 3,
  'ring-1': 2, // 2 mirrored pairs = 4 wisps
  'ring-2': 3, // frozen silhouettes
  'ring-3': 4,
};

const R = Math.round;

export class CritterSystem {
  private seed = -1;
  private byLayer = new Map<LayerId, CritterSlot[]>();
  private lastGlobalCall = -Infinity;

  /** Rebuild deterministic critter slots when the daily world seed changes. */
  ensureSeed(seed: number) {
    if (seed === this.seed && this.byLayer.size > 0) return;
    this.seed = seed;
    this.lastGlobalCall = -Infinity;
    this.byLayer.clear();
    LAYERS.forEach((l, li) => {
      const n = COUNT_BY_LAYER[l.id];
      const list: CritterSlot[] = [];
      for (let i = 0; i < n; i++) {
        const s = seed * 131 + li * 37 + i * 17;
        list.push({
          xSeed: hash(s + 1),
          yFrac: 0.16 + ((i + 0.3 + hash(s + 2) * 0.4) / n) * 0.68,
          dir: hash(s + 3) > 0.5 ? 1 : -1,
          speed: 0.75 + hash(s + 4) * 0.55,
          phase: hash(s + 5) * 20,
          variant: i % 3,
          nextCall: 1.2 + hash(s + 6) * 3.2 + i * 1.1,
          calledAt: -10,
        });
      }
      this.byLayer.set(l.id, list);
    });
  }

  /**
   * Draw all critters inside band `b` for `layerId`. If `emitCalls` is true (the current active layer),
   * invokes `onCall` when a visible critter chirps/hops/zips so audio and visual pip stay locked in sync.
   */
  drawBand(
    ctx: CanvasRenderingContext2D,
    layerId: LayerId,
    b: Band,
    emitCalls: boolean,
    onCall?: (ev: CritterCall) => void,
  ) {
    const list = this.byLayer.get(layerId);
    if (!list) return;
    const perLayer = look('palette') === 'per-layer';
    const pal = LAYER_PALETTE[layerId];
    const col = (hex: string) => (perLayer ? snapColor(hex, pal) : hex);
    const t = b.reduced || layerId === 'ring-2' ? 0 : b.t;
    const bandH = Math.max(80, Math.min(480, b.bottom - b.top));
    const W = b.w;
    const H = b.h;

    for (let i = 0; i < list.length; i++) {
      const c = list[i]!;
      const baseY = b.top + bandH * c.yFrac;
      if (baseY < -24 || baseY > H + 24) continue;

      const pos = this.position(layerId, c, W, baseY, t);
      const { x, y, dir } = pos;

      // Trigger vocalization + visual chirp pip when visible on screen and artTime advances.
      if (emitCalls && !b.reduced && layerId !== 'ring-2' && t > 0 && x > 6 && x < W - 6 && y > 12 && y < H - 12) {
        if (t < this.lastGlobalCall) this.lastGlobalCall = -Infinity;
        if (t >= c.nextCall && t - this.lastGlobalCall >= 1.45) {
          c.calledAt = t;
          this.lastGlobalCall = t;
          c.nextCall = t + 2.6 + hash(Math.floor(t * 7) + i * 29 + this.seed) * 3.0;
          const pan = Math.max(-0.85, Math.min(0.85, (x / Math.max(1, W)) * 2 - 1));
          onCall?.({ layer: layerId, pan });
        }
      }

      const chirping = !b.reduced && t - c.calledAt >= 0 && t - c.calledAt < 0.28;
      this.drawCritter(ctx, layerId, c, x, y, dir, t, col, chirping, W);
    }
  }

  private position(
    layerId: LayerId,
    c: CritterSlot,
    W: number,
    baseY: number,
    t: number,
  ): { x: number; y: number; dir: 1 | -1 } {
    const span = Math.max(40, W - 20);
    const wrapX = (raw: number) => (((raw % (W + 16)) + (W + 16)) % (W + 16)) - 8;
    const pingPong = (rate: number) => {
      const ph = ((c.xSeed * 2 + t * rate * c.speed) % 2 + 2) % 2;
      const goingRight = ph < 1;
      const f = goingRight ? ph : 2 - ph;
      return { x: 10 + f * span, dir: (goingRight ? 1 : -1) as 1 | -1 };
    };

    switch (layerId) {
      case 'application': {
        // Songbirds fly in smooth horizontal arcs across the sky
        const x = wrapX(c.xSeed * W + c.dir * t * 18 * c.speed);
        const y = baseY + Math.sin(t * 2.1 + c.phase) * 7;
        return { x, y, dir: c.dir };
      }
      case 'runtime': {
        // Helper blobs hop in bouncy parabolic arcs
        const hopT = (t * 1.45 * c.speed + c.phase) % 1;
        const hopY = -Math.sin(hopT * Math.PI) * 7;
        const pp = pingPong(0.08);
        return { x: pp.x, y: baseY + hopY, dir: pp.dir };
      }
      case 'libraries': {
        // Bookworm blobs hop more calmly and gently
        const hopT = (t * 0.9 * c.speed + c.phase) % 1;
        const hopY = -Math.sin(hopT * Math.PI) * 4;
        const pp = pingPong(0.05);
        return { x: pp.x, y: baseY + hopY, dir: pp.dir };
      }
      case 'userspace': {
        // Daemons patrol briskly back and forth with a small mischievous bob
        const pp = pingPong(0.09);
        const y = baseY + Math.sin(t * 5 + c.phase) * 1.5;
        return { x: pp.x, y, dir: pp.dir };
      }
      case 'kernel': {
        // Thread-bots zip along horizontal lanes, pausing briefly between bursts (like scheduling quanta)
        const cyc = (t * 0.55 * c.speed + c.phase) % 1.4;
        const move = cyc < 1 ? cyc : 1;
        const laps = Math.floor((t * 0.55 * c.speed + c.phase) / 1.4);
        const x = wrapX(c.xSeed * W + c.dir * (laps + move) * 42);
        return { x, y: baseY, dir: c.dir };
      }
      case 'drivers': {
        // Bus-beetles scuttle fast along horizontal PCB lanes
        const x = wrapX(c.xSeed * W + c.dir * t * 34 * c.speed);
        return { x, y: baseY, dir: c.dir };
      }
      case 'firmware': {
        // Sentinel drones make rigid, metronomic sweeps
        const pp = pingPong(0.055);
        return { x: pp.x, y: baseY, dir: pp.dir };
      }
      case 'ring-1': {
        // Mirror-wisps glide on the left half; drawCritter mirrors the twin on the right half!
        const half = Math.max(24, W / 2 - 22);
        const ph = ((c.xSeed * 2 + t * 0.1 * c.speed) % 2 + 2) % 2;
        const f = ph < 1 ? ph : 2 - ph;
        const x = 10 + f * half;
        const y = baseY + Math.sin(t * 1.8 + c.phase) * 5;
        return { x, y, dir: ph < 1 ? 1 : -1 };
      }
      case 'ring-2': {
        // Frozen mid-air silhouettes: static position
        const x = 14 + c.xSeed * (W - 28);
        return { x, y: baseY, dir: c.dir };
      }
      case 'ring-3': {
        // Bit-motes make crisp 90° quantized grid hops
        const step = Math.floor(t * 2.2 * c.speed + c.phase);
        const gx = Math.round(((c.xSeed * W + step * 10 * c.dir) % W + W) % W / 4) * 4;
        const gy = Math.round((baseY + ((step % 3) - 1) * 6) / 4) * 4;
        return { x: gx, y: gy, dir: c.dir };
      }
    }
  }

  private drawCritter(
    ctx: CanvasRenderingContext2D,
    layerId: LayerId,
    c: CritterSlot,
    rawX: number,
    rawY: number,
    dir: 1 | -1,
    t: number,
    col: (hex: string) => string,
    chirping: boolean,
    W: number,
  ) {
    const x = R(rawX);
    const y = R(rawY);
    const px = (dx: number, dy: number, w: number, h: number, hex: string) => {
      ctx.fillStyle = col(hex);
      ctx.fillRect(x + dx, y + dy, w, h);
    };

    switch (layerId) {
      case 'application': {
        // Little pixel songbird (3 bright variants) with 2-frame flapping wing
        const bodies = ['#ff6f7d', '#ffd166', '#4cc9f0'];
        const body = bodies[c.variant]!;
        const flap = Math.floor(t * 9 + c.phase) % 2 === 0;
        // Shadow/outline under belly
        px(0, 2, 5, 3, '#1a1a2e');
        px(1, 1, 4, 3, body);
        // Wing
        px(2, flap ? -1 : 2, 2, 2, '#ffffff');
        // Head + eye + beak
        const hx = dir > 0 ? 4 : -1;
        px(hx, 0, 2, 2, body);
        px(dir > 0 ? 5 : -1, 0, 1, 1, '#1a1a2e');
        px(dir > 0 ? 6 : -2, 1, 1, 1, '#ffb000');
        // Tail
        px(dir > 0 ? -1 : 5, 2, 2, 1, body);
        break;
      }
      case 'runtime': {
        // Bouncy helper blob with squash/stretch and bright little eyes
        const bodies = ['#5fd3e0', '#7ee0a1', '#f5d76e'];
        const body = bodies[c.variant]!;
        const hopT = (t * 1.45 * c.speed + c.phase) % 1;
        const squish = hopT < 0.14 || hopT > 0.88;
        if (squish) {
          px(-1, 2, 8, 3, '#0b0b14');
          px(0, 2, 6, 2, body);
        } else {
          px(0, 0, 6, 5, '#0b0b14');
          px(1, 0, 4, 4, body);
          px(0, 1, 6, 3, body);
        }
        // Little eyes
        const ex = dir > 0 ? 2 : 1;
        px(ex, 1, 1, 1, '#131118');
        px(ex + 2, 1, 1, 1, '#131118');
        break;
      }
      case 'libraries': {
        // Calmer bookworm blob carrying a tiny pixel scroll/book on its head
        const bodies = ['#e6c785', '#7ec8e3', '#d990a8'];
        const body = bodies[c.variant]!;
        px(0, 1, 5, 4, '#0b0b14');
        px(1, 1, 3, 3, body);
        px(0, 2, 5, 2, body);
        // Tiny parchment scroll on top
        px(1, -1, 3, 2, '#fff5d6');
        px(2, -1, 1, 2, '#ffb000');
        // Eyes
        px(dir > 0 ? 2 : 1, 2, 1, 1, '#131118');
        px(dir > 0 ? 4 : 3, 2, 1, 1, '#131118');
        break;
      }
      case 'userspace': {
        // Little horned daemon patrolling with a glowing eye + bobbing amber lantern
        const step = Math.floor(t * 6 + c.phase) % 2;
        // Horns
        px(0, -1, 1, 2, '#ff5555');
        px(4, -1, 1, 2, '#ff5555');
        // Body
        px(1, 1, 3, 4, '#aa0000');
        px(0, 2, 5, 2, '#ff5555');
        // Glowing yellow eyes
        px(1, 2, 1, 1, '#ffff55');
        px(3, 2, 1, 1, '#ffff55');
        // Feet
        px(1, 5, 1, 1 + step, '#aa0000');
        px(3, 5, 1, 2 - step, '#aa0000');
        // Tiny lantern held forward
        px(dir > 0 ? 6 : -2, 2 + step, 2, 2, '#ffff55');
        break;
      }
      case 'kernel': {
        // Brisk pixel thread-bot with blinking antenna + wheels
        const blink = Math.floor(t * 4 + c.phase) % 2 === 0;
        // Antenna
        px(3, -2, 1, 2, '#aaaaaa');
        px(3, -3, 1, 1, blink ? '#ff5555' : '#ffff55');
        // Chassis
        px(0, 0, 7, 5, '#000000');
        px(1, 0, 5, 4, '#aaaaaa');
        // Visor
        px(dir > 0 ? 3 : 1, 1, 3, 1, '#55ffff');
        // Wheels
        px(1, 5, 2, 1, '#555555');
        px(4, 5, 2, 1, '#555555');
        break;
      }
      case 'drivers': {
        // Fast glowing bus-beetle with alternating legs
        const leg = Math.floor(t * 14 + c.phase) % 2;
        const body = c.variant % 2 === 0 ? '#55ffff' : '#ff55ff';
        px(0, 1, 5, 2, body);
        px(1, 0, 3, 1, '#ffffff');
        // Scuttling legs
        px(0 + leg, 3, 1, 1, '#ffffff');
        px(3 - leg, 3, 1, 1, '#ffffff');
        break;
      }
      case 'firmware': {
        // Minimal green-phosphor geometric sentinel drone
        const pulse = Math.floor(t * 2 + c.phase) % 2 === 0;
        px(1, 0, 5, 1, '#8cff9c');
        px(0, 1, 7, 3, '#1ea046');
        px(2, 2, 3, 1, pulse ? '#ffffff' : '#0a461e');
        px(1, 4, 5, 1, '#8cff9c');
        break;
      }
      case 'ring-1': {
        // Twin synchronized mirror-wisps (left + mirrored right!)
        const drawWisp = (wx: number) => {
          ctx.fillStyle = col('#8cff9c');
          ctx.fillRect(wx + 1, y, 3, 3);
          ctx.fillStyle = col('#ffffff');
          ctx.fillRect(wx + 2, y + 1, 1, 1);
          ctx.fillStyle = col('#1ea046');
          ctx.fillRect(wx, y + 1, 1, 1);
          ctx.fillRect(wx + 4, y + 1, 1, 1);
        };
        drawWisp(x);
        drawWisp(W - x - 5);
        break;
      }
      case 'ring-2': {
        // Frozen mid-leap grayscale silhouettes (bird / blob / bot caught in amber-less time)
        if (c.variant === 0) {
          px(1, 1, 4, 2, '#bebebe');
          px(2, -1, 2, 2, '#f0f0f0');
          px(5, 0, 2, 2, '#bebebe');
        } else if (c.variant === 1) {
          px(0, 0, 6, 4, '#bebebe');
          px(2, 1, 1, 1, '#0c0c0c');
          px(4, 1, 1, 1, '#0c0c0c');
        } else {
          px(1, 0, 5, 4, '#bebebe');
          px(3, -2, 1, 2, '#f0f0f0');
          px(2, 1, 3, 1, '#0c0c0c');
        }
        break;
      }
      case 'ring-3': {
        // Stark 1-bit pixel spark / bit-mote
        const bit = Math.floor(t * 3 + c.phase) % 2 === 0;
        if (bit) {
          px(1, 0, 2, 4, '#e8eeff');
        } else {
          px(0, 0, 4, 4, '#e8eeff');
          px(1, 1, 2, 2, '#040406');
        }
        break;
      }
    }

    // Tiny 2px visual chirp/signal pip above the critter when it vocalizes!
    if (chirping) {
      px(2, -5, 2, 1, '#ffe25a');
      px(3, -6, 1, 1, '#ffffff');
    }
  }
}
