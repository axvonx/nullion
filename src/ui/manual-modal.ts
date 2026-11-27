import { ENDLESS_LAYERS, type LayerId } from '../core/layers';
import {
  MANUAL_ENTRIES,
  MANUAL_RARITIES,
  manualEntryById,
  manualStore,
  type ManualEntry,
  type ManualKind,
  type ManualSighting,
} from '../game/manual';
import { formatRate, shownRate } from '../game/rarity';
import { LAYER_PALETTE } from '../render/palettes';
import { drawEntity, setPaint } from '../render/v4/kit';
import { V4_LIBRARIES } from '../render/v4/libraries';
import { drawTopicProp, TOPIC_PROPS } from '../render/v4/topics';

const LAYER_NAME = new Map<LayerId, string>(ENDLESS_LAYERS.map((l) => [l.id, l.name]));

/** Small 9×9 pixel book icon SVG for the end-of-day button and modal header. */
export function manualBookIcon(size = 16): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const rows = [
    ' ####### ',
    '##+++++##',
    '#+#####+#',
    '#+##+##+#',
    '#+#####+#',
    '#+#+++# #',
    '#+#####+#',
    '##+++++##',
    ' ####### ',
  ];
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 9 9');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('fm-book-icon');
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch !== '#' && ch !== '+') continue;
      const r = document.createElementNS(ns, 'rect');
      r.setAttribute('x', String(x));
      r.setAttribute('y', String(y));
      r.setAttribute('width', '1');
      r.setAttribute('height', '1');
      r.setAttribute('fill', ch === '#' ? 'currentColor' : 'var(--signal)');
      svg.append(r);
    }
  });
  return svg;
}

/** Draw a crisp miniature pixel-art critter portrait onto a small canvas. */
function drawCritterPortrait(ctx: CanvasRenderingContext2D, layer: LayerId, cx: number, cy: number) {
  const px = (dx: number, dy: number, w: number, h: number, hex: string) => {
    ctx.fillStyle = hex;
    ctx.fillRect(cx + dx, cy + dy, w, h);
  };
  switch (layer) {
    case 'application':
      px(-4, -1, 7, 4, '#5b8ee6');
      px(-2, -3, 4, 2, '#9ec5f8');
      px(3, -1, 2, 2, '#f2c14e');
      px(1, -1, 1, 1, '#000000');
      break;
    case 'runtime':
      px(-4, -2, 8, 5, '#5588ff');
      px(-3, -3, 6, 1, '#99ccff');
      px(-2, -1, 1, 1, '#ffffff');
      px(1, -1, 1, 1, '#ffffff');
      break;
    case 'libraries':
      px(-4, -1, 8, 4, '#cc8833');
      px(-3, -2, 6, 1, '#ffcc66');
      px(-2, 0, 1, 1, '#000000');
      px(1, 0, 1, 1, '#000000');
      px(-1, -4, 3, 2, '#ffdd88');
      break;
    case 'userspace':
      px(-3, -2, 6, 6, '#aa0000');
      px(-3, -4, 1, 2, '#ff5555');
      px(2, -4, 1, 2, '#ff5555');
      px(-2, -1, 1, 1, '#ffff55');
      px(1, -1, 1, 1, '#ffff55');
      break;
    case 'kernel':
      px(-1, -5, 1, 2, '#aaaaaa');
      px(-1, -6, 1, 1, '#ff5555');
      px(-4, -3, 8, 6, '#aaaaaa');
      px(-2, -2, 4, 2, '#55ffff');
      px(-3, 3, 2, 1, '#555555');
      px(1, 3, 2, 1, '#555555');
      break;
    case 'drivers':
      px(-3, -1, 6, 3, '#55ffff');
      px(-2, -2, 4, 1, '#ffffff');
      px(-3, 2, 1, 1, '#ff55ff');
      px(2, 2, 1, 1, '#ff55ff');
      break;
    case 'firmware':
      px(-3, -3, 6, 1, '#8cff9c');
      px(-4, -2, 8, 4, '#1ea046');
      px(-2, -1, 4, 2, '#ffffff');
      px(-3, 2, 6, 1, '#8cff9c');
      break;
    case 'ring-1':
      for (const ox of [-6, 1]) {
        px(ox, -1, 5, 3, '#1ea046');
        px(ox + 1, -2, 3, 5, '#8cff9c');
        px(ox + 2, 0, 1, 1, '#ffffff');
      }
      break;
    case 'ring-2':
      px(-3, -2, 7, 5, '#bebebe');
      px(-1, 0, 1, 1, '#0c0c0c');
      px(2, 0, 1, 1, '#0c0c0c');
      break;
    default:
      px(-2, -3, 4, 6, '#e8eeff');
      px(-1, -2, 2, 4, '#040406');
      break;
  }
}

