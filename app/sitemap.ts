import type { MetadataRoute } from 'next';

import { CATEGORY_REGISTRY } from '@/components/block-categories';
import { getChangelog, getReleaseDates } from '@/lib/changelog';
import { DOC_PAGES, docHref } from '@/lib/docs-nav';
import { SITE } from '@/lib/site';
import {
  COMPONENT_CATEGORY_ORDER,
  COMPONENTS,
  REGISTRY,
  TEMPLATES,
  UTILITIES,
  UTILITY_KIND_ORDER,
  entryHref,
} from '@/registry/hirael/registry-meta';

export const dynamic = 'force-static';

type SitemapRoute = MetadataRoute.Sitemap[number];

const route = (
  path: string,
  lastModified: string,
  priority: number,
  changeFrequency: SitemapRoute['changeFrequency'] = 'monthly',
): SitemapRoute => ({ url: `${SITE.url}${path}`, lastModified, changeFrequency, priority });

/** Dates come from the changelog. A build time would mark every URL as changed on each deploy. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ entries }, dates] = await Promise.all([getChangelog(), getReleaseDates()]);
  const latest = entries[0]?.isoDate ?? new Date().toISOString();
  const shipped = (name: string) => dates[name] ?? latest;

  return [
    route('', latest, 1, 'weekly'),
    route('/components', latest, 0.9, 'weekly'),
    route('/blocks', latest, 0.9, 'weekly'),
    route('/templates', latest, 0.9, 'weekly'),
    route('/utilities', latest, 0.8, 'weekly'),
    route('/changelog', latest, 0.5, 'weekly'),
    ...DOC_PAGES.map((page) => route(docHref(page.slug), latest, page.slug ? 0.7 : 0.8)),
    ...COMPONENT_CATEGORY_ORDER.map((category) => route(`/components/${category}`, latest, 0.7)),
    ...COMPONENTS.map((entry) => route(entryHref(entry), shipped(entry.name), 0.8)),
    ...CATEGORY_REGISTRY.filter((category) => !category.isComingSoon).map((category) =>
      route(`/blocks/${category.slug}`, latest, 0.7),
    ),
    ...REGISTRY.filter((entry) => entry.category === 'blocks').map((entry) =>
      route(entryHref(entry), shipped(entry.name), 0.7),
    ),
    ...TEMPLATES.map((entry) => route(`/templates/${entry.name}`, shipped(entry.name), 0.7)),
    ...UTILITY_KIND_ORDER.map((kind) => route(`/utilities/${kind}`, latest, 0.6)),
    ...UTILITIES.map((entry) => route(entryHref(entry), shipped(entry.name), 0.6)),
  ];
}
