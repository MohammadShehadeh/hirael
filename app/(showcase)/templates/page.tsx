import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

import { BlockPreview } from '@/components/block-preview';
import { CollectionJsonLd } from '@/components/collection-json-ld';
import { PageHeader } from '@/components/page-header';
import { listingMetadata } from '@/lib/seo';
import { TEMPLATES, entryFileLabel, entryHref } from '@/registry/hirael/registry-meta';

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
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {TEMPLATES.length} template{TEMPLATES.length === 1 ? '' : 's'}
        </p>
      </PageHeader>

      <section className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
        {TEMPLATES.map((entry) => (
          <Link
            key={entry.name}
            href={entryHref(entry)}
            className="group flex flex-col overflow-hidden rounded-sm border border-border bg-background outline-none transition-colors hover:border-foreground focus-visible:border-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <BlockPreview entry={entry} />

            <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
              <h2 className="text-base font-medium tracking-[-0.01em]">{entry.title}</h2>
              <p className="line-clamp-2 text-xs text-muted-foreground">{entry.description}</p>
              {entry.dependencies?.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {entry.dependencies.map((dep) => (
                    <span
                      key={dep}
                      className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground"
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>{entryFileLabel(entry)}</span>
                <span className="inline-flex shrink-0 items-center gap-1 transition-colors group-hover:text-foreground">
                  view
                  <ArrowRight className="size-3 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
