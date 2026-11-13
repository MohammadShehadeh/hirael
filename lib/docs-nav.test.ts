import { describe, expect, it } from 'vitest';

import { DOC_PAGES, docHref, docSiblings, extractHeadings, slugifyHeading } from '@/lib/docs-nav';

describe('slugifyHeading', () => {
  it('should lowercase and hyphenate words', () => {
    expect(slugifyHeading('Getting started')).toBe('getting-started');
  });

  it('should drop punctuation and markdown marks', () => {
    expect(slugifyHeading('Use `components.json`, then add!')).toBe('use-componentsjson-then-add');
  });
});

describe('extractHeadings', () => {
  it('should list second-level headings only', () => {
    const source = '# Title\n\n## First\n\ntext\n\n### Nested\n\n## Second step';

    expect(extractHeadings(source)).toEqual([
      { id: 'first', label: 'First' },
      { id: 'second-step', label: 'Second step' },
    ]);
  });

  it('should skip headings inside fenced code', () => {
    const source = '## Real\n\n```md\n## Not a heading\n```\n\n## Also real';

    expect(extractHeadings(source).map((heading) => heading.label)).toEqual(['Real', 'Also real']);
  });
});

describe('docSiblings', () => {
  it('should have no previous page for the docs home', () => {
    expect(docSiblings('').prev).toBeUndefined();
    expect(docSiblings('').next?.slug).toBe(DOC_PAGES[1].slug);
  });

  it('should have no next page for the last doc', () => {
    expect(docSiblings(DOC_PAGES.at(-1)?.slug ?? '').next).toBeUndefined();
  });
});

describe('docHref', () => {
  it('should map the empty slug to the docs home', () => {
    expect(docHref('')).toBe('/docs');
    expect(docHref('installation')).toBe('/docs/installation');
  });
});
