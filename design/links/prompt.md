You are finding reference links for nullion, a computing-trivia game. After a day's game, players browse each prompt's accepted answers; each answer and the prompt itself link to the page that best explains THAT computing concept, so "lock" under "Name a type of lock" must go to the concurrency article, never door hardware.

Read BATCH: the prompt, what it accepts, and every answer (name, aliases, tier).

For the prompt's subject and for EVERY answer give the single best URL, or null:
- First choice: the exact English Wikipedia article for the computing sense, as https://en.wikipedia.org/wiki/<Title_with_underscores> (e.g. https://en.wikipedia.org/wiki/File_system, https://en.wikipedia.org/wiki/Lock_(computer_science)). A section anchor (#Section) is fine when the concept is a section of a bigger article. Never a disambiguation page, never a search URL.
- When Wikipedia has no article for it: a reputable primary source. Man pages (https://man.freebsd.org/cgi/man.cgi?query=fdescfs&sektion=5, https://man7.org/linux/man-pages/...), https://docs.kernel.org/..., https://learn.microsoft.com/..., RFCs (https://www.rfc-editor.org/rfc/rfcNNNN), official project documentation (postgresql.org/docs, docs.python.org, developer.mozilla.org, en.cppreference.com, the project's own site or its GitHub repo).
- null when you are not confident a real page exists. A wrong link is worse than none; every URL is checked afterwards and broken ones are dropped.

Write ONLY a JSON file to OUT: {"id": "<category id>", "prompt": "<url or null>", "answers": {"<answer name exactly as given>": "<url or null>", ...}} with one key per answer in BATCH. Validate: python3 -I -c "import json;d=json.load(open('OUT'));print(len(d['answers']))". Reply with only that number.
