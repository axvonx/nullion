// @vitest-environment happy-dom
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { buildAnswerSet } from '../core/answers';
import { TIER_IDS } from '../core/tiers';
import { SAMPLE_QUESTIONS, SAMPLE_TERMS } from '../data/sample';
import { Game } from '../game/game';
import type { StatsOutcome } from '../game/stats';
import { END_CARD_HTML, EndCard, type RecordRow } from './end-card';

/** The end card on its own: its rows, headline, stats and countdown, with a stand-in host. */

const SET = buildAnswerSet('sample', 'sample', SAMPLE_TERMS, SAMPLE_QUESTIONS);
const T0 = new Date(2026, 10, 26, 22, 30, 0).getTime();

beforeAll(() => {
  const ctx = new Proxy({}, { get: () => () => undefined, set: () => true });
  HTMLCanvasElement.prototype.getContext = (() => ctx) as never;
  HTMLCanvasElement.prototype.toDataURL = () => 'data:,';
});

function setup(game?: Game) {
  document.body.innerHTML = `<div id="app">${END_CARD_HTML}</div>`;
  const root = document.getElementById('app')!;
  const notes: string[] = [];
  let now = T0;
  const card = new EndCard(root.querySelector<HTMLElement>('[data-el="result"]')!, {
    game: () => game,
    clock: () => now,
    notify: (m) => notes.push(m),
    openManual: () => undefined,
  });
  const q = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  return { card, q, notes, setNow: (n: number) => (now = n) };
}

const ROWS: RecordRow[] = [{ tier: 'race', name: 'mutex' }, { timedOut: true }, { tier: 'bitflip', name: 'fissile lock' }];
const stats = { played: 4, streak: 3, bestStreak: 5, avgDepth: 33, bestDepth: 61, tiers: Object.fromEntries(TIER_IDS.map((t, i) => [t, i])) } as never;

