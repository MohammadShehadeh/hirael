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
    body: "We swapped three hand-rolled multi-selects for the MSH UI one in an afternoon. The compound API let us keep our existing layout, and the keyboard nav was finally not embarrassing in front of users.",
    initials: "MR",
    name: "Maya Renner",
    role: "Staff engineer · Plinth Labs",
  },
  {
    body: "Dual-API ended a months-long debate on our design system PR.",
    initials: "JT",
    name: "Jules Tanaka",
    role: "Design systems · Hexpoint",
  },
  {
    body: "The year picker alone would have cost me a sprint to build correctly. Drops in, theme already matches, ships.",
    initials: "AO",
    name: "Adaeze Okafor",
    role: "Founding engineer · Brella",
  },
  {
    body: "Async combobox that doesn't race itself on every keystroke. I didn't think that was a registry option.",
    initials: "SK",
    name: "Soren Kim",
    role: "Frontend lead · Verbit",
  },
  {
    body: "We're a tiny team. Stuff that used to be a 'we'll do it right in v2' is now done correctly in v1. MSH UI is the reason.",
    initials: "RP",
    name: "Reema Patel",
    role: "CTO · Lattice & Co.",
  },
  {
    body: "Pulled the tag input in, edited two lines, shipped to prod the same day. The fact that I own the source removed the whole 'will this be maintained' anxiety.",
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
            No launch tweet quotes. Just notes from engineers who pulled the
            registry into their repo and went back to building.
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
