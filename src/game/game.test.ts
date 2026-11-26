import { describe, expect, it } from 'vitest';
import { buildAnswerSet } from '../core/answers';
import { SAMPLE_QUESTIONS, SAMPLE_TERMS } from '../data/sample';
import { ANSWER_MS, ENDLESS_MAX_STRIKES, Game, READ_MS, endlessAnswerMs } from './game';

const set = buildAnswerSet('sample', 'Sample', SAMPLE_TERMS, SAMPLE_QUESTIONS);

function bitflipFor(g: Game, round: number) {
  return set.entries(g.rounds[round]!.question.id).find((e) => e.tier === 'bitflip')!.name;
}

describe('game loop', () => {
  it('a perfect day reaches depth 91', () => {
    const g = new Game(set, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    let now = 0;
    g.start(now);
    for (let i = 0; i < 7; i++) {
      now += READ_MS;
      g.tick(now);
      expect(g.submit(bitflipFor(g, i), now).kind).toBe('accepted');
      g.advance(now); // "Unwind further"
    }
    expect(g.phase.kind).toBe('done');
    expect(g.depth).toBe(91);
  });

  it('the watchdog times a round out with no frames', () => {
    const g = new Game(set, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    g.start(0);
    g.tick(READ_MS);
    g.tick(READ_MS + ANSWER_MS);
    expect(g.rounds[0]!.timedOut).toBe(true);
    expect(g.depth).toBe(0);
  });

  it('rejected guesses are recorded and retries are unlimited', () => {
    const g = new Game(set, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    g.start(0);
    g.tick(READ_MS);
    expect(g.submit('definitely not an answer', READ_MS).kind).toBe('rejected');
    expect(g.submit('also not', READ_MS).kind).toBe('rejected');
    expect(g.rounds[0]!.rejected).toEqual(['definitely not an answer', 'also not']);
    expect(g.phase.kind).toBe('answering');
  });

  it('unlimited mode keeps the round open but only the first answer pushes frames', () => {
    const g = new Game(set, 1, { timer: false, unlimited: true, autocorrect: 'confirm' });
    g.start(0);
    g.tick(READ_MS);
    const entries = set.entries(g.rounds[0]!.question.id);
    const a = g.submit(entries[0]!.name, READ_MS);
    const b = g.submit(entries[1]!.name, READ_MS);
    expect(a).toMatchObject({ kind: 'accepted' });
    expect(b).toMatchObject({ kind: 'accepted', pushed: 0 });
    expect(g.phase.kind).toBe('answering');
  });

  it('the reveal waits for the player: no timer advances the between phase', () => {
    const g = new Game(set, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    g.start(0);
    g.tick(READ_MS);
    g.submit(bitflipFor(g, 0), READ_MS);
    expect(g.phase.kind).toBe('between');
    g.tick(READ_MS + 10 * 60_000);
    expect(g.phase.kind).toBe('between');
    g.advance(READ_MS + 10 * 60_000);
    expect(g.phase).toMatchObject({ kind: 'reading', round: 1 });
  });

  describe('autocorrect', () => {
    // "Fissile lock" is the lock Bit Flip; a one-letter typo is within the typo budget.
    const lockRound = (g: Game) => g.rounds.findIndex((r) => r.question.id === 'lock');

    function atLockRound(mode: 'confirm' | 'auto') {
      const g = new Game(set, 1, { timer: false, unlimited: false, autocorrect: mode });
      const target = lockRound(g);
      expect(target).toBeGreaterThanOrEqual(0);
      let now = 0;
      g.start(now);
      for (let i = 0; i < target; i++) {
        now += READ_MS;
        g.tick(now);
        g.advance(now); // skip the round
        g.advance(now); // past its reveal
      }
      now += READ_MS;
      g.tick(now);
      expect(g.current()!.question.id).toBe('lock');
      return { g, now };
    }

    it('confirm mode suggests the correction without locking or logging a rejection', () => {
      const { g, now } = atLockRound('confirm');
      const res = g.submit('fisile lock', now);
      expect(res).toMatchObject({ kind: 'suggestion', guess: 'fisile lock' });
      expect(res.kind === 'suggestion' && res.entry.name).toBe('fissile lock');
      expect(g.phase.kind).toBe('answering');
      expect(g.current()!.locked).toBeUndefined();
      expect(g.current()!.rejected).toEqual([]);
      // Submitting the suggested name is an exact match.
      expect(g.submit('fissile lock', now)).toMatchObject({ kind: 'accepted', corrected: false });
    });

    it('auto mode accepts the corrected answer straight away', () => {
      const { g, now } = atLockRound('auto');
      expect(g.submit('fisile lock', now)).toMatchObject({ kind: 'accepted', corrected: true });
      expect(g.phase.kind).toBe('between');
    });

    it('a preference change applies mid-game', () => {
      const { g, now } = atLockRound('confirm');
      g.opts.autocorrect = 'auto';
      expect(g.submit('fisile lock', now)).toMatchObject({ kind: 'accepted', corrected: true });
    });
  });

  describe('endless mode (3-strike watchdog)', () => {
    it('continues past 7 rounds with anti-repeat prompts and ends on the 3rd watchdog strike', () => {
      const g = new Game(set, 42, { timer: true, unlimited: false, autocorrect: 'confirm', mode: 'endless' });
      expect(g.mode).toBe('endless');
      expect(g.strikes).toBe(0);
      expect(g.strikesLeft).toBe(ENDLESS_MAX_STRIKES);
      let now = 0;
      g.start(now);

      // Play 10 successful rounds (more than a daily's 7!) without repeating back-to-back
      let prevId = '';
      for (let i = 0; i < 10; i++) {
        now += READ_MS;
        g.tick(now);
        const qid = g.current()!.question.id;
        expect(qid).not.toBe(prevId);
        prevId = qid;
        expect(g.submit(bitflipFor(g, i), now).kind).toBe('accepted');
        g.advance(now);
        expect(g.phase).toMatchObject({ kind: 'reading', round: i + 1 });
      }
      expect(g.depth).toBe(130);
      expect(g.strikes).toBe(0);

      // Now burn 3 watchdog strikes
      for (let s = 1; s <= ENDLESS_MAX_STRIKES; s++) {
        now += READ_MS;
        g.tick(now);
        now += g.answerMs;
        g.tick(now);
        expect(g.strikes).toBe(s);
        expect(g.strikesLeft).toBe(ENDLESS_MAX_STRIKES - s);
        g.advance(now);
      }
      expect(g.phase.kind).toBe('done');
    });

    it('tightens the per-prompt watchdog timer at deeper layers', () => {
      expect(endlessAnswerMs(0)).toBe(30000);
      expect(endlessAnswerMs(700)).toBe(25000);
      expect(endlessAnswerMs(1500)).toBe(20000);
      expect(endlessAnswerMs(2200)).toBe(16000);
    });
  });
});
