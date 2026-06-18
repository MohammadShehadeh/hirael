"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Clock, User, X } from "lucide-react";

import { cn } from "@/lib/utils";

type ApprovalWorkflowStatus = "approved" | "rejected" | "pending" | "current";

type ApprovalWorkflowProps = React.ComponentProps<"ol">;

function ApprovalWorkflow({ className, ...props }: ApprovalWorkflowProps) {
  return (
    <ol
      data-slot="approval-workflow"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
}

const approvalStepVariants = cva(
  cn(
    "group/step relative flex gap-3 pb-6 ps-12 last:pb-0",
    "before:absolute before:start-[15px] before:top-9 before:bottom-0 before:w-px",
    "last:before:hidden",
  ),
  {
    variants: {
      status: {
        approved: "before:bg-success/40",
        rejected: "before:bg-destructive/40",
        pending: "before:bg-border",
        current: "before:bg-accent-cool/40",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  },
);

type ApprovalStepProps = React.ComponentProps<"li"> &
  VariantProps<typeof approvalStepVariants> & {
    /** Outcome of this stage. `current` reads as live (accent-cool, pulsing) and is the step awaiting action. */
    status?: ApprovalWorkflowStatus;
  };

function ApprovalStep({
  status = "pending",
  className,
  ...props
}: ApprovalStepProps) {
  return (
    <li
      data-slot="approval-step"
      data-status={status}
      className={cn(approvalStepVariants({ status }), className)}
      {...props}
    />
  );
}

const approvalStepMarkerVariants = cva(
  "absolute start-0 top-0 z-10 inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-background text-[11px] font-medium [&_svg]:size-4",
  {
    variants: {
      status: {
        approved: "border-success/40 text-success",
        rejected: "border-destructive/40 text-destructive",
        pending: "border-border text-muted-foreground",
        current:
          "border-accent-cool text-accent-cool shadow-[0_0_10px_1px_var(--accent-cool-glow)]",
      },
    },
    defaultVariants: {
      status: "pending",
    },
  },
);

type ApprovalStepMarkerProps = React.ComponentProps<"span"> &
  VariantProps<typeof approvalStepMarkerVariants> & {
    /** Outcome of the stage this marker belongs to. */
    status?: ApprovalWorkflowStatus;
    /** Avatar image for the approver. Falls back to children, then a status icon. */
    src?: string;
    /** Alt text for the avatar image. */
    alt?: string;
  };

function ApprovalStepMarker({
  status = "pending",
  src,
  alt,
  className,
  children,
  ...props
}: ApprovalStepMarkerProps) {
  return (
    <span
      data-slot="approval-step-marker"
      data-status={status}
      className={cn(approvalStepMarkerVariants({ status }), className)}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          className="size-full object-cover"
        />
      ) : (
        (children ?? renderMarkerIcon(status))
      )}
      {status === "current" ? (
        <span aria-hidden className="state-dot absolute -end-0.5 -top-0.5" />
      ) : null}
    </span>
  );
}

function renderMarkerIcon(
  status: ApprovalWorkflowStatus,
): React.ReactElement {
  if (status === "approved") return <Check aria-hidden />;
  if (status === "rejected") return <X aria-hidden />;
  if (status === "pending") return <Clock aria-hidden />;
  return <User aria-hidden />;
}

type ApprovalStepContentProps = React.ComponentProps<"div">;

function ApprovalStepContent({
  className,
  ...props
}: ApprovalStepContentProps) {
  return (
    <div
      data-slot="approval-step-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-1 pt-1", className)}
      {...props}
    />
  );
}

type ApprovalStepTitleProps = React.ComponentProps<"p">;

function ApprovalStepTitle({ className, ...props }: ApprovalStepTitleProps) {
  return (
    <p
      data-slot="approval-step-title"
      className={cn(
        "text-sm font-medium leading-snug text-foreground group-data-[status=pending]/step:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

type ApprovalStepMetaProps = React.ComponentProps<"div">;

function ApprovalStepMeta({ className, ...props }: ApprovalStepMetaProps) {
  return (
    <div
      data-slot="approval-step-meta"
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

type ApprovalStepCommentProps = React.ComponentProps<"blockquote">;

function ApprovalStepComment({
  className,
  ...props
}: ApprovalStepCommentProps) {
  return (
    <blockquote
      data-slot="approval-step-comment"
      className={cn(
        "mt-1 border-s-2 border-border bg-muted/30 px-3 py-2 text-[13px] leading-relaxed text-foreground",
        className,
      )}
      {...props}
    />
  );
}

type ApprovalStepActionsProps = React.ComponentProps<"div">;

function ApprovalStepActions({
  className,
  ...props
}: ApprovalStepActionsProps) {
  return (
    <div
      data-slot="approval-step-actions"
      className={cn("mt-2 flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}

export {
  ApprovalWorkflow,
  ApprovalStep,
  ApprovalStepMarker,
  ApprovalStepContent,
  ApprovalStepTitle,
  ApprovalStepMeta,
  ApprovalStepComment,
  ApprovalStepActions,
};
