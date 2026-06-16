import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/showcase/page-header";
import { SITE } from "@/lib/site";
import {
  TEMPLATES,
  entryEmbedHref,
  entryHref,
} from "@/registry/hirael/registry-meta";

const TEMPLATES_DESCRIPTION =
  "Full-page templates built in the Hirael style: complete, multi-section layouts you can copy into your repo with the shadcn CLI and edit like any other file.";

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
};

export default function TemplatesIndex() {
  return (
    <div className="container flex w-full flex-col gap-14 py-16 sm:gap-16 sm:py-20">
      <PageHeader
        kicker="Templates"
        title="Full pages, ready to copy."
        blurb="Complete, multi-section layouts that compose Hirael blocks and components into a finished page. Copy one in with a single command and make it yours."
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {TEMPLATES.length} template{TEMPLATES.length === 1 ? "" : "s"}
        </p>
      </PageHeader>

      <section className="flex flex-col gap-10 sm:gap-12">
        {TEMPLATES.map((entry) => (
          <div
            key={entry.name}
            className="overflow-hidden rounded-lg border border-border bg-background"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/50 px-4 py-3 sm:px-5">
              <div className="flex min-w-0 flex-col gap-0.5">
                <h2 className="text-base font-medium tracking-[-0.015em]">
                  {entry.title}
                </h2>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {entry.description}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {entry.dependencies?.length ? (
                  <div className="hidden flex-wrap gap-1.5 sm:flex">
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
                <a
                  href={entryEmbedHref(entry)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                >
                  Open
                  <ArrowUpRight className="size-3 rtl:-rotate-90" />
                </a>
                <Link
                  href={entryHref(entry)}
                  className="group inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground transition-colors hover:border-foreground"
                >
                  View
                  <ArrowRight className="size-3 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180" />
                </Link>
              </div>
            </div>
            <div className="h-115 bg-card/20 sm:h-150 lg:h-175">
              <iframe
                src={entryEmbedHref(entry)}
                title={`${entry.title} preview`}
                loading="lazy"
                className="size-full border-0 bg-background"
              />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
