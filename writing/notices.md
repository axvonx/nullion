# Notices

The dismissible notice bar at the top of the page.

## notices.daily.invalid
where: the dismissible notice bar at the top of the page (an error)
when: the page loads and today’s saved game is unreadable
max: 140
vars: {reason}
status: draft

Your saved stack for today could not be restored ({reason}). Starting fresh.

## notices.daily.resumed
where: the dismissible notice bar at the top of the page
when: the page loads and today’s unfinished game is restored
max: 100
status: draft

Resumed today’s stack. The clock kept running while you were away.

## notices.stats.reset
where: the notice bar, and under the stats on the end card (an error)
when: the day is over and the saved stats were unreadable
max: 120
vars: {reason}
status: draft

Your saved stats could not be read ({reason}) and were reset.

## notices.manual.unreadable
where: the dismissible notice bar at the top of the page (an error)
when: the page loads and the saved Field Manual is unreadable
max: 140
vars: {reason}
status: draft

Your Field Manual could not be read ({reason}), so it starts empty.

## notices.manual.dropped
where: the dismissible notice bar at the top of the page (an error)
when: the page loads and the saved Field Manual names pages that no longer exist
max: 200
vars: {pages}
status: draft

Some Field Manual pages no longer exist and were removed: {pages}.

## notices.endless.invalid
where: the dismissible notice bar at the top of the page (an error)
when: Endless starts and the saved run (or the stored best) is unreadable
max: 140
vars: {reason}
status: draft

Your saved Endless run could not be restored ({reason}). Starting a new run.

## notices.endless.resumed
where: the dismissible notice bar at the top of the page
when: Endless starts and an unfinished run is restored
max: 100
status: draft

Resumed your Endless run. The clock kept running while you were away.
