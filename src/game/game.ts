import type { AnswerSet } from '../core/answers';
import { pickForDay, rng } from '../core/day';
import { enforce } from '../core/enforce';
import { PROMPTS_PER_DAY, type StackMode } from '../core/layers';
import { rulesFor, type ModeRules } from '../core/modes';
import type { CategoryEntry } from '../core/match';
import { TIERS } from '../core/tiers';
import type { Question } from '../data/sample';

export const READ_MS = 3000;

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
  /**
   * What was in the box when the watchdog fired: it is submitted (typo correction applied) before the round times
   * out. Live only, never saved: a restored round just shows the plain timeout.
   */
  buzzer?: { guess: string; accepted: boolean };
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

/** The persisted shape of a daily game (see src/game/save.ts). `phase` is never 'ready': nothing is saved before Start. */
export interface GameSnapshot {
  v: 1;
  puzzle: number;
  rounds: {
    q: string;
    locked?: { name: string; corrected: boolean; guess: string };
    extra: string[];
    rejected: string[];
    timedOut: boolean;
    missed?: boolean;
  }[];
  phase:
    | { kind: 'reading'; round: number; until: number }
    | { kind: 'answering'; round: number; until: number | null }
    | { kind: 'between'; round: number }
    | { kind: 'done' };
}

