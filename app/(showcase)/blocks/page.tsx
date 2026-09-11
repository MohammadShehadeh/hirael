import type { Metadata } from 'next';

import { BlockShowcase } from '@/components/block-showcase';
import { CollectionJsonLd } from '@/components/collection-json-ld';
import { PageHeader } from '@/components/page-header';
import { listingMetadata } from '@/lib/seo';
import { BLOCK_KIND_ORDER, REGISTRY } from '@/registry/hirael/registry-meta';

const BLOCKS_DESCRIPTION =
  'Hero, pricing, testimonial, FAQ, login and dashboard sections built on shadcn/ui and Tailwind CSS. Preview each block live, then install it with the shadcn CLI.';

export const metadata: Metadata = listingMetadata({
  path: '/blocks',
  title: 'Blocks and page sections for shadcn/ui',
  description: BLOCKS_DESCRIPTION,
  keywords: [
    'shadcn blocks',
    'react hero section',
    'tailwind pricing section',
    'react faq section',
    'login page block',
    'dashboard blocks',
  ],
});

export default function BlocksIndex() {
  const blocks = REGISTRY.filter((r) => r.category === 'blocks');
  const blockCount = blocks.length;

  return (
    <div className="docs-container flex flex-col gap-14 py-16 sm:gap-16 sm:py-20">
      <CollectionJsonLd
        id="blocks-index"
        path="/blocks"
        name="Blocks"
        description={BLOCKS_DESCRIPTION}
        entries={blocks}
      />
      <PageHeader
        kicker="Blocks"
        title="Page sections, ready to copy."
        blurb="Hero, pricing, testimonial, FAQ, auth and dashboard sections built on shadcn/ui and Tailwind CSS, each composed from the components in this registry so it matches what you already installed. Preview any block at full width, then copy it in with one command and edit it like a file you wrote."
      >
        <p className="text-xs uppercase text-muted-foreground">
          {blockCount} blocks in {BLOCK_KIND_ORDER.length} categories
        </p>
      </PageHeader>

      <BlockShowcase />
    </div>
  );
}
