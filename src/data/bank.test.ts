import { describe, expect, it } from 'vitest';
import { buildAnswerSet } from '../core/answers';
import { GENERATED_TAGS, loadCategory, parseCategory } from './bank';
import { loadPilotTerms } from './pilot';
import { SAMPLE_QUESTIONS } from './sample';

describe('generated category bank', () => {
  it('finds the generated categories', () => {
    expect([...GENERATED_TAGS].sort()).toEqual(expect.arrayContaining(['data-structure', 'lock']));
  });

  it('every generated category loads with exactly one Bit Flip and one Works on my machine', async () => {
    for (const tag of GENERATED_TAGS) {
      const terms = await loadCategory(tag);
      expect(terms.length, tag).toBeGreaterThan(0);
      const tiers = terms.map((t) => t.tags[tag]);
      expect(tiers.filter((t) => t === 'bitflip'), `${tag} bitflip`).toHaveLength(1);
      expect(tiers.filter((t) => t === 'womm'), `${tag} womm`).toHaveLength(1);
    }
  });

  it('rejects malformed files loudly', async () => {
    expect(() => parseCategory('lock', { tag: 'tree', terms: [] })).toThrow(/declares tag/);
    expect(() => parseCategory('lock', { tag: 'lock', terms: [{ name: 'mutex', tier: 'common' }] })).toThrow(/unknown tier/);
    expect(() => parseCategory('lock', { tag: 'lock', terms: [{ name: '', tier: 'npe' }] })).toThrow(/without a name/);
    expect(() => parseCategory('lock', { tag: 'lock' })).toThrow(/expected/);
    await expect(loadCategory('no-such-category')).rejects.toThrow(/no generated category/);
  });

  it('the pilot loads only the requested tags', async () => {
    const terms = await loadPilotTerms(['lock', 'bug']);
    const tags = new Set(terms.flatMap((t) => Object.keys(t.tags)));
    expect([...tags].sort()).toEqual(['bug', 'lock']);
    // The lock category comes from the generated file, not the sample.
    const qs = SAMPLE_QUESTIONS.filter((q) => q.tag === 'lock' || q.tag === 'bug');
    const set = buildAnswerSet('pilot', 'Pilot', terms, qs);
    expect(set.check('lock', 'cna lock').kind).toBe('accepted');
    expect(set.check('lock', 'spinlock')).toMatchObject({ kind: 'accepted', entry: { tier: 'off-by-one' } });
  });
});
