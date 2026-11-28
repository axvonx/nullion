import type { Question } from '../core/answers';
import { enforce } from '../core/enforce';
import { LAYERS } from '../core/layers';
import { TIERS, TIER_IDS, type TierId } from '../core/tiers';
import { diveLeadMs, diveMs } from '../render/scene';
import { LAYER_ART } from '../layers';
import { FORM_IDS, FORM_NAMES } from '../ui/forms';
import { REVEAL_MS } from '../ui/reveal';
import { tierIcon } from '../ui/tier-icons';
import { manualBookIcon } from '../ui/manual-icon';
import { manualStore } from '../game/manual';
import { computeStats } from '../game/stats';
import glitchMd from '../../writing/debug/glitch.md?raw';
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
  unlock: [
    '  #####  ',
    ' #     # ',
    ' #     # ',
    '         ',
    ' ####### ',
    ' #  +  # ',
    ' # +++ # ',
    ' #  +  # ',
    ' ####### ',
  ],
  'off-by-one': ['         ', ' ###     ', ' #+#     ', ' ###     ', '         ', '    ###  ', '    # #  ', '    ###  ', '         '],
  womm: ['#########', ' #     # ', '  #+++#  ', '   #+#   ', '    #    ', '   # #   ', '  # + #  ', ' # +++ # ', '#########'],
  npe: ['         ', '  #####  ', ' #     # ', '#  +++  #', '# +   + #', '#  +++  #', ' #     # ', '  #####  ', '         '],
  leak: ['    #    ', '    #    ', '   # #   ', '   # #   ', '  #   #  ', ' #  +  # ', ' # +++ # ', '  #   #  ', '   ###   '],
  race: ['         ', '#      + ', '##    ++ ', '###  +++ ', '#### ++++', '###  +++ ', '##    ++ ', '#      + ', '         '],
  heisenbug: ['  #####  ', ' #     # ', '#  + +  #', '#       #', '#       #', '#       #', '#       #', '# # # # #', ' # # # # '],
  bitflip: ['    ###  ', '   ###   ', '  ###    ', ' ####### ', '    ###  ', '   ###   ', '  ##     ', ' #       ', '         '],
  glitch: ['  ###### ', ' #      #', ' #  ++   ', ' #   ++  ', ' #  ++++ ', ' #      #', '  ###### ', '   +   + ', '         '],
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

/**
 * A plausible mixed day's tiers: 33 frames, ending in Kernel (it crosses the syscall boundary). The demo plays them
 * with real answers from the bank, on the live game's prompts (`realAnswer`), never names made up for the rail.
 */
export const SAMPLE_DAY_TIERS: readonly TierId[] = ['race', 'npe', 'heisenbug', 'womm', 'leak', 'bitflip', 'off-by-one'];

