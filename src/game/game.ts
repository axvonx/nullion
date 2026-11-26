import type { AnswerSet } from '../core/answers';
import { pickForDay, rng } from '../core/day';
import { enforce } from '../core/enforce';
import { PROMPTS_PER_DAY, type StackMode } from '../core/layers';
import type { CategoryEntry } from '../core/match';
import { TIERS } from '../core/tiers';
import type { Question } from '../data/sample';

export const READ_MS = 3000;
export const ANSWER_MS = 25000;
/** Endless mode strike budget: 3 watchdog fails (or skips) end the run in a Kernel Panic. */
export const ENDLESS_MAX_STRIKES = 3;

/** Endless per-prompt watchdog tightens as you descend deeper into the stack. */
export function endlessAnswerMs(depth: number): number {
  if (depth < 605) return 30000;
  if (depth < 1325) return 25000;
  if (depth < 2030) return 20000;
  return 16000;
}

export interface Round {
  question: Question;
  /** The first accepted answer: the only one that pushes frames. */
  locked?: { entry: CategoryEntry; corrected: boolean; guess: string };
  /** Further accepted answers in unlimited mode (debug); logged, no frames. */
  extra: CategoryEntry[];
  rejected: string[];
  timedOut: boolean;
  /** True when the round ended without an accepted answer (timeout or skip). */
  missed?: boolean;
}

export type Phase =
  | { kind: 'ready' }
  | { kind: 'reading'; round: number; until: number }
  | { kind: 'answering'; round: number; until: number | null }
  /** The tier reveal is up; waits for the player to press "Unwind further" (advance()). No timer. */
  | { kind: 'between'; round: number }
  | { kind: 'done' };

export type SubmitResult =
  | { kind: 'accepted'; entry: CategoryEntry; corrected: boolean; pushed: number }
  /** Confirm mode: the guess is a typo of `entry`. Nothing is locked; the player re-submits the corrected name. */
  | { kind: 'suggestion'; entry: CategoryEntry; guess: string }
  | { kind: 'duplicate'; entry: CategoryEntry }
  | { kind: 'rejected'; guess: string }
  | { kind: 'ignored' };

export interface GameOptions {
  timer: boolean;
  unlimited: boolean;
  /**
   * Typo handling. 'confirm': show the correction first and wait for the player to submit it.
   * 'auto': accept the corrected answer straight away. Mutable so a preference change applies mid-game.
   */
  autocorrect: 'confirm' | 'auto';
  /** Stack mode: 'daily' (7 fixed prompts) or 'endless' (3-strike watchdog descent). Defaults to 'daily'. */
  mode?: StackMode;
}

export class Game {
  readonly mode: StackMode;
  readonly maxStrikes: number;
  readonly rounds: Round[];
  phase: Phase = { kind: 'ready' };

  /** Rolling shuffle-bag for Endless mode so prompts never repeat back-to-back. */
  private endlessRand: () => number;
  private endlessBag: Question[] = [];
  private lastQuestionId = '';

  constructor(
    readonly set: AnswerSet,
    readonly puzzle: number,
    readonly opts: GameOptions,
  ) {
    this.mode = opts.mode ?? 'daily';
    this.maxStrikes = this.mode === 'endless' ? ENDLESS_MAX_STRIKES : 0;
    this.endlessRand = rng((Math.imul(puzzle | 0, 2654435761) ^ 0x517cc1b7) >>> 0);
    if (this.mode === 'endless') {
      enforce(set.questions.length > 0, 'endless mode requires at least one question');
      this.rounds = [this.makeRound(this.drawEndlessQuestion())];
    } else {
      this.rounds = pickForDay(set.questions, puzzle, PROMPTS_PER_DAY).map((q) => this.makeRound(q));
    }
  }

  private makeRound(question: Question): Round {
    return { question, extra: [], rejected: [], timedOut: false };
  }

  private drawEndlessQuestion(): Question {
    if (this.endlessBag.length === 0) {
      this.endlessBag = [...this.set.questions];
      for (let i = this.endlessBag.length - 1; i > 0; i--) {
        const j = Math.floor(this.endlessRand() * (i + 1));
        [this.endlessBag[i], this.endlessBag[j]] = [this.endlessBag[j]!, this.endlessBag[i]!];
      }
      if (this.endlessBag.length > 1 && this.endlessBag[this.endlessBag.length - 1]!.id === this.lastQuestionId) {
        const last = this.endlessBag.length - 1;
        [this.endlessBag[0], this.endlessBag[last]] = [this.endlessBag[last]!, this.endlessBag[0]!];
      }
    }
    const q = this.endlessBag.pop()!;
    this.lastQuestionId = q.id;
    return q;
  }

  get depth(): number {
    return this.rounds.reduce((d, r) => d + (r.locked ? TIERS[r.locked.entry.tier].frames : 0), 0);
  }

  /** Number of watchdog fails / missed prompts in the current run. */
  get strikes(): number {
    let n = 0;
    for (const r of this.rounds) if (!r.locked && (r.timedOut || r.missed)) n++;
    return n;
  }

  /** Remaining strikes in Endless mode (0 in Daily mode). */
  get strikesLeft(): number {
    return Math.max(0, this.maxStrikes - this.strikes);
  }

  /** Active per-prompt watchdog duration in ms. */
  get answerMs(): number {
    return this.mode === 'endless' ? endlessAnswerMs(this.depth) : ANSWER_MS;
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
      this.phase = { kind: 'answering', round: p.round, until: this.opts.timer ? now + this.answerMs : null };
      return true;
    }
    if (p.kind === 'answering' && p.until !== null && now >= p.until) {
      const r = this.rounds[p.round]!;
      if (!r.locked) {
        r.timedOut = true;
        r.missed = true;
      }
      this.toBetween(p.round, now);
      return true;
    }
    return false;
  }

  /** Move on: "Unwind further" after a reveal, debug "Next", or Enter on an empty box. */
  advance(now: number) {
    const p = this.phase;
    if (p.kind === 'reading') this.phase = { kind: 'answering', round: p.round, until: this.opts.timer ? now + this.answerMs : null };
    else if (p.kind === 'answering') {
      const r = this.rounds[p.round]!;
      if (!r.locked) r.missed = true;
      this.toBetween(p.round, now);
    } else if (p.kind === 'between') this.next(p.round, now);
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
    if (res.corrected && this.opts.autocorrect === 'confirm') return { kind: 'suggestion', entry: res.entry, guess: trimmed };
    if (!r.locked) {
      r.locked = { entry: res.entry, corrected: res.corrected, guess: trimmed };
      if (!this.opts.unlimited) this.toBetween(p.round, now);
      return { kind: 'accepted', entry: res.entry, corrected: res.corrected, pushed: TIERS[res.entry.tier].frames };
    }
    r.extra.push(res.entry);
    return { kind: 'accepted', entry: res.entry, corrected: res.corrected, pushed: 0 };
  }

  private toBetween(round: number, _now: number) {
    this.phase = { kind: 'between', round };
  }

  private next(round: number, now: number) {
    if (this.mode === 'endless') {
      if (this.strikes >= this.maxStrikes) {
        this.phase = { kind: 'done' };
        return;
      }
      this.rounds.push(this.makeRound(this.drawEndlessQuestion()));
      this.phase = { kind: 'reading', round: round + 1, until: now + READ_MS };
      return;
    }
    this.phase =
      round + 1 < this.rounds.length ? { kind: 'reading', round: round + 1, until: now + READ_MS } : { kind: 'done' };
  }
}
