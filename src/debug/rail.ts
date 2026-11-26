import { LAYERS } from '../core/layers';
import { TIERS, TIER_IDS, type TierId } from '../core/tiers';
import { diveLeadMs, diveMs } from '../render/scene';
import { FORM_BY_LAYER, FORM_IDS, FORM_NAMES } from '../ui/forms';
import { REVEAL_MS } from '../ui/hud';
import { tierIcon } from '../ui/tier-icons';
import type { DebugHooks } from './menu';

/**
 * Debug build only: demo buttons stacked against the right edge, above the 🐞 toggle.
 * Each plays an animation without needing a real round.
 */

/** 9×9 pixel icons: '#' is ink, '+' is accent, anything else is empty. */
const ICONS: Record<string, string[]> = {
  timer: [
    '  #####  ',
    ' #  #  # ',
    '#   #   #',
    '#   #   #',
    '#   ++  #',
    '#       #',
    '#       #',
    ' #     # ',
    '  #####  ',
  ],
  sink: [
    '    #    ',
    '    #    ',
    '    #    ',
    '  # # #  ',
    '   ###   ',
    '    #    ',
    '         ',
    '+++++++++',
    '+ + + + +',
  ],
  day: [
    '#########',
    '#+#+#+#+#',
    '#########',
    '#       #',
    '# ##### #',
    '#       #',
    '# ###   #',
    '#       #',
    '#########',
  ],
  form: [
    '#########',
    '#+++++++#',
    '#########',
    '#       #',
    '# ##### #',
    '#       #',
    '#  ##+  #',
    '#       #',
    '#########',
  ],
  reroll: [
    '#########',
    '#       #',
    '# +   + #',
    '#       #',
    '#   +   #',
    '#       #',
    '# +   + #',
    '#       #',
    '#########',
  ],
  'off-by-one': ['         ', ' ###     ', ' #+#     ', ' ###     ', '         ', '    ###  ', '    # #  ', '    ###  ', '         '],
  womm: ['#########', ' #     # ', '  #+++#  ', '   #+#   ', '    #    ', '   # #   ', '  # + #  ', ' # +++ # ', '#########'],
  npe: ['         ', '  #####  ', ' #     # ', '#  +++  #', '# +   + #', '#  +++  #', ' #     # ', '  #####  ', '         '],
  leak: ['    #    ', '    #    ', '   # #   ', '   # #   ', '  #   #  ', ' #  +  # ', ' # +++ # ', '  #   #  ', '   ###   '],
  race: ['         ', '#      + ', '##    ++ ', '###  +++ ', '#### ++++', '###  +++ ', '##    ++ ', '#      + ', '         '],
  heisenbug: ['  #####  ', ' #     # ', '#  + +  #', '#       #', '#       #', '#       #', '#       #', '# # # # #', ' # # # # '],
  bitflip: ['    ###  ', '   ###   ', '  ###    ', ' ####### ', '    ###  ', '   ###   ', '  ##     ', ' #       ', '         '],
};

function icon(rows: string[], accent: string): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 9 9');
  svg.setAttribute('width', '18');
  svg.setAttribute('height', '18');
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch !== '#' && ch !== '+') continue;
      const r = document.createElementNS(ns, 'rect');
      r.setAttribute('x', String(x));
      r.setAttribute('y', String(y));
      r.setAttribute('width', '1');
      r.setAttribute('height', '1');
      r.setAttribute('fill', ch === '#' ? 'currentColor' : accent);
      svg.append(r);
    }
  });
  return svg;
}

const TIER_COLOR: Record<TierId, string> = {
  'off-by-one': 'var(--t-offbyone)',
  womm: 'var(--t-womm)',
  npe: 'var(--t-npe)',
  leak: 'var(--t-leak)',
  race: 'var(--t-race)',
  heisenbug: 'var(--t-heisenbug)',
  bitflip: 'var(--t-bitflip)',
};

/** A plausible mixed day: seven accepted answers, 33 frames, ending in Kernel (it crosses the syscall boundary). */
export const SAMPLE_DAY: { tier: TierId; name: string }[] = [
  { tier: 'race', name: 'mutex' },
  { tier: 'npe', name: 'spinlock' },
  { tier: 'heisenbug', name: 'seqlock' },
  { tier: 'womm', name: 'file lock' },
  { tier: 'leak', name: 'RCU' },
  { tier: 'bitflip', name: 'futex' },
  { tier: 'off-by-one', name: 'semaphore' },
];

