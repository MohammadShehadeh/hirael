"use client";

import * as React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/registry/hirael/components/animated-number";

type StatsProps = React.ComponentProps<"section">;

const Stats = ({ className, children, ...props }: StatsProps) => {
  return (
    <section
      data-slot="stats"
      className={cn("bg-background py-20 sm:py-28", className)}
      {...props}
    >
      <div className="container grid w-full grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        {children}
      </div>
    </section>
  );
};

type StatsHeaderProps = React.ComponentProps<"div">;

const StatsHeader = ({ className, ...props }: StatsHeaderProps) => {
  return (
    <div
      data-slot="stats-header"
      className={cn("flex flex-col gap-5 lg:col-span-5", className)}
      {...props}
    />
  );
};

type StatsEyebrowProps = React.ComponentProps<"span">;

const StatsEyebrow = ({ className, ...props }: StatsEyebrowProps) => {
  return (
    <span
      data-slot="stats-eyebrow"
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};

type StatsTitleProps = React.ComponentProps<"h2">;

const StatsTitle = ({ className, ...props }: StatsTitleProps) => {
  return (
    <h2
      data-slot="stats-title"
      className={cn(
        "font-serif text-4xl font-medium leading-[1.04] tracking-tight text-foreground sm:text-5xl",
        className,
      )}
      {...props}
    />
  );
};

type StatsDescriptionProps = React.ComponentProps<"p">;

const StatsDescription = ({ className, ...props }: StatsDescriptionProps) => {
  return (
    <p
      data-slot="stats-description"
      className={cn(
        "max-w-md text-sm text-muted-foreground sm:text-base",
        className,
      )}
      {...props}
    />
  );
};

type StatsGridProps = React.ComponentProps<"div">;

const StatsGrid = ({ className, ...props }: StatsGridProps) => {
  return (
    <div
      data-slot="stats-grid"
      className={cn(
        "grid grid-cols-2 border-y border-border md:grid-cols-4 lg:col-span-7",
        className,
      )}
      {...props}
    />
  );
};

type StatsItemProps = React.ComponentProps<"div">;

const StatsItem = ({ className, ...props }: StatsItemProps) => {
  return (
    <div
      data-slot="stats-item"
      className={cn(
        "flex flex-col gap-2 border-border px-4 py-6 sm:px-6 sm:py-8",
        "md:border-s md:first:border-s-0",
        "max-md:odd:border-e max-md:[&:nth-child(n+3)]:border-t",
        className,
      )}
      {...props}
    />
  );
};

/** Observes its own element and reports once it has scrolled into view. */
const useInView = <T extends Element>(margin = "0px 0px -10% 0px") => {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: margin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);

  return [ref, inView] as const;
};

interface StatsValueProps extends Omit<React.ComponentProps<"div">, "children"> {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Tween length in milliseconds once the item scrolls into view. */
  duration?: number;
  format?: Intl.NumberFormatOptions;}

const StatsValue = ({
  value,
  prefix,
  suffix,
  decimals = 0,
  duration = 1200,
  format,
  className,
  ...props
}: StatsValueProps) => {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-slot="stats-value"
      className={cn(
        "font-serif text-4xl font-medium leading-none tracking-tight text-foreground sm:text-5xl",
        className,
      )}
      {...props}
    >
      <AnimatedNumber
        value={inView ? value : 0}
        duration={duration}
        decimals={decimals}
        prefix={prefix}
        suffix={suffix}
        format={format}
      />
    </div>
  );
};

type StatsLabelProps = React.ComponentProps<"div">;

const StatsLabel = ({ className, ...props }: StatsLabelProps) => {
  return (
    <div
      data-slot="stats-label"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
};

interface StatsDeltaProps extends React.ComponentProps<"span"> {
  trend?: "up" | "down";}

const StatsDelta = ({
  trend = "up",
  className,
  children,
  ...props
}: StatsDeltaProps) => {
  const Icon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      data-slot="stats-delta"
      data-trend={trend}
      className={cn(
        "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground",
        className,
      )}
      {...props}
    >
      <Icon aria-hidden className="size-3 text-foreground rtl:-scale-x-100" />
      {children}
    </span>
  );
};

export {
  Stats,
  StatsHeader,
  StatsEyebrow,
  StatsTitle,
  StatsDescription,
  StatsGrid,
  StatsItem,
  StatsValue,
  StatsLabel,
  StatsDelta,
};

const STATS = [
  {
    label: "Deploys per week",
    value: 48000,
    suffix: "+",
    delta: "12% this quarter",
    trend: "up",
  },
  {
    label: "Median cold start",
    value: 38,
    suffix: "ms",
    delta: "9ms faster",
    trend: "down",
  },
  {
    label: "Uptime, trailing 90 days",
    value: 99.98,
    suffix: "%",
    decimals: 2,
  },
  {
    label: "Teams on the platform",
    value: 2100,
    suffix: "+",
    delta: "310 new",
    trend: "up",
  },
] as const;

const Stats01Block = () => {
  return (
    <Stats data-slot="stats-01-block">
      <StatsHeader>
        <StatsEyebrow>By the numbers</StatsEyebrow>
        <StatsTitle>Boring in production, on purpose.</StatsTitle>
        <StatsDescription>
          Every figure below is pulled from the public status page and updated
          monthly. No rounding up.
        </StatsDescription>
      </StatsHeader>

      <StatsGrid>
        {STATS.map((stat) => (
          <StatsItem key={stat.label}>
            <StatsValue
              value={stat.value}
              suffix={stat.suffix}
              decimals={"decimals" in stat ? stat.decimals : 0}
            />
            <StatsLabel>{stat.label}</StatsLabel>
            {"delta" in stat ? (
              <StatsDelta trend={stat.trend}>{stat.delta}</StatsDelta>
            ) : null}
          </StatsItem>
        ))}
      </StatsGrid>
    </Stats>
  );
};

export default Stats01Block;
