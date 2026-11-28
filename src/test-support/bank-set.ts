import { buildAnswerSet, type AnswerSet, type Question, type Term } from '../core/answers';
import { BANK_QUESTIONS, loadBankTerms } from '../data/bank';
import { enforce } from '../core/enforce';

/**
 * Tests play the real answer bank, never a hand-written stand-in: these approved categories, loaded from bank/
 * like the game loads them. Tests that name an answer name a real one (the lock Bit Flip is "fissile lock").
 */
export const TEST_CATEGORIES = ['lock', 'data-structure', 'bug', 'sorting-algorithm', 'programming-language', 'operating-system', 'shading-technique'] as const;

/** The test categories' questions, in TEST_CATEGORIES order. */
export const TEST_QUESTIONS: readonly Question[] = TEST_CATEGORIES.map((id) => {
  const q = BANK_QUESTIONS.find((x) => x.id === id);
  enforce(q, `test bank: ${id} is not an approved category`);
  return q;
});

/** The test categories' answers as terms (for a test that adds its own on top). */
export function bankTestTerms(): Promise<Term[]> {
  return loadBankTerms(TEST_CATEGORIES);
}

export async function bankTestSet(): Promise<AnswerSet> {
  return buildAnswerSet('bank', 'Answer bank', await bankTestTerms(), TEST_QUESTIONS);
}
