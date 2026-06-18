"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, Wrench, X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/hirael/ui/collapsible";

type AiToolCallStatus = "pending" | "success" | "error";

const AiToolCallStatusContext = React.createContext<AiToolCallStatus>("pending");

function useAiToolCallStatus() {
  return React.useContext(AiToolCallStatusContext);
}

type AiToolCallProps = Omit<
  React.ComponentProps<typeof Collapsible>,
  "asChild"
> & {
  /** Lifecycle of the tool call. Drives the badge, dot, and default open state. */
  status?: AiToolCallStatus;
};

function AiToolCall({
  status = "pending",
  open,
  defaultOpen,
  className,
  children,
  ...props
}: AiToolCallProps) {
  return (
    <AiToolCallStatusContext.Provider value={status}>
      <Collapsible
        data-slot="ai-tool-call"
        data-status={status}
        open={open}
        defaultOpen={defaultOpen ?? status === "error"}
        className={cn(
          "overflow-hidden rounded-md border border-border bg-card",
          className,
        )}
        {...props}
      >
        {children}
      </Collapsible>
    </AiToolCallStatusContext.Provider>
  );
}

type AiToolCallTriggerProps = Omit<
  React.ComponentProps<typeof CollapsibleTrigger>,
  "children"
> & {
  /** The tool or function name, rendered in mono as the row label. */
  name: string;
  icon?: React.ReactNode;
};

function AiToolCallTrigger({
  name,
  icon,
  className,
  ...props
}: AiToolCallTriggerProps) {
  return (
    <CollapsibleTrigger
      data-slot="ai-tool-call-trigger"
      className={cn(
        "group flex w-full items-center gap-3 px-4 py-3 text-start transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      <span
        data-slot="ai-tool-call-icon"
        className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-border bg-muted/40 text-muted-foreground [&_svg]:size-3.5"
        aria-hidden
      >
        {icon ?? <Wrench />}
      </span>
      <code
        data-slot="ai-tool-call-name"
        className="min-w-0 flex-1 truncate font-mono text-sm text-foreground"
      >
        {name}
      </code>
      <AiToolCallStatusBadge />
      <ChevronDown
        aria-hidden
        className="size-3.5 shrink-0 text-muted-foreground transition-transform duration-150 group-data-[state=open]:rotate-180 rtl:rotate-180 rtl:group-data-[state=open]:rotate-0"
      />
    </CollapsibleTrigger>
  );
}

const aiToolCallBadgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1.5 rounded-sm border px-1.5 py-0.5 font-mono text-[10px] uppercase leading-none tracking-[0.08em] [&_svg]:size-3",
  {
    variants: {
      status: {
        pending: "border-border text-muted-foreground",
        success: "border-success/30 text-success",
        error: "border-destructive/30 text-destructive",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  },
);

const aiToolCallStatusLabels: Record<AiToolCallStatus, string> = {
  pending: "Running",
  success: "Done",
  error: "Error",
};

type AiToolCallStatusBadgeProps = Omit<
  React.ComponentProps<"span">,
  "children"
> &
  VariantProps<typeof aiToolCallBadgeVariants>;

function AiToolCallStatusBadge({
  status: statusProp,
  className,
  ...props
}: AiToolCallStatusBadgeProps) {
  const contextStatus = useAiToolCallStatus();
  const status = statusProp ?? contextStatus;

  return (
    <span
      data-slot="ai-tool-call-status"
      data-status={status}
      className={cn(aiToolCallBadgeVariants({ status }), className)}
      {...props}
    >
      <AiToolCallStatusDot status={status} />
      {aiToolCallStatusLabels[status]}
    </span>
  );
}

type AiToolCallStatusDotProps = React.ComponentProps<"span"> & {
  status?: AiToolCallStatus;
};

function AiToolCallStatusDot({
  status: statusProp,
  className,
  ...props
}: AiToolCallStatusDotProps) {
  const contextStatus = useAiToolCallStatus();
  const status = statusProp ?? contextStatus;

  if (status === "pending") {
    return (
      <span
        data-slot="ai-tool-call-status-dot"
        data-status={status}
        className={cn("state-dot", className)}
        {...props}
      />
    );
  }

  if (status === "success") {
    return <Check data-slot="ai-tool-call-status-dot" aria-hidden />;
  }

  return <X data-slot="ai-tool-call-status-dot" aria-hidden />;
}

type AiToolCallContentProps = React.ComponentProps<typeof CollapsibleContent>;

function AiToolCallContent({
  className,
  children,
  ...props
}: AiToolCallContentProps) {
  return (
    <CollapsibleContent asChild>
      <div
        data-slot="ai-tool-call-content"
        className={cn(
          "flex flex-col gap-4 border-t border-border bg-muted/30 px-4 py-3",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContent>
  );
}

type AiToolCallSectionProps = React.ComponentProps<"section"> & {
  /** Label shown above the block, e.g. "Arguments" or "Result". */
  label: React.ReactNode;
};

function AiToolCallSection({
  label,
  className,
  children,
  ...props
}: AiToolCallSectionProps) {
  return (
    <section
      data-slot="ai-tool-call-section"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </p>
      {children}
    </section>
  );
}

function AiToolCallJson({
  value,
  className,
  ...props
}: React.ComponentProps<"pre"> & {
  /** Any JSON-serializable value, rendered pretty-printed with two-space indent. */
  value: unknown;
}) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-sm border border-border bg-background p-3 font-mono text-[12px] leading-relaxed text-foreground",
        className,
      )}
      {...props}
    >
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

type AiToolCallArgumentsProps = Omit<
  React.ComponentProps<typeof AiToolCallJson>,
  "value"
> & {
  /** The call arguments object, shown as pretty-printed JSON. */
  value: unknown;
};

function AiToolCallArguments({ ...props }: AiToolCallArgumentsProps) {
  return <AiToolCallJson data-slot="ai-tool-call-arguments" {...props} />;
}

type AiToolCallResultProps = Omit<
  React.ComponentProps<typeof AiToolCallJson>,
  "value"
> & {
  /** The value the tool returned, shown as pretty-printed JSON. */
  value: unknown;
};

function AiToolCallResult({ ...props }: AiToolCallResultProps) {
  return <AiToolCallJson data-slot="ai-tool-call-result" {...props} />;
}

export {
  AiToolCall,
  AiToolCallTrigger,
  AiToolCallStatusBadge,
  AiToolCallStatusDot,
  AiToolCallContent,
  AiToolCallSection,
  AiToolCallArguments,
  AiToolCallResult,
  type AiToolCallStatus,
};
