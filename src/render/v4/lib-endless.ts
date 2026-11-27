import { ent, type EntityDef, type Pen, type Size } from './kit';
import { DRIVERS, FIRMWARE, RING1, RING2, RING3 } from './lib-lower';
import { KERNEL, LIBRARIES, USERSPACE } from './lib-mid';
import { APPLICATION, RUNTIME } from './lib-upper';

/**
 * Bespoke v4 pixel-art entities & anchors for the 19 Endless Mode layers (Zones A–F).
 *
 * Intermediate layers pair bespoke signature props + anchors with remixed donor props from adjacent
 * layers (whose colours automatically snap onto each layer's palette via `kit.ts`), ensuring every
 * layer has >= 20 unique entity IDs and an unmistakably distinct visual silhouette.
 */

const R = Math.round;

/** Tone set for one layer's palette (ART-STYLE rules 3/4): every sprite draws from these so the palette snap stays coherent. */
interface K {
  /** darkest ink / cavities */ i: string;
  /** shade */ d: string;
  /** body base */ m: string;
  /** highlight */ l: string;
  /** brightest */ h: string;
  /** brass or metal accent, and its light */ w: string;
  wl: string;
  /** wood or leather, and its light */ o: string;
  ol: string;
  /** focal accent, second accent, green, cream, red */ a: string;
  b: string;
  g: string;
  c: string;
  r: string;
}
const NK: K = { i: '#2a3358', d: '#55607a', m: '#9aa3b8', l: '#dfe4ee', h: '#ffffff', w: '#b8902e', wl: '#f0cf6a', o: '#8a5a36', ol: '#bd8650', a: '#e6a23c', b: '#5b8ee6', g: '#59c08a', c: '#f3efe6', r: '#d9534f' };
const BK: K = { i: '#000033', d: '#333366', m: '#666699', l: '#9999cc', h: '#ffffcc', w: '#cc9933', wl: '#ffcc66', o: '#996633', ol: '#cc9966', a: '#ffff33', b: '#ff9933', g: '#66cc99', c: '#ffffcc', r: '#ff6633' };
const LK: K = { i: '#000000', d: '#555555', m: '#aaaaaa', l: '#ffffff', h: '#ffffff', w: '#aa5500', wl: '#ffaa55', o: '#aa5500', ol: '#ffaa55', a: '#ffff55', b: '#55aaaa', g: '#55aa55', c: '#ffffaa', r: '#ff5555' };
const CK: K = { i: '#000000', d: '#555555', m: '#aaaaaa', l: '#ffffff', h: '#ffffff', w: '#aa5500', wl: '#ffff55', o: '#aa5500', ol: '#ffff55', a: '#ffff55', b: '#55ffff', g: '#55ff55', c: '#ffffff', r: '#ff5555' };
const FK: K = { i: '#000000', d: '#ff55ff', m: '#55ffff', l: '#ffffff', h: '#ffffff', w: '#ff55ff', wl: '#ffffff', o: '#ff55ff', ol: '#55ffff', a: '#ffffff', b: '#ff55ff', g: '#55ffff', c: '#ffffff', r: '#ff55ff' };
const GK: K = { i: '#020e06', d: '#0a461e', m: '#1ea046', l: '#8cffa0', h: '#8cffa0', w: '#1ea046', wl: '#8cffa0', o: '#0a461e', ol: '#1ea046', a: '#8cffa0', b: '#8cffa0', g: '#1ea046', c: '#8cffa0', r: '#8cffa0' };
const SK: K = { i: '#0c0c0c', d: '#464646', m: '#828282', l: '#bebebe', h: '#f0f0f0', w: '#828282', wl: '#bebebe', o: '#464646', ol: '#828282', a: '#f0f0f0', b: '#bebebe', g: '#828282', c: '#f0f0f0', r: '#f0f0f0' };
const AK: K = { i: '#0a0500', d: '#582c04', m: '#c47210', l: '#ffd060', h: '#ffd060', w: '#c47210', wl: '#ffd060', o: '#582c04', ol: '#c47210', a: '#ffd060', b: '#ffd060', g: '#c47210', c: '#ffd060', r: '#ffd060' };
const PK: K = { i: '#040c18', d: '#123866', m: '#3ab2e6', l: '#e4f8ff', h: '#e4f8ff', w: '#3ab2e6', wl: '#e4f8ff', o: '#123866', ol: '#3ab2e6', a: '#e4f8ff', b: '#e4f8ff', g: '#3ab2e6', c: '#e4f8ff', r: '#e4f8ff' };
const WK: K = { i: '#08060e', d: '#9448d4', m: '#24989c', l: '#e88438', h: '#f8f6f0', w: '#e88438', wl: '#f8f6f0', o: '#9448d4', ol: '#e88438', a: '#f8f6f0', b: '#24989c', g: '#24989c', c: '#f8f6f0', r: '#e88438' };
const EK: K = { i: '#080412', d: '#3a1876', m: '#8e4ee8', l: '#f4ecff', h: '#f4ecff', w: '#8e4ee8', wl: '#f4ecff', o: '#3a1876', ol: '#8e4ee8', a: '#f4ecff', b: '#f4ecff', g: '#8e4ee8', c: '#f4ecff', r: '#f4ecff' };
const YK: K = { i: '#03040a', d: '#101c40', m: '#4ca8d6', l: '#e6f8ff', h: '#e6f8ff', w: '#4ca8d6', wl: '#e6f8ff', o: '#101c40', ol: '#4ca8d6', a: '#e6f8ff', b: '#e6f8ff', g: '#4ca8d6', c: '#e6f8ff', r: '#e6f8ff' };

/** A shaded slab: base fill, light top and left edges, shade bottom and right (rule 4). */
const sl = (p: Pen, x: number, y: number, w: number, h: number, m: string, l: string, d: string) => {
  p.r(x, y, w, h, m);
  p.r(x, y, w, 1, l);
  p.r(x, y, 1, h, l);
  p.r(x, y + h - 1, w, 1, d);
  p.r(x + w - 1, y, 1, h, d);
};

/** Entity builder bound to one layer's tones. */
const E =
  (k: K) =>
  (id: string, size: Size, fn: (p: Pen, k: K) => void, opts: Omit<EntityDef, 'id' | 'sizes' | 'draw'> = {}): EntityDef =>
    ent(id, [size], (p) => fn(p, k), opts);
const net = E(NK);
const byc = E(BK);
const lnk = E(LK);
const cga = E(CK);
const bus = E(FK);
const grn = E(GK);
const gry = E(SK);
const amb = E(AK);
const bpr = E(PK);
const waf = E(WK);
const euv = E(EK);
const aby = E(YK);

/** Combine bespoke entities with donor props (re-keyed with a prefix so IDs stay unique) up to at least 20 types. */
function mix(prefix: string, bespoke: readonly EntityDef[], donor: readonly EntityDef[]): EntityDef[] {
  const out: EntityDef[] = [...bespoke];
  const need = Math.max(0, 20 - out.length);
  for (let i = 0; i < Math.min(need, donor.length); i++) {
    const d = donor[i]!;
    out.push({ ...d, id: `${prefix}-${d.id}` });
  }
  return out;
}

// =============================================================================================
// Zone A — Above Application: Internet / BGP & Browser / Compositor

export const INTERNET_BESPOKE: EntityDef[] = [
  ent('net-router', [[16, 11]], (p) => {
    p.r(2, 0, 1, 5, '#55607a');
    p.r(13, 0, 1, 5, '#55607a');
    p.r(0, 5, 16, 6, '#2a3358');
    p.r(1, 6, 14, 4, '#e9e6dc');
    for (let k = 0; k < 4; k++) p.p(3 + k * 3, 8, k % 2 ? '#59c08a' : '#e6a23c');
  }),
  // Armored undersea cable run: flanged end connectors, four raised amber collars, resting on the floor.
  net('net-cable', [26, 10], (p, k) => {
    p.r(3, 3, 20, 6, k.d);
    p.r(3, 3, 20, 1, k.b);
    p.r(3, 8, 20, 1, k.i);
    for (const x of [7, 11, 15, 19]) {
      sl(p, x, 2, 2, 8, k.a, k.wl, k.o);
    }
    sl(p, 0, 1, 3, 9, k.m, k.l, k.d);
    sl(p, 23, 1, 3, 9, k.m, k.l, k.d);
    p.p(1, 3, k.d);
    p.p(1, 7, k.d);
    p.p(24, 3, k.d);
    p.p(24, 7, k.d);
  }),
  net('net-signpost', [18, 36], (p, k) => {
    p.r(8, 3, 2, 30, k.d);
    p.r(8, 3, 1, 30, k.m);
    p.r(7, 0, 4, 3, k.m);
    p.r(8, 0, 2, 1, k.l);
    // base flare
    p.r(7, 31, 4, 1, k.d);
    p.r(6, 32, 6, 1, k.d);
    p.r(5, 33, 8, 1, k.m);
    sl(p, 4, 34, 10, 2, k.m, k.l, k.d);
    // three staggered blades: left, right, left
    sl(p, 0, 5, 8, 5, k.c, k.h, k.m);
    p.p(0, 5, k.i);
    p.r(0, 6, 1, 3, k.i);
    p.r(0, 7, 1, 1, k.c);
    sl(p, 10, 13, 8, 5, k.b, k.l, k.d);
    p.r(17, 14, 1, 3, k.i);
    p.r(17, 15, 1, 1, k.b);
    sl(p, 1, 21, 7, 5, k.a, k.wl, k.o);
    p.r(1, 22, 1, 3, k.i);
    p.r(1, 23, 1, 1, k.a);
    p.p(8, 7, k.o);
    p.p(10, 15, k.d);
    p.p(8, 23, k.o);
  }),
  net('net-rolodex', [18, 16], (p, k) => {
    // fanned cream cards behind the drum
    for (let n = 0; n < 6; n++) {
      p.r(3 + n * 2, 1 + (n % 2), 2, 5, k.c);
      p.p(3 + n * 2, 1 + (n % 2), n % 3 === 0 ? k.a : k.h);
    }
    p.disc(8, 8, 5, k.d);
    p.disc(8, 8, 3, k.m);
    p.p(8, 8, k.l);
    p.p(6, 6, k.l);
    // side crank
    p.r(13, 8, 3, 1, k.m);
    p.r(15, 6, 2, 5, k.a);
    // weighted base
    sl(p, 0, 12, 18, 4, k.m, k.l, k.d);
  }),
  net('net-milestone', [16, 20], (p, k) => {
    // rounded stone bollard
    p.r(4, 1, 8, 1, k.h);
    p.r(3, 2, 10, 1, k.l);
    sl(p, 2, 3, 12, 12, k.l, k.h, k.m);
    // riveted brass number plate
    sl(p, 4, 6, 8, 6, k.w, k.wl, k.o);
    p.p(5, 7, k.h);
    p.p(10, 7, k.h);
    p.p(5, 10, k.h);
    p.p(10, 10, k.h);
    p.r(6, 8, 4, 2, k.o);
    // plinth
    sl(p, 0, 15, 16, 5, k.m, k.l, k.d);
  }),
  net('net-parcel', [14, 12], (p, k) => {
    // wooden sorting tray
    sl(p, 0, 8, 14, 4, k.o, k.ol, k.d);
    p.r(2, 10, 10, 1, k.d);
    // twine-tied parcel
    sl(p, 2, 1, 10, 8, k.c, k.h, k.m);
    p.r(7, 1, 1, 8, k.o);
    p.r(2, 5, 10, 1, k.o);
    // wax seal over the cross
    p.disc(7, 5, 1, k.r);
    p.p(6, 4, k.a);
  }),
  net('net-cipher', [14, 10], (p, k) => {
    sl(p, 1, 1, 12, 7, k.w, k.wl, k.o);
    // three notched rings
    for (const x of [3, 6, 9]) {
      p.r(x, 0, 2, 9, k.wl);
      p.p(x, 3, k.o);
      p.p(x + 1, 5, k.o);
    }
    // cradle feet
    p.r(2, 8, 2, 2, k.d);
    p.r(10, 8, 2, 2, k.d);
  }),
];
export const INTERNET = mix('net', INTERNET_BESPOKE, APPLICATION);
export const INTERNET_ANCHORS: EntityDef[] = [
  ent(
    'net-ixp',
    [[56, 42]],
    (p) => {
      p.r(0, 0, 56, 42, '#2a3358');
      p.r(1, 1, 54, 5, '#5b8ee6');
      p.r(1, 6, 52, 33, '#f3efe6');
      for (let k = 0; k < 4; k++) {
        p.r(4 + k * 12, 10, 9, 24, '#e2e6f0');
        p.r(5 + k * 12, 12, 7, 3, '#2a3358');
        p.r(5 + k * 12, 17, 7, 14, '#5b8ee6');
      }
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const k = Math.floor(t * 4) % 4;
        p.r(6 + k * 12, 13, 2, 1, '#59c08a');
      },
      noFlip: true,
    },
  ),
];

