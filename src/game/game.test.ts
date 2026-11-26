import { describe, expect, it } from 'vitest';
import { buildAnswerSet } from '../core/answers';
import { SAMPLE_QUESTIONS, SAMPLE_TERMS } from '../data/sample';
import { ANSWER_MS, BETWEEN_MS, Game, READ_MS } from './game';

const set = buildAnswerSet('sample', 'Sample', SAMPLE_TERMS, SAMPLE_QUESTIONS);

function bitflipFor(g: Game, round: number) {
  return set.entries(g.rounds[round]!.question.id).find((e) => e.tier === 'bitflip')!.name;
}

describe('game loop', () => {
  it('a perfect day reaches depth 91', () => {
    const g = new Game(set, 1, { timer: true, unlimited: false });
    let now = 0;
    g.start(now);
    for (let i = 0; i < 7; i++) {
      now += READ_MS;
      g.tick(now);
      expect(g.submit(bitflipFor(g, i), now).kind).toBe('accepted');
      now += BETWEEN_MS;
      g.tick(now);
    }
    expect(g.phase.kind).toBe('done');
    expect(g.depth).toBe(91);
  });

  it('the watchdog times a round out with no frames', () => {
    const g = new Game(set, 1, { timer: true, unlimited: false });
    g.start(0);
    g.tick(READ_MS);
    g.tick(READ_MS + ANSWER_MS);
    expect(g.rounds[0]!.timedOut).toBe(true);
    expect(g.depth).toBe(0);
  });

  it('rejected guesses are recorded and retries are unlimited', () => {
    const g = new Game(set, 1, { timer: true, unlimited: false });
    g.start(0);
    g.tick(READ_MS);
    expect(g.submit('definitely not an answer', READ_MS).kind).toBe('rejected');
    expect(g.submit('also not', READ_MS).kind).toBe('rejected');
    expect(g.rounds[0]!.rejected).toEqual(['definitely not an answer', 'also not']);
    expect(g.phase.kind).toBe('answering');
  });

  it('unlimited mode keeps the round open but only the first answer pushes frames', () => {
    const g = new Game(set, 1, { timer: false, unlimited: true });
    g.start(0);
    g.tick(READ_MS);
    const entries = set.entries(g.rounds[0]!.question.id);
    const a = g.submit(entries[0]!.name, READ_MS);
    const b = g.submit(entries[1]!.name, READ_MS);
    expect(a).toMatchObject({ kind: 'accepted' });
    expect(b).toMatchObject({ kind: 'accepted', pushed: 0 });
    expect(g.phase.kind).toBe('answering');
  });
});
