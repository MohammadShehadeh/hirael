import * as React from "react"

import { cn } from "@/lib/utils"

const FRAUNCES_TEXT_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-fraunces), ui-serif, serif",
  fontWeight: 700,
  fontSize: "280px",
}

/**
 * The Palestinian flag bands + leading triangle, clipped to the M
 * letterform. The bands extend past the M's width so the clip mask is
 * what defines the shape, not the rectangles.
 */
function PalestineFlagFill() {
  return (
    <>
      <rect x="-10" y="-20" width="380" height="120" fill="#000000" />
      <rect x="-10" y="100" width="380" height="72" fill="#FFFFFF" />
      <rect x="-10" y="172" width="380" height="128" fill="#007A3D" />
      <polygon points="-10,-20 -10,300 170,138" fill="#CE1126" />
    </>
  )
}

/**
 * Full "MSH" wordmark — Fraunces bold, with the M filled by the
 * Palestinian flag and the S + H tracking currentColor. Use this where
 * there's horizontal room (hero header, OG cards, etc.).
 */
function LogoWordmarkSvg({ className }: { className?: string }) {
  const uid = React.useId().replace(/:/g, "")
  const mId = `msh-m-${uid}`
  const allId = `msh-all-${uid}`
  const clipId = `msh-clip-${uid}`
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 720 280"
      role="img"
      aria-hidden
      className={className}
    >
      <title>MSH UI</title>
      <defs>
        <text id={mId} x="10" y="245" style={FRAUNCES_TEXT_STYLE}>
          M
        </text>
        <text id={allId} x="10" y="245" style={FRAUNCES_TEXT_STYLE}>
          MSH
        </text>
        <clipPath id={clipId}>
          <use href={`#${mId}`} />
        </clipPath>
      </defs>
      <use href={`#${allId}`} fill="currentColor" />
      <g clipPath={`url(#${clipId})`}>
        <PalestineFlagFill />
      </g>
    </svg>
  )
}

/**
 * Square "M"-only mark, derived from the same letterform as the
 * wordmark. Used in icon contexts (sidebar header, lockups, favicons).
 */
function LogoMarkSvg({ className }: { className?: string }) {
  const uid = React.useId().replace(/:/g, "")
  const mId = `mshmark-m-${uid}`
  const clipId = `mshmark-clip-${uid}`
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="10 45 220 220"
      role="img"
      aria-hidden
      className={className}
    >
      <title>MSH UI</title>
      <defs>
        <text id={mId} x="10" y="245" style={FRAUNCES_TEXT_STYLE}>
          M
        </text>
        <clipPath id={clipId}>
          <use href={`#${mId}`} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <PalestineFlagFill />
      </g>
    </svg>
  )
}

/**
 * Roomier "M"-only mark — same letterform, but with a viewBox sized to
 * fully contain the Fraunces bold M's serifs so it doesn't clip when
 * scaled down into tight icon contexts (like the sidebar header).
 */
function LogoMarkMSvg({ className }: { className?: string }) {
  const uid = React.useId().replace(/:/g, "")
  const mId = `mshmarkm-m-${uid}`
  const clipId = `mshmarkm-clip-${uid}`
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 30 250 250"
      role="img"
      aria-hidden
      className={className}
    >
      <title>MSH UI</title>
      <defs>
        <text id={mId} x="10" y="245" style={FRAUNCES_TEXT_STYLE}>
          M
        </text>
        <clipPath id={clipId}>
          <use href={`#${mId}`} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <PalestineFlagFill />
      </g>
    </svg>
  )
}

export function Logo({
  className,
  title = "MSH UI",
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
      <LogoWordmarkSvg className="h-full w-auto" />
    </span>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="MSH UI"
      className={cn(
        "inline-flex size-6 shrink-0 text-foreground",
        className
      )}
    >
      <LogoMarkSvg className="size-full" />
    </span>
  )
}

export function LogoMarkM({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="MSH UI"
      className={cn(
        "inline-flex size-6 shrink-0 text-foreground",
        className
      )}
    >
      <LogoMarkMSvg className="size-full" />
    </span>
  )
}

export function BrandLockup({
  className,
  logoClassName,
  textClassName,
  showText = true,
}: {
  className?: string
  logoClassName?: string
  textClassName?: string
  showText?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap text-foreground",
        className
      )}
    >
      <Logo className={cn("inline-block h-6 align-middle", logoClassName)} />
      {showText && (
        <sub
          className={cn(
            "ml-1 align-sub text-xs font-semibold uppercase tracking-[0.06em]",
            textClassName
          )}
        >
          UI
        </sub>
      )}
    </span>
  )
}
