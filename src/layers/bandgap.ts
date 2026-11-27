/** Layer `bandgap`: Valence and conduction bands where electrons tunnel through barriers. */
import { SEAM_H, vgrad, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef } from '../render/v4/kit';
import { litho } from './litho';
import { ringMinus3 } from './ring-3';
import { R, disc, fill, frame, mod, rect, ring } from './shared/draw-kit';
import { aby, sl } from './shared/endless-props';
import { text, variants } from '../text';
import type { LayerArt } from './types';

const PROPS: EntityDef[] = [
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
    ent('bg-hole', [[10, 10]], (p) => {
      p.disc(5, 5, 4, '#aaaaaa');
      p.disc(5, 5, 2, '#000000');
    }),
];

const ANCHORS: EntityDef[] = [
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

export const bandgap: LayerArt = {
  family: 'ring-3',
  blurb: text('layers.bandgap.blurb'),
  palette: 'abyss',
  form: 'raw',
  cursor: 'bit',
  stackTheme: {
    accent: '#64bce6',
    hi: '#e6f8ff',
    tint: 'rgba(100, 188, 230, 0.14)',
    border: 'rgba(100, 188, 230, 0.38)',
    anim: 'pulse',
    icon: ringMinus3.stackTheme.icon,
  },
  topicTags: ['hardware', 'math'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'ring-3', prefix: 'bg', upTo: 21 }, density: 2.4, anchorCount: 1, far: 0.15 },
  fog: [3, 4, 10],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000000');
    vgrad(ctx, b, b.top, b.bottom + SEAM_H, [
      [0, 'rgba(76,168,214,0.18)'],
      [0.5, 'rgba(3,4,10,0)'],
      [1, 'rgba(76,168,214,0.22)'],
    ]);
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, cx, top, bot, cy }) => {
      // Full-bleed Twin Energy-Band Horizon + tall bold quantum potential barrier + evanescent exponential decay wave tunneling into bright electron orbs!
      rect(ctx, 0, top + 8, W, 24, '#555555');
      rect(ctx, 0, top + 32, W, 2, '#aaaaaa');
      rect(ctx, 0, bot - 32, W, 24, '#555555');
      rect(ctx, 0, bot - 34, W, 2, '#aaaaaa');
      // Tall, bold central quantum potential barrier wall spanning the forbidden gap
      const bw = 22;
      const bTop = top + 28;
      const bH = Math.max(30, bot - 56 - top);
      rect(ctx, cx - R(bw / 2), bTop, bw, bH, '#555555');
      frame(ctx, cx - R(bw / 2), bTop, bw, bH, '#ffffff');
      for (let hy = bTop + 6; hy < bTop + bH - 4; hy += 8) {
        rect(ctx, cx - R(bw / 2) + 3, hy, bw - 6, 1, '#aaaaaa');
      }
      // Incident wave (left, large amplitude) -> evanescent exponential decay inside barrier -> transmitted wave (right, smaller amplitude)
      for (let x = 4; x < W - 4; x += 2) {
        let amp = 18;
        if (x >= cx - R(bw / 2) && x <= cx + R(bw / 2)) {
          const frac = (x - (cx - R(bw / 2))) / bw;
          amp = 18 * Math.exp(-frac * 1.9);
        } else if (x > cx + R(bw / 2)) {
          amp = 5;
        }
        const wy = cy + R(Math.sin(x * 0.1 - t * 2.8) * amp);
        rect(ctx, x, wy, 2, 2, x > cx + R(bw / 2) ? '#ffffff' : '#aaaaaa');
      }
      // Bright tunneled electron orbs emerging on the far right side of the barrier
      for (let k = 0; k < 2; k++) {
        const q = mod(t * (0.34 + k * 0.12) + k * 0.5, 1);
        const ex = cx + R(bw / 2) + 8 + R(q * (W - (cx + R(bw / 2) + 20)));
        const ey = cy + (k === 0 ? -12 : 12);
        disc(ctx, ex, ey, 3, '#ffffff');
        ring(ctx, ex, ey, 5, '#aaaaaa');
      }
    },
    detail: ({ ctx, t, W, top, bot }) => {
      for (let k = 0; k < 6; k++) {
        const x = mod(t * (14 + k * 3) + k * 61, W);
        rect(ctx, x, top + 18 + (k % 2) * 6, 2, 2, '#ffffff');
        rect(ctx, W - x, bot - 22 - (k % 2) * 6, 2, 2, '#aaaaaa');
      }
    },
  },
  critters: {
    motions: [MotionType.Float, MotionType.Grid],
    count: 3,
    exitLabels: variants('layers.bandgap.exit'),
    draw: ({ px }) => {
      // Tunneling electron cloud
      px(0, 0, 6, 6, '#555555');
      px(2, 2, 2, 2, '#ffffff');
      px(0, 2, 1, 2, '#aaaaaa');
      px(5, 2, 1, 2, '#aaaaaa');
    },
  },
  sound: {
    timbre: { wave: 'sine', filterHz: 2600, q: 1.2, gainScale: 0.76, reverbWet: 0.38 },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
    critterCall: litho.sound.critterCall,
  },
};
