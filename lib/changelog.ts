import "server-only"

export type ChangelogSection = {
  heading: string
  items: string[]
}

export type ChangelogRelease = {
  key: string
  version: string
  label: string
  isoDate: string | null
  displayDate: string | null
  summaryTitle: string | null
  summarySections: ChangelogSection[]
}

export type Changelog = {
  releases: ChangelogRelease[]
  totalReleases: number
  lastUpdated: string | null
}

const REPO = "MohammadShehadeh/hirael.com"
const RELEASES_URL = `https://api.github.com/repos/${REPO}/releases?per_page=100`

const RELEASE_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

type GitHubRelease = {
  tag_name: string
  name: string | null
  body: string | null
  draft: boolean
  published_at: string | null
  created_at: string
}

// Optional `<!-- date: YYYY-MM-DD -->` marker in a release body. Lets a
// backfilled/historical release report its real ship date instead of the day
// it was published on GitHub. Invisible in GitHub's rendered notes (HTML
// comment) and skipped by the section parser below.
const DATE_OVERRIDE = /<!--\s*date:\s*(\d{4}-\d{2}-\d{2})\s*-->/

async function fetchReleases(): Promise<GitHubRelease[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }

  // CI builds map the Actions token to this var (see .github/workflows/) so
  // the fetch never hits the 60 req/hr unauthenticated rate limit. For builds
  // elsewhere (e.g. Vercel preview deploys), set it to a fine-grained PAT with
  // public-repo read access.
  if (process.env.GITHUB_TOKEN_HIRAEL) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN_HIRAEL}`
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
  })
  if (!res.ok) return []
  return res.json()
}

// Parse a release body into headed sections. A line ending in `:` opens a new
// section ("Highlights:", "Fixes:"); dash-prefixed lines are its bullets.
function parseSections(body: string | null | undefined): ChangelogSection[] {
  const lines = (body ?? "").split(/\r?\n/).map((line) => line.trim())

  const sections: ChangelogSection[] = []
  let current: ChangelogSection | null = null

  for (const line of lines) {
    if (!line) continue
    if (/^<!--[\s\S]*-->$/.test(line)) continue

    const headingMatch = line.match(/^(.+):$/)
    if (headingMatch) {
      current = { heading: headingMatch[1], items: [] }
      sections.push(current)
      continue
    }

    if (line.startsWith("- ")) {
      if (!current) {
        current = { heading: "Highlights", items: [] }
        sections.push(current)
      }
      current.items.push(line.slice(2).trim())
      continue
    }

    current = { heading: line, items: [] }
    sections.push(current)
  }

  return sections.filter(
    (section) => section.heading || section.items.length > 0
  )
}

function releaseToChangelog(release: GitHubRelease): ChangelogRelease | null {
  if (release.draft) return null
  if (!/^v?\d+\.\d+\.\d+/.test(release.tag_name)) return null

  const dateString =
    release.body?.match(DATE_OVERRIDE)?.[1] ??
    release.published_at ??
    release.created_at
  const isoDate = dateString ? new Date(dateString).toISOString() : null

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
  }
}

function compareSemver(a: string, b: string): number {
  const parse = (v: string) =>
    v
      .replace(/^v/, "")
      .split(".")
      .map((n) => Number.parseInt(n, 10) || 0)
  const [aMajor, aMinor, aPatch] = parse(a)
  const [bMajor, bMinor, bPatch] = parse(b)
  return bMajor - aMajor || bMinor - aMinor || bPatch - aPatch
}

export async function getChangelog(): Promise<Changelog> {
  let releases: ChangelogRelease[]
  try {
    const raw = await fetchReleases()
    releases = raw
      .map(releaseToChangelog)
      .filter((release): release is ChangelogRelease => release !== null)
  } catch {
    releases = []
  }

  releases.sort((a, b) => compareSemver(a.version, b.version))

  return {
    releases,
    totalReleases: releases.length,
    lastUpdated: releases[0]?.displayDate ?? null,
  }
}
