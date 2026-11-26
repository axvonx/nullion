import { enforce } from '../core/enforce';
import { LAYERS, type LayerId } from '../core/layers';
import { look } from '../looks';
import { BYTECODE, DMESG, FONT, LIBS, PROCS, hash, type Art, type Band } from './art';
import { OBJ, SPINES, SEAM_H, ACCENTS, gear, glow, line, offscreen, pix, prows, px, thread, threadPoint, tiled, vgrad, vis } from './art-detailed';
import { LAYER_PALETTE, snapColor, type PaletteMode } from './palettes';

/**
 * Layer art v3 (look `artStyle: v3`, the default): every layer is a dense mix of small props drawn from its
 * themes, instead of one big motif. Kernel machinery sits between dmesg screens; libraries mix shelves, symbol
 * threads and little linker presses; userspace mixes towers, daemons and process signs.
 *
 * - Props are placed on a jittered grid of cells, seeded by world row (hash), so nothing shimmers.
 * - Near a boundary, cells borrow props from the neighbouring layer, so layers bleed into each other.
 * - Every solid colour goes through c(), which snaps it onto the drawing layer's palette levels. Borrowed props
 *   therefore stay clean instead of dithering; only light (glows, gradients) dithers.
 * - Animation runs on T, which is b.t (frozen in Ring −2) or 0 under reduced motion, so reduced motion is static.
 */

type Ctx = CanvasRenderingContext2D;
type Prop = (ctx: Ctx, x: number, y: number, s: number, b: Band) => void;

const R = Math.round;
const TAU = Math.PI * 2;

// ---------------------------------------------------------------------------------------------
// Palette-snapped colour, fog for the far plane, and the per-band animation clock.

let mode: PaletteMode = 'full';
let fog: [number, number, number] = [0, 0, 0];
let fogged = false;
let T = 0;
const colourCache = new Map<string, string>();

