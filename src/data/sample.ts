import type { TierId } from '../core/tiers';

/**
 * Hand-written SAMPLE answer set for the offline prototype.
 * Tiers here are placeholder judgement calls, not the output of any rarity signal yet.
 *
 * Model: a term is stored once; each tag it belongs to carries that term's tier *for that category*
 * (e.g. "heisenbug" is a Works-on-my-machine answer to "Name a type of bug").
 */
export interface Term {
  name: string;
  aliases?: string[];
  tags: Partial<Record<string, TierId>>;
  note?: string;
}

export interface Question {
  id: string;
  /** The category tag this question queries. */
  tag: string;
  /** Rendered as code: name_a(type_of_lock). */
  call: string;
  prompt: string;
}

type Row = [name: string, tier: TierId, aliases?: string[], note?: string];

/** Authoring helper: write a category as rows, merge into tagged terms by name. */
function category(tag: string, rows: Row[], into: Map<string, Term>) {
  for (const [name, tier, aliases, note] of rows) {
    const key = name.toLowerCase();
    const t = into.get(key) ?? { name, tags: {} };
    t.tags[tag] = tier;
    if (aliases) t.aliases = [...(t.aliases ?? []), ...aliases];
    if (note) t.note = note;
    into.set(key, t);
  }
}

const terms = new Map<string, Term>();

category('lock', [
  ['mutex', 'off-by-one', ['mutual exclusion lock']],
  ['spinlock', 'off-by-one', ['spin lock']],
  ['semaphore', 'off-by-one'],
  ['read-write lock', 'npe', ['rwlock', 'readers-writer lock', 'shared-exclusive lock']],
  ['recursive mutex', 'npe', ['reentrant lock', 'reentrant mutex']],
  ['ticket lock', 'leak'],
  ['seqlock', 'leak', ['sequence lock']],
  ['futex', 'leak', ['fast userspace mutex']],
  ['optimistic lock', 'leak', ['optimistic locking']],
  ['two-phase locking', 'leak', ['2pl']],
  ['MCS lock', 'race', ['mellor-crummey scott lock']],
  ['CLH lock', 'race', ['craig landin hagersten lock']],
  ['qspinlock', 'race', ['queued spinlock']],
  ['RCU', 'womm', ['read-copy-update'], 'Not technically a lock, which is why everyone says it.'],
  ['big kernel lock', 'race', ['bkl']],
  ['lock cohort', 'heisenbug', ['cohort lock']],
  ['CNA lock', 'heisenbug', ['compact numa-aware lock']],
  ['HMCS lock', 'heisenbug', ['hierarchical mcs lock']],
  ['shuffle lock', 'heisenbug', ['shfllock']],
  ['Peterson lock', 'race', ["peterson's algorithm", 'petersons lock']],
  ['bakery lock', 'race', ["lamport's bakery algorithm", 'bakery algorithm']],
  ['fissile lock', 'bitflip', [], 'Dice & Kogan, 2020: a TAS fast path that fissions into an MCS-like slow path.'],
], terms);

category('data-structure', [
  ['array', 'off-by-one'],
  ['linked list', 'off-by-one'],
  ['hash table', 'off-by-one', ['hash map', 'hashmap', 'dictionary']],
  ['stack', 'off-by-one'],
  ['queue', 'off-by-one'],
  ['binary tree', 'off-by-one'],
  ['heap', 'npe', ['binary heap', 'priority queue']],
  ['trie', 'npe', ['prefix tree']],
  ['red-black tree', 'npe', ['rb tree', 'rbtree']],
  ['B-tree', 'npe', ['btree']],
  ['bloom filter', 'womm'],
  ['skip list', 'leak', ['skiplist']],
  ['AVL tree', 'leak'],
  ['segment tree', 'leak'],
  ['Fenwick tree', 'race', ['binary indexed tree', 'bit']],
  ['rope', 'race'],
  ['radix tree', 'race', ['patricia tree', 'compact prefix tree']],
  ['XArray', 'heisenbug', ['xarray'], 'The Linux kernel\'s resizable-array replacement for the radix tree.'],
  ['maple tree', 'heisenbug', [], 'Linux 6.1\'s RCU-safe B-tree for VMAs.'],
  ['hash array mapped trie', 'heisenbug', ['hamt']],
  ['van Emde Boas tree', 'heisenbug', ['veb tree']],
  ['fusion tree', 'bitflip', [], 'Fredman & Willard, 1990: beats comparison-sort bounds with word-level parallelism.'],
], terms);

