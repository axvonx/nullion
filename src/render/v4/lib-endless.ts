import { ent, type EntityDef } from './kit';
import { DRIVERS, FIRMWARE, RING1, RING2, RING3 } from './lib-lower';
import { KERNEL, LIBRARIES, USERSPACE } from './lib-mid';
import { APPLICATION, RUNTIME } from './lib-upper';

/**
 * Bespoke v4 pixel-art entities & anchors for the 19 Endless Mode layers (Zones A–F).
 *
 * Intermediate layers pair bespoke signature props + anchors with remixed donor props from adjacent
 * layers (whose colours automatically snap onto each layer's palette via `kit.ts`), ensuring every
 * layer has >= 20 unique entity IDs and an unmistakably distinct visual silhouette.
 */

const R = Math.round;
const mod = (n: number, m: number) => ((n % m) + m) % m;

/** Combine bespoke entities with donor props (re-keyed with a prefix so IDs stay unique) up to at least 20 types. */
function mix(prefix: string, bespoke: readonly EntityDef[], donor: readonly EntityDef[]): EntityDef[] {
  const out: EntityDef[] = [...bespoke];
  const need = Math.max(0, 20 - out.length);
  for (let i = 0; i < Math.min(need, donor.length); i++) {
    const d = donor[i]!;
    out.push({ ...d, id: `${prefix}-${d.id}` });
  }
  return out;
}

// =============================================================================================
// Zone A — Above Application: Internet / BGP & Browser / Compositor

export const INTERNET_BESPOKE: EntityDef[] = [
  ent(
    'net-bgp',
    [[22, 12]],
    (p) => {
      p.r(1, 1, 21, 11, '#3a4a8a');
      p.r(0, 0, 21, 11, '#2a3358');
      p.r(1, 1, 19, 9, '#f3efe6');
      p.r(2, 2, 6, 2, '#5b8ee6');
      p.r(10, 2, 8, 1, '#55607a');
      p.r(2, 5, 16, 1, '#a8acb8');
      p.r(2, 7, 12, 1, '#59c08a');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const x = 2 + (Math.floor(t * 5) % 14);
        p.r(x, 7, 3, 1, '#e6a23c');
      },
      noFlip: true,
    },
  ),
  ent('net-cable', [[26, 8]], (p) => {
    p.r(0, 3, 26, 2, '#2a3358');
    p.r(0, 3, 26, 1, '#5b8ee6');
    for (let x = 2; x < 24; x += 6) p.r(x, 2, 2, 4, '#e6a23c');
  }),
  ent('net-dns', [[14, 15]], (p) => {
    p.r(1, 1, 13, 14, '#3a4a8a');
    p.r(0, 0, 13, 14, '#ffffff');
    p.r(0, 0, 13, 3, '#59c08a');
    p.r(2, 5, 9, 2, '#55607a');
    p.r(2, 8, 6, 2, '#a8acb8');
    p.r(2, 11, 8, 1, '#5b8ee6');
  }),
  ent('net-asn', [[16, 10]], (p) => {
    p.r(2, 2, 12, 6, '#ffffff');
    p.r(0, 4, 16, 4, '#ffffff');
    p.r(4, 0, 8, 4, '#ffffff');
    p.r(2, 8, 12, 1, '#c8d6f0');
    p.r(5, 4, 6, 2, '#5b8ee6');
  }),
  ent(
    'net-fiber',
    [[24, 6]],
    (p) => {
      p.r(0, 2, 24, 2, '#4cb8c8');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const x = Math.floor(mod(t * 18, 22));
        p.r(x, 2, 3, 2, '#ffffff');
      },
    },
  ),
  ent('net-router', [[16, 11]], (p) => {
    p.r(2, 0, 1, 5, '#55607a');
    p.r(13, 0, 1, 5, '#55607a');
    p.r(0, 5, 16, 6, '#2a3358');
    p.r(1, 6, 14, 4, '#e9e6dc');
    for (let k = 0; k < 4; k++) p.p(3 + k * 3, 8, k % 2 ? '#59c08a' : '#e6a23c');
  }),
  ent('net-dish', [[14, 14]], (p) => {
    p.r(5, 9, 4, 5, '#55607a');
    p.l(1, 5, 11, 1, '#ffffff');
    p.l(2, 6, 11, 2, '#c8d6f0');
    p.l(6, 4, 10, 8, '#5b8ee6');
  }),
  ent('net-packet', [[14, 9]], (p) => {
    p.r(1, 1, 13, 8, '#3a4a8a');
    p.r(0, 0, 13, 8, '#ffffff');
    p.r(0, 0, 13, 2, '#4cb8c8');
    p.r(2, 4, 5, 1, '#55607a');
    p.r(8, 4, 3, 2, '#e6a23c');
  }),
  ent('net-tls', [[11, 12]], (p) => {
    p.r(3, 0, 5, 4, '#59c08a');
    p.r(4, 1, 3, 3, '#ffffff');
    p.r(1, 4, 9, 8, '#2f9963');
    p.r(5, 7, 1, 3, '#ffffff');
  }),
];
export const INTERNET = mix('net', INTERNET_BESPOKE, APPLICATION);
export const INTERNET_ANCHORS: EntityDef[] = [
  ent(
    'net-ixp',
    [[56, 42]],
    (p) => {
      p.r(2, 2, 54, 40, '#3a4a8a');
      p.r(0, 0, 54, 40, '#2a3358');
      p.r(1, 1, 52, 5, '#5b8ee6');
      p.r(1, 6, 52, 33, '#f3efe6');
      for (let k = 0; k < 4; k++) {
        p.r(4 + k * 12, 10, 9, 24, '#e2e6f0');
        p.r(5 + k * 12, 12, 7, 3, '#2a3358');
        p.r(5 + k * 12, 17, 7, 14, '#5b8ee6');
      }
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const k = Math.floor(t * 4) % 4;
        p.r(6 + k * 12, 13, 2, 1, '#59c08a');
      },
      noFlip: true,
    },
  ),
];

