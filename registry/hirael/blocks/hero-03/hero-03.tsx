"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/registry/hirael/ui/button";

const LOGOS = ["Helix", "Northwind", "Vanta", "Quartz", "Lumen"] as const;

export default function Hero03() {
  return (
    <section
      data-slot="hero"
      className="relative isolate overflow-hidden bg-background"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--foreground) 50%, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[520px] -translate-x-1/2 rounded-full opacity-[0.08] blur-3xl"
        style={{ background: "var(--foreground)" }}
      />

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8 px-6 py-24 text-center md:px-10 lg:py-32">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur-sm">
          Since 2021 — One calm workspace
        </span>

        <h1 className="max-w-3xl text-balance font-serif text-5xl font-medium leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
          Software that respects your time.
        </h1>

        <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          Plan, build, and ship from one workspace your whole team will actually
          enjoy using. No tab sprawl, no busywork.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="group h-12 rounded-full px-7 text-base"
          >
            <a href="#">
              Start free
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-full px-7 text-base"
          >
            <a href="#">Book a demo</a>
          </Button>
        </div>

        <div className="mt-12 flex w-full flex-col items-center gap-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {LOGOS.map((logo) => (
              <span
                key={logo}
                className="font-serif text-xl text-muted-foreground/70 transition-colors hover:text-foreground"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
