#!/usr/bin/env python3
"""Endless pacing simulation: player profiles x frame multiplier x heart rules -> time to the kernel and the rings.

Usage: python3 -I scripts/endless-sim.py [--runs N]

Owner's targets (2026-11-27): a good player reaches the kernel in about 5 minutes, the rings in about 15, and about
10% of good runs reach the Landauer limit; the scale eases off smoothly with depth (no step).
Model, per prompt: 3 s reading, the profile's answer time, 6 s of dive / reveal / Unwind; a timeout costs the full
watchdog (endlessAnswerMs at that depth) and a heart. Accepted answers land on a tier from the profile's mix and push
`tier frames x k`. Hearts: start 3, max 3; a Bit Flip restores one; every `refill` frames earned restores one.
The profiles are guesses (no play data yet): the table is for choosing k and refill, not a measurement.
"""
import random
import statistics
import sys

FRAMES = {"obo": 1, "womm": 1, "npe": 2, "leak": 3, "race": 5, "heis": 8, "bitflip": 13}
PROFILES = {
    # name: (answer seconds, timeout chance per prompt, tier mix of accepted answers)
    "casual": (14, 0.12, {"obo": .45, "womm": .15, "npe": .25, "leak": .10, "race": .04, "heis": .008, "bitflip": .002}),
    "good": (10, 0.06, {"obo": .30, "womm": .15, "npe": .28, "leak": .15, "race": .08, "heis": .035, "bitflip": .005}),
    "strong": (7, 0.03, {"obo": .18, "womm": .12, "npe": .27, "leak": .20, "race": .14, "heis": .08, "bitflip": .01}),
}
KERNEL, RINGS, BOTTOM = 705, 1325, 2500  # Kernel Entry & VFS Gate; VMM & Virtual Devices (the rings); Landauer
READ_S, SHOW_S = 3, 6
CAP_S = 3 * 3600


def answer_ms(depth: float) -> float:
    return 30 if depth < 605 else 25 if depth < 1325 else 20 if depth < 2030 else 16


def run(profile, k, refill: int | None, rng: random.Random):
    ans_s, miss, mix = profile
    tiers, weights = list(mix), list(mix.values())
    depth = t = 0.0
    hearts, earned_since = 3, 0.0
    t_kernel = t_rings = None
    while hearts > 0 and t < CAP_S:
        if rng.random() < miss:
            t += READ_S + answer_ms(depth)
            hearts -= 1
            continue
        tier = rng.choices(tiers, weights)[0]
        push = round(FRAMES[tier] * (k(depth) if callable(k) else k))
        depth += push
        t += READ_S + ans_s + SHOW_S
        if tier == "bitflip":
            hearts = min(3, hearts + 1)
        if refill:
            earned_since += push
            while earned_since >= refill:
                earned_since -= refill
                hearts = min(3, hearts + 1)
        if t_kernel is None and depth >= KERNEL:
            t_kernel = t
        if t_rings is None and depth >= RINGS:
            t_rings = t
    return depth, t, t_kernel, t_rings


def summarize(name, k, refill, n, seed=1):
    rng = random.Random(seed)
    rs = [run(PROFILES[name], k, refill, rng) for _ in range(n)]
    depth = statistics.median(r[0] for r in rs)
    mins = statistics.median(r[1] for r in rs) / 60
    kern = [r[2] for r in rs if r[2] is not None]
    ring = [r[3] for r in rs if r[3] is not None]
    bottom = sum(1 for r in rs if r[0] >= BOTTOM) / n
    fmt = lambda xs: f"{statistics.median(xs) / 60:5.1f}m ({len(xs) / n:4.0%})" if xs else "   never     "
    kl = getattr(k, "label", k)
    return f"{name:7} k={kl:<7} refill={str(refill):5} | run {mins:5.1f}m, depth {depth:6.0f} | kernel {fmt(kern)} | rings {fmt(ring)} | bottom {bottom:4.0%}"


class Smooth:
    """The shipped curve (src/core/modes.ts endlessFrames): k0 / (1 + depth / D), never below the tier's own frames."""

    def __init__(self, k0: float, d: float):
        self.k0, self.d, self.label = k0, d, f"{k0:g}/(1+d/{d:g})"

    def __call__(self, depth: float) -> float:
        return max(1.0, self.k0 / (1 + depth / self.d))


def main():
    n = int(sys.argv[sys.argv.index("--runs") + 1]) if "--runs" in sys.argv else 2000
    ks = [1, 15, 20] if "--all" in sys.argv else [Smooth(36, 400), Smooth(38, 400)]
    refills = (None, 100, 150, 250) if "--all" in sys.argv else (750, 1000)
    for k in ks:
        for refill in refills:
            for name in PROFILES:
                print(summarize(name, k, refill, n))
        print()


if __name__ == "__main__":
    main()
