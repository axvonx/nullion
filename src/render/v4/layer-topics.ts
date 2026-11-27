import type { LayerId } from '../../core/layers';
import type { TopicTag } from './topics';

/**
 * The default topic tags of every layer's entities (src/render/v4/topics.ts flips props whose tags meet the active
 * question's). Typed over every LayerId, so a new layer without tags is a compile error. An entity overrides its
 * layer's tags with `ent(..., { tags })`. Ids are never pattern-matched: the old prefix regexes went stale.
 */
export const LAYER_TOPIC_TAGS: Record<LayerId, readonly TopicTag[]> = {
  // Zone A: above Application
  internet: ['networking', 'security', 'graph'],
  browser: ['languages', 'graphics', 'networking'],
  application: ['languages', 'graphics', 'dsa'],
  // Zone B: runtime and libraries
  bytecode: ['languages', 'dsa', 'concurrency'],
  jit: ['languages', 'hardware', 'math'],
  runtime: ['languages', 'dsa', 'concurrency'],
  libraries: ['dsa', 'sorting', 'languages'],
  linker: ['languages', 'os', 'dsa'],
  // Zone C: userspace and kernel
  userspace: ['os', 'networking', 'concurrency'],
  'kernel-entry': ['os', 'security', 'hardware'],
  kernel: ['os', 'concurrency', 'hardware'],
  'kernel-arch': ['hardware', 'os', 'concurrency'],
  // Zone D: drivers, bus and firmware
  drivers: ['hardware', 'os', 'networking'],
  'bus-fabric': ['hardware', 'networking', 'graph'],
  firmware: ['hardware', 'security', 'os'],
  // Zone E: hidden rings
  vmm: ['os', 'security', 'hardware'],
  'ring-1': ['hardware', 'security', 'os'],
  ept: ['os', 'hardware', 'dsa'],
  'ring-2': ['hardware', 'security', 'os'],
  smram: ['security', 'hardware', 'os'],
  'ring-3': ['hardware', 'security', 'os'],
  'me-minix-user': ['os', 'security', 'networking'],
  'me-minix-kern': ['os', 'hardware', 'security'],
  // Zone F: silicon and physics
  uarch: ['hardware', 'math', 'concurrency'],
  rtl: ['hardware', 'languages', 'math'],
  cmos: ['hardware', 'math', 'graphics'],
  litho: ['hardware', 'math', 'graphics'],
  bandgap: ['hardware', 'math'],
  landauer: ['math', 'hardware'],
  // True Endless
  'slab-spa': ['os', 'dsa', 'hardware'],
  'kthread-kabin': ['os', 'concurrency', 'dsa'],
};
