"use client";

import * as React from "react";
import { Rss } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";
import { Button } from "@/registry/hirael/ui/button";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/hirael/ui/toggle-group";

export type ChangelogTagKind = "new" | "improved" | "fixed";
export type ChangelogFilterValue = "all" | ChangelogTagKind;

const TAG_LABELS: Record<ChangelogTagKind, string> = {
  new: "New",
  improved: "Improved",
  fixed: "Fixed",
};

const TAG_CLASSES: Record<ChangelogTagKind, string> = {
  new: "bg-success/10 text-success",
  improved: "bg-info/10 text-info",
  fixed: "bg-warning/10 text-warning",
};

interface ChangelogContextValue {
  filter: ChangelogFilterValue;
  setFilter: (filter: ChangelogFilterValue) => void;}

const ChangelogContext = React.createContext<ChangelogContextValue | null>(
  null,
);

const useChangelog = () => {
  const ctx = React.useContext(ChangelogContext);
  if (!ctx) {
    throw new Error("Changelog parts must be used within <Changelog>");
  }
  return ctx;
};

interface ChangelogProps extends React.ComponentProps<"section"> {
  filter?: ChangelogFilterValue;
  defaultFilter?: ChangelogFilterValue;
  onFilterChange?: (filter: ChangelogFilterValue) => void;}

const Changelog = ({
  filter: filterProp,
  defaultFilter = "all",
  onFilterChange,
  className,
  children,
  ...props
}: ChangelogProps) => {
  const [filterState, setFilterState] = React.useState(defaultFilter);
  const filter = filterProp ?? filterState;

  const setFilter = React.useCallback(
    (next: ChangelogFilterValue) => {
      if (filterProp === undefined) setFilterState(next);
      onFilterChange?.(next);
    },
    [filterProp, onFilterChange],
  );

  const value = React.useMemo(
    () => ({ filter, setFilter }),
    [filter, setFilter],
  );

  return (
    <ChangelogContext.Provider value={value}>
      <section
        data-slot="changelog"
        className={cn("bg-background py-16 sm:py-24", className)}
        {...props}
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 md:px-10">
          {children}
        </div>
      </section>
    </ChangelogContext.Provider>
  );
};

type ChangelogHeaderProps = React.ComponentProps<"header">;

const ChangelogHeader = ({ className, ...props }: ChangelogHeaderProps) => {
  return (
    <header
      data-slot="changelog-header"
      className={cn(
        "flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
      {...props}
    />
  );
};

type ChangelogTitleProps = React.ComponentProps<"h1">;

const ChangelogTitle = ({ className, ...props }: ChangelogTitleProps) => {
  return (
    <h1
      data-slot="changelog-title"
      className={cn(
        "font-serif text-4xl font-medium leading-[1.04] tracking-tight text-foreground sm:text-5xl",
        className,
      )}
      {...props}
    />
  );
};

type ChangelogDescriptionProps = React.ComponentProps<"p">;

const ChangelogDescription = ({
  className,
  ...props
}: ChangelogDescriptionProps) => {
  return (
    <p
      data-slot="changelog-description"
      className={cn("max-w-md text-sm text-muted-foreground", className)}
      {...props}
    />
  );
};

type ChangelogSubscribeProps = React.ComponentProps<typeof Button>;

const ChangelogSubscribe = ({
  className,
  children = "Subscribe",
  ...props
}: ChangelogSubscribeProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      data-slot="changelog-subscribe"
      className={className}
      {...props}
    >
      <Rss aria-hidden />
      {children}
    </Button>
  );
};

const FILTERS: readonly { value: ChangelogFilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "improved", label: "Improved" },
  { value: "fixed", label: "Fixed" },
];

type ChangelogFilterProps = Omit<
  React.ComponentProps<typeof ToggleGroup>,
  "type" | "value" | "onValueChange" | "defaultValue"
>;

