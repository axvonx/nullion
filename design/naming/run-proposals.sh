#!/bin/bash
# Usage: design/naming/run-proposals.sh [layer ...]  — fills design/naming/proposals/<layer>.json via agy (Gemini), 4 at a time.
cd "$(dirname "$0")/../.." || exit 1
layers=("$@"); [ ${#layers[@]} -eq 0 ] && layers=($(ls design/naming/batches | grep -v ALL | sed 's/.json$//'))
run() {
  l=$1; out=design/naming/proposals/$l.json
  [ -s "$out" ] && python3 -I -c "import json;json.load(open('$out'))" 2>/dev/null && { echo "$l: done already"; return; }
  p=$(sed -e "s#BATCH#design/naming/batches/$l.json#" -e "s#OUT#$out#g" -e "s#ALL (a JSON#design/naming/batches/ALL.json (a JSON#" design/naming/prompt.md)
  agy -p "$p" --model gemini-4-hydrogen-low --dangerously-skip-permissions > design/naming/proposals/$l.log 2>&1
  python3 -I -c "import json;d=json.load(open('$out'));print('$l:', len(d['items']))" 2>&1 | tail -1
}
export -f run
printf '%s\n' "${layers[@]}" | xargs -P 4 -I{} bash -c 'run {}'
