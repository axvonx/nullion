import { MAX_DEPTH, layerAt } from '../core/layers';
import { TIERS, type TierId } from '../core/tiers';
import { ANSWER_MS, READ_MS, type Game, type SubmitResult } from '../game/game';
import { reducedMotion } from '../looks';
import type { DiveStop, Scene } from '../render/scene';
import { FORMS, FORM_BY_LAYER, serialStamp, type FormId } from './forms';

const $ = <T extends HTMLElement>(root: ParentNode, sel: string): T => {
  const el = root.querySelector<T>(sel);
  if (!el) throw new Error(`missing element ${sel}`);
  return el;
};

/** Below this share of the answer time left, the watchdog goes into its low-time state. */
export const LOW_TIME = 0.25;
/** The reading phase types the call in at this many ms per character. */
const TYPE_MS = 28;

export function framesLabel(n: number): string {
  return `${n} stack frame${n === 1 ? '' : 's'}`;
}

/** One line of the day's record: an accepted answer, or a round that pushed nothing. */
export interface RecordRow {
  tier?: TierId;
  name?: string;
  timedOut?: boolean;
}

/** Restart a one-shot CSS animation class on an element. */
function replay(el: HTMLElement, cls: string) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

function setText(el: HTMLElement, s: string) {
  if (el.textContent !== s) el.textContent = s;
}

export class Hud {
  readonly root: HTMLElement;
  private canvas: HTMLCanvasElement;
  private els: Record<string, HTMLElement>;
  private input: HTMLInputElement;
  private game: Game | undefined;
  private scene: Scene | undefined;
  private scrollMode = false;
  private lastDepth = 0;
  private lastNow = 0;
  private lag = 0;
  private still: boolean | undefined;
  private shownFrames = -1;
  private form: FormId | undefined;
  /** The call line's identity (text + form); a new one restamps the serial clock and restarts typing. */
  private callKey = '';
  private stamp = '';
  private barked = -1;
  private ended = false;
  private replaying = false;
  private shareText = '';
  private demo = false;

  /**
   * Debug hooks. `watchdogOverride` shows this share of time left instead of the game's (the rail's timer demo);
   * `formOverride` pins the console's form instead of following the layer (the rail's form preview).
   */
  watchdogOverride: ((now: number) => number) | undefined;
  formOverride: FormId | undefined;

  constructor(mount: HTMLElement) {
    // The scene is a full-bleed backdrop; every piece of UI floats over it as a panel.
    mount.innerHTML = `
      <canvas class="scene" aria-label="Your cursor descending through the software stack"></canvas>
      <header class="bar">
        <span class="chip meta float" data-el="meta"><span class="led" aria-hidden="true"></span><span data-el="metaText"></span></span>
        <span class="chip depth float" data-el="depth"></span>
      </header>
      <section class="console panel float" data-el="console" aria-label="Prompt">
        <div class="titlebar" data-el="titlebar"><span class="title-text" data-el="titleText"></span><span class="close" aria-hidden="true">x</span></div>
        <div class="watchdog" data-el="watchdogWrap"><div class="watchdog-fill" data-el="watchdog"></div></div>
        <span class="wd-secs" data-el="secs" aria-hidden="true"></span>
        <div class="call" data-el="call"><span class="pfx" data-el="pfx"></span><span data-el="ctext"></span></div>
        <div class="plain" data-el="plain"></div>
        <form class="prompt-line" data-el="form" autocomplete="off">
          <label for="guess" class="caret" data-el="caret">&gt;</label>
          <input id="guess" name="guess" aria-label="Your answer" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="type an answer, press Enter" />
          <span class="bracket" aria-hidden="true">]</span>
          <button type="submit" class="ok-btn">OK</button>
        </form>
        <div class="bios-footer" aria-hidden="true"><b>F10</b> Save · <b>Enter</b> Select · <b>ESC</b> Exit</div>
        <output class="feedback" data-el="feedback" aria-live="polite"></output>
        <div class="landed" data-el="landed" aria-live="polite"></div>
        <div class="result" data-el="result" hidden>
          <div class="wordmark">nullion <span data-el="puzzleNo"></span></div>
          <div class="headline" data-el="headline"></div>
          <div class="glyphs" data-el="glyphs" aria-hidden="true"></div>
          <ol class="record" data-el="record" aria-label="Your answers today"></ol>
          <button type="button" data-el="copy">Copy result</button>
        </div>
        <div class="scroll-hint" data-el="scrollHint" hidden>scroll · ↑ ↓ · PgUp PgDn</div>
      </section>`;
    this.root = mount;
    this.canvas = $(mount, 'canvas');
    this.input = $(mount, '#guess');
    this.els = Object.fromEntries([...mount.querySelectorAll<HTMLElement>('[data-el]')].map((e) => [e.dataset.el!, e]));
  }

