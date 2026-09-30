import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { cn } from '@/lib/utils';
import { mdxComponents } from '@/components/mdx';
import { PageHeader } from '@/components/page-header';
import type { Changelog } from '@/lib/changelog';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { entryHref, REGISTRY_BY_NAME } from '@/registry/hirael/registry-meta';

export type ChangelogViewProps = Changelog;

/** Names that no longer resolve (an item renamed or removed later) are skipped rather than linked to a 404. */
const ItemLinks = ({ label, names }: { label: string; names: string[] }) => {
  const entries = names.flatMap((name) => {
    const entry = REGISTRY_BY_NAME[name];

    return entry ? [entry] : [];
  });
  if (entries.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xs text-muted-foreground uppercase">{label}</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {entries.map((entry) => (
          <li key={entry.name}>
            <Badge variant="outline" asChild>
              <Link href={entryHref(entry)}>{entry.title}</Link>
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const ChangelogView = ({ entries, lastUpdated, latestSlug }: ChangelogViewProps) => {
  return (
    <article className="relative docs-container py-16 sm:py-20">
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
          {lastUpdated ? <p className="text-xs text-muted-foreground uppercase">Updated {lastUpdated}</p> : null}
        </PageHeader>
      </div>

      {entries.length === 0 ? (
        <p className="mt-16 text-sm text-muted-foreground">No releases recorded yet.</p>
      ) : (
        <div className="docs-container mt-16 w-full sm:mt-20">
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
                <p className="text-xs text-muted-foreground uppercase">
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
                  className="text-display text-3xl leading-[0.95] italic sm:text-4xl"
                >
                  {entry.version ?? entry.title}
                </h2>

                {entry.version && entry.title ? (
                  <p className="mt-3 text-base text-balance text-muted-foreground">{entry.title}</p>
                ) : null}

                <div className="mt-7">
                  <MDXRemote source={entry.body} components={mdxComponents} />
                </div>

                <ItemLinks label="Added" names={entry.added} />
                <ItemLinks label="Updated" names={entry.updated} />
              </div>
            </section>
          ))}
        </div>
      )}
    </article>
  );
};
