import { ent, type Pen, type EntityDef, type Size } from '../../render/v4/kit';

/** Tone set for one layer's palette (ART-STYLE rules 3/4): every sprite draws from these so the palette snap stays coherent. */
export interface K {
  /** darkest ink / cavities */ i: string;
  /** shade */ d: string;
  /** body base */ m: string;
  /** highlight */ l: string;
  /** brightest */ h: string;
  /** brass or metal accent, and its light */ w: string;
  wl: string;
  /** wood or leather, and its light */ o: string;
  ol: string;
  /** focal accent, second accent, green, cream, red */ a: string;
  b: string;
  g: string;
  c: string;
  r: string;
}

export const NK: K = { i: '#2a3358', d: '#55607a', m: '#9aa3b8', l: '#dfe4ee', h: '#ffffff', w: '#b8902e', wl: '#f0cf6a', o: '#8a5a36', ol: '#bd8650', a: '#e6a23c', b: '#5b8ee6', g: '#59c08a', c: '#f3efe6', r: '#d9534f' };

export const BK: K = { i: '#000033', d: '#333366', m: '#666699', l: '#9999cc', h: '#ffffcc', w: '#cc9933', wl: '#ffcc66', o: '#996633', ol: '#cc9966', a: '#ffff33', b: '#ff9933', g: '#66cc99', c: '#ffffcc', r: '#ff6633' };

export const CK: K = { i: '#000000', d: '#555555', m: '#aaaaaa', l: '#ffffff', h: '#ffffff', w: '#aa5500', wl: '#ffff55', o: '#aa5500', ol: '#ffff55', a: '#ffff55', b: '#55ffff', g: '#55ff55', c: '#ffffff', r: '#ff5555' };

export const GK: K = { i: '#020e06', d: '#0a461e', m: '#1ea046', l: '#8cffa0', h: '#8cffa0', w: '#1ea046', wl: '#8cffa0', o: '#0a461e', ol: '#1ea046', a: '#8cffa0', b: '#8cffa0', g: '#1ea046', c: '#8cffa0', r: '#8cffa0' };

export const AK: K = { i: '#0a0500', d: '#582c04', m: '#c47210', l: '#ffd060', h: '#ffd060', w: '#c47210', wl: '#ffd060', o: '#582c04', ol: '#c47210', a: '#ffd060', b: '#ffd060', g: '#c47210', c: '#ffd060', r: '#ffd060' };

export const PK: K = { i: '#040c18', d: '#123866', m: '#3ab2e6', l: '#e4f8ff', h: '#e4f8ff', w: '#3ab2e6', wl: '#e4f8ff', o: '#123866', ol: '#3ab2e6', a: '#e4f8ff', b: '#e4f8ff', g: '#3ab2e6', c: '#e4f8ff', r: '#e4f8ff' };

export const YK: K = { i: '#03040a', d: '#101c40', m: '#4ca8d6', l: '#e6f8ff', h: '#e6f8ff', w: '#4ca8d6', wl: '#e6f8ff', o: '#101c40', ol: '#4ca8d6', a: '#e6f8ff', b: '#e6f8ff', g: '#4ca8d6', c: '#e6f8ff', r: '#e6f8ff' };

/** A shaded slab: base fill, light top and left edges, shade bottom and right (rule 4). */
export const sl = (p: Pen, x: number, y: number, w: number, h: number, m: string, l: string, d: string) => {
  p.r(x, y, w, h, m);
  p.r(x, y, w, 1, l);
  p.r(x, y, 1, h, l);
  p.r(x, y + h - 1, w, 1, d);
  p.r(x + w - 1, y, 1, h, d);
};

/** Entity builder bound to one layer's tones. */
export const E =
  (k: K) =>
  (id: string, size: Size, fn: (p: Pen, k: K) => void, opts: Omit<EntityDef, 'id' | 'sizes' | 'draw'> = {}): EntityDef =>
    ent(id, [size], (p) => fn(p, k), opts);

export const net = E(NK);

export const byc = E(BK);

export const cga = E(CK);

export const grn = E(GK);

export const amb = E(AK);

export const bpr = E(PK);

export const aby = E(YK);
