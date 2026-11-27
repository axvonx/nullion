/** Layer `ring-2`: System Management Mode, which can pause everything above it. */
import { hash, line as artLine, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef, type Pen } from '../render/v4/kit';
import { R, TAU, disc, fill, line, rect, ring } from './shared/draw-kit';
import { text } from '../text';
import type { LayerArt } from './types';

// Ring −2 (five greys): System Management Mode, where time stops. Everything hangs mid-motion.
const K0 = '#000000';

const K1 = '#404040';

const K2 = '#808080';

const K3 = '#c0c0c0';

const K4 = '#ffffff';

const DEBRIS: string[][] = [
  ['kkkkkkk', 'kdddddk', 'kwwwwwk', 'kwsswwk', 'kwwwwwk', 'kkkkkkk'],
  ['kkkk', 'kdgk', 'kdwk', 'kdgk', 'kkkk'],
  [' k k ', 'kgggk', 'kgkgk', 'kgggk', ' k k '],
  [' kk ', 'kwwk', 'kwwk', 'kwwk', ' kk '],
  ['k    ', 'wk   ', 'wgk  ', 'wggk ', 'kkkkk'],
  ['k k k', 'kkkkk', 'kdwdk', 'kkkkk', 'k k k'],
];

const DEBRIS_PAL: Record<string, string> = { k: K1, w: K4, g: K3, d: K2, s: K1 };

/** Frozen-fall streak: a vertical trail above a falling thing. */
function streak(p: Pen, x: number, y0: number, len: number) {
  for (let j = 0; j < len; j++) p.p(x, y0 + j, j > len / 2 ? K2 : K1);
}