export const BROWSER_BESPOKE: EntityDef[] = [
  ent('br-dom', [[18, 15]], (p) => {
    p.r(6, 0, 6, 3, '#5b8ee6');
    p.l(9, 3, 4, 7, '#55607a');
    p.l(9, 3, 14, 7, '#55607a');
    p.r(1, 7, 6, 3, '#59c08a');
    p.r(11, 7, 6, 3, '#e6a23c');
    p.l(14, 10, 14, 12, '#55607a');
    p.r(11, 12, 6, 3, '#a070e0');
  }),
  ent('br-css', [[16, 12]], (p) => {
    p.r(0, 0, 16, 12, '#e6a23c');
    p.r(2, 2, 12, 8, '#59c08a');
    p.r(4, 4, 8, 4, '#5b8ee6');
    p.r(6, 5, 4, 2, '#ffffff');
  }),
  ent('br-layer', [[20, 14]], (p) => {
    for (let k = 0; k < 3; k++) {
      p.r(k * 3, k * 3, 14, 8, k === 2 ? '#ffffff' : k === 1 ? '#dfe6f6' : '#c8d6f0');
      p.frame(k * 3, k * 3, 14, 8, '#2a3358');
    }
  }),
  ent('br-tab', [[22, 8]], (p) => {
    p.r(0, 2, 22, 6, '#e2e6f0');
    p.r(1, 0, 8, 4, '#ffffff');
    p.r(10, 1, 7, 3, '#c8d0e6');
    p.r(2, 2, 5, 1, '#5b8ee6');
  }),
  ent(
    'br-paint',
    [[14, 12]],
    (p) => {
      p.r(0, 0, 14, 12, '#2a3358');
      p.r(1, 1, 12, 10, '#ffffff');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const k = Math.floor(t * 3) % 4;
        p.r(2 + (k % 2) * 5, 2 + Math.floor(k / 2) * 4, 5, 4, '#59c08a');
      },
      noFlip: true,
    },
  ),
  ent('br-cookie', [[11, 11]], (p) => {
    p.disc(5, 5, 5, '#e6a23c');
    p.p(3, 3, '#55607a');
    p.p(7, 4, '#55607a');
    p.p(4, 7, '#55607a');
    p.p(7, 7, '#55607a');
  }),
  ent('br-canvas', [[16, 12]], (p) => {
    p.r(0, 0, 16, 12, '#2a3358');
    p.r(1, 1, 14, 10, '#ffffff');
    p.disc(5, 6, 3, '#d0605e');
    p.r(9, 4, 4, 4, '#5b8ee6');
  }),
  ent('br-devtools', [[18, 12]], (p) => {
    p.r(0, 0, 18, 12, '#2a3358');
    p.r(1, 1, 16, 10, '#1e2236');
    p.r(2, 3, 6, 1, '#59c08a');
    p.r(4, 5, 8, 1, '#5b8ee6');
    p.r(4, 7, 10, 1, '#e6a23c');
  }),
];
export const BROWSER = mix('br', BROWSER_BESPOKE, APPLICATION);
export const BROWSER_ANCHORS: EntityDef[] = [
  ent('br-viewport', [[54, 40]], (p) => {
    p.r(2, 2, 52, 38, '#3a4a8a');
    p.r(0, 0, 52, 38, '#2a3358');
    p.r(1, 1, 50, 4, '#c8d0e6');
    p.r(2, 1, 14, 4, '#ffffff');
    p.r(1, 5, 50, 32, '#ffffff');
    p.r(3, 7, 28, 12, '#5b8ee6');
    p.r(33, 7, 16, 28, '#e9e6dc');
    for (let y = 21; y < 35; y += 3) p.r(3, y, 26, 2, '#dfe6f6');
  }),
];

