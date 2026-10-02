import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { RegistryItemDetail, registryItemMetadata } from '@/components/registry-item-detail';
import { CATEGORY_LABELS, COMPONENTS, REGISTRY_BY_NAME, isComponentEntry } from '@/registry/hirael/registry-meta';

export const dynamicParams = false;

export function generateStaticParams() {
  return COMPONENTS.map((entry) => ({
    category: entry.category,
    component: entry.name,
  }));
}

interface ComponentRouteProps {
  params: Promise<{ category: string; component: string }>;
}

const findEntry = (category: string, component: string) => {
  const entry = REGISTRY_BY_NAME[component];

  return entry && isComponentEntry(entry) && entry.category === category ? entry : null;
};

export async function generateMetadata({ params }: ComponentRouteProps): Promise<Metadata> {
  const { category, component } = await params;
  const entry = findEntry(category, component);

  return entry ? registryItemMetadata(entry) : {};
}

export default async function ComponentRoute({ params }: ComponentRouteProps) {
  const { category, component } = await params;
  const entry = findEntry(category, component);
  if (!entry) notFound();

  return (
    <RegistryItemDetail
      entry={entry}
      breadcrumb={[
        { label: 'Components', href: '/components' },
        { label: CATEGORY_LABELS[entry.category], href: `/components/${entry.category}` },
        { label: entry.title },
      ]}
    />
  );
}
