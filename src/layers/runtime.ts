/** Layer `runtime`: The engine that runs your code and tidies up its memory. */
import { hash, prows, vgrad, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef, type Pen } from '../render/v4/kit';
import { R, TAU, fill, frame, line, mod, rect } from './shared/draw-kit';
import type { LayerArt } from './types';

// Runtime (rgb6): heap objects on girders, references, GC, JIT, the event loop.
const OBJ: [string, string][] = [
  ['#cc6666', '#ff9999'],
  ['#66cc99', '#99ffcc'],
  ['#6699cc', '#99ccff'],
  ['#cccc66', '#ffff99'],
  ['#cc66cc', '#ff99ff'],
];

const GIRDER = '#666699';

const GIRDER_HI = '#9999cc';

const STRUT = '#333366';

const REF = '#6666cc';

const NAVY = '#000033';

function girder(p: Pen, x: number, y: number, w: number) {
  p.r(x, y, w, 2, GIRDER);
  p.r(x, y, w, 1, GIRDER_HI);
  for (let k = 2; k < w - 1; k += 6) p.r(x + k, y + 2, 1, 3, STRUT);
}

function obj(p: Pen, x: number, y: number, w: number, h: number, k: number) {
  const [body, lit] = OBJ[k % OBJ.length]!;
  p.r(x, y, w, h, body);
  p.r(x, y, w, 1, lit);
}

