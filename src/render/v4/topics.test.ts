import { describe, expect, it } from 'vitest';
import { BANK_QUESTIONS } from '../../data/bank';
import { V4_LIBRARIES } from './libraries';
import { MIN_FLIP_H, MIN_FLIP_W, TOPIC_PROPS, TOPIC_TAGS, pickTopicFlip, tagsForEntity, tagsForQuestion } from './topics';

describe('many-to-many question & element topic tags', () => {
  it('maps every approved bank question to at least one valid TopicTag (many-to-many)', () => {
    let multiTagCount = 0;
    for (const q of BANK_QUESTIONS) {
      const tags = tagsForQuestion(q.id);
      expect(tags.length).toBeGreaterThanOrEqual(1);
      for (const t of tags) expect(TOPIC_TAGS).toContain(t);
      if (tags.length >= 2) multiTagCount++;
    }
    expect(multiTagCount).toBeGreaterThan(10);
    expect(tagsForQuestion('data-structure')).toContain('dsa');
    expect(tagsForQuestion('lock')).toContain('concurrency');
  });

  it('maps every v4 background entity across all 29 layers to valid TopicTags', () => {
    let total = 0;
    let multiTag = 0;
    for (const lib of Object.values(V4_LIBRARIES)) {
      for (const def of [...lib.near, ...lib.anchors]) {
        total++;
        const tags = tagsForEntity(def.id);
        expect(tags.length).toBeGreaterThanOrEqual(1);
        for (const t of tags) expect(TOPIC_TAGS).toContain(t);
        if (tags.length >= 2) multiTag++;
      }
    }
    expect(total).toBeGreaterThan(200);
    expect(multiTag).toBeGreaterThan(150);
  });

  it('provides at least one TopicProp for every TopicTag', () => {
    for (const tag of TOPIC_TAGS) {
      expect(TOPIC_PROPS.some((p) => p.tags.includes(tag))).toBe(true);
    }
  });

  it('never flips anchors or undersized props and flips a deterministic subset of eligible props', () => {
    const active = tagsForQuestion('data-structure');
    const anchor = { anchor: true, w: 40, h: 30, x: 100, y: 200, def: V4_LIBRARIES.application.anchors[0]! };
    expect(pickTopicFlip(anchor, active, 42)).toBeUndefined();

    const tiny = { anchor: false, w: MIN_FLIP_W - 2, h: MIN_FLIP_H, x: 100, y: 200, def: V4_LIBRARIES.application.near[0]! };
    expect(pickTopicFlip(tiny, active, 42)).toBeUndefined();

    // Sample 100 eligible near-plane placements: expect ~30–55% to flip deterministically.
    const def = V4_LIBRARIES.application.near[0]!;
    let flipped = 0;
    for (let i = 0; i < 100; i++) {
      const p1 = pickTopicFlip({ anchor: false, w: 24, h: 16, x: i * 17, y: i * 23, def }, active, 7);
      const p2 = pickTopicFlip({ anchor: false, w: 24, h: 16, x: i * 17, y: i * 23, def }, active, 7);
      expect(p1).toBe(p2);
      if (p1) {
        flipped++;
        expect(p1.tags.some((t) => active.includes(t))).toBe(true);
      }
    }
    expect(flipped).toBeGreaterThan(15);
    expect(flipped).toBeLessThan(75);
  });
});
