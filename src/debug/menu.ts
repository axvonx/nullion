import type { AnswerSetSource } from '../core/answers';
import { LAYERS, MAX_DEPTH } from '../core/layers';
import { TIERS } from '../core/tiers';
import type { Game } from '../game/game';
import { LOOK_SLOTS, looks, type LookSlot } from '../looks';
import type { Scene } from '../render/scene';
import type { Hud } from '../ui/hud';
import { settings } from '../settings';
import './menu.css';
import { mountRail } from './rail';

export interface DebugHooks {
  scene: Scene;
  hud: Hud;
  game(): Game;
  restart(): void;
  sets: Record<string, AnswerSetSource>;
}

/** Debug build only. Everything here is generated from the settings, looks and tier tables. */
export function mountDebugMenu(h: DebugHooks) {
  const btn = document.createElement('button');
  btn.className = 'dbg-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Debug menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = '🐞';

  const panel = document.createElement('aside');
  panel.className = 'dbg-panel';
  panel.hidden = true;
  document.body.append(btn, panel);
  mountRail(h);

  btn.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    btn.setAttribute('aria-expanded', String(!panel.hidden));
    if (!panel.hidden) render();
  });

  function section(title: string) {
    const s = document.createElement('section');
    const h3 = document.createElement('h3');
    h3.textContent = title;
    s.append(h3);
    panel.append(s);
    return s;
  }

  function row(parent: HTMLElement, label: string, control: HTMLElement) {
    const l = document.createElement('label');
    l.className = 'dbg-row';
    const span = document.createElement('span');
    span.textContent = label;
    l.append(span, control);
    parent.append(l);
  }

  function select(options: Record<string, string>, value: string, onChange: (v: string) => void) {
    const s = document.createElement('select');
    for (const [k, v] of Object.entries(options)) s.add(new Option(v, k, false, k === value));
    s.addEventListener('change', () => onChange(s.value));
    return s;
  }

  function check(value: boolean, onChange: (v: boolean) => void) {
    const c = document.createElement('input');
    c.type = 'checkbox';
    c.checked = value;
    c.addEventListener('change', () => onChange(c.checked));
    return c;
  }

  function button(label: string, onClick: () => void) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }

  function render() {
    panel.innerHTML = '';
    const st = settings.get();

    const play = section('Play');
    row(play, 'Mode', select({ play: 'Play', scroll: 'Scroll only (no answers)' }, st.mode, (v) => settings.set({ mode: v as 'play' | 'scroll' })));
    const date = document.createElement('input');
    date.type = 'date';
    date.value = st.date;
    date.addEventListener('change', () => settings.set({ date: date.value }));
    row(play, 'Date (blank = today)', date);
    row(play, 'Watchdog timer', check(st.timer, (v) => settings.set({ timer: v })));
    row(play, 'Unlimited answers', check(st.unlimited, (v) => settings.set({ unlimited: v })));
    row(play, 'Answer set', select(Object.fromEntries(Object.values(h.sets).map((s) => [s.id, s.label])), st.answerSet, (v) => settings.set({ answerSet: v })));
    const actions = document.createElement('div');
    actions.className = 'dbg-buttons';
    actions.append(
      button('Restart day', () => h.restart()),
      button('Next round', () => h.game().advance(performance.now())),
    );
    play.append(actions);

    const depth = section('Depth');
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = String(MAX_DEPTH + 4);
    slider.step = '0.5';
    slider.value = String(Math.round(h.scene.displayDepth * 2) / 2);
    const out = document.createElement('output');
    out.textContent = slider.value;
    slider.addEventListener('input', () => {
      h.scene.setTarget(Number(slider.value));
      out.textContent = slider.value;
    });
    row(depth, 'Frames', slider);
    depth.append(out);
    const jumps = document.createElement('div');
    jumps.className = 'dbg-buttons';
    for (const l of LAYERS) jumps.append(button(l.name, () => h.scene.setTarget(l.from + 0.5)));
    depth.append(jumps);

    const lk = section('Looks');
    const state = looks.get();
    for (const slot of Object.keys(LOOK_SLOTS) as LookSlot[]) {
      const def = LOOK_SLOTS[slot];
      row(lk, def.label, select(def.options as Record<string, string>, String(state[slot]), (v) => looks.set({ [slot]: v } as never)));
    }
    lk.append(button('Reset looks', () => {
      looks.set(Object.fromEntries(Object.entries(LOOK_SLOTS).map(([k, v]) => [k, v.default])) as never);
      render();
    }));

    const log = section('Rejected guesses (this day)');
    const g = h.game();
    const rejected = g.rounds.flatMap((r) => r.rejected.map((guess) => ({ question: r.question.id, guess })));
    const pre = document.createElement('pre');
    pre.textContent = rejected.length ? rejected.map((x) => `${x.question}: ${x.guess}`).join('\n') : 'None yet.';
    log.append(pre, button('Copy as JSON', () => void navigator.clipboard.writeText(JSON.stringify(rejected, null, 2))));

    const ans = section('Answers for the current question');
    const cur = g.current();
    const details = document.createElement('details');
    const sum = document.createElement('summary');
    sum.textContent = cur ? `${cur.question.prompt} (${g.set.entries(cur.question.id).length})` : 'No round in progress';
    details.append(sum);
    if (cur) {
      const ul = document.createElement('ul');
      for (const e of [...g.set.entries(cur.question.id)].sort((a, b) => TIERS[a.tier].frames - TIERS[b.tier].frames)) {
        const li = document.createElement('li');
        li.dataset.tier = e.tier;
        li.textContent = `${e.name} · ${TIERS[e.tier].name}`;
        ul.append(li);
      }
      details.append(ul);
    }
    ans.append(details);
  }

  // Keep the panel's log and answer list fresh while it's open.
  setInterval(() => {
    if (!panel.hidden && !panel.contains(document.activeElement)) render();
  }, 1500);
}