export const BROWSER_BESPOKE: EntityDef[] = [
  ent('br-cookie', [[11, 11]], (p) => {
    p.disc(5, 5, 5, '#e6a23c');
    p.p(3, 3, '#55607a');
    p.p(7, 4, '#55607a');
    p.p(4, 7, '#55607a');
    p.p(7, 7, '#55607a');
  }),
  net('br-dom-bonsai', [20, 20], (p, k) => {
    // trunk and branches
    p.r(9, 9, 2, 6, k.o);
    p.l(9, 11, 4, 7, k.o);
    p.l(10, 10, 15, 6, k.o);
    p.l(10, 9, 10, 5, k.o);
    // clipped leaf pads
    p.disc(4, 5, 3, k.g);
    p.r(2, 3, 3, 1, k.wl);
    p.disc(15, 5, 3, k.g);
    p.r(13, 3, 3, 1, k.wl);
    p.disc(10, 2, 2, k.g);
    // paper node-tags dangling
    for (const [x, y] of [[3, 9], [8, 5], [13, 9], [17, 8]] as const) {
      p.p(x, y, k.d);
      p.r(x, y + 1, 2, 2, k.c);
    }
    // squat pot on four feet
    sl(p, 4, 14, 12, 4, k.b, k.l, k.d);
    p.r(5, 18, 2, 2, k.d);
    p.r(13, 18, 2, 2, k.d);
  }),
  net('br-box-matryoshka', [14, 13], (p, k) => {
    sl(p, 0, 10, 14, 3, k.o, k.ol, k.d);
    // big doll
    sl(p, 0, 2, 5, 8, k.r, k.a, k.d);
    p.r(1, 0, 3, 2, k.c);
    p.r(0, 5, 5, 2, k.a);
    // open middle doll: lower shell only, smaller doll showing inside
    sl(p, 5, 6, 4, 4, k.b, k.l, k.d);
    p.r(6, 3, 2, 3, k.g);
    p.r(6, 2, 2, 1, k.c);
    // small doll
    sl(p, 10, 6, 4, 4, k.g, k.l, k.d);
    p.r(11, 4, 2, 2, k.c);
    p.r(10, 8, 4, 1, k.a);
  }),
  net('br-cors-turnstile', [18, 24], (p, k) => {
    sl(p, 2, 22, 14, 2, k.m, k.l, k.d);
    sl(p, 7, 9, 4, 13, k.m, k.l, k.d);
    // card reader head with indicator lamps
    sl(p, 5, 2, 8, 7, k.d, k.m, k.i);
    p.p(7, 4, k.a);
    p.p(10, 4, k.g);
    p.r(6, 6, 6, 1, k.i);
    // three tripod arms
    p.l(7, 13, 1, 18, k.m);
    p.l(10, 13, 16, 18, k.m);
    p.r(8, 14, 2, 5, k.l);
    p.r(8, 19, 2, 1, k.d);
  }),
  net('br-paint-roller', [14, 12], (p, k) => {
    // sloped tray on two rear legs
    sl(p, 1, 6, 12, 4, k.m, k.l, k.d);
    p.r(3, 7, 8, 1, k.d);
    p.r(3, 9, 8, 1, k.d);
    p.r(2, 10, 2, 2, k.d);
    p.r(10, 10, 2, 2, k.d);
    // fuzzy green roller resting diagonally
    p.r(3, 3, 6, 3, k.g);
    p.r(3, 3, 6, 1, k.wl);
    p.l(8, 4, 12, 0, k.d);
    p.p(12, 0, k.m);
    // paint pooling at the bottom
    p.r(2, 9, 6, 1, k.g);
  }),
  net('br-shadow-screen', [30, 34], (p, k) => {
    for (const x of [0, 10, 20]) {
      sl(p, x, 2, 10, 28, k.d, k.m, k.i);
      p.r(x + 1, 3, 8, 26, k.l);
    }
    // blurred silhouettes in the centre panel
    p.disc(15, 10, 2, k.m);
    p.r(13, 12, 5, 10, k.m);
    p.r(14, 17, 3, 5, k.b);
    // hinges
    for (const y of [6, 22]) {
      p.r(9, y, 2, 3, k.w);
      p.r(19, y, 2, 3, k.w);
    }
    // four brass feet
    for (const x of [1, 8, 21, 27]) p.r(x, 30, 3, 4, k.w);
  }),
  net('br-perf-recorder', [22, 17], (p, k) => {
    sl(p, 0, 5, 22, 10, k.m, k.l, k.d);
    p.r(2, 15, 3, 2, k.d);
    p.r(17, 15, 3, 2, k.d);
    // paper roll and tape
    p.disc(4, 3, 2, k.c);
    p.r(4, 6, 16, 5, k.c);
    p.r(5, 9, 2, 2, k.g);
    p.r(8, 7, 2, 4, k.a);
    p.r(11, 8, 2, 3, k.g);
    p.r(14, 7, 2, 4, k.a);
    p.r(17, 9, 2, 2, k.g);
    // brass stylus arm
    p.l(18, 2, 9, 7, k.w);
    p.p(9, 7, k.r);
    p.r(17, 1, 3, 2, k.wl);
  }),
  net('br-worker-pager', [12, 14], (p, k) => {
    sl(p, 1, 10, 10, 4, k.d, k.m, k.i);
    // slate pager standing in the cradle
    sl(p, 3, 2, 6, 10, k.d, k.m, k.i);
    p.r(4, 3, 4, 4, k.i);
    p.r(4, 3, 4, 1, k.g);
    p.r(4, 5, 4, 1, k.g);
    p.r(8, 0, 1, 3, k.m);
    p.r(9, 6, 1, 4, k.m);
    p.p(5, 9, k.a);
    p.p(7, 9, k.b);
  }),
];
export const BROWSER = mix('br', BROWSER_BESPOKE, APPLICATION);
export const BROWSER_ANCHORS: EntityDef[] = [
  ent('br-viewport', [[54, 40]], (p) => {
    p.r(0, 0, 54, 40, '#2a3358');
    p.r(1, 1, 52, 4, '#c8d0e6');
    p.r(2, 1, 14, 4, '#ffffff');
    p.r(1, 5, 52, 34, '#ffffff');
    p.r(3, 7, 28, 12, '#5b8ee6');
    p.r(33, 7, 18, 30, '#e9e6dc');
    for (let y = 21; y < 37; y += 3) p.r(3, y, 26, 2, '#dfe6f6');
  }),
];

// =============================================================================================
// Zone B — Expanded Runtime & Libraries: AST/Bytecode, JIT, Dynamic Linker

export const BYTECODE_BESPOKE: EntityDef[] = [
  byc('bc-chopper', [22, 18], (p, k) => {
    sl(p, 1, 12, 20, 4, k.d, k.m, k.i);
    p.r(3, 16, 2, 2, k.d);
    p.r(17, 16, 2, 2, k.d);
    // hinge post and raised brass blade
    p.r(2, 3, 3, 9, k.d);
    p.l(4, 4, 17, 8, k.w);
    p.l(4, 5, 17, 9, k.wl);
    p.r(15, 8, 3, 2, k.w);
    // notched paper ribbon and cut chits
    p.r(5, 10, 9, 2, k.c);
    p.p(7, 10, k.i);
    p.p(10, 10, k.i);
    p.r(15, 10, 2, 2, k.a);
    p.r(18, 10, 2, 2, k.g);
  }),
  byc('bc-constpool', [24, 34], (p, k) => {
    sl(p, 2, 2, 20, 28, k.d, k.m, k.i);
    p.r(4, 0, 16, 2, k.m);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const x = 4 + c * 6;
        const y = 5 + r * 8;
        p.r(x, y, 5, 6, k.w);
        p.r(x + 1, y + 1, 3, 4, k.i);
        p.r(x + 1, y + 2, 3, 2, (r + c) % 2 ? k.g : k.a);
      }
    }
    // one pulled-out drawer with a bright slug
    p.r(9, 19, 7, 2, k.wl);
    p.r(10, 17, 5, 2, k.a);
    sl(p, 0, 30, 24, 4, k.m, k.l, k.d);
  }),
  byc('bc-switchyard', [22, 20], (p, k) => {
    // lever frame bar and two opposed levers
    sl(p, 1, 9, 20, 3, k.d, k.m, k.i);
    p.l(6, 9, 3, 3, k.m);
    p.l(15, 9, 18, 3, k.m);
    p.r(2, 1, 3, 2, k.wl);
    p.r(17, 1, 3, 2, k.wl);
    p.r(2, 1, 3, 1, k.h);
    // Y-shaped track plate below
    p.r(10, 16, 2, 4, k.m);
    p.l(10, 15, 4, 12, k.m);
    p.l(11, 15, 17, 12, k.m);
    p.r(9, 18, 4, 1, k.d);
  }),
  byc('bc-bonsai', [20, 20], (p, k) => {
    // stepped amber trunk forking in two
    p.r(9, 12, 3, 4, k.w);
    p.r(8, 9, 3, 3, k.w);
    p.r(5, 7, 4, 2, k.w);
    p.r(4, 4, 2, 3, k.w);
    p.r(11, 8, 4, 2, k.w);
    p.r(14, 6, 2, 2, k.w);
    p.r(9, 12, 1, 4, k.wl);
    // two canopies
    p.disc(5, 3, 3, k.g);
    p.r(3, 1, 4, 1, k.a);
    p.disc(15, 5, 3, k.g);
    p.r(13, 3, 4, 1, k.a);
    // tray
    sl(p, 3, 16, 14, 4, k.d, k.m, k.i);
  }),
  byc('bc-pez', [10, 14], (p, k) => {
    sl(p, 2, 1, 6, 11, k.w, k.wl, k.o);
    p.r(3, 3, 4, 2, k.g);
    p.r(3, 6, 4, 2, k.g);
    p.r(3, 9, 4, 2, k.a);
    p.r(8, 2, 2, 3, k.a);
    p.r(7, 2, 1, 3, k.i);
    sl(p, 0, 12, 10, 2, k.d, k.m, k.i);
  }),
  byc('bc-punchcard', [12, 12], (p, k) => {
    sl(p, 2, 0, 8, 9, k.c, k.h, k.m);
    p.r(3, 2, 2, 2, k.i);
    p.r(3, 5, 2, 2, k.i);
    p.r(8, 0, 2, 2, k.d);
    sl(p, 0, 8, 12, 4, k.w, k.wl, k.o);
  }),
  byc('bc-metronome', [12, 14], (p, k) => {
    // pyramid body
    for (let y = 0; y < 11; y++) {
      const w = 2 + Math.floor(y / 2) * 2;
      p.r(6 - w / 2, 1 + y, w, 1, k.d);
      p.p(6 - w / 2, 1 + y, k.m);
    }
    // tilted pendulum needle with bob
    p.l(5, 10, 8, 1, k.a);
    p.r(7, 2, 2, 2, k.a);
    p.r(1, 12, 2, 2, k.w);
    p.r(9, 12, 2, 2, k.w);
    p.r(1, 11, 10, 1, k.i);
  }),
  byc('bc-compass', [12, 14], (p, k) => {
    sl(p, 1, 11, 10, 3, k.o, k.ol, k.d);
    // brass pivot and legs
    p.disc(6, 2, 1, k.wl);
    p.l(5, 3, 2, 11, k.w);
    p.l(7, 3, 10, 11, k.w);
    // scale bar between the legs
    p.r(4, 7, 5, 1, k.c);
    p.p(5, 6, k.c);
    p.p(7, 6, k.c);
    p.p(2, 11, k.i);
    p.p(10, 11, k.i);
  }),
];
export const BYTECODE = mix('bc', BYTECODE_BESPOKE, RUNTIME);
export const BYTECODE_ANCHORS: EntityDef[] = [
  ent('bc-parsetree', [[52, 46]], (p) => {
    p.box(20, 0, 12, 6, '#ffcc33', '#666699');
    p.l(26, 6, 12, 16, '#9999cc');
    p.l(26, 6, 40, 16, '#9999cc');
    p.box(6, 16, 12, 6, '#ff9933', '#666699');
    p.box(34, 16, 12, 6, '#66cc99', '#666699');
    p.l(12, 22, 6, 34, '#6666cc');
    p.l(12, 22, 18, 34, '#6666cc');
    p.l(40, 22, 34, 34, '#6666cc');
    p.l(40, 22, 46, 34, '#6666cc');
    for (const x of [2, 14, 30, 42]) p.box(x, 34, 8, 8, '#000033', '#ffff99');
  }),
];

