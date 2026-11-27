import { enforce } from '../core/enforce';
import { DAILY_FALLBACK, ENDLESS_LAYERS, type LayerId } from '../core/layers';
import { DEBUG } from '../keys';
import { browserStorage, type SaveStorage } from './daily-save';
import { fromV1, InvalidManualSave, MANUAL_V1_KEY, MANUAL_V2_KEY, parseV2, prune, type ManualSaveV2, type Stamp } from './manual-save';

/**
 * Field Manual ("MAN(7) · Field Manual") — Volume I character & specimen registry + persistent discovery store.
 *
 * Each entry represents a named character, critter, prop family, or question-reactive anomaly in Nullion's world.
 * An entry has ONE rarity tier across all layers (each appearance is gated separately and its shown % is measured: src/game/rarity.ts), and one or more `sightings` ordered
 * from highest (shallowest) to lowest (deepest) layer. Discovering an entry in any layer unlocks it; spotting it
 * again in a different layer logs a new sighting and unlocks that layer's appearance in the profile dropdown.
 */

export type ManualRarity = 'common' | 'uncommon' | 'rare' | 'mythic';
export type ManualKind = 'critter' | 'prop' | 'anomaly';

export interface RarityMeta {
  id: ManualRarity;
  label: string;
  color: string;
}

export const MANUAL_RARITIES: Record<ManualRarity, RarityMeta> = {
  common: { id: 'common', label: 'Common', color: '#8ea8c3' },
  uncommon: { id: 'uncommon', label: 'Uncommon', color: '#59c08a' },
  rare: { id: 'rare', label: 'Rare', color: '#b478f0' },
  mythic: { id: 'mythic', label: 'Mythic', color: '#ffe25a' },
};

export interface ManualSighting {
  layer: LayerId;
  /** Entity ID in V4_LIBRARIES[layer] (for props & anchors). */
  entityId?: string;
  /** Critter species layer (for biosphere critters). */
  critterLayer?: LayerId;
  /** Topic prop ID in topics.ts (for question-reactive anomalies). */
  topicId?: string;
  /** Optional note describing how this character looks or behaves at this layer. */
  detailNote?: string;
}

export interface ManualEntry {
  id: string;
  name: string;
  /** Playful Unix man-page tag, e.g. SMALL-BEN(2). */
  manTag: string;
  kind: ManualKind;
  rarity: ManualRarity;
  /** Playful 1-sentence character bio. */
  blurb: string;
  /** Plain-English "in real computers…" whisper for curious players. */
  note: string;
  /** Ordered highest (shallowest) layer first. */
  sightings: readonly ManualSighting[];
}

