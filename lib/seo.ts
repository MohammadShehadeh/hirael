/**
 * schema.org payloads and search metadata derived from the registry. Google
 * reads a component page as an article about a piece of source code, so each
 * detail page ships a TechArticle wrapping a SoftwareSourceCode, sitting under
 * the site-wide WebSite/Organization nodes declared in the root layout.
 *
 * Every page's metadata is built here rather than inline, so canonical shape,
 * title separator and card format can't drift between the routes.
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

/** Matches the root layout's `%s - Hirael` template, for titles built by hand. */
const titled = (text: string) => `${text} - ${SITE.name}`;

const absolute = (path: string) => (path.startsWith('http') ? path : `${SITE.url}${path}`);

/** The site-wide social card, used wherever a route has no image of its own. */
const SITE_OG_IMAGE = '/opengraph-image';

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
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    articleSection: collectionName(entry),
    keywords: entryKeywords(entry).join(', '),
    // The route's own card carries a build hash, so it can't be named here.
    image: absolute(SITE_OG_IMAGE),
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
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: entries.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: entries.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: entry.title,
        url: absolute(entryHref(entry)),
      })),
    },
  };
};

/** The Open Graph and Twitter halves of a page's card, from one description. */
const cards = ({
  url,
  title,
  description,
  ownOgImage,
  type = 'website',
}: {
  url: string;
  title: string;
  description: string;
  /**
   * Drops the site-wide `images` so Next's file-convention resolver fills it
   * in; that URL carries a content hash unknown at `generateMetadata` time.
   */
  ownOgImage?: boolean;
  type?: 'website' | 'article';
}): Pick<Metadata, 'openGraph' | 'twitter'> => ({
  openGraph: {
    type,
    url,
    siteName: SITE.name,
    title,
    description,
    ...(ownOgImage ? {} : { images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: title }] }),
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    ...(ownOgImage ? {} : { images: [SITE_OG_IMAGE] }),
  },
});

/**
 * The component/block/template detail routes, differing only in the noun after
 * the title, which is the phrase people search for alongside the name.
 */
export const detailMetadata = (entry: RegistryEntryMeta, opts: { titleSuffix?: string } = {}): Metadata => {
  const { titleSuffix } = opts;
  const href = entryHref(entry);
  const pageTitle = titleSuffix ? `${entry.title} ${titleSuffix}` : entry.title;

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
    ...cards({
      url: `${SITE.url}${href}`,
      title: titled(pageTitle),
      description: entry.description,
      type: 'article',
      // Every detail route ships an `opengraph-image.tsx` of its own.
      ownOgImage: true,
    }),
  };
};

/** The catalog indexes and category pages, in the shape detail pages use. */
export const listingMetadata = ({
  path,
  title,
  description,
  keywords,
  index = true,
}: {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  /** Off for a page with no items yet. */
  index?: boolean;
}): Metadata => ({
  title,
  description,
  ...(keywords?.length ? { keywords } : {}),
  alternates: { canonical: path },
  ...(index ? {} : { robots: { index: false, follow: true } }),
  ...cards({ url: path === '/' ? SITE.url : `${SITE.url}${path}`, title: titled(title), description }),
});

/**
 * The framed `/embed/*` previews: crawlable on purpose (see `app/robots.ts`)
 * but never ranked. The null canonical matters: inheriting the root layout's
 * `/` would ask Google to fold every frame into the home page.
 */
export const embedMetadata = (title: string): Metadata => ({
  title,
  robots: { index: false, follow: false },
  alternates: { canonical: null },
});
