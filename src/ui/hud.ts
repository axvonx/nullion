import { jiggleClock, jiggleReach, jiggleSlow } from '../render/reaction-fx';
import { VERSION_LABEL } from '../version';
import { ALL_LAYER_IDS, PROMPTS_PER_DAY, TRUE_ENDLESS_LAYERS, type LayerId } from '../core/layers';
import { layerAt, rulesFor } from '../core/modes';
import { TIER_IDS, TIERS, type TierId } from '../core/tiers';
import { ANSWER_MS } from '../core/modes';
import { READ_MS, type Game, type Round, type SubmitResult } from '../game/game';
import type { Stats, StatsOutcome } from '../game/stats';
import { look, reducedMotion } from '../looks';
import type { Scene } from '../render/scene';
import { FORMS, type FormId } from './forms';
import { LAYER_ART } from '../layers';
import { tierIcon } from './tier-icons';
import { text } from '../text';
import { $, elementsOf, framesLabel, refLink, replay, setSqText, setText, sqSep } from './dom';
import { END_CARD_HTML, EndCard, rowsOf, type RecordRow , type EndlessHook } from './end-card';
import { REVEAL_HTML, REVEAL_MS, Reveal } from './reveal';
import { TableCheck, type TableCheckOpts } from './table-check';
import { mountPrefsMenu } from './prefs-menu';
import { createModal, type ModalHandle } from './modal';
import { mountTactileChrome } from './tactile';
import { TitleLogo } from './title-logo';
import { LayerStack, makeLayerIcon } from './layer-stack';
import { hudBookSvg } from './manual-icon';
import { FieldManualBinder } from './binder/binder';
import { manualStore } from '../game/manual';
import { sound } from '../audio/sound';
import { bankAcceptsFor } from '../data/bank';
import { missedAnswerUrl } from './issues';
import { mountVisualViewport } from './viewport';
import { enforce } from '../core/enforce';
import { wordmarkCanvas } from './wordmark';
import { browserFetchJson, checkOutside } from '../game/outside-check';
import { mountUiScale, toCss } from './ui-scale';
import { recordMiss } from '../game/misses';
import { browserStorage } from '../game/daily-save';

/** Below this share of the answer time left, the watchdog goes into its low-time state. */
export const LOW_TIME = 0.25;
/** The reading phase types the call in at this many ms per character. */
const TYPE_MS = 28;
function answerPlaceholder(): string {
  return typeof window !== 'undefined' && window.innerWidth <= 520 ? 'type an answer…' : 'type an answer, press Enter';
}

/** What each layer is (`LAYER_ART[id].blurb`), for the stack's tooltips. */
const LAYER_BLURBS = Object.fromEntries(ALL_LAYER_IDS.map((id) => [id, LAYER_ART[id].blurb])) as Record<LayerId, string>;

/** How long an info notice stays before it fades (errors stay until closed). */
const NOTICE_INFO_MS = 6000;
const NOTICE_FADE_MS = 400;

/** Rounds Endless's history bar shows at once. */
const HISTORY_DESKTOP = 14;
const HISTORY_PHONE = 7;

/** How long the teleport card into Endless stays up (reduced motion: shorter, no flash). */
const TELEPORT_MS = 1800;
const TELEPORT_STILL_MS = 900;

