/** Layer `me-minix-kern`: The message-passing microkernel deep inside the management core. */
import { prows, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import type { EntityDef } from '../render/v4/kit';
import { kernel } from './kernel';
import { meMinixUser } from './me-minix-user';
import { R, TAU, disc, fill, frame, line, mod, px, rect, ring } from './shared/draw-kit';
import { amb, sl } from './shared/endless-props';
import type { LayerArt } from './types';

const PROPS: EntityDef[] = [
  amb('mk-pneumatic', [20, 34], (p, k) => {
    sl(p, 3, 28, 14, 6, k.d, k.m, k.i);
    p.r(8, 4, 4, 24, k.m);
    p.r(8, 4, 1, 24, k.l);
    sl(p, 4, 2, 12, 3, k.m, k.l, k.d);
    for (const x of [1, 14]) {
      sl(p, x, 5, 5, 23, k.d, k.m, k.i);
      p.r(x + 1, 8, 3, 16, k.i);
    }
    p.r(2, 14, 3, 6, k.l);
    p.r(2, 14, 3, 1, k.h);
  }),
  amb('mk-watchdog', [18, 20], (p, k) => {
    sl(p, 3, 10, 12, 10, k.d, k.m, k.i);
    p.r(7, 0, 4, 1, k.l);
    p.r(5, 1, 8, 2, k.m);
    p.r(4, 3, 10, 3, k.m);
    p.r(3, 6, 12, 3, k.m);
    p.r(5, 2, 1, 5, k.l);
    p.r(16, 3, 2, 5, k.l);
    p.r(15, 2, 3, 2, k.l);
    p.r(16, 12, 2, 1, k.l);
    p.r(17, 11, 1, 3, k.l);
  }),
  amb('mk-annunciator', [12, 10], (p, k) => {
    sl(p, 0, 0, 12, 10, k.d, k.m, k.i);
    p.r(2, 2, 8, 6, k.i);
    p.disc(6, 4, 2, k.l);
    p.r(3, 6, 6, 2, k.m);
    p.r(2, 5, 8, 1, k.l);
  }),
  amb('mk-grantkey', [10, 12], (p, k) => {
    sl(p, 0, 8, 10, 4, k.d, k.m, k.i);
    p.r(3, 0, 4, 1, k.l);
    p.r(2, 1, 6, 1, k.l);
    p.r(1, 2, 8, 4, k.l);
    p.r(2, 6, 6, 1, k.m);
    p.r(3, 7, 4, 1, k.d);
    p.r(4, 3, 2, 2, k.i);
    p.r(4, 5, 2, 1, k.i);
  }),
  amb('mk-sandbox', [18, 20], (p, k) => {
    sl(p, 0, 16, 18, 4, k.d, k.m, k.i);
    p.r(5, 2, 8, 1, k.m);
    p.r(3, 3, 12, 1, k.m);
    p.r(2, 4, 1, 12, k.m);
    p.r(15, 4, 1, 12, k.m);
    p.r(3, 4, 12, 12, k.i);
    p.disc(9, 11, 3, k.l);
    p.disc(9, 11, 1, k.i);
    p.disc(5, 13, 1, k.m);
  }),
  amb('mk-ringbuffer', [20, 16], (p, k) => {
    sl(p, 3, 11, 14, 5, k.d, k.m, k.i);
    p.r(9, 2, 2, 5, k.l);
    sl(p, 1, 6, 18, 5, k.m, k.l, k.d);
    for (const x of [2, 5, 8, 11, 14]) p.r(x, 7, 2, 3, k.i);
    p.r(8, 7, 3, 3, k.l);
  }),
  amb('mk-endpoint', [10, 12], (p, k) => {
    sl(p, 1, 1, 8, 9, k.d, k.m, k.i);
    p.r(2, 10, 2, 2, k.d);
    p.r(6, 10, 2, 2, k.d);
    p.disc(5, 4, 2, k.l);
    p.disc(5, 4, 1, k.i);
    p.r(4, 6, 2, 6, k.m);
    p.p(4, 8, k.d);
    p.p(5, 10, k.d);
  }),
  amb('mk-schedwheel', [14, 14], (p, k) => {
    p.l(7, 8, 2, 13, k.d);
    p.l(7, 8, 12, 13, k.d);
    p.disc(7, 7, 4, k.m);
    p.disc(7, 7, 1, k.i);
    for (let n = 0; n < 8; n++) {
      const a = (n * Math.PI) / 4;
      p.p(7 + Math.round(Math.cos(a) * 5), 7 + Math.round(Math.sin(a) * 5), k.l);
    }
    p.r(6, 0, 3, 2, k.l);
  }),
];

const ANCHORS: EntityDef[] = [
  amb('mk-microkern', [48, 38], (p, k) => {
    // message-switching rotunda: central kernel plinth under a dome, four isolated booths linked by pneumatic tubes
    sl(p, 0, 32, 48, 6, k.d, k.m, k.i);
    p.r(19, 5, 10, 1, k.l);
    p.r(16, 6, 16, 1, k.m);
    p.r(14, 7, 20, 2, k.m);
    p.r(13, 9, 22, 1, k.m);
    sl(p, 13, 10, 22, 22, k.m, k.l, k.d);
    p.r(21, 18, 6, 14, k.i);
    p.r(22, 26, 4, 6, k.l);
    p.r(22, 26, 4, 1, k.h);
    for (const x of [0, 7, 35, 42]) {
      sl(p, x, 24, 6, 8, k.d, k.m, k.i);
      p.r(x, 22, 6, 2, k.l);
      p.r(x + 2, 27, 2, 5, k.i);
      p.r(x + 2, 19, 2, 3, k.w);
    }
    p.r(2, 19, 11, 1, k.w);
    p.r(35, 19, 11, 1, k.w);
    p.r(9, 19, 1, 3, k.w);
    p.r(38, 19, 1, 3, k.w);
  }),
];

export const meMinixKern: LayerArt = {
  family: 'kernel',
  blurb: 'The message-passing microkernel deep inside the management core',
  palette: 'amber',
  form: 'serial',
  cursor: 'underscore',
  stackTheme: {
    accent: '#e08820',
    hi: '#ffd878',
    tint: 'rgba(224, 136, 32, 0.14)',
    border: 'rgba(224, 136, 32, 0.38)',
    anim: 'tick',
    icon: kernel.stackTheme.icon,
  },
  topicTags: ['os', 'hardware', 'security'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'firmware', prefix: 'mk', upTo: 20 }, density: 3.6, anchorCount: 2, far: 0.25 },
  fog: [10, 5, 0],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000000');
    prows(b, 0.5, 20, (y) => fill(ctx, 0, y, b.w, 1, '#555555'));
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, cx, cy, H }) => {
      // Full-bleed Radial IPC Star-Hub: chunky pneumatic ring-switch hub + 12 satellite servers with distinct tiny server icons (disk, clock, net, tty)!
      disc(ctx, cx, cy, 32, '#000000');
      ring(ctx, cx, cy, 32, '#aaaaaa');
      ring(ctx, cx, cy, 30, '#555555');
      ring(ctx, cx, cy, 24, '#ffffff');
      ring(ctx, cx, cy, 22, '#aaaaaa');
      disc(ctx, cx, cy, 10, '#555555');
      ring(ctx, cx, cy, 10, '#ffffff');
      disc(ctx, cx, cy, 4, '#ffffff');
      const rx = Math.min(W * 0.44, 145);
      const ry = Math.min(H * 0.42, 74);
      for (let k = 0; k < 12; k++) {
        const a = (k * TAU) / 12;
        const ex = R(cx + Math.cos(a) * rx);
        const ey = R(cy + Math.sin(a) * ry);
        line(ctx, cx + Math.cos(a) * 32, cy + Math.sin(a) * 32, ex, ey, '#555555');
        rect(ctx, ex - 7, ey - 7, 14, 14, '#000000');
        frame(ctx, ex - 7, ey - 7, 14, 14, '#aaaaaa');
        // Distinct tiny server glyph per satellite: disk (0), clock (1), net (2), tty (3)
        const kind = k % 4;
        if (kind === 0) {
          // Disk platter
          disc(ctx, ex, ey, 4, '#555555');
          ring(ctx, ex, ey, 4, '#ffffff');
          px(ctx, ex, ey, '#ffffff');
        } else if (kind === 1) {
          // Clock face + hands
          ring(ctx, ex, ey, 4, '#aaaaaa');
          rect(ctx, ex, ey - 3, 1, 3, '#ffffff');
          rect(ctx, ex, ey, 3, 1, '#ffffff');
        } else if (kind === 2) {
          // Net packet diamonds
          rect(ctx, ex - 4, ey, 9, 1, '#aaaaaa');
          rect(ctx, ex - 2, ey - 2, 5, 5, '#ffffff');
          rect(ctx, ex - 1, ey - 1, 3, 3, '#000000');
        } else {
          // TTY prompt `>_`
          line(ctx, ex - 4, ey - 2, ex - 1, ey, '#ffffff');
          line(ctx, ex - 4, ey + 2, ex - 1, ey, '#ffffff');
          rect(ctx, ex + 1, ey + 2, 3, 1, '#aaaaaa');
        }
        const q = mod(t * (0.45 + (k % 3) * 0.12) + k * 0.09, 1);
        rect(ctx, cx + Math.cos(a) * (32 + q * (rx - 36)) - 1, cy + Math.sin(a) * (32 + q * (ry - 36)) - 1, 3, 3, '#ffffff');
      }
    },
    detail: ({ ctx, t, cx, cy }) => {
      const a = t * 1.4;
      rect(ctx, cx + Math.cos(a) * 36 - 2, cy + Math.sin(a) * 36 - 2, 4, 4, '#ffffff');
      rect(ctx, cx + Math.cos(a + Math.PI) * 36 - 2, cy + Math.sin(a + Math.PI) * 36 - 2, 4, 4, '#aaaaaa');
    },
  },
  critters: {
    motions: [MotionType.Zip],
    count: 3,
    exitLabels: ['SENDREC', 'blocked'],
    draw: ({ px, ink, t, phase, dir, perched }) => {
      // Mechanical courier bug: a plated body, two dark eyes, a small message pouch strapped on.
      const leg = perched ? 0 : Math.floor(t * 8 + phase) % 2;
      px(1, 0, 4, 1, '#ffffff');
      px(0, 1, 6, 5, '#aaaaaa');
      px(1, 2, 1, 1, ink);
      px(4, 2, 1, 1, ink);
      px(dir > 0 ? -2 : 6, 3, 2, 3, '#ffffff');
      px(dir > 0 ? -1 : 6, 2, 1, 1, '#555555');
      px(leg, 6, 1, 1, '#555555');
      px(5 - leg, 6, 1, 1, '#555555');
    },
  },
  sound: {
    timbre: { wave: 'pulse12', filterHz: 3400, q: 2.6, gainScale: 0.78, reverbWet: 0.08, short: true },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
    critterCall: meMinixUser.sound.critterCall,
  },
};
