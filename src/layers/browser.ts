/** Layer `browser`: The DOM tree, CSS layout engine and GPU compositor framing your apps. */
import { SEAM_H, prows, vgrad } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef } from '../render/v4/kit';
import { application } from './application';
import { R, disc, fill, frame, mod, px, rect, ring } from './shared/draw-kit';
import { net, sl } from './shared/endless-props';
import { text, variants } from '../text';
import type { LayerArt } from './types';

const PROPS: EntityDef[] = [
  ent('br-cookie', [[11, 11]], (p) => {
    p.disc(5, 5, 5, '#e6a23c');
    p.p(3, 3, '#55607a');
    p.p(7, 4, '#55607a');
    p.p(4, 7, '#55607a');
    p.p(7, 7, '#55607a');
  }),
  net('br-dom-bonsai', [20, 20], (p, k) => {
    // trunk and branches
    p.r(9, 9, 2, 6, k.o);
    p.l(9, 11, 4, 7, k.o);
    p.l(10, 10, 15, 6, k.o);
    p.l(10, 9, 10, 5, k.o);
    // clipped leaf pads
    p.disc(4, 5, 3, k.g);
    p.r(2, 3, 3, 1, k.wl);
    p.disc(15, 5, 3, k.g);
    p.r(13, 3, 3, 1, k.wl);
    p.disc(10, 2, 2, k.g);
    // paper node-tags dangling
    for (const [x, y] of [[3, 9], [8, 5], [13, 9], [17, 8]] as const) {
      p.p(x, y, k.d);
      p.r(x, y + 1, 2, 2, k.c);
    }
    // squat pot on four feet
    sl(p, 4, 14, 12, 4, k.b, k.l, k.d);
    p.r(5, 18, 2, 2, k.d);
    p.r(13, 18, 2, 2, k.d);
  }),
  net('br-box-matryoshka', [14, 13], (p, k) => {
    sl(p, 0, 10, 14, 3, k.o, k.ol, k.d);
    // big doll
    sl(p, 0, 2, 5, 8, k.r, k.a, k.d);
    p.r(1, 0, 3, 2, k.c);
    p.r(0, 5, 5, 2, k.a);
    // open middle doll: lower shell only, smaller doll showing inside
    sl(p, 5, 6, 4, 4, k.b, k.l, k.d);
    p.r(6, 3, 2, 3, k.g);
    p.r(6, 2, 2, 1, k.c);
    // small doll
    sl(p, 10, 6, 4, 4, k.g, k.l, k.d);
    p.r(11, 4, 2, 2, k.c);
    p.r(10, 8, 4, 1, k.a);
  }),
  net('br-cors-turnstile', [18, 24], (p, k) => {
    sl(p, 2, 22, 14, 2, k.m, k.l, k.d);
    sl(p, 7, 9, 4, 13, k.m, k.l, k.d);
    // card reader head with indicator lamps
    sl(p, 5, 2, 8, 7, k.d, k.m, k.i);
    p.p(7, 4, k.a);
    p.p(10, 4, k.g);
    p.r(6, 6, 6, 1, k.i);
    // three tripod arms
    p.l(7, 13, 1, 18, k.m);
    p.l(10, 13, 16, 18, k.m);
    p.r(8, 14, 2, 5, k.l);
    p.r(8, 19, 2, 1, k.d);
  }),
  net('br-paint-roller', [14, 12], (p, k) => {
    // sloped tray on two rear legs
    sl(p, 1, 6, 12, 4, k.m, k.l, k.d);
    p.r(3, 7, 8, 1, k.d);
    p.r(3, 9, 8, 1, k.d);
    p.r(2, 10, 2, 2, k.d);
    p.r(10, 10, 2, 2, k.d);
    // fuzzy green roller resting diagonally
    p.r(3, 3, 6, 3, k.g);
    p.r(3, 3, 6, 1, k.wl);
    p.l(8, 4, 12, 0, k.d);
    p.p(12, 0, k.m);
    // paint pooling at the bottom
    p.r(2, 9, 6, 1, k.g);
  }),
  net('br-shadow-screen', [30, 34], (p, k) => {
    for (const x of [0, 10, 20]) {
      sl(p, x, 2, 10, 28, k.d, k.m, k.i);
      p.r(x + 1, 3, 8, 26, k.l);
    }
    // blurred silhouettes in the centre panel
    p.disc(15, 10, 2, k.m);
    p.r(13, 12, 5, 10, k.m);
    p.r(14, 17, 3, 5, k.b);
    // hinges
    for (const y of [6, 22]) {
      p.r(9, y, 2, 3, k.w);
      p.r(19, y, 2, 3, k.w);
    }
    // four brass feet
    for (const x of [1, 8, 21, 27]) p.r(x, 30, 3, 4, k.w);
  }),
  net('br-perf-recorder', [22, 17], (p, k) => {
    sl(p, 0, 5, 22, 10, k.m, k.l, k.d);
    p.r(2, 15, 3, 2, k.d);
    p.r(17, 15, 3, 2, k.d);
    // paper roll and tape
    p.disc(4, 3, 2, k.c);
    p.r(4, 6, 16, 5, k.c);
    p.r(5, 9, 2, 2, k.g);
    p.r(8, 7, 2, 4, k.a);
    p.r(11, 8, 2, 3, k.g);
    p.r(14, 7, 2, 4, k.a);
    p.r(17, 9, 2, 2, k.g);
    // brass stylus arm
    p.l(18, 2, 9, 7, k.w);
    p.p(9, 7, k.r);
    p.r(17, 1, 3, 2, k.wl);
  }),
  net('br-worker-pager', [12, 14], (p, k) => {
    sl(p, 1, 10, 10, 4, k.d, k.m, k.i);
    // slate pager standing in the cradle
    sl(p, 3, 2, 6, 10, k.d, k.m, k.i);
    p.r(4, 3, 4, 4, k.i);
    p.r(4, 3, 4, 1, k.g);
    p.r(4, 5, 4, 1, k.g);
    p.r(8, 0, 1, 3, k.m);
    p.r(9, 6, 1, 4, k.m);
    p.p(5, 9, k.a);
    p.p(7, 9, k.b);
  }),
];

