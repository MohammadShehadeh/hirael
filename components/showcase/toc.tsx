"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type TocItem = { id: string; label: string };

/**
 * "On this page" rail — the right-column table of contents shadcn/ui's docs
 * carry. It mirrors the sections ComponentPage renders (single source of
 * truth: the same descriptor list feeds the content and this nav) and
 * scroll-spies the active one. The section ids it points at carry
 * scroll-margin so the sticky topbar never covers a heading you jump to.
 *
 * Logical properties throughout (`border-s`, `ms`/`ps`) so the rail sits on
 * the inline-start edge under both LTR and RTL.
 */
export function Toc({
  items,
  className,
}: {
  items: TocItem[];
  className?: string;
}) {
  const active = useActiveSection(items.map((i) => i.id));

  // One lonely entry isn't a table of contents.
  if (items.length < 2) return null;

  return (
    <nav
      aria-label="On this page"
      className={cn("flex flex-col gap-3", className)}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        On this page
      </p>
      <ul className="flex flex-col">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "block border-s py-1 ps-3 text-[13px] leading-snug transition-colors",
                  isActive
                    ? "border-s-accent-cool font-medium text-foreground"
                    : "border-s-border/60 text-muted-foreground hover:border-s-foreground/40 hover:text-foreground",
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Tracks which section is in view. An IntersectionObserver marks sections as
 * they cross the upper band of the viewport; the active one is the first
 * (top-most in document order) currently inside that band. Falls back to the
 * first id before any scroll. Runs only in the browser, so it's safe under
 * `output: "export"` — the static HTML ships without it and it wires up on
 * hydration.
 */
function useActiveSection(ids: string[]): string | null {
  const [active, setActive] = React.useState<string | null>(ids[0] ?? null);
  // Re-run the effect when the *set* of ids changes, not its array identity.
  const key = ids.join("|");

  React.useEffect(() => {
    const sectionIds = key ? key.split("|") : [];
    if (sectionIds.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = sectionIds.find((id) => visible.has(id));
        if (current) setActive(current);
      },
      // Activate a heading once it passes the topbar and before it leaves the
      // top third — keeps the highlight one step ahead of the reading line.
      { rootMargin: "-88px 0px -66% 0px", threshold: 0 },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [key]);

  return active;
}
