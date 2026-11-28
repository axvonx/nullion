import { VERSION } from '../version';
import { reducedMotion } from '../looks';
import { text } from '../text';
import { enforce } from '../core/enforce';
import { formatCountdown, msUntilNextDay, puzzleNumber } from '../core/day';
import type { CategoryEntry } from '../core/match';
import type { LayerId } from '../core/layers';
import { layerAt, layerIndexAt, layersFor, rulesFor } from '../core/modes';
import { TIER_IDS, TIERS, type TierId } from '../core/tiers';
import type { Game } from '../game/game';
import { manualStore } from '../game/manual';
import { buildShareText, deliverShare, glyphLine, siteUrl } from '../game/share';
import type { StatsOutcome } from '../game/stats';
import { answerSheet, answerUrl, questionUrl, type SheetGroup } from './answer-sheet';
import { elementsOf, framesLabel, refLink, replay, setLineWithStackFrames } from './dom';
import { LAYER_ART } from '../layers';
import { bankLink } from '../data/bank';
import { missedAnswerUrl, suggestQuestionUrl } from './issues';
import { manualBookIcon } from './manual-icon';
import { tierIcon } from './tier-icons';
import { createLayerBadge, flyBadges, type BadgeFlight } from './layer-stack';
import { sound } from '../audio/sound';
import { wordmarkCanvas } from './wordmark';

/** How long the card takes to fold into its "show" bar (matches the CSS). */
const FOLD_MS = 180;

/** One line of the day's record: an accepted answer, or a round that pushed nothing. */
export interface RecordRow {
  /** The prompt's question id: lets the row open its answer sheet. */
  question?: string;
  /** The prompt's text, shown in the row's centre. Rows built without a game (a test, a demo) may leave it out. */
  prompt?: string;
  tier?: TierId;
  name?: string;
  /** Frames the answer pushed (the tier's own in Daily; scaled in Endless). Defaults to the tier's frames. */
  pushed?: number;
  timedOut?: boolean;
}

/** A finished game's rows, in round order. */
export function rowsOf(g: Game): RecordRow[] {
  return g.rounds.map((r) =>
    r.locked
      ? { question: r.question.id, prompt: r.question.prompt, tier: r.locked.entry.tier, name: r.locked.entry.name, pushed: r.locked.pushed }
      : { question: r.question.id, prompt: r.question.prompt, timedOut: r.timedOut },
  );
}

/** The share button says what it will do: native share where the device has it, else copy. */
function shareLabel(): string {
  return typeof navigator.share === 'function' ? 'Share result' : 'Copy result';
}

/** The end card's markup: it sits inside the console panel and replaces the prompt when the game is done. */
export const END_CARD_HTML = `
        <div class="result" data-el="result" hidden>
          <div class="eod-body" data-el="eodBody">
          <section class="eod-summary" aria-label="Your stack">
            <div class="wordmark" data-el="wordmark"><span class="wm-word" data-wm="nullion">nullion</span> <span class="wm-no" data-el="puzzleNo"></span></div>
            <div class="headline" data-el="headline"></div>
            <ol class="eod-stack" data-el="eodStack" aria-label="The stack you reached, top-down"></ol>
          </section>
          <div class="eod-h" data-el="backtraceHeading"></div>
          <ol class="record" data-el="record"></ol>
          <div class="result-share"><button type="button" class="share-big" data-el="copy">Copy result</button><div class="next-day" data-el="nextDay"></div><div class="endless-best" data-el="endlessBest" hidden></div><button type="button" class="endless-go" data-el="endlessBtn" hidden></button><button type="button" class="endless-back" data-el="endlessBack" hidden></button></div>
          <div class="stats" data-el="stats" hidden></div>
          <div class="result-manual"><button type="button" class="fm-end-btn" data-el="manualEndBtn"><span class="fm-end-text"><strong data-el="manualEndTitle">Field Manual</strong><span class="fm-end-sub" data-el="manualEndSub"></span></span><span class="fm-end-badge" data-el="manualEndBadge" hidden></span></button></div>
          <div class="result-links" data-el="resultLinks"></div>
          <button type="button" class="eod-hide" data-el="eodHide" aria-label="Hide this card to look at the world behind it">hide ▾</button>
          <div class="build-tag" data-el="buildTag"><span class="build-wm" data-wm="nullion">nullion</span> v${VERSION}</div>
          </div>
          <button type="button" class="eod-show" data-el="eodShow" hidden aria-label="Show the end-of-day card again">show ▴</button>
        </div>`;

