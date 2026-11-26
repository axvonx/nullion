import { defineConfig } from 'vitest/config';

// base './' so the build works from any GitHub Pages path (user.github.io/nullion/ or a custom domain).
export default defineConfig({
  base: './',
  test: { environment: 'node' },
});
