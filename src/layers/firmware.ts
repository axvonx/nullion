/** Layer `firmware`: Code built into the hardware that starts the machine. */
import { SEAM_H, hash, tiled, vgrad, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef, type Pen } from '../render/v4/kit';
import { PLATE, R, TAU, disc, frame, line, mod, px, rect, ring } from './shared/draw-kit';
import { G0, G1, G2, G3 } from './shared/lower-props';
import { text, variants } from '../text';
import type { LayerArt } from './types';

/** A seven-segment digit, 3×5. */
function seg(p: Pen, x: number, y: number, d: number, col: string) {
  const SEGS = [0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07, 0x7f, 0x6f, 0x77, 0x7c, 0x39, 0x5e, 0x79, 0x71];
  const m = SEGS[d & 15]!;
  if (m & 1) p.r(x, y, 3, 1, col);
  if (m & 2) p.r(x + 2, y, 1, 3, col);
  if (m & 4) p.r(x + 2, y + 2, 1, 3, col);
  if (m & 8) p.r(x, y + 4, 3, 1, col);
  if (m & 16) p.r(x, y + 2, 1, 3, col);
  if (m & 32) p.r(x, y, 1, 3, col);
  if (m & 64) p.r(x, y + 2, 3, 1, col);
}

const PROPS: EntityDef[] = [
  ent('fw-drawers', [[22, 12]], (p) => {
    p.r(0, 0, 22, 12, G1);
    for (let r = 0; r < 2; r++)
      for (let k = 0; k < 3; k++) {
        p.r(1 + k * 7, 1 + r * 5, 6, 4, G0);
        p.r(3 + k * 7, 3 + r * 5, 2, 1, p.h(r * 3 + k) > 0.8 ? G3 : G2);
      }
  }),
  ent('fw-cmos', [[11, 11]], (p) => {
    p.disc(5, 5, 5, G2);
    p.disc(5, 5, 4, G1);
    p.r(3, 5, 5, 1, G3);
    p.r(5, 3, 1, 5, G3);
    p.r(0, 0, 2, 2, G2);
  }),
  ent('fw-dipsw', [[12, 8]], (p) => {
    p.r(1, 1, 10, 6, G2);
    for (let k = 0; k < 4; k++) {
      p.r(2 + k * 2, 2, 1, 4, G0);
      p.r(2 + k * 2, p.h(k) > 0.5 ? 2 : 4, 1, 2, G3);
    }
  }),
  ent(
    'fw-fan',
    [[13, 13]],
    (p) => {
      p.r(0, 0, 13, 13, G1);
      p.disc(6, 6, 5, G0);
      for (const [x, y] of [[1, 1], [11, 1], [1, 11], [11, 11]] as const) p.p(x, y, G2);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (let k = 0; k < 4; k++) {
          const a = t * 7 + (k * TAU) / 4;
          p.l(6, 6, 6 + Math.cos(a) * 4, 6 + Math.sin(a) * 4, G2);
        }
        p.p(6, 6, G3);
      },
    },
  ),
  ent('fw-capsule', [[15, 11]], (p) => {
    // Sealed firmware ROM cartridge with signature lock emblem and edge-connector teeth.
    p.r(0, 0, 15, 9, G2);
    p.r(1, 1, 13, 7, G1);
    p.r(2, 2, 11, 5, G0);
    // Lock/signature badge inside cartridge
    p.r(6, 2, 3, 2, G2);
    p.r(5, 4, 5, 3, G3);
    p.p(7, 5, G0);
    // Bottom edge-connector teeth
    for (let x = 2; x < 13; x += 2) p.r(x, 9, 1, 2, G2);
  }),
  ent('fw-spiclip', [[15, 13]], (p) => {
    for (let k = 1; k < 9; k += 2) {
      p.p(3 + k, 5, G2);
      p.p(3 + k, 12, G2);
    }
    p.r(3, 6, 10, 6, G1);
    p.r(2, 2, 12, 5, G2);
    p.r(2, 2, 12, 1, G3);
    p.r(6, 0, 1, 2, G3);
    p.r(9, 0, 1, 2, G2);
  }),
  ent('fw-optrom', [[19, 11]], (p) => {
    p.r(0, 0, 19, 8, G1);
    p.r(1, 1, 17, 6, G0);
    p.r(2, 2, 6, 4, G2);
    p.r(10, 2, 3, 2, G1);
    p.r(14, 2, 3, 3, G1);
    for (let x = 1; x < 18; x += 2) p.p(x, 9, G2);
    p.r(0, 8, 19, 1, G2);
  }),
  ent(
    'fw-beeper',
    [[18, 13]],
    (p) => {
      // Round piezo speaker bolted to an L-shaped bracket with a flat floor foot.
      p.r(0, 2, 2, 10, G1);
      p.r(0, 2, 1, 10, G2);
      p.r(0, 11, 12, 1, G2);
      p.r(2, 5, 2, 3, G1);
      p.disc(7, 5, 4, G1);
      p.ring(7, 5, 4, G2);
      p.disc(7, 5, 2, G0);
      p.p(6, 4, G3);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const on = mod(t * 0.8, 1) < 0.35;
        if (!on) return;
        for (let j = 0; j < 3; j++) p.r(12 + j * 2, 4 - j, 1, 3 + j * 2, j === 0 ? G3 : G2);
      },
      noFlip: true,
    },
  ),
  ent('fw-reset', [[11, 11]], (p) => {
    p.r(0, 0, 11, 11, G1);
    p.disc(5, 5, 3, G2);
    p.disc(5, 4, 3, G3);
    p.r(4, 3, 3, 2, G2);
  }),
  ent(
    'fw-postcard',
    [[17, 12]],
    (p) => {
      p.r(0, 0, 17, 9, G1);
      p.r(1, 1, 11, 7, G0);
      for (let x = 1; x < 16; x += 2) p.p(x, 10, G2);
      p.r(0, 9, 17, 1, G2);
      p.r(13, 2, 2, 2, G2);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const code = (Math.floor(t * 1.5) * 29 + Math.floor(p.h(1) * 200)) & 0xff;
        seg(p, 2, 2, code >> 4, G3);
        seg(p, 7, 2, code & 15, G3);
      },
      noFlip: true,
    },
  ),
  ent(
    'fw-ucode',
    [[17, 13]],
    (p) => {
      // Ceramic DIP EPROM chip with protruding legs and circular quartz UV-erase window.
      for (let x = 2; x <= 14; x += 3) {
        p.r(x, 0, 2, 2, G2);
        p.r(x, 11, 2, 2, G2);
      }
      p.r(0, 2, 17, 9, G1);
      p.r(0, 2, 17, 1, G2);
      p.r(0, 5, 2, 3, G0); // pin-1 notch
      p.disc(9, 6, 3, G2);
      p.disc(9, 6, 2, G0);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const on = Math.floor(t * 2.5) % 2 === 0;
        p.r(8, 5, 2, 2, on ? G3 : G1);
      },
      noFlip: true,
    },
  ),
  ent('fw-floppy', [[11, 11]], (p) => {
    p.r(0, 0, 11, 11, G1);
    p.r(3, 0, 5, 4, G2);
    p.r(6, 1, 1, 2, G0);
    p.r(2, 6, 7, 5, G3);
    p.r(3, 7, 5, 1, G1);
    p.p(0, 10, G0);
  }),
  ent(
    'fw-bootdial',
    [[18, 18]],
    (p) => {
      // Wall-mounted rotary selector on a square backplate: four detents, pointer set to the top-left one.
      p.r(1, 1, 16, 16, G1);
      p.r(1, 1, 16, 1, G2);
      p.r(1, 1, 1, 16, G2);
      for (const [x, y] of [[2, 2], [15, 2], [2, 15], [15, 15]] as const) p.p(x, y, G3);
      p.disc(9, 9, 6, G0);
      p.ring(9, 9, 6, G2);
      for (const [x, y, lit] of [[4, 4, true], [13, 4, false], [13, 13, false], [4, 13, false]] as const) p.r(x, y, 2, 2, lit ? G3 : G2);
      p.disc(9, 9, 3, G2);
      p.l(9, 9, 5, 5, G3);
      p.p(9, 9, G0);
    },
    { noFlip: true },
  ),
  ent('fw-dualbios', [[12, 12]], (p) => {
    // Bracket-mounted toggle: the hinged safety guard flipped up, a bat-handle lever tilted left.
    p.r(1, 7, 10, 4, G1);
    p.r(1, 7, 10, 1, G2);
    p.r(4, 5, 4, 3, G2);
    p.l(6, 5, 3, 1, G3);
    p.r(2, 0, 2, 2, G3);
    p.r(8, 1, 3, 5, G2);
    p.r(8, 6, 3, 1, G3);
    p.r(8, 1, 1, 5, G3);
  }),
  ent(
    'fw-acpirelay',
    [[16, 21]],
    (p) => {
      // Contactor relay: a visible coil, a pivoted armature bar bridging the top contacts, heavy lugs below.
      p.r(2, 6, 12, 12, G1);
      p.r(2, 6, 12, 1, G2);
      p.r(2, 6, 1, 12, G2);
      p.r(4, 8, 8, 7, G0);
      for (const y of [9, 11, 13]) p.r(5, y, 6, 1, G2);
      p.r(3, 5, 2, 1, G2);
      p.r(11, 5, 2, 1, G2);
      p.r(7, 3, 2, 3, G2);
      p.r(3, 18, 3, 2, G3);
      p.r(10, 18, 3, 2, G3);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const closed = Math.floor(t * 0.6) % 2 === 0;
        p.r(1, closed ? 4 : 2, 14, 2, G3);
        p.p(8, closed ? 4 : 2, G1);
      },
      noFlip: true,
    },
  ),
  ent(
    'fw-setupterm',
    [[26, 30]],
    (p) => {
      // Phosphor CRT terminal on a pedestal: a sloped keyboard lip under a recessed three-bar setup menu.
      p.r(2, 1, 22, 16, G1);
      p.r(2, 1, 22, 1, G2);
      p.r(2, 1, 1, 16, G2);
      p.r(4, 3, 18, 12, G0);
      p.r(6, 5, 10, 2, G3);
      p.r(6, 8, 14, 1, G2);
      p.r(6, 11, 8, 1, G2);
      p.r(1, 17, 24, 3, G2);
      p.r(1, 17, 24, 1, G3);
      for (let k = 0; k < 10; k++) p.p(3 + k * 2, 19, G0);
      p.r(6, 20, 14, 6, G1);
      p.r(6, 20, 1, 6, G2);
      p.r(3, 26, 20, 2, G2);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (Math.floor(t * 1.6) % 2 === 0) p.r(17, 5, 2, 2, G0);
      },
      noFlip: true,
    },
  ),
  ent('fw-pxeboot', [[12, 13]], (p) => {
    // Floor-standing RJ45 keystone jack: a latched Ethernet plug seated in it, link LED on the bezel.
    p.r(1, 3, 10, 7, G1);
    p.r(1, 3, 10, 1, G2);
    p.r(3, 5, 6, 5, G0);
    p.r(4, 6, 4, 4, G2);
    p.r(5, 5, 2, 1, G3);
    p.p(9, 4, G3);
    p.r(0, 10, 12, 2, G2);
  }),
    ent('fw-tpm', [[12, 12]], (p) => {
      p.box(1, 1, 10, 10, '#000000', '#aaaaaa');
      p.r(4, 3, 4, 2, '#ffffff');
      p.r(3, 5, 6, 4, '#555555');
      p.p(6, 7, '#000000');
    }),
    ent('fw-jtag', [[16, 8]], (p) => {
      p.box(0, 0, 16, 8, '#000000', '#555555');
      for (let k = 0; k < 5; k++) {
        p.p(3 + k * 2, 2, '#ffffff');
        p.p(3 + k * 2, 5, '#aaaaaa');
      }
    }),
    ent('fw-secureboot', [[14, 14]], (p) => {
      p.r(2, 0, 10, 9, '#aaaaaa');
      p.r(3, 1, 8, 7, '#000000');
      p.r(4, 9, 6, 3, '#aaaaaa');
      p.r(6, 12, 2, 2, '#ffffff');
      p.r(5, 4, 4, 2, '#ffffff');
    }),
];

const ANCHORS: EntityDef[] = [
  ent(
    'fw-bigvault',
    [[52, 52]],
    (p) => {
      p.r(0, 0, 52, 52, G1);
      p.frame(0, 0, 52, 52, G2);
      for (const [x, y] of [[3, 3], [48, 3], [3, 48], [48, 48]] as const) p.r(x, y, 1, 1, G3);
      p.disc(26, 26, 21, G2);
      p.disc(26, 26, 19, G1);
      p.disc(26, 26, 9, G2);
      p.disc(26, 26, 7, G0);
      for (let k = 0; k < 12; k++) {
        const a = (k * TAU) / 12;
        p.r(26 + R(Math.cos(a) * 15) - 1, 26 + R(Math.sin(a) * 15) - 1, 2, 2, G2);
      }
      p.r(44, 18, 6, 4, G2);
      p.r(44, 30, 6, 4, G2);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const a = t * 0.4;
        for (let k = 0; k < 3; k++) {
          const b = a + (k * TAU) / 3;
          p.l(26, 26, 26 + Math.cos(b) * 7, 26 + Math.sin(b) * 7, G3);
        }
        p.r(25, 25, 3, 3, G3);
        if (t > 0) {
          const q = mod(t * 0.35, 1);
          p.ring(26, 26, 22 + R(q * 6), q < 0.5 ? G3 : G2);
        }
      },
      noFlip: true,
    },
  ),
  ent(
    'fw-romcab',
    [[40, 56]],
    (p) => {
      p.r(0, 0, 40, 56, G1);
      p.r(0, 0, 40, 1, G2);
      p.r(2, 3, 36, 10, G0);
      for (let r = 0; r < 4; r++) {
        const y = 16 + r * 9;
        p.r(2, y, 36, 8, G0);
        for (let k = 1; k < 34; k += 3) {
          p.p(3 + k, y, G2);
          p.p(3 + k, y + 7, G2);
        }
        p.r(4, y + 1, 32, 6, G1);
        p.r(4, y + 1, 32, 1, G2);
      }
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const slot = Math.floor(t * 3);
        for (let k = 0; k < 8; k++) p.r(4 + k * 4, 6, 2, 3, (k * 5 + slot) % 4 === 0 ? G3 : (k + slot) % 3 ? G1 : G2);
      },
      noFlip: true,
    },
  ),
];