// =============================================================================================
// Zone B — Expanded Runtime & Libraries: AST/Bytecode, JIT, Dynamic Linker

export const BYTECODE_BESPOKE: EntityDef[] = [
  ent('bc-ast', [[18, 15]], (p) => {
    p.r(7, 0, 4, 3, '#ffcc33');
    p.l(9, 3, 4, 7, '#9999cc');
    p.l(9, 3, 14, 7, '#9999cc');
    p.r(2, 7, 4, 3, '#ff9933');
    p.r(12, 7, 4, 3, '#66cc99');
    p.l(4, 10, 2, 13, '#6666cc');
    p.l(4, 10, 7, 13, '#6666cc');
    p.r(1, 12, 3, 3, '#ffff99');
    p.r(6, 12, 3, 3, '#99ccff');
  }),
  ent('bc-token', [[22, 8]], (p) => {
    const cols = ['#ffcc33', '#66cc99', '#99ccff', '#ff9999'];
    for (let k = 0; k < 4; k++) {
      p.box(k * 5 + 1, 1, 5, 6, cols[k]!, '#333366');
    }
  }),
  ent('bc-constpool', [[16, 14]], (p) => {
    p.box(0, 0, 16, 14, '#000033', '#9999cc');
    for (let k = 0; k < 4; k++) p.r(2, 2 + k * 3, 6 + (k % 2) * 5, 2, k === 1 ? '#ffcc33' : '#6699cc');
  }),
  ent('bc-lexer', [[20, 9]], (p) => {
    p.box(0, 0, 20, 9, '#000033', '#ffcc33');
    p.r(2, 3, 3, 3, '#66cc99');
    p.r(7, 3, 4, 3, '#ff9933');
    p.r(13, 3, 5, 3, '#99ccff');
  }),
  ent('bc-cfg', [[16, 14]], (p) => {
    p.box(5, 0, 6, 4, '#000033', '#ffcc33');
    p.l(8, 4, 4, 9, '#9999cc');
    p.l(8, 4, 12, 9, '#9999cc');
    p.box(1, 9, 6, 5, '#000033', '#66cc99');
    p.box(9, 9, 6, 5, '#000033', '#ff9999');
  }),
];
export const BYTECODE = mix('bc', BYTECODE_BESPOKE, RUNTIME);
export const BYTECODE_ANCHORS: EntityDef[] = [
  ent('bc-parsetree', [[52, 46]], (p) => {
    p.box(20, 0, 12, 6, '#ffcc33', '#666699');
    p.l(26, 6, 12, 16, '#9999cc');
    p.l(26, 6, 40, 16, '#9999cc');
    p.box(6, 16, 12, 6, '#ff9933', '#666699');
    p.box(34, 16, 12, 6, '#66cc99', '#666699');
    p.l(12, 22, 6, 34, '#6666cc');
    p.l(12, 22, 18, 34, '#6666cc');
    p.l(40, 22, 34, 34, '#6666cc');
    p.l(40, 22, 46, 34, '#6666cc');
    for (const x of [2, 14, 30, 42]) p.box(x, 34, 8, 8, '#000033', '#ffff99');
  }),
];

export const JIT_BESPOKE: EntityDef[] = [
  ent(
    'jit-ic',
    [[18, 10]],
    (p) => {
      p.box(0, 0, 18, 10, '#000033', '#ff9933');
      p.r(2, 2, 14, 2, '#666699');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const hit = Math.floor(t * 4) % 3;
        p.r(2 + hit * 5, 5, 4, 3, '#ffcc33');
      },
      noFlip: true,
    },
  ),
  ent('jit-deopt', [[16, 12]], (p) => {
    p.r(0, 0, 16, 3, '#ff6633');
    p.r(0, 3, 16, 9, '#333366');
    p.l(3, 5, 12, 10, '#ffff66');
    p.l(12, 5, 3, 10, '#ffff66');
  }),
  ent('jit-profile', [[18, 12]], (p) => {
    p.box(0, 0, 18, 12, '#000033', '#9999cc');
    const hs = [3, 6, 8, 5];
    hs.forEach((h, k) => p.r(2 + k * 4, 10 - h, 3, h, h >= 7 ? '#ff6633' : '#ffcc33'));
  }),
  ent('jit-osr', [[18, 10]], (p) => {
    p.r(0, 4, 7, 2, '#6699cc');
    p.r(7, 1, 4, 8, '#ff6633');
    p.r(11, 4, 7, 2, '#ffff66');
  }),
  ent('jit-guard', [[14, 13]], (p) => {
    p.r(2, 0, 10, 8, '#ff9933');
    p.r(3, 1, 8, 6, '#330033');
    p.r(4, 8, 6, 3, '#ff9933');
    p.r(6, 11, 2, 2, '#ffff66');
    p.r(5, 3, 4, 2, '#ffff66');
  }),
];
export const JIT = mix('jit', JIT_BESPOKE, RUNTIME);
export const JIT_ANCHORS: EntityDef[] = [
  ent(
    'jit-forge',
    [[48, 44]],
    (p) => {
      p.r(4, 16, 40, 28, '#333366');
      p.r(6, 18, 36, 2, '#9999cc');
      p.r(12, 24, 24, 16, '#000033');
      p.r(16, 8, 16, 8, '#ff6633');
      p.r(18, 8, 12, 2, '#ffcc33');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        for (let k = 0; k < 5; k++) {
          const fh = 4 + R((Math.sin(t * 7 + k * 1.5) * 0.5 + 0.5) * 8);
          p.r(14 + k * 4, 40 - fh, 3, fh, k % 2 ? '#ff6633' : '#ffff66');
        }
      },
      noFlip: true,
    },
  ),
];

