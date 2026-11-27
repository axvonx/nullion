import { hash } from '../art';
import { offscreen } from '../art-detailed';
import { enforce } from '../../core/enforce';
import { Pen, paintKey, type Ctx, type EntityDef } from './kit';
import type { Placed } from './place';

/**
 * Many-to-many topic tagging for question-reactive background props.
 *
 * - Each question maps to 1–3 `TopicTag`s (e.g. `data-structure` → `['dsa', 'graph']`).
 * - Each v4 background entity carries 1–3 `TopicTag`s (its own, else its layer's defaults).
 * - When a question is active, a deterministic random subset of eligible near-plane props
 *   (non-anchor, w >= 14, h >= 12) flip their contents to a topic-matched pixel-art display
 *   drawn strictly inside the original `(x, y, w, h)` bounding box with a solid flat top edge
 *   at `y = 0` — so placement never reshuffles, neighbors never overlap/intrude, and critters
 *   always have an unbroken top surface to land on.
 */

export const TOPIC_TAGS = [
  'dsa',
  'sorting',
  'graph',
  'graphics',
  'math',
  'crypto',
  'security',
  'os',
  'concurrency',
  'networking',
  'languages',
  'hardware',
] as const;

export type TopicTag = (typeof TOPIC_TAGS)[number];

const QUESTION_TAG_OVERRIDES: Record<string, readonly TopicTag[]> = {
  'data-structure': ['dsa', 'graph'],
  'sorting-algorithm': ['sorting', 'dsa'],
  'graph-algorithm': ['graph', 'dsa'],
  'clustering-algorithm': ['math', 'dsa'],
  'gradient-based-optimizer': ['math', 'dsa'],
  'lossless-compression-algorithm': ['dsa', 'math'],
  'non-cryptographic-hash-function': ['dsa', 'crypto'],
  '3d-model-file-format': ['graphics', 'math'],
  'shading-technique': ['graphics', 'math'],
  'map-projection': ['graphics', 'math'],
  lock: ['concurrency', 'os'],
  filesystem: ['os', 'dsa'],
  'operating-system': ['os', 'hardware'],
  'linux-system-call': ['os', 'hardware'],
  'linux-tracing-tool': ['os', 'concurrency'],
  'memory-allocator': ['os', 'dsa'],
  'garbage-collection-algorithm': ['languages', 'os', 'dsa'],
  'kubernetes-resource-kind': ['networking', 'os'],
  'http-status-code': ['networking'],
  'tcp-congestion-control-algorithm': ['networking', 'os'],
  'unix-command': ['os', 'languages'],
  'git-subcommand': ['languages', 'graph'],
  'programming-language': ['languages'],
  'compiler-optimization': ['languages', 'dsa'],
  'python-stdlib-module': ['languages', 'os'],
  'static-site-generator': ['languages', 'networking'],
  'software-license': ['languages', 'security'],
  bug: ['concurrency', 'security', 'languages'],
  'block-cipher': ['crypto', 'security'],
  'stream-cipher': ['crypto', 'security'],
  'cryptographic-hash-function': ['crypto', 'security'],
  'post-quantum-signature-scheme': ['crypto', 'math', 'security'],
  'cpu-side-channel-attack': ['security', 'hardware'],
  'instruction-set-architecture': ['hardware', 'languages'],
  'riscv-extension': ['hardware', 'languages'],
};

const KEYWORD_TAG_RULES: readonly [RegExp, readonly TopicTag[]][] = [
  [/sort|order/, ['sorting', 'dsa']],
  [/graph|tree|path|flow|mesh|dag|git/, ['graph', 'dsa']],
  [/data-structure|hash|index|cache|queue|heap|compress|search|string|dp|dynamic-programming|query|join|database|crdt/, ['dsa']],
  [/3d|shad|graphic|color|image|render|font|projection|raster|ray|pixel|video|audio/, ['graphics', 'math']],
  [/math|matrix|numeric|ode|fft|mcmc|quadrature|root|optimi|cluster|geometry|probab|linear|multipl/, ['math', 'dsa']],
  [/cipher|crypto|signature|hash-function|zk|key-exchange|mac|aead|tls/, ['crypto', 'security']],
  [/security|attack|side-channel|vuln|auth|exploit|sandbox|bug|cwe/, ['security']],
  [/lock|concur|mutex|atomic|sync|consensus|raft|paxos|sched|thread/, ['concurrency', 'os']],
  [/tcp|http|dns|bgp|net|protocol|rpc|web|socket|routing|packet|kube|docker|cloud/, ['networking', 'os']],
  [/linux|os|kernel|syscall|filesystem|memory|alloc|unix|posix|process|boot|firmware|driver|virtual|container|tracing/, ['os']],
  [/lang|compil|pars|type|gc|garbage|python|rust|js|refactor|ide|build|license|tool|regex/, ['languages']],
  [/cpu|isa|riscv|arm|x86|hardware|silicon|bus|pcie|register|alu|chip|transistor|cache-coheren/, ['hardware']],
];

