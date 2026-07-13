import "server-only";

export type ChangelogSection = {
  heading: string;
  items: string[];
};

export type ChangelogRelease = {
  key: string;
  version: string;
  label: string;
  isoDate: string | null;
  displayDate: string | null;
  summaryTitle: string | null;
  summarySections: ChangelogSection[];
};

export type Changelog = {
  releases: ChangelogRelease[];
  totalReleases: number;
  lastUpdated: string | null;
  latestKey: string | null;
};

const REPO = "MohammadShehadeh/hirael.com";
const RELEASES_URL = `https://api.github.com/repos/${REPO}/releases?per_page=100`;

const RELEASE_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

type GitHubRelease = {
  tag_name: string;
  name: string | null;
  body: string | null;
  draft: boolean;
  published_at: string | null;
  created_at: string;
};

// Optional `<!-- date: YYYY-MM-DD -->` marker in a release body. Lets a
// backfilled/historical release report its real ship date instead of the day
// it was published on GitHub. Invisible in GitHub's rendered notes (HTML
// comment) and skipped by the section parser below.
const DATE_OVERRIDE = /<!--\s*date:\s*(\d{4}-\d{2}-\d{2})\s*-->/;

async function fetchReleases(): Promise<GitHubRelease[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // CI builds map the Actions token to this var (see .github/workflows/) so
  // the fetch never hits the 60 req/hr unauthenticated rate limit. For builds
  // elsewhere (e.g. Vercel preview deploys), set it to a fine-grained PAT with
  // public-repo read access.
  if (process.env.GITHUB_TOKEN_HIRAEL) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN_HIRAEL}`;
  }

  // This fetch runs once during `next build` and the rendered page is frozen
  // into the static export (output: "export" — there is no server or ISR to
  // refresh it). That's fresh enough: production only deploys when a GitHub
  // Release is published, and this fetch runs during that very build, so the
  // page always includes the release that shipped it. Post-publish edits to
  // release notes show up on the next release.
  const res = await fetch(RELEASES_URL, {
    headers,
    cache: "force-cache",
  });
  if (!res.ok) return [];
  return res.json();
}

// Parse a release body into headed sections. A line ending in `:` opens a new
// section ("Highlights:", "Fixes:"); dash-prefixed lines are its bullets.
function parseSections(body: string | null | undefined): ChangelogSection[] {
  const lines = (body ?? "").split(/\r?\n/).map((line) => line.trim());

  const sections: ChangelogSection[] = [];
  let current: ChangelogSection | null = null;

  for (const line of lines) {
    if (!line) continue;
    if (/^<!--[\s\S]*-->$/.test(line)) continue;

    const headingMatch = !line.startsWith("- ") ? line.match(/^(.+):$/) : null;
    if (headingMatch) {
      current = { heading: headingMatch[1], items: [] };
      sections.push(current);
      continue;
    }

    // Any non-heading line is an item of the current section. Bullets drop
    // their "- " marker; a stray prose line (or a body with no heading at
    // all) falls under an implicit "Highlights" section rather than becoming
    // its own empty, dangling heading.
    if (!current) {
      current = { heading: "Highlights", items: [] };
      sections.push(current);
    }
    current.items.push(line.startsWith("- ") ? line.slice(2).trim() : line);
  }

  return sections.filter((section) => section.items.length > 0);
}

function releaseToChangelog(release: GitHubRelease): ChangelogRelease | null {
  // Guards against one malformed release (e.g. an unparseable date) taking
  // down the whole changelog: any unexpected error here just drops this
  // release, the rest of the .map/.filter in getChangelog is unaffected.
  try {
    if (release.draft) return null;
    if (!/^v?\d+\.\d+\.\d+/.test(release.tag_name)) return null;

    const dateString =
      release.body?.match(DATE_OVERRIDE)?.[1] ??
      release.published_at ??
      release.created_at;
    const parsedDate = dateString ? new Date(dateString) : null;
    const isoDate =
      parsedDate && !Number.isNaN(parsedDate.getTime())
        ? parsedDate.toISOString()
        : null;

    return {
      key: release.tag_name,
      version: release.tag_name,
      label: release.tag_name.replace(/^v/, ""),
      isoDate,
      displayDate: isoDate
        ? RELEASE_DATE_FORMATTER.format(new Date(isoDate))
        : null,
      summaryTitle: release.name?.trim() || release.tag_name,
      summarySections: parseSections(release.body),
    };
  } catch {
    return null;
  }
}

function compareSemver(a: string, b: string): number {
  const parse = (v: string) => {
    const [core, prerelease = ""] = v.replace(/^v/, "").split("-");
    const [major, minor, patch] = core
      .split(".")
      .map((n) => Number.parseInt(n, 10) || 0);
    return { major, minor, patch, prerelease };
  };
  const pa = parse(a);
  const pb = parse(b);
  const core =
    pb.major - pa.major || pb.minor - pa.minor || pb.patch - pa.patch;
  if (core) return core;
  // Same x.y.z: a final release outranks its prereleases (1.4.0 before
  // 1.4.0-rc.1); between two prereleases, sort the labels descending.
  if (pa.prerelease === pb.prerelease) return 0;
  if (!pa.prerelease) return -1;
  if (!pb.prerelease) return 1;
  return pb.prerelease.localeCompare(pa.prerelease);
}

export async function getChangelog(): Promise<Changelog> {
  let releases: ChangelogRelease[];
  try {
    const raw = await fetchReleases();
    releases = raw
      .map(releaseToChangelog)
      .filter((release): release is ChangelogRelease => release !== null);
  } catch {
    releases = [];
  }

  releases.sort((a, b) => compareSemver(a.version, b.version));

  // "Updated" is the most recently shipped release by date, not the highest
  // version — a backported patch can ship after a newer major, and ISO dates
  // compare chronologically as strings.
  const mostRecent = releases.reduce<ChangelogRelease | null>((latest, r) => {
    if (!r.isoDate) return latest;
    if (!latest?.isoDate || r.isoDate > latest.isoDate) return r;
    return latest;
  }, null);

  const latest = mostRecent ?? releases[0] ?? null;

  return {
    releases,
    totalReleases: releases.length,
    lastUpdated: latest?.displayDate ?? null,
    latestKey: latest?.key ?? null,
  };
}