export const JIT_BESPOKE: EntityDef[] = [
  byc('jit-deopt', [16, 20], (p, k) => {
    // floor-standing abort-lever pedestal with a caution-striped hood
    sl(p, 2, 8, 12, 12, k.d, k.m, k.i);
    p.r(1, 4, 14, 4, k.b);
    for (let x = 2; x < 14; x += 4) p.r(x, 4, 2, 4, k.i);
    p.r(1, 4, 14, 1, k.a);
    p.r(7, 10, 2, 6, k.i);
    // pulled-down yellow bailout lever
    p.r(7, 12, 2, 6, k.a);
    p.r(5, 17, 6, 2, k.a);
    p.r(5, 17, 6, 1, k.h);
  }),
  byc('jit-inline-cache', [12, 12], (p, k) => {
    sl(p, 0, 0, 12, 12, k.d, k.m, k.i);
    p.r(5, 2, 2, 2, k.w);
    p.ring(6, 6, 2, k.a);
    p.r(6, 8, 1, 3, k.a);
    p.r(7, 9, 2, 1, k.a);
  }),
  byc('jit-megamorphic', [20, 22], (p, k) => {
    sl(p, 6, 14, 8, 8, k.d, k.m, k.i);
    p.r(4, 20, 12, 2, k.d);
    p.disc(10, 8, 7, k.w);
    p.disc(10, 8, 5, k.d);
    for (let n = 0; n < 8; n++) {
      const a = (n * Math.PI) / 4;
      p.p(10 + Math.round(Math.cos(a) * 5), 8 + Math.round(Math.sin(a) * 5), k.wl);
    }
    p.l(10, 8, 13, 4, k.b);
    p.p(10, 8, k.h);
  }),
  byc('jit-osr-switch', [22, 17], (p, k) => {
    // short converging rails
    p.l(1, 16, 9, 11, k.m);
    p.l(21, 16, 13, 11, k.m);
    sl(p, 4, 9, 14, 3, k.d, k.m, k.i);
    // switch stand with the weighted lever mid-throw
    p.r(10, 3, 2, 6, k.d);
    p.l(11, 5, 17, 2, k.m);
    p.disc(17, 2, 2, k.b);
    p.p(17, 2, k.a);
  }),
  byc('jit-trace-recorder', [14, 14], (p, k) => {
    sl(p, 3, 11, 8, 3, k.d, k.m, k.i);
    p.r(5, 4, 2, 7, k.m);
    p.disc(6, 3, 3, k.w);
    p.p(6, 3, k.i);
    // brass guide roller and the glowing tape loop
    p.disc(11, 9, 1, k.wl);
    p.ring(10, 5, 3, k.a);
    p.r(9, 8, 1, 2, k.a);
  }),
  byc('jit-register-anvil', [30, 26], (p, k) => {
    // stepped iron block
    sl(p, 4, 21, 22, 5, k.d, k.m, k.i);
    sl(p, 8, 17, 14, 4, k.d, k.m, k.i);
    p.p(6, 23, k.l);
    p.p(23, 23, k.l);
    // waist, top face and horn
    p.r(11, 10, 8, 7, k.d);
    p.r(11, 10, 1, 7, k.m);
    sl(p, 6, 5, 22, 5, k.d, k.m, k.i);
    p.r(2, 6, 4, 3, k.d);
    p.r(0, 7, 2, 2, k.d);
    p.r(2, 6, 4, 1, k.m);
    // four glowing register notches
    for (const x of [10, 14, 18, 22]) p.r(x, 5, 2, 2, k.b);
    p.r(10, 5, 2, 1, k.a);
    p.r(14, 5, 2, 1, k.a);
    p.r(18, 5, 2, 1, k.a);
    p.r(22, 5, 2, 1, k.a);
  }),
  byc('jit-warmup-bellows', [14, 12], (p, k) => {
    sl(p, 1, 0, 9, 2, k.d, k.m, k.i);
    sl(p, 1, 9, 9, 3, k.d, k.m, k.i);
    p.r(2, 2, 7, 7, k.o);
    p.r(2, 4, 7, 1, k.ol);
    p.r(2, 6, 7, 1, k.ol);
    p.p(2, 2, k.w);
    p.p(8, 2, k.w);
    p.r(10, 5, 3, 2, k.w);
    p.r(12, 5, 2, 2, k.b);
    p.p(13, 5, k.a);
    p.r(0, 8, 1, 4, k.o);
  }),
];
export const JIT = mix('jit', JIT_BESPOKE, RUNTIME);
export const JIT_ANCHORS: EntityDef[] = [
  ent(
    'jit-forge',
    [[48, 44]],
    (p) => {
      p.r(4, 16, 40, 28, '#333366');
      p.r(6, 18, 36, 2, '#9999cc');
      p.r(12, 24, 24, 16, '#000033');
      p.r(16, 8, 16, 8, '#ff6633');
      p.r(18, 8, 12, 2, '#ffcc33');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (let k = 0; k < 5; k++) {
          const fh = 4 + R((Math.sin(t * 7 + k * 1.5) * 0.5 + 0.5) * 8);
          p.r(14 + k * 4, 40 - fh, 3, fh, k % 2 ? '#ff6633' : '#ffff66');
        }
      },
      noFlip: true,
    },
  ),
];

export const LINKER_BESPOKE: EntityDef[] = [
  lnk('ld-lazy', [14, 12], (p, k) => {
    // brass-and-bakelite trip-latch switch on a wooden plinth, spring held back by a yellow release pin
    sl(p, 0, 9, 14, 3, k.o, k.ol, k.d);
    sl(p, 2, 4, 10, 5, k.d, k.m, k.i);
    p.r(3, 2, 2, 2, k.w);
    p.r(9, 2, 2, 2, k.w);
    for (let x = 4; x < 10; x += 2) {
      p.p(x, 3, k.m);
      p.p(x + 1, 4, k.m);
    }
    p.r(6, 6, 2, 3, k.a);
  }),
  lnk('ld-elf-canister', [14, 20], (p, k) => {
    sl(p, 2, 4, 10, 14, k.m, k.l, k.d);
    p.r(3, 1, 8, 3, k.m);
    p.r(3, 1, 8, 1, k.l);
    // riveted blue header collar and brass clasp
    p.r(1, 3, 12, 3, k.b);
    p.p(2, 4, k.l);
    p.p(5, 4, k.l);
    p.p(8, 4, k.l);
    p.p(11, 4, k.l);
    p.r(6, 5, 3, 4, k.wl);
    p.r(7, 7, 1, 1, k.i);
    sl(p, 1, 18, 12, 2, k.d, k.m, k.i);
  }),
  lnk('ld-plt-jumper', [14, 10], (p, k) => {
    sl(p, 0, 5, 14, 5, k.d, k.m, k.i);
    p.r(1, 2, 2, 4, k.w);
    p.r(11, 2, 2, 4, k.w);
    p.r(1, 1, 2, 1, k.wl);
    p.r(11, 1, 2, 1, k.wl);
    // arched copper jumper bar
    p.l(3, 2, 5, 0, k.a);
    p.r(5, 0, 4, 1, k.a);
    p.l(9, 0, 11, 2, k.a);
  }),
  lnk('ld-splicer', [20, 16], (p, k) => {
    sl(p, 0, 9, 20, 5, k.w, k.wl, k.o);
    p.r(2, 14, 2, 2, k.d);
    p.r(16, 14, 2, 2, k.d);
    p.r(1, 8, 18, 1, k.d);
    // hinge post and crimping lever with a yellow handle
    p.r(14, 3, 3, 6, k.w);
    p.r(6, 4, 9, 2, k.m);
    p.r(1, 3, 5, 3, k.a);
    p.r(1, 3, 5, 1, k.h);
    p.r(8, 6, 3, 2, k.d);
  }),
  lnk('ld-got-rack', [26, 32], (p, k) => {
    sl(p, 0, 0, 26, 30, k.d, k.m, k.i);
    p.r(2, 2, 22, 26, k.i);
    for (const y of [5, 12, 19, 26]) {
      p.r(2, y, 22, 1, k.d);
      for (let x = 4; x < 23; x += 5) {
        p.r(x, y + 1, 1, 2, k.w);
        p.p(x + 1, y + 2, k.w);
      }
    }
    // one bright key on the second row
    p.ring(14, 15, 1, k.a);
    p.r(14, 16, 1, 5, k.a);
    p.r(15, 18, 2, 1, k.a);
    p.r(0, 30, 26, 2, k.d);
  }),
  lnk('ld-rpath-post', [14, 14], (p, k) => {
    p.r(6, 1, 2, 11, k.d);
    p.r(6, 1, 1, 11, k.m);
    sl(p, 3, 12, 8, 2, k.m, k.l, k.d);
    sl(p, 7, 2, 7, 3, k.a, k.h, k.w);
    p.p(13, 3, k.i);
    sl(p, 0, 5, 7, 3, k.b, k.l, k.d);
    p.p(0, 6, k.i);
    sl(p, 7, 8, 6, 3, k.wl, k.h, k.w);
  }),
  lnk('ld-abi-gauge', [14, 8], (p, k) => {
    sl(p, 0, 5, 14, 3, k.d, k.m, k.i);
    p.r(1, 3, 12, 2, k.w);
    sl(p, 1, 0, 2, 5, k.w, k.wl, k.o);
    sl(p, 9, 0, 3, 5, k.w, k.wl, k.o);
    p.r(4, 1, 5, 1, k.a);
    p.p(4, 2, k.a);
    p.p(8, 2, k.a);
  }),
];
export const LINKER = mix('ld', LINKER_BESPOKE, LIBRARIES);
export const LINKER_ANCHORS: EntityDef[] = [
  lnk('ld-switchboard', [50, 44], (p, k) => {
    // a rack of knife switches: brass hinge and contact blocks, blades open or closed
    sl(p, 0, 0, 50, 40, k.d, k.m, k.i);
    p.r(3, 3, 44, 34, k.i);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        const x = 5 + c * 14;
        const y = 5 + r * 8;
        p.r(x, y + 3, 3, 4, k.w);
        p.r(x + 10, y + 3, 3, 4, k.w);
        p.r(x, y + 3, 3, 1, k.wl);
        p.r(x + 10, y + 3, 3, 1, k.wl);
        if ((r + c) % 2 === 0) {
          p.r(x + 2, y + 4, 9, 2, k.l);
          p.r(x + 5, y + 1, 2, 3, k.a);
        } else {
          p.l(x + 2, y + 4, x + 8, y, k.l);
          p.r(x + 7, y - 1 + 1, 3, 2, k.a);
        }
      }
    }
    p.r(3, 40, 6, 4, k.d);
    p.r(41, 40, 6, 4, k.d);
  }),
];

// =============================================================================================
// Zone C & D — Expanded OS Kernel (Entry & Arch) + PCIe/DMA Bus Fabric

export const KERNEL_ENTRY_BESPOKE: EntityDef[] = [
  cga('ke-seccomp', [16, 20], (p, k) => {
    // coin-sorter: hopper, brass box, stepped sieve plates behind a front cutout
    p.r(1, 1, 14, 1, k.wl);
    p.r(2, 2, 12, 1, k.w);
    p.r(3, 3, 10, 1, k.w);
    p.r(4, 4, 8, 2, k.w);
    sl(p, 2, 6, 12, 12, k.w, k.wl, k.d);
    p.r(4, 8, 8, 8, k.i);
    p.r(4, 9, 4, 1, k.l);
    p.r(6, 11, 4, 1, k.l);
    p.r(8, 13, 4, 1, k.l);
    p.r(3, 18, 2, 2, k.d);
    p.r(11, 18, 2, 2, k.d);
  }),
  cga('ke-uaccess', [34, 22], (p, k) => {
    // customs counter on a plinth, glowing pass-through tray, inspection lamp
    sl(p, 0, 7, 34, 4, k.m, k.l, k.d);
    sl(p, 1, 11, 32, 8, k.m, k.l, k.d);
    sl(p, 0, 19, 34, 3, k.d, k.m, k.i);
    p.r(11, 12, 12, 6, k.i);
    p.r(12, 14, 10, 3, k.wl);
    p.r(12, 17, 10, 1, k.w);
    p.r(3, 2, 2, 5, k.d);
    p.disc(4, 2, 2, k.a);
    p.p(3, 1, k.h);
  }),
  cga('ke-ptrace', [14, 26], (p, k) => {
    // brass periscope on a tripod, mirror hood on top, eyepiece below
    p.l(7, 18, 1, 25, k.d);
    p.l(7, 18, 13, 25, k.d);
    p.r(6, 18, 2, 8, k.d);
    sl(p, 6, 5, 3, 13, k.w, k.wl, k.d);
    sl(p, 3, 1, 9, 5, k.w, k.wl, k.d);
    p.r(4, 2, 4, 2, k.b);
    p.r(4, 15, 5, 3, k.d);
    p.r(5, 16, 3, 1, k.i);
  }),
  cga('ke-cred', [12, 14], (p, k) => {
    p.r(5, 0, 2, 2, k.d);
    p.ring(6, 5, 3, k.wl);
    p.r(3, 5, 1, 1, k.wl);
    for (const [x, n] of [[4, 0], [6, 1], [8, 2]] as const) {
      p.r(x, 8, 1, 5, k.l);
      p.r(x + 1, 10 + n, 1, 1, k.l);
      p.r(x + 1, 12, 1, 1, k.m);
    }
  }),
  cga('ke-fdtable', [10, 14], (p, k) => {
    sl(p, 1, 0, 8, 9, k.d, k.m, k.i);
    p.r(1, 0, 1, 1, k.i);
    p.r(8, 0, 1, 1, k.i);
    p.r(2, 8, 6, 1, k.i);
    // ticket stub sticking out of the bottom slot
    p.r(3, 8, 4, 6, k.c);
    p.r(3, 8, 4, 1, k.m);
    p.r(4, 11, 2, 1, k.r);
  }),
  cga('ke-vdso', [24, 12], (p, k) => {
    // curved brass pneumatic tube on two brackets, glass chamber in the middle
    p.r(0, 5, 1, 3, k.w);
    p.r(1, 4, 22, 5, k.w);
    p.r(1, 4, 22, 1, k.wl);
    p.r(23, 5, 1, 3, k.w);
    p.r(8, 2, 8, 8, k.d);
    p.r(9, 3, 6, 6, k.b);
    p.r(10, 4, 4, 4, k.wl);
    p.r(4, 9, 2, 3, k.d);
    p.r(19, 9, 2, 3, k.d);
  }),
  cga('ke-vfs-mount', [14, 14], (p, k) => {
    p.r(6, 1, 2, 11, k.d);
    p.r(6, 1, 1, 11, k.m);
    sl(p, 3, 12, 8, 2, k.m, k.l, k.d);
    sl(p, 7, 2, 7, 3, k.m, k.l, k.d);
    p.p(8, 3, k.i);
    sl(p, 0, 6, 7, 3, k.m, k.l, k.d);
    p.p(5, 7, k.i);
  }),
  cga('ke-ioctl', [14, 10], (p, k) => {
    sl(p, 0, 5, 14, 4, k.d, k.m, k.i);
    p.r(0, 9, 14, 1, k.m);
    for (const x of [2, 6, 10]) {
      p.r(x, 3, 2, 2, k.m);
      p.r(x - 1, 1, 4, 1, k.wl);
      p.r(x, 2, 2, 1, k.w);
      p.r(x, 0, 2, 1, k.wl);
    }
  }),
];
export const KERNEL_ENTRY = mix('ke', KERNEL_ENTRY_BESPOKE, KERNEL);
export const KERNEL_ENTRY_ANCHORS: EntityDef[] = [
  cga('ke-gatehouse', [52, 42], (p, k) => {
    // symmetric stone gatehouse: crenellated towers, lintel, iron portcullis with a brass padlock
    for (const x of [0, 40]) {
      sl(p, x, 4, 12, 38, k.m, k.l, k.d);
      for (let y = 9; y < 40; y += 6) p.r(x + 1, y, 10, 1, k.d);
      p.r(x + 4, 14, 3, 5, k.i);
      p.r(x + 4, 26, 3, 5, k.i);
    }
    for (const x of [0, 4, 8]) {
      p.r(x, 0, 3, 4, k.m);
      p.r(x, 0, 3, 1, k.l);
      p.r(49 - x - 2, 0, 3, 4, k.m);
      p.r(49 - x - 2, 0, 3, 1, k.l);
    }
    sl(p, 12, 4, 28, 6, k.m, k.l, k.d);
    p.r(12, 10, 28, 32, k.i);
    for (let n = 0; n < 7; n++) p.r(14 + n * 4, 10, 2, 29, k.d);
    for (let n = 0; n < 7; n++) p.r(14 + n * 4, 10, 1, 29, k.m);
    p.r(12, 21, 28, 3, k.d);
    p.r(12, 21, 28, 1, k.m);
    for (let n = 0; n < 7; n++) p.r(14 + n * 4, 39, 2, 2, k.l);
    // brass padlock on the crossbar
    p.r(24, 17, 1, 5, k.l);
    p.r(27, 17, 1, 5, k.l);
    p.r(25, 16, 2, 1, k.l);
    sl(p, 23, 22, 6, 6, k.w, k.wl, k.d);
    p.r(25, 24, 2, 2, k.i);
    p.r(0, 41, 52, 1, k.d);
  }),
];

