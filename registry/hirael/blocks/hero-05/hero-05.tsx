"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { ArrowRight, Cloud } from "lucide-react"

import { Button } from "@/registry/hirael/ui/button"

const Hero05Backdrop = dynamic(() => import("./hero-05-backdrop"), {
  ssr: false,
  loading: () => <div className="size-full bg-muted/20" />,
})

const AVATARS = [
  "photo-1500648767791-00dcc994a43e",
  "photo-1494790108377-be9c29b29330",
  "photo-1507003211169-0a1dd7228f2d",
  "photo-1438761681033-6461ffad8d80",
] as const

const NAV_LINKS = ["Product", "Docs", "Pricing"] as const

export default function Hero05() {
  const [active, setActive] = React.useState(false)

  return (
    <section
      data-slot="hero"
      className="flex w-full items-center justify-center bg-background px-4 py-12 md:px-6"
    >
      <div
        className="relative w-full max-w-7xl"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        <div className="relative isolate flex min-h-[680px] flex-col overflow-hidden rounded-[40px] border border-border bg-card text-card-foreground shadow-sm">
          <div
            aria-hidden
            data-slot="hero-backdrop"
            className="pointer-events-none absolute inset-0 opacity-70 mix-blend-multiply dark:opacity-50 dark:mix-blend-screen"
          >
            <Hero05Backdrop active={active} />
          </div>

          <nav
            data-slot="hero-nav"
            className="relative z-10 flex items-center justify-between gap-4 px-6 py-5 md:px-10"
          >
            <span className="flex items-center gap-2 text-base font-medium tracking-tight text-foreground">
              <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15">
                <Cloud className="size-4" />
              </span>
              Nimbus
            </span>
            <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="transition-colors hover:text-foreground"
                >
                  {link}
                </a>
              ))}
            </div>
            <Button asChild size="sm" className="rounded-full">
              <a href="#">Get started</a>
            </Button>
          </nav>

          <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-16 md:px-10">
            <div className="flex max-w-2xl flex-col items-center rounded-[32px] border border-border/60 bg-background/40 px-6 py-12 text-center backdrop-blur-md md:px-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] backdrop-blur-sm">
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
                All systems online
              </span>

              <h1 className="mt-7 text-balance font-serif text-5xl font-medium leading-[1.04] tracking-tight text-foreground sm:text-6xl md:text-7xl">
                Bring your ideas together.
              </h1>

              <p className="mt-5 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
                A shared canvas for notes, tasks, and docs — so your team always
                knows what&apos;s next.
              </p>

              <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="group h-12 rounded-full px-7 text-base"
                >
                  <a href="#">
                    Try it free
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="h-12 rounded-full px-7 text-base"
                >
                  <a href="#">See how it works</a>
                </Button>
              </div>

              <div className="mt-10 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {AVATARS.map((id) => (
                    <Image
                      key={id}
                      src={`https://images.unsplash.com/${id}?q=80&w=80&h=80&auto=format&fit=crop&crop=faces`}
                      alt=""
                      width={32}
                      height={32}
                      className="size-8 rounded-full border-2 border-card object-cover"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  Join 2,000+ teams already on board
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
