"use client"

import * as React from "react"
import { ArrowRight, Sparkles, Terminal } from "lucide-react"

import { Button } from "@/registry/sabk/ui/button"

const STATS = [
  { value: "12", label: "components" },
  { value: "2", label: "API shapes" },
  { value: "0", label: "runtime deps" },
] as const

const REGISTRY_LINES = [
  { kind: "cmd", text: "npx shadcn add" },
  { kind: "arg", text: "  https://sabk.dev/r/multi-select" },
  { kind: "out", text: "✓ resolved registry" },
  { kind: "out", text: "✓ checked dependencies" },
  { kind: "out", text: "✓ created multi-select.tsx" },
  { kind: "blank", text: "" },
  { kind: "meta", text: "components/ui/multi-select.tsx · 562 B" },
] as const

export default function Hero01() {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 -z-10 size-[420px] rounded-full opacity-[0.15] blur-3xl"
        style={{ background: "var(--forge)" }}
      />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 py-20 md:px-10 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="flex flex-col gap-8 lg:col-span-7">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-sm border-2 border-border bg-card px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">
            <Sparkles className="size-3 text-forge" />
            v0.1 · production-ready
          </span>

          <h1 className="text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-7xl">
            Ship the parts shadcn{" "}
            <span className="text-forge">doesn&apos;t</span>{" "}
            include.
          </h1>

          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Multi-select, year picker, tag input, combobox — every component
            real products need but shadcn doesn&apos;t ship. Copied straight
            into your repo via the CLI. Two APIs per component. No runtime
            dependency.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="forge" size="lg" className="group">
              Get started
              <ArrowRight className="size-4 transition-transform duration-150 ease-[var(--ease-forge)] group-hover:translate-x-0.5" />
            </Button>
            <Button variant="outline" size="lg">
              Browse the registry
            </Button>
          </div>

          <dl className="mt-4 grid grid-cols-3 divide-x-2 divide-border border-y-2 border-border">
            {STATS.map((s, i) => (
              <div key={s.label} className={i === 0 ? "py-4 pr-4" : "p-4"}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="mt-1 font-mono text-2xl font-medium tabular-nums">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex items-start lg:col-span-5">
          <div
            className="relative w-full rounded-sm border-2 border-border bg-card"
            style={{ boxShadow: "8px 8px 0 0 var(--border)" }}
          >
            <div className="flex items-center justify-between border-b-2 border-border px-4 py-2.5">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <Terminal className="size-3" />
                sabk/install.sh
              </span>
              <div className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-border" />
                <span className="size-1.5 rounded-full bg-border" />
                <span className="size-1.5 rounded-full bg-forge" />
              </div>
            </div>

            <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-[1.7]">
              <code>
                {REGISTRY_LINES.map((line, i) => (
                  <span key={i} className="block">
                    {line.kind === "cmd" && (
                      <>
                        <span className="text-forge">$</span>{" "}
                        <span className="text-foreground">{line.text.slice(2)}</span>
                      </>
                    )}
                    {line.kind === "arg" && (
                      <span className="text-muted-foreground">{line.text}</span>
                    )}
                    {line.kind === "out" && (
                      <span className="text-emerald-500">{line.text}</span>
                    )}
                    {line.kind === "blank" && <span>&nbsp;</span>}
                    {line.kind === "meta" && (
                      <span className="text-muted-foreground">{line.text}</span>
                    )}
                  </span>
                ))}
              </code>
            </pre>

            <div className="border-t-2 border-border bg-background/60 px-4 py-2.5">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.1em]">
                <span className="text-muted-foreground">added</span>
                <span className="text-foreground">multi-select.tsx</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
