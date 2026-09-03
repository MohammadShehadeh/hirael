'use client';

import * as React from 'react';
import { ChevronDown, Loader2, RotateCw } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/hirael/bases/radix/ui/collapsible';
import { CopyButton } from '@/registry/hirael/bases/radix/components/copy-button';

const ErrorPage = ({ className, ...props }: React.ComponentProps<'section'>) => {
  return (
    <section
      data-slot="error-page"
      className={cn('flex min-h-svh items-center justify-center bg-background py-20', className)}
      {...props}
    />
  );
};

const ErrorPageEyebrow = ({ className, ...props }: React.ComponentProps<'span'>) => {
  return (
    <span
      data-slot="error-page-eyebrow"
      className={cn('font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground', className)}
      {...props}
    />
  );
};

const ErrorPageTitle = ({ className, ...props }: React.ComponentProps<'h1'>) => {
  return (
    <h1
      data-slot="error-page-title"
      className={cn('font-serif text-5xl font-medium leading-none tracking-tight sm:text-6xl md:text-7xl', className)}
      {...props}
    />
  );
};

const ErrorPageDescription = ({ className, ...props }: React.ComponentProps<'p'>) => {
  return (
    <p
      data-slot="error-page-description"
      className={cn('max-w-md text-base text-muted-foreground sm:text-lg', className)}
      {...props}
    />
  );
};

export interface ErrorPageActionsProps extends React.ComponentProps<'div'> {
  /** Runs on "Try again". Defaults to reloading the page. */
  onRetry?: () => void | Promise<void>;
  retryLabel?: React.ReactNode;
  homeHref?: string;
  homeLabel?: React.ReactNode;
}

const ErrorPageActions = ({
  onRetry,
  retryLabel = 'Try again',
  homeHref = '/',
  homeLabel = 'Go home',
  className,
  children,
  ...props
}: ErrorPageActionsProps) => {
  const [retrying, setRetrying] = React.useState(false);

  const retry = React.useCallback(async () => {
    if (onRetry) {
      setRetrying(true);
      try {
        await onRetry();
      } finally {
        setRetrying(false);
      }
      return;
    }
    if (typeof window !== 'undefined') window.location.reload();
  }, [onRetry]);

  return (
    <div data-slot="error-page-actions" className={cn('flex flex-wrap items-center gap-3', className)} {...props}>
      <Button type="button" size="lg" onClick={() => void retry()} disabled={retrying}>
        {retrying ? (
          <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
        ) : (
          <RotateCw className="size-4" />
        )}
        {retryLabel}
      </Button>
      <Button asChild variant="outline" size="lg">
        <a href={homeHref}>{homeLabel}</a>
      </Button>
      {children}
    </div>
  );
};

export interface ErrorPageDetailsProps extends React.ComponentProps<'div'> {
  requestId: string;
  /** ISO 8601 string or preformatted text. */
  timestamp: string;
  /** Extra mono rows rendered below the defaults. */
  rows?: ReadonlyArray<{ label: string; value: string }>;
  defaultOpen?: boolean;
}

const ErrorPageDetails = ({
  requestId,
  timestamp,
  rows = [],
  defaultOpen = false,
  className,
  ...props
}: ErrorPageDetailsProps) => {
  const allRows = React.useMemo(
    () => [{ label: 'Request ID', value: requestId }, { label: 'Timestamp', value: timestamp }, ...rows],
    [requestId, timestamp, rows],
  );
  const copyText = React.useMemo(() => allRows.map((r) => `${r.label}: ${r.value}`).join('\n'), [allRows]);

  return (
    <Collapsible defaultOpen={defaultOpen} asChild>
      <div data-slot="error-page-details" className={cn('w-full border-t border-border pt-4', className)} {...props}>
        <CollapsibleTrigger className="group inline-flex items-center gap-2 rounded-sm font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <ChevronDown className="size-3.5 transition-transform duration-150 motion-reduce:transition-none group-data-[state=open]:rotate-180" />
          Technical details
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="flex flex-col gap-3 rounded-sm border border-border bg-card p-4">
            <dl className="flex flex-col gap-2">
              {allRows.map((row) => (
                <div
                  key={row.label}
                  data-slot="error-page-details-row"
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-xs"
                >
                  <dt className="font-mono uppercase tracking-[0.08em] text-muted-foreground">{row.label}</dt>
                  <dd dir="ltr" className="select-all font-mono tabular-nums text-foreground">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex justify-end border-t border-border pt-3">
              <CopyButton value={copyText} variant="outline" size="sm">
                Copy details
              </CopyButton>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export interface ErrorPageStatusProps extends React.ComponentProps<'a'> {
  tone?: 'success' | 'warning' | 'destructive';
}

const ErrorPageStatus = ({ tone = 'success', className, children, ...props }: ErrorPageStatusProps) => {
  const dot = tone === 'warning' ? 'bg-warning' : tone === 'destructive' ? 'bg-destructive' : 'bg-success';
  return (
    <a
      data-slot="error-page-status"
      data-tone={tone}
      className={cn(
        'inline-flex items-center gap-2 rounded-sm font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      {...props}
    >
      <span aria-hidden className={cn('size-1.5 rounded-full', dot)} />
      {children}
    </a>
  );
};

const REQUEST_ID = 'req_8f2a1c9e4b7d';
const TIMESTAMP = '2026-08-26T14:32:07.412Z';

const Error01 = () => {
  return (
    <ErrorPage data-slot="error-01-block">
      <div className="mx-auto w-full max-w-2xl px-6 md:px-10">
        <div className="flex flex-col items-start gap-6">
          <ErrorPageEyebrow>500</ErrorPageEyebrow>
          <ErrorPageTitle>Something broke on our end.</ErrorPageTitle>
          <ErrorPageDescription>
            The request hit an error we didn&apos;t expect. It&apos;s been logged, and retrying usually works. If it
            keeps happening, send us the details below.
          </ErrorPageDescription>

          <ErrorPageActions homeHref="#" onRetry={() => new Promise((r) => setTimeout(r, 900))} />

          <ErrorPageDetails
            requestId={REQUEST_ID}
            timestamp={TIMESTAMP}
            rows={[
              { label: 'Route', value: 'GET /api/projects/prj_41/deploys' },
              { label: 'Region', value: 'fra1' },
            ]}
          />

          <ErrorPageStatus href="#">Status: all systems operational</ErrorPageStatus>
        </div>
      </div>
    </ErrorPage>
  );
};

export {
  ErrorPage,
  ErrorPageEyebrow,
  ErrorPageTitle,
  ErrorPageDescription,
  ErrorPageActions,
  ErrorPageDetails,
  ErrorPageStatus,
};

export default Error01;
