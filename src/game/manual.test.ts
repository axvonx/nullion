import { describe, expect, it } from 'vitest';
import {
  MANUAL_ENTRIES,
  MANUAL_RARITIES,
  ManualStore,
  entryForCritter,
  entryForEntity,
  entryForTopic,
} from './manual';
import { V4_LIBRARIES } from '../render/v4/libraries';
import { TOPIC_PROPS } from '../render/v4/topics';

describe('Field Manual registry & store', () => {
  it('has unique entry IDs, valid rarities, and every sighting exists in V4_LIBRARIES or TOPIC_PROPS', () => {
    const ids = new Set<string>();
    const topicIds = new Set(TOPIC_PROPS.map((p) => p.id));

    for (const entry of MANUAL_ENTRIES) {
      expect(ids.has(entry.id)).toBe(false);
      ids.add(entry.id);
      expect(MANUAL_RARITIES[entry.rarity]).toBeDefined();
      expect(entry.sightings.length).toBeGreaterThan(0);

      for (const s of entry.sightings) {
        if (s.entityId) {
          const lib = V4_LIBRARIES[s.layer];
          const found =
            lib.near.some((d) => d.id === s.entityId) || lib.anchors.some((d) => d.id === s.entityId);
          expect(found, `${entry.id}: entity '${s.entityId}' missing in V4_LIBRARIES['${s.layer}']`).toBe(true);
        }
        if (s.topicId) {
          expect(topicIds.has(s.topicId), `${entry.id}: topic '${s.topicId}' missing in TOPIC_PROPS`).toBe(true);
        }
      }
    }
  });

  it('tracks multi-layer sightings, defaults highest layer, manages unread glow, and supports debug unlock-all', () => {
    const store = new ManualStore(null);
    expect(store.foundCount()).toBe(0);
    expect(store.unreadCount()).toBe(0);

    // Log Small Ben in Ring -2 first, then in Application (higher layer).
    const first = store.log('small-ben', 'ring-2');
    expect(first).toEqual({ isNewEntry: true, isNewLayer: true });
    expect(store.isFound('small-ben')).toBe(true);
    expect(store.isUnread('small-ben')).toBe(true);
    expect(store.highestFoundLayer('small-ben')).toBe('ring-2');

    // Marking read clears unread glow.
    store.markRead('small-ben');
    expect(store.isUnread('small-ben')).toBe(false);

    // Spotting Small Ben in Application logs a new layer, re-lights unread, and promotes highestFoundLayer.
    const second = store.log('small-ben', 'application');
    expect(second).toEqual({ isNewEntry: false, isNewLayer: true });
    expect(store.isUnread('small-ben')).toBe(true);
    expect(store.highestFoundLayer('small-ben')).toBe('application');
    expect(store.foundLayers('small-ben')).toEqual(['application', 'ring-2']);

    // Duplicate sighting on an already-logged layer is a no-op.
    store.markRead('small-ben');
    const dup = store.log('small-ben', 'application');
    expect(dup).toEqual({ isNewEntry: false, isNewLayer: false });
    expect(store.isUnread('small-ben')).toBe(false);

    // Debug unlock-all reveals everything without mutating underlying discoveries.
    store.setDebugUnlockAll(true);
    expect(store.foundCount()).toBe(MANUAL_ENTRIES.length);
    expect(store.isFound('crit-mote')).toBe(true);
    store.setDebugUnlockAll(false);
    expect(store.foundCount()).toBe(1);
    expect(store.isFound('crit-mote')).toBe(false);
  });

  it('resolves entity, critter, and topic lookups cleanly', () => {
    expect(entryForEntity('r2-clocktower', 'ring-2')?.entry.id).toBe('small-ben');
    expect(entryForEntity('r3-ringosc', 'ring-3')?.entry.id).toBe('lock-ness');
    expect(entryForCritter('application')?.entry.id).toBe('crit-songbird');
    expect(entryForCritter('smram')?.entry.id).toBe('crit-ghost');
    expect(entryForTopic('tp-dsa-tree')?.entry.id).toBe('anom-bst');
  });
});
