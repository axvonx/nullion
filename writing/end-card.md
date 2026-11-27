# End card

The end-of-day card: headlines, the next-day footer, the Field Manual button and row details.

## end-card.headline.daily
where: the end card headline and the share text’s headline, in the daily game
when: the day is over
max: 60
vars: {frames}, {layer}
status: draft

{frames} · {layer}

## end-card.headline.endless
where: the end card headline and the share text’s headline, in the strike modes (Endless)
when: the third strike ended the run
max: 60
vars: {frames}, {layer}
status: draft

KERNEL PANIC · {frames} · {layer}

## end-card.next.waiting
where: the footer of the end card, until the countdown starts, and in games that do not count down
when: the day is over
max: 60
status: draft

A new stack opens at local midnight.

## end-card.next.countdown
where: the footer of the end card
when: the day is over; it ticks down to local midnight
max: 60
vars: {countdown}
status: draft

Next stack in {countdown}

## end-card.next.reload
where: the footer button of the end card
when: local midnight has passed with the end card still open
max: 40
status: draft

A new stack is open · reload

## end-card.manual.found
where: the line under “Field Manual” on the end card button
when: the day is over and at least one page is logged
max: 80
vars: {found}
status: draft

{found} logged · click background folks to collect more

## end-card.manual.none
where: the line under “Field Manual” on the end card button
when: the day is over and no page is logged yet
max: 80
status: draft

Click characters & props in the stack to log them

## end-card.row.timed-out
where: a backtrace row’s detail, once opened
when: the round ended on the watchdog
max: 40
status: draft

Timed out · no frames

## end-card.row.skipped
where: a backtrace row’s detail, once opened
when: the round was skipped
max: 40
status: draft

Skipped · no frames

## end-card.link.missed
where: a link at the bottom of the end card
when: the day is over
max: 40
status: draft

Report a missed answer

## end-card.link.suggest
where: a link at the bottom of the end card
when: the day is over
max: 40
status: draft

Suggest a question

## end-card.sheet.others
where: the top of a backtrace row’s dropdown
when: the player opens a row’s dropdown at the end of the day
max: 40
status: draft

Other answers
