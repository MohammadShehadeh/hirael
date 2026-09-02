import type { Metadata } from 'next';

import { BlockShowcase } from '@/components/block-showcase';
import { CollectionJsonLd } from '@/components/collection-json-ld';
import { PageHeader } from '@/components/page-header';
import { listingMetadata } from '@/lib/seo';
import { BLOCK_KIND_ORDER, REGISTRY } from '@/registry/hirael/registry-meta';

const BLOCKS_DESCRIPTION =
  'Section blocks for heroes, FAQs, pricing, login screens and dashboards, all in the Hirael style. Copy them into your repo with the shadcn CLI.';

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
    <div className="container flex w-full flex-col gap-14 py-16 sm:gap-16 sm:py-20">
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
        blurb="Heroes, CTAs, FAQs, auth screens and dashboards, all built from the same Hirael components. Copy one in with a single command and edit it like any other file in your repo."
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {blockCount} blocks in {BLOCK_KIND_ORDER.length} categories
        </p>
      </PageHeader>

      <BlockShowcase />
    </div>
  );
}
