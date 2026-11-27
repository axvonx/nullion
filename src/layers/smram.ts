/** Layer `smram`: Locked hardware-shielded memory invisible to the OS and hypervisor. */
import { tiled, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef } from '../render/v4/kit';
import { ringMinus2 } from './ring-2';
import { PLATE, R, disc, frame, px, rect, ring } from './shared/draw-kit';
import { E, K, sl } from './shared/endless-props';
import { text, variants } from '../text';
import type { LayerArt } from './types';

const SK: K = { i: '#0c0c0c', d: '#464646', m: '#828282', l: '#bebebe', h: '#f0f0f0', w: '#828282', wl: '#bebebe', o: '#464646', ol: '#828282', a: '#f0f0f0', b: '#bebebe', g: '#828282', c: '#f0f0f0', r: '#f0f0f0' };

const gry = E(SK);

const PROPS: EntityDef[] = [
  ent('sm-dlck', [[16, 14]], (p) => {
    p.box(0, 0, 16, 14, '#404040', '#c0c0c0');
    p.r(5, 3, 6, 3, '#ffffff');
    p.r(4, 6, 8, 6, '#808080');
    p.r(7, 8, 2, 2, '#000000');
  }),
  gry('sm-savestate', [20, 16], (p, k) => {
    sl(p, 1, 6, 18, 8, k.m, k.l, k.d);
    p.r(7, 9, 6, 2, k.h);
    p.r(8, 10, 4, 1, k.i);
    for (let n = 0; n < 4; n++) {
      p.r(3 + n * 4, 2 - (n % 2), 3, 4 + (n % 2), k.l);
      p.r(3 + n * 4, 2 - (n % 2), 3, 1, k.h);
    }
    p.r(0, 14, 20, 2, k.d);
  }),
  gry('sm-rsm', [12, 10], (p, k) => {
    sl(p, 0, 0, 12, 10, k.d, k.m, k.i);
    p.r(1, 4, 9, 3, k.m);
    p.r(1, 4, 9, 1, k.l);
    p.r(10, 4, 1, 3, k.i);
    p.l(3, 2, 10, 1, k.h);
  }),
  gry('sm-tseg', [18, 36], (p, k) => {
    sl(p, 0, 0, 18, 4, k.d, k.m, k.i);
    sl(p, 1, 4, 16, 30, k.m, k.l, k.d);
    p.r(8, 4, 2, 30, k.i);
    for (let y = 6; y < 33; y += 3) {
      p.p(5, y, k.h);
      p.p(12, y, k.h);
    }
    sl(p, 0, 34, 18, 2, k.d, k.m, k.i);
  }),
  gry('sm-smbase', [12, 14], (p, k) => {
    p.l(6, 9, 2, 13, k.d);
    p.l(6, 9, 10, 13, k.d);
    p.r(6, 9, 1, 5, k.d);
    p.disc(6, 5, 4, k.m);
    p.disc(6, 5, 3, k.d);
    p.l(6, 5, 9, 2, k.h);
    p.p(6, 5, k.l);
  }),
  gry('sm-smi-bell', [12, 12], (p, k) => {
    p.r(5, 10, 2, 2, k.d);
    p.r(4, 1, 4, 1, k.l);
    p.r(3, 2, 6, 1, k.m);
    p.r(2, 3, 8, 2, k.m);
    p.r(1, 5, 10, 2, k.m);
    p.r(0, 7, 12, 1, k.d);
    p.r(5, 8, 2, 2, k.l);
    p.p(8, 3, k.h);
  }),
  gry('sm-dopen', [10, 12], (p, k) => {
    sl(p, 1, 0, 8, 12, k.m, k.l, k.d);
    p.r(4, 2, 2, 8, k.i);
    p.r(3, 5, 5, 2, k.h);
    p.r(6, 4, 3, 4, k.h);
    p.p(7, 5, k.i);
  }),
  gry('sm-handler', [20, 20], (p, k) => {
    p.r(2, 12, 2, 8, k.d);
    p.r(16, 12, 2, 8, k.d);
    p.r(2, 15, 16, 1, k.d);
    sl(p, 1, 11, 18, 2, k.m, k.l, k.d);
    p.r(3, 3, 14, 1, k.l);
    sl(p, 2, 4, 16, 7, k.m, k.l, k.d);
    p.r(8, 5, 4, 4, k.h);
    p.p(4, 8, k.i);
    p.p(15, 8, k.i);
  }),
];

const ANCHORS: EntityDef[] = [
  ent('sm-vaultdoor', [[48, 44]], (p) => {
    p.box(0, 0, 48, 44, '#404040', '#c0c0c0');
    p.disc(24, 22, 14, '#808080');
    p.disc(24, 22, 10, '#000000');
    p.r(22, 12, 4, 20, '#ffffff');
    p.r(14, 20, 20, 4, '#ffffff');
  }),
];

