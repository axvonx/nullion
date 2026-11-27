#!/bin/bash
# Usage: design/links/run.sh [category ...] — proposes reference links per approved bank category via agy (Gemini hydrogen-low), 4 at a time.
cd "$(dirname "$0")/../.." || exit 1
ids=("$@"); [ ${#ids[@]} -eq 0 ] && ids=($(ls design/links/batches | sed 's/.json$//'))
run() {
  c=$1; out=design/links/proposed/$c.json; b=design/links/batches/$c.json
  [ -f "$b" ] || { echo "$c: no batch $b" >&2; return 1; }
  [ -s "$out" ] && python3 -I -c "import json;json.load(open('$out'))" 2>/dev/null && { echo "$c: done already"; return; }
  p=$(sed -e "s#BATCH#$b#g" -e "s#OUT#$out#g" design/links/prompt.md)
  agy -p "$p" --model gemini-4-hydrogen-low --dangerously-skip-permissions > design/links/proposed/$c.log 2>&1
  python3 -I -c "import json;d=json.load(open('$out'));a=d['answers'];print('$c:', sum(1 for v in a.values() if v), '/', len(a), 'linked')" 2>&1 | tail -1
}
export -f run
printf '%s\n' "${ids[@]}" | xargs -P 4 -I{} bash -c 'run {}'
