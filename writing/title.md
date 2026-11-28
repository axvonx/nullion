# Title screen

The tagline, the start button and the How to play dialog with its tier guide.

## title.tag
where: the tagline above the start button on the title screen
when: the title screen is up
max: 100
status: draft

Seven prompts a day. Rarer answers descend deeper into the stack.

## title.start
where: the title screen’s start button
when: the title screen is up
max: 24
status: draft

Unwind the stack

## title.rule.prompts
where: the first line of the How to play list
when: the player opens How to play
max: 80
vars: {prompts}, {seconds}
status: draft

{prompts} prompts a day, {seconds} seconds each.

## title.rule.answer
where: the second line of the How to play list
when: the player opens How to play
max: 90
status: draft

One answer per prompt: the first one accepted is locked in.

## title.rule.frames
where: the third line of the How to play list
when: the player opens How to play
max: 100
vars: {min}, {max}
status: draft

Rarer answers push more stack frames ({min} to {max}), so you descend deeper.

## title.rule.depth
where: the fourth line of the How to play list
when: the player opens How to play
max: 100
status: draft

More stack frames = deeper inside the computer, from Apps down to bare silicon.

## title.rule.bugs
where: the fifth line of the How to play list
when: the player opens How to play
max: 100
status: draft

Tiers are named after bugs — rarer answers are harder-to-reproduce bugs.

## title.rule.same
where: the sixth line of the How to play list
when: the player opens How to play
max: 60
status: draft

Everyone gets the same stack.

## title.rule.midnight
where: the last line of the How to play list
when: the player opens How to play
max: 60
status: draft

Unwind the next stack at midnight.

## title.tiers.heading
where: the heading over the tier guide inside How to play
when: the player opens How to play
max: 40
status: draft

Tiers {sq} stack frames

## title.tiers.note
where: the sentence above the tier guide inside How to play
when: the player opens How to play
max: 100
status: draft

Wrong guesses cost nothing but time. Harder-to-reproduce answers descend deeper:
