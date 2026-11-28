import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { WritingFormatError, parseWritingFile, placeholdersOf } from './data/writing-format';
import { text, variants, writingCatalog } from './text';

const SRC = join(import.meta.dirname);

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name);
    if (d.isDirectory()) return sourceFiles(p);
    return d.name.endsWith('.ts') && !d.name.endsWith('.test.ts') && !d.name.endsWith('.d.ts') && d.name !== 'text.ts' ? [p] : [];
  });
}

/** Every key code reads: `text('a.b')` / `variants('a.b')`, with a string literal. */
function usedKeys(): Map<string, string[]> {
  const used = new Map<string, string[]>();
  for (const f of sourceFiles(SRC)) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/(?<![.\w])(?:text|variants)\(\s*'([^']+)'/g)) {
      used.set(m[1]!, [...(used.get(m[1]!) ?? []), relative(SRC, f)]);
    }
  }
  return used;
}

/** The var names a call passes: `{ guess }`, `{ guess: x }`, `{ a, b: c }`. Undefined when the call passes none. */
function passedVars(): Map<string, Set<string>[]> {
  const out = new Map<string, Set<string>[]>();
  for (const f of sourceFiles(SRC)) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/(?<![.\w])(?:text|variants)\(\s*'([^']+)'\s*(?:,\s*\{([^}]*)\})?\s*\)/g)) {
      const names = new Set<string>();
      for (const part of (m[2] ?? '').split(',')) {
        const name = /^\s*([A-Za-z0-9_]+)/.exec(part)?.[1];
        if (name) names.add(name);
      }
      out.set(m[1]!, [...(out.get(m[1]!) ?? []), names]);
    }
  }
  return out;
}

describe('writing catalog', () => {
  const catalog = writingCatalog();

  it('has strings', () => {
    expect(catalog.size).toBeGreaterThan(0);
  });

  it('every key used in code exists', () => {
    const missing = [...usedKeys()].filter(([k]) => !catalog.has(k)).map(([k, files]) => `${k} (${files.join(', ')})`);
    expect(missing).toEqual([]);
  });

  it('every key is used by code', () => {
    const used = usedKeys();
    // Layer strings are read by id: layers.<id>.blurb / layers.<id>.exit in src/layers/<file>.ts, always via a literal.
    const unused = [...catalog.keys()].filter((k) => !used.has(k));
    expect(unused).toEqual([]);
  });

  it('declared vars are used in the text and passed by every call', () => {
    const calls = passedVars();
    const bad: string[] = [];
    for (const [key, sets] of calls) {
      const s = catalog.get(key);
      if (!s) continue;
      for (const names of sets) {
        const got = [...names].sort().join(',');
        const want = [...s.vars].sort().join(',');
        if (got !== want) bad.push(`${key}: code passes {${got}}, writing declares {${want}}`);
      }
      for (const t of s.texts) for (const p of placeholdersOf(t)) if (!s.vars.includes(p) && p !== 'sq') bad.push(`${key}: {${p}} undeclared`);
    }
    expect(bad).toEqual([]);
  });

  it('respects max:', () => {
    const over = [...catalog.values()].flatMap((s) => (s.max === undefined ? [] : s.texts.filter((t) => t.length > s.max!).map((t) => `${s.key}: ${t}`)));
    expect(over).toEqual([]);
  });

  it('is plain text: no emoji, no stray spacing, no markup', () => {
    const bad: string[] = [];
    for (const s of catalog.values()) {
      for (const t of s.texts) {
        if (/\p{Extended_Pictographic}/u.test(t)) bad.push(`${s.key}: emoji in "${t}"`);
        if (/ {2,}|\t/.test(t)) bad.push(`${s.key}: repeated spaces or tab in "${t}"`);
        if (t !== t.trim()) bad.push(`${s.key}: leading or trailing space in "${t}"`);
        if (/[<>]/.test(t.replace(/\{[^}]*\}/g, ''))) bad.push(`${s.key}: markup characters in "${t}"`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('every file in writing/ parses (the plugin and this check read the same files)', () => {
    const dir = join(SRC, '..', 'writing');
    const files = readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md' && f !== 'VOICE.md');
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) expect(() => parseWritingFile(`writing/${f}`, readFileSync(join(dir, f), 'utf8'))).not.toThrow();
  });

  it('the accessors are strict', () => {
    expect(() => text('nope.missing')).toThrow(/no text/);
    expect(() => text('reveal.quip.leak')).toThrow(/use variants/);
    expect(() => variants('reveal.timeout.line')).toThrow(/use text/);
    expect(() => text('reveal.timeout.rejected')).toThrow(/missing guess/);
    expect(() => text('reveal.timeout.rejected', { guess: 'x', other: 1 })).toThrow(/unexpected other/);
    expect(text('reveal.timeout.rejected', { guess: 'x' })).toContain('x');
  });
});

describe('writing grammar', () => {
  const ok = '## demo.one\nwhere: here\nwhen: now\nstatus: draft\n\nHello.\n';
  const parse = (s: string) => parseWritingFile('writing/demo.md', s);

  it('parses a paragraph and a list', () => {
    expect(parse(ok)[0]!.texts).toEqual(['Hello.']);
    const l = parse('## demo.l\nwhere: a\nwhen: b\nstatus: owner\n\n- One\n- Two\n')[0]!;
    expect(l.list).toBe(true);
    expect(l.texts).toEqual(['One', 'Two']);
  });

  it.each([
    ['unknown metadata', ok.replace('when: now', 'when: now\nmood: sad'), /unknown metadata/],
    ['missing where', ok.replace('where: here\n', ''), /no "where:"/],
    ['bad status', ok.replace('draft', 'final'), /status must be/],
    ['duplicate key', `${ok}\n${ok}`, /duplicate key/],
    ['wrong file prefix', ok.replace('demo.one', 'other.one'), /must start with "demo\."/],
    ['undeclared var', ok.replace('Hello.', 'Hello {who}.'), /not declared/],
    ['unused var', ok.replace('status: draft', 'vars: {who}\nstatus: draft'), /no text uses it/],
    ['over max', ok.replace('status: draft', 'max: 3\nstatus: draft'), /over max/],
    ['mixed list', ok.replace('Hello.', '- a\nb'), /mixes/],
    ['no text', ok.replace('Hello.\n', ''), /no text/],
  ])('rejects %s with file:line', (_n, src, re) => {
    expect(() => parse(src)).toThrow(re);
    try {
      parse(src);
    } catch (e) {
      expect(e).toBeInstanceOf(WritingFormatError);
      expect((e as Error).message).toMatch(/^writing\/demo\.md:\d+:/);
    }
  });
});
