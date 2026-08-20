import type * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Shared header language for the showcase. The landing and every index page
 * (components, blocks, templates, theme, changelog) compose these so the glass
 * kicker pill + oversized italic serif heading read the same everywhere.
 */

export function Pill({
  children,
  live = false,
  className,
}: {
  children: React.ReactNode;
  live?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "glass-panel glass-panel-lit inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground",
        className,
      )}
    >
      {live && <span className="state-dot" />}
      {children}
    </span>
  );
}

/** Top-of-page header (h1). Centered glass pill + oversized italic serif. */
export function PageHeader({
  kicker,
  title,
  blurb,
  live = false,
  children,
}: {
  kicker: string;
  title: React.ReactNode;
  blurb?: string;
  live?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <header className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
      <Pill live={live}>{kicker}</Pill>
      <h1 className="text-display text-4xl italic leading-[0.92] tracking-[-0.02em] sm:text-5xl md:text-6xl">
        {title}
      </h1>
      {blurb && (
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {blurb}
        </p>
      )}
      {children}
    </header>
  );
}

/**
 * Small mono-uppercase heading that labels a content section (an h2). Shared so
 * these section eyebrows read identically across the index, category, and
 * detail pages instead of drifting per file.
 */
export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </h2>
  );
}

/** In-page section header (h2). Same language, one step smaller than PageHeader. */
export function SectionHeading({
  kicker,
  title,
  blurb,
  live = false,
}: {
  kicker: string;
  title: React.ReactNode;
  blurb?: string;
  live?: boolean;
}) {
  return (
    <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-5 text-center sm:mb-16">
      <Pill live={live}>{kicker}</Pill>
      <h2 className="text-display text-3xl italic leading-[0.95] tracking-[-0.01em] sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {blurb && (
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          {blurb}
        </p>
      )}
    </div>
  );
}
