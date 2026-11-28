# Scoring: game-engine (Name a game engine)

60 answers (Bit Flip and Works on my machine left out); 3 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (3%) | 2 | 0 |
| npe | 8 (13%) | 8 | 0 |
| leak | 11 (18%) | 11 | 0 |
| race | 9 (15%) | 9 | 0 |
| heisenbug | 30 (50%) | 30 | 0 |

Same tier as today: 60/60 (100%).

## Off-by-one (2)

Unity 5.5 [18503c 76528q 2f 0s], Unreal Engine 5.2 [29425c 0q 2f 0s]

## Null pointer exception (8)

Godot 2.9 [21858c 2148q 36f 121006s], CryEngine 2.5 [5860c 36q 0f 0s], RPG Maker 2.4 [8789c 20q 0f 0s], Frostbite 2.4 [9998c 0q 0f 0s], Cocos2d 2.2 [1432c 10174q 1f 19259s], Source 2.0* [11235c 10q 1f 0s], GameMaker 2.0* [7316c 464q 1f 0s], MonoGame 1.8 [2670c 1888q 3f 14682s]^

## Memory leak (11)

Construct 1.9 [901c 114q 0f 0s], Ren'Py 1.9 [4212c 97q 12f 7085s], Creation Engine 1.4 [6666c 0q 0f 0s], Defold 1.4 [766c 27q 3f 6498s], LÖVE 1.3 [0c 667q 30f 9016s], RAGE 1.3 [22125c 1q 1f 0s], Macromedia Director 1.1 [0c 31q 0f 0s], Panda3D 1.1 [645c 191q 6f 5281s], Decima 1.0 [5367c 0q 0f 0s], O3DE 1.0 [1663c 0q 3f 9943s], HUGO 0.7 [0c 1327q 0f 0s]

## Race condition (9)

Amazon Lumberyard 1.5 [2381c 0q 0f 0s], Anvil 1.3 [3036c 0q 2f 0s], id Tech 1.2 [4447c 0q 0f 0s], Infinity Engine 1.2 [3143c 0q 0f 0s], Snowdrop 1.1 [2630c 0q 1f 0s], Gamebryo 0.9 [4788c 0q 0f 0s], Torque 3D 0.9 [1808c 8q 0f 0s], Stingray 0.8 [1594c 2q 1f 0s], GrimE 0.5 [0c 0q 34f 0s]

## Heisenbug (30)

REDengine 1.6 [0c 0q 0f 0s], Dunia 1.6 [0c 0q 0f 0s], Bevy 1.4 [0c 0q 0f 0s], Clickteam Fusion 1.1 [0c 0q 0f 0s], SAGA 0.9 [0c 0q 0f 0s], DGDS 0.8 [0c 0q 0f 0s], Serious Engine 0.7 [0c 0q 2f 94s], mTropolis 0.7 [45c 0q 0f 0s], GOB 0.7 [0c 0q 0f 0s], Stride 0.7 [379c 0q 3f 0s], Wintermute Engine 0.6 [523c 0q 0f 0s], SCI 0.6 [0c 0q 0f 0s], AGI 0.6 [709c 0q 0f 0s], NGI 0.5 [0c 0q 0f 0s], SLUDGE 0.5 [0c 0q 2f 0s], Clausewitz 0.5 [0c 0q 0f 0s], AGOS 0.5 [0c 0q 0f 0s], Mohawk 0.4 [0c 0q 1f 0s], HPL1 Engine 0.4 [0c 0q 0f 0s], Freescape 0.4 [270c 0q 0f 0s], Kyra 0.4 [0c 0q 0f 0s], qdEngine 0.3 [0c 0q 0f 0s], MADS 0.3 [0c 0q 2f 0s], Cryo Omni3D 0.3 [0c 0q 0f 0s], Tetraedge 0.3 [0c 0q 0f 0s], Groovie 0.3 [0c 0q 0f 0s], Z-Vision 0.3 [0c 0q 0f 0s], WAGE 0.3 [0c 0q 0f 0s], Parallaction 0.3 [0c 0q 0f 0s], MADE 0.0* [0c 0q 0f 0s]

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
