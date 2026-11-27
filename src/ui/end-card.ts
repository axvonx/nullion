import { enforce } from '../core/enforce';
import { formatCountdown, msUntilNextDay, puzzleNumber } from '../core/day';
import type { CategoryEntry } from '../core/match';
import { layerAt, rulesFor } from '../core/modes';
import { TIER_IDS, TIERS, type TierId } from '../core/tiers';
import type { Game } from '../game/game';
import { manualStore } from '../game/manual';
import { buildShareText, deliverShare, siteUrl } from '../game/share';
import type { StatsOutcome } from '../game/stats';
import { answerSheet, answerUrl, questionUrl, type SheetGroup } from './answer-sheet';
import { elementsOf, framesLabel, replay, setText } from './dom';
import { bankLink } from '../data/bank';
import { missedAnswerUrl, suggestQuestionUrl } from './issues';
import { manualBookIcon } from './manual-icon';
import { tierIcon } from './tier-icons';

/** One line of the day's record: an accepted answer, or a round that pushed nothing. */
export interface RecordRow {
  /** The prompt's question id: lets the row open its answer sheet. */
  question?: string;
  tier?: TierId;
  name?: string;
  timedOut?: boolean;
}

/** A finished game's rows, in round order. */
export function rowsOf(g: Game): RecordRow[] {
  return g.rounds.map((r) => (r.locked ? { question: r.question.id, tier: r.locked.entry.tier, name: r.locked.entry.name } : { question: r.question.id, timedOut: r.timedOut }));
}

/** The share button says what it will do: native share where the device has it, else copy. */
function shareLabel(): string {
  return typeof navigator.share === 'function' ? 'Share result' : 'Copy result';
}

/** The end card's markup: it sits inside the console panel and replaces the prompt when the game is done. */
export const END_CARD_HTML = `
        <div class="result" data-el="result" hidden>
          <div class="wordmark">nullion <span data-el="puzzleNo"></span></div>
          <div class="headline" data-el="headline"></div>
          <ol class="record" data-el="record" aria-label="Today’s backtrace, most recent first"></ol>
          <div class="stats" data-el="stats" hidden></div>
          <div class="result-foot"><span class="next-day" data-el="nextDay">A new stack opens at local midnight.</span><button type="button" data-el="copy">Copy result</button></div>
          <div class="result-manual"><button type="button" class="fm-end-btn" data-el="manualEndBtn"><span class="fm-end-text"><strong data-el="manualEndTitle">Field Manual</strong><span class="fm-end-sub" data-el="manualEndSub"></span></span><span class="fm-end-badge" data-el="manualEndBadge" hidden></span></button></div>
          <div class="result-links" data-el="resultLinks"></div>
        </div>`;

/** What the end card reads from the HUD around it. */
export interface EndCardHost {
  game(): Game | undefined;
  /** The game clock (ms). */
  clock(): number;
  /** A visible message (a stats file that could not be read). */
  notify(message: string, kind: 'info' | 'error'): void;
  openManual(): void;
}

/**
 * The end-of-day card: the day's backtrace (rows, answer sheets), the share text and button, the lifetime stats,
 * the Field Manual button and the next-puzzle countdown. Daily shows the plain backtrace; the strike modes show the
 * KERNEL PANIC headline and a capped glyph row (`ModeRules`). It owns the card's DOM; the HUD builds and shows it
 * with `show`, ticks `updateNextDay` and `reset`s it for a new game.
 */
export class EndCard {
  private readonly els: Record<string, HTMLElement>;
  private shownNow = false;
  private shareText = '';
  /** Records the finished day and returns the lifetime stats; undefined when this game does not count (Endless, debug). */
  private statsSource: (() => StatsOutcome) | undefined;
  private nextDaySig = '';
  /** A daily game for the real current day (not a debug date), so the card counts down to the next one. */
  private liveDaily = false;

