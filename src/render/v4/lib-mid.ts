import { ent, TAU, type EntityDef, type Pen } from './kit';

/**
 * v4 entity libraries, middle layers: Libraries (rgb4: 00/55/aa/ff), OS userspace and Kernel (CGA 16).
 */

const R = Math.round;
const mod = (n: number, m: number) => ((n % m) + m) % m;

// ---------------------------------------------------------------------------------------------
// Libraries (rgb4): a reading room of shared objects. Wood, paper, brass and thread.

const WOOD = '#aa5500';
const WOOD_HI = '#ffaa55';
const WOOD_DK = '#550000';
const PAPER = '#ffffaa';
const BRASS = '#ffff55';
const GREY = '#555555';
const SILVER = '#aaaaaa';
const BLACK = '#000000';
const WHITE = '#ffffff';
const SPINES = ['#aa0000', '#0055aa', '#005500', '#aa5500', '#550055', '#005555', '#aaaa55', '#555555', '#550000', '#5555aa'];

function books(p: Pen, x: number, base: number, w: number, maxH: number, k0: number) {
  for (let bx = x, n = 0; bx < x + w - 1; n++) {
    const bw = 1 + R(p.h(k0 + n * 3));
    const bh = maxH - 3 + R(p.h(k0 + n * 3 + 1) * 3);
    if (p.h(k0 + n * 3 + 2) > 0.1) {
      p.r(bx, base - bh, bw, bh, p.pick(SPINES, k0 + n * 7 + 5));
      if (bh >= maxH - 1) p.r(bx, base - bh + 1, bw, 1, BRASS);
    } else if (p.h(k0 + n) > 0.5) {
      p.l(bx, base - 1, bx + 2, base - maxH + 1, p.pick(SPINES, n));
      bx += 1;
    }
    bx += bw;
  }
}

