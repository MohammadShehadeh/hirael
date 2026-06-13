import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { SiteFooter } from "@/components/showcase/site-footer"
import { SiteHeader } from "@/components/showcase/site-header"
import type { Changelog } from "@/lib/changelog"

export function ChangelogView({ releases, lastUpdated }: Changelog) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main id="main-content" className="flex-1">
        <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Changelog
            {lastUpdated ? ` · Updated ${lastUpdated}` : ""}
          </p>
          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Release notes
          </h1>
          <p className="mt-4 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
            Every shipped version of Hirael: new components, blocks, fixes,
            and polish.
          </p>

          {releases.length === 0 ? (
            <p className="mt-16 text-sm text-muted-foreground">
              No releases recorded yet.
            </p>
          ) : (
            <div className="mt-16 space-y-16">
              {releases.map((release, index) => (
                <section
                  key={release.key}
                  aria-labelledby={`release-${release.key}`}
                  className="border-t border-border pt-8"
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
                    {index === 0 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        <span className="state-dot" />
                        Latest
                      </span>
                    ) : null}
                  </div>

                  <h2
                    id={`release-${release.key}`}
                    className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
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
                      {release.summarySections.map((section) => (
                        <div key={section.heading}>
                          <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                            {section.heading}
                          </h3>
                          {section.items.length > 0 ? (
                            <ul className="mt-3 space-y-2 text-sm">
                              {section.items.map((item) => (
                                <li key={item} className="flex gap-2.5">
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

          <div className="mt-16 border-t border-border pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back home
            </Link>
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
