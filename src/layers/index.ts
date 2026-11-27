import type { LayerId } from '../core/layers';
import type { LayerArt } from './types';
import { internet } from './internet';
import { browser } from './browser';
import { application } from './application';
import { bytecode } from './bytecode';
import { jit } from './jit';
import { runtime } from './runtime';
import { libraries } from './libraries';
import { linker } from './linker';
import { userspace } from './userspace';
import { kernelEntry } from './kernel-entry';
import { kernel } from './kernel';
import { kernelArch } from './kernel-arch';
import { drivers } from './drivers';
import { busFabric } from './bus-fabric';
import { firmware } from './firmware';
import { vmm } from './vmm';
import { ringMinus1 } from './ring-1';
import { ept } from './ept';
import { ringMinus2 } from './ring-2';
import { smram } from './smram';
import { ringMinus3 } from './ring-3';
import { meMinixUser } from './me-minix-user';
import { meMinixKern } from './me-minix-kern';
import { uarch } from './uarch';
import { rtl } from './rtl';
import { cmos } from './cmos';
import { litho } from './litho';
import { bandgap } from './bandgap';
import { landauer } from './landauer';
import { slabSpa } from './slab-spa';
import { kthreadKabin } from './kthread-kabin';

/** Every layer's presentation in one object each. Typed over every LayerId: a layer without a module is a compile error. */
export const LAYER_ART: Record<LayerId, LayerArt> = {
  internet,
  browser,
  application,
  bytecode,
  jit,
  runtime,
  libraries,
  linker,
  userspace,
  'kernel-entry': kernelEntry,
  kernel,
  'kernel-arch': kernelArch,
  drivers,
  'bus-fabric': busFabric,
  firmware,
  vmm,
  'ring-1': ringMinus1,
  ept,
  'ring-2': ringMinus2,
  smram,
  'ring-3': ringMinus3,
  'me-minix-user': meMinixUser,
  'me-minix-kern': meMinixKern,
  uarch,
  rtl,
  cmos,
  litho,
  bandgap,
  landauer,
  'slab-spa': slabSpa,
  'kthread-kabin': kthreadKabin,
};
