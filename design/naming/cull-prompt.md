You are culling the cast of nullion's Field Manual. nullion is a computing-trivia game whose world is a pixel-art software stack, one layer per level of the machine; every prop and critter gets a man-page entry, and there are too many (about 460 distinct ones). The owner wants a much smaller, stronger set: every survivor should be distinct, recognisable, and stand for a real computing concept worth a page.

Read BATCH: this layer's items (key, kind, recommended name, what it depicts, its concept, triage priority 1–5, the owner's decision if any, a sprite you may open). Also read ALL: every surviving item in every layer (key, layer, name, depicts), to spot things too similar to something elsewhere.

For EVERY item in BATCH decide "keep" or "delete":
- delete when it is too similar to another item (same object or same idea, here or in another layer: give that key in "similarTo"), or generic filler that stands for no concept worth a page, or weak enough that a different, better prop would serve this layer (give that idea in "replacement": a short description of a new prop that is unrelated if need be, e.g. "a TLB shootdown pager"), or visually unclear.
- keep the strongest representative of every concept, the layer's anchors (landmark set pieces) unless they are clearly redundant, and every "critter" (core species). Alternate critters ("critter-alt") may go if weak.
- Be decisive: aim to delete roughly 35–45% of this layer's props. Prefer deleting the weaker of two similar items and naming the stronger in "similarTo".
- If the owner already decided "keep", delete only with a strong reason (you may override them; say why).

Write ONLY a JSON file to OUT: {"layer": "<layer id>", "items": [{"key": "...", "verdict": "keep" | "delete", "reason": "one sentence", "similarTo": "<key or null>", "replacement": "<short idea or null>"}]} with one entry per BATCH item, same keys. Validate: python3 -I -c "import json;d=json.load(open('OUT'));print(len(d['items']))". Reply with only that count.
