import { ent, TAU, type EntityDef, type Pen } from './kit';

/**
 * v4 entity libraries, upper layers: Application (full colour) and Runtime (rgb6: 00/33/66/99/cc/ff).
 * Each entity is a small hand-drawn prop; sizes are per variant. Colours are written on (or near) the layer's
 * levels and snapped by the pen anyway.
 */

const R = Math.round;
const mod = (n: number, m: number) => ((n % m) + m) % m;

// ---------------------------------------------------------------------------------------------
// Application: a GUI desktop floating in a bright sky.

const ACC: [string, string][] = [
  ['#5b8ee6', '#3d6cc4'],
  ['#e6a23c', '#c27c1c'],
  ['#59c08a', '#2f9963'],
  ['#d0605e', '#a83f3d'],
  ['#a070e0', '#7a4cc0'],
  ['#4cb8c8', '#2e8f9e'],
];
const acc = (p: Pen, k = 0) => p.pick(ACC, 50 + k);
const SHADOW = '#3a4a8a';
const EDGE = '#2a3358';
const PAPER = '#f3efe6';
const INK = '#55607a';
const FAINT = '#a8acb8';
const WHITE = '#ffffff';

/** A window body with a shadow and a title bar; returns the content box. */
function win(p: Pen, w: number, h: number, bar: string): [number, number, number, number] {
  p.r(1, 1, w - 1, h - 1, SHADOW);
  p.r(0, 0, w - 1, h - 1, EDGE);
  p.r(1, 1, w - 3, 2, bar);
  p.p(w - 4, 1, '#ff6159');
  p.r(1, 3, w - 3, h - 5, PAPER);
  return [1, 3, w - 3, h - 5];
}

