"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * MSH wordmark, inlined as SVG. The base "MSH" text renders in
 * currentColor (so it follows the active theme) while the "M" letter is
 * clipped to reveal the Palestinian flag (black/white/green/red triangle)
 * underneath.
 */
function LogoSvg({ className }: { className?: string }) {
  const rawId = React.useId()
  const id = rawId.replace(/:/g, "")
  const mId = `msh-m-${id}`
  const allId = `msh-all-${id}`
  const clipId = `msh-m-clip-${id}`

  const textStyle: React.CSSProperties = {
    fontFamily: "var(--font-fraunces), ui-serif, Georgia, serif",
    fontSize: "280px",
    fontWeight: 600,
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 820 280"
      aria-hidden="true"
      className={className}
    >
      <title>MSH</title>
      <defs>
        <text id={mId} style={textStyle} x="10" y="245">
          M
        </text>
        <text id={allId} style={textStyle} x="10" y="245">
          MSH
        </text>
        <clipPath id={clipId}>
          <use href={`#${mId}`} />
        </clipPath>
      </defs>
      <use href={`#${allId}`} fill="currentColor" />
      <g clipPath={`url(#${clipId})`}>
        <rect x="-10" y="-20" width="380" height="120" fill="#000000" />
        <rect x="-10" y="100" width="380" height="72" fill="#FFFFFF" />
        <rect x="-10" y="172" width="380" height="128" fill="#007A3D" />
        <polygon points="-10,-20 -10,300 170,138" fill="#CE1126" />
      </g>
    </svg>
  )
}

export function Logo({
  className,
  title = "msh ui",
}: {
  className?: string
  title?: string
}) {
  return (
    <span
      role="img"
      aria-label={title}
      className={cn("inline-flex shrink-0 text-foreground", className)}
    >
      <LogoSvg className="h-full w-auto" />
    </span>
  )
}

/** Wordmark logo sized by height — width is intrinsic to the 820×280 viewBox. */
export function LogoMark({ className }: { className?: string }) {
  return <Logo className={cn("h-8", className)} />
}

export function BrandLockup({
  className,
  logoClassName,
  textClassName,
}: {
  className?: string
  logoClassName?: string
  textClassName?: string
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark className={logoClassName} />
      <span
        className={cn(
          "text-xl font-semibold tracking-[-0.02em] text-muted-foreground",
          textClassName
        )}
      >
        ui
      </span>
    </div>
  )
}
