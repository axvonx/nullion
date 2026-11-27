#!/bin/bash
# Usage: design/naming/run-priority.sh [layer ...]  — fills design/naming/priority/<layer>.json via agy (Gemini), 4 at a time.
# Needs proposals/<layer>.json first (run-proposals.sh).
cd "$(dirname "$0")/../.." || exit 1
layers=("$@"); [ ${#layers[@]} -eq 0 ] && layers=($(ls design/naming/batches | grep -v ALL | sed 's/.json$//'))
run() {
  l=$1; out=design/naming/priority/$l.json
  [ -s "$out" ] && python3 -I -c "import json;json.load(open('$out'))" 2>/dev/null && { echo "$l: done already"; return; }
  [ -s design/naming/proposals/$l.json ] || { echo "$l: NO PROPOSALS YET"; return; }
  p=$(sed -e "s#BATCH#design/naming/batches/$l.json#" -e "s#PROPOSALS#design/naming/proposals/$l.json#" -e "s#OUT#$out#g" design/naming/priority-prompt.md)
  agy -p "$p" --model gemini-4-hydrogen-low --dangerously-skip-permissions > design/naming/priority/$l.log 2>&1
  python3 -I -c "import json;d=json.load(open('$out'));print('$l:', len(d['items']))" 2>&1 | tail -1
}
export -f run
printf '%s\n' "${layers[@]}" | xargs -P 4 -I{} bash -c 'run {}'
