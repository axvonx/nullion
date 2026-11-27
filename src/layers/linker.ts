/** Layer `linker`: The dynamic linker resolving symbols and wiring shared objects together. */
import { prows, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import type { EntityDef } from '../render/v4/kit';
import { libraries } from './libraries';
import { R, fill, frame, line, mod, px, rect } from './shared/draw-kit';
import { E, K, sl } from './shared/endless-props';
import type { LayerArt } from './types';

const LK: K = { i: '#000000', d: '#555555', m: '#aaaaaa', l: '#ffffff', h: '#ffffff', w: '#aa5500', wl: '#ffaa55', o: '#aa5500', ol: '#ffaa55', a: '#ffff55', b: '#55aaaa', g: '#55aa55', c: '#ffffaa', r: '#ff5555' };

const lnk = E(LK);

const PROPS: EntityDef[] = [
  lnk('ld-lazy', [14, 12], (p, k) => {
    // brass-and-bakelite trip-latch switch on a wooden plinth, spring held back by a yellow release pin
    sl(p, 0, 9, 14, 3, k.o, k.ol, k.d);
    sl(p, 2, 4, 10, 5, k.d, k.m, k.i);
    p.r(3, 2, 2, 2, k.w);
    p.r(9, 2, 2, 2, k.w);
    for (let x = 4; x < 10; x += 2) {
      p.p(x, 3, k.m);
      p.p(x + 1, 4, k.m);
    }
    p.r(6, 6, 2, 3, k.a);
  }),
  lnk('ld-elf-canister', [14, 20], (p, k) => {
    sl(p, 2, 4, 10, 14, k.m, k.l, k.d);
    p.r(3, 1, 8, 3, k.m);
    p.r(3, 1, 8, 1, k.l);
    // riveted blue header collar and brass clasp
    p.r(1, 3, 12, 3, k.b);
    p.p(2, 4, k.l);
    p.p(5, 4, k.l);
    p.p(8, 4, k.l);
    p.p(11, 4, k.l);
    p.r(6, 5, 3, 4, k.wl);
    p.r(7, 7, 1, 1, k.i);
    sl(p, 1, 18, 12, 2, k.d, k.m, k.i);
  }),
  lnk('ld-plt-jumper', [14, 10], (p, k) => {
    sl(p, 0, 5, 14, 5, k.d, k.m, k.i);
    p.r(1, 2, 2, 4, k.w);
    p.r(11, 2, 2, 4, k.w);
    p.r(1, 1, 2, 1, k.wl);
    p.r(11, 1, 2, 1, k.wl);
    // arched copper jumper bar
    p.l(3, 2, 5, 0, k.a);
    p.r(5, 0, 4, 1, k.a);
    p.l(9, 0, 11, 2, k.a);
  }),
  lnk('ld-splicer', [20, 16], (p, k) => {
    sl(p, 0, 9, 20, 5, k.w, k.wl, k.o);
    p.r(2, 14, 2, 2, k.d);
    p.r(16, 14, 2, 2, k.d);
    p.r(1, 8, 18, 1, k.d);
    // hinge post and crimping lever with a yellow handle
    p.r(14, 3, 3, 6, k.w);
    p.r(6, 4, 9, 2, k.m);
    p.r(1, 3, 5, 3, k.a);
    p.r(1, 3, 5, 1, k.h);
    p.r(8, 6, 3, 2, k.d);
  }),
  lnk('ld-got-rack', [26, 32], (p, k) => {
    sl(p, 0, 0, 26, 30, k.d, k.m, k.i);
    p.r(2, 2, 22, 26, k.i);
    for (const y of [5, 12, 19, 26]) {
      p.r(2, y, 22, 1, k.d);
      for (let x = 4; x < 23; x += 5) {
        p.r(x, y + 1, 1, 2, k.w);
        p.p(x + 1, y + 2, k.w);
      }
    }
    // one bright key on the second row
    p.ring(14, 15, 1, k.a);
    p.r(14, 16, 1, 5, k.a);
    p.r(15, 18, 2, 1, k.a);
    p.r(0, 30, 26, 2, k.d);
  }),
  lnk('ld-rpath-post', [14, 14], (p, k) => {
    p.r(6, 1, 2, 11, k.d);
    p.r(6, 1, 1, 11, k.m);
    sl(p, 3, 12, 8, 2, k.m, k.l, k.d);
    sl(p, 7, 2, 7, 3, k.a, k.h, k.w);
    p.p(13, 3, k.i);
    sl(p, 0, 5, 7, 3, k.b, k.l, k.d);
    p.p(0, 6, k.i);
    sl(p, 7, 8, 6, 3, k.wl, k.h, k.w);
  }),
  lnk('ld-abi-gauge', [14, 8], (p, k) => {
    sl(p, 0, 5, 14, 3, k.d, k.m, k.i);
    p.r(1, 3, 12, 2, k.w);
    sl(p, 1, 0, 2, 5, k.w, k.wl, k.o);
    sl(p, 9, 0, 3, 5, k.w, k.wl, k.o);
    p.r(4, 1, 5, 1, k.a);
    p.p(4, 2, k.a);
    p.p(8, 2, k.a);
  }),
];

const ANCHORS: EntityDef[] = [
  lnk('ld-switchboard', [50, 44], (p, k) => {
    // a rack of knife switches: brass hinge and contact blocks, blades open or closed
    sl(p, 0, 0, 50, 40, k.d, k.m, k.i);
    p.r(3, 3, 44, 34, k.i);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        const x = 5 + c * 14;
        const y = 5 + r * 8;
        p.r(x, y + 3, 3, 4, k.w);
        p.r(x + 10, y + 3, 3, 4, k.w);
        p.r(x, y + 3, 3, 1, k.wl);
        p.r(x + 10, y + 3, 3, 1, k.wl);
        if ((r + c) % 2 === 0) {
          p.r(x + 2, y + 4, 9, 2, k.l);
          p.r(x + 5, y + 1, 2, 3, k.a);
        } else {
          p.l(x + 2, y + 4, x + 8, y, k.l);
          p.r(x + 7, y - 1 + 1, 3, 2, k.a);
        }
      }
    }
    p.r(3, 40, 6, 4, k.d);
    p.r(41, 40, 6, 4, k.d);
  }),
];

