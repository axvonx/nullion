# writing/

The game's words, one Markdown file per place text appears (`reveal.md`, `title.md`, `end-card.md`, `layers.md`,
`notices.md`, `console.md`). Edit them by hand; the grammar is strict and errors name the file and line
(`src/data/writing-format.ts`). The Field Manual's pages live in `writing/manual/`, with their own grammar.

```
## reveal.timeout.rejected
where: the reveal after a time-out, under "Time's up"
when: the watchdog ran out and the player had a rejected guess
max: 40
vars: {guess}
status: draft

{guess}: Not accepted
```

- `where:` and `when:` say where the text shows and what triggers it. `max:` (optional) is the most characters of
  any one text. `vars:` lists the `{names}` the text uses; code fills them, and never glues sentences together.
- `status: draft` is agent-written; `status: owner` is yours. An agent never edits an `owner` string.
- A text is one paragraph, or `- ` lines: variants the game rotates through or indexes.
- Code reads `text('key', { vars })` or `variants('key')` from `src/text.ts`. `npm test` checks that every key used
  exists, every key is used, vars match, and `max:` holds. `npm run writing:report` counts draft vs owner per file.
- Voice: see `VOICE.md`.
