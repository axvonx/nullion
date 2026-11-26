import { LAYERS, type LayerId } from '../core/layers';
import { look } from '../looks';
import { hash, type Band } from './art';
import { LAYER_PALETTE, snapColor } from './palettes';

/**
 * The System Biosphere: living pixel-art critters unique to each of the 10 layers of the software stack.
 *
 * Critters react directly to the placed v4 props around them (via `spots`, the flat [x, y, w, h, ...] array
 * of visible near-plane props) and synchronize their vocalizations to their actual physical beats:
 *   - Application:  5 songbird variants flying in arcs between window tops, perching briefly & chirping on takeoff
 *   - Runtime:      5 bouncy helper-blob variants hopping directly from prop top to prop top, blooping right on launch
 *   - Libraries:    5 calmer bookworm-blob variants (carrying scrolls/books) hopping between shelves & stacks
 *   - OS userspace: 5 horned daemon variants patrolling & hopping between ledges, muttering on turn/hop
 *   - Kernel:       6 thread-bot variants zipping between machine-room props, chirping on launch/reverse
 *   - Drivers:      6 bus-beetle variants scuttling fast between PCB components, skittering on turn
 *   - Firmware:     4 sentinel-drone variants on metronomic sweeps, pinging on scan-eye pulse
 *   - Ring −1:      3 twin mirror-wisp pairs gliding symmetrically across center, shimmering at turn points
 *   - Ring −2:      4 frozen mid-leap grayscale silhouettes (zero motion, dead silence)
 *   - Ring −3:      6 stark 1-bit bit-motes making 90° grid hops, snapping on each hop
 */

export interface CritterCall {
  layer: LayerId;
  /** Stereo pan -0.85..+0.85 matching the critter's horizontal screen position. */
  pan: number;
}

interface CritterSlot {
  xSeed: number;
  yFrac: number;
  dir: 1 | -1;
  speed: number;
  phase: number;
  variant: number;
  /** Last discrete motion cycle index (hop / perch / burst / pulse), so audio fires in exact sync with motion. */
  lastBeat: number;
  /** Last artTime this critter vocalized (for tiny visual chirp/signal pip). */
  calledAt: number;
}

interface PropTop {
  cx: number;
  top: number;
  left: number;
  right: number;
}

const COUNT_BY_LAYER: Record<LayerId, number> = {
  application: 5,
  runtime: 5,
  libraries: 5,
  userspace: 5,
  kernel: 6,
  drivers: 6,
  firmware: 4,
  'ring-1': 3, // 3 mirrored pairs = 6 wisps
  'ring-2': 4, // frozen silhouettes
  'ring-3': 6,
};

const R = Math.round;

/** Extract usable prop tops inside the visible band for critters to hop between / perch on. */
function bandProps(spots: readonly number[], b: Band): PropTop[] {
  const out: PropTop[] = [];
  const yMin = Math.max(8, b.top + 6);
  const yMax = Math.min(b.h - 8, b.bottom - 6);
  for (let i = 0; i + 3 < spots.length; i += 4) {
    const x = spots[i]!;
    const y = spots[i + 1]!;
    const w = spots[i + 2]!;
    if (w < 6 || y < yMin || y > yMax || x + w < 6 || x > b.w - 6) continue;
    out.push({ cx: x + w / 2, top: y, left: x, right: x + w });
  }
  return out;
}

