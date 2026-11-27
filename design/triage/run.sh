#!/bin/bash
# Usage: design/triage/run.sh — triages the draft bank categories via agy (Gemini hydrogen-low), 4 batches at a time.
cd "$(dirname "$0")/../.." || exit 1
run() {
  b=$1; out=design/triage/out/$b.json
  [ -f "design/triage/batches/$b.json" ] || { echo "$b: no batch" >&2; return 1; }
  [ -s "$out" ] && python3 -I -c "import json;json.load(open('$out'))" 2>/dev/null && { echo "$b: done already"; return; }
  p=$(sed -e "s#BATCH#design/triage/batches/$b.json#g" -e "s#OUT#$out#g" -e "s#read ALL#read design/triage/batches/ALL.json#" -e "s#and APPROVED#and design/triage/batches/APPROVED.json#" design/triage/prompt.md)
  agy -p "$p" --model gemini-4-hydrogen-low --dangerously-skip-permissions > design/triage/out/$b.log 2>&1
  python3 -I -c "import json,collections;d=json.load(open('$out'));print('$b:',dict(collections.Counter(i['verdict'] for i in d['items'])))" 2>&1 | tail -1
}
export -f run
ls design/triage/batches | grep '^b' | sed 's/.json$//' | xargs -P 4 -I{} bash -c 'run {}'
