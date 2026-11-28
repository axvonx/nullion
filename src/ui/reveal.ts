import { enforce } from '../core/enforce';
import type { Layer } from '../core/layers';
import { layerAt, layerIndexAt, layersFor } from '../core/modes';
import { TIERS, type TierId } from '../core/tiers';
import type { Game, Round } from '../game/game';
import { manualStore } from '../game/manual';
import { sound } from '../audio/sound';
import { reducedMotion } from '../looks';
import { text, variants } from '../text';
import type { Scene } from '../render/scene';
import { $, framesLabel, replay, setText } from './dom';
import { LayerStack, createLayerBadge } from './layer-stack';
import { revealLayout } from './reveal-layout';

/** Demos only: how long the rail lets a reveal sit before pressing "Unwind further" for you. Play waits for the player. */
export const REVEAL_MS = 2400;
const REVEAL_FADE_MS = 200;
/** The reveal's hide button appears this long after the reveal is drawn: after its 260 ms pop-in has finished. */
const REVEAL_SETTLE_MS = 700;

/**
 * Plain-language lines for the reveal, used when the answer has no note of its own (the words live in
 * writing/reveal.md). They say how rare the answer was, for players who aren't systems people; no terminal in-jokes.
 */
export const TIER_QUIPS: Record<TierId, readonly string[]> = {
  'off-by-one': variants('reveal.quip.off-by-one'),
  womm: variants('reveal.quip.womm'),
  npe: variants('reveal.quip.npe'),
  leak: variants('reveal.quip.leak'),
  race: variants('reveal.quip.race'),
  heisenbug: variants('reveal.quip.heisenbug'),
  bitflip: variants('reveal.quip.bitflip'),
};

const PIPS_LIT: Record<TierId, number> = {
  'off-by-one': 1,
  womm: 1,
  npe: 2,
  leak: 3,
  race: 5,
  heisenbug: 6,
  bitflip: 7,
};

/**
 * The reveal's markup: the tier name above the cursor and the details below it. The console's two reveal buttons
 * (`rvNext`, `rvShow`) live in the console form, where they take the entry box's place; the controller wires them.
 */
export const REVEAL_HTML = `
      <div class="reveal" data-el="reveal" hidden role="status" aria-live="polite">
        <div class="rv-name" data-el="rvName"></div>
        <div class="rv-body"><div class="rv-pips" data-el="rvPips" aria-hidden="true"></div><div class="rv-answer" data-el="rvAnswer"></div><div class="rv-line" data-el="rvLine"></div><div class="rv-reached" data-el="rvReached" hidden><span class="rv-reached-label">Reached</span><div class="rv-reached-list" data-el="rvReachedList"></div></div><button type="button" class="rv-hide" data-el="rvHide" hidden aria-label="Hide the reveal to look around and collect props">hide ▾</button></div>
      </div>`;

/** What the reveal reads from the HUD around it. */
export interface RevealHost {
  scene(): Scene | undefined;
  game(): Game | undefined;
  /** The RHS layer stack the "Reached" badges fly into. */
  layerStack: LayerStack;
  /** A rail demo or scroll mode: there is no descent to announce, so no "Reached" badges. */
  isDemo(): boolean;
  isScrollMode(): boolean;
  /** The game clock (ms). */
  clock(): number;
}

/**
 * The tier reveal: after a dive lands, the rarity front and centre near the cursor over a soft dim, the console's
 * entry box turned into "Unwind further", and any newly crossed layers stacked under it until they fly into the RHS
 * stack. It owns the reveal's DOM and the console's two reveal buttons, and drives the scene's vignette and hold.
 * The HUD opens it (`showRound`, `showTier`, `showTimeout`), ticks `update(now)` and calls `reset` for a new game.
 */
export class Reveal {
  private readonly el: HTMLElement;
  private readonly name: HTMLElement;
  private readonly answer: HTMLElement;
  private readonly line: HTMLElement;
  private readonly pips: HTMLElement;
  private readonly reached: HTMLElement;
  private readonly reachedList: HTMLElement;
  private readonly hideBtn: HTMLElement;
  private readonly showBtn: HTMLElement;
  private readonly nextBtn: HTMLElement;

  private open = false;
  private fadeTimer = 0;
  private quipTurn = 0;
  /** The round whose reveal has been shown (play mode). */
  private shown = -1;
  /** The reveal is folded away (play only) so the world under it can be seen and its props collected. */
  private stowed = false;
  /** When the open reveal was first drawn (update's clock), so its hide button waits for it to settle. */
  private shownAt: number | undefined;
  /** What "Unwind further" does besides closing: the rail's demos set it; in play it advances the game. */
  private onUnwind: ((now: number) => void) | undefined;
  /** Highest layer index already committed to the RHS stack in play mode (advances on reveal via "Reached" → fly-to-stack). */
  private committedLayerIdx = 0;
  /** Newly reached layer badges waiting in the reveal to fly into the RHS stack when "Unwind further" is pressed. */
  private pendingReached: { badge: HTMLElement; layer: Layer }[] = [];

