import { enforce } from '../../core/enforce';
import { type StackMode } from '../../core/layers';
import { layersFor } from '../../core/modes';
import { gateFor } from '../../game/rarity';
import { LAYER_ART } from '../../layers';
import { V4_LIBRARIES } from './libraries';
import { placeBand, type LayerPlacement, type PlaceGeom, type Rect } from './place';

/** Rows the upper layer frays down over the lower one (same as art-common's SEAM_H; kept here so this stays DOM-free). */
const SEAM_ROWS = 14;

export interface WorldSpecV4 {
  /** Stack mode ('daily' = 10 layers, 'endless' = 29 layers). Defaults to 'daily'. */
  mode?: StackMode;
  /** Canonical seed for major anchor set pieces (e.g. daily puzzle number). */
  seed: number;
  /** Optional separate seed for minor scatter & far-plane props (lets minor components vary per run while landmarks stay put). */
  scatterSeed?: number;
  /** Scene width in scene pixels. */
  W: number;
  /**
   * Per layer: the band's world top (bandTop; for the first layer, the highest row the camera can show) and bottom
   * (for the last layer, the lowest row it can show), and keep-outs the scene knows about (none today).
   */
  bands: { top: number; bottom: number; keepOut: Rect[] }[];
  cursorLane: readonly [number, number];
  panelLanes: readonly (readonly [number, number])[];
  /** A debug-only x-lane (the demo rail): entities there are dropped after placement, so the rest stays identical. */
  hideLane?: readonly [number, number];
}

/**
 * Uniform density by width. On a phone the reveal spans nearly the whole width, so the
 * scene behind them must be calmer everywhere (not just carved out behind the text): half density at phone
 * width, rising linearly to full density by about 1280 px wide.
 */
export function densityForWidth(W: number): number {
  return Math.max(0.5, Math.min(1, 0.5 + (W - 195) / 460));
}

/** Everything placement depends on: equal keys mean an identical world. */
export function specKey(spec: WorldSpecV4): string {
  return [
    spec.mode ?? 'daily',
    spec.seed,
    spec.scatterSeed ?? spec.seed,
    spec.W,
    spec.cursorLane.join(','),
    spec.panelLanes.map((l) => l.join(',')).join(';'),
    spec.hideLane?.join(',') ?? '',
    spec.bands.map((b) => `${b.top},${b.bottom},${b.keepOut.map((k) => `${k.x}.${k.y}.${k.w}.${k.h}`).join('/')}`).join(';'),
  ].join('|');
}

function buildGeom(spec: WorldSpecV4): PlaceGeom {
  const stack = layersFor(spec.mode ?? 'daily');
  enforce(spec.bands.length === stack.length, `v4: expected ${stack.length} band specs, got ${spec.bands.length}`);
  return {
    W: spec.W,
    densityScale: densityForWidth(spec.W),
    // Field Manual rarity: which gated props are in the world for this seed (the puzzle in Daily, the run in Endless).
    gate: gateFor(spec.seed),
    cursorLane: spec.cursorLane,
    panelLanes: spec.panelLanes,
    bands: spec.bands.map((b, i) => {
      const id = stack[i]!.id;
      const art = LAYER_ART[id];
      // Below the top boundary the upper layer frays down over this one: entities start under the fray.
      const top = i > 0 ? b.top + SEAM_ROWS + 2 : b.top;
      return {
        id,
        top,
        bottom: b.bottom,
        keepOut: [...b.keepOut, ...(art.keepOut?.(b.top, b.bottom, spec.W) ?? [])],
        floors: art.floors?.(b.top, b.bottom, spec.W),
      };
    }),
  };
}

/** Lazily place a single layer band `bi`. Pure and deterministic in the spec. */
export function placeBandForSpec(spec: WorldSpecV4, bi: number): LayerPlacement {
  const geom = buildGeom(spec);
  const pl = placeBand(spec.seed, bi, geom, V4_LIBRARIES, spec.scatterSeed ?? spec.seed);
  const hide = spec.hideLane;
  if (hide) {
    pl.near = pl.near.filter((e) => e.x >= hide[1] || e.x + e.w <= hide[0]);
    pl.far = pl.far.filter((e) => e.x >= hide[1] || e.x + e.w <= hide[0]);
  }
  return pl;
}

/** Place the whole world for a spec. Pure and deterministic in the spec. */
export function placeForSpec(spec: WorldSpecV4): LayerPlacement[] {
  const geom = buildGeom(spec);
  const scatterSeed = spec.scatterSeed ?? spec.seed;
  const hide = spec.hideLane;
  return geom.bands.map((_, i) => {
    const pl = placeBand(spec.seed, i, geom, V4_LIBRARIES, scatterSeed);
    if (hide) {
      pl.near = pl.near.filter((e) => e.x >= hide[1] || e.x + e.w <= hide[0]);
      pl.far = pl.far.filter((e) => e.x >= hide[1] || e.x + e.w <= hide[0]);
    }
    return pl;
  });
}
