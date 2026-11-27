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
  }, { floor: true }),
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
  }, { floor: true }),
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
  }, { floor: true }),
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
  ent('lib-tangle', [[20, 14]], (p) => {
    // Framed wooden dependency pinboard with neat brass pins and taut linking threads.
    p.box(0, 0, 20, 14, WOOD_DK, WOOD);
    const nodes: [number, number][] = [
      [4, 4],
      [10, 3],
      [16, 5],
      [6, 10],
      [14, 10],
    ];
    p.l(4, 4, 10, 3, '#ff5555');
    p.l(10, 3, 16, 5, '#ff5555');
    p.l(4, 4, 6, 10, BRASS);
    p.l(10, 3, 14, 10, BRASS);
    p.l(6, 10, 14, 10, '#aa5500');
    for (const [x, y] of nodes) {
      p.r(x - 1, y - 1, 2, 2, PAPER);
      p.p(x, y, BRASS);
    }
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
  }, { floor: true }),
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
  ent('lib-globe', [[13, 15]], (p) => {
    // Brass reading-room globe on a turned wooden stand.
    p.disc(6, 5, 4, '#0055aa');
    p.r(4, 3, 2, 2, '#55aa55');
    p.r(6, 5, 3, 2, '#005500');
    p.p(4, 2, PAPER);
    // Brass C-shaped meridian arc on the right side
    p.r(6, 0, 3, 1, BRASS);
    p.p(9, 1, BRASS);
    p.r(10, 2, 1, 7, BRASS);
    p.p(9, 9, BRASS);
    p.r(6, 10, 3, 1, BRASS);
    p.r(5, 10, 3, 3, WOOD);
    p.r(3, 13, 7, 2, WOOD_DK);
    p.r(3, 13, 7, 1, WOOD_HI);
  }, { floor: true }),
  ent('lib-cache-wheel', [[15, 13]], (p) => {
    // Rotary card index on a dark wooden base: a wheel of cream cards around a brass knob.
    p.disc(7, 5, 5, PAPER);
    p.ring(7, 5, 5, '#aaaa55');
    for (let k = 0; k < 8; k++) {
      const a = (k * TAU) / 8;
      p.l(7, 5, 7 + R(Math.cos(a) * 4), 5 + R(Math.sin(a) * 4), '#aaaa55');
    }
    p.p(4, 2, WHITE);
    p.p(3, 3, WHITE);
    p.r(6, 4, 3, 3, BRASS);
    p.p(6, 4, WHITE);
    p.r(6, 10, 3, 1, WOOD_DK);
    p.r(1, 11, 13, 2, WOOD_DK);
    p.r(1, 11, 13, 1, WOOD);
  }),
  ent('lib-pkg-tag', [[10, 14]], (p) => {
    // Chamfered manila shipping tag hung on a wall peg by a red cord through a brass eyelet.
    p.r(2, 0, 6, 1, WOOD);
    p.l(3, 1, 4, 5, '#aa0000');
    p.l(7, 1, 5, 5, '#aa0000');
    p.r(3, 3, 4, 1, PAPER);
    p.r(2, 4, 6, 1, PAPER);
    p.r(1, 5, 8, 8, PAPER);
    p.r(1, 12, 8, 1, '#aaaa55');
    p.r(8, 5, 1, 8, '#aaaa55');
    p.r(4, 5, 2, 1, BRASS);
    p.r(2, 8, 6, 1, GREY);
    p.r(2, 10, 4, 1, GREY);
  }),
  ent('lib-abi-seal', [[14, 10]], (p) => {
    // A folded parchment strip lying on the floor under a round crimson wax seal.
    p.r(1, 5, 12, 4, PAPER);
    p.r(1, 8, 12, 1, '#aaaa55');
    p.r(3, 5, 1, 3, '#aaaa55');
    p.r(10, 5, 1, 3, '#aaaa55');
    p.disc(7, 5, 3, '#aa0000');
    p.ring(7, 5, 2, '#ff5555');
    p.p(5, 3, '#ff5555');
    p.p(8, 7, '#550000');
  }, { floor: true }),
  ent('lib-ar-binder', [[16, 22]], (p) => {
    // An upright bundle of thin object-file pamphlets cinched by two buckled leather straps.
    p.r(2, 1, 12, 20, PAPER);
    p.r(2, 1, 1, 20, WHITE);
    p.r(13, 1, 1, 20, '#aaaa55');
    for (const [y, len] of [[1, 5], [9, 5], [17, 4]] as const) for (let x = 4; x <= 11; x += 2) p.r(x, y, 1, len, '#aaaa55');
    for (const y of [6, 14]) {
      p.r(1, y, 14, 3, WOOD_DK);
      p.r(1, y, 14, 1, WOOD);
      p.r(10, y, 3, 3, BRASS);
      p.p(11, y + 1, BLACK);
    }
  }, { floor: true }),
  ent('lib-dlopen-lift', [[22, 36]], (p) => {
    // Wooden dumbwaiter: a brass pulley hauls an open service box carrying one gold-banded volume.
    for (const x of [2, 18]) {
      p.r(x, 3, 2, 31, WOOD);
      p.r(x, 3, 1, 31, WOOD_HI);
    }
    p.r(1, 1, 20, 3, WOOD);
    p.r(1, 1, 20, 1, WOOD_HI);
    p.disc(11, 7, 3, BRASS);
    p.disc(11, 7, 1, WOOD_DK);
    p.l(11, 10, 7, 21, SILVER);
    p.l(11, 10, 15, 21, SILVER);
    p.r(8, 17, 6, 8, '#aa0000');
    p.r(8, 19, 6, 1, BRASS);
    p.r(8, 23, 6, 1, BRASS);
    p.r(6, 21, 10, 8, WOOD);
    p.r(6, 21, 10, 1, WOOD_HI);
    p.r(15, 21, 1, 8, WOOD_DK);
    p.r(6, 28, 10, 1, WOOD_DK);
    p.r(0, 34, 22, 2, WOOD_DK);
    p.r(0, 34, 22, 1, WOOD);
  }, { floor: true }),
  ent('lib-bookdrop', [[16, 17]], (p) => {
    // Book-return chute on a post: a hinged brass flap with a red volume half pushed through.
    p.r(1, 1, 14, 11, WOOD);
    p.r(1, 1, 14, 1, WOOD_HI);
    p.r(1, 1, 1, 11, WOOD_HI);
    p.r(14, 2, 1, 10, WOOD_DK);
    p.r(3, 4, 10, 4, BLACK);
    p.r(5, 3, 6, 5, '#aa0000');
    p.r(5, 3, 1, 5, '#ff5555');
    p.r(3, 7, 10, 2, BRASS);
    p.r(3, 7, 10, 1, WHITE);
    p.r(6, 12, 4, 3, WOOD_DK);
    p.r(3, 15, 10, 1, WOOD_DK);
  }, { floor: true }),
    ent('lib-inkwell', [[12, 13]], (p) => {
      // Square dark-grey ink bottle with a silver collar; the quill rests in its neck.
      p.r(2, 6, 8, 7, '#555555');
      p.r(2, 6, 1, 7, '#aaaaaa');
      p.r(9, 6, 1, 7, '#000000');
      p.r(4, 4, 4, 2, '#aaaaaa');
      p.r(5, 4, 2, 1, '#000000');
      p.l(6, 4, 10, 0, '#ffffaa');
      p.l(7, 4, 11, 1, '#ffffff');
      p.l(7, 3, 10, 1, '#ffffaa');
    }),
    ent('lib-codex', [[15, 13]], (p) => {
      p.r(0, 1, 15, 11, '#550000');
      p.r(1, 2, 13, 9, '#aa5500');
      p.r(2, 2, 11, 9, '#ffffaa');
      p.r(0, 4, 2, 2, '#ffff55');
      p.r(13, 4, 2, 2, '#ffff55');
      p.r(4, 5, 7, 1, '#555555');
      p.r(4, 8, 5, 1, '#555555');
    }),
    ent('lib-scales', [[17, 14]], (p) => {
      p.r(8, 1, 1, 12, '#ffff55');
      p.r(5, 13, 7, 1, '#aa5500');
      p.r(2, 3, 13, 1, '#ffff55');
      p.l(2, 4, 1, 8, '#aaaaaa');
      p.l(14, 4, 15, 8, '#aaaaaa');
      p.r(0, 8, 4, 2, '#aa5500');
      p.r(13, 8, 4, 2, '#aa5500');
    }),
    ent('lib-hourglass', [[11, 14]], (p) => {
      p.r(1, 0, 9, 2, '#aa5500');
      p.r(1, 12, 9, 2, '#aa5500');
      p.l(2, 2, 8, 11, '#aaaaaa');
      p.l(8, 2, 2, 11, '#aaaaaa');
      p.r(4, 3, 3, 2, '#ffffaa');
      p.r(3, 10, 5, 2, '#ffff55');
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
