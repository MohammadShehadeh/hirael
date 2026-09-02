import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { CategoryPage } from '@/components/category-page';
import { CATEGORY_BY_SLUG, CATEGORY_REGISTRY } from '@/components/block-categories';
import { CollectionJsonLd } from '@/components/collection-json-ld';
import { listingMetadata } from '@/lib/seo';
import { BLOCKS_BY_KIND } from '@/registry/hirael/registry-meta';

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORY_REGISTRY.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_BY_SLUG[category];
  if (!meta) return {};
  const label = meta.title.toLowerCase();

  return listingMetadata({
    path: `/blocks/${meta.slug}`,
    title: `${meta.title} blocks`,
    description: meta.description,
    keywords: [`${label} blocks`, `react ${label}`, `tailwind ${label}`, 'shadcn blocks'],
    // A category with nothing shipped is roadmap copy, not an index entry.
    index: !meta.comingSoon,
  });
}

export default async function BlockCategoryRoute({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const meta = CATEGORY_BY_SLUG[category];
  if (!meta) notFound();
  const blocks = meta.blockKind ? BLOCKS_BY_KIND[meta.blockKind] : [];

  return (
    <>
      {blocks.length > 0 && (
        <CollectionJsonLd
          id={`blocks-${meta.slug}`}
          path={`/blocks/${meta.slug}`}
          name={`${meta.title} blocks`}
          description={meta.description}
          entries={blocks}
          breadcrumb={[{ label: 'Blocks', href: '/blocks' }, { label: meta.title }]}
        />
      )}
      <CategoryPage category={meta} />
    </>
  );
}