/** Render a live crisp pixel portrait for `sighting` onto a canvas. */
function renderPortraitCanvas(sighting: ManualSighting, boxW: number, boxH: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = boxW;
  canvas.height = boxH;
  canvas.className = 'fm-portrait-canvas';
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  ctx.imageSmoothingEnabled = false;

  if (sighting.critterLayer) {
    drawCritterPortrait(ctx, sighting.critterLayer, Math.floor(boxW / 2), Math.floor(boxH / 2));
    return canvas;
  }

  if (sighting.topicId) {
    const tp = TOPIC_PROPS.find((p) => p.id === sighting.topicId);
    if (tp) {
      setPaint(LAYER_PALETTE[sighting.layer], undefined);
      const pw = Math.min(boxW - 6, 36);
      const ph = Math.min(boxH - 6, 26);
      drawTopicProp(ctx, tp, pw, ph, Math.floor((boxW - pw) / 2), Math.floor((boxH - ph) / 2), 1.4, 0);
      return canvas;
    }
  }

  if (sighting.entityId) {
    const lib = V4_LIBRARIES[sighting.layer];
    const def =
      lib.near.find((d) => d.id === sighting.entityId) ?? lib.anchors.find((d) => d.id === sighting.entityId);
    if (def) {
      const [ew, eh] = def.sizes[0]!;
      // Fit cleanly inside boxW × boxH, scaling down only if an anchor is bigger than the canvas.
      const tmp = document.createElement('canvas');
      tmp.width = ew;
      tmp.height = eh;
      const tctx = tmp.getContext('2d');
      if (tctx) {
        tctx.imageSmoothingEnabled = false;
        setPaint(LAYER_PALETTE[sighting.layer], undefined);
        drawEntity(tctx, def, 0, 1, 0, 0, false, 1.2);
        const scale = Math.min((boxW - 4) / ew, (boxH - 4) / eh);
        const dw = scale >= 1 ? ew * Math.floor(scale) : Math.max(1, Math.round(ew * scale));
        const dh = scale >= 1 ? eh * Math.floor(scale) : Math.max(1, Math.round(eh * scale));
        ctx.drawImage(tmp, Math.floor((boxW - dw) / 2), Math.floor((boxH - dh) / 2), dw, dh);
      }
    }
  }
  return canvas;
}

/**
 * Two-layer Field Manual dialog:
 *   1. Portrait Index Page (searchable, filterable grid of character portraits + glowing unread pips + `???` locked cards)
 *   2. Full Reference Page (zoomed portrait with Layer Appearance dropdown defaulting to highest discovered layer,
 *      rarity + percentage, field notes, layer sightings checklist, and free Prev/Next page-flipping).
 */
export class FieldManualModal {
  readonly el: HTMLElement;
  private searchInput: HTMLInputElement;
  private countEl: HTMLElement;
  private filtersEl: HTMLElement;
  private bodyEl: HTMLElement;
  private filter: 'all' | 'unread' | ManualKind = 'all';
  private query = '';
  private activeId: string | undefined;
  private activeLayer: LayerId | undefined;
  private unsub: (() => void) | undefined;