/** A save that cannot be restored (corrupt, wrong shape, or from different questions). Expected input failure, not a bug. */
export class InvalidSaveError extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = 'InvalidSaveError';
  }
}

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
  readonly rules: ModeRules;
  readonly maxStrikes: number;
  readonly rounds: Round[];
  phase: Phase = { kind: 'ready' };
  /**
   * Bumped on every state change (including rejected guesses, which don't move the phase), so the host can
   * persist cheaply by comparing it. Times are in the caller's clock: pass wall-clock ms to make deadlines
   * survive reloads; this class never reads a clock itself.
   */
  rev = 0;

  /** Cooldown-aware shuffle bag for Endless mode so prompts avoid repeating across bag boundaries. */
  private endlessRand: () => number;
  private endlessBag: Question[] = [];
  private recentQuestionIds: string[] = [];

  constructor(
    readonly set: AnswerSet,
    readonly puzzle: number,
    readonly opts: GameOptions,
  ) {
    this.mode = opts.mode ?? 'daily';
    this.rules = rulesFor(this.mode);
    this.maxStrikes = this.rules.maxStrikes;
    this.endlessRand = rng((Math.imul(puzzle | 0, 2654435761) ^ 0x517cc1b7) >>> 0);
    if (this.rules.promptSource === 'pool') {
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
    }
    const cooldown = Math.min(this.set.questions.length - 1, Math.max(1, Math.floor(this.set.questions.length * 0.6)));
    let pickIdx = this.endlessBag.length - 1;
    if (cooldown > 0 && this.recentQuestionIds.length > 0) {
      const recent = new Set(this.recentQuestionIds);
      let foundFresh = false;
      for (let i = this.endlessBag.length - 1; i >= 0; i--) {
        if (!recent.has(this.endlessBag[i]!.id)) {
          pickIdx = i;
          foundFresh = true;
          break;
        }
      }
      if (!foundFresh) {
        // Every remaining item is in the cooldown window: pick the one seen longest ago.
        let oldestRank = Infinity;
        for (let i = this.endlessBag.length - 1; i >= 0; i--) {
          const rank = this.recentQuestionIds.indexOf(this.endlessBag[i]!.id);
          if (rank < oldestRank) {
            oldestRank = rank;
            pickIdx = i;
          }
        }
      }
    }
    const q = this.endlessBag.splice(pickIdx, 1)[0]!;
    if (cooldown > 0) {
      this.recentQuestionIds.push(q.id);
      if (this.recentQuestionIds.length > cooldown) this.recentQuestionIds.shift();
    }
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
    return this.rules.answerMs(this.depth);
  }

  current(): Round | undefined {
    const p = this.phase;
    return p.kind === 'reading' || p.kind === 'answering' || p.kind === 'between' ? this.rounds[p.round] : undefined;
  }

  start(now: number) {
    enforce(this.phase.kind === 'ready', `start() from ${this.phase.kind}`);
    this.phase = { kind: 'reading', round: 0, until: now + READ_MS };
    this.rev++;
  }

  /**
   * Advance timed phases. Returns true if the phase changed. Deadlines chain from the previous deadline, not from
   * `now`, so being away (hidden tab, closed page) never grants extra time: a tick long after the fact replays
   * reading, answering and the timeout in one call.
   */
  /**
   * What the player has typed but not submitted (the HUD's input). When the watchdog fires it is submitted first,
   * with typo correction applied whatever the preference, and the round times out only if that misses.
   */
  draft: () => string = () => '';

  tick(now: number): boolean {
    let changed = false;
    for (;;) {
      const p = this.phase;
      if (p.kind === 'reading' && now >= p.until) {
        this.phase = { kind: 'answering', round: p.round, until: this.opts.timer ? p.until + this.answerMs : null };
      } else if (p.kind === 'answering' && p.until !== null && now >= p.until) {
        const r = this.rounds[p.round]!;
        if (!r.locked) this.buzzer(r);
        if (!r.locked) {
          r.timedOut = true;
          r.missed = true;
        }
        this.toBetween(p.round, now);
      } else break;
      changed = true;
      this.rev++;
    }
    return changed;
  }

  /** Move on: "Unwind further" after a reveal, debug "Next", or Enter on an empty box. */
  advance(now: number) {
    const p = this.phase;
    this.rev++;
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
    this.rev++;
    const res = this.set.check(r.question.id, trimmed);
    if (res.kind === 'rejected') {
      r.rejected.push(trimmed);
      return { kind: 'rejected', guess: trimmed };
    }
    if (r.locked?.entry === res.entry || r.extra.includes(res.entry)) return { kind: 'duplicate', entry: res.entry };
    // Ask first only when the correction is a real judgement call: one typo on a long name needs no confirming.
    if (res.corrected && !res.sure && this.opts.autocorrect === 'confirm') return { kind: 'suggestion', entry: res.entry, guess: trimmed };
    if (!r.locked) {
      r.locked = { entry: res.entry, corrected: res.corrected, guess: trimmed };
      if (!this.opts.unlimited) this.toBetween(p.round, now);
      return { kind: 'accepted', entry: res.entry, corrected: res.corrected, pushed: TIERS[res.entry.tier].frames };
    }
    r.extra.push(res.entry);
    return { kind: 'accepted', entry: res.entry, corrected: res.corrected, pushed: 0 };
  }

  /** The watchdog fired with text in the box: try it once, correction applied. A miss is logged as a rejected guess. */
  private buzzer(r: Round) {
    const guess = this.draft().trim();
    if (!guess) return;
    const res = this.set.check(r.question.id, guess);
    if (res.kind === 'accepted') {
      r.locked = { entry: res.entry, corrected: res.corrected, guess };
      r.buzzer = { guess, accepted: true };
    } else {
      r.rejected.push(guess);
      r.buzzer = { guess, accepted: false };
    }
  }

  private toBetween(round: number, _now: number) {
    this.phase = { kind: 'between', round };
  }

  private next(round: number, now: number) {
    if (this.rules.promptSource === 'pool') {
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

  /** The daily game's persistable state. Daily only: Endless is never saved. */
  snapshot(): GameSnapshot {
    enforce(this.rules.persistsDaily, 'only a daily game can be saved');
    const p = this.phase;
    enforce(p.kind !== 'ready', 'a game that has not started has nothing to save');
    return {
      v: 1,
      puzzle: this.puzzle,
      rounds: this.rounds.map((r) => ({
        q: r.question.id,
        ...(r.locked ? { locked: { name: r.locked.entry.name, corrected: r.locked.corrected, guess: r.locked.guess } } : {}),
        extra: r.extra.map((e) => e.name),
        rejected: [...r.rejected],
        timedOut: r.timedOut,
        ...(r.missed ? { missed: true } : {}),
      })),
      phase: { ...p },
    };
  }

  /**
   * Load a saved state into a game that has not started. Validates everything before changing anything and throws
   * InvalidSaveError (never a silent reset) if the data is not a state this game could have produced.
   */
  restore(raw: unknown): void {
    enforce(this.phase.kind === 'ready', `restore() from ${this.phase.kind}`);
    enforce(this.rules.persistsDaily, 'only a daily game can be restored');
    const bad = (why: string): never => {
      throw new InvalidSaveError(why);
    };
    const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x);
    const isStrs = (x: unknown): x is string[] => Array.isArray(x) && x.every((v) => typeof v === 'string');
    if (!isObj(raw)) return bad('not an object');
    if (raw.v !== 1) return bad(`unknown version ${String(raw.v)}`);
    if (raw.puzzle !== this.puzzle) return bad(`save is for puzzle ${String(raw.puzzle)}, not ${this.puzzle}`);
    if (!Array.isArray(raw.rounds) || raw.rounds.length !== this.rounds.length) return bad('wrong number of rounds');
    const rounds: Round[] = [];
    raw.rounds.forEach((sr: unknown, i: number) => {
      const mine = this.rounds[i]!;
      if (!isObj(sr)) return bad(`round ${i} is not an object`);
      if (sr.q !== mine.question.id) return bad(`round ${i} asks '${String(sr.q)}', today's prompt is '${mine.question.id}'`);
      const entries = this.set.entries(mine.question.id);
      const find = (name: unknown) => {
        const e = typeof name === 'string' ? entries.find((x) => x.name === name) : undefined;
        return e ?? bad(`round ${i}: unknown answer ${JSON.stringify(name)}`);
      };
      if (!isStrs(sr.extra) || !isStrs(sr.rejected)) return bad(`round ${i}: extra/rejected must be string lists`);
      if (typeof sr.timedOut !== 'boolean') return bad(`round ${i}: timedOut must be a boolean`);
      if (sr.missed !== undefined && typeof sr.missed !== 'boolean') return bad(`round ${i}: missed must be a boolean`);
      const round: Round = { question: mine.question, extra: sr.extra.map(find), rejected: [...sr.rejected], timedOut: sr.timedOut };
      if (sr.missed) round.missed = true;
      if (sr.locked !== undefined) {
        const l = sr.locked;
        if (!isObj(l) || typeof l.corrected !== 'boolean' || typeof l.guess !== 'string') return bad(`round ${i}: malformed locked answer`);
        round.locked = { entry: find(l.name), corrected: l.corrected, guess: l.guess };
      }
      rounds.push(round);
    });
    const sp = raw.phase;
    if (!isObj(sp)) return bad('phase is not an object');
    let phase: Phase;
    const idx = (): number =>
      typeof sp.round === 'number' && Number.isInteger(sp.round) && sp.round >= 0 && sp.round < rounds.length
        ? sp.round
        : bad(`phase round ${String(sp.round)} out of range`);
    if (sp.kind === 'reading') {
      if (typeof sp.until !== 'number' || !Number.isFinite(sp.until)) return bad('reading deadline is not a number');
      phase = { kind: 'reading', round: idx(), until: sp.until };
    } else if (sp.kind === 'answering') {
      if (typeof sp.until !== 'number' || !Number.isFinite(sp.until)) return bad('answer deadline is not a number');
      phase = { kind: 'answering', round: idx(), until: sp.until };
    } else if (sp.kind === 'between') phase = { kind: 'between', round: idx() };
    else if (sp.kind === 'done') phase = { kind: 'done' };
    else return bad(`unknown phase ${JSON.stringify(sp.kind)}`);
    // Rounds before the current one are over: each has an answer or was missed.
    const upTo = phase.kind === 'done' ? rounds.length : phase.round;
    for (let i = 0; i < upTo; i++) if (!rounds[i]!.locked && !rounds[i]!.missed && !rounds[i]!.timedOut) return bad(`round ${i} is over but has no outcome`);
    if (phase.kind === 'between' && !rounds[phase.round]!.locked && !rounds[phase.round]!.missed && !rounds[phase.round]!.timedOut)
      return bad('round is over but has no outcome');

    this.rounds.splice(0, this.rounds.length, ...rounds);
    this.phase = phase;
    this.rev++;
  }
}
