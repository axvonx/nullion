/** Layer `kernel-arch`: Interrupt controllers, spinlocks, RCU and raw hardware bridges. */
import { SEAM_H, tiled, vgrad, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef } from '../render/v4/kit';
import { kernel } from './kernel';
import { KWALL, R, disc, frame, mod, rect } from './shared/draw-kit';
import { cga, sl } from './shared/endless-props';
import { text, variants } from '../text';
import type { LayerArt } from './types';

const PROPS: EntityDef[] = [
  ent('ka-apic', [[16, 14]], (p) => {
    p.box(0, 0, 16, 14, '#000000', '#ff5555');
    for (let k = 0; k < 4; k++) p.r(2 + k * 3, 3, 2, 8, k % 2 ? '#ffff55' : '#aa0000');
  }),
  cga('ka-idt', [18, 22], (p, k) => {
    // iron rotary card index on two splayed feet, one yellow-tabbed card flipped up
    for (let n = 0; n < 6; n++) p.r(4 + n * 2, 3 + (n % 2), 2, 4, k.c);
    p.r(9, 0, 3, 3, k.a);
    p.r(9, 3, 2, 3, k.a);
    p.disc(9, 11, 6, k.d);
    p.disc(9, 11, 4, k.m);
    p.p(9, 11, k.l);
    p.p(7, 9, k.l);
    p.r(15, 10, 3, 2, k.w);
    p.l(6, 16, 3, 21, k.d);
    p.l(12, 16, 15, 21, k.d);
    p.r(2, 21, 4, 1, k.d);
    p.r(13, 21, 4, 1, k.d);
  }),
  cga('ka-rcu', [22, 18], (p, k) => {
    sl(p, 3, 9, 16, 3, k.d, k.m, k.i);
    p.p(4, 10, k.l);
    p.p(17, 10, k.l);
    p.l(10, 13, 3, 17, k.m);
    p.l(11, 13, 18, 17, k.m);
    p.r(10, 3, 2, 6, k.d);
    p.r(8, 1, 6, 3, k.r);
    p.r(8, 1, 6, 1, k.h);
    p.r(10, 8, 2, 2, k.a);
  }),
  cga('ka-fence', [32, 22], (p, k) => {
    // crossing gate: hinge post with a warning lantern, striped barrier arm, forked catch post
    sl(p, 1, 6, 4, 15, k.d, k.m, k.i);
    p.disc(3, 3, 2, k.a);
    p.p(2, 2, k.h);
    for (let n = 0; n < 8; n++) p.r(5 + n * 3, 9, 3, 3, n % 2 ? k.a : k.r);
    p.r(5, 9, 24, 1, k.l);
    sl(p, 27, 12, 4, 9, k.d, k.m, k.i);
    p.r(27, 10, 1, 3, k.m);
    p.r(30, 10, 1, 3, k.m);
    p.r(0, 21, 32, 1, k.d);
  }),
  cga('ka-ipi', [14, 10], (p, k) => {
    sl(p, 0, 6, 14, 4, k.d, k.m, k.i);
    p.r(1, 2, 2, 4, k.w);
    p.r(1, 1, 2, 1, k.wl);
    p.l(2, 4, 10, 3, k.m);
    p.r(10, 4, 3, 2, k.w);
    p.p(10, 3, k.a);
    p.p(9, 2, k.a);
    p.p(11, 2, k.a);
  }),
  cga('ka-cas', [12, 12], (p, k) => {
    sl(p, 0, 10, 12, 2, k.d, k.m, k.i);
    p.r(3, 0, 1, 4, k.m);
    p.r(8, 0, 1, 4, k.m);
    p.r(4, 0, 4, 1, k.m);
    sl(p, 0, 4, 12, 6, k.w, k.wl, k.d);
    p.r(2, 6, 3, 2, k.i);
    p.r(7, 6, 3, 2, k.i);
    p.r(7, 7, 4, 1, k.a);
    p.r(9, 5, 2, 1, k.a);
  }),
  cga('ka-syscall', [14, 14], (p, k) => {
    sl(p, 2, 12, 10, 2, k.d, k.m, k.i);
    p.r(6, 5, 3, 7, k.d);
    p.r(6, 5, 1, 7, k.m);
    p.l(7, 6, 1, 11, k.m);
    p.l(7, 6, 13, 11, k.m);
    p.r(6, 7, 3, 4, k.l);
    p.disc(7, 5, 1, k.a);
    p.p(7, 5, k.h);
  }),
    ent('ka-nmi', [[14, 14]], (p) => {
      p.disc(7, 7, 6, '#aa0000');
      p.disc(7, 7, 3, '#ffff55');
      p.r(6, 0, 2, 3, '#ffffff');
    }),
    ent('ka-spinlock', [[14, 12]], (p) => {
      p.ring(7, 6, 5, '#ffff55');
      p.r(6, 5, 3, 3, '#ff5555');
    }),
];