export const KERNEL_ARCH_BESPOKE: EntityDef[] = [
  ent('ka-apic', [[16, 14]], (p) => {
    p.box(0, 0, 16, 14, '#000000', '#ff5555');
    for (let k = 0; k < 4; k++) p.r(2 + k * 3, 3, 2, 8, k % 2 ? '#ffff55' : '#aa0000');
  }),
  cga('ka-idt', [18, 22], (p, k) => {
    // iron rotary card index on two splayed feet, one yellow-tabbed card flipped up
    for (let n = 0; n < 6; n++) p.r(4 + n * 2, 3 + (n % 2), 2, 4, k.c);
    p.r(9, 0, 3, 3, k.a);
    p.r(9, 3, 2, 3, k.a);
    p.disc(9, 11, 6, k.d);
    p.disc(9, 11, 4, k.m);
    p.p(9, 11, k.l);
    p.p(7, 9, k.l);
    p.r(15, 10, 3, 2, k.w);
    p.l(6, 16, 3, 21, k.d);
    p.l(12, 16, 15, 21, k.d);
    p.r(2, 21, 4, 1, k.d);
    p.r(13, 21, 4, 1, k.d);
  }),
  cga('ka-rcu', [22, 18], (p, k) => {
    sl(p, 3, 9, 16, 3, k.d, k.m, k.i);
    p.p(4, 10, k.l);
    p.p(17, 10, k.l);
    p.l(10, 13, 3, 17, k.m);
    p.l(11, 13, 18, 17, k.m);
    p.r(10, 3, 2, 6, k.d);
    p.r(8, 1, 6, 3, k.r);
    p.r(8, 1, 6, 1, k.h);
    p.r(10, 8, 2, 2, k.a);
  }),
  cga('ka-fence', [32, 22], (p, k) => {
    // crossing gate: hinge post with a warning lantern, striped barrier arm, forked catch post
    sl(p, 1, 6, 4, 15, k.d, k.m, k.i);
    p.disc(3, 3, 2, k.a);
    p.p(2, 2, k.h);
    for (let n = 0; n < 8; n++) p.r(5 + n * 3, 9, 3, 3, n % 2 ? k.a : k.r);
    p.r(5, 9, 24, 1, k.l);
    sl(p, 27, 12, 4, 9, k.d, k.m, k.i);
    p.r(27, 10, 1, 3, k.m);
    p.r(30, 10, 1, 3, k.m);
    p.r(0, 21, 32, 1, k.d);
  }),
  cga('ka-ipi', [14, 10], (p, k) => {
    sl(p, 0, 6, 14, 4, k.d, k.m, k.i);
    p.r(1, 2, 2, 4, k.w);
    p.r(1, 1, 2, 1, k.wl);
    p.l(2, 4, 10, 3, k.m);
    p.r(10, 4, 3, 2, k.w);
    p.p(10, 3, k.a);
    p.p(9, 2, k.a);
    p.p(11, 2, k.a);
  }),
  cga('ka-cas', [12, 12], (p, k) => {
    sl(p, 0, 10, 12, 2, k.d, k.m, k.i);
    p.r(3, 0, 1, 4, k.m);
    p.r(8, 0, 1, 4, k.m);
    p.r(4, 0, 4, 1, k.m);
    sl(p, 0, 4, 12, 6, k.w, k.wl, k.d);
    p.r(2, 6, 3, 2, k.i);
    p.r(7, 6, 3, 2, k.i);
    p.r(7, 7, 4, 1, k.a);
    p.r(9, 5, 2, 1, k.a);
  }),
  cga('ka-syscall', [14, 14], (p, k) => {
    sl(p, 2, 12, 10, 2, k.d, k.m, k.i);
    p.r(6, 5, 3, 7, k.d);
    p.r(6, 5, 1, 7, k.m);
    p.l(7, 6, 1, 11, k.m);
    p.l(7, 6, 13, 11, k.m);
    p.r(6, 7, 3, 4, k.l);
    p.disc(7, 5, 1, k.a);
    p.p(7, 5, k.h);
  }),
];
export const KERNEL_ARCH = mix('ka', KERNEL_ARCH_BESPOKE, KERNEL);
export const KERNEL_ARCH_ANCHORS: EntityDef[] = [
  cga('ka-apicbank', [50, 42], (p, k) => {
    // relay switchboard: hooded status lamps on top, clapper switches and a busbar, heavy legs
    p.r(3, 36, 5, 6, k.d);
    p.r(42, 36, 5, 6, k.d);
    for (let n = 0; n < 6; n++) {
      const x = 4 + n * 7;
      p.r(x, 2, 6, 4, k.d);
      p.r(x + 1, 1, 4, 1, k.m);
      p.r(x + 1, 4, 4, 2, n % 2 ? k.a : k.r);
    }
    sl(p, 0, 7, 50, 29, k.d, k.m, k.i);
    p.r(3, 10, 44, 23, k.i);
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 6; c++) {
        const x = 5 + c * 7;
        const y = 12 + r * 11;
        p.r(x, y, 6, 5, k.w);
        p.r(x, y, 6, 1, k.wl);
        p.r(x + 1, y + 6, 5, 2, k.m);
        if ((r + c) % 2) p.p(x + 5, y + 5, k.a);
      }
    }
    p.r(4, 21, 42, 1, k.l);
  }),
];

export const BUS_FABRIC_BESPOKE: EntityDef[] = [
  bus('bf-iommu', [28, 30], (p, k) => {
    // customs tollbooth with a raised striped barrier arm
    sl(p, 0, 27, 28, 3, k.d, k.m, k.i);
    sl(p, 2, 8, 14, 19, k.m, k.l, k.d);
    p.r(0, 5, 18, 3, k.d);
    p.r(0, 5, 18, 1, k.l);
    p.r(5, 12, 8, 7, k.i);
    p.r(5, 12, 8, 1, k.l);
    p.r(17, 18, 3, 9, k.m);
    for (let n = 0; n < 8; n++) p.p(20 + n, 17 - n * 2, n % 2 ? k.d : k.l);
    for (let n = 0; n < 8; n++) p.p(20 + n, 18 - n * 2, n % 2 ? k.d : k.l);
  }),
  bus('bf-dmaring', [22, 22], (p, k) => {
    sl(p, 5, 19, 12, 3, k.d, k.m, k.i);
    p.r(9, 14, 4, 5, k.m);
    p.ring(11, 8, 7, k.m);
    p.disc(11, 8, 2, k.d);
    for (let n = 0; n < 8; n++) {
      const a = (n * Math.PI) / 4;
      const x = 11 + Math.round(Math.cos(a) * 7);
      const y = 8 + Math.round(Math.sin(a) * 7);
      p.r(x - 1, y, 2, 3, n % 2 ? k.d : k.l);
    }
  }),
  bus('bf-crossbar', [22, 22], (p, k) => {
    sl(p, 1, 2, 20, 17, k.m, k.l, k.d);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) p.r(4 + c * 4, 5 + r * 4, 2, 2, k.i);
    }
    // two draped patch cords bridging sockets
    p.l(5, 6, 9, 14, k.l);
    p.l(9, 14, 13, 10, k.l);
    p.l(17, 6, 13, 12, k.d);
    p.l(13, 12, 9, 8, k.d);
    p.r(3, 19, 3, 3, k.d);
    p.r(16, 19, 3, 3, k.d);
  }),
  bus('bf-mmio', [18, 16], (p, k) => {
    sl(p, 0, 0, 18, 16, k.m, k.l, k.d);
    for (const [x, y] of [[2, 2], [10, 2], [2, 9], [10, 9]] as const) p.r(x, y, 6, 5, k.i);
    p.r(11, 5, 4, 4, k.l);
    p.r(3, 5, 4, 4, k.l);
    p.r(4, 6, 2, 1, k.d);
    p.r(12, 6, 2, 1, k.d);
  }),
  bus('bf-msix', [12, 12], (p, k) => {
    sl(p, 0, 8, 12, 4, k.m, k.l, k.d);
    p.r(5, 4, 2, 4, k.d);
    p.r(2, 3, 8, 2, k.l);
    p.r(4, 0, 4, 3, k.l);
    p.r(9, 5, 2, 2, k.d);
  }),
  bus('bf-retimer', [12, 12], (p, k) => {
    sl(p, 0, 3, 3, 9, k.m, k.l, k.d);
    p.r(3, 5, 8, 2, k.l);
    p.r(9, 5, 2, 5, k.l);
    p.r(8, 9, 2, 1, k.l);
    p.p(2, 6, k.i);
  }),
  bus('bf-lane', [10, 14], (p, k) => {
    p.r(4, 0, 3, 4, k.d);
    p.r(3, 0, 5, 1, k.l);
    sl(p, 1, 4, 8, 9, k.m, k.l, k.d);
    p.r(2, 6, 6, 3, k.i);
    p.r(3, 7, 1, 1, k.l);
    p.r(5, 7, 1, 1, k.l);
    p.r(7, 7, 1, 1, k.l);
    p.r(0, 13, 10, 1, k.d);
  }),
  bus('bf-tlp', [14, 10], (p, k) => {
    sl(p, 1, 2, 12, 5, k.m, k.l, k.d);
    p.r(1, 2, 2, 5, k.l);
    p.r(11, 2, 2, 5, k.l);
    p.r(6, 2, 2, 5, k.d);
    p.r(3, 7, 2, 3, k.d);
    p.r(9, 7, 2, 3, k.d);
    p.r(2, 9, 10, 1, k.d);
  }),
];
export const BUS_FABRIC = mix('bf', BUS_FABRIC_BESPOKE, DRIVERS);
export const BUS_FABRIC_ANCHORS: EntityDef[] = [
  bus('bf-pcieswitch', [56, 40], (p, k) => {
    // rackmount switch chassis: mounting ears, two rows of port cages with status LEDs, on a stand
    p.r(4, 30, 4, 10, k.d);
    p.r(48, 30, 4, 10, k.d);
    p.r(4, 35, 48, 2, k.d);
    sl(p, 0, 4, 56, 26, k.m, k.l, k.d);
    p.r(0, 8, 3, 18, k.l);
    p.r(53, 8, 3, 18, k.l);
    p.r(10, 6, 36, 1, k.d);
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 7; c++) {
        const x = 6 + c * 7;
        const y = 10 + r * 9;
        p.r(x, y, 5, 5, k.l);
        p.r(x + 1, y + 1, 3, 3, k.i);
        p.p(x + 2, y + 6, c % 2 ? k.d : k.i);
      }
    }
  }),
];