export const LIBRARIES: EntityDef[] = [
  ent('lib-shelf', [[16, 13], [22, 13]], (p, w) => {
    p.r(0, 0, w, 13, WOOD_DK);
    p.r(1, 1, w - 2, 10, BLACK);
    books(p, 1, 11, w - 2, 9, 0);
    p.r(0, 11, w, 2, WOOD);
    p.r(0, 11, w, 1, WOOD_HI);
  }),
  ent('lib-catalogue', [[16, 17]], (p) => {
    p.r(0, 0, 16, 13, WOOD);
    p.r(0, 0, 16, 1, WOOD_HI);
    for (let r = 0; r < 3; r++)
      for (let k = 0; k < 3; k++) {
        const out = p.h(r * 3 + k) > 0.85;
        p.r(1 + k * 5, 2 + r * 4 + (out ? 0 : 0), 4, 3, out ? PAPER : WOOD_DK);
        p.p(3 + k * 5, 3 + r * 4, BRASS);
      }
    p.r(1, 13, 1, 4, WOOD_DK);
    p.r(14, 13, 1, 4, WOOD_DK);
  }),
  ent('lib-ladder', [[9, 24]], (p) => {
    p.l(1, 23, 5, 0, WOOD);
    p.l(5, 23, 8, 2, WOOD);
    for (let k = 0; k < 6; k++) {
      const y = R(3 + k * 3.6);
      const x0 = R(1 + ((23 - y) / 23) * 4);
      const x1 = R(5 + ((23 - y) / 21) * 3);
      p.r(x0, y, x1 - x0 + 1, 1, WOOD_HI);
    }
    p.r(4, 0, 3, 1, SILVER);
    p.p(1, 23, SILVER);
    p.p(6, 23, SILVER);
  }),
  ent(
    'lib-spool',
    [[14, 12]],
    (p) => {
      p.r(1, 1, 10, 2, WOOD);
      p.r(1, 9, 10, 2, WOOD);
      p.r(2, 3, 8, 6, '#aa5555');
      for (let y = 4; y < 9; y += 2) p.r(2, y, 8, 1, '#ff5555');
      p.r(10, 6, 4, 1, '#ff5555');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const k = Math.floor(t * 3) % 4;
        p.p(10 + k, 6, BRASS);
      },
    },
  ),
  ent('lib-cart', [[19, 15]], (p) => {
    p.r(0, 0, 1, 10, GREY);
    p.r(0, 0, 3, 1, GREY);
    p.r(1, 5, 17, 1, SILVER);
    p.r(1, 11, 17, 1, SILVER);
    books(p, 2, 5, 15, 5, 3);
    books(p, 2, 11, 15, 5, 40);
    p.r(17, 5, 1, 7, GREY);
    p.disc(3, 13, 1, GREY);
    p.disc(15, 13, 1, GREY);
  }),
  ent('lib-crates', [[17, 16]], (p) => {
    const crate = (x: number, y: number, w: number, h: number) => {
      p.r(x, y, w, h, WOOD);
      p.frame(x, y, w, h, WOOD_DK);
      p.l(x + 1, y + 1, x + w - 2, y + h - 2, WOOD_DK);
      // ".so" in three pixels' worth of stencil.
      p.p(x + 2, y + h - 3, PAPER);
      p.r(x + 4, y + h - 5, 2, 1, PAPER);
      p.r(x + 4, y + h - 4, 1, 1, PAPER);
      p.r(x + 4, y + h - 3, 2, 1, PAPER);
    };
    crate(0, 7, 9, 9);
    crate(8, 8, 9, 8);
    crate(3 + R(p.h(0) * 3), 0, 8, 8);
  }),
  ent(
    'lib-loom',
    [[22, 16]],
    (p) => {
      p.r(0, 0, 2, 16, WOOD);
      p.r(20, 0, 2, 16, WOOD);
      p.r(0, 0, 22, 2, WOOD_HI);
      p.r(0, 13, 22, 1, WOOD_DK);
      for (let x = 3; x < 20; x += 2) p.r(x, 2, 1, 11, p.h(x) > 0.5 ? '#ff5555' : '#5555ff');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const q = mod(t * 0.6, 2);
        const x = R(2 + (q < 1 ? q : 2 - q) * 15);
        p.r(x, 7, 4, 2, BRASS);
        p.r(2, 9, 18, 1, SILVER);
        for (let k = 0; k < Math.floor(mod(t * 0.6, 8)); k++) p.r(3, 12 - k, 17, 1, k % 2 ? '#aa0000' : '#0055aa');
      },
      noFlip: true,
    },
  ),
  ent('lib-archive', [[18, 12]], (p) => {
    p.r(0, 0, 12, 12, WOOD_DK);
    p.r(1, 1, 10, 4, WOOD);
    p.p(6, 3, BRASS);
    p.r(5, 6, 13, 6, WOOD);
    p.r(5, 6, 13, 1, WOOD_HI);
    for (let k = 0; k < 5; k++) p.r(7 + k * 2, 4 + R(p.h(k) * 2), 1, 3, k % 2 ? PAPER : WHITE);
    p.r(15, 8, 2, 1, BRASS);
  }),
  ent(
    'lib-lamp',
    [[12, 15]],
    (p) => {
      p.r(5, 3, 1, 10, '#555500');
      p.r(2, 13, 7, 2, WOOD_DK);
      p.r(1, 0, 9, 3, '#005500');
      p.r(2, 0, 7, 1, '#55aa55');
      p.r(2, 3, 7, 1, PAPER);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        p.glow(6, 7, 13, 'rgba(255,200,100,0.22)');
        const d = mod(t * 0.5, 1);
        p.p(3 + R(p.h(1) * 6), 5 + R(d * 7), PAPER);
      },
    },
  ),
  ent('lib-tangle', [[20, 14]], (p) => {
    const pts: [number, number][] = [];
    for (let k = 0; k < 6; k++) pts.push([2 + R(p.h(k) * 16), 2 + R(p.h(k + 10) * 10)]);
    for (let k = 0; k < 6; k++) {
      const a = pts[k]!;
      const b = pts[(k + 2) % 6]!;
      p.l(a[0], a[1], b[0], b[1], k % 2 ? '#aa5500' : '#aaaa55');
    }
    for (const [x, y] of pts) p.r(x - 1, y - 1, 3, 3, WOOD_HI);
    p.p(pts[0]![0], pts[0]![1], '#ff5555');
  }),
  ent(
    'lib-thread',
    [[26, 12]],
    (p) => {
      for (let k = 0; k <= 20; k++) {
        const q = k / 20;
        p.p(1 + q * 23, 2 + 6 * q + 7 * q * (1 - q) * 4 * 0.5, WOOD);
      }
      p.r(0, 1, 3, 3, WOOD_HI);
      p.r(23, 7, 3, 3, WOOD_HI);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const q = mod(t * 0.3, 1);
        p.r(R(1 + q * 23) - 1, R(2 + 6 * q + 7 * q * (1 - q) * 2) - 1, 2, 2, BRASS);
      },
    },
  ),
  ent(
    'lib-plaque',
    [[30, 9], [24, 9]],
    (p, w, _h, v) => {
      const names = v === 0 ? ['libssl', 'libstd', 'libdl', 'libuv'] : ['libc', 'libm', 'libz', 'ld.so'];
      p.r(0, 0, w, 9, WOOD);
      p.r(0, 0, w, 1, WOOD_HI);
      p.r(0, 8, w, 1, WOOD_DK);
      p.t(p.pick(names, 0), 2, 7, BRASS);
    },
    { text: true, cap: 1, weight: 0.5 },
  ),
  ent('lib-card', [[10, 8]], (p) => {
    p.r(1, 1, 9, 7, WOOD_DK);
    p.r(0, 0, 9, 7, PAPER);
    p.r(0, 0, 9, 1, '#ff5555');
    p.r(1, 3, 6, 1, '#aaaa55');
    p.r(1, 5, 3 + R(p.h(0) * 4), 1, '#aaaa55');
  }),
  ent('lib-lectern', [[15, 15]], (p) => {
    p.r(6, 6, 3, 8, WOOD);
    p.r(3, 14, 9, 1, WOOD_DK);
    p.l(0, 6, 7, 3, WOOD_DK);
    p.l(14, 6, 7, 3, WOOD_DK);
    p.r(1, 3, 6, 3, PAPER);
    p.r(8, 3, 6, 3, PAPER);
    p.r(7, 3, 1, 3, SILVER);
    p.r(2, 4, 4, 1, SILVER);
    p.r(9, 4, 3, 1, SILVER);
  }),
  ent(
    'lib-stamp',
    [[14, 13]],
    (p) => {
      p.r(0, 10, 6, 3, '#550055');
      p.r(1, 10, 4, 1, '#aa00aa');
      p.r(7, 11, 7, 2, PAPER);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const q = mod(t * 0.8, 1);
        const down = q > 0.8;
        const y = down ? 5 : R(1 + Math.sin(q * Math.PI) * 2);
        p.r(9, y, 3, 2, WOOD_DK);
        p.r(10, y - 1, 1, 1, WOOD);
        p.r(8, y + 2, 5, 3, WOOD);
        p.r(8, y + 4, 5, 1, '#aa00aa');
        if (q > 0.85 || q < 0.4) p.r(8, 11, 5, 1, '#aa00aa');
      },
    },
  ),
  ent('lib-pile', [[13, 11]], (p) => {
    for (let k = 0; k < 4; k++) {
      const w = 9 + R(p.h(k) * 3);
      const x = R(p.h(k + 4) * (13 - w));
      const col = p.pick(SPINES, k + 9);
      p.r(x, 9 - k * 2.5, w, 2, col);
      p.r(x + w - 1, 9 - k * 2.5, 1, 2, PAPER);
    }
  }),
  ent('lib-scroll', [[15, 10]], (p) => {
    p.r(2, 1, 11, 8, PAPER);
    p.r(0, 0, 2, 10, WOOD);
    p.r(13, 0, 2, 10, WOOD);
    p.r(0, 0, 2, 1, WOOD_HI);
    p.r(13, 0, 2, 1, WOOD_HI);
    for (let y = 2; y < 8; y += 2) p.r(3, y, 4 + R(p.h(y) * 6), 1, '#aaaa55');
    p.p(4, 2, '#aa0000');
  }),
  ent(
    'lib-magnifier',
    [[15, 13]],
    (p) => {
      p.r(0, 2, 12, 10, PAPER);
      for (let y = 4; y < 11; y += 2) p.r(1, y, 6 + R(p.h(y) * 4), 1, '#aaaa55');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const x = 2 + R((Math.sin(t * 0.7) * 0.5 + 0.5) * 6);
        const y = 3 + R((Math.cos(t * 0.5) * 0.5 + 0.5) * 3);
        p.ring(x + 2, y + 2, 3, SILVER);
        p.p(x + 1, y + 1, WHITE);
        p.l(x + 5, y + 5, x + 7, y + 7, WOOD);
      },
    },
  ),
  ent('lib-pigeon', [[18, 14]], (p) => {
    p.r(0, 0, 18, 14, WOOD_DK);
    for (let r = 0; r < 3; r++)
      for (let k = 0; k < 4; k++) {
        p.r(1 + k * 4, 1 + r * 4, 3, 3, BLACK);
        if (p.h(r * 4 + k) > 0.45) p.r(1 + k * 4, 2 + r * 4, 3, 2, p.h(k + r) > 0.5 ? PAPER : WHITE);
      }
    p.r(0, 13, 18, 1, WOOD);
  }),
  ent('lib-barrel', [[11, 13]], (p) => {
    p.r(1, 0, 9, 13, WOOD);
    p.r(0, 2, 11, 9, WOOD);
    p.r(0, 2, 11, 1, GREY);
    p.r(0, 10, 11, 1, GREY);
    p.r(1, 0, 9, 1, WOOD_HI);
    for (let x = 2; x < 10; x += 3) p.r(x, 1, 1, 11, WOOD_DK);
    p.r(4, 5, 3, 3, PAPER);
    p.p(5, 6, BLACK);
  }),
  ent('lib-desk', [[21, 13]], (p) => {
    p.r(0, 5, 15, 2, WOOD);
    p.r(0, 5, 15, 1, WOOD_HI);
    p.r(1, 7, 1, 6, WOOD_DK);
    p.r(13, 7, 1, 6, WOOD_DK);
    p.r(3, 3, 5, 2, PAPER);
    p.r(9, 2, 3, 3, p.pick(SPINES, 1));
    p.r(16, 0, 1, 13, WOOD_DK);
    p.r(16, 7, 5, 1, WOOD);
    p.r(20, 8, 1, 5, WOOD_DK);
  }),
];

