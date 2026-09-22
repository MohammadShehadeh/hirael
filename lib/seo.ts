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

export const WEBSITE_ID = `${SITE.url}/#website`;
export const ORGANIZATION_ID = `${SITE.url}/#person`;

const titled = (text: string) => `${text} - ${SITE.name}`;

const absolute = (path: string) => (path.startsWith('http') ? path : `${SITE.url}${path}`);

const SITE_OG_IMAGE = '/og.png';

const author = {
  '@type': 'Person',
  '@id': ORGANIZATION_ID,
  name: SITE.author,
  url: SITE.authorUrl,
  sameAs: [SITE.githubUrl],
} as const;

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

const collectionName = (entry: RegistryEntryMeta) =>
  entry.blockKind ? BLOCK_KIND_LABELS[entry.blockKind] : CATEGORY_LABELS[entry.category];

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
    // The route's own card has a build hash, so it cannot be named here.
    image: absolute(SITE_OG_IMAGE),
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

export interface CollectionJsonLdOptions {
  path: string;
  name: string;
  description: string;
  entries: RegistryEntryMeta[];
}

export const collectionJsonLd = ({ path, name, description, entries }: CollectionJsonLdOptions): object => {
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

interface SocialCardOptions {
  url: string;
  title: string;
  description: string;
  /** Omit the shared image so Next uses this route's own card. */
  hasOwnOgImage?: boolean;
  type?: 'website' | 'article';
}

const cards = ({
  url,
  title,
  description,
  hasOwnOgImage,
  type = 'website',
}: SocialCardOptions): Pick<Metadata, 'openGraph' | 'twitter'> => ({
  openGraph: {
    type,
    url,
    siteName: SITE.name,
    title,
    description,
    ...(hasOwnOgImage ? {} : { images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: title }] }),
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    ...(hasOwnOgImage ? {} : { images: [SITE_OG_IMAGE] }),
  },
});

export interface DetailMetadataOptions {
  titleSuffix?: string;
}

export const detailMetadata = (entry: RegistryEntryMeta, options: DetailMetadataOptions = {}): Metadata => {
  const { titleSuffix } = options;
  const href = entryHref(entry);
  const pageTitle = titleSuffix ? `${entry.title} ${titleSuffix}` : entry.title;

  return {
    title: pageTitle,
    description: entry.description,
    keywords: entryKeywords(entry),
    alternates: {
      canonical: href,
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
      hasOwnOgImage: true,
    }),
  };
};

export interface ListingMetadataOptions {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  shouldIndex?: boolean;
}

export const listingMetadata = ({
  path,
  title,
  description,
  keywords,
  shouldIndex = true,
}: ListingMetadataOptions): Metadata => ({
  title,
  description,
  ...(keywords?.length ? { keywords } : {}),
  alternates: { canonical: path },
  ...(shouldIndex ? {} : { robots: { index: false, follow: true } }),
  ...cards({ url: path === '/' ? SITE.url : `${SITE.url}${path}`, title: titled(title), description }),
});

/** Drop the inherited home canonical so search engines do not treat every preview as the home page. */
export const embedMetadata = (title: string): Metadata => ({
  title,
  robots: { index: false, follow: false },
  alternates: { canonical: null },
});