export const smram: LayerArt = {
  family: 'ring-2',
  wiki: 'https://en.wikipedia.org/wiki/System_Management_Mode',
  blurb: text('layers.smram.blurb'),
  palette: 'gray',
  form: 'smm',
  cursor: 'bit',
  stackTheme: ringMinus2.stackTheme,
  topicTags: ['security', 'hardware', 'os'],
  library: { own: PROPS, anchors: ANCHORS, borrow: { from: 'ring-2', prefix: 'sm', upTo: 20 }, density: 3.8, anchorCount: 2, far: 0.3 },
  fog: [0, 0, 0],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    tiled(ctx, PLATE(), 0, y0, b.w, y1 - y0, 0, R(b.top * 0.5));
    entities();
  },
  setpiece: {
    base: ({ ctx, W, cx, top, bot, cy, H }) => {
      // Full-bleed Colossal Armored Padlock Vault: giant U-shackle, riveted lock body with huge keyhole, deadbolt bars, & heavy pixel chains!
      for (let x = 10; x < W - 10; x += 48) {
        if (Math.abs(x - cx) < 62) continue;
        rect(ctx, x, top, 14, H, '#404040');
        rect(ctx, x, top, 2, H, '#808080');
        rect(ctx, x + 12, top, 2, H, '#000000');
      }
      rect(ctx, 0, top + 6, W, 4, '#404040');
      rect(ctx, 0, bot - 10, W, 4, '#404040');

      // Heavy pixel chains bolting the colossal padlock to the flanking pillars
      for (const chainY of [cy - 6, cy + 22]) {
        for (let x = 8; x < cx - 44; x += 10) {
          frame(ctx, x, chainY - 3, 12, 7, '#808080');
          rect(ctx, x + 2, chainY - 1, 8, 3, '#000000');
          rect(ctx, x + 6, chainY, 4, 1, '#c0c0c0');
        }
        for (let x = cx + 44; x < W - 16; x += 10) {
          frame(ctx, x, chainY - 3, 12, 7, '#808080');
          rect(ctx, x + 2, chainY - 1, 8, 3, '#000000');
          rect(ctx, x + 2, chainY, 4, 1, '#c0c0c0');
        }
      }

      // Colossal U-shaped armored padlock shackle arching across the upper band
      const shY = cy - 22;
      const outerR = 36;
      const innerR = 22;
      for (let dy = -outerR; dy <= 10; dy++) {
        const y = shY + dy;
        const ox = dy <= 0 ? Math.floor(Math.sqrt(outerR * outerR - dy * dy)) : outerR;
        const ix = dy <= 0 ? Math.floor(Math.sqrt(Math.max(0, innerR * innerR - dy * dy))) : innerR;
        rect(ctx, cx - ox, y, ox - ix, 1, '#c0c0c0');
        rect(ctx, cx + ix, y, ox - ix, 1, '#c0c0c0');
        // Shackle rim highlight & inner bevel
        rect(ctx, cx - ox, y, 2, 1, '#ffffff');
        rect(ctx, cx + ox - 2, y, 2, 1, '#808080');
        rect(ctx, cx - ix - 2, y, 2, 1, '#404040');
        rect(ctx, cx + ix, y, 2, 1, '#404040');
      }

      // Massive riveted armored padlock body
      const bx = cx - 46;
      const by = cy - 16;
      const bw = 92;
      const bh = 74;
      rect(ctx, bx, by, bw, bh, '#404040');
      frame(ctx, bx, by, bw, bh, '#ffffff');
      frame(ctx, bx + 2, by + 2, bw - 4, bh - 4, '#c0c0c0');
      frame(ctx, bx + 6, by + 6, bw - 12, bh - 12, '#808080');
      // Corner & mid-edge armor rivets
      for (const [rx, ry] of [
        [bx + 4, by + 4],
        [bx + bw - 7, by + 4],
        [bx + 4, by + bh - 7],
        [bx + bw - 7, by + bh - 7],
        [bx + 4, cy + 18],
        [bx + bw - 7, cy + 18],
      ] as const) {
        rect(ctx, rx, ry, 3, 3, '#ffffff');
      }
      // Horizontal deadbolt bars locked across the body
      rect(ctx, bx - 6, by + 12, 8, 8, '#c0c0c0');
      rect(ctx, bx + bw - 2, by + 12, 8, 8, '#c0c0c0');
      rect(ctx, bx - 6, by + bh - 20, 8, 8, '#c0c0c0');
      rect(ctx, bx + bw - 2, by + bh - 20, 8, 8, '#c0c0c0');
      // Oversized stark keyhole in the center of the lock body
      disc(ctx, cx, by + 28, 11, '#000000');
      ring(ctx, cx, by + 28, 12, '#ffffff');
      for (let ky = 0; ky < 22; ky++) {
        const hw = 5 + Math.floor(ky * 0.25);
        rect(ctx, cx - hw, by + 35 + ky, hw * 2 + 1, 1, '#000000');
        px(ctx, cx - hw - 1, by + 35 + ky, '#c0c0c0');
        px(ctx, cx + hw + 1, by + 35 + ky, '#c0c0c0');
      }
      rect(ctx, cx - 11, by + 57, 23, 2, '#c0c0c0');
    },
    detail: ({ ctx, t, W, cx, cy }) => {
      for (let x = 17; x < W - 17; x += 44) {
        if (Math.abs(x - cx) < 42) continue;
        const s = 0.5 + 0.5 * Math.sin(t * 0.9 + x);
        rect(ctx, x + 5, cy, 3, 3, s > 0.7 ? '#ffffff' : '#808080');
      }
    },
  },
  critters: {
    motions: [MotionType.Float],
    count: 2,
    exitLabels: variants('layers.smram.exit'),
    draw: ({ px }) => {
      // Silent silver vault sentinel
      px(0, 0, 6, 6, '#808080');
      px(1, 1, 4, 4, '#c0c0c0');
      px(2, 2, 2, 2, '#ffffff');
    },
  },
  sound: {
    timbre: { wave: 'pulse25', filterHz: 1300, q: 2.2, gainScale: 0.8, reverbWet: 0 },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
  },
};
