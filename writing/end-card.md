# End card

The end-of-day card: headlines, the next-day footer, the Field Manual button and row details.

## end-card.headline.daily
where: the share text’s headline, in the daily game
when: the day is over
max: 60
vars: {frames}, {layer}
status: draft

{frames} {sq} {layer}

## end-card.headline.endless
where: the share text’s headline, in the strike modes (Endless)
when: the third strike ended the run
max: 60
vars: {frames}, {layer}
status: draft

KERNEL PANIC {sq} {frames} {sq} {layer}

## end-card.summary.daily
where: the end card's summary line, under "nullion #n" and above the drawn stack
when: the day is over
max: 40
vars: {frames}
status: draft

{frames}

## end-card.summary.endless
where: the end card's summary line, under the ENDLESS chip and above the drawn stack
when: the third strike ended the run
max: 40
vars: {frames}
status: draft

KERNEL PANIC {sq} {frames}

## end-card.next.waiting
where: the footer of the end card, until the countdown starts, and in games that do not count down
when: the day is over
max: 60
status: draft

Unwind the next stack at midnight.

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

New stack ready {sq} reload

## end-card.manual.found
where: the line under “Field Manual” on the end card button
when: the day is over and at least one page is logged
max: 80
vars: {found}
status: draft

{found} logged {sq} click characters & props to log more

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

Timed out {sq} no frames

## end-card.row.skipped
where: a backtrace row’s detail, once opened
when: the round was skipped
max: 40
status: draft

Skipped {sq} no frames

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

## end-card.endless.enter
where: the button under Share result on the daily end card
when: the day is over and no Endless run is waiting; pressing it lights up and drops into Endless
max: 30
status: draft

Enter endless ▾

## end-card.endless.resume
where: the button under Share result on the daily end card
when: the day is over and an unfinished Endless run is saved
max: 30
status: draft

Resume endless run ▾

## end-card.endless.best
where: under Share result on an Endless end card
when: an Endless run has ended and an earlier run went deeper (or as deep)
max: 60
vars: {frames}
status: draft

Your best: {frames}

## end-card.endless.new-best
where: under Share result on an Endless end card
when: an Endless run has ended deeper than any before
max: 60
vars: {frames}
status: draft

New best: {frames}

## end-card.endless.back
where: the button under the best line on an Endless end card
when: an Endless run has ended
max: 30
status: draft

Back to today’s stack ▴

## end-card.endless.reenter
where: the button under the best line on an Endless end card
when: an Endless run has ended; pressing it lights up and starts a new run
max: 30
status: draft

Re-enter endless ▾

## end-card.backtrace.daily
where: the heading over the end card's backtrace
when: the day is over
max: 30
status: draft

Today’s backtrace

## end-card.backtrace.endless
where: the heading over the end card's backtrace
when: an Endless run has ended
max: 30
status: draft

This run’s backtrace