export const LINKER_BESPOKE: EntityDef[] = [
  ent('ld-elf', [[18, 12]], (p) => {
    p.box(0, 0, 18, 12, '#000000', '#aaaaaa');
    p.r(1, 1, 16, 3, '#0055aa');
    p.r(2, 5, 6, 2, '#ffff55');
    p.r(2, 8, 12, 2, '#555555');
  }),
  ent('ld-plt', [[20, 12]], (p) => {
    p.box(0, 0, 8, 12, '#000000', '#aaaaaa');
    p.box(12, 0, 8, 12, '#000000', '#ffff55');
    p.l(8, 3, 12, 8, '#ffaa55');
    p.l(8, 8, 12, 3, '#55aaaa');
  }),
  ent('ld-reloc', [[18, 10]], (p) => {
    p.r(0, 4, 18, 2, '#aaaaaa');
    p.r(2, 1, 4, 8, '#ffff55');
    p.r(12, 1, 4, 8, '#aa5500');
  }),
];
export const LINKER = mix('ld', LINKER_BESPOKE, LIBRARIES);
export const LINKER_ANCHORS: EntityDef[] = [
  ent('ld-switchboard', [[50, 44]], (p) => {
    p.box(0, 0, 50, 44, '#000000', '#aaaaaa');
    for (let r = 0; r < 5; r++) {
      p.r(4, 5 + r * 7, 14, 4, '#555555');
      p.r(32, 5 + r * 7, 14, 4, '#aa5500');
      p.l(18, 7 + r * 7, 32, 7 + ((r + 2) % 5) * 7, r % 2 ? '#ffff55' : '#ffaa55');
    }
  }),
];

// =============================================================================================
// Zone C & D — Expanded OS Kernel (Entry & Arch) + PCIe/DMA Bus Fabric

export const KERNEL_ENTRY_BESPOKE: EntityDef[] = [
  ent('ke-seccomp', [[16, 13]], (p) => {
    p.box(0, 0, 16, 13, '#000000', '#55ffff');
    p.r(3, 3, 10, 2, '#55ff55');
    p.r(3, 6, 7, 2, '#ffff55');
    p.r(3, 9, 4, 2, '#ff5555');
  }),
  ent('ke-uaccess', [[22, 10]], (p) => {
    p.r(0, 0, 9, 10, '#0000aa');
    p.r(13, 0, 9, 10, '#555555');
    p.r(9, 4, 4, 2, '#ffff55');
  }),
  ent('ke-sysgate', [[18, 14]], (p) => {
    p.r(0, 0, 3, 14, '#aaaaaa');
    p.r(15, 0, 3, 14, '#aaaaaa');
    p.r(0, 0, 18, 3, '#55ffff');
    p.r(4, 6, 10, 2, '#ffff55');
  }),
];
export const KERNEL_ENTRY = mix('ke', KERNEL_ENTRY_BESPOKE, KERNEL);
export const KERNEL_ENTRY_ANCHORS: EntityDef[] = [
  ent('ke-gatehouse', [[52, 42]], (p) => {
    p.r(0, 0, 52, 6, '#aaaaaa');
    p.r(0, 6, 10, 36, '#555555');
    p.r(42, 6, 10, 36, '#555555');
    p.r(10, 6, 32, 36, '#000000');
    for (let x = 14; x < 39; x += 5) p.r(x, 6, 1, 24, '#55ffff');
    p.r(10, 28, 32, 2, '#ffff55');
  }),
];

