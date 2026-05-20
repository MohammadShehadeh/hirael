import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"

import {
  BLOCK_KIND_LABELS,
  BLOCK_KIND_ORDER,
  BLOCKS_BY_KIND,
  REGISTRY,
} from "@/registry/sabk/registry-meta"

export const metadata: Metadata = {
  title: "Blocks — Sabk",
  description:
    "Top-tier, copy-into-your-repo section blocks — heroes, FAQs, CTAs and login screens that share the Sabk forge aesthetic.",
}

export default function BlocksIndex() {
  const blockCount = REGISTRY.filter((r) => r.category === "blocks").length

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12 md:px-10 md:py-16">
      <header className="flex flex-col gap-5 border-b-2 border-border pb-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-forge">
            ◆ blocks
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            section-level compositions
          </span>
        </div>
        <h1 className="text-5xl font-semibold tracking-[-0.04em] md:text-6xl">
          Blocks that compose, not decorate.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground">
          Heroes, CTAs, FAQs and auth screens — built on top of the Sabk
          component registry and the forge aesthetic. Copy a block in one
          command, then shape it like any other source file in your repo.
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {blockCount} blocks · {BLOCK_KIND_ORDER.length} categories · MIT
        </p>
      </header>

      <nav className="flex flex-wrap gap-2 border-b-2 border-border pb-5">
        {BLOCK_KIND_ORDER.map((kind) => {
          const items = BLOCKS_BY_KIND[kind]
          return (
            <a
              key={kind}
              href={`#${kind}`}
              className="inline-flex items-center gap-2 rounded-sm border-2 border-border bg-card px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-forge hover:text-foreground"
            >
              <span className="size-1 rounded-full bg-forge" />
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

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {items.map((entry) => {
                  const Demo = entry.Demo
                  return (
                    <Link
                      key={entry.name}
                      href={`/blocks/${entry.name}`}
                      className="group flex flex-col overflow-hidden rounded-sm border-2 border-border bg-background transition-colors hover:border-forge"
                    >
                      <div className="relative h-64 overflow-hidden border-b-2 border-border bg-card/40">
                        {Demo && (
                          <div
                            className="pointer-events-none origin-top-left"
                            style={{
                              width: "200%",
                              transform: "scale(0.5)",
                            }}
                          >
                            <Demo />
                          </div>
                        )}
                        <span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                        />
                      </div>

                      <div className="flex flex-col gap-2 p-5">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-medium tracking-[-0.015em]">
                            {entry.title}
                          </h3>
                          <span className="size-1.5 rounded-full bg-forge" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {entry.blockTagline ?? entry.description}
                        </p>
                        <div className="mt-2 flex items-center justify-between border-t-2 border-border pt-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                          <span>/blocks/{entry.name}</span>
                          <span className="inline-flex items-center gap-1 text-muted-foreground transition-colors group-hover:text-forge">
                            view
                            <ArrowRight className="size-3 transition-transform duration-150 ease-[var(--ease-forge)] group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
