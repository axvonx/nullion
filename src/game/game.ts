import type { AnswerSet } from '../core/answers';
import { enforce } from '../core/enforce';
import { PROMPTS_PER_DAY } from '../core/layers';
import type { CategoryEntry } from '../core/match';
import { TIERS } from '../core/tiers';
import { pickForDay } from '../core/day';
import type { Question } from '../data/sample';

export const READ_MS = 3000;
export const ANSWER_MS = 25000;
export const BETWEEN_MS = 1800;

export interface Round {
  question: Question;
  /** The first accepted answer: the only one that pushes frames. */
  locked?: { entry: CategoryEntry; corrected: boolean; guess: string };
  /** Further accepted answers in unlimited mode (debug); logged, no frames. */
  extra: CategoryEntry[];
  rejected: string[];
  timedOut: boolean;
}

export type Phase =
  | { kind: 'ready' }
  | { kind: 'reading'; round: number; until: number }
  | { kind: 'answering'; round: number; until: number | null }
  | { kind: 'between'; round: number; until: number }
  | { kind: 'done' };

export type SubmitResult =
  | { kind: 'accepted'; entry: CategoryEntry; corrected: boolean; pushed: number }
  | { kind: 'duplicate'; entry: CategoryEntry }
  | { kind: 'rejected'; guess: string }
  | { kind: 'ignored' };

export interface GameOptions {
  timer: boolean;
  unlimited: boolean;
}

export class Game {
  readonly rounds: Round[];
  phase: Phase = { kind: 'ready' };

  constructor(
    readonly set: AnswerSet,
    readonly puzzle: number,
    readonly opts: GameOptions,
  ) {
    this.rounds = pickForDay(set.questions, puzzle, PROMPTS_PER_DAY).map((question) => ({
      question,
      extra: [],
      rejected: [],
      timedOut: false,
    }));
  }

  get depth(): number {
    return this.rounds.reduce((d, r) => d + (r.locked ? TIERS[r.locked.entry.tier].frames : 0), 0);
  }

  current(): Round | undefined {
    const p = this.phase;
    return p.kind === 'reading' || p.kind === 'answering' || p.kind === 'between' ? this.rounds[p.round] : undefined;
  }

  start(now: number) {
    enforce(this.phase.kind === 'ready', `start() from ${this.phase.kind}`);
    this.phase = { kind: 'reading', round: 0, until: now + READ_MS };
  }

  /** Advance timed phases. Returns true if the phase changed. */
  tick(now: number): boolean {
    const p = this.phase;
    if (p.kind === 'reading' && now >= p.until) {
      this.phase = { kind: 'answering', round: p.round, until: this.opts.timer ? now + ANSWER_MS : null };
      return true;
    }
    if (p.kind === 'answering' && p.until !== null && now >= p.until) {
      const r = this.rounds[p.round]!;
      if (!r.locked) r.timedOut = true;
      this.toBetween(p.round, now);
      return true;
    }
    if (p.kind === 'between' && now >= p.until) {
      this.next(p.round, now);
      return true;
    }
    return false;
  }

  /** Skip ahead (debug "Next", or Enter on an empty box when nothing more can happen). */
  advance(now: number) {
    const p = this.phase;
    if (p.kind === 'reading') this.phase = { kind: 'answering', round: p.round, until: this.opts.timer ? now + ANSWER_MS : null };
    else if (p.kind === 'answering') this.toBetween(p.round, now);
    else if (p.kind === 'between') this.next(p.round, now);
  }

  submit(guess: string, now: number): SubmitResult {
    const p = this.phase;
    if (p.kind !== 'answering') return { kind: 'ignored' };
    const r = this.rounds[p.round]!;
    const trimmed = guess.trim();
    if (!trimmed) return { kind: 'ignored' };
    const res = this.set.check(r.question.id, trimmed);
    if (res.kind === 'rejected') {
      r.rejected.push(trimmed);
      return { kind: 'rejected', guess: trimmed };
    }
    if (r.locked?.entry === res.entry || r.extra.includes(res.entry)) return { kind: 'duplicate', entry: res.entry };
    if (!r.locked) {
      r.locked = { entry: res.entry, corrected: res.corrected, guess: trimmed };
      if (!this.opts.unlimited) this.toBetween(p.round, now);
      return { kind: 'accepted', entry: res.entry, corrected: res.corrected, pushed: TIERS[res.entry.tier].frames };
    }
    r.extra.push(res.entry);
    return { kind: 'accepted', entry: res.entry, corrected: res.corrected, pushed: 0 };
  }

  private toBetween(round: number, now: number) {
    this.phase = { kind: 'between', round, until: now + BETWEEN_MS };
  }

  private next(round: number, now: number) {
    this.phase =
      round + 1 < this.rounds.length ? { kind: 'reading', round: round + 1, until: now + READ_MS } : { kind: 'done' };
  }
}