export const LIBRARIES_ANCHORS: EntityDef[] = [
  ent('lib-aisle', [[64, 62]], (p) => {
    // Two tall bookcases with a rolling ladder between them: the aisle.
    const caseAt = (x: number, w: number, k: number) => {
      p.r(x, 2, w, 60, WOOD_DK);
      p.r(x - 1, 0, w + 2, 3, WOOD);
      p.r(x - 1, 0, w + 2, 1, WOOD_HI);
      for (let s = 0; s < 5; s++) {
        const base = 13 + s * 11;
        p.r(x + 1, base - 10, w - 2, 10, BLACK);
        books(p, x + 1, base, w - 2, 9, k + s * 50);
        p.r(x, base, w, 1, WOOD);
      }
    };
    caseAt(1, 24, 0);
    caseAt(39, 24, 300);
    p.l(28, 61, 34, 4, WOOD_HI);
    p.l(32, 61, 37, 6, WOOD_HI);
    for (let k = 0; k < 9; k++) {
      const y = 10 + k * 6;
      const x0 = R(28 + ((61 - y) / 57) * 6);
      const x1 = R(32 + ((61 - y) / 55) * 5);
      p.r(x0, y, x1 - x0 + 1, 1, WOOD);
    }
    p.r(26, 3, 12, 1, SILVER);
  }),
  ent(
    'lib-press',
    [[40, 40]],
    (p) => {
      p.r(2, 34, 36, 6, WOOD);
      p.r(2, 34, 36, 1, WOOD_HI);
      p.r(5, 0, 3, 34, GREY);
      p.r(30, 0, 3, 34, GREY);
      p.r(3, 0, 32, 4, SILVER);
      p.r(3, 0, 32, 1, WHITE);
      p.r(11, 28, 18, 6, PAPER);
      for (let k = 0; k < 4; k++) p.r(12 + k * 4, 30, 3, 1, '#aa5500');
      p.disc(34, 10, 5, SILVER);
      p.disc(34, 10, 2, GREY);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const stroke = R((Math.sin(t * 2.2) + 1) * 4);
        p.r(18, 4, 4, 6 + stroke, SILVER);
        p.r(12, 10 + stroke, 16, 4, WHITE);
        p.r(12, 13 + stroke, 16, 1, SILVER);
        for (let k = 0; k < 6; k++) {
          const a = t * 1.5 + (k * TAU) / 6;
          p.p(34 + R(Math.cos(a) * 5), 10 + R(Math.sin(a) * 5), WHITE);
        }
      },
      noFlip: true,
    },
  ),
];

