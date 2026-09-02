import type { MetadataRoute } from 'next';

import { CATEGORY_REGISTRY } from '@/components/block-categories';
import { getChangelog, getReleaseDates } from '@/lib/changelog';
import { SITE } from '@/lib/site';
import { COMPONENT_CATEGORY_ORDER, COMPONENTS, REGISTRY, TEMPLATES, entryHref } from '@/registry/hirael/registry-meta';

export const dynamic = 'force-static';

/**
 * `lastModified` comes from the changelog, not the build clock: a static export
 * rebuilds on every deploy, and a build timestamp would claim all 248 URLs
 * changed each time. Items carry their release date, listing pages the latest.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ entries }, dates] = await Promise.all([getChangelog(), getReleaseDates()]);
  const latest = entries[0]?.isoDate ?? new Date().toISOString();
  const shipped = (name: string) => dates[name] ?? latest;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: latest, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/components`, lastModified: latest, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/blocks`, lastModified: latest, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/templates`, lastModified: latest, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE.url}/changelog`, lastModified: latest, changeFrequency: 'weekly', priority: 0.5 },
  ];

  const componentCategoryRoutes: MetadataRoute.Sitemap = COMPONENT_CATEGORY_ORDER.map((category) => ({
    url: `${SITE.url}/components/${category}`,
    lastModified: latest,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const componentRoutes: MetadataRoute.Sitemap = COMPONENTS.map((entry) => ({
    url: `${SITE.url}${entryHref(entry)}`,
    lastModified: shipped(entry.name),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const blockRoutes: MetadataRoute.Sitemap = REGISTRY.filter((entry) => entry.category === 'blocks').map((entry) => ({
    url: `${SITE.url}${entryHref(entry)}`,
    lastModified: shipped(entry.name),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blockCategoryRoutes: MetadataRoute.Sitemap = CATEGORY_REGISTRY.filter((category) => !category.comingSoon).map(
    (category) => ({
      url: `${SITE.url}/blocks/${category.slug}`,
      lastModified: latest,
      changeFrequency: 'monthly',
      priority: 0.7,
    }),
  );

  const templateRoutes: MetadataRoute.Sitemap = TEMPLATES.map((entry) => ({
    url: `${SITE.url}/templates/${entry.name}`,
    lastModified: shipped(entry.name),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...componentCategoryRoutes,
    ...componentRoutes,
    ...blockCategoryRoutes,
    ...blockRoutes,
    ...templateRoutes,
  ];
}
