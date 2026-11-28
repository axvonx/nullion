// @vitest-environment happy-dom
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { TIER_IDS } from '../core/tiers';
import { bankTestSet } from '../test-support/bank-set';
import { Game } from '../game/game';
import type { StatsOutcome } from '../game/stats';
import { looks } from '../looks';
import { END_CARD_HTML, EndCard, type RecordRow , type EndlessHook } from './end-card';

/** The end card on its own: its rows, headline, stats and countdown, with a stand-in host. */

const SET = await bankTestSet();
const T0 = new Date(2026, 10, 26, 22, 30, 0).getTime();

beforeAll(() => {
  const ctx = new Proxy({}, { get: () => () => undefined, set: () => true });
  HTMLCanvasElement.prototype.getContext = (() => ctx) as never;
  HTMLCanvasElement.prototype.toDataURL = () => 'data:,';
});

function setup(game?: Game, endless: EndlessHook | null = null) {
  document.body.innerHTML = `<div id="app">${END_CARD_HTML}</div>`;
  const root = document.getElementById('app')!;
  const notes: string[] = [];
  let now = T0;
  const card = new EndCard(root.querySelector<HTMLElement>('[data-el="result"]')!, {
    game: () => game,
    clock: () => now,
    notify: (m) => notes.push(m),
    openManual: () => undefined,
    endless: () => endless,
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
    expect(rows[0]!.querySelector('.bt-detail')!.textContent).toContain('frames 6–18');
    expect(rows[0]!.querySelector('.bt-sum')).toBeNull();
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
      expect(t.q('.eod-stack').classList.contains('is-flying')).toBe(true);
      expect(t.q('.eod-stack .ls-badge').classList.contains('ls-badge-gone')).toBe(true);
      vi.advanceTimersByTime(5000);
      expect(document.querySelectorAll('.ls-flyer')).toHaveLength(0);
      expect(t.q('.eod-stack').classList.contains('is-flying')).toBe(false);
      expect(t.q('.eod-stack').querySelectorAll('.ls-badge-gone')).toHaveLength(0);

      t.card.flyStackIn(from, true);
      expect(document.querySelectorAll('.ls-flyer')).toHaveLength(0);
      expect(t.q('.eod-stack').classList.contains('is-flying')).toBe(false);
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
    // The layer name is left off the card: the stack is drawn right under the line.
    expect(t.q('.headline').textContent).toBe('18 stack frames');
  });

  it('an endless card is a KERNEL PANIC with the ENDLESS chip', () => {
    const game = new Game(SET, 1, { timer: true, unlimited: false, autocorrect: 'confirm', mode: 'endless' });
    const t = setup(game);
    t.card.show(ROWS, 18, 7);
    expect(t.q('[data-el="puzzleNo"]').querySelector('canvas')?.getAttribute('aria-label')).toBe('ENDLESS');
    expect(t.q('[data-el="puzzleNo"]').dataset.chip).toBe('ENDLESS');
    expect(t.q('.headline').textContent).toBe('KERNEL PANIC18 stack frames');
    expect(t.q('.headline .sq-sep')).not.toBeNull();
  });

  describe('Endless from the end card', () => {
    const hook = (over: Partial<EndlessHook> = {}): EndlessHook & { entered: number; backs: number } => {
      const h = { resume: false, best: null, entered: 0, backs: 0, enter: () => h.entered++, back: () => h.backs++, ...over };
      return h;
    };
    const daily = () => new Game(SET, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    const endless = () => new Game(SET, 1, { timer: true, unlimited: false, autocorrect: 'confirm', mode: 'endless' });

    it('is not offered where the host says no', () => {
      const t = setup(daily(), null);
      t.card.show(ROWS, 18, 7);
      expect(t.q('[data-el="endlessBtn"]').hidden).toBe(true);
      expect(t.q('[data-el="endlessBack"]').hidden).toBe(true);
      expect(t.q('.eod-h').textContent).toBe('Today’s backtrace');
    });

    it('a finished day offers it under Share; the button lights up, then the run starts', () => {
      vi.useFakeTimers();
      try {
        const h = hook();
        const t = setup(daily(), h);
        t.card.show(ROWS, 18, 7);
        const btn = t.q<HTMLButtonElement>('[data-el="endlessBtn"]');
        expect(btn.hidden).toBe(false);
        expect(btn.textContent).toBe('Enter endless ▾');
        expect(btn.previousElementSibling?.classList.contains('endless-best')).toBe(true);
        btn.click();
        expect(btn.classList.contains('lit')).toBe(true);
        expect(h.entered).toBe(0);
        vi.advanceTimersByTime(700);
        expect(h.entered).toBe(1);
        btn.click(); // disabled while it starts: one run, not two
        vi.advanceTimersByTime(700);
        expect(h.entered).toBe(1);
      } finally {
        vi.useRealTimers();
      }
    });

    it('a saved run is resumed; under reduced motion it starts at once', () => {
      looks.set({ motion: 'reduced' });
      try {
        const h = hook({ resume: true });
        const t = setup(daily(), h);
        t.card.show(ROWS, 18, 7);
        const btn = t.q<HTMLButtonElement>('[data-el="endlessBtn"]');
        expect(btn.textContent).toBe('Resume endless run ▾');
        btn.click();
        expect(h.entered).toBe(1);
      } finally {
        looks.set({ motion: 'full' });
      }
    });

    it('a finished run shows the best (new or not), re-enters a new run or goes back to today', () => {
      vi.useFakeTimers();
      const h = hook({ best: { depth: 1340, isNew: true } });
      const t = setup(endless(), h);
      t.card.show(ROWS, 18, 7);
      expect(t.q('[data-el="endlessBest"]').textContent).toBe('New best: 1340 stack frames');
      expect(t.q('.eod-h').textContent).toBe('This run’s backtrace');
      const again = t.q<HTMLButtonElement>('[data-el="endlessBtn"]');
      expect(again.textContent).toBe('Re-enter endless ▾');
      again.click();
      vi.advanceTimersByTime(700);
      vi.useRealTimers();
      expect(h.entered).toBe(1);
      const back = t.q<HTMLButtonElement>('[data-el="endlessBack"]');
      expect(back.textContent).toBe('Back to today’s stack ▴');
      back.click();
      expect(h.backs).toBe(1);
      const t2 = setup(endless(), hook({ best: { depth: 2000, isNew: false } }));
      t2.card.show(ROWS, 18, 7);
      expect(t2.q('[data-el="endlessBest"]').textContent).toBe('Your best: 2000 stack frames');
    });
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

  it('hide folds the card into a "show" bar and show pops it back; a new card always opens', () => {
    vi.useFakeTimers();
    looks.set({ motion: 'full' });
    try {
      const t = setup();
      t.card.show(ROWS, 18, 7);
      const body = t.q('.eod-body');
      const showBar = t.q<HTMLButtonElement>('.eod-show');
      expect(showBar.hidden).toBe(true);
      t.q<HTMLButtonElement>('.eod-hide').click();
      expect(t.card.isStowed).toBe(true);
      expect(t.q('.result').classList.contains('folding')).toBe(true);
      vi.advanceTimersByTime(200);
      expect(t.q('.result').classList.contains('stowed')).toBe(true);
      expect(showBar.hidden).toBe(false);
      showBar.click();
      expect(t.card.isStowed).toBe(false);
      expect(t.q('.result').classList.contains('stowed')).toBe(false);
      expect(showBar.hidden).toBe(true);
      expect(body.classList.contains('back')).toBe(true);

      t.q<HTMLButtonElement>('.eod-hide').click();
      vi.advanceTimersByTime(200);
      t.card.show(ROWS, 18, 7);
      expect(t.card.isStowed).toBe(false);
      expect(t.q('.result').classList.contains('stowed')).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('reduced motion: hide and show are instant, with no fold', () => {
    looks.set({ motion: 'reduced' });
    try {
      const t = setup();
      t.card.show(ROWS, 18, 7);
      t.q<HTMLButtonElement>('.eod-hide').click();
      expect(t.q('.result').classList.contains('stowed')).toBe(true);
      expect(t.q('.result').classList.contains('folding')).toBe(false);
      t.q<HTMLButtonElement>('.eod-show').click();
      expect(t.q('.result').classList.contains('stowed')).toBe(false);
      expect(t.q('.eod-body').classList.contains('back')).toBe(false);
    } finally {
      looks.set({ motion: 'full' });
    }
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

  it('toggles .has-result on an enclosing .console so data-form never leaks into the End Card', () => {
    document.body.innerHTML = `<div id="app"><section class="console" data-form="bios">${END_CARD_HTML}</section></div>`;
    const consoleEl = document.querySelector<HTMLElement>('.console')!;
    const card = new EndCard(consoleEl.querySelector<HTMLElement>('[data-el="result"]')!, {
      game: () => undefined,
      clock: () => T0,
      notify: () => undefined,
      openManual: () => undefined,
      endless: () => null,
    });
    expect(consoleEl.classList.contains('has-result')).toBe(false);
    card.show(ROWS, 35, 1);
    expect(consoleEl.classList.contains('has-result')).toBe(true);
    card.hide();
    expect(consoleEl.classList.contains('has-result')).toBe(false);
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
    expect(t.q('[data-el="nextDay"]').textContent).toBe('Unwind the next stack at midnight.');
    const endless = new Game(SET, 1, { timer: true, unlimited: false, autocorrect: 'confirm', mode: 'endless' });
    t.card.reset(endless, undefined);
    t.card.updateNextDay(T0);
    expect(t.q('[data-el="nextDay"]').textContent).toBe('Unwind the next stack at midnight.');
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

describe('reference links on the end card', () => {
  it('"stack frames", every stack layer and every tier name with an article link out; Works on my machine has none', async () => {
    const { TIERS, TIER_IDS } = await import('../core/tiers');
    const { LAYER_ART } = await import('../layers');
    const { ALL_LAYER_IDS } = await import('../core/layers');
    const { refLink, setLineWithStackFrames, STACK_FRAME_WIKI } = await import('./dom');
    for (const id of ALL_LAYER_IDS) expect(LAYER_ART[id].wiki).toMatch(/^https:\/\/en\.wikipedia\.org\/wiki\/[^?#\s]+$/);
    for (const id of TIER_IDS) expect(TIERS[id].wiki === null ? id : 'linked').toBe(id === 'womm' ? 'womm' : 'linked');
    const el = document.createElement('div');
    setLineWithStackFrames(el, 'KERNEL PANIC · 18 stack frames');
    expect(el.textContent).toBe('KERNEL PANIC · 18 stack frames');
    expect(el.querySelector('a')!.getAttribute('href')).toBe(STACK_FRAME_WIKI);
    expect(el.querySelector('a')!.textContent).toBe('stack frames');
    expect(refLink('Works on my machine', null, 'x').tagName).toBe('SPAN');
  });
});
