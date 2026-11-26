import '@fontsource/silkscreen/400.css';
import '@fontsource/vt323/400.css';
import './style.css';
import { buildAnswerSet, type AnswerSet } from './core/answers';
import { enforce } from './core/enforce';
import { formatLocalDate, parseLocalDate, puzzleNumber } from './core/day';
import { SAMPLE_QUESTIONS, SAMPLE_TERMS } from './data/sample';
import { PILOT_TERMS } from './data/pilot';
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

const SETS: Record<string, AnswerSet> = {
  sample: buildAnswerSet('sample', 'Hand-written sample', SAMPLE_TERMS, SAMPLE_QUESTIONS),
  pilot: buildAnswerSet('pilot', 'Pilot: corpus-scored locks + data structures', PILOT_TERMS, SAMPLE_QUESTIONS),
};

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

  const restart = () => {
    const s = activeSettings();
    const set = SETS[s.answerSet] ?? SETS.sample!;
    const date = s.date ? parseLocalDate(s.date) : new Date();
    game = new Game(set, puzzleNumber(date), { timer: s.timer, unlimited: s.unlimited, autocorrect: prefs.get().autocorrect });
    // The world is seeded once per day: everyone sees the same arrangement, and it changes at rollover.
    scene.setWorldSeed(seedOverride ?? puzzleNumber(date));
    hud.setGame(game, formatLocalDate(date));
    hud.setScrollMode(s.mode === 'scroll');
    scene.setTarget(0, true);
    sound.setPuzzleSeed(puzzleNumber(date));
    sound.setLayer('application');
  };

  // A preference change applies to the game in progress; it never restarts the day.
  prefs.subscribe((p) => {
    game.opts.autocorrect = p.autocorrect;
    sound.setMode(p.sound);
    sound.setVolume(p.volume);
  });

  hud.bind(scene, () => performance.now());
  restart();

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

boot().catch((err: unknown) => {
  // A boot failure is a bug: show it on the page, not just in a console nobody has open.
  document.body.innerHTML = `<pre style="color:#ff5f7a;padding:16px;white-space:pre-wrap">nullion failed to boot:\n${String(err instanceof Error ? (err.stack ?? err.message) : err)}</pre>`;
  throw err;
});
