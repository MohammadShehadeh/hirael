"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/hirael/ui/collapsible";

type InspectorPanelProps = React.ComponentProps<"aside">;

function InspectorPanel({ className, ...props }: InspectorPanelProps) {
  return (
    <aside
      data-slot="inspector-panel"
      className={cn(
        "flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
        className,
      )}
      {...props}
    />
  );
}

type InspectorPanelHeaderProps = React.ComponentProps<"div">;

function InspectorPanelHeader({
  className,
  ...props
}: InspectorPanelHeaderProps) {
  return (
    <div
      data-slot="inspector-panel-header"
      className={cn(
        "flex items-center justify-between gap-2 border-b border-border px-3 py-2.5",
        className,
      )}
      {...props}
    />
  );
}

type InspectorPanelTitleProps = React.ComponentProps<"p">;

function InspectorPanelTitle({
  className,
  ...props
}: InspectorPanelTitleProps) {
  return (
    <p
      data-slot="inspector-panel-title"
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

type InspectorPanelSectionProps = React.ComponentProps<"div"> & {
  title: React.ReactNode;
  defaultOpen?: boolean;
};

function InspectorPanelSection({
  title,
  defaultOpen = true,
  className,
  children,
  ...props
}: InspectorPanelSectionProps) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      data-slot="inspector-panel-section"
      className={cn("border-b border-border last:border-b-0", className)}
      {...props}
    >
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-2 px-3 py-2 text-start transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
        <span className="text-xs font-medium text-foreground">{title}</span>
        <ChevronDown
          aria-hidden
          className="size-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-2 px-3 pb-3 pt-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

type InspectorPanelRowProps = React.ComponentProps<"div"> & {
  label: React.ReactNode;
};

function InspectorPanelRow({
  label,
  className,
  children,
  ...props
}: InspectorPanelRowProps) {
  return (
    <div
      data-slot="inspector-panel-row"
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-2",
        className,
      )}
      {...props}
    >
      <span className="truncate text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center justify-end gap-1.5">{children}</div>
    </div>
  );
}

export {
  InspectorPanel,
  InspectorPanelHeader,
  InspectorPanelTitle,
  InspectorPanelSection,
  InspectorPanelRow,
};