function blend(hex: string, to: [number, number, number], k: number): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number, i: number) => R(v + (to[i]! - v) * k);
  const r = ch(n >> 16, 0);
  const g = ch((n >> 8) & 255, 1);
  const bl = ch(n & 255, 2);
  return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, '0')}`;
}

/** A solid colour, snapped to the current band's palette (and pushed into the fog on the far plane). */
function c(hex: string): string {
  const key = `${mode}|${fogged ? fog.join(',') : ''}|${hex}`;
  let v = colourCache.get(key);
  if (v === undefined) {
    v = snapColor(fogged ? blend(hex, fog, 0.55) : hex, mode);
    colourCache.set(key, v);
  }
  return v;
}

const FOG: Record<LayerId, [number, number, number]> = {
  application: [150, 190, 235],
  runtime: [0, 0, 51],
  libraries: [0, 0, 0],
  userspace: [0, 0, 0],
  kernel: [0, 0, 0],
  drivers: [0, 0, 0],
  firmware: [0, 0, 0],
  'ring-1': [0, 0, 0],
  'ring-2': [0, 0, 0],
  'ring-3': [0, 0, 0],
};

/** Start drawing a band: pick its palette, fog and clock. Every layer function calls this first. */
function use(id: LayerId, b: Band) {
  mode = look('palette') === 'per-layer' ? LAYER_PALETTE[id] : 'full';
  fog = FOG[id];
  fogged = false;
  T = b.reduced ? 0 : b.t;
}

function text(ctx: Ctx, s: string, x: number, y: number, col: string) {
  ctx.font = FONT;
  ctx.fillStyle = c(col);
  ctx.fillText(s, R(x), R(y));
}

function rect(ctx: Ctx, x: number, y: number, w: number, h: number, col: string) {
  px(ctx, x, y, w, h, c(col));
}

/** Cached sprite whose colours are snapped for the current palette and fog. */
function sprite(key: string, rows: string[], pal: Record<string, string>): HTMLCanvasElement {
  const snapped = Object.fromEntries(Object.entries(pal).map(([k, v]) => [k, c(v)]));
  return pix(`v3-${key}-${mode}-${fogged ? 'f' : ''}`, rows, snapped);
}

function blit(ctx: Ctx, img: HTMLCanvasElement, x: number, y: number, flip = false) {
  if (!flip) {
    ctx.drawImage(img, R(x), R(y));
    return;
  }
  ctx.save();
  ctx.translate(R(x) + img.width, R(y));
  ctx.scale(-1, 1);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

/** A 1-pixel-wide cog: hub plus four teeth, turning with angle a. */
function cog(ctx: Ctx, cx: number, cy: number, a: number, body: string, hi: string) {
  rect(ctx, cx - 1, cy - 1, 3, 3, body);
  for (let k = 0; k < 4; k++) {
    const t = a + (k * TAU) / 4;
    rect(ctx, cx + Math.cos(t) * 2.4, cy + Math.sin(t) * 2.4, 1, 1, body);
  }
  rect(ctx, cx, cy, 1, 1, hi);
}

const pickOf = <T>(arr: readonly T[], h: number): T => arr[Math.floor(h * arr.length)]!;
const mod = (n: number, m: number) => ((n % m) + m) % m;

// ---------------------------------------------------------------------------------------------
// Application props (full colour).

const accent = (s: number) => pickOf(ACCENTS, hash(s + 11));

const appWin: Prop = (ctx, x, y, s) => {
  const w = 11 + R(hash(s) * 8);
  const h = 8 + R(hash(s + 1) * 4);
  const [a, a2] = accent(s);
  rect(ctx, x + 1, y + 1, w + 1, h + 1, '#3a4a8a');
  rect(ctx, x - 1, y - 1, w + 2, h + 2, '#2a3358');
  rect(ctx, x, y, w, 2, a2);
  rect(ctx, x, y, w, 1, a);
  rect(ctx, x + w - 2, y, 1, 1, '#ff6159');
  rect(ctx, x, y + 2, w, h - 2, '#f3efe6');
  if (hash(s + 2) > 0.5) {
    rect(ctx, x + 1, y + 3, 3, 3, a);
    for (let l = 0; l * 2 + 4 < h; l++) rect(ctx, x + (l < 2 ? 5 : 1), y + 3 + l * 2, (w - 6) * (0.4 + hash(s + 9 + l) * 0.6), 1, '#a8acb8');
  } else {
    for (let k = 0; k * 3 + 2 < w; k++) {
      const hh = 1 + R((h - 5) * hash(s + 20 + k));
      rect(ctx, x + 1 + k * 3, y + h - 1 - hh, 2, hh, k % 2 ? a : a2);
    }
  }
};

const appCloud: Prop = (ctx, x, y, s) => {
  const w = 9 + R(hash(s) * 10);
  rect(ctx, x + 2, y - 2, w - 5, 2, '#ffffff');
  rect(ctx, x + 4 + R(hash(s + 1) * 3), y - 3, 3, 1, '#ffffff');
  rect(ctx, x, y, w, 3, '#ffffff');
  rect(ctx, x + 1, y + 3, w - 2, 1, '#c8d6f0');
};

const appToast: Prop = (ctx, x, y, s) => {
  const [a] = accent(s);
  rect(ctx, x + 1, y + 1, 15, 6, '#3a4a8a');
  rect(ctx, x, y, 15, 6, '#ffffff');
  rect(ctx, x, y + 5, 15, 1, '#dfe6f6');
  rect(ctx, x + 1, y + 1, 3, 3, a);
  rect(ctx, x + 5, y + 1, 8, 1, '#55607a');
  rect(ctx, x + 5, y + 3, 5, 1, '#a8acb8');
};

const appSpinner: Prop = (ctx, x, y, s) => {
  const [a, a2] = accent(s);
  rect(ctx, x - 1, y - 1, 9, 9, '#f3efe6');
  rect(ctx, x - 1, y - 1, 9, 1, '#ffffff');
  const head = Math.floor(T * 9 + hash(s) * 8) % 8;
  for (let k = 0; k < 8; k++) {
    const t = (k * TAU) / 8;
    const d = mod(head - k, 8);
    rect(ctx, x + 3 + R(Math.cos(t) * 2.6), y + 3 + R(Math.sin(t) * 2.6), 1, 1, d === 0 ? a2 : d < 3 ? a : '#d8d2c4');
  }
};

const appProgress: Prop = (ctx, x, y, s) => {
  const [a] = accent(s);
  const w = 15 + R(hash(s) * 6);
  rect(ctx, x - 1, y - 1, w + 2, 6, '#2a3358');
  rect(ctx, x, y, w, 4, '#f3efe6');
  const p = Math.min(1, (T * 0.12 + hash(s + 1)) % 1.25);
  rect(ctx, x + 1, y + 1, R((w - 2) * p), 2, a);
};

const appIcon: Prop = (ctx, x, y, s) => {
  const [a, a2] = accent(s);
  rect(ctx, x + 1, y, 5, 7, a2);
  rect(ctx, x, y + 1, 7, 5, a2);
  rect(ctx, x + 1, y + 1, 5, 2, a);
  rect(ctx, x + 1, y + 1, 2, 1, '#ffffff');
  if (hash(s + 3) > 0.6) rect(ctx, x + 5, y - 1, 2, 2, '#ff6159');
};

const appBubble: Prop = (ctx, x, y, s) => {
  const mine = hash(s) > 0.5;
  const body = mine ? '#5b8ee6' : '#ffffff';
  rect(ctx, x + 1, y, 12, 6, body);
  rect(ctx, x, y + 1, 14, 4, body);
  rect(ctx, mine ? x + 11 : x + 2, y + 6, 2, 1, body);
  rect(ctx, x + 2, y + 2, 8, 1, mine ? '#dfe6f6' : '#a8acb8');
  rect(ctx, x + 2, y + 4 - 1 + 1, 5, 0, '#a8acb8');
};

// ---------------------------------------------------------------------------------------------
// Runtime props (rgb6): heap objects on girders, references, GC sweepers and mark bits.

const girder = (ctx: Ctx, x: number, y: number, w: number) => {
  rect(ctx, x, y, w, 2, '#666699');
  rect(ctx, x, y, w, 1, '#9999cc');
  rect(ctx, x + 2, y + 2, 1, 4, '#333366');
  rect(ctx, x + w - 3, y + 2, 1, 4, '#333366');
};

const rtObjects: Prop = (ctx, x, y, s) => {
  const w = 16 + R(hash(s) * 8);
  const gy = y + 10;
  girder(ctx, x, gy, w);
  let ref = -1;
  for (let ox = x + 1, n = 0; ox < x + w - 3; n++) {
    const ow = 2 + R(hash(s + n * 3) * 2);
    const oh = 2 + R(hash(s + n * 3 + 1) * 3);
    if (hash(s + n * 3 + 2) > 0.3) {
      const [body, lit] = pickOf(OBJ, hash(s + n * 5 + 7));
      rect(ctx, ox, gy - oh, ow, oh, body);
      rect(ctx, ox, gy - oh, ow, 1, lit);
      if (ref < 0 && oh > 2) ref = ox;
    } else rect(ctx, ox, gy - 2, ow, 2, '#333333');
    ox += ow + 1;
  }
  if (ref >= 0) {
    rect(ctx, ref, y, 1, 5, '#6666cc');
    rect(ctx, ref, y, 6, 1, '#6666cc');
  }
};

const SWEEPER_ROWS = ['  kk  ', ' kmck ', 'kmmmmb', 'kddddb', ' w  w '];
const SWEEPER_PAL = { k: '#000033', m: '#9999ff', c: '#66ffff', d: '#6666cc', w: '#9999cc', b: '#ffcc33' };

const rtSweeper: Prop = (ctx, x, y, s) => {
  const w = 30;
  const gy = y + 10;
  girder(ctx, x, gy, w);
  const sx = x - 6 + mod(T * 7 + hash(s) * 40, 40);
  for (let k = 0; k < 6; k++) {
    const ox = x + 2 + k * 5;
    // Garbage just behind the sweeper is gone; the rest waits.
    const dead = hash(s + k) > 0.5;
    if (dead && ox < sx && ox > sx - 22) continue;
    const [body, lit] = dead ? ['#333333', '#666666'] : pickOf(OBJ, hash(s + k + 30));
    rect(ctx, ox, gy - 3, 3, 3, body);
    rect(ctx, ox, gy - 3, 3, 1, lit);
  }
  if (sx > x - 6 && sx < x + w) blit(ctx, sprite('sweeper', SWEEPER_ROWS, SWEEPER_PAL), sx, gy - 5);
};

const rtBytecode: Prop = (ctx, x, y, s) => {
  text(ctx, pickOf(BYTECODE, hash(s)).split(' ')[0]!, x, y + 7, '#6666cc');
};

const rtMarks: Prop = (ctx, x, y, s) => {
  rect(ctx, x - 1, y - 1, 15, 5, '#333366');
  const slot = Math.floor(T * 0.9);
  for (let k = 0; k < 4; k++) rect(ctx, x + k * 3 + 1, y, 2, 3, hash(s + k * 7 + slot * 13) > 0.5 ? '#ffff99' : '#000033');
};

const rtRef: Prop = (ctx, x, y, s) => {
  const [a] = pickOf(OBJ, hash(s));
  const [b2] = pickOf(OBJ, hash(s + 1));
  const dx = 12 + R(hash(s + 2) * 8);
  rect(ctx, x, y, 4, 4, a);
  rect(ctx, x + dx, y + 8, 4, 4, b2);
  rect(ctx, x + 2, y + 4, 1, 6, '#6666cc');
  rect(ctx, x + 2, y + 9, dx - 3, 1, '#6666cc');
  rect(ctx, x + dx - 2, y + 8, 1, 3, '#9999ff');
};

const rtHeapColumn: Prop = (ctx, x, y, s) => {
  for (let k = 0; k < 4; k++) {
    const w = 4 + R(hash(s + k) * 8);
    const [body, lit] = pickOf(OBJ, hash(s + k + 9));
    rect(ctx, x, y + k * 3, w, 2, body);
    rect(ctx, x, y + k * 3, 1, 2, lit);
  }
  rect(ctx, x - 1, y - 1, 1, 13, '#333366');
};

// ---------------------------------------------------------------------------------------------
// Libraries props (rgb4): shelves, symbol threads, little linker presses, plaques, lamps.

const libShelf: Prop = (ctx, x, y, s) => {
  const w = 15 + R(hash(s) * 9);
  rect(ctx, x - 1, y, w + 2, 13, '#550000');
  rect(ctx, x, y + 1, w, 10, '#000000');
  for (let bx = x, n = 0; bx < x + w - 1; n++) {
    const bw = 1 + R(hash(s + n * 3));
    const bh = 5 + R(hash(s + n * 3 + 1) * 4);
    if (hash(s + n * 3 + 2) > 0.08) {
      rect(ctx, bx, y + 11 - bh, bw, bh, pickOf(SPINES, hash(s + n * 7 + 5)));
      if (bh > 7) rect(ctx, bx, y + 12 - bh, bw, 1, '#ffaa00');
    }
    bx += bw;
  }
  rect(ctx, x - 1, y + 11, w + 2, 2, '#aa5500');
  rect(ctx, x - 1, y + 11, w + 2, 1, '#ffaa55');
};

const libThread: Prop = (ctx, x, y, s) => {
  const x1 = x + 18 + R(hash(s) * 12);
  const ya = y + 2;
  const yb = y + 2 + R((hash(s + 1) - 0.5) * 10);
  const sag = 4 + hash(s + 2) * 5;
  thread(ctx, x, ya, x1, yb, sag, c('#aa5500'));
  rect(ctx, x - 1, ya - 1, 3, 3, '#ffaa55');
  rect(ctx, x1 - 1, yb - 1, 3, 3, '#ffaa55');
  const [bx, by] = threadPoint(x, ya, x1, yb, sag, (T * 0.3 + hash(s + 3)) % 1);
  rect(ctx, bx - 1, by - 1, 2, 2, '#ffff55');
};

const libLinker: Prop = (ctx, x, y, s) => {
  // A tiny press stamping relocations into a card, driven by a cog.
  const stroke = R((Math.sin(T * 3 + hash(s) * 6) + 1) * 1.5);
  rect(ctx, x, y + 11, 15, 2, '#aa5500');
  rect(ctx, x, y + 11, 15, 1, '#ffaa55');
  rect(ctx, x + 1, y, 1, 11, '#555555');
  rect(ctx, x + 10, y, 1, 11, '#555555');
  rect(ctx, x + 1, y, 10, 2, '#aaaaaa');
  rect(ctx, x + 5, y + 2, 2, 1 + stroke, '#aaaaaa');
  rect(ctx, x + 3, y + 3 + stroke, 6, 2, '#ffffff');
  rect(ctx, x + 3, y + 9, 6, 2, '#ffffaa');
  rect(ctx, x + 4, y + 9, 4, 1, '#aa5500');
  cog(ctx, x + 14, y + 4, T * 2, '#aaaaaa', '#ffffff');
};

const SHORT_LIBS = LIBS.map((l) => l.split('.')[0]!).filter((n) => n.length <= 6);

const libPlaque: Prop = (ctx, x, y, s) => {
  const name = pickOf(SHORT_LIBS, hash(s));
  ctx.font = FONT;
  const tw = Math.ceil(ctx.measureText(name).width);
  rect(ctx, x - 2, y, tw + 4, 8, '#aa5500');
  rect(ctx, x - 2, y, tw + 4, 1, '#ffaa55');
  text(ctx, name, x, y + 7, '#ffff55');
};

const libLamp: Prop = (ctx, x, y, s) => {
  rect(ctx, x + 3, y - 8, 1, 8, '#555500');
  rect(ctx, x, y, 7, 2, '#aa5500');
  rect(ctx, x + 1, y + 2, 5, 1, '#ffffaa');
  glow(ctx, x + 3, y + 8, 14, 'rgba(255,190,90,0.22)');
  const d = (T * 0.6 + hash(s)) % 1;
  rect(ctx, x + 1 + R(hash(s + 1) * 5), y + 4 + R(d * 9), 1, 1, '#ffffaa');
};

const libCard: Prop = (ctx, x, y, s) => {
  rect(ctx, x, y, 9, 7, '#ffffaa');
  rect(ctx, x, y, 9, 1, '#aa5500');
  rect(ctx, x + 1, y + 3, 6, 1, '#aaaa55');
  rect(ctx, x + 1, y + 5, 3 + R(hash(s) * 4), 1, '#aaaa55');
};

// ---------------------------------------------------------------------------------------------
// OS userspace props (CGA 16): small towers, daemons on bridges, process signs, IPC pipes, ttys.

const usTower: Prop = (ctx, x, y, s) => {
  const w = 6 + R(hash(s) * 5);
  const h = 12 + R(hash(s + 1) * 9);
  const top = y + 18 - h;
  rect(ctx, x, top, w, h, '#0000aa');
  rect(ctx, x, top, 1, h, '#5555ff');
  rect(ctx, x - 1, top, w + 2, 1, '#5555ff');
  for (let r = 0; r * 3 + 3 < h; r++)
    for (let k = 0; k * 2 + 2 < w; k++) {
      const n = s + r * 17 + k;
      if (hash(n) > 0.32) continue;
      rect(ctx, x + 2 + k * 2, top + 2 + r * 3, 1, 1, hash(n + 3) > 0.75 ? '#55ffff' : '#ffff55');
    }
  if (hash(s + 2) > 0.55) {
    rect(ctx, x + (w >> 1), top - 4, 1, 4, '#555555');
    rect(ctx, x + (w >> 1), top - 5, 1, 1, Math.floor(T * 0.8 + hash(s) * 4) % 2 ? '#aa0000' : '#ff5555');
  }
};

const DAEMON_ROWS = ['h   h', 'hk kh', ' kkk ', ' yky ', ' kkk ', 'k k k'];
const DAEMON_PAL = { k: '#aa0000', h: '#ff5555', y: '#ffff55' };

const usDaemon: Prop = (ctx, x, y, s) => {
  const w = 26;
  rect(ctx, x, y + 9, w, 1, '#aaaaaa');
  rect(ctx, x, y + 10, w, 1, '#555555');
  for (let k = 2; k < w; k += 6) rect(ctx, x + k, y + 11, 1, 2, '#555555');
  const ph = (T * 0.1 + hash(s)) % 2;
  const fwd = ph < 1;
  blit(ctx, sprite('daemon', DAEMON_ROWS, DAEMON_PAL), x + (fwd ? ph : 2 - ph) * (w - 5), y + 3, !fwd);
};

const usSign: Prop = (ctx, x, y, s) => {
  const name = pickOf(PROCS, hash(s));
  ctx.font = FONT;
  const tw = Math.ceil(ctx.measureText(name).width);
  glow(ctx, x + tw / 2, y + 4, 14, 'rgba(255,85,255,0.25)');
  rect(ctx, x - 2, y - 1, tw + 4, 9, '#000000');
  rect(ctx, x - 2, y - 1, tw + 4, 1, '#ff55ff');
  rect(ctx, x - 2, y + 7, tw + 4, 1, '#ff55ff');
  text(ctx, name, x, y + 6, '#ff55ff');
};

const usPipe: Prop = (ctx, x, y, s) => {
  const w = 22 + R(hash(s) * 6);
  rect(ctx, x, y + 4, w, 2, '#555555');
  rect(ctx, x, y + 4, w, 1, '#aaaaaa');
  rect(ctx, x - 1, y + 3, 1, 4, '#aaaaaa');
  rect(ctx, x + w, y + 3, 1, 4, '#aaaaaa');
  for (let k = 0; k < 2; k++) rect(ctx, x + mod(T * (10 + k * 5) + hash(s + k) * w, w - 1), y + 4, 2, 1, '#55ffff');
};

const usTty: Prop = (ctx, x, y, s) => {
  rect(ctx, x - 1, y - 1, 14, 10, '#555555');
  rect(ctx, x, y, 12, 8, '#000000');
  rect(ctx, x + 1, y + 1, 4 + R(hash(s) * 5), 1, '#00aa00');
  rect(ctx, x + 1, y + 3, 2 + R(hash(s + 1) * 6), 1, '#00aa00');
  rect(ctx, x + 1, y + 5, 2, 2, Math.floor(T * 1.9) % 2 ? '#000000' : '#55ff55');
};

// ---------------------------------------------------------------------------------------------
// Kernel props (CGA 16): gear pairs, dmesg screens, pipes with gauges, pistons, status LEDs.

const krGears: Prop = (ctx, x, y, s) => {
  const r = 5 + R(hash(s) * 2);
  const dir = hash(s + 1) > 0.5 ? 1 : -1;
  const a = T * 0.9 * dir;
  gear(ctx, x + r + 1, y + r + 1, r, 8, a, c('#aaaaaa'), c('#ffffff'), c('#555555'));
  cog(ctx, x + 2 * r + 5, y + r + 4, -a * 1.8, '#aa5500', '#ffff55');
};

const krDmesg: Prop = (ctx, x, y, s) => {
  const sw = 42;
  const sh = 15;
  rect(ctx, x - 2, y - 2, sw + 4, sh + 4, '#555555');
  rect(ctx, x - 2, y - 2, sw + 4, 1, '#aaaaaa');
  rect(ctx, x, y, sw, sh, '#000000');
  rect(ctx, x + sw - 3, y + sh + 1, 2, 1, '#55ff55');
  ctx.save();
  ctx.beginPath();
  ctx.rect(R(x) + 1, R(y) + 1, sw - 2, sh - 2);
  ctx.clip();
  const lh = 7;
  const scroll = T * 3 + hash(s) * 50;
  const first = Math.floor(scroll / lh);
  for (let k = 0; k < 3; k++) {
    const n = first + k + (s & 63);
    const msg = DMESG[mod(n, DMESG.length)]!;
    text(ctx, msg, x + 2, y + 6 + k * lh - (scroll % lh), k === 1 ? '#55ff55' : '#00aa00');
  }
  ctx.restore();
};

const krPipe: Prop = (ctx, x, y, s) => {
  const w = 22;
  rect(ctx, x, y + 6, w, 3, '#aa0000');
  rect(ctx, x, y + 6, w, 1, '#ff5555');
  rect(ctx, x + 3, y + 5, 2, 5, '#555555');
  rect(ctx, x + w - 5, y + 5, 2, 5, '#555555');
  const gx = x + 11;
  const gy = y + 3;
  rect(ctx, gx - 2, gy - 3, 5, 6, '#ffffff');
  rect(ctx, gx - 3, gy - 2, 7, 4, '#ffffff');
  const na = -2.2 + Math.sin(T + hash(s) * 6) * 0.4;
  line(ctx, gx, gy, gx + R(Math.cos(na) * 2), gy + R(Math.sin(na) * 2), c('#aa0000'));
};

const krPiston: Prop = (ctx, x, y, s) => {
  const stroke = R(Math.sin(T * 2.4 + hash(s) * 6) * 2);
  rect(ctx, x, y, 6, 8, '#555555');
  rect(ctx, x, y, 1, 8, '#aaaaaa');
  rect(ctx, x + 2, y + 8, 2, 3 + stroke, '#ffffff');
  rect(ctx, x - 1, y + 11 + stroke, 8, 2, '#aaaaaa');
};

const krLeds: Prop = (ctx, x, y, s) => {
  rect(ctx, x - 1, y - 1, 11, 7, '#555555');
  rect(ctx, x, y, 9, 5, '#000000');
  const slot = Math.floor(T * 2.5);
  for (let k = 0; k < 6; k++) {
    const on = hash(s + k * 5 + slot * 11) > 0.45;
    const red = k === 5;
    rect(ctx, x + 1 + (k % 3) * 3, y + 1 + Math.floor(k / 3) * 2, 1, 1, on ? (red ? '#ff5555' : '#55ff55') : red ? '#aa0000' : '#00aa00');
  }
};

// ---------------------------------------------------------------------------------------------
// Drivers props (CGA 4: black, cyan, magenta, white): chips, ribbons, IRQ sparks, connectors, caps.

const drChip: Prop = (ctx, x, y, s) => {
  const w = 9 + R(hash(s) * 8);
  for (let k = 2; k < w - 1; k += 2) {
    rect(ctx, x + k, y - 2, 1, 2, '#55ffff');
    rect(ctx, x + k, y + 6, 1, 2, '#55ffff');
  }
  rect(ctx, x, y, w, 6, '#ff55ff');
  rect(ctx, x + 1, y + 1, w - 2, 4, '#000000');
  rect(ctx, x + 2, y + 2, 1, 1, '#ffffff');
};

const drRibbon: Prop = (ctx, x, y, s) => {
  const w = 26;
  const jog = hash(s) > 0.5 ? 3 : -3;
  const col = hash(s + 1) > 0.7 ? '#ff55ff' : '#55ffff';
  for (let k = 0; k < 3; k++) {
    rect(ctx, x, y + k * 2, 12, 1, col);
    for (let j = 0; j < Math.abs(jog); j++) rect(ctx, x + 12 + j, y + k * 2 + Math.sign(jog) * j, 1, 1, col);
    rect(ctx, x + 12 + Math.abs(jog), y + k * 2 + jog, w - 12 - Math.abs(jog), 1, col);
  }
  const p = mod(T * 18 + hash(s + 2) * w, w);
  rect(ctx, x + p, y + 2 + (p > 12 ? jog : 0), 2, 1, '#ffffff');
};

const drIrq: Prop = (ctx, x, y, s, b) => {
  drChip(ctx, x, y + 8, s, b);
  const slot = Math.floor(T * 3 + hash(s) * 5);
  if (b.reduced || hash(slot * 31 + s) < 0.85) return;
  let lx = x + 5;
  let ly = y + 6;
  while (ly > y - 6) {
    const nx = lx + (hash(slot * 7 + ly + s) - 0.5) * 6;
    const ny = ly - 3;
    line(ctx, lx, ly, nx, ny, c('#ffffff'));
    lx = nx;
    ly = ny;
  }
};

const drConnector: Prop = (ctx, x, y) => {
  rect(ctx, x, y, 14, 6, '#ffffff');
  rect(ctx, x + 1, y + 1, 12, 4, '#000000');
  for (let k = 0; k < 5; k++) rect(ctx, x + 2 + k * 2, y + 2, 1, 1, '#55ffff');
  for (let k = 0; k < 4; k++) rect(ctx, x + 3 + k * 2, y + 3, 1, 1, '#55ffff');
};

const drCaps: Prop = (ctx, x, y, s) => {
  for (let k = 0; k < 2 + R(hash(s) * 2); k++) {
    const cx = x + k * 5;
    rect(ctx, cx, y, 3, 7, '#55ffff');
    rect(ctx, cx, y, 3, 1, '#ffffff');
    rect(ctx, cx, y + 7, 1, 2, '#ffffff');
    rect(ctx, cx + 2, y + 7, 1, 2, '#ffffff');
  }
};

// ---------------------------------------------------------------------------------------------
// Firmware props (green phosphor: draw in greys 00/55/AA/FF): drawer banks, small vault doors with POST
// rings, POST code readouts, flash chips, riveted plates.

const fwDrawers: Prop = (ctx, x, y, s) => {
  rect(ctx, x - 1, y - 1, 22, 12, '#555555');
  for (let r = 0; r < 2; r++)
    for (let k = 0; k < 3; k++) {
      const dx = x + k * 7;
      const dy = y + r * 5;
      rect(ctx, dx, dy, 6, 4, '#000000');
      rect(ctx, dx + 2, dy + 2, 2, 1, hash(s + r * 3 + k) > 0.85 ? '#ffffff' : '#aaaaaa');
    }
};

const fwVault: Prop = (ctx, x, y, s) => {
  const cx = x + 8;
  const cy = y + 7;
  const r = 6;
  const p = (T * 0.45 + hash(s)) % 1;
  if (T > 0) {
    ctx.strokeStyle = `rgba(255,255,255,${0.45 * (1 - p)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r + 2 + p * 14, 0, TAU);
    ctx.stroke();
  }
  rect(ctx, cx - r, cy - r + 2, r * 2 + 1, r * 2 - 3, '#aaaaaa');
  rect(ctx, cx - r + 2, cy - r, r * 2 - 3, r * 2 + 1, '#aaaaaa');
  rect(ctx, cx - r + 1, cy - r + 1, r * 2 - 1, r * 2 - 1, '#aaaaaa');
  rect(ctx, cx - r + 2, cy - r + 2, r * 2 - 3, r * 2 - 3, '#555555');
  const a = hash(s + 1) * TAU;
  for (let k = 0; k < 3; k++) {
    const t = a + (k * TAU) / 3;
    line(ctx, cx, cy, cx + Math.cos(t) * 3, cy + Math.sin(t) * 3, c('#ffffff'));
  }
  rect(ctx, cx - 1, cy - 1, 3, 3, '#ffffff');
};

