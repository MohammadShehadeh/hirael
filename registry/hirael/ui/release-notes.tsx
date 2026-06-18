import * as React from "react";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/registry/hirael/ui/badge";

type ReleaseNotesProps = React.ComponentProps<"section"> & {
  /** Version label shown as a badge in the default header, e.g. "v2.0". */
  version?: React.ReactNode;
  /** Release date shown beside the version, e.g. "June 18, 2026". */
  date?: React.ReactNode;
  /** Release title shown as the heading in the default header. */
  title?: React.ReactNode;
};

function ReleaseNotes({
  version,
  date,
  title,
  className,
  children,
  ...props
}: ReleaseNotesProps) {
  const hasHeaderProps = version != null || date != null || title != null;

  return (
    <section
      data-slot="release-notes"
      className={cn(
        "flex flex-col gap-6 rounded-lg border border-border bg-card p-6 text-card-foreground",
        className,
      )}
      {...props}
    >
      {hasHeaderProps ? (
        <ReleaseNotesHeader version={version} date={date} title={title} />
      ) : null}
      {children}
    </section>
  );
}

type ReleaseNotesHeaderProps = React.ComponentProps<"header"> & {
  version?: React.ReactNode;
  date?: React.ReactNode;
  title?: React.ReactNode;
};

function ReleaseNotesHeader({
  version,
  date,
  title,
  className,
  children,
  ...props
}: ReleaseNotesHeaderProps) {
  return (
    <header
      data-slot="release-notes-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {version != null || date != null ? (
        <div
          data-slot="release-notes-meta"
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          {version != null ? (
            <Badge data-slot="release-notes-version">{version}</Badge>
          ) : null}
          {date != null ? (
            <span data-slot="release-notes-date">{date}</span>
          ) : null}
        </div>
      ) : null}
      {title != null ? (
        <h2
          data-slot="release-notes-title"
          className="text-xl font-semibold tracking-tight text-foreground"
        >
          {title}
        </h2>
      ) : null}
      {children}
    </header>
  );
}

type ReleaseNotesSummaryProps = React.ComponentProps<"p">;

function ReleaseNotesSummary({ className, ...props }: ReleaseNotesSummaryProps) {
  return (
    <p
      data-slot="release-notes-summary"
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

type ReleaseNotesHighlightsProps = React.ComponentProps<"ul">;

function ReleaseNotesHighlights({
  className,
  ...props
}: ReleaseNotesHighlightsProps) {
  return (
    <ul
      data-slot="release-notes-highlights"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

type ReleaseNotesHighlightProps = Omit<React.ComponentProps<"li">, "title"> & {
  /** Optional leading icon. Defaults to a sparkles glyph. */
  icon?: React.ElementType | React.ReactElement | false;
  /** Short headline for the highlight. */
  title: React.ReactNode;
};

function ReleaseNotesHighlight({
  icon,
  title,
  className,
  children,
  ...props
}: ReleaseNotesHighlightProps) {
  const renderIcon = () => {
    if (icon === false) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComponent = (icon as React.ElementType | undefined) ?? Sparkles;
    return <IconComponent className="size-4" aria-hidden />;
  };

  return (
    <li
      data-slot="release-notes-highlight"
      className={cn("flex items-start gap-3", className)}
      {...props}
    >
      {icon !== false ? (
        <span
          data-slot="release-notes-highlight-icon"
          className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-accent text-primary"
        >
          {renderIcon()}
        </span>
      ) : null}
      <div className="flex flex-col gap-0.5">
        <span
          data-slot="release-notes-highlight-title"
          className="text-sm font-medium leading-5 text-foreground"
        >
          {title}
        </span>
        {children ? (
          <span
            data-slot="release-notes-highlight-description"
            className="text-sm leading-relaxed text-muted-foreground"
          >
            {children}
          </span>
        ) : null}
      </div>
    </li>
  );
}

type ReleaseNotesSectionProps = React.ComponentProps<"div"> & {
  /** Label shown above the grouped content. */
  label?: React.ReactNode;
};

function ReleaseNotesSection({
  label,
  className,
  children,
  ...props
}: ReleaseNotesSectionProps) {
  return (
    <div
      data-slot="release-notes-section"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      {label != null ? (
        <p
          data-slot="release-notes-section-label"
          className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground"
        >
          {label}
        </p>
      ) : null}
      {children}
    </div>
  );
}

type ReleaseNotesFooterProps = React.ComponentProps<"div">;

function ReleaseNotesFooter({ className, ...props }: ReleaseNotesFooterProps) {
  return (
    <div
      data-slot="release-notes-footer"
      className={cn(
        "flex flex-wrap items-center gap-2 border-t border-border pt-4",
        className,
      )}
      {...props}
    />
  );
}

export {
  ReleaseNotes,
  ReleaseNotesHeader,
  ReleaseNotesSummary,
  ReleaseNotesHighlights,
  ReleaseNotesHighlight,
  ReleaseNotesSection,
  ReleaseNotesFooter,
};
