# Scoring: riscv-extension (Name a RISC-V extension)

84 answers (Bit Flip and Works on my machine left out); 2 routed to Haiku (Jev confidence < 0.4). Head: familiarity >= {'off-by-one': 4.4, 'npe': 2.0}. Tail by evidence: strong (5000, 30, None), some (1500, 10, 20) (clicks/month, Stack Exchange questions, distro families).

| tier | new | bank today | of the new, confirmed lines that disagree |
|---|---|---|---|
| off-by-one | 2 (2%) | 2 | 0 |
| npe | 11 (13%) | 11 | 0 |
| leak | 1 (1%) | 1 | 0 |
| race | 0 (0%) | 0 | 0 |
| heisenbug | 70 (83%) | 70 | 0 |

Same tier as today: 84/84 (100%).

## Off-by-one (2)

C 3.4 [0c 0q 0f 0s], C extension 3.3 [0c 11q 0f 0s]

## Null pointer exception (11)

M extension 3.3 [0c 0q 0f 0s], A 3.3 [0c 0q 1f 0s], M 3.3 [0c 0q 0f 0s], F extension 3.3 [0c 0q 0f 0s], F 3.3 [0c 0q 0f 0s], V 3.0 [0c 0q 7f 0s], G 3.0* [0c 0q 0f 0s], D 2.9 [0c 0q 0f 0s], D extension 2.9 [0c 0q 0f 0s], B extension 2.5 [0c 0q 0f 0s], B 2.2 [0c 7937q 0f 0s]

## Memory leak (1)

H 1.9 [0c 583q 0f 0s]

## Race condition (0)



## Heisenbug (70)

Zbb 1.8 [0c 0q 0f 0s], P extension 1.8 [0c 0q 0f 0s], H extension 1.6 [0c 0q 0f 0s], Zicsr 1.4 [0c 0q 0f 0s], Zca 1.4 [0c 0q 0f 0s], Zcb 1.1 [0c 0q 0f 0s], A extension 1.0* [0c 0q 0f 0s], Zacas 0.9 [0c 0q 0f 0s], Zfh 0.9 [0c 0q 0f 0s], Zba 0.8 [0c 0q 0f 0s], Zfinx 0.8 [0c 0q 0f 0s], Q extension 0.8 [0c 0q 0f 0s], Zawrs 0.8 [0c 0q 0f 0s], Zbs 0.8 [0c 0q 0f 0s], Zcmp 0.7 [0c 0q 0f 0s], Svinval 0.7 [0c 0q 0f 0s], Zfa 0.7 [0c 0q 0f 0s], Sstc 0.7 [0c 0q 0f 0s], Zk 0.7 [0c 0q 0f 0s], Ssaia 0.7 [0c 0q 0f 0s], Zbkb 0.7 [0c 0q 0f 0s], Zabha 0.7 [0c 0q 0f 0s], Ztso 0.7 [0c 0q 0f 0s], Zhinx 0.7 [0c 0q 0f 0s], Zicond 0.6 [0c 0q 0f 0s], Zmmul 0.6 [0c 0q 0f 0s], Zcf 0.6 [0c 0q 0f 0s], Zbkc 0.6 [0c 0q 0f 0s], Zbc 0.6 [0c 0q 0f 0s], Zvbb 0.6 [0c 0q 0f 0s], Zkn 0.6 [0c 0q 0f 0s], Zicfilp 0.5 [0c 0q 0f 0s], Zicfiss 0.5 [0c 0q 0f 0s], Zicboz 0.5 [0c 0q 0f 0s], Zicbop 0.5 [0c 0q 0f 0s], Q 0.5 [0c 0q 0f 0s], Zkne 0.5 [0c 0q 0f 0s], Smepmp 0.5 [0c 0q 0f 0s], Zifencei 0.5 [0c 0q 0f 0s], Zihintpause 0.5 [0c 0q 0f 0s], Zicbom 0.5 [0c 0q 0f 0s], Zihpm 0.5 [0c 0q 0f 0s], Zicntr 0.4 [0c 0q 0f 0s], Zkr 0.4 [0c 0q 0f 0s], Zvfh 0.4 [0c 0q 0f 0s], Zksh 0.4 [0c 0q 0f 0s], Zvl128b 0.4 [0c 0q 0f 0s], Sdtrig 0.4 [0c 0q 0f 0s], Zfhmin 0.4 [0c 0q 0f 0s], Svnapot 0.4 [0c 0q 0f 0s], Zkt 0.4 [0c 0q 0f 0s], Zcd 0.4 [0c 0q 0f 0s], Zvknha 0.4 [0c 0q 0f 0s], Zve32x 0.3 [0c 0q 0f 0s], Zknd 0.3 [0c 0q 0f 0s], Zksed 0.3 [0c 0q 0f 0s], Zks 0.3 [0c 0q 0f 0s], Zknh 0.3 [0c 0q 0f 0s], Zdinx 0.3 [0c 0q 0f 0s], Smstateen 0.3 [0c 0q 0f 0s] ...

`*` = Haiku's level (Jev's confidence was low); `^` = lifted into Null pointer exception by evidence {'clicks': 30000, 'se': 1000, 'stars': 20000}. [clicks/month, Stack Exchange questions, distro families, GitHub stars]
