/** Layer `internet`: Autonomous systems, BGP routes and undersea fiber above your machine. */
import { SEAM_H, hash, prows, vgrad } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef } from '../render/v4/kit';
import { application } from './application';
import { R, fill, line, mod, px, rect, ring } from './shared/draw-kit';
import { net, sl } from './shared/endless-props';
import { text, variants } from '../text';
import type { LayerArt } from './types';

const PROPS: EntityDef[] = [
  ent('net-router', [[16, 11]], (p) => {
    p.r(2, 0, 1, 5, '#55607a');
    p.r(13, 0, 1, 5, '#55607a');
    p.r(0, 5, 16, 6, '#2a3358');
    p.r(1, 6, 14, 4, '#e9e6dc');
    for (let k = 0; k < 4; k++) p.p(3 + k * 3, 8, k % 2 ? '#59c08a' : '#e6a23c');
  }),
  // Armored undersea cable run: flanged end connectors, four raised amber collars, resting on the floor.
  net('net-cable', [26, 10], (p, k) => {
    p.r(3, 3, 20, 6, k.d);
    p.r(3, 3, 20, 1, k.b);
    p.r(3, 8, 20, 1, k.i);
    for (const x of [7, 11, 15, 19]) {
      sl(p, x, 2, 2, 8, k.a, k.wl, k.o);
    }
    sl(p, 0, 1, 3, 9, k.m, k.l, k.d);
    sl(p, 23, 1, 3, 9, k.m, k.l, k.d);
    p.p(1, 3, k.d);
    p.p(1, 7, k.d);
    p.p(24, 3, k.d);
    p.p(24, 7, k.d);
  }),
  net('net-signpost', [18, 36], (p, k) => {
    p.r(8, 3, 2, 30, k.d);
    p.r(8, 3, 1, 30, k.m);
    p.r(7, 0, 4, 3, k.m);
    p.r(8, 0, 2, 1, k.l);
    // base flare
    p.r(7, 31, 4, 1, k.d);
    p.r(6, 32, 6, 1, k.d);
    p.r(5, 33, 8, 1, k.m);
    sl(p, 4, 34, 10, 2, k.m, k.l, k.d);
    // three staggered blades: left, right, left
    sl(p, 0, 5, 8, 5, k.c, k.h, k.m);
    p.p(0, 5, k.i);
    p.r(0, 6, 1, 3, k.i);
    p.r(0, 7, 1, 1, k.c);
    sl(p, 10, 13, 8, 5, k.b, k.l, k.d);
    p.r(17, 14, 1, 3, k.i);
    p.r(17, 15, 1, 1, k.b);
    sl(p, 1, 21, 7, 5, k.a, k.wl, k.o);
    p.r(1, 22, 1, 3, k.i);
    p.r(1, 23, 1, 1, k.a);
    p.p(8, 7, k.o);
    p.p(10, 15, k.d);
    p.p(8, 23, k.o);
  }),
  net('net-rolodex', [18, 16], (p, k) => {
    // fanned cream cards behind the drum
    for (let n = 0; n < 6; n++) {
      p.r(3 + n * 2, 1 + (n % 2), 2, 5, k.c);
      p.p(3 + n * 2, 1 + (n % 2), n % 3 === 0 ? k.a : k.h);
    }
    p.disc(8, 8, 5, k.d);
    p.disc(8, 8, 3, k.m);
    p.p(8, 8, k.l);
    p.p(6, 6, k.l);
    // side crank
    p.r(13, 8, 3, 1, k.m);
    p.r(15, 6, 2, 5, k.a);
    // weighted base
    sl(p, 0, 12, 18, 4, k.m, k.l, k.d);
  }),
  net('net-milestone', [16, 20], (p, k) => {
    // rounded stone bollard
    p.r(4, 1, 8, 1, k.h);
    p.r(3, 2, 10, 1, k.l);
    sl(p, 2, 3, 12, 12, k.l, k.h, k.m);
    // riveted brass number plate
    sl(p, 4, 6, 8, 6, k.w, k.wl, k.o);
    p.p(5, 7, k.h);
    p.p(10, 7, k.h);
    p.p(5, 10, k.h);
    p.p(10, 10, k.h);
    p.r(6, 8, 4, 2, k.o);
    // plinth
    sl(p, 0, 15, 16, 5, k.m, k.l, k.d);
  }),
  net('net-parcel', [14, 12], (p, k) => {
    // wooden sorting tray
    sl(p, 0, 8, 14, 4, k.o, k.ol, k.d);
    p.r(2, 10, 10, 1, k.d);
    // twine-tied parcel
    sl(p, 2, 1, 10, 8, k.c, k.h, k.m);
    p.r(7, 1, 1, 8, k.o);
    p.r(2, 5, 10, 1, k.o);
    // wax seal over the cross
    p.disc(7, 5, 1, k.r);
    p.p(6, 4, k.a);
  }),
  net('net-cipher', [14, 10], (p, k) => {
    sl(p, 1, 1, 12, 7, k.w, k.wl, k.o);
    // three notched rings
    for (const x of [3, 6, 9]) {
      p.r(x, 0, 2, 9, k.wl);
      p.p(x, 3, k.o);
      p.p(x + 1, 5, k.o);
    }
    // cradle feet
    p.r(2, 8, 2, 2, k.d);
    p.r(10, 8, 2, 2, k.d);
  }),
];

