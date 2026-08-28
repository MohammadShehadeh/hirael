import type { MetadataRoute } from 'next';

import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * `/embed/*` is deliberately NOT disallowed here even though it should
 * never rank: the embed pages carry `robots: { index: false }` metadata,
 * and a robots.txt disallow would stop Google from ever fetching them —
 * so the noindex would go unseen, and a Safe Browsing security review
 * (the auth block embeds were once flagged as phishing) couldn't verify
 * the pages either. Keeping them crawlable but noindexed does both jobs.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
