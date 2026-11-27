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
const EDGE = '#2a3358';
const PAPER = '#f3efe6';
const INK = '#55607a';
const FAINT = '#a8acb8';
const WHITE = '#ffffff';

/** A window body with a 1px dark outline and a title bar; returns the content box. */
function win(p: Pen, w: number, h: number, bar: string): [number, number, number, number] {
  p.r(0, 0, w, h, EDGE);
  p.r(1, 1, w - 2, 2, bar);
  p.p(w - 3, 1, '#ff6159');
  p.r(1, 3, w - 2, h - 4, PAPER);
  return [1, 3, w - 2, h - 4];
}

export const APPLICATION: EntityDef[] = [
  ent('app-dialog', [[20, 13]], (p, w, h) => {
    const [a, a2] = acc(p);
    win(p, w, h, a2);
    p.r(3, 5, 3, 3, '#e6a23c');
    p.p(4, 5, WHITE);
    p.r(8, 5, 8, 1, INK);
    p.r(8, 7, 6, 1, FAINT);
    p.r(w - 13, h - 4, 5, 2, a);
    p.r(w - 7, h - 4, 4, 2, '#d8d2c4');
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
  ent('app-calendar', [[13, 13]], (p) => {
    const [a] = acc(p, 2);
    p.r(0, 0, 13, 13, EDGE);
    p.r(1, 1, 11, 11, WHITE);
    p.r(1, 1, 11, 3, a);
    const today = Math.floor(p.h(1) * 9);
    for (let k = 0; k < 9; k++) p.r(2 + (k % 3) * 3, 5 + Math.floor(k / 3) * 2, 2, 1, k === today ? a : '#dfe3ea');
  }),
  ent(
    'app-video',
    [[24, 18]],
    (p) => {
      // Desktop monitor on a stand playing a clip: bezel, dark screen, play mark, scrub track.
      p.r(0, 0, 24, 14, '#c8ccd6');
      p.r(0, 0, 24, 1, WHITE);
      p.r(0, 0, 1, 14, WHITE);
      p.r(23, 1, 1, 13, '#8a93a8');
      p.r(2, 2, 20, 9, '#1b1b26');
      p.r(10, 3, 1, 5, WHITE);
      p.r(11, 4, 1, 3, WHITE);
      p.r(12, 5, 1, 1, WHITE);
      p.r(3, 9, 18, 1, '#4a4a58');
      p.r(10, 14, 4, 2, '#8a93a8');
      p.r(6, 16, 12, 2, '#8a93a8');
      p.r(6, 16, 12, 1, '#c8ccd6');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const q = mod(t * 0.07, 1);
        p.r(3, 9, 17 * q, 1, '#ff3b30');
        p.p(3 + R(17 * q), 8, WHITE);
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
  ent('app-clipboard', [[16, 22]], (p) => {
    // Wooden clipboard leaning on a little easel; a wide brass spring clip pins the paper slip.
    p.r(3, 2, 10, 17, '#c9954a');
    p.r(3, 2, 1, 17, '#e0b574');
    p.r(12, 3, 1, 16, '#a87634');
    p.r(4, 5, 8, 12, PAPER);
    p.r(5, 8, 6, 1, FAINT);
    p.r(5, 10, 5, 1, FAINT);
    p.r(5, 12, 6, 1, FAINT);
    p.r(5, 1, 6, 4, '#e0b030');
    p.r(5, 1, 6, 1, '#fff0a0');
    p.r(6, 0, 4, 1, '#c08a20');
    p.r(6, 3, 4, 1, '#c08a20');
    p.l(5, 19, 2, 21, '#7a5a2a');
    p.l(11, 19, 14, 21, '#7a5a2a');
  }),
  ent('app-undospindle', [[10, 14]], (p) => {
    // A weighted brass desk spindle skewering a stack of undone paper slips.
    p.r(1, 11, 8, 2, '#c9962c');
    p.r(1, 11, 8, 1, '#f0d070');
    for (const [x, y] of [[1, 8], [2, 5], [1, 2]] as const) {
      p.r(x, y, 7, 2, PAPER);
      p.r(x, y + 1, 7, 1, '#d8d2c4');
    }
    p.r(4, 0, 1, 11, '#a0a6b4');
    p.p(4, 0, WHITE);
  }),
  ent('app-toaster', [[22, 16]], (p) => {
    // Chrome-and-enamel two-slot toaster on rubber feet with a golden slice popping out.
    p.r(6, 1, 3, 1, '#b87a28');
    p.r(5, 2, 5, 5, '#e6b050');
    p.r(5, 2, 5, 1, '#b87a28');
    p.r(5, 2, 1, 5, '#f4cf80');
    p.r(2, 6, 18, 7, '#c8ccd6');
    p.r(1, 7, 20, 5, '#c8ccd6');
    p.r(2, 6, 18, 1, WHITE);
    p.r(1, 10, 20, 2, '#d0605e');
    p.r(2, 12, 18, 1, '#a83f3d');
    p.r(4, 6, 7, 1, EDGE);
    p.r(12, 6, 7, 1, EDGE);
    p.r(18, 8, 3, 1, '#8a93a8');
    p.r(3, 13, 3, 2, EDGE);
    p.r(16, 13, 3, 2, EDGE);
  }),
  ent('app-loupe', [[14, 12]], (p) => {
    // Brass-rimmed lens on a hinged desk arm, poised over a small index slip.
    p.r(3, 9, 10, 2, PAPER);
    p.r(3, 10, 10, 1, '#d8d2c4');
    p.disc(9, 3, 3, '#d4a52c');
    p.disc(9, 3, 2, '#bfe4f4');
    p.p(8, 2, WHITE);
    p.l(7, 5, 3, 8, '#8a93a8');
    p.r(0, 8, 4, 3, '#8a93a8');
    p.p(3, 8, '#c8ccd6');
  }),
  ent('app-intercom', [[22, 16]], (p) => {
    // Retro desk intercom: slotted speaker grille beside a red push-to-talk key.
    p.r(1, 2, 20, 11, '#c9b28a');
    p.r(1, 2, 20, 1, '#e6d4ae');
    p.r(1, 2, 1, 11, '#e6d4ae');
    p.r(20, 3, 1, 10, '#9a845e');
    p.r(3, 4, 10, 7, '#5a4d3a');
    for (let k = 0; k < 3; k++) p.r(4, 5 + k * 2, 8, 1, '#1b1b26');
    p.r(15, 4, 5, 4, '#d0302e');
    p.r(15, 4, 5, 1, '#ff7a70');
    p.r(15, 9, 3, 2, '#7a6a4a');
    p.r(3, 13, 3, 2, EDGE);
    p.r(16, 13, 3, 2, EDGE);
  }),
  ent('app-palette', [[14, 11]], (p) => {
    // Oval painter's palette on a low peg stand, four bright dabs of paint.
    p.r(2, 1, 10, 6, '#c9954a');
    p.r(1, 2, 12, 4, '#c9954a');
    p.r(2, 1, 8, 1, '#e0b574');
    p.p(10, 5, '#7a5a2a');
    p.r(3, 2, 2, 2, '#d0605e');
    p.r(6, 2, 2, 2, '#e6c23c');
    p.r(9, 2, 2, 2, '#59c08a');
    p.r(4, 5, 2, 1, '#5b8ee6');
    p.r(6, 7, 2, 2, '#7a5a2a');
    p.r(4, 9, 6, 1, '#7a5a2a');
  }),
  ent('app-odometer', [[14, 10]], (p) => {
    // Dark mechanical counter on rubber feet: four white number drums behind a window.
    p.r(1, 1, 12, 7, '#3a3f52');
    p.r(1, 1, 12, 1, '#5a617a');
    p.r(2, 2, 10, 4, '#14161e');
    for (let k = 0; k < 4; k++) {
      p.r(3 + k * 2, 3, 2, 3, WHITE);
      p.p(3 + k * 2, 4 + (k % 2), INK);
    }
    p.r(2, 8, 2, 1, EDGE);
    p.r(10, 8, 2, 1, EDGE);
  }),
  ent('app-corkboard', [[30, 25]], (p) => {
    // Wall corkboard in a wooden frame: a cream map card held by one red pushpin.
    p.r(1, 1, 28, 22, '#8a5a2a');
    p.r(1, 1, 28, 1, '#b88450');
    p.r(1, 1, 1, 22, '#b88450');
    p.r(3, 3, 24, 18, '#d49a5c');
    for (let k = 0; k < 18; k++) p.p(4 + R(p.h(k) * 22), 4 + R(p.h(k + 40) * 16), '#a8723a');
    p.r(8, 6, 14, 11, PAPER);
    p.r(9, 8, 5, 4, '#59c08a');
    p.r(15, 11, 5, 4, '#9fd4e8');
    p.l(9, 14, 14, 12, '#d0605e');
    p.disc(15, 6, 2, '#d0302e');
    p.p(14, 5, '#ff8a80');
    p.r(13, 23, 4, 1, '#7a5a2a');
  }),
  ent('app-batterypack', [[28, 22]], (p) => {
    // Desktop battery backup: vented dark case, glowing charge bar, a coiled power cord.
    p.r(1, 3, 20, 16, '#3a3f52');
    p.r(1, 3, 20, 1, '#5a617a');
    p.r(1, 3, 1, 16, '#5a617a');
    p.r(20, 4, 1, 15, '#262a38');
    p.r(4, 6, 14, 4, '#14161e');
    p.r(5, 7, 10, 2, '#59e08a');
    p.r(5, 7, 10, 1, '#b8ffd0');
    p.p(17, 7, '#59e08a');
    for (let k = 0; k < 7; k++) p.r(4 + k * 2, 13, 1, 4, '#14161e');
    p.ring(24, 14, 3, '#8a93a8');
    p.ring(24, 14, 1, '#8a93a8');
    p.l(21, 14, 22, 14, '#8a93a8');
    p.r(23, 18, 4, 2, '#a8acb8');
    p.r(3, 19, 3, 2, EDGE);
    p.r(16, 19, 3, 2, EDGE);
  }),
  ent('app-mail', [[16, 13]], (p) => {
    // Inbox tray holding an envelope with a red unread badge.
    p.r(1, 2, 14, 8, '#f4f0e4');
    p.r(1, 2, 14, 1, WHITE);
    p.l(2, 3, 8, 7, '#a8acb8');
    p.l(14, 3, 8, 7, '#a8acb8');
    p.disc(13, 3, 2, '#e53b30');
    p.p(12, 2, '#ff8a80');
    p.r(0, 10, 16, 2, '#7a5a2a');
    p.r(0, 10, 16, 1, '#b88450');
  }),
  ent('app-printer', [[22, 15]], (p) => {
    // Desktop inkjet: paper fed in at the back, a fresh sheet sliding out the front.
    p.r(5, 0, 12, 6, PAPER);
    p.r(6, 2, 8, 1, FAINT);
    p.r(6, 4, 6, 1, FAINT);
    p.r(1, 5, 20, 7, '#d8dae2');
    p.r(1, 5, 20, 1, WHITE);
    p.r(1, 5, 1, 7, WHITE);
    p.r(20, 6, 1, 6, '#a8acb8');
    p.r(4, 8, 14, 2, '#8a93a8');
    p.r(17, 6, 2, 1, '#34c759');
    p.r(5, 10, 12, 3, WHITE);
    p.r(6, 11, 6, 1, FAINT);
    p.r(2, 12, 3, 2, EDGE);
    p.r(17, 12, 3, 2, EDGE);
  }),
    ent('app-bell', [[11, 12]], (p) => {
      p.r(4, 0, 3, 2, '#e6a23c');
      p.r(2, 2, 7, 6, '#e6a23c');
      p.r(1, 8, 9, 2, '#c27c1c');
      p.r(4, 10, 3, 2, '#c27c1c');
      p.r(8, 1, 2, 2, '#ff3b30');
    }),
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
    p.r(0, 0, 46, 36, EDGE);
    p.r(1, 1, 44, 34, '#e8ecf6');
    p.r(1, 1, 44, 1, WHITE);
    p.r(4, 4, 38, 4, WHITE);
    p.r(5, 5, 2, 2, FAINT);
    for (let k = 0; k < 12; k++) {
      const [a, a2] = ACC[(k + Math.floor(p.h(1) * 6)) % ACC.length]!;
      const x = 5 + (k % 4) * 10;
      const y = 11 + Math.floor(k / 4) * 8;
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
  ent('rt-finalizer', [[24, 12]], (p) => {
    p.r(18, 0, 6, 12, '#333366');
    p.r(19, 1, 4, 11, NAVY);
    p.p(20, 6, '#ffcc33');
    girder(p, 0, 9, 18);
    for (let k = 0; k < 3; k++) obj(p, 1 + k * 5, 5, 3, 4, Math.floor(p.h(k) * 5));
  }),
  ent(
    'rt-interp',
    [[12, 15]],
    (p) => {
      // Vertical opcode strip with a sliding read-head (distinct from rt-eventloop).
      p.box(3, 0, 8, 15, NAVY, GIRDER);
      for (let k = 0; k < 4; k++) p.r(5, 2 + k * 3, 4, 1, k % 2 ? '#6699cc' : '#9999cc');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const row = Math.floor(t * 2.4) % 4;
        const y = 2 + row * 3;
        p.r(0, y - 1, 3, 3, '#ffcc33');
        p.p(2, y, '#ffffff');
        p.r(5, y, 4, 1, '#ffff99');
      },
      noFlip: true,
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
  ent(
    'rt-closure',
    [[14, 13]],
    (p) => {
      // Sealed value pod with a captured environment block and dangling pointer tether.
      p.r(2, 1, 10, 9, STRUT);
      p.frame(2, 1, 10, 9, GIRDER_HI);
      p.r(4, 0, 6, 1, '#9999cc');
      obj(p, 4, 3, 6, 5, Math.floor(p.h(0) * 5));
      p.r(6, 10, 1, 2, REF);
      p.r(7, 11, 5, 1, REF);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const on = Math.floor(t * 2) % 2 === 0;
        p.p(12, 11, on ? '#ffff99' : '#6666cc');
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
  ent('rt-tricolor-signal', [[10, 17]], (p) => {
    // Three-lens signal lantern on an iron post: black, grey, lit white.
    p.r(2, 0, 6, 11, GIRDER);
    p.r(2, 0, 6, 1, GIRDER_HI);
    p.r(2, 0, 1, 11, GIRDER_HI);
    p.r(4, 1, 3, 3, '#ffffff');
    p.r(4, 4, 3, 3, '#999999');
    p.r(4, 7, 3, 3, NAVY);
    p.r(4, 11, 2, 4, STRUT);
    p.r(2, 15, 6, 1, STRUT);
  }),
  ent('rt-bump-dispenser', [[20, 18]], (p) => {
    // Ticket dispenser: a paper roll with a brass pointer arm riding its advancing tear edge.
    p.r(2, 15, 16, 2, STRUT);
    p.r(3, 8, 14, 7, GIRDER);
    p.r(3, 8, 14, 1, GIRDER_HI);
    p.disc(9, 5, 5, '#ffffcc');
    p.ring(9, 5, 5, '#cccc99');
    p.disc(9, 5, 1, '#999999');
    p.r(11, 10, 4, 4, '#ffffcc');
    p.p(11, 13, '#cccc99');
    p.p(13, 13, '#cccc99');
    p.l(17, 9, 13, 6, '#cccc66');
    p.r(16, 8, 2, 2, '#ffff99');
  }),
  ent('rt-card-table', [[22, 18]], (p) => {
    // Wall-mounted sheet-metal card rack: two cards stick up with red-inked dirty tabs.
    p.r(1, 1, 20, 16, GIRDER);
    p.r(1, 1, 20, 1, GIRDER_HI);
    p.r(1, 1, 1, 16, GIRDER_HI);
    for (const [y, dirty] of [[3, 2], [10, 5]] as const) {
      for (let k = 0; k < 8; k++) p.r(3 + k * 2, k === dirty ? y - 1 : y, 1, k === dirty ? 6 : 5, '#ffffcc');
      p.r(3 + dirty * 2, y - 1, 1, 2, '#cc3333');
      p.r(2, y + 5, 18, 1, STRUT);
    }
  }),
  ent('rt-intern-rack', [[28, 32]], (p) => {
    // Key-duplicating board on two legs: a row of identical brass blanks on numbered hooks.
    p.r(1, 2, 26, 16, STRUT);
    p.r(0, 0, 28, 3, GIRDER);
    p.r(0, 0, 28, 1, GIRDER_HI);
    for (let k = 0; k < 8; k++) {
      const x = 2 + k * 3;
      p.p(x + 1, 3, '#cccccc');
      p.r(x, 4, 3, 3, '#cccc66');
      p.p(x + 1, 5, STRUT);
      p.r(x + 1, 7, 1, 8, '#cccc66');
      p.p(x + 2, 11, '#cccc66');
      p.p(x + 2, 13, '#cccc66');
      p.p(x + 1, 16, '#999999');
    }
    for (const x of [3, 22]) {
      p.r(x, 18, 3, 13, GIRDER);
      p.r(x, 18, 1, 13, GIRDER_HI);
      p.r(x - 1, 31, 5, 1, GIRDER_HI);
    }
    p.r(3, 26, 22, 1, STRUT);
  }),
  ent('rt-safepoint-whistle', [[10, 13]], (p) => {
    // Brass referee whistle hanging from an iron wall peg by a dark lanyard loop.
    p.r(1, 0, 6, 2, GIRDER);
    p.r(1, 0, 6, 1, GIRDER_HI);
    p.r(3, 2, 1, 4, STRUT);
    p.r(3, 5, 4, 1, STRUT);
    p.r(0, 7, 4, 3, '#cccc66');
    p.disc(6, 8, 3, '#cccc66');
    p.p(7, 7, NAVY);
    p.r(5, 6, 3, 1, '#ffff99');
    p.p(1, 7, '#ffff99');
  }),
  ent('rt-alarm', [[12, 16]], (p) => {
    // Pull-station on a post: the alarm an exception rings.
    p.r(1, 1, 10, 12, '#cc3333');
    p.r(1, 1, 10, 1, '#ff6666');
    p.r(1, 1, 1, 12, '#ff6666');
    p.r(10, 2, 1, 11, '#993333');
    p.r(3, 3, 6, 3, '#ffffff');
    p.r(4, 4, 4, 1, '#999999');
    p.r(3, 8, 6, 2, '#ffffff');
    p.r(5, 13, 2, 2, STRUT);
    p.r(3, 15, 6, 1, STRUT);
  }),
  ent('rt-profiler', [[12, 14]], (p) => {
    // A stopwatch on a little stand: the sampling profiler's clock.
    p.r(5, 0, 2, 1, '#999999');
    p.disc(6, 6, 5, '#cccccc');
    p.disc(6, 6, 4, '#ffffff');
    for (const [x, y] of [[6, 3], [9, 6], [6, 9], [3, 6]] as const) p.p(x, y, '#333366');
    p.l(6, 6, 8, 4, '#cc3333');
    p.p(6, 6, '#333366');
    p.r(3, 12, 6, 1, STRUT);
    p.r(5, 11, 2, 1, STRUT);
  }),
    ent('rt-nursery', [[18, 13]], (p) => {
      // Low wooden seedling flat on short feet: a brass tag on the rim, four sprouts in dark soil.
      p.r(0, 5, 18, 6, '#996633');
      p.r(0, 5, 18, 1, '#cc9966');
      p.r(17, 6, 1, 5, '#663300');
      p.r(1, 5, 16, 2, '#333300');
      for (let k = 0; k < 4; k++) {
        const x = 3 + k * 4;
        p.r(x, 2, 1, 4, '#66cc66');
        p.r(x - 1, 1, 1, 2, k % 2 ? '#ffff66' : '#99ff99');
        p.r(x + 1, 1, 1, 2, '#99ff99');
      }
      p.r(7, 8, 4, 2, '#cccc66');
      p.r(7, 8, 4, 1, '#ffff99');
      p.r(2, 11, 3, 1, '#663300');
      p.r(13, 11, 3, 1, '#663300');
    }),
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
