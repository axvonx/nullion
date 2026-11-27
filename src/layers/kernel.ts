/** Layer `kernel`: The core of the operating system, in charge of everything above. */
import { SEAM_H, hash, offscreen, prows, px as artPx, tiled, vgrad, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef, type Pen } from '../render/v4/kit';
import { irqPulse } from './shared/ambient-kit';
import { KWALL, R, TAU, fill, giantCog, mod, rect } from './shared/draw-kit';
import { C } from './shared/mid-props';
import { text, variants } from '../text';
import type { LayerArt } from './types';
import { userspace } from './userspace';

// Kernel (CGA 16): the machine room. Gears, wheels, cabinets, bells and logs.
function cog(p: Pen, cx: number, cy: number, r: number, a: number, body: string, hi: string) {
  p.disc(cx, cy, r - 1, body);
  const teeth = Math.max(6, r + 3);
  for (let k = 0; k < teeth; k++) {
    const ang = a + (k * TAU) / teeth;
    p.r(cx + R(Math.cos(ang) * r) - 0, cy + R(Math.sin(ang) * r), 1, 1, body);
  }
  p.disc(cx, cy, Math.max(0, r - 4), C.k);
  p.p(cx, cy, hi);
}

const PROPS: EntityDef[] = [
  ent(
    'kr-gauge',
    [[20, 15]],
    (p) => {
      // Bolted pressure-gauge housing on a stand; the needle pivots at the hub.
      p.r(0, 0, 20, 10, C.d);
      p.r(0, 0, 20, 1, C.l);
      p.r(0, 0, 1, 10, C.l);
      for (const [x, y] of [[2, 1], [17, 1], [2, 8], [17, 8]] as const) p.p(x, y, C.W);
      p.r(3, 2, 14, 6, C.W);
      p.r(4, 6, 12, 1, C.r);
      for (let x = 4; x <= 15; x += 3) p.p(x, 5, C.k);
      p.disc(10, 7, 1, C.d);
      p.r(8, 10, 4, 3, C.d);
      p.r(8, 10, 1, 3, C.l);
      p.r(5, 13, 10, 1, C.l);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const na = -1.6 + Math.sin(t) * 0.7;
        p.l(10, 7, 10 + Math.cos(na) * 4, 7 + Math.sin(na) * 4, C.r);
      },
      noFlip: true,
    },
  ),
  ent(
    'kr-schedwheel',
    [[17, 18]],
    (p) => {
      // Spoked wheel on a dark post; the live overlay turns the coloured run-queue pegs.
      p.disc(8, 8, 7, C.l);
      p.disc(8, 8, 6, C.k);
      p.r(1, 6, 1, 3, C.W);
      p.r(7, 8, 3, 10, C.d);
      p.r(7, 8, 1, 10, C.l);
      p.r(4, 17, 9, 1, C.d);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const cols = [C.R, C.G, C.Y, C.C, C.M, C.B];
        for (let k = 0; k < 6; k++) {
          const a = t * 0.8 + (k * TAU) / 6;
          const x = 8 + R(Math.cos(a) * 5);
          const y = 8 + R(Math.sin(a) * 5);
          p.l(8, 8, x, y, C.d);
          p.r(x - 1, y - 1, 2, 2, cols[k]!);
        }
        p.r(7, 7, 3, 3, C.W);
      },
      noFlip: true,
    },
  ),
  ent('kr-pagetable', [[15, 19]], (p) => {
    p.r(0, 0, 15, 19, C.d);
    p.r(0, 0, 15, 1, C.l);
    for (let k = 0; k < 4; k++) {
      p.r(1, 2 + k * 4, 13, 3, C.k);
      p.r(6, 3 + k * 4, 3, 1, C.l);
      if (p.h(k) > 0.5) p.p(12, 3 + k * 4, C.G);
    }
    p.r(1, 18, 2, 1, C.k);
    p.r(12, 18, 2, 1, C.k);
  }),
  ent(
    'kr-irqbell',
    [[14, 14]],
    (p) => {
      // A brass bell hung by its loop from a wall-bolted bracket arm.
      p.r(2, 0, 10, 2, C.d);
      p.r(2, 0, 10, 1, C.l);
      p.r(0, 0, 3, 5, C.d);
      p.r(0, 0, 1, 5, C.l);
      p.r(7, 2, 1, 2, C.l);
      p.r(5, 4, 5, 2, C.Y);
      p.r(4, 6, 7, 3, C.Y);
      p.r(3, 9, 9, 2, C.Y);
      p.r(5, 5, 1, 5, C.W);
      p.r(10, 6, 1, 4, C.n);
      p.r(7, 11, 2, 2, C.n);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const q = mod(t * 0.7, 1);
        if (q >= 0.25) return;
        const swing = R(Math.sin(q * 50) * 1.4);
        if (swing === 0) return;
        p.r(5 + swing, 11, 2, 2, C.n);
        p.p(13, 5, C.W);
        p.p(13, 8, C.W);
      },
      noFlip: true,
    },
  ),
  ent('kr-mutex', [[13, 13]], (p) => {
    p.r(2, 0, 5, 1, C.l);
    p.r(1, 1, 1, 4, C.l);
    p.r(7, 1, 1, 4, C.l);
    p.r(0, 4, 9, 8, C.n);
    p.r(0, 4, 9, 1, C.Y);
    p.r(4, 7, 1, 2, C.k);
    p.r(9, 9, 4, 1, C.Y);
    p.r(11, 10, 1, 2, C.Y);
  }),
  // Replaced kr-oom skull sign with a clean machine-room IRQ load meter.
  // Replaced static kr-kthread robot (thread-bots now zip as living critters) with a scheduler slot rack.
  ent(
    'kr-semaphore',
    [[8, 16]],
    (p) => {
      p.r(0, 0, 8, 12, C.d);
      p.r(3, 12, 2, 4, C.d);
      for (let k = 0; k < 3; k++) p.r(2, 1 + k * 4, 4, 3, C.k);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const s = Math.floor(t * 0.7) % 3;
        p.r(2, 1 + s * 4, 4, 3, [C.R, C.Y, C.G][s]!);
      },
      noFlip: true,
    },
  ),
  // Replaced literal dog kr-watchdog with a readable hardware watchdog timer rack (ticking bar + reset LED).
  ent('kr-numabridge', [[14, 10]], (p) => {
    // Two socketed pedestals joined by a twin-arch braided cable.
    for (const x of [1, 9]) {
      p.r(x, 4, 4, 5, C.d);
      p.r(x, 4, 4, 1, C.l);
      p.p(x + 1, 6, C.k);
    }
    ([[4, 4], [5, 3], [6, 3], [7, 4], [8, 3], [9, 3], [10, 4]] as const).forEach(([x, y], i) => p.p(x, y, i % 2 ? C.n : C.Y));
  }),
  ent('kr-teletype', [[18, 16]], (p) => {
    // Cast-iron tape puncher on stubby feet, curling paper tape out of its front slot.
    p.r(1, 1, 15, 2, C.l);
    p.r(1, 1, 15, 1, C.W);
    p.r(1, 3, 15, 9, C.d);
    p.r(1, 3, 1, 9, C.l);
    p.r(4, 6, 8, 2, C.k);
    for (let k = 0; k < 5; k++) p.p(4 + k * 2, 10, C.l);
    p.r(5, 8, 3, 4, C.W);
    p.r(8, 11, 4, 1, C.W);
    p.p(11, 10, C.W);
    p.r(2, 12, 2, 2, C.d);
    p.r(13, 12, 2, 2, C.d);
  }),
  ent('kr-oops', [[12, 12]], (p) => {
    // A cracked headstone on a stone plinth: the oops marker.
    p.r(3, 0, 6, 1, C.l);
    p.r(2, 1, 8, 8, C.l);
    p.r(2, 1, 1, 8, C.W);
    p.r(9, 2, 1, 7, C.d);
    for (const [x, y] of [[7, 2], [6, 3], [6, 4], [5, 5], [6, 6], [5, 7]] as const) p.p(x, y, C.k);
    p.r(1, 9, 10, 2, C.d);
    p.r(1, 9, 10, 1, C.l);
  }),
  ent('kr-slabtray', [[19, 11]], (p) => {
    // Steel parts tray with four equal bays, one identical cylinder seated in each.
    p.r(1, 3, 17, 6, C.l);
    p.r(1, 3, 17, 1, C.W);
    p.r(2, 4, 15, 4, C.d);
    for (const x of [5, 9, 13]) p.r(x, 4, 1, 4, C.l);
    for (const bx of [2, 6, 10, 14]) {
      p.r(bx, 4, 1, 4, C.W);
      p.r(bx + 1, 4, 1, 4, C.Y);
      p.r(bx + 2, 4, 1, 4, C.n);
    }
    p.r(2, 9, 2, 1, C.d);
    p.r(15, 9, 2, 1, C.d);
  }),
  ent(
    'kr-metronome',
    [[10, 14]],
    (p) => {
      // Tapered iron metronome on a weighted base; a brass weight rides the pendulum arm.
      for (let y = 2; y <= 10; y++) {
        const g = Math.floor((y - 2) / 3);
        p.r(3 - g, y, 4 + 2 * g, 1, C.d);
        p.p(3 - g, y, C.l);
      }
      p.r(4, 5, 2, 4, C.Y);
      p.l(5, 10, 7, 0, C.W);
      p.r(6, 3, 2, 2, C.Y);
      p.r(0, 11, 10, 2, C.d);
      p.r(0, 11, 10, 1, C.l);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (Math.floor(t * 2) % 2 === 0) p.p(5, 6, C.G);
      },
      noFlip: true,
    },
  ),
  ent('kr-rolodex', [[12, 13]], (p) => {
    // Rotary card file: one bright tabbed card flipped out to the front.
    p.disc(6, 5, 4, C.l);
    p.disc(6, 5, 1, C.d);
    for (let k = 0; k < 8; k++) {
      const a = (k * TAU) / 8;
      p.p(6 + R(Math.cos(a) * 3), 5 + R(Math.sin(a) * 3), C.W);
    }
    p.r(1, 7, 5, 3, C.Y);
    p.r(1, 6, 2, 1, C.R);
    p.r(10, 4, 2, 3, C.d);
    p.r(5, 9, 2, 2, C.d);
    p.r(2, 11, 8, 1, C.d);
  }),
  ent('kr-watchdog', [[12, 16]], (p) => {
    // Brass hourglass in a wall bracket; sand runs toward the trip lever below.
    p.r(0, 0, 2, 14, C.d);
    p.r(0, 0, 1, 14, C.l);
    p.r(2, 1, 9, 1, C.Y);
    p.r(2, 12, 9, 1, C.Y);
    const widths = [7, 5, 3, 1, 1, 1, 1, 3, 5, 7];
    widths.forEach((wd, i) => p.r(6 - (wd >> 1), 2 + i, wd, 1, C.c));
    p.r(5, 3, 3, 1, C.Y);
    p.r(6, 5, 1, 4, C.Y);
    p.r(4, 10, 5, 2, C.Y);
    p.r(3, 14, 7, 1, C.R);
    p.p(2, 14, C.l);
  }),
  ent('kr-vfsmanifold', [[26, 29]], (p) => {
    // Cast-iron junction: a red handwheel over four coloured branch pipes.
    const pipe = (x: number, y: number, w: number, hi: string, lo: string) => {
      p.r(x, y, w, 1, hi);
      p.r(x, y + 1, w, 2, lo);
    };
    pipe(2, 12, 7, C.C, C.c);
    pipe(2, 18, 7, C.G, C.g);
    pipe(17, 12, 7, C.Y, C.n);
    pipe(17, 18, 7, C.M, C.m);
    for (const [x, y] of [[1, 11], [1, 17], [24, 11], [24, 17]] as const) p.r(x, y, 1, 5, C.l);
    p.r(9, 11, 8, 10, C.l);
    p.r(9, 11, 1, 10, C.W);
    p.r(16, 11, 1, 10, C.d);
    p.r(11, 21, 4, 5, C.d);
    p.r(11, 21, 1, 5, C.l);
    p.r(5, 26, 16, 2, C.d);
    p.r(5, 26, 16, 1, C.l);
    p.p(6, 27, C.W);
    p.p(19, 27, C.W);
    p.r(12, 8, 2, 3, C.d);
    p.ring(13, 5, 4, C.R);
    p.l(13, 1, 13, 9, C.R);
    p.l(9, 5, 17, 5, C.R);
    p.disc(13, 5, 1, C.W);
  }),
  ent('kr-callboard', [[20, 16]], (p) => {
    // Wooden annunciator with four shutters; the dropped one shows a lit green flag.
    p.r(9, 0, 2, 1, C.l);
    p.r(1, 1, 18, 13, C.n);
    p.r(1, 1, 18, 1, C.Y);
    p.r(1, 1, 1, 13, C.Y);
    for (let k = 0; k < 4; k++) {
      const x = 3 + k * 4;
      if (k === 2) {
        p.r(x, 4, 3, 5, C.k);
        p.r(x, 4, 3, 3, C.G);
        p.p(x, 4, C.W);
        p.r(x, 7, 3, 2, C.Y);
      } else {
        p.r(x, 4, 3, 5, C.Y);
        p.p(x + 1, 6, C.k);
      }
    }
    p.r(3, 11, 14, 2, C.d);
  }),
  ent('kr-rationbox', [[26, 30]], (p) => {
    // Riveted steel locker split by bolted baffles into three unequal metered bays.
    p.r(1, 1, 24, 25, C.d);
    p.r(1, 1, 24, 1, C.l);
    p.r(1, 1, 1, 25, C.l);
    const bays: [number, number, number, string][] = [
      [3, 9, 18, C.Y],
      [14, 5, 12, C.C],
      [21, 3, 7, C.R],
    ];
    for (const [x, w, fill, col] of bays) {
      p.r(x, 3, w, 21, C.k);
      p.r(x, 24 - fill, w, fill, col);
    }
    p.r(12, 3, 2, 21, C.l);
    p.r(19, 3, 2, 21, C.l);
    for (const [x, y] of [[2, 2], [23, 2], [2, 24], [23, 24]] as const) p.p(x, y, C.W);
    p.r(3, 26, 3, 3, C.d);
    p.r(20, 26, 3, 3, C.d);
  }),
  ent('kr-buddyblocks', [[24, 20]], (p) => {
    // Tiered rack: one full block, one half block, two quarter blocks.
    for (const x of [0, 22]) {
      p.r(x, 0, 2, 19, C.d);
      p.r(x, 0, 1, 19, C.l);
    }
    for (const y of [6, 12, 18]) p.r(2, y, 20, 1, C.l);
    const blk = (x: number, y: number, w: number, hi: string, lo: string) => {
      p.r(x, y, w, 5, hi);
      p.r(x, y + 4, w, 1, lo);
      p.r(x, y, w, 1, C.W);
    };
    blk(3, 1, 18, C.B, C.b);
    blk(3, 7, 9, C.G, C.g);
    blk(3, 13, 4, C.Y, C.n);
    blk(8, 13, 4, C.R, C.r);
  }),
  ent('kr-dentry', [[20, 18]], (p) => {
    // Pigeonhole rack: the dentry cache, a few holes holding letters.
    p.r(1, 1, 18, 14, C.n);
    p.r(1, 1, 18, 1, C.Y);
    p.r(1, 1, 1, 14, C.Y);
    for (let r = 0; r < 3; r++)
      for (let k = 0; k < 4; k++) {
        const x = 2 + k * 4;
        const y = 3 + r * 4;
        p.r(x, y, 3, 3, C.k);
        if (p.h(r * 4 + k) > 0.45) p.r(x, y + 1, 3, 2, C.W);
      }
    p.r(2, 15, 2, 2, C.d);
    p.r(16, 15, 2, 2, C.d);
  }),
  ent(
    'kr-elevator',
    [[18, 24]],
    (p) => {
      // Elevator car doors ajar over a floor-lamp row: the I/O scheduler's lift.
      p.r(1, 1, 16, 22, C.d);
      p.r(1, 1, 1, 22, C.l);
      p.r(5, 2, 8, 2, C.k);
      p.r(3, 5, 12, 17, C.k);
      p.r(3, 5, 4, 17, C.Y);
      p.r(3, 5, 1, 17, C.W);
      p.r(5, 5, 1, 17, C.n);
      p.r(11, 5, 4, 17, C.Y);
      p.r(13, 5, 1, 17, C.n);
      p.r(8, 12, 2, 4, C.n);
      p.r(1, 22, 16, 1, C.l);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const on = Math.floor(t * 1.2) % 5;
        for (let k = 0; k < 5; k++) p.p(6 + k, 3, k === on ? C.G : C.d);
      },
      noFlip: true,
    },
  ),
  ent('kr-sysrq', [[12, 13]], (p) => {
    // Emergency-stop button on a yellow pedestal: the magic SysRq key.
    p.r(4, 1, 4, 1, C.R);
    p.r(3, 2, 6, 4, C.R);
    p.r(4, 2, 2, 1, C.W);
    p.r(3, 5, 6, 1, C.r);
    p.r(5, 6, 2, 1, C.d);
    p.r(1, 7, 10, 4, C.Y);
    p.r(1, 7, 10, 1, C.W);
    p.r(1, 10, 10, 1, C.n);
    p.p(2, 8, C.k);
    p.p(9, 8, C.k);
  }),
];

