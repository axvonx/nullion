/** Layer `ring-1`: The hypervisor, running whole operating systems as guests. */
import { hash, px as artPx, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef, type Pen } from '../render/v4/kit';
import { firmware } from './firmware';
import { R, TAU, disc, fill, frame, line, mod, rect, ring } from './shared/draw-kit';
import { G0, G1, G2, G3 } from './shared/lower-props';
import { text, variants } from '../text';
import type { LayerArt } from './types';

// Ring −1 (green phosphor): the hypervisor's house of mirrors. Twins, nests, clones and gates.
function miniWorld(p: Pen, x: number, y: number, w: number, h: number, flip: boolean) {
  p.r(x, y, w, h, G0);
  for (let k = 0; k + 1 < w; k += 2) {
    const kk = flip ? w - 2 - k : k;
    const th = 1 + R((h - 3) * p.h(kk));
    p.r(x + k, y + h - th, 1, th, G1);
  }
  p.r(flip ? x + w - 5 : x + 1, y + 1, 4, 2, G2);
}

const PROPS: EntityDef[] = [
  ent('r1-bubble', [[15, 15]], (p) => {
    p.ring(7, 7, 7, G2);
    p.disc(7, 7, 6, G0);
    for (let x = 2; x < 13; x += 2) {
      const th = 1 + R(p.h(x) * 4);
      p.r(x, 11 - th, 1, th, G1);
    }
    p.r(2, 11, 11, 1, G1);
    p.r(4, 3, 2, 1, G3);
  }),
  ent('r1-vmcs', [[18, 13]], (p) => {
    // Twin hypervisor masks (Host bright left, Guest mirrored right) — unmistakable silhouette.
    p.disc(5, 6, 5, G2);
    p.r(3, 4, 2, 2, G0);
    p.r(6, 4, 2, 2, G0);
    p.r(3, 8, 5, 1, G0);
    p.disc(12, 6, 5, G1);
    p.ring(12, 6, 5, G3);
    p.r(10, 4, 2, 2, G3);
    p.r(13, 4, 2, 2, G3);
    p.r(10, 8, 5, 1, G3);
  }),
  ent(
    'r1-trapdoor',
    [[15, 10]],
    (p) => {
      p.r(0, 6, 15, 4, G1);
      p.r(0, 6, 15, 1, G2);
      p.r(3, 7, 9, 3, G0);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const q = mod(t * 0.5, 1);
        const open = q < 0.2 ? q / 0.2 : q < 0.6 ? 1 : Math.max(0, 1 - (q - 0.6) / 0.2);
        const y = 7 - R(open * 6);
        p.l(3, 7, 11, y, G3);
        p.l(3, 8, 11, y + 1, G2);
      },
      noFlip: true,
    },
  ),
  ent(
    'r1-shadowpage',
    [[17, 11]],
    (p) => {
      // Unmistakable Hypervisor Eye / Surveillance Lens silhouette.
      p.l(0, 5, 5, 1, G3);
      p.l(5, 1, 11, 1, G3);
      p.l(11, 1, 16, 5, G3);
      p.l(0, 5, 5, 9, G2);
      p.l(5, 9, 11, 9, G2);
      p.l(11, 9, 16, 5, G2);
      p.disc(8, 5, 3, G1);
      p.ring(8, 5, 3, G2);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const dx = R(Math.sin(t * 1.1) * 2);
        p.r(7 + dx, 4, 2, 2, G3);
      },
      noFlip: true,
    },
  ),
  ent('r1-dolls', [[19, 14]], (p) => {
    // Three nested arched Matryoshka / hypervisor portal domes.
    p.r(0, 13, 19, 1, G3);
    for (const [rad, col] of [[9, G2], [6, G1], [3, G3]] as const) {
      for (let dy = -rad; dy <= 0; dy++) {
        const half = Math.floor(Math.sqrt(rad * rad - dy * dy));
        p.p(9 - half, 12 + dy, col);
        p.p(9 + half, 12 + dy, col);
      }
    }
    p.r(8, 10, 3, 3, G3);
  }),
  ent(
    'r1-mempress',
    [[13, 14]],
    (p) => {
      // Expanding Host/Guest memory bellows (replaces literal party balloon).
      p.r(1, 0, 11, 2, G2);
      p.r(1, 12, 11, 2, G2);
      p.r(5, 11, 3, 1, G1);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const squeeze = R((Math.sin(t * 1.4) * 0.5 + 0.5) * 3);
        const top = 2 + squeeze;
        const bot = 11 - squeeze;
        p.r(2, top, 9, Math.max(2, bot - top), G1);
        p.r(3, top + 1, 7, Math.max(1, bot - top - 2), G0);
        p.r(4, Math.floor((top + bot - 1) / 2), 5, 1, G3);
        p.r(1, top, 11, 1, G3);
      },
      noFlip: true,
    },
  ),
  ent(
    'r1-migrate',
    [[26, 20]],
    (p) => {
      // A server canister winched along an overhead rail between two floor docking pedestals.
      p.r(1, 1, 24, 2, G2);
      p.r(1, 1, 24, 1, G3);
      p.r(10, 0, 6, 4, G2);
      p.r(12, 4, 2, 3, G1);
      p.r(8, 7, 10, 8, G2);
      p.r(8, 7, 10, 1, G3);
      miniWorld(p, 10, 9, 6, 4, false);
      for (const x of [1, 19]) {
        p.r(x, 12, 6, 7, G1);
        p.r(x, 12, 6, 1, G2);
      }
      p.r(0, 19, 26, 1, G2);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (Math.floor(t * 2) % 2 === 0) p.p(16, 14, G3);
      },
    },
  ),
  ent(
    'r1-snapshot',
    [[13, 11]],
    (p) => {
      p.r(0, 2, 13, 9, G1);
      p.r(1, 2, 11, 1, G2);
      p.r(2, 0, 4, 2, G1);
      p.disc(6, 6, 3, G2);
      p.disc(6, 6, 2, G0);
      p.p(5, 5, G3);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (mod(t * 0.4, 1) > 0.06) return;
        p.r(9, 3, 3, 2, G3);
        p.glow(10, 4, 8, 'rgba(255,255,255,0.5)');
      },
    },
  ),
  ent(
    'r1-hypercall',
    [[15, 13]],
    (p) => {
      // Ring-crossing interrupt gate: pulse punches from Guest (top) across the barrier into Host (bottom).
      p.r(0, 6, 15, 2, G2);
      p.r(5, 6, 5, 2, G0);
      p.frame(2, 0, 11, 5, G1);
      p.frame(2, 9, 11, 4, G1);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const q = mod(t * 1.1, 1);
        const y = 2 + R(q * 8);
        p.r(6, y, 3, 2, G3);
        if (y >= 5 && y <= 7) {
          p.p(4, 6, G3);
          p.p(10, 6, G3);
        }
      },
      noFlip: true,
    },
  ),
  ent(
    'r1-vswitch',
    [[19, 9]],
    (p) => {
      p.r(0, 3, 19, 6, G1);
      p.r(0, 3, 19, 1, G2);
      for (let k = 0; k < 5; k++) p.r(1 + k * 4, 5, 2, 2, G0);
      for (let k = 0; k < 5; k++) p.r(1 + k * 4, 0, 1, 3, G1);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (let k = 0; k < 5; k++) if ((Math.floor(t * 5) + k * 3) % 4 === 0) p.p(2 + k * 4, 5, G3);
      },
    },
  ),
  ent('r1-iommu', [[13, 15]], (p) => {
    p.r(0, 2, 3, 13, G1);
    p.r(10, 2, 3, 13, G1);
    p.r(0, 0, 13, 3, G2);
    p.r(3, 3, 7, 12, G0);
    for (let y = 4; y < 15; y += 3) p.r(4, y, 5, 1, G1);
    p.p(6, 1, G3);
  }),
  ent(
    'r1-paravirt',
    [[34, 22]],
    (p) => {
      // Two housings bolted to a wide bench, joined by an exposed conveyor belt.
      p.r(0, 16, 34, 4, G1);
      p.r(0, 16, 34, 1, G2);
      p.r(2, 20, 3, 1, G1);
      p.r(29, 20, 3, 1, G1);
      for (const x of [2, 23]) {
        p.r(x, 5, 9, 11, G1);
        p.r(x, 5, 9, 1, G2);
        p.r(x, 5, 1, 11, G2);
        p.r(x + 2, 8, 5, 3, G0);
        p.p(x + 3, 9, G3);
      }
      p.r(11, 11, 12, 3, G0);
      p.r(11, 10, 12, 1, G2);
      for (let x = 12; x < 22; x += 3) p.p(x, 12, G1);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const x = 12 + R(mod(t * 5, 8));
        p.r(x, 8, 5, 3, G3);
      },
      noFlip: true,
    },
  ),
  ent('r1-ept', [[18, 19]], (p) => {
    // Pedestal translator with a cutaway: two meshed toothed wheels.
    p.r(1, 2, 16, 12, G1);
    p.r(1, 2, 16, 1, G2);
    p.r(3, 4, 12, 8, G0);
    for (const cx of [6, 11]) {
      p.disc(cx, 8, 3, G2);
      p.disc(cx, 8, 1, G0);
      for (const [dx, dy] of [[0, -3], [0, 3], [-3, 0], [3, 0]] as const) p.p(cx + dx, 8 + dy, G3);
    }
    p.r(6, 14, 6, 3, G1);
    p.r(3, 17, 12, 1, G2);
  }),
  ent('r1-sr-iov', [[20, 22]], (p) => {
    // One heavy trunk rising from a floor flange into a manifold with four bright-tipped nozzles.
    p.r(5, 19, 10, 2, G2);
    p.r(8, 10, 4, 9, G1);
    p.r(8, 10, 1, 9, G2);
    p.r(1, 7, 18, 4, G1);
    p.r(1, 7, 18, 1, G2);
    for (const x of [2, 6, 11, 15]) {
      p.r(x, 3, 3, 4, G1);
      p.r(x, 2, 3, 1, G3);
    }
  }),
  ent(
    'r1-postedirq',
    [[20, 18]],
    (p) => {
      // Annunciator cabinet: three shuttered windows, the middle one dropped to show a bright flag.
      p.r(8, 0, 4, 1, G2);
      p.r(1, 1, 18, 14, G1);
      p.r(1, 1, 18, 1, G2);
      p.r(1, 1, 1, 14, G2);
      for (const x of [3, 8, 13]) {
        if (x === 8) {
          p.r(x, 4, 4, 6, G0);
          p.r(x, 4, 4, 3, G3);
          p.r(x, 7, 4, 3, G2);
        } else {
          p.r(x, 4, 4, 6, G2);
          p.p(x + 1, 6, G0);
        }
      }
      p.r(3, 12, 14, 2, G0);
      p.r(3, 15, 3, 2, G1);
      p.r(14, 15, 3, 2, G1);
    },
    { noFlip: true },
  ),
  ent('r1-vcpu', [[10, 13]], (p) => {
    // Processor cartridge with four ribbed heatsink fins, seated in a notched floor socket.
    p.r(2, 1, 7, 8, G1);
    for (const x of [2, 4, 6, 8]) p.r(x, 1, 1, 7, G3);
    p.r(0, 9, 10, 3, G2);
    p.r(0, 9, 10, 1, G3);
    p.r(4, 9, 2, 1, G0);
  }),
  ent(
    'r1-stealmeter',
    [[12, 16]],
    (p) => {
      // Floor post with a rounded meter head and a half-circle dial: the steal-time gauge.
      p.r(5, 9, 2, 5, G1);
      p.r(2, 14, 8, 1, G2);
      p.disc(6, 5, 5, G1);
      p.ring(6, 5, 5, G2);
      p.disc(6, 5, 4, G0);
      for (let k = 0; k < 5; k++) {
        const a = Math.PI + (k * Math.PI) / 4;
        p.p(6 + R(Math.cos(a) * 3), 5 + R(Math.sin(a) * 3), G2);
      }
      p.r(6, 6, 1, 1, G3);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const a = Math.PI * 1.25 + (Math.sin(t * 1.2) * 0.5 + 0.5) * Math.PI * 0.5;
        p.l(6, 6, 6 + Math.cos(a) * 3, 6 + Math.sin(a) * 3, G3);
      },
      noFlip: true,
    },
  ),
  ent('r1-msrdial', [[12, 14]], (p) => {
    // Squat pedestal under a round selector dial: the model-specific-register switch.
    p.r(3, 9, 6, 3, G1);
    p.r(3, 9, 6, 1, G2);
    p.r(1, 12, 10, 1, G2);
    p.disc(6, 5, 5, G1);
    p.ring(6, 5, 5, G2);
    for (let k = 0; k < 8; k++) {
      const a = (k * TAU) / 8;
      p.p(6 + R(Math.cos(a) * 4), 5 + R(Math.sin(a) * 4), G2);
    }
    p.disc(6, 5, 2, G2);
    p.l(6, 5, 6, 1, G3);
  }),
  ent('r1-eptfault', [[12, 15]], (p) => {
    // Post-mounted breaker box, its cover hinged open and a bright lever snapped to tripped.
    p.r(1, 1, 10, 8, G1);
    p.r(1, 1, 10, 1, G2);
    p.r(1, 1, 1, 8, G2);
    p.r(4, 3, 5, 4, G0);
    p.r(7, 3, 2, 3, G3);
    p.r(5, 9, 2, 4, G1);
    p.r(3, 13, 6, 1, G2);
  }),
  ent('r1-vmxon', [[12, 14]], (p) => {
    // Key switch on a pedestal: the hypervisor's VMXON lock, key turned.
    p.r(1, 1, 10, 9, G1);
    p.r(1, 1, 10, 1, G2);
    p.r(1, 1, 1, 9, G2);
    p.disc(6, 5, 3, G2);
    p.disc(6, 5, 1, G0);
    p.l(6, 5, 9, 2, G3);
    p.r(9, 1, 2, 2, G3);
    p.r(4, 10, 4, 2, G1);
    p.r(2, 12, 8, 1, G2);
  }),
];