export const APPLICATION: EntityDef[] = [
  ent('app-browser', [[22, 16], [28, 19]], (p, w, h) => {
    const [a] = acc(p);
    p.r(1, 1, w - 1, h - 1, SHADOW);
    p.r(0, 0, w - 1, h - 1, EDGE);
    p.r(1, 1, w - 3, 2, '#c8d0e6');
    p.r(2, 1, 7, 2, PAPER);
    p.r(1, 3, w - 3, 2, '#e2e6f0');
    p.r(3, 4, w - 10, 1, FAINT);
    p.r(1, 5, w - 3, h - 7, WHITE);
    p.r(3, 7, w - 7, 3, a);
    for (let y = 11, k = 0; y < h - 3; y += 2, k++) p.r(3, y, (w - 7) * (0.45 + p.h(k) * 0.55), 1, FAINT);
  }),
  ent('app-dialog', [[20, 13]], (p, w, h) => {
    const [a, a2] = acc(p);
    win(p, w, h, a2);
    p.r(3, 5, 3, 3, '#e6a23c');
    p.p(4, 5, WHITE);
    p.r(8, 5, 8, 1, INK);
    p.r(8, 7, 6, 1, FAINT);
    p.r(w - 13, h - 5, 5, 2, a);
    p.r(w - 7, h - 5, 4, 2, '#d8d2c4');
  }),
  ent('app-toast', [[16, 7]], (p) => {
    const [a] = acc(p);
    p.r(1, 1, 15, 6, SHADOW);
    p.r(0, 0, 15, 6, WHITE);
    p.r(0, 5, 15, 1, '#dfe6f6');
    p.r(1, 1, 3, 3, a);
    p.r(5, 1, 8, 1, INK);
    p.r(5, 3, 5, 1, FAINT);
  }),
  ent(
    'app-spinner',
    [[9, 9]],
    (p) => {
      p.r(0, 0, 9, 9, PAPER);
      p.r(0, 0, 9, 1, WHITE);
      p.r(0, 8, 9, 1, '#d8d2c4');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const [a, a2] = acc(p);
        const head = Math.floor(t * 9) % 8;
        for (let k = 0; k < 8; k++) {
          const ang = (k * TAU) / 8;
          const d = mod(head - k, 8);
          p.p(4 + R(Math.cos(ang) * 2.6), 4 + R(Math.sin(ang) * 2.6), d === 0 ? a2 : d < 3 ? a : '#d8d2c4');
        }
      },
      noFlip: true,
    },
  ),
  ent(
    'app-progress',
    [[18, 6], [24, 6]],
    (p, w) => {
      p.r(0, 0, w, 6, EDGE);
      p.r(1, 1, w - 2, 4, PAPER);
    },
    {
      anim: (p, w, _h, _v, t) => {
        const [a] = acc(p);
        const q = Math.min(1, (t * 0.12) % 1.25);
        p.r(2, 2, (w - 4) * q, 2, a);
      },
      noFlip: true,
    },
  ),
  ent('app-icon', [[8, 8], [10, 10]], (p, w) => {
    const [a, a2] = acc(p, 1);
    p.r(1, 0, w - 2, w, a2);
    p.r(0, 1, w, w - 2, a2);
    p.r(1, 1, w - 2, R(w / 2) - 1, a);
    p.r(1, 1, 2, 1, WHITE);
    if (p.h(3) > 0.5) p.r(w - 2, -0, 2, 2, '#ff3b30');
    p.r(R(w / 2) - 1, R(w / 2), 2, 2, WHITE);
  }),
  ent(
    'app-bubble',
    [[15, 8]],
    (p) => {
      const mine = p.h(0) > 0.5;
      const body = mine ? '#5b8ee6' : WHITE;
      p.r(1, 0, 13, 6, body);
      p.r(0, 1, 15, 4, body);
      p.r(mine ? 12 : 2, 6, 2, 1, body);
      p.r(mine ? 13 : 1, 7, 1, 1, body);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const mine = p.h(0) > 0.5;
        const on = Math.floor(t * 4) % 4;
        for (let k = 0; k < 3; k++) p.r(4 + k * 3, 2 + (k === on ? -0 : 1), 2, 2, mine ? (k === on ? WHITE : '#a9c4f4') : k === on ? INK : FAINT);
      },
    },
  ),
  ent(
    'app-cloudsync',
    [[14, 10]],
    (p) => {
      p.r(3, 2, 6, 2, WHITE);
      p.r(5, 0, 5, 2, WHITE);
      p.r(1, 4, 12, 4, WHITE);
      p.r(0, 5, 14, 3, WHITE);
      p.r(1, 8, 12, 1, '#c8d6f0');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const k = Math.floor(t * 3) % 3;
        p.r(6, 3 + (2 - k), 2, 4 - (2 - k) + 1, '#5b8ee6');
        p.r(5, 3 + (2 - k), 4, 1, '#5b8ee6');
      },
      noFlip: true,
    },
  ),
  ent('app-folder', [[12, 9], [15, 11]], (p, w, h) => {
    const yel = p.h(0) > 0.3 ? ['#f2c14e', '#d9a22b'] : ['#7fb2f0', '#5b8ee6'];
    p.r(0, 0, 5, 2, yel[1]!);
    p.r(0, 1, w, h - 1, yel[1]!);
    p.r(0, 3, w, h - 3, yel[0]!);
    p.r(1, 3, w - 2, 1, '#fff2c4');
    if (p.h(1) > 0.5) p.r(2, 1, w - 4, 2, WHITE);
  }),
  ent('app-trash', [[9, 11]], (p) => {
    const full = p.h(0) > 0.5;
    p.r(0, 1, 9, 2, '#8a93a8');
    p.r(3, 0, 3, 1, '#8a93a8');
    p.r(1, 3, 7, 8, '#c8cfdc');
    for (let k = 0; k < 3; k++) p.r(2 + k * 2, 4, 1, 6, '#8a93a8');
    if (full) {
      p.r(1, 0, 2, 1, WHITE);
      p.r(6, -0, 2, 1, '#f2c14e');
    }
  }),
  ent(
    'app-slider',
    [[20, 7]],
    (p, w) => {
      p.r(0, 3, w, 1, FAINT);
      p.r(0, 4, w, 1, '#8a93a8');
    },
    {
      anim: (p, w, _h, _v, t) => {
        const [a, a2] = acc(p);
        const x = R((Math.sin(t * 0.9) * 0.5 + 0.5) * (w - 5));
        p.r(0, 3, x, 2, a);
        p.r(x, 0, 5, 7, a2);
        p.r(x + 1, 1, 3, 5, WHITE);
      },
    },
  ),
  ent(
    'app-toggle',
    [[12, 7]],
    () => {},
    {
      anim: (p, _w, _h, _v, t) => {
        const on = Math.floor(t * 0.5) % 2 === 0;
        const body = on ? '#34c759' : '#c8cfdc';
        p.r(1, 0, 10, 7, body);
        p.r(0, 1, 12, 5, body);
        const x = on ? 6 : 1;
        p.r(x, 1, 5, 5, WHITE);
      },
      noFlip: true,
    },
  ),
  ent('app-checklist', [[16, 12]], (p) => {
    p.r(1, 1, 15, 11, SHADOW);
    p.r(0, 0, 15, 11, WHITE);
    for (let k = 0; k < 3; k++) {
      const y = 1 + k * 3;
      const done = p.h(k) > 0.4;
      p.r(1, y, 2, 2, done ? '#34c759' : '#c8cfdc');
      p.r(4, y, 6 + R(p.h(k + 5) * 4), 1, done ? FAINT : INK);
    }
  }),
  ent('app-calendar', [[13, 13]], (p) => {
    const [a] = acc(p, 2);
    p.r(1, 1, 12, 12, SHADOW);
    p.r(0, 0, 12, 12, WHITE);
    p.r(0, 0, 12, 3, a);
    p.r(2, -0, 1, 1, EDGE);
    p.r(9, -0, 1, 1, EDGE);
    const today = Math.floor(p.h(1) * 12);
    for (let k = 0; k < 12; k++) p.r(1 + (k % 4) * 3, 4 + Math.floor(k / 4) * 3, 2, 2, k === today ? a : '#dfe3ea');
  }),
  ent(
    'app-status',
    [[16, 6]],
    (p) => {
      p.r(0, 1, 7, 5, INK);
      p.r(7, 2, 1, 3, INK);
      for (let k = 0; k < 4; k++) p.r(10 + k * 2, 5 - k - 1, 1, k + 1, INK);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const lvl = 1 + (Math.floor(t * 0.3) % 5);
        p.r(1, 2, lvl, 3, lvl < 2 ? '#ff3b30' : '#34c759');
      },
      noFlip: true,
    },
  ),
  ent(
    'app-hearts',
    [[10, 16]],
    (p) => {
      p.r(1, 13, 3, 2, '#ff6b81');
      p.r(5, 13, 3, 2, '#ff6b81');
      p.r(1, 15, 7, 1, '#ff6b81');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (let k = 0; k < 2; k++) {
          const q = mod(t * 0.45 + k * 0.5, 1);
          const y = 10 - q * 10;
          const x = 2 + k * 3 + R(Math.sin(q * 6 + k) * 1.5);
          const col = q < 0.6 ? '#ff6b81' : '#ffc0cb';
          p.r(x, y, 1, 1, col);
          p.r(x + 2, y, 1, 1, col);
          p.r(x, y + 1, 3, 1, col);
          p.r(x + 1, y + 2, 1, 1, col);
        }
      },
    },
  ),
  ent('app-dropdown', [[16, 16]], (p) => {
    const [a] = acc(p, 3);
    p.r(0, 0, 15, 4, EDGE);
    p.r(1, 1, 13, 2, WHITE);
    p.r(2, 2, 6, 1, INK);
    p.r(11, 2, 2, 1, INK);
    p.r(1, 4, 15, 12, SHADOW);
    p.r(0, 4, 15, 11, WHITE);
    const sel = 1 + Math.floor(p.h(1) * 3);
    for (let k = 0; k < 4; k++) {
      if (k === sel) p.r(0, 5 + k * 2.5, 15, 2, a);
      p.r(2, 5 + k * 2.5 + 0.5, 5 + R(p.h(k + 3) * 6), 1, k === sel ? WHITE : FAINT);
    }
  }),
  ent('app-swatches', [[14, 10]], (p) => {
    p.r(1, 1, 13, 9, SHADOW);
    p.r(0, 0, 13, 9, WHITE);
    const cols = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#5ac8fa', '#007aff', '#5856d6', '#af52de'];
    cols.forEach((col, k) => p.r(1 + (k % 4) * 3, 1 + Math.floor(k / 4) * 4, 2, 3, col));
    const s = Math.floor(p.h(0) * 8);
    p.frame((s % 4) * 3, Math.floor(s / 4) * 4, 4, 5, EDGE);
  }),
  ent('app-photo', [[14, 11], [18, 13]], (p, w, h) => {
    p.r(1, 1, w - 1, h - 1, SHADOW);
    p.r(0, 0, w - 1, h - 1, WHITE);
    p.r(1, 1, w - 3, h - 3, '#9fd2f5');
    p.r(w - 6, 2, 2, 2, '#ffe25a');
    for (let x = 1; x < w - 2; x++) {
      const m = Math.abs(((x * 2) % 10) - 5) + (x > w / 2 ? 1 : 3);
      p.r(x, h - 2 - Math.min(h - 4, m), 1, Math.min(h - 4, m), x % 7 < 4 ? '#3f9a5a' : '#2f7a46');
    }
  }),
  ent(
    'app-video',
    [[20, 14]],
    (p, w, h) => {
      p.r(1, 1, w - 1, h - 1, SHADOW);
      p.r(0, 0, w - 1, h - 1, '#1b1b26');
      p.r(8, 3, 1, 6, WHITE);
      p.r(9, 4, 1, 4, WHITE);
      p.r(10, 5, 1, 2, WHITE);
      p.r(2, h - 3, w - 5, 1, '#4a4a58');
    },
    {
      anim: (p, w, h, _v, t) => {
        const q = mod(t * 0.07, 1);
        p.r(2, h - 3, (w - 5) * q, 1, '#ff3b30');
        p.p(2 + R((w - 6) * q), h - 4, WHITE);
      },
      noFlip: true,
    },
  ),
  ent(
    'app-download',
    [[11, 12]],
    (p) => {
      p.r(0, 8, 11, 4, '#8a93a8');
      p.r(1, 9, 9, 2, '#c8cfdc');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const y = R(mod(t * 5, 6));
        p.r(5, y, 1, 3, '#34c759');
        p.r(3, y + 3, 5, 1, '#34c759');
        p.r(4, y + 4, 3, 1, '#34c759');
        p.r(5, y + 5, 1, 1, '#34c759');
      },
      noFlip: true,
    },
  ),
  ent(
    'app-clock',
    [[11, 11]],
    (p) => {
      p.disc(5, 5, 5, EDGE);
      p.disc(5, 5, 4, WHITE);
      for (const [dx, dy] of [[0, -3], [3, 0], [0, 3], [-3, 0]] as const) p.p(5 + dx, 5 + dy, FAINT);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const a = t * 0.8 - Math.PI / 2;
        p.l(5, 5, 5 + Math.cos(a) * 3, 5 + Math.sin(a) * 3, '#d0605e');
        p.l(5, 5, 5 + Math.cos(a / 12) * 2, 5 + Math.sin(a / 12) * 2, EDGE);
      },
      noFlip: true,
    },
  ),
];

