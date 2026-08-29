import 'server-only';

import { getReleaseDates } from '@/lib/changelog';
import type { DatedEntry, DetailExtras } from '@/lib/freshness';
import { relatedEntries } from '@/lib/related';
import { REGISTRY, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

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
 * The most recently shipped items, newest first, for the landing page rail.
 * Ordered by release date with catalog order breaking ties, so one release's
 * items read in the order the catalog lists them rather than by name.
 */
export const getRecentlyAdded = async (limit: number): Promise<DatedEntry[]> => {
  const dates = await getReleaseDates();

  return REGISTRY.map((entry, index) => ({ entry, addedAt: dates[entry.name], index }))
    .filter((item): item is { entry: RegistryEntryMeta; addedAt: string; index: number } => item.addedAt !== undefined)
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt) || a.index - b.index)
    .slice(0, limit)
    .map(({ entry, addedAt }) => ({ entry, addedAt }));
};
