import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

type TimelineProps = React.ComponentProps<"ol">;

function Timeline({ className, ...props }: TimelineProps) {
  return (
    <ol
      data-slot="timeline"
      className={cn("relative flex flex-col", className)}
      {...props}
    />
  );
}

type TimelineItemProps = React.ComponentProps<"li">;

function TimelineItem({ className, ...props }: TimelineItemProps) {
  return (
    <li
      data-slot="timeline-item"
      className={cn(
        "group relative flex gap-4 pb-6 last:pb-0",
        "before:absolute before:start-[7px] before:top-4 before:bottom-0 before:w-px before:bg-border",
        "last:before:hidden",
        className,
      )}
      {...props}
    />
  );
}

const timelineDotVariants = cva(
  "relative z-10 mt-1.5 inline-flex size-[15px] shrink-0 items-center justify-center rounded-full ring-2 ring-background",
  {
    variants: {
      tone: {
        default: "bg-foreground",
        muted: "bg-muted-foreground",
        success: "bg-success",
        warning: "bg-warning",
        danger: "bg-destructive",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

type TimelineDotProps = Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof timelineDotVariants> & {
    children?: React.ReactNode;
  };

function TimelineDot({
  className,
  tone = "default",
  children,
  ...props
}: TimelineDotProps) {
  if (children) {
    return (
      <span
        data-slot="timeline-dot"
        data-tone={tone}
        className={cn(
          "relative z-10 mt-0.5 inline-flex size-6 -translate-x-[5px] rtl:translate-x-[5px] items-center justify-center rounded-full bg-background ring-1 ring-border [&_svg]:size-3",
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
  return (
    <span
      data-slot="timeline-dot"
      data-tone={tone}
      className={cn(timelineDotVariants({ tone }), className)}
      {...props}
    />
  );
}

type TimelineContentProps = React.ComponentProps<"div">;

function TimelineContent({ className, ...props }: TimelineContentProps) {
  return (
    <div
      data-slot="timeline-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-1 pt-0.5", className)}
      {...props}
    />
  );
}

type TimelineTitleProps = React.ComponentProps<"p">;

function TimelineTitle({ className, ...props }: TimelineTitleProps) {
  return (
    <p
      data-slot="timeline-title"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  );
}

type TimelineTimeProps = React.ComponentProps<"time">;

function TimelineTime({ className, ...props }: TimelineTimeProps) {
  return (
    <time
      data-slot="timeline-time"
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

type TimelineDescriptionProps = React.ComponentProps<"p">;

function TimelineDescription({
  className,
  ...props
}: TimelineDescriptionProps) {
  return (
    <p
      data-slot="timeline-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineContent,
  TimelineTitle,
  TimelineTime,
  TimelineDescription,
};
