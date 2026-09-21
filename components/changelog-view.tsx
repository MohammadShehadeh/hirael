import { MDXRemote } from 'next-mdx-remote/rsc';

import { cn } from '@/lib/utils';
import { mdxComponents } from '@/components/mdx';
import { PageHeader } from '@/components/page-header';
import type { Changelog } from '@/lib/changelog';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';

export type ChangelogViewProps = Changelog;

export const ChangelogView = ({ entries, lastUpdated, latestSlug }: ChangelogViewProps) => {
  return (
    <article className="docs-container relative py-16 sm:py-20">
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 h-64 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,var(--halo-cool),transparent_70%)]"
        />
        <PageHeader
          kicker="Changelog"
          title="Release notes"
          blurb="Every Hirael release, newest first, with the components and blocks it added and the fixes it shipped."
        >
          {lastUpdated ? <p className="text-xs uppercase text-muted-foreground">Updated {lastUpdated}</p> : null}
        </PageHeader>
      </div>

      {entries.length === 0 ? (
        <p className="mt-16 text-sm text-muted-foreground">No releases recorded yet.</p>
      ) : (
        <div className="mt-16 w-full docs-container sm:mt-20">
          {entries.map((entry, index) => (
            <section
              key={entry.slug}
              id={`release-${entry.slug}`}
              aria-labelledby={`release-${entry.slug}-title`}
              className={cn(
                'scroll-mt-24 md:grid md:grid-cols-[8.5rem_1fr] md:items-start md:gap-10',
                index > 0 && 'mt-14 border-t border-border pt-14 sm:mt-16 sm:pt-16',
              )}
            >
              <div className="flex flex-wrap items-center gap-3 md:sticky md:top-16 md:flex-col md:items-start md:gap-2.5">
                <p className="text-xs uppercase text-muted-foreground">
                  <time dateTime={entry.isoDate}>{entry.displayDate}</time>
                </p>
                {entry.slug === latestSlug ? (
                  <Badge variant="outline">
                    <span className="state-dot" />
                    Latest
                  </Badge>
                ) : null}
              </div>

              <div className="mt-4 min-w-0 md:mt-0">
                <h2
                  id={`release-${entry.slug}-title`}
                  className="text-display text-3xl italic leading-[0.95] sm:text-4xl"
                >
                  {entry.version ?? entry.title}
                </h2>

                {entry.version && entry.title ? (
                  <p className="mt-3 text-balance text-base text-muted-foreground">{entry.title}</p>
                ) : null}

                <div className="mt-7">
                  <MDXRemote source={entry.body} components={mdxComponents} />
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </article>
  );
};
