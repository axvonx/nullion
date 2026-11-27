/** Layer `vmm`: Virtual device models pretending to be disks, NICs and consoles. */
import { prows, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef } from '../render/v4/kit';
import { ringMinus1 } from './ring-1';
import { R, fill, frame, line, rect } from './shared/draw-kit';
import { grn, sl } from './shared/endless-props';
import type { LayerArt } from './types';

const PROPS: EntityDef[] = [
  ent('vmm-ghostcard', [[22, 12]], (p) => {
    p.frame(0, 0, 22, 9, '#aaaaaa');
    p.frame(3, 2, 8, 5, '#555555');
    for (let x = 2; x < 20; x += 3) p.r(x, 9, 1, 3, '#aaaaaa');
  }),
  grn('vmm-balloon', [16, 24], (p, k) => {
    p.r(4, 0, 8, 2, k.m);
    p.r(7, 2, 2, 3, k.m);
    for (let y = 5; y < 15; y += 2) {
      p.r(3 + (y % 4 ? 0 : 1), y, 10 - (y % 4 ? 0 : 2), 1, k.m);
      p.r(2, y + 1, 12, 1, k.d);
    }
    sl(p, 2, 15, 12, 5, k.d, k.m, k.i);
    p.disc(8, 17, 2, k.l);
    p.p(8, 17, k.i);
    sl(p, 0, 21, 16, 3, k.d, k.m, k.i);
  }),
  grn('vmm-virtio', [34, 20], (p, k) => {
    // twin-roller conveyor bench, notched belt, two crates riding on top
    sl(p, 1, 12, 32, 3, k.m, k.l, k.d);
    p.r(2, 15, 3, 5, k.d);
    p.r(29, 15, 3, 5, k.d);
    p.r(16, 15, 3, 5, k.d);
    p.disc(5, 8, 4, k.d);
    p.disc(28, 8, 4, k.d);
    p.disc(5, 8, 1, k.l);
    p.disc(28, 8, 1, k.l);
    p.r(5, 4, 24, 2, k.m);
    for (let x = 6; x < 28; x += 3) p.p(x, 4, k.l);
    p.r(5, 12, 24, 1, k.m);
    sl(p, 8, 0, 8, 4, k.l, k.l, k.d);
    sl(p, 19, 0, 8, 4, k.l, k.l, k.d);
    p.r(9, 1, 6, 2, k.m);
    p.r(20, 1, 6, 2, k.m);
  }),
  grn('vmm-ovmf', [10, 12], (p, k) => {
    sl(p, 1, 3, 8, 9, k.d, k.m, k.i);
    for (const x of [2, 4, 6]) p.r(x, 0, 1, 3, k.m);
    p.r(2, 0, 6, 1, k.m);
    p.r(3, 5, 4, 3, k.l);
    p.r(0, 11, 10, 1, k.d);
  }),
  grn('vmm-vfio', [18, 16], (p, k) => {
    sl(p, 2, 12, 14, 4, k.d, k.m, k.i);
    sl(p, 6, 2, 6, 11, k.d, k.m, k.i);
    sl(p, 4, 3, 2, 9, k.m, k.l, k.d);
    sl(p, 12, 3, 2, 9, k.m, k.l, k.d);
    p.p(8, 4, k.l);
    p.p(9, 10, k.l);
    p.r(0, 6, 18, 3, k.m);
    p.r(0, 6, 18, 1, k.l);
  }),
  grn('vmm-snapshot', [14, 14], (p, k) => {
    p.l(5, 9, 3, 13, k.d);
    p.l(9, 9, 11, 13, k.d);
    p.r(7, 9, 1, 5, k.d);
    sl(p, 1, 2, 12, 7, k.m, k.l, k.d);
    p.disc(5, 5, 2, k.i);
    p.p(4, 4, k.l);
    p.r(9, 3, 2, 1, k.l);
    p.r(9, 9, 4, 4, k.l);
    p.r(10, 10, 2, 2, k.d);
  }),
  grn('vmm-serial', [12, 12], (p, k) => {
    p.r(2, 9, 8, 3, k.d);
    p.r(1, 3, 10, 3, k.m);
    p.r(2, 6, 8, 1, k.m);
    p.r(3, 7, 6, 1, k.m);
    p.r(1, 3, 10, 1, k.l);
    for (const x of [3, 5, 7, 9]) p.p(x, 4, k.i);
    for (const x of [4, 6, 8]) p.p(x, 6, k.i);
    p.r(0, 2, 2, 3, k.l);
    p.r(10, 2, 2, 3, k.l);
  }),
  grn('vmm-watchdog', [12, 12], (p, k) => {
    sl(p, 0, 8, 12, 3, k.d, k.m, k.i);
    p.r(4, 1, 4, 1, k.l);
    p.r(3, 2, 6, 1, k.m);
    p.r(2, 3, 8, 2, k.m);
    p.r(1, 5, 10, 3, k.m);
    p.r(2, 2, 1, 5, k.l);
    p.r(10, 8, 2, 1, k.l);
    p.p(11, 7, k.l);
  }),
];

