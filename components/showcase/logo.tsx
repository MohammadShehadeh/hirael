"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export const LOGO_URL = "https://mohammadshehadeh.com/images/logo.svg"

export function Logo({
  className,
  alt = "msh ui",
}: {
  className?: string
  alt?: string
}) {
  const [errored, setErrored] = React.useState(false)

  if (errored) {
    return (
      <span
        aria-hidden
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-sm bg-foreground font-mono text-[10px] font-semibold text-background",
          className
        )}
      >
        msh
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_URL}
      alt={alt}
      width={28}
      height={28}
      onError={() => setErrored(true)}
      className={cn("shrink-0 select-none dark:invert", className)}
      draggable={false}
    />
  )
}

export function LogoMark({ className }: { className?: string }) {
  return <Logo className={cn("size-6", className)} />
}

export function LogoLockup({
  className,
  showTagline = true,
}: {
  className?: string
  showTagline?: boolean
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoMark />
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="text-sm font-semibold tracking-[-0.02em]">
          msh <span className="text-muted-foreground">ui</span>
        </span>
        {showTagline && (
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
            shadcn&apos;s missing pieces
          </span>
        )}
      </div>
    </div>
  )
}
