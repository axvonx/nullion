import { describe, expect, it } from 'vitest';
import { ManualFormatError, formatManualEntry, type ManualEntry } from '../data/manual-format';
import { compareEntries, currentWorld, loadManualEntries, validateManualEntries, type ManualWorld } from './manual-registry';
import { styleProblems } from './manual-style';
import manualFiles from 'virtual:manual-files';

/**
 * Style problems the 38 hand-written entries that predate the style guide still have. The test below requires each
 * entry's problems to equal this table exactly: a new problem fails, and so does a fixed one that is still listed,
 * so the debt can only shrink. Delete an entry's row when its page is brought up to the guide.
 */
const LEGACY_STYLE_DEBT: Record<string, readonly string[]> = {
  'crit-songbird': [
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'crit-helper': [
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'crit-bookworm': [
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'crit-daemon': [
    "manTag says chapter 8 but the home chapter (first Daily sighting, \"userspace\") is 4",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'crit-threadbot': [
    "manTag says chapter 0 but the home chapter (first Daily sighting, \"kernel\") is 5",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'crit-beetle': [
    "manTag says chapter 4 but the home chapter (first Daily sighting, \"drivers\") is 6",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'crit-sentinel': [
    "manTag says chapter 4 but the home chapter (first Daily sighting, \"firmware\") is 7",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'crit-wisp': [
    "manTag suffix \"(−1)\" must be the chapter number like (4); the binder adds it, so write the base alone",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'crit-ghost': [
    "manTag suffix \"(−2)\" must be the chapter number like (4); the binder adds it, so write the base alone",
    "blurb must be exactly one sentence (found 2)",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'crit-mote': [
    "manTag suffix \"(−3)\" must be the chapter number like (4); the binder adds it, so write the base alone",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'small-ben': [
    "manTag says chapter 2 but the home chapter (first Daily sighting, \"application\") is 1",
    "blurb addresses the reader as \"you\"",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'lock-ness': [
    "manTag suffix \"(−2)\" must be the chapter number like (4); the binder adds it, so write the base alone",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'chrono-glass': [
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'silicon-heart': [
    "manTag suffix \"(−3)\" must be the chapter number like (4); the binder adds it, so write the base alone",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'master-key': [
    "manTag suffix \"(−3)\" must be the chapter number like (4); the binder adds it, so write the base alone",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'cooling-spinner': [
    "manTag says chapter 4 but the home chapter (first Daily sighting, \"drivers\") is 6",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'watchdog-timer': [
    "manTag says chapter 0 but the home chapter (first Daily sighting, \"kernel\") is 5",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'interrupt-flag': [
    "manTag says chapter 4 but the home chapter (first Daily sighting, \"drivers\") is 6",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
    "sightings must run shallowest first; \"kernel-arch\" comes after a deeper layer",
  ],
  'spinner-wheel': [
    "blurb must be exactly one sentence (found 2)",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'trash-bin': [
    "blurb addresses the reader as \"you\"",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'gc-sweeper': [
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'stack-frame': [
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'quill-ink': [
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'card-cat': [
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'mailbox-ipc': [
    "manTag says chapter 8 but the home chapter (first Daily sighting, \"userspace\") is 4",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'kernel-furnace': [
    "manTag says chapter 0 but the home chapter (first Daily sighting, \"kernel\") is 5",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'oscilloscope': [
    "manTag says chapter 4 but the home chapter (first Daily sighting, \"drivers\") is 6",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'floppy-relic': [
    "manTag says chapter 4 but the home chapter (first Daily sighting, \"firmware\") is 7",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'vault-keeper': [
    "manTag says chapter 4 but the home chapter (first Daily sighting, \"firmware\") is 7",
    "note addresses the reader as \"you\"",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'twin-masks': [
    "manTag suffix \"(−1)\" must be the chapter number like (4); the binder adds it, so write the base alone",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'hypervisor-eye': [
    "manTag suffix \"(−1)\" must be the chapter number like (4); the binder adds it, so write the base alone",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'frozen-metro': [
    "manTag suffix \"(−2)\" must be the chapter number like (4); the binder adds it, so write the base alone",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'frozen-drop': [
    "manTag suffix \"(−2)\" must be the chapter number like (4); the binder adds it, so write the base alone",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'rf-tower': [
    "manTag suffix \"(−3)\" must be the chapter number like (4); the binder adds it, so write the base alone",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'transistor-node': [
    "manTag suffix \"(−3)\" must be the chapter number like (4); the binder adds it, so write the base alone",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'anom-bst': [
    "manTag says chapter 7 but the home chapter (first Daily sighting, \"application\") is 1",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'anom-sort': [
    "manTag says chapter 7 but the home chapter (first Daily sighting, \"runtime\") is 2",
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
  'anom-crypto': [
    "rumour is missing; every entry needs a hand-written locked-page rumour",
  ],
};

const SAMPLE: ManualEntry = {
  id: 'prop-sample',
  name: 'Sample Prop',
  manTag: 'SAMPLE-PROP(1)',
  kind: 'prop',
  rarity: 'common',
  status: 'approved',
  blurb: 'A sample prop on the desktop.',
  note: 'Samples stand in for real things.',
  sightings: [{ layer: 'application', entityId: 'app-clock' }],
};

const FILES = (...es: ManualEntry[]) => Object.fromEntries(es.map((e) => [`writing/manual/${e.sightings[0]!.layer}/${e.id}.md`, formatManualEntry(e)]));

describe('the shipped Field Manual files', () => {
  it('loads (every file parses and every sighting resolves) in debug and production views', () => {
    const all = loadManualEntries(manualFiles, true);
    const approved = loadManualEntries(manualFiles, false);
    expect(approved.length).toBeGreaterThanOrEqual(38);
    expect(approved.every((e) => e.status === 'approved')).toBe(true);
    expect(all.length).toBeGreaterThan(approved.length);
    expect(() => validateManualEntries(all, currentWorld())).not.toThrow();
  });

  it('keeps approved entries to their known style debt and drafts to the style rules that apply to drafts', () => {
    const all = loadManualEntries(manualFiles, true);
    for (const e of all) {
      const problems = styleProblems(e, all);
      if (e.status === 'approved') expect(problems, `${e.id}`).toEqual(LEGACY_STYLE_DEBT[e.id] ?? []);
      else expect(problems, `${e.id} (draft)`).toEqual([]);
    }
    for (const id of Object.keys(LEGACY_STYLE_DEBT)) expect(all.some((e) => e.id === id && e.status === 'approved'), `${id} is in LEGACY_STYLE_DEBT but is not an approved entry`).toBe(true);
  });

  it('orders approved pages by their page numbers, then drafts by id', () => {
    const all = loadManualEntries(manualFiles, true);
    const approved = all.filter((e) => e.status === 'approved');
    expect(approved.map((e) => e.page)).toEqual(approved.map((_, i) => i + 1));
    expect(all.slice(approved.length).every((e) => e.status === 'draft')).toBe(true);
  });
});

describe('loadManualEntries', () => {
  const draft: ManualEntry = { ...SAMPLE, id: 'prop-draft', name: 'Draft Prop', manTag: 'DRAFT-PROP(1)', status: 'draft', sightings: [{ layer: 'application', entityId: 'app-trash' }] };

  it('leaves drafts out unless asked', () => {
    const files = FILES(SAMPLE, draft);
    expect(loadManualEntries(files, false).map((e) => e.id)).toEqual(['prop-sample']);
    expect(loadManualEntries(files, true).map((e) => e.id)).toEqual(['prop-sample', 'prop-draft']);
  });

  it('names the file and line of a malformed entry', () => {
    const bad = { 'writing/manual/application/prop-sample.md': formatManualEntry(SAMPLE).replace('## Sightings', '## Sighting') };
    expect(() => loadManualEntries(bad, true)).toThrow(ManualFormatError);
    expect(() => loadManualEntries(bad, true)).toThrow(/manual\/application\/prop-sample\.md:\d+: expected "## Sightings"/);
  });

  it('refuses an empty manual and a stray path', () => {
    expect(() => loadManualEntries({}, true)).toThrow(/no manual/);
    expect(() => loadManualEntries({ 'notes/readme.md': 'x' }, true)).toThrow(/not writing\/manual\/<layer>\/<id>\.md/);
  });

  it('orders by page, then approved before draft, then id', () => {
    const a = { ...SAMPLE, id: 'a-one', page: 2 };
    const b = { ...SAMPLE, id: 'b-two', page: 1 };
    const c = { ...SAMPLE, id: 'c-three' };
    const d = { ...SAMPLE, id: 'a-draft', status: 'draft' as const };
    expect([c, d, a, b].sort(compareEntries).map((e) => e.id)).toEqual(['b-two', 'a-one', 'c-three', 'a-draft']);
  });
});

describe('validateManualEntries', () => {
  const world: ManualWorld = {
    entities: new Map([['application', new Set(['app-clock', 'app-trash'])]]),
    critterLayers: new Set(['application']),
    topicIds: new Set(['tp-dsa-tree']),
  } as ManualWorld;
  const other: ManualEntry = { ...SAMPLE, id: 'prop-other', name: 'Other Prop', manTag: 'OTHER-PROP(1)', sightings: [{ layer: 'application', entityId: 'app-trash' }] };

  it('accepts entries that resolve', () => {
    expect(() => validateManualEntries([SAMPLE, other], world)).not.toThrow();
  });

  it('throws on an entity missing from the layer library', () => {
    expect(() => validateManualEntries([{ ...SAMPLE, sightings: [{ layer: 'runtime', entityId: 'app-clock' }] }], world)).toThrow(/not in the runtime library/);
    expect(() => validateManualEntries([{ ...SAMPLE, sightings: [{ layer: 'application', entityId: 'app-gone' }] }], world)).toThrow(/app-gone/);
  });

  it('throws on a missing critter species, topic, duplicate id, double claim and dangling SEE ALSO', () => {
    expect(() => validateManualEntries([{ ...SAMPLE, kind: 'critter', sightings: [{ layer: 'runtime', critterLayer: 'runtime' }] }], world)).toThrow(/no species/);
    expect(() => validateManualEntries([{ ...SAMPLE, kind: 'anomaly', sightings: [{ layer: 'application', topicId: 'tp-nope' }] }], world)).toThrow(/tp-nope/);
    expect(() => validateManualEntries([SAMPLE, { ...other, id: SAMPLE.id }], world)).toThrow(/two entries have id/);
    expect(() => validateManualEntries([SAMPLE, { ...other, sightings: SAMPLE.sightings }], world)).toThrow(/claimed by both/);
    expect(() => validateManualEntries([{ ...SAMPLE, seeAlso: ['prop-missing'] }], world)).toThrow(/SEE ALSO prop-missing/);
  });
});
