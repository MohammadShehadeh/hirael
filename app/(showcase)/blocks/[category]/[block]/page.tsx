import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { CATEGORY_BY_SLUG } from '@/components/block-categories';
import { ComponentPage } from '@/components/component-page';
import { EntryJsonLd } from '@/components/entry-json-ld';
import { getDetailExtras } from '@/lib/detail-extras';
import { loadSources } from '@/lib/registry-source';
import { detailMetadata } from '@/lib/seo';
import { REGISTRY, REGISTRY_BY_NAME, entryCategorySlug } from '@/registry/hirael/registry-meta';

export const dynamicParams = false;

export function generateStaticParams() {
  return REGISTRY.filter((entry) => entry.category === 'blocks').map((entry) => ({
    category: entryCategorySlug(entry),
    block: entry.name,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; block: string }>;
}): Promise<Metadata> {
  const { category, block } = await params;
  const entry = REGISTRY_BY_NAME[block];
  if (!entry || entry.category !== 'blocks' || entryCategorySlug(entry) !== category) return {};
  return detailMetadata(entry, { titleSuffix: 'block' });
}

export default async function BlockRoute({ params }: { params: Promise<{ category: string; block: string }> }) {
  const { category, block } = await params;
  const entry = REGISTRY_BY_NAME[block];
  if (!entry || entry.category !== 'blocks' || entryCategorySlug(entry) !== category) notFound();
  const [sources, extras] = await Promise.all([loadSources(entry.files?.map((f) => f.path)), getDetailExtras(entry)]);
  const meta = CATEGORY_BY_SLUG[category];
  const breadcrumb = [
    { label: 'Blocks', href: '/blocks' },
    { label: meta?.title ?? category, href: `/blocks/${category}` },
    { label: entry.title },
  ];
  return (
    <>
      <EntryJsonLd entry={entry} breadcrumb={breadcrumb} addedAt={extras.addedAt} />
      <ComponentPage entry={entry} sources={sources} breadcrumb={breadcrumb} extras={extras} />
    </>
  );
}
