"use client"

import * as React from "react"
import { ArrowRight, Github } from "lucide-react"

import { Button } from "@/registry/hirael/ui/button"

export default function Cta01() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
        <div
          className="relative rounded-sm border border-border bg-card"
          style={{ boxShadow: "10px 10px 0 0 var(--border)" }}
        >
          <span
            aria-hidden
            className="absolute -left-1.5 -top-1.5 size-3 rounded-[2px] bg-foreground"
          />
          <span
            aria-hidden
            className="absolute -right-1.5 -top-1.5 size-3 rounded-[2px] border border-foreground bg-background"
          />
          <span
            aria-hidden
            className="absolute -bottom-1.5 -left-1.5 size-3 rounded-[2px] border border-foreground bg-background"
          />
          <span
            aria-hidden
            className="absolute -bottom-1.5 -right-1.5 size-3 rounded-[2px] bg-foreground"
          />

          <div className="grid grid-cols-1 gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            <div className="flex flex-col gap-5 lg:col-span-7">
              <span className="inline-flex w-fit items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">
                <span className="size-1 rounded-full bg-foreground" />
                Get started
              </span>
              <h2 className="text-balance text-2xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-3xl md:text-4xl lg:text-5xl">
                Stop rebuilding the components{" "}
                <span className="text-foreground">every project</span> needs.
              </h2>
              <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
                Pull a real multi-select, year picker, or tag input into your
                repo in one command. No package, no version pin — just the
                source, in your codebase, yours to shape.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:col-span-5 lg:items-end">
              <Button
                asChild
                variant="default"
                size="lg"
                className="group w-full justify-between lg:w-auto"
              >
                <a href="#">
                  Install via shadcn CLI
                  <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full justify-between lg:w-auto"
              >
                <a href="#">
                  <span className="inline-flex items-center gap-2">
                    <Github className="size-4" />
                    Star on GitHub
                  </span>
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                    1.2k
                  </span>
                </a>
              </Button>
              <p className="text-right font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                MIT · no runtime dependency
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
