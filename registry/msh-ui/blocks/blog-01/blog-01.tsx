"use client"

import * as React from "react"
import { ArrowRight, Clock } from "lucide-react"

type Post = {
  category: string
  title: string
  excerpt: string
  author: { name: string; initials: string }
  date: string
  readMin: number
}

const FEATURED: Post = {
  category: "Engineering",
  title: "Why we shipped the same component twice — and why you should too.",
  excerpt:
    "Every MSH UI primitive exposes a compound surface and a single-prop surface in the same file. Here&rsquo;s the design contract behind it, and the four bugs it quietly prevented in production.",
  author: { name: "Mohammad Shehadeh", initials: "MS" },
  date: "May 22 · 2026",
  readMin: 9,
}

const POSTS: readonly Post[] = [
  {
    category: "Patterns",
    title: "Async combobox without the race conditions.",
    excerpt:
      "A debounced loader, a stable request id, and an abort signal walk into a useEffect…",
    author: { name: "Maya Renner", initials: "MR" },
    date: "May 14",
    readMin: 5,
  },
  {
    category: "Design",
    title: "The 1px border, and other invisible decisions.",
    excerpt:
      "How a single token decision propagates through every surface in the registry — and why we picked 0.65rem.",
    author: { name: "Jules Tanaka", initials: "JT" },
    date: "May 06",
    readMin: 4,
  },
  {
    category: "Release",
    title: "v1.3 · year picker, eyedropper, dense data tables.",
    excerpt:
      "Three new primitives, a quiet API revision to combobox, and a long-deferred fix for SSR hydration in tag-input.",
    author: { name: "Adaeze Okafor", initials: "AO" },
    date: "Apr 29",
    readMin: 3,
  },
  {
    category: "Field notes",
    title: "Shipping for design systems teams, by design systems teams.",
    excerpt:
      "What we learned watching three platform teams swap our components into their codebase over a sprint.",
    author: { name: "Soren Kim", initials: "SK" },
    date: "Apr 18",
    readMin: 7,
  },
]

export default function Blog01() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="flex flex-col gap-5 border-b border-border pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-xl flex-col gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              · journal
            </span>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Writing from the workshop.
            </h2>
            <p className="text-base text-muted-foreground">
              Patterns, release notes, and field reports from teams putting MSH
              UI to work — no launch tweets, no growth posts.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            All posts →
          </a>
        </div>

        <article className="group mt-10 grid grid-cols-1 gap-8 border-b border-border pb-10 lg:grid-cols-12">
          <a
            href="#"
            className="relative col-span-1 block aspect-[16/10] overflow-hidden rounded-md border border-border bg-card lg:col-span-7"
            aria-label={FEATURED.title}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full opacity-[0.18] blur-3xl"
              style={{ background: "var(--primary)" }}
            />
            <div className="absolute inset-0 flex items-end p-6">
              <div className="flex flex-col gap-1">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-sm border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-foreground">
                  Featured
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {FEATURED.category}
                </span>
              </div>
            </div>
          </a>

          <div className="flex flex-col gap-4 lg:col-span-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
              {FEATURED.date} · {FEATURED.readMin} min read
            </span>
            <h3 className="text-balance text-2xl font-semibold leading-[1.15] tracking-[-0.025em] sm:text-3xl">
              <a
                href="#"
                className="transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {FEATURED.title}
              </a>
            </h3>
            <p
              className="text-sm leading-relaxed text-muted-foreground sm:text-base"
              dangerouslySetInnerHTML={{ __html: FEATURED.excerpt }}
            />
            <div className="mt-2 flex items-center gap-3">
              <span className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-muted font-mono text-xs font-medium text-foreground">
                {FEATURED.author.initials}
              </span>
              <span className="text-sm text-foreground">
                {FEATURED.author.name}
              </span>
            </div>
            <a
              href="#"
              className="group/cta mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground"
            >
              Read the post
              <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover/cta:translate-x-0.5" />
            </a>
          </div>
        </article>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {POSTS.map((p) => (
            <article
              key={p.title}
              className="group flex flex-col gap-3 rounded-md border border-border bg-card/40 p-5 transition-colors hover:bg-card"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  {p.category}
                </span>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  <Clock className="size-2.5" />
                  {p.readMin}m
                </span>
              </div>
              <h3 className="text-balance text-base font-semibold leading-snug tracking-[-0.01em]">
                <a
                  href="#"
                  className="transition-colors group-hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {p.title}
                </a>
              </h3>
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {p.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex size-6 items-center justify-center rounded-full border border-border bg-muted font-mono text-[10px] font-medium text-foreground">
                    {p.author.initials}
                  </span>
                  <span className="truncate text-xs text-foreground">
                    {p.author.name}
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  {p.date}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
