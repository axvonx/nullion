/** Layer `slab-spa`: 1994 · Misty cedar bathhouse of kmalloc caches, freelist pools & OOM steam vents. */
import { SEAM_H, hash, vgrad, vis } from '../render/art-common';
import { MotionType } from '../render/motion';
import { ent, type EntityDef } from '../render/v4/kit';
import { libraries } from './libraries';
import { R, fill, frame, line, mod, px, rect } from './shared/draw-kit';
import type { LayerArt } from './types';

const PROPS: EntityDef[] = [
  ent(
    'spa-sauna',
    [[22, 22]],
    (p) => {
      // Cedar freelist sauna booth with slatted door & warm window
      p.r(0, 0, 22, 22, '#2d1c14');
      p.r(1, 1, 20, 3, '#c87e4b');
      p.r(1, 4, 20, 17, '#a86234');
      p.r(2, 4, 18, 1, '#e6a670');
      // Slatted door
      p.r(3, 6, 8, 14, '#7a4221');
      p.r(4, 7, 6, 4, '#ffd080');
      p.r(4, 12, 6, 8, '#8f502a');
      p.r(9, 13, 1, 2, '#f0d8a0');
      // Sign & slats
      p.r(13, 6, 7, 5, '#f0e8d8');
      p.t('SLAB', 13, 10, '#2d1c14');
      for (let y = 12; y < 19; y += 2) p.r(13, y, 7, 1, '#7a4221');
      p.r(1, 20, 20, 1, '#683619');
    },
    { text: true },
  ),
  ent('spa-towels', [[14, 16]], (p) => {
    // Grounded cedar rack holding rolled-up PAGE towels
    p.r(0, 0, 14, 16, '#2d1c14');
    p.r(1, 1, 12, 14, '#8f502a');
    p.r(2, 2, 10, 3, '#e8f4f2');
    p.r(2, 2, 10, 1, '#ffffff');
    p.r(2, 6, 10, 3, '#9ad9d4');
    p.r(2, 6, 10, 1, '#d4f5f0');
    p.r(2, 10, 10, 3, '#f0d8a0');
    p.r(1, 14, 2, 2, '#683619');
    p.r(11, 14, 2, 2, '#683619');
  }),
  ent(
    'spa-lantern',
    [[10, 18]],
    (p) => {
      // Grounded stone garden lantern
      p.r(2, 0, 6, 3, '#2d1c14');
      p.r(3, 1, 4, 1, '#a8b0b8');
      p.r(0, 3, 10, 3, '#2d1c14');
      p.r(1, 4, 8, 1, '#cfd6dc');
      p.r(2, 6, 6, 6, '#2d1c14');
      p.r(3, 7, 4, 4, '#ffd080');
      p.r(1, 12, 8, 6, '#2d1c14');
      p.r(3, 12, 4, 4, '#8f98a0');
      p.r(2, 15, 6, 2, '#727a82');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (Math.floor(t * 4) % 2 === 0) p.r(4, 8, 2, 2, '#fff6cc');
      },
    },
  ),
  ent('spa-bucket', [[12, 12]], (p) => {
    // Cedar bathhouse bucket & wooden ladle
    p.r(1, 3, 10, 9, '#2d1c14');
    p.r(2, 4, 8, 7, '#c87e4b');
    p.r(2, 4, 8, 1, '#e6a670');
    p.r(2, 6, 8, 1, '#7a4221');
    p.r(2, 9, 8, 1, '#7a4221');
    // Ladle handle
    p.r(7, 0, 2, 4, '#2d1c14');
    p.r(8, 1, 1, 3, '#e6a670');
  }),
  ent(
    'spa-rocks',
    [[18, 11]],
    (p) => {
      // Balanced buddy hot-stone stack
      p.r(2, 6, 14, 5, '#2d1c14');
      p.r(3, 7, 12, 3, '#727a82');
      p.r(4, 7, 8, 1, '#a8b0b8');
      p.r(4, 3, 10, 4, '#2d1c14');
      p.r(5, 4, 8, 2, '#8f98a0');
      p.r(6, 0, 6, 3, '#2d1c14');
      p.r(7, 1, 4, 1, '#cfd6dc');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const y = Math.floor(t * 3) % 3;
        p.glow(9, 2 - y, 3, 'rgba(232,248,246,0.45)');
      },
    },
  ),
  ent(
    'spa-fountain',
    [[16, 16]],
    (p) => {
      // Bamboo OOM overflow spout & stone basin
      p.r(0, 9, 16, 7, '#2d1c14');
      p.r(1, 10, 14, 5, '#727a82');
      p.r(2, 10, 12, 2, '#5cc8c0');
      p.r(9, 2, 5, 8, '#2d1c14');
      p.r(10, 3, 3, 6, '#629e54');
      p.r(4, 3, 7, 3, '#2d1c14');
      p.r(5, 4, 5, 1, '#84c472');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const drop = Math.floor(t * 6) % 4;
        p.r(4, 6 + drop, 1, 2, '#a8f0ea');
      },
    },
  ),
  ent('spa-robe', [[12, 18]], (p) => {
    // Grounded wooden stand with hanging spa robe
    p.r(4, 0, 4, 3, '#2d1c14');
    p.r(5, 1, 2, 16, '#8f502a');
    p.r(1, 3, 10, 11, '#2d1c14');
    p.r(2, 4, 8, 9, '#d4f5f0');
    p.r(2, 4, 8, 1, '#ffffff');
    p.r(2, 8, 8, 1, '#5cc8c0');
    p.r(3, 16, 6, 2, '#2d1c14');
    p.r(4, 16, 4, 1, '#683619');
  }),
  ent('spa-stool', [[12, 10]], (p) => {
    // Low cedar bathhouse stool
    p.r(0, 0, 12, 4, '#2d1c14');
    p.r(1, 1, 10, 2, '#c87e4b');
    p.r(1, 1, 10, 1, '#e6a670');
    p.r(1, 4, 3, 6, '#2d1c14');
    p.r(2, 4, 1, 5, '#8f502a');
    p.r(8, 4, 3, 6, '#2d1c14');
    p.r(9, 4, 1, 5, '#8f502a');
  }),
  ent('spa-slippers', [[10, 8]], (p) => {
    // Pair of neat cedar/linen spa slippers on the floor
    p.r(0, 1, 4, 7, '#2d1c14');
    p.r(1, 2, 2, 5, '#e8f4f2');
    p.r(1, 3, 2, 2, '#5cc8c0');
    p.r(6, 1, 4, 7, '#2d1c14');
    p.r(7, 2, 2, 5, '#e8f4f2');
    p.r(7, 3, 2, 2, '#5cc8c0');
  }),
  ent('spa-teapot', [[12, 10]], (p) => {
    // Cast-iron teapot on a wooden trivet
    p.r(1, 8, 10, 2, '#2d1c14');
    p.r(2, 2, 7, 6, '#2d1c14');
    p.r(3, 3, 5, 4, '#585e66');
    p.r(4, 1, 3, 1, '#8f98a0');
    p.r(9, 3, 2, 2, '#585e66');
    p.r(0, 4, 2, 2, '#585e66');
  }),
  ent('spa-candle', [[8, 12]], (p) => {
    // Grounded ceramic tea-light holder
    p.r(1, 5, 6, 7, '#2d1c14');
    p.r(2, 6, 4, 5, '#f0e8d8');
    p.r(3, 2, 2, 3, '#ffb84d');
    p.r(3, 1, 1, 2, '#fff4b8');
  }),
  ent('spa-bamboo', [[10, 20]], (p) => {
    // Potted bamboo stalk in a ceramic planter
    p.r(1, 13, 8, 7, '#2d1c14');
    p.r(2, 14, 6, 5, '#727a82');
    p.r(4, 1, 2, 12, '#629e54');
    p.r(2, 4, 2, 2, '#84c472');
    p.r(6, 7, 2, 2, '#84c472');
  }),
  ent('spa-incense', [[12, 10]], (p) => {
    // Stone incense tray with rising ash wisp
    p.r(1, 6, 10, 4, '#2d1c14');
    p.r(2, 7, 8, 2, '#8f98a0');
    p.r(4, 4, 4, 2, '#c87e4b');
    p.r(5, 1, 1, 3, '#d4f5f0');
  }),
  ent('spa-mat', [[18, 8]], (p) => {
    // Woven tatami bath mat
    p.r(0, 1, 18, 6, '#2d1c14');
    p.r(1, 2, 16, 4, '#c8b882');
    p.r(1, 2, 2, 4, '#5cc8c0');
    p.r(15, 2, 2, 4, '#5cc8c0');
  }),
  ent('spa-basin', [[14, 12]], (p) => {
    // Low stone foot-soak basin
    p.r(0, 3, 14, 9, '#2d1c14');
    p.r(1, 4, 12, 7, '#727a82');
    p.r(2, 4, 10, 2, '#5cc8c0');
    p.r(4, 4, 4, 1, '#a8f0ea');
  }),
  ent('spa-gong', [[14, 18]], (p) => {
    // Small brass meditation gong on a cedar stand
    p.r(1, 0, 12, 3, '#2d1c14');
    p.r(2, 1, 10, 1, '#8f502a');
    p.r(1, 3, 2, 15, '#683619');
    p.r(11, 3, 2, 15, '#683619');
    p.r(3, 4, 8, 8, '#2d1c14');
    p.r(4, 5, 6, 6, '#e0a040');
    p.r(6, 7, 2, 2, '#fff4b8');
  }),
  ent('spa-oil', [[8, 12]], (p) => {
    // Essential oil bottle on a small coaster
    p.r(1, 10, 6, 2, '#2d1c14');
    p.r(2, 4, 4, 6, '#2d1c14');
    p.r(3, 5, 2, 4, '#5cc8c0');
    p.r(3, 2, 2, 2, '#8f502a');
  }),
  ent('spa-pillow', [[12, 8]], (p) => {
    // Bolster cushion on the floor
    p.r(0, 1, 12, 6, '#2d1c14');
    p.r(1, 2, 10, 4, '#e8f4f2');
    p.r(1, 2, 10, 1, '#ffffff');
    p.r(5, 2, 2, 4, '#5cc8c0');
  }),
  ent('spa-screen', [[16, 20]], (p) => {
    // Folding shoji privacy screen
    p.r(0, 0, 16, 20, '#2d1c14');
    p.r(1, 1, 6, 18, '#e8f4f2');
    p.r(9, 1, 6, 18, '#d4f5f0');
    p.r(7, 1, 2, 18, '#683619');
    for (let y = 5; y < 18; y += 5) p.r(1, y, 14, 1, '#8f502a');
  }),
  ent('spa-slab', [[18, 10]], (p) => {
    // Warmed slate memory slab bench
    p.r(0, 1, 18, 9, '#2d1c14');
    p.r(1, 2, 16, 3, '#8f98a0');
    p.r(1, 2, 16, 1, '#cfd6dc');
    p.r(2, 5, 3, 4, '#585e66');
    p.r(13, 5, 3, 4, '#585e66');
  }),
];

