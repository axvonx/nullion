import { VERSION_LABEL } from '../version';
import { enforce } from '../core/enforce';
import { prefs, type Prefs } from '../prefs';
import { normalizeVolume, sound, type VolumeLevel } from '../audio/sound';
import { clearMisses, loadMisses, missesMarkdown } from '../game/misses';
import { browserStorage } from '../game/daily-save';
import { createModal } from './modal';

/**
 * Player settings (docs/ui-style.md §5–§6): a stacked `⚙` icon key in the top-right header that opens a unified
 * Windowed Modal containing status-displaying popped-frame switches, a 4-bar hardware volume meter, and the
 * device's Missed Guesses utility row.
 */

type ThumbTone = 'amber' | 'sys' | 'ok' | 'dim' | 'fault';

interface SwitchStop<V> {
  value: V;
  label: string;
  tone: ThumbTone;
  hint: string;
}

interface SwitchDef<K extends 'sound' | 'autocorrect' | 'motion'> {
  key: K;
  title: string;
  stops: readonly SwitchStop<Prefs[K]>[];
}

const SOUND_SWITCH: SwitchDef<'sound'> = {
  key: 'sound',
  title: 'Sound',
  stops: [
    { value: 'off', label: 'MUTE', tone: 'fault', hint: 'All sound effects and layer ambience silenced.' },
    { value: 'sfx', label: 'SFX', tone: 'ok', hint: 'Blips, dives, and tier stings; quiet between prompts.' },
    { value: 'full', label: 'FULL', tone: 'amber', hint: 'Chiptune SFX plus subtle layer ambience.' },
  ],
};

const AUTOCORRECT_SWITCH: SwitchDef<'autocorrect'> = {
  key: 'autocorrect',
  title: 'Typo correction',
  stops: [
    { value: 'confirm', label: 'ASK', tone: 'sys', hint: 'Shows the corrected spelling; press Enter to submit.' },
    { value: 'auto', label: 'AUTO', tone: 'amber', hint: 'Submits obvious typo fixes straight away.' },
  ],
};

const MOTION_SWITCH: SwitchDef<'motion'> = {
  key: 'motion',
  title: 'Motion',
  stops: [
    { value: 'reduced', label: 'CALM', tone: 'dim', hint: 'Static panels, calm fades, no shakes or flashes.' },
    { value: 'system', label: 'SYS', tone: 'sys', hint: 'Follows your OS reduced-motion setting.' },
    { value: 'full', label: 'FULL', tone: 'amber', hint: 'All glitches, shakes, speedlines, and floating panels.' },
  ],
};

const VOLUME_STEPS: readonly { level: VolumeLevel; pct: string; heightPx: number }[] = [
  { level: 1, pct: '25%', heightPx: 10 },
  { level: 2, pct: '50%', heightPx: 14 },
  { level: 3, pct: '75%', heightPx: 18 },
  { level: 4, pct: '100%', heightPx: 22 },
];

/** 9×9 pixel gear icon matching the header's crisp bitmap language. */
const GEAR = ['   # #   ', ' ####### ', ' ##   ## ', '##  #  ##', ' # ### # ', '##  #  ##', ' ##   ## ', ' ####### ', '   # #   '];

function pixelIcon(rows: readonly string[]): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 9 9');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== '#') continue;
      const r = document.createElementNS(ns, 'rect');
      r.setAttribute('x', String(x));
      r.setAttribute('y', String(y));
      r.setAttribute('width', '1');
      r.setAttribute('height', '1');
      r.setAttribute('fill', 'currentColor');
      svg.append(r);
    }
  });
  return svg;
}

