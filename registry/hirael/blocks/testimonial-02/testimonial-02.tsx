"use client"

import * as React from "react"

type Quote = {
  body: string
  initials: string
  name: string
  role: string
}

const QUOTES: readonly Quote[] = [
  {
    body: "We swapped three hand-rolled multi-selects for this one in an afternoon. Same layout as before, and the keyboard nav finally works the way people expect.",
    initials: "MR",
    name: "Maya Renner",
    role: "Staff engineer · Plinth Labs",
  },
  {
    body: "The dual API settled a long-running argument on our design system.",
    initials: "JT",
    name: "Jules Tanaka",
    role: "Design systems · Hexpoint",
  },
  {
    body: "The year picker would have cost me a sprint to build right. This one dropped in and already matched our theme.",
    initials: "AO",
    name: "Adaeze Okafor",
    role: "Founding engineer · Brella",
  },
  {
    body: "An async combobox that doesn't race itself on every keystroke. Didn't expect to find that in a registry.",
    initials: "SK",
    name: "Soren Kim",
    role: "Frontend lead · Verbit",
  },
  {
    body: "We're a small team. Work that used to slip to 'we'll fix it in v2' now ships in v1.",
    initials: "RP",
    name: "Reema Patel",
    role: "CTO · Lattice & Co.",
  },
  {
    body: "Pulled the tag input in, changed two lines, shipped the same day. The source is ours now, so there's nothing to keep in sync.",
    initials: "DL",
    name: "Diego Larrea",
    role: "Engineer · Mercado",
  },
]

export default function Testimonial02() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="flex max-w-2xl flex-col gap-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            · what teams say
          </span>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Quiet wins, from teams shipping real product.
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Not launch-day hype, just notes from engineers who installed it
            and got back to building.
          </p>
        </div>

        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {QUOTES.map((q) => (
            <figure
              key={q.name}
              className="break-inside-avoid rounded-md border border-border bg-card p-5"
            >
              <blockquote>
                <p className="text-sm leading-relaxed text-foreground">
                  {q.body}
                </p>
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-muted font-mono text-xs font-medium text-foreground">
                  {q.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold tracking-[-0.01em]">
                    {q.name}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {q.role}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
