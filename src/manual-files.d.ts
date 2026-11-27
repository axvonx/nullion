/** The text of every manual/<layer>/<id>.md, keyed by path; built by the plugin in vite.config.ts (drafts are left out of production builds). */
declare module 'virtual:manual-files' {
  const files: Record<string, string>;
  export default files;
}
