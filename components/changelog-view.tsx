import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";

import { mdxComponents } from "@/components/mdx";
import { PageHeader } from "@/components/page-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Changelog } from "@/lib/changelog";

export function ChangelogView({
  entries,
  lastUpdated,
  latestSlug,
  stars,
}: Changelog & { stars?: number | null }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader stars={stars} />

      <main id="main-content" className="flex-1">
        <article className="relative container w-full py-16 sm:py-20">
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-24 h-64 bg-[radial-gradient(ellipse_50%_60%_at_50%_0%,var(--halo-cool),transparent_70%)]"
            />
            <PageHeader
              kicker="Changelog"
              title="Release notes"
              blurb="Every shipped version of Hirael: new components, blocks, fixes, and polish."
            >
              {lastUpdated ? (
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  Updated {lastUpdated}
                </p>
              ) : null}
            </PageHeader>
          </div>

          {entries.length === 0 ? (
            <p className="mt-16 text-sm text-muted-foreground">
              No releases recorded yet.
            </p>
          ) : (
            <div className="mt-14 space-y-5">
              {entries.map((entry) => (
                <section
                  key={entry.slug}
                  aria-labelledby={`release-${entry.slug}`}
                  className="glass-panel-lit relative rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm transition-colors hover:bg-card/60 sm:p-8"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      <time dateTime={entry.isoDate}>{entry.displayDate}</time>
                    </p>
                    {entry.slug === latestSlug ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        <span className="state-dot" />
                        Latest
                      </span>
                    ) : null}
                  </div>

                  <h2
                    id={`release-${entry.slug}`}
                    className="text-display mt-2 text-2xl sm:text-3xl"
                  >
                    {entry.version ?? entry.title}
                  </h2>

                  {entry.version && entry.title ? (
                    <p className="mt-2 text-base text-muted-foreground">
                      {entry.title}
                    </p>
                  ) : null}

                  <div className="mt-6">
                    <MDXRemote
                      source={entry.body}
                      components={mdxComponents}
                    />
                  </div>
                </section>
              ))}
            </div>
          )}

          <div className="mt-12">
            <Link
              href="/"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card/60 px-5 text-sm text-muted-foreground backdrop-blur-sm transition-colors hover:bg-accent hover:text-foreground"
            >
              <ArrowLeft className="size-4 rtl:rotate-180" />
              Back home
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
