import { enforce } from './core/enforce';

/**
 * What build this is. The one source is package.json's `version` (semver; a pre-release tag is the stage, e.g.
 * `0.1.0-alpha`); bump it there and note the release in CHANGELOG.md. Shown on the title screen, in Settings and at
 * the foot of the end card, and in the browser console as `nullion.version`.
 */
export const VERSION: string = __APP_VERSION__;

const m = /^(\d+)\.(\d+)\.(\d+)(?:-([a-z]+)(?:\.\d+)?)?$/.exec(VERSION);
enforce(m, `package.json version ${VERSION} is not semver with an optional stage (0.1.0-alpha)`);

/** The release stage: a pre-release tag, or "stable" for a plain version (1.0.0 and on). */
export const STAGE: string = m[4] ?? 'stable';

/** How the game names itself in one short line: "nullion v0.1.0-alpha". */
export const VERSION_LABEL = `nullion v${VERSION}`;
