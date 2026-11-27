import { describe, expect, it } from 'vitest';
import { ALL_LAYER_IDS } from '../core/layers';
import { entryForCritter } from '../game/manual';
import { Collectibles } from './collectibles';

const critterLayer = ALL_LAYER_IDS.find((l) => entryForCritter(l));
const prop = { x: 100, y: 100, w: 20, h: 20, entryId: 'some-prop', layer: 'application' as const };

describe('Collectibles', () => {
  it('finds a prop under the point, with 2 px of slack, and nothing elsewhere', () => {
    const c = new Collectibles();
    c.addProp({ manual: prop });
    expect(c.hit(110, 110)).toBe(prop);
    expect(c.hit(98, 98)).toBe(prop);
    expect(c.hit(97, 110)).toBeUndefined();
    expect(c.hit(300, 300)).toBeUndefined();
  });

  it('prefers the last-drawn prop where two overlap', () => {
    const c = new Collectibles();
    const top = { ...prop, entryId: 'top' };
    c.addProp({ manual: prop });
    c.addProp({ manual: top });
    expect(c.hit(110, 110)?.entryId).toBe('top');
  });

  it('prefers a critter over a prop it overlaps', () => {
    expect(critterLayer).toBeDefined();
    const c = new Collectibles();
    c.addProp({ manual: prop });
    c.addCritter({ x: 105, y: 105, w: 12, h: 11 }, critterLayer!);
    const hit = c.hit(110, 110);
    expect(hit?.entryId).toBe(entryForCritter(critterLayer!)!.entry.id);
    expect(hit).toMatchObject({ x: 105, y: 105, w: 12, h: 11, layer: critterLayer });
    // Off the critter, the prop is still there.
    expect(c.hit(101, 101)).toBe(prop);
  });

  it('hits nothing while blocked (the reveal vignette covers the world)', () => {
    const c = new Collectibles();
    c.addProp({ manual: prop });
    c.addCritter({ x: 105, y: 105, w: 12, h: 11 }, critterLayer!);
    expect(c.hit(110, 110, true)).toBeUndefined();
    expect(c.hit(110, 110, false)).toBeDefined();
  });

  it('keeps reaction boxes apart from clickable targets, and marks band boundaries', () => {
    const c = new Collectibles();
    c.addProp({ reaction: { x: 1, y: 2, w: 3, h: 4 } });
    const mark = c.mark();
    c.addProp({ reaction: { x: 5, y: 6, w: 7, h: 8 }, manual: prop });
    c.addProp({ manual: { ...prop, entryId: 'big' } });
    expect(c.reactionBoxes()).toHaveLength(2);
    expect(c.reactionBoxes(mark)).toEqual([{ x: 5, y: 6, w: 7, h: 8 }]);
    expect(c.targets()).toHaveLength(2);
  });

  it('beginFrame forgets everything', () => {
    const c = new Collectibles();
    c.addProp({ reaction: { x: 1, y: 2, w: 3, h: 4 }, manual: prop });
    c.addCritter({ x: 105, y: 105, w: 12, h: 11 }, critterLayer!);
    c.beginFrame();
    expect(c.reactionBoxes()).toHaveLength(0);
    expect(c.targets()).toHaveLength(0);
    expect(c.hit(110, 110)).toBeUndefined();
    expect(c.mark()).toBe(0);
  });

  it('picks reaction targets: distinct on-screen props in a seeded order, else a scatter of cells', () => {
    const c = new Collectibles();
    const a = { x: 10, y: 10, w: 8, h: 8 };
    const off = { x: -50, y: 10, w: 8, h: 8 };
    c.addProp({ reaction: a });
    c.addProp({ reaction: off });
    c.addProp({ reaction: { x: 30, y: 30, w: 8, h: 8 } });
    const picked = c.reactionTargets(7, 10, 200, 100);
    expect(picked).toHaveLength(2); // the off-screen one is skipped
    expect(picked).not.toContainEqual([-50, 10, 8, 8]);
    expect(c.reactionTargets(7, 10, 200, 100)).toEqual(picked); // seeded
    expect(c.reactionTargets(7, 1, 200, 100)).toHaveLength(1);
    c.beginFrame();
    const scatter = c.reactionTargets(7, 5, 200, 100);
    expect(scatter.length).toBeGreaterThan(0);
    for (const [x, y, w, h] of scatter) {
      expect([w, h]).toEqual([24, 20]);
      expect(x + w).toBeLessThanOrEqual(200);
      expect(y + h).toBeLessThanOrEqual(100);
    }
  });
});
