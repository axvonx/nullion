#!/bin/bash
# Usage: design/naming/run-cull.sh [layer ...]  — fills design/naming/cull/<layer>.json via agy (Gemini hydrogen-low), 4 at a time.
cd "$(dirname "$0")/../.." || exit 1
layers=("$@"); [ ${#layers[@]} -eq 0 ] && layers=($(ls design/naming/cull-batches | grep -v ALL | sed 's/.json$//'))
run() {
  l=$1; out=design/naming/cull/$l.json
  [ -s "$out" ] && python3 -I -c "import json;json.load(open('$out'))" 2>/dev/null && { echo "$l: done already"; return; }
  p=$(sed -e "s#BATCH#design/naming/cull-batches/$l.json#" -e "s#OUT#$out#g" -e "s#Also read ALL#Also read design/naming/cull-batches/ALL.json#" design/naming/cull-prompt.md)
  agy -p "$p" --model gemini-4-hydrogen-low --dangerously-skip-permissions > design/naming/cull/$l.log 2>&1
  python3 -I -c "import json;d=json.load(open('$out'));print('$l:', len(d['items']), 'delete', sum(i['verdict']=='delete' for i in d['items']))" 2>&1 | tail -1
}
export -f run
printf '%s\n' "${layers[@]}" | xargs -P 4 -I{} bash -c 'run {}'
