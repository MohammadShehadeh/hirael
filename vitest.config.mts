import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Items carry no hand-written memoization, so tests must render them compiled, as the site and consumers do.
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    tsconfigPaths: true,
    // `server-only` throws outside a React Server bundle; build-time lib code is plain Node under test.
    alias: { 'server-only': 'next/dist/compiled/server-only/empty.js' },
  },
  test: {
    projects: [
      {
        extends: true,
        test: { name: 'node', environment: 'node', include: ['**/*.test.ts'], exclude: ['node_modules/**'] },
      },
      {
        extends: true,
        test: {
          name: 'dom',
          environment: 'jsdom',
          include: ['**/*.test.tsx'],
          exclude: ['node_modules/**'],
          setupFiles: ['./test/setup-dom.ts'],
        },
      },
    ],
  },
});
