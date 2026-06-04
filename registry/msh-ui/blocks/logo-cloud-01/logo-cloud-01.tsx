"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"

import { Badge } from "@/registry/msh-ui/ui/badge"
import { Button } from "@/registry/msh-ui/ui/button"

type Logo = {
  name: string
  href: string
  mark: React.ReactNode
}

const LOGOS: readonly Logo[] = [
  {
    name: "Acme",
    href: "#",
    mark: (
      <span className="font-mono text-sm font-semibold tracking-[-0.02em]">
        <span aria-hidden className="mr-1 text-primary">◈</span>
        ACME / Co.
      </span>
    ),
  },
  {
    name: "Helix",
    href: "#",
    mark: (
      <span className="text-sm font-semibold tracking-[-0.02em]">
        <span aria-hidden className="mr-1">⌬</span>
        Helix
      </span>
    ),
  },
  {
    name: "Northwind",
    href: "#",
    mark: (
      <span className="text-sm font-medium uppercase tracking-[0.04em]">
        Northwind
      </span>
    ),
  },
  {
    name: "Vanta",
    href: "#",
    mark: (
      <span className="font-mono text-sm tracking-[-0.02em]">
        <span aria-hidden className="mr-1">▲</span>
        vanta
      </span>
    ),
  },
  {
    name: "Quartz",
    href: "#",
    mark: (
      <span className="text-sm font-semibold tracking-[-0.04em]">
        Quartz<span className="text-primary">.</span>
      </span>
    ),
  },
  {
    name: "Lattice",
    href: "#",
    mark: (
      <span className="text-sm font-medium tracking-[-0.01em]">
        <span aria-hidden className="mr-1">⬢</span>
        Lattice
      </span>
    ),
  },
  {
    name: "Plinth",
    href: "#",
    mark: (
      <span className="font-mono text-sm tracking-[-0.02em]">
        plinth<span className="text-muted-foreground">·labs</span>
      </span>
    ),
  },
  {
    name: "Brella",
    href: "#",
    mark: (
      <span className="text-sm font-semibold italic tracking-[-0.02em]">
        Brella
      </span>
    ),
  },
  {
    name: "Verbit",
    href: "#",
    mark: (
      <span className="font-mono text-sm tracking-[-0.02em]">
        <span aria-hidden className="mr-1">◇</span>
        verbit
      </span>
    ),
  },
  {
    name: "Mercado",
    href: "#",
    mark: (
      <span className="text-sm font-medium uppercase tracking-[0.08em]">
        Mercado
      </span>
    ),
  },
] as const

const STATS = [
  { value: "40k", label: "weekly installs" },
  { value: "1.2k", label: "github stars" },
  { value: "MIT", label: "license" },
] as const

export default function LogoCloud01() {
  return (
    <section
      className="bg-background py-20 sm:py-28"
      aria-labelledby="logo-cloud-01-heading"
    >
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <Badge variant="outline">
            · trusted by teams shipping at scale
          </Badge>
          <h2
            id="logo-cloud-01-heading"
            className="text-balance text-2xl font-semibold tracking-[-0.035em] sm:text-3xl"
          >
            10,000+ engineers reach for MSH UI
            <br className="hidden sm:inline" />
            <span className="text-muted-foreground">
              {" "}
              when shadcn isn&apos;t enough.
            </span>
          </h2>
        </div>

        <ul
          aria-label="Customer logos"
          className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3 lg:grid-cols-5"
        >
          {LOGOS.map((logo) => (
            <li key={logo.name} className="bg-background">
              <a
                href={logo.href}
                aria-label={`Read ${logo.name}'s case study`}
                className="group flex h-20 items-center justify-center px-4 transition-colors hover:bg-card focus-visible:outline-none focus-visible:bg-card focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50"
              >
                <span className="text-muted-foreground transition-colors group-hover:text-foreground">
                  {logo.mark}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <dl className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:gap-6">
            {STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && (
                  <span aria-hidden className="text-muted-foreground/40">
                    ·
                  </span>
                )}
                <div className="flex items-baseline gap-1.5">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-mono text-sm font-semibold tabular-nums text-foreground">
                    {s.value}
                  </dd>
                  <span>{s.label}</span>
                </div>
              </React.Fragment>
            ))}
          </dl>
          <Button variant="link" className="group h-auto p-0" asChild>
            <a href="#">
              See the case studies
              <ArrowRight className="size-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