  constructor(
    private readonly root: HTMLElement,
    private readonly host: RevealHost,
  ) {
    const q = <T extends HTMLElement>(name: string) => $<T>(root, `[data-el="${name}"]`);
    this.el = q('reveal');
    this.name = q('rvName');
    this.answer = q('rvAnswer');
    this.line = q('rvLine');
    this.pips = q('rvPips');
    this.reached = q('rvReached');
    this.reachedList = q('rvReachedList');
    this.hideBtn = q('rvHide');
    this.showBtn = q('rvShow');
    this.nextBtn = q('rvNext');
    // "Unwind further": close the reveal and move the game on (the next prompt, or the end-of-day card).
    this.nextBtn.addEventListener('click', () => this.unwind(host.clock()));
    this.hideBtn.addEventListener('click', () => this.stow(true));
    this.showBtn.addEventListener('click', () => this.stow(false));
  }

  get isOpen(): boolean {
    return this.open;
  }

  /** The reveal is folded away (play only). */
  get isStowed(): boolean {
    return this.stowed;
  }

  /** The last round whose reveal was opened, -1 for none. */
  get shownRound(): number {
    return this.shown;
  }

  /** Open the reveal of a round that has landed: its tier, or the lower-key time-out one. Marks the round shown. */
  showRound(round: number, r: Round) {
    this.shown = round;
    const lk = r.locked;
    if (lk) this.showTier(lk.entry.tier, lk.entry.name, lk.pushed, lk.entry.note);
    else this.showTimeout();
  }

  /** Full-screen reveal of an accepted answer's tier. Call when the dive lands. */
  showTier(tier: TierId, name: string, frames: number, note?: string) {
    const t = TIERS[tier];
    const quips = TIER_QUIPS[tier];
    const line = note ?? quips[this.quipTurn++ % quips.length]!;
    setText(this.name, t.name);
    this.name.dataset.text = t.name;
    setText(this.answer, `${name} · +${framesLabel(frames)}`);
    setText(this.line, line);
    this.openFor(tier);
  }

  /** The watchdog's lower-key reveal: smaller, no icon pose or rarity, just that the round pushed nothing. */
  showTimeout() {
    setText(this.name, text('reveal.timeout.title'));
    delete this.name.dataset.text;
    setText(this.answer, '');
    const bz = this.host.game()?.current()?.buzzer;
    setText(this.line, bz && !bz.accepted ? text('reveal.timeout.rejected', { guess: bz.guess }) : text('reveal.timeout.line'));
    this.openFor('timeout');
  }

  /**
   * The rail's demo: show a reveal, then press "Unwind further" for the demo after `autoMs`; `then` runs on that press.
   */
  demo(tier: TierId, name: string, frames: number, autoMs: number, then?: () => void) {
    this.onUnwind = () => {
      this.onUnwind = undefined;
      then?.();
    };
    this.showTier(tier, name, frames);
    this.fadeTimer = window.setTimeout(() => this.unwind(this.host.clock()), autoMs);
  }

  /** A new game: close any reveal, forget the shown round and any demo, and start the reached layers at its depth. */
  reset(g: Game) {
    this.shown = -1;
    this.onUnwind = undefined;
    this.hide();
    this.clearReached();
    this.committedLayerIdx = layerIndexAt(g.depth, g.mode);
  }

  /** Once the open reveal has settled (its pop-in is done), offer the hide button. Play only, never demos. */
  update(now: number) {
    if (!this.open || this.host.isDemo() || !this.hideBtn.hidden || this.stowed) return;
    if (this.shownAt === undefined) {
      this.shownAt = now;
      return;
    }
    if (now - this.shownAt >= REVEAL_SETTLE_MS) this.hideBtn.hidden = false;
  }

  /** "Unwind further": launch any reached layer badges to the RHS stack, close the reveal, then move on. */
  unwind(now: number) {
    if (!this.open) return;
    const g = this.host.game();
    const isLastRound = Boolean(g?.endsAfterThisRound);
    // Folded away, the reached badges have no on-screen start to fly from: they join the stack directly.
    this.launchReachedFlight(Boolean(isLastRound) || this.stowed);
    sound.stopReactions();
    sound.unwind(layerAt(this.host.scene()?.displayDepth ?? 0).id);
    this.hide(!isLastRound);
    if (this.onUnwind) this.onUnwind(now);
    else g?.advance(now);
  }