category('bug', [
  ['off-by-one', 'off-by-one', ['off by one error', 'obo', 'fencepost error']],
  ['null pointer dereference', 'off-by-one', ['null pointer', 'null pointer exception', 'npe', 'null dereference']],
  ['memory leak', 'off-by-one'],
  ['infinite loop', 'off-by-one'],
  ['segfault', 'off-by-one', ['segmentation fault']],
  ['heisenbug', 'womm'],
  ['bit flip', 'womm', ['cosmic ray', 'cosmic ray bit flip']],
  ['Y2K', 'womm', ['y2k bug', 'millennium bug']],
  ['race condition', 'npe', ['data race']],
  ['buffer overflow', 'npe'],
  ['deadlock', 'npe'],
  ['stack overflow', 'npe'],
  ['use-after-free', 'leak', ['uaf']],
  ['double free', 'leak'],
  ['integer overflow', 'leak'],
  ['TOCTOU', 'race', ['time-of-check to time-of-use']],
  ['priority inversion', 'race'],
  ['ABA problem', 'race', ['aba']],
  ['Y2038', 'race', ['year 2038 problem', 'y2k38']],
  ['Bohrbug', 'race'],
  ['Mandelbug', 'heisenbug'],
  ['Schrödinbug', 'heisenbug', ['schrodinbug']],
  ['Hindenbug', 'heisenbug'],
  ['false sharing', 'heisenbug'],
  ['torn write', 'heisenbug', ['torn read']],
  ['moth', 'bitflip', ['the moth'], '1947: the Harvard Mark II logbook, "first actual case of bug being found".'],
], terms);

category('sorting-algorithm', [
  ['quicksort', 'off-by-one', ['quick sort']],
  ['merge sort', 'off-by-one', ['mergesort']],
  ['bubble sort', 'off-by-one'],
  ['insertion sort', 'off-by-one'],
  ['selection sort', 'off-by-one'],
  ['heapsort', 'npe', ['heap sort']],
  ['bogosort', 'womm', ['bogo sort', 'stupid sort']],
  ['sleep sort', 'womm'],
  ['radix sort', 'npe'],
  ['counting sort', 'npe'],
  ['bucket sort', 'leak'],
  ['shell sort', 'leak', ['shellsort']],
  ['timsort', 'leak', ['tim sort']],
  ['introsort', 'race', ['introspective sort']],
  ['cocktail shaker sort', 'race', ['cocktail sort', 'shaker sort']],
  ['comb sort', 'race'],
  ['pdqsort', 'heisenbug', ['pattern-defeating quicksort']],
  ['smoothsort', 'heisenbug'],
  ['bitonic sort', 'heisenbug'],
  ['library sort', 'heisenbug', ['gapped insertion sort']],
  ['spaghetti sort', 'bitflip', [], 'Sorting in O(n) with a fistful of uncooked spaghetti and a table.'],
], terms);

category('programming-language', [
  ['Python', 'off-by-one'],
  ['JavaScript', 'off-by-one', ['js']],
  ['Java', 'off-by-one'],
  ['C', 'off-by-one'],
  ['C++', 'off-by-one', ['cpp', 'cplusplus']],
  ['Rust', 'off-by-one'],
  ['Go', 'npe', ['golang']],
  ['Haskell', 'npe'],
  ['Brainfuck', 'womm', ['bf']],
  ['Lisp', 'npe'],
  ['Fortran', 'npe'],
  ['COBOL', 'npe'],
  ['Erlang', 'leak'],
  ['OCaml', 'leak'],
  ['Zig', 'leak'],
  ['Prolog', 'leak'],
  ['APL', 'race'],
  ['Forth', 'race'],
  ['Simula', 'race'],
  ['BCPL', 'heisenbug'],
  ['Plankalkül', 'bitflip', ['plankalkul'], 'Konrad Zuse, 1942–45: the first high-level language, implemented decades later.'],
], terms);

