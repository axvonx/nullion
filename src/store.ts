/** Tiny persisted store. Storage may be unavailable (private mode, blocked site data): fall back to memory. */
export function persisted<T extends object>(key: string, defaults: T) {
  let value: T = { ...defaults };
  try {
    const raw = localStorage.getItem(key);
    if (raw) value = { ...defaults, ...(JSON.parse(raw) as Partial<T>) };
  } catch {
    // Storage is a convenience here; running without it is an expected condition, not a bug.
  }
  const subs = new Set<(v: T) => void>();
  return {
    get: () => value,
    set(patch: Partial<T>) {
      value = { ...value, ...patch };
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* see above */
      }
      for (const s of subs) s(value);
    },
    subscribe(fn: (v: T) => void) {
      subs.add(fn);
      return () => subs.delete(fn);
    },
  };
}
