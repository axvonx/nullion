/** Layer `jit`: Just-in-time compilers forging hot loops into native machine code. */
import { SEAM_H, hash, prows, vgrad, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef } from '../render/v4/kit';
import { runtime } from './runtime';
import { R, TAU, disc, fill, frame, mod, rect, ring } from './shared/draw-kit';
import { byc, sl } from './shared/endless-props';
import type { LayerArt } from './types';

const PROPS: EntityDef[] = [
  byc('jit-deopt', [16, 20], (p, k) => {
    // floor-standing abort-lever pedestal with a caution-striped hood
    sl(p, 2, 8, 12, 12, k.d, k.m, k.i);
    p.r(1, 4, 14, 4, k.b);
    for (let x = 2; x < 14; x += 4) p.r(x, 4, 2, 4, k.i);
    p.r(1, 4, 14, 1, k.a);
    p.r(7, 10, 2, 6, k.i);
    // pulled-down yellow bailout lever
    p.r(7, 12, 2, 6, k.a);
    p.r(5, 17, 6, 2, k.a);
    p.r(5, 17, 6, 1, k.h);
  }),
  byc('jit-inline-cache', [12, 12], (p, k) => {
    sl(p, 0, 0, 12, 12, k.d, k.m, k.i);
    p.r(5, 2, 2, 2, k.w);
    p.ring(6, 6, 2, k.a);
    p.r(6, 8, 1, 3, k.a);
    p.r(7, 9, 2, 1, k.a);
  }),
  byc('jit-megamorphic', [20, 22], (p, k) => {
    sl(p, 6, 14, 8, 8, k.d, k.m, k.i);
    p.r(4, 20, 12, 2, k.d);
    p.disc(10, 8, 7, k.w);
    p.disc(10, 8, 5, k.d);
    for (let n = 0; n < 8; n++) {
      const a = (n * Math.PI) / 4;
      p.p(10 + Math.round(Math.cos(a) * 5), 8 + Math.round(Math.sin(a) * 5), k.wl);
    }
    p.l(10, 8, 13, 4, k.b);
    p.p(10, 8, k.h);
  }),
  byc('jit-osr-switch', [22, 17], (p, k) => {
    // short converging rails
    p.l(1, 16, 9, 11, k.m);
    p.l(21, 16, 13, 11, k.m);
    sl(p, 4, 9, 14, 3, k.d, k.m, k.i);
    // switch stand with the weighted lever mid-throw
    p.r(10, 3, 2, 6, k.d);
    p.l(11, 5, 17, 2, k.m);
    p.disc(17, 2, 2, k.b);
    p.p(17, 2, k.a);
  }),
  byc('jit-trace-recorder', [14, 14], (p, k) => {
    sl(p, 3, 11, 8, 3, k.d, k.m, k.i);
    p.r(5, 4, 2, 7, k.m);
    p.disc(6, 3, 3, k.w);
    p.p(6, 3, k.i);
    // brass guide roller and the glowing tape loop
    p.disc(11, 9, 1, k.wl);
    p.ring(10, 5, 3, k.a);
    p.r(9, 8, 1, 2, k.a);
  }),
  byc('jit-register-anvil', [30, 26], (p, k) => {
    // stepped iron block
    sl(p, 4, 21, 22, 5, k.d, k.m, k.i);
    sl(p, 8, 17, 14, 4, k.d, k.m, k.i);
    p.p(6, 23, k.l);
    p.p(23, 23, k.l);
    // waist, top face and horn
    p.r(11, 10, 8, 7, k.d);
    p.r(11, 10, 1, 7, k.m);
    sl(p, 6, 5, 22, 5, k.d, k.m, k.i);
    p.r(2, 6, 4, 3, k.d);
    p.r(0, 7, 2, 2, k.d);
    p.r(2, 6, 4, 1, k.m);
    // four glowing register notches
    for (const x of [10, 14, 18, 22]) p.r(x, 5, 2, 2, k.b);
    p.r(10, 5, 2, 1, k.a);
    p.r(14, 5, 2, 1, k.a);
    p.r(18, 5, 2, 1, k.a);
    p.r(22, 5, 2, 1, k.a);
  }),
  byc('jit-warmup-bellows', [14, 12], (p, k) => {
    sl(p, 1, 0, 9, 2, k.d, k.m, k.i);
    sl(p, 1, 9, 9, 3, k.d, k.m, k.i);
    p.r(2, 2, 7, 7, k.o);
    p.r(2, 4, 7, 1, k.ol);
    p.r(2, 6, 7, 1, k.ol);
    p.p(2, 2, k.w);
    p.p(8, 2, k.w);
    p.r(10, 5, 3, 2, k.w);
    p.r(12, 5, 2, 2, k.b);
    p.p(13, 5, k.a);
    p.r(0, 8, 1, 4, k.o);
  }),
];

const ANCHORS: EntityDef[] = [
  ent(
    'jit-forge',
    [[48, 44]],
    (p) => {
      p.r(4, 16, 40, 28, '#333366');
      p.r(6, 18, 36, 2, '#9999cc');
      p.r(12, 24, 24, 16, '#000033');
      p.r(16, 8, 16, 8, '#ff6633');
      p.r(18, 8, 12, 2, '#ffcc33');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (let k = 0; k < 5; k++) {
          const fh = 4 + R((Math.sin(t * 7 + k * 1.5) * 0.5 + 0.5) * 8);
          p.r(14 + k * 4, 40 - fh, 3, fh, k % 2 ? '#ff6633' : '#ffff66');
        }
      },
      noFlip: true,
    },
  ),
];

