import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { ComponentPage } from '@/components/component-page';
import { loadSources } from '@/lib/registry-source';
import { detailMetadata } from '@/lib/site';
import { REGISTRY, REGISTRY_BY_NAME } from '@/registry/hirael/registry-meta';

export const dynamicParams = false;

export function generateStaticParams() {
  return REGISTRY.filter((entry) => entry.category === 'templates').map((entry) => ({ template: entry.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ template: string }> }): Promise<Metadata> {
  const { template } = await params;
  const entry = REGISTRY_BY_NAME[template];
  if (!entry || entry.category !== 'templates') return {};
  return detailMetadata(entry, { titleSuffix: 'template' });
}

export default async function TemplateRoute({ params }: { params: Promise<{ template: string }> }) {
  const { template } = await params;
  const entry = REGISTRY_BY_NAME[template];
  if (!entry || entry.category !== 'templates') notFound();
  const sources = await loadSources(entry.files?.map((f) => f.path));
  return (
    <ComponentPage
      entry={entry}
      sources={sources}
      breadcrumb={[{ label: 'Templates', href: '/templates' }, { label: entry.title }]}
    />
  );
}