export const APPLICATION_ANCHORS: EntityDef[] = [
  ent('app-cascade', [[58, 44]], (p) => {
    // Three windows stacked down and to the right, the front one a small dashboard.
    const offs: [number, number][] = [
      [0, 0],
      [9, 8],
      [18, 16],
    ];
    offs.forEach(([ox, oy], k) => {
      const [a, a2] = ACC[(k * 2 + Math.floor(p.h(0) * 6)) % ACC.length]!;
      const w = 40;
      const h = 28;
      p.r(ox + 2, oy + 2, w, h, SHADOW);
      p.r(ox, oy, w, h, EDGE);
      p.r(ox + 1, oy + 1, w - 2, 3, a2);
      p.r(ox + 1, oy + 1, w - 2, 1, a);
      p.p(ox + w - 3, oy + 2, '#ff6159');
      p.p(ox + w - 5, oy + 2, '#ffbd2e');
      p.r(ox + 1, oy + 4, w - 2, h - 5, k === 2 ? WHITE : PAPER);
      if (k < 2) return;
      for (let b = 0; b < 6; b++) {
        const bh = 3 + R(p.h(b + 3) * 13);
        p.r(ox + 4 + b * 4, oy + h - 3 - bh, 3, bh, b % 2 ? a : a2);
      }
      p.r(ox + 28, oy + 7, 9, 9, a2);
      p.r(ox + 28, oy + 7, 5, 5, a);
      p.r(ox + 28, oy + 18, 9, 1, FAINT);
      p.r(ox + 28, oy + 20, 6, 1, FAINT);
    });
  }),
  ent('app-launcher', [[46, 36]], (p) => {
    p.r(2, 2, 44, 34, SHADOW);
    p.r(0, 0, 44, 34, '#e8ecf6');
    p.r(0, 0, 44, 1, WHITE);
    p.r(3, 3, 38, 4, WHITE);
    p.r(4, 4, 2, 2, FAINT);
    for (let k = 0; k < 12; k++) {
      const [a, a2] = ACC[(k + Math.floor(p.h(1) * 6)) % ACC.length]!;
      const x = 4 + (k % 4) * 10;
      const y = 10 + Math.floor(k / 4) * 8;
      p.r(x + 1, y, 5, 6, a2);
      p.r(x, y + 1, 7, 4, a2);
      p.r(x + 1, y + 1, 5, 2, a);
      p.p(x + 1, y + 1, WHITE);
    }
  }),
];

