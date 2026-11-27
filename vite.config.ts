import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vitest/config';

const MANUAL_DIR = resolve(import.meta.dirname, 'manual');
const MANUAL_MODULE = 'virtual:manual-files';

/**
 * `virtual:manual-files`: the text of every manual/<layer>/<id>.md, keyed by `manual/<layer>/<id>.md`.
 * A production build (`vite build` without VITE_DEBUG=1) leaves out files whose header says `status: draft`, so
 * drafts never reach the shipped bundle. The dev server, the debug build and tests get every file.
 * A file whose header can't be read as a draft is kept, and the parser then rejects it loudly.
 */
function manualFiles(): Plugin {
  let showDrafts = false;
  const resolved = `\0${MANUAL_MODULE}`;
  return {
    name: 'nullion-manual-files',
    config(_, { command }) {
      showDrafts = command === 'serve' || process.env.VITE_DEBUG === '1';
    },
    resolveId: (id) => (id === MANUAL_MODULE ? resolved : undefined),
    load(id) {
      if (id !== resolved) return undefined;
      const files: Record<string, string> = {};
      for (const layer of readdirSync(MANUAL_DIR, { withFileTypes: true })) {
        if (!layer.isDirectory()) continue;
        for (const f of readdirSync(resolve(MANUAL_DIR, layer.name))) {
          if (!f.endsWith('.md')) continue;
          const abs = resolve(MANUAL_DIR, layer.name, f);
          this.addWatchFile(abs);
          const text = readFileSync(abs, 'utf8');
          if (!showDrafts && /^id: .* · status: draft$/m.test(text)) continue;
          files[`manual/${layer.name}/${f}`] = text;
        }
      }
      return `export default ${JSON.stringify(files)};`;
    },
    configureServer(server) {
      server.watcher.add(MANUAL_DIR);
      const reload = (file: string) => {
        if (!file.startsWith(MANUAL_DIR)) return;
        const mod = server.moduleGraph.getModuleById(resolved);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      for (const ev of ['add', 'unlink', 'change'] as const) server.watcher.on(ev, reload);
    },
  };
}

// base './' so the build works from any GitHub Pages path (user.github.io/nullion/ or a custom domain).
const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

export default defineConfig({
  base: './',
  // The build's version and stage, shown small at the foot of the end card (src/ui/end-card.ts).
  define: { __APP_VERSION__: JSON.stringify(pkg.version), __APP_STAGE__: JSON.stringify('alpha') },
  plugins: [manualFiles()],
  test: { environment: 'node' },
});
