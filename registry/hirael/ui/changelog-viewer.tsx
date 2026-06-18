"use client";

import * as React from "react";
import {
  Plus,
  Sparkles,
  Trash2,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";

type ChangelogChangeType = "added" | "fixed" | "changed" | "removed";

type ChangelogSectionConfig = {
  type: ChangelogChangeType;
  changes: React.ReactNode[];
};

type ChangelogEntryConfig = {
  version: React.ReactNode;
  date: React.ReactNode;
  title?: React.ReactNode;
  latest?: boolean;
  sections: ChangelogSectionConfig[];
};

const sectionMeta: Record<
  ChangelogChangeType,
  { label: string; icon: LucideIcon; badge: string; marker: string }
> = {
  added: {
    label: "Added",
    icon: Plus,
    badge: "bg-primary text-primary-foreground",
    marker: "bg-primary",
  },
  fixed: {
    label: "Fixed",
    icon: Wrench,
    badge: "border-border bg-transparent text-foreground",
    marker: "bg-foreground",
  },
  changed: {
    label: "Changed",
    icon: Sparkles,
    badge: "bg-muted text-muted-foreground",
    marker: "bg-muted-foreground",
  },
  removed: {
    label: "Removed",
    icon: Trash2,
    badge: "bg-destructive/15 text-destructive",
    marker: "bg-destructive",
  },
};

type ChangelogViewerProps = Omit<React.ComponentProps<"ol">, "children"> & {
  /** Config-driven entries. Omit to compose `ChangelogEntry` children instead. */
  entries?: ChangelogEntryConfig[];
  children?: React.ReactNode;
};

function ChangelogViewer({
  entries,
  className,
  children,
  ...props
}: ChangelogViewerProps) {
  const content =
    children ??
    entries?.map((entry, index) => (
      <ChangelogEntry
        key={index}
        version={entry.version}
        date={entry.date}
        title={entry.title}
        latest={entry.latest}
      >
        {entry.sections.map((section, sectionIndex) => (
          <ChangelogSection key={sectionIndex} type={section.type}>
            <ChangelogList>
              {section.changes.map((change, changeIndex) => (
                <ChangelogItem key={changeIndex}>{change}</ChangelogItem>
              ))}
            </ChangelogList>
          </ChangelogSection>
        ))}
      </ChangelogEntry>
    ));

  if (!content) return null;

  return (
    <ol
      data-slot="changelog-viewer"
      className={cn("relative flex flex-col", className)}
      {...props}
    >
      {content}
    </ol>
  );
}

type ChangelogEntryProps = Omit<React.ComponentProps<"li">, "title"> & {
  /** Release version, e.g. `v1.4.0`. */
  version: React.ReactNode;
  /** Release date, rendered as a `time` element. */
  date: React.ReactNode;
  /** Optional headline for the release. */
  title?: React.ReactNode;
  /** Marks this as the newest release with a live accent-cool marker. */
  latest?: boolean;
};

function ChangelogEntry({
  version,
  date,
  title,
  latest = false,
  className,
  children,
  ...props
}: ChangelogEntryProps) {
  return (
    <li
      data-slot="changelog-entry"
      data-latest={latest || undefined}
      className={cn(
        "group relative flex gap-4 pb-8 ps-7 last:pb-0",
        "before:absolute before:start-[3px] before:top-2 before:bottom-0 before:w-px before:bg-border",
        "last:before:hidden",
        className,
      )}
      {...props}
    >
      <span
        data-slot="changelog-marker"
        aria-hidden
        className={cn(
          "absolute start-0 top-1.5 z-10 inline-flex size-[7px] items-center justify-center rounded-full ring-2 ring-background",
          latest ? "state-dot ring-2" : "bg-muted-foreground",
        )}
      />
      <div
        data-slot="changelog-entry-content"
        className="flex min-w-0 flex-1 flex-col gap-3"
      >
        <div
          data-slot="changelog-entry-header"
          className="flex flex-wrap items-center gap-x-2 gap-y-1"
        >
          <span
            data-slot="changelog-version"
            className="font-mono text-sm font-medium text-foreground"
          >
            {version}
          </span>
          {latest ? (
            <Badge
              variant="outline"
              data-slot="changelog-latest"
              className="border-accent-cool/40 text-accent-cool"
            >
              Latest
            </Badge>
          ) : null}
          <time
            data-slot="changelog-date"
            className="ms-auto font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
          >
            {date}
          </time>
        </div>
        {title ? (
          <p
            data-slot="changelog-title"
            className="text-sm font-medium text-foreground"
          >
            {title}
          </p>
        ) : null}
        {children}
      </div>
    </li>
  );
}

type ChangelogSectionProps = React.ComponentProps<"div"> & {
  /** Change category. Sets the tag Badge label, icon, and token shade. */
  type: ChangelogChangeType;
};

function ChangelogSection({
  type,
  className,
  children,
  ...props
}: ChangelogSectionProps) {
  const meta = sectionMeta[type];
  const Icon = meta.icon;

  return (
    <div
      data-slot="changelog-section"
      data-type={type}
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      <Badge
        data-slot="changelog-tag"
        className={cn("gap-1 font-normal", meta.badge)}
      >
        <Icon aria-hidden />
        {meta.label}
      </Badge>
      {children}
    </div>
  );
}

type ChangelogListProps = React.ComponentProps<"ul">;

function ChangelogList({ className, ...props }: ChangelogListProps) {
  return (
    <ul
      data-slot="changelog-list"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    />
  );
}

type ChangelogItemProps = React.ComponentProps<"li">;

function ChangelogItem({ className, ...props }: ChangelogItemProps) {
  return (
    <li
      data-slot="changelog-item"
      className={cn(
        "relative ps-4 text-sm text-muted-foreground",
        "before:absolute before:start-0 before:top-2 before:size-1 before:rounded-full before:bg-muted-foreground/50",
        className,
      )}
      {...props}
    />
  );
}

export {
  ChangelogViewer,
  ChangelogEntry,
  ChangelogSection,
  ChangelogList,
  ChangelogItem,
};