const ANCHORS: EntityDef[] = [
  ent('br-viewport', [[54, 40]], (p) => {
    p.r(0, 0, 54, 40, '#2a3358');
    p.r(1, 1, 52, 4, '#c8d0e6');
    p.r(2, 1, 14, 4, '#ffffff');
    p.r(1, 5, 52, 34, '#ffffff');
    p.r(3, 7, 28, 12, '#5b8ee6');
    p.r(33, 7, 18, 30, '#e9e6dc');
    for (let y = 21; y < 37; y += 3) p.r(3, y, 26, 2, '#dfe6f6');
  }),
];

export const browser: LayerArt = {
  family: 'application',
  blurb: text('layers.browser.blurb'),
  palette: 'full',
  form: 'gui',
  cursor: 'arrow',
  stackTheme: {
    accent: '#68a8f0',
    hi: '#d8ecff',
    tint: 'rgba(104, 168, 240, 0.14)',
    border: 'rgba(104, 168, 240, 0.36)',
    anim: 'scan',
    icon: [
      '#########',
      '#+++....#',
      '#########',
      '#   #   #',
      '# + # . #',
      '#   #   #',
      '# + # . #',
      '#   #   #',
      '#########',
    ],
  },
  topicTags: ['languages', 'graphics', 'networking'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'application', prefix: 'br', upTo: 20 }, density: 4.4, anchorCount: 2, far: 0.45 },
  fog: [155, 195, 238],
  background: (ctx, b, { entities }) => {
    vgrad(ctx, b, b.top, b.bottom + SEAM_H, [
      [0, '#c2e4f8'],
      [0.6, '#8cbbe8'],
      [1, '#b4e2f7'],
    ]);
    // Subtle compositor tile grid
    prows(b, 0.4, 24, (y) => fill(ctx, 0, y, b.w, 1, '#a9c4f4'));
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, top, bot, H }) => {
      // Full-bleed Giant Browser & DevTools Inspector Diorama + pixel scrollbar + magnifying glass!
      frame(ctx, 6, top + 6, W - 12, H - 12, '#6c9cd4');
      rect(ctx, 6, top + 6, W - 12, 14, '#8fb8e8');
      rect(ctx, 11, top + 10, 3, 3, '#d0605e');
      rect(ctx, 16, top + 10, 3, 3, '#e6a23c');
      rect(ctx, 21, top + 10, 3, 3, '#59c08a');
      rect(ctx, 30, top + 8, 34, 6, '#d8ecfc');
      rect(ctx, 66, top + 9, 28, 5, '#a6cbf2');
      rect(ctx, 100, top + 9, Math.max(40, W - 116), 5, '#c8e4fb');
      const splitX = R(W * 0.64);
      rect(ctx, splitX, top + 20, 1, H - 26, '#6c9cd4');
      const pageW = splitX - 28;
      // Chunky pixel scrollbar along the right margin of the viewport pane
      const sbX = splitX - 9;
      rect(ctx, sbX, top + 21, 8, H - 28, '#9cc2ee');
      frame(ctx, sbX, top + 21, 8, H - 28, '#6c9cd4');
      const thumbY = top + 24 + Math.floor((Math.sin(t * 0.6) * 0.5 + 0.5) * Math.max(10, H - 56));
      rect(ctx, sbX + 1, thumbY, 6, 18, '#5b8ee6');
      rect(ctx, sbX + 2, thumbY + 7, 4, 1, '#d8ecfc');
      rect(ctx, sbX + 2, thumbY + 10, 4, 1, '#d8ecfc');
      rect(ctx, 14, top + 26, pageW, 28, '#9cc2ee');
      frame(ctx, 14, top + 26, pageW, 28, '#7ea8dc');
      const shimX = 16 + Math.floor(mod(t * 42, Math.max(20, pageW - 18)));
      rect(ctx, shimX, top + 28, 14, 24, '#cfe6fc');
      const cardW = Math.max(16, Math.floor((pageW - 12) / 3));
      const focusCard = Math.floor(t * 0.5) % 3;
      for (let k = 0; k < 3; k++) {
        const kx = 14 + k * (cardW + 6);
        const ky = top + 62;
        const ch = Math.max(30, H - 82);
        frame(ctx, kx, ky, cardW, ch, k === focusCard ? '#59c08a' : '#8fb8e8');
        if (k === focusCard) frame(ctx, kx - 1, ky - 1, cardW + 2, ch + 2, '#59c08a');
        rect(ctx, kx + 3, ky + 4, Math.max(8, cardW - 6), 12, '#a8cef4');
        rect(ctx, kx + 3, ky + 20, Math.max(6, cardW - 10), 2, '#7ea8dc');
        rect(ctx, kx + 3, ky + 25, Math.max(4, cardW - 14), 2, '#9cc2ee');
      }
      // Giant pixel DevTools magnifying glass inspecting the focused card
      const mgX = 14 + focusCard * (cardW + 6) + R(cardW * 0.55);
      const mgY = top + 78;
      disc(ctx, mgX, mgY, 13, '#d8ecfc');
      ring(ctx, mgX, mgY, 14, '#3d6cc4');
      ring(ctx, mgX, mgY, 13, '#5b8ee6');
      rect(ctx, mgX - 6, mgY - 6, 4, 2, '#ffffff');
      for (let d = 0; d < 14; d++) {
        rect(ctx, mgX + 9 + d, mgY + 9 + d, 4, 3, '#3d6cc4');
        px(ctx, mgX + 10 + d, mgY + 9 + d, '#8fb8e8');
      }
      const hiRow = Math.floor(t * 1.6) % 7;
      for (let r = 0; r < 7; r++) {
        const ry = top + 28 + r * 14;
        if (ry > bot - 16) break;
        const indent = (r % 3) * 6;
        if (r === hiRow) rect(ctx, splitX + 4, ry - 2, W - splitX - 14, 9, '#7edba8');
        rect(ctx, splitX + 8 + indent, ry, Math.max(12, W - splitX - 24 - indent), 3, r === hiRow ? '#ffffff' : '#8fb8e8');
      }
      const sy = top + 22 + Math.floor(mod(t * 28, Math.max(20, H - 34)));
      rect(ctx, 10, sy, splitX - 22, 2, '#59c08a');
    },
  },
  critters: {
    motions: [MotionType.Fly, MotionType.Perch],
    count: 3,
    exitLabels: variants('layers.browser.exit'),
    draw: ({ px, ink, t, phase, dir, perched }) => {
      // Tab-bug: a scuttling 6x6 beetle with an orange browser-tab ear and two dark eyes.
      const leg = perched ? 0 : Math.floor(t * 10 + phase) % 2;
      const glow = Math.floor(t * 3 + phase) % 2 === 0;
      px(1, 0, 4, 1, glow ? '#59c08a' : '#5b8ee6');
      px(0, 1, 6, 5, glow ? '#59c08a' : '#5b8ee6');
      px(dir > 0 ? 3 : 0, -2, 3, 2, '#e6a23c');
      px(1, 2, 1, 1, ink);
      px(4, 2, 1, 1, ink);
      px(2, 4, 2, 1, '#dff5e8');
      px(leg, 6, 1, 1, ink);
      px(5 - leg, 6, 1, 1, ink);
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
