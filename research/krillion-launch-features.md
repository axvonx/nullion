# Krillion and friends: launch-feature checklist

Researched 2026-11-26. This builds on `research/krillion-internals.md` and does not repeat it.

Sources:
- **krillion.io**: the Next.js JS chunks and page HTML, downloaded earlier into the session scratchpad (`dl-krillion/js/*.js`, `faq.html`). I cite chunks by filename, e.g. `2aysgah32oe75.js` is the daily results page.
- **Algillion** (`electicode.tj/en/algillion`): `dl-algillion/js/page.js` and the SSR i18n dictionary inside `index.html`.
- **Clones:** not re-read this pass, beyond what `krillion-internals.md` already says.

Labels: **VERIFIED** means I read it in a primary source. **INFERRED** means I reasoned it from the evidence given. **UNVERIFIED** means I could not confirm it.

Limitation: I could not call `POST /api/today/complete` live. The permission classifier blocked the probe, so the response shape below comes from client-side validation code only.

---

## 1. Player stats

**krillion.io (VERIFIED)**
- Storage is local only. One localStorage key, `krillion:stats:v1`, holds `{history: {"<YYYY-MM-DD>": {dayNumber, score, tiers[7], results[7], runId?, imported?}}}`. It is defined in `1tddoms9p5x0n.js`.
- The aggregates are not stored. They are recomputed from the history by `statsFromHistory`, which returns `{gamesPlayed, totalScore, bestScore, currentStreak, maxStreak, lastPlayedDate}`.
- Streak rule: consecutive calendar dates. `currentStreak` is the run length only if the last played date is today or yesterday, otherwise 0. `maxStreak` is also computed but never shown.
- Unlimited, archive and pack results go in separate keys (`krillion-unlimited-done`, `krillion-archive-done`, `krillion-pack-<id>-done`). They do not count toward the daily streak.
- Where it shows, in `2aysgah32oe75.js`:
  - The results page has a "logbook" section with one line: `streak N · played N · avg N · best N`. Average is `Math.round(totalScore/gamesPlayed)`, and the label is lowercase "avg".
  - The intro screen shows `dive #134 · streak N`, but only if `gamesPlayed > 0`.
  - A mascot wardrobe unlocks characters at streak thresholds (`unlockStreak`, `259m0dn18gxcj.js`).
- UNVERIFIED: no lifetime tier-distribution stat appeared anywhere in the bundle. The only distribution is the per-day score histogram (section 2).

**Algillion (VERIFIED, `page.js`)**
- The key is `algillion:v1:<key>`, holding `{days: {"<n>": {z: zeros, t: tiers}}, stats: {played, streak, best, sum, last}, cur?, muted}`.
- The streak is `last === today-1 ? streak+1 : 1`.
- The English UI labels are `Played`, `Streak`, `Highest`, `Average`, under the heading "Your flights". They show as four big-number tiles, and only once `played > 0`.

---

## 2. "Averages" and comparison with other players

**krillion.io (VERIFIED, `2aysgah32oe75.js`, `3_1-wnp01rpyp.js`)**
- Server side. When a daily result is shown, the client calls `POST /api/today/complete` with `{date, playerId, score, record, runId?, receipts[7]?}`. `receipts` are the HMAC-signed per-round tokens from `/api/submit`.
- The client accepts a response only if it matches `{betterThan: number, dist: number[]}`, where `dist` is non-empty and every entry is a finite number >= 0 (validated in `3_1-wnp01rpyp.js`). I never saw a live response, so the meaning of the `dist` buckets is UNVERIFIED.
- Wording when only `betterThan` is present: `better than {pct}% of today's players`, in uppercase mono text. The percent has 2 decimals once it is at least 99.5. With `dist`, a histogram component draws the score against everyone else's (module 444, not read).
- Unlimited and pack modes use the same shape against their own endpoints. It is `POST` with `{playerId, score, receipts, runId?, version?}` to `${apiBase}/<n>/complete` (the exact path is UNVERIFIED), plus a `populationLabel`.
- The first completion is claimed once per day. It is cached in `krillion:first-completion:v2:<endpoint>` with `recorded: true`, so replays do not double-count.
- Per-answer popularity is a separate endpoint, `GET /api/answer-popularity?date=`, polled every 45 s on the results page (VERIFIED, `2aysgah32oe75.js`). It only runs for dates on or after 2026-10-01.
- Anonymous identity is `krillion:player:v1`, a local random id.
- There is no global average score in the UI. "Average" is only the player's own mean.