const fwPost: Prop = (ctx, x, y, s) => {
  rect(ctx, x - 1, y - 1, 16, 10, '#555555');
  rect(ctx, x, y, 14, 8, '#000000');
  const code = (0x10 + Math.floor(hash(s + Math.floor(T * 0.5)) * 0xe0)).toString(16).toUpperCase();
  text(ctx, code, x + 2, y + 7, '#ffffff');
};

const fwFlash: Prop = (ctx, x, y) => {
  for (let k = 1; k < 10; k += 2) {
    rect(ctx, x + k, y - 1, 1, 1, '#aaaaaa');
    rect(ctx, x + k, y + 6, 1, 1, '#aaaaaa');
  }
  rect(ctx, x, y, 11, 6, '#555555');
  rect(ctx, x, y, 11, 1, '#aaaaaa');
  rect(ctx, x + 1, y + 1, 1, 1, '#ffffff');
};

const fwPlate: Prop = (ctx, x, y) => {
  rect(ctx, x, y, 14, 9, '#555555');
  rect(ctx, x + 1, y + 1, 12, 7, '#000000');
  for (const [dx, dy] of [[1, 1], [12, 1], [1, 7], [12, 7]] as const) rect(ctx, x + dx, y + dy, 1, 1, '#aaaaaa');
};