export const KERNEL_ARCH_BESPOKE: EntityDef[] = [
  ent('ka-apic', [[16, 14]], (p) => {
    p.box(0, 0, 16, 14, '#000000', '#ff5555');
    for (let k = 0; k < 4; k++) p.r(2 + k * 3, 3, 2, 8, k % 2 ? '#ffff55' : '#aa0000');
  }),
  ent('ka-idt', [[18, 14]], (p) => {
    p.box(0, 0, 18, 14, '#000000', '#aaaaaa');
    for (let r = 0; r < 4; r++) p.r(2, 2 + r * 3, 14, 2, r === 0 ? '#ff5555' : '#aa5500');
  }),
  ent('ka-cr3', [[16, 10]], (p) => {
    p.box(0, 0, 16, 10, '#000000', '#ffff55');
    p.r(2, 3, 12, 4, '#aa0000');
    p.r(4, 4, 8, 2, '#ffffff');
  }),
];
export const KERNEL_ARCH = mix('ka', KERNEL_ARCH_BESPOKE, KERNEL);
export const KERNEL_ARCH_ANCHORS: EntityDef[] = [
  ent('ka-apicbank', [[50, 42]], (p) => {
    p.box(0, 0, 50, 42, '#000000', '#ff5555');
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 6; c++) p.r(4 + c * 7, 5 + r * 8, 5, 5, (r + c) % 3 === 0 ? '#ffff55' : '#aa0000');
  }),
];

export const BUS_FABRIC_BESPOKE: EntityDef[] = [
  ent('bf-crossbar', [[20, 14]], (p) => {
    p.frame(0, 0, 20, 14, '#ff55ff');
    for (let y = 3; y < 12; y += 3) p.r(1, y, 18, 1, '#55ffff');
    for (let x = 4; x < 18; x += 4) p.r(x, 1, 1, 12, '#ffffff');
  }),
  ent('bf-dmaring', [[16, 16]], (p) => {
    p.ring(8, 8, 6, '#ff55ff');
    p.ring(8, 8, 3, '#55ffff');
    p.r(7, 7, 3, 3, '#ffffff');
  }),
  ent('bf-mmio', [[22, 9]], (p) => {
    p.box(0, 0, 22, 9, '#000000', '#ffffff');
    for (let k = 0; k < 5; k++) p.r(2 + k * 4, 2, 2, 5, k % 2 ? '#ff55ff' : '#55ffff');
  }),
];
export const BUS_FABRIC = mix('bf', BUS_FABRIC_BESPOKE, DRIVERS);
export const BUS_FABRIC_ANCHORS: EntityDef[] = [
  ent('bf-pcieswitch', [[56, 40]], (p) => {
    p.box(0, 0, 56, 40, '#000000', '#ff55ff');
    for (let y = 6; y < 36; y += 6) p.r(2, y, 52, 2, y % 12 === 0 ? '#55ffff' : '#ffffff');
    p.box(18, 10, 20, 20, '#000000', '#ffffff');
    p.r(22, 14, 12, 12, '#ff55ff');
  }),
];

// =============================================================================================
// Zone E — Expanded Hidden Rings: VMM, EPT, SMRAM, ME MINIX 3

export const VMM_BESPOKE: EntityDef[] = [
  ent('vmm-virtio', [[20, 10]], (p) => {
    p.frame(0, 0, 20, 10, '#aaaaaa');
    p.ring(5, 5, 3, '#ffffff');
    p.ring(14, 5, 3, '#ffffff');
    p.r(8, 4, 4, 2, '#555555');
  }),
  ent('vmm-ghostcard', [[22, 12]], (p) => {
    p.frame(0, 0, 22, 9, '#aaaaaa');
    p.frame(3, 2, 8, 5, '#555555');
    for (let x = 2; x < 20; x += 3) p.r(x, 9, 1, 3, '#aaaaaa');
  }),
];
export const VMM = mix('vmm', VMM_BESPOKE, RING1);
export const VMM_ANCHORS: EntityDef[] = [
  ent('vmm-qemu', [[50, 38]], (p) => {
    p.frame(0, 0, 50, 38, '#ffffff');
    p.frame(3, 3, 20, 14, '#aaaaaa');
    p.frame(27, 3, 20, 14, '#aaaaaa');
    p.frame(3, 21, 44, 14, '#555555');
    p.r(6, 25, 38, 2, '#aaaaaa');
  }),
];

export const EPT_BESPOKE: EntityDef[] = [
  ent('ept-grid', [[18, 14]], (p) => {
    p.frame(0, 0, 18, 14, '#aaaaaa');
    for (let x = 4; x < 16; x += 4) p.r(x, 1, 1, 12, '#555555');
    for (let y = 4; y < 12; y += 4) p.r(1, y, 16, 1, '#555555');
    p.r(5, 5, 3, 3, '#ffffff');
  }),
  ent('ept-vtd', [[16, 12]], (p) => {
    p.box(0, 0, 16, 12, '#000000', '#ffffff');
    for (let x = 3; x < 14; x += 3) p.r(x, 1, 1, 10, '#aaaaaa');
  }),
];
export const EPT = mix('ept', EPT_BESPOKE, RING1);
export const EPT_ANCHORS: EntityDef[] = [
  ent('ept-matrix', [[50, 40]], (p) => {
    p.box(0, 0, 20, 40, '#000000', '#aaaaaa');
    p.box(30, 0, 20, 40, '#000000', '#ffffff');
    for (let r = 0; r < 5; r++) p.l(20, 5 + r * 7, 30, 5 + ((r * 3) % 5) * 7, '#ffffff');
  }),
];

