"use client"

import Image from "next/image"
import { ArrowRight, Orbit } from "lucide-react"

import { Button } from "@/registry/hirael/ui/button"

export default function Hero04() {
  return (
    <section
      data-slot="hero"
      className="relative isolate flex min-h-[640px] w-full flex-col overflow-hidden bg-foreground text-white"
    >
      <Image
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2400&auto=format&fit=crop"
        alt="Earth seen from orbit against deep space"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/40"
      />

      <nav
        data-slot="hero-nav"
        className="relative z-10 flex items-center justify-between gap-4 px-6 py-5 md:px-10"
      >
        <span className="flex items-center gap-2 text-base font-medium tracking-tight">
          <span className="grid size-7 place-items-center rounded-lg bg-white/10 ring-1 ring-white/20">
            <Orbit className="size-4" />
          </span>
          Orbit
        </span>
        <Button
          asChild
          size="sm"
          className="rounded-full bg-white text-black hover:bg-white/90"
        >
          <a href="#">Get started</a>
        </Button>
      </nav>

      <div className="relative z-10 flex flex-1 items-end px-6 pb-16 md:px-10 lg:pb-24">
        <div className="flex max-w-2xl flex-col items-start text-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] backdrop-blur-sm">
            Mission control
          </span>

          <h1 className="mt-6 text-balance font-serif text-5xl font-medium leading-[1.03] tracking-tight sm:text-6xl md:text-7xl">
            Launch with confidence.
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-white/75">
            Monitor every deploy, rollback, and metric from a single pane of
            glass. Catch problems before your users do.
          </p>

          <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <Button
              asChild
              size="lg"
              className="group h-12 rounded-full bg-white px-7 text-base text-black hover:bg-white/90"
            >
              <a href="#">
                Start your trial
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-12 rounded-full px-7 text-base text-white/85 hover:bg-white/10 hover:text-white"
            >
              <a href="#">Talk to sales</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
