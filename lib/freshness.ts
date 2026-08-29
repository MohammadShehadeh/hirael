import type { RegistryEntryMeta } from '@/registry/hirael/registry-meta';

/**
 * How long an item wears the "New" badge, in days. Tuned against the release
 * cadence: long enough that a batch stays marked until the next one lands,
 * short enough that the badge still means something.
 */
export const NEW_WINDOW_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Midnight UTC for an ISO `YYYY-MM-DD`, or null if it isn't one. */
const parseDay = (day: string | undefined | null): number | null => {
  if (!day) return null;
  const ms = Date.parse(`${day}T00:00:00Z`);
  return Number.isNaN(ms) ? null : ms;
};

/**
 * Milliseconds left on an item's "New" badge, 0 once it has expired or when
 * no release claims the item. The badge counts down against this rather than
 * reading a boolean, so a page left open past the window drops the badge on
 * its own instead of going stale.
 */
export const newBadgeRemainingMs = (addedAt: string | undefined | null, now = Date.now()): number => {
  const added = parseDay(addedAt);
  if (added === null) return 0;
  return Math.max(0, added + NEW_WINDOW_DAYS * DAY_MS - now);
};

/** A catalog item with the date its release shipped, when a release claims it. */
export interface DatedEntry {
  entry: RegistryEntryMeta;
  addedAt?: string;
}

/** The parts of a detail page resolved on the server: see `lib/detail-extras.ts`. */
export interface DetailExtras {
  addedAt?: string;
  related: DatedEntry[];
}

/** `29 Aug 2026` — fixed to UTC so the server and client agree on the day. */
export const formatDay = (day: string): string =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${day}T00:00:00Z`),
  );
