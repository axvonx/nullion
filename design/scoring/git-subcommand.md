# Scoring: git-subcommand (Name a git subcommand)

159 answers (Bit Flip and Works on my machine left out); 8 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 15 (9%) | 15 | 0 |
| npe | 18 (11%) | 18 | 0 |
| leak | 30 (19%) | 30 | 0 |
| race | 9 (6%) | 9 | 0 |
| heisenbug | 87 (55%) | 87 | 0 |

Same tier as today: 159/159 (100%).

## Off-by-one (15)

commit 5.6 [0c 2156q 5f 0s], clone 5.5 [0c 1390q 2f 0s], push 5.5 [0c 1719q 1f 0s], pull 5.5 [0c 1243q 0f 0s], status 5.4 [0c 201q 3f 0s], checkout 5.4 [0c 1097q 0f 0s], branch 5.4 [0c 3261q 2f 0s], log 5.3 [0c 953q 0f 0s], merge 5.2 [0c 3382q 0f 0s], add 5.1 [0c 340q 0f 0s], diff 5.1 [0c 5605q 0f 0s], blame 5.0* [0c 119q 4f 0s], help 5.0* [0c 0q 0f 0s], init 4.8 [0c 2509q 1f 0s], rebase 4.6 [0c 1698q 2f 0s]

## Null pointer exception (18)

reset 4.2 [0c 520q 0f 0s], stash 4.0 [0c 685q 0f 0s], rm 4.0* [0c 117q 0f 0s], tag 4.0 [0c 556q 0f 0s], config 4.0* [0c 7795q 2f 0s], remote 4.0* [0c 943q 1f 0s], show 4.0* [0c 78q 1f 0s], switch 4.0* [0c 11q 3f 0s], fetch 4.0 [0c 410q 2f 0s], revert 3.9 [0c 505q 0f 0s], cherry-pick 3.3 [0c 457q 0f 0s], clean 3.0 [0c 57q 0f 0s], grep 2.9 [0c 23132q 58f 0s], submodule 2.6 [0c 3167q 0f 0s], restore 2.4 [0c 0q 1f 0s], bisect 2.1 [0c 104q 1f 0s], gc 2.0 [0c 65q 0f 0s], stage 2.0* [0c 100q 4f 0s]

## Memory leak (30)

am 2.0 [0c 40q 0f 0s], describe 1.9 [0c 45q 0f 0s], difftool 1.9 [0c 131q 0f 0s], reflog 1.9 [0c 92q 0f 0s], mv 1.9 [0c 41q 0f 0s], apply 1.9 [0c 47q 0f 0s], worktree 1.8 [0c 144q 0f 0s], ls-files 1.8 [0c 45q 0f 0s], mergetool 1.7 [0c 156q 0f 0s], rev-list 1.7 [0c 56q 0f 0s], format-patch 1.6 [0c 49q 0f 0s], history 1.5 [0c 92q 1f 0s], sparse-checkout 1.4 [0c 132q 0f 0s], filter-branch 1.4 [0c 467q 0f 0s], gui 1.4 [0c 232q 0f 0s], archive 1.3 [0c 52q 1f 0s], fsck 1.2 [0c 772q 0f 0s], bundle 1.1 [0c 45q 0f 0s], version 1.1 [0c 214q 4f 0s], repo 1.0 [0c 617q 14f 0s], daemon 1.0 [0c 37q 8f 0s], refs 0.9 [0c 231q 1f 0s], notes 0.9 [0c 54q 0f 0s], fast-import 0.7 [0c 35q 0f 0s], svn 0.7 [0c 1961q 0f 0s], shell 0.7 [0c 70q 0f 0s], last-modified 0.6 [0c 496q 0f 0s], p4 0.5 [0c 131q 0f 0s], url-parse 0.5 [0c 198q 1f 0s], http-backend 0.3 [0c 224q 0f 0s]

## Race condition (9)

