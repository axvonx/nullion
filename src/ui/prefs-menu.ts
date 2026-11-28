import { VERSION_LABEL } from '../version';
import { enforce } from '../core/enforce';
import { prefs, type Prefs } from '../prefs';
import { sound } from '../audio/sound';
import { clearMisses, loadMisses, missesMarkdown } from '../game/misses';
import { browserStorage } from '../game/daily-save';

/**
 * Player settings (in production, unlike the 🐞 debug menu): a gear chip and quick mute button in the header.
 * Each setting is a row in PREF_CONTROLS; add one there and it appears, bound to the prefs store.
 */

interface ChoiceControl<K extends keyof Prefs> {
  key: K;
  label: string;
  options: { value: Prefs[K]; label: string; hint: string }[];
}

const PREF_CONTROLS: ChoiceControl<keyof Prefs>[] = [
  {
    key: 'sound',
    label: 'Sound',
    options: [
      { value: 'full', label: 'Full', hint: 'Chiptune SFX plus subtle layer ambience and daily pulse.' },
      { value: 'sfx', label: 'SFX only', hint: 'Blips, dives, and tier stings; dead quiet between prompts.' },
      { value: 'off', label: 'Muted', hint: 'All sound effects and ambience are silenced.' },
    ],
  },
  {
    key: 'volume',
    label: 'Volume',
    options: [
      { value: 'low', label: 'Low', hint: 'Quiet background level.' },
      { value: 'medium', label: 'Medium', hint: 'Balanced default level.' },
      { value: 'high', label: 'High', hint: 'Full punchy arcade level.' },
    ],
  },
  {
    key: 'autocorrect',
    label: 'Typo correction',
    options: [
      { value: 'confirm', label: 'Ask first', hint: 'Shows the corrected spelling; press Enter to submit it.' },
      { value: 'auto', label: 'Auto-submit', hint: 'Submits the corrected spelling straight away.' },
    ],
  },
  {
    key: 'motion',
    label: 'Motion',
    options: [
      { value: 'system', label: 'System', hint: 'Follows your OS reduced-motion setting.' },
      { value: 'full', label: 'Full', hint: 'All glitches, shakes, speedlines, and floating panels.' },
      { value: 'reduced', label: 'Reduced', hint: 'Static panels, calm fades, no shakes or flashes.' },
    ],
  },
];

/** 9×9 pixel icons, the same build as the debug rail's icons. */
const GEAR = ['   # #   ', ' ####### ', ' ##   ## ', '##  #  ##', ' # ### # ', '##  #  ##', ' ##   ## ', ' ####### ', '   # #   '];
const SPEAKER_ON = [
  '    #  # ',
  '   ##   #',
  '##### # #',
  '##### # #',
  '##### # #',
  '##### # #',
  '##### # #',
  '   ##   #',
  '    #  # ',
];
const SPEAKER_OFF = [
  '    #    ',
  '   ##    ',
  '##### # #',
  '#####  # ',
  '##### # #',
  '#####    ',
  '#####    ',
  '   ##    ',
  '    #    ',
];

function pixelIcon(rows: readonly string[]): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 9 9');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '18');
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

