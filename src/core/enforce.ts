/** Invariant check. A violation is a bug: throw loudly, never limp on. */
export function enforce(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`invariant violated: ${msg}`);
}
