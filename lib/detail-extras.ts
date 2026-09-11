import 'server-only';

import { getReleaseDates } from '@/lib/changelog';
import type { DatedEntry, DetailExtras } from '@/lib/freshness';
import { relatedEntries } from '@/lib/related';
import {
  BLOCKS_ORDERED,
  COMPONENTS,
  REGISTRY,
  TEMPLATES,
  type RegistryEntryMeta,
} from '@/registry/hirael/registry-meta';

export type CatalogKind = 'templates' | 'blocks' | 'components';

export type LatestCatalog = Record<CatalogKind, DatedEntry[]>;

/** The catalog's three collections; membership here is what defines a kind. */
const COLLECTION_BY_KIND: Record<CatalogKind, readonly RegistryEntryMeta[]> = {
  templates: TEMPLATES,
  blocks: BLOCKS_ORDERED,
  components: COMPONENTS,
};

/**
 * The two things a detail page needs that aren't in registry-meta: when the
 * item shipped, and what to read next.
 *
 * Resolved on the server because the ship dates come from the changelog files.
 * That also keeps the related-items scoring, which reads the whole catalog,
 * out of the client bundle.
 */
export const getDetailExtras = async (entry: RegistryEntryMeta): Promise<DetailExtras> => {
  const dates = await getReleaseDates();

  return {
    addedAt: dates[entry.name],
    related: relatedEntries(entry).map((related) => ({ entry: related, addedAt: dates[related.name] })),
  };
};

/**
 * Every item a release claims, newest first. Ordered by release date with
 * catalog order breaking ties, so one release's items read in the order the
 * catalog lists them rather than by name.
 */
const recentlyAdded = (dates: Record<string, string>): DatedEntry[] =>
  REGISTRY.map((entry, index) => ({ entry, addedAt: dates[entry.name], index }))
    .filter((item): item is { entry: RegistryEntryMeta; addedAt: string; index: number } => item.addedAt !== undefined)
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt) || a.index - b.index)
    .map(({ entry, addedAt }) => ({ entry, addedAt }));

/**
 * Latest items in each catalog collection, for the landing-page first screen.
 * Dated items from the changelog win; if a collection has fewer dated entries
 * than `limit`, its undated items fill the rest, newest in `REGISTRY` first.
 */
export const getLatestCatalog = async (limit: number): Promise<LatestCatalog> => {
  const dates = await getReleaseDates();
  const dated = recentlyAdded(dates);

  const latestOfKind = (kind: CatalogKind): DatedEntry[] => {
    const names = new Set(COLLECTION_BY_KIND[kind].map((entry) => entry.name));
    const fromDates = dated.filter(({ entry }) => names.has(entry.name)).slice(0, limit);
    if (fromDates.length >= limit) return fromDates;

    // Fewer dated items than `limit` means `fromDates` already holds every
    // dated item of the kind, so the padding is exactly the undated ones.
    const undated = REGISTRY.filter((entry) => names.has(entry.name) && dates[entry.name] === undefined)
      .reverse()
      .slice(0, limit - fromDates.length)
      .map((entry) => ({ entry }));

    return [...fromDates, ...undated];
  };

  return {
    templates: latestOfKind('templates'),
    blocks: latestOfKind('blocks'),
    components: latestOfKind('components'),
  };
};
