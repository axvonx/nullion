// @vitest-environment happy-dom
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { buildAnswerSet } from '../core/answers';
import { PROMPTS_PER_DAY } from '../core/layers';
import { TIERS, TIER_IDS } from '../core/tiers';
import { SAMPLE_QUESTIONS, SAMPLE_TERMS } from '../data/sample';
import { ANSWER_MS, Game, READ_MS } from '../game/game';
import { looks } from '../looks';
import { prefs } from '../prefs';
import type { Scene } from '../render/scene';
import { Hud } from './hud';

/**
 * The HUD's flow against the real Game and answer set, with a recording stand-in for the canvas scene:
 * reveals and "Unwind further", timeouts, the last round into the end card, Enter and double presses,
 * duplicates, typo confirmation, reduced motion, and the backtrace card.
 */

const SET = buildAnswerSet('sample', 'sample', SAMPLE_TERMS, SAMPLE_QUESTIONS);

beforeAll(() => {
  // Tier icons draw on a canvas; happy-dom has none, so give it a no-op 2D context.
  const ctx = new Proxy({}, { get: () => () => undefined, set: () => true });
  HTMLCanvasElement.prototype.getContext = (() => ctx) as never;
  HTMLCanvasElement.prototype.toDataURL = () => 'data:,';
});

class FakeScene {
  diving = false;
  displayDepth = 0;
  fx = { jiggle: 0, freeze: false, hang: false, flip: 'none' as const };
  vignette: boolean[] = [];
  holds: boolean[] = [];
  unstickCalls: (boolean | undefined)[] = [];
  dives: { to: number; tier: string; frames: number }[] = [];
  introDives = 0;
  rejectNudges = 0;
  lowTimes: boolean[] = [];
  onLayerChange: unknown;
  introDive() {
    this.introDives++;
  }
  rejectNudge() {
    this.rejectNudges++;
  }
  setLowTime(on: boolean) {
    this.lowTimes.push(on);
  }
  triggerTitleGlitch() {}
  clearTitleGlitches() {}
  setVignette(on: boolean) {
    this.vignette.push(on);
  }
  setHold(on: boolean, unstickZLayers?: boolean) {
    this.holds.push(on);
    if (!on) this.unstickCalls.push(unstickZLayers);
  }
  markCss() {
    return { top: 250, bottom: 320 };
  }
  diveTo(to: number, tier: string, frames: number) {
    this.dives.push({ to, tier, frames });
    this.displayDepth = to;
  }
  react() {}
  setTarget(d: number) {
    this.displayDepth = d;
  }
}

function setup(opts: Partial<{ unlimited: boolean; autocorrect: 'confirm' | 'auto' }> = {}) {
  document.body.innerHTML = '<div id="app"></div>';
  const mount = document.getElementById('app')!;
  const hud = new Hud(mount);
  const scene = new FakeScene();
  let now = 0;
  hud.bind(scene as unknown as Scene, () => now);
  const game = new Game(SET, 1, { timer: true, unlimited: opts.unlimited ?? false, autocorrect: opts.autocorrect ?? 'confirm' });
  hud.setGame(game, '2026-11-26');
  game.start(now);
  const $ = <T extends HTMLElement>(sel: string) => mount.querySelector<T>(sel)!;
  const step = (ms = 16) => {
    now += ms;
    game.tick(now);
    hud.update(now, scene.displayDepth);
  };
  const toAnswering = () => {
    step(READ_MS + 1);
    step();
    expect(game.phase.kind).toBe('answering');
  };
  const submit = (text: string) => {
    $<HTMLInputElement>('#guess').value = text;
    $<HTMLFormElement>('form').dispatchEvent(new Event('submit', { cancelable: true }));
    step();
  };
  const answerFor = (tier?: string) => {
    const tag = game.current()!.question.tag;
    const t = SAMPLE_TERMS.find((t) => t.tags[tag] && (!tier || t.tags[tag] === tier)) ?? SAMPLE_TERMS.find((t) => t.tags[tag])!;
    return t.name;
  };
  const revealUp = () => !$('.reveal').hidden && mount.classList.contains('unwinding');
  const unwind = () => {
    $<HTMLButtonElement>('.rv-next').click();
    step();
  };
  const round = () => (game.phase.kind === 'done' || game.phase.kind === 'ready' ? -1 : game.phase.round);
  return { hud, scene, game, mount, $, step, toAnswering, submit, answerFor, revealUp, unwind, round, timeOut: () => step(ANSWER_MS + 10) };
}

