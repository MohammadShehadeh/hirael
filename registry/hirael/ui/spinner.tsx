import * as React from "react";

import { cn } from "@/lib/utils";

export type SpinnerProps = React.ComponentProps<"span"> & {
  variant?: "circle" | "dots" | "bars";
  size?: "sm" | "md" | "lg";
  /** Accessible label announced to assistive tech. Defaults to "Loading". */
  label?: string;
};

const circleSize = {
  sm: "size-4 border-2",
  md: "size-5 border-2",
  lg: "size-8 border-[3px]",
} as const;

const dotSize = {
  sm: "size-1",
  md: "size-1.5",
  lg: "size-2.5",
} as const;

const barSize = {
  sm: "h-3 w-0.5",
  md: "h-4 w-[3px]",
  lg: "h-6 w-1",
} as const;

function Spinner({
  variant = "circle",
  size = "md",
  label = "Loading",
  className,
  ...props
}: SpinnerProps) {
  return (
    <span
      data-slot="spinner"
      data-variant={variant}
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      {variant === "circle" && (
        <span
          aria-hidden
          className={cn(
            "block animate-spin rounded-full border-current border-t-transparent",
            circleSize[size],
          )}
        />
      )}

      {variant === "dots" && (
        <span aria-hidden className="inline-flex items-center gap-1">
          <span
            className={cn(
              "animate-bounce rounded-full bg-current [animation-delay:-0.3s]",
              dotSize[size],
            )}
          />
          <span
            className={cn(
              "animate-bounce rounded-full bg-current [animation-delay:-0.15s]",
              dotSize[size],
            )}
          />
          <span
            className={cn(
              "animate-bounce rounded-full bg-current",
              dotSize[size],
            )}
          />
        </span>
      )}

      {variant === "bars" && (
        <span aria-hidden className="inline-flex items-end gap-0.5">
          <span
            className={cn(
              "animate-pulse rounded-full bg-current [animation-delay:-0.4s]",
              barSize[size],
            )}
          />
          <span
            className={cn(
              "animate-pulse rounded-full bg-current [animation-delay:-0.2s]",
              barSize[size],
            )}
          />
          <span
            className={cn(
              "animate-pulse rounded-full bg-current",
              barSize[size],
            )}
          />
          <span
            className={cn(
              "animate-pulse rounded-full bg-current [animation-delay:-0.6s]",
              barSize[size],
            )}
          />
        </span>
      )}

      <span className="sr-only">{label}</span>
    </span>
  );
}

export { Spinner };
