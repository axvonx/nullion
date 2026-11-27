import '@fontsource/courier-prime/700.css';
import '@fontsource/caveat/400.css';
import './binder.css';
import { sound } from '../../audio/sound';
import { enforce } from '../../core/enforce';
import { LAYERS, type LayerId } from '../../core/layers';
import { buildBook, bookChapters, kwicRows, manTag, spreadOf, type Chapter, type Leaf, type Spread } from '../../game/manual-book';
import { MANUAL_RARITIES, manualEntryById, manualStore, type ManualEntry, type ManualSighting } from '../../game/manual';
import { formatRate, shownRate } from '../../game/rarity';
import { storageKey } from '../../keys';
import { reducedMotion } from '../../looks';
import { CritterSystem } from '../../render/critters';
import { LAYER_ART } from '../../layers';
import { drawEntity, setPaint } from '../../render/v4/kit';
import { V4_LIBRARIES } from '../../render/v4/libraries';
import { drawTopicProp, TOPIC_PROPS } from '../../render/v4/topics';

/**
 * The Field Manual as an archive ring binder of manual pages (FIELD-MANUAL-PLAN.md). Layout comes from the pure
 * book model (src/game/manual-book.ts); this file only renders it. Wide screens show a spread, phones one leaf.
 */

const DAILY = LAYERS.map((l) => l.id);
const LAYER_NAME = new Map(LAYERS.map((l) => [l.id, l.name]));
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
      </section>`;
    mount.append(wrap);
    this.el = wrap;
    const q = (k: string) => wrap.querySelector<HTMLElement>(`[data-bd="${k}"]`)!;
    this.sheet = q('sheet');
    this.leaves = [q('l'), q('r')];
    this.tabs = q('tabs');
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
    this.leaves[0].replaceChildren(...this.leaf(s.left, s.folios[0]));
    this.leaves[1].replaceChildren(...this.leaf(s.right, s.folios[1]));
    this.sheet.scrollTop = 0;
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
      note('to-index', 'Index →', 'permuted index', this.book.length - 1, s.left.kind === 'index'),
    );
  }

  // ---------------------------------------------------------------------------------------------------------------
  // Leaves

  private frame(headL: string, headR: string, folio: string, body: Node[]): Node[] {
    const head = el('div', 'bd-mhead');
    head.append(el('span', '', headL), el('span', '', 'Field Manual'), el('span', '', headR));
    const foot = el('div', 'bd-mfoot');
    foot.append(el('span', '', 'Field Distribution'), el('span', '', 'Volume I'), el('span', '', folio));
    const holes = el('div', 'bd-holes');
    holes.innerHTML = '<i></i><i></i><i></i>';
    const main = el('div', 'bd-body');
    main.append(...body);
    return [holes, head, main, foot];
  }

  private sec(title: string, ...body: (Node | string)[]): Node[] {
    const b = el('div', 'bd-mb');
    b.append(...body);
    return [el('div', 'bd-ms', title), b];
  }

  private leaf(l: Leaf, folio: string): Node[] {
    switch (l.kind) {
      case 'title':
        return this.titleLeaf(folio);
      case 'intro':
        return this.frame('INTRO(7)', 'INTRO(7)', folio, [
          ...this.sec('NAME', 'intro — how to read this manual'),
          ...this.sec('DESCRIPTION', 'Each chapter is one layer of the stack. A chapter stays sealed until your cursor has reached its layer.'),
          ...this.sec('', 'Log what you see by clicking it while you dive. Each page is stamped with the day you first saw it.'),
          ...this.sec('RARITY', 'Common things are there every day. Uncommon: about one day in two. Rare: one in five. Mythic: one in fourteen. Everyone’s stack holds the same things on a given day.'),
          ...this.sec('SEE ALSO', 'The permuted index, at the back.'),
        ]);
      case 'contents':
        return this.contentsLeaf(folio);
      case 'notes':
        return this.frame('NOTES', 'NOTES', folio, [el('p', 'bd-pencil bd-pencil-block', 'the deeper it goes, the stranger the wildlife.')]);
      case 'divider':
        return this.dividerLeaf(l.chapter, folio);
      case 'chapter-list':
        return this.chapterListLeaf(l.chapter, folio);
      case 'sealed':
        return this.frame(`CHAPTER ${l.chapter.no}`, `CHAPTER ${l.chapter.no}`, folio, [
          el('p', 'bd-blank', 'The pages of this chapter are sealed.'),
          el('p', 'bd-blank-sub', `Reach ${l.chapter.name} to open them.`),
        ]);
      case 'plate':
        return this.plateLeaf(l.entry, folio);
      case 'text':
        return this.textLeaf(l.entry, folio);
      case 'index':
        return this.indexLeaf(l.half, folio);
    }
  }

  private titleLeaf(folio: string): Node[] {
    const t = el('div', 'bd-titlepage');
    t.append(
      el('div', 'bd-t-big', 'nullion Field Manual'),
      el('div', 'bd-t-mid', 'Volume I: The Stack and Its Inhabitants'),
      el('div', 'bd-t-small', 'Ten chapters, from Application to Ring −3'),
      el('div', 'bd-t-small', 'Field Distribution · First Edition'),
      el('div', 'bd-t-small', 'Compiled by the reader'),
    );
    const n = manualStore.foundCount();
    if (n) t.append(el('div', 'bd-pencil bd-pencil-block', `${n} logged so far`));
    return this.frame('', '', folio, [t]);
  }

  private contentsLeaf(folio: string): Node[] {
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
    idx.append(el('span', 'bd-ct-n', ''), el('span', 'bd-ct-name bd-it', 'Permuted index'), el('span', 'bd-ct-p', 'I-1'));
    idx.addEventListener('click', () => this.go(this.book.length - 1));
    table.append(idx);
    return this.frame('CONTENTS', 'CONTENTS', folio, [table, el('div', 'bd-gloss', 'Boxes are the entries filed in each chapter; filled ones are logged.')]);
  }

  private dividerLeaf(c: Chapter, folio: string): Node[] {
    const open = manualStore.hasReached(c.layer);
    const d = el('div', `bd-divider${open ? '' : ' sealed'} tint-${Number(c.no) % 3}`);
    d.append(el('div', 'bd-div-num', c.no), el('div', 'bd-div-name', c.name), el('div', 'bd-div-sub', open ? LAYER_ART[c.layer].blurb : 'Sealed until you reach this layer.'));
    if (!open) d.append(el('div', 'bd-seal', 'SEALED'));
    d.append(el('div', 'bd-div-folio', folio));
    return [d];
  }

  private chapterListLeaf(c: Chapter, folio: string): Node[] {
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
    return this.frame(`CHAPTER ${c.no}`, c.name.toUpperCase(), folio, [el('div', 'bd-ms', 'IN THIS CHAPTER'), list]);
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

  private plateLeaf(e: ManualEntry, folio: string): Node[] {
    const tag = manTag(e);
    const ds = this.dailySightings(e);
    if (!manualStore.isFound(e.id)) {
      const ghost = el('div', 'bd-ghost');
      ghost.append(plateCanvas(ds[0]!, 300, 220, 'silhouette', this.live));
      return this.frame('???', '???', folio, [ghost]);
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
    return this.frame(tag, tag, folio, [mount, cap, strip, rar]);
  }

  private textLeaf(e: ManualEntry, folio: string): Node[] {
    const tag = manTag(e);
    if (!manualStore.isFound(e.id)) {
      // The rumour is hand-written per entry (FIELD-MANUAL-PLAN.md); an entry without one just shows the blank page.
      return this.frame('???', '???', folio, [
        el('p', 'bd-blank', 'This page intentionally left blank.'),
        e.rumour ? el('p', 'bd-pencil bd-pencil-block', e.rumour) : null,
      ].filter((n): n is HTMLParagraphElement => n !== null));
    }
    const s = this.shown(e);
    const name = el('span');
    name.append(el('b', '', manTag(e).replace(/\(.*\)$/, '').toLowerCase()), ` — ${e.name}`);
    const hab = el('span', 'bd-hab');
    for (const l of DAILY) {
      const has = e.sightings.some((x) => x.layer === l);
      hab.append(el('i', l === s.layer ? 'you' : has ? 'on' : ''));
    }
    const habL = el('span', 'bd-habl', 'Application … Ring −3; ringed: the one in the figure');
    const body: Node[] = [...this.sec('NAME', name), ...this.sec('HABITAT', hab, habL)];
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
      body.push(stamp);
      if (st.prompt) body.push(el('div', 'bd-pencil bd-found', `found during “${st.prompt.toLowerCase()}” ✓`));
    }
    return this.frame(tag, tag, folio, body);
  }

  private indexLeaf(half: 0 | 1, folio: string): Node[] {
    const lines = bookChapters()
      .flatMap((c) => c.entries)
      .filter((e) => manualStore.isFound(e.id))
      .map((e) => ({ tag: manTag(e), line: e.name, target: e.id }));
    const q = this.query.toLowerCase();
    const rows = kwicRows(lines).filter((r) => !q || r.key.toLowerCase().startsWith(q) || r.key.toLowerCase().includes(` ${q}`));
    const mid = Math.ceil(rows.length / 2);
    const mine = half === 0 ? rows.slice(0, mid) : rows.slice(mid);
    const body: Node[] = [];
    if (half === 0) {
      const search = el('label', 'bd-search');
      const input = el('input');
      input.type = 'search';
      input.placeholder = 'search';
      input.value = this.query;
      input.setAttribute('aria-label', 'Search the permuted index');
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
    const table = el('div', 'bd-kwic');
    for (const r of mine) {
      const row = el('button', 'bd-kwic-row');
      row.type = 'button';
      const key = el('span', 'bd-kw-k');
      const [first, ...rest] = r.key.split(' ');
      key.append(el('b', '', first), rest.length ? ` ${rest.join(' ')}` : '');
      const before = el('span', 'bd-kw-l');
      before.append(el('span', '', r.before));
      row.append(before, key, el('span', 'bd-kw-r', r.tag));
      row.addEventListener('click', () => this.go(spreadOf(this.book, r.target)));
      table.append(row);
    }
    body.push(table);
    if (half === 0 && !rows.length) body.push(el('p', 'bd-blank-sub', lines.length ? 'No entry matches.' : 'Nothing logged yet. Click what you see while you dive.'));
    if (half === 1) body.push(el('div', 'bd-gloss', 'Every word of every logged entry’s NAME line, rotated into the middle column and alphabetised.'));
    return this.frame('PERMUTED INDEX', 'PERMUTED INDEX', folio, body);
  }
}
