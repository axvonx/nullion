/** Layer `ept`: Two-dimensional nested page tables and IOMMU quarantine gates. */
import { prows, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import type { EntityDef } from '../render/v4/kit';
import { ringMinus1 } from './ring-1';
import { R, fill, frame, rect, ring } from './shared/draw-kit';
import { grn, sl } from './shared/endless-props';
import { text, variants } from '../text';
import type { LayerArt } from './types';

const PROPS: EntityDef[] = [
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

const ANCHORS: EntityDef[] = [
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

export const ept: LayerArt = {
  family: 'ring-1',
  blurb: text('layers.ept.blurb'),
  palette: 'green',
  form: 'hyper',
  cursor: 'bit',
  stackTheme: ringMinus1.stackTheme,
  topicTags: ['os', 'hardware', 'dsa'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'ring-1', prefix: 'ept', upTo: 20 }, density: 4.0, anchorCount: 2, far: 0.35 },
  fog: [0, 0, 0],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000000');
    for (let x = 16; x < b.w; x += 32) fill(ctx, x, y0, 1, y1 - y0, '#555555');
    prows(b, 0.5, 24, (y) => fill(ctx, 0, y, b.w, 1, '#555555'));
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, cx, top, bot, cy }) => {
      // Full-bleed Isometric Checkerboard Page-Table Slabs (Guest Physical above, Host Physical below) + padlocked IOMMU quarantine rings!
      const drawIsoSlab = (sy: number, hi: string, mid: string) => {
        const rows = 5;
        const cols = 8;
        const slabW = Math.min(W - 44, 240);
        const cellW = Math.max(12, Math.floor(slabW / cols));
        const xStart = cx - R((cols * cellW) / 2);
        for (let r = 0; r < rows; r++) {
          const skew = (r - 2) * 5;
          const ry = sy + r * 6;
          for (let col = 0; col < cols; col++) {
            const x = xStart + col * cellW + skew;
            const light = (r + col) % 2 === 0;
            rect(ctx, x, ry, cellW - 1, 5, light ? mid : '#000000');
            frame(ctx, x, ry, cellW, 6, hi);
          }
        }
      };
      const topP = top + 16;
      const botP = bot - 48;
      drawIsoSlab(topP, '#aaaaaa', '#555555');
      drawIsoSlab(botP, '#ffffff', '#555555');
      // 3 bold address-translation beams passing through padlocked IOMMU quarantine rings
      for (let k = 0; k < 3; k++) {
        const lx = R(W * (0.22 + k * 0.28) + Math.sin(t * (0.45 + k * 0.14) + k) * 20);
        rect(ctx, lx - 1, topP + 26, 3, Math.max(12, botP - (topP + 26)), k === 1 ? '#ffffff' : '#aaaaaa');
        // Quarantine ring + mini padlock clamp mid-beam
        ring(ctx, lx, cy, 11, '#ffffff');
        ring(ctx, lx, cy, 9, '#aaaaaa');
        rect(ctx, lx - 5, cy - 2, 11, 8, '#000000');
        frame(ctx, lx - 5, cy - 2, 11, 8, '#ffffff');
        rect(ctx, lx - 3, cy - 6, 7, 4, '#aaaaaa');
        rect(ctx, lx - 1, cy - 4, 3, 2, '#000000');
        rect(ctx, lx, cy + 1, 1, 3, '#ffffff');
      }
    },
    detail: ({ ctx, t, W, cy }) => {
      for (let k = 0; k < 6; k++) {
        const x = 24 + k * Math.floor((W - 48) / 6);
        const v = Math.floor(t * 2 + k * 3) % 4;
        rect(ctx, x, cy - 4, 10, 2, '#555555');
        rect(ctx, x + v * 2, cy - 4, 2, 2, '#ffffff');
      }
    },
  },
  critters: {
    motions: [MotionType.Grid, MotionType.Mirror],
    count: 2,
    exitLabels: variants('layers.ept.exit'),
    draw: ({ px, ink, t, phase, perched, mirror }) => {
      // Squat hexagonal translation bug: a notched mint carapace, two eyes, stubby feet.
      mirror();
      const step = perched ? 0 : Math.floor(t * 6 + phase) % 2;
      px(1, 0, 2, 1, '#8cff9c');
      px(4, 0, 2, 1, '#8cff9c');
      px(0, 1, 7, 4, '#8cff9c');
      px(1, 5, 5, 1, '#8cff9c');
      px(2, 2, 1, 1, ink);
      px(4, 2, 1, 1, ink);
      px(3, 3, 1, 2, '#1ea046');
      px(1 + step, 6, 1, 1, '#1ea046');
      px(5 - step, 6, 1, 1, '#1ea046');
    },
  },
  sound: {
    timbre: { wave: 'pulse25', filterHz: 1500, q: 2.4, gainScale: 0.82, reverbWet: 0.32 },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
    critterCall: ringMinus1.sound.critterCall,
  },
};
