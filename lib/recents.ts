'use client';

export type RecentKind = 'component' | 'block' | 'template';

export interface RecentItem {
  name: string;
  title: string;
  href: string;
  kind: RecentKind;
}

const STORAGE_KEY = 'hirael:recent-items';
const MAX_RECENTS = 5;

const NO_RECENTS: RecentItem[] = [];
const listeners = new Set<() => void>();

/**
 * Snapshot cached against the raw string: `useSyncExternalStore` needs the same
 * reference back for an unchanged value, and JSON.parse never gives one.
 */
let cache: { raw: string | null; value: RecentItem[] } | null = null;

/** Set only when localStorage refused the write, and from then on the answer. */
let memory: RecentItem[] | null = null;

const read = (): string | null => {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const parse = (raw: string | null): RecentItem[] => {
  if (!raw) return NO_RECENTS;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return NO_RECENTS;
    return parsed.filter(
      (item): item is RecentItem =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as RecentItem).href === 'string' &&
        typeof (item as RecentItem).title === 'string',
    );
  } catch {
    return NO_RECENTS;
  }
};

export const subscribeRecents = (onStoreChange: () => void) => {
  listeners.add(onStoreChange);
  window.addEventListener('storage', onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
};

export const recentsSnapshot = (): RecentItem[] => {
  if (memory) return memory;
  const raw = read();
  if (cache?.raw === raw) return cache.value;
  cache = { raw, value: parse(raw) };
  return cache.value;
};

/** Nothing is known about the visitor's storage on the server. */
export const serverRecents = (): RecentItem[] => NO_RECENTS;

/** Most-recent-first, deduped by href, capped at MAX_RECENTS. */
export const pushRecent = (item: RecentItem): RecentItem[] => {
  const capped = [item, ...recentsSnapshot().filter((r) => r.href !== item.href)].slice(0, MAX_RECENTS);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
  } catch {
    memory = capped;
  }
  for (const listener of listeners) listener();
  return capped;
};
