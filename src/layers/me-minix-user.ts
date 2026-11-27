/** Layer `me-minix-user`: A tiny hidden MINIX 3 userspace running even when your PC is off. */
import { hash, prows, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef } from '../render/v4/kit';
import { R, fill, frame, mod, rect } from './shared/draw-kit';
import { amb, sl } from './shared/endless-props';
import type { LayerArt } from './types';
import { userspace } from './userspace';

const PROPS: EntityDef[] = [
  amb('mx-amt-intercom', [12, 12], (p, k) => {
    sl(p, 1, 3, 10, 8, k.m, k.l, k.d);
    p.r(2, 11, 2, 1, k.d);
    p.r(8, 11, 2, 1, k.d);
    p.r(3, 5, 4, 4, k.i);
    p.p(4, 6, k.l);
    p.p(6, 6, k.l);
    p.p(4, 8, k.l);
    p.p(6, 8, k.l);
    p.r(5, 1, 3, 2, k.l);
    p.r(9, 6, 1, 2, k.l);
  }),
  amb('mx-rs-starter', [20, 20], (p, k) => {
    sl(p, 0, 9, 20, 9, k.m, k.l, k.d);
    p.r(0, 18, 20, 2, k.d);
    // twin jumper-clamp electrodes and a side hand-crank
    for (const x of [4, 13]) {
      p.r(x, 2, 2, 7, k.l);
      p.r(x - 1, 1, 4, 2, k.m);
    }
    p.r(8, 12, 4, 3, k.d);
    p.r(15, 12, 3, 1, k.l);
    p.r(17, 10, 1, 4, k.l);
  }),
  amb('mx-httpd-dispenser', [12, 12], (p, k) => {
    sl(p, 1, 1, 10, 7, k.m, k.l, k.d);
    p.r(2, 8, 2, 2, k.d);
    p.r(8, 8, 2, 2, k.d);
    p.r(3, 6, 6, 1, k.i);
    p.r(4, 7, 4, 4, k.l);
    p.p(5, 9, k.d);
    p.p(6, 3, k.l);
  }),
  amb('mx-tcp-manifold', [32, 28], (p, k) => {
    sl(p, 2, 24, 28, 4, k.d, k.m, k.i);
    sl(p, 2, 16, 28, 6, k.m, k.l, k.d);
    p.r(13, 8, 6, 9, k.m);
    p.r(13, 8, 1, 9, k.l);
    p.disc(16, 5, 5, k.l);
    p.disc(16, 5, 3, k.d);
    p.l(16, 5, 18, 3, k.l);
    // two braided hoses
    for (let n = 0; n < 8; n++) {
      p.p(1 - (n > 5 ? 1 : 0) + (n < 2 ? 1 : 0), 16 - n, n % 2 ? k.d : k.l);
      p.p(30 + (n > 5 ? 1 : 0) - (n < 2 ? 1 : 0), 16 - n, n % 2 ? k.d : k.l);
    }
    p.r(1, 8, 2, 1, k.l);
    p.r(29, 8, 2, 1, k.l);
  }),
  amb('mx-pm-timeclock', [14, 26], (p, k) => {
    sl(p, 2, 22, 10, 4, k.d, k.m, k.i);
    sl(p, 1, 4, 12, 18, k.m, k.l, k.d);
    p.r(5, 0, 4, 5, k.l);
    p.r(3, 4, 8, 1, k.i);
    p.disc(7, 11, 3, k.l);
    p.disc(7, 11, 2, k.i);
    p.l(7, 11, 7, 9, k.l);
    p.r(12, 14, 2, 5, k.d);
  }),
  amb('mx-vfs-rolodex', [14, 12], (p, k) => {
    p.l(7, 8, 2, 11, k.d);
    p.l(7, 8, 12, 11, k.d);
    for (let n = 0; n < 5; n++) p.r(3 + n * 2, 1, 2, 3, n % 2 ? k.l : k.m);
    p.disc(7, 6, 3, k.d);
    p.disc(7, 6, 1, k.l);
    p.r(11, 5, 2, 2, k.l);
  }),
  amb('mx-ipc-capsule', [16, 24], (p, k) => {
    sl(p, 3, 21, 10, 3, k.d, k.m, k.i);
    p.r(6, 0, 4, 4, k.d);
    sl(p, 2, 4, 12, 17, k.m, k.l, k.d);
    p.r(4, 6, 8, 11, k.i);
    p.r(5, 8, 6, 6, k.l);
    p.r(5, 8, 6, 1, k.h);
    p.r(13, 6, 2, 11, k.d);
  }),
  amb('mx-watchdog-clock', [12, 14], (p, k) => {
    sl(p, 2, 11, 8, 3, k.d, k.m, k.i);
    sl(p, 1, 1, 10, 10, k.m, k.l, k.d);
    p.disc(6, 6, 3, k.i);
    p.ring(6, 6, 3, k.l);
    p.p(6, 3, k.l);
    p.p(6, 9, k.l);
    p.p(3, 6, k.l);
    p.p(9, 6, k.l);
    p.l(6, 6, 8, 4, k.l);
  }),
];

