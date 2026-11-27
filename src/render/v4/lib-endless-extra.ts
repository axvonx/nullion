import type { LayerId } from '../../core/layers';
import { ent, type EntityDef } from './kit';

/**
 * Extra bespoke trinkets for the Endless-only intermediate layers, so adjacent bands stop borrowing the same
 * donor props and every layer reads as its own place (3–4 new props each).
 */


export const ENDLESS_EXTRA: Partial<Record<LayerId, readonly EntityDef[]>> = {
  linker: [
  ],
  'kernel-entry': [
  ],
  'kernel-arch': [
    ent('ka-nmi', [[14, 14]], (p) => {
      p.disc(7, 7, 6, '#aa0000');
      p.disc(7, 7, 3, '#ffff55');
      p.r(6, 0, 2, 3, '#ffffff');
    }),
    ent('ka-spinlock', [[14, 12]], (p) => {
      p.ring(7, 6, 5, '#ffff55');
      p.r(6, 5, 3, 3, '#ff5555');
    }),
  ],
  'bus-fabric': [
  ],
  vmm: [
  ],
  ept: [
  ],
  smram: [
  ],
  'me-minix-user': [
  ],
  'me-minix-kern': [
  ],
  uarch: [
  ],
  rtl: [
  ],
  cmos: [
  ],
  litho: [
    ent('li-mask', [[18, 18]], (p) => {
      p.frame(0, 0, 18, 18, '#aaaaaa');
      p.r(3, 3, 5, 5, '#555555');
      p.r(10, 9, 5, 6, '#555555');
    }),
    ent('li-resist', [[20, 8]], (p) => {
      p.r(0, 4, 20, 4, '#555555');
      for (let k = 0; k < 4; k++) p.r(2 + k * 5, 0, 3, 5, '#aaaaaa');
    }),
  ],
  bandgap: [
    ent('bg-hole', [[10, 10]], (p) => {
      p.disc(5, 5, 4, '#aaaaaa');
      p.disc(5, 5, 2, '#000000');
    }),
  ],
  landauer: [
    ent('la-lonebit', [[8, 8]], (p) => {
      p.r(1, 1, 6, 6, '#aaaaaa');
      p.r(3, 3, 2, 2, '#ffffff');
    }),
  ],
};
