/** Layer `userspace`: The operating system’s own programs and services. */
import { hash, prows, vgrad, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef } from '../render/v4/kit';
import type { Rect } from '../render/v4/place';
import { irqPulse } from './shared/ambient-kit';
import { R, fill, line, mod, rect } from './shared/draw-kit';
import { C } from './shared/mid-props';
import { text, variants } from '../text';
import type { LayerArt } from './types';

const PROPS: EntityDef[] = [
  // Replaced static us-daemon (daemons now roam as living critters) with a clean service pipe manifold.
  ent(
    'us-manifold',
    [[24, 12]],
    (p, w) => {
      p.r(0, 7, w, 2, C.l);
      p.r(0, 9, w, 1, C.d);
      for (let k = 2; k < w - 2; k += 6) {
        p.r(k, 2, 4, 5, C.d);
        p.r(k + 1, 3, 2, 3, C.k);
      }
    },
    {
      anim: (p, w, _h, _v, t) => {
        const active = Math.floor(t * 2) % 4;
        for (let i = 0; i < 4; i++) {
          const x = 3 + i * 6;
          if (x + 2 >= w) break;
          p.r(x, 4, 2, 1, i === active ? C.G : C.c);
        }
      },
    },
  ),
  ent(
    'us-pipe',
    [[26, 13]],
    (p, w) => {
      // Horizontal conduit carried on two bolted floor stanchions.
      p.r(0, 2, w, 3, C.d);
      p.r(0, 2, w, 1, C.l);
      p.r(0, 1, 2, 5, C.l);
      p.r(w - 2, 1, 2, 5, C.l);
      for (const x of [5, w - 7]) {
        p.r(x, 5, 2, 6, C.d);
        p.r(x, 5, 1, 6, C.l);
        p.r(x - 2, 11, 6, 1, C.l);
        p.p(x - 2, 11, C.W);
      }
    },
    {
      anim: (p, w, _h, _v, t) => {
        for (let k = 0; k < 2; k++) p.r(2 + mod(t * (10 + k * 5) + k * 9, w - 5), 3, 2, 1, C.C);
      },
    },
  ),
  ent(
    'us-tty',
    [[18, 17]],
    (p) => {
      // CRT on a sloped keyboard desk and pedestal.
      p.r(3, 0, 12, 9, C.l);
      p.r(3, 0, 12, 1, C.W);
      p.r(3, 0, 1, 9, C.W);
      p.r(4, 1, 10, 7, C.k);
      p.r(5, 2, 4 + R(p.h(0) * 4), 1, C.g);
      p.r(5, 4, 2 + R(p.h(1) * 5), 1, C.g);
      p.r(7, 9, 4, 1, C.d);
      p.r(1, 10, 16, 2, C.l);
      p.r(1, 10, 16, 1, C.W);
      for (let k = 0; k < 7; k++) p.p(3 + k * 2, 11, C.d);
      p.r(4, 12, 10, 3, C.d);
      p.r(4, 12, 1, 3, C.l);
      p.r(2, 15, 14, 1, C.l);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (Math.floor(t * 1.9) % 2 === 0) p.r(5, 6, 2, 1, C.G);
      },
      noFlip: true,
    },
  ),
  ent(
    'us-crontower',
    [[12, 24]],
    (p) => {
      p.r(2, 8, 8, 16, C.d);
      p.r(2, 8, 1, 16, C.l);
      p.r(1, 6, 10, 2, C.l);
      p.r(4, 2, 4, 4, C.d);
      p.r(5, 0, 2, 2, C.R);
      p.disc(6, 13, 3, C.W);
      for (let y = 18; y < 23; y += 2) p.p(5 + (y % 4 ? 0 : 1), y, C.Y);
    },
    { floor: true,
      anim: (p, _w, _h, _v, t) => {
        const a = t * 0.6 - Math.PI / 2;
        p.l(6, 13, 6 + Math.cos(a) * 2.4, 13 + Math.sin(a) * 2.4, C.k);
      },
      noFlip: true,
    },
  ),
  ent('us-socket', [[18, 8]], (p) => {
    p.r(0, 2, 7, 4, C.l);
    p.r(7, 3, 2, 1, C.Y);
    p.r(7, 5, 2, 1, C.Y);
    p.r(10, 1, 6, 6, C.d);
    p.r(11, 3, 1, 1, C.k);
    p.r(11, 5, 1, 1, C.k);
    p.r(16, 3, 2, 2, C.d);
  }),
  ent('us-shm', [[14, 19]], (p) => {
    p.r(1, 1, 12, 8, C.c);
    p.r(0, 0, 14, 2, C.C);
    p.r(1, 8, 12, 1, C.b);
    p.r(3, 3, 8, 1, C.C);
    p.r(2, 9, 1, 10, C.d);
    p.r(11, 9, 1, 10, C.d);
    p.l(2, 11, 11, 17, C.d);
    p.l(11, 11, 2, 17, C.d);
  }, { floor: true }),
  ent(
    'us-signal',
    [[12, 19]],
    (p) => {
      p.r(1, 0, 1, 19, C.l);
      p.r(0, 18, 3, 1, C.d);
    },
    { floor: true,
      anim: (p, _w, _h, _v, t) => {
        for (let x = 0; x < 9; x++) {
          const dy = R(Math.sin(t * 4 - x * 0.7) * 1);
          p.r(2 + x, 1 + dy, 1, 5, x < 4 ? C.R : C.r);
        }
      },
    },
  ),
  ent('us-mailbox', [[11, 15]], (p) => {
    p.r(5, 7, 1, 8, C.d);
    p.r(1, 1, 8, 6, C.b);
    p.r(2, 0, 6, 1, C.b);
    p.r(1, 3, 8, 1, C.B);
    p.r(9, 1, 1, 4, C.l);
    if (p.h(0) > 0.4) p.r(9, 1, 2, 2, C.R);
    p.r(3, 5, 4, 1, C.k);
  }, { floor: true }),
  ent('us-fork', [[13, 17]], (p) => {
    p.r(6, 8, 1, 9, C.l);
    p.r(4, 16, 5, 1, C.d);
    p.r(0, 1, 6, 3, C.g);
    p.r(7, 4, 6, 3, C.g);
    p.p(0, 2, C.G);
    p.p(12, 5, C.G);
    p.r(1, 2, 3, 1, C.W);
    p.r(9, 5, 3, 1, C.W);
  }, { floor: true }),
  ent(
    'us-callbox',
    [[10, 15]],
    (p) => {
      // Night-city IPC callbox / status bollard.
      p.r(2, 2, 6, 13, C.b);
      p.r(2, 2, 1, 13, C.B);
      p.r(1, 2, 8, 1, C.l);
      p.r(3, 4, 4, 4, C.k);
      p.r(4, 5, 2, 2, C.C);
      p.r(3, 9, 4, 1, C.l);
      p.r(1, 14, 8, 1, C.d);
    },
    { floor: true,
      anim: (p, _w, _h, _v, t) => {
        const on = Math.floor(t * 1.6) % 2 === 0;
        p.r(4, 0, 2, 2, on ? C.C : C.c);
        if (on) p.glow(5, 1, 5, 'rgba(85,255,255,0.35)');
      },
      noFlip: true,
    },
  ),
  ent(
    'us-firewall',
    [[18, 16]],
    (p, w) => {
      // A solid brick wall with fixed flame tongues on top (the anim only flickers them).
      for (let k = 0; k < 4; k++) {
        const x = 1 + k * 4;
        p.r(x, 3 - (k % 2), 3, 4 + (k % 2), C.R);
        p.r(x + 1, 4 - (k % 2), 1, 2, C.Y);
      }
      p.r(0, 6, w, 10, C.r);
      p.r(0, 6, w, 1, C.R);
      p.r(0, 9, w, 1, C.k);
      p.r(0, 12, w, 1, C.k);
      for (const x of [5, 11, 17]) {
        p.r(x, 7, 1, 2, C.k);
        p.r(x, 13, 1, 3, C.k);
      }
      for (const x of [2, 8, 14]) p.r(x, 10, 1, 2, C.k);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (let k = 0; k < 4; k++) {
          const fh = 1 + R((Math.sin(t * 7 + k * 2.1) * 0.5 + 0.5) * 3);
          p.r(2 + k * 4, 4 - fh, 1, fh, k % 2 ? C.R : C.Y);
        }
      },
    },
  ),
  ent('us-container', [[22, 10]], (p) => {
    const col = p.pick([C.c, C.r, C.g, C.b], 0);
    p.r(0, 0, 22, 10, col);
    for (let x = 1; x < 21; x += 2) p.r(x, 1, 1, 8, C.k);
    p.frame(0, 0, 22, 10, C.d);
    p.r(17, 3, 2, 4, C.l);
  }, { floor: true }),
  ent('us-pidpunch', [[12, 14]], (p) => {
    // Cast-iron ticket dispenser on a curb post; a curled paper stub hangs from its slot.
    p.r(2, 1, 8, 8, C.r);
    p.r(2, 1, 8, 1, C.R);
    p.r(2, 1, 1, 8, C.R);
    p.r(9, 2, 1, 7, C.d);
    p.r(3, 6, 6, 1, C.k);
    p.r(3, 7, 2, 3, C.W);
    p.p(2, 10, C.W);
    p.r(5, 9, 2, 3, C.l);
    p.r(3, 12, 6, 1, C.d);
  }),
  ent('us-envrack', [[22, 22]], (p) => {
    // Pegboard A-frame hung with the environment's key tags.
    p.r(2, 1, 18, 13, C.d);
    p.r(2, 1, 18, 1, C.l);
    p.r(2, 1, 1, 13, C.l);
    for (let k = 0; k < 4; k++)
      for (let r = 0; r < 2; r++) {
        const x = 4 + k * 4;
        const y = 3 + r * 5;
        p.p(x + 1, y, C.l);
        p.r(x, y + 1, 3, 3, (k + r) % 2 ? C.C : C.Y);
        p.p(x + 1, y + 1, C.k);
      }
    p.l(5, 14, 2, 20, C.l);
    p.l(16, 14, 19, 20, C.l);
    p.r(1, 20, 4, 1, C.d);
    p.r(17, 20, 4, 1, C.d);
  }),
  ent(
    'us-logdrum',
    [[24, 30]],
    (p) => {
      // Teleprinter pedestal: glass-domed paper reel on top, a strip spilling into a wire basket.
      p.disc(8, 7, 5, C.c);
      p.disc(8, 7, 3, C.W);
      p.disc(8, 7, 1, C.d);
      p.r(4, 5, 1, 2, C.W);
      p.r(2, 11, 13, 1, C.l);
      p.r(1, 12, 15, 15, C.d);
      p.r(1, 12, 15, 1, C.l);
      p.r(1, 12, 1, 15, C.l);
      p.r(3, 16, 11, 2, C.k);
      for (let k = 0; k < 5; k++) {
        p.p(3 + k * 2, 21, C.l);
        p.p(4 + k * 2, 23, C.l);
      }
      p.r(14, 16, 4, 1, C.W);
      p.r(17, 16, 1, 7, C.W);
      p.frame(16, 22, 7, 7, C.l);
      p.r(17, 24, 5, 4, C.k);
      p.r(18, 25, 3, 1, C.W);
      p.r(2, 27, 3, 2, C.d);
      p.r(12, 27, 3, 2, C.d);
    },
    { floor: true,
      anim: (p, _w, _h, _v, t) => {
        const a = t * 2;
        p.p(8 + R(Math.cos(a) * 2), 7 + R(Math.sin(a) * 2), C.d);
      },
      noFlip: true,
    },
  ),
  ent('us-swaptrunk', [[22, 16]], (p) => {
    // Steamer trunk whose seam spills pages: swap space.
    p.r(3, 1, 16, 1, C.Y);
    p.r(1, 2, 20, 4, C.n);
    p.r(1, 2, 20, 1, C.Y);
    p.r(1, 6, 20, 8, C.n);
    p.r(1, 2, 1, 12, C.Y);
    p.r(4, 2, 2, 12, C.k);
    p.r(16, 2, 2, 12, C.k);
    p.r(10, 6, 2, 3, C.Y);
    p.p(10, 7, C.k);
    p.r(19, 5, 3, 2, C.W);
    p.r(20, 7, 2, 1, C.l);
    p.r(2, 14, 3, 1, C.d);
    p.r(17, 14, 3, 1, C.d);
  }),
  ent('us-ulimit', [[24, 20]], (p) => {
    // Height-limit barrier: a hazard-striped bar across two posts.
    for (const x of [2, 19]) {
      p.r(x, 3, 3, 14, C.d);
      p.r(x, 3, 1, 14, C.l);
      p.r(x - 1, 2, 5, 1, C.l);
      p.r(x - 1, 17, 5, 1, C.l);
    }
    for (let k = 0; k < 10; k++) {
      const x = 4 + k * 2;
      p.r(x, 5, 2, 2, k % 2 ? C.k : C.Y);
      p.r(x, 7, 2, 2, k % 2 ? C.Y : C.k);
    }
  }),
  ent('us-velvet', [[14, 14]], (p) => {
    // Two brass stanchions and a red rope: the sudo line.
    for (const x of [2, 10]) {
      p.r(x - 1, 1, 4, 3, C.Y);
      p.r(x, 4, 2, 8, C.Y);
      p.r(x + 1, 4, 1, 8, C.n);
      p.r(x - 1, 12, 4, 1, C.Y);
    }
    p.l(3, 4, 5, 6, C.R);
    p.r(5, 6, 4, 1, C.R);
    p.l(9, 6, 10, 5, C.R);
    p.l(3, 5, 5, 7, C.r);
    p.r(5, 7, 4, 1, C.r);
    p.l(9, 7, 10, 6, C.r);
  }),
    ent('us-hydrant', [[9, 13]], (p) => {
      p.r(2, 2, 5, 11, '#aa0000');
      p.r(3, 0, 3, 2, '#ff5555');
      p.r(0, 5, 9, 2, '#ff5555');
      p.r(1, 12, 7, 1, '#555555');
    }, { floor: true }),
    ent('us-meter', [[10, 14]], (p) => {
      p.r(4, 6, 2, 8, '#555555');
      p.box(1, 0, 8, 7, '#000000', '#aaaaaa');
      p.r(3, 2, 4, 2, '#55ff55');
    }, { floor: true }),
];

