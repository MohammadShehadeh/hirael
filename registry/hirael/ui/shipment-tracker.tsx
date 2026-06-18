"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Check,
  Clock,
  MapPin,
  Truck,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type ShipmentOrientation = "horizontal" | "vertical";

type ShipmentStatus = "complete" | "current" | "upcoming";

const ShipmentOrientationContext =
  React.createContext<ShipmentOrientation>("horizontal");

function useShipmentOrientation() {
  return React.useContext(ShipmentOrientationContext);
}

type ShipmentTrackerProps = React.ComponentProps<"div"> & {
  /** Lays the stage stepper out along the inline axis or stacked vertically. Defaults to `horizontal`. */
  orientation?: ShipmentOrientation;
};

function ShipmentTracker({
  orientation = "horizontal",
  className,
  ...props
}: ShipmentTrackerProps) {
  return (
    <ShipmentOrientationContext.Provider value={orientation}>
      <div
        data-slot="shipment-tracker"
        data-orientation={orientation}
        className={cn("flex w-full flex-col gap-6", className)}
        {...props}
      />
    </ShipmentOrientationContext.Provider>
  );
}

function ShipmentStages({ className, ...props }: React.ComponentProps<"ol">) {
  const orientation = useShipmentOrientation();
  return (
    <ol
      data-slot="shipment-stages"
      data-orientation={orientation}
      className={cn(
        "flex",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        className,
      )}
      {...props}
    />
  );
}

const shipmentStageVariants = cva("group/stage relative flex", {
  variants: {
    orientation: {
      horizontal: cn(
        "min-w-0 flex-1 flex-col items-center gap-2 pt-7 text-center",
        "before:absolute before:top-[11px] before:h-px before:bg-border",
        "before:start-1/2 before:end-[-50%]",
        "last:before:hidden",
      ),
      vertical: cn(
        "items-start gap-3 pb-6 ps-9 last:pb-0",
        "before:absolute before:start-[11px] before:top-7 before:bottom-0 before:w-px before:bg-border",
        "last:before:hidden",
      ),
    },
    status: {
      complete: "before:bg-success/40",
      current: "before:bg-border",
      upcoming: "before:bg-border",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    status: "upcoming",
  },
});

const shipmentMarkerVariants = cva(
  cn(
    "z-10 inline-flex size-[22px] shrink-0 items-center justify-center rounded-full border bg-background [&_svg]:size-3",
  ),
  {
    variants: {
      orientation: {
        horizontal: "absolute top-0",
        vertical: "absolute start-0 top-0",
      },
      status: {
        complete: "border-success/40 text-success",
        current:
          "border-accent-cool text-accent-cool shadow-[0_0_10px_1px_var(--accent-cool-glow)]",
        upcoming: "border-border text-muted-foreground",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      status: "upcoming",
    },
  },
);

const stageIcons: Record<ShipmentStatus, LucideIcon> = {
  complete: Check,
  current: Truck,
  upcoming: Clock,
};

type ShipmentStageProps = Omit<React.ComponentProps<"li">, "title"> &
  VariantProps<typeof shipmentStageVariants> & {
    /** Progress of this stage. `current` reads as live (accent-cool, pulsing). */
    status?: ShipmentStatus;
    /** Short stage name, e.g. "Out for delivery". */
    label?: React.ReactNode;
    /** When the stage was reached. Omit for stages not yet hit. */
    time?: React.ReactNode;
    /** Replaces the default stage icon. */
    icon?: React.ReactNode;
  };

function ShipmentStage({
  status = "upcoming",
  label,
  time,
  icon,
  className,
  children,
  ...props
}: ShipmentStageProps) {
  const orientation = useShipmentOrientation();
  const Icon = stageIcons[status];

  return (
    <li
      data-slot="shipment-stage"
      data-status={status}
      data-orientation={orientation}
      className={cn(
        shipmentStageVariants({ orientation, status }),
        className,
      )}
      {...props}
    >
      <span
        data-slot="shipment-stage-marker"
        data-status={status}
        className={shipmentMarkerVariants({ orientation, status })}
      >
        {icon ?? <Icon aria-hidden />}
        {status === "current" ? (
          <span aria-hidden className="state-dot absolute -end-0.5 -top-0.5" />
        ) : null}
      </span>
      <div
        data-slot="shipment-stage-content"
        className={cn(
          "flex min-w-0 flex-col gap-0.5",
          orientation === "horizontal" ? "items-center" : "items-start",
        )}
      >
        {label != null ? (
          <span
            data-slot="shipment-stage-label"
            className={cn(
              "text-sm font-medium leading-snug",
              status === "upcoming"
                ? "text-muted-foreground"
                : "text-foreground",
            )}
          >
            {label}
          </span>
        ) : null}
        {time != null ? (
          <time
            data-slot="shipment-stage-time"
            className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
          >
            {time}
          </time>
        ) : null}
        {children}
      </div>
    </li>
  );
}

function ShipmentEvents({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="shipment-events"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

type ShipmentEventProps = React.ComponentProps<"li"> & {
  /** When the event happened. */
  time?: React.ReactNode;
  /** Where the event happened. */
  location?: React.ReactNode;
  /** What happened. */
  description?: React.ReactNode;
  /** Replaces the default location marker icon. */
  icon?: React.ReactNode;
};

function ShipmentEvent({
  time,
  location,
  description,
  icon,
  className,
  children,
  ...props
}: ShipmentEventProps) {
  return (
    <li
      data-slot="shipment-event"
      className={cn(
        "group relative flex gap-3 pb-5 ps-9 last:pb-0",
        "before:absolute before:start-[11px] before:top-7 before:bottom-0 before:w-px before:bg-border",
        "last:before:hidden",
        className,
      )}
      {...props}
    >
      <span
        data-slot="shipment-event-marker"
        aria-hidden
        className="absolute start-0 top-0 z-10 inline-flex size-[22px] shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground [&_svg]:size-3"
      >
        {icon ?? <MapPin />}
      </span>
      <div
        data-slot="shipment-event-content"
        className="flex min-w-0 flex-1 flex-col gap-1"
      >
        <div
          data-slot="shipment-event-meta"
          className="flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
        >
          {time != null ? (
            <time data-slot="shipment-event-time">{time}</time>
          ) : null}
          {location != null ? (
            <span data-slot="shipment-event-location" className="text-foreground">
              {location}
            </span>
          ) : null}
        </div>
        {description != null ? (
          <p
            data-slot="shipment-event-description"
            className="text-[13px] leading-relaxed text-foreground"
          >
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </li>
  );
}

export {
  ShipmentTracker,
  ShipmentStages,
  ShipmentStage,
  ShipmentEvents,
  ShipmentEvent,
};
