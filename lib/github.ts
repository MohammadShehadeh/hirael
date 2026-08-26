import "server-only";

// Public repo behind the header star count. Distinct from the changelog's
// release source (lib/changelog.ts) — update both if the canonical repo moves.
const REPO = "MohammadShehadeh/hirael";
const REPO_API_URL = `https://api.github.com/repos/${REPO}`;

/**
 * Star count for the header badge. Fetched once at `next build` and frozen
 * into the static export (output: "export" — no server or ISR), mirroring the
 * changelog fetch; refreshes on the next release build. Returns null on any
 * failure, so the header omits the badge rather than breaking the build.
 */
export const getRepoStars = async (): Promise<number | null> => {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // Same CI/preview token as the changelog fetch; keeps builds off the
  // 60 req/hr unauthenticated rate limit (see lib/changelog.ts).
  if (process.env.GITHUB_TOKEN_HIRAEL) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN_HIRAEL}`;
  }

  try {
    const res = await fetch(REPO_API_URL, { headers, cache: "force-cache" });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
};
