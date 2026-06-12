import type { Metadata } from "next"

import { BlockCategories } from "@/components/showcase/block-categories"
import { SITE } from "@/lib/site"
import { BLOCK_KIND_ORDER, REGISTRY } from "@/registry/hirael/registry-meta"

const BLOCKS_DESCRIPTION =
  "Section blocks for heroes, FAQs, pricing, login screens and dashboards, all in the Hirael style. Copy them into your repo with the shadcn CLI."

export const metadata: Metadata = {
  title: "Blocks",
  description: BLOCKS_DESCRIPTION,
  alternates: {
    canonical: "/blocks",
  },
  openGraph: {
    type: "website",
    url: `${SITE.url}/blocks`,
    siteName: SITE.name,
    title: `Blocks — ${SITE.name}`,
    description: BLOCKS_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `Blocks — ${SITE.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blocks — ${SITE.name}`,
    description: BLOCKS_DESCRIPTION,
    images: ["/opengraph-image"],
  },
}

export default function BlocksIndex() {
  const blockCount = REGISTRY.filter((r) => r.category === "blocks").length

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:gap-12 sm:px-6 sm:py-12 md:px-10 md:py-16">
      <header className="flex flex-col gap-5 border-b border-border pb-8 sm:pb-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
            ◆ blocks
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            section-level compositions
          </span>
        </div>
        <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          Page sections, ready to copy.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Heroes, CTAs, FAQs, auth screens and dashboards, all built from
          the same Hirael components. Copy one in with a single command and
          edit it like any other file in your repo.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {blockCount} blocks · {BLOCK_KIND_ORDER.length} categories
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Browse by category
          </h2>
          <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
            {BLOCK_KIND_ORDER.length} categories
          </span>
        </div>
        <BlockCategories />
      </section>
    </div>
  )
}