const ANCHORS: EntityDef[] = [
  ent(
    'us-skyline',
    [[66, 74]],
    (p) => {
      // A city block: four towers of different heights sharing a base, a water tank on one roof.
      const towers: [number, number, number][] = [
        [0, 14, 40],
        [13, 16, 66],
        [30, 13, 52],
        [44, 20, 30],
      ];
      towers.forEach(([x, w, h], i) => {
        const top = 74 - h;
        p.r(x, top, w, h, i % 2 ? C.b : '#000088');
        p.r(x, top, 1, h, C.B);
        p.r(x, top, w, 1, C.B);
        for (let r = 0; r * 3 + 4 < h; r++)
          for (let k = 0; k * 2 + 3 < w; k++) if (p.h(i * 400 + r * 17 + k) < 0.33) p.p(x + 2 + k * 2, top + 3 + r * 3, p.h(r * 3 + k + i) > 0.8 ? C.C : C.Y);
      });
      p.r(20, 0, 1, 8, C.l);
      p.r(48, 38, 10, 6, C.c);
      p.r(49, 44, 1, 3, C.d);
      p.r(56, 44, 1, 3, C.d);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (Math.floor(t * 0.9) % 2 === 0) {
          p.r(19, 0, 3, 2, C.R);
          p.glow(20, 1, 6, 'rgba(255,85,85,0.45)');
        }
      },
      noFlip: true,
    },
  ),
  ent(
    'us-pid1',
    [[26, 80]],
    (p) => {
      // PID 1: the tallest spire, everything else forked from it.
      p.r(7, 14, 12, 66, C.d);
      p.r(7, 14, 1, 66, C.l);
      p.r(5, 30, 16, 2, C.l);
      p.r(3, 56, 20, 2, C.l);
      p.r(0, 76, 26, 4, C.b);
      p.r(10, 6, 6, 8, C.d);
      p.r(12, 0, 2, 6, C.l);
      for (let y = 18; y < 74; y += 4)
        for (let x = 10; x < 18; x += 3) if (p.h(x * 31 + y) < 0.45) p.r(x, y, 2, 2, p.h(x + y) > 0.7 ? C.C : C.Y);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const on = Math.floor(t * 0.8) % 2 === 0;
        p.r(11, 0, 4, 2, on ? C.G : C.g);
        if (on) p.glow(13, 1, 8, 'rgba(85,255,85,0.35)');
      },
      noFlip: true,
    },
  ),
];

