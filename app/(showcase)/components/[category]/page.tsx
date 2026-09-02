import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { CollectionJsonLd } from '@/components/collection-json-ld';
import { ComponentCategoryPage } from '@/components/component-category-page';
import { listingMetadata } from '@/lib/seo';
import {
  CATEGORY_LABELS,
  COMPONENT_CATEGORY_DESCRIPTIONS,
  COMPONENT_CATEGORY_ORDER,
  REGISTRY_BY_CATEGORY,
} from '@/registry/hirael/registry-meta';

type ComponentCategory = (typeof COMPONENT_CATEGORY_ORDER)[number];

export const dynamicParams = false;

function isComponentCategory(value: string): value is ComponentCategory {
  return (COMPONENT_CATEGORY_ORDER as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return COMPONENT_CATEGORY_ORDER.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  if (!isComponentCategory(category)) return {};
  const label = CATEGORY_LABELS[category];

  return listingMetadata({
    path: `/components/${category}`,
    title: `${label} components`,
    description: COMPONENT_CATEGORY_DESCRIPTIONS[category],
    keywords: [`${label.toLowerCase()} components`, `react ${label.toLowerCase()}`, 'shadcn registry'],
  });
}

export default async function ComponentCategoryRoute({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!isComponentCategory(category)) notFound();
  const label = CATEGORY_LABELS[category];

  return (
    <>
      <CollectionJsonLd
        id={`components-${category}`}
        path={`/components/${category}`}
        name={`${label} components`}
        description={COMPONENT_CATEGORY_DESCRIPTIONS[category]}
        entries={REGISTRY_BY_CATEGORY[category]}
        breadcrumb={[{ label: 'Components', href: '/components' }, { label }]}
      />
      <ComponentCategoryPage category={category} />
    </>
  );
}