  constructor(
    el: HTMLElement,
    private readonly host: EndCardHost,
  ) {
    this.els = { result: el, ...elementsOf(el) };
    this.els.manualEndBtn!.prepend(manualBookIcon(22));
    this.els.manualEndBtn!.addEventListener('click', () => host.openManual());
    const syncManualBadges = () => {
      const unread = manualStore.unreadCount();
      const found = manualStore.foundCount();
      this.els.manualEndSub!.textContent = found > 0 ? `${found} logged · click background folks to collect more` : 'Click characters & props in the stack to log them';
      this.els.manualEndBadge!.textContent = `${unread} NEW`;
      this.els.manualEndBadge!.hidden = unread === 0;
      this.els.manualEndBtn!.classList.toggle('has-unread', unread > 0);
    };
    syncManualBadges();
    manualStore.subscribe(syncManualBadges);
    this.els.copy!.addEventListener('click', () => {
      // Native share where it exists, the clipboard otherwise. No way to do either is an expected condition: say so.
      void deliverShare(this.shareText, navigator).then((res) => {
        if (res === 'cancelled') return;
        this.els.copy!.textContent = res === 'copied' ? 'Copied ✓' : res === 'shared' ? 'Shared ✓' : 'Copy failed';
        if (res === 'failed') return;
        window.setTimeout(() => {
          if (this.els.copy) this.els.copy.textContent = shareLabel();
        }, 2000);
      });
    });
  }

  /** The card has been built and shown for the current game. */
  get isShown(): boolean {
    return this.shownNow;
  }

  /** A new game: the card goes away, and the footer counts down only for a real daily game of today. */
  reset(g: Game, statsSource: (() => StatsOutcome) | undefined) {
    this.statsSource = statsSource;
    this.liveDaily = g.rules.persistsDaily && g.puzzle === puzzleNumber(new Date(this.host.clock()));
    this.nextDaySig = '';
    this.els.nextDay!.textContent = 'A new stack opens at local midnight.';
    this.hide();
    this.els.copy!.textContent = shareLabel();
  }

  /** Put the card away (a new game, or a rail demo taking over the console). */
  hide() {
    this.shownNow = false;
    this.els.result!.hidden = true;
  }

  /** End of day: the result card, straight away (no replay): the day's backtrace, most recent frame first. */
  show(rows: RecordRow[], depth: number, puzzle: number) {
    this.shownNow = true;
    this.build(rows, depth, puzzle);
    this.els.result!.hidden = false;
    replay(this.els.result!, 'settle-in');
    this.els.copy!.focus({ preventScroll: true });
  }

  /**
   * The card: a summary line and a backtrace of the day, one row per round, #0 being the last answer. A row shows
   * its frame numbers and the tier's cursor icon; hovering, focusing or tapping it opens it in place (no layout
   * shift) to the tier, the answer and a larger icon. Every row's accessible name says all of it. Each row keeps
   * a trailing slot with a dropdown arrow: the prompt's answer sheet from the loaded set (see answer-sheet.ts).
   */
  private build(rows: RecordRow[], depth: number, puzzle: number) {
    const ol = this.els.record!;
    ol.replaceChildren();
    let d = 0;
    const frames = rows.map((r) => {
      const n = r.tier ? TIERS[r.tier].frames : 0;
      const span = { r, from: d + 1, to: d + n, n };
      d += n;
      return span;
    });
    frames.reverse().forEach(({ r, from, to, n }, i) => {
      const li = document.createElement('li');
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'bt-row';
      row.setAttribute('aria-expanded', 'false');
      const num = document.createElement('span');
      num.className = 'bt-n';
      num.textContent = `#${i}`;
      const icon = document.createElement('span');
      icon.className = 'bt-icon';
      icon.append(tierIcon(r.tier ?? 'timeout'));
      const sum = document.createElement('span');
      sum.className = 'bt-sum';
      sum.textContent = n === 0 ? 'no frames' : n === 1 ? `frame ${from}` : `frames ${from}–${to}`;
      const det = document.createElement('span');
      det.className = 'bt-detail';
      const more = document.createElement('span');
      more.className = 'bt-more';
      more.setAttribute('aria-hidden', 'true');
      if (r.tier) {
        const t = TIERS[r.tier];
        const name = document.createElement('span');
        name.className = 'bt-tier';
        name.dataset.tier = t.id;
        name.textContent = t.name;
        name.title = `${t.name}: +${framesLabel(t.frames)}${t.id === 'womm' ? ' (the cliché “clever” pick)' : ''}`;
        det.append(name, ` · ${r.name ?? '—'} · +${n}`);
        row.setAttribute('aria-label', `#${i}: ${t.name}, ${r.name ?? 'answer'}, ${sum.textContent}`);
      } else {
        row.classList.add('timeout');
        det.textContent = r.timedOut ? 'Timed out · no frames' : 'Skipped · no frames';
        row.setAttribute('aria-label', `#${i}: ${r.timedOut ? 'timed out' : 'skipped'}, no frames`);
      }
      // Tap (and click) pins a row open; hover and keyboard focus open it while they last (CSS).
      row.addEventListener('click', () => {
        const open = row.getAttribute('aria-expanded') !== 'true';
        for (const b of ol.querySelectorAll('.bt-row')) b.setAttribute('aria-expanded', 'false');
        row.setAttribute('aria-expanded', String(open));
      });
      row.append(num, icon, sum, det, more);
      li.append(row);
      const sheetBtn = this.answerSheetFor(li, i, r, puzzle);
      if (sheetBtn) li.append(sheetBtn.toggle, sheetBtn.panel);
      ol.append(li);
    });
    // The share text is emoji glyphs only (oldest first), so it pastes cleanly anywhere. Frame scores stay out of it.
    const mode = this.host.game()?.mode ?? 'daily';
    const layerName = layerAt(depth, mode).name;
    const glyphs = rows.map((r) => (r.tier ? TIERS[r.tier].glyph : '⬛')).join('');
    const rules = rulesFor(mode);
    const headline = rules.headline(framesLabel(depth), layerName);
    setText(this.els.puzzleNo!, rules.puzzleChip(puzzle));
    setText(this.els.headline!, headline);
    this.shareText = buildShareText({
      mode,
      puzzle,
      headline,
      glyphs: glyphs.slice(0, rules.shareGlyphLimit),
      url: siteUrl(location),
    });
    this.buildStats();
    // Prefilled GitHub Issue links for missed answers and question ideas.
    const rejected = this.host.game() ? this.host.game()!.rounds.flatMap((r) => r.rejected) : [];
    const missLink = document.createElement('a');
    missLink.className = 'issue-link';
    missLink.href = missedAnswerUrl({ guesses: rejected, puzzle });
    missLink.target = '_blank';
    missLink.rel = 'noopener noreferrer';
    missLink.textContent = 'Report a missed answer';
    const ideaLink = document.createElement('a');
    ideaLink.className = 'issue-link';
    ideaLink.href = suggestQuestionUrl();
    ideaLink.target = '_blank';
    ideaLink.rel = 'noopener noreferrer';
    ideaLink.textContent = 'Suggest a question';
    this.els.resultLinks!.replaceChildren(missLink, ' · ', ideaLink);
  }

