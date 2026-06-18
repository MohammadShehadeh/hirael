"use client";

import * as React from "react";
import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";

type RagCitationsContextValue = {
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
};

const RagCitationsContext =
  React.createContext<RagCitationsContextValue | null>(null);

function useRagCitationsContext(component: string) {
  const ctx = React.useContext(RagCitationsContext);
  if (!ctx) {
    throw new Error(`${component} must be used within <RagCitations>.`);
  }
  return ctx;
}

type RagCitationsProps = React.ComponentProps<"div">;

function RagCitations({ className, children, ...props }: RagCitationsProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const value = React.useMemo<RagCitationsContextValue>(
    () => ({ activeIndex, setActiveIndex }),
    [activeIndex],
  );

  return (
    <RagCitationsContext.Provider value={value}>
      <div
        data-slot="rag-citations"
        className={cn("flex flex-col gap-5", className)}
        {...props}
      >
        {children}
      </div>
    </RagCitationsContext.Provider>
  );
}

type RagCitationsAnswerProps = React.ComponentProps<"div">;

function RagCitationsAnswer({ className, ...props }: RagCitationsAnswerProps) {
  return (
    <div
      data-slot="rag-citations-answer"
      className={cn(
        "text-sm leading-relaxed text-foreground [&_p]:mb-3 [&_p:last-child]:mb-0",
        className,
      )}
      {...props}
    />
  );
}

type RagCitationMarkProps = Omit<React.ComponentProps<"button">, "children"> & {
  /** Citation number, matching the source card with the same index. */
  index: number;
};

function RagCitationMark({
  index,
  className,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...props
}: RagCitationMarkProps) {
  const { activeIndex, setActiveIndex } = useRagCitationsContext(
    "RagCitationMark",
  );
  const isActive = activeIndex === index;

  return (
    <sup className="ms-0.5 inline-block leading-none">
      <button
        type="button"
        data-slot="rag-citation-mark"
        data-active={isActive ? "" : undefined}
        aria-label={`Source ${index}`}
        className={cn(
          "inline-flex min-w-4 items-center justify-center rounded-sm border px-1 align-baseline text-[10px] font-medium tabular-nums transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool",
          isActive
            ? "border-accent-cool bg-accent-cool/15 text-accent-cool"
            : "border-border bg-muted text-muted-foreground hover:border-accent-cool/60 hover:text-foreground",
          className,
        )}
        onMouseEnter={(event) => {
          setActiveIndex(index);
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          setActiveIndex(null);
          onMouseLeave?.(event);
        }}
        onFocus={(event) => {
          setActiveIndex(index);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setActiveIndex(null);
          onBlur?.(event);
        }}
        {...props}
      >
        {index}
      </button>
    </sup>
  );
}

type RagCitationsSourcesProps = React.ComponentProps<"ol">;

function RagCitationsSources({ className, ...props }: RagCitationsSourcesProps) {
  return (
    <ol
      data-slot="rag-citations-sources"
      className={cn("flex list-none flex-col gap-2", className)}
      {...props}
    />
  );
}

type RagCitationSourceProps = React.ComponentProps<"li"> & {
  /** Citation number, matching the inline mark with the same index. */
  index: number;
};

function RagCitationSource({
  index,
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}: RagCitationSourceProps) {
  const { activeIndex, setActiveIndex } = useRagCitationsContext(
    "RagCitationSource",
  );
  const isActive = activeIndex === index;

  return (
    <li
      data-slot="rag-citation-source"
      data-active={isActive ? "" : undefined}
      className={cn(
        "group/source flex gap-3 rounded-md border bg-card p-3 transition-colors",
        isActive
          ? "border-accent-cool ring-1 ring-accent-cool"
          : "border-border hover:border-accent-cool/50",
        className,
      )}
      onMouseEnter={(event) => {
        setActiveIndex(index);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setActiveIndex(null);
        onMouseLeave?.(event);
      }}
      {...props}
    >
      <span
        data-slot="rag-citation-source-index"
        aria-hidden
        className={cn(
          "mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-sm border text-[10px] font-medium tabular-nums transition-colors",
          isActive
            ? "border-accent-cool bg-accent-cool/15 text-accent-cool"
            : "border-border bg-muted text-muted-foreground",
        )}
      >
        {index}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">{children}</div>
    </li>
  );
}

type RagCitationSourceTitleProps = React.ComponentProps<"p">;

function RagCitationSourceTitle({
  className,
  ...props
}: RagCitationSourceTitleProps) {
  return (
    <p
      data-slot="rag-citation-source-title"
      className={cn(
        "text-sm font-medium leading-snug text-foreground",
        className,
      )}
      {...props}
    />
  );
}

type RagCitationSourceSnippetProps = React.ComponentProps<"p">;

function RagCitationSourceSnippet({
  className,
  ...props
}: RagCitationSourceSnippetProps) {
  return (
    <p
      data-slot="rag-citation-source-snippet"
      className={cn(
        "line-clamp-2 text-xs leading-relaxed text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

type RagCitationSourceUrlProps = React.ComponentProps<"a">;

function RagCitationSourceUrl({
  className,
  children,
  ...props
}: RagCitationSourceUrlProps) {
  return (
    <a
      data-slot="rag-citation-source-url"
      className={cn(
        "inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool",
        className,
      )}
      {...props}
    >
      <ExternalLink aria-hidden className="size-3 shrink-0" />
      <span className="truncate">{children}</span>
    </a>
  );
}

type RagCitationScoreProps = React.ComponentProps<"span"> & {
  /** Relevance score for the source, shown as a small chip. */
  score: React.ReactNode;
};

function RagCitationScore({
  score,
  className,
  ...props
}: RagCitationScoreProps) {
  return (
    <span
      data-slot="rag-citation-score"
      className={cn(
        "inline-flex shrink-0 items-center rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground",
        className,
      )}
      {...props}
    >
      {score}
    </span>
  );
}

export {
  RagCitations,
  RagCitationsAnswer,
  RagCitationMark,
  RagCitationsSources,
  RagCitationSource,
  RagCitationSourceTitle,
  RagCitationSourceSnippet,
  RagCitationSourceUrl,
  RagCitationScore,
};
