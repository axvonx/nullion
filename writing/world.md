# World

Words drawn into the world itself: the pills that float up when a prop or critter is clicked.

## world.toast.new-entry
where: the small pill that floats up from a prop or critter clicked in the world
when: the click logs a Field Manual entry for the first time
max: 40
vars: {name}
status: draft

Logged: {name}!

## world.toast.new-layer
where: the small pill that floats up from a prop or critter clicked in the world
when: the click logs a known entry in a layer it had not been seen in
max: 40
vars: {name}
status: draft

{name} · new layer!

## world.toast.logged
where: the small pill that floats up from a prop or critter clicked in the world
when: the click is on an entry already logged in this layer (the first such click this visit)
max: 40
vars: {name}
status: draft

{name} · logged

## world.toast.already-seen
where: the small pill over a clicked prop or critter, red and wobbling
when: the same already-logged prop is clicked again this visit (clicks within 0.7 s of the last one are ignored)
max: 30
status: draft

Already seen
