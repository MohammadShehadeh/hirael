"use client"

import * as React from "react"
import { ArrowUpRight } from "lucide-react"

type Tile = {
  title: string
  meta: string
  tag: string
  /** Aspect ratio for the visual — keeps the masonry pattern varied. */
  aspect: string
  /** Two color stops driving the placeholder gradient. */
  swatch: [string, string]
}

const FILTERS = ["All", "Web", "Brand", "Editorial", "Motion"] as const

const TILES: readonly Tile[] = [
  {
    title: "Helix · marketing site",
    meta: "2026 · case study",
    tag: "Web",
    aspect: "aspect-[4/5]",
    swatch: ["oklch(0.78 0.06 252)", "oklch(0.40 0.05 252)"],
  },
  {
    title: "Northwind · checkout",
    meta: "2026 · product",
    tag: "Web",
    aspect: "aspect-[16/10]",
    swatch: ["oklch(0.82 0.08 60)", "oklch(0.45 0.08 60)"],
  },
  {
    title: "Vanta · annual report",
    meta: "2025 · editorial",
    tag: "Editorial",
    aspect: "aspect-square",
    swatch: ["oklch(0.86 0.05 145)", "oklch(0.42 0.06 145)"],
  },
  {
    title: "Brella · identity",
    meta: "2025 · brand",
    tag: "Brand",
    aspect: "aspect-[3/4]",
    swatch: ["oklch(0.78 0.10 20)", "oklch(0.35 0.09 20)"],
  },
  {
    title: "Quartz · motion reel",
    meta: "2026 · motion",
    tag: "Motion",
    aspect: "aspect-[16/10]",
    swatch: ["oklch(0.80 0.06 310)", "oklch(0.36 0.07 310)"],
  },
  {
    title: "Plinth · field guide",
    meta: "2025 · editorial",
    tag: "Editorial",
    aspect: "aspect-[4/5]",
    swatch: ["oklch(0.84 0.04 90)", "oklch(0.40 0.05 90)"],
  },
  {
    title: "Lattice · product UI",
    meta: "2026 · product",
    tag: "Web",
    aspect: "aspect-[4/3]",
    swatch: ["oklch(0.80 0.07 200)", "oklch(0.38 0.07 200)"],
  },
  {
    title: "Mercado · packaging",
    meta: "2025 · brand",
    tag: "Brand",
    aspect: "aspect-square",
    swatch: ["oklch(0.82 0.09 35)", "oklch(0.42 0.08 35)"],
  },
] as const

export default function ImageGallery01() {
  const [filter, setFilter] = React.useState<(typeof FILTERS)[number]>("All")
  const visible =
    filter === "All" ? TILES : TILES.filter((t) => t.tag === filter)

  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between sm:pb-10">
          <div className="flex max-w-xl flex-col gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              · selected work · 2025 — 2026
            </span>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              A studio archive, gridded.
            </h2>
            <p className="text-base text-muted-foreground">
              Eight pieces from the last 14 months — websites, identity work,
              an annual report, and a motion reel. More in the full archive.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((f) => {
              const active = f === filter
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  className={`inline-flex items-center rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {visible.map((t) => (
            <a
              key={t.title}
              href="#"
              className="group block break-inside-avoid rounded-md border border-border bg-card transition-colors hover:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={t.title}
            >
              <div
                className={`${t.aspect} relative overflow-hidden rounded-t-md`}
                style={{
                  background: `linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]})`,
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.25] mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                <span className="absolute left-3 top-3 inline-flex items-center rounded-sm border border-white/30 bg-black/20 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                  {t.tag}
                </span>
                <span
                  aria-hidden
                  className="absolute right-3 top-3 inline-flex size-7 items-center justify-center rounded-sm border border-white/30 bg-black/20 text-white opacity-0 backdrop-blur-sm transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                >
                  <ArrowUpRight className="size-3.5" />
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="truncate text-sm font-medium tracking-[-0.01em] text-foreground">
                  {t.title}
                </span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {t.meta}
                </span>
              </div>
            </a>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-card/30 py-16 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              · nothing here yet
            </span>
            <p className="max-w-sm text-sm text-muted-foreground">
              No pieces in the {filter} archive. Switch the filter, or check
              back next quarter.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
