import { describe, expect, it } from 'vitest';
import { LAYERS, MAX_DEPTH, layerAt } from './layers';
import { TIERS } from './tiers';
import { CategoryIndex, normalize } from './match';
import { buildAnswerSet } from './answers';
import { SAMPLE_QUESTIONS, SAMPLE_TERMS } from '../data/sample';
import { pickForDay, puzzleNumber, parseLocalDate } from './day';

describe('depth and layers', () => {
  it('a perfect day reaches exactly Ring −3', () => {
    expect(MAX_DEPTH).toBe(91);
    expect(layerAt(91).id).toBe('ring-3');
    expect(layerAt(90).id).toBe('ring-2');
  });

  it('seven heisenbugs land in Ring −1; three bit flips + four heisenbugs reach Ring −2', () => {
    const h = TIERS.heisenbug.frames;
    const b = TIERS.bitflip.frames;
    expect(layerAt(7 * h).id).toBe('ring-1');
    expect(layerAt(3 * b + 4 * h).id).toBe('ring-2');
  });

  it('a day of only common answers stays in the runtime', () => {
    expect(layerAt(7 * TIERS['off-by-one'].frames).id).toBe('runtime');
  });

  it('rejects negative depth loudly', () => {
    expect(() => layerAt(-1)).toThrow(/invariant/);
  });

  it('layers start at 0', () => {
    expect(LAYERS[0]!.from).toBe(0);
  });
});

describe('matching', () => {
  const idx = new CategoryIndex([
    { name: 'spinlock', tier: 'off-by-one', keys: ['spinlock'] },
    { name: 'MCS lock', tier: 'race', keys: ['mcslock'] },
    { name: 'CNA lock', tier: 'heisenbug', keys: ['cnalock'] },
    { name: 'TAS lock', tier: 'npe', keys: ['taslock'] },
    { name: 'TTS lock', tier: 'npe', keys: ['ttslock'] },
  ]);

  it('normalizes case, spacing, punctuation and diacritics', () => {
    expect(normalize('  Schrödin-Bug! ')).toBe('schrodinbug');
  });

  it('accepts exact and alias keys', () => {
    const r = idx.check('Spin Lock');
    expect(r.kind).toBe('accepted');
  });

  it('forgives a typo on long words and reports the correction', () => {
    const r = idx.check('spinlcok');
    expect(r).toMatchObject({ kind: 'accepted', corrected: true });
  });

  it('picks the single closest entry for a typo', () => {
    const r = idx.check('mcalock'); // 1 edit from MCS, 2 from CNA
    expect(r.kind === 'accepted' && r.entry.name).toBe('MCS lock');
  });

  it('rejects an ambiguous typo instead of guessing', () => {
    expect(idx.check('txslock').kind).toBe('rejected'); // 1 edit from both TAS and TTS
  });

  it('rejects unknown answers', () => {
    expect(idx.check('deez lock').kind).toBe('rejected');
  });

  it('refuses duplicate keys across entries', () => {
    expect(
      () =>
        new CategoryIndex([
          { name: 'a', tier: 'npe', keys: ['x'] },
          { name: 'b', tier: 'npe', keys: ['x'] },
        ]),
    ).toThrow(/claimed by both/);
  });
});

describe('sample answer set', () => {
  const set = buildAnswerSet('sample', 'Sample', SAMPLE_TERMS, SAMPLE_QUESTIONS);

  it('accepts the answers algillion rejects', () => {
    expect(set.check('data-structure', 'xarray').kind).toBe('accepted');
    expect(set.check('data-structure', 'Maple Tree').kind).toBe('accepted');
  });

  it('places the user-specified lock answers', () => {
    const fissile = set.check('lock', 'fissile lock');
    const cna = set.check('lock', 'CNA lock');
    expect(fissile.kind === 'accepted' && fissile.entry.tier).toBe('bitflip');
    expect(cna.kind === 'accepted' && cna.entry.tier).toBe('heisenbug');
  });

  it('tags are per category: heisenbug is Works-on-my-machine for "type of bug"', () => {
    const r = set.check('bug', 'heisenbug');
    expect(r.kind === 'accepted' && r.entry.tier).toBe('womm');
  });
});

describe('daily selection', () => {
  it('day 1 is the epoch', () => {
    expect(puzzleNumber(parseLocalDate('2026-11-26'))).toBe(1);
    expect(puzzleNumber(parseLocalDate('2027-03-15'))).toBe(110); // crosses a DST change
  });

  it('is deterministic and distinct', () => {
    const a = pickForDay(SAMPLE_QUESTIONS, 5, 7).map((q) => q.id);
    const b = pickForDay(SAMPLE_QUESTIONS, 5, 7).map((q) => q.id);
    expect(a).toEqual(b);
    expect(new Set(a).size).toBe(7);
  });
});

describe('pilot answer set', () => {
  it('builds, and keeps the deep answers the user named', async () => {
    const { PILOT_TERMS } = await import('../data/pilot');
    const set = buildAnswerSet('pilot', 'Pilot', PILOT_TERMS, SAMPLE_QUESTIONS);
    for (const [q, g] of [['data-structure', 'maple tree'], ['data-structure', 'xarray'], ['lock', 'fissile lock'], ['lock', 'cna lock']] as const) {
      expect(set.check(q, g).kind).toBe('accepted');
    }
  });
});
