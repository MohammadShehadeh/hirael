"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/registry/hirael/ui/button"

const WORDMARKS = [
  "ACME / Co.",
  "Helix",
  "Northwind",
  "Hirael · Labs",
  "Vanta",
  "Quartz",
] as const

export default function Hero02() {
  return (
    <section
      data-slot="hero"
      className="relative isolate overflow-hidden bg-background"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-25 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, var(--primary) 50%, transparent 100%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-6 py-24 text-center md:px-10 lg:py-32">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] backdrop-blur-sm">
          <span className="relative flex size-1.5">
            <span
              className="absolute inline-flex size-full animate-ping rounded-full opacity-75"
              style={{ background: "var(--primary)" }}
            />
            <span
              className="relative inline-flex size-1.5 rounded-full"
              style={{ background: "var(--primary)" }}
            />
          </span>
          Now in public beta
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">2026.05</span>
        </span>

        <h1 className="max-w-4xl text-balance font-serif text-5xl font-medium leading-[1.03] tracking-tight sm:text-6xl md:text-7xl">
          The component registry for{" "}
          <span className="relative whitespace-nowrap text-foreground">
            serious
            <svg
              aria-hidden
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
              className="absolute -bottom-1 start-0 h-2 w-full text-foreground/70"
            >
              <path
                d="M2 8 Q 50 2, 100 7 T 198 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          product teams.
        </h1>

        <p className="max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          Hirael ships the dense, real-world components most teams end up
          building by hand: tag input, multi-select, combobox, year picker,
          each with the dual-API contract and a design that matches your
          system.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="group rounded-full px-7">
            <a href="#">
              Get started
              <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </a>
          </Button>
          <Button asChild variant="ghost" size="lg" className="rounded-full text-foreground">
            <a href="#">
              Browse components
              <ArrowRight className="size-4 rtl:rotate-180" />
            </a>
          </Button>
        </div>

        <div className="mt-8 flex w-full flex-col items-center gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Trusted by teams shipping at scale
          </p>
          <div className="grid w-full grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
            {WORDMARKS.map((w) => (
              <div
                key={w}
                className="flex items-center justify-center bg-background px-3 py-5 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {w}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