const PROPS: EntityDef[] = [
  ent('rt-objects', [[20, 14], [26, 14]], (p, w) => {
    girder(p, 0, 9, w);
    for (let ox = 1, n = 0; ox < w - 3; n++) {
      const ow = 2 + R(p.h(n * 3) * 2);
      const oh = 2 + R(p.h(n * 3 + 1) * 4);
      if (p.h(n * 3 + 2) > 0.25) obj(p, ox, 9 - oh, ow, oh, Math.floor(p.h(n + 40) * 5));
      ox += ow + 1;
    }
  }),
  ent(
    'rt-sweeper',
    [[30, 14]],
    (p, w) => girder(p, 0, 9, w),
    {
      anim: (p, w, _h, _v, t) => {
        const sx = R(mod(t * 7, w + 6)) - 6;
        for (let k = 0; k < 6; k++) {
          const ox = 2 + k * 5;
          const dead = p.h(k) > 0.5;
          if (dead && ox < sx && ox > sx - 22) continue;
          if (dead) {
            p.r(ox, 6, 3, 3, '#333333');
            p.r(ox, 6, 3, 1, '#666666');
          } else obj(p, ox, 6, 3, 3, k);
        }
        if (sx < -5 || sx > w - 1) return;
        p.r(sx + 1, 4, 4, 4, '#9999ff');
        p.r(sx + 2, 3, 2, 1, NAVY);
        p.r(sx + 3, 5, 1, 1, '#66ffff');
        p.r(sx + 5, 5, 1, 3, '#ffcc33');
        p.r(sx + 1, 8, 1, 1, '#9999cc');
        p.r(sx + 4, 8, 1, 1, '#9999cc');
      },
    },
  ),
  ent(
    'rt-tape',
    [[22, 10]],
    (p) => {
      p.disc(4, 4, 4, '#999999');
      p.disc(17, 4, 4, '#999999');
      p.r(4, 8, 14, 1, '#cccc99');
      p.r(3, 9, 16, 1, '#666666');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (const cx of [4, 17]) {
          p.disc(cx, 4, 2, '#333366');
          const a = t * 3;
          p.p(cx + R(Math.cos(a) * 2), 4 + R(Math.sin(a) * 2), '#ffffff');
        }
        const k = Math.floor(t * 6) % 4;
        for (let x = 6 + k; x < 16; x += 4) p.p(x, 8, '#333366');
      },
    },
  ),
  ent('rt-callstack', [[12, 16], [14, 20]], (p, w, h) => {
    const n = Math.floor((h - 1) / 3);
    for (let k = 0; k < n; k++) {
      const inset = k === 0 ? 0 : R(p.h(k) * 2);
      obj(p, inset, h - 3 - k * 3, w - inset * 2, 2, k);
    }
    p.r(R(w / 2), 0, 1, h - 3 - (n - 1) * 3, REF);
  }),
  ent('rt-refcount', [[11, 10]], (p) => {
    obj(p, 0, 3, 7, 7, Math.floor(p.h(0) * 5));
    p.disc(8, 2, 2, '#ff6666');
    const n = 1 + Math.floor(p.h(1) * 3);
    for (let k = 0; k < n; k++) p.p(7 + k, 2, '#ffffff');
  }),
  ent('rt-weakref', [[20, 10]], (p) => {
    obj(p, 0, 3, 5, 5, Math.floor(p.h(0) * 5));
    for (let x = 6; x < 13; x += 2) p.p(x, 5, REF);
    p.r(12, 4, 1, 3, REF);
    p.frame(14, 2, 6, 6, '#666699');
    p.p(16, 4, '#333366');
  }),
  ent('rt-finalizer', [[24, 12]], (p) => {
    p.r(18, 0, 6, 12, '#333366');
    p.r(19, 1, 4, 11, NAVY);
    p.p(20, 6, '#ffcc33');
    girder(p, 0, 9, 18);
    for (let k = 0; k < 3; k++) obj(p, 1 + k * 5, 5, 3, 4, Math.floor(p.h(k) * 5));
  }),
  ent(
    'rt-interp',
    [[12, 15]],
    (p) => {
      // Vertical opcode strip with a sliding read-head (distinct from rt-eventloop).
      p.box(3, 0, 8, 15, NAVY, GIRDER);
      for (let k = 0; k < 4; k++) p.r(5, 2 + k * 3, 4, 1, k % 2 ? '#6699cc' : '#9999cc');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const row = Math.floor(t * 2.4) % 4;
        const y = 2 + row * 3;
        p.r(0, y - 1, 3, 3, '#ffcc33');
        p.p(2, y, '#ffffff');
        p.r(5, y, 4, 1, '#ffff99');
      },
      noFlip: true,
    },
  ),
  ent('rt-hashmap', [[16, 14]], (p) => {
    for (let k = 0; k < 4; k++) {
      p.box(0, k * 3 + 1, 4, 3, NAVY, GIRDER);
      const chain = Math.floor(p.h(k) * 3);
      for (let j = 0; j < chain; j++) {
        p.r(4 + j * 4, k * 3 + 2, 1, 1, REF);
        obj(p, 5 + j * 4, k * 3 + 1, 2, 2, k + j);
      }
    }
  }),
  ent(
    'rt-closure',
    [[14, 13]],
    (p) => {
      // Sealed value pod with a captured environment block and dangling pointer tether.
      p.r(2, 1, 10, 9, STRUT);
      p.frame(2, 1, 10, 9, GIRDER_HI);
      p.r(4, 0, 6, 1, '#9999cc');
      obj(p, 4, 3, 6, 5, Math.floor(p.h(0) * 5));
      p.r(6, 10, 1, 2, REF);
      p.r(7, 11, 5, 1, REF);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const on = Math.floor(t * 2) % 2 === 0;
        p.p(12, 11, on ? '#ffff99' : '#6666cc');
      },
    },
  ),
  ent(
    'rt-eventloop',
    [[14, 14]],
    (p) => {
      p.disc(7, 7, 6, STRUT);
      p.disc(7, 7, 5, NAVY);
      for (let k = 0; k < 8; k++) {
        const a = (k * TAU) / 8;
        p.p(7 + R(Math.cos(a) * 5), 7 + R(Math.sin(a) * 5), k % 2 ? '#666699' : '#9999cc');
      }
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const a = t * 1.6;
        p.l(7, 7, 7 + Math.cos(a) * 4, 7 + Math.sin(a) * 4, '#ffff99');
        p.p(7, 7, '#ffffff');
      },
      noFlip: true,
    },
  ),
  ent(
    'rt-promise',
    [[12, 12]],
    (p) => {
      p.box(0, 0, 12, 12, NAVY, '#9999cc');
      p.r(3, 2, 6, 1, '#cccc66');
      p.r(4, 3, 4, 2, '#cccc66');
      p.r(5, 5, 2, 2, '#cccc66');
      p.r(4, 7, 4, 2, '#666633');
      p.r(3, 9, 6, 1, '#cccc66');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (Math.floor(t * 4) % 2) p.p(6, 7, '#ffff99');
        p.p(5 + (Math.floor(t * 2) % 2), 4, '#ffff99');
      },
      noFlip: true,
    },
  ),
  ent('rt-vtable', [[14, 14]], (p) => {
    p.box(0, 0, 8, 14, NAVY, GIRDER);
    for (let k = 0; k < 4; k++) {
      p.r(1, 1 + k * 3, 6, 2, k % 2 ? '#333366' : '#666699');
      if (p.h(k) > 0.4) {
        p.r(8, 2 + k * 3, 4, 1, REF);
        p.p(12, 2 + k * 3, '#ffff99');
      }
    }
  }),
  ent('rt-tricolor-signal', [[10, 17]], (p) => {
    // Three-lens signal lantern on an iron post: black, grey, lit white.
    p.r(2, 0, 6, 11, GIRDER);
    p.r(2, 0, 6, 1, GIRDER_HI);
    p.r(2, 0, 1, 11, GIRDER_HI);
    p.r(4, 1, 3, 3, '#ffffff');
    p.r(4, 4, 3, 3, '#999999');
    p.r(4, 7, 3, 3, NAVY);
    p.r(4, 11, 2, 4, STRUT);
    p.r(2, 15, 6, 1, STRUT);
  }),
  ent('rt-bump-dispenser', [[20, 18]], (p) => {
    // Ticket dispenser: a paper roll with a brass pointer arm riding its advancing tear edge.
    p.r(2, 15, 16, 2, STRUT);
    p.r(3, 8, 14, 7, GIRDER);
    p.r(3, 8, 14, 1, GIRDER_HI);
    p.disc(9, 5, 5, '#ffffcc');
    p.ring(9, 5, 5, '#cccc99');
    p.disc(9, 5, 1, '#999999');
    p.r(11, 10, 4, 4, '#ffffcc');
    p.p(11, 13, '#cccc99');
    p.p(13, 13, '#cccc99');
    p.l(17, 9, 13, 6, '#cccc66');
    p.r(16, 8, 2, 2, '#ffff99');
  }),
  ent('rt-card-table', [[22, 18]], (p) => {
    // Wall-mounted sheet-metal card rack: two cards stick up with red-inked dirty tabs.
    p.r(1, 1, 20, 16, GIRDER);
    p.r(1, 1, 20, 1, GIRDER_HI);
    p.r(1, 1, 1, 16, GIRDER_HI);
    for (const [y, dirty] of [[3, 2], [10, 5]] as const) {
      for (let k = 0; k < 8; k++) p.r(3 + k * 2, k === dirty ? y - 1 : y, 1, k === dirty ? 6 : 5, '#ffffcc');
      p.r(3 + dirty * 2, y - 1, 1, 2, '#cc3333');
      p.r(2, y + 5, 18, 1, STRUT);
    }
  }),
  ent('rt-intern-rack', [[28, 32]], (p) => {
    // Key-duplicating board on two legs: a row of identical brass blanks on numbered hooks.
    p.r(1, 2, 26, 16, STRUT);
    p.r(0, 0, 28, 3, GIRDER);
    p.r(0, 0, 28, 1, GIRDER_HI);
    for (let k = 0; k < 8; k++) {
      const x = 2 + k * 3;
      p.p(x + 1, 3, '#cccccc');
      p.r(x, 4, 3, 3, '#cccc66');
      p.p(x + 1, 5, STRUT);
      p.r(x + 1, 7, 1, 8, '#cccc66');
      p.p(x + 2, 11, '#cccc66');
      p.p(x + 2, 13, '#cccc66');
      p.p(x + 1, 16, '#999999');
    }
    for (const x of [3, 22]) {
      p.r(x, 18, 3, 13, GIRDER);
      p.r(x, 18, 1, 13, GIRDER_HI);
      p.r(x - 1, 31, 5, 1, GIRDER_HI);
    }
    p.r(3, 26, 22, 1, STRUT);
  }),
  ent('rt-safepoint-whistle', [[10, 13]], (p) => {
    // Brass referee whistle hanging from an iron wall peg by a dark lanyard loop.
    p.r(1, 0, 6, 2, GIRDER);
    p.r(1, 0, 6, 1, GIRDER_HI);
    p.r(3, 2, 1, 4, STRUT);
    p.r(3, 5, 4, 1, STRUT);
    p.r(0, 7, 4, 3, '#cccc66');
    p.disc(6, 8, 3, '#cccc66');
    p.p(7, 7, NAVY);
    p.r(5, 6, 3, 1, '#ffff99');
    p.p(1, 7, '#ffff99');
  }),
  ent('rt-alarm', [[12, 16]], (p) => {
    // Pull-station on a post: the alarm an exception rings.
    p.r(1, 1, 10, 12, '#cc3333');
    p.r(1, 1, 10, 1, '#ff6666');
    p.r(1, 1, 1, 12, '#ff6666');
    p.r(10, 2, 1, 11, '#993333');
    p.r(3, 3, 6, 3, '#ffffff');
    p.r(4, 4, 4, 1, '#999999');
    p.r(3, 8, 6, 2, '#ffffff');
    p.r(5, 13, 2, 2, STRUT);
    p.r(3, 15, 6, 1, STRUT);
  }),
  ent('rt-profiler', [[12, 14]], (p) => {
    // A stopwatch on a little stand: the sampling profiler's clock.
    p.r(5, 0, 2, 1, '#999999');
    p.disc(6, 6, 5, '#cccccc');
    p.disc(6, 6, 4, '#ffffff');
    for (const [x, y] of [[6, 3], [9, 6], [6, 9], [3, 6]] as const) p.p(x, y, '#333366');
    p.l(6, 6, 8, 4, '#cc3333');
    p.p(6, 6, '#333366');
    p.r(3, 12, 6, 1, STRUT);
    p.r(5, 11, 2, 1, STRUT);
  }),
    ent('rt-nursery', [[18, 13]], (p) => {
      // Low wooden seedling flat on short feet: a brass tag on the rim, four sprouts in dark soil.
      p.r(0, 5, 18, 6, '#996633');
      p.r(0, 5, 18, 1, '#cc9966');
      p.r(17, 6, 1, 5, '#663300');
      p.r(1, 5, 16, 2, '#333300');
      for (let k = 0; k < 4; k++) {
        const x = 3 + k * 4;
        p.r(x, 2, 1, 4, '#66cc66');
        p.r(x - 1, 1, 1, 2, k % 2 ? '#ffff66' : '#99ff99');
        p.r(x + 1, 1, 1, 2, '#99ff99');
      }
      p.r(7, 8, 4, 2, '#cccc66');
      p.r(7, 8, 4, 1, '#ffff99');
      p.r(2, 11, 3, 1, '#663300');
      p.r(13, 11, 3, 1, '#663300');
    }),
];