// ---------------------------------------------------------------------------------------------
// OS userspace (CGA 16): a night city of processes.

const C = {
  k: '#000000',
  b: '#0000aa',
  g: '#00aa00',
  c: '#00aaaa',
  r: '#aa0000',
  m: '#aa00aa',
  n: '#aa5500',
  l: '#aaaaaa',
  d: '#555555',
  B: '#5555ff',
  G: '#55ff55',
  C: '#55ffff',
  R: '#ff5555',
  M: '#ff55ff',
  Y: '#ffff55',
  W: '#ffffff',
} as const;

export const USERSPACE: EntityDef[] = [
  ent(
    'us-tower',
    [[8, 20], [11, 26], [9, 32]],
    (p, w, h) => {
      p.r(0, 1, w, h - 1, C.b);
      p.r(0, 1, 1, h - 1, C.B);
      p.r(0, 0, w, 1, C.B);
      for (let r = 0; r * 3 + 4 < h; r++)
        for (let k = 0; k * 2 + 2 < w; k++) {
          const n = r * 17 + k;
          if (p.h(n) > 0.35) continue;
          p.p(2 + k * 2, 3 + r * 3, p.h(n + 3) > 0.75 ? C.C : C.Y);
        }
    },
    { noFlip: true },
  ),
  ent(
    'us-daemon',
    [[26, 13]],
    (p, w) => {
      p.r(0, 9, w, 1, C.l);
      p.r(0, 10, w, 1, C.d);
      for (let k = 2; k < w; k += 6) p.r(k, 11, 1, 2, C.d);
    },
    {
      anim: (p, w, _h, _v, t) => {
        const ph = mod(t * 0.1, 2);
        const x = R((ph < 1 ? ph : 2 - ph) * (w - 5));
        const step = Math.floor(t * 4) % 2;
        p.r(x, 3, 1, 1, C.R);
        p.r(x + 4, 3, 1, 1, C.R);
        p.r(x + 1, 4, 3, 3, C.r);
        p.p(x + 2, 5, C.Y);
        p.p(x + 1 + step, 7, C.r);
        p.p(x + 3 - step, 7, C.r);
        p.p(x + 2, 8, C.r);
      },
    },
  ),
  ent(
    'us-sign',
    [[40, 10]],
    (p) => {
      const name = p.pick(['systemd', 'sshd', 'cron', 'journald', 'udevd', 'Xorg', 'bash'], 0);
      p.r(0, 0, 40, 10, C.k);
      p.r(0, 0, 40, 1, C.M);
      p.r(0, 9, 40, 1, C.M);
      p.t(name, 3, 7, C.M);
    },
    {
      text: true,
      cap: 1,
      weight: 0.5,
      anim: (p, _w, _h, _v, t) => {
        if (mod(t * 0.7, 1) > 0.08) p.glow(20, 5, 16, 'rgba(255,85,255,0.18)');
      },
    },
  ),
  ent(
    'us-pipe',
    [[26, 8]],
    (p, w) => {
      p.r(0, 3, w, 2, C.d);
      p.r(0, 3, w, 1, C.l);
      p.r(0, 2, 2, 4, C.l);
      p.r(w - 2, 2, 2, 4, C.l);
      p.r(5, 5, 1, 3, C.d);
      p.r(w - 6, 5, 1, 3, C.d);
    },
    {
      anim: (p, w, _h, _v, t) => {
        for (let k = 0; k < 2; k++) p.r(2 + mod(t * (10 + k * 5) + k * 9, w - 5), 4, 2, 1, C.C);
      },
    },
  ),
  ent(
    'us-tty',
    [[14, 11]],
    (p) => {
      p.r(0, 0, 14, 10, C.d);
      p.r(1, 1, 12, 8, C.k);
      p.r(2, 2, 4 + R(p.h(0) * 5), 1, C.g);
      p.r(2, 4, 2 + R(p.h(1) * 6), 1, C.g);
      p.r(5, 10, 4, 1, C.d);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (Math.floor(t * 1.9) % 2 === 0) p.r(2, 6, 2, 2, C.G);
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
    {
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
  }),
  ent(
    'us-signal',
    [[12, 19]],
    (p) => {
      p.r(1, 0, 1, 19, C.l);
      p.r(0, 18, 3, 1, C.d);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (let x = 0; x < 9; x++) {
          const dy = R(Math.sin(t * 4 - x * 0.7) * 1);
          p.r(2 + x, 1 + dy, 1, 5, x < 4 ? C.R : C.r);
        }
      },
    },
  ),
  ent(
    'us-pidplate',
    [[22, 9]],
    (p) => {
      p.r(0, 0, 22, 9, C.b);
      p.frame(0, 0, 22, 9, C.W);
      p.t(String(100 + Math.floor(p.h(0) * 899)), 3, 7, C.W);
    },
    { text: true, cap: 1, weight: 0.5 },
  ),
  ent('us-cabinet', [[10, 15]], (p) => {
    p.r(0, 0, 10, 15, C.l);
    p.r(0, 0, 10, 1, C.W);
    for (let k = 0; k < 3; k++) {
      p.r(1, 1 + k * 5, 8, 4, C.d);
      p.r(4, 2 + k * 5, 2, 1, C.l);
      p.r(2, 4 + k * 5, 6, 1, C.Y);
    }
  }),
  ent('us-mailbox', [[11, 15]], (p) => {
    p.r(5, 7, 1, 8, C.d);
    p.r(1, 1, 8, 6, C.b);
    p.r(2, 0, 6, 1, C.b);
    p.r(1, 3, 8, 1, C.B);
    p.r(9, 1, 1, 4, C.l);
    if (p.h(0) > 0.4) p.r(9, 1, 2, 2, C.R);
    p.r(3, 5, 4, 1, C.k);
  }),
  ent('us-crate', [[13, 10]], (p) => {
    p.r(0, 0, 13, 10, C.n);
    p.frame(0, 0, 13, 10, '#552200');
    p.r(0, 3, 13, 1, C.Y);
    p.r(3, 5, 7, 3, C.W);
    p.r(4, 6, 5, 1, C.d);
  }),
  ent('us-fork', [[13, 17]], (p) => {
    p.r(6, 8, 1, 9, C.l);
    p.r(4, 16, 5, 1, C.d);
    p.r(0, 1, 6, 3, C.g);
    p.r(7, 4, 6, 3, C.g);
    p.p(0, 2, C.G);
    p.p(12, 5, C.G);
    p.r(1, 2, 3, 1, C.W);
    p.r(9, 5, 3, 1, C.W);
  }),
  ent(
    'us-zombie',
    [[8, 11]],
    () => {},
    {
      anim: (p, _w, _h, _v, t) => {
        const lean = Math.floor(t * 1.2) % 2;
        p.r(2 + lean, 0, 3, 3, C.d);
        p.p(3 + lean, 1, C.G);
        p.r(2, 3, 3, 4, C.d);
        p.r(5, 4 - lean, 3, 1, C.d);
        p.p(2, 7, C.d);
        p.p(2, 8 + lean, C.d);
        p.p(4, 7, C.d);
        p.p(4 + lean, 9, C.d);
        p.r(1, 10, 6, 1, C.k);
      },
    },
  ),
  ent(
    'us-dbus',
    [[22, 11]],
    (p) => {
      p.r(0, 1, 22, 7, C.Y);
      p.r(1, 0, 20, 1, C.Y);
      for (let k = 0; k < 4; k++) p.r(2 + k * 5, 2, 4, 3, C.C);
      p.r(0, 6, 22, 1, C.n);
      p.disc(4, 9, 1, C.d);
      p.disc(17, 9, 1, C.d);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        p.p(4 + (Math.floor(t * 6) % 2 ? 1 : -1), 9, C.l);
        p.p(17 + (Math.floor(t * 6) % 2 ? 1 : -1), 9, C.l);
        if (Math.floor(t * 1.5) % 2) p.p(21, 4, C.R);
      },
    },
  ),
  ent(
    'us-journal',
    [[15, 12]],
    (p) => {
      p.r(0, 0, 4, 4, C.l);
      p.r(1, 1, 2, 2, C.d);
      p.r(3, 2, 10, 10, C.W);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const off = Math.floor(t * 2) % 2;
        for (let y = 4 - off; y < 12; y += 2) if (y >= 3) p.r(4, y, 3 + ((y * 7) % 6), 1, y % 4 ? C.d : C.r);
      },
    },
  ),
  ent('us-padlock', [[9, 11]], (p) => {
    p.r(2, 0, 5, 1, C.l);
    p.r(1, 1, 1, 4, C.l);
    p.r(7, 1, 1, 4, C.l);
    p.r(0, 4, 9, 7, C.Y);
    p.r(0, 4, 9, 1, C.W);
    p.r(4, 6, 1, 3, C.k);
  }),
  ent(
    'us-firewall',
    [[18, 13]],
    (p) => {
      for (let r = 0; r < 3; r++)
        for (let k = -1; k < 4; k++) {
          const x = k * 5 + (r % 2 ? 2 : 0);
          p.r(x, 6 + r * 2.4, 4, 2, C.r);
        }
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (let k = 0; k < 4; k++) {
          const fh = 2 + R((Math.sin(t * 7 + k * 2.1) * 0.5 + 0.5) * 4);
          p.r(2 + k * 4, 6 - fh, 2, fh, k % 2 ? C.R : C.Y);
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
  }),
  ent(
    'us-antenna',
    [[11, 17]],
    (p) => {
      p.r(5, 3, 1, 14, C.l);
      p.l(0, 16, 5, 6, C.d);
      p.l(10, 16, 5, 6, C.d);
      p.r(2, 8, 7, 1, C.d);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const on = Math.floor(t * 1.1) % 2 === 0;
        p.r(4, 1, 3, 2, on ? C.R : C.r);
        if (on) p.glow(5, 2, 5, 'rgba(255,85,85,0.4)');
      },
      noFlip: true,
    },
  ),
];

