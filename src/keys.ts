/**
 * Debug builds are served from /debug/ on the same origin as production, so they share localStorage with it.
 * Every key a debug build writes carries this prefix, so testing never touches a real player's save, stats or prefs.
 */
export const DEBUG_KEY_PREFIX = 'nullion.debug.';
const PROD_KEY_PREFIX = 'nullion.';

/** Dev server and `npm run build:debug` include the 🐞 menu; `npm run build` strips it. */
export const DEBUG: boolean = import.meta.env.DEV || import.meta.env.VITE_DEBUG === '1';

/** The localStorage key for `name` (no `nullion.` prefix), namespaced by build. */
export function storageKey(name: string, debug: boolean = DEBUG): string {
  return (debug ? DEBUG_KEY_PREFIX : PROD_KEY_PREFIX) + name;
}
