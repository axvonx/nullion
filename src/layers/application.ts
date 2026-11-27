/** Layer `application`: The apps you click, tap and type into. */
import { SEAM_H, glow, hash, prows, vgrad } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef, type Pen } from '../render/v4/kit';
import { R, TAU, disc, fill, frame, line, mod, rect } from './shared/draw-kit';
import { text, variants } from '../text';
import type { LayerArt } from './types';

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

const PROPS: EntityDef[] = [
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

const ANCHORS: EntityDef[] = [
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

export const application: LayerArt = {
  family: 'application',
  blurb: text('layers.application.blurb'),
  palette: 'full',
  form: 'gui',
  cursor: 'arrow',
  stackTheme: {
    accent: '#7ab8f5',
    hi: '#e8f4ff',
    tint: 'rgba(122, 184, 245, 0.14)',
    border: 'rgba(122, 184, 245, 0.36)',
    anim: 'blink',
    icon: [
      '#########',
      '#+.+....#',
      '#########',
      '#       #',
      '#  +++  #',
      '#  + +  #',
      '#  +++  #',
      '#       #',
      '#########',
    ],
  },
  topicTags: ['languages', 'graphics', 'dsa'],
  library: { own: PROPS, anchors: ANCHORS, density: 4.6, anchorCount: 2, far: 0.45 },
  open: 'top',
  keepOut: (_top, bottom, W) => {
    const dw = Math.min(W - 24, 110);
    return [{ x: R((W - dw) / 2) - 3, y: bottom - 17, w: dw + 6, h: 17 }];
  },
  fog: [150, 190, 235],
  background: (ctx, b, { T, entities }) => {
    vgrad(ctx, b, b.bottom - 230, b.bottom + SEAM_H, [
      [0, '#b4e2f7'],
      [0.35, '#7ab0e4'],
      [0.7, '#5868b8'],
      [0.9, '#3a3474'],
      [1, '#2a2350'],
    ]);
    const sy = R(b.bottom * 0.35) - 70;
    glow(ctx, b.w * 0.8, sy, 80, 'rgba(255,248,215,0.6)');
    fill(ctx, b.w * 0.8 - 4, sy - 4, 8, 8, '#fffbe8');
    // Slow clouds on a far plane: sky, not props.
    prows(b, 0.25, 30, (y, i) => {
      if (hash(i * 5 + 1) < 0.55) return;
      const w = 10 + R(hash(i * 5 + 3) * 12);
      const x = mod(hash(i * 5 + 2) * (b.w + 40) + T * 1.5, b.w + 40) - 20;
      fill(ctx, x + 2, y - 2, w - 5, 2, '#ffffff');
      fill(ctx, x, y, w, 3, '#ffffff');
      fill(ctx, x + 1, y + 3, w - 2, 1, '#c8d6f0');
    });
    entities();
    // The dock: the floor of the layer.
    const dy = R(b.bottom - 14);
    const dw = Math.min(b.w - 24, 110);
    const dx = R((b.w - dw) / 2);
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.fillRect(dx, dy, dw, 9);
    fill(ctx, dx, dy, dw, 1, '#dfe6f6');
    const dockCols: [string, string][] = [
      ['#5b8ee6', '#3d6cc4'],
      ['#e6a23c', '#c27c1c'],
      ['#59c08a', '#2f9963'],
      ['#d0605e', '#a83f3d'],
      ['#a070e0', '#7a4cc0'],
    ];
    for (let k = 0; k * 9 + 8 < dw; k++) {
      const [a, a2] = dockCols[k % dockCols.length]!;
      fill(ctx, dx + 3 + k * 9, dy + 2, 6, 6, a2);
      fill(ctx, dx + 3 + k * 9, dy + 2, 6, 3, a);
    }
  },
  setpiece: {
    base: ({ ctx, t, W, top, bot }) => {
      // Full-bleed Sunlit OS-Wallpaper Vista: layered cumulus cloud banks, translucent sky-bridges, 3-tier snow-capped mountains, & alpine lake reflection!
      for (let k = 0; k < 4; k++) {
        const cw = 48 + (k % 2) * 26;
        const cxCloud = mod(k * 96 + t * (2.5 + k * 0.6), W + cw) - cw;
        const cyCloud = top + 16 + (k % 3) * 22;
        rect(ctx, cxCloud + 8, cyCloud - 6, cw - 16, 6, '#e8f4fc');
        rect(ctx, cxCloud + 2, cyCloud, cw - 4, 8, '#dceefb');
        rect(ctx, cxCloud, cyCloud + 6, cw, 5, '#c2dcf4');
      }
      for (const bx of [10, W - 56]) {
        frame(ctx, bx, top + 46, 46, 28, '#8cb4e0');
        rect(ctx, bx + 2, top + 48, 42, 4, '#a8caf0');
      }
      const base = bot - 14;
      for (let x = 0; x < W; x += 2) {
        const h1 = Math.max(0, 68 - Math.abs(x - W * 0.22) * 0.44);
        const h2 = Math.max(0, 80 - Math.abs(x - W * 0.64) * 0.4);
        const h3 = Math.max(0, 56 - Math.abs(x - W * 0.92) * 0.48);
        const h = Math.round(Math.max(h1, h2, h3));
        if (h > 0) {
          rect(ctx, x, base - h, 2, h, '#6a8ac8');
          if (h > 46) rect(ctx, x, base - h, 2, Math.min(12, h - 44), '#e4f0fc');
        }
      }
      for (let x = 0; x < W; x += 2) {
        const h1 = Math.max(0, 44 - Math.abs(x - W * 0.1) * 0.55);
        const h2 = Math.max(0, 50 - Math.abs(x - W * 0.46) * 0.48);
        const h3 = Math.max(0, 46 - Math.abs(x - W * 0.8) * 0.5);
        const h = Math.round(Math.max(h1, h2, h3));
        if (h > 0) {
          rect(ctx, x, base - h, 2, h, '#4c66a8');
          if (h > 36) rect(ctx, x, base - h, 2, 3, '#8fb4e4');
        }
      }
      rect(ctx, 0, base, W, 14, '#3a4f8f');
      for (let k = 0; k < 6; k++) {
        const gx = mod(t * (8 + k * 2) + k * 64, W - 20) + 10;
        rect(ctx, gx, base + 3 + (k % 3) * 3, 16, 1, k % 2 ? '#8fb4e4' : '#c8daf4');
      }
    },
    detail: ({ ctx, t, W, top }) => {
      // A hot-air balloon drifting across the sunlit sky.
      const bx = mod(t * 6 + W * 0.3, W + 40) - 20;
      const by = top + 30 + R(Math.sin(t * 0.5) * 4);
      disc(ctx, bx, by, 8, '#e0605e');
      rect(ctx, bx - 8, by - 2, 16, 3, '#f2c14e');
      rect(ctx, bx - 3, by + 10, 6, 4, '#8a5a2a');
      line(ctx, bx - 5, by + 7, bx - 2, by + 10, '#55607a');
      line(ctx, bx + 5, by + 7, bx + 2, by + 10, '#55607a');
    },
  },
  ambient: ({ ctx, W, H, t, col, s1, s2, s3 }) => {
    const x = Math.round(((s1 * W + t * (4 + s3 * 6)) % (W + 8)) - 4);
    const y = Math.round(s2 * H);
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = col('#ffffff');
    ctx.fillRect(x, y, s3 > 0.65 ? 2 : 1, 1);
  },
  critters: {
    motions: [MotionType.Fly, MotionType.Perch],
    count: 3,
    exitLabels: variants('layers.application.exit'),
    draw: ({ px, ink, t, phase, variant, dir, perched }) => {
      const bodies = ['#ff5f7a', '#ffd166', '#4cc9f0', '#7ee0a1', '#c58bff'];
      const bellies = ['#ffe5ec', '#fff6d6', '#e0f7ff', '#e8fff0', '#f3e8ff'];
      const body = bodies[variant % bodies.length]!;
      const belly = bellies[variant % bellies.length]!;
      const flap = !perched && Math.floor(t * 9 + phase) % 2 === 0;
      px(0, 1, 6, 5, body);
      px(2, 3, 3, 3, belly);
      if (variant === 0 || variant === 2) px(dir > 0 ? 4 : 1, -1, 2, 1, body);
      // Wings fold neatly against the body when perched, flap smoothly when flying
      px(2, perched ? 2 : flap ? -1 : 2, 3, perched ? 1 : 2, '#ffffff');
      const hx = dir > 0 ? 4 : -1;
      px(hx, 0, 3, 3, body);
      px(dir > 0 ? 5 : 0, 1, 1, 1, ink);
      px(dir > 0 ? 7 : -2, 1, 2, 1, '#ffb000');
      px(dir > 0 ? -2 : 6, 2, 2, 2, body);
      if (perched) {
        px(2, 6, 1, 1, '#ffb000');
        px(4, 6, 1, 1, '#ffb000');
      }
    },
    alt: {
      motions: [MotionType.Fly], // butterfly: only flutters, never lands
      draw: ({ px, ink, tick }) => {
        px(0, tick ? 0 : 1, 3, 5, '#ff9fd0');
        px(5, tick ? 0 : 1, 3, 5, '#ffd166');
        px(3, 0, 2, 6, '#fff6e0');
        px(3, 1, 1, 1, ink);
        px(4, 1, 1, 1, ink);
      },
    },
  },
  sound: {
    timbre: { wave: 'triangle', filterHz: 5200, q: 0.8, gainScale: 1.0, reverbWet: 0.24 },
    ambienceLevel: 0.045,
    drones: [{ freq: 261.63, wave: 'sine', filterHz: 420, gain: 0.22 }],
    critterExit: { freq: 680, crush: false },
    critterCall: (snd, t, p) => {
      // Cheerful little 2–3 note pixel songbird chirp
      const base = 1180 + Math.random() * 260;
      snd.voice({ freq: base, toFreq: base * 1.32, at: t, dur: 0.055, wave: 'triangle', gain: 0.21, pan: p });
      snd.voice({ freq: base * 1.18, toFreq: base * 1.48, at: t + 0.065, dur: 0.065, wave: 'triangle', gain: 0.19, pan: p });
      if (Math.random() > 0.45) {
        snd.voice({ freq: base * 1.45, toFreq: base * 1.25, at: t + 0.14, dur: 0.05, wave: 'triangle', gain: 0.15, pan: p });
      }
    },
    artifact: (snd, t, pan) => {
      // Distant soft UI notification pop / gentle two-note triangle pip
      snd.voice({ freq: 784, at: t, dur: 0.05, wave: 'triangle', gain: 0.055, pan });
      if (Math.random() > 0.45) {
        snd.voice({ freq: 1046.5, at: t + 0.055, dur: 0.07, wave: 'triangle', gain: 0.045, pan });
      }
    },
  },
};