beforeEach(() => {
  looks.set({ motion: 'full' });
  prefs.set({ autocorrect: 'confirm', sound: 'full', volume: 'medium', motion: 'system' });
});

describe('HUD flow', () => {
  it('opens the reveal after an accepted answer and waits for Unwind further', () => {
    const h = setup();
    h.toAnswering();
    h.submit(h.answerFor());
    expect(h.game.phase.kind).toBe('between');
    expect(h.revealUp()).toBe(true);
    expect(h.scene.holds.at(-1)).toBe(true);
    // No timer: it stays up.
    h.step(30_000);
    expect(h.revealUp()).toBe(true);
    expect(document.activeElement?.classList.contains('rv-next')).toBe(true);
    h.unwind();
    expect(h.revealUp()).toBe(false);
    expect(h.scene.holds.at(-1)).toBe(false);
    expect(h.game.phase.kind).toBe('reading');
    expect(h.round()).toBe(1);
  });

  it('waits for the dive to land before revealing', () => {
    const h = setup();
    h.toAnswering();
    h.scene.diving = true;
    h.submit(h.answerFor());
    expect(h.revealUp()).toBe(false);
    h.scene.diving = false;
    h.step();
    expect(h.revealUp()).toBe(true);
  });

  it('a timeout gets its own reveal, then Unwind moves on', () => {
    const h = setup();
    h.toAnswering();
    h.timeOut();
    expect(h.game.phase.kind).toBe('between');
    expect(h.revealUp()).toBe(true);
    expect(h.$('.reveal').classList.contains('low-key')).toBe(true);
    expect(h.$('[data-el="rvName"]').textContent).toBe('Time’s up');
    // One short line, not two saying the same thing.
    expect(h.$('[data-el="rvAnswer"]').textContent).toBe('');
    h.unwind();
    expect(h.round()).toBe(1);
  });

  it('a double press of Unwind moves on exactly one round', () => {
    const h = setup();
    h.toAnswering();
    h.submit(h.answerFor());
    const btn = h.$<HTMLButtonElement>('.rv-next');
    btn.click();
    btn.click();
    h.step();
    expect(h.round()).toBe(1);
    expect(h.game.phase.kind).toBe('reading');
  });

  it('Enter while the reveal is up unwinds once and never submits behind it', () => {
    const h = setup();
    h.toAnswering();
    h.submit(h.answerFor());
    const form = h.$<HTMLFormElement>('form');
    form.dispatchEvent(new Event('submit', { cancelable: true }));
    h.step();
    expect(h.revealUp()).toBe(false);
    expect(h.round()).toBe(1);
    expect(h.game.phase.kind).toBe('reading');
  });

  it('Unwind on the last accepted answer leads to the end card', () => {
    const h = setup();
    for (let r = 0; r < 7; r++) {
      h.toAnswering();
      h.submit(h.answerFor());
      expect(h.revealUp()).toBe(true);
      h.unwind();
    }
    expect(h.game.phase.kind).toBe('done');
    expect(h.$('[data-el="result"]').hidden).toBe(false);
    expect(h.revealUp()).toBe(false);
    // Unwinding earlier rounds unsticks z-layers; the last round leaves them parked behind the end card.
    expect(h.scene.unstickCalls.slice(0, 6).every((v) => v === true)).toBe(true);
    expect(h.scene.unstickCalls.at(-1)).toBe(false);
  });

  it('a timeout on the last round leads to the end card, with a timeout row at #0', () => {
    const h = setup();
    for (let r = 0; r < 6; r++) {
      h.toAnswering();
      h.submit(h.answerFor());
      h.unwind();
    }
    h.toAnswering();
    h.timeOut();
    expect(h.revealUp()).toBe(true);
    h.unwind();
    expect(h.game.phase.kind).toBe('done');
    const rows = [...h.mount.querySelectorAll<HTMLButtonElement>('.bt-row')];
    expect(rows).toHaveLength(7);
    expect(rows[0]!.getAttribute('aria-label')).toBe('#0: timed out, no frames');
    expect(rows[0]!.classList.contains('timeout')).toBe(true);
  });

  it('a duplicate answer is reported and pushes nothing', () => {
    const h = setup({ unlimited: true });
    h.toAnswering();
    const a = h.answerFor();
    h.submit(a);
    const dives = h.scene.dives.length;
    h.submit(a);
    expect(h.$('[data-el="feedback"]').textContent).toMatch(/already on the stack/);
    expect(h.scene.dives.length).toBe(dives);
  });

  it('reduced motion: the panels go still and the reveal still waits for its button', () => {
    looks.set({ motion: 'reduced' });
    const h = setup();
    h.toAnswering();
    h.submit(h.answerFor());
    expect(h.mount.classList.contains('still')).toBe(true);
    expect(h.revealUp()).toBe(true);
    expect(h.scene.vignette.at(-1)).toBe(true);
    h.step(10_000);
    expect(h.revealUp()).toBe(true);
  });
});

