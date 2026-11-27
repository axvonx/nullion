/** Layer `rtl`: NAND gates, flip-flops and the clock tree pulsing in lockstep. */
import { prows, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import type { EntityDef } from '../render/v4/kit';
import { R, fill, line, mod, rect, ring } from './shared/draw-kit';
import { bpr, sl } from './shared/endless-props';
import type { LayerArt } from './types';
import { uarch } from './uarch';

const PROPS: EntityDef[] = [
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

const ANCHORS: EntityDef[] = [
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

export const rtl: LayerArt = {
  family: 'ring-3',
  blurb: 'NAND gates, flip-flops and the clock tree pulsing in lockstep',
  palette: 'blueprint',
  form: 'raw',
  cursor: 'bit',
  stackTheme: {
    accent: '#48b4e6',
    hi: '#d8f4ff',
    tint: 'rgba(72, 180, 230, 0.14)',
    border: 'rgba(72, 180, 230, 0.38)',
    anim: 'tick',
    icon: [
      '##       ',
      '  #####  ',
      '  #    # ',
      '  # ++  #',
      '  # + + #',
      '  # ++  #',
      '  #    # ',
      '  #####  ',
      '##       ',
    ],
  },
  topicTags: ['hardware', 'languages', 'math'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'ring-3', prefix: 'rtl', upTo: 20 }, density: 3.2, anchorCount: 2, far: 0.2 },
  fog: [4, 12, 24],
  background: (ctx, b, { T, entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000000');
    prows(b, 0.6, 26, (y, i) => {
      const x = mod(T * 18 + i * 23, b.w);
      fill(ctx, 0, y, b.w, 1, '#555555');
      fill(ctx, x, y, 5, 1, '#ffffff');
    });
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, cx, cy, H }) => {
      // Full-bleed Thickened Fractal Clock H-Tree + 4 large unmistakable logic gate silhouettes (AND, OR, XOR, NOT) at the major branch junctions!
      const phase = Math.floor(t * 4) % 3;
      const c0 = phase === 0 ? '#ffffff' : '#aaaaaa';
      const c1 = phase === 1 ? '#ffffff' : '#555555';
      const c2 = phase === 2 ? '#ffffff' : '#555555';
      const sw = W - 52;
      const sh = Math.max(82, H - 56);
      // Thickened Level 0 & 1 central H trunks
      rect(ctx, cx - R(sw / 2), cy - 1, sw, 3, c0);
      rect(ctx, cx - R(sw / 2) - 1, cy - R(sh / 2), 3, sh, c1);
      rect(ctx, cx + R(sw / 2) - 2, cy - R(sh / 2), 3, sh, c1);
      const drawGate = (gx: number, gy: number, kind: 'and' | 'or' | 'xor' | 'not', col: string) => {
        rect(ctx, gx - 12, gy - 10, 24, 20, '#000000');
        if (kind === 'and') {
          rect(ctx, gx - 10, gy - 9, 2, 18, col);
          rect(ctx, gx - 10, gy - 9, 10, 2, col);
          rect(ctx, gx - 10, gy + 7, 10, 2, col);
          for (let dy = -8; dy <= 8; dy++) {
            const dx = Math.floor(Math.sqrt(Math.max(0, 64 - dy * dy)));
            rect(ctx, gx + dx - 1, gy + dy, 2, 1, col);
          }
        } else if (kind === 'or' || kind === 'xor') {
          for (let dy = -8; dy <= 8; dy++) {
            const curve = Math.floor((dy * dy) / 16);
            rect(ctx, gx - 10 + curve, gy + dy, 2, 1, col);
            if (kind === 'xor') rect(ctx, gx - 14 + curve, gy + dy, 2, 1, '#ffffff');
          }
          line(ctx, gx - 6, gy - 8, gx + 10, gy, col);
          line(ctx, gx - 6, gy - 7, gx + 10, gy, col);
          line(ctx, gx - 6, gy + 8, gx + 10, gy, col);
          line(ctx, gx - 6, gy + 7, gx + 10, gy, col);
        } else {
          // NOT triangle + inversion bubble
          rect(ctx, gx - 10, gy - 9, 2, 18, col);
          line(ctx, gx - 8, gy - 8, gx + 6, gy, col);
          line(ctx, gx - 8, gy - 7, gx + 6, gy, col);
          line(ctx, gx - 8, gy + 8, gx + 6, gy, col);
          line(ctx, gx - 8, gy + 7, gx + 6, gy, col);
          ring(ctx, gx + 10, gy, 3, '#ffffff');
        }
      };
      const corners: [number, number, 'and' | 'or' | 'xor' | 'not'][] = [
        [cx - R(sw / 2), cy - R(sh / 2), 'and'],
        [cx + R(sw / 2), cy - R(sh / 2), 'or'],
        [cx - R(sw / 2), cy + R(sh / 2), 'xor'],
        [cx + R(sw / 2), cy + R(sh / 2), 'not'],
      ];
      for (const [lx, ly, kind] of corners) {
        rect(ctx, lx - 22, ly - 1, 44, 2, c1);
        rect(ctx, lx - 22, ly - 14, 2, 28, c2);
        rect(ctx, lx + 21, ly - 14, 2, 28, c2);
        drawGate(lx, ly, kind, c0);
      }
      rect(ctx, cx - 5, cy - 5, 10, 10, '#ffffff');
      rect(ctx, cx - 2, cy - 2, 4, 4, '#000000');
    },
    detail: ({ ctx, t, W, top, bot }) => {
      // Scrolling timing-diagram waveforms in the top and bottom lanes.
      for (const [wy, ph] of [[top + 8, 0], [bot - 16, 2]] as const) {
        for (let x = 8; x < W - 8; x += 4) {
          const hi = ((x >> 2) + Math.floor(t * 6) + ph) % 3 === 0;
          rect(ctx, x, wy + (hi ? 0 : 5), 4, 1, '#aaaaaa');
        }
      }
    },
  },
  critters: {
    motions: [MotionType.Scuttle, MotionType.Grid],
    count: 4,
    exitLabels: ['metastable', 'latched'],
    draw: ({ px, ink, dir }) => {
      // Logic pulse glider
      px(0, 1, 6, 4, '#aaaaaa');
      px(dir > 0 ? 3 : 1, 0, 3, 6, '#ffffff');
      px(dir > 0 ? 4 : 2, 2, 1, 1, ink);
    },
  },
  sound: {
    timbre: { wave: 'square', filterHz: 5400, q: 1.2, gainScale: 0.82, reverbWet: 0.06, short: true },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
    critterCall: uarch.sound.critterCall,
  },
};
