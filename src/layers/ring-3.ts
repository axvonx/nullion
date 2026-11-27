/** Layer `ring-3`: The Intel Management Engine, a hidden computer inside your computer. */
import { glow, hash, offscreen, px as artPx, tiled, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef } from '../render/v4/kit';
import type { Rect } from '../render/v4/place';
import { R, TAU, fill, frame, line, mod, rect } from './shared/draw-kit';
import { text, variants } from '../text';
import type { LayerArt } from './types';

/** Ring −3's focal geometry, shared by its art and its keep-outs. */
const CORE_DY = 70;
const RAIL_START = 150;
const RAIL_STEP = 120;

const CELLS = () =>
  offscreen('v4-die-cells', 24, 6, (cx) => {
    cx.fillStyle = '#000000';
    cx.fillRect(0, 0, 24, 6);
    cx.fillStyle = '#ffffff';
    for (let x = 0; x < 24; x += 6) cx.fillRect(x, 0, 1, 6);
    for (let x = 0; x < 24; x++) if (hash(x + 1000) > 0.6) cx.fillRect(x, 2 + (x % 2) * 2, 1, 1);
  });

// Ring −3 (1-bit): the die. White line-work on black, few and readable.
const ON = '#ffffff';

const OFF = '#000000';

const PROPS: EntityDef[] = [
  ent('r3-vias', [[10, 10]], (p) => {
    for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) p.r(k * 4, r * 4, 2, 2, ON);
  }),
  ent('r3-pad', [[14, 22]], (p) => {
    // The hardware key standing upright in its silicon-substrate pedestal (the Master Key's last form).
    p.disc(6, 5, 5, ON);
    p.disc(6, 5, 2, OFF);
    p.r(5, 10, 3, 8, ON);
    p.r(8, 12, 3, 2, ON);
    p.r(8, 15, 2, 2, ON);
    p.r(0, 17, 14, 5, ON);
    p.r(2, 19, 10, 1, OFF);
    p.p(6, 18, OFF);
  }),
  ent(
    'r3-xtal',
    [[15, 9]],
    (p) => {
      p.r(2, 0, 11, 9, ON);
      p.r(0, 2, 15, 5, ON);
      p.r(3, 2, 9, 5, OFF);
      p.r(1, 3, 1, 3, OFF);
      p.r(13, 3, 1, 3, OFF);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        // The oscillator's tick: a square wave crawling across its can.
        const ph = Math.floor(t * 8);
        for (let x = 0; x < 7; x++) {
          const hi = (x + ph) % 4 < 2;
          p.p(4 + x, hi ? 3 : 5, ON);
          if ((x + ph) % 2 === 0) p.p(4 + x, 4, ON);
        }
      },
      noFlip: true,
    },
  ),
  ent('r3-sram', [[17, 19]], (p) => {
    // An upright SRAM cartridge: dark casing with a grid of cells, gold edge pins into a socketed base.
    p.r(1, 0, 15, 13, ON);
    p.r(2, 1, 13, 11, OFF);
    for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) p.r(4 + c * 4, 3 + r * 4, 2, 2, ON);
    for (let k = 0; k < 5; k++) p.r(4 + k * 2, 13, 1, 3, ON);
    p.r(1, 15, 15, 4, ON);
    p.r(3, 16, 11, 1, OFF);
  }),
  ent(
    'r3-ringosc',
    [[15, 16]],
    (p) => {
      // Bold 1-bit Hardware Padlock / Fuse-Lock silhouette (thick U-shackle + solid white lock body + bold black keyhole).
      p.r(4, 0, 7, 2, ON);
      p.r(3, 1, 2, 6, ON);
      p.r(10, 1, 2, 6, ON);
      p.r(1, 7, 13, 9, ON);
      p.disc(7, 10, 2, OFF);
      p.r(6, 11, 3, 3, OFF);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (Math.floor(t * 2) % 2 === 0) p.p(7, 10, ON);
      },
      noFlip: true,
    },
  ),
  ent('r3-thermal', [[8, 13]], (p) => {
    p.r(2, 1, 3, 8, ON);
    p.r(3, 2, 1, 6, OFF);
    p.disc(3, 10, 2, ON);
    p.r(3, 4, 1, 4, ON);
    p.r(5, 2, 2, 1, ON);
    p.r(5, 5, 2, 1, ON);
  }),
  ent('r3-guard', [[15, 17]], (p) => {
    // Crisp 1-bit Radio / RF Management-Engine Antenna Tower silhouette with broadcast arcs.
    p.disc(7, 4, 1, ON);
    p.l(7, 5, 3, 16, ON);
    p.l(7, 5, 11, 16, ON);
    p.r(5, 10, 5, 1, ON);
    p.r(4, 13, 7, 1, ON);
    p.r(2, 16, 11, 1, ON);
    // Broadcast arcs left & right of beacon
    p.r(3, 2, 1, 5, ON);
    p.r(11, 2, 1, 5, ON);
    p.r(1, 1, 1, 7, ON);
    p.r(13, 1, 1, 7, ON);
  }),
  ent('r3-probe', [[8, 15]], (p) => {
    p.r(1, 1, 6, 5, ON);
    p.r(2, 2, 4, 3, OFF);
    p.r(3, 6, 2, 6, ON);
    p.p(3, 12, ON);
    p.r(1, 13, 6, 1, ON);
  }),
  ent('r3-align', [[9, 9]], (p) => {
    p.r(4, 0, 1, 9, ON);
    p.r(0, 4, 9, 1, ON);
    p.frame(2, 2, 5, 5, ON);
    p.p(4, 4, OFF);
  }),
  ent('r3-bootrom', [[12, 14]], (p) => {
    // Sealed ceramic DIP, windowless lid, legs seated in a socket.
    p.r(2, 1, 8, 8, ON);
    p.r(5, 1, 2, 1, OFF);
    p.p(3, 2, OFF);
    for (let k = 0; k < 4; k++) p.r(3 + k * 2, 9, 1, 2, ON);
    p.r(1, 11, 10, 2, ON);
    p.r(2, 12, 8, 1, OFF);
  }),
  ent('r3-pulser', [[13, 12]], (p) => {
    // Pulse generator on four feet: a lit pip beside the BNC output post.
    p.r(1, 2, 9, 7, ON);
    p.r(2, 3, 3, 3, OFF);
    p.p(3, 4, ON);
    p.r(6, 3, 3, 3, OFF);
    p.p(7, 4, ON);
    p.r(10, 4, 3, 3, ON);
    p.p(11, 5, OFF);
    p.r(2, 9, 2, 2, ON);
    p.r(7, 9, 2, 2, ON);
  }),
  ent('r3-strap', [[10, 12]], (p) => {
    // Three-pin strap header on a dark base, a shunt cap bridging two pins.
    for (const x of [2, 4, 6]) p.r(x, 3, 1, 5, ON);
    p.r(1, 1, 5, 4, ON);
    p.r(2, 2, 3, 1, OFF);
    p.r(0, 7, 9, 4, ON);
    for (const x of [2, 4, 6]) p.p(x, 9, OFF);
  }),
  ent(
    'r3-pll',
    [[18, 15]],
    (p) => {
      // Benchtop unit on rubber feet: a round sight-glass with a rotor, a coax jack on each side.
      p.r(2, 2, 14, 10, ON);
      p.disc(9, 7, 4, OFF);
      p.ring(9, 7, 4, ON);
      p.r(0, 5, 2, 3, ON);
      p.r(16, 5, 2, 3, ON);
      p.p(0, 6, OFF);
      p.p(17, 6, OFF);
      p.r(3, 12, 3, 2, ON);
      p.r(12, 12, 3, 2, ON);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const a = t * 5;
        p.l(9, 7, 9 + Math.cos(a) * 2.6, 7 + Math.sin(a) * 2.6, ON);
      },
      noFlip: true,
    },
  ),
  ent('r3-mailbox', [[18, 22]], (p) => {
    // Armoured pneumatic-tube dispatch chute on a heavy pedestal: hinged slot, lit status pip.
    p.r(8, 0, 2, 3, ON);
    p.r(3, 2, 12, 11, ON);
    p.r(5, 5, 8, 5, OFF);
    p.r(5, 5, 8, 2, ON);
    p.p(4, 3, OFF);
    p.p(13, 3, OFF);
    p.r(7, 11, 4, 1, OFF);
    p.p(14, 11, OFF);
    p.r(5, 13, 8, 6, ON);
    p.r(2, 19, 14, 2, ON);
  }),
  ent(
    'r3-amt-nic',
    [[28, 24]],
    (p) => {
      // Rack sidecar transceiver on a heavy base: recessed RJ-45 jack, stub antenna, link bar.
      p.r(24, 0, 2, 5, ON);
      p.r(23, 0, 4, 1, ON);
      p.r(1, 4, 26, 14, ON);
      p.r(4, 8, 9, 7, OFF);
      p.r(5, 9, 7, 4, ON);
      for (let k = 0; k < 4; k++) p.p(6 + k * 2, 12, OFF);
      p.r(15, 8, 9, 3, OFF);
      p.r(0, 18, 28, 5, ON);
      p.r(2, 20, 24, 1, OFF);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const n = 1 + (Math.floor(t * 6) % 6);
        p.r(16, 9, n, 1, ON);
      },
      noFlip: true,
    },
  ),
  ent('r3-microswitch', [[12, 12]], (p) => {
    // Tamper microswitch: a roller lever on a small body, wired for the lid.
    p.r(1, 5, 10, 6, ON);
    p.r(3, 7, 2, 2, OFF);
    p.p(8, 7, OFF);
    p.l(2, 5, 9, 1, ON);
    p.disc(9, 2, 1, ON);
    p.r(2, 11, 2, 1, ON);
    p.r(8, 11, 2, 1, ON);
  }),
  ent('r3-bga', [[16, 14]], (p) => {
    // A ball-grid package from the side: a flat body over a row of solder balls on the board.
    p.r(1, 2, 14, 5, ON);
    p.r(3, 3, 10, 3, OFF);
    p.p(2, 3, OFF);
    p.r(0, 7, 16, 1, ON);
    for (let k = 0; k < 6; k++) p.r(1 + k * 2 + (k >> 1), 8, 2, 2, ON);
    p.r(0, 10, 16, 2, ON);
    p.r(1, 11, 14, 1, OFF);
  }),
    ent('r3-bondwire', [[16, 10]], (p) => {
      p.r(0, 7, 3, 3, '#ffffff');
      p.r(13, 7, 3, 3, '#ffffff');
      for (let k = 0; k <= 12; k++) {
        const q = k / 12;
        p.p(1 + q * 13, 7 - R(Math.sin(q * Math.PI) * 6), '#ffffff');
      }
    }),
    ent('r3-capbank', [[14, 9]], (p) => {
      for (let k = 0; k < 3; k++) {
        p.r(1 + k * 4, 1, 1, 7, '#ffffff');
        p.r(3 + k * 4, 1, 1, 7, '#ffffff');
      }
      p.r(0, 4, 14, 1, '#ffffff');
    }),
    ent('r3-fusebank', [[14, 8]], (p) => {
      p.frame(0, 0, 14, 8, '#ffffff');
      for (let x = 3; x < 12; x += 3) p.r(x, 2, 1, 4, '#ffffff');
    }),
];

