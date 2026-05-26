"use client"

import * as React from "react"
import { ArrowRight, Clock } from "lucide-react"

import { Badge } from "@/registry/msh-ui/ui/badge"
import { Button } from "@/registry/msh-ui/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/msh-ui/ui/card"
import { Separator } from "@/registry/msh-ui/ui/separator"

type Post = {
  category: string
  title: string
  excerpt: string
  author: { name: string; initials: string }
  date: string
  readMin: number
  href: string
  /** Optional cover image URL. If absent, a stylized placeholder renders. */
  cover?: string
}

const FEATURED: Post = {
  category: "Engineering",
  title: "Why we shipped the same component twice — and why you should too.",
  excerpt:
    "Every MSH UI primitive exposes a compound surface and a single-prop surface in the same file. Here's the design contract behind it, and the four bugs it quietly prevented in production.",
  author: { name: "Mohammad Shehadeh", initials: "MS" },
  date: "May 22 · 2026",
  readMin: 9,
  href: "#",
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
    href: "#",
  },
  {
    category: "Design",
    title: "The 1px border, and other invisible decisions.",
    excerpt:
      "How a single token decision propagates through every surface in the registry — and why we picked 0.65rem.",
    author: { name: "Jules Tanaka", initials: "JT" },
    date: "May 06",
    readMin: 4,
    href: "#",
  },
  {
    category: "Release",
    title: "v1.3 · year picker, eyedropper, dense data tables.",
    excerpt:
      "Three new primitives, a quiet API revision to combobox, and a long-deferred fix for SSR hydration in tag-input.",
    author: { name: "Adaeze Okafor", initials: "AO" },
    date: "Apr 29",
    readMin: 3,
    href: "#",
  },
  {
    category: "Field notes",
    title: "Shipping for design systems teams, by design systems teams.",
    excerpt:
      "What we learned watching three platform teams swap our components into their codebase over a sprint.",
    author: { name: "Soren Kim", initials: "SK" },
    date: "Apr 18",
    readMin: 7,
    href: "#",
  },
]

function PostCover({
  cover,
  alt,
  category,
  featured,
}: {
  cover?: string
  alt: string
  category: string
  featured?: boolean
}) {
  if (cover) {
    return (
      <div className="relative size-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={alt}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end gap-2 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-4">
          {featured && <Badge>Featured</Badge>}
          <Badge variant="outline" className="border-white/30 text-white">
            {category}
          </Badge>
        </div>
      </div>
    )
  }

  return (
    <div className="relative size-full overflow-hidden bg-card">
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
      <div className="absolute inset-0 flex items-end p-4">
        <div className="flex items-center gap-2">
          {featured && <Badge>Featured</Badge>}
          <Badge variant="outline">{category}</Badge>
        </div>
      </div>
    </div>
  )
}

export default function Blog01() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <div className="flex flex-col gap-5 border-b border-border pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex max-w-xl flex-col gap-4">
            <Badge variant="outline" className="w-fit">
              · journal
            </Badge>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
              Writing from the workshop.
            </h2>
            <p className="text-base text-muted-foreground">
              Patterns, release notes, and field reports from teams putting MSH
              UI to work — no launch tweets, no growth posts.
            </p>
          </div>
          <Button variant="link" className="group h-auto p-0" asChild>
            <a href="#">
              All posts
              <ArrowRight className="size-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
            </a>
          </Button>
        </div>

        <Card className="group mt-10 gap-0 overflow-hidden p-0 transition-colors hover:border-foreground/30 focus-within:border-foreground/30">
          <article
            aria-labelledby="blog-01-featured-title"
            className="relative grid grid-cols-1 lg:grid-cols-12"
          >
            <a
              href={FEATURED.href}
              aria-hidden
              tabIndex={-1}
              className="block aspect-[16/10] lg:col-span-7 lg:aspect-auto"
            >
              <PostCover
                cover={FEATURED.cover}
                alt={FEATURED.title}
                category={FEATURED.category}
                featured
              />
            </a>

            <div className="flex flex-col gap-4 p-6 lg:col-span-5 lg:p-8">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {FEATURED.date} · {FEATURED.readMin} min read
              </span>
              <h3
                id="blog-01-featured-title"
                className="text-balance text-2xl font-semibold leading-[1.15] tracking-[-0.025em] sm:text-3xl"
              >
                <a
                  href={FEATURED.href}
                  className="after:absolute after:inset-0 focus-visible:outline-none"
                >
                  {FEATURED.title}
                </a>
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {FEATURED.excerpt}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <span className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-muted font-mono text-xs font-medium text-foreground">
                  {FEATURED.author.initials}
                </span>
                <span className="text-sm text-foreground">
                  {FEATURED.author.name}
                </span>
              </div>
              <Button
                asChild
                variant="default"
                className="group/cta relative z-10 mt-2 w-fit"
              >
                <a href={FEATURED.href}>
                  Read the post
                  <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover/cta:translate-x-0.5" />
                </a>
              </Button>
            </div>
          </article>
        </Card>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {POSTS.map((p) => {
            const titleId = `blog-01-post-${p.title.replace(/\s+/g, "-").slice(0, 24)}`
            return (
              <Card
                key={p.title}
                className="group relative gap-0 overflow-hidden p-0 transition-colors hover:border-foreground/30 focus-within:border-foreground/30"
              >
                <article aria-labelledby={titleId} className="contents">
                  {p.cover && (
                    <a
                      href={p.href}
                      aria-hidden
                      tabIndex={-1}
                      className="block aspect-[16/10] overflow-hidden"
                    >
                      <PostCover cover={p.cover} alt={p.title} category={p.category} />
                    </a>
                  )}
                  <CardHeader className="px-5 pt-5">
                    <div className="flex items-center justify-between">
                      {!p.cover ? (
                        <Badge variant="outline">{p.category}</Badge>
                      ) : (
                        <span aria-hidden />
                      )}
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                        <Clock className="size-2.5" />
                        {p.readMin}m
                      </span>
                    </div>
                    <CardTitle
                      id={titleId}
                      className="mt-2 text-balance text-base leading-snug tracking-[-0.01em]"
                    >
                      <a
                        href={p.href}
                        className="after:absolute after:inset-0 focus-visible:outline-none"
                      >
                        {p.title}
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 py-4">
                    <CardDescription className="line-clamp-3">
                      {p.excerpt}
                    </CardDescription>
                  </CardContent>
                  <Separator />
                  <CardFooter className="px-5 py-4">
                    <div className="flex w-full items-center justify-between gap-3">
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
                  </CardFooter>
                </article>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