function buildSwitchRow<K extends 'sound' | 'autocorrect' | 'motion'>(def: SwitchDef<K>): HTMLElement {
  const row = document.createElement('div');
  row.className = 'settings-row';

  const info = document.createElement('div');
  info.className = 'settings-info';
  const title = document.createElement('div');
  title.className = 'settings-name';
  title.textContent = def.title;
  const desc = document.createElement('p');
  desc.className = 'settings-desc';
  info.append(title, desc);

  const sw = document.createElement('div');
  sw.className = 'ui-switch';
  sw.dataset.stops = String(def.stops.length);
  sw.dataset.pref = def.key;
  sw.setAttribute('role', 'radiogroup');
  sw.setAttribute('aria-label', def.title);

  const thumb = document.createElement('div');
  thumb.className = 'ks-thumb';
  thumb.setAttribute('aria-hidden', 'true');
  sw.append(thumb);

  const buttons: HTMLButtonElement[] = [];
  const selectIndex = (idx: number) => {
    const stop = def.stops[idx];
    enforce(stop, `prefs-menu: invalid stop index ${idx} for ${def.key}`);
    prefs.set({ [def.key]: stop.value } as Partial<Prefs>);
    if (def.key === 'sound') {
      const mode = stop.value as Prefs['sound'];
      sound.setMode(mode);
      if (mode !== 'off') sound.unlock();
    }
  };

  def.stops.forEach((stop, idx) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'ks-stop';
    b.setAttribute('role', 'radio');
    b.dataset.i = String(idx);
    b.dataset.value = String(stop.value);
    b.textContent = stop.label;
    b.addEventListener('click', () => selectIndex(idx));
    b.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') {
        ev.preventDefault();
        const next = (idx + 1) % def.stops.length;
        selectIndex(next);
        buttons[next]!.focus();
      } else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') {
        ev.preventDefault();
        const next = (idx - 1 + def.stops.length) % def.stops.length;
        selectIndex(next);
        buttons[next]!.focus();
      }
    });
    buttons.push(b);
    sw.append(b);
  });

  const sync = () => {
    const val = prefs.get()[def.key];
    const idx = def.stops.findIndex((s) => s.value === val);
    enforce(idx >= 0, `prefs: ${def.key} has no stop for '${String(val)}'`);
    const stop = def.stops[idx]!;
    sw.dataset.pos = String(idx);
    thumb.dataset.tone = stop.tone;
    thumb.textContent = stop.label;
    desc.textContent = stop.hint;
    buttons.forEach((b, i) => {
      const checked = i === idx;
      b.setAttribute('aria-checked', String(checked));
      b.tabIndex = checked ? 0 : -1;
    });
  };

  sync();
  prefs.subscribe(sync);

  row.append(info, sw);
  return row;
}

function buildVolumeRow(): HTMLElement {
  const row = document.createElement('div');
  row.className = 'settings-row';

  const info = document.createElement('div');
  info.className = 'settings-info';
  const title = document.createElement('div');
  title.className = 'settings-name';
  title.textContent = 'Volume';
  const desc = document.createElement('p');
  desc.className = 'settings-desc';
  desc.textContent = 'Master chiptune & ambience level.';
  info.append(title, desc);

  const meter = document.createElement('div');
  meter.className = 'ui-vol-meter';
  meter.dataset.pref = 'volume';
  meter.setAttribute('role', 'radiogroup');
  meter.setAttribute('aria-label', 'Volume');

  const bars: HTMLButtonElement[] = [];
  const pctEl = document.createElement('span');
  pctEl.className = 'vol-pct';

  const selectLevel = (level: VolumeLevel) => {
    prefs.set({ volume: level });
    sound.setVolume(level);
  };

  VOLUME_STEPS.forEach((step, idx) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'vol-bar';
    b.setAttribute('role', 'radio');
    b.dataset.lvl = String(step.level);
    b.style.height = `${step.heightPx}px`;
    b.setAttribute('aria-label', step.pct);
    b.addEventListener('click', () => selectLevel(step.level));
    b.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowUp') {
        ev.preventDefault();
        const next = Math.min(VOLUME_STEPS.length - 1, idx + 1);
        selectLevel(VOLUME_STEPS[next]!.level);
        bars[next]!.focus();
      } else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowDown') {
        ev.preventDefault();
        const next = Math.max(0, idx - 1);
        selectLevel(VOLUME_STEPS[next]!.level);
        bars[next]!.focus();
      }
    });
    bars.push(b);
    meter.append(b);
  });

  meter.append(pctEl);

  const sync = () => {
    const p = prefs.get();
    const lvl = normalizeVolume(p.volume);
    const muted = p.sound === 'off';
    meter.classList.toggle('is-muted', muted);
    const step = VOLUME_STEPS.find((s) => s.level === lvl) ?? VOLUME_STEPS[2]!;
    pctEl.textContent = muted ? 'OFF' : step.pct;
    bars.forEach((b, i) => {
      const s = VOLUME_STEPS[i]!;
      const checked = s.level === lvl;
      b.classList.toggle('lit', s.level <= lvl);
      b.setAttribute('aria-checked', String(checked));
      b.tabIndex = checked ? 0 : -1;
    });
  };

  sync();
  prefs.subscribe(sync);

  row.append(info, meter);
  return row;
}