const ANCHORS: EntityDef[] = [
  ent(
    'r3-me',
    [[44, 34]],
    (p) => {
      // Unmistakable 1-bit QFP Management Engine chip with protruding perimeter leads, corner pin-1 bevel, silicon die core, and heartbeat.
      for (let x = 7; x <= 35; x += 4) {
        p.r(x, 0, 2, 4, ON);
        p.r(x, 30, 2, 4, ON);
      }
      for (let y = 7; y <= 25; y += 4) {
        p.r(0, y, 4, 2, ON);
        p.r(40, y, 4, 2, ON);
      }
      p.r(4, 4, 36, 26, ON);
      p.r(6, 6, 32, 22, OFF);
      // Pin-1 corner orientation dot
      p.disc(9, 9, 1, ON);
      // Central die-cavity square + diagonal bond wires
      p.frame(14, 10, 16, 14, ON);
      p.l(8, 12, 14, 13, ON);
      p.l(8, 22, 14, 21, ON);
      p.l(35, 12, 30, 13, ON);
      p.l(35, 22, 30, 21, ON);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const beat = Math.max(0, Math.sin(t * 3.2)) ** 6;
        p.r(19, 14, 6, 6, beat > 0.3 ? ON : OFF);
        p.frame(18, 13, 8, 8, ON);
      },
      noFlip: true,
    },
  ),
];