const ChangelogFilter = ({ className, ...props }: ChangelogFilterProps) => {
  const { filter, setFilter } = useChangelog();
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      size="sm"
      value={filter}
      onValueChange={(next) => {
        // Radix clears the value when the active item is clicked again;
        // keep one filter selected at all times.
        if (next) setFilter(next as ChangelogFilterValue);
      }}
      aria-label="Filter releases"
      data-slot="changelog-filter"
      className={className}
      {...props}
    >
      {FILTERS.map((item) => (
        <ToggleGroupItem
          key={item.value}
          value={item.value}
          className="text-xs"
        >
          {item.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

type ChangelogListProps = React.ComponentProps<"div">;

const ChangelogList = ({ className, ...props }: ChangelogListProps) => {
  return (
    <div
      data-slot="changelog-list"
      className={cn("flex flex-col", className)}
      {...props}
    />
  );
};

const formatDate = (date: string) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

interface ChangelogEntryDateProps extends Omit<
  React.ComponentProps<"time">,
  "children"
> {
  date: string;}

const ChangelogEntryDate = ({
  date,
  className,
  ...props
}: ChangelogEntryDateProps) => {
  return (
    <time
      dateTime={date}
      data-slot="changelog-entry-date"
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground",
        className,
      )}
      {...props}
    >
      {formatDate(date)}
    </time>
  );
};

type ChangelogEntryVersionProps = React.ComponentProps<typeof Badge>;

const ChangelogEntryVersion = ({
  className,
  ...props
}: ChangelogEntryVersionProps) => {
  return (
    <Badge
      variant="outline"
      data-slot="changelog-entry-version"
      className={cn("font-mono text-[11px] tabular-nums", className)}
      {...props}
    />
  );
};

interface ChangelogEntryProps extends React.ComponentProps<"article"> {
  version: string;
  /** ISO date, e.g. "2026-08-12". */
  date: string;
  /** Used by the filter; the entry hides itself when it has no matching tag. */
  tags?: readonly ChangelogTagKind[];}

const ChangelogEntry = ({
  version,
  date,
  tags = [],
  className,
  children,
  ...props
}: ChangelogEntryProps) => {
  const { filter } = useChangelog();
  if (filter !== "all" && !tags.includes(filter)) return null;

  return (
    <article
      data-slot="changelog-entry"
      data-version={version}
      className={cn(
        "grid grid-cols-1 gap-4 border-b border-border py-10 last:border-b-0 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-10",
        className,
      )}
      {...props}
    >
      <div className="flex flex-row items-center gap-3 self-start lg:sticky lg:top-6 lg:flex-col lg:items-start lg:gap-2">
        <ChangelogEntryDate date={date} />
        <ChangelogEntryVersion>v{version}</ChangelogEntryVersion>
      </div>
      <div className="flex min-w-0 flex-col gap-4">{children}</div>
    </article>
  );
};

type ChangelogEntryTagsProps = React.ComponentProps<"div">;

const ChangelogEntryTags = ({ className, ...props }: ChangelogEntryTagsProps) => {
  return (
    <div
      data-slot="changelog-entry-tags"
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      {...props}
    />
  );
};

interface ChangelogEntryTagProps extends Omit<
  React.ComponentProps<typeof Badge>,
  "variant" | "children"
> {
  kind: ChangelogTagKind;
  children?: React.ReactNode;}

const ChangelogEntryTag = ({
  kind,
  className,
  children,
  ...props
}: ChangelogEntryTagProps) => {
  return (
    <Badge
      variant="secondary"
      data-slot="changelog-entry-tag"
      data-kind={kind}
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.08em]",
        TAG_CLASSES[kind],
        className,
      )}
      {...props}
    >
      {children ?? TAG_LABELS[kind]}
    </Badge>
  );
};

type ChangelogEntryTitleProps = React.ComponentProps<"h2">;