/** Mount the top-right Settings `⚙` icon key and its unified Windowed Modal. */
export function mountPrefsMenu(root: HTMLElement, slot: HTMLElement) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'ui-key ui-key--icon prefs-btn float';
  btn.setAttribute('aria-label', 'Settings');
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'prefs-pop');
  btn.append(pixelIcon(GEAR));

  let syncMisses: () => void = () => {};

  const modal = createModal(root, {
    id: 'prefs-pop',
    title: 'Settings',
    dialogClass: 'prefs-pop',
    backdropClass: 'prefs-modal',
    onOpen: () => {
      btn.setAttribute('aria-expanded', 'true');
      syncMisses();
    },
    onClose: () => {
      btn.setAttribute('aria-expanded', 'false');
    },
    initialFocus: () => modal.body.querySelector<HTMLElement>('.ks-stop[aria-checked="true"]'),
  });

  modal.body.append(
    buildSwitchRow(SOUND_SWITCH),
    buildVolumeRow(),
    buildSwitchRow(AUTOCORRECT_SWITCH),
    buildSwitchRow(MOTION_SWITCH),
  );

  // Compact Missed Guesses utility row (src/game/misses.ts)
  const missesRow = document.createElement('div');
  missesRow.className = 'settings-row settings-misses';
  const mInfo = document.createElement('div');
  mInfo.className = 'settings-info';
  const mTitle = document.createElement('div');
  mTitle.className = 'settings-name';
  mTitle.textContent = 'Missed guesses';
  const mCount = document.createElement('p');
  mCount.className = 'settings-desc';
  mInfo.append(mTitle, mCount);

  const mCopy = document.createElement('button');
  mCopy.type = 'button';
  mCopy.className = 'ui-key ui-key--secondary prefs-action';
  mCopy.textContent = 'Copy';
  const mClear = document.createElement('button');
  mClear.type = 'button';
  mClear.className = 'ui-key ui-key--quiet prefs-action';
  mClear.textContent = 'Clear';

  const readMisses = () => {
    const l = loadMisses(browserStorage());
    if (l.kind === 'invalid') {
      mCount.textContent = `Log reset: ${l.reason}.`;
      mCopy.disabled = mClear.disabled = true;
      return [];
    }
    const total = l.misses.reduce((n, m) => n + m.n, 0);
    mCount.textContent = l.misses.length
      ? `${l.misses.length} distinct (${total} guesses) stored on this device.`
      : 'None yet: rejected guesses stay on this device only.';
    mCopy.disabled = mClear.disabled = l.misses.length === 0;
    return l.misses;
  };
  syncMisses = () => {
    readMisses();
  };

  mCopy.addEventListener('click', async () => {
    const md = missesMarkdown(readMisses(), new Date());
    try {
      await navigator.clipboard.writeText(md);
      mCopy.textContent = 'Copied ✓';
    } catch (e) {
      mCopy.textContent = 'Failed';
      mCount.textContent = `Could not copy (${e instanceof Error ? e.message : String(e)}).`;
    }
    window.setTimeout(() => (mCopy.textContent = 'Copy'), 1600);
  });
  mClear.addEventListener('click', () => {
    clearMisses(browserStorage());
    readMisses();
  });

  const mActions = document.createElement('div');
  mActions.className = 'prefs-actions';
  mActions.append(mCopy, mClear);
  missesRow.append(mInfo, mActions);
  modal.body.append(missesRow);

  const foot = document.createElement('div');
  foot.className = 'settings-foot';
  const build = document.createElement('div');
  build.className = 'build-tag prefs-build';
  build.textContent = VERSION_LABEL;
  foot.append(build);
  modal.body.append(foot);

  btn.addEventListener('click', () => modal.toggle(btn));
  slot.append(btn);
}
