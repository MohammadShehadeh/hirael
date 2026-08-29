/**
 * Site-wide brand constants. One source of truth for name, URLs, social links.
 */

export const SITE = {
  name: 'Hirael',
  description: "The components shadcn/ui doesn't ship.",
  longDescription:
    "A shadcn-compatible registry of React components, section blocks, and full-page templates most products end up building anyway. The shadcn CLI copies the source into your repo, so there's no package to depend on.",
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
    /** Public origin used when generating install URLs server-side. */
    origin: 'https://hirael.com',
  },
} as const;

export const NAV_LINKS: { href: string; label: string; external?: boolean }[] = [
  { href: '/components', label: 'Components' },
  { href: '/blocks', label: 'Blocks' },
  { href: '/templates', label: 'Templates' },
  { href: '/changelog', label: 'Changelog' },
];