export const MANUAL_ENTRIES: readonly ManualEntry[] = [
  // ---------------------------------------------------------------------------
  // Biosphere Critters (all 10 core species)
  {
    id: 'crit-songbird',
    name: 'Sky Sprite',
    manTag: 'SONGBIRD(1)',
    kind: 'critter',
    rarity: 'common', // core species: in the world every day (alternate species become the rare critters)
    blurb: 'Glides lazily over sunlit app windows and perches on anything with a flat titlebar.',
    note: 'Represents lightweight UI animations and foreground events fluttering above the stack.',
    sightings: [{ layer: 'application', critterLayer: 'application', detailNote: 'Sunlit blue & gold feathers gliding across the desktop sky.' }],
  },
  {
    id: 'crit-helper',
    name: 'Heap Hopper',
    manTag: 'GC-BLOB(2)',
    kind: 'critter',
    rarity: 'common', // core species: in the world every day (alternate species become the rare critters)
    blurb: 'Never flies — strictly hops from one allocated object top to the next.',
    note: 'A friendly metaphor for tracing garbage-collector workers hopping across live heap references.',
    sightings: [{ layer: 'runtime', critterLayer: 'runtime', detailNote: 'Electric-blue bouncing blob inspecting heap blocks.' }],
  },
  {
    id: 'crit-bookworm',
    name: 'Bookworm Blob',
    manTag: 'LIB-WORM(3)',
    kind: 'critter',
    rarity: 'common', // core species: in the world every day (alternate species become the rare critters)
    blurb: 'A quiet scholar that hops softly between bookshelves and pauses to read footnotes.',
    note: 'Shared libraries are like reference books every program borrows instead of rewriting from scratch.',
    sightings: [{ layer: 'libraries', critterLayer: 'libraries', detailNote: 'Warm amber-and-gold reader perched on cathedral stacks.' }],
  },
  {
    id: 'crit-daemon',
    name: 'Horned Daemon',
    manTag: 'DAEMON(8)',
    kind: 'critter',
    rarity: 'common', // core species: in the world every day (alternate species become the rare critters)
    blurb: 'Patrols the midnight skyline with brisk, tireless footsteps and tiny glowing eyes.',
    note: 'In Unix, a daemon is a background service (like cron or sshd) that quietly runs without a terminal.',
    sightings: [{ layer: 'userspace', critterLayer: 'userspace', detailNote: 'CGA-red horned patrol walker carrying a tiny lantern.' }],
  },
  {
    id: 'crit-threadbot',
    name: 'Thread-Bot',
    manTag: 'KTHREAD(0)',
    kind: 'critter',
    rarity: 'common', // core species: in the world every day (alternate species become the rare critters)
    blurb: 'Zips in short bursts, yields politely on a gear, then sprints off on its next time slice.',
    note: 'OS kernels juggle hundreds of threads by giving each one a tiny burst (quantum) of CPU time.',
    sightings: [{ layer: 'kernel', critterLayer: 'kernel', detailNote: 'Steel-shelled robot with a glowing colored visor.' }],
  },
  {
    id: 'crit-beetle',
    name: 'Bus-Beetle',
    manTag: 'PCI-BUG(4)',
    kind: 'critter',
    rarity: 'common', // core species: in the world every day (alternate species become the rare critters)
    blurb: 'Scuttles at ludicrous speed along cyan and magenta motherboard traces.',
    note: 'Hardware buses shuttle millions of tiny electrical packets per second between devices and RAM.',
    sightings: [{ layer: 'drivers', critterLayer: 'drivers', detailNote: 'Neon cyan/magenta trace-scuttling beetle.' }],
  },
  {
    id: 'crit-sentinel',
    name: 'Sentinel Drone',
    manTag: 'POST-BOT(4)',
    kind: 'critter',
    rarity: 'common', // core species: in the world every day (alternate species become the rare critters)
    blurb: 'Drifts in rigid, metronomic sweeps — never jumps, never lands, never blinks out of rhythm.',
    note: 'Firmware runs hardware self-tests (POST) with strict timing before an operating system even wakes up.',
    sightings: [{ layer: 'firmware', critterLayer: 'firmware', detailNote: 'Green-phosphor hovering scanner drone.' }],
  },
  {
    id: 'crit-wisp',
    name: 'Mirror-Wisp',
    manTag: 'VCPU-WISP(−1)',
    kind: 'critter',
    rarity: 'common', // core species: in the world every day (alternate species become the rare critters)
    blurb: 'Always travels in exact horizontal symmetry — move left, and its twin mirrors right.',
    note: 'Hypervisors run virtual machines side-by-side so each guest thinks it owns the whole computer.',
    sightings: [{ layer: 'ring-1', critterLayer: 'ring-1', detailNote: 'Twin phosphor wisps gliding across the mirror seam.' }],
  },
  {
    id: 'crit-ghost',
    name: 'Frozen Ghost',
    manTag: 'SMI-GHOST(−2)',
    kind: 'critter',
    rarity: 'common', // core species: in the world every day (alternate species become the rare critters)
    blurb: 'Caught mid-flight when System Management Mode stopped the clock. It never moves a pixel.',
    note: 'When an SMI fires, the entire OS and hypervisor freeze instantaneously until SMM finishes.',
    sightings: [{ layer: 'ring-2', critterLayer: 'ring-2', detailNote: 'Monochrome grayscale silhouette suspended in stillness.' }],
  },
  {
    id: 'crit-mote',
    name: 'Bit-Mote',
    manTag: 'BIT-MOTE(−3)',
    kind: 'critter',
    rarity: 'common', // core species: in the world every day (alternate species become the rare critters)
    blurb: 'Steps strictly along invisible 4-pixel silicon rails, flickering between pure 0 and pure 1.',
    note: 'At the deepest management core, everything reduces to raw 1-bit logic pulses on bare silicon.',
    sightings: [{ layer: 'ring-3', critterLayer: 'ring-3', detailNote: 'Stark 1-bit white glyph stepping on the die grid.' }],
  },

  // ---------------------------------------------------------------------------
  // Multi-Layer Character Families (showcase the Layer Appearance dropdown!)
  {
    id: 'small-ben',
    name: 'Small Ben',
    manTag: 'SMALL-BEN(2)',
    kind: 'prop',
    rarity: 'common', // has an anchor appearance: landmarks are never gated (rarity.ts)
    blurb: 'A stubbornly punctual timepiece that follows you down the stack — until Ring −2 stops its hands cold.',
    note: 'Computers maintain clocks at every layer: wall-clock UI, cron schedulers, and hardware timers.',
    sightings: [
      { layer: 'application', entityId: 'app-clock', detailNote: 'Bright desktop clock face with friendly sweeping hands.' },
      { layer: 'userspace', entityId: 'us-crontower', detailNote: 'Midnight-blue cron clocktower presiding over scheduled jobs.' },
      { layer: 'ring-2', entityId: 'r2-clocktower', detailNote: 'Grayscale tower stopped at the exact instant of the SMI, pigeon frozen mid-takeoff.' },
    ],
  },
  {
    id: 'lock-ness',
    name: 'Lock Ness',
    manTag: 'LOCK-NESS(−2)',
    kind: 'prop',
    rarity: 'uncommon',
    blurb: 'Keeps resurfacing deeper and deeper in the machine, shedding color until only pure 1-bit steel remains.',
    note: 'From file locks to hardware-sealed SMRAM, computing is locks all the way down.',
    sightings: [
      { layer: 'userspace', entityId: 'us-padlock', detailNote: 'Sturdy userspace permission padlock.' },
      { layer: 'firmware', entityId: 'fw-plate', detailNote: 'Green-phosphor BIOS hardware padlock guarding flash memory.' },
      { layer: 'ring-2', entityId: 'r2-safe', detailNote: 'Heavy monochrome dial safe frozen in System Management Mode.' },
      { layer: 'ring-3', entityId: 'r3-ringosc', detailNote: 'Stark 1-bit hardware fuse-lock with a pulsing keyhole bit.' },
    ],
  },
  {
    id: 'chrono-glass',
    name: 'The Hourglass',
    manTag: 'TIMESLICE(3)',
    kind: 'prop',
    rarity: 'rare',
    blurb: 'Measures quiet study in Libraries, guest CPU quotas in Ring −1, and frozen sand in Ring −2.',
    note: 'Schedulers and hypervisors slice time into tiny grains so no single program hogs the CPU.',
    sightings: [
      { layer: 'libraries', entityId: 'lib-hourglass', detailNote: 'Brass-framed reading-room timer.' },
      { layer: 'ring-1', entityId: 'r1-timeslice', detailNote: 'Phosphor green VM CPU-quantum hourglass.' },
      { layer: 'ring-2', entityId: 'r2-hourglass', detailNote: 'Sand grains frozen mid-fall in monochrome stillness.' },
    ],
  },
  {
    id: 'silicon-heart',
    name: 'Silicon Heart',
    manTag: 'ME-CORE(−3)',
    kind: 'prop',
    rarity: 'common', // has an anchor appearance: landmarks are never gated (rarity.ts)
    blurb: 'Starts as a humble bus chip, grows a quartz UV window in Firmware, and reveals the hidden Management Engine at the bottom.',
    note: 'Modern PCs contain a tiny independent processor inside the chipset that runs even when the OS is off.',
    sightings: [
      { layer: 'drivers', entityId: 'dr-chip', detailNote: 'Cyan-legged IC chip soldered onto the bus.' },
      { layer: 'firmware', entityId: 'fw-ucode', detailNote: 'Ceramic DIP EPROM with a glowing circular UV-erase window.' },
      { layer: 'ring-3', entityId: 'r3-me', detailNote: 'Full 1-bit QFP Management Engine die with a pulsing heartbeat.' },
    ],
  },
  {
    id: 'master-key',
    name: 'The Master Key',
    manTag: 'KEYRING(−3)',
    kind: 'prop',
    rarity: 'rare',
    blurb: 'A skeleton key that unlocks boot ROMs in Firmware and reappears as bare 1-bit teeth in Ring −3.',
    note: 'Cryptographic root keys burned into hardware fuses verify that firmware hasn’t been tampered with.',
    sightings: [
      { layer: 'firmware', entityId: 'fw-key', detailNote: 'Green-phosphor skeleton key.' },
      { layer: 'ring-3', entityId: 'r3-pad', detailNote: 'Razor-sharp 1-bit hardware key silhouette.' },
    ],
  },
  {
    id: 'cooling-spinner',
    name: 'Whirlwind',
    manTag: 'THERMAL(4)',
    kind: 'prop',
    rarity: 'common',
    blurb: 'Twin high-RPM fans on the graphics bus, and a solitary green-phosphor guardian inside the BIOS vault.',
    note: 'Every bit flipped generates a tiny puff of heat — cooling fans keep silicon below thermal throttle.',
    sightings: [
      { layer: 'drivers', entityId: 'dr-gpu', detailNote: 'Dual-fan graphics shroud spinning at full speed.' },
      { layer: 'firmware', entityId: 'fw-fan', detailNote: 'Four-blade green-phosphor case fan.' },
    ],
  },
  {
    id: 'watchdog-timer',
    name: 'The Watchdog',
    manTag: 'WDT(0)',
    kind: 'prop',
    rarity: 'rare',
    blurb: 'Patiently counts down in the dark — if software forgets to pet it, it barks and resets the machine.',
    note: 'Hardware watchdog timers recover frozen systems automatically by triggering a hard reset on timeout.',
    sightings: [
      { layer: 'kernel', entityId: 'kr-wdtimer', detailNote: 'Industrial kernel countdown gauge.' },
      { layer: 'firmware', entityId: 'fw-watchdog', detailNote: 'Low-level firmware reset watchdog.' },
    ],
  },
  {
    id: 'interrupt-flag',
    name: 'Interrupt Flag',
    manTag: 'IRQ-SPARK(4)',
    kind: 'prop',
    rarity: 'rare',
    blurb: 'Crackles with raw white lightning whenever a peripheral demands the CPU drop everything right now.',
    note: 'Hardware interrupts (IRQs) let keyboards, disks, and network cards tap the CPU on the shoulder.',
    sightings: [
      { layer: 'drivers', entityId: 'dr-irq', detailNote: 'Sparking interrupt pin firing jagged white bolts.' },
      { layer: 'kernel-arch', entityId: 'ka-apic', detailNote: 'APIC interrupt router dispatching IRQ vectors.' },
    ],
  },

  // ---------------------------------------------------------------------------
  // Iconic Single-Layer Characters & Props
  {
    id: 'spinner-wheel',
    name: 'Eternal Spinner',
    manTag: 'BUSY-WAIT(1)',
    kind: 'prop',
    rarity: 'common',
    blurb: 'Spins heroically while promising the app is definitely not frozen. Definitely.',
    note: 'A loading spinner signals an asynchronous task waiting on disk, network, or a slow main thread.',
    sightings: [{ layer: 'application', entityId: 'app-spinner' }],
  },
  {
    id: 'trash-bin',
    name: 'Recycle Goblin',
    manTag: 'TRASH(1)',
    kind: 'prop',
    rarity: 'common',
    blurb: 'Politely holds onto deleted files until you finally click Empty — and immediately regret it.',
    note: 'Deleting a file usually just unlinks its directory entry until the space is overwritten.',
    sightings: [{ layer: 'application', entityId: 'app-trash' }],
  },
  {
    id: 'gc-sweeper',
    name: 'The Collector',
    manTag: 'MARK-SWEEP(2)',
    kind: 'prop',
    rarity: 'uncommon',
    blurb: 'Patrols the runtime cavern sweeping up unreachable objects with ruthless tidiness.',
    note: 'Mark-and-sweep garbage collectors find live objects and reclaim everything nobody points to.',
    sightings: [{ layer: 'runtime', entityId: 'rt-sweeper' }],
  },
  {
    id: 'stack-frame',
    name: 'Frame Runner',
    manTag: 'STACKFRAME(2)',
    kind: 'prop',
    rarity: 'common',
    blurb: 'Piles neatly onto its neighbors every time a function calls another function.',
    note: 'Each stack frame stores a function’s local variables and where to return when it finishes.',
    sightings: [{ layer: 'runtime', entityId: 'rt-stackframe' }],
  },
  {
    id: 'quill-ink',
    name: 'Archivist’s Inkwell',
    manTag: 'STDLIB(3)',
    kind: 'prop',
    rarity: 'uncommon',
    blurb: 'Fresh ink for the quiet clerks who maintain the standard library’s ancient indexes.',
    note: 'Standard libraries bundle battle-tested helpers so every programmer doesn’t reinvent sorting.',
    sightings: [{ layer: 'libraries', entityId: 'lib-inkwell' }],
  },
  {
    id: 'card-cat',
    name: 'Card Catalogue',
    manTag: 'SYMBOL-IDX(3)',
    kind: 'prop',
    rarity: 'common',
    blurb: 'Dozens of tiny wooden drawers, each pointing to an exact function buried in the stacks.',
    note: 'Linkers look up exported symbol tables just like a library card catalogue.',
    sightings: [{ layer: 'libraries', entityId: 'lib-catalogue' }],
  },
  {
    id: 'mailbox-ipc',
    name: 'Daemon Postbox',
    manTag: 'IPC-PIPE(8)',
    kind: 'prop',
    rarity: 'common',
    blurb: 'Keeps its little red flag up whenever a background process has unread mail.',
    note: 'Processes talk to each other through pipes, sockets, and message queues.',
    sightings: [{ layer: 'userspace', entityId: 'us-mailbox' }],
  },
  {
    id: 'kernel-furnace',
    name: 'Boiler Core',
    manTag: 'SCHED-CORE(0)',
    kind: 'prop',
    rarity: 'common', // has an anchor appearance: landmarks are never gated (rarity.ts)
    blurb: 'Glows red-hot beneath the giant cogs, turning raw clock ticks into scheduled work.',
    note: 'The kernel sits at Ring 0 with unrestricted access to memory, CPU cores, and hardware.',
    sightings: [{ layer: 'kernel', entityId: 'kr-furnace' }],
  },
  {
    id: 'oscilloscope',
    name: 'Wave Watcher',
    manTag: 'SCOPE(4)',
    kind: 'prop',
    rarity: 'uncommon',
    blurb: 'Hums quietly on the workbench, drawing a crisp cyan sine wave that never misses a beat.',
    note: 'Hardware engineers use oscilloscopes to see real voltage waves on circuit-board pins.',
    sightings: [{ layer: 'drivers', entityId: 'dr-scope' }],
  },
  {
    id: 'floppy-relic',
    name: 'Save Icon Relic',
    manTag: 'FLOPPY(4)',
    kind: 'prop',
    rarity: 'uncommon',
    blurb: 'Younger users swear someone 3D-printed the Save icon and hid it in the BIOS vault.',
    note: 'For decades, 3.5-inch floppy disks booted machines and flashed BIOS updates.',
    sightings: [{ layer: 'firmware', entityId: 'fw-floppy' }],
  },
  {
    id: 'vault-keeper',
    name: 'Vault Keeper',
    manTag: 'BIOS-VAULT(4)',
    kind: 'prop',
    rarity: 'common', // has an anchor appearance: landmarks are never gated (rarity.ts)
    blurb: 'A colossal circular bank door that sends out slow phosphor ripples as its dial turns.',
    note: 'Write-protected boot flash prevents malware from silently rewriting your motherboard’s startup code.',
    sightings: [{ layer: 'firmware', entityId: 'fw-bigvault' }],
  },
  {
    id: 'twin-masks',
    name: 'The Twin Masks',
    manTag: 'VMCS(−1)',
    kind: 'prop',
    rarity: 'rare',
    blurb: 'Host on the left, mirrored Guest on the right — swapping faces every VM exit.',
    note: 'A VMCS (Virtual Machine Control Structure) saves and restores CPU state between host and guest.',
    sightings: [{ layer: 'ring-1', entityId: 'r1-vmcs' }],
  },
  {
    id: 'hypervisor-eye',
    name: 'All-Seeing Lens',
    manTag: 'SHADOW-PT(−1)',
    kind: 'prop',
    rarity: 'rare',
    blurb: 'Glances left and right across virtual memory, catching every guest page fault before it lands.',
    note: 'Hypervisors intercept guest memory tables so VMs stay safely isolated from one another.',
    sightings: [{ layer: 'ring-1', entityId: 'r1-shadowpage' }],
  },
  {
    id: 'frozen-metro',
    name: 'Stopped Metronome',
    manTag: 'SMM-TICK(−2)',
    kind: 'prop',
    rarity: 'rare',
    blurb: 'Caught leaning right at the peak of its swing — waiting for an RSM instruction that never comes.',
    note: 'Ring −2 (SMM) is invisible to the OS; when it pauses execution, time literally stands still above it.',
    sightings: [{ layer: 'ring-2', entityId: 'r2-metronome' }],
  },
  {
    id: 'frozen-drop',
    name: 'Suspended Splash',
    manTag: 'QUIESCENCE(−2)',
    kind: 'prop',
    rarity: 'mythic',
    blurb: 'A single teardrop hovering forever over a crown of silver pixels.',
    note: 'System Management Mode suspends all normal threads in place without them ever knowing they paused.',
    sightings: [{ layer: 'ring-2', entityId: 'r2-pause' }],
  },
  {
    id: 'rf-tower',
    name: 'Hidden Beacon',
    manTag: 'AMT-BEACON(−3)',
    kind: 'prop',
    rarity: 'mythic',
    blurb: 'Broadcasts silent 1-bit pings from the bottom of the silicon die, even when the machine is asleep.',
    note: 'Out-of-band management engines can answer network pings while the main CPU is powered down.',
    sightings: [{ layer: 'ring-3', entityId: 'r3-guard' }],
  },
  {
    id: 'transistor-node',
    name: 'Gatekeeper FET',
    manTag: 'MOSFET(−3)',
    kind: 'prop',
    rarity: 'mythic',
    blurb: 'One tiny switch out of billions — open or closed, 0 or 1, holding up the entire world above.',
    note: 'Every app, OS, and game in existence ultimately boils down to billions of microscopic transistors.',
    sightings: [{ layer: 'ring-3', entityId: 'r3-sram' }],
  },

  // ---------------------------------------------------------------------------
  // Question-Reactive Anomalies (appear when a prompt matches their topic!)
  {
    id: 'anom-bst',
    name: 'The Balanced Tree',
    manTag: 'BST-ANOM(7)',
    kind: 'anomaly',
    rarity: 'rare',
    blurb: 'Spontaneously sprouts inside background monitors whenever a data-structure prompt appears.',
    note: 'Binary search trees keep sorted data quick to find by halving the search space at every branch.',
    sightings: [{ layer: 'application', topicId: 'tp-dsa-tree', detailNote: 'Appears on screens during Data Structures & Algorithms prompts.' }],
  },
  {
    id: 'anom-sort',
    name: 'The Racing Bars',
    manTag: 'QSORT-ANOM(7)',
    kind: 'anomaly',
    rarity: 'rare',
    blurb: 'Frantically swaps adjacent bars in the background whenever sorting or algorithm prompts are active.',
    note: 'Sorting visualizers show how algorithms compare and swap elements into order.',
    sightings: [{ layer: 'runtime', topicId: 'tp-sort-bars', detailNote: 'Appears on screens during Sorting & Algorithm prompts.' }],
  },
  {
    id: 'anom-crypto',
    name: 'Cipher Sentinel',
    manTag: 'CRYPTO-ANOM(7)',
    kind: 'anomaly',
    rarity: 'mythic',
    blurb: 'A shimmering cryptographic padlock that hijacks nearby screens on security & crypto questions.',
    note: 'Modern cryptography protects data using math problems easy to lock and practically impossible to undo without the key.',
    sightings: [{ layer: 'firmware', topicId: 'tp-crypto-lock', detailNote: 'Appears on screens during Cryptography & Security prompts.' }],
  },
];