export class CritterSystem {
  private seed = -1;
  private byLayer = new Map<LayerId, CritterSlot[]>();
  private lastGlobalCall = -Infinity;

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
          yFrac: 0.14 + ((i + 0.25 + hash(s + 2) * 0.5) / n) * 0.72,
          dir: hash(s + 3) > 0.5 ? 1 : -1,
          speed: 0.78 + hash(s + 4) * 0.5,
          phase: hash(s + 5) * 20,
          variant: i % 5,
          lastBeat: -1,
          calledAt: -10,
        });
      }
      this.byLayer.set(l.id, list);
    });
  }

  /**
   * Draw all critters inside band `b` for `layerId`. `spots` is the flat [x, y, w, h, ...] array of visible
   * near props (e.g. `ENTITY_SPOTS`), allowing blobs/birds/daemons/bots to bounce between and react to props!
   */
  drawBand(
    ctx: CanvasRenderingContext2D,
    layerId: LayerId,
    b: Band,
    emitCalls: boolean,
    onCall?: (ev: CritterCall) => void,
    spots: readonly number[] = [],
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
    const props = bandProps(spots, b);

    for (let i = 0; i < list.length; i++) {
      const c = list[i]!;
      const baseY = b.top + bandH * c.yFrac;
      if (baseY < -28 || baseY > H + 28) continue;

      const pos = this.position(layerId, c, i, W, baseY, t, props);
      const { x, y, dir, beat, hopFrac, perched } = pos;

      // Fire synchronized vocalization right on the critter's physical beat (hop launch, takeoff, turn, pulse)!
      if (emitCalls && !b.reduced && layerId !== 'ring-2' && t > 0 && x > 6 && x < W - 6 && y > 12 && y < H - 12) {
        if (t < this.lastGlobalCall) this.lastGlobalCall = -Infinity;
        if (beat !== c.lastBeat) {
          c.lastBeat = beat;
          if (t - this.lastGlobalCall >= 0.85) {
            c.calledAt = t;
            this.lastGlobalCall = t;
            const pan = Math.max(-0.85, Math.min(0.85, (x / Math.max(1, W)) * 2 - 1));
            onCall?.({ layer: layerId, pan });
          }
        }
      }

      const chirping = !b.reduced && t - c.calledAt >= 0 && t - c.calledAt < 0.28;
      this.drawCritter(ctx, layerId, c, x, y, dir, t, col, chirping, W, hopFrac, perched);
    }
  }

  /** Pick a deterministic pair of nearby props for a critter to bounce/flit between on cycle `beat`. */
  private propHop(
    props: readonly PropTop[],
    _c: CritterSlot,
    i: number,
    beat: number,
    frac: number,
    arcH: number,
  ): { x: number; y: number; dir: 1 | -1 } | null {
    if (props.length < 2) return null;
    const pick = (step: number) => Math.floor(hash(this.seed * 19 + i * 53 + step * 31) * props.length) % props.length;
    const aIdx = pick(beat);
    let bIdx = pick(beat + 1);
    if (bIdx === aIdx) bIdx = (aIdx + 1) % props.length;
    const a = props[aIdx]!;
    const b = props[bIdx]!;
    // Keep hops local: if the two props are very far apart, step toward a closer neighbour.
    let target = b;
    if (Math.hypot(b.cx - a.cx, b.top - a.top) > 140) {
      let best = b;
      let bestD = Infinity;
      for (let k = 0; k < props.length; k++) {
        if (k === aIdx) continue;
        const p = props[k]!;
        const d = Math.hypot(p.cx - a.cx, p.top - a.top);
        if (d > 14 && d < bestD) {
          bestD = d;
          best = p;
        }
      }
      target = best;
    }
    const x = a.cx + (target.cx - a.cx) * frac;
    const linearY = a.top - 5 + (target.top - a.top) * frac;
    const arc = Math.sin(frac * Math.PI) * arcH;
    return { x, y: linearY - arc, dir: target.cx >= a.cx ? 1 : -1 };
  }

  private position(
    layerId: LayerId,
    c: CritterSlot,
    i: number,
    W: number,
    baseY: number,
    t: number,
    props: readonly PropTop[],
  ): { x: number; y: number; dir: 1 | -1; beat: number; hopFrac: number; perched: boolean } {
    const span = Math.max(40, W - 20);
    const wrapX = (raw: number) => (((raw % (W + 16)) + (W + 16)) % (W + 16)) - 8;
    const pingPong = (rate: number) => {
      const raw = c.xSeed * 2 + t * rate * c.speed;
      const beat = Math.floor(raw);
      const ph = ((raw % 2) + 2) % 2;
      const goingRight = ph < 1;
      const f = goingRight ? ph : 2 - ph;
      return { x: 10 + f * span, dir: (goingRight ? 1 : -1) as 1 | -1, beat };
    };

    switch (layerId) {
      case 'application': {
        // Songbirds fly between window tops and perch briefly (0..0.28 perched, 0.28..1 flying in a gentle arc)
        const rate = 0.42 * c.speed;
        const raw = t * rate + c.phase;
        const beat = Math.floor(raw);
        const f = raw - beat;
        const perched = f < 0.28;
        const flyF = perched ? 0 : (f - 0.28) / 0.72;
        const hopped = this.propHop(props, c, i, beat, flyF, 14);
        if (hopped) return { ...hopped, beat, hopFrac: flyF, perched };
        const x = wrapX(c.xSeed * W + c.dir * t * 18 * c.speed);
        const y = baseY + Math.sin(t * 2.1 + c.phase) * 7;
        return { x, y, dir: c.dir, beat, hopFrac: flyF, perched: false };
      }
      case 'runtime': {
        // Helper blobs bounce directly from prop top to prop top! Brief squish-pause (0..0.22), then parabolic hop (0.22..1).
        const rate = 0.85 * c.speed;
        const raw = t * rate + c.phase;
        const beat = Math.floor(raw);
        const f = raw - beat;
        const perched = f < 0.22;
        const hopFrac = perched ? 0 : (f - 0.22) / 0.78;
        const hopped = this.propHop(props, c, i, beat, hopFrac, 16);
        if (hopped) return { ...hopped, beat, hopFrac, perched };
        const pp = pingPong(0.08);
        return { x: pp.x, y: baseY - Math.sin(hopFrac * Math.PI) * 9, dir: pp.dir, beat, hopFrac, perched };
      }
      case 'libraries': {
        // Bookworm blobs hop more gently & slower between shelves/stacks
        const rate = 0.55 * c.speed;
        const raw = t * rate + c.phase;
        const beat = Math.floor(raw);
        const f = raw - beat;
        const perched = f < 0.32;
        const hopFrac = perched ? 0 : (f - 0.32) / 0.68;
        const hopped = this.propHop(props, c, i, beat, hopFrac, 11);
        if (hopped) return { ...hopped, beat, hopFrac, perched };
        const pp = pingPong(0.05);
        return { x: pp.x, y: baseY - Math.sin(hopFrac * Math.PI) * 6, dir: pp.dir, beat, hopFrac, perched };
      }
      case 'userspace': {
        // Daemons patrol on prop tops & hop between nearby ledges/pipes
        const rate = 0.52 * c.speed;
        const raw = t * rate + c.phase;
        const beat = Math.floor(raw);
        const f = raw - beat;
        const perched = f < 0.35;
        const hopFrac = perched ? 0 : (f - 0.35) / 0.65;
        const hopped = this.propHop(props, c, i, beat, hopFrac, 9);
        if (hopped) return { ...hopped, beat, hopFrac, perched };
        const pp = pingPong(0.09);
        return { x: pp.x, y: baseY + Math.sin(t * 5 + c.phase) * 1.5, dir: pp.dir, beat: pp.beat, hopFrac: 0.5, perched: false };
      }
      case 'kernel': {
        // Thread-bots zip briskly between props with short scheduling pauses
        const rate = 0.62 * c.speed;
        const raw = t * rate + c.phase;
        const beat = Math.floor(raw);
        const f = raw - beat;
        const perched = f < 0.25;
        const hopFrac = perched ? 0 : (f - 0.25) / 0.75;
        const hopped = this.propHop(props, c, i, beat, hopFrac, 4);
        if (hopped) return { ...hopped, beat, hopFrac, perched };
        const x = wrapX(c.xSeed * W + c.dir * (beat + hopFrac) * 44);
        return { x, y: baseY, dir: c.dir, beat, hopFrac, perched };
      }
      case 'drivers': {
        // Bus-beetles scuttle fast back and forth along horizontal PCB tracks (reversing at prop boundaries)
        const pp = pingPong(0.16);
        return { x: pp.x, y: baseY, dir: pp.dir, beat: pp.beat, hopFrac: 0.5, perched: false };
      }
      case 'firmware': {
        // Sentinel drones sweep metronomically; beat ticks on scan-eye pulse
        const pp = pingPong(0.06);
        const beat = Math.floor(t * 0.45 + c.phase);
        return { x: pp.x, y: baseY, dir: pp.dir, beat, hopFrac: 0.5, perched: false };
      }
      case 'ring-1': {
        // Mirror-wisps glide symmetrically across center; beat ticks at turn points
        const half = Math.max(24, W / 2 - 22);
        const raw = c.xSeed * 2 + t * 0.12 * c.speed;
        const beat = Math.floor(raw);
        const ph = ((raw % 2) + 2) % 2;
        const f = ph < 1 ? ph : 2 - ph;
        const x = 10 + f * half;
        const y = baseY + Math.sin(t * 1.8 + c.phase) * 5;
        return { x, y, dir: ph < 1 ? 1 : -1, beat, hopFrac: 0.5, perched: false };
      }
      case 'ring-2': {
        const x = 14 + c.xSeed * (W - 28);
        return { x, y: baseY, dir: c.dir, beat: 0, hopFrac: 0.5, perched: false };
      }
      case 'ring-3': {
        // Bit-motes make crisp 90° grid hops; beat ticks on every hop
        const step = Math.floor(t * 1.6 * c.speed + c.phase);
        const gx = Math.round((((c.xSeed * W + step * 10 * c.dir) % W + W) % W) / 4) * 4;
        const gy = Math.round((baseY + ((step % 3) - 1) * 6) / 4) * 4;
        return { x: gx, y: gy, dir: c.dir, beat: step, hopFrac: 0.5, perched: false };
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
    hopFrac: number,
    perched: boolean,
  ) {
    const x = R(rawX);
    const y = R(rawY);
    const px = (dx: number, dy: number, w: number, h: number, hex: string) => {
      ctx.fillStyle = col(hex);
      ctx.fillRect(x + dx, y + dy, w, h);
    };

    switch (layerId) {
      case 'application': {
        // 5 vibrant pixel songbird variants (robin, canary, bluejay, mint-finch, lavender-wren)
        const bodies = ['#ff5f7a', '#ffd166', '#4cc9f0', '#7ee0a1', '#c58bff'];
        const bellies = ['#ffe5ec', '#fff6d6', '#e0f7ff', '#e8fff0', '#f3e8ff'];
        const body = bodies[c.variant % bodies.length]!;
        const belly = bellies[c.variant % bellies.length]!;
        const flap = !perched && Math.floor(t * 10 + c.phase) % 2 === 0;
        // Dark outline base
        px(0, 1, 7, 5, '#131118');
        px(1, 1, 5, 4, body);
        px(2, 3, 3, 2, belly);
        // Crest on variants 0 & 2
        if (c.variant === 0 || c.variant === 2) px(dir > 0 ? 4 : 1, -1, 2, 1, body);
        // Wing
        px(2, flap ? -1 : 2, 3, 2, '#ffffff');
        // Head + eye + beak
        const hx = dir > 0 ? 5 : -1;
        px(hx, 0, 3, 3, body);
        px(dir > 0 ? 6 : 0, 0, 1, 1, '#131118');
        px(dir > 0 ? 8 : -2, 1, 2, 1, '#ffb000');
        // Tail
        px(dir > 0 ? -2 : 7, 2, 2, 1, body);
        break;
      }
      case 'runtime': {
        // 5 bouncy helper-blob variants (round, tall, wide, twin-ear, spiky) with expressive squash/stretch
        const bodies = ['#5fd3e0', '#7ee0a1', '#f5d76e', '#ff9f43', '#c58bff'];
        const body = bodies[c.variant % bodies.length]!;
        const squish = perched || hopFrac < 0.1 || hopFrac > 0.9;
        if (squish) {
          px(-1, 2, 9, 4, '#0b0b14');
          px(0, 2, 7, 3, body);
          px(1, 2, 5, 1, '#ffffff');
        } else {
          const tall = c.variant === 1 ? 1 : 0;
          px(0, -tall, 7, 6 + tall, '#0b0b14');
          px(1, -tall, 5, 5 + tall, body);
          px(0, 1, 7, 4, body);
          px(2, -tall, 3, 1, '#ffffff');
        }
        // Little ears / antenna on variants 3 & 4
        if (c.variant === 3) {
          px(1, -2, 1, 2, body);
          px(5, -2, 1, 2, body);
        } else if (c.variant === 4) {
          px(3, -2, 1, 2, '#ffe25a');
        }
        const ex = dir > 0 ? 2 : 1;
        px(ex, 2, 1, 1, '#131118');
        px(ex + 3, 2, 1, 1, '#131118');
        break;
      }
      case 'libraries': {
        // 5 calmer bookworm-blob variants carrying tiny scrolls/books/glasses
        const bodies = ['#e6c785', '#7ec8e3', '#d990a8', '#8fd694', '#c5a3ff'];
        const body = bodies[c.variant % bodies.length]!;
        const squish = perched;
        px(0, squish ? 2 : 1, 6, squish ? 4 : 5, '#0b0b14');
        px(1, squish ? 2 : 1, 4, squish ? 3 : 4, body);
        px(0, squish ? 3 : 2, 6, 3, body);
        // Tiny scroll or stacked book on top
        px(1, squish ? 0 : -1, 4, 2, c.variant % 2 === 0 ? '#fff5d6' : '#ff6f7d');
        px(2, squish ? 0 : -1, 2, 2, '#ffb000');
        px(dir > 0 ? 2 : 1, 3, 1, 1, '#131118');
        px(dir > 0 ? 4 : 3, 3, 1, 1, '#131118');
        break;
      }
      case 'userspace': {
        // 5 little horned daemon variants (crimson, ember, violet, teal-imp, gold-imp) with bobbing lanterns
        const bodies = ['#ff5555', '#ff9f43', '#ff55ff', '#55ffff', '#ffff55'];
        const darks = ['#aa0000', '#aa5500', '#aa00aa', '#00aaaa', '#aa5500'];
        const body = bodies[c.variant % bodies.length]!;
        const dark = darks[c.variant % darks.length]!;
        const step = perched ? 0 : Math.floor(t * 7 + c.phase) % 2;
        // Horns
        px(0, -1, 1, 2, body);
        px(5, -1, 1, 2, body);
        // Body
        px(0, 1, 6, 5, '#000000');
        px(1, 1, 4, 4, dark);
        px(0, 2, 6, 2, body);
        // Glowing eyes
        px(1, 2, 1, 1, '#ffff55');
        px(4, 2, 1, 1, '#ffff55');
        // Feet
        px(1, 5, 1, 1 + step, dark);
        px(4, 5, 1, 2 - step, dark);
        // Bobbing lantern
        px(dir > 0 ? 7 : -2, 2 + step, 2, 2, '#ffff55');
        break;
      }
      case 'kernel': {
        // 4 thread-bot chassis variants (visor cyan, green, amber, magenta) with blinking antenna
        const visors = ['#55ffff', '#55ff55', '#ffff55', '#ff55ff'];
        const visor = visors[c.variant % visors.length]!;
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
        // Fast glowing bus-beetles with alternating scuttling legs
        const leg = Math.floor(t * 14 + c.phase) % 2;
        const body = c.variant % 2 === 0 ? '#55ffff' : '#ff55ff';
        px(0, 1, 6, 3, body);
        px(1, 0, 4, 1, '#ffffff');
        px(0 + leg, 4, 1, 1, '#ffffff');
        px(4 - leg, 4, 1, 1, '#ffffff');
        break;
      }
      case 'firmware': {
        // Green-phosphor geometric sentinel drones (diamond, box, visor)
        const pulse = Math.floor(t * 2 + c.phase) % 2 === 0;
        px(1, 0, 6, 1, '#8cff9c');
        px(0, 1, 8, 4, '#1ea046');
        px(2, 2, 4, 2, pulse ? '#ffffff' : '#0a461e');
        px(1, 5, 6, 1, '#8cff9c');
        break;
      }
      case 'ring-1': {
        // Synchronized twin mirror-wisps (left + exact mirrored right)
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
        // Frozen mid-leap grayscale silhouettes
        if (c.variant % 3 === 0) {
          px(1, 1, 5, 3, '#bebebe');
          px(2, -1, 3, 2, '#f0f0f0');
          px(6, 0, 2, 2, '#bebebe');
        } else if (c.variant % 3 === 1) {
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
        // Stark 1-bit pixel spark / bit-mote
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

    // Visual chirp/signal pip above the critter right when it vocalizes!
    if (chirping) {
      px(2, -5, 2, 1, '#ffe25a');
      px(3, -6, 1, 1, '#ffffff');
    }
  }
}