**Algillion (VERIFIED)**
- Dictionary strings: `"beat":"Higher than {p} of today's players"`, `"played":"{n} played today"`, `"playersToday":"{n} played today"`, `"firstToday":"Be the first today"`.
- The finish response carries `{players, beat, histogram}`. The percent is `Math.round(beat*100)`, and a histogram component renders when present.
- Per-answer share: `"same":"{p} of players said this too"`, plus "Fewer than 1%" and "Nobody else has said this yet" variants (`krillion-internals.md` section 2.6).

---

## 3. Saved progress, timers, midnight

**krillion.io (VERIFIED, `422javqi48y07.js`)**
- Mid-day state is in `krillion:game:v1`: `{runId, date, dayNumber, roundIndex, phase, previewEndsAt, answerEndsAt, results[], draft, correction, rejected, pausedAt?}`. Phases are `intro | preview | answering | feedback | done`. It is saved on every change except `done`. Finished days move to `stats.history`, and the game key is cleared.
- Timers are stored as absolute wall-clock deadlines (`previewEndsAt`, `answerEndsAt`). On load, a past-due preview flips to answering with `answerEndsAt = previewEndsAt + 25 s`. A past-due answer records a miss (score 0) and moves to feedback. The clock therefore does not pause or reset on reload, and a reload is no way to buy time. The in-progress draft, correction and rejected guess are restored too.
- A site menu exists whose footer says "Your timer keeps running while the menu is open." (`333nvy-ldz2s6.js`). A `resumeDive` helper shifts deadlines by `pausedAt`, but I saw no code path that sets `pausedAt`. Whether it is dead code or used elsewhere is UNVERIFIED.
- Cross-tab: I found no sync of an in-progress round. The only `storage` listeners are on `krillion:stats:v1` and `*-done` keys (account sync) and on the feedback key. Two tabs on the same round is UNVERIFIED, and probably last-write-wins.
- Midnight with the tab open: the results page counts down to `resetsAt` from `/api/today`, which is 05:00Z, i.e. midnight US Eastern. It prints `next dive in HH:MM:SS`. At zero it shows `ready` plus a **refresh** link that calls `location.reload()`. There is no auto-rollover.
- UNVERIFIED: what happens if midnight passes mid-round. The submit carries `date`, but I did not trace the rejection path.

**Algillion (VERIFIED)**
- The in-progress run keeps `cur: {token, day, i, ...}` locally. The server prompt call returns `seconds`, and the client sets `deadline = Date.now() + seconds*1000` on each prompt fetch. Whether a reload gives a fresh 30 s is UNVERIFIED.
- Dictionary strings: `"nextDive":"Next flight in"`. The countdown is HH:MM:SS from `msToNext`. The local day is `u`, and a stale one is detected against the server day. The rollover path is UNVERIFIED.

---

## 4. Share text

**krillion.io (VERIFIED, module 17335 in `21ngqjsil_ru7.js`)**
```
Krillion #134 🦐
<score>

<7 emoji>
```
- The emoji come from `TIERS[tier].emoji`: Plankton 🫧, Too Clever 🤡, Schooler 🐟, Rare 🦑, Deep Cut 🏮, One in a Krillion 🌟. A missed round is ⬛ (`MISS_EMOJI`).
- Variants:
  - Archive: `Krillion ⟲ #N 🦐`.
  - Unlimited: `Krillion ∞ #N 🦐`. The `∞` is replaced by the pack badge, e.g. 🎬, for packs.
- The link is opt-in. A Settings toggle, "Share link: Add a krillion.io link under shared results.", is off by default and appends `\n\nhttps://krillion.io`. Archive and unlimited append a deep link (`/archive/N`, `${href}?game=N`).
- Delivery has two buttons. Copy uses a textarea plus `execCommand("copy")` as a fallback and then `navigator.clipboard`. A native share button appears only when `navigator.share` exists. Copy shows a 2 s confirmation.