const ANCHORS: EntityDef[] = [
  ent(
    'kr-furnace',
    [[60, 54]],
    (p) => {
      // The scheduler's furnace: a brick firebox, a chimney, and a big gear train above it.
      p.r(4, 28, 52, 26, C.r);
      for (let r = 0; r < 6; r++)
        for (let k = 0; k < 11; k++) p.r(4 + k * 5 + (r % 2 ? 2 : 0), 29 + r * 4, 4, 3, r % 3 ? '#880000' : C.r);
      p.r(4, 28, 52, 1, C.R);
      p.r(14, 36, 32, 16, C.k);
      p.r(14, 36, 32, 1, C.d);
      p.r(48, 10, 6, 18, C.d);
      p.r(48, 10, 1, 18, C.l);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const f = 0.6 + 0.4 * Math.sin(t * 4);
        p.glow(30, 46, 20, `rgba(255,85,0,${(0.4 * f).toFixed(2)})`);
        for (let k = 0; k < 7; k++) {
          const fh = 4 + R((Math.sin(t * 6 + k * 1.7) * 0.5 + 0.5) * 8);
          p.r(15 + k * 4.4, 52 - fh, 3, fh, k % 2 ? C.R : C.Y);
        }
        cog(p, 14, 13, 11, t * 0.6, C.l, C.W);
        cog(p, 33, 18, 7, -t * 0.94, C.n, C.Y);
        p.r(33, 25, 1, 3, C.d);
      },
      noFlip: true,
    },
  ),
  ent(
    'kr-systable',
    [[50, 42]],
    (p) => {
      p.r(0, 0, 50, 42, C.d);
      p.r(0, 0, 50, 1, C.l);
      p.r(2, 3, 46, 37, C.k);
      for (let r = 0; r < 8; r++)
        for (let k = 0; k < 4; k++) {
          p.r(4 + k * 11, 5 + r * 4, 9, 2, p.h(r * 4 + k) > 0.3 ? C.b : C.d);
          p.r(4 + k * 11, 5 + r * 4, 2, 2, C.c);
        }
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const n = Math.floor(t * 2.2) % 32;
        const r = Math.floor(n / 4);
        const k = n % 4;
        p.r(4 + k * 11, 5 + r * 4, 9, 2, C.Y);
      },
      noFlip: true,
    },
  ),
];

