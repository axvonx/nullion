# Layers

Each layer's one-line blurb and the tiny tags its critters wear as they despawn.
Ring −2 has no tags: time is stopped there, so nothing despawns.

## layers.internet.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

Autonomous systems, BGP routes and undersea fiber above your machine

## layers.internet.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- TTL=0
- dropped

## layers.browser.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

The DOM tree, CSS layout engine and GPU compositor framing your apps

## layers.browser.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- unmounted
- reflow

## layers.application.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

The apps you click, tap and type into

## layers.application.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- closed
- minimized

## layers.bytecode.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

Parsed syntax trees and virtual instructions before execution

## layers.bytecode.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- parsed
- folded

## layers.jit.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

Just-in-time compilers forging hot loops into native machine code

## layers.jit.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- deopt!
- inlined

## layers.runtime.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

The engine that runs your code and tidies up its memory

## layers.runtime.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- GC'd!
- swept!

## layers.libraries.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

Shared code every program leans on

## layers.libraries.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- unloaded
- dlclose

## layers.linker.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

The dynamic linker resolving symbols and wiring shared objects together

## layers.linker.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- resolved
- bound

## layers.userspace.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

The operating system’s own programs and services

## layers.userspace.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- SIGTERM
- reaped

## layers.kernel-entry.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

The syscall gate, seccomp checks and VFS facade into Ring 0

## layers.kernel-entry.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- EACCES
- trapped

## layers.kernel.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

The core of the operating system, in charge of everything above

## layers.kernel.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- paged out!
- preempted

## layers.kernel-arch.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

Interrupt controllers, spinlocks, RCU and raw hardware bridges

## layers.kernel-arch.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- EOI
- TLB flush

## layers.drivers.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

The translators between the operating system and the hardware

## layers.drivers.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- unplugged
- DMA done

## layers.bus-fabric.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

PCIe lanes, DMA rings and memory-mapped I/O crisscrossing the board

## layers.bus-fabric.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- ARB lost
- posted

## layers.firmware.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

Code built into the hardware that starts the machine

## layers.firmware.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- halt
- POST ok

## layers.vmm.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

Virtual device models pretending to be disks, NICs and consoles

## layers.vmm.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- virtio!
- emulated

## layers.ring-1.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

The hypervisor, running whole operating systems as guests

## layers.ring-1.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- vmexit
- trapped

## layers.ept.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

Two-dimensional nested page tables and IOMMU quarantine gates

## layers.ept.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- EPT viol!
- remapped

## layers.ring-2.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

System Management Mode, which can pause everything above it

## layers.smram.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

Locked hardware-shielded memory invisible to the OS and hypervisor

## layers.smram.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- RSM
- locked

## layers.ring-3.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

The Intel Management Engine, a hidden computer inside your computer

## layers.ring-3.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- 0x00
- bit-rot

## layers.me-minix-user.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

A tiny hidden MINIX 3 userspace running even when your PC is off

## layers.me-minix-user.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- AMT idle
- IPC wait

## layers.me-minix-kern.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

The message-passing microkernel deep inside the management core

## layers.me-minix-kern.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- SENDREC
- blocked

## layers.uarch.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

Out-of-order μops, branch predictors and L1/L2/L3 cache banks

## layers.uarch.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- mispredict!
- flushed

## layers.rtl.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

NAND gates, flip-flops and the clock tree pulsing in lockstep

## layers.rtl.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- metastable
- latched

## layers.cmos.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

FinFET transistors, doped wells and stacked copper metal interconnects

## layers.cmos.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- leaked
- drifted

## layers.litho.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

13.5nm EUV interference fringes etched into crystalline silicon

## layers.litho.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- diffracted
- etched

## layers.bandgap.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

Valence and conduction bands where electrons tunnel through barriers

## layers.bandgap.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- tunneled!
- recombined

## layers.landauer.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

The thermodynamic floor of computation: kT ln 2 per erased bit

## layers.landauer.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- kT ln 2
- erased

## layers.slab-spa.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

1994 · Misty cedar bathhouse of kmalloc caches, freelist pools & OOM steam vents

## layers.slab-spa.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- kmalloc
- steamed

## layers.kthread-kabin.blurb
where: the line under the layer's name in the right-hand stack tooltip, and shown as the player enters the layer
when: the player reaches the layer, or hovers or clicks its badge
max: 100
status: draft

1978 · Cozy timber cabin where off-duty kworkers chop workqueue logs by a softirq hearth

## layers.kthread-kabin.exit
where: a tiny tag over a critter of this layer as it despawns
when: a critter of this layer leaves the screen; one variant is picked at random
max: 14
status: draft

- kworker
- wake!
