import type { Metadata } from "next"

import { BlockCategories } from "@/components/showcase/block-categories"
import { SITE } from "@/lib/site"
import { REGISTRY } from "@/registry/msh-ui/registry-meta"

const BLOCKS_DESCRIPTION =
  "Top-tier, copy-into-your-repo section blocks — heroes, FAQs, CTAs and login screens that share the MSH UI aesthetic."

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
    creator: SITE.twitterHandle,
    site: SITE.twitterHandle,
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
        <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl md:text-6xl">
          Blocks that compose, not decorate.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Heroes, CTAs, FAQs and auth screens — built on top of the MSH UI
          component registry and aesthetic. Copy a block in one command, then
          shape it like any other source file in your repo.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {blockCount} blocks · 17 categories · MIT
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Browse by category
          </h2>
          <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
            17 categories
          </span>
        </div>
        <BlockCategories />
      </section>
    </div>
  )
}
