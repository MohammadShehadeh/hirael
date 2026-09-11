import type { RegistryEntryMeta } from '@/registry/hirael/registry-meta';

/** Tuned to the release cadence: long enough that a batch stays marked until the next one lands. */
export const NEW_WINDOW_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;

const parseDay = (day: string | undefined | null): number | null => {
  if (!day) return null;
  const ms = Date.parse(`${day}T00:00:00Z`);
  return Number.isNaN(ms) ? null : ms;
};

export const newBadgeRemainingMs = (addedAt: string | undefined | null, now = Date.now()): number => {
  const added = parseDay(addedAt);
  if (added === null) return 0;
  return Math.max(0, added + NEW_WINDOW_DAYS * DAY_MS - now);
};

export interface DatedEntry {
  entry: RegistryEntryMeta;
  addedAt?: string;
}

export interface DetailExtras {
  addedAt?: string;
  related: DatedEntry[];
}

/** Fixed to UTC so the server and client render the same day. */
export const formatDay = (day: string): string =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${day}T00:00:00Z`),
  );
