You are helping name the characters and props of nullion, a daily computing-trivia game. The player's cursor descends a pixel-art "software stack": Application, Runtime, Libraries, OS userspace, Kernel, Drivers, Firmware, Ring −1 (hypervisor), Ring −2 (SMM), Ring −3 (Intel ME); the Endless mode adds layers above and below (Internet/BGP, Browser, AST & Bytecode, JIT, Dynamic Linker, Kernel Entry, Arch & Interrupts, PCIe/DMA, VMM, EPT/IOMMU, SMRAM, ME MINIX, Microarchitecture, RTL, CMOS, Photolithography, Bandgap, Landauer Limit). Every prop and critter you see in the world will get a page in an in-game "Field Manual", styled as an archive binder of Unix manual pages (NAME, DESCRIPTION, BUGS…). The tone is dry, precise, computing-literate, quietly funny, never cutesy.

Read the batch file BATCH (one layer's items). Each item has a code id (entityId like "us-padlock", or a critter layer), its kind (anchor = big landmark set piece; prop = scatter prop; critter / critter-alt = a living species with motion types), pixel size, flags, and a `sprites` list of PNG paths (one per appearance: layer, size or colour variant) you may open to see what it looks like. `currentPlaceholder` is a throwaway prototype name: do not just repeat it.

For EVERY item, produce:
- "depicts": one plain sentence, what the sprite shows (from the id, the image, and the layer).
- "concept": the real computing concept it stands for or nods to, in a few words (e.g. "advisory file locks", "cron scheduling").
- "proposals": exactly 3 distinct display-name options, 1–3 words each, Title Case, each with "why": one sentence of reasoning. Vary the style across the three: one plain/descriptive, one wry computing pun or reference, one evocative/naturalist ("field guide" register). No emoji, no exclamation marks.
- "recommend": 0, 1 or 2, the index of the option you'd pick, and "recommendWhy": one sentence.
- "decisionHint": one of
  - "keep": worth its own page;
  - "variant": the same character as another item, differing only in colour, pose or size (like two colours of the same bird): it should become a variation shown on that item's page, so give that item's key in "mergeWith";
  - "merge": genuinely the same thing as another item under a different id ("mergeWith" = that key);
  - "catalogue": fine as an appendix specimen with no page of its own;
  - "rework": the sprite is unclear, a speck, or duplicates another layer's art;
  plus "decisionWhy": one sentence.
  Look for variants within this batch AND against the other layers' items listed in ALL (a JSON file of every item's key, id and layer): recolours and near-copies across layers are common.

Write ONLY a JSON file to OUT: {"layer": "<layer id>", "items": [{"key": "...", "depicts": "...", "concept": "...", "proposals": [{"name": "...", "why": "..."}, ...], "recommend": 0, "recommendWhy": "...", "decisionHint": "keep", "mergeWith": null, "decisionWhy": "..."}]} with one entry per input item, same keys. Validate it with: python3 -I -c "import json;d=json.load(open('OUT'));print(len(d['items']))". Reply with only that count.
