import type { LayerId } from '../../core/layers';
import { DRIVERS, DRIVERS_ANCHORS, FIRMWARE, FIRMWARE_ANCHORS, RING1, RING1_ANCHORS, RING2, RING2_ANCHORS, RING3, RING3_ANCHORS } from './lib-lower';
import { KERNEL, KERNEL_ANCHORS, LIBRARIES, LIBRARIES_ANCHORS, USERSPACE, USERSPACE_ANCHORS } from './lib-mid';
import { APPLICATION, APPLICATION_ANCHORS, RUNTIME, RUNTIME_ANCHORS } from './lib-upper';
import type { Library } from './place';

/**
 * Every layer's v4 library: its entity types, its anchors, and how densely to scatter them.
 * Ring −3 stays sparse (the calm at the bottom); text-bearing types are rare by weight and capped at one per view.
 */
export const V4_LIBRARIES: Record<LayerId, Library> = {
  application: { near: APPLICATION, anchors: APPLICATION_ANCHORS, density: 6.0, anchorCount: 2, far: 0.5 },
  runtime: { near: RUNTIME, anchors: RUNTIME_ANCHORS, density: 6.0, anchorCount: 2, far: 0.5 },
  libraries: {
    near: LIBRARIES,
    anchors: LIBRARIES_ANCHORS,
    density: 5.6,
    anchorCount: 2,
    far: 0.45,
    floor: { offset: 4, ids: new Set(['lib-shelf', 'lib-cart', 'lib-ladder', 'lib-desk', 'lib-catalogue', 'lib-lectern', 'lib-barrel', 'lib-crates', 'lib-lamp']) },
  },
  userspace: {
    near: USERSPACE,
    anchors: USERSPACE_ANCHORS,
    density: 5.6,
    anchorCount: 2,
    far: 0.5,
    floor: { offset: 6, ids: new Set(['us-tower', 'us-dbus', 'us-mailbox', 'us-crontower', 'us-shm', 'us-signal', 'us-fork', 'us-zombie', 'us-container']) },
  },
  kernel: { near: KERNEL, anchors: KERNEL_ANCHORS, density: 5.6, anchorCount: 2, far: 0.45 },
  drivers: { near: DRIVERS, anchors: DRIVERS_ANCHORS, density: 6.0, anchorCount: 2, far: 0.45 },
  firmware: { near: FIRMWARE, anchors: FIRMWARE_ANCHORS, density: 5.6, anchorCount: 2, far: 0.45 },
  'ring-1': { near: RING1, anchors: RING1_ANCHORS, density: 5.2, anchorCount: 2, far: 0.45 },
  'ring-2': { near: RING2, anchors: RING2_ANCHORS, density: 5.6, anchorCount: 2, far: 0.45 },
  'ring-3': { near: RING3, anchors: RING3_ANCHORS, density: 2.4, anchorCount: 1, far: 0 },
};
