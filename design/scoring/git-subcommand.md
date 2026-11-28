# Scoring: git-subcommand (Name a git subcommand)

159 answers (Bit Flip and Works on my machine left out); 8 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 15 (9%) | 15 | 0 |
| npe | 18 (11%) | 18 | 0 |
| leak | 23 (14%) | 17 | 0 |
| race | 12 (8%) | 8 | 0 |
| heisenbug | 91 (57%) | 101 | 0 |

Same tier as today: 143/159 (90%).

## Off-by-one (15)

commit 5.6 [0c 2156q 5f], clone 5.5 [0c 1390q 2f], push 5.5 [0c 1719q 1f], pull 5.5 [0c 1243q 0f], status 5.4 [0c 201q 3f], checkout 5.4 [0c 1097q 0f], branch 5.4 [0c 3261q 2f], log 5.3 [0c 953q 1f], merge 5.2 [0c 3382q 0f], add 5.1 [0c 340q 6f], diff 5.1 [0c 5605q 0f], blame 5.0* [0c 119q 4f], help 5.0* [0c 0q 0f], init 4.8 [0c 2509q 1f], rebase 4.6 [0c 1698q 2f]

## Null pointer exception (18)

reset 4.2 [0c 520q 0f], stash 4.0 [0c 685q 0f], rm 4.0* [0c 1732q 0f], tag 4.0 [0c 556q 0f], config 4.0* [0c 7795q 2f], remote 4.0* [0c 943q 1f], show 4.0* [0c 78q 1f], switch 4.0* [0c 11q 3f], fetch 4.0 [0c 410q 2f], revert 3.9 [0c 505q 0f], cherry-pick 3.3 [0c 457q 0f], clean 3.0 [0c 57q 0f], grep 2.9 [0c 23132q 58f], submodule 2.6 [0c 3167q 0f], restore 2.4 [0c 0q 1f], bisect 2.1 [0c 104q 1f], gc 2.0 [0c 12167q 0f], stage 2.0* [0c 100q 4f]

## Memory leak (23)

difftool 1.9 [0c 131q 0f], reflog 1.9 [0c 92q 0f], mv 1.9 [0c 1506q 0f], worktree 1.8 [0c 144q 0f], mergetool 1.7 [0c 156q 0f], rev-list 1.7 [0c 56q 0f], history 1.5 [0c 92q 1f], sparse-checkout 1.4 [0c 132q 0f], filter-branch 1.4 [0c 467q 0f], gui 1.4 [0c 58758q 0f], archive 1.3 [0c 52q 1f], fsck 1.2 [0c 772q 0f], version 1.1 [0c 214q 4f], repo 1.0 [0c 617q 14f], refs 0.9 [0c 231q 1f], notes 0.9 [0c 54q 0f], svn 0.7 [0c 28989q 1f], shell 0.7 [0c 70q 0f], last-modified 0.6 [0c 496q 0f], p4 0.5 [0c 3314q 8f], url-parse 0.5 [0c 198q 1f], http-backend 0.3 [0c 224q 0f], var 0.3 [0c 2537q 0f]

## Race condition (12)

am 2.0 [0c 40q 1f], describe 1.9 [0c 45q 0f], apply 1.9 [0c 47q 0f], ls-files 1.8 [0c 45q 0f], format-patch 1.6 [0c 49q 0f], send-email 1.5 [0c 26q 12f], cherry 1.2 [0c 23q 0f], bundle 1.1 [0c 45q 0f], daemon 1.0 [0c 37q 8f], diff-tree 0.9 [0c 22q 0f], fast-import 0.7 [0c 35q 0f], fast-export 0.7 [0c 21q 1f]

## Heisenbug (91)

ls-remote 2.0 [0c 19q 0f], rev-parse 1.8 [0c 15q 0f], cat-file 1.7 [0c 0q 0f], shortlog 1.5 [0c 0q 0f], ls-tree 1.4 [0c 12q 1f], prune 1.4 [0c 0q 0f], hook 1.4 [0c 0q 0f], annotate 1.3 [0c 0q 2f], merge-base 1.3 [0c 9q 0f], whatchanged 1.2 [0c 0q 0f], repack 1.2 [0c 0q 0f], for-each-ref 1.1 [0c 0q 0f], update-index 1.1 [0c 0q 0f], range-diff 1.0 [0c 6q 0f], credential-cache 1.0 [0c 0q 0f], credential 1.0 [0c 0q 0f], show-branch 1.0 [0c 0q 0f], hash-object 1.0 [0c 0q 0f], verify-tag 1.0 [0c 0q 0f], credential-store 0.9 [0c 0q 0f], maintenance 0.9 [0c 6q 1f], diff-index 0.9 [0c 0q 0f], check-attr 0.8 [0c 0q 0f], count-objects 0.8 [0c 0q 0f], cvsserver 0.8 [0c 0q 0f], show-ref 0.8 [0c 0q 0f], update-server-info 0.8 [0c 0q 0f], update-ref 0.8 [0c 4q 0f], request-pull 0.8 [0c 0q 0f], send-pack 0.8 [0c 0q 0f], symbolic-ref 0.8 [0c 0q 0f], merge-file 0.8 [0c 19q 0f], for-each-repo 0.7 [0c 0q 0f], check-ignore 0.7 [0c 0q 0f], verify-commit 0.7 [0c 0q 0f], index-pack 0.7 [0c 0q 0f], diff-files 0.7 [0c 0q 0f], read-tree 0.7 [0c 0q 0f], http-push 0.7 [0c 0q 0f], instaweb 0.7 [0c 8q 0f], replace 0.7 [0c 0q 3f], bugreport 0.7 [0c 0q 0f], check-ref-format 0.6 [0c 0q 0f], pack-objects 0.6 [0c 0q 0f], name-rev 0.6 [0c 0q 0f], column 0.6 [0c 0q 0f], fsck-objects 0.6 [0c 0q 0f], patch-id 0.6 [0c 0q 0f], commit-graph 0.6 [0c 0q 0f], get-tar-commit-id 0.6 [0c 0q 0f], mktree 0.6 [0c 0q 1f], pack-refs 0.5 [0c 0q 0f], write-tree 0.5 [0c 0q 0f], cvsimport 0.5 [0c 16q 0f], init-db 0.5 [0c 0q 0f], format-rev 0.5 [0c 0q 0f], diff-pairs 0.5 [0c 0q 0f], receive-pack 0.5 [0c 0q 0f], verify-pack 0.5 [0c 4q 0f], checkout-index 0.5 [0c 0q 0f] ...

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
