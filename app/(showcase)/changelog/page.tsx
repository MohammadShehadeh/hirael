import type { Metadata } from 'next';

import { ChangelogView } from '@/components/changelog-view';
import { getChangelog } from '@/lib/changelog';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Changelog',
  description: `Release notes for ${SITE.name}: new components, blocks, fixes, and polish.`,
  alternates: { canonical: '/changelog' },
};

export default async function ChangelogPage() {
  const changelog = await getChangelog();
  return <ChangelogView {...changelog} />;
}