export function mountRail(h: DebugHooks) {
  const rail = document.createElement('nav');
  rail.className = 'dbg-rail';
  rail.setAttribute('aria-label', 'Debug demos');
  document.body.append(rail);
  // The rail covers the right edge (right: 16px + 36px buttons, see menu.css): v4 keeps entities out from under it.
  h.scene.uiReserveRightCss = 60;

  // Only one demo at a time: starting another cancels the pending steps of the last.
  let timers: number[] = [];
  const cancel = () => {
    for (const t of timers) clearTimeout(t);
    timers = [];
    h.hud.watchdogOverride = undefined;
  };
  const later = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

  function add(id: string, label: string, accent: string, run: () => void, img?: HTMLElement) {
    const rows = ICONS[id];
    if (!rows && !img) throw new Error(`rail: no icon '${id}'`);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dbg-rail-btn';
    b.title = label;
    b.setAttribute('aria-label', label);
    b.dataset.tip = label;
    b.append(img ?? icon(rows!, accent));
    b.addEventListener('click', run);
    rail.append(b);
    return b;
  }

  add('timer', 'Timer demo: full watchdog countdown into the low-time state', 'var(--fault)', () => {
    cancel();
    const ms = 7000;
    const start = performance.now();
    h.hud.watchdogOverride = (now) => Math.max(0, 1 - (now - start) / ms);
    later(ms, () => h.hud.bark());
    later(ms + 900, cancel);
  });

  add('sink', 'Sink demo: a perfect day’s dives (7 × 13) through every boundary to Ring −3, then back up', 'var(--signal)', () => {
    cancel();
    h.scene.setTarget(0, true);
    let depth = 0;
    let t = 300;
    for (let k = 0; k < 7; k++) {
      later(t, () => {
        depth += 13;
        h.scene.diveTo(depth, 'bitflip', 13, false);
      });
      t += diveMs(13) + 500;
    }
    later(t + 1000, () => h.scene.setTarget(0));
  });

  add('day', 'Play a sample day: seven answers, dives, reactions, then the end-of-day replay', 'var(--ok)', () => {
    cancel();
    h.scene.setTarget(0, true);
    h.hud.demoBegin('name_a(type_of_lock)', 'Name a type of lock');
    let depth = 0;
    let t = 900;
    for (const { tier, name } of SAMPLE_DAY) {
      const f = TIERS[tier].frames;
      later(t, () => {
        depth += f;
        h.hud.demoLanded(tier, name, f);
        h.scene.diveTo(depth, tier, f, true, () => h.hud.demoReveal(tier, name, f));
      });
      t += diveLeadMs(tier) + diveMs(f) + REVEAL_MS + 600;
    }
    later(t, () => h.hud.endOfDay(SAMPLE_DAY, depth, 0));
  });

  // v4's world is seeded once (by the day). Reroll it to see other arrangements; ?seed=N brings one back.
  const rerollBtn = add('reroll', `Reroll the v4 world (seed ${h.scene.seed}; reload with ?seed=N to keep one)`, 'var(--signal)', () => {
    const seed = Math.floor(Math.random() * 1_000_000);
    h.scene.setWorldSeed(seed);
    rerollBtn.dataset.tip = `World seed ${seed}: reload with ?seed=${seed} to keep it`;
    rerollBtn.title = rerollBtn.dataset.tip;
  });

  // Cycles the console through every layer form (and moves the scene there), then back to following the layer.
  let formIdx = -1;
  const formBtn = add('form', 'Preview the next console form (cycles every layer idiom, then back to auto)', 'var(--signal)', () => {
    formIdx = formIdx + 1 < FORM_IDS.length ? formIdx + 1 : -1;
    if (formIdx < 0) {
      h.hud.formOverride = undefined;
      formBtn.dataset.tip = 'Console form: following the layer';
      return;
    }
    const form = FORM_IDS[formIdx]!;
    h.hud.formOverride = form;
    const layer = LAYERS.find((l) => FORM_BY_LAYER[l.id] === form);
    if (!layer) throw new Error(`rail: no layer uses form '${form}'`);
    h.scene.setTarget(layer.from + 0.5);
    if (!h.hud.showsPrompt) h.hud.demoBegin('name_a(type_of_lock)', 'Name a type of lock');
    formBtn.dataset.tip = `Console form: ${FORM_NAMES[form]} (${formIdx + 1}/${FORM_IDS.length})`;
  });

  // Each tier: the full sequence. A dive by its frames, the cursor's reaction and the screen's mirror, then the reveal.
  for (const id of TIER_IDS) {
    const f = TIERS[id].frames;
    const name = SAMPLE_DAY.find((d) => d.tier === id)?.name ?? TIERS[id].name;
    add(
      id,
      `${TIERS[id].name}: dive +${f}, its reaction, then the reveal`,
      TIER_COLOR[id],
      () => {
        cancel();
        h.scene.diveTo(h.scene.displayDepth + f, id, f, true, () => h.hud.demoReveal(id, name, f));
      },
      tierIcon(id),
    );
  }
}
