import { describe, expect, it } from 'vitest';

import {
  REGISTRY,
  entryEmbedHref,
  exampleEmbedHref,
  getExamples,
  isComponentEntry,
} from '@/registry/hirael/registry-meta';

import { blockEmbedParams, exampleEmbedParams, templateEmbedParams } from './embed-routes';

const generated = new Set([
  ...blockEmbedParams().map(({ category, block }) => `/embed/blocks/${category}/${block}`),
  ...templateEmbedParams().map(({ template }) => `/embed/templates/${template}`),
  ...exampleEmbedParams().map(({ component, example }) => `/embed/components/${component}/${example}`),
]);

describe('embed routes', () => {
  it('should generate a page for every block and template preview', () => {
    const hrefs = REGISTRY.filter((entry) => entry.category === 'blocks' || entry.category === 'templates').map(
      (entry) => entryEmbedHref(entry),
    );
    expect(hrefs.filter((href) => !generated.has(href))).toEqual([]);
  });

  it('should generate a page for every demo on a component, hook or utility page', () => {
    const hrefs = REGISTRY.filter((entry) => isComponentEntry(entry) || entry.category === 'utilities').flatMap(
      (entry) => getExamples(entry.name).map((example) => exampleEmbedHref(entry, example.slug)),
    );
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.filter((href) => !generated.has(href))).toEqual([]);
  });
});
