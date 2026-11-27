import '@fontsource/courier-prime/700.css';
import '@fontsource/caveat/400.css';
import './binder.css';
import { sound } from '../../audio/sound';
import { enforce } from '../../core/enforce';
import { DAILY_LAYERS, ENDLESS_LAYERS, LAYERS, TRUE_ENDLESS_LAYERS, type LayerId } from '../../core/layers';
import { buildBook, bookChapters, manTag, spreadOf, type Chapter, type Leaf, type Spread } from '../../game/manual-book';
import { MANUAL_RARITIES, manualEntryById, manualStore, type ManualEntry, type ManualSighting } from '../../game/manual';
import { formatRate, shownRate } from '../../game/rarity';
import { storageKey } from '../../keys';
import { reducedMotion } from '../../looks';
import { CritterSystem } from '../../render/critters';
import { LAYER_ART } from '../../layers';
import { drawEntity, setPaint } from '../../render/v4/kit';
import { V4_LIBRARIES } from '../../render/v4/libraries';
import { drawTopicProp, TOPIC_PROPS } from '../../render/v4/topics';
import { GLYPH_H, GLYPH_W, SPACE_W, WATERMARK_GLYPHS, lineWidth } from '../../render/v4/watermark';
import { CELL_H, drawGlyph, layoutWord } from '../wordmark';

/**
 * The Field Manual as an archive ring binder of manual pages (FIELD-MANUAL-PLAN.md). Layout comes from the pure
 * book model (src/game/manual-book.ts); this file only renders it. Wide screens show a spread, phones one leaf.
 */

const DAILY = LAYERS.map((l) => l.id);
const ENDLESS_ONLY = ENDLESS_LAYERS.map((l) => l.id).filter((id) => !DAILY.includes(id));
const TRUE_ENDLESS = TRUE_ENDLESS_LAYERS.map((l) => l.id);
const LAYER_NAME = new Map<LayerId, string>([
  ...ENDLESS_LAYERS.map((l): [LayerId, string] => [l.id, l.name]),
  ...TRUE_ENDLESS_LAYERS.map((l): [LayerId, string] => [l.id, l.name]),
  ...DAILY_LAYERS.map((l): [LayerId, string] => [l.id, l.name]),
]);
/** Compact ≤4-character indicator shown inside each HABITAT chip. */
const LAYER_CODE: Record<LayerId, string> = {
  application: 'APP',
  runtime: 'RT',
  libraries: 'LIB',
  userspace: 'USER',
  kernel: 'KERN',
  drivers: 'DRV',
  firmware: 'FW',
  'ring-1': 'R-1',
  'ring-2': 'R-2',
  'ring-3': 'R-3',
  internet: 'BGP',
  browser: 'DOM',
  bytecode: 'AST',
  jit: 'JIT',
  linker: 'ELF',
  'kernel-entry': 'VFS',
  'kernel-arch': 'IRQ',
  'bus-fabric': 'DMA',
  vmm: 'VMM',
  ept: 'EPT',
  smram: 'TSEG',
  'me-minix-user': 'ME3U',
  'me-minix-kern': 'ME3K',
  uarch: 'UOP',
  rtl: 'RTL',
  cmos: 'CMOS',
  litho: 'EUV',
  bandgap: 'GAP',
  landauer: 'KT',
  'slab-spa': 'SLAB',
  'kthread-kabin': 'KTH',
};