export const jit: LayerArt = {
  family: 'runtime',
  blurb: 'Just-in-time compilers forging hot loops into native machine code',
  palette: 'rgb6',
  form: 'repl',
  cursor: 'ibeam',
  stackTheme: {
    accent: '#ff8a4c',
    hi: '#fff078',
    tint: 'rgba(255, 138, 76, 0.15)',
    border: 'rgba(255, 138, 76, 0.4)',
    anim: 'beat',
    icon: [
      '    ###  ',
      '   ###   ',
      '  ###    ',
      ' +++++++ ',
      '    ###  ',
      '   ###   ',
      '  ##     ',
      ' #       ',
      '         ',
    ],
  },
  topicTags: ['languages', 'hardware', 'math'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'runtime', prefix: 'jit', upTo: 20 }, density: 4.3, anchorCount: 2, far: 0.4 },
  fog: [34, 12, 34],
  background: (ctx, b, { T, entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#330033');
    vgrad(ctx, b, b.bottom - 60, b.bottom + SEAM_H, [
      [0, 'rgba(255,102,51,0)'],
      [1, 'rgba(255,102,51,0.38)'],
    ]);
    entities();
    prows(b, 1.1, 14, (y, i) => {
      if (hash(i * 11) < 0.72) return;
      const k = mod(T * 12 + hash(i * 11 + 1) * 14, 14);
      fill(ctx, hash(i * 11 + 2) * b.w, y + 14 - k, 1, 1, k < 6 ? '#ffff66' : '#ff6633');
    });
  },
  setpiece: {
    base: ({ ctx, t, W, cx, top, bot, cy, H }) => {
      // Full-bleed Molten Hot-Loop Crucible + twin side induction coils + giant forge anvil & glowing ingot molds!
      for (const sx of [14, W - 30]) {
        rect(ctx, sx, top + 10, 16, H - 20, '#330033');
        frame(ctx, sx, top + 10, 16, H - 20, '#663366');
        const hot = Math.floor(t * 4) % 5;
        for (let k = 0; k < 5; k++) {
          const ry = top + 18 + k * Math.floor((H - 36) / 5);
          rect(ctx, sx + 2, ry, 12, 4, k === hot ? '#ffcc33' : '#993333');
        }
      }
      // Horizontal molten feed pipes from pylons into central crucible
      rect(ctx, 30, cy - 4, W - 60, 8, '#663333');
      rect(ctx, 30, cy - 2, W - 60, 4, '#993333');
      const pulseX = 32 + Math.floor(mod(t * 48, Math.max(20, W - 68)));
      rect(ctx, pulseX, cy - 2, 10, 4, '#ffff66');
      // Colossal central crucible ring
      disc(ctx, cx, cy, 56, '#330033');
      ring(ctx, cx, cy, 56, '#993333');
      ring(ctx, cx, cy, 50, '#cc6633');
      ring(ctx, cx, cy, 40, '#663366');
      disc(ctx, cx, cy, 24, '#330033');
      ring(ctx, cx, cy, 24, '#ff9933');
      // 6 orbiting hot-loop sparks
      for (let k = 0; k < 6; k++) {
        const a = t * 1.2 + (k * TAU) / 6;
        rect(ctx, cx + Math.cos(a) * 46 - 2, cy + Math.sin(a) * 46 - 2, 4, 4, k % 2 ? '#ffff66' : '#ff6633');
      }
      // Vertical ingot chute top & native-code molten pour bottom
      rect(ctx, cx - 8, top, 16, Math.max(10, cy - 56 - top), '#333366');
      rect(ctx, cx - 8, cy + 56, 16, Math.max(10, bot - (cy + 56)), '#993333');
      rect(ctx, cx - 3, cy + 56, 6, Math.max(10, bot - (cy + 56)), '#ff9933');
      // Giant forge anvil on the lower-left wing + glowing ingot molds on the lower-right wing
      const ax = Math.max(38, cx - 102);
      const ay = bot - 34;
      rect(ctx, ax - 14, ay, 34, 8, '#663366');
      rect(ctx, ax - 22, ay + 1, 10, 5, '#993366');
      rect(ctx, ax - 14, ay, 34, 2, '#cc6699');
      rect(ctx, ax - 6, ay + 8, 18, 10, '#330033');
      frame(ctx, ax - 6, ay + 8, 18, 10, '#663366');
      rect(ctx, ax - 12, ay + 18, 30, 6, '#663366');
      // Glowing native-code ingot molds on lower-right
      const mx = Math.min(W - 72, cx + 68);
      for (let k = 0; k < 2; k++) {
        const ix = mx + k * 20;
        rect(ctx, ix, ay + 10, 16, 12, '#663333');
        rect(ctx, ix + 2, ay + 12, 12, 6, k === Math.floor(t * 2) % 2 ? '#ffff66' : '#ff9933');
      }
    },
    detail: ({ rise }) => {
      rise(10, 20, 5, '#ffcc33');
    },
  },
  critters: {
    motions: [MotionType.Zip, MotionType.Perch],
    count: 3,
    exitLabels: ['deopt!', 'inlined'],
    draw: ({ px, dir }) => {
      // Fiery orange-gold spark mite with trailing ember pixel
      px(0, 1, 6, 5, '#ff6633');
      px(1, 0, 4, 2, '#ff6633');
      px(2, 1, 2, 2, '#ffff66');
      px(dir > 0 ? -2 : 7, 3, 1, 1, '#ffcc33');
    },
  },
  sound: {
    timbre: { wave: 'pulse25', filterHz: 3600, q: 1.4, gainScale: 0.92, reverbWet: 0.2 },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
    critterCall: runtime.sound.critterCall,
  },
};
