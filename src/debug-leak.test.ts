import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * The deploy refuses a production build that carries debug code (`.github/workflows/pages.yml` greps dist/ for these
 * markers). That check only runs in CI, so this one runs it on the sources at `npm test`: outside `src/debug/`, no
 * code may name a debug class or demo label. Mark debug elements with a neutral attribute instead
 * (`data-own-scroll`), and keep the markers here in step with the workflow's.
 */
const MARKERS = /dbg-|Play a sample day/;

function files(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return p === path.join('src', 'debug') ? [] : files(p);
    return /\.(ts|css|html)$/.test(e.name) && !/\.test\.ts$/.test(e.name) ? [p] : [];
  });
}

describe('production code carries no debug code', () => {
  it('no debug class or demo label outside src/debug/', () => {
    const hits = [...files('src'), 'index.html'].filter((f) => MARKERS.test(fs.readFileSync(f, 'utf8')));
    expect(hits).toEqual([]);
  });
});
