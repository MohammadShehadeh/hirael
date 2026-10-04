'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useControllableState } from '@/registry/hirael/hooks/use-controllable-state';

interface ExpandableTextContextValue {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  overflowing: boolean;
  setOverflowing: (overflowing: boolean) => void;
  lines: number;
  contentId: string;
}

const ExpandableTextContext = React.createContext<ExpandableTextContextValue | null>(null);

const useExpandableText = () => {
  const ctx = React.useContext(ExpandableTextContext);
  if (!ctx) {
    throw new Error('ExpandableText compound parts must be used inside <ExpandableText>');
  }

  return ctx;
};

export interface ExpandableTextProps extends React.ComponentProps<'div'> {
  /** Lines shown while collapsed. */
  lines?: number;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

const ExpandableText = ({
  lines = 3,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  className,
  ...props
}: ExpandableTextProps) => {
  const [expanded, setExpanded] = useControllableState({
    prop: expandedProp,
    defaultProp: defaultExpanded,
    onChange: onExpandedChange,
  });
  const [overflowing, setOverflowing] = React.useState(false);
  const contentId = React.useId();

  const ctx = React.useMemo<ExpandableTextContextValue>(
    () => ({ expanded, setExpanded, overflowing, setOverflowing, lines, contentId }),
    [expanded, setExpanded, overflowing, lines, contentId],
  );

  return (
    <ExpandableTextContext.Provider value={ctx}>
      <div
        data-slot="expandable-text"
        data-expanded={expanded || undefined}
        className={cn('grid justify-items-start gap-1.5', className)}
        {...props}
      />
    </ExpandableTextContext.Provider>
  );
};

const ExpandableTextContent = ({ className, style, ...props }: React.ComponentProps<'div'>) => {
  const { expanded, lines, setOverflowing, contentId } = useExpandableText();
  const ref = React.useRef<HTMLDivElement>(null);

  // Measured while clamped only: once expanded, scrollHeight equals clientHeight and would hide the toggle.
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;
    const measure = () => setOverflowing(el.scrollHeight - el.clientHeight > 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);

    return () => observer.disconnect();
  }, [expanded, lines, setOverflowing, props.children]);

  return (
    <div
      ref={ref}
      id={contentId}
      data-slot="expandable-text-content"
      className={cn('text-sm leading-relaxed text-pretty', !expanded && 'overflow-hidden', className)}
      style={
        expanded ? style : { display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: lines, ...style }
      }
      {...props}
    />
  );
};

export interface ExpandableTextTriggerProps extends Omit<React.ComponentProps<'button'>, 'children'> {
  /** Label while collapsed. */
  moreLabel?: React.ReactNode;
  /** Label while expanded. */
  lessLabel?: React.ReactNode;
}

/** Renders nothing when the text fits, so short copy never gets a dead toggle. */
const ExpandableTextTrigger = ({
  moreLabel = 'Show more',
  lessLabel = 'Show less',
  className,
  onClick,
  ...props
}: ExpandableTextTriggerProps) => {
  const { expanded, setExpanded, overflowing, contentId } = useExpandableText();
  if (!overflowing && !expanded) return null;

  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={contentId}
      data-slot="expandable-text-trigger"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setExpanded(!expanded);
      }}
      className={cn(
        'inline-flex items-center gap-1 rounded-sm text-sm font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50',
        className,
      )}
      {...props}
    >
      {expanded ? lessLabel : moreLabel}
      <ChevronDown aria-hidden className={cn('size-4 transition-transform', expanded && 'rotate-180')} />
    </button>
  );
};

export { ExpandableText, ExpandableTextContent, ExpandableTextTrigger, useExpandableText };
