"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Brain,
  Check,
  FileOutput,
  Loader2,
  Sparkles,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type AgentWorkflowStatus = "pending" | "running" | "done" | "error";

type AgentWorkflowKind = "thought" | "tool" | "output";

type AgentWorkflowProps = React.ComponentProps<"ol">;

function AgentWorkflow({ className, ...props }: AgentWorkflowProps) {
  return (
    <ol
      data-slot="agent-workflow"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

const agentWorkflowStepVariants = cva(
  cn(
    "group/step relative flex gap-3 pb-5 ps-9 last:pb-0",
    "before:absolute before:start-[11px] before:top-7 before:bottom-0 before:w-px before:bg-border",
    "last:before:hidden",
  ),
  {
    variants: {
      status: {
        pending: "before:bg-border",
        running: "before:bg-accent-cool/40",
        done: "before:bg-border",
        error: "before:bg-border",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  },
);

type AgentWorkflowStepProps = React.ComponentProps<"li"> &
  VariantProps<typeof agentWorkflowStepVariants> & {
    /** Lifecycle of this step. `running` reads as live (accent-cool, pulsing). */
    status?: AgentWorkflowStatus;
    /** What the step represents, used to pick a default marker icon. */
    kind?: AgentWorkflowKind;
  };

function AgentWorkflowStep({
  status = "pending",
  kind,
  className,
  ...props
}: AgentWorkflowStepProps) {
  return (
    <li
      data-slot="agent-workflow-step"
      data-status={status}
      data-kind={kind}
      className={cn(agentWorkflowStepVariants({ status }), className)}
      {...props}
    />
  );
}

const kindIcons: Record<AgentWorkflowKind, LucideIcon> = {
  thought: Brain,
  tool: Wrench,
  output: Sparkles,
};

const agentWorkflowMarkerVariants = cva(
  "absolute start-0 top-0 z-10 inline-flex size-[22px] shrink-0 items-center justify-center rounded-full border bg-background [&_svg]:size-3",
  {
    variants: {
      status: {
        pending: "border-border text-muted-foreground",
        running:
          "border-accent-cool text-accent-cool shadow-[0_0_10px_1px_var(--accent-cool-glow)]",
        done: "border-success/40 text-success",
        error: "border-destructive/40 text-destructive",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  },
);

type AgentWorkflowMarkerProps = React.ComponentProps<"span"> &
  VariantProps<typeof agentWorkflowMarkerVariants> & {
    /** Lifecycle of the step this marker belongs to. */
    status?: AgentWorkflowStatus;
    /** What the step represents. Picks the fallback icon when no children are passed. */
    kind?: AgentWorkflowKind;
  };

function AgentWorkflowMarker({
  status = "pending",
  kind,
  className,
  children,
  ...props
}: AgentWorkflowMarkerProps) {
  return (
    <span
      data-slot="agent-workflow-marker"
      data-status={status}
      className={cn(agentWorkflowMarkerVariants({ status }), className)}
      {...props}
    >
      {children ?? renderMarkerIcon(status, kind)}
      {status === "running" ? (
        <span aria-hidden className="state-dot absolute -end-0.5 -top-0.5" />
      ) : null}
    </span>
  );
}

function renderMarkerIcon(
  status: AgentWorkflowStatus,
  kind?: AgentWorkflowKind,
): React.ReactElement {
  if (status === "done") return <Check aria-hidden />;
  if (status === "error") return <X aria-hidden />;
  if (status === "running") {
    return (
      <Loader2 aria-hidden className="animate-spin motion-reduce:animate-none" />
    );
  }
  const Icon = kind ? kindIcons[kind] : FileOutput;
  return <Icon aria-hidden />;
}

type AgentWorkflowContentProps = React.ComponentProps<"div">;

function AgentWorkflowContent({
  className,
  ...props
}: AgentWorkflowContentProps) {
  return (
    <div
      data-slot="agent-workflow-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-1", className)}
      {...props}
    />
  );
}

type AgentWorkflowTitleProps = React.ComponentProps<"p">;

function AgentWorkflowTitle({ className, ...props }: AgentWorkflowTitleProps) {
  return (
    <p
      data-slot="agent-workflow-title"
      className={cn(
        "text-sm font-medium leading-snug text-foreground group-data-[status=pending]/step:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

type AgentWorkflowMetaProps = React.ComponentProps<"div">;

function AgentWorkflowMeta({ className, ...props }: AgentWorkflowMetaProps) {
  return (
    <div
      data-slot="agent-workflow-meta"
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

type AgentWorkflowDetailProps = React.ComponentProps<"div">;

function AgentWorkflowDetail({ className, ...props }: AgentWorkflowDetailProps) {
  return (
    <div
      data-slot="agent-workflow-detail"
      className={cn(
        "mt-1 rounded-md border border-border bg-muted/30 px-3 py-2 text-[13px] leading-relaxed text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  AgentWorkflow,
  AgentWorkflowStep,
  AgentWorkflowMarker,
  AgentWorkflowContent,
  AgentWorkflowTitle,
  AgentWorkflowMeta,
  AgentWorkflowDetail,
};
