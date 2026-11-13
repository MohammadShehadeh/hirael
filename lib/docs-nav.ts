export interface DocPage {
  /** Empty for the docs home at `/docs`. */
  slug: string;
  title: string;
  description: string;
}

export interface DocLink {
  href: string;
  title: string;
}

/** Sidebar order. Each page's body lives in `content/docs/<slug or index>.mdx`. */
export const DOC_PAGES: DocPage[] = [
  {
    slug: '',
    title: 'Introduction',
    description: 'What Hirael is, what you can install from it and how the code ends up in your project.',
  },
  {
    slug: 'installation',
    title: 'Installation',
    description: 'Set up shadcn/ui, add the @hirael registry and install your first component.',
  },
  {
    slug: 'customizer',
    title: 'Registry Customizer',
    description: 'Preview every component, block and template with your base, theme, font and radius.',
  },
  {
    slug: 'theming',
    title: 'Theming and RTL',
    description: 'The tokens Hirael reads from your theme, light and dark mode, and right-to-left layouts.',
  },
  {
    slug: 'mcp',
    title: 'AI and MCP',
    description: 'Install Hirael from Claude Code, Cursor or VS Code, and share any page with an AI editor.',
  },
];

/** Pages outside `/docs` that still belong in the guide. */
export const DOC_EXTRA_LINKS: DocLink[] = [{ href: '/changelog', title: 'Changelog' }];

export const docHref = (slug: string) => (slug ? `/docs/${slug}` : '/docs');

export const findDoc = (slug: string): DocPage | undefined => DOC_PAGES.find((page) => page.slug === slug);

export const docSiblings = (slug: string) => {
  const index = DOC_PAGES.findIndex((page) => page.slug === slug);

  return {
    prev: index > 0 ? DOC_PAGES[index - 1] : undefined,
    next: index >= 0 && index < DOC_PAGES.length - 1 ? DOC_PAGES[index + 1] : undefined,
  };
};

export const slugifyHeading = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[`*_]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');

export interface DocHeading {
  id: string;
  label: string;
}

/** Second-level headings outside fenced code, for the table of contents. */
export const extractHeadings = (source: string): DocHeading[] => {
  const headings: DocHeading[] = [];
  let isInFence = false;

  for (const line of source.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) isInFence = !isInFence;
    if (isInFence) continue;
    const match = /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const label = match[1].replace(/[`*_]/g, '');
    headings.push({ id: slugifyHeading(label), label });
  }

  return headings;
};
