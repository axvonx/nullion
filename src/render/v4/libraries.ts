import { ALL_LAYER_IDS, type LayerId } from '../../core/layers';
import { LAYER_ART } from '../../layers';
import { buildLibraries, type LayerSpec } from './library';
import type { Library } from './place';
import type { TopicTag } from './topics';

/**
 * Every layer's v4 library across all 31 layers, built by one function (`buildLibraries`, library.ts) from each
 * layer's own spec (`LAYER_ART[id].library`: its entities, an optional borrow from a Daily layer, density) and its
 * default topic tags (`LAYER_TOPIC_TAGS`, which topics.ts flips question-reactive props by). The entities themselves live in the layer modules (src/layers/<layer-id>.ts).
 */
const specs = {} as Record<LayerId, LayerSpec>;
export const LAYER_TOPIC_TAGS = {} as Record<LayerId, readonly TopicTag[]>;
for (const id of ALL_LAYER_IDS) {
  specs[id] = LAYER_ART[id].library;
  LAYER_TOPIC_TAGS[id] = LAYER_ART[id].topicTags;
}

export const V4_LIBRARIES: Record<LayerId, Library> = buildLibraries(specs, LAYER_TOPIC_TAGS);
