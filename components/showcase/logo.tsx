import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * forgecn brand mark — a bold geometric "F" rendered as three rounded
 * rectangles in currentColor, so it follows the active text color in
 * both themes.
 */
function LogoSvg({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      role="img"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <title>forgecn</title>
      <rect x="4" y="4" width="16" height="3.5" rx="1" />
      <rect x="4" y="4" width="3.5" height="16" rx="1" />
      <rect x="4" y="10.25" width="10" height="3.5" rx="1" />
    </svg>
  )
}

export function Logo({
  className,
  title = "forgecn",
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
      <LogoSvg className="size-full" />
    </span>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return <Logo className={cn("size-6", className)} />
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
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark className={logoClassName} />
      {showText && (
        <span
          className={cn(
            "text-base font-semibold tracking-[-0.02em] text-foreground",
            textClassName
          )}
        >
          forgecn
        </span>
      )}
    </div>
  )
}