describe('typo correction', () => {
  /** A typo of an answer to the current question that the matcher corrects (drop one inner letter). */
  function typoFor(h: ReturnType<typeof setup>): { typo: string; name: string } {
    const q = h.game.current()!.question;
    for (const t of SAMPLE_TERMS.filter((t) => t.tags[q.tag] && t.name.length >= 6)) {
      for (let i = 1; i < t.name.length - 1; i++) {
        const typo = t.name.slice(0, i) + t.name.slice(i + 1);
        const r = SET.check(q.id, typo);
        if (r.kind === 'accepted' && r.corrected) return { typo, name: r.entry.name };
      }
    }
    throw new Error(`no correctable typo for ${q.id}`);
  }

  it('ask first: corrects in place, then Enter accepts the correction', () => {
    const h = setup();
    h.toAnswering();
    const { typo, name } = typoFor(h);
    h.submit(typo);
    const input = h.$<HTMLInputElement>('#guess');
    expect(h.game.phase.kind).toBe('answering');
    expect(input.value).toBe(name);
    expect(input.classList.contains('corrected')).toBe(true);
    expect(h.$('[data-el="feedback"]').textContent).toBe(`Corrected to '${name}'. Press Enter to submit.`);
    h.$<HTMLFormElement>('form').dispatchEvent(new Event('submit', { cancelable: true }));
    h.step();
    expect(h.game.phase.kind).toBe('between');
    expect(h.game.current()!.locked!.entry.name).toBe(name);
  });

  it('ask first: editing the correction makes it a new guess', () => {
    const h = setup();
    h.toAnswering();
    const { typo } = typoFor(h);
    h.submit(typo);
    const input = h.$<HTMLInputElement>('#guess');
    input.value = 'definitely not an answer';
    input.dispatchEvent(new Event('input'));
    expect(input.classList.contains('corrected')).toBe(false);
    h.$<HTMLFormElement>('form').dispatchEvent(new Event('submit', { cancelable: true }));
    h.step();
    expect(h.game.phase.kind).toBe('answering');
    expect(h.game.current()!.rejected).toContain('definitely not an answer');
  });

  it('auto: accepts the correction straight away with a "read as" note', () => {
    const h = setup({ autocorrect: 'auto' });
    h.toAnswering();
    const { typo, name } = typoFor(h);
    h.submit(typo);
    expect(h.game.phase.kind).toBe('between');
    expect(h.$('[data-el="feedback"]').textContent).toBe(`read as '${name}'`);
  });

  it('the settings popover switches the preference and the header mute button toggles sound', () => {
    const h = setup();
    h.$<HTMLButtonElement>('.prefs-btn').click();
    expect(h.$('.prefs-pop').hidden).toBe(false);
    const auto = h.mount.querySelector<HTMLInputElement>('input[name="pref-autocorrect"][value="auto"]')!;
    auto.checked = true;
    auto.dispatchEvent(new Event('change'));
    expect(prefs.get().autocorrect).toBe('auto');

    const muteBtn = h.$<HTMLButtonElement>('.sound-btn');
    expect(prefs.get().sound).toBe('full');
    muteBtn.click();
    expect(prefs.get().sound).toBe('off');
    expect(muteBtn.getAttribute('aria-pressed')).toBe('true');
    muteBtn.click();
    expect(prefs.get().sound).toBe('full');
    expect(muteBtn.getAttribute('aria-pressed')).toBe('false');
  });
});

