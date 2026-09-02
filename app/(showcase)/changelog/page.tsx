import type { Metadata } from 'next';

import { ChangelogView } from '@/components/changelog-view';
import { getChangelog } from '@/lib/changelog';
import { listingMetadata } from '@/lib/seo';
import { SITE } from '@/lib/site';

export const metadata: Metadata = listingMetadata({
  path: '/changelog',
  title: 'Changelog',
  description: `Release notes for ${SITE.name}: every version, the components and blocks it added, and the fixes that came with it.`,
});

export default async function ChangelogPage() {
  const changelog = await getChangelog();
  return <ChangelogView {...changelog} />;
}