  get canvasEl() {
    return this.canvas;
  }

  /** True when the console shows its prompt content (play mode, or a debug demo in scroll mode). */
  get showsPrompt() {
    return !this.scrollMode || this.demo;
  }

  bind(scene: Scene, now: () => number) {
    this.scene = scene;
    this.els.form!.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const g = this.game;
      if (!g || this.demo) return;
      const guess = this.input.value;
      if (!guess.trim()) {
        g.advance(now());
        return;
      }
      const res = g.submit(guess, now());
      this.onSubmit(res, scene, g);
      if (res.kind !== 'ignored') this.input.value = '';
    });

    this.els.copy!.addEventListener('click', () => {
      void navigator.clipboard.writeText(this.shareText).then(() => {
        this.els.copy!.textContent = 'Copied';
      });
    });

    // The end-of-day replay is skippable with any key or click.
    const skip = () => {
      if (this.replaying) scene.skipSequence();
    };
    window.addEventListener('keydown', skip, true);
    window.addEventListener('pointerdown', skip, true);

    // Scroll-only mode: free movement through the stack.
    const nudge = (d: number) => scene.setTarget(Math.min(MAX_DEPTH + 4, Math.max(0, scene.displayDepth + d)));
    window.addEventListener(
      'wheel',
      (ev) => {
        if (!this.scrollMode || ev.target instanceof HTMLInputElement || ev.target instanceof HTMLSelectElement) return;
        // Panels (and the debug menu) scroll themselves.
        if (ev.target instanceof Element && ev.target.closest('.panel, .dbg-panel')) return;
        ev.preventDefault();
        nudge(ev.deltaY / 40);
      },
      { passive: false },
    );
    window.addEventListener('keydown', (ev) => {
      if (!this.scrollMode || ev.target instanceof HTMLInputElement || ev.target instanceof HTMLSelectElement) return;
      const step = { ArrowDown: 1, ArrowUp: -1, PageDown: 8, PageUp: -8 }[ev.key];
      if (step === undefined) return;
      ev.preventDefault();
      nudge(step);
    });
  }

  setGame(g: Game, dateLabel: string) {
    this.game = g;
    this.endDemo();
    this.ended = false;
    this.barked = -1;
    this.callKey = '';
    if (this.replaying) this.scene?.setTarget(0, true);
    this.replaying = false;
    this.els.result!.hidden = true;
    this.els.copy!.textContent = 'Copy result';
    this.els.feedback!.textContent = '';
    this.els.landed!.textContent = '';
    this.els.metaText!.textContent = `#${g.puzzle}`;
    this.els.meta!.title = `Puzzle #${g.puzzle} · ${dateLabel}`;
  }

  setScrollMode(on: boolean) {
    this.scrollMode = on;
    this.root.classList.toggle('scroll-mode', on);
    this.els.scrollHint!.hidden = !on;
  }

  /** The game's phase changed: the console settles into its new content. */
  onPhaseChange() {
    replay(this.els.console!, 'settle');
  }

  /** Per-frame refresh of the timed parts, the console's form and the panels' float. */
  update(now: number, depthShown: number) {
    this.updateMotion(now, depthShown);
    this.mirrorReaction(now);
    const frames = Math.round(depthShown);
    if (frames !== this.shownFrames) {
      this.shownFrames = frames;
      this.els.depth!.textContent = framesLabel(frames);
    }
    const form = this.formOverride ?? FORM_BY_LAYER[layerAt(depthShown).id];
    if (form !== this.form) this.applyForm(form);

    const override = this.watchdogOverride?.(now);
    this.root.classList.toggle('wd-demo', override !== undefined);
    if (override !== undefined) this.setWatchdog(override);

    const g = this.game;
    if (!g || this.demo || this.scrollMode) return;

    const p = g.phase;
    const r = g.current();
    let left: number;
    this.els.console!.classList.toggle('resting', p.kind === 'between');
    if (p.kind === 'reading') {
      // A short boot beat: the call types in, then the plain prompt appears; the input unlocks when answering.
      this.showCall(r!.question.call, r!.question.prompt, now - (p.until - READ_MS));
      left = 1;
      this.input.disabled = true;
    } else if (p.kind === 'answering') {
      this.showCall(r!.question.call, r!.question.prompt, Infinity);
      left = p.until === null ? 1 : Math.max(0, (p.until - now) / ANSWER_MS);
      if (this.input.disabled) {
        this.input.disabled = false;
        this.input.focus();
        this.els.feedback!.textContent = '';
        this.els.landed!.textContent = '';
      }
    } else if (p.kind === 'between') {
      this.input.disabled = true;
      left = 0;
      if (r!.timedOut && this.barked !== p.round) {
        this.barked = p.round;
        this.bark();
      }
    } else if (p.kind === 'done') {
      this.input.disabled = true;
      left = 0;
      if (!this.ended) this.endOfDay(rowsOf(g), g.depth, g.puzzle);
      this.showCall('exit(0)', this.replaying ? 'Replaying today’s descent · any key skips' : 'That’s today’s stack. A new one boots at local midnight.', Infinity);
    } else {
      this.showCall('boot…', '', Infinity);
      left = 1;
    }
    if (override === undefined) this.setWatchdog(left, p.kind === 'answering' && p.until !== null);
  }

  /** Show the call line in the current form, typed in over `elapsed` ms (all at once under reduced motion). */
  private showCall(call: string, prompt: string, elapsed: number) {
    const form = this.form;
    if (!form) throw new Error('Hud.showCall before the first update() picked a form');
    const view = FORMS[form];
    const key = `${form}|${call}`;
    if (key !== this.callKey) {
      this.callKey = key;
      this.stamp = serialStamp(performance.now());
      setText(this.els.caret!, view.caret(this.stamp));
      replay(this.els.call!, 'settle-in');
    }
    const text = view.call(call);
    const n = reducedMotion() ? text.length : Math.max(0, Math.floor(elapsed / TYPE_MS));
    const typed = n >= text.length ? text : `${text.slice(0, n)}▌`;
    setText(this.els.pfx!, view.prefix(this.stamp));
    setText(this.els.ctext!, typed);
    // GUI: the call is the dialog's title. BIOS: the prompt is the setup field's title.
    setText(this.els.titleText!, form === 'bios' ? prompt : form === 'gui' ? typed : '');
    this.els.plain!.classList.toggle('pending', n < text.length);
    setText(this.els.plain!, prompt);
  }

  private applyForm(form: FormId) {
    const first = this.form === undefined;
    this.form = form;
    this.els.console!.dataset.form = form;
    this.callKey = '';
    if (!first) replay(this.els.console!, 'morph');
    if (this.demo) this.showCall(this.demoCall, this.demoPrompt, Infinity);
  }

  /** Bar fill, low-time state and the seconds readout that only appears when time is short. */
  private setWatchdog(left: number, timed = true) {
    this.els.watchdog!.style.transform = `scaleX(${left})`;
    const low = timed && left > 0 && left < LOW_TIME;
    this.els.watchdog!.classList.toggle('low', low);
    this.els.console!.classList.toggle('low', low);
    setText(this.els.secs!, low ? `${Math.ceil((left * ANSWER_MS) / 1000)}s` : '');
  }

  /** Timeout: the watchdog barks: the card jolts and flashes red (only the flash, under reduced motion). */
  bark() {
    replay(this.els.console!, 'bark');
    this.els.landed!.textContent = 'watchdog: round timed out, no frames pushed';
  }

  /**
   * Panels float: a CSS bob, plus a lag that follows the scene's speed so they drift with the descent
   * and ease back when it stops. Static under reduced motion.
   */
  private updateMotion(now: number, depth: number) {
    const still = reducedMotion();
    if (still !== this.still) {
      this.still = still;
      this.root.classList.toggle('still', still);
    }
    const dt = this.lastNow ? Math.min(0.1, (now - this.lastNow) / 1000) : 0;
    const v = dt > 0 ? (depth - this.lastDepth) / dt : 0;
    this.lastNow = now;
    this.lastDepth = depth;
    const want = still ? 0 : Math.max(-10, Math.min(10, -v * 0.9));
    const next = this.lag + (want - this.lag) * (1 - Math.exp(-dt * 4));
    if (Math.abs(next - this.lag) > 0.05 || (still && this.lag !== 0)) {
      this.lag = still ? 0 : next;
      this.root.style.setProperty('--lag', `${this.lag.toFixed(1)}px`);
    }
  }

  private fxShown = '';
  /** The floating UI's half of a tier reaction: hang grey, invert or tint, and panels racing out of sync. */
  private mirrorReaction(now: number) {
    const fx = this.scene?.fx;
    if (!fx) return;
    const key = `${fx.hang}|${fx.flip}`;
    if (key !== this.fxShown) {
      this.fxShown = key;
      this.root.classList.toggle('hang', fx.hang);
      this.root.classList.toggle('flip', fx.flip === 'invert');
      this.root.classList.toggle('tint', fx.flip === 'tint');
    }
    const panels = [this.els.console!, this.els.meta!, this.els.depth!];
    panels.forEach((el, i) => {
      if (fx.jiggle <= 0) {
        if (el.style.translate) el.style.translate = '';
        return;
      }
      const dx = Math.round(Math.sin(now / 41 + i * 2.1) * 3 * fx.jiggle);
      const dy = Math.round(Math.cos(now / 49 + i * 1.3) * 2 * fx.jiggle);
      el.style.translate = `${dx}px calc(var(--lag) + ${dy}px)`;
    });
  }

  private onSubmit(res: SubmitResult, scene: Scene, g: Game) {
    const fb = this.els.feedback!;
    if (res.kind === 'rejected') {
      fb.className = 'feedback fault';
      // Clear first, so a repeat of the same line is announced again by screen readers.
      fb.textContent = '';
      requestAnimationFrame(() => (fb.textContent = 'Not accepted'));
      replay(this.els.console!, 'reject');
      return;
    }
    if (res.kind === 'duplicate') {
      fb.className = 'feedback';
      fb.textContent = `${res.entry.name} is already on the stack`;
      replay(fb, 'settle-in');
      return;
    }
    if (res.kind !== 'accepted') return;
    const t = TIERS[res.entry.tier];
    fb.className = 'feedback ok';
    fb.textContent = res.corrected ? `read as '${res.entry.name}'` : '';
    this.showLanded(t.id, res.entry.name, res.pushed, res.entry.note);
    // The cursor dives; the tier's reaction fires when it lands.
    if (res.pushed > 0) scene.diveTo(g.depth, t.id, res.pushed);
    else scene.react(t.id);
  }

  private showLanded(tier: TierId, name: string, pushed: number, note?: string) {
    const t = TIERS[tier];
    this.els.landed!.innerHTML = '';
    const tierEl = document.createElement('span');
    tierEl.className = `tier tier-${t.id}`;
    tierEl.textContent = t.name;
    const rest = document.createElement('span');
    rest.textContent = pushed ? ` · ${name} · +${pushed}. ${note ?? t.blurb}` : ` · ${name} (logged; only your first answer pushes frames)`;
    this.els.landed!.append(tierEl, rest);
    replay(this.els.landed!, 'settle-in');
  }

  /**
   * End of day: a fast replay of the whole descent from the top, each answer popping as the camera passes it,
   * then the result card. Under reduced motion the card shows at once.
   */
  endOfDay(rows: RecordRow[], depth: number, puzzle: number) {
    const scene = this.scene;
    if (!scene) throw new Error('Hud.endOfDay before bind()');
    this.ended = true;
    this.buildCard(rows, depth, puzzle);
    const settled = 'That’s today’s stack. A new one boots at local midnight.';
    if (reducedMotion()) {
      scene.setTarget(depth, true);
      this.showCall('exit(0)', settled, Infinity);
      this.showCard();
      return;
    }
    this.showCall('exit(0)', 'Replaying today’s descent · any key skips', Infinity);
    const stops: DiveStop[] = [];
    let d = 0;
    for (const r of rows) {
      if (!r.tier) continue;
      const t = TIERS[r.tier];
      d += t.frames;
      stops.push({ depth: d, tier: t.id, label: `${t.name} +${t.frames}` });
    }
    this.replaying = true;
    scene.playSequence(stops, () => {
      this.replaying = false;
      this.showCall('exit(0)', settled, Infinity);
      this.showCard();
    });
  }

  private buildCard(rows: RecordRow[], depth: number, puzzle: number) {
    // The record of the day's answers lives here (and in the share text's glyphs), not in a running panel.
    const ol = this.els.record!;
    ol.innerHTML = '';
    for (const r of rows) {
      const li = document.createElement('li');
      if (r.tier) {
        const t = TIERS[r.tier];
        li.dataset.tier = t.id;
        li.textContent = `${t.glyph} ${r.name ?? t.name} +${t.frames}`;
      } else {
        li.className = 'timeout';
        li.textContent = `⬛ ${r.timedOut ? 'timed out' : 'skipped'}`;
      }
      ol.append(li);
    }
    const glyphs = rows.map((r) => (r.tier ? TIERS[r.tier].glyph : '⬛')).join('');
    const headline = `${framesLabel(depth)} · ${layerAt(depth).name}`;
    setText(this.els.puzzleNo!, `#${puzzle}`);
    setText(this.els.headline!, headline);
    setText(this.els.glyphs!, glyphs);
    this.shareText = `nullion #${puzzle} · ${headline}\n${glyphs}`;
  }

  private showCard() {
    this.els.result!.hidden = false;
    replay(this.els.result!, 'settle-in');
    this.els.copy!.focus({ preventScroll: true });
  }

  // ---------------------------------------------------------------------------------------------
  // Debug demos (driven by the debug rail; these only show content, they never touch game state).

  private demoCall = '';
  private demoPrompt = '';

  /** Show a prompt in the console without a running round, even in scroll mode. */
  demoBegin(call: string, prompt: string) {
    this.demo = true;
    this.demoCall = call;
    this.demoPrompt = prompt;
    this.root.classList.add('demo');
    this.ended = false;
    this.els.result!.hidden = true;
    this.els.feedback!.textContent = '';
    this.els.landed!.textContent = '';
    this.input.disabled = true;
    this.callKey = '';
    this.showCall(call, prompt, Infinity);
  }

  demoLanded(tier: TierId, name: string, frames: number) {
    this.showLanded(tier, name, frames);
  }

  private endDemo() {
    this.demo = false;
    this.root.classList.remove('demo');
  }
}

function rowsOf(g: Game): RecordRow[] {
  return g.rounds.map((r) => (r.locked ? { tier: r.locked.entry.tier, name: r.locked.entry.name } : { timedOut: r.timedOut }));
}