ls-remote 2.0 [0c 19q 0f 0s], rev-parse 1.8 [0c 15q 0f 0s], send-email 1.5 [0c 26q 12f 0s], ls-tree 1.4 [0c 12q 1f 0s], cherry 1.2 [0c 23q 0f 0s], diff-tree 0.9 [0c 22q 0f 0s], merge-file 0.8 [0c 19q 0f 0s], fast-export 0.7 [0c 21q 1f 0s], cvsimport 0.5 [0c 16q 0f 0s]

## Heisenbug (87)

cat-file 1.7 [0c 0q 0f 0s], shortlog 1.5 [0c 0q 0f 0s], prune 1.4 [0c 0q 0f 0s], hook 1.4 [0c 0q 0f 0s], annotate 1.3 [0c 0q 2f 0s], merge-base 1.3 [0c 9q 0f 0s], whatchanged 1.2 [0c 0q 0f 0s], repack 1.2 [0c 0q 0f 0s], for-each-ref 1.1 [0c 0q 0f 0s], update-index 1.1 [0c 0q 0f 0s], range-diff 1.0 [0c 6q 0f 0s], credential-cache 1.0 [0c 0q 0f 0s], credential 1.0 [0c 0q 0f 0s], show-branch 1.0 [0c 0q 0f 0s], hash-object 1.0 [0c 0q 0f 0s], verify-tag 1.0 [0c 0q 0f 0s], credential-store 0.9 [0c 0q 0f 0s], maintenance 0.9 [0c 6q 1f 0s], diff-index 0.9 [0c 0q 0f 0s], check-attr 0.8 [0c 0q 0f 0s], count-objects 0.8 [0c 0q 0f 0s], cvsserver 0.8 [0c 0q 0f 0s], show-ref 0.8 [0c 0q 0f 0s], update-server-info 0.8 [0c 0q 0f 0s], update-ref 0.8 [0c 4q 0f 0s], request-pull 0.8 [0c 0q 0f 0s], send-pack 0.8 [0c 0q 0f 0s], symbolic-ref 0.8 [0c 0q 0f 0s], for-each-repo 0.7 [0c 0q 0f 0s], check-ignore 0.7 [0c 0q 0f 0s], verify-commit 0.7 [0c 0q 0f 0s], index-pack 0.7 [0c 0q 0f 0s], diff-files 0.7 [0c 0q 0f 0s], read-tree 0.7 [0c 0q 0f 0s], http-push 0.7 [0c 0q 0f 0s], instaweb 0.7 [0c 8q 0f 0s], replace 0.7 [0c 0q 3f 0s], bugreport 0.7 [0c 0q 0f 0s], check-ref-format 0.6 [0c 0q 0f 0s], pack-objects 0.6 [0c 0q 0f 0s], name-rev 0.6 [0c 0q 0f 0s], column 0.6 [0c 0q 0f 0s], fsck-objects 0.6 [0c 0q 0f 0s], patch-id 0.6 [0c 0q 0f 0s], commit-graph 0.6 [0c 0q 0f 0s], get-tar-commit-id 0.6 [0c 0q 0f 0s], mktree 0.6 [0c 0q 1f 0s], pack-refs 0.5 [0c 0q 0f 0s], write-tree 0.5 [0c 0q 0f 0s], init-db 0.5 [0c 0q 0f 0s], format-rev 0.5 [0c 0q 0f 0s], diff-pairs 0.5 [0c 0q 0f 0s], receive-pack 0.5 [0c 0q 0f 0s], verify-pack 0.5 [0c 4q 0f 0s], checkout-index 0.5 [0c 0q 0f 0s], citool 0.5 [0c 0q 0f 0s], upload-archive 0.5 [0c 0q 0f 0s], merge-tree 0.5 [0c 0q 0f 0s], mktag 0.5 [0c 0q 0f 0s], cvsexportcommit 0.4 [0c 0q 0f 0s] ...

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
