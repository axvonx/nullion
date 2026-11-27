/** Layer `litho`: 13.5nm EUV interference fringes etched into crystalline silicon. */
import { hash, prows, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef } from '../render/v4/kit';
import { ringMinus3 } from './ring-3';
import { R, disc, fill, line, mod, rect, ring } from './shared/draw-kit';
import { E, K, sl } from './shared/endless-props';
import type { LayerArt } from './types';

const EK: K = { i: '#080412', d: '#3a1876', m: '#8e4ee8', l: '#f4ecff', h: '#f4ecff', w: '#8e4ee8', wl: '#f4ecff', o: '#3a1876', ol: '#8e4ee8', a: '#f4ecff', b: '#f4ecff', g: '#8e4ee8', c: '#f4ecff', r: '#f4ecff' };

const euv = E(EK);

const PROPS: EntityDef[] = [
  euv('li-lattice', [18, 16], (p, k) => {
    // silicon wafer on a chuck, lattice grid etched on it, one point defect
    sl(p, 5, 14, 8, 2, k.d, k.m, k.i);
    p.r(8, 12, 2, 3, k.d);
    p.disc(9, 7, 7, k.m);
    p.disc(9, 7, 6, k.d);
    for (let y = 2; y < 13; y += 3) {
      for (let x = 4; x < 15; x += 3) p.p(x, y, k.m);
    }
    p.r(5, 3, 2, 1, k.l);
    p.p(11, 8, k.l);
    p.p(10, 8, k.i);
  }),
  euv('li-boule', [34, 16], (p, k) => {
    // silicon ingot on a V-block, tapered seed-pull neck at one end
    sl(p, 10, 13, 18, 3, k.d, k.m, k.i);
    p.r(12, 11, 2, 2, k.d);
    p.r(24, 11, 2, 2, k.d);
    sl(p, 12, 2, 20, 10, k.m, k.l, k.d);
    p.r(8, 3, 4, 8, k.m);
    p.r(5, 5, 3, 4, k.m);
    p.r(3, 6, 2, 2, k.l);
    p.r(0, 7, 3, 1, k.l);
    p.r(8, 3, 4, 1, k.l);
    p.r(14, 5, 1, 4, k.l);
  }),
  euv('li-grating', [12, 14], (p, k) => {
    sl(p, 2, 0, 8, 10, k.m, k.l, k.d);
    for (let x = 3; x < 9; x += 2) p.r(x, 1, 1, 8, k.d);
    p.r(5, 10, 2, 2, k.d);
    sl(p, 2, 12, 8, 2, k.d, k.m, k.i);
  }),
  euv('li-wafer-boat', [20, 18], (p, k) => {
    sl(p, 1, 15, 18, 3, k.d, k.m, k.i);
    p.r(1, 2, 2, 13, k.d);
    p.r(17, 2, 2, 13, k.d);
    p.r(2, 2, 16, 1, k.m);
    for (let n = 0; n < 4; n++) {
      sl(p, 5 + n * 3, 1, 2, 13, k.m, k.l, k.d);
      p.p(5 + n * 3, 1, k.l);
    }
    p.r(2, 12, 16, 1, k.d);
  }),
  euv('li-coater', [14, 12], (p, k) => {
    sl(p, 2, 6, 10, 6, k.d, k.m, k.i);
    sl(p, 1, 4, 12, 2, k.m, k.l, k.d);
    p.r(11, 0, 3, 1, k.m);
    p.r(12, 0, 1, 3, k.m);
    p.r(5, 1, 7, 1, k.m);
    p.r(5, 2, 1, 2, k.l);
  }),
    ent('li-mask', [[18, 18]], (p) => {
      p.frame(0, 0, 18, 18, '#aaaaaa');
      p.r(3, 3, 5, 5, '#555555');
      p.r(10, 9, 5, 6, '#555555');
    }),
    ent('li-resist', [[20, 8]], (p) => {
      p.r(0, 4, 20, 4, '#555555');
      for (let k = 0; k < 4; k++) p.r(2 + k * 5, 0, 3, 5, '#aaaaaa');
    }),
];

const ANCHORS: EntityDef[] = [
  ent('li-reticle', [[48, 48]], (p) => {
    p.disc(24, 24, 22, '#555555');
    p.disc(24, 24, 16, '#aaaaaa');
    p.disc(24, 24, 10, '#000000');
    p.disc(24, 24, 7, '#ffffff');
    p.r(23, 2, 2, 44, '#555555');
    p.r(2, 23, 44, 2, '#555555');
  }),
];

