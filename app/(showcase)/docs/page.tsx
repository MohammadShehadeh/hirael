import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { DocsPage } from '@/components/docs-page';
import { getDoc } from '@/lib/docs';
import { listingMetadata } from '@/lib/seo';

const doc = getDoc('');

export const metadata: Metadata = listingMetadata({
  path: '/docs',
  title: 'Docs',
  description: doc?.description ?? '',
});

export default function DocsHomeRoute() {
  if (!doc) notFound();

  return <DocsPage doc={doc} />;
}
