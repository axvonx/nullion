/** Layer `libraries`: Shared code every program leans on. */
import { hash, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef, type Pen } from '../render/v4/kit';
import { runtime } from './runtime';
import { R, TAU, disc, fill, line, mod, px, rect, ring } from './shared/draw-kit';
import { text, variants } from '../text';
import type { LayerArt } from './types';

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

const PROPS: EntityDef[] = [
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

const ANCHORS: EntityDef[] = [
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

export const libraries: LayerArt = {
  family: 'libraries',
  wiki: 'https://en.wikipedia.org/wiki/Library_(computing)',
  blurb: text('layers.libraries.blurb'),
  palette: 'rgb4',
  form: 'repl',
  cursor: 'ibeam',
  stackTheme: {
    accent: '#e08b3e',
    hi: '#ffe082',
    tint: 'rgba(224, 139, 62, 0.14)',
    border: 'rgba(224, 139, 62, 0.38)',
    anim: 'none',
    icon: [
      ' ##  ##  ',
      ' #+##+# #',
      ' ##  ##+#',
      ' ##  ## #',
      ' #+##+# #',
      ' ##  ##+#',
      ' ##  ## #',
      '#########',
      '.........',
    ],
  },
  topicTags: ['dsa', 'sorting', 'languages'],
  library: { own: PROPS, anchors: ANCHORS, density: 4.4, anchorCount: 2, far: 0.4, floorOffset: 4 },
  keepOut: (_top, bottom, W) => {
    return [{ x: 0, y: bottom - 4, w: W, h: 4 }];
  },
  fog: [0, 0, 0],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000000');
    entities();
    // The reading-room floor.
    fill(ctx, 0, b.bottom - 4, b.w, 4, '#550000');
    fill(ctx, 0, b.bottom - 4, b.w, 1, '#aa5500');
    for (let x = mod(-7, 23); x < b.w; x += 23) fill(ctx, x, b.bottom - 3, 1, 3, '#000000');
  },
  setpiece: {
    base: ({ ctx, t, W, cx, top, bot, cy, H }) => {
      // Full-bleed Grand Vaulted Reading-Room Cathedral: repeating timber arches, recessed stacks, central glowing brass rose window + warm light shafts!
      // Repeating background bookshelf bays spanning full width
      for (let x = 0; x < W; x += 48) {
        rect(ctx, x, top, 8, H, '#550000');
        rect(ctx, x, top, 2, H, '#aa5500');
        // Arched vault crown between pillars
        for (let a = 0; a < 24; a++) {
          const dx = a - 12;
          const ay = top + 16 - Math.round(Math.sqrt(Math.max(0, 144 - dx * dx)) * 0.9);
          rect(ctx, x + 8 + a * 1.6, top, 2, Math.max(2, ay - top), '#550000');
        }
        // Subtle recessed shelf horizontals
        for (let y = top + 34; y < bot - 12; y += 22) {
          rect(ctx, x + 8, y, 40, 2, '#550000');
        }
      }
      // Colossal central stained-glass / brass oculus rose window
      const oy = cy - 10;
      disc(ctx, cx, oy, 50, '#550000');
      ring(ctx, cx, oy, 50, '#aa5500');
      ring(ctx, cx, oy, 46, '#ffff55');
      ring(ctx, cx, oy, 32, '#aa5500');
      ring(ctx, cx, oy, 16, '#ffff55');
      for (let k = 0; k < 12; k++) {
        const a = (k * TAU) / 12;
        line(ctx, cx, oy, cx + Math.cos(a) * 48, oy + Math.sin(a) * 48, '#aa5500');
      }
      // Drifting golden dust motes in the rose-window light
      for (let k = 0; k < 6; k++) {
        const dx = cx - 36 + hash(k * 23) * 72;
        const dy = oy + 10 + mod(t * (3 + k) + hash(k * 11) * 60, 70);
        px(ctx, dx, dy, '#ffffaa');
      }
    },
    detail: ({ ctx, t, W, top }) => {
      // A rolling library ladder sliding along a top rail.
      const lx = R(mod(t * 10, W - 40) + 10);
      rect(ctx, 0, top + 4, W, 2, '#aa5500');
      rect(ctx, lx, top + 6, 2, 34, '#ffaa55');
      rect(ctx, lx + 10, top + 6, 2, 34, '#ffaa55');
      for (let y = top + 12; y < top + 38; y += 7) rect(ctx, lx, y, 12, 1, '#aa5500');
    },
  },
  ambient: runtime.ambient,
  critters: {
    motions: [MotionType.Hop, MotionType.Perch],
    count: 3,
    exitLabels: variants('layers.libraries.exit'),
    draw: ({ px, ink, variant, dir, perched }) => {
      // Bookworm: a square 6x6 body with two dark eyes and a hardcover book lying flat on its head
      // (coloured cover above and below, cream page block between).
      const bodies = ['#e6c785', '#7ec8e3', '#d990a8', '#8fd694', '#c5a3ff'];
      const covers = ['#c0392b', '#2e6fb7', '#2f8f5b', '#8e44ad', '#d68910'];
      const body = bodies[variant % bodies.length]!;
      const cover = covers[variant % covers.length]!;
      const dy = perched ? 1 : 0;
      px(-1, -3 + dy, 8, 1, cover);
      px(0, -2 + dy, 7, 2, '#fff5d6');
      px(0, -2 + dy, 7, 1, '#e6dcc0');
      px(-1, dy, 8, 1, cover);
      px(0, 1, 6, 5, body);
      px(dir > 0 ? 2 : 1, 3, 1, 1, ink);
      px(dir > 0 ? 4 : 3, 3, 1, 1, ink);
    },
    hop: { dur: 0.85, jitter: 0.3, arc: 10, pause: 0.85 },
  },
  sound: {
    timbre: { wave: 'pulse25', filterHz: 3600, q: 1.4, gainScale: 0.92, reverbWet: 0.2 },
    ambienceLevel: 0.06,
    drones: [{ freq: 110, wave: 'triangle', filterHz: 220, gain: 0.35 }],
    critterExit: { freq: 520, crush: false },
    critterCall: (snd, t, p) => {
      // Same blob vocabulary, toned down a few notes and softer
      const base = 260 + Math.random() * 60;
      snd.voice({ freq: base, toFreq: base * 1.45, at: t, dur: 0.105, wave: 'triangle', filterHz: 1400, q: 1.5, gain: 0.19, pan: p });
    },
    artifact: runtime.sound.artifact,
  },
};
