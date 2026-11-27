#!/usr/bin/env node
// Rebuild design/naming/inventory.json and design/naming/sprites/ for the naming desk (scripts/naming-desk.mjs):
// every v4 entity and critter species (with colour variants) in all 29 layers, drawn by the game's own code.
// Needs the dev server (npm run dev, port 5173) and a Chrome with remote debugging on port 9333, e.g.
//   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9333 --user-data-dir=/tmp/nullion-cdp
// Usage: node scripts/naming-inventory.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'design', 'naming');
fs.mkdirSync(`${out}/sprites`, { recursive: true });
const t = await (await fetch('http://127.0.0.1:9333/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const P = new Map();
ws.addEventListener('message', (m) => { const d = JSON.parse(m.data); P.get(d.id)?.(d); });
const send = (method, params = {}) => new Promise(r => { const i = ++id; P.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable'); await send('Page.navigate', { url: 'http://localhost:5173/' }); await new Promise(r => setTimeout(r, 3500));
const r = await send('Runtime.evaluate', { awaitPromise: true, returnByValue: true, expression: `(async () => {
  const find = (s) => performance.getEntriesByType('resource').map(r=>r.name).find(n=>n.includes(s)) ?? s;
  const { ENDLESS_LAYERS, LAYERS } = await import(find('/src/core/layers.ts'));
  const { V4_LIBRARIES } = await import(find('/src/render/v4/libraries.ts'));
  const { drawEntity, setPaint } = await import(find('/src/render/v4/kit.ts'));
  const { LAYER_PALETTE } = await import(find('/src/render/palettes.ts'));
  const C = await import(find('/src/render/critters.ts'));
  const M = await import(find('/src/game/manual.ts'));
  const daily = new Set(LAYERS.map(l => l.id));
  const png = (w, h, draw) => {
    const tc = document.createElement('canvas'); tc.width = w; tc.height = h;
    const c = tc.getContext('2d'); c.imageSmoothingEnabled = false; draw(c);
    const k = Math.max(1, Math.min(8, Math.floor(128 / Math.max(w, h))));
    const b = document.createElement('canvas'); b.width = w * k; b.height = h * k;
    const bc = b.getContext('2d'); bc.imageSmoothingEnabled = false; bc.drawImage(tc, 0, 0, w * k, h * k);
    return b.toDataURL();
  };
  const manualBy = new Map();
  for (const e of M.MANUAL_ENTRIES) for (const s of e.sightings) {
    const key = s.entityId ? 'e:' + s.entityId : s.critterLayer ? 'c:' + s.critterLayer + ':core' : null;
    if (key) manualBy.set(key, { id: e.id, name: e.name, blurb: e.blurb, note: e.note, rarity: e.rarity });
  }
  const items = new Map(); const images = {};
  for (const L of ENDLESS_LAYERS) {
    const lib = V4_LIBRARIES[L.id];
    for (const [kind, defs] of [['anchor', lib.anchors], ['prop', lib.near]]) for (const def of defs) {
      const key = 'e:' + def.id;
      const it = items.get(key) ?? { key, kind, entityId: def.id, flags: { text: !!def.text, anim: !!def.anim }, sizes: def.sizes, appearances: [], manual: manualBy.get(key) ?? null };
      items.set(key, it);
      def.sizes.forEach((sz, v) => {
        const img = 'e-' + def.id + '-' + L.id + '-v' + v + '.png';
        images[img] = png(sz[0], sz[1], (c) => { setPaint(LAYER_PALETTE[L.id], undefined); drawEntity(c, def, v, 1, 0, 0, false, 1.2); });
        it.appearances.push({ layer: L.id, layerName: L.name, daily: daily.has(L.id), variant: v, size: sz, img });
      });
    }
    const sys = new C.CritterSystem();
    for (const alt of [false, true]) {
      if (alt && !C.ALT_SPECIES_MOTIONS[L.id]) continue;
      const key = 'c:' + L.id + ':' + (alt ? 'alt' : 'core');
      const apps = []; const seen = new Set();
      sys.ensureSeed(1);
      for (const v of [...new Set(sys.byLayer.get(L.id).map((s) => s.variant))].sort()) {
        if (C.isAltSpecies(L.id, v) !== alt) continue;
        const img = 'c-' + L.id + '-' + (alt ? 'alt' : 'core') + '-v' + v + '.png';
        const data = png(26, 22, (c) => sys.portrait(c, L.id, alt, 8, 10, 0, v));
        if (seen.has(data)) continue; // identical colouring: not a separate appearance
        seen.add(data); images[img] = data;
        apps.push({ layer: L.id, layerName: L.name, daily: daily.has(L.id), variant: v, size: [26, 22], img, colourVariant: true });
      }
      items.set(key, { key, kind: alt ? 'critter-alt' : 'critter', entityId: null, critterLayer: L.id, motions: (alt ? C.ALT_SPECIES_MOTIONS[L.id] : C.SPECIES_MOTIONS[L.id]), appearances: apps, manual: manualBy.get(key) ?? null });
    }
  }
  return JSON.stringify({ layers: ENDLESS_LAYERS.map(l => ({ id: l.id, name: l.name, daily: daily.has(l.id) })), items: [...items.values()], images });
})()` });
if (r.result?.exceptionDetails) { console.log(JSON.stringify(r.result.exceptionDetails).slice(0, 1200)); process.exit(1); }
const v = r.result?.result?.value; if (!v) { console.log(JSON.stringify(r.result).slice(0, 800)); process.exit(1); }
const { layers, items, images } = JSON.parse(v);
for (const [k, d] of Object.entries(images)) fs.writeFileSync(`${out}/sprites/${k}`, Buffer.from(d.split(',')[1], 'base64'));
fs.writeFileSync(`${out}/inventory.json`, JSON.stringify({ generated: new Date().toISOString(), layers, items }, null, 1));
console.log(items.length, 'items', Object.keys(images).length, 'images', items.filter(i => i.appearances.length > 1).length, 'multi-appearance');
await fetch(`http://127.0.0.1:9333/json/close/${t.id}`, { method: 'PUT' });
process.exit(0);
