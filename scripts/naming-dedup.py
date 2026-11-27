#!/usr/bin/env python3
"""Verify duplicate / merge candidates for the Field Manual naming desk.

Run:  python3 -I scripts/naming-dedup.py

NOTE (2026-11-27): historical. It was written against lib-endless.ts's mix() calls, which are gone: every layer
is now built by buildLibraries (src/render/v4/library.ts) from the borrow entries in each layer's module
(src/layers/<layer-id>.ts; lib-endless.ts and its siblings are gone). It fails
loudly ("no mix() calls found") until its source step is rewritten for that; dedup.json is its last output.

Reads  design/naming/inventory.json, design/naming/proposals/*.json and
       src/render/v4/lib-endless.ts (through a throwaway tsc build in a temp dir).
Writes design/naming/dedup.json.

Evidence, in order of strength:
  1. Code proof ("donor-reuse"). lib-endless.ts builds Endless layers with
     mix(prefix, bespoke, donor), which appends donor entities under the id
     `${prefix}-${donor.id}` using the same draw function. The mix() calls are
     found by regex in the source; the real arrays are then loaded from a
     compiled copy of the modules and the reused ids are read off the actual
     output (everything after the bespoke entities), not re-derived by splitting
     hyphens. The reused item is the same drawing as `e:<donor.id>`.
  2. Pixel proof. For a candidate pair (A, B) the first appearance of A is
     compared with the first appearance of B at the same size (or the first
     appearance at all, if sizes are equal). Sprites are downscaled to native
     pixels by sampling the centre of each integer-scale block, after checking
     every block is uniform (alpha uniform, RGB uniform where opaque). The
     alpha masks are compared (alpha > 0). maskDiff = XOR pixels / union pixels.
     Equal masks and equal RGB on the mask -> pixel-identical; equal masks with
     different RGB -> same-shape-recolour; otherwise mask-diff.

Verdicts: same-entity (code proof, or pixel-identical), recolour-variant
(same shape, other colours, no code proof), not-duplicate (masks differ by more
than 10%, or the Gemini target does not exist), needs-owner (everything else,
including small shape differences, a missing or self target, and a Gemini
target that differs from the code-proven donor). Chains A->B->C are resolved to
the root C; cycles are sent to needs-owner. Any unexpected condition raises.
"""

import datetime
import glob
import json
from typing import NoReturn
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
NAMING = ROOT / "design" / "naming"
SPRITES = NAMING / "sprites"
ENDLESS_SRC = ROOT / "src" / "render" / "v4" / "lib-endless.ts"
V4_FILES = [
    ROOT / "src" / "render" / "v4" / name
    for name in ("lib-endless.ts", "lib-upper.ts", "lib-mid.ts", "lib-lower.ts")
]
OUT = NAMING / "dedup.json"

MIX_DEF_RE = re.compile(r"export const (\w+) = mix\('([a-z0-9-]+)', (\w+), (\w+)\);")
MIX_CALL_RE = re.compile(r"\bmix\(")
MASK_LIMIT = 0.10
MIN_LAYER_TYPES = 20  # must match mix() in lib-endless.ts

NODE_DUMP = r"""
const path = require('path');
const dir = process.argv[1];
const calls = JSON.parse(process.argv[2]);
const mods = ['lib-endless', 'lib-upper', 'lib-mid', 'lib-lower']
  .map((m) => require(path.join(dir, 'render', 'v4', m + '.js')));
const all = Object.assign({}, ...mods);
const out = [];
for (const c of calls) {
  const B = all[c.bespoke], D = all[c.donor], E = all[c.name];
  for (const [label, arr] of [['bespoke', B], ['donor', D], ['endless', E]]) {
    if (!Array.isArray(arr)) throw new Error(c.name + ': ' + label + ' export missing');
  }
  const bIds = B.map((e) => e.id);
  const eIds = E.map((e) => e.id);
  if (JSON.stringify(eIds.slice(0, B.length)) !== JSON.stringify(bIds)) {
    throw new Error(c.name + ': bespoke entities are not the leading entries');
  }
  const reuse = [];
  for (const e of E.slice(B.length)) {
    const i = reuse.length;
    if (i >= D.length) throw new Error(c.name + ': more reused entries than donors');
    const want = c.prefix + '-' + D[i].id;
    if (e.id !== want) throw new Error(c.name + ': reused id ' + e.id + ' != ' + want);
    reuse.push({ reuseId: e.id, donorId: D[i].id, donorIndex: i });
  }
  out.push({ name: c.name, prefix: c.prefix, bespoke: c.bespoke, donor: c.donor,
             bespokeCount: B.length, reuse });
}
process.stdout.write(JSON.stringify(out));
"""


