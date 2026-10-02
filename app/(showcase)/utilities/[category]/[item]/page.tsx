import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { RegistryItemDetail, registryItemMetadata } from '@/components/registry-item-detail';
import { REGISTRY_BY_NAME, UTILITIES, UTILITY_KIND_LABELS, utilityKind } from '@/registry/hirael/registry-meta';

export const dynamicParams = false;

export function generateStaticParams() {
  return UTILITIES.map((entry) => ({ category: utilityKind(entry), item: entry.name }));
}

interface UtilityRouteProps {
  params: Promise<{ category: string; item: string }>;
}

const findEntry = (category: string, item: string) => {
  const entry = REGISTRY_BY_NAME[item];

  return entry?.category === 'utilities' && utilityKind(entry) === category ? entry : null;
};

export async function generateMetadata({ params }: UtilityRouteProps): Promise<Metadata> {
  const { category, item } = await params;
  const entry = findEntry(category, item);

  return entry ? registryItemMetadata(entry) : {};
}

export default async function UtilityRoute({ params }: UtilityRouteProps) {
  const { category, item } = await params;
  const entry = findEntry(category, item);
  if (!entry) notFound();
  const kind = utilityKind(entry);

  return (
    <RegistryItemDetail
      entry={entry}
      breadcrumb={[
        { label: 'Hooks & utilities', href: '/utilities' },
        { label: UTILITY_KIND_LABELS[kind], href: `/utilities/${kind}` },
        { label: entry.title },
      ]}
    />
  );
}
