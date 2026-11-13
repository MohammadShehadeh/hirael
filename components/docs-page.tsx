import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { docHref, docSiblings, type DocPage } from '@/lib/docs-nav';
import type { Doc } from '@/lib/docs';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { docsMdxComponents } from '@/components/docs-mdx';
import { SponsorsCard } from '@/components/sponsors-card';
import { Toc, TocChips } from '@/components/toc';

interface DocsPagerLinkProps {
  page: DocPage;
  direction: 'prev' | 'next';
}

const DocsPagerLink = ({ page, direction }: DocsPagerLinkProps) => {
  const isPrev = direction === 'prev';
  const Arrow = isPrev ? ArrowLeft : ArrowRight;

  return (
    <Link
      href={docHref(page.slug)}
      rel={direction}
      className={cn(
        'group flex flex-col gap-2 py-6 outline-none focus-visible:rounded-sm focus-visible:ring-[3px] focus-visible:ring-ring/50',
        isPrev ? 'items-start text-start' : 'items-end text-end',
      )}
    >
      <span
        className={cn('flex items-center gap-2 text-xs text-muted-foreground uppercase', !isPrev && 'flex-row-reverse')}
      >
        <Arrow aria-hidden className="size-3.5 rtl:rotate-180" />
        {isPrev ? 'Previous' : 'Next'}
      </span>
      <span className="text-xl font-semibold tracking-tight text-foreground underline-offset-6 group-hover:underline">
        {page.title}
      </span>
    </Link>
  );
};

export interface DocsPageProps {
  doc: Doc;
}

export const DocsPage = ({ doc }: DocsPageProps) => {
  const { prev, next } = docSiblings(doc.slug);
  const crumbs = doc.slug ? [{ label: 'Docs', href: '/docs' }, { label: doc.title }] : [{ label: 'Docs' }];

  return (
    <div className="container py-10 sm:py-12 md:py-14">
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-10">
        <article className="flex min-w-0 flex-col gap-10">
          <header className="flex flex-col gap-4">
            <Breadcrumbs items={crumbs} />
            <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance md:text-4xl">
              {doc.title}
            </h1>
            <p className="max-w-2xl text-base text-pretty text-muted-foreground md:text-lg">{doc.description}</p>
          </header>

          <TocChips items={doc.headings} className="xl:hidden" />

          <div className="max-w-3xl">
            <MDXRemote source={doc.body} components={docsMdxComponents} />
          </div>

          {(prev || next) && (
            <nav aria-label="Docs" className="grid border-t border-border sm:grid-cols-2">
              <div className="sm:border-e sm:border-border sm:pe-8">
                {prev && <DocsPagerLink page={prev} direction="prev" />}
              </div>
              <div className={cn('sm:ps-8', prev && next && 'border-t border-border sm:border-t-0')}>
                {next && <DocsPagerLink page={next} direction="next" />}
              </div>
            </nav>
          )}
        </article>

        <aside className="hidden xl:block">
          <div className="sticky top-16 flex flex-col gap-8">
            <Toc items={doc.headings} />
            <SponsorsCard />
          </div>
        </aside>
      </div>
    </div>
  );
};
