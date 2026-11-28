# Title screen

The tagline, the start button and the How to play dialog with its tier guide.

## title.tag
where: the tagline above the start button on the title screen
when: the title screen is up
max: 100
status: draft

Seven prompts a day. The rarer your answer, the further you unwind.

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

There are {prompts} prompts a day, with {seconds} seconds each.

## title.rule.answer
where: the second line of the How to play list
when: the player opens How to play
max: 90
status: draft

You answer once per prompt: whatever's accepted first is chosen.

## title.rule.frames
where: the third line of the How to play list
when: the player opens How to play
max: 100
vars: {min}, {max}
status: draft

If your answer is rarer, you unwind more stack frames ({min} to {max}), so you descend deeper.

## title.rule.depth
where: the fourth line of the How to play list
when: the player opens How to play
max: 100
status: draft

The more stack frames you've unwound, the deeper in the computer you are.

## title.rule.bugs
where: the fifth line of the How to play list
when: the player opens How to play
max: 100
status: draft

Tier names are bugs, and rarer answers are harder-to-reproduce kinds.

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

Unwind the next one at midnight.

## title.tiers.heading
where: the heading over the tier guide inside How to play
when: the player opens How to play
max: 40
status: draft

Tiers {sq} stack frames