export const firmware: LayerArt = {
  family: 'firmware',
  wiki: 'https://en.wikipedia.org/wiki/Firmware',
  blurb: text('layers.firmware.blurb'),
  palette: 'green',
  form: 'bios',
  cursor: 'bioscell',
  stackTheme: {
    accent: '#4cd97b',
    hi: '#b8ffcf',
    tint: 'rgba(76, 217, 123, 0.13)',
    border: 'rgba(76, 217, 123, 0.38)',
    anim: 'blink',
    icon: [
      '#########',
      '#.......#',
      '#.#####.#',
      '#.# + #.#',
      '#.#+++#.#',
      '#.# + #.#',
      '#.#####.#',
      '#.......#',
      '#########',
    ],
  },
  topicTags: ['hardware', 'security', 'os'],
  library: { own: PROPS, anchors: ANCHORS, density: 4.4, anchorCount: 2, far: 0.4 },
  fog: [0, 0, 0],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    tiled(ctx, PLATE(), 0, y0, b.w, y1 - y0, 0, R(b.top * 0.5));
    entities();
    vgrad(ctx, b, b.bottom - 40, b.bottom + SEAM_H, [
      [0, 'rgba(255,255,255,0)'],
      [1, 'rgba(255,255,255,0.2)'],
    ]);
  },
  setpiece: {
    base: ({ ctx, t, W, cx, top, bot, cy }) => {
      // Full-bleed Riveted Steel BIOS Vault Wall + colossal 132px circular bank-vault door + heavy hinge block & keyway!
      for (let y = top + 20; y < bot - 10; y += 36) {
        rect(ctx, 0, y, W, 2, '#555555');
        for (let x = 10; x < W; x += 24) px(ctx, x, y + 4, '#aaaaaa');
      }
      const lockShift = R(Math.sin(t * 0.5) * 4);
      for (const dy of [-22, 22]) {
        rect(ctx, 0, cy + dy - 3, W, 6, '#555555');
        rect(ctx, 0, cy + dy - 1, W, 2, '#aaaaaa');
        rect(ctx, cx - 78 - lockShift, cy + dy - 5, 10, 10, '#aaaaaa');
        rect(ctx, cx + 68 + lockShift, cy + dy - 5, 10, 10, '#aaaaaa');
      }
      // Colossal 132px circular bank-vault blast door
      disc(ctx, cx, cy, 66, '#555555');
      ring(ctx, cx, cy, 66, '#aaaaaa');
      disc(ctx, cx, cy, 56, '#000000');
      ring(ctx, cx, cy, 56, '#555555');
      ring(ctx, cx, cy, 30, '#aaaaaa');
      for (let k = 0; k < 12; k++) {
        const a = (k * TAU) / 12;
        rect(ctx, cx + Math.cos(a) * 60 - 2, cy + Math.sin(a) * 60 - 2, 5, 5, '#aaaaaa');
      }
      // Chunky heavy vault hinge block on the right rim & armored keyway on the left rim
      rect(ctx, cx + 58, cy - 28, 16, 56, '#555555');
      frame(ctx, cx + 58, cy - 28, 16, 56, '#aaaaaa');
      rect(ctx, cx + 62, cy - 22, 8, 12, '#aaaaaa');
      rect(ctx, cx + 62, cy + 10, 8, 12, '#aaaaaa');
      rect(ctx, cx - 50, cy - 7, 12, 14, '#555555');
      frame(ctx, cx - 50, cy - 7, 12, 14, '#aaaaaa');
      disc(ctx, cx - 44, cy - 2, 2, '#000000');
      rect(ctx, cx - 45, cy, 3, 5, '#000000');
      // Slowly rotating 4-spoke combination wheel
      const wa = t * 0.25;
      for (let k = 0; k < 4; k++) {
        const a = wa + (k * TAU) / 4;
        line(ctx, cx, cy, cx + Math.cos(a) * 28, cy + Math.sin(a) * 28, '#ffffff');
      }
      disc(ctx, cx, cy, 6, '#ffffff');
    },
    detail: ({ ctx, t, W, top, bot, lamps }) => {
      // Dim hex-digit columns scrolling down the vault wall edges and a POST lamp strip.
      for (const sx of [14, W - 22]) {
        for (let y = top + 8; y < bot - 8; y += 8) {
          const on = hash(Math.floor(t * 2) + y * 3 + sx) > 0.5;
          rect(ctx, sx, y, 3, 5, on ? '#aaaaaa' : '#555555');
          rect(ctx, sx + 4, y + 1, 2, 3, on ? '#555555' : '#aaaaaa');
        }
      }
      lamps(top + 4, 12, '#ffffff', '#555555', 2);
    },
  },
  ambient: ({ ctx, W, H, t, col, i, s1, s2, s3 }) => {
    const x = Math.round(s1 * W + Math.sin(t * 0.8 + i) * 3);
    const y = Math.round(((s2 * H + t * (5 + s3 * 6)) % H));
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = col('#8cff9c');
    ctx.fillRect(x, y, 1, 1);
  },
  critters: {
    motions: [MotionType.Float],
    count: 3,
    exitLabels: variants('layers.firmware.exit'),
    draw: ({ px, t, phase }) => {
      const pulse = Math.floor(t * 2 + phase) % 2 === 0;
      px(1, 0, 5, 1, '#8cff9c');
      px(0, 1, 7, 4, '#1ea046');
      px(2, 2, 3, 2, pulse ? '#ffffff' : '#0a461e');
      px(1, 5, 5, 1, '#8cff9c');
    },
  },
  sound: {
    timbre: { wave: 'square', filterHz: 4200, q: 1.0, gainScale: 0.84, reverbWet: 0.1 },
    ambienceLevel: 0.06,
    drones: [{ freq: 60, wave: 'triangle', filterHz: 160, gain: 0.4 }],
    critterExit: { freq: 520, crush: false },
    critterCall: (snd, t, p) => {
      // Sentinel drone: distant miniature 1000 Hz POST ping + relay click
      snd.noiseBurst({ at: t, dur: 0.012, type: 'highpass', filterHz: 3200, gain: 0.16, pan: p, reverb: 0 });
      snd.voice({ freq: 1000, at: t + 0.012, dur: 0.045, wave: 'square', gain: 0.18, pan: p, reverb: 0.1 });
    },
    artifact: (snd, t, pan) => {
      // Distant miniature BIOS POST micro-beep or relay tick
      if (Math.random() > 0.4) {
        snd.voice({ freq: 1000, at: t, dur: 0.038, wave: 'square', gain: 0.06, pan, reverb: 0.1 });
      } else {
        snd.noiseBurst({ at: t, dur: 0.014, type: 'highpass', filterHz: 3200, gain: 0.07, pan, reverb: 0 });
      }
    },
    cross: (snd, t) => {
      snd.noiseBurst({ at: t, dur: 0.018, type: 'highpass', filterHz: 3000, gain: 0.22, reverb: 0 });
      snd.voice({ freq: 1000, at: t + 0.015, dur: 0.15, wave: 'square', gain: 0.34, attack: 0.002, reverb: 0.15 });
    },
  },
};
