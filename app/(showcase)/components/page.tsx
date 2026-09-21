import type { Metadata } from 'next';

import { CollectionJsonLd } from '@/components/collection-json-ld';
import { PageHeader } from '@/components/page-header';
import { listingMetadata } from '@/lib/seo';
import { COMPONENTS } from '@/registry/hirael/registry-meta';

import { CategoryNav } from './_components/category-nav';
import { CategorySections } from './_components/category-sections';
import { Composition } from './_components/composition';
import { RelatedCatalog } from './_components/related-catalog';

const COMPONENTS_DESCRIPTION =
  'Components shadcn/ui leaves out: multi-select, combobox, date and time pickers, tag input, currency input, file dropzone and more. Try each one live, then install it with the shadcn CLI.';

export const metadata: Metadata = listingMetadata({
  path: '/components',
  title: 'Components for shadcn/ui',
  description: COMPONENTS_DESCRIPTION,
  keywords: [
    'react components',
    'shadcn components',
    'shadcn registry',
    'multi-select react',
    'combobox react',
    'tag input react',
    'tailwind components',
  ],
});

export default function ComponentsIndex() {
  return (
    <div className="docs-container flex flex-col gap-14 py-16 sm:gap-16 sm:py-20">
      <CollectionJsonLd
        id="components-index"
        path="/components"
        name="Components"
        description={COMPONENTS_DESCRIPTION}
        entries={COMPONENTS}
      />
      <PageHeader
        kicker="Components"
        title="The full registry."
        blurb={`${COMPONENTS.length} components shadcn/ui leaves out: multi-select, combobox, date and time pickers, tag and currency inputs, file dropzones, data views and more. Each one runs live below, so you can test it before the shadcn CLI copies its source into your repo.`}
      />
      <CategoryNav />
      <CategorySections />
      <Composition />
      <RelatedCatalog />
    </div>
  );
}
