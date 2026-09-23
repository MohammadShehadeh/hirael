import { fixupConfigRules } from '@eslint/compat';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import tsParser from '@typescript-eslint/parser';
import { plugin as shadcn } from '@shadcn/lint';
import stylistic from '@stylistic/eslint-plugin';
import vitest from '@vitest/eslint-plugin';

// Entrance animations aren't a restyle; the grammar can't classify them (and reads `fill-mode-*` as a colour).
const RESTYLE_ALLOW = [
  'layout',
  'animate-in',
  'animate-out',
  'animate-none',
  'fade-in',
  'fade-in-*',
  'fade-out',
  'fade-out-*',
  'slide-in-from-*',
  'slide-out-to-*',
  'zoom-in',
  'zoom-in-*',
  'zoom-out',
  'zoom-out-*',
  'fill-mode-*',
  'duration-*',
  'delay-*',
  'ease-*',
];

// Field is the parent the rule would move the gap to, so its spacing is allowed.
// A Command hosted in a popover sits flush (`p-0`), as in shadcn's own combobox.
const LAYOUT_SLOTS = [
  { pattern: '^Field(Group|Set|Content)?$', allow: ['layout', 'spacing'] },
  { pattern: '^PopoverContent$', allow: ['layout', 'spacing'] },
];

const eslintConfig = [
  { ignores: ['.next/**', 'out/**', 'public/r/**'] },
  // eslint-plugin-react (inside eslint-config-next) still calls context APIs ESLint 10 removed.
  ...fixupConfigRules([...nextCoreWebVitals, ...nextTypescript]),
  {
    rules: {
      // Warnings while older registry code migrates to the React Compiler rules; don't add new ones.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      // Automatic JSX runtime: JSX doesn't read `React`, so an unused `import * as React` should be reported.
      'react/jsx-uses-react': 'off',
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true }, jsxPragma: null },
    },
    plugins: { shadcn },
    settings: {
      // components.json names one ui alias; discovery must cover both bases.
      shadcn: {
        ui: ['@/registry/hirael/bases/radix/ui', '@/registry/hirael/bases/base/ui'],
        componentImports: ['^@/registry/hirael/bases/(radix|base)/components(/|$)'],
      },
    },
    rules: {
      'shadcn/no-restyle': ['error', { allow: RESTYLE_ALLOW, contracts: LAYOUT_SLOTS }],
    },
  },
  {
    // Showcase-only density: flush palette and nav sheets, a dense API table. Registry items get no such allowance.
    files: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
    rules: {
      'shadcn/no-restyle': [
        'error',
        {
          allow: RESTYLE_ALLOW,
          contracts: [
            ...LAYOUT_SLOTS,
            { pattern: '^(Dialog|Sheet)Content$', allow: ['layout', 'spacing'] },
            { pattern: '^Sheet(Header|Footer)$', allow: ['layout', 'spacing'] },
            { pattern: '^Table(Head|Cell)$', allow: ['layout', 'spacing'] },
          ],
        },
      ],
    },
  },
  {
    // Registry source is the design system and styles its own slots.
    files: ['registry/hirael/bases/*/ui/**', 'registry/hirael/bases/*/components/**'],
    rules: {
      'shadcn/no-restyle': 'off',
    },
  },
  {
    // ui/ mirrors shadcn verbatim, unused imports included.
    files: ['registry/hirael/bases/*/ui/**'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    ...vitest.configs.recommended,
    rules: {
      ...vitest.configs.recommended.rules,
      // Titles read as a spec: it('should commit a tag on Enter').
      'vitest/valid-title': ['error', { mustMatch: { it: ['^should ', 'Test titles start with "should "'] } }],
    },
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}'],
    // ui/ mirrors shadcn verbatim; keep it diffable against upstream.
    ignores: ['registry/hirael/bases/*/ui/**'],
    plugins: { '@stylistic': stylistic },
    rules: {
      '@stylistic/padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'return' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none', ignoreRestSiblings: true },
      ],
    },
  },
];

export default eslintConfig;