export const SMRAM_BESPOKE: EntityDef[] = [
  ent('sm-dlck', [[16, 14]], (p) => {
    p.box(0, 0, 16, 14, '#404040', '#c0c0c0');
    p.r(5, 3, 6, 3, '#ffffff');
    p.r(4, 6, 8, 6, '#808080');
    p.r(7, 8, 2, 2, '#000000');
  }),
  ent('sm-savestate', [[20, 12]], (p) => {
    p.box(0, 0, 20, 12, '#000000', '#808080');
    for (let r = 0; r < 4; r++) p.r(2, 2 + r * 2, 14, 1, r === 0 ? '#ffffff' : '#808080');
  }),
];
export const SMRAM = mix('sm', SMRAM_BESPOKE, RING2);
export const SMRAM_ANCHORS: EntityDef[] = [
  ent('sm-vaultdoor', [[48, 44]], (p) => {
    p.box(0, 0, 48, 44, '#404040', '#c0c0c0');
    p.disc(24, 22, 14, '#808080');
    p.disc(24, 22, 10, '#000000');
    p.r(22, 12, 4, 20, '#ffffff');
    p.r(14, 20, 20, 4, '#ffffff');
  }),
];

export const ME_MINIX_USER_BESPOKE: EntityDef[] = [
  ent('mx-amt', [[18, 12]], (p) => {
    p.box(0, 0, 18, 12, '#000000', '#ffffff');
    p.r(1, 1, 16, 3, '#aaaaaa');
    p.r(3, 6, 12, 2, '#ffffff');
    p.r(3, 9, 8, 1, '#555555');
  }),
  ent('mx-tinycity', [[22, 14]], (p) => {
    p.r(1, 4, 5, 10, '#aaaaaa');
    p.r(7, 1, 6, 13, '#ffffff');
    p.r(14, 5, 6, 9, '#aaaaaa');
    p.p(9, 4, '#000000');
    p.p(11, 7, '#000000');
  }),
  ent('mx-rs', [[14, 10]], (p) => {
    p.box(0, 0, 14, 10, '#000000', '#aaaaaa');
    p.r(2, 3, 4, 4, '#ffffff');
    p.r(8, 3, 4, 4, '#555555');
  }),
];
export const ME_MINIX_USER = mix('mx', ME_MINIX_USER_BESPOKE, USERSPACE);
export const ME_MINIX_USER_ANCHORS: EntityDef[] = [
  ent('mx-bottle', [[46, 44]], (p) => {
    p.frame(4, 6, 38, 38, '#ffffff');
    p.r(15, 0, 16, 6, '#aaaaaa');
    p.r(8, 22, 8, 20, '#555555');
    p.r(18, 14, 10, 28, '#aaaaaa');
    p.r(30, 26, 8, 16, '#555555');
    for (let y = 17; y < 38; y += 4) p.r(20, y, 2, 2, '#ffffff');
  }),
];

export const ME_MINIX_KERN_BESPOKE: EntityDef[] = [
  ent('mk-ipc', [[22, 10]], (p) => {
    p.box(0, 2, 6, 6, '#000000', '#ffffff');
    p.box(16, 2, 6, 6, '#000000', '#ffffff');
    p.r(6, 4, 10, 2, '#aaaaaa');
  }),
  ent('mk-arc', [[14, 14]], (p) => {
    p.box(2, 2, 10, 10, '#000000', '#ffffff');
    for (let k = 3; k < 11; k += 2) {
      p.p(k, 0, '#aaaaaa');
      p.p(k, 13, '#aaaaaa');
      p.p(0, k, '#aaaaaa');
      p.p(13, k, '#aaaaaa');
    }
    p.r(5, 5, 4, 4, '#aaaaaa');
  }),
];
export const ME_MINIX_KERN = mix('mk', ME_MINIX_KERN_BESPOKE, FIRMWARE);
export const ME_MINIX_KERN_ANCHORS: EntityDef[] = [
  ent('mk-microkern', [[48, 38]], (p) => {
    p.box(16, 12, 16, 14, '#000000', '#ffffff');
    p.r(20, 16, 8, 6, '#aaaaaa');
    for (const [x, y] of [[2, 2], [36, 2], [2, 26], [36, 26]] as const) {
      p.box(x, y, 10, 10, '#000000', '#aaaaaa');
      p.l(x + 5, y + 5, 24, 19, '#555555');
    }
  }),
];

// =============================================================================================
// Zone F — Deep Silicon, Lithography & Fundamental Physics (Bespoke + 1-bit/wafer remixes)

