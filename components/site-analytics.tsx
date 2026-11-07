'use client';

import { usePathname } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';

import { isEmbedPath } from '@/lib/customizer';

interface SiteAnalyticsProps {
  gaId: string;
}

/** Skips `/embed/*`: every preview iframe on a gallery page would otherwise count as a page view of its own. */
export const SiteAnalytics = ({ gaId }: SiteAnalyticsProps) => {
  const pathname = usePathname();
  if (isEmbedPath(pathname ?? '')) return null;

  return <GoogleAnalytics gaId={gaId} />;
};