export const linker: LayerArt = {
  family: 'libraries',
  blurb: 'The dynamic linker resolving symbols and wiring shared objects together',
  palette: 'rgb4',
  form: 'repl',
  cursor: 'ibeam',
  stackTheme: {
    accent: '#d4a656',
    hi: '#fff0a6',
    tint: 'rgba(212, 166, 86, 0.14)',
    border: 'rgba(212, 166, 86, 0.36)',
    anim: 'blink',
    icon: [
      '###   ###',
      '# #   # #',
      '###+++###',
      '    +    ',
      '   +++   ',
      '    +    ',
      '###+++###',
      '# #   # #',
      '###   ###',
    ],
  },
  topicTags: ['languages', 'os', 'dsa'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'libraries', prefix: 'ld', upTo: 20 }, density: 4.2, anchorCount: 2, far: 0.35 },
  fog: [8, 12, 22],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000000');
    prows(b, 0.35, 22, (y) => fill(ctx, 0, y, b.w, 1, '#555555'));
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, cx, top, bot, H }) => {
      // Full-bleed Great Patch-Bay Switchboard Wall: left & right jack racks, central symbol bus, sweeping animated catenary trunk cables!
      // Horizontal slate rack rails across full width
      for (let y = top + 16; y < bot - 12; y += 24) {
        rect(ctx, 0, y, W, 2, '#555555');
      }
      const leftX = 12;
      const rightX = W - 34;
      rect(ctx, leftX, top + 8, 22, H - 16, '#555555');
      rect(ctx, rightX, top + 8, 22, H - 16, '#555555');
      // Central vertical GOT/PLT relay pillar
      rect(ctx, cx - 10, top + 8, 20, H - 16, '#555555');
      frame(ctx, cx - 10, top + 8, 20, H - 16, '#aaaaaa');
      const activeCable = Math.floor(t * 2.2) % 6;
      for (let k = 0; k < 6; k++) {
        const y0 = top + 20 + k * Math.floor((H - 36) / 6);
        const y1 = top + 20 + ((k * 2 + 1) % 6) * Math.floor((H - 36) / 6);
        rect(ctx, leftX + 4, y0 - 2, 12, 4, '#000000');
        rect(ctx, rightX + 6, y1 - 2, 12, 4, '#000000');
        // Chunky plug barrels protruding from the switchboard jack bays
        rect(ctx, leftX + 16, y0 - 2, 7, 5, '#aaaaaa');
        rect(ctx, leftX + 21, y0 - 1, 3, 3, k === activeCable ? '#ffff55' : '#aa5500');
        rect(ctx, rightX - 1, y1 - 2, 7, 5, '#aaaaaa');
        rect(ctx, rightX - 2, y1 - 1, 3, 3, k === activeCable ? '#ffff55' : '#aa5500');
        rect(ctx, cx - 6, y0 - 1, 12, 3, k === activeCable ? '#ffff55' : '#000000');
        for (let s = 0; s <= 32; s++) {
          const q = s / 32;
          const x = leftX + 24 + (rightX - 2 - (leftX + 24)) * q;
          const y = y0 + (y1 - y0) * q + Math.sin(q * Math.PI) * (14 + (k % 3) * 6);
          px(ctx, x, y, k === activeCable ? '#ffff55' : k % 2 ? '#aa5500' : '#555555');
        }
        // Signal pulse traveling along active cable
        if (k === activeCable) {
          const pq = mod(t * 1.4, 1);
          const x = leftX + 24 + (rightX - 2 - (leftX + 24)) * pq;
          const y = y0 + (y1 - y0) * pq + Math.sin(pq * Math.PI) * (14 + (k % 3) * 6);
          rect(ctx, x - 2, y - 1, 4, 3, '#ffffff');
        }
      }
      // Two dangling unplugged switchboard patch cords hanging from the bottom rack
      for (const [ux, drop] of [[leftX + 24, 34], [rightX - 6, 28]] as const) {
        const uy = bot - 42;
        const sway = R(Math.sin(t * 1.1 + ux) * 3);
        line(ctx, ux, uy, ux + sway, uy + drop, '#aa5500');
        rect(ctx, ux + sway - 2, uy + drop, 4, 6, '#aaaaaa');
        rect(ctx, ux + sway - 1, uy + drop + 6, 2, 3, '#ffff55');
      }
    },
    detail: ({ top, bot, lamps }) => {
      lamps(top + 12, 14, '#ffff55', '#555555', 3);
      lamps(bot - 16, 14, '#55aaaa', '#555555', 2);
    },
  },
  critters: {
    motions: [MotionType.Patrol, MotionType.Hop],
    count: 3,
    exitLabels: ['resolved', 'bound'],
    draw: ({ px, t, phase, dir }) => {
      // Brass plug-beetle carrying a gold symbol pin
      const leg = Math.floor(t * 10 + phase) % 2;
      px(0, 1, 6, 4, '#aa5500');
      px(1, 0, 4, 1, '#ffff55');
      px(dir > 0 ? 6 : -2, 2, 2, 2, '#ffffaa');
      px(1 + leg, 5, 1, 1, '#aaaaaa');
      px(4 - leg, 5, 1, 1, '#aaaaaa');
    },
    alt: {
      motions: [MotionType.Hop, MotionType.Perch], // brass plug: socket to socket
      draw: ({ px }) => {
        px(0, 0, 4, 6, '#aa5500');
        px(4, 2, 3, 2, '#ffff55');
        px(1, 1, 2, 1, '#ffffaa');
      },
    },
  },
  sound: {
    timbre: { wave: 'pulse25', filterHz: 3600, q: 1.4, gainScale: 0.92, reverbWet: 0.2 },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
    critterCall: libraries.sound.critterCall,
  },
};