const ANCHORS: EntityDef[] = [
  ent(
    'r1-mirrorgate',
    [[62, 42]],
    (p) => {
      // Two big guest screens facing each other across a seam, each the other's reflection.
      for (let side = 0; side < 2; side++) {
        const x = side * 33;
        p.r(x, 0, 29, 36, G1);
        p.r(x, 0, 29, 1, G3);
        miniWorld(p, x + 2, 2, 25, 30, side === 1);
        p.r(x + 12, 36, 5, 4, G1);
        p.r(x + 8, 40, 13, 2, G2);
      }
      for (let y = 0; y < 42; y += 2) p.p(31, y, G2);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const blink = Math.floor(t * 1.6) % 2 === 0;
        if (blink) {
          p.r(10, 18, 2, 4, G3);
          p.r(50, 18, 2, 4, G3);
        }
        const g = mod(t * 6, 36);
        p.r(2, 2 + g, 25, 1, G1);
        p.r(35, 2 + g, 25, 1, G1);
      },
      noFlip: true,
    },
  ),
  ent(
    'r1-portal',
    [[46, 38]],
    (p) => {
      // Heavy airlock gate: riveted stanchions, a beacon on the lintel, a hazard-edged threshold plate.
      p.r(0, 0, 46, 8, G2);
      p.r(0, 0, 46, 1, G3);
      p.r(19, 0, 8, 3, G3);
      for (const x of [0, 38]) {
        p.r(x, 8, 8, 30, G1);
        p.r(x, 8, 1, 30, G2);
        for (let y = 10; y < 34; y += 6) p.p(x + 4, y, G3);
      }
      p.r(8, 8, 30, 26, G0);
      p.frame(11, 11, 24, 20, G1);
      p.frame(15, 15, 16, 12, G1);
      p.r(4, 34, 38, 4, G2);
      p.r(4, 34, 38, 1, G3);
      for (let x = 6; x < 40; x += 4) p.r(x, 36, 2, 1, G0);
    },
    {
      anim: (p, _w, _h, _v, t) => {
        // A guest falling inward through the nest.
        const q = mod(t * 0.35, 1);
        const k = q * 4;
        const w = 30 - k * 7;
        const h = 26 - k * 5;
        p.frame(R((46 - w) / 2), R(8 + (26 - h) / 2), R(w), R(h), G3);
      },
      noFlip: true,
    },
  ),
];

