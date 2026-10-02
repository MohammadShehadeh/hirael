import Link from 'next/link';
import type { Metadata } from 'next';

import { CollectionJsonLd } from '@/components/collection-json-ld';
import { DemoCard } from '@/components/demo-card';
import { PageHeader } from '@/components/page-header';
import { listingMetadata } from '@/lib/seo';
import {
  UTILITIES,
  UTILITIES_BY_KIND,
  UTILITIES_DESCRIPTION,
  UTILITY_KIND_LABELS,
  UTILITY_KIND_ORDER,
} from '@/registry/hirael/registry-meta';

export const metadata: Metadata = listingMetadata({
  path: '/utilities',
  title: 'React hooks and utilities for shadcn/ui',
  description: UTILITIES_DESCRIPTION,
  keywords: ['react hooks', 'shadcn hooks', 'useControllableState', 'useReducedMotion', 'react utilities'],
});

export default function UtilitiesIndex() {
  return (
    <div className="docs-container flex flex-col gap-14 py-16 sm:gap-16 sm:py-20">
      <CollectionJsonLd
        id="utilities-index"
        path="/utilities"
        name="Hooks & utilities"
        description={UTILITIES_DESCRIPTION}
        entries={UTILITIES}
      />
      <PageHeader kicker="Hooks & utilities" title="The hooks behind the components." blurb={UTILITIES_DESCRIPTION}>
        <p className="text-xs text-muted-foreground uppercase">
          {`${UTILITIES.length} items in ${UTILITY_KIND_ORDER.length} categories`}
        </p>
      </PageHeader>

      {UTILITY_KIND_ORDER.map((kind) => (
        <section key={kind} aria-labelledby={`utilities-${kind}`} className="flex flex-col gap-6">
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
            <h2 id={`utilities-${kind}`} className="text-xl font-semibold tracking-tight">
              {UTILITY_KIND_LABELS[kind]}
            </h2>
            <Link
              href={`/utilities/${kind}`}
              className="text-xs text-muted-foreground uppercase transition-colors hover:text-foreground"
            >
              {`View all ${UTILITIES_BY_KIND[kind].length}`}
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {UTILITIES_BY_KIND[kind].map((entry) => (
              <DemoCard key={entry.name} entry={entry} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
