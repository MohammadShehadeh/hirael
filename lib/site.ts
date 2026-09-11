export const SITE = {
  name: 'Hirael',
  description: 'The components, blocks and templates shadcn/ui leaves out.',
  tagline: 'Components, blocks and templates for shadcn/ui',
  longDescription:
    'Multi-select, combobox, date pickers, file dropzone and other components shadcn/ui leaves out, plus section blocks and full-page templates on Tailwind CSS. The shadcn CLI copies the source into your repo, styled for light, dark and RTL.',
  url: 'https://hirael.com',
  version: '0.1',
  author: 'Mohammad Shehadeh',
  authorUrl: 'https://mohammadshehadeh.com',
  githubUrl: 'https://github.com/mohammadshehadeh/',
  githubRepoUrl: 'https://github.com/MohammadShehadeh/hirael',
  keywords: [
    'shadcn',
    'shadcn ui',
    'shadcn registry',
    'react components',
    'ui library',
    'tailwind css',
    'multi-select',
    'combobox',
    'tag input',
    'currency input',
    'file dropzone',
    'next.js components',
    'hirael',
    'react 19',
  ],
  registry: {
    name: 'hirael',
    origin: 'https://hirael.com',
  },
} as const;

export const NAV_LINKS: { href: string; label: string; isExternal?: boolean }[] = [
  { href: '/components', label: 'Components' },
  { href: '/blocks', label: 'Blocks' },
  { href: '/templates', label: 'Templates' },
  { href: '/changelog', label: 'Changelog' },
];
