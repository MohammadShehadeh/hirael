import type { Metadata } from 'next';

import { CollectionJsonLd } from '@/components/collection-json-ld';
import { PageHeader } from '@/components/page-header';
import { listingMetadata } from '@/lib/seo';
import { TEMPLATES } from '@/registry/hirael/registry-meta';

import { TemplateGrid } from './_components/template-grid';

const TEMPLATES_DESCRIPTION =
  'Full-page templates built on shadcn/ui and Tailwind CSS: complete landing pages with hero, pricing, FAQ and footer sections. Install one with the shadcn CLI and edit it in your repo.';

export const metadata: Metadata = listingMetadata({
  path: '/templates',
  title: 'Full-page templates for shadcn/ui',
  description: TEMPLATES_DESCRIPTION,
  keywords: [
    'react page templates',
    'shadcn templates',
    'tailwind landing page template',
    'next.js landing page',
    'free react templates',
  ],
});

export default function TemplatesIndex() {
  return (
    <div className="docs-container flex flex-col gap-14 py-16 sm:gap-16 sm:py-20">
      <CollectionJsonLd
        id="templates-index"
        path="/templates"
        name="Templates"
        description={TEMPLATES_DESCRIPTION}
        entries={TEMPLATES}
      />
      <PageHeader
        kicker="Templates"
        title="Full pages, ready to copy."
        blurb="Complete pages assembled from the blocks and components in this registry with light, dark and RTL already handled. One command copies the whole page into your repo, then you swap in your copy and brand."
      >
        <p className="text-xs uppercase text-muted-foreground">
          {TEMPLATES.length} template{TEMPLATES.length === 1 ? '' : 's'}
        </p>
      </PageHeader>
      <TemplateGrid />
    </div>
  );
}