export const litho: LayerArt = {
  family: 'ring-3',
  blurb: '13.5nm EUV interference fringes etched into crystalline silicon',
  palette: 'euv',
  form: 'raw',
  cursor: 'bit',
  stackTheme: {
    accent: '#9a68f0',
    hi: '#f4ecff',
    tint: 'rgba(154, 104, 240, 0.14)',
    border: 'rgba(154, 104, 240, 0.38)',
    anim: 'scan',
    icon: ringMinus3.stackTheme.icon,
  },
  topicTags: ['hardware', 'math', 'graphics'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'ring-3', prefix: 'li', upTo: 22 }, density: 2.8, anchorCount: 1, far: 0.2 },
  fog: [8, 4, 18],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000000');
    prows(b, 0.35, 18, (y, i) => {
      for (let x = (i % 2) * 8; x < b.w; x += 16) fill(ctx, x, y, 1, 1, '#555555');
    });
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, cx, top, bot, cy, H }) => {
      // Full-bleed 13.5nm EUV Fresnel Diffraction Target + giant curved EUV condenser mirror arcs focusing beams onto the central reticle!
      for (let y = top + 12; y < bot - 12; y += 20) {
        for (let x = 12 + ((y / 20) % 2) * 10; x < W - 12; x += 20) {
          rect(ctx, x, y, 2, 2, '#555555');
        }
      }
      // Giant curved EUV condenser mirror arcs framing left & right edges + focused beam rays
      const arcR = Math.min(82, R(H * 0.42));
      for (let dy = -arcR; dy <= arcR; dy += 2) {
        const bend = Math.floor((dy * dy) / (arcR * 2.2));
        rect(ctx, 10 + bend, cy + dy, 5, 2, '#aaaaaa');
        rect(ctx, 15 + bend, cy + dy, 2, 2, '#ffffff');
        rect(ctx, W - 15 - bend, cy + dy, 5, 2, '#aaaaaa');
        rect(ctx, W - 17 - bend, cy + dy, 2, 2, '#ffffff');
      }
      for (const dy of [-arcR + 12, 0, arcR - 12]) {
        line(ctx, 20, cy + dy, cx, cy, '#555555');
        line(ctx, W - 20, cy + dy, cx, cy, '#555555');
      }
      // Expanding animated EUV wavefront + static Fresnel interference rings
      for (const rad of [92, 70, 50, 34, 18]) {
        ring(ctx, cx, cy, rad, rad <= 34 ? '#aaaaaa' : '#555555');
      }
      const waveR = 12 + Math.floor(mod(t * 28, 88));
      ring(ctx, cx, cy, waveR, '#ffffff');
      disc(ctx, cx, cy, 4, '#ffffff');
      rect(ctx, cx, top + 4, 1, H - 8, '#555555');
      rect(ctx, 8, cy, W - 16, 1, '#555555');
    },
    detail: ({ ctx, t, W, top, H }) => {
      for (let k = 0; k < 16; k++) {
        if (Math.floor(t * 2 + k * 1.3) % 3 === 0) {
          const x = hash(k * 17 + 3) * W;
          const y = top + hash(k * 23 + 7) * H;
          rect(ctx, x, y, 1, 3, '#ffffff');
          rect(ctx, x - 1, y + 1, 3, 1, '#aaaaaa');
        }
      }
    },
  },
  critters: {
    motions: [MotionType.Fly, MotionType.Float],
    count: 3,
    exitLabels: ['diffracted', 'etched'],
    draw: ({ px, ink, t, phase }) => {
      // Stray EUV photon: a solid violet body with a bright crown and two rays, eyes dark.
      const pulse = Math.floor(t * 7 + phase) % 2 === 0;
      px(1, 0, 4, 1, '#ffffff');
      px(0, 1, 6, 5, pulse ? '#aaaaaa' : '#555555');
      px(1, 2, 1, 1, ink);
      px(4, 2, 1, 1, ink);
      px(2, 4, 2, 1, '#ffffff');
      px(-1, pulse ? 2 : 3, 1, 2, '#ffffff');
      px(6, pulse ? 2 : 3, 1, 2, '#ffffff');
    },
  },
  sound: {
    timbre: { wave: 'sine', filterHz: 2600, q: 1.2, gainScale: 0.76, reverbWet: 0.38 },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
    critterCall: (snd, t, p) => {
      const f = 880 + Math.random() * 320;
      snd.voice({ freq: f, toFreq: f * 1.12, at: t, dur: 0.14, wave: 'sine', gain: 0.16, pan: p, reverb: 0.35 });
    },
  },
};
