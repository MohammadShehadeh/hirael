"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type VmState =
  | "running"
  | "stopped"
  | "starting"
  | "stopping"
  | "error"
  | "suspended";

const vmStateMeta: Record<
  VmState,
  { dot: string; text: string; label: string; live?: boolean }
> = {
  running: { dot: "bg-success", text: "text-success", label: "Running" },
  stopped: {
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    label: "Stopped",
  },
  starting: {
    dot: "bg-info",
    text: "text-info",
    label: "Starting",
    live: true,
  },
  stopping: {
    dot: "bg-warning",
    text: "text-warning",
    label: "Stopping",
    live: true,
  },
  error: { dot: "bg-destructive", text: "text-destructive", label: "Error" },
  suspended: {
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    label: "Suspended",
  },
};

type VmTableProps = React.ComponentProps<"table"> & {
  caption?: React.ReactNode;
};

function VmTable({ className, caption, children, ...props }: VmTableProps) {
  return (
    <div
      data-slot="vm-table-container"
      className="w-full overflow-x-auto rounded-lg border border-border"
    >
      <table
        data-slot="vm-table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      >
        {caption ? (
          <caption className="p-3 text-xs text-muted-foreground">
            {caption}
          </caption>
        ) : null}
        {children}
      </table>
    </div>
  );
}

function VmTableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="vm-table-header"
      className={cn(
        "border-b border-border bg-muted/40 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function VmTableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="vm-table-head"
      className={cn(
        "h-9 px-3 text-start align-middle font-medium whitespace-nowrap",
        "font-mono text-[10px] uppercase tracking-[0.1em]",
        className,
      )}
      {...props}
    />
  );
}

function VmTableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="vm-table-body"
      className={cn("divide-y divide-border", className)}
      {...props}
    />
  );
}

function VmTableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="vm-table-row"
      className={cn("transition-colors hover:bg-muted/40", className)}
      {...props}
    />
  );
}

function VmTableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="vm-table-cell"
      className={cn("px-3 py-2.5 align-middle whitespace-nowrap", className)}
      {...props}
    />
  );
}

type VmTableNameProps = React.ComponentProps<"td"> & {
  id?: React.ReactNode;
};

function VmTableName({ id, className, children, ...props }: VmTableNameProps) {
  return (
    <td
      data-slot="vm-table-name"
      className={cn("px-3 py-2.5 align-middle", className)}
      {...props}
    >
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{children}</span>
        {id ? (
          <span className="font-mono text-xs text-muted-foreground">{id}</span>
        ) : null}
      </div>
    </td>
  );
}

type VmStatusProps = Omit<React.ComponentProps<"span">, "children"> & {
  state: VmState;
  children?: React.ReactNode;
};

function VmStatus({ state, className, children, ...props }: VmStatusProps) {
  const meta = vmStateMeta[state];
  return (
    <span
      data-slot="vm-status"
      data-state={state}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        meta.text,
        className,
      )}
      {...props}
    >
      <span className="relative flex size-2">
        {meta.live ? (
          <span
            className={cn(
              "absolute inline-flex size-full animate-ping rounded-full opacity-75",
              meta.dot,
            )}
            aria-hidden
          />
        ) : null}
        <span
          className={cn("relative inline-flex size-2 rounded-full", meta.dot)}
          aria-hidden
        />
      </span>
      {children ?? meta.label}
    </span>
  );
}

export {
  VmTable,
  VmTableHeader,
  VmTableHead,
  VmTableBody,
  VmTableRow,
  VmTableCell,
  VmTableName,
  VmStatus,
};

const VM_ROWS: {
  name: string;
  id: string;
  state: VmState;
  size: string;
  region: string;
  ip: string;
  uptime: string;
}[] = [
  {
    name: "web-prod-01",
    id: "i-0a1b2c3d",
    state: "running",
    size: "c6i.2xlarge",
    region: "us-east-1",
    ip: "10.0.1.24",
    uptime: "42d",
  },
  {
    name: "worker-prod-02",
    id: "i-0e4f5a6b",
    state: "running",
    size: "c6i.xlarge",
    region: "us-east-1",
    ip: "10.0.1.51",
    uptime: "42d",
  },
  {
    name: "batch-runner-07",
    id: "i-0c7d8e9f",
    state: "starting",
    size: "m6i.large",
    region: "eu-west-2",
    ip: "10.1.2.13",
    uptime: "—",
  },
  {
    name: "db-replica-03",
    id: "i-0b3c4d5e",
    state: "error",
    size: "r6i.4xlarge",
    region: "eu-west-2",
    ip: "10.1.2.44",
    uptime: "—",
  },
  {
    name: "sandbox-14",
    id: "i-0f6a7b8c",
    state: "stopped",
    size: "t3.medium",
    region: "ap-south-1",
    ip: "—",
    uptime: "—",
  },
];

export default function VmTableBlock() {
  return (
    <section
      data-slot="vm-table-block"
      className="flex w-full justify-center bg-background p-6 sm:p-10"
    >
      <div className="w-full max-w-3xl">
        <VmTable caption="5 instances across 3 regions">
          <VmTableHeader>
            <VmTableRow>
              <VmTableHead>Instance</VmTableHead>
              <VmTableHead>Status</VmTableHead>
              <VmTableHead>Size</VmTableHead>
              <VmTableHead>Region</VmTableHead>
              <VmTableHead>IP</VmTableHead>
              <VmTableHead className="text-end">Uptime</VmTableHead>
            </VmTableRow>
          </VmTableHeader>
          <VmTableBody>
            {VM_ROWS.map((row) => (
              <VmTableRow key={row.id}>
                <VmTableName id={row.id}>{row.name}</VmTableName>
                <VmTableCell>
                  <VmStatus state={row.state} />
                </VmTableCell>
                <VmTableCell className="font-mono text-xs text-muted-foreground">
                  {row.size}
                </VmTableCell>
                <VmTableCell className="text-muted-foreground">
                  {row.region}
                </VmTableCell>
                <VmTableCell className="font-mono text-xs text-muted-foreground">
                  {row.ip}
                </VmTableCell>
                <VmTableCell className="text-end font-mono text-xs text-muted-foreground">
                  {row.uptime}
                </VmTableCell>
              </VmTableRow>
            ))}
          </VmTableBody>
        </VmTable>
      </div>
    </section>
  );
}