**Algillion (VERIFIED)**
```
Algillion #10 — 10<z>
<7 coloured squares>
https://electicode.tj/algillion
```
- Squares: 🟨 algillion, 🟪 brilliant, 🟦 elegant, 🟩 neat, 🟧 sneaky, ⬜ trivial, ⬛ miss. The link is always on (`window.location.origin + "/algillion"`). Native share is used only on mobile user agents, otherwise it copies and shows "Copied!" for 1.8 s.

---

## 5. Endless mode

**krillion.io (VERIFIED, `1tddoms9p5x0n.js`, `3_1-wnp01rpyp.js`)**
- Entry:
  - It is `Unlimited ∞` in the site menu, which is a nav item alongside Daily, Puffer Party, Archive, Themed packs, My Krillion and Friends.
  - On the daily intro screen it is a small link in the footer row beside "ARCHIVE ⟲" and "THEMED PACKS".
  - Pack id is `classic`, named "THE ENDLESS DIVE", with the tagline "every prompt, every depth · the original ∞". The route is `/unlimited/classic` and the API base is `/api/unlimited`.
- It is paid. The lock screen shows "the ocean continues" with the CTA `UNLOCK UNLIMITED · $5`, and the text "one time. any unlock removes ads across the whole site." There is also "Already unlocked on another device? Restore it here." Unlocks are stored in `krillion-unlock` (plus `-<pack>` variants), and `/api/packs/:id/unlock` appears in the bundle.
- Rules: the same game shape as the daily. It uses the shared `g.ANSWER_MS` (25 s) and the same preview countdown. A "dive" is one 7-prompt game numbered N, and the end button reads "NEXT DIVE ∞ ↓". Results are saved under `krillion-unlimited-<n>`, and a dive-log picker lets you resume or revisit. When every charted dive has been started on the device, a "no new dives" screen says "Fresh dives drop soon."
- Endless results do not affect the daily streak. Because games come from a pre-built sequence rather than an infinite generator, "unlimited" is bounded by the content bank (INFERRED from the "no new dives" screen).
- Share: `Krillion ∞ #N 🦐`. The population comparison is a separate distribution under the endless endpoint.

**Algillion (VERIFIED)**
- Entry is an `∞ Unlimited` button on the title screen next to Archive and "? How to play". It is free. The note is "Random prompts, as many as you like. They don't count for today." The kicker reads "Practice — not counted". There is a theme picker (Everything, Numbers, Algorithms, ...) and a "No clock" option.

---

## 6. Onboarding

**krillion.io (VERIFIED, `259m0dn18gxcj.js`, DailyIntro)**
- There is no first-visit tutorial, and I found no first-run flag for the daily mode. The intro screen has a collapsed `<details class="ds-howto"><summary>how to play</summary>` with six lines:
  1. "7 prompts a day. same for everyone."
  2. "25 seconds to name one thing."
  3. "rare answers score big. obvious ones float."
  4. "the pick that feels clever? the school thought of it too."
  5. "every point sinks you 10 metres. 700 is the trench."
  6. "one dive per day. no second chances."
- The CTA is `▼ BEGIN DESCENT ▼`. A 3 s "descending · the clock starts in N" countdown precedes the 25 s answer window (`PREVIEW_MS`/`ANSWER_MS`).
- A first-visit flag exists only for Puffer Party (`krillion-party-seen`).
- The FAQ page has 13 entries (answer sets, rarity, why the Krillion is sometimes less rare than deep cuts, why an answer was missing, autocorrect, party timer, ads, team, who, partnerships, app, merch, multiplayer, "too clever", packs). It is reachable from the menu and from a settings footer, next to `privacy`.

**Algillion (VERIFIED)**
- A "? How to play" button on the title screen opens a dialog (keys `howTitle`, `how1`..). Example lines: "Each prompt has many right answers. Type one." and "Wrong guesses cost nothing but time — you have 30 ...". The title shows `7 prompts · 30 seconds each · rarer answers add more zeros`.

---

## 7. Everything else a first version visibly has

