/** Layer `cmos`: FinFET transistors, doped wells and stacked copper metal interconnects. */
import { prows, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef } from '../render/v4/kit';
import { firmware } from './firmware';
import { fill, mod, rect } from './shared/draw-kit';
import { E, K, sl } from './shared/endless-props';
import { text, variants } from '../text';
import type { LayerArt } from './types';

const WK: K = { i: '#08060e', d: '#9448d4', m: '#24989c', l: '#e88438', h: '#f8f6f0', w: '#e88438', wl: '#f8f6f0', o: '#9448d4', ol: '#e88438', a: '#f8f6f0', b: '#24989c', g: '#24989c', c: '#f8f6f0', r: '#e88438' };

const waf = E(WK);

const PROPS: EntityDef[] = [
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

const ANCHORS: EntityDef[] = [
  ent('cm-viatower', [[52, 42]], (p) => {
    for (let y = 4; y < 38; y += 8) p.r(2, y, 48, 3, '#e88438');
    for (let x = 8; x < 46; x += 12) {
      p.r(x, 2, 4, 38, '#9448d4');
      for (let y = 5; y < 38; y += 8) p.r(x + 1, y, 2, 2, '#ffffff');
    }
  }),
];

export const cmos: LayerArt = {
  family: 'drivers',
  blurb: text('layers.cmos.blurb'),
  palette: 'wafer',
  form: 'raw',
  cursor: 'underscore',
  stackTheme: {
    accent: '#b478f0',
    hi: '#52d6da',
    tint: 'rgba(180, 120, 240, 0.14)',
    border: 'rgba(180, 120, 240, 0.38)',
    anim: 'pulse',
    icon: firmware.stackTheme.icon,
  },
  topicTags: ['hardware', 'math', 'graphics'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'ring-3', prefix: 'cm', upTo: 20 }, density: 3.4, anchorCount: 2, far: 0.25 },
  fog: [8, 6, 14],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#08060e');
    prows(b, 0.45, 28, (y, i) => fill(ctx, 0, y, b.w, 1, i % 2 ? '#24989c' : '#9448d4'));
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, top, bot, cy, H }) => {
      // Full-bleed 4-Color Semiconductor Lithography Wafer Mask Cross-Section covering the entire band!
      for (let y = top + 16; y < bot - 20; y += 44) {
        rect(ctx, 10, y, W - 20, 20, '#24989c');
      }
      for (let x = 24; x < W - 20; x += 32) {
        rect(ctx, x, top + 4, 8, H - 8, '#9448d4');
        for (let y = top + 24; y < bot - 20; y += 44) {
          rect(ctx, x + 2, y, 4, 4, '#ffffff');
        }
      }
      for (const my of [cy - 18, cy + 16]) {
        rect(ctx, 0, my, W, 10, '#e88438');
        const cxP = mod(t * 44 + my, W);
        rect(ctx, cxP, my + 3, 12, 4, '#ffffff');
      }
    },
    detail: ({ ctx, t, W, top }) => {
      for (let k = 0; k < 12; k++) {
        const x = mod(t * (12 + (k % 3) * 6) + k * 37, W);
        const y = top + 22 + (k % 3) * 44;
        rect(ctx, x, y, 2, 2, k % 2 ? '#ffffff' : '#e88438');
      }
    },
  },
  critters: {
    motions: [MotionType.Scuttle, MotionType.Float],
    count: 4,
    exitLabels: variants('layers.cmos.exit'),
    draw: ({ px, ink, t, phase, perched }) => {
      // Copper-clad beetle: a rounded orange shell, two eyes, short side legs.
      const leg = perched ? 0 : Math.floor(t * 9 + phase) % 2;
      px(1, 0, 4, 1, '#e88438');
      px(0, 1, 6, 5, '#e88438');
      px(1, 1, 2, 1, '#ffd0a0');
      px(1, 2, 1, 1, ink);
      px(4, 2, 1, 1, ink);
      px(-1, 2 + leg, 1, 1, '#b85a1c');
      px(-1, 4 - leg, 1, 1, '#b85a1c');
      px(6, 2 + leg, 1, 1, '#b85a1c');
      px(6, 4 - leg, 1, 1, '#b85a1c');
    },
    alt: {
      motions: [MotionType.Float], // electron-hole pair: drifts
      draw: ({ px, ink, dir, tick }) => {
        // Teal silicon mite: a rounded body, two eyes and a short attached tail.
        px(1, 0, 4, 1, '#24989c');
        px(0, 1, 6, 5, '#24989c');
        px(1, 1, 2, 1, '#8ff0ee');
        px(1, 3, 1, 1, ink);
        px(4, 3, 1, 1, ink);
        px(dir > 0 ? -3 : 6, 4, 3, 1, '#24989c');
        px(dir > 0 ? -4 : 9, tick ? 3 : 4, 1, 1, '#24989c');
      },
    },
  },
  sound: {
    timbre: { wave: 'triangle', filterHz: 3200, q: 1.8, gainScale: 0.82, reverbWet: 0.18 },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
    critterCall: (snd, t, p) => {
      snd.fmVoice({ carrierHz: 660, modRatio: 3.1, modIndex: 120, at: t, dur: 0.09, gain: 0.18, pan: p });
    },
  },
};