const ANCHORS: EntityDef[] = [
  ent(
    'net-ixp',
    [[56, 42]],
    (p) => {
      p.r(0, 0, 56, 42, '#2a3358');
      p.r(1, 1, 54, 5, '#5b8ee6');
      p.r(1, 6, 52, 33, '#f3efe6');
      for (let k = 0; k < 4; k++) {
        p.r(4 + k * 12, 10, 9, 24, '#e2e6f0');
        p.r(5 + k * 12, 12, 7, 3, '#2a3358');
        p.r(5 + k * 12, 17, 7, 14, '#5b8ee6');
      }
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const k = Math.floor(t * 4) % 4;
        p.r(6 + k * 12, 13, 2, 1, '#59c08a');
      },
      noFlip: true,
    },
  ),
];

export const internet: LayerArt = {
  family: 'application',
  blurb: text('layers.internet.blurb'),
  palette: 'full',
  form: 'gui',
  cursor: 'arrow',
  stackTheme: {
    accent: '#7cd4ff',
    hi: '#ffffff',
    tint: 'rgba(124, 212, 255, 0.14)',
    border: 'rgba(124, 212, 255, 0.36)',
    anim: 'pulse',
    icon: [
      '  #####  ',
      ' # + # # ',
      '#  # #  #',
      '#########',
      '#  # #  #',
      '#########',
      '#  # #  #',
      ' # # + # ',
      '  #####  ',
    ],
  },
  topicTags: ['networking', 'security', 'graph'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'application', prefix: 'net', upTo: 20 }, density: 4.0, anchorCount: 2, far: 0.45 },
  open: 'top',
  fog: [165, 208, 245],
  background: (ctx, b, { T, entities }) => {
    vgrad(ctx, b, b.top, b.bottom + SEAM_H, [
      [0, '#cfefff'],
      [0.5, '#9ed4f5'],
      [1, '#b4e2f7'],
    ]);
    // Pastel fiber routing arcs across the sky
    prows(b, 0.3, 36, (y, i) => {
      if (hash(i * 7 + 2) < 0.45) return;
      const x = mod(hash(i * 7 + 3) * (b.w + 30) + T * 4, b.w + 30) - 15;
      fill(ctx, 0, y, b.w, 1, '#dfe6f6');
      fill(ctx, x, y, 6, 1, '#5b8ee6');
    });
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, cx, top, bot }) => {
      // Full-bleed stratosphere LEO constellation + twin flanking satellite dishes with radar sweeps + curved Earth horizon + ocean shimmer + 5 fiber arcs!
      for (let s = 0; s < 5; s++) {
        const sx = mod(hash(s * 19 + 3) * W + t * (4 + s * 1.5), W + 30) - 15;
        const sy = top + 14 + s * 13;
        rect(ctx, sx - 6, sy, 4, 2, '#7ab0e4');
        rect(ctx, sx + 4, sy, 4, 2, '#7ab0e4');
        rect(ctx, sx - 2, sy - 1, 5, 4, '#dfe6f6');
        if (Math.floor(t * 2 + s) % 2 === 0) px(ctx, sx, sy - 2, '#ffffff');
      }
      const base = bot;
      for (let x = 0; x < W; x += 2) {
        const dx = (x - cx) / Math.max(130, W * 0.58);
        const lh = Math.max(0, Math.round((1 - dx * dx) * 52));
        if (lh > 0) {
          rect(ctx, x, base - lh, 2, lh + 10, '#5a8cc8');
          rect(ctx, x, base - lh, 2, 2, '#c8e4fb');
          if (x % 22 === 0) rect(ctx, x, base - lh + 4, 1, Math.max(2, lh - 4), '#7aaae0');
        }
      }
      for (let k = 0; k < 5; k++) {
        const gx = mod(t * (10 + k * 3) + k * 73, W - 20) + 10;
        rect(ctx, gx, base - 8 - (k % 3) * 6, 10, 1, '#c8e4fb');
      }
      // Twin flanking ground-station satellite dishes with animated radar sweeps
      for (const [fx, dir] of [[0.09, 1], [0.91, -1]] as const) {
        const dx0 = R(W * fx);
        const dy0 = base - 20;
        rect(ctx, dx0 - 4, dy0, 8, 18, '#3d6cc4');
        line(ctx, dx0 - 10, dy0 - 6, dx0 + 10, dy0 - 12, '#dfe6f6');
        line(ctx, dx0 - 9, dy0 - 5, dx0 + 9, dy0 - 11, '#8fb8e8');
        line(ctx, dx0, dy0 - 9, dx0 + dir * 6, dy0 - 17, '#ffffff');
        const pulse = Math.floor(t * 3 + fx * 10) % 3;
        ring(ctx, dx0 + dir * 6, dy0 - 17, 4 + pulse * 4, '#b4dcf8');
      }
      const towers = [0.18, 0.38, 0.62, 0.82].map((f) => {
        const tx = R(W * f);
        const dx = (tx - cx) / Math.max(130, W * 0.58);
        const ty = base - Math.max(0, Math.round((1 - dx * dx) * 52));
        rect(ctx, tx - 2, ty - 14, 4, 14, '#3d6cc4');
        rect(ctx, tx - 5, ty - 10, 10, 1, '#7ab0e4');
        rect(ctx, tx - 1, ty - 17, 2, 3, Math.floor(t * 3 + tx) % 2 ? '#ffffff' : '#59c08a');
        return [tx, ty - 14] as const;
      });
      const links: [number, number, number][] = [
        [0, 1, 42],
        [1, 2, 58],
        [2, 3, 42],
        [0, 2, 78],
        [1, 3, 86],
      ];
      links.forEach(([a, bIdx, lift], k) => {
        const [x0, y0] = towers[a]!;
        const [x1, y1] = towers[bIdx]!;
        for (let s = 0; s <= 40; s++) {
          const q = s / 40;
          const x = x0 + (x1 - x0) * q;
          const y = y0 + (y1 - y0) * q - Math.sin(q * Math.PI) * lift;
          rect(ctx, x, y, 2, 1, k < 3 ? '#8fc4f0' : '#b4dcf8');
        }
        const pq = mod(t * (0.28 + k * 0.06) + k * 0.23, 1);
        const pxX = x0 + (x1 - x0) * pq;
        const pxY = y0 + (y1 - y0) * pq - Math.sin(pq * Math.PI) * lift;
        rect(ctx, pxX - 2, pxY - 1, 5, 2, '#ffffff');
      });
      // Thick undersea fiber-optic trunk plunging from the curved horizon down into the Browser seam
      rect(ctx, cx - 7, base - 26, 14, 34, '#2a4f96');
      rect(ctx, cx - 5, base - 26, 10, 34, '#3d6cc4');
      rect(ctx, cx - 2, base - 26, 4, 34, '#8fc4f0');
      for (let fy = base - 22; fy < base + 6; fy += 8) {
        rect(ctx, cx - 8, fy, 16, 2, '#dfe6f6');
      }
      const trunkPulse = base - 24 + Math.floor(mod(t * 28, 30));
      rect(ctx, cx - 2, trunkPulse, 4, 5, '#ffffff');
    },
  },
  critters: {
    motions: [MotionType.Fly, MotionType.Perch],
    count: 3,
    exitLabels: variants('layers.internet.exit'),
    draw: ({ px, dir, perched }) => {
      // Crisp white paper-plane packet swallow with trailing cyan packet dot
      px(0, 1, 6, 4, '#ffffff');
      px(dir > 0 ? 1 : 0, 0, 4, 2, '#dfe6f6');
      px(dir > 0 ? 4 : 0, 2, 2, 2, '#5b8ee6');
      px(dir > 0 ? 1 : 4, 5, 2, 1, '#c8d6f0');
      if (!perched) px(dir > 0 ? -3 : 8, 3, 2, 1, '#5fd3e0');
    },
    alt: {
      motions: [MotionType.Float], // drone: hovers in place
      draw: ({ px, tick }) => {
        px(0, 2, 6, 4, '#ffffff');
        px(0, 0, 2, 2, '#5b8ee6');
        px(4, 0, 2, 2, '#5b8ee6');
        px(2, 4, 2, 1, tick ? '#e6a23c' : '#59c08a');
      },
    },
  },
  sound: {
    timbre: { wave: 'triangle', filterHz: 5200, q: 0.8, gainScale: 1.0, reverbWet: 0.24 },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
    critterCall: application.sound.critterCall,
  },
};
