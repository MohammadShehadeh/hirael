import Link from 'next/link';
import { ArrowRight, ChevronLeft, Code2 } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { CategoryMeta } from '@/components/block-categories';
import { BlockViewer } from '@/components/block-viewer';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { InstallBlock } from '@/components/install-block';
import { TocChips } from '@/components/toc';
import { BLOCKS_BY_KIND, entryFileLabel, entryHref, type RegistryEntryMeta } from '@/registry/hirael/registry-meta';

interface CategoryPageProps {
  category: CategoryMeta;
}

const chipStyle =
  'inline-flex h-7 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-sm border border-border bg-card px-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors outline-none hover:border-foreground/40 hover:text-foreground focus-visible:border-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-3 [&_svg]:shrink-0';

/**
 * A block category as one long browse: every block live and full width in
 * registry order, each with its number and tagline, title and description,
 * the framed preview (viewport + RTL controls) and a one-line install command.
 * A visitor compares variants at real size and copies one in without opening
 * the detail page, which stays the place for source and dependencies. A
 * scroll-spied chip row sticks under the topbar so eleven previews are still
 * one click to any block.
 */
export const CategoryPage = ({ category }: CategoryPageProps) => {
  const blocks: RegistryEntryMeta[] = category.blockKind ? BLOCKS_BY_KIND[category.blockKind] : [];
  const total = blocks.length;

  return (
    <div className="container flex w-full flex-col gap-8 py-10 sm:gap-10 sm:py-12 md:py-16">
      <Breadcrumbs items={[{ label: 'Blocks', href: '/blocks' }, { label: category.title }]} />

      <header className="flex flex-col gap-4">
        {category.comingSoon && (
          <span className="w-fit rounded-sm border border-border bg-card px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Roadmap
          </span>
        )}
        <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{category.title}.</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{category.description}</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {category.comingSoon
            ? 'Planned, not shipped yet'
            : `${total} block${total === 1 ? '' : 's'}, live at full size, install from here`}
        </p>
      </header>

      {category.comingSoon ? (
        <RoadmapState category={category} />
      ) : (
        <>
          <div className="sticky top-14 z-20 -mx-4 border-y border-border bg-background/85 px-4 py-2 backdrop-blur-md">
            <TocChips items={blocks.map((b) => ({ id: b.name, label: b.title }))} />
          </div>

          <section className="flex flex-col gap-14 sm:gap-20">
            {blocks.map((entry, index) => {
              const href = entryHref(entry);
              return (
                <article
                  key={entry.name}
                  id={entry.name}
                  aria-labelledby={`${entry.name}-title`}
                  className="flex scroll-mt-28 flex-col gap-5"
                >
                  <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
                    <div className="flex min-w-0 flex-col gap-2">
                      <p className="flex flex-wrap items-center gap-x-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                        <span className="tabular-nums text-foreground">
                          {String(index + 1).padStart(2, '0')}
                          <span className="text-muted-foreground/60"> / {String(total).padStart(2, '0')}</span>
                        </span>
                        {entry.blockTagline && (
                          <>
                            <span aria-hidden className="text-border">
                              |
                            </span>
                            <span>{entry.blockTagline}</span>
                          </>
                        )}
                      </p>
                      <h2 id={`${entry.name}-title`} className="text-2xl font-semibold tracking-[-0.015em] sm:text-3xl">
                        <Link
                          href={href}
                          className="rounded-sm outline-none hover:underline hover:underline-offset-6 focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        >
                          {entry.title}
                        </Link>
                      </h2>
                      <p className="max-w-2xl text-sm text-muted-foreground sm:text-[15px]">{entry.description}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className={chipStyle}>{entryFileLabel(entry)}</span>
                      <Link href={`${href}#code`} className={chipStyle}>
                        <Code2 />
                        Code
                      </Link>
                      <Link href={href} className={cn(chipStyle, 'group')}>
                        Details
                        <ArrowRight className="transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                      </Link>
                    </div>
                  </header>

                  <BlockViewer entry={entry} minHeight={640} />

                  <InstallBlock name={entry.name} variant="inline" />
                </article>
              );
            })}
          </section>
        </>
      )}
    </div>
  );
};

const RoadmapState = ({ category }: { category: CategoryMeta }) => {
  return (
    <section className="flex flex-col gap-8">
      <div className="relative overflow-hidden rounded-md border border-border bg-card/30 p-8 sm:p-12">
        <div
          aria-hidden
          className="bg-dot-grid pointer-events-none absolute inset-0 opacity-50 mask-[radial-gradient(ellipse_at_top,black,transparent_70%)]"
        />
        <div className="relative flex flex-col gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">In design</span>
          <h3 className="text-2xl font-medium tracking-[-0.02em] sm:text-3xl">
            {category.title} blocks are on the roadmap.
          </h3>
          <p className="max-w-xl text-sm text-muted-foreground">
            {category.description} We&apos;re drafting variants now, first one ships when it&apos;s good enough that
            we&apos;d copy it into our own products.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Link href="/blocks" className={chipStyle}>
              <ChevronLeft className="rtl:rotate-180" />
              All categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
