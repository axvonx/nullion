import { describe, expect, it } from 'vitest';
import { ALL_LAYER_IDS, type LayerId } from '../../core/layers';
import { ent, type EntityDef } from './kit';
import { LAYER_TOPIC_TAGS } from './layer-topics';
import { buildLibraries, MIN_NEAR_TYPES, type LayerSpec } from './library';
import { V4_LIBRARIES } from './libraries';

const stubs = (prefix: string, n: number, opts: Partial<EntityDef> = {}): EntityDef[] =>
  Array.from({ length: n }, (_, i) => ent(`${prefix}-${i}`, [[10, 10]], () => {}, opts));

/** A valid spec for every layer: 20 own props and one anchor each. */
function specs(patch: Partial<Record<LayerId, Partial<LayerSpec>>> = {}): Record<LayerId, LayerSpec> {
  return Object.fromEntries(
    ALL_LAYER_IDS.map((id) => [id, { own: stubs(id, 20), anchors: stubs(`${id}-anchor`, 1), density: 4, anchorCount: 1, far: 0, ...patch[id] }]),
  ) as Record<LayerId, LayerSpec>;
}

describe('buildLibraries', () => {
  it('builds a library per layer with default topic tags on every entity', () => {
    const libs = buildLibraries(specs(), LAYER_TOPIC_TAGS);
    expect(Object.keys(libs).sort()).toEqual([...ALL_LAYER_IDS].sort());
    for (const id of ALL_LAYER_IDS) for (const d of [...libs[id].near, ...libs[id].anchors]) expect(d.tags).toEqual(LAYER_TOPIC_TAGS[id]);
  });

  it('lets an entity override its layer tags', () => {
    const own = [...stubs('application', 19), ent('application-x', [[10, 10]], () => {}, { tags: ['math'] })];
    const libs = buildLibraries(specs({ application: { own } }), LAYER_TOPIC_TAGS);
    expect(libs.application.near.find((d) => d.id === 'application-x')!.tags).toEqual(['math']);
  });

  it('borrows renamed copies from the donor up to the target, in the donor order', () => {
    const libs = buildLibraries(specs({ internet: { own: stubs('net', 12), borrow: { from: 'application', prefix: 'net', upTo: 20 } } }), LAYER_TOPIC_TAGS);
    const ids = libs.internet.near.map((d) => d.id);
    expect(ids).toHaveLength(20);
    expect(ids.slice(12)).toEqual(Array.from({ length: 8 }, (_, i) => `net-application-${i}`));
  });

  it('borrowed copies drop the donor floor flag', () => {
    const donorOwn = stubs('application', 20, { floor: true });
    const libs = buildLibraries(specs({ application: { own: donorOwn, floorOffset: 3 }, internet: { own: stubs('net', 15), borrow: { from: 'application', prefix: 'net', upTo: 20 } } }), LAYER_TOPIC_TAGS);
    expect(libs.application.floor?.offset).toBe(3);
    expect(libs.application.floor?.ids.size).toBe(20);
    expect(libs.internet.floor).toBeUndefined();
  });

  it('throws on too few types, a short donor, a bad borrow, duplicate ids and a floor mismatch', () => {
    const run = (patch: Partial<Record<LayerId, Partial<LayerSpec>>>) => () => buildLibraries(specs(patch), LAYER_TOPIC_TAGS);
    expect(run({ internet: { own: stubs('net', MIN_NEAR_TYPES - 1) } })).toThrow(/needs at least 20/);
    expect(run({ internet: { own: stubs('net', 10), borrow: { from: 'application', prefix: 'net', upTo: 19 } } })).toThrow(/below the 20 minimum/);
    expect(run({ internet: { own: stubs('net', 10), borrow: { from: 'application', prefix: 'net', upTo: 40 } } })).toThrow(/needs 30 props from application, which has 20/);
    expect(run({ internet: { own: stubs('net', 10), borrow: { from: 'internet', prefix: 'net', upTo: 20 } } })).toThrow(/borrows from itself/);
    expect(run({ application: { own: [...stubs('application', 19), ...stubs('application', 1)] } })).toThrow(/duplicate entity id application-0/);
    expect(run({ application: { own: stubs('application', 20, { floor: true }) } })).toThrow(/floor props but no floorOffset/);
    expect(run({ application: { floorOffset: 4 } })).toThrow(/floorOffset but has no floor props/);
    expect(run({ application: { anchors: [stubs('application', 1)[0]!] } })).toThrow(/shared by a prop and an anchor/);
  });

  it('throws on a layer without default tags', () => {
    expect(() => buildLibraries(specs(), { ...LAYER_TOPIC_TAGS, application: [] })).toThrow(/no default topic tags/);
  });
});

describe('the real libraries', () => {
  it('keep the floor props of Libraries and Userspace', () => {
    expect(V4_LIBRARIES.libraries.floor?.offset).toBe(4);
    expect([...V4_LIBRARIES.libraries.floor!.ids].sort()).toEqual(['lib-abi-seal', 'lib-ar-binder', 'lib-bookdrop', 'lib-cart', 'lib-catalogue', 'lib-crates', 'lib-dlopen-lift', 'lib-globe', 'lib-lectern']);
    expect(V4_LIBRARIES.userspace.floor?.offset).toBe(6);
    expect(V4_LIBRARIES.userspace.floor?.ids.size).toBe(10);
    for (const id of ALL_LAYER_IDS) if (id !== 'libraries' && id !== 'userspace') expect(V4_LIBRARIES[id].floor, id).toBeUndefined();
  });

  it('name borrowed copies ${prefix}-${donor id} (the naming desk keys its records by these ids)', () => {
    expect(V4_LIBRARIES.internet.near.some((d) => d.id === 'net-app-clock')).toBe(true);
    expect(V4_LIBRARIES.linker.near.some((d) => d.id.startsWith('ld-lib-'))).toBe(true);
    expect(V4_LIBRARIES['kthread-kabin'].near.some((d) => d.id.startsWith('kabin-us-'))).toBe(true);
  });
});
