import { describe, expect, it } from 'vitest';
import { BLURB_MAX, BUGS_MAX, DETAIL_NOTE_MAX, ID_MAX, NAME_MAX, NOTE_MAX, SEE_ALSO_MAX, styleProblems } from './manual-style';
import type { ManualEntry } from './manual';

// Synthetic entries only: the style rules are tested here, not the placeholder registry.

const CLEAN: ManualEntry = {
  id: 'crit-sky',
  name: 'Sky Sprite',
  manTag: 'SONGBIRD',
  kind: 'critter',
  rarity: 'common',
  blurb: 'Glides lazily over sunlit app windows and perches on flat titlebars.',
  note: 'Window managers composite each window into its own buffer before drawing the screen.',
  sightings: [{ layer: 'application', critterLayer: 'application', detailNote: 'Blue and gold feathers over the desktop.' }],
  bugs: 'Mistakes the progress bar for a perch.',
  seeAlso: [],
};

const OTHER: ManualEntry = {
  ...CLEAN,
  id: 'prop-lock',
  name: 'Padlock',
  manTag: 'LOCK',
  kind: 'prop',
  blurb: 'A brass padlock hangs on the permissions door.',
  note: 'File permissions decide which users may read or write a file.',
  sightings: [{ layer: 'userspace', entityId: 'us-padlock' }],
  bugs: 'Opens for anyone who asks politely.',
};

function entry(patch: Partial<ManualEntry>): ManualEntry {
  return { ...CLEAN, ...patch };
}

/** Problems for `e` inside a two-entry registry, so cross-entry rules have something to point at. */
function problemsIn(e: ManualEntry): string[] {
  return styleProblems(e, [e, OTHER]);
}

function expectFlags(e: ManualEntry, pattern: RegExp) {
  const problems = problemsIn(e);
  expect(problems.some((p) => pattern.test(p)), `expected a problem matching ${pattern}; got ${JSON.stringify(problems)}`).toBe(true);
}

