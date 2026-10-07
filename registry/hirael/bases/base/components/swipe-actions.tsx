'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { composeRefs } from '@/registry/hirael/lib/compose-refs';

type Side = 'start' | 'end';

interface SwipeActionsContextValue {
  open: Side | null;
  setOpen: (side: Side | null) => void;
  widths: Record<Side, number>;
  setWidth: (side: Side, width: number) => void;
}

const SwipeActionsContext = React.createContext<SwipeActionsContextValue | null>(null);

const useSwipeActions = () => {
  const ctx = React.useContext(SwipeActionsContext);
  if (!ctx) {
    throw new Error('SwipeActions compound parts must be used inside <SwipeActions>');
  }

  return ctx;
};

export interface SwipeActionsProps extends React.ComponentProps<'div'> {
  /** Called when the row opens or closes, with the side whose actions show. */
  onOpenChange?: (side: Side | null) => void;
}

/** A list row that slides aside to reveal actions, like archive or delete in a mail app. */
const SwipeActions = ({ onOpenChange, className, ...props }: SwipeActionsProps) => {
  const [open, setOpenState] = React.useState<Side | null>(null);
  const [widths, setWidths] = React.useState<Record<Side, number>>({ start: 0, end: 0 });

  const setOpen = React.useCallback(
    (side: Side | null) => {
      setOpenState(side);
      onOpenChange?.(side);
    },
    [onOpenChange],
  );

  const setWidth = React.useCallback(
    (side: Side, width: number) => setWidths((prev) => (prev[side] === width ? prev : { ...prev, [side]: width })),
    [],
  );

  const ctx = React.useMemo(() => ({ open, setOpen, widths, setWidth }), [open, setOpen, widths, setWidth]);

  return (
    <SwipeActionsContext.Provider value={ctx}>
      <div
        data-slot="swipe-actions"
        data-open={open ?? undefined}
        className={cn('relative overflow-hidden', className)}
        // Closes when focus or a tap lands outside the row.
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(null);
        }}
        {...props}
      />
    </SwipeActionsContext.Provider>
  );
};

/** The row itself. It slides over the action groups and follows the finger or mouse. */
const SwipeActionsContent = ({
  ref,
  className,
  style,
  onPointerDown,
  onClickCapture,
  ...props
}: React.ComponentProps<'div'>) => {
  const { open, setOpen, widths } = useSwipeActions();
  const [drag, setDrag] = React.useState<number | null>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const composedRef = React.useMemo(() => composeRefs(contentRef, ref), [ref]);
  // The click that ends a drag must not count as a tap on the row.
  const draggedRef = React.useRef(false);
  const [rtl, setRtl] = React.useState(false);

  React.useLayoutEffect(() => {
    if (contentRef.current) setRtl(getComputedStyle(contentRef.current).direction === 'rtl');
  }, []);

  // Offset along the reading direction: positive reveals the start actions.
  const resting = open === 'start' ? widths.start : open === 'end' ? -widths.end : 0;
  const offset = drag ?? resting;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);
    if (event.defaultPrevented || event.button !== 0) return;
    const originX = event.clientX;
    const originY = event.clientY;
    const startOffset = resting;
    const dir = rtl ? -1 : 1;
    let dragging = false;
    let latest = startOffset;

    const onMove = (move: PointerEvent) => {
      const dx = (move.clientX - originX) * dir;
      const dy = move.clientY - originY;
      if (!dragging) {
        // Vertical movement belongs to the page scroll.
        if (Math.abs(dy) > Math.abs(dx) || Math.abs(dx) < 6) return;
        dragging = true;
      }
      const max = widths.start;
      const min = -widths.end;
      const raw = startOffset + dx;
      // Past the actions the row resists, so it feels anchored.
      latest = raw > max ? max + (raw - max) * 0.2 : raw < min ? min + (raw - min) * 0.2 : raw;
      setDrag(latest);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (!dragging) return;
      draggedRef.current = true;
      window.setTimeout(() => {
        draggedRef.current = false;
      });
      setDrag(null);
      if (latest > widths.start / 2) setOpen('start');
      else if (latest < -widths.end / 2) setOpen('end');
      else setOpen(null);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    onClickCapture?.(event);
    if (draggedRef.current) {
      draggedRef.current = false;
      event.preventDefault();
      event.stopPropagation();

      return;
    }
    // A tap on an open row closes it instead of activating what is under the finger.
    if (open) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(null);
    }
  };

  return (
    <div
      ref={composedRef}
      data-slot="swipe-actions-content"
      onPointerDown={handlePointerDown}
      onClickCapture={handleClickCapture}
      className={cn(
        'relative z-10 touch-pan-y bg-background',
        drag === null && 'transition-transform duration-200 ease-out motion-reduce:transition-none',
        className,
      )}
      style={{ ...style, transform: `translateX(${offset * (rtl ? -1 : 1)}px)` }}
      {...props}
    />
  );
};

export interface SwipeActionsGroupProps extends React.ComponentProps<'div'> {
  /** `start` actions show when the row slides toward the end, `end` actions when it slides toward the start. */
  side: Side;
}

/** The buttons hidden behind one edge of the row. */
const SwipeActionsGroup = ({ side, className, onFocus, ...props }: SwipeActionsGroupProps) => {
  const { setWidth, setOpen, open } = useSwipeActions();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setWidth(side, el.offsetWidth));
    observer.observe(el);

    return () => {
      observer.disconnect();
      setWidth(side, 0);
    };
  }, [side, setWidth]);

  return (
    <div
      ref={ref}
      data-slot="swipe-actions-group"
      data-side={side}
      // Tabbing onto a hidden action slides it into view.
      onFocus={(event) => {
        onFocus?.(event);
        if (open !== side) setOpen(side);
      }}
      className={cn('absolute inset-y-0 flex', side === 'start' ? 'start-0' : 'end-0', className)}
      {...props}
    />
  );
};

export type SwipeActionTone = 'default' | 'primary' | 'destructive' | 'warning' | 'success';

// Destructive uses the same pairing as shadcn's destructive Button, so it matches the rest of the app.
const TONE_CLASS: Record<SwipeActionTone, string> = {
  default: 'bg-muted text-foreground',
  primary: 'bg-primary text-primary-foreground',
  destructive: 'bg-destructive text-white dark:bg-destructive/60',
  warning: 'bg-warning text-background',
  success: 'bg-success text-background',
};

export interface SwipeActionProps extends React.ComponentProps<'button'> {
  tone?: SwipeActionTone;
  icon?: React.ReactNode;
}

/** One action button. Closes the row after it runs. */
const SwipeAction = ({ tone = 'default', icon, className, children, onClick, ...props }: SwipeActionProps) => {
  const { setOpen } = useSwipeActions();

  return (
    <button
      type="button"
      data-slot="swipe-action"
      onClick={(event) => {
        onClick?.(event);
        setOpen(null);
      }}
      className={cn(
        'flex w-20 flex-col items-center justify-center gap-1 text-xs font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset [&_svg]:size-5',
        TONE_CLASS[tone],
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};

export { SwipeActions, SwipeActionsContent, SwipeActionsGroup, SwipeAction, useSwipeActions };
