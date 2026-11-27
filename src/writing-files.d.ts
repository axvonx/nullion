/** The text of every top-level writing/<surface>.md, keyed by path (`writing/reveal.md`); built by the plugin in vite.config.ts. */
declare module 'virtual:writing' {
  const files: Record<string, string>;
  export default files;
}
