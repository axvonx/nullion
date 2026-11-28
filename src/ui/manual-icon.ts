/** Small 9×9 pixel book icon SVG for the end-of-day button and modal header. */
export function manualBookIcon(size = 16): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const rows = [
    ' ####### ',
    '##+++++##',
    '#+#####+#',
    '#+##+##+#',
    '#+#####+#',
    '#+#+++# #',
    '#+#####+#',
    '##+++++##',
    ' ####### ',
  ];
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 9 9');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('fm-book-icon');
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch !== '#' && ch !== '+') continue;
      const r = document.createElementNS(ns, 'rect');
      r.setAttribute('x', String(x));
      r.setAttribute('y', String(y));
      r.setAttribute('width', '1');
      r.setAttribute('height', '1');
      r.setAttribute('fill', ch === '#' ? 'currentColor' : 'var(--signal)');
      svg.append(r);
    }
  });
  return svg;
}

/**
 * Standalone 14×14 pixel physical Field Manual binder/book for the persistent top-left HUD dock (docs/ui-style.md §7.2).
 * Slate vinyl cover, bond page edge, amber spine plate, and crimson bookmark ribbon.
 */
export function hudBookSvg(size = 32): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 14 14');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('hud-book-svg');
  svg.innerHTML =
    '<path fill="#0d0b12" d="M2 1h10v1h1v10h-1v1H2v-1H1V2h1z"/>' +
    '<path fill="#2e3541" d="M2 2h3v10H2z"/>' +
    '<path fill="#5d6b80" d="M3 3h1v8H3z"/>' +
    '<path fill="#3f4a5c" d="M5 2h7v9H5z"/>' +
    '<path fill="#f1f0ec" d="M5 10h7v2H5z"/>' +
    '<path fill="#ffb000" d="M6 4h5v3H6z"/>' +
    '<path fill="#131118" d="M7 5h3v1H7z"/>' +
    '<path fill="#b3322b" d="M9 11h2v3H9z"/>';
  return svg;
}
