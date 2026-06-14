"use client"

import * as React from "react"
import { ArrowRight, Sparkles, Terminal } from "lucide-react"

import { Button } from "@/registry/hirael/ui/button"

const STATS = [
  { value: "12", label: "components" },
  { value: "2", label: "API shapes" },
  { value: "0", label: "runtime deps" },
] as const

const REGISTRY_LINES = [
  { kind: "cmd", text: "npx shadcn add" },
  { kind: "arg", text: "  https://hirael.com/r/multi-select" },
  { kind: "out", text: "✓ resolved registry" },
  { kind: "out", text: "✓ checked dependencies" },
  { kind: "out", text: "✓ created multi-select.tsx" },
  { kind: "blank", text: "" },
  { kind: "meta", text: "components/ui/multi-select.tsx · 562 B" },
] as const

export default function Hero01() {
  return (
    <section
      data-slot="hero"
      className="relative isolate overflow-hidden bg-background"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -end-32 -top-32 -z-10 size-[460px] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "var(--primary)" }}
      />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:px-10 lg:grid-cols-12 lg:gap-16 lg:py-28">
        <div className="flex flex-col gap-7 lg:col-span-7">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] backdrop-blur-sm">
            <Sparkles className="size-3 text-foreground" />
            production-ready
          </span>

          <h1 className="text-balance font-serif text-5xl font-medium leading-[1.03] tracking-tight sm:text-6xl md:text-7xl">
            Ship the parts shadcn{" "}
            <span className="italic text-foreground">doesn&apos;t</span> include.
          </h1>

          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Multi-select, year picker, tag input, combobox: every component
            real products need but shadcn doesn&apos;t ship. Copied straight
            into your repo via the CLI. Two APIs per component. No runtime
            dependency.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="group rounded-full px-7">
              <a href="#">
                Get started
                <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-7">
              <a href="#">Browse the registry</a>
            </Button>
          </div>

          <dl className="mt-2 grid grid-cols-3 overflow-hidden rounded-2xl border border-border bg-card/40">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className={i > 0 ? "border-s border-border px-5 py-4" : "px-5 py-4"}
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="mt-1 font-serif text-3xl font-medium tabular-nums">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex items-start lg:col-span-5">
          <div
            className="relative w-full overflow-hidden rounded-2xl border border-border bg-card/70 backdrop-blur-sm"
            style={{
              boxShadow:
                "0 24px 60px -30px color-mix(in oklch, var(--foreground) 30%, transparent)",
            }}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                <Terminal className="size-3" />
                hirael/install.sh
              </span>
              <div className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-border" />
                <span className="size-1.5 rounded-full bg-border" />
                <span className="size-1.5 rounded-full bg-foreground" />
              </div>
            </div>

            <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-[1.7]">
              <code>
                {REGISTRY_LINES.map((line, i) => (
                  <span key={i} className="block">
                    {line.kind === "cmd" && (
                      <>
                        <span className="text-foreground">$</span>{" "}
                        <span className="text-foreground">{line.text.slice(2)}</span>
                      </>
                    )}
                    {line.kind === "arg" && (
                      <span className="text-muted-foreground">{line.text}</span>
                    )}
                    {line.kind === "out" && (
                      <span className="text-foreground/70">{line.text}</span>
                    )}
                    {line.kind === "blank" && <span>&nbsp;</span>}
                    {line.kind === "meta" && (
                      <span className="text-muted-foreground">{line.text}</span>
                    )}
                  </span>
                ))}
              </code>
            </pre>

            <div className="border-t border-border bg-background/50 px-4 py-2.5">
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