// =============================================================================================
// Zone E — Expanded Hidden Rings: VMM, EPT, SMRAM, ME MINIX 3

export const VMM_BESPOKE: EntityDef[] = [
  ent('vmm-ghostcard', [[22, 12]], (p) => {
    p.frame(0, 0, 22, 9, '#aaaaaa');
    p.frame(3, 2, 8, 5, '#555555');
    for (let x = 2; x < 20; x += 3) p.r(x, 9, 1, 3, '#aaaaaa');
  }),
  grn('vmm-balloon', [16, 24], (p, k) => {
    p.r(4, 0, 8, 2, k.m);
    p.r(7, 2, 2, 3, k.m);
    for (let y = 5; y < 15; y += 2) {
      p.r(3 + (y % 4 ? 0 : 1), y, 10 - (y % 4 ? 0 : 2), 1, k.m);
      p.r(2, y + 1, 12, 1, k.d);
    }
    sl(p, 2, 15, 12, 5, k.d, k.m, k.i);
    p.disc(8, 17, 2, k.l);
    p.p(8, 17, k.i);
    sl(p, 0, 21, 16, 3, k.d, k.m, k.i);
  }),
  grn('vmm-virtio', [34, 20], (p, k) => {
    // twin-roller conveyor bench, notched belt, two crates riding on top
    sl(p, 1, 12, 32, 3, k.m, k.l, k.d);
    p.r(2, 15, 3, 5, k.d);
    p.r(29, 15, 3, 5, k.d);
    p.r(16, 15, 3, 5, k.d);
    p.disc(5, 8, 4, k.d);
    p.disc(28, 8, 4, k.d);
    p.disc(5, 8, 1, k.l);
    p.disc(28, 8, 1, k.l);
    p.r(5, 4, 24, 2, k.m);
    for (let x = 6; x < 28; x += 3) p.p(x, 4, k.l);
    p.r(5, 12, 24, 1, k.m);
    sl(p, 8, 0, 8, 4, k.l, k.l, k.d);
    sl(p, 19, 0, 8, 4, k.l, k.l, k.d);
    p.r(9, 1, 6, 2, k.m);
    p.r(20, 1, 6, 2, k.m);
  }),
  grn('vmm-ovmf', [10, 12], (p, k) => {
    sl(p, 1, 3, 8, 9, k.d, k.m, k.i);
    for (const x of [2, 4, 6]) p.r(x, 0, 1, 3, k.m);
    p.r(2, 0, 6, 1, k.m);
    p.r(3, 5, 4, 3, k.l);
    p.r(0, 11, 10, 1, k.d);
  }),
  grn('vmm-vfio', [18, 16], (p, k) => {
    sl(p, 2, 12, 14, 4, k.d, k.m, k.i);
    sl(p, 6, 2, 6, 11, k.d, k.m, k.i);
    sl(p, 4, 3, 2, 9, k.m, k.l, k.d);
    sl(p, 12, 3, 2, 9, k.m, k.l, k.d);
    p.p(8, 4, k.l);
    p.p(9, 10, k.l);
    p.r(0, 6, 18, 3, k.m);
    p.r(0, 6, 18, 1, k.l);
  }),
  grn('vmm-snapshot', [14, 14], (p, k) => {
    p.l(5, 9, 3, 13, k.d);
    p.l(9, 9, 11, 13, k.d);
    p.r(7, 9, 1, 5, k.d);
    sl(p, 1, 2, 12, 7, k.m, k.l, k.d);
    p.disc(5, 5, 2, k.i);
    p.p(4, 4, k.l);
    p.r(9, 3, 2, 1, k.l);
    p.r(9, 9, 4, 4, k.l);
    p.r(10, 10, 2, 2, k.d);
  }),
  grn('vmm-serial', [12, 12], (p, k) => {
    p.r(2, 9, 8, 3, k.d);
    p.r(1, 3, 10, 3, k.m);
    p.r(2, 6, 8, 1, k.m);
    p.r(3, 7, 6, 1, k.m);
    p.r(1, 3, 10, 1, k.l);
    for (const x of [3, 5, 7, 9]) p.p(x, 4, k.i);
    for (const x of [4, 6, 8]) p.p(x, 6, k.i);
    p.r(0, 2, 2, 3, k.l);
    p.r(10, 2, 2, 3, k.l);
  }),
  grn('vmm-watchdog', [12, 12], (p, k) => {
    sl(p, 0, 8, 12, 3, k.d, k.m, k.i);
    p.r(4, 1, 4, 1, k.l);
    p.r(3, 2, 6, 1, k.m);
    p.r(2, 3, 8, 2, k.m);
    p.r(1, 5, 10, 3, k.m);
    p.r(2, 2, 1, 5, k.l);
    p.r(10, 8, 2, 1, k.l);
    p.p(11, 7, k.l);
  }),
];
export const VMM = mix('vmm', VMM_BESPOKE, RING1);
export const VMM_ANCHORS: EntityDef[] = [
  grn('vmm-qemu', [50, 38], (p, k) => {
    // rack hypervisor cabinet: two recessed machine bays, a teleprinter keyboard shelf, four levelling feet
    sl(p, 1, 0, 48, 24, k.m, k.l, k.d);
    for (const x of [4, 26]) {
      p.r(x, 3, 20, 17, k.i);
      sl(p, x + 1, 4, 18, 15, k.d, k.m, k.i);
      for (let y = 6; y < 12; y += 2) p.r(x + 3, y, 12, 1, k.i);
      p.r(x + 16, 11, 1, 4, k.l);
    }
    sl(p, 0, 24, 50, 4, k.m, k.l, k.d);
    p.r(5, 25, 40, 2, k.d);
    for (let x = 6; x < 44; x += 4) p.p(x, 25, k.l);
    p.r(19, 22, 12, 2, k.l);
    sl(p, 2, 28, 46, 6, k.d, k.m, k.i);
    for (const x of [3, 16, 30, 43]) p.r(x, 34, 4, 4, k.d);
  }),
];

export const EPT_BESPOKE: EntityDef[] = [
  grn('ept-walker', [16, 14], (p, k) => {
    // solid stone staircase, mint lantern on the bottom step
    for (let n = 0; n < 4; n++) sl(p, n * 4, 11 - n * 3, 4, 3 + n * 3, k.m, k.l, k.d);
    p.r(1, 8, 3, 3, k.l);
    p.p(2, 7, k.d);
  }),
  grn('ept-pigeonhole', [18, 22], (p, k) => {
    sl(p, 1, 0, 16, 19, k.d, k.m, k.i);
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) p.r(3 + c * 5, 2 + r * 8, 4, 6, k.i);
    }
    p.r(13, 12, 3, 3, k.l);
    p.r(13, 12, 3, 1, k.h);
    p.r(2, 19, 3, 3, k.d);
    p.r(13, 19, 3, 3, k.d);
  }),
  grn('ept-switchstand', [18, 30], (p, k) => {
    sl(p, 1, 26, 16, 3, k.d, k.m, k.i);
    p.r(8, 10, 3, 16, k.d);
    p.r(8, 10, 1, 16, k.m);
    sl(p, 3, 2, 12, 8, k.m, k.l, k.d);
    for (const y of [4, 6, 8]) p.r(5, y, 8, 1, k.i);
    p.l(9, 24, 14, 15, k.m);
    p.disc(14, 14, 2, k.l);
    p.p(14, 14, k.d);
  }),
  grn('ept-canister', [12, 12], (p, k) => {
    sl(p, 1, 2, 10, 6, k.m, k.l, k.d);
    p.r(1, 2, 1, 6, k.l);
    p.r(10, 2, 1, 6, k.d);
    p.r(5, 2, 2, 6, k.l);
    p.r(2, 8, 2, 3, k.d);
    p.r(8, 8, 2, 3, k.d);
    p.r(1, 10, 10, 1, k.d);
  }),
  grn('ept-fault-reel', [12, 12], (p, k) => {
    sl(p, 0, 0, 12, 6, k.d, k.m, k.i);
    p.disc(3, 3, 2, k.m);
    p.disc(9, 3, 2, k.m);
    p.p(3, 3, k.i);
    p.p(9, 3, k.i);
    p.r(5, 6, 3, 6, k.l);
    p.p(5, 8, k.i);
    p.p(7, 10, k.i);
  }),
  grn('ept-tlb-stamp', [12, 12], (p, k) => {
    sl(p, 0, 8, 12, 4, k.d, k.m, k.i);
    p.r(2, 8, 8, 2, k.l);
    p.r(5, 0, 3, 3, k.m);
    p.r(6, 3, 1, 3, k.m);
    sl(p, 3, 6, 7, 3, k.m, k.l, k.d);
  }),
  grn('ept-root-plaque', [18, 18], (p, k) => {
    sl(p, 0, 0, 18, 18, k.d, k.m, k.i);
    for (const [x, y] of [[2, 2], [15, 2], [2, 15], [15, 15]] as const) p.p(x, y, k.l);
    p.disc(9, 7, 2, k.l);
    p.r(8, 9, 2, 6, k.l);
    p.p(9, 7, k.i);
  }),
];
export const EPT = mix('ept', EPT_BESPOKE, RING1);
export const EPT_ANCHORS: EntityDef[] = [
  grn('ept-matrix', [50, 40], (p, k) => {
    // twin-towered gatehouse bridged by a catwalk, mint signal lamps
    for (const x of [0, 35]) {
      sl(p, x, 3, 15, 37, k.m, k.l, k.d);
      for (const y of [10, 18, 26]) p.r(x + 5, y, 4, 5, k.i);
      p.r(x + 5, 0, 5, 3, k.l);
      p.r(x, 1, 3, 2, k.m);
      p.r(x + 12, 1, 3, 2, k.m);
    }
    p.r(15, 13, 20, 27, k.i);
    sl(p, 15, 11, 20, 3, k.m, k.l, k.d);
    p.r(15, 8, 20, 1, k.d);
    for (const x of [16, 24, 33]) {
      p.r(x, 8, 1, 3, k.d);
      p.p(x, 7, k.l);
    }
  }),
];

export const SMRAM_BESPOKE: EntityDef[] = [
  ent('sm-dlck', [[16, 14]], (p) => {
    p.box(0, 0, 16, 14, '#404040', '#c0c0c0');
    p.r(5, 3, 6, 3, '#ffffff');
    p.r(4, 6, 8, 6, '#808080');
    p.r(7, 8, 2, 2, '#000000');
  }),
  gry('sm-savestate', [20, 16], (p, k) => {
    sl(p, 1, 6, 18, 8, k.m, k.l, k.d);
    p.r(7, 9, 6, 2, k.h);
    p.r(8, 10, 4, 1, k.i);
    for (let n = 0; n < 4; n++) {
      p.r(3 + n * 4, 2 - (n % 2), 3, 4 + (n % 2), k.l);
      p.r(3 + n * 4, 2 - (n % 2), 3, 1, k.h);
    }
    p.r(0, 14, 20, 2, k.d);
  }),
  gry('sm-rsm', [12, 10], (p, k) => {
    sl(p, 0, 0, 12, 10, k.d, k.m, k.i);
    p.r(1, 4, 9, 3, k.m);
    p.r(1, 4, 9, 1, k.l);
    p.r(10, 4, 1, 3, k.i);
    p.l(3, 2, 10, 1, k.h);
  }),
  gry('sm-tseg', [18, 36], (p, k) => {
    sl(p, 0, 0, 18, 4, k.d, k.m, k.i);
    sl(p, 1, 4, 16, 30, k.m, k.l, k.d);
    p.r(8, 4, 2, 30, k.i);
    for (let y = 6; y < 33; y += 3) {
      p.p(5, y, k.h);
      p.p(12, y, k.h);
    }
    sl(p, 0, 34, 18, 2, k.d, k.m, k.i);
  }),
  gry('sm-smbase', [12, 14], (p, k) => {
    p.l(6, 9, 2, 13, k.d);
    p.l(6, 9, 10, 13, k.d);
    p.r(6, 9, 1, 5, k.d);
    p.disc(6, 5, 4, k.m);
    p.disc(6, 5, 3, k.d);
    p.l(6, 5, 9, 2, k.h);
    p.p(6, 5, k.l);
  }),
  gry('sm-smi-bell', [12, 12], (p, k) => {
    p.r(5, 10, 2, 2, k.d);
    p.r(4, 1, 4, 1, k.l);
    p.r(3, 2, 6, 1, k.m);
    p.r(2, 3, 8, 2, k.m);
    p.r(1, 5, 10, 2, k.m);
    p.r(0, 7, 12, 1, k.d);
    p.r(5, 8, 2, 2, k.l);
    p.p(8, 3, k.h);
  }),
  gry('sm-dopen', [10, 12], (p, k) => {
    sl(p, 1, 0, 8, 12, k.m, k.l, k.d);
    p.r(4, 2, 2, 8, k.i);
    p.r(3, 5, 5, 2, k.h);
    p.r(6, 4, 3, 4, k.h);
    p.p(7, 5, k.i);
  }),
  gry('sm-handler', [20, 20], (p, k) => {
    p.r(2, 12, 2, 8, k.d);
    p.r(16, 12, 2, 8, k.d);
    p.r(2, 15, 16, 1, k.d);
    sl(p, 1, 11, 18, 2, k.m, k.l, k.d);
    p.r(3, 3, 14, 1, k.l);
    sl(p, 2, 4, 16, 7, k.m, k.l, k.d);
    p.r(8, 5, 4, 4, k.h);
    p.p(4, 8, k.i);
    p.p(15, 8, k.i);
  }),
];
export const SMRAM = mix('sm', SMRAM_BESPOKE, RING2);
export const SMRAM_ANCHORS: EntityDef[] = [
  ent('sm-vaultdoor', [[48, 44]], (p) => {
    p.box(0, 0, 48, 44, '#404040', '#c0c0c0');
    p.disc(24, 22, 14, '#808080');
    p.disc(24, 22, 10, '#000000');
    p.r(22, 12, 4, 20, '#ffffff');
    p.r(14, 20, 20, 4, '#ffffff');
  }),
];

