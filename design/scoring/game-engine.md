# Scoring: game-engine (Name a game engine)

60 answers (Bit Flip and Works on my machine left out); 3 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (3%) | 2 | 0 |
| npe | 7 (12%) | 7 | 0 |
| leak | 12 (20%) | 12 | 0 |
| race | 9 (15%) | 7 | 0 |
| heisenbug | 30 (50%) | 32 | 0 |

Same tier as today: 56/60 (93%).

## Off-by-one (2)

Unity 5.5 [18503c 76679q 2f], Unreal Engine 5.2 [29425c 742q 2f]

## Null pointer exception (7)

Godot 2.9 [21858c 2148q 36f], CryEngine 2.5 [5860c 36q 0f], RPG Maker 2.4 [8789c 20q 0f], Frostbite 2.4 [9998c 0q 0f], Cocos2d 2.2 [1432c 10174q 1f], Source 2.0* [11235c 453q 1f], GameMaker 2.0* [7316c 464q 1f]

## Memory leak (12)

Construct 1.9 [901c 238q 0f], Ren'Py 1.9 [4212c 97q 12f], MonoGame 1.8 [2670c 1888q 3f], Bevy 1.4 [0c 192q 0f], LÖVE 1.3 [0c 667q 30f], RAGE 1.3 [22125c 1q 1f], Panda3D 1.1 [645c 191q 6f], SAGA 0.9 [0c 502q 0f], HUGO 0.7 [0c 1327q 0f], GOB 0.7 [0c 113q 3f], Stride 0.7 [379c 159q 3f], AGI 0.6 [709c 209q 2f]

## Race condition (9)

Creation Engine 1.4 [6666c 0q 0f], Defold 1.4 [766c 27q 3f], Anvil 1.3 [3036c 17q 2f], id Tech 1.2 [4447c 0q 0f], Infinity Engine 1.2 [3143c 0q 0f], Macromedia Director 1.1 [0c 31q 0f], Decima 1.0 [5367c 0q 0f], Gamebryo 0.9 [4788c 0q 0f], GrimE 0.5 [0c 0q 34f]

## Heisenbug (30)

REDengine 1.6 [0c 0q 0f], Dunia 1.6 [0c 0q 0f], Amazon Lumberyard 1.5 [2381c 0q 0f], Snowdrop 1.1 [2630c 0q 1f], Clickteam Fusion 1.1 [0c 0q 0f], O3DE 1.0 [1663c 0q 3f], Torque 3D 0.9 [1808c 8q 0f], Stingray 0.8 [1594c 16q 1f], DGDS 0.8 [0c 0q 0f], Serious Engine 0.7 [0c 0q 2f], mTropolis 0.7 [45c 0q 0f], Wintermute Engine 0.6 [523c 0q 0f], SCI 0.6 [0c 0q 1f], NGI 0.5 [0c 0q 0f], SLUDGE 0.5 [0c 0q 2f], Clausewitz 0.5 [0c 0q 0f], AGOS 0.5 [0c 0q 0f], Mohawk 0.4 [0c 0q 1f], HPL1 Engine 0.4 [0c 0q 0f], Freescape 0.4 [270c 0q 0f], Kyra 0.4 [0c 0q 0f], qdEngine 0.3 [0c 0q 0f], MADS 0.3 [0c 0q 2f], Cryo Omni3D 0.3 [0c 0q 0f], Tetraedge 0.3 [0c 0q 0f], Groovie 0.3 [0c 0q 0f], Z-Vision 0.3 [0c 0q 0f], WAGE 0.3 [0c 0q 0f], Parallaction 0.3 [0c 0q 0f], MADE 0.0* [0c 0q 0f]

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