const PROPS: EntityDef[] = [
  ent('r2-clock', [[13, 13]], (p) => {
    p.disc(6, 6, 6, K2);
    p.disc(6, 6, 5, K1);
    for (let k = 0; k < 4; k++) p.p(6 + R(Math.cos((k * TAU) / 4) * 4), 6 + R(Math.sin((k * TAU) / 4) * 4), K3);
    const a = p.h(0) * TAU;
    p.l(6, 6, 6 + Math.cos(a) * 3, 6 + Math.sin(a) * 3, K3);
    p.l(6, 6, 6 + Math.cos(a * 7) * 4, 6 + Math.sin(a * 7) * 4, K4);
  }),
  ent('r2-hourglass', [[9, 13]], (p) => {
    p.r(0, 0, 9, 1, K3);
    p.r(0, 12, 9, 1, K3);
    p.l(1, 1, 7, 11, K2);
    p.l(7, 1, 1, 11, K2);
    p.r(2, 2, 5, 2, K3);
    p.p(4, 6, K4);
    p.p(4, 8, K3);
    p.r(3, 10, 3, 2, K3);
  }),
  ent('r2-ghostgear', [[17, 13]], (p) => {
    for (let g = 0; g < 3; g++) {
      const cx = 4 + g * 4;
      const col = g === 2 ? K3 : g === 1 ? K1 : K1;
      p.ring(cx, 6, 4, col);
    }
    p.disc(12, 6, 3, K2);
    p.p(12, 6, K0);
    for (let k = 0; k < 6; k++) p.p(12 + R(Math.cos((k * TAU) / 6) * 5), 6 + R(Math.sin((k * TAU) / 6) * 5), K3);
  }),
  ent('r2-safe', [[13, 13]], (p) => {
    p.r(0, 0, 13, 12, K2);
    p.r(1, 1, 11, 10, K1);
    p.disc(6, 6, 3, K3);
    p.p(6, 6, K0);
    p.r(10, 4, 1, 4, K3);
    p.r(1, 12, 2, 1, K2);
    p.r(10, 12, 2, 1, K2);
  }),
  ent('r2-metronome', [[11, 14]], (p) => {
    // Frozen metronome stopped mid-tick.
    p.r(4, 2, 3, 3, K1);
    p.r(3, 5, 5, 7, K1);
    p.r(1, 12, 9, 2, K2);
    p.l(2, 12, 4, 1, K2);
    p.l(8, 12, 6, 1, K2);
    p.r(4, 1, 3, 1, K3);
    p.l(5, 11, 9, 3, K4);
    p.r(7, 4, 2, 2, K3);
  }),
  ent('r2-cracks', [[15, 17]], (p) => {
    // Cracked frozen pocket-watch silhouette with crown ring, fracture wedge, and stopped hands.
    p.ring(7, 2, 2, K3);
    p.r(6, 4, 3, 1, K2);
    p.disc(7, 10, 6, K3);
    p.disc(7, 10, 5, K0);
    // Cracked glass wedge missing on upper right
    p.l(7, 10, 12, 6, K2);
    p.l(7, 10, 11, 14, K1);
    p.r(7, 6, 1, 4, K4);
    p.r(7, 10, 4, 1, K3);
  }),
  ent('r2-hook', [[8, 17]], (p) => {
    for (let y = 1; y < 10; y += 2) p.r(4, y, 1, 1, K2);
    for (let y = 2; y < 10; y += 2) p.r(3, y, 3, 1, K1);
    p.r(4, 10, 1, 4, K3);
    p.r(2, 14, 5, 1, K3);
    p.r(2, 12, 1, 2, K3);
    p.p(1, 12, K3);
  }),
  ent('r2-stopwatch', [[11, 13]], (p) => {
    p.r(4, 0, 3, 1, K3);
    p.r(5, 1, 1, 1, K2);
    p.disc(5, 7, 5, K3);
    p.disc(5, 7, 4, K0);
    p.r(5, 3, 1, 4, K4);
    p.p(4, 7, K2);
  }),
  ent('r2-domino', [[15, 13]], (p) => {
    p.r(0, 12, 15, 1, K1);
    p.r(0, 4, 3, 8, K3);
    p.l(5, 11, 9, 3, K3);
    p.l(6, 11, 10, 3, K3);
    p.l(7, 11, 11, 3, K2);
    p.r(12, 9, 3, 3, K2);
    p.p(1, 6, K0);
    p.p(1, 9, K0);
  }),
  ent('r2-coin', [[11, 15]], (p) => {
    // A coin on edge in a slotted coin stand, caught in the instant it dropped.
    p.p(5, 0, K1);
    p.p(5, 1, K2);
    p.disc(5, 6, 4, K3);
    p.ring(5, 6, 3, K2);
    p.r(4, 4, 1, 4, K4);
    p.r(1, 10, 9, 3, K2);
    p.r(1, 10, 9, 1, K3);
    p.r(3, 10, 5, 1, K0);
    p.r(0, 13, 11, 2, K1);
    p.r(0, 13, 11, 1, K2);
  }),
  ent('r2-pause', [[15, 15]], (p) => {
    // Suspended teardrop hanging mid-air above a frozen crown splash.
    p.p(7, 1, K4);
    p.r(6, 2, 3, 2, K3);
    p.r(5, 4, 5, 3, K3);
    p.r(6, 7, 3, 1, K2);
    p.p(6, 4, K4);
    // Frozen splash crown below
    p.r(2, 13, 11, 2, K2);
    p.l(4, 13, 2, 9, K3);
    p.l(10, 13, 12, 9, K3);
    p.p(2, 8, K4);
    p.p(12, 8, K4);
    p.p(7, 10, K3);
  }),
  ent('r2-tseg-fence', [[24, 18]], (p) => {
    // Short iron picket fence bolted to a baseplate, a heavy clasp across the middle rail.
    p.r(0, 15, 24, 2, K1);
    p.r(0, 15, 24, 1, K2);
    for (const x of [2, 10, 18]) {
      p.r(x, 3, 3, 12, K2);
      p.r(x, 3, 1, 12, K3);
      p.p(x + 1, 1, K3);
      p.p(x + 1, 2, K2);
    }
    p.r(0, 7, 24, 2, K3);
    p.r(0, 7, 24, 1, K4);
    p.r(9, 5, 6, 6, K1);
    p.r(10, 6, 4, 4, K2);
    p.p(12, 8, K4);
  }),
  ent('r2-smi-latch', [[12, 12]], (p) => {
    // Wall toggle latch: a spring-loaded lever snapped down into its locked notch.
    p.r(1, 1, 10, 10, K2);
    p.r(1, 1, 10, 1, K3);
    p.r(1, 1, 1, 10, K3);
    p.r(9, 4, 2, 4, K0);
    p.r(3, 5, 7, 2, K4);
    p.disc(3, 6, 1, K1);
    for (let x = 4; x <= 8; x++) p.p(x, 2 + (x % 2), K4);
  }),
  ent('r2-smram-ledger', [[14, 12]], (p) => {
    // A thick bound ledger on a trestle stand: ribbon bookmark out the top, clasp holding it shut.
    p.r(8, 0, 2, 3, K4);
    p.p(8, 3, K3);
    p.r(1, 3, 12, 5, K3);
    p.r(1, 3, 12, 1, K4);
    p.r(1, 3, 2, 5, K1);
    p.r(3, 7, 9, 1, K4);
    p.r(11, 4, 2, 3, K1);
    p.p(12, 5, K4);
    p.r(2, 8, 2, 3, K1);
    p.r(10, 8, 2, 3, K1);
    p.r(1, 10, 12, 1, K2);
  }),
  ent('r2-smbase', [[12, 16]], (p) => {
    // A surveyor's stake with a pennant frozen mid-flutter: SMBASE marks where the handler lives.
    p.r(5, 1, 2, 13, K3);
    p.r(5, 1, 1, 13, K4);
    p.r(7, 1, 4, 2, K4);
    p.r(7, 3, 3, 2, K3);
    p.r(7, 5, 2, 1, K2);
    p.r(2, 14, 8, 1, K1);
    p.r(3, 13, 6, 1, K2);
  }),
  ent('r2-smrr', [[16, 20]], (p) => {
    // A boundary stone with a painted band: the SMRR range marker.
    p.r(4, 1, 8, 2, K2);
    p.r(3, 3, 10, 14, K2);
    p.r(3, 3, 1, 14, K3);
    p.r(12, 4, 1, 13, K1);
    p.r(3, 8, 10, 3, K4);
    p.r(3, 8, 10, 1, K3);
    p.r(1, 17, 14, 2, K1);
    p.r(1, 17, 14, 1, K2);
  }),
  ent('r2-b2port', [[12, 14]], (p) => {
    // Wall doorbell plate on a post, its button held mid-press: the software-SMI trigger.
    p.r(1, 1, 10, 10, K2);
    p.r(1, 1, 10, 1, K3);
    p.r(1, 1, 1, 10, K3);
    p.disc(6, 5, 3, K1);
    p.disc(6, 5, 2, K4);
    p.p(5, 4, K3);
    p.r(5, 11, 2, 2, K1);
    p.r(3, 13, 6, 1, K2);
  }),
    ent('r2-feather', [[14, 13]], (p) => {
      // A feather resting on a small stone plinth, its last drift stilled.
      p.r(2, 9, 10, 3, '#404040');
      p.r(2, 9, 10, 1, '#808080');
      p.r(1, 11, 12, 1, '#404040');
      p.l(2, 8, 11, 2, '#ffffff');
      p.r(5, 6, 6, 2, '#c0c0c0');
      p.r(6, 4, 5, 2, '#c0c0c0');
      p.r(8, 3, 3, 1, '#808080');
    }),
    ent('r2-spark', [[12, 13]], (p) => {
      // A spark-gap on a ceramic baseplate, the arc caught between two ball-tipped posts.
      p.r(0, 10, 12, 3, '#808080');
      p.r(0, 10, 12, 1, '#c0c0c0');
      for (const x of [2, 8]) {
        p.r(x, 3, 2, 7, '#c0c0c0');
        p.r(x - 1, 2, 4, 2, '#ffffff');
        p.r(x - 1, 8, 4, 1, '#404040');
      }
      p.p(4, 4, '#ffffff');
      p.p(5, 5, '#ffffff');
      p.p(6, 4, '#ffffff');
      p.p(7, 5, '#ffffff');
    }),
    ent('r2-prism', [[13, 11]], (p) => {
      p.l(6, 0, 1, 10, '#c0c0c0');
      p.l(6, 0, 11, 10, '#c0c0c0');
      p.r(1, 10, 11, 1, '#808080');
      p.r(5, 4, 3, 4, '#ffffff');
    }),
];

