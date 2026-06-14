"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { ArrowRight, Play } from "lucide-react"

import { Button } from "@/registry/hirael/ui/button"

const Hero02Backdrop = dynamic(() => import("./hero-02-backdrop"), {
  ssr: false,
  loading: () => <div className="size-full bg-foreground" />,
})

const WORDMARKS = ["Helix", "Northwind", "Vanta", "Quartz", "Lumen", "Atlas"] as const

export default function Hero02() {
  const [active, setActive] = React.useState(false)

  return (
    <section
      data-slot="hero"
      className="relative isolate flex min-h-[640px] flex-col items-center justify-center overflow-hidden bg-foreground px-6 py-24 text-center text-background md:px-10"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <div
        aria-hidden
        data-slot="hero-backdrop"
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_72%)]"
      >
        <Hero02Backdrop active={active} />
      </div>

      <span className="inline-flex items-center gap-2 rounded-full border border-background/15 bg-background/5 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] backdrop-blur-sm">
        <span className="relative flex size-1.5">
          <span
            className="absolute inline-flex size-full animate-ping rounded-full opacity-75"
            style={{ background: "var(--accent-cool)" }}
          />
          <span
            className="relative inline-flex size-1.5 rounded-full"
            style={{ background: "var(--accent-cool)" }}
          />
        </span>
        Live
        <span className="text-background/50">·</span>
        <span className="text-background/50">2026.06</span>
      </span>

      <h1 className="mt-8 max-w-4xl text-balance font-serif text-5xl font-medium leading-[1.04] tracking-tight sm:text-6xl md:text-7xl">
        Ship faster with tools that stay{" "}
        <span className="italic underline decoration-background/30 decoration-2 underline-offset-[10px]">
          out of your way
        </span>
        .
      </h1>

      <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-background/70">
        A focused toolkit for teams that would rather build than configure.
        Sensible defaults, no busywork.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <Button
          asChild
          size="lg"
          className="group h-12 rounded-full bg-background px-7 text-base text-foreground hover:bg-background/90"
        >
          <a href="#">
            Get started
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
          </a>
        </Button>
        <Button
          asChild
          size="lg"
          variant="ghost"
          className="h-12 rounded-full px-7 text-base text-background/80 hover:bg-background/10 hover:text-background"
        >
          <a href="#">
            <Play className="size-4" />
            Watch demo
          </a>
        </Button>
      </div>

      <div className="mt-16 flex flex-col items-center gap-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-background/45">
          Trusted by teams shipping at scale
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {WORDMARKS.map((w) => (
            <span
              key={w}
              className="font-serif text-lg text-background/55 transition-colors hover:text-background"
            >
              {w}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
