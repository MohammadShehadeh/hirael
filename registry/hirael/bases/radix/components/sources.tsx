'use client';

import * as React from 'react';
import { ArrowUpRight, ChevronDown, Globe } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/hirael/bases/radix/ui/collapsible';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/registry/hirael/bases/radix/ui/hover-card';

export interface SourceItem {
  /** Link to the page the answer drew on. */
  url: string;
  title: string;
  /** Quote or summary shown in the preview. */
  snippet?: string;
  /** Small logo for the site. Falls back to a globe. */
  icon?: React.ReactNode;
}

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

interface SourceIconProps {
  icon: React.ReactNode;
}

const SourceIcon = ({ icon }: SourceIconProps) => (
  <span
    aria-hidden
    className="flex size-4 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-muted text-muted-foreground [&_img]:size-full [&_svg]:size-3"
  >
    {icon ?? <Globe />}
  </span>
);

export interface SourcesProps extends React.ComponentProps<typeof Collapsible> {
  sources: SourceItem[];
  /** Text of the toggle, given the number of sources. */
  label?: (count: number) => React.ReactNode;
}

/** A collapsed "Used 4 sources" line that opens into a numbered list. */
const Sources = ({
  sources,
  label = (count) => `Used ${count} ${count === 1 ? 'source' : 'sources'}`,
  className,
  ...props
}: SourcesProps) => {
  return (
    <Collapsible data-slot="sources" className={cn('flex flex-col gap-2', className)} {...props}>
      <CollapsibleTrigger asChild>
        <button
          type="button"
          data-slot="sources-trigger"
          className="group/sources inline-flex w-fit items-center gap-2 rounded-md text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <span aria-hidden className="flex *:not-first:-ms-1">
            {sources.slice(0, 3).map((source) => (
              <span key={source.url} className="rounded-sm ring-2 ring-background">
                <SourceIcon icon={source.icon} />
              </span>
            ))}
          </span>
          {label(sources.length)}
          <ChevronDown
            aria-hidden
            className="size-4 transition-transform group-aria-expanded/sources:rotate-180 motion-reduce:transition-none"
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ol data-slot="sources-list" className="grid gap-1.5 sm:grid-cols-2">
          {sources.map((source, index) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                data-slot="source"
                className="flex h-full items-start gap-2.5 rounded-lg border border-border bg-card p-2.5 text-card-foreground transition-colors outline-none hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] text-muted-foreground tabular-nums">
                  {index + 1}
                </span>
                <span className="grid min-w-0 gap-0.5">
                  <span className="truncate text-sm font-medium">{source.title}</span>
                  <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                    <SourceIcon icon={source.icon} />
                    <span className="truncate">{hostOf(source.url)}</span>
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </CollapsibleContent>
    </Collapsible>
  );
};

export interface CitationProps extends Omit<React.ComponentProps<'a'>, 'href' | 'children'> {
  source: SourceItem;
  /** Number shown in the chip, matching the source's place in the list. */
  index: number;
}

/** An inline numbered chip that previews its source on hover or focus. */
const Citation = ({ source, index, className, ...props }: CitationProps) => {
  const host = hostOf(source.url);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer"
          aria-label={`${index}: ${source.title}`}
          data-slot="citation"
          className={cn(
            'mx-0.5 inline-flex h-4 min-w-4 -translate-y-px items-center justify-center rounded-full bg-muted px-1 align-middle text-[10px] font-medium text-muted-foreground tabular-nums no-underline transition-colors outline-none hover:bg-primary hover:text-primary-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50',
            className,
          )}
          {...props}
        >
          {index}
        </a>
      </HoverCardTrigger>
      <HoverCardContent data-slot="citation-preview" className="w-72">
        <div className="grid gap-1.5">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <SourceIcon icon={source.icon} />
            <span className="truncate">{host}</span>
          </span>
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-start gap-1 text-sm font-medium hover:underline"
          >
            {source.title}
            <ArrowUpRight aria-hidden className="mt-0.5 size-3.5 shrink-0 text-muted-foreground rtl:-scale-x-100" />
          </a>
          {source.snippet && (
            <p className="line-clamp-4 text-xs leading-relaxed text-muted-foreground">{source.snippet}</p>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export { Sources, Citation };
