import { enforce } from '../../core/enforce';
import { ent, type EntityDef } from './kit';
import { USERSPACE } from './lib-mid';

/**
 * Bespoke v4 pixel-art entities & anchors for the True Endless realms (worldbuilt pocket-universes).
 * Follows ART-STYLE.md: front-on, 1 px dark ink outline, top-left lighting, grounded props, >= 8 px.
 */

function mix(prefix: string, bespoke: readonly EntityDef[], donor: readonly EntityDef[]): EntityDef[] {
  const out: EntityDef[] = [...bespoke];
  const need = Math.max(0, 20 - out.length);
  enforce(donor.length >= need, `${prefix}: donor library has ${donor.length} entities, need ${need} to reach 20`);
  for (let i = 0; i < need; i++) {
    const d = donor[i]!;
    out.push({ ...d, id: `${prefix}-${d.id}` });
  }
  return out;
}

// =============================================================================================
// 1994 · The Slab Spa (misty cedar bathhouse of kmalloc caches, freelist pools & OOM steam vents)

export const SLAB_SPA_BESPOKE: EntityDef[] = [
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

export const SLAB_SPA: EntityDef[] = SLAB_SPA_BESPOKE;

export const SLAB_SPA_ANCHORS: EntityDef[] = [
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

// =============================================================================================
// 1978 · The Kthread Kabin (cozy log cabin of off-duty kworkers, workqueue logs & softirq hearth)

export const KTHREAD_KABIN_BESPOKE: EntityDef[] = [
  ent('kabin-woodpile', [[20, 14]], (p) => {
    // Stacked workqueue firewood logs under a tiny shingled eave
    p.r(0, 0, 20, 4, '#24140c');
    p.r(1, 1, 18, 2, '#784222');
    p.r(1, 4, 18, 10, '#24140c');
    for (let y = 5; y <= 10; y += 3) {
      for (let x = 2; x <= 14; x += 4) {
        p.r(x, y, 3, 3, '#c87e4b');
        p.r(x + 1, y + 1, 1, 1, '#f0d098');
      }
    }
  }),
  ent('kabin-stump', [[14, 14]], (p) => {
    // Chopping stump with a pixel axe embedded in the top
    p.r(2, 6, 10, 8, '#24140c');
    p.r(3, 7, 8, 6, '#8f502a');
    p.r(3, 7, 8, 2, '#e6b87c');
    // Axe blade & handle
    p.r(5, 3, 4, 4, '#24140c');
    p.r(6, 4, 2, 2, '#cfd6dc');
    p.r(8, 0, 3, 5, '#24140c');
    p.r(9, 1, 1, 3, '#c87e4b');
  }),
  ent(
    'kabin-lantern',
    [[10, 16]],
    (p) => {
      // Iron oil lantern on a wooden post
      p.r(3, 10, 4, 6, '#24140c');
      p.r(4, 11, 2, 4, '#784222');
      p.r(1, 2, 8, 9, '#24140c');
      p.r(2, 3, 6, 1, '#585258');
      p.r(3, 4, 4, 5, '#ffb84d');
      p.r(2, 9, 6, 1, '#585258');
      p.r(3, 0, 4, 2, '#585258');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (Math.floor(t * 5) % 2 === 0) p.r(4, 5, 2, 2, '#fff4b8');
      },
    },
  ),
  ent(
    'kabin-antlers',
    [[18, 12]],
    (p) => {
      // Wall-mounted wooden plaque with RCU antler rack
      p.r(4, 4, 10, 8, '#24140c');
      p.r(5, 5, 8, 6, '#8f502a');
      p.r(6, 6, 6, 4, '#f0e8d8');
      p.t('RCU', 6, 10, '#24140c');
      // Left & right antlers
      p.r(1, 0, 3, 5, '#e6d8c0');
      p.r(0, 1, 2, 2, '#e6d8c0');
      p.r(14, 0, 3, 5, '#e6d8c0');
      p.r(16, 1, 2, 2, '#e6d8c0');
    },
    { text: true },
  ),
  ent('kabin-rocker', [[16, 18]], (p) => {
    // Front-on wooden rocking chair
    p.r(2, 0, 12, 16, '#24140c');
    p.r(3, 1, 10, 8, '#a86234');
    p.r(4, 2, 2, 6, '#683619');
    p.r(7, 2, 2, 6, '#683619');
    p.r(10, 2, 2, 6, '#683619');
    p.r(2, 9, 12, 2, '#e6a670');
    p.r(3, 11, 2, 5, '#784222');
    p.r(11, 11, 2, 5, '#784222');
    p.r(0, 16, 16, 2, '#683619');
  }),
  ent('kabin-kettle', [[12, 12]], (p) => {
    // Cast-iron pot on a tripod stand
    p.r(1, 0, 10, 12, '#24140c');
    p.r(2, 8, 2, 4, '#585258');
    p.r(8, 8, 2, 4, '#585258');
    p.r(2, 3, 8, 6, '#3c383e');
    p.r(3, 4, 6, 1, '#78727c');
    p.r(4, 1, 4, 2, '#585258');
  }),
  ent('kabin-pine', [[16, 24]], (p) => {
    // Snow-dusted pine tree outside the cabin
    p.r(6, 18, 4, 6, '#24140c');
    p.r(7, 19, 2, 4, '#784222');
    p.r(1, 13, 14, 6, '#24140c');
    p.r(2, 14, 12, 4, '#2d6838');
    p.r(2, 14, 12, 1, '#e8f4f8');
    p.r(3, 7, 10, 6, '#24140c');
    p.r(4, 8, 8, 4, '#3a8448');
    p.r(4, 8, 8, 1, '#e8f4f8');
    p.r(5, 1, 6, 6, '#24140c');
    p.r(6, 2, 4, 4, '#4ca25c');
    p.r(6, 2, 4, 1, '#ffffff');
  }),
];

export const KTHREAD_KABIN: EntityDef[] = mix('kabin', KTHREAD_KABIN_BESPOKE, USERSPACE);

export const KTHREAD_KABIN_ANCHORS: EntityDef[] = [
  ent(
    'kabin-hearth-anchor',
    [[46, 30]],
    (p) => {
      // Stone & timber cabin fireplace with crackling softirq embers
      p.r(0, 0, 46, 30, '#24140c');
      p.r(2, 1, 42, 6, '#727a82');
      p.r(1, 7, 44, 3, '#a86234');
      p.r(1, 7, 44, 1, '#e6a670');
      p.r(3, 10, 40, 19, '#585e66');
      // Mantle clock
      p.r(19, 2, 8, 5, '#f0e8d8');
      p.t('IRQ', 20, 6, '#24140c');
      // Firebox
      p.r(12, 14, 22, 14, '#140c08');
      p.r(15, 23, 16, 4, '#784222');
      p.r(16, 19, 14, 5, '#e86820');
      p.r(19, 17, 8, 5, '#ffb84d');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const f = Math.floor(t * 6) % 3;
        p.r(20 + f, 16, 4, 3, '#fff4b8');
        p.glow(23, 16 - f, 6, 'rgba(255,184,77,0.35)');
      },
      text: true,
    },
  ),
];