// ---------------------------------------------------------------------------------------------
// Ring −1 props (green phosphor): mirrored twins, small nested tunnels, vm tags.

const miniWorld = (ctx: Ctx, x: number, y: number, w: number, h: number, s: number, flip: boolean) => {
  rect(ctx, x, y, w, h, '#000000');
  for (let k = 0; k + 1 < w; k += 2) {
    const kk = flip ? w - 2 - k : k;
    const th = 1 + R((h - 3) * hash(s + kk));
    rect(ctx, x + k, y + h - th, 1, th, '#555555');
  }
  rect(ctx, flip ? x + w - 5 : x + 1, y + 1, 4, 2, '#aaaaaa');
};

const r1Mirror: Prop = (ctx, x, y, s) => {
  for (let side = 0; side < 2; side++) {
    const mx = x + side * 13;
    rect(ctx, mx - 1, y - 1, 12, 10, '#555555');
    rect(ctx, mx - 1, y - 1, 12, 1, '#ffffff');
    miniWorld(ctx, mx, y, 10, 8, s, side === 1);
  }
  // The same cursor blinks in both guests, in sync.
  if (Math.floor(T * 1.6) % 2 === 0) {
    rect(ctx, x + 6, y + 5, 1, 2, '#ffffff');
    rect(ctx, x + 13 + 3, y + 5, 1, 2, '#ffffff');
  }
};

