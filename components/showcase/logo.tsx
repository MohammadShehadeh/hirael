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
          "inline-flex shrink-0 items-center justify-center rounded-sm bg-foreground font-mono text-xs font-semibold text-background",
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
      width={40}
      height={40}
      onError={() => setErrored(true)}
      className={cn("shrink-0 select-none dark:invert", className)}
      draggable={false}
    />
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