export const UARCH_BESPOKE: EntityDef[] = [
  ent('ua-rob', [[22, 10]], (p) => {
    p.box(0, 0, 22, 10, '#000000', '#ffffff');
    for (let k = 0; k < 5; k++) p.r(2 + k * 4, 2, 3, 6, k < 3 ? '#aaaaaa' : '#555555');
  }),
  ent('ua-bpred', [[20, 14]], (p) => {
    p.r(0, 6, 7, 2, '#ffffff');
    p.l(7, 6, 18, 2, '#ffffff');
    p.l(7, 7, 18, 11, '#555555');
    p.r(17, 1, 3, 3, '#ffffff');
    p.r(17, 10, 3, 3, '#555555');
  }),
  ent('ua-l1', [[16, 12]], (p) => {
    p.box(0, 0, 16, 12, '#000000', '#aaaaaa');
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 4; c++) p.r(2 + c * 3, 2 + r * 3, 2, 2, (r + c) % 2 ? '#ffffff' : '#555555');
  }),
  ent('ua-alu', [[14, 14]], (p) => {
    p.l(0, 0, 13, 4, '#ffffff');
    p.l(13, 4, 13, 10, '#ffffff');
    p.l(13, 10, 0, 13, '#ffffff');
    p.l(0, 0, 0, 5, '#ffffff');
    p.l(0, 5, 4, 7, '#aaaaaa');
    p.l(4, 7, 0, 9, '#aaaaaa');
    p.l(0, 9, 0, 13, '#ffffff');
  }),
];
export const UARCH = mix('ua', UARCH_BESPOKE, RING3);
export const UARCH_ANCHORS: EntityDef[] = [
  ent('ua-pipeline', [[56, 36]], (p) => {
    for (let s = 0; s < 4; s++) {
      p.box(2 + s * 14, 6, 11, 24, '#000000', s === 2 ? '#ffffff' : '#aaaaaa');
      if (s < 3) p.r(13 + s * 14, 17, 3, 2, '#ffffff');
    }
  }),
];

export const RTL_BESPOKE: EntityDef[] = [
  ent('rtl-nand', [[16, 10]], (p) => {
    p.r(0, 2, 3, 1, '#ffffff');
    p.r(0, 7, 3, 1, '#ffffff');
    p.r(3, 1, 7, 8, '#aaaaaa');
    p.r(4, 2, 5, 6, '#000000');
    p.ring(11, 5, 1, '#ffffff');
    p.r(13, 5, 3, 1, '#ffffff');
  }),
  ent('rtl-dff', [[14, 14]], (p) => {
    p.box(2, 0, 10, 14, '#000000', '#ffffff');
    p.r(0, 3, 2, 1, '#aaaaaa');
    p.r(12, 3, 2, 1, '#ffffff');
    p.l(2, 10, 5, 11, '#aaaaaa');
    p.l(5, 11, 2, 12, '#aaaaaa');
  }),
  ent(
    'rtl-wave',
    [[22, 9]],
    (p) => {
      p.frame(0, 0, 22, 9, '#555555');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const ph = Math.floor(t * 6);
        for (let x = 2; x < 20; x++) {
          const hi = ((x + ph) >> 2) % 2 === 0;
          p.p(x, hi ? 2 : 6, '#ffffff');
        }
      },
      noFlip: true,
    },
  ),
];
export const RTL = mix('rtl', RTL_BESPOKE, RING3);
export const RTL_ANCHORS: EntityDef[] = [
  ent('rtl-htree', [[50, 44]], (p) => {
    p.r(24, 6, 2, 32, '#ffffff');
    p.r(8, 6, 34, 2, '#aaaaaa');
    p.r(8, 36, 34, 2, '#aaaaaa');
    for (const [x, y] of [[8, 2], [40, 2], [8, 32], [40, 32]] as const) {
      p.r(x, y, 2, 10, '#ffffff');
      p.r(x - 4, y, 10, 2, '#555555');
      p.r(x - 4, y + 8, 10, 2, '#555555');
    }
  }),
];

export const CMOS_BESPOKE: EntityDef[] = [
  ent('cm-finfet', [[18, 14]], (p) => {
    p.r(2, 2, 14, 10, '#24989c');
    p.r(7, 0, 4, 14, '#9448d4');
    p.r(3, 5, 3, 4, '#e88438');
    p.r(12, 5, 3, 4, '#e88438');
    p.p(4, 6, '#ffffff');
    p.p(13, 6, '#ffffff');
  }),
  ent('cm-via', [[14, 12]], (p) => {
    p.r(0, 4, 14, 4, '#e88438');
    p.r(5, 0, 4, 12, '#9448d4');
    p.r(6, 5, 2, 2, '#ffffff');
  }),
  ent('cm-well', [[20, 12]], (p) => {
    p.frame(0, 0, 20, 12, '#24989c');
    p.r(2, 2, 7, 8, '#9448d4');
    p.r(11, 2, 7, 8, '#e88438');
  }),
];
export const CMOS = mix('cm', CMOS_BESPOKE, RING3);
export const CMOS_ANCHORS: EntityDef[] = [
  ent('cm-viatower', [[52, 42]], (p) => {
    for (let y = 4; y < 38; y += 8) p.r(2, y, 48, 3, '#e88438');
    for (let x = 8; x < 46; x += 12) {
      p.r(x, 2, 4, 38, '#9448d4');
      for (let y = 5; y < 38; y += 8) p.r(x + 1, y, 2, 2, '#ffffff');
    }
  }),
];

