import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import { BlockPreview } from '@/components/block-preview';
import { SectionHeading } from '@/components/page-header';
import { REGISTRY_BY_NAME, TEMPLATES, entryHref } from '@/registry/hirael/registry-meta';
import { Button } from '@/registry/hirael/bases/radix/ui/button';

const FEATURED_TEMPLATES = ['agency-landing', 'mindloop'] as const;

export const FullTemplates = () => {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="w-full px-4 sm:px-6">
        <SectionHeading
          kicker="Templates"
          title="Whole pages, not just parts."
          blurb={`${TEMPLATES.length} complete pages assembled from the blocks and components above, with light, dark and RTL already handled. One command copies the whole page, sections and all, into your repo.`}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {FEATURED_TEMPLATES.map((name) => {
            const entry = REGISTRY_BY_NAME[name];

            return (
              <Link
                key={name}
                href={entryHref(entry)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background transition-colors outline-none hover:border-foreground/40 focus-visible:border-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <BlockPreview entry={entry} />
                <div className="flex flex-col gap-1.5 p-5">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-base font-medium tracking-[-0.01em]">{entry.title}</span>
                    <ArrowUpRight
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 rtl:-scale-x-100"
                      aria-hidden
                    />
                  </span>
                  <span className="line-clamp-2 text-sm text-muted-foreground">{entry.description}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/templates">
              All templates
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