/** 9×8 Specular Pixel Heart SVG for Endless lives (alive vs empty dark socket; docs/ui-style.md §9.4). */
export function pixelHeartSvg(alive: boolean): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 9 8');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '16');
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('heart-svg');
  svg.innerHTML = alive
    ? '<path fill="#000" d="M1 0h3v1h1V0h3v1h1v3H8v1H7v1H6v1H5v1H4V7H3V6H2V5H1V4H0V1h1z"/>' +
      '<path fill="#ff4d6d" d="M1 1h3v1h1V1h3v3H7v1H6v1H5v1H4V6H3V5H2V4H1z"/>' +
      '<path fill="#ffccd5" d="M2 2h1v1H2z"/>' +
      '<path fill="#c9184a" d="M7 3h1v1H7zM6 4h1v1H6zM5 5h1v1H5z"/>'
    : '<path fill="#000" d="M1 0h3v1h1V0h3v1h1v3H8v1H7v1H6v1H5v1H4V7H3V6H2V5H1V4H0V1h1z"/>' +
      '<path fill="#2c2838" d="M1 1h3v1h1V1h3v3H7v1H6v1H5v1H4V6H3V5H2V4H1z"/>' +
      '<path fill="#544e66" d="M1 1h3v1H2v2H1z"/>';
  return svg;
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
  /** The round whose watchdog buzzer submit has been handled (play). */
  private buzzed = -1;
  private lastReadSec = -1;
  private lastLowSec = -1;
  private slotsSig = '';
  /** The game clock (wall-clock ms in production), set by bind(). Used wherever a deadline is read or set. */
  private clock: () => number = () => Date.now();
  private demo = false;
  /** Outside answers (debug prototype, src/game/outside-check.ts): the tier a rejected guess scores if Wikipedia
   *  backs it; null (always, in production) leaves rejected guesses rejected. Set by main.ts on every (re)start. */
  outsideTier: TierId | null = null;
  private readonly mountEl: HTMLElement;
  /** A teleport into Endless is playing: the title stays hidden while the game waits to start. */
  private teleporting = false;
  private teleportTimer = 0;
  private noticeTimer = 0;
  /** Which rounds Endless's history bar shows: the latest, or a page of older ones (picked in its dropdown). */
  private historyPage: number | 'latest' = 'latest';
  /** Endless from the end card (set by main.ts); null where it isn't offered. */
  endless: () => EndlessHook | null = () => null;
  private titleLogo: TitleLogo;
  private layerStack: LayerStack;
  private binder: FieldManualBinder;
  private titleOpen = false;
  private titleTimer = 0;
  private topicKey = '';
  private readonly reveal: Reveal;
  private readonly card: EndCard;
  private readonly tableCheck: TableCheck;
  private readonly howModal: ModalHandle;

  /**
   * Debug hooks. `watchdogOverride` shows this share of time left instead of the game's (the rail's timer demo);
   * `formOverride` pins the console's form instead of following the layer (the rail's form preview).
   */
  watchdogOverride: ((now: number) => number) | undefined;
  formOverride: FormId | undefined;

  constructor(mount: HTMLElement) {
    this.mountEl = mount;
    // The scene is a full-bleed backdrop; every piece of UI floats over it as a panel.
    mount.innerHTML = `
      <canvas class="scene" aria-label="Your cursor descending through the software stack"></canvas>
      <header class="bar" data-el="bar">
        <span class="bar-left" data-el="barLeft"><button type="button" class="hud-book float" data-el="hudBook" aria-label="Field Manual"><span class="hud-book-badge" data-el="hudBookBadge" hidden></span></button></span>
        <span class="bar-mid"><span class="chip slots float" data-el="slots" aria-label="Round scores"></span><span class="chip hearts float" data-el="hearts" hidden></span></span>
        <span class="bar-right" data-el="barRight"><select class="chip endless-select float" data-el="endlessSelect" hidden aria-label="Endless mode" title="Switch Daily / Endless / True Endless (debug)"><option value="off">Endless: Off</option><option value="endless">Endless: On</option><option value="true-endless">True Endless</option></select><span class="chip depth float" data-el="depth"></span><button type="button" class="ui-key ui-key--icon help-btn float" data-el="helpBtn" aria-label="How to play" aria-haspopup="dialog" aria-expanded="false" aria-controls="title-how">?</button></span>
      </header>
      <div class="notice" data-el="notice" role="alert" hidden><span data-el="noticeText"></span><button type="button" class="ui-key ui-key--icon notice-close" data-el="noticeClose" aria-label="Dismiss">×</button></div>
      <nav class="chip te-nav float" data-el="teNav" hidden aria-label="True Endless realms"></nav>
      <section class="title-screen" data-el="titleScreen" aria-label="Nullion" hidden>
        <div class="title-head" data-el="titleHead"></div>
        <div class="title-foot">
          <p class="title-tag" data-el="titleTag"></p>
          <button type="button" class="ui-key ui-key--primary title-start" data-el="titleStart"><span data-el="titleStartText"></span><span class="title-arrow" aria-hidden="true">▾</span></button>
          <button type="button" class="ui-key ui-key--secondary title-how-btn" data-el="titleHowBtn" aria-haspopup="dialog" aria-expanded="false" aria-controls="title-how">How to play</button>
          <div class="build-tag title-build" aria-label="Version">${VERSION_LABEL}</div>
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
          <button type="button" class="ui-key ui-key--primary rv-show" data-el="rvShow" hidden aria-label="Show the reveal again">show ▴</button>
          <button type="button" class="ui-key ui-key--primary rv-next" data-el="rvNext">Unwind further ▾</button>
        </form>
        <div class="bios-footer" aria-hidden="true"><b>F10</b> Save<span class="sq-sep" aria-hidden="true"></span><b>Enter</b> Select<span class="sq-sep" aria-hidden="true"></span><b>ESC</b> Exit</div>
        <output class="feedback" data-el="feedback" aria-live="polite"></output>
${END_CARD_HTML}
        <div class="scroll-hint" data-el="scrollHint" hidden>scroll<span class="sq-sep" aria-hidden="true"></span>drag<span class="sq-sep" aria-hidden="true"></span>↑ ↓<span class="sq-sep" aria-hidden="true"></span>PgUp PgDn</div>
      </section>
${REVEAL_HTML}`;
    this.root = mount;
    this.canvas = $(mount, 'canvas');
    this.input = $(mount, '#guess');
    // Unified Windowed Modal for How to Play (accessible from both Title and header `?` key anytime).
    this.howModal = createModal(mount, {
      id: 'title-how',
      title: 'How to play',
      backdropDataEl: 'titleHow',
      dialogClass: 'title-how-modal',
      onOpen: () => {
        this.els.titleHowBtn?.setAttribute('aria-expanded', 'true');
        this.els.helpBtn?.setAttribute('aria-expanded', 'true');
      },
      onClose: () => {
        this.els.titleHowBtn?.setAttribute('aria-expanded', 'false');
        this.els.helpBtn?.setAttribute('aria-expanded', 'false');
      },
    });
    this.howModal.body.innerHTML = `
      <ul class="title-rules" data-el="titleRules"></ul>
      <div class="title-how-title title-how-sub" data-el="titleTiersHeading"></div>
      <p class="title-how-note" data-el="titleTiersNote"></p>
      <ol class="title-tiers" data-el="titleTiers"></ol>`;
    this.els = elementsOf(mount);
    this.titleLogo = new TitleLogo();
    this.els.titleHead!.append(this.titleLogo.canvas);
    this.layerStack = new LayerStack((id) => sound.stackCrunch(id), LAYER_BLURBS);
    mount.append(this.layerStack.el);
    this.reveal = new Reveal(mount, {
      scene: () => this.scene,
      game: () => this.game,
      layerStack: this.layerStack,
      isDemo: () => this.demo,
      isScrollMode: () => this.scrollMode,
      clock: () => this.clock(),
    });
    this.card = new EndCard($(mount, '[data-el="result"]'), {
      game: () => this.game,
      clock: () => this.clock(),
      notify: (message, kind) => this.notify(message, kind),
      openManual: () => this.openManual(),
      endless: () => this.endless(),
    });
    this.tableCheck = new TableCheck(mount, () => this.scene);
    this.binder = new FieldManualBinder(document.body); // above the HUD's stacking context (and the debug rail)
    this.els.hudBook!.prepend(hudBookSvg(32));
    this.els.hudBook!.addEventListener('click', () => this.openManual());
    const syncManualBadges = () => {
      const unread = manualStore.unreadCount();
      this.els.hudBookBadge!.textContent = String(unread);
      this.els.hudBookBadge!.hidden = unread === 0;
      this.els.hudBook!.classList.toggle('has-unread', unread > 0);
      this.els.hudBook!.setAttribute('aria-label', unread > 0 ? `Field Manual (${unread} new)` : 'Field Manual');
    };
    syncManualBadges();
    manualStore.subscribe(syncManualBadges);
    this.els.titleTag!.textContent = text('title.tag');
    this.els.titleStartText!.textContent = text('title.start');
    setSqText(this.els.titleTiersHeading!, text('title.tiers.heading'));
    this.els.titleTiersNote!.textContent = text('title.tiers.note');
    this.buildTitleRules();
    this.buildTitleTiers();
    mountPrefsMenu(mount, this.els.barRight!);
    mountTactileChrome(); // on document.body: the binder mounts there, outside #app
    // Lives as long as the page (one Hud per page), so its cleanup is never needed.
    // The zoom first: the viewport tracker converts its pixels with it (and its resize listener runs after).
    mountUiScale();
    mountVisualViewport();
  }

  /** The rules, with every number read from the game's own constants. */
  private buildTitleRules() {
    const frames = TIER_IDS.map((id) => TIERS[id].frames);
    const lines = [
      text('title.rule.prompts', { prompts: PROMPTS_PER_DAY, seconds: ANSWER_MS / 1000 }),
      text('title.rule.answer'),
      text('title.rule.frames', { min: Math.min(...frames), max: Math.max(...frames) }),
      text('title.rule.depth'),
      text('title.rule.bugs'),
      text('title.rule.same'),
      text('title.rule.midnight'),
    ];
    this.els.titleRules!.replaceChildren(
      ...lines.map((t) => {
        const li = document.createElement('li');
        setSqText(li, t);
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
      const name = refLink(t.name, t.wiki, t.name);
      name.classList.add('tt-name', `tier-${t.id}`);
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
    this.els.form!.addEventListener('submit', (ev) => {
      ev.preventDefault();
      // Enter while the reveal is up means "Unwind further", once; never a submit behind the reveal.
      if (this.reveal.isOpen) {
        this.reveal.unwind(now());
        return;
      }
      const g = this.game;
      if (!g || this.demo) return;
      const guess = this.input.value;
      if (!guess.trim()) return;
      const res = g.submit(guess, now());
      this.onSubmit(res, scene, g);
    });
    // Editing a correction makes it just a new guess: drop the correction's mark and hint.
    this.input.addEventListener('input', () => {
      if (!this.input.classList.contains('corrected')) return;
      this.input.classList.remove('corrected');
      this.els.feedback!.textContent = '';
    });

    this.els.noticeClose!.addEventListener('click', () => (this.els.notice!.hidden = true));

    // Title screen: "Unwind the stack" dives into round 1. Hovering or clicking the logo triggers a glitch pulse.
    this.titleLogo.onBurst = (ev) => {
      scene.triggerTitleGlitch(ev);
      sound.playTitleGlitch(ev.kind);
    };
    this.els.titleStart!.addEventListener('click', () => this.startFromTitle(now()));
    this.els.titleStart!.addEventListener('pointerenter', () => this.titleLogo.pulse('bitflip'));
    this.titleLogo.canvas.addEventListener('click', () => this.titleLogo.pulse());
    this.els.titleHowBtn!.addEventListener('click', () => this.howModal.toggle(this.els.titleHowBtn!));
    this.els.helpBtn!.addEventListener('click', () => this.howModal.toggle(this.els.helpBtn!));

    // Smart-Context prop-snap loop (docs/ui-style.md §7.3): fly photos directly to the top-left Book icon.
    scene.snapTarget = () => {
      const book = this.els.hudBook;
      if (!book || this.canvas.width <= 0 || this.canvas.height <= 0) return null;
      const br = book.getBoundingClientRect();
      const cr = this.canvas.getBoundingClientRect();
      if (br.width <= 0 || cr.width <= 0 || cr.height <= 0) return null;
      return {
        x: ((br.left + br.width / 2 - cr.left) / cr.width) * this.canvas.width,
        y: ((br.top + br.height / 2 - cr.top) / cr.height) * this.canvas.height,
      };
    };
    scene.onSnapLanded = (entryId) => this.onPropSnapLanded(entryId);

    // Scroll-only mode: fast, responsive free movement through the entire Daily or Endless stack.
    let scrollTarget = 0;
    const nudge = (d: number) => {
      const rules = rulesFor(this.game?.mode ?? 'daily');
      const cap = rules.maxDepth + rules.scroll.capExtra;
      // Accumulate on scrollTarget so rapid wheel/trackpad flicks aren't swallowed by camera smoothing
      if (Math.abs(scrollTarget - scene.displayDepth) > rules.scroll.snapGap) {
        scrollTarget = scene.displayDepth;
      }
      scrollTarget = Math.min(cap, Math.max(0, scrollTarget + d));
      scene.setTarget(scrollTarget);
    };
    window.addEventListener(
      'wheel',
      (ev) => {
        if (!this.scrollMode || ev.target instanceof HTMLInputElement || ev.target instanceof HTMLSelectElement) return;
        // Panels scroll themselves, as does anything marked `data-own-scroll` (the debug menu and rail: production code
        // never names debug classes, which the deploy's leak check enforces).
        if (ev.target instanceof Element && ev.target.closest('.panel, [data-own-scroll], .bd-backdrop, .ui-modal-backdrop')) return;
        ev.preventDefault();
        const mult = ev.shiftKey ? 3 : 1;
        nudge((ev.deltaY / rulesFor(this.game?.mode ?? 'daily').scroll.wheelDivisor) * mult);
      },
      { passive: false },
    );
    // Touch-drag scrolling for scroll-only mode (and True Endless) on phones and tablets.
    let touchY = 0;
    let touchActive = false;
    window.addEventListener(
      'touchstart',
      (ev) => {
        if (!this.scrollMode || ev.touches.length !== 1) {
          touchActive = false;
          return;
        }
        const target = ev.target;
        if (
          target instanceof Element &&
          target.closest('.panel, [data-own-scroll], .bd-backdrop, .ui-modal-backdrop, .layer-stack, .bar, .te-nav, input, select, button, a')
        ) {
          touchActive = false;
          return;
        }
        touchY = ev.touches[0]!.clientY;
        touchActive = true;
      },
      { passive: true },
    );
    window.addEventListener(
      'touchmove',
      (ev) => {
        if (!touchActive || !this.scrollMode || ev.touches.length !== 1) return;
        const y = ev.touches[0]!.clientY;
        const dy = touchY - y;
        touchY = y;
        if (Math.abs(dy) < 0.5) return;
        ev.preventDefault();
        nudge(dy / (rulesFor(this.game?.mode ?? 'daily').scroll.wheelDivisor * 0.6));
      },
      { passive: false },
    );
    const endTouchScroll = () => {
      touchActive = false;
    };
    window.addEventListener('touchend', endTouchScroll, { passive: true });
    window.addEventListener('touchcancel', endTouchScroll, { passive: true });
    window.addEventListener('keydown', (ev) => {
      if (!this.scrollMode || ev.target instanceof HTMLInputElement || ev.target instanceof HTMLSelectElement) return;
      const rules = rulesFor(this.game?.mode ?? 'daily');
      if (ev.key === 'Home') {
        ev.preventDefault();
        scrollTarget = 0;
        scene.setTarget(0);
        return;
      }
      if (ev.key === 'End') {
        ev.preventDefault();
        scrollTarget = rules.maxDepth;
        scene.setTarget(scrollTarget);
        return;
      }
      const step = {
        ArrowDown: rules.scroll.arrowStep,
        ArrowUp: -rules.scroll.arrowStep,
        PageDown: rules.scroll.pageStep,
        PageUp: -rules.scroll.pageStep,
      }[ev.key];
      if (step === undefined) return;
      ev.preventDefault();
      nudge(step);
    });
  }

  /**
   * Smart-Context catch rule when a first-sighting prop photo reaches the top-left Book icon:
   * - Always bounce the book icon (except under reduced motion).
   * - Never interrupt an active prompt clock (`reading` / `answering`).
   * - When idle/exploring (stowed Reveal, End Card, Title, Scroll mode), swing the binder open to the new entry.
   */
  private onPropSnapLanded(entryId: string) {
    const book = this.els.hudBook;
    if (book && !reducedMotion()) {
      book.classList.remove('is-catching');
      void book.offsetWidth;
      book.classList.add('is-catching');
    }
    const phase = this.game?.phase.kind;
    const timerActive = phase === 'reading' || phase === 'answering';
    if (!timerActive) {
      this.openManual(entryId);
    }
  }

  setGame(g: Game, _dateLabel: string, statsSource?: () => StatsOutcome) {
    this.game = g;
    this.historyPage = 'latest';
    // The watchdog submits whatever is typed when it fires (Game.tick).
    g.draft = () => (this.input.disabled ? '' : this.input.value);
    this.els.notice!.hidden = true;
    this.endDemo();
    this.barked = -1;
    this.buzzed = -1;
    this.lastReadSec = -1;
    this.lastLowSec = -1;
    this.slotsSig = '';
    sound.stopReactions();
    this.reveal.reset(g);
    this.scene?.setVignette(false);
    this.scene?.setHold(false, true);
    this.promptKey = '';
    this.card.reset(g, statsSource);
    this.els.feedback!.textContent = '';
    this.howModal.setOpen(false);
    this.layerStack.flushTo(g.depth, g.mode);
    this.syncSlots(g);
    this.syncTrueEndlessNav(g.rules.realmNav);
    this.syncTitle();
  }

  /** Populate the LHS True Endless realm navigator (small icons + on-hover names + click-to-scroll). */
  private syncTrueEndlessNav(show: boolean) {
    const nav = this.els.teNav as HTMLElement | undefined;
    if (!nav) return;
    nav.hidden = !show;
    if (!show) return;
    if (nav.childElementCount === 0) {
      for (const l of TRUE_ENDLESS_LAYERS) {
        const theme = LAYER_ART[l.id].stackTheme;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'te-nav-btn';
        btn.dataset.layer = l.id;
        btn.setAttribute('aria-label', l.name);
        btn.title = l.name;
        btn.style.setProperty('--te-accent', theme.accent);
        const icon = makeLayerIcon(theme);
        const tip = document.createElement('span');
        tip.className = 'te-nav-tip';
        tip.textContent = l.name;
        btn.append(icon, tip);
        btn.onclick = () => this.scene?.setTarget(l.from + 2);
        nav.append(btn);
      }
    }
  }

  /**
   * Wire the debug-build top-right Endless mode dropdown (off / endless / true-endless). Mode strings are compared
   * here only as the dropdown's option identity (the `<select>` values and its CSS class), not as game rules.
   */
  setEndlessMode(show: boolean, mode: 'off' | 'endless' | 'true-endless', onChange: (next: 'off' | 'endless' | 'true-endless') => void) {
    const sel = this.els.endlessSelect as HTMLSelectElement | undefined;
    if (!sel) return;
    sel.hidden = !show;
    sel.value = mode;
    sel.classList.toggle('active', mode !== 'off');
    sel.classList.toggle('true-endless', mode === 'true-endless');
    sel.onchange = () => onChange(sel.value as 'off' | 'endless' | 'true-endless');
  }

  /** Render the 7 round score slots (Daily), or the hearts, the answer history and the round counter (Endless). */
  private syncSlots(g: Game) {
    const active = g.phase.kind === 'reading' || g.phase.kind === 'answering' || g.phase.kind === 'between' ? g.phase.round : -1;
    // Hold the current round's slot at '-' while its dive is still sinking so we never spoil the tier/score early.
    const pendingSink =
      g.phase.kind === 'between' && (Boolean(this.scene?.diving) || this.reveal.shownRound < g.phase.round) ? g.phase.round : -1;
    const state = (i: number): string => {
      const r = g.rounds[i]!;
      if (i === pendingSink) return '-';
      if (r.locked) return `${r.locked.entry.tier}:${r.locked.pushed}`;
      return r.timedOut || g.phase.kind === 'done' || (active > i && !r.locked) ? '0' : '-';
    };
    this.els.hearts!.hidden = g.rules.roundCounter !== 'hearts';
    if (g.rules.roundCounter === 'hearts') return this.syncEndlessBar(g, active, state);
    const sig = `${active}|${pendingSink}|` + g.rounds.map((_, i) => state(i)).join(',');
    if (sig === this.slotsSig) return;
    this.slotsSig = sig;
    const wrap = this.els.slots!;
    wrap.replaceChildren(...g.rounds.map((r, i) => this.roundSlot(r, i, state(i), active)));
  }

  /**
   * One round's slot. A played round shows the cursor in its tier's pose; hover, focus or tap expands it to the
   * answer, the tier and the frames it pushed. Rounds still to come are a dim dash.
   */
  private roundSlot(r: Round, i: number, state: string, active: number): HTMLElement {
    const s = document.createElement('span');
    s.className = 'slot';
    const expand = (label: string) => {
      s.tabIndex = 0;
      s.setAttribute('aria-label', label);
      const x = document.createElement('span');
      x.className = 'slot-x';
      setSqText(x, label);
      s.append(x);
    };
    if (state !== '-' && r.locked) {
      const t = TIERS[r.locked.entry.tier];
      s.dataset.tier = t.id;
      s.append(tierIcon(t.id));
      expand(`#${i + 1} ${r.locked.entry.name} ▪ ${t.name} ▪ +${r.locked.pushed}`);
    } else if (state === '0') {
      s.classList.add('miss');
      s.append(tierIcon('timeout'));
      expand(`#${i + 1} ${r.timedOut ? 'timed out' : 'skipped'} ▪ +0`);
    } else {
      s.classList.add('pending');
      s.textContent = '-';
      if (i === active) s.classList.add('active');
      s.title = `Round ${i + 1}`;
    }
    return s;
  }

  /**
   * Endless's bar: the hearts, then the answer history (the last 14 rounds, 7 on a phone; once a run is longer, a
   * dropdown on the left picks older ones by number: "1–14", "15–28", …), then the round counter.
   */
  private syncEndlessBar(g: Game, active: number, state: (i: number) => string) {
    const hearts = g.rules.hearts;
    enforce(hearts, `mode ${g.mode} counts hearts but has no heart rules`);
    const per = window.matchMedia('(max-width: 480px)').matches ? HISTORY_PHONE : HISTORY_DESKTOP;
    const n = g.rounds.length;
    const pages = Math.ceil(n / per);
    if (this.historyPage !== 'latest' && this.historyPage >= pages) this.historyPage = 'latest';
    const from = this.historyPage === 'latest' ? Math.max(0, n - per) : this.historyPage * per;
    const to = Math.min(n, from + per);
    const left = g.hearts;
    const shown: number[] = [];
    for (let i = from; i < to; i++) shown.push(i);
    const sig = `endless|${left}|${n}|${per}|${this.historyPage}|${active}|` + shown.map(state).join(',');
    if (sig === this.slotsSig) return;
    this.slotsSig = sig;
    const wrap = this.els.slots!;
    wrap.replaceChildren();
    wrap.setAttribute('aria-label', `Rounds ${from + 1} to ${to} of ${n}`);
    // The hearts sit in their own chip under the history (9×8 Specular Pixel Hearts).
    const heartsEl = this.els.hearts!;
    heartsEl.replaceChildren();
    heartsEl.setAttribute('aria-label', `${left} of ${hearts.max} hearts`);
    for (let i = 0; i < hearts.max; i++) {
      const alive = i < left;
      const f = document.createElement('span');
      f.className = alive ? 'slot heart' : 'slot heart lost';
      f.dataset.alive = String(alive);
      f.append(pixelHeartSvg(alive));
      f.title = alive ? 'Heart: a timeout or skip costs one' : 'Heart lost: a Bit Flip or more frames win it back';
      heartsEl.append(f);
    }
    if (n > per) {
      const pager = document.createElement('span');
      pager.className = 'history-pager';
      pager.setAttribute('role', 'group');
      pager.setAttribute('aria-label', 'Round history pages');

      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'ui-key ui-key--quiet history-prev';
      prevBtn.textContent = '◀';
      prevBtn.setAttribute('aria-label', 'Earlier rounds');
      prevBtn.disabled = this.historyPage === 0;
      prevBtn.addEventListener('click', () => {
        if (this.historyPage === 'latest') {
          this.historyPage = Math.max(0, Math.floor((from - 1) / per));
        } else {
          this.historyPage = Math.max(0, this.historyPage - 1);
        }
        this.syncSlots(g);
      });

      const range = document.createElement('span');
      range.className = 'history-range';
      range.textContent = `${from + 1}–${to}`;

      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'ui-key ui-key--quiet history-next';
      nextBtn.textContent = '▶';
      nextBtn.setAttribute('aria-label', 'Later rounds');
      nextBtn.disabled = this.historyPage === 'latest';
      nextBtn.addEventListener('click', () => {
        if (this.historyPage === 'latest') return;
        const nextPage = this.historyPage + 1;
        this.historyPage = nextPage >= pages - 1 ? 'latest' : nextPage;
        this.syncSlots(g);
      });

      pager.append(prevBtn, range, nextBtn);
      wrap.append(pager);
    }
    for (const i of shown) wrap.append(this.roundSlot(g.rounds[i]!, i, state(i), active));
    const rc = document.createElement('span');
    rc.className = 'slot endless-round';
    rc.textContent = `#${n}`;
    rc.title = `Endless round ${n}`;
    wrap.append(rc);
  }

  setScrollMode(on: boolean) {
    this.scrollMode = on;
    this.root.classList.toggle('scroll-mode', on);
    this.els.scrollHint!.hidden = !on;
    this.syncTitle();
  }

  /**
   * Into Endless from the end card: no title screen. A white flash wipes the old world, the camera is already at the
   * top of the new stack, and a card shows `nullion` with `ENDLESS` under it in the title face; when it goes, a new
   * run starts its first reading countdown (a resumed run keeps its own clock and just gets the card). Reduced
   * motion: no flash, a shorter card.
   */
  teleportIn() {
    const g = this.game;
    enforce(g, 'Hud.teleportIn before setGame()');
    clearTimeout(this.teleportTimer);
    this.mountEl.querySelector('.teleport')?.remove();
    // The end card's white-out hands over to the teleport's flash, which starts white.
    for (const w of document.querySelectorAll('.endless-whiteout')) w.remove();
    const still = reducedMotion();
    const card = document.createElement('div');
    card.className = still ? 'teleport still-tp' : 'teleport';
    card.setAttribute('role', 'status');
    card.setAttribute('aria-label', 'nullion endless');
    const word = wordmarkCanvas('nullion', 6);
    word.classList.add('tp-word');
    const sub = wordmarkCanvas('ENDLESS', 3);
    sub.classList.add('tp-sub');
    card.append(word, sub);
    this.mountEl.append(card);
    const fresh = g.phase.kind === 'ready';
    this.teleporting = fresh;
    this.syncTitle();
    sound.unlock();
    sound.diveStart();
    this.teleportTimer = window.setTimeout(() => {
      card.remove();
      this.teleporting = false;
      if (fresh && this.game === g && g.phase.kind === 'ready') {
        g.start(this.clock());
        this.onPhaseChange();
      }
    }, still ? TELEPORT_STILL_MS : TELEPORT_MS);
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
  }

  private syncTitle() {
    const want = this.game?.phase.kind === 'ready' && !this.scrollMode && !this.demo && !this.teleporting;
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
    this.howModal.setOpen(false);
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
    const vh = toCss(window.innerHeight || 800);
    const short = vh <= 480;
    const gap = Math.max(short ? 8 : 14, Math.min(28, Math.round(vh * 0.03)));
    const rawLogoBottom = Math.max(vh * 0.56, vh - (mark.top - gap));
    const logoBottom = short ? Math.min(vh - 64, rawLogoBottom) : rawLogoBottom;
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
    this.updateMotion(now, depthShown);
    this.mirrorReaction(now);
    this.reveal.update(now);
    this.layerStack.setRightReserve(this.scene?.uiReserveRightCss ?? 0);
    const barBottom = Math.ceil(toCss(this.els.bar!.getBoundingClientRect().bottom));
    this.layerStack.setTopOffset(barBottom > 0 ? Math.max(50, barBottom + 6) : 52);
    this.layerStack.setVisible(!this.titleOpen && look('layerStack') === 'on');
    // In active play, hold the RHS stack during dives so newly reached layers appear in the reveal first, then fly over.
    if (this.scrollMode || this.demo || !this.game || this.game.phase.kind === 'ready') {
      this.layerStack.sync(depthShown, activeMode, { animate: !this.scrollMode, reduced: reducedMotion() });
    }
    if (rulesFor(activeMode).realmNav && this.els.teNav && !this.els.teNav.hidden) {
      const curId = layerAt(Math.max(0, depthShown), activeMode).id;
      for (const btn of this.els.teNav.querySelectorAll<HTMLElement>('.te-nav-btn')) {
        btn.classList.toggle('active', btn.dataset.layer === curId);
      }
    }
    const frames = Math.round(depthShown);
    if (frames !== this.shownFrames) {
      this.shownFrames = frames;
      this.els.depth!.textContent = framesLabel(frames);
    }
    const form = this.formOverride ?? LAYER_ART[layerAt(depthShown, activeMode).id].form;
    if (form !== this.form) this.applyForm(form);

    const override = this.watchdogOverride?.(now);
    this.root.classList.toggle('wd-demo', override !== undefined);
    if (override !== undefined) this.setWatchdog(override, ANSWER_MS);

    const g = this.game;
    if (!g || this.demo || this.scrollMode) {
      if (this.topicKey !== '') {
        this.topicKey = '';
        this.scene?.setQuestionTopic?.(undefined, 0);
      }
      return;
    }

    const p = g.phase;
    const r = g.current();
    const wantTopic = r && (p.kind === 'reading' || p.kind === 'answering' || p.kind === 'between') ? `${g.puzzle}|${p.round}|${r.question.id}` : '';
    if (wantTopic !== this.topicKey) {
      this.topicKey = wantTopic;
      this.scene?.setQuestionTopic?.(wantTopic ? r!.question.id : undefined, wantTopic ? g.puzzle * 31 + (p.kind === 'reading' || p.kind === 'answering' || p.kind === 'between' ? p.round : 0) : 0);
    }
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
      const wantPlaceholder = text('console.countdown', { secs });
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
      // The watchdog fired with an answer in the box and it was accepted: it dives like a normal submit.
      if (r!.buzzer && this.buzzed !== p.round) {
        this.buzzed = p.round;
        this.input.value = '';
        this.input.classList.remove('corrected');
        const lk = r!.locked;
        if (!r!.buzzer.accepted) recordMiss(browserStorage(), { q: r!.question.id, prompt: r!.question.prompt, guess: r!.buzzer.guess, at: this.clock() });
        if (r!.buzzer.accepted && lk && this.scene) {
          this.els.feedback!.className = 'feedback ok';
          this.els.feedback!.textContent = lk.corrected ? text('console.corrected', { name: lk.entry.name }) : '';
          this.scene.diveTo(g.depth, lk.entry.tier, lk.pushed);
        }
      }
      if (r!.timedOut && this.barked !== p.round) {
        this.barked = p.round;
        this.bark();
      }
      // The round waits on the reveal's button. Open the reveal once the dive has landed (or at once for a timeout);
      // opening it here rather than from the dive's callback means an interrupted dive can't strand the round.
      if (this.reveal.shownRound !== p.round && !this.scene?.diving) this.reveal.showRound(p.round, r!);
    } else if (p.kind === 'done') {
      this.input.disabled = true;
      left = 0;
      if (!this.card.isShown) this.endOfDay(rowsOf(g), g.depth, g.puzzle);
      this.card.updateNextDay(wall);
      this.showPrompt('', Infinity);
    } else {
      this.showPrompt('', Infinity);
      left = 1;
    }
    this.syncSlots(g);
    if (override === undefined) this.setWatchdog(left, g.answerMs, p.kind === 'answering' && p.until !== null);
  }

  /** A visible message for things the player should know (a save that could not be restored, a resume). */
  /** A notice bar. Info ("Resumed your run") fades out by itself; an error stays until it is closed. */
  notify(message: string, kind: 'info' | 'error' = 'error') {
    clearTimeout(this.noticeTimer);
    const el = this.els.notice!;
    el.classList.toggle('info', kind === 'info');
    el.classList.remove('fading');
    this.els.noticeText!.textContent = message;
    el.hidden = false;
    if (kind === 'info') {
      this.noticeTimer = window.setTimeout(() => {
        el.classList.add('fading');
        this.noticeTimer = window.setTimeout(() => (el.hidden = true), reducedMotion() ? 0 : NOTICE_FADE_MS);
      }, NOTICE_INFO_MS);
    }
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

  /**
   * Bar fill, low-time state and the seconds readout that only appears when time is short. `left` is the share of
   * the round's time left and `durationMs` the round's whole answer time (Endless rounds shrink with depth).
   */
  private setWatchdog(left: number, durationMs: number, timed = true) {
    this.els.watchdog!.style.transform = `scaleX(${left})`;
    const low = timed && left > 0 && left < LOW_TIME;
    this.els.watchdog!.classList.toggle('low', low);
    this.els.console!.classList.toggle('low', low);
    this.scene?.setLowTime(low);
    const lowSecs = low ? Math.ceil((left * durationMs) / 1000) : -1;
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
    this.reveal.showTimeout();
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
    const panels = [this.els.console!, this.els.hudBook!, this.els.depth!];
    panels.forEach((el, i) => {
      if (fx.jiggle <= 0) {
        if (el.style.translate) el.style.translate = '';
        return;
      }
      const slow = jiggleSlow(fx.jiggle);
      const reach = jiggleReach(fx.jiggle);
      const t = jiggleClock(now, fx.jiggle);
      const dx = Math.round(Math.sin(t / (41 * slow) + i * 2.1) * 3 * reach);
      const dy = Math.round(Math.cos(t / (49 * slow) + i * 1.3) * 2 * reach);
      el.style.translate = `${dx}px calc(var(--lag) + ${dy}px)`;
    });
  }

  /**
   * Outside answers (debug): look a rejected guess up on Wikipedia. A pass is accepted like a bank answer, if the
   * round is still open; every verdict is logged to the console and kept in `window.nullionOutside` for counting.
   * A failed lookup shows in the feedback line (never a silent reject).
   */
  private lookOutside(guess: string, tier: TierId, scene: Scene, g: Game) {
    const p = g.phase;
    const cur = g.current();
    if (p.kind !== 'answering' || !cur) return;
    const round = p.round;
    const prompt = cur.question.prompt;
    const fb = this.els.feedback!;
    const pending = document.createElement('span');
    pending.className = 'fb-hint';
    pending.replaceChildren(sqSep(), 'checking Wikipedia…');
    requestAnimationFrame(() => fb.append(pending));
    const log = ((window as unknown as { nullionOutside?: object[] }).nullionOutside ??= []);
    checkOutside(guess, prompt, browserFetchJson).then(
      (v) => {
        pending.remove();
        log.push({ prompt, guess, ...v });
        console.info(`[outside] ${prompt} | ${guess} → ${v.kind === 'accept' ? `ACCEPT "${v.title}" (${v.evidence})` : `reject: ${v.reason}`}`);
        if (v.kind !== 'accept' || g !== this.game) return;
        const res = g.acceptOutside(round, guess, v.title, tier, this.clock());
        if (res.kind === 'accepted') this.onSubmit(res, scene, g);
      },
      (err: unknown) => {
        pending.replaceChildren(sqSep(), `Wikipedia check failed: ${err instanceof Error ? err.message : String(err)}`);
        console.error('[outside]', err);
      },
    );
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
        const hintText =
          cur && cur.rejected.length >= 2
            ? cur.question.accepts ?? bankAcceptsFor(cur.question.id) ?? text('console.hint.generic')
            : undefined;
        requestAnimationFrame(() => {
          const link = document.createElement('a');
          link.className = 'issue-link';
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = text('console.missing-link');
          if (hintText) {
            const hint = document.createElement('span');
            hint.className = 'fb-hint';
            hint.replaceChildren(sqSep(), text('console.hint', { hint: hintText }));
            fb.replaceChildren(text('console.rejected'), sqSep(), link, hint);
          } else {
            fb.replaceChildren(text('console.rejected'), sqSep(), link);
          }
        });
        replay(this.els.console!, 'reject');
        scene.rejectNudge();
        sound.reject(layerAt(scene.displayDepth).id);
        if (cur) recordMiss(browserStorage(), { q: cur.question.id, prompt: cur.question.prompt, guess: res.guess, at: this.clock() });
        if (this.outsideTier) this.lookOutside(res.guess, this.outsideTier, scene, g);
        return;
      }
      case 'duplicate':
        this.input.value = '';
        fb.className = 'feedback';
        fb.textContent = text('console.duplicate', { name: res.entry.name });
        replay(fb, 'settle-in');
        return;
      case 'suggestion':
        // Ask first: the typo is corrected in place and marked; Enter submits the correction, editing makes a new guess.
        this.input.value = res.entry.name;
        this.input.classList.add('corrected');
        this.input.focus();
        this.input.setSelectionRange(res.entry.name.length, res.entry.name.length);
        fb.className = 'feedback hint';
        fb.textContent = text('console.suggestion', { name: res.entry.name });
        sound.suggest(layerAt(scene.displayDepth).id);
        replay(fb, 'settle-in');
        return;
      case 'accepted': {
        this.input.value = '';
        const t = TIERS[res.entry.tier];
        fb.className = 'feedback ok';
        fb.textContent = res.corrected ? text('console.corrected', { name: res.entry.name }) : '';
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
    if (!this.scene) throw new Error('Hud.endOfDay before bind()');
    sound.endOfDay();
    // Clear transient info notices so they never overlap the End Card wordmark.
    if (this.els.notice && !this.els.notice.hidden && this.els.notice.classList.contains('info')) {
      this.els.notice.hidden = true;
    }
    // The right-hand stack folds into the summary card: note where its blocks are before the card hides it.
    const mode = this.game?.mode ?? 'daily';
    this.layerStack.flushTo(depth, mode);
    const from = this.layerStack.blockRects();
    this.card.show(rows, depth, puzzle);
    this.card.flyStackIn(from, reducedMotion());
  }

  // ---------------------------------------------------------------------------------------------
  // Debug demos (driven by the debug rail; these only show content, they never touch game state).

  /** The end card with made-up lifetime stats, for any game (even one that has not started). */
  demoEndOfDay(rows: RecordRow[], depth: number, puzzle: number, stats: Stats) {
    if (!this.game) throw new Error('Hud.demoEndOfDay before setGame()');
    this.card.reset(this.game, () => ({ kind: 'ok', stats }));
    this.endOfDay(rows, depth, puzzle);
  }

  private demoPrompt = '';

  /** Open the Field Manual binder (used by the title/end-of-day buttons and the debug rail). */
  openManual(entryId?: string) {
    this.binder.open(entryId);
  }

  /** Show a prompt in the console without a running round, even in scroll mode. */
  demoBegin(prompt: string) {
    this.demo = true;
    this.syncTitle();
    this.demoPrompt = prompt;
    this.root.classList.add('demo');
    this.card.hide();
    this.els.feedback!.textContent = '';
    this.input.disabled = true;
    this.promptKey = '';
    this.showPrompt(prompt, Infinity);
  }

  /**
   * The demo's half of a landing: the reveal (the rail plays it when its dive lands). The demo presses
   * "Unwind further" itself after `autoMs`, so demos keep flowing; `then` runs on that press.
   */
  demoReveal(tier: TierId, name: string, frames: number, autoMs = REVEAL_MS, then?: () => void, opts?: { note?: string; glitchForce?: boolean }) {
    this.reveal.demo(tier, name, frames, autoMs, then, opts);
  }

  demoTableCheck(opts: TableCheckOpts) {
    this.tableCheck.run(opts);
  }

  private endDemo() {
    this.demo = false;
    this.root.classList.remove('demo');
  }
}