category('operating-system', [
  ['Linux', 'off-by-one'],
  ['Windows', 'off-by-one'],
  ['macOS', 'off-by-one', ['os x', 'mac os']],
  ['Android', 'off-by-one'],
  ['iOS', 'off-by-one'],
  ['FreeBSD', 'npe'],
  ['TempleOS', 'womm'],
  ['Unix', 'npe'],
  ['MS-DOS', 'npe', ['dos']],
  ['Plan 9', 'womm', ['plan 9 from bell labs']],
  ['OpenBSD', 'leak'],
  ['Solaris', 'leak'],
  ['Haiku', 'leak', ['beos']],
  ['Minix', 'race'],
  ['seL4', 'race', ['sel4']],
  ['Multics', 'race'],
  ['Fuchsia', 'race'],
  ['THE multiprogramming system', 'heisenbug', ['the os']],
  ['ITS', 'heisenbug', ['incompatible timesharing system']],
  ['Barrelfish', 'heisenbug'],
  ['Atlas Supervisor', 'bitflip', [], 'Manchester, 1962: arguably the first OS, and where virtual memory began.'],
], terms);

category('shading-technique', [
  ['flat shading', 'off-by-one'],
  ['Phong shading', 'off-by-one', ['phong']],
  ['Gouraud shading', 'off-by-one', ['gouraud']],
  ['cel shading', 'off-by-one', ['toon shading']],
  ['ray tracing', 'womm', ['raytracing']],
  ['Blinn-Phong', 'npe', ['blinn phong shading']],
  ['normal mapping', 'npe'],
  ['ambient occlusion', 'npe', ['ssao']],
  ['physically based rendering', 'npe', ['pbr']],
  ['deferred shading', 'leak', ['deferred rendering']],
  ['shadow mapping', 'leak'],
  ['parallax mapping', 'leak'],
  ['subsurface scattering', 'race', ['sss']],
  ['Cook-Torrance', 'race'],
  ['Oren-Nayar', 'race'],
  ['clustered shading', 'race', ['clustered forward shading']],
  ['visibility buffer', 'heisenbug', ['vbuffer']],
  ['spherical harmonic lighting', 'heisenbug', ['sh lighting']],
  ['Minnaert shading', 'heisenbug'],
  ['Lommel-Seeliger', 'bitflip', [], 'A lunar-surface reflectance law from 1887 that games still borrow.'],
], terms);

export const SAMPLE_TERMS: readonly Term[] = [...terms.values()];

export const SAMPLE_QUESTIONS: readonly Question[] = [
  { id: 'lock', tag: 'lock', call: 'name_a(type_of_lock)', prompt: 'Name a type of lock' },
  { id: 'data-structure', tag: 'data-structure', call: 'name_a(data_structure)', prompt: 'Name a data structure' },
  { id: 'bug', tag: 'bug', call: 'name_a(type_of_bug)', prompt: 'Name a type of bug' },
  { id: 'sorting-algorithm', tag: 'sorting-algorithm', call: 'name_a(sorting_algorithm)', prompt: 'Name a sorting algorithm' },
  { id: 'programming-language', tag: 'programming-language', call: 'name_a(programming_language)', prompt: 'Name a programming language' },
  { id: 'operating-system', tag: 'operating-system', call: 'name_an(operating_system)', prompt: 'Name an operating system' },
  { id: 'shading-technique', tag: 'shading-technique', call: 'name_a(shading_technique)', prompt: 'Name a shading technique' },
];
