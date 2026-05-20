import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"

import { BlockPreview } from "@/components/showcase/block-preview"
import {
  BLOCK_KIND_LABELS,
  BLOCK_KIND_ORDER,
  BLOCKS_BY_KIND,
  REGISTRY,
} from "@/registry/sabk/registry-meta"

export const metadata: Metadata = {
  title: "Blocks — Sabk",
  description:
    "Top-tier, copy-into-your-repo section blocks — heroes, FAQs, CTAs and login screens that share the Sabk aesthetic.",
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
          Heroes, CTAs, FAQs and auth screens — built on top of the Sabk
          component registry and the Sabk aesthetic. Copy a block in one
          command, then shape it like any other source file in your repo.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {blockCount} blocks · {BLOCK_KIND_ORDER.length} categories · MIT
        </p>
      </header>

      <nav className="flex flex-wrap gap-2 border-b border-border pb-5">
        {BLOCK_KIND_ORDER.map((kind) => {
          const items = BLOCKS_BY_KIND[kind]
          return (
            <a
              key={kind}
              href={`#${kind}`}
              className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              <span className="size-1 rounded-full bg-foreground" />
              {BLOCK_KIND_LABELS[kind]}
              <span className="tabular-nums text-muted-foreground">
                {items.length}
              </span>
            </a>
          )
        })}
      </nav>

      <div className="flex flex-col gap-20">
        {BLOCK_KIND_ORDER.map((kind) => {
          const items = BLOCKS_BY_KIND[kind]
          if (!items.length) return null
          return (
            <section
              key={kind}
              id={kind}
              className="flex flex-col gap-6 scroll-mt-12"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {BLOCK_KIND_LABELS[kind]}
                </h2>
                <span className="font-mono text-[10px] tabular-nums uppercase tracking-[0.08em] text-muted-foreground">
                  {items.length} variant{items.length === 1 ? "" : "s"}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-2">
                {items.map((entry) => (
                  <Link
                    key={entry.name}
                    href={`/blocks/${entry.name}`}
                    className="group flex flex-col overflow-hidden rounded-sm border border-border bg-background transition-colors hover:border-foreground focus-visible:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <BlockPreview name={entry.name} title={entry.title} />

                    <div className="flex flex-col gap-2 p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-medium tracking-[-0.015em]">
                          {entry.title}
                        </h3>
                        <span className="size-1.5 shrink-0 rounded-full bg-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {entry.blockTagline ?? entry.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                        <span className="truncate">
                          /blocks/{entry.name}
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-1 text-muted-foreground transition-colors group-hover:text-foreground">
                          view
                          <ArrowRight className="size-3 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