  constructor(mount: HTMLElement) {
    const wrap = document.createElement('div');
    wrap.className = 'fm-backdrop';
    wrap.hidden = true;
    wrap.innerHTML = `
      <section class="fm-modal panel" role="dialog" aria-modal="true" aria-label="Field Manual">
        <header class="fm-head">
          <div class="fm-title-wrap">
            <span class="fm-title">MAN(7) · FIELD MANUAL</span>
            <span class="fm-count" data-fm="count"></span>
          </div>
          <button type="button" class="fm-close" data-fm="close" aria-label="Close Field Manual">×</button>
        </header>
        <div class="fm-toolbar" data-fm="toolbar">
          <input type="search" class="fm-search" data-fm="search" placeholder="Search name, layer, rarity, notes…" aria-label="Search Field Manual" />
          <div class="fm-filters" data-fm="filters"></div>
        </div>
        <div class="fm-body" data-fm="body"></div>
      </section>
    `;
    mount.append(wrap);
    this.el = wrap;
    this.searchInput = wrap.querySelector<HTMLInputElement>('[data-fm="search"]')!;
    this.countEl = wrap.querySelector<HTMLElement>('[data-fm="count"]')!;
    this.filtersEl = wrap.querySelector<HTMLElement>('[data-fm="filters"]')!;
    this.bodyEl = wrap.querySelector<HTMLElement>('[data-fm="body"]')!;

    const headTitle = wrap.querySelector('.fm-title-wrap')!;
    headTitle.prepend(manualBookIcon(16));

    wrap.querySelector('[data-fm="close"]')!.addEventListener('click', () => this.close());
    wrap.addEventListener('click', (ev) => {
      if (ev.target === wrap) this.close();
    });
    this.searchInput.addEventListener('input', () => {
      this.query = this.searchInput.value.trim().toLowerCase();
      this.render();
    });
    window.addEventListener('keydown', (ev) => {
      if (this.el.hidden) return;
      if (ev.key === 'Escape') {
        ev.preventDefault();
        if (this.activeId) {
          this.activeId = undefined;
          this.render();
        } else {
          this.close();
        }
      } else if (this.activeId && ev.key === 'ArrowLeft') {
        ev.preventDefault();
        this.flip(-1);
      } else if (this.activeId && ev.key === 'ArrowRight') {
        ev.preventDefault();
        this.flip(1);
      }
    });

    this.unsub = manualStore.subscribe(() => {
      if (!this.el.hidden) this.render();
    });
  }

  open(entryId?: string) {
    this.activeId = entryId;
    this.activeLayer = undefined;
    this.el.hidden = false;
    this.render();
    if (!entryId) this.searchInput.focus({ preventScroll: true });
  }

  close() {
    this.el.hidden = true;
    this.activeId = undefined;
  }

  dispose() {
    this.unsub?.();
  }

  private filteredEntries(): ManualEntry[] {
    return MANUAL_ENTRIES.filter((e) => {
      if (this.filter === 'unread') {
        if (!manualStore.isUnread(e.id)) return false;
      } else if (this.filter !== 'all') {
        if (e.kind !== this.filter) return false;
      }
      if (!this.query) return true;
      const found = manualStore.isFound(e.id);
      const layerNames = e.sightings.map((s) => LAYER_NAME.get(s.layer) ?? s.layer).join(' ');
      const haystack = found
        ? `${e.name} ${e.manTag} ${e.kind} ${MANUAL_RARITIES[e.rarity].label} ${e.blurb} ${e.note} ${layerNames}`.toLowerCase()
        : `${e.kind} ${MANUAL_RARITIES[e.rarity].label} ${layerNames}`.toLowerCase();
      return haystack.includes(this.query);
    });
  }

  private flip(dir: -1 | 1) {
    if (!this.activeId) return;
    const list = MANUAL_ENTRIES;
    const idx = list.findIndex((e) => e.id === this.activeId);
    if (idx < 0) return;
    const next = list[(idx + dir + list.length) % list.length]!;
    this.openEntry(next.id);
  }

  private openEntry(id: string) {
    this.activeId = id;
    this.activeLayer = manualStore.highestFoundLayer(id);
    if (manualStore.isFound(id)) manualStore.markRead(id);
    this.render();
  }

  private render() {
    const found = manualStore.foundCount();
    const total = MANUAL_ENTRIES.length;
    const unread = manualStore.unreadCount();
    this.countEl.textContent = `${found}/${total} logged${unread > 0 ? ` · ${unread} new` : ''}${manualStore.isDebugUnlocked ? ' · DEBUG ALL' : ''}`;

    const toolbar = this.el.querySelector<HTMLElement>('[data-fm="toolbar"]')!;
    toolbar.hidden = Boolean(this.activeId);
    this.el.querySelector('.fm-modal')!.classList.toggle('is-detail', Boolean(this.activeId));

    if (this.activeId) {
      this.renderDetail(this.activeId);
      return;
    }
    this.renderFilters();
    this.renderIndex();
  }