export const USERSPACE_ANCHORS: EntityDef[] = [
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

// ---------------------------------------------------------------------------------------------
// Kernel (CGA 16): the machine room. Gears, wheels, cabinets, bells and logs.

const DMESG = [
  'Linux version 6.12.0',
  'rcu: Hierarchical RCU',
  'smp: Bringing up CPUs',
  'futex hash entries',
  'EXT4-fs: mounted',
  'NET: PF_INET',
  'Memory: 16318204K',
];

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

export const KERNEL: EntityDef[] = [
  ent(
    'kr-gears',
    [[24, 17]],
    () => {},
    {
      anim: (p, _w, _h, _v, t) => {
        cog(p, 7, 8, 7, t * 0.9, C.l, C.W);
        cog(p, 18, 11, 5, -t * 1.3, C.n, C.Y);
      },
    },
  ),
  ent(
    'kr-dmesg',
    [[46, 19]],
    (p) => {
      p.r(0, 0, 46, 19, C.d);
      p.r(0, 0, 46, 1, C.l);
      p.r(2, 2, 42, 15, C.k);
      p.r(41, 17, 2, 1, C.G);
    },
    {
      text: true,
      cap: 1,
      weight: 0.6,
      anim: (p, _w, _h, _v, t) => {
        // A new line scrolls in every couple of seconds; the newest is bright.
        const first = Math.floor(t * 0.45);
        for (let k = 0; k < 2; k++) p.t(DMESG[mod(first + k + Math.floor(p.h(0) * 7), DMESG.length)]!.slice(0, 8), 3, 9 + k * 6, k === 1 ? C.G : C.g);
      },
    },
  ),
  ent(
    'kr-gauge',
    [[22, 11]],
    (p) => {
      p.r(0, 6, 22, 3, C.r);
      p.r(0, 6, 22, 1, C.R);
      p.r(3, 5, 2, 5, C.d);
      p.r(17, 5, 2, 5, C.d);
      p.disc(11, 4, 3, C.W);
      p.p(11, 7, C.d);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const na = -2.2 + Math.sin(t) * 0.5;
        p.l(11, 4, 11 + Math.cos(na) * 2.4, 4 + Math.sin(na) * 2.4, C.r);
      },
      noFlip: true,
    },
  ),
  ent(
    'kr-piston',
    [[8, 15]],
    (p) => {
      p.r(1, 0, 6, 8, C.d);
      p.r(1, 0, 1, 8, C.l);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const s = R(Math.sin(t * 2.4) * 2);
        p.r(3, 8, 2, 3 + s, C.W);
        p.r(0, 11 + s, 8, 2, C.l);
      },
    },
  ),
  ent(
    'kr-leds',
    [[11, 7]],
    (p) => {
      p.r(0, 0, 11, 7, C.d);
      p.r(1, 1, 9, 5, C.k);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const slot = Math.floor(t * 2.5);
        for (let k = 0; k < 6; k++) {
          const on = (k * 5 + slot * 3 + k * slot) % 7 > 2;
          const red = k === 5;
          p.p(2 + (k % 3) * 3, 2 + Math.floor(k / 3) * 2, on ? (red ? C.R : C.G) : red ? C.r : C.g);
        }
      },
    },
  ),
  ent(
    'kr-schedwheel',
    [[17, 17]],
    (p) => {
      p.r(7, 8, 3, 9, C.d);
      p.r(4, 16, 9, 1, C.d);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        p.ring(8, 8, 7, C.l);
        const cols = [C.R, C.G, C.Y, C.C, C.M, C.B];
        for (let k = 0; k < 6; k++) {
          const a = t * 0.8 + (k * TAU) / 6;
          const x = 8 + R(Math.cos(a) * 6);
          const y = 8 + R(Math.sin(a) * 6);
          p.l(8, 8, x, y, C.d);
          p.r(x - 1, y - 1, 2, 2, cols[k]!);
        }
        p.r(7, 7, 3, 3, C.W);
        p.r(7, 0, 3, 1, C.W);
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
    [[13, 13]],
    (p) => {
      p.r(5, 0, 3, 1, C.d);
      p.r(6, 1, 1, 1, C.d);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const q = mod(t * 0.7, 1);
        const swing = q < 0.25 ? R(Math.sin(q * 50) * 1.6) : 0;
        p.r(4 + swing, 2, 5, 2, C.Y);
        p.r(3 + swing, 4, 7, 4, C.Y);
        p.r(2 + swing, 8, 9, 2, C.Y);
        p.r(4 + swing, 3, 1, 5, C.W);
        p.r(6 - swing, 10, 1, 2, C.n);
        if (swing) {
          p.p(0, 4, C.W);
          p.p(12, 4, C.W);
          p.p(0, 7, C.W);
          p.p(12, 7, C.W);
        }
      },
      noFlip: true,
    },
  ),
  ent(
    'kr-turnstile',
    [[15, 15]],
    (p) => {
      p.r(6, 5, 3, 10, C.d);
      p.r(3, 14, 9, 1, C.d);
      p.r(6, 5, 3, 1, C.l);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (let k = 0; k < 3; k++) {
          const a = t * 2.5 + (k * TAU) / 3;
          p.l(7, 6, 7 + Math.cos(a) * 6, 6 + Math.sin(a) * 2.5, C.l);
        }
        p.r(6, 5, 3, 2, C.W);
      },
      noFlip: true,
    },
  ),
  ent('kr-slab', [[23, 11]], (p) => {
    for (let k = 0; k < 4; k++) {
      const x = k * 6;
      p.r(x, 2, 5, 9, C.d);
      p.r(x + 1, 3, 3, 7, C.k);
      const fill = Math.floor(p.h(k) * 4);
      for (let j = 0; j < fill; j++) p.r(x + 1, 8 - j * 2, 3, 1, k % 2 ? C.C : C.G);
      p.r(x, 2, 5, 1, C.l);
    }
    p.r(0, 0, 23, 1, C.n);
  }),
  ent(
    'kr-ticker',
    [[24, 10]],
    (p) => {
      p.r(0, 2, 5, 8, C.d);
      p.r(1, 3, 3, 3, C.l);
      p.r(5, 4, 19, 4, C.W);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const off = R(mod(t * 6, 4));
        for (let x = 6 + off; x < 23; x += 4) p.r(x, 5, 2, 1, (x * 7) % 3 ? C.d : C.r);
        p.r(5, 4, 1, 4, C.d);
      },
      noFlip: true,
    },
  ),
  ent('kr-gate', [[17, 17]], (p) => {
    p.r(0, 0, 3, 17, C.d);
    p.r(14, 0, 3, 17, C.d);
    p.r(0, 0, 17, 3, C.l);
    for (let x = 4; x < 14; x += 3) p.r(x, 3, 1, 10, C.l);
    for (let y = 5; y < 13; y += 3) p.r(3, y, 11, 1, C.d);
    for (let x = 4; x < 14; x += 3) p.p(x, 13, C.W);
  }),
  ent(
    'kr-runqueue',
    [[26, 9]],
    (p, w) => {
      p.r(0, 7, w, 1, C.l);
      p.r(0, 8, w, 1, C.d);
    },
    {
      anim: (p, w, _h, _v, t) => {
        const cols = [C.R, C.G, C.Y, C.C, C.M];
        const s = mod(t * 3, 6);
        for (let k = 0; k < 5; k++) {
          const x = R(w - 6 - k * 6 + s * 0) - (k === 0 ? R(s) : 0);
          if (x < 0) continue;
          p.r(x, 2, 4, 5, cols[(k + Math.floor(t * 0.5)) % 5]!);
          p.r(x, 2, 4, 1, C.W);
        }
      },
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
  ent('kr-oom', [[13, 14]], (p) => {
    p.r(0, 0, 13, 12, C.Y);
    p.frame(0, 0, 13, 12, C.k);
    p.r(4, 2, 5, 4, C.k);
    p.r(3, 3, 7, 2, C.k);
    p.p(5, 3, C.Y);
    p.p(7, 3, C.Y);
    p.r(5, 6, 3, 2, C.k);
    p.l(2, 9, 10, 8, C.k);
    p.l(2, 8, 10, 9, C.k);
    p.r(6, 12, 1, 2, C.d);
  }),
  ent(
    'kr-tlb',
    [[15, 10]],
    (p) => {
      p.r(0, 0, 15, 10, C.d);
      p.r(1, 1, 13, 8, C.k);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const hit = Math.floor(t * 3);
        for (let r = 0; r < 3; r++)
          for (let k = 0; k < 4; k++) {
            const n = r * 4 + k;
            p.r(2 + k * 3, 2 + r * 2.4, 2, 1, n === hit % 12 ? C.W : (n * 5 + Math.floor(hit / 12)) % 3 ? C.c : C.b);
          }
      },
    },
  ),
  ent(
    'kr-kthread',
    [[9, 13]],
    (p) => {
      p.r(1, 2, 7, 5, C.l);
      p.r(2, 3, 1, 1, C.k);
      p.r(6, 3, 1, 1, C.k);
      p.r(4, 0, 1, 2, C.d);
      p.r(2, 7, 5, 4, C.d);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const s = Math.floor(t * 3) % 2;
        p.r(2, 11, 1, 2 - s, C.l);
        p.r(6, 11, 1, 1 + s, C.l);
        p.r(0, 7 + s, 1, 3, C.l);
        p.r(8, 8 - s, 1, 3, C.l);
        if (Math.floor(t * 1.4) % 2) p.p(4, 0, C.R);
      },
    },
  ),
  ent(
    'kr-semaphore',
    [[7, 16]],
    (p) => {
      p.r(0, 0, 7, 12, C.d);
      p.r(3, 12, 1, 4, C.d);
      for (let k = 0; k < 3; k++) p.r(2, 1 + k * 4, 3, 3, C.k);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const s = Math.floor(t * 0.7) % 3;
        p.r(2, 1 + s * 4, 3, 3, [C.R, C.Y, C.G][s]!);
      },
      noFlip: true,
    },
  ),
  ent(
    'kr-ringbuf',
    [[15, 15]],
    (p) => {
      for (let k = 0; k < 12; k++) {
        const a = (k * TAU) / 12;
        p.r(7 + R(Math.cos(a) * 6) - 0, 7 + R(Math.sin(a) * 6), 1, 1, C.d);
      }
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const head = Math.floor(t * 4);
        const len = 4 + (Math.floor(t * 0.5) % 4);
        for (let j = 0; j < len; j++) {
          const a = ((head - j) * TAU) / 12;
          p.r(7 + R(Math.cos(a) * 6), 7 + R(Math.sin(a) * 6), 1, 1, j === 0 ? C.W : C.C);
        }
      },
    },
  ),
  ent(
    'kr-watchdog',
    [[15, 11]],
    (p) => {
      p.r(3, 4, 8, 4, C.n);
      p.r(10, 1, 4, 4, C.n);
      p.p(13, 4, C.k);
      p.p(12, 2, C.k);
      p.r(10, 0, 1, 2, '#552200');
      for (const x of [3, 5, 8, 10]) p.r(x, 8, 1, 3, C.n);
      p.r(10, 5, 2, 1, C.R);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const up = Math.floor(t * 5) % 2;
        p.l(3, 4, 0, up ? 1 : 3, C.n);
      },
    },
  ),
  ent('kr-vfs', [[17, 13]], (p) => {
    p.r(5, 3, 7, 7, C.l);
    p.frame(5, 3, 7, 7, C.d);
    p.r(7, 5, 3, 3, C.d);
    p.r(0, 6, 5, 1, C.Y);
    p.r(12, 6, 5, 1, C.C);
    p.r(8, 0, 1, 3, C.G);
    p.r(8, 10, 1, 3, C.M);
  }),
];

export const KERNEL_ANCHORS: EntityDef[] = [
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
