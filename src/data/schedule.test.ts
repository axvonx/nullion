import { readFileSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { formatLocalDate, puzzleNumber, EPOCH } from '../core/day';
import { parseIndex } from './bank-format';
import { MIN_DAYS_AHEAD, SCHEDULE_DAYS_AHEAD, extendSchedule, formatSchedule, parseSchedule } from './schedule';

const indexPath = new URL('../../bank/index.md', import.meta.url);
const schedulePath = new URL('../../bank/schedule.md', import.meta.url);
const dateOf = (p: number) => formatLocalDate(new Date(EPOCH.y, EPOCH.m - 1, EPOCH.d + p - 1));

describe('daily schedule', () => {
  it('bank/schedule.md is valid, scheduled far enough ahead, and only asks approved categories from today on', () => {
    const approved = parseIndex(readFileSync(indexPath, 'utf8')).filter((r) => r.status === 'approved');
    const today = puzzleNumber(new Date());
    if (process.env.UPDATE_SCHEDULE === '1') {
      // Regenerate: today and earlier stay frozen, the future is rescheduled from the current approved pool.
      const current = parseSchedule(readFileSync(schedulePath, 'utf8'));
      const next = extendSchedule(current, approved, today, today + SCHEDULE_DAYS_AHEAD);
      writeFileSync(schedulePath, formatSchedule(next, dateOf));
    }
    const s = parseSchedule(readFileSync(schedulePath, 'utf8'));
    const last = Math.max(...s.keys());
    expect(last - today, `bank/schedule.md ends at #${last}; run npm run bank:schedule`).toBeGreaterThanOrEqual(MIN_DAYS_AHEAD);
    const ok = new Set(approved.map((r) => r.id));
    for (const [p, ids] of s) {
      if (p < today) continue;
      for (const id of ids) expect(ok.has(id), `puzzle #${p} asks ${id}, which is not approved`).toBe(true);
    }
  });

  it('frozen rows survive regeneration; the future honours cooldown and the domain cap', () => {
    const pool = Array.from({ length: 28 }, (_, i) => ({ id: `c${i}`, domain: `d${i % 4}` }));
    const first = extendSchedule(new Map(), pool, 0, 30);
    expect(first.size).toBe(30);
    // Days 1..10 are frozen; growing the pool only changes the future.
    const bigger = [...pool, ...Array.from({ length: 14 }, (_, i) => ({ id: `n${i}`, domain: 'd0' }))];
    const second = extendSchedule(first, bigger, 10, 40);
    for (let p = 1; p <= 10; p++) expect(second.get(p)).toEqual(first.get(p));
    expect(second.size).toBe(40);
    const cooldown = Math.floor(28 / 7) - 1;
    const lastSeen = new Map<string, number>();
    for (let p = 1; p <= 30; p++) {
      const day = first.get(p)!;
      expect(new Set(day).size).toBe(7);
      for (const id of day) {
        const prev = lastSeen.get(id);
        if (prev !== undefined) expect(p - prev).toBeGreaterThan(cooldown);
        lastSeen.set(id, p);
      }
      const perDomain = new Map<string, number>();
      for (const id of day) perDomain.set(pool.find((c) => c.id === id)!.domain, (perDomain.get(pool.find((c) => c.id === id)!.domain) ?? 0) + 1);
      for (const n of perDomain.values()) expect(n).toBeLessThanOrEqual(3);
    }
  });

  it('rejects malformed schedules loudly', () => {
    expect(() => parseSchedule('| 1 | d | a, b |\n')).toThrow(/has 2 prompts/);
    expect(() => parseSchedule('| 2 | d | a, b, c, d, e, f, g |\n')).toThrow(/without gaps/);
    expect(() => parseSchedule('| 1 | d | a, a, c, d, e, f, g |\n')).toThrow(/repeats/);
  });
});