def fail(msg) -> NoReturn:
    raise RuntimeError(msg)


def parse_mix_calls():
    src = ENDLESS_SRC.read_text()
    calls = []
    for m in MIX_DEF_RE.finditer(src):
        calls.append({"name": m.group(1), "prefix": m.group(2),
                      "bespoke": m.group(3), "donor": m.group(4)})
    total = len(MIX_CALL_RE.findall(src))
    # one occurrence is the `function mix(` definition itself
    if total != len(calls) + 1:
        fail(f"mix( occurrences ({total}) != parsed calls ({len(calls)}) + definition; "
             "the mix() call format changed, update the regex")
    if not calls:
        fail("no mix() calls found in lib-endless.ts")
    return calls


def load_reuse(calls):
    tmp = Path(tempfile.mkdtemp(prefix="naming-dedup-"))
    try:
        tsc = ROOT / "node_modules" / ".bin" / "tsc"
        build = tmp / "build"
        cmd = [str(tsc), "--ignoreConfig", "--outDir", str(build), "--target", "es2020",
               "--skipLibCheck", "--rootDir", str(ROOT / "src"), "--module", "commonjs",
               "--moduleResolution", "bundler", "--types", "node"] + [str(p) for p in V4_FILES]
        proc = subprocess.run(cmd, capture_output=True, text=True, cwd=str(ROOT))
        if proc.returncode != 0 or not (build / "render" / "v4" / "lib-endless.js").exists():
            fail("tsc build of the v4 libraries failed:\n" + proc.stdout + proc.stderr)
        node = shutil.which("node")
        if node is None:
            fail("node not found on PATH")
        proc = subprocess.run([node, "-e", NODE_DUMP, str(build), json.dumps(calls)],
                              capture_output=True, text=True, cwd=str(ROOT))
        if proc.returncode != 0:
            fail("node dump of mix() output failed:\n" + proc.stderr)
        return json.loads(proc.stdout)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def load_sprite(img):
    path = SPRITES / img
    if not path.exists():
        return None, f"error: missing sprite {img}"
    return Image.open(path).convert("RGBA"), None


