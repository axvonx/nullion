import { describe, expect, it } from 'vitest';
import { RARITY_PERIOD, gateFor, presenceRate, shownRate, spawnsOn, GATED_APPEARANCES } from './rarity';
import { MANUAL_ENTRIES } from './manual';
import { V4_LIBRARIES } from '../render/v4/libraries';

describe('rarity gates', () => {
  it('common appearances spawn every day; the others hit their period within a few points over ten years', () => {
    for (let d = 1; d <= 400; d++) expect(spawnsOn(d, 'x', 'kernel', 'common')).toBe(true);
    for (const r of ['uncommon', 'rare', 'mythic'] as const) {
      const days = 3650;
      let on = 0;
      for (let d = 1; d <= days; d++) if (spawnsOn(d, 'some-entry', 'firmware', r)) on++;
      expect(Math.abs(on / days - 1 / RARITY_PERIOD[r]), `${r}: ${on}/${days}`).toBeLessThan(0.03);
    }
  });

  it('is deterministic and independent per (entry, layer)', () => {
    const a = Array.from({ length: 60 }, (_, d) => spawnsOn(d, 'lock-ness', 'userspace', 'uncommon'));
    const b = Array.from({ length: 60 }, (_, d) => spawnsOn(d, 'lock-ness', 'userspace', 'uncommon'));
    const c = Array.from({ length: 60 }, (_, d) => spawnsOn(d, 'lock-ness', 'firmware', 'uncommon'));
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
  });

  it('gates only scatter props: an anchor is a landmark and is always present', () => {
    expect(GATED_APPEARANCES.length).toBeGreaterThan(0);
    for (const g of GATED_APPEARANCES) {
      const lib = V4_LIBRARIES[g.layer];
      expect(lib.anchors.some((d) => d.id === g.entityId), `${g.entryId} gates anchor ${g.layer}:${g.entityId}`).toBe(false);
      expect(lib.near.some((d) => d.id === g.entityId), `${g.entryId}: ${g.layer}:${g.entityId} is not a scatter prop`).toBe(true);
    }
  });

  it('gateFor(seed) marks off-day appearances absent and on-day ones required', () => {
    const g = GATED_APPEARANCES[0]!;
    let sawOn = false;
    let sawOff = false;
    for (let d = 1; d <= 60; d++) {
      const gate = gateFor(d);
      const on = spawnsOn(d, g.entryId, g.layer, g.rarity);
      expect(gate.absent(g.layer, g.entityId)).toBe(!on);
      expect(gate.required(g.layer).includes(g.entityId)).toBe(on);
      if (on) sawOn = true;
      else sawOff = true;
    }
    expect(sawOn && sawOff).toBe(true);
  });

  it('presenceRate is the share of a fixed four-year window of days the appearance is on', () => {
    expect(presenceRate('anything', 'kernel', 'common')).toBe(1);
    const r = presenceRate('lock-ness', 'userspace', 'uncommon');
    expect(r).toBeGreaterThan(0.4);
    expect(r).toBeLessThan(0.6);
  });

  it('every appearance of every entry has an honest shown rate (or none): no critter entry claims a rarity it does not have', () => {
    for (const e of MANUAL_ENTRIES)
      for (const s of e.sightings) {
        const r = shownRate(e, s);
        if (s.topicId) expect(r).toBeUndefined();
        else expect(r, `${e.id} in ${s.layer}`).toBeGreaterThan(0);
      }
  });
});
