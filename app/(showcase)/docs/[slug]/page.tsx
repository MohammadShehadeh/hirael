import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { DocsPage } from '@/components/docs-page';
import { getDoc } from '@/lib/docs';
import { DOC_PAGES, docHref } from '@/lib/docs-nav';
import { listingMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return DOC_PAGES.filter((page) => page.slug).map((page) => ({ slug: page.slug }));
}

interface DocRouteParams {
  slug: string;
}

interface DocRouteProps {
  params: Promise<DocRouteParams>;
}

export async function generateMetadata({ params }: DocRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return {};

  return listingMetadata({ path: docHref(slug), title: doc.title, description: doc.description });
}

export default async function DocRoute({ params }: DocRouteProps) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  return <DocsPage doc={doc} />;
}