const r1Tunnel: Prop = (ctx, x, y, s) => {
  const shades = ['#ffffff', '#aaaaaa', '#555555'];
  for (let k = 0; k < 3; k++) {
    const w = 18 - k * 5;
    const h = 12 - k * 3;
    const fx = x + R((18 - w) / 2);
    const fy = y + R((12 - h) / 2);
    rect(ctx, fx - 1, fy - 1, w + 2, h + 2, shades[k]!);
    rect(ctx, fx, fy, w, h, '#000000');
  }
  const g = mod(T * 4 + hash(s) * 30, 30);
  if (g < 18) rect(ctx, x + g, y - 1, 1, 1, '#ffffff');
};

const r1Tag: Prop = (ctx, x, y, s) => {
  text(ctx, `vm${Math.floor(hash(s) * 2)}`, x, y + 7, '#aaaaaa');
  rect(ctx, x - 2, y + 9, 16, 1, '#555555');
};

const r1Glass: Prop = (ctx, x, y, s) => {
  rect(ctx, x, y, 10, 14, '#555555');
  rect(ctx, x + 1, y + 1, 8, 12, '#000000');
  const g = mod(T * 3 + hash(s) * 20, 20);
  for (let k = 0; k < 4; k++) if (g - k >= 0 && g - k < 8) rect(ctx, x + 1 + g - k, y + 2 + k * 3, 1, 2, '#aaaaaa');
};

// ---------------------------------------------------------------------------------------------
// Ring −2 props (5 greys 00/40/80/C0/FF): debris hanging mid-fall under frozen streaks, stopped clocks.

const DEBRIS_ROWS: Record<string, string[]> = {
  window: ['kkkkkkk', 'kdddddk', 'kwwwwwk', 'kwsswwk', 'kwwwwwk', 'kkkkkkk'],
  book: ['kkkk', 'kdgk', 'kdwk', 'kdgk', 'kkkk'],
  gear: [' k k ', 'kgggk', 'kgkgk', 'kgggk', ' k k '],
  zero: [' kk ', 'kwwk', 'kwwk', 'kwwk', ' kk '],
  one: ['kwk', 'wwk', 'kwk', 'kwk', 'www'],
  shard: ['k    ', 'wk   ', 'wgk  ', 'wggk ', 'kkkkk'],
  chip: ['k k k', 'kkkkk', 'kdwdk', 'kkkkk', 'k k k'],
};
const DEBRIS_PAL = { k: '#000000', w: '#ffffff', g: '#c0c0c0', d: '#808080', s: '#404040' };