describe('end card', () => {
  it('lists the backtrace most recent first, with frame numbers and timeout rows', () => {
    const h = setup();
    h.hud.endOfDay(
      [
        { tier: 'race', name: 'mutex' },
        { timedOut: true },
        { tier: 'npe', name: 'spinlock' },
      ],
      7,
      1,
    );
    const rows = [...h.mount.querySelectorAll<HTMLButtonElement>('.bt-row')];
    expect(rows.map((r) => r.getAttribute('aria-label'))).toEqual([
      `#0: ${TIERS.npe.name}, spinlock, frames 6–7`,
      '#1: timed out, no frames',
      `#2: ${TIERS.race.name}, mutex, frames 1–5`,
    ]);
    expect(rows.every((r) => r.querySelector('.bt-more'))).toBe(true);
    // A tap pins a row open; another closes it.
    rows[0]!.click();
    expect(rows[0]!.getAttribute('aria-expanded')).toBe('true');
    rows[0]!.click();
    expect(rows[0]!.getAttribute('aria-expanded')).toBe('false');
    expect(h.mount.querySelector('.glyphs')).toBeNull();
    const issueLinks = [...h.mount.querySelectorAll<HTMLAnchorElement>('.result-links .issue-link')];
    expect(issueLinks).toHaveLength(2);
    expect(issueLinks[0]!.href).toContain('github.com/axvonx/nullion/issues/new');
    expect(issueLinks[1]!.href).toContain('question-idea');
  });

  it('shows "Your stats" from the stats source, and hides it with none, for Endless or without storage', () => {
    const h = setup();
    const stats = { played: 4, streak: 3, bestStreak: 5, avgDepth: 33, bestDepth: 61, tiers: Object.fromEntries(TIER_IDS.map((t, i) => [t, i])) } as never;
    const game = new Game(SET, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    h.hud.setGame(game, '2026-11-26', () => ({ kind: 'ok', stats }));
    h.hud.endOfDay([{ tier: 'race', name: 'mutex' }], 5, 1);
    const box = h.mount.querySelector<HTMLElement>('[data-el="stats"]')!;
    expect(box.hidden).toBe(false);
    expect(box.textContent).toContain('Your stats');
    expect(box.textContent).toMatch(/4played/);
    expect(box.textContent).toMatch(/3streak/);
    expect(box.querySelectorAll('.stats-dist li')).toHaveLength(TIER_IDS.length);
    expect(h.mount.querySelector('.stats-warn')).toBeNull();

    h.hud.setGame(game, '2026-11-26', () => ({ kind: 'ok', stats, reset: 'not valid JSON' }));
    h.hud.endOfDay([{ tier: 'race', name: 'mutex' }], 5, 1);
    expect(h.mount.querySelector('.stats-warn')!.textContent).toContain('not valid JSON');

    h.hud.setGame(game, '2026-11-26', () => ({ kind: 'none' }));
    h.hud.endOfDay([{ tier: 'race', name: 'mutex' }], 5, 1);
    expect(box.hidden).toBe(true);
    h.hud.setGame(game, '2026-11-26');
    h.hud.endOfDay([{ tier: 'race', name: 'mutex' }], 5, 1);
    expect(box.hidden).toBe(true);
  });

  it('the title rules quote the game constants', () => {
    const h = setup();
    const text = h.mount.querySelector('[data-el="titleRules"]')!.textContent!;
    expect(text).toContain(`${PROMPTS_PER_DAY} prompts a day, ${ANSWER_MS / 1000} seconds each`);
    expect(text).toContain('local midnight');
  });

  it('the share text carries tier glyphs but never the frame scores', async () => {
    const h = setup();
    let copied = '';
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (t: string) => void (copied = t) },
    });
    h.hud.endOfDay([{ tier: 'race', name: 'mutex' }, { timedOut: true }, { tier: 'bitflip', name: 'fissile lock' }], 18, 1);
    h.mount.querySelector<HTMLButtonElement>('[data-el="copy"]')!.click();
    await Promise.resolve();
    expect(copied).toContain(TIERS.race.glyph);
    expect(copied).toContain(TIERS.bitflip.glyph);
    const lines = copied.split('\n');
    expect(lines[0]).toBe('nullion #1');
    expect(lines[1]).toBe('18 stack frames · Kernel');
    expect(lines[2]).not.toMatch(/\d/);
    expect(lines[3]).toBe(location.origin + location.pathname);
    expect(lines).toHaveLength(4);
  });

  it('tracks 7 round slots from "-" to tier-colored frame counts after the dive lands and 0 on timeout', () => {
    const h = setup();
    h.toAnswering();
    const slotTexts = () => [...h.mount.querySelectorAll<HTMLElement>('.slots .slot')].map((s) => s.textContent);
    expect(slotTexts()).toEqual(['-', '-', '-', '-', '-', '-', '-']);
    expect(h.mount.querySelectorAll('.slots .slot')[0]!.classList.contains('active')).toBe(true);

    // Round 0: accept a Race condition (+5) while diving — slot must stay "-" so it doesn't spoil the score!
    h.scene.diving = true;
    h.submit(h.answerFor('race'));
    const slotsMidDive = [...h.mount.querySelectorAll<HTMLElement>('.slots .slot')];
    expect(slotsMidDive[0]!.textContent).toBe('-');
    expect(slotsMidDive[0]!.dataset.tier).toBeUndefined();

    // Once the dive lands, the slot reveals the tier-colored frame count.
    h.scene.diving = false;
    h.step();
    const slotsAfter0 = [...h.mount.querySelectorAll<HTMLElement>('.slots .slot')];
    expect(slotsAfter0[0]!.textContent).toBe('5');
    expect(slotsAfter0[0]!.dataset.tier).toBe('race');

    // Round 1: time out → 0
    h.unwind();
    h.toAnswering();
    h.timeOut();
    const slotsAfter1 = [...h.mount.querySelectorAll<HTMLElement>('.slots .slot')];
    expect(slotsAfter1[1]!.textContent).toBe('0');
    expect(slotsAfter1[1]!.classList.contains('miss')).toBe(true);
  });

  it('shows 3 watchdog fuses in Endless mode and KERNEL PANIC on the 3rd strike', () => {
    const h = setup();
    const endless = new Game(SET, 7, { timer: true, unlimited: false, autocorrect: 'confirm', mode: 'endless' });
    h.hud.setGame(endless, '2026-11-26');
    let toggled = false;
    h.hud.setEndlessToggle(true, true, () => {
      toggled = true;
    });
    const btn = h.$<HTMLButtonElement>('.endless-btn');
    expect(btn.hidden).toBe(false);
    expect(btn.textContent).toBe('Endless: ON');
    btn.click();
    expect(toggled).toBe(true);

    let now = 0;
    endless.start(now);
    h.hud.update(now, 0);
    const fuses = () => [...h.mount.querySelectorAll<HTMLElement>('.slots .fuse')].map((f) => f.textContent);
    expect(fuses()).toEqual(['●', '●', '●']);

    // Burn 3 watchdog strikes
    for (let s = 1; s <= 3; s++) {
      now += READ_MS + 1;
      endless.tick(now);
      h.hud.update(now, endless.depth);
      now += endless.answerMs + 1;
      endless.tick(now);
      h.hud.update(now, endless.depth);
      expect(fuses().filter((c) => c === '×')).toHaveLength(s);
      endless.advance(now);
      h.hud.update(now, endless.depth);
    }
    expect(endless.phase.kind).toBe('done');
    expect(h.$('[data-el="headline"]').textContent).toContain('KERNEL PANIC');
  });
});