const LAYER_ORDER = new Map<LayerId, number>(ENDLESS_LAYERS.map((l, i) => [l.id, i]));
export function layerRank(id: LayerId): number {
  return LAYER_ORDER.get(id) ?? 999;
}

const BY_ID = new Map<string, ManualEntry>(MANUAL_ENTRIES.map((e) => [e.id, e]));
const BY_ENTITY = new Map<string, { entry: ManualEntry; sighting: ManualSighting }>();
const BY_CRITTER = new Map<LayerId, { entry: ManualEntry; sighting: ManualSighting }>();
const BY_TOPIC = new Map<string, { entry: ManualEntry; sighting: ManualSighting }>();

for (const entry of MANUAL_ENTRIES) {
  for (const s of entry.sightings) {
    if (s.entityId) BY_ENTITY.set(s.entityId, { entry, sighting: s });
    if (s.critterLayer) BY_CRITTER.set(s.critterLayer, { entry, sighting: s });
    if (s.topicId) BY_TOPIC.set(s.topicId, { entry, sighting: s });
  }
}

export function manualEntryById(id: string): ManualEntry | undefined {
  return BY_ID.get(id);
}

/** Find the manual entry for a placed v4 entity ID (returns the entry and the sighting layer to record). */
export function entryForEntity(entityId: string, layer: LayerId): { entry: ManualEntry; layer: LayerId } | undefined {
  const hit = BY_ENTITY.get(entityId);
  if (!hit) return undefined;
  return { entry: hit.entry, layer: hit.sighting.layer ?? layer };
}

