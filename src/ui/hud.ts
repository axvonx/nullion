import { MAX_DEPTH, layerAt } from '../core/layers';
import { TIERS } from '../core/tiers';
import { ANSWER_MS, type Game, type SubmitResult } from '../game/game';
import { reducedMotion } from '../looks';
import type { Scene } from '../render/scene';

const $ = <T extends HTMLElement>(root: ParentNode, sel: string): T => {
  const el = root.querySelector<T>(sel);
  if (!el) throw new Error(`missing element ${sel}`);
  return el;
};

const REJECT_LINES = [
  (g: string) => `command not found: ${g}`,
  (g: string) => `ENOENT: no answer named '${g}'`,
  (g: string) => `404: '${g}' isn't on the list`,
];

/** Below this share of the answer time left, the watchdog goes into its low-time state. */
export const LOW_TIME = 0.25;

export function framesLabel(n: number): string {
  return `${n} stack frame${n === 1 ? '' : 's'}`;
}

/** Restart a one-shot CSS animation class on an element (a "settle" when its content changes). */
function replay(el: HTMLElement, cls: string) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

export class Hud {
  readonly root: HTMLElement;
  private canvas: HTMLCanvasElement;
  private els: Record<string, HTMLElement>;
  private input: HTMLInputElement;
  private rejectCount = 0;
  private game: Game | undefined;
  private scrollMode = false;
  private lastCall = '';
  private lastDepth = 0;
  private lastNow = 0;
  private lag = 0;
  private still: boolean | undefined;
  private shownFrames = -1;

  /**
   * Debug hook: when set, the watchdog bar shows this share of time left instead of the game's,
   * even in scroll mode. The debug rail's timer demo drives it.
   */
  watchdogOverride: ((now: number) => number) | undefined;