export const ringMinus3: LayerArt = {
  family: 'ring-3',
  wiki: 'https://en.wikipedia.org/wiki/Intel_Management_Engine',
  blurb: text('layers.ring-3.blurb'),
  palette: 'onebit',
  form: 'raw',
  cursor: 'bit',
  stackTheme: {
    accent: '#e8eeff',
    hi: '#ffffff',
    tint: 'rgba(232, 238, 255, 0.12)',
    border: 'rgba(232, 238, 255, 0.42)',
    anim: 'beat',
    icon: [
      '    #    ',
      '  #####  ',
      ' #     # ',
      ' # +++ # ',
      '## + + ##',
      ' # +++ # ',
      ' #     # ',
      '  #####  ',
      '    #    ',
    ],
  },
  topicTags: ['hardware', 'security', 'os'],
  library: { own: PROPS, anchors: ANCHORS, density: 2.2, anchorCount: 1, far: 0 },
  open: 'bottom',
  keepOut: (top, bottom, W) => {
    // bandTop is 12 above the layer's first row; the core sits CORE_DY below bandTop.
    const cx = R(W / 2);
    const cy = top + CORE_DY;
    const out: Rect[] = [
      { x: 0, y: top, w: W, h: 30 },
      { x: cx - 26, y: cy - 26, w: 52, h: 52 },
      { x: 0, y: cy - 8, w: W, h: 17 },
    ];
    for (let y = top + RAIL_START; y < bottom; y += RAIL_STEP) out.push({ x: 0, y: y - 2, w: W, h: 16 });
    return out;
  },
  fog: [0, 0, 0],
  /**
  * Ring −3: the calm at the bottom. The seal ring at the die edge, the always-on core as the focal point with its
  * heartbeat running out along its traces, sparse power rails, and the die's small parts between them.
  */
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000000');

    // Power rails with standard cells only in the strip below each.
    for (let k = 0; ; k++) {
      const y = R(b.top + RAIL_START + k * RAIL_STEP);
      if (y > y1) break;
      if (y + 14 < y0) continue;
      fill(ctx, 0, y, b.w, 1, '#ffffff');
      fill(ctx, 0, y + 3, b.w, 1, '#ffffff');
      for (let x = mod(k * 7, 10); x < b.w; x += 10) fill(ctx, x, y + 1, 2, 2, '#ffffff');
      tiled(ctx, CELLS(), 0, y + 6, b.w, 6, R(k * 9), y + 6);
    }

    entities();

    // Seal ring and bond pads at the die edge.
    const ey = R(b.top + 4);
    fill(ctx, 0, ey, b.w, 1, '#ffffff');
    fill(ctx, 0, ey + 2, b.w, 1, '#ffffff');
    for (let x = 6; x < b.w; x += 18) {
      fill(ctx, x, ey + 6, 8, 8, '#ffffff');
      fill(ctx, x + 2, ey + 8, 4, 4, '#000000');
      fill(ctx, x + 3, ey + 14, 2, 8, '#ffffff');
    }

    // The always-on core.
    const cx = R(b.w / 2);
    const cy = R(b.top + CORE_DY);
    const beat = b.reduced ? 0.4 : Math.max(0, Math.sin(b.t * 3.2)) ** 6;
    for (const off of [-5, 0, 5]) {
      fill(ctx, cx + 20, cy + off, b.w, 1, '#ffffff');
      fill(ctx, 0, cy + off, cx - 20, 1, '#ffffff');
      fill(ctx, cx + off - 1, cy + 20, 3, b.h, '#000000');
      fill(ctx, cx + off, cy + 20, 1, b.h, '#ffffff');
    }
    if (!b.reduced) {
      const d = R((((b.t * 3.2) / TAU) % 1) * 160);
      for (const off of [-5, 0, 5]) {
        fill(ctx, cx + 20 + d, cy + off - 1, 4, 3, '#ffffff');
        fill(ctx, cx - 24 - d, cy + off - 1, 4, 3, '#ffffff');
        fill(ctx, cx + off - 1, cy + 20 + d, 3, 4, '#ffffff');
      }
    }
    fill(ctx, cx - 20, cy - 20, 41, 41, '#000000');
    glow(ctx, cx, cy, 22 + beat * 10, `rgba(255,255,255,${0.3 + beat * 0.4})`);
    for (let k = -15; k <= 15; k += 5) {
      fill(ctx, cx + k, cy - 16, 2, 2, '#ffffff');
      fill(ctx, cx + k, cy + 15, 2, 2, '#ffffff');
      fill(ctx, cx - 16, cy + k, 2, 2, '#ffffff');
      fill(ctx, cx + 15, cy + k, 2, 2, '#ffffff');
    }
    fill(ctx, cx - 11, cy - 11, 23, 23, '#000000');
    fill(ctx, cx - 10, cy - 10, 21, 21, '#ffffff');
    fill(ctx, cx - 9, cy - 9, 19, 19, '#000000');
    for (let k = 0; k < 3; k++) for (let j = 0; j < 3; j++) if (hash(k * 3 + j + 77) > 0.3) fill(ctx, cx - 6 + k * 5, cy - 6 + j * 5, 3, 3, '#ffffff');
    fill(ctx, cx - 2, cy - 2, 5, 5, beat > 0.3 ? '#ffffff' : '#000000');
  },
  setpiece: {
    base: ({ ctx, b, W, cx, top, bot, H }) => {
      // Full-bleed 1-Bit Microscope Silicon-Die Floorplan behind the always-on core: angled bond-wire fanouts, macro SRAM/ROM arrays, & bold 1-bit bus trunks!
      const coreY = R(b.top + 132);
      // Giant perimeter leadframe fingers along left & right die edges + angled bond wires fanning toward the die interior
      const leadCount = 7;
      for (let k = 0; k < leadCount; k++) {
        const ly = top + 28 + k * Math.floor((H - 52) / leadCount);
        const padY = coreY - 60 + k * 20;
        // Left leadframe finger + angled bond wire
        rect(ctx, 0, ly - 2, 16, 5, '#ffffff');
        rect(ctx, 2, ly - 1, 10, 3, '#000000');
        line(ctx, 16, ly, 42, padY, '#ffffff');
        rect(ctx, 40, padY - 2, 5, 5, '#ffffff');
        rect(ctx, 41, padY - 1, 3, 3, '#000000');
        // Right leadframe finger + angled bond wire
        rect(ctx, W - 16, ly - 2, 16, 5, '#ffffff');
        rect(ctx, W - 12, ly - 1, 10, 3, '#000000');
        line(ctx, W - 16, ly, W - 42, padY, '#ffffff');
        rect(ctx, W - 45, padY - 2, 5, 5, '#ffffff');
        rect(ctx, W - 44, padY - 1, 3, 3, '#000000');
      }
      // Massive flanking Macro SRAM & Mask-ROM array blocks left & right of the always-on core
      const mW = Math.min(68, Math.max(36, R(W * 0.17)));
      const mH = 74;
      for (const mx of [50, W - 50 - mW]) {
        const my = coreY - R(mH / 2);
        frame(ctx, mx, my, mW, mH, '#ffffff');
        frame(ctx, mx + 2, my + 2, mW - 4, mH - 4, '#ffffff');
        // Crisp 1-bit memory subarray banks inside each macro block
        for (let row = 0; row < 4; row++) {
          const ry = my + 8 + row * 16;
          rect(ctx, mx + 6, ry, mW - 12, 10, '#ffffff');
          rect(ctx, mx + 8, ry + 2, mW - 16, 6, '#000000');
          for (let sx = mx + 12; sx < mx + mW - 12; sx += 8) {
            rect(ctx, sx, ry + 2, 2, 6, '#ffffff');
          }
        }
      }
      // Bold 1-bit vertical die-bus trunks framing the central core corridor
      for (const bx of [cx - 46, cx + 44]) {
        rect(ctx, bx, top + 22, 2, H - 36, '#ffffff');
        for (let y = top + 34; y < bot - 20; y += 22) {
          rect(ctx, bx - 2, y, 6, 2, '#ffffff');
        }
      }
    },
  },
  // ME: the die's edge, crossing into silicon.
  seam: (ctx, y, b) => {
    artPx(ctx, 0, y - 2, b.w, 1, '#ffffff');
    artPx(ctx, 0, y, b.w, 2, '#ffffff');
  },
  ambient: ({ ctx, W, H, t, col, i, s1, s2 }) => {
    if (Math.floor(t * 3 + i * 1.7) % 3 !== 0) return;
    const x = Math.round(s1 * W);
    const y = Math.round(s2 * H);
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = col('#e8eeff');
    ctx.fillRect(x, y, 1, 1);
  },
  critters: {
    motions: [MotionType.Grid],
    count: 4,
    exitLabels: variants('layers.ring-3.exit'),
    draw: ({ px, ink, t, phase }) => {
      const bit = Math.floor(t * 3 + phase) % 2 === 0;
      px(0, 0, 6, 6, '#e8eeff');
      if (bit) {
        px(2, 1, 2, 4, ink);
      } else {
        px(1, 1, 4, 4, ink);
        px(2, 2, 2, 2, '#e8eeff');
      }
    },
  },
  sound: {
    timbre: { wave: 'square', filterHz: 6000, q: 0.7, gainScale: 0.88, reverbWet: 0, short: true },
    ambienceLevel: 0.05,
    drones: [{ freq: 55, wave: 'square', filterHz: 140, gain: 0.25 }],
    critterExit: { freq: 520, crush: true },
    critterCall: (snd, t, p) => {
      // Stark 1-bit piezo bit-mote snap
      snd.voice({ freq: Math.random() > 0.5 ? 1760 : 880, at: t, dur: 0.02, wave: 'square', gain: 0.19, pan: p, crush: true, reverb: 0 });
    },
    artifact: (snd, t, pan) => {
      // Stark 1-bit piezo micro-snap / bit-flip tick
      snd.voice({ freq: Math.random() > 0.5 ? 1760 : 880, at: t, dur: 0.018, wave: 'square', gain: 0.065, pan, crush: true, reverb: 0 });
    },
    cross: (snd, t) => {
      snd.noiseBurst({ at: t, dur: 0.02, type: 'highpass', filterHz: 4000, gain: 0.3, crush: true, reverb: 0 });
      snd.voice({ freq: 1760, at: t, dur: 0.045, wave: 'square', gain: 0.32, attack: 0.001, reverb: 0 });
      snd.voice({ freq: 880, at: t + 0.06, dur: 0.035, wave: 'square', gain: 0.26, attack: 0.001, reverb: 0 });
    },
  },
};
