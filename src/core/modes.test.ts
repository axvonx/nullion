import { describe, expect, it } from 'vitest';
import type { StackMode } from './layers';
import { ANSWER_MS, ENDLESS_MAX_STRIKES, MODE_RULES, layerAt, layersFor, maxDepthFor, rulesFor } from './modes';

const MODES = Object.keys(MODE_RULES) as StackMode[];

describe('mode rules', () => {
  it('every mode keys its own rules and agrees with the stack accessors', () => {
    for (const m of MODES) {
      expect(rulesFor(m).id).toBe(m);
      expect(layersFor(m)).toBe(rulesFor(m).layers);
      expect(maxDepthFor(m)).toBe(rulesFor(m).maxDepth);
      expect(layerAt(0, m)).toBe(rulesFor(m).layers[0]);
    }
  });

  it('only daily persists, has no strikes and draws the fixed day', () => {
    expect(MODES.filter((m) => rulesFor(m).persistsDaily)).toEqual(['daily']);
    expect(rulesFor('daily')).toMatchObject({ maxStrikes: 0, promptSource: 'day', roundCounter: 'slots' });
    expect(rulesFor('daily').answerMs(5000)).toBe(ANSWER_MS);
    for (const m of ['endless', 'true-endless'] as const) {
      expect(rulesFor(m)).toMatchObject({ maxStrikes: ENDLESS_MAX_STRIKES, promptSource: 'pool', roundCounter: 'fuses' });
    }
  });

  it('share and end-card text come from the rules', () => {
    expect(rulesFor('daily').shareTitle(7)).toBe('nullion #7');
    expect(rulesFor('daily').puzzleChip(7)).toBe('#7');
    expect(rulesFor('daily').headline('9 frames', 'Kernel')).toBe('9 frames · Kernel');
    expect(rulesFor('true-endless').shareTitle(7)).toBe('nullion endless');
    expect(rulesFor('endless').headline('9 frames', 'Kernel')).toBe('KERNEL PANIC · 9 frames · Kernel');
    expect(rulesFor('endless').puzzleChip(7)).toBe('ENDLESS');
  });

  it('only true endless has the realm nav, forced scroll and no kernel rain', () => {
    expect(MODES.filter((m) => rulesFor(m).realmNav)).toEqual(['true-endless']);
    expect(MODES.filter((m) => rulesFor(m).forcesScrollMode)).toEqual(['true-endless']);
    expect(MODES.filter((m) => rulesFor(m).kernelLayerId === null)).toEqual(['true-endless']);
  });
});
