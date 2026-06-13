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
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    initials: "MR",
    name: "Maya Renner",
    role: "Staff engineer · Plinth Labs",
  },
  {
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    initials: "JT",
    name: "Jules Tanaka",
    role: "Design systems · Hexpoint",
  },
  {
    body: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
    initials: "AO",
    name: "Adaeze Okafor",
    role: "Founding engineer · Brella",
  },
  {
    body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
    initials: "SK",
    name: "Soren Kim",
    role: "Frontend lead · Verbit",
  },
  {
    body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
    initials: "RP",
    name: "Reema Patel",
    role: "CTO · Lattice & Co.",
  },
  {
    body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
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
            What people are saying.
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
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
