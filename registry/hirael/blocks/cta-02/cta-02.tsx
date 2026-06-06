"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/registry/hirael/ui/button"

export default function Cta02() {
  return (
    <section className="relative isolate overflow-hidden bg-background py-24 md:py-32">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--border) 20%, var(--border) 80%, transparent)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--border) 20%, var(--border) 80%, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% 50%, color-mix(in oklch, var(--primary) 12%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-7 px-6 text-center md:px-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground">
          · one-line install
        </span>

        <h2 className="text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-4xl md:text-5xl lg:text-6xl">
          Make your component layer{" "}
          <span className="relative inline-block">
            <span className="relative z-10">do its job.</span>
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-1 -z-0 h-3"
              style={{ background: "color-mix(in oklch, var(--primary) 35%, transparent)" }}
            />
          </span>
        </h2>

        <p className="max-w-xl text-balance text-base text-muted-foreground">
          Hirael fills the obvious gaps in shadcn — the components your team
          quietly rebuilds project after project — so you can spend that
          time on the work only you can do.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild variant="default" size="lg" className="group">
            <a href="#">
              Browse the registry
              <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
            </a>
          </Button>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            or{" "}
            <a className="underline-offset-4 hover:text-foreground hover:underline" href="#">
              read the dual-API contract
            </a>
          </span>
        </div>

        <div className="mt-2 flex max-w-full items-center gap-3 overflow-x-auto rounded-sm border border-border bg-card px-3 py-2 font-mono text-xs">
          <span className="shrink-0 text-foreground">$</span>
          <code className="whitespace-nowrap text-foreground">
            npx shadcn add{" "}
            <span className="text-muted-foreground">
              https://hirael.com/r/multi-select
            </span>
          </code>
        </div>
      </div>
    </section>
  )
}
