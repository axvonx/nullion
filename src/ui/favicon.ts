import { reducedMotion } from '../looks';

/**
 * Animated transparent pixel-art "0" favicon: a crisp hollow monospace zero (no slash, no box background)
 * with a 1px dark outline so it reads on both light and dark browser tabs, periodically playing brief
 * non-strobing glitches (0→1 bit flip, cyan/magenta split, off-by-one shift, horizontal tear).
 * Static under reduced motion.
 */

const ZERO = [
  '  ######  ',
  ' ######## ',
  ' ###  ### ',
  ' ##    ## ',
  ' ##    ## ',
  ' ##    ## ',
  ' ##    ## ',
  ' ##    ## ',
  ' ###  ### ',
  ' ######## ',
  '  ######  ',
];

const ONE = [
  '    ###   ',
  '   ####   ',
  '  #####   ',
  '    ###   ',
  '    ###   ',
  '    ###   ',
  '    ###   ',
  '    ###   ',
  '    ###   ',
  ' ######## ',
  ' ######## ',
];

type FavGlitch = 'normal' | 'off-by-one' | 'split' | 'bitflip' | 'tear';
const GLITCHES: readonly FavGlitch[] = ['bitflip', 'split', 'off-by-one', 'tear'];

function drawOutlined(
  ctx: CanvasRenderingContext2D,
  mask: readonly string[],
  ox: number,
  oy: number,
  fill: string,
  outline?: string,
) {
  const h = mask.length;
  const w = mask[0]!.length;
  const ink = (r: number, c: number) => r >= 0 && r < h && c >= 0 && c < w && mask[r]![c] === '#';

  if (outline) {
    ctx.fillStyle = outline;
    for (let r = -1; r <= h; r++) {
      for (let c = -1; c <= w; c++) {
        if (ink(r, c)) continue;
        let near = false;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (ink(r + dr, c + dc)) {
              near = true;
              break;
            }
          }
          if (near) break;
        }
        if (near) ctx.fillRect(ox + c, oy + r, 1, 1);
      }
    }
  }

  ctx.fillStyle = fill;
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (ink(r, c)) ctx.fillRect(ox + c, oy + r, 1, 1);
    }
  }
}

function renderFavicon(canvas: HTMLCanvasElement, kind: FavGlitch): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const S = 16;
  ctx.clearRect(0, 0, S, S);

  const ox = 3;
  const oy = 2;

  if (kind === 'split') {
    drawOutlined(ctx, ZERO, ox - 1, oy, '#ff6ad5');
    drawOutlined(ctx, ZERO, ox + 1, oy, '#5fd3e0');
    drawOutlined(ctx, ZERO, ox, oy, '#ebe6d6', '#131118');
  } else if (kind === 'off-by-one') {
    drawOutlined(ctx, ZERO, ox + 1, oy - 1, '#ffb000', '#131118');
  } else if (kind === 'bitflip') {
    drawOutlined(ctx, ONE, ox, oy, '#ffe25a', '#131118');
  } else if (kind === 'tear') {
    drawOutlined(ctx, ZERO, ox, oy, '#ebe6d6', '#131118');
    const slice = ctx.getImageData(0, 6, S, 3);
    ctx.clearRect(0, 6, S, 3);
    ctx.putImageData(slice, 2, 6);
  } else {
    drawOutlined(ctx, ZERO, ox, oy, '#ebe6d6', '#131118');
  }

  return canvas.toDataURL('image/png');
}

/** Mount and animate the transparent glitching pixel-art "0" favicon. Safe no-op in non-DOM/test environments. */
export function startFavicon() {
  if (typeof document === 'undefined') return;
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.append(link);
  }
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  if (!canvas.getContext('2d')) return;

  const baseUrl = renderFavicon(canvas, 'normal');
  if (!baseUrl || baseUrl === 'data:,') return;
  link.type = 'image/png';
  link.href = baseUrl;

  let idx = 0;
  const schedule = () => {
    const wait = 2000 + Math.floor(Math.random() * 1600);
    window.setTimeout(() => {
      if (!reducedMotion() && !document.hidden) {
        const kind = GLITCHES[idx++ % GLITCHES.length]!;
        link!.href = renderFavicon(canvas, kind);
        window.setTimeout(() => {
          link!.href = baseUrl;
          schedule();
        }, 320);
      } else {
        schedule();
      }
    }, wait);
  };
  schedule();
}
