import { persisted } from './store';
import { prefs } from './prefs';

/**
 * Visual alternatives, switchable live from the debug menu.
 * To draft a new alternative: add an option here, then branch on it where the look is drawn.
 * The debug menu builds its controls from this table, so nothing else needs wiring.
 */
export const LOOK_SLOTS = {
  artStyle: {
    label: 'Layer art',
    options: { v4: 'Seeded entity world (v4)', v3: 'Mixed small props (v3)', v2: 'Detailed places (v2)', v1: 'Flat components (v1)' },
    default: 'v4',
  },
  layerName: {
    label: 'Layer names',
    options: { watermark: 'Watermark in the world', card: 'Entrance card (old)' },
    default: 'watermark',
  },
  cursor: {
    label: 'Cursor',
    options: { evolving: 'Changes with layer', arrow: 'Always arrow', block: 'Always block', bit: 'Always bit' },
    default: 'evolving',
  },
  palette: {
    label: 'Color depth',
    options: { 'per-layer': 'Drops as you descend', full: 'Always full color' },
    default: 'per-layer',
  },
  dither: {
    label: 'Low-color dithering',
    options: { bayer: 'Ordered (Bayer)', none: 'Hard threshold' },
    default: 'bayer',
  },
  rain: {
    label: 'Rain (kernel and below)',
    options: { hex: 'Hexdump', matrix: 'Matrix glyphs', off: 'Off' },
    default: 'off',
  },
  scanlines: {
    label: 'Scanlines',
    options: { auto: 'Kernel and below', always: 'Everywhere', off: 'Off' },
    default: 'auto',
  },
  tearing: {
    label: 'Layer-crossing effects (tear, mirror, freeze, 1-bit)',
    options: { on: 'On', off: 'Off' },
    default: 'on',
  },
  ghosting: {
    label: 'Ghosting in Ring −1',
    options: { on: 'On', off: 'Off' },
    default: 'on',
  },
  freeze: {
    label: 'Ring −2 freezes time',
    options: { on: 'On', off: 'Off' },
    default: 'on',
  },
  motion: {
    label: 'Motion',
    options: { system: 'Follow system setting', full: 'Full', reduced: 'Reduced' },
    default: 'system',
  },
} as const;

export type LookSlot = keyof typeof LOOK_SLOTS;
export type LookValue<S extends LookSlot> = keyof (typeof LOOK_SLOTS)[S]['options'];
type LookState = { [S in LookSlot]: LookValue<S> };

const defaults = Object.fromEntries(Object.entries(LOOK_SLOTS).map(([k, v]) => [k, v.default])) as LookState;

/**
 * Bumped when look defaults change meaningfully (v3 art, rain off; v4 art), so saved choices from older builds don't
 * mask the new defaults. Old choices are dropped: they are debug preferences, not player data.
 */
export const looks = persisted<LookState>('nullion.looks.3', defaults);

// A saved value an older build allowed but this one doesn't (an option was renamed or removed) is expected
// stale storage: replace it with the slot's default, and say so.
{
  const cur = looks.get() as Record<string, unknown>;
  const stale = (Object.keys(LOOK_SLOTS) as LookSlot[]).filter((k) => !(String(cur[k]) in LOOK_SLOTS[k].options));
  if (stale.length) {
    console.warn(`looks: resetting stale saved values for ${stale.join(', ')}`);
    looks.set(Object.fromEntries(stale.map((k) => [k, LOOK_SLOTS[k].default])) as Partial<LookState>);
  }
}

export function look<S extends LookSlot>(slot: S): LookValue<S> {
  return looks.get()[slot];
}

const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : undefined;

/** Flashes, tearing, rain, flicker, cursor sway and floating panels are off (static) when this is true. */
export function reducedMotion(): boolean {
  const m = look('motion');
  if (m === 'reduced') return true;
  if (m === 'full') return false;
  const p = prefs.get().motion;
  if (p === 'reduced') return true;
  if (p === 'full') return false;
  return mq?.matches ?? false;
}
