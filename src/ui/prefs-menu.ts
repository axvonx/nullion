import { enforce } from '../core/enforce';
import { prefs, type Prefs } from '../prefs';

/**
 * Player settings (in production, unlike the 🐞 debug menu): a gear chip in the header that opens a small popover.
 * Each setting is a row in PREF_CONTROLS; add one there and it appears, bound to the prefs store.
 */

interface ChoiceControl<K extends keyof Prefs> {
  key: K;
  label: string;
  options: { value: Prefs[K]; label: string; hint: string }[];
}

const PREF_CONTROLS: ChoiceControl<keyof Prefs>[] = [
  {
    key: 'autocorrect',
    label: 'Typo correction',
    options: [
      { value: 'confirm', label: 'Ask first', hint: 'Shows the corrected spelling; press Enter to submit it.' },
      { value: 'auto', label: 'Auto-submit', hint: 'Submits the corrected spelling straight away.' },
    ],
  },
];

/** 9×9 pixel gear, the same build as the debug rail's icons. */
const GEAR = ['   # #   ', ' ####### ', ' ##   ## ', '##  #  ##', ' # ### # ', '##  #  ##', ' ##   ## ', ' ####### ', '   # #   '];

function gearIcon(): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 9 9');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '18');
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  GEAR.forEach((row, y) => {
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

/** Mount the gear chip into `slot` and its popover into `root`. */
export function mountPrefsMenu(root: HTMLElement, slot: HTMLElement) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'chip prefs-btn float';
  btn.setAttribute('aria-label', 'Settings');
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'prefs-pop');
  btn.append(gearIcon());

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

  const setOpen = (open: boolean) => {
    pop.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
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

  slot.append(btn);
  root.append(pop);
}
