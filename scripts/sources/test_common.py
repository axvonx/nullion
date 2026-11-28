"""Pins the combiners' familiarity formula, cut-off fit and merge. Run: python3 -I -m unittest discover -s scripts/sources"""
import pathlib
import sys
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import common as C  # noqa: E402


def entry(name, **signals):
    return C.Entry(name=name, aliases=set(), sources={"t"}, packages=set(), evidence={}, signals=dict(signals))


class FitCutoffs(unittest.TestCase):
    def test_clean_ladder_is_split_exactly(self):
        pairs = [(0.9, "off-by-one"), (0.8, "off-by-one"), (0.7, "npe"), (0.6, "leak"), (0.5, "leak"),
                 (0.4, "race"), (0.1, "heisenbug"), (0.0, "heisenbug")]
        cuts = C.fit_cutoffs(pairs)
        self.assertEqual(cuts, [0.75, 0.65, 0.45, 0.25])
        self.assertEqual([C.tier_of(s, cuts) for s, _ in pairs], [t for _, t in pairs])

    def test_noisy_pairs_maximise_agreement_and_stay_descending(self):
        pairs = [(0.9, "npe"), (0.85, "off-by-one"), (0.8, "off-by-one"), (0.5, "leak"), (0.45, "off-by-one"),
                 (0.3, "race"), (0.2, "race"), (0.1, "heisenbug")]
        cuts = C.fit_cutoffs(pairs)
        self.assertEqual(cuts, sorted(cuts, reverse=True))
        hits = sum(C.tier_of(s, cuts) == t for s, t in pairs)
        self.assertGreaterEqual(hits, 6)

    def test_equal_scores_never_split(self):
        pairs = [(0.9, "off-by-one"), (0.7, "npe"), (0.5, "leak"), (0.0, "race"), (0.0, "race"),
                 (0.0, "heisenbug"), (0.0, "heisenbug"), (0.0, "heisenbug")]
        cuts = C.fit_cutoffs(pairs)
        self.assertEqual(len({C.tier_of(s, cuts) for s, _ in pairs if s == 0.0}), 1)
        self.assertEqual(C.tier_of(0.0, cuts), "heisenbug")  # three of the five zeros say heisenbug

    def test_too_few_pairs_fail_loudly(self):
        with self.assertRaises(AssertionError):
            C.fit_cutoffs([(0.5, "npe")])


class Familiarity(unittest.TestCase):
    def test_se_only_entries_score_on_se(self):
        es = [entry("a", se=1000), entry("b", se=100), entry("c", se=10), entry("d", se=0)]
        C.familiarity(es, ["popcon"])
        self.assertEqual([e.score for e in es], [1.0, 1.0, 1.0, 0.0])  # ref = 3rd largest (10)

    def test_secondary_counts_only_when_present_and_package_weight_halves(self):
        es = [entry("a", se=10, popcon=100), entry("b", se=10, popcon=100, popcon_weight=0.5), entry("c", se=10),
              entry("d", se=10, popcon=0)]
        C.familiarity(es, ["popcon"])
        a, b, c, d = (e.score for e in es)
        self.assertEqual(a, 1.0)
        self.assertEqual(b, round(0.6 + 0.4 * 0.5, 4))
        self.assertEqual(c, 1.0)        # no Debian package: scored on se alone
        self.assertEqual(d, 0.6)        # packaged, never installed: counts as 0

    def test_missing_se_is_a_bug(self):
        with self.assertRaises(AssertionError):
            C.familiarity([entry("a")], [])


class Merge(unittest.TestCase):
    def test_same_name_merges_aliases_never_chain(self):
        cs = [C.Candidate("sshd", "debian:x", aliases={"openssh-server"}, package="openssh-server"),
              C.Candidate("sshd", "macos:LaunchDaemons"),
              C.Candidate("httpd", "freebsd:x", aliases={"apache"}),
              C.Candidate("apache2", "debian:x", aliases={"apache"})]
        es = {e.name: e for e in C.merge(cs, prefer=["freebsd", "debian", "macos"])}
        self.assertEqual(set(es), {"sshd", "httpd", "apache2"})
        self.assertEqual(es["sshd"].sources, {"debian:x", "macos:LaunchDaemons"})
        self.assertEqual(es["sshd"].aliases, {"openssh-server"})
        self.assertIn("apache", es["httpd"].aliases)
        self.assertIn("apache", es["apache2"].aliases)

    def test_alias_that_is_another_entry_is_dropped(self):
        cs = [C.Candidate("mysqld", "debian:x", aliases={"mariadbd"}), C.Candidate("mariadbd", "debian:x")]
        es = {e.name: e for e in C.merge(cs, prefer=["debian"])}
        self.assertEqual(es["mysqld"].aliases, set())


class Lookup(unittest.TestCase):
    def test_tail_noun_is_dropped(self):
        e = entry("unbound", se=1)
        idx = C.key_index([e])
        self.assertIs(C.lookup(idx, "unbound daemon", [], ["daemon"]), e)
        self.assertIsNone(C.lookup(idx, "bound", [], ["daemon"]))


if __name__ == "__main__":
    unittest.main()