def native_pixels(im, size):
    """Downscale an integer-upscaled sprite to native pixels. Returns (rgba, error)."""
    w, h = size
    W, H = im.size
    if W % w or H % h or W // w != H // h:
        return None, f"error: scale mismatch {W}x{H} vs size {w}x{h}"
    k = W // w
    arr = np.asarray(im, dtype=np.uint8)
    blocks = arr.reshape(h, k, w, k, 4)
    alpha = blocks[..., 3]
    if not np.all(alpha == alpha[:, :1, :, :1]):
        return None, "error: non-uniform alpha within upscale blocks"
    rgb = blocks[..., :3].astype(np.int32)
    opaque = (alpha[:, :1, :, :1] > 0)
    rgb_ref = rgb[:, :1, :, :1, :]
    if np.any(((rgb != rgb_ref) & opaque[..., None]).any(axis=-1) & opaque):
        return None, "error: non-uniform colour within upscale blocks"
    return blocks[:, k // 2, :, k // 2, :].copy(), None


def compare_appearances(a_item, a_app, b_item, b_app):
    """Pixel-compare two appearances of the same size. Returns a dict."""
    res = {"aImg": a_app["img"], "bImg": b_app["img"], "size": a_app["size"]}
    ia, err = load_sprite(a_app["img"])
    if err:
        return {**res, "proof": err}
    ib, err = load_sprite(b_app["img"])
    if err:
        return {**res, "proof": err}
    na, err = native_pixels(ia, a_app["size"])
    if err:
        return {**res, "proof": err}
    assert na is not None
    nb, err = native_pixels(ib, b_app["size"])
    if err:
        return {**res, "proof": err}
    assert nb is not None
    ma = na[..., 3] > 0
    mb = nb[..., 3] > 0
    union = int((ma | mb).sum())
    xor = int((ma ^ mb).sum())
    mask_diff = 0.0 if union == 0 else xor / union
    res["maskDiff"] = round(mask_diff, 4)
    if xor:
        res["proof"] = "mask-diff"
        return res
    recolour = int((((na[..., :3].astype(np.int32) != nb[..., :3]).any(axis=-1)) & ma).sum())
    res["proof"] = "pixel-identical" if recolour == 0 else "same-shape-recolour"
    res["recolourPixels"] = recolour
    return res


def pixel_proof(a_item, b_item):
    """First appearance of A against the first appearance of B at the same size."""
    if not a_item["appearances"]:
        return {"proof": "error: no appearances for " + a_item["key"], "maskDiff": None}
    a_app = a_item["appearances"][0]
    same_size = [b for b in b_item["appearances"] if b["size"] == a_app["size"]]
    if not same_size:
        sizes = sorted({tuple(b["size"]) for b in b_item["appearances"]})
        return {"proof": f"error: size mismatch {a_app['size']} vs {sizes}", "maskDiff": None}
    return compare_appearances(a_item, a_app, b_item, same_size[0])


def main():
    inv = json.loads((NAMING / "inventory.json").read_text())
    items = inv["items"]
    by_key = {}
    for it in items:
        if it["key"] in by_key:
            fail("duplicate inventory key " + it["key"])
        by_key[it["key"]] = it

    gem = {}
    for path in sorted(glob.glob(str(NAMING / "proposals" / "*.json"))):
        for it in json.loads(Path(path).read_text())["items"]:
            if it["key"] in gem:
                fail("duplicate proposal key " + it["key"])
            gem[it["key"]] = it

    calls = parse_mix_calls()
    reuse_rows = load_reuse(calls)

    # reuse map: prefixed key -> donor key + evidence
    reuse = {}
    for call in reuse_rows:
        for r in call["reuse"]:
            key = "e:" + r["reuseId"]
            donor_key = "e:" + r["donorId"]
            if key not in by_key:
                fail(f"reused entity {key} is missing from the inventory")
            if donor_key not in by_key:
                fail(f"donor entity {donor_key} is missing from the inventory")
            if not any(a["daily"] for a in by_key[donor_key]["appearances"]):
                fail(f"donor {donor_key} has no Daily appearance; mix() donors must be Daily")
            reuse[key] = {
                "target": donor_key,
                "evidence": (f"lib-endless.ts mix('{call['prefix']}', {call['bespoke']}, "
                             f"{call['donor']}) reuses {call['donor']}[{r['donorIndex']}] "
                             f"'{r['donorId']}' as '{r['reuseId']}' (same draw function, "
                             f"palette only)"),
            }

    # candidate set: Gemini merge/variant plus every code-proven reuse
    cand_keys = sorted({k for k, v in gem.items() if v.get("decisionHint") in ("merge", "variant")}
                       | set(reuse))
    for k in cand_keys:
        if k not in by_key:
            fail(f"candidate {k} is not in the inventory")

    pixel_cache = {}

    def pixel(a, b):
        if (a, b) not in pixel_cache:
            pixel_cache[(a, b)] = pixel_proof(by_key[a], by_key[b])
        return pixel_cache[(a, b)]

    records = {}
    for k in cand_keys:
        g = gem.get(k, {})
        g_hint = g.get("decisionHint")
        g_target = g.get("mergeWith")
        rec = {"key": k, "geminiHint": g_hint, "geminiTarget": g_target,
               "target": None, "verdict": None, "proof": None, "maskDiff": None,
               "evidence": ""}
        if k in reuse:
            donor = reuse[k]["target"]
            rec["target"] = donor
            pp = pixel(k, donor)
            rec["maskDiff"] = pp.get("maskDiff")
            rec["pixelProof"] = pp.get("proof")
            contradicts = pp["proof"].startswith("mask-diff") and (pp.get("maskDiff") or 0) > MASK_LIMIT
            note = ""
            if contradicts:
                note = (f" WARNING: pixels disagree with the code proof "
                        f"(mask diff {pp['maskDiff']:.2%}).")
            if g_hint in ("merge", "variant") and g_target and g_target != donor:
                rec["verdict"] = "needs-owner"
                rec["proof"] = "donor-reuse"
                rec["evidence"] = (reuse[k]["evidence"] + f". Gemini ({g_hint}) pointed at "
                                   f"{g_target}, not the code-proven donor {donor}.{note}")
            else:
                rec["verdict"] = "same-entity"
                rec["proof"] = "donor-reuse"
                rec["evidence"] = (reuse[k]["evidence"] + f". Gemini hint: {g_hint or 'none'}."
                                   f"{note}")
            records[k] = rec
            continue

        # Gemini merge/variant without code proof
        if g_target is None:
            rec.update(verdict="needs-owner", proof="no-target",
                       evidence="Gemini said merge/variant but named no target.")
        elif g_target not in by_key:
            rec.update(verdict="not-duplicate", proof="missing-target",
                       evidence=f"Gemini target {g_target} does not exist in the inventory.")
        elif g_target == k:
            rec.update(verdict="needs-owner", proof="self-target",
                       evidence="Gemini target is the item itself.")
        else:
            pp = pixel(k, g_target)
            proof = pp["proof"]
            rec["pixelProof"] = proof
            rec["maskDiff"] = pp.get("maskDiff")
            rec["target"] = g_target
            if proof.startswith("error:"):
                rec.update(verdict="needs-owner", proof=proof,
                           evidence=f"Pixel comparison failed: {proof}.")
            elif proof == "pixel-identical":
                rec.update(verdict="same-entity", proof=proof,
                           evidence=f"Sprites identical at native size vs {g_target}.")
            elif proof == "same-shape-recolour":
                rec.update(verdict="recolour-variant", proof=proof,
                           evidence=f"Same silhouette as {g_target}; "
                                    f"{pp.get('recolourPixels', 0)} opaque pixels recoloured.")
            elif pp["maskDiff"] > MASK_LIMIT:
                rec.update(verdict="not-duplicate", proof="mask-diff",
                           evidence=f"Silhouette differs from {g_target}: "
                                    f"{pp['maskDiff']:.1%} of mask pixels disagree.")
            else:
                rec.update(verdict="needs-owner", proof="mask-diff",
                           evidence=f"Small silhouette difference from {g_target}: "
                                    f"{pp['maskDiff']:.1%} of mask pixels disagree.")
        records[k] = rec

    # chain resolution: A->B->C with both same-entity points A at C
    same = {k: r["target"] for k, r in records.items()
            if r["verdict"] == "same-entity" and r["target"]}
    for k in list(same):
        seen = [k]
        cur = same[k]
        while cur in same and cur not in seen:
            seen.append(cur)
            cur = same[cur]
        if cur in seen:
            for s in seen:
                records[s]["verdict"] = "needs-owner"
                records[s]["evidence"] += " Merge chain forms a cycle."
            continue
        if cur != same[k]:
            records[k]["evidence"] += f" Chain resolved: {' -> '.join(seen + [cur])}."
            records[k]["target"] = cur
    for k, r in records.items():
        if r["target"] == k:
            fail(f"{k} points at itself after resolution")

    final_items = []
    for k in cand_keys:
        r = records[k]
        final_items.append({
            "key": k,
            "target": r["target"] if r["verdict"] in ("same-entity", "recolour-variant", "needs-owner") else None,
            "verdict": r["verdict"],
            "proof": r["proof"],
            "maskDiff": r["maskDiff"],
            "geminiHint": r["geminiHint"],
            "geminiTarget": r["geminiTarget"],
            "pixelProof": r.get("pixelProof"),
            "evidence": r["evidence"].strip(),
        })

    verdicts = {}
    proofs = {}
    hint_check = {"confirmed": 0, "targetDiffers": 0, "contradicted": 0, "needsOwner": 0}
    for r in final_items:
        verdicts[r["verdict"]] = verdicts.get(r["verdict"], 0) + 1
        proofs[r["proof"]] = proofs.get(r["proof"], 0) + 1
        if r["geminiHint"] in ("merge", "variant"):
            if r["verdict"] == "not-duplicate":
                hint_check["contradicted"] += 1
            elif r["verdict"] == "needs-owner":
                hint_check["needsOwner"] += 1
            elif r["target"] == r["geminiTarget"]:
                hint_check["confirmed"] += 1
            else:
                hint_check["targetDiffers"] += 1
    gem_hints = {}
    for r in final_items:
        if r["geminiHint"] in ("merge", "variant"):
            gem_hints[r["geminiHint"]] = gem_hints.get(r["geminiHint"], 0) + 1
    counts = {
        "candidates": len(final_items),
        "verdicts": dict(sorted(verdicts.items())),
        "proofs": dict(sorted(proofs.items())),
        "geminiMergeOrVariantHints": sum(gem_hints.values()),
        "geminiHintBreakdown": dict(sorted(gem_hints.items())),
        "geminiHintCheck": hint_check,
        "reuseItems": len(reuse),
    }

    method = (
        "Candidates are every item Gemini flagged merge or variant plus every item the code "
        "proves is a donor reuse. The mix() calls in src/render/v4/lib-endless.ts are found by "
        "regex; the modules are compiled with tsc into a temp directory and the actual Endless "
        "arrays are read, so reused ids are taken from the real mix() output and checked against "
        "bespoke/donor order. A reused item is the same drawing as its donor (code proof). Each "
        "candidate is also pixel-compared at native size: the first appearance of the item against "
        "the target's first appearance at the same size, with the integer upscale undone by "
        "sampling the centre of each block after checking the blocks are uniform. maskDiff is XOR "
        "over union of the alpha>0 masks. Verdicts follow the rules in the script docstring; chains "
        "resolve to the root and cycles go to needs-owner. Unexpected conditions raise."
    )
    result = {
        "generated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
        "method": method,
        "counts": counts,
        "items": final_items,
    }
    OUT.write_text(json.dumps(result, indent=1) + "\n")
    print(json.dumps(counts, indent=1))


if __name__ == "__main__":
    try:
        main()
    except RuntimeError as exc:
        print(f"naming-dedup: {exc}", file=sys.stderr)
        sys.exit(1)
