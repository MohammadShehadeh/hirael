import type { Metadata } from 'next';

import { BlockShowcase } from '@/components/block-showcase';
import { PageHeader } from '@/components/page-header';
import { SITE } from '@/lib/site';
import { BLOCK_KIND_ORDER, REGISTRY } from '@/registry/hirael/registry-meta';

const BLOCKS_DESCRIPTION =
  'Section blocks for heroes, FAQs, pricing, login screens and dashboards, all in the Hirael style. Copy them into your repo with the shadcn CLI.';

export const metadata: Metadata = {
  title: 'Blocks',
  description: BLOCKS_DESCRIPTION,
  alternates: {
    canonical: '/blocks',
  },
  openGraph: {
    type: 'website',
    url: `${SITE.url}/blocks`,
    siteName: SITE.name,
    title: `Blocks | ${SITE.name}`,
    description: BLOCKS_DESCRIPTION,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: `Blocks | ${SITE.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blocks | ${SITE.name}`,
    description: BLOCKS_DESCRIPTION,
    images: ['/opengraph-image'],
  },
};

export default function BlocksIndex() {
  const blockCount = REGISTRY.filter((r) => r.category === 'blocks').length;

  return (
    <div className="container flex w-full flex-col gap-14 py-16 sm:gap-16 sm:py-20">
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
