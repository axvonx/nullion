import { describe, expect, it } from 'vitest';
import { buildAnswerSet } from '../core/answers';
import { BANK_QUESTIONS, loadBankTerms } from './bank';

/**
 * The head of every category: the ~30 answers ordinary players type first (scripts/bank/obvious/<id>.json).
 * Mining and precision checks all look at the deep end; this is the check that the obvious end is complete.
 * A missing "list" for "Name a data structure" rejects far more players than any missing deep cut.
 * Edit the JSON files to curate; every listed name (and alias) must be accepted by the real matcher.
 */
const OBVIOUS = import.meta.glob('../../scripts/bank/obvious/*.json', { eager: true, import: 'default' }) as Record<
  string,
  { name: string; aliases?: string[] }[]
>;

describe('obvious answers are all accepted', () => {
  const approved = new Set(BANK_QUESTIONS.map((q) => q.id));

  it('every approved category has an obvious-answer list, and every list names an approved category', () => {
    const listed = new Set(Object.keys(OBVIOUS).map((p) => /([^/]+)\.json$/.exec(p)![1]!));
    expect([...approved].filter((id) => !listed.has(id)), 'approved categories without scripts/bank/obvious/<id>.json').toEqual([]);
    expect([...listed].filter((id) => !approved.has(id)), 'obvious lists for categories that are not approved').toEqual([]);
  });

  for (const [path, answers] of Object.entries(OBVIOUS)) {
    const id = /([^/]+)\.json$/.exec(path)![1]!;
    it(`${id}: every obvious answer is accepted`, async () => {
      const qs = BANK_QUESTIONS.filter((q) => q.id === id);
      const set = buildAnswerSet('bank', 'Bank', await loadBankTerms([id]), qs);
      const misses = answers.flatMap((a) => [a.name, ...(a.aliases ?? [])]).filter((g) => set.check(id, g).kind !== 'accepted');
      expect(misses, `${id}: obvious answers the bank rejects`).toEqual([]);
    });
  }
});
