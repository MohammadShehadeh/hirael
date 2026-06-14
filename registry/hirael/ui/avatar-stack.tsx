import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

type AvatarStackProps = React.ComponentProps<"div"> & {
  size?: "sm" | "md" | "lg";
  spacing?: "tight" | "normal" | "loose";
};

const sizeClasses: Record<NonNullable<AvatarStackProps["size"]>, string> = {
  sm: "[&>[data-slot='avatar-stack-item']]:size-6 [&>[data-slot='avatar-stack-item']]:text-[10px]",
  md: "[&>[data-slot='avatar-stack-item']]:size-8 [&>[data-slot='avatar-stack-item']]:text-xs",
  lg: "[&>[data-slot='avatar-stack-item']]:size-10 [&>[data-slot='avatar-stack-item']]:text-sm",
};

const spacingClasses: Record<
  NonNullable<AvatarStackProps["spacing"]>,
  string
> = {
  tight: "[&>[data-slot='avatar-stack-item']:not(:first-child)]:-ms-3",
  normal: "[&>[data-slot='avatar-stack-item']:not(:first-child)]:-ms-2",
  loose: "[&>[data-slot='avatar-stack-item']:not(:first-child)]:-ms-1",
};

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
        className,
      )}
      {...props}
    />
  );
}

type AvatarStackItemProps = Omit<React.ComponentProps<"span">, "children"> & {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  /** When true, renders as the child element (e.g. an anchor or button) via Radix Slot. */
  asChild?: boolean;
  children?: React.ReactNode;
};

function AvatarStackItem({
  className,
  src,
  alt,
  fallback,
  asChild = false,
  children,
  ...props
}: AvatarStackItemProps) {
  const Comp = asChild ? Slot : "span";
  const content = src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      loading="lazy"
      className="absolute inset-0 size-full object-cover"
    />
  ) : (
    (fallback ?? children)
  );

  return (
    <Comp
      data-slot="avatar-stack-item"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-mono font-medium text-foreground ring-2 ring-background",
        asChild &&
          "transition-transform duration-150 ease-out hover:z-10 hover:scale-105 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      {asChild ? children : content}
    </Comp>
  );
}

type AvatarStackOverflowProps = Omit<
  React.ComponentProps<"span">,
  "children"
> & {
  count: number;
  prefix?: string;
  asChild?: boolean;
  children?: React.ReactNode;
};

function AvatarStackOverflow({
  className,
  count,
  prefix = "+",
  asChild = false,
  children,
  ...props
}: AvatarStackOverflowProps) {
  const Comp = asChild ? Slot : "span";
  return (
    <Comp
      data-slot="avatar-stack-item"
      data-overflow=""
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono font-medium tabular-nums text-muted-foreground ring-2 ring-background",
        asChild &&
          "transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {prefix}
          {count}
        </>
      )}
    </Comp>
  );
}

export { AvatarStack, AvatarStackItem, AvatarStackOverflow };
