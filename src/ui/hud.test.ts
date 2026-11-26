// @vitest-environment happy-dom
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { buildAnswerSet } from '../core/answers';
import { TIERS } from '../core/tiers';
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
  setHold(on: boolean) {
    this.holds.push(on);
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
  prefs.set({ autocorrect: 'confirm' });
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

  it('the settings popover switches the preference', () => {
    const h = setup();
    h.$<HTMLButtonElement>('.prefs-btn').click();
    expect(h.$('.prefs-pop').hidden).toBe(false);
    const auto = h.mount.querySelector<HTMLInputElement>('input[name="pref-autocorrect"][value="auto"]')!;
    auto.checked = true;
    auto.dispatchEvent(new Event('change'));
    expect(prefs.get().autocorrect).toBe('auto');
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
