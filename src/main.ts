import { VERSION } from './version';
import '@fontsource/silkscreen/400.css';
import '@fontsource/vt323/400.css';
import './style.css';
import { buildAnswerSet, type AnswerSetSource } from './core/answers';
import { manualStore } from './game/manual';
import { enforce } from './core/enforce';
import { formatLocalDate, parseLocalDate, pickForDay, puzzleNumber } from './core/day';
import { PROMPTS_PER_DAY } from './core/layers';
import { layerAt, rulesFor } from './core/modes';
import { SAMPLE_QUESTIONS, SAMPLE_TERMS } from './data/sample';
import { BANK_QUESTIONS, loadBankTerms, scheduledQuestions } from './data/bank';
import { browserStorage, canPersistDaily, clearDaily, loadDaily, saveDaily, type SaveStorage } from './game/daily-save';
import { Game } from './game/game';
import { finishDaily } from './game/stats';
import { LOOK_SLOTS, looks, type LookSlot } from './looks';
import { Scene } from './render/scene';
import { DEFAULT_SETTINGS, settings, type Settings } from './settings';
import { prefs } from './prefs';
import { sound } from './audio/sound';
import { startFavicon } from './ui/favicon';
import { Hud } from './ui/hud';

/**
 * Dev server and `npm run build:debug` include the 🐞 menu; `npm run build` strips it. Kept as a local constant
 * (not imported from keys.ts): the bundler only drops the dynamic import of ./debug/menu when it sees the literal.
 */
const DEBUG = import.meta.env.DEV || import.meta.env.VITE_DEBUG === '1';