const ANCHORS: EntityDef[] = [
  ent(
    'spa-pool-anchor',
    [[44, 28]],
    (p) => {
      // Steaming turquoise kmalloc thermal bath
      p.r(0, 8, 44, 20, '#2d1c14');
      p.r(1, 9, 42, 18, '#8f98a0');
      p.r(2, 9, 40, 2, '#cfd6dc');
      p.r(3, 12, 38, 12, '#3baea8');
      p.r(4, 13, 36, 9, '#5cc8c0');
      p.r(6, 14, 14, 2, '#a8f0ea');
      p.r(24, 17, 12, 2, '#a8f0ea');
      // Wooden bath-side bucket & sign
      p.r(34, 4, 8, 6, '#2d1c14');
      p.r(35, 5, 6, 4, '#c87e4b');
      p.r(4, 2, 14, 7, '#2d1c14');
      p.r(5, 3, 12, 5, '#f0e8d8');
      p.t('POOL', 6, 7, '#2d1c14');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const s1 = Math.floor(t * 2) % 4;
        const s2 = Math.floor(t * 2 + 2) % 4;
        p.glow(12, 7 - s1, 4, 'rgba(232,248,246,0.4)');
        p.glow(28, 8 - s2, 4, 'rgba(232,248,246,0.35)');
      },
      text: true,
    },
  ),
];

