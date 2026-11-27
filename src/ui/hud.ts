import { formatCountdown, msUntilNextDay, puzzleNumber } from '../core/day';
import { PROMPTS_PER_DAY, layerAt, maxDepthFor, type Layer, type LayerId } from '../core/layers';
import type { CategoryEntry } from '../core/match';
import { TIER_IDS, TIERS, type TierId } from '../core/tiers';
import { ANSWER_MS, READ_MS, type Game, type SubmitResult } from '../game/game';
import { buildShareText, deliverShare, siteUrl } from '../game/share';
import type { StatsOutcome } from '../game/stats';
import { look, reducedMotion } from '../looks';
import type { Scene } from '../render/scene';
import { FORMS, FORM_BY_LAYER, type FormId } from './forms';
import { tierIcon } from './tier-icons';
import { answerSheet, type SheetGroup } from './answer-sheet';
import { revealLayout } from './reveal-layout';
import { mountPrefsMenu } from './prefs-menu';
import { TitleLogo } from './title-logo';
import { LayerStack } from './layer-stack';
import { sound } from '../audio/sound';
import { missedAnswerUrl, suggestQuestionUrl } from './issues';

const $ = <T extends HTMLElement>(root: ParentNode, sel: string): T => {
  const el = root.querySelector<T>(sel);
  if (!el) throw new Error(`missing element ${sel}`);
  return el;
};

/** Below this share of the answer time left, the watchdog goes into its low-time state. */
export const LOW_TIME = 0.25;
/** The reading phase types the call in at this many ms per character. */
const TYPE_MS = 28;
function answerPlaceholder(): string {
  return typeof window !== 'undefined' && window.innerWidth <= 520 ? 'type an answer…' : 'type an answer, press Enter';
}
/** Demos only: how long the rail lets a reveal sit before pressing "Unwind further" for you. Play waits for the player. */
export const REVEAL_MS = 2400;
const REVEAL_FADE_MS = 200;

/** Layer entrances: how long the name card shows at the top of the screen. */
const ENTRANCE_MS = 2600;

/** What each layer is, in a line a non-systems player can read. Shown under the layer's name as you enter it. */
export const LAYER_BLURBS: Record<LayerId, string> = {
  internet: 'Autonomous systems, BGP routes and undersea fiber above your machine',
  browser: 'The DOM tree, CSS layout engine and GPU compositor framing your apps',
  application: 'The apps you click, tap and type into',
  bytecode: 'Parsed syntax trees and virtual instructions before execution',
  jit: 'Just-in-time compilers forging hot loops into native machine code',
  runtime: 'The engine that runs your code and tidies up its memory',
  libraries: 'Shared code every program leans on',
  linker: 'The dynamic linker resolving symbols and wiring shared objects together',
  userspace: 'The operating system’s own programs and services',
  'kernel-entry': 'The syscall gate, seccomp checks and VFS facade into Ring 0',
  kernel: 'The core of the operating system, in charge of everything above',
  'kernel-arch': 'Interrupt controllers, spinlocks, RCU and raw hardware bridges',
  drivers: 'The translators between the operating system and the hardware',
  'bus-fabric': 'PCIe lanes, DMA rings and memory-mapped I/O crisscrossing the board',
  firmware: 'Code built into the hardware that starts the machine',
  vmm: 'Virtual device models pretending to be disks, NICs and consoles',
  'ring-1': 'The hypervisor, running whole operating systems as guests',
  ept: 'Two-dimensional nested page tables and IOMMU quarantine gates',
  'ring-2': 'System Management Mode, which can pause everything above it',
  smram: 'Locked hardware-shielded memory invisible to the OS and hypervisor',
  'ring-3': 'The Intel Management Engine, a hidden computer inside your computer',
  'me-minix-user': 'A tiny hidden MINIX 3 userspace running even when your PC is off',
  'me-minix-kern': 'The message-passing microkernel deep inside the management core',
  uarch: 'Out-of-order μops, branch predictors and L1/L2/L3 cache banks',
  rtl: 'NAND gates, flip-flops and the clock tree pulsing in lockstep',
  cmos: 'FinFET transistors, doped wells and stacked copper metal interconnects',
  litho: '13.5nm EUV interference fringes etched into crystalline silicon',
  bandgap: 'Valence and conduction bands where electrons tunnel through barriers',
  landauer: 'The thermodynamic floor of computation: kT ln 2 per erased bit',
};

/**
 * Plain-language lines for the reveal, used when the answer has no note of its own. They say how rare the answer
 * was, for players who aren't systems people; no terminal in-jokes.
 */
export const TIER_QUIPS: Record<TierId, readonly string[]> = {
  'off-by-one': ['Right answer. Most people said this one too.', 'A classic. Nearly everyone gets here.', 'Safe and solid. You’re in good company.'],
  womm: ['Feels obscure, but it’s everyone’s go-to.', 'The “clever” pick lots of people make.', 'Everyone thinks they’re the only one who knows this.'],
  npe: ['Good answer. Plenty of people found it.', 'Fairly well known, but not everyone thought of it.', 'A common pick, and a good one.'],
  leak: ['Most players missed this one.', 'Getting into less-travelled ground.', 'Not many people reached for that.'],
  race: ['Only a few people find this one.', 'Now you’re digging.', 'A rare find. Nicely done.'],
  heisenbug: ['Hardly anyone thinks of this.', 'A deep cut. Very few found it.', 'That one hides from almost everyone.'],
  bitflip: ['Today’s rarest answer. You found it.', 'The one answer almost nobody finds.', 'One in a billion. Well, almost.'],
};

export function framesLabel(n: number): string {
  return `${n} stack frame${n === 1 ? '' : 's'}`;
}