const ChangelogEntryTitle = ({
  className,
  ...props
}: ChangelogEntryTitleProps) => {
  return (
    <h2
      data-slot="changelog-entry-title"
      className={cn(
        "text-xl font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-2xl",
        className,
      )}
      {...props}
    />
  );
};

type ChangelogEntryBodyProps = React.ComponentProps<"ul">;

const ChangelogEntryBody = ({ className, ...props }: ChangelogEntryBodyProps) => {
  return (
    <ul
      data-slot="changelog-entry-body"
      className={cn(
        "flex list-disc flex-col gap-2 ps-5 text-sm leading-relaxed text-muted-foreground marker:text-border",
        className,
      )}
      {...props}
    />
  );
};

export {
  Changelog,
  ChangelogHeader,
  ChangelogTitle,
  ChangelogDescription,
  ChangelogSubscribe,
  ChangelogFilter,
  ChangelogList,
  ChangelogEntry,
  ChangelogEntryDate,
  ChangelogEntryVersion,
  ChangelogEntryTags,
  ChangelogEntryTag,
  ChangelogEntryTitle,
  ChangelogEntryBody,
  useChangelog,
};

const ENTRIES: readonly {
  version: string;
  date: string;
  title: string;
  tags: readonly ChangelogTagKind[];
  items: readonly string[];
}[] = [
  {
    version: "2.6.0",
    date: "2026-08-19",
    title: "Scheduled digests and a faster inbox",
    tags: ["new", "improved"],
    items: [
      "Send yourself a daily or weekly digest of unread threads. Pick the hour in Settings, Notifications.",
      "Inbox now loads the first 50 threads from cache, so it paints in under 100ms on a warm start.",
      "Keyboard: J and K move between threads, E archives, R replies.",
    ],
  },
  {
    version: "2.5.2",
    date: "2026-08-05",
    title: "Fixes for shared drafts",
    tags: ["fixed"],
    items: [
      "Two people editing the same draft no longer overwrite each other's paragraph on save.",
      "Attachments over 25 MB show a clear error instead of a spinner that never stops.",
      "Fixed the search box losing focus when results update.",
    ],
  },
  {
    version: "2.5.0",
    date: "2026-07-22",
    title: "Threads can be assigned",
    tags: ["new"],
    items: [
      "Assign a thread to a teammate from the thread header or with Shift+A. Assignees get a notification and the thread shows up in their Assigned view.",
      "Filter any view by assignee, including Unassigned.",
      "Zapier and the public API expose assignee on thread objects.",
    ],
  },
  {
    version: "2.4.1",
    date: "2026-07-08",
    title: "Quieter notifications, better search",
    tags: ["improved", "fixed"],
    items: [
      "Mentions inside quoted text no longer trigger a notification.",
      "Search understands from:, to:, and before: without quotes around dates.",
      "Fixed a case where archived threads reappeared after a reconnect.",
    ],
  },
];

const Changelog01Block = () => {
  return (
    <Changelog data-slot="changelog-01-block">
      <ChangelogHeader>
        <div className="flex flex-col gap-3">
          <ChangelogTitle>Changelog</ChangelogTitle>
          <ChangelogDescription>
            What shipped in Relay, most recent first. Releases go out every
            other Tuesday.
          </ChangelogDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ChangelogFilter />
          <ChangelogSubscribe />
        </div>
      </ChangelogHeader>

      <ChangelogList>
        {ENTRIES.map((entry) => (
          <ChangelogEntry
            key={entry.version}
            version={entry.version}
            date={entry.date}
            tags={entry.tags}
          >
            <ChangelogEntryTags>
              {entry.tags.map((tag) => (
                <ChangelogEntryTag key={tag} kind={tag} />
              ))}
            </ChangelogEntryTags>
            <ChangelogEntryTitle>{entry.title}</ChangelogEntryTitle>
            <ChangelogEntryBody>
              {entry.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ChangelogEntryBody>
          </ChangelogEntry>
        ))}
      </ChangelogList>
    </Changelog>
  );
};

export default Changelog01Block;
