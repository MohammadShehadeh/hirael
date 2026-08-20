import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

import { BlockPreview } from "@/components/block-preview";
import { PageHeader } from "@/components/page-header";
import { SITE } from "@/lib/site";
import {
  TEMPLATES,
  entryEmbedHref,
  entryFileLabel,
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

      <section className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
        {TEMPLATES.map((entry) => (
          <Link
            key={entry.name}
            href={entryHref(entry)}
            className="group flex flex-col overflow-hidden rounded-sm border border-border bg-background outline-none transition-colors hover:border-foreground focus-visible:border-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <BlockPreview
              embedHref={entryEmbedHref(entry)}
              title={entry.title}
            />

            <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-medium tracking-[-0.01em]">
                  {entry.title}
                </h2>
                <span className="size-1.5 shrink-0 rounded-full bg-foreground" />
              </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {entry.description}
              </p>
              {entry.dependencies?.length ? (
                <div className="flex flex-wrap gap-1.5">
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
              <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>{entryFileLabel(entry)}</span>
                <span className="inline-flex shrink-0 items-center gap-1 transition-colors group-hover:text-foreground">
                  view
                  <ArrowRight className="size-3 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