const ANCHORS: EntityDef[] = [
  ent('r2-clocktower', [[36, 66]], (p) => {
    // A tower clock stopped at the instant of the SMI.
    p.r(6, 18, 24, 48, K1);
    p.r(6, 18, 1, 48, K2);
    p.r(4, 14, 28, 4, K2);
    p.l(4, 14, 18, 0, K2);
    p.l(31, 14, 18, 0, K2);
    p.disc(18, 30, 10, K3);
    p.disc(18, 30, 9, K0);
    for (let k = 0; k < 12; k++) p.p(18 + R(Math.cos((k * TAU) / 12) * 8), 30 + R(Math.sin((k * TAU) / 12) * 8), k % 3 ? K2 : K4);
    p.l(18, 30, 18 + 5, 30 - 3, K3);
    p.l(18, 30, 18 - 2, 30 - 7, K4);
    for (let y = 44; y < 62; y += 6) p.r(12, y, 12, 3, K0);
    // A pigeon frozen mid-takeoff.
    p.r(26, 6, 3, 2, K3);
    p.p(29, 5, K3);
    p.p(25, 5, K3);
  }),
  ent('r2-cascade', [[48, 58]], (p) => {
    // A cascade of the world above, every piece hanging where it was when time stopped.
    for (let k = 0; k < 14; k++) {
      const x = 2 + R(p.h(k) * 40);
      const y = 4 + R((k / 14) * 44 + p.h(k + 30) * 6);
      const rows = DEBRIS[k % DEBRIS.length]!;
      streak(p, x + 2, y - 6, 5);
      rows.forEach((row, ry) => {
        for (let rx = 0; rx < row.length; rx++) if (row[rx] !== ' ') p.p(x + rx, y + ry, DEBRIS_PAL[row[rx]!]!);
      });
    }
    p.r(0, 56, 48, 2, K1);
  }),
];

