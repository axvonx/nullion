import { ALL_LAYER_IDS, PROMPTS_PER_DAY, TRUE_ENDLESS_LAYERS, type LayerId } from '../core/layers';
import { layerAt, rulesFor } from '../core/modes';
import { TIER_IDS, TIERS, type TierId } from '../core/tiers';
import { ANSWER_MS } from '../core/modes';
import { READ_MS, type Game, type SubmitResult } from '../game/game';
import type { StatsOutcome } from '../game/stats';
import { look, reducedMotion } from '../looks';
import type { Scene } from '../render/scene';
import { FORMS, type FormId } from './forms';
import { LAYER_ART } from '../layers';
import { tierIcon } from './tier-icons';
import { $, elementsOf, framesLabel, replay, setText } from './dom';
import { END_CARD_HTML, EndCard, rowsOf, type RecordRow } from './end-card';
import { REVEAL_HTML, REVEAL_MS, Reveal } from './reveal';
import { mountPrefsMenu } from './prefs-menu';
import { TitleLogo } from './title-logo';
import { LayerStack, makeLayerIcon } from './layer-stack';
import { manualBookIcon } from './manual-icon';
import { FieldManualBinder } from './binder/binder';
import { manualStore } from '../game/manual';
import { sound } from '../audio/sound';
import { bankAcceptsFor } from '../data/bank';
import { missedAnswerUrl } from './issues';

/** Below this share of the answer time left, the watchdog goes into its low-time state. */
export const LOW_TIME = 0.25;
/** The reading phase types the call in at this many ms per character. */
const TYPE_MS = 28;
function answerPlaceholder(): string {
  return typeof window !== 'undefined' && window.innerWidth <= 520 ? 'type an answer…' : 'type an answer, press Enter';
}

/** What each layer is (`LAYER_ART[id].blurb`), for the stack's tooltips. */
const LAYER_BLURBS = Object.fromEntries(ALL_LAYER_IDS.map((id) => [id, LAYER_ART[id].blurb])) as Record<LayerId, string>;

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
  private titleLogo: TitleLogo;
  private layerStack: LayerStack;
  private binder: FieldManualBinder;
  private titleOpen = false;
  private titleTimer = 0;
  private topicKey = '';
  private readonly reveal: Reveal;
  private readonly card: EndCard;

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
      <header class="bar" data-el="bar">
        <span class="bar-left" data-el="barLeft"><span class="chip meta float" data-el="meta"><span class="led" aria-hidden="true"></span><span data-el="metaText"></span></span></span>
        <span class="bar-right"><span class="chip slots float" data-el="slots" aria-label="Round scores"></span><span class="chip depth float" data-el="depth"></span><select class="chip endless-select float" data-el="endlessSelect" hidden aria-label="Endless mode" title="Switch Daily / Endless / True Endless (debug)"><option value="off">Endless: Off</option><option value="endless">Endless: On</option><option value="true-endless">True Endless</option></select></span>
      </header>
      <div class="notice" data-el="notice" role="alert" hidden><span data-el="noticeText"></span><button type="button" data-el="noticeClose" aria-label="Dismiss">×</button></div>
      <nav class="chip te-nav float" data-el="teNav" hidden aria-label="True Endless realms"></nav>
      <section class="title-screen" data-el="titleScreen" aria-label="Nullion" hidden>
        <div class="title-head" data-el="titleHead"></div>
        <div class="title-foot">
          <p class="title-tag">Seven prompts a day. Rarer answers descend deeper into the stack.</p>
          <button type="button" class="title-start" data-el="titleStart"><span>Unwind the stack</span><span class="title-arrow" aria-hidden="true">▾</span></button>
          <div class="title-foot-links">
            <button type="button" class="title-how-btn" data-el="titleHowBtn" aria-expanded="false" aria-controls="title-how">How to play</button>
            <button type="button" class="title-how-btn title-manual-btn" data-el="titleManualBtn"><span data-el="titleManualLabel">Field Manual</span></button>
          </div>
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
          <button type="button" class="rv-show" data-el="rvShow" hidden aria-label="Show the reveal again">show ▴</button>
          <button type="button" class="rv-next" data-el="rvNext">Unwind further ▾</button>
        </form>
        <div class="bios-footer" aria-hidden="true"><b>F10</b> Save · <b>Enter</b> Select · <b>ESC</b> Exit</div>
        <output class="feedback" data-el="feedback" aria-live="polite"></output>