  private renderFilters() {
    const opts: { id: 'all' | 'unread' | ManualKind; label: string }[] = [
      { id: 'all', label: 'All' },
      { id: 'unread', label: `Unread (${manualStore.unreadCount()})` },
      { id: 'critter', label: 'Critters' },
      { id: 'prop', label: 'Props' },
      { id: 'anomaly', label: 'Anomalies' },
    ];
    this.filtersEl.replaceChildren(
      ...opts.map((o) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = `fm-chip${this.filter === o.id ? ' active' : ''}`;
        b.textContent = o.label;
        b.addEventListener('click', () => {
          this.filter = o.id;
          this.render();
        });
        return b;
      }),
    );
  }

  private renderIndex() {
    const entries = this.filteredEntries();
    if (!entries.length) {
      const empty = document.createElement('p');
      empty.className = 'fm-empty';
      empty.textContent = 'No matching entries in the Field Manual yet. Click characters & props in the stack to log them!';
      this.bodyEl.replaceChildren(empty);
      return;
    }
    const grid = document.createElement('div');
    grid.className = 'fm-grid';
    for (const entry of entries) {
      const isFound = manualStore.isFound(entry.id);
      const isUnread = manualStore.isUnread(entry.id);
      const meta = MANUAL_RARITIES[entry.rarity];
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `fm-card${isFound ? ' is-found' : ' is-locked'}${isUnread ? ' is-unread' : ''}`;
      card.style.setProperty('--fm-rarity', meta.color);

      const frame = document.createElement('div');
      frame.className = 'fm-card-art';
      if (isFound) {
        const topLayer = manualStore.highestFoundLayer(entry.id) ?? entry.sightings[0]!.layer;
        const sighting = entry.sightings.find((s) => s.layer === topLayer) ?? entry.sightings[0]!;
        frame.append(renderPortraitCanvas(sighting, 48, 38));
      } else {
        const q = document.createElement('span');
        q.className = 'fm-unknown';
        q.textContent = '???';
        frame.append(q);
      }

      const name = document.createElement('div');
      name.className = 'fm-card-name';
      name.textContent = isFound ? entry.name : '???';

      const sub = document.createElement('div');
      sub.className = 'fm-card-meta';
      const foundN = manualStore.foundLayers(entry.id).length;
      const cardRate = formatRate(shownRate(entry, entry.sightings[0]!));
      sub.textContent = `${meta.label}${cardRate ? ` ${cardRate}` : ''} · ${foundN}/${entry.sightings.length}`;

      if (isUnread) {
        const dot = document.createElement('span');
        dot.className = 'fm-unread-dot';
        dot.title = 'Newly logged';
        card.append(dot);
      }
      card.append(frame, name, sub);
      card.addEventListener('click', () => this.openEntry(entry.id));
      grid.append(card);
    }
    this.bodyEl.replaceChildren(grid);
  }

  private renderDetail(id: string) {
    const entry = manualEntryById(id);
    if (!entry) {
      this.activeId = undefined;
      this.render();
      return;
    }
    const isFound = manualStore.isFound(entry.id);
    const meta = MANUAL_RARITIES[entry.rarity];
    const idx = MANUAL_ENTRIES.findIndex((e) => e.id === id);

    const nav = document.createElement('div');
    nav.className = 'fm-detail-nav';
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'fm-btn';
    back.textContent = '◂ Index';
    back.addEventListener('click', () => {
      this.activeId = undefined;
      this.render();
    });
    const pager = document.createElement('div');
    pager.className = 'fm-pager';
    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'fm-btn';
    prev.textContent = '◀ Prev';
    prev.addEventListener('click', () => this.flip(-1));
    const pageNo = document.createElement('span');
    pageNo.className = 'fm-page-no';
    pageNo.textContent = `p.${idx + 1} / ${MANUAL_ENTRIES.length}`;
    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'fm-btn';
    next.textContent = 'Next ▶';
    next.addEventListener('click', () => this.flip(1));
    pager.append(prev, pageNo, next);
    nav.append(back, pager);

    const spread = document.createElement('div');
    spread.className = 'fm-spread';
    spread.style.setProperty('--fm-rarity', meta.color);

    const selectedLayer = this.activeLayer ?? manualStore.highestFoundLayer(entry.id) ?? entry.sightings[0]!.layer;
    const selectedSighting = entry.sightings.find((s) => s.layer === selectedLayer) ?? entry.sightings[0]!;
    const selectedName = LAYER_NAME.get(selectedSighting.layer) ?? selectedSighting.layer;
    const foundCount = manualStore.foundLayers(entry.id).length;

    // 1. Hero portrait up front, centered above everything else.
    const portraitBox = document.createElement('div');
    portraitBox.className = 'fm-big-art';
    if (isFound && manualStore.hasLayer(entry.id, selectedSighting.layer)) {
      portraitBox.append(renderPortraitCanvas(selectedSighting, 84, 66));
    } else {
      const q = document.createElement('span');
      q.className = 'fm-unknown big';
      q.textContent = '???';
      portraitBox.append(q);
    }

    // 2. Separate APPEARANCE label above a compact custom dropdown (detail note tucked into hover tooltip; untouched layers grayed out).
    const dropWrap = document.createElement('div');
    dropWrap.className = 'fm-drop';

    const dropLabel = document.createElement('div');
    dropLabel.className = 'fm-drop-kicker';
    dropLabel.textContent = 'Appearance';

    const dropBtn = document.createElement('button');
    dropBtn.type = 'button';
    dropBtn.className = 'fm-drop-btn';
    dropBtn.setAttribute('aria-haspopup', 'listbox');
    dropBtn.setAttribute('aria-expanded', 'false');
    const seenSelected = isFound && manualStore.hasLayer(entry.id, selectedSighting.layer);
    dropBtn.innerHTML = `<span class="fm-drop-val"></span><span class="fm-drop-count"></span><span class="fm-drop-caret" aria-hidden="true">▾</span>`;
    dropBtn.querySelector('.fm-drop-val')!.textContent = seenSelected ? selectedName : `${selectedName} (???)`;
    dropBtn.querySelector('.fm-drop-count')!.textContent = `${foundCount}/${entry.sightings.length}`;

    if (seenSelected && selectedSighting.detailNote) {
      const tip = document.createElement('div');
      tip.className = 'fm-drop-tip';
      tip.setAttribute('role', 'tooltip');
      tip.textContent = `${selectedName}: ${selectedSighting.detailNote}`;
      dropWrap.append(tip);
    }

    const menu = document.createElement('div');
    menu.className = 'fm-drop-menu';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;
    for (const s of entry.sightings) {
      const seen = isFound && manualStore.hasLayer(entry.id, s.layer);
      const lName = LAYER_NAME.get(s.layer) ?? s.layer;
      const item = document.createElement('button');
      item.type = 'button';
      item.setAttribute('role', 'option');
      item.className = `fm-drop-opt${seen ? ' seen' : ' locked'}${s.layer === selectedSighting.layer ? ' active' : ''}`;
      item.disabled = !seen;
      const rowTop = document.createElement('span');
      rowTop.className = 'fm-drop-opt-head';
      rowTop.textContent = seen ? `✓ ${lName}` : `? ${lName}`;
      const rowSub = document.createElement('span');
      rowSub.className = 'fm-drop-opt-sub';
      rowSub.textContent = seen
        ? (s.detailNote ?? `Spotted in ${lName}.`)
        : 'Not yet spotted at this layer';
      item.append(rowTop, rowSub);
      if (seen) {
        item.addEventListener('click', () => {
          this.activeLayer = s.layer;
          this.render();
        });
      }
      menu.append(item);
    }

    dropBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      const open = Boolean(menu.hidden);
      menu.hidden = !open;
      dropBtn.setAttribute('aria-expanded', String(open));
      dropWrap.classList.toggle('is-open', open);
    });
    spread.addEventListener('click', () => {
      if (!menu.hidden) {
        menu.hidden = true;
        dropBtn.setAttribute('aria-expanded', 'false');
        dropWrap.classList.remove('is-open');
      }
    });
    dropWrap.append(dropLabel, dropBtn, menu);

    // 3. Name + rarity row cleanly centered below the appearance control.
    const headBlock = document.createElement('div');
    headBlock.className = 'fm-entry-head';
    const heading = document.createElement('h2');
    heading.className = 'fm-entry-name';
    heading.textContent = isFound ? entry.name : 'Undiscovered Specimen';

    const tags = document.createElement('div');
    tags.className = 'fm-entry-tags';
    const man = document.createElement('span');
    man.className = 'fm-mantag';
    man.textContent = isFound ? entry.manTag : 'UNKNOWN(?)';
    const rar = document.createElement('span');
    rar.className = 'fm-rarity-pill';
    const rate = formatRate(shownRate(entry, selectedSighting));
    rar.textContent = rate ? `${meta.label} · ${rate} of days` : meta.label;
    tags.append(man, rar);
    headBlock.append(heading, tags);

    // 4. Clean, spacious field notes (blurb + plain-English systems lore).
    const copy = document.createElement('div');
    copy.className = 'fm-copy';
    const blurb = document.createElement('p');
    blurb.className = 'fm-blurb';
    blurb.textContent = isFound
      ? entry.blurb
      : 'Spot and click this character in the background world while diving through the stack to unlock its entry.';
    copy.append(blurb);

    if (isFound) {
      const lore = document.createElement('p');
      lore.className = 'fm-lore';
      lore.textContent = entry.note;
      copy.append(lore);
    }

    spread.append(portraitBox, dropWrap, headBlock, copy);
    this.bodyEl.replaceChildren(nav, spread);
  }
}
