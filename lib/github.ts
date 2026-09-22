import 'server-only';

const REPO = 'MohammadShehadeh/hirael';
const REPO_API_URL = `https://api.github.com/repos/${REPO}`;

/** Returns null on failure so the build never breaks over a star count. */
export const getRepoStars = async (): Promise<number | null> => {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (process.env.GITHUB_TOKEN_HIRAEL) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN_HIRAEL}`;
  }

  try {
    const res = await fetch(REPO_API_URL, { headers, cache: 'force-cache' });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
  } catch {
    return null;
  }
};