const r2Debris: Prop = (ctx, x, y, s) => {
  const keys = Object.keys(DEBRIS_ROWS);
  const k = pickOf(keys, hash(s));
  const img = sprite(`debris-${k}`, DEBRIS_ROWS[k]!, DEBRIS_PAL);
  const drop = mod(T * 3, 8);
  const yy = y + 6 + drop;
  const trail = 5 + R(hash(s + 1) * 8);
  for (let j = 0; j < trail; j++) rect(ctx, x + (img.width >> 1), yy - trail + j, 1, 1, j > trail / 2 ? '#808080' : '#404040');
  blit(ctx, img, x, yy);
};

const r2Clock: Prop = (ctx, x, y, s) => {
  const cx = x + 6;
  const cy = y + 6;
  rect(ctx, cx - 4, cy - 6, 9, 13, '#808080');
  rect(ctx, cx - 6, cy - 4, 13, 9, '#808080');
  rect(ctx, cx - 5, cy - 5, 11, 11, '#808080');
  rect(ctx, cx - 4, cy - 4, 9, 9, '#404040');
  line(ctx, cx, cy, cx + R(Math.cos(hash(s) * TAU) * 3), cy + R(Math.sin(hash(s) * TAU) * 3), c('#c0c0c0'));
  const sa = ((Math.floor(T) + s) * TAU) / 60;
  line(ctx, cx, cy, cx + R(Math.cos(sa) * 4), cy + R(Math.sin(sa) * 4), c('#ffffff'));
};

const r2Shards: Prop = (ctx, x, y, s) => {
  for (let k = 0; k < 4; k++) {
    const sx = x + R(hash(s + k) * 16);
    const sy = y + R(hash(s + k + 9) * 10);
    rect(ctx, sx, sy - 4, 1, 3, '#404040');
    rect(ctx, sx, sy, 2, 2, k % 2 ? '#c0c0c0' : '#808080');
  }
};

const r2Tag: Prop = (ctx, x, y, s) => text(ctx, `SMI#${Math.floor(hash(s) * 9)}`, x, y + 7, '#808080');

// ---------------------------------------------------------------------------------------------
// Ring −3 props (1-bit): few and readable. Via arrays, bond pads, short traces.

const r3Vias: Prop = (ctx, x, y) => {
  for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) rect(ctx, x + k * 4, y + r * 4, 2, 2, '#ffffff');
};

const r3Pad: Prop = (ctx, x, y) => {
  rect(ctx, x, y, 8, 8, '#ffffff');
  rect(ctx, x + 2, y + 2, 4, 4, '#000000');
  rect(ctx, x + 3, y + 8, 2, 5, '#ffffff');
};

const r3Trace: Prop = (ctx, x, y, s) => {
  const w = 12 + R(hash(s) * 14);
  rect(ctx, x, y + 2, w, 1, '#ffffff');
  rect(ctx, x + w, y + 2, 1, 8, '#ffffff');
  rect(ctx, x + w - 1, y + 9, 3, 3, '#ffffff');
  rect(ctx, x - 1, y + 1, 3, 3, '#ffffff');
};

// ---------------------------------------------------------------------------------------------
// Kits: each layer's props with weights. Text-bearing props are rarer: text is the busiest thing on screen.

interface Kit {
  props: Prop[];
  weights: number[];
}

/** Props that carry text: the far plane never draws them, so text stays sparse and readable. */
const TEXT_PROPS = new Set<Prop>();

function kit(entries: [Prop, number][]): Kit {
  const total = entries.reduce((a, [, w]) => a + w, 0);
  enforce(total > 0, 'kit needs positive weights');
  return { props: entries.map(([p]) => p), weights: entries.map(([, w]) => w / total) };
}

const KITS: Record<LayerId, Kit> = {
  application: kit([[appWin, 5], [appCloud, 2], [appToast, 2], [appSpinner, 1], [appProgress, 2], [appIcon, 2], [appBubble, 2]]),
  runtime: kit([[rtObjects, 5], [rtSweeper, 2], [rtBytecode, 0.4], [rtMarks, 2], [rtRef, 2], [rtHeapColumn, 2]]),
  libraries: kit([[libShelf, 5], [libThread, 3], [libLinker, 2], [libPlaque, 0.4], [libLamp, 1], [libCard, 1.5]]),
  userspace: kit([[usTower, 5], [usDaemon, 2], [usSign, 0.8], [usPipe, 2], [usTty, 1.5]]),
  kernel: kit([[krGears, 4], [krDmesg, 1.2], [krPipe, 2], [krPiston, 2], [krLeds, 2]]),
  drivers: kit([[drChip, 3], [drRibbon, 3], [drIrq, 1.5], [drConnector, 1], [drCaps, 1.5]]),
  firmware: kit([[fwDrawers, 3], [fwVault, 2], [fwPost, 1], [fwFlash, 2], [fwPlate, 2]]),
  'ring-1': kit([[r1Mirror, 4], [r1Tunnel, 3], [r1Tag, 0.6], [r1Glass, 2]]),
  'ring-2': kit([[r2Debris, 6], [r2Clock, 1], [r2Shards, 3], [r2Tag, 0.4]]),
  'ring-3': kit([[r3Vias, 3], [r3Pad, 1], [r3Trace, 3]]),
};

for (const p of [rtBytecode, libPlaque, usSign, krDmesg, fwPost, r1Tag, r2Tag]) TEXT_PROPS.add(p);

function pick(k: Kit, h: number): Prop {
  let acc = 0;
  for (let i = 0; i < k.props.length; i++) {
    acc += k.weights[i]!;
    if (h < acc) return k.props[i]!;
  }
  return k.props[k.props.length - 1]!;
}

/**
 * Where near-plane props were drawn this frame, as flat [x, y, x, y, ...] in scene pixels. The scene clears it
 * every frame and uses it to find on-screen "entities" for tier reactions (leaked copies, racing jiggle).
 */
export const PROP_SPOTS: number[] = [];

const INDEX: Record<LayerId, number> = Object.fromEntries(LAYERS.map((l, i) => [l.id, i])) as Record<LayerId, number>;

/** World pixels over which a layer's cells borrow props from its neighbour. */
const BLEED = 70;

interface FieldOpts {
  /** Parallax factor of the plane. */
  f: number;
  /** Row height and cell width, in scene pixels. */
  step: number;
  cw: number;
  /** Share of cells that hold a prop. */
  dens: number;
  salt: number;
  far?: boolean;
}

/**
 * Scatter a layer's props over a jittered grid. On the near plane, cells near the band edges borrow
 * the neighbouring layer's props, more often the closer they are. All choices are seeded by row and column.
 */
function field(ctx: Ctx, b: Band, id: LayerId, o: FieldOpts) {
  const idx = INDEX[id];
  const up = !o.far && idx > 0 ? KITS[LAYERS[idx - 1]!.id] : undefined;
  const down = !o.far && idx < LAYERS.length - 1 ? KITS[LAYERS[idx + 1]!.id] : undefined;
  const bandH = b.bottom - b.top;
  const cols = Math.ceil(b.w / o.cw) + 1;
  fogged = !!o.far;
  prows(
    b,
    o.f,
    o.step,
    (y, i) => {
      for (let k = 0; k < cols; k++) {
        const s = (i * 977 + k * 131 + o.salt * 7919) | 0;
        if (hash(s) > o.dens) continue;
        let use = KITS[id];
        const dTop = i * o.step;
        const dBot = bandH - (i + 1) * o.step;
        if (up && hash(s + 3) < 0.6 * Math.max(0, 1 - dTop / BLEED)) use = up;
        else if (down && hash(s + 4) < 0.6 * Math.max(0, 1 - dBot / BLEED)) use = down;
        const x = k * o.cw + R(hash(s + 1) * o.cw * 0.45) - 8;
        const yy = y + R(hash(s + 2) * o.step * 0.3);
        const prop = pick(use, hash(s + 5));
        if (o.far && TEXT_PROPS.has(prop)) continue;
        prop(ctx, x, yy, s, b);
        if (!o.far) PROP_SPOTS.push(x, yy);
      }
    },
    30,
  );
  fogged = false;
}