${END_CARD_HTML}
        <div class="scroll-hint" data-el="scrollHint" hidden>scroll · ↑ ↓ · PgUp PgDn</div>
      </section>
${REVEAL_HTML}`;
    this.root = mount;
    this.canvas = $(mount, 'canvas');
    this.input = $(mount, '#guess');
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
    });
    this.binder = new FieldManualBinder(document.body); // above the HUD's stacking context (and the debug rail)
    this.els.titleManualBtn!.prepend(manualBookIcon(13));
    this.els.titleManualBtn!.addEventListener('click', () => this.openManual());
    const syncManualBadges = () => {
      const unread = manualStore.unreadCount();
      this.els.titleManualLabel!.textContent = unread > 0 ? `Field Manual · ${unread} new` : 'Field Manual';
      this.els.titleManualBtn!.classList.toggle('has-unread', unread > 0);
    };
    syncManualBadges();
    manualStore.subscribe(syncManualBadges);
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
      'More stack frames = deeper inside the computer, from Apps down to bare silicon.',
      'Tiers are named after bugs — rarer answers are harder-to-reproduce bugs.',
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
        // Panels (and the debug menu) scroll themselves.
        if (ev.target instanceof Element && ev.target.closest('.panel, .dbg-panel')) return;
        ev.preventDefault();
        const mult = ev.shiftKey ? 3 : 1;
        nudge((ev.deltaY / rulesFor(this.game?.mode ?? 'daily').scroll.wheelDivisor) * mult);
      },
      { passive: false },
    );
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

  setGame(g: Game, dateLabel: string, statsSource?: () => StatsOutcome) {
    this.game = g;
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
    this.els.metaText!.textContent = `#${g.puzzle}`;
    this.els.meta!.title = `Puzzle #${g.puzzle} · ${dateLabel}`;
    this.els.titleHow!.hidden = true;
    this.els.titleHowBtn!.setAttribute('aria-expanded', 'false');
    this.els.titleHowBtn!.textContent = 'How to play';
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

  /** Render the 7 round score slots (Daily) or 3 watchdog strike fuses + round counter (Endless). */
  private syncSlots(g: Game) {
    if (g.rules.roundCounter === 'fuses') {
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
      g.phase.kind === 'between' && (Boolean(this.scene?.diving) || this.reveal.shownRound < g.phase.round) ? g.phase.round : -1;
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
    const barBottom = Math.ceil(this.els.bar!.getBoundingClientRect().bottom);
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
    if (override !== undefined) this.setWatchdog(override);

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
      // The watchdog fired with an answer in the box and it was accepted: it dives like a normal submit.
      if (r!.buzzer && this.buzzed !== p.round) {
        this.buzzed = p.round;
        this.input.value = '';
        this.input.classList.remove('corrected');
        const lk = r!.locked;
        if (r!.buzzer.accepted && lk && this.scene) {
          const t = TIERS[lk.entry.tier];
          this.els.feedback!.className = 'feedback ok';
          this.els.feedback!.textContent = lk.corrected ? `read as '${lk.entry.name}'` : '';
          this.scene.diveTo(g.depth, t.id, t.frames);
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
    if (override === undefined) this.setWatchdog(left, p.kind === 'answering' && p.until !== null);
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
            ? cur.question.accepts ?? bankAcceptsFor(cur.question.id) ?? 'Try a broad, common name.'
            : undefined;
        requestAnimationFrame(() => {
          const link = document.createElement('a');
          link.className = 'issue-link';
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = 'Missing an answer?';
          if (hintText) {
            const hint = document.createElement('span');
            hint.className = 'fb-hint';
            hint.textContent = ` · Hint: ${hintText}`;
            fb.replaceChildren('Not accepted · ', link, hint);
          } else {
            fb.replaceChildren('Not accepted · ', link);
          }
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
    if (!this.scene) throw new Error('Hud.endOfDay before bind()');
    sound.endOfDay();
    this.card.show(rows, depth, puzzle);
  }

  // ---------------------------------------------------------------------------------------------
  // Debug demos (driven by the debug rail; these only show content, they never touch game state).

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
  demoReveal(tier: TierId, name: string, frames: number, autoMs = REVEAL_MS, then?: () => void) {
    this.reveal.demo(tier, name, frames, autoMs, then);
  }

  private endDemo() {
    this.demo = false;
    this.root.classList.remove('demo');
  }
}
