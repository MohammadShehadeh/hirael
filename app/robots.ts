import type { MetadataRoute } from 'next';

import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * `/embed/*` is deliberately not disallowed: a robots.txt disallow would stop Google from fetching those pages, so
 * their `noindex` would go unseen and a Safe Browsing review (the auth embeds were once flagged as phishing) could
 * not verify them.
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