**krillion.io (VERIFIED unless marked)**
- Settings dialog, from a gear in the menu (`333nvy-ldz2s6.js`), with five toggles plus extras:
  - Low-power mode: "Lighter graphics and fewer background animations."
  - Colorblind mode: "Brighter text and more separated tier colors."
  - Answer corrections: "Preview corrected answers before scoring. Off accepts them immediately."
  - Clear rejected entries: "Empty the answer box after a failed attempt."
  - Share link, described above.
  - A mute control (`krillion-muted`) and a mascot picker ("wardrobe").
  - Links to Privacy, FAQ and Instagram, plus an account section (Google link, restore purchases).
- Accessibility: `prefers-reduced-motion` appears in CSS and in `14_ryj267zgto.js`. There are `role="status"` and `role="alert"` regions, and `aria-pressed`, `aria-label` and `aria-modal` dialogs are used throughout. The answer input is labelled "Your answer". Coverage is UNVERIFIED beyond these greps.
- Archive: `/archive` is a calendar of past days ("⟲") with resume and revisit, and per-day saved results (`krillion-archive-<n>`). It uses the `classic` unlock token (`loadPackUnlockToken(h?"classic":...)`), so it is paid, probably under the same $5 unlock (INFERRED). A "no new days" screen says "Every aired day has been started on this device."
- Feedback and suggestions:
  - A 1 to 5 rating after each dive ("how was that dive? 1 = meh · 5 = great") with optional notes, stored in `krillion-feedback:<game>` and POSTed to `/api/feedback`.
  - A "got an idea for a question? tell us what to ask" input (160 chars) posted to `/api/suggest`, rate-limited with the message "that's plenty for today".
  - Emails `business@` and `support@krillion.io` are in the FAQ.
- Other visible features:
  - Announcement modal ("Incoming transmission", `/api/announcements`).
  - Puffer Party multiplayer, themed packs (movies, sports, geography, lexicon), Friends, and merch.
  - Ads (an ad privacy link is present).
  - Open Graph tags: `og:title` "Krillion · the daily dive", `og:description` "Seven prompts a day. Rare answers sink you deeper. How far down can you go?", a 1200x630 `og:image`, and an apple-touch-icon.
  - A `?preview=` parameter on `/api/today` for previews.

**Algillion (VERIFIED)**
- A language switcher, 4 locales (tg/ru/uz/en), a sound toggle (`muted` in the saved state), a free archive (shown when the day is above 1), `prefers-reduced-motion` handling and a "No clock" relaxed mode.

---

## Checklist table

"nullion has today" comes from grepping `/Users/axvon/nullion/src` and the repo root on 2026-11-26.

