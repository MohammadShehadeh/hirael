import { readFileSync, globSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { transformSync } from '@babel/core';
import { describe, expect, it } from 'vitest';

const ROOT = path.resolve(import.meta.dirname, '../../..');
const require = createRequire(import.meta.url);
const COMPILER = require.resolve('babel-plugin-react-compiler');

// Shipped source carries no hand-written memoization, so a component the compiler skips gets none at all.
// ui/ mirrors shadcn verbatim, and a 'use no memo' file opts out of the compiler on purpose.
const compilableSources = (dir: string) =>
  globSync(`${dir}/**/*.{ts,tsx}`, { cwd: ROOT })
    .map((file) => file.replaceAll('\\', '/'))
    .filter((file) => !file.includes('/ui/'))
    .filter((file) => !readFileSync(path.join(ROOT, file), 'utf8').startsWith("'use no memo'"));

// Compiling the whole registry takes seconds, well past Vitest's default timeout.
const TIMEOUT = 120_000;

const bailouts = (file: string) => {
  const failures: string[] = [];
  transformSync(readFileSync(path.join(ROOT, file), 'utf8'), {
    filename: file,
    babelrc: false,
    configFile: false,
    parserOpts: { plugins: ['typescript', 'jsx'] },
    plugins: [
      [
        COMPILER,
        {
          panicThreshold: 'none',
          logger: {
            logEvent: (_: string | null, event: { kind: string; detail?: { reason?: string } }) => {
              if (event.kind === 'CompileError' || event.kind === 'PipelineError') {
                failures.push(`${file}: ${event.detail?.reason ?? event.kind}`);
              }
            },
          },
        },
      ],
    ],
  });

  return failures;
};

describe.each([['radix'], ['base']] as const)('React Compiler (%s)', (base) => {
  it(
    'should compile every component, block and template',
    () => {
      const files = compilableSources(`registry/hirael/bases/${base}`);

      expect(files.length).toBeGreaterThan(100);
      expect(files.flatMap(bailouts)).toEqual([]);
    },
    TIMEOUT,
  );
});

describe('React Compiler (shared)', () => {
  it(
    'should compile every hook and utility',
    () => {
      const files = [...compilableSources('registry/hirael/hooks'), ...compilableSources('registry/hirael/lib')];

      expect(files.length).toBeGreaterThan(0);
      expect(files.flatMap(bailouts)).toEqual([]);
    },
    TIMEOUT,
  );
});
