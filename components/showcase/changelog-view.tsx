import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/showcase/page-header";
import { SiteFooter } from "@/components/showcase/site-footer";
import { SiteHeader } from "@/components/showcase/site-header";
import type { Changelog } from "@/lib/changelog";

export function ChangelogView({ releases, lastUpdated, latestKey }: Changelog) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

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

          {releases.length === 0 ? (
            <p className="mt-16 text-sm text-muted-foreground">
              No releases recorded yet.
            </p>
          ) : (
            <div className="mt-14 space-y-5">
              {releases.map((release) => (
                <section
                  key={release.key}
                  aria-labelledby={`release-${release.key}`}
                  className="glass-panel-lit relative rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-sm transition-colors hover:bg-card/60 sm:p-8"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {release.displayDate ? (
                        <time dateTime={release.isoDate ?? undefined}>
                          {release.displayDate}
                        </time>
                      ) : (
                        "Release"
                      )}
                    </p>
                    {release.key === latestKey ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        <span className="state-dot" />
                        Latest
                      </span>
                    ) : null}
                  </div>

                  <h2
                    id={`release-${release.key}`}
                    className="text-display mt-2 text-2xl sm:text-3xl"
                  >
                    {release.label}
                  </h2>

                  {release.summaryTitle ? (
                    <p className="mt-2 text-base text-muted-foreground">
                      {release.summaryTitle}
                    </p>
                  ) : null}

                  {release.summarySections.length > 0 ? (
                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      {release.summarySections.map((section, i) => (
                        <div key={`${section.heading}-${i}`}>
                          <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            {section.heading}
                          </h3>
                          {section.items.length > 0 ? (
                            <ul className="mt-3 space-y-2 text-sm">
                              {section.items.map((item, i) => (
                                <li
                                  key={`${item}-${i}`}
                                  className="flex gap-2.5"
                                >
                                  <span
                                    aria-hidden
                                    className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/50"
                                  />
                                  <span className="leading-relaxed text-foreground/80">
                                    {item}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
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
