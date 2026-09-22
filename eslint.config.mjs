import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  { ignores: ['.next/**', 'out/**', 'public/r/**'] },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Warnings while older registry code migrates to the React Compiler rules; don't add new ones.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
  {
    // ui/ mirrors shadcn's registry verbatim; consumers install their own copy.
    files: ['registry/hirael/bases/*/ui/**', 'hooks/use-mobile.ts'],
    rules: {
      'react-hooks/purity': 'off',
    },
  },
];

export default eslintConfig;