/** Crisp 1x 5×7 bitmap SVG for compact habitat chips (same pixel font as the RHS layer stack). */
function bitmapCode(code: string): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const text = code.toUpperCase();
  const w = Math.max(1, lineWidth(text));
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${GLYPH_H}`);
  svg.setAttribute('width', String(w));
  svg.setAttribute('height', String(GLYPH_H));
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('bd-hab-code');
  let x = 0;
  for (const ch of text) {
    if (ch === ' ') {
      x += SPACE_W;
      continue;
    }
    const rows = WATERMARK_GLYPHS[ch];
    if (rows) {
      for (let r = 0; r < GLYPH_H; r++) {
        const row = rows[r]!;
        for (let k = 0; k < GLYPH_W; k++) {
          if (row[k] !== '1') continue;
          const rect = document.createElementNS(ns, 'rect');
          rect.setAttribute('x', String(x + k));
          rect.setAttribute('y', String(r));
          rect.setAttribute('width', '1');
          rect.setAttribute('height', '1');
          rect.setAttribute('fill', 'currentColor');
          svg.append(rect);
        }
      }
    }
    x += GLYPH_W + 1;
  }
  return svg;
}

/** Deterministic 0..1 hash from a string key so stamp/note placement feels hand-stamped without jumping on re-render. */
function hash01(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}
const PAGE_KEY = storageKey('manual.page');
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** A rubber date stamp: "26 NOV 2026". */
export function stampDate(at: number): string {
  const d = new Date(at);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};

const portraits = new CritterSystem();

/** A sprite to draw on a plate: its native size and a draw call at time t. */
interface Sprite {
  w: number;
  h: number;
  draw(ctx: CanvasRenderingContext2D, t: number): void;
}

function spriteFor(s: ManualSighting): Sprite | undefined {
  if (s.entityId) {
    const lib = V4_LIBRARIES[s.layer];
    const def = lib.near.find((d) => d.id === s.entityId) ?? lib.anchors.find((d) => d.id === s.entityId);
    enforce(def, `binder: ${s.layer}:${s.entityId} is not in V4_LIBRARIES`);
    const [w, h] = def.sizes[0]!;
    return {
      w,
      h,
      draw: (ctx, t) => {
        setPaint(LAYER_ART[s.layer].palette, undefined);
        drawEntity(ctx, def, 0, 1, 0, 0, false, t);
      },
    };
  }
  if (s.critterLayer) {
    const layer = s.critterLayer;
    return { w: 26, h: 22, draw: (ctx, t) => portraits.portrait(ctx, layer, false, 8, 10, t) };
  }
  if (s.topicId) {
    const tp = TOPIC_PROPS.find((p) => p.id === s.topicId);
    enforce(tp, `binder: unknown topic prop ${s.topicId}`);
    return {
      w: 36,
      h: 26,
      draw: (ctx, t) => {
        setPaint(LAYER_ART[s.layer].palette, undefined);
        drawTopicProp(ctx, tp, 36, 26, 0, 0, t, 0);
      },
    };
  }
  return undefined;
}

/** A canvas showing `s` at an integer scale that fits maxW × maxH CSS px; silhouettes are flat ink. */
function plateCanvas(s: ManualSighting, maxW: number, maxH: number, mode: 'sprite' | 'silhouette', live: Set<() => void>): HTMLCanvasElement {
  const sp = spriteFor(s);
  const c = el('canvas', 'bd-px');
  if (!sp) return c;
  c.width = sp.w;
  c.height = sp.h;
  const fit = Math.min(maxW / sp.w, maxH / sp.h);
  // Integer upscale keeps pixels crisp; a sprite bigger than its box (an anchor in a figure thumbnail) shrinks to fit.
  const k = fit >= 1 ? Math.floor(fit) : fit;
  c.style.width = `${Math.floor(sp.w * k)}px`;
  c.style.height = `${Math.floor(sp.h * k)}px`;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  ctx.imageSmoothingEnabled = false;
  const paint = (t: number) => {
    ctx.clearRect(0, 0, sp.w, sp.h);
    sp.draw(ctx, t);
    if (mode === 'silhouette') {
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = '#3a3a42';
      ctx.fillRect(0, 0, sp.w, sp.h);
      ctx.globalCompositeOperation = 'source-over';
    }
  };
  paint(0);
  if (mode === 'sprite' && !reducedMotion()) live.add(() => paint(performance.now() / 1000));
  return c;
}

export class FieldManualBinder {
  readonly el: HTMLElement;
  private sheet: HTMLElement;
  private leaves: [HTMLElement, HTMLElement];
  private tabs: HTMLElement;
  private habPop: HTMLElement;
  private idxPop: HTMLElement;
  private book: Spread[] = [];
  private at = 0;
  private selected = new Map<string, LayerId>();
  /** Stamps that were wet when their spread was first shown this visit: they stay glossy until the page turns. */
  private freshWet = new Map<string, Set<LayerId>>();
  /** Stamps whose thunk already played this visit (`entry|layer`). */
  private thunked = new Set<string>();
  private query = '';
  private live = new Set<() => void>();
  private raf = 0;
  private unsub: () => void;

  constructor(mount: HTMLElement) {
    const wrap = el('div', 'bd-backdrop');
    wrap.hidden = true;
    wrap.innerHTML = `
      <section class="bd" role="dialog" aria-modal="true" aria-label="Field Manual">
        <div class="bd-stickies" data-bd="tabs"></div>
        <div class="bd-sheet" data-bd="sheet">
          <article class="bd-leaf bd-l" data-bd="l"></article>
          <div class="bd-rings" aria-hidden="true"><i></i><i></i><i></i></div>
          <article class="bd-leaf bd-r" data-bd="r"></article>
        </div>
        <button type="button" class="bd-edge bd-prev" data-bd="prev" aria-label="Previous page">◀</button>
        <button type="button" class="bd-edge bd-next" data-bd="next" aria-label="Next page">▶</button>
        <button type="button" class="bd-close" data-bd="close" aria-label="Close Field Manual">×</button>
        <div class="bd-hab-pop" data-bd="habPop" role="tooltip" hidden></div>
        <div class="bd-idx-pop" data-bd="idxPop" role="tooltip" hidden></div>
      </section>`;
    mount.append(wrap);
    this.el = wrap;
    const q = (k: string) => wrap.querySelector<HTMLElement>(`[data-bd="${k}"]`)!;
    this.sheet = q('sheet');
    this.leaves = [q('l'), q('r')];
    this.tabs = q('tabs');
    this.habPop = q('habPop');
    this.idxPop = q('idxPop');
    q('close').addEventListener('click', () => this.close());
    q('prev').addEventListener('click', () => this.step(-1));
    q('next').addEventListener('click', () => this.step(1));
    wrap.addEventListener('click', (ev) => {
      if (ev.target === wrap) this.close();
    });
    // Horizontal swipe on the sheet turns spreads on touch devices without interfering with vertical scrolling.
    let swipeX = 0;
    let swipeY = 0;
    let swipeT = 0;
    let swipeActive = false;
    let suppressClickUntil = 0;
    this.sheet.addEventListener(
      'click',
      (ev) => {
        if (Date.now() < suppressClickUntil) {
          ev.preventDefault();
          ev.stopPropagation();
        }
      },
      true,
    );
    this.sheet.addEventListener(
      'touchstart',
      (ev) => {
        if (ev.touches.length !== 1) {
          swipeActive = false;
          return;
        }
        const target = ev.target;
        // Allow swiping across full-width row buttons (Contents / Permuted Index); only exclude text/select inputs.
        if (target instanceof Element && target.closest('input, select, textarea')) {
          swipeActive = false;
          return;
        }
        const t = ev.touches[0]!;
        swipeX = t.clientX;
        swipeY = t.clientY;
        swipeT = Date.now();
        swipeActive = true;
      },
      { passive: true },
    );
    this.sheet.addEventListener(
      'touchmove',
      (ev) => {
        if (!swipeActive || ev.touches.length !== 1) return;
        const t = ev.touches[0]!;
        const dx = t.clientX - swipeX;
        const dy = t.clientY - swipeY;
        // Once the gesture is clearly vertical, let the sheet scroll without triggering a page turn.
        if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx)) swipeActive = false;
      },
      { passive: true },
    );
    this.sheet.addEventListener(
      'touchend',
      (ev) => {
        if (!swipeActive || ev.changedTouches.length !== 1) return;
        swipeActive = false;
        const t = ev.changedTouches[0]!;
        const dx = t.clientX - swipeX;
        const dy = t.clientY - swipeY;
        if (Date.now() - swipeT > 650) return;
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
        suppressClickUntil = Date.now() + 350;
        this.step(dx < 0 ? 1 : -1);
      },
      { passive: true },
    );
    this.sheet.addEventListener(
      'touchcancel',
      () => {
        swipeActive = false;
      },
      { passive: true },
    );
    window.addEventListener('keydown', (ev) => {
      if (this.el.hidden || ev.target instanceof HTMLInputElement) return;
      if (ev.key === 'Escape') this.close();
      else if (ev.key === 'ArrowLeft') this.step(-1);
      else if (ev.key === 'ArrowRight') this.step(1);
      else if (ev.key === 'Home') this.go(1);
      else return;
      ev.preventDefault();
    });
    this.unsub = manualStore.subscribe(() => {
      if (!this.el.hidden) this.rebuild();
    });
  }

  dispose() {
    this.unsub();
    cancelAnimationFrame(this.raf);
  }

  open(entryId?: string) {
    this.el.hidden = false;
    this.book = buildBook((l) => !manualStore.hasReached(l));
    let at = 0;
    if (entryId) at = Math.max(0, spreadOf(this.book, entryId));
    else {
      try {
        const saved = localStorage.getItem(PAGE_KEY);
        const i = this.book.findIndex((s) => s.folios[0] === saved);
        if (i >= 0) at = i;
      } catch {
        /* no storage: start at the title page */
      }
    }
    this.at = at;
    this.render();
    this.sheet.scrollTop = 0;
    if (!reducedMotion()) this.play('bd-opening', 360);
    this.loop();
  }

  close() {
    this.el.hidden = true;
    this.freshWet.clear();
    this.thunked.clear();
    cancelAnimationFrame(this.raf);
  }

  /** Rebuild the book (sealing can change while open) and keep the same page. */
  private rebuild() {
    const folio = this.book[this.at]?.folios[0];
    this.book = buildBook((l) => !manualStore.hasReached(l));
    const i = this.book.findIndex((s) => s.folios[0] === folio);
    this.at = i >= 0 ? i : Math.min(this.at, this.book.length - 1);
    this.render();
  }

  private loop() {
    cancelAnimationFrame(this.raf);
    const tick = () => {
      if (this.el.hidden) return;
      for (const f of this.live) f();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private play(cls: string, ms: number) {
    const target = cls === 'bd-opening' ? this.el.querySelector<HTMLElement>('.bd')! : this.sheet;
    target.classList.remove(cls);
    void target.offsetWidth;
    target.classList.add(cls);
    window.setTimeout(() => target.classList.remove(cls), ms);
  }

  /** One spread forward or back. Phones show a spread as one scrolling page (the left leaf above the right one). */
  private step(dir: -1 | 1) {
    if (this.at + dir < 0 || this.at + dir >= this.book.length) return;
    this.turn(this.at + dir, dir);
  }

  private turn(to: number, dir: -1 | 1) {
    this.leaveSpread();
    this.at = to;
    this.render();
    // A new page starts at its top (phones scroll a spread); re-renders in place (a figure, the index search) keep it.
    this.sheet.scrollTop = 0;
    if (!reducedMotion()) this.play(dir > 0 ? 'bd-turn-next' : 'bd-turn-prev', 260);
  }

  /** Jump to a spread; a jump of several pages riffles. */
  private go(to: number) {
    if (to < 0 || to === this.at) return;
    const far = Math.abs(to - this.at) > 1;
    const fwd = to > this.at;
    this.leaveSpread();
    this.at = to;
    this.render();
    // A new page starts at its top (phones scroll a spread); re-renders in place (a figure, the index search) keep it.
    this.sheet.scrollTop = 0;
    if (!reducedMotion()) this.play(far ? 'bd-riffle' : fwd ? 'bd-turn-next' : 'bd-turn-prev', far ? 420 : 260);
  }

  /** Leaving an entry's spread dries the stamps that were fresh on it. */
  private leaveSpread() {
    const s = this.book[this.at];
    if (s?.left.kind === 'plate') this.freshWet.delete(s.left.entry.id);
  }

  private render() {
    const s = this.book[this.at]!;
    try {
      localStorage.setItem(PAGE_KEY, s.folios[0]);
    } catch {
      /* no storage: the binder just opens at the title next time */
    }
    // First view of an entry spread: note its wet stamps, then dry them in the save (they stay glossy here).
    if (s.left.kind === 'plate') {
      const e = s.left.entry;
      if (manualStore.isUnread(e.id) && !this.freshWet.has(e.id)) {
        this.freshWet.set(e.id, new Set(e.sightings.map((x) => x.layer).filter((l) => manualStore.isWet(e.id, l))));
        queueMicrotask(() => manualStore.markRead(e.id));
      }
    }
    this.live.clear();
    this.hideHabPop();
    this.leaves[0].replaceChildren(...this.leaf(s.left, s.folios[0], 'l'));
    this.leaves[1].replaceChildren(...this.leaf(s.right, s.folios[1], 'r'));
    this.renderTabs(s);
    this.el.querySelector<HTMLButtonElement>('[data-bd="prev"]')!.disabled = this.at === 0;
    this.el.querySelector<HTMLButtonElement>('[data-bd="next"]')!.disabled = this.at === this.book.length - 1;
  }

  /** Two sticky-note bookmarks on the binder's top edge: back to the title page, and into the permuted index. */
  private renderTabs(s: Spread) {
    const note = (cls: string, label: string, sub: string, to: number, here: boolean) => {
      const b = el('button', `bd-sticky ${cls}${here ? ' here' : ''}`);
      b.type = 'button';
      b.setAttribute('aria-label', `${label} (bookmark)`);
      b.append(el('span', 'bd-sticky-k', 'bookmark'), el('span', 'bd-sticky-l', label), el('span', 'bd-sticky-s', sub));
      b.addEventListener('click', () => this.go(to));
      return b;
    };
    const unread = manualStore.unreadCount();
    this.tabs.replaceChildren(
      note('to-title', '↩ Title', unread ? `${unread} new stamp${unread === 1 ? '' : 's'}` : 'and contents', 0, this.at === 0),
      note('to-index', 'Index →', 'A–Z index', this.book.length - 1, s.left.kind === 'index'),
    );
  }

  // ---------------------------------------------------------------------------------------------------------------
  // Leaves

  /** Running head with the folio on the outer edge and the section tag on the inner (spine) edge; no footer. */
  private frame(tag: string, folio: string, side: 'l' | 'r', body: Node[]): Node[] {
    const head = el('div', 'bd-mhead');
    const folioEl = el('span', 'bd-mh-folio', folio);
    const midEl = el('span', 'bd-mh-mid', 'Field Manual');
    const tagEl = el('span', 'bd-mh-tag', tag);
    if (side === 'l') head.append(folioEl, midEl, tagEl);
    else head.append(tagEl, midEl, folioEl);
    const holes = el('div', 'bd-holes');
    holes.innerHTML = '<i></i><i></i><i></i>';
    const main = el('div', 'bd-body');
    main.append(...body);
    return [holes, head, main];
  }

  private sec(title: string, ...body: (Node | string)[]): Node[] {
    const b = el('div', 'bd-mb');
    b.append(...body);
    return [el('div', 'bd-ms', title), b];
  }

  private leaf(l: Leaf, folio: string, side: 'l' | 'r'): Node[] {
    switch (l.kind) {
      case 'title':
        return this.titleLeaf(folio, side);
      case 'intro':
        return this.frame('INTRO(7)', folio, side, [
          ...this.sec('NAME', 'intro — how to read this manual'),
          ...this.sec('DESCRIPTION', 'Each chapter is one layer of the stack. A chapter stays sealed until your cursor has reached its layer.'),
          ...this.sec('', 'Log what you see by clicking it while you dive. Each page is stamped with the day you first saw it.'),
          ...this.sec('RARITY', 'Common things are there every day. Uncommon: about one day in two. Rare: one in five. Mythic: one in fourteen. Everyone’s stack holds the same things on a given day.'),
          ...this.sec('SEE ALSO', 'The index, at the back.'),
        ]);
      case 'contents':
        return this.contentsLeaf(folio, side);
      case 'notes':
        return this.frame('NOTES', folio, side, [el('p', 'bd-pencil bd-pencil-block', 'the deeper it goes, the stranger the wildlife.')]);
      case 'divider':
        return this.dividerLeaf(l.chapter, folio);
      case 'chapter-list':
        return this.chapterListLeaf(l.chapter, folio, side);
      case 'sealed':
        return this.frame(`CHAPTER ${l.chapter.no}`, folio, side, [
          el('p', 'bd-blank', 'The pages of this chapter are sealed.'),
          el('p', 'bd-blank-sub', `Reach ${l.chapter.name} to open them.`),
        ]);
      case 'plate':
        return this.plateLeaf(l.entry, folio, side);
      case 'text':
        return this.textLeaf(l.entry, folio, side);
      case 'index':
        return this.indexLeaf(l.half, folio, side);
    }
  }

  /** Paper-inked "nullion" title wordmark with an occasional, restrained photocopier/glitch homage. */
  private titleWordmark(): HTMLCanvasElement {
    const { glyphs, width } = layoutWord('nullion');
    const padX = 3;
    const padY = 3;
    const w = width + padX * 2;
    const h = CELL_H + padY * 2;
    const c = el('canvas', 'bd-t-wm');
    c.width = w;
    c.height = h;
    c.style.width = `${w * 4}px`;
    c.setAttribute('role', 'img');
    c.setAttribute('aria-label', 'nullion');
    const ctx = c.getContext('2d');
    if (!ctx) return c;
    ctx.imageSmoothingEnabled = false;

    const INK = '#19191d';
    const SHADOW = 'rgba(25, 25, 29, 0.14)';
    const GHOST = 'rgba(62, 90, 154, 0.38)';
    const FAINT = '#8e8c92';

    let nextAt = performance.now() + 2600 + Math.random() * 2400;
    let until = 0;
    let kind = 0;
    let pick = 0;
    let dir = 1;
    let bandY = 0;
    let lastDrawn = -1;

    const paint = (now: number) => {
      const glitching = !reducedMotion() && now >= nextAt && now < until;
      if (!reducedMotion() && now >= nextAt && until < nextAt) {
        until = nextAt + 120 + Math.random() * 70;
        kind = Math.floor(Math.random() * 3);
        pick = Math.floor(Math.random() * glyphs.length);
        dir = Math.random() < 0.5 ? -1 : 1;
        bandY = padY + 2 + Math.floor(Math.random() * (CELL_H - 4));
      } else if (!reducedMotion() && until >= nextAt && now >= until) {
        nextAt = now + 4500 + Math.random() * 3500;
      }
      const stateKey = glitching ? 1 : 0;
      if (stateKey === lastDrawn) return;
      lastDrawn = stateKey;

      ctx.clearRect(0, 0, w, h);
      glyphs.forEach((g, i) => {
        const isHit = glitching && i === pick;
        if (isHit && kind === 0) {
          // Subtle blue-pencil misregistration + 1px shift on a single letter.
          drawGlyph(ctx, g.rows, padX + g.x - dir, padY, GHOST, 'transparent', 'transparent', '');
          drawGlyph(ctx, g.rows, padX + g.x + dir, padY, INK, 'transparent', SHADOW, '');
        } else if (isHit && kind === 1) {
          // Brief toner skip on one letter.
          drawGlyph(ctx, g.rows, padX + g.x, padY + 1, FAINT, 'transparent', 'transparent', '');
        } else {
          drawGlyph(ctx, g.rows, padX + g.x, padY, INK, 'transparent', SHADOW, '');
        }
      });

      if (glitching && kind === 2) {
        // Tiny 2px horizontal plate-shear slice.
        const slice = ctx.getImageData(0, bandY, w, 2);
        ctx.clearRect(0, bandY, w, 2);
        ctx.putImageData(slice, dir, bandY);
      }
    };

    paint(0);
    if (!reducedMotion()) this.live.add(() => paint(performance.now()));
    return c;
  }

  private titleLeaf(folio: string, side: 'l' | 'r'): Node[] {
    const t = el('div', 'bd-titlepage');
    t.append(this.titleWordmark(), el('div', 'bd-t-sub', 'Field Manual'));
    const n = manualStore.foundCount();
    if (n) t.append(el('div', 'bd-pencil bd-pencil-block', `${n} logged so far`));
    return this.frame('', folio, side, [t]);
  }

  private contentsLeaf(folio: string, side: 'l' | 'r'): Node[] {
    const table = el('div', 'bd-ct');
    for (const c of bookChapters()) {
      const open = manualStore.hasReached(c.layer);
      const row = el('button', `bd-ct-row${open ? '' : ' sealed'}`);
      row.type = 'button';
      const name = el('span', 'bd-ct-name', open ? c.name : `${c.name} — sealed`);
      if (open) {
        const boxes = el('span', 'bd-boxes');
        for (const e of c.entries) boxes.append(el('i', manualStore.isFound(e.id) ? 'on' : ''));
        name.append(boxes);
        if (c.entries.some((e) => manualStore.isUnread(e.id))) name.append(el('i', 'bd-wetdot'));
      }
      row.append(el('span', 'bd-ct-n', c.no), name, el('span', 'bd-ct-p', `${c.no}-1`));
      row.addEventListener('click', () => this.go(this.book.findIndex((s) => s.chapter === c.no)));
      table.append(row);
    }
    const idx = el('button', 'bd-ct-row');
    idx.type = 'button';
    idx.append(el('span', 'bd-ct-n', ''), el('span', 'bd-ct-name bd-it', 'Index'), el('span', 'bd-ct-p', 'I-1'));
    idx.addEventListener('click', () => this.go(this.book.length - 1));
    table.append(idx);
    return this.frame('CONTENTS', folio, side, [table, el('div', 'bd-gloss', 'Boxes are the entries filed in each chapter; filled ones are logged.')]);
  }

  private dividerLeaf(c: Chapter, folio: string): Node[] {
    const open = manualStore.hasReached(c.layer);
    const d = el('div', `bd-divider${open ? '' : ' sealed'} tint-${Number(c.no) % 3}`);
    d.append(el('div', 'bd-div-num', c.no), el('div', 'bd-div-name', c.name), el('div', 'bd-div-sub', open ? LAYER_ART[c.layer].blurb : 'Sealed until you reach this layer.'));
    if (!open) d.append(el('div', 'bd-seal', 'SEALED'));
    d.append(el('div', 'bd-div-folio', folio));
    return [d];
  }

  private chapterListLeaf(c: Chapter, folio: string, side: 'l' | 'r'): Node[] {
    const list = el('div', 'bd-ct');
    c.entries.forEach((e, k) => {
      const found = manualStore.isFound(e.id);
      const row = el('button', `bd-ct-row${found ? '' : ' locked'}`);
      row.type = 'button';
      const name = el('span', 'bd-ct-name', found ? e.name : '???');
      if (manualStore.isUnread(e.id)) name.append(el('i', 'bd-wetdot'));
      row.append(el('span', 'bd-ct-n', found ? '✓' : '·'), name, el('span', 'bd-ct-p', `${c.no}-${3 + 2 * k}`));
      row.addEventListener('click', () => this.go(spreadOf(this.book, e.id)));
      list.append(row);
    });
    for (const st of c.stubs) {
      const found = manualStore.isFound(st.entry.id);
      const row = el('button', 'bd-ct-row stub');
      row.type = 'button';
      row.append(el('span', 'bd-ct-n', ''), el('span', 'bd-ct-name bd-it', found ? `${st.entry.name}, see ${manTag(st.entry)}` : `???, see chapter ${bookChapters().find((x) => x.entries.includes(st.entry))!.no}`), el('span', 'bd-ct-p', ''));
      row.addEventListener('click', () => {
        this.selected.set(st.entry.id, st.layer);
        this.go(spreadOf(this.book, st.entry.id));
      });
      list.append(row);
    }
    if (!c.entries.length && !c.stubs.length) list.append(el('p', 'bd-blank-sub', 'Nothing is filed here yet.'));
    return this.frame(`CHAPTER ${c.no}`, folio, side, [el('div', 'bd-ms', 'IN THIS CHAPTER'), list]);
  }

  private dailySightings(e: ManualEntry): ManualSighting[] {
    return e.sightings.filter((s) => DAILY.includes(s.layer));
  }

  /** The appearance a found entry's pages show: the one picked in the figure strip, else the shallowest found. */
  private shown(e: ManualEntry): ManualSighting {
    const ds = this.dailySightings(e);
    const pick = this.selected.get(e.id);
    const found = ds.filter((s) => manualStore.hasLayer(e.id, s.layer));
    return found.find((s) => s.layer === pick) ?? found[0] ?? ds[0]!;
  }

  private plateLeaf(e: ManualEntry, folio: string, side: 'l' | 'r'): Node[] {
    const tag = manTag(e);
    const ds = this.dailySightings(e);
    if (!manualStore.isFound(e.id)) {
      const ghost = el('div', 'bd-ghost');
      ghost.append(plateCanvas(ds[0]!, 300, 220, 'silhouette', this.live));
      return this.frame('???', folio, side, [ghost]);
    }
    const s = this.shown(e);
    const letter = (i: number) => String.fromCharCode(97 + i);
    const mount = el('div', 'bd-mount');
    mount.append(plateCanvas(s, 260, 170, 'sprite', this.live));
    const cap = el('div', 'bd-figcap');
    cap.append(el('b', '', `Figure ${folio}${letter(ds.indexOf(s))}.`), ` ${e.name} as observed in ${LAYER_NAME.get(s.layer)}.`);
    const strip = el('div', 'bd-figrow');
    ds.forEach((x, i) => {
      const seen = manualStore.hasLayer(e.id, x.layer);
      const fig = el('button', `bd-fig${x === s ? ' sel' : ''}${seen ? '' : ' unseen'}`);
      fig.type = 'button';
      fig.disabled = !seen;
      const box = el('div', 'bd-fig-box');
      box.append(plateCanvas(x, 46, 36, seen ? 'sprite' : 'silhouette', this.live));
      fig.append(box, el('span', 'bd-fig-cap', `(${letter(i)}) ch. ${DAILY.indexOf(x.layer) + 1}${seen ? '' : ' ?'}`));
      if (seen)
        fig.addEventListener('click', () => {
          this.selected.set(e.id, x.layer);
          this.render();
        });
      strip.append(fig);
    });
    // Rarity: pencilled under the figures, the tier word scrawled over with highlighter.
    const meta = MANUAL_RARITIES[e.rarity];
    const rate = formatRate(shownRate(e, s));
    const rar = el('div', 'bd-pencil bd-rarity');
    rar.append(el('span', `bd-hl hl-${e.rarity}`, meta.label.toLowerCase()), rate ? ` · ${rate} of days` : ' · comes with its questions');
    return this.frame(tag, folio, side, [mount, cap, strip, rar]);
  }

  private hideHabPop() {
    this.habPop.hidden = true;
    this.idxPop.hidden = true;
  }

  private placePop(pop: HTMLElement, anchor: HTMLElement, gap = 8) {
    const bd = this.el.querySelector<HTMLElement>('.bd')!;
    const bdR = bd.getBoundingClientRect();
    const aR = anchor.getBoundingClientRect();
    const pR = pop.getBoundingClientRect();
    const pad = 10;
    let left = aR.left - bdR.left + aR.width / 2 - pR.width / 2;
    left = Math.max(pad, Math.min(bdR.width - pR.width - pad, left));
    let top = aR.top - bdR.top - pR.height - gap;
    if (top < pad) top = aR.bottom - bdR.top + gap;
    pop.style.left = `${Math.round(left)}px`;
    pop.style.top = `${Math.round(top)}px`;
  }

  /** Tiny layer-name-only tooltip for an index bitmap square (no color square, no description). */
  private showLayerNamePop(anchor: HTMLElement, layer: LayerId) {
    this.idxPop.hidden = true;
    const pop = this.habPop;
    pop.className = 'bd-hab-pop bd-hab-pop-mini';
    pop.replaceChildren(el('span', '', LAYER_NAME.get(layer) ?? layer));
    pop.hidden = false;
    this.placePop(pop, anchor, 6);
  }

  /** Compact page snapshot popup for hovering an index listing: sprite image + description only. */
  private showIndexPreview(anchor: HTMLElement, e: ManualEntry) {
    const pop = this.idxPop;
    const s = this.shown(e);
    const thumb = el('div', 'bd-idx-thumb');
    const dummyLive = new Set<() => void>();
    thumb.append(plateCanvas(s, 140, 88, 'sprite', dummyLive));
    const desc = el('div', 'bd-idx-desc', `${e.blurb} ${e.note}`.trim());
    pop.replaceChildren(thumb, desc);
    pop.hidden = false;
    this.placePop(pop, anchor, 8);
  }

  private showHabPop(anchor: HTMLElement, layer: LayerId, detail?: string) {
    this.idxPop.hidden = true;
    const pop = this.habPop;
    pop.className = 'bd-hab-pop';
    const art = LAYER_ART[layer];
    const head = el('div', 'bd-hab-pop-head');
    const dot = el('i', 'bd-hab-pop-dot');
    dot.style.background = art.stackTheme.accent;
    head.append(dot, el('b', '', LAYER_NAME.get(layer) ?? layer));
    const nodes: Node[] = [head, el('div', 'bd-hab-pop-blurb', art.blurb)];
    if (detail) nodes.push(el('div', 'bd-hab-pop-det', detail));
    pop.replaceChildren(...nodes);
    pop.hidden = false;
    this.placePop(pop, anchor, 8);
  }

  private buildHabitat(e: ManualEntry, shown: ManualSighting): HTMLElement {
    const wrap = el('div', 'bd-hab-wrap');
    const byLayer = new Map(e.sightings.map((x) => [x.layer, x]));
    const makeRow = (ids: readonly LayerId[], extraCls = '') => {
      const row = el('div', `bd-hab${extraCls ? ` ${extraCls}` : ''}`);
      for (const l of ids) {
        const sighting = byLayer.get(l);
        const present = Boolean(sighting);
        const isCurrent = l === shown.layer;
        const seen = present && manualStore.hasLayer(e.id, l);
        const cls = `bd-hab-cell${isCurrent ? ' you' : present ? ' on' : ' off'}`;
        const cell = el('button', cls);
        cell.type = 'button';
        const accent = LAYER_ART[l].stackTheme.accent;
        cell.style.setProperty('--hb-accent', accent);
        const fullName = LAYER_NAME.get(l) ?? l;
        cell.setAttribute('aria-label', `${fullName}${isCurrent ? ' (in figure)' : present ? ' (present)' : ''}`);
        cell.append(bitmapCode(LAYER_CODE[l]));
        const open = () => this.showHabPop(cell, l, sighting?.detailNote);
        cell.addEventListener('pointerenter', open);
        cell.addEventListener('focus', open);
        cell.addEventListener('pointerleave', () => this.hideHabPop());
        cell.addEventListener('blur', () => this.hideHabPop());
        if (seen && DAILY.includes(l)) {
          cell.addEventListener('click', () => {
            this.selected.set(e.id, l);
            this.render();
          });
        }
        row.append(cell);
      }
      return row;
    };
    wrap.append(makeRow(DAILY));
    const hasEndless = e.sightings.some((x) => ENDLESS_ONLY.includes(x.layer));
    if (hasEndless) wrap.append(makeRow(ENDLESS_ONLY, 'bd-hab-endless'));
    const hasTrueEndless = e.sightings.some((x) => TRUE_ENDLESS.includes(x.layer));
    if (hasTrueEndless) wrap.append(makeRow(TRUE_ENDLESS, 'bd-hab-endless'));
    return wrap;
  }

  private textLeaf(e: ManualEntry, folio: string, side: 'l' | 'r'): Node[] {
    const tag = manTag(e);
    if (!manualStore.isFound(e.id)) {
      // The rumour is hand-written per entry (FIELD-MANUAL-PLAN.md); an entry without one just shows the blank page.
      return this.frame('???', folio, side, [
        el('p', 'bd-blank', 'This page intentionally left blank.'),
        e.rumour ? el('p', 'bd-pencil bd-pencil-block', e.rumour) : null,
      ].filter((n): n is HTMLParagraphElement => n !== null));
    }
    const s = this.shown(e);
    const name = el('span');
    name.append(el('b', '', manTag(e).replace(/\(.*\)$/, '').toLowerCase()), ` — ${e.name}`);
    const body: Node[] = [...this.sec('NAME', name), ...this.sec('HABITAT', this.buildHabitat(e, s))];
    if (s.critterLayer) {
      const bh = el('span', 'bd-behav');
      for (const m of LAYER_ART[s.critterLayer].critters.motions) bh.append(el('span', '', m));
      body.push(...this.sec('BEHAVIOR', bh));
    }
    body.push(...this.sec('DESCRIPTION', e.blurb, ' ', e.note));
    if (e.bugs) body.push(...this.sec('BUGS', e.bugs));
    if (e.seeAlso?.length) {
      const sa = el('span');
      e.seeAlso.forEach((id, i) => {
        const other = manualEntryById(id);
        enforce(other, `binder: ${e.id} sees also unknown entry ${id}`);
        if (i) sa.append(', ');
        const a = el('button', 'bd-link', manTag(other));
        a.type = 'button';
        a.addEventListener('click', () => this.go(spreadOf(this.book, id)));
        sa.append(a);
      });
      body.push(...this.sec('SEE ALSO', sa));
    }
    const st = manualStore.firstSeen(e.id, s.layer);
    if (st) {
      const fresh = this.freshWet.get(e.id)?.has(s.layer) ?? false;
      const stamp = el('div', `bd-stamp${fresh ? ' wet' : ''}`, st.at === null ? 'LOGGED' : stampDate(st.at));
      const key = `${e.id}|${s.layer}`;
      if (fresh && !this.thunked.has(key)) {
        this.thunked.add(key); // once per visit; later renders show it still wet but settled
        if (!reducedMotion()) stamp.classList.add('thunk');
        sound.stackCrunch(s.layer);
      }
      const foot = el('div', 'bd-sighting-foot');
      // Subtle deterministic hand-stamped jitter, bounded so neither stamp nor note ever clips off the page.
      const sx = Math.round((hash01(`${key}|sx`) - 0.5) * 24);
      const sr = (-8 + hash01(`${key}|sr`) * 5.5).toFixed(1);
      stamp.style.setProperty('--st-x', `${sx}px`);
      stamp.style.setProperty('--st-r', `${sr}deg`);
      foot.append(stamp);
      if (st.prompt) {
        const found = el('div', 'bd-pencil bd-found', `found during “${st.prompt.toLowerCase()}” ✓`);
        const fx = Math.round((hash01(`${key}|fx`) - 0.5) * 14);
        const fr = (-1.6 + hash01(`${key}|fr`) * 2.8).toFixed(1);
        found.style.setProperty('--fd-x', `${fx}px`);
        found.style.setProperty('--fd-r', `${fr}deg`);
        foot.append(found);
      }
      body.push(foot);
    }
    return this.frame(tag, folio, side, body);
  }

  private indexLeaf(half: 0 | 1, folio: string, side: 'l' | 'r'): Node[] {
    const q = this.query.toLowerCase();
    const entries = bookChapters()
      .flatMap((c) => c.entries)
      .filter((e) => manualStore.isFound(e.id))
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
      .filter((e) => !q || e.name.toLowerCase().includes(q) || manTag(e).toLowerCase().includes(q));
    const mid = Math.ceil(entries.length / 2);
    const mine = half === 0 ? entries.slice(0, mid) : entries.slice(mid);
    const body: Node[] = [];
    if (half === 0) {
      const search = el('label', 'bd-search');
      const input = el('input');
      input.type = 'search';
      input.placeholder = 'search';
      input.value = this.query;
      input.setAttribute('aria-label', 'Search the index');
      input.addEventListener('input', () => {
        this.query = input.value.trim();
        this.render();
        const again = this.leaves[0].querySelector<HTMLInputElement>('.bd-search input');
        again?.focus();
        again?.setSelectionRange(again.value.length, again.value.length);
      });
      search.append('search: ', input);
      body.push(search);
    }
    const table = el('div', 'bd-idx');
    for (const e of mine) {
      const row = el('div', 'bd-idx-row');
      row.setAttribute('role', 'button');
      row.tabIndex = 0;

      const name = el('span', 'bd-idx-name', e.name);
      const meta = MANUAL_RARITIES[e.rarity];
      const rar = el('span', 'bd-idx-rar');
      rar.append(el('span', `bd-hl hl-${e.rarity}`, meta.label.toLowerCase()));

      // Layer discovery bitmap: one tiny colored square per possible layer; found layers filled, unfound outlined.
      const bits = el('span', 'bd-idx-bits');
      for (const s of this.dailySightings(e)) {
        const found = manualStore.hasLayer(e.id, s.layer);
        const sq = el('i', `bd-idx-bit${found ? ' on' : ''}`);
        sq.style.setProperty('--hb-accent', LAYER_ART[s.layer].stackTheme.accent);
        sq.addEventListener('pointerenter', (ev) => {
          ev.stopPropagation();
          this.showLayerNamePop(sq, s.layer);
        });
        sq.addEventListener('pointerleave', (ev) => {
          ev.stopPropagation();
          this.habPop.hidden = true;
          this.showIndexPreview(row, e);
        });
        bits.append(sq);
      }

      const tag = el('span', 'bd-idx-tag', manTag(e));
      row.append(name, rar, bits, tag);

      row.addEventListener('pointerenter', () => this.showIndexPreview(row, e));
      row.addEventListener('focus', () => this.showIndexPreview(row, e));
      row.addEventListener('pointerleave', () => this.hideHabPop());
      row.addEventListener('blur', () => this.hideHabPop());
      row.addEventListener('click', () => this.go(spreadOf(this.book, e.id)));
      row.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          this.go(spreadOf(this.book, e.id));
        }
      });
      table.append(row);
    }
    body.push(table);
    if (half === 0 && !entries.length) {
      const anyFound = bookChapters().some((c) => c.entries.some((e) => manualStore.isFound(e.id)));
      body.push(el('p', 'bd-blank-sub', anyFound ? 'No entry matches.' : 'Nothing logged yet. Click what you see while you dive.'));
    }
    return this.frame('INDEX', folio, side, body);
  }
}
