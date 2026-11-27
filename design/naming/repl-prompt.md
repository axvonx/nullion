You are designing replacement props for nullion's pixel-art world. nullion is a computing-trivia game whose world is the software stack drawn as places, one layer per level of the machine (Application at the top, down through kernel, firmware, hypervisor, SMM, the Management Engine, microarchitecture and physics). Every prop is a collectible Field Manual entry, so each must stand for one real computing concept worth a page.

Read ART-STYLE.md (the art rules; rule 1 matters most: every prop is a PHYSICAL OBJECT that could sit in that place, never a UI panel, schematic symbol, diagram, arrow, or a word in a box; rule 2: text at most 4 glyphs and never the point). Read BATCH: this layer's kept items, items slated for rework (with the problem), and deleted props (with why they failed and any earlier idea). Also read ALL (every surviving item in every layer) so you never propose something that already exists elsewhere.

Write ONLY a JSON file to OUT:
{"layer": "<id>",
 "replaces": [{"key": "<deleted key>", "idea": "one sentence: the physical object that takes over its concept, or null if the concept should simply go"}],   // one per deleted prop in BATCH
 "new": [{"id": "<layer-prefix>-<slug>", "name": "short playful name", "concept": "the real computing concept", "depicts": "the physical object, concretely (shape, parts, how it stands or is mounted)", "focal": "its one focal detail", "size": "small|medium|large", "replacesKey": "<deleted key or null>"}],  // exactly NEED items
 "rework": [{"key": "<rework key>", "redesign": "one sentence: how to redraw it to pass the rules (anchors become places or machines)"}]}  // one per rework item

Rules for "new": exactly NEED items; distinct silhouettes from each other and from kept items; mix sizes about half small, a third medium, the rest large; concrete objects a pixel artist can draw in 8-40 px (a pager, a turnstile, a wax-sealed envelope, a bellows, a rubber stamp), grounded or mounted; the concept must be specific to THIS layer (a TLB, not "memory"); wordplay is welcome when the object is still clear. Prefer covering the deleted props' concepts with better objects before adding new concepts.

Validate: python3 -I -c "import json;d=json.load(open('OUT'));print(len(d['new']),len(d['replaces']),len(d['rework']))". Reply with only that line.
