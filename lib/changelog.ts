import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface ChangelogEntry {
  slug: string;
  title: string;
  version: string | null;
  isoDate: string;
  displayDate: string;
  description: string | null;
  added: string[];
  body: string;
}

export interface Changelog {
  entries: ChangelogEntry[];
  lastUpdated: string | null;
  latestSlug: string | null;
}

const addedNames = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((name): name is string => typeof name === 'string') : [];

const CHANGELOG_DIR = path.join(process.cwd(), 'content', 'changelog');

/** Newest first. Same-day releases sort by version, so 6.10 stays after 6.9. */
const byNewest = (a: ChangelogEntry, b: ChangelogEntry): number => {
  if (a.isoDate !== b.isoDate) return a.isoDate < b.isoDate ? 1 : -1;
  return (b.version ?? '').localeCompare(a.version ?? '', 'en', { numeric: true });
};

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Read once at build time. There is no server to refresh it later. */
export const getChangelog = async (): Promise<Changelog> => {
  let files: string[] = [];
  try {
    files = fs.readdirSync(CHANGELOG_DIR).filter((f) => f.endsWith('.mdx'));
  } catch {
    return { entries: [], lastUpdated: null, latestSlug: null };
  }

  const entries: ChangelogEntry[] = files
    .flatMap((file) => {
      const raw = fs.readFileSync(path.join(CHANGELOG_DIR, file), 'utf8');
      const { data, content } = matter(raw);
      const parsed = data.date ? new Date(data.date) : null;
      if (!parsed || Number.isNaN(parsed.getTime())) return [];
      const isoDate = parsed.toISOString();
      return [
        {
          slug: file.replace(/\.mdx$/, ''),
          title: String(data.title ?? file.replace(/\.mdx$/, '')),
          version: data.version != null ? String(data.version) : null,
          isoDate,
          displayDate: DATE_FORMATTER.format(parsed),
          description: data.description != null ? String(data.description) : null,
          added: addedNames(data.added),
          body: content.trim(),
        },
      ];
    })
    .sort(byNewest);

  return {
    entries,
    lastUpdated: entries[0]?.displayDate ?? null,
    latestSlug: entries[0]?.slug ?? null,
  };
};

/** Dates come from each release's `added` list. The oldest release wins when an item is listed twice. */
export const getReleaseDates = async (): Promise<Record<string, string>> => {
  const { entries } = await getChangelog();
  const dates: Record<string, string> = {};

  for (const entry of [...entries].reverse()) {
    const day = entry.isoDate.slice(0, 10);
    for (const name of entry.added) dates[name] ??= day;
  }

  return dates;
};
