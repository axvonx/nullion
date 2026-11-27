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
