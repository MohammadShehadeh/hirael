"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type PodPhase =
  | "Running"
  | "Pending"
  | "Succeeded"
  | "Failed"
  | "CrashLoopBackOff"
  | "ContainerCreating"
  | "Terminating";

const phaseMeta: Record<PodPhase, { className: string; live?: boolean }> = {
  Running: { className: "border-success/30 bg-success/10 text-success" },
  Succeeded: {
    className: "border-border bg-accent text-muted-foreground",
  },
  Pending: { className: "border-warning/30 bg-warning/10 text-warning" },
  ContainerCreating: {
    className: "border-info/30 bg-info/10 text-info",
    live: true,
  },
  Terminating: {
    className: "border-border bg-accent text-muted-foreground",
    live: true,
  },
  Failed: {
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
  CrashLoopBackOff: {
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
};

type K8sPodTableProps = React.ComponentProps<"table"> & {
  caption?: React.ReactNode;
};

function K8sPodTable({
  className,
  caption,
  children,
  ...props
}: K8sPodTableProps) {
  return (
    <div
      data-slot="k8s-pod-table-container"
      className="w-full overflow-x-auto rounded-lg border border-border"
    >
      <table
        data-slot="k8s-pod-table"
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

function K8sPodTableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="k8s-pod-table-header"
      className={cn(
        "border-b border-border bg-muted/40 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function K8sPodTableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="k8s-pod-table-head"
      className={cn(
        "h-9 px-3 text-start align-middle whitespace-nowrap font-mono text-[10px] font-medium uppercase tracking-[0.1em]",
        className,
      )}
      {...props}
    />
  );
}

function K8sPodTableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="k8s-pod-table-body"
      className={cn("divide-y divide-border", className)}
      {...props}
    />
  );
}

function K8sPodTableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="k8s-pod-table-row"
      className={cn("transition-colors hover:bg-muted/40", className)}
      {...props}
    />
  );
}

function K8sPodTableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="k8s-pod-table-cell"
      className={cn(
        "px-3 py-2.5 align-middle whitespace-nowrap font-mono text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

type K8sPodNameProps = React.ComponentProps<"td"> & {
  namespace?: React.ReactNode;
};

function K8sPodName({
  namespace,
  className,
  children,
  ...props
}: K8sPodNameProps) {
  return (
    <td
      data-slot="k8s-pod-name"
      className={cn("px-3 py-2.5 align-middle", className)}
      {...props}
    >
      <div className="flex flex-col">
        <span className="font-mono text-xs font-medium text-foreground">
          {children}
        </span>
        {namespace ? (
          <span className="font-mono text-[11px] text-muted-foreground">
            {namespace}
          </span>
        ) : null}
      </div>
    </td>
  );
}

type K8sPodPhaseProps = Omit<React.ComponentProps<"span">, "children"> & {
  phase: PodPhase;
  children?: React.ReactNode;
};

function K8sPodPhase({
  phase,
  className,
  children,
  ...props
}: K8sPodPhaseProps) {
  const meta = phaseMeta[phase];
  return (
    <span
      data-slot="k8s-pod-phase"
      data-phase={phase}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        meta.className,
        className,
      )}
      {...props}
    >
      {meta.live ? (
        <span
          className="size-1.5 animate-pulse rounded-full bg-current"
          aria-hidden
        />
      ) : null}
      {children ?? phase}
    </span>
  );
}

type K8sPodRestartsProps = React.ComponentProps<"td"> & {
  count: number;
  /** Count at or above which restarts read as unhealthy. */
  warnAt?: number;
};

function K8sPodRestarts({
  count,
  warnAt = 3,
  className,
  ...props
}: K8sPodRestartsProps) {
  return (
    <td
      data-slot="k8s-pod-restarts"
      className={cn(
        "px-3 py-2.5 align-middle font-mono text-xs",
        count >= warnAt ? "text-destructive" : "text-muted-foreground",
        className,
      )}
      {...props}
    >
      {count}
    </td>
  );
}

export {
  K8sPodTable,
  K8sPodTableHeader,
  K8sPodTableHead,
  K8sPodTableBody,
  K8sPodTableRow,
  K8sPodTableCell,
  K8sPodName,
  K8sPodPhase,
  K8sPodRestarts,
};

const POD_ROWS: {
  name: string;
  ns: string;
  phase: PodPhase;
  ready: string;
  restarts: number;
  age: string;
  node: string;
}[] = [
  {
    name: "api-7d9f8c-2xk4p",
    ns: "default",
    phase: "Running",
    ready: "2/2",
    restarts: 0,
    age: "6d",
    node: "node-1",
  },
  {
    name: "api-7d9f8c-9m1qz",
    ns: "default",
    phase: "Running",
    ready: "2/2",
    restarts: 1,
    age: "6d",
    node: "node-2",
  },
  {
    name: "worker-5b6a-jj20d",
    ns: "jobs",
    phase: "ContainerCreating",
    ready: "0/1",
    restarts: 0,
    age: "12s",
    node: "node-3",
  },
  {
    name: "cache-0",
    ns: "data",
    phase: "CrashLoopBackOff",
    ready: "0/1",
    restarts: 7,
    age: "3h",
    node: "node-1",
  },
  {
    name: "migrate-28471",
    ns: "jobs",
    phase: "Succeeded",
    ready: "0/1",
    restarts: 0,
    age: "1h",
    node: "node-2",
  },
];

export default function K8sPodTableBlock() {
  return (
    <section
      data-slot="k8s-pod-table-block"
      className="flex w-full justify-center bg-background p-6 sm:p-10"
    >
      <div className="w-full max-w-3xl">
        <K8sPodTable caption="kubectl get pods -A">
          <K8sPodTableHeader>
            <K8sPodTableRow>
              <K8sPodTableHead>Pod</K8sPodTableHead>
              <K8sPodTableHead>Status</K8sPodTableHead>
              <K8sPodTableHead>Ready</K8sPodTableHead>
              <K8sPodTableHead>Restarts</K8sPodTableHead>
              <K8sPodTableHead>Age</K8sPodTableHead>
              <K8sPodTableHead>Node</K8sPodTableHead>
            </K8sPodTableRow>
          </K8sPodTableHeader>
          <K8sPodTableBody>
            {POD_ROWS.map((pod) => (
              <K8sPodTableRow key={pod.name}>
                <K8sPodName namespace={pod.ns}>{pod.name}</K8sPodName>
                <K8sPodTableCell>
                  <K8sPodPhase phase={pod.phase} />
                </K8sPodTableCell>
                <K8sPodTableCell>{pod.ready}</K8sPodTableCell>
                <K8sPodRestarts count={pod.restarts} />
                <K8sPodTableCell>{pod.age}</K8sPodTableCell>
                <K8sPodTableCell>{pod.node}</K8sPodTableCell>
              </K8sPodTableRow>
            ))}
          </K8sPodTableBody>
        </K8sPodTable>
      </div>
    </section>
  );
}