describe('console layout', () => {
  it('the low-time seconds live in the prompt line, not on the card corner', () => {
    const h = setup();
    const secs = h.$('[data-el="secs"]');
    expect(secs.parentElement?.classList.contains('prompt-line')).toBe(true);
  });

  it('grays out the prompt input and counts down 3s → 2s → 1s before opening for answers', () => {
    const h = setup();
    const input = h.$<HTMLInputElement>('#guess');
    const consoleEl = h.$('.console');

    h.step(100);
    expect(consoleEl.classList.contains('reading')).toBe(true);
    expect(input.disabled).toBe(true);
    expect(input.placeholder).toBe('Starting in 3s');

    h.step(1000);
    expect(input.placeholder).toBe('Starting in 2s');

    h.step(1000);
    expect(input.placeholder).toBe('Starting in 1s');

    h.step(1000);
    expect(h.game.phase.kind).toBe('answering');
    expect(consoleEl.classList.contains('reading')).toBe(false);
    expect(input.disabled).toBe(false);
    expect(input.placeholder).toBe('type an answer, press Enter');
  });

  it('signals cursor reject nudge, low-time brackets, and reveal ghost text', () => {
    const h = setup();
    h.toAnswering();
    expect(h.scene.lowTimes.at(-1)).toBe(false);

    // Rejected guess nudges the cursor.
    h.submit('not a real answer');
    expect(h.scene.rejectNudges).toBe(1);

    // Watchdog below LOW_TIME triggers low-time cursor brackets.
    h.step(Math.round(ANSWER_MS * 0.8));
    expect(h.scene.lowTimes.at(-1)).toBe(true);

    // Accepting an answer clears low-time and sets rvName.dataset.text for tier reveal typography.
    h.submit(h.answerFor('heisenbug'));
    expect(h.scene.lowTimes.at(-1)).toBe(false);
    const rvName = h.$('[data-el="rvName"]');
    expect(rvName.dataset.text).toBe(TIERS.heisenbug.name);
  });
});

