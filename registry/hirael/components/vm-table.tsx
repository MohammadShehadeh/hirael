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