/** Find the manual entry for a biosphere critter on `layer` (maps Endless layers to their core species). */
export function entryForCritter(layer: LayerId): { entry: ManualEntry; layer: LayerId } | undefined {
  const direct = BY_CRITTER.get(layer);
  if (direct) return { entry: direct.entry, layer: direct.sighting.layer };
  const fb = DAILY_FALLBACK[layer];
  const fallbackHit = BY_CRITTER.get(fb);
  return fallbackHit ? { entry: fallbackHit.entry, layer: fallbackHit.sighting.layer } : undefined;
}

/** Find the manual entry for a question-reactive topic display. */
export function entryForTopic(topicId: string): { entry: ManualEntry; layer: LayerId } | undefined {
  const hit = BY_TOPIC.get(topicId);
  return hit ? { entry: hit.entry, layer: hit.sighting.layer } : undefined;
}

// -----------------------------------------------------------------------------
// Persistent discovery store (save v2, src/game/manual-save.ts) + debug "Unlock all" overlay.

export interface LogResult {
  isNewEntry: boolean;
  isNewLayer: boolean;
}

/** Where a sighting happens, supplied by the app (main.ts): today's puzzle and the prompt being answered, if any. */
export interface SightingContext {
  puzzle: number | null;
  prompt?: string;
}

