"use client"

import * as React from "react"

type Logo = {
  name: string
  mark: React.ReactNode
}

const LOGOS: readonly Logo[] = [
  {
    name: "Acme",
    mark: (
      <span className="font-mono text-sm font-semibold tracking-[-0.02em]">
        <span aria-hidden className="mr-1 text-primary">◆</span>
        ACME / Co.
      </span>
    ),
  },
  {
    name: "Helix",
    mark: (
      <span className="text-sm font-semibold tracking-[-0.02em]">
        <span aria-hidden className="mr-1">⌬</span>
        Helix
      </span>
    ),
  },
  {
    name: "Northwind",
    mark: (
      <span className="text-sm font-medium tracking-[0.04em] uppercase">
        Northwind
      </span>
    ),
  },
  {
    name: "Vanta",
    mark: (
      <span className="font-mono text-sm tracking-[-0.02em]">
        <span aria-hidden className="mr-1">▲</span>
        vanta
      </span>
    ),
  },
  {
    name: "Quartz",
    mark: (
      <span className="text-sm font-semibold tracking-[-0.04em]">
        Quartz<span className="text-primary">.</span>
      </span>
    ),
  },
  {
    name: "Lattice",
    mark: (
      <span className="text-sm font-medium tracking-[-0.01em]">
        <span aria-hidden className="mr-1">⬢</span>
        Lattice
      </span>
    ),
  },
  {
    name: "Plinth",
    mark: (
      <span className="font-mono text-sm tracking-[-0.02em]">
        plinth<span className="text-muted-foreground">·labs</span>
      </span>
    ),
  },
  {
    name: "Brella",
    mark: (
      <span className="text-sm font-semibold italic tracking-[-0.02em]">
        Brella
      </span>
    ),
  },
  {
    name: "Verbit",
    mark: (
      <span className="font-mono text-sm tracking-[-0.02em]">
        <span aria-hidden className="mr-1">◇</span>
        verbit
      </span>
    ),
  },
  {
    name: "Mercado",
    mark: (
      <span className="text-sm font-medium tracking-[0.08em] uppercase">
        Mercado
      </span>
    ),
  },
] as const

export default function LogoCloud01() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            · trusted by teams shipping at scale
          </span>
          <h2 className="text-balance text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
            10,000+ engineers reach for MSH UI
            <br className="hidden sm:inline" />
            <span className="text-muted-foreground"> when shadcn isn&apos;t enough.</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
          {LOGOS.map((logo) => (
            <div
              key={logo.name}
              className="group flex h-20 items-center justify-center bg-background px-4 transition-colors hover:bg-card"
              aria-label={logo.name}
            >
              <div className="text-muted-foreground transition-colors group-hover:text-foreground">
                {logo.mark}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            · 40k weekly installs · 1.2k GitHub stars · MIT
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            See the case studies →
          </a>
        </div>
      </div>
    </section>
  )
}