export const ringMinus2: LayerArt = {
  family: 'ring-2',
  blurb: text('layers.ring-2.blurb'),
  palette: 'gray',
  form: 'smm',
  cursor: 'bit',
  stackTheme: {
    accent: '#b8b8c0',
    hi: '#f0f0f5',
    tint: 'rgba(184, 184, 192, 0.12)',
    border: 'rgba(184, 184, 192, 0.36)',
    // Ring −2 freezes time: intentionally static.
    anim: 'none',
    icon: [
      '  #####  ',
      ' #     # ',
      '#   +   #',
      '#   +   #',
      '#   +++ #',
      '#       #',
      '#       #',
      ' #     # ',
      '  #####  ',
    ],
  },
  topicTags: ['hardware', 'security', 'os'],
  library: { own: PROPS, anchors: ANCHORS, density: 4.4, anchorCount: 2, far: 0.4 },
  frozenTime: true,
  fog: [0, 0, 0],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000000');
    entities();
  },
  setpiece: {
    base: ({ ctx, W, cx, top, bot, cy, H }) => {
      // Full-bleed Shattered Colossal Pendulum Clockface with bold 2–3px frozen hands & pendulum rod + fracture webs!
      line(ctx, 0, top + 24, cx, cy - 6, '#404040');
      line(ctx, W, top + 40, cx, cy - 6, '#404040');
      line(ctx, 0, bot - 28, cx, cy - 6, '#404040');
      line(ctx, W, bot - 20, cx, cy - 6, '#404040');
      // Colossal frozen clockface (136px diameter)
      ring(ctx, cx, cy - 6, 68, '#808080');
      ring(ctx, cx, cy - 6, 67, '#c0c0c0');
      ring(ctx, cx, cy - 6, 62, '#404040');
      ring(ctx, cx, cy - 6, 44, '#404040');
      for (let k = 0; k < 12; k++) {
        const a = (k * TAU) / 12;
        const sz = k % 3 === 0 ? 5 : 3;
        rect(ctx, cx + Math.cos(a) * 56 - R(sz / 2), cy - 6 + Math.sin(a) * 56 - R(sz / 2), sz, sz, k % 3 === 0 ? '#ffffff' : '#808080');
      }
      // Thickened 2–3px frozen clock hands & bold angled frozen pendulum rod
      for (const d of [-1, 0, 1]) {
        line(ctx, cx + d, cy - 6, cx + 32 + d, cy - 30, d === 0 ? '#ffffff' : '#c0c0c0');
        line(ctx, cx + d, cy - 6, cx - 20 + d, cy - 50, '#ffffff');
        line(ctx, cx + d, cy - 6, cx + 40 + d, cy + 68, d === 0 ? '#c0c0c0' : '#808080');
      }
      disc(ctx, cx, cy - 6, 5, '#ffffff');
      disc(ctx, cx + 40, cy + 68, 10, '#c0c0c0');
      ring(ctx, cx + 40, cy + 68, 10, '#ffffff');
      for (let k = 0; k < 12; k++) {
        const sx = R(hash(k * 37 + 1) * (W - 20) + 10);
        const sy = R(top + 16 + hash(k * 53 + 2) * (H - 32));
        rect(ctx, sx, sy, 3, 2, k % 2 ? '#808080' : '#c0c0c0');
      }
    },
    detail: ({ ctx, W, top, H }) => {
      // Static extra frozen dust (SMM never animates).
      for (let k = 0; k < 24; k++) {
        const x = hash(k * 29 + 5) * W;
        const y = top + hash(k * 31 + 9) * H;
        rect(ctx, x, y, 1, 1, k % 3 === 0 ? '#c0c0c0' : '#404040');
      }
    },
  },
  // SMI: a crack of lightning, frozen as it struck.
  seam: (ctx, y, b) => {
    let x = 0;
    let yy = y;
    while (x < b.w) {
      const nx = x + 4 + R(hash(x + 31) * 6);
      const ny = y + R((hash(x + 77) - 0.5) * 6);
      artLine(ctx, x, yy, nx, ny, '#ffffff');
      if (hash(x + 99) > 0.8) artLine(ctx, nx, ny, nx + 3, ny + 5 + R(hash(x) * 5), '#c0c0c0');
      x = nx;
      yy = ny;
    }
  },
  ambient: ({ ctx, W, H, col, s1, s2 }) => {
    const x = Math.round(s1 * W);
    const y = Math.round(s2 * H);
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = col('#bebebe');
    ctx.fillRect(x, y, 1, 1);
  },
  critters: {
    motions: [MotionType.Frozen],
    count: 3,
    exitLabels: [''], // none: time is stopped here, so nothing despawns with a tag
    draw: ({ px, ink, variant }) => {
      if (variant % 3 === 0) {
        px(0, 0, 6, 6, '#bebebe');
        px(2, 0, 2, 2, '#f0f0f0');
        px(5, 1, 2, 2, '#bebebe');
      } else if (variant % 3 === 1) {
        px(0, 0, 6, 6, '#bebebe');
        px(1, 2, 1, 1, ink);
        px(4, 2, 1, 1, ink);
      } else {
        px(0, 0, 6, 6, '#bebebe');
        px(2, -1, 1, 1, '#f0f0f0');
        px(1, 2, 4, 2, ink);
      }
    },
  },
  sound: {
    timbre: { wave: 'pulse25', filterHz: 1300, q: 2.2, gainScale: 0.8, reverbWet: 0 },
    ambienceLevel: 0.0001,
    drones: [],
    critterExit: { freq: 520, crush: false },
    cross: (snd, t) => {
      snd.voice({ freq: 380, toFreq: 48, at: t, dur: 0.14, wave: 'square', filterHz: 1400, toFilterHz: 240, gain: 0.34, reverb: 0 });
      snd.noiseBurst({ at: t + 0.12, dur: 0.025, type: 'highpass', filterHz: 2600, gain: 0.28, reverb: 0 });
    },
  },
};
