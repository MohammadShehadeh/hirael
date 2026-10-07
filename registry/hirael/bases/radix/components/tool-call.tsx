'use client';

import * as React from 'react';
import { ChevronDown, CircleAlert, CircleCheck, CircleDashed, Hand, LoaderCircle, Wrench } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/registry/hirael/bases/radix/ui/badge';
import { Button } from '@/registry/hirael/bases/radix/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/hirael/bases/radix/ui/collapsible';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

export type ToolCallStatus = 'pending' | 'approval' | 'running' | 'done' | 'error' | 'denied';

export interface ToolCallLabels {
  status: Record<ToolCallStatus, string>;
  input: string;
  output: string;
  error: string;
  approve: string;
  deny: string;
  approvalPrompt: string;
}

const DEFAULT_LABELS: ToolCallLabels = {
  status: {
    pending: 'Pending',
    approval: 'Needs approval',
    running: 'Running',
    done: 'Done',
    error: 'Failed',
    denied: 'Denied',
  },
  input: 'Input',
  output: 'Output',
  error: 'Error',
  approve: 'Allow',
  deny: 'Deny',
  approvalPrompt: 'This tool wants to run with the input above.',
};

const STATUS_ICON: Record<ToolCallStatus, StatusIcon> = {
  pending: { icon: CircleDashed, className: 'text-muted-foreground' },
  approval: { icon: Hand, className: 'text-warning' },
  running: { icon: LoaderCircle, className: 'animate-spin text-primary motion-reduce:animate-none' },
  done: { icon: CircleCheck, className: 'text-success' },
  error: { icon: CircleAlert, className: 'text-destructive' },
  denied: { icon: CircleAlert, className: 'text-muted-foreground' },
};

interface ToolCallContextValue {
  name: string;
  status: ToolCallStatus;
  input: unknown;
  output: unknown;
  error?: string;
  durationMs?: number;
  labels: ToolCallLabels;
  onApprove?: () => void;
  onDeny?: () => void;
}

const ToolCallContext = React.createContext<ToolCallContextValue | null>(null);

const useToolCall = () => {
  const ctx = React.useContext(ToolCallContext);
  if (!ctx) {
    throw new Error('ToolCall compound parts must be used inside <ToolCall>');
  }

  return ctx;
};

export type ToolCallLabelOverrides = Partial<Omit<ToolCallLabels, 'status'>> & {
  status?: Partial<ToolCallLabels['status']>;
};

interface StatusIcon {
  icon: typeof Wrench;
  className: string;
}

export interface ToolCallProps extends Omit<
  React.ComponentProps<typeof Collapsible>,
  'open' | 'defaultOpen' | 'onOpenChange'