const ANCHORS: EntityDef[] = [
  cga('ka-apicbank', [50, 42], (p, k) => {
    // relay switchboard: hooded status lamps on top, clapper switches and a busbar, heavy legs
    p.r(3, 36, 5, 6, k.d);
    p.r(42, 36, 5, 6, k.d);
    for (let n = 0; n < 6; n++) {
      const x = 4 + n * 7;
      p.r(x, 2, 6, 4, k.d);
      p.r(x + 1, 1, 4, 1, k.m);
      p.r(x + 1, 4, 4, 2, n % 2 ? k.a : k.r);
    }
    sl(p, 0, 7, 50, 29, k.d, k.m, k.i);
    p.r(3, 10, 44, 23, k.i);
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 6; c++) {
        const x = 5 + c * 7;
        const y = 12 + r * 11;
        p.r(x, y, 6, 5, k.w);
        p.r(x, y, 6, 1, k.wl);
        p.r(x + 1, y + 6, 5, 2, k.m);
        if ((r + c) % 2) p.p(x + 5, y + 5, k.a);
      }
    }
    p.r(4, 21, 42, 1, k.l);
  }),
];

export const kernelArch: LayerArt = {
  family: 'kernel',
  wiki: 'https://en.wikipedia.org/wiki/Interrupt_descriptor_table',
  blurb: text('layers.kernel-arch.blurb'),
  palette: 'cga16',
  form: 'serial',
  cursor: 'underscore',
  stackTheme: kernel.stackTheme,
  topicTags: ['hardware', 'os', 'concurrency'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'kernel', prefix: 'ka', upTo: 22 }, density: 4.2, anchorCount: 2, far: 0.35 },
  fog: [26, 0, 0],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    tiled(ctx, KWALL(), 0, y0, b.w, y1 - y0, 0, R(b.top * 0.5));
    vgrad(ctx, b, b.bottom - 50, b.bottom + SEAM_H, [
      [0, 'rgba(255,85,85,0)'],
      [1, 'rgba(255,85,85,0.4)'],
    ]);
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, cx, top, bot, H }) => {
      // Full-bleed Colossal Interrupt / Tesla Relay Spire: stepped tapered spire + crown coil + thick copper busbars & bold IRQ pin collars!
      for (const sx of [6, W - 20]) {
        rect(ctx, sx, top + 8, 14, H - 16, '#555555');
        for (let y = top + 14; y < bot - 14; y += 10) rect(ctx, sx + 3, y, 8, 4, '#000000');
      }
      // Stepped Tesla relay spire silhouette (wide base, terraced middle, crown insulator rings)
      rect(ctx, cx - 28, bot - 44, 56, 36, '#555555');
      frame(ctx, cx - 28, bot - 44, 56, 36, '#ff5555');
      rect(ctx, cx - 18, top + 28, 36, H - 72, '#555555');
      frame(ctx, cx - 18, top + 28, 36, H - 72, '#ff5555');
      rect(ctx, cx - 9, top + 14, 18, 16, '#aaaaaa');
      rect(ctx, cx - 15, top + 18, 30, 3, '#ff5555');
      rect(ctx, cx - 15, top + 24, 30, 3, '#ff5555');
      disc(ctx, cx, top + 11, 6, Math.floor(t * 6) % 2 ? '#ffff55' : '#ff5555');
      const activeLine = Math.floor(t * 5) % 8;
      for (let k = 0; k < 8; k++) {
        const ly = top + 34 + k * Math.floor((H - 50) / 8);
        const hot = k === activeLine;
        const halfW = ly > bot - 44 ? 28 : 18;
        // Thick 2px copper busbars + bold IRQ pin collars
        rect(ctx, 20, ly, cx - halfW - 20, 2, hot ? '#ffff55' : '#aa0000');
        rect(ctx, cx + halfW, ly, W - 20 - (cx + halfW), 2, hot ? '#ffff55' : '#aa0000');
        rect(ctx, cx - halfW - 6, ly - 2, 6, 6, hot ? '#ffffff' : '#aaaaaa');
        rect(ctx, cx + halfW, ly - 2, 6, 6, hot ? '#ffffff' : '#aaaaaa');
        rect(ctx, cx - 10, ly - 1, 20, 4, hot ? '#ff5555' : '#000000');
        if (hot) {
          const d = mod(t * 90, Math.max(12, cx - halfW - 26));
          rect(ctx, cx - halfW - 8 - d, ly - 1, 7, 4, '#ffffff');
          rect(ctx, cx + halfW + 6 + d, ly - 1, 7, 4, '#ffffff');
        }
      }
    },
    detail: ({ top, bot, lamps }) => {
      lamps(top + 12, 10, '#ff5555', '#550000', 4);
      lamps(bot - 14, 10, '#ffff55', '#550000', 3);
    },
  },
  critters: {
    motions: [MotionType.Zip, MotionType.Scuttle],
    count: 3,
    exitLabels: variants('layers.kernel-arch.exit'),
    draw: ({ px, ink, t, phase }) => {
      // Armoured interrupt spark-mite: a red body under a grey helmet, two stubby yellow side fins.
      const fin = Math.floor(t * 14 + phase) % 2 === 0;
      px(1, 0, 4, 1, '#aaaaaa');
      px(0, 1, 6, 5, '#ff5555');
      px(1, 2, 1, 1, ink);
      px(4, 2, 1, 1, ink);
      px(2, 4, 2, 1, '#ffff55');
      px(-1, fin ? 2 : 3, 1, 2, '#ffff55');
      px(6, fin ? 2 : 3, 1, 2, '#ffff55');
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