export const userspace: LayerArt = {
  family: 'userspace',
  blurb: text('layers.userspace.blurb'),
  palette: 'cga16',
  form: 'shell',
  cursor: 'block',
  stackTheme: {
    accent: '#5c85ff',
    hi: '#99d6ff',
    tint: 'rgba(92, 133, 255, 0.14)',
    border: 'rgba(92, 133, 255, 0.38)',
    anim: 'blink',
    icon: [
      '#########',
      '#       #',
      '# +     #',
      '#  +    #',
      '#   +   #',
      '#  +    #',
      '# + +++ #',
      '#       #',
      '#########',
    ],
  },
  topicTags: ['os', 'networking', 'concurrency'],
  library: { own: PROPS, anchors: ANCHORS, density: 4.4, anchorCount: 2, far: 0.45, floorOffset: 6 },
  keepOut: (_top, bottom, W) => {
    const out: Rect[] = [{ x: 0, y: bottom - 6, w: W, h: 6 }];
    for (let x = 12; x < W; x += 40) out.push({ x: x - 2, y: bottom - 18, w: 5, h: 12 });
    return out;
  },
  fog: [0, 0, 0],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000000');
    prows(b, 0.1, 14, (y, i) => {
      if (hash(i * 3) > 0.12) return;
      fill(ctx, hash(i * 3 + 1) * b.w, y, 1, 1, hash(i * 3 + 2) > 0.7 ? '#ffffff' : '#555555');
    });
    entities();
    fill(ctx, 0, b.bottom - 6, b.w, 6, '#0000aa');
    vgrad(ctx, b, b.bottom - 22, b.bottom - 6, [
      [0, 'rgba(0,0,170,0)'],
      [1, 'rgba(0,0,170,0.8)'],
    ]);
    for (let x = 12; x < b.w; x += 40) {
      fill(ctx, x, b.bottom - 16, 1, 10, '#555555');
      fill(ctx, x - 1, b.bottom - 17, 3, 1, '#ffff55');
    }
  },
  setpiece: {
    base: ({ ctx, t, W, cx, bot, H }) => {
      // Full-bleed Midnight Metropolis: 2-tier depth skyline edge-to-edge + elevated transit monorail + colossal PID 1 spire + sweeping searchlight!
      const base = bot - 6;
      // Distant dark silhouette skyscrapers (tallest tier)
      for (let x = 0; x < W; x += 22) {
        const bh = 55 + Math.floor(hash(x * 17 + 3) * 75);
        rect(ctx, x, base - bh, 20, bh, '#0000aa');
        for (let wy = base - bh + 6; wy < base - 20; wy += 8) {
          if (hash(x * 13 + wy) < 0.25) rect(ctx, x + 4, wy, 2, 2, '#555555');
          if (hash(x * 29 + wy) < 0.2) rect(ctx, x + 12, wy, 2, 2, '#00aaaa');
        }
      }
      // Closer mid-rise skyline
      for (let x = 6; x < W; x += 18) {
        const bh = 26 + Math.floor(hash(x * 11 + 9) * 46);
        rect(ctx, x, base - bh, 15, bh, '#0000aa');
        rect(ctx, x, base - bh, 1, bh, '#5555ff');
        rect(ctx, x, base - bh, 15, 1, '#5555ff');
        for (let wy = base - bh + 4; wy < base - 6; wy += 6) {
          for (let wx = x + 3; wx < x + 12; wx += 4) {
            if (hash(wx * 31 + wy) < 0.3) rect(ctx, wx, wy, 2, 2, hash(wx + wy) > 0.7 ? '#55ffff' : '#555555');
          }
        }
      }
      // Colossal central PID 1 brutalist arcology spire
      const spireH = Math.min(150, Math.max(90, R(H * 0.72)));
      rect(ctx, cx - 18, base - spireH, 36, spireH, '#0000aa');
      rect(ctx, cx - 18, base - spireH, 2, spireH, '#5555ff');
      rect(ctx, cx - 10, base - spireH - 22, 20, 22, '#555555');
      rect(ctx, cx - 1, base - spireH - 42, 2, 20, '#aaaaaa');
      // Sweeping diagonal searchlight beam from PID 1 spire
      const sa = -Math.PI / 2 + Math.sin(t * 0.6) * 0.7;
      line(ctx, cx, base - spireH - 42, cx + Math.cos(sa) * 90, base - spireH - 42 + Math.sin(sa) * 70, '#00aaaa');
      rect(ctx, cx - 2, base - spireH - 44, 4, 3, Math.floor(t * 1.8) % 2 ? '#55ff55' : '#00aa00');
      // Elevated night-city monorail track with moving lit train!
      const railY = base - 22;
      rect(ctx, 0, railY, W, 2, '#555555');
      const trainX = mod(t * 28, W + 40) - 20;
      rect(ctx, trainX, railY - 4, 22, 4, '#aaaaaa');
      rect(ctx, trainX + 2, railY - 3, 18, 2, '#ffff55');
    },
    detail: ({ ctx, t, W, top }) => {
      // An advertising blimp crosses the night sky.
      const bx = mod(t * 9 + W * 0.6, W + 80) - 40;
      const by = top + 22;
      rect(ctx, bx - 16, by, 32, 9, '#555555');
      rect(ctx, bx - 14, by - 2, 28, 2, '#aaaaaa');
      for (let k = 0; k < 6; k++) if (Math.floor(t * 3 + k) % 2 === 0) rect(ctx, bx - 12 + k * 4, by + 3, 2, 3, '#ffff55');
      rect(ctx, bx + 14, by + 3, 4, 3, '#aaaaaa');
    },
  },
  ambient: irqPulse('#7ee0a1'),
  critters: {
    motions: [MotionType.Patrol, MotionType.Hop, MotionType.Perch],
    count: 3,
    exitLabels: variants('layers.userspace.exit'),
    draw: ({ px, ink, t, phase, variant, dir, perched }) => {
      const bodies = ['#ff5555', '#ff9f43', '#ff55ff', '#55ffff', '#ffff55'];
      const darks = ['#aa0000', '#aa5500', '#aa00aa', '#00aaaa', '#aa5500'];
      const body = bodies[variant % bodies.length]!;
      const dark = darks[variant % darks.length]!;
      const step = perched ? 0 : Math.floor(t * 7 + phase) % 2;
      px(0, -1, 1, 2, body);
      px(5, -1, 1, 2, body);
      px(0, 0, 6, 6, dark);
      px(0, 2, 6, 2, body);
      px(1, 2, 1, 1, ink);
      px(4, 2, 1, 1, ink);
      px(1, 6, 1, 1 + step, dark);
      px(4, 6, 1, 2 - step, dark);
      px(dir > 0 ? 6 : -2, 2 + step, 2, 2, '#ffff55');
    },
  },
  sound: {
    timbre: { wave: 'pulse12', filterHz: 2800, q: 2.0, gainScale: 0.86, reverbWet: 0.16 },
    ambienceLevel: 0.06,
    drones: [{ freq: 82.41, wave: 'triangle', filterHz: 190, gain: 0.35 }],
    critterExit: { freq: 520, crush: false },
    critterCall: (snd, t, p) => {
      // Mischievous low crunchy daemon mutter / double chuckle
      const base = 175 + Math.random() * 45;
      snd.voice({ freq: base, toFreq: base * 0.82, at: t, dur: 0.055, wave: 'pulse12', filterHz: 1100, gain: 0.2, pan: p, crush: true });
      snd.voice({ freq: base * 1.15, toFreq: base * 0.9, at: t + 0.068, dur: 0.065, wave: 'pulse12', filterHz: 1200, gain: 0.18, pan: p, crush: true });
    },
    artifact: (snd, t, pan) => {
      // Rapid 2-pip bit-crushed IRQ / bus-trace packet burst + tiny static tick
      snd.noiseBurst({ at: t, dur: 0.016, type: 'bandpass', filterHz: 2400, gain: 0.06, pan, crush: true });
      snd.voice({ freq: 440 + Math.floor(Math.random() * 4) * 110, at: t, dur: 0.032, wave: 'pulse12', gain: 0.065, pan, crush: true });
      snd.voice({ freq: 660 + Math.floor(Math.random() * 3) * 90, at: t + 0.042, dur: 0.028, wave: 'pulse12', gain: 0.05, pan: -pan * 0.5, crush: true });
    },
  },
};
