import { enforce } from './enforce';
import { CategoryIndex, normalize, type CategoryEntry, type CheckResult } from './match';
import type { Question, Term } from '../data/sample';

/**
 * An answer set is one swappable source of truth (hand sample, Wikidata-derived, LLM-generated, union…).
 * The debug menu switches between registered sets so they can be compared in play.
 */
export interface AnswerSet {
  id: string;
  label: string;
  questions: readonly Question[];
  check(questionId: string, guess: string): CheckResult;
  entries(questionId: string): readonly CategoryEntry[];
}

/**
 * Where an answer set comes from. Categories load lazily, so a source builds a set for just the questions a
 * game will ask (the day's 7, or the whole pool for Endless).
 */
export interface AnswerSetSource {
  id: string;
  label: string;
  load(questions: readonly Question[]): Promise<AnswerSet>;
}

export function buildAnswerSet(id: string, label: string, terms: readonly Term[], questions: readonly Question[]): AnswerSet {
  const byTag = new Map<string, CategoryEntry[]>();
  for (const t of terms) {
    for (const [tag, tier] of Object.entries(t.tags)) {
      enforce(tier, `term ${t.name} has empty tier for ${tag}`);
      const keys = [...new Set([t.name, ...(t.aliases ?? [])].map(normalize))];
      const list = byTag.get(tag) ?? [];
      list.push({ name: t.name, tier, keys, ...(t.note ? { note: t.note } : {}) });
      byTag.set(tag, list);
    }
  }

  const indexes = new Map<string, CategoryIndex>();
  for (const q of questions) {
    const entries = byTag.get(q.tag);
    enforce(entries && entries.length > 0, `question ${q.id} queries tag ${q.tag} with no terms`);
    const bitflips = entries.filter((e) => e.tier === 'bitflip');
    enforce(bitflips.length === 1, `question ${q.id} must have exactly one Bit Flip answer, has ${bitflips.length}`);
    indexes.set(q.id, new CategoryIndex(entries));
  }

  const idx = (qid: string) => {
    const i = indexes.get(qid);
    enforce(i, `unknown question ${qid}`);
    return i;
  };

  return {
    id,
    label,
    questions,
    check: (qid, guess) => idx(qid).check(guess),
    entries: (qid) => idx(qid).entries,
  };
}