/** Many-to-many question → TopicTag[] mapping (covers all 193 bank categories + sample questions). */
export function tagsForQuestion(questionId: string): readonly TopicTag[] {
  const exact = QUESTION_TAG_OVERRIDES[questionId];
  if (exact) return exact;
  const out = new Set<TopicTag>();
  for (const [re, tags] of KEYWORD_TAG_RULES) {
    if (re.test(questionId)) for (const t of tags) out.add(t);
  }
  if (out.size === 0) out.add('dsa');
  return [...out].slice(0, 3);
}

/**
 * An entity's topic tags: set on its definition (`ent(..., { tags })`) or, when it sets none, its layer's defaults
 * (`LAYER_TOPIC_TAGS`), which the library builder fills in. An untagged entity never reached a library, so it is a bug.
 */
export function tagsForEntity(def: Pick<EntityDef, 'id' | 'tags'>): readonly TopicTag[] {
  enforce(def.tags && def.tags.length > 0, `topics: entity ${def.id} has no topic tags (build it through buildLibraries)`);
  return def.tags;
}

export interface TopicProp {
  id: string;
  tags: readonly TopicTag[];
  /** Static body drawn inside (0..w, 0..h) with a guaranteed solid flat top bar at y = 0 for critters. */
  draw: (p: Pen, w: number, h: number) => void;
  /** Optional subtle live animation on artTime (strictly within 0..w, 0..h). */
  anim?: (p: Pen, w: number, h: number, t: number) => void;
}

/** Pixel Bresenham segment through Pen (palette-snapped and clipped to the prop's box). */
function penLine(p: Pen, x0: number, y0: number, x1: number, y1: number, col: string) {
  let ax = Math.round(x0);
  let ay = Math.round(y0);
  const bx = Math.round(x1);
  const by = Math.round(y1);
  const dx = Math.abs(bx - ax);
  const dy = -Math.abs(by - ay);
  const sx = ax < bx ? 1 : -1;
  const sy = ay < by ? 1 : -1;
  let err = dx + dy;
  for (let n = 0; n < 120; n++) {
    p.p(ax, ay, col);
    if (ax === bx && ay === by) return;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      ax += sx;
    }
    if (e2 <= dx) {
      err += dx;
      ay += sy;
    }
  }
}

/** Framed dark display card with a guaranteed flat top bezel (y = 0) so critters always have a clean landing ledge. */
function screenFrame(p: Pen, w: number, h: number, edge: string, topBar: string, bg = '#121422') {
  p.r(0, 0, w, 1, topBar);
  p.r(0, 1, w, h - 1, edge);
  if (w > 2 && h > 3) p.r(1, 2, w - 2, h - 3, bg);
}

