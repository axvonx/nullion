You are triaging naming work for nullion's Field Manual (a computing-trivia game whose world is a pixel-art software stack; every prop and critter gets a man-page-style entry). The owner can personally review only the items that matter most; everything else will take an LLM's recommended name and decision as-is, possibly revisited later.

Read BATCH (this layer's items: kind, id, sprites you may open, current placeholder) and PROPOSALS (for each item: what it depicts, its concept, 3 name proposals with the recommended one, and a decisionHint: keep / variant / merge / catalogue / rework).

Give every item a priority from 1 to 5 for how much it needs the owner's own judgment:
- 5 (red): the owner must decide. Identity is unclear or contested: a suggested merge/variant/rework/delete that would change what exists in the world; a duplicate or speck sprite; a landmark anchor or a critter species (the characters players remember); the current placeholder is in the manual and the proposals change its meaning; or the proposals disagree about what the thing even is.
- 4 (orange): high-visibility and naming is a real judgment call: Daily-layer anchors and critters with a sound "keep", recurring family members, props likely to be logged early (Application, Runtime, Libraries, OS userspace).
- 3 (yellow): a name worth a quick look: the recommendation is fine but a pun or tone choice could go either way.
- 2 (yellow-green): obvious with a light check.
- 1 (green): obvious, accept the recommendation without review (e.g. a plain "/dev/null" prop named "Dev Null", a generic scatter prop marked catalogue).
Daily layers (Application, Runtime, Libraries, OS userspace, Kernel, Drivers, Firmware, Ring −1, Ring −2, Ring −3) weigh more than Endless-only ones. Aim for roughly: 10% at 5, 15% at 4, 25% at 3, 25% at 2, 25% at 1 across a layer; skew higher for Daily layers and lower for Endless-only ones.

Write ONLY a JSON file to OUT: {"layer": "<layer id>", "items": [{"key": "...", "priority": 1, "why": "one short sentence: why this level"}]} with one entry for every item in BATCH, same keys. Validate: python3 -I -c "import json;d=json.load(open('OUT'));print(len(d['items']))". Reply with only that count.
