import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vitest/config';

const WRITING_DIR = resolve(import.meta.dirname, 'writing');
const MANUAL_DIR = resolve(WRITING_DIR, 'manual');
const MANUAL_MODULE = 'virtual:manual-files';

/**
 * `virtual:manual-files`: the text of every writing/manual/<layer>/<id>.md, keyed by `writing/manual/<layer>/<id>.md`.
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
          files[`writing/manual/${layer.name}/${f}`] = text;
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

const WRITING_MODULE = 'virtual:writing';
/** Top-level writing/ files that are about the writing, not game text. */
const WRITING_GUIDES = new Set(['README.md', 'VOICE.md']);

/**
 * `virtual:writing`: the text of every top-level writing/<surface>.md (not README.md / VOICE.md, not writing/manual/,
 * which `virtual:manual-files` carries), keyed by `writing/<surface>.md`. Unlike the manual, drafts ship: this is
 * the game's own text. Debug-only text stays in code, so nothing here is debug-only.
 */
function writingFiles(): Plugin {
  const resolved = `\0${WRITING_MODULE}`;
  return {
    name: 'nullion-writing',
    resolveId: (id) => (id === WRITING_MODULE ? resolved : undefined),
    load(id) {
      if (id !== resolved) return undefined;
      const files: Record<string, string> = {};
      for (const f of readdirSync(WRITING_DIR, { withFileTypes: true })) {
        if (!f.isFile() || !f.name.endsWith('.md') || WRITING_GUIDES.has(f.name)) continue;
        const abs = resolve(WRITING_DIR, f.name);
        this.addWatchFile(abs);
        files[`writing/${f.name}`] = readFileSync(abs, 'utf8');
      }
      return `export default ${JSON.stringify(files)};`;
    },
    configureServer(server) {
      server.watcher.add(WRITING_DIR);
      const reload = (file: string) => {
        if (!file.startsWith(WRITING_DIR) || file.startsWith(MANUAL_DIR)) return;
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
  // The version lives in package.json only; src/version.ts is where the code reads it.
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  plugins: [manualFiles(), writingFiles()],
  test: { environment: 'node' },
});