describe('EndCard', () => {
  it('lists the backtrace most recent first, with frame spans and a timeout row', () => {
    const t = setup();
    t.card.show(ROWS, 18, 7);
    expect(t.card.isShown).toBe(true);
    expect(t.q('.result').hidden).toBe(false);
    const rows = [...t.q('.record').querySelectorAll('.bt-row')];
    expect(rows).toHaveLength(3);
    expect(rows[0]!.textContent).toContain('#0');
    expect(rows[0]!.textContent).toContain('frames 6–18');
    expect(rows[1]!.classList.contains('timeout')).toBe(true);
    expect(rows[2]!.textContent).toContain('frames 1–5');
  });

  it('the summary card holds the stack as it stood, top-down, the deepest layer lit', () => {
    const t = setup();
    t.card.show(ROWS, 18, 7);
    const badges = [...t.q('.eod-summary').querySelectorAll<HTMLElement>('.eod-stack .ls-badge')];
    expect(badges.map((b) => b.dataset.layer)).toEqual(['application', 'runtime', 'libraries', 'userspace', 'kernel']);
    expect(badges.at(-1)!.classList.contains('is-current')).toBe(true);
    expect(badges[0]!.classList.contains('is-passed')).toBe(true);
  });

  it('the right-hand blocks fly into the summary card; reduced motion just shows the badges', () => {
    vi.useFakeTimers();
    try {
      const t = setup();
      t.card.show(ROWS, 18, 7);
      const rect = { left: 1000, top: 100, width: 180, height: 26, right: 1180, bottom: 126, x: 1000, y: 100, toJSON: () => ({}) } as DOMRect;
      const from = new Map(['application', 'runtime', 'libraries', 'userspace', 'kernel'].map((id) => [id as never, rect]));
      t.card.flyStackIn(from, false);
      expect(document.querySelectorAll('.ls-flyer')).toHaveLength(5);
      expect(t.q('.eod-stack .ls-badge').classList.contains('ls-badge-gone')).toBe(true);
      vi.advanceTimersByTime(5000);
      expect(document.querySelectorAll('.ls-flyer')).toHaveLength(0);
      expect(t.q('.eod-stack').querySelectorAll('.ls-badge-gone')).toHaveLength(0);

      t.card.flyStackIn(from, true);
      expect(document.querySelectorAll('.ls-flyer')).toHaveLength(0);
      expect(t.q('.eod-stack').querySelectorAll('.ls-badge-gone')).toHaveLength(0);

      // A stack with no block to fly from is a bug, not a quiet skip.
      expect(() => t.card.flyStackIn(new Map(), false)).toThrow(/no right-hand block/);
    } finally {
      vi.useRealTimers();
    }
  });

  it('a daily card says its puzzle number and plain headline', () => {
    const t = setup();
    t.card.show(ROWS, 18, 7);
    expect(t.q('[data-el="puzzleNo"]').dataset.chip).toBe('#7');
    expect(t.q('[data-el="puzzleNo"]').querySelector('canvas')?.getAttribute('aria-label')).toBe('#7');
    expect(t.q('.wordmark').querySelector('.wm-word canvas')?.getAttribute('aria-label')).toBe('nullion');
    expect(t.q('.headline').textContent).toBe('18 stack frames · Kernel');
  });

  it('an endless card is a KERNEL PANIC with the ENDLESS chip', () => {
    const game = new Game(SET, 1, { timer: true, unlimited: false, autocorrect: 'confirm', mode: 'endless' });
    const t = setup(game);
    t.card.show(ROWS, 18, 7);
    expect(t.q('[data-el="puzzleNo"]').textContent).toBe('ENDLESS');
    expect(t.q('[data-el="puzzleNo"]').dataset.chip).toBe('ENDLESS');
    expect(t.q('.headline').textContent).toMatch(/^KERNEL PANIC · 18 stack frames · /);
  });

  it('shows stats from the source, warns about a reset file, and hides them with none', () => {
    const game = new Game(SET, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    const t = setup(game);
    t.card.reset(game, () => ({ kind: 'ok', stats }) as StatsOutcome);
    t.card.show(ROWS, 18, 1);
    expect(t.q('.stats').hidden).toBe(false);
    expect(t.q('.stats').textContent).toMatch(/4played/);
    expect(t.q('.stats').querySelectorAll('.stats-dist li')).toHaveLength(TIER_IDS.length);

    t.card.reset(game, () => ({ kind: 'ok', stats, reset: 'not valid JSON' }) as StatsOutcome);
    t.card.show(ROWS, 18, 1);
    expect(t.q('.stats-warn').textContent).toContain('not valid JSON');
    expect(t.notes).toHaveLength(1);

    t.card.reset(game, () => ({ kind: 'none' }));
    t.card.show(ROWS, 18, 1);
    expect(t.q('.stats').hidden).toBe(true);
  });

  it('reset and hide put the card away', () => {
    const game = new Game(SET, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    const t = setup(game);
    t.card.show(ROWS, 18, 1);
    t.card.hide();
    expect(t.card.isShown).toBe(false);
    expect(t.q('.result').hidden).toBe(true);
    t.card.show(ROWS, 18, 1);
    t.card.reset(game, undefined);
    expect(t.card.isShown).toBe(false);
  });

  it('counts down to local midnight for a live daily, then offers a reload', () => {
    const game = new Game(SET, 1, { timer: true, unlimited: false, autocorrect: 'confirm' }); // puzzle #1: the epoch day
    const t = setup(game);
    t.card.reset(game, undefined);
    t.card.updateNextDay(T0);
    expect(t.q('[data-el="nextDay"]').textContent).toBe('Next stack in 1:30:00');
    t.card.updateNextDay(T0 + 60_000);
    expect(t.q('[data-el="nextDay"]').textContent).toBe('Next stack in 1:29:00');
    t.card.updateNextDay(new Date(2026, 10, 27, 0, 0, 1).getTime());
    expect(t.q('[data-el="nextDay"]').querySelector('button')?.textContent).toContain('reload');
  });

  it('a game that is not today\'s daily counts nothing down', () => {
    const game = new Game(SET, 5, { timer: true, unlimited: false, autocorrect: 'confirm' });
    const t = setup(game);
    t.card.reset(game, undefined);
    t.card.updateNextDay(T0);
    expect(t.q('[data-el="nextDay"]').textContent).toBe('A new stack opens at local midnight.');
    const endless = new Game(SET, 1, { timer: true, unlimited: false, autocorrect: 'confirm', mode: 'endless' });
    t.card.reset(endless, undefined);
    t.card.updateNextDay(T0);
    expect(t.q('[data-el="nextDay"]').textContent).toBe('A new stack opens at local midnight.');
  });
});

describe('build tag', () => {
  it('the end card names the build: package.json version and stage', async () => {
    const { readFileSync } = await import('node:fs');
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string }; // vitest runs from the repo root
    // The word itself is drawn in the title's pixel face (wordmark.ts); the version number stays text.
    expect(END_CARD_HTML).toContain(`data-wm="nullion">nullion</span> v${pkg.version}`);
  });
});
