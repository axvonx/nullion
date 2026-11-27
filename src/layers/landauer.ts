/** Layer `landauer`: The thermodynamic floor of computation: kT ln 2 per erased bit. */
import { hash, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef } from '../render/v4/kit';
import { ringMinus3 } from './ring-3';
import { R, TAU, fill, frame, line, mod, rect, ring } from './shared/draw-kit';
import { aby, sl } from './shared/endless-props';
import type { LayerArt } from './types';

const PROPS: EntityDef[] = [
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
    ent('la-lonebit', [[8, 8]], (p) => {
      p.r(1, 1, 6, 6, '#aaaaaa');
      p.r(3, 3, 2, 2, '#ffffff');
    }),
];

const ANCHORS: EntityDef[] = [
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

export const landauer: LayerArt = {
  family: 'ring-3',
  blurb: 'The thermodynamic floor of computation: kT ln 2 per erased bit',
  palette: 'abyss',
  form: 'raw',
  cursor: 'bit',
  stackTheme: {
    accent: '#9ce0ff',
    hi: '#ffffff',
    tint: 'rgba(156, 224, 255, 0.14)',
    border: 'rgba(156, 224, 255, 0.42)',
    anim: 'beat',
    icon: ringMinus3.stackTheme.icon,
  },
  topicTags: ['math', 'hardware'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'ring-3', prefix: 'la', upTo: 21 }, density: 1.8, anchorCount: 1, far: 0 },
  open: 'bottom',
  fog: [3, 4, 10],
  background: (ctx, b, { T, entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000000');
    // Rare cosmic-ray bit-flip streaks across the pure abyss
    if (!b.reduced) {
      const slot = Math.floor(T * 0.6);
      if (hash(slot * 31) > 0.55) {
        const rx = hash(slot * 17) * b.w;
        const ry = y0 + hash(slot * 23) * Math.max(20, y1 - y0);
        for (let k = 0; k < 12; k++) fill(ctx, rx + k, ry + k, 1, 1, k > 8 ? '#ffffff' : '#555555');
      }
    }
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, cx, top, bot, cy }) => {
      // Full-bleed Thermodynamic Event Horizon + lone glowing bit (0/1) dissolving into expanding kT ln 2 heat-dissipation ripples!
      const base = bot - 10;
      for (const rad of [150, 118, 86, 56]) {
        ring(ctx, cx, base + 56, rad, rad <= 86 ? '#aaaaaa' : '#555555');
      }
      const er = 48 + Math.floor(mod(t * 16, 110));
      ring(ctx, cx, base + 56, er, '#555555');
      // Lone glowing bit (0 or 1) hovering above the event horizon, periodically dissolving into expanding heat ripples
      const cycle = mod(t * 0.28, 1);
      const bitY = cy - 18;
      if (cycle < 0.65) {
        const isOne = Math.floor(t * 0.28) % 2 === 1;
        if (isOne) {
          rect(ctx, cx - 2, bitY - 9, 4, 18, '#ffffff');
          rect(ctx, cx - 5, bitY - 6, 3, 2, '#ffffff');
          rect(ctx, cx - 6, bitY + 7, 12, 2, '#ffffff');
        } else {
          frame(ctx, cx - 6, bitY - 9, 12, 18, '#ffffff');
          frame(ctx, cx - 5, bitY - 8, 10, 16, '#ffffff');
        }
      } else {
        // Erasing bit -> expanding kT ln 2 thermal dissipation ripples
        const q = (cycle - 0.65) / 0.35;
        ring(ctx, cx, bitY, 6 + R(q * 36), '#ffffff');
        ring(ctx, cx, bitY, 3 + R(q * 22), '#aaaaaa');
        for (let k = 0; k < 8; k++) {
          const a = (k * TAU) / 8 + q * 0.4;
          rect(ctx, cx + Math.cos(a) * (8 + q * 32), bitY + Math.sin(a) * (8 + q * 32), 2, 2, '#ffffff');
        }
      }
      // Rare dramatic diagonal cosmic-ray track slicing across the abyss
      const slot = Math.floor(t * 0.55);
      if (t > 0 && hash(slot * 47 + 3) > 0.58) {
        const x0 = R(hash(slot * 13) * W * 0.55);
        const y0 = top + 12;
        line(ctx, x0, y0, x0 + 130, y0 + 130, '#aaaaaa');
        rect(ctx, x0 + 128, y0 + 128, 5, 5, '#ffffff');
      }
    },
    detail: ({ ctx, t, W, top, H }) => {
      for (let k = 0; k < 10; k++) {
        if (Math.floor(t * 0.8 + k * 2.1) % 4 === 0) {
          rect(ctx, hash(k * 41 + 1) * W, top + hash(k * 43 + 2) * H, 2, 2, '#aaaaaa');
        }
      }
    },
  },
  critters: {
    motions: [MotionType.Float],
    count: 2,
    exitLabels: ['kT ln 2', 'erased'],
    draw: ({ px, ink, t, phase }) => {
      // Lone stray bit in the void
      const bit = Math.floor(t * 2 + phase) % 2 === 0;
      px(0, 0, 6, 6, '#aaaaaa');
      px(2, 1, bit ? 2 : 3, 4, '#ffffff');
      if (!bit) px(3, 2, 1, 2, ink);
    },
  },
  sound: {
    timbre: { wave: 'sine', filterHz: 2600, q: 1.2, gainScale: 0.76, reverbWet: 0.38 },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
    critterCall: (snd, t, p) => {
      const f = 110;
      snd.voice({ freq: f, toFreq: f * 1.12, at: t, dur: 0.14, wave: 'sine', gain: 0.16, pan: p, reverb: 0.35 });
    },
  },
};