export const ME_MINIX_USER_BESPOKE: EntityDef[] = [
  amb('mx-amt-intercom', [12, 12], (p, k) => {
    sl(p, 1, 3, 10, 8, k.m, k.l, k.d);
    p.r(2, 11, 2, 1, k.d);
    p.r(8, 11, 2, 1, k.d);
    p.r(3, 5, 4, 4, k.i);
    p.p(4, 6, k.l);
    p.p(6, 6, k.l);
    p.p(4, 8, k.l);
    p.p(6, 8, k.l);
    p.r(5, 1, 3, 2, k.l);
    p.r(9, 6, 1, 2, k.l);
  }),
  amb('mx-rs-starter', [20, 20], (p, k) => {
    sl(p, 0, 9, 20, 9, k.m, k.l, k.d);
    p.r(0, 18, 20, 2, k.d);
    // twin jumper-clamp electrodes and a side hand-crank
    for (const x of [4, 13]) {
      p.r(x, 2, 2, 7, k.l);
      p.r(x - 1, 1, 4, 2, k.m);
    }
    p.r(8, 12, 4, 3, k.d);
    p.r(15, 12, 3, 1, k.l);
    p.r(17, 10, 1, 4, k.l);
  }),
  amb('mx-httpd-dispenser', [12, 12], (p, k) => {
    sl(p, 1, 1, 10, 7, k.m, k.l, k.d);
    p.r(2, 8, 2, 2, k.d);
    p.r(8, 8, 2, 2, k.d);
    p.r(3, 6, 6, 1, k.i);
    p.r(4, 7, 4, 4, k.l);
    p.p(5, 9, k.d);
    p.p(6, 3, k.l);
  }),
  amb('mx-tcp-manifold', [32, 28], (p, k) => {
    sl(p, 2, 24, 28, 4, k.d, k.m, k.i);
    sl(p, 2, 16, 28, 6, k.m, k.l, k.d);
    p.r(13, 8, 6, 9, k.m);
    p.r(13, 8, 1, 9, k.l);
    p.disc(16, 5, 5, k.l);
    p.disc(16, 5, 3, k.d);
    p.l(16, 5, 18, 3, k.l);
    // two braided hoses
    for (let n = 0; n < 8; n++) {
      p.p(1 - (n > 5 ? 1 : 0) + (n < 2 ? 1 : 0), 16 - n, n % 2 ? k.d : k.l);
      p.p(30 + (n > 5 ? 1 : 0) - (n < 2 ? 1 : 0), 16 - n, n % 2 ? k.d : k.l);
    }
    p.r(1, 8, 2, 1, k.l);
    p.r(29, 8, 2, 1, k.l);
  }),
  amb('mx-pm-timeclock', [14, 26], (p, k) => {
    sl(p, 2, 22, 10, 4, k.d, k.m, k.i);
    sl(p, 1, 4, 12, 18, k.m, k.l, k.d);
    p.r(5, 0, 4, 5, k.l);
    p.r(3, 4, 8, 1, k.i);
    p.disc(7, 11, 3, k.l);
    p.disc(7, 11, 2, k.i);
    p.l(7, 11, 7, 9, k.l);
    p.r(12, 14, 2, 5, k.d);
  }),
  amb('mx-vfs-rolodex', [14, 12], (p, k) => {
    p.l(7, 8, 2, 11, k.d);
    p.l(7, 8, 12, 11, k.d);
    for (let n = 0; n < 5; n++) p.r(3 + n * 2, 1, 2, 3, n % 2 ? k.l : k.m);
    p.disc(7, 6, 3, k.d);
    p.disc(7, 6, 1, k.l);
    p.r(11, 5, 2, 2, k.l);
  }),
  amb('mx-ipc-capsule', [16, 24], (p, k) => {
    sl(p, 3, 21, 10, 3, k.d, k.m, k.i);
    p.r(6, 0, 4, 4, k.d);
    sl(p, 2, 4, 12, 17, k.m, k.l, k.d);
    p.r(4, 6, 8, 11, k.i);
    p.r(5, 8, 6, 6, k.l);
    p.r(5, 8, 6, 1, k.h);
    p.r(13, 6, 2, 11, k.d);
  }),
  amb('mx-watchdog-clock', [12, 14], (p, k) => {
    sl(p, 2, 11, 8, 3, k.d, k.m, k.i);
    sl(p, 1, 1, 10, 10, k.m, k.l, k.d);
    p.disc(6, 6, 3, k.i);
    p.ring(6, 6, 3, k.l);
    p.p(6, 3, k.l);
    p.p(6, 9, k.l);
    p.p(3, 6, k.l);
    p.p(9, 6, k.l);
    p.l(6, 6, 8, 4, k.l);
  }),
];
export const ME_MINIX_USER = mix('mx', ME_MINIX_USER_BESPOKE, USERSPACE);
export const ME_MINIX_USER_ANCHORS: EntityDef[] = [
  ent('mx-bottle', [[46, 44]], (p) => {
    p.frame(4, 6, 38, 38, '#ffffff');
    p.r(15, 0, 16, 6, '#aaaaaa');
    p.r(8, 22, 8, 20, '#555555');
    p.r(18, 14, 10, 28, '#aaaaaa');
    p.r(30, 26, 8, 16, '#555555');
    for (let y = 17; y < 38; y += 4) p.r(20, y, 2, 2, '#ffffff');
  }),
];

export const ME_MINIX_KERN_BESPOKE: EntityDef[] = [
  amb('mk-pneumatic', [20, 34], (p, k) => {
    sl(p, 3, 28, 14, 6, k.d, k.m, k.i);
    p.r(8, 4, 4, 24, k.m);
    p.r(8, 4, 1, 24, k.l);
    sl(p, 4, 2, 12, 3, k.m, k.l, k.d);
    for (const x of [1, 14]) {
      sl(p, x, 5, 5, 23, k.d, k.m, k.i);
      p.r(x + 1, 8, 3, 16, k.i);
    }
    p.r(2, 14, 3, 6, k.l);
    p.r(2, 14, 3, 1, k.h);
  }),
  amb('mk-watchdog', [18, 20], (p, k) => {
    sl(p, 3, 10, 12, 10, k.d, k.m, k.i);
    p.r(7, 0, 4, 1, k.l);
    p.r(5, 1, 8, 2, k.m);
    p.r(4, 3, 10, 3, k.m);
    p.r(3, 6, 12, 3, k.m);
    p.r(5, 2, 1, 5, k.l);
    p.r(16, 3, 2, 5, k.l);
    p.r(15, 2, 3, 2, k.l);
    p.r(16, 12, 2, 1, k.l);
    p.r(17, 11, 1, 3, k.l);
  }),
  amb('mk-annunciator', [12, 10], (p, k) => {
    sl(p, 0, 0, 12, 10, k.d, k.m, k.i);
    p.r(2, 2, 8, 6, k.i);
    p.disc(6, 4, 2, k.l);
    p.r(3, 6, 6, 2, k.m);
    p.r(2, 5, 8, 1, k.l);
  }),
  amb('mk-grantkey', [10, 12], (p, k) => {
    sl(p, 0, 8, 10, 4, k.d, k.m, k.i);
    p.r(3, 0, 4, 1, k.l);
    p.r(2, 1, 6, 1, k.l);
    p.r(1, 2, 8, 4, k.l);
    p.r(2, 6, 6, 1, k.m);
    p.r(3, 7, 4, 1, k.d);
    p.r(4, 3, 2, 2, k.i);
    p.r(4, 5, 2, 1, k.i);
  }),
  amb('mk-sandbox', [18, 20], (p, k) => {
    sl(p, 0, 16, 18, 4, k.d, k.m, k.i);
    p.r(5, 2, 8, 1, k.m);
    p.r(3, 3, 12, 1, k.m);
    p.r(2, 4, 1, 12, k.m);
    p.r(15, 4, 1, 12, k.m);
    p.r(3, 4, 12, 12, k.i);
    p.disc(9, 11, 3, k.l);
    p.disc(9, 11, 1, k.i);
    p.disc(5, 13, 1, k.m);
  }),
  amb('mk-ringbuffer', [20, 16], (p, k) => {
    sl(p, 3, 11, 14, 5, k.d, k.m, k.i);
    p.r(9, 2, 2, 5, k.l);
    sl(p, 1, 6, 18, 5, k.m, k.l, k.d);
    for (const x of [2, 5, 8, 11, 14]) p.r(x, 7, 2, 3, k.i);
    p.r(8, 7, 3, 3, k.l);
  }),
  amb('mk-endpoint', [10, 12], (p, k) => {
    sl(p, 1, 1, 8, 9, k.d, k.m, k.i);
    p.r(2, 10, 2, 2, k.d);
    p.r(6, 10, 2, 2, k.d);
    p.disc(5, 4, 2, k.l);
    p.disc(5, 4, 1, k.i);
    p.r(4, 6, 2, 6, k.m);
    p.p(4, 8, k.d);
    p.p(5, 10, k.d);
  }),
  amb('mk-schedwheel', [14, 14], (p, k) => {
    p.l(7, 8, 2, 13, k.d);
    p.l(7, 8, 12, 13, k.d);
    p.disc(7, 7, 4, k.m);
    p.disc(7, 7, 1, k.i);
    for (let n = 0; n < 8; n++) {
      const a = (n * Math.PI) / 4;
      p.p(7 + Math.round(Math.cos(a) * 5), 7 + Math.round(Math.sin(a) * 5), k.l);
    }
    p.r(6, 0, 3, 2, k.l);
  }),
];
export const ME_MINIX_KERN = mix('mk', ME_MINIX_KERN_BESPOKE, FIRMWARE);
export const ME_MINIX_KERN_ANCHORS: EntityDef[] = [
  amb('mk-microkern', [48, 38], (p, k) => {
    // message-switching rotunda: central kernel plinth under a dome, four isolated booths linked by pneumatic tubes
    sl(p, 0, 32, 48, 6, k.d, k.m, k.i);
    p.r(19, 5, 10, 1, k.l);
    p.r(16, 6, 16, 1, k.m);
    p.r(14, 7, 20, 2, k.m);
    p.r(13, 9, 22, 1, k.m);
    sl(p, 13, 10, 22, 22, k.m, k.l, k.d);
    p.r(21, 18, 6, 14, k.i);
    p.r(22, 26, 4, 6, k.l);
    p.r(22, 26, 4, 1, k.h);
    for (const x of [0, 7, 35, 42]) {
      sl(p, x, 24, 6, 8, k.d, k.m, k.i);
      p.r(x, 22, 6, 2, k.l);
      p.r(x + 2, 27, 2, 5, k.i);
      p.r(x + 2, 19, 2, 3, k.w);
    }
    p.r(2, 19, 11, 1, k.w);
    p.r(35, 19, 11, 1, k.w);
    p.r(9, 19, 1, 3, k.w);
    p.r(38, 19, 1, 3, k.w);
  }),
];

// =============================================================================================
// Zone F — Deep Silicon, Lithography & Fundamental Physics (Bespoke + 1-bit/wafer remixes)

