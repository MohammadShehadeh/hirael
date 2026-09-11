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

const COLLECTION_BY_KIND: Record<CatalogKind, readonly RegistryEntryMeta[]> = {
  templates: TEMPLATES,
  blocks: BLOCKS_ORDERED,
  components: COMPONENTS,
};

export const getDetailExtras = async (entry: RegistryEntryMeta): Promise<DetailExtras> => {
  const dates = await getReleaseDates();

  return {
    addedAt: dates[entry.name],
    related: relatedEntries(entry).map((related) => ({ entry: related, addedAt: dates[related.name] })),
  };
};

const recentlyAdded = (dates: Record<string, string>): DatedEntry[] =>
  REGISTRY.map((entry, index) => ({ entry, addedAt: dates[entry.name], index }))
    .filter((item): item is { entry: RegistryEntryMeta; addedAt: string; index: number } => item.addedAt !== undefined)
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt) || a.index - b.index)
    .map(({ entry, addedAt }) => ({ entry, addedAt }));

export const getLatestCatalog = async (limit: number): Promise<LatestCatalog> => {
  const dates = await getReleaseDates();
  const dated = recentlyAdded(dates);

  const latestOfKind = (kind: CatalogKind): DatedEntry[] => {
    const names = new Set(COLLECTION_BY_KIND[kind].map((entry) => entry.name));
    const fromDates = dated.filter(({ entry }) => names.has(entry.name)).slice(0, limit);
    if (fromDates.length >= limit) return fromDates;

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
