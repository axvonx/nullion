/** Layer `bytecode`: Parsed syntax trees and virtual instructions before execution. */
import { SEAM_H, vgrad, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef } from '../render/v4/kit';
import { runtime } from './runtime';
import { fill, frame, line, mod, rect } from './shared/draw-kit';
import { byc, sl } from './shared/endless-props';
import type { LayerArt } from './types';

const PROPS: EntityDef[] = [
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

const ANCHORS: EntityDef[] = [
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

export const bytecode: LayerArt = {
  family: 'runtime',
  blurb: 'Parsed syntax trees and virtual instructions before execution',
  palette: 'rgb6',
  form: 'repl',
  cursor: 'ibeam',
  stackTheme: {
    accent: '#a98cff',
    hi: '#ffd56b',
    tint: 'rgba(169, 140, 255, 0.14)',
    border: 'rgba(169, 140, 255, 0.36)',
    anim: 'pulse',
    icon: [
      '   +++   ',
      '    #    ',
      '  #####  ',
      '  #   #  ',
      ' ##   ## ',
      '  #   #  ',
      ' + # # + ',
      '   # #   ',
      '  +   +  ',
    ],
  },
  topicTags: ['languages', 'dsa', 'concurrency'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'runtime', prefix: 'bc', upTo: 20 }, density: 4.2, anchorCount: 2, far: 0.4 },
  fog: [24, 16, 48],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000033');
    vgrad(ctx, b, b.top, b.bottom + SEAM_H, [
      [0, 'rgba(255,153,51,0.22)'],
      [0.5, 'rgba(51,51,102,0.18)'],
      [1, 'rgba(0,0,51,0)'],
    ]);
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, cx, top, bot, H }) => {
      // Full-bleed World-Tree Abstract Syntax Canopy + sprocketed tape columns + diamond branches vs rounded leaf pills!
      for (const sx of [10, W - 26]) {
        rect(ctx, sx, top + 6, 16, H - 12, '#1a1a44');
        frame(ctx, sx, top + 6, 16, H - 12, '#333366');
        const off = Math.floor(t * 6) % 6;
        for (let y = top + 10 + off; y < bot - 10; y += 6) {
          // Film-style sprocket holes on both edges of the bytecode tape
          rect(ctx, sx + 1, y, 2, 2, '#000033');
          rect(ctx, sx + 13, y, 2, 2, '#000033');
          rect(ctx, sx + 4, y, 8, 2, y % 12 === 0 ? '#ffcc33' : '#666699');
        }
      }
      // Central colossal AST trunk & multi-tier boughs spanning the whole band
      rect(ctx, cx - 3, top + 14, 6, H - 24, '#333366');
      rect(ctx, cx - 16, top + 4, 32, 12, '#666699');
      rect(ctx, cx - 12, top + 7, 24, 6, '#ffcc33');
      const tiers = 4;
      for (let r = 0; r < tiers; r++) {
        const y0 = top + 24 + r * Math.floor((H - 44) / tiers);
        const y1 = y0 + 26;
        const spread = Math.min(W * 0.36, 46 + r * 28);
        for (const side of [-1, 1]) {
          const bx = cx + side * spread;
          line(ctx, cx, y0, bx, y1, '#333366');
          line(ctx, cx, y0 + 1, bx, y1 + 1, '#666699');
          // Diamond-shaped branch operator node
          for (let d = 0; d <= 7; d++) {
            rect(ctx, bx - d, y1 - 7 + d, d * 2 + 1, 1, '#333366');
            rect(ctx, bx - d, y1 + 7 - d, d * 2 + 1, 1, '#333366');
          }
          line(ctx, bx, y1 - 7, bx + 7, y1, '#9999cc');
          line(ctx, bx + 7, y1, bx, y1 + 7, '#9999cc');
          line(ctx, bx, y1 + 7, bx - 7, y1, '#9999cc');
          line(ctx, bx - 7, y1, bx, y1 - 7, '#9999cc');
          rect(ctx, bx - 1, y1 - 1, 3, 3, '#ffcc33');
          // Rounded pill leaf literal node
          line(ctx, bx, y1 + 7, bx + side * 14, y1 + 17, '#333366');
          const lx = bx + side * 14;
          const ly = y1 + 15;
          rect(ctx, lx - 5, ly, 10, 6, '#336666');
          rect(ctx, lx - 6, ly + 1, 12, 4, '#66cc99');
          rect(ctx, lx - 4, ly + 2, 8, 2, '#99ffcc');
          // Cascading token pulse
          const q = mod(t * 0.5 + r * 0.21 + (side > 0 ? 0.35 : 0), 1);
          rect(ctx, cx + side * spread * q - 2, y0 + (y1 - y0) * q - 1, 4, 3, '#ffcc33');
        }
      }
    },
    detail: ({ fall }) => {
      fall(8, 14, 3, '#ffcc33');
    },
  },
  critters: {
    motions: [MotionType.Hop, MotionType.Perch],
    count: 3,
    exitLabels: ['parsed', 'folded'],
    draw: ({ px }) => {
      // Floating curly-brace / syntax token sprite
      px(1, 0, 4, 6, '#333366');
      px(2, 1, 2, 4, '#ffcc33');
      px(0, 2, 1, 2, '#ffff99');
      px(5, 2, 1, 2, '#ffff99');
    },
    alt: {
      motions: [MotionType.Grid], // opcode byte: discrete steps
      draw: ({ px }) => {
        px(0, 0, 6, 6, '#333366');
        px(1, 2, 1, 2, '#ffcc33');
        px(3, 2, 2, 2, '#66cc99');
      },
    },
  },
  sound: {
    timbre: { wave: 'pulse25', filterHz: 3600, q: 1.4, gainScale: 0.92, reverbWet: 0.2 },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
    critterCall: runtime.sound.critterCall,
  },
};