export const ringMinus1: LayerArt = {
  family: 'ring-1',
  blurb: text('layers.ring-1.blurb'),
  palette: 'green',
  form: 'hyper',
  cursor: 'bit',
  stackTheme: {
    accent: '#28c76f',
    hi: '#98ffbe',
    tint: 'rgba(40, 199, 111, 0.13)',
    border: 'rgba(40, 199, 111, 0.36)',
    anim: 'pulse',
    icon: [
      '#### ####',
      '#  # #  #',
      '# +# #+ #',
      '#  # #  #',
      '#### ####',
      '  .   .  ',
      '#########',
      '# +   + #',
      '#########',
    ],
  },
  topicTags: ['hardware', 'security', 'os'],
  library: { own: PROPS, anchors: ANCHORS, density: 4.2, anchorCount: 2, far: 0.4 },
  fog: [0, 0, 0],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#000000');
    entities();
  },
  setpiece: {
    base: ({ ctx, t, W, cx, top, bot, cy, H }) => {
      // Full-bleed Infinite Hall of Mirrors + two large mirrored guest-OS silhouettes + bold hypervisor visor/lens at vanishing point!
      const shades = ['#aaaaaa', '#555555', '#aaaaaa', '#555555', '#aaaaaa', '#555555', '#ffffff'];
      const pulseIdx = Math.floor(t * 2.5) % 7;
      for (let k = 0; k < 7; k++) {
        const frac = 1 - k * 0.13;
        const fw = Math.max(24, R((W - 16) * frac));
        const fh = Math.max(20, R((H - 20) * frac));
        frame(ctx, cx - R(fw / 2), cy - R(fh / 2), fw, fh, k === pulseIdx ? '#ffffff' : shades[k]!);
      }
      line(ctx, 8, top + 10, cx - 14, cy - 10, '#555555');
      line(ctx, W - 8, top + 10, cx + 14, cy - 10, '#555555');
      line(ctx, 8, bot - 10, cx - 14, cy + 10, '#555555');
      line(ctx, W - 8, bot - 10, cx + 14, cy + 10, '#555555');
      // Two large mirrored Guest-OS window/city silhouettes facing each other across the central mirror axis
      const gw = Math.min(64, R(W * 0.19));
      const gh = Math.min(82, R(H * 0.44));
      for (const side of [-1, 1] as const) {
        const gx = side < 0 ? cx - 24 - gw : cx + 24;
        const gy = cy - R(gh / 2);
        rect(ctx, gx, gy, gw, gh, '#000000');
        frame(ctx, gx, gy, gw, gh, '#aaaaaa');
        rect(ctx, gx + 1, gy + 1, gw - 2, 7, '#555555');
        // Mirrored titlebar buttons & miniature guest skyline inside each pane
        for (let b0 = 0; b0 < 3; b0++) {
          const bx = side < 0 ? gx + 4 + b0 * 5 : gx + gw - 7 - b0 * 5;
          rect(ctx, bx, gy + 3, 3, 3, '#ffffff');
        }
        const cols = Math.max(4, Math.floor((gw - 8) / 8));
        for (let c0 = 0; c0 < cols; c0++) {
          const mc = side < 0 ? c0 : cols - 1 - c0;
          const bh = 14 + Math.floor(hash(mc * 17 + 9) * (gh - 28));
          const bx = gx + 4 + c0 * 8;
          rect(ctx, bx, gy + gh - 3 - bh, 6, bh, '#555555');
          rect(ctx, bx, gy + gh - 3 - bh, 6, 1, '#aaaaaa');
          if (hash(mc * 23) > 0.4) rect(ctx, bx + 2, gy + gh - bh + 2, 2, 2, '#ffffff');
        }
      }
      // Bold Hypervisor Visor / Eye Lens at the vanishing point
      disc(ctx, cx, cy, 14, '#000000');
      ring(ctx, cx, cy, 14, '#ffffff');
      ring(ctx, cx, cy, 11, '#aaaaaa');
      const irisX = cx + R(Math.sin(t * 0.9) * 3);
      disc(ctx, irisX, cy, 5, '#aaaaaa');
      disc(ctx, irisX, cy, 2, '#ffffff');
      // Center vertical mirror-axis seam
      for (let y = top + 10; y < bot - 10; y += 6) {
        if (Math.abs(y - cy) > 16) rect(ctx, cx, y, 1, 3, '#aaaaaa');
      }
    },
    detail: ({ ctx, t, W, cy, H }) => {
      // A reflection glint racing around the nested mirror frames.
      const q = mod(t * 0.5, 1) * 4;
      const fw = W - 24;
      const fh = H - 28;
      const side = Math.floor(q);
      const f = q - side;
      const gx = side === 0 ? 12 + f * fw : side === 1 ? 12 + fw : side === 2 ? 12 + fw - f * fw : 12;
      const gy = side === 0 ? cy - fh / 2 : side === 1 ? cy - fh / 2 + f * fh : side === 2 ? cy + fh / 2 : cy + fh / 2 - f * fh;
      rect(ctx, gx - 2, gy - 1, 5, 3, '#ffffff');
    },
  },
  // VM exit: a silvered plane.
  seam: (ctx, y, b) => {
    artPx(ctx, 0, y - 1, b.w, 1, '#aaaaaa');
    artPx(ctx, 0, y, b.w, 1, '#ffffff');
    artPx(ctx, 0, y + 1, b.w, 1, '#555555');
    for (let x = 0; x < b.w; x += 23) artPx(ctx, x, y + 3, 6, 1, '#555555');
  },
  ambient: firmware.ambient,
  critters: {
    motions: [MotionType.Mirror],
    count: 2,
    exitLabels: variants('layers.ring-1.exit'),
    draw: ({ px, mirror }) => {
      mirror();
      px(0, 1, 6, 4, '#1ea046');
      px(1, 0, 4, 6, '#8cff9c');
      px(2, 2, 2, 1, '#ffffff');
    },
  },
  sound: {
    timbre: { wave: 'pulse25', filterHz: 1500, q: 2.4, gainScale: 0.82, reverbWet: 0.32 },
    ambienceLevel: 0.06,
    drones: [{ freq: 82.4, wave: 'triangle', filterHz: 200, gain: 0.42 }, { freq: 83.9, wave: 'triangle', filterHz: 200, gain: 0.42 }],
    critterExit: { freq: 520, crush: false },
    critterCall: (snd, t, p) => {
      // Twin mirror-wisps: stereo-crossing detuned FM shimmer (left ↔ right)
      snd.fmVoice({ carrierHz: 440, modRatio: 2, modIndex: 110, at: t, dur: 0.16, gain: 0.18, pan: p, toPan: -p, swell: true });
      snd.fmVoice({ carrierHz: 447, modRatio: 2, modIndex: 110, at: t + 0.04, dur: 0.16, gain: 0.16, pan: -p, toPan: p, swell: true });
    },
    artifact: (snd, t) => {
      // Faint stereo-echoing dual-voice VM mirror ping
      snd.fmVoice({ carrierHz: 440, modRatio: 2, modIndex: 90, at: t, dur: 0.12, gain: 0.06, pan: -0.65, swell: true });
      snd.fmVoice({ carrierHz: 447, modRatio: 2, modIndex: 90, at: t + 0.09, dur: 0.12, gain: 0.05, pan: 0.65, swell: true });
    },
    cross: (snd, t) => {
      snd.fmVoice({ carrierHz: 440, modRatio: 2, modIndex: 140, at: t, dur: 0.32, gain: 0.24, pan: -0.6, toPan: 0.6, swell: true });
      snd.fmVoice({ carrierHz: 448, modRatio: 2, modIndex: 140, at: t + 0.03, dur: 0.32, gain: 0.24, pan: 0.6, toPan: -0.6, swell: true });
    },
  },
};
