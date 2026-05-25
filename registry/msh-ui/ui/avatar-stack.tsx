import * as React from "react"

import { cn } from "@/lib/utils"

type AvatarStackProps = React.ComponentProps<"div"> & {
  size?: "sm" | "md" | "lg"
  spacing?: "tight" | "normal" | "loose"
}

const sizeClasses: Record<NonNullable<AvatarStackProps["size"]>, string> = {
  sm: "[&>[data-slot='avatar-stack-item']]:size-6 [&>[data-slot='avatar-stack-item']]:text-[10px]",
  md: "[&>[data-slot='avatar-stack-item']]:size-8 [&>[data-slot='avatar-stack-item']]:text-xs",
  lg: "[&>[data-slot='avatar-stack-item']]:size-10 [&>[data-slot='avatar-stack-item']]:text-sm",
}

const spacingClasses: Record<NonNullable<AvatarStackProps["spacing"]>, string> = {
  tight: "[&>[data-slot='avatar-stack-item']:not(:first-child)]:-ml-3",
  normal: "[&>[data-slot='avatar-stack-item']:not(:first-child)]:-ml-2",
  loose: "[&>[data-slot='avatar-stack-item']:not(:first-child)]:-ml-1",
}

function AvatarStack({
  className,
  size = "md",
  spacing = "normal",
  ...props
}: AvatarStackProps) {
  return (
    <div
      data-slot="avatar-stack"
      data-size={size}
      className={cn(
        "flex items-center",
        sizeClasses[size],
        spacingClasses[spacing],
        className
      )}
      {...props}
    />
  )
}

type AvatarStackItemProps = React.ComponentProps<"span"> & {
  src?: string
  alt?: string
  fallback?: React.ReactNode
}

function AvatarStackItem({
  className,
  src,
  alt,
  fallback,
  children,
  ...props
}: AvatarStackItemProps) {
  return (
    <span
      data-slot="avatar-stack-item"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-mono font-medium text-foreground ring-2 ring-background",
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        (fallback ?? children)
      )}
    </span>
  )
}

type AvatarStackOverflowProps = React.ComponentProps<"span"> & {
  count: number
  prefix?: string
}

function AvatarStackOverflow({
  className,
  count,
  prefix = "+",
  ...props
}: AvatarStackOverflowProps) {
  return (
    <span
      data-slot="avatar-stack-item"
      data-overflow=""
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono font-medium tabular-nums text-muted-foreground ring-2 ring-background",
        className
      )}
      {...props}
    >
      {prefix}
      {count}
    </span>
  )
}

export { AvatarStack, AvatarStackItem, AvatarStackOverflow }