| Feature | krillion does | nullion has today | Effort | Backend? |
|---|---|---|---|---|
| Local stats (played, streak, best, avg) | `krillion:stats:v1` history, recomputed. Results page "logbook: streak · played · avg · best" (`2aysgah32oe75.js`) | None. A grep for streak/gamesPlayed/best finds only art code. `src/game/daily-save.ts` deletes older daily saves, so no history is kept. | S | n |
| Streak shown on the title screen | `dive #N · streak N` when played > 0 | None | S | n |
| Lifetime tier distribution | Not seen (UNVERIFIED) | None | S | n |
| "Better than X% of players" and histogram | `POST /api/today/complete` returns `{betterThan, dist[]}`, signed receipts | None. Already deferred in `CLAUDE.md` with the other-player-answers dropdown. | L | **y** |
| "N played today" | Not seen on krillion. Algillion shows it. | None | M | **y** |
| Reload resume of the day in progress | `krillion:game:v1`, absolute deadlines, draft restored | Yes: `nullion.daily.<puzzle>` in `daily-save.ts`, with `until` deadlines, flushed on `visibilitychange` and `pagehide` | done | n |
| Timer survives reload without resetting | Absolute `answerEndsAt`, past-due round is a miss | Yes (`until` in the snapshot). Tab-two behaviour is not checked. | done | n |
| Midnight with the tab open | `next dive in HH:MM:SS`, then `ready` + refresh link | Yes: `updateNextDay` in `hud.ts` shows a live countdown, then "A new stack is open · reload". Rollover is local midnight, so it can differ from other players' day. | done | n |
| Mid-round midnight handling | UNVERIFIED | UNVERIFIED (`updateNextDay` runs only on the end card, `liveDaily`) | S to check | n |
| Share text with score and tier glyph row | `Krillion #N 🦐 / score / emoji row` | Yes, but no score and no URL: `nullion #N · <frames> · <layer>` plus glyphs (`hud.ts` ~1044) | S to add a link | n |
| Share link toggle | Settings "Share link" (default off) appends `https://krillion.io` | None. Plain `https://` link missing from the text, so shared posts do not point back. | S | n |
| Native share sheet | Button shown when `navigator.share` exists | Clipboard only (`hud.ts` ~266) | S | n |
| Endless entry in production | `Unlimited ∞` in menu and intro footer, paid $5 | Debug chip only (`?endless=1`, `main.ts` line 83). `ROADMAP.md` lists it under Milestone 2. | M | n |
| Endless personal best | Dive log per game number (no single best seen) | None. `ENDLESS-PLAN.md` says it is planned. | S | n |
| Endless share card | `Krillion ∞ #N` | Text exists in `hud.ts`, not reachable in production | S | n |
| How-to-play | Collapsed "how to play" on the intro, 6 lines | "How tiers work" dialog on the title screen (`hud.ts` 157). It does not state the rules (7 prompts a day, watchdog time per prompt, one attempt per day). | S | n |
| First-visit help | None seen | None | n/a | n |
| Prompt countdown before clock starts | 3 s preview, 25 s answer | Yes (reading phase, `READ_MS`) | done | n |
| Settings: mute | Yes | Yes, header chip and Settings | done | n |
| Settings: reduced motion / low power | Low-power mode, `prefers-reduced-motion` | Motion System/Full/Reduced (`prefs-menu.ts`) | done | n |
| Settings: colorblind mode | "Brighter text and more separated tier colors" | None. Tier colours do appear in tier icons and shapes (`tier-icons.ts`), so it may already be legible. UNVERIFIED. | M | n |
| Settings: typo-correction toggle | Answer corrections | Yes (`autocorrect: confirm/auto`) | done | n |
| Settings: clear rejected entry | Yes | None | S | n |
| Archive of past days | `/archive` calendar, paid | None. Puzzle `date` is deterministic from `EPOCH`, so replaying a past day is feasible. Needs a separate save namespace so it cannot touch the real day (the existing `canPersistDaily` guard already blocks that). | M | n |
| Feedback / report links | 1 to 5 rating plus notes (`/api/feedback`), question box (`/api/suggest`) | GitHub Issue links for "Report a missed answer" and "Suggest a question" on the end card (`issues.ts`). That is a locked design decision. | done | n |
| FAQ / privacy page | `/faq`, `/privacy` | None in `index.html` | S | n |
| Open Graph / social preview tags | Title, description, 1200x630 image, apple-touch-icon | `index.html` has no `og:`, manifest or apple-touch-icon (grep empty). Favicon exists. | S | n |
| Accessibility basics | `role=status`, `aria-live`, labelled input, modal dialogs | Partly: `aria-live="polite"` regions, `role="alert"` notice, labelled input, labelled dialog | done | n |
| Production build on Pages | n/a | **`.github/workflows/pages.yml` runs `npm run build:debug`**, so the debug menu ships. `ROADMAP.md` flags this as launch hygiene. | S | n |
| Enough questions for a daily | 7 fresh prompts/day, 51 to 118k answers each | 7 questions total (5 placeholder tiers). Endless and the daily repeat immediately. `ROADMAP.md` calls content the bottleneck. | L | n |
| Announcements / news | Modal with poll votes | None | S, skip | y for polls |
| Accounts, purchases, party, friends, packs, merch | Yes | None, not needed | skip | y |

---

## Notes for deciding what ships tonight

- **Do not copy krillion's server model for the first version.** Everything krillion shows that needs a server (percentile, histogram, popularity) sits behind signed receipts and an API. `CLAUDE.md` already defers this.
- **Everything else is local.** Stats, streak, share text, endless best, FAQ, OG tags and the archive need no backend. Krillion's stats are just the saved day history, recomputed.
- **Reload and midnight behaviour is already at parity.** The save uses absolute deadlines and a local-midnight reload prompt.
- **Unverified items worth a quick manual test:** what happens when midnight passes mid-round, and two tabs on the same round. Neither site's behaviour is confirmed from code.
