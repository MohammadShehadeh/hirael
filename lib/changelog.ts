import 'server-only';

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface ChangelogEntry {
  /** File basename without extension, e.g. `2026-08-initial-release`. */
  slug: string;
  title: string;
  /** Version label shown as the entry heading; falls back to the title. */
  version: string | null;
  isoDate: string;
  displayDate: string;
  description: string | null;
  /**
   * Registry item names the release added, e.g. `['hero-10', 'footer-06']`.
   * Optional in frontmatter; drives the "New" badge and the landing page's
   * recently-added rail through {@link getReleaseDates}.
   */
  added: string[];
  /** Raw MDX body, compiled by the view. */
  body: string;
}

export interface Changelog {
  entries: ChangelogEntry[];
  lastUpdated: string | null;
  latestSlug: string | null;
}

/** Registry item names a release shipped, from its `added` frontmatter. */
const addedNames = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((name): name is string => typeof name === 'string') : [];

const CHANGELOG_DIR = path.join(process.cwd(), 'content', 'changelog');

const DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

/**
 * Reads `content/changelog/*.mdx` at build (output: "export" — no server or
 * ISR), newest first by frontmatter `date`. Each file's frontmatter carries
 * `title`, `date` (YYYY-MM-DD) and optional `version`/`description`; the MDX
 * body renders in `ChangelogView`. Entries without a valid date are dropped.
 */
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
    .sort((a, b) => (a.isoDate < b.isoDate ? 1 : -1));

  return {
    entries,
    lastUpdated: entries[0]?.displayDate ?? null,
    latestSlug: entries[0]?.slug ?? null,
  };
};

/**
 * When each registry item shipped, as an ISO `YYYY-MM-DD`, read from the
 * `added` list in each release's frontmatter.
 *
 * The changelog is already the record of what shipped when, and writing an
 * entry is already part of cutting a release, so listing the item names there
 * keeps this to one line per release instead of a per-item table that has to
 * be regenerated. An item no release claims simply has no date: it wears no
 * badge and stays out of the recently-added rail, which is the right answer
 * for everything that predates the practice.
 */
export const getReleaseDates = async (): Promise<Record<string, string>> => {
  const { entries } = await getChangelog();
  const dates: Record<string, string> = {};

  // Oldest release first, so an item listed twice keeps the date it first
  // shipped rather than the date it was last mentioned.
  for (const entry of [...entries].reverse()) {
    const day = entry.isoDate.slice(0, 10);
    for (const name of entry.added) dates[name] ??= day;
  }

  return dates;
};