export interface ManualStoreOptions {
  now: () => number;
  /** Production migrates the shared v1 key once; debug builds leave it alone (they never own a real player's save). */
  migrateV1: boolean;
}

const wetKey = (entryId: string, layer: LayerId) => `${entryId}|${layer}`;

export class ManualStore {
  private found = new Map<string, Map<LayerId, Stamp>>();
  private wet = new Set<string>();
  private debugUnlockAll = false;
  private listeners = new Set<() => void>();
  private context: () => SightingContext = () => ({ puzzle: null });
  private loadNotice: string | undefined;

  constructor(
    private storage: SaveStorage | null,
    private opts: ManualStoreOptions = { now: Date.now, migrateV1: false },
  ) {
    this.load();
  }

  /** Read v2 (or migrate v1). A corrupt save is removed and reported once via takeLoadNotice(); storage trouble is "no save". */
  private load() {
    const s = this.storage;
    if (!s) return;
    let raw: string | null;
    let v1: string | null = null;
    try {
      raw = s.getItem(MANUAL_V2_KEY);
      if (raw === null && this.opts.migrateV1) v1 = s.getItem(MANUAL_V1_KEY);
    } catch {
      return;
    }
    if (raw === null && v1 === null) return;
    let save: ManualSaveV2;
    try {
      save = raw !== null ? parseV2(raw) : fromV1(v1!);
    } catch (e) {
      if (!(e instanceof InvalidManualSave)) throw e; // a bug in the parser, not a bad save
      this.loadNotice = `Your Field Manual could not be read (${e.message}), so it starts empty.`;
      this.remove(raw !== null ? MANUAL_V2_KEY : MANUAL_V1_KEY);
      return;
    }
    const { save: clean, dropped } = prune(save, (id, layer) => BY_ID.get(id)?.sightings.some((x) => x.layer === layer) ?? false);
    if (dropped.length) this.loadNotice = `Some Field Manual pages no longer exist and were removed: ${dropped.join(', ')}.`;
    for (const [id, layers] of Object.entries(clean.seen)) this.found.set(id, new Map(Object.entries(layers) as [LayerId, Stamp][]));
    for (const w of clean.wet) this.wet.add(w);
    if (v1 !== null || dropped.length) {
      this.save();
      if (v1 !== null) this.remove(MANUAL_V1_KEY);
    }
  }

