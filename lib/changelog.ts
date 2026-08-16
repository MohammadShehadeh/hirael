import "server-only";

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ChangelogEntry = {
  /** File basename without extension, e.g. `2026-08-initial-release`. */
  slug: string;
  title: string;
  /** Version label shown as the entry heading; falls back to the title. */
  version: string | null;
  isoDate: string;
  displayDate: string;
  description: string | null;
  /** Raw MDX body, compiled by the view. */
  body: string;
};

export type Changelog = {
  entries: ChangelogEntry[];
  lastUpdated: string | null;
  latestSlug: string | null;
};

const CHANGELOG_DIR = path.join(process.cwd(), "content", "changelog");

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Reads `content/changelog/*.mdx` at build (output: "export" — no server or
 * ISR), newest first by frontmatter `date`. Each file's frontmatter carries
 * `title`, `date` (YYYY-MM-DD) and optional `version`/`description`; the MDX
 * body renders in `ChangelogView`. Entries without a valid date are dropped.
 */
export async function getChangelog(): Promise<Changelog> {
  let files: string[] = [];
  try {
    files = fs.readdirSync(CHANGELOG_DIR).filter((f) => f.endsWith(".mdx"));
  } catch {
    return { entries: [], lastUpdated: null, latestSlug: null };
  }

  const entries: ChangelogEntry[] = files
    .flatMap((file) => {
      const raw = fs.readFileSync(path.join(CHANGELOG_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const parsed = data.date ? new Date(data.date) : null;
      if (!parsed || Number.isNaN(parsed.getTime())) return [];
      const isoDate = parsed.toISOString();
      return [
        {
          slug: file.replace(/\.mdx$/, ""),
          title: String(data.title ?? file.replace(/\.mdx$/, "")),
          version: data.version != null ? String(data.version) : null,
          isoDate,
          displayDate: DATE_FORMATTER.format(parsed),
          description: data.description != null ? String(data.description) : null,
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
}
