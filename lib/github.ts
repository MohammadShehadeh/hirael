import 'server-only';

/** Fetched once at `next build` and frozen into the export. Returns null on failure so the build never breaks over a star count. */
export const getRepoStars = async (): Promise<number | null> => {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(process.env.GITHUB_TOKEN_HIRAEL && {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN_HIRAEL}`,
      }),
    };

    const res = await fetch('https://api.github.com/repos/MohammadShehadeh/hirael', { headers, cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();

    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
  } catch {
    return null;
  }
};