> {
  /** Tool name as the model called it, like `search_docs`. */
  name: string;
  status?: ToolCallStatus;
  /** Arguments the model passed. Objects are shown as formatted JSON. */
  input?: unknown;
  /** What the tool returned. Objects are shown as formatted JSON. */
  output?: unknown;
  /** Shown when `status` is `error`. */
  error?: string;
  /** How long the call took, shown beside the status. */
  durationMs?: number;
  /** Called by the Allow button while `status` is `approval`. */
  onApprove?: () => void;
  /** Called by the Deny button while `status` is `approval`. */
  onDeny?: () => void;
  open?: boolean;
  /** Starts open when the call needs approval or failed, and opens when it later turns into either, so neither goes unseen. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  labels?: ToolCallLabelOverrides;
}

const ToolCall = ({
  name,
  status = 'done',
  input,
  output,
  error,
  durationMs,
  onApprove,
  onDeny,
  open: openProp,
  defaultOpen,
  onOpenChange,
  labels,
  className,
  children,
  ...props
}: ToolCallProps) => {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? (status === 'approval' || status === 'error'),
    onChange: onOpenChange,
  });

  // A streamed call mounts as pending or running, so its later approval or error opens it here.
  const prevStatusRef = React.useRef(status);
  React.useEffect(() => {
    if (prevStatusRef.current === status) return;
    prevStatusRef.current = status;
    if (status === 'approval' || status === 'error') setOpen(true);
  }, [status, setOpen]);

  const ctx = React.useMemo<ToolCallContextValue>(
    () => ({
      name,
      status,
      input,
      output,
      error,
      durationMs,
      labels: {
        ...DEFAULT_LABELS,
        ...labels,
        status: { ...DEFAULT_LABELS.status, ...labels?.status },
      },
      onApprove,
      onDeny,
    }),
    [name, status, input, output, error, durationMs, labels, onApprove, onDeny],
  );

  return (
    <ToolCallContext.Provider value={ctx}>
      <Collapsible
        data-slot="tool-call"
        data-status={status}
        // Approval can't hide behind a closed panel.
        open={status === 'approval' || open}
        onOpenChange={setOpen}
        className={cn(
          'w-full overflow-hidden rounded-lg border border-border bg-card text-card-foreground data-[status=approval]:border-warning/50',
          className,
        )}
        {...props}
      >
        {children ?? (
          <>
            <ToolCallTrigger />
            <ToolCallContent />
          </>
        )}
      </Collapsible>
    </ToolCallContext.Provider>
  );
};

const formatDuration = (ms: number) => (ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(1)}s`);

const ToolCallTrigger = ({ className, ...props }: React.ComponentProps<'button'>) => {
  const { name, status, durationMs, labels } = useToolCall();
  const { icon: Icon, className: iconClass } = STATUS_ICON[status];

  return (
    <CollapsibleTrigger asChild>
      <button
        type="button"
        data-slot="tool-call-trigger"
        disabled={status === 'approval'}
        className={cn(
          'group/tool flex w-full items-center gap-2.5 px-3 py-2.5 text-start text-sm outline-none hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset disabled:hover:bg-transparent',
          className,
        )}
        {...props}
      >
        <Wrench aria-hidden className="size-4 shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1 truncate font-medium">{name}</span>
        {durationMs !== undefined && status === 'done' && (
          <span className="text-xs text-muted-foreground tabular-nums">{formatDuration(durationMs)}</span>
        )}
        <Badge variant="outline" className="gap-1">
          <Icon aria-hidden className={cn('size-3', iconClass)} />
          {labels.status[status]}
        </Badge>
        {status !== 'approval' && (
          <ChevronDown
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground transition-transform group-aria-expanded/tool:rotate-180 motion-reduce:transition-none"
          />
        )}
      </button>
    </CollapsibleTrigger>
  );
};

const toText = (value: unknown) => {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

export interface ToolCallSectionProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: React.ReactNode;
  /** Shown as formatted JSON when it is not a string. */
  value: unknown;
  tone?: 'default' | 'destructive';
}

const ToolCallSection = ({ title, value, tone = 'default', className, ...props }: ToolCallSectionProps) => {
  return (
    <div data-slot="tool-call-section" className={cn('grid gap-1.5', className)} {...props}>
      <span className="text-xs font-medium text-muted-foreground">{title}</span>
      <pre
        dir="ltr"
        className={cn(
          'max-h-64 overflow-auto rounded-md bg-muted/60 p-2.5 text-xs leading-relaxed break-words whitespace-pre-wrap',
          tone === 'destructive' && 'bg-destructive/10 text-destructive',
        )}
      >
        {toText(value)}
      </pre>
    </div>
  );
};

const ToolCallContent = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  const { status, input, output, error, labels, onApprove, onDeny } = useToolCall();

  return (
    <CollapsibleContent>
      <div data-slot="tool-call-content" className={cn('grid gap-3 border-t border-border p-3', className)} {...props}>
        {children ?? (
          <>
            {input !== undefined && <ToolCallSection title={labels.input} value={input} />}
            {status === 'done' && output !== undefined && <ToolCallSection title={labels.output} value={output} />}
            {status === 'error' && error !== undefined && (
              <ToolCallSection title={labels.error} value={error} tone="destructive" />
            )}
            {status === 'approval' && (
              <div
                data-slot="tool-call-approval"
                className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-warning/10 p-2.5"
              >
                <p className="text-sm">{labels.approvalPrompt}</p>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={onDeny}>
                    {labels.deny}
                  </Button>
                  <Button type="button" size="sm" onClick={onApprove}>
                    {labels.approve}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </CollapsibleContent>
  );
};

export { ToolCall, ToolCallTrigger, ToolCallContent, ToolCallSection, useToolCall };
