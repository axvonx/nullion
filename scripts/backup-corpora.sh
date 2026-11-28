#!/bin/sh
# Versioned backup of ~/nullion-corpora to the Development SSD with restic (deduplicated snapshots; nested git
# clones and the SQLite index are backed up as plain files). Run after fetching or rebuilding the corpora.
#
#   scripts/backup-corpora.sh            snapshot, prune to the retention policy, verify
#   restic -r "$REPO" --insecure-no-password snapshots           list snapshots
#   restic -r "$REPO" --insecure-no-password restore latest --target /tmp/x     restore
#
# The repository has no password (a local drive the owner holds; a lost password would make it unrecoverable).
set -eu
SRC="${NULLION_CORPORA:-$HOME/nullion-corpora}"
REPO="${NULLION_CORPORA_BACKUP:-/Volumes/Development/backups/nullion-corpora.restic}"
R="restic -r $REPO --insecure-no-password"

[ -d "$SRC" ] || { echo "backup-corpora: $SRC does not exist" >&2; exit 1; }
[ -d "$(dirname "$(dirname "$REPO")")" ] || { echo "backup-corpora: the backup volume for $REPO is not mounted" >&2; exit 1; }
find "$SRC" -name '*.part' | grep -q . && { echo "backup-corpora: unfinished downloads (*.part) in $SRC: let them finish first" >&2; exit 1; }

if [ ! -f "$REPO/config" ]; then
  mkdir -p "$REPO"
  $R init
fi
$R backup "$SRC" --tag corpora --exclude '*.part'
$R forget --tag corpora --keep-last 10 --keep-monthly 12 --prune
$R check
$R snapshots --tag corpora --compact | tail -5