export const LITHO_BESPOKE: EntityDef[] = [
  ent('li-fringe', [[17, 17]], (p) => {
    p.ring(8, 8, 7, '#555555');
    p.ring(8, 8, 4, '#aaaaaa');
    p.disc(8, 8, 1, '#ffffff');
  }),
  ent('li-lattice', [[18, 14]], (p) => {
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 4; c++) {
        const x = 2 + c * 4 + (r % 2 ? 2 : 0);
        const y = 2 + r * 5;
        p.r(x, y, 2, 2, r === 1 && c === 2 ? '#ffffff' : '#aaaaaa');
      }
  }),
  ent('li-dopant', [[13, 13]], (p) => {
    p.ring(6, 6, 5, '#555555');
    p.disc(6, 6, 2, '#ffffff');
  }),
];
export const LITHO = mix('li', LITHO_BESPOKE, RING3);
export const LITHO_ANCHORS: EntityDef[] = [
  ent('li-reticle', [[48, 48]], (p) => {
    p.ring(24, 24, 21, '#555555');
    p.ring(24, 24, 15, '#aaaaaa');
    p.ring(24, 24, 9, '#ffffff');
    p.r(23, 2, 2, 44, '#555555');
    p.r(2, 23, 44, 2, '#555555');
  }),
];

export const BANDGAP_BESPOKE: EntityDef[] = [
  ent('bg-band', [[24, 12]], (p) => {
    p.r(0, 1, 24, 3, '#aaaaaa');
    p.r(0, 8, 24, 3, '#555555');
    p.p(10, 5, '#ffffff');
    p.p(14, 6, '#ffffff');
  }),
  ent(
    'bg-tunnel',
    [[20, 12]],
    (p) => {
      p.r(9, 0, 2, 12, '#aaaaaa');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const x = Math.floor(mod(t * 7, 18));
        p.r(x, 5, 2, 2, x > 10 ? '#ffffff' : '#aaaaaa');
      },
      noFlip: true,
    },
  ),
  ent('bg-wave', [[20, 10]], (p) => {
    for (let x = 0; x < 20; x++) p.p(x, 5 + R(Math.sin(x * 0.6) * 3), '#ffffff');
  }),
];
export const BANDGAP = mix('bg', BANDGAP_BESPOKE, RING3);
export const BANDGAP_ANCHORS: EntityDef[] = [
  ent('bg-diagram', [[52, 40]], (p) => {
    p.r(0, 4, 52, 8, '#555555');
    p.r(0, 28, 52, 8, '#aaaaaa');
    for (let x = 6; x < 48; x += 10) {
      p.l(x, 12, x, 28, '#555555');
      p.r(x - 1, 18, 3, 3, '#ffffff');
    }
  }),
];

export const LANDAUER_BESPOKE: EntityDef[] = [
  ent(
    'la-ray',
    [[18, 18]],
    (p) => {
      p.p(9, 9, '#555555');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        if (mod(t * 0.5, 1) < 0.25) {
          p.l(1, 1, 16, 16, '#ffffff');
          p.r(8, 8, 3, 3, '#ffffff');
        }
      },
    },
  ),
  ent('la-entropy', [[15, 15]], (p) => {
    p.ring(7, 7, 6, '#555555');
    p.p(7, 7, '#ffffff');
  }),
  ent('la-spark', [[11, 11]], (p) => {
    p.p(5, 5, '#ffffff');
    p.p(5, 3, '#555555');
    p.p(5, 7, '#555555');
    p.p(3, 5, '#555555');
    p.p(7, 5, '#555555');
  }),
];
export const LANDAUER = mix('la', LANDAUER_BESPOKE, RING3);
export const LANDAUER_ANCHORS: EntityDef[] = [
  ent(
    'la-horizon',
    [[48, 36]],
    (p) => {
      p.r(0, 18, 48, 1, '#555555');
      p.ring(24, 18, 12, '#555555');
      p.ring(24, 18, 6, '#aaaaaa');
    },
    {
      anim: (p, _w, _h, _v, t) => {
        const a = t * 0.9;
        p.r(24 + R(Math.cos(a) * 6), 18 + R(Math.sin(a) * 6), 2, 2, '#ffffff');
      },
      noFlip: true,
    },
  ),
];