const SETS: Record<string, AnswerSetSource> = {
  bank: {
    id: 'bank',
    label: 'Answer bank (approved categories in bank/)',
    pool: BANK_QUESTIONS,
    // A frozen per-day schedule, so approving categories never reshuffles a day already in play.
    daily: scheduledQuestions,
    load: async (qs) => buildAnswerSet('bank', 'Answer bank', await loadBankTerms(qs.map((q) => q.id)), qs),
  },
  sample: {
    id: 'sample',
    label: 'Hand-written sample (src/data/sample.ts)',
    pool: SAMPLE_QUESTIONS,
    daily: (puzzle) => pickForDay(SAMPLE_QUESTIONS, puzzle, PROMPTS_PER_DAY),
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

/**
 * The game clock. Wall-clock time, so a round's deadline keeps running while the page is closed, reloaded or
 * hidden (performance.now() would restart or pause). Injected into the pure game logic; never read from src/game.
 */
const clock = () => Date.now();

async function boot() {
  const mount = document.getElementById('app');
  enforce(mount, '#app missing');
  // Canvas text needs the pixel font loaded before the first frame, or it falls back silently.
  await Promise.all([document.fonts.load('8px Silkscreen'), document.fonts.load('20px VT323')]);
  startFavicon();
  sound.setMode(prefs.get().sound);
  sound.setVolume(prefs.get().volume);
  // `nullion.version` in the browser console says which build is running (quote it in bug reports).
  (window as unknown as { nullion: { version: string } }).nullion = { version: VERSION };
  window.addEventListener('pointerdown', () => sound.unlock(), { once: true });
  window.addEventListener('keydown', () => sound.unlock(), { once: true });

  const hud = new Hud(mount);
  const scene = new Scene(hud.canvasEl);
  let game!: Game;
  // Debug deep link: ?seed=N pins v4's world seed (otherwise it is the day's puzzle number).
  const seedParam = DEBUG ? new URLSearchParams(location.search).get('seed') : null;
  const seedOverride = seedParam === null ? undefined : Number(seedParam);
  if (seedOverride !== undefined) enforce(Number.isInteger(seedOverride), `?seed must be an integer, got ${seedParam}`);
  // The daily save: set per game by startDay(). Null whenever this game must not touch it.
  const storage = browserStorage();
  let persistTo: SaveStorage | null = null;
  let persisting = false;
  let savedRev = 0;
  const flushSave = () => {
    if (persisting && game.rev !== savedRev) {
      saveDaily(persistTo, game);
      savedRev = game.rev;
    }
  };
  // The `?endless=` URL param and the debug dropdown name a mode by string: identity, not a rule, so compared here.
  const endlessParam = DEBUG ? new URLSearchParams(location.search).get('endless') : null;
  let endlessDebugMode: 'off' | 'endless' | 'true-endless' =
    endlessParam === 'true' ? 'true-endless' : endlessParam === '1' ? 'endless' : 'off';


  // Restarts load their categories asynchronously; a newer restart supersedes an older one still loading.
  let restartGen = 0;
  const startDay = async (fresh = false) => {
    const gen = ++restartGen;
    const s = activeSettings();
    const source = SETS[s.answerSet] ?? SETS.bank!;
    const date = s.date ? parseLocalDate(s.date) : new Date();
    const daySeed = puzzleNumber(date);
    const mode = endlessDebugMode === 'off' ? 'daily' : endlessDebugMode;
    // Load only what this game asks: the day's prompts, or the whole pool for Endless.
    const rules = rulesFor(mode);
    const questions = rules.promptSource === 'day' ? source.daily(daySeed) : source.pool;
    const set = await source.load(questions);
    if (gen !== restartGen) return;
    game = new Game(set, daySeed, {
      timer: s.timer,
      unlimited: s.unlimited,
      autocorrect: prefs.get().autocorrect,
      mode,
    });
    // Resume today's game after a reload, unless this is Endless, a debug mode, or an explicit debug restart.
    const depthDeepLink = DEBUG && new URLSearchParams(location.search).has('depth');
    persisting = canPersistDaily({ mode, unlimited: s.unlimited, timer: s.timer, date: s.date, scroll: s.mode === 'scroll' || depthDeepLink });
    persistTo = persisting ? storage : null;
    if (fresh) clearDaily(storage, daySeed);
    let notice: { text: string; kind: 'info' | 'error' } | undefined;
    if (persisting && !fresh) {
      const res = loadDaily(persistTo, game);
      if (res.kind === 'invalid') notice = { text: `Your saved game for today could not be restored (${res.reason}). Starting fresh.`, kind: 'error' };
      else if (res.kind === 'resumed' && game.phase.kind !== 'done')
        notice = { text: 'Resumed today’s game. The clock kept running while you were away.', kind: 'info' };
    }
    savedRev = game.rev;
    scene.setStackMode(mode);
    // Everyone sees the same world on a given day: landmarks and scatter are both seeded by the puzzle (or ?seed=N).
    scene.setWorldSeed(seedOverride ?? daySeed, seedOverride ?? daySeed * 997);
    // Only a real daily game counts toward stats: the same rule as the save (Endless and every debug mode never do).
    const counted = game;
    hud.setGame(game, formatLocalDate(date), persisting ? () => finishDaily(storage, counted) : undefined);
    hud.setEndlessMode(DEBUG, endlessDebugMode, (next) => {
      endlessDebugMode = next;
      restart();
    });
    hud.setScrollMode(s.mode === 'scroll' || rules.forcesScrollMode);
    if (notice) hud.notify(notice.text, notice.kind);
    // Field Manual stamps record the day and the prompt being answered; a save it couldn't read is reported once.
    const stampGame = game;
    manualStore.setContext(() => {
      const ph = stampGame.phase;
      const round = 'round' in ph ? stampGame.rounds[ph.round] : undefined;
      return { puzzle: daySeed, ...(round ? { prompt: round.question.prompt } : {}) };
    });
    const manualNotice = manualStore.takeLoadNotice();
    if (manualNotice) hud.notify(manualNotice, 'error');
    scene.setTarget(game.depth, true);
    sound.setPuzzleSeed(daySeed);
    sound.setLayer(rules.soundLayerId ?? layerAt(game.depth, mode).id);
  };

  // A preference change applies to the game in progress; it never restarts the day.
  prefs.subscribe((p) => {
    game.opts.autocorrect = p.autocorrect;
    sound.setMode(p.sound);
    sound.setVolume(p.volume);
  });

  const restart = (fresh = false) => {
    startDay(fresh).catch(showFatal);
  };

  hud.bind(scene, clock);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flushSave();
  });
  window.addEventListener('pagehide', flushSave);
  await startDay();

  // Debug deep link: ?depth=N opens scroll-only mode parked at that depth (not persisted).
  const depthParam = DEBUG ? new URLSearchParams(location.search).get('depth') : null;
  if (depthParam !== null) {
    const d = Number(depthParam);
    enforce(Number.isFinite(d) && d >= 0, `?depth must be a non-negative number, got ${depthParam}`);
    hud.setScrollMode(true);
    scene.setTarget(d, true);
  }
  // Debug deep link: ?look.<slot>=<value> sets a look (and saves it, like the menu does), e.g. ?look.rain=hex.
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
    const wall = clock();
    if (game.tick(wall)) hud.onPhaseChange();
    flushSave();
    hud.update(now, scene.displayDepth, wall);
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  if (DEBUG) {
    settings.subscribe(() => restart());
    const { mountDebugMenu } = await import('./debug/menu');
    mountDebugMenu({ scene, hud, game: () => game, restart: () => restart(true), sets: SETS });
  }
}

boot().catch(showFatal);
