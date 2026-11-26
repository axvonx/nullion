import { LAYERS, MAX_DEPTH, layerAt } from '../core/layers';
import { TIERS } from '../core/tiers';
import { ANSWER_MS, type Game, type SubmitResult } from '../game/game';
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

export class Hud {
  readonly root: HTMLElement;
  private canvas: HTMLCanvasElement;
  private els: Record<string, HTMLElement>;
  private input: HTMLInputElement;
  private rejectCount = 0;
  private game: Game | undefined;
  private scrollMode = false;
  private dateLabel = '';

  constructor(mount: HTMLElement) {
    // The scene is a full-bleed backdrop; every piece of UI floats over it as a panel.
    mount.innerHTML = `
      <canvas class="scene" aria-label="Your cursor descending through the software stack"></canvas>
      <header class="bar">
        <span class="chip"><span class="wordmark">nullion</span> <span class="meta" data-el="meta"></span></span>
        <span class="chip depth" data-el="depth"></span>
      </header>
      <details class="backtrace panel" data-el="backtrace" aria-label="Backtrace">
        <summary><span>backtrace</span> <span class="bt-count" data-el="btCount"></span></summary>
        <ol data-el="frames"></ol>
      </details>
      <section class="console panel">
        <div class="watchdog" data-el="watchdogWrap"><div class="watchdog-fill" data-el="watchdog"></div></div>
        <div class="call" data-el="call"></div>
        <div class="plain" data-el="plain"></div>
        <form class="prompt-line" data-el="form" autocomplete="off">
          <label for="guess" class="caret">&gt;</label>
          <input id="guess" name="guess" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="type an answer, press Enter" />
        </form>
        <output class="feedback" data-el="feedback" aria-live="polite"></output>
        <div class="landed" data-el="landed" aria-live="polite"></div>
        <div class="result" data-el="result" hidden>
          <pre data-el="share"></pre>
          <button type="button" data-el="copy">Copy result</button>
        </div>
        <div class="scroll-hint" data-el="scrollHint" hidden>Scroll-only mode: scroll, or use ↑ ↓ / PgUp PgDn, to move through the stack.</div>
      </section>`;
    this.root = mount;
    this.canvas = $(mount, 'canvas');
    this.input = $(mount, '#guess');
    this.els = Object.fromEntries([...mount.querySelectorAll<HTMLElement>('[data-el]')].map((e) => [e.dataset.el!, e]));
    // Wide screens show the backtrace as a side panel; narrow ones start it collapsed to a chip.
    (this.els.backtrace as HTMLDetailsElement).open = matchMedia('(min-width: 1100px)').matches;
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
    this.dateLabel = dateLabel;
    this.rejectCount = 0;
    this.els.result!.hidden = true;
    this.els.copy!.textContent = 'Copy result';
    this.els.feedback!.textContent = '';
    this.els.landed!.textContent = '';
    this.renderFrames();
  }

  setScrollMode(on: boolean) {
    this.scrollMode = on;
    this.root.classList.toggle('scroll-mode', on);
    this.els.scrollHint!.hidden = !on;
  }

  /** Per-frame refresh of the timed parts. */
  update(now: number, depthShown: number) {
    const layer = layerAt(depthShown);
    this.els.depth!.textContent = `${Math.round(depthShown)} frames · ${layer.name}`;
    const g = this.game;
    if (!g) return;
    this.els.meta!.textContent = `#${g.puzzle} · ${this.dateLabel}`;
    if (this.scrollMode) return;

    const p = g.phase;
    const r = g.current();
    const fill = this.els.watchdog!;
    if (p.kind === 'reading') {
      this.els.call!.textContent = r!.question.call;
      this.els.plain!.textContent = `${r!.question.prompt} · ${Math.ceil((p.until - now) / 1000)}`;
      fill.style.transform = 'scaleX(1)';
      fill.classList.remove('low');
      this.input.disabled = true;
    } else if (p.kind === 'answering') {
      this.els.call!.textContent = r!.question.call;
      this.els.plain!.textContent = r!.question.prompt;
      const left = p.until === null ? 1 : Math.max(0, (p.until - now) / ANSWER_MS);
      fill.style.transform = `scaleX(${left})`;
      fill.classList.toggle('low', left < 0.25);
      if (this.input.disabled) {
        this.input.disabled = false;
        this.input.focus();
        this.els.feedback!.textContent = '';
        this.els.landed!.textContent = '';
      }
    } else if (p.kind === 'between') {
      this.input.disabled = true;
      if (r!.timedOut && !this.els.landed!.textContent) this.els.landed!.textContent = 'watchdog: round timed out, no frames pushed';
    } else if (p.kind === 'done') {
      this.input.disabled = true;
      this.els.call!.textContent = 'exit(0)';
      this.els.plain!.textContent = 'That’s today’s stack. A new one boots at local midnight.';
      fill.style.transform = 'scaleX(0)';
      this.showResult(g);
    } else {
      this.els.call!.textContent = 'boot…';
      this.els.plain!.textContent = '';
    }
  }

  private onSubmit(res: SubmitResult, scene: Scene, g: Game) {
    const fb = this.els.feedback!;
    if (res.kind === 'rejected') {
      fb.className = 'feedback fault';
      fb.textContent = REJECT_LINES[this.rejectCount++ % REJECT_LINES.length]!(res.guess);
      return;
    }
    if (res.kind === 'duplicate') {
      fb.className = 'feedback';
      fb.textContent = `${res.entry.name} is already on the stack`;
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
      ? ` · ${res.entry.name} · +${res.pushed} frame${res.pushed === 1 ? '' : 's'}. ${res.entry.note ?? t.blurb}`
      : ` · ${res.entry.name} (logged; only your first answer pushes frames)`;
    this.els.landed!.append(tierEl, rest);
    scene.react(t.id);
    scene.setTarget(g.depth);
    this.renderFrames();
  }

  renderFrames() {
    const g = this.game;
    const ol = this.els.frames!;
    ol.innerHTML = '';
    const add = (cls: string, text: string, tierId?: string) => {
      const li = document.createElement('li');
      li.className = cls;
      li.textContent = text;
      if (tierId) li.dataset.tier = tierId;
      ol.append(li);
    };
    add('frame', '#0  main');
    this.els.btCount!.textContent = g ? `· ${g.depth} frames` : '';
    if (!g) return;
    let depth = 0;
    let layerIdx = 0;
    for (const r of g.rounds) {
      if (!r.locked) {
        if (r.timedOut) add('frame timeout', '#—  watchdog timeout');
        continue;
      }
      const t = TIERS[r.locked.entry.tier];
      const from = depth + 1;
      depth += t.frames;
      add('frame', `${from === depth ? `#${depth}` : `#${from}–${depth}`}  ${r.locked.entry.name}`, t.id);
      while (layerIdx + 1 < LAYERS.length && depth >= LAYERS[layerIdx + 1]!.from) {
        layerIdx++;
        const l = LAYERS[layerIdx]!;
        add('boundary', l.boundary ? `── ${l.boundary} → ${l.name}` : `── ${l.name}`);
      }
    }
  }

  private showResult(g: Game) {
    if (!this.els.result!.hidden) return;
    const glyphs = g.rounds.map((r) => (r.locked ? TIERS[r.locked.entry.tier].glyph : '⬛')).join('');
    this.els.share!.textContent = `nullion #${g.puzzle} · ${g.depth} frames · ${layerAt(g.depth).name}\n${glyphs}`;
    this.els.result!.hidden = false;
  }
}