const ANCHORS: EntityDef[] = [
  ent('mx-bottle', [[46, 44]], (p) => {
    p.frame(4, 6, 38, 38, '#ffffff');
    p.r(15, 0, 16, 6, '#aaaaaa');
    p.r(8, 22, 8, 20, '#555555');
    p.r(18, 14, 10, 28, '#aaaaaa');
    p.r(30, 26, 8, 16, '#555555');
    for (let y = 17; y < 38; y += 4) p.r(20, y, 2, 2, '#ffffff');
  }),
];

export const meMinixUser: LayerArt = {
  family: 'userspace',
  blurb: 'A tiny hidden MINIX 3 userspace running even when your PC is off',
  palette: 'amber',
  form: 'shell',
  cursor: 'block',
  stackTheme: {
    accent: '#f0a830',
    hi: '#ffe090',
    tint: 'rgba(240, 168, 48, 0.14)',
    border: 'rgba(240, 168, 48, 0.38)',
    anim: 'blink',
    icon: userspace.stackTheme.icon,
  },
  topicTags: ['os', 'security', 'networking'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'userspace', prefix: 'mx', upTo: 20 }, density: 3.8, anchorCount: 2, far: 0.3 },
  fog: [10, 5, 0],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000000');
    prows(b, 0.2, 16, (y, i) => {
      if (hash(i * 5) > 0.22) return;
      fill(ctx, hash(i * 5 + 1) * b.w, y, 1, 1, '#aaaaaa');
    });
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, cx, cy, H }) => {
      // Full-bleed Miniature City-in-a-Chip + tiny amber antenna spire & miniature monorail inside the chip cavity!
      const cw = Math.min(220, W - 44);
      const ch = Math.min(120, H - 36);
      const rx = cx - R(cw / 2);
      const ry = cy - R(ch / 2);
      for (let y = ry + 10; y < ry + ch - 8; y += 10) {
        rect(ctx, 0, y, rx, 2, '#555555');
        rect(ctx, rx + cw, y, W - (rx + cw), 2, '#555555');
      }
      for (let x = rx + 8; x < rx + cw - 6; x += 8) {
        rect(ctx, x, ry - 10, 3, 10, '#555555');
        rect(ctx, x, ry + ch, 3, 10, '#555555');
      }
      rect(ctx, rx, ry, cw, ch, '#000000');
      frame(ctx, rx, ry, cw, ch, '#aaaaaa');
      frame(ctx, rx + 4, ry + 4, cw - 8, ch - 8, '#555555');
      const base = ry + ch - 8;
      for (let x = rx + 10; x < rx + cw - 14; x += 9) {
        const th = 16 + Math.floor(hash(x * 19 + 5) * (ch - 36));
        rect(ctx, x, base - th, 7, th, '#555555');
        rect(ctx, x, base - th, 7, 1, '#aaaaaa');
        if (hash(x * 7) > 0.35) rect(ctx, x + 2, base - th + 4, 2, 2, '#ffffff');
        if (hash(x * 13) > 0.5) rect(ctx, x + 2, base - th + 10, 2, 2, '#aaaaaa');
      }
      // Central miniature PID-1 amber antenna spire inside the chip cavity
      rect(ctx, cx - 6, base - (ch - 26), 12, ch - 26, '#555555');
      rect(ctx, cx - 6, base - (ch - 26), 12, 2, '#aaaaaa');
      rect(ctx, cx - 1, ry + 10, 2, 16, '#aaaaaa');
      if (Math.floor(t * 2) % 2 === 0) rect(ctx, cx - 2, ry + 8, 4, 3, '#ffffff');
      // Miniature elevated monorail zipping across the chip's tiny skyline
      const mRailY = base - 14;
      rect(ctx, rx + 8, mRailY, cw - 16, 1, '#aaaaaa');
      const mTrainX = rx + 10 + Math.floor(mod(t * 26, Math.max(20, cw - 34)));
      rect(ctx, mTrainX, mRailY - 3, 12, 3, '#ffffff');
    },
    detail: ({ ctx, t, W, bot }) => {
      // Scrolling dot-matrix ticker across the bottom of the chip cavity.
      const off = Math.floor(t * 8) % 6;
      for (let x = 24 - off; x < W - 24; x += 6) if (hash(x + off * 0) > 0.4) rect(ctx, x, bot - 8, 3, 3, '#aaaaaa');
    },
  },
  critters: {
    motions: [MotionType.Patrol, MotionType.Perch],
    count: 4,
    exitLabels: ['AMT idle', 'IPC wait'],
    draw: ({ px, ink, t, phase, perched }) => {
      // Miniature uncanny amber micro-daemon
      const step = perched ? 0 : Math.floor(t * 8 + phase) % 2;
      px(0, -1, 1, 2, '#ffffff');
      px(5, -1, 1, 2, '#ffffff');
      px(0, 0, 6, 5, '#aaaaaa');
      px(1, 2, 1, 1, ink);
      px(4, 2, 1, 1, ink);
      px(1 + step, 5, 1, 1, '#555555');
      px(4 - step, 5, 1, 1, '#555555');
    },
  },
  sound: {
    timbre: { wave: 'pulse12', filterHz: 3400, q: 2.6, gainScale: 0.78, reverbWet: 0.08, short: true },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
    critterCall: (snd, t, p) => {
      snd.voice({ freq: 920 + Math.random() * 240, toFreq: 680, at: t, dur: 0.04, wave: 'pulse12', gain: 0.17, pan: p, crush: true });
    },
  },
};