  /**
   * The row's dropdown: an arrow button over the row's last slot that opens the prompt's answer sheet in place.
   * The sheet is built on first open. Needs the loaded answer set (the day is over, so showing it spoils nothing).
   */
  private answerSheetFor(li: HTMLElement, i: number, r: RecordRow, puzzle: number): { toggle: HTMLButtonElement; panel: HTMLElement } | undefined {
    const set = this.host.game()?.set;
    if (!set || !r.question) return undefined;
    const qid = r.question;
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'bt-sheet-btn';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', `#${i}: all answers to this prompt`);
    toggle.textContent = '▾';
    const panel = document.createElement('div');
    panel.className = 'bt-sheet';
    panel.id = `bt-sheet-${i}`;
    panel.hidden = true;
    toggle.setAttribute('aria-controls', panel.id);
    let built = false;
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      if (open && !built) {
        built = true;
        const prompt = set.questions.find((q) => q.id === qid)?.prompt;
        enforce(prompt, `answer sheet: no question ${qid} in the loaded set`);
        // The prompt itself, so the list reads in context, with a link to what it means in computing.
        const head = document.createElement('div');
        head.className = 'sheet-q';
        const ref = document.createElement('a');
        ref.className = 'sheet-ref';
        ref.href = questionUrl(prompt, bankLink(qid));
        ref.target = '_blank';
        ref.rel = 'noopener noreferrer';
        ref.textContent = 'what’s this? ↗';
        head.append(`“${prompt}”`, ' ', ref);
        panel.replaceChildren(head, ...this.sheetNodes(answerSheet(set.entries(qid), puzzle, qid, r.name), r.name, prompt, qid));
      }
      toggle.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      li.classList.toggle('sheet-open', open);
    });
    return { toggle, panel };
  }

  private sheetNodes(groups: SheetGroup[], own: string | undefined, prompt: string, qid: string): HTMLElement[] {
    return groups.map((g) => {
      const box = document.createElement('section');
      box.className = 'sheet-group';
      const head = document.createElement('div');
      head.className = 'sheet-head';
      const name = document.createElement('span');
      name.className = 'bt-tier';
      name.dataset.tier = g.tier;
      name.textContent = TIERS[g.tier].name;
      head.append(name, ` · ${g.total}`);
      const list = document.createElement('ul');
      list.className = 'sheet-list';
      const fill = (entries: readonly CategoryEntry[]) => list.replaceChildren(...entries.map((e) => this.sheetItem(e, e.name === own, prompt, qid)));
      box.append(head, list);
      fill(g.shown);
      if (g.total > g.shown.length) {
        const more = document.createElement('button');
        more.type = 'button';
        more.className = 'sheet-more';
        more.setAttribute('aria-expanded', 'false');
        const rest = g.total - g.shown.length;
        more.textContent = `+${rest} more`;
        more.addEventListener('click', () => {
          const open = more.getAttribute('aria-expanded') !== 'true';
          more.setAttribute('aria-expanded', String(open));
          more.textContent = open ? 'show fewer' : `+${rest} more`;
          fill(open ? g.all : g.shown);
        });
        box.append(more);
      }
      return box;
    });
  }

  private sheetItem(e: CategoryEntry, own: boolean, prompt: string, qid: string): HTMLElement {
    const li = document.createElement('li');
    // Each answer looks itself up in the sense the prompt means ("spinlock" + "lock"), in a new tab.
    const a = document.createElement('a');
    a.className = 'sheet-a';
    const checked = bankLink(qid, e.name);
    a.href = answerUrl(e.name, prompt, checked);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = e.name;
    a.title = `${e.note ? `${e.note}\n` : ''}${checked ? `About “${e.name}”: ${new URL(checked).hostname}` : `Look up “${e.name}” on Wikipedia`}`;
    li.append(a);
    if (own) {
      li.className = 'own';
      const you = document.createElement('span');
      you.className = 'sheet-you';
      you.textContent = ' ◂ you';
      li.append(you);
    }
    if (e.note && (e.tier === 'bitflip' || e.tier === 'womm')) {
      const note = document.createElement('span');
      note.className = 'sheet-note';
      note.textContent = ` — ${e.note}`;
      li.append(note);
    }
    return li;
  }

  /** "Your stats" on the end card. Hidden when this game doesn't count or storage is unavailable. */
  private buildStats() {
    const box = this.els.stats!;
    const out = this.statsSource?.();
    if (!out || out.kind === 'none') {
      box.hidden = true;
      box.replaceChildren();
      return;
    }
    const { stats } = out;
    const head = document.createElement('div');
    head.className = 'stats-head';
    head.textContent = 'Your stats';
    const grid = document.createElement('dl');
    grid.className = 'stats-grid';
    const cell = (label: string, value: string) => {
      const d = document.createElement('div');
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      d.append(dd, dt);
      grid.append(d);
    };
    cell('played', String(stats.played));
    cell('streak', String(stats.streak));
    cell('best streak', String(stats.bestStreak));
    cell('avg frames', String(stats.avgDepth));
    cell('best frames', String(stats.bestDepth));
    const dist = document.createElement('ul');
    dist.className = 'stats-dist';
    dist.setAttribute('aria-label', 'Every answer you have given, by tier');
    const max = Math.max(1, ...TIER_IDS.map((id) => stats.tiers[id]));
    for (const id of TIER_IDS) {
      const li = document.createElement('li');
      li.className = `tier-${id}`;
      const name = document.createElement('span');
      name.className = 'sd-name';
      name.textContent = TIERS[id].name;
      const bar = document.createElement('span');
      bar.className = 'sd-bar';
      const fill = document.createElement('i');
      fill.style.width = `${(stats.tiers[id] / max) * 100}%`;
      bar.append(fill);
      const n = document.createElement('span');
      n.className = 'sd-n';
      n.textContent = String(stats.tiers[id]);
      li.append(name, bar, n);
      dist.append(li);
    }
    box.replaceChildren(head, grid, dist);
    if (out.reset !== undefined) {
      const warn = document.createElement('p');
      warn.className = 'stats-warn';
      warn.textContent = `Your saved stats could not be read (${out.reset}) and were reset.`;
      box.append(warn);
      this.host.notify(warn.textContent, 'error');
    }
    box.hidden = false;
  }

  /** The end card's footer: a live countdown to the next puzzle, then a reload prompt once local midnight passes. */
  updateNextDay(wall: number) {
    if (!this.liveDaily) return;
    const el = this.els.nextDay!;
    const now = new Date(wall);
    if (puzzleNumber(now) !== this.host.game()!.puzzle) {
      if (this.nextDaySig === 'new') return;
      this.nextDaySig = 'new';
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'next-day-reload';
      b.textContent = 'A new stack is open · reload';
      b.addEventListener('click', () => location.reload());
      el.replaceChildren(b);
      return;
    }
    const txt = `Next stack in ${formatCountdown(msUntilNextDay(now))}`;
    if (txt === this.nextDaySig) return;
    this.nextDaySig = txt;
    el.textContent = txt;
  }
}
