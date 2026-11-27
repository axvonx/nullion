# Reveal

What the tier reveal says once a dive lands: the tier quips and the time-out lines.

## reveal.quip.off-by-one
where: the line under the answer in the reveal, when the answer has no note of its own
when: the dive lands on an answer of this tier; the lines take turns, one per reveal
max: 60
status: draft

- Right answer. Most people said this one too.
- A classic. Nearly everyone gets here.
- Safe and solid. You’re in good company.

## reveal.quip.womm
where: the line under the answer in the reveal, when the answer has no note of its own
when: the dive lands on an answer of this tier; the lines take turns, one per reveal
max: 60
status: draft

- Feels obscure, but it’s everyone’s go-to.
- The “clever” pick lots of people make.
- Everyone thinks they’re the only one who knows this.

## reveal.quip.npe
where: the line under the answer in the reveal, when the answer has no note of its own
when: the dive lands on an answer of this tier; the lines take turns, one per reveal
max: 60
status: draft

- Good answer. Plenty of people found it.
- Fairly well known, but not everyone thought of it.
- A common pick, and a good one.

## reveal.quip.leak
where: the line under the answer in the reveal, when the answer has no note of its own
when: the dive lands on an answer of this tier; the lines take turns, one per reveal
max: 60
status: draft

- Most players missed this one.
- Getting into less-travelled ground.
- Not many people reached for that.

## reveal.quip.race
where: the line under the answer in the reveal, when the answer has no note of its own
when: the dive lands on an answer of this tier; the lines take turns, one per reveal
max: 60
status: draft

- Only a few people find this one.
- Now you’re digging.
- A rare find. Nicely done.

## reveal.quip.heisenbug
where: the line under the answer in the reveal, when the answer has no note of its own
when: the dive lands on an answer of this tier; the lines take turns, one per reveal
max: 60
status: draft

- Hardly anyone thinks of this.
- A deep cut. Very few found it.
- That one hides from almost everyone.

## reveal.quip.bitflip
where: the line under the answer in the reveal, when the answer has no note of its own
when: the dive lands on an answer of this tier; the lines take turns, one per reveal
max: 60
status: draft

- Today’s rarest answer. You found it.
- The one answer almost nobody finds.
- One in a billion. Well, almost.

## reveal.timeout.title
where: the big title of the reveal after a time-out
when: the watchdog ran out on a prompt
max: 20
status: draft

Time’s up

## reveal.timeout.rejected
where: the reveal line after a time-out, when the last guess was rejected
when: the watchdog ran out and the final guess was not accepted
max: 60
vars: {guess}
status: draft

{guess}: Not accepted

## reveal.timeout.line
where: the reveal line after a time-out with no rejected guess
when: the watchdog ran out, or the round was skipped, with nothing typed
max: 60
status: draft

No answer, so no frames this round.

## reveal.outside-note
where: the line under the answer in the reveal, for an answer found on Wikipedia but not in the answer list
when: debug only (Outside answers on): the guess missed the bank and its Wikipedia article says it is the prompt's kind of thing
max: 60
status: draft

Not on our list yet: found on Wikipedia, unverified.