// ---------------------------------------------------------------------------------------------
// Layers: a calm background, a fogged far plane of props, and the near plane.

function application(ctx: Ctx, b: Band) {
  use('application', b);
  vgrad(ctx, b, b.bottom - 230, b.bottom + SEAM_H, [
    [0, '#b4e2f7'],
    [0.35, '#7ab0e4'],
    [0.7, '#5868b8'],
    [0.9, '#3a3474'],
    [1, '#2a2350'],
  ]);
  const sy = R(b.bottom * 0.35) - 70;
  glow(ctx, b.w * 0.8, sy, 80, 'rgba(255,248,215,0.6)');
  rect(ctx, b.w * 0.8 - 4, sy - 4, 8, 8, '#fffbe8');
  prows(b, 0.25, 26, (y, i) => {
    if (hash(i * 5 + 1) < 0.5) return;
    appCloud(ctx, mod(hash(i * 5 + 2) * (b.w + 40) + T * 1.5, b.w + 40) - 20, y, i * 5, b);
  });
  field(ctx, b, 'application', { f: 0.6, step: 16, cw: 24, dens: 0.35, salt: 1, far: true });
  field(ctx, b, 'application', { f: 1, step: 20, cw: 28, dens: 0.42, salt: 2 });
  // A small dock: the floor of the layer.
  const dy = R(b.bottom - 14);
  const dw = Math.min(b.w - 24, 110);
  const dx = R((b.w - dw) / 2);
  px(ctx, dx, dy, dw, 9, 'rgba(255,255,255,0.28)');
  rect(ctx, dx, dy, dw, 1, '#dfe6f6');
  for (let k = 0; k * 9 + 8 < dw; k++) {
    const [a, a2] = ACCENTS[k % ACCENTS.length]!;
    rect(ctx, dx + 3 + k * 9, dy + 2, 6, 6, a2);
    rect(ctx, dx + 3 + k * 9, dy + 2, 6, 3, a);
  }
}

