import 'server-only';

import { z } from 'zod';

const buildStamp = String(Date.now());

const repoSchema = z.object({ stargazers_count: z.number() });

/** Fetched once at `next build` and frozen into the export. Returns null on failure so the build never breaks over a star count. */
export const getRepoStars = async (): Promise<number | null> => {
  if (process.env.NODE_ENV === 'development') return null;

  try {
    const res = await fetch('https://api.github.com/repos/MohammadShehadeh/hirael', {
      headers: { 'x-build-stamp': buildStamp },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;
    const repo = repoSchema.safeParse(await res.json());

    return repo.success ? repo.data.stargazers_count : null;
  } catch {
    return null;
  }
};
