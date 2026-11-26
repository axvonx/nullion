/**
 * Prefilled GitHub Issue links for missed-answer reports and question suggestions.
 * Locked design decision (CLAUDE.md): reports go through GitHub Issues and are never auto-accepted.
 */

export const REPO_ISSUES_URL = 'https://github.com/axvonx/nullion/issues/new';

export function missedAnswerUrl(opts: { prompt?: string; guesses?: readonly string[]; puzzle?: number }): string {
  const params = new URLSearchParams();
  const sample = opts.guesses?.find((g) => g.trim().length > 0);
  const title = sample ? `Missed answer: ${sample}` : 'Missed answer report';
  const lines = [
    opts.puzzle !== undefined ? `**Puzzle:** #${opts.puzzle}` : undefined,
    opts.prompt ? `**Prompt:** ${opts.prompt}` : undefined,
    opts.guesses?.length ? `**Guess(es):** ${opts.guesses.join(', ')}` : '**Guess(es):** ',
    '',
    '**Why it should be accepted (optional):**',
  ].filter((l) => l !== undefined);
  params.set('labels', 'missed-answer');
  params.set('title', title);
  params.set('body', lines.join('\n'));
  return `${REPO_ISSUES_URL}?${params.toString()}`;
}

export function suggestQuestionUrl(): string {
  const params = new URLSearchParams();
  params.set('labels', 'question-idea');
  params.set('title', 'Question idea: ');
  params.set(
    'body',
    [
      '**Prompt:** Name a ...',
      '',
      '**Example common answers (Off-by-one):** ',
      '**Example deep cuts (Race / Heisenbug):** ',
      '**Possible Bit Flip (1-in-a-billion):** ',
    ].join('\n'),
  );
  return `${REPO_ISSUES_URL}?${params.toString()}`;
}
