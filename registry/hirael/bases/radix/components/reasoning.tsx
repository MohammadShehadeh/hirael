'use client';

import * as React from 'react';
import { Brain, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/registry/hirael/bases/radix/ui/collapsible';
import { TextShimmer } from '@/registry/hirael/bases/radix/components/text-shimmer';

export interface ReasoningLabels {
  /** While the model is still thinking. */
  thinking: string;
  /** Once done, with the time taken in whole seconds. */
  thought: (seconds: number) => string;
}

const DEFAULT_LABELS: ReasoningLabels = {
  thinking: 'Thinking',
  thought: (seconds) => (seconds < 1 ? 'Thought for a moment' : `Thought for ${seconds}s`),
};

interface ReasoningContextValue {
  streaming: boolean;
  open: boolean;
  seconds: number | null;
  labels: ReasoningLabels;
}

const ReasoningContext = React.createContext<ReasoningContextValue | null>(null);

const useReasoning = () => {
  const ctx = React.useContext(ReasoningContext);
  if (!ctx) {
    throw new Error('Reasoning compound parts must be used inside <Reasoning>');
  }

  return ctx;
};

export interface ReasoningProps extends Omit<
  React.ComponentProps<typeof Collapsible>,
  'open' | 'defaultOpen' | 'onOpenChange'
> {
  /** The model is still producing reasoning. Opens the panel and starts the timer. */
  streaming?: boolean;
  /** Seconds spent thinking, when your API reports it. Otherwise it is timed from `streaming`. */
  duration?: number;
  /** Controls the panel yourself. Leave out to open it while thinking and close it after. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Close the panel this many milliseconds after thinking ends. Set to `false` to leave it open. */
  autoClose?: number | false;
  labels?: Partial<ReasoningLabels>;
}

const Reasoning = ({
  streaming = false,
  duration,
  open: openProp,
  defaultOpen,
  onOpenChange,
  autoClose = 1000,
  labels,
  className,
  children,
  ...props
}: ReasoningProps) => {
  // `null` follows the stream: open while thinking, then closed. A click takes over until the next stream.
  const [manual, setManual] = React.useState<boolean | null>(defaultOpen ?? null);
  const [lingering, setLingering] = React.useState(false);
  const [measured, setMeasured] = React.useState<number | null>(null);
  const [prevStreaming, setPrevStreaming] = React.useState(streaming);
  if (prevStreaming !== streaming) {
    setPrevStreaming(streaming);
    setManual(null);
    setLingering(!streaming);
  }

  // Times the stream itself, so the label works without a duration from the API.
  React.useEffect(() => {
    if (!streaming) return;
    const startedAt = Date.now();

    return () => setMeasured(Math.round((Date.now() - startedAt) / 1000));
  }, [streaming]);

  React.useEffect(() => {
    if (!lingering || autoClose === false) return;
    const id = window.setTimeout(() => setLingering(false), autoClose);

    return () => window.clearTimeout(id);
  }, [lingering, autoClose]);

  const open = openProp ?? manual ?? (streaming || lingering);

  const ctx = React.useMemo<ReasoningContextValue>(
    () => ({
      streaming,
      open,
      seconds: duration ?? measured,
      labels: { ...DEFAULT_LABELS, ...labels },
    }),
    [streaming, open, duration, measured, labels],
  );

  return (
    <ReasoningContext.Provider value={ctx}>
      <Collapsible
        data-slot="reasoning"
        data-streaming={streaming || undefined}
        open={open}
        onOpenChange={(next) => {
          setManual(next);
          onOpenChange?.(next);
        }}
        className={cn('flex w-full flex-col gap-2', className)}
        {...props}
      >
        {children}
      </Collapsible>
    </ReasoningContext.Provider>
  );
};

const ReasoningTrigger = ({ className, children, ...props }: React.ComponentProps<'button'>) => {
  const { streaming, open, seconds, labels } = useReasoning();

  return (
    <CollapsibleTrigger asChild>
      <button
        type="button"
        data-slot="reasoning-trigger"
        className={cn(
          'inline-flex w-fit items-center gap-1.5 rounded-md text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50',
          className,
        )}
        {...props}
      >
        <Brain aria-hidden className="size-4" />
        {children ??
          (streaming ? (
            <TextShimmer>{labels.thinking}</TextShimmer>
          ) : (
            <span>{seconds === null ? labels.thinking : labels.thought(seconds)}</span>
          ))}
        <ChevronDown
          aria-hidden
          className={cn('size-4 transition-transform motion-reduce:transition-none', open && 'rotate-180')}
        />
      </button>
    </CollapsibleTrigger>
  );
};

const ReasoningContent = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  return (
    <CollapsibleContent>
      <div
        data-slot="reasoning-content"
        className={cn(
          'ms-2 border-s-2 border-border ps-4 text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContent>
  );
};

export { Reasoning, ReasoningTrigger, ReasoningContent, useReasoning };