const ANCHORS: EntityDef[] = [
  grn('vmm-qemu', [50, 38], (p, k) => {
    // rack hypervisor cabinet: two recessed machine bays, a teleprinter keyboard shelf, four levelling feet
    sl(p, 1, 0, 48, 24, k.m, k.l, k.d);
    for (const x of [4, 26]) {
      p.r(x, 3, 20, 17, k.i);
      sl(p, x + 1, 4, 18, 15, k.d, k.m, k.i);
      for (let y = 6; y < 12; y += 2) p.r(x + 3, y, 12, 1, k.i);
      p.r(x + 16, 11, 1, 4, k.l);
    }
    sl(p, 0, 24, 50, 4, k.m, k.l, k.d);
    p.r(5, 25, 40, 2, k.d);
    for (let x = 6; x < 44; x += 4) p.p(x, 25, k.l);
    p.r(19, 22, 12, 2, k.l);
    sl(p, 2, 28, 46, 6, k.d, k.m, k.i);
    for (const x of [3, 16, 30, 43]) p.r(x, 34, 4, 4, k.d);
  }),
];

export const vmm: LayerArt = {
  family: 'ring-1',
  blurb: 'Virtual device models pretending to be disks, NICs and consoles',
  palette: 'green',
  form: 'hyper',
  cursor: 'bit',
  stackTheme: ringMinus1.stackTheme,
  topicTags: ['os', 'security', 'hardware'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'ring-1', prefix: 'vmm', upTo: 20 }, density: 4.0, anchorCount: 2, far: 0.35 },
  fog: [0, 0, 0],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000000');
    prows(b, 0.4, 20, (y) => fill(ctx, 0, y, b.w, 1, '#555555'));
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, cx, top, cy }) => {
      // Full-bleed Giant Marionette Crossbar suspending recognizable miniature computer silhouettes (CRT + tower + floppy slot)!
      rect(ctx, 0, top + 8, W, 5, '#555555');
      rect(ctx, 0, top + 8, W, 1, '#aaaaaa');
      // Giant central marionette control-cross
      const sway = R(Math.sin(t * 0.8) * 5);
      rect(ctx, cx - 54 + sway, top + 16, 108, 4, '#aaaaaa');
      rect(ctx, cx - 2 + sway, top + 8, 4, 16, '#ffffff');
      const drawMiniPC = (ox: number, oy: number, w: number, h: number, hi: string, mid: string) => {
        // Angled marionette control strings from top crossbar
        line(ctx, cx - 44 + sway, top + 20, ox + 5, oy, '#555555');
        line(ctx, cx + 44 + sway, top + 20, ox + w - 5, oy, '#555555');
        // CRT Monitor silhouette
        const mw = R(w * 0.62);
        const mh = R(h * 0.66);
        rect(ctx, ox, oy, mw, mh, '#000000');
        frame(ctx, ox, oy, mw, mh, hi);
        frame(ctx, ox + 3, oy + 3, mw - 6, mh - 8, mid);
        rect(ctx, ox + 6, oy + 6, Math.max(4, mw - 14), 2, hi);
        rect(ctx, ox + 6, oy + 10, Math.max(4, mw - 18), 2, mid);
        // Monitor neck & keyboard deck
        rect(ctx, ox + R(mw * 0.35), oy + mh, R(mw * 0.3), 4, mid);
        rect(ctx, ox + 2, oy + mh + 4, mw - 4, 5, hi);
        rect(ctx, ox + 4, oy + mh + 6, mw - 8, 1, '#000000');
        // Adjacent mini-tower chassis with floppy slot & power LED
        const tx = ox + mw + 4;
        const tw = Math.max(12, w - mw - 4);
        rect(ctx, tx, oy + 2, tw, h - 2, '#000000');
        frame(ctx, tx, oy + 2, tw, h - 2, hi);
        rect(ctx, tx + 3, oy + 6, tw - 6, 2, hi); // floppy bay
        rect(ctx, tx + 3, oy + 11, tw - 6, 2, mid); // CD bay
        rect(ctx, tx + 3, oy + h - 8, 3, 3, Math.floor(t * 3 + ox) % 2 ? '#ffffff' : mid);
      };
      drawMiniPC(cx - 46 + sway, cy - 22, 92, 52, '#ffffff', '#aaaaaa');
      drawMiniPC(16 - sway, cy - 12, 56, 36, '#aaaaaa', '#555555');
      drawMiniPC(W - 72 - sway, cy - 12, 56, 36, '#aaaaaa', '#555555');
    },
    detail: ({ ctx, t, cx, cy, rise }) => {
      // A flickering ghost copy of the central chassis, as if the VM were being duplicated.
      if (Math.floor(t * 3) % 4 === 0) {
        frame(ctx, cx - 53, cy - 34, 112, 74, '#555555');
      }
      rise(6, 8, 41, '#aaaaaa', 2);
    },
  },
  critters: {
    motions: [MotionType.Mirror, MotionType.Perch],
    count: 2,
    exitLabels: ['virtio!', 'emulated'],
    draw: ({ px, ink, t, phase, mirror }) => {
      // Winged visor-beetle: a rounded carapace with a bright visor band, wings flicking at its sides.
      mirror();
      const wing = Math.floor(t * 10 + phase) % 2 === 0;
      px(2, 0, 2, 1, '#8cff9c');
      px(1, 1, 4, 5, '#1ea046');
      px(0, 2, 6, 3, '#1ea046');
      px(1, 2, 4, 1, '#8cff9c');
      px(1, 2, 1, 1, ink);
      px(4, 2, 1, 1, ink);
      px(-2, wing ? 0 : 2, 2, 3, '#8cff9c');
      px(6, wing ? 0 : 2, 2, 3, '#8cff9c');
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