const ANCHORS: EntityDef[] = [
  ent('rt-scaffold', [[64, 52]], (p) => {
    // A three-deck heap scaffold: generations stacked, a ladder up the side.
    for (let k = 0; k < 3; k++) {
      const y = 14 + k * 17;
      const w = 64 - k * 0;
      girder(p, 0, y, w);
      for (let ox = 2, n = 0; ox < w - 6; n++) {
        const ow = 3 + R(p.h(k * 20 + n) * 3);
        const oh = 3 + R(p.h(k * 20 + n + 7) * 8);
        if (p.h(k * 20 + n + 3) > 0.2) obj(p, ox, y - oh, ow, oh, k * 3 + n);
        ox += ow + 1;
      }
    }
    for (const x of [0, 63]) p.r(x, 0, 1, 52, STRUT);
    p.r(0, 0, 64, 1, GIRDER);
    for (let y = 3; y < 50; y += 3) p.r(57, y, 5, 1, '#9999cc');
    p.r(56, 0, 1, 50, '#666699');
    p.r(62, 0, 1, 50, '#666699');
  }),
  ent(
    'rt-incinerator',
    [[40, 44]],
    (p) => {
      p.r(26, 7, 7, 13, '#333366');
      p.r(27, 7, 5, 13, '#666699');
      p.r(2, 18, 36, 26, '#333366');
      p.r(3, 19, 34, 1, '#9999cc');
      p.r(10, 26, 20, 14, NAVY);
      p.r(10, 26, 20, 1, '#666699');
      for (let x = 12; x < 29; x += 4) p.r(x, 27, 1, 13, '#333366');
      p.r(4, 22, 4, 2, '#ffcc33');
      p.r(32, 22, 4, 2, '#cc6666');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const f = 0.6 + 0.4 * Math.sin(t * 5);
        p.glow(20, 36, 16, `rgba(255,120,40,${(0.35 * f).toFixed(2)})`);
        for (let k = 0; k < 5; k++) {
          const fh = 3 + R((Math.sin(t * 6 + k * 1.9) * 0.5 + 0.5) * 6);
          p.r(11 + k * 4, 40 - fh, 3, fh, k % 2 ? '#ff9933' : '#ffcc33');
        }
        for (let k = 0; k < 3; k++) {
          const q = mod(t * 0.4 + k / 3, 1);
          p.r(28 + R(Math.sin(q * 5 + k) * 2), 5 - R(q * 5), 3, 2, q < 0.5 ? '#999999' : '#666666');
        }
      },
    },
  ),
];