describe('title screen', () => {
  it('shows while the game is ready and dives into round 1 on "Unwind the stack"', () => {
    document.body.innerHTML = '<div id="app"></div>';
    const mount = document.getElementById('app')!;
    const hud = new Hud(mount);
    const scene = new FakeScene();
    let now = 0;
    hud.bind(scene as unknown as Scene, () => now);
    const game = new Game(SET, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    hud.setGame(game, '2026-11-26');
    hud.update(now, 0);

    const title = mount.querySelector<HTMLElement>('[data-el="titleScreen"]')!;
    const startBtn = mount.querySelector<HTMLButtonElement>('[data-el="titleStart"]')!;
    expect(game.phase.kind).toBe('ready');
    expect(title.hidden).toBe(false);
    expect(mount.classList.contains('on-title')).toBe(true);
    expect(startBtn.textContent).toContain('Unwind the stack');
    expect(mount.querySelector('.title-logo')).not.toBeNull();

    // Toggling the tier guide opens and closes it.
    const howBtn = mount.querySelector<HTMLButtonElement>('[data-el="titleHowBtn"]')!;
    const how = mount.querySelector<HTMLElement>('[data-el="titleHow"]')!;
    expect(how.hidden).toBe(true);
    howBtn.click();
    expect(how.hidden).toBe(false);
    expect(mount.querySelectorAll('.title-tiers li')).toHaveLength(7);

    // Clicking "Unwind the stack" triggers the intro dive and starts round 1.
    startBtn.click();
    expect(game.phase.kind).toBe('reading');
    expect(scene.introDives).toBe(1);
    expect(mount.classList.contains('on-title')).toBe(false);
  });

  it('hides in scroll mode', () => {
    document.body.innerHTML = '<div id="app"></div>';
    const mount = document.getElementById('app')!;
    const hud = new Hud(mount);
    const scene = new FakeScene();
    hud.bind(scene as unknown as Scene, () => 0);
    const game = new Game(SET, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    hud.setGame(game, '2026-11-26');
    hud.setScrollMode(true);
    hud.update(0, 0);

    expect(mount.classList.contains('on-title')).toBe(false);
  });
});

describe('resume and end-card extras', () => {
  const finishedSnapshot = () => {
    const g = new Game(SET, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    let t = 0;
    g.start(t);
    for (let i = 0; i < 7; i++) {
      t += READ_MS;
      g.tick(t);
      g.submit(SET.entries(g.rounds[i]!.question.id).find((e) => e.tier === 'bitflip')!.name, t);
      g.advance(t);
    }
    return g.snapshot();
  };

  function mountWith(game: Game, clock: () => number) {
    document.body.innerHTML = '<div id="app"></div>';
    const mount = document.getElementById('app')!;
    const hud = new Hud(mount);
    hud.bind(new FakeScene() as unknown as Scene, clock);
    hud.setGame(game, '2026-11-26');
    return { hud, mount };
  }

  it('a finished day restored from a save opens on the end card, not a fresh game', () => {
    const g = new Game(SET, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    g.restore(finishedSnapshot());
    const { hud, mount } = mountWith(g, () => 0);
    hud.update(0, 91);
    expect(mount.querySelector<HTMLElement>('[data-el="result"]')!.hidden).toBe(false);
    expect(mount.querySelector<HTMLElement>('[data-el="titleScreen"]')!.hidden).toBe(true);
    expect(mount.querySelectorAll('.bt-row')).toHaveLength(7);
  });

  it('the end card counts down to local midnight, then offers a reload', () => {
    const g = new Game(SET, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    g.restore(finishedSnapshot());
    const evening = new Date(2026, 10, 26, 22, 30, 0).getTime(); // puzzle #1 (the epoch day)
    const { hud, mount } = mountWith(g, () => evening);
    const el = mount.querySelector<HTMLElement>('[data-el="nextDay"]')!;
    hud.update(0, 91, evening);
    expect(el.textContent).toBe('Next stack in 1:30:00');
    hud.update(16, 91, evening + 60_000);
    expect(el.textContent).toBe('Next stack in 1:29:00');
    hud.update(32, 91, new Date(2026, 10, 27, 0, 0, 1).getTime());
    expect(el.querySelector('button')?.textContent).toContain('reload');
  });

  it('a debug-date game gets no countdown', () => {
    const g = new Game(SET, 5, { timer: true, unlimited: false, autocorrect: 'confirm' });
    const { hud, mount } = mountWith(g, () => new Date(2026, 10, 26, 22, 0, 0).getTime());
    hud.notify('x');
    hud.update(0, 0);
    expect(mount.querySelector('[data-el="nextDay"]')!.textContent).toBe('A new stack opens at local midnight.');
  });

  it('notify shows a dismissible notice', () => {
    const g = new Game(SET, 1, { timer: true, unlimited: false, autocorrect: 'confirm' });
    const { hud, mount } = mountWith(g, () => 0);
    const n = mount.querySelector<HTMLElement>('[data-el="notice"]')!;
    expect(n.hidden).toBe(true);
    hud.notify('Your saved game could not be restored. Starting fresh.');
    expect(n.hidden).toBe(false);
    expect(n.textContent).toContain('Starting fresh');
    mount.querySelector<HTMLButtonElement>('[data-el="noticeClose"]')!.click();
    expect(n.hidden).toBe(true);
  });
});
