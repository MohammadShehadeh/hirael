"use client"

import * as React from "react"
import { Github, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { SITE } from "@/lib/site"

const STAR_CACHE_KEY = "forgecn:gh-stars:v1"
const STAR_CACHE_TTL = 1000 * 60 * 30 // 30 minutes

function readCachedStars(): { value: number; cachedAt: number } | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(STAR_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { value: number; cachedAt: number }
    if (
      typeof parsed.value !== "number" ||
      typeof parsed.cachedAt !== "number"
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeCachedStars(value: number) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(
      STAR_CACHE_KEY,
      JSON.stringify({ value, cachedAt: Date.now() })
    )
  } catch {
    // ignore
  }
}

function formatCount(n: number): string {
  if (n < 1000) return `${n}`
  if (n < 10_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`
  return `${Math.round(n / 1000)}k`
}

export function GitHubStars({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  const [stars, setStars] = React.useState<number | null>(() => {
    const cached = readCachedStars()
    return cached?.value ?? null
  })

  React.useEffect(() => {
    let cancelled = false
    const cached = readCachedStars()
    const fresh = cached && Date.now() - cached.cachedAt < STAR_CACHE_TTL
    if (fresh) return

    ;(async () => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${SITE.githubOwner}/${SITE.githubRepo}`,
          {
            headers: { Accept: "application/vnd.github+json" },
          }
        )
        if (!res.ok) return
        const data = (await res.json()) as { stargazers_count?: number }
        if (cancelled || typeof data.stargazers_count !== "number") return
        setStars(data.stargazers_count)
        writeCachedStars(data.stargazers_count)
      } catch {
        // network/offline — keep cached or null
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <a
      href={SITE.githubUrl}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={
        stars !== null
          ? `GitHub repository — ${stars} stars`
          : "GitHub repository"
      }
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-md border border-border bg-card text-foreground transition-colors hover:border-foreground/40 hover:bg-accent",
        compact ? "h-8 px-2" : "h-8 pl-2 pr-0",
        className
      )}
    >
      <Github className="size-3.5" aria-hidden />
      {!compact && (
        <span className="font-mono text-[11px] uppercase tracking-[0.08em]">
          star
        </span>
      )}
      {!compact && (
        <span
          className="flex h-full items-center gap-1 border-l border-border bg-background px-2 font-mono text-[11px] tabular-nums transition-colors group-hover:bg-accent"
          aria-hidden
        >
          <Star className="size-3 fill-foreground/70 text-foreground/70 transition-colors group-hover:fill-foreground group-hover:text-foreground" />
          {stars !== null ? formatCount(stars) : "—"}
        </span>
      )}
      {compact && stars !== null && (
        <span className="font-mono text-[11px] tabular-nums">
          {formatCount(stars)}
        </span>
      )}
    </a>
  )
}