export const slabSpa: LayerArt = {
  family: 'libraries',
  blurb: '1994 · Misty cedar bathhouse of kmalloc caches, freelist pools & OOM steam vents',
  palette: 'full',
  form: 'repl',
  cursor: 'ibeam',
  stackTheme: {
    accent: '#5cc8c0',
    hi: '#d4f5f0',
    tint: 'rgba(92, 200, 192, 0.16)',
    border: 'rgba(92, 200, 192, 0.44)',
    anim: 'pulse',
    icon: [
      '  +   +  ',
      '   +   + ',
      '         ',
      '#########',
      '#+++++++#',
      '#+#+++#+#',
      '#########',
      ' #     # ',
      '#########',
    ],
  },
  topicTags: ['os', 'dsa', 'hardware'],
  library: { own: PROPS, anchors: ANCHORS, density: 2.8, anchorCount: 1, far: 0 },
  open: 'top',
  floors: (top, bottom, W) => {
    const sTop = Math.max(top, bottom - 260);
    const sBot = bottom - 6;
    const H = Math.max(120, sBot - sTop);
    const vy = R(sTop + H * 0.44);
    const fov = Math.min(W * 0.72, 260);
    const winL = Math.max(18, R(W * 0.08));
    const winR = Math.min(W - 18, R(W * 0.92));
    const winB = sBot - 14;
    const roomHalfW = ((winR - winL) * 0.5) / fov;
    const floorY = (winB - vy) / fov;
    const zBack = 2.75;
    const bx0 = R(W / 2 - (roomHalfW * fov) / zBack);
    const bx1 = R(W / 2 + (roomHalfW * fov) / zBack);
    const by1 = R(vy + (floorY * fov) / zBack);
    return [
      { kind: 'trapezoid', yTop: by1 + 4, yBottom: winB - 2, xTopLeft: bx0 + 4, xTopRight: bx1 - 4, xBottomLeft: winL + 4, xBottomRight: winR - 4 },
      { kind: 'ledge', y: winB, xLeft: 4, xRight: W - 4 },
    ];
  },
  fog: [24, 52, 54],
  background: (ctx, b, { entities }) => {
    const [y0, y1] = vis(b);
    fill(ctx, 0, y0, b.w, y1 - y0, '#1e3c3e');
    vgrad(ctx, b, b.top, b.bottom + SEAM_H, [
      [0, 'rgba(168,240,234,0.2)'],
      [0.55, 'rgba(42,92,94,0.12)'],
      [1, 'rgba(120,66,38,0.22)'],
    ]);
    entities();
  },
  setpiece: {
    base: ({ ctx, W, cx, top, bot, H }) => {
      // Looking straight in through a wide cedar-and-stone window into a 1-point perspective 3D spa room:
      // stone fireplace in the center back, recessed steaming pool in the middle, lounge chairs off to the sides,
      // and a flat foreground sill/floor so props & critters still sit/bounce straight-on.
      const vy = R(top + H * 0.44);
      const fov = Math.min(W * 0.72, 260);
      const proj = (x3: number, y3: number, z3: number): [number, number] => [
        R(cx + (x3 * fov) / z3),
        R(vy + (y3 * fov) / z3),
      ];
      // Outer misty stone wall with staggered ashlar courses around the window
      rect(ctx, 0, top, W, H, '#182b2e');
      for (let sy = top; sy < bot; sy += 10) {
        rect(ctx, 0, sy, W, 1, '#101d20');
        const off = ((sy - top) / 10) % 2 === 0 ? 0 : 12;
        for (let sx = off; sx < W; sx += 24) {
          rect(ctx, sx, sy + 1, 1, 9, '#101d20');
          rect(ctx, sx + 1, sy + 1, 22, 1, '#233b3f');
        }
      }
      const winL = Math.max(18, R(W * 0.08));
      const winR = Math.min(W - 18, R(W * 0.92));
      const winT = top + 12;
      const winB = bot - 14;
      const winW = winR - winL;
      const winH = winB - winT;

      // 3D room bounds in world units at z=1 (window plane) -> z=2.75 (back wall)
      const roomHalfW = (winW * 0.5) / fov;
      const ceilY = (winT - vy) / fov;
      const floorY = (winB - vy) / fov;
      const zBack = 2.75;
      const [bx0, by0] = proj(-roomHalfW, ceilY, zBack);
      const [bx1, by1] = proj(roomHalfW, floorY, zBack);

      // Side walls (warm cedar), ceiling (deep timber), floor (slate/terracotta)
      rect(ctx, winL, winT, winW, winH, '#5c341c');
      // Perspective ceiling rafters & floor slate courses (clamped to window opening)
      for (let y = winT; y < by0; y++) {
        const z = (ceilY * fov) / Math.min(-1, y - vy);
        const xl = Math.max(winL, R(cx - roomHalfW * (fov / z)));
        const xr = Math.min(winR, R(cx + roomHalfW * (fov / z)));
        const beam = Math.floor(z * 4) % 2 === 0;
        rect(ctx, xl, y, xr - xl, 1, beam ? '#4a2612' : '#351a0c');
      }
      for (const rx of [-0.65, -0.32, 0, 0.32, 0.65]) {
        const [x0, y0] = proj(rx * roomHalfW, ceilY, 1.0);
        const [x1, y1] = proj(rx * roomHalfW, ceilY, zBack);
        line(ctx, x0, y0, x1, y1, '#683619');
      }
      for (let y = by1; y < winB; y++) {
        const z = (floorY * fov) / Math.max(1, y - vy);
        const xl = Math.max(winL, R(cx - roomHalfW * (fov / z)));
        const xr = Math.min(winR, R(cx + roomHalfW * (fov / z)));
        const band = Math.floor(z * 5) % 2 === 0;
        rect(ctx, xl, y, xr - xl, 1, band ? '#4d5b60' : '#3e4a4f');
        if (Math.abs((z * 5) % 1) < 0.08) rect(ctx, xl, y, xr - xl, 1, '#2a3336');
      }
      // Perspective floor tile seams + subtle top-left tile highlights
      for (let gx = -3; gx <= 3; gx++) {
        const [x0, y0] = proj((gx * roomHalfW) / 3, floorY, 1.0);
        const [x1, y1] = proj((gx * roomHalfW) / 3, floorY, zBack);
        line(ctx, x0, y0, x1, y1, '#2a3336');
        line(ctx, x0 + 1, y0, x1 + 1, y1, '#5b6b70');
      }
      // Side wall tongue-and-groove cedar slats & wainscoting rail
      for (const s of [-1, 1]) {
        const [wx0, wy0] = proj(s * roomHalfW, floorY * 0.35, 1.0);
        const [wx1, wy1] = proj(s * roomHalfW, floorY * 0.35, zBack);
        line(ctx, wx0, wy0, wx1, wy1, '#8f502a');
        line(ctx, wx0, wy0 + 1, wx1, wy1 + 1, '#3b2112');
        for (const z of [1.25, 1.55, 1.9, 2.3]) {
          const [sx, syTop] = proj(s * roomHalfW, ceilY, z);
          const [, syBot] = proj(s * roomHalfW, floorY, z);
          line(ctx, sx, syTop, sx, syBot, '#432412');
        }
      }

      // Back wall (warm plaster + timber framing, sauna door on left, towel alcove on right)
      rect(ctx, bx0, by0, bx1 - bx0, by1 - by0, '#7a4a2b');
      rect(ctx, bx0, by0, bx1 - bx0, 3, '#a86234');
      rect(ctx, bx0, by0 + 3, bx1 - bx0, 1, '#58321b');
      rect(ctx, bx0, by1 - 3, bx1 - bx0, 3, '#3b2112');
      // Subtle plaster texture flecks on back wall
      for (let py = by0 + 8; py < by1 - 6; py += 6) {
        for (let pxPos = bx0 + 8; pxPos < bx1 - 8; pxPos += 14) {
          if (hash(pxPos * 7 + py * 13) > 0.5) px(ctx, pxPos, py, '#6a3e22');
        }
      }
      // Cedar sauna door on the left side of the back wall
      const doorW = Math.max(12, R((bx1 - bx0) * 0.14));
      const doorH = Math.max(18, R((by1 - by0) * 0.68));
      const doorX = bx0 + Math.max(6, R((bx1 - bx0) * 0.08));
      const doorY = by1 - doorH;
      if (doorX + doorW < cx - R((bx1 - bx0) * 0.18)) {
        rect(ctx, doorX - 1, doorY - 1, doorW + 2, doorH + 1, '#3b2112');
        rect(ctx, doorX, doorY, doorW, doorH, '#9c5a30');
        rect(ctx, doorX + 1, doorY + 1, doorW - 2, 1, '#c87e4b');
        rect(ctx, doorX + 3, doorY + 3, doorW - 6, Math.max(5, R(doorH * 0.3)), '#ffd080'); // frosted sauna window
        rect(ctx, doorX + doorW - 3, doorY + R(doorH * 0.55), 2, 2, '#f0d8a0'); // brass handle
      }
      // Recessed towel & sconce niche on the right side of the back wall
      const nicheX = bx1 - Math.max(6, R((bx1 - bx0) * 0.08)) - doorW;
      if (nicheX > cx + R((bx1 - bx0) * 0.18)) {
        rect(ctx, nicheX, doorY + 4, doorW, Math.max(10, R(doorH * 0.48)), '#3b2112');
        rect(ctx, nicheX + 1, doorY + 5, doorW - 2, Math.max(8, R(doorH * 0.48) - 2), '#58321b');
        rect(ctx, nicheX + 2, doorY + 8, doorW - 4, 2, '#e8f4f2');
        rect(ctx, nicheX + 2, doorY + 12, doorW - 4, 2, '#9ad9d4');
      }

      // Center fireplace on the back wall: detailed ashlar stone, mantle, iron grate, logs & hearth apron
      const fw = Math.max(26, R((bx1 - bx0) * 0.28));
      const fh = Math.max(26, R((by1 - by0) * 0.64));
      const fx = R(cx - fw / 2);
      const fy = by1 - fh;
      const chimW = R(fw * 0.56);
      rect(ctx, cx - R(chimW / 2), by0, chimW, fy - by0 + 2, '#585e66');
      rect(ctx, cx - R(chimW / 2), by0, 2, fy - by0 + 2, '#727a82');
      rect(ctx, fx, fy, fw, fh, '#636b73'); // stone surround
      // Ashlar stone course lines & top-left stone highlights
      for (let sy = fy; sy < by1; sy += 5) {
        rect(ctx, fx, sy, fw, 1, '#444a50');
        rect(ctx, fx + 1, sy + 1, fw - 2, 1, '#828b94');
      }
      rect(ctx, fx - 2, fy + 6, fw + 4, 3, '#a86234'); // cedar mantle
      rect(ctx, fx - 2, fy + 6, fw + 4, 1, '#d8945e'); // mantle highlight
      rect(ctx, fx + 4, fy + 10, fw - 8, fh - 10, '#2b3036'); // inner stone arch
      rect(ctx, fx + 5, fy + 11, fw - 10, fh - 11, '#140c08'); // firebox
      rect(ctx, fx + 7, by1 - 6, fw - 14, 2, '#585258'); // iron grate bar
      rect(ctx, fx + 8, by1 - 4, fw - 16, 3, '#784222'); // cedar logs
      rect(ctx, fx + 7, by1 - 3, fw - 14, 2, '#e86820'); // glowing coals
      // Raised hearthstone apron & warm reflected light on the back floor
      rect(ctx, fx - 2, by1, fw + 4, 3, '#8f98a0');
      rect(ctx, fx - 2, by1, fw + 4, 1, '#cfd6dc');
      rect(ctx, fx + 1, by1 + 3, fw - 2, 4, '#6e4c36');

      // Recessed steaming spa pool in the middle of the 3D floor (z = 1.48 -> 2.32)
      for (let z = 1.48; z <= 2.32; z += 0.03) {
        const [pl, py] = proj(-roomHalfW * 0.42, floorY, z);
        const [pr] = proj(roomHalfW * 0.42, floorY, z);
        const rim = z < 1.56 || z > 2.24;
        rect(ctx, pl, py, pr - pl, 2, rim ? '#8f98a0' : '#3baea8');
        if (rim) {
          rect(ctx, pl, py, 3, 2, '#cfd6dc');
          rect(ctx, pr - 3, py, 3, 2, '#585e66');
        } else {
          rect(ctx, pl + 4, py, Math.max(2, pr - pl - 8), 1, '#5cc8c0');
          if (R(z * 20) % 3 === 0) rect(ctx, pl + 8, py, Math.max(2, R((pr - pl) * 0.3)), 1, '#a8f0ea');
        }
      }
      // Front vertical stone coping of the pool with block joints
      const [lipL, lipY] = proj(-roomHalfW * 0.42, floorY, 1.48);
      const [lipR] = proj(roomHalfW * 0.42, floorY, 1.48);
      rect(ctx, lipL, lipY, lipR - lipL, 4, '#cfd6dc');
      rect(ctx, lipL, lipY + 4, lipR - lipL, 3, '#585e66');
      for (let bx = lipL + 10; bx < lipR - 6; bx += 14) rect(ctx, bx, lipY, 1, 7, '#444a50');

      // Lounge chairs off to the left and right sides in 3D perspective (z = 1.55 -> 2.15)
      for (const side of [-1, 1]) {
        for (let step = 0; step < 5; step++) {
          const z = 1.55 + step * 0.13;
          const xIn = side * roomHalfW * 0.54;
          const xOut = side * roomHalfW * 0.86;
          const [c0, cy0] = proj(Math.min(xIn, xOut), floorY, z);
          const [c1] = proj(Math.max(xIn, xOut), floorY, z);
          const seatY = cy0 - 5;
          rect(ctx, c0 + 1, cy0 - 1, Math.max(2, c1 - c0 - 2), 2, '#222a2e'); // floor shadow
          rect(ctx, c0, seatY, c1 - c0, 3, '#c87e4b'); // cedar slat
          rect(ctx, c0, seatY, c1 - c0, 1, '#e6a670'); // top-left slat bevel
          rect(ctx, c0 + 2, seatY - 1, Math.max(2, c1 - c0 - 4), 1, '#e8f4f2'); // spa towel
          if (step === 0 || step === 4) {
            rect(ctx, c0 + 1, seatY + 3, 2, 3, '#683619');
            rect(ctx, c1 - 3, seatY + 3, 2, 3, '#683619');
          }
          if (step >= 3) {
            // Slatted backrest + rolled towel cushion
            rect(ctx, c0, seatY - 7, c1 - c0, 6, '#a86234');
            rect(ctx, c0 + 1, seatY - 6, Math.max(2, c1 - c0 - 2), 4, '#d4f5f0');
            if (step === 4) rect(ctx, c0 + 2, seatY - 8, Math.max(2, c1 - c0 - 4), 2, '#ffffff');
          }
        }
      }

      // Cedar window frame, corner brackets, mullions & flat foreground sill (for bouncing blobs & props)
      frame(ctx, winL - 2, winT - 2, winW + 4, winH + 4, '#2d1c14');
      rect(ctx, winL - 4, winT - 5, winW + 8, 5, '#8f502a');
      rect(ctx, winL - 4, winT - 5, winW + 8, 1, '#c87e4b');
      // Corner mortise brackets & wood grain ticks
      for (const [bx, by] of [[winL - 2, winT - 2], [winR - 4, winT - 2], [winL - 2, winB - 4], [winR - 4, winB - 4]] as const) {
        rect(ctx, bx, by, 6, 6, '#683619');
        rect(ctx, bx + 1, by + 1, 2, 2, '#c87e4b');
      }
      // Subtle vertical mullions near edges so center stays open
      rect(ctx, winL + R(winW * 0.22), winT, 3, winH, '#4a2612');
      rect(ctx, winL + R(winW * 0.22), winT, 1, winH, '#8f502a');
      rect(ctx, winR - R(winW * 0.22) - 3, winT, 3, winH, '#4a2612');
      rect(ctx, winR - R(winW * 0.22) - 3, winT, 1, winH, '#8f502a');
      // Subtle misty condensation glints in upper window corners
      rect(ctx, winL + 4, winT + 4, 6, 1, '#a8f0ea');
      rect(ctx, winL + 4, winT + 6, 3, 1, '#a8f0ea');
      rect(ctx, winR - 10, winT + 4, 6, 1, '#a8f0ea');
      // Flat foreground window sill / floor ledge
      rect(ctx, 0, winB, W, bot - winB + 6, '#7a4221');
      rect(ctx, 0, winB, W, 2, '#c87e4b');
      rect(ctx, 0, winB + 2, W, 1, '#4a2612');
    },
    detail: ({ ctx, t, W, cx, top, bot, H }) => {
      // Animated hearth fire in the center back + multi-layered curling steam puffs over the 3D pool
      const vy = R(top + H * 0.44);
      const fov = Math.min(W * 0.72, 260);
      const winT = top + 12;
      const winB = bot - 14;
      const winW = Math.min(W - 18, R(W * 0.92)) - Math.max(18, R(W * 0.08));
      const floorY = (winB - vy) / fov;
      const by1 = R(vy + (floorY * fov) / 2.75);
      const flicker = Math.floor(t * 7) % 3;
      rect(ctx, cx - 5 + flicker, by1 - 12, 8, 7, '#ffb84d');
      rect(ctx, cx - 3 + (flicker % 2), by1 - 10, 4, 4, '#fff4b8');
      if (winW > 80) {
        const poolBaseY = R(vy + (floorY * fov) / 1.85);
        for (let k = 0; k < 10; k++) {
          const life = mod(t * 0.45 + k * 0.37, 1);
          const sy = poolBaseY - 2 - R(life * 28);
          if (sy <= winT + 6) continue;
          const sway = R(Math.sin(t * 2.2 + k * 1.7 + life * 4) * 3);
          const sx = cx - 42 + ((k * 19) % 84) + sway;
          const w = life < 0.3 ? 4 : life < 0.7 ? 3 : 1;
          const col = life < 0.45 ? '#d4f5f0' : '#9ad9d4';
          rect(ctx, sx, sy, w, 1, col);
          if (life < 0.6) rect(ctx, sx + 1, sy - 1, Math.max(1, w - 1), 1, '#a8f0ea');
        }
      }
    },
  },
  critters: {
    motions: [MotionType.Float, MotionType.Hop],
    count: 3,
    exitLabels: ['kmalloc', 'steamed'],
    draw: ({ px, ink, t, phase }) => {
      // Steamy turquoise Bubble Slime
      const bob = Math.floor(t * 4 + phase) % 2;
      px(1, 0 + bob, 4, 1, '#d4f5f0');
      px(0, 1, 6, 5, '#5cc8c0');
      px(1, 1, 4, 2, '#a8f0ea');
      px(1, 3, 1, 1, ink);
      px(4, 3, 1, 1, ink);
    },
  },
  sound: {
    timbre: { wave: 'sine', filterHz: 1800, q: 1.0, gainScale: 0.78, reverbWet: 0.45 },
    ambienceLevel: 0.06,
    drones: [],
    critterExit: { freq: 520, crush: false },
    critterCall: libraries.sound.critterCall,
  },
};
