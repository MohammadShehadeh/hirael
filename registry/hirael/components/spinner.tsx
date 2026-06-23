import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const circleVariants = cva(
  "block animate-spin rounded-full border-current border-t-transparent",
  {
    variants: {
      size: {
        sm: "size-4 border-2",
        md: "size-5 border-2",
        lg: "size-8 border-[3px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const dotVariants = cva("animate-bounce rounded-full bg-current", {
  variants: {
    size: {
      sm: "size-1",
      md: "size-1.5",
      lg: "size-2.5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const barVariants = cva("animate-pulse rounded-full bg-current", {
  variants: {
    size: {
      sm: "h-3 w-0.5",
      md: "h-4 w-[3px]",
      lg: "h-6 w-1",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export type SpinnerProps = React.ComponentProps<"span"> &
  VariantProps<typeof circleVariants> & {
    variant?: "circle" | "dots" | "bars";
    /** Accessible label announced to assistive tech. Defaults to "Loading". */
    label?: string;
  };

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
        <span aria-hidden className={circleVariants({ size })} />
      )}

      {variant === "dots" && (
        <span aria-hidden className="inline-flex items-center gap-1">
          <span
            className={cn(dotVariants({ size }), "[animation-delay:-0.3s]")}
          />
          <span
            className={cn(dotVariants({ size }), "[animation-delay:-0.15s]")}
          />
          <span className={dotVariants({ size })} />
        </span>
      )}

      {variant === "bars" && (
        <span aria-hidden className="inline-flex items-end gap-0.5">
          <span
            className={cn(barVariants({ size }), "[animation-delay:-0.4s]")}
          />
          <span
            className={cn(barVariants({ size }), "[animation-delay:-0.2s]")}
          />
          <span className={barVariants({ size })} />
          <span
            className={cn(barVariants({ size }), "[animation-delay:-0.6s]")}
          />
        </span>
      )}

      <span className="sr-only">{label}</span>
    </span>
  );
}

export { Spinner };
