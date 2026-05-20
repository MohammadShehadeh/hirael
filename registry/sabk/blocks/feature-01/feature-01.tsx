"use client"

import * as React from "react"
import { Check, Terminal, GitBranch, Gauge } from "lucide-react"

import { cn } from "@/lib/utils"

type FeatureRow = {
  eyebrow: string
  headline: string
  body: string
  bullets: readonly string[]
  media: "registry" | "branches" | "metrics"
}

const ROWS: readonly FeatureRow[] = [
  {
    eyebrow: "· registry",
    headline: "One CLI command, source in your repo.",
    body: "Sabk distributes through the same shadcn CLI you already use. The component lands in your codebase as plain TSX — no package pin, no version drift.",
    bullets: [
      "Resolved against your existing tsconfig paths",
      "Drops into components/ui/* by default",
      "Zero runtime dependency on Sabk",
    ],
    media: "registry",
  },
  {
    eyebrow: "· dual API",
    headline: "Two surfaces, one source file.",
    body: "Every component ships both a compound API for full layout control and a single-prop shape for the 90% case. They share state — pick the one that fits the screen you're building.",
    bullets: [
      "Compound: Root + named parts",
      "Single-prop: options-as-prop, one component",
      "Identical state machine under both",
    ],
    media: "branches",
  },
  {
    eyebrow: "· performance",
    headline: "Built for dense product surfaces.",
    body: "Virtualized lists, debounced async, and stable keys are wired in by default. The components hold up when the data set isn't a marketing demo.",
    bullets: [
      "Stable keyboard nav past 10k rows",
      "Async loading with cancellation",
      "Tree-shakeable, SSR-safe",
    ],
    media: "metrics",
  },
]

function MediaRegistry() {
  return (
    <div
      className="relative w-full rounded-sm border border-border bg-card"
      style={{ boxShadow: "6px 6px 0 0 var(--border)" }}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          <Terminal className="size-3" />
          install
        </span>
        <div className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-border" />
          <span className="size-1.5 rounded-full bg-border" />
          <span className="size-1.5 rounded-full bg-foreground" />
        </div>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-[1.7]">
        <code>
          <span className="block">
            <span className="text-foreground">$</span>{" "}
            <span className="text-foreground">npx shadcn add</span>
          </span>
          <span className="block text-muted-foreground">
            {"  "}https://sabk.dev/r/combobox
          </span>
          <span className="block">&nbsp;</span>
          <span className="block text-muted-foreground">
            ✓ resolved registry
          </span>
          <span className="block text-muted-foreground">
            ✓ wrote combobox.tsx
          </span>
        </code>
      </pre>
    </div>
  )
}

function MediaBranches() {
  return (
    <div
      className="relative w-full rounded-sm border border-border bg-card p-5"
      style={{ boxShadow: "6px 6px 0 0 var(--border)" }}
    >
      <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        <GitBranch className="size-3" />
        api shapes
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-sm border border-border bg-background p-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            compound
          </span>
          <pre className="mt-2 font-mono text-[11px] leading-[1.55]">
            <code>
              {"<Select.Root>\n"}
              {"  <Select.Trigger />\n"}
              {"  <Select.List />\n"}
              {"</Select.Root>"}
            </code>
          </pre>
        </div>
        <div className="rounded-sm border border-border bg-background p-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            single-prop
          </span>
          <pre className="mt-2 font-mono text-[11px] leading-[1.55]">
            <code>
              {'<Select\n'}
              {'  options={...}\n'}
              {'  onChange={set}\n'}
              {'/>'}
            </code>
          </pre>
        </div>
      </div>
    </div>
  )
}

function MediaMetrics() {
  const bars = [38, 52, 44, 68, 49, 81, 62, 74, 58, 88]
  return (
    <div
      className="relative w-full rounded-sm border border-border bg-card p-5"
      style={{ boxShadow: "6px 6px 0 0 var(--border)" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          <Gauge className="size-3" />
          render · 10k rows
        </span>
        <span className="font-mono text-[10px] tabular-nums text-foreground">
          14ms p95
        </span>
      </div>
      <div className="flex h-32 items-end gap-1.5">
        {bars.map((h, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-[2px]",
              i === bars.length - 1 ? "bg-foreground" : "bg-muted",
            )}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
        {[
          { l: "scroll", v: "60fps" },
          { l: "memory", v: "12 MB" },
          { l: "bundle", v: "+2.1 KB" },
        ].map((s) => (
          <div key={s.l}>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {s.l}
            </div>
            <div className="mt-1 font-mono text-sm tabular-nums">{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const MEDIA: Record<FeatureRow["media"], React.ComponentType> = {
  registry: MediaRegistry,
  branches: MediaBranches,
  metrics: MediaMetrics,
}

export default function Feature01() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="flex flex-col gap-20 sm:gap-24">
          {ROWS.map((row, i) => {
            const Media = MEDIA[row.media]
            const mediaFirst = i % 2 === 1
            return (
              <div
                key={row.headline}
                className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16"
              >
                <div
                  className={cn(
                    "lg:col-span-6",
                    mediaFirst ? "lg:order-2" : "lg:order-1",
                  )}
                >
                  <div className="flex flex-col gap-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      {row.eyebrow}
                    </span>
                    <h3 className="text-balance text-2xl font-semibold leading-[1.1] tracking-[-0.035em] sm:text-3xl">
                      {row.headline}
                    </h3>
                    <p className="max-w-lg text-sm text-muted-foreground sm:text-base">
                      {row.body}
                    </p>
                    <ul className="mt-2 flex flex-col gap-2.5">
                      {row.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-3 text-sm text-foreground"
                        >
                          <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-[2px] border border-border bg-card">
                            <Check className="size-3" />
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div
                  className={cn(
                    "lg:col-span-6",
                    mediaFirst ? "lg:order-1" : "lg:order-2",
                  )}
                >
                  <Media />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
