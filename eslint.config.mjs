import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  // Build artifacts. node_modules is ignored by default.
  { ignores: ['.next/**', 'out/**', 'public/r/**'] },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // React Compiler-era rules that arrived with react-hooks v6, after
      // most of the registry was written. Kept visible as warnings while
      // components are migrated case by case — don't add new violations.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
];

export default eslintConfig;