  private remove(key: string) {
    try {
      this.storage?.removeItem(key);
    } catch {
      /* unavailable storage */
    }
  }

  private save() {
    if (!this.storage) return;
    const obj: ManualSaveV2 = {
      v: 2,
      seen: Object.fromEntries([...this.found].map(([id, layers]) => [id, Object.fromEntries(layers)])),
      wet: [...this.wet],
    };
    try {
      this.storage.setItem(MANUAL_V2_KEY, JSON.stringify(obj));
    } catch {
      /* quota or blocked storage is an expected condition */
    }
  }

  /** The load problem to show the player, once. */
  takeLoadNotice(): string | undefined {
    const n = this.loadNotice;
    this.loadNotice = undefined;
    return n;
  }

  setContext(fn: () => SightingContext) {
    this.context = fn;
  }

  private emit() {
    for (const fn of this.listeners) fn();
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  /** Record a sighting of `entryId` at `layer`. The first sighting of each appearance is stamped and starts wet. */
  log(entryId: string, layer: LayerId): LogResult {
    const entry = BY_ID.get(entryId);
    enforce(entry, `manual: log() of unknown entry ${entryId}`);
    enforce(entry.sightings.some((s) => s.layer === layer), `manual: ${entryId} has no appearance in ${layer}`);
    let layers = this.found.get(entryId);
    const isNewEntry = !layers || layers.size === 0;
    if (!layers) {
      layers = new Map();
      this.found.set(entryId, layers);
    }
    const isNewLayer = !layers.has(layer);
    if (isNewLayer) {
      const c = this.context();
      layers.set(layer, { at: this.opts.now(), puzzle: c.puzzle, ...(c.prompt ? { prompt: c.prompt } : {}) });
      this.wet.add(wetKey(entryId, layer));
      this.save();
      this.emit();
    }
    return { isNewEntry, isNewLayer };
  }

  /** The stamp for an appearance's first sighting, if it has been seen. */
  firstSeen(entryId: string, layer: LayerId): Stamp | undefined {
    return this.found.get(entryId)?.get(layer);
  }

  /** A stamp logged but not yet viewed in the binder. */
  isWet(entryId: string, layer: LayerId): boolean {
    return this.wet.has(wetKey(entryId, layer));
  }

  isFound(entryId: string): boolean {
    if (this.debugUnlockAll) return BY_ID.has(entryId);
    return (this.found.get(entryId)?.size ?? 0) > 0;
  }

  hasLayer(entryId: string, layer: LayerId): boolean {
    if (this.debugUnlockAll) return BY_ID.get(entryId)?.sightings.some((s) => s.layer === layer) ?? false;
    return this.found.get(entryId)?.has(layer) ?? false;
  }

  /** Discovered layers for `entryId`, ordered highest (shallowest) first. */
  foundLayers(entryId: string): LayerId[] {
    const entry = BY_ID.get(entryId);
    if (!entry) return [];
    if (this.debugUnlockAll) return entry.sightings.map((s) => s.layer);
    const layers = this.found.get(entryId);
    if (!layers) return [];
    return entry.sightings.map((s) => s.layer).filter((l) => layers.has(l));
  }

  highestFoundLayer(entryId: string): LayerId | undefined {
    const layers = this.foundLayers(entryId);
    if (!layers.length) return undefined;
    return layers.slice().sort((a, b) => layerRank(a) - layerRank(b))[0];
  }

  /** An entry with any wet stamp. */
  isUnread(entryId: string): boolean {
    for (const w of this.wet) if (w.startsWith(`${entryId}|`)) return true;
    return false;
  }

  /** Viewing an entry's page dries all of its stamps. */
  markRead(entryId: string) {
    let changed = false;
    for (const w of [...this.wet])
      if (w.startsWith(`${entryId}|`)) {
        this.wet.delete(w);
        changed = true;
      }
    if (!changed) return;
    this.save();
    this.emit();
  }

  /** Entries with any wet stamp. */
  unreadCount(): number {
    return new Set([...this.wet].map((w) => w.slice(0, w.indexOf('|')))).size;
  }

  foundCount(): number {
    if (this.debugUnlockAll) return MANUAL_ENTRIES.length;
    let n = 0;
    for (const layers of this.found.values()) if (layers.size > 0) n++;
    return n;
  }

  get isDebugUnlocked(): boolean {
    return this.debugUnlockAll;
  }

  /** Debug-only: reveal all entries & layers without mutating the player's saved discoveries. */
  setDebugUnlockAll(on: boolean) {
    if (this.debugUnlockAll === on) return;
    this.debugUnlockAll = on;
    this.emit();
  }

  /** Clear all saved discoveries and stamps. */
  reset() {
    this.found.clear();
    this.wet.clear();
    this.debugUnlockAll = false;
    this.save();
    this.emit();
  }
}

export const manualStore = new ManualStore(browserStorage(), { now: () => Date.now(), migrateV1: !DEBUG });
