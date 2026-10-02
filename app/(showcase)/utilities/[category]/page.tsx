import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { CollectionJsonLd } from '@/components/collection-json-ld';
import { DemoCard } from '@/components/demo-card';
import { listingMetadata } from '@/lib/seo';
import {
  UTILITIES_BY_KIND,
  UTILITY_KIND_DESCRIPTIONS,
  UTILITY_KIND_LABELS,
  UTILITY_KIND_ORDER,
  type UtilityKind,
} from '@/registry/hirael/registry-meta';

export const dynamicParams = false;

export function generateStaticParams() {
  return UTILITY_KIND_ORDER.map((category) => ({ category }));
}

interface UtilityCategoryRouteProps {
  params: Promise<{ category: string }>;
}

const isUtilityKind = (value: string): value is UtilityKind => (UTILITY_KIND_ORDER as string[]).includes(value);

export async function generateMetadata({ params }: UtilityCategoryRouteProps): Promise<Metadata> {
  const { category } = await params;
  if (!isUtilityKind(category)) return {};
  const label = UTILITY_KIND_LABELS[category];

  return listingMetadata({
    path: `/utilities/${category}`,
    title: `React ${label.toLowerCase()} for shadcn/ui`,
    description: UTILITY_KIND_DESCRIPTIONS[category],
    keywords: [`react ${label.toLowerCase()}`, `shadcn ${label.toLowerCase()}`, 'shadcn registry'],
  });
}

export default async function UtilityCategoryRoute({ params }: UtilityCategoryRouteProps) {
  const { category } = await params;
  if (!isUtilityKind(category)) notFound();
  const label = UTILITY_KIND_LABELS[category];
  const items = UTILITIES_BY_KIND[category];
  const breadcrumb = [{ label: 'Hooks & utilities', href: '/utilities' }, { label }];

  return (
    <div className="docs-container flex flex-col gap-10 py-10 sm:gap-12 sm:py-12 md:py-16">
      <CollectionJsonLd
        id={`utilities-${category}`}
        path={`/utilities/${category}`}
        name={label}
        description={UTILITY_KIND_DESCRIPTIONS[category]}
        entries={items}
        breadcrumb={breadcrumb}
      />
      <Breadcrumbs items={breadcrumb} />

      <header className="flex flex-col gap-4 border-b border-border pb-8 sm:pb-10">
        <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl">{label}.</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{UTILITY_KIND_DESCRIPTIONS[category]}</p>
        <p className="text-xs text-muted-foreground uppercase">{`${items.length} item${items.length === 1 ? '' : 's'}`}</p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((entry) => (
          <DemoCard key={entry.name} entry={entry} />
        ))}
      </section>
    </div>
  );
}