/** The syscall bulkhead's hazard stripe. */
const HAZARD = () =>
  offscreen('hazard', 8, 4, (c) => {
    for (let y = 0; y < 4; y++)
      for (let x = 0; x < 8; x++) {
        c.fillStyle = ((x + y) >> 2) % 2 ? '#000000' : '#ffff55';
        c.fillRect(x, y, 1, 1);
      }
  });

export const kernel: LayerArt = {
  family: 'kernel',
  blurb: text('layers.kernel.blurb'),
  palette: 'cga16',
  form: 'serial',
  cursor: 'underscore',
  stackTheme: {
    accent: '#ff5f56',
    hi: '#ffcf5c',
    tint: 'rgba(255, 95, 86, 0.15)',
    border: 'rgba(255, 95, 86, 0.42)',
    anim: 'tick',
    icon: [
      '   # #   ',
      ' # ### # ',
      ' ####### ',
      '###+++###',
      ' ##+ +## ',
      '###+++###',
      ' ####### ',
      ' # ### # ',
      '   # #   ',
    ],
  },
  topicTags: ['os', 'concurrency', 'hardware'],
  library: { own: PROPS, anchors: ANCHORS, density: 4.4, anchorCount: 2, far: 0.4 },
  fog: [0, 0, 0],
  nameTopOffset: 10,
  background: (ctx, b, { T, entities }) => {
    const [y0, y1] = vis(b);
    tiled(ctx, KWALL(), 0, y0, b.w, y1 - y0, 0, R(b.top * 0.5));
    entities();
    prows(b, 1, 16, (y, i) => {
      if (hash(i * 7) < 0.7) return;
      const k = mod(T * 10 + hash(i * 7 + 1) * 16, 16);
      fill(ctx, hash(i * 7 + 2) * b.w + Math.sin(T + i) * 2, y + 16 - k, 1, 1, k < 8 ? '#ffff55' : '#ff5555');
    });
    vgrad(ctx, b, b.bottom - 40, b.bottom + SEAM_H, [
      [0, 'rgba(255,85,0,0)'],
      [1, 'rgba(255,85,0,0.45)'],
    ]);
  },
  setpiece: {
    base: ({ ctx, t, W, cx, top, bot, cy }) => {
      // Full-bleed Titan Clockwork Machine Room: 3 massive interlocking gears spanning the width + upper/lower steam manifolds + pulsing furnace glow!
      // Upper & lower industrial steam pipes across entire width with flanged collars
      for (const py of [top + 16, bot - 20]) {
        rect(ctx, 0, py, W, 8, '#aa0000');
        rect(ctx, 0, py, W, 2, '#ff5555');
        for (let x = 20; x < W; x += 40) rect(ctx, x, py - 2, 4, 12, '#555555');
      }
      // 3 huge interlocking flywheel gears covering left, center-left, and right
      giantCog(ctx, cx - 76, cy - 8, 52, t * 0.22, '#555555', '#000000', '#aaaaaa');
      giantCog(ctx, cx + 22, cy + 12, 42, -t * 0.27, '#aa5500', '#000000', '#ffff55');
      giantCog(ctx, cx + 106, cy - 14, 34, t * 0.34, '#555555', '#000000', '#aaaaaa');
      // Traveling pressure bubbles along the bottom steam pipe
      const bx = mod(t * 36, W);
      rect(ctx, bx, bot - 18, 8, 3, '#ffff55');
    },
    detail: ({ rise }) => {
      rise(14, 26, 33, '#ffaa00', 5);
    },
  },
  // syscall: a bulkhead with a single gate in the middle, the only way down.
  seam: (ctx, y, b) => {
    artPx(ctx, 0, y - 3, b.w, 9, '#555555');
    artPx(ctx, 0, y - 3, b.w, 1, '#aaaaaa');
    artPx(ctx, 0, y + 5, b.w, 1, '#000000');
    tiled(ctx, HAZARD(), 0, y - 1, b.w, 4, 0, y - 1);
    for (let x = 4; x < b.w; x += 12) artPx(ctx, x, y + 3, 1, 1, '#aaaaaa');
    const gx = R(b.w / 2) - 9;
    artPx(ctx, gx, y - 4, 18, 11, '#000000');
    artPx(ctx, gx + 1, y - 3, 16, 1, '#aaaaaa');
    artPx(ctx, gx + 2, y + 4, 14, 1, '#ffff55');
  },
  ambient: irqPulse('#ffb000'),
  critters: {
    motions: [MotionType.Zip, MotionType.Perch],
    count: 3,
    exitLabels: variants('layers.kernel.exit'),
    draw: ({ px, t, phase, variant, dir }) => {
      const visors = ['#55ffff', '#55ff55', '#ffff55', '#ff55ff'];
      const visor = visors[variant % visors.length]!;
      const blink = Math.floor(t * 5 + phase) % 2 === 0;
      px(3, -2, 1, 2, '#aaaaaa');
      px(3, -3, 1, 1, blink ? '#ff5555' : '#ffff55');
      px(0, 0, 7, 6, '#aaaaaa');
      px(dir > 0 ? 2 : 1, 2, 4, 2, visor);
      px(1, 6, 2, 1, '#555555');
      px(4, 6, 2, 1, '#555555');
    },
  },
  sound: {
    timbre: { wave: 'pulse12', filterHz: 2800, q: 2.0, gainScale: 0.86, reverbWet: 0.16 },
    ambienceLevel: 0.06,
    drones: [{ freq: 82.41, wave: 'triangle', filterHz: 190, gain: 0.35 }],
    critterExit: { freq: 420, crush: true },
    critterCall: (snd, t, p) => {
      // Robotic thread-bot servo blip + crisp 2-pip IRQ chirp
      snd.fmVoice({ carrierHz: 480, toCarrierHz: 720, modRatio: 2.5, modIndex: 140, at: t, dur: 0.065, gain: 0.19, pan: p, crush: true });
      snd.voice({ freq: 880, at: t + 0.07, dur: 0.028, wave: 'pulse12', gain: 0.17, pan: p, crush: true });
    },
    artifact: userspace.sound.artifact,
    cross: (snd, t) => {
      snd.thud(t, 140, 50, 0.18, 0.42);
      snd.noiseBurst({ at: t, dur: 0.22, type: 'bandpass', filterHz: 2400, toFilterHz: 260, q: 2.2, gain: 0.36, crush: true });
    },
  },
};
