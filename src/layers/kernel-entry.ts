/** Layer `kernel-entry`: The syscall gate, seccomp checks and VFS facade into Ring 0. */
import { tiled, vgrad, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import type { EntityDef } from '../render/v4/kit';
import { kernel } from './kernel';
import { KWALL, R, frame, line, mod, px, rect } from './shared/draw-kit';
import { cga, sl } from './shared/endless-props';
import type { LayerArt } from './types';

const PROPS: EntityDef[] = [
  cga('ke-seccomp', [16, 20], (p, k) => {
    // coin-sorter: hopper, brass box, stepped sieve plates behind a front cutout
    p.r(1, 1, 14, 1, k.wl);
    p.r(2, 2, 12, 1, k.w);
    p.r(3, 3, 10, 1, k.w);
    p.r(4, 4, 8, 2, k.w);
    sl(p, 2, 6, 12, 12, k.w, k.wl, k.d);
    p.r(4, 8, 8, 8, k.i);
    p.r(4, 9, 4, 1, k.l);
    p.r(6, 11, 4, 1, k.l);
    p.r(8, 13, 4, 1, k.l);
    p.r(3, 18, 2, 2, k.d);
    p.r(11, 18, 2, 2, k.d);
  }),
  cga('ke-uaccess', [34, 22], (p, k) => {
    // customs counter on a plinth, glowing pass-through tray, inspection lamp
    sl(p, 0, 7, 34, 4, k.m, k.l, k.d);
    sl(p, 1, 11, 32, 8, k.m, k.l, k.d);
    sl(p, 0, 19, 34, 3, k.d, k.m, k.i);
    p.r(11, 12, 12, 6, k.i);
    p.r(12, 14, 10, 3, k.wl);
    p.r(12, 17, 10, 1, k.w);
    p.r(3, 2, 2, 5, k.d);
    p.disc(4, 2, 2, k.a);
    p.p(3, 1, k.h);
  }),
  cga('ke-ptrace', [14, 26], (p, k) => {
    // brass periscope on a tripod, mirror hood on top, eyepiece below
    p.l(7, 18, 1, 25, k.d);
    p.l(7, 18, 13, 25, k.d);
    p.r(6, 18, 2, 8, k.d);
    sl(p, 6, 5, 3, 13, k.w, k.wl, k.d);
    sl(p, 3, 1, 9, 5, k.w, k.wl, k.d);
    p.r(4, 2, 4, 2, k.b);
    p.r(4, 15, 5, 3, k.d);
    p.r(5, 16, 3, 1, k.i);
  }),
  cga('ke-cred', [12, 14], (p, k) => {
    p.r(5, 0, 2, 2, k.d);
    p.ring(6, 5, 3, k.wl);
    p.r(3, 5, 1, 1, k.wl);
    for (const [x, n] of [[4, 0], [6, 1], [8, 2]] as const) {
      p.r(x, 8, 1, 5, k.l);
      p.r(x + 1, 10 + n, 1, 1, k.l);
      p.r(x + 1, 12, 1, 1, k.m);
    }
  }),
  cga('ke-fdtable', [10, 14], (p, k) => {
    sl(p, 1, 0, 8, 9, k.d, k.m, k.i);
    p.r(1, 0, 1, 1, k.i);
    p.r(8, 0, 1, 1, k.i);
    p.r(2, 8, 6, 1, k.i);
    // ticket stub sticking out of the bottom slot
    p.r(3, 8, 4, 6, k.c);
    p.r(3, 8, 4, 1, k.m);
    p.r(4, 11, 2, 1, k.r);
  }),
  cga('ke-vdso', [24, 12], (p, k) => {
    // curved brass pneumatic tube on two brackets, glass chamber in the middle
    p.r(0, 5, 1, 3, k.w);
    p.r(1, 4, 22, 5, k.w);
    p.r(1, 4, 22, 1, k.wl);
    p.r(23, 5, 1, 3, k.w);
    p.r(8, 2, 8, 8, k.d);
    p.r(9, 3, 6, 6, k.b);
    p.r(10, 4, 4, 4, k.wl);
    p.r(4, 9, 2, 3, k.d);
    p.r(19, 9, 2, 3, k.d);
  }),
  cga('ke-vfs-mount', [14, 14], (p, k) => {
    p.r(6, 1, 2, 11, k.d);
    p.r(6, 1, 1, 11, k.m);
    sl(p, 3, 12, 8, 2, k.m, k.l, k.d);
    sl(p, 7, 2, 7, 3, k.m, k.l, k.d);
    p.p(8, 3, k.i);
    sl(p, 0, 6, 7, 3, k.m, k.l, k.d);
    p.p(5, 7, k.i);
  }),
  cga('ke-ioctl', [14, 10], (p, k) => {
    sl(p, 0, 5, 14, 4, k.d, k.m, k.i);
    p.r(0, 9, 14, 1, k.m);
    for (const x of [2, 6, 10]) {
      p.r(x, 3, 2, 2, k.m);
      p.r(x - 1, 1, 4, 1, k.wl);
      p.r(x, 2, 2, 1, k.w);
      p.r(x, 0, 2, 1, k.wl);
    }
  }),
];

const ANCHORS: EntityDef[] = [
  cga('ke-gatehouse', [52, 42], (p, k) => {
    // symmetric stone gatehouse: crenellated towers, lintel, iron portcullis with a brass padlock
    for (const x of [0, 40]) {
      sl(p, x, 4, 12, 38, k.m, k.l, k.d);
      for (let y = 9; y < 40; y += 6) p.r(x + 1, y, 10, 1, k.d);
      p.r(x + 4, 14, 3, 5, k.i);
      p.r(x + 4, 26, 3, 5, k.i);
    }
    for (const x of [0, 4, 8]) {
      p.r(x, 0, 3, 4, k.m);
      p.r(x, 0, 3, 1, k.l);
      p.r(49 - x - 2, 0, 3, 4, k.m);
      p.r(49 - x - 2, 0, 3, 1, k.l);
    }
    sl(p, 12, 4, 28, 6, k.m, k.l, k.d);
    p.r(12, 10, 28, 32, k.i);
    for (let n = 0; n < 7; n++) p.r(14 + n * 4, 10, 2, 29, k.d);
    for (let n = 0; n < 7; n++) p.r(14 + n * 4, 10, 1, 29, k.m);
    p.r(12, 21, 28, 3, k.d);
    p.r(12, 21, 28, 1, k.m);
    for (let n = 0; n < 7; n++) p.r(14 + n * 4, 39, 2, 2, k.l);
    // brass padlock on the crossbar
    p.r(24, 17, 1, 5, k.l);
    p.r(27, 17, 1, 5, k.l);
    p.r(25, 16, 2, 1, k.l);
    sl(p, 23, 22, 6, 6, k.w, k.wl, k.d);
    p.r(25, 24, 2, 2, k.i);
    p.r(0, 41, 52, 1, k.d);
  }),
];

export const kernelEntry: LayerArt = {
  family: 'kernel',
  blurb: 'The syscall gate, seccomp checks and VFS facade into Ring 0',
  palette: 'cga16',
  form: 'serial',
  cursor: 'underscore',
  stackTheme: kernel.stackTheme,
  topicTags: ['os', 'security', 'hardware'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'kernel', prefix: 'ke', upTo: 20 }, density: 4.2, anchorCount: 2, far: 0.4 },
  fog: [0, 16, 28],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    tiled(ctx, KWALL(), 0, y0, b.w, y1 - y0, 0, R(b.top * 0.5));
    vgrad(ctx, b, b.top, b.top + 60, [
      [0, 'rgba(85,255,255,0.28)'],
      [1, 'rgba(85,255,255,0)'],
    ]);
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, cx, top, bot, cy, H }) => {
      // Full-bleed Syscall Containment Dam: full-width riveted bulkhead, flanking pressure towers, central sluice gate with animated clearance scanner!
      const wallY = cy - 36;
      rect(ctx, 0, wallY, W, 72, '#555555');
      rect(ctx, 0, wallY, W, 2, '#aaaaaa');
      rect(ctx, 0, wallY + 70, W, 2, '#000000');
      // Vertical containment buttresses spanning entire band height
      for (let x = 16; x < W; x += 48) {
        rect(ctx, x, top, 8, H, '#555555');
        rect(ctx, x, top, 1, H, '#aaaaaa');
        for (let ry = top + 8; ry < bot - 8; ry += 14) px(ctx, x + 4, ry, '#000000');
      }
      // Central glowing syscall sluice gate with chunky striped blast-gate portcullis teeth
      rect(ctx, cx - 34, wallY + 4, 68, 64, '#000000');
      frame(ctx, cx - 34, wallY + 4, 68, 64, '#55ffff');
      for (let y = wallY + 10; y < wallY + 64; y += 6) rect(ctx, cx - 30, y, 60, 1, '#00aaaa');
      // Partially raised heavy portcullis teeth + hazard header beam inside the sluice
      const gateLift = 18 + R(Math.sin(t * 0.7) * 4);
      rect(ctx, cx - 32, wallY + 6, 64, gateLift, '#555555');
      for (let sx = cx - 30; sx < cx + 28; sx += 8) {
        rect(ctx, sx, wallY + 6, 4, 4, '#ffff55');
        rect(ctx, sx + 1, wallY + 6 + gateLift, 3, 7, '#aaaaaa');
        rect(ctx, sx + 2, wallY + 13 + gateLift, 1, 3, '#ffffff');
      }
      // Animated cyan clearance scanner bar inside the sluice gate
      const scanY = wallY + 8 + Math.floor(mod(t * 22, 54));
      rect(ctx, cx - 30, scanY, 60, 2, '#55ffff');
      // Flanking pressure gauges
      for (const gx of [cx - 56, cx + 48]) {
        rect(ctx, gx, wallY + 8, 8, 56, '#000000');
        const fill = 14 + Math.floor((Math.sin(t * 1.6 + gx) * 0.5 + 0.5) * 38);
        rect(ctx, gx + 1, wallY + 63 - fill, 6, fill, '#55ffff');
      }
    },
    detail: ({ ctx, t, W, top }) => {
      for (const sx of [24, W - 32]) {
        const on = Math.floor(t * 2) % 2 === 0;
        rect(ctx, sx, top + 10, 8, 6, on ? '#ffff55' : '#aa5500');
        const sa = Math.sin(t * 1.2 + sx) * 14;
        line(ctx, sx + 4, top + 16, sx + 4 + sa, top + 70, on ? '#00aaaa' : '#005555');
      }
    },
  },
  critters: {
    motions: [MotionType.Patrol, MotionType.Perch],
    count: 3,
    exitLabels: ['EACCES', 'trapped'],
    draw: ({ px, ink, t, phase, perched }) => {
      // Gatekeeper beetle: a cyan shell with a brass key-crest, a grey head with two dark eyes.
      const leg = perched ? 0 : Math.floor(t * 9 + phase) % 2;
      px(1, 0, 5, 2, '#aaaaaa');
      px(2, 1, 1, 1, ink);
      px(4, 1, 1, 1, ink);
      px(0, 2, 7, 4, '#55ffff');
      px(3, 3, 1, 3, '#ffff55');
      px(2, 3, 3, 1, '#ffff55');
      px(leg, 6, 1, 1, '#555555');
      px(6 - leg, 6, 1, 1, '#555555');
    },
    alt: {
      motions: [MotionType.Hop, MotionType.Perch], // padlock: mostly sits on props
      draw: ({ px, ink, dir, tick }) => {
        // Hooded courier: a robed 6x6 with a pale face window and a tiny wax-sealed scroll under one arm.
        px(2, 0, 2, 1, '#ff55ff');
        px(1, 1, 4, 1, '#ff55ff');
        px(0, 2, 6, 4, '#aa00aa');
        px(1, 2, 4, 2, '#ffffaa');
        px(2, 3, 1, 1, ink);
        px(4, 3, 1, 1, ink);
        px(dir > 0 ? 6 : -3, 3, 3, 2, '#ffffff');
        px(dir > 0 ? 8 : -3, 3, 1, 2, '#ff5555');
        px(tick ? 1 : 3, 6, 1, 1, '#555555');
      },
    },
  },
  sound: {
    timbre: { wave: 'pulse12', filterHz: 2800, q: 2.0, gainScale: 0.86, reverbWet: 0.16 },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
    critterCall: kernel.sound.critterCall,
  },
};
