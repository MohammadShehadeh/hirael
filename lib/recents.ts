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

export const readRecents = (): RecentItem[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is RecentItem =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as RecentItem).href === 'string' &&
        typeof (item as RecentItem).title === 'string',
    );
  } catch {
    return [];
  }
};

/** Most-recent-first, deduped by href, capped at MAX_RECENTS. */
export const pushRecent = (item: RecentItem): RecentItem[] => {
  const next = [item, ...readRecents().filter((r) => r.href !== item.href)];
  const capped = next.slice(0, MAX_RECENTS);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
  } catch {
    // localStorage unavailable; the session still gets in-memory recency
  }
  return capped;
};
