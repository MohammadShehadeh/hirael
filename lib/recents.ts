'use client';

// The mini build keeps the parser out of the shared client bundle's weight.
import * as z from 'zod/mini';

const recentItemSchema = z.object({
  name: z.string(),
  title: z.string(),
  href: z.string(),
  kind: z.enum(['component', 'block', 'template']),
});

export type RecentItem = z.infer<typeof recentItemSchema>;
export type RecentKind = RecentItem['kind'];

const STORAGE_KEY = 'hirael:recent-items';
const MAX_RECENTS = 5;

const NO_RECENTS: RecentItem[] = [];
const listeners = new Set<() => void>();

/** Keep the last parsed list. A fresh parse would be a new array and look like a change. */
let cache: { raw: string | null; value: RecentItem[] } | null = null;

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

    return parsed.flatMap((item) => {
      const result = recentItemSchema.safeParse(item);

      return result.success ? [result.data] : [];
    });
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

export const serverRecents = (): RecentItem[] => NO_RECENTS;

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
