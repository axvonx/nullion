import '@fontsource/silkscreen/400.css';
import '@fontsource/vt323/400.css';
import './style.css';
import { buildAnswerSet, type AnswerSetSource } from './core/answers';
import { enforce } from './core/enforce';
import { formatLocalDate, parseLocalDate, pickForDay, puzzleNumber } from './core/day';
import { PROMPTS_PER_DAY } from './core/layers';
import { SAMPLE_QUESTIONS, SAMPLE_TERMS } from './data/sample';
import { BANK_QUESTIONS, loadBankTerms } from './data/bank';
import { Game } from './game/game';
import { LOOK_SLOTS, looks, type LookSlot } from './looks';
import { Scene } from './render/scene';
import { DEFAULT_SETTINGS, settings, type Settings } from './settings';
import { prefs } from './prefs';
import { sound } from './audio/sound';
import { startFavicon } from './ui/favicon';
import { Hud } from './ui/hud';

/** Dev server and `npm run build:debug` include the 🐞 menu; `npm run build` strips it. */
const DEBUG = import.meta.env.DEV || import.meta.env.VITE_DEBUG === '1';

const SETS: Record<string, AnswerSetSource> = {
  bank: {
    id: 'bank',
    label: 'Answer bank (approved categories in bank/)',
    pool: BANK_QUESTIONS,
    load: async (qs) => buildAnswerSet('bank', 'Answer bank', await loadBankTerms(qs.map((q) => q.id)), qs),
  },
  sample: {
    id: 'sample',
    label: 'Hand-written sample (src/data/sample.ts)',
    pool: SAMPLE_QUESTIONS,
    load: async (qs) => buildAnswerSet('sample', 'Hand-written sample', SAMPLE_TERMS, qs),
  },
};

/** A failure after boot is a bug too: show it on the page, not just in a console nobody has open. */
function showFatal(err: unknown): never {
  document.body.innerHTML = `<pre style="color:#ff5f7a;padding:16px;white-space:pre-wrap">nullion failed:\n${String(err instanceof Error ? (err.stack ?? err.message) : err)}</pre>`;
  throw err;
}

function activeSettings(): Settings {
  return DEBUG ? settings.get() : DEFAULT_SETTINGS;
}

async function boot() {
  const mount = document.getElementById('app');
  enforce(mount, '#app missing');
  // Canvas text needs the pixel font loaded before the first frame, or it falls back silently.
  await Promise.all([document.fonts.load('8px Silkscreen'), document.fonts.load('20px VT323')]);
  startFavicon();
  sound.setMode(prefs.get().sound);
  sound.setVolume(prefs.get().volume);
  window.addEventListener('pointerdown', () => sound.unlock(), { once: true });
  window.addEventListener('keydown', () => sound.unlock(), { once: true });

  const hud = new Hud(mount);
  const scene = new Scene(hud.canvasEl);
  let game!: Game;
  // Debug deep link: ?seed=N pins v4's world seed (otherwise it is the day's puzzle number).
  const seedParam = DEBUG ? new URLSearchParams(location.search).get('seed') : null;
  const seedOverride = seedParam === null ? undefined : Number(seedParam);
  if (seedOverride !== undefined) enforce(Number.isInteger(seedOverride), `?seed must be an integer, got ${seedParam}`);
  let endlessMode = DEBUG && new URLSearchParams(location.search).get('endless') === '1';


  // Restarts load their categories asynchronously; a newer restart supersedes an older one still loading.
  let restartGen = 0;
  const startDay = async () => {
    const gen = ++restartGen;
    const s = activeSettings();
    const source = SETS[s.answerSet] ?? SETS.bank!;
    const date = s.date ? parseLocalDate(s.date) : new Date();
    const daySeed = puzzleNumber(date);
    const mode = endlessMode ? 'endless' : 'daily';
    // Load only what this game asks: the day's prompts, or the whole pool for Endless.
    const questions = mode === 'daily' ? pickForDay(source.pool, daySeed, PROMPTS_PER_DAY) : source.pool;
    const set = await source.load(questions);
    if (gen !== restartGen) return;
    game = new Game(set, daySeed, { timer: s.timer, unlimited: s.unlimited, autocorrect: prefs.get().autocorrect, mode });
    scene.setStackMode(mode);
    // Everyone sees the same world on a given day: landmarks and scatter are both seeded by the puzzle (or ?seed=N).
    scene.setWorldSeed(seedOverride ?? daySeed, seedOverride ?? daySeed * 997);
    hud.setGame(game, formatLocalDate(date));
    hud.setEndlessToggle(DEBUG, endlessMode, (next) => {
      endlessMode = next;
      restart();
    });
    hud.setScrollMode(s.mode === 'scroll');
    scene.setTarget(0, true);
    sound.setPuzzleSeed(daySeed);
    sound.setLayer(mode === 'endless' ? 'internet' : 'application');
  };

  // A preference change applies to the game in progress; it never restarts the day.
  prefs.subscribe((p) => {
    game.opts.autocorrect = p.autocorrect;
    sound.setMode(p.sound);
    sound.setVolume(p.volume);
  });

  const restart = () => {
    startDay().catch(showFatal);
  };

  hud.bind(scene, () => performance.now());
  await startDay();

  // Debug deep link: ?depth=N opens scroll-only mode parked at that depth (not persisted).
  const depthParam = DEBUG ? new URLSearchParams(location.search).get('depth') : null;
  if (depthParam !== null) {
    const d = Number(depthParam);
    enforce(Number.isFinite(d) && d >= 0, `?depth must be a non-negative number, got ${depthParam}`);
    hud.setScrollMode(true);
    scene.setTarget(d, true);
  }
  // Debug deep link: ?look.<slot>=<value> sets a look (and saves it, like the menu does), e.g. ?look.artStyle=v1.
  if (DEBUG) {
    for (const [k, v] of new URLSearchParams(location.search)) {
      if (!k.startsWith('look.')) continue;
      const slot = k.slice(5);
      enforce(slot in LOOK_SLOTS, `?${k}: no look slot '${slot}'`);
      const opts = LOOK_SLOTS[slot as LookSlot].options;
      enforce(v in opts, `?${k}=${v}: expected one of ${Object.keys(opts).join(', ')}`);
      looks.set({ [slot]: v } as never);
    }
  }
  // Debug: ?perf=1 measures the scene's frame time and prints it into the page title (read by headless runs).
  if (DEBUG && new URLSearchParams(location.search).has('perf')) (await import('./debug/perf')).measureFrames(scene);
  scene.start();

  const tick = (now: number) => {
    if (game.tick(now)) hud.onPhaseChange();
    hud.update(now, scene.displayDepth);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  if (DEBUG) {
    settings.subscribe(() => restart());
    const { mountDebugMenu } = await import('./debug/menu');
    mountDebugMenu({ scene, hud, game: () => game, restart, sets: SETS });
  }
}

boot().catch(showFatal);
