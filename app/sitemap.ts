import type { MetadataRoute } from 'next';

import { CATEGORY_REGISTRY } from '@/components/block-categories';
import { SITE } from '@/lib/site';
import { COMPONENT_CATEGORY_ORDER, COMPONENTS, REGISTRY, TEMPLATES, entryHref } from '@/registry/hirael/registry-meta';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE.url}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE.url}/components`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE.url}/blocks`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE.url}/templates`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE.url}/changelog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  const componentCategoryRoutes: MetadataRoute.Sitemap = COMPONENT_CATEGORY_ORDER.map((category) => ({
    url: `${SITE.url}/components/${category}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const componentRoutes: MetadataRoute.Sitemap = COMPONENTS.map((entry) => ({
    url: `${SITE.url}${entryHref(entry)}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const blockRoutes: MetadataRoute.Sitemap = REGISTRY.filter((entry) => entry.category === 'blocks').map((entry) => ({
    url: `${SITE.url}${entryHref(entry)}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const blockCategoryRoutes: MetadataRoute.Sitemap = CATEGORY_REGISTRY.filter((category) => !category.comingSoon).map(
    (category) => ({
      url: `${SITE.url}/blocks/${category.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }),
  );

  const templateRoutes: MetadataRoute.Sitemap = TEMPLATES.map((entry) => ({
    url: `${SITE.url}/templates/${entry.name}`,
    lastModified: now,
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