function runtime(ctx: Ctx, b: Band) {
  use('runtime', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000033');
  vgrad(ctx, b, b.top, b.top + 50, [
    [0, 'rgba(102,102,204,0.55)'],
    [1, 'rgba(102,102,204,0)'],
  ]);
  field(ctx, b, 'runtime', { f: 0.55, step: 14, cw: 24, dens: 0.4, salt: 3, far: true });
  field(ctx, b, 'runtime', { f: 1, step: 18, cw: 30, dens: 0.5, salt: 4 });
  // Freed bytes drifting up.
  prows(b, 1.25, 12, (y, i) => {
    if (hash(i * 5) < 0.6) return;
    rect(ctx, hash(i * 5 + 1) * b.w, y - mod(T * 4, 12), 1, 1, '#9999cc');
  });
}

function libraries(ctx: Ctx, b: Band) {
  use('libraries', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  field(ctx, b, 'libraries', { f: 0.55, step: 14, cw: 22, dens: 0.45, salt: 5, far: true });
  field(ctx, b, 'libraries', { f: 1, step: 18, cw: 28, dens: 0.55, salt: 6 });
}

function userspace(ctx: Ctx, b: Band) {
  use('userspace', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  // A few stars, no speckle.
  prows(b, 0.1, 14, (y, i) => {
    if (hash(i * 3) > 0.12) return;
    rect(ctx, hash(i * 3 + 1) * b.w, y, 1, 1, hash(i * 3 + 2) > 0.7 ? '#ffffff' : '#555555');
  });
  field(ctx, b, 'userspace', { f: 0.55, step: 16, cw: 20, dens: 0.4, salt: 7, far: true });
  field(ctx, b, 'userspace', { f: 1, step: 20, cw: 28, dens: 0.55, salt: 8 });
  // The street: solid blue with a thin dithered glow above it, and lamps.
  rect(ctx, 0, b.bottom - 6, b.w, 6, '#0000aa');
  vgrad(ctx, b, b.bottom - 22, b.bottom - 6, [
    [0, 'rgba(0,0,170,0)'],
    [1, 'rgba(0,0,170,0.8)'],
  ]);
  for (let x = 12; x < b.w; x += 40) {
    rect(ctx, x, b.bottom - 16, 1, 10, '#555555');
    rect(ctx, x - 1, b.bottom - 17, 3, 1, '#ffff55');
  }
}

const KWALL = () =>
  offscreen('v3-kernel-wall', 30, 20, (cx) => {
    cx.fillStyle = '#000000';
    cx.fillRect(0, 0, 30, 20);
    cx.fillStyle = '#555555';
    cx.fillRect(0, 19, 30, 1);
    cx.fillRect(29, 0, 1, 20);
  });

function kernel(ctx: Ctx, b: Band) {
  use('kernel', b);
  const [y0, y1] = vis(b);
  tiled(ctx, KWALL(), 0, y0, b.w, y1 - y0, 0, R(b.top * 0.5));
  field(ctx, b, 'kernel', { f: 0.6, step: 16, cw: 24, dens: 0.35, salt: 9, far: true });
  field(ctx, b, 'kernel', { f: 1, step: 22, cw: 32, dens: 0.55, salt: 10 });
  // Sparks rising from the scheduler's furnace.
  prows(b, 1, 16, (y, i) => {
    if (hash(i * 7) < 0.7) return;
    const k = mod(T * 10 + hash(i * 7 + 1) * 16, 16);
    rect(ctx, hash(i * 7 + 2) * b.w + Math.sin(T + i) * 2, y + 16 - k, 1, 1, k < 8 ? '#ffff55' : '#ff5555');
  });
  vgrad(ctx, b, b.bottom - 40, b.bottom + SEAM_H, [
    [0, 'rgba(255,85,0,0)'],
    [1, 'rgba(255,85,0,0.45)'],
  ]);
}

function drivers(ctx: Ctx, b: Band) {
  use('drivers', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  // Board vias on a sparse grid, solid: texture that reads as a board, not noise.
  prows(b, 0.5, 12, (y, i) => {
    for (let x = mod(i * 5, 12); x < b.w; x += 24) if (hash(i * 61 + x) > 0.6) rect(ctx, x, y, 1, 1, '#55ffff');
  });
  field(ctx, b, 'drivers', { f: 0.6, step: 16, cw: 24, dens: 0.35, salt: 11, far: true });
  field(ctx, b, 'drivers', { f: 1, step: 18, cw: 28, dens: 0.55, salt: 12 });
}

const PLATE = () =>
  offscreen('v3-vault-plate', 40, 26, (cx) => {
    cx.fillStyle = '#000000';
    cx.fillRect(0, 0, 40, 26);
    cx.fillStyle = '#555555';
    cx.fillRect(0, 0, 40, 1);
    cx.fillRect(0, 0, 1, 26);
  });

function firmware(ctx: Ctx, b: Band) {
  use('firmware', b);
  const [y0, y1] = vis(b);
  tiled(ctx, PLATE(), 0, y0, b.w, y1 - y0, 0, R(b.top * 0.5));
  field(ctx, b, 'firmware', { f: 0.6, step: 16, cw: 24, dens: 0.3, salt: 13, far: true });
  field(ctx, b, 'firmware', { f: 1, step: 20, cw: 28, dens: 0.55, salt: 14 });
  vgrad(ctx, b, b.bottom - 40, b.bottom + SEAM_H, [
    [0, 'rgba(255,255,255,0)'],
    [1, 'rgba(255,255,255,0.2)'],
  ]);
}

function ringMinus1(ctx: Ctx, b: Band) {
  use('ring-1', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  field(ctx, b, 'ring-1', { f: 0.6, step: 16, cw: 24, dens: 0.35, salt: 15, far: true });
  field(ctx, b, 'ring-1', { f: 1, step: 20, cw: 28, dens: 0.5, salt: 16 });
}

function ringMinus2(ctx: Ctx, b: Band) {
  use('ring-2', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');
  field(ctx, b, 'ring-2', { f: 0.6, step: 14, cw: 22, dens: 0.35, salt: 17, far: true });
  field(ctx, b, 'ring-2', { f: 1, step: 20, cw: 26, dens: 0.45, salt: 18 });
}

/** Standard cells, used only in narrow strips along the power rails. */
const CELLS = () =>
  offscreen('v3-die-cells', 24, 6, (cx) => {
    cx.fillStyle = '#000000';
    cx.fillRect(0, 0, 24, 6);
    cx.fillStyle = '#ffffff';
    for (let x = 0; x < 24; x += 6) cx.fillRect(x, 0, 1, 6);
    for (let x = 0; x < 24; x++) if (hash(x + 1000) > 0.6) cx.fillRect(x, 2 + (x % 2) * 2, 1, 1);
  });

/**
 * Ring −3 is the calm at the bottom: mostly negative space. A few power rails (with standard cells only along
 * them), long single traces, and the always-on core as the focal point, its heartbeat running out along its traces.
 */
function ringMinus3(ctx: Ctx, b: Band) {
  use('ring-3', b);
  const [y0, y1] = vis(b);
  rect(ctx, 0, y0, b.w, y1 - y0, '#000000');

  // Long traces, far plane: one solid line per row at most, with a via where it turns.
  prows(b, 0.75, 26, (y, i) => {
    if (hash(i * 3) < 0.5) return;
    const xa = R(hash(i * 3 + 1) * b.w * 0.6);
    const xb = xa + 30 + R(hash(i * 3 + 2) * b.w * 0.4);
    rect(ctx, xa, y, xb - xa, 1, '#ffffff');
    const drop = 8 + R(hash(i * 3 + 4) * 10);
    rect(ctx, xb, y, 1, drop, '#ffffff');
    rect(ctx, xb - 1, y + drop, 3, 3, '#ffffff');
    rect(ctx, xb, y + drop + 1, 1, 1, '#000000');
  });

  // Power rails, near plane, with cells only in the strip below each.
  prows(b, 1, 80, (y, i) => {
    rect(ctx, 0, y - 1, b.w, 14, '#000000');
    rect(ctx, 0, y, b.w, 1, '#ffffff');
    rect(ctx, 0, y + 3, b.w, 1, '#ffffff');
    for (let x = mod(i * 7, 10); x < b.w; x += 10) rect(ctx, x, y + 1, 2, 2, '#ffffff');
    tiled(ctx, CELLS(), 0, y + 6, b.w, 6, R(i * 9), y + 6);
  });

  field(ctx, b, 'ring-3', { f: 1, step: 26, cw: 40, dens: 0.14, salt: 19 });

  // Seal ring and bond pads at the die edge.
  const ey = R(b.top + 4);
  rect(ctx, 0, ey, b.w, 24, '#000000');
  rect(ctx, 0, ey, b.w, 1, '#ffffff');
  rect(ctx, 0, ey + 2, b.w, 1, '#ffffff');
  for (let x = 6; x < b.w; x += 18) {
    rect(ctx, x, ey + 6, 8, 8, '#ffffff');
    rect(ctx, x + 2, ey + 8, 4, 4, '#000000');
    rect(ctx, x + 3, ey + 14, 2, 8, '#ffffff');
  }

  // The always-on core.
  const cx = R(b.w / 2);
  const cy = R(b.top + 70);
  const beat = b.reduced ? 0.4 : Math.max(0, Math.sin(b.t * 3.2)) ** 6;
  for (const off of [-5, 0, 5]) {
    rect(ctx, cx + 20, cy + off - 1, b.w, 3, '#000000');
    rect(ctx, 0, cy + off - 1, cx - 20, 3, '#000000');
    rect(ctx, cx + off - 1, cy + 20, 3, b.h, '#000000');
    rect(ctx, cx + 20, cy + off, b.w, 1, '#ffffff');
    rect(ctx, 0, cy + off, cx - 20, 1, '#ffffff');
    rect(ctx, cx + off, cy + 20, 1, b.h, '#ffffff');
  }
  // Heartbeat pulses running out along the traces.
  if (!b.reduced) {
    const d = R(((b.t * 3.2) / TAU) % 1 * 160);
    for (const off of [-5, 0, 5]) {
      rect(ctx, cx + 20 + d, cy + off - 1, 4, 3, '#ffffff');
      rect(ctx, cx - 24 - d, cy + off - 1, 4, 3, '#ffffff');
      rect(ctx, cx + off - 1, cy + 20 + d, 3, 4, '#ffffff');
    }
  }
  rect(ctx, cx - 20, cy - 20, 41, 41, '#000000');
  glow(ctx, cx, cy, 22 + beat * 10, `rgba(255,255,255,${0.3 + beat * 0.4})`);
  for (let k = -15; k <= 15; k += 5) {
    rect(ctx, cx + k, cy - 16, 2, 2, '#ffffff');
    rect(ctx, cx + k, cy + 15, 2, 2, '#ffffff');
    rect(ctx, cx - 16, cy + k, 2, 2, '#ffffff');
    rect(ctx, cx + 15, cy + k, 2, 2, '#ffffff');
  }
  rect(ctx, cx - 11, cy - 11, 23, 23, '#000000');
  rect(ctx, cx - 10, cy - 10, 21, 21, '#ffffff');
  rect(ctx, cx - 9, cy - 9, 19, 19, '#000000');
  for (let k = 0; k < 3; k++) for (let j = 0; j < 3; j++) if (hash(k * 3 + j + 77) > 0.3) rect(ctx, cx - 6 + k * 5, cy - 6 + j * 5, 3, 3, '#ffffff');
  rect(ctx, cx - 2, cy - 2, 5, 5, beat > 0.3 ? '#ffffff' : '#000000');
}

export const LAYER_ART_V3: Record<LayerId, Art> = {
  application,
  runtime,
  libraries,
  userspace,
  kernel,
  drivers,
  firmware,
  'ring-1': ringMinus1,
  'ring-2': ringMinus2,
  'ring-3': ringMinus3,
};