  private openFor(kind: TierId | 'timeout') {
    const el = this.el;
    this.renderPips(kind);
    // The tier's name sits just above the cursor's bracket mark and the details just below it, so the mascot,
    // mid-reaction, is framed between them; sizes step down where they'd meet the header chips or the console.
    // The maths is pure and unit-tested (reveal-layout.ts).
    const scene = this.host.scene();
    if (scene) {
      const lay = revealLayout(
        window.innerWidth,
        window.innerHeight,
        scene.markCss(),
        { name: this.name.textContent ?? '', answer: this.answer.textContent ?? '', line: this.line.textContent ?? '', lowKey: kind === 'timeout' },
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
    el.classList.remove('out', 'stowed', 'back');
    el.hidden = false;
    replay(el, 'in');
    this.stowed = false;
    this.shownAt = undefined;
    this.hideBtn.hidden = true;
    this.showBtn.hidden = true;
    this.root.classList.remove('reveal-stowed');
    scene?.setVignette(true);
    scene?.setHold(true);
    this.open = true;
    clearTimeout(this.fadeTimer);
    // The console's entry box becomes the "Unwind further" button. Enter or Space presses it; it never closes by
    // itself in play.
    this.root.classList.add('unwinding');
    this.nextBtn.focus({ preventScroll: true });
    this.showReachedLayers(kind);
  }

  /** Show any newly crossed layer badge(s) stacked vertically under the reveal; they fly into the RHS stack when "Unwind further" is pressed. */
  private showReachedLayers(kind: TierId | 'timeout') {
    this.clearReached();
    const g = this.host.game();
    if (kind === 'timeout' || !g || this.host.isDemo() || this.host.isScrollMode()) return;
    const mode = g.mode;
    const targetIdx = layerIndexAt(g.depth, mode);
    if (targetIdx <= this.committedLayerIdx) return;

    const stack = layersFor(mode);
    const crossed = stack.slice(this.committedLayerIdx + 1, targetIdx + 1);
    this.committedLayerIdx = targetIdx;
    for (const l of crossed) manualStore.noteReached(l.id); // unseals their Field Manual chapters

    this.reachedList.replaceChildren();
    this.pendingReached = crossed.map((layer) => {
      const badge = createLayerBadge(layer);
      badge.title = layer.name; // phones show only its icon
      this.reachedList.append(badge);
      return { badge, layer };
    });
    this.reached.hidden = false;
  }

  /** Fly any pending "Reached" badges from their reveal positions into the RHS stack in order. `direct`: join the stack without a flight (the last round, or the reveal folded away). */
  private launchReachedFlight(direct: boolean) {
    const items = this.pendingReached;
    this.pendingReached = [];
    const g = this.host.game();
    if (!items.length || !g || this.host.isDemo() || this.host.isScrollMode()) return;
    const mode = g.mode;
    if (direct) {
      this.host.layerStack.flushTo(g.depth, mode);
      return;
    }
    const reduced = reducedMotion();
    const gapMs = reduced ? 0 : 260;
    items.forEach(({ badge, layer }, i) => {
      this.host.layerStack.flyIntoStack(badge, layer, mode, {
        reduced,
        showTip: i === items.length - 1,
        delayMs: i * gapMs,
      });
    });
  }

  private clearReached() {
    this.pendingReached = [];
    this.reached.hidden = true;
    this.reachedList.replaceChildren();
  }

  /** Tiny 7-pip pixel rarity ladder on the reveal (hidden on timeout; distinct orange glitch pip for WOMM). */
  private renderPips(kind: TierId | 'timeout') {
    const wrap = this.pips;
    wrap.replaceChildren();
    if (kind === 'timeout') {
      wrap.hidden = true;
      return;
    }
    const lit = PIPS_LIT[kind];
    wrap.hidden = false;
    wrap.classList.toggle('is-womm', kind === 'womm');
    for (let i = 0; i < 7; i++) {
      const pip = document.createElement('i');
      pip.className = i < lit ? 'rv-pip on' : 'rv-pip';
      wrap.append(pip);
    }
  }

  /**
   * Hide or show the reveal in play. Hidden, it folds into a short "show" bar above "Unwind further" and the
   * vignette lifts, so the world under it can be seen and its props collected (the scene blocks prop clicks while
   * the vignette is up). The reaction keeps holding either way; showing pops the reveal back into place.
   */
  private stow(stow: boolean) {
    enforce(this.open, 'stowReveal: no reveal is open');
    if (stow === this.stowed) return;
    this.stowed = stow;
    this.el.classList.remove('in');
    this.el.classList.toggle('stowed', stow);
    if (!stow) replay(this.el, 'back');
    this.root.classList.toggle('reveal-stowed', stow);
    this.showBtn.hidden = !stow;
    this.host.scene()?.setVignette(!stow);
    // Focus Unwind further in both states so pressing Enter always advances instead of immediately re-hiding.
    this.nextBtn.focus({ preventScroll: true });
  }

  private hide(unstickZLayers = true) {
    if (!this.open) return;
    this.open = false;
    clearTimeout(this.fadeTimer);
    this.clearReached();
    this.root.classList.remove('unwinding', 'reveal-stowed');
    this.stowed = false;
    this.hideBtn.hidden = true;
    this.showBtn.hidden = true;
    const scene = this.host.scene();
    scene?.setVignette(false);
    scene?.setHold(false, unstickZLayers);
    const el = this.el;
    el.classList.add('out');
    this.fadeTimer = window.setTimeout(() => {
      el.hidden = true;
      el.classList.remove('out');
    }, REVEAL_FADE_MS);
  }
}
