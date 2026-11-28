import { describe, expect, it } from 'vitest';
import { ALL_LAYER_IDS, ENDLESS_LAYERS, ENDLESS_MAX_DEPTH, LAYERS, MAX_DEPTH } from './layers';
import { layerAt } from './modes';
import { LAYER_ART } from '../layers';
import { snapColor } from '../render/palettes';
import { TIERS } from './tiers';
import { CategoryIndex, normalize } from './match';
import { bankTestSet } from '../test-support/bank-set';
import { pickForDay, puzzleNumber, parseLocalDate, msUntilNextDay, formatCountdown } from './day';

/** The real answer bank's test categories (src/test-support/bank-set.ts). */
const BANK_SET = await bankTestSet();

describe('depth and layers', () => {
  it('a perfect day reaches exactly Ring −3', () => {
    expect(MAX_DEPTH).toBe(91);
    expect(layerAt(91).id).toBe('ring-3');
    expect(layerAt(90).id).toBe('ring-2');
  });

  it('seven heisenbugs land in Ring −1, and Ring −2 needs at least one Bit Flip', () => {
    const h = TIERS.heisenbug.frames;
    const b = TIERS.bitflip.frames;
    expect(layerAt(7 * h).id).toBe('ring-1');
    expect(layerAt(b + 6 * h).id).toBe('ring-2');
  });

  it('a day of only common answers reaches the libraries but not the kernel', () => {
    expect(layerAt(7 * TIERS['off-by-one'].frames).id).toBe('libraries');
  });

  it('rejects negative depth loudly', () => {
    expect(() => layerAt(-1)).toThrow(/invariant/);
  });

  it('layers start at 0', () => {
    expect(LAYERS[0]!.from).toBe(0);
    expect(ENDLESS_LAYERS[0]!.from).toBe(0);
  });

  it('endless stack spans 29 unique layers up to the Landauer Limit (2,500 frames)', () => {
    expect(ENDLESS_LAYERS).toHaveLength(29);
    expect(new Set(ENDLESS_LAYERS.map((l) => l.id)).size).toBe(29);
    expect(layerAt(0, 'endless').id).toBe('internet');
    expect(layerAt(ENDLESS_MAX_DEPTH, 'endless').id).toBe('landauer');
    expect(layerAt(ENDLESS_MAX_DEPTH - 1, 'endless').id).toBe('bandgap');
    for (const id of ALL_LAYER_IDS) {
      expect(snapColor('#88aa44', LAYER_ART[id].palette)).toMatch(/^#[0-9a-f]{6}$/);
    }
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

  describe('other phrasings of the same answer are exact, not typos', () => {
    const locks = new CategoryIndex(
      [
        { name: 'mutex', tier: 'off-by-one', keys: ['mutex'] },
        { name: 'spinlock', tier: 'off-by-one', keys: ['spinlock'] },
        { name: 'B-tree', tier: 'npe', keys: ['btree'] },
        { name: 'query', tier: 'npe', keys: ['query'] },
        { name: 'ext4', tier: 'npe', keys: ['ext4'] },
        { name: 'ext3', tier: 'npe', keys: ['ext3'] },
        { name: 'MCS lock', tier: 'race', keys: ['mcslock'] },
      ],
      'Name a type of lock',
    );
    const exact = (g: string) => locks.check(g);
    it.each([
      ['mutexes', 'mutex'],
      ['a mutex', 'mutex'],
      ['the mutex', 'mutex'],
      ['mutex lock', 'mutex'],
      ['mutex locks', 'mutex'],
      ['the spinlocks', 'spinlock'],
      ['B-trees', 'B-tree'],
      ['queries', 'query'],
      ['ext4 filesystem', 'ext4'],
      ['MCS lock', 'MCS lock'], // the subject noun is part of this name: kept whole
      ['MCS locks', 'MCS lock'],
    ])('%s → %s, with no correction to confirm', (guess, name) => {
      const r = exact(guess);
      expect(r).toMatchObject({ kind: 'accepted', corrected: false });
      expect(r.kind === 'accepted' && r.entry.name).toBe(name);
    });

    it('four letters: an adjacent swap is forgiven, a changed letter never is', () => {
      expect(locks.check('etx4')).toMatchObject({ kind: 'accepted', corrected: true });
      expect(locks.check('ext5').kind).toBe('rejected');
      expect(locks.check('ext3')).toMatchObject({ kind: 'accepted', corrected: false });
    });

    it('one typo on a long name is a sure correction; short names and two typos are not', () => {
      expect(locks.check('spinlcok')).toMatchObject({ kind: 'accepted', corrected: true, sure: true });
      expect(locks.check('mutx')).toMatchObject({ kind: 'rejected' });
      const long = new CategoryIndex([{ name: 'fissile lock', tier: 'bitflip', keys: ['fissilelock'] }]);
      expect(long.check('fisle lock')).toMatchObject({ kind: 'accepted', corrected: true, sure: false });
    });

    it('a phrasing that could mean two answers is rejected, not guessed', () => {
      const amb = new CategoryIndex(
        [
          { name: 'lock', tier: 'npe', keys: ['lock'] },
          { name: 'locks', tier: 'npe', keys: ['locks'] },
          { name: 'tree', tier: 'npe', keys: ['tree'] },
          { name: 'tree lock', tier: 'npe', keys: ['treelock'] },
        ],
        'Name a type of lock',
      );
      expect(amb.check('locks')).toMatchObject({ kind: 'accepted', corrected: false }); // exact key wins
      // Plural first: "tree locks" is "tree lock"; only if that found nothing would "tree" (tail dropped) count.
      const tl = amb.check('tree locks');
      expect(tl.kind === 'accepted' && tl.entry.name).toBe('tree lock');
      const two = new CategoryIndex(
        [
          { name: 'red', tier: 'npe', keys: ['red'] },
          { name: 'reds', tier: 'npe', keys: ['reds'] },
        ],
        'Name a type of lock',
      );
      expect(two.check('the red lock').kind).toBe('accepted');
      expect(new CategoryIndex([{ name: 'ab cd', tier: 'npe', keys: ['abcd'] }, { name: 'ab', tier: 'npe', keys: ['ab'] }], 'Name a type of cd').check('ab cds').kind).toBe('accepted');
    });

    it('two entries in the same round is ambiguous and rejected', () => {
      const amb = new CategoryIndex(
        [
          { name: 'box', tier: 'npe', keys: ['box'] },
          { name: 'boxe', tier: 'npe', keys: ['boxe'] },
        ],
        'Name a type of lock',
      );
      expect(amb.check('boxes').kind).toBe('rejected'); // singular is "box" or "boxe"
    });
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

describe('the answer bank', () => {
  const set = BANK_SET;

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
    const a = pickForDay(BANK_SET.questions, 5, 7).map((q) => q.id);
    const b = pickForDay(BANK_SET.questions, 5, 7).map((q) => q.id);
    expect(a).toEqual(b);
    expect(new Set(a).size).toBe(7);
  });
});

describe('next puzzle countdown', () => {
  it('counts to the next local midnight', () => {
    expect(msUntilNextDay(new Date(2026, 10, 26, 23, 0, 0))).toBe(3600_000);
    expect(msUntilNextDay(new Date(2026, 10, 26, 0, 0, 0))).toBe(24 * 3600_000);
    expect(msUntilNextDay(new Date(2026, 11, 31, 23, 59, 59))).toBe(1000);
  });
  it('rolls the puzzle number exactly at that moment', () => {
    const now = new Date(2026, 10, 26, 22, 0, 0);
    expect(puzzleNumber(new Date(now.getTime() + msUntilNextDay(now) - 1))).toBe(puzzleNumber(now));
    expect(puzzleNumber(new Date(now.getTime() + msUntilNextDay(now)))).toBe(puzzleNumber(now) + 1);
  });
  it('formats H:MM:SS, rounding up', () => {
    expect(formatCountdown(3600_000 + 61_000)).toBe('1:01:01');
    expect(formatCountdown(500)).toBe('0:00:01');
    expect(formatCountdown(0)).toBe('0:00:00');
  });
});