describe('styleProblems', () => {
  it('passes a clean synthetic entry', () => {
    expect(problemsIn(CLEAN)).toEqual([]);
    expect(styleProblems(CLEAN, [CLEAN])).toEqual([]);
  });

  it('passes a clean entry with a valid chapter suffix and see-also references', () => {
    const e = entry({ manTag: 'SONGBIRD(1)', seeAlso: ['prop-lock'] });
    expect(problemsIn(e)).toEqual([]);
  });

  describe('id', () => {
    it('must be lowercase hyphenated words', () => {
      expectFlags(entry({ id: 'Crit_Sky' }), /id must be lowercase/);
    });
    it(`is at most ${ID_MAX} characters`, () => {
      expectFlags(entry({ id: `crit-${'x'.repeat(ID_MAX)}` }), /id is \d+ characters/);
    });
    it('must be unique across the registry', () => {
      const dup = entry({ name: 'Sky Twin', manTag: 'SONGBIRD2' });
      expect(styleProblems(CLEAN, [CLEAN, dup])).toEqual(expect.arrayContaining([expect.stringMatching(/id is shared/)]));
    });
  });

  describe('name', () => {
    it(`is at most ${NAME_MAX} characters`, () => {
      expectFlags(entry({ name: `Skysprite${'x'.repeat(35)}` }), /name is \d+ characters/);
    });
    it('is at most four words', () => {
      expectFlags(entry({ name: 'Sky Sprite Mk Two Deluxe' }), /name has 5 words/);
    });
    it('avoids filler words, which only cost index rows', () => {
      expectFlags(entry({ name: 'Some Sky Sprite' }), /filler word "some"/);
    });
    it('keeps articles to the first word', () => {
      expectFlags(entry({ name: 'Sky of the Sprite' }), /article after the first word/);
    });
    it('is unique, ignoring case', () => {
      expect(styleProblems(CLEAN, [CLEAN, entry({ id: 'crit-other', name: 'sky sprite', manTag: 'OTHERBIRD' })]))
        .toEqual(expect.arrayContaining([expect.stringMatching(/shared with another entry/)]));
    });
    it('carries no dash clause', () => {
      expectFlags(entry({ name: 'Sky — Sprite' }), /dash clause/);
    });
    it('is never empty', () => {
      expectFlags(entry({ name: '   ' }), /name is empty/);
    });
  });

  describe('manTag', () => {
    it('base is uppercase hyphenated words', () => {
      expectFlags(entry({ manTag: 'lock-ness' }), /manTag base "lock-ness" must be UPPERCASE/);
    });
    it('base is at most 14 characters', () => {
      expectFlags(entry({ manTag: 'VERYLONGTAGBASE' }), /manTag base is 15 characters/);
    });
    it('base is unique across the registry', () => {
      expect(styleProblems(CLEAN, [CLEAN, entry({ id: 'crit-twin', name: 'Sky Twin', manTag: 'SONGBIRD' })]))
        .toEqual(expect.arrayContaining([expect.stringMatching(/manTag base "SONGBIRD" is shared/)]));
    });
    it('suffix must be the home chapter number, not a ring number', () => {
      expectFlags(entry({ manTag: 'SONGBIRD(−1)' }), /must be the chapter number/);
    });
    it('suffix must match the home chapter', () => {
      expectFlags(entry({ manTag: 'SONGBIRD(4)' }), /says chapter 4 but the home chapter .* is 1/);
    });
    it('an Endless-only entry carries no suffix', () => {
      const e = entry({ manTag: 'SONGBIRD(1)', sightings: [{ layer: 'internet', critterLayer: 'internet' }] });
      expectFlags(e, /Endless-only entry/);
    });
  });

  describe('blurb and note', () => {
    it(`blurb is one sentence of at most ${BLURB_MAX} characters`, () => {
      expectFlags(entry({ blurb: 'Glides lazily. Perches on titlebars.' }), /blurb must be exactly one sentence/);
      expectFlags(entry({ blurb: 'x'.repeat(BLURB_MAX) + '.' }), /blurb is \d+ characters/);
    });
    it(`note is one sentence of at most ${NOTE_MAX} characters`, () => {
      expectFlags(entry({ note: 'x'.repeat(NOTE_MAX) + '.' }), /note is \d+ characters/);
    });
    it('each must end with a full stop', () => {
      expectFlags(entry({ note: 'Window managers composite each window' }), /note must end with a full stop/);
    });
    it('refuses abbreviations whose stops break the sentence count', () => {
      expectFlags(entry({ note: 'Compositors handle windows, e.g. the desktop buffer.' }), /abbreviation/);
    });
    it('refuses exclamation marks', () => {
      expectFlags(entry({ blurb: 'Glides lazily over titlebars!' }), /blurb uses an exclamation mark/);
    });
    it('refuses emoji', () => {
      expectFlags(entry({ note: 'Windows are buffers 🪟 composited on screen.' }), /note contains an emoji/);
    });
    it('refuses second person', () => {
      expectFlags(entry({ blurb: 'Glides over the windows you opened.' }), /addresses the reader as "you"/);
    });
    it('refuses hype words', () => {
      expectFlags(entry({ blurb: 'An awesome sprite glides over titlebars.' }), /marketing language \("awesome"\)/);
    });
    it('refuses percentages and rarity tiers, which the binder shows itself', () => {
      expectFlags(entry({ blurb: 'Appears on 40% of days.' }), /states a percentage/);
      expectFlags(entry({ note: 'A rare visitor to the compositor.' }), /names a rarity tier \("rare"\)/);
    });
    it('the blurb must not restate the name, but the note may name the concept', () => {
      expectFlags(entry({ blurb: 'A sky sprite glides over titlebars.' }), /blurb restates the name/);
      expect(problemsIn(entry({ note: 'Sky sprites are what window managers draw as animated overlays.' }))).toEqual([]);
    });
    it('refuses line breaks and stray spacing', () => {
      expectFlags(entry({ note: 'Window managers\ncomposite windows.' }), /control character or a line break/);
      expectFlags(entry({ note: ' Window managers composite windows.' }), /leading or trailing spaces/);
      expectFlags(entry({ note: 'Window  managers composite windows.' }), /double space/);
    });
  });

  describe('bugs', () => {
    it('is required', () => {
      const { bugs: _bugs, ...rest } = CLEAN;
      expectFlags(rest as ManualEntry, /bugs is missing/);
    });
    it(`is one sentence of at most ${BUGS_MAX} characters`, () => {
      expectFlags(entry({ bugs: 'Opens early. Opens late.' }), /bugs must be exactly one sentence/);
      expectFlags(entry({ bugs: 'x'.repeat(BUGS_MAX) + '.' }), /bugs is \d+ characters/);
    });
    it('uses the same prose rules', () => {
      expectFlags(entry({ bugs: 'Perches on you!' }), /bugs (uses an exclamation|addresses)/);
    });
  });

  describe('seeAlso', () => {
    it(`lists at most ${SEE_ALSO_MAX} entries`, () => {
      const many = ['a-1', 'a-2', 'a-3', 'a-4'];
      const all = [CLEAN, OTHER, ...many.map((id) => entry({ id, name: `Thing ${id}`, manTag: `T${id.replace('-', '').toUpperCase()}` }))];
      expect(styleProblems(entry({ seeAlso: many }), all)).toEqual(expect.arrayContaining([expect.stringMatching(/lists 4 entries/)]));
    });
    it('names only existing ids', () => {
      expectFlags(entry({ seeAlso: ['prop-nowhere'] }), /unknown entry "prop-nowhere"/);
    });
    it('never points at itself', () => {
      expectFlags(entry({ seeAlso: ['crit-sky'] }), /points at itself/);
    });
    it('lists each id once', () => {
      expectFlags(entry({ seeAlso: ['prop-lock', 'prop-lock'] }), /lists "prop-lock" twice/);
    });
  });

  describe('sightings', () => {
    it('needs at least one', () => {
      expectFlags(entry({ sightings: [] }), /needs at least one sighting/);
    });
    it('must name a known layer', () => {
      expectFlags(entry({ sightings: [{ layer: 'nowhere' as ManualEntry['sightings'][number]['layer'] }] }), /unknown layer/);
    });
    it('must run shallowest first', () => {
      expectFlags(
        entry({
          sightings: [
            { layer: 'userspace', entityId: 'us-padlock' },
            { layer: 'application', entityId: 'app-clock' },
          ],
        }),
        /shallowest first/,
      );
    });
    it('allows one sighting per layer', () => {
      expectFlags(
        entry({
          kind: 'prop',
          sightings: [
            { layer: 'application', entityId: 'app-clock' },
            { layer: 'application', entityId: 'app-clock' },
          ],
        }),
        /two sightings on layer "application"/,
      );
    });
    it('critters set critterLayer to their own layer', () => {
      expectFlags(entry({ sightings: [{ layer: 'application', critterLayer: 'runtime' }] }), /must set critterLayer to the same layer/);
    });
    it('anomalies need a topicId', () => {
      expectFlags(entry({ kind: 'anomaly', sightings: [{ layer: 'application' }] }), /anomaly sighting .* needs a topicId/);
    });
    it('props carry no critterLayer or topicId', () => {
      expectFlags(entry({ kind: 'prop', sightings: [{ layer: 'application', critterLayer: 'application' }] }), /only critters set critterLayer/);
      expectFlags(entry({ kind: 'prop', sightings: [{ layer: 'application', topicId: 'tp-x' }] }), /only anomalies set topicId/);
    });
    it(`detail notes are one line of at most ${DETAIL_NOTE_MAX} characters`, () => {
      expectFlags(
        entry({ sightings: [{ layer: 'application', critterLayer: 'application', detailNote: 'x'.repeat(DETAIL_NOTE_MAX + 1) }] }),
        /detailNote on "application" is \d+ characters/,
      );
      expectFlags(
        entry({ sightings: [{ layer: 'application', critterLayer: 'application', detailNote: 'Blue\nfeathers' }] }),
        /must be one line/,
      );
    });
    it('detail notes avoid rarity words and second person', () => {
      expectFlags(
        entry({ sightings: [{ layer: 'application', critterLayer: 'application', detailNote: 'A mythic bird you can spot.' }] }),
        /detailNote on "application" names a rarity tier/,
      );
    });
  });

  it('kind must be critter, prop or anomaly', () => {
    expectFlags(entry({ kind: 'monster' as ManualEntry['kind'] }), /kind "monster" is not/);
  });

  it('reports every problem at once rather than stopping at the first', () => {
    const e = entry({ id: 'Bad_ID', name: 'Some Thing Very Long Indeed', blurb: 'Awesome!', bugs: undefined });
    expect(problemsIn(e).length).toBeGreaterThan(4);
  });
});
