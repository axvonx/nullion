/** Layer `uarch`: Out-of-order μops, branch predictors and L1/L2/L3 cache banks. */
import { prows, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import type { EntityDef } from '../render/v4/kit';
import { drivers } from './drivers';
import { fill, frame, line, mod, rect } from './shared/draw-kit';
import { bpr, sl } from './shared/endless-props';
import type { LayerArt } from './types';

const PROPS: EntityDef[] = [
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

const ANCHORS: EntityDef[] = [
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

export const uarch: LayerArt = {
  family: 'ring-3',
  blurb: 'Out-of-order μops, branch predictors and L1/L2/L3 cache banks',
  palette: 'blueprint',
  form: 'raw',
  cursor: 'bit',
  stackTheme: {
    accent: '#58c4f0',
    hi: '#dff6ff',
    tint: 'rgba(88, 196, 240, 0.14)',
    border: 'rgba(88, 196, 240, 0.38)',
    anim: 'scan',
    icon: drivers.stackTheme.icon,
  },
  topicTags: ['hardware', 'math', 'concurrency'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'ring-3', prefix: 'ua', upTo: 20 }, density: 3.4, anchorCount: 2, far: 0.25 },
  fog: [4, 12, 24],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000000');
    // Blueprint schematic grid
    for (let x = 20; x < b.w; x += 20) fill(ctx, x, y0, 1, y1 - y0, '#555555');
    prows(b, 0.5, 20, (y) => fill(ctx, 0, y, b.w, 1, '#555555'));
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, cx, cy }) => {
      // Full-bleed Giant Iconic ALU Chevron (V-notched trapezoid) centerpiece + bold parallel pipeline lanes + flickering mispredict branch!
      const aluX = cx - 24;
      // Bold parallel operand pipeline lanes feeding into the ALU's upper and lower jaws
      for (const dy of [-22, -16, 16, 22]) {
        rect(ctx, 8, cy + dy, Math.max(12, aluX - 8), 2, Math.abs(dy) === 22 ? '#aaaaaa' : '#555555');
      }
      // Giant iconic V-notched ALU trapezoid silhouette
      const aluW = 54;
      const aluH = 44;
      for (let i = 0; i < aluW; i++) {
        const yTop = cy - aluH + Math.floor((i * 18) / aluW);
        const yBot = cy + aluH - Math.floor((i * 18) / aluW);
        rect(ctx, aluX + i, yTop, 1, yBot - yTop, '#000000');
      }
      // Cut the iconic V-notch on the left edge of the ALU
      for (let d = 0; d < 14; d++) {
        rect(ctx, aluX, cy - 14 + d, d, 1, '#000000');
        rect(ctx, aluX, cy + 14 - d, d, 1, '#000000');
      }
      // Bold 2px ALU outline
      for (let t0 = 0; t0 < 2; t0++) {
        line(ctx, aluX, cy - aluH + t0, aluX + aluW, cy - 26 + t0, '#ffffff');
        line(ctx, aluX, cy + aluH - t0, aluX + aluW, cy + 26 - t0, '#ffffff');
        rect(ctx, aluX + aluW - t0, cy - 26, 1, 52, '#ffffff');
        rect(ctx, aluX + t0, cy - aluH, 1, 30, '#ffffff');
        rect(ctx, aluX + t0, cy + 14, 1, 30, '#ffffff');
        line(ctx, aluX, cy - 14 + t0, aluX + 14, cy + t0, '#aaaaaa');
        line(ctx, aluX, cy + 14 - t0, aluX + 14, cy - t0, '#aaaaaa');
      }
      // Taken branch (upper right, bright solid with moving μop pulses)
      const outX = aluX + aluW;
      for (let d = 0; d < 2; d++) line(ctx, outX, cy - 10 + d, W - 18, cy - 48 + d, '#ffffff');
      const uq = mod(t * 0.7, 1);
      rect(ctx, outX + (W - 18 - outX) * uq - 2, cy - 10 - 38 * uq - 2, 5, 5, '#ffffff');
      frame(ctx, W - 44, cy - 58, 30, 20, '#ffffff');
      rect(ctx, W - 38, cy - 50, 18, 3, '#aaaaaa');
      // Larger, clearer flickering mispredict ghost branch (lower right)
      const alive = mod(t * 0.42, 1) < 0.72;
      if (alive) {
        for (let s = 0; s < 14; s++) {
          if (s % 2 === 0) {
            const q = s / 14;
            rect(ctx, outX + (W - 44 - outX) * q, cy + 10 + 34 * q, 5, 2, '#aaaaaa');
          }
        }
        frame(ctx, W - 44, cy + 36, 30, 20, '#aaaaaa');
        line(ctx, W - 40, cy + 40, W - 18, cy + 52, '#555555');
        line(ctx, W - 18, cy + 40, W - 40, cy + 52, '#555555');
      }
    },
    detail: ({ ctx, t, cx, bot, cy }) => {
      for (let k = 0; k < 5; k++) {
        const x = 12 + mod(t * 30 + k * 40, Math.max(40, cx - 40));
        rect(ctx, x, cy - 1, 3, 3, '#ffffff');
      }
      for (let k = 0; k < 8; k++) rect(ctx, 14 + k * 6, bot - 18, 4, 8, k < Math.floor(mod(t * 3, 9)) ? '#aaaaaa' : '#555555');
    },
  },
  critters: {
    motions: [MotionType.Zip, MotionType.Mirror],
    count: 3,
    exitLabels: ['mispredict!', 'flushed'],
    draw: ({ px, ink, t, phase, dir }) => {
      // Speculative phantom: flickering μop glider
      const ghost = Math.floor(t * 6 + phase) % 2 === 0;
      px(0, 0, 6, 6, ghost ? '#ffffff' : '#aaaaaa');
      px(1, 2, 4, 2, ink);
      px(dir > 0 ? 5 : 0, 2, 1, 2, '#ffffff');
    },
  },
  sound: {
    timbre: { wave: 'square', filterHz: 5400, q: 1.2, gainScale: 0.82, reverbWet: 0.06, short: true },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
    critterCall: (snd, t, p) => {
      snd.voice({ freq: 1320, at: t, dur: 0.022, wave: 'square', gain: 0.17, pan: p, reverb: 0.05 });
    },
  },
};
