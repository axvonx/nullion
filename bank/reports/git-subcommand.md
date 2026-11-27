# Scoring report

Corpora: kernel, dblp, arxiv. score = Σ weight × min(1, log1p(count)/log1p(reference)) / Σ weight, reference = count ranked 3 in the category; weights {'kernel': 0.5, 'dblp': 1.0, 'arxiv': 1.0}; cut-offs [('off-by-one', 0.88), ('npe', 0.56), ('leak', 0.32), ('race', 0.22)].

Counts only rows that also mention: git.

## git-subcommand

161 candidates; 103 with no evidence.

| answer | kernel | dblp | arxiv | score | tier | source | judge | bank file |
|---|---|---|---|---|---|---|---|---|
| version | 69 | 23 | 151 | 0.97 | off-by-one | counts | npe | — |
| commit | 192 | 30 | 121 | 0.96 | off-by-one | counts | off-by-one | — |
| history ⚠ counts said off-by-one | 31 | 10 | 99 | 0.90 | heisenbug | judge (override) | heisenbug | — |
| log | 91 | 8 | 42 | 0.85 | npe | counts | off-by-one | — |
| merge | 42 | 6 | 80 | 0.83 | npe | counts | off-by-one | — |
| branch | 78 | 4 | 100 | 0.81 | npe | counts | off-by-one | — |
| diff | 47 | 4 | 26 | 0.69 | npe | counts | off-by-one | — |
| archive | 5 | 3 | 48 | 0.61 | npe | counts | leak | — |
| bisect | 80 | 4 | 5 | 0.60 | npe | counts | npe | — |
| clone | 55 | 2 | 17 | 0.58 | npe | counts | off-by-one | — |
| tag | 58 | 2 | 12 | 0.56 | npe | counts | off-by-one | — |
| show | 32 | 0 | 786 | 0.56 | leak | counts | npe | — |
| pull ⚠ counts said leak | 56 | 1 | 29 | 0.56 | off-by-one | judge (override) | off-by-one | — |
| apply | 28 | 0 | 273 | 0.55 | leak | counts | npe | — |
| blame | 20 | 4 | 5 | 0.54 | leak | counts | npe | — |
| switch | 29 | 2 | 13 | 0.54 | leak | counts | npe | — |
| help | 24 | 0 | 130 | 0.51 | leak | counts | npe | — |
| stage | 7 | 0 | 186 | 0.49 | leak | counts | leak | — |
| annotate | 4 | 0 | 203 | 0.47 | leak | counts | race | — |
| push ⚠ counts said leak | 13 | 1 | 22 | 0.47 | off-by-one | judge (override) | off-by-one | — |
| describe | 17 | 0 | 77 | 0.46 | leak | counts | npe | — |
| replace | 1 | 1 | 62 | 0.46 | leak | counts | race | — |
| remote ⚠ counts said leak | 18 | 0 | 71 | 0.46 | off-by-one | judge (override) | off-by-one | — |
| add ⚠ counts said leak | 30 | 0 | 47 | 0.45 | off-by-one | judge (override) | off-by-one | — |
| checkout ⚠ counts said leak | 24 | 1 | 4 | 0.38 | off-by-one | judge (override) | off-by-one | — |
| restore | 5 | 0 | 46 | 0.37 | leak | counts | npe | — |
| notes | 40 | 0 | 13 | 0.37 | leak | counts | leak | — |
| clean | 3 | 0 | 50 | 0.36 | leak | counts | npe | — |
| config ⚠ counts said leak | 55 | 1 | 1 | 0.35 | off-by-one | judge (override) | off-by-one | — |
| hook | 3 | 1 | 6 | 0.33 | heisenbug | judge | heisenbug | — |
| am | 47 | 0 | 5 | 0.31 | race | counts | leak | — |
| rebase ⚠ counts said race | 20 | 1 | 1 | 0.31 | off-by-one | judge (override) | off-by-one | — |
| revert ⚠ counts said race | 19 | 0 | 8 | 0.30 | off-by-one | judge (override) | off-by-one | — |
| fetch ⚠ counts said race | 23 | 0 | 7 | 0.30 | off-by-one | judge (override) | off-by-one | — |
| status ⚠ counts said race | 9 | 0 | 12 | 0.30 | off-by-one | judge (override) | off-by-one | — |
| shell | 1 | 1 | 6 | 0.29 | race | judge | race | — |
| prune | 0 | 0 | 47 | 0.29 | race | counts | leak | — |
| bundle | 3 | 0 | 16 | 0.28 | race | counts | leak | — |
| submodule | 2 | 1 | 3 | 0.27 | npe | judge | npe | — |
| refs | 26 | 0 | 3 | 0.25 | race | counts | heisenbug | — |
| replay | 0 | 0 | 26 | 0.25 | race | counts | heisenbug | — |
| cherry | 36 | 0 | 2 | 0.25 | race | counts | race | — |
| repo | 5 | 0 | 8 | 0.25 | heisenbug | judge | heisenbug | — |
| init | 4 | 1 | 1 | 0.24 | off-by-one | judge | off-by-one | — |
| diagnose | 0 | 0 | 22 | 0.24 | race | counts | heisenbug | — |
| grep ⚠ counts said race | 15 | 0 | 3 | 0.23 | npe | judge (override) | npe | — |
| maintenance | 0 | 0 | 20 | 0.23 | race | counts | race | — |
| column | 5 | 0 | 6 | 0.23 | heisenbug | judge | heisenbug | — |
| cherry-pick ⚠ counts said heisenbug | 36 | 0 | 1 | 0.22 | npe | judge (override) | npe | — |
| send-email ⚠ counts said heisenbug | 56 | 0 | 0 | 0.18 | leak | judge (override) | leak | — |
| gui | 1 | 0 | 6 | 0.18 | leak | judge | leak | — |
| format-patch ⚠ counts said heisenbug | 46 | 0 | 0 | 0.18 | npe | judge (override) | npe | — |
| worktree | 0 | 0 | 9 | 0.17 | npe | judge | npe | — |
| credential | 2 | 0 | 4 | 0.17 | race | judge | race | — |
| reset ⚠ counts said heisenbug | 11 | 0 | 1 | 0.17 | off-by-one | judge (override) | off-by-one | — |
| mv | 2 | 0 | 2 | 0.13 | npe | judge | npe | — |
| request-pull | 14 | 0 | 0 | 0.12 | heisenbug | counts | race | — |
| rm | 2 | 0 | 1 | 0.10 | npe | judge | npe | — |
| rerere | 6 | 0 | 0 | 0.09 | womm | pin | — | — |
| merge-base | 0 | 0 | 2 | 0.08 | leak | judge | leak | — |
| svn | 0 | 0 | 2 | 0.08 | leak | judge | leak | — |
| var | 0 | 0 | 2 | 0.08 | heisenbug | judge | heisenbug | — |
| verify-commit | 0 | 0 | 2 | 0.08 | race | judge | race | — |
| rev-parse | 5 | 0 | 0 | 0.08 | leak | judge | leak | — |
| daemon | 4 | 0 | 0 | 0.07 | leak | judge | leak | — |
| mergetool | 4 | 0 | 0 | 0.07 | npe | judge | npe | — |
| fsck | 3 | 0 | 0 | 0.06 | npe | judge | npe | — |
| verify-tag | 3 | 0 | 0 | 0.06 | race | judge | race | — |
| commit-graph | 0 | 0 | 1 | 0.05 | race | judge | race | — |
| merge-tree | 0 | 0 | 1 | 0.05 | race | judge | race | — |
| repack | 2 | 0 | 0 | 0.05 | race | judge | race | — |
| filter-branch | 1 | 0 | 0 | 0.03 | leak | judge | leak | — |
| shortlog | 1 | 0 | 0 | 0.03 | leak | judge | leak | — |
| archimport ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| backfill ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| bugreport ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| cat-file ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| check-attr ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| check-ignore ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| check-mailmap ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| check-ref-format ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| checkout-index ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| citool ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| commit-tree ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| count-objects ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| credential-cache ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| credential-store ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| cvsexportcommit ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| cvsimport ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| cvsserver ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| diff-files ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| diff-index ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| diff-pairs ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| diff-tree ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| difftool ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| fast-export ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| fast-import ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| fetch-pack ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| fmt-merge-msg ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| for-each-ref ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| for-each-repo ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| format-rev ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| fsck-objects ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| fsmonitor--daemon ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| gc ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| get-tar-commit-id ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| hash-object ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| http-backend ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| http-fetch ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| http-push ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| imap-send ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| index-pack ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| init-db ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| instaweb ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| interpret-trailers ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| last-modified ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| ls-files ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ls-remote ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| ls-tree ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| mailinfo ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mailsplit ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| merge-file ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| merge-index ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| merge-one-file ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mktag ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| mktree ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| multi-pack-index ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| name-rev ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| p4 ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| pack-objects ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| pack-redundant ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| pack-refs ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| patch-id ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| prune-packed ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| quiltimport ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| range-diff ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| read-tree ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| receive-pack ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| reflog ⚠ no evidence | 0 | 0 | 0 | 0.00 | npe | judge | npe | — |
| rev-list ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| send-pack ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| show-branch ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| show-index ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| show-ref ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| sparse-checkout ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| stash ⚠ no evidence | 0 | 0 | 0 | 0.00 | off-by-one | judge | off-by-one | — |
| stripspace | 0 | 0 | 0 | 0.00 | bitflip | pin | — | — |
| symbolic-ref ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| unpack-file ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| unpack-objects ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| update-index ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| update-ref ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| update-server-info ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| upload-archive ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| upload-pack ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| url-parse ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| verify-pack ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| whatchanged ⚠ no evidence | 0 | 0 | 0 | 0.00 | leak | judge | leak | — |
| write-tree ⚠ no evidence | 0 | 0 | 0 | 0.00 | race | judge | race | — |
| remote-ext ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |
| remote-fd ⚠ no evidence | 0 | 0 | 0 | 0.00 | heisenbug | judge | heisenbug | — |

Counts vs judgement disagreed by more than 1 tier (judgement used, please review): add (counts said leak, now off-by-one), checkout (counts said leak, now off-by-one), cherry-pick (counts said heisenbug, now npe), config (counts said leak, now off-by-one), fetch (counts said race, now off-by-one), format-patch (counts said heisenbug, now npe), grep (counts said race, now npe), history (counts said off-by-one, now heisenbug), pull (counts said leak, now off-by-one), push (counts said leak, now off-by-one), rebase (counts said race, now off-by-one), remote (counts said leak, now off-by-one), reset (counts said heisenbug, now off-by-one), revert (counts said race, now off-by-one), send-email (counts said heisenbug, now leak), status (counts said race, now off-by-one)

Your file tier and the scored tier differ by more than one (your file wins; worth a look): none

In the bank file but not scored: none


## Precision sample

20/20 sampled answers are members (100%); 20/20 also have an acceptable tier. Not members: none.
