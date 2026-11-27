# Console

The feedback line under the entry box, and the entry box’s countdown placeholder.

## console.rejected
where: the first words of the feedback line under the entry box
when: the guess was not accepted
max: 30
status: draft

Not accepted

## console.missing-link
where: a link after “Not accepted” that opens a prefilled report
when: the guess was not accepted
max: 30
status: draft

Missing an answer?

## console.hint
where: the feedback line under the entry box, after the link
when: two or more guesses on this prompt were rejected
max: 120
vars: {hint}
status: draft

Hint: {hint}

## console.hint.generic
where: the hint, when the prompt has no hint of its own
when: two or more guesses were rejected and the prompt has no “Accepts” line
max: 60
status: draft

Try a broad, common name.

## console.duplicate
where: the feedback line under the entry box
when: the player typed an answer already accepted this game
max: 80
vars: {name}
status: draft

{name} is already on the stack

## console.suggestion
where: the feedback line under the entry box
when: a typo was corrected in place and waits for Enter (the “Ask first” setting)
max: 80
vars: {name}
status: draft

Corrected to '{name}'. Press Enter to submit.

## console.corrected
where: the feedback line under the entry box
when: a typo was corrected and the answer accepted on its own
max: 60
vars: {name}
status: draft

read as '{name}'

## console.countdown
where: the entry box’s placeholder while the prompt is being read
when: the first seconds of a round, before input opens
max: 30
vars: {secs}
status: draft

Starting in {secs}s