// ---------------------------------------------------------------------------------------------
// Runtime (rgb6): heap objects on girders, references, GC, JIT, the event loop.

const OBJ: [string, string][] = [
  ['#cc6666', '#ff9999'],
  ['#66cc99', '#99ffcc'],
  ['#6699cc', '#99ccff'],
  ['#cccc66', '#ffff99'],
  ['#cc66cc', '#ff99ff'],
];
const GIRDER = '#666699';
const GIRDER_HI = '#9999cc';
const STRUT = '#333366';
const REF = '#6666cc';
const NAVY = '#000033';

function girder(p: Pen, x: number, y: number, w: number) {
  p.r(x, y, w, 2, GIRDER);
  p.r(x, y, w, 1, GIRDER_HI);
  for (let k = 2; k < w - 1; k += 6) p.r(x + k, y + 2, 1, 3, STRUT);
}

function obj(p: Pen, x: number, y: number, w: number, h: number, k: number) {
  const [body, lit] = OBJ[k % OBJ.length]!;
  p.r(x, y, w, h, body);
  p.r(x, y, w, 1, lit);
}

export const RUNTIME: EntityDef[] = [
  ent('rt-objects', [[20, 14], [26, 14]], (p, w) => {
    girder(p, 0, 9, w);
    for (let ox = 1, n = 0; ox < w - 3; n++) {
      const ow = 2 + R(p.h(n * 3) * 2);
      const oh = 2 + R(p.h(n * 3 + 1) * 4);
      if (p.h(n * 3 + 2) > 0.25) obj(p, ox, 9 - oh, ow, oh, Math.floor(p.h(n + 40) * 5));
      ox += ow + 1;
    }
  }),
  ent(
    'rt-sweeper',
    [[30, 14]],
    (p, w) => girder(p, 0, 9, w),
    {
      anim: (p, w, _h, _v, t) => {
        const sx = R(mod(t * 7, w + 6)) - 6;
        for (let k = 0; k < 6; k++) {
          const ox = 2 + k * 5;
          const dead = p.h(k) > 0.5;
          if (dead && ox < sx && ox > sx - 22) continue;
          if (dead) {
            p.r(ox, 6, 3, 3, '#333333');
            p.r(ox, 6, 3, 1, '#666666');
          } else obj(p, ox, 6, 3, 3, k);
        }
        if (sx < -5 || sx > w - 1) return;
        p.r(sx + 1, 4, 4, 4, '#9999ff');
        p.r(sx + 2, 3, 2, 1, NAVY);
        p.r(sx + 3, 5, 1, 1, '#66ffff');
        p.r(sx + 5, 5, 1, 3, '#ffcc33');
        p.r(sx + 1, 8, 1, 1, '#9999cc');
        p.r(sx + 4, 8, 1, 1, '#9999cc');
      },
    },
  ),
  ent(
    'rt-marks',
    [[15, 6]],
    (p) => p.r(0, 0, 15, 6, STRUT),
    {
      anim: (p, _w, _h, _v, t) => {
        const slot = Math.floor(t * 0.9);
        for (let k = 0; k < 4; k++) p.r(k * 3 + 2, 1, 2, 4, (k * 7 + slot * 13 + Math.floor(p.h(k) * 9)) % 3 ? '#ffff99' : NAVY);
      },
      noFlip: true,
    },
  ),
  ent('rt-ref', [[20, 13]], (p) => {
    obj(p, 0, 0, 4, 4, Math.floor(p.h(0) * 5));
    obj(p, 15, 8, 4, 4, Math.floor(p.h(1) * 5));
    p.r(2, 4, 1, 6, REF);
    p.r(2, 9, 11, 1, REF);
    p.r(12, 8, 1, 3, '#9999ff');
    p.p(13, 9, '#9999ff');
  }),
  ent('rt-heapcol', [[12, 13]], (p) => {
    p.r(0, 0, 1, 13, STRUT);
    for (let k = 0; k < 4; k++) obj(p, 1, k * 3 + 1, 4 + R(p.h(k) * 7), 2, Math.floor(p.h(k + 9) * 5));
  }),
  ent(
    'rt-jit',
    [[18, 14]],
    (p) => {
      // An anvil with a hot ingot of compiled code.
      p.r(2, 6, 14, 3, '#666666');
      p.r(0, 6, 3, 2, '#666666');
      p.r(2, 6, 14, 1, '#999999');
      p.r(6, 9, 6, 3, '#333333');
      p.r(4, 12, 10, 2, '#666666');
      p.r(6, 4, 8, 2, '#ff6633');
      p.r(7, 4, 6, 1, '#ffcc33');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        p.glow(10, 5, 7, 'rgba(255,140,40,0.35)');
        for (let k = 0; k < 3; k++) {
          const q = mod(t * 1.7 + k * 0.33, 1);
          p.p(10 + R((k - 1) * q * 6), 3 - R(q * 3 + Math.sin(q * 3) * 1), q < 0.5 ? '#ffff66' : '#ff9933');
        }
      },
    },
  ),
  ent(
    'rt-tape',
    [[22, 10]],
    (p) => {
      p.disc(4, 4, 4, '#999999');
      p.disc(17, 4, 4, '#999999');
      p.r(4, 8, 14, 1, '#cccc99');
      p.r(3, 9, 16, 1, '#666666');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (const cx of [4, 17]) {
          p.disc(cx, 4, 2, '#333366');
          const a = t * 3;
          p.p(cx + R(Math.cos(a) * 2), 4 + R(Math.sin(a) * 2), '#ffffff');
        }
        const k = Math.floor(t * 6) % 4;
        for (let x = 6 + k; x < 16; x += 4) p.p(x, 8, '#333366');
      },
    },
  ),
  ent('rt-callstack', [[12, 16], [14, 20]], (p, w, h) => {
    const n = Math.floor((h - 1) / 3);
    for (let k = 0; k < n; k++) {
      const inset = k === 0 ? 0 : R(p.h(k) * 2);
      obj(p, inset, h - 3 - k * 3, w - inset * 2, 2, k);
    }
    p.r(R(w / 2), 0, 1, h - 3 - (n - 1) * 3, REF);
  }),
  ent('rt-refcount', [[11, 10]], (p) => {
    obj(p, 0, 3, 7, 7, Math.floor(p.h(0) * 5));
    p.disc(8, 2, 2, '#ff6666');
    const n = 1 + Math.floor(p.h(1) * 3);
    for (let k = 0; k < n; k++) p.p(7 + k, 2, '#ffffff');
  }),
  ent('rt-weakref', [[20, 10]], (p) => {
    obj(p, 0, 3, 5, 5, Math.floor(p.h(0) * 5));
    for (let x = 6; x < 13; x += 2) p.p(x, 5, REF);
    p.r(12, 4, 1, 3, REF);
    p.frame(14, 2, 6, 6, '#666699');
    p.p(16, 4, '#333366');
  }),
  ent('rt-tricolor', [[22, 8]], (p) => {
    const cols = ['#ffffff', '#999999', '#333333'];
    for (let k = 0; k < 3; k++) {
      p.box(k * 8, 1, 6, 6, cols[k]!, '#9999cc');
      if (k < 2) p.r(k * 8 + 6, 4, 2, 1, REF);
    }
  }),
  ent(
    'rt-bump',
    [[24, 8]],
    (p, w) => {
      p.box(0, 2, w, 5, NAVY, GIRDER);
    },
    {
      anim: (p, w, _h, _v, t) => {
        const fill = R(mod(t * 2.5, w - 3));
        for (let x = 1; x < fill; x += 3) obj(p, x, 3, 2, 3, x);
        p.r(fill + 1, 0, 1, 2, '#ffff99');
        p.p(fill, 0, '#ffff99');
        p.p(fill + 2, 0, '#ffff99');
      },
      noFlip: true,
    },
  ),
  ent('rt-finalizer', [[24, 12]], (p) => {
    p.r(18, 0, 6, 12, '#333366');
    p.r(19, 1, 4, 11, NAVY);
    p.p(20, 6, '#ffcc33');
    girder(p, 0, 9, 18);
    for (let k = 0; k < 3; k++) obj(p, 1 + k * 5, 5, 3, 4, Math.floor(p.h(k) * 5));
  }),
  ent(
    'rt-interp',
    [[13, 13]],
    (p) => {
      p.ring(6, 6, 5, '#666699');
      p.r(5, 5, 3, 3, '#9999cc');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (let k = 0; k < 3; k++) {
          const a = t * 2 + (k * TAU) / 3;
          p.r(6 + R(Math.cos(a) * 5) - 0, 6 + R(Math.sin(a) * 5), 1, 1, '#ffff99');
          p.p(6 + R(Math.cos(a - 0.3) * 5), 6 + R(Math.sin(a - 0.3) * 5), '#cccc66');
        }
      },
    },
  ),
  ent('rt-hashmap', [[16, 14]], (p) => {
    for (let k = 0; k < 4; k++) {
      p.box(0, k * 3 + 1, 4, 3, NAVY, GIRDER);
      const chain = Math.floor(p.h(k) * 3);
      for (let j = 0; j < chain; j++) {
        p.r(4 + j * 4, k * 3 + 2, 1, 1, REF);
        obj(p, 5 + j * 4, k * 3 + 1, 2, 2, k + j);
      }
    }
  }),
  ent('rt-strpool', [[22, 8]], (p) => {
    p.r(0, 3, 22, 1, '#9999cc');
    for (let k = 0; k < 6; k++) {
      const [b, l] = OBJ[Math.floor(p.h(k) * 5)]!;
      p.r(1 + k * 3.5, 2, 3, 3, b);
      p.p(1 + k * 3.5, 2, l);
    }
    p.r(0, 2, 1, 3, '#cccccc');
  }),
  ent(
    'rt-closure',
    [[12, 12]],
    (p) => {
      p.ring(6, 6, 5, '#9999cc');
      obj(p, 4, 4, 4, 4, Math.floor(p.h(0) * 5));
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const a = t * 1.3;
        p.p(6 + R(Math.cos(a) * 5), 6 + R(Math.sin(a) * 5), '#ffffff');
      },
    },
  ),
  ent(
    'rt-eventloop',
    [[14, 14]],
    (p) => {
      p.disc(7, 7, 6, STRUT);
      p.disc(7, 7, 5, NAVY);
      for (let k = 0; k < 8; k++) {
        const a = (k * TAU) / 8;
        p.p(7 + R(Math.cos(a) * 5), 7 + R(Math.sin(a) * 5), k % 2 ? '#666699' : '#9999cc');
      }
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const a = t * 1.6;
        p.l(7, 7, 7 + Math.cos(a) * 4, 7 + Math.sin(a) * 4, '#ffff99');
        p.p(7, 7, '#ffffff');
      },
      noFlip: true,
    },
  ),
  ent(
    'rt-promise',
    [[12, 12]],
    (p) => {
      p.box(0, 0, 12, 12, NAVY, '#9999cc');
      p.r(3, 2, 6, 1, '#cccc66');
      p.r(4, 3, 4, 2, '#cccc66');
      p.r(5, 5, 2, 2, '#cccc66');
      p.r(4, 7, 4, 2, '#666633');
      p.r(3, 9, 6, 1, '#cccc66');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (Math.floor(t * 4) % 2) p.p(6, 7, '#ffff99');
        p.p(5 + (Math.floor(t * 2) % 2), 4, '#ffff99');
      },
      noFlip: true,
    },
  ),
  ent(
    'rt-compact',
    [[26, 10]],
    (p, w) => {
      p.r(0, 7, w, 2, '#666666');
      p.r(0, 7, w, 1, '#999999');
      for (let x = 1; x < w; x += 4) p.p(x, 9, '#333333');
    },
    {
      anim: (p, w, _h, _v, t) => {
        const s = mod(t * 4, 5);
        for (let k = 0; k < 6; k++) {
          const x = R(k * 4.5 + 2 - s * (k / 5));
          if (x < w - 3) obj(p, x, 4, 3, 3, k);
        }
      },
    },
  ),
  ent('rt-vtable', [[14, 14]], (p) => {
    p.box(0, 0, 8, 14, NAVY, GIRDER);
    for (let k = 0; k < 4; k++) {
      p.r(1, 1 + k * 3, 6, 2, k % 2 ? '#333366' : '#666699');
      if (p.h(k) > 0.4) {
        p.r(8, 2 + k * 3, 4, 1, REF);
        p.p(12, 2 + k * 3, '#ffff99');
      }
    }
  }),
  ent(
    'rt-bytecode',
    [[34, 8]],
    (p) => {
      const ops = ['aload_0', 'iadd', 'dup', 'areturn', 'new #7', 'ifnull'];
      p.t(p.pick(ops, 0), 0, 7, '#6666cc');
    },
    { text: true, cap: 1, weight: 0.5 },
  ),
];