/** Topic-themed pixel-art display sprites that fit any bounding box >= 14×12 without overlapping neighbors. */
export const TOPIC_PROPS: readonly TopicProp[] = [
  {
    id: 'tp-dsa-tree',
    tags: ['dsa', 'graph'],
    draw(p, w, h) {
      screenFrame(p, w, h, '#3d5a80', '#7ab8f5', '#0f1628');
      const cx = Math.floor(w / 2);
      const y0 = 3;
      const y1 = Math.min(h - 4, y0 + Math.max(4, Math.floor((h - 6) * 0.5)));
      const dx = Math.max(3, Math.floor((w - 6) * 0.28));
      penLine(p, cx, y0 + 1, cx - dx, y1, '#5b8ee6');
      penLine(p, cx, y0 + 1, cx + dx, y1, '#5b8ee6');
      p.r(cx - 1, y0, 3, 2, '#ffe25a');
      p.r(cx - dx - 1, y1, 3, 2, '#59c08a');
      p.r(cx + dx - 1, y1, 3, 2, '#59c08a');
      if (h >= 16) {
        const y2 = h - 3;
        p.p(cx - dx - 2, y2, '#7ab8f5');
        p.p(cx - dx + 1, y2, '#7ab8f5');
        p.p(cx + dx + 1, y2, '#7ab8f5');
      }
    },
    anim(p, w, _h, t) {
      const cx = Math.floor(w / 2);
      if (Math.floor(t * 2) % 2 === 0) p.p(cx, 3, '#ffffff');
    },
  },
  {
    id: 'tp-dsa-list',
    tags: ['dsa', 'os'],
    draw(p, w, h) {
      screenFrame(p, w, h, '#4a4e69', '#9a8c98', '#141320');
      const midY = Math.max(3, Math.floor(h / 2) - 2);
      const step = 6;
      for (let x = 2; x + 4 < w - 1; x += step) {
        p.box(x, midY, 4, 4, '#22223b', '#7ab8f5');
        if (x + step + 3 < w - 1) p.r(x + 4, midY + 1, 2, 1, '#ffb000');
      }
    },
    anim(p, w, h, t) {
      const midY = Math.max(3, Math.floor(h / 2) - 2);
      const count = Math.max(1, Math.floor((w - 5) / 6));
      const idx = Math.floor(t * 2.2) % count;
      p.r(3 + idx * 6, midY + 1, 2, 2, '#ffe25a');
    },
  },
  {
    id: 'tp-dsa-hash',
    tags: ['dsa', 'crypto'],
    draw(p, w, h) {
      screenFrame(p, w, h, '#2f5e6b', '#5fd3e0', '#0c1820');
      const cols = Math.min(4, Math.max(2, Math.floor((w - 4) / 4)));
      const cw = Math.floor((w - 4) / cols);
      for (let i = 0; i < cols; i++) {
        const bx = 2 + i * cw;
        p.r(bx, 3, Math.max(2, cw - 1), h - 5, '#1b3140');
        const fill = 2 + ((i * 3 + 1) % Math.max(2, h - 7));
        p.r(bx, h - 2 - fill, Math.max(2, cw - 1), fill, i % 2 === 0 ? '#5fd3e0' : '#ffb000');
      }
    },
    anim(p, w, _h, t) {
      const cols = Math.min(4, Math.max(2, Math.floor((w - 4) / 4)));
      const cw = Math.floor((w - 4) / cols);
      const i = Math.floor(t * 2.5) % cols;
      p.r(2 + i * cw, 3, Math.max(2, cw - 1), 1, '#ffffff');
    },
  },
  {
    id: 'tp-sort-bars',
    tags: ['sorting', 'dsa', 'math'],
    draw(p, w, h) {
      screenFrame(p, w, h, '#5a3e6b', '#c58bff', '#141022');
      const n = Math.min(7, Math.max(4, Math.floor((w - 4) / 2)));
      const maxH = Math.max(3, h - 5);
      for (let i = 0; i < n; i++) {
        const bh = Math.max(2, Math.round(((i + 1) / n) * maxH));
        p.r(2 + i * 2, h - 2 - bh, 1, bh, i === n - 1 ? '#ffe25a' : '#c58bff');
      }
    },
    anim(p, w, h, t) {
      const n = Math.min(7, Math.max(4, Math.floor((w - 4) / 2)));
      const maxH = Math.max(3, h - 5);
      const k = Math.floor(t * 3) % n;
      const bh = Math.max(2, Math.round(((k + 1) / n) * maxH));
      p.r(2 + k * 2, h - 2 - bh, 1, bh, '#ffffff');
    },
  },
  {
    id: 'tp-graph-net',
    tags: ['graph', 'networking'],
    draw(p, w, h) {
      screenFrame(p, w, h, '#2b5876', '#55ffff', '#0c1622');
      const x1 = 3;
      const x2 = w - 4;
      const y1 = 4;
      const y2 = h - 4;
      const mx = Math.floor(w / 2);
      const my = Math.floor(h / 2);
      penLine(p, x1, y1, x2, y2, '#3d6cc4');
      penLine(p, x1, y2, x2, y1, '#3d6cc4');
      penLine(p, x1, y1, mx, my, '#55ffff');
      p.r(x1 - 1, y1 - 1, 2, 2, '#55ffff');
      p.r(x2 - 1, y1 - 1, 2, 2, '#ff6ad5');
      p.r(x1 - 1, y2 - 1, 2, 2, '#59c08a');
      p.r(x2 - 1, y2 - 1, 2, 2, '#ffe25a');
    },
    anim(p, w, h, t) {
      const q = (t * 0.9) % 1;
      const px = Math.round(3 + (w - 7) * q);
      const py = Math.round(4 + (h - 8) * q);
      p.p(px, py, '#ffffff');
    },
  },
  {
    id: 'tp-gfx-shader',
    tags: ['graphics', 'math'],
    draw(p, w, h) {
      screenFrame(p, w, h, '#6b3a5b', '#ff6ad5', '#160e1c');
      const cols = ['#ff5f7a', '#ffb000', '#ffe25a', '#59c08a', '#5fd3e0', '#c58bff'];
      const innerW = Math.max(1, w - 4);
      for (let x = 0; x < innerW; x++) {
        const col = cols[Math.floor((x / innerW) * cols.length)]!;
        p.r(2 + x, 3, 1, Math.max(2, Math.floor((h - 5) / 2)), col);
      }
      // Mini wireframe diamond below the ramp
      const cx = Math.floor(w / 2);
      const cy = Math.min(h - 3, Math.floor(h * 0.72));
      p.p(cx, cy - 2, '#ffffff');
      p.p(cx - 2, cy, '#5fd3e0');
      p.p(cx + 2, cy, '#5fd3e0');
      p.p(cx, cy + 1, '#ff6ad5');
    },
    anim(p, w, h, t) {
      const cx = Math.floor(w / 2);
      const cy = Math.min(h - 3, Math.floor(h * 0.72));
      const off = Math.floor(t * 2) % 2;
      p.p(cx + (off ? 1 : -1), cy, '#ffffff');
    },
  },
  {
    id: 'tp-crypto-lock',
    tags: ['crypto', 'security'],
    draw(p, w, h) {
      screenFrame(p, w, h, '#6e4c1e', '#ffb000', '#18120c');
      const cx = Math.floor(w / 2);
      const cy = Math.max(4, Math.floor(h / 2) - 1);
      // Shackle + lock body
      p.frame(cx - 2, cy - 2, 5, 3, '#c8d6f0');
      p.box(cx - 3, cy, 7, 5, '#ffb000', '#7a4a00');
      p.p(cx, cy + 2, '#18120c');
    },
    anim(p, w, h, t) {
      const y = h - 3;
      const x = 2 + (Math.floor(t * 4) % Math.max(1, w - 4));
      p.p(x, y, '#7ee0a1');
    },
  },
  {
    id: 'tp-os-sched',
    tags: ['os', 'concurrency'],
    draw(p, w, h) {
      screenFrame(p, w, h, '#6b2828', '#ff5f56', '#180e10');
      const lanes = Math.min(3, Math.max(2, Math.floor((h - 4) / 3)));
      const cols = ['#ff5f56', '#ffb000', '#7ee0a1'];
      for (let r = 0; r < lanes; r++) {
        const y = 3 + r * 3;
        p.r(2, y, w - 4, 2, '#28181c');
        const segW = Math.max(2, Math.floor((w - 6) * 0.45));
        const sx = 2 + ((r * 3) % Math.max(1, w - 4 - segW));
        p.r(sx, y, segW, 2, cols[r % cols.length]!);
      }
    },
    anim(p, w, h, t) {
      const x = 2 + (Math.floor(t * 6) % Math.max(1, w - 4));
      p.r(x, 3, 1, Math.max(2, h - 5), '#ffffff');
    },
  },
  {
    id: 'tp-net-pkt',
    tags: ['networking', 'security'],
    draw(p, w, h) {
      screenFrame(p, w, h, '#1e5a4a', '#59c08a', '#0c1a16');
      const y1 = 4;
      const y2 = Math.max(y1 + 3, h - 4);
      p.r(2, y1, w - 4, 1, '#2d7a62');
      p.r(2, y2, w - 4, 1, '#2d7a62');
      p.r(2, y1 - 1, 2, 3, '#59c08a');
      p.r(w - 4, y2 - 1, 2, 3, '#5fd3e0');
    },
    anim(p, w, h, t) {
      const span = Math.max(2, w - 6);
      const x1 = 2 + (Math.floor(t * 8) % span);
      const x2 = w - 4 - (Math.floor(t * 8 + 3) % span);
      p.r(x1, 4, 2, 1, '#ffe25a');
      p.r(x2, Math.max(7, h - 4), 2, 1, '#55ffff');
    },
  },
  {
    id: 'tp-lang-code',
    tags: ['languages', 'dsa'],
    draw(p, w, h) {
      screenFrame(p, w, h, '#3a4a6e', '#7ab8f5', '#101420');
      const colors = ['#ff6ad5', '#5fd3e0', '#ffe25a', '#7ee0a1'];
      for (let y = 3, r = 0; y < h - 2; y += 2, r++) {
        const ind = (r % 3) * 2;
        const len = Math.max(2, Math.min(w - 4 - ind, 4 + ((r * 5) % Math.max(3, w - 6))));
        p.r(2 + ind, y, len, 1, colors[r % colors.length]!);
      }
    },
    anim(p, _w, h, t) {
      if (Math.floor(t * 2.5) % 2 === 0) p.r(2, Math.min(h - 3, 5), 1, 1, '#ffffff');
    },
  },
  {
    id: 'tp-hw-chip',
    tags: ['hardware', 'os', 'security'],
    draw(p, w, h) {
      screenFrame(p, w, h, '#28643a', '#4cd97b', '#0a1610');
      const bw = Math.max(6, w - 6);
      const bh = Math.max(4, h - 6);
      const bx = Math.floor((w - bw) / 2);
      const by = Math.floor((h - bh) / 2) + 1;
      p.box(bx, by, bw, bh, '#142c1c', '#4cd97b');
      for (let x = bx + 1; x < bx + bw - 1; x += 2) {
        p.p(x, by - 1, '#b8ffcf');
        if (by + bh < h - 1) p.p(x, by + bh, '#b8ffcf');
      }
    },
    anim(p, w, h, t) {
      const cx = Math.floor(w / 2);
      const cy = Math.floor(h / 2) + 1;
      p.p(cx, cy, Math.floor(t * 3) % 2 === 0 ? '#ffffff' : '#4cd97b');
    },
  },
  {
    id: 'tp-math-curve',
    tags: ['math', 'graphics'],
    draw(p, w, h) {
      screenFrame(p, w, h, '#3d4a70', '#8fb7ff', '#0e1222');
      // Axes
      p.r(2, 3, 1, h - 5, '#4a5a88');
      p.r(2, h - 3, w - 4, 1, '#4a5a88');
      const span = Math.max(2, w - 5);
      for (let x = 0; x < span; x++) {
        const q = x / span;
        const y = h - 3 - Math.round(Math.sin(q * Math.PI) * Math.max(2, h - 7));
        p.p(3 + x, y, '#ffe25a');
      }
    },
    anim(p, w, h, t) {
      const span = Math.max(2, w - 5);
      const x = Math.floor((t * 5) % span);
      const q = x / span;
      const y = h - 3 - Math.round(Math.sin(q * Math.PI) * Math.max(2, h - 7));
      p.p(3 + x, y, '#ffffff');
    },
  },
];