export function mountRail(h: DebugHooks) {
  const rail = document.createElement('nav');
  rail.className = 'dbg-rail';
  rail.dataset.ownScroll = '';
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

  function add(id: string, label: string, accent: string, run: () => void, img?: Element) {
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

  /** The live game's prompt for round `i` (a game that has not started borrows its set's prompts). */
  function promptAt(i: number): Question {
    const g = h.game();
    const q = g.rounds[i]?.question ?? g.set.questions[i % g.set.questions.length];
    enforce(q, `rail: no prompt for round ${i}`);
    return q;
  }

  /** A real answer of `tier` to `q` from the live game's set, or of the nearest tier the category has. */
  function realAnswer(q: Question, tier: TierId): { name: string; tier: TierId } {
    const entries = h.game().set.entries(q.id);
    enforce(entries.length > 0, `rail: ${q.id} has no answers`);
    const at = TIER_IDS.indexOf(tier);
    const nearest = [...TIER_IDS].sort((a, b) => Math.abs(TIER_IDS.indexOf(a) - at) - Math.abs(TIER_IDS.indexOf(b) - at));
    for (const t of nearest) {
      const e = entries.find((x) => x.tier === t);
      if (e) return { name: e.name, tier: t };
    }
    throw new Error(`rail: ${q.id} has answers but none in a tier`);
  }

  /** A real answer that has exactly `tier`: the current prompt's if it has one, else any of the set's prompts'. */
  function answerOfTier(tier: TierId): string {
    const g = h.game();
    const p = g.phase;
    const first = 'round' in p ? g.rounds[p.round]!.question : promptAt(0);
    for (const q of [first, ...g.set.questions]) {
      const e = g.set.entries(q.id).find((x) => x.tier === tier);
      if (e) return e.name;
    }
    throw new Error(`rail: no prompt in this game has a ${tier} answer`);
  }

  /** The demo day: each round's prompt with a real answer in (about) the pattern's tier. */
  function sampleDay() {
    return SAMPLE_DAY_TIERS.map((tier, i) => {
      const q = promptAt(i);
      return { q, ...realAnswer(q, tier) };
    });
  }

  add('day', 'Play a sample day: seven real answers, dives, reactions, then the end-of-day replay', 'var(--ok)', () => {
    cancel();
    h.scene.setTarget(0, true);
    const day = sampleDay();
    h.hud.demoBegin(day[0]!.q.prompt);
    let depth = 0;
    let t = 900;
    for (const { tier, name } of day) {
      const f = TIERS[tier].frames;
      later(t, () => {
        depth += f;
        h.scene.diveTo(depth, tier, f, true, () => h.hud.demoReveal(tier, name, f));
      });
      t += diveLeadMs(tier) + diveMs(f) + REVEAL_MS + 600;
    }
    later(t, () => showSampleEndCard(day, depth));
  });

  // Rows carry the live game's prompts (and one of its answers in the right tier, where it has one) so the answer-sheet dropdown works.
  function showSampleEndCard(day: ReturnType<typeof sampleDay>, depth: number) {
    const rows = day.map((d) => ({ question: d.q.id, prompt: d.q.prompt, tier: d.tier, name: d.name }));
    // Made-up lifetime stats so the card's stats block has something to show.
    const days = { 1: { d: 31, t: ['race', 'npe', null, 'womm', 'leak', 'off-by-one', 'npe'] }, 2: { d: 56, t: ['bitflip', 'race', 'heisenbug', 'womm', 'npe', 'leak', 'off-by-one'] } } as const;
    const stats = computeStats(JSON.parse(JSON.stringify(days)), 3);
    h.hud.demoEndOfDay(rows, depth, 0, stats);
  }
  // `?endcard=1` goes straight to the sample day's end card (for looking at it without the three-minute demo).
  if (new URLSearchParams(location.search).has('endcard')) {
    // After the first frame has picked a console form (and the day's categories have loaded).
    window.setTimeout(() => {
      const day = sampleDay();
      const total = day.reduce((n, d) => n + TIERS[d.tier].frames, 0);
      h.hud.demoBegin(day[0]!.q.prompt);
      h.scene.setTarget(total, true);
      window.setTimeout(() => showSampleEndCard(day, total), 600);
    }, 800);
  }

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
    const layer = LAYERS.find((l) => LAYER_ART[l.id].form === form);
    if (!layer) throw new Error(`rail: no layer uses form '${form}'`);
    h.scene.setTarget(layer.from + 0.5);
    if (!h.hud.showsPrompt) h.hud.demoBegin('Name a type of lock');
    formBtn.dataset.tip = `Console form: ${FORM_NAMES[form]} (${formIdx + 1}/${FORM_IDS.length})`;
  });

  // Debug-only Field Manual buttons: open the manual anytime, and toggle unlock-all without mutating saved discoveries.
  add(
    'manual-open',
    'Open Field Manual',
    'var(--signal)',
    () => h.hud.openManual(),
    manualBookIcon(18),
  );
  const manualBtn = add(
    'unlock',
    'Field Manual: unlock all entries (debug toggle)',
    'var(--signal)',
    () => {
      const next = !manualStore.isDebugUnlocked;
      manualStore.setDebugUnlockAll(next);
      manualBtn.classList.toggle('active', next);
      manualBtn.dataset.tip = next
        ? 'Field Manual: ALL UNLOCKED (click to restore normal progress)'
        : 'Field Manual: unlock all entries (debug toggle)';
      manualBtn.title = manualBtn.dataset.tip;
    },
  );

  // Glitch text demo: cycle through writing/debug/glitch.md with ← / → arrow keys.
  const glitchLines = glitchMd
    .split('\n')
    .filter((l) => l.startsWith('- '))
    .map((l) => l.slice(2).trim())
    .filter(Boolean);
  let glitchIdx = 0;
  let glitchOpen = false;
  const showGlitch = () => {
    if (!glitchLines.length) return;
    glitchOpen = true;
    const line = glitchLines[glitchIdx]!;
    h.hud.demoReveal(
      'heisenbug',
      `Glitch ${glitchIdx + 1}/${glitchLines.length} (←/→)`,
      8,
      0,
      () => {
        glitchOpen = false;
      },
      { note: line, glitchForce: true },
    );
  };
  add('glitch', 'Glitch text demo: cycle writing/debug/glitch.md with ← / → arrow keys', 'var(--t-heisenbug)', () => {
    cancel();
    glitchIdx = 0;
    showGlitch();
  });
  window.addEventListener('keydown', (ev) => {
    if (!glitchOpen || ev.target instanceof HTMLInputElement || ev.target instanceof HTMLSelectElement) return;
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') {
      ev.preventDefault();
      glitchIdx = (glitchIdx + 1) % glitchLines.length;
      showGlitch();
    } else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      glitchIdx = (glitchIdx - 1 + glitchLines.length) % glitchLines.length;
      showGlitch();
    } else if (ev.key === ' ') {
      ev.preventDefault();
      showGlitch();
    }
  });

  // Each tier: the full sequence. A dive by its frames, the cursor's reaction and the screen's mirror, then the reveal.
  for (const id of TIER_IDS) {
    const f = TIERS[id].frames;
    add(
      id,
      `${TIERS[id].name}: dive +${f}, its reaction, then the reveal`,
      TIER_COLOR[id],
      () => {
        cancel();
        const name = answerOfTier(id);
        h.scene.diveTo(h.scene.displayDepth + f, id, f, true, () => h.hud.demoReveal(id, name, f));
      },
      tierIcon(id),
    );
  }
}