export const RUNTIME_ANCHORS: EntityDef[] = [
  ent('rt-scaffold', [[64, 52]], (p) => {
    // A three-deck heap scaffold: generations stacked, a ladder up the side.
    for (let k = 0; k < 3; k++) {
      const y = 14 + k * 17;
      const w = 64 - k * 0;
      girder(p, 0, y, w);
      for (let ox = 2, n = 0; ox < w - 6; n++) {
        const ow = 3 + R(p.h(k * 20 + n) * 3);
        const oh = 3 + R(p.h(k * 20 + n + 7) * 8);
        if (p.h(k * 20 + n + 3) > 0.2) obj(p, ox, y - oh, ow, oh, k * 3 + n);
        ox += ow + 1;
      }
    }
    for (const x of [0, 63]) p.r(x, 0, 1, 52, STRUT);
    p.r(0, 0, 64, 1, GIRDER);
    for (let y = 3; y < 50; y += 3) p.r(57, y, 5, 1, '#9999cc');
    p.r(56, 0, 1, 50, '#666699');
    p.r(62, 0, 1, 50, '#666699');
  }),
  ent(
    'rt-incinerator',
    [[40, 44]],
    (p) => {
      p.r(26, 7, 7, 13, '#333366');
      p.r(27, 7, 5, 13, '#666699');
      p.r(2, 18, 36, 26, '#333366');
      p.r(3, 19, 34, 1, '#9999cc');
      p.r(10, 26, 20, 14, NAVY);
      p.r(10, 26, 20, 1, '#666699');
      for (let x = 12; x < 29; x += 4) p.r(x, 27, 1, 13, '#333366');
      p.r(4, 22, 4, 2, '#ffcc33');
      p.r(32, 22, 4, 2, '#cc6666');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const f = 0.6 + 0.4 * Math.sin(t * 5);
        p.glow(20, 36, 16, `rgba(255,120,40,${(0.35 * f).toFixed(2)})`);
        for (let k = 0; k < 5; k++) {
          const fh = 3 + R((Math.sin(t * 6 + k * 1.9) * 0.5 + 0.5) * 6);
          p.r(11 + k * 4, 40 - fh, 3, fh, k % 2 ? '#ff9933' : '#ffcc33');
        }
        for (let k = 0; k < 3; k++) {
          const q = mod(t * 0.4 + k / 3, 1);
          p.r(28 + R(Math.sin(q * 5 + k) * 2), 5 - R(q * 5), 3, 2, q < 0.5 ? '#999999' : '#666666');
        }
      },
    },
  ),
];