/** What the end card reads from the HUD around it. */
export interface EndCardHost {
  game(): Game | undefined;
  /** The game clock (ms). */
  clock(): number;
  /** A visible message (a stats file that could not be read). */
  notify(message: string, kind: 'info' | 'error'): void;
  openManual(): void;
  /** Endless from the end card, or null where it isn't offered (see `EndlessHook`). */
  endless(): EndlessHook | null;
}

/**
 * Endless from the end card. The daily card offers to enter it (or resume a saved run), only once the day is done;
 * an Endless card shows the personal best and goes back to today's stack.
 */
export interface EndlessHook {
  /** An unfinished run is saved. */
  resume: boolean;
  /** The best run's depth, and whether the run just ended set it. */
  best: { depth: number; isNew: boolean } | null;
  enter(): void;
  back(): void;
}

/** How long the Enter button's light-up plays before the run starts. */
const ENTER_GLOW_MS = 650;

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
  private cancelFlight: (() => void) | undefined;
  private stowed = false;
  private foldTimer = 0;
  private reachedBadges: { layer: ReturnType<typeof layersFor>[number]; el: HTMLElement }[] = [];

  constructor(
    el: HTMLElement,
    private readonly host: EndCardHost,
  ) {
    this.els = { result: el, ...elementsOf(el) };
    this.els.nextDay!.textContent = text('end-card.next.waiting');
    // The word "nullion" is always the title's pixel face; the puzzle number joins it in build().
    for (const w of el.querySelectorAll<HTMLElement>('[data-wm]')) w.replaceChildren(wordmarkCanvas(w.dataset.wm!, w.classList.contains('build-wm') ? 1 : 3));
    this.els.manualEndBtn!.prepend(manualBookIcon(22));
    this.els.manualEndBtn!.addEventListener('click', () => host.openManual());
    const syncManualBadges = () => {
      const unread = manualStore.unreadCount();
      const found = manualStore.foundCount();
      this.els.manualEndSub!.textContent = found > 0 ? text('end-card.manual.found', { found }) : text('end-card.manual.none');
      this.els.manualEndBadge!.textContent = `${unread} NEW`;
      this.els.manualEndBadge!.hidden = unread === 0;
      this.els.manualEndBtn!.classList.toggle('has-unread', unread > 0);
    };
    syncManualBadges();
    manualStore.subscribe(syncManualBadges);
    this.els.eodHide!.addEventListener('click', () => this.stow(true));
    this.els.eodShow!.addEventListener('click', () => this.stow(false));
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

  /** The card is folded away to its "show" bar so the world behind it can be looked at. */
  get isStowed(): boolean {
    return this.stowed;
  }

  /**
   * Hide or show the card (the reveal's hide / show, for the end card): hidden, the card folds down into a small
   * "show" bar; showing pops it back up. Reduced motion skips the fold and the pop.
   */
  private stow(on: boolean) {
    enforce(this.shownNow, 'end card: stow while the card is not shown');
    if (on === this.stowed) return;
    clearTimeout(this.foldTimer);
    const card = this.els.result!;
    const settle = () => {
      card.classList.remove('folding');
      card.classList.add('stowed');
      this.els.eodShow!.hidden = false;
      this.els.eodShow!.focus({ preventScroll: true });
    };
    this.stowed = on;
    if (on) {
      if (reducedMotion()) settle();
      else {
        card.classList.add('folding');
        this.foldTimer = window.setTimeout(settle, FOLD_MS);
      }
      return;
    }
    card.classList.remove('folding', 'stowed');
    this.els.eodShow!.hidden = true;
    if (!reducedMotion()) replay(this.els.eodBody!, 'back');
    this.els.eodHide!.focus({ preventScroll: true });
  }

  /** Back to the open card, at once (a new card or game). */
  private unstow() {
    clearTimeout(this.foldTimer);
    this.stowed = false;
    this.els.result!.classList.remove('folding', 'stowed');
    this.els.eodShow!.hidden = true;
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
    this.els.nextDay!.textContent = text('end-card.next.waiting');
    this.hide();
    this.els.copy!.textContent = shareLabel();
  }

  /** Put the card away (a new game, or a rail demo taking over the console). */
  hide() {
    this.cancelFlight?.();
    this.cancelFlight = undefined;
    this.els.eodStack?.classList.remove('is-flying');
    this.unstow();
    this.shownNow = false;
    this.els.result!.hidden = true;
  }

  /** End of day: the result card, straight away (no replay): the day's backtrace, most recent frame first. */
  show(rows: RecordRow[], depth: number, puzzle: number) {
    this.shownNow = true;
    this.unstow();
    this.build(rows, depth, puzzle);
    this.buildEndless();
    this.els.result!.hidden = false;
    replay(this.els.result!, 'settle-in');
    this.els.copy!.focus({ preventScroll: true });
  }

  /**
   * The summary card's stack flies in: each RHS block (`from`, where it was on screen when the day ended) travels to
   * its badge in the card, top-down, with a crunch where it lands. Reduced motion, or a stack that was not on
   * screen, just shows the badges. Call right after `show`.
   */
  flyStackIn(from: ReadonlyMap<LayerId, DOMRect>, reduced: boolean) {
    this.cancelFlight?.();
    const flights: BadgeFlight[] = [];
    for (const b of this.reachedBadges) {
      const rect = from.get(b.layer.id);
      enforce(rect, `end card: no right-hand block for ${b.layer.id} to fly from`);
      flights.push({ layer: b.layer, from: rect, to: b.el });
    }
    const ol = this.els.eodStack!;
    ol.classList.add('is-flying');
    const stop = flyBadges(flights, {
      reduced,
      delayMs: 320,
      staggerMs: Math.min(110, Math.floor(1200 / Math.max(1, flights.length))),
      onLand: (l) => sound.stackCrunch(l.id),
      onDone: () => ol.classList.remove('is-flying'),
    });
    this.cancelFlight = () => {
      stop();
      ol.classList.remove('is-flying');
    };
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
      const n = r.tier ? r.pushed ?? TIERS[r.tier].frames : 0;
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
      const prompt = r.prompt ?? this.host.game()?.set.questions.find((q) => q.id === r.question)?.prompt;
      const num = document.createElement('span');
      num.className = 'bt-n';
      num.textContent = `#${i}`;
      const icon = document.createElement('span');
      icon.className = 'bt-icon';
      icon.append(tierIcon(r.tier ?? 'timeout'));
      // The centre names the question; hovering, focusing or tapping the row swaps in what the player did with it.
      const mid = document.createElement('span');
      mid.className = 'bt-mid';
      const q = document.createElement('span');
      q.className = 'bt-q';
      q.textContent = prompt ?? '';
      const det = document.createElement('span');
      det.className = 'bt-detail';
      const span = n === 0 ? 'no frames' : n === 1 ? `frame ${from}` : `frames ${from}–${to}`;
      const more = document.createElement('span');
      more.className = 'bt-more';
      more.setAttribute('aria-hidden', 'true');
      if (r.tier) {
        const t = TIERS[r.tier];
        const ans = document.createElement('span');
        ans.className = 'bt-ans';
        ans.textContent = r.name ?? '—';
        const name = refLink(t.name, t.wiki, t.name);
        name.classList.add('bt-tier');
        name.dataset.tier = t.id;
        if (!t.wiki) name.title = `${t.name}: +${framesLabel(t.frames)} (the cliché “clever” pick)`;
        det.append(ans, ' · ', name, ` · +${n} · ${span}`);
        row.setAttribute('aria-label', `#${i}: ${prompt ? `${prompt}: ` : ''}${r.name ?? 'answer'}, ${t.name}, ${span}`);
      } else {
        row.classList.add('timeout');
        det.textContent = r.timedOut ? text('end-card.row.timed-out') : text('end-card.row.skipped');
        row.setAttribute('aria-label', `#${i}: ${prompt ? `${prompt}: ` : ''}${r.timedOut ? 'timed out' : 'skipped'}, no frames`);
      }
      // A row without a prompt text has no centre to swap: it shows its detail all the time.
      if (!prompt) row.classList.add('no-prompt');
      mid.append(q, det);
      // Tap (and click) pins a row open; hover and keyboard focus open it while they last (CSS).
      row.addEventListener('click', () => {
        const open = row.getAttribute('aria-expanded') !== 'true';
        for (const b of ol.querySelectorAll('.bt-row')) b.setAttribute('aria-expanded', 'false');
        row.setAttribute('aria-expanded', String(open));
      });
      row.append(num, icon, mid, more);
      // Keep the row and its overlay icon buttons in a header wrapper so `height: 100%` never stretches over an open sheet.
      const head = document.createElement('div');
      head.className = 'bt-head';
      head.append(row);
      const ref = prompt && r.question ? this.questionLink(i, prompt, r.question) : undefined;
      if (ref) head.append(ref);
      const sheetBtn = this.answerSheetFor(li, i, r, puzzle);
      if (sheetBtn) head.append(sheetBtn.toggle);
      li.append(head);
      if (sheetBtn) li.append(sheetBtn.panel);
      ol.append(li);
    });
    // The share text is emoji glyphs only (oldest first), so it pastes cleanly anywhere. Frame scores stay out of it.
    const mode = this.host.game()?.mode ?? 'daily';
    const layerName = layerAt(depth, mode).name;
    const rules = rulesFor(mode);
    const glyphs = glyphLine(rows.map((r) => r.tier ?? null), rules.shareGlyphs);
    this.els.backtraceHeading!.textContent = rules.backtraceHeading();
    this.els.record!.setAttribute('aria-label', `${rules.backtraceHeading()}, most recent first`);
    const headline = rules.headline(framesLabel(depth), layerName);
    this.setPuzzleNo(rules.puzzleChip(puzzle));
    setLineWithStackFrames(this.els.headline!, rules.cardLine(framesLabel(depth)));
    this.shareText = buildShareText({
      mode,
      puzzle,
      headline,
      glyphs,
      url: siteUrl(location),
    });
    this.buildReached(depth, mode);
    this.buildStats();
    // Prefilled GitHub Issue links for missed answers and question ideas.
    const rejected = this.host.game() ? this.host.game()!.rounds.flatMap((r) => r.rejected) : [];
    const missLink = document.createElement('a');
    missLink.className = 'issue-link';
    missLink.href = missedAnswerUrl({ guesses: rejected, puzzle });
    missLink.target = '_blank';
    missLink.rel = 'noopener noreferrer';
    missLink.textContent = text('end-card.link.missed');
    const ideaLink = document.createElement('a');
    ideaLink.className = 'issue-link';
    ideaLink.href = suggestQuestionUrl();
    ideaLink.target = '_blank';
    ideaLink.rel = 'noopener noreferrer';
    ideaLink.textContent = text('end-card.link.suggest');
    this.els.resultLinks!.replaceChildren(missLink, ' · ', ideaLink);
  }

  /** The stack as it stood on the right-hand side at the end of the day: the same badges, top-down, the deepest one lit. */
  private buildReached(depth: number, mode: Parameters<typeof layerIndexAt>[1]) {
    const ol = this.els.eodStack!;
    const stack = layersFor(mode ?? 'daily');
    const last = layerIndexAt(Math.max(0, depth), mode);
    this.reachedBadges = [];
    ol.replaceChildren();
    ol.style.setProperty('--eod-rows', String(Math.ceil((last + 1) / (last >= 12 ? 2 : 1))));
    ol.classList.toggle('wide', last >= 12);
    for (let i = 0; i <= last; i++) {
      const li = document.createElement('li');
      const badge = createLayerBadge(stack[i]!);
      badge.classList.add(i === last ? 'is-current' : 'is-passed');
      // The badge is a bitmap, so the link carries the layer's name in words, for hover and for screen readers.
      const link = refLink('', LAYER_ART[stack[i]!.id].wiki, stack[i]!.name);
      link.classList.add('eod-layer-link');
      link.setAttribute('aria-label', `${stack[i]!.name}: read about it on Wikipedia`);
      link.append(badge);
      li.append(link);
      if (i === last) {
        li.classList.add('is-current');
        li.style.setProperty('--ls-accent', LAYER_ART[stack[i]!.id].stackTheme.accent);
        li.style.setProperty('--ls-tint', LAYER_ART[stack[i]!.id].stackTheme.tint);
      }
      ol.append(li);
      this.reachedBadges.push({ layer: stack[i]!, el: badge });
    }
  }

  /** The Endless line under Share: enter/resume on a finished day, the best and the way back on a finished run. */
  private buildEndless() {
    const btn = this.els.endlessBtn! as HTMLButtonElement;
    const back = this.els.endlessBack! as HTMLButtonElement;
    const bestEl = this.els.endlessBest!;
    btn.hidden = true;
    back.hidden = true;
    bestEl.hidden = true;
    btn.classList.remove('lit');
    btn.disabled = false;
    const g = this.host.game();
    const hook = this.host.endless();
    if (!g || !hook) return;
    // A finished day enters (or resumes) Endless; a finished run re-enters a new one or goes back to today.
    const daily = g.rules.persistsDaily;
    if (daily || g.rules.persistsRun) {
      btn.textContent = !daily ? text('end-card.endless.reenter') : hook.resume ? text('end-card.endless.resume') : text('end-card.endless.enter');
      btn.onclick = () => {
        // Just for fun: the button lights up, then the run starts (straight away under reduced motion).
        btn.disabled = true;
        if (reducedMotion()) return hook.enter();
        btn.classList.add('lit');
        window.setTimeout(() => hook.enter(), ENTER_GLOW_MS);
      };
      btn.hidden = false;
    }
    if (g.rules.persistsRun) {
      if (hook.best) {
        const frames = framesLabel(hook.best.depth);
        bestEl.textContent = hook.best.isNew ? text('end-card.endless.new-best', { frames }) : text('end-card.endless.best', { frames });
        bestEl.classList.toggle('is-new', hook.best.isNew);
        bestEl.hidden = false;
      }
      back.textContent = text('end-card.endless.back');
      back.onclick = () => hook.back();
      back.hidden = false;
    }
  }

  /** The chip ("#7", "ENDLESS") is set in the same pixel face as "nullion". */
  private setPuzzleNo(chip: string) {
    const el = this.els.puzzleNo!;
    el.dataset.chip = chip;
    el.replaceChildren(wordmarkCanvas(chip, 3));
    this.els.wordmark!.setAttribute('aria-label', `nullion ${chip}`);
  }

  /** The row's small link-out icon: what the question means in computing (the checked link where the bank has one). */
  private questionLink(i: number, prompt: string, qid: string): HTMLAnchorElement {
    const ref = document.createElement('a');
    ref.className = 'bt-ref';
    ref.href = questionUrl(prompt, bankLink(qid));
    ref.target = '_blank';
    ref.rel = 'noopener noreferrer';
    ref.textContent = '↗';
    ref.setAttribute('aria-label', `#${i}: what is “${prompt}”? (opens a new tab)`);
    ref.title = 'What’s this?';
    return ref;
  }

  /**
   * The row's dropdown: an arrow button over the row's last slot that opens the prompt's other answers in place.
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
    toggle.setAttribute('aria-label', `#${i}: other answers to this prompt`);
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
        // The prompt is already in the row's centre and the player's own pick in its hover: this is only the others.
        const head = document.createElement('div');
        head.className = 'sheet-q';
        head.textContent = text('end-card.sheet.others');
        const others = set.entries(qid).filter((e) => e.name !== r.name);
        panel.replaceChildren(head, ...this.sheetNodes(answerSheet(others, puzzle, qid), prompt, qid));
      }
      toggle.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      li.classList.toggle('sheet-open', open);
    });
    return { toggle, panel };
  }

  private sheetNodes(groups: SheetGroup[], prompt: string, qid: string): HTMLElement[] {
    return groups.map((g) => {
      const box = document.createElement('section');
      box.className = 'sheet-group';
      const head = document.createElement('div');
      head.className = 'sheet-head';
      const name = refLink(TIERS[g.tier].name, TIERS[g.tier].wiki, TIERS[g.tier].name);
      name.classList.add('bt-tier');
      name.dataset.tier = g.tier;
      head.append(name, ` · ${g.total}`);
      const list = document.createElement('ul');
      list.className = 'sheet-list';
      const fill = (entries: readonly CategoryEntry[]) => list.replaceChildren(...entries.map((e) => this.sheetItem(e, prompt, qid)));
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

  private sheetItem(e: CategoryEntry, prompt: string, qid: string): HTMLElement {
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
    const head = document.createElement('h3');
    head.className = 'stats-head';
    head.textContent = 'Your all-time stats';
    // Two blocks, each in its own box: the numbers across all days, then every answer by tier.
    const totals = document.createElement('section');
    totals.className = 'stats-block';
    totals.setAttribute('aria-label', 'Totals across all days');
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
    totals.append(grid);
    const tiers = document.createElement('section');
    tiers.className = 'stats-block';
    const tiersHead = document.createElement('div');
    tiersHead.className = 'stats-sub';
    tiersHead.textContent = 'Every answer, by tier';
    const dist = document.createElement('ul');
    dist.className = 'stats-dist';
    dist.setAttribute('aria-label', 'Every answer you have given, by tier');
    const max = Math.max(1, ...TIER_IDS.map((id) => stats.tiers[id]));
    for (const id of TIER_IDS) {
      const li = document.createElement('li');
      li.className = `tier-${id}`;
      const name = refLink(TIERS[id].name, TIERS[id].wiki, TIERS[id].name);
      name.classList.add('sd-name');
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
    tiers.append(tiersHead, dist);
    box.replaceChildren(head, totals, tiers);
    if (out.reset !== undefined) {
      const warn = document.createElement('p');
      warn.className = 'stats-warn';
      warn.textContent = text('notices.stats.reset', { reason: out.reset });
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
      b.textContent = text('end-card.next.reload');
      b.addEventListener('click', () => location.reload());
      el.replaceChildren(b);
      return;
    }
    const txt = text('end-card.next.countdown', { countdown: formatCountdown(msUntilNextDay(now)) });
    if (txt === this.nextDaySig) return;
    this.nextDaySig = txt;
    el.textContent = txt;
  }
}
