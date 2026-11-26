import { TIERS, TIER_IDS, type TierId } from '../core/tiers';
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

/** A plausible mixed day: seven accepted answers, 44 frames, ending in Firmware. */
export const SAMPLE_DAY: TierId[] = ['race', 'npe', 'heisenbug', 'leak', 'bitflip', 'off-by-one', 'heisenbug'];

export function mountRail(h: DebugHooks) {
  const rail = document.createElement('nav');
  rail.className = 'dbg-rail';
  rail.setAttribute('aria-label', 'Debug demos');
  document.body.append(rail);

  // Only one demo at a time: starting another cancels the pending steps of the last.
  let timers: number[] = [];
  const cancel = () => {
    for (const t of timers) clearTimeout(t);
    timers = [];
    h.hud.watchdogOverride = undefined;
  };
  const later = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

  function add(id: string, label: string, accent: string, run: () => void) {
    const rows = ICONS[id];
    if (!rows) throw new Error(`rail: no icon '${id}'`);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'dbg-rail-btn';
    b.title = label;
    b.setAttribute('aria-label', label);
    b.dataset.tip = label;
    b.append(icon(rows, accent));
    b.addEventListener('click', run);
    rail.append(b);
  }

  add('timer', 'Timer demo: full watchdog countdown into the low-time state', 'var(--fault)', () => {
    cancel();
    const ms = 7000;
    const start = performance.now();
    h.hud.watchdogOverride = (now) => Math.max(0, 1 - (now - start) / ms);
    later(ms + 900, cancel);
  });

  add('sink', 'Sink demo: a sample day’s descent, then back up', 'var(--signal)', () => {
    cancel();
    const base = h.scene.displayDepth;
    let depth = base;
    SAMPLE_DAY.forEach((id, i) => {
      later(i * 1400, () => {
        depth += TIERS[id].frames;
        h.scene.react(id);
        h.scene.setTarget(depth);
      });
    });
    later(SAMPLE_DAY.length * 1400 + 1800, () => h.scene.setTarget(base));
  });

  for (const id of TIER_IDS) add(id, `Reaction: ${TIERS[id].name}`, TIER_COLOR[id], () => h.scene.react(id));
}
