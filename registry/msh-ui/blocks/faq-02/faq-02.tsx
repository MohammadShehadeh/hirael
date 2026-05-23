"use client"

import * as React from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/msh-ui/ui/accordion"

const FAQS = [
  {
    q: "Do I need to install a package?",
    a: "No. MSH UI is a registry — components copy straight into your repo via the shadcn CLI. Zero runtime dependency.",
  },
  {
    q: "Will updates break my code?",
    a: "You own the copied source, so updates are opt-in. Re-run the install command to pull the latest, then diff and merge.",
  },
  {
    q: "Is it compatible with shadcn themes?",
    a: "Yes. Same CSS variables. Any shadcn theme works out of the box.",
  },
  {
    q: "What about accessibility?",
    a: "Every shipped component is keyboard-navigable with proper ARIA roles. We test focus management before tagging stable.",
  },
  {
    q: "Can I use it with Pages Router?",
    a: "Yes. Components are React-first and framework-agnostic — App Router, Pages Router, Remix, anywhere React runs.",
  },
  {
    q: "Is it really free?",
    a: "MIT-licensed and free, forever. The source is on GitHub. No paywall, no telemetry.",
  },
] as const

export default function Faq02() {
  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 md:px-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground">
            ◆ frequently asked
          </span>
          <h2 className="max-w-2xl text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-4xl md:text-5xl">
            Everything you&apos;d ask in the first ten minutes.
          </h2>
          <p className="max-w-xl text-balance text-sm text-muted-foreground">
            Short answers first. If something isn&apos;t here, the issue
            tracker is open and we usually respond within a day.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-0 lg:grid-cols-2">
          {[FAQS.slice(0, 3), FAQS.slice(3)].map((col, ci) => (
            <Accordion
              key={ci}
              type="multiple"
              defaultValue={ci === 0 ? ["item-0-0"] : []}
              className="border-y border-border lg:border-y"
            >
              {col.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`item-${ci}-${i}`}
                  className="px-1"
                >
                  <AccordionTrigger>
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        Q{ci * 3 + i + 1}
                      </span>
                      <span>{f.q}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="ml-8">{f.a}</div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  )
}