/** One line of the day's record: an accepted answer, or a round that pushed nothing. */
export interface RecordRow {
  /** The prompt's question id: lets the row open its answer sheet. */
  question?: string;
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

/** The share button says what it will do: native share where the device has it, else copy. */
function shareLabel(): string {
  return typeof navigator.share === 'function' ? 'Share result' : 'Copy result';
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
  /** The prompt line's identity (text + form); a new one restarts typing. */
  private promptKey = '';
  private barked = -1;
  private lastReadSec = -1;
  private lastLowSec = -1;
  private slotsSig = '';
  private ended = false;
  private shareText = '';
  /** Records the finished day and returns the lifetime stats; undefined when this game does not count (Endless, debug). */
  private statsSource: (() => StatsOutcome) | undefined;
  /** The game clock (wall-clock ms in production), set by bind(). Used wherever a deadline is read or set. */
  private clock: () => number = () => Date.now();
  private nextDaySig = '';
  /** A daily game for the real current day (not a debug date), so the end card counts down to the next one. */
  private liveDaily = false;
  private demo = false;
  private titleLogo: TitleLogo;
  private layerStack: LayerStack;
  private titleOpen = false;
  private titleTimer = 0;

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
        <span class="bar-left" data-el="barLeft"><span class="chip meta float" data-el="meta"><span class="led" aria-hidden="true"></span><span data-el="metaText"></span></span></span>
        <span class="bar-right"><span class="chip slots float" data-el="slots" aria-label="Round scores"></span><span class="chip depth float" data-el="depth"></span><button type="button" class="chip endless-btn float" data-el="endlessBtn" hidden aria-pressed="false" title="Toggle Endless Mode (3-strike watchdog descent)">Endless</button></span>
      </header>
      <div class="notice" data-el="notice" role="alert" hidden><span data-el="noticeText"></span><button type="button" data-el="noticeClose" aria-label="Dismiss">×</button></div>
      <section class="title-screen" data-el="titleScreen" aria-label="Nullion" hidden>
        <div class="title-head" data-el="titleHead"></div>
        <div class="title-foot">
          <p class="title-tag">Seven prompts a day. Rarer answers descend deeper into the stack.</p>
          <button type="button" class="title-start" data-el="titleStart"><span>Unwind the stack</span><span class="title-arrow" aria-hidden="true">▾</span></button>
          <button type="button" class="title-how-btn" data-el="titleHowBtn" aria-expanded="false" aria-controls="title-how">How to play</button>
        </div>
        <div id="title-how" class="title-how" data-el="titleHow" role="dialog" aria-label="How to play" hidden>
          <div class="title-how-bar">
            <span class="title-how-title">How to play</span>
            <button type="button" class="title-how-close" data-el="titleHowClose" aria-label="Close">×</button>
          </div>
          <ul class="title-rules" data-el="titleRules"></ul>
          <div class="title-how-title title-how-sub">Tiers · stack frames</div>
          <p class="title-how-note">Wrong guesses cost nothing but time. Harder-to-reproduce answers descend deeper:</p>
          <ol class="title-tiers" data-el="titleTiers"></ol>
        </div>
      </section>
      <section class="console panel float" data-el="console" aria-label="Prompt">
        <div class="titlebar" data-el="titlebar" aria-hidden="true"><span class="close">x</span></div>
        <div class="watchdog" data-el="watchdogWrap"><div class="watchdog-fill" data-el="watchdog"></div></div>
        <div class="plain" data-el="plain"></div>
        <form class="prompt-line" data-el="form" autocomplete="off">
          <label for="guess" class="caret" data-el="caret">&gt;</label>
          <input id="guess" name="guess" aria-label="Your answer" spellcheck="false" autocapitalize="off" autocomplete="off" placeholder="type an answer, press Enter" />
          <span class="wd-secs" data-el="secs" aria-hidden="true"></span>
          <span class="bracket" aria-hidden="true">]</span>
          <button type="submit" class="ok-btn">OK</button>
          <button type="button" class="rv-next" data-el="rvNext">Unwind further ▾</button>
        </form>
        <div class="bios-footer" aria-hidden="true"><b>F10</b> Save · <b>Enter</b> Select · <b>ESC</b> Exit</div>
        <output class="feedback" data-el="feedback" aria-live="polite"></output>
        <div class="result" data-el="result" hidden>
          <div class="wordmark">nullion <span data-el="puzzleNo"></span></div>
          <div class="headline" data-el="headline"></div>
          <ol class="record" data-el="record" aria-label="Today’s backtrace, most recent first"></ol>
          <div class="stats" data-el="stats" hidden></div>
          <div class="result-foot"><span class="next-day" data-el="nextDay">A new stack opens at local midnight.</span><button type="button" data-el="copy">Copy result</button></div>
          <div class="result-links" data-el="resultLinks"></div>
        </div>
        <div class="scroll-hint" data-el="scrollHint" hidden>scroll · ↑ ↓ · PgUp PgDn</div>
      </section>
      <div class="reveal" data-el="reveal" hidden role="status" aria-live="polite">
        <div class="rv-name" data-el="rvName"></div>
        <div class="rv-body"><div class="rv-answer" data-el="rvAnswer"></div><div class="rv-line" data-el="rvLine"></div></div>
      </div>
      <div class="entrance" data-el="entrance" hidden role="status" aria-live="polite">
        <div class="en-name" data-el="enName"></div>
        <div class="en-desc" data-el="enDesc"></div>
      </div>`;
    this.root = mount;
    this.canvas = $(mount, 'canvas');
    this.input = $(mount, '#guess');
    this.els = Object.fromEntries([...mount.querySelectorAll<HTMLElement>('[data-el]')].map((e) => [e.dataset.el!, e]));
    this.titleLogo = new TitleLogo();
    this.els.titleHead!.append(this.titleLogo.canvas);
    this.layerStack = new LayerStack((id) => sound.stackCrunch(id));
    mount.append(this.layerStack.el);
    this.buildTitleRules();
    this.buildTitleTiers();
    mountPrefsMenu(mount, this.els.barLeft!);
  }

  /** The rules, with every number read from the game's own constants. */
  private buildTitleRules() {
    const frames = TIER_IDS.map((id) => TIERS[id].frames);
    const lines = [
      `${PROMPTS_PER_DAY} prompts a day, ${ANSWER_MS / 1000} seconds each.`,
      'One answer per prompt: the first one accepted is locked in.',
      `Rarer answers push more stack frames (${Math.min(...frames)} to ${Math.max(...frames)}), so you descend deeper.`,
      'Everyone gets the same puzzle.',
      'A new one opens at your local midnight.',
    ];
    this.els.titleRules!.replaceChildren(
      ...lines.map((t) => {
        const li = document.createElement('li');
        li.textContent = t;
        return li;
      }),
    );
  }

  private buildTitleTiers() {
    const ol = this.els.titleTiers!;
    ol.replaceChildren();
    for (const id of TIER_IDS) {
      const t = TIERS[id];
      const li = document.createElement('li');
      const name = document.createElement('span');
      name.className = `tt-name tier-${t.id}`;
      name.textContent = t.name;
      const frames = document.createElement('span');
      frames.className = 'tt-frames';
      frames.textContent = `+${t.frames}`;
      li.append(tierIcon(t.id), name, frames);
      ol.append(li);
    }
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
    this.clock = now;
    // Entering a layer (on a dive, in the replay, at boot) shows its name card.
    scene.onLayerChange = (layer) => this.enterLayer(layer);
    this.els.form!.addEventListener('submit', (ev) => {
      ev.preventDefault();
      // Enter while the reveal is up means "Unwind further", once; never a submit behind the reveal.
      if (this.revealOpen) {
        this.unwind(now());
        return;
      }
      const g = this.game;
      if (!g || this.demo) return;
      const guess = this.input.value;
      if (!guess.trim()) {
        g.advance(now());
        return;
      }
      const res = g.submit(guess, now());
      this.onSubmit(res, scene, g);
    });
    // Editing a correction makes it just a new guess: drop the correction's mark and hint.
    this.input.addEventListener('input', () => {
      if (!this.input.classList.contains('corrected')) return;
      this.input.classList.remove('corrected');
      this.els.feedback!.textContent = '';
    });

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

    // "Unwind further": close the reveal and move the game on (the next prompt, or the end-of-day card).
    this.els.rvNext!.addEventListener('click', () => this.unwind(now()));
    this.els.noticeClose!.addEventListener('click', () => (this.els.notice!.hidden = true));

    // Title screen: "Unwind the stack" dives into round 1. Hovering or clicking the logo triggers a glitch pulse.
    this.titleLogo.onBurst = (ev) => {
      scene.triggerTitleGlitch(ev);
      sound.playTitleGlitch(ev.kind);
    };
    this.els.titleStart!.addEventListener('click', () => this.startFromTitle(now()));
    this.els.titleStart!.addEventListener('pointerenter', () => this.titleLogo.pulse('bitflip'));
    this.titleLogo.canvas.addEventListener('click', () => this.titleLogo.pulse());
    const setHowOpen = (open: boolean) => {
      this.els.titleHow!.hidden = !open;
      this.els.titleHowBtn!.setAttribute('aria-expanded', String(open));
      this.els.titleHowBtn!.textContent = open ? 'Hide rules' : 'How to play';
    };
    this.els.titleHowBtn!.addEventListener('click', () => setHowOpen(this.els.titleHow!.hidden !== false));
    this.els.titleHowClose!.addEventListener('click', () => {
      setHowOpen(false);
      this.els.titleHowBtn!.focus();
    });
    window.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && !this.els.titleHow!.hidden) {
        setHowOpen(false);
        this.els.titleHowBtn!.focus();
      }
    });

    // Scroll-only mode: fast, responsive free movement through the entire Daily or Endless stack.
    let scrollTarget = 0;
    const nudge = (d: number) => {
      const mode = this.game?.mode ?? 'daily';
      const cap = maxDepthFor(mode) + (mode === 'endless' ? 60 : 4);
      // Accumulate on scrollTarget so rapid wheel/trackpad flicks aren't swallowed by camera smoothing
      if (Math.abs(scrollTarget - scene.displayDepth) > (mode === 'endless' ? 220 : 24)) {
        scrollTarget = scene.displayDepth;
      }
      scrollTarget = Math.min(cap, Math.max(0, scrollTarget + d));
      scene.setTarget(scrollTarget);
    };
    window.addEventListener(
      'wheel',
      (ev) => {
        if (!this.scrollMode || ev.target instanceof HTMLInputElement || ev.target instanceof HTMLSelectElement) return;
        // Panels (and the debug menu) scroll themselves.
        if (ev.target instanceof Element && ev.target.closest('.panel, .dbg-panel')) return;
        ev.preventDefault();
        const mode = this.game?.mode ?? 'daily';
        const mult = ev.shiftKey ? 3 : 1;
        nudge((ev.deltaY / (mode === 'endless' ? 10 : 26)) * mult);
      },
      { passive: false },
    );
    window.addEventListener('keydown', (ev) => {
      if (!this.scrollMode || ev.target instanceof HTMLInputElement || ev.target instanceof HTMLSelectElement) return;
      const mode = this.game?.mode ?? 'daily';
      const endless = mode === 'endless';
      if (ev.key === 'Home') {
        ev.preventDefault();
        scrollTarget = 0;
        scene.setTarget(0);
        return;
      }
      if (ev.key === 'End') {
        ev.preventDefault();
        scrollTarget = maxDepthFor(mode);
        scene.setTarget(scrollTarget);
        return;
      }
      const step = {
        ArrowDown: endless ? 12 : 2,
        ArrowUp: endless ? -12 : -2,
        PageDown: endless ? 80 : 12,
        PageUp: endless ? -80 : -12,
      }[ev.key];
      if (step === undefined) return;
      ev.preventDefault();
      nudge(step);
    });
  }

  setGame(g: Game, dateLabel: string, statsSource?: () => StatsOutcome) {
    this.game = g;
    this.statsSource = statsSource;
    this.liveDaily = g.mode === 'daily' && g.puzzle === puzzleNumber(new Date(this.clock()));
    this.nextDaySig = '';
    this.els.nextDay!.textContent = 'A new stack opens at local midnight.';
    this.els.notice!.hidden = true;
    this.endDemo();
    this.ended = false;
    this.barked = -1;
    this.lastReadSec = -1;
    this.lastLowSec = -1;
    this.slotsSig = '';
    this.revealRound = -1;
    this.onUnwind = undefined;
    sound.stopReactions();
    this.hideReveal();
    this.scene?.setVignette(false);
    this.scene?.setHold(false, true);
    this.promptKey = '';
    this.els.result!.hidden = true;
    this.els.copy!.textContent = shareLabel();
    this.els.feedback!.textContent = '';
    this.els.metaText!.textContent = `#${g.puzzle}`;
    this.els.meta!.title = `Puzzle #${g.puzzle} · ${dateLabel}`;
    this.els.titleHow!.hidden = true;
    this.els.titleHowBtn!.setAttribute('aria-expanded', 'false');
    this.els.titleHowBtn!.textContent = 'How to play';
    this.entranceBooted = false;
    this.syncSlots(g);
    this.syncTitle();
  }

  /** Wire the debug-build top-right "Endless" mode toggle button. */
  setEndlessToggle(show: boolean, active: boolean, onToggle: (next: boolean) => void) {
    const btn = this.els.endlessBtn as HTMLButtonElement | undefined;
    if (!btn) return;
    btn.hidden = !show;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
    btn.textContent = active ? 'Endless: ON' : 'Endless';
    btn.onclick = () => onToggle(!active);
  }

  /** Render the 7 round score slots (Daily) or 3 watchdog strike fuses + round counter (Endless). */
  private syncSlots(g: Game) {
    if (g.mode === 'endless') {
      const sig = `endless|${g.strikes}|${g.rounds.length}`;
      if (sig === this.slotsSig) return;
      this.slotsSig = sig;
      const wrap = this.els.slots!;
      wrap.replaceChildren();
      for (let i = 0; i < g.maxStrikes; i++) {
        const alive = i < g.strikesLeft;
        const f = document.createElement('span');
        f.className = alive ? 'slot fuse' : 'slot fuse burned';
        f.textContent = alive ? '●' : '×';
        f.title = alive ? 'Watchdog fuse intact' : 'Watchdog strike burned';
        wrap.append(f);
      }
      const rc = document.createElement('span');
      rc.className = 'slot endless-round';
      rc.textContent = `#${g.rounds.length}`;
      rc.title = `Endless round ${g.rounds.length}`;
      wrap.append(rc);
      return;
    }
    const active = g.phase.kind === 'reading' || g.phase.kind === 'answering' || g.phase.kind === 'between' ? g.phase.round : -1;
    // Hold the current round's slot at '-' while its dive is still sinking so we never spoil the tier/score early.
    const pendingSink =
      g.phase.kind === 'between' && (Boolean(this.scene?.diving) || this.revealRound < g.phase.round) ? g.phase.round : -1;
    const sig =
      `${active}|${pendingSink}|` +
      g.rounds
        .map((r, i) =>
          i === pendingSink
            ? '-'
            : r.locked
              ? `${r.locked.entry.tier}:${TIERS[r.locked.entry.tier].frames}`
              : r.timedOut || (g.phase.kind === 'done' && !r.locked) || (active > i && !r.locked)
                ? '0'
                : '-',
        )
        .join(',');
    if (sig === this.slotsSig) return;
    this.slotsSig = sig;
    const wrap = this.els.slots!;
    wrap.replaceChildren();
    g.rounds.forEach((r, i) => {
      const s = document.createElement('span');
      s.className = 'slot';
      if (i !== pendingSink && r.locked) {
        const t = TIERS[r.locked.entry.tier];
        s.dataset.tier = t.id;
        s.textContent = String(t.frames);
        s.title = `Round ${i + 1}: ${t.name} (+${t.frames})`;
      } else if (i !== pendingSink && (r.timedOut || g.phase.kind === 'done' || (active > i && !r.locked))) {
        s.classList.add('miss');
        s.textContent = '0';
        s.title = `Round ${i + 1}: no frames`;
      } else {
        s.textContent = '-';
        if (i === active) s.classList.add('active');
        s.title = `Round ${i + 1}`;
      }
      wrap.append(s);
    });
  }

  setScrollMode(on: boolean) {
    this.scrollMode = on;
    this.root.classList.toggle('scroll-mode', on);
    this.els.scrollHint!.hidden = !on;
    this.syncTitle();
  }

  private startFromTitle(now: number) {
    const g = this.game;
    if (!g || g.phase.kind !== 'ready') return;
    sound.unlock();
    sound.diveStart();
    this.hideTitle();
    this.scene?.introDive();
    g.start(now);
    this.onPhaseChange();
    this.entranceBooted = true;
    this.enterLayer(layerAt(0));
  }

  private syncTitle() {
    const want = this.game?.phase.kind === 'ready' && !this.scrollMode && !this.demo;
    if (want) this.showTitle();
    else this.hideTitle();
  }

  private showTitle() {
    clearTimeout(this.titleTimer);
    const el = this.els.titleScreen!;
    this.positionTitle();
    el.classList.remove('out');
    el.hidden = false;
    this.root.classList.add('on-title');
    if (!this.titleOpen) {
      this.titleOpen = true;
      this.titleLogo.start();
      this.els.titleStart!.focus({ preventScroll: true });
    }
  }

  private hideTitle() {
    this.root.classList.remove('on-title');
    if (!this.titleOpen) {
      this.els.titleScreen!.hidden = true;
      return;
    }
    this.titleOpen = false;
    this.titleLogo.stop();
    this.scene?.clearTitleGlitches();
    this.els.titleHow!.hidden = true;
    const el = this.els.titleScreen!;
    el.classList.add('out');
    clearTimeout(this.titleTimer);
    this.titleTimer = window.setTimeout(() => {
      el.hidden = true;
      el.classList.remove('out');
    }, 220);
  }

  /** Frame the live cursor's bracket mark between the pixel wordmark above and the CTA below. */
  private positionTitle() {
    const scene = this.scene;
    if (!scene) return;
    const mark = scene.markCss();
    const vh = window.innerHeight || 800;
    const gap = Math.max(14, Math.min(28, Math.round(vh * 0.03)));
    const logoBottom = Math.max(vh * 0.56, vh - (mark.top - gap));
    const footTop = Math.min(vh * 0.52, mark.bottom + gap);
    const st = this.els.titleScreen!.style;
    st.setProperty('--logo-bottom', `${Math.round(logoBottom)}px`);
    st.setProperty('--foot-top', `${Math.round(footTop)}px`);
  }

  /** The game's phase changed: the console settles into its new content. */
  onPhaseChange() {
    replay(this.els.console!, 'settle');
  }

  /** Per-frame refresh of the timed parts, the console's form and the panels' float. */
  update(now: number, depthShown: number, wall: number = now) {
    this.syncTitle();
    if (this.titleOpen) this.positionTitle();
    const activeMode = this.game?.mode ?? 'daily';
    if (!this.entranceBooted && !this.titleOpen) {
      this.entranceBooted = true;
      this.enterLayer(layerAt(depthShown, activeMode));
    }
    this.updateMotion(now, depthShown);
    this.mirrorReaction(now);
    this.layerStack.setRightReserve(this.scene?.uiReserveRightCss ?? 0);
    this.layerStack.setVisible(!this.titleOpen && look('layerStack') === 'on');
    this.layerStack.sync(depthShown, activeMode, { animate: !this.scrollMode, reduced: reducedMotion() });
    const frames = Math.round(depthShown);
    if (frames !== this.shownFrames) {
      this.shownFrames = frames;
      this.els.depth!.textContent = framesLabel(frames);
    }
    const form = this.formOverride ?? FORM_BY_LAYER[layerAt(depthShown, activeMode).id];
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
    this.els.console!.classList.toggle('reading', p.kind === 'reading');
    if (p.kind === 'reading') {
      // A short boot beat: the question types in while the input is grayed out with a 3s → 2s → 1s countdown.
      this.showPrompt(r!.question.prompt, wall - (p.until - READ_MS));
      const secs = Math.max(1, Math.ceil((p.until - wall) / 1000));
      if (secs !== this.lastReadSec) {
        this.lastReadSec = secs;
        sound.countdownTick(secs, layerAt(depthShown, g.mode).id);
      }
      const wantPlaceholder = `Starting in ${secs}s`;
      if (this.input.placeholder !== wantPlaceholder) this.input.placeholder = wantPlaceholder;
      left = 1;
      this.input.disabled = true;
    } else if (p.kind === 'answering') {
      this.showPrompt(r!.question.prompt, Infinity);
      left = p.until === null ? 1 : Math.max(0, (p.until - wall) / g.answerMs);
      const ph = answerPlaceholder();
      if (this.input.placeholder !== ph) this.input.placeholder = ph;
      if (this.input.disabled) {
        this.lastReadSec = -1;
        this.lastLowSec = -1;
        sound.roundOpen(layerAt(depthShown, g.mode).id);
        this.input.disabled = false;
        this.input.focus({ preventScroll: true });
        this.els.feedback!.textContent = '';
      }
    } else if (p.kind === 'between') {
      const ph = answerPlaceholder();
      if (this.input.placeholder !== ph) this.input.placeholder = ph;
      this.input.disabled = true;
      left = 0;
      if (r!.timedOut && this.barked !== p.round) {
        this.barked = p.round;
        this.bark();
      }
      // The round waits on the reveal's button. Open the reveal once the dive has landed (or at once for a timeout);
      // opening it here rather than from the dive's callback means an interrupted dive can't strand the round.
      if (this.revealRound !== p.round && !this.scene?.diving) {
        this.revealRound = p.round;
        const lk = r!.locked;
        if (lk) this.reveal(lk.entry.tier, lk.entry.name, TIERS[lk.entry.tier].frames, lk.entry.note);
        else this.revealTimeout();
      }
    } else if (p.kind === 'done') {
      this.input.disabled = true;
      left = 0;
      if (!this.ended) this.endOfDay(rowsOf(g), g.depth, g.puzzle);
      this.updateNextDay(wall);
      this.showPrompt('', Infinity);
    } else {
      this.showPrompt('', Infinity);
      left = 1;
    }
    this.syncSlots(g);
    if (override === undefined) this.setWatchdog(left, p.kind === 'answering' && p.until !== null);
  }

  /** The end card's footer: a live countdown to the next puzzle, then a reload prompt once local midnight passes. */
  private updateNextDay(wall: number) {
    if (!this.liveDaily) return;
    const el = this.els.nextDay!;
    const now = new Date(wall);
    if (puzzleNumber(now) !== this.game!.puzzle) {
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

  /** A visible message for things the player should know (a save that could not be restored, a resume). */
  notify(message: string, kind: 'info' | 'error' = 'error') {
    this.els.notice!.classList.toggle('info', kind === 'info');
    this.els.noticeText!.textContent = message;
    this.els.notice!.hidden = false;
  }

  /** Show the question in the current form, typed in over `elapsed` ms (all at once under reduced motion). */
  private showPrompt(prompt: string, elapsed: number) {
    const form = this.form;
    if (!form) throw new Error('Hud.showPrompt before the first update() picked a form');
    const view = FORMS[form];
    const key = `${form}|${prompt}`;
    if (key !== this.promptKey) {
      this.promptKey = key;
      setText(this.els.caret!, view.caret());
      replay(this.els.plain!, 'settle-in');
    }
    const n = reducedMotion() ? prompt.length : Math.max(0, Math.floor(elapsed / TYPE_MS));
    const typed = n >= prompt.length ? prompt : `${prompt.slice(0, n)}▌`;
    setText(this.els.plain!, typed);
  }

  private applyForm(form: FormId) {
    const first = this.form === undefined;
    this.form = form;
    this.els.console!.dataset.form = form;
    this.promptKey = '';
    if (!first) replay(this.els.console!, 'morph');
    if (this.demo) this.showPrompt(this.demoPrompt, Infinity);
  }

  /** Bar fill, low-time state and the seconds readout that only appears when time is short. */
  private setWatchdog(left: number, timed = true) {
    this.els.watchdog!.style.transform = `scaleX(${left})`;
    const low = timed && left > 0 && left < LOW_TIME;
    this.els.watchdog!.classList.toggle('low', low);
    this.els.console!.classList.toggle('low', low);
    this.scene?.setLowTime(low);
    const lowSecs = low ? Math.ceil((left * ANSWER_MS) / 1000) : -1;
    if (lowSecs > 0 && lowSecs !== this.lastLowSec) {
      this.lastLowSec = lowSecs;
      sound.lowTimeTick(layerAt(this.scene?.displayDepth ?? 0).id);
    } else if (!low) {
      this.lastLowSec = -1;
    }
    setText(this.els.secs!, low ? `${lowSecs}s` : '');
  }

  /** Timeout: the watchdog barks: the card jolts and flashes red (only the flash, under reduced motion). */
  bark() {
    replay(this.els.console!, 'bark');
    sound.bark();
    this.revealTimeout();
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
    const locked = still || !!this.scene?.fx.freeze || !!this.scene?.fx.hang;
    const want = locked ? 0 : Math.max(-10, Math.min(10, -v * 0.9));
    const next = this.lag + (want - this.lag) * (1 - Math.exp(-dt * 4));
    if (Math.abs(next - this.lag) > 0.05 || (locked && this.lag !== 0)) {
      this.lag = locked ? 0 : next;
      this.root.style.setProperty('--lag', `${this.lag.toFixed(1)}px`);
    }
  }

  private fxShown = '';
  /** The floating UI's half of a tier reaction: freeze, hang grey, invert or tint, and racing/shaking panels + screen. */
  private mirrorReaction(now: number) {
    const fx = this.scene?.fx;
    if (!fx) return;
    const key = `${fx.freeze}|${fx.hang}|${fx.flip}`;
    if (key !== this.fxShown) {
      this.fxShown = key;
      this.root.classList.toggle('freeze', fx.freeze);
      this.root.classList.toggle('hang', fx.hang);
      this.root.classList.toggle('flip', fx.flip === 'invert');
      this.root.classList.toggle('tint', fx.flip === 'tint');
    }
    // High-intensity jiggle (WOMM's buildup) shakes the entire viewport so everything trembles right before the freeze.
    if (fx.jiggle > 1.05) {
      const amp = (fx.jiggle - 1.05) * 4.5;
      const sx = Math.round(Math.sin(now / 23) * amp);
      const sy = Math.round(Math.cos(now / 29) * amp * 0.8);
      this.root.style.transform = `translate(${sx}px, ${sy}px)`;
    } else if (this.root.style.transform) {
      this.root.style.transform = '';
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

  // ---------------------------------------------------------------------------------------------
  // The tier reveal: after the dive lands, the rarity front and centre, near the cursor, over a soft dim.

  private revealOpen = false;
  private revealTimer = 0;
  private quipTurn = 0;
  /** The round whose reveal has been shown (play mode). */
  private revealRound = -1;
  /** What "Unwind further" does: advance the game in play; the rail's demos set their own. */
  private onUnwind: ((now: number) => void) | undefined;

  /** Full-screen reveal of an accepted answer's tier. Call when the dive lands. */
  reveal(tier: TierId, name: string, frames: number, note?: string) {
    const t = TIERS[tier];
    const quips = TIER_QUIPS[tier];
    const line = note ?? quips[this.quipTurn++ % quips.length]!;
    setText(this.els.rvName!, t.name);
    this.els.rvName!.dataset.text = t.name;
    setText(this.els.rvAnswer!, `${name} · +${framesLabel(frames)}`);
    setText(this.els.rvLine!, line);
    this.openReveal(tier);
  }

  /** The watchdog's lower-key reveal: smaller, no icon pose or rarity, just that the round pushed nothing. */
  revealTimeout() {
    setText(this.els.rvName!, 'Time’s up');
    delete this.els.rvName!.dataset.text;
    setText(this.els.rvAnswer!, '');
    setText(this.els.rvLine!, 'No answer, so no frames this round.');
    this.openReveal('timeout');
  }

  private openReveal(kind: TierId | 'timeout') {
    const el = this.els.reveal!;
    // The tier's name sits just above the cursor's bracket mark and the details just below it, so the mascot,
    // mid-reaction, is framed between them; sizes step down where they'd meet the entrance band or the console.
    // The maths is pure and unit-tested (reveal-layout.ts).
    const scene = this.scene;
    if (scene) {
      const layer = layerAt(scene.displayDepth);
      const lay = revealLayout(
        window.innerWidth,
        window.innerHeight,
        scene.markCss(),
        { name: this.els.rvName!.textContent ?? '', answer: this.els.rvAnswer!.textContent ?? '', line: this.els.rvLine!.textContent ?? '', lowKey: kind === 'timeout' },
        look('layerName') === 'card' ? { name: layer.name, desc: LAYER_BLURBS[layer.id] } : undefined,
        scene.uiReserveRightCss > 0,
      );
      const st = el.style;
      st.setProperty('--name-bottom', `${Math.round(window.innerHeight - lay.name.bottom)}px`);
      st.setProperty('--body-top', `${Math.round(lay.body.top)}px`);
      st.setProperty('--name-px', `${lay.namePx}px`);
      st.setProperty('--answer-px', `${lay.answerPx}px`);
      st.setProperty('--line-px', `${lay.linePx}px`);
    }
    el.dataset.tier = kind;
    el.classList.toggle('low-key', kind === 'timeout');
    el.classList.remove('out');
    el.hidden = false;
    replay(el, 'in');
    this.scene?.setVignette(true);
    this.scene?.setHold(true);
    this.revealOpen = true;
    clearTimeout(this.revealTimer);
    // The console's entry box becomes the "Unwind further" button. Enter or Space presses it; it never closes by
    // itself in play.
    this.root.classList.add('unwinding');
    this.els.rvNext!.focus({ preventScroll: true });
  }

  /** "Unwind further": close the reveal, then move on. */
  private unwind(now: number) {
    if (!this.revealOpen) return;
    const g = this.game;
    const isLastRound = g?.phase.kind === 'between' && g.phase.round + 1 >= g.rounds.length;
    sound.stopReactions();
    sound.unwind(layerAt(this.scene?.displayDepth ?? 0).id);
    this.hideReveal(!isLastRound);
    if (this.onUnwind) this.onUnwind(now);
    else g?.advance(now);
  }

  private hideReveal(unstickZLayers = true) {
    if (!this.revealOpen) return;
    this.revealOpen = false;
    clearTimeout(this.revealTimer);
    this.root.classList.remove('unwinding');
    this.scene?.setVignette(false);
    this.scene?.setHold(false, unstickZLayers);
    const el = this.els.reveal!;
    el.classList.add('out');
    this.revealTimer = window.setTimeout(() => {
      el.hidden = true;
      el.classList.remove('out');
    }, REVEAL_FADE_MS);
  }

  // ---------------------------------------------------------------------------------------------
  // Layer entrances (old look 'card'): the layer's name and what it is, in one plain line, at the top of the screen (clear of the
  // reveal in the middle). Fades in, holds, fades.

  private entranceUp = false;
  private entranceTimer = 0;
  private entranceBooted = false;

  private enterLayer(layer: Layer) {
    // Layer names are painted into the world (v4 art); the card is the old look, kept switchable. v1 keeps its plain
    // boundary labels for comparison.
    if (look('layerName') !== 'card' || look('artStyle') === 'v1') return;
    this.showEntrance(layer);
  }

  private showEntrance(layer: Layer) {
    const el = this.els.entrance!;
    setText(this.els.enName!, layer.name);
    setText(this.els.enDesc!, LAYER_BLURBS[layer.id]);
    el.dataset.layer = layer.id;
    el.classList.remove('out');
    el.hidden = false;
    replay(el, 'in');
    this.entranceUp = true;
    clearTimeout(this.entranceTimer);
    this.entranceTimer = window.setTimeout(() => this.hideEntrance(), ENTRANCE_MS);
  }

  private hideEntrance() {
    if (!this.entranceUp) return;
    this.entranceUp = false;
    clearTimeout(this.entranceTimer);
    const el = this.els.entrance!;
    el.classList.add('out');
    this.entranceTimer = window.setTimeout(() => {
      el.hidden = true;
      el.classList.remove('out');
    }, 400);
  }

  private onSubmit(res: SubmitResult, scene: Scene, g: Game) {
    const fb = this.els.feedback!;
    this.input.classList.remove('corrected');
    switch (res.kind) {
      case 'ignored':
        return;
      case 'rejected': {
        this.input.value = '';
        fb.className = 'feedback fault';
        const cur = g.current();
        const url = missedAnswerUrl({ prompt: cur?.question.prompt, guesses: cur?.rejected, puzzle: g.puzzle });
        // Clear first, so a repeat of the same line is announced again by screen readers.
        fb.replaceChildren();
        requestAnimationFrame(() => {
          const link = document.createElement('a');
          link.className = 'issue-link';
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = 'Missing an answer?';
          fb.replaceChildren('Not accepted · ', link);
        });
        replay(this.els.console!, 'reject');
        scene.rejectNudge();
        sound.reject(layerAt(scene.displayDepth).id);
        return;
      }
      case 'duplicate':
        this.input.value = '';
        fb.className = 'feedback';
        fb.textContent = `${res.entry.name} is already on the stack`;
        replay(fb, 'settle-in');
        return;
      case 'suggestion':
        // Ask first: the typo is corrected in place and marked; Enter submits the correction, editing makes a new guess.
        this.input.value = res.entry.name;
        this.input.classList.add('corrected');
        this.input.focus();
        this.input.setSelectionRange(res.entry.name.length, res.entry.name.length);
        fb.className = 'feedback hint';
        fb.textContent = `Corrected to '${res.entry.name}'. Press Enter to submit.`;
        sound.suggest(layerAt(scene.displayDepth).id);
        replay(fb, 'settle-in');
        return;
      case 'accepted': {
        this.input.value = '';
        const t = TIERS[res.entry.tier];
        fb.className = 'feedback ok';
        fb.textContent = res.corrected ? `read as '${res.entry.name}'` : '';
        // The reveal opens from update() once the dive has landed (the round then waits on its button).
        if (res.pushed > 0) scene.diveTo(g.depth, t.id, res.pushed);
        else scene.react(t.id);
        return;
      }
      default: {
        const unknown: never = res;
        throw new Error(`Hud: unhandled submit result ${JSON.stringify(unknown)}`);
      }
    }
  }

  /** End of day: the result card, straight away (no replay): the day's backtrace, most recent frame first. */
  endOfDay(rows: RecordRow[], depth: number, puzzle: number) {
    const scene = this.scene;
    if (!scene) throw new Error('Hud.endOfDay before bind()');
    this.ended = true;
    sound.endOfDay();
    this.buildCard(rows, depth, puzzle);
    this.showCard();
  }

  /**
   * The card: a summary line and a backtrace of the day, one row per round, #0 being the last answer. A row shows
   * its frame numbers and the tier's cursor icon; hovering, focusing or tapping it opens it in place (no layout
   * shift) to the tier, the answer and a larger icon. Every row's accessible name says all of it. Each row keeps
   * a trailing slot with a dropdown arrow: the prompt's answer sheet from the loaded set (see answer-sheet.ts).
   */
  private buildCard(rows: RecordRow[], depth: number, puzzle: number) {
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
    const mode = this.game?.mode ?? 'daily';
    const layerName = layerAt(depth, mode).name;
    const glyphs = rows.map((r) => (r.tier ? TIERS[r.tier].glyph : '⬛')).join('');
    const headline = mode === 'endless' ? `KERNEL PANIC · ${framesLabel(depth)} · ${layerName}` : `${framesLabel(depth)} · ${layerName}`;
    setText(this.els.puzzleNo!, mode === 'endless' ? 'ENDLESS' : `#${puzzle}`);
    setText(this.els.headline!, headline);
    this.shareText = buildShareText({
      mode,
      puzzle,
      headline,
      glyphs: mode === 'endless' ? glyphs.slice(0, 42) : glyphs,
      url: siteUrl(location),
    });
    this.buildStats();
    // Prefilled GitHub Issue links for missed answers and question ideas.
    const rejected = this.game ? this.game.rounds.flatMap((r) => r.rejected) : [];
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
    const set = this.game?.set;
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
        panel.replaceChildren(...this.sheetNodes(answerSheet(set.entries(qid), puzzle, qid, r.name), r.name));
      }
      toggle.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
      li.classList.toggle('sheet-open', open);
    });
    return { toggle, panel };
  }

  private sheetNodes(groups: SheetGroup[], own: string | undefined): HTMLElement[] {
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
      const fill = (entries: readonly CategoryEntry[]) => list.replaceChildren(...entries.map((e) => this.sheetItem(e, e.name === own)));
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

  private sheetItem(e: CategoryEntry, own: boolean): HTMLElement {
    const li = document.createElement('li');
    li.textContent = e.name;
    if (own) {
      li.className = 'own';
      const you = document.createElement('span');
      you.className = 'sheet-you';
      you.textContent = ' ◂ you';
      li.append(you);
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
      this.notify(warn.textContent, 'error');
    }
    box.hidden = false;
  }

  private showCard() {
    this.els.result!.hidden = false;
    replay(this.els.result!, 'settle-in');
    this.els.copy!.focus({ preventScroll: true });
  }

  // ---------------------------------------------------------------------------------------------
  // Debug demos (driven by the debug rail; these only show content, they never touch game state).

  private demoPrompt = '';

  /** Show a prompt in the console without a running round, even in scroll mode. */
  demoBegin(prompt: string) {
    this.demo = true;
    this.syncTitle();
    this.demoPrompt = prompt;
    this.root.classList.add('demo');
    this.ended = false;
    this.els.result!.hidden = true;
    this.els.feedback!.textContent = '';
    this.input.disabled = true;
    this.promptKey = '';
    this.showPrompt(prompt, Infinity);
  }

  /**
   * The demo's half of a landing: the reveal (the rail plays it when its dive lands). The demo presses
   * "Unwind further" itself after `autoMs`, so demos keep flowing; `then` runs on that press.
   */
  demoReveal(tier: TierId, name: string, frames: number, autoMs = REVEAL_MS, then?: () => void) {
    this.onUnwind = () => {
      this.onUnwind = undefined;
      then?.();
    };
    this.reveal(tier, name, frames);
    this.revealTimer = window.setTimeout(() => this.unwind(this.clock()), autoMs);
  }

  private endDemo() {
    this.demo = false;
    this.root.classList.remove('demo');
  }
}

function rowsOf(g: Game): RecordRow[] {
  return g.rounds.map((r) => (r.locked ? { question: r.question.id, tier: r.locked.entry.tier, name: r.locked.entry.name } : { question: r.question.id, timedOut: r.timedOut }));
}
