import type { MetadataRoute } from 'next';

import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * Previews stay crawlable. Blocking them would hide their noindex tag, and Safe Browsing
 * could not recheck the login demos it once flagged as phishing.
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
