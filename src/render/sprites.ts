import { enforce } from '../core/enforce';

/** 'X' = outline, '.' = fill, ' ' = transparent. Hotspot is the top-left pixel unless noted. */
export interface Sprite {
  w: number;
  h: number;
  rows: string[];
  /** Hotspot offset, so an I-beam centers instead of hanging off the top-left. */
  hx: number;
  hy: number;
}

function sprite(rows: string[], hx = 0, hy = 0): Sprite {
  const w = rows[0]!.length;
  enforce(rows.every((r) => r.length === w), 'sprite rows must be equal width');
  return { w, h: rows.length, rows, hx, hy };
}

/**
 * Build an outlined sprite from a bare glyph mask ('#' = ink): every empty pixel touching ink
 * (8-neighbourhood) becomes outline, so the glyph stays legible on any background.
 */
function outlined(mask: string[], hx: number, hy: number): Sprite {
  const w = mask[0]!.length;
  enforce(mask.every((r) => r.length === w), 'glyph rows must be equal width');
  const ink = (r: number, c: number) => r >= 1 && r <= mask.length && c >= 1 && c <= w && mask[r - 1]![c - 1] === '#';
  const rows: string[] = [];
  for (let r = 0; r < mask.length + 2; r++) {
    let row = '';
    for (let c = 0; c < w + 2; c++) {
      if (ink(r, c)) row += '.';
      else {
        let near = false;
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) near ||= ink(r + dr, c + dc);
        row += near ? 'X' : ' ';
      }
    }
    rows.push(row);
  }
  return sprite(rows, hx, hy);
}

/** The bit cursor: hand-drawn 0 and 1, same box so a flip never shifts the hotspot. */
const BIT_ZERO = [
  '.####.',
  '##..##',
  '##..##',
  '##..##',
  '##..##',
  '##..##',
  '##..##',
  '##..##',
  '.####.',
].map((r) => r.replaceAll('.', ' '));
const BIT_ONE = [
  '..##..',
  '.###..',
  '####..',
  '..##..',
  '..##..',
  '..##..',
  '..##..',
  '..##..',
  '######',
].map((r) => r.replaceAll('.', ' '));

export const SPRITES = {
  arrow: sprite([
    'X         ',
    'XX        ',
    'X.X       ',
    'X..X      ',
    'X...X     ',
    'X....X    ',
    'X.....X   ',
    'X......X  ',
    'X.......X ',
    'X....XXXXX',
    'X..X..X   ',
    'X.X X..X  ',
    'XX  X..X  ',
    '     XX   ',
  ]),
  ibeam: sprite(
    [
      'XXX XXX',
      '   X   ',
      '   X   ',
      '   X   ',
      '   X   ',
      '   X   ',
      '   X   ',
      '   X   ',
      '   X   ',
      '   X   ',
      'XXX XXX',
    ],
    3,
    5,
  ),
  block: sprite(['XXXXXXXX', 'X......X', 'X......X', 'X......X', 'X......X', 'X......X', 'X......X', 'X......X', 'X......X', 'X......X', 'X......X', 'XXXXXXXX'], 4, 6),
  underscore: sprite(['XXXXXXXXX', 'X.......X', 'X.......X', 'XXXXXXXXX'], 4, -4),
  biosbar: sprite(
    ['.'.repeat(34), '.'.repeat(34), '.'.repeat(34), '.'.repeat(34), '.'.repeat(34), '.'.repeat(34), '.'.repeat(34)],
    17,
    3,
  ),
  bit0: outlined(BIT_ZERO, 4, 5),
  bit1: outlined(BIT_ONE, 4, 5),
  /** v1 art style's round bit, kept so the old look stays comparable. */
  bit: sprite(['  XXXX  ', ' X....X ', 'X......X', 'X......X', 'X......X', 'X......X', ' X....X ', '  XXXX  '], 4, 4),
  hourglass: sprite(
    [
      'XXXXXXXXX',
      'X.......X',
      ' X.....X ',
      '  X...X  ',
      '   X.X   ',
      '    X    ',
      '   X X   ',
      '  X . X  ',
      ' X ... X ',
      'X.......X',
      'XXXXXXXXX',
    ],
    4,
    5,
  ),
} as const;

export type SpriteId = keyof typeof SPRITES;

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  s: Sprite,
  x: number,
  y: number,
  fill: string,
  outline: string,
  alpha = 1,
) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const ox = Math.round(x - s.hx);
  const oy = Math.round(y - s.hy);
  for (let r = 0; r < s.h; r++) {
    const row = s.rows[r]!;
    for (let c = 0; c < s.w; c++) {
      const ch = row[c];
      if (ch === ' ') continue;
      ctx.fillStyle = ch === 'X' ? outline : fill;
      ctx.fillRect(ox + c, oy + r, 1, 1);
    }
  }
  ctx.restore();
}
