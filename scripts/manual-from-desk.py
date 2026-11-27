#!/usr/bin/env python3
"""Draft Field Manual pages from the naming desk (design/naming).

Usage: python3 -I scripts/manual-from-desk.py [--dry-run]

For every desk record that
  - names an entity still present in design/naming/inventory.json (props, anchors and core critters),
  - is not deleted, and is not folded into another record (a verified merge, or a variant with a target),
  - has a resolved name (a write-in, or a chosen proposal), and
  - is not already covered by a manual file (an existing file with a sighting of its entity id, or of its critter layer),
write manual/<layer of first sighting>/<id>.md with `status: draft`. Merges and variants that target a drafted record
become extra sightings in their own layers. Existing files are never overwritten or edited ("your edits win", like
bank/): rerunning only adds drafts for records that have none yet. Grammar: src/data/manual-format.ts.

Stdlib only. Prints counts.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DESK = ROOT / 'design' / 'naming'
MANUAL = ROOT / 'manual'
SEP = ' · '
TAG_BASE_MAX = 14  # src/game/manual-style.ts TAG_BASE_MAX


def die(msg):
    print(f'manual-from-desk: {msg}', file=sys.stderr)
    sys.exit(1)


def load(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def one_line(text):
    return ' '.join(str(text).split())


def sentence(text):
    """One line ending in a full stop."""
    t = one_line(text)
    return t if t.endswith('.') else t + '.'


# --- Inputs ------------------------------------------------------------------------------------------------------

inventory = load(DESK / 'inventory.json')
decisions = load(DESK / 'decisions.json')['items']
layers = [l['id'] for l in inventory['layers']]
layer_name = {l['id']: l['name'] for l in inventory['layers']}
layer_rank = {l: i for i, l in enumerate(layers)}
chapter = {}
for l in inventory['layers']:
    if l['daily']:
        chapter[l['id']] = len(chapter) + 1
items = {i['key']: i for i in inventory['items']}

proposals = {}
for path in sorted((DESK / 'proposals').glob('*.json')):
    for p in load(path)['items']:
        proposals[p['key']] = p


def chosen_name(key):
    """The desk's name for `key`: a write-in, or the chosen proposal (design/naming/index.html's chosenName)."""
    name = decisions[key]['name']
    if name['choice'] == 'write-in':
        return one_line(name['writeIn']) or None
    if name['choice'] == 'proposal':
        p = proposals.get(key)
        if p is None or not isinstance(name['proposal'], int) or not 0 <= name['proposal'] < len(p['proposals']):
            die(f'{key}: name choice is proposal {name["proposal"]!r} but proposals/ has no such proposal')
        return one_line(p['proposals'][name['proposal']]['name']) or None
    return None


# --- What the manual already covers ------------------------------------------------------------------------------

covered_entities, covered_critters = set(), set()
used_ids, used_names, used_tag_bases = set(), set(), set()
for path in sorted(MANUAL.glob('*/*.md')):
    in_sightings = False
    for line in path.read_text(encoding='utf-8').split('\n'):
        if line.startswith('# '):
            used_names.add(line[2:].lower())
        elif line.startswith('id: '):
            fields = line.split(SEP)
            used_ids.add(fields[0][4:])
            used_tag_bases.add(re.sub(r'\(.*\)$', '', fields[1][5:]))
        elif line.startswith('## '):
            in_sightings = line == '## Sightings'
        elif in_sightings and line.startswith('- '):
            bits = line[2:].split(SEP)
            if len(bits) >= 2 and bits[1] == 'critter':
                covered_critters.add(bits[0])
            elif len(bits) >= 2 and not bits[1].startswith('topic:'):
                covered_entities.add(bits[1])


# --- Records -----------------------------------------------------------------------------------------------------

def folded_into(key):
    """The record `key` is folded into (a verified merge, or a variant with a target), or None."""
    d = decisions[key]['decision']
    if d['choice'] in ('merge', 'variant') and d.get('target'):
        return d['target']
    return None


def root_of(key):
    seen = [key]
    while (nxt := folded_into(seen[-1])) is not None:
        if nxt in seen:
            die(f'merge cycle: {" -> ".join(seen + [nxt])}')
        if nxt not in decisions:
            return None
        seen.append(nxt)
    return seen[-1]


def is_deleted(key):
    return decisions[key]['decision']['choice'] == 'delete'


counts = {
    'candidates': 0,
    'drafts': 0,
    'sightings': 0,
    'merged sightings': 0,
    'skipped: deleted': 0,
    'skipped: folded into another record (not a draft of its own)': 0,
    'skipped: name not resolved': 0,
    'skipped: already covered by a manual file': 0,
    'skipped: alternate critter species (no manual form yet)': 0,
    'skipped: id already used by a manual file': 0,
    'merge sightings dropped (target not drafted, or layer/entity already taken)': 0,
}

roots = []  # (key, item)
for key, it in items.items():
    if it['kind'] == 'critter-alt':
        counts['skipped: alternate critter species (no manual form yet)'] += 1
        continue
    counts['candidates'] += 1
    d = decisions[key]
    if is_deleted(key):
        counts['skipped: deleted'] += 1
    elif folded_into(key) is not None:
        counts['skipped: folded into another record (not a draft of its own)'] += 1
    elif not chosen_name(key):
        counts['skipped: name not resolved'] += 1
    elif (it['kind'] == 'critter' and it['critterLayer'] in covered_critters) or (it['entityId'] and it['entityId'] in covered_entities):
        counts['skipped: already covered by a manual file'] += 1
    else:
        roots.append((key, it))

# Merged/variant records, grouped under the drafted record they fold into.
drafted = {k for k, _ in roots}
merged_under = {k: [] for k in drafted}
for key, it in items.items():
    if folded_into(key) is None or it['kind'] in ('critter', 'critter-alt'):
        continue
    root = root_of(key)
    if root in drafted:
        merged_under[root].append((key, it))
    else:
        counts['merge sightings dropped (target not drafted, or layer/entity already taken)'] += 1


# --- Drafting ----------------------------------------------------------------------------------------------------

def tag_base(name):
    words = [w for w in re.sub(r'[^A-Z0-9]+', ' ', name.upper().replace("'", '').replace('’', '')).split()]
    base = ''
    for w in words:
        cand = w if not base else base + '-' + w
        if len(cand) > TAG_BASE_MAX:
            break
        base = cand
    if not base:
        base = (words[0] if words else 'ENTRY')[:TAG_BASE_MAX]
    if not re.match(r'^[A-Z]', base):
        base = 'X' + base[: TAG_BASE_MAX - 1]
    n = 1
    unique = base
    while unique in used_tag_bases:
        n += 1
        suffix = str(n)
        unique = base[: TAG_BASE_MAX - len(suffix)].rstrip('-') + suffix
    used_tag_bases.add(unique)
    return unique


def detail_for(key):
    p = proposals.get(key)
    return one_line(p['depicts']) if p and p.get('depicts') else None


def draft(key, it):
    name = chosen_name(key)
    layer = it['appearances'][0]['layer']
    p = proposals.get(key)
    desc = one_line(decisions[key].get('description', ''))
    if desc:
        blurb = sentence(desc)
    elif p and p.get('depicts'):
        blurb = sentence(p['depicts'])
    else:
        blurb = f'Found in the {layer_name[layer]} layer.'
    if p and p.get('concept'):
        c = one_line(p['concept'])
        # Lower-case the first letter after "Stands for", unless it starts an acronym or a proper name ("IP over ...").
        note = sentence('Stands for ' + (c[0].lower() + c[1:] if c[1:2].islower() else c))
    else:
        note = f'Part of the {layer_name[layer]} scenery.'
    for t in (blurb, note):
        if re.match(r'^(#|>|- )', t):
            die(f'{key}: drafted text starts with markdown syntax: {t[:30]!r}')

    sights = []  # (layer, what, detail)
    if it['kind'] == 'critter':
        sights.append((layer, 'critter', detail_for(key)))
        entry_id = f'crit-{layer}'
    else:
        sights.append((layer, it['entityId'], detail_for(key)))
        entry_id = it['entityId']
    taken_layers = {layer}
    taken_entities = {it['entityId']} if it['entityId'] else set()
    for mkey, mit in sorted(merged_under[key], key=lambda kv: (layer_rank[kv[1]['appearances'][0]['layer']], kv[0])):
        ml = mit['appearances'][0]['layer']
        if ml in taken_layers or mit['entityId'] in taken_entities or mit['entityId'] in covered_entities:
            counts['merge sightings dropped (target not drafted, or layer/entity already taken)'] += 1
            continue
        taken_layers.add(ml)
        taken_entities.add(mit['entityId'])
        sights.append((ml, mit['entityId'], detail_for(mkey)))
        counts['merged sightings'] += 1
    sights.sort(key=lambda s: layer_rank[s[0]])
    return entry_id, name, layer, blurb, note, sights


written = []
names_seen = set(used_names)
for key, it in roots:
    entry_id, name, layer, blurb, note, sights = draft(key, it)
    if entry_id in used_ids:
        counts['skipped: id already used by a manual file'] += 1
        continue
    if name.lower() in names_seen:
        # Two desk records can share a name; the manual needs unique names, so the later one says where it lives.
        name = f'{name} ({layer_name[layer].split(" / ")[0].split(" · ")[-1]})'
    names_seen.add(name.lower())
    used_ids.add(entry_id)
    home = next((s[0] for s in sights if s[0] in chapter), None)
    base = tag_base(name)
    tag = f'{base}({chapter[home]})' if home else base
    kind = 'critter' if it['kind'] == 'critter' else 'prop'
    lines = [
        f'# {name}',
        '',
        SEP.join([f'id: {entry_id}', f'tag: {tag}', f'kind: {kind}', 'rarity: common', 'status: draft']),
        '',
        f'<!-- drafted by scripts/manual-from-desk.py from design/naming record {key}; review the name, text and rarity, then set status: approved -->',
        blurb,
        '',
        f'> {note}',
        '',
        '## Sightings',
    ]
    for s_layer, what, detail in sights:
        lines.append('- ' + SEP.join([s_layer, what] + ([detail] if detail else [])))
    path = MANUAL / sights[0][0] / f'{entry_id}.md'
    written.append((path, '\n'.join(lines) + '\n', len(sights)))

dry = '--dry-run' in sys.argv
for path, text, n in written:
    if path.exists():
        die(f'{path} exists but covers nothing the scan found; refusing to overwrite it')
    if not dry:
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, 'x', encoding='utf-8') as f:
            f.write(text)
    counts['drafts'] += 1
    counts['sightings'] += n

print(('would write' if dry else 'wrote') + f' {counts["drafts"]} drafts')
for k, v in counts.items():
    print(f'  {k}: {v}')