export const UARCH_BESPOKE: EntityDef[] = [
  bpr('ua-rob', [22, 14], (p, k) => {
    // ticket-rail stand: weighted base, rail, four hanging punched cards, the front one highlighted
    sl(p, 0, 10, 22, 4, k.d, k.m, k.i);
    sl(p, 0, 2, 22, 3, k.m, k.l, k.d);
    p.r(1, 5, 2, 5, k.d);
    p.r(19, 5, 2, 5, k.d);
    for (const x of [4, 8, 12]) {
      p.r(x, 5, 1, 1, k.l);
      p.r(x - 1, 6, 3, 4, k.m);
    }
    p.r(16, 5, 1, 1, k.l);
    p.r(15, 6, 3, 4, k.l);
    p.r(16, 7, 1, 2, k.i);
  }),
  bpr('ua-bpred', [16, 24], (p, k) => {
    sl(p, 2, 20, 12, 4, k.d, k.m, k.i);
    p.r(7, 8, 2, 12, k.m);
    p.r(7, 8, 1, 12, k.l);
    // two-aspect semaphore paddle, tilted toward the predicted track
    p.l(3, 6, 13, 2, k.l);
    p.l(3, 7, 13, 3, k.m);
    p.disc(8, 8, 1, k.d);
    p.l(8, 19, 13, 12, k.l);
    p.disc(13, 11, 1, k.l);
  }),
  bpr('ua-l1', [18, 20], (p, k) => {
    sl(p, 1, 0, 16, 18, k.d, k.m, k.i);
    // three pull-out drawers, top one opened with a glowing card
    p.r(2, 4, 14, 3, k.l);
    p.r(5, 2, 8, 2, k.l);
    p.r(2, 8, 14, 4, k.m);
    p.r(7, 9, 4, 1, k.l);
    p.r(2, 13, 14, 4, k.m);
    p.r(7, 14, 4, 1, k.l);
    p.r(2, 18, 2, 2, k.d);
    p.r(14, 18, 2, 2, k.d);
  }),
  bpr('ua-alu', [30, 28], (p, k) => {
    sl(p, 0, 22, 30, 6, k.d, k.m, k.i);
    sl(p, 3, 8, 20, 14, k.m, k.l, k.d);
    sl(p, 6, 4, 14, 5, k.m, k.l, k.d);
    for (let n = 0; n < 6; n++) {
      p.r(7 + n * 2, 5, 1, 3, k.i);
      p.p(7 + n * 2, 6, k.l);
    }
    for (let y = 11; y < 20; y += 3) p.r(5, y, 16, 1, k.d);
    // side crank
    p.r(24, 13, 5, 2, k.l);
    p.r(28, 8, 2, 8, k.l);
  }),
  bpr('ua-tlb', [14, 12], (p, k) => {
    p.l(2, 11, 6, 8, k.d);
    p.l(12, 11, 8, 8, k.d);
    for (let n = 0; n < 5; n++) p.r(3 + n * 2, 1, 2, 3, k.m);
    p.r(7, 0, 2, 3, k.l);
    p.disc(7, 6, 4, k.d);
    p.disc(7, 6, 1, k.l);
    p.r(11, 5, 2, 2, k.m);
  }),
  bpr('ua-regfile', [12, 10], (p, k) => {
    sl(p, 0, 0, 12, 4, k.d, k.m, k.i);
    for (const x of [1, 4, 7, 10]) p.r(x, 3, 1, 2, k.l);
    for (const x of [1, 7, 10]) p.r(x - 1, 5, 3, 3, k.m);
    p.r(3, 5, 3, 5, k.l);
    p.p(4, 7, k.i);
  }),
  bpr('ua-clock', [10, 12], (p, k) => {
    sl(p, 1, 9, 8, 3, k.d, k.m, k.i);
    sl(p, 2, 1, 6, 3, k.l, k.h, k.m);
    sl(p, 2, 3, 6, 6, k.m, k.l, k.d);
    p.p(3, 2, k.h);
    p.r(3, 9, 1, 3, k.l);
    p.r(6, 9, 1, 3, k.l);
  }),
  bpr('ua-storebuf', [14, 10], (p, k) => {
    p.r(3, 0, 8, 5, k.l);
    p.r(4, 1, 2, 1, k.i);
    p.r(4, 3, 2, 1, k.i);
    sl(p, 1, 5, 12, 4, k.m, k.l, k.d);
    for (let x = 2; x < 12; x += 2) p.r(x, 6, 1, 2, k.d);
    p.r(1, 9, 2, 1, k.d);
    p.r(11, 9, 2, 1, k.d);
  }),
];
export const UARCH = mix('ua', UARCH_BESPOKE, RING3);
export const UARCH_ANCHORS: EntityDef[] = [
  bpr('ua-pipeline', [56, 36], (p, k) => {
    // assembly line: conveyor on steel legs under four distinct stations (stamp, drill, press, inspection lamp)
    sl(p, 0, 26, 56, 4, k.m, k.l, k.d);
    for (const x of [4, 18, 34, 48]) p.r(x, 30, 3, 6, k.d);
    for (let s = 0; s < 4; s++) {
      const x = 3 + s * 14;
      p.r(x, 6, 2, 20, k.d);
      p.r(x + 8, 6, 2, 20, k.d);
      sl(p, x, 5, 10, 4, k.m, k.l, k.d);
      if (s === 0) {
        p.r(x + 4, 9, 2, 7, k.l);
        p.r(x + 3, 16, 4, 3, k.m);
      } else if (s === 1) {
        p.r(x + 4, 9, 2, 12, k.l);
        p.p(x + 4, 21, k.m);
      } else if (s === 2) {
        p.r(x + 3, 9, 4, 6, k.l);
        p.r(x + 2, 15, 6, 4, k.m);
      } else {
        p.disc(x + 5, 12, 2, k.l);
        p.p(x + 5, 12, k.h);
      }
      p.r(x + 11, 22, 3, 4, k.m);
    }
  }),
];

export const RTL_BESPOKE: EntityDef[] = [
  bpr('rtl-nand-press', [22, 22], (p, k) => {
    sl(p, 0, 18, 22, 4, k.d, k.m, k.i);
    p.r(3, 6, 3, 12, k.m);
    p.r(16, 6, 3, 12, k.m);
    sl(p, 2, 3, 18, 4, k.m, k.l, k.d);
    p.r(9, 7, 4, 9, k.l);
    p.r(8, 15, 6, 3, k.d);
    // two input levers pressing a side plunger out
    p.r(5, 0, 2, 3, k.l);
    p.r(15, 0, 2, 3, k.l);
    p.r(19, 12, 3, 3, k.l);
  }),
  bpr('rtl-flip-latch', [12, 14], (p, k) => {
    sl(p, 1, 3, 10, 10, k.d, k.m, k.i);
    p.r(3, 5, 6, 6, k.i);
    p.r(4, 6, 4, 4, k.l);
    p.r(3, 5, 6, 2, k.m);
    p.r(10, 6, 2, 4, k.l);
    p.r(2, 13, 2, 1, k.d);
    p.r(8, 13, 2, 1, k.d);
    p.r(0, 3, 4, 1, k.l);
  }),
  bpr('rtl-logic-analyzer', [22, 16], (p, k) => {
    sl(p, 0, 2, 22, 12, k.d, k.m, k.i);
    p.r(2, 3, 18, 7, k.i);
    // two stepped square-wave traces
    for (let x = 3; x < 19; x += 4) {
      p.r(x, 5, 2, 1, k.l);
      p.r(x + 2, 5, 1, 3, k.l);
      p.r(x + 2, 8, 2, 1, k.l);
      p.r(x + 4 > 18 ? 18 : x + 4, 5, 1, 3, k.l);
    }
    for (const x of [4, 9, 14]) p.r(x, 11, 2, 2, k.l);
    p.r(2, 14, 3, 2, k.d);
    p.r(17, 14, 3, 2, k.d);
  }),
  bpr('rtl-track-switch', [14, 12], (p, k) => {
    sl(p, 3, 5, 8, 6, k.d, k.m, k.i);
    p.r(0, 6, 3, 1, k.l);
    p.r(0, 8, 3, 1, k.l);
    p.r(11, 7, 3, 1, k.l);
    p.r(6, 1, 2, 4, k.m);
    p.r(5, 0, 4, 2, k.l);
    p.r(2, 11, 10, 1, k.d);
  }),
  bpr('rtl-carry-abacus', [28, 32], (p, k) => {
    sl(p, 0, 0, 28, 30, k.d, k.m, k.i);
    p.r(2, 2, 24, 26, k.i);
    for (let c = 0; c < 4; c++) {
      const x = 5 + c * 6;
      p.r(x, 2, 1, 26, k.m);
      const up = c >= 2 ? 4 : 1;
      for (let n = 0; n < up; n++) p.r(x - 1, 4 + n * 3, 3, 2, k.l);
    }
    p.r(2, 2, 3, 2, k.h);
    p.r(0, 30, 28, 2, k.d);
  }),
  bpr('rtl-shift-rack', [14, 8], (p, k) => {
    p.r(0, 5, 14, 2, k.m);
    p.r(0, 5, 14, 1, k.l);
    p.r(1, 7, 2, 1, k.d);
    p.r(11, 7, 2, 1, k.d);
    p.r(0, 2, 3, 3, k.d);
    p.p(1, 3, k.l);
    for (const x of [4, 7, 10, 12]) p.r(x, 1, 2, 4, k.l);
  }),
  bpr('rtl-state-drum', [12, 14], (p, k) => {
    sl(p, 1, 11, 10, 3, k.d, k.m, k.i);
    sl(p, 2, 2, 8, 9, k.m, k.l, k.d);
    p.r(4, 4, 4, 2, k.i);
    p.r(4, 7, 4, 3, k.l);
    p.r(10, 6, 2, 3, k.l);
  }),
  bpr('rtl-truth-pegboard', [20, 22], (p, k) => {
    sl(p, 1, 0, 18, 16, k.d, k.m, k.i);
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 4; c++) {
        p.r(3 + c * 4, 3 + r * 6, 2, 2, (r * 3 + c) % 2 ? k.d : k.l);
      }
    }
    p.l(5, 16, 2, 21, k.d);
    p.l(14, 16, 17, 21, k.d);
  }),
];
export const RTL = mix('rtl', RTL_BESPOKE, RING3);
export const RTL_ANCHORS: EntityDef[] = [
  bpr('rtl-htree', [50, 44], (p, k) => {
    // clock gantry: metronome tower feeding four conduit arms to corner bell-housings
    sl(p, 19, 38, 12, 6, k.d, k.m, k.i);
    sl(p, 21, 12, 8, 26, k.m, k.l, k.d);
    p.r(23, 8, 4, 4, k.m);
    p.r(24, 5, 2, 3, k.l);
    p.r(23, 16, 4, 16, k.i);
    p.l(25, 30, 27, 18, k.l);
    p.r(5, 4, 40, 2, k.m);
    p.r(5, 4, 40, 1, k.l);
    p.r(24, 6, 2, 6, k.m);
    for (const x of [0, 40]) {
      p.r(x + 4, 6, 2, 8, k.m);
      sl(p, x, 14, 10, 9, k.d, k.m, k.i);
      p.r(x + 3, 16, 4, 4, k.l);
      p.r(x + 4, 23, 2, 11, k.d);
      sl(p, x, 34, 10, 9, k.d, k.m, k.i);
      p.r(x + 3, 36, 4, 4, k.l);
    }
    p.r(10, 33, 11, 2, k.m);
    p.r(29, 33, 11, 2, k.m);
  }),
];

export const CMOS_BESPOKE: EntityDef[] = [
  ent('cm-finfet', [[18, 14]], (p) => {
    p.r(2, 2, 14, 10, '#24989c');
    p.r(7, 0, 4, 14, '#9448d4');
    p.r(3, 5, 3, 4, '#e88438');
    p.r(12, 5, 3, 4, '#e88438');
    p.p(4, 6, '#ffffff');
    p.p(13, 6, '#ffffff');
  }),
  waf('cm-tub', [24, 16], (p, k) => {
    sl(p, 0, 4, 11, 10, k.d, k.l, k.i);
    sl(p, 13, 4, 11, 10, k.l, k.h, k.d);
    p.r(2, 6, 7, 1, k.m);
    p.r(15, 6, 7, 1, k.d);
    p.r(11, 0, 2, 14, k.m);
    p.r(11, 0, 1, 14, k.h);
    p.r(2, 14, 3, 2, k.d);
    p.r(19, 14, 3, 2, k.d);
  }),
  waf('cm-void', [14, 10], (p, k) => {
    p.r(1, 6, 3, 4, k.d);
    p.r(10, 6, 3, 4, k.d);
    sl(p, 0, 2, 14, 5, k.l, k.h, k.d);
    p.r(5, 2, 4, 1, k.i);
    p.r(6, 3, 3, 1, k.i);
    p.r(7, 4, 1, 1, k.i);
  }),
  waf('cm-busbar', [20, 18], (p, k) => {
    p.r(2, 2, 3, 15, k.h);
    p.r(15, 2, 3, 15, k.h);
    p.r(2, 2, 1, 15, k.m);
    p.r(0, 16, 20, 2, k.d);
    for (const [y, col] of [[3, k.l], [8, k.d], [13, k.m]] as const) {
      sl(p, 3, y, 14, 3, col, k.h, k.i);
    }
    for (const y of [6, 11]) {
      p.r(7, y, 2, 2, k.i);
      p.r(12, y, 2, 2, k.i);
    }
  }),
  waf('cm-probe', [14, 12], (p, k) => {
    sl(p, 0, 9, 7, 3, k.d, k.m, k.i);
    p.r(2, 3, 2, 6, k.m);
    p.l(3, 3, 10, 9, k.h);
    p.p(10, 9, k.l);
    sl(p, 8, 10, 6, 2, k.m, k.h, k.d);
  }),
  waf('cm-cmp', [30, 24], (p, k) => {
    sl(p, 8, 18, 14, 6, k.d, k.m, k.i);
    sl(p, 2, 14, 26, 5, k.m, k.h, k.d);
    sl(p, 8, 10, 14, 4, k.l, k.h, k.d);
    p.r(14, 2, 3, 8, k.m);
    sl(p, 14, 0, 14, 3, k.l, k.h, k.d);
    p.r(2, 15, 26, 1, k.h);
  }),
  waf('cm-mask', [12, 14], (p, k) => {
    sl(p, 1, 11, 10, 3, k.d, k.m, k.i);
    sl(p, 2, 0, 8, 12, k.d, k.m, k.i);
    p.r(3, 1, 6, 10, k.h);
    for (const x of [4, 7]) p.r(x, 2, 1, 8, k.m);
    for (const y of [4, 7]) p.r(3, y, 6, 1, k.m);
  }),
  waf('cm-capacitor', [12, 12], (p, k) => {
    sl(p, 0, 9, 12, 3, k.d, k.l, k.i);
    p.r(2, 1, 2, 9, k.h);
    p.r(8, 1, 2, 9, k.h);
    p.r(4, 2, 4, 8, k.m);
    p.r(4, 2, 1, 8, k.b);
  }),
];
export const CMOS = mix('cm', CMOS_BESPOKE, RING3);
export const CMOS_ANCHORS: EntityDef[] = [
  ent('cm-viatower', [[52, 42]], (p) => {
    for (let y = 4; y < 38; y += 8) p.r(2, y, 48, 3, '#e88438');
    for (let x = 8; x < 46; x += 12) {
      p.r(x, 2, 4, 38, '#9448d4');
      for (let y = 5; y < 38; y += 8) p.r(x + 1, y, 2, 2, '#ffffff');
    }
  }),
];

