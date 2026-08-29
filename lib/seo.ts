/**
 * schema.org payloads and search metadata derived from the registry. Google
 * reads a component page as an article about a piece of source code, so each
 * detail page ships a TechArticle wrapping a SoftwareSourceCode, sitting under
 * the site-wide WebSite/Organization nodes declared in the root layout.
 */

import type { Metadata } from 'next';

import { SITE } from '@/lib/site';
import {
  BLOCK_KIND_LABELS,
  CATEGORY_LABELS,
  DEFAULT_BASE,
  entryHref,
  registryItemPath,
  registryMarkdownPath,
  type RegistryEntryMeta,
} from '@/registry/hirael/registry-meta';

/** Stable `@id` anchors so nodes on different pages reference one graph. */
export const WEBSITE_ID = `${SITE.url}/#website`;
export const ORGANIZATION_ID = `${SITE.url}/#person`;

const absolute = (path: string) => (path.startsWith('http') ? path : `${SITE.url}${path}`);

const author = {
  '@type': 'Person',
  '@id': ORGANIZATION_ID,
  name: SITE.author,
  url: SITE.authorUrl,
  sameAs: [SITE.githubUrl],
} as const;

/** WebSite + Person + SoftwareApplication. Rendered once, in the root layout. */
export const siteJsonLd = (): object[] => [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    description: SITE.longDescription,
    inLanguage: 'en',
    publisher: { '@id': ORGANIZATION_ID },
  },
  { '@context': 'https://schema.org', ...author },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${SITE.url}/#app`,
    name: SITE.name,
    alternateName: 'Hirael registry',
    description: SITE.longDescription,
    url: SITE.url,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    softwareVersion: SITE.version,
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author,
    publisher: { '@id': ORGANIZATION_ID },
  },
];

export interface Crumb {
  name: string;
  path: string;
}

export const breadcrumbJsonLd = (crumbs: Crumb[]): object => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: absolute(crumb.path),
  })),
});

/** The human label for the collection an entry belongs to. */
const collectionName = (entry: RegistryEntryMeta) =>
  entry.blockKind ? BLOCK_KIND_LABELS[entry.blockKind] : CATEGORY_LABELS[entry.category];

/**
 * A detail page: a TechArticle documenting a SoftwareSourceCode. `codeSampleType`
 * says the listing is the whole thing rather than an excerpt, which is exactly
 * what a registry item is.
 */
export const entryJsonLd = (entry: RegistryEntryMeta, addedAt?: string): object => {
  const url = absolute(entryHref(entry));

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${url}#article`,
    headline: `${entry.title} - ${collectionName(entry)}`,
    name: entry.title,
    description: entry.description,
    url,
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    // Only releases that list their items in the changelog have a date; an
    // absent property is better than a guessed one.
    ...(addedAt ? { datePublished: addedAt, dateModified: addedAt } : {}),
    author,
    publisher: { '@id': ORGANIZATION_ID },
    about: {
      '@type': 'SoftwareSourceCode',
      name: entry.title,
      description: entry.description,
      codeRepository: SITE.githubRepoUrl,
      license: `${SITE.githubRepoUrl}/blob/main/LICENSE`,
      programmingLanguage: 'TypeScript',
      runtimePlatform: 'React',
      codeSampleType: 'full (compile ready)',
    },
  };
};

/** An index page: the collection plus the items it lists, in display order. */
export const collectionJsonLd = ({
  path,
  name,
  description,
  entries,
}: {
  path: string;
  name: string;
  description: string;
  entries: RegistryEntryMeta[];
}): object => {
  const url = absolute(path);

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    name,
    description,
    url,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: entries.length,
      itemListElement: entries.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: entry.title,
        url: absolute(entryHref(entry)),
      })),
    },
  };
};

/**
 * Long-tail keywords for one item: how people actually search for it, plus the
 * hand-written words already on the entry. Deduped, order-stable, and capped —
 * a keyword list that reads as a wall of permutations is spam, not metadata.
 */
const KEYWORD_SHAPES = [
  (title: string) => `${title} react component`,
  (title: string) => `shadcn ${title.toLowerCase()}`,
  (title: string) => `react ${title.toLowerCase()} example`,
  (title: string) => `tailwind ${title.toLowerCase()}`,
];

export const entryKeywords = (entry: RegistryEntryMeta): string[] => {
  const shapes = KEYWORD_SHAPES.map((shape) => shape(entry.title));
  return [
    ...new Set([entry.title, entry.name, ...shapes, collectionName(entry), 'shadcn registry', SITE.name.toLowerCase()]),
  ];
};

/**
 * Shared `generateMetadata` body for the component/block/template detail
 * routes — same shape, differing only in title suffix (matching each route's
 * existing format, so the extraction changes no output).
 *
 * `ownOgImage` drops the site-wide `images` entry so Next's file-convention
 * resolver uses the route's own `opengraph-image.tsx` instead. That URL can't
 * be set by hand: Next appends a content-hash suffix unknown at
 * `generateMetadata` time, so an explicit `images` wouldn't match the file.
 */
export const detailMetadata = (
  entry: RegistryEntryMeta,
  opts: { titleSuffix?: string; ownOgImage?: boolean } = {},
): Metadata => {
  const { titleSuffix, ownOgImage } = opts;
  const href = entryHref(entry);
  const url = `${SITE.url}${href}`;
  const pageTitle = titleSuffix ? `${entry.title} ${titleSuffix}` : entry.title;
  const ogTitle = titleSuffix ? `${pageTitle} | ${SITE.name}` : `${pageTitle} - ${SITE.name}`;

  return {
    title: pageTitle,
    description: entry.description,
    keywords: entryKeywords(entry),
    alternates: {
      canonical: href,
      // Both machine reads of this page: the install payload and the Markdown
      // an agent handed the URL fetches instead of parsing the HTML.
      types: {
        'application/json': registryItemPath(DEFAULT_BASE, entry.name),
        'text/markdown': registryMarkdownPath(DEFAULT_BASE, entry.name),
      },
    },
    openGraph: {
      type: 'article',
      url,
      siteName: SITE.name,
      title: ogTitle,
      description: entry.description,
      ...(ownOgImage
        ? {}
        : {
            images: [
              {
                url: '/opengraph-image',
                width: 1200,
                height: 630,
                alt: ogTitle,
              },
            ],
          }),
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: entry.description,
      ...(ownOgImage ? {} : { images: ['/opengraph-image'] }),
    },
  };
};