/** Mount the gear chip, quick mute chip, and settings popover. */
export function mountPrefsMenu(root: HTMLElement, slot: HTMLElement) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'chip prefs-btn float';
  btn.setAttribute('aria-label', 'Settings');
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'prefs-pop');
  btn.append(pixelIcon(GEAR));

  // One-click sound mute/unmute chip beside the gear button.
  const muteBtn = document.createElement('button');
  muteBtn.type = 'button';
  muteBtn.className = 'chip prefs-btn sound-btn float';
  let lastActiveMode: 'full' | 'sfx' = 'full';
  const syncMute = () => {
    const mode = prefs.get().sound;
    const on = mode !== 'off';
    if (on) lastActiveMode = mode;
    muteBtn.replaceChildren(pixelIcon(on ? SPEAKER_ON : SPEAKER_OFF));
    muteBtn.setAttribute('aria-label', on ? 'Mute sound' : 'Unmute sound');
    muteBtn.setAttribute('aria-pressed', String(!on));
    muteBtn.title = on ? `Sound: ${mode} (click to mute)` : 'Sound muted (click to unmute)';
    muteBtn.classList.toggle('muted', !on);
  };
  muteBtn.addEventListener('click', () => {
    const next = prefs.get().sound === 'off' ? lastActiveMode : 'off';
    prefs.set({ sound: next });
    sound.setMode(next);
    if (next !== 'off') {
      sound.unlock();
      sound.unwind('application');
    }
  });
  syncMute();
  prefs.subscribe(syncMute);

  const pop = document.createElement('div');
  pop.id = 'prefs-pop';
  pop.className = 'prefs-pop panel';
  pop.setAttribute('role', 'dialog');
  pop.setAttribute('aria-label', 'Settings');
  pop.hidden = true;
  const title = document.createElement('div');
  title.className = 'prefs-title';
  title.textContent = 'Settings';
  pop.append(title);

  for (const c of PREF_CONTROLS) {
    const fs = document.createElement('fieldset');
    fs.className = 'prefs-group';
    const lg = document.createElement('legend');
    lg.textContent = c.label;
    fs.append(lg);
    const hint = document.createElement('p');
    hint.className = 'prefs-hint';
    const sync = () => {
      const v = prefs.get()[c.key];
      const opt = c.options.find((o) => o.value === v);
      enforce(opt, `prefs: ${String(c.key)} has no option '${String(v)}'`);
      hint.textContent = opt.hint;
      for (const input of fs.querySelectorAll<HTMLInputElement>('input')) input.checked = input.value === v;
    };
    for (const o of c.options) {
      const label = document.createElement('label');
      label.className = 'prefs-opt';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `pref-${String(c.key)}`;
      input.value = String(o.value);
      input.addEventListener('change', () => {
        if (input.checked) prefs.set({ [c.key]: o.value } as Partial<Prefs>);
      });
      label.append(input, ` ${o.label}`);
      fs.append(label);
    }
    fs.append(hint);
    pop.append(fs);
    sync();
    prefs.subscribe(sync);
  }
  // Missed guesses: the device's log of rejected guesses (src/game/misses.ts), copied out for scripts/bank/misses.py.
  const misses = document.createElement('fieldset');
  misses.className = 'prefs-group prefs-misses';
  const mLegend = document.createElement('legend');
  mLegend.textContent = 'Missed guesses';
  const mCount = document.createElement('p');
  mCount.className = 'prefs-hint';
  const mCopy = document.createElement('button');
  mCopy.type = 'button';
  mCopy.className = 'prefs-action';
  mCopy.textContent = 'Copy';
  const mClear = document.createElement('button');
  mClear.type = 'button';
  mClear.className = 'prefs-action';
  mClear.textContent = 'Clear';
  const syncMisses = () => {
    const l = loadMisses(browserStorage());
    if (l.kind === 'invalid') {
      mCount.textContent = `Log reset: ${l.reason}.`;
      return [];
    }
    const total = l.misses.reduce((n, m) => n + m.n, 0);
    mCount.textContent = l.misses.length
      ? `${l.misses.length} distinct (${total} guesses) kept on this device. Copy them to report answers the game missed.`
      : 'None yet: guesses the game rejects are kept here, on this device only.';
    mCopy.disabled = mClear.disabled = l.misses.length === 0;
    return l.misses;
  };
  mCopy.addEventListener('click', async () => {
    const md = missesMarkdown(syncMisses(), new Date());
    try {
      await navigator.clipboard.writeText(md);
      mCopy.textContent = 'Copied ✓';
    } catch (e) {
      mCopy.textContent = 'Copy failed';
      mCount.textContent = `Could not copy (${e instanceof Error ? e.message : String(e)}).`;
    }
    window.setTimeout(() => (mCopy.textContent = 'Copy'), 1600);
  });
  mClear.addEventListener('click', () => {
    clearMisses(browserStorage());
    syncMisses();
  });
  const mRow = document.createElement('div');
  mRow.className = 'prefs-actions';
  mRow.append(mCopy, mClear);
  misses.append(mLegend, mCount, mRow);
  pop.append(misses);

  const build = document.createElement('div');
  build.className = 'build-tag prefs-build';
  build.textContent = VERSION_LABEL;
  pop.append(build);

  const setOpen = (open: boolean) => {
    pop.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (open) syncMisses();
    if (open) pop.querySelector<HTMLInputElement>('input:checked')?.focus();
  };
  btn.addEventListener('click', () => setOpen(pop.hidden !== false));
  pop.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape') return;
    setOpen(false);
    btn.focus();
  });
  // A click or tap anywhere else closes it.
  document.addEventListener('pointerdown', (ev) => {
    if (!pop.hidden && ev.target instanceof Node && !pop.contains(ev.target) && !btn.contains(ev.target)) setOpen(false);
  });

  slot.append(btn, muteBtn);
  root.append(pop);
}
