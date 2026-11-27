import type { LayerId } from '../../core/layers';
import { ent, type EntityDef } from './kit';

/**
 * Extra bespoke trinkets for the Endless-only intermediate layers, so adjacent bands stop borrowing the same
 * donor props and every layer reads as its own place (3–4 new props each).
 */

const mod = (n: number, m: number) => ((n % m) + m) % m;

export const ENDLESS_EXTRA: Partial<Record<LayerId, readonly EntityDef[]>> = {
  linker: [
    ent('ld-got', [[16, 12]], (p) => {
      p.box(0, 0, 16, 12, '#000000', '#aaaaaa');
      for (let k = 0; k < 4; k++) p.r(2, 2 + k * 2.5, 12, 1, k === 1 ? '#ffff55' : '#555555');
    }),
    ent('ld-soname', [[20, 8]], (p) => {
      p.r(0, 0, 20, 8, '#aa5500');
      p.r(1, 1, 18, 6, '#ffffaa');
      p.r(3, 3, 10, 1, '#555555');
      p.r(3, 5, 6, 1, '#aa5500');
    }),
    ent('ld-rpath', [[18, 9]], (p) => {
      p.r(0, 4, 18, 1, '#aaaaaa');
      p.r(4, 1, 1, 7, '#ffff55');
      p.r(9, 1, 1, 7, '#55aaaa');
      p.r(14, 1, 1, 7, '#ffaa55');
    }),
    ent('ld-lazy', [[14, 12]], (p) => {
      p.frame(0, 0, 14, 12, '#aaaaaa');
      p.r(3, 3, 8, 2, '#555555');
      p.r(3, 7, 4, 2, '#ffff55');
    }),
  ],
  'kernel-entry': [
    ent('ke-ptrace', [[16, 12]], (p) => {
      p.box(0, 0, 16, 12, '#000000', '#ff55ff');
      p.r(3, 3, 4, 6, '#55ffff');
      p.r(9, 3, 4, 6, '#ffff55');
    }),
    ent('ke-cred', [[14, 13]], (p) => {
      p.box(0, 0, 14, 13, '#0000aa', '#55ffff');
      p.disc(7, 5, 2, '#ffffff');
      p.r(3, 8, 8, 3, '#ffffff');
    }),
    ent('ke-fdtable', [[16, 12]], (p) => {
      p.box(0, 0, 16, 12, '#000000', '#aaaaaa');
      for (let k = 0; k < 4; k++) p.r(2, 2 + k * 2.5, 3 + k * 2, 1, '#55ff55');
    }),
    ent('ke-vdso', [[18, 9]], (p) => {
      p.r(0, 4, 18, 1, '#55ffff');
      p.r(3, 1, 3, 7, '#ffff55');
      p.r(12, 1, 3, 7, '#ffff55');
    }),
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
    ent('ka-rcu', [[18, 10]], (p) => {
      p.box(0, 0, 8, 10, '#000000', '#55ffff');
      p.box(10, 0, 8, 10, '#000000', '#ffff55');
      p.r(8, 4, 2, 2, '#ffffff');
    }),
    ent('ka-tlb', [[16, 10]], (p) => {
      p.box(0, 0, 16, 10, '#000000', '#ff5555');
      for (let k = 0; k < 3; k++) p.r(2 + k * 4, 3, 3, 4, k === 1 ? '#ffff55' : '#aa0000');
    }),
  ],
  'bus-fabric': [
    ent('bf-retimer', [[14, 10]], (p) => {
      p.box(0, 0, 14, 10, '#000000', '#ff55ff');
      p.r(3, 4, 8, 2, '#55ffff');
    }),
    ent('bf-msix', [[16, 12]], (p) => {
      p.box(0, 0, 16, 12, '#000000', '#55ffff');
      for (let k = 0; k < 4; k++) p.r(2 + k * 3, 2, 2, 8, k % 2 ? '#ff55ff' : '#ffffff');
    }),
    ent('bf-lane', [[24, 8]], (p) => {
      p.r(1, 1, 22, 6, '#000000');
      p.r(2, 2, 20, 1, '#55ffff');
      p.r(2, 5, 20, 1, '#ff55ff');
    }),
    ent('bf-iommu', [[14, 13]], (p) => {
      p.frame(0, 0, 14, 13, '#ffffff');
      p.r(3, 3, 8, 7, '#ff55ff');
      p.r(5, 5, 4, 3, '#000000');
    }),
  ],
  vmm: [
    ent('vmm-ghostnic', [[18, 9]], (p) => {
      p.frame(0, 0, 18, 9, '#aaaaaa');
      for (let k = 0; k < 4; k++) p.p(3 + k * 4, 4, '#555555');
    }),
    ent('vmm-hpet', [[12, 12]], (p) => {
      p.ring(6, 6, 5, '#aaaaaa');
      p.l(6, 6, 6, 2, '#ffffff');
    }),
    ent('vmm-bios', [[16, 10]], (p) => {
      p.frame(0, 0, 16, 10, '#555555');
      p.r(2, 3, 9, 1, '#aaaaaa');
      p.r(2, 6, 6, 1, '#aaaaaa');
    }),
  ],
  ept: [
    ent('ept-pte', [[14, 10]], (p) => {
      p.frame(0, 0, 14, 10, '#aaaaaa');
      for (let k = 0; k < 6; k++) p.p(2 + k * 2, 4, k % 2 ? '#ffffff' : '#555555');
    }),
    ent('ept-dirty', [[10, 10]], (p) => {
      p.box(0, 0, 10, 10, '#000000', '#aaaaaa');
      p.r(3, 3, 4, 4, '#ffffff');
    }),
    ent('ept-walker', [[16, 14]], (p) => {
      for (let k = 0; k < 4; k++) p.r(1 + k * 3, 1 + k * 3, 4, 3, k === 3 ? '#ffffff' : '#555555');
    }),
  ],
  smram: [
    ent('sm-rsm', [[12, 12]], (p) => {
      p.box(0, 0, 12, 12, '#404040', '#c0c0c0');
      p.r(4, 3, 4, 6, '#ffffff');
    }),
    ent('sm-tseg', [[18, 10]], (p) => {
      p.r(0, 0, 18, 10, '#404040');
      p.r(1, 1, 16, 8, '#000000');
      p.r(3, 4, 12, 2, '#808080');
    }),
    ent('sm-lockbit', [[10, 12]], (p) => {
      p.r(2, 0, 6, 5, '#c0c0c0');
      p.r(3, 1, 4, 3, '#000000');
      p.r(1, 5, 8, 7, '#808080');
    }),
  ],
  'me-minix-user': [
    ent('mx-httpd', [[16, 10]], (p) => {
      p.box(0, 0, 16, 10, '#000000', '#aaaaaa');
      p.r(3, 3, 10, 1, '#ffffff');
      p.r(3, 6, 6, 1, '#555555');
    }),
    ent('mx-tcp', [[14, 10]], (p) => {
      p.box(0, 0, 6, 10, '#000000', '#aaaaaa');
      p.box(8, 0, 6, 10, '#000000', '#ffffff');
      p.r(6, 4, 2, 2, '#aaaaaa');
    }),
    ent('mx-tinytower', [[8, 16]], (p) => {
      p.r(1, 2, 6, 14, '#555555');
      p.r(3, 0, 2, 3, '#aaaaaa');
      p.p(3, 6, '#ffffff');
      p.p(3, 10, '#ffffff');
    }),
  ],
  'me-minix-kern': [
    ent('mk-notify', [[14, 10]], (p) => {
      p.box(0, 0, 14, 10, '#000000', '#aaaaaa');
      p.ring(7, 5, 3, '#ffffff');
    }),
    ent('mk-grant', [[16, 10]], (p) => {
      p.box(0, 2, 6, 6, '#000000', '#aaaaaa');
      p.box(10, 2, 6, 6, '#000000', '#ffffff');
      p.r(6, 4, 4, 2, '#555555');
    }),
    ent('mk-fused', [[14, 12]], (p) => {
      p.box(0, 0, 14, 12, '#000000', '#ffffff');
      for (let k = 0; k < 4; k++) p.r(2 + k * 3, 2, 2, 8, k % 2 ? '#555555' : '#aaaaaa');
    }),
  ],
  uarch: [
    ent('ua-btb', [[16, 12]], (p) => {
      p.box(0, 0, 16, 12, '#000000', '#aaaaaa');
      for (let k = 0; k < 3; k++) p.r(2, 2 + k * 3, 5 + k * 3, 2, '#555555');
    }),
    ent('ua-rs', [[18, 10]], (p) => {
      p.frame(0, 0, 18, 10, '#aaaaaa');
      for (let k = 0; k < 4; k++) p.r(2 + k * 4, 3, 3, 4, k === 2 ? '#ffffff' : '#555555');
    }),
    ent('ua-prefetch', [[18, 8]], (p) => {
      p.r(0, 3, 18, 2, '#555555');
      for (let k = 0; k < 3; k++) p.r(3 + k * 5, 1, 3, 6, '#aaaaaa');
    }),
  ],
  rtl: [
    ent('rtl-mux', [[14, 14]], (p) => {
      p.l(2, 0, 11, 4, '#aaaaaa');
      p.l(11, 4, 11, 9, '#aaaaaa');
      p.l(11, 9, 2, 13, '#aaaaaa');
      p.l(2, 13, 2, 0, '#aaaaaa');
    }),
    ent('rtl-adder', [[16, 12]], (p) => {
      p.box(0, 0, 16, 12, '#000000', '#aaaaaa');
      p.r(7, 3, 2, 6, '#ffffff');
      p.r(5, 5, 6, 2, '#ffffff');
    }),
    ent(
      'rtl-clk',
      [[18, 8]],
      (p) => {
        p.r(1, 1, 16, 6, '#000000');
        p.r(1, 3, 16, 2, '#555555');
      },
      {
        anim: (p, _w, _h, _v, t) => {
          const hi = Math.floor(t * 4) % 2 === 0;
          for (let x = 1; x < 17; x += 4) p.r(x, hi ? 1 : 5, 4, 1, '#ffffff');
        },
        noFlip: true,
      },
    ),
  ],
  cmos: [
    ent('cm-nwell', [[18, 12]], (p) => {
      p.r(0, 0, 18, 12, '#24989c');
      p.r(2, 3, 14, 6, '#9448d4');
    }),
    ent('cm-contact', [[10, 10]], (p) => {
      p.r(0, 0, 10, 10, '#e88438');
      p.r(3, 3, 4, 4, '#ffffff');
    }),
    ent('cm-metal', [[22, 8]], (p) => {
      for (let k = 0; k < 3; k++) p.r(0, 1 + k * 3, 22, 2, k % 2 ? '#e88438' : '#9448d4');
    }),
  ],
  litho: [
    ent('li-mask', [[18, 18]], (p) => {
      p.frame(0, 0, 18, 18, '#aaaaaa');
      p.r(3, 3, 5, 5, '#555555');
      p.r(10, 9, 5, 6, '#555555');
    }),
    ent('li-photon', [[10, 10]], (p) => {
      p.r(4, 0, 2, 10, '#ffffff');
      p.r(0, 4, 10, 2, '#aaaaaa');
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
    ent('bg-photonabs', [[16, 12]], (p) => {
      p.r(0, 8, 16, 2, '#555555');
      p.l(2, 0, 7, 8, '#ffffff');
      p.r(8, 2, 6, 2, '#aaaaaa');
    }),
    ent(
      'bg-recomb',
      [[14, 12]],
      (p) => {
        p.r(0, 5, 14, 2, '#555555');
      },
      {
        anim: (p, _w, _h, _v, t) => {
          const q = mod(t * 0.8, 1);
          p.r(2 + Math.floor(q * 4), 1, 2, 2, '#ffffff');
          p.r(10 - Math.floor(q * 4), 9, 2, 2, '#aaaaaa');
        },
        noFlip: true,
      },
    ),
  ],
  landauer: [
    ent('la-erase', [[12, 12]], (p) => {
      p.frame(0, 0, 12, 12, '#555555');
      p.p(6, 6, '#ffffff');
    }),
    ent('la-heat', [[16, 10]], (p) => {
      for (let k = 0; k < 4; k++) p.r(1 + k * 4, 3 + (k % 2) * 2, 2, 5, '#555555');
    }),
    ent('la-lonebit', [[8, 8]], (p) => {
      p.r(1, 1, 6, 6, '#aaaaaa');
      p.r(3, 3, 2, 2, '#ffffff');
    }),
  ],
};
