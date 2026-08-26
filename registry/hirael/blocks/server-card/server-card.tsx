"use client";

import * as React from "react";
import { Cpu, HardDrive, MemoryStick } from "lucide-react";

import { cn } from "@/lib/utils";

export type ServerStatus = "online" | "degraded" | "offline" | "provisioning";

const statusTone: Record<ServerStatus, string> = {
  online: "bg-success text-success",
  degraded: "bg-warning text-warning",
  offline: "bg-muted-foreground text-muted-foreground",
  provisioning: "bg-info text-info",
};

type ServerCardProps = React.ComponentProps<"div">;

const ServerCard = ({ className, ...props }: ServerCardProps) => {
  return (
    <div
      data-slot="server-card"
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-border bg-card p-5 text-card-foreground",
        className,
      )}
      {...props}
    />
  );
};

type ServerCardHeaderProps = React.ComponentProps<"div">;

const ServerCardHeader = ({ className, ...props }: ServerCardHeaderProps) => {
  return (
    <div
      data-slot="server-card-header"
      className={cn("flex items-start justify-between gap-3", className)}
      {...props}
    />
  );
};

interface ServerCardTitleProps extends React.ComponentProps<"div"> {
  region?: React.ReactNode;}

const ServerCardTitle = ({
  region,
  className,
  children,
  ...props
}: ServerCardTitleProps) => {
  return (
    <div
      data-slot="server-card-title"
      className={cn("flex min-w-0 flex-col gap-1", className)}
      {...props}
    >
      <span className="truncate font-mono text-sm font-medium text-foreground">
        {children}
      </span>
      {region ? (
        <span className="truncate text-xs text-muted-foreground">{region}</span>
      ) : null}
    </div>
  );
};

interface ServerCardStatusProps extends Omit<React.ComponentProps<"span">, "children"> {
  status: ServerStatus;
  children?: React.ReactNode;}

const ServerCardStatus = ({
  status,
  className,
  children,
  ...props
}: ServerCardStatusProps) => {
  const live = status === "provisioning";
  return (
    <span
      data-slot="server-card-status"
      data-status={status}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-accent px-2 py-0.5 text-[11px] font-medium capitalize",
        statusTone[status].split(" ")[1],
        className,
      )}
      {...props}
    >
      <span className="relative flex size-1.5">
        {live ? (
          <span
            className={cn(
              "absolute inline-flex size-full animate-ping rounded-full opacity-75",
              statusTone[status].split(" ")[0],
            )}
            aria-hidden
          />
        ) : null}
        <span
          className={cn(
            "relative inline-flex size-1.5 rounded-full",
            statusTone[status].split(" ")[0],
          )}
          aria-hidden
        />
      </span>
      {children ?? status}
    </span>
  );
};

type ServerCardSpecsProps = React.ComponentProps<"dl">;

const ServerCardSpecs = ({ className, ...props }: ServerCardSpecsProps) => {
  return (
    <dl
      data-slot="server-card-specs"
      className={cn("grid grid-cols-3 gap-3", className)}
      {...props}
    />
  );
};

const specIcon = {
  cpu: Cpu,
  memory: MemoryStick,
  disk: HardDrive,
} as const;

interface ServerCardSpecProps extends React.ComponentProps<"div"> {
  label: React.ReactNode;
  icon?: keyof typeof specIcon;}

const ServerCardSpec = ({
  label,
  icon,
  className,
  children,
  ...props
}: ServerCardSpecProps) => {
  const Icon = icon ? specIcon[icon] : null;
  return (
    <div
      data-slot="server-card-spec"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      <dt className="flex items-center gap-1 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        {Icon ? <Icon className="size-3" aria-hidden /> : null}
        {label}
      </dt>
      <dd className="font-mono text-sm text-foreground">{children}</dd>
    </div>
  );
};

interface ServerCardMeterProps extends React.ComponentProps<"div"> {
  label: React.ReactNode;
  value: number;
  /** Fraction (0–1) where the bar switches to warning, then destructive. */
  thresholds?: [warn: number, crit: number];}

const ServerCardMeter = ({
  label,
  value,
  thresholds = [0.75, 0.9],
  className,
  ...props
}: ServerCardMeterProps) => {
  const pct = Math.max(0, Math.min(100, value));
  const frac = pct / 100;
  const [warn, crit] = thresholds;
  const tone =
    frac >= crit
      ? "bg-destructive"
      : frac >= warn
        ? "bg-warning"
        : "bg-primary";
  return (
    <div
      data-slot="server-card-meter"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground">{pct}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-[width]", tone)}
          style={{ inlineSize: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export {
  ServerCard,
  ServerCardHeader,
  ServerCardTitle,
  ServerCardStatus,
  ServerCardSpecs,
  ServerCardSpec,
  ServerCardMeter,
};

const ServerCardBlock = () => {
  return (
    <section
      data-slot="server-card-block"
      className="flex w-full justify-center bg-background p-6 sm:p-10"
    >
      <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
        <ServerCard>
          <ServerCardHeader>
            <ServerCardTitle region="us-east-1 · AWS">
              web-prod-01
            </ServerCardTitle>
            <ServerCardStatus status="online">Online</ServerCardStatus>
          </ServerCardHeader>
          <ServerCardSpecs>
            <ServerCardSpec icon="cpu" label="vCPU">
              8
            </ServerCardSpec>
            <ServerCardSpec icon="memory" label="Memory">
              32 GB
            </ServerCardSpec>
            <ServerCardSpec icon="disk" label="Disk">
              512 GB
            </ServerCardSpec>
          </ServerCardSpecs>
          <div className="grid gap-3">
            <ServerCardMeter label="CPU" value={62} />
            <ServerCardMeter label="Memory" value={81} />
          </div>
        </ServerCard>

        <ServerCard>
          <ServerCardHeader>
            <ServerCardTitle region="eu-west-2 · AWS">
              db-replica-03
            </ServerCardTitle>
            <ServerCardStatus status="degraded">Degraded</ServerCardStatus>
          </ServerCardHeader>
          <ServerCardSpecs>
            <ServerCardSpec icon="cpu" label="vCPU">
              16
            </ServerCardSpec>
            <ServerCardSpec icon="memory" label="Memory">
              64 GB
            </ServerCardSpec>
            <ServerCardSpec icon="disk" label="Disk">
              2 TB
            </ServerCardSpec>
          </ServerCardSpecs>
          <div className="grid gap-3">
            <ServerCardMeter label="CPU" value={94} />
            <ServerCardMeter label="Disk" value={88} />
          </div>
        </ServerCard>

        <ServerCard>
          <ServerCardHeader>
            <ServerCardTitle region="ap-south-1 · AWS">
              cache-02
            </ServerCardTitle>
            <ServerCardStatus status="provisioning">
              Provisioning
            </ServerCardStatus>
          </ServerCardHeader>
          <ServerCardSpecs>
            <ServerCardSpec icon="cpu" label="vCPU">
              4
            </ServerCardSpec>
            <ServerCardSpec icon="memory" label="Memory">
              16 GB
            </ServerCardSpec>
            <ServerCardSpec icon="disk" label="Disk">
              128 GB
            </ServerCardSpec>
          </ServerCardSpecs>
          <div className="grid gap-3">
            <ServerCardMeter label="CPU" value={7} />
            <ServerCardMeter label="Memory" value={12} />
          </div>
        </ServerCard>
      </div>
    </section>
  );
};

export default ServerCardBlock;
