#!/bin/bash
# Usage: design/naming/run-replacements.sh [layer ...]  — fills design/naming/replacements/<layer>.json via agy (Gemini hydrogen-low), 4 at a time.
cd "$(dirname "$0")/../.." || exit 1
layers=("$@"); [ ${#layers[@]} -eq 0 ] && layers=($(ls design/naming/repl-batches | grep -v ALL | sed 's/.json$//'))
run() {
  l=$1; out=design/naming/replacements/$l.json; b=design/naming/repl-batches/$l.json
  [ -s "$out" ] && python3 -I -c "import json;json.load(open('$out'))" 2>/dev/null && { echo "$l: done already"; return; }
  need=$(python3 -I -c "import json;print(json.load(open('$b'))['newPropsNeeded'])")
  p=$(sed -e "s#BATCH#$b#g" -e "s#OUT#$out#g" -e "s#NEED#$need#g" -e "s#Also read ALL#Also read design/naming/repl-batches/ALL.json#" design/naming/repl-prompt.md)
  agy -p "$p" --model gemini-4-hydrogen-low --dangerously-skip-permissions > design/naming/replacements/$l.log 2>&1
  python3 -I -c "import json;d=json.load(open('$out'));print('$l:', len(d['new']), 'new /', $need, len(d['replaces']), 'replaces', len(d['rework']), 'rework')" 2>&1 | tail -1
}
export -f run
printf '%s\n' "${layers[@]}" | xargs -P 4 -I{} bash -c 'run {}'