  constructor(mount: HTMLElement) {
    // The scene is a full-bleed backdrop; every piece of UI floats over it as a panel.
    mount.innerHTML = `
      <canvas class="scene" aria-label="Your cursor descending through the software stack"></canvas>
      <header class="bar">
        <span class="chip meta float" data-el="meta"><span class="led" aria-hidden="true"></span><span data-el="metaText"></span></span>
        <span class="chip depth float" data-el="depth"></span>
      </header>
      <section class="console panel float" data-el="console">
        <div class="watchdog" data-el="watchdogWrap"><div class="watchdog-fill" data-el="watchdog"></div></div>
        <span class="wd-secs" data-el="secs" aria-hidden="true"></span>
        <div class="call" data-el="call"></div>
        <div class="plain" data-el="plain"></div>
        <form class="prompt-line" data-el="form" autocomplete="off">
          <label for="guess" class="caret">&gt;</label>
          <input id="guess" name="guess" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="type an answer, press Enter" />
        </form>
        <output class="feedback" data-el="feedback" aria-live="polite"></output>
        <div class="landed" data-el="landed" aria-live="polite"></div>
        <div class="result" data-el="result" hidden>
          <div class="wordmark">nullion</div>
          <ol class="record" data-el="record" aria-label="Your answers today"></ol>
          <pre data-el="share"></pre>
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

  bind(scene: Scene, now: () => number) {
    this.els.form!.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const g = this.game;
      if (!g) return;
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
      void navigator.clipboard.writeText(this.els.share!.textContent ?? '').then(() => {
        this.els.copy!.textContent = 'Copied';
      });
    });

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
    this.rejectCount = 0;
    this.lastCall = '';
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

  /** Per-frame refresh of the timed parts and the panels' float. */
  update(now: number, depthShown: number) {
    this.updateMotion(now, depthShown);
    const frames = Math.round(depthShown);
    if (frames !== this.shownFrames) {
      this.shownFrames = frames;
      this.els.depth!.textContent = framesLabel(frames);
    }

    const override = this.watchdogOverride?.(now);
    this.root.classList.toggle('wd-demo', override !== undefined);
    if (override !== undefined) this.setWatchdog(override);

    const g = this.game;
    if (!g || this.scrollMode) return;

    const p = g.phase;
    const r = g.current();
    let left: number;
    if (p.kind === 'reading') {
      this.setCall(r!.question.call);
      this.els.plain!.textContent = `${r!.question.prompt} · ${Math.ceil((p.until - now) / 1000)}`;
      left = 1;
      this.input.disabled = true;
    } else if (p.kind === 'answering') {
      this.setCall(r!.question.call);
      this.els.plain!.textContent = r!.question.prompt;
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
      if (r!.timedOut && !this.els.landed!.textContent) this.els.landed!.textContent = 'watchdog: round timed out, no frames pushed';
    } else if (p.kind === 'done') {
      this.input.disabled = true;
      this.setCall('exit(0)');
      this.els.plain!.textContent = 'That’s today’s stack. A new one boots at local midnight.';
      left = 0;
      this.showResult(g);
    } else {
      this.setCall('boot…');
      this.els.plain!.textContent = '';
      left = 1;
    }
    if (override === undefined) this.setWatchdog(left, p.kind === 'answering' && p.until !== null);
  }

  private setCall(text: string) {
    if (text === this.lastCall) return;
    this.lastCall = text;
    this.els.call!.textContent = text;
    replay(this.els.call!, 'settle-in');
  }

  /** Bar fill, low-time state and the seconds readout that only appears when time is short. */
  private setWatchdog(left: number, timed = true) {
    this.els.watchdog!.style.transform = `scaleX(${left})`;
    const low = timed && left > 0 && left < LOW_TIME;
    this.els.watchdog!.classList.toggle('low', low);
    this.els.console!.classList.toggle('low', low);
    this.els.secs!.textContent = low ? `${Math.ceil((left * ANSWER_MS) / 1000)}s` : '';
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

  private onSubmit(res: SubmitResult, scene: Scene, g: Game) {
    const fb = this.els.feedback!;
    if (res.kind === 'rejected') {
      fb.className = 'feedback fault';
      fb.textContent = REJECT_LINES[this.rejectCount++ % REJECT_LINES.length]!(res.guess);
      replay(fb, 'settle-in');
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
    this.els.landed!.innerHTML = '';
    const tierEl = document.createElement('span');
    tierEl.className = `tier tier-${t.id}`;
    tierEl.textContent = t.name;
    const rest = document.createElement('span');
    rest.textContent = res.pushed
      ? ` · ${res.entry.name} · +${res.pushed}. ${res.entry.note ?? t.blurb}`
      : ` · ${res.entry.name} (logged; only your first answer pushes frames)`;
    this.els.landed!.append(tierEl, rest);
    replay(this.els.landed!, 'settle-in');
    scene.react(t.id);
    scene.setTarget(g.depth);
  }

  private showResult(g: Game) {
    if (!this.els.result!.hidden) return;
    // The record of the day's answers lives here (and in the share text's glyphs), not in a running panel.
    const ol = this.els.record!;
    ol.innerHTML = '';
    for (const r of g.rounds) {
      const li = document.createElement('li');
      if (r.locked) {
        const t = TIERS[r.locked.entry.tier];
        li.dataset.tier = t.id;
        li.textContent = `${t.glyph} ${r.locked.entry.name} +${t.frames}`;
      } else {
        li.className = 'timeout';
        li.textContent = `⬛ ${r.timedOut ? 'timed out' : 'skipped'}`;
      }
      ol.append(li);
    }
    const glyphs = g.rounds.map((r) => (r.locked ? TIERS[r.locked.entry.tier].glyph : '⬛')).join('');
    this.els.share!.textContent = `nullion #${g.puzzle} · ${framesLabel(g.depth)} · ${layerAt(g.depth).name}\n${glyphs}`;
    this.els.result!.hidden = false;
    replay(this.els.result!, 'settle-in');
  }
}
