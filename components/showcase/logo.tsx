import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * msh ui brand mark, inlined as SVG so it inherits the current text color
 * via `currentColor`. To swap in the canonical mark from
 * mohammadshehadeh.com/images/logo.svg, replace the contents of <LogoSvg>
 * with the path data from that file — keep `fill="currentColor"` on every
 * path so it continues to follow the active text color in both themes.
 */
function LogoSvg({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden
      className={className}
    >
      {/* Bold geometric "M" letterform — stroke-based so it scales cleanly */}
      <path
        d="M6 32 L6 8 L20 24 L34 8 L34 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
      className={cn(
        "inline-flex shrink-0 items-center justify-center text-foreground",
        className
      )}
    >
      <LogoSvg className="size-full" />
    </span>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return <Logo className={cn("size-10", className)} />
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
