import Link from "next/link"

import { cn } from "@/lib/utils"

export type Crumb = {
  label: string
  /** Omit on the final, current crumb so it renders as plain text. */
  href?: string
}

/**
 * Hierarchy trail shown above category and detail pages. Slash separators
 * stay neutral under RTL, so there's nothing directional to flip.
 */
export function Breadcrumbs({
  items,
  className,
}: {
  items: Crumb[]
  className?: string
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground",
        className
      )}
    >
      {items.map((item, i) => {
        const last = i === items.length - 1
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-2">
            {item.href && !last ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className={last ? "text-foreground" : undefined}>
                {item.label}
              </span>
            )}
            {!last && <span className="text-muted-foreground/50">/</span>}
          </span>
        )
      })}
    </nav>
  )
}