/** Minimum bounding-box size eligible to flip to a topic display (keeps tiny trinkets untouched & legible). */
export const MIN_FLIP_W = 14;
export const MIN_FLIP_H = 12;

/**
 * Deterministically decide whether a placed near-plane entity flips to a topic-themed display for the active question.
 * - Never flips anchors (landmarks stay stable).
 * - Never flips entities smaller than MIN_FLIP_W × MIN_FLIP_H.
 * - Entities whose tags overlap the question's tags flip at ~45%; other eligible display-sized props flip at ~18%.
 */
export function pickTopicFlip(
  e: Pick<Placed, 'anchor' | 'w' | 'h' | 'x' | 'y' | 'def'>,
  activeTags: readonly TopicTag[],
  roundSeed: number,
): TopicProp | undefined {
  if (e.anchor || activeTags.length === 0 || e.w < MIN_FLIP_W || e.h < MIN_FLIP_H) return undefined;
  const eTags = tagsForEntity(e.def);
  const overlap = eTags.some((t) => activeTags.includes(t));
  const chance = overlap ? 0.45 : 0.18;
  const roll = hash(roundSeed * 1009 + e.x * 37 + e.y * 17 + e.def.id.length * 13);
  if (roll >= chance) return undefined;

  const matching = TOPIC_PROPS.filter((tp) => tp.tags.some((t) => activeTags.includes(t)));
  if (!matching.length) return undefined;
  const pickIdx = Math.floor(hash(roundSeed * 433 + e.x * 59 + e.y * 29 + 7) * matching.length);
  return matching[pickIdx];
}

const PEN = new Pen();

/**
 * Draw a topic-themed prop strictly clipped inside `(x, y, w, h)` so it can never overlap or intrude on
 * neighboring entities, while preserving a solid flat top edge at `y` for critters to land on.
 */
export function drawTopicProp(ctx: Ctx, prop: TopicProp, w: number, h: number, x: number, y: number, t: number, seed: number) {
  const rx = Math.round(x);
  const ry = Math.round(y);
  const key = `tp|${prop.id}|${w}x${h}|${paintKey()}`;
  const sprite = offscreen(key, w, h, (cx) => {
    prop.draw(PEN.at(cx, 0, 0, w, false, seed), w, h);
  });
  ctx.save();
  ctx.beginPath();
  ctx.rect(rx, ry, w, h);
  ctx.clip();
  ctx.drawImage(sprite, rx, ry);
  if (prop.anim) prop.anim(PEN.at(ctx, rx, ry, w, false, seed), w, h, t);
  ctx.restore();
}
