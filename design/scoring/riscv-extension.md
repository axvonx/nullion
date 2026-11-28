# Scoring: riscv-extension (Name a RISC-V extension)

84 answers (Bit Flip and Works on my machine left out); 2 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (10000, 50, None), some (3000, 20, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (2%) | 2 | 0 |
| npe | 11 (13%) | 11 | 0 |
| leak | 7 (8%) | 7 | 0 |
| race | 0 (0%) | 0 | 0 |
| heisenbug | 64 (76%) | 64 | 0 |

Same tier as today: 84/84 (100%).

## Off-by-one (2)

C 3.4 [16803c 405216q 6f], C extension 3.3 [16803c 11q 0f]

## Null pointer exception (11)

M extension 3.3 [16803c 0q 0f], A 3.3 [16803c 3876q 1f], M 3.3 [16803c 1270q 0f], F extension 3.3 [16803c 0q 0f], F 3.3 [16803c 0q 1f], V 3.0 [16803c 35434q 7f], G 3.0* [16803c 0q 0f], D 2.9 [16803c 2644q 1f], D extension 2.9 [16803c 0q 0f], B extension 2.5 [16803c 0q 0f], B 2.2 [16803c 7937q 1f]

## Memory leak (7)

H 1.9 [16803c 583q 1f], P extension 1.8 [16803c 0q 0f], H extension 1.6 [16803c 0q 0f], A extension 1.0* [16803c 0q 0f], Q extension 0.8 [16803c 0q 0f], Zk 0.7 [0c 1177q 15f], Q 0.5 [16803c 1368q 0f]

## Race condition (0)



## Heisenbug (64)

Zbb 1.8 [0c 0q 0f], Zicsr 1.4 [0c 0q 0f], Zca 1.4 [0c 0q 0f], Zcb 1.1 [0c 0q 0f], Zacas 0.9 [0c 0q 0f], Zfh 0.9 [0c 0q 0f], Zba 0.8 [0c 0q 0f], Zfinx 0.8 [0c 0q 0f], Zawrs 0.8 [0c 0q 0f], Zbs 0.8 [0c 0q 0f], Zcmp 0.7 [0c 0q 0f], Svinval 0.7 [0c 0q 0f], Zfa 0.7 [0c 0q 0f], Sstc 0.7 [0c 0q 0f], Ssaia 0.7 [0c 0q 0f], Zbkb 0.7 [0c 0q 0f], Zabha 0.7 [0c 0q 0f], Ztso 0.7 [0c 0q 0f], Zhinx 0.7 [0c 0q 0f], Zicond 0.6 [0c 0q 0f], Zmmul 0.6 [0c 0q 0f], Zcf 0.6 [0c 0q 0f], Zbkc 0.6 [0c 0q 0f], Zbc 0.6 [0c 0q 0f], Zvbb 0.6 [0c 0q 0f], Zkn 0.6 [0c 0q 0f], Zicfilp 0.5 [0c 0q 0f], Zicfiss 0.5 [0c 0q 0f], Zicboz 0.5 [0c 0q 0f], Zicbop 0.5 [0c 0q 0f], Zkne 0.5 [0c 0q 0f], Smepmp 0.5 [0c 0q 0f], Zifencei 0.5 [0c 0q 0f], Zihintpause 0.5 [0c 0q 0f], Zicbom 0.5 [0c 0q 0f], Zihpm 0.5 [0c 0q 0f], Zicntr 0.4 [0c 0q 0f], Zkr 0.4 [0c 0q 0f], Zvfh 0.4 [0c 0q 0f], Zksh 0.4 [0c 0q 0f], Zvl128b 0.4 [0c 0q 0f], Sdtrig 0.4 [0c 0q 0f], Zfhmin 0.4 [0c 0q 0f], Svnapot 0.4 [0c 0q 0f], Zkt 0.4 [0c 0q 4f], Zcd 0.4 [0c 0q 0f], Zvknha 0.4 [0c 0q 0f], Zve32x 0.3 [0c 0q 0f], Zknd 0.3 [0c 0q 0f], Zksed 0.3 [0c 0q 0f], Zks 0.3 [0c 0q 0f], Zknh 0.3 [0c 0q 0f], Zdinx 0.3 [0c 0q 0f], Smstateen 0.3 [0c 0q 0f], Zvbc 0.3 [0c 0q 0f], Zvkg 0.3 [0c 0q 0f], Zvkned 0.3 [0c 0q 0f], Svpbmt 0.3 [0c 0q 0f], Zvksed 0.3 [0c 0q 0f], Zvksh 0.3 [0c 0q 0f] ...

`*` = Haiku's level (Jev's confidence was low). [clicks/month, Stack Exchange questions, distro families]
