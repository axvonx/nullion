import { describe, expect, it } from 'vitest';
import type { StackMode } from './layers';
import { ANSWER_MS, ENDLESS_HEARTS, ENDLESS_KERNEL_DEPTH, MODE_RULES, layerAt, layersFor, maxDepthFor, rulesFor } from './modes';

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

  it('only daily persists the day, has no hearts and draws the fixed day', () => {
    expect(MODES.filter((m) => rulesFor(m).persistsDaily)).toEqual(['daily']);
    expect(rulesFor('daily')).toMatchObject({ hearts: null, promptSource: 'day', roundCounter: 'slots' });
    expect(rulesFor('daily').answerMs(5000)).toBe(ANSWER_MS);
    for (const m of ['endless', 'true-endless'] as const) {
      expect(rulesFor(m)).toMatchObject({ hearts: { max: ENDLESS_HEARTS }, promptSource: 'pool', roundCounter: 'hearts' });
    }
  });

  it('Daily pushes the locked tier frames at any depth; Endless scales them x20 above the kernel, x10 from it', () => {
    expect(rulesFor('daily').framesFor('bitflip', 80)).toBe(13);
    expect(rulesFor('endless').framesFor('bitflip', ENDLESS_KERNEL_DEPTH - 1)).toBe(260);
    expect(rulesFor('endless').framesFor('bitflip', ENDLESS_KERNEL_DEPTH)).toBe(130);
    expect(rulesFor('endless').framesFor('off-by-one', 0)).toBe(20);
    expect(rulesFor('true-endless').framesFor('race', 10)).toBe(5);
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
