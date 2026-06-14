import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Metadata } from "next"

import { SITE } from "@/lib/site"
import { TEMPLATES } from "@/registry/hirael/registry-meta"

const TEMPLATES_DESCRIPTION =
  "Full-page templates built in the Hirael style: complete, multi-section layouts you can copy into your repo with the shadcn CLI and edit like any other file."

export const metadata: Metadata = {
  title: "Templates",
  description: TEMPLATES_DESCRIPTION,
  alternates: {
    canonical: "/templates",
  },
  openGraph: {
    type: "website",
    url: `${SITE.url}/templates`,
    siteName: SITE.name,
    title: `Templates | ${SITE.name}`,
    description: TEMPLATES_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `Templates | ${SITE.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Templates | ${SITE.name}`,
    description: TEMPLATES_DESCRIPTION,
    images: ["/opengraph-image"],
  },
}

export default function TemplatesIndex() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:gap-12 sm:px-6 sm:py-12 md:px-10 md:py-16">
      <header className="flex flex-col gap-5 border-b border-border pb-8 sm:pb-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
            ◆ templates
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            full-page compositions
          </span>
        </div>
        <h1 className="text-display text-balance text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
          Full pages, ready to copy.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Complete, multi-section layouts that compose Hirael blocks and
          components into a finished page. Copy one in with a single command
          and make it yours.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {TEMPLATES.length} template{TEMPLATES.length === 1 ? "" : "s"}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TEMPLATES.map((entry) => (
          <Link
            key={entry.name}
            href={`/templates/${entry.name}`}
            className="group relative flex flex-col gap-4 overflow-hidden rounded-md border border-border bg-card/30 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-medium tracking-[-0.01em] text-foreground">
                {entry.title}
              </h2>
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors group-hover:border-foreground/40 group-hover:text-foreground">
                <ArrowUpRight className="size-3.5" />
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {entry.description}
            </p>
            {entry.dependencies?.length ? (
              <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                {entry.dependencies.map((dep) => (
                  <span
                    key={dep}
                    className="rounded-sm border border-border px-1.5 py-0 font-mono text-[10px] uppercase tracking-[0.06em] text-muted-foreground"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            ) : null}
          </Link>
        ))}
      </section>
    </div>
  )
}