export const LITHO_BESPOKE: EntityDef[] = [
  euv('li-lattice', [18, 16], (p, k) => {
    // silicon wafer on a chuck, lattice grid etched on it, one point defect
    sl(p, 5, 14, 8, 2, k.d, k.m, k.i);
    p.r(8, 12, 2, 3, k.d);
    p.disc(9, 7, 7, k.m);
    p.disc(9, 7, 6, k.d);
    for (let y = 2; y < 13; y += 3) {
      for (let x = 4; x < 15; x += 3) p.p(x, y, k.m);
    }
    p.r(5, 3, 2, 1, k.l);
    p.p(11, 8, k.l);
    p.p(10, 8, k.i);
  }),
  euv('li-boule', [34, 16], (p, k) => {
    // silicon ingot on a V-block, tapered seed-pull neck at one end
    sl(p, 10, 13, 18, 3, k.d, k.m, k.i);
    p.r(12, 11, 2, 2, k.d);
    p.r(24, 11, 2, 2, k.d);
    sl(p, 12, 2, 20, 10, k.m, k.l, k.d);
    p.r(8, 3, 4, 8, k.m);
    p.r(5, 5, 3, 4, k.m);
    p.r(3, 6, 2, 2, k.l);
    p.r(0, 7, 3, 1, k.l);
    p.r(8, 3, 4, 1, k.l);
    p.r(14, 5, 1, 4, k.l);
  }),
  euv('li-grating', [12, 14], (p, k) => {
    sl(p, 2, 0, 8, 10, k.m, k.l, k.d);
    for (let x = 3; x < 9; x += 2) p.r(x, 1, 1, 8, k.d);
    p.r(5, 10, 2, 2, k.d);
    sl(p, 2, 12, 8, 2, k.d, k.m, k.i);
  }),
  euv('li-wafer-boat', [20, 18], (p, k) => {
    sl(p, 1, 15, 18, 3, k.d, k.m, k.i);
    p.r(1, 2, 2, 13, k.d);
    p.r(17, 2, 2, 13, k.d);
    p.r(2, 2, 16, 1, k.m);
    for (let n = 0; n < 4; n++) {
      sl(p, 5 + n * 3, 1, 2, 13, k.m, k.l, k.d);
      p.p(5 + n * 3, 1, k.l);
    }
    p.r(2, 12, 16, 1, k.d);
  }),
  euv('li-coater', [14, 12], (p, k) => {
    sl(p, 2, 6, 10, 6, k.d, k.m, k.i);
    sl(p, 1, 4, 12, 2, k.m, k.l, k.d);
    p.r(11, 0, 3, 1, k.m);
    p.r(12, 0, 1, 3, k.m);
    p.r(5, 1, 7, 1, k.m);
    p.r(5, 2, 1, 2, k.l);
  }),
];
export const LITHO = mix('li', LITHO_BESPOKE, RING3);
export const LITHO_ANCHORS: EntityDef[] = [
  ent('li-reticle', [[48, 48]], (p) => {
    p.disc(24, 24, 22, '#555555');
    p.disc(24, 24, 16, '#aaaaaa');
    p.disc(24, 24, 10, '#000000');
    p.disc(24, 24, 7, '#ffffff');
    p.r(23, 2, 2, 44, '#555555');
    p.r(2, 23, 44, 2, '#555555');
  }),
];

export const BANDGAP_BESPOKE: EntityDef[] = [
  aby('bg-tunnel-wall', [20, 18], (p, k) => {
    sl(p, 3, 1, 14, 15, k.d, k.m, k.i);
    p.r(5, 3, 10, 11, k.i);
    p.r(5, 3, 10, 1, k.m);
    p.disc(10, 9, 2, k.l);
    p.disc(10, 9, 1, k.h);
    sl(p, 1, 16, 18, 2, k.d, k.m, k.i);
  }),
  aby('bg-wave-tank', [32, 22], (p, k) => {
    sl(p, 2, 2, 28, 16, k.d, k.m, k.i);
    p.r(4, 4, 24, 12, k.i);
    // frozen stepped standing wave
    for (let x = 5; x < 27; x += 4) {
      p.r(x, 7, 2, 1, k.l);
      p.r(x + 2, 7, 1, 5, k.l);
      p.r(x + 2, 12, 2, 1, k.l);
      p.r(x + 4 > 26 ? 26 : x + 4, 7, 1, 5, k.l);
    }
    p.r(0, 8, 3, 2, k.m);
    p.r(0, 6, 1, 6, k.l);
    for (const x of [4, 10, 22, 27]) p.r(x, 18, 2, 4, k.d);
  }),
  aby('bg-photon-lamp', [16, 20], (p, k) => {
    sl(p, 5, 16, 6, 4, k.d, k.m, k.i);
    p.r(6, 13, 4, 3, k.m);
    // crystal prism and the lifted bead on the upper shelf
    p.r(7, 5, 2, 1, k.l);
    p.r(6, 6, 4, 1, k.l);
    p.r(5, 7, 6, 2, k.m);
    p.r(4, 9, 8, 2, k.m);
    p.r(3, 11, 10, 2, k.d);
    p.r(3, 11, 10, 1, k.m);
    p.r(9, 3, 6, 1, k.m);
    p.disc(12, 1, 1, k.l);
  }),
  aby('bg-led-bulb', [10, 14], (p, k) => {
    p.r(3, 0, 4, 1, k.m);
    p.r(2, 1, 6, 1, k.m);
    p.r(1, 2, 8, 5, k.m);
    p.r(2, 7, 6, 1, k.m);
    p.r(2, 2, 1, 5, k.l);
    p.r(4, 3, 2, 3, k.l);
    p.p(5, 2, k.h);
    sl(p, 2, 8, 6, 2, k.d, k.m, k.i);
    p.r(3, 10, 1, 4, k.d);
    p.r(6, 10, 1, 4, k.d);
  }),
  aby('bg-fermi-gauge', [8, 14], (p, k) => {
    p.r(0, 0, 8, 2, k.m);
    p.r(0, 12, 8, 2, k.m);
    p.r(2, 2, 4, 10, k.i);
    p.r(2, 7, 4, 5, k.m);
    p.r(2, 6, 4, 1, k.l);
  }),
  aby('bg-dopant-cruet', [10, 12], (p, k) => {
    sl(p, 2, 0, 6, 3, k.l, k.h, k.m);
    p.p(3, 1, k.i);
    p.p(6, 1, k.i);
    sl(p, 1, 3, 8, 8, k.m, k.l, k.d);
    p.r(3, 7, 4, 3, k.l);
    p.r(2, 11, 6, 1, k.d);
  }),
  aby('bg-zener-gate', [8, 14], (p, k) => {
    p.r(1, 1, 6, 2, k.m);
    p.r(1, 11, 6, 2, k.m);
    p.r(2, 3, 4, 8, k.d);
    p.r(2, 3, 1, 8, k.m);
    p.p(3, 4, k.l);
    p.p(4, 5, k.l);
    p.p(3, 6, k.l);
    p.p(4, 7, k.l);
    p.p(3, 8, k.l);
    p.p(4, 9, k.l);
  }),
];
export const BANDGAP = mix('bg', BANDGAP_BESPOKE, RING3);
export const BANDGAP_ANCHORS: EntityDef[] = [
  aby('bg-diagram', [52, 40], (p, k) => {
    // two-tier semiconductor viaduct bench: conduction deck above a gap, valence deck below, five glass elevator tubes
    p.r(0, 8, 3, 22, k.d);
    p.r(49, 8, 3, 22, k.d);
    sl(p, 0, 2, 52, 6, k.d, k.m, k.i);
    sl(p, 0, 30, 52, 6, k.d, k.m, k.i);
    for (const x of [2, 24, 46]) p.r(x, 36, 4, 4, k.d);
    for (let n = 0; n < 5; n++) {
      const x = 8 + n * 9;
      p.r(x, 8, 4, 22, k.m);
      p.r(x + 1, 8, 2, 22, k.i);
      p.r(x + 1, 11 + ((n * 7) % 15), 2, 2, k.l);
    }
  }),
];

export const LANDAUER_BESPOKE: EntityDef[] = [
  aby('la-thermometer', [8, 14], (p, k) => {
    sl(p, 0, 0, 8, 14, k.m, k.l, k.d);
    p.r(3, 2, 2, 8, k.i);
    p.disc(4, 11, 2, k.i);
    p.r(3, 2, 2, 1, k.l);
    p.p(4, 11, k.d);
  }),
  aby('la-bellows', [16, 22], (p, k) => {
    sl(p, 4, 19, 8, 3, k.d, k.m, k.i);
    p.r(2, 1, 12, 3, k.m);
    p.r(0, 0, 3, 2, k.l);
    p.r(13, 0, 3, 2, k.l);
    for (let y = 4; y < 19; y += 2) {
      const w = y % 4 === 0 ? 12 : 8;
      p.r(8 - w / 2, y, w, 1, k.m);
      p.r(8 - w / 2, y + 1, w, 1, k.d);
    }
  }),
  aby('la-demon', [12, 10], (p, k) => {
    sl(p, 0, 2, 12, 8, k.d, k.m, k.i);
    p.r(5, 2, 2, 8, k.m);
    p.r(5, 5, 2, 2, k.i);
    p.r(5, 4, 2, 1, k.l);
    p.r(5, 0, 2, 2, k.l);
  }),
  aby('la-szilard', [26, 18], (p, k) => {
    sl(p, 6, 13, 12, 5, k.d, k.m, k.i);
    sl(p, 1, 5, 21, 8, k.m, k.l, k.d);
    p.r(2, 6, 19, 6, k.i);
    p.r(11, 5, 2, 8, k.l);
    p.disc(23, 3, 1, k.m);
    p.r(24, 4, 1, 7, k.l);
    p.r(22, 11, 4, 4, k.l);
  }),
  aby('la-radiator', [30, 30], (p, k) => {
    sl(p, 1, 2, 24, 3, k.m, k.l, k.d);
    sl(p, 1, 23, 24, 3, k.m, k.l, k.d);
    for (let n = 0; n < 6; n++) {
      p.r(2 + n * 4, 5, 3, 18, k.m);
      p.r(2 + n * 4, 5, 1, 18, k.l);
      p.r(4 + n * 4, 5, 1, 18, k.d);
    }
    for (const x of [2, 20]) {
      p.r(x, 26, 3, 4, k.d);
    }
    p.r(25, 13, 2, 2, k.m);
    p.disc(27, 14, 2, k.l);
    p.p(27, 14, k.d);
  }),
  aby('la-pendulum', [12, 14], (p, k) => {
    p.l(6, 0, 1, 12, k.m);
    p.l(6, 0, 11, 12, k.m);
    p.r(6, 2, 1, 7, k.l);
    p.disc(6, 10, 2, k.l);
    p.r(0, 12, 12, 2, k.d);
  }),
  aby('la-calorimeter', [14, 12], (p, k) => {
    sl(p, 2, 3, 10, 8, k.m, k.l, k.d);
    sl(p, 1, 2, 12, 2, k.l, k.h, k.m);
    p.p(2, 3, k.i);
    p.p(11, 3, k.i);
    p.r(0, 5, 2, 3, k.d);
    p.r(12, 5, 2, 3, k.d);
    p.r(5, 0, 4, 2, k.m);
    p.p(6, 0, k.l);
    p.r(2, 11, 10, 1, k.d);
  }),
];
export const LANDAUER = mix('la', LANDAUER_BESPOKE, RING3);
export const LANDAUER_ANCHORS: EntityDef[] = [
  ent(
    'la-horizon',
    [[48, 36]],
    (p) => {
      p.disc(24, 18, 14, '#555555');
      p.disc(24, 18, 10, '#000000');
      p.disc(24, 18, 6, '#aaaaaa');
      p.disc(24, 18, 4, '#000000');
      p.r(2, 17, 44, 2, '#555555');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const a = t * 0.9;
        p.r(24 + R(Math.cos(a) * 6), 18 + R(Math.sin(a) * 6), 2, 2, '#ffffff');
      },
      noFlip: true,
    },
  ),
];