export const runtime: LayerArt = {
  family: 'runtime',
  blurb: 'The engine that runs your code and tidies up its memory',
  palette: 'rgb6',
  form: 'repl',
  cursor: 'ibeam',
  stackTheme: {
    accent: '#8a8aff',
    hi: '#d0d0ff',
    tint: 'rgba(138, 138, 255, 0.14)',
    border: 'rgba(138, 138, 255, 0.36)',
    anim: 'pulse',
    icon: [
      '  #####  ',
      ' #     # ',
      '#  +#+  #',
      '# +   + #',
      '#  +#+  #',
      '#       #',
      ' # +++ # ',
      '  #####  ',
      '   # #   ',
    ],
  },
  topicTags: ['languages', 'dsa', 'concurrency'],
  library: { own: PROPS, anchors: ANCHORS, density: 4.6, anchorCount: 2, far: 0.45 },
  fog: [0, 0, 51],
  nameTopOffset: 64,
  background: (ctx, b, { T, entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000033');
    vgrad(ctx, b, b.top, b.top + 50, [
      [0, 'rgba(102,102,204,0.55)'],
      [1, 'rgba(102,102,204,0)'],
    ]);
    entities();
    // Freed bytes drifting up.
    prows(b, 1.25, 12, (y, i) => {
      if (hash(i * 5) < 0.6) return;
      fill(ctx, hash(i * 5 + 1) * b.w, y - mod(T * 4, 12), 1, 1, '#9999cc');
    });
  },
  setpiece: {
    base: ({ ctx, t, W, top, bot, H }) => {
      // Full-bleed Colossal Steel Heap Cavern: upper & lower truss bridges, sweeping GC crane carrying a glowing block, & lower compactor bin!
      for (const sx of [8, W - 22]) {
        rect(ctx, sx, top, 14, H, '#1e1a3a');
        rect(ctx, sx, top, 2, H, '#333366');
        rect(ctx, sx + 12, top, 2, H, '#333366');
        for (let y = top; y < bot; y += 16) line(ctx, sx + 2, y, sx + 12, y + 14, '#333366');
      }
      const beamY = top + 20;
      rect(ctx, 0, beamY, W, 6, '#333366');
      rect(ctx, 0, beamY, W, 1, '#666699');
      for (let x = 0; x < W; x += 22) {
        line(ctx, x, beamY + 6, x + 11, beamY + 20, '#333366');
        line(ctx, x + 11, beamY + 20, x + 22, beamY + 6, '#333366');
      }
      rect(ctx, 0, beamY + 20, W, 3, '#333366');
      // Lower deep-background heap catwalk & moving memory blocks
      const lowY = bot - 28;
      rect(ctx, 0, lowY, W, 4, '#333366');
      rect(ctx, 0, lowY, W, 1, '#666699');
      for (let k = 0; k < 7; k++) {
        const bx = mod(k * 58 + t * 8, W + 40) - 20;
        rect(ctx, bx, lowY - 8, 12, 8, k % 2 ? '#333366' : '#336666');
        rect(ctx, bx, lowY - 8, 12, 1, '#666699');
      }
      // Recognizable GC compactor / incinerator hopper on the lower-right catwalk
      const binX = W - 62;
      rect(ctx, binX, lowY - 22, 30, 22, '#333366');
      frame(ctx, binX, lowY - 22, 30, 22, '#666699');
      rect(ctx, binX - 4, lowY - 25, 38, 4, '#666699');
      // Hazard stripes + furnace glow slot inside compactor
      for (let sx = binX + 3; sx < binX + 26; sx += 6) rect(ctx, sx, lowY - 19, 3, 3, '#ffcc33');
      rect(ctx, binX + 5, lowY - 11, 20, 7, Math.floor(t * 5) % 2 ? '#ff9933' : '#cc3333');
      // Slow-sweeping overhead GC electromagnet crane visibly carrying a glowing memory block!
      const tx = R(W * 0.14 + (Math.sin(t * 0.28) * 0.5 + 0.5) * W * 0.72);
      const drop = 34 + R(Math.sin(t * 0.7) * 14);
      rect(ctx, tx - 10, beamY + 4, 20, 9, '#666699');
      rect(ctx, tx - 6, beamY + 6, 12, 3, '#9999cc');
      rect(ctx, tx - 1, beamY + 13, 2, drop, '#666699');
      rect(ctx, tx - 9, beamY + 13 + drop, 18, 6, '#9999cc');
      rect(ctx, tx - 7, beamY + 19 + drop, 14, 2, Math.floor(t * 4) % 2 ? '#ffff99' : '#ffcc33');
      // Glowing suspended heap block clamped under the electromagnet
      rect(ctx, tx - 7, beamY + 21 + drop, 14, 10, '#336699');
      frame(ctx, tx - 7, beamY + 21 + drop, 14, 10, '#66cccc');
      rect(ctx, tx - 4, beamY + 24 + drop, 8, 2, '#ffff99');
      rect(ctx, tx - 4, beamY + 27 + drop, 5, 2, '#99ffff');
    },
    detail: ({ ctx, t, W, top, H, rise }) => {
      // Dead grey blocks tumbling toward the incinerator while freed bytes drift up.
      for (let k = 0; k < 4; k++) {
        const x = R(W * (0.2 + k * 0.2));
        const y = top + 30 + mod(t * 16 + k * 40, Math.max(40, H - 50));
        rect(ctx, x, y, 7, 5, '#555588');
        rect(ctx, x, y, 7, 1, '#9999cc');
      }
      rise(6, 9, 21, '#9999cc', 2);
    },
  },
  ambient: ({ ctx, W, H, t, col, i, s1, s2, s3 }) => {
    const x = Math.round(s1 * W);
    const y = Math.round((((s2 * H - t * (10 + s3 * 14)) % H) + H) % H);
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = col(i % 2 === 0 ? '#7ec8e3' : '#f5d76e');
    ctx.fillRect(x, y, 1, 1);
  },
  critters: {
    motions: [MotionType.Hop, MotionType.Perch],
    count: 3,
    exitLabels: ["GC'd!", 'swept!'],
    draw: ({ px, ink, variant, dir, perched, hopFrac }) => {
      const bodies = ['#5fd3e0', '#7ee0a1', '#f5d76e', '#ff9f43', '#c58bff'];
      const body = bodies[variant % bodies.length]!;
      const squish = perched || hopFrac < 0.1 || hopFrac > 0.9;
      const topY = squish ? 1 : 0;
      px(1, topY, 4, 6 - topY, body);
      px(0, topY + 1, 6, 5 - topY, body);
      px(2, topY, 2, 1, '#ffffff');
      const ex = dir > 0 ? 2 : 1;
      const ey = squish ? 3 : 2;
      px(ex, ey, 1, 1, ink);
      px(ex + 2, ey, 1, 1, ink);
    },
    hop: { arc: 16, pause: 0.45 },
  },
  sound: {
    timbre: { wave: 'pulse25', filterHz: 3600, q: 1.4, gainScale: 0.92, reverbWet: 0.2 },
    ambienceLevel: 0.06,
    drones: [{ freq: 110, wave: 'triangle', filterHz: 220, gain: 0.35 }],
    critterExit: { freq: 520, crush: false },
    critterCall: (snd, t, p) => {
      // Bouncy helper-blob upward boing / bloop
      const base = 360 + Math.random() * 90;
      snd.voice({ freq: base, toFreq: base * 1.75, at: t, dur: 0.095, wave: 'pulse25', filterHz: 2200, q: 2.2, gain: 0.21, pan: p });
      snd.voice({ freq: base * 1.5, at: t + 0.08, dur: 0.045, wave: 'triangle', gain: 0.15, pan: p });
    },
    artifact: (snd, t, pan) => {
      // Tiny rising GC spark / glassy FM micro-chime
      snd.fmVoice({ carrierHz: 520 + Math.random() * 240, toCarrierHz: 880, modRatio: 2.5, modIndex: 110, at: t, dur: 0.09, gain: 0.055, pan });
    },
  },
};
