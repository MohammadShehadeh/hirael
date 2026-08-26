"use client";

import * as React from "react";

interface Quote {
  body: string;
  initials: string;
  name: string;
  role: string;}

const QUOTES: readonly Quote[] = [
  {
    body: "The compound APIs are identical to shadcn, so onboarding was zero. We composed a whole settings page out of these in an afternoon.",
    initials: "MR",
    name: "Maya Renner",
    role: "Staff engineer · Plinth Labs",
  },
  {
    body: "Light and dark are true inverses, which almost no kit gets right. I stopped patching contrast bugs.",
    initials: "JT",
    name: "Jules Tanaka",
    role: "Design systems · Hexpoint",
  },
  {
    body: "RTL just worked. We flipped the locale and didn't have to touch a single component.",
    initials: "AO",
    name: "Adaeze Okafor",
    role: "Founding engineer · Brella",
  },
  {
    body: "It's source in our repo, not another dependency to keep up with. That's what sold the team.",
    initials: "SK",
    name: "Soren Kim",
    role: "Frontend lead · Verbit",
  },
  {
    body: "We replaced three half-finished internal components in a morning and deleted a lot of code.",
    initials: "RP",
    name: "Reema Patel",
    role: "CTO · Lattice & Co.",
  },
  {
    body: "The blocks gave us a real landing page on day one. We swapped the copy and colors and shipped.",
    initials: "DL",
    name: "Diego Larrea",
    role: "Engineer · Mercado",
  },
];

const Testimonial02 = () => {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="container w-full">
        <div className="flex max-w-2xl flex-col gap-5">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">
            <span className="size-1 rounded-full bg-foreground" />
            What teams say
          </span>
          <h2 className="font-serif text-4xl font-medium leading-[1.04] tracking-tight sm:text-5xl">
            What people are{" "}
            <span className="italic text-foreground">actually</span> saying.
          </h2>
          <p className="text-base text-muted-foreground sm:text-lg">
            Notes from engineers and designers building with the catalog in
            production.
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
  );
};

export default Testimonial02;
